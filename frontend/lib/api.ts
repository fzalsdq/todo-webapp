// Task: P2-T-010
// Spec: specs/implementation-plan.md §2.4
// Plan: specs/architecture.md

import { Task, TaskCreate, TaskUpdate, TaskListResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Fetch wrapper with automatic JWT token injection
 */
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token');

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || response.statusText);
  }

  return response.json();
}

/**
 * API client for all backend communication
 */
export const api = {
  // ==================== Tasks ====================

  /**
   * Get all tasks for a user
   */
  async getTasks(userId: string, status?: string): Promise<TaskListResponse> {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    return fetchWithAuth<TaskListResponse>(`/api/${userId}/tasks?${params}`);
  },

  /**
   * Get a specific task by ID
   */
  async getTask(userId: string, taskId: number): Promise<Task> {
    return fetchWithAuth<Task>(`/api/${userId}/tasks/${taskId}`);
  },

  /**
   * Create a new task
   */
  async createTask(userId: string, data: TaskCreate): Promise<Task> {
    return fetchWithAuth<Task>(`/api/${userId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update an existing task
   */
  async updateTask(userId: string, taskId: number, data: TaskUpdate): Promise<Task> {
    return fetchWithAuth<Task>(`/api/${userId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a task
   */
  async deleteTask(userId: string, taskId: number): Promise<void> {
    return fetchWithAuth<void>(`/api/${userId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Toggle task completion status
   */
  async toggleTaskComplete(userId: string, taskId: number): Promise<Task> {
    return fetchWithAuth<Task>(`/api/${userId}/tasks/${taskId}/complete`, {
      method: 'PATCH',
    });
  },

  // ==================== Authentication ====================

  /**
   * Sign in with email and password
   * Note: This is a simplified auth - in production use Better Auth SDK
   */
  async signIn(email: string, password: string): Promise<{ token: string; user: { id: string; email: string; name: string | null } }> {
    // For Phase II, we're using a simplified auth flow
    // In production, integrate with Better Auth SDK
    const response = await fetch(`${API_URL}/api/auth/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Sign in failed' }));
      throw new Error(error.detail || 'Sign in failed');
    }

    return response.json();
  },

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, name?: string): Promise<{ token: string; user: { id: string; email: string; name: string | null } }> {
    const response = await fetch(`${API_URL}/api/auth/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Sign up failed' }));
      throw new Error(error.detail || 'Sign up failed');
    }

    return response.json();
  },

  /**
   * Sign out (client-side only - token is cleared)
   */
  async signOut(): Promise<void> {
    // Clear local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  /**
   * Get current session
   */
  async getSession(): Promise<{ user: { id: string; email: string; name: string | null } } | null> {
    try {
      const response = await fetchWithAuth<{ user: { id: string; email: string; name: string | null } }>('/api/auth/session');
      return response;
    } catch {
      return null;
    }
  },
};
