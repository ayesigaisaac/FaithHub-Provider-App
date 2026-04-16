import { Alert, Box, Button, Card, CardContent, Container, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import type { WorkspaceContext } from '@/auth/types';

export default function LoginPage() {
  const { login, loading, setWorkspace, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('leadership@faithhub.dev');
  const [password, setPassword] = useState('password123');
  const [workspace, setWorkspaceDraft] = useState<WorkspaceContext>({
    campus: 'Kampala Central',
    brand: 'FaithHub',
  });
  const [error, setError] = useState<string | null>(null);

  const from = useMemo(() => {
    const state = location.state as { from?: string } | undefined;
    return state?.from || '/faithhub/provider/dashboard';
  }, [location.state]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/faithhub/provider/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      await login({ email, password });
      setWorkspace(workspace);
      navigate(from, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to login.';
      setError(message);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: '#f3f4f6' }}>
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 3, border: '1px solid #e5e7eb', boxShadow: '0 16px 48px rgba(15, 23, 42, 0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={2.25} component="form" onSubmit={onSubmit}>
              <Box>
                <Typography variant="overline" color="primary.main" fontWeight={800}>
                  FaithHub Provider
                </Typography>
                <Typography variant="h4" fontWeight={800}>
                  Sign in
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Use mock users like `leadership@faithhub.dev` with password `password123`.
                </Typography>
              </Box>

              {error ? <Alert severity="error">{error}</Alert> : null}

              <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

              <TextField
                select
                label="Campus"
                value={workspace.campus}
                onChange={(e) => setWorkspaceDraft((prev) => ({ ...prev, campus: e.target.value }))}
              >
                <MenuItem value="Kampala Central">Kampala Central</MenuItem>
                <MenuItem value="East Campus">East Campus</MenuItem>
                <MenuItem value="Online Studio">Online Studio</MenuItem>
              </TextField>

              <TextField
                select
                label="Brand"
                value={workspace.brand}
                onChange={(e) => setWorkspaceDraft((prev) => ({ ...prev, brand: e.target.value }))}
              >
                <MenuItem value="FaithHub">FaithHub</MenuItem>
                <MenuItem value="FaithHub Plus">FaithHub Plus</MenuItem>
              </TextField>

              <Button type="submit" variant="contained" size="large" disabled={loading}>
                {loading ? 'Signing in...' : 'Login'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
