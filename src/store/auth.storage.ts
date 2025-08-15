type Tokens = { accessToken: string; refreshToken: string; user: any };

const KEY = 'cleanapp_tokens';

export function getTokens(): Tokens | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function setTokens(t: Tokens) {
  localStorage.setItem(KEY, JSON.stringify(t));
}

export function clearTokens() {
  localStorage.removeItem(KEY);
}
