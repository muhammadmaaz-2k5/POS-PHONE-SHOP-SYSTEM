interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier';
  isAdmin: boolean;
}

export function useCurrentUser(): { user: CurrentUser | null; isLoaded: boolean } {
  const role = (localStorage.getItem('mock_role') as 'admin' | 'cashier') || null;

  if (!role) {
    return { user: null, isLoaded: true };
  }

  const user: CurrentUser = {
    id: `mock_clerk_${role}`,
    name: role === 'admin' ? 'Admin User' : 'Cashier User',
    email: `mock_${role}@example.com`,
    role,
    isAdmin: role === 'admin',
  };

  return { user, isLoaded: true };
}
