import { useMemo, useState } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Link as RouterLink } from 'react-router-dom';
import { providerPages } from '@/navigation/providerPages';

export function SearchCommandDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pages = providerPages.filter((page) => !page.hidden);
    if (!q) {
      return pages.slice(0, 14);
    }
    return pages.filter((page) => {
      return (
        page.title.toLowerCase().includes(q) ||
        page.section.toLowerCase().includes(q) ||
        page.description.toLowerCase().includes(q) ||
        page.id?.toLowerCase().includes(q)
      );
    });
  }, [query]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogContent sx={{ p: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3, pt: 2.5, pb: 1.5 }}>
          <Box>
            <Typography variant="h6" fontWeight={800}>
              Jump to a Provider page
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Search across every attached FaithHub Provider screen.
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseRoundedIcon />
          </IconButton>
        </Stack>

        <Box sx={{ px: 3, pb: 2 }}>
          <TextField
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            fullWidth
            placeholder="Search pages, sections, or IDs…"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <List sx={{ px: 1.5, pb: 2, maxHeight: 520, overflowY: 'auto' }}>
          {results.map((page) => {
            const Icon = page.icon;
            return (
              <ListItemButton
                key={page.key}
                component={RouterLink}
                to={page.path}
                onClick={onClose}
                sx={{ mb: 0.75, borderRadius: 3, alignItems: 'flex-start' }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'primary.main', mt: 0.25 }}>
                  <Icon size={18} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Typography fontWeight={700}>{page.title}</Typography>
                      {page.id ? (
                        <Typography variant="caption" color="text.secondary">
                          {page.id}
                        </Typography>
                      ) : null}
                    </Stack>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                        {page.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {page.section}
                      </Typography>
                    </>
                  }
                />
              </ListItemButton>
            );
          })}
          {!results.length ? (
            <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
              <Typography fontWeight={700}>No matches found.</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Try a page title like “Live Studio” or a section like “Beacon”.
              </Typography>
            </Box>
          ) : null}
        </List>
      </DialogContent>
    </Dialog>
  );
}
