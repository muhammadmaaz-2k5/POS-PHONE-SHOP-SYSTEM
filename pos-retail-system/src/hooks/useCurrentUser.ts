import { useUser } from '@clerk/clerk-react';

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier';
  isAdmin: boolean;
}

export function useCurrentUser(): { user: CurrentUser | null; isLoaded: boolean } {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const mockRole = (localStorage.getItem('mock_role') as 'admin' | 'cashier') || null;

  if (!mockRole && !clerkLoaded) {
    return { user: null, isLoaded: false };
  }

  if (mockRole) {
    return {
      user: {
        id: `mock_clerk_${mockRole}`,
        name: mockRole === 'admin' ? 'Admin User' : 'Cashier User',
        email: `mock_${mockRole}@example.com`,
        role: mockRole,
        isAdmin: mockRole === 'admin',
      },
      isLoaded: true,
    };
  }

  if (clerkUser) {
    return {
      user: {
        id: clerkUser.id,
        name: clerkUser.fullName || '',
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        role: clerkUser.publicMetadata?.role as 'admin' | 'cashier' || 'cashier',
        isAdmin: clerkUser.publicMetadata?.role === 'admin',
      },
      isLoaded: true,
    };
  }

  return { user: null, isLoaded: true };
}
