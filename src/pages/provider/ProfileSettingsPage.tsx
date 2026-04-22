import { Avatar, Box, Divider, Paper, Stack, Typography } from '@mui/material';
import { Mail, Shield, UserCircle2 } from 'lucide-react';
import { useAuth } from '@/auth/useAuth';
import { ProviderPageTitle } from '@/components/provider/ProviderPageTitle';

function toDisplayName(name?: string, email?: string) {
  if (name?.trim()) return name.trim();
  const local = (email?.split('@')[0] || 'user').trim();
  return local
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function ProfileSettingsPage() {
  const { user, role, workspace } = useAuth();
  const displayName = toDisplayName(user?.name, user?.email);
  const initials = displayName
    .split(' ')
    .map((part) => part[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Box className="bg-[var(--fh-page-bg)] p-4 sm:p-6 lg:p-8">
      <Box className="mx-auto w-full max-w-5xl space-y-6">
        <Paper className="rounded-3xl border border-faith-line bg-[var(--fh-surface-bg)] p-6 shadow-soft">
          <ProviderPageTitle
            icon={<UserCircle2 size={24} />}
            title="Profile Settings"
            subtitle="Manage your account identity and verify the active workspace credentials."
          />
        </Paper>

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
      </Box>
    </Box>
  );
}
