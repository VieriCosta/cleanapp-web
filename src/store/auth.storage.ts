const UKEY = "auth_user";
const TKEY = "auth_tokens";

export function getUser() {
  const raw = localStorage.getItem(UKEY);
  return raw ? JSON.parse(raw) : null;
}
export function setUser(u: any) {
  localStorage.setItem(UKEY, JSON.stringify(u));
}
export function clearUser() {
  localStorage.removeItem(UKEY);
}

export function getTokens() {
  const raw = localStorage.getItem(TKEY);
  return raw ? JSON.parse(raw) : null;
}
export function setTokens(t: any) {
  localStorage.setItem(TKEY, JSON.stringify(t));
}
export function clearTokens() {
  localStorage.removeItem(TKEY);
}
