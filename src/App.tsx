import { Fragment, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ProviderShellLayout } from '@/components/shell/ProviderShellLayout';
import { providerPages, type ProviderPageMeta } from '@/navigation/providerPages';
import NotFoundPage from '@/pages/public/NotFoundPage';
import FaithHubHomeLandingPage from '@/pages/public/FaithHubHomeLandingPage';
import { usePageTitle } from '@/hooks/usePageTitle';
import Dashboard from '@/pages/Dashboard';
import LoginPage from '@/pages/public/LoginPage';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import type { UserRole } from '@/auth/types';

function ScrollToTop(): null {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search]);
  return null;
}

function ProviderPageMount({ page }: { page: ProviderPageMeta }) {
  usePageTitle(page.title);
  const Component = page.component;
  return (
    <div className="provider-page-density provider-page-density--compact">
      <Component />
    </div>
  );
}

function LandingMount() {
  usePageTitle('FaithHub Home');
  return <FaithHubHomeLandingPage />;
}

const roleRestrictedPaths: Record<string, UserRole[]> = {
  '/faithhub/provider/donations-and-funds': ['finance', 'leadership'],
  '/faithhub/provider/wallet-payouts': ['finance', 'leadership'],
  '/faithhub/provider/subscriptions': ['finance', 'leadership'],
};

function getAllowedRoles(path: string): UserRole[] | undefined {
  return roleRestrictedPaths[path];
}

export default function App() {
  return (
    <Fragment>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/faithhub/provider/dashboard" replace />} />
        <Route path="/faithhub/home" element={<Navigate to="/faithhub/provider/dashboard" replace />} />
        <Route path="/faithhub/home-landing" element={<LandingMount />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard-ui" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        <Route path="/faithhub/provider" element={<ProtectedRoute><ProviderShellLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/faithhub/provider/dashboard" replace />} />
        </Route>

        <Route element={<ProtectedRoute><ProviderShellLayout /></ProtectedRoute>}>
          {providerPages.flatMap((page) => {
            const paths = [page.path, ...(page.aliases ?? [])];
            return paths.map((path) => (
              <Route
                key={`${page.key}:${path}`}
                path={path}
                element={
                  <ProtectedRoute allowedRoles={getAllowedRoles(path)}>
                    <ProviderPageMount page={page} />
                  </ProtectedRoute>
                }
              />
            ));
          })}
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Fragment>
  );
}
