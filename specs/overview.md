# Todo WebApp - Project Overview

## **Project Name**
Hackathon II - Evolution of Todo: Phase II (Full-Stack Web Application)

## **Purpose**
A multi-user todo web application with persistent storage, authentication, and RESTful API. This is Phase II of the 5-phase Hackathon II journey.

## **Current Phase**
**Phase II: Full-Stack Web Application**

## **Tech Stack**

### Frontend
- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Better Auth

### Backend
- **Framework**: FastAPI
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT tokens (Better Auth integration)

### Development
- **Spec-Driven**: Spec-Kit Plus
- **AI Assistant**: Qwen Code
- **Package Manager (Backend)**: UV

## **Features**

### Basic Level (Phase II)
- [x] User signup/signin with Better Auth
- [ ] Add Task - Create new todo items
- [ ] Delete Task - Remove tasks from the list
- [ ] Update Task - Modify existing task details
- [ ] View Task List - Display all tasks
- [ ] Mark as Complete - Toggle task completion status

### Future Phases
- **Phase III**: AI Chatbot with MCP tools
- **Phase IV**: Kubernetes deployment (Minikube)
- **Phase V**: Advanced features + Cloud deployment (DOKS/AKS/GKE)

## **Project Structure**

```
todo-webapp/
├── specs/                  # Specification files
├── frontend/               # Next.js application
├── backend/                # FastAPI application
└── docker-compose.yml      # Local development
```

## **Success Criteria**

1. Users can sign up and sign in
2. Users can perform CRUD operations on tasks
3. Each user only sees their own tasks
4. Application is responsive and works on mobile
5. All API endpoints are secured with JWT authentication
