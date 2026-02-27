# Task: P2-T-007
# Spec: specs/implementation-plan.md §1.9
# Plan: specs/api/rest-endpoints.md

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

# Create router with /api prefix
router = APIRouter(prefix="/api", tags=["tasks"])


@router.get(
    "/{user_id}/tasks",
    response_model=TaskListResponse,
    summary="List all tasks",
    description="Get all tasks for the authenticated user with optional filtering and pagination.",
)
def list_tasks(
    user_id: str,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session),
    status_filter: str = Query("all", alias="status", description="Filter by status"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum tasks to return"),
    offset: int = Query(0, ge=0, description="Number of tasks to skip"),
):
    """
    List all tasks for the authenticated user.

    - **user_id**: User's unique identifier (must match JWT token)
    - **status**: Filter by status ("all", "pending", "completed")
    - **limit**: Maximum number of tasks (1-1000)
    - **offset**: Pagination offset
    """
    # Verify user is accessing their own data
    verify_user_match(user_id, current_user_id)

    # Get tasks from database
    tasks = crud.get_tasks(session, user_id, status_filter, limit, offset)
    total = len(tasks)

    return TaskListResponse(
        tasks=tasks,
        total=total,
        limit=limit,
        offset=offset,
    )


@router.post(
    "/{user_id}/tasks",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new task",
    description="Create a new task for the authenticated user.",
)
def create_task(
    user_id: str,
    task_data: TaskCreate,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Create a new task.

    - **user_id**: User's unique identifier (must match JWT token)
    - **title**: Task title (required, 1-200 characters)
    - **description**: Optional description (max 1000 characters)
    """
    # Verify user is accessing their own data
    verify_user_match(user_id, current_user_id)

    # Create task in database
    return crud.create_task(session, user_id, task_data)


@router.get(
    "/{user_id}/tasks/{task_id}",
    response_model=TaskResponse,
    summary="Get task details",
    description="Get details of a specific task by ID.",
)
def get_task(
    user_id: str,
    task_id: int,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Get a specific task by ID.

    - **user_id**: User's unique identifier
    - **task_id**: Task ID
    """
    # Verify user is accessing their own data
    verify_user_match(user_id, current_user_id)

    # Get task from database
    task = crud.get_task(session, user_id, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return task


@router.put(
    "/{user_id}/tasks/{task_id}",
    response_model=TaskResponse,
    summary="Update a task",
    description="Update an existing task's title or description.",
)
def update_task(
    user_id: str,
    task_id: int,
    task_data: TaskUpdate,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Update a task.

    - **user_id**: User's unique identifier
    - **task_id**: Task ID
    - **title**: New title (optional, 1-200 characters)
    - **description**: New description (optional, max 1000 characters)
    """
    # Verify user is accessing their own data
    verify_user_match(user_id, current_user_id)

    # Update task in database
    task = crud.update_task(session, user_id, task_id, task_data)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return task


@router.delete(
    "/{user_id}/tasks/{task_id}",
    summary="Delete a task",
    description="Delete a task by ID.",
)
def delete_task(
    user_id: str,
    task_id: int,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Delete a task.

    - **user_id**: User's unique identifier
    - **task_id**: Task ID
    """
    # Verify user is accessing their own data
    verify_user_match(user_id, current_user_id)

    # Delete task from database
    success = crud.delete_task(session, user_id, task_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return {"message": "Task deleted successfully", "id": task_id}


@router.patch(
    "/{user_id}/tasks/{task_id}/complete",
    response_model=TaskResponse,
    summary="Toggle task completion",
    description="Toggle a task's completion status.",
)
def toggle_task_complete(
    user_id: str,
    task_id: int,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Toggle task completion status.

    - **user_id**: User's unique identifier
    - **task_id**: Task ID
    """
    # Verify user is accessing their own data
    verify_user_match(user_id, current_user_id)

    # Toggle completion status
    task = crud.toggle_complete(session, user_id, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return task
