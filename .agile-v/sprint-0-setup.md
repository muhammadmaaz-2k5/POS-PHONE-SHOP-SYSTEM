# 🏗️ Sprint 0 — Foundation & Project Setup

> **Duration:** Week 1
> **Goal:** Bootstrap both projects, connect the database, and ensure the team can run everything locally.
> **Story Points:** 13
> **Status:** 🔵 Planned

---

## 🎯 Sprint Goal

> *"By the end of this sprint, every developer can run the frontend and backend locally, the database is connected with the initial schema, and Clerk is configured."*

---

## 📋 User Stories & Tasks

### 🗂️ STORY S0-1 — Repository Setup `(2 pts)`
**As a** developer,
**I want** a clean GitHub repository with both frontend and backend,
**So that** the team can collaborate with version control.

#### Tasks:
- [ ] Create GitHub repository: `phone-shop-pos`
- [ ] Initialize `backend/` — Node.js + Express + TypeScript
- [ ] Initialize `pos-retail-system/` — Vite + React + TypeScript + Tailwind
- [ ] Add `.gitignore` for both (node_modules, .env, dist)
- [ ] Create `README.md` at root level
- [ ] Set up branch strategy: `main`, `develop`, `feature/*`

---

### 🔧 STORY S0-2 — Backend Project Initialization `(3 pts)`
**As a** developer,
**I want** a typed Express backend with TypeScript and linting configured,
**So that** we write safe, consistent code from day one.

#### Tasks:
- [ ] Install: `express`, `typescript`, `ts-node`, `@types/express`, `@types/node`
- [ ] Install dev: `nodemon`, `eslint`, `prettier`, `@typescript-eslint/parser`
- [ ] Configure `tsconfig.json` (strict mode, ES2020 target)
- [ ] Configure `eslint.config.js` + `.prettierrc`
- [ ] Set up folder structure:
  ```
  backend/
  ├── src/
  │   ├── config/
  │   ├── controllers/
  │   ├── middleware/
  │   ├── models/       (Prisma handles this)
  │   ├── routes/
  │   └── utils/
  ├── prisma/
  │   └── schema.prisma
  └── server.ts
  ```
- [ ] `npm run dev` starts server successfully

---

### 🎨 STORY S0-3 — Frontend Project Initialization `(2 pts)`
**As a** developer,
**I want** a Vite + React + TypeScript app with Tailwind CSS configured,
**So that** I can start building UI components immediately.

#### Tasks:
- [ ] Scaffold: `npm create vite@latest pos-retail-system -- --template react-ts`
- [ ] Install & configure Tailwind CSS v3
- [ ] Install: `zustand`, `react-router-dom`, `axios`, `@clerk/clerk-react`
- [ ] Install UI utilities: `lucide-react`, `react-hot-toast`, `recharts`
- [ ] Set up folder structure:
  ```
  src/
  ├── components/
  ├── pages/
  ├── store/       (Zustand)
  ├── hooks/
  ├── lib/         (axios instance, helpers)
  ├── types/
  └── App.tsx
  ```
- [ ] `npm run dev` renders a blank app

---

### 🗄️ STORY S0-4 — Database & Prisma Setup `(4 pts)`
**As a** developer,
**I want** PostgreSQL connected via Prisma ORM with the full schema defined,
**So that** we have a single source of truth for all data models.

#### Tasks:
- [ ] Install PostgreSQL locally (or use Docker: `docker run --name pos-db -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres`)
- [ ] Install: `prisma`, `@prisma/client`
- [ ] Initialize Prisma: `npx prisma init`
- [ ] Write full `schema.prisma` with all models:
  - `User`, `Product`, `Customer`, `Sale`, `SaleItem`
  - `Supplier`, `Purchase`, `PurchaseItem`
- [ ] Run first migration: `npx prisma migrate dev --name init`
- [ ] Verify tables created in PostgreSQL
- [ ] Configure `.env`: `DATABASE_URL`
- [ ] Add `prisma generate` to `postinstall` script

---

### ⚙️ STORY S0-5 — Environment Configuration `(2 pts)`
**As a** developer,
**I want** environment variables properly set up for both projects,
**So that** secrets are never committed to Git.

#### Tasks:
- [ ] **Backend `.env`:**
  ```env
  NODE_ENV=development
  PORT=5000
  DATABASE_URL=postgresql://postgres:secret@localhost:5432/phoneshop
  CLERK_SECRET_KEY=sk_test_...
  CLERK_WEBHOOK_SECRET=whsec_...
  CLIENT_URL=http://localhost:5173
  ```
- [ ] **Frontend `.env`:**
  ```env
  VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
  VITE_API_URL=http://localhost:5000/api
  ```
- [ ] Add both `.env` files to `.gitignore`
- [ ] Create `.env.example` templates for both

---

## ✅ Sprint 0 Acceptance Criteria

- [ ] `cd backend && npm run dev` → server running on port 5000
- [ ] `cd pos-retail-system && npm run dev` → React app on port 5173
- [ ] `npx prisma studio` → all 8 tables visible
- [ ] `GET http://localhost:5000/health` returns `200 OK`
- [ ] Both projects committed to GitHub `develop` branch

---

## 🚧 Risks & Notes

> ⚠️ PostgreSQL must be installed or Docker must be available.
> ⚠️ Clerk account must be created at clerk.com to get API keys before Sprint 1.
