import { Box } from '@mui/material';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { findProviderPageByPath } from '@/navigation/providerPages';
import { ProviderSidebar } from './ProviderSidebar';
import { ProviderTopbar } from './ProviderTopbar';
import { QuickCreateDial } from './QuickCreateDial';
import { MobileBottomNav } from './MobileBottomNav';
import { SearchCommandDialog } from './SearchCommandDialog';
import { PageLoader } from '@/components/PageLoader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MediaFallbackContainer } from '@/components/MediaFallbackContainer';

export function ProviderShellLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('faithhub.sidebar.collapsed') === 'true';
  });

  const current = useMemo(() => findProviderPageByPath(location.pathname), [location.pathname]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('faithhub.sidebar.collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0b1220' : '#dfe9e8'),
        backgroundImage: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, #0f172a 0%, #0b1220 45%, #0a1020 100%)'
            : 'linear-gradient(180deg, #edf3f2 0%, #dfe9e8 45%, #d7e4e3 100%)',
      }}
    >
      <ProviderTopbar
        current={current}
        onOpenSidebar={() => setMobileOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', minWidth: 0 }}>
        <ProviderSidebar
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        />

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            px: 0,
            pb: { xs: 8, md: 0 },
            pt: 0,
            width: '100%',
          }}
        >
          <Box
            className="provider-shell-surface"
            sx={{
              borderRadius: { xs: 0, md: 3 },
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0f172a' : '#f8faf9'),
              p: { xs: 0.5, md: 0.75 },
              minHeight: '100%',
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 20px 40px -34px rgba(2, 6, 23, 0.92)'
                  : '0 20px 40px -36px rgba(15, 23, 42, 0.55)',
            }}
          >
            <ErrorBoundary key={location.pathname} label={current?.title}>
              <MediaFallbackContainer>
                <Suspense fallback={<PageLoader title={`Loading ${current?.title ?? 'workspace page'}...`} />}>
                  <Outlet />
                </Suspense>
              </MediaFallbackContainer>
            </ErrorBoundary>
          </Box>
        </Box>
      </Box>

      <QuickCreateDial />
      <MobileBottomNav />
      <SearchCommandDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </Box>
  );
}
