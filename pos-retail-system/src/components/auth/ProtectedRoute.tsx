import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const role = localStorage.getItem('mock_role');

  if (!role) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}
