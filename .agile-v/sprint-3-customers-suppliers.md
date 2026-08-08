# 👥 Sprint 3 — Customers & Suppliers

> **Duration:** Week 4
> **Goal:** Full CRUD for customers and suppliers, with customer purchase history linked to sales.
> **Story Points:** 16
> **Status:** ✅ Complete

---

## 🎯 Sprint Goal

> *"By the end of this sprint, staff can add and search customers and suppliers. Each customer has a viewable purchase history."*

---

## 🗄️ Prisma Schema

```prisma
model Customer {
  id        String   @id @default(cuid())
  name      String
  phone     String?  @unique
  email     String?  @unique
  address   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  sales     Sale[]
}

model Supplier {
  id        String     @id @default(cuid())
  name      String
  phone     String?
  email     String?
  address   String?
  company   String?
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  purchases Purchase[]
}
```

---

## 📋 User Stories & Tasks

### 👤 STORY S3-1 — Backend: Customer API `(4 pts)`
**As a** developer,
**I want** a RESTful API for customer management,
**So that** customers can be linked to sales.

#### Tasks:
- [x] Create `routes/customerRoutes.ts`
- [x] Create `controllers/customerController.ts`:
  ```
  GET    /api/customers           → getAllCustomers (search, pagination)
  GET    /api/customers/:id       → getCustomerById
  GET    /api/customers/:id/sales → getCustomerPurchaseHistory
  POST   /api/customers           → createCustomer
  PUT    /api/customers/:id       → updateCustomer
  DELETE /api/customers/:id       → deleteCustomer
  ```
- [x] Search by name, phone, email
- [x] `getCustomerPurchaseHistory` → returns all `Sale` records for customer with items
- [x] Validate: name required, phone/email must be unique if provided
- [x] Test all endpoints in Postman

---

### 🏭 STORY S3-2 — Backend: Supplier API `(3 pts)`
**As a** developer,
**I want** a RESTful API for supplier management,
**So that** purchases can reference a supplier.

#### Tasks:
- [x] Create `routes/supplierRoutes.ts`
- [x] Create `controllers/supplierController.ts`:
  ```
  GET    /api/suppliers     → getAllSuppliers (search, pagination)
  GET    /api/suppliers/:id → getSupplierById
  POST   /api/suppliers     → createSupplier  [Admin only]
  PUT    /api/suppliers/:id → updateSupplier  [Admin only]
  DELETE /api/suppliers/:id → deleteSupplier  [Admin only]
  ```
- [x] Validate: name required
- [x] Apply `requireRole('admin')` to POST, PUT, DELETE
- [x] Test in Postman

---

### 📋 STORY S3-3 — Frontend: Customers Page `(5 pts)`
**As a** staff member,
**I want** to view, add, edit, and search customers,
**So that** I can look up a customer during a sale.

#### Tasks:
- [x] Create `pages/CustomersPage.tsx`
- [x] Build `components/customers/CustomersTable.tsx`:
  - Columns: Name, Phone, Email, Address, Total Purchases, Actions
  - "Total Purchases" shows count of sales
- [x] Customer search (by name, phone, email) — debounced
- [x] `components/customers/CustomerFormModal.tsx`:
  - Fields: Name *, Phone, Email, Address
  - Inline validation
- [x] `components/customers/CustomerDetailModal.tsx`:
  - Shows customer info + purchase history table
  - Purchase history: Invoice #, Date, Items count, Total, Payment method
- [x] Create Zustand store `useCustomerStore`
- [x] Pagination

---

### 🏭 STORY S3-4 — Frontend: Suppliers Page `(4 pts)`
**As an** admin,
**I want** to manage suppliers,
**So that** I can track where stock is purchased from.

#### Tasks:
- [x] Create `pages/SuppliersPage.tsx`
- [x] Build `components/suppliers/SuppliersTable.tsx`:
  - Columns: Name, Company, Phone, Email, Address, Total Purchases, Actions
- [x] Supplier search (by name, company)
- [x] `components/suppliers/SupplierFormModal.tsx`:
  - Fields: Name *, Company, Phone, Email, Address
- [x] Only admins see the Add/Edit/Delete buttons
- [x] Create Zustand store `useSupplierStore`

---

## 🎨 UI Components to Build

| Component | Description |
|-----------|-------------|
| `CustomersPage.tsx` | Main customers list page |
| `CustomersTable.tsx` | Searchable customer table |
| `CustomerFormModal.tsx` | Add/Edit customer form |
| `CustomerDetailModal.tsx` | Customer info + purchase history |
| `SuppliersPage.tsx` | Main suppliers list page |
| `SuppliersTable.tsx` | Searchable supplier table |
| `SupplierFormModal.tsx` | Add/Edit supplier form |

---

## ✅ Sprint 3 Acceptance Criteria

- [x] All customer API endpoints work and are Postman tested
- [x] All supplier API endpoints work and are Postman tested
- [x] Customer search returns results filtered by name, phone, email
- [x] Clicking a customer shows their full purchase history
- [x] Suppliers are only editable by admins (UI hides buttons + API returns 403)
- [x] Deleting a customer with existing sales → returns 400 with clear error message

---

## 🚧 Risks & Notes

> ⚠️ Prevent deletion of customers who have existing sales (referential integrity).
> ⚠️ Phone/email uniqueness — allow null but reject duplicates if provided.
> ℹ️ Customer selection during POS checkout is built in Sprint 4 — this sprint only builds the management screens.
