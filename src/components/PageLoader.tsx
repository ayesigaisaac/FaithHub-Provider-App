import { Box, CircularProgress, Stack, Typography } from '@mui/material';

export function PageLoader({ title = 'Loading page…' }: { title?: string }) {
  return (
    <Box className="page-surface" sx={{ p: 4 }}>
      <Stack spacing={2} alignItems="center" justifyContent="center" minHeight={260}>
        <CircularProgress color="primary" />
        <Typography variant="body1" color="text.secondary">
          {title}
        </Typography>
      </Stack>
    </Box>
  );
}
