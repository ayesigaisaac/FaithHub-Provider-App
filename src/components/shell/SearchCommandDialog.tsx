import { Fragment, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import {
  Box,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarPlus, Megaphone, Plus, Radio, UserPlus, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { providerPages } from '@/navigation/providerPages';

const RECENT_SEARCH_KEY = 'faithhub.provider.search.recents';
const MAX_RECENTS = 6;
const MAX_RESULTS = 20;

type VisiblePage = (typeof providerPages)[number];

type SearchAction = {
  key: string;
  title: string;
  subtitle: string;
  section: string;
  targetPath: string;
  keywords: string[];
  icon: LucideIcon;
};

type SearchEntry =
  | {
      kind: 'page';
      key: string;
      title: string;
      description: string;
      section: string;
      id?: string;
      path: string;
      aliases?: string[];
      icon: VisiblePage['icon'];
      payload: VisiblePage;
    }
  | {
      kind: 'action';
      key: string;
      title: string;
      description: string;
      section: string;
      path: string;
      icon: SearchAction['icon'];
      payload: SearchAction;
    };

type ResultGroup = {
  key: string;
  label: string;
  icon: typeof HistoryRoundedIcon;
  items: SearchEntry[];
};

const searchActions: SearchAction[] = [
  {
    key: 'new-live-session',
    title: 'New Live Session',
    subtitle: 'Start a new live broadcast flow',
    section: 'Quick Actions',
    targetPath: '/faithhub/provider/live-builder',
    keywords: ['new live', 'broadcast', 'stream', 'session', 'go live'],
    icon: Radio,
  },
  {
    key: 'invite-members',
    title: 'Invite Members',
    subtitle: 'Open team/member invite workflow',
    section: 'Quick Actions',
    targetPath: '/faithhub/provider/serving-teams/invite',
    keywords: ['invite', 'member', 'team', 'serve', 'volunteer'],
    icon: UserPlus,
  },
  {
    key: 'new-group',
    title: 'New Group',
    subtitle: 'Create a new community group',
    section: 'Quick Actions',
    targetPath: '/faithhub/provider/community-groups/new',
    keywords: ['group', 'community', 'cell', 'new group'],
    icon: Users,
  },
  {
    key: 'new-event',
    title: 'New Event',
    subtitle: 'Plan a service, conference, or class',
    section: 'Quick Actions',
    targetPath: '/faithhub/provider/events-manager',
    keywords: ['event', 'schedule', 'conference', 'service'],
    icon: CalendarPlus,
  },
  {
    key: 'new-campaign',
    title: 'New Campaign',
    subtitle: 'Launch a new Beacon promotion',
    section: 'Quick Actions',
    targetPath: '/faithhub/provider/beacon-builder',
    keywords: ['campaign', 'beacon', 'promotion', 'ads'],
    icon: Megaphone,
  },
  {
    key: 'new-teaching-series',
    title: 'New Teaching Series',
    subtitle: 'Create a new series structure',
    section: 'Quick Actions',
    targetPath: '/faithhub/provider/series-builder',
    keywords: ['series', 'teaching', 'new series', 'content'],
    icon: Plus,
  },
];

export function SearchCommandDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number }>({ top: 88, left: 640 });
  const inputRef = useRef<HTMLInputElement>(null);

  const visiblePages = useMemo(() => providerPages.filter((page) => !page.hidden), []);
  const pageKeyMap = useMemo(() => new Map(visiblePages.map((page) => [page.key, page])), [visiblePages]);
  const pageSectionLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    visiblePages.forEach((page) => {
      const parentTitle = page.parentKey ? pageKeyMap.get(page.parentKey)?.title : undefined;
      const sectionLabel =
        page.navPlacement === 'builder' && parentTitle
          ? `${page.section} • ${parentTitle} → ${page.title}`
          : page.section;
      map.set(page.key, sectionLabel);
    });
    return map;
  }, [pageKeyMap, visiblePages]);

  const recentPages = useMemo(() => {
    if (typeof window === 'undefined') return [] as VisiblePage[];
    try {
      const raw = window.localStorage.getItem(RECENT_SEARCH_KEY);
      if (!raw) return [] as VisiblePage[];
      const keys = JSON.parse(raw) as string[];
      return keys
        .map((key) => pageKeyMap.get(key))
        .filter((page): page is VisiblePage => Boolean(page));
    } catch {
      return [] as VisiblePage[];
    }
  }, [pageKeyMap]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIndex(0);
    if (typeof window !== 'undefined') {
      const top = window.innerWidth < 600 ? 70 : 88;
      setAnchorPosition({ top, left: Math.round(window.innerWidth / 2) });
    }
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open || typeof window === 'undefined') return;
    const handleResize = () => {
      const top = window.innerWidth < 600 ? 70 : 88;
      setAnchorPosition({ top, left: Math.round(window.innerWidth / 2) });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open]);

  const rankedPages = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as SearchEntry[];

    return visiblePages
      .map((page) => {
        const title = page.title.toLowerCase();
        const section = page.section.toLowerCase();
        const description = page.description.toLowerCase();
        const id = page.id?.toLowerCase() ?? '';
        const path = page.path.toLowerCase();

        let score = 0;
        if (title === q) score += 120;
        if (title.startsWith(q)) score += 80;
        if (title.includes(q)) score += 60;
        if (section.includes(q)) score += 35;
        if (description.includes(q)) score += 25;
        if (id === q) score += 95;
        if (id.startsWith(q)) score += 65;
        if (path.includes(q)) score += 20;

        return { page, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.page.title.localeCompare(b.page.title))
      .slice(0, MAX_RESULTS)
      .map((entry) => ({
        kind: 'page' as const,
        key: entry.page.key,
        title: entry.page.title,
        description: entry.page.description,
        section: pageSectionLabelMap.get(entry.page.key) ?? entry.page.section,
        id: entry.page.id,
        path: entry.page.path,
        aliases: entry.page.aliases,
        icon: entry.page.icon,
        payload: entry.page,
      }));
  }, [pageSectionLabelMap, query, visiblePages]);

  const rankedActions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as SearchEntry[];

    return searchActions
      .map((action) => {
        const title = action.title.toLowerCase();
        const subtitle = action.subtitle.toLowerCase();
        const keywords = action.keywords.join(' ').toLowerCase();
        const path = action.targetPath.toLowerCase();

        let score = 0;
        if (title === q) score += 120;
        if (title.startsWith(q)) score += 90;
        if (title.includes(q)) score += 70;
        if (subtitle.includes(q)) score += 30;
        if (keywords.includes(q)) score += 55;
        if (path.includes(q)) score += 20;

        return { action, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.action.title.localeCompare(b.action.title))
      .slice(0, 10)
      .map((entry) => ({
        kind: 'action' as const,
        key: entry.action.key,
        title: entry.action.title,
        description: entry.action.subtitle,
        section: entry.action.section,
        path: entry.action.targetPath,
        icon: entry.action.icon,
        payload: entry.action,
      }));
  }, [query]);

  const suggestedPages = useMemo(() => {
    const featured = visiblePages.filter((page) => page.quickAction);
    return featured.slice(0, 8).map((page) => ({
      kind: 'page' as const,
      key: page.key,
      title: page.title,
      description: page.description,
      section: pageSectionLabelMap.get(page.key) ?? page.section,
      id: page.id,
      path: page.path,
      aliases: page.aliases,
      icon: page.icon,
      payload: page,
    }));
  }, [pageSectionLabelMap, visiblePages]);

  const recentPageEntries = useMemo(
    () =>
      recentPages.slice(0, MAX_RECENTS).map((page) => ({
        kind: 'page' as const,
        key: page.key,
        title: page.title,
        description: page.description,
        section: pageSectionLabelMap.get(page.key) ?? page.section,
        id: page.id,
        path: page.path,
        aliases: page.aliases,
        icon: page.icon,
        payload: page,
      })),
    [pageSectionLabelMap, recentPages]
  );

  const groupedResults = useMemo(() => {
    if (query.trim()) {
      const groups: ResultGroup[] = [];
      if (rankedActions.length) {
        groups.push({ key: 'actions', label: 'Actions', icon: BoltRoundedIcon, items: rankedActions });
      }
      if (rankedPages.length) {
        groups.push({ key: 'pages', label: 'Pages', icon: SearchRoundedIcon, items: rankedPages });
      }
      return groups;
    }

    const groups: ResultGroup[] = [];
    if (recentPageEntries.length) {
      groups.push({ key: 'recent', label: 'Recent', icon: HistoryRoundedIcon, items: recentPageEntries });
    }

    groups.push({
      key: 'quick-actions',
      label: 'Quick Actions',
      icon: BoltRoundedIcon,
      items: searchActions.map((action) => ({
        kind: 'action' as const,
        key: action.key,
        title: action.title,
        description: action.subtitle,
        section: action.section,
        path: action.targetPath,
        icon: action.icon,
        payload: action,
      })),
    });

    groups.push({ key: 'suggested', label: 'Suggested Pages', icon: AutoAwesomeRoundedIcon, items: suggestedPages });
    return groups;
  }, [query, rankedActions, rankedPages, recentPageEntries, suggestedPages]);

  const flattened = useMemo(() => groupedResults.flatMap((group) => group.items), [groupedResults]);

  useEffect(() => {
    if (!flattened.length) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex((prev) => Math.min(prev, flattened.length - 1));
  }, [flattened]);

  const persistRecent = (key: string) => {
    if (typeof window === 'undefined') return;
    const deduped = [key, ...recentPages.map((page) => page.key).filter((existing) => existing !== key)].slice(0, MAX_RECENTS);
    window.localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(deduped));
  };

  const handleSelect = (entry: SearchEntry) => {
    if (entry.kind === 'page') {
      persistRecent(entry.key);
    }
    navigate(entry.path);
    onClose();
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!flattened.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % flattened.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + flattened.length) % flattened.length);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const entry = flattened[activeIndex];
      if (entry) handleSelect(entry);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    }
  };

  const renderHighlighted = (text: string, q: string) => {
    const needle = q.trim().toLowerCase();
    if (!needle) return text;

    const lower = text.toLowerCase();
    const idx = lower.indexOf(needle);
    if (idx < 0) return text;

    return (
      <Fragment>
        {text.slice(0, idx)}
        <Box component="span" sx={{ color: 'primary.main', fontWeight: 900 }}>
          {text.slice(idx, idx + needle.length)}
        </Box>
        {text.slice(idx + needle.length)}
      </Fragment>
    );
  };

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      marginThreshold={8}
      slotProps={{
        paper: {
          onKeyDown: handleKeyDown,
          sx: {
            width: { xs: 'calc(100vw - 16px)', sm: 760, md: 860 },
            maxWidth: '100vw',
            borderRadius: { xs: 3, md: 3.5 },
            border: '1px solid',
            borderColor: 'var(--fh-line)',
            bgcolor: 'var(--fh-surface-bg)',
            boxShadow: 'var(--fh-shadow-md)',
            overflow: 'hidden',
          },
        },
      }}
    >
      <Box sx={{ px: { xs: 1.25, md: 1.5 }, pt: 1.25, pb: 1 }}>
        <TextField
          inputRef={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          fullWidth
          placeholder="Search pages, quick actions, sections, or IDs..."
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {query ? (
                  <IconButton aria-label="Clear search" size="small" onClick={() => setQuery('')}>
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                ) : (
                  <Chip size="small" label="Ctrl K" variant="outlined" sx={{ fontWeight: 700, borderRadius: 1.5, height: 24 }} />
                )}
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
            },
          }}
        />
      </Box>

      <Divider />

      <List sx={{ px: 1, pb: 1, pt: 1, maxHeight: { xs: 360, md: 430 }, overflowY: 'auto' }}>
          {groupedResults.map((group) => {
            const GroupIcon = group.icon;
            return (
              <Box key={group.key} sx={{ mb: 1.3 }}>
                <Stack direction="row" alignItems="center" spacing={0.75} sx={{ px: 1.25, pb: 0.5 }}>
                  <GroupIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.08em', fontWeight: 800 }}>
                    {group.label}
                  </Typography>
                </Stack>

                {group.items.map((entry) => {
                  const Icon = entry.icon;
                  const flatIndex = flattened.findIndex((item) => item.key === entry.key && item.kind === entry.kind);
                  const selected = flatIndex === activeIndex;
                  const isCurrent =
                    entry.kind === 'page'
                      ? entry.path === location.pathname || Boolean(entry.aliases?.includes(location.pathname))
                      : entry.path === location.pathname;

                  return (
                    <ListItemButton
                      key={`${entry.kind}-${entry.key}`}
                      selected={selected}
                      onMouseEnter={() => setActiveIndex(flatIndex)}
                      onClick={() => handleSelect(entry)}
                      sx={{
                        mb: 0.5,
                        borderRadius: 2,
                        alignItems: 'flex-start',
                        border: '1px solid',
                        borderColor: selected ? 'var(--fh-brand)' : 'var(--fh-line)',
                        bgcolor: selected ? 'action.selected' : 'transparent',
                        '&.Mui-selected': { bgcolor: 'action.selected' },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 44, mt: 0.3 }}>
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: 1.5,
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: isCurrent ? 'success.light' : 'action.hover',
                            color: isCurrent ? 'success.dark' : entry.kind === 'action' ? 'warning.dark' : 'primary.main',
                          }}
                        >
                          <Icon size={16} />
                        </Box>
                      </ListItemIcon>

                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                            <Typography fontWeight={800}>{renderHighlighted(entry.title, query)}</Typography>
                            {entry.kind === 'page' && entry.id ? (
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                                {entry.id}
                              </Typography>
                            ) : null}
                            {entry.kind === 'action' ? <Chip label="Action" size="small" color="warning" sx={{ height: 21 }} /> : null}
                            {isCurrent ? <Chip label="Current" size="small" color="success" sx={{ height: 21 }} /> : null}
                          </Stack>
                        }
                        secondary={
                          <>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.15, lineHeight: 1.35 }}>
                                {renderHighlighted(entry.description, query)}
                              </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.45, display: 'block' }}>
                              {entry.section}
                            </Typography>
                          </>
                        }
                      />
                    </ListItemButton>
                  );
                })}
              </Box>
            );
          })}

          {!groupedResults.length ? (
            <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
              <Typography fontWeight={800}>No matches found</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Try "New Group", "Invite Members", "Live Dashboard", or "Beacon".
              </Typography>
            </Box>
          ) : null}
      </List>
    </Popover>
  );
}
