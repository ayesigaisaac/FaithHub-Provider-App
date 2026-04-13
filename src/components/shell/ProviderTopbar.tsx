import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Select,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useState, type MouseEvent } from 'react';
import type { ProviderPageMeta } from '@/navigation/providerPages';

type ProviderTopbarProps = {
  current?: ProviderPageMeta;
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
};

export function ProviderTopbar({ current, onOpenSidebar, onOpenSearch }: ProviderTopbarProps) {
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);

  const openFilters = (event: MouseEvent<HTMLButtonElement>) => setFilterAnchor(event.currentTarget);
  const closeFilters = () => setFilterAnchor(null);
  const openUserMenu = (event: MouseEvent<HTMLButtonElement>) => setUserAnchor(event.currentTarget);
  const closeUserMenu = () => setUserAnchor(null);

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: '1px solid #e5e7eb',
        bgcolor: '#ffffff',
      }}
    >
      <Toolbar sx={{ minHeight: 68, px: { xs: 1.5, md: 2.5 }, gap: 1.25 }}>
        <IconButton sx={{ display: { md: 'none' } }} onClick={onOpenSidebar}>
          <MenuRoundedIcon />
        </IconButton>

        <Box sx={{ minWidth: 220, display: { xs: 'none', md: 'block' } }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827' }}>
            Dashboard
          </Typography>
          <Breadcrumbs separator=">" sx={{ mt: -0.75 }}>
            <Typography variant="body2" color="text.secondary">
              Home
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {current?.section ?? 'Provider'}
            </Typography>
            <Typography variant="body2" color="text.primary" fontWeight={600}>
              {current?.title ?? 'Dashboard'}
            </Typography>
          </Breadcrumbs>
        </Box>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1, minWidth: 0 }}>
          <Button
            variant="contained"
            onClick={onOpenSearch}
            sx={{
              minWidth: 46,
              px: 1.5,
              bgcolor: '#10b981',
              '&:hover': { bgcolor: '#059669' },
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
              border: '1px solid #e5e7eb',
              borderRadius: 2,
              px: 1.5,
              height: 38,
              bgcolor: '#f3f4f6',
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
            borderColor: '#d1d5db',
            color: '#111827',
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
        <IconButton aria-label="User menu" onClick={openUserMenu} sx={{ p: 0.25 }}>
          <Avatar sx={{ width: 38, height: 38, bgcolor: '#10b981', fontWeight: 800 }}>A</Avatar>
        </IconButton>
      </Toolbar>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, md: 3 },
          py: 2,
          borderTop: '1px solid #f3f4f6',
          bgcolor: '#f9fafb',
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontSize: { xs: 24, md: 34 }, fontWeight: 700 }}>
            {current?.title ?? 'Provider Dashboard'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {current?.description ?? 'Daily overview for FaithHub provider operations.'}
          </Typography>
        </Box>
        <Stack direction="row" alignItems="flex-end" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Period
            </Typography>
            <Select
              size="small"
              value="today"
              IconComponent={KeyboardArrowDownRoundedIcon}
              sx={{ minWidth: 152, bgcolor: '#fff' }}
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">Last 7 days</MenuItem>
              <MenuItem value="month">Last 30 days</MenuItem>
            </Select>
          </Box>
        </Stack>
      </Box>

      <Menu anchorEl={filterAnchor} open={Boolean(filterAnchor)} onClose={closeFilters}>
        <MenuItem onClick={closeFilters}>Live operations only</MenuItem>
        <MenuItem onClick={closeFilters}>Community pages only</MenuItem>
        <MenuItem onClick={closeFilters}>Giving and finance pages</MenuItem>
      </Menu>

      <Menu anchorEl={userAnchor} open={Boolean(userAnchor)} onClose={closeUserMenu}>
        <MenuItem onClick={closeUserMenu}>Profile</MenuItem>
        <MenuItem onClick={closeUserMenu}>Workspace settings</MenuItem>
        <MenuItem onClick={closeUserMenu}>Logout</MenuItem>
      </Menu>
    </AppBar>
  );
}
