/**
 * Auth token storage. Decision: localStorage (simple, survives refresh).
 * Trade-off: readable by XSS — acceptable for the low-threat internal-admin
 * model. To harden later, swap this module for in-memory + httpOnly refresh
 * cookie; nothing else in the app touches storage directly.
 */
const TOKEN_KEY = 'auth.accessToken';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
