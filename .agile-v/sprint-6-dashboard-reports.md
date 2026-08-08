# 📊 Sprint 6 — Dashboard & Reports

> **Duration:** Week 7
> **Goal:** Build the main dashboard with live KPIs and a full reports section with charts and export.
> **Story Points:** 20
> **Status:** 🔵 Planned

---

## 🎯 Sprint Goal

> *"By the end of this sprint, the dashboard shows real-time KPIs (sales, profit, orders, stock), and the reports section provides daily/monthly analytics with charts."*

---

## 📋 User Stories & Tasks

### 🔧 STORY S6-1 — Backend: Dashboard & Analytics API `(5 pts)`
**As a** developer,
**I want** efficient analytics endpoints that aggregate data from the database,
**So that** the dashboard and reports render with accurate numbers.

#### Tasks:
- [ ] Create `routes/analyticsRoutes.ts`
- [ ] Create `controllers/analyticsController.ts`:
  ```
  GET /api/analytics/dashboard         → today's KPIs
  GET /api/analytics/sales/daily       → daily sales (last 30 days)
  GET /api/analytics/sales/monthly     → monthly sales (last 12 months)
  GET /api/analytics/sales/by-product  → top selling products
  GET /api/analytics/sales/by-cashier  → sales grouped by cashier
  GET /api/analytics/inventory         → full inventory report
  GET /api/analytics/low-stock         → products below minimum stock
  ```
- [ ] Dashboard endpoint response:
  ```ts
  {
    todaySales: number,       // sum of today's sales total
    todayProfit: number,      // sum of (salePrice - purchasePrice) × qty
    todayOrders: number,      // count of today's sales
    totalProducts: number,
    totalCustomers: number,
    lowStockCount: number,
    recentSales: Sale[],      // last 5 sales with customer + items
  }
  ```
- [ ] Use Prisma `groupBy`, `aggregate`, and `_sum` for efficient queries
- [ ] Apply date filtering using `gte`/`lte` on `createdAt`
- [ ] Apply `requireRole('admin')` to all analytics endpoints

---

### 📊 STORY S6-2 — Frontend: Dashboard Page `(6 pts)`
**As an** admin,
**I want** a visual dashboard with KPI cards and recent activity,
**So that** I can assess the shop's performance at a glance.

#### Tasks:
- [ ] Create `pages/DashboardPage.tsx`
- [ ] KPI Cards row (`components/dashboard/KPICard.tsx`):
  ```
  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
  │ 💰 Today     │ │ 📈 Profit    │ │ 🛒 Orders    │ │ 📦 Products  │
  │ Sales        │ │ Today        │ │ Today        │ │ Total        │
  │ $1,200       │ │ $350         │ │ 8            │ │ 145          │
  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
  ┌──────────────┐ ┌──────────────┐
  │ ⚠️ Low Stock │ │ 👥 Customers │
  │ Products     │ │ Total        │
  │ 12           │ │ 234          │
  └──────────────┘ └──────────────┘
  ```
- [ ] Each KPI card: icon, label, value (large), trend arrow vs yesterday
- [ ] Sales Chart (`components/dashboard/SalesChart.tsx`):
  - Area chart: last 7 days daily sales
  - Built with `recharts` AreaChart
- [ ] Recent Sales table (`components/dashboard/RecentSalesTable.tsx`):
  - Last 5 sales: Invoice, Customer, Items, Total, Payment, Time
  - "View All" → navigates to `/sales`
- [ ] Low Stock Alert (`components/dashboard/LowStockAlert.tsx`):
  - Collapsible list of low stock products
  - "Order Stock" → navigates to `/purchases/create`
- [ ] Auto-refresh every 60 seconds

---

### 📈 STORY S6-3 — Frontend: Reports Page `(6 pts)`
**As an** admin,
**I want** detailed reports with charts and tables,
**So that** I can analyze sales performance and make business decisions.

#### Tasks:
- [ ] Create `pages/ReportsPage.tsx` with tab navigation:
  - 📅 Daily Sales
  - 📆 Monthly Sales
  - 🏆 Top Products
  - 👤 By Cashier
  - 📦 Inventory
  - ⚠️ Low Stock

#### Daily Sales Tab:
- [ ] Date range picker (from → to)
- [ ] Bar chart: daily revenue (recharts BarChart)
- [ ] Summary table: Date | Orders | Revenue | Profit

#### Monthly Sales Tab:
- [ ] Year selector
- [ ] Line chart: monthly revenue over 12 months
- [ ] Summary table: Month | Orders | Revenue | Profit

#### Top Products Tab:
- [ ] Date range filter
- [ ] Horizontal bar chart: top 10 products by revenue
- [ ] Table: Product | Units Sold | Revenue | Profit

#### By Cashier Tab:
- [ ] Date range filter
- [ ] Pie chart: sales distribution by cashier
- [ ] Table: Cashier | Orders | Revenue

#### Inventory Tab:
- [ ] Full product list with current stock vs minimum stock
- [ ] Progress bars for stock levels

#### Low Stock Tab:
- [ ] All products where `stock ≤ minimumStock`
- [ ] "Create Purchase Order" quick action button

---

### 📤 STORY S6-4 — Export & Print `(3 pts)`
**As an** admin,
**I want** to export reports,
**So that** I can share them or keep records offline.

#### Tasks:
- [ ] "Export CSV" button on each report tab
  - Install: `papaparse` for CSV generation
  - Download as `report-{type}-{date}.csv`
- [ ] "Print" button → print-specific CSS for each report tab
- [ ] Sales invoices list: "Download PDF" (use `window.print()` with receipt layout)

---

## 🎨 UI Components to Build

| Component | Description |
|-----------|-------------|
| `DashboardPage.tsx` | Main dashboard page |
| `KPICard.tsx` | Stat card with icon, value, trend |
| `SalesChart.tsx` | Recharts area chart for sales |
| `RecentSalesTable.tsx` | Last 5 sales mini table |
| `LowStockAlert.tsx` | Collapsible low stock list |
| `ReportsPage.tsx` | Tabbed reports page |
| `DateRangePicker.tsx` | Reusable from/to date inputs |
| `SalesSummaryTable.tsx` | Generic report summary table |

---

## ✅ Sprint 6 Acceptance Criteria

- [ ] Dashboard shows correct today's sales, profit, orders on page load
- [ ] Dashboard KPIs update every 60 seconds automatically
- [ ] Sales area chart renders correctly with last 7 days data
- [ ] Recent sales table shows 5 most recent transactions
- [ ] Reports page has all 6 tabs working with correct data
- [ ] Daily sales bar chart shows correct data for selected date range
- [ ] CSV export downloads a valid file with correct data
- [ ] Low stock alert links to purchase creation

---

## 🚧 Risks & Notes

> ⚠️ Profit calculation requires joining `SaleItem.price` with `Product.purchasePrice` — ensure price at time of sale is stored.
> ⚠️ Consider caching dashboard queries (1-minute TTL) for performance.
> ℹ️ `recharts` is the recommended charting library — avoid chart.js for consistency.
