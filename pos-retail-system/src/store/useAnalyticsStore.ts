import { create } from 'zustand';
import api from '../lib/axios';
import { DashboardStats, Product } from '../types';

interface ChartData {
  name?: string;
  date?: string;
  month?: string;
  revenue: number;
  orders?: number;
  profit?: number;
  unitsSold?: number;
  userId?: string;
}

interface InventoryData extends Product {
  status: string;
  stockValue: number;
  retailValue: number;
}

interface AnalyticsState {
  dashboardData: DashboardStats | null;
  dailySales: ChartData[];
  monthlySales: ChartData[];
  topProducts: ChartData[];
  salesByCashier: ChartData[];
  inventory: InventoryData[];
  lowStock: any[];
  isLoading: boolean;
  
  fetchDashboard: () => Promise<void>;
  fetchReports: (days?: number) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  dashboardData: null,
  dailySales: [],
  monthlySales: [],
  topProducts: [],
  salesByCashier: [],
  inventory: [],
  lowStock: [],
  isLoading: false,

  fetchDashboard: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/analytics/dashboard');
      set({ dashboardData: response.data.data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
      set({ isLoading: false });
    }
  },

  fetchReports: async (days = 30) => {
    set({ isLoading: true });
    try {
      const [daily, monthly, top, cashier, inv, low] = await Promise.all([
        api.get(`/analytics/sales/daily?days=${days}`),
        api.get(`/analytics/sales/monthly`),
        api.get(`/analytics/sales/by-product`),
        api.get(`/analytics/sales/by-cashier`),
        api.get(`/analytics/inventory`),
        api.get(`/analytics/low-stock`)
      ]);

      set({
        dailySales: daily.data.data,
        monthlySales: monthly.data.data,
        topProducts: top.data.data,
        salesByCashier: cashier.data.data,
        inventory: inv.data.data,
        lowStock: low.data.data,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to fetch reports', error);
      set({ isLoading: false });
    }
  }
}));
