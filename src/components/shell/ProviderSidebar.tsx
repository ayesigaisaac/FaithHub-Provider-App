import {
  Avatar,
  Box,
  Chip,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import KeyboardDoubleArrowLeftRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
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
import { getProviderSidebarGroupsBySection, providerPages, providerSections } from '@/navigation/providerPages';

const drawerWidth = 318;
const topbarOffsetMobile = 110;
const topbarOffsetDesktop = 138;

const sectionLabelMap: Partial<Record<(typeof providerSections)[number], string>> = {
  'Foundation & Mission Control': 'Continue',
  'Content Structure & Teaching Creation': 'Create',
  'Live Sessions Operations': 'Publish',
  'Audience & Outreach': 'Published',
  'Post-live & Trust': 'Review',
  'Events & Giving': 'Analytics',
  Beacon: 'Reach',
  'Community & Care': 'Community',
  'Leadership & Team': 'Team',
  'Workspace Settings': 'Settings',
};

const expandedDrawerWidth = 318;
const collapsedDrawerWidth = 88;
type WorkflowTone = 'warning' | 'success' | 'neutral';
type WorkflowItem = {
  key: string;
  label: string;
  path: string;
  aliases?: string[];
  icon: typeof PlayArrowRoundedIcon;
  status: string;
  tone: WorkflowTone;
};

const workflowBadgeSx: Record<WorkflowTone, object> = {
  warning: { bgcolor: '#fff2e8', color: '#b45309', borderColor: '#fed7aa' },
  success: { bgcolor: '#ecfdf3', color: '#047857', borderColor: '#a7f3d0' },
  neutral: { bgcolor: '#f1f5f9', color: '#475569', borderColor: '#dbe5ef' },
};

const sectionIconMap: Record<string, typeof GridViewRoundedIcon> = {
  Continue: GridViewRoundedIcon,
  Create: MenuBookRoundedIcon,
  Publish: LiveTvRoundedIcon,
  Published: CampaignRoundedIcon,
  Review: MovieFilterRoundedIcon,
  Analytics: VolunteerActivismRoundedIcon,
  Reach: BoltRoundedIcon,
  Community: GroupsRoundedIcon,
  Team: SupervisorAccountRoundedIcon,
  Settings: SettingsRoundedIcon,
};
const sectionToneMap: Record<string, { icon: string; bg: string; border: string }> = {
  Continue: { icon: '#00b57a', bg: '#e9f8f2', border: '#bfe9d9' },
  Create: { icon: '#f77f00', bg: '#fff2e4', border: '#ffd7ad' },
  Publish: { icon: '#64748b', bg: '#edf1f5', border: '#d5dde6' },
  Published: { icon: '#00b57a', bg: '#e9f8f2', border: '#bfe9d9' },
  Review: { icon: '#f77f00', bg: '#fff2e4', border: '#ffd7ad' },
  Analytics: { icon: '#64748b', bg: '#edf1f5', border: '#d5dde6' },
  Reach: { icon: '#00b57a', bg: '#e9f8f2', border: '#bfe9d9' },
  Community: { icon: '#f77f00', bg: '#fff2e4', border: '#ffd7ad' },
  Team: { icon: '#64748b', bg: '#edf1f5', border: '#d5dde6' },
  Settings: { icon: '#64748b', bg: '#edf1f5', border: '#d5dde6' },
};

function trackSidebarClick(payload: { section: string; label: string; route: string; level: 'primary' | 'secondary' }) {
  if (typeof window === 'undefined') return;
  const detail = { event: 'sidebar_task_click', ...payload };
  window.dispatchEvent(new CustomEvent('fh:analytics', { detail }));
  const dataLayer = (window as unknown as { dataLayer?: Array<Record<string, string>> }).dataLayer;
  if (Array.isArray(dataLayer)) dataLayer.push(detail);
}

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
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const location = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const pageByKey = new Map(providerPages.map((page) => [page.key, page]));
  const workflowItems: WorkflowItem[] = [
    {
      key: 'continue-editing',
      label: 'Continue editing',
      path: pageByKey.get('provider-dashboard')?.path ?? '/faithhub/provider/dashboard',
      aliases: pageByKey.get('provider-dashboard')?.aliases,
      icon: PlayArrowRoundedIcon,
      status: '1 draft',
      tone: 'warning',
    },
    {
      key: 'create-teaching',
      label: 'Create teaching',
      path: pageByKey.get('teachings-dashboard')?.path ?? '/faithhub/provider/teachings-dashboard',
      aliases: pageByKey.get('teachings-dashboard')?.aliases,
      icon: EditRoundedIcon,
      status: 'New',
      tone: 'neutral',
    },
    {
      key: 'review',
      label: 'Review',
      path: pageByKey.get('reviews-and-moderation')?.path ?? '/faithhub/provider/reviews-and-moderation',
      aliases: pageByKey.get('reviews-and-moderation')?.aliases,
      icon: RateReviewRoundedIcon,
      status: 'Needs review',
      tone: 'warning',
    },
    {
      key: 'publish',
      label: 'Ready to publish',
      path: pageByKey.get('live-builder')?.path ?? '/faithhub/provider/live-builder',
      aliases: pageByKey.get('live-builder')?.aliases,
      icon: SendRoundedIcon,
      status: '2 queued',
      tone: 'neutral',
    },
    {
      key: 'published',
      label: 'Published',
      path: pageByKey.get('live-dashboard')?.path ?? '/faithhub/provider/live-dashboard',
      aliases: pageByKey.get('live-dashboard')?.aliases,
      icon: CheckCircleRoundedIcon,
      status: '3 items',
      tone: 'success',
    },
  ];

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
            borderColor: isDark ? '#334155' : '#d2dad7',
            bgcolor: isDark ? '#0f172a' : '#f5f7f6',
            overflow: 'hidden',
            boxShadow: 'var(--fh-shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: 0,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1.25, py: 1.35, gap: 1 }}>
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
                  width: 44,
                  height: 44,
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
              p: 1.35,
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
            <Box sx={{ mb: 1.25 }}>
              {!collapsed ? (
                <Typography
                  variant="overline"
                  sx={{
                    px: 0.9,
                    letterSpacing: '0.08em',
                    fontWeight: 800,
                    color: 'var(--fh-slate)',
                  }}
                >
                  Workflow
                </Typography>
              ) : null}
              <Box sx={{ mt: 0.6 }}>
                {workflowItems.map((item) => {
                  const Icon = item.icon;
                  const active = item.path === location.pathname || Boolean(item.aliases?.includes(location.pathname));
                  const badge = (
                    <Chip
                      size="small"
                      label={item.status}
                      sx={{
                        height: 22,
                        borderRadius: '999px',
                        border: '1px solid',
                        fontSize: 11,
                        fontWeight: 700,
                        ...workflowBadgeSx[item.tone],
                      }}
                    />
                  );
                  return (
                    <Tooltip
                      key={item.key}
                      placement="right"
                      title={collapsed ? `${item.label} - ${item.status}` : ''}
                      disableHoverListener={!collapsed}
                    >
                      <ListItemButton
                        component={RouterLink}
                        to={item.path}
                        onClick={() => {
                          trackSidebarClick({
                            section: 'Workflow',
                            label: item.label,
                            route: item.path,
                            level: 'primary',
                          });
                          onClose();
                        }}
                        sx={{
                          mb: 0.65,
                          minHeight: 52,
                          px: collapsed ? 1 : 1.2,
                          py: 0.7,
                          borderRadius: '14px',
                          border: '1px solid',
                          borderColor: active
                            ? 'color-mix(in srgb, var(--fh-brand) 75%, #0f172a 25%)'
                            : 'color-mix(in srgb, var(--fh-line) 82%, var(--fh-surface-bg) 18%)',
                          bgcolor: active
                            ? 'color-mix(in srgb, var(--fh-brand-soft) 45%, var(--fh-surface-bg) 55%)'
                            : 'var(--fh-surface-bg)',
                          position: 'relative',
                          transition: 'all 140ms ease',
                          '&::before': active
                            ? {
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                top: 7,
                                bottom: 7,
                                width: 4,
                                borderRadius: 99,
                                bgcolor: 'var(--fh-brand)',
                              }
                            : {},
                          '&:hover': {
                            bgcolor: active
                              ? 'color-mix(in srgb, var(--fh-brand-soft) 56%, var(--fh-surface-bg) 44%)'
                              : 'color-mix(in srgb, var(--fh-surface) 92%, var(--fh-surface-bg) 8%)',
                          },
                          '&:focus-visible': {
                            outline: '2px solid color-mix(in srgb, var(--fh-brand) 70%, #ffffff 30%)',
                            outlineOffset: 2,
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: collapsed ? 0 : 38, mr: collapsed ? 0 : 0.4 }}>
                          <Avatar
                            sx={{
                              width: 30,
                              height: 30,
                              bgcolor: active ? 'var(--fh-brand-soft)' : 'var(--fh-surface)',
                              color: active ? 'var(--fh-brand-dark)' : 'var(--fh-slate)',
                              border: '1px solid',
                              borderColor: 'var(--fh-line)',
                            }}
                          >
                            <Icon sx={{ fontSize: 18 }} />
                          </Avatar>
                        </ListItemIcon>
                        {!collapsed ? (
                          <>
                            <ListItemText
                              primary={
                                <Typography
                                  sx={{
                                    fontWeight: active ? 800 : 650,
                                    fontSize: 14,
                                    color: active ? 'var(--fh-ink)' : 'var(--fh-slate)',
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {item.label}
                                </Typography>
                              }
                            />
                            {badge}
                          </>
                        ) : null}
                      </ListItemButton>
                    </Tooltip>
                  );
                })}
              </Box>
              <Divider sx={{ mt: 0.95, mb: 1.1 }} />
            </Box>

            {sections.map((group) => (
              <Box key={group.section} sx={{ mb: collapsed ? 0.55 : 1 }}>
                {!collapsed ? (
                  <Box sx={{ mb: 0.58 }}>
                    {(() => {
                      const SectionIcon = sectionIconMap[group.label] ?? GridViewRoundedIcon;
                      const tone = sectionToneMap[group.label] ?? sectionToneMap.Settings;
                      return (
                    <ListItemButton
                      onClick={() => toggleSection(group.section)}
                      sx={{
                        px: 1.25,
                        py: 0.75,
                        minHeight: 70,
                        borderRadius: '18px',
                        border: '1px solid',
                        borderColor: openSections[group.section] ? (isDark ? '#10b981' : '#15171f') : isDark ? '#334155' : '#d7dfdc',
                        bgcolor: openSections[group.section]
                          ? isDark
                            ? '#0b1220'
                            : '#f1f6f4'
                          : isDark
                            ? '#111827'
                            : '#fafbfb',
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
                            width: 44,
                            height: 44,
                            borderRadius: 2.8,
                            bgcolor: isDark ? '#111827' : tone.bg,
                            color: tone.icon,
                            border: '1px solid',
                            borderColor: isDark ? '#334155' : tone.border,
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
                                fontSize: 15,
                                letterSpacing: '0.15em',
                                color: 'var(--fh-slate)',
                                textTransform: 'uppercase',
                                lineHeight: 1,
                              }}
                            >
                              {group.label}
                            </Typography>
                          </Box>
                        }
                      />
                      {openSections[group.section] ? (
                        <KeyboardArrowDownRoundedIcon
                          sx={{
                            fontSize: 28,
                            color: 'var(--fh-slate)',
                          }}
                        />
                      ) : (
                        <KeyboardArrowRightRoundedIcon
                          sx={{
                            fontSize: 28,
                            color: 'var(--fh-slate)',
                          }}
                        />
                      )}
                    </ListItemButton>
                      );
                    })()}

                    <Collapse in={Boolean(openSections[group.section])} timeout="auto" unmountOnExit>
                      <Box sx={{ pl: 2.2, pr: 0.55, pt: 0.7 }}>
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
                                onClick={() => {
                                  trackSidebarClick({
                                    section: group.label,
                                    label: page.shortTitle ?? page.title,
                                    route: page.path,
                                    level: 'primary',
                                  });
                                  onClose();
                                }}
                                sx={{
                                  mb: 0.34,
                                  px: 1.05,
                                  py: 0.66,
                                  minHeight: 44,
                                  borderRadius: '12px',
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
                                        onClick={() => {
                                          trackSidebarClick({
                                            section: group.label,
                                            label: child.shortTitle ?? child.title,
                                            route: child.path,
                                            level: 'secondary',
                                          });
                                          onClose();
                                        }}
                                        sx={{
                                          mb: 0.3,
                                          px: 0.95,
                                          py: 0.52,
                                          minHeight: 38,
                                          borderRadius: '10px',
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
                        onClick={() => {
                          trackSidebarClick({
                            section: group.label,
                            label: page.shortTitle ?? page.title,
                            route: page.path,
                            level: 'primary',
                          });
                          onClose();
                        }}
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
                                onClick={() => {
                                  trackSidebarClick({
                                    section: group.label,
                                    label: child.shortTitle ?? child.title,
                                    route: child.path,
                                    level: 'secondary',
                                  });
                                  onClose();
                                }}
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
