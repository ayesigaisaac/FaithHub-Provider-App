import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { getProviderPagesBySection, providerSections } from '@/navigation/providerPages';

const drawerWidth = 252;

export function ProviderSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation();

  const content = (
    <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, py: 2, borderBottom: '1px solid #e5e7eb' }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Avatar src="/assets/logo.svg" alt="FaithHub" sx={{ width: 34, height: 34 }} />
          <Box>
            <Typography sx={{ fontWeight: 800, letterSpacing: '0.03em', lineHeight: 1 }}>
              FAITHHUB
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
              PROVIDER PORTAL
            </Typography>
          </Box>
        </Stack>
        <ChevronLeftRoundedIcon sx={{ color: 'text.secondary' }} />
      </Stack>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.25, py: 1 }}>
        {providerSections
          .filter((section) => section !== 'Previews')
          .map((section) => {
            const pages = getProviderPagesBySection(section);
            if (!pages.length) return null;
            return (
              <Box key={section} sx={{ mb: 1.5 }}>
                <Typography
                  variant="overline"
                  sx={{
                    display: 'block',
                    px: 1.25,
                    pb: 0.5,
                    color: '#9ca3af',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                  }}
                >
                  {section}
                </Typography>
                <List disablePadding>
                  {pages.map((page) => {
                    const Icon = page.icon;
                    const selected = page.path === location.pathname || page.aliases?.includes(location.pathname);
                    return (
                      <ListItemButton
                        key={page.key}
                        component={RouterLink}
                        to={page.path}
                        onClick={onClose}
                        selected={selected}
                        sx={{
                          borderRadius: 2,
                          py: 1,
                          px: 1.25,
                          mb: 0.25,
                          '&.Mui-selected': {
                            bgcolor: '#d1fae5',
                            color: '#064e3b',
                          },
                          '&.Mui-selected:hover': {
                            bgcolor: '#bbf7d0',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 34, color: selected ? '#059669' : '#6b7280' }}>
                          <Icon size={17} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              sx={{
                                fontSize: 14,
                                fontWeight: selected ? 700 : 600,
                                color: selected ? '#064e3b' : '#334155',
                              }}
                            >
                              {page.shortTitle ?? page.title}
                            </Typography>
                          }
                        />
                        {selected ? <FiberManualRecordRoundedIcon sx={{ fontSize: 10, color: '#10b981' }} /> : null}
                      </ListItemButton>
                    );
                  })}
                </List>
              </Box>
            );
          })}
      </Box>

      <Divider />
      <Box sx={{ p: 2 }}>
        <Box sx={{ bgcolor: '#ecfdf5', border: '1px solid #bbf7d0', borderRadius: 2, p: 1.5 }}>
          <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Need help?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Check docs or contact the FaithHub engineering team.
          </Typography>
          <Button component={RouterLink} to="/faithhub/provider/preview-shell" variant="outlined" fullWidth size="small">
            Documentation
          </Button>
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
            borderRight: '1px solid #e5e7eb',
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
            borderRight: '1px solid #e5e7eb',
          },
        }}
      >
        {content}
      </Drawer>
    </>
  );
}

export const providerDrawerWidth = drawerWidth;
