import {
  Backdrop,
  Box,
  ClickAwayListener,
  Grow,
  List,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { navigateWithRouter } from '@/navigation/routerNavigate';
import { providerPages } from '@/navigation/providerPages';
import { teachingsQuickActions } from '@/navigation/teachingsQuickActions';

const RECENT_COMMANDS_KEY = 'fh.provider.search.recents.v1';

type PaletteItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  group: 'Action' | 'Page';
  section?: string;
  description?: string;
  keywords?: string;
  onSelect: () => void;
};
type SearchFilter = 'all' | 'actions' | 'pages' | 'recent';

function getIconContainerSx(group: PaletteItem['group']) {
  if (group === 'Action') {
    return {
      color: 'var(--fh-brand-dark)',
      bgcolor: 'color-mix(in srgb, var(--fh-brand-soft) 48%, var(--fh-surface-bg) 52%)',
      borderColor: 'color-mix(in srgb, var(--fh-brand) 38%, var(--fh-line) 62%)',
    };
  }
  return {
    color: 'var(--fh-slate)',
    bgcolor: 'color-mix(in srgb, var(--fh-surface) 86%, var(--fh-surface-bg) 14%)',
    borderColor: 'var(--fh-line)',
  };
}

export function SearchCommandDialog({
  open,
  onClose,
  query,
  onQueryChange,
  returnFocusEl,
}: {
  open: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (value: string) => void;
  returnFocusEl?: HTMLElement | null;
}) {
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [showAllPages, setShowAllPages] = useState(false);
  const [activeFilter, setActiveFilter] = useState<SearchFilter>('all');
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const hasQuery = Boolean(query.trim());
  const normalizedQuery = query.trim().toLowerCase();

  const commands = useMemo<PaletteItem[]>(() => {
    const actionItems: PaletteItem[] = [
      {
        id: 'create-teaching',
        title: teachingsQuickActions.find((item) => item.key === 'create-teaching')?.label ?? 'Create teaching',
        subtitle: `Start a new teaching workflow (${teachingsQuickActions.find((item) => item.key === 'create-teaching')?.shortcut ?? 'C T'})`,
        icon: <AddRoundedIcon fontSize="small" />,
        group: 'Action',
        section: 'Actions',
        description: 'Start a new teaching workflow',
        keywords: 'new teaching create sermon',
        onSelect: () => navigateWithRouter('/faithhub/provider/teachings-dashboard'),
      },
      {
        id: 'open-last-draft',
        title: teachingsQuickActions.find((item) => item.key === 'continue-editing')?.label ?? 'Open last draft',
        subtitle: `Jump back to your most recent draft (${teachingsQuickActions.find((item) => item.key === 'continue-editing')?.shortcut ?? 'G D'})`,
        icon: <EditNoteRoundedIcon fontSize="small" />,
        group: 'Action',
        section: 'Actions',
        description: 'Jump back to your most recent draft',
        keywords: 'draft continue edit',
        onSelect: () => navigateWithRouter('/faithhub/provider/dashboard'),
      },
      {
        id: 'search-teachings',
        title: 'Search teachings by title',
        subtitle: normalizedQuery ? `Find matches for "${query.trim()}"` : 'Type a title to filter teachings',
        icon: <AutoStoriesRoundedIcon fontSize="small" />,
        group: 'Action',
        section: 'Actions',
        description: 'Search teachings by title',
        keywords: 'search find title teachings',
        onSelect: () => navigateWithRouter('/faithhub/provider/teachings-dashboard'),
      },
      {
        id: 'open-workflow',
        title: 'Open workflow dashboard',
        subtitle: `Continue editing, drafts, and publishing (${teachingsQuickActions.find((item) => item.key === 'publish')?.shortcut ?? 'G P'})`,
        icon: <AutoAwesomeRoundedIcon fontSize="small" />,
        group: 'Action',
        section: 'Actions',
        description: 'Continue editing, drafts, and publishing',
        keywords: 'workflow dashboard pending published',
        onSelect: () => navigateWithRouter('/faithhub/provider/dashboard'),
      },
    ];

    const pageItems: PaletteItem[] = providerPages
      .filter((page) => !page.hidden)
      .map((page) => ({
        id: `page-${page.key}`,
        title: page.shortTitle || page.title,
        subtitle: `${page.section} - ${page.description}`,
        icon: <page.icon size={16} strokeWidth={2.2} />,
        group: 'Page',
        section: page.section,
        description: page.description,
        keywords: `${page.title} ${page.shortTitle ?? ''} ${page.description} ${page.path} ${(page.aliases ?? []).join(' ')}`,
        onSelect: () => navigateWithRouter(page.path),
      }));

    const allItems = [...actionItems, ...pageItems];
    if (!normalizedQuery) return allItems.slice(0, 18);

    const scoreItem = (item: PaletteItem) => {
      const title = item.title.toLowerCase();
      const section = (item.section ?? '').toLowerCase();
      const description = (item.description ?? item.subtitle).toLowerCase();
      const keywords = (item.keywords ?? '').toLowerCase();

      if (title === normalizedQuery) return 1000;
      if (title.startsWith(normalizedQuery)) return 800;
      if (title.includes(normalizedQuery)) return 650;
      if (section.includes(normalizedQuery)) return 450;
      if (description.includes(normalizedQuery)) return 300;
      if (keywords.includes(normalizedQuery)) return 180;
      return 0;
    };

    return allItems
      .map((item, index) => ({ item, index, score: scoreItem(item) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .slice(0, 24)
      .map((entry) => entry.item);
  }, [normalizedQuery, query]);

  const commandById = useMemo(() => new Map(commands.map((command) => [command.id, command])), [commands]);
  const recentCommands = useMemo(
    () =>
      recentIds
        .map((id) => commandById.get(id))
        .filter((item): item is PaletteItem => Boolean(item))
        .slice(0, 5),
    [commandById, recentIds],
  );

  const actionCommands = useMemo(() => commands.filter((item) => item.group === 'Action'), [commands]);
  const pageCommands = useMemo(() => commands.filter((item) => item.group === 'Page'), [commands]);
  const discoverCommands = useMemo(() => {
    const bySection = new Map<string, PaletteItem>();
    for (const item of pageCommands) {
      const section = item.section ?? 'General';
      if (!bySection.has(section)) bySection.set(section, item);
      if (bySection.size >= 4) break;
    }
    return Array.from(bySection.values());
  }, [pageCommands]);
  const quickAccessItems = useMemo<PaletteItem[]>(
    () => [
      {
        id: 'quick-dashboard',
        title: 'Dashboard',
        subtitle: 'Open provider mission control',
        icon: <AutoAwesomeRoundedIcon fontSize="small" />,
        group: 'Action',
        onSelect: () => navigateWithRouter('/faithhub/provider/dashboard'),
      },
      {
        id: 'quick-live',
        title: 'Live Dashboard',
        subtitle: 'Open active stream operations',
        icon: <SearchRoundedIcon fontSize="small" />,
        group: 'Action',
        onSelect: () => navigateWithRouter('/faithhub/provider/live-dashboard'),
      },
      {
        id: 'quick-teachings',
        title: 'Teachings',
        subtitle: 'Open teachings workflow board',
        icon: <AutoStoriesRoundedIcon fontSize="small" />,
        group: 'Action',
        onSelect: () => navigateWithRouter('/faithhub/provider/teachings-dashboard'),
      },
      {
        id: 'quick-profile',
        title: 'Profile Settings',
        subtitle: 'Open workspace and profile setup',
        icon: <EditNoteRoundedIcon fontSize="small" />,
        group: 'Action',
        onSelect: () => navigateWithRouter('/faithhub/provider/profile-settings'),
      },
    ],
    [],
  );
  const actionLimit = hasQuery ? 5 : 4;
  const pageLimit = hasQuery ? 10 : 8;
  const displayedActionCommands = useMemo(
    () => actionCommands.slice(0, actionLimit),
    [actionCommands, actionLimit],
  );
  const displayedPageCommands = useMemo(
    () => (showAllPages ? pageCommands : pageCommands.slice(0, pageLimit)),
    [pageCommands, pageLimit, showAllPages],
  );
  const displayedCommands = useMemo(
    () => [...displayedActionCommands, ...displayedPageCommands],
    [displayedActionCommands, displayedPageCommands],
  );
  const filteredCommands = useMemo(() => {
    if (activeFilter === 'actions') return displayedCommands.filter((item) => item.group === 'Action');
    if (activeFilter === 'pages') return displayedCommands.filter((item) => item.group === 'Page');
    if (activeFilter === 'recent') return recentCommands;
    return displayedCommands;
  }, [activeFilter, displayedCommands, recentCommands]);

  useEffect(() => {
    if (!filteredCommands.length) {
      if (highlightIndex !== 0) setHighlightIndex(0);
      return;
    }
    if (highlightIndex >= filteredCommands.length) {
      setHighlightIndex(0);
    }
  }, [filteredCommands, highlightIndex]);

  useEffect(() => {
    setHighlightIndex(0);
    setShowAllPages(false);
    setActiveFilter('all');
  }, [normalizedQuery, open]);

  useEffect(() => {
    if (!open) return;
    setIsLoadingResults(true);
    const timer = window.setTimeout(() => setIsLoadingResults(false), 180);
    return () => window.clearTimeout(timer);
  }, [activeFilter, normalizedQuery, open]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(RECENT_COMMANDS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed)) setRecentIds(parsed.filter((item) => typeof item === 'string').slice(0, 5));
    } catch {
      // no-op
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const rafId = requestAnimationFrame(() => {
      inputRef.current?.focus();
      // iOS/Android keyboards can miss the first frame focus after overlays mount.
      window.setTimeout(() => inputRef.current?.focus(), 60);
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [open]);

  useEffect(() => {
    if (open) return;
    returnFocusEl?.focus();
  }, [open, returnFocusEl]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const rememberRecent = (id: string) => {
    setRecentIds((prev) => {
      const next = [id, ...prev.filter((entry) => entry !== id)].slice(0, 5);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(RECENT_COMMANDS_KEY, JSON.stringify(next));
      }
      return next;
    });
  };

  const visibleActionCommands = useMemo(
    () => displayedActionCommands.filter(() => activeFilter === 'all' || activeFilter === 'actions'),
    [activeFilter, displayedActionCommands],
  );
  const visiblePageCommands = useMemo(
    () => displayedPageCommands.filter(() => activeFilter === 'all' || activeFilter === 'pages'),
    [activeFilter, displayedPageCommands],
  );

  return (
    <Backdrop
      open={open}
      onClick={onClose}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 2,
        bgcolor: 'rgba(2, 8, 23, 0.2)',
        p: { xs: 1, md: 2 },
      }}
    >
      <ClickAwayListener onClickAway={onClose}>
        <Grow in={open} timeout={{ enter: 180, exit: 120 }}>
          <Box
            role="dialog"
            aria-modal="true"
            aria-label="Search and commands"
            onClick={(event) => event.stopPropagation()}
            sx={{
              width: { xs: '100%', md: 920, lg: 980 },
              maxWidth: '100%',
              maxHeight: { xs: 'calc(100vh - 8px)', md: 'min(82vh, 760px)' },
              borderRadius: { xs: 2, md: 4 },
              border: '1px solid',
              borderColor: 'var(--fh-line)',
              bgcolor: 'var(--fh-surface-bg)',
              boxShadow: '0 28px 50px -32px rgba(15, 23, 42, 0.62)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transformOrigin: 'center top',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                px: { xs: 1.6, md: 2.3 },
                pt: 1.25,
                pb: 1.15,
                borderBottom: '1px solid',
                borderColor: 'var(--fh-line)',
                gap: 1.2,
              }}
            >
              <TextField
                inputRef={inputRef}
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                onKeyDown={(event) => {
                  if (!filteredCommands.length) {
                    if (event.key === 'Escape') onClose();
                    return;
                  }
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    setHighlightIndex((prev) => (prev + 1) % filteredCommands.length);
                  } else if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    setHighlightIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
                  } else if (event.key === 'Enter') {
                    event.preventDefault();
                    const selected = filteredCommands[highlightIndex];
                    if (selected) {
                      rememberRecent(selected.id);
                      selected.onSelect();
                    }
                    onClose();
                  } else if (event.key === 'Escape') {
                    event.preventDefault();
                    onClose();
                  }
                }}
                placeholder="Search commands, teachings, and shortcuts"
                fullWidth
                size="small"
                inputProps={{ 'aria-label': 'Search commands and teachings' }}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ display: 'grid', placeItems: 'center', mr: 1, color: 'var(--fh-slate)' }}>
                      <SearchRoundedIcon sx={{ fontSize: 18 }} />
                    </Box>
                  ),
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ whiteSpace: 'nowrap', display: { xs: 'none', sm: 'inline' } }}
              >
                Use Up/Down + Enter
              </Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.7}
              sx={{
                px: { xs: 1.6, md: 2.3 },
                py: 0.8,
                borderBottom: '1px solid',
                borderColor: 'var(--fh-line)',
                overflowX: 'auto',
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': { height: 5 },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  color: 'var(--fh-slate)',
                  letterSpacing: '0.08em',
                  pr: 0.3,
                  whiteSpace: 'nowrap',
                }}
              >
                SHORTCUTS
              </Typography>
              {teachingsQuickActions.map((action) => (
                <Box
                  key={action.key}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    navigateWithRouter(action.route);
                    onClose();
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      navigateWithRouter(action.route);
                      onClose();
                    }
                  }}
                  sx={{
                    px: 1,
                    py: 0.35,
                    borderRadius: 999,
                    border: '1px solid',
                    borderColor: 'var(--fh-line)',
                    bgcolor: 'color-mix(in srgb, var(--fh-surface) 84%, var(--fh-surface-bg) 16%)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.65,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'transform 140ms ease, box-shadow 160ms ease, border-color 160ms ease',
                    '&:hover': {
                      borderColor: 'var(--fh-brand)',
                      boxShadow: '0 8px 16px -14px rgba(15, 23, 42, 0.55)',
                      transform: 'translateY(-1px)',
                    },
                    '&:focus-visible': {
                      outline: '2px solid var(--fh-brand)',
                      outlineOffset: 2,
                    },
                  }}
                >
                  <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: 'var(--fh-ink)' }}>{action.label}</Typography>
                  <Box
                    component="kbd"
                    sx={{
                      px: 0.55,
                      py: 0.1,
                      borderRadius: 0.8,
                      border: '1px solid',
                      borderColor: 'var(--fh-line)',
                      bgcolor: 'var(--fh-surface-bg)',
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                      fontSize: 10.5,
                      fontWeight: 700,
                      letterSpacing: '0.01em',
                      color: 'var(--fh-slate)',
                    }}
                  >
                    {action.shortcut}
                  </Box>
                </Box>
              ))}
            </Stack>

            <Box sx={{ px: { xs: 1, md: 1.5 }, py: { xs: 1.2, md: 1.5 }, overflowY: 'auto' }}>
              <Stack direction="row" spacing={0.7} sx={{ px: 1.2, pb: 1.1, flexWrap: 'wrap' }}>
                {[
                  { key: 'all', label: 'All' },
                  { key: 'actions', label: 'Actions' },
                  { key: 'pages', label: 'Pages' },
                  { key: 'recent', label: 'Recent' },
                ].map((item) => (
                  <Box
                    key={item.key}
                    role="button"
                    tabIndex={0}
                    aria-label={`Filter ${item.label}`}
                    onClick={() => {
                      setActiveFilter(item.key as SearchFilter);
                      setHighlightIndex(0);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setActiveFilter(item.key as SearchFilter);
                        setHighlightIndex(0);
                      }
                    }}
                    sx={{
                      px: 1,
                      py: 0.45,
                      borderRadius: 999,
                      border: '1px solid',
                      borderColor: activeFilter === item.key ? 'var(--fh-brand)' : 'var(--fh-line)',
                      bgcolor:
                        activeFilter === item.key
                          ? 'color-mix(in srgb, var(--fh-brand-soft) 38%, var(--fh-surface-bg) 62%)'
                          : 'transparent',
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {item.label}
                  </Box>
                ))}
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ px: 1.2, pb: 0.8, fontWeight: 700 }}>
                {hasQuery ? 'Searching commands...' : 'Quick commands'}
              </Typography>
              <Typography
                aria-live="polite"
                sx={{ px: 1.2, pb: 0.8, fontSize: 11, color: 'var(--fh-slate)' }}
              >
                {filteredCommands.length === 0
                  ? 'No results for the current filter.'
                  : `${filteredCommands.length} result${filteredCommands.length === 1 ? '' : 's'} available.`}
              </Typography>

              {!hasQuery ? (
                <Box sx={{ px: 1.2, pb: 1.2 }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 800, color: 'var(--fh-slate)', letterSpacing: '0.08em', pb: 0.6 }}>
                    QUICK ACCESS
                  </Typography>
                  <Stack direction="row" spacing={0.7} sx={{ flexWrap: 'wrap' }}>
                    {quickAccessItems.map((item) => (
                      <Box
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        aria-label={`Quick access ${item.title}`}
                        onClick={() => {
                          item.onSelect();
                          onClose();
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            item.onSelect();
                            onClose();
                          }
                        }}
                        sx={{
                          px: 1.1,
                          py: 0.55,
                          borderRadius: 1.6,
                          border: '1px solid',
                          borderColor: 'var(--fh-line)',
                          bgcolor: 'var(--fh-surface)',
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {item.title}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              ) : null}

              {!hasQuery && recentCommands.length > 0 ? (
                <Box sx={{ px: 1.2, pb: 1 }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 800, color: 'var(--fh-slate)', letterSpacing: '0.08em' }}>
                    RECENT
                  </Typography>
                  <List sx={{ py: 0, mt: 0.4 }}>
                    {recentCommands.map((command) => {
                      return (
                        <ListItemButton
                          key={`recent-${command.id}`}
                          onClick={() => {
                            rememberRecent(command.id);
                            command.onSelect();
                            onClose();
                          }}
                          selected={false}
                          sx={{
                            borderRadius: 2,
                            mb: 0.5,
                            border: '1px solid',
                            borderColor: 'var(--fh-line)',
                            bgcolor: 'transparent',
                          }}
                        >
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              mr: 1.2,
                              borderRadius: 1.5,
                              display: 'grid',
                              placeItems: 'center',
                              ...getIconContainerSx(command.group),
                              border: '1px solid',
                            }}
                          >
                            {command.icon}
                          </Box>
                          <ListItemText
                            primary={command.title}
                            secondary={`${command.group} - ${command.subtitle}`}
                            primaryTypographyProps={{ fontSize: 14, fontWeight: 700 }}
                            secondaryTypographyProps={{ fontSize: 12 }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Box>
              ) : null}

              {!hasQuery && discoverCommands.length > 0 ? (
                <>
                  <Box sx={{ px: 1.2, pb: 0.5 }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 800, color: 'var(--fh-slate)', letterSpacing: '0.08em' }}>
                      SMART DISCOVERY
                    </Typography>
                  </Box>
                  <List sx={{ py: 0, pb: 1 }}>
                    {discoverCommands.map((command) => (
                      <ListItemButton
                        key={`discover-${command.id}`}
                        onClick={() => {
                          rememberRecent(command.id);
                          command.onSelect();
                          onClose();
                        }}
                        sx={{
                          borderRadius: 2,
                          mb: 0.5,
                          border: '1px solid',
                          borderColor: 'var(--fh-line)',
                        }}
                      >
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            mr: 1.2,
                            borderRadius: 1.5,
                            display: 'grid',
                            placeItems: 'center',
                            ...getIconContainerSx(command.group),
                            border: '1px solid',
                          }}
                        >
                          {command.icon}
                        </Box>
                        <ListItemText
                          primary={command.title}
                          secondary={`Discover - ${command.subtitle}`}
                          primaryTypographyProps={{ fontSize: 14, fontWeight: 700 }}
                          secondaryTypographyProps={{ fontSize: 12 }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </>
              ) : null}

              <Box sx={{ px: 1.2, pb: 0.5 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 800, color: 'var(--fh-slate)', letterSpacing: '0.08em' }}>
                  ACTIONS
                </Typography>
              </Box>
              {isLoadingResults ? (
                <Box sx={{ px: 1.2, pb: 0.8 }} aria-label="Search loading state">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={`action-skeleton-${index}`} variant="rounded" height={44} sx={{ mb: 0.6 }} />
                  ))}
                </Box>
              ) : (
              <List sx={{ py: 0 }}>
                {visibleActionCommands.map((command) => {
                  const index = filteredCommands.findIndex((item) => item.id === command.id);
                  return (
                  <ListItemButton
                    key={command.id}
                    onClick={() => {
                      rememberRecent(command.id);
                      command.onSelect();
                      onClose();
                    }}
                    selected={highlightIndex === index}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      border: '1px solid',
                      borderColor: highlightIndex === index ? 'var(--fh-brand)' : 'var(--fh-line)',
                      bgcolor:
                        highlightIndex === index
                          ? 'color-mix(in srgb, var(--fh-brand-soft) 34%, var(--fh-surface-bg) 66%)'
                          : 'transparent',
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        mr: 1.2,
                        borderRadius: 1.5,
                        display: 'grid',
                        placeItems: 'center',
                        ...getIconContainerSx(command.group),
                        border: '1px solid',
                      }}
                    >
                      {command.icon}
                    </Box>
                    <ListItemText
                      primary={command.title}
                      secondary={`${command.group} - ${command.subtitle}`}
                      primaryTypographyProps={{ fontSize: 14, fontWeight: 700 }}
                      secondaryTypographyProps={{ fontSize: 12 }}
                    />
                  </ListItemButton>
                  );
                })}
                {(activeFilter === 'actions' || activeFilter === 'all') && visibleActionCommands.length === 0 ? (
                  <Box sx={{ px: 1.2, py: 1.2 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'var(--fh-slate)' }}>
                      No actions matched. Try terms like "create", "review", or "publish".
                    </Typography>
                  </Box>
                ) : null}
              </List>
              )}

              <Box sx={{ px: 1.2, pt: 0.8, pb: 0.5 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 800, color: 'var(--fh-slate)', letterSpacing: '0.08em' }}>
                  PAGES
                </Typography>
              </Box>
              {isLoadingResults ? (
                <Box sx={{ px: 1.2, pb: 0.8 }} aria-label="Search loading state">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={`page-skeleton-${index}`} variant="rounded" height={44} sx={{ mb: 0.6 }} />
                  ))}
                </Box>
              ) : (
              <List sx={{ py: 0 }}>
                {visiblePageCommands.map((command) => {
                  const index = filteredCommands.findIndex((item) => item.id === command.id);
                  return (
                    <ListItemButton
                      key={command.id}
                      onClick={() => {
                        rememberRecent(command.id);
                        command.onSelect();
                        onClose();
                      }}
                      selected={highlightIndex === index}
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        border: '1px solid',
                        borderColor: highlightIndex === index ? 'var(--fh-brand)' : 'var(--fh-line)',
                        bgcolor:
                          highlightIndex === index
                            ? 'color-mix(in srgb, var(--fh-brand-soft) 34%, var(--fh-surface-bg) 66%)'
                            : 'transparent',
                      }}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          mr: 1.2,
                          borderRadius: 1.5,
                          display: 'grid',
                          placeItems: 'center',
                          ...getIconContainerSx(command.group),
                          border: '1px solid',
                        }}
                      >
                        {command.icon}
                      </Box>
                      <ListItemText
                        primary={command.title}
                        secondary={`${command.group} - ${command.subtitle}`}
                        primaryTypographyProps={{ fontSize: 14, fontWeight: 700 }}
                        secondaryTypographyProps={{ fontSize: 12 }}
                      />
                    </ListItemButton>
                  );
                })}
                {(activeFilter === 'pages' || activeFilter === 'all') && visiblePageCommands.length === 0 ? (
                  <Box sx={{ px: 1.2, py: 1.2 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'var(--fh-slate)' }}>
                      No pages found for this filter. Try a broader keyword or switch to All.
                    </Typography>
                  </Box>
                ) : null}
              </List>
              )}
              {!showAllPages && pageCommands.length > displayedPageCommands.length ? (
                <Box sx={{ px: 1.2, pt: 0.5 }}>
                  <ListItemButton
                    onClick={() => setShowAllPages(true)}
                    sx={{
                      borderRadius: 2,
                      border: '1px dashed',
                      borderColor: 'var(--fh-line)',
                      minHeight: 40,
                    }}
                  >
                    <ListItemText
                      primary={`Show more pages (${pageCommands.length - displayedPageCommands.length})`}
                      primaryTypographyProps={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: 'var(--fh-slate)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    />
                  </ListItemButton>
                </Box>
              ) : null}
              {!filteredCommands.length ? (
                <Box sx={{ px: 2, py: 2, textAlign: 'center' }}>
                  <SearchRoundedIcon sx={{ fontSize: 30, color: 'var(--fh-slate)' }} />
                  <Typography sx={{ mt: 0.8, fontWeight: 700 }}>
                    {activeFilter === 'recent' ? 'No recent searches yet' : 'No matching commands'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                    {activeFilter === 'recent'
                      ? 'Open a command to populate your quick recent list.'
                      : 'Try "create", "draft", or a teaching title keyword.'}
                  </Typography>
                </Box>
              ) : null}
            </Box>
          </Box>
        </Grow>
      </ClickAwayListener>
    </Backdrop>
  );
}
