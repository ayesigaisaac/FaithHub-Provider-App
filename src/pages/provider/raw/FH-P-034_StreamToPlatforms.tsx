// @ts-nocheck
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { CircularProgress } from '@mui/material';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  Gauge,
  Globe2,
  Info,
  Layers,
  Link as LinkIcon,
  Lock,
  Megaphone,
  MonitorPlay,
  PlayCircle,
  PlusCircle,
  Radio,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Video,
  Wand2,
  Wifi,
  X,
  Zap,
} from 'lucide-react';

/**
 * FaithHub â€” FH-P-034 Stream-to-Platforms
 * ---------------------------------------
 * Premium multi-destination distribution page for FaithHub Live Sessionz.
 *
 * Design intent
 * - Rebuild the creator/e-commerce base page into a FaithHub provider operations surface.
 * - Keep the same premium format: sticky command header, rich destination cards, health intelligence,
 *   advanced settings modal, and a live audience/distribution preview.
 * - Use EVzone Green as the primary color, Orange as the secondary action color,
 *   and FaithHub-neutral greys for supporting hierarchy.
 *
 * Notes
 * - Self-contained TSX using mock data and Tailwind-style utility classes.
 * - Replace route constants and mocked records with production data sources when integrating.
 */

const EV_GREEN = '#03cd8c';
const EV_ORANGE = '#f77f00';
const EV_GREY = '#a6a6a6';
const EV_LIGHT = '#f2f2f2';

const ROUTES = {
  liveBuilder: '/faithhub/provider/live-builder',
  liveStudio: '/faithhub/provider/live-studio',
  beaconBuilder: '/faithhub/provider/beacon-builder',
};

const DEFAULT_SESSION_TITLE = 'Sunday Encounter Live Â· The Way of Grace';
const DEFAULT_THUMBNAIL =
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=60';

const cx = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(' ');

function safeNav(url: string) {
  if (typeof window === 'undefined') return;
  window.location.assign(url);
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      return true;
    } catch {
      return false;
    }
  }
}

type SessionStatus = 'Draft' | 'Scheduled' | 'Live' | 'Ended';
type DestinationStatus = 'Connected' | 'Needs re-auth' | 'Missing credentials' | 'Blocked' | 'Live';
type DestinationFamily = 'FaithHub Surface' | 'External Social' | 'Custom RTMP';
type Privacy = 'Public' | 'Unlisted' | 'Private';
type OutputOrientation = 'Landscape' | 'Portrait' | 'Adaptive';
type OutputQuality = 'Standard' | 'High' | 'Broadcast';
type FallbackRule = 'Keep FaithHub primary' | 'Retry + backup RTMP' | 'Internal only if external fails';
type CrossPostRule = 'Internal only' | 'Replay only' | 'Replay + clips' | 'Manual after review';

type Destination = {
  id: string;
  name: string;
  family: DestinationFamily;
  status: DestinationStatus;
  enabled: boolean;
  routeOrder: number | null;
  owner: string;
  tokenStatus: string;
  historyNote: string;
  creativeVariant: string;
  fallbackRule: FallbackRule;
  supportsPrivacy: boolean;
  supportsLanguageTracks: boolean;
  supportsThumbnails: boolean;
  supportsSafeAreaPreview: boolean;
  supportsArchiveRule: boolean;
  supportsCustomRTMP: boolean;
  thumbnailUrl?: string;
  errorTitle?: string;
  errorNext?: string;
  settings: {
    title: string;
    description: string;
    privacy?: Privacy;
    languageTrack?: string;
    safeAreaMode: '16:9 safe' | '9:16 preview' | 'Square crop';
    complianceNote: string;
    archiveRule: 'Keep replay internal' | 'Auto-publish replay' | 'Auto-publish replay + clips' | 'Replay only';
    autoReconnect: boolean;
  };
  health: {
    viewers: number;
    errors: number;
    lastAckSec: number;
    outBitrateKbps: number;
    trend: number[];
  };
};

type OutputProfile = {
  orientation: OutputOrientation;
  quality: OutputQuality;
  bitrateKbps: number;
  captions: boolean;
  translationTracks: string[];
  internalPrimary: boolean;
};

type ApprovalItem = {
  id: string;
  label: string;
  status: 'Pass' | 'Warn' | 'Fail';
  detail?: string;
  fix?: string;
};

type DistributionPreset = {
  id: string;
  label: string;
  desc: string;
  chip: string;
  destIds: string[];
  creativeVariant: string;
  languageTrack: string;
  crossPostRule: CrossPostRule;
  fallbackRule: FallbackRule;
  beaconNote: string;
};

function normalizeRouteOrders(destinations: Destination[]) {
  const enabled = destinations
    .filter((d) => d.enabled)
    .sort((a, b) => (a.routeOrder ?? 999) - (b.routeOrder ?? 999));
  return destinations.map((d) => ({
    ...d,
    routeOrder: d.enabled ? enabled.findIndex((x) => x.id === d.id) + 1 : null,
  }));
}

function statusTone(s: DestinationStatus): 'green' | 'orange' | 'red' | 'neutral' | 'blue' {
  if (s === 'Connected') return 'green';
  if (s === 'Live') return 'blue';
  if (s === 'Needs re-auth') return 'orange';
  if (s === 'Missing credentials') return 'orange';
  if (s === 'Blocked') return 'red';
  return 'neutral';
}

function familyTone(family: DestinationFamily): 'blue' | 'green' | 'purple' {
  if (family === 'FaithHub Surface') return 'green';
  if (family === 'Custom RTMP') return 'purple';
  return 'blue';
}

function statusLabel(s: DestinationStatus) {
  if (s === 'Needs re-auth') return 'Needs re-auth';
  if (s === 'Missing credentials') return 'Missing credentials';
  return s;
}

function prettyKbps(kbps: number) {
  if (kbps >= 1000) return `${(kbps / 1000).toFixed(1)} Mbps`;
  return `${kbps} Kbps`;
}

function computeRequiredUpload(profile: OutputProfile, destinationCount: number) {
  const multiplier = profile.quality === 'Broadcast' ? 1.35 : profile.quality === 'High' ? 1.22 : 1.14;
  const distributionOverhead = 1 + Math.max(0, destinationCount - 1) * 0.05;
  return (profile.bitrateKbps / 1000) * multiplier * distributionOverhead;
}

function Badge({
  tone,
  children,
  title,
}: {
  tone: 'neutral' | 'green' | 'orange' | 'red' | 'blue' | 'purple';
  children: React.ReactNode;
  title?: string;
}) {
  const cls =
    tone === 'green'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20'
      : tone === 'orange'
        ? 'bg-orange-50 text-orange-700 ring-orange-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20'
        : tone === 'red'
          ? 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20'
          : tone === 'blue'
            ? 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20'
            : tone === 'purple'
              ? 'bg-purple-50 text-purple-700 ring-purple-200 dark:bg-violet-500/10 dark:text-violet-400 dark:ring-violet-500/20'
              : 'bg-slate-50 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700';
  return (
    <span title={title} className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] sm:text-[11px] font-bold ring-1 whitespace-nowrap', cls)}>
      {children}
    </span>
  );
}

function Pill({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cx(
        'inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[10px] sm:text-xs font-semibold transition active:scale-[0.98]',
        active
          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
          : 'bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800'
      )}
    >
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
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cx(
        'relative inline-flex h-5 w-10 sm:h-6 sm:w-11 items-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600',
        disabled ? 'bg-slate-200 dark:bg-slate-800 cursor-not-allowed opacity-50' : 'cursor-pointer',
        checked ? 'bg-emerald-500 dark:bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
      )}
      aria-checked={checked}
      role="switch"
    >
      <span
        className={cx(
          'inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full bg-white dark:bg-slate-100 shadow transition',
          checked ? 'translate-x-5' : 'translate-x-1'
        )}
      />
    </button>
  );
}

function MiniLine({
  values,
  tone = 'green',
}: {
  values: number[];
  tone?: 'orange' | 'green' | 'blue' | 'neutral';
}) {
  const w = 160;
  const h = 46;
  const pad = 4;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const norm = (v: number) => {
    const t = max === min ? 0.5 : (v - min) / (max - min);
    return h - pad - t * (h - pad * 2);
  };
  const pts = values
    .map((v, i) => {
      const x = pad + (i * (w - pad * 2)) / Math.max(1, values.length - 1);
      const y = norm(v);
      return `${x},${y}`;
    })
    .join(' ');

  const stroke = tone === 'green' ? EV_GREEN : tone === 'blue' ? '#2563eb' : tone === 'neutral' ? '#475569' : EV_ORANGE;

  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth={2.7} strokeLinecap="round" strokeLinejoin="round" />
      <circle
        cx={pad + ((values.length - 1) * (w - pad * 2)) / Math.max(1, values.length - 1)}
        cy={norm(values[values.length - 1])}
        r={3.8}
        fill={stroke}
      />
    </svg>
  );
}

