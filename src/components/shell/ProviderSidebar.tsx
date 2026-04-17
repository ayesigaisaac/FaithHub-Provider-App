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
    <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', bgcolor: '#eef3f3' }}>
      <Box sx={{ p: 1.25, height: '100%', minHeight: 0 }}>
        <Box
          sx={{
            borderRadius: 2.5,
            border: '1px solid #d1d5db',
            bgcolor: '#fff',
            overflow: 'hidden',
            boxShadow: '0 16px 32px -28px rgba(15, 23, 42, 0.42)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: 0,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1.5, py: 1.25 }}>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: 24, lineHeight: 1 }}>FaithHub Provider</Typography>
              <Typography color="text.secondary" sx={{ fontSize: 13, lineHeight: 1.1, letterSpacing: '0.02em' }}>
                Navigation
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: '#fff', color: '#111827', border: '1px solid #d1d5db', width: 40, height: 40 }}>
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
              '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: 10 },
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
                    color: '#6b7280',
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
                        borderRadius: 2,
                        border: active ? '1.5px solid #111827' : '1px solid #d1d5db',
                        bgcolor: active ? '#f8fafc' : '#fff',
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 44 }}>
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            bgcolor: active ? '#dcfce7' : '#f3f4f6',
                            color: active ? '#047857' : '#64748b',
                          }}
                        >
                          <Icon size={16} />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontWeight: active ? 800 : 700, fontSize: 13.5, lineHeight: 1.2, color: '#334155' }}>
                            {page.shortTitle ?? page.title}
                          </Typography>
                        }
                      />
                      <KeyboardArrowRightRoundedIcon sx={{ fontSize: 22, color: '#94a3b8' }} />
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
