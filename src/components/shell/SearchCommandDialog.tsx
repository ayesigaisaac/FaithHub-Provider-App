import {
  Backdrop,
  Box,
  ClickAwayListener,
  Grow,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { navigateWithRouter } from '@/navigation/routerNavigate';
import { providerPages } from '@/navigation/providerPages';

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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const hasQuery = Boolean(query.trim());
  const normalizedQuery = query.trim().toLowerCase();

  const commands = useMemo<PaletteItem[]>(() => {
    const actionItems: PaletteItem[] = [
      {
        id: 'create-teaching',
        title: 'Create teaching',
        subtitle: 'Start a new teaching workflow',
        icon: <AddRoundedIcon fontSize="small" />,
        group: 'Action',
        section: 'Actions',
        description: 'Start a new teaching workflow',
        keywords: 'new teaching create sermon',
        onSelect: () => navigateWithRouter('/faithhub/provider/teachings-dashboard'),
      },
      {
        id: 'open-last-draft',
        title: 'Open last draft',
        subtitle: 'Jump back to your most recent draft',
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
        icon: <SearchRoundedIcon fontSize="small" />,
        group: 'Action',
        section: 'Actions',
        description: 'Search teachings by title',
        keywords: 'search find title teachings',
        onSelect: () => navigateWithRouter('/faithhub/provider/teachings-dashboard'),
      },
      {
        id: 'open-workflow',
        title: 'Open workflow dashboard',
        subtitle: 'Continue editing, drafts, and publishing',
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
        icon: <SearchRoundedIcon fontSize="small" />,
        group: 'Page',
        section: page.section,
        description: page.description,
        keywords: `${page.title} ${page.shortTitle ?? ''} ${page.description} ${page.id ?? ''} ${page.path} ${(page.aliases ?? []).join(' ')}`,
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

  useEffect(() => {
    setHighlightIndex(0);
  }, [normalizedQuery, open]);

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
    requestAnimationFrame(() => inputRef.current?.focus());
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
                  if (!commands.length) {
                    if (event.key === 'Escape') onClose();
                    return;
                  }
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    setHighlightIndex((prev) => (prev + 1) % commands.length);
                  } else if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    setHighlightIndex((prev) => (prev - 1 + commands.length) % commands.length);
                  } else if (event.key === 'Enter') {
                    event.preventDefault();
                    const selected = commands[highlightIndex];
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
                placeholder="Search commands and teachings"
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

            <Box sx={{ px: { xs: 1, md: 1.5 }, py: { xs: 1.2, md: 1.5 }, overflowY: 'auto' }}>
              <Typography variant="body2" color="text.secondary" sx={{ px: 1.2, pb: 0.8, fontWeight: 700 }}>
                {hasQuery ? 'Searching commands...' : 'Quick commands'}
              </Typography>

              {!hasQuery && recentCommands.length > 0 ? (
                <Box sx={{ px: 1.2, pb: 1 }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 800, color: 'var(--fh-slate)', letterSpacing: '0.08em' }}>
                    RECENT
                  </Typography>
                  <List sx={{ py: 0, mt: 0.4 }}>
                    {recentCommands.map((command) => {
                      const commandIndex = commands.findIndex((item) => item.id === command.id);
                      return (
                        <ListItemButton
                          key={`recent-${command.id}`}
                          onClick={() => {
                            rememberRecent(command.id);
                            command.onSelect();
                            onClose();
                          }}
                          selected={highlightIndex === commandIndex}
                          sx={{
                            borderRadius: 2,
                            mb: 0.5,
                            border: '1px solid',
                            borderColor: highlightIndex === commandIndex ? 'var(--fh-brand)' : 'var(--fh-line)',
                            bgcolor:
                              highlightIndex === commandIndex
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
                              color: 'var(--fh-slate)',
                              bgcolor: 'var(--fh-surface)',
                              border: '1px solid',
                              borderColor: 'var(--fh-line)',
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

              <Box sx={{ px: 1.2, pb: 0.5 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 800, color: 'var(--fh-slate)', letterSpacing: '0.08em' }}>
                  ACTIONS
                </Typography>
              </Box>
              <List sx={{ py: 0 }}>
                {actionCommands.map((command) => {
                  const index = commands.findIndex((item) => item.id === command.id);
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
                        color: 'var(--fh-slate)',
                        bgcolor: 'var(--fh-surface)',
                        border: '1px solid',
                        borderColor: 'var(--fh-line)',
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

              <Box sx={{ px: 1.2, pt: 0.8, pb: 0.5 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 800, color: 'var(--fh-slate)', letterSpacing: '0.08em' }}>
                  PAGES
                </Typography>
              </Box>
              <List sx={{ py: 0 }}>
                {pageCommands.map((command) => {
                  const index = commands.findIndex((item) => item.id === command.id);
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
                          color: 'var(--fh-slate)',
                          bgcolor: 'var(--fh-surface)',
                          border: '1px solid',
                          borderColor: 'var(--fh-line)',
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
              {!commands.length ? (
                <Box sx={{ px: 2, py: 2, textAlign: 'center' }}>
                  <SearchRoundedIcon sx={{ fontSize: 30, color: 'var(--fh-slate)' }} />
                  <Typography sx={{ mt: 0.8, fontWeight: 700 }}>No matching commands</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                    Try "create", "draft", or a teaching title keyword.
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
