const TWEET_URL_PATTERN =
  /^https?:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/\w+\/status\/(\d+)/i;

export function parseTweetUrl(url: string): { valid: true; statusId: string } | { valid: false } {
  const trimmed = url.trim();
  const match = TWEET_URL_PATTERN.exec(trimmed);
  if (!match) return { valid: false };
  return { valid: true, statusId: match[1] };
}

export function normalizeTweetUrl(url: string): string {
  const parsed = parseTweetUrl(url);
  if (!parsed.valid) return url.trim();
  return `https://x.com/i/status/${parsed.statusId}`;
}
