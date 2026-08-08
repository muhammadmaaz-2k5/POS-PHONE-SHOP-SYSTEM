import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import api from '../../lib/axios';

export default function AxiosInterceptor({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(async (config) => {
      const role = localStorage.getItem('mock_role');
      if (role) {
        config.headers['x-mock-role'] = role;
      } else {
        try {
          const token = await getToken();
          if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
          }
        } catch (e) {
          console.warn('Failed to get Clerk token', e);
        }
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [getToken]);

  return <>{children}</>;
}
