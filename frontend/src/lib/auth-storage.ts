const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const ACTIVE_ROLE_KEY = 'activeRole';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ACTIVE_ROLE_KEY);
}

export function getActiveRole(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_ROLE_KEY);
}

export function setActiveRole(role: string) {
  localStorage.setItem(ACTIVE_ROLE_KEY, role);
}

export function clearActiveRole() {
  localStorage.removeItem(ACTIVE_ROLE_KEY);
}
