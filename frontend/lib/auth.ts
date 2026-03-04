// Task: P2-T-011
// Spec: specs/implementation-plan.md §2.5
// Plan: specs/features/authentication.md

import { User } from '@/types';

function getLocalStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export function getAuthState(): AuthState {
  const storage = getLocalStorage();
  if (!storage) {
    return { user: null, token: null, isAuthenticated: false };
  }
  const token = storage.getItem('auth_token');
  const userStr = storage.getItem('user');
  if (!token || !userStr) {
    return { user: null, token: null, isAuthenticated: false };
  }
  try {
    const user: User = JSON.parse(userStr);
    return { user, token, isAuthenticated: true };
  } catch {
    return { user: null, token: null, isAuthenticated: false };
  }
}

export function setAuthState(token: string, user: User): void {
  const storage = getLocalStorage();
  if (storage) {
    storage.setItem('auth_token', token);
    storage.setItem('user', JSON.stringify(user));
  }
}

export function clearAuthState(): void {
  const storage = getLocalStorage();
  if (storage) {
    storage.removeItem('auth_token');
    storage.removeItem('user');
  }
}

export function getToken(): string | null {
  const storage = getLocalStorage();
  if (!storage) return null;
  return storage.getItem('auth_token');
}

export function getUser(): User | null {
  const storage = getLocalStorage();
  if (!storage) return null;
  const userStr = storage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  const { isAuthenticated } = getAuthState();
  return isAuthenticated;
}
