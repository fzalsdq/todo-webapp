# UI Components Specification

## **Design System**

### **Color Palette**

| Color | Hex | Usage |
| :---- | :---- | :---- |
| Primary | `#3B82F6` | Buttons, links, accents |
| Primary Hover | `#2563EB` | Button hover states |
| Success | `#10B981` | Completed tasks, success messages |
| Danger | `#EF4444` | Delete buttons, error states |
| Warning | `#F59E0B` | Warnings, pending states |
| Gray 50 | `#F9FAFB` | Background |
| Gray 100 | `#F3F4F6` | Card backgrounds |
| Gray 300 | `#D1D5DB` | Borders |
| Gray 500 | `#6B7280` | Secondary text |
| Gray 700 | `#374151` | Primary text |
| Gray 900 | `#111827` | Headings |

### **Typography**

| Element | Font | Size | Weight |
| :---- | :---- | :---- | :---- |
| Headings | Inter | 24-32px | 600-700 |
| Body | Inter | 16px | 400 |
| Small | Inter | 14px | 400 |
| Button | Inter | 16px | 500 |

### **Spacing**

Base unit: `4px`

| Token | Value |
| :---- | :---- |
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |

### **Border Radius**

| Element | Radius |
| :---- | :---- |
| Buttons | 6px |
| Cards | 8px |
| Inputs | 6px |
| Badges | 9999px (pill) |

---

## **Core Components**

### **Button**

Reusable button component with variants.

```tsx
// frontend/components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}
```

**Variants:**
- `primary`: Blue background, white text
- `secondary`: Gray background, dark text
- `danger`: Red background, white text
- `ghost`: Transparent, colored text

**Sizes:**
- `sm`: Small (padding: 4px 12px, font-size: 14px)
- `md`: Medium (padding: 8px 16px, font-size: 16px)
- `lg`: Large (padding: 12px 24px, font-size: 18px)

**States:**
- `default`: Normal state
- `hover`: Darker background
- `active`: Even darker background
- `disabled`: Gray, no pointer
- `loading`: Spinner, disabled

---

### **Input**

Text input component with label and error states.

```tsx
// frontend/components/ui/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}
```

**Features:**
- Optional label above input
- Error message below input
- Required indicator (*)
- Focus ring (blue border)
- Disabled state (gray background)

---

### **TextArea**

Multi-line text input for descriptions.

```tsx
// frontend/components/ui/TextArea.tsx
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
  rows?: number;
}
```

**Default rows:** 3  
**Max length:** Display character count if maxLength prop provided

---

### **Card**

Container component for grouping content.

```tsx
// frontend/components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}
```

**Styles:**
- White background
- Subtle shadow
- Rounded corners (8px)
- Optional padding

---

### **Badge**

Status indicator component.

```tsx
// frontend/components/ui/Badge.tsx
interface BadgeProps {
  variant: 'success' | 'pending' | 'neutral';
  children: React.ReactNode;
}
```

**Variants:**
- `success`: Green background, green text (completed)
- `pending`: Yellow background, yellow text (pending)
- `neutral`: Gray background, gray text (default)

---

### **Modal**

Dialog component for confirmations and forms.

```tsx
// frontend/components/ui/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}
```

**Features:**
- Overlay backdrop
- Click outside to close
- ESC key to close
- Optional footer (actions)
- Scrollable content

---

### **Toast**

Notification component for feedback.

```tsx
// frontend/components/ui/Toast.tsx
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}
```

**Types:**
- `success`: Green, checkmark icon
- `error`: Red, X icon
- `info`: Blue, info icon

**Default duration:** 3000ms

---

### **Spinner**

Loading indicator.

```tsx
// frontend/components/ui/Spinner.tsx
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}
```

**Sizes:**
- `sm`: 16px
- `md`: 24px
- `lg`: 32px

---

### **EmptyState**

Component for empty list views.

```tsx
// frontend/components/ui/EmptyState.tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}
```

**Usage:**
- No tasks yet
- No search results
- No completed tasks

---

## **Page Components**

### **Layout**

Main application layout with navigation.

```tsx
// frontend/components/Layout.tsx
```

