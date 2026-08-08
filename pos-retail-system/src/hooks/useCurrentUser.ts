import { useUser } from '@clerk/clerk-react';

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier';
  isAdmin: boolean;
}

export function useCurrentUser(): { user: CurrentUser | null; isLoaded: boolean } {
  const { user: clerkUser, isLoaded } = useUser();

  if (!isLoaded || !clerkUser) {
    return { user: null, isLoaded };
  }

  const role = (clerkUser.publicMetadata?.role as 'admin' | 'cashier') || 'cashier';

  const user: CurrentUser = {
    id: clerkUser.id,
    name: clerkUser.fullName || clerkUser.username || 'User',
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    role,
    isAdmin: role === 'admin',
  };

  return { user, isLoaded };
}
