import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './auth-storage';
import { normalizeApiError } from './errors';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

function redirectToLogin() {
  clearTokens();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  isRetry?: boolean;
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let body: BodyInit | undefined;
  if (opts.body instanceof FormData) {
    body = opts.body;
  } else if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.body);
  }

  const res = await fetch(`${API_URL}${path}`, {
    method: opts.method || 'GET',
    headers,
    body,
  });

  if (res.status === 401 && !opts.isRetry && token) {
    if (!refreshPromise) {
      refreshPromise = refreshTokens().finally(() => {
        refreshPromise = null;
      });
    }
    const refreshed = await refreshPromise;
    if (refreshed) {
      return request<T>(path, { ...opts, isRetry: true });
    }
    redirectToLogin();
    throw normalizeApiError(401, { message: 'Session expired' });
  }

  const data = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    throw normalizeApiError(res.status, data);
  }

  return data as T;
}

export const apiGet = <T>(path: string) => request<T>(path);
export const apiPost = <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body });
export const apiPatch = <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body });
export const apiDelete = <T>(path: string) => request<T>(path, { method: 'DELETE' });
export const apiUpload = <T>(path: string, formData: FormData) => request<T>(path, { method: 'POST', body: formData });
