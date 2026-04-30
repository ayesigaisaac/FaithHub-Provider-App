import {
  Avatar,
  Box,
  Collapse,
  IconButton,
  Divider,
  Drawer,
  List,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import KeyboardDoubleArrowLeftRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useState } from 'react';
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

const expandedDrawerWidth = 318;
const collapsedDrawerWidth = 88;

export function ProviderSidebar({
  open,
  onClose,
  collapsed = false,
  onToggleCollapse,
}: {
  open: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const sections = providerSections
    .map((section) => ({
      section,
      label: sectionLabelMap[section] ?? section,
      groups: getProviderSidebarGroupsBySection(section),
    }))
    .filter((group) => group.groups.length > 0);
  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

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
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1.25, py: 0.9, gap: 1 }}>
            <Tooltip title="Open provider dashboard">
              <ListItemButton
                component={RouterLink}
                to="/faithhub/provider/dashboard"
                onClick={onClose}
                sx={{
                  flex: 1,
                  minHeight: 42,
                  borderRadius: 'var(--fh-radius-2xl)',
                  border: '1px solid',
                  borderColor: 'var(--fh-line)',
                  bgcolor: 'var(--fh-surface)',
                  px: collapsed ? 1 : 1.15,
                  py: 0.65,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  '&:hover': { bgcolor: 'var(--fh-surface-bg)' },
                }}
              >
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: 'color-mix(in srgb, var(--fh-brand-soft) 68%, var(--fh-surface-bg) 32%)',
                    color: 'var(--fh-brand-dark)',
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  P
                </Avatar>
                {!collapsed ? (
                  <Typography sx={{ ml: 1, fontWeight: 700, fontSize: 12.5, color: 'var(--fh-ink)', lineHeight: 1.15 }}>
                    Provider Navigation
                  </Typography>
                ) : null}
              </ListItemButton>
            </Tooltip>
            <Tooltip title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              <IconButton
                onClick={() => {
                  if (onToggleCollapse) {
                    onToggleCollapse();
                    return;
                  }
                  onClose();
                }}
                sx={{
                  bgcolor: 'var(--fh-surface-bg)',
                  color: 'var(--fh-ink)',
                  border: '1px solid',
                  borderColor: 'var(--fh-line)',
                  width: 42,
                  height: 42,
                  borderRadius: 999,
                  '&:hover': { bgcolor: 'var(--fh-surface)' },
                }}
              >
                <KeyboardDoubleArrowLeftRoundedIcon
                  sx={{
                    transform: collapsed ? 'rotate(180deg)' : 'none',
                    transition: 'transform 160ms ease',
                  }}
                />
              </IconButton>
            </Tooltip>
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
              <Box key={group.section} sx={{ mb: collapsed ? 0.25 : 0.75 }}>
                {!collapsed ? (
                  <Box sx={{ mb: 0.9 }}>
                    <ListItemButton
                      onClick={() => toggleSection(group.section)}
                      sx={{
                        px: 1.25,
                        py: 0.9,
                        minHeight: 72,
                        borderRadius: '20px',
                        border: '1px solid',
                        borderColor: 'var(--fh-line)',
                        bgcolor: '#f4f4f5',
                        '&:hover': { bgcolor: '#efeff1' },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 58 }}>
                        <Avatar
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 3.2,
                            bgcolor: '#e9e9eb',
                            color: '#18c48f',
                          }}
                        >
                          <GridViewRoundedIcon sx={{ fontSize: 25 }} />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: 19,
                              letterSpacing: '0.1em',
                              color: '#86888f',
                              textTransform: 'uppercase',
                            }}
                          >
                            {group.label}
                          </Typography>
                        }
                      />
                      {openSections[group.section] ? (
                        <KeyboardArrowDownRoundedIcon
                          sx={{
                            fontSize: 34,
                            color: '#86888f',
                          }}
                        />
                      ) : (
                        <KeyboardArrowRightRoundedIcon
                          sx={{
                            fontSize: 34,
                            color: '#86888f',
                          }}
                        />
                      )}
                    </ListItemButton>

                    <Collapse in={Boolean(openSections[group.section])} timeout="auto" unmountOnExit>
                      <Box sx={{ pl: 2.5, pr: 0.5, pt: 0.7 }}>
                        {group.groups.map(({ page, children }) => {
                          const visibleChildren = children.filter((child) => child.key !== 'book-builder');
                          const parentActive = page.path === location.pathname || Boolean(page.aliases?.includes(location.pathname));
                          const activeChildKey = visibleChildren.find(
                            (child) => child.path === location.pathname || Boolean(child.aliases?.includes(location.pathname))
                          )?.key;
                          const active = parentActive || Boolean(activeChildKey);
                          return (
                            <Box key={`${group.section}-${page.key}`} sx={{ mb: 0.6 }}>
                              <ListItemButton
                                component={RouterLink}
                                to={page.path}
                                onClick={onClose}
                                sx={{
                                  mb: 0.45,
                                  px: 1,
                                  py: 0.75,
                                  minHeight: 44,
                                  borderRadius: 'var(--fh-radius-xl)',
                                  border: '1px solid',
                                  borderColor: active ? 'var(--fh-brand-dark)' : 'transparent',
                                  bgcolor: active
                                    ? 'color-mix(in srgb, var(--fh-brand-soft) 35%, var(--fh-surface-bg) 65%)'
                                    : 'transparent',
                                  '&:hover': { bgcolor: 'var(--fh-surface)' },
                                }}
                              >
                                <ListItemText
                                  primary={
                                    <Typography
                                      sx={{
                                        fontWeight: active ? 800 : 600,
                                        fontSize: 13,
                                        lineHeight: 1.2,
                                        color: active ? 'var(--fh-ink)' : 'var(--fh-slate)',
                                      }}
                                    >
                                      {page.shortTitle ?? page.title}
                                    </Typography>
                                  }
                                />
                              </ListItemButton>
                              {visibleChildren.length ? (
                                <Box sx={{ pl: 2 }}>
                                  {visibleChildren.map((child) => {
                                    const childActive =
                                      child.path === location.pathname || Boolean(child.aliases?.includes(location.pathname));
                                    return (
                                      <ListItemButton
                                        key={`${group.section}-${child.key}`}
                                        component={RouterLink}
                                        to={child.path}
                                        onClick={onClose}
                                        sx={{
                                          mb: 0.35,
                                          px: 1,
                                          py: 0.55,
                                          minHeight: 38,
                                          borderRadius: 'var(--fh-radius-lg)',
                                          border: '1px solid',
                                          borderColor: childActive ? 'var(--fh-brand-dark)' : 'transparent',
                                          bgcolor: childActive
                                            ? 'color-mix(in srgb, var(--fh-brand-soft) 32%, var(--fh-surface-bg) 68%)'
                                            : 'transparent',
                                          '&:hover': { bgcolor: 'var(--fh-surface)' },
                                        }}
                                      >
                                        <ListItemText
                                          primary={
                                            <Typography
                                              sx={{
                                                fontWeight: childActive ? 700 : 500,
                                                fontSize: 12.5,
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
                    </Collapse>
                  </Box>
                ) : null}

                {group.groups.map(({ page, children }) => {
                  if (!collapsed) return null;
                  const visibleChildren = children.filter((child) => child.key !== 'book-builder');
                  const Icon = page.icon;
                  const parentActive = page.path === location.pathname || Boolean(page.aliases?.includes(location.pathname));
                  const activeChildKey = visibleChildren.find(
                    (child) => child.path === location.pathname || Boolean(child.aliases?.includes(location.pathname))
                  )?.key;
                  const active = parentActive || Boolean(activeChildKey);

                  return (
                    <Box key={page.key} sx={{ mb: 0.75 }}>
                      <ListItemButton
                        component={RouterLink}
                        to={page.path}
                        onClick={onClose}
                        title={collapsed ? page.shortTitle ?? page.title : undefined}
                        sx={{
                          px: collapsed ? 1 : 1.25,
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
                        <ListItemIcon sx={{ minWidth: collapsed ? 0 : 44, mr: collapsed ? 0 : 0 }}>
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
                        {!collapsed ? (
                          <>
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
                            <KeyboardArrowRightRoundedIcon sx={{ fontSize: 22, color: 'var(--fh-slate)' }} />
                          </>
                        ) : null}
                      </ListItemButton>
                      {!collapsed && visibleChildren.length ? (
                        <Box sx={{ pl: 4.5, pr: 0.25, pt: 0.6 }}>
                          {visibleChildren.map((child) => {
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
          width: collapsed ? collapsedDrawerWidth : expandedDrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: collapsed ? collapsedDrawerWidth : expandedDrawerWidth,
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

export const providerDrawerWidth = expandedDrawerWidth;
