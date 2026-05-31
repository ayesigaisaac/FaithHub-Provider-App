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

function ProviderAliasRedirect({ to }: { to: string }) {
  const location = useLocation();
  return <Navigate to={`${to}${location.search}${location.hash}`} replace />;
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
        <Route element={<ProtectedRoute><ProviderShellLayout /></ProtectedRoute>}>
          <Route path="/faithhub/provider" element={<Navigate to="/faithhub/provider/dashboard" replace />} />

          {providerPages.map((page) => (
            <Route
              key={`${page.key}:${page.path}`}
              path={page.path}
              element={
                <ProtectedRoute routePath={page.path}>
                  <ProviderPageMount page={page} />
                </ProtectedRoute>
              }
            />
          ))}

          {providerPages.flatMap((page) =>
            (page.aliases ?? []).map((aliasPath) => (
              <Route
                key={`${page.key}:alias:${aliasPath}`}
                path={aliasPath}
                element={
                  <ProtectedRoute routePath={page.path}>
                    <ProviderAliasRedirect to={page.path} />
                  </ProtectedRoute>
                }
              />
            )),
          )}

          <Route path="/faithhub/provider/*" element={<Navigate to="/faithhub/provider/dashboard" replace />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Fragment>
  );
}
