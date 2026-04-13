import { Fragment, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ProviderShellLayout } from '@/components/shell/ProviderShellLayout';
import { providerPages, type ProviderPageMeta } from '@/navigation/providerPages';
import NotFoundPage from '@/pages/public/NotFoundPage';
import FaithHubHomeLandingPage from '@/pages/public/FaithHubHomeLandingPage';
import { usePageTitle } from '@/hooks/usePageTitle';

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search]);
  return null;
}

function ProviderPageMount({ page }: { page: ProviderPageMeta }) {
  usePageTitle(page.title);
  const Component = page.component;
  return <Component />;
}

function LandingMount() {
  usePageTitle('FaithHub Home');
  return <FaithHubHomeLandingPage />;
}

export default function App() {
  return (
    <Fragment>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingMount />} />
        <Route path="/faithhub/home" element={<Navigate to="/" replace />} />

        <Route path="/faithhub/provider" element={<ProviderShellLayout />}>
          <Route index element={<Navigate to="/faithhub/provider/dashboard" replace />} />
        </Route>

        <Route element={<ProviderShellLayout />}>
          {providerPages.flatMap((page) => {
            const paths = [page.path, ...(page.aliases ?? [])];
            return paths.map((path) => (
              <Route key={`${page.key}:${path}`} path={path} element={<ProviderPageMount page={page} />} />
            ));
          })}
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Fragment>
  );
}
