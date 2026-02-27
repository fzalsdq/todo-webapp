# Implement Command

## Purpose
Execute implementation based on approved tasks in `speckit.tasks`.

## Usage
When ready to write code, use this command to implement specific tasks.

## Input Variables
- `task_ids`: List of task IDs to implement (e.g., ["T-001", "T-002"])
- `implementation_mode`: Mode of operation (single, batch, iterative)
- `test_first`: Whether to write tests before implementation (true/false)

## Process
1. Read specified tasks from `speckit.tasks`
2. Review linked specifications and plan
3. Check `speckit.constitution` for standards
4. Implement code for each task
5. Add comments with task references
6. Run linters and formatters
7. Create/update tests
8. Verify implementation against acceptance criteria

## Implementation Rules

### Code Comments
Every file must include a header comment:
```python
# Task: T-001
# Spec: specs/features/task-crud.md §2.1
# Plan: speckit.plan §3.4
```

```typescript
// Task: T-005
// Spec: specs/ui/components.md §4.2
// Plan: speckit.plan §5.1
```

### File Structure
- Follow existing project conventions
- Place files in correct directories per plan
- Use naming conventions from constitution

### Code Quality
- Follow DRY principles
- Single responsibility per function/class
- Descriptive variable and function names
- Type hints (Python) and TypeScript types
- Error handling for edge cases

### Testing
- Unit tests for business logic
- Integration tests for API endpoints
- Component tests for UI components
- Minimum 80% coverage for critical paths

## Template for Implementation

### Backend (Python/FastAPI)
```python
# Task: {task_id}
# Spec: {spec_reference}
# Plan: {plan_reference}

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from db import get_session
from models import Task
from schemas import TaskCreate, TaskResponse

router = APIRouter()

@router.post("/tasks", response_model=TaskResponse)
def create_task(
    task_data: TaskCreate,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user)
):
    """
    Create a new task.
    
    - **task_data**: Task creation data
    - **user_id**: Authenticated user ID from JWT
    """
    # Implementation
```

### Frontend (Next.js/TypeScript)
```typescript
// Task: {task_id}
// Spec: {spec_reference}
// Plan: {plan_reference}

import { FC, useState } from 'react';
import { api } from '@/lib/api';

interface ComponentProps {
  // Props
}

export const Component: FC<ComponentProps> = ({}) => {
  // Implementation
};
```

## Output
- Implemented code files
- Updated tests
- Code comments with task references
- Git commit messages (if version control enabled)

## Example
```
User: "Implement tasks T-001 and T-002"

Implement command will:
1. Read speckit.tasks for T-001, T-002
2. Read linked specs (specs/database/schema.md)
3. Read speckit.plan for architecture
4. Create backend/models.py with Task model
5. Create backend/db.py with database connection
6. Add task reference comments
7. Run black/ruff for Python linting
8. Create tests for models
9. Verify against acceptance criteria
```

## Validation
Before completing:
- [ ] All task acceptance criteria met
- [ ] Code follows constitution standards
- [ ] Tests passing
- [ ] Linters passing
- [ ] Task references in comments
- [ ] No hardcoded values (use env vars)
- [ ] Error handling implemented

## Error Handling
If implementation blocked:
1. Identify missing specification
2. Request clarification from user
3. Propose spec update if needed
4. Do not improvise - stop and ask

## Batch Implementation
For multiple tasks:
1. Implement in dependency order
2. Commit after each task
3. Run tests after each commit
4. Update task status in speckit.tasks