function Modal({
  open,
  title,
  subtitle,
  onClose,
  children,
  wide,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div
        className={cx(
          'relative flex w-full flex-col bg-white dark:bg-slate-900 shadow-2xl transition-all h-[95vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-[14px] overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800',
          wide ? 'max-w-6xl' : 'max-w-2xl'
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-3">
          <div className="min-w-0">
            <div className="truncate text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-50">{title}</div>
            {subtitle ? <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">{subtitle}</div> : null}
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
  subtitle,
  right,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm transition">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-base font-bold text-slate-900 dark:text-slate-50 leading-tight">{title}</div>
          {subtitle ? <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-normal">{subtitle}</div> : null}
        </div>
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

const PRESETS: DistributionPreset[] = [
  {
    id: 'weekly-service',
    label: 'Weekly service preset',
    desc: 'FaithHub primary, YouTube + Facebook open, replay held for review.',
    chip: 'Sunday flow',
    destIds: ['fh-live', 'fh-home', 'yt', 'fb'],
    creativeVariant: 'Sanctuary welcome + scripture lower third',
    languageTrack: 'English main + Swahili CC',
    crossPostRule: 'Replay only',
    fallbackRule: 'Keep FaithHub primary',
    beaconNote: 'Boost replay after publishing if watch-through crosses target.',
  },
  {
    id: 'translated-session',
    label: 'Translated session preset',
    desc: 'FaithHub, YouTube, and backup RTMP with translated overlays and safe-area checks.',
    chip: 'Language-first',
    destIds: ['fh-live', 'yt', 'rtmp'],
    creativeVariant: 'Dual-language sermon cards',
    languageTrack: 'English + French + Swahili',
    crossPostRule: 'Replay + clips',
    fallbackRule: 'Retry + backup RTMP',
    beaconNote: 'Prepare translated replay tiles for Beacon after broadcast.',
  },
  {
    id: 'fundraiser',
    label: 'Fundraiser / giving moment',
    desc: 'FaithHub, YouTube, Instagram, and RTMP with giving overlays and clip-ready rules.',
    chip: 'Conversion-focused',
    destIds: ['fh-live', 'yt', 'ig', 'rtmp'],
    creativeVariant: 'Giving banner + crowdfund progress',
    languageTrack: 'English main track',
    crossPostRule: 'Replay + clips',
    fallbackRule: 'Keep FaithHub primary',
    beaconNote: 'Send replay and short giving clips into Beacon for continued momentum.',
  },
  {
    id: 'internal-only',
    label: 'FaithHub internal only',
    desc: 'Only EVzone/FaithHub surfaces are used. External platforms remain disconnected.',
    chip: 'Private run',
    destIds: ['fh-live', 'fh-home'],
    creativeVariant: 'In-app discovery card',
    languageTrack: 'Institution default',
    crossPostRule: 'Internal only',
    fallbackRule: 'Internal only if external fails',
    beaconNote: 'Optionally create a standalone Beacon after replay is approved.',
  },
];

const INITIAL_DESTINATIONS: Destination[] = normalizeRouteOrders([
  {
    id: 'fh-live',
    name: 'FaithHub Live Hub',
    family: 'FaithHub Surface',
    status: 'Connected',
    enabled: true,
    routeOrder: 1,
    owner: 'FaithHub Core Surface',
    tokenStatus: 'Core surface healthy Â· no reconnect needed',
    historyNote: 'Primary in-app destination with viewer-safe fallback logic.',
    creativeVariant: 'In-app live hero Â· Sunday Encounter',
    fallbackRule: 'Keep FaithHub primary',
    supportsPrivacy: true,
    supportsLanguageTracks: true,
    supportsThumbnails: true,
    supportsSafeAreaPreview: true,
    supportsArchiveRule: true,
    supportsCustomRTMP: false,
    thumbnailUrl: DEFAULT_THUMBNAIL,
    settings: {
      title: DEFAULT_SESSION_TITLE,
      description: 'FaithHub in-app live destination with internal audience, captions, and replay handoff.',
      privacy: 'Public',
      languageTrack: 'English main + Swahili CC',
      safeAreaMode: '16:9 safe',
      complianceNote: 'Primary destination for FaithHub audience and backup continuity.',
      archiveRule: 'Auto-publish replay',
      autoReconnect: true,
    },
    health: {
      viewers: 3840,
      errors: 0,
      lastAckSec: 2,
      outBitrateKbps: 6200,
      trend: [54, 56, 58, 57, 61, 65, 69, 72, 70, 74, 77, 79],
    },
  },
  {
    id: 'fh-home',
    name: 'FaithHub Home Rail',
    family: 'FaithHub Surface',
    status: 'Connected',
    enabled: true,
    routeOrder: 2,
    owner: 'Discovery Rail',
    tokenStatus: 'Placement ready Â· home promo lane mapped',
    historyNote: 'Shows the session card on Home, Discover, and the institution profile.',
    creativeVariant: 'Home rail discovery tile',
    fallbackRule: 'Keep FaithHub primary',
    supportsPrivacy: true,
    supportsLanguageTracks: true,
    supportsThumbnails: true,
    supportsSafeAreaPreview: true,
    supportsArchiveRule: true,
    supportsCustomRTMP: false,
    thumbnailUrl: DEFAULT_THUMBNAIL,
    settings: {
      title: 'Sunday Encounter Live Â· Home rail card',
      description: 'Discoverable live card with RSVP and caption-aware metadata.',
      privacy: 'Public',
      languageTrack: 'English main + Swahili CC',
      safeAreaMode: '16:9 safe',
      complianceNote: 'Discovery-only placement, mirrors the primary in-app destination.',
      archiveRule: 'Keep replay internal',
      autoReconnect: true,
    },
    health: {
      viewers: 2910,
      errors: 0,
      lastAckSec: 3,
      outBitrateKbps: 5800,
      trend: [48, 49, 51, 53, 52, 56, 59, 60, 63, 61, 64, 66],
    },
  },
  {
    id: 'yt',
    name: 'YouTube Live',
    family: 'External Social',
    status: 'Connected',
    enabled: true,
    routeOrder: 3,
    owner: 'Digital Media Â· Main channel',
    tokenStatus: 'OAuth healthy Â· stream key mapped',
    historyNote: 'Scheduled channel with custom metadata, thumbnail, and replay carry-over.',
    creativeVariant: 'Main sermon cover',
    fallbackRule: 'Keep FaithHub primary',
    supportsPrivacy: true,
    supportsLanguageTracks: true,
    supportsThumbnails: true,
    supportsSafeAreaPreview: true,
    supportsArchiveRule: true,
    supportsCustomRTMP: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=60',
    settings: {
      title: 'Sunday Encounter Live â€¢ The Way of Grace (Official Stream)',
      description: 'Worship, scripture, giving moment, and altar call with translated caption options.',
      privacy: 'Public',
      languageTrack: 'English main + Swahili subtitles',
      safeAreaMode: '16:9 safe',
      complianceNote: 'Use clean-safe title casing and sermon-safe thumbnail; keep donation copy platform-compliant.',
      archiveRule: 'Auto-publish replay + clips',
      autoReconnect: true,
    },
    health: {
      viewers: 1746,
      errors: 0,
      lastAckSec: 4,
      outBitrateKbps: 6100,
      trend: [44, 46, 49, 50, 52, 57, 55, 59, 63, 62, 66, 69],
    },
  },
  {
    id: 'fb',
    name: 'Facebook Live',
    family: 'External Social',
    status: 'Needs re-auth',
    enabled: false,
    routeOrder: null,
    owner: 'Community Page Â· Central Campus',
    tokenStatus: 'Session expired 3 hours ago',
    historyNote: 'Audience presence is strong here, but the token must be re-authorized.',
    creativeVariant: 'Community live card',
    fallbackRule: 'Keep FaithHub primary',
    supportsPrivacy: true,
    supportsLanguageTracks: false,
    supportsThumbnails: true,
    supportsSafeAreaPreview: true,
    supportsArchiveRule: true,
    supportsCustomRTMP: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=60',
    errorTitle: 'Facebook needs re-authentication',
    errorNext: 'Reconnect the page token before you can publish or schedule distribution.',
    settings: {
      title: 'Sunday Encounter Live â€¢ Central Campus',
      description: 'Community-facing version with shorter description and direct join callout.',
      privacy: 'Public',
      languageTrack: 'English main track',
      safeAreaMode: '16:9 safe',
      complianceNote: 'Avoid over-long title. Keep giving references inside the body copy.',
      archiveRule: 'Replay only',
      autoReconnect: true,
    },
    health: {
      viewers: 0,
      errors: 0,
      lastAckSec: 0,
      outBitrateKbps: 0,
      trend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  },
  {
    id: 'ig',
    name: 'Instagram Live',
    family: 'External Social',
    status: 'Connected',
    enabled: true,
    routeOrder: 4,
    owner: 'Social Team Â· Short-form channel',
    tokenStatus: 'Connected Â· mobile publish relay ready',
    historyNote: 'Great for real-time reach, safe-area preview uses 9:16 crop guidance.',
    creativeVariant: 'Vertical teaser cover',
    fallbackRule: 'Keep FaithHub primary',
    supportsPrivacy: false,
    supportsLanguageTracks: false,
    supportsThumbnails: false,
    supportsSafeAreaPreview: true,
    supportsArchiveRule: false,
    supportsCustomRTMP: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=60',
    settings: {
      title: 'Sunday Encounter â€¢ Live now',
      description: 'Vertical-friendly, urgency-led copy with join-now language.',
      languageTrack: 'English main track',
      safeAreaMode: '9:16 preview',
      complianceNote: 'Preview with vertical-safe text margins and CTA placement.',
      archiveRule: 'Keep replay internal',
      autoReconnect: true,
    },
    health: {
      viewers: 842,
      errors: 1,
      lastAckSec: 5,
      outBitrateKbps: 4200,
      trend: [28, 31, 33, 36, 38, 39, 41, 43, 44, 46, 45, 47],
    },
  },
  {
    id: 'tt',
    name: 'TikTok Live',
    family: 'External Social',
    status: 'Missing credentials',
    enabled: false,
    routeOrder: null,
    owner: 'Growth Team Â· Creator account',
    tokenStatus: 'Stream key missing',
    historyNote: 'Short-form audience is available, but the current session key is missing.',
    creativeVariant: 'Vertical hook + swipe copy',
    fallbackRule: 'Keep FaithHub primary',
    supportsPrivacy: false,
    supportsLanguageTracks: false,
    supportsThumbnails: false,
    supportsSafeAreaPreview: true,
    supportsArchiveRule: false,
    supportsCustomRTMP: false,
    errorTitle: 'TikTok credentials missing',
    errorNext: 'Add a valid session key or region-approved connection before enabling.',
    settings: {
      title: 'Sunday Encounter â€¢ Join the moment',
      description: 'Fast hook copy optimized for short attention windows.',
      languageTrack: 'English main track',
      safeAreaMode: '9:16 preview',
      complianceNote: 'Keep title short. Donâ€™t rely on full lower-thirds in the top or bottom safe areas.',
      archiveRule: 'Keep replay internal',
      autoReconnect: false,
    },
    health: {
      viewers: 0,
      errors: 0,
      lastAckSec: 0,
      outBitrateKbps: 0,
      trend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  },
  {
    id: 'rtmp',
    name: 'Custom RTMP Backup',
    family: 'Custom RTMP',
    status: 'Connected',
    enabled: false,
    routeOrder: null,
    owner: 'Backup encoder target',
    tokenStatus: 'RTMP URL + key healthy',
    historyNote: 'Protected backup route for redundancy and translated community screens.',
    creativeVariant: 'Fallback slate + logo lower third',
    fallbackRule: 'Retry + backup RTMP',
    supportsPrivacy: false,
    supportsLanguageTracks: true,
    supportsThumbnails: false,
    supportsSafeAreaPreview: false,
    supportsArchiveRule: true,
    supportsCustomRTMP: true,
    settings: {
      title: 'Sunday Encounter backup feed',
      description: 'Fallback route for venue screens, overflow rooms, or custom partner destinations.',
      languageTrack: 'Translated feed',
      safeAreaMode: '16:9 safe',
      complianceNote: 'Protect master feed and map destination owner clearly.',
      archiveRule: 'Replay only',
      autoReconnect: true,
    },
    health: {
      viewers: 126,
      errors: 0,
      lastAckSec: 2,
      outBitrateKbps: 6050,
      trend: [35, 37, 38, 38, 39, 40, 42, 43, 44, 44, 45, 46],
    },
  },
]);

export default function StreamToPlatformsPage() {
  const { showSuccess, showError, showNotification } = useNotification();
  const { run, isPending } = useAsyncAction();

  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('Scheduled');
  const [selectedDestId, setSelectedDestId] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [presetOpen, setPresetOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESETS[0].id);
  const [distributionApproved, setDistributionApproved] = useState(false);
  const [estimatedUploadMbps, setEstimatedUploadMbps] = useState(22.4);
  const [crossPostRule, setCrossPostRule] = useState<CrossPostRule>('Replay + clips');
  const [fallbackRule, setFallbackRule] = useState<FallbackRule>('Keep FaithHub primary');
  const [recordMaster, setRecordMaster] = useState(true);
  const [protectIso, setProtectIso] = useState(true);
  const [beaconBridge, setBeaconBridge] = useState(true);
  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [profile, setProfile] = useState<OutputProfile>({
    orientation: 'Landscape',
    quality: 'High',
    bitrateKbps: 6200,
    captions: true,
    translationTracks: ['English', 'Swahili'],
    internalPrimary: true,
  });

  const selectedDest = useMemo(() => destinations.find((d) => d.id === selectedDestId) || null, [destinations, selectedDestId]);
  const activeDestinations = useMemo(
    () => destinations.filter((d) => d.enabled).sort((a, b) => (a.routeOrder ?? 999) - (b.routeOrder ?? 999)),
    [destinations]
  );
  const internalDestinations = useMemo(() => activeDestinations.filter((d) => d.family === 'FaithHub Surface'), [activeDestinations]);
  const externalDestinations = useMemo(() => activeDestinations.filter((d) => d.family !== 'FaithHub Surface'), [activeDestinations]);
  const requiredUploadMbps = useMemo(() => computeRequiredUpload(profile, activeDestinations.length), [profile, activeDestinations.length]);
  const selectedPreset = useMemo(() => PRESETS.find((preset) => preset.id === selectedPresetId) || PRESETS[0], [selectedPresetId]);
  const availableToConnect = useMemo(() => destinations.filter((d) => !d.enabled || d.status !== 'Connected'), [destinations]);

  const approvalItems: ApprovalItem[] = useMemo(() => {
    const items: ApprovalItem[] = [];
    const hasInternal = internalDestinations.length > 0;
    items.push({
      id: 'internal-primary',
      label: 'FaithHub internal surface remains part of the distribution plan',
      status: hasInternal ? 'Pass' : 'Fail',
      fix: hasInternal ? undefined : 'Enable at least one FaithHub surface before publishing the plan.',
    });

    const invalid = activeDestinations.filter((d) => d.status === 'Needs re-auth' || d.status === 'Missing credentials' || d.status === 'Blocked');
    items.push({
      id: 'credential-health',
      label: 'Enabled destinations have valid credentials and access',
      status: invalid.length === 0 ? 'Pass' : 'Fail',
      detail: invalid.length ? invalid.map((d) => d.name).join(' Â· ') : undefined,
      fix: invalid.length ? 'Reconnect or complete credentials for every enabled destination.' : undefined,
    });

    const metadataReady = activeDestinations.every((d) => d.settings.title.trim() && d.settings.description.trim());
    items.push({
      id: 'metadata',
      label: 'Per-platform metadata and creative variants are complete',
      status: metadataReady ? 'Pass' : 'Warn',
      fix: metadataReady ? undefined : 'Open destination settings and complete titles, descriptions, and variant notes.',
    });

    const fallbackReady = Boolean(fallbackRule) && protectIso;
    items.push({
      id: 'fallback',
      label: 'Fallback, redundancy, and protected recording logic are defined',
      status: fallbackReady ? 'Pass' : 'Fail',
      fix: fallbackReady ? undefined : 'Choose a fallback rule and keep protected recording enabled.',
    });

    const bandwidthOk = estimatedUploadMbps >= requiredUploadMbps;
    items.push({
      id: 'bandwidth',
      label: 'Estimated upload can support the active routing plan',
      status: bandwidthOk ? 'Pass' : 'Warn',
      detail: `Estimated ${estimatedUploadMbps.toFixed(1)} Mbps Â· Required ${requiredUploadMbps.toFixed(1)} Mbps`,
      fix: bandwidthOk ? undefined : 'Reduce bitrate, switch to High or Standard quality, or trim active destinations.',
    });

    items.push({
      id: 'approval',
      label: 'Producer or ministry owner has approved the distribution summary',
      status: distributionApproved ? 'Pass' : 'Fail',
      fix: distributionApproved ? undefined : 'Review the plan and confirm before publishing.',
    });

    return items;
  }, [activeDestinations, distributionApproved, estimatedUploadMbps, fallbackRule, internalDestinations.length, protectIso, requiredUploadMbps]);

  const planPublishReady = useMemo(
    () => approvalItems.every((item) => item.status !== 'Fail') && sessionStatus !== 'Ended',
    [approvalItems, sessionStatus]
  );

  const masterHealthTone = useMemo(() => {
    if (!activeDestinations.length) return 'neutral' as const;
    if (activeDestinations.some((d) => d.status === 'Needs re-auth' || d.status === 'Missing credentials')) return 'orange' as const;
    if (activeDestinations.some((d) => d.status === 'Blocked')) return 'red' as const;
    return sessionStatus === 'Live' ? ('blue' as const) : ('green' as const);
  }, [activeDestinations, sessionStatus]);

  function updateDestination(id: string, patch: Partial<Destination>) {
    setDestinations((prev) => normalizeRouteOrders(prev.map((d) => (d.id === id ? { ...d, ...patch } : d))));
  }

  function updateDestinationSettings(id: string, patch: Partial<Destination['settings']>) {
    setDestinations((prev) =>
      normalizeRouteOrders(prev.map((d) => (d.id === id ? { ...d, settings: { ...d.settings, ...patch } } : d)))
    );
  }

  function toggleDestination(id: string, next: boolean) {
    setDestinations((prev) => {
      const draft = prev.map((d) => {
        if (d.id !== id) return d;
        if (d.status === 'Blocked' && next) return d;
        return { ...d, enabled: next, routeOrder: next ? activeDestinations.length + 1 : null };
      });
      return normalizeRouteOrders(draft);
    });
  }

  function moveRoute(id: string, dir: -1 | 1) {
    const enabled = [...activeDestinations];
    const idx = enabled.findIndex((d) => d.id === id);
    if (idx === -1) return;
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= enabled.length) return;
    const swapped = [...enabled];
    const temp = swapped[idx];
    swapped[idx] = swapped[nextIdx];
    swapped[nextIdx] = temp;
    setDestinations((prev) =>
      normalizeRouteOrders(
        prev.map((d) => {
          const routeIndex = swapped.findIndex((item) => item.id === d.id);
          return routeIndex === -1 ? { ...d, routeOrder: null } : { ...d, routeOrder: routeIndex + 1 };
        })
      )
    );
  }

  function openAdvanced(id: string) {
    setSelectedDestId(id);
    setAdvancedOpen(true);
  }

  function handleReconnect(id: string) {
    setDestinations((prev) =>
      normalizeRouteOrders(
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                status: 'Connected',
                errorTitle: undefined,
                errorNext: undefined,
                tokenStatus: 'Reconnected just now Â· healthy',
              }
            : d
        )
      )
    );
    showSuccess('Destination reconnected');
  }

  function runBandwidthTest() {
    const jitter = Math.random() * 6 - 2;
    const next = Math.max(8, Math.min(40, estimatedUploadMbps + jitter));
    setEstimatedUploadMbps(next);
    showSuccess('Distribution bandwidth check updated');
  }

  function applyPreset(presetId: string) {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);
    setCrossPostRule(preset.crossPostRule);
    setFallbackRule(preset.fallbackRule);
    setDestinations((prev) =>
      normalizeRouteOrders(
        prev.map((d) => {
          const enabled = preset.destIds.includes(d.id);
          return {
            ...d,
            enabled,
            creativeVariant: preset.creativeVariant,
            fallbackRule: preset.fallbackRule,
            settings: {
              ...d.settings,
              languageTrack: preset.languageTrack,
              title:
                d.family === 'FaithHub Surface'
                  ? DEFAULT_SESSION_TITLE
                  : `${DEFAULT_SESSION_TITLE} Â· ${d.name.replace(' Live', '')}`,
            },
          };
        })
      )
    );
    showSuccess(`${preset.label} applied`);
  }

  function handlePublishPlan() {
    if (!planPublishReady) {
      showError('Resolve the failed approval checks before publishing the distribution plan');
      return;
    }

    run(async () => {
      if (sessionStatus === 'Draft') setSessionStatus('Scheduled');
    }, {
      loadingMessage: 'Publishing distribution planâ€¦',
      successMessage: 'Distribution plan published and ready for Live Studio handoff.',
      delay: 1600,
    });
  }

  function handleCopyPlanLink() {
    const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://faithhub.app'}/provider/distribution/session/fh-034-plan`;
    copyText(url).then((ok) => {
      if (ok) showSuccess('Distribution plan link copied');
      else showError('Could not copy the distribution plan link');
    });
  }

  const masterTrend = useMemo(() => {
    const avg = activeDestinations.length
      ? Math.round(activeDestinations.reduce((sum, d) => sum + d.health.outBitrateKbps, 0) / activeDestinations.length)
      : profile.bitrateKbps;
    return Array.from({ length: 12 }, (_, i) => Math.round(avg * (0.88 + Math.sin(i / 2) * 0.06 + (Math.random() * 0.04 - 0.02))));
  }, [activeDestinations, profile.bitrateKbps]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f2f2f2] dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors overflow-x-hidden">
      <div className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur transition-colors">
        <div className="w-full px-4 md:px-6 lg:px-8 py-3">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                <button className="hover:text-slate-700 dark:hover:text-slate-200" onClick={() => safeNav(ROUTES.liveBuilder)}>
                  Live Builder
                </button>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <button className="hover:text-slate-700 dark:hover:text-slate-200" onClick={() => safeNav(ROUTES.liveStudio)}>
                  Live Studio
                </button>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">Stream-to-Platforms</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">FH-P-034 Â· Stream-to-Platforms</div>
                <Badge tone={masterHealthTone}>
                  <Radio className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  {sessionStatus}
                </Badge>
                <Badge tone="green">EVzone Green primary</Badge>
              </div>
              <div className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-2 sm:line-clamp-1">
                Single-source distribution planning for FaithHub Live Sessionz across internal EVzone surfaces and external destinations, with platform-safe metadata, fallback logic, archive rules, and Beacon bridge preparation.
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <select
                  value={sessionStatus}
                  onChange={(e) => setSessionStatus(e.target.value as SessionStatus)}
                  className="h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 pr-8 text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 appearance-none"
                >
                  <option>Draft</option>
                  <option>Scheduled</option>
                  <option>Live</option>
                  <option>Ended</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
              </div>

              <button
                onClick={() => setConnectOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-800 dark:text-slate-100 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-[0.98]"
              >
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Connect destination</span>
              </button>

              <button
                onClick={() => setPresetOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98]"
                style={{ background: EV_ORANGE }}
              >
                <Wand2 className="h-4 w-4" />
                <span className="hidden sm:inline">Apply destination preset</span>
              </button>

              <button
                onClick={handlePublishPlan}
                disabled={!planPublishReady || isPending}
                className={cx(
                  'inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-bold text-white shadow-sm transition active:scale-[0.98]',
                  !planPublishReady || isPending ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-600 cursor-not-allowed' : 'hover:opacity-95'
                )}
                style={!planPublishReady || isPending ? undefined : { background: EV_GREEN }}
              >
                {isPending ? <CircularProgress size={14} color="inherit" /> : <Zap className="h-4 w-4" />}
                Publish distribution plan
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
            <Badge tone="neutral">{DEFAULT_SESSION_TITLE}</Badge>
            <Badge tone="green">{internalDestinations.length} internal surface{internalDestinations.length === 1 ? '' : 's'}</Badge>
            <Badge tone="blue">{externalDestinations.length} external destination{externalDestinations.length === 1 ? '' : 's'}</Badge>
            <Badge tone="orange">Preset Â· {selectedPreset.label}</Badge>
            <Badge tone="purple">Beacon bridge {beaconBridge ? 'ready' : 'off'}</Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-[14px] bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <SectionTitle
                icon={<MonitorPlay className="h-5 w-5" />}
                title="Destination library"
                subtitle="Internal EVzone surfaces, external social destinations, and custom RTMP routes all live in one premium control surface. Enable only what this specific session should reach, and resolve credentials before publishing."
                right={
                  <div className="flex items-center gap-2">
                    <Badge tone="green"><BadgeCheck className="h-3.5 w-3.5" />{activeDestinations.length} active</Badge>
                    <button
                      onClick={runBandwidthTest}
                      className="inline-flex h-9 items-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-3 text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-slate-100 ring-1 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-[0.98]"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Recheck bandwidth
                    </button>
                  </div>
                }
              />

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {destinations.map((d) => {
                  const blocked = d.status === 'Blocked';
                  const needsFix = d.status === 'Needs re-auth' || d.status === 'Missing credentials' || d.status === 'Blocked';
                  return (
                    <div
                      key={d.id}
                      className={cx(
                        'rounded-[14px] border p-4 shadow-sm transition-all hover:shadow-md',
                        d.enabled
                          ? 'border-slate-200 bg-white ring-1 ring-slate-100 dark:border-slate-700 dark:bg-slate-800/40 dark:ring-slate-800'
                          : 'border-slate-200/70 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50',
                        blocked ? 'opacity-90 grayscale-[0.35]' : ''
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm" style={{ background: d.family === 'FaithHub Surface' ? EV_GREEN : d.family === 'Custom RTMP' ? '#312e81' : '#0f172a' }}>
                              {d.family === 'FaithHub Surface' ? <Globe2 className="h-5 w-5" /> : d.family === 'Custom RTMP' ? <Radio className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                            </div>
                            <div className="min-w-0">
                              <div className="truncate text-sm font-bold text-slate-900 dark:text-slate-50">{d.name}</div>
                              <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">{d.owner}</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <Badge tone={statusTone(d.status)}>
                            {d.status === 'Connected' ? <CheckCircle2 className="h-3.5 w-3.5" /> : d.status === 'Live' ? <Activity className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                            {statusLabel(d.status)}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] sm:text-[11px] font-bold text-slate-600 dark:text-slate-400">Enable</span>
                            <Toggle
                              checked={d.enabled}
                              disabled={blocked}
                              onChange={(v) => {
                                toggleDestination(d.id, v);
                                if (blocked) showError('This destination is currently blocked');
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Badge tone={familyTone(d.family)}>{d.family}</Badge>
                        {d.routeOrder ? <Badge tone="neutral">Route {d.routeOrder}</Badge> : null}
                        <Badge tone="neutral">{d.creativeVariant}</Badge>
                      </div>

                      {needsFix ? (
                        <div className="mt-3 rounded-xl bg-orange-50 dark:bg-amber-500/10 p-3 ring-1 ring-orange-200 dark:ring-amber-500/20 transition-colors">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="mt-0.5 h-4 w-4 text-orange-700 dark:text-amber-400" />
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-orange-800 dark:text-amber-300">{d.errorTitle || 'Action required'}</div>
                              <div className="text-[10px] sm:text-xs text-orange-700 dark:text-amber-400">{d.errorNext || 'Resolve this issue before enabling the destination.'}</div>
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <button
                                  className="inline-flex h-8 items-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-3 text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-slate-100 ring-1 ring-orange-200 dark:ring-slate-800 hover:bg-orange-50 dark:hover:bg-slate-800 transition active:scale-[0.98]"
                                  onClick={() => showNotification(`Open access panel for ${d.name}`)}
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  Manage access
                                </button>
                                {d.status === 'Needs re-auth' || d.status === 'Missing credentials' ? (
                                  <button
                                    className="inline-flex h-8 items-center gap-2 rounded-xl px-3 text-[10px] sm:text-xs font-semibold text-white hover:opacity-95 transition active:scale-[0.98]"
                                    style={{ background: EV_GREEN }}
                                    onClick={() => handleReconnect(d.id)}
                                  >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                    Resolve now
                                  </button>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 p-3 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200">Credential and access panel</div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-500">{d.tokenStatus}</span>
                        </div>
                        <div className="mt-1 line-clamp-2 text-[10px] sm:text-xs text-slate-600 dark:text-slate-400">{d.historyNote}</div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <button
                          onClick={() => openAdvanced(d.id)}
                          className="inline-flex h-9 items-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-3 text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-slate-100 ring-1 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-[0.98] shadow-sm"
                        >
                          <Settings2 className="h-4 w-4" />
                          Per-platform settings
                        </button>

                        <button
                          onClick={() => showNotification(d.enabled ? `Previewing ${d.name} safe-area and surface variant` : `Enable ${d.name} before opening a live preview`)}
                          className={cx(
                            'inline-flex h-9 items-center gap-2 rounded-xl px-3 text-[10px] sm:text-xs font-semibold ring-1 transition active:scale-[0.98] shadow-sm',
                            d.enabled
                              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 ring-slate-900 dark:ring-slate-100 hover:opacity-95'
                              : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 ring-slate-200 dark:ring-slate-800'
                          )}
                        >
                          <Eye className="h-4 w-4" />
                          Preview
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 rounded-[14px] bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <SectionTitle
                icon={<Layers className="h-5 w-5" />}
                title="Session routing table"
                subtitle="Choose where this session goes, in what order, with which creative variant, language track, and fallback rule. Route order becomes the single source of truth for Studio handoff and destination monitoring."
                right={<Badge tone="orange">{selectedPreset.chip}</Badge>}
              />

              <div className="mt-4 overflow-hidden rounded-[14px] ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
                <div className="grid grid-cols-12 gap-2 bg-slate-50 dark:bg-slate-900/50 px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <div className="col-span-1">Order</div>
                  <div className="col-span-3">Destination</div>
                  <div className="col-span-2">Variant</div>
                  <div className="col-span-2">Language</div>
                  <div className="col-span-2">Fallback</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {activeDestinations.map((d, index) => (
                    <div key={d.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center text-[11px] sm:text-xs">
                      <div className="col-span-1">
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-black text-white" style={{ background: index === 0 ? EV_GREEN : EV_ORANGE }}>
                          {d.routeOrder}
                        </div>
                      </div>
                      <div className="col-span-3 min-w-0">
                        <div className="font-bold text-slate-900 dark:text-slate-100 truncate">{d.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{d.family} Â· {prettyKbps(d.health.outBitrateKbps)}</div>
                      </div>
                      <div className="col-span-2 min-w-0">
                        <div className="truncate text-slate-700 dark:text-slate-200 font-semibold">{d.creativeVariant}</div>
                      </div>
                      <div className="col-span-2 min-w-0">
                        <div className="truncate text-slate-700 dark:text-slate-200">{d.settings.languageTrack || 'Default'}</div>
                      </div>
                      <div className="col-span-2 min-w-0">
                        <div className="truncate text-slate-700 dark:text-slate-200">{d.fallbackRule}</div>
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <button
                          onClick={() => moveRoute(d.id, -1)}
                          disabled={index === 0}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 text-slate-800 dark:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveRoute(d.id, 1)}
                          disabled={index === activeDestinations.length - 1}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 text-slate-800 dark:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openAdvanced(d.id)}
                          className="inline-flex h-8 items-center gap-1 rounded-xl bg-slate-900 dark:bg-slate-100 px-3 text-[10px] sm:text-xs font-semibold text-white dark:text-slate-900"
                        >
                          <Settings2 className="h-3.5 w-3.5" />
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                  {!activeDestinations.length ? (
                    <div className="px-4 py-8 text-sm text-slate-500 dark:text-slate-400">No active destinations yet. Connect or enable at least one surface to build the routing plan.</div>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-[14px] bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Preset-based distribution flow</div>
                      <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Keep repeat sessions fast while still preserving platform-specific quality.</div>
                    </div>
                    <Badge tone="neutral">Current Â· {selectedPreset.label}</Badge>
                  </div>
                  <div className="mt-3 text-sm text-slate-700 dark:text-slate-200">{selectedPreset.desc}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {PRESETS.map((preset) => (
                      <Pill key={preset.id} active={preset.id === selectedPresetId} onClick={() => applyPreset(preset.id)}>
                        {preset.label}
                      </Pill>
                    ))}
                  </div>
                  <div className="mt-3 rounded-xl bg-white dark:bg-slate-900/80 p-3 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                    <div className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200">Beacon bridge note</div>
                    <div className="mt-1 text-[10px] sm:text-xs text-slate-600 dark:text-slate-400">{selectedPreset.beaconNote}</div>
                  </div>
                </div>

                <div className="rounded-[14px] bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Per-platform settings quality</div>
                      <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Metadata, safe-area preview, and compliance notes stay platform-specific.</div>
                    </div>
                    <Badge tone="green"><ShieldCheck className="h-3.5 w-3.5" />Quality preserved</Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {activeDestinations.slice(0, 4).map((d) => (
                      <div key={d.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 transition">
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{d.name}</div>
                        <div className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{d.settings.complianceNote}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[14px] bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <SectionTitle
                icon={<Activity className="h-5 w-5" />}
                title="Health and feedback panel"
                subtitle={sessionStatus === 'Live' ? 'Real-time distribution confirmation, viewer presence, and remediation guidance across every active destination.' : 'Pre-live health rehearsal for your routing plan. Use it to confirm bandwidth, captions, and fallback confidence before the session starts.'}
                right={
                  <div className="flex items-center gap-2">
                    <Badge tone={masterHealthTone}><Wifi className="h-3.5 w-3.5" />Upload {estimatedUploadMbps.toFixed(1)} Mbps</Badge>
                    <Badge tone="neutral"><Gauge className="h-3.5 w-3.5" />Need {requiredUploadMbps.toFixed(1)} Mbps</Badge>
                  </div>
                }
              />

              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <div className="rounded-[14px] bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Master distribution health</div>
                        <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Output bitrate trend across enabled destinations.</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900 dark:text-slate-50">{prettyKbps(profile.bitrateKbps)}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-500">Target</div>
                      </div>
                    </div>

                    <div className={cx('mt-3', sessionStatus === 'Ended' && 'opacity-60')}>
                      <MiniLine values={masterTrend} tone={sessionStatus === 'Live' ? 'orange' : 'green'} />
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge tone={estimatedUploadMbps >= requiredUploadMbps ? 'green' : 'orange'}>
                        <Wifi className="h-3.5 w-3.5" />
                        Upload {estimatedUploadMbps.toFixed(1)} Mbps
                      </Badge>
                      <Badge tone={profile.captions ? 'blue' : 'neutral'}>
                        <Bell className="h-3.5 w-3.5" />
                        Captions {profile.captions ? 'on' : 'off'}
                      </Badge>
                      <Badge tone="purple">
                        <TimerReset className="h-3.5 w-3.5" />
                        {fallbackRule}
                      </Badge>
                    </div>

                    <div className="mt-4 rounded-xl bg-white dark:bg-slate-900/80 p-3 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                      <div className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200">Fallback and redundancy controls</div>
                      <div className="mt-2 grid gap-2">
                        {([
                          'Keep FaithHub primary',
                          'Retry + backup RTMP',
                          'Internal only if external fails',
                        ] as FallbackRule[]).map((rule) => (
                          <button
                            key={rule}
                            onClick={() => setFallbackRule(rule)}
                            className={cx(
                              'flex items-center justify-between rounded-xl px-3 py-2 text-[10px] sm:text-xs font-semibold ring-1 transition active:scale-[0.98]',
                              fallbackRule === rule
                                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 ring-slate-900 dark:ring-slate-100'
                                : 'bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-300 ring-slate-200 dark:ring-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                            )}
                          >
                            <span className="truncate">{rule}</span>
                            <ArrowRight className={cx('h-3.5 w-3.5', fallbackRule === rule ? 'text-white dark:text-slate-900' : 'text-slate-400 dark:text-slate-600')} />
                          </button>
                        ))}
                      </div>
                      <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-500">
                        Recommended: keep FaithHub primary so the in-app audience remains protected even when an external route degrades.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="overflow-hidden rounded-[14px] ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
                    <div className="bg-white dark:bg-slate-900 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Per-destination feedback</div>
                          <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1">Connection status, start confirmation, viewer presence, error state, and quick remediation notes.</div>
                        </div>
                        <Badge tone={sessionStatus === 'Live' ? 'blue' : 'neutral'}>
                          <Activity className="h-3.5 w-3.5" />
                          {sessionStatus === 'Live' ? 'Live confirmation' : 'Pre-live rehearsal'}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50">
                      <div className="grid grid-cols-12 gap-2 border-t border-slate-200 dark:border-slate-800 px-4 py-2 text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                        <div className="col-span-3">Destination</div>
                        <div className="col-span-2 text-center">Viewers</div>
                        <div className="col-span-2 text-center">Errors</div>
                        <div className="col-span-2 text-center">ACK</div>
                        <div className="col-span-3 text-right">Health</div>
                      </div>
                      <div className="divide-y divide-slate-200 dark:divide-slate-800">
                        {activeDestinations.map((d) => (
                          <div key={d.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center text-[11px] sm:text-xs">
                            <div className="col-span-3 min-w-0">
                              <div className="font-bold text-slate-900 dark:text-slate-100 truncate">{d.name}</div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{d.settings.safeAreaMode}</div>
                            </div>
                            <div className="col-span-2 text-center font-semibold text-slate-700 dark:text-slate-200">{d.health.viewers.toLocaleString()}</div>
                            <div className="col-span-2 text-center font-semibold text-slate-700 dark:text-slate-200">{d.health.errors}</div>
                            <div className="col-span-2 text-center font-semibold text-slate-700 dark:text-slate-200">{d.health.lastAckSec}s</div>
                            <div className="col-span-3 flex items-center justify-end gap-2">
                              <Badge tone={statusTone(d.status)}>{statusLabel(d.status)}</Badge>
                              <MiniLine values={d.health.trend} tone={d.family === 'FaithHub Surface' ? 'green' : 'orange'} />
                            </div>
                          </div>
                        ))}
                        {!activeDestinations.length ? (
                          <div className="px-4 py-8 text-sm text-slate-500 dark:text-slate-400">No active destinations to monitor yet.</div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[14px] bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <SectionTitle
                icon={<PlayCircle className="h-5 w-5" />}
                title="Cross-posting and archive rules"
                subtitle="Decide what happens after the live event: which replay stays internal, what clips can auto-publish, and when Beacon should receive the post-live handoff."
                right={<Badge tone="blue">Post-live intelligence</Badge>}
              />

              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="space-y-3">
                  <div className="rounded-[14px] bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Archive and replay policy</div>
                    <div className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Keeps replay behaviour explicit per live session, instead of letting platforms decide after the broadcast ends.</div>
                    <div className="mt-3 grid gap-2">
                      {(['Internal only', 'Replay only', 'Replay + clips', 'Manual after review'] as CrossPostRule[]).map((rule) => (
                        <button
                          key={rule}
                          onClick={() => setCrossPostRule(rule)}
                          className={cx(
                            'flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold ring-1 transition active:scale-[0.98]',
                            crossPostRule === rule
                              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ring-slate-900 dark:ring-slate-100 shadow-sm'
                              : 'bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 ring-slate-200 dark:ring-slate-800 hover:bg-white dark:hover:bg-slate-900'
                          )}
                        >
                          <span>{rule}</span>
                          {crossPostRule === rule ? <CheckCircle2 className="h-4 w-4" style={{ color: EV_GREEN }} /> : null}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-[14px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Protect master recording</div>
                          <div className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Keep the FaithHub replay and ISO protection safe even if a destination fails.</div>
                        </div>
                        <Toggle checked={recordMaster} onChange={setRecordMaster} />
                      </div>
                    </div>
                    <div className="rounded-[14px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Protect ISO / backup paths</div>
                          <div className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Preserve isolated or fallback recordings for fast replay packaging.</div>
                        </div>
                        <Toggle checked={protectIso} onChange={setProtectIso} />
                      </div>
                    </div>
                    <div className="rounded-[14px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Direct Beacon bridge</div>
                          <div className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Open Beacon for replay or clip promotion immediately after broadcast.</div>
                        </div>
                        <Toggle checked={beaconBridge} onChange={setBeaconBridge} />
                      </div>
                    </div>
                    <div className="rounded-[14px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Internal feed remains primary</div>
                          <div className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Preserve FaithHub as the central source of truth even when multi-streaming outward.</div>
                        </div>
                        <Toggle checked={profile.internalPrimary} onChange={(v) => setProfile((prev) => ({ ...prev, internalPrimary: v }))} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[14px] bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Approval and distribution summary</div>
                  <div className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Final confirmation that shows exactly what will go live where, plus the cross-posting and Beacon handoff path.</div>

                  <div className="mt-4 rounded-[14px] overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
                    <div className="px-4 py-4 text-white" style={{ background: 'linear-gradient(135deg, #03cd8c 0%, #0f766e 45%, #f77f00 100%)' }}>
                      <Badge tone="green">Distribution summary</Badge>
                      <div className="mt-3 text-2xl font-extrabold leading-tight">{DEFAULT_SESSION_TITLE}</div>
                      <div className="mt-1 text-sm text-white/90">FaithHub central feed Â· {activeDestinations.length} live route{activeDestinations.length === 1 ? '' : 's'} Â· {crossPostRule}</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {activeDestinations.map((d) => (
                          <span key={d.id} className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                            {d.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition">
                          <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Creative variant</div>
                          <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{selectedPreset.creativeVariant}</div>
                        </div>
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition">
                          <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Language tracks</div>
                          <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{selectedPreset.languageTrack}</div>
                        </div>
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition">
                          <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Fallback rule</div>
                          <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{fallbackRule}</div>
                        </div>
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition">
                          <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Beacon bridge</div>
                          <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{beaconBridge ? 'Replay and clip boost ready' : 'Disabled for this session'}</div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        {approvalItems.map((item) => (
                          <div key={item.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-3 transition">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.label}</div>
                                {item.detail ? <div className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">{item.detail}</div> : null}
                                {item.fix ? <div className="mt-1 text-[10px] sm:text-xs text-orange-700 dark:text-amber-400">{item.fix}</div> : null}
                              </div>
                              <Badge tone={item.status === 'Pass' ? 'green' : item.status === 'Warn' ? 'orange' : 'red'}>{item.status}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex items-start justify-between gap-3 rounded-xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Approve distribution summary</div>
                          <div className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Required before the plan is published to Live Studio and the operational team.</div>
                        </div>
                        <Toggle checked={distributionApproved} onChange={setDistributionApproved} />
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <button
                          onClick={handlePublishPlan}
                          disabled={!planPublishReady || isPending}
                          className={cx(
                            'inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-bold text-white shadow-sm transition active:scale-[0.98]',
                            !planPublishReady || isPending ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-600 cursor-not-allowed' : 'hover:opacity-95'
                          )}
                          style={!planPublishReady || isPending ? undefined : { background: EV_GREEN }}
                        >
                          {isPending ? <CircularProgress size={14} color="inherit" /> : <Zap className="h-4 w-4" />}
                          Publish distribution plan
                        </button>
                        <button
                          onClick={handleCopyPlanLink}
                          className="inline-flex h-10 items-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-4 text-sm font-semibold text-slate-800 dark:text-slate-100 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-[0.98]"
                        >
                          <Copy className="h-4 w-4" /> Copy plan link
                        </button>
                        <button
                          onClick={() => safeNav(ROUTES.beaconBuilder)}
                          className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95 transition active:scale-[0.98]"
                          style={{ background: EV_ORANGE }}
                        >
                          <Megaphone className="h-4 w-4" /> Open Beacon bridge
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="space-y-5 lg:sticky lg:top-[104px]">
              <div className="rounded-[14px] bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
                <SectionTitle
                  icon={<ShieldCheck className="h-5 w-5" />}
                  title="Credential and access panel"
                  subtitle="Authorized platform connections, team ownership, token health, and reconnect prompts stay visible without leaving the page."
                />

                <div className="mt-4 space-y-3">
                  {destinations.map((d) => (
                    <div key={d.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{d.name}</div>
                          <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">{d.owner}</div>
                        </div>
                        <Badge tone={statusTone(d.status)}>{statusLabel(d.status)}</Badge>
                      </div>
                      <div className="mt-2 text-[10px] sm:text-xs text-slate-600 dark:text-slate-400">{d.tokenStatus}</div>
                      <div className="mt-2 flex items-center justify-between gap-2 text-[10px] sm:text-xs">
                        <span className="text-slate-500 dark:text-slate-400">{d.historyNote}</span>
                        {d.status === 'Needs re-auth' || d.status === 'Missing credentials' ? (
                          <button className="font-semibold text-orange-700 dark:text-amber-400" onClick={() => handleReconnect(d.id)}>
                            Fix
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[14px] bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition overflow-hidden">
                <SectionTitle
                  icon={<Eye className="h-5 w-5" />}
                  title="Distribution preview"
                  subtitle="Preview the in-app surface plus the mobile-safe destination framing before the session goes live."
                />

                <div className="mt-4 rounded-[14px] overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
                  <div className="px-4 py-4 text-white" style={{ background: 'linear-gradient(180deg, #03cd8c 0%, #0f766e 55%, #f77f00 100%)' }}>
                    <Badge tone="green">FaithHub surface preview</Badge>
                    <div className="mt-3 text-3xl font-extrabold leading-tight">Sunday Encounter Live</div>
                    <div className="mt-1 text-sm text-white/90">Live Sessionz Â· Central Campus Â· Thu 18:30</div>
                    <div className="mt-3 h-2 w-full rounded-full bg-white/20">
                      <div className="h-2 rounded-full" style={{ width: '72%', background: EV_ORANGE }} />
                    </div>
                    <div className="mt-2 text-xs text-white/85">Readiness score Â· 72% Â· Distribution plan pre-approved</div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 px-4 py-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-950 transition">
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Desktop surface</div>
                          <div className="mt-2 rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-white dark:bg-slate-900">
                            <div className="h-3 w-28 rounded-full" style={{ background: EV_GREEN }} />
                            <div className="mt-3 h-3 w-40 rounded-full bg-slate-800 dark:bg-slate-100" />
                            <div className="mt-2 h-3 w-32 rounded-full bg-slate-300 dark:bg-slate-700" />
                            <div className="mt-4 grid grid-cols-2 gap-2">
                              {activeDestinations.slice(0, 4).map((d) => (
                                <div key={d.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2">
                                  <div className="text-[11px] font-bold text-slate-900 dark:text-slate-100 truncate">{d.name}</div>
                                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{d.settings.safeAreaMode}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <div className="w-[138px] rounded-[34px] bg-slate-950 p-3 shadow-2xl">
                          <div className="relative overflow-hidden rounded-[16px] bg-white dark:bg-slate-900 h-[300px] transition-colors">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 w-20 h-5 bg-black rounded-b-2xl" />
                            <div className="p-3">
                              <div className="flex items-center justify-between text-[10px] font-bold text-slate-900 dark:text-slate-100">
                                <span>FaithHub</span>
                                <span style={{ color: EV_GREEN }}>Share</span>
                              </div>
                              <div className="mt-3 rounded-[20px] overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(3,205,140,0.32) 0%, rgba(247,127,0,0.9) 100%)' }}>
                                <div className="h-24 w-full" style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.12) 0%, rgba(15,23,42,0.76) 100%)' }} />
                                <div className="p-3 text-white">
                                  <div className="text-[13px] font-extrabold leading-tight">Sunday Encounter</div>
                                  <div className="mt-1 text-[10px] text-white/85">FaithHub Live Hub</div>
                                </div>
                              </div>
                              <div className="mt-3 space-y-2">
                                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 text-[10px] font-semibold text-slate-700 dark:text-slate-300">YouTube + Instagram + FaithHub</div>
                                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 text-[10px] font-semibold text-slate-700 dark:text-slate-300">Language tracks ready</div>
                                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 text-[10px] font-semibold text-slate-700 dark:text-slate-300">Fallback Â· FaithHub primary</div>
                              </div>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2">
                              <div className="rounded-xl py-3 text-center text-[11px] font-extrabold text-white" style={{ background: EV_GREEN }}>Open live</div>
                              <div className="rounded-xl py-3 text-center text-[11px] font-extrabold text-white" style={{ background: EV_ORANGE }}>View replay plan</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[14px] bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
                <SectionTitle
                  icon={<Gauge className="h-5 w-5" />}
                  title="Global output profile"
                  subtitle="Keep the session source of truth stable while preserving per-destination creative overrides."
                />

                <div className="mt-4 grid gap-3">
                  <div>
                    <div className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Orientation</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(['Landscape', 'Portrait', 'Adaptive'] as OutputOrientation[]).map((orientation) => (
                        <Pill
                          key={orientation}
                          active={profile.orientation === orientation}
                          onClick={() => setProfile((prev) => ({ ...prev, orientation }))}
                        >
                          {orientation}
                        </Pill>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Quality preset</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(['Standard', 'High', 'Broadcast'] as OutputQuality[]).map((quality) => (
                        <Pill
                          key={quality}
                          active={profile.quality === quality}
                          onClick={() =>
                            setProfile((prev) => ({
                              ...prev,
                              quality,
                              bitrateKbps: quality === 'Standard' ? 4200 : quality === 'High' ? 6200 : 7800,
                            }))
                          }
                        >
                          {quality}
                        </Pill>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Translation tracks</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {['English', 'Swahili', 'French'].map((track) => {
                        const active = profile.translationTracks.includes(track);
                        return (
                          <button
                            key={track}
                            onClick={() =>
                              setProfile((prev) => ({
                                ...prev,
                                translationTracks: active
                                  ? prev.translationTracks.filter((item) => item !== track)
                                  : [...prev.translationTracks, track],
                              }))
                            }
                            className={cx(
                              'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] sm:text-xs font-semibold ring-1 transition active:scale-[0.98]',
                              active
                                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 ring-slate-900 dark:ring-slate-100'
                                : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-300 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                            )}
                          >
                            {track}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Captions and confidence</div>
                        <div className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Accessibility readiness stays visible because it affects both in-app and external quality.</div>
                      </div>
                      <Toggle checked={profile.captions} onChange={(v) => setProfile((prev) => ({ ...prev, captions: v }))} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={advancedOpen && !!selectedDest}
        title={selectedDest ? `${selectedDest.name} settings` : 'Destination settings'}
        subtitle="Per-platform title variants, descriptions, language tracks, privacy settings, safe-area preview notes, and archive rules."
        onClose={() => setAdvancedOpen(false)}
        wide
      >
        {selectedDest ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-5">
              <div className="rounded-[14px] bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Per-platform metadata</div>
                    <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Protect quality by tuning copy and safe-area details for this single destination.</div>
                  </div>
                  <Badge tone={familyTone(selectedDest.family)}>{selectedDest.family}</Badge>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <div className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Title variant</div>
                      <input
                        value={selectedDest.settings.title}
                        onChange={(e) => updateDestinationSettings(selectedDest.id, { title: e.target.value })}
                        className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 transition shadow-sm"
                        placeholder="Custom title"
                      />
                    </div>

                    <div>
                      <div className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Description variant</div>
                      <textarea
                        value={selectedDest.settings.description}
                        onChange={(e) => updateDestinationSettings(selectedDest.id, { description: e.target.value })}
                        className="mt-1.5 min-h-[120px] w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 transition shadow-sm resize-none"
                        placeholder="What should this audience see on this platform?"
                      />
                    </div>

                    <div>
                      <div className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Creative variant label</div>
                      <input
                        value={selectedDest.creativeVariant}
                        onChange={(e) => updateDestination(selectedDest.id, { creativeVariant: e.target.value })}
                        className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 transition shadow-sm"
                        placeholder="Creative variant"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedDest.supportsPrivacy ? (
                      <div>
                        <div className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Privacy</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(['Public', 'Unlisted', 'Private'] as Privacy[]).map((privacy) => (
                            <Pill
                              key={privacy}
                              active={selectedDest.settings.privacy === privacy}
                              onClick={() => updateDestinationSettings(selectedDest.id, { privacy })}
                            >
                              {privacy}
                            </Pill>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-white dark:bg-slate-900/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                        <div className="flex items-start gap-2">
                          <Info className="mt-0.5 h-4 w-4 text-slate-600 dark:text-slate-400" />
                          <div className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 italic">Privacy controls are not supported for this destination.</div>
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Language track</div>
                      <input
                        value={selectedDest.settings.languageTrack || ''}
                        onChange={(e) => updateDestinationSettings(selectedDest.id, { languageTrack: e.target.value })}
                        className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 transition shadow-sm"
                        placeholder="English main track"
                        disabled={!selectedDest.supportsLanguageTracks}
                      />
                    </div>

                    <div>
                      <div className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Safe-area preview note</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(['16:9 safe', '9:16 preview', 'Square crop'] as Destination['settings']['safeAreaMode'][]).map((mode) => (
                          <Pill
                            key={mode}
                            active={selectedDest.settings.safeAreaMode === mode}
                            onClick={() => updateDestinationSettings(selectedDest.id, { safeAreaMode: mode })}
                            title={selectedDest.supportsSafeAreaPreview ? undefined : 'Not supported'}
                          >
                            {mode}
                          </Pill>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Archive rule</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(['Keep replay internal', 'Auto-publish replay', 'Auto-publish replay + clips'] as Destination['settings']['archiveRule'][]).map((rule) => (
                          <Pill
                            key={rule}
                            active={selectedDest.settings.archiveRule === rule}
                            onClick={() => updateDestinationSettings(selectedDest.id, { archiveRule: rule })}
                            title={selectedDest.supportsArchiveRule ? undefined : 'Archive rule locked'}
                          >
                            {rule}
                          </Pill>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[14px] bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Compliance and routing note</div>
                    <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Keep operational notes visible so producers understand what makes this destination unique before pressing go live.</div>
                  </div>
                  <Badge tone="orange"><Info className="h-3.5 w-3.5" />Needs review</Badge>
                </div>
                <textarea
                  value={selectedDest.settings.complianceNote}
                  onChange={(e) => updateDestinationSettings(selectedDest.id, { complianceNote: e.target.value })}
                  className="mt-4 min-h-[120px] w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 transition shadow-sm resize-none"
                />
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => showNotification(`Open ${selectedDest.name} policy notebook`) }
                    className="inline-flex h-9 items-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-3 text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-slate-100 ring-1 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-[0.98]"
                  >
                    <ExternalLink className="h-4 w-4" /> Open platform rules
                  </button>
                  <button
                    onClick={() => handleReconnect(selectedDest.id)}
                    className="inline-flex h-9 items-center gap-2 rounded-xl px-3 text-[10px] sm:text-xs font-semibold text-white shadow-sm hover:opacity-95 transition active:scale-[0.98]"
                    style={{ background: EV_GREEN }}
                  >
                    <RefreshCw className="h-4 w-4" /> Refresh access
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5">
              <div className="rounded-[14px] bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 transition overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Safe-area and audience preview</div>
                    <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">See how the session title, subtitle, and CTA framing will land on this destination.</div>
                  </div>
                  <Badge tone={selectedDest.supportsSafeAreaPreview ? 'green' : 'neutral'}>{selectedDest.settings.safeAreaMode}</Badge>
                </div>

                <div className="mt-4 rounded-[14px] overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
                  <div className="aspect-[16/9] bg-slate-100 dark:bg-slate-950 relative overflow-hidden">
                    <img src={selectedDest.thumbnailUrl || DEFAULT_THUMBNAIL} alt={selectedDest.name} className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge tone="green">{selectedDest.name}</Badge>
                    </div>
                    <div className="absolute right-3 top-3">
                      <Badge tone="orange">{selectedDest.settings.safeAreaMode}</Badge>
                    </div>
                    <div className="absolute left-4 right-4 bottom-4 text-white">
                      <div className="text-xl font-extrabold leading-tight line-clamp-2">{selectedDest.settings.title || DEFAULT_SESSION_TITLE}</div>
                      <div className="mt-2 text-sm text-white/90 line-clamp-2">{selectedDest.settings.description}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Connection state</div>
                    <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{statusLabel(selectedDest.status)}</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Health history</div>
                    <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{selectedDest.health.errors} error{selectedDest.health.errors === 1 ? '' : 's'} Â· ACK {selectedDest.health.lastAckSec}s</div>
                  </div>
                </div>
              </div>

              <div className="rounded-[14px] bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Credential and access snapshot</div>
                <div className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Team ownership, token state, and the quick actions this operator is most likely to need.</div>
                <div className="mt-4 rounded-xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Owner</div>
                  <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{selectedDest.owner}</div>
                  <div className="mt-3 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Token status</div>
                  <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{selectedDest.tokenStatus}</div>
                  <div className="mt-3 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Operational note</div>
                  <div className="mt-1 text-sm text-slate-700 dark:text-slate-200">{selectedDest.historyNote}</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={presetOpen}
        onClose={() => setPresetOpen(false)}
        title="Apply destination preset"
        subtitle="Preset-based distribution flows speed up weekly sessions and special one-off broadcasts without sacrificing platform quality."
      >
        <div className="grid gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                applyPreset(preset.id);
                setPresetOpen(false);
              }}
              className={cx(
                'rounded-[14px] border p-4 text-left transition hover:shadow-md',
                preset.id === selectedPresetId
                  ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{preset.label}</div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{preset.desc}</div>
                </div>
                <Badge tone="orange">{preset.chip}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {preset.destIds.map((id) => {
                  const found = destinations.find((d) => d.id === id);
                  return found ? <Badge key={id} tone={found.family === 'FaithHub Surface' ? 'green' : found.family === 'Custom RTMP' ? 'purple' : 'blue'}>{found.name}</Badge> : null;
                })}
              </div>
            </button>
          ))}
        </div>
      </Modal>

      <Modal
        open={connectOpen}
        onClose={() => setConnectOpen(false)}
        title="Connect destination"
        subtitle="Add an external platform or resolve a destination connection before it joins this sessionâ€™s routing plan."
      >
        <div className="grid gap-3">
          {availableToConnect.map((dest) => (
            <div key={dest.id} className="rounded-[14px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{dest.name}</div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{dest.owner}</div>
                </div>
                <Badge tone={statusTone(dest.status)}>{statusLabel(dest.status)}</Badge>
              </div>
              <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-400">{dest.historyNote}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    handleReconnect(dest.id);
                    toggleDestination(dest.id, true);
                  }}
                  className="inline-flex h-9 items-center gap-2 rounded-xl px-3 text-[11px] font-semibold text-white shadow-sm hover:opacity-95 transition active:scale-[0.98]"
                  style={{ background: EV_GREEN }}
                >
                  <CheckCircle2 className="h-4 w-4" /> Resolve and enable
                </button>
                <button
                  onClick={() => openAdvanced(dest.id)}
                  className="inline-flex h-9 items-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-800 dark:text-slate-100 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-[0.98]"
                >
                  <Settings2 className="h-4 w-4" /> Open settings
                </button>
              </div>
            </div>
          ))}
          {!availableToConnect.length ? <div className="text-sm text-slate-500 dark:text-slate-400">All destinations are already connected and healthy.</div> : null}
        </div>
      </Modal>
    </div>
  );
}


