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
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import LiveTvRoundedIcon from '@mui/icons-material/LiveTvRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import MovieFilterRoundedIcon from '@mui/icons-material/MovieFilterRounded';
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
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
const sectionIconMap: Record<string, typeof GridViewRoundedIcon> = {
  Core: GridViewRoundedIcon,
  Content: MenuBookRoundedIcon,
  Streams: LiveTvRoundedIcon,
  Outreach: CampaignRoundedIcon,
  'Post-live': MovieFilterRoundedIcon,
  Giving: VolunteerActivismRoundedIcon,
  Beacon: BoltRoundedIcon,
  Community: GroupsRoundedIcon,
  Leadership: SupervisorAccountRoundedIcon,
  Settings: SettingsRoundedIcon,
};
const sectionSignalCounts: Record<string, number> = {
  Core: 2,
  Content: 7,
  Streams: 3,
  Outreach: 5,
  'Post-live': 4,
  Giving: 2,
  Beacon: 6,
  Community: 8,
  Leadership: 1,
  Settings: 3,
};
const sectionSignalTone: Record<string, 'success' | 'warning'> = {
  Core: 'success',
  Content: 'warning',
  Streams: 'warning',
  Outreach: 'success',
  'Post-live': 'warning',
  Giving: 'success',
  Beacon: 'warning',
  Community: 'success',
  Leadership: 'warning',
  Settings: 'warning',
};

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
            <Box sx={{ flex: 1 }} />
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
              p: 1.2,
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
              <Box key={group.section} sx={{ mb: collapsed ? 0.4 : 0.72 }}>
                {!collapsed ? (
                  <Box sx={{ mb: 0.58 }}>
                    {(() => {
                      const SectionIcon = sectionIconMap[group.label] ?? GridViewRoundedIcon;
                      const totalPagesInSection = group.groups.reduce((sum, item) => sum + 1 + item.children.length, 0);
                      const signalCount = sectionSignalCounts[group.label] ?? 0;
                      const signalTone = sectionSignalTone[group.label] ?? 'warning';
                      return (
                    <ListItemButton
                      onClick={() => toggleSection(group.section)}
                      sx={{
                        px: 1.25,
                        py: 0.8,
                        minHeight: 70,
                        borderRadius: '22px',
                        border: '1px solid',
                        borderColor: 'color-mix(in srgb, var(--fh-line) 80%, #d6d8dd 20%)',
                        bgcolor: openSections[group.section]
                          ? 'color-mix(in srgb, var(--fh-brand-soft) 30%, #f4f6f8 70%)'
                          : '#f4f6f8',
                        boxShadow: openSections[group.section]
                          ? '0 10px 28px -24px rgba(0,0,0,0.35)'
                          : '0 6px 18px -24px rgba(0,0,0,0.3)',
                        transition: 'all 180ms ease',
                        '&:hover': {
                          bgcolor: 'color-mix(in srgb, var(--fh-brand-soft) 22%, #eef2f4 78%)',
                          borderColor: 'color-mix(in srgb, var(--fh-brand) 35%, var(--fh-line) 65%)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 54 }}>
                        <Avatar
                          sx={{
                            width: 42,
                            height: 42,
                            borderRadius: 3.2,
                            bgcolor: 'color-mix(in srgb, var(--fh-brand-soft) 52%, #ffffff 48%)',
                            color: 'var(--fh-brand-dark)',
                            border: '1px solid',
                            borderColor: 'color-mix(in srgb, var(--fh-brand) 38%, #e5e7eb 62%)',
                          }}
                        >
                          <SectionIcon sx={{ fontSize: 25 }} />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: 17,
                                letterSpacing: '0.15em',
                                color: 'var(--fh-slate)',
                                textTransform: 'uppercase',
                                lineHeight: 1,
                              }}
                            >
                              {group.label}
                            </Typography>
                            <Stack direction="row" spacing={0.6} sx={{ mt: 0.5 }}>
                              <Box
                                component="span"
                                sx={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  minWidth: 26,
                                  height: 18,
                                  borderRadius: 999,
                                  px: 0.8,
                                  fontSize: 10,
                                  fontWeight: 800,
                                  lineHeight: 1,
                                  border: '1px solid',
                                  borderColor: 'color-mix(in srgb, var(--fh-line) 75%, #d1d5db 25%)',
                                  bgcolor: '#ffffff',
                                  color: 'var(--fh-slate)',
                                }}
                              >
                                {totalPagesInSection} pages
                              </Box>
                              <Box
                                component="span"
                                sx={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  minWidth: 22,
                                  height: 18,
                                  borderRadius: 999,
                                  px: 0.75,
                                  fontSize: 10,
                                  fontWeight: 900,
                                  lineHeight: 1,
                                  border: '1px solid',
                                  borderColor:
                                    signalTone === 'success'
                                      ? 'color-mix(in srgb, #10b981 65%, #a7f3d0 35%)'
                                      : 'color-mix(in srgb, #f59e0b 65%, #fde68a 35%)',
                                  bgcolor:
                                    signalTone === 'success'
                                      ? 'color-mix(in srgb, #10b981 22%, #ffffff 78%)'
                                      : 'color-mix(in srgb, #f59e0b 22%, #ffffff 78%)',
                                  color: signalTone === 'success' ? '#047857' : '#92400e',
                                }}
                              >
                                {signalCount}
                              </Box>
                            </Stack>
                          </Box>
                        }
                      />
                      {openSections[group.section] ? (
                        <KeyboardArrowDownRoundedIcon
                          sx={{
                            fontSize: 30,
                            color: 'var(--fh-slate)',
                          }}
                        />
                      ) : (
                        <KeyboardArrowRightRoundedIcon
                          sx={{
                            fontSize: 30,
                            color: 'var(--fh-slate)',
                          }}
                        />
                      )}
                    </ListItemButton>
                      );
                    })()}

                    <Collapse in={Boolean(openSections[group.section])} timeout="auto" unmountOnExit>
                      <Box sx={{ pl: 2.2, pr: 0.4, pt: 0.52 }}>
                        {group.groups.map(({ page, children }) => {
                          const visibleChildren = children.filter((child) => child.key !== 'book-builder');
                          const parentActive = page.path === location.pathname || Boolean(page.aliases?.includes(location.pathname));
                          const activeChildKey = visibleChildren.find(
                            (child) => child.path === location.pathname || Boolean(child.aliases?.includes(location.pathname))
                          )?.key;
                          const active = parentActive || Boolean(activeChildKey);
                          return (
                            <Box key={`${group.section}-${page.key}`} sx={{ mb: 0.45 }}>
                              <ListItemButton
                                component={RouterLink}
                                to={page.path}
                                onClick={onClose}
                                sx={{
                                  mb: 0.34,
                                  px: 1.05,
                                  py: 0.66,
                                  minHeight: 42,
                                  borderRadius: '14px',
                                  border: '1px solid',
                                  borderColor: active
                                    ? 'color-mix(in srgb, var(--fh-brand-dark) 70%, var(--fh-brand) 30%)'
                                    : 'transparent',
                                  bgcolor: active
                                    ? 'color-mix(in srgb, var(--fh-brand-soft) 55%, #effdf7 45%)'
                                    : 'transparent',
                                  transition: 'all 140ms ease',
                                  '&:hover': { bgcolor: 'color-mix(in srgb, var(--fh-surface) 85%, #ffffff 15%)' },
                                }}
                              >
                                <ListItemText
                                  primary={
                                    <Typography
                                      sx={{
                                        fontWeight: active ? 800 : 650,
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
                                <Box sx={{ pl: 1.85 }}>
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
                                          mb: 0.3,
                                          px: 0.95,
                                          py: 0.52,
                                          minHeight: 36,
                                          borderRadius: '12px',
                                          border: '1px solid',
                                          borderColor: childActive ? 'var(--fh-brand-dark)' : 'transparent',
                                          bgcolor: childActive
                                            ? 'color-mix(in srgb, var(--fh-brand-soft) 32%, var(--fh-surface-bg) 68%)'
                                            : 'transparent',
                                          transition: 'all 140ms ease',
                                          '&:hover': { bgcolor: 'color-mix(in srgb, var(--fh-surface) 85%, #ffffff 15%)' },
                                        }}
                                      >
                                        <ListItemText
                                          primary={
                                            <Typography
                                              sx={{
                                                fontWeight: childActive ? 700 : 500,
                                                fontSize: 12,
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
