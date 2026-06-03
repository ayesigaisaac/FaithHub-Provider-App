import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  LinearProgress,
} from '@mui/material';
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Eye,
  FileImage,
  FolderKanban,
  Gauge,
  Image as ImageIcon,
  LayoutDashboard,
  Megaphone,
  MonitorPlay,
  PenLine,
  PlayCircle,
  Plus,
  Radio,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Trash2,
  Upload,
  UserCircle2,
} from 'lucide-react';
import { useOptionalAuth } from '@/auth/useAuth';
import { Button } from '@/components/ui/Button';
import { KpiTile } from '@/components/ui/KpiTile';
import { ProviderPageScaffold } from '@/components/provider/ProviderPageScaffold';
import { ProviderSectionCard } from '@/components/provider/ProviderSectionCard';
import { getLiveFlowState, saveLiveFlowDraft } from '@/features/live/liveFlowStore';
import { ProviderStatusPill } from '@/components/provider/ProviderStatusPill';

const ROUTES = {
  onboarding: '/faithhub/provider/onboarding',
  profile: '/faithhub/provider/profile-settings',
  dashboard: '/faithhub/provider/dashboard',
  services: '/faithhub/provider/services',
  serviceBuilder: '/faithhub/provider/service-builder',
  campaigns: '/faithhub/provider/campaigns',
  campaignBuilder: '/faithhub/provider/campaign-builder',
  contentUpload: '/faithhub/provider/content-upload',
  assetLibrary: '/faithhub/provider/asset-library',
  liveBuilder: '/faithhub/provider/live-builder',
  liveSchedule: '/faithhub/provider/live-schedule',
  liveDashboard: '/faithhub/provider/live-dashboard',
  liveSessionDetails: '/faithhub/provider/live-session-details',
  waitingRoom: '/faithhub/provider/waiting-room',
  liveStudio: '/faithhub/provider/live-studio',
} as const;

type ProviderStateTone = 'neutral' | 'good' | 'warn' | 'brand' | 'danger';

type RegistrationDraft = {
  organizationName: string;
  providerType: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  country: string;
  city: string;
  website: string;
  password: string;
};

type ProfileDraft = {
  logo: string;
  coverImage: string;
  bio: string;
  missionStatement: string;
  registrationCertificate: string;
  identityDocument: string;
};

type ServiceRecord = {
  id: string;
  name: string;
  category: string;
  status: 'Draft' | 'Pending Review' | 'Approved' | 'Rejected' | 'Published';
  createdDate: string;
  image: string;
  description: string;
  price: string;
  duration: string;
  location: string;
};

type ServiceDraft = Omit<ServiceRecord, 'id' | 'status' | 'createdDate'>;

type CampaignRecord = {
  id: string;
  name: string;
  status: 'Pending Review' | 'Approved' | 'Active';
  startDate: string;
  endDate: string;
  objective: string;
  banner: string;
  description: string;
  services: string[];
};

type CampaignDraft = Omit<CampaignRecord, 'id' | 'status'>;

type AssetRecord = {
  id: string;
  name: string;
  type: 'Poster' | 'Video' | 'Banner' | 'Thumbnail' | 'Flyer' | 'Image';
  status: 'Pending Review' | 'Approved' | 'Rejected';
  preview: string;
};

type LiveSessionRecord = {
  id: string;
  title: string;
  campaign: string;
  host: string;
  guestSpeakers: string[];
  featuredServices: string[];
  thumbnail: string;
  date: string;
  time: string;
  duration: string;
  status: 'Draft' | 'Pending Approval' | 'Scheduled' | 'Ready' | 'Live' | 'Ended';
  description: string;
  waitingRoomEnabled: boolean;
  countdownEnabled: boolean;
  remindersEnabled: boolean;
};

type LiveSessionDraft = Omit<LiveSessionRecord, 'id' | 'status'>;

type SelectOption = {
  label: string;
  value: string;
};

function useSafeNavigate() {
  let navigate: ReturnType<typeof useNavigate> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    navigate = useNavigate();
  } catch {
    navigate = null;
  }
  return useMemo(() => {
    return (to: unknown, options?: unknown) => {
      if (navigate) {
        navigate(to as never, options as never);
        return;
      }

      if (typeof window !== 'undefined' && typeof to === 'string') {
        window.history.pushState({}, '', to);
      }
    };
  }, [navigate]);
}

function getQuerySessionId() {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get('sessionId') ?? '';
}

function getLiveSessionsFromFlow(): LiveSessionRecord[] {
  const sourceSessions = getLiveFlowState().sessions;
  if (!sourceSessions.length) return DEFAULT_LIVE_SESSIONS;

  return sourceSessions.map((session) => {
    const start = new Date(session.startISO || Date.now());
    const end = new Date(session.endISO || start.getTime() + 60 * 60_000);
    const minutes = Math.max(Math.round((end.getTime() - start.getTime()) / 60_000), 60);
    const status = session.status === 'Scheduled' ? 'Scheduled' : session.status === 'Ready' ? 'Ready' : 'Draft';

    return {
      id: session.id,
      title: session.title,
      campaign: session.parentLabel || 'FaithHub Provider',
      host: session.speaker,
      guestSpeakers: session.subtitle ? [session.subtitle] : ['Guest speaker'],
      featuredServices: session.summary ? [session.summary] : ['Approved service'],
      thumbnail: '',
      date: Number.isNaN(start.getTime()) ? '' : start.toISOString().slice(0, 10),
      time: Number.isNaN(start.getTime()) ? '' : start.toISOString().slice(11, 16),
      duration: `${minutes} min`,
      status,
      description: session.summary || session.subtitle || session.title,
      waitingRoomEnabled: true,
      countdownEnabled: true,
      remindersEnabled: true,
    };
  });
}

const JOURNEY_STEPS = [
  { label: 'Registration', path: ROUTES.onboarding, icon: BadgeCheck },
  { label: 'Profile', path: ROUTES.profile, icon: UserCircle2 },
  { label: 'Dashboard', path: ROUTES.dashboard, icon: LayoutDashboard },
  { label: 'Build', path: ROUTES.serviceBuilder, icon: BriefcaseBusiness },
  { label: 'Go Live', path: ROUTES.liveStudio, icon: Radio },
] as const;

const DASHBOARD_PHASES = [
  {
    label: 'Phase 1 · Foundation & onboarding',
    summary: 'Registration, profile completion, and approval review.',
    route: ROUTES.profile,
    icon: BadgeCheck,
  },
  {
    label: 'Phase 2 · Dashboard & core management',
    summary: 'Overview cards, service creation, and campaign setup.',
    route: ROUTES.services,
    icon: LayoutDashboard,
  },
  {
    label: 'Phase 3 · Content & asset workflow',
    summary: 'Uploads, previews, and approved asset selection.',
    route: ROUTES.contentUpload,
    icon: Upload,
  },
  {
    label: 'Phase 4 · Live session creation',
    summary: 'Draft, schedule, and approve provider live sessions.',
    route: ROUTES.liveBuilder,
    icon: MonitorPlay,
  },
  {
    label: 'Phase 5 · Waiting room & go live',
    summary: 'Preview the audience view and launch the live studio.',
    route: ROUTES.waitingRoom,
    icon: Clock3,
  },
  {
    label: 'Phase 6 · UX polish & operations',
    summary: 'Responsive states, approval indicators, and empty states.',
    route: ROUTES.dashboard,
    icon: Sparkles,
  },
] as const;

const JOURNEY_PHASES = [
  {
    label: 'Phase 1 · Foundation & onboarding',
    hint: 'Registration, profile completion, and approval review.',
    path: ROUTES.profile,
  },
  {
    label: 'Phase 2 · Dashboard & management',
    hint: 'Services, campaigns, and the core provider workspace.',
    path: ROUTES.services,
  },
  {
    label: 'Phase 3 · Content & assets',
    hint: 'Uploads, review queue, and approved asset library.',
    path: ROUTES.contentUpload,
  },
  {
    label: 'Phase 4 · Live session setup',
    hint: 'Build, schedule, and review live sessions.',
    path: ROUTES.liveBuilder,
  },
  {
    label: 'Phase 5 · Waiting room & live',
    hint: 'Preview the waiting room and launch the studio.',
    path: ROUTES.waitingRoom,
  },
] as const;

function JourneyPhaseCard({
  activePath,
  onNavigate,
}: {
  activePath?: string;
  onNavigate: (path: string) => void;
}) {
  return (
    <ProviderSectionCard title="Phase rollout" subtitle="Follow the implementation in the same order as the product roadmap.">
      <div className="space-y-3">
        {JOURNEY_PHASES.map((phase, index) => {
          const isActive = activePath === phase.path;
          const isCompleted = Boolean(activePath) && JOURNEY_PHASES.findIndex((item) => item.path === activePath) > index;
          return (
            <button
              key={phase.label}
              type="button"
              onClick={() => onNavigate(phase.path)}
              className={cx(
                'flex w-full items-start justify-between gap-3 rounded-2xl border p-4 text-left transition-colors',
                isActive ? 'border-emerald-300 bg-emerald-50' : 'border-faith-line/70 bg-[var(--fh-surface-bg)] hover:bg-[var(--fh-surface)]',
              )}
            >
              <div className="min-w-0">
                <div className="text-[13px] font-extrabold text-faith-ink">{phase.label}</div>
                <div className="mt-1 text-[12px] text-faith-slate">{phase.hint}</div>
              </div>
              <ProviderStatusPill tone={isActive ? 'brand' : isCompleted ? 'good' : 'neutral'}>
                {isActive ? 'Current' : isCompleted ? 'Done' : 'Next'}
              </ProviderStatusPill>
            </button>
          );
        })}
      </div>
    </ProviderSectionCard>
  );
}

const SERVICE_CATEGORIES = [
  'Worship Support',
  'Teaching Support',
  'Prayer Support',
  'Creative Production',
  'Media Strategy',
  'Counseling Support',
];

const CAMPAIGN_OBJECTIVES = [
  'Registration Growth',
  'Launch Promotion',
  'Live Session Reach',
  'Community Engagement',
  'Content Distribution',
];

const CONTENT_TYPES = ['Poster', 'Video', 'Banner', 'Thumbnail', 'Flyer'] as const;

const PROFILE_STATUS = 'Pending Review';

const DEFAULT_REGISTRATION: RegistrationDraft = {
  organizationName: 'FaithHub Renewal Ministry',
  providerType: 'Ministry',
  contactPerson: 'Pastor Miriam N.',
  email: 'hello@faithhubrenewal.org',
  phoneNumber: '+256 700 123 456',
  country: 'Uganda',
  city: 'Kampala',
  website: 'faithhubrenewal.org',
  password: '',
};

const DEFAULT_PROFILE: ProfileDraft = {
  logo: '',
  coverImage: '',
  bio: 'A faith-focused provider creating trustworthy live and content experiences for communities.',
  missionStatement: 'To serve local and global audiences through clean, prayerful, and excellent digital ministry.',
  registrationCertificate: '',
  identityDocument: '',
};

const DEFAULT_SERVICES: ServiceRecord[] = [
  {
    id: 'service-1',
    name: 'Sunday Worship Livestream Support',
    category: 'Worship Support',
    status: 'Approved',
    createdDate: '2026-05-27',
    image: 'Worship stage with soft green lighting',
    description: 'Live stream support, production setup, and service coordination for weekly worship gatherings.',
    price: 'UGX 280,000',
    duration: '3 hours',
    location: 'Online + Kampala',
  },
  {
    id: 'service-2',
    name: 'Prayer Night Production Pack',
    category: 'Prayer Support',
    status: 'Pending Review',
    createdDate: '2026-05-31',
    image: 'Prayer circle preview art',
    description: 'A guided production bundle for nightly prayer experiences and audience response.',
    price: 'UGX 190,000',
    duration: '2 hours',
    location: 'Online',
  },
];

