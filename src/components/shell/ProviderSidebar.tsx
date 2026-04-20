import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import KeyboardDoubleArrowLeftRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftRounded';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { getProviderPagesBySection, providerSections } from '@/navigation/providerPages';

const drawerWidth = 318;
const topbarOffsetMobile = 110;
const topbarOffsetDesktop = 138;

const sectionLabelMap: Partial<Record<(typeof providerSections)[number], string>> = {
  'Foundation & Mission Control': 'Core',
  'Content Structure & Teaching Creation': 'Content',
  'Live Sessions Operations': 'Streams',
  'Audience & Outreach': 'Outreach',
  'Post-live & Trust': 'Post-live',
  'Events & Giving': 'Giving',
  Beacon: 'Beacon',
  'Community & Care': 'Community',
  'Leadership & Team': 'Leadership',
  'Workspace Settings': 'Settings',
};

export function ProviderSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation();
  const sections = providerSections
    .map((section) => ({
      section,
      label: sectionLabelMap[section] ?? section,
      pages: getProviderPagesBySection(section),
    }))
    .filter((group) => group.pages.length > 0);

  const content = (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0b1220' : '#e7efee'),
      }}
    >
      <Box sx={{ p: 1.25, height: '100%', minHeight: 0 }}>
        <Box
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: (theme) => (theme.palette.mode === 'dark' ? '#334155' : '#d6dee7'),
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0f172a' : '#fff'),
            overflow: 'hidden',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 20px 40px -32px rgba(2, 6, 23, 0.9)'
                : '0 20px 40px -32px rgba(15, 23, 42, 0.42)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: 0,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1.5, py: 1.05 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: 22,
                  lineHeight: 0.98,
                  letterSpacing: '-0.01em',
                  color: (theme) => (theme.palette.mode === 'dark' ? '#f8fafc' : '#0f172a'),
                }}
              >
                Provider Workspace
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 12.5, lineHeight: 1.08, letterSpacing: '0.01em', mt: 0.2 }}>
                Navigation
              </Typography>
            </Box>
            <Avatar
              sx={{
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0f172a' : '#fff'),
                color: (theme) => (theme.palette.mode === 'dark' ? '#e2e8f0' : '#111827'),
                border: '1px solid',
                borderColor: (theme) => (theme.palette.mode === 'dark' ? '#334155' : '#d1d5db'),
                width: 38,
                height: 38,
              }}
            >
              <KeyboardDoubleArrowLeftRoundedIcon />
            </Avatar>
          </Stack>

          <Divider />

          <List
            sx={{
              p: 1,
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              '&::-webkit-scrollbar': { width: 8 },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#334155' : '#cbd5e1'),
                borderRadius: 10,
              },
              '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
            }}
          >
            {sections.map((group) => (
              <Box key={group.section} sx={{ mb: 0.75 }}>
                <ListSubheader
                  disableSticky
                  sx={{
                    bgcolor: 'transparent',
                    px: 1.25,
                    py: 0.25,
                    color: (theme) => (theme.palette.mode === 'dark' ? '#94a3b8' : '#6b7280'),
                    fontSize: 11,
                    lineHeight: 1.4,
                    letterSpacing: '0.09em',
                    textTransform: 'uppercase',
                    fontWeight: 800,
                  }}
                >
                  {group.label}
                </ListSubheader>

                {group.pages.map((page) => {
                  const Icon = page.icon;
                  const active = page.path === location.pathname || Boolean(page.aliases?.includes(location.pathname));

                  return (
                    <ListItemButton
                      key={page.key}
                      component={RouterLink}
                      to={page.path}
                      onClick={onClose}
                      sx={{
                        mb: 0.75,
                        px: 1.25,
                        py: 1,
                        minHeight: 56,
                        borderRadius: 2.25,
                        border: '1px solid',
                        borderWidth: active ? 1.5 : 1,
                        borderColor: (theme) =>
                          active
                            ? theme.palette.mode === 'dark'
                              ? '#e2e8f0'
                              : '#0f172a'
                            : theme.palette.mode === 'dark'
                              ? '#334155'
                              : '#d6dee7',
                        bgcolor: (theme) =>
                          active
                            ? theme.palette.mode === 'dark'
                              ? '#162236'
                              : '#f7fbfa'
                            : theme.palette.mode === 'dark'
                              ? '#0f172a'
                              : '#fff',
                        transition: 'all 150ms ease',
                        '&:hover': {
                          bgcolor: (theme) =>
                            active
                              ? theme.palette.mode === 'dark'
                                ? '#1d2a3f'
                                : '#f2faf7'
                              : theme.palette.mode === 'dark'
                                ? '#111c30'
                                : '#f8fafc',
                          borderColor: (theme) =>
                            active
                              ? theme.palette.mode === 'dark'
                                ? '#e2e8f0'
                                : '#0f172a'
                              : theme.palette.mode === 'dark'
                                ? '#475569'
                                : '#c7d2df',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 44 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: (theme) =>
                              active
                                ? theme.palette.mode === 'dark'
                                  ? '#0f3a2a'
                                  : '#dcfce7'
                                : theme.palette.mode === 'dark'
                                  ? '#1e293b'
                                  : '#f3f4f6',
                            color: (theme) =>
                              active
                                ? theme.palette.mode === 'dark'
                                  ? '#6ee7b7'
                                  : '#047857'
                                : theme.palette.mode === 'dark'
                                  ? '#94a3b8'
                                  : '#64748b',
                          }}
                        >
                          <Icon size={16} />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontWeight: active ? 800 : 700,
                              fontSize: 14,
                              lineHeight: 1.2,
                              color: (theme) => (theme.palette.mode === 'dark' ? '#e2e8f0' : '#334155'),
                            }}
                          >
                            {page.shortTitle ?? page.title}
                          </Typography>
                        }
                      />
                      <KeyboardArrowRightRoundedIcon
                        sx={{ fontSize: 22, color: (theme) => (theme.palette.mode === 'dark' ? '#64748b' : '#94a3b8') }}
                      />
                    </ListItemButton>
                  );
                })}
              </Box>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            maxWidth: '100vw',
            top: `${topbarOffsetMobile}px`,
            height: `calc(100% - ${topbarOffsetMobile}px)`,
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            top: `${topbarOffsetDesktop}px`,
            height: `calc(100% - ${topbarOffsetDesktop}px)`,
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {content}
      </Drawer>
    </>
  );
}

export const providerDrawerWidth = drawerWidth;
