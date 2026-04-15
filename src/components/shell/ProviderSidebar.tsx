import {
  Avatar,
  Box,
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
import { spacing } from '@/theme/spacing';

const drawerWidth = 252;

export function ProviderSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation();
  const density = spacing.compact.mui;

  const content = (
    <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, py: density.sidebarHeaderY, borderBottom: '1px solid', borderColor: 'divider' }}
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

      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.1, py: density.sidebarBodyY }}>
        {providerSections
          .filter((section) => section !== 'Previews')
          .map((section) => {
            const pages = getProviderPagesBySection(section);
            if (!pages.length) return null;
            return (
              <Box key={section} sx={{ mb: 1 }}>
                <Typography
                  variant="overline"
                  sx={{
                    display: 'block',
                    px: 1.25,
                    pb: 0.5,
                  color: 'text.secondary',
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
                          py: 0.85,
                          px: 1.25,
                          mb: 0.2,
                          '&.Mui-selected': {
                            bgcolor: 'rgba(16, 185, 129, 0.18)',
                            color: 'text.primary',
                          },
                          '&.Mui-selected:hover': {
                            bgcolor: 'rgba(16, 185, 129, 0.26)',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 34, color: selected ? 'primary.main' : 'text.secondary' }}>
                          <Icon size={17} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              sx={{
                                fontSize: 14,
                                fontWeight: selected ? 700 : 600,
                                color: selected ? 'text.primary' : 'text.primary',
                              }}
                            >
                              {page.shortTitle ?? page.title}
                            </Typography>
                          }
                        />
                        {selected ? <FiberManualRecordRoundedIcon sx={{ fontSize: 10, color: 'primary.main' }} /> : null}
                      </ListItemButton>
                    );
                  })}
                </List>
              </Box>
            );
          })}
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
