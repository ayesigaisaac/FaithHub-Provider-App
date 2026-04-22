import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useMemo, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { topbarTabs } from '@/navigation/topbarTabs';
import type { ProviderPageMeta } from '@/navigation/providerPages';
import { resolveKnownProviderPath } from '@/navigation/providerPages';
import { ThemeModeToggle } from '@/components/theme/ThemeModeToggle';

type ProviderTopbarProps = {
  current?: ProviderPageMeta;
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
};

export function ProviderTopbar({ current, onOpenSidebar, onOpenSearch }: ProviderTopbarProps) {
  const theme = useTheme();
  const isMobileActions = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, role, workspace, logout, setWorkspace } = useAuth();
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);
  const [sectionAnchor, setSectionAnchor] = useState<null | HTMLElement>(null);
  const isTinyScreen = useMediaQuery('(max-width:399.95px)');
  const utilityIconSx = {
    border: '1px solid',
    borderColor: 'var(--fh-line)',
    borderRadius: 'var(--fh-radius-xl)',
    width: { xs: 40, md: 48 },
    height: { xs: 40, md: 48 },
    bgcolor: 'var(--fh-surface-bg)',
    color: 'var(--fh-slate)',
    '&:hover': {
      borderColor: 'color-mix(in srgb, var(--fh-line) 72%, var(--fh-ink) 28%)',
      bgcolor: 'var(--fh-surface)',
    },
  };
  const activeTopTab = useMemo(
    () => topbarTabs.find((tab) => tab.sections.includes(current?.section ?? '')),
    [current?.section]
  );
  const initials = user?.name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  const openUserMenu = (event: MouseEvent<HTMLButtonElement>) => setUserAnchor(event.currentTarget);
  const closeUserMenu = () => setUserAnchor(null);
  const openSectionMenu = (event: MouseEvent<HTMLButtonElement>) => setSectionAnchor(event.currentTarget);
  const closeSectionMenu = () => setSectionAnchor(null);

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        top: 0,
        zIndex: 1100,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: 'var(--fh-shadow-sm)',
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 60, md: 76 },
          px: { xs: 1.25, md: 3 },
          py: { xs: 0.35, md: 0.9 },
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ flex: 1 }}>
          <IconButton sx={{ display: { md: 'none' } }} onClick={onOpenSidebar}>
            <MenuRoundedIcon />
          </IconButton>
          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <BrandLogo variant="symbol" alt="Provider Workspace" style={{ height: 34, width: 34 }} />
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <BrandLogo variant="landscape" alt="Provider Workspace" style={{ height: 62, width: 'auto' }} />
          </Box>
        </Stack>

        <Stack direction="row" spacing={{ xs: 0.75, md: 1.5 }} alignItems="center">
          {isMobileActions ? (
            <IconButton aria-label="Open search" sx={utilityIconSx} onClick={onOpenSearch}>
              <SearchRoundedIcon />
            </IconButton>
          ) : (
            <Button
              onClick={onOpenSearch}
              startIcon={<SearchRoundedIcon />}
              variant="outlined"
              sx={{
                borderRadius: 'var(--fh-radius-xl)',
                textTransform: 'none',
                minHeight: 48,
                minWidth: 256,
                px: 1.8,
                justifyContent: 'space-between',
                borderColor: 'var(--fh-line)',
                bgcolor: 'var(--fh-surface-bg)',
                color: 'var(--fh-slate)',
                fontWeight: 700,
                '&:hover': {
                  borderColor: 'color-mix(in srgb, var(--fh-line) 72%, var(--fh-ink) 28%)',
                  bgcolor: 'var(--fh-surface)',
                },
              }}
            >
              <Box component="span" sx={{ flex: 1, textAlign: 'left' }}>
                Search pages...
              </Box>
              <Box
                component="span"
                sx={{
                  border: '1px solid',
                  borderColor: 'var(--fh-line)',
                  borderRadius: 1.5,
                  px: 0.8,
                  py: 0.15,
                  fontSize: 11,
                  lineHeight: 1.2,
                  color: 'var(--fh-slate)',
                }}
              >
                Ctrl K
              </Box>
            </Button>
          )}
          <Box
            sx={{
              ...utilityIconSx,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <ThemeModeToggle size="small" />
          </Box>
          <IconButton sx={utilityIconSx}>
            <Badge badgeContent={2} color="success">
              <NotificationsRoundedIcon />
            </Badge>
          </IconButton>
          <IconButton aria-label="User menu" onClick={openUserMenu} sx={utilityIconSx}>
            <Avatar sx={{ width: { xs: 28, md: 32 }, height: { xs: 28, md: 32 }, bgcolor: 'var(--fh-ink)', color: 'var(--fh-surface-bg)' }}>
              {initials}
            </Avatar>
          </IconButton>
        </Stack>
      </Toolbar>

      <Toolbar
        sx={{
          minHeight: { xs: 50, md: 62 },
          px: { xs: 1.25, md: 3 },
          py: { xs: 0.2, md: 0.35 },
          mt: 0,
          bgcolor: 'var(--fh-surface)',
          borderTop: '1px solid',
          borderColor: 'var(--fh-line)',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
          {isTinyScreen ? (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={activeTopTab?.icon ?? topbarTabs[0].icon}
                onClick={openSectionMenu}
                sx={{
                  justifyContent: 'flex-start',
                  borderRadius: 999,
                  textTransform: 'none',
                  fontWeight: 800,
                  minHeight: 34,
                  px: 1.3,
                  borderWidth: 1,
                  borderColor: 'var(--fh-line)',
                  bgcolor: 'var(--fh-surface-bg)',
                  color: 'var(--fh-ink)',
                }}
              >
                {activeTopTab?.label ?? topbarTabs[0].label}
              </Button>
            </Stack>
          ) : (
            <>
              <Stack
                direction="row"
                spacing={1.25}
                alignItems="center"
                sx={{
                  overflowX: 'auto',
                  py: 0.25,
                  pl: 0.25,
                  '&::-webkit-scrollbar': { height: 7 },
                  '&::-webkit-scrollbar-thumb': { backgroundColor: 'var(--fh-line)', borderRadius: 10 },
                  '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
                }}
              >
                <Box
                  sx={{
                    bgcolor: 'var(--fh-brand)',
                    color: 'var(--fh-surface-bg)',
                    borderRadius: 999,
                    px: { xs: 1.35, md: 1.9 },
                    py: { xs: 0.45, md: 0.6 },
                    fontSize: { xs: 14, md: 17 },
                    fontWeight: 800,
                    lineHeight: 1,
                    border: '1px solid var(--fh-brand-dark)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Provider
                </Box>
                {topbarTabs.map((tab) => (
                  <Button
                    key={tab.label}
                    startIcon={tab.icon}
                    variant="outlined"
                    onClick={() => navigate(resolveKnownProviderPath(tab.to))}
                    sx={{
                      borderRadius: 999,
                      textTransform: 'none',
                      fontWeight: 800,
                      minHeight: { xs: 36, md: 44 },
                      px: { xs: 1.35, md: 2.1 },
                      fontSize: { xs: 13, md: 16 },
                      borderWidth: 1,
                      borderColor: activeTopTab?.label === tab.label ? 'var(--fh-brand)' : 'var(--fh-line)',
                      bgcolor: activeTopTab?.label === tab.label ? 'var(--fh-brand)' : 'var(--fh-surface-bg)',
                      color: activeTopTab?.label === tab.label ? 'var(--fh-surface-bg)' : 'var(--fh-ink)',
                      whiteSpace: 'nowrap',
                      '& .MuiButton-startIcon': {
                        color: activeTopTab?.label === tab.label ? 'var(--fh-surface-bg)' : 'var(--fh-slate)',
                        mr: 0.9,
                      },
                      '&:hover': {
                        borderColor:
                          activeTopTab?.label === tab.label
                            ? 'var(--fh-brand-dark)'
                            : 'color-mix(in srgb, var(--fh-line) 72%, var(--fh-ink) 28%)',
                        bgcolor:
                          activeTopTab?.label === tab.label
                            ? 'var(--fh-brand-dark)'
                            : 'color-mix(in srgb, var(--fh-surface) 90%, var(--fh-surface-bg) 10%)',
                      },
                    }}
                  >
                    {tab.label}
                  </Button>
                ))}
              </Stack>
            </>
          )}
        </Stack>
      </Toolbar>
      <Menu anchorEl={sectionAnchor} open={Boolean(sectionAnchor)} onClose={closeSectionMenu}>
        {topbarTabs.map((tab) => (
          <MenuItem
            key={`tiny-${tab.label}`}
            onClick={() => {
              navigate(resolveKnownProviderPath(tab.to));
              closeSectionMenu();
            }}
            selected={activeTopTab?.label === tab.label}
          >
            {tab.label}
          </MenuItem>
        ))}
      </Menu>

      <Menu anchorEl={userAnchor} open={Boolean(userAnchor)} onClose={closeUserMenu}>
        <MenuItem disabled>
          <Box>
            <Typography variant="body2" fontWeight={700}>
              {user?.name || 'Provider User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email || 'unknown@workspace.dev'}
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem disabled>
          <Typography variant="body2">
            Role: {role || 'leadership'} - {workspace?.campus || 'Kampala Central'}
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() =>
            setWorkspace({
              campus: workspace?.campus === 'Kampala Central' ? 'Online Studio' : 'Kampala Central',
              brand: workspace?.brand || 'Provider',
            })
          }
        >
          Switch campus
        </MenuItem>
        <MenuItem
          onClick={() =>
            setWorkspace({
              campus: workspace?.campus || 'Kampala Central',
              brand: workspace?.brand === 'Provider' ? 'Provider Plus' : 'Provider',
            })
          }
        >
          Switch brand
        </MenuItem>
        <MenuItem
          onClick={async () => {
            closeUserMenu();
            await logout();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
