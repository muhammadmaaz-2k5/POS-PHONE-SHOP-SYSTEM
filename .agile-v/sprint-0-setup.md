# 🏗️ Sprint 0 — Foundation & Project Setup

> **Duration:** Week 1
> **Goal:** Bootstrap both projects, connect the database, and ensure the team can run everything locally.
> **Story Points:** 13
> **Status:** ✅ Complete

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
- [x] Create GitHub repository: `POS-PHONE-SHOP-SYSTEM`
- [x] Initialize `backend/` — Node.js + Express + TypeScript
- [x] Initialize `pos-retail-system/` — Vite + React + TypeScript + Tailwind
- [x] Add `.gitignore` for both (node_modules, .env, dist)
- [x] Create `README.md` at root level
- [x] Set up branch strategy: `main`, `develop`, `feature/*`

---

### 🔧 STORY S0-2 — Backend Project Initialization `(3 pts)`
**As a** developer,
**I want** a typed Express backend with TypeScript and linting configured,
**So that** we write safe, consistent code from day one.

#### Tasks:
- [x] Install: `express`, `typescript`, `ts-node`, `@types/express`, `@types/node`
- [x] Install dev: `nodemon`, `eslint`, `prettier`, `@typescript-eslint/parser`
- [x] Configure `tsconfig.json` (strict mode, ES2020 target)
- [x] Configure `eslint.config.mjs`
- [x] Set up folder structure (config/, controllers/, middleware/, routes/, utils/)
- [x] `server.ts` entry point with graceful shutdown
- [x] `src/app.ts` with Clerk middleware, CORS, rate limiting

---

### 🎨 STORY S0-3 — Frontend Project Initialization `(2 pts)`
**As a** developer,
**I want** a Vite + React + TypeScript app with Tailwind CSS configured,
**So that** I can start building UI components immediately.

#### Tasks:
- [x] Scaffold: `npm create vite@latest pos-retail-system -- --template react`
- [x] Install & configure Tailwind CSS v3 + PostCSS
- [x] Install: `zustand`, `react-router-dom`, `axios`, `@clerk/clerk-react`
- [x] Install UI utilities: `lucide-react`, `react-hot-toast`, `recharts`, `react-hook-form`, `zod`
- [x] Set up folder structure (components/, pages/, store/, hooks/, lib/, types/)
- [x] `App.tsx` with Router + Toaster
- [x] `src/types/index.ts` — all domain types
- [x] `src/lib/axios.ts` — centralized Axios instance

---

### 🗄️ STORY S0-4 — Database & Prisma Setup `(4 pts)`
**As a** developer,
**I want** PostgreSQL connected via Prisma ORM with the full schema defined,
**So that** we have a single source of truth for all data models.

#### Tasks:
- [x] Install: `prisma@6`, `@prisma/client@6`
- [x] Write full `schema.prisma` with all 8 models
- [x] `prisma generate` runs successfully
- [x] Configure `.env`: `DATABASE_URL`
- [x] Add `prisma generate` to `postinstall` script
- [ ] Run first migration: `npx prisma migrate dev --name init` *(needs real DB)*

---

### ⚙️ STORY S0-5 — Environment Configuration `(2 pts)`
**As a** developer,
**I want** environment variables properly set up for both projects,
**So that** secrets are never committed to Git.

#### Tasks:
- [x] **Backend `.env`** — PostgreSQL + Clerk keys configured
- [x] **Frontend `.env`** — `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_API_URL`
- [x] Both `.env` files in `.gitignore`
- [x] `.env.example` templates for both

---

## ✅ Sprint 0 Acceptance Criteria

- [x] `cd backend && npm run type-check` → 0 errors
- [x] `cd pos-retail-system && npm run type-check` → 0 errors
- [x] `npx prisma validate` → schema valid 🚀
- [x] GitHub CI workflows passing
- [ ] `GET http://localhost:5000/health` returns `200 OK` *(needs PostgreSQL running)*
- [ ] `npx prisma migrate dev --name init` *(needs PostgreSQL running)*

---

## 🚧 Risks & Notes

> ⚠️ PostgreSQL must be installed or Docker must be available.
> ⚠️ Clerk account must be created at clerk.com to get API keys before Sprint 1.
