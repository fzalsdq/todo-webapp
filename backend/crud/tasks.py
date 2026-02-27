# Task: P2-T-006
# Spec: specs/implementation-plan.md §1.8
# Plan: specs/database/schema.md §Database Operations

from sqlmodel import Session, select
from typing import List, Optional
from models import Task
from schemas import TaskCreate, TaskUpdate


def create_task(session: Session, user_id: str, task_data: TaskCreate) -> Task:
    """
    Create a new task for a user.

    Args:
        session: Database session
        user_id: ID of the user creating the task
        task_data: Task creation data

    Returns:
        Task: The created task with ID and timestamps
    """
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
    offset: int = 0,
) -> List[Task]:
    """
    Get tasks for a user with optional filtering and pagination.

    Args:
        session: Database session
        user_id: ID of the user
        status_filter: Filter by status ("all", "pending", "completed")
        limit: Maximum number of tasks to return
        offset: Number of tasks to skip

    Returns:
        List[Task]: List of tasks
    """
    query = select(Task).where(Task.user_id == user_id)

    # Apply status filter
    if status_filter == "pending":
        query = query.where(Task.completed == False)
    elif status_filter == "completed":
        query = query.where(Task.completed == True)

    # Apply pagination
    query = query.offset(offset).limit(limit)

    results = session.exec(query)
    return results.all()


def get_task(session: Session, user_id: str, task_id: int) -> Optional[Task]:
    """
    Get a specific task by ID.

    Args:
        session: Database session
        user_id: ID of the user (for ownership verification)
        task_id: ID of the task

    Returns:
        Optional[Task]: The task if found and belongs to user, None otherwise
    """
    query = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    return session.exec(query).first()


def update_task(
    session: Session,
    user_id: str,
    task_id: int,
    task_data: TaskUpdate,
) -> Optional[Task]:
    """
    Update a task.

    Args:
        session: Database session
        user_id: ID of the user
        task_id: ID of the task to update
        task_data: Update data (title and/or description)

    Returns:
        Optional[Task]: The updated task if found, None otherwise
    """
    task = get_task(session, user_id, task_id)
    if not task:
        return None

    # Update only provided fields
    update_data = task_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    session.add(task)
    session.commit()
    session.refresh(task)
    return task


def delete_task(session: Session, user_id: str, task_id: int) -> bool:
    """
    Delete a task.

    Args:
        session: Database session
        user_id: ID of the user
        task_id: ID of the task to delete

    Returns:
        bool: True if deleted, False if task not found
    """
    task = get_task(session, user_id, task_id)
    if not task:
        return False

    session.delete(task)
    session.commit()
    return True


def toggle_complete(session: Session, user_id: str, task_id: int) -> Optional[Task]:
    """
    Toggle task completion status.

    Args:
        session: Database session
        user_id: ID of the user
        task_id: ID of the task

    Returns:
        Optional[Task]: The updated task if found, None otherwise
    """
    task = get_task(session, user_id, task_id)
    if not task:
        return None

    task.completed = not task.completed
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
