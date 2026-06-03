import {
  Box,
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
  useMediaQuery,
} from '@mui/material';
import KeyboardDoubleArrowLeftRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LiveTvRoundedIcon from '@mui/icons-material/LiveTvRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { getProviderSidebarGroupsBySection, providerSections } from '@/navigation/providerPages';

const drawerWidth = 318;
const topbarOffsetMobile = 110;
const topbarOffsetDesktop = 128;

const expandedDrawerWidth = 318;
const collapsedDrawerWidth = 88;

const ONBOARDING_CHECKLIST_OPEN_KEY = 'faithhub.sidebar.onboardingChecklistOpen';
const ONBOARDING_CHECKLIST_DISMISSED_KEY = 'faithhub.sidebar.onboardingDismissed';
const ONBOARDING_CHECKLIST_PROGRESS_KEY = 'faithhub.sidebar.onboardingProgress';

function getSidebarPageLabel(input: { key: string; title: string; shortTitle?: string }) {
  if (input.shortTitle) return input.shortTitle;

  const explicit: Record<string, string> = {
    'provider-onboarding': 'Provider Onboarding',
    'service-management': 'Services',
    'service-builder': 'Create Service',
    'campaign-management': 'Campaigns',
    'campaign-builder': 'Create Campaign',
    'content-upload': 'Content Upload',
    'asset-library': 'Asset Library',
    'provider-dashboard': 'Provider Dashboard',
    'charity-crowdfunding-workbench': 'Charity Crowdfunding',
    'channels-contact-manager': 'Channels & Contacts',
    'standalone-teaching-builder': 'Standalone Builder',
    'stream-to-platforms': 'Stream to Platforms',
    'live-session-details': 'Live Session Details',
    'waiting-room': 'Waiting Room',
    'reviews-and-moderation': 'Reviews & Moderation',
  };
  if (explicit[input.key]) return explicit[input.key];

  return input.title
    .replace(/^FaithHub Provider\s+/i, '')
    .replace(/\s+Workbench$/i, '')
    .trim();
}

function getSidebarPageHint(input: { key: string; title: string }) {
  const explicit: Record<string, string> = {
    'provider-dashboard': 'Start here for FaithHub metrics and actions',
    'provider-onboarding': 'Register and enter the FaithHub journey',
    'service-management': 'Review service cards and approval state',
    'service-builder': 'Create a new FaithHub service',
    'campaign-management': 'Track campaign windows and approvals',
    'campaign-builder': 'Build a campaign around approved services',
    'content-upload': 'Upload posters, videos, and banners',
    'asset-library': 'Select approved assets for live sessions',
    'series-dashboard': 'Manage series and publishing status',
    'teachings-dashboard': 'Create, review, and publish teachings',
    'live-dashboard': 'Run live sessions and monitor health',
    'live-session-details': 'Inspect the selected live session before previewing',
    'waiting-room': 'Preview the audience waiting room',
    'audience-notifications': 'Send updates to the right audience',
    'reviews-and-moderation': 'Handle reviews and moderation queue',
    'events-manager': 'Plan and run events',
    'donations-and-funds': 'Track giving and active campaigns',
    'profile-settings': 'Update account and FaithHub workspace preferences',
  };
  if (explicit[input.key]) return explicit[input.key];

  const cleaned = input.title.replace(/^FaithHub Provider\s+/i, '').trim();
  return `${cleaned} FaithHub tools`;
}

