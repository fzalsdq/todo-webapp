// Task: P2-T-011
// Spec: specs/implementation-plan.md §2.5
// Plan: specs/features/authentication.md

import { User } from '@/types';

/**
 * Get current authentication state from localStorage
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export function getAuthState(): AuthState {
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('user');

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

/**
 * Set authentication state in localStorage
 */
export function setAuthState(token: string, user: User): void {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Clear authentication state from localStorage
 */
export function clearAuthState(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
}

/**
 * Get current JWT token
 */
export function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

/**
 * Get current user from localStorage
 */
export function getUser(): User | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const { isAuthenticated } = getAuthState();
  return isAuthenticated;
}
