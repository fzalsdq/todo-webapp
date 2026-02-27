# Phase II Implementation Plan

## **Overview**

This document provides the complete technical implementation plan for Phase II: Full-Stack Web Application.

**Reference Specifications:**
- specs/overview.md
- specs/architecture.md
- specs/features/task-crud.md
- specs/features/authentication.md
- specs/api/rest-endpoints.md
- specs/database/schema.md
- specs/ui/components.md
- specs/ui/pages.md

---

## **Implementation Strategy**

We will implement in the following sequence:

1. **Backend Setup** - Project structure, dependencies, configuration
2. **Database Layer** - Models, connection, migrations
3. **Authentication** - JWT verification, Better Auth integration
4. **API Endpoints** - Task CRUD operations
5. **Frontend Setup** - Next.js project, configuration
6. **UI Components** - Reusable component library
7. **Pages** - Sign in, sign up, task list
8. **Integration** - Connect frontend to backend
9. **Testing** - Verify all features
10. **Documentation** - README, deployment guide

---

## **Backend Implementation**

### **1.1 Project Structure**

```
backend/
├── main.py                 # FastAPI application entry point
├── config.py               # Configuration and environment variables
├── db.py                   # Database connection and session management
├── models.py               # SQLModel database models
├── schemas.py              # Pydantic schemas for API
├── auth.py                 # JWT authentication and verification
├── crud/
│   ├── __init__.py
│   └── tasks.py            # Database CRUD operations
├── routes/
│   ├── __init__.py
│   └── tasks.py            # API route handlers
├── middleware/
│   └── auth.py             # Authentication middleware
├── alembic/                # Database migrations
│   ├── env.py
│   └── versions/
├── tests/
│   ├── __init__.py
│   ├── test_tasks.py
│   └── test_auth.py
├── .env                    # Environment variables (not committed)
├── .env.example            # Example environment variables
├── requirements.txt        # Python dependencies
└── README.md               # Backend documentation
```

### **1.2 Dependencies**

**File:** `backend/requirements.txt`

```
fastapi==0.109.0
uvicorn[standard]==0.27.0
sqlmodel==0.0.14
psycopg2-binary==2.9.9
python-jose[cryptography]==3.3.0
pydantic==2.5.3
pydantic-settings==2.1.0
python-dotenv==1.0.0
alembic==1.13.1
pytest==7.4.4
httpx==0.26.0
```

### **1.3 Configuration**

**File:** `backend/config.py`

```python
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Todo WebApp API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str
    
    # Authentication
    BETTER_AUTH_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION: int = 604800  # 7 days in seconds
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

### **1.4 Database Connection**

**File:** `backend/db.py`

```python
from sqlmodel import SQLModel, create_engine, Session
from typing import Generator
from config import settings

engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

def create_db_and_tables():
    """Create all database tables."""
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    """Dependency for database session."""
    session = Session(engine)
    try:
        yield session
    finally:
        session.close()
```

### **1.5 Models**

**File:** `backend/models.py`

```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class TaskBase(SQLModel):
    title: str = Field(max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)

class Task(TaskBase, table=True):
    __tablename__ = "tasks"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### **1.6 Schemas**

**File:** `backend/schemas.py`

```python
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

# Task Schemas
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)

class TaskResponse(BaseModel):
    id: int
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class TaskListResponse(BaseModel):
    tasks: List[TaskResponse]
    total: int
    limit: int
    offset: int

# Auth Schemas
class TokenPayload(BaseModel):
    sub: str  # user_id
    email: str
    name: Optional[str] = None
    exp: datetime
    iat: datetime
```

### **1.7 Authentication**

**File:** `backend/auth.py`

```python
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from datetime import datetime
from config import settings
from schemas import TokenPayload

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    """
    Verify JWT token and return user_id.
    """
    token = credentials.credentials
    
    try:
        payload = jwt.decode(
            token,
            settings.BETTER_AUTH_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
            options={"verify_exp": True}
        )
        return payload["sub"]
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

def verify_user_match(path_user_id: str, token_user_id: str) -> None:
    """
    Verify that the user ID in the path matches the token user ID.
    """
    if path_user_id != token_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User ID mismatch",
        )
```

### **1.8 CRUD Operations**

**File:** `backend/crud/tasks.py`

