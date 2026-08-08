# 📦 Sprint 2 — Products & Inventory

> **Duration:** Week 3
> **Goal:** Full product management with IMEI tracking, categories, stock status, and search/filter.
> **Story Points:** 21
> **Status:** 🔵 Planned

---

## 🎯 Sprint Goal

> *"By the end of this sprint, admins can add, edit, delete, and search products. Stock levels are tracked and low-stock items are highlighted."*

---

## 🗄️ Prisma Schema — Product

```prisma
model Product {
  id            String   @id @default(cuid())
  name          String
  brand         String
  model         String
  category      String
  imei          String?  @unique
  ram           String?
  storage       String?
  color         String?
  purchasePrice Decimal  @db.Decimal(10, 2)
  sellingPrice  Decimal  @db.Decimal(10, 2)
  stock         Int      @default(0)
  minimumStock  Int      @default(5)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  saleItems     SaleItem[]
  purchaseItems PurchaseItem[]
}
```

---

## 📋 User Stories & Tasks

### 🔧 STORY S2-1 — Backend: Product CRUD API `(5 pts)`
**As a** developer,
**I want** a RESTful API for product management,
**So that** the frontend can create, read, update, and delete products.

#### Tasks:
- [ ] Create `routes/productRoutes.ts`
- [ ] Create `controllers/productController.ts` with:
  ```
  GET    /api/products          → getAllProducts (with filters, search, pagination)
  GET    /api/products/:id      → getProductById
  POST   /api/products          → createProduct  [Admin only]
  PUT    /api/products/:id      → updateProduct  [Admin only]
  DELETE /api/products/:id      → deleteProduct  [Admin only]
  GET    /api/products/low-stock → getLowStockProducts
  ```
- [ ] Query params for `getAllProducts`:
  - `?search=` (name, brand, model, imei)
  - `?category=` filter
  - `?page=` & `?limit=` pagination
  - `?sortBy=` & `?order=`
- [ ] Apply `requireRole('admin')` to POST, PUT, DELETE
- [ ] Validate all input with `zod`:
  - name, brand, model, category required
  - purchasePrice, sellingPrice must be positive numbers
  - stock ≥ 0
  - minimumStock ≥ 1
- [ ] Test all endpoints in Postman, save to Postman collection

---

### 📝 STORY S2-2 — Frontend: Products List Page `(5 pts)`
**As an** admin,
**I want** to see all products in a searchable, filterable table,
**So that** I can quickly find any product.

#### Tasks:
- [ ] Create `pages/ProductsPage.tsx`
- [ ] Build `components/products/ProductsTable.tsx`:
  - Columns: Image placeholder, Name, Brand, Category, IMEI, Stock, Price, Actions
  - Row color: 🔴 red if `stock ≤ minimumStock`
  - Action buttons: Edit ✏️, Delete 🗑️
- [ ] Build `components/products/ProductFilters.tsx`:
  - Search input (debounced 300ms)
  - Category dropdown filter
  - Stock status toggle (All / Low Stock)
- [ ] Pagination component (Previous / Next / Page numbers)
- [ ] Loading skeleton while fetching
- [ ] Empty state: "No products found" illustration
- [ ] Create Zustand store: `useProductStore`:
  ```ts
  // State: products, total, page, filters, isLoading
  // Actions: fetchProducts, setFilter, setPage
  ```

---

### ➕ STORY S2-3 — Frontend: Add / Edit Product Modal `(5 pts)`
**As an** admin,
**I want** to add and edit products through a form,
**So that** I can manage inventory without a separate page.

#### Tasks:
- [ ] Create `components/products/ProductFormModal.tsx` (used for both Add & Edit)
- [ ] Form fields:
  - Name * (text)
  - Brand * (text)
  - Model * (text)
  - Category * (select: Phones, Tablets, Accessories, Chargers, Cases, Other)
  - IMEI / Serial Number (text, optional)
  - RAM (select: 4GB, 6GB, 8GB, 12GB, 16GB, Other)
  - Storage (select: 64GB, 128GB, 256GB, 512GB, 1TB, Other)
  - Color (text)
  - Purchase Price * (number)
  - Selling Price * (number)
  - Stock * (number)
  - Minimum Stock * (number, default: 5)
- [ ] Client-side validation with `react-hook-form` + `zod`
- [ ] Show profit margin: `((sellingPrice - purchasePrice) / purchasePrice * 100).toFixed(1)%`
- [ ] On submit: POST/PUT to API → close modal → refresh table → toast success
- [ ] Confirm delete dialog before DELETE

---

### 🏷️ STORY S2-4 — Stock Status & Low Stock Indicator `(3 pts)`
**As an** admin,
**I want** to see which products are low on stock,
**So that** I can reorder before running out.

#### Tasks:
- [ ] `GET /api/products/low-stock` → products where `stock ≤ minimumStock`
- [ ] Dashboard widget: "⚠️ Low Stock Products" count badge (built here, used in Sprint 6)
- [ ] Products table: red badge "LOW STOCK" on affected rows
- [ ] Dedicated filter "Show Low Stock Only" toggle in ProductFilters
- [ ] Toast notification on login if >5 products are low stock

---

### 🧪 STORY S2-5 — IMEI Uniqueness & Validation `(3 pts)`
**As a** shop owner,
**I want** each phone to have a unique IMEI tracked,
**So that** I can identify individual units sold.

#### Tasks:
- [ ] IMEI field: 15-digit numeric validation (or null for non-phone products)
- [ ] Backend: Prisma unique constraint on `imei` (already in schema)
- [ ] Handle duplicate IMEI error: return `{ error: "IMEI already registered" }`
- [ ] Frontend: show IMEI validation error inline in form
- [ ] IMEI searchable in the main product search

---

## 🎨 UI Components to Build

| Component | Description |
|-----------|-------------|
| `ProductsPage.tsx` | Main products list page |
| `ProductsTable.tsx` | Table with stock badges and action buttons |
| `ProductFilters.tsx` | Search + category filter + stock toggle |
| `ProductFormModal.tsx` | Add/Edit product form modal |
| `ConfirmDialog.tsx` | Reusable delete confirmation dialog |
| `StockBadge.tsx` | "LOW STOCK" / "IN STOCK" badge component |
| `Pagination.tsx` | Reusable pagination component |

---

## ✅ Sprint 2 Acceptance Criteria

- [ ] All 5 CRUD endpoints work and are tested in Postman
- [ ] Products list shows with search and category filter working
- [ ] Low stock products are highlighted in red with a badge
- [ ] Add/Edit form validates all fields before submitting
- [ ] IMEI uniqueness is enforced (backend + frontend error shown)
- [ ] Pagination works correctly with 10 products per page default
- [ ] Only admins can create/edit/delete (cashiers see read-only view)

---

## 🚧 Risks & Notes

> ⚠️ IMEI is optional — not all accessories have one. Allow null.
> ⚠️ Profit margin shown in form is a nice-to-have, implement last.
