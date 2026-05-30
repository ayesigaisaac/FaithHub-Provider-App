import { Box, IconButton } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { findProviderPageByPath } from '@/navigation/providerPages';
import { ProviderSidebar } from './ProviderSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { SearchCommandDialog } from './SearchCommandDialog';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MediaFallbackContainer } from '@/components/MediaFallbackContainer';

type ProviderStandaloneLayoutProps = {
  children: ReactNode;
  pagePath?: string;
  pageTitle?: string;
};

export function ProviderStandaloneLayout({ children, pagePath, pageTitle }: ProviderStandaloneLayoutProps) {
  const location = useLocation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('faithhub.sidebar.collapsed') === 'true';
  });

  const current = useMemo(() => {
    if (pagePath) return findProviderPageByPath(pagePath);
    return findProviderPageByPath(location.pathname);
  }, [location.pathname, pagePath]);

  useEffect(() => {
    window.localStorage.setItem('faithhub.sidebar.collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <ProviderSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
      />

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
            bgcolor: isDark ? '#0f172a' : '#ffffff',
            border: `1px solid ${isDark ? '#334155' : '#dbe2ea'}`,
            color: isDark ? '#e2e8f0' : 'inherit',
            boxShadow: isDark ? '0 8px 16px -12px rgba(2, 6, 23, 0.9)' : '0 8px 16px -12px rgba(15, 23, 42, 0.45)',
            '&:hover': { bgcolor: isDark ? '#1e293b' : '#f8fafc' },
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

      <MobileBottomNav />
      <SearchCommandDialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        query={searchQuery}
        onQueryChange={setSearchQuery}
      />
    </Box>
  );
}
