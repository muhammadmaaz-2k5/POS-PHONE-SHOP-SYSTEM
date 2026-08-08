import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'https://pos-phone-shop-system.vercel.app/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor — attach Clerk JWT ───────────────────────────────────
api.interceptors.request.use(async (config) => {
  // Clerk token is injected here in Sprint 1 after ClerkProvider is set up
  // const token = await window.Clerk?.session?.getToken();
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Response interceptor — global error handling ────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message ?? 'An unexpected error occurred';

    if (status === 401) {
      // Redirect to sign-in (Clerk handles this)
      window.location.href = '/sign-in';
    } else if (status === 403) {
      toast.error('Access Denied: You do not have permission.');
    } else if (status >= 500) {
      toast.error('Server Error: Please try again later.');
    } else if (!status) {
      toast.error('Network Error: Please check your connection.');
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
