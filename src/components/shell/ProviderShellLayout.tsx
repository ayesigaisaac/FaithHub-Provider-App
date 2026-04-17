import { Box, IconButton } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { Suspense, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { findProviderPageByPath } from '@/navigation/providerPages';
import { ProviderSidebar } from './ProviderSidebar';
import { QuickCreateDial } from './QuickCreateDial';
import { MobileBottomNav } from './MobileBottomNav';
import { PageLoader } from '@/components/PageLoader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MediaFallbackContainer } from '@/components/MediaFallbackContainer';

export function ProviderShellLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const current = useMemo(() => findProviderPageByPath(location.pathname), [location.pathname]);

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: '#dfe9e8',
        backgroundImage: 'linear-gradient(180deg, #edf3f2 0%, #dfe9e8 45%, #d7e4e3 100%)',
      }}
    >
      <ProviderSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Box component="main" sx={{ flex: 1, minWidth: 0, width: '100%' }}>
        <IconButton
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          sx={{
            display: { xs: 'inline-flex', md: 'none' },
            position: 'fixed',
            top: 12,
            left: 12,
            zIndex: 1200,
            bgcolor: '#ffffff',
            border: '1px solid #dbe2ea',
            boxShadow: '0 8px 16px -12px rgba(15, 23, 42, 0.45)',
            '&:hover': { bgcolor: '#f8fafc' },
          }}
        >
          <MenuRoundedIcon />
        </IconButton>

        <Box
          sx={{
            px: { xs: 0.75, md: 1 },
            pb: { xs: 8, md: 2.5 },
            pt: { xs: 0.75, md: 0.75 },
            maxWidth: 1700,
            mx: 'auto',
          }}
        >
          <Box
            className="provider-shell-surface"
            sx={{
              borderRadius: 3.5,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: '#f8faf9',
              p: { xs: 1.5, md: 1.75 },
              minHeight: 'calc(100vh - 40px)',
              boxShadow: '0 20px 40px -36px rgba(15, 23, 42, 0.55)',
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

      <QuickCreateDial />
      <MobileBottomNav />
    </Box>
  );
}
