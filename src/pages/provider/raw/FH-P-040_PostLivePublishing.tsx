// @ts-nocheck
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useNotification } from '@/contexts/NotificationContext';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { navigateWithRouter } from "@/navigation/routerNavigate";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Bell,
  BookOpen,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  Eye,
  ExternalLink,
  FileText,
  Film,
  Gift,
  Globe2,
  Image as ImageIcon,
  Info,
  Layers,
  Link2,
  MessageCircle,
  PlayCircle,
  QrCode,
  Radio,
  Scissors,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Wand2,
  X,
  Zap,
} from 'lucide-react';

/**
 * FaithHub — Post-live Publishing
 * ----------------------------------------
 * Premium replay packaging workspace for FaithHub Live Sessions.
 *
 * Page intent
 * - Rebuild the creator/e-commerce post-live page into a FaithHub replay publishing surface.
 * - Preserve the creator-style premium format: sticky command header, left operational workspace,
 *   right-side readiness + preview rail, and an expanded preview drawer.
 * - Use EVzone Green as primary, Orange as secondary, with FaithHub neutral greys.
 *
 * Notes
 * - Self-contained mock TSX page built with Tailwind-style utility classes.
 * - Replace mocked records and route constants during integration.
 */

const EV_GREEN = '#03cd8c';
const EV_ORANGE = '#f77f00';
const EV_GREY = '#a6a6a6';
const EV_LIGHT = '#f2f2f2';

const ROUTES = {
  replaysAndClips: '/faithhub/provider/replays-and-clips',
  audienceNotifications: '/faithhub/provider/audience-notifications',
  beaconBuilder: '/faithhub/provider/beacon-builder',
  liveDashboard: '/faithhub/provider/live-dashboard',
};

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=60';

const cx = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(' ');

