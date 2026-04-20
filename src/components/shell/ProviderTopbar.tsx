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
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const { user, role, workspace, logout, setWorkspace } = useAuth();
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);
  const [sectionAnchor, setSectionAnchor] = useState<null | HTMLElement>(null);
  const isTinyScreen = useMediaQuery('(max-width:399.95px)');
  const utilityIconSx = {
    border: '1px solid',
    borderColor: isDark ? '#334155' : '#d9e1ec',
    borderRadius: 3,
    width: { xs: 40, md: 48 },
    height: { xs: 40, md: 48 },
    bgcolor: isDark ? '#0f172a' : '#fff',
    color: isDark ? '#cbd5e1' : '#475569',
    '&:hover': { borderColor: isDark ? '#475569' : '#c1ccda', bgcolor: isDark ? '#111c30' : '#f8fafc' },
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
        boxShadow: '0 12px 28px -26px rgba(15, 23, 42, 0.55)',
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
          <IconButton aria-label="Open search" sx={utilityIconSx} onClick={onOpenSearch}>
            <SearchRoundedIcon />
          </IconButton>
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
            <Avatar sx={{ width: { xs: 28, md: 32 }, height: { xs: 28, md: 32 }, bgcolor: isDark ? '#0f172a' : '#111827' }}>
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
          bgcolor: isDark ? '#0f172a' : '#f8fafc',
          borderTop: '1px solid',
          borderColor: isDark ? '#334155' : '#e5e7eb',
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
                  borderColor: '#cfd8e3',
                  bgcolor: isDark ? '#111c30' : '#fff',
                  color: isDark ? '#f8fafc' : '#111827',
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
                  '&::-webkit-scrollbar-thumb': { backgroundColor: isDark ? '#334155' : '#cbd5e1', borderRadius: 10 },
                  '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
                }}
              >
                <Box
                  sx={{
                    bgcolor: '#10b981',
                    color: '#fff',
                    borderRadius: 999,
                    px: { xs: 1.35, md: 1.9 },
                    py: { xs: 0.45, md: 0.6 },
                    fontSize: { xs: 14, md: 17 },
                    fontWeight: 800,
                    lineHeight: 1,
                    border: '1px solid #0ea673',
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
                      borderColor: activeTopTab?.label === tab.label ? '#10b981' : isDark ? '#334155' : '#cfd8e3',
                      bgcolor: activeTopTab?.label === tab.label ? '#10b981' : isDark ? '#111c30' : '#ffffff',
                      color: activeTopTab?.label === tab.label ? '#ffffff' : isDark ? '#f8fafc' : '#111827',
                      whiteSpace: 'nowrap',
                      '& .MuiButton-startIcon': {
                        color: activeTopTab?.label === tab.label ? '#ffffff' : isDark ? '#cbd5e1' : '#0f172a',
                        mr: 0.9,
                      },
                      '&:hover': {
                        borderColor: activeTopTab?.label === tab.label ? '#0f9f72' : isDark ? '#475569' : '#b9c6d8',
                        bgcolor: activeTopTab?.label === tab.label ? '#0f9f72' : isDark ? '#162236' : '#f3f6fa',
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