```python
from sqlmodel import Session, select
from typing import List, Optional
from models import Task
from schemas import TaskCreate, TaskUpdate

def create_task(session: Session, user_id: str, task_data: TaskCreate) -> Task:
    """Create a new task."""
    task = Task.from_orm(task_data, update={"user_id": user_id})
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

def get_tasks(
    session: Session,
    user_id: str,
    status_filter: str = "all",
    limit: int = 100,
    offset: int = 0
) -> List[Task]:
    """Get tasks for a user with optional filtering."""
    query = select(Task).where(Task.user_id == user_id)
    
    if status_filter == "pending":
        query = query.where(Task.completed == False)
    elif status_filter == "completed":
        query = query.where(Task.completed == True)
    
    query = query.offset(offset).limit(limit)
    results = session.exec(query)
    return results.all()

def get_task(session: Session, user_id: str, task_id: int) -> Optional[Task]:
    """Get a specific task by ID."""
    query = select(Task).where(
        Task.id == task_id,
        Task.user_id == user_id
    )
    return session.exec(query).first()

def update_task(
    session: Session,
    user_id: str,
    task_id: int,
    task_data: TaskUpdate
) -> Optional[Task]:
    """Update a task."""
    task = get_task(session, user_id, task_id)
    if not task:
        return None
    
    update_data = task_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)
    
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

def delete_task(session: Session, user_id: str, task_id: int) -> bool:
    """Delete a task."""
    task = get_task(session, user_id, task_id)
    if not task:
        return False
    
    session.delete(task)
    session.commit()
    return True

def toggle_complete(session: Session, user_id: str, task_id: int) -> Optional[Task]:
    """Toggle task completion status."""
    task = get_task(session, user_id, task_id)
    if not task:
        return None
    
    task.completed = not task.completed
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
```

### **1.9 API Routes**

**File:** `backend/routes/tasks.py`

```python
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session
from typing import List
from db import get_session
from auth import get_current_user, verify_user_match
from crud import tasks as crud
from schemas import (
    TaskCreate,
    TaskUpdate,
    TaskResponse,
    TaskListResponse,
)

router = APIRouter(prefix="/api", tags=["tasks"])

@router.get("/{user_id}/tasks", response_model=TaskListResponse)
def list_tasks(
    user_id: str,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session),
    status_filter: str = Query("all", alias="status"),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
):
    """List all tasks for the authenticated user."""
    verify_user_match(user_id, current_user_id)
    
    tasks = crud.get_tasks(session, user_id, status_filter, limit, offset)
    total = len(tasks)
    
    return TaskListResponse(
        tasks=tasks,
        total=total,
        limit=limit,
        offset=offset,
    )

@router.post("/{user_id}/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    user_id: str,
    task_data: TaskCreate,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Create a new task."""
    verify_user_match(user_id, current_user_id)
    return crud.create_task(session, user_id, task_data)

@router.get("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
def get_task(
    user_id: str,
    task_id: int,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Get a specific task by ID."""
    verify_user_match(user_id, current_user_id)
    task = crud.get_task(session, user_id, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return task

@router.put("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    user_id: str,
    task_id: int,
    task_data: TaskUpdate,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Update a task."""
    verify_user_match(user_id, current_user_id)
    task = crud.update_task(session, user_id, task_id, task_data)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return task

@router.delete("/{user_id}/tasks/{task_id}")
def delete_task(
    user_id: str,
    task_id: int,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Delete a task."""
    verify_user_match(user_id, current_user_id)
    success = crud.delete_task(session, user_id, task_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return {"message": "Task deleted successfully", "id": task_id}

@router.patch("/{user_id}/tasks/{task_id}/complete", response_model=TaskResponse)
def toggle_task_complete(
    user_id: str,
    task_id: int,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Toggle task completion status."""
    verify_user_match(user_id, current_user_id)
    task = crud.toggle_complete(session, user_id, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return task
```

### **1.10 Main Application**

**File:** `backend/main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from db import create_db_and_tables
from routes import tasks

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tasks.router)

# Health check endpoint
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": "2025-12-01T12:00:00Z",
        "version": settings.APP_VERSION,
    }

# Startup event
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "Todo WebApp API",
        "docs": "/docs",
        "health": "/health",
    }
```

### **1.11 Environment Variables**

**File:** `backend/.env.example`

```
# Database
DATABASE_URL=postgresql://user:password@host.neon.tech/database?sslmode=require

# Authentication
BETTER_AUTH_SECRET=your-super-secret-key-change-in-production

# Application
DEBUG=true
CORS_ORIGINS=["http://localhost:3000"]
```

---

## **Frontend Implementation**

### **2.1 Project Structure**

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page (task list)
│   ├── globals.css         # Global styles
│   ├── signin/
│   │   └── page.tsx        # Sign in page
│   └── signup/
│       └── page.tsx        # Sign up page
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── Toast.tsx
│   ├── Header.tsx
│   ├── TaskItem.tsx
│   ├── TaskList.tsx
│   ├── TaskForm.tsx
│   └── Layout.tsx
├── lib/
│   ├── api.ts              # API client
│   ├── auth.ts             # Auth configuration
│   └── utils.ts            # Utility functions
├── hooks/
│   └── useTasks.ts         # Task management hook
├── types/
│   └── index.ts            # TypeScript types
├── .env.local.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

