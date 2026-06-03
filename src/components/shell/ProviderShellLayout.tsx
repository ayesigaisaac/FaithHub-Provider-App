import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { findProviderPageByPath } from '@/navigation/providerPages';
import { ProviderSidebar } from './ProviderSidebar';
import { ProviderTopbar } from './ProviderTopbar';
import { MobileBottomNav } from './MobileBottomNav';
import { SearchCommandDialog } from './SearchCommandDialog';
import { PageLoader } from '@/components/PageLoader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MediaFallbackContainer } from '@/components/MediaFallbackContainer';
import { runRawPlaceholderActionForElement } from '@/pages/provider/raw/placeholderActions';
import { useAuth } from '@/auth/useAuth';
import { teachingsShortcutRouteMap } from '@/navigation/teachingsQuickActions';

const ONBOARDING_BANNER_DISMISS_KEY = 'faithhub.onboarding.banner.dismissed';

const QUICK_GUIDE_BY_PATH: Record<
  string,
  { title: string; description: string; primaryLabel: string; primaryPath: string; secondaryLabel: string; secondaryPath: string }
> = {
  '/faithhub/provider/onboarding': {
    title: 'FaithHub registration',
    description: 'Register the provider, then move into profile completion.',
    primaryLabel: 'Open FaithHub Profile',
    primaryPath: '/faithhub/provider/profile-settings',
    secondaryLabel: 'Open FaithHub Dashboard',
    secondaryPath: '/faithhub/provider/dashboard',
  },
  '/faithhub/provider/profile-settings': {
    title: 'FaithHub profile completion',
    description: 'Finish verification and submit the provider application.',
    primaryLabel: 'Open FaithHub Dashboard',
    primaryPath: '/faithhub/provider/dashboard',
    secondaryLabel: 'Open FaithHub Services',
    secondaryPath: '/faithhub/provider/services',
  },
  '/faithhub/provider/dashboard': {
    title: 'FaithHub dashboard',
    description: 'Review provider status, then continue into services, campaigns, or live sessions.',
    primaryLabel: 'Open FaithHub Services',
    primaryPath: '/faithhub/provider/services',
    secondaryLabel: 'Open FaithHub Live Ops',
    secondaryPath: '/faithhub/provider/live-dashboard',
  },
  '/faithhub/provider/services': {
    title: 'FaithHub service workflow',
    description: 'Manage services first, then use campaigns and live sessions.',
    primaryLabel: 'Create Service',
    primaryPath: '/faithhub/provider/service-builder',
    secondaryLabel: 'Open FaithHub Campaigns',
    secondaryPath: '/faithhub/provider/campaigns',
  },
  '/faithhub/provider/campaigns': {
    title: 'FaithHub campaign workflow',
    description: 'Connect a campaign to approved services and review its approval state.',
    primaryLabel: 'Create Campaign',
    primaryPath: '/faithhub/provider/campaign-builder',
    secondaryLabel: 'Open FaithHub Content',
    secondaryPath: '/faithhub/provider/content-upload',
  },
  '/faithhub/provider/live-dashboard': {
    title: 'FaithHub live operations',
    description: 'Check the session list, then move into waiting room or studio.',
    primaryLabel: 'Open FaithHub Live Studio',
    primaryPath: '/faithhub/provider/live-studio',
    secondaryLabel: 'View FaithHub Waiting Room',
    secondaryPath: '/faithhub/provider/waiting-room',
  },
  '/faithhub/provider/live-session-details': {
    title: 'FaithHub live session details',
    description: 'Review the selected session before previewing the waiting room.',
    primaryLabel: 'Preview FaithHub Waiting Room',
    primaryPath: '/faithhub/provider/waiting-room',
    secondaryLabel: 'Open FaithHub Live Studio',
    secondaryPath: '/faithhub/provider/live-studio',
  },
  '/faithhub/provider/waiting-room': {
    title: 'FaithHub waiting room',
    description: 'Preview the audience experience before the live session begins.',
    primaryLabel: 'Go Live',
    primaryPath: '/faithhub/provider/live-studio',
    secondaryLabel: 'Back to dashboard',
    secondaryPath: '/faithhub/provider/live-dashboard',
  },
};

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
  const shortcutBufferRef = useRef<{ key: string; at: number }>({ key: '', at: 0 });
  const showOnboardingReminder =
    !onboardingBannerDismissed &&
    onboardingStatus !== 'approved' &&
    location.pathname !== '/faithhub/provider/onboarding';
  const quickGuide = QUICK_GUIDE_BY_PATH[location.pathname];

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
        return;
      }

      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const inInput = target?.closest('input, textarea, [contenteditable="true"]');
      if (inInput) return;

      const key = event.key.toLowerCase();
      const now = Date.now();
      const last = shortcutBufferRef.current;
      if (now - last.at > 900) {
        shortcutBufferRef.current = { key, at: now };
        return;
      }

      const combo = `${last.key} ${key}`;
      const route = teachingsShortcutRouteMap[combo];
      shortcutBufferRef.current = { key: '', at: 0 };
      if (route) {
        event.preventDefault();
        navigate(route);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [navigate]);

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
        bgcolor: 'var(--fh-page-bg)',
        backgroundImage: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, color-mix(in srgb, var(--fh-surface-bg) 95%, black 5%) 0%, var(--fh-page-bg) 45%, color-mix(in srgb, var(--fh-page-bg) 90%, black 10%) 100%)'
            : 'linear-gradient(180deg, color-mix(in srgb, var(--fh-surface) 70%, white 30%) 0%, var(--fh-page-bg) 45%, color-mix(in srgb, var(--fh-page-bg) 92%, #dfe8e5 8%) 100%)',
      }}
    >
      <a href="#provider-main-content" className="fh-skip-link">
        Skip to main content
      </a>

      <ProviderTopbar
        current={current}
        onOpenSidebar={() => setMobileOpen(true)}
        onOpenSearch={(anchorEl) => {
          const fallbackAnchor =
            anchorEl ??
            (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement
              ? document.activeElement
              : null);
          setSearchAnchorEl(fallbackAnchor);
          setSearchOpen(true);
        }}
        onCloseSearch={() => {
          setSearchOpen(false);
        }}
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
          {quickGuide ? (
            <Box sx={{ px: { xs: 1, md: 1.5 }, pt: 1 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                sx={{
                  border: '1px solid',
                  borderColor: 'var(--fh-line)',
                  borderRadius: 2,
                  bgcolor: 'color-mix(in srgb, var(--fh-surface) 72%, var(--fh-surface-bg) 28%)',
                  px: 1.5,
                  py: 1.1,
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: 12.5, fontWeight: 800, color: 'var(--fh-ink)', lineHeight: 1.2 }}>
                    {quickGuide.title}
                  </Typography>
                  <Typography sx={{ mt: 0.35, fontSize: 11.5, fontWeight: 550, color: 'var(--fh-slate)', lineHeight: 1.25 }}>
                    {quickGuide.description}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={0.8} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => navigate(quickGuide.primaryPath)}
                    sx={{ textTransform: 'none', fontWeight: 700, minHeight: 34, borderRadius: 1.6 }}
                  >
                    {quickGuide.primaryLabel}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(quickGuide.secondaryPath)}
                    sx={{ textTransform: 'none', fontWeight: 700, minHeight: 34, borderRadius: 1.6 }}
                  >
                    {quickGuide.secondaryLabel}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          ) : null}
          <Box
            className="provider-shell-surface"
            sx={{
              borderRadius: { xs: 0, md: 3 },
              border: '1px solid',
              borderColor: 'var(--fh-line)',
              bgcolor: 'var(--fh-surface-bg)',
              p: { xs: 0.5, md: 0.8 },
              minHeight: 'auto',
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

      <MobileBottomNav />
      <SearchCommandDialog
        open={searchOpen}
        onClose={() => {
          setSearchOpen(false);
        }}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        returnFocusEl={searchAnchorEl}
      />
    </Box>
  );
}
