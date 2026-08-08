# 👥 Sprint 3 — Customers & Suppliers

> **Duration:** Week 4
> **Goal:** Full CRUD for customers and suppliers, with customer purchase history linked to sales.
> **Story Points:** 16
> **Status:** 🔵 Planned

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
- [ ] Create `routes/customerRoutes.ts`
- [ ] Create `controllers/customerController.ts`:
  ```
  GET    /api/customers           → getAllCustomers (search, pagination)
  GET    /api/customers/:id       → getCustomerById
  GET    /api/customers/:id/sales → getCustomerPurchaseHistory
  POST   /api/customers           → createCustomer
  PUT    /api/customers/:id       → updateCustomer
  DELETE /api/customers/:id       → deleteCustomer
  ```
- [ ] Search by name, phone, email
- [ ] `getCustomerPurchaseHistory` → returns all `Sale` records for customer with items
- [ ] Validate: name required, phone/email must be unique if provided
- [ ] Test all endpoints in Postman

---

### 🏭 STORY S3-2 — Backend: Supplier API `(3 pts)`
**As a** developer,
**I want** a RESTful API for supplier management,
**So that** purchases can reference a supplier.

#### Tasks:
- [ ] Create `routes/supplierRoutes.ts`
- [ ] Create `controllers/supplierController.ts`:
  ```
  GET    /api/suppliers     → getAllSuppliers (search, pagination)
  GET    /api/suppliers/:id → getSupplierById
  POST   /api/suppliers     → createSupplier  [Admin only]
  PUT    /api/suppliers/:id → updateSupplier  [Admin only]
  DELETE /api/suppliers/:id → deleteSupplier  [Admin only]
  ```
- [ ] Validate: name required
- [ ] Apply `requireRole('admin')` to POST, PUT, DELETE
- [ ] Test in Postman

---

### 📋 STORY S3-3 — Frontend: Customers Page `(5 pts)`
**As a** staff member,
**I want** to view, add, edit, and search customers,
**So that** I can look up a customer during a sale.

#### Tasks:
- [ ] Create `pages/CustomersPage.tsx`
- [ ] Build `components/customers/CustomersTable.tsx`:
  - Columns: Name, Phone, Email, Address, Total Purchases, Actions
  - "Total Purchases" shows count of sales
- [ ] Customer search (by name, phone, email) — debounced
- [ ] `components/customers/CustomerFormModal.tsx`:
  - Fields: Name *, Phone, Email, Address
  - Inline validation
- [ ] `components/customers/CustomerDetailModal.tsx`:
  - Shows customer info + purchase history table
  - Purchase history: Invoice #, Date, Items count, Total, Payment method
- [ ] Create Zustand store `useCustomerStore`
- [ ] Pagination

---

### 🏭 STORY S3-4 — Frontend: Suppliers Page `(4 pts)`
**As an** admin,
**I want** to manage suppliers,
**So that** I can track where stock is purchased from.

#### Tasks:
- [ ] Create `pages/SuppliersPage.tsx`
- [ ] Build `components/suppliers/SuppliersTable.tsx`:
  - Columns: Name, Company, Phone, Email, Address, Total Purchases, Actions
- [ ] Supplier search (by name, company)
- [ ] `components/suppliers/SupplierFormModal.tsx`:
  - Fields: Name *, Company, Phone, Email, Address
- [ ] Only admins see the Add/Edit/Delete buttons
- [ ] Create Zustand store `useSupplierStore`

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

- [ ] All customer API endpoints work and are Postman tested
- [ ] All supplier API endpoints work and are Postman tested
- [ ] Customer search returns results filtered by name, phone, email
- [ ] Clicking a customer shows their full purchase history
- [ ] Suppliers are only editable by admins (UI hides buttons + API returns 403)
- [ ] Deleting a customer with existing sales → returns 400 with clear error message

---

## 🚧 Risks & Notes

> ⚠️ Prevent deletion of customers who have existing sales (referential integrity).
> ⚠️ Phone/email uniqueness — allow null but reject duplicates if provided.
> ℹ️ Customer selection during POS checkout is built in Sprint 4 — this sprint only builds the management screens.
