# GitHub Setup Guide

## Initialize and Push to GitHub

### Step 1: Initialize Git Repository

```bash
# Navigate to project root
cd E:\My-Projects\Agentic-AI\todo-webapp

# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Phase II: Initial commit - Full-Stack Web Application

- Spec-driven development with Spec-Kit Plus
- Backend: FastAPI + SQLModel + Neon PostgreSQL
- Frontend: Next.js 14 + TypeScript + Tailwind CSS
- JWT authentication
- Task CRUD operations
- Docker support
- Complete documentation"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `todo-webapp` (or your preferred name)
3. Description: "Phase II - Full-Stack Todo WebApp | Hackathon II"
4. Keep it **Public** (for hackathon submission)
5. **Don't** initialize with README (we already have one)
6. Click "Create repository"

### Step 3: Connect and Push

```bash
# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/todo-webapp.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 4: Verify

Open your repository URL:
```
https://github.com/YOUR_USERNAME/todo-webapp
```

## GitHub Repository Settings

### Recommended Settings

1. **About Section** (right sidebar):
   - Description: "Phase II - Full-Stack Todo WebApp | Hackathon II"
   - Website: Add your Vercel deployment URL (after deploying)
   - Topics: `todo`, `nextjs`, `fastapi`, `hackathon`, `spec-driven-development`

2. **Branch Protection** (Settings → Branches):
   - Add branch protection rule for `main`
   - Require pull request reviews (optional)

3. **Enable Issues** (Settings → Features):
   - Keep Issues enabled for tracking bugs/features

## Hackathon Submission Checklist

After pushing to GitHub:

### 1. GitHub Repository
- [ ] Repository is public
- [ ] README.md displays correctly
- [ ] All code is pushed
- [ ] Specs folder is included

### 2. Deploy Frontend (Vercel)

```bash
# Option A: Deploy via Vercel CLI
cd frontend
npm install -g vercel
vercel

# Option B: Deploy via Vercel Website
# 1. Go to vercel.com
# 2. Import your GitHub repository
# 3. Set root directory to "frontend"
# 4. Deploy
```

### 3. Deploy Backend (Railway or DigitalOcean)

**Railway:**
1. Go to railway.app
2. New Project → Deploy from GitHub
3. Select your repository
4. Set root directory to "backend"
5. Add environment variables:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `CORS_ORIGINS`

**DigitalOcean App Platform:**
1. Go to cloud.digitalocean.com
2. Create App → Connect GitHub
3. Select repository
4. Configure backend settings

### 4. Prepare Submission

**Required for Hackathon:**

1. **GitHub Repo Link:**
   ```
   https://github.com/YOUR_USERNAME/todo-webapp
   ```

2. **Deployed App Links:**
   - Frontend: `https://todo-webapp.vercel.app`
   - Backend: `https://your-backend.railway.app`

3. **Demo Video** (under 90 seconds):
   - Record using Loom, OBS, or phone
   - Show: Sign up, Create task, Complete task, Delete task
   - Upload to YouTube (unlisted) or Google Drive

4. **WhatsApp Number:**
   - For presentation invitation

### 5. Submit

Go to: https://forms.gle/KMKEKaFUD6ZX4UtY8

Fill in:
- GitHub repository link
- Deployed app links
- Demo video link
- WhatsApp number

## Git Commands Reference

```bash
# Check status
git status

# View changes
git diff

# Add files
git add .

# Commit
git commit -m "Your message"

# Push
git push

# Pull latest changes
git pull

# View commit history
git log --oneline
```

## .gitignore Already Includes

- Python: `__pycache__`, `.env`, `venv/`
- Node: `node_modules/`, `.next/`, `.env.local`
- IDE: `.vscode/`, `.idea/`
- OS: `.DS_Store`, `Thumbs.db`

**Important:** `.env` files are NOT committed. Users must create their own from `.env.example`.

## Troubleshooting

### Large Files Error

If you get "file too large" error:

```bash
# Check what files are large
git rev-parse HEAD:./backend/__pycache__ 2>/dev/null || echo "No large files"

# Remove cached files (if needed)
git rm -r --cached __pycache__
git commit -m "Remove cached files"
```

### Authentication Error

If git asks for credentials:

```bash
# Use GitHub Personal Access Token
# Generate at: https://github.com/settings/tokens
# Use token as password when prompted
```

Or use SSH:

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub: Settings → SSH and GPG keys
# Update remote URL
git remote set-url origin git@github.com:YOUR_USERNAME/todo-webapp.git
```

---

**After pushing, come back and I can help you with:**
- Deploying to Vercel
- Setting up backend hosting
- Creating demo video script
- Preparing for presentation
