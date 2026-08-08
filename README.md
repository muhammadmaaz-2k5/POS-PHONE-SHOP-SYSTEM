# 📱 Phone Shop POS System

> A full-stack **Point of Sale & Retail Management System** for a phone shop — built with React, TypeScript, Node.js, Express, PostgreSQL, Prisma ORM, and Clerk authentication.

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 🔐 **Authentication** | Clerk-powered sign in/up, protected routes, Admin & Cashier roles |
| 📊 **Dashboard** | Real-time KPIs — today's sales, profit, orders, low stock alerts |
| 🛒 **POS / Sales** | Split-screen cashier interface, cart, discount, tax, receipt printing |
| 📦 **Products** | Full inventory management with IMEI/serial tracking, stock alerts |
| 👥 **Customers** | Customer profiles with full purchase history |
| 🏭 **Suppliers** | Supplier management linked to purchase orders |
| 📥 **Purchases** | Stock replenishment with automatic inventory increment |
| 🧾 **Invoices** | Auto-generated invoice numbers, printable receipts |
| 📈 **Reports** | Daily/monthly sales, top products, cashier performance, CSV export |

---

## 🗂️ Project Structure

```
/ (workspace root)
├── .agile-v/               ← Sprint plans & agile board
├── .agents/                ← Antigravity AI rules for this project
├── .github/
│   └── workflows/          ← CI/CD GitHub Actions
├── backend/                ← Node.js + Express + TypeScript + Prisma
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── utils/
│   └── server.ts
└── pos-retail-system/      ← React + TypeScript + Tailwind + Zustand
    └── src/
        ├── components/
        ├── pages/
        ├── store/
        ├── hooks/
        ├── lib/
        └── types/
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 + TypeScript | UI framework |
| Tailwind CSS v3 | Styling |
| Zustand | Global state management |
| React Router DOM v6 | Client-side routing |
| Recharts | Charts & analytics |
| Axios | HTTP client |
| React Hook Form + Zod | Forms & validation |
| Clerk React | Authentication |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express + TypeScript | REST API server |
| Prisma ORM | Database layer |
| PostgreSQL | Relational database |
| Clerk (Express) | JWT verification middleware |
| Zod | Request validation |
| Morgan | HTTP request logging |
| Helmet | Security headers |

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 20
- PostgreSQL ≥ 15 (or Docker)
- [Clerk account](https://clerk.com) — free tier works

### 1. Clone & Install

```bash
git clone https://github.com/your-username/phone-shop-pos.git
cd phone-shop-pos

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../pos-retail-system && npm install
```

### 2. Configure Environment Variables

**Backend** — copy and edit:
```bash
cp backend/.env.example backend/.env
```

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:secret@localhost:5432/phoneshop
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
CLIENT_URL=http://localhost:5173
```

**Frontend** — copy and edit:
```bash
cp pos-retail-system/.env.example pos-retail-system/.env
```

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:5000/api
```

### 3. Set Up Database

```bash
cd backend

# Run Prisma migrations
npx prisma migrate dev --name init

# Open Prisma Studio (optional)
npx prisma studio
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd pos-retail-system && npm run dev
```

**Backend** → http://localhost:5000
**Frontend** → http://localhost:5173
**Health check** → http://localhost:5000/health

---

## 🐳 Docker Setup

Run the full stack with one command:

```bash
docker-compose up --build
```

Services started:
- `postgres` → port 5432
- `backend` → port 5000
- `frontend` → port 80

---

## 📡 API Reference

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/health` | Public | Server health check |
| POST | `/api/auth/me` | Private | Current user info |
| GET | `/api/products` | Private | List products |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| GET | `/api/customers` | Private | List customers |
| POST | `/api/customers` | Private | Create customer |
| GET | `/api/suppliers` | Admin | List suppliers |
| POST | `/api/sales` | Private | Create sale (POS checkout) |
| GET | `/api/sales` | Private | List sales/invoices |
| POST | `/api/purchases` | Admin | Create stock purchase |
| GET | `/api/analytics/dashboard` | Admin | Dashboard KPIs |
| GET | `/api/analytics/sales/daily` | Admin | Daily sales report |

> Full collection: `backend/phoneshop-api.postman_collection.json`

## 🚀 Deployment & Docker Setup

This project is fully Dockerized for production deployment.

### Prerequisites
- Docker & Docker Compose
- A PostgreSQL database (or use the one provided in the docker-compose)
- Clerk Account (for Authentication)

### Running with Docker (Production Mode)

1. Create a `.env` file in the `backend` directory with your Clerk keys:
   ```env
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=postgresql://root:password@postgres:5432/phoneshop?schema=public
   CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

2. Create a `.env` file in the `pos-retail-system` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```

3. Run the stack from the root directory:
   ```bash
   docker-compose up --build -d
   ```

This will start:
- **PostgreSQL** on port 5432
- **Backend API** on port 5000 (running Prisma migrations on startup)
- **Frontend SPA** served by Nginx on port 80

Access the app at `http://localhost`.

---

## 🛠️ Local Development

If you prefer to run the app natively:

**Backend:**
```bash
cd backend
npm install
npx prisma generate
npm run dev
```

**Frontend:**
```bash
cd pos-retail-system
npm install
npm run dev
```

---

## 📖 API Documentation

A Postman collection is provided in the repository: `phoneshop-api.postman_collection.json`. Import this into Postman to explore the endpoints.

All endpoints under `/api/*` require an active Clerk JWT in the `Authorization: Bearer <token>` header. Certain endpoints require the user to have the `admin` role set in their Clerk `publicMetadata`.

## 📅 Agile Board

Sprint planning is documented in [`.agile-v/`](.agile-v/README.md):

| Sprint | Focus | Points |
|--------|-------|--------|
| S0 | Foundation & Setup | 13 |
| S1 | Authentication (Clerk) | 18 |
| S2 | Products & Inventory | 21 |
| S3 | Customers & Suppliers | 16 |
| S4 | POS / Sales Screen | 26 |
| S5 | Purchases / Restocking | 18 |
| S6 | Dashboard & Reports | 20 |
| S7 | Polish & Deployment | 15 |

---

## 🤝 Contributing

1. Branch naming: `feature/S2-1-product-crud`
2. Commit convention: `feat:`, `fix:`, `chore:`, `docs:`
3. Open a PR → CI must pass → merge to `develop`
4. `main` is production-only — merge from `develop` after testing

---

## 📄 License

MIT © 2026 Phone Shop POS
