# 🔐 Sprint 1 — Authentication (Clerk)

> **Duration:** Week 2
> **Goal:** Full authentication flow with Clerk — sign in, sign up, protected routes, user sync to PostgreSQL.
> **Story Points:** 18
> **Status:** 🔵 Planned

---

## 🎯 Sprint Goal

> *"By the end of this sprint, users can sign in/sign up via Clerk, the dashboard is protected, and every authenticated user is synced to the PostgreSQL database with a role."*

---

## 📋 User Stories & Tasks

### 🔑 STORY S1-1 — Clerk Frontend Integration `(5 pts)`
**As a** user,
**I want** to sign in and sign up using Clerk's hosted UI,
**So that** I don't need to manage passwords.

#### Tasks:
- [ ] Wrap `App.tsx` with `<ClerkProvider publishableKey={...}>`
- [ ] Create `pages/SignInPage.tsx` → `<SignIn routing="path" path="/sign-in" />`
- [ ] Create `pages/SignUpPage.tsx` → `<SignUp routing="path" path="/sign-up" />`
- [ ] Configure Clerk redirect: after login → `/dashboard`
- [ ] Create `components/ProtectedRoute.tsx`:
  ```tsx
  // Redirects to /sign-in if not authenticated
  const ProtectedRoute = ({ children }) => {
    const { isSignedIn, isLoaded } = useAuth();
    if (!isLoaded) return <LoadingSpinner />;
    if (!isSignedIn) return <Navigate to="/sign-in" />;
    return children;
  };
  ```
- [ ] Set up React Router with routes:
  - `/sign-in` → `<SignInPage />`
  - `/sign-up` → `<SignUpPage />`
  - `/dashboard` → `<DashboardPage />` (protected)
  - `/` → redirect to `/dashboard`

---

### 👤 STORY S1-2 — User Profile & Navigation `(3 pts)`
**As a** logged-in user,
**I want** to see my profile and have a logout button,
**So that** I can identify who I am and exit securely.

#### Tasks:
- [ ] Add `<UserButton />` to the sidebar/navbar (Clerk's built-in avatar + logout)
- [ ] Display user name from `useUser()` hook in the sidebar
- [ ] Show user role badge (Admin / Cashier) from Clerk `publicMetadata`
- [ ] Redirect to `/sign-in` after logout (handled by Clerk automatically)
- [ ] Create `hooks/useCurrentUser.ts`:
  ```ts
  // Returns { user, role, isAdmin }
  ```

---

### 🔗 STORY S1-3 — Backend Clerk Middleware `(4 pts)`
**As a** backend developer,
**I want** every API request verified with Clerk's JWT,
**So that** unauthenticated users cannot access any data.

#### Tasks:
- [ ] Install: `@clerk/express` (or `@clerk/backend`)
- [ ] Create `middleware/clerkAuth.ts`:
  ```ts
  import { clerkMiddleware, requireAuth } from '@clerk/express';
  // Verify session token on every /api/* route
  ```
- [ ] Apply `clerkMiddleware()` globally in `app.ts`
- [ ] Apply `requireAuth()` to all protected route groups
- [ ] Create `middleware/requireRole.ts`:
  ```ts
  // Check req.auth.sessionClaims.metadata.role
  // Throw 403 if role not in allowedRoles
  ```
- [ ] Test: `GET /api/auth/me` → returns `{ clerkId, email, name, role }` for valid token
- [ ] Test: Unauthenticated request → `401 Unauthorized`

---

### 📡 STORY S1-4 — Clerk Webhook → User Sync to DB `(4 pts)`
**As a** system,
**I want** every new Clerk user automatically saved to PostgreSQL,
**So that** sales and purchases can reference a local user record.

#### Tasks:
- [ ] Create Clerk webhook in Clerk Dashboard: `user.created`, `user.updated`, `user.deleted`
- [ ] Install: `svix` (for webhook signature verification)
- [ ] Create `routes/webhookRoutes.ts` → `POST /api/webhooks/clerk`
- [ ] Create `controllers/webhookController.ts`:
  ```ts
  // user.created  → prisma.user.create({ clerkUserId, name, email, role: 'cashier' })
  // user.updated  → prisma.user.update(...)
  // user.deleted  → prisma.user.delete(...)
  ```
- [ ] Verify webhook signature using `svix`
- [ ] Test with Clerk Dashboard → "Test webhook" button
- [ ] Verify user record appears in `prisma studio` after sign-up

---

### 🎭 STORY S1-5 — Role Management `(2 pts)`
**As an** admin,
**I want** to assign roles (Admin / Cashier) to users,
**So that** cashiers only access the POS while admins access everything.

#### Tasks:
- [ ] Define roles in Clerk `publicMetadata`: `{ role: "admin" | "cashier" }`
- [ ] Document how to set role in Clerk Dashboard manually (for now)
- [ ] `requireRole('admin')` middleware blocks cashier from:
  - Products management (delete)
  - Suppliers management
  - Reports
  - User management
- [ ] Frontend: hide admin-only nav items based on role from `useCurrentUser()`

---

## 🎨 UI Components to Build

| Component | Description |
|-----------|-------------|
| `SignInPage.tsx` | Clerk hosted sign-in |
| `SignUpPage.tsx` | Clerk hosted sign-up |
| `ProtectedRoute.tsx` | Auth guard wrapper |
| `Sidebar.tsx` | Nav with role-based links + `<UserButton />` |
| `LoadingSpinner.tsx` | Full-page loading state |
| `useCurrentUser.ts` | Custom hook for user + role |

---

## ✅ Sprint 1 Acceptance Criteria

- [ ] Unauthenticated users are redirected to `/sign-in`
- [ ] Authenticated users land on `/dashboard` after login
- [ ] New sign-up creates a record in `User` table in PostgreSQL
- [ ] `GET /api/auth/me` requires valid Clerk session token
- [ ] Admin role is enforced on protected routes (backend 403 + frontend hidden UI)
- [ ] `<UserButton />` shows user avatar and logout option

---

## 🚧 Risks & Notes

> ⚠️ Clerk webhooks require a public URL — use `ngrok` during local development.
> ⚠️ Role is stored in Clerk metadata; keep it in sync with `User.role` in DB.
