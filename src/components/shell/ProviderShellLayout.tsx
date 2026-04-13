import {
  AppBar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { Suspense, useMemo, useState } from 'react';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import { findProviderPageByPath } from '@/navigation/providerPages';
import { ProviderSidebar, providerDrawerWidth } from './ProviderSidebar';
import { SearchCommandDialog } from './SearchCommandDialog';
import { MobileBottomNav } from './MobileBottomNav';
import { QuickCreateDial } from './QuickCreateDial';
import { PageLoader } from '@/components/PageLoader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MediaFallbackContainer } from '@/components/MediaFallbackContainer';

export function ProviderShellLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const current = findProviderPageByPath(location.pathname);
  const breadcrumbs = useMemo(() => {
    if (!current) return [];
    return [current.section, current.title];
  }, [current]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <ProviderSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${providerDrawerWidth}px)` },
          ml: { md: `${providerDrawerWidth}px` },
          borderBottom: '1px solid rgba(15,23,42,0.08)',
          backdropFilter: 'blur(16px)',
          bgcolor: 'rgba(255,255,255,0.8)',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 72, md: 76 }, gap: 1.5 }}>
          <IconButton sx={{ display: { md: 'none' } }} onClick={() => setMobileOpen(true)}>
            <MenuRoundedIcon />
          </IconButton>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Typography variant="h6" fontWeight={800} noWrap>
                {current?.title ?? 'FaithHub Provider App'}
              </Typography>
              {current?.id ? <Chip size="small" label={current.id} variant="outlined" /> : null}
            </Stack>
            {breadcrumbs.length ? (
              <Breadcrumbs sx={{ mt: 0.25 }} aria-label="breadcrumbs">
                {breadcrumbs.map((crumb, index) => (
                  <Typography key={crumb} variant="caption" color={index === breadcrumbs.length - 1 ? 'text.primary' : 'text.secondary'}>
                    {crumb}
                  </Typography>
                ))}
              </Breadcrumbs>
            ) : (
              <Typography variant="caption" color="text.secondary">
                Responsive Vite + React + TypeScript workspace
              </Typography>
            )}
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="outlined"
              startIcon={<SearchRoundedIcon />}
              onClick={() => setSearchOpen(true)}
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Search pages
            </Button>
            <IconButton
              aria-label="Search pages"
              onClick={() => setSearchOpen(true)}
              sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
            >
              <SearchRoundedIcon />
            </IconButton>
            <Button
              component={RouterLink}
              to="/faithhub/provider/preview-shell"
              variant="contained"
              startIcon={<OpenInNewRoundedIcon />}
              sx={{ display: { xs: 'none', lg: 'inline-flex' } }}
            >
              Preview shell
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1, minWidth: 0, ml: { md: `${providerDrawerWidth}px` } }}>
        <Toolbar sx={{ minHeight: { xs: 72, md: 76 } }} />
        <Box sx={{ px: { xs: 1.25, sm: 1.75, md: 2.25 }, py: { xs: 1.25, md: 2 }, pb: { xs: 11, md: 3 } }}>
          <ErrorBoundary label={current?.title}>
            <MediaFallbackContainer>
              <Suspense fallback={<PageLoader title={`Loading ${current?.title ?? 'workspace page'}…`} />}>
                <Outlet />
              </Suspense>
            </MediaFallbackContainer>
          </ErrorBoundary>
        </Box>
      </Box>

      <SearchCommandDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <QuickCreateDial />
      <MobileBottomNav />
    </Box>
  );
}
