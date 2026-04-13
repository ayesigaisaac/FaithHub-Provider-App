import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { providerPages, providerSections, getProviderPagesBySection, findProviderPageByPath } from '@/navigation/providerPages';

const drawerWidth = 320;

export function ProviderSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation();
  const current = findProviderPageByPath(location.pathname);
  const [query, setQuery] = useState('');

  const filteredPages = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return providerPages.filter((page) => !page.hidden);
    return providerPages.filter(
      (page) =>
        !page.hidden &&
        (page.title.toLowerCase().includes(q) ||
          page.section.toLowerCase().includes(q) ||
          page.description.toLowerCase().includes(q) ||
          page.id?.toLowerCase().includes(q)),
    );
  }, [query]);

  const content = (
    <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
      <Stack spacing={2} sx={{ p: 2.25, pb: 1.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar src="/assets/logo.svg" alt="FaithHub" sx={{ width: 48, height: 48, borderRadius: 2.5 }} />
          <Box minWidth={0}>
            <Typography variant="h6" fontWeight={800} noWrap>
              FaithHub Provider
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              Vite + React + TypeScript workspace
            </Typography>
          </Box>
        </Stack>

        <Box className="command-panel" sx={{ p: 1.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Box>
              <Typography variant="body2" fontWeight={700}>
                Central Campus
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Verified provider workspace
              </Typography>
            </Box>
            <Chip label="Live ready" color="success" variant="outlined" size="small" />
          </Stack>
        </Box>

        <TextField
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter pages…"
          size="small"
          InputProps={{
            startAdornment: <SearchRoundedIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Stack>

      <Divider />

      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.5, py: 1.5 }}>
        {providerSections
          .filter((section) => getProviderPagesBySection(section).length > 0)
          .map((section) => {
            const sectionPages = query
              ? filteredPages.filter((page) => page.section === section)
              : getProviderPagesBySection(section);
            if (!sectionPages.length) return null;
            const isExpanded = current?.section === section || (!!query && sectionPages.length > 0);
            return (
              <Accordion key={section} disableGutters defaultExpanded={isExpanded} sx={{ mb: 1.25, border: '1px solid rgba(15,23,42,0.06)', borderRadius: 3, overflow: 'hidden', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                  <Typography variant="overline" fontWeight={800} letterSpacing="0.12em" color="text.secondary">
                    {section}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 1, pt: 0, pb: 1 }}>
                  <List disablePadding>
                    {sectionPages.map((page) => {
                      const Icon = page.icon;
                      const selected = page.path === location.pathname || page.aliases?.includes(location.pathname);
                      return (
                        <ListItemButton
                          key={page.key}
                          component={RouterLink}
                          to={page.path}
                          selected={selected}
                          onClick={onClose}
                          sx={{
                            mb: 0.5,
                            borderRadius: 2.5,
                            alignItems: 'flex-start',
                            '&.Mui-selected': {
                              bgcolor: 'rgba(3,205,140,0.12)',
                              color: 'text.primary',
                              '& .MuiListItemIcon-root': { color: 'primary.dark' },
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 38, color: selected ? 'primary.main' : 'text.secondary', mt: 0.15 }}>
                            <Icon size={18} />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography fontSize={14} fontWeight={700}>{page.shortTitle ?? page.title}</Typography>}
                            secondary={<Typography variant="caption" color="text.secondary">{page.id}</Typography>}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </AccordionDetails>
              </Accordion>
            );
          })}
      </Box>

      <Box sx={{ p: 2.25, pt: 1.5 }}>
        <Box className="command-panel" sx={{ p: 1.75 }}>
          <Typography fontWeight={800}>Need the original shell preview?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            The attached shell and landing prototypes are preserved inside the project as dedicated routes.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 1.5 }}>
            <Button component={RouterLink} to="/" variant="outlined" onClick={onClose}>
              Landing page
            </Button>
            <Button component={RouterLink} to="/faithhub/provider/preview-shell" variant="contained" onClick={onClose}>
              Shell preview
            </Button>
          </Stack>
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
          '& .MuiDrawer-paper': { width: drawerWidth, maxWidth: '100vw' },
        }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(15,23,42,0.08)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))',
          },
        }}
      >
        {content}
      </Drawer>
    </>
  );
}

export const providerDrawerWidth = drawerWidth;
