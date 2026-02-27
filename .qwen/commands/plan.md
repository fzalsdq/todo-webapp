# Plan Command

## Purpose
Generate technical plan and update `speckit.plan` file based on approved specifications.

## Usage
After specifications are defined, use this command to create the technical implementation plan.

## Input Variables
- `spec_reference`: Reference to the specification (e.g., "specs/features/task-crud.md")
- `architecture_changes`: Any architectural modifications needed
- `technology_stack`: Technologies and libraries to use
- `implementation_approach`: High-level approach (e.g., bottom-up, feature-first)

## Process
1. Read relevant specification from `specs/` directory
2. Review `speckit.constitution` for constraints and standards
3. Generate technical architecture plan
4. Define component breakdown
5. Identify dependencies and integration points
6. Create implementation sequence
7. Update `speckit.plan`

## Template
```markdown
## Plan: {plan_name}

### Reference Specification
- {spec_file_reference}

### Architecture
{architecture_description}

### Components
1. {component_1}
   - Purpose: {purpose}
   - Location: {file_path}
   
2. {component_2}
   - Purpose: {purpose}
   - Location: {file_path}

### Technology Stack
- {technology_1}
- {technology_2}

### Implementation Sequence
1. {step_1}
2. {step_2}
3. {step_3}

### Dependencies
- {dependency_1}
- {dependency_2}

### API Changes
{api_endpoint_changes}

### Database Changes
{schema_changes}
```

## Output
Updated `speckit.plan` file with detailed technical plan.

## Example
```
User: "Create a plan for implementing task CRUD operations"

Plan command will:
1. Read specs/features/task-crud.md
2. Design API endpoints
3. Define database models
4. Plan component structure
5. Create implementation sequence
6. Update speckit.plan
```

## Constraints
- Must align with speckit.constitution
- Must reference specific spec files
- Must be actionable (clear steps)
- Must identify all affected files/locations