const DEFAULT_CAMPAIGNS: CampaignRecord[] = [
  {
    id: 'campaign-1',
    name: 'FaithHub Launch Week',
    status: 'Active',
    startDate: '2026-06-01',
    endDate: '2026-06-15',
    objective: 'Launch Promotion',
    banner: 'Soft sunrise banner with FaithHub branding',
    description: 'A launch campaign for the provider journey and the first approval queue.',
    services: ['Sunday Worship Livestream Support'],
  },
  {
    id: 'campaign-2',
    name: 'Pray With Us June',
    status: 'Pending Review',
    startDate: '2026-06-08',
    endDate: '2026-06-21',
    objective: 'Community Engagement',
    banner: 'Prayer banner and countdown artwork',
    description: 'A prayer campaign built to promote live and content experiences.',
    services: ['Prayer Night Production Pack'],
  },
];

const DEFAULT_ASSETS: AssetRecord[] = [
  {
    id: 'asset-1',
    name: 'Launch Poster A',
    type: 'Poster',
    status: 'Approved',
    preview: 'Poster preview with the FaithHub logo and green gradient',
  },
  {
    id: 'asset-2',
    name: 'Worship Intro Reel',
    type: 'Video',
    status: 'Pending Review',
    preview: 'Short intro video from the worship team',
  },
  {
    id: 'asset-3',
    name: 'Countdown Banner',
    type: 'Banner',
    status: 'Approved',
    preview: 'Soft banner with countdown placeholder',
  },
  {
    id: 'asset-4',
    name: 'Session Thumbnail',
    type: 'Thumbnail',
    status: 'Approved',
    preview: 'Session thumbnail with host portrait layout',
  },
];

const DEFAULT_LIVE_SESSIONS: LiveSessionRecord[] = [
  {
    id: 'session-1',
    title: 'FaithHub Renewal Night',
    campaign: 'FaithHub Launch Week',
    host: 'Pastor Miriam N.',
    guestSpeakers: ['Minister Daniel K.', 'Sister Lydia A.'],
    featuredServices: ['Sunday Worship Livestream Support'],
    thumbnail: 'Renewal Night thumbnail with live broadcast framing',
    date: '2026-06-07',
    time: '19:00',
    duration: '90 min',
    status: 'Scheduled',
    description: 'A high-energy prayer and worship session with a clear waiting room and live launch plan.',
    waitingRoomEnabled: true,
    countdownEnabled: true,
    remindersEnabled: true,
  },
  {
    id: 'session-2',
    title: 'June Prayer Equipping',
    campaign: 'Pray With Us June',
    host: 'FaithHub Media Team',
    guestSpeakers: ['Minister Anna B.'],
    featuredServices: ['Prayer Night Production Pack'],
    thumbnail: 'Prayer preview with host card and timer',
    date: '2026-06-10',
    time: '20:30',
    duration: '60 min',
    status: 'Pending Approval',
    description: 'A prayer and intercession session awaiting final approval and schedule confirmation.',
    waitingRoomEnabled: true,
    countdownEnabled: true,
    remindersEnabled: false,
  },
];

const STORAGE_KEYS = {
  registration: 'faithhub.provider.phase1.registration',
  profile: 'faithhub.provider.phase1.profile',
  services: 'faithhub.provider.phase1.services',
  serviceBuilder: 'faithhub.provider.phase1.serviceBuilder',
  campaigns: 'faithhub.provider.phase1.campaigns',
  campaignBuilder: 'faithhub.provider.phase1.campaignBuilder',
  assets: 'faithhub.provider.phase1.assets',
  liveSessions: 'faithhub.provider.phase1.liveSessions',
  liveSessionDraft: 'faithhub.provider.phase1.liveSessionDraft',
  selectedAssetIds: 'faithhub.provider.phase1.selectedAssetIds',
  selectedSessionId: 'faithhub.provider.phase1.selectedSessionId',
  registrationStatus: 'faithhub.provider.phase1.registrationStatus',
} as const;

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function readJson<T>(key: string, fallback: T) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function useStoredState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readJson<T>(key, fallback));
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function statusTone(status: string): ProviderStateTone {
  const normalized = status.toLowerCase();
  if (normalized.includes('approved') || normalized.includes('active') || normalized.includes('published') || normalized.includes('live')) {
    return 'good';
  }
  if (normalized.includes('draft') || normalized.includes('pending')) {
    return 'warn';
  }
  if (normalized.includes('rejected')) {
    return 'danger';
  }
  return 'neutral';
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  rows = 1,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  type?: string;
  rows?: number;
}) {
  const base =
    'mt-1.5 w-full rounded-2xl border border-faith-line/70 bg-[var(--fh-surface-bg)] px-3 py-2 text-[12px] font-semibold text-faith-ink outline-none transition-colors focus:ring-2 focus:ring-emerald-200';
  return (
    <label className="block">
      <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">{label}</span>
      {rows > 1 ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={cx(base, 'min-h-[110px] resize-y')}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={base}
        />
      )}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: string[] | SelectOption[];
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-2xl border border-faith-line/70 bg-[var(--fh-surface-bg)] px-3 py-2 text-[12px] font-semibold text-faith-ink outline-none transition-colors focus:ring-2 focus:ring-emerald-200"
      >
        {options.map((option) => {
          const optionValue = typeof option === 'string' ? option : option.value;
          const optionLabel = typeof option === 'string' ? option : option.label;
          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
    </label>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
  detail,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  detail?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cx(
        'flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-colors',
        checked
          ? 'border-emerald-300 bg-emerald-50'
          : 'border-faith-line/70 bg-[var(--fh-surface-bg)] hover:bg-[var(--fh-surface)]',
      )}
    >
      <span
        className={cx(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
          checked ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-faith-line bg-white',
        )}
      >
        {checked ? <CheckCircle2 size={13} /> : null}
      </span>
      <span className="min-w-0">
        <span className="block text-[12px] font-extrabold text-faith-ink">{label}</span>
        {detail ? <span className="mt-0.5 block text-[11px] leading-5 text-faith-slate">{detail}</span> : null}
      </span>
    </button>
  );
}

function JourneyRail({ currentPath }: { currentPath: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-wrap gap-2">
      {JOURNEY_STEPS.map((step) => {
        const active = currentPath === step.path;
        const Icon = step.icon;
        return (
          <button
            key={step.path}
            type="button"
            onClick={() => navigate(step.path)}
            className={cx(
              'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-extrabold transition-colors',
              active
                ? 'border-emerald-300 bg-emerald-50 text-faith-ink'
                : 'border-faith-line/70 bg-[var(--fh-surface-bg)] text-faith-slate hover:bg-[var(--fh-surface)]',
            )}
          >
            <Icon size={12} />
            {step.label}
          </button>
        );
      })}
    </div>
  );
}

function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-faith-line/70 bg-[var(--fh-surface-bg)] p-6 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
        <Sparkles size={20} />
      </div>
      <div className="text-[15px] font-black text-faith-ink">{title}</div>
      <p className="mx-auto mt-2 max-w-xl text-[13px] leading-6 text-faith-slate">{body}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function ProviderRegistrationPage() {
  const navigate = useNavigate();
  const auth = useOptionalAuth();
  const [draft, setDraft] = useStoredState<RegistrationDraft>(STORAGE_KEYS.registration, DEFAULT_REGISTRATION);
  const [status, setStatus] = useStoredState<string>(STORAGE_KEYS.registrationStatus, 'Draft');
  const [notice, setNotice] = useState<string>('Save a draft anytime, then register when the provider details are ready.');

  const completion = useMemo(() => {
    const checks = [
      draft.organizationName,
      draft.providerType,
      draft.contactPerson,
      draft.email,
      draft.phoneNumber,
      draft.country,
      draft.city,
      draft.website,
      draft.password,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [draft]);

  const update = <K extends keyof RegistrationDraft>(key: K, value: RegistrationDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setNotice('Draft updated locally.');
  };

  const saveDraft = () => {
    setStatus('Draft');
    setNotice('Registration draft saved. You can continue later.');
  };

  const register = () => {
    const required = Object.values(draft).every((value) => normalizeText(String(value)).length > 0);
    if (!required) {
      setNotice('Complete every registration field before submitting.');
      return;
    }

    auth?.setWorkspace({
      brand: draft.organizationName,
      campus: draft.city,
    });
    auth?.setOnboardingStatus('submitted');
    auth?.setOnboardingDraft({
      organizationName: draft.organizationName,
      contactName: draft.contactPerson,
      contactEmail: draft.email,
      contactPhone: draft.phoneNumber,
      organizationType: 'church',
      country: draft.country,
      city: draft.city,
      mission: 'Faith-focused provider launch',
      website: draft.website,
      primaryLanguage: 'English',
      agreedToTerms: true,
    });
    setStatus('Pending Review');
    setNotice('Registration submitted. Continue with provider profile completion.');
    navigate(ROUTES.profile);
  };

  return (
    <ProviderPageScaffold
      icon={<BadgeCheck className="h-6 w-6" />}
      title="Provider Registration"
      subtitle="Capture the provider basics, save a local draft, and move into profile completion without leaving the FaithHub shell."
      tags={
        <>
          <ProviderStatusPill tone={statusTone(status)} left={<ClipboardCheck size={12} />}>{status}</ProviderStatusPill>
          <ProviderStatusPill tone={completion === 100 ? 'good' : 'warn'} left={<Gauge size={12} />}>{completion}% complete</ProviderStatusPill>
          <ProviderStatusPill tone="neutral" left={<Clock3 size={12} />}>Next: profile completion</ProviderStatusPill>
        </>
      }
      pulse={<Alert severity="info">{notice}</Alert>}
      actions={
        <>
          <Button variant="outline" onClick={saveDraft}>Save Draft</Button>
          <Button variant="primary" onClick={register}>Register</Button>
        </>
      }
    >
      <Box className="space-y-4">
        <JourneyRail currentPath={ROUTES.onboarding} />

        <div className="grid gap-4 xl:grid-cols-12">
          <div className="space-y-4 xl:col-span-8">
            <ProviderSectionCard
              title="Organization and contact"
              subtitle="Use a real provider identity so the dashboard, approvals, and live workflow feel connected from day one."
              right={<ProviderStatusPill tone="neutral" left={<UserCircle2 size={12} />}>FaithHub Provider</ProviderStatusPill>}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Organization Name" value={draft.organizationName} onChange={(value) => update('organizationName', value)} placeholder="FaithHub Renewal Ministry" />
                <SelectField
                  label="Provider Type"
                  value={draft.providerType}
                  onChange={(value) => update('providerType', value)}
                  options={['Ministry', 'Church', 'Creator', 'Agency']}
                />
                <Field label="Contact Person" value={draft.contactPerson} onChange={(value) => update('contactPerson', value)} placeholder="Pastor Miriam N." />
                <Field label="Email" value={draft.email} onChange={(value) => update('email', value)} placeholder="hello@faithhub.org" type="email" />
                <Field label="Phone Number" value={draft.phoneNumber} onChange={(value) => update('phoneNumber', value)} placeholder="+256 700 123 456" />
                <Field label="Website" value={draft.website} onChange={(value) => update('website', value)} placeholder="faithhub.org" />
                <Field label="Country" value={draft.country} onChange={(value) => update('country', value)} placeholder="Uganda" />
                <Field label="City" value={draft.city} onChange={(value) => update('city', value)} placeholder="Kampala" />
                <Field label="Password" value={draft.password} onChange={(value) => update('password', value)} placeholder="Create a secure password" type="password" />
              </div>
            </ProviderSectionCard>

            <ProviderSectionCard
              title="Registration checklist"
              subtitle="The registration screen is intentionally short so the provider can move quickly into the profile completion stage."
            >
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ['Organization name', draft.organizationName],
                  ['Provider type', draft.providerType],
                  ['Contact person', draft.contactPerson],
                  ['Email and phone', `${draft.email || 'Email required'} - ${draft.phoneNumber || 'Phone required'}`],
                  ['Country and city', `${draft.country || 'Country required'} - ${draft.city || 'City required'}`],
                  ['Website', draft.website || 'Website required'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] px-4 py-3">
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">{label}</div>
                    <div className="mt-1 text-[13px] font-bold text-faith-ink">{value}</div>
                  </div>
                ))}
              </div>
            </ProviderSectionCard>
          </div>

          <div className="space-y-4 xl:col-span-4">
            <ProviderSectionCard
              title="Next step"
              subtitle="Once registration is saved, the provider profile screen unlocks the approval journey."
            >
              <div className="space-y-3">
                <ProviderStatusPill tone="warn" left={<TimerReset size={12} />}>Pending Review</ProviderStatusPill>
                <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-4">
                  <div className="text-[12px] font-extrabold text-faith-ink">What happens next</div>
                  <ul className="mt-2 space-y-2 text-[12px] leading-6 text-faith-slate">
                    <li>Complete organization profile and verification files.</li>
                    <li>Submit the application for approval.</li>
                    <li>Open the provider dashboard and start building services.</li>
                  </ul>
                </div>
                <Button variant="secondary" className="w-full" onClick={() => navigate(ROUTES.profile)}>
                  Continue to profile
                </Button>
              </div>
            </ProviderSectionCard>

            <ProviderSectionCard title="Journey trail" subtitle="The app keeps the provider journey visible at every step.">
              <div className="space-y-2">
                {JOURNEY_STEPS.map((step, index) => (
                  <button
                    key={step.path}
                    type="button"
                    onClick={() => navigate(step.path)}
                    className={cx(
                      'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors',
                      step.path === ROUTES.onboarding
                        ? 'border-emerald-300 bg-emerald-50'
                        : 'border-faith-line/70 bg-[var(--fh-surface-bg)] hover:bg-[var(--fh-surface)]',
                    )}
                  >
                    <div>
                      <div className="text-[12px] font-extrabold text-faith-ink">{index + 1}. {step.label}</div>
                      <div className="text-[11px] text-faith-slate">{step.path.replace('/faithhub/provider/', '')}</div>
                    </div>
                    <ArrowRight size={14} />
                  </button>
                ))}
              </div>
            </ProviderSectionCard>
          </div>
        </div>
      </Box>
    </ProviderPageScaffold>
  );
}

