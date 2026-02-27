# Task: P2-T-003
# Spec: specs/implementation-plan.md §1.5
# Plan: specs/database/schema.md

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class TaskBase(SQLModel):
    """Base model for task with common fields."""

    title: str = Field(max_length=200, description="Task title")
    description: Optional[str] = Field(
        default=None, max_length=1000, description="Optional task description"
    )
    completed: bool = Field(default=False, description="Task completion status")


class Task(TaskBase, table=True):
    """
    Database model for tasks table.
    
    Attributes:
        id: Primary key, auto-incrementing integer
        user_id: Foreign key to users table (managed by Better Auth)
        title: Task title (required, max 200 chars)
        description: Optional description (max 1000 chars)
        completed: Completion status (default: False)
        created_at: Timestamp when task was created
        updated_at: Timestamp when task was last updated
    """

    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(
        foreign_key="users.id",
        index=True,
        description="User who owns this task",
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
