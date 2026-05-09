import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";

export function LoadingState({ title = "Loading..." }: { title?: string }) {
  return (
    <Box sx={{ p: 4 }}>
      <Stack spacing={2} alignItems="center" justifyContent="center" minHeight={220}>
        <CircularProgress color="primary" />
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Stack>
    </Box>
  );
}

export function ErrorState({
  title = "Something went wrong",
  detail,
  onRetry,
}: {
  title?: string;
  detail?: string;
  onRetry?: () => void;
}) {
  return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        <Stack spacing={1}>
          <Typography variant="subtitle2">{title}</Typography>
          {detail ? (
            <Typography variant="body2" color="text.secondary">
              {detail}
            </Typography>
          ) : null}
          {onRetry ? (
            <Box>
              <Button size="small" variant="outlined" color="error" onClick={onRetry}>
                Retry
              </Button>
            </Box>
          ) : null}
        </Stack>
      </Alert>
    </Box>
  );
}

export function EmptyState({
  title = "No results yet",
  detail,
  actionLabel,
  onAction,
}: {
  title?: string;
  detail?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <Box sx={{ p: 4 }}>
      <Stack spacing={1.5} alignItems="center" justifyContent="center" minHeight={180} textAlign="center">
        <Typography variant="subtitle1">{title}</Typography>
        {detail ? (
          <Typography variant="body2" color="text.secondary">
            {detail}
          </Typography>
        ) : null}
        {actionLabel && onAction ? (
          <Button variant="contained" size="small" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </Stack>
    </Box>
  );
}

