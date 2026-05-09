import { Chip } from '@mui/material';
import { BadgeCheck, Clock3, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { ProviderOnboardingStatus } from '@/auth/types';

export function ProviderVerificationBadge({ status }: { status: ProviderOnboardingStatus }) {
  if (status === 'approved') {
    return (
      <Chip
        icon={<BadgeCheck size={14} />}
        label="Verified Provider"
        color="success"
        variant="filled"
        size="small"
      />
    );
  }

  if (status === 'submitted') {
    return (
      <Chip
        icon={<Clock3 size={14} />}
        label="Verification Pending"
        color="warning"
        variant="filled"
        size="small"
      />
    );
  }

  if (status === 'in_progress') {
    return (
      <Chip
        icon={<ShieldAlert size={14} />}
        label="Unverified"
        color="default"
        variant="outlined"
        size="small"
      />
    );
  }

  return (
    <Chip
      icon={<ShieldCheck size={14} />}
      label="Not Started"
      color="default"
      variant="outlined"
      size="small"
    />
  );
}

