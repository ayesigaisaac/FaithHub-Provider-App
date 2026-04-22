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
import { getProviderSidebarGroupsBySection, providerSections } from '@/navigation/providerPages';

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
      groups: getProviderSidebarGroupsBySection(section),
    }))
    .filter((group) => group.groups.length > 0);

  const content = (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        bgcolor: 'var(--fh-page-bg)',
      }}
    >
      <Box sx={{ p: 1.25, height: '100%', minHeight: 0 }}>
        <Box
          sx={{
            borderRadius: 'var(--fh-radius-3xl)',
            border: '1px solid',
            borderColor: 'var(--fh-line)',
            bgcolor: 'var(--fh-surface-bg)',
            overflow: 'hidden',
            boxShadow: 'var(--fh-shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: 0,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ px: 1.5, py: 1.05 }}>
            <Avatar
              sx={{
                bgcolor: 'var(--fh-surface-bg)',
                color: 'var(--fh-ink)',
                border: '1px solid',
                borderColor: 'var(--fh-line)',
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
                backgroundColor: 'var(--fh-line)',
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
                    color: 'var(--fh-slate)',
                    fontSize: 11,
                    lineHeight: 1.4,
                    letterSpacing: '0.09em',
                    textTransform: 'uppercase',
                    fontWeight: 800,
                  }}
                >
                  {group.label}
                </ListSubheader>

                {group.groups.map(({ page, children }) => {
                  const Icon = page.icon;
                  const parentActive = page.path === location.pathname || Boolean(page.aliases?.includes(location.pathname));
                  const activeChildKey = children.find(
                    (child) => child.path === location.pathname || Boolean(child.aliases?.includes(location.pathname))
                  )?.key;
                  const active = parentActive || Boolean(activeChildKey);

                  return (
                    <Box key={page.key} sx={{ mb: 0.75 }}>
                      <ListItemButton
                        component={RouterLink}
                        to={page.path}
                        onClick={onClose}
                        sx={{
                          px: 1.25,
                          py: 1,
                          minHeight: 56,
                          borderRadius: 'var(--fh-radius-2xl)',
                          border: '1px solid',
                          borderWidth: active ? 1.5 : 1,
                          borderColor: active ? 'var(--fh-brand-dark)' : 'var(--fh-line)',
                          bgcolor: active ? 'color-mix(in srgb, var(--fh-brand-soft) 40%, var(--fh-surface-bg) 60%)' : 'var(--fh-surface-bg)',
                          transition: 'all 150ms ease',
                          '&:hover': {
                            bgcolor: active
                              ? 'color-mix(in srgb, var(--fh-brand-soft) 54%, var(--fh-surface-bg) 46%)'
                              : 'var(--fh-surface)',
                            borderColor: active
                              ? 'var(--fh-brand-dark)'
                              : 'color-mix(in srgb, var(--fh-line) 72%, var(--fh-ink) 28%)',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 44 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: active
                                ? 'color-mix(in srgb, var(--fh-brand-soft) 72%, var(--fh-surface-bg) 28%)'
                                : 'color-mix(in srgb, var(--fh-line) 26%, var(--fh-surface-bg) 74%)',
                              color: active ? 'var(--fh-brand-dark)' : 'var(--fh-slate)',
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
                                color: 'var(--fh-ink)',
                              }}
                            >
                              {page.shortTitle ?? page.title}
                            </Typography>
                          }
                        />
                        <KeyboardArrowRightRoundedIcon
                          sx={{ fontSize: 22, color: 'var(--fh-slate)' }}
                        />
                      </ListItemButton>
                      {children.length ? (
                        <Box sx={{ pl: 4.5, pr: 0.25, pt: 0.6 }}>
                          {children.map((child) => {
                            const ChildIcon = child.icon;
                            const childActive =
                              child.path === location.pathname || Boolean(child.aliases?.includes(location.pathname));
                            return (
                              <ListItemButton
                                key={child.key}
                                component={RouterLink}
                                to={child.path}
                                onClick={onClose}
                                sx={{
                                  mb: 0.55,
                                  px: 1,
                                  py: 0.75,
                                  minHeight: 44,
                                  borderRadius: 'var(--fh-radius-xl)',
                                  border: '1px solid',
                                  borderColor: childActive ? 'var(--fh-brand-dark)' : 'transparent',
                                  bgcolor: childActive
                                    ? 'color-mix(in srgb, var(--fh-brand-soft) 35%, var(--fh-surface-bg) 65%)'
                                    : 'transparent',
                                  '&:hover': {
                                    bgcolor: 'var(--fh-surface)',
                                  },
                                }}
                              >
                                <ListItemIcon sx={{ minWidth: 34 }}>
                                  <Avatar
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      bgcolor: 'transparent',
                                      color: childActive ? 'var(--fh-brand-dark)' : 'var(--fh-slate)',
                                    }}
                                  >
                                    <ChildIcon size={14} />
                                  </Avatar>
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Typography
                                      sx={{
                                        fontWeight: childActive ? 800 : 600,
                                        fontSize: 13,
                                        lineHeight: 1.2,
                                        color: childActive ? 'var(--fh-ink)' : 'var(--fh-slate)',
                                      }}
                                    >
                                      {child.shortTitle ?? child.title}
                                    </Typography>
                                  }
                                />
                              </ListItemButton>
                            );
                          })}
                        </Box>
                      ) : null}
                    </Box>
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
            borderRadius: 0,
            overflow: 'hidden',
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
            borderRadius: 0,
            overflow: 'hidden',
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
