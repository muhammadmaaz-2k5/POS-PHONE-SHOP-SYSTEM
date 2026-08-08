// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  clerkUserId: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier';
  createdAt: string;
  updatedAt: string;
}

// ─── Product ──────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  imei: string | null;
  ram: string | null;
  storage: string | null;
  color: string | null;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minimumStock: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Customer ─────────────────────────────────────────────────────────────────
export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    sales: number;
  };
}

// ─── Supplier ─────────────────────────────────────────────────────────────────
export interface Supplier {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  company: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    purchases: number;
  };
}

// ─── Sale ─────────────────────────────────────────────────────────────────────
export interface SaleItem {
  id: string;
  productId: string;
  product: Pick<Product, 'id' | 'name' | 'brand'>;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId: string | null;
  customer: Pick<Customer, 'id' | 'name' | 'phone'> | null;
  userId: string;
  user: Pick<User, 'id' | 'name'>;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'other';
  items: SaleItem[];
  createdAt: string;
  updatedAt: string;
}

// ─── Cart (frontend only) ─────────────────────────────────────────────────────
export interface CartItem {
  product: Product;
  quantity: number;
}

// ─── Purchase ─────────────────────────────────────────────────────────────────
export interface PurchaseItem {
  id: string;
  productId: string;
  product: Pick<Product, 'id' | 'name' | 'brand'>;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Purchase {
  id: string;
  supplierId: string;
  supplier: Pick<Supplier, 'id' | 'name' | 'company'>;
  userId: string;
  user: Pick<User, 'id' | 'name'>;
  total: number;
  notes: string | null;
  items: PurchaseItem[];
  createdAt: string;
  updatedAt: string;
  _count?: {
    items: number;
  };
}


// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface DashboardStats {
  todaySales: number;
  todayProfit: number;
  todayOrders: number;
  totalProducts: number;
  totalCustomers: number;
  lowStockCount: number;
  recentSales: Sale[];
}
