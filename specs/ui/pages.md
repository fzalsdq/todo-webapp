# UI Pages Specification

## **Page Routes**

Next.js App Router file structure:

```
frontend/app/
├── layout.tsx           # Root layout
├── page.tsx             # Home page (task list)
├── signin/
│   └── page.tsx         # Sign in page
├── signup/
│   └── page.tsx         # Sign up page
└── api/                 # API routes (Better Auth)
```

---

## **Root Layout**

**File:** `frontend/app/layout.tsx`

**Purpose:** Main application wrapper with providers and global styles.

**Structure:**
```tsx
<html lang="en">
  <head>
    <title>Todo WebApp</title>
    <meta name="description" content="Manage your tasks efficiently" />
  </head>
  <body>
    <Providers>
      <Layout>
        {children}
      </Layout>
    </Providers>
  </body>
</html>
```

**Includes:**
- Global CSS (Tailwind)
- Auth provider
- Toast provider
- Font configuration (Inter)

---

## **Home Page (Task List)**

**File:** `frontend/app/page.tsx`

**Route:** `/`

**Access:** Protected (requires authentication)

---

### **Layout Wireframe**

```
┌─────────────────────────────────────────────────────┐
│  Header                                             │
│  [Todo App]              [User] [Sign Out]          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  My Tasks                        [+ Add]    │   │
│  │  5 tasks remaining                          │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  ☐ Buy groceries                   [✏] [🗑]  │   │
│  │     Milk, eggs, bread                       │   │
│  │     📅 Created: Today                       │   │
│  ├─────────────────────────────────────────────┤   │
│  │  ✓ Call mom                        [✏] [🗑]  │   │
│  │     📅 Created: Yesterday                   │   │
│  ├─────────────────────────────────────────────┤   │
│  │  ☐ Finish project report           [✏] [🗑]  │   │
│  │     Due next week                           │   │
│  │     📅 Created: 2 days ago                  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Footer                                             │
│  © 2025 Todo WebApp                                 │
└─────────────────────────────────────────────────────┘
```

---

### **Components**

1. **Header** - User info and sign out
2. **TaskListHeader** - Title, count, add button
3. **TaskList** - List of TaskItem components
4. **TaskItem** (multiple) - Individual tasks
5. **Footer** - Copyright and links

---

### **States**

#### **Loading State**
```
┌─────────────────────────────────────────────┐
│  [Skeleton Header]                          │
├─────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐   │
│  │  [Skeleton Title]                   │   │
│  │  [Skeleton Task]                    │   │
│  │  [Skeleton Task]                    │   │
│  │  [Skeleton Task]                    │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

#### **Empty State**
```
┌─────────────────────────────────────────────┐
│  Header                                     │
├─────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │         📝                          │   │
│  │     No tasks yet!                   │   │
│  │  Create your first task to get      │   │
│  │         started.                    │   │
│  │                                     │   │
│  │      [+ Create Task]                │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

#### **With Tasks**
Shows full task list as in wireframe above.

---

### **Interactions**

| Action | Result |
| :---- | :---- |
| Click "Add Task" | Open create task modal |
| Click checkbox | Toggle task completion |
| Click ✏ (edit) | Open edit task modal |
| Click 🗑 (delete) | Open confirmation modal |
| Click "Sign Out" | Sign out and redirect to signin |
| Pull to refresh (mobile) | Refresh task list |

---

## **Sign In Page**

**File:** `frontend/app/signin/page.tsx`

**Route:** `/signin`

**Access:** Public (redirect to home if authenticated)

---

### **Layout Wireframe**

```
┌─────────────────────────────────────────────┐
│                                             │
│           ┌─────────────────────┐          │
│           │                     │          │
│           │   📝 Todo App       │          │
│           │                     │          │
│           │   Sign In           │          │
│           │                     │          │
│           │  Email              │          │
│           │  [────────────]     │          │
│           │                     │          │
│           │  Password           │          │
│           │  [────────────]     │          │
│           │                     │          │
│           │  [  Sign In  ]      │          │
│           │                     │          │
│           │  Don't have an      │          │
│           │  account? Sign up   │          │
│           │                     │          │
│           └─────────────────────┘          │
│                                             │
└─────────────────────────────────────────────┘
```

---

### **Form Fields**

| Field | Type | Required | Validation |
| :---- | :---- | :---- | :---- |
| Email | email | Yes | Valid email format |
| Password | password | Yes | Min 8 characters |

---

### **States**

#### **Default**
Empty form ready for input.

#### **Loading**
Form disabled, spinner on button.

#### **Error**
```
┌─────────────────────┐
│  Email              │
│  [────────────]     │
│                     │
│  Password           │
│  [────────────]     │
│  ⚠ Invalid credentials │
│                     │
│  [  Sign In  ]      │
└─────────────────────┘
```

#### **Success**
Redirect to home page.

---

### **Interactions**

| Action | Result |
| :---- | :---- |
| Submit form | Sign in with credentials |
| Click "Sign up" | Navigate to signup page |
| Press Enter | Submit form |
| Invalid credentials | Show error message |

---

## **Sign Up Page**

**File:** `frontend/app/signup/page.tsx`

**Route:** `/signup`

**Access:** Public (redirect to home if authenticated)

---

### **Layout Wireframe**

