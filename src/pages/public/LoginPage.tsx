import {
  Collapse,
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
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
  const { login, loginWithGoogle, loading, setWorkspace, isAuthenticated } = useAuth();
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
  const [workspaceExpanded, setWorkspaceExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const isDev = import.meta.env.DEV;

  const from = useMemo(() => {
    const state = location.state as { from?: string } | undefined;
    return resolveSafeRedirect(state?.from);
  }, [location.state]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [from, isAuthenticated, navigate]);

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
  const emailValue = email.trim();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
  const passwordValid = password.length >= 8;
  const canSubmit = emailValid && passwordValid && !loading;
  const googleBusy = loading || googleLoading;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        bgcolor: '#eff1f5',
        px: 2,
        py: 3,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          boxShadow: '0 10px 35px rgba(15, 23, 42, 0.1)',
          p: { xs: 2.25, sm: 3.5 },
        }}
      >
        <Stack spacing={1.6} component="form" onSubmit={onSubmit}>
          <Stack spacing={1} alignItems="center" textAlign="center">
            <Box sx={{ mb: 0.8 }}>
              <BrandLogo variant="landscape" alt="FaithHub Provider" style={{ height: 56, width: 'auto', maxWidth: '100%' }} />
            </Box>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  bgcolor: '#e7e8ec',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <HomeRoundedIcon sx={{ color: '#131722', fontSize: 24 }} />
              </Box>
              <Typography variant="h4" fontWeight={700} color="text.primary">
                FaithHub
              </Typography>
            </Stack>
            <Typography variant="subtitle2" fontWeight={700}>
              Log in to continue
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Provider workspace access
            </Typography>
            {isDev ? (
              <Typography variant="caption" color="text.secondary">
                Mock: `leadership@faithhub.dev` / `password123`
              </Typography>
            ) : null}
          </Stack>

          {error ? <Alert severity="error">{error}</Alert> : null}

          <TextField
            label="Email"
            type="email"
            size="small"
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
            size="small"
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
            label="Remember me"
          />

          <Button
            variant="contained"
            type="submit"
            size="large"
            disabled={!canSubmit}
            sx={{ textTransform: 'none', fontWeight: 700, py: 1.2 }}
          >
            {loading ? 'Signing in...' : 'Continue'}
          </Button>

          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ pt: 0.5 }}>
            Or continue with:
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            data-no-auto-action="true"
            sx={{ textTransform: 'none', fontWeight: 700 }}
            disabled={googleBusy}
            onClick={async () => {
              setError(null);
              setGoogleLoading(true);
              try {
                await loginWithGoogle();
                navigate(from, { replace: true });
              } catch (err) {
                const message = err instanceof Error ? err.message : 'Google sign-in failed.';
                const normalized = message.toLowerCase();
                const readableMessage =
                  normalized.includes('network') || normalized.includes('fetch')
                    ? 'Google sign-in failed due to network issues. Try again.'
                    : normalized.includes('unavailable')
                      ? 'Google sign-in is temporarily unavailable for this workspace.'
                      : message;
                setError(readableMessage);
              } finally {
                setGoogleLoading(false);
              }
            }}
          >
            {googleBusy ? 'Connecting to Google...' : 'Continue with Google'}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            data-no-auto-action="true"
            sx={{ textTransform: 'none', fontWeight: 700 }}
            onClick={() => setError('Microsoft SSO is not enabled for this workspace yet.')}
          >
            Continue with Microsoft
          </Button>

          <Divider sx={{ my: 0.5 }} />

          <Button
            variant="text"
            size="small"
            onClick={() => setWorkspaceExpanded((prev) => !prev)}
            sx={{ justifyContent: 'center', textTransform: 'none', fontWeight: 700 }}
          >
            {workspaceExpanded ? 'Hide workspace options' : 'Workspace options'}
          </Button>

          <Collapse in={workspaceExpanded}>
            <Stack spacing={1.2}>
              <TextField
                select
                size="small"
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
                size="small"
                label="Brand"
                value={workspace.brand}
                onChange={(e) => setWorkspaceDraft((prev) => ({ ...prev, brand: e.target.value }))}
                disabled={loading}
              >
                <MenuItem value="FaithHub">FaithHub</MenuItem>
                <MenuItem value="FaithHub Plus">FaithHub Plus</MenuItem>
              </TextField>
            </Stack>
          </Collapse>

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: -0.2 }}>
            <Typography variant="caption" color="text.secondary">
              Campus: {workspace.campus} • Brand: {workspace.brand}
            </Typography>
            <Button
              variant="text"
              size="small"
              data-no-auto-action="true"
              sx={{ textTransform: 'none', fontWeight: 700 }}
              onClick={() => setError('Password reset is managed by your workspace administrator.')}
            >
              Can&apos;t log in?
            </Button>
          </Stack>

          <Typography variant="caption" color="text.secondary" textAlign="center">
            FaithHub Provider • Secure sign-in
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
