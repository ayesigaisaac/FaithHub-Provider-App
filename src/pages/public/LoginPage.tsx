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
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { ThemeModeToggle } from '@/components/theme/ThemeModeToggle';
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
  const [workspaceExpanded, setWorkspaceExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const isDev = import.meta.env.DEV;

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
  const emailValue = email.trim();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
  const passwordValid = password.length >= 8;
  const canSubmit = emailValid && passwordValid && !loading;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        alignItems: 'stretch',
        bgcolor: 'background.default',
        backgroundImage: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 10% 5%, rgba(3,205,140,0.12), transparent 26%), radial-gradient(circle at 90% 0%, rgba(247,127,0,0.1), transparent 24%)'
            : 'radial-gradient(circle at 10% 5%, rgba(3,205,140,0.08), transparent 26%), radial-gradient(circle at 90% 0%, rgba(247,127,0,0.08), transparent 24%)',
        px: { xs: 0, md: 2.5 },
        py: { xs: 0, md: 2.5 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          minHeight: { xs: '100vh', md: 'calc(100vh - 40px)' },
          borderRadius: { xs: 0, md: 4 },
          overflow: 'hidden',
          border: { xs: 'none', md: '1px solid' },
          borderColor: 'divider',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 18px 60px rgba(2, 6, 23, 0.75)'
              : '0 18px 60px rgba(15, 23, 42, 0.1)',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(420px, 540px) 1fr' },
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            px: { xs: 2, sm: 4, md: 5 },
            py: { xs: 3, md: 4.5 },
            display: 'grid',
            alignContent: 'center',
            bgcolor: 'background.paper',
          }}
        >
          <Stack spacing={1.8} component="form" onSubmit={onSubmit}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
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
                {isDev ? (
                  <Typography variant="body2" color="text.secondary">
                    Use mock users like `leadership@faithhub.dev` with password `password123`.
                  </Typography>
                ) : null}
                </Box>
                <ThemeModeToggle />
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
                label="Remember me on this device"
              />

              <Button
                variant="text"
                size="small"
                onClick={() => setWorkspaceExpanded((prev) => !prev)}
                sx={{ justifyContent: 'flex-start', px: 0.5, alignSelf: 'flex-start', textTransform: 'none', fontWeight: 700 }}
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

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: -0.4 }}>
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
                  Forgot password?
                </Button>
              </Stack>

              <Button type="submit" variant="contained" size="large" disabled={!canSubmit}>
                {loading ? 'Signing in...' : 'Login'}
              </Button>

              <Typography variant="caption" color="text.secondary" sx={{ mt: -0.35 }}>
                Secure sign-in • Role-based access
              </Typography>

              <Divider sx={{ my: 0.2 }}>or</Divider>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="medium"
                  data-no-auto-action="true"
                  sx={{ textTransform: 'none', fontWeight: 700 }}
                  onClick={() => setError('Google SSO is not enabled for this workspace yet.')}
                >
                  Continue with Google
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  size="medium"
                  data-no-auto-action="true"
                  sx={{ textTransform: 'none', fontWeight: 700 }}
                  onClick={() => setError('Microsoft SSO is not enabled for this workspace yet.')}
                >
                  Continue with Microsoft
                </Button>
              </Stack>
          </Stack>
        </Box>

        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'relative',
            overflow: 'hidden',
            background:
              'linear-gradient(160deg, rgba(5, 12, 34, 0.96) 0%, rgba(7, 23, 58, 0.92) 48%, rgba(8, 30, 66, 0.9) 100%)',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 15% 20%, rgba(3,205,140,0.24), transparent 30%), radial-gradient(circle at 84% 78%, rgba(247,127,0,0.2), transparent 34%)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              px: 4,
              pb: 18,
            }}
          >
            <Box
              component="img"
              src="/assets/EV Zone FaithHub Logo (Single).png"
              alt="FaithHub global faith emblem"
              sx={{
                width: 'min(72%, 430px)',
                maxWidth: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 22px 40px rgba(0, 0, 0, 0.5))',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
          </Box>
          <Stack
            spacing={1}
            sx={{
              position: 'absolute',
              left: 28,
              right: 28,
              bottom: 28,
              color: 'white',
              p: 2,
              borderRadius: 3,
              bgcolor: 'rgba(3, 10, 28, 0.34)',
              backdropFilter: 'blur(3px)',
            }}
          >
            <Typography variant="overline" sx={{ letterSpacing: '0.12em', opacity: 0.9 }}>
              EVzone FaithHub
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ maxWidth: 560, fontSize: { md: 44, lg: 56 }, lineHeight: 1.05 }}>
              Provider workspace for live, community, giving, and growth.
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.92, maxWidth: 520 }}>
              Manage sessions, publish content, coordinate teams, and launch outreach from one trusted command surface.
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
