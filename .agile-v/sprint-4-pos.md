# 🛒 Sprint 4 — POS / Sales Screen

> **Duration:** Week 5
> **Goal:** Build the full cashier POS interface — product search, cart, discount, payment, receipt generation, and automatic inventory deduction.
> **Story Points:** 26
> **Status:** 🔵 Planned

---

## 🎯 Sprint Goal

> *"By the end of this sprint, a cashier can search products, add them to a cart, apply discounts, select payment method, complete a sale, print a receipt, and the inventory is automatically reduced."*

---

## 🗄️ Prisma Schema — Sale & SaleItem

```prisma
model Sale {
  id            String      @id @default(cuid())
  invoiceNumber String      @unique
  customerId    String?
  customer      Customer?   @relation(fields: [customerId], references: [id])
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  subtotal      Decimal     @db.Decimal(10, 2)
  discount      Decimal     @default(0) @db.Decimal(10, 2)
  tax           Decimal     @default(0) @db.Decimal(10, 2)
  total         Decimal     @db.Decimal(10, 2)
  paymentMethod String      // "cash" | "card" | "other"
  createdAt     DateTime    @default(now())
  items         SaleItem[]
}

model SaleItem {
  id        String  @id @default(cuid())
  saleId    String
  sale      Sale    @relation(fields: [saleId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Decimal @db.Decimal(10, 2)
  subtotal  Decimal @db.Decimal(10, 2)
}
```

---

## 📋 User Stories & Tasks

### 🔧 STORY S4-1 — Backend: Sales API `(6 pts)`
**As a** developer,
**I want** a complete sales API that creates sales and decrements stock,
**So that** every POS transaction is recorded and inventory stays accurate.

#### Tasks:
- [ ] Create `routes/saleRoutes.ts`
- [ ] Create `controllers/saleController.ts`:
  ```
  GET  /api/sales          → getAllSales (date range, pagination)
  GET  /api/sales/:id      → getSaleById (with items)
  POST /api/sales          → createSale
  GET  /api/sales/today    → getTodaySales (for dashboard)
  ```
- [ ] `createSale` logic (Prisma transaction):
  ```ts
  // 1. Generate invoice number: INV-YYYYMMDD-XXXXX
  // 2. Validate all items have enough stock
  // 3. Calculate: subtotal, discount, tax, total
  // 4. prisma.$transaction([
  //      createSale(...),
  //      createSaleItems(...),
  //      decrementStock for each product
  //    ])
  // 5. Return created sale with items
  ```
- [ ] Invoice number format: `INV-20260808-00001` (auto-increment per day)
- [ ] Validate stock availability before completing sale
- [ ] If any product has insufficient stock → rollback entire transaction, return error
- [ ] Test full sale creation in Postman

---

### 🖥️ STORY S4-2 — Frontend: POS Layout `(4 pts)`
**As a** cashier,
**I want** a split-screen POS interface,
**So that** I can browse products on the left and manage the cart on the right.

#### Tasks:
- [ ] Create `pages/POSPage.tsx` with split layout:
  ```
  ┌─────────────────────────────────────────────┐
  │ 🔍 Search products...                       │
  ├──────────────────────┬──────────────────────┤
  │ Products Grid (60%)  │ Cart Panel (40%)     │
  │                      │                      │
  │ [Product Cards]      │ [Cart Items]         │
  │                      │                      │
  │                      │ [Totals]             │
  │                      │ [Complete Sale]      │
  └──────────────────────┴──────────────────────┘
  ```
- [ ] Responsive: stacks vertically on small screens
- [ ] Create Zustand store `useCartStore`:
  ```ts
  interface CartStore {
    items: CartItem[];
    customerId: string | null;
    discount: number;
    taxRate: number;
    paymentMethod: 'cash' | 'card' | 'other';
    // Computed:
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    total: number;
    // Actions:
    addItem, removeItem, updateQuantity, clearCart, setDiscount, setCustomer
  }
  ```

---

### 🔍 STORY S4-3 — Product Search & Grid `(4 pts)`
**As a** cashier,
**I want** to search products and see them as cards,
**So that** I can quickly find and add items to the cart.

#### Tasks:
- [ ] `components/pos/ProductSearchBar.tsx` — real-time search (debounced 200ms)
- [ ] `components/pos/ProductGrid.tsx` — responsive grid of `ProductCard` components
- [ ] `components/pos/ProductCard.tsx`:
  - Product name, brand, model
  - Selling price
  - Stock available
  - Color badge
  - "Out of Stock" overlay when `stock === 0`
  - Click → adds to cart (or increments quantity if already in cart)