**Structure:**
```
┌─────────────────────────────────────┐
│           Header                    │
│  [Logo] [User]          [Sign Out]  │
├─────────────────────────────────────┤
│                                     │
│           Main Content              │
│                                     │
├─────────────────────────────────────┤
│           Footer                    │
│    © 2025 Todo WebApp               │
└─────────────────────────────────────┘
```

---

### **Header**

Top navigation bar.

```tsx
// frontend/components/Header.tsx
```

**Elements:**
- Logo/Brand name (left)
- User name/email (center)
- Sign out button (right)

**Responsive:**
- Mobile: Hamburger menu
- Desktop: Full header

---

### **TaskItem**

Individual task component in the list.

```tsx
// frontend/components/TaskItem.tsx
interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}
```

**Structure:**
```
┌─────────────────────────────────────────────┐
│ ☐ Task Title                    [Edit] [🗑] │
│   Optional description text...              │
│   📅 Created: Dec 1, 2025                   │
└─────────────────────────────────────────────┘
```

**States:**
- Pending: Empty checkbox, normal text
- Completed: Checked checkbox, strikethrough text

**Actions:**
- Checkbox: Toggle complete
- Edit button: Open edit modal
- Delete button: Open confirmation modal

---

### **TaskList**

Container for task items.

```tsx
// frontend/components/TaskList.tsx
interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  onToggle: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}
```

**Features:**
- Loading state (skeleton screens)
- Empty state (no tasks)
- List of TaskItem components
- Optional filters/sort controls

---

### **TaskForm**

Form for creating/editing tasks.

```tsx
// frontend/components/TaskForm.tsx
interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: TaskCreate) => void;
  onCancel: () => void;
  loading?: boolean;
}
```

**Fields:**
- Title (required, text input)
- Description (optional, textarea)

**Validation:**
- Title required
- Title max 200 characters
- Description max 1000 characters

**Modes:**
- Create: Empty form, "Create Task" button
- Edit: Pre-filled form, "Update Task" button

---

### **TaskCard**

Alternative card view for tasks.

```tsx
// frontend/components/TaskCard.tsx
interface TaskCardProps {
  task: Task;
  onToggle: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}
```

**Mobile-optimized view:**
```
┌─────────────────────────┐
│ ☐ Task Title       [⋮]  │
│   Description text...   │
│   ─────────────────     │
│   Status  │  Date       │
└─────────────────────────┘
```

---

## **Responsive Design**

### **Breakpoints**

| Name | Min Width | Target |
| :---- | :---- | :---- |
| sm | 640px | Mobile landscape |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |

### **Responsive Patterns**

**Task List:**
- Mobile: Single column, card view
- Tablet: Single column, list view
- Desktop: Single column, list view (max-width: 800px)

**Forms:**
- Mobile: Full-width inputs, stacked buttons
- Desktop: Fixed-width inputs, inline buttons

**Modal:**
- Mobile: Full screen
- Desktop: Centered, max-width 500px

---

## **Accessibility**

### **WCAG 2.1 Level AA Compliance**

- **Color Contrast**: Minimum 4.5:1 for text
- **Focus Indicators**: Visible focus rings on all interactive elements
- **Keyboard Navigation**: All actions accessible via keyboard
- **Screen Reader Support**: Proper ARIA labels and roles
- **Form Labels**: All inputs have associated labels

### **ARIA Labels**

```tsx
<button aria-label="Delete task">🗑</button>
<input aria-label="Task title" />
<div role="alert">Error message</div>
```

---

## **Animation**

### **Transitions**

| Element | Duration | Easing |
| :---- | :---- | :---- |
| Button hover | 150ms | ease-in-out |
| Modal fade | 200ms | ease-out |
| Toast slide | 300ms | cubic-bezier |

### **Micro-interactions**

- Button press: Scale down 0.98
- Checkbox toggle: Smooth check animation
- Task complete: Strikethrough animation
- Delete: Fade out before removal

---

## **Dark Mode** (Future Enhancement)

Not implemented in Phase II, but designed for future support.

```tsx
// Tailwind dark mode classes
<div className="bg-white dark:bg-gray-800">
  <h1 className="text-gray-900 dark:text-white">
```
