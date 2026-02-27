# Specify Command

## Purpose
Capture requirements and update `speckit.specify` file.

## Usage
When user wants to define a new feature or requirement, use this command to structure the specification.

## Input Variables
- `feature_name`: Name of the feature being specified
- `description`: Brief description of what the feature does
- `user_stories`: List of user stories (As a user, I want...)
- `acceptance_criteria`: Detailed acceptance criteria
- `constraints`: Any technical or business constraints

## Process
1. Read existing `speckit.specify` file
2. Add new feature specification following the template
3. Ensure alignment with `speckit.constitution`
4. Update specification with user input
5. Validate against existing specs for conflicts

## Template
```markdown
## Feature: {feature_name}

### User Stories
- {user_story_1}
- {user_story_2}

### Acceptance Criteria
1. {criterion_1}
2. {criterion_2}

### Constraints
- {constraint_1}
```

## Output
Updated `speckit.specify` file with new feature specification.

## Example
```
User: "I want to add user authentication to the app"

Specify command will:
1. Create feature spec for authentication
2. Define user stories (sign up, sign in, sign out)
3. Define acceptance criteria
4. Add security constraints
5. Update speckit.specify
```
