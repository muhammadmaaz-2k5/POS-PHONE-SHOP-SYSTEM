# Antigravity Agent Rules — Phone Shop POS System

> These rules apply to ALL AI-assisted work in this workspace.
> Antigravity must follow these guidelines at all times.

---

## 🗂️ Project Identity

- **Project Name:** Phone Shop POS System
- **Type:** Full-stack Monorepo (Frontend + Backend)
- **Sprints:** See `.agile-v/` folder for task breakdown

---

## 📁 Folder Map

```
/ (workspace root)
├── .agile-v/               ← Sprint planning docs — do NOT modify without asking
├── .agents/                ← This file lives here
├── .github/workflows/      ← CI/CD pipelines
├── backend/                ← Express + TypeScript + Prisma
└── pos-retail-system/      ← React + TypeScript + Tailwind + Zustand
```

> ⚠️ Never create files outside of `backend/` or `pos-retail-system/` unless explicitly asked.

---

## 🧑‍💻 Tech Stack Rules

### Backend (`backend/`)
- Language: **TypeScript** (strict mode). Never write plain `.js` files.
- Framework: **Express.js**
- ORM: **Prisma** with **PostgreSQL**. Never use raw SQL unless Prisma cannot handle it.
- Auth: **Clerk** via `@clerk/express`. NEVER implement custom JWT or password auth.
- Validation: **Zod** for all request body/query/param validation.
- Error handling: Always use `next(error)` — never `res.json({ error })` inline.
- Response format: Always use `sendResponse(res, statusCode, success, message, data)` utility.
- File structure:
  ```
  src/
  ├── config/        ← db, env config
  ├── controllers/   ← business logic only
  ├── middleware/    ← auth, validate, errorHandler
  ├── routes/        ← route definitions only
  └── utils/         ← helpers (asyncHandler, ApiError, sendResponse)
  ```

### Frontend (`pos-retail-system/`)
- Language: **TypeScript** (strict). Never write `.jsx` files.
- Styling: **Tailwind CSS v3 only**. Never use inline styles or custom CSS files unless for print media queries.
- State: **Zustand**. Never use Redux or Context for global state.
- HTTP: **Axios** with a centralized instance in `src/lib/axios.ts`. Never use `fetch` directly.
- Forms: **React Hook Form + Zod**. Never use uncontrolled forms.
- Icons: **lucide-react** only. Never mix icon libraries.
- Charts: **Recharts** only.
- Notifications: **react-hot-toast** only. Never use `alert()`.
- Routing: **React Router DOM v6** with `<Outlet />` layout patterns.

---

## 🔐 Authentication Rules

- Auth is handled **exclusively by Clerk**. Do NOT:
  - Create password fields in any model
  - Generate or validate JWT tokens manually
  - Create login/register forms — Clerk's `<SignIn />` / `<SignUp />` handle this
- Backend: every protected route must use `requireAuth()` from `@clerk/express`
- Frontend: every protected page must be wrapped in `<ProtectedRoute />`
- User roles are stored in Clerk `publicMetadata.role` AND synced to `User.role` in DB

---

## 🗄️ Database Rules

- **Never** modify `schema.prisma` without also running `npx prisma migrate dev`
- **Never** delete a migration file
- All monetary values use `Decimal` type with `@db.Decimal(10, 2)`
- All IDs use `@id @default(cuid())`
- All models must have `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt`
- Use **Prisma transactions** (`prisma.$transaction`) for any operation that touches more than one table (e.g., creating a sale + decrementing stock)

---

## 📝 Code Style Rules

### General
- Use `async/await` — never `.then()/.catch()` chains
- Use `const` by default, `let` only when reassignment is needed
- Prefer early returns over deep nesting
- All functions must have explicit TypeScript return types
- No `any` type — use `unknown` and narrow, or define proper types in `src/types/`

### Naming Conventions
| Thing | Convention | Example |
|-------|-----------|---------|
| Files (components) | PascalCase | `ProductCard.tsx` |
| Files (utils/hooks) | camelCase | `useCartStore.ts` |
| Files (routes/controllers) | camelCase | `productController.ts` |
| React components | PascalCase | `ProductCard` |
| Zustand stores | camelCase with `use` prefix | `useCartStore` |
| Types/Interfaces | PascalCase | `CartItem`, `ProductFilters` |
| API route handlers | camelCase | `getAllProducts`, `createSale` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_CART_ITEMS` |

### Comments
- Add JSDoc comments (`/** ... */`) to all exported functions
- Mark TODO items as `// TODO(S2-1): description` referencing the sprint story
- Mark FIXME items as `// FIXME: description`

---

## 🚫 Prohibited Patterns

- ❌ Never use `console.log` in production code — use a logger
- ❌ Never hard-code secrets, API keys, or URLs — always use `.env`
- ❌ Never commit `.env` files — they are in `.gitignore`
- ❌ Never skip Zod validation on any backend route that accepts user input
- ❌ Never use `prisma.findMany()` without a `take` limit (max 100 for lists)
- ❌ Never use `dangerouslySetInnerHTML` in React components
- ❌ Never write `any` types — use proper TypeScript
- ❌ Never create a new component file larger than 300 lines — split it

---

## ✅ Before Every Commit Checklist

- [ ] `tsc --noEmit` passes with 0 errors (both projects)
- [ ] No `console.log` left in committed code
- [ ] New API endpoints are tested in Postman
- [ ] Prisma schema changes have a corresponding migration
- [ ] Environment variable keys are added to `.env.example`
- [ ] Component is responsive (tested at 1280px and 768px widths)

---

## 🏃 Dev Commands Reference

```bash
# Backend
cd backend
npm run dev          # Start with nodemon
npm run build        # Compile TypeScript
npx prisma studio    # Open DB GUI
npx prisma migrate dev --name <name>  # Create migration

# Frontend
cd pos-retail-system
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run type-check   # TypeScript check only
```

---

## 📐 Sprint Alignment

When implementing a feature, always check the relevant sprint file in `.agile-v/` first:
- Sprint 0 → `.agile-v/sprint-0-setup.md`
- Sprint 1 → `.agile-v/sprint-1-auth.md`
- Sprint 2 → `.agile-v/sprint-2-products.md`
- Sprint 3 → `.agile-v/sprint-3-customers-suppliers.md`
- Sprint 4 → `.agile-v/sprint-4-pos.md`
- Sprint 5 → `.agile-v/sprint-5-purchases.md`
- Sprint 6 → `.agile-v/sprint-6-dashboard-reports.md`
- Sprint 7 → `.agile-v/sprint-7-polish-deploy.md`

Mark tasks `[x]` as they are completed in the sprint files.
