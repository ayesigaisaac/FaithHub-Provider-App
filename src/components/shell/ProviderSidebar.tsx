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
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LiveTvRoundedIcon from '@mui/icons-material/LiveTvRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import MovieFilterRoundedIcon from '@mui/icons-material/MovieFilterRounded';
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { getProviderSidebarGroupsBySection, providerPages, providerSections, type ProviderPageSection } from '@/navigation/providerPages';
import { providerCategoryBySection } from '@/navigation/providerCategories';
import { readSafeStorageValue, removeSafeStorageValue, writeSafeStorageValue } from './safeStorage';
import { getProviderPageSidebarHint, getProviderPageSidebarLabel } from '@/navigation/providerPageDisplay';

const drawerWidth = 320;
const topbarOffsetMobile = 110;
const topbarOffsetDesktop = 128;

const expandedDrawerWidth = 312;
const collapsedDrawerWidth = 80;

const ACTIVE_SECTION_KEY = 'faithhub.sidebar.activeSection';
const LAST_EXPANDED_SECTION_KEY = 'faithhub.sidebar.lastExpandedSection';

const sectionIconMap: Record<string, typeof GridViewRoundedIcon> = {
  'Foundation & Mission Control': HomeRoundedIcon,
  'Content Structure & Teaching Creation': FolderRoundedIcon,
  'Provider Journey': FolderRoundedIcon,
  'Live Sessions Operations': LiveTvRoundedIcon,
  'Audience & Outreach': CampaignRoundedIcon,
  'Post-live & Trust': MovieFilterRoundedIcon,
  'Events & Giving': VolunteerActivismRoundedIcon,
  Revelight: BoltRoundedIcon,
  'Community & Care': GroupsRoundedIcon,
  'Leadership & Team': SupervisorAccountRoundedIcon,
  'Workspace Settings': SettingsRoundedIcon,
};

const ONBOARDING_CHECKLIST_OPEN_KEY = 'faithhub.sidebar.onboardingChecklistOpen';
const ONBOARDING_CHECKLIST_DISMISSED_KEY = 'faithhub.sidebar.onboardingDismissed';
const ONBOARDING_CHECKLIST_PROGRESS_KEY = 'faithhub.sidebar.onboardingProgress';

function readStoredSidebarSection(key: string): ProviderPageSection | null {
  const value = readSafeStorageValue(key);
  if (!value) return null;
  return providerSections.includes(value as ProviderPageSection) ? (value as ProviderPageSection) : null;
}

