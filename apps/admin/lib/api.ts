import { API_BASE_URL } from './constants';

const ADMIN_AUTH_KEY = 'ehcc_admin_auth';

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(ADMIN_AUTH_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored).accessToken;
  } catch {
    return null;
  }
}

export function getAdminUser(): any | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(ADMIN_AUTH_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored).user;
  } catch {
    return null;
  }
}

export function saveAdminAuth(data: { user: any; accessToken: string; refreshToken: string }) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(data));
  }
}

export function clearAdminAuth() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADMIN_AUTH_KEY);
  }
}

export async function adminFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  return fetch(`${API_BASE_URL}${path}`, { ...options, headers });
}

async function throwApiError(res: Response): Promise<never> {
  let message = `API error: ${res.status}`;
  try {
    const body = await res.json();
    if (body.message) message = body.message;
  } catch {}
  throw new Error(message);
}

export async function adminGet<T>(path: string): Promise<T> {
  const res = await adminFetch(path);
  if (!res.ok) await throwApiError(res);
  return res.json();
}

export async function adminPost<T>(path: string, body?: any): Promise<T> {
  const res = await adminFetch(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) await throwApiError(res);
  return res.json();
}

export async function adminPatch<T>(path: string, body?: any): Promise<T> {
  const res = await adminFetch(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) await throwApiError(res);
  return res.json();
}

export async function adminDelete(path: string): Promise<void> {
  const res = await adminFetch(path, { method: 'DELETE' });
  if (!res.ok) await throwApiError(res);
}
