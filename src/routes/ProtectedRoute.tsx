import { Box, CircularProgress } from '@mui/material';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import { hasAllPermissions } from '@/auth/permissions';
import type { Permission } from '@/auth/types';

type ProtectedRouteProps = {
  routePath?: string;
  requiredPermissions?: Permission[];
  children?: React.ReactNode;
};

function isProviderPath(path: string) {
  return path.startsWith('/faithhub/provider');
}

export function ProtectedRoute({ routePath, requiredPermissions, children }: ProtectedRouteProps) {
  const { isAuthenticated, loading, permissions, canAccessPath, isOnboardingComplete } = useAuth();
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

  const targetPath = routePath ?? location.pathname;

  if (isProviderPath(targetPath)) {
    const onboardingPath = '/faithhub/provider/onboarding';
    const isOnboardingRoute = targetPath === onboardingPath;

    if (!isOnboardingComplete && !isOnboardingRoute) {
      return <Navigate to={onboardingPath} replace />;
    }

    if (isOnboardingComplete && isOnboardingRoute) {
      return <Navigate to="/faithhub/provider/dashboard" replace />;
    }
  }

  if (!canAccessPath(targetPath)) {
    return <Navigate to="/faithhub/provider/dashboard" replace />;
  }

  if (requiredPermissions?.length && !hasAllPermissions(permissions, requiredPermissions)) {
    return <Navigate to="/faithhub/provider/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
