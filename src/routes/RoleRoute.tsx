import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import type { UserRole } from '@/auth/types';

export function RoleRoute({
  allowedRoles,
  children,
  fallbackPath = '/faithhub/provider/dashboard',
}: {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallbackPath?: string;
}) {
  const { role, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={fallbackPath} replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

