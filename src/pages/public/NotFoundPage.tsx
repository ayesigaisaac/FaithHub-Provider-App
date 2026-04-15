import { Box, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { usePageTitle } from '@/hooks/usePageTitle';
import { ThemeModeToggle } from '@/components/theme/ThemeModeToggle';

export default function NotFoundPage() {
  usePageTitle('Page not found');

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', px: 2 }}>
      <Box sx={{ position: 'fixed', top: 16, right: 16 }}>
        <ThemeModeToggle />
      </Box>
      <Box className="page-surface" sx={{ p: { xs: 3, md: 5 }, maxWidth: 720, textAlign: 'center' }}>
        <Typography variant="overline" color="primary.main" fontWeight={800}>
          FaithHub Provider App
        </Typography>
        <Typography variant="h3" sx={{ mt: 1 }}>
          That route does not exist yet.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5 }}>
          The workspace is wired to every attached Provider page, but this specific path was not part of the imported screen set.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center" sx={{ mt: 3 }}>
          <Button component={RouterLink} to="/faithhub/provider/dashboard" variant="contained">
            Open dashboard
          </Button>
          <Button component={RouterLink} to="/" variant="outlined">
            Go to landing page
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
