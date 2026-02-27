// Task: P2-T-012
// Spec: specs/implementation-plan.md §2.7
// Plan: specs/ui/components.md

import { useState, useCallback } from 'react';
import { Task, TaskCreate, TaskUpdate } from '@/types';
import { api } from '@/lib/api';
import { getUser } from '@/lib/auth';

/**
 * Custom hook for task management
 * Provides CRUD operations and state management for tasks
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = getUser();
  const userId = user?.id;

  /**
   * Fetch all tasks for current user
   */
  const fetchTasks = useCallback(async (status?: string) => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.getTasks(userId, status);
      setTasks(response.tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Add a new task
   */
  const addTask = useCallback(async (data: TaskCreate) => {
    if (!userId) throw new Error('Not authenticated');

    const task = await api.createTask(userId, data);
    setTasks((prev) => [task, ...prev]);
    return task;
  }, [userId]);

  /**
   * Update an existing task
   */
  const updateTask = useCallback(async (taskId: number, data: TaskUpdate) => {
    if (!userId) throw new Error('Not authenticated');

    const task = await api.updateTask(userId, taskId, data);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? task : t)));
    return task;
  }, [userId]);

  /**
   * Delete a task
   */
  const deleteTask = useCallback(async (taskId: number) => {
    if (!userId) throw new Error('Not authenticated');

    await api.deleteTask(userId, taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, [userId]);

  /**
   * Toggle task completion status
   */
  const toggleComplete = useCallback(async (taskId: number) => {
    if (!userId) throw new Error('Not authenticated');

    const task = await api.toggleTaskComplete(userId, taskId);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? task : t)));
    return task;
  }, [userId]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
  };
}

/**
 * Custom hook for authentication
 */
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.signIn(email, password);
      // Token and user are stored in localStorage by the API client
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.signUp(email, password, name);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await api.signOut();
    window.location.href = '/signin';
  }, []);

  return {
    loading,
    error,
    signIn,
    signUp,
    signOut,
  };
}
