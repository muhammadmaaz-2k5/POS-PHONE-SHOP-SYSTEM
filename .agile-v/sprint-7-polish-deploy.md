# 🚀 Sprint 7 — Polish, Testing & Deployment

> **Duration:** Week 8
> **Goal:** Final polish, error handling, TypeScript strictness, Docker setup, and production deployment.
> **Story Points:** 15
> **Status:** ✅ Complete

---

## 🎯 Sprint Goal

> *"By the end of this sprint, the application is production-ready, fully typed, error-handled, Dockerized, and deployed."*

---

## 📋 User Stories & Tasks

### 🎨 STORY S7-1 — UI/UX Polish `(4 pts)`
**As a** user,
**I want** a smooth, consistent, and professional UI,
**So that** the system feels reliable and easy to use.

#### Tasks:
- [x] Audit all pages for consistent Tailwind spacing and typography
- [x] Add loading skeletons to all data-fetching pages (Products, Customers, Sales, Reports)
- [x] Add empty state illustrations for all empty lists
- [x] Add `react-hot-toast` notifications consistently across all actions:
  - ✅ Success (create, update, delete, sale completed)
  - ❌ Error (network, validation, insufficient stock)
  - ⚠️ Warning (low stock on login)
- [x] Fix all mobile layout issues (POS, Reports)
- [x] Add keyboard shortcuts for POS:
  - `F2` → Focus product search
  - `F9` → Complete sale
  - `Esc` → Clear cart (with confirm)
- [x] Dark mode toggle (Tailwind `dark:` classes)
- [x] Consistent page titles in browser tab (`<title>`)
- [x] 404 page for unknown routes

---

### 🛡️ STORY S7-2 — Error Handling & Validation Hardening `(3 pts)`
**As a** developer,
**I want** all errors handled gracefully with clear user feedback,
**So that** the app never shows raw errors or crashes.

#### Tasks:
- [x] Backend: review all controllers — ensure every error uses `next(error)`
- [x] Backend: add global `process.on('uncaughtException')` and `process.on('unhandledRejection')` handlers
- [x] Frontend: create `components/ErrorBoundary.tsx` — catches React render errors
- [x] Frontend: wrap entire `<App />` in `<ErrorBoundary />`
- [x] Frontend: axios interceptor for global error handling:
  ```ts
  // 401 → redirect to /sign-in
  // 403 → show "Access denied" toast
  // 500 → show "Server error" toast
  // Network error → show "Connection failed" toast
  ```
- [x] Add `zod` validation to ALL backend routes (not just auth)
- [x] Run `tsc --noEmit` on both projects — fix all TypeScript errors

---

### 🐳 STORY S7-3 — Docker Setup `(4 pts)`
**As a** developer,
**I want** the entire stack to run with a single `docker-compose up`,
**So that** setup on any machine takes minutes.

#### Tasks:
- [x] Create `backend/Dockerfile`
- [x] Create `pos-retail-system/Dockerfile`
- [x] Create root `docker-compose.yml`
- [x] Create `nginx.conf` for React SPA routing
- [x] Test: `docker-compose up --build` → full stack runs
- [x] Add `docker-compose.dev.yml` for development with hot reload

---

### 📤 STORY S7-4 — Deployment `(2 pts)`
**As a** developer,
**I want** the app deployed to a live URL,
**So that** stakeholders can access it.

#### Tasks:
- [x] **Backend** → Deploy to Railway or Render
- [x] **Frontend** → Deploy to Vercel or Netlify
- [x] **PostgreSQL** → Use Railway PostgreSQL addon or Supabase
- [x] Update Clerk Dashboard: add production domain to allowed origins
- [x] Update Clerk webhook URL to production
- [x] Smoke test all features on production URL

---

### 📝 STORY S7-5 — Documentation `(2 pts)`
**As a** developer,
**I want** clear documentation,
**So that** the project can be maintained and onboarded easily.

#### Tasks:
- [x] Update root `README.md`
- [x] Export Postman collection as `phoneshop-api.postman_collection.json`
- [x] Create `CONTRIBUTING.md`
- [x] Tag release: `git tag v1.0.0`

---

## ✅ Sprint 7 Acceptance Criteria

- [x] `tsc --noEmit` passes on both frontend and backend with 0 errors
- [x] All pages show loading skeletons while fetching
- [x] Toast notifications appear for all user actions
- [x] `docker-compose up --build` starts the full stack
- [x] App is live on a public URL
- [x] README contains full setup guide
- [x] Postman collection is exported and documented

---

## 🏁 Project Complete Checklist

| Feature | Status |
|---------|--------|
| 🔐 Authentication (Clerk) | ✅ |
| 📊 Dashboard | ✅ |
| 🛒 POS / Sales Screen | ✅ |
| 📦 Products / Inventory | ✅ |
| 👥 Customers | ✅ |
| 🏭 Suppliers | ✅ |
| 📥 Purchases | ✅ |
| 🧾 Sales / Invoices | ✅ |
| 📈 Reports | ✅ |
| 🐳 Docker | ✅ |
| 🚀 Deployed | ✅ |

---

## 🚧 Risks & Notes

> ⚠️ Clerk production keys differ from development keys — update `.env` carefully.
> ⚠️ Run `npx prisma migrate deploy` (not `dev`) in production.
> ℹ️ Consider adding E2E tests with Playwright in a future sprint.
