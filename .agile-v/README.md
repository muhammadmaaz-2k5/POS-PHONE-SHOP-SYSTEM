# 📱 Phone Shop Retail / POS System — Agile Board

> **Project:** Phone Shop POS System
> **Methodology:** Agile Scrum
> **Sprint Length:** 1 Week
> **Total Sprints:** 8
> **Estimated Duration:** ~8 Weeks

---

## 🧑‍💻 Tech Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| **Frontend**   | React, TypeScript, Tailwind CSS, Zustand |
| **Auth**       | Clerk                               |
| **Backend**    | Node.js, Express.js, TypeScript     |
| **Database**   | PostgreSQL + Prisma ORM             |
| **Tools**      | Git/GitHub, Postman, Docker (opt.)  |

---

## 📅 Sprint Index

| Sprint | Name                             | Focus                              | Status     |
|--------|----------------------------------|------------------------------------|------------|
| S0     | 🏗️ Foundation & Setup          | Repo, DB, Prisma, Clerk config     | ✅ Complete |
| S1     | 🔐 Authentication               | Clerk, roles, user sync to DB      | ✅ Complete |
| S2     | 📦 Products & Inventory         | CRUD, IMEI, categories, stock      | ✅ Complete |
| S3     | 👥 Customers & Suppliers        | CRUD, search, purchase history     | ✅ Complete |
| S4     | 🛒 POS / Sales Screen           | Cashier UI, cart, checkout         | ✅ Complete |
| S5     | 📥 Purchases / Restocking       | Supplier purchases, stock increase | ✅ Complete |
| S6     | 📊 Dashboard & Reports          | Metrics, charts, analytics         | ✅ Complete |
| S7     | 🚀 Polish & Deployment          | Testing, UX, Docker, deploy        | 🟡 Next    |

---

## 📁 Project Structure

```
/ (workspace root)
├── .agile-v/                   ← 📌 You are here
│   ├── README.md
│   ├── sprint-0-setup.md
│   ├── sprint-1-auth.md
│   ├── sprint-2-products.md
│   ├── sprint-3-customers-suppliers.md
│   ├── sprint-4-pos.md
│   ├── sprint-5-purchases.md
│   ├── sprint-6-dashboard-reports.md
│   └── sprint-7-polish-deploy.md
├── backend/                    ← Node.js + Express + TypeScript + Prisma
└── pos-retail-system/          ← React + TypeScript + Tailwind + Zustand
```

---

## 🗄️ Database Schema Summary

```
User            → clerkUserId, name, email, role
Product         → name, brand, model, category, imei, ram, storage, color,
                  purchasePrice, sellingPrice, stock, minimumStock
Customer        → name, phone, email, address
Sale            → invoiceNumber, customerId, userId, subtotal, discount, tax,
                  total, paymentMethod
SaleItem        → saleId, productId, quantity, price, subtotal
Supplier        → name, phone, email, address, company
Purchase        → supplierId, userId, total
PurchaseItem    → purchaseId, productId, quantity, price, subtotal
```

---

## 🎯 Definition of Done (DoD)

A user story is **Done** when:
- [ ] Feature is implemented (frontend + backend)
- [ ] API endpoint tested in Postman
- [ ] UI renders correctly on desktop
- [ ] No TypeScript errors (`tsc --noEmit` passes)
- [ ] Prisma migration applied
- [ ] Code committed to GitHub

---

## 📊 Velocity Tracking

| Sprint | Points Planned | Points Done | Velocity |
|--------|---------------|-------------|----------|
| S0     | 13            | —           | —        |
| S1     | 18            | —           | —        |
| S2     | 21            | —           | —        |
| S3     | 16            | —           | —        |
| S4     | 26            | —           | —        |
| S5     | 18            | —           | —        |
| S6     | 20            | —           | —        |
| S7     | 15            | —           | —        |
