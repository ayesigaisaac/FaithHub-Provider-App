import { Box, CircularProgress } from '@mui/material';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import { hasAllPermissions } from '@/auth/permissions';
import type { Permission, UserRole } from '@/auth/types';

type ProtectedRouteProps = {
  allowedRoles?: UserRole[];
  requiredPermissions?: Permission[];
  children?: React.ReactNode;
};

export function ProtectedRoute({ allowedRoles, requiredPermissions, children }: ProtectedRouteProps) {
  const { isAuthenticated, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/login" replace state={{ from }} />;
  }

  if (allowedRoles?.length && role && !allowedRoles.includes(role)) {
    return <Navigate to="/faithhub/provider/dashboard" replace />;
  }

  if (requiredPermissions?.length && !hasAllPermissions(role, requiredPermissions)) {
    return <Navigate to="/faithhub/provider/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
