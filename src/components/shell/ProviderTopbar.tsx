import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
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
  onOpenSearch: (anchorEl?: HTMLElement | null) => void;
  onCloseSearch: () => void;
  searchOpen: boolean;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
};

export function ProviderTopbar({
  current,
  onOpenSidebar,
  onOpenSearch,
  onCloseSearch,
  searchOpen,
  searchQuery,
  onSearchQueryChange,
}: ProviderTopbarProps) {
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
    borderRadius: '12px',
    width: { xs: 42, md: 46 },
    height: { xs: 42, md: 46 },
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
  const displayName = useMemo(() => {
    if (user?.name?.trim()) return user.name;
    const local = (user?.email?.split('@')[0] || 'user').trim();
    return local
      .replace(/[._-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }, [user?.email, user?.name]);
  const roleLabel = role ? role[0].toUpperCase() + role.slice(1) : 'Leadership';
  const initials = displayName
    .split(' ')
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
          minHeight: { xs: 64, md: 78 },
          px: { xs: 1.25, md: 3 },
          py: { xs: 0.35, md: 0.9 },
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ flex: 1 }}>
          <IconButton aria-label="Open navigation menu" sx={{ display: { md: 'none' } }} onClick={onOpenSidebar}>
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
            <IconButton aria-label="Open search" sx={utilityIconSx} onClick={() => onOpenSearch()}>
              <SearchRoundedIcon />
            </IconButton>
          ) : (
            <TextField
              value={searchQuery}
              onChange={(event) => {
                onSearchQueryChange(event.target.value);
                onOpenSearch(event.currentTarget);
              }}
              onFocus={(event) => onOpenSearch(event.currentTarget)}
              onClick={(event) => onOpenSearch(event.currentTarget)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  onCloseSearch();
                }
              }}
              placeholder="Search pages..."
              size="small"
              inputProps={{ 'aria-label': 'Search pages' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Stack direction="row" spacing={0.6} alignItems="center">
                      {searchQuery ? (
                        <IconButton
                          size="small"
                          aria-label="Clear search"
                          onClick={(event) => {
                            event.stopPropagation();
                            onSearchQueryChange('');
                          }}
                          sx={{
                            width: 24,
                            height: 24,
                            color: 'var(--fh-slate)',
                          }}
                        >
                          <CloseRoundedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      ) : null}
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
                          bgcolor: 'var(--fh-surface)',
                        }}
                      >
                        Ctrl K
                      </Box>
                    </Stack>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  minHeight: 46,
                  minWidth: 256,
                  px: 0.4,
                  borderColor: 'var(--fh-line)',
                  bgcolor: 'var(--fh-surface-bg)',
                  color: 'var(--fh-slate)',
                  fontWeight: 700,
                  '& fieldset': {
                    borderColor: searchOpen ? 'var(--fh-brand)' : 'var(--fh-line)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'color-mix(in srgb, var(--fh-line) 72%, var(--fh-ink) 28%)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--fh-brand)',
                  },
                },
                '& .MuiInputBase-input': {
                  py: 1.1,
                },
                borderRadius: '12px',
              }}
            />
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
          <IconButton aria-label="View notifications" sx={utilityIconSx}>
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
          minHeight: { xs: 54, md: 60 },
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
                  borderRadius: '12px',
                  px: { xs: 1.35, md: 1.9 },
                  py: { xs: 0.55, md: 0.75 },
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
                    aria-current={activeTopTab?.label === tab.label ? 'page' : undefined}
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 800,
                      minHeight: { xs: 40, md: 44 },
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

      <Menu
        anchorEl={userAnchor}
        open={Boolean(userAnchor)}
        onClose={closeUserMenu}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 300,
            borderRadius: '18px',
            border: '1px solid',
            borderColor: 'var(--fh-line)',
            bgcolor: 'var(--fh-surface-bg)',
            boxShadow: 'var(--fh-shadow-md)',
            overflow: 'hidden',
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Avatar sx={{ width: 38, height: 38, bgcolor: 'var(--fh-ink)', color: 'var(--fh-surface-bg)', fontWeight: 800 }}>
              {initials}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={800} sx={{ color: 'var(--fh-ink)', lineHeight: 1.2 }}>
                {displayName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--fh-slate)' }}>
                {user?.email || 'unknown@workspace.dev'}
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Divider />
        <MenuItem disabled>
          <Typography variant="body2">
            {roleLabel} - {workspace?.campus || 'Kampala Central'}
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeUserMenu();
            setWorkspace({
              campus: workspace?.campus === 'Kampala Central' ? 'Online Studio' : 'Kampala Central',
              brand: workspace?.brand || 'Provider',
            });
          }}
        >
          Switch campus
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeUserMenu();
            navigate('/faithhub/provider/profile-settings');
          }}
        >
          Profile settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeUserMenu();
            setWorkspace({
              campus: workspace?.campus || 'Kampala Central',
              brand: workspace?.brand === 'Provider' ? 'Provider Plus' : 'Provider',
            });
          }}
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
