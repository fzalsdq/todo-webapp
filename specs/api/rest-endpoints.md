# REST API Endpoints Specification

## **Base URL**

- **Development**: `http://localhost:8000`
- **Production**: `https://api.yourdomain.com`

## **Authentication**

All endpoints require JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

---

## **Task Endpoints**

### **GET /api/{user_id}/tasks**

List all tasks for the authenticated user.

**Path Parameters:**
| Parameter | Type | Required | Description |
| :---- | :---- | :---- | :---- |
| user_id | string | Yes | User's unique identifier (must match JWT token) |

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
| :---- | :---- | :---- | :---- | :---- |
| status | string | No | "all" | Filter by status: "all", "pending", "completed" |
| sort | string | No | "created_at" | Sort by: "created_at", "title", "updated_at" |
| order | string | No | "desc" | Sort order: "asc", "desc" |
| limit | integer | No | 100 | Maximum number of tasks to return |
| offset | integer | No | 0 | Number of tasks to skip (pagination) |

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "tasks": [
    {
      "id": 1,
      "user_id": "user_123",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "created_at": "2025-12-01T10:00:00Z",
      "updated_at": "2025-12-01T10:00:00Z"
    },
    {
      "id": 2,
      "user_id": "user_123",
      "title": "Call mom",
      "description": null,
      "completed": true,
      "created_at": "2025-11-28T15:30:00Z",
      "updated_at": "2025-11-29T09:00:00Z"
    }
  ],
  "total": 2,
  "limit": 100,
  "offset": 0
}
```

**Error Responses:**
| Status | Description |
| :---- | :---- |
| 401 | Missing or invalid JWT token |
| 403 | user_id doesn't match JWT token subject |

---

### **POST /api/{user_id}/tasks**

Create a new task.

**Path Parameters:**
| Parameter | Type | Required | Description |
| :---- | :---- | :---- | :---- |
| user_id | string | Yes | User's unique identifier |

**Request Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

**Request Body Schema:**
| Field | Type | Required | Constraints |
| :---- | :---- | :---- | :---- |
| title | string | Yes | 1-200 characters |
| description | string | No | Max 1000 characters |

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response (201 Created):**
```json
{
  "id": 3,
  "user_id": "user_123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2025-12-01T12:00:00Z",
  "updated_at": "2025-12-01T12:00:00Z"
}
```

**Error Responses:**
| Status | Description |
| :---- | :---- |
| 400 | Validation error (missing title, too long, etc.) |
| 401 | Missing or invalid JWT token |
| 403 | user_id doesn't match JWT token subject |

---

### **GET /api/{user_id}/tasks/{id}**

Get details of a specific task.

**Path Parameters:**
| Parameter | Type | Required | Description |
| :---- | :---- | :---- | :---- |
| user_id | string | Yes | User's unique identifier |
| id | integer | Yes | Task ID |

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user_id": "user_123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2025-12-01T10:00:00Z",
  "updated_at": "2025-12-01T10:00:00Z"
}
```

**Error Responses:**
| Status | Description |
| :---- | :---- |
| 401 | Missing or invalid JWT token |
| 403 | user_id doesn't match JWT token subject |
| 404 | Task not found |

---

### **PUT /api/{user_id}/tasks/{id}**

Update an existing task.

**Path Parameters:**
| Parameter | Type | Required | Description |
| :---- | :---- | :---- | :---- |
| user_id | string | Yes | User's unique identifier |
| id | integer | Yes | Task ID |

**Request Body:**
```json
{
  "title": "Buy groceries and fruits",
  "description": "Updated shopping list"
}
```

**Request Body Schema:**
| Field | Type | Required | Constraints |
| :---- | :---- | :---- | :---- |
| title | string | No* | 1-200 characters (at least one field required) |
| description | string | No* | Max 1000 characters (at least one field required) |

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user_id": "user_123",
  "title": "Buy groceries and fruits",
  "description": "Updated shopping list",
  "completed": false,
  "created_at": "2025-12-01T10:00:00Z",
  "updated_at": "2025-12-01T12:30:00Z"
}
```

**Error Responses:**
| Status | Description |
| :---- | :---- |
| 400 | Validation error |
| 401 | Missing or invalid JWT token |
| 403 | user_id doesn't match JWT token subject |
| 404 | Task not found |

---

### **DELETE /api/{user_id}/tasks/{id}**

Delete a task.

**Path Parameters:**
| Parameter | Type | Required | Description |
| :---- | :---- | :---- | :---- |
| user_id | string | Yes | User's unique identifier |
| id | integer | Yes | Task ID |

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "message": "Task deleted successfully",
  "id": 1
}
```

**Error Responses:**
| Status | Description |
| :---- | :---- |
| 401 | Missing or invalid JWT token |
| 403 | user_id doesn't match JWT token subject |
| 404 | Task not found |

---

### **PATCH /api/{user_id}/tasks/{id}/complete**

Toggle task completion status.

**Path Parameters:**
| Parameter | Type | Required | Description |
| :---- | :---- | :---- | :---- |
| user_id | string | Yes | User's unique identifier |
| id | integer | Yes | Task ID |

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user_id": "user_123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": true,
  "created_at": "2025-12-01T10:00:00Z",
  "updated_at": "2025-12-01T12:45:00Z"
}
```

**Error Responses:**
| Status | Description |
| :---- | :---- |
| 401 | Missing or invalid JWT token |
| 403 | user_id doesn't match JWT token subject |
| 404 | Task not found |

---

## **Authentication Endpoints (Better Auth)**

Better Auth handles these endpoints automatically:

| Endpoint | Method | Description |
| :---- | :---- | :---- |
| `/api/auth/sign-up` | POST | Sign up with email/password |
| `/api/auth/sign-in` | POST | Sign in with email/password |
| `/api/auth/sign-out` | POST | Sign out |
| `/api/auth/session` | GET | Get current session |

---

## **Health Check Endpoints**

### **GET /health**

Check API health status.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-01T12:00:00Z",
  "version": "1.0.0"
}
```

---

## **Error Response Format**

All error responses follow this format:

```json
{
  "detail": "Error message describing what went wrong",
  "status_code": 400,
  "errors": [
    {
      "field": "title",
      "message": "Title is required",
      "code": "required"
    }
  ]
}
```

---

## **Rate Limiting**

| Endpoint | Limit |
| :---- | :---- |
| All task endpoints | 100 requests per minute per user |
| Auth endpoints | 10 requests per minute per IP |

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

---

## **CORS Configuration**

**Allowed Origins:**
- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

**Allowed Methods:**
- GET, POST, PUT, DELETE, PATCH, OPTIONS

**Allowed Headers:**
- Authorization, Content-Type

**Credentials:**
- Allowed (for cookies if used)
