# Tasks Command

## Purpose
Break down the technical plan into atomic, actionable tasks and update `speckit.tasks` file.

## Usage
After the plan is approved, use this command to create detailed implementation tasks.

## Input Variables
- `plan_reference`: Reference to the plan (e.g., "speckit.plan section 3.2")
- `task_granularity`: Level of detail (fine, medium, coarse)
- `priority_order`: How to order tasks (dependency, complexity, value)

## Process
1. Read `speckit.plan` for implementation approach
2. Break down each component into discrete tasks
3. Define preconditions and expected outputs for each task
4. Estimate effort (optional)
5. Link tasks to specifications
6. Create task dependency graph
7. Update `speckit.tasks`

## Template
```markdown
## Tasks: {task_group_name}

### Reference Plan
- {plan_section_reference}

### Task List

#### T-{number}: {task_name}
- **Description**: {detailed_description}
- **From Spec**: {spec_reference}
- **From Plan**: {plan_reference}
- **Preconditions**: {what_must_exist_before}
- **Expected Output**: {deliverable}
- **Files to Modify**: 
  - {file_1}
  - {file_2}
- **Estimated Effort**: {time_estimate}
- **Dependencies**: 
  - T-{other_task_number}
- **Acceptance Criteria**:
  - [ ] {criterion_1}
  - [ ] {criterion_2}
```

## Task Numbering
- T-001, T-002, T-003... (sequential)
- Prefix with phase: P2-T-001 (Phase 2, Task 1)

## Task Categories
1. **Setup**: Environment, dependencies, configuration
2. **Database**: Schema, models, migrations
3. **Backend**: API endpoints, business logic, auth
4. **Frontend**: Components, pages, state management
5. **Integration**: API integration, auth integration
6. **Testing**: Unit tests, integration tests, E2E
7. **Documentation**: README, API docs, comments

## Output
Updated `speckit.tasks` file with detailed task breakdown.

## Example
```
User: "Break down the task CRUD implementation into tasks"

Tasks command will:
1. Read speckit.plan for architecture
2. Create tasks for:
   - T-001: Create database models
   - T-002: Create CRUD operations
   - T-003: Create API endpoints
   - T-004: Add JWT authentication
   - T-005: Create frontend components
   - T-006: Integrate frontend with backend
   - T-007: Add tests
3. Link each task to specs
4. Define dependencies
5. Update speckit.tasks
```

## Quality Criteria
- Each task is independently implementable
- Clear acceptance criteria
- Specific file references
- No ambiguity in expected output
- Dependencies explicitly stated
