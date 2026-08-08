import { create } from 'zustand';
import api from '../lib/axios';
import { Product, PaginatedResponse, ApiResponse } from '../types';

interface ProductState {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  search: string;
  category: string;
  lowStockOnly: boolean;
  
  // Actions
  fetchProducts: () => Promise<void>;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setLowStockOnly: (lowStock: boolean) => void;
  
  createProduct: (data: Partial<Product>) => Promise<Product>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  isLoading: false,
  search: '',
  category: '',
  lowStockOnly: false,

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const { page, limit, search, category, lowStockOnly } = get();
      
      const endpoint = lowStockOnly ? '/products/low-stock' : '/products';
      
      const response = await api.get<PaginatedResponse<Product> | ApiResponse<Product[]>>(endpoint, {
        params: lowStockOnly ? undefined : { page, limit, search, category },
      });

      if (lowStockOnly) {
        // Low stock endpoint returns flat array
        const items = response.data.data as Product[];
        set({
          products: items,
          total: items.length,
          page: 1,
          totalPages: 1,
          isLoading: false,
        });
      } else {
        // Standard paginated endpoint
        const { items, total, page: respPage, totalPages } = response.data.data as PaginatedResponse<Product>['data'];
        set({
          products: items,
          total,
          page: respPage,
          totalPages,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      set({ isLoading: false });
    }
  },

  setPage: (page) => {
    set({ page });
    get().fetchProducts();
  },
  
  setSearch: (search) => {
    set({ search, page: 1 });
    get().fetchProducts();
  },
  
  setCategory: (category) => {
    set({ category, page: 1 });
    get().fetchProducts();
  },
  
  setLowStockOnly: (lowStockOnly) => {
    set({ lowStockOnly, page: 1 });
    get().fetchProducts();
  },

  createProduct: async (data) => {
    const response = await api.post<ApiResponse<Product>>('/products', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message);
    }
    await get().fetchProducts();
    return response.data.data;
  },

  updateProduct: async (id, data) => {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message);
    }
    await get().fetchProducts();
    return response.data.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete<ApiResponse<null>>(`/products/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    await get().fetchProducts();
  },
}));
