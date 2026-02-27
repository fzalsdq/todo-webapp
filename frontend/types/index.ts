// Task: P2-T-009
// Spec: specs/implementation-plan.md §2.3
// Plan: specs/ui/components.md

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  limit: number;
  offset: number;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface AuthSession {
  user: User;
  token: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
}
