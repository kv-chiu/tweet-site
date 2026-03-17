/**
 * Extract tweet ID from a URL or return the ID as-is.
 * Supports: https://twitter.com/user/status/123, https://x.com/user/status/123, or plain "123"
 */
export function parseTweetId(input: string): string {
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
