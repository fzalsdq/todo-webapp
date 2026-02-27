# System Architecture

## **Architecture Overview**

```
┌─────────────────┐     ┌──────────────────────────────┐     ┌─────────────────┐
│                 │     │         FastAPI Backend      │     │                 │
│   Next.js       │────▶│  ┌────────────────────────┐  │     │   Neon DB       │
│   Frontend      │     │  │  REST API + JWT Auth   │  │     │   (PostgreSQL)  │
│   (Better Auth) │◀────│  │  /api/{user_id}/tasks  │──┼────▶│                 │
│                 │     │  └────────────────────────┘  │     │  - users        │
└─────────────────┘     └──────────────────────────────┘     │  - tasks        │
                                                              └─────────────────┘
```

## **Component Architecture**

### **Frontend (Next.js)**

- **App Router**: File-based routing with Server Components
- **Better Auth**: Client-side authentication with JWT tokens
- **API Client**: Centralized HTTP client for backend communication
- **Components**: Reusable UI components with Tailwind CSS

### **Backend (FastAPI)**

- **Entry Point**: `main.py` - FastAPI application
- **Routes**: `/api/{user_id}/tasks` - Task CRUD operations
- **Models**: SQLModel database models
- **Database**: SQLModel with Neon PostgreSQL connection
- **Auth Middleware**: JWT token verification

### **Database Schema**

```sql
-- Users table (managed by Better Auth)
users (
  id: VARCHAR PRIMARY KEY,
  email: VARCHAR UNIQUE NOT NULL,
  name: VARCHAR,
  created_at: TIMESTAMP
)

-- Tasks table
tasks (
  id: INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id: VARCHAR NOT NULL REFERENCES users(id),
  title: VARCHAR(200) NOT NULL,
  description: TEXT,
  completed: BOOLEAN DEFAULT FALSE,
  created_at: TIMESTAMP DEFAULT NOW(),
  updated_at: TIMESTAMP DEFAULT NOW()
)
```

## **Authentication Flow**

1. User signs up/signs in on Frontend → Better Auth creates session
2. Better Auth issues JWT token with user information
3. Frontend stores token and includes in API requests: `Authorization: Bearer <token>`
4. Backend middleware verifies JWT signature using shared secret
5. Backend decodes token to get user_id, validates against URL parameter
6. Backend filters all queries by authenticated user's ID

## **API Endpoints**

| Method | Endpoint | Description | Auth |
| :---- | :---- | :---- | :---- |
| GET | `/api/{user_id}/tasks` | List all tasks for user | JWT Required |
| POST | `/api/{user_id}/tasks` | Create new task | JWT Required |
| GET | `/api/{user_id}/tasks/{id}` | Get task details | JWT Required |
| PUT | `/api/{user_id}/tasks/{id}` | Update task | JWT Required |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete task | JWT Required |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle completion | JWT Required |

## **Security Architecture**

### **JWT Token Structure**

```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### **Shared Secret**

Both frontend (Better Auth) and backend (FastAPI) use the same secret key:
- Environment variable: `BETTER_AUTH_SECRET`
- Used for JWT signing (frontend) and verification (backend)

### **Security Measures**

1. **Token Verification**: All API endpoints require valid JWT
2. **User Isolation**: Queries filtered by authenticated user_id
3. **CORS**: Restricted to trusted origins
4. **Input Validation**: Pydantic models validate all inputs
5. **HTTPS**: Required in production

## **Deployment Architecture**

### **Local Development**

```yaml
# docker-compose.yml
services:
  frontend:  # Next.js on port 3000
  backend:   # FastAPI on port 8000
```

### **Production**

- **Frontend**: Vercel (serverless deployment)
- **Backend**: DigitalOcean App Platform / Kubernetes
- **Database**: Neon Serverless PostgreSQL

## **Data Flow**

### **Create Task Flow**

```
User → Frontend → POST /api/{user_id}/tasks + JWT 
                → Backend (verify JWT, validate input) 
                → Database (INSERT task) 
                → Backend (return created task) 
                → Frontend (update UI)
```

### **List Tasks Flow**

```
User → Frontend → GET /api/{user_id}/tasks + JWT 
                → Backend (verify JWT, filter by user_id) 
                → Database (SELECT tasks WHERE user_id = ?) 
                → Backend (return tasks) 
                → Frontend (render list)
```

## **Error Handling**

| Status Code | Meaning | Response |
| :---- | :---- | :---- |
| 200 | Success | Requested data |
| 201 | Created | New task created |
| 400 | Bad Request | Validation error details |
| 401 | Unauthorized | Missing/invalid JWT |
| 403 | Forbidden | User ID mismatch |
| 404 | Not Found | Task doesn't exist |
| 500 | Server Error | Internal error message |

## **Environment Variables**

### **Backend (.env)**

```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret-key-here
CORS_ORIGINS=http://localhost:3000
```

### **Frontend (.env.local)**

```
NEXT_PUBLIC_BETTER_AUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_API_URL=http://localhost:8000
```
