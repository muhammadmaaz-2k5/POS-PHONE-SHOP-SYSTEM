import { create } from 'zustand';
import api from '../lib/axios';
import { Supplier, PaginatedResponse, ApiResponse } from '../types';

interface SupplierState {
  suppliers: Supplier[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  search: string;
  
  fetchSuppliers: () => Promise<void>;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  
  createSupplier: (data: Partial<Supplier>) => Promise<Supplier>;
  updateSupplier: (id: string, data: Partial<Supplier>) => Promise<Supplier>;
  deleteSupplier: (id: string) => Promise<void>;
}

export const useSupplierStore = create<SupplierState>((set, get) => ({
  suppliers: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  isLoading: false,
  search: '',

  fetchSuppliers: async () => {
    set({ isLoading: true });
    try {
      const { page, limit, search } = get();
      
      const response = await api.get<PaginatedResponse<Supplier>>('/suppliers', {
        params: { page, limit, search },
      });

      const { items, total, page: respPage, totalPages } = response.data.data;
      set({
        suppliers: items,
        total,
        page: respPage,
        totalPages,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
      set({ isLoading: false });
    }
  },

  setPage: (page) => {
    set({ page });
    get().fetchSuppliers();
  },
  
  setSearch: (search) => {
    set({ search, page: 1 });
    get().fetchSuppliers();
  },

  createSupplier: async (data) => {
    const response = await api.post<ApiResponse<Supplier>>('/suppliers', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message);
    }
    await get().fetchSuppliers();
    return response.data.data;
  },

  updateSupplier: async (id, data) => {
    const response = await api.put<ApiResponse<Supplier>>(`/suppliers/${id}`, data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message);
    }
    await get().fetchSuppliers();
    return response.data.data;
  },

  deleteSupplier: async (id) => {
    const response = await api.delete<ApiResponse<null>>(`/suppliers/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    await get().fetchSuppliers();
  },
}));
