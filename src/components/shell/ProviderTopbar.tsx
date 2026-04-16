import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded';
import DomainRoundedIcon from '@mui/icons-material/DomainRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useMemo, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import type { ProviderPageMeta } from '@/navigation/providerPages';

type ProviderTopbarProps = {
  current?: ProviderPageMeta;
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
};

const secondaryTabs = [
  {
    label: 'Streams',
    to: '/faithhub/provider/live-dashboard',
    sections: ['Live Sessionz Operations'],
    icon: <PlayCircleOutlineRoundedIcon fontSize="small" />,
  },
  {
    label: 'Community',
    to: '/faithhub/provider/community-groups',
    sections: ['Audience & Outreach', 'Community & Care'],
    icon: <GroupsRoundedIcon fontSize="small" />,
  },
  {
    label: 'Giving',
    to: '/faithhub/provider/donations-and-funds',
    sections: ['Events & Giving'],
    icon: <VolunteerActivismRoundedIcon fontSize="small" />,
  },
  {
    label: 'Reports',
    to: '/faithhub/provider/reviews-and-moderation',
    sections: ['Post-live & Trust', 'Leadership & Team', 'Workspace Settings', 'Beacon', 'Previews'],
    icon: <EventNoteRoundedIcon fontSize="small" />,
  },
];

export function ProviderTopbar({ current, onOpenSidebar, onOpenSearch }: ProviderTopbarProps) {
  const navigate = useNavigate();
  const { user, role, workspace, logout, setWorkspace } = useAuth();
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);
  const utilityButtonSx = {
    borderRadius: 3,
    px: 1.2,
    minHeight: 48,
    borderColor: '#cfe3db',
    color: '#334155',
    textTransform: 'none',
    '&:hover': { borderColor: '#9fd7c5', bgcolor: '#f8fbfa' },
  } as const;
  const utilityIconSx = {
    border: '1px solid',
    borderColor: '#d9e1ec',
    borderRadius: 3,
    width: 48,
    height: 48,
    bgcolor: '#fff',
    color: '#475569',
    '&:hover': { borderColor: '#c1ccda', bgcolor: '#f8fafc' },
  } as const;
  const activeTopTab = useMemo(
    () => secondaryTabs.find((tab) => tab.sections.includes(current?.section ?? '')),
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
      <Toolbar
        sx={{
          minHeight: 86,
          px: { xs: 2, md: 3 },
          pt: 1.25,
          pb: 1.75,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ flex: 1 }}>
          <IconButton sx={{ display: { md: 'none' } }} onClick={onOpenSidebar}>
            <MenuRoundedIcon />
          </IconButton>
          <Avatar src="/assets/logo.svg" alt="FaithHub" sx={{ width: 46, height: 46 }} />
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography sx={{ fontWeight: 900, fontSize: 30, lineHeight: 0.9, color: '#13b981' }}>FaithHub</Typography>
            <Typography sx={{ fontWeight: 800, fontSize: 28, lineHeight: 0.9, color: '#111827' }}>Provider</Typography>
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button variant="outlined" endIcon={<KeyboardArrowDownRoundedIcon />} sx={utilityButtonSx}>
              <DomainRoundedIcon />
            </Button>
            <Button variant="outlined" endIcon={<KeyboardArrowDownRoundedIcon />} sx={utilityButtonSx}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#111827' }}>{initials}</Avatar>
            </Button>
          </Stack>

          <Divider orientation="vertical" flexItem sx={{ borderColor: '#d9e1ec', mx: 0.25 }} />
          <IconButton onClick={onOpenSearch} sx={utilityIconSx}>
            <SearchRoundedIcon />
          </IconButton>

          <Divider orientation="vertical" flexItem sx={{ borderColor: '#d9e1ec', mx: 0.25 }} />

          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconButton sx={utilityIconSx}>
              <Badge badgeContent={2} color="success">
                <NotificationsRoundedIcon />
              </Badge>
            </IconButton>
            <IconButton aria-label="User menu" onClick={openUserMenu} sx={utilityIconSx}>
              <Avatar />
            </IconButton>
          </Stack>
        </Stack>
      </Toolbar>

      <Toolbar
        sx={{
          minHeight: 74,
          px: { xs: 2, md: 3 },
          pt: 0.5,
          pb: 0.5,
          mt: 0,
          bgcolor: '#f8fafc',
        }}
      >
        <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ overflowX: 'auto', py: 0.25, pl: 0.25 }}>
            {secondaryTabs.map((tab) => (
              <Button
                key={tab.label}
                startIcon={tab.icon}
                variant="outlined"
                onClick={() => navigate(tab.to)}
                sx={{
                  borderRadius: 999,
                  textTransform: 'none',
                  fontWeight: 800,
                  minHeight: 44,
                  px: 2.1,
                  borderWidth: 1,
                  borderColor: activeTopTab?.label === tab.label ? '#10b981' : '#cfd8e3',
                  bgcolor: activeTopTab?.label === tab.label ? '#10b981' : '#ffffff',
                  color: activeTopTab?.label === tab.label ? '#ffffff' : '#111827',
                  whiteSpace: 'nowrap',
                  '& .MuiButton-startIcon': {
                    color: activeTopTab?.label === tab.label ? '#ffffff' : '#0f172a',
                    mr: 0.9,
                  },
                  '&:hover': {
                    borderColor: activeTopTab?.label === tab.label ? '#0f9f72' : '#b9c6d8',
                    bgcolor: activeTopTab?.label === tab.label ? '#0f9f72' : '#f3f6fa',
                  },
                }}
              >
                {tab.label}
              </Button>
            ))}
          </Stack>
        </Stack>
      </Toolbar>

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
            Role: {role || 'leadership'} - {workspace?.campus || 'Kampala Central'}
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