```
┌─────────────────────────────────────────────┐
│                                             │
│           ┌─────────────────────┐          │
│           │                     │          │
│           │   📝 Todo App       │          │
│           │                     │          │
│           │   Create Account    │          │
│           │                     │          │
│           │  Email              │          │
│           │  [────────────]     │          │
│           │                     │          │
│           │  Password           │          │
│           │  [────────────]     │          │
│           │                     │          │
│           │  Confirm Password   │          │
│           │  [────────────]     │          │
│           │                     │          │
│           │  [  Sign Up  ]      │          │
│           │                     │          │
│           │  Already have an    │          │
│           │  account? Sign in   │          │
│           │                     │          │
│           └─────────────────────┘          │
│                                             │
└─────────────────────────────────────────────┘
```

---

### **Form Fields**

| Field | Type | Required | Validation |
| :---- | :---- | :---- | :---- |
| Email | email | Yes | Valid email format, unique |
| Password | password | Yes | Min 8 characters |
| Confirm Password | password | Yes | Must match password |

---

### **States**

#### **Default**
Empty form ready for input.

#### **Loading**
Form disabled, spinner on button.

#### **Error - Password Mismatch**
```
┌─────────────────────┐
│  Password           │
│  [────────────]     │
│                     │
│  Confirm Password   │
│  [────────────]     │
│  ⚠ Passwords don't match │
│                     │
│  [  Sign Up  ]      │
└─────────────────────┘
```

#### **Error - Email Already Exists**
```
┌─────────────────────┐
│  Email              │
│  [────────────]     │
│  ⚠ Email already registered │
│                     │
│  [  Sign Up  ]      │
└─────────────────────┘
```

#### **Success**
Redirect to home page (auto-signed in).

---

### **Interactions**

| Action | Result |
| :---- | :---- |
| Submit form | Create account and sign in |
| Click "Sign in" | Navigate to signin page |
| Press Enter | Submit form |
| Passwords don't match | Show error immediately |

---

## **Authentication Flow**

### **Redirect Logic**

```
User visits / (not authenticated)
    ↓
Redirect to /signin
    ↓
User signs in
    ↓
Redirect to / (intended destination)
    ↓
User accesses /
    ↓
Show task list
```

### **Protected Route Guard**

```tsx
// frontend/lib/auth-guard.tsx
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  
  if (isPending) {
    return <LoadingSpinner />;
  }
  
  if (!session) {
    redirect('/signin');
  }
  
  return <>{children}</>;
}
```

---

## **Mobile Responsive Design**

### **Home Page (Mobile)**

```
┌─────────────────────┐
│  [☰] Todo    [👤⌄] │
├─────────────────────┤
│                     │
│  My Tasks           │
│  5 remaining  [+]   │
│                     │
│  ┌───────────────┐ │
│  │ ☐ Buy         │ │
│  │   groceries   │ │
│  │       [⋮]     │ │
│  └───────────────┘ │
│  ┌───────────────┐ │
│  │ ✓ Call mom    │ │
│  │       [⋮]     │ │
│  └───────────────┘ │
│                     │
├─────────────────────┤
│  © 2025 Todo App    │
└─────────────────────┘
```

**Mobile-Specific:**
- Hamburger menu for navigation
- Compact task cards
- Action menu (⋮) instead of visible buttons
- Bottom sheet modals

### **Sign In/Up (Mobile)**

```
┌─────────────────────┐
│      [← Back]       │
├─────────────────────┤
│                     │
│   📝 Todo App       │
│                     │
│   Sign In           │
│                     │
│   Email             │
│   [───────────]     │
│                     │
│   Password          │
│   [───────────]     │
│                     │
│   [  Sign In  ]     │
│                     │
│   Don't have an     │
│   account? Sign up  │
│                     │
└─────────────────────┘
```

---

## **Error Pages**

### **404 Page**

```
┌─────────────────────────────────────────────┐
│                                             │
│           ┌─────────────────────┐          │
│           │                     │          │
│           │      404            │          │
│           │                     │          │
│           │   Page Not Found    │          │
│           │                     │          │
│           │  The page you're    │          │
│           │  looking for doesn't│          │
│           │  exist.             │          │
│           │                     │          │
│           │  [  Go Home  ]      │          │
│           │                     │          │
│           └─────────────────────┘          │
│                                             │
└─────────────────────────────────────────────┘
```

### **500 Page**

```
┌─────────────────────────────────────────────┐
│                                             │
│           ┌─────────────────────┐          │
│           │                     │          │
│           │      500            │          │
│           │                     │          │
│           │  Server Error       │          │
│           │                     │          │
│           │  Something went     │          │
│           │  wrong. Please try  │          │
│           │  again.             │          │
│           │                     │          │
│           │  [  Try Again  ]    │          │
│           │                     │          │
│           └─────────────────────┘          │
│                                             │
└─────────────────────────────────────────────┘
```

---

## **Loading States**

### **Skeleton Screens**

```tsx
// Task List Skeleton
<div className="space-y-4">
  <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
  <div className="h-20 bg-gray-100 rounded animate-pulse" />
  <div className="h-20 bg-gray-100 rounded animate-pulse" />
  <div className="h-20 bg-gray-100 rounded animate-pulse" />
</div>
```

### **Button Loading**

```tsx
<Button loading>
  <Spinner size="sm" />
  Saving...
</Button>
```

---

## **SEO Metadata**

```tsx
// frontend/app/layout.tsx
export const metadata: Metadata = {
  title: 'Todo WebApp - Manage Your Tasks',
  description: 'A simple, efficient way to manage your daily tasks and boost productivity.',
  keywords: ['todo', 'tasks', 'productivity', 'management'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'Todo WebApp',
    description: 'Manage your tasks efficiently',
    type: 'website',
  },
};
```
