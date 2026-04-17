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
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded';
import KeyboardDoubleArrowLeftRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftRounded';
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
    label: 'Dashboard',
    to: '/faithhub/provider/dashboard',
    sections: ['Foundation & Mission Control', 'Content Structure & Teaching Creation'],
    icon: <DashboardRoundedIcon fontSize="small" />,
  },
  {
    label: 'Streams',
    to: '/faithhub/provider/live-dashboard',
    sections: ['Live Sessions Operations'],
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
  void onOpenSearch;

  const openUserMenu = (event: MouseEvent<HTMLButtonElement>) => setUserAnchor(event.currentTarget);
  const closeUserMenu = () => setUserAnchor(null);

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: '0 12px 28px -26px rgba(15, 23, 42, 0.55)',
      }}
    >
      <Toolbar
        sx={{
          minHeight: 76,
          px: { xs: 2, md: 3 },
          py: 0.9,
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

        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconButton sx={utilityIconSx}>
            <Badge badgeContent={2} color="success">
              <NotificationsRoundedIcon />
            </Badge>
          </IconButton>
          <IconButton aria-label="User menu" onClick={openUserMenu} sx={utilityIconSx}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#111827' }}>{initials}</Avatar>
          </IconButton>
        </Stack>
      </Toolbar>

      <Toolbar
        sx={{
          minHeight: 62,
          px: { xs: 2, md: 3 },
          py: 0.35,
          mt: 0,
          bgcolor: '#f8fafc',
          borderTop: '1px solid',
          borderColor: '#e5e7eb',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
          <Stack
            direction="row"
            spacing={1.25}
            alignItems="center"
            sx={{
              overflowX: 'auto',
              py: 0.25,
              pl: 0.25,
              '&::-webkit-scrollbar': { height: 7 },
              '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: 10 },
              '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
            }}
          >
            <Box
              sx={{
                bgcolor: '#10b981',
                color: '#fff',
                borderRadius: 999,
                px: 1.9,
                py: 0.6,
                fontSize: 17,
                fontWeight: 800,
                lineHeight: 1,
                border: '1px solid #0ea673',
                whiteSpace: 'nowrap',
              }}
            >
              FaithHub Provider
            </Box>
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
          <IconButton sx={{ border: '1px solid', borderColor: '#cfd8e3', bgcolor: '#fff', width: 48, height: 48 }}>
            <KeyboardDoubleArrowLeftRoundedIcon />
          </IconButton>
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

