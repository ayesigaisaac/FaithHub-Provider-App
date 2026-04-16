import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useState, type MouseEvent } from 'react';
import type { ProviderPageMeta } from '@/navigation/providerPages';
import { spacing } from '@/theme/spacing';
import { ThemeModeToggle } from '@/components/theme/ThemeModeToggle';
import { useAuth } from '@/auth/useAuth';

type ProviderTopbarProps = {
  current?: ProviderPageMeta;
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
};

export function ProviderTopbar({ current: _current, onOpenSidebar, onOpenSearch }: ProviderTopbarProps) {
  const { user, role, workspace, logout, setWorkspace } = useAuth();
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);
  const density = spacing.compact.mui;

  const openFilters = (event: MouseEvent<HTMLButtonElement>) => setFilterAnchor(event.currentTarget);
  const closeFilters = () => setFilterAnchor(null);
  const openUserMenu = (event: MouseEvent<HTMLButtonElement>) => setUserAnchor(event.currentTarget);
  const closeUserMenu = () => setUserAnchor(null);

  const initials = user?.name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Toolbar sx={{ minHeight: density.topbarToolbarMinHeight, px: density.topbarHeaderX, gap: 1 }}>
        <IconButton sx={{ display: { md: 'none' } }} onClick={onOpenSidebar}>
          <MenuRoundedIcon />
        </IconButton>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1, minWidth: 0 }}>
          <Button
            variant="contained"
            onClick={onOpenSearch}
            sx={{
              minWidth: 46,
              px: 1.5,
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
              boxShadow: 'none',
            }}
          >
            Go
          </Button>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              px: 1.5,
              height: 38,
              bgcolor: 'action.hover',
            }}
          >
            <SearchRoundedIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
            <InputBase
              placeholder="Search providers, streams, reports..."
              sx={{ width: '100%', fontSize: 14 }}
              onFocus={onOpenSearch}
            />
          </Box>
        </Stack>

        <Button
          variant="outlined"
          size="small"
          onClick={openFilters}
          sx={{
            display: { xs: 'none', lg: 'inline-flex' },
            borderColor: 'divider',
            color: 'text.primary',
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Quick filters
        </Button>

        <IconButton aria-label="Notifications">
          <Badge badgeContent={3} color="error">
            <NotificationsRoundedIcon />
          </Badge>
        </IconButton>
        <IconButton aria-label="Workspace controls">
          <AutoAwesomeRoundedIcon />
        </IconButton>
        <ThemeModeToggle />
        <IconButton aria-label="User menu" onClick={openUserMenu} sx={{ p: 0.25 }}>
          <Avatar sx={{ width: 38, height: 38, bgcolor: 'primary.main', fontWeight: 800 }}>{initials}</Avatar>
        </IconButton>
      </Toolbar>

      <Menu anchorEl={filterAnchor} open={Boolean(filterAnchor)} onClose={closeFilters}>
        <MenuItem onClick={closeFilters}>Live operations only</MenuItem>
        <MenuItem onClick={closeFilters}>Community pages only</MenuItem>
        <MenuItem onClick={closeFilters}>Giving and finance pages</MenuItem>
      </Menu>

      <Menu anchorEl={userAnchor} open={Boolean(userAnchor)} onClose={closeUserMenu}>
        <MenuItem disabled>
          <Box>
            <Typography variant="body2" fontWeight={700}>
              {user?.name || 'Provider User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email || 'unknown@faithhub.dev'}
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem disabled>
          <Typography variant="body2">
            Role: {role || 'leadership'} · {workspace?.campus || 'Kampala Central'}
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() =>
            setWorkspace({
              campus: workspace?.campus === 'Kampala Central' ? 'Online Studio' : 'Kampala Central',
              brand: workspace?.brand || 'FaithHub',
            })
          }
        >
          Switch campus
        </MenuItem>
        <MenuItem
          onClick={() =>
            setWorkspace({
              campus: workspace?.campus || 'Kampala Central',
              brand: workspace?.brand === 'FaithHub' ? 'FaithHub Plus' : 'FaithHub',
            })
          }
        >
          Switch brand
        </MenuItem>
        <MenuItem onClick={closeUserMenu}>Workspace settings</MenuItem>
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
