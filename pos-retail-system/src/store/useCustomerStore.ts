import { create } from 'zustand';
import api from '../lib/axios';
import { Customer, PaginatedResponse, ApiResponse } from '../types';

interface CustomerState {
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  search: string;
  
  fetchCustomers: () => Promise<void>;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  
  createCustomer: (data: Partial<Customer>) => Promise<Customer>;
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<Customer>;
  deleteCustomer: (id: string) => Promise<void>;
  getCustomerSales: (id: string) => Promise<any[]>;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  isLoading: false,
  search: '',

  fetchCustomers: async () => {
    set({ isLoading: true });
    try {
      const { page, limit, search } = get();
      
      const response = await api.get<PaginatedResponse<Customer>>('/customers', {
        params: { page, limit, search },
      });

      const { items, total, page: respPage, totalPages } = response.data.data;
      set({
        customers: items,
        total,
        page: respPage,
        totalPages,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      set({ isLoading: false });
    }
  },

  setPage: (page) => {
    set({ page });
    get().fetchCustomers();
  },
  
  setSearch: (search) => {
    set({ search, page: 1 });
    get().fetchCustomers();
  },

  createCustomer: async (data) => {
    const response = await api.post<ApiResponse<Customer>>('/customers', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message);
    }
    await get().fetchCustomers();
    return response.data.data;
  },

  updateCustomer: async (id, data) => {
    const response = await api.put<ApiResponse<Customer>>(`/customers/${id}`, data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message);
    }
    await get().fetchCustomers();
    return response.data.data;
  },

  deleteCustomer: async (id) => {
    const response = await api.delete<ApiResponse<null>>(`/customers/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    await get().fetchCustomers();
  },

  getCustomerSales: async (id) => {
    const response = await api.get<ApiResponse<any[]>>(`/customers/${id}/sales`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message);
    }
    return response.data.data;
  }
}));