### **2.2 Dependencies**

**File:** `frontend/package.json`

```json
{
  "name": "todo-webapp-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "better-auth": "^1.0.0",
    "swr": "^2.2.4"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "eslint": "^8.55.0",
    "eslint-config-next": "14.2.0"
  }
}
```

### **2.3 Types**

**File:** `frontend/types/index.ts`

```typescript
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
```

### **2.4 API Client**

**File:** `frontend/lib/api.ts`

```typescript
import { Task, TaskCreate, TaskUpdate, TaskListResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

export const api = {
  // Tasks
  async getTasks(userId: string, status?: string): Promise<TaskListResponse> {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    return fetchWithAuth<TaskListResponse>(`/api/${userId}/tasks?${params}`);
  },
  
  async getTask(userId: string, taskId: number): Promise<Task> {
    return fetchWithAuth<Task>(`/api/${userId}/tasks/${taskId}`);
  },
  
  async createTask(userId: string, data: TaskCreate): Promise<Task> {
    return fetchWithAuth<Task>(`/api/${userId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async updateTask(userId: string, taskId: number, data: TaskUpdate): Promise<Task> {
    return fetchWithAuth<Task>(`/api/${userId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  async deleteTask(userId: string, taskId: number): Promise<void> {
    return fetchWithAuth<void>(`/api/${userId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },
  
  async toggleTaskComplete(userId: string, taskId: number): Promise<Task> {
    return fetchWithAuth<Task>(`/api/${userId}/tasks/${taskId}/complete`, {
      method: 'PATCH',
    });
  },
};
```

### **2.5 Auth Configuration**

**File:** `frontend/lib/auth.ts`

```typescript
// Simple auth state management
// In production, use Better Auth client SDK

export interface User {
  id: string;
  email: string;
  name: string | null;
}

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
    const user = JSON.parse(userStr);
    return { user, token, isAuthenticated: true };
  } catch {
    return { user: null, token: null, isAuthenticated: false };
  }
}

export function setAuthState(token: string, user: User): void {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearAuthState(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
}

export function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function getUser(): User | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}
```

### **2.7 Custom Hook**

**File:** `frontend/hooks/useTasks.ts`

```typescript
import { useState, useCallback } from 'react';
import { Task, TaskCreate, TaskUpdate } from '@/types';
import { api } from '@/lib/api';
import { getUser } from '@/lib/auth';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const user = getUser();
  const userId = user?.id;
  
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
  
  const addTask = useCallback(async (data: TaskCreate) => {
    if (!userId) throw new Error('Not authenticated');
    
    const task = await api.createTask(userId, data);
    setTasks(prev => [task, ...prev]);
    return task;
  }, [userId]);
  
  const updateTask = useCallback(async (taskId: number, data: TaskUpdate) => {
    if (!userId) throw new Error('Not authenticated');
    
    const task = await api.updateTask(userId, taskId, data);
    setTasks(prev => prev.map(t => t.id === taskId ? task : t));
    return task;
  }, [userId]);
  
  const deleteTask = useCallback(async (taskId: number) => {
    if (!userId) throw new Error('Not authenticated');
    
    await api.deleteTask(userId, taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }, [userId]);
  
  const toggleComplete = useCallback(async (taskId: number) => {
    if (!userId) throw new Error('Not authenticated');
    
    const task = await api.toggleTaskComplete(userId, taskId);
    setTasks(prev => prev.map(t => t.id === taskId ? task : t));
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
```

---

## **Testing Strategy**

### **Backend Tests**

```python
# backend/tests/test_tasks.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_task(auth_token, user_id):
    response = client.post(
        f"/api/{user_id}/tasks",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"title": "Test task", "description": "Test description"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test task"
    assert data["user_id"] == user_id
    assert data["completed"] == False

def test_list_tasks(auth_token, user_id):
    response = client.get(
        f"/api/{user_id}/tasks",
        headers={"Authorization": f"Bearer {auth_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "tasks" in data
    assert "total" in data

def test_unauthorized_access():
    response = client.get("/api/user123/tasks")
    assert response.status_code == 401
```

---

## **Deployment Checklist**

### **Backend**

- [ ] Set up Neon PostgreSQL database
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Deploy to hosting platform (DigitalOcean, Railway, etc.)
- [ ] Configure CORS for production domain
- [ ] Set up monitoring and logging

### **Frontend**

- [ ] Configure API URL for production
- [ ] Build optimized production bundle
- [ ] Deploy to Vercel
- [ ] Configure custom domain (optional)
- [ ] Set up analytics (optional)

---

## **Next Steps**

After completing this implementation plan:

1. Test all CRUD operations
2. Verify authentication flow
3. Test on mobile devices
4. Write comprehensive README
5. Create demo video
6. Submit for Phase II evaluation
