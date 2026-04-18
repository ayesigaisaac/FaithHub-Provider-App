import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { isKnownProviderPath } from '@/navigation/providerPages';
import type { WorkspaceContext } from '@/auth/types';

function resolveSafeRedirect(input?: string) {
  const fallback = '/faithhub/provider/dashboard';
  if (!input || typeof input !== 'string' || !input.startsWith('/')) return fallback;

  try {
    const parsed = new URL(input, 'https://faithhub.local');
    const path = parsed.pathname;
    const suffix = `${parsed.search}${parsed.hash}`;

    if (path === '/faithhub/provider') return `${fallback}${suffix}`;
    if (path === '/dashboard-ui' || path === '/faithhub/home-landing') return `${path}${suffix}`;
    if (isKnownProviderPath(path)) return `${path}${suffix}`;
  } catch {
    return fallback;
  }

  return fallback;
}

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
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const from = useMemo(() => {
    const state = location.state as { from?: string } | undefined;
    return resolveSafeRedirect(state?.from);
  }, [location.state]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/faithhub/provider/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const nextFieldErrors: { email?: string; password?: string } = {};
    const emailValue = email.trim();
    if (!emailValue) {
      nextFieldErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      nextFieldErrors.email = 'Enter a valid email address.';
    }

    if (!password) {
      nextFieldErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      nextFieldErrors.password = 'Password must be at least 8 characters.';
    }

    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) return;

    try {
      await login({ email: emailValue, password, rememberMe });
      setWorkspace(workspace);
      navigate(from, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      const normalized = message.toLowerCase();
      const readableMessage =
        normalized.includes('invalid') || normalized.includes('credential')
          ? 'Invalid email or password.'
          : normalized.includes('network') || normalized.includes('fetch')
            ? 'Network issue. Check your connection and try again.'
            : message || 'Unable to sign in right now.';
      setError(readableMessage);
    }
  };

  const commonFieldProps = {
    disabled: loading,
    onFocus: () => {
      if (error) setError(null);
    },
  } as const;

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: '#f3f4f6' }}>
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 3, border: '1px solid #e5e7eb', boxShadow: '0 16px 48px rgba(15, 23, 42, 0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={2.25} component="form" onSubmit={onSubmit}>
              <Box>
                <Box sx={{ mb: 1.25 }}>
                  <BrandLogo variant="landscape" alt="FaithHub Provider" style={{ height: 70, width: 'auto', maxWidth: '100%' }} />
                </Box>
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

              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={Boolean(fieldErrors.email)}
                helperText={fieldErrors.email}
                required
                {...commonFieldProps}
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={Boolean(fieldErrors.password)}
                helperText={fieldErrors.password}
                required
                {...commonFieldProps}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword((prev) => !prev)}
                        tabIndex={-1}
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                }
                label="Remember me on this device"
              />

              <TextField
                select
                label="Campus"
                value={workspace.campus}
                onChange={(e) => setWorkspaceDraft((prev) => ({ ...prev, campus: e.target.value }))}
                disabled={loading}
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
                disabled={loading}
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