const quickStartItems = [
  {
    label: '1) Check Dashboard',
    hint: 'See FaithHub metrics and action items first',
    path: '/faithhub/provider/dashboard',
    icon: HomeRoundedIcon,
  },
  {
    label: '2) Open Services',
    hint: 'Create or review FaithHub services',
    path: '/faithhub/provider/services',
    icon: FolderRoundedIcon,
  },
  {
    label: '3) Go Live',
    hint: 'Monitor and control the live studio',
    path: '/faithhub/provider/live-dashboard',
    icon: LiveTvRoundedIcon,
  },
] as const;

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
  const location = useLocation();
  const isNarrowPhone = useMediaQuery('(max-width:390px)');
  const isDesktopSidebar = useMediaQuery('(min-width:900px)');
  const effectiveCollapsed = isDesktopSidebar ? collapsed : false;
  const [showOnboardingChecklist, setShowOnboardingChecklist] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(ONBOARDING_CHECKLIST_OPEN_KEY) === 'true';
  });
  const [onboardingDismissed, setOnboardingDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(ONBOARDING_CHECKLIST_DISMISSED_KEY) === 'true';
  });
  const [completedOnboardingPaths, setCompletedOnboardingPaths] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(ONBOARDING_CHECKLIST_PROGRESS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
    } catch {
      return [];
    }
  });

  const sections = providerSections
    .map((section) => ({
      section,
      groups: getProviderSidebarGroupsBySection(section),
    }))
    .filter((group) => group.groups.length > 0);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(ONBOARDING_CHECKLIST_OPEN_KEY, String(showOnboardingChecklist));
  }, [showOnboardingChecklist]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(ONBOARDING_CHECKLIST_DISMISSED_KEY, String(onboardingDismissed));
  }, [onboardingDismissed]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(ONBOARDING_CHECKLIST_PROGRESS_KEY, JSON.stringify(completedOnboardingPaths));
  }, [completedOnboardingPaths]);
  useEffect(() => {
    if (!quickStartItems.some((item) => item.path === location.pathname)) return;
    setCompletedOnboardingPaths((prev) => {
      if (prev.includes(location.pathname)) return prev;
      return [...prev, location.pathname];
    });
  }, [location.pathname]);
  const onboardingCompletedCount = useMemo(
    () => quickStartItems.filter((item) => completedOnboardingPaths.includes(item.path)).length,
    [completedOnboardingPaths],
  );

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
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1.25, py: 1.35, gap: 1 }}>
            <Box sx={{ flex: 1 }} />
            <Tooltip title={effectiveCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              <IconButton
                onClick={() => {
                  if (!isDesktopSidebar) {
                    onClose();
                    return;
                  }
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
                  transition: 'transform var(--fh-duration-base) var(--fh-ease-premium), background-color var(--fh-duration-fast) ease, border-color var(--fh-duration-fast) ease',
                  '&:hover': { bgcolor: 'var(--fh-surface)', transform: 'translateY(-1px)' },
                }}
              >
                <KeyboardDoubleArrowLeftRoundedIcon
                  sx={{
                    transform: effectiveCollapsed ? 'rotate(180deg)' : 'none',
                    transition: 'transform 160ms ease',
                  }}
                />
              </IconButton>
            </Tooltip>
          </Stack>

          <Divider />

          {!effectiveCollapsed && !onboardingDismissed ? (
            <>
              <Box sx={{ px: 1.35, pt: 0.8, pb: 0.45 }}>
                <Box
                  sx={{
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: 'color-mix(in srgb, var(--fh-line) 62%, transparent)',
                    bgcolor: 'var(--fh-surface-bg)',
                    p: 0.6,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <ListItemButton
                      onClick={() => setShowOnboardingChecklist((prev) => !prev)}
                      aria-expanded={showOnboardingChecklist}
                      aria-controls="sidebar-onboarding-checklist"
                      sx={{
                        flex: 1,
                        px: 0.8,
                        py: 0.45,
                        minHeight: 34,
                        borderRadius: '9px',
                        border: '1px solid',
                        borderColor: 'color-mix(in srgb, var(--fh-line) 64%, transparent)',
                        bgcolor: 'color-mix(in srgb, var(--fh-brand-soft) 26%, var(--fh-surface-bg) 74%)',
                        '&:hover': { bgcolor: 'color-mix(in srgb, var(--fh-brand-soft) 34%, var(--fh-surface-bg) 66%)' },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography sx={{ fontSize: 11, fontWeight: 800, lineHeight: 1.1, color: 'var(--fh-ink)' }}>
                            Getting Started ({onboardingCompletedCount}/3 Complete)
                          </Typography>
                        }
                      />
                      {showOnboardingChecklist ? (
                        <KeyboardArrowDownRoundedIcon sx={{ fontSize: 18, color: 'var(--fh-slate)' }} />
                      ) : (
                        <KeyboardArrowRightRoundedIcon sx={{ fontSize: 18, color: 'var(--fh-slate)' }} />
                      )}
                    </ListItemButton>
                    <Tooltip title="Dismiss onboarding">
                      <IconButton
                        aria-label="Dismiss onboarding"
                        onClick={() => setOnboardingDismissed(true)}
                        sx={{ width: 30, height: 30, color: 'var(--fh-slate)' }}
                      >
                        <KeyboardDoubleArrowLeftRoundedIcon sx={{ fontSize: 18, transform: 'rotate(90deg)' }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Collapse in={showOnboardingChecklist} timeout="auto" unmountOnExit>
                    <Stack id="sidebar-onboarding-checklist" spacing={0.55} sx={{ mt: 0.6 }}>
                      {quickStartItems.map((item) => {
                        const Icon = item.icon;
                        const done = completedOnboardingPaths.includes(item.path);
                        return (
                          <ListItemButton
                            key={item.path}
                            component={RouterLink}
                            to={item.path}
                            onClick={() => {
                              setCompletedOnboardingPaths((prev) => (prev.includes(item.path) ? prev : [...prev, item.path]));
                              onClose();
                            }}
                            sx={{
                              px: 0.8,
                              py: 0.4,
                              minHeight: 34,
                              borderRadius: '9px',
                              border: '1px solid',
                              borderColor: done
                                ? 'color-mix(in srgb, var(--fh-brand) 56%, var(--fh-line) 44%)'
                                : 'color-mix(in srgb, var(--fh-line) 64%, transparent)',
                              bgcolor: done ? 'color-mix(in srgb, var(--fh-brand-soft) 34%, var(--fh-surface-bg) 66%)' : 'var(--fh-surface-bg)',
                              '&:hover': { bgcolor: 'var(--fh-surface)' },
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 22, color: done ? 'var(--fh-brand)' : 'var(--fh-slate)' }}>
                              <Icon sx={{ fontSize: 15 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography sx={{ fontSize: 10.8, fontWeight: 700, color: 'var(--fh-ink)' }}>
                                  {item.label}
                                </Typography>
                              }
                            />
                            {done ? <Typography sx={{ fontSize: 10.2, fontWeight: 700, color: 'var(--fh-brand)' }}>Done</Typography> : null}
                          </ListItemButton>
                        );
                      })}
                    </Stack>
                  </Collapse>
                </Box>
              </Box>
              <Divider />
            </>
          ) : null}

          <List
            sx={{
              p: 1.35,
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              pb: 2,
              '&::-webkit-scrollbar': { width: 8 },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'var(--fh-line)',
                borderRadius: 10,
              },
              '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
            }}
          >
            {sections.map((group) => (
              <Box
                key={group.section}
                sx={{
                  mb: effectiveCollapsed ? 0.45 : 0.6,
                }}
              >
                {group.groups.map(({ page }) => {
                  const active = page.path === location.pathname || Boolean(page.aliases?.includes(location.pathname));
                  const PageIcon = page.icon;

                  return (
                    <Tooltip key={page.key} title={getSidebarPageLabel(page)} placement="right">
                      <ListItemButton
                        component={RouterLink}
                        to={page.path}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => {
                          trackSidebarClick({
                            section: group.section,
                            label: getSidebarPageLabel(page),
                            route: page.path,
                            level: 'primary',
                          });
                          onClose();
                        }}
                        sx={{
                          mb: 0.4,
                          px: effectiveCollapsed ? 0.2 : 0.8,
                          py: effectiveCollapsed ? 0.45 : 0.5,
                          minHeight: effectiveCollapsed ? 40 : 54,
                          borderRadius: 999,
                          border: '1px solid',
                          borderColor: active ? 'color-mix(in srgb, var(--fh-brand) 58%, var(--fh-line) 42%)' : 'color-mix(in srgb, var(--fh-line) 66%, transparent)',
                          bgcolor: active ? 'color-mix(in srgb, var(--fh-brand-soft) 24%, var(--fh-surface-bg) 76%)' : 'color-mix(in srgb, var(--fh-surface-bg) 96%, white 4%)',
                          justifyContent: effectiveCollapsed ? 'center' : 'flex-start',
                          transition:
                            'transform var(--fh-duration-base) var(--fh-ease-premium), background-color var(--fh-duration-fast) ease, border-color var(--fh-duration-fast) ease',
                          '&:hover': {
                            bgcolor: active
                              ? 'color-mix(in srgb, var(--fh-brand-soft) 30%, var(--fh-surface-bg) 70%)'
                              : 'var(--fh-surface)',
                            borderColor: active
                              ? 'color-mix(in srgb, var(--fh-brand) 68%, var(--fh-brand-dark) 32%)'
                              : 'color-mix(in srgb, var(--fh-line) 78%, var(--fh-ink) 22%)',
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            m: 0,
                            mr: effectiveCollapsed ? 0 : 0.75,
                            width: effectiveCollapsed ? 18 : 28,
                            height: effectiveCollapsed ? 18 : 28,
                            borderRadius: 999,
                            display: 'grid',
                            placeItems: 'center',
                            color: active ? 'var(--fh-brand)' : 'var(--fh-slate)',
                            bgcolor: active
                              ? 'color-mix(in srgb, var(--fh-brand-soft) 38%, var(--fh-surface-bg) 62%)'
                              : 'color-mix(in srgb, var(--fh-line) 6%, transparent)',
                          }}
                        >
                          <PageIcon size={15} />
                        </ListItemIcon>
                        {!effectiveCollapsed ? (
                          <ListItemText
                            primary={
                              <Box>
                                <Typography
                                  sx={{
                                    fontWeight: active ? 800 : 700,
                                    fontSize: 12.25,
                                    lineHeight: 1.05,
                                    color: 'var(--fh-ink)',
                                  }}
                                >
                                  {getSidebarPageLabel(page)}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: 10.25,
                                    lineHeight: 1.15,
                                    color: 'var(--fh-slate)',
                                  }}
                                >
                                  {getSidebarPageHint(page)}
                                </Typography>
                              </Box>
                            }
                          />
                        ) : null}
                      </ListItemButton>
                    </Tooltip>
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
            width: isNarrowPhone ? 'calc(100vw - 8px)' : 'calc(100vw - 12px)',
            maxWidth: `${drawerWidth}px`,
            top: `calc(${topbarOffsetMobile}px + env(safe-area-inset-top))`,
            height: `calc(100% - ${topbarOffsetMobile}px - env(safe-area-inset-top))`,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
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
          width: effectiveCollapsed ? collapsedDrawerWidth : expandedDrawerWidth,
          transition: 'width var(--fh-duration-base) var(--fh-ease-premium)',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: effectiveCollapsed ? collapsedDrawerWidth : expandedDrawerWidth,
            transition: 'width var(--fh-duration-base) var(--fh-ease-premium)',
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