export function ProviderProfilePage() {
  const navigate = useNavigate();
  const auth = useOptionalAuth();
  const [draft, setDraft] = useStoredState<ProfileDraft>(STORAGE_KEYS.profile, DEFAULT_PROFILE);
  const [notice, setNotice] = useState<string>('Complete the profile, add verification assets, and submit for review.');
  const [submitState, setSubmitState] = useStoredState<string>(STORAGE_KEYS.registrationStatus, PROFILE_STATUS);

  const completeness = useMemo(() => {
    const checks = [draft.logo, draft.coverImage, draft.bio, draft.missionStatement, draft.registrationCertificate, draft.identityDocument];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [draft]);

  const update = <K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setNotice('Profile draft updated locally.');
  };

  const saveDraft = () => {
    setNotice('Profile draft saved. Verification can be finished later.');
  };

  const submitApplication = () => {
    const ready = [draft.logo, draft.coverImage, draft.bio, draft.missionStatement].every((value) => normalizeText(value).length > 0);
    if (!ready) {
      setNotice('Add the required organization information before submitting the application.');
      return;
    }
    auth?.setOnboardingStatus('submitted');
    auth?.setWorkspace({
      brand: auth?.workspace?.brand || 'FaithHub Provider',
      campus: auth?.workspace?.campus || 'Kampala',
    });
    setSubmitState('Pending Review');
    setNotice('Application submitted. The provider dashboard is now ready for review and operations.');
    navigate(ROUTES.dashboard);
  };

  return (
    <ProviderPageScaffold
      icon={<UserCircle2 className="h-6 w-6" />}
      title="Complete Provider Profile"
      subtitle="Add the visual identity, bio, mission, and verification files that carry the FaithHub provider brand into review."
      tags={
        <>
          <ProviderStatusPill tone="warn" left={<ShieldCheck size={12} />}>{submitState}</ProviderStatusPill>
          <ProviderStatusPill tone={completeness === 100 ? 'good' : 'warn'} left={<Gauge size={12} />}>{completeness}% complete</ProviderStatusPill>
          <ProviderStatusPill tone="neutral" left={<FileImage size={12} />}>Organization profile</ProviderStatusPill>
        </>
      }
      pulse={<Alert severity="info">{notice}</Alert>}
      actions={
        <>
          <Button variant="outline" onClick={saveDraft}>Save Draft</Button>
          <Button variant="primary" onClick={submitApplication}>Submit Application</Button>
        </>
      }
    >
      <Box className="space-y-4">
        <JourneyRail currentPath={ROUTES.profile} />
        <div className="grid gap-4 xl:grid-cols-12">
          <div className="space-y-4 xl:col-span-8">
            <ProviderSectionCard
              title="Organization information"
              subtitle="Use these assets across dashboard cards, approval banners, and live session previews."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Logo" value={draft.logo} onChange={(value) => update('logo', value)} placeholder="Upload or paste logo path" />
                <Field label="Cover Image" value={draft.coverImage} onChange={(value) => update('coverImage', value)} placeholder="Upload or paste cover image path" />
                <div className="md:col-span-2">
                  <Field label="Bio" value={draft.bio} onChange={(value) => update('bio', value)} placeholder="Write a short provider bio" rows={4} />
                </div>
                <div className="md:col-span-2">
                  <Field label="Mission Statement" value={draft.missionStatement} onChange={(value) => update('missionStatement', value)} placeholder="Write the mission statement" rows={4} />
                </div>
              </div>
            </ProviderSectionCard>

            <ProviderSectionCard
              title="Verification"
              subtitle="Upload the documents that support FaithHub approval and profile trust."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Registration Certificate" value={draft.registrationCertificate} onChange={(value) => update('registrationCertificate', value)} placeholder="Upload certificate file name" />
                <Field label="Identity Document" value={draft.identityDocument} onChange={(value) => update('identityDocument', value)} placeholder="Upload ID file name" />
              </div>
            </ProviderSectionCard>
          </div>

          <div className="space-y-4 xl:col-span-4">
            <ProviderSectionCard title="Approval banner" subtitle="The provider profile remains in review until the application is submitted.">
              <div className="space-y-3">
                <ProviderStatusPill tone="warn" left={<Bell size={12} />}>Pending Review</ProviderStatusPill>
                <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-4">
                  <div className="text-[12px] font-extrabold text-faith-ink">Verification checklist</div>
                  <div className="mt-2 space-y-2">
                    {[
                      ['Logo', draft.logo],
                      ['Cover image', draft.coverImage],
                      ['Bio', draft.bio],
                      ['Mission', draft.missionStatement],
                      ['Certificate', draft.registrationCertificate],
                      ['Identity', draft.identityDocument],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between rounded-xl border border-faith-line/70 bg-[var(--fh-surface-bg)] px-3 py-2">
                        <span className="text-[12px] font-semibold text-faith-ink">{label}</span>
                        <span className={cx('text-[11px] font-extrabold', value ? 'text-emerald-700' : 'text-faith-slate')}>
                          {value ? 'Added' : 'Missing'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <Button variant="secondary" className="w-full" onClick={() => navigate(ROUTES.dashboard)}>
                  Open dashboard
                </Button>
              </div>
            </ProviderSectionCard>
          </div>
        </div>
      </Box>
    </ProviderPageScaffold>
  );
}

export function ProviderDashboardPage() {
  const navigate = useNavigate();
  const auth = useOptionalAuth();
  const [services] = useStoredState<ServiceRecord[]>(STORAGE_KEYS.services, DEFAULT_SERVICES);
  const [campaigns] = useStoredState<CampaignRecord[]>(STORAGE_KEYS.campaigns, DEFAULT_CAMPAIGNS);
  const [sessions] = useStoredState<LiveSessionRecord[]>(STORAGE_KEYS.liveSessions, DEFAULT_LIVE_SESSIONS);
  const [assets] = useStoredState<AssetRecord[]>(STORAGE_KEYS.assets, DEFAULT_ASSETS);

  const profileStatus = auth?.onboardingStatus === 'approved' ? 'Approved' : 'Pending Review';
  const notifications = 4;
  const approvedServices = services.filter((service) => service.status === 'Approved' || service.status === 'Published').length;
  const activeCampaigns = campaigns.filter((campaign) => campaign.status === 'Active').length;
  const liveSessions = sessions.filter((session) => session.status === 'Scheduled' || session.status === 'Ready' || session.status === 'Live').length;
  const approvedAssets = assets.filter((asset) => asset.status === 'Approved').length;

  return (
    <ProviderPageScaffold
      icon={<LayoutDashboard className="h-6 w-6" />}
      title="Provider Dashboard"
      subtitle="Mission control for provider approvals, services, campaigns, content, and live session readiness."
      tags={
        <>
          <ProviderStatusPill tone={statusTone(profileStatus)} left={<ShieldCheck size={12} />}>{profileStatus}</ProviderStatusPill>
          <ProviderStatusPill tone="neutral" left={<Gauge size={12} />}>{approvedServices} services approved</ProviderStatusPill>
          <ProviderStatusPill tone="neutral" left={<Bell size={12} />}>{notifications} notifications</ProviderStatusPill>
        </>
      }
      pulse={<Alert severity="info">The new provider journey keeps registration, approvals, and live operations visible in one place.</Alert>}
      actions={
        <>
          <Button variant="outline" onClick={() => navigate(ROUTES.profile)}>Complete profile</Button>
          <Button variant="secondary" onClick={() => navigate(ROUTES.liveDashboard)}>Live sessions</Button>
        </>
      }
      stats={
        <>
          <KpiTile label="Profile status" value={profileStatus} hint="Approval gate for the workspace." tone={profileStatus === 'Approved' ? 'green' : 'orange'} />
          <KpiTile label="Services" value={services.length.toString()} hint={`${approvedServices} approved or published.`} tone="green" />
          <KpiTile label="Campaigns" value={campaigns.length.toString()} hint={`${activeCampaigns} active campaigns.`} tone="orange" />
          <KpiTile label="Live sessions" value={sessions.length.toString()} hint={`${liveSessions} scheduled or ready.`} tone="navy" />
          <KpiTile label="Assets" value={approvedAssets.toString()} hint="Approved assets available for live sessions." tone="green" />
        </>
      }
    >
      <Box className="space-y-4">
        <JourneyRail currentPath={ROUTES.dashboard} />

        <div className="grid gap-4 xl:grid-cols-12">
          <div className="space-y-4 xl:col-span-8">
            <ProviderSectionCard title="Phased rollout" subtitle="Track the provider journey in the same order the project is being delivered.">
              <div className="grid gap-3 md:grid-cols-2">
                {DASHBOARD_PHASES.map((phase, index) => {
                  const Icon = phase.icon;
                  const phaseTone =
                    index === 0 && profileStatus !== 'Approved'
                      ? 'warn'
                      : index < 3 && (services.length > 0 || campaigns.length > 0 || assets.length > 0)
                        ? 'good'
                        : index === 5
                          ? 'brand'
                          : 'neutral';

                  return (
                    <div key={phase.label} className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface-bg)] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                            <Icon size={18} />
                          </span>
                          <div>
                            <div className="text-[13px] font-extrabold text-faith-ink">{phase.label}</div>
                            <div className="mt-1 text-[12px] text-faith-slate">{phase.summary}</div>
                          </div>
                        </div>
                        <ProviderStatusPill tone={phaseTone}>
                          {index === 0 && profileStatus !== 'Approved' ? 'In progress' : index === 5 ? 'Polish' : 'Ready'}
                        </ProviderStatusPill>
                      </div>
                      <Button variant="outline" className="mt-4 w-full" onClick={() => navigate(phase.route)}>
                        Open phase
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ProviderSectionCard>

            <ProviderSectionCard title="Quick actions" subtitle="Move directly into the next part of the provider journey.">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { label: 'Create Service', icon: BriefcaseBusiness, path: ROUTES.serviceBuilder },
                  { label: 'Create Campaign', icon: Megaphone, path: ROUTES.campaignBuilder },
                  { label: 'Upload Content', icon: Upload, path: ROUTES.contentUpload },
                  { label: 'Create Live Session', icon: Radio, path: ROUTES.liveBuilder },
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => navigate(action.path)}
                      className="flex items-center justify-between rounded-2xl border border-faith-line/70 bg-[var(--fh-surface-bg)] px-4 py-4 text-left transition-colors hover:bg-[var(--fh-surface)]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                          <Icon size={18} />
                        </span>
                        <div>
                          <div className="text-[13px] font-extrabold text-faith-ink">{action.label}</div>
                          <div className="text-[11px] text-faith-slate">Open the matching workspace</div>
                        </div>
                      </div>
                      <ArrowRight size={14} />
                    </button>
                  );
                })}
              </div>
            </ProviderSectionCard>

            <ProviderSectionCard title="Recent operations" subtitle="A compact overview of approvals, content, and live readiness.">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-4">
                  <div className="text-[12px] font-extrabold text-faith-ink">Approval queue</div>
                  <div className="mt-3 space-y-2">
                    {['Profile review pending', '1 service awaiting review', '1 campaign awaiting review', '2 assets pending review'].map((item) => (
                      <div key={item} className="flex items-center justify-between rounded-xl border border-faith-line/70 bg-[var(--fh-surface-bg)] px-3 py-2">
                        <span className="text-[12px] text-faith-ink">{item}</span>
                        <CheckCircle2 size={14} className="text-emerald-700" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-4">
                  <div className="text-[12px] font-extrabold text-faith-ink">Operational focus</div>
                  <div className="mt-3 space-y-2">
                    {[
                      'Finalize provider profile assets',
                      'Approve service visuals',
                      'Upload campaign banner',
                      'Schedule the next live session',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2 rounded-xl border border-faith-line/70 bg-[var(--fh-surface-bg)] px-3 py-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        <span className="text-[12px] text-faith-ink">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ProviderSectionCard>
          </div>

          <div className="space-y-4 xl:col-span-4">
            <ProviderSectionCard title="Workspace summary" subtitle="A live snapshot of the provider brand and readiness.">
              <div className="space-y-3">
                <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-4">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Workspace</div>
                  <div className="mt-1 text-[16px] font-black text-faith-ink">{auth?.workspace?.brand || 'FaithHub Provider'}</div>
                  <div className="mt-1 text-[12px] text-faith-slate">{auth?.workspace?.campus || 'Kampala'} campus - approval-driven operations</div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => navigate(ROUTES.assetLibrary)}>
                  Open asset library
                </Button>
                <Button variant="secondary" className="w-full" onClick={() => navigate(ROUTES.liveStudio)}>
                  Preview live studio
                </Button>
              </div>
            </ProviderSectionCard>
          </div>
        </div>
      </Box>
    </ProviderPageScaffold>
  );
}

export function ServiceManagementPage() {
  const navigate = useNavigate();
  const [services, setServices] = useStoredState<ServiceRecord[]>(STORAGE_KEYS.services, DEFAULT_SERVICES);
  const [selectedId, setSelectedId] = useState(services[0]?.id || '');
  const selected = services.find((service) => service.id === selectedId) ?? services[0];

  useEffect(() => {
    if (!selectedId && services[0]) {
      setSelectedId(services[0].id);
    }
  }, [selectedId, services]);

  const deleteService = (id: string) => {
    setServices((current) => current.filter((service) => service.id !== id));
    if (selectedId === id) setSelectedId('');
  };

  return (
    <ProviderPageScaffold
      icon={<BriefcaseBusiness className="h-6 w-6" />}
      title="Service Management"
      subtitle="Track provider services, review their approval state, and move selected services into live campaign work."
      tags={
        <>
          <ProviderStatusPill tone="neutral" left={<Gauge size={12} />}>{services.length} services</ProviderStatusPill>
          <ProviderStatusPill tone="warn" left={<TimerReset size={12} />}>{services.filter((service) => service.status === 'Pending Review').length} pending</ProviderStatusPill>
        </>
      }
      actions={<Button variant="primary" onClick={() => navigate(ROUTES.serviceBuilder)}><Plus size={14} /> Create Service</Button>}
    >
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="space-y-3 xl:col-span-8">
          {services.length ? services.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedId(service.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedId(service.id);
                }
              }}
              className={cx(
                'flex w-full items-start justify-between rounded-[28px] border p-4 text-left transition-colors',
                selected?.id === service.id ? 'border-emerald-300 bg-emerald-50' : 'border-faith-line/70 bg-[var(--fh-surface-bg)] hover:bg-[var(--fh-surface)]',
              )}
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                  <ImageIcon size={22} />
                </div>
                <div className="min-w-0">
                  <div className="text-[14px] font-black text-faith-ink">{service.name}</div>
                  <div className="mt-1 text-[12px] text-faith-slate">{service.category} - {service.createdDate}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <ProviderStatusPill tone={statusTone(service.status)}>{service.status}</ProviderStatusPill>
                    <ProviderStatusPill tone="neutral">{service.duration}</ProviderStatusPill>
                    <ProviderStatusPill tone="neutral">{service.price}</ProviderStatusPill>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button variant="outline" onClick={() => navigate(ROUTES.serviceBuilder)}><PenLine size={14} /> Edit</Button>
                <Button variant="outline" onClick={() => deleteService(service.id)}><Trash2 size={14} /> Delete</Button>
              </div>
            </div>
          )) : (
            <EmptyState
              title="No services yet"
              body="Create the first provider service so the approval workflow and dashboard metrics can start to populate."
              action={<Button variant="primary" onClick={() => navigate(ROUTES.serviceBuilder)}>Create Service</Button>}
            />
          )}
        </div>

        <div className="space-y-4 xl:col-span-4">
          <JourneyPhaseCard activePath={ROUTES.services} onNavigate={(path) => navigate(path)} />
          <ProviderSectionCard title="Selected service" subtitle="Review the currently selected service card.">
            {selected ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-4">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Preview</div>
                  <div className="mt-2 text-[15px] font-black text-faith-ink">{selected.name}</div>
                  <div className="mt-1 text-[12px] text-faith-slate">{selected.description}</div>
                </div>
                <Button variant="secondary" className="w-full" onClick={() => navigate(ROUTES.serviceBuilder)}>
                  Open service builder
                </Button>
              </div>
            ) : (
              <EmptyState
                title="Nothing selected"
                body="Select a service on the left to inspect its approval state and preview details."
              />
            )}
          </ProviderSectionCard>
        </div>
      </div>
    </ProviderPageScaffold>
  );
}

