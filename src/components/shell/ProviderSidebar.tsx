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
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import KeyboardDoubleArrowLeftRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import LiveTvRoundedIcon from '@mui/icons-material/LiveTvRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import MovieFilterRoundedIcon from '@mui/icons-material/MovieFilterRounded';
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { getProviderSidebarGroupsBySection, providerPages, providerSections } from '@/navigation/providerPages';
import { providerCategoryBySection } from '@/navigation/providerCategories';

const drawerWidth = 318;
const topbarOffsetMobile = 110;
const topbarOffsetDesktop = 128;

const expandedDrawerWidth = 318;
const collapsedDrawerWidth = 88;

const sectionIconMap: Record<string, typeof GridViewRoundedIcon> = {
  'Foundation & Mission Control': HomeRoundedIcon,
  'Content Structure & Teaching Creation': FolderRoundedIcon,
  'Live Sessions Operations': LiveTvRoundedIcon,
  'Audience & Outreach': CampaignRoundedIcon,
  'Post-live & Trust': MovieFilterRoundedIcon,
  'Events & Giving': VolunteerActivismRoundedIcon,
  Beacon: BoltRoundedIcon,
  'Community & Care': GroupsRoundedIcon,
  'Leadership & Team': SupervisorAccountRoundedIcon,
  'Workspace Settings': SettingsRoundedIcon,
};

const PRIORITY_SECTIONS = new Set<string>([
  'Foundation & Mission Control',
  'Content Structure & Teaching Creation',
  'Live Sessions Operations',
  'Audience & Outreach',
  'Events & Giving',
]);

