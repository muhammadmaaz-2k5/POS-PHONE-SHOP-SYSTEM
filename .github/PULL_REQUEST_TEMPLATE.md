## 📋 Pull Request

### 📌 Linked Sprint Story
<!-- e.g. Closes S2-1 — Product CRUD Backend -->
Closes **S_-_**: _description_

---

### 🧩 What does this PR do?
<!-- Brief description of the change -->

---

### 🔍 Type of Change
- [ ] ✨ `feat` — New feature
- [ ] 🐛 `fix` — Bug fix
- [ ] 🔧 `chore` — Maintenance / dependency update
- [ ] 📝 `docs` — Documentation only
- [ ] ♻️ `refactor` — Code refactor (no behavior change)
- [ ] 🧪 `test` — Adding or updating tests
- [ ] 🚀 `ci` — CI/CD pipeline changes

---

### 📁 Changed Areas
- [ ] Backend (`backend/`)
- [ ] Frontend (`pos-retail-system/`)
- [ ] Database schema (`prisma/schema.prisma`)
- [ ] GitHub Actions (`.github/workflows/`)
- [ ] Agile docs (`.agile-v/`)

---

### ✅ Checklist

#### General
- [ ] Code is self-documented (JSDoc where needed)
- [ ] No `console.log` left in the code
- [ ] No hardcoded secrets or URLs
- [ ] No `any` TypeScript types introduced
- [ ] `tsc --noEmit` passes with 0 errors

#### Backend (if changed)
- [ ] New endpoints are tested in Postman
- [ ] Input validation with `zod` is in place
- [ ] Auth middleware applied (`requireAuth`, `requireRole`)
- [ ] Prisma migration created for schema changes
- [ ] `schema.prisma` changes are backwards-compatible

#### Frontend (if changed)
- [ ] UI tested at 1280px and 768px widths
- [ ] Loading state added for async operations
- [ ] Error state handled (API error → toast notification)
- [ ] Form validation with `react-hook-form` + `zod`
- [ ] Zustand store updated if new state is needed

#### Deployment
- [ ] New env variables added to `.env.example` (both projects)
- [ ] New env variables documented in `README.md`

---

### 📸 Screenshots / Recordings
<!-- Add before/after screenshots for UI changes -->
| Before | After |
|--------|-------|
| _N/A_ | _N/A_ |

---

### 📝 Notes for Reviewer
<!-- Anything the reviewer should pay special attention to -->
