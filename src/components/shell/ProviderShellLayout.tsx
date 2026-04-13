import { Box, Toolbar } from '@mui/material';
import { Suspense, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { findProviderPageByPath } from '@/navigation/providerPages';
import { ProviderSidebar, providerDrawerWidth } from './ProviderSidebar';
import { ProviderTopbar } from './ProviderTopbar';
import { SearchCommandDialog } from './SearchCommandDialog';
import { PageLoader } from '@/components/PageLoader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MediaFallbackContainer } from '@/components/MediaFallbackContainer';

export function ProviderShellLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const current = useMemo(() => findProviderPageByPath(location.pathname), [location.pathname]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f3f4f6' }}>
      <ProviderSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Box component="main" sx={{ flex: 1, minWidth: 0, ml: { md: `${providerDrawerWidth}px` } }}>
        <Box sx={{ position: 'fixed', top: 0, left: { md: `${providerDrawerWidth}px` }, right: 0, zIndex: 1200 }}>
          <ProviderTopbar
            current={current}
            onOpenSidebar={() => setMobileOpen(true)}
            onOpenSearch={() => setSearchOpen(true)}
          />
        </Box>

        <Toolbar sx={{ minHeight: { xs: 168, md: 172 } }} />
        <Box sx={{ px: { xs: 1.25, md: 2.5 }, pb: { xs: 10, md: 3 }, pt: 1.5 }}>
          <Box
            sx={{
              borderRadius: 2.5,
              border: '1px solid #e5e7eb',
              bgcolor: '#ffffff',
              p: { xs: 1, md: 1.5 },
              minHeight: 'calc(100vh - 212px)',
            }}
          >
            <ErrorBoundary label={current?.title}>
              <MediaFallbackContainer>
                <Suspense fallback={<PageLoader title={`Loading ${current?.title ?? 'workspace page'}...`} />}>
                  <Outlet />
                </Suspense>
              </MediaFallbackContainer>
            </ErrorBoundary>
          </Box>
        </Box>
      </Box>

      <SearchCommandDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </Box>
  );
}
