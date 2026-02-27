# Quick Start Guide

Get your Todo WebApp running in 5 minutes!

## Prerequisites

- Python 3.13+
- Node.js 18+
- UV (Python package manager)
- Neon PostgreSQL account (free)

## Step 1: Get Database URL

1. Go to [neon.tech](https://neon.tech)
2. Sign up for free account
3. Create a new project
4. Copy the connection string (looks like: `postgresql://user:password@host.neon.tech/db?sslmode=require`)

## Step 2: Set Up Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
uv pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env file
# - DATABASE_URL=<paste your Neon connection string>
# - BETTER_AUTH_SECRET=<generate random string, e.g., openssl rand -hex 32>
```

## Step 3: Set Up Frontend

```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local (already configured for local development)
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Step 4: Run the Application

### Option A: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

Backend will run at: http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Frontend will run at: http://localhost:3000

### Option B: Docker Compose

```bash
# From project root
docker-compose up
```

## Step 5: Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Sign up"
3. Enter any email and password (min 8 characters)
4. You'll be automatically signed in and redirected to home
5. Create your first task!

## API Documentation

With backend running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Troubleshooting

### Backend won't start

**Error: DATABASE_URL not set**
- Check `.env` file exists in backend folder
- Verify DATABASE_URL is set correctly

**Error: Module not found**
- Run `uv pip install -r requirements.txt` again

### Frontend won't start

**Error: Module not found**
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then reinstall

**Error: Cannot connect to backend**
- Ensure backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

### CORS Error

If you see CORS errors in browser console:

- Ensure backend `CORS_ORIGINS` includes `http://localhost:3000`
- Restart backend after changing CORS settings

## Next Steps

1. ✅ Create multiple tasks
2. ✅ Mark tasks as complete
3. ✅ Edit task details
4. ✅ Delete tasks
5. ✅ Sign out and sign in again
6. ✅ Check API documentation at /docs

## Production Deployment

See main README.md for deployment instructions:
- Frontend: Vercel
- Backend: Railway/DigitalOcean
- Database: Neon (already production-ready)

---

**Need Help?** Check the main README.md or open an issue on GitHub.
