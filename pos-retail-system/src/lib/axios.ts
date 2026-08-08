import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
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
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