export function ServiceBuilderPage() {
  const navigate = useNavigate();
  const [, setServices] = useStoredState<ServiceRecord[]>(STORAGE_KEYS.services, DEFAULT_SERVICES);
  const [draft, setDraft] = useStoredState<ServiceDraft>(STORAGE_KEYS.serviceBuilder, {
    name: 'Prayer Support Session',
    category: 'Prayer Support',
    description: 'A gentle, prayer-focused service with approval-aware visuals and live-ready assets.',
    price: 'UGX 150,000',
    duration: '90 min',
    location: 'Online',
    image: '',
  } as ServiceDraft);
  const [notice, setNotice] = useState<string>('Drafts are stored locally. Submitting will place the service into the review queue.');
  const [status, setStatus] = useState<ServiceRecord['status']>('Draft');

  const update = <K extends keyof ServiceDraft>(key: K, value: ServiceDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const saveDraft = () => {
    setStatus('Draft');
    setNotice('Service draft saved locally.');
  };

  const submitReview = () => {
    const required = [draft.name, draft.category, draft.description, draft.price, draft.duration, draft.location].every((value) => normalizeText(value).length > 0);
    if (!required) {
      setNotice('Please complete the service title, category, description, price, duration, and location.');
      return;
    }
    const nextService: ServiceRecord = {
      id: `service-${Date.now()}`,
      createdDate: new Date().toISOString().slice(0, 10),
      status: 'Pending Review',
      ...draft,
    };
    setServices((current) => [nextService, ...current]);
    setStatus('Pending Review');
    setNotice('Service submitted for review. The service management list now reflects the new approval state.');
    navigate(ROUTES.services);
  };

  return (
    <ProviderPageScaffold
      icon={<BriefcaseBusiness className="h-6 w-6" />}
      title="Create Service"
      subtitle="Create a provider service with approved visuals, pricing, and live-usable details."
      tags={
        <>
          <ProviderStatusPill tone={statusTone(status)}>{status}</ProviderStatusPill>
          <ProviderStatusPill tone="neutral">Draft supported</ProviderStatusPill>
          <ProviderStatusPill tone="neutral">Submit for review</ProviderStatusPill>
        </>
      }
      pulse={<Alert severity="info">{notice}</Alert>}
      actions={
        <>
          <Button variant="outline" onClick={saveDraft}>Save Draft</Button>
          <Button variant="primary" onClick={submitReview}>Submit For Review</Button>
        </>
      }
    >
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <ProviderSectionCard title="Service details" subtitle="Describe the service in a way that is clear for the provider dashboard and campaign flow.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Service Title" value={draft.name} onChange={(value) => update('name', value)} />
              <SelectField label="Category" value={draft.category} onChange={(value) => update('category', value)} options={SERVICE_CATEGORIES} />
              <div className="md:col-span-2">
                <Field label="Description" value={draft.description} onChange={(value) => update('description', value)} rows={4} />
              </div>
              <Field label="Price" value={draft.price} onChange={(value) => update('price', value)} />
              <Field label="Duration" value={draft.duration} onChange={(value) => update('duration', value)} />
              <Field label="Location" value={draft.location} onChange={(value) => update('location', value)} />
              <Field label="Featured Image" value={draft.image} onChange={(value) => update('image', value)} placeholder="Upload file name or image URL" />
            </div>
          </ProviderSectionCard>

          <ProviderSectionCard title="Gallery and media" subtitle="Mock gallery uploads and video assets are ready for the later live session workflow.">
            <div className="grid gap-3 md:grid-cols-3">
              {['Gallery image 1', 'Gallery image 2', 'Video teaser'].map((item) => (
                <div key={item} className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-4">
                  <div className="text-[12px] font-extrabold text-faith-ink">{item}</div>
                  <div className="mt-2 text-[11px] text-faith-slate">Preview placeholder</div>
                </div>
              ))}
            </div>
          </ProviderSectionCard>
        </div>

        <div className="space-y-4 xl:col-span-4">
          <ProviderSectionCard title="Status palette" subtitle="Service status states used throughout the provider journey.">
            <div className="flex flex-wrap gap-2">
              {(['Draft', 'Pending Review', 'Approved', 'Rejected', 'Published'] as const).map((state) => (
                <ProviderStatusPill key={state} tone={statusTone(state)}>{state}</ProviderStatusPill>
              ))}
            </div>
          </ProviderSectionCard>
          <ProviderSectionCard title="Preview card" subtitle="A compact summary of the service card as it will appear in the list.">
            <div className="space-y-3">
              <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-4">
                <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Preview</div>
                <div className="mt-2 text-[15px] font-black text-faith-ink">{draft.name}</div>
                <div className="mt-1 text-[12px] text-faith-slate">{draft.category} - {draft.location}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <ProviderStatusPill tone="neutral">{draft.price}</ProviderStatusPill>
                  <ProviderStatusPill tone="neutral">{draft.duration}</ProviderStatusPill>
                </div>
              </div>
              <Button variant="secondary" className="w-full" onClick={() => navigate(ROUTES.services)}>Back to services</Button>
            </div>
          </ProviderSectionCard>
        </div>
      </div>
    </ProviderPageScaffold>
  );
}

export function CampaignManagementPage() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useStoredState<CampaignRecord[]>(STORAGE_KEYS.campaigns, DEFAULT_CAMPAIGNS);
  const [selectedId, setSelectedId] = useState(campaigns[0]?.id || '');
  const selected = campaigns.find((campaign) => campaign.id === selectedId) ?? campaigns[0];

  const deleteCampaign = (id: string) => {
    setCampaigns((current) => current.filter((campaign) => campaign.id !== id));
    if (selectedId === id) setSelectedId('');
  };

  return (
    <ProviderPageScaffold
      icon={<Megaphone className="h-6 w-6" />}
      title="Campaign Management"
      subtitle="Track campaigns, approval state, and campaign windows from the provider side."
      tags={
        <>
          <ProviderStatusPill tone="neutral">{campaigns.length} campaigns</ProviderStatusPill>
          <ProviderStatusPill tone="warn">{campaigns.filter((campaign) => campaign.status === 'Pending Review').length} pending</ProviderStatusPill>
          <ProviderStatusPill tone="good">{campaigns.filter((campaign) => campaign.status === 'Active').length} active</ProviderStatusPill>
        </>
      }
      actions={<Button variant="primary" onClick={() => navigate(ROUTES.campaignBuilder)}><Plus size={14} /> Create Campaign</Button>}
    >
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="space-y-3 xl:col-span-8">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              onClick={() => setSelectedId(campaign.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedId(campaign.id);
                }
              }}
              className={cx(
                'flex w-full items-start justify-between rounded-[28px] border p-4 text-left transition-colors',
                selected?.id === campaign.id ? 'border-emerald-300 bg-emerald-50' : 'border-faith-line/70 bg-[var(--fh-surface-bg)] hover:bg-[var(--fh-surface)]',
              )}
            >
              <div>
                <div className="text-[14px] font-black text-faith-ink">{campaign.name}</div>
                <div className="mt-1 text-[12px] text-faith-slate">{campaign.objective} - {campaign.startDate} to {campaign.endDate}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <ProviderStatusPill tone={statusTone(campaign.status)}>{campaign.status}</ProviderStatusPill>
                  <ProviderStatusPill tone="neutral">{campaign.services.length} services</ProviderStatusPill>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button variant="outline" onClick={() => navigate(ROUTES.campaignBuilder)}><PenLine size={14} /> Edit</Button>
                <Button variant="outline" onClick={() => deleteCampaign(campaign.id)}><Trash2 size={14} /> Delete</Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 xl:col-span-4">
          <JourneyPhaseCard activePath={ROUTES.campaigns} onNavigate={(path) => navigate(path)} />
          <ProviderSectionCard title="Selected campaign" subtitle="The campaign preview mirrors the status cards used in the dashboard.">
            {selected ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-4">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Banner</div>
                  <div className="mt-2 text-[14px] font-black text-faith-ink">{selected.name}</div>
                  <div className="mt-1 text-[12px] text-faith-slate">{selected.banner}</div>
                </div>
                <Button variant="secondary" className="w-full" onClick={() => navigate(ROUTES.campaignBuilder)}>
                  Open campaign builder
                </Button>
              </div>
            ) : (
              <EmptyState title="No campaign selected" body="Choose a campaign to inspect its status and live scheduling readiness." />
            )}
          </ProviderSectionCard>
        </div>
      </div>
    </ProviderPageScaffold>
  );
}

