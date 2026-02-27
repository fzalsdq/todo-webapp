# Todo WebApp - Phase II

**Hackathon II - Evolution of Todo**

A full-stack web application for managing tasks with JWT authentication, built with Next.js, FastAPI, and Neon Serverless PostgreSQL.

![Phase](https://img.shields.io/badge/Phase-II-blue)
![Status](https://img.shields.io/badge/Status-Complete-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🎯 Features

### Basic Level (Implemented)

- ✅ **User Authentication** - Sign up, sign in, sign out with JWT tokens
- ✅ **Add Task** - Create new todo items with title and description
- ✅ **Delete Task** - Remove tasks from the list
- ✅ **Update Task** - Modify existing task details
- ✅ **View Task List** - Display all tasks with status indicators
- ✅ **Mark as Complete** - Toggle task completion status

### Coming in Future Phases

- ⏳ Priorities & Tags/Categories (Phase III)
- ⏳ Search & Filter (Phase III)
- ⏳ AI Chatbot with MCP Tools (Phase III)
- ⏳ Kubernetes Deployment (Phase IV)
- ⏳ Advanced Features & Cloud Deployment (Phase V)

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: React Hooks

### Backend

- **Framework**: FastAPI
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT (python-jose)

### Development

- **Spec-Driven**: Spec-Kit Plus
- **AI Assistant**: Qwen Code
- **Package Manager**: UV (Python), npm (Node.js)

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.13+
- UV (Python package manager)
- Neon PostgreSQL account (free tier)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd todo-webapp
```

### 2. Set Up Backend

```bash
cd backend

# Install dependencies
uv pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env with your values:
# - DATABASE_URL (from Neon.tech)
# - BETTER_AUTH_SECRET (generate random string)
```

### 3. Set Up Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local:
# - NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Run the Application

**Terminal 1 - Backend:**

```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
todo-webapp/
├── specs/                      # Specification files
│   ├── overview.md
│   ├── architecture.md
│   ├── features/
│   │   ├── task-crud.md
│   │   └── authentication.md
│   ├── api/
│   │   └── rest-endpoints.md
│   ├── database/
│   │   └── schema.md
│   ├── ui/
│   │   ├── components.md
│   │   └── pages.md
│   └── implementation-plan.md
├── .spec-kit/                  # Spec-Kit configuration
│   └── config.yaml
├── .qwen/commands/             # Qwen Code MCP commands
│   ├── specify.md
│   ├── plan.md
│   ├── tasks.md
│   └── implement.md
├── backend/                    # FastAPI backend
│   ├── main.py
│   ├── config.py
│   ├── db.py
│   ├── models.py
│   ├── schemas.py
│   ├── auth.py
│   ├── crud/
│   ├── routes/
│   └── README.md
├── frontend/                   # Next.js frontend
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── README.md
├── AGENTS.md                   # Agent instructions
├── CLAUDE.md                   # Qwen Code bridge
├── speckit.constitution        # Project constitution
└── README.md                   # This file
```

## 📖 API Documentation

Once the backend is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | `/api/{user_id}/tasks` | List all tasks |
| POST | `/api/{user_id}/tasks` | Create new task |
| PUT | `/api/{user_id}/tasks/{id}` | Update task |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete task |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle completion |

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

## 🔐 Authentication

The app uses JWT tokens for authentication:

1. User signs up/signs in on frontend
2. Better Auth issues JWT token
3. Token stored in localStorage
4. Token included in all API requests
5. Backend verifies token and extracts user ID

**Security Notes:**

- Tokens expire after 7 days
- User ID in path must match token subject
- All endpoints require authentication
- CORS restricted to trusted origins

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📝 Development Workflow

This project uses **Spec-Driven Development** with Qwen Code:

1. **Specify**: Define requirements in `/specs`
2. **Plan**: Generate technical plan
3. **Tasks**: Break down into atomic tasks
4. **Implement**: Qwen Code generates code

All code is generated via Qwen Code following specifications. No manual coding.

## 🌐 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project to Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

### Backend (Railway/DigitalOcean)

1. Create new project
2. Connect GitHub repository
3. Set environment variables:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `CORS_ORIGINS`
4. Deploy

### Database (Neon)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Update `DATABASE_URL` in backend

## 🤝 Contributing

This is a hackathon project. Contributions welcome!

1. Read specifications in `/specs`
2. Follow project constitution
3. Use Qwen Code for implementation
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Hackathon II** - Evolution of Todo
- **Panaversity** - AI-Native Education Initiative
- **Spec-Kit Plus** - Spec-Driven Development
- **Qwen Code** - AI Coding Assistant

## 📞 Contact

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ using Spec-Driven Development**
