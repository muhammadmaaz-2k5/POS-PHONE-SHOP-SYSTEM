# 🚀 Sprint 7 — Polish, Testing & Deployment

> **Duration:** Week 8
> **Goal:** Final polish, error handling, TypeScript strictness, Docker setup, and production deployment.
> **Story Points:** 15
> **Status:** 🔵 Planned

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
- [ ] Audit all pages for consistent Tailwind spacing and typography
- [ ] Add loading skeletons to all data-fetching pages (Products, Customers, Sales, Reports)
- [ ] Add empty state illustrations for all empty lists
- [ ] Add `react-hot-toast` notifications consistently across all actions:
  - ✅ Success (create, update, delete, sale completed)
  - ❌ Error (network, validation, insufficient stock)
  - ⚠️ Warning (low stock on login)
- [ ] Fix all mobile layout issues (POS, Reports)
- [ ] Add keyboard shortcuts for POS:
  - `F2` → Focus product search
  - `F9` → Complete sale
  - `Esc` → Clear cart (with confirm)
- [ ] Dark mode toggle (Tailwind `dark:` classes)
- [ ] Consistent page titles in browser tab (`<title>`)
- [ ] 404 page for unknown routes

---

### 🛡️ STORY S7-2 — Error Handling & Validation Hardening `(3 pts)`
**As a** developer,
**I want** all errors handled gracefully with clear user feedback,
**So that** the app never shows raw errors or crashes.

#### Tasks:
- [ ] Backend: review all controllers — ensure every error uses `next(error)`
- [ ] Backend: add global `process.on('uncaughtException')` and `process.on('unhandledRejection')` handlers
- [ ] Frontend: create `components/ErrorBoundary.tsx` — catches React render errors
- [ ] Frontend: wrap entire `<App />` in `<ErrorBoundary />`
- [ ] Frontend: axios interceptor for global error handling:
  ```ts
  // 401 → redirect to /sign-in
  // 403 → show "Access denied" toast
  // 500 → show "Server error" toast
  // Network error → show "Connection failed" toast
  ```
- [ ] Add `zod` validation to ALL backend routes (not just auth)
- [ ] Run `tsc --noEmit` on both projects — fix all TypeScript errors

---

### 🐳 STORY S7-3 — Docker Setup `(4 pts)`
**As a** developer,
**I want** the entire stack to run with a single `docker-compose up`,
**So that** setup on any machine takes minutes.

#### Tasks:
- [ ] Create `backend/Dockerfile`:
  ```dockerfile
  FROM node:20-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production
  COPY . .
  RUN npm run build
  EXPOSE 5000
  CMD ["node", "dist/server.js"]
  ```
- [ ] Create `pos-retail-system/Dockerfile`:
  ```dockerfile
  FROM node:20-alpine AS builder
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build

  FROM nginx:alpine
  COPY --from=builder /app/dist /usr/share/nginx/html
  COPY nginx.conf /etc/nginx/conf.d/default.conf
  EXPOSE 80
  ```
- [ ] Create root `docker-compose.yml`:
  ```yaml
  services:
    postgres:
      image: postgres:15
      environment:
        POSTGRES_DB: phoneshop
        POSTGRES_PASSWORD: secret
      ports:
        - "5432:5432"
      volumes:
        - postgres_data:/var/lib/postgresql/data

    backend:
      build: ./backend
      ports:
        - "5000:5000"
      env_file: ./backend/.env
      depends_on:
        - postgres

    frontend:
      build: ./pos-retail-system
      ports:
        - "80:80"
      depends_on:
        - backend

  volumes:
    postgres_data:
  ```
- [ ] Create `nginx.conf` for React SPA routing:
  ```nginx
  try_files $uri $uri/ /index.html;
  ```
- [ ] Test: `docker-compose up --build` → full stack runs
- [ ] Add `docker-compose.dev.yml` for development with hot reload

---

### 📤 STORY S7-4 — Deployment `(2 pts)`
**As a** developer,
**I want** the app deployed to a live URL,
**So that** stakeholders can access it.

#### Tasks:
- [ ] **Backend** → Deploy to Railway or Render:
  - Connect GitHub repo
  - Set environment variables
  - Run `npx prisma migrate deploy` on startup
- [ ] **Frontend** → Deploy to Vercel or Netlify:
  - Connect GitHub repo
  - Set `VITE_API_URL` and `VITE_CLERK_PUBLISHABLE_KEY`
- [ ] **PostgreSQL** → Use Railway PostgreSQL addon or Supabase
- [ ] Update Clerk Dashboard: add production domain to allowed origins
- [ ] Update Clerk webhook URL to production
- [ ] Smoke test all features on production URL

---

### 📝 STORY S7-5 — Documentation `(2 pts)`
**As a** developer,
**I want** clear documentation,
**So that** the project can be maintained and onboarded easily.

#### Tasks:
- [ ] Update root `README.md`:
  - Project overview + screenshots
  - Prerequisites (Node 20, PostgreSQL, Clerk account)
  - Local setup guide (step by step)
  - Docker setup guide
  - Environment variables reference table
  - API endpoint reference (link to Postman collection)
- [ ] Export Postman collection as `phoneshop-api.postman_collection.json`
- [ ] Create `CONTRIBUTING.md` with:
  - Branch naming: `feature/S2-1-product-crud`
  - Commit convention: `feat:`, `fix:`, `chore:`
  - PR checklist
- [ ] Tag release: `git tag v1.0.0`

---

## ✅ Sprint 7 Acceptance Criteria

- [ ] `tsc --noEmit` passes on both frontend and backend with 0 errors
- [ ] All pages show loading skeletons while fetching
- [ ] Toast notifications appear for all user actions
- [ ] `docker-compose up --build` starts the full stack
- [ ] App is live on a public URL
- [ ] README contains full setup guide
- [ ] Postman collection is exported and documented

---

## 🏁 Project Complete Checklist

| Feature | Status |
|---------|--------|
| 🔐 Authentication (Clerk) | ⬜ |
| 📊 Dashboard | ⬜ |
| 🛒 POS / Sales Screen | ⬜ |
| 📦 Products / Inventory | ⬜ |
| 👥 Customers | ⬜ |
| 🏭 Suppliers | ⬜ |
| 📥 Purchases | ⬜ |
| 🧾 Sales / Invoices | ⬜ |
| 📈 Reports | ⬜ |
| 🐳 Docker | ⬜ |
| 🚀 Deployed | ⬜ |

---

## 🚧 Risks & Notes

> ⚠️ Clerk production keys differ from development keys — update `.env` carefully.
> ⚠️ Run `npx prisma migrate deploy` (not `dev`) in production.
> ℹ️ Consider adding E2E tests with Playwright in a future sprint.
