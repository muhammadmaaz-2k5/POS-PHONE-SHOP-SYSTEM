import { create } from 'zustand';
import api from '../lib/axios';
import { Purchase, PaginatedResponse, ApiResponse } from '../types';

interface PurchaseState {
  purchases: Purchase[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  supplierId: string;
  startDate: string;
  endDate: string;
  
  fetchPurchases: () => Promise<void>;
  setPage: (page: number) => void;
  setFilters: (filters: { supplierId?: string; startDate?: string; endDate?: string }) => void;
  
  createPurchase: (data: any) => Promise<Purchase>;
}

export const usePurchaseStore = create<PurchaseState>((set, get) => ({
  purchases: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  isLoading: false,
  supplierId: '',
  startDate: '',
  endDate: '',

  fetchPurchases: async () => {
    set({ isLoading: true });
    try {
      const { page, limit, supplierId, startDate, endDate } = get();
      
      const response = await api.get<PaginatedResponse<Purchase>>('/purchases', {
        params: { page, limit, supplierId, startDate, endDate },
      });

      const { items, total, page: respPage, totalPages } = response.data.data;
      set({
        purchases: items,
        total,
        page: respPage,
        totalPages,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
      set({ isLoading: false });
    }
  },

  setPage: (page) => {
    set({ page });
    get().fetchPurchases();
  },
  
  setFilters: (filters) => {
    set({ ...filters, page: 1 });
    get().fetchPurchases();
  },

  createPurchase: async (data) => {
    const response = await api.post<ApiResponse<Purchase>>('/purchases', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message);
    }
    await get().fetchPurchases();
    return response.data.data;
  },
}));
