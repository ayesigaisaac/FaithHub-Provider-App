import { Box, Toolbar } from '@mui/material';
import { Suspense, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { findProviderPageByPath } from '@/navigation/providerPages';
import { ProviderSidebar, providerDrawerWidth } from './ProviderSidebar';
import { ProviderTopbar } from './ProviderTopbar';
import { SearchCommandDialog } from './SearchCommandDialog';
import { QuickCreateDial } from './QuickCreateDial';
import { MobileBottomNav } from './MobileBottomNav';
import { PageLoader } from '@/components/PageLoader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MediaFallbackContainer } from '@/components/MediaFallbackContainer';

export function ProviderShellLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const current = useMemo(() => findProviderPageByPath(location.pathname), [location.pathname]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#dde9e8' }}>
      <ProviderSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Box component="main" sx={{ flex: 1, minWidth: 0, width: '100%' }}>
        <Box sx={{ position: 'fixed', top: 0, left: { md: `${providerDrawerWidth}px` }, right: 0, zIndex: 1200 }}>
          <ProviderTopbar
            current={current}
            onOpenSidebar={() => setMobileOpen(true)}
            onOpenSearch={() => setSearchOpen(true)}
          />
        </Box>

        <Toolbar sx={{ minHeight: { xs: 152, md: 156 } }} />
        <Box sx={{ px: { xs: 1, md: 1.5 }, pb: { xs: 8, md: 2.5 }, pt: { xs: 0.5, md: 0.5 } }}>
          <Box
            className="provider-shell-surface"
            sx={{
              borderRadius: 3.5,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: '#f7f8f8',
              p: { xs: 1.5, md: 1.75 },
              minHeight: 'calc(100vh - 188px)',
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
      <QuickCreateDial />
      <MobileBottomNav />
    </Box>
  );
}
