import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_SECRET = process.env.API_SECRET!;

export function parseBody(req: VercelRequest): Record<string, unknown> {
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  return body ?? {};
}

/**
 * Sets CORS headers, handles OPTIONS/method check, parses body, and verifies secret.
 * Returns the parsed body on success, or null if the request was already handled (error/OPTIONS).
 */
export function authorize(
  req: VercelRequest,
  res: VercelResponse,
): Record<string, unknown> | null {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return null; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return null; }

  const body = parseBody(req);
  if (body.secret !== API_SECRET) { res.status(401).json({ error: 'Unauthorized' }); return null; }

  return body;
}