function writeStoredSidebarSection(key: string, value: ProviderPageSection | null) {
  if (value) {
    writeSafeStorageValue(key, value);
    return;
  }
  removeSafeStorageValue(key);
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
  const previousCollapsedRef = useRef(effectiveCollapsed);
  const currentPage = useMemo(
    () => providerPages.find((page) => page.path === location.pathname || Boolean(page.aliases?.includes(location.pathname))),
    [location.pathname],
  );
  const [activeSection, setActiveSection] = useState<ProviderPageSection | null>(() => {
    return readStoredSidebarSection(ACTIVE_SECTION_KEY) ?? currentPage?.section ?? null;
  });
  const [lastExpandedSection, setLastExpandedSection] = useState<ProviderPageSection | null>(() => {
    return readStoredSidebarSection(LAST_EXPANDED_SECTION_KEY) ?? currentPage?.section ?? null;
  });
  const [showOnboardingChecklist, setShowOnboardingChecklist] = useState<boolean>(() => {
    return readSafeStorageValue(ONBOARDING_CHECKLIST_OPEN_KEY) === 'true';
  });
  const [onboardingDismissed, setOnboardingDismissed] = useState<boolean>(() => {
    return readSafeStorageValue(ONBOARDING_CHECKLIST_DISMISSED_KEY) === 'true';
  });
  const [completedOnboardingPaths, setCompletedOnboardingPaths] = useState<string[]>(() => {
    try {
      const raw = readSafeStorageValue(ONBOARDING_CHECKLIST_PROGRESS_KEY);
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
      label: providerCategoryBySection[section].navLabel,
      groups: getProviderSidebarGroupsBySection(section),
    }))
    .filter((group) => group.groups.length > 0);
  useEffect(() => {
    writeSafeStorageValue(ONBOARDING_CHECKLIST_OPEN_KEY, String(showOnboardingChecklist));
  }, [showOnboardingChecklist]);
  useEffect(() => {
    writeSafeStorageValue(ONBOARDING_CHECKLIST_DISMISSED_KEY, String(onboardingDismissed));
  }, [onboardingDismissed]);
  useEffect(() => {
    writeSafeStorageValue(ONBOARDING_CHECKLIST_PROGRESS_KEY, JSON.stringify(completedOnboardingPaths));
  }, [completedOnboardingPaths]);
  useEffect(() => {
    if (!quickStartItems.some((item) => item.path === location.pathname)) return;
    setCompletedOnboardingPaths((prev) => {
      if (prev.includes(location.pathname)) return prev;
      return [...prev, location.pathname];
    });
  }, [location.pathname]);
  useEffect(() => {
    const routeSection = currentPage?.section ?? null;
    if (!routeSection) return;
    setActiveSection(routeSection);
    setLastExpandedSection(routeSection);
  }, [currentPage?.section]);
  useEffect(() => {
    writeStoredSidebarSection(ACTIVE_SECTION_KEY, activeSection);
  }, [activeSection]);
  useEffect(() => {
    writeStoredSidebarSection(LAST_EXPANDED_SECTION_KEY, lastExpandedSection);
  }, [lastExpandedSection]);
  useEffect(() => {
    const wasCollapsed = previousCollapsedRef.current;
    previousCollapsedRef.current = effectiveCollapsed;

    if (wasCollapsed && !effectiveCollapsed && !activeSection && lastExpandedSection) {
      setActiveSection(lastExpandedSection);
    }
  }, [activeSection, effectiveCollapsed, lastExpandedSection]);
  const onboardingCompletedCount = useMemo(
    () => quickStartItems.filter((item) => completedOnboardingPaths.includes(item.path)).length,
    [completedOnboardingPaths],
  );

  const openSection = (section: ProviderPageSection) => {
    setActiveSection(section);
    setLastExpandedSection(section);
    if (effectiveCollapsed && isDesktopSidebar && onToggleCollapse) {
      onToggleCollapse();
    }
  };
  const toggleSection = (section: ProviderPageSection) => {
    setLastExpandedSection(section);
    setActiveSection((current) => (current === section ? null : section));
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
              p: effectiveCollapsed ? 0.8 : 1.35,
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
                  mb: effectiveCollapsed ? 0.7 : 1,
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: 'color-mix(in srgb, var(--fh-line) 56%, transparent)',
                  bgcolor: 'color-mix(in srgb, var(--fh-surface-bg) 94%, white 6%)',
                  overflow: 'hidden',
                }}
              >
                {(() => {
                  const SectionIcon = sectionIconMap[group.section] ?? GridViewRoundedIcon;
                  const sectionExpanded = activeSection === group.section;
                  const sectionActive =
                    sectionExpanded || currentPage?.section === group.section || lastExpandedSection === group.section;

                  if (effectiveCollapsed) {
                    return (
                      <Box sx={{ px: 0.65, py: 0.75 }}>
                        <Tooltip title={group.label} placement="right" arrow>
                          <ListItemButton
                            onClick={() => openSection(group.section)}
                            aria-label={group.label}
                            aria-expanded={sectionExpanded}
                            sx={{
                              mb: 0.5,
                              px: 0,
                              py: 0.5,
                              minHeight: 40,
                              borderRadius: '14px',
                              border: '1px solid',
                              borderColor: sectionActive ? 'var(--fh-brand-dark)' : 'var(--fh-line)',
                              bgcolor: sectionActive ? 'color-mix(in srgb, var(--fh-brand-soft) 40%, var(--fh-surface-bg) 60%)' : 'var(--fh-surface-bg)',
                              justifyContent: 'center',
                              transition:
                                'width var(--fh-duration-base) var(--fh-ease-premium), transform var(--fh-duration-base) var(--fh-ease-premium), background-color var(--fh-duration-fast) ease, border-color var(--fh-duration-fast) ease',
                              '&:hover': {
                                bgcolor: sectionActive
                                  ? 'color-mix(in srgb, var(--fh-brand-soft) 54%, var(--fh-surface-bg) 46%)'
                                  : 'var(--fh-surface)',
                                borderColor: sectionActive
                                  ? 'var(--fh-brand-dark)'
                                  : 'color-mix(in srgb, var(--fh-line) 72%, var(--fh-ink) 28%)',
                                transform: 'translateY(-1px)',
                              },
                              '&:focus-visible': {
                                outline: '2px solid var(--fh-brand)',
                                outlineOffset: 2,
                              },
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                m: 0,
                                color: sectionActive ? 'var(--fh-brand)' : 'var(--fh-slate)',
                              }}
                            >
                              <SectionIcon sx={{ fontSize: 17 }} />
                            </ListItemIcon>
                          </ListItemButton>
                        </Tooltip>
                      </Box>
                    );
                  }

                  return (
                    <>
                      <ListItemButton
                        onClick={() => toggleSection(group.section)}
                        aria-label={`${sectionExpanded ? 'Collapse' : 'Expand'} ${group.label} section`}
                        aria-expanded={sectionExpanded}
                        sx={{
                          px: 1,
                          py: 0.5,
                          minHeight: 52,
                          borderRadius: 0,
                          borderBottom: '1px solid',
                          borderColor: 'color-mix(in srgb, var(--fh-line) 56%, transparent)',
                          bgcolor: sectionExpanded ? 'color-mix(in srgb, var(--fh-surface) 88%, var(--fh-surface-bg) 12%)' : 'transparent',
                          transition:
                            'transform var(--fh-duration-base) var(--fh-ease-premium), background-color var(--fh-duration-fast) ease, border-color var(--fh-duration-fast) ease',
                          '&:hover': {
                            bgcolor: 'var(--fh-surface)',
                            transform: 'translateY(-1px)',
                          },
                          '&:focus-visible': {
                            outline: '2px solid var(--fh-brand)',
                            outlineOffset: -2,
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 28,
                            mr: 0.5,
                            color: sectionExpanded ? 'var(--fh-accent)' : 'var(--fh-slate)',
                          }}
                        >
                          <SectionIcon sx={{ fontSize: 18 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: 11,
                                letterSpacing: '0.12em',
                                color: 'var(--fh-slate)',
                                textTransform: 'uppercase',
                                lineHeight: 1.2,
                              }}
                            >
                              {group.label}
                            </Typography>
                          }
                        />
                        {sectionExpanded ? (
                          <KeyboardArrowDownRoundedIcon sx={{ fontSize: 20, color: 'var(--fh-accent)' }} />
                        ) : (
                          <KeyboardArrowRightRoundedIcon sx={{ fontSize: 20, color: 'var(--fh-slate)' }} />
                        )}
                      </ListItemButton>

                      <Collapse in={sectionExpanded} timeout="auto" unmountOnExit>
                        <Box sx={{ px: 0.9, pt: 0.75, pb: 0.9 }}>
                          {group.groups.map(({ page, children }) => {
                            const visibleChildren = children.filter((child) => child.key !== 'book-builder');
                            const parentActive = page.path === location.pathname || Boolean(page.aliases?.includes(location.pathname));
                            const activeChildKey = visibleChildren.find(
                              (child) => child.path === location.pathname || Boolean(child.aliases?.includes(location.pathname)),
                            )?.key;
                            const active = parentActive || Boolean(activeChildKey);
                            return (
                              <Box key={`${group.section}-${page.key}`} sx={{ mb: 0.45 }}>
                                <ListItemButton
                                  component={RouterLink}
                                  to={page.path}
                                  aria-current={active ? 'page' : undefined}
                                  onClick={() => {
                                    trackSidebarClick({
                                      section: group.label,
                                      label: getProviderPageSidebarLabel(page),
                                      route: page.path,
                                      level: 'primary',
                                    });
                                    onClose();
                                  }}
                                  sx={{
                                    mb: 0.5,
                                    px: 1,
                                    py: 0.9,
                                    minHeight: 74,
                                    borderRadius: '14px',
                                    border: '1px solid',
                                    borderColor: active
                                      ? 'color-mix(in srgb, var(--fh-brand-dark) 86%, var(--fh-brand) 14%)'
                                      : 'color-mix(in srgb, var(--fh-line) 58%, transparent)',
                                    bgcolor: active
                                      ? 'var(--fh-brand)'
                                      : 'color-mix(in srgb, var(--fh-surface) 88%, var(--fh-surface-bg) 12%)',
                                    transition:
                                      'transform var(--fh-duration-base) var(--fh-ease-premium), background-color var(--fh-duration-fast) ease, border-color var(--fh-duration-fast) ease',
                                    '&:hover': {
                                      bgcolor: active
                                        ? 'color-mix(in srgb, var(--fh-brand-dark) 80%, var(--fh-brand) 20%)'
                                        : 'color-mix(in srgb, var(--fh-surface) 96%, var(--fh-surface-bg) 4%)',
                                      transform: 'translateY(-1px)',
                                    },
                                  }}
                                >
                                  <ListItemIcon
                                    sx={{
                                      minWidth: 0,
                                      mr: 1.15,
                                      width: 34,
                                      height: 34,
                                      borderRadius: '10px',
                                      display: 'grid',
                                      placeItems: 'center',
                                      color: active ? 'var(--fh-surface-bg)' : 'var(--fh-brand)',
                                      bgcolor: active
                                        ? 'color-mix(in srgb, var(--fh-brand-dark) 70%, black 30%)'
                                        : 'color-mix(in srgb, var(--fh-brand-soft) 56%, var(--fh-surface-bg) 44%)',
                                    }}
                                  >
                                    <page.icon size={16} />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={
                                      <Box>
                                        <Typography
                                          sx={{
                                            fontWeight: active ? 800 : 700,
                                            fontSize: 13,
                                            lineHeight: 1.15,
                                            color: active ? 'var(--fh-surface-bg)' : 'var(--fh-ink)',
                                            mb: 0.2,
                                          }}
                                        >
                                          {getProviderPageSidebarLabel(page)}
                                        </Typography>
                                        <Typography
                                          sx={{
                                            fontWeight: 500,
                                            fontSize: 11.5,
                                            lineHeight: 1.25,
                                            color: active
                                              ? 'color-mix(in srgb, var(--fh-surface-bg) 86%, transparent)'
                                              : 'var(--fh-slate)',
                                          }}
                                        >
                                          {getProviderPageSidebarHint(page)}
                                        </Typography>
                                      </Box>
                                    }
                                  />
                                </ListItemButton>
                                {visibleChildren.length ? (
                                  <Box sx={{ pl: 1.2 }}>
                                    {visibleChildren.map((child) => {
                                      const childActive =
                                        child.path === location.pathname || Boolean(child.aliases?.includes(location.pathname));
                                      return (
                                        <ListItemButton
                                          key={`${group.section}-${child.key}`}
                                          component={RouterLink}
                                          to={child.path}
                                          aria-current={childActive ? 'page' : undefined}
                                          onClick={() => {
                                            trackSidebarClick({
                                              section: group.label,
                                              label: getProviderPageSidebarLabel(child),
                                              route: child.path,
                                              level: 'secondary',
                                            });
                                            onClose();
                                          }}
                                          sx={{
                                            mb: 0.4,
                                            px: 0.9,
                                            py: 0.7,
                                            minHeight: 62,
                                            borderRadius: '12px',
                                            border: '1px solid',
                                            borderColor: childActive
                                              ? 'color-mix(in srgb, var(--fh-brand-dark) 74%, var(--fh-brand) 26%)'
                                              : 'color-mix(in srgb, var(--fh-line) 52%, transparent)',
                                            bgcolor: childActive
                                              ? 'color-mix(in srgb, var(--fh-brand-soft) 62%, var(--fh-surface-bg) 38%)'
                                              : 'color-mix(in srgb, var(--fh-surface) 76%, var(--fh-surface-bg) 24%)',
                                            transition:
                                              'transform var(--fh-duration-base) var(--fh-ease-premium), background-color var(--fh-duration-fast) ease, border-color var(--fh-duration-fast) ease',
                                            '&:hover': {
                                              bgcolor: childActive
                                                ? 'color-mix(in srgb, var(--fh-brand-soft) 68%, var(--fh-surface-bg) 32%)'
                                                : 'color-mix(in srgb, var(--fh-surface) 92%, var(--fh-surface-bg) 8%)',
                                              transform: 'translateY(-1px)',
                                            },
                                          }}
                                        >
                                          <ListItemIcon
                                            sx={{
                                              minWidth: 0,
                                              mr: 1,
                                              width: 28,
                                              height: 28,
                                              borderRadius: '9px',
                                              display: 'grid',
                                              placeItems: 'center',
                                              color: childActive ? 'var(--fh-brand-dark)' : 'var(--fh-slate)',
                                              bgcolor: childActive
                                                ? 'color-mix(in srgb, var(--fh-brand-soft) 68%, var(--fh-surface-bg) 32%)'
                                                : 'color-mix(in srgb, var(--fh-line) 12%, transparent)',
                                            }}
                                          >
                                            <child.icon size={14} />
                                          </ListItemIcon>
                                          <ListItemText
                                            primary={
                                              <Box>
                                                <Typography
                                                  sx={{
                                                    fontWeight: childActive ? 750 : 650,
                                                    fontSize: 12,
                                                    lineHeight: 1.15,
                                                    color: childActive ? 'var(--fh-ink)' : 'var(--fh-ink)',
                                                    mb: 0.15,
                                                  }}
                                                >
                                                  {getProviderPageSidebarLabel(child)}
                                                </Typography>
                                                <Typography
                                                  sx={{
                                                    fontWeight: 500,
                                                    fontSize: 11,
                                                    lineHeight: 1.2,
                                                    color: 'var(--fh-slate)',
                                                  }}
                                                >
                                                  {getProviderPageSidebarHint(child)}
                                                </Typography>
                                              </Box>
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
                    </>
                  );
                })()}
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
