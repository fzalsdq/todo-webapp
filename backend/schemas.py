# Task: P2-T-004
# Spec: specs/implementation-plan.md §1.6
# Plan: specs/api/rest-endpoints.md

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


# =============================================================================
# Task Schemas
# =============================================================================


class TaskCreate(BaseModel):
    """Schema for creating a new task."""

    title: str = Field(..., min_length=1, max_length=200, description="Task title")
    description: Optional[str] = Field(
        None, max_length=1000, description="Optional task description"
    )


class TaskUpdate(BaseModel):
    """Schema for updating an existing task."""

    title: Optional[str] = Field(
        None, min_length=1, max_length=200, description="Task title"
    )
    description: Optional[str] = Field(
        None, max_length=1000, description="Optional task description"
    )


class TaskResponse(BaseModel):
    """Schema for task response."""

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
    """Schema for list of tasks response."""

    tasks: List[TaskResponse]
    total: int
    limit: int
    offset: int


# =============================================================================
# Authentication Schemas
# =============================================================================


class TokenPayload(BaseModel):
    """Schema for JWT token payload."""

    sub: str  # user_id
    email: str
    name: Optional[str] = None
    exp: datetime
    iat: datetime


class HealthResponse(BaseModel):
    """Schema for health check response."""

    status: str
    timestamp: str
    version: str


class ErrorResponse(BaseModel):
    """Schema for error response."""

    detail: str
    status_code: Optional[int] = None
    errors: Optional[List[dict]] = None
