# Database Schema Specification

## **Database Technology**

- **Database**: Neon Serverless PostgreSQL
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Migrations**: Alembic (via SQLModel)

---

## **Tables**

### **users** (Managed by Better Auth)

This table is automatically created and managed by Better Auth.

| Column | Type | Constraints | Description |
| :---- | :---- | :---- | :---- |
| id | VARCHAR(255) | PRIMARY KEY | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| name | VARCHAR(255) | NULLABLE | User's display name |
| email_verified | BOOLEAN | DEFAULT FALSE | Email verification status |
| image | VARCHAR(511) | NULLABLE | Profile image URL |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_users_email` on email (for login lookups)
- `idx_users_created_at` on created_at (for analytics)

---

### **tasks**

Main table for storing todo items.

| Column | Type | Constraints | Description |
| :---- | :---- | :---- | :---- |
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique task identifier |
| user_id | VARCHAR(255) | FOREIGN KEY → users.id, NOT NULL | Owner of the task |
| title | VARCHAR(200) | NOT NULL | Task title |
| description | TEXT | NULLABLE | Optional task description |
| completed | BOOLEAN | DEFAULT FALSE | Completion status |
| created_at | TIMESTAMP | DEFAULT NOW() | Task creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_tasks_user_id` on user_id (for filtering by user)
- `idx_tasks_completed` on completed (for status filtering)
- `idx_tasks_created_at` on created_at (for sorting)
- `idx_tasks_user_completed` on (user_id, completed) (composite index)

**Foreign Keys:**
- `fk_tasks_user_id` → users(id) ON DELETE CASCADE

---

## **SQLModel Models**

### **User Model** (Reference Only - Managed by Better Auth)

```python
from sqlmodel import SQLModel, Field
from datetime import datetime

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    name: str | None = None
    email_verified: bool = Field(default=False)
    image: str | None = None

class User(UserBase, table=True):
    __tablename__ = "users"
    
    id: str | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

---

### **Task Model**

```python
from sqlmodel import SQLModel, Field, ForeignKey
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

---

## **Pydantic Schemas for API**

### **Task Schemas**

```python
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

# Request Schemas
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)

# Response Schemas
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
    tasks: list[TaskResponse]
    total: int
    limit: int
    offset: int
```

---

## **Database Connection**

### **Connection String Format**

```
postgresql://username:password@host:port/database?sslmode=require
```

### **Neon Serverless Configuration**

```python
# backend/db.py
from sqlmodel import SQLModel, create_engine, Session
from typing import Generator

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True for SQL query logging
    pool_pre_ping=True,  # Enable connection health checks
    pool_size=10,  # Connection pool size
    max_overflow=20,  # Max connections beyond pool_size
)

def create_db_and_tables():
    """Create all tables in the database."""
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    """Dependency for getting database session."""
    session = Session(engine)
    try:
        yield session
    finally:
        session.close()
```

---

## **Migrations**

### **Initial Migration**

```python
# backend/alembic/versions/001_initial_migration.py

"""Initial migration - create users and tasks tables

Revision ID: 001
Revises: 
Create Date: 2025-12-01

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel

# revision identifiers
revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Create users table (if not created by Better Auth)
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=True),
        sa.Column('email_verified', sa.Boolean(), nullable=False, default=False),
        sa.Column('image', sa.String(length=511), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index('idx_users_email', 'users', ['email'])
    
    # Create tasks table
    op.create_table(
        'tasks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.String(length=255), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('completed', sa.Boolean(), nullable=False, default=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_tasks_user_id', 'tasks', ['user_id'])
    op.create_index('idx_tasks_completed', 'tasks', ['completed'])
    op.create_index('idx_tasks_created_at', 'tasks', ['created_at'])

def downgrade():
    op.drop_table('tasks')
    op.drop_table('users')
```

---

## **Database Operations**

### **CRUD Operations**

```python
# backend/crud/tasks.py
from sqlmodel import Session, select
from typing import List, Optional
from models import Task, TaskCreate, TaskUpdate

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
    status: str = "all",
    limit: int = 100,
    offset: int = 0
) -> List[Task]:
    """Get tasks for a user with optional filtering."""
    query = select(Task).where(Task.user_id == user_id)
    
    if status == "pending":
        query = query.where(Task.completed == False)
    elif status == "completed":
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

---

## **Data Relationships**

```
┌─────────────┐         ┌─────────────┐
│   users     │         │   tasks     │
├─────────────┤         ├─────────────┤
│ id (PK)     │◀───────┤ user_id (FK)│
│ email       │   1:N   │ id (PK)     │
│ name        │         │ title       │
│ ...         │         │ description │
└─────────────┘         │ completed   │
                        │ ...         │
                        └─────────────┘
```

**Relationship Rules:**
- One user can have many tasks (1:N)
- Each task belongs to exactly one user
- Deleting a user cascades and deletes all their tasks
- Tasks cannot exist without a user (foreign key constraint)

---

## **Query Optimization**

### **Common Queries**

```sql
-- Get all pending tasks for a user
SELECT * FROM tasks 
WHERE user_id = 'user_123' AND completed = false
ORDER BY created_at DESC;

-- Get task count by status
SELECT completed, COUNT(*) as count 
FROM tasks 
WHERE user_id = 'user_123'
GROUP BY completed;

-- Get recently updated tasks
SELECT * FROM tasks 
WHERE user_id = 'user_123'
ORDER BY updated_at DESC
LIMIT 10;
```

### **Index Usage**

| Query Pattern | Index Used |
| :---- | :---- |
| Filter by user_id | `idx_tasks_user_id` |
| Filter by completed status | `idx_tasks_completed` |
| Sort by created_at | `idx_tasks_created_at` |
| Filter + sort combined | `idx_tasks_user_completed` + sort |

---

## **Backup and Recovery**

- **Automatic Backups**: Neon provides automatic daily backups
- **Point-in-Time Recovery**: Available via Neon dashboard
- **Manual Exports**: Use `pg_dump` for manual backups

---

## **Environment Variables**

```bash
# .env
DATABASE_URL=postgresql://user:password@host.neon.tech/database?sslmode=require
```
