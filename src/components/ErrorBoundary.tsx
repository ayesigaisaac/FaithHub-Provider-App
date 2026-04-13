import React from 'react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; label?: string },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false, error: undefined as Error | undefined };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('FaithHub route render error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box className="page-surface" sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight={800}>
              This page hit a render error.
            </Typography>
            <Alert severity="error">
              {this.props.label ? `${this.props.label} failed to render.` : 'A page failed to render.'}
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Reload the page or move to another workspace page. The app shell stays alive so one broken page does not take down the whole provider workspace.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant="contained" onClick={() => window.location.reload()}>
                Reload page
              </Button>
              <Button variant="outlined" onClick={() => window.history.back()}>
                Go back
              </Button>
            </Stack>
          </Stack>
        </Box>
      );
    }
    return this.props.children;
  }
}