- [ ] Category filter tabs above the grid: All | Phones | Tablets | Accessories | ...
- [ ] Show "No results" when search returns empty

---

### 🛒 STORY S4-4 — Cart Management `(5 pts)`
**As a** cashier,
**I want** to manage the cart with quantity controls,
**So that** I can adjust the order before completing the sale.

#### Tasks:
- [ ] `components/pos/CartPanel.tsx` — right panel:
  - List of `CartItem` rows
  - Each row: Product name, `[−] qty [+]`, unit price, subtotal, `[×]` remove
  - Cannot exceed available stock (+ button disabled if qty = stock)
- [ ] `components/pos/CartTotals.tsx`:
  - Subtotal
  - Discount (input field: flat $amount)
  - Tax (% toggle, default 0%)
  - **Total** (bold, large)
- [ ] `components/pos/CustomerSelect.tsx`:
  - Searchable dropdown to select existing customer
  - "Walk-in Customer" option (no customer)
- [ ] `components/pos/PaymentMethodSelect.tsx`:
  - Tabs: 💵 Cash | 💳 Card | 📱 Other
- [ ] Clear cart button (with confirmation)

---

### ✅ STORY S4-5 — Complete Sale & Receipt `(7 pts)`
**As a** cashier,
**I want** to complete the sale and generate a receipt,
**So that** the transaction is recorded and the customer gets proof of purchase.

#### Tasks:
- [ ] `components/pos/CheckoutModal.tsx`:
  - Summary of all items
  - Payment method selected
  - For Cash: enter "Amount Received" → show "Change: $X"
  - "Confirm Sale" button → calls `POST /api/sales`
- [ ] On success:
  - Show success toast
  - Open `ReceiptModal`
  - Clear cart
- [ ] `components/pos/ReceiptModal.tsx` — printable receipt:
  ```
  ================================
          PHONE SHOP
  ================================

  Invoice: INV-20260808-00001
  Date: 08 Aug 2026
  Cashier: Muhammad

  iPhone 15    1 × $800   $800.00
  AirPods      1 × $150   $150.00
  --------------------------------
  Subtotal               $950.00
  Discount                $50.00
  --------------------------------
  TOTAL                  $900.00

  Payment: Cash
  Received:            $1,000.00
  Change:                $100.00

          Thank You!
  ================================
  ```
- [ ] "Print Receipt" button → `window.print()` with print-only CSS
- [ ] "New Sale" button → closes modal, ready for next customer
- [ ] Handle insufficient stock error from API: highlight which items failed

---

## 🎨 UI Components to Build

| Component | Description |
|-----------|-------------|
| `POSPage.tsx` | Main POS split layout page |
| `ProductSearchBar.tsx` | Real-time product search |
| `ProductGrid.tsx` | Responsive product card grid |
| `ProductCard.tsx` | Individual product clickable card |
| `CartPanel.tsx` | Right-side cart container |
| `CartItem.tsx` | Single cart row with qty controls |
| `CartTotals.tsx` | Subtotal, discount, tax, total |
| `CustomerSelect.tsx` | Customer search dropdown |
| `PaymentMethodSelect.tsx` | Cash/Card/Other tabs |
| `CheckoutModal.tsx` | Final confirmation + cash change |
| `ReceiptModal.tsx` | Printable receipt modal |

---

## ✅ Sprint 4 Acceptance Criteria

- [ ] Cashier can search, filter by category, and add products to cart
- [ ] Quantity can be increased/decreased — cannot exceed stock
- [ ] Discount and tax update total in real-time
- [ ] Customer can be selected or sale continues as walk-in
- [ ] Cash payment shows correct change amount
- [ ] Completing sale creates `Sale` + `SaleItem` records in DB
- [ ] Product stock is decremented correctly after each sale
- [ ] Receipt displays correctly and "Print" opens browser print dialog
- [ ] Attempting a sale with insufficient stock shows an error

---

## 🚧 Risks & Notes

> ⚠️ Use Prisma transactions to ensure stock decrement and sale creation are atomic.
> ⚠️ The receipt must be styled with print-specific CSS (`@media print`).
> ⚠️ This is the most complex sprint — plan extra testing time.