function safeNav(url: string) {
  navigateWithRouter(url);
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function fmtLocal(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function fmtInt(n: number) {
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

type ProcessingState = 'Processing' | 'Ready for publish' | 'Published';
type AccessLevel = 'Public' | 'Members' | 'Supporters';
type PreviewMode = 'desktop' | 'mobile';
type QualityTone = 'good' | 'warn' | 'bad' | 'brand' | 'accent' | 'neutral';

type Chapter = {
  id: string;
  timecode: string;
  title: string;
  speaker: string;
  scripture: string;
};

type SurfaceItem = {
  key: string;
  label: string;
  hint: string;
  enabled: boolean;
};

type VisibilityOption = {
  key: string;
  label: string;
  hint: string;
  enabled: boolean;
};

type ResourceLink = {
  id: string;
  label: string;
  hint: string;
  value: string;
  enabled: boolean;
};

type QualityCheck = {
  label: string;
  status: 'Pass' | 'Warn' | 'Fail';
  detail: string;
};

function Pill({
  children,
  tone = 'neutral',
  title,
}: {
  children: React.ReactNode;
  tone?: QualityTone;
  title?: string;
}) {
  const cls =
    tone === 'good'
      ? 'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20'
      : tone === 'warn'
        ? 'bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20'
        : tone === 'bad'
          ? 'bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20'
          : tone === 'brand'
            ? 'text-white shadow-sm ring-0'
            : tone === 'accent'
              ? 'text-white shadow-sm ring-0'
              : 'bg-slate-100 text-slate-800 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700';

  return (
    <span
      title={title}
      className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-bold ring-1 whitespace-nowrap transition', cls)}
      style={tone === 'brand' ? { background: EV_GREEN } : tone === 'accent' ? { background: EV_ORANGE } : undefined}
    >
      {children}
    </span>
  );
}

function Btn({
  children,
  onClick,
  tone = 'neutral',
  disabled,
  left,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: 'neutral' | 'primary' | 'accent' | 'ghost';
  disabled?: boolean;
  left?: React.ReactNode;
  title?: string;
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';
  const cls =
    tone === 'primary'
      ? 'text-white hover:brightness-95 shadow-sm'
      : tone === 'accent'
        ? 'text-white hover:brightness-95 shadow-sm'
        : tone === 'ghost'
          ? 'bg-transparent text-slate-900 dark:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800'
          : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 ring-1 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm';

  return (
    <button
      type="button"
      title={title}
      className={cx(base, cls)}
      style={tone === 'primary' ? { background: EV_GREEN } : tone === 'accent' ? { background: EV_ORANGE } : undefined}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {left}
      {children}
    </button>
  );
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => (!disabled ? onChange(!checked) : undefined)}
      className={cx(
        'relative inline-flex h-6 w-11 items-center rounded-full transition',
        disabled ? 'bg-slate-200 dark:bg-slate-800 cursor-not-allowed opacity-70' : checked ? 'bg-slate-900 dark:bg-slate-100' : 'bg-slate-300 dark:bg-slate-700',
      )}
      aria-pressed={checked}
    >
      <span className={cx('inline-block h-5 w-5 transform rounded-full bg-white dark:bg-slate-900 shadow-sm transition', checked ? 'translate-x-5' : 'translate-x-1')} />
    </button>
  );
}

function Drawer({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 transition-colors">
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 px-5 py-4">
            <div className="min-w-0">
              <div className="truncate text-base font-bold text-slate-900 dark:text-slate-50">{title}</div>
              {subtitle ? <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</div> : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-5 md:px-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Meter({ value, tone = 'brand' }: { value: number; tone?: 'brand' | 'accent' | 'warn' }) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const bg = tone === 'accent' ? EV_ORANGE : tone === 'warn' ? '#f59e0b' : EV_GREEN;
  return (
    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div className="h-full rounded-full transition-all" style={{ width: `${clamped}%`, background: bg }} />
    </div>
  );
}

function SectionHead({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="text-sm font-bold text-slate-900 dark:text-slate-50">{title}</div>
        {subtitle ? <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{subtitle}</div> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-500">{children}</div>;
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-2 w-full rounded-2xl bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 ring-1 ring-slate-200 dark:ring-slate-700 outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 transition"
    />
  );
}

function TextArea({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string;
  onChange: (next: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="mt-2 w-full rounded-2xl bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 ring-1 ring-slate-200 dark:ring-slate-700 outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 transition"
    />
  );
}

function BrowserPreview({
  title,
  description,
  accessLevel,
  notesAttached,
  resourcesEnabled,
  downloadsEnabled,
  beaconReady,
  scheduledLabel,
}: {
  title: string;
  description: string;
  accessLevel: AccessLevel;
  notesAttached: number;
  resourcesEnabled: number;
  downloadsEnabled: boolean;
  beaconReady: boolean;
  scheduledLabel: string;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm transition">
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-rose-400" />
        <span className="h-3 w-3 rounded-full bg-amber-400" />
        <span className="h-3 w-3 rounded-full" style={{ background: EV_GREEN }} />
        <div className="ml-2 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">faithhub replay page</div>
      </div>
      <div className="p-4">
        <div className="overflow-hidden rounded-3xl bg-[#07162f] p-4 text-white">
          <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-white/75">
            <span>{scheduledLabel}</span>
            <span>{accessLevel}</span>
          </div>
          <div className="mt-3 h-36 rounded-3xl bg-gradient-to-r from-[#0e274d] via-[#193f6d] to-[#0f1838] p-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold backdrop-blur">Replay ready</div>
            <div className="mt-4 max-w-[420px] text-2xl font-extrabold leading-tight">{title}</div>
            <div className="mt-2 max-w-[460px] line-clamp-2 text-[13px] text-white/80">{description}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold">Watch replay</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold">Read notes</span>
              {beaconReady ? <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold">Promoted replay</span> : null}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 text-[11px]">
            <div className="rounded-2xl bg-white/8 p-3">
              <div className="text-white/60">Notes attached</div>
              <div className="mt-1 text-lg font-black">{notesAttached}</div>
            </div>
            <div className="rounded-2xl bg-white/8 p-3">
              <div className="text-white/60">Resources live</div>
              <div className="mt-1 text-lg font-black">{resourcesEnabled}</div>
            </div>
            <div className="rounded-2xl bg-white/8 p-3">
              <div className="text-white/60">Downloads</div>
              <div className="mt-1 text-lg font-black">{downloadsEnabled ? 'ON' : 'OFF'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhonePreview({
  title,
  accessLevel,
  notesAttached,
  givePromptEnabled,
  watchSurface,
}: {
  title: string;
  accessLevel: AccessLevel;
  notesAttached: number;
  givePromptEnabled: boolean;
  watchSurface: string;
}) {
  return (
    <div className="mx-auto w-full max-w-[320px] md:max-w-[360px]">
      <div className="overflow-hidden rounded-[36px] bg-[#08132c] p-3 shadow-2xl">
        <div className="rounded-[28px] bg-white dark:bg-slate-950 overflow-hidden transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">FaithHub replay</div>
              <div className="mt-0.5 text-sm font-black text-slate-900 dark:text-slate-50">{accessLevel}</div>
            </div>
            <div className="h-10 w-10 rounded-2xl" style={{ background: EV_GREEN }} />
          </div>
          <div className="p-4">
            <div className="rounded-3xl bg-slate-100 dark:bg-slate-900 p-3">
              <div className="h-32 rounded-3xl bg-slate-300/60 dark:bg-slate-700" />
              <div className="mt-3 text-[15px] font-black leading-tight text-slate-900 dark:text-slate-50">{title}</div>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-bold text-white dark:bg-slate-100 dark:text-slate-900">Watch replay</div>
            </div>
            <div className="mt-3 space-y-2 text-[11px]">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 px-3 py-2 text-slate-700 dark:text-slate-300">{watchSurface}</div>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 px-3 py-2 text-slate-700 dark:text-slate-300">Notes attached · {notesAttached}</div>
              {givePromptEnabled ? <div className="rounded-2xl border border-slate-200 dark:border-slate-800 px-3 py-2 text-slate-700 dark:text-slate-300">Giving prompt included</div> : null}
              <div className="rounded-2xl px-3 py-3 text-center text-white font-black" style={{ background: EV_ORANGE }}>View follow-up actions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PostLivePublishingPage() {
  const { showSuccess, showNotification } = useNotification();
  const { run, isPending } = useAsyncAction();

  const session = useMemo(
    () => ({
      id: 'LS-24051',
      title: 'Sunday Encounter — The Way of Grace',
      source: 'Series · Grace in Motion / Episode 03',
      presenter: 'Pastor Miriam K.',
      endedISO: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
      replayUrl: 'https://faithhub.evzone.app/replay/LS-24051',
      coverUrl: DEFAULT_COVER,
      destinationLabel: 'FaithHub Home + Replay Library',
    }),
    [],
  );

  const [processingState, setProcessingState] = useState<ProcessingState>('Ready for publish');
  const [title, setTitle] = useState('Sunday Encounter Replay — The Way of Grace');
  const [description, setDescription] = useState(
    'A polished replay package for Sunday Encounter featuring chaptered scripture moments, cleaned sermon notes, follow-up giving prompts, and post-live resources for Grace in Motion.',
  );
  const [trimHeadSec, setTrimHeadSec] = useState(18);
  const [trimTailSec, setTrimTailSec] = useState(24);
  const [removeDeadAir, setRemoveDeadAir] = useState(true);
  const [removeWaitingRoom, setRemoveWaitingRoom] = useState(true);
  const [coverFrame, setCoverFrame] = useState('Frame 03');
  const [transcriptReady, setTranscriptReady] = useState(true);
  const [speakerLabelsEnabled, setSpeakerLabelsEnabled] = useState(true);
  const [searchableScripture, setSearchableScripture] = useState(true);
  const [subtitleConfidence, setSubtitleConfidence] = useState(96);
  const [notesText, setNotesText] = useState(
    'Main takeaway: grace restores identity before it changes behavior. Add study prompts, ministry reflection, and a clear prayer response for replay viewers.',
  );
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('Public');
  const [downloadsEnabled, setDownloadsEnabled] = useState(false);
  const [scheduleRelease, setScheduleRelease] = useState(false);
  const [releaseAt, setReleaseAt] = useState('2026-04-09T20:30');
  const [featuredPlacement, setFeaturedPlacement] = useState(true);
  const [queueExternalAssets, setQueueExternalAssets] = useState(true);
  const [sendReplayJourney, setSendReplayJourney] = useState(true);
  const [beaconReady, setBeaconReady] = useState(true);
  const [donationAsk, setDonationAsk] = useState(true);
  const [eventTieIn, setEventTieIn] = useState(false);
  const [campaignTieIn, setCampaignTieIn] = useState(true);
  const [moderationClear, setModerationClear] = useState(true);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [previewOpen, setPreviewOpen] = useState(false);

  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: 'ch_1',
      timecode: '00:00',
      title: 'Welcome and opening prayer',
      speaker: 'Pastor Miriam K.',
      scripture: 'Psalm 23',
    },
    {
      id: 'ch_2',
      timecode: '06:12',
      title: 'Grace restores identity',
      speaker: 'Pastor Miriam K.',
      scripture: 'Ephesians 2:8–10',
    },
    {
      id: 'ch_3',
      timecode: '18:34',
      title: 'Prayer response and giving moment',
      speaker: 'Ministry Team',
      scripture: '2 Corinthians 9:7',
    },
  ]);

  const [visibleSections, setVisibleSections] = useState<VisibilityOption[]>([
    {
      key: 'opener',
      label: 'Countdown and opening bumper',
      hint: 'Hide pre-service countdown and hold music.',
      enabled: false,
    },
    {
      key: 'sermon',
      label: 'Main sermon segment',
      hint: 'Keep the core teaching visible for replay viewers.',
      enabled: true,
    },
    {
      key: 'giving',
      label: 'Giving and crowdfund moment',
      hint: 'Retain the live generosity moment inside the replay.',
      enabled: true,
    },
    {
      key: 'closing',
      label: 'Closing prayer and ministry response',
      hint: 'Show the ministry close and follow-up invitation.',
      enabled: true,
    },
  ]);

  const [surfaces, setSurfaces] = useState<SurfaceItem[]>([
    { key: 'home', label: 'FaithHub Home feed', hint: 'Primary discovery feed for followers and recommended viewers.', enabled: true },
    { key: 'series', label: 'Series landing page', hint: 'Replay appears on the parent series and episode.', enabled: true },
    { key: 'library', label: 'Replay library', hint: 'Adds the replay to the institution library.', enabled: true },
    { key: 'search', label: 'Global search', hint: 'Uses chapters and transcript to improve discovery.', enabled: true },
    { key: 'featured', label: 'Featured shelf', hint: 'Premium featured placement for key ministry moments.', enabled: true },
  ]);

  const [resources, setResources] = useState<ResourceLink[]>([
    {
      id: 'notes',
      label: 'Sermon notes',
      hint: 'Attach the polished notes page or outline.',
      value: 'https://faithhub.evzone.app/resources/grace-notes',
      enabled: true,
    },
    {
      id: 'study',
      label: 'Study guide',
      hint: 'Replay viewers can keep learning after the session.',
      value: 'https://faithhub.evzone.app/resources/grace-study-guide',
      enabled: true,
    },
    {
      id: 'reading',
      label: 'Reading plan',
      hint: 'Optional devotional or reading plan link.',
      value: 'https://faithhub.evzone.app/resources/grace-reading-plan',
      enabled: true,
    },
    {
      id: 'event',
      label: 'Related event link',
      hint: 'Tie the replay to an upcoming gathering or next live.',
      value: 'https://faithhub.evzone.app/events/grace-night',
      enabled: false,
    },
    {
      id: 'giving',
      label: 'Giving prompt',
      hint: 'Surface generosity or ministry support inside replay.',
      value: 'https://faithhub.evzone.app/give/grace-fund',
      enabled: true,
    },
    {
      id: 'crowdfund',
      label: 'Charity crowdfund link',
      hint: 'Connect the replay to a charity crowdfunding campaign.',
      value: 'https://faithhub.evzone.app/crowdfund/school-restoration',
      enabled: true,
    },
    {
      id: 'faithmart',
      label: 'FaithMart resource bundle',
      hint: 'Attach a related product or bundle when relevant.',
      value: 'https://faithhub.evzone.app/faithmart/grace-bundle',
      enabled: false,
    },
    {
      id: 'beacon',
      label: 'Beacon promo asset',
      hint: 'Prepare the replay for a Beacon follow-up campaign.',
      value: 'Grace Replay Booster — Beacon asset pack',
      enabled: true,
    },
  ]);

  const notesAttached = useMemo(
    () => resources.filter((resource) => resource.enabled).length,
    [resources],
  );

  const visibleSurfaceCount = useMemo(
    () => surfaces.filter((surface) => surface.enabled).length,
    [surfaces],
  );

  const replayReadyChecks = useMemo<QualityCheck[]>(() => {
    const hasMetadata = title.trim().length >= 18 && description.trim().length >= 80;
    const hasResources = notesText.trim().length >= 40 && notesAttached >= 3;
    const chapterCoverage = chapters.length >= 3;
    const transcriptCoverage = transcriptReady && speakerLabelsEnabled && searchableScripture;
    const accessCoverage = visibleSurfaceCount >= 3;
    const subtitleTone: QualityCheck['status'] = subtitleConfidence >= 95 ? 'Pass' : subtitleConfidence >= 88 ? 'Warn' : 'Fail';

    return [
      {
        label: 'Replay packaging header',
        status: processingState === 'Published' || processingState === 'Ready for publish' ? 'Pass' : 'Warn',
        detail: 'Source session linked, artwork resolved, and recommended title generated.',
      },
      {
        label: 'Editorial cleanup',
        status: removeDeadAir && removeWaitingRoom ? 'Pass' : 'Warn',
        detail: `Head trim ${trimHeadSec}s · tail trim ${trimTailSec}s · cover ${coverFrame}`,
      },
      {
        label: 'Chapter + transcript structure',
        status: chapterCoverage && transcriptCoverage ? 'Pass' : 'Warn',
        detail: `${chapters.length} chapters · speaker labels ${speakerLabelsEnabled ? 'on' : 'off'} · scripture index ${searchableScripture ? 'on' : 'off'}`,
      },
      {
        label: 'Notes and resources',
        status: hasResources ? 'Pass' : 'Warn',
        detail: `${notesAttached} replay assets attached to the destination page.`,
      },
      {
        label: 'Replay access and discoverability',
        status: accessCoverage ? 'Pass' : 'Warn',
        detail: `${visibleSurfaceCount} FaithHub surfaces enabled${featuredPlacement ? ' · featured shelf requested' : ''}.`,
      },
      {
        label: 'Accessibility and subtitle confidence',
        status: subtitleTone,
        detail: `Transcript ${transcriptReady ? 'ready' : 'pending'} · subtitle confidence ${subtitleConfidence}%`,
      },
      {
        label: 'Moderation and unresolved issues',
        status: moderationClear ? 'Pass' : 'Fail',
        detail: moderationClear ? 'No unresolved moderation blocks on the replay asset.' : 'Replay is waiting on moderation clearance.',
      },
      {
        label: 'Follow-up actions',
        status: sendReplayJourney || beaconReady || donationAsk ? 'Pass' : 'Warn',
        detail: `${sendReplayJourney ? 'Replay journey ready' : 'Journey off'} · ${beaconReady ? 'Beacon handoff ready' : 'Beacon off'} · ${donationAsk ? 'Giving prompt on' : 'Giving prompt off'}`,
      },
    ];
  }, [
    title,
    description,
    notesText,
    notesAttached,
    chapters,
    transcriptReady,
    speakerLabelsEnabled,
    searchableScripture,
    visibleSurfaceCount,
    subtitleConfidence,
    moderationClear,
    sendReplayJourney,
    beaconReady,
    donationAsk,
    processingState,
    trimHeadSec,
    trimTailSec,
    removeDeadAir,
    removeWaitingRoom,
    coverFrame,
    featuredPlacement,
  ]);

  const readinessScore = useMemo(() => {
    const passed = replayReadyChecks.filter((item) => item.status === 'Pass').length;
    const warns = replayReadyChecks.filter((item) => item.status === 'Warn').length;
    return Math.max(0, Math.min(100, Math.round(((passed + warns * 0.65) / replayReadyChecks.length) * 100)));
  }, [replayReadyChecks]);

  const readinessLabel = readinessScore >= 92 ? 'Ready for publish' : readinessScore >= 80 ? 'Needs review' : 'At risk';

  const clipSuggestions = useMemo(
    () => [
      { label: 'Grace restores identity', duration: '0:44', hint: 'Strong replay opener + social clip candidate' },
      { label: 'Prayer response moment', duration: '1:08', hint: 'High emotional resonance for replay follow-up' },
      { label: 'Giving + crowdfund invitation', duration: '0:31', hint: 'Use for donor and campaign promotion' },
    ],
    [],
  );

  const watchSurface = useMemo(() => {
    if (featuredPlacement) return 'Featured replay shelf · ON';
    if (visibleSurfaceCount >= 4) return 'Replay discovery surfaces configured';
    return 'Standard replay visibility';
  }, [featuredPlacement, visibleSurfaceCount]);

  const handleAddChapter = () => {
    setChapters((prev) => [
      ...prev,
      {
        id: `ch_${Math.random().toString(16).slice(2, 8)}`,
        timecode: '00:00',
        title: 'New chapter',
        speaker: session.presenter,
        scripture: '',
      },
    ]);
  };

  const handleUpdateChapter = (id: string, patch: Partial<Chapter>) => {
    setChapters((prev) => prev.map((chapter) => (chapter.id === id ? { ...chapter, ...patch } : chapter)));
  };

  const handleRemoveChapter = (id: string) => {
    setChapters((prev) => prev.filter((chapter) => chapter.id !== id));
  };

  const copyReplayLink = async () => {
    const ok = await copyText(session.replayUrl);
    if (ok) showSuccess('Replay link copied');
    else showNotification('Could not copy replay link');
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f2f2f2] dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors overflow-x-hidden">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition">
        <div className="w-full px-4 md:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                <span>FaithHub</span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span>Provider</span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="text-slate-900 dark:text-slate-100 italic">Post-live Publishing</span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                  Post-live Publishing
                </div>
                <div className="flex flex-wrap gap-2">
                  <Pill tone="brand">
                    <Film className="h-3.5 w-3.5" /> Replay source linked
                  </Pill>
                  <Pill tone={readinessScore >= 92 ? 'good' : readinessScore >= 80 ? 'warn' : 'bad'}>
                    <CheckCircle2 className="h-3.5 w-3.5" /> {readinessLabel}
                  </Pill>
                  <Pill tone="accent">
                    <Zap className="h-3.5 w-3.5" /> Beacon follow-up ready
                  </Pill>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>{session.title}</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span>{session.source}</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span>Ended {fmtLocal(session.endedISO)}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Btn tone="neutral" onClick={copyReplayLink} left={<Copy className="h-4 w-4" />}>
                Copy replay link
              </Btn>
              <Btn tone="ghost" onClick={() => setPreviewOpen(true)} left={<Eye className="h-4 w-4" />}>
                Preview replay
              </Btn>
              <Btn tone="accent" onClick={() => showSuccess('Clip generation queued')} left={<Scissors className="h-4 w-4" />}>
                Generate clips
              </Btn>
              <Btn
                tone="neutral"
                onClick={() => showSuccess('Replay follow-up queued')}
                left={<Send className="h-4 w-4" />}
              >
                Send replay follow-up
              </Btn>
              <Btn
                tone="primary"
                disabled={isPending || readinessScore < 70}
                onClick={() =>
                  run(
                    async () => {
                      setProcessingState('Published');
                    },
                    { successMessage: 'Replay published successfully!' },
                  )
                }
                left={isPending ? <CircularProgress size={16} color="inherit" /> : <CheckCircle2 className="h-4 w-4" />}
              >
                Publish replay
              </Btn>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition">
          <div className="w-full px-4 md:px-6 lg:px-8 py-2.5">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="flex flex-wrap items-center gap-3">
                <Pill tone={readinessScore >= 92 ? 'good' : readinessScore >= 80 ? 'warn' : 'bad'}>
                  {readinessScore >= 92 ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />} SYSTEM CHECK
                </Pill>
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-400">
                  {readinessScore >= 92
                    ? 'Replay packaging, discoverability, and follow-up actions are aligned for premium publishing.'
                    : 'Review the highlighted sections before making the replay discoverable.'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                <span style={{ color: EV_GREEN }}>Readiness {readinessScore}%</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span>{clipSuggestions.length} clip suggestions</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span>{visibleSurfaceCount} discovery surfaces</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Left column */}
          <div className="lg:col-span-8 space-y-4">
            {/* Replay packaging header */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <SectionHead
                title="Replay packaging header"
                subtitle="Source session, processing state, artwork status, recommended title, and replay readiness in one premium block."
                right={
                  <Pill tone={processingState === 'Published' ? 'good' : processingState === 'Ready for publish' ? 'brand' : 'warn'}>
                    <Radio className="h-3.5 w-3.5" /> {processingState}
                  </Pill>
                }
              />

              <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
                <div className="xl:col-span-5">
                  <div className="overflow-hidden rounded-3xl ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
                    <img src={session.coverUrl} alt="Replay cover" className="aspect-[4/3] w-full object-cover" />
                  </div>
                  <div className="mt-3 rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-500">Replay source</div>
                        <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-50">{session.title}</div>
                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{session.source} · {session.presenter}</div>
                      </div>
                      <button
                        type="button"
                        onClick={copyReplayLink}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-600 dark:text-slate-400 break-all">
                      {session.replayUrl}
                    </div>
                  </div>
                </div>

                <div className="xl:col-span-7 space-y-3">
                  <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                        <div className="mt-2 text-[28px] font-black leading-[1.04] tracking-[-0.03em] text-slate-900 dark:text-slate-100 sm:text-[34px] lg:text-[40px]">{readinessScore}%</div>
                        <div className="mt-1.5 text-[14px] leading-6 text-slate-500 dark:text-slate-400">Packaging confidence</div>
                      </div>
                      <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                        <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Artwork status</div>
                        <div className="mt-1 text-lg font-black text-slate-900 dark:text-slate-50">Approved</div>
                        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Cover frame {coverFrame}</div>
                      </div>
                      <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                        <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Chapter score</div>
                        <div className="mt-1 text-lg font-black text-slate-900 dark:text-slate-50">{chapters.length} markers</div>
                        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Search-ready transcript</div>
                      </div>
                      <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                        <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Follow-up</div>
                        <div className="mt-1 text-lg font-black text-slate-900 dark:text-slate-50">{sendReplayJourney ? 'Journey armed' : 'Manual'}</div>
                        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Beacon + replay handoff</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Recommended replay title</div>
                          <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Suggested from the source session and optimized for search and follow-up discovery.</div>
                        </div>
                        <Pill tone="brand">
                          <Wand2 className="h-3.5 w-3.5" /> Recommended
                        </Pill>
                      </div>
                      <TextInput value={title} onChange={setTitle} placeholder="Replay title" />
                    </div>
                    <div className="mt-3">
                      <FieldLabel>Replay readiness meter</FieldLabel>
                      <Meter value={readinessScore} tone={readinessScore >= 92 ? 'brand' : 'warn'} />
                      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>Projected replay reach · 12.4k</span>
                        <span>•</span>
                        <span>Promotion surfaces armed</span>
                        <span>•</span>
                        <span>{processingState}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial cleanup workspace */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <SectionHead
                title="Editorial cleanup workspace"
                subtitle="Trim heads and tails, remove dead air, tune metadata, select the best cover frame, and decide which live sections remain visible."
                right={<Pill tone="accent"><TimerReset className="h-3.5 w-3.5" /> Fast editorial polish</Pill>}
              />

              <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
                <div className="xl:col-span-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                  <FieldLabel>Trim controls</FieldLabel>
                  <div className="mt-3 space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-slate-50">
                        <span>Trim opening</span>
                        <span>{trimHeadSec}s</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={120}
                        value={trimHeadSec}
                        onChange={(e) => setTrimHeadSec(Number(e.target.value))}
                        className="mt-2 w-full"
                        style={{ accentColor: EV_GREEN }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-slate-50">
                        <span>Trim ending</span>
                        <span>{trimTailSec}s</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={120}
                        value={trimTailSec}
                        onChange={(e) => setTrimTailSec(Number(e.target.value))}
                        className="mt-2 w-full"
                        style={{ accentColor: EV_ORANGE }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Remove dead air</div>
                          <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Auto-cut pauses and empty stage moments.</div>
                        </div>
                        <Toggle checked={removeDeadAir} onChange={setRemoveDeadAir} />
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Remove waiting room</div>
                          <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Drop countdowns and silent pre-roll.</div>
                        </div>
                        <Toggle checked={removeWaitingRoom} onChange={setRemoveWaitingRoom} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <FieldLabel>Visible sections</FieldLabel>
                    <div className="mt-3 space-y-2">
                      {visibleSections.map((section) => (
                        <div key={section.key} className="flex items-center justify-between gap-3 rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">{section.label}</div>
                            <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{section.hint}</div>
                          </div>
                          <Toggle
                            checked={section.enabled}
                            onChange={(next) =>
                              setVisibleSections((prev) => prev.map((item) => (item.key === section.key ? { ...item, enabled: next } : item)))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="xl:col-span-6 space-y-4">
                  <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                    <FieldLabel>Replay copy</FieldLabel>
                    <TextInput value={title} onChange={setTitle} placeholder="Replay title" />
                    <TextArea value={description} onChange={setDescription} rows={5} placeholder="Polished replay description" />
                  </div>
                  <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <FieldLabel>Cover frame selector</FieldLabel>
                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Choose the frame that best represents the replay destination page.</div>
                      </div>
                      <Pill tone="good"><ImageIcon className="h-3.5 w-3.5" /> Artwork clean</Pill>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {['Frame 01', 'Frame 02', 'Frame 03', 'Frame 04'].map((frame, index) => (
                        <button
                          key={frame}
                          type="button"
                          onClick={() => setCoverFrame(frame)}
                          className={cx(
                            'overflow-hidden rounded-2xl border p-2 text-left transition',
                            coverFrame === frame
                              ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-600'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800',
                          )}
                        >
                          <div className="aspect-[3/4] rounded-xl" style={{ background: index % 2 === 0 ? 'linear-gradient(180deg, #10254a 0%, #203d66 100%)' : 'linear-gradient(180deg, #18334a 0%, #284c63 100%)' }} />
                          <div className="mt-2 text-xs font-bold text-slate-900 dark:text-slate-100">{frame}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapters and transcript */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <SectionHead
                title="Chapter and transcript tools"
                subtitle="Make the replay premium and searchable with chapter markers, transcript cleanup, speaker names, and scripture references."
                right={<Pill tone="brand"><Search className="h-3.5 w-3.5" /> Searchable structure</Pill>}
              />

              <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
                <div className="xl:col-span-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Replay chapters</div>
                      <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Clean chapter markers improve search, replay navigation, and clip extraction.</div>
                    </div>
                    <Btn tone="neutral" onClick={handleAddChapter} left={<PlusIconSmall />}>
                      Add chapter
                    </Btn>
                  </div>
                  <div className="mt-4 space-y-3">
                    {chapters.map((chapter, idx) => (
                      <div key={chapter.id} className="rounded-3xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                        <div className="flex items-center justify-between gap-2">
                          <Pill tone="neutral">Chapter {idx + 1}</Pill>
                          <button
                            type="button"
                            onClick={() => handleRemoveChapter(chapter.id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                          <div>
                            <FieldLabel>Timecode</FieldLabel>
                            <TextInput value={chapter.timecode} onChange={(next) => handleUpdateChapter(chapter.id, { timecode: next })} placeholder="00:00" />
                          </div>
                          <div className="xl:col-span-2">
                            <FieldLabel>Chapter title</FieldLabel>
                            <TextInput value={chapter.title} onChange={(next) => handleUpdateChapter(chapter.id, { title: next })} placeholder="Chapter title" />
                          </div>
                          <div>
                            <FieldLabel>Speaker</FieldLabel>
                            <TextInput value={chapter.speaker} onChange={(next) => handleUpdateChapter(chapter.id, { speaker: next })} placeholder="Speaker name" />
                          </div>
                        </div>
                        <div className="mt-3">
                          <FieldLabel>Scripture or reference</FieldLabel>
                          <TextInput value={chapter.scripture} onChange={(next) => handleUpdateChapter(chapter.id, { scripture: next })} placeholder="Scripture / reference" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="xl:col-span-4 space-y-3">
                  <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Transcript readiness</div>
                    <div className="mt-3 space-y-3">
                      <div className="flex items-center justify-between gap-2 rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Transcript cleaned</div>
                          <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Remove filler text and dead-air captions.</div>
                        </div>
                        <Toggle checked={transcriptReady} onChange={setTranscriptReady} />
                      </div>
                      <div className="flex items-center justify-between gap-2 rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Speaker labels</div>
                          <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Identify speakers throughout the replay.</div>
                        </div>
                        <Toggle checked={speakerLabelsEnabled} onChange={setSpeakerLabelsEnabled} />
                      </div>
                      <div className="flex items-center justify-between gap-2 rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Scripture index</div>
                          <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Make references searchable in replay search.</div>
                        </div>
                        <Toggle checked={searchableScripture} onChange={setSearchableScripture} />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Subtitle confidence</div>
                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Accessibility quality before publish.</div>
                      </div>
                      <Pill tone={subtitleConfidence >= 95 ? 'good' : subtitleConfidence >= 88 ? 'warn' : 'bad'}>
                        <ShieldCheck className="h-3.5 w-3.5" /> {subtitleConfidence}%
                      </Pill>
                    </div>
                    <Meter value={subtitleConfidence} tone={subtitleConfidence >= 95 ? 'brand' : 'warn'} />
                    <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">FaithHub can flag subtitle confidence below 90% before publishing.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes and resources */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <SectionHead
                title="Notes and resource panel"
                subtitle="Attach sermon notes, study guides, reading plans, event links, giving prompts, charity crowdfund links, and FaithMart or Beacon assets."
                right={<Pill tone="accent"><BookOpen className="h-3.5 w-3.5" /> Rich destination page</Pill>}
              />

              <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
                <div className="xl:col-span-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                  <FieldLabel>Replay notes summary</FieldLabel>
                  <TextArea
                    value={notesText}
                    onChange={setNotesText}
                    rows={8}
                    placeholder="Add the replay notes, follow-up prompts, discussion cues, and prayer response."
                  />
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Use this area for sermon notes, study prompts, prayer ministry, and follow-up context.</span>
                  </div>
                </div>

                <div className="xl:col-span-7 rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {resources.map((resource) => (
                      <div key={resource.id} className="rounded-3xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">{resource.label}</div>
                            <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{resource.hint}</div>
                          </div>
                          <Toggle
                            checked={resource.enabled}
                            onChange={(next) => setResources((prev) => prev.map((item) => (item.id === resource.id ? { ...item, enabled: next } : item)))}
                          />
                        </div>
                        <TextInput
                          value={resource.value}
                          onChange={(next) => setResources((prev) => prev.map((item) => (item.id === resource.id ? { ...item, value: next } : item)))}
                          placeholder="Add link or label"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Replay access and discoverability */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <SectionHead
                title="Replay access and discoverability"
                subtitle="Control who can watch, when the replay goes live, whether downloads are enabled, and where it should appear in feeds, libraries, and search."
                right={<Pill tone="brand"><Globe2 className="h-3.5 w-3.5" /> Discovery controls</Pill>}
              />

              <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
                <div className="xl:col-span-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                  <FieldLabel>Access level</FieldLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(['Public', 'Members', 'Supporters'] as AccessLevel[]).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setAccessLevel(level)}
                        className={cx(
                          'inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold transition',
                          accessLevel === level
                            ? 'text-white shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800',
                        )}
                        style={accessLevel === level ? { background: level === 'Public' ? EV_GREEN : level === 'Members' ? '#0f172a' : EV_ORANGE } : undefined}
                      >
                        {level}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Enable downloads</div>
                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Offer file downloads to the selected access group.</div>
                      </div>
                      <Toggle checked={downloadsEnabled} onChange={setDownloadsEnabled} />
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Scheduled release</div>
                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Use timed release for featured placement or supporter windows.</div>
                      </div>
                      <Toggle checked={scheduleRelease} onChange={setScheduleRelease} />
                    </div>
                    {scheduleRelease ? (
                      <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                        <FieldLabel>Replay goes live at</FieldLabel>
                        <input
                          type="datetime-local"
                          value={releaseAt}
                          onChange={(e) => setReleaseAt(e.target.value)}
                          className="mt-2 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 ring-1 ring-slate-200 dark:ring-slate-700 outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 transition"
                        />
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="xl:col-span-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <FieldLabel>FaithHub surfaces</FieldLabel>
                      <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Choose where the replay should appear inside FaithHub and how premium placement should behave.</div>
                    </div>
                    <Pill tone={featuredPlacement ? 'good' : 'neutral'}>
                      <Sparkles className="h-3.5 w-3.5" /> {featuredPlacement ? 'Featured shelf requested' : 'Standard placement'}
                    </Pill>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    {surfaces.map((surface) => (
                      <div key={surface.key} className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">{surface.label}</div>
                            <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{surface.hint}</div>
                          </div>
                          <Toggle
                            checked={surface.enabled}
                            onChange={(next) => setSurfaces((prev) => prev.map((item) => (item.key === surface.key ? { ...item, enabled: next } : item)))}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Featured placement</div>
                          <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Request premium shelf placement while replay momentum is fresh.</div>
                        </div>
                        <Toggle checked={featuredPlacement} onChange={setFeaturedPlacement} />
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Queue external repost prep</div>
                          <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Prepare replay and clip assets for external publishing after review.</div>
                        </div>
                        <Toggle checked={queueExternalAssets} onChange={setQueueExternalAssets} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Follow-up actions */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <SectionHead
                title="Follow-up actions block"
                subtitle="Trigger replay notifications, create Beacon campaigns, surface donation asks, or tie the replay to an ongoing event or campaign while context is still fresh."
                right={<Pill tone="accent"><ArrowRight className="h-3.5 w-3.5" /> Growth cycle ready</Pill>}
              />

              <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
                <div className="xl:col-span-7 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Replay notification journey</div>
                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Launch replay-ready reminders and follow-up nudges.</div>
                      </div>
                      <Toggle checked={sendReplayJourney} onChange={setSendReplayJourney} />
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <Bell className="h-3.5 w-3.5" /> Journey name · Grace Replay Ready
                    </div>
                  </div>
                  <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Beacon campaign handoff</div>
                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Create a replay booster or promotion campaign directly from the replay.</div>
                      </div>
                      <Toggle checked={beaconReady} onChange={setBeaconReady} />
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <Zap className="h-3.5 w-3.5" /> Beacon asset pack ready
                    </div>
                  </div>
                  <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Donation or giving ask</div>
                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Carry the generosity moment into the replay destination page.</div>
                      </div>
                      <Toggle checked={donationAsk} onChange={setDonationAsk} />
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <Gift className="h-3.5 w-3.5" /> Grace Ministry Fund attached
                    </div>
                  </div>
                  <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Tie replay to campaigns</div>
                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Keep the replay working for current events or charity momentum.</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Toggle checked={eventTieIn} onChange={setEventTieIn} />
                        <Toggle checked={campaignTieIn} onChange={setCampaignTieIn} />
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Event tie-in {eventTieIn ? 'on' : 'off'}</span>
                      <span>•</span>
                      <span>Campaign tie-in {campaignTieIn ? 'on' : 'off'}</span>
                    </div>
                  </div>
                </div>

                <div className="xl:col-span-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Clip opportunity queue</div>
                      <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Detected moments and replay-driven growth opportunities.</div>
                    </div>
                    <Pill tone="good"><Scissors className="h-3.5 w-3.5" /> {clipSuggestions.length} ready</Pill>
                  </div>
                  <div className="mt-3 space-y-2">
                    {clipSuggestions.map((clip) => (
                      <div key={clip.label} className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">{clip.label}</div>
                          <Pill tone="neutral">{clip.duration}</Pill>
                        </div>
                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{clip.hint}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Btn tone="accent" onClick={() => showSuccess('Clip generation requested')} left={<Scissors className="h-4 w-4" />}>
                      Generate clips
                    </Btn>
                    <Btn tone="neutral" onClick={() => safeNav(ROUTES.beaconBuilder)} left={<Zap className="h-4 w-4" />}>
                      Create Beacon booster
                    </Btn>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right rail */}
          <div className="lg:col-span-4 space-y-4">
            {/* Replay preview */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <SectionHead
                title="Replay experience preview"
                subtitle="Desktop and mobile preview update as packaging and discoverability settings change."
                right={<Pill tone="brand"><Eye className="h-3.5 w-3.5" /> Live preview</Pill>}
              />

              <div className="mt-3 inline-flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                <button
                  type="button"
                  onClick={() => setPreviewMode('desktop')}
                  className={cx(
                    'rounded-2xl px-4 py-2 text-xs font-bold transition',
                    previewMode === 'desktop' ? 'text-white shadow-sm' : 'text-slate-700 dark:text-slate-300',
                  )}
                  style={previewMode === 'desktop' ? { background: EV_GREEN } : undefined}
                >
                  Desktop preview
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('mobile')}
                  className={cx(
                    'rounded-2xl px-4 py-2 text-xs font-bold transition',
                    previewMode === 'mobile' ? 'text-white shadow-sm' : 'text-slate-700 dark:text-slate-300',
                  )}
                  style={previewMode === 'mobile' ? { background: EV_ORANGE } : undefined}
                >
                  Mobile preview
                </button>
              </div>

              <div className="mt-4">
                {previewMode === 'desktop' ? (
                  <BrowserPreview
                    title={title}
                    description={description}
                    accessLevel={accessLevel}
                    notesAttached={notesAttached}
                    resourcesEnabled={resources.filter((item) => item.enabled).length}
                    downloadsEnabled={downloadsEnabled}
                    beaconReady={beaconReady}
                    scheduledLabel={scheduleRelease ? `Scheduled · ${releaseAt.replace('T', ' ')}` : 'Publishes immediately'}
                  />
                ) : (
                  <PhonePreview
                    title={title}
                    accessLevel={accessLevel}
                    notesAttached={notesAttached}
                    givePromptEnabled={donationAsk}
                    watchSurface={watchSurface}
                  />
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Btn tone="neutral" onClick={() => setPreviewOpen(true)} left={<ExternalLink className="h-4 w-4" />}>
                  Open full preview
                </Btn>
                <Btn tone="ghost" onClick={copyReplayLink} left={<QrCode className="h-4 w-4" />}>
                  Copy replay link
                </Btn>
              </div>
            </div>

            {/* Quality review */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <SectionHead
                title="Quality review lane"
                subtitle="Accessibility, moderation, thumbnails, subtitle confidence, and unresolved issues before publishing."
                right={<Pill tone={readinessScore >= 92 ? 'good' : readinessScore >= 80 ? 'warn' : 'bad'}>{readinessLabel}</Pill>}
              />
              <div className="mt-3 space-y-2">
                {replayReadyChecks.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">{item.label}</div>
                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{item.detail}</div>
                      </div>
                      <Pill tone={item.status === 'Pass' ? 'good' : item.status === 'Warn' ? 'warn' : 'bad'}>
                        {item.status === 'Pass' ? <Check className="h-3.5 w-3.5" /> : item.status === 'Warn' ? <Info className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                        {item.status}
                      </Pill>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribution summary */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <SectionHead
                title="Distribution summary"
                subtitle="Where the replay will surface inside FaithHub and which external prep steps are queued."
                right={<Pill tone="accent"><Layers className="h-3.5 w-3.5" /> {visibleSurfaceCount} surfaces</Pill>}
              />

              <div className="mt-3 space-y-2">
                {surfaces.map((surface) => (
                  <div key={surface.key} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">{surface.label}</div>
                      <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{surface.hint}</div>
                    </div>
                    <Pill tone={surface.enabled ? 'good' : 'neutral'}>{surface.enabled ? 'On' : 'Off'}</Pill>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">External repost queue</div>
                    <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Replay cards, thumbnails, clips, and metadata prep after review.</div>
                  </div>
                  <Pill tone={queueExternalAssets ? 'warn' : 'neutral'}>{queueExternalAssets ? 'Queued' : 'Off'}</Pill>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Quick actions</div>
              <div className="mt-3 grid grid-cols-1 gap-2">
                <Btn tone="neutral" onClick={() => safeNav(ROUTES.replaysAndClips)} left={<Scissors className="h-4 w-4" />}>
                  Open Replays & Clips
                </Btn>
                <Btn tone="neutral" onClick={() => safeNav(ROUTES.audienceNotifications)} left={<MessageCircle className="h-4 w-4" />}>
                  Audience Notifications
                </Btn>
                <Btn tone="neutral" onClick={() => safeNav(ROUTES.beaconBuilder)} left={<Zap className="h-4 w-4" />}>
                  Beacon Builder
                </Btn>
                <Btn tone="ghost" onClick={() => safeNav(ROUTES.liveDashboard)} left={<Radio className="h-4 w-4" />}>
                  Return to Live Dashboard
                </Btn>
              </div>
              <div className="mt-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3 ring-1 ring-slate-200 dark:ring-slate-800 text-xs text-slate-600 dark:text-slate-400 transition">
                Recommended flow: publish replay → send replay-ready journey → generate clips → launch Beacon follow-up.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full preview drawer */}
      <Drawer
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Replay destination preview"
        subtitle="FaithHub desktop and mobile replay destination, reflecting your current packaging settings."
      >
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <div className="xl:col-span-8 space-y-4">
            <BrowserPreview
              title={title}
              description={description}
              accessLevel={accessLevel}
              notesAttached={notesAttached}
              resourcesEnabled={resources.filter((item) => item.enabled).length}
              downloadsEnabled={downloadsEnabled}
              beaconReady={beaconReady}
              scheduledLabel={scheduleRelease ? `Scheduled · ${releaseAt.replace('T', ' ')}` : 'Publishes immediately'}
            />
            <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Preview notes</div>
              <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                  <div className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Discoverability</div>
                  <div className="mt-1 text-lg font-black text-slate-900 dark:text-slate-50">{visibleSurfaceCount} surfaces</div>
                </div>
                <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                  <div className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Notes + resources</div>
                  <div className="mt-1 text-lg font-black text-slate-900 dark:text-slate-50">{notesAttached} linked</div>
                </div>
                <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                  <div className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Subtitle confidence</div>
                  <div className="mt-1 text-lg font-black text-slate-900 dark:text-slate-50">{subtitleConfidence}%</div>
                </div>
              </div>
            </div>
          </div>
          <div className="xl:col-span-4 space-y-4">
            <PhonePreview
              title={title}
              accessLevel={accessLevel}
              notesAttached={notesAttached}
              givePromptEnabled={donationAsk}
              watchSurface={watchSurface}
            />
            <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Replay publish summary</div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-2 rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                  <span className="text-slate-700 dark:text-slate-300">Replay state</span>
                  <Pill tone={processingState === 'Published' ? 'good' : 'brand'}>{processingState}</Pill>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                  <span className="text-slate-700 dark:text-slate-300">Release mode</span>
                  <Pill tone={scheduleRelease ? 'warn' : 'good'}>{scheduleRelease ? 'Scheduled' : 'Immediate'}</Pill>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition">
                  <span className="text-slate-700 dark:text-slate-300">Beacon handoff</span>
                  <Pill tone={beaconReady ? 'accent' : 'neutral'}>{beaconReady ? 'Ready' : 'Off'}</Pill>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

function PlusIconSmall() {
  return <span className="inline-flex h-4 w-4 items-center justify-center text-base leading-none">+</span>;
}







