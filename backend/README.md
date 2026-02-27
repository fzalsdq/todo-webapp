# Todo WebApp Backend

FastAPI backend for the Todo WebApp with JWT authentication and Neon Serverless PostgreSQL.

## Features

- RESTful API for task CRUD operations
- JWT authentication (Better Auth integration)
- PostgreSQL database with SQLModel ORM
- Automatic API documentation (Swagger/OpenAPI)
- CORS support for frontend

## Tech Stack

- **Framework**: FastAPI
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT (python-jose)
- **Validation**: Pydantic

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

Or using UV (recommended):

```bash
uv pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your values
# - DATABASE_URL: Get from Neon.tech
# - BETTER_AUTH_SECRET: Generate secure random string
```

### 3. Get Database URL

1. Go to [Neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Update `DATABASE_URL` in `.env`

### 4. Run the Server

```bash
# Development mode with auto-reload
uvicorn main:app --reload --port 8000

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000
```

## API Endpoints

### Health Check

```bash
GET http://localhost:8000/health
```

### Tasks

All task endpoints require JWT authentication.

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | `/api/{user_id}/tasks` | List all tasks |
| POST | `/api/{user_id}/tasks` | Create new task |
| GET | `/api/{user_id}/tasks/{id}` | Get task details |
| PUT | `/api/{user_id}/tasks/{id}` | Update task |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete task |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle completion |

### Authentication

Include JWT token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Example Requests

### Create Task

```bash
curl -X POST "http://localhost:8000/api/user123/tasks" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, eggs, bread"}'
```

### List Tasks

```bash
curl "http://localhost:8000/api/user123/tasks" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### List Pending Tasks Only

```bash
curl "http://localhost:8000/api/user123/tasks?status=pending" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Mark Task as Complete

```bash
curl -X PATCH "http://localhost:8000/api/user123/tasks/1/complete" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Delete Task

```bash
curl -X DELETE "http://localhost:8000/api/user123/tasks/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
backend/
├── main.py              # FastAPI application
├── config.py            # Configuration
├── db.py                # Database connection
├── models.py            # SQLModel models
├── schemas.py           # Pydantic schemas
├── auth.py              # JWT authentication
├── crud/
│   ├── __init__.py
│   └── tasks.py         # CRUD operations
├── routes/
│   ├── __init__.py
│   └── tasks.py         # API routes
├── requirements.txt     # Dependencies
├── .env.example         # Environment template
└── README.md            # This file
```

## Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=.
```

## Database Migrations

```bash
# Initialize Alembic (one-time)
alembic init alembic

# Create a new migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

## Security Notes

1. **Never commit `.env` file** - It contains secrets
2. **Change `BETTER_AUTH_SECRET`** in production
3. **Use HTTPS** in production
4. **Enable rate limiting** for production
5. **Validate CORS origins** for your domain

## Common Issues

### Connection Error

If you get database connection errors:
- Check `DATABASE_URL` in `.env`
- Ensure SSL mode is set: `?sslmode=require`
- Verify Neon project is active

### CORS Error

If frontend can't connect:
- Add frontend URL to `CORS_ORIGINS` in `.env`
- Restart the backend

### JWT Errors

If getting 401 Unauthorized:
- Verify `BETTER_AUTH_SECRET` matches frontend
- Check token hasn't expired (7 days)

## License

MIT
