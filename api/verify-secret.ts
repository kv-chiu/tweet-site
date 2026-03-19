import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authorize } from './_auth';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const body = authorize(req, res);
  if (!body) return;
  return res.status(200).json({ ok: true });
}
