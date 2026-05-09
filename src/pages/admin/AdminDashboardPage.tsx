import { Box, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { useAuth } from '@/auth/useAuth';

export default function AdminDashboardPage() {
  const { user, role, permissions } = useAuth();

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="overline" color="primary.main" fontWeight={800}>
          Admin Console
        </Typography>
        <Typography variant="h4" fontWeight={800}>
          Workspace Administration
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Frontend admin surface for role-gated operations and moderation controls baseline.
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Session Identity
                </Typography>
                <Typography variant="body2">User: {user?.name || 'Unknown'}</Typography>
                <Typography variant="body2">Email: {user?.email || 'Unknown'}</Typography>
                <Typography variant="body2">Role: {role || 'Unknown'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Granted Permissions
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {permissions.map((permission) => (
                    <Chip key={permission} label={permission} size="small" />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}

