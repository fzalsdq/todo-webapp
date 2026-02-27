# Todo WebApp Frontend

Next.js frontend for the Todo WebApp with a modern, responsive UI.

## Features

- User authentication (sign up, sign in, sign out)
- Task CRUD operations
- Responsive design (mobile-friendly)
- Real-time updates
- Toast notifications
- Modal dialogs

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Fetch API

## Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.local.example .env.local

# Edit .env.local with your values
# - NEXT_PUBLIC_API_URL: Your backend API URL
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page (task list)
│   ├── globals.css         # Global styles
│   ├── signin/
│   │   └── page.tsx        # Sign in page
│   └── signup/
│       └── page.tsx        # Sign up page
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Badge.tsx
│   │   ├── Spinner.tsx
│   │   └── EmptyState.tsx
│   ├── Header.tsx          # App header
│   ├── TaskItem.tsx        # Individual task
│   ├── TaskList.tsx        # Task list container
│   ├── TaskForm.tsx        # Create/edit task form
│   └── Layout.tsx          # App layout
├── hooks/
│   └── useTasks.ts         # Task management hook
├── lib/
│   ├── api.ts              # API client
│   ├── auth.ts             # Auth utilities
│   └── utils.ts            # Utility functions
├── types/
│   └── index.ts            # TypeScript types
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## Components

### UI Components

Reusable components in `components/ui/`:

- **Button**: Primary, secondary, danger, ghost variants
- **Input**: Text input with label and error states
- **TextArea**: Multi-line text input
- **Card**: Container with shadow and rounded corners
- **Modal**: Dialog with backdrop
- **Toast**: Notification message
- **Badge**: Status indicator
- **Spinner**: Loading indicator
- **EmptyState**: Empty list placeholder

### Feature Components

- **Header**: App header with logo and sign out
- **TaskItem**: Individual task with checkbox and actions
- **TaskList**: List of tasks with empty state
- **TaskForm**: Form for creating/editing tasks
- **Layout**: Main app layout with authentication

## Pages

### Home Page (`/`)

- Lists all tasks
- Create new task button
- Toggle task completion
- Edit and delete tasks
- Filter by status (future)

### Sign In Page (`/signin`)

- Email and password form
- Link to sign up
- Redirects to home on success

### Sign Up Page (`/signup`)

- Email, password, and name form
- Password confirmation
- Link to sign in
- Auto sign in on success

## API Integration

The API client (`lib/api.ts`) handles all backend communication:

```typescript
import { api } from '@/lib/api';

// Get tasks
const { tasks } = await api.getTasks(userId);

// Create task
const task = await api.createTask(userId, { title, description });

// Update task
await api.updateTask(userId, taskId, { title });

// Delete task
await api.deleteTask(userId, taskId);

// Toggle completion
await api.toggleTaskComplete(userId, taskId);
```

## Authentication

Authentication uses JWT tokens stored in localStorage:

```typescript
import { setAuthState, getUser, clearAuthState } from '@/lib/auth';

// After sign in
setAuthState(token, user);

// Get current user
const user = getUser();

// Sign out
clearAuthState();
```

## Styling

Tailwind CSS for all styling. Key design decisions:

- **Colors**: Primary blue (#3B82F6), success green, danger red
- **Typography**: Inter font family
- **Spacing**: 4px base unit
- **Responsive**: Mobile-first approach

## Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Environment Variables

| Variable | Description | Default |
| :---- | :---- | :---- |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

## Common Issues

### API Connection Error

If you see network errors:
- Ensure backend is running: `cd backend && uvicorn main:app --reload`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS settings in backend

### Build Error

If build fails:
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## License

MIT
