import { API_BASE_URL } from './constants';

export interface AuthUser {
  id: number;
  eaNumber: string | null;
  name: string;
  email: string | null;
  phoneNumber: string | null;
  avatarUrl: string | null;
  role: string;
  passwordSet: boolean;
  branchId: number | null;
}

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

interface CheckResponse {
  exists: boolean;
  passwordSet: boolean;
  name: string | null;
}

const AUTH_KEY = 'ehcc_auth';

export async function checkIdentifier(identifier: string): Promise<CheckResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier }),
  });
  if (!res.ok) throw new Error('Failed to check identifier');
  return res.json();
}

export async function login(identifier: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }
  saveAuth(data);
  return data;
}

export async function setPassword(identifier: string, password: string, email?: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/set-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password, email }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to set password');
  }
  saveAuth(data);
  return data;
}

export function saveAuth(data: AuthResponse) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  }
}

export function getAuth(): AuthResponse | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function getUser(): AuthUser | null {
  return getAuth()?.user || null;
}

export function getToken(): string | null {
  return getAuth()?.accessToken || null;
}

export function isLoggedIn(): boolean {
  return !!getAuth()?.accessToken;
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = '/login';
  }
}
