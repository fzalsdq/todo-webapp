# Feature: User Authentication

## **User Stories**

1. As a new user, I can sign up with my email and password
2. As an existing user, I can sign in with my credentials
3. As a user, I can sign out from my session
4. As a user, my authentication persists across page refreshes
5. As a user, I am redirected to sign in if I try to access protected routes without authentication

---

## **Acceptance Criteria**

### **Sign Up**

**Given** I am not authenticated  
**When** I provide a valid email and password  
**Then** a new user account is created  
**And** I am automatically signed in  
**And** I am redirected to the task list page

**Validation Rules:**
- Email is required and must be valid format
- Password is required, minimum 8 characters
- Email must not already be registered
- Password is hashed before storage

---

### **Sign In**

**Given** I have an account  
**When** I provide my registered email and correct password  
**Then** I am authenticated  
**And** a JWT token is issued  
**And** I am redirected to the task list page

**Error Handling:**
- Invalid email: Show "Invalid credentials" error
- Invalid password: Show "Invalid credentials" error
- Don't reveal whether email exists (security)

---

### **Sign Out**

**Given** I am authenticated  
**When** I click sign out  
**Then** my session is terminated  
**And** the JWT token is invalidated  
**And** I am redirected to the sign in page

---

### **Session Persistence**

**Given** I am authenticated  
**When** I refresh the page or close and reopen the browser  
**Then** I remain signed in  
**And** I can continue using the application

**Implementation:**
- JWT token stored securely (httpOnly cookie or secure storage)
- Token expiry: 7 days
- Automatic token refresh before expiry (optional)

---

### **Protected Routes**

**Given** I am not authenticated  
**When** I try to access a protected route (e.g., /tasks)  
**Then** I am redirected to the sign in page  
**And** after signing in, I am redirected back to my intended destination

**Protected Routes:**
- `/` (home - task list)
- `/tasks` (task management)
- `/profile` (user profile - future)

**Public Routes:**
- `/signin`
- `/signup`
- `/api/auth/*` (authentication endpoints)

---

## **JWT Token Configuration**

### **Token Structure**

```json
{
  "sub": "user_id_string",
  "email": "user@example.com",
  "name": "User Name",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### **Token Settings**

| Setting | Value |
| :---- | :---- |
| Algorithm | HS256 |
| Expiry | 7 days (604800 seconds) |
| Secret | BETTER_AUTH_SECRET (environment variable) |

---

## **Better Auth Configuration**

### **Frontend Setup**

```typescript
// lib/auth.ts
import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false, // Phase II: skip email verification
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  jwt: {
    enabled: true, // Enable JWT tokens for backend API
  },
});
```

### **Backend JWT Verification**

```python
# backend/auth.py
from jose import jwt, JWTError

def verify_jwt_token(token: str) -> dict:
    """Verify JWT token and return payload."""
    try:
        payload = jwt.decode(
            token,
            settings.BETTER_AUTH_SECRET,
            algorithms=["HS256"],
            options={"verify_exp": True}
        )
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
```

---

## **API Endpoints (Better Auth)**

Better Auth provides built-in endpoints:

| Endpoint | Method | Description |
| :---- | :---- | :---- |
| `/api/auth/sign-up` | POST | Create new user account |
| `/api/auth/sign-in` | POST | Sign in and get session |
| `/api/auth/sign-out` | POST | Sign out and invalidate session |
| `/api/auth/session` | GET | Get current session |

---

## **Security Requirements**

1. **Password Hashing**: Use bcrypt or argon2 for password storage
2. **HTTPS Only**: Cookies/tokens only over HTTPS in production
3. **Rate Limiting**: Prevent brute force attacks on sign-in
4. **CSRF Protection**: Protect against cross-site request forgery
5. **XSS Prevention**: Sanitize user inputs

---

## **Error Messages**

| Scenario | User-Friendly Message |
| :---- | :---- |
| Invalid credentials | "Invalid email or password" |
| Email already registered | "This email is already registered" |
| Weak password | "Password must be at least 8 characters" |
| Token expired | "Session expired. Please sign in again" |
| No token provided | "Authentication required" |

---

## **User Experience**

### **Sign Up Flow**

```
/signup → Enter email/password → Submit → Account created → Redirect to /tasks
```

### **Sign In Flow**

```
/signin → Enter email/password → Submit → JWT issued → Redirect to /tasks
```

### **Sign Out Flow**

```
Click "Sign Out" → Confirm → Session cleared → Redirect to /signin
```

---

## **Future Enhancements**

- Email verification
- Password reset
- OAuth providers (Google, GitHub)
- Two-factor authentication (2FA)
- Session management (view active sessions)