export function CampaignBuilderPage() {
  const navigate = useNavigate();
  const [, setCampaigns] = useStoredState<CampaignRecord[]>(STORAGE_KEYS.campaigns, DEFAULT_CAMPAIGNS);
  const [services] = useStoredState<ServiceRecord[]>(STORAGE_KEYS.services, DEFAULT_SERVICES);
  const [draft, setDraft] = useStoredState<CampaignDraft>(STORAGE_KEYS.campaignBuilder, {
    name: 'June Prayer Equipping',
    objective: 'Community Engagement',
    startDate: '2026-06-08',
    endDate: '2026-06-21',
    banner: '',
    description: 'A campaign that promotes prayer content, live sessions, and approved service listings.',
    services: ['Prayer Night Production Pack'],
  });
  const [notice, setNotice] = useState<string>('Campaign drafts are local until submitted.');

  const update = <K extends keyof CampaignDraft>(key: K, value: CampaignDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const saveDraft = () => setNotice('Campaign draft saved locally.');

  const submitCampaign = () => {
    const required = [draft.name, draft.objective, draft.startDate, draft.endDate, draft.banner, draft.description].every((value) => normalizeText(value).length > 0);
    if (!required) {
      setNotice('Please complete the campaign name, objective, dates, banner, and description.');
      return;
    }
    const record: CampaignRecord = {
      id: `campaign-${Date.now()}`,
      name: draft.name,
      objective: draft.objective,
      startDate: draft.startDate,
      endDate: draft.endDate,
      banner: draft.banner,
      description: draft.description,
      services: draft.services,
      status: 'Pending Review',
    };
    setCampaigns((current) => [record, ...current]);
    setNotice('Campaign submitted. The management list now shows the new review state.');
    navigate(ROUTES.campaigns);
  };

  const toggleService = (serviceName: string) => {
    setDraft((current) => ({
      ...current,
      services: current.services.includes(serviceName)
        ? current.services.filter((value) => value !== serviceName)
        : [...current.services, serviceName],
    }));
  };

  return (
    <ProviderPageScaffold
      icon={<Megaphone className="h-6 w-6" />}
      title="Create Campaign"
      subtitle="Build a campaign around an approved service list, banner art, and a clear objective."
      tags={
        <>
          <ProviderStatusPill tone="warn">Pending Review</ProviderStatusPill>
          <ProviderStatusPill tone="good">Approved</ProviderStatusPill>
          <ProviderStatusPill tone="good">Active</ProviderStatusPill>
        </>
      }
      pulse={<Alert severity="info">{notice}</Alert>}
      actions={
        <>
          <Button variant="outline" onClick={saveDraft}>Save Draft</Button>
          <Button variant="primary" onClick={submitCampaign}>Submit Campaign</Button>
        </>
      }
    >
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <ProviderSectionCard title="Campaign details" subtitle="The details below shape the review card and campaign approval status.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Campaign Name" value={draft.name} onChange={(value) => update('name', value)} />
              <SelectField label="Objective" value={draft.objective} onChange={(value) => update('objective', value)} options={CAMPAIGN_OBJECTIVES} />
              <Field label="Start Date" value={draft.startDate} onChange={(value) => update('startDate', value)} type="date" />
              <Field label="End Date" value={draft.endDate} onChange={(value) => update('endDate', value)} type="date" />
              <div className="md:col-span-2">
                <Field label="Description" value={draft.description} onChange={(value) => update('description', value)} rows={4} />
              </div>
              <Field label="Banner" value={draft.banner} onChange={(value) => update('banner', value)} placeholder="Upload banner file name or image URL" />
            </div>
          </ProviderSectionCard>

          <ProviderSectionCard title="Associated services" subtitle="Choose the approved services this campaign should promote.">
            <div className="grid gap-3 md:grid-cols-2">
              {services.map((service) => (
                <ToggleField
                  key={service.id}
                  label={service.name}
                  detail={`${service.category} - ${service.status}`}
                  checked={draft.services.includes(service.name)}
                  onChange={() => toggleService(service.name)}
                />
              ))}
            </div>
          </ProviderSectionCard>
        </div>

        <div className="space-y-4 xl:col-span-4">
          <ProviderSectionCard title="Preview card" subtitle="Campaign approval state and banner information at a glance.">
            <div className="space-y-3">
              <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-4">
                <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Campaign</div>
                <div className="mt-2 text-[14px] font-black text-faith-ink">{draft.name}</div>
                <div className="mt-1 text-[12px] text-faith-slate">{draft.objective}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <ProviderStatusPill tone="neutral">{draft.startDate || 'Start date'}</ProviderStatusPill>
                  <ProviderStatusPill tone="neutral">{draft.endDate || 'End date'}</ProviderStatusPill>
                </div>
              </div>
              <Button variant="secondary" className="w-full" onClick={() => navigate(ROUTES.campaigns)}>
                Back to campaigns
              </Button>
            </div>
          </ProviderSectionCard>
        </div>
      </div>
    </ProviderPageScaffold>
  );
}

export function ContentUploadPage() {
  const navigate = useNavigate();
  const [assets, setAssets] = useStoredState<AssetRecord[]>(STORAGE_KEYS.assets, DEFAULT_ASSETS);
  const [queue, setQueue] = useState<Array<{ id: string; name: string; type: AssetRecord['type']; progress: number }>>([]);
  const [activeType, setActiveType] = useState<(typeof CONTENT_TYPES)[number]>('Poster');
  const [notice, setNotice] = useState<string>('Drag and drop content here or use the upload control to seed the asset library.');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!queue.length) return;
    const interval = window.setInterval(() => {
      setQueue((current) => current.map((item) => ({ ...item, progress: Math.min(item.progress + 25, 100) })));
    }, 180);
    return () => window.clearInterval(interval);
  }, [queue.length]);

  useEffect(() => {
    const ready = queue.filter((item) => item.progress >= 100);
    if (!ready.length) return;
    setAssets((current) => [
      ...ready.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        status: 'Pending Review' as const,
        preview: `${item.name} preview`,
      })),
      ...current,
    ]);
    setQueue((current) => current.filter((item) => item.progress < 100));
    setNotice('Uploads completed and queued for review.');
  }, [queue, setAssets]);

  const seedFiles = (files: File[]) => {
    const next = files.map((file, index) => ({
      id: `upload-${Date.now()}-${index}`,
      name: file.name,
      type: activeType,
      progress: 0,
    }));
    setQueue((current) => [...next, ...current]);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files || []);
    if (!files.length) return;
    seedFiles(files);
    setNotice(`${files.length} file(s) added to the upload queue.`);
  };

  return (
    <ProviderPageScaffold
      icon={<Upload className="h-6 w-6" />}
      title="Content Upload"
      subtitle="Drag and drop posters, videos, banners, thumbnails, and flyers into the approval queue."
      tags={
        <>
          <ProviderStatusPill tone="warn">Pending Review</ProviderStatusPill>
          <ProviderStatusPill tone="good">Approved</ProviderStatusPill>
          <ProviderStatusPill tone="danger">Rejected</ProviderStatusPill>
        </>
      }
      pulse={<Alert severity="info">{notice}</Alert>}
      actions={
        <>
          <Button variant="outline" onClick={() => navigate(ROUTES.assetLibrary)}>Open Asset Library</Button>
        </>
      }
    >
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <ProviderSectionCard title="Upload area" subtitle="Drop content in the box below and let the mock upload progress run.">
            <div
              onDrop={onDrop}
              onDragOver={(event) => event.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-[28px] border-2 border-dashed border-faith-line/70 bg-[var(--fh-surface-bg)] p-8 text-center transition-colors hover:bg-[var(--fh-surface)]"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Upload size={22} />
              </div>
              <div className="mt-4 text-[16px] font-black text-faith-ink">Drag and drop files here</div>
              <div className="mt-2 text-[13px] leading-6 text-faith-slate">Upload posters, videos, banners, thumbnails, and flyers for approval.</div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(event) => {
                  const files = Array.from(event.target.files || []);
                  if (!files.length) return;
                  seedFiles(files);
                  setNotice(`${files.length} file(s) queued for upload.`);
                }}
              />
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {CONTENT_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveType(type);
                    }}
                    className={cx(
                      'rounded-full border px-3 py-2 text-[11px] font-extrabold transition-colors',
                      activeType === type ? 'border-emerald-300 bg-emerald-50 text-faith-ink' : 'border-faith-line/70 bg-[var(--fh-surface-bg)] text-faith-slate',
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </ProviderSectionCard>

          {queue.length ? (
            <ProviderSectionCard title="Upload progress" subtitle="The mock upload queue animates until the assets move into review.">
              <div className="space-y-3">
                {queue.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-black text-faith-ink">{item.name}</div>
                        <div className="text-[11px] text-faith-slate">{item.type}</div>
                      </div>
                      <ProviderStatusPill tone={item.progress === 100 ? 'good' : 'warn'}>{item.progress}%</ProviderStatusPill>
                    </div>
                    <LinearProgress variant="determinate" value={item.progress} sx={{ mt: 2, height: 8, borderRadius: 999 }} />
                  </div>
                ))}
              </div>
            </ProviderSectionCard>
          ) : null}
        </div>

        <div className="space-y-4 xl:col-span-4">
          <JourneyPhaseCard activePath={ROUTES.contentUpload} onNavigate={(path) => navigate(path)} />
          <ProviderSectionCard title="Latest assets" subtitle="Recently uploaded items land in the library with approval labels.">
            <div className="space-y-2">
              {assets.slice(0, 4).map((asset) => (
                <div key={asset.id} className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[12px] font-black text-faith-ink">{asset.name}</div>
                      <div className="text-[11px] text-faith-slate">{asset.type}</div>
                    </div>
                    <ProviderStatusPill tone={statusTone(asset.status)}>{asset.status}</ProviderStatusPill>
                  </div>
                </div>
              ))}
            </div>
          </ProviderSectionCard>
        </div>
      </div>
    </ProviderPageScaffold>
  );
}