function getSidebarPageLabel(input: { key: string; title: string; shortTitle?: string }) {
  if (input.shortTitle) return input.shortTitle;

  const explicit: Record<string, string> = {
    'provider-onboarding': 'Provider Onboarding',
    'provider-dashboard': 'Provider Dashboard',
    'charity-crowdfunding-workbench': 'Charity Crowdfunding',
    'channels-contact-manager': 'Channels & Contacts',
    'standalone-teaching-builder': 'Standalone Builder',
    'stream-to-platforms': 'Stream to Platforms',
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
    'provider-dashboard': 'Overview, insights, and command actions',
    'provider-onboarding': 'Setup, verification, and launch readiness',
    'series-dashboard': 'Track series progress and publishing lanes',
    'teachings-dashboard': 'Teachings workflow, drafts, and review',
    'live-dashboard': 'Live sessions, stream health, and controls',
    'audience-notifications': 'Targeted updates and audience outreach',
    'reviews-and-moderation': 'Trust queue, reviews, and moderation tasks',
    'events-manager': 'Event planning, schedule, and attendance',
    'donations-and-funds': 'Giving health, campaigns, and fund tracking',
    'profile-settings': 'Profile, workspace, and access preferences',
  };
  if (explicit[input.key]) return explicit[input.key];

  const cleaned = input.title.replace(/^FaithHub Provider\s+/i, '').trim();
  return `${cleaned} workspace tools`;
}

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
  onOpenSearch,
}: {
  open: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenSearch?: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const isWideSidebar = useMediaQuery('(min-width:1200px)');
  const isNarrowPhone = useMediaQuery('(max-width:390px)');
  const isDesktopSidebar = useMediaQuery('(min-width:900px)');
  const effectiveCollapsed = isDesktopSidebar ? collapsed : false;
  const sidebarPad = isNarrowPhone ? 0.9 : 1.1;
  const sectionTitleSize = isNarrowPhone ? 13.5 : 13;
  const primaryTitleSize = isNarrowPhone ? 14 : 13;
  const secondaryTitleSize = isNarrowPhone ? 12.5 : 12;
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [showAllSections, setShowAllSections] = useState(false);
  const [reportAnchorEl, setReportAnchorEl] = useState<HTMLElement | null>(null);
  const reportMenuOpen = Boolean(reportAnchorEl);

  const sections = providerSections
    .map((section) => ({
      section,
      label: providerCategoryBySection[section].navLabel,
      groups: getProviderSidebarGroupsBySection(section),
    }))
    .filter((group) => group.groups.length > 0);
  const primarySections = useMemo(
    () => sections.filter((group) => PRIORITY_SECTIONS.has(group.section)),
    [sections]
  );
  const secondarySections = useMemo(
    () => sections.filter((group) => !PRIORITY_SECTIONS.has(group.section)),
    [sections]
  );
  const activeSection = useMemo(() => {
    const activePage = providerPages.find(
      (page) => page.path === location.pathname || Boolean(page.aliases?.includes(location.pathname)),
    );
    return activePage?.section;
  }, [location.pathname]);
  const displayedSections = useMemo(() => {
    if (showAllSections) return [...primarySections, ...secondarySections];
    if (!activeSection || PRIORITY_SECTIONS.has(activeSection)) return primarySections;
    const activeSecondary = secondarySections.find((group) => group.section === activeSection);
    return activeSecondary ? [...primarySections, activeSecondary] : primarySections;
  }, [activeSection, primarySections, secondarySections, showAllSections]);

  useEffect(() => {
    if (!activeSection) return;
    setOpenSections((prev) => {
      if (prev[activeSection]) return prev;
      return { ...prev, [activeSection]: true };
    });
  }, [activeSection]);

  useEffect(() => {
    if (isWideSidebar) {
      setShowAllSections(true);
    }
  }, [isWideSidebar]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const content = (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        bgcolor: '#1b2a43',
      }}
    >
      <Box sx={{ p: sidebarPad, height: '100%', minHeight: 0 }}>
        <Box
          sx={{
            borderRadius: '26px',
            border: '1px solid',
            borderColor: 'rgba(120,146,186,0.28)',
            bgcolor: '#1f2f4a',
            overflow: 'hidden',
            boxShadow: '0 18px 46px rgba(4,10,24,0.38)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: 0,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1.5, py: 1.55, gap: 1 }}>
            <Typography sx={{ color: '#d5deec', fontWeight: 700, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              FaithHub Provider
            </Typography>
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
                  bgcolor: 'rgba(9,16,31,0.45)',
                  color: '#dbe5f6',
                  border: '1px solid',
                  borderColor: 'rgba(120,146,186,0.28)',
                  width: 42,
                  height: 42,
                  borderRadius: 999,
                  transition: 'transform var(--fh-duration-base) var(--fh-ease-premium), background-color var(--fh-duration-fast) ease, border-color var(--fh-duration-fast) ease',
                  '&:hover': { bgcolor: 'rgba(9,16,31,0.7)', transform: 'translateY(-1px)' },
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

          <Divider sx={{ borderColor: 'rgba(120,146,186,0.25)' }} />

          {!effectiveCollapsed ? (
            <Box sx={{ px: 1.5, pt: 1.4, pb: 0.5 }}>
              <Box
                sx={{
                  borderRadius: '20px',
                  border: '1px solid rgba(120,146,186,0.28)',
                  background: 'linear-gradient(180deg, rgba(65,83,112,0.56), rgba(61,79,108,0.36))',
                  p: 1.4,
                }}
              >
                <Typography sx={{ color: '#b4c3db', fontSize: 12, fontWeight: 700 }}>Active workspace</Typography>
                <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mt: 1 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '14px',
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: '#101c35',
                      color: '#f0f5ff',
                      fontWeight: 800,
                      fontSize: 16,
                    }}
                  >
                    FH
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ color: '#e8eef9', fontWeight: 800, fontSize: 16, lineHeight: 1.1 }}>FaithHub Provider</Typography>
                    <Typography sx={{ color: '#a7b8d4', fontSize: 12 }}>Navigation modules</Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          ) : null}

          <List
            sx={{
              p: isNarrowPhone ? 1 : 1.2,
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              pb: 2,
              '&::-webkit-scrollbar': { width: 8 },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(120,146,186,0.45)',
                borderRadius: 10,
              },
              '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
            }}
          >
            {displayedSections.map((group) => (
              <Box
                key={group.section}
                sx={{
                  mb: effectiveCollapsed ? 0.55 : 1,
                  p: effectiveCollapsed ? 0 : isNarrowPhone ? 0.6 : 0.7,
                  borderRadius: effectiveCollapsed ? 0 : '20px',
                  border: effectiveCollapsed ? 'none' : '1px solid rgba(120,146,186,0.22)',
                  bgcolor: effectiveCollapsed ? 'transparent' : 'rgba(24,42,69,0.66)',
                }}
              >
                {!effectiveCollapsed ? (
                  <Box sx={{ mb: 0.58 }}>
                    {(() => {
                      const SectionIcon = sectionIconMap[group.section] ?? GridViewRoundedIcon;
                      return (
                    <ListItemButton
                      onClick={() => toggleSection(group.section)}
                      aria-label={`${openSections[group.section] ? 'Collapse' : 'Expand'} ${group.label} section`}
                      aria-expanded={Boolean(openSections[group.section])}
                      sx={{
                        px: 1.1,
                        py: isNarrowPhone ? 0.9 : 1,
                        minHeight: isNarrowPhone ? 60 : 64,
                        borderRadius: '16px',
                        border: '1px solid',
                        borderColor: 'rgba(120,146,186,0.3)',
                        bgcolor: openSections[group.section] ? 'rgba(19,34,59,0.95)' : 'rgba(28,46,74,0.7)',
                        transition: 'transform var(--fh-duration-base) var(--fh-ease-premium), background-color var(--fh-duration-fast) ease, border-color var(--fh-duration-fast) ease',
                        '&:hover': {
                          bgcolor: 'rgba(22,40,69,0.96)',
                          transform: 'translateY(-1px)',
                        },
                        '&:focus-visible': {
                          outline: '2px solid rgba(3,205,140,0.7)',
                          outlineOffset: '2px',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: 1.1,
                          width: 38,
                          height: 38,
                          borderRadius: '12px',
                          display: 'grid',
                          placeItems: 'center',
                          color: openSections[group.section] ? 'var(--fh-brand)' : '#b9c6db',
                          bgcolor: 'rgba(64,84,114,0.6)',
                        }}
                      >
                        <SectionIcon sx={{ fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 800,
                                fontSize: sectionTitleSize,
                                letterSpacing: '0.14em',
                                color: '#ced8ea',
                                textTransform: 'uppercase',
                                lineHeight: 1.2,
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
                            fontSize: 24,
                            color: '#d9e3f3',
                          }}
                        />
                      ) : (
                        <KeyboardArrowRightRoundedIcon
                          sx={{
                            fontSize: 24,
                            color: '#9fb2cd',
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
                                aria-current={active ? 'page' : undefined}
                                onClick={() => {
                                  trackSidebarClick({
                                    section: group.label,
                                    label: getSidebarPageLabel(page),
                                    route: page.path,
                                    level: 'primary',
                                  });
                                  onClose();
                                }}
                                sx={{
                                  mb: 0.5,
                                  px: 1,
                                  py: isNarrowPhone ? 0.95 : 1.05,
                                  minHeight: isNarrowPhone ? 76 : 82,
                                  borderRadius: '16px',
                                  border: '1px solid',
                                  borderColor: active
                                    ? 'color-mix(in srgb, var(--fh-brand-dark) 76%, var(--fh-brand) 24%)'
                                    : 'rgba(120,146,186,0.24)',
                                  bgcolor: active
                                    ? 'linear-gradient(135deg, rgba(3,205,140,0.94), rgba(3,180,126,0.94))'
                                    : 'rgba(16,31,54,0.65)',
                                  transition: 'transform var(--fh-duration-base) var(--fh-ease-premium), background-color var(--fh-duration-fast) ease, border-color var(--fh-duration-fast) ease',
                                  '&:hover': {
                                    bgcolor: active
                                      ? 'linear-gradient(135deg, rgba(3,190,131,0.94), rgba(2,164,116,0.94))'
                                      : 'rgba(20,37,63,0.92)',
                                    transform: 'translateY(-1px)',
                                  },
                                  '&:focus-visible': {
                                    outline: '2px solid rgba(3,205,140,0.7)',
                                    outlineOffset: '2px',
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
                                      ? 'rgba(7,36,35,0.34)'
                                      : 'rgba(64,84,114,0.52)',
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
                                          fontSize: primaryTitleSize,
                                          lineHeight: 1.15,
                                          color: active ? '#f5fbff' : '#e3eaf6',
                                          mb: 0.2,
                                        }}
                                      >
                                        {getSidebarPageLabel(page)}
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: isNarrowPhone ? 12.25 : 11.5,
                                          lineHeight: 1.25,
                                          color: active
                                            ? 'rgba(240,249,255,0.9)'
                                            : '#9fb0cc',
                                        }}
                                      >
                                        {getSidebarPageHint(page)}
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
                                            label: getSidebarPageLabel(child),
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
                                            ? 'color-mix(in srgb, var(--fh-brand-dark) 68%, var(--fh-brand) 32%)'
                                            : 'rgba(120,146,186,0.22)',
                                          bgcolor: childActive
                                            ? 'rgba(3,205,140,0.18)'
                                            : 'rgba(18,34,57,0.55)',
                                          transition: 'transform var(--fh-duration-base) var(--fh-ease-premium), background-color var(--fh-duration-fast) ease, border-color var(--fh-duration-fast) ease',
                                          '&:hover': {
                                            bgcolor: childActive
                                              ? 'color-mix(in srgb, var(--fh-brand-soft) 68%, var(--fh-surface-bg) 32%)'
                                              : 'color-mix(in srgb, var(--fh-surface) 92%, var(--fh-surface-bg) 8%)',
                                            transform: 'translateY(-1px)',
                                          },
                                          '&:focus-visible': {
                                            outline: '2px solid rgba(3,205,140,0.65)',
                                            outlineOffset: '2px',
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
                                              ? 'rgba(3,205,140,0.22)'
                                              : 'rgba(64,84,114,0.5)',
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
                                                  fontSize: secondaryTitleSize,
                                                  lineHeight: 1.15,
                                                  color: childActive ? '#eafaf3' : '#d2ddec',
                                                  mb: 0.15,
                                                }}
                                              >
                                                {getSidebarPageLabel(child)}
                                              </Typography>
                                              <Typography
                                                sx={{
                                                  fontWeight: 500,
                                                  fontSize: isNarrowPhone ? 11.5 : 11,
                                                  lineHeight: 1.2,
                                                  color: '#9fb0cc',
                                                }}
                                              >
                                                {getSidebarPageHint(child)}
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
                  </Box>
                ) : null}

                {group.groups.map(({ page, children }) => {
                  if (!effectiveCollapsed) return null;
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
                        aria-current={active ? 'page' : undefined}
                        onClick={() => {
                          trackSidebarClick({
                            section: group.label,
                            label: getSidebarPageLabel(page),
                            route: page.path,
                            level: 'primary',
                          });
                          onClose();
                        }}
                        title={effectiveCollapsed ? getSidebarPageLabel(page) : undefined}
                        sx={{
                          px: effectiveCollapsed ? 0.8 : 1,
                          py: 0.7,
                          minHeight: 42,
                          borderRadius: '10px',
                          border: '1px solid',
                          borderWidth: 1,
                          borderColor: active ? 'var(--fh-brand-dark)' : 'var(--fh-line)',
                          bgcolor: active ? 'color-mix(in srgb, var(--fh-brand-soft) 40%, var(--fh-surface-bg) 60%)' : 'var(--fh-surface-bg)',
                          transition: 'transform var(--fh-duration-base) var(--fh-ease-premium), background-color var(--fh-duration-fast) ease, border-color var(--fh-duration-fast) ease',
                          '&:hover': {
                            bgcolor: active
                              ? 'color-mix(in srgb, var(--fh-brand-soft) 54%, var(--fh-surface-bg) 46%)'
                              : 'var(--fh-surface)',
                            borderColor: active
                              ? 'var(--fh-brand-dark)'
                              : 'color-mix(in srgb, var(--fh-line) 72%, var(--fh-ink) 28%)',
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: effectiveCollapsed ? 0 : 30,
                            mr: effectiveCollapsed ? 0 : 0.5,
                            color: active ? 'var(--fh-brand)' : 'var(--fh-slate)',
                          }}
                        >
                          <Icon size={16} />
                        </ListItemIcon>
                        {!effectiveCollapsed ? (
                          <>
                            <ListItemText
                              primary={
                                <Typography
                                  sx={{
                                    fontWeight: active ? 800 : 650,
                                    fontSize: 12,
                                    lineHeight: 1.2,
                                    color: 'var(--fh-ink)',
                                  }}
                                >
                                  {getSidebarPageLabel(page)}
                                </Typography>
                              }
                            />
                            <KeyboardArrowRightRoundedIcon sx={{ fontSize: 22, color: 'var(--fh-slate)' }} />
                          </>
                        ) : null}
                      </ListItemButton>
                      {!effectiveCollapsed && visibleChildren.length ? (
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
                                aria-current={childActive ? 'page' : undefined}
                                onClick={() => {
                                  trackSidebarClick({
                                    section: group.label,
                                    label: getSidebarPageLabel(child),
                                    route: child.path,
                                    level: 'secondary',
                                  });
                                  onClose();
                                }}
                                sx={{
                                  mb: 0.55,
                                  px: 1,
                                  py: 0.55,
                                  minHeight: 36,
                                  borderRadius: '8px',
                                  border: '1px solid',
                                  borderColor: childActive ? 'var(--fh-brand-dark)' : 'transparent',
                                  bgcolor: childActive
                                    ? 'color-mix(in srgb, var(--fh-brand-soft) 35%, var(--fh-surface-bg) 65%)'
                                    : 'transparent',
                                  transition: 'transform var(--fh-duration-base) var(--fh-ease-premium), background-color var(--fh-duration-fast) ease',
                                  '&:hover': {
                                    bgcolor: 'var(--fh-surface)',
                                    transform: 'translateY(-1px)',
                                  },
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    minWidth: 24,
                                    color: childActive ? 'var(--fh-accent)' : 'var(--fh-slate)',
                                  }}
                                >
                                  <ChildIcon size={14} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Typography
                                      sx={{
                                        fontWeight: childActive ? 800 : 600,
                                        fontSize: 11,
                                        lineHeight: 1.2,
                                        color: childActive ? 'var(--fh-ink)' : 'var(--fh-slate)',
                                      }}
                                    >
                                      {getSidebarPageLabel(child)}
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
            {secondarySections.length > 0 && !isWideSidebar ? (
              <Box sx={{ pt: 1 }}>
                <Box
                  sx={{
                    mb: 0.9,
                    height: 16,
                    borderRadius: 999,
                    background:
                      'linear-gradient(180deg, color-mix(in srgb, var(--fh-surface-bg) 40%, transparent 60%) 0%, transparent 100%)',
                    pointerEvents: 'none',
                  }}
                />
                <ListItemButton
                  onClick={() => setShowAllSections((prev) => !prev)}
                  aria-label={showAllSections ? 'Hide extended navigation sections' : `Explore additional navigation sections (${secondarySections.length})`}
                  aria-expanded={showAllSections}
                  sx={{
                    px: 1.15,
                    py: 0.8,
                    minHeight: 44,
                    borderRadius: '14px',
                    border: '1px solid',
                    borderColor: 'color-mix(in srgb, var(--fh-line) 74%, var(--fh-brand-soft) 26%)',
                    bgcolor: 'color-mix(in srgb, var(--fh-surface) 72%, var(--fh-surface-bg) 28%)',
                    transition: 'transform var(--fh-duration-base) var(--fh-ease-premium), background-color var(--fh-duration-fast) ease, border-color var(--fh-duration-fast) ease',
                    '&:hover': {
                      borderColor: 'color-mix(in srgb, var(--fh-brand-soft) 55%, var(--fh-line) 45%)',
                      bgcolor: 'color-mix(in srgb, var(--fh-surface-bg) 82%, var(--fh-surface) 18%)',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: 12,
                          color: 'var(--fh-ink)',
                          lineHeight: 1.15,
                        }}
                      >
                        {showAllSections ? 'Core navigation' : 'Explore sections'}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        sx={{
                          mt: 0.3,
                          fontWeight: 600,
                          fontSize: 10.5,
                          color: 'var(--fh-slate)',
                          letterSpacing: '0.02em',
                          lineHeight: 1.2,
                        }}
                      >
                        {showAllSections ? 'Showing all sections' : `${secondarySections.length} more sections`}
                      </Typography>
                    }
                  />
                  {showAllSections ? (
                    <KeyboardArrowDownRoundedIcon sx={{ fontSize: 20, color: 'var(--fh-brand)' }} />
                  ) : (
                    <KeyboardArrowRightRoundedIcon sx={{ fontSize: 20, color: 'var(--fh-brand)' }} />
                  )}
                </ListItemButton>
              </Box>
            ) : null}
          </List>

          {!effectiveCollapsed ? (
            <Box sx={{ p: isNarrowPhone ? 1 : 1.2, pt: 0.8 }}>
              <Stack direction="row" spacing={1.1}>
                <ListItemButton
                  onClick={() => {
                    onOpenSearch?.();
                    if (!isDesktopSidebar) onClose();
                  }}
                  sx={{
                    flex: 1,
                    minHeight: 50,
                    borderRadius: '16px',
                    border: '1px solid rgba(120,146,186,0.3)',
                    bgcolor: 'rgba(17,33,57,0.78)',
                    color: '#d7e3f7',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 15,
                    '&:hover': { bgcolor: 'rgba(20,37,63,0.95)' },
                    '&:focus-visible': {
                      outline: '2px solid rgba(3,205,140,0.7)',
                      outlineOffset: '2px',
                    },
                  }}
                >
                  Search
                </ListItemButton>
                <ListItemButton
                  onClick={(event) => setReportAnchorEl(event.currentTarget)}
                  sx={{
                    flex: 1,
                    minHeight: 50,
                    borderRadius: '16px',
                    border: '1px solid rgba(120,146,186,0.3)',
                    bgcolor: 'rgba(17,33,57,0.78)',
                    color: '#d7e3f7',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 15,
                    '&:hover': { bgcolor: 'rgba(20,37,63,0.95)' },
                    '&:focus-visible': {
                      outline: '2px solid rgba(3,205,140,0.7)',
                      outlineOffset: '2px',
                    },
                  }}
                >
                  Report
                </ListItemButton>
              </Stack>
            </Box>
          ) : null}

          <Menu
            anchorEl={reportAnchorEl}
            open={reportMenuOpen}
            onClose={() => setReportAnchorEl(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            PaperProps={{
              sx: {
                bgcolor: '#1b2a43',
                color: '#d7e3f7',
                border: '1px solid rgba(120,146,186,0.3)',
                borderRadius: '14px',
                minWidth: 220,
              },
            }}
          >
            <MenuItem
              onClick={() => {
                setReportAnchorEl(null);
                navigate('/faithhub/provider/qa-center?type=bug');
                onClose();
              }}
              sx={{ fontSize: 13, fontWeight: 700 }}
            >
              Report a bug
            </MenuItem>
            <MenuItem
              onClick={() => {
                setReportAnchorEl(null);
                navigate('/faithhub/provider/qa-center?type=feature');
                onClose();
              }}
              sx={{ fontSize: 13, fontWeight: 700 }}
            >
              Request a feature
            </MenuItem>
          </Menu>
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
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: effectiveCollapsed ? collapsedDrawerWidth : expandedDrawerWidth,
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
