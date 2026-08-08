import { create } from 'zustand';
import api from '../lib/axios';
import { Product, CartItem, Customer, Sale } from '../types';

interface CartState {
  items: CartItem[];
  customerId: string | null;
  customer: Pick<Customer, 'id' | 'name' | 'phone'> | null;
  discount: number;
  taxRate: number; // percentage, e.g. 5 for 5%
  paymentMethod: 'cash' | 'card' | 'other';
  isProcessing: boolean;

  // Actions
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setCustomer: (customer: Pick<Customer, 'id' | 'name' | 'phone'> | null) => void;
  setDiscount: (discount: number) => void;
  setTaxRate: (rate: number) => void;
  setPaymentMethod: (method: 'cash' | 'card' | 'other') => void;
  clearCart: () => void;
  
  // Computed
  getSubtotal: () => number;
  getTaxAmount: () => number;
  getTotal: () => number;

  // API
  completeSale: () => Promise<Sale>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  customerId: null,
  customer: null,
  discount: 0,
  taxRate: 0,
  paymentMethod: 'cash',
  isProcessing: false,

  addItem: (product) => {
    const { items } = get();
    const existing = items.find((i) => i.product.id === product.id);

    if (existing) {
      // Don't exceed available stock
      if (existing.quantity >= product.stock) return;
      
      set({
        items: items.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      });
    } else {
      if (product.stock < 1) return; // Out of stock
      set({ items: [...items, { product, quantity: 1 }] });
    }
  },

  removeItem: (productId) => {
    set({ items: get().items.filter((i) => i.product.id !== productId) });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity < 1) {
      get().removeItem(productId);
      return;
    }

    const { items } = get();
    const item = items.find((i) => i.product.id === productId);
    
    if (item && quantity <= item.product.stock) {
      set({
        items: items.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        ),
      });
    }
  },

  setCustomer: (customer) => {
    set({ customer, customerId: customer?.id || null });
  },

  setDiscount: (discount) => set({ discount: Math.max(0, discount) }),
  setTaxRate: (taxRate) => set({ taxRate: Math.max(0, taxRate) }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),

  clearCart: () => set({
    items: [],
    customerId: null,
    customer: null,
    discount: 0,
    taxRate: 0,
    paymentMethod: 'cash'
  }),

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + (Number(item.product.sellingPrice) * item.quantity), 0);
  },

  getTaxAmount: () => {
    const subtotal = get().getSubtotal();
    const subAfterDiscount = Math.max(0, subtotal - get().discount);
    return (subAfterDiscount * get().taxRate) / 100;
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const subAfterDiscount = Math.max(0, subtotal - get().discount);
    return subAfterDiscount + get().getTaxAmount();
  },

  completeSale: async () => {
    const state = get();
    if (state.items.length === 0) throw new Error('Cart is empty');

    set({ isProcessing: true });
    try {
      const payload = {
        customerId: state.customerId,
        discount: state.discount,
        tax: state.getTaxAmount(),
        paymentMethod: state.paymentMethod,
        items: state.items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: Number(item.product.sellingPrice),
          subtotal: Number(item.product.sellingPrice) * item.quantity,
        })),
      };

      const response = await api.post('/sales', payload);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Failed to complete sale');
      }

      set({ isProcessing: false });
      return response.data.data; // Return the created Sale object (which has the invoiceNumber)
    } catch (error: any) {
      set({ isProcessing: false });
      throw error;
    }
  }
}));
