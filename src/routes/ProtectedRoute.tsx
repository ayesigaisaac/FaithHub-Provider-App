import { Box, CircularProgress } from '@mui/material';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import type { UserRole } from '@/auth/types';

type ProtectedRouteProps = {
  allowedRoles?: UserRole[];
  children?: React.ReactNode;
};

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
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
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles?.length && role && !allowedRoles.includes(role)) {
    return <Navigate to="/faithhub/provider/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
