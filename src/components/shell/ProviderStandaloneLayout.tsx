import { Box, IconButton } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { useMemo, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { findProviderPageByPath } from '@/navigation/providerPages';
import { ProviderSidebar } from './ProviderSidebar';
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

  const current = useMemo(() => {
    if (pagePath) return findProviderPageByPath(pagePath);
    return findProviderPageByPath(location.pathname);
  }, [location.pathname, pagePath]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
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
        <Box sx={{ px: 0, pb: { xs: 8, md: 0 }, pt: 0 }}>
          <Box
            className="provider-shell-surface"
            sx={{
              borderRadius: 2.5,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              p: 0,
              minHeight: 'calc(100vh - 16px)',
            }}
          >
            <ErrorBoundary label={pageTitle ?? current?.title}>
              <MediaFallbackContainer>{children}</MediaFallbackContainer>
            </ErrorBoundary>
          </Box>
        </Box>
      </Box>

      <QuickCreateDial />
      <MobileBottomNav />
    </Box>
  );
}
