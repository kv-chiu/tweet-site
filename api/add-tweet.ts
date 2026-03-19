import type { VercelRequest, VercelResponse } from '@vercel/node';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_REPO = process.env.GITHUB_REPO!; // e.g. "kv-chiu/tweet-site"
const DATA_FILE = 'public/data.json';
const API_SECRET = process.env.API_SECRET!;

async function githubApi(path: string, options: RequestInit = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body}`);
  }
  return res.json();
}

function parseTweetId(input: string): string {
  const trimmed = input.trim();
  if (/^\d+$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const parts = url.pathname.split('/');
    const statusIdx = parts.indexOf('status');
    if (statusIdx !== -1 && parts[statusIdx + 1]) {
      return parts[statusIdx + 1];
    }
  } catch {
    // not a URL
  }

  return trimmed;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const { secret, tweet, action = 'add', type = 'tweet' } = body;
  if (secret !== API_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  if (!tweet || typeof tweet !== 'string') return res.status(400).json({ error: 'Missing ID or URL' });
  if (action !== 'add' && action !== 'remove') return res.status(400).json({ error: 'Invalid action' });
  if (type !== 'tweet' && type !== 'instagram') return res.status(400).json({ error: 'Invalid type' });

  const itemId = type === 'tweet' ? parseTweetId(tweet) : tweet.trim();

  try {
    const [owner, repo] = GITHUB_REPO.split('/');
    const fileData = await githubApi(`/repos/${owner}/${repo}/contents/${DATA_FILE}`);
    const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const items: { type: string; id: string }[] = JSON.parse(content);

    let message: string;

    if (action === 'add') {
      if (items.some((item) => item.id === itemId && item.type === type)) {
        return res.status(200).json({ message: 'Already exists', id: itemId, type });
      }
      items.unshift({ type, id: itemId });
      message = `feat: add ${type} ${itemId}`;
    } else {
      const idx = items.findIndex((item) => item.id === itemId && item.type === type);
      if (idx === -1) {
        return res.status(200).json({ message: 'Not found', id: itemId, type });
      }
      items.splice(idx, 1);
      message = `feat: remove ${type} ${itemId}`;
    }

    const newContent = Buffer.from(
      JSON.stringify(items, null, 2) + '\n',
    ).toString('base64');

    await githubApi(`/repos/${owner}/${repo}/contents/${DATA_FILE}`, {
      method: 'PUT',
      body: JSON.stringify({ message, content: newContent, sha: fileData.sha }),
    });

    return res.status(200).json({
      message: action === 'add' ? 'Added' : 'Removed',
      id: itemId,
      type,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ error: msg });
  }
}
