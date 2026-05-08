import { Alert, Box, Button } from '@mui/material';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { findProviderPageByPath } from '@/navigation/providerPages';
import { ProviderSidebar } from './ProviderSidebar';
import { ProviderTopbar } from './ProviderTopbar';
import { QuickCreateDial } from './QuickCreateDial';
import { MobileBottomNav } from './MobileBottomNav';
import { SearchCommandDialog } from './SearchCommandDialog';
import { PageLoader } from '@/components/PageLoader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MediaFallbackContainer } from '@/components/MediaFallbackContainer';
import { runRawPlaceholderActionForElement } from '@/pages/provider/raw/placeholderActions';
import { useAuth } from '@/auth/useAuth';

const ONBOARDING_BANNER_DISMISS_KEY = 'faithhub.onboarding.banner.dismissed';

function hasReactOnClickHandler(button: HTMLButtonElement): boolean {
  const keys = Object.keys(button as unknown as Record<string, unknown>);
  const reactPropsKey = keys.find((key) => key.startsWith('__reactProps$'));
  if (!reactPropsKey) return false;

  const reactProps = (button as unknown as Record<string, unknown>)[reactPropsKey] as { onClick?: unknown } | undefined;
  return typeof reactProps?.onClick === 'function';
}

export function ProviderShellLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { onboardingStatus } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchAnchorEl, setSearchAnchorEl] = useState<HTMLElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('faithhub.sidebar.collapsed') === 'true';
  });
  const [onboardingBannerDismissed, setOnboardingBannerDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.sessionStorage.getItem(ONBOARDING_BANNER_DISMISS_KEY) === 'true';
  });

  const current = useMemo(() => findProviderPageByPath(location.pathname), [location.pathname]);
  const showOnboardingReminder =
    !onboardingBannerDismissed &&
    onboardingStatus !== 'approved' &&
    location.pathname !== '/faithhub/provider/onboarding';

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

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const button = target.closest('button');
      if (!button) return;
      if (!(button instanceof HTMLButtonElement)) return;
      if (button.disabled) return;
      if (button.type === 'submit') return;
      if (button.dataset.noAutoAction === 'true') return;
      if (!button.closest('.provider-shell-surface')) return;
      if (hasReactOnClickHandler(button)) return;

      void runRawPlaceholderActionForElement(button);
    };

    document.addEventListener('click', onDocumentClick);
    return () => document.removeEventListener('click', onDocumentClick);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0b1220' : '#e8eeec'),
        backgroundImage: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, #0f172a 0%, #0b1220 45%, #0a1020 100%)'
            : 'linear-gradient(180deg, #eff4f2 0%, #e8eeec 45%, #e3ebe9 100%)',
      }}
    >
      <a href="#provider-main-content" className="fh-skip-link">
        Skip to main content
      </a>

      <ProviderTopbar
        current={current}
        onOpenSidebar={() => setMobileOpen(true)}
        onOpenSearch={(anchorEl) => {
          if (anchorEl) setSearchAnchorEl(anchorEl);
          setSearchOpen(true);
        }}
        onCloseSearch={() => setSearchOpen(false)}
        searchOpen={searchOpen}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      {showOnboardingReminder ? (
        <Alert
          severity="info"
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                color="inherit"
                size="small"
                onClick={() => navigate('/faithhub/provider/onboarding')}
              >
                Continue onboarding
              </Button>
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  setOnboardingBannerDismissed(true);
                  window.sessionStorage.setItem(ONBOARDING_BANNER_DISMISS_KEY, 'true');
                }}
              >
                Dismiss
              </Button>
            </Box>
          }
          sx={{
            mx: { xs: 1, md: 1.5 },
            mt: 1,
            borderRadius: 1.5,
          }}
        >
          Onboarding is not complete yet. You can keep working and finish it anytime.
        </Alert>
      ) : null}

      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', minWidth: 0 }}>
        <ProviderSidebar
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        />

        <Box
          component="main"
          id="provider-main-content"
          className="provider-main-scroll"
          tabIndex={-1}
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
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#1f2937' : '#d2ddd8'),
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0f172a' : '#f4f7f6'),
              p: { xs: 0.5, md: 0.8 },
              minHeight: '100%',
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 20px 40px -34px rgba(2, 6, 23, 0.92)'
                  : '0 24px 42px -38px rgba(15, 23, 42, 0.52)',
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
      <SearchCommandDialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        returnFocusEl={searchAnchorEl}
      />
    </Box>
  );
}
