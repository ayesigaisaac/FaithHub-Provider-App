import { useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Mail, Shield, UserCircle2 } from 'lucide-react';
import { useAuth } from '@/auth/useAuth';
import { ProviderPageTitle } from '@/components/provider/ProviderPageTitle';
import type { WorkspaceContext } from '@/auth/types';
import { ProviderVerificationBadge } from '@/components/provider/ProviderVerificationBadge';

const PROFILE_PREFS_KEY = 'faithhub.provider.profile.prefs.v1';

type ProviderProfilePrefs = {
  displayName: string;
  phone: string;
  title: string;
  bio: string;
  language: string;
  timezone: string;
  notifyProduct: boolean;
  notifySecurity: boolean;
  notifyWeeklyDigest: boolean;
};

const DEFAULT_PREFS: ProviderProfilePrefs = {
  displayName: '',
  phone: '',
  title: '',
  bio: '',
  language: 'English',
  timezone: 'Africa/Kampala',
  notifyProduct: true,
  notifySecurity: true,
  notifyWeeklyDigest: true,
};

function toDisplayName(name?: string, email?: string) {
  if (name?.trim()) return name.trim();
  const local = (email?.split('@')[0] || 'user').trim();
  return local
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function ProfileSettingsPage() {
  const { user, role, workspace, setWorkspace, onboardingStatus } = useAuth();
  const fallbackName = toDisplayName(user?.name, user?.email);

  const [prefs, setPrefs] = useState<ProviderProfilePrefs>(() => {
    if (typeof window === 'undefined') return DEFAULT_PREFS;
    try {
      const raw = window.localStorage.getItem(PROFILE_PREFS_KEY);
      if (!raw) return DEFAULT_PREFS;
      const parsed = JSON.parse(raw) as Partial<ProviderProfilePrefs>;
      return {
        ...DEFAULT_PREFS,
        ...parsed,
      };
    } catch {
      return DEFAULT_PREFS;
    }
  });
  const [workspaceDraft, setWorkspaceDraft] = useState<WorkspaceContext>({
    campus: workspace?.campus || 'Kampala Central',
    brand: workspace?.brand || 'FaithHub',
  });
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const displayName = prefs.displayName.trim() || fallbackName;
  const initials = displayName
    .split(' ')
    .map((part) => part[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const validations = useMemo(
    () => ({
      displayName: displayName.trim().length >= 2,
      phone: !prefs.phone.trim() || prefs.phone.trim().length >= 7,
      title: !prefs.title.trim() || prefs.title.trim().length >= 2,
      bio: !prefs.bio.trim() || prefs.bio.trim().length >= 20,
      campus: workspaceDraft.campus.trim().length >= 2,
      brand: workspaceDraft.brand.trim().length >= 2,
    }),
    [displayName, prefs.bio, prefs.phone, prefs.title, workspaceDraft.brand, workspaceDraft.campus],
  );
  const canSave = Object.values(validations).every(Boolean);
  const completionChecks = useMemo(
    () => [
      { label: 'Display name', done: validations.displayName },
      { label: 'Workspace brand', done: validations.brand },
      { label: 'Workspace campus', done: validations.campus },
      { label: 'Phone format', done: validations.phone },
      { label: 'Role title', done: validations.title },
      { label: 'Bio length', done: validations.bio },
    ],
    [validations],
  );
  const completionPercent = Math.round(
    (completionChecks.filter((item) => item.done).length / completionChecks.length) * 100,
  );

  const updatePrefs = <K extends keyof ProviderProfilePrefs>(key: K, value: ProviderProfilePrefs[K]) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
    setNotice(null);
    setError(null);
  };

  const onReset = () => {
    setPrefs(DEFAULT_PREFS);
    setWorkspaceDraft({
      campus: workspace?.campus || 'Kampala Central',
      brand: workspace?.brand || 'FaithHub',
    });
    setNotice('Profile form reset.');
    setError(null);
  };

  const onSave = () => {
    if (!canSave) {
      setError('Please fix invalid profile fields before saving.');
      setNotice(null);
      return;
    }
    try {
      setWorkspace({
        campus: workspaceDraft.campus.trim(),
        brand: workspaceDraft.brand.trim(),
      });
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          PROFILE_PREFS_KEY,
          JSON.stringify({
            ...prefs,
            displayName: displayName.trim(),
            phone: prefs.phone.trim(),
            title: prefs.title.trim(),
            bio: prefs.bio.trim(),
          }),
        );
      }
      setNotice('Profile settings saved successfully.');
      setError(null);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save profile settings.');
      setNotice(null);
    }
  };

  return (
    <Box className="bg-[var(--fh-page-bg)] p-4 sm:p-6 lg:p-8">
      <Box className="mx-auto w-full max-w-5xl space-y-6">
        <Paper className="rounded-3xl border border-faith-line bg-[var(--fh-surface-bg)] p-6 shadow-soft">
          <ProviderPageTitle
            icon={<UserCircle2 size={24} />}
            title="Profile Settings"
            subtitle="Complete your provider profile with a clear checklist and save when ready."
          />
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            mt={2}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
          >
            <Alert severity={completionPercent === 100 ? 'success' : 'info'} sx={{ py: 0.5 }}>
              Profile completion: {completionPercent}%
            </Alert>
            <Typography sx={{ fontSize: 13, color: 'var(--fh-slate)' }}>
              Finish the checklist below to complete your setup.
            </Typography>
          </Stack>
        </Paper>

        {notice ? <Alert severity="success">{notice}</Alert> : null}
        {error ? <Alert severity="error">{error}</Alert> : null}

        <Paper className="rounded-3xl border border-faith-line bg-[var(--fh-surface-bg)] p-6 shadow-soft">
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <Avatar
              sx={{
                width: 68,
                height: 68,
                bgcolor: 'var(--fh-ink)',
                color: 'var(--fh-surface-bg)',
                fontWeight: 800,
                fontSize: 26,
              }}
            >
              {initials || 'U'}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: 28, fontWeight: 800, color: 'var(--fh-ink)', lineHeight: 1.05 }}>
                {displayName}
              </Typography>
              <Typography sx={{ mt: 0.75, fontSize: 14, color: 'var(--fh-slate)' }}>
                Signed in as {user?.email || 'unknown@faithhub.dev'}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <ProviderVerificationBadge status={onboardingStatus} />
              </Box>
            </Box>
          </Stack>
          <Divider sx={{ my: 2.5 }} />
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Mail size={16} />
              <Typography sx={{ fontSize: 14, color: 'var(--fh-ink)' }}>
                Email: <strong>{user?.email || 'unknown@faithhub.dev'}</strong>
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Shield size={16} />
              <Typography sx={{ fontSize: 14, color: 'var(--fh-ink)' }}>
                Role: <strong>{role || 'leadership'}</strong>
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <UserCircle2 size={16} />
              <Typography sx={{ fontSize: 14, color: 'var(--fh-ink)' }}>
                Workspace: <strong>{workspace?.brand || 'FaithHub'}</strong> - {workspace?.campus || 'Kampala Central'}
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        <Paper className="rounded-3xl border border-faith-line bg-[var(--fh-surface-bg)] p-6 shadow-soft">
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: 'var(--fh-ink)' }}>Completion checklist</Typography>
          <Stack spacing={1} mt={2}>
            {completionChecks.map((item) => (
              <Box
                key={item.label}
                className="flex items-center justify-between rounded-xl border border-faith-line/80 bg-[var(--fh-surface)] px-3 py-2"
              >
                <Typography sx={{ fontSize: 14, color: 'var(--fh-ink)', fontWeight: 600 }}>{item.label}</Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: item.done ? 'var(--fh-brand)' : 'var(--fh-slate)',
                  }}
                >
                  {item.done ? 'Complete' : 'Needs attention'}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper className="rounded-3xl border border-faith-line bg-[var(--fh-surface-bg)] p-6 shadow-soft">
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: 'var(--fh-ink)' }}>Profile details</Typography>
          <Stack spacing={2} mt={2.5}>
            <TextField
              label="Display name"
              value={prefs.displayName}
              onChange={(event) => updatePrefs('displayName', event.target.value)}
              helperText="Name shown across provider surfaces"
              error={!validations.displayName && prefs.displayName.trim().length > 0}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Phone"
                value={prefs.phone}
                onChange={(event) => updatePrefs('phone', event.target.value)}
                helperText="Optional, minimum 7 digits"
                error={!validations.phone && prefs.phone.trim().length > 0}
              />
              <TextField
                fullWidth
                label="Role title"
                value={prefs.title}
                onChange={(event) => updatePrefs('title', event.target.value)}
                helperText="Optional internal title"
                error={!validations.title && prefs.title.trim().length > 0}
              />
            </Stack>
            <TextField
              multiline
              minRows={3}
              label="Short bio"
              value={prefs.bio}
              onChange={(event) => updatePrefs('bio', event.target.value)}
              helperText="Optional, at least 20 characters if set"
              error={!validations.bio && prefs.bio.trim().length > 0}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="profile-language-label">Language</InputLabel>
                <Select
                  labelId="profile-language-label"
                  label="Language"
                  value={prefs.language}
                  onChange={(event) => updatePrefs('language', event.target.value)}
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Luganda">Luganda</MenuItem>
                  <MenuItem value="Swahili">Swahili</MenuItem>
                  <MenuItem value="French">French</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="profile-timezone-label">Timezone</InputLabel>
                <Select
                  labelId="profile-timezone-label"
                  label="Timezone"
                  value={prefs.timezone}
                  onChange={(event) => updatePrefs('timezone', event.target.value)}
                >
                  <MenuItem value="Africa/Kampala">Africa/Kampala</MenuItem>
                  <MenuItem value="Africa/Nairobi">Africa/Nairobi</MenuItem>
                  <MenuItem value="Europe/London">Europe/London</MenuItem>
                  <MenuItem value="America/New_York">America/New_York</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Paper>

        <Paper className="rounded-3xl border border-faith-line bg-[var(--fh-surface-bg)] p-6 shadow-soft">
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: 'var(--fh-ink)' }}>Workspace profile</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2.5}>
            <TextField
              fullWidth
              label="Workspace brand"
              value={workspaceDraft.brand}
              onChange={(event) => {
                setWorkspaceDraft((prev) => ({ ...prev, brand: event.target.value }));
                setNotice(null);
                setError(null);
              }}
              error={!validations.brand}
            />
            <TextField
              fullWidth
              label="Workspace campus"
              value={workspaceDraft.campus}
              onChange={(event) => {
                setWorkspaceDraft((prev) => ({ ...prev, campus: event.target.value }));
                setNotice(null);
                setError(null);
              }}
              error={!validations.campus}
            />
          </Stack>
          <Stack spacing={0.5} mt={2}>
            <FormControlLabel
              control={<Switch checked={prefs.notifyProduct} onChange={(event) => updatePrefs('notifyProduct', event.target.checked)} />}
              label="Product updates"
            />
            <FormControlLabel
              control={<Switch checked={prefs.notifySecurity} onChange={(event) => updatePrefs('notifySecurity', event.target.checked)} />}
              label="Security alerts"
            />
            <FormControlLabel
              control={<Switch checked={prefs.notifyWeeklyDigest} onChange={(event) => updatePrefs('notifyWeeklyDigest', event.target.checked)} />}
              label="Weekly digest"
            />
          </Stack>

          <Divider sx={{ my: 2.5 }} />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
            <Button variant="contained" onClick={onSave} disabled={!canSave}>
              Save changes
            </Button>
            <Button variant="outlined" color="inherit" onClick={onReset}>
              Reset
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}