export function AssetLibraryPage() {
  const navigate = useNavigate();
  const [assets] = useStoredState<AssetRecord[]>(STORAGE_KEYS.assets, DEFAULT_ASSETS);
  const [selectedAssetIds, setSelectedAssetIds] = useStoredState<string[]>(STORAGE_KEYS.selectedAssetIds, []);
  const [filter, setFilter] = useState<'All' | AssetRecord['type']>('All');

  const filtered = useMemo(() => {
    if (filter === 'All') return assets;
    return assets.filter((asset) => asset.type === filter);
  }, [assets, filter]);

  const toggleAsset = (id: string, approved: boolean) => {
    if (!approved) return;
    setSelectedAssetIds((current) => (current.includes(id) ? current.filter((assetId) => assetId !== id) : [...current, id]));
  };

  return (
    <ProviderPageScaffold
      icon={<FolderKanban className="h-6 w-6" />}
      title="Asset Library"
      subtitle="Only approved assets can be selected for live sessions. Use the filters to narrow the library by type."
      tags={
        <>
          <ProviderStatusPill tone="good">{assets.filter((asset) => asset.status === 'Approved').length} approved</ProviderStatusPill>
          <ProviderStatusPill tone="warn">{assets.filter((asset) => asset.status === 'Pending Review').length} pending</ProviderStatusPill>
          <ProviderStatusPill tone="neutral">{selectedAssetIds.length} selected</ProviderStatusPill>
        </>
      }
      actions={<Button variant="secondary" onClick={() => navigate(ROUTES.liveBuilder)}>Use in live session</Button>}
    >
      <ProviderSectionCard title="Filters" subtitle="Choose the asset type that should show in the grid.">
        <div className="flex flex-wrap gap-2">
          {(['All', 'Image', 'Video', 'Poster', 'Banner', 'Thumbnail'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={cx(
                'rounded-full border px-3 py-2 text-[11px] font-extrabold transition-colors',
                filter === item ? 'border-emerald-300 bg-emerald-50 text-faith-ink' : 'border-faith-line/70 bg-[var(--fh-surface-bg)] text-faith-slate',
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </ProviderSectionCard>

      {filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((asset) => {
            const approved = asset.status === 'Approved';
            const selected = selectedAssetIds.includes(asset.id);
            return (
              <button
                key={asset.id}
                type="button"
                onClick={() => toggleAsset(asset.id, approved)}
                className={cx(
                  'rounded-[28px] border p-4 text-left transition-colors',
                  selected ? 'border-emerald-300 bg-emerald-50' : 'border-faith-line/70 bg-[var(--fh-surface-bg)] hover:bg-[var(--fh-surface)]',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                      <FileImage size={20} />
                    </div>
                    <div>
                      <div className="text-[13px] font-black text-faith-ink">{asset.name}</div>
                      <div className="text-[11px] text-faith-slate">{asset.type}</div>
                    </div>
                  </div>
                  <ProviderStatusPill tone={statusTone(asset.status)}>{asset.status}</ProviderStatusPill>
                </div>
                <div className="mt-3 text-[12px] leading-6 text-faith-slate">{asset.preview}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">
                    {approved ? 'Selectable for live sessions' : 'Locked until approval'}
                  </span>
                  <span className="text-[11px] font-bold text-faith-ink">{selected ? 'Selected' : 'Select'}</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No assets match the filter"
          body="Switch the filter chip or upload more content to populate the library."
          action={<Button variant="primary" onClick={() => navigate(ROUTES.contentUpload)}>Upload Content</Button>}
        />
      )}
    </ProviderPageScaffold>
  );
}

export function LiveSessionBuilderPage() {
  const navigate = useSafeNavigate();
  const [, setSessions] = useStoredState<LiveSessionRecord[]>(STORAGE_KEYS.liveSessions, DEFAULT_LIVE_SESSIONS);
  const [services] = useStoredState<ServiceRecord[]>(STORAGE_KEYS.services, DEFAULT_SERVICES);
  const [selectedAssetIds] = useStoredState<string[]>(STORAGE_KEYS.selectedAssetIds, []);
  const [draft, setDraft] = useStoredState<LiveSessionDraft>(STORAGE_KEYS.liveSessionDraft, {
    title: 'Sunday Grace Live',
    campaign: 'FaithHub Launch Week',
    host: 'Pastor Miriam N.',
    guestSpeakers: ['Minister Daniel K.'],
    featuredServices: ['Sunday Worship Livestream Support'],
    thumbnail: '',
    date: '2026-06-12',
    time: '19:30',
    duration: '75 min',
    description: 'A provider live session with a clear waiting room, countdown, and approval queue.',
    waitingRoomEnabled: true,
    countdownEnabled: true,
    remindersEnabled: true,
  });
  const [notice, setNotice] = useState<string>('Build the live session, save a draft, then submit it for approval.');

  const approvedServices = useMemo(
    () => services.filter((service) => service.status === 'Approved' || service.status === 'Published').map((service) => service.name),
    [services],
  );

  const update = <K extends keyof LiveSessionDraft>(key: K, value: LiveSessionDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const toggleService = (serviceName: string) => {
    setDraft((current) => ({
      ...current,
      featuredServices: current.featuredServices.includes(serviceName)
        ? current.featuredServices.filter((item) => item !== serviceName)
        : [...current.featuredServices, serviceName],
    }));
  };

  const saveDraft = () => {
    const startDateTime = new Date(`${draft.date}T${draft.time}:00+03:00`);
    const durationMinutes = Number.parseInt(draft.duration, 10) || 60;
    const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60_000);

    saveLiveFlowDraft({
      title: draft.title,
      subtitle: draft.campaign,
      summary: draft.description,
      parentLabel: draft.campaign,
      parentType: 'Standalone Live',
      sessionType: 'Live Session',
      campus: 'Online Campus',
      language: 'English',
      audience: 'FaithHub Provider Audience',
      speaker: draft.host,
      startISO: startDateTime.toISOString(),
      endISO: endDateTime.toISOString(),
      timezone: 'Africa/Kampala',
      status: 'Draft',
    });
    setNotice('Live session draft saved locally.');
  };

  const submitForApproval = () => {
    const complete = [draft.title, draft.campaign, draft.host, draft.date, draft.time, draft.duration].every((value) => normalizeText(value).length > 0);
    if (!complete) {
      setNotice('Complete the session title, campaign, host, date, time, and duration before submission.');
      return;
    }
    const nextSession: LiveSessionRecord = {
      id: `session-${Date.now()}`,
      title: draft.title,
      campaign: draft.campaign,
      host: draft.host,
      guestSpeakers: draft.guestSpeakers,
      featuredServices: draft.featuredServices.length ? draft.featuredServices : approvedServices.slice(0, 1),
      thumbnail: draft.thumbnail,
      date: draft.date,
      time: draft.time,
      duration: draft.duration,
      status: 'Pending Approval',
      description: draft.description,
      waitingRoomEnabled: draft.waitingRoomEnabled,
      countdownEnabled: draft.countdownEnabled,
      remindersEnabled: draft.remindersEnabled,
    };
    setSessions((current) => [nextSession, ...current]);
    setNotice('Live session submitted. Continue into schedule and waiting room preview.');
    navigate(ROUTES.liveSchedule);
  };

  return (
    <ProviderPageScaffold
      icon={<Radio className="h-6 w-6" />}
      title="Create Live Session"
      subtitle="Build the live session, attach approved services and assets, then submit it for approval."
      tags={
        <>
          <ProviderStatusPill tone="neutral">Draft</ProviderStatusPill>
          <ProviderStatusPill tone="warn">Pending Approval</ProviderStatusPill>
          <ProviderStatusPill tone="good">Scheduled</ProviderStatusPill>
        </>
      }
      pulse={<Alert severity="info">{notice}</Alert>}
      actions={
        <>
          <Button variant="outline" onClick={saveDraft}>Save Live Session</Button>
          <Button variant="primary" onClick={submitForApproval}>Submit For Approval</Button>
        </>
      }
    >
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <ProviderSectionCard title="Session details" subtitle="The live session card follows the StreamYard/Riverside style briefing layout.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Session Title" value={draft.title} onChange={(value) => update('title', value)} />
              <Field label="Campaign" value={draft.campaign} onChange={(value) => update('campaign', value)} />
              <Field label="Host" value={draft.host} onChange={(value) => update('host', value)} />
              <Field label="Thumbnail" value={draft.thumbnail} onChange={(value) => update('thumbnail', value)} placeholder="Upload thumbnail file name or URL" />
              <Field label="Date" value={draft.date} onChange={(value) => update('date', value)} type="date" />
              <Field label="Time" value={draft.time} onChange={(value) => update('time', value)} type="time" />
              <Field label="Duration" value={draft.duration} onChange={(value) => update('duration', value)} />
              <div className="md:col-span-2">
                <Field label="Description" value={draft.description} onChange={(value) => update('description', value)} rows={4} />
              </div>
            </div>
          </ProviderSectionCard>

          <ProviderSectionCard title="Guest speakers and featured services" subtitle="Pick from approved services and add the guest speakers for the live session.">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Guest speakers</div>
                {draft.guestSpeakers.map((speaker, index) => (
                  <div key={`${speaker}-${index}`} className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface-bg)] px-3 py-2 text-[12px] font-semibold text-faith-ink">
                    {speaker}
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => update('guestSpeakers', [...draft.guestSpeakers, `Guest ${draft.guestSpeakers.length + 1}`])}>
                  Add guest speaker
                </Button>
              </div>
              <div className="space-y-2">
                <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Featured services</div>
                {approvedServices.map((serviceName) => (
                  <ToggleField
                    key={serviceName}
                    label={serviceName}
                    checked={draft.featuredServices.includes(serviceName)}
                    onChange={() => toggleService(serviceName)}
                    detail="Approved service"
                  />
                ))}
              </div>
            </div>
          </ProviderSectionCard>
        </div>

        <div className="space-y-4 xl:col-span-4">
          <JourneyPhaseCard activePath={ROUTES.liveBuilder} onNavigate={(path) => navigate(path)} />
          <ProviderSectionCard title="Live settings" subtitle="Waiting room and reminders are toggled here before submission.">
            <div className="space-y-3">
              <ToggleField label="Waiting Room Enabled" checked={draft.waitingRoomEnabled} onChange={(value) => update('waitingRoomEnabled', value)} detail="Enable the pre-live waiting room experience." />
              <ToggleField label="Enable Countdown Timer" checked={draft.countdownEnabled} onChange={(value) => update('countdownEnabled', value)} detail="Show a live countdown before the stream begins." />
              <ToggleField label="Enable Reminders" checked={draft.remindersEnabled} onChange={(value) => update('remindersEnabled', value)} detail="Let the audience receive reminder prompts." />
            </div>
          </ProviderSectionCard>

          <ProviderSectionCard title="Approval preview" subtitle="Selected assets and services will be checked before the live session is approved.">
            <div className="space-y-2">
              <ProviderStatusPill tone="neutral">{selectedAssetIds.length} approved assets selected</ProviderStatusPill>
              <Button variant="secondary" className="w-full" onClick={() => navigate(ROUTES.assetLibrary)}>Open asset library</Button>
            </div>
          </ProviderSectionCard>
        </div>
      </div>
    </ProviderPageScaffold>
  );
}

export function LiveSchedulePage() {
  const navigate = useSafeNavigate();
  const sessions = useMemo(() => getLiveSessionsFromFlow(), []);
  const [selectedId, setSelectedId] = useState<string>(getQuerySessionId() || sessions[0]?.id || '');
  const selected = sessions.find((session) => session.id === selectedId) ?? sessions[0];

  return (
    <ProviderPageScaffold
      icon={<CalendarClock className="h-6 w-6" />}
      title="Schedule Session"
      subtitle="Confirm the session window, then move the audience into the waiting room before the live launch."
      tags={
        <>
          <ProviderStatusPill tone="neutral">Schedule queue</ProviderStatusPill>
          <ProviderStatusPill tone="warn">Waiting room</ProviderStatusPill>
          <ProviderStatusPill tone="good">Go live</ProviderStatusPill>
        </>
      }
      actions={<Button variant="primary" onClick={() => navigate(`${ROUTES.liveStudio}?sessionId=${encodeURIComponent(selected?.id || selectedId)}`)}><PlayCircle size={14} /> Open Live Studio</Button>}
    >
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="space-y-3 xl:col-span-7">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setSelectedId(session.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedId(session.id);
                }
              }}
              className={cx(
                'flex w-full items-start justify-between rounded-[28px] border p-4 text-left transition-colors',
                selected?.id === session.id ? 'border-emerald-300 bg-emerald-50' : 'border-faith-line/70 bg-[var(--fh-surface-bg)] hover:bg-[var(--fh-surface)]',
              )}
            >
              <div>
                <div className="text-[14px] font-black text-faith-ink">{session.title}</div>
                <div className="mt-1 text-[12px] text-faith-slate">{session.date} - {session.time} - {session.duration}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <ProviderStatusPill tone={statusTone(session.status)}>{session.status}</ProviderStatusPill>
                  <ProviderStatusPill tone="neutral">{session.campaign}</ProviderStatusPill>
                </div>
              </div>
              <ArrowRight size={14} />
            </div>
          ))}
        </div>

        <div className="space-y-4 xl:col-span-5">
          <JourneyPhaseCard activePath={ROUTES.liveSchedule} onNavigate={(path) => navigate(path)} />
          <ProviderSectionCard title="Schedule details" subtitle="Keep the selected session visible while scheduling and waiting-room preparation happen.">
            {selected ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-4">
                  <div className="text-[12px] font-extrabold text-faith-ink">{selected.title}</div>
                  <div className="mt-1 text-[11px] text-faith-slate">{selected.description}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <ProviderStatusPill tone="neutral">{selected.host}</ProviderStatusPill>
                    <ProviderStatusPill tone="neutral">{selected.date}</ProviderStatusPill>
                    <ProviderStatusPill tone="neutral">{selected.time}</ProviderStatusPill>
                  </div>
                </div>
                <Button variant="secondary" className="w-full" onClick={() => navigate(`${ROUTES.waitingRoom}?sessionId=${encodeURIComponent(selected.id)}`)}>
                  Preview Waiting Room
                </Button>
              </div>
            ) : (
              <EmptyState title="No scheduled session selected" body="Choose a session from the list to prepare the waiting room and studio handoff." />
            )}
          </ProviderSectionCard>
        </div>
      </div>
    </ProviderPageScaffold>
  );
}

export function LiveDashboardPage() {
  const navigate = useSafeNavigate();
  const initialSessions = useMemo(() => getLiveSessionsFromFlow(), []);
  const [sessions, setSessions] = useState<LiveSessionRecord[]>(initialSessions);
  const [selectedId, setSelectedId] = useState<string>(getQuerySessionId() || initialSessions[0]?.id || '');
  const selected = sessions.find((session) => session.id === selectedId) ?? sessions[0];

  const deleteSession = (id: string) => {
    setSessions((current) => current.filter((session) => session.id !== id));
    if (selectedId === id) setSelectedId('');
  };

  return (
    <ProviderPageScaffold
      icon={<MonitorPlay className="h-6 w-6" />}
      title="Live Session Management"
      subtitle="Track live sessions, approve the lineup, and move into the waiting room or studio when ready."
      tags={
        <>
          <ProviderStatusPill tone="neutral">{sessions.length} sessions</ProviderStatusPill>
          <ProviderStatusPill tone="warn">{sessions.filter((session) => session.status === 'Pending Approval').length} pending</ProviderStatusPill>
          <ProviderStatusPill tone="good">{sessions.filter((session) => session.status === 'Scheduled' || session.status === 'Ready').length} ready</ProviderStatusPill>
        </>
      }
      actions={<Button variant="primary" onClick={() => navigate(ROUTES.liveBuilder)}><Plus size={14} /> Create Live Session</Button>}
    >
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="space-y-3 xl:col-span-8">
          {sessions.map((session) => (
            <div
              key={session.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedId(session.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedId(session.id);
                }
              }}
              className={cx(
                'flex w-full items-start justify-between rounded-[28px] border p-4 text-left transition-colors',
                selected?.id === session.id ? 'border-emerald-300 bg-emerald-50' : 'border-faith-line/70 bg-[var(--fh-surface-bg)] hover:bg-[var(--fh-surface)]',
              )}
            >
              <div>
                <div className="text-[14px] font-black text-faith-ink">{session.title}</div>
                <div className="mt-1 text-[12px] text-faith-slate">{session.campaign} - {session.date} - {session.time}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <ProviderStatusPill tone={statusTone(session.status)}>{session.status}</ProviderStatusPill>
                  <ProviderStatusPill tone="neutral">{session.duration}</ProviderStatusPill>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => navigate(`${ROUTES.liveSessionDetails}?sessionId=${encodeURIComponent(session.id)}`)}><Eye size={14} /> View</Button>
                <Button variant="outline" onClick={() => deleteSession(session.id)}><Trash2 size={14} /> Delete</Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 xl:col-span-4">
          <JourneyPhaseCard activePath={ROUTES.liveDashboard} onNavigate={(path) => navigate(path)} />
          <ProviderSectionCard title="Selected session" subtitle="Open the details view or jump straight to the waiting room.">
            {selected ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-4">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Session</div>
                  <div className="mt-1 text-[14px] font-black text-faith-ink">{selected.title}</div>
                  <div className="mt-1 text-[12px] text-faith-slate">{selected.description}</div>
                  <select
                    aria-label="Session selector"
                    value={selected.id}
                    onChange={(event) => setSelectedId(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-faith-line/70 bg-[var(--fh-surface-bg)] px-3 py-2 text-[12px] font-semibold text-faith-ink"
                  >
                    {sessions.map((session) => (
                      <option key={session.id} value={session.id}>
                        {session.title}
                      </option>
                    ))}
                  </select>
                </div>
                <Button variant="secondary" className="w-full" onClick={() => navigate(`${ROUTES.liveSessionDetails}?sessionId=${encodeURIComponent(selected.id)}`)}>
                  Open session details
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate(`${ROUTES.waitingRoom}?sessionId=${encodeURIComponent(selected.id)}`)}>
                  Preview waiting room
                </Button>
                <Button variant="primary" className="w-full" onClick={() => navigate(`${ROUTES.liveStudio}?sessionId=${encodeURIComponent(selected.id)}`)}>
                  Live Studio
                </Button>
              </div>
            ) : (
              <EmptyState title="No session selected" body="Choose a session from the list to inspect its schedule and approval state." />
            )}
          </ProviderSectionCard>
        </div>
      </div>
    </ProviderPageScaffold>
  );
}

export function LiveSessionDetailsPage() {
  const navigate = useSafeNavigate();
  const sessions = useMemo(() => getLiveSessionsFromFlow(), []);
  const [selectedId] = useState<string>(getQuerySessionId() || sessions[0]?.id || '');
  const selected = sessions.find((session) => session.id === selectedId) ?? sessions[0];

  const duplicateSession = () => {
    if (!selected) return;
    void selected;
  };

  return (
    <ProviderPageScaffold
      icon={<ClipboardCheck className="h-6 w-6" />}
      title="Live Session Details"
      subtitle="Review the session banner, host line-up, featured services, and the waiting room preview shortcut."
      tags={
        <>
          <ProviderStatusPill tone={selected ? statusTone(selected.status) : 'neutral'}>{selected?.status || 'No session selected'}</ProviderStatusPill>
          <ProviderStatusPill tone="neutral">Session details</ProviderStatusPill>
        </>
      }
      actions={
        <>
          <Button variant="outline" onClick={() => navigate(`${ROUTES.liveBuilder}?sessionId=${encodeURIComponent(selected?.id || '')}`)}>Edit</Button>
          <Button variant="outline" onClick={duplicateSession}>Duplicate</Button>
          <Button variant="primary" onClick={() => navigate(`${ROUTES.waitingRoom}?sessionId=${encodeURIComponent(selected?.id || '')}`)}>Preview Waiting Room</Button>
        </>
      }
    >
      {selected ? (
        <div className="grid gap-4 xl:grid-cols-12">
          <div className="space-y-4 xl:col-span-8">
            <ProviderSectionCard title="Session banner" subtitle="This hero card is the first thing the audience sees in the waiting room.">
              <div className="rounded-[28px] border border-faith-line/70 bg-[var(--fh-surface)] p-5">
                <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Campaign</div>
                <div className="mt-2 text-[24px] font-black text-faith-ink">{selected.title}</div>
                <div className="mt-2 text-[13px] text-faith-slate">{selected.description}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ProviderStatusPill tone="neutral">{selected.host}</ProviderStatusPill>
                  <ProviderStatusPill tone="neutral">{selected.date}</ProviderStatusPill>
                  <ProviderStatusPill tone="neutral">{selected.time}</ProviderStatusPill>
                </div>
              </div>
            </ProviderSectionCard>

            <ProviderSectionCard title="Session details" subtitle="A compact summary of host, guest speakers, and featured services.">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface-bg)] p-4">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Host</div>
                  <div className="mt-1 text-[13px] font-black text-faith-ink">{selected.host}</div>
                </div>
                <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface-bg)] p-4">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Guest speakers</div>
                  <div className="mt-1 text-[13px] font-black text-faith-ink">{selected.guestSpeakers.join(', ')}</div>
                </div>
                <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface-bg)] p-4">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Campaign</div>
                  <div className="mt-1 text-[13px] font-black text-faith-ink">{selected.campaign}</div>
                </div>
                <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface-bg)] p-4">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Featured services</div>
                  <div className="mt-1 text-[13px] font-black text-faith-ink">{selected.featuredServices.join(', ')}</div>
                </div>
              </div>
            </ProviderSectionCard>
          </div>

          <div className="space-y-4 xl:col-span-4">
            <JourneyPhaseCard activePath={ROUTES.liveSessionDetails} onNavigate={(path) => navigate(path)} />
            <ProviderSectionCard title="Preview action" subtitle="Use the waiting room button to move into the pre-live view.">
              <Button variant="primary" className="w-full" onClick={() => navigate(`${ROUTES.waitingRoom}?sessionId=${encodeURIComponent(selected?.id || '')}`)}>
                Preview Waiting Room
              </Button>
            </ProviderSectionCard>
          </div>
        </div>
      ) : (
        <EmptyState title="No session selected" body="Open the live dashboard and choose a session before reviewing details." action={<Button variant="primary" onClick={() => navigate(ROUTES.liveDashboard)}>Open live dashboard</Button>} />
      )}
    </ProviderPageScaffold>
  );
}

