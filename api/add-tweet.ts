import type { VercelRequest, VercelResponse } from '@vercel/node';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_REPO = process.env.GITHUB_REPO!; // e.g. "kv-chiu/tweet-site"
const TWEETS_FILE = 'public/tweets.json';
const API_SECRET = process.env.API_SECRET!; // simple auth for the bookmarklet

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
  // CORS for bookmarklet
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse body (supports both application/json and text/plain)
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  // Auth check via body (avoids CORS preflight from Authorization header)
  const { secret, tweet } = body;
  if (secret !== API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!tweet || typeof tweet !== 'string') {
    return res.status(400).json({ error: 'Missing tweet ID or URL' });
  }

  const tweetId = parseTweetId(tweet);

  try {
    // Get current file from GitHub
    const [owner, repo] = GITHUB_REPO.split('/');
    const fileData = await githubApi(
      `/repos/${owner}/${repo}/contents/${TWEETS_FILE}`,
    );

    const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const tweets: string[] = JSON.parse(content);

    // Check duplicate
    if (tweets.includes(tweetId)) {
      return res.status(200).json({ message: 'Already exists', tweetId });
    }

    // Prepend new tweet (newest first)
    tweets.unshift(tweetId);

    // Commit back to GitHub
    const newContent = Buffer.from(
      JSON.stringify(tweets, null, 2) + '\n',
    ).toString('base64');

    await githubApi(`/repos/${owner}/${repo}/contents/${TWEETS_FILE}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `feat: add tweet ${tweetId}`,
        content: newContent,
        sha: fileData.sha,
      }),
    });

    return res.status(200).json({ message: 'Added', tweetId });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}
