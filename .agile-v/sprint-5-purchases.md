# 📥 Sprint 5 — Purchases / Stock Replenishment

> **Duration:** Week 6
> **Goal:** Allow admins to record stock purchases from suppliers, automatically incrementing product inventory.
> **Story Points:** 18
> **Status:** ✅ Complete

---

## 🎯 Sprint Goal

> *"By the end of this sprint, admins can create purchase orders from suppliers, add multiple products with quantities and prices, and the stock is automatically increased after saving."*

---

## 🗄️ Prisma Schema — Purchase & PurchaseItem

```prisma
model Purchase {
  id         String         @id @default(cuid())
  supplierId String
  supplier   Supplier       @relation(fields: [supplierId], references: [id])
  userId     String
  user       User           @relation(fields: [userId], references: [id])
  total      Decimal        @db.Decimal(10, 2)
  notes      String?
  createdAt  DateTime       @default(now())
  items      PurchaseItem[]
}

model PurchaseItem {
  id         String   @id @default(cuid())
  purchaseId String
  purchase   Purchase @relation(fields: [purchaseId], references: [id])
  productId  String
  product    Product  @relation(fields: [productId], references: [id])
  quantity   Int
  price      Decimal  @db.Decimal(10, 2)
  subtotal   Decimal  @db.Decimal(10, 2)
}
```

---

## 📋 User Stories & Tasks

### 🔧 STORY S5-1 — Backend: Purchases API `(5 pts)`
**As a** developer,
**I want** a purchase API that creates purchases and increments stock,
**So that** restocking from suppliers is tracked.

#### Tasks:
- [x] Create `routes/purchaseRoutes.ts`
- [x] Create `controllers/purchaseController.ts`:
  ```
  GET  /api/purchases      → getAllPurchases (date range, supplier filter, pagination)
  GET  /api/purchases/:id  → getPurchaseById (with items + supplier + user)
  POST /api/purchases      → createPurchase  [Admin only]
  ```
- [x] `createPurchase` Prisma transaction:
  ```ts
  // 1. Validate all products exist
  // 2. Calculate item subtotals and total
  // 3. prisma.$transaction([
  //      createPurchase + createPurchaseItems,
  //      increment stock for each product: stock += quantity
  //    ])
  // 4. Return full purchase with items
  ```
- [x] Apply `requireRole('admin')` to all purchase mutations
- [x] Validate: supplierId required, at least 1 item, quantity > 0, price > 0
- [x] Test in Postman

---

### 📋 STORY S5-2 — Frontend: Purchases List Page `(4 pts)`
**As an** admin,
**I want** to see a history of all stock purchases,
**So that** I can track spending and restocking history.

#### Tasks:
- [x] Create `pages/PurchasesPage.tsx`
- [x] Build `components/purchases/PurchasesTable.tsx`:
  - Columns: Invoice Date, Supplier, Items Count, Total, Recorded By, Actions (View)
  - Formatted date/time
- [x] Filter by date range (from/to date pickers)
- [x] Filter by supplier dropdown
- [x] `components/purchases/PurchaseDetailModal.tsx`:
  - Supplier info
  - Purchase date & recorded by
  - Table: Product | Qty | Unit Price | Subtotal
  - Total at bottom
- [x] Pagination
- [x] Create Zustand store `usePurchaseStore`

---

### ➕ STORY S5-3 — Frontend: Create Purchase Form `(6 pts)`
**As an** admin,
**I want** a form to record a new stock purchase,
**So that** I can log what I bought, from whom, and at what price.

#### Tasks:
- [x] Create `pages/CreatePurchasePage.tsx` (full page, not modal — complex form)
- [x] Section 1 — Purchase Info:
  - Supplier select (searchable dropdown from `/api/suppliers`)
  - Date (defaults to today)
  - Notes (textarea, optional)
- [x] Section 2 — Items Table (dynamic rows):
  ```
  | Product (searchable) | Qty | Unit Cost | Subtotal |  [×] |
  | Product (searchable) | Qty | Unit Cost | Subtotal |  [×] |
  [ + Add Item ]
  ```
  - Product select: searchable, shows current stock level in option
  - Qty: number input, min 1
  - Unit Cost: number input (purchase price, may differ from stored purchasePrice)
  - Subtotal: auto-calculated (qty × unit cost), read-only
- [x] Running Total at bottom
- [x] "Save Purchase" → POST to API → show success → navigate to `/purchases`
- [x] "Cancel" → navigate back with confirm dialog if items exist
- [x] Validate: at least 1 item, all fields required per row
- [x] Handle API error (e.g. product not found) with form-level error

---

### 📊 STORY S5-4 — Stock Impact Verification `(3 pts)`
**As an** admin,
**I want** to verify that stock was updated after a purchase,
**So that** I know the system is accurate.

#### Tasks:
- [ ] After saving purchase, display: "✅ Stock updated: +X units for Y products"
- [ ] Navigate to Products page filtered to updated products
- [ ] In Purchase Detail modal, add "View Updated Products" link
- [ ] Backend: log stock change in purchase response (`{ productId, previousStock, newStock }`)

---

## 🎨 UI Components to Build

| Component | Description |
|-----------|-------------|
| `PurchasesPage.tsx` | Purchase history list |
| `PurchasesTable.tsx` | Filterable purchases table |
| `PurchaseDetailModal.tsx` | Full purchase detail view |
| `CreatePurchasePage.tsx` | Multi-item purchase form |
| `PurchaseItemRow.tsx` | Dynamic row in create form |
| `SupplierSelect.tsx` | Reusable searchable supplier dropdown |

---

## ✅ Sprint 5 Acceptance Criteria

- [x] Admin can create a purchase with multiple products from a supplier
- [x] Stock is correctly incremented for each product in the purchase
- [x] Purchase list shows all historical purchases with filters
- [x] Purchase detail view shows all items with prices
- [x] Cashier role cannot access purchase creation (403 + hidden UI)
- [x] Creating purchase with invalid product ID returns proper error

---

## 🚧 Risks & Notes

> ⚠️ Stock increment must be in the same Prisma transaction as purchase creation.
> ⚠️ Unit cost in a purchase may differ from the product's stored `purchasePrice` — this is intentional.
> ℹ️ Purchase deletion is intentionally not implemented — purchases are permanent records.