export function WaitingRoomPage() {
  const navigate = useSafeNavigate();
  const sessions = useMemo(() => getLiveSessionsFromFlow(), []);
  const [selectedId] = useState<string>(getQuerySessionId() || sessions[0]?.id || '');
  const selected = sessions.find((session) => session.id === selectedId) ?? sessions[0];
  const [countdown, setCountdown] = useState('Starts in 14:30');
  const [reminded, setReminded] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCountdown((current) => {
        const parts = current.replace('Starts in ', '').split(':').map((item) => Number(item));
        if (parts.length !== 2 || parts.some(Number.isNaN)) return current;
        let [minutes, seconds] = parts;
        if (seconds === 0) {
          if (minutes === 0) return 'Starts now';
          minutes -= 1;
          seconds = 59;
        } else {
          seconds -= 1;
        }
        return `Starts in ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <ProviderPageScaffold
      icon={<TimerReset className="h-6 w-6" />}
      title="Waiting Room Preview"
      subtitle="The waiting room highlights the banner, countdown, reminders, and featured service stack before the session starts."
      tags={
        <>
          <ProviderStatusPill tone="warn">{countdown}</ProviderStatusPill>
          <ProviderStatusPill tone={reminded ? 'good' : 'neutral'}>{reminded ? 'Reminder sent' : 'Reminder ready'}</ProviderStatusPill>
        </>
      }
      actions={<Button variant="primary" onClick={() => navigate(`${ROUTES.liveStudio}?sessionId=${encodeURIComponent(selected?.id || selectedId)}`)}>Go Live</Button>}
    >
      {selected ? (
        <div className="grid gap-4 xl:grid-cols-12">
          <div className="space-y-4 xl:col-span-8">
            <ProviderSectionCard title="Waiting room banner" subtitle="This mock area mirrors the public pre-live screen.">
              <div className="rounded-[28px] border border-faith-line/70 bg-[var(--fh-surface)] p-6">
                <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Session banner</div>
                <div className="mt-2 text-[26px] font-black text-faith-ink">{selected.title}</div>
                <div className="mt-2 text-[13px] leading-6 text-faith-slate">{selected.description}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ProviderStatusPill tone="neutral">{selected.host}</ProviderStatusPill>
                  <ProviderStatusPill tone="neutral">{selected.campaign}</ProviderStatusPill>
                  <ProviderStatusPill tone="neutral">{selected.duration}</ProviderStatusPill>
                </div>
              </div>
            </ProviderSectionCard>

            <ProviderSectionCard title="Session information" subtitle="Countdown, host details, and featured services sit beside the reminder action.">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface-bg)] p-4">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Countdown</div>
                  <div className="mt-1 text-[15px] font-black text-faith-ink">{countdown}</div>
                </div>
                <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface-bg)] p-4">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Host information</div>
                  <div className="mt-1 text-[15px] font-black text-faith-ink">{selected.host}</div>
                </div>
                <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface-bg)] p-4">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Description</div>
                  <div className="mt-1 text-[13px] text-faith-ink">{selected.description}</div>
                </div>
                <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface-bg)] p-4">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Featured services</div>
                  <div className="mt-1 text-[13px] text-faith-ink">{selected.featuredServices.join(', ')}</div>
                </div>
              </div>
            </ProviderSectionCard>
          </div>

          <div className="space-y-4 xl:col-span-4">
            <JourneyPhaseCard activePath={ROUTES.waitingRoom} onNavigate={(path) => navigate(path)} />
            <ProviderSectionCard title="Reminder action" subtitle="Send a reminder while the audience waits for the session to begin.">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setReminded(true)}
              >
                {reminded ? 'Reminder Sent' : 'Send Reminder'}
              </Button>
              <div className="mt-4 rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-4 text-center">
                <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">CTA</div>
                <div className="mt-1 text-[16px] font-black text-faith-ink">Session Starts Soon</div>
              </div>
            </ProviderSectionCard>
          </div>
        </div>
      ) : (
        <EmptyState title="No session selected" body="Choose a session from live management before previewing the waiting room." action={<Button variant="primary" onClick={() => navigate(ROUTES.liveDashboard)}>Open live dashboard</Button>} />
      )}
    </ProviderPageScaffold>
  );
}

export function LiveStudioPage() {
  const navigate = useSafeNavigate();
  const initialSessions = useMemo(() => getLiveSessionsFromFlow(), []);
  const [sessions, setSessions] = useState<LiveSessionRecord[]>(initialSessions);
  const [selectedId] = useState<string>(getQuerySessionId() || initialSessions[0]?.id || '');
  const selected = sessions.find((session) => session.id === selectedId) ?? sessions[0];
  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(4863);
  const [chat, setChat] = useState([
    'Welcome everyone to the waiting room.',
    'Please prepare for the live stream.',
    'FaithHub support is ready backstage.',
  ]);

  useEffect(() => {
    if (!isLive) return;
    const interval = window.setInterval(() => {
      setViewerCount((current) => current + 6);
      setChat((current) => [`New audience message at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, ...current].slice(0, 6));
    }, 2500);
    return () => window.clearInterval(interval);
  }, [isLive]);

  const startSession = () => {
    setIsLive(true);
    setSessions((current) => current.map((session) => (session.id === selected?.id ? { ...session, status: 'Live' } : session)));
  };

  const endSession = () => {
    setIsLive(false);
    setSessions((current) => current.map((session) => (session.id === selected?.id ? { ...session, status: 'Ended' } : session)));
    navigate(ROUTES.liveDashboard);
  };

  return (
    <ProviderPageScaffold
      icon={<MonitorPlay className="h-6 w-6" />}
      title="Go Live Screen"
      subtitle="A livestream control room inspired by StreamYard and Riverside, with a host panel, guest panel, chat, and viewer counter."
      tags={
        <>
          <ProviderStatusPill tone={isLive ? 'good' : 'warn'}>{isLive ? 'Live' : 'Standby'}</ProviderStatusPill>
          <ProviderStatusPill tone="neutral">{viewerCount.toLocaleString()} viewers</ProviderStatusPill>
          <ProviderStatusPill tone="neutral">{selected?.title || 'Session not selected'}</ProviderStatusPill>
        </>
      }
      actions={
        <>
          <Button variant="outline" onClick={() => navigate(ROUTES.liveDashboard)}>Back to dashboard</Button>
          <Button variant="secondary" onClick={() => navigate(`${ROUTES.waitingRoom}?sessionId=${encodeURIComponent(selected?.id || selectedId)}`)}>Preview waiting room</Button>
          <Button variant="primary" onClick={() => navigate(`/faithhub/provider/stream-to-platforms?sessionId=${encodeURIComponent(selected?.id || selectedId)}`)}>
            Stream-to-Platforms
          </Button>
        </>
      }
    >
      {selected ? (
        <div className="grid gap-4 xl:grid-cols-12">
          <div className="space-y-4 xl:col-span-8">
            <ProviderSectionCard title="Program and preview" subtitle="The center stage stays focused on the live program while the audience chat sits nearby.">
              <div className="rounded-[32px] border border-faith-line/70 bg-slate-950 p-5 text-white shadow-lg">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-emerald-300">Live studio</div>
                    <div className="mt-1 text-[22px] font-black">{selected.title}</div>
                    <div className="mt-1 text-[12px] text-slate-300">{selected.host} - {selected.campaign}</div>
                  </div>
                  <ProviderStatusPill tone={isLive ? 'good' : 'warn'}>{isLive ? 'LIVE NOW' : 'READY TO GO LIVE'}</ProviderStatusPill>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-300">Host panel</div>
                    <div className="mt-2 text-[15px] font-black">{selected.host}</div>
                    <div className="mt-1 text-[12px] text-slate-300">Camera, mic, and production controls are ready.</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-300">Guest speaker panel</div>
                    <div className="mt-2 text-[15px] font-black">{selected.guestSpeakers.join(', ')}</div>
                    <div className="mt-1 text-[12px] text-slate-300">Guest seats stay visible before and during the stream.</div>
                  </div>
                </div>
              </div>
            </ProviderSectionCard>

            <div className="grid gap-4 md:grid-cols-2">
              <ProviderSectionCard title="Live chat" subtitle="Mock chat messages update while the session is live.">
                <div className="space-y-2">
                  {chat.map((message, index) => (
                    <div key={`${message}-${index}`} className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] px-3 py-2 text-[12px] text-faith-ink">
                      {message}
                    </div>
                  ))}
                </div>
              </ProviderSectionCard>
              <ProviderSectionCard title="Viewer counter" subtitle="The counter moves upward during the live session to simulate audience growth.">
                <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-4">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Viewers</div>
                  <div className="mt-1 text-[28px] font-black text-faith-ink">{viewerCount.toLocaleString()}</div>
                  <div className="mt-1 text-[12px] text-faith-slate">Audience visibility updates while live.</div>
                </div>
              </ProviderSectionCard>
            </div>
          </div>

          <div className="space-y-4 xl:col-span-4">
            <JourneyPhaseCard activePath={ROUTES.liveStudio} onNavigate={(path) => navigate(path)} />
            <ProviderSectionCard title="Controls" subtitle="Start or end the session from the studio control bar.">
              <div className="space-y-3">
                <Button variant="primary" className="w-full" onClick={startSession} disabled={isLive}>
                  Start Session
                </Button>
                <Button variant="outline" className="w-full" onClick={endSession} disabled={!isLive}>
                  End Session
                </Button>
              </div>
            </ProviderSectionCard>
          </div>
        </div>
      ) : (
        <EmptyState title="No live session selected" body="Open the live dashboard and choose a session before launching the studio." action={<Button variant="primary" onClick={() => navigate(ROUTES.liveDashboard)}>Open live dashboard</Button>} />
      )}
    </ProviderPageScaffold>
  );
}
