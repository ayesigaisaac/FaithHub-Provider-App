import { Fragment, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import SeriesPage from '@/pages/SeriesPage';
import TeachingsPage from '@/pages/TeachingsPage';
import NewLiveSessionPage from '@/pages/NewLiveSessionPage';
import NewTeachingPage from '@/pages/NewTeachingPage';
import CampaignsPage from '@/pages/CampaignsPage';
import AdsPage from '@/pages/AdsPage';
import { ROUTES } from '@/routes/routes';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search]);

  return null;
}

export default function App() {
  return (
    <Fragment>
      <ScrollToTop />
      <Routes>
        <Route path={ROUTES.dashboard} element={<Dashboard />} />
        <Route path={ROUTES.series} element={<SeriesPage />} />
        <Route path={ROUTES.teachings} element={<TeachingsPage />} />
        <Route path={ROUTES.liveNew} element={<NewLiveSessionPage />} />
        <Route path={ROUTES.teachingNew} element={<NewTeachingPage />} />
        <Route path={ROUTES.campaigns} element={<CampaignsPage />} />
        <Route path={ROUTES.ads} element={<AdsPage />} />
        <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
      </Routes>
    </Fragment>
  );
}
