import { Box, Toolbar } from '@mui/material';
import { useMemo, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { findProviderPageByPath } from '@/navigation/providerPages';
import { ProviderSidebar, providerDrawerWidth } from './ProviderSidebar';
import { ProviderTopbar } from './ProviderTopbar';
import { SearchCommandDialog } from './SearchCommandDialog';
import { QuickCreateDial } from './QuickCreateDial';
import { MobileBottomNav } from './MobileBottomNav';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MediaFallbackContainer } from '@/components/MediaFallbackContainer';

type ProviderStandaloneLayoutProps = {
  children: ReactNode;
  pagePath?: string;
  pageTitle?: string;
};

export function ProviderStandaloneLayout({ children, pagePath, pageTitle }: ProviderStandaloneLayoutProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const current = useMemo(() => {
    if (pagePath) return findProviderPageByPath(pagePath);
    return findProviderPageByPath(location.pathname);
  }, [location.pathname, pagePath]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f3f4f6' }}>
      <ProviderSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Box component="main" sx={{ flex: 1, minWidth: 0, width: '100%' }}>
        <Box sx={{ position: 'fixed', top: 0, left: { md: `${providerDrawerWidth}px` }, right: 0, zIndex: 1200 }}>
          <ProviderTopbar
            current={current}
            onOpenSidebar={() => setMobileOpen(true)}
            onOpenSearch={() => setSearchOpen(true)}
          />
        </Box>

        <Toolbar sx={{ minHeight: { xs: 72, md: 72 } }} />
        <Box sx={{ px: 0, pb: { xs: 8, md: 0 }, pt: 0 }}>
          <Box
            className="provider-shell-surface"
            sx={{
              borderRadius: 2.5,
              border: '1px solid #e5e7eb',
              bgcolor: '#ffffff',
              p: 0,
              minHeight: 'calc(100vh - 188px)',
            }}
          >
            <ErrorBoundary label={pageTitle ?? current?.title}>
              <MediaFallbackContainer>{children}</MediaFallbackContainer>
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
