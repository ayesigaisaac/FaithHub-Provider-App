import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import {
  Box,
  Button,
  Chip,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Stack,
  Typography,
} from '@mui/material';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarPlus, Megaphone, Plus, Radio, UserPlus, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { providerPages } from '@/navigation/providerPages';

const RECENT_SEARCH_KEY = 'faithhub.provider.search.recents';
const RECENT_ACTIONS_KEY = 'faithhub.provider.search.recent-actions';
const MAX_RECENTS = 6;
const MAX_RESULTS = 20;
const MAX_RECENT_ACTIONS = 4;

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
      matchReasons?: string[];
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
      matchReasons?: string[];
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

export function SearchCommandDialog({
  open,
  onClose,
  anchorEl,
  query,
}: {
  open: boolean;
  onClose: () => void;
  anchorEl?: HTMLElement | null;
  query: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const listRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number }>({ top: 88, left: 640 });
  const [panelWidth, setPanelWidth] = useState<number>(760);
  const [recentKeys, setRecentKeys] = useState<string[]>([]);
  const [recentActionKeys, setRecentActionKeys] = useState<string[]>([]);
  const [activeScope, setActiveScope] = useState<'all' | 'live' | 'teachings' | 'team'>('all');

  const visiblePages = useMemo(() => providerPages.filter((page) => !page.hidden), []);
  const pageKeyMap = useMemo(() => new Map(visiblePages.map((page) => [page.key, page])), [visiblePages]);
  const pageSectionLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    visiblePages.forEach((page) => {
      const parentTitle = page.parentKey ? pageKeyMap.get(page.parentKey)?.title : undefined;
      const sectionLabel =
        page.navPlacement === 'builder' && parentTitle
          ? `${page.section} - ${parentTitle} -> ${page.title}`
          : page.section;
      map.set(page.key, sectionLabel);
    });
    return map;
  }, [pageKeyMap, visiblePages]);

  useEffect(() => {
    if (!open || typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(RECENT_SEARCH_KEY);
      if (!raw) {
        setRecentKeys([]);
        return;
      }
      const parsed = JSON.parse(raw) as string[];
      setRecentKeys(Array.isArray(parsed) ? parsed.filter((key): key is string => typeof key === 'string') : []);
    } catch {
      setRecentKeys([]);
    }
  }, [open]);

  useEffect(() => {
    if (!open || typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(RECENT_ACTIONS_KEY);
      if (!raw) {
        setRecentActionKeys([]);
        return;
      }
      const parsed = JSON.parse(raw) as string[];
      setRecentActionKeys(Array.isArray(parsed) ? parsed.filter((key): key is string => typeof key === 'string') : []);
    } catch {
      setRecentActionKeys([]);
    }
  }, [open]);

  const recentPages = useMemo(
    () =>
      recentKeys
        .map((key) => pageKeyMap.get(key))
        .filter((page): page is VisiblePage => Boolean(page)),
    [pageKeyMap, recentKeys]
  );

  useEffect(() => {
    if (!open) return;
    setActiveIndex(0);
    if (typeof window !== 'undefined') {
      const top = window.innerWidth < 600 ? 70 : 88;
      setAnchorPosition({ top, left: Math.round(window.innerWidth / 2) });
    }
  }, [open]);

  useEffect(() => {
    if (!open || typeof window === 'undefined') return;
    const handleResize = () => {
      const top = window.innerWidth < 600 ? 70 : 88;
      setAnchorPosition({ top, left: Math.round(window.innerWidth / 2) });
      if (anchorEl) {
        const anchorWidth = Math.round(anchorEl.getBoundingClientRect().width);
        setPanelWidth(Math.max(760, Math.min(1120, anchorWidth)));
      }
    };
    if (anchorEl) {
      const anchorWidth = Math.round(anchorEl.getBoundingClientRect().width);
      setPanelWidth(Math.max(760, Math.min(1120, anchorWidth)));
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [anchorEl, open]);

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
        const matchReasons = new Set<string>();
        if (title === q) score += 120;
        if (title.startsWith(q)) {
          score += 80;
          matchReasons.add('Title');
        }
        if (title.includes(q)) {
          score += 60;
          matchReasons.add('Title');
        }
        if (section.includes(q)) {
          score += 35;
          matchReasons.add('Section');
        }
        if (description.includes(q)) {
          score += 25;
          matchReasons.add('Description');
        }
        if (id === q) score += 95;
        if (id.startsWith(q)) {
          score += 65;
          matchReasons.add('ID');
        }
        if (path.includes(q)) {
          score += 20;
          matchReasons.add('Path');
        }

        return { page, score, matchReasons: Array.from(matchReasons).slice(0, 2) };
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
        matchReasons: entry.matchReasons,
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
        const matchReasons = new Set<string>();
        if (title === q) score += 120;
        if (title.startsWith(q)) {
          score += 90;
          matchReasons.add('Title');
        }
        if (title.includes(q)) {
          score += 70;
          matchReasons.add('Title');
        }
        if (subtitle.includes(q)) {
          score += 30;
          matchReasons.add('Description');
        }
        if (keywords.includes(q)) {
          score += 55;
          matchReasons.add('Keywords');
        }
        if (path.includes(q)) {
          score += 20;
          matchReasons.add('Path');
        }

        return { action, score, matchReasons: Array.from(matchReasons).slice(0, 2) };
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
        matchReasons: entry.matchReasons,
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
    const recentActions = recentActionKeys
      .map((key) => searchActions.find((action) => action.key === key))
      .filter((action): action is SearchAction => Boolean(action))
      .map((action) => ({
        kind: 'action' as const,
        key: action.key,
        title: action.title,
        description: action.subtitle,
        section: 'Recently Used Actions',
        path: action.targetPath,
        icon: action.icon,
        payload: action,
      }));
    if (recentActions.length) {
      groups.push({ key: 'recent-actions', label: 'Recently Used Actions', icon: BoltRoundedIcon, items: recentActions });
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
  }, [query, rankedActions, rankedPages, recentActionKeys, recentPageEntries, suggestedPages]);

  const filteredGroupedResults = useMemo(() => {
    if (activeScope === 'all') return groupedResults;
    return groupedResults
      .map((group) => {
        const items = group.items.filter((entry) => {
          const haystack = `${entry.title} ${entry.description} ${entry.section}`.toLowerCase();
          if (activeScope === 'live') return haystack.includes('live') || haystack.includes('stream') || haystack.includes('broadcast');
          if (activeScope === 'teachings') return haystack.includes('teaching') || haystack.includes('series') || haystack.includes('episode');
          if (activeScope === 'team') return haystack.includes('team') || haystack.includes('member') || haystack.includes('invite');
          return true;
        });
        return { ...group, items };
      })
      .filter((group) => group.items.length > 0);
  }, [activeScope, groupedResults]);

  const flattened = useMemo(() => filteredGroupedResults.flatMap((group) => group.items), [filteredGroupedResults]);

  useEffect(() => {
    if (!flattened.length) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex((prev) => Math.min(prev, flattened.length - 1));
  }, [flattened]);

  useEffect(() => {
    if (!open || !flattened.length) return;
    const active = flattened[activeIndex];
    if (!active) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-search-key="${active.kind}-${active.key}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, flattened, open]);

  const persistRecent = useCallback((key: string) => {
    if (typeof window === 'undefined') return;
    setRecentKeys((prev) => {
      const deduped = [key, ...prev.filter((existing) => existing !== key)].slice(0, MAX_RECENTS);
      window.localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(deduped));
      return deduped;
    });
  }, []);

  const clearRecent = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(RECENT_SEARCH_KEY);
    setRecentKeys([]);
    setActiveIndex(0);
  }, []);

  const handleSelect = useCallback((entry: SearchEntry) => {
    if (entry.kind === 'page') {
      persistRecent(entry.key);
    } else if (typeof window !== 'undefined') {
      setRecentActionKeys((prev) => {
        const deduped = [entry.key, ...prev.filter((existing) => existing !== entry.key)].slice(0, MAX_RECENT_ACTIONS);
        window.localStorage.setItem(RECENT_ACTIONS_KEY, JSON.stringify(deduped));
        return deduped;
      });
    }
    navigate(entry.path);
    onClose();
  }, [navigate, onClose, persistRecent]);

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

  useEffect(() => {
    if (!open) return;
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (!flattened.length) return;
        setActiveIndex((prev) => (prev + 1) % flattened.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (!flattened.length) return;
        setActiveIndex((prev) => (prev - 1 + flattened.length) % flattened.length);
      } else if (event.key === 'Enter') {
        if (!flattened.length) return;
        const entry = flattened[activeIndex];
        if (!entry) return;
        event.preventDefault();
        handleSelect(entry);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleGlobalKeyDown, { capture: true });
  }, [activeIndex, flattened, handleSelect, onClose, open]);

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

  const hasQuery = Boolean(query.trim());
  const scopeChips = useMemo(
    () => [
      { key: 'all' as const, label: 'All Provider' },
      { key: 'live' as const, label: 'Live Sessions' },
      { key: 'teachings' as const, label: 'Teachings' },
      { key: 'team' as const, label: 'From Team' },
    ],
    []
  );
  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorReference={anchorEl ? 'anchorEl' : 'anchorPosition'}
      anchorEl={anchorEl}
      anchorPosition={anchorEl ? undefined : anchorPosition}
      anchorOrigin={anchorEl ? { vertical: 'bottom', horizontal: 'left' } : undefined}
      transformOrigin={anchorEl ? { vertical: 'top', horizontal: 'left' } : { vertical: 'top', horizontal: 'center' }}
      marginThreshold={8}
      slotProps={{
        root: {
          sx: {
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(15, 23, 42, 0.14)',
              backdropFilter: 'blur(2px)',
            },
          },
        },
        paper: {
          onKeyDown: handleKeyDown,
          sx: {
            width: anchorEl
              ? { xs: 'calc(100vw - 16px)', sm: `${panelWidth}px` }
              : { xs: 'calc(100vw - 16px)', sm: 860, md: 1020 },
            maxWidth: '100vw',
            borderRadius: { xs: 4, md: 5 },
            border: '1px solid',
            borderColor: 'color-mix(in srgb, var(--fh-line) 80%, var(--fh-brand) 20%)',
            bgcolor: 'color-mix(in srgb, var(--fh-surface-bg) 95%, white 5%)',
            boxShadow: '0 22px 48px -26px rgba(15, 23, 42, 0.46), 0 14px 34px -26px rgba(15, 23, 42, 0.34)',
            backdropFilter: 'blur(10px)',
            overflow: 'hidden',
            transformOrigin: anchorEl ? 'top left' : 'top center',
            animation: 'fhSearchPopIn .16s ease-out',
            '@keyframes fhSearchPopIn': {
              from: { opacity: 0, transform: 'translateY(-6px) scale(0.985)' },
              to: { opacity: 1, transform: 'translateY(0) scale(1)' },
            },
          },
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: { xs: 1.6, md: 2.5 },
          pt: 1.55,
          pb: 1.45,
          borderBottom: '1px solid',
          borderColor: 'color-mix(in srgb, var(--fh-line) 90%, transparent)',
          background: 'color-mix(in srgb, var(--fh-surface-bg) 94%, white 6%)',
        }}
      >
        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ minWidth: 0 }}>
          <SearchRoundedIcon sx={{ fontSize: 31, color: 'var(--fh-slate)' }} />
          <Typography
            sx={{
              fontSize: { xs: '1.55rem', md: '1.7rem' },
              fontWeight: 500,
              color: hasQuery ? 'var(--fh-ink)' : 'text.secondary',
              lineHeight: 1.15,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {hasQuery ? query : 'Search FaithHub provider'}
          </Typography>
        </Stack>
        <TuneRoundedIcon sx={{ fontSize: 28, color: 'var(--fh-slate)' }} />
      </Stack>
      <Stack direction="row" spacing={1.1} sx={{ px: { xs: 1.6, md: 2.5 }, py: 1.3, borderBottom: '1px solid', borderColor: 'color-mix(in srgb, var(--fh-line) 90%, transparent)', overflowX: 'auto' }}>
        {scopeChips.map((chip) => (
          <Chip
            key={chip.key}
            label={chip.label}
            onClick={() => setActiveScope(chip.key)}
            variant={activeScope === chip.key ? 'filled' : 'outlined'}
            sx={{
              borderRadius: 3,
              fontWeight: 500,
              fontSize: 14,
              px: 0.55,
              height: 46,
              bgcolor: activeScope === chip.key ? 'color-mix(in srgb, var(--fh-brand) 14%, white 86%)' : 'transparent',
              borderColor: 'color-mix(in srgb, var(--fh-line) 80%, var(--fh-ink) 20%)',
            }}
          />
        ))}
      </Stack>
      <List
        ref={listRef}
        sx={{
          px: { xs: 1.25, md: 2 },
          pb: 1,
          pt: 1.15,
          maxHeight: { xs: 390, md: 500 },
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { width: 10 },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'color-mix(in srgb, var(--fh-brand) 30%, var(--fh-line) 70%)',
            borderRadius: 999,
            border: '2px solid transparent',
            backgroundClip: 'padding-box',
          },
        }}
      >
          {filteredGroupedResults.map((group) => {
            const GroupIcon = group.icon;
            return (
              <Box key={group.key} sx={{ mb: 1.3 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ px: 0.9, pb: 0.6, pt: 0.2, position: 'sticky', top: 0, zIndex: 1, bgcolor: 'inherit', display: hasQuery ? 'flex' : group.key === 'recent' ? 'flex' : 'none' }}
                >
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <GroupIcon sx={{ fontSize: 16, color: 'var(--fh-brand)' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.08em', fontWeight: 800 }}>
                      {group.label}
                    </Typography>
                  </Stack>
                  {group.key === 'recent' ? (
                    <Button
                      size="small"
                      onClick={clearRecent}
                      sx={{ minHeight: 24, px: 1, fontSize: 11, textTransform: 'none', color: 'var(--fh-slate)' }}
                    >
                      Clear
                    </Button>
                  ) : null}
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
                      data-search-key={`${entry.kind}-${entry.key}`}
                      selected={selected}
                      onMouseEnter={() => setActiveIndex(flatIndex)}
                      onClick={() => handleSelect(entry)}
                      sx={{
                        mb: hasQuery ? 0.65 : 0.15,
                        borderRadius: hasQuery ? 3 : 2.4,
                        minHeight: hasQuery ? 84 : 58,
                        alignItems: hasQuery ? 'center' : 'flex-start',
                        border: hasQuery ? '1px solid' : '1px solid transparent',
                        borderColor: selected
                          ? 'color-mix(in srgb, var(--fh-brand) 75%, var(--fh-line) 25%)'
                          : hasQuery ? 'color-mix(in srgb, var(--fh-line) 82%, white 18%)' : 'transparent',
                        bgcolor: selected
                          ? 'color-mix(in srgb, var(--fh-brand) 10%, var(--fh-surface-bg) 90%)'
                          : hasQuery ? 'color-mix(in srgb, var(--fh-surface-bg) 85%, white 15%)' : 'transparent',
                        boxShadow: selected ? '0 10px 20px -16px rgba(15,23,42,0.6)' : 'none',
                        transition: 'all .16s ease',
                        '&:hover': {
                          borderColor: 'color-mix(in srgb, var(--fh-brand) 50%, var(--fh-line) 50%)',
                          bgcolor: 'color-mix(in srgb, var(--fh-brand) 7%, var(--fh-surface-bg) 93%)',
                          transform: hasQuery ? 'translateY(-1px)' : 'none',
                        },
                        '&.Mui-selected': {
                          bgcolor: 'color-mix(in srgb, var(--fh-brand) 10%, var(--fh-surface-bg) 90%)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 44, mt: hasQuery ? 0.3 : 0.1 }}>
                        <Box
                          sx={{
                            width: hasQuery ? 30 : 26,
                            height: hasQuery ? 30 : 26,
                            borderRadius: hasQuery ? 1.5 : 999,
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: hasQuery ? (isCurrent ? 'success.light' : 'action.hover') : 'transparent',
                            color: hasQuery ? (isCurrent ? 'success.dark' : entry.kind === 'action' ? 'warning.dark' : 'primary.main') : 'text.secondary',
                          }}
                        >
                          <Icon size={hasQuery ? 16 : 15} />
                        </Box>
                      </ListItemIcon>

                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                            <Typography fontWeight={hasQuery ? 800 : 500} fontSize={hasQuery ? undefined : '1.03rem'} lineHeight={hasQuery ? undefined : 1.16}>
                              {renderHighlighted(entry.title, query)}
                            </Typography>
                            {entry.kind === 'page' && entry.id ? (
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                                {entry.id}
                              </Typography>
                            ) : null}
                            {entry.kind === 'action' ? <Chip label="Action" size="small" color="warning" sx={{ height: 21 }} /> : null}
                            {isCurrent ? <Chip label="Current" size="small" color="success" sx={{ height: 21 }} /> : null}
                            {hasQuery && entry.matchReasons?.length
                              ? entry.matchReasons.map((reason) => (
                                  <Chip
                                    key={`${entry.kind}-${entry.key}-${reason}`}
                                    label={`Match: ${reason}`}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      height: 21,
                                      borderColor: 'color-mix(in srgb, var(--fh-brand) 44%, var(--fh-line) 56%)',
                                      color: 'var(--fh-slate)',
                                      bgcolor: 'color-mix(in srgb, var(--fh-surface-bg) 88%, white 12%)',
                                    }}
                                  />
                                ))
                              : null}
                          </Stack>
                        }
                        secondary={hasQuery ? (
                          <>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.15, lineHeight: 1.35, display: hasQuery ? '-webkit-box' : 'block', WebkitLineClamp: hasQuery ? 1 : 'unset', WebkitBoxOrient: hasQuery ? 'vertical' : 'unset', overflow: hasQuery ? 'hidden' : 'visible' }}
                            >
                              {renderHighlighted(entry.description, query)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.45, display: 'block' }}>
                              {entry.section}
                            </Typography>
                          </>
                        ) : undefined}
                      />
                    </ListItemButton>
                  );
                })}
              </Box>
            );
          })}

          {!filteredGroupedResults.length ? (
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
