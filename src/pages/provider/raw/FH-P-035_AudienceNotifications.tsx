// @ts-nocheck

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bell,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Copy,
  Eye,
  ExternalLink,
  Filter,
  Globe2,
  Info,
  Languages,
  Layers,
  Link2,
  Mail,
  Megaphone,
  MessageCircle,
  Phone,
  PlayCircle,
  QrCode,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Users,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import { KpiTile } from "../../../components/ui/KpiTile";

/**
 * FaithHub — Audience Notifications
 * Premium lifecycle journey page rebuilt from the creator-style Audience Notifications base.
 * Primary colour: EVzone Green (#03cd8c)
 * Secondary colour: EVzone Orange (#f77f00)
 */

const GREEN = "#03cd8c";
const ORANGE = "#f77f00";
const GREY = "#a6a6a6";
const LIGHT = "#f2f2f2";

type SourceType =
  | "Live Session"
  | "Replay"
  | "Clip"
  | "Event"
  | "Giving Campaign"
  | "Charity Crowdfund"
  | "Beacon Destination";

type JourneyNodeKey =
  | "pre_live"
  | "countdown"
  | "start_now"
  | "replay_ready"
  | "clip_follow_up"
  | "event_reminder"
  | "giving_reminder";

type ChannelKey =
  | "push"
  | "email"
  | "sms"
  | "whatsapp"
  | "telegram"
  | "in_app";

type LocaleKey = "en" | "sw" | "fr";
type PreviewTab = "push" | "email" | "sms" | "whatsapp";
type SendMode = "manual" | "scheduled" | "event_based";

type JourneyNode = {
  key: JourneyNodeKey;
  label: string;
  hint: string;
  offset: string;
  recommended: string;
  outcome: string;
};

type ChannelConfig = {
  key: ChannelKey;
  name: string;
  short: string;
  connected: "Connected" | "Needs attention" | "Restricted";
  note: string;
  deliverability: string;
  priority: "High" | "Normal" | "Low";
  throttle: string;
  supportsLocalizedPreview: boolean;
};

type LocaleVariant = {
  headline: string;
  body: string;
  cta: string;
  deepLink: string;
};

type Segment = {
  id: string;
  label: string;
  size: string;
  category: string;
};

type MetricCard = {
  label: string;
  value: string;
  hint: string;
  tone: "good" | "warn" | "bad" | "brand" | "accent" | "neutral";
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function Pill({
  children,
  tone = "neutral",
  title,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "good" | "warn" | "bad" | "brand" | "accent";
  title?: string;
}) {
  const cls =
    tone === "good"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
      : tone === "warn"
        ? "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20"
        : tone === "bad"
          ? "bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20"
          : tone === "brand"
            ? "text-white ring-0 shadow-sm"
            : tone === "accent"
              ? "text-white ring-0 shadow-sm"
              : "bg-slate-100 text-slate-800 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700";

  const style =
    tone === "brand"
      ? { backgroundColor: GREEN }
      : tone === "accent"
        ? { backgroundColor: ORANGE }
        : undefined;

  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-bold ring-1 whitespace-nowrap transition",
        cls,
      )}
      style={style}
    >
      {children}
    </span>
  );
}

function Btn({
  children,
  onClick,
  tone = "neutral",
  disabled,
  left,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: "neutral" | "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  left?: React.ReactNode;
  title?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  const cls =
    tone === "primary"
      ? "text-white hover:brightness-95 shadow-md"
      : tone === "secondary"
        ? "text-white hover:brightness-95 shadow-md"
        : tone === "danger"
          ? "bg-rose-600 text-white hover:brightness-95 shadow-md shadow-rose-500/20"
          : tone === "ghost"
            ? "bg-transparent text-slate-900 dark:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-900"
            : "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 ring-1 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm";

  const style =
    tone === "primary"
      ? { backgroundColor: GREEN, boxShadow: "0 12px 24px rgba(3,205,140,.18)" }
      : tone === "secondary"
        ? { backgroundColor: ORANGE, boxShadow: "0 12px 24px rgba(247,127,0,.18)" }
        : undefined;

  return (
    <button
      title={title}
      className={cn(base, cls)}
      style={style}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {left}
      <span className="truncate">{children}</span>
    </button>
  );
}

function Toggle({
  value,
  onChange,
  disabled,
  tone = "brand",
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  tone?: "brand" | "accent";
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!value)}
      className={cn(
        "relative inline-flex h-5 w-10 sm:h-6 sm:w-11 items-center rounded-full transition-colors",
        disabled
          ? "bg-slate-200 dark:bg-slate-800 cursor-not-allowed"
          : value
            ? ""
            : "bg-slate-300 dark:bg-slate-700",
      )}
      style={value && !disabled ? { backgroundColor: tone === "brand" ? GREEN : ORANGE } : undefined}
      aria-pressed={value}
      aria-label={value ? "Enabled" : "Disabled"}
      title={disabled ? "Locked" : undefined}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full bg-white shadow-md transition",
          value ? "translate-x-5" : "translate-x-1",
        )}
      />
    </button>
  );
}

function Drawer({
  open,
  title,
  onClose,
  children,
  widthClass = "max-w-5xl",
  right,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  widthClass?: string;
  right?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const originalBodyOverflow = document.body.style.overflow;
    const originalDocOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalDocOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110]">
      <div
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-full bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ease-out sm:ring-1 sm:ring-slate-200 dark:sm:ring-slate-800",
          widthClass,
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4">
            <div className="min-w-0">
              <div className="truncate text-lg font-bold text-slate-900 dark:text-slate-50">
                {title}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {right}
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string; hint?: string; locked?: boolean }>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="w-full h-11 rounded-xl bg-white dark:bg-slate-900 px-4 text-left ring-1 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
        onClick={() => setOpen((s) => !s)}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-slate-900 dark:text-slate-50">
              {selected?.label ?? "Select"}
            </div>
            {selected?.hint ? (
              <div className="truncate text-[10px] font-semibold text-slate-500 dark:text-slate-500">
                {selected.hint}
              </div>
            ) : null}
          </div>
          <ChevronDown
            className={cn("h-4 w-4 text-slate-400 transition-transform", open && "rotate-180")}
          />
        </div>
      </button>

      {open ? (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-xl ring-1 ring-slate-200 dark:ring-slate-800">
          <div className="max-h-[300px] overflow-y-auto">
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                className={cn(
                  "w-full px-4 py-3 text-left transition",
                  o.value === value ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                  o.locked && "opacity-60 cursor-not-allowed",
                )}
                onClick={() => {
                  if (o.locked) return;
                  onChange(o.value);
                  setOpen(false);
                }}
                disabled={o.locked}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-slate-900 dark:text-slate-50">
                      {o.label}
                    </div>
                    {o.hint ? (
                      <div className="truncate text-[10px] font-semibold text-slate-500 dark:text-slate-500">
                        {o.hint}
                      </div>
                    ) : null}
                  </div>
                  {o.locked ? <Pill tone="warn">Locked</Pill> : null}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MetricTile({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "neutral" | "good" | "warn" | "bad" | "brand" | "accent";
}) {
  const normalizedTone =
    tone === "bad"
      ? "danger"
      : tone === "brand"
        ? "navy"
        : tone === "accent"
          ? "orange"
          : tone === "neutral"
            ? "gray"
            : tone;

  return <KpiTile label={label} value={value} hint={hint} tone={normalizedTone} size="compact" />;
}

function CardShell({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tight">
            {title}
          </div>
          <div className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </div>
        </div>
        {right}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function StatBadge({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "warn" | "bad" | "brand" | "accent";
}) {
  return (
    <div className="rounded-2xl px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-800 bg-slate-50 dark:bg-slate-950 transition">
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">
        {label}
      </div>
      <div
        className={cn(
          "mt-1 text-sm font-black",
          tone === "good"
            ? "text-emerald-600 dark:text-emerald-400"
            : tone === "warn"
              ? "text-amber-600 dark:text-amber-400"
              : tone === "bad"
                ? "text-rose-600 dark:text-rose-400"
                : tone === "brand"
                  ? ""
                  : tone === "accent"
                    ? ""
                    : "text-slate-900 dark:text-slate-50",
        )}
        style={
          tone === "brand"
            ? { color: GREEN }
            : tone === "accent"
              ? { color: ORANGE }
              : undefined
        }
      >
        {value}
      </div>
    </div>
  );
}

function ProgressBar({
  value,
  tone = "brand",
}: {
  value: number;
  tone?: "brand" | "accent" | "good" | "warn" | "bad";
}) {
  const pct = Math.max(0, Math.min(100, value));
  const color =
    tone === "brand"
      ? GREEN
      : tone === "accent"
        ? ORANGE
        : tone === "good"
          ? "#10b981"
          : tone === "warn"
            ? "#f59e0b"
            : "#ef4444";

  return (
    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

function ChannelPill({ channel }: { channel: ChannelConfig }) {
  const icon =
    channel.key === "email" ? (
      <Mail className="h-3.5 w-3.5" />
    ) : channel.key === "sms" ? (
      <Phone className="h-3.5 w-3.5" />
    ) : channel.key === "push" ? (
      <Bell className="h-3.5 w-3.5" />
    ) : (
      <MessageCircle className="h-3.5 w-3.5" />
    );

  const tone =
    channel.connected === "Connected"
      ? "good"
      : channel.connected === "Needs attention"
        ? "warn"
        : "bad";

  return (
    <Pill tone={tone}>
      {icon}
      {channel.name}
    </Pill>
  );
}

function PhoneMock({
  title,
  subtitle,
  body,
  footer,
}: {
  title: string;
  subtitle?: string;
  body: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[420px]">
      <div className="relative overflow-hidden rounded-[40px] bg-slate-900 dark:bg-black p-3 shadow-2xl transition ring-1 ring-slate-800">
        <div className="flex flex-col rounded-[32px] bg-white dark:bg-slate-900 overflow-hidden">
          <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4">
            <div className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest">
              {subtitle ?? "Preview"}
            </div>
            <div className="mt-1 text-sm font-black text-slate-900 dark:text-slate-50">
              {title}
            </div>
          </div>
          <div className="flex-1 p-6">
            <div className="space-y-3">
              <div className="inline-block max-w-[95%] rounded-2xl bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200 ring-1 ring-slate-100 dark:ring-white/5 shadow-sm">
                {body}
              </div>
              {footer ? <div className="pt-2">{footer}</div> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailPreview({
  subject,
  preheader,
  body,
  cta,
}: {
  subject: string;
  preheader: string;
  body: string;
  cta: string;
}) {
  return (
    <div className="rounded-[28px] bg-slate-900 p-3 shadow-2xl ring-1 ring-slate-800">
      <div className="overflow-hidden rounded-[24px] bg-white dark:bg-slate-900">
        <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">
            Email preview
          </div>
          <div className="mt-1 text-sm font-black text-slate-900 dark:text-slate-50">
            {subject}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {preheader}
          </div>
        </div>
        <div className="space-y-4 p-6">
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 p-4 text-sm font-medium text-slate-800 dark:text-slate-200 ring-1 ring-slate-100 dark:ring-white/5">
            {body}
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-xs font-black text-white"
            style={{ backgroundColor: GREEN }}
           onClick={() => safeNav("/faithhub/provider/audience-notifications")}>
            {cta}
          </button>
        </div>
      </div>
    </div>
  );
}

function SmsPreview({
  sender,
  message,
  accent = false,
}: {
  sender: string;
  message: string;
  accent?: boolean;
}) {
  return (
    <PhoneMock
      title={sender}
      subtitle="SMS / Messaging preview"
      body={
        <div className="space-y-2">
          <div className="text-sm font-semibold">{message}</div>
          <div className="flex flex-wrap gap-2 pt-1">
            <span
              className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black text-white"
              style={{ backgroundColor: accent ? ORANGE : GREEN }}
            >
              Tap to open
            </span>
          </div>
        </div>
      }
    />
  );
}

const journeyBlueprint: JourneyNode[] = [
  {
    key: "pre_live",
    label: "Pre-live warm-up",
    hint: "Build anticipation with a high-quality value reminder.",
    offset: "T-24h",
    recommended: "Followers • warm audience • multilingual",
    outcome: "Drives registrations and calendar adds",
  },
  {
    key: "countdown",
    label: "Countdown reminder",
    hint: "Drive return traffic with a short, urgent touchpoint.",
    offset: "T-60m",
    recommended: "Followers • high-intent • recent viewers",
    outcome: "Lifts attendance at start of broadcast",
  },
  {
    key: "start_now",
    label: "Start-now blast",
    hint: "Push a live-now call-to-action as the session starts.",
    offset: "Live",
    recommended: "Active app users • opted-in push • SMS",
    outcome: "Captures late arrivals and in-the-moment interest",
  },
  {
    key: "replay_ready",
    label: "Replay-ready follow-up",
    hint: "Send a polished replay journey once publishing completes.",
    offset: "+20m",
    recommended: "Missed viewers • time-zone catch-up",
    outcome: "Recovers missed attendance into replay starts",
  },
  {
    key: "clip_follow_up",
    label: "Clip follow-up",
    hint: "Drop a short-form clip with a strong deep link.",
    offset: "+6h",
    recommended: "Socially active followers • new prospects",
    outcome: "Creates discovery and Beacon-ready promotion",
  },
  {
    key: "event_reminder",
    label: "Event reminder",
    hint: "Connect session attendance to the next physical or virtual event.",
    offset: "+1d",
    recommended: "Registrants • volunteers • event audiences",
    outcome: "Pushes registrations and check-ins",
  },
  {
    key: "giving_reminder",
    label: "Giving reminder",
    hint: "Follow up with a meaningful giving or crowdfund appeal.",
    offset: "+1d",
    recommended: "Donors • supporters • response-ready segments",
    outcome: "Converts ministry impact into support",
  },
];

const audienceSegmentsSeed: Segment[] = [
  { id: "seg_followers", label: "Followers", size: "18,420", category: "Core audience" },
  { id: "seg_youth", label: "Youth ministry", size: "5,940", category: "Audience group" },
  { id: "seg_donors", label: "Recurring donors", size: "1,284", category: "Donor status" },
  { id: "seg_replay", label: "Replay viewers", size: "8,120", category: "Content behaviour" },
  { id: "seg_event", label: "Event registrants", size: "2,110", category: "Event pipeline" },
  { id: "seg_beacon", label: "Beacon engagers", size: "3,402", category: "Promotion response" },
];

const channelSeed: ChannelConfig[] = [
  {
    key: "push",
    name: "Push",
    short: "Push",
    connected: "Connected",
    note: "Best for live-now and replay-ready journeys with rich deep links.",
    deliverability: "92% healthy",
    priority: "High",
    throttle: "Max 2 per day",
    supportsLocalizedPreview: true,
  },
  {
    key: "email",
    name: "Email",
    short: "Email",
    connected: "Connected",
    note: "Best for pre-live, replay-ready, and event follow-up with richer storytelling.",
    deliverability: "88% healthy",
    priority: "Normal",
    throttle: "Fatigue guard enabled",
    supportsLocalizedPreview: true,
  },
  {
    key: "sms",
    name: "SMS",
    short: "SMS",
    connected: "Connected",
    note: "Best for short countdown and last-minute recovery sends.",
    deliverability: "97% healthy",
    priority: "High",
    throttle: "Quiet hours enforced",
    supportsLocalizedPreview: true,
  },
  {
    key: "whatsapp",
    name: "WhatsApp",
    short: "WA",
    connected: "Connected",
    note: "Best for opted-in conversation-first reminders and prayer/giving follow-ups.",
    deliverability: "Template-safe",
    priority: "Normal",
    throttle: "Template limits active",
    supportsLocalizedPreview: true,
  },
  {
    key: "telegram",
    name: "Telegram",
    short: "TG",
    connected: "Needs attention",
    note: "Useful for community channels and real-time replay drops.",
    deliverability: "Needs connector review",
    priority: "Low",
    throttle: "No overload risk",
    supportsLocalizedPreview: true,
  },
  {
    key: "in_app",
    name: "In-app inbox",
    short: "Inbox",
    connected: "Connected",
    note: "Persists inside FaithHub and supports contextual follow-up after the live moment.",
    deliverability: "100% internal",
    priority: "Normal",
    throttle: "Unlimited internal",
    supportsLocalizedPreview: true,
  },
];

const localeLabels: Record<LocaleKey, { label: string; hint: string }> = {
  en: { label: "English", hint: "Default creative" },
  sw: { label: "Swahili", hint: "East Africa variant" },
  fr: { label: "French", hint: "Regional support variant" },
};

const templatePresets = [
  "Sunday service lifecycle",
  "Replay revival",
  "Crowdfund recovery",
  "Event attendance push",
  "Beacon promotion handoff",
];

function buildInitialVariants(sourceType: SourceType): Record<LocaleKey, LocaleVariant> {
  const subjectRoot =
    sourceType === "Live Session"
      ? "Sunday Encounter Live"
      : sourceType === "Replay"
        ? "Replay Ready"
        : sourceType === "Clip"
          ? "New clip available"
          : sourceType === "Event"
            ? "Upcoming ministry event"
            : sourceType === "Giving Campaign"
              ? "Support this campaign"
              : sourceType === "Charity Crowdfund"
                ? "Help us reach the goal"
                : "New Beacon promotion";

  return {
    en: {
      headline: `${subjectRoot} • Join with purpose`,
      body: "You asked to stay connected. Here is the right message at the right moment, with a deep link that takes people straight into the most relevant FaithHub experience.",
      cta: "Open in FaithHub",
      deepLink: "faithhub://live/sunday-encounter",
    },
    sw: {
      headline: `${subjectRoot} • Jiunge sasa`,
      body: "Ujumbe huu umeboreshwa kwa wakati unaofaa, lugha sahihi, na kiungo kinachopeleka mtu moja kwa moja kwenye tukio au replay inayohitajika.",
      cta: "Fungua kwenye FaithHub",
      deepLink: "faithhub://live/sunday-encounter?locale=sw",
    },
    fr: {
      headline: `${subjectRoot} • Rejoignez maintenant`,
      body: "Ce message est localisé pour le bon moment, le bon public, et le bon résultat ministériel — participation, replay, don, inscription ou promotion.",
      cta: "Ouvrir dans FaithHub",
      deepLink: "faithhub://live/sunday-encounter?locale=fr",
    },
  };
}

function stageTone(key: JourneyNodeKey) {
  if (key === "start_now" || key === "giving_reminder") return "accent" as const;
  if (key === "replay_ready" || key === "clip_follow_up") return "brand" as const;
  return "neutral" as const;
}

function buildPreviewHeadline(node: JourneyNode, variant: LocaleVariant) {
  if (variant.headline.trim()) return variant.headline;
  return `${node.label} • FaithHub`;
}

function buildPreviewBody(node: JourneyNode, variant: LocaleVariant) {
  if (variant.body.trim()) return variant.body;
  return `${node.hint} ${node.outcome}`;
}

export default function FaithHubAudienceNotificationsPage() {
  const [sourceType, setSourceType] = useState<SourceType>("Live Session");
  const [journeyName, setJourneyName] = useState("Sunday Encounter Lifecycle Journey");
  const [selectedNode, setSelectedNode] = useState<JourneyNodeKey>("countdown");
  const [enabledNodes, setEnabledNodes] = useState<Record<JourneyNodeKey, boolean>>({
    pre_live: true,
    countdown: true,
    start_now: true,
    replay_ready: true,
    clip_follow_up: true,
    event_reminder: false,
    giving_reminder: true,
  });

  const [selectedSegments, setSelectedSegments] = useState<string[]>([
    "seg_followers",
    "seg_youth",
    "seg_replay",
  ]);
  const [segmentSearch, setSegmentSearch] = useState("");
  const [languageTarget, setLanguageTarget] = useState("English + Swahili");
  const [regionTarget, setRegionTarget] = useState("East Africa");
  const [engagementTarget, setEngagementTarget] = useState("Watched within 30 days");
  const [donorTarget, setDonorTarget] = useState("Donors + non-donors");
  const [priorInteractionTarget, setPriorInteractionTarget] = useState("Live viewers + replay starters");

  const [enabledChannels, setEnabledChannels] = useState<Record<ChannelKey, boolean>>({
    push: true,
    email: true,
    sms: true,
    whatsapp: true,
    telegram: false,
    in_app: true,
  });

  const [selectedLocale, setSelectedLocale] = useState<LocaleKey>("en");
  const [variants, setVariants] = useState<Record<LocaleKey, LocaleVariant>>(
    buildInitialVariants("Live Session"),
  );
  const [previewImage, setPreviewImage] = useState("FaithHub_live_reminder_cover.png");
  const [abVariantEnabled, setAbVariantEnabled] = useState(true);
  const [variantBLabel, setVariantBLabel] = useState("Hope-led opening");

  const [sendMode, setSendMode] = useState<SendMode>("event_based");
  const [smartSend, setSmartSend] = useState(true);
  const [fatigueSuppression, setFatigueSuppression] = useState(true);
  const [quietHours, setQuietHours] = useState(true);
  const [lastMinuteRecovery, setLastMinuteRecovery] = useState(true);
  const [approvalRequired, setApprovalRequired] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTab, setPreviewTab] = useState<PreviewTab>("push");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setVariants(buildInitialVariants(sourceType));
  }, [sourceType]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const activeNode = useMemo(
    () => journeyBlueprint.find((node) => node.key === selectedNode) ?? journeyBlueprint[0],
    [selectedNode],
  );

  const filteredSegments = useMemo(() => {
    const q = segmentSearch.trim().toLowerCase();
    return audienceSegmentsSeed.filter((segment) =>
      q
        ? `${segment.label} ${segment.category}`.toLowerCase().includes(q)
        : true,
    );
  }, [segmentSearch]);

  const activeSegments = useMemo(
    () => audienceSegmentsSeed.filter((segment) => selectedSegments.includes(segment.id)),
    [selectedSegments],
  );

  const enabledChannelList = useMemo(
    () => channelSeed.filter((channel) => enabledChannels[channel.key]),
    [enabledChannels],
  );

  const healthScore = useMemo(() => {
    const nodeWeight = Object.values(enabledNodes).filter(Boolean).length >= 4 ? 22 : 12;
    const channelWeight = enabledChannelList.length >= 3 ? 22 : 10;
    const localeWeight = (Object.values(variants) as LocaleVariant[]).filter((variant) => variant.headline.trim() && variant.body.trim()).length >= 2 ? 22 : 10;
    const audienceWeight = activeSegments.length >= 2 ? 22 : 10;
    const complianceWeight = quietHours && fatigueSuppression ? 12 : 6;
    return Math.min(100, nodeWeight + channelWeight + localeWeight + audienceWeight + complianceWeight);
  }, [enabledNodes, enabledChannelList.length, variants, activeSegments.length, quietHours, fatigueSuppression]);

  const systemIssues = useMemo(() => {
    const issues: string[] = [];
    if (!journeyName.trim()) issues.push("Add a journey name.");
    if (Object.values(enabledNodes).filter(Boolean).length < 2)
      issues.push("Enable at least two lifecycle stages.");
    if (activeSegments.length === 0)
      issues.push("Select at least one audience segment.");
    if (enabledChannelList.length === 0)
      issues.push("Enable at least one messaging channel.");
    if (!variants.en.headline.trim() || !variants.en.body.trim())
      issues.push("Complete the default English creative.");
    if (!variants.en.deepLink.trim())
      issues.push("Attach a deep link destination.");
    return issues;
  }, [journeyName, enabledNodes, activeSegments.length, enabledChannelList.length, variants]);

  const systemReady = systemIssues.length === 0;

  const activeVariant = variants[selectedLocale];
  const previewHeadline = buildPreviewHeadline(activeNode, activeVariant);
  const previewBody = buildPreviewBody(activeNode, activeVariant);

  const stageMetrics: MetricCard[] = [
    {
      label: "Open rate",
      value: "61%",
      hint: "Rolling average for this journey archetype",
      tone: "brand",
    },
    {
      label: "Tap rate",
      value: "24%",
      hint: "Deep-link engagement strength",
      tone: "accent",
    },
    {
      label: "Delivery failures",
      value: "1.8%",
      hint: "Suppressed by fatigue and quiet-hour logic",
      tone: "warn",
    },
    {
      label: "Ministry outcomes",
      value: "312",
      hint: "Watch starts, replays, donations and sign-ups",
      tone: "good",
    },
  ];

  const attributionCards = useMemo(
    () => [
      { label: "Watch starts", value: "1,284", hint: "People entered the live or replay", tone: "brand" as const },
      { label: "Replay starts", value: "436", hint: "Recovered viewers after the live moment", tone: "good" as const },
      { label: "Donations", value: "78", hint: "Support actions from journey traffic", tone: "accent" as const },
      { label: "Crowdfund backers", value: "23", hint: "Direct conversion into charity support", tone: "good" as const },
      { label: "Event registrations", value: "57", hint: "People moved into the next in-person moment", tone: "brand" as const },
      { label: "Beacon conversions", value: "91", hint: "Promotion bridge from content into campaign action", tone: "accent" as const },
    ],
    [],
  );

  const toggleSegment = (id: string) => {
    setSelectedSegments((prev) =>
      prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id],
    );
  };

  const toggleChannel = (key: ChannelKey, value: boolean) => {
    setEnabledChannels((prev) => ({ ...prev, [key]: value }));
  };

  const toggleNode = (key: JourneyNodeKey, value: boolean) => {
    setEnabledNodes((prev) => ({ ...prev, [key]: value }));
  };

  const updateVariant = (locale: LocaleKey, patch: Partial<LocaleVariant>) => {
    setVariants((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        ...patch,
      },
    }));
  };

  const sourceTypeOptions = [
    { value: "Live Session", label: "Live Session", hint: "Attendance and live response" },
    { value: "Replay", label: "Replay", hint: "Catch-up and replay conversion" },
    { value: "Clip", label: "Clip", hint: "Short-form discovery" },
    { value: "Event", label: "Event", hint: "Attendance and registration" },
    { value: "Giving Campaign", label: "Giving Campaign", hint: "Support and generosity" },
    { value: "Charity Crowdfund", label: "Charity Crowdfund", hint: "Goal-based charitable support" },
    { value: "Beacon Destination", label: "Beacon Destination", hint: "Promotion handoff and retargeting" },
  ] as const;

  const sendModeOptions = [
    { value: "manual", label: "Manual", hint: "Human-triggered sends" },
    { value: "scheduled", label: "Scheduled", hint: "Fixed send calendar" },
    { value: "event_based", label: "Event-based", hint: "Driven by live and replay status" },
  ] as const;

  const nextBestWindow =
    sourceType === "Live Session"
      ? "Sun • 18:42 local time"
      : sourceType === "Replay"
        ? "Mon • 07:15 local time"
        : sourceType === "Charity Crowdfund"
          ? "Tue • 12:10 local time"
          : "Today • 19:20 local time";

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f2f2f2] dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors overflow-x-hidden">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition">
        <div className="w-full flex flex-col gap-4 px-4 md:px-6 lg:px-8 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 overflow-x-auto">
              <div className="flex items-center gap-2 whitespace-nowrap text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                <span className="hover:text-slate-700 dark:hover:text-slate-200 transition cursor-default">
                  Provider Workspace
                </span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="hover:text-slate-700 dark:hover:text-slate-200 transition cursor-default">
                  Audience & Outreach
                </span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="text-slate-900 dark:text-slate-100 italic">
                  Audience Notifications
                </span>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
                Audience Notifications
              </div>
              <div className="flex gap-2 flex-wrap">
                <Pill tone="brand">
                  <Sparkles className="h-3.5 w-3.5" />
                  Lifecycle automation
                </Pill>
                <Pill tone={systemReady ? "good" : "warn"}>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {systemReady ? "Compliance ready" : "Needs checks"}
                </Pill>
                <Pill tone={enabledChannelList.length >= 4 ? "good" : "warn"}>
                  <Bell className="h-3.5 w-3.5" />
                  {enabledChannelList.length} channels active
                </Pill>
              </div>
            </div>

            <div className="mt-2 text-xs font-bold text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-slate-400" />
                {sourceType}
              </span>
              <span className="text-slate-200 dark:text-slate-800">|</span>
              <span className="flex items-center gap-1.5">
                <Globe2 className="h-3.5 w-3.5 text-slate-400" />
                {languageTarget} • {regionTarget}
              </span>
              <span className="text-slate-200 dark:text-slate-800">|</span>
              <span className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-slate-400" />
                Health score {healthScore}%
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-10 items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 p-1 ring-1 ring-slate-200/50 dark:ring-slate-800/50">
              <Btn tone="ghost" onClick={() => setPreviewOpen(true)} left={<Eye className="h-4 w-4" />}>
                Preview
              </Btn>
              <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
              <Btn tone="secondary" onClick={() => setToast("Test notification sent to preview endpoints")} left={<Send className="h-4 w-4" />}>
                Send test
              </Btn>
              <Btn
                tone="primary"
                onClick={() => setToast(systemReady ? "Audience journey activated" : "Finish the remaining checks first")}
                left={<Zap className="h-4 w-4" />}
                disabled={!systemReady}
              >
                Activate campaign
              </Btn>
            </div>
          </div>
        </div>

        {/* Preflight strip */}
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition">
          <div className="w-full px-4 md:px-6 lg:px-8 py-2.5">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="flex flex-wrap items-center gap-3">
                <Pill tone={systemReady ? "good" : "warn"}>
                  {systemReady ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                  SYSTEM CHECK
                </Pill>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">
                  {systemReady
                    ? "Journey, audience, channels, compliance and attribution are ready for activation."
                    : systemIssues[0] || "Configuration required before activation."}
                </span>
              </div>
              {!systemReady ? (
                <div className="flex items-center gap-2 text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-500/5 px-2 py-0.5 rounded-md">
                  <AlertTriangle className="h-3 w-3" />
                  {systemIssues.length} issue{systemIssues.length === 1 ? "" : "s"} detected
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Wand2 className="h-3 w-3" style={{ color: GREEN }} />
                  Smart send-time recommendations active
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          {/* Left rail */}
          <div className="xl:col-span-3 space-y-4">
            <CardShell
              title="Journey builder"
              subtitle="Create notification journey, choose a linked source, and orchestrate a premium timeline."
              right={
                <Pill tone="brand">
                  <Bell className="h-3.5 w-3.5" />
                  {Object.values(enabledNodes).filter(Boolean).length} stages live
                </Pill>
              }
            >
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">
                    Journey name
                  </div>
                  <input
                    value={journeyName}
                    onChange={(e) => setJourneyName(e.target.value)}
                    className="mt-2 h-11 w-full rounded-xl bg-white dark:bg-slate-900 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 ring-1 ring-slate-200 dark:ring-slate-800 outline-none"
                    placeholder="Enter journey name"
                  />
                  <div className="mt-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 mb-2">
                      Linked object
                    </div>
                    <Select
                      value={sourceType}
                      onChange={(v) => setSourceType(v as SourceType)}
                      options={sourceTypeOptions as unknown as Array<{ value: string; label: string; hint?: string }>}
                    />
                  </div>
                  <div className="mt-3">
                    <Btn tone="primary" onClick={() => setToast("New notification journey draft created")} left={<Sparkles className="h-4 w-4" />}>
                      Create notification journey
                    </Btn>
                  </div>
                </div>

                <div className="space-y-3">
                  {journeyBlueprint.map((node, idx) => {
                    const active = selectedNode === node.key;
                    const enabled = enabledNodes[node.key];
                    return (
                      <button
                        key={node.key}
                        type="button"
                        onClick={() => setSelectedNode(node.key)}
                        className={cn(
                          "w-full rounded-2xl border p-3 text-left transition shadow-sm",
                          active
                            ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-black text-white shadow-sm"
                                style={{ backgroundColor: idx % 2 === 0 ? GREEN : ORANGE }}
                              >
                                {String(idx + 1).padStart(2, "0")}
                              </span>
                              <div className="min-w-0">
                                <div className="mt-2 text-[28px] font-black leading-[1.04] tracking-[-0.03em] text-slate-900 dark:text-slate-100 sm:text-[34px] lg:text-[40px]">
                                  {node.label}
                                </div>
                                <div className="mt-1.5 text-[14px] leading-6 text-slate-500 dark:text-slate-400">
                                  {node.offset} • {node.hint}
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <Pill tone={stageTone(node.key)}>{node.recommended}</Pill>
                            </div>
                            <div className="mt-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                              {node.outcome}
                            </div>
                          </div>
                          <Toggle value={enabled} onChange={(v) => toggleNode(node.key, v)} tone={idx % 2 === 0 ? "brand" : "accent"} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-orange-50 dark:from-emerald-900/10 dark:to-amber-900/10 p-4 ring-1 ring-emerald-100 dark:ring-emerald-900/20">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: GREY }}>
                        Smart send recommendation
                      </div>
                      <div className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">
                        Best next window: {nextBestWindow}
                      </div>
                      <div className="mt-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        Based on recent audience arrival, fatigue risk, donor responsiveness, and regional quiet hours.
                      </div>
                    </div>
                    <Pill tone="brand">
                      <Wand2 className="h-3.5 w-3.5" />
                      AI assist
                    </Pill>
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={78} tone="brand" />
                    <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <span>Recommendation confidence</span>
                      <span>78%</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-orange-200 dark:border-orange-900/40 bg-orange-50/70 dark:bg-orange-900/10 p-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-orange-700 dark:text-orange-300">
                    Premium blueprints
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {templatePresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setToast(`${preset} preset loaded`)}
                        className="rounded-full border border-orange-200 dark:border-orange-800/50 bg-white dark:bg-slate-900 px-3 py-1.5 text-[11px] font-black text-orange-700 dark:text-orange-200"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardShell>
          </div>

          {/* Main content */}
          <div className="xl:col-span-6 space-y-4">
            <CardShell
              title="Audience selector"
              subtitle="Filter by followers, groups, language, region, engagement history, donor status, and prior interactions."
              right={
                <Pill tone="good">
                  <Users className="h-3.5 w-3.5" />
                  {activeSegments.length} segments selected
                </Pill>
              }
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)]">
                  <div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        value={segmentSearch}
                        onChange={(e) => setSegmentSearch(e.target.value)}
                        placeholder="Search contacts, segments, groups, or behaviours"
                        className="h-11 w-full rounded-xl bg-slate-50 dark:bg-slate-950 pl-10 pr-4 text-sm font-bold text-slate-900 dark:text-slate-100 ring-1 ring-slate-200 dark:ring-slate-800 outline-none"
                      />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {filteredSegments.map((segment) => {
                        const active = selectedSegments.includes(segment.id);
                        return (
                          <button
                            key={segment.id}
                            type="button"
                            onClick={() => toggleSegment(segment.id)}
                            className={cn(
                              "rounded-full border px-3 py-2 text-left transition",
                              active
                                ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10"
                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800",
                            )}
                          >
                            <div className="text-[11px] font-black text-slate-900 dark:text-slate-100">
                              {segment.label}
                            </div>
                            <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                              {segment.category} • {segment.size}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <StatBadge label="Followers" value="18.4k" tone="brand" />
                    <StatBadge label="Warm audience" value="8.1k" tone="good" />
                    <StatBadge label="Donor-ready" value="1.2k" tone="accent" />
                    <StatBadge label="Re-engage" value="742" tone="warn" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 mb-2">
                      Language
                    </div>
                    <Select
                      value={languageTarget}
                      onChange={setLanguageTarget}
                      options={[
                        { value: "English + Swahili", label: "English + Swahili", hint: "Primary regional blend" },
                        { value: "English only", label: "English only", hint: "Single-language journey" },
                        { value: "French + English", label: "French + English", hint: "Regional support variant" },
                      ]}
                    />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 mb-2">
                      Region
                    </div>
                    <Select
                      value={regionTarget}
                      onChange={setRegionTarget}
                      options={[
                        { value: "East Africa", label: "East Africa", hint: "Kenya • Uganda • Tanzania" },
                        { value: "Global", label: "Global", hint: "All opted-in viewers" },
                        { value: "Francophone regions", label: "Francophone regions", hint: "French-language audiences" },
                      ]}
                    />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 mb-2">
                      Engagement history
                    </div>
                    <Select
                      value={engagementTarget}
                      onChange={setEngagementTarget}
                      options={[
                        { value: "Watched within 30 days", label: "Watched within 30 days", hint: "Warm viewers" },
                        { value: "Dormant 31-90 days", label: "Dormant 31–90 days", hint: "Recovery segment" },
                        { value: "High-intent clickers", label: "High-intent clickers", hint: "Recent CTA responders" },
                      ]}
                    />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 mb-2">
                      Donor & interaction logic
                    </div>
                    <Select
                      value={donorTarget}
                      onChange={setDonorTarget}
                      options={[
                        { value: "Donors + non-donors", label: "Donors + non-donors", hint: "Balanced audience" },
                        { value: "Donors only", label: "Donors only", hint: "Support-led reminder" },
                        { value: "Non-donors only", label: "Non-donors only", hint: "Attendance-first focus" },
                      ]}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">
                        Prior content interactions
                      </div>
                      <div className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">
                        {priorInteractionTarget}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPriorInteractionTarget("Live viewers + clip engagers + event registrants")}
                      className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-3 py-2 text-[11px] font-black text-slate-700 dark:text-slate-200 ring-1 ring-slate-200 dark:ring-slate-800"
                    >
                      <Filter className="h-4 w-4" />
                      Refine logic
                    </button>
                  </div>
                  <div className="mt-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    This audience selector can blend audience groups, behavioural segments, giving data, and prior session interactions into one launch-ready cohort.
                  </div>
                </div>
              </div>
            </CardShell>

            <CardShell
              title="Channel mix planner"
              subtitle="Choose the right blend across push, email, SMS, and connected messaging surfaces with throttling and priority logic."
              right={
                <Pill tone="accent">
                  <Megaphone className="h-3.5 w-3.5" />
                  Multi-channel
                </Pill>
              }
            >
              <div className="space-y-3">
                {channelSeed.map((channel) => {
                  const enabled = enabledChannels[channel.key];
                  const tone =
                    channel.connected === "Connected"
                      ? "good"
                      : channel.connected === "Needs attention"
                        ? "warn"
                        : "bad";

                  return (
                    <div
                      key={channel.key}
                      className={cn(
                        "rounded-2xl p-4 ring-1 transition group",
                        enabled
                          ? "bg-slate-100 dark:bg-slate-800/40 ring-slate-200 dark:ring-slate-700 shadow-sm"
                          : "bg-slate-50/50 dark:bg-slate-900 ring-slate-100 dark:ring-slate-800 opacity-80 hover:opacity-100",
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                              {channel.name}
                            </div>
                            <Pill tone={tone}>{channel.connected}</Pill>
                            <Pill tone={enabled ? "brand" : "neutral"}>{channel.priority} priority</Pill>
                          </div>
                          <div className="mt-2 text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-500 leading-tight">
                            {channel.note}
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <ChannelPill channel={channel} />
                            <Pill tone="neutral">{channel.deliverability}</Pill>
                            <Pill tone="neutral">{channel.throttle}</Pill>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 shrink-0">
                          <Toggle value={enabled} onChange={(v) => toggleChannel(channel.key, v)} tone={channel.key === "email" ? "accent" : "brand"} />
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewTab(
                                channel.key === "email"
                                  ? "email"
                                  : channel.key === "sms"
                                    ? "sms"
                                    : channel.key === "whatsapp" || channel.key === "telegram"
                                      ? "whatsapp"
                                      : "push",
                              );
                              setPreviewOpen(true);
                            }}
                            className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400"
                          >
                            Preview
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/5 p-4 ring-1 ring-emerald-200 dark:ring-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-400">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                  <div>
                    <div className="font-black uppercase tracking-wider mb-1">Premium lifecycle logic</div>
                    <div className="font-semibold leading-relaxed">
                      Live, replay, giving, event, and Beacon destinations can all share one orchestration layer, while each channel still respects throttle rules, quiet hours, and fatigue suppression.
                    </div>
                  </div>
                </div>
              </div>
            </CardShell>

            <CardShell
              title="Template & creative studio"
              subtitle="Build premium copy, localized variants, button text, deep links, preview images, and A/B creative tests."
              right={
                <Pill tone="brand">
                  <Languages className="h-3.5 w-3.5" />
                  Localized
                </Pill>
              }
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {(Object.keys(localeLabels) as LocaleKey[]).map((locale) => {
                    const active = locale === selectedLocale;
                    const variant = variants[locale];
                    const completed = variant.headline.trim() && variant.body.trim();
                    return (
                      <button
                        key={locale}
                        type="button"
                        onClick={() => setSelectedLocale(locale)}
                        className={cn(
                          "rounded-full border px-3 py-2 transition",
                          active
                            ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900",
                        )}
                      >
                        <div className="text-[11px] font-black text-slate-900 dark:text-slate-100">
                          {localeLabels[locale].label}
                        </div>
                        <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          {completed ? "Ready" : "Needs copy"}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">
                        Headline
                      </div>
                      <input
                        value={activeVariant.headline}
                        onChange={(e) => updateVariant(selectedLocale, { headline: e.target.value })}
                        className="mt-2 h-11 w-full rounded-xl bg-slate-50 dark:bg-slate-950 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 ring-1 ring-slate-200 dark:ring-slate-800 outline-none"
                        placeholder="Write the notification headline"
                      />
                    </div>

                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">
                        Body copy
                      </div>
                      <textarea
                        value={activeVariant.body}
                        onChange={(e) => updateVariant(selectedLocale, { body: e.target.value })}
                        rows={5}
                        className="mt-2 w-full rounded-2xl bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 ring-1 ring-slate-200 dark:ring-slate-800 outline-none"
                        placeholder="Write the localized message body"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">
                          CTA text
                        </div>
                        <input
                          value={activeVariant.cta}
                          onChange={(e) => updateVariant(selectedLocale, { cta: e.target.value })}
                          className="mt-2 h-11 w-full rounded-xl bg-slate-50 dark:bg-slate-950 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 ring-1 ring-slate-200 dark:ring-slate-800 outline-none"
                          placeholder="Button text"
                        />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">
                          Deep link
                        </div>
                        <input
                          value={activeVariant.deepLink}
                          onChange={(e) => updateVariant(selectedLocale, { deepLink: e.target.value })}
                          className="mt-2 h-11 w-full rounded-xl bg-slate-50 dark:bg-slate-950 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 ring-1 ring-slate-200 dark:ring-slate-800 outline-none"
                          placeholder="faithhub://..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">
                      Creative controls
                    </div>
                    <div className="mt-3 rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-[12px] font-black text-slate-900 dark:text-slate-100">
                            Preview image
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {previewImage}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setToast("Creative asset picker opened")}
                          className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-[12px] font-black text-slate-900 dark:text-slate-100">
                            A/B variant
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {variantBLabel}
                          </div>
                        </div>
                        <Toggle value={abVariantEnabled} onChange={setAbVariantEnabled} tone="accent" />
                      </div>
                    </div>

                    <div className="mt-3 rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="text-[12px] font-black text-slate-900 dark:text-slate-100">
                        Creative note
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        This studio supports premium localized variants, deep links to live or replay surfaces, dynamic preview images, and audience-appropriate tone shifts without rebuilding the whole journey.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardShell>

            <CardShell
              title="Trigger & send logic"
              subtitle="Support manual sends, scheduled sends, event-based triggers, recovery sends, and replay follow-up sequences tied to real session status."
              right={
                <Pill tone="accent">
                  <TimerReset className="h-3.5 w-3.5" />
                  Smart timing
                </Pill>
              }
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 mb-2">
                      Send mode
                    </div>
                    <Select
                      value={sendMode}
                      onChange={(v) => setSendMode(v as SendMode)}
                      options={sendModeOptions as unknown as Array<{ value: string; label: string; hint?: string }>}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <StatBadge label="Next send" value={nextBestWindow} tone="brand" />
                    <StatBadge label="Quiet hours" value={quietHours ? "On" : "Off"} tone={quietHours ? "good" : "warn"} />
                    <StatBadge label="Recovery sends" value={lastMinuteRecovery ? "Enabled" : "Off"} tone={lastMinuteRecovery ? "accent" : "neutral"} />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">
                    Active timeline
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {journeyBlueprint
                      .filter((node) => enabledNodes[node.key])
                      .map((node) => (
                        <div
                          key={node.key}
                          className={cn(
                            "rounded-2xl border px-4 py-3 transition",
                            selectedNode === node.key
                              ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10"
                              : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <div className="text-[12px] font-black text-slate-900 dark:text-slate-100">
                                {node.label}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                {node.offset} • {sendMode === "event_based" ? "event-triggered" : sendMode === "scheduled" ? "calendar-based" : "manual launch"}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedNode(node.key)}
                              className="inline-flex h-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 px-3 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300"
                            >
                              Focus
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                    <div className="text-[12px] font-black text-slate-900 dark:text-slate-100">
                      Smart send-time recommendations
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      Uses prior audience arrival and fatigue signals to adjust launch times per channel.
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        Recommendation engine
                      </div>
                      <Toggle value={smartSend} onChange={setSmartSend} tone="brand" />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                    <div className="text-[12px] font-black text-slate-900 dark:text-slate-100">
                      Fatigue-aware suppression
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      Blocks over-messaging when a contact already received too many recent prompts.
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        Suppression logic
                      </div>
                      <Toggle value={fatigueSuppression} onChange={setFatigueSuppression} tone="accent" />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                    <div className="text-[12px] font-black text-slate-900 dark:text-slate-100">
                      Quiet hours & consent windows
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      Respects region-specific quiet hours, child-safe windows, and channel-level consent.
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        Quiet hours
                      </div>
                      <Toggle value={quietHours} onChange={setQuietHours} tone="brand" />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                    <div className="text-[12px] font-black text-slate-900 dark:text-slate-100">
                      Approval & recovery
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      Supports leadership approval gates and last-minute recovery sends if attendance is low.
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        Approval required
                      </div>
                      <Toggle value={approvalRequired} onChange={setApprovalRequired} tone="accent" />
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        Last-minute recovery
                      </div>
                      <Toggle value={lastMinuteRecovery} onChange={setLastMinuteRecovery} tone="brand" />
                    </div>
                  </div>
                </div>
              </div>
            </CardShell>
          </div>

          {/* Right rail */}
          <div className="xl:col-span-3 space-y-4">
            <CardShell
              title="Notification preview"
              subtitle="Embedded audience preview updates as copy, channels, and lifecycle stage settings change."
              right={
                <Pill tone="brand">
                  <Eye className="h-3.5 w-3.5" />
                  Live preview
                </Pill>
              }
            >
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {([
                    { key: "push", label: "Push" },
                    { key: "email", label: "Email" },
                    { key: "sms", label: "SMS" },
                    { key: "whatsapp", label: "Messaging" },
                  ] as const).map((tab) => {
                    const active = previewTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setPreviewTab(tab.key)}
                        className={cn(
                          "rounded-full px-3 py-2 text-[11px] font-black transition",
                          active
                            ? "text-white shadow-sm"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
                        )}
                        style={active ? { backgroundColor: tab.key === "email" ? ORANGE : GREEN } : undefined}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {previewTab === "push" ? (
                  <PhoneMock
                    title="FaithHub Push"
                    subtitle={`${activeNode.label} • ${localeLabels[selectedLocale].label}`}
                    body={
                      <div className="space-y-2">
                        <div className="text-sm font-black text-slate-900 dark:text-slate-100">
                          {previewHeadline}
                        </div>
                        <div className="text-[12px] leading-relaxed text-slate-700 dark:text-slate-300">
                          {previewBody}
                        </div>
                        <div className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black text-white" style={{ backgroundColor: GREEN }}>
                          {activeVariant.cta || "Open in FaithHub"}
                        </div>
                      </div>
                    }
                    footer={
                      <div className="flex flex-wrap gap-2">
                        <Pill tone="brand">{activeNode.offset}</Pill>
                        <Pill tone="accent">{sourceType}</Pill>
                      </div>
                    }
                  />
                ) : null}

                {previewTab === "email" ? (
                  <EmailPreview
                    subject={previewHeadline}
                    preheader={`${activeNode.label} • ${sourceType} • ${languageTarget}`}
                    body={previewBody}
                    cta={activeVariant.cta || "Open in FaithHub"}
                  />
                ) : null}

                {previewTab === "sms" ? (
                  <SmsPreview
                    sender="FaithHub SMS"
                    message={`${previewHeadline}\n${previewBody}`}
                  />
                ) : null}

                {previewTab === "whatsapp" ? (
                  <SmsPreview
                    sender="FaithHub Messaging"
                    message={`${previewHeadline}\n${previewBody}`}
                    accent
                  />
                ) : null}

                <div className="flex justify-between gap-3">
                  <Btn tone="ghost" onClick={() => setPreviewOpen(true)} left={<ExternalLink className="h-4 w-4" />}>
                    Expand preview
                  </Btn>
                  <Btn
                    tone="secondary"
                    onClick={async () => {
                      const ok = await copyText(activeVariant.deepLink || "");
                      setToast(ok ? "Deep link copied" : "Copy unavailable");
                    }}
                    left={<Copy className="h-4 w-4" />}
                  >
                    Copy link
                  </Btn>
                </div>
              </div>
            </CardShell>

            <CardShell
              title="Delivery intelligence"
              subtitle="See opens, taps, conversions, failures, unsubscribe movement, and fatigue warnings in one premium panel."
              right={
                <Pill tone="accent">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Outcome-aware
                </Pill>
              }
            >
              <div className="grid grid-cols-1 gap-3">
                {stageMetrics.map((metric) => (
                  <MetricTile
                    key={metric.label}
                    label={metric.label}
                    value={metric.value}
                    hint={metric.hint}
                    tone={metric.tone}
                  />
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div>
                    <div className="text-[12px] font-black text-amber-900 dark:text-amber-300">
                      Fatigue warning
                    </div>
                    <div className="mt-1 text-[11px] font-semibold text-amber-800 dark:text-amber-400 leading-relaxed">
                      Email frequency is approaching the comfort limit for 11% of this audience. Smart suppression will down-rank or skip low-intent contacts automatically.
                    </div>
                  </div>
                </div>
              </div>
            </CardShell>

            <CardShell
              title="Compliance & approvals"
              subtitle="Validate consent, quiet hours, sender identity, approval flow, and audience restrictions before launch."
              right={<Pill tone={systemReady ? "good" : "warn"}>{systemReady ? "Approved" : "Attention"}</Pill>}
            >
              <div className="space-y-3">
                {[
                  { label: "Consent coverage", value: "98.2%", tone: "good" as const, hint: "All selected contacts hold valid consent for the chosen channel mix." },
                  { label: "Quiet-hour safety", value: quietHours ? "On" : "Off", tone: quietHours ? "good" as const : "warn" as const, hint: "Regional quiet-hour logic and child-safe windows are applied." },
                  { label: "Sender identity", value: "Verified", tone: "good" as const, hint: "Push app identity, email sender, and SMS line are all trusted." },
                  { label: "Approval chain", value: approvalRequired ? "Required" : "Bypassed", tone: approvalRequired ? "accent" as const : "warn" as const, hint: "Pastoral and outreach sign-off can be enforced before activation." },
                ].map((row) => (
                  <div key={row.label} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[12px] font-black text-slate-900 dark:text-slate-100">
                        {row.label}
                      </div>
                      <Pill tone={row.tone}>{row.value}</Pill>
                    </div>
                    <div className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {row.hint}
                    </div>
                  </div>
                ))}
              </div>
            </CardShell>

            <CardShell
              title="Attribution view"
              subtitle="Connect notification activity back to watch starts, replays, donations, crowdfunding, event registration, and Beacon conversion."
              right={
                <Pill tone="brand">
                  <ArrowRight className="h-3.5 w-3.5" />
                  Ministry outcomes
                </Pill>
              }
            >
              <div className="space-y-3">
                {attributionCards.map((card) => (
                  <div key={card.label} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[12px] font-black text-slate-900 dark:text-slate-100">
                          {card.label}
                        </div>
                        <div className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          {card.hint}
                        </div>
                      </div>
                      <div
                        className={cn(
                          "text-xl font-black",
                          card.tone === "brand"
                            ? ""
                            : card.tone === "accent"
                              ? ""
                              : card.tone === "good"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-slate-900 dark:text-slate-50",
                        )}
                        style={
                          card.tone === "brand"
                            ? { color: GREEN }
                            : card.tone === "accent"
                              ? { color: ORANGE }
                              : undefined
                        }
                      >
                        {card.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardShell>
          </div>
        </div>
      </div>

      {/* Preview drawer */}
      <Drawer
        open={previewOpen}
        title="Audience notification preview lab"
        onClose={() => setPreviewOpen(false)}
        widthClass="max-w-6xl"
        right={
          <div className="flex gap-2">
            <Pill tone={systemReady ? "good" : "warn"}>
              {systemReady ? <BadgeCheck className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
              {systemReady ? "Journey ready" : "Needs checks"}
            </Pill>
          </div>
        }
      >
        <div className="flex flex-col h-full gap-6">
          <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-6 ring-1 ring-slate-200 dark:ring-slate-700">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
              <div className="min-w-0">
                <div className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                  Simulation controller
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-50">
                  Choose a channel and lifecycle node to preview the campaign exactly the way teams will review it before activation.
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <div className="flex items-center gap-1.5 rounded-2xl bg-white dark:bg-slate-900 p-1.5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
                  {([
                    { k: "push", label: "Push" },
                    { k: "email", label: "Email" },
                    { k: "sms", label: "SMS" },
                    { k: "whatsapp", label: "Messaging" },
                  ] as const).map((tab) => {
                    const active = previewTab === tab.k;
                    return (
                      <button
                        key={tab.k}
                        type="button"
                        onClick={() => setPreviewTab(tab.k)}
                        className={cn(
                          "rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-tight transition-all",
                          active
                            ? "text-white shadow-lg"
                            : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800",
                        )}
                        style={active ? { backgroundColor: tab.k === "email" ? ORANGE : GREEN } : undefined}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div className="w-full sm:w-56">
                  <Select
                    value={selectedNode}
                    onChange={(v) => setSelectedNode(v as JourneyNodeKey)}
                    options={journeyBlueprint.map((node) => ({
                      value: node.key,
                      label: node.label,
                      hint: node.offset,
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_360px]">
            <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-6 ring-1 ring-slate-200 dark:ring-slate-700">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">
                Channel preview
              </div>
              <div className="mt-4">
                {previewTab === "push" ? (
                  <PhoneMock
                    title="FaithHub Push"
                    subtitle={`${activeNode.label} • ${sourceType}`}
                    body={
                      <div className="space-y-2">
                        <div className="text-sm font-black">{previewHeadline}</div>
                        <div className="text-[12px] leading-relaxed">{previewBody}</div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black text-white" style={{ backgroundColor: GREEN }}>
                            {activeVariant.cta || "Open in FaithHub"}
                          </span>
                          <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black text-white" style={{ backgroundColor: ORANGE }}>
                            {activeNode.offset}
                          </span>
                        </div>
                      </div>
                    }
                  />
                ) : null}

                {previewTab === "email" ? (
                  <EmailPreview
                    subject={previewHeadline}
                    preheader={`${activeNode.label} • ${languageTarget} • ${regionTarget}`}
                    body={previewBody}
                    cta={activeVariant.cta || "Open in FaithHub"}
                  />
                ) : null}

                {previewTab === "sms" ? (
                  <SmsPreview sender="FaithHub SMS" message={`${previewHeadline}\n${previewBody}`} />
                ) : null}

                {previewTab === "whatsapp" ? (
                  <SmsPreview sender="FaithHub Messaging" message={`${previewHeadline}\n${previewBody}`} accent />
                ) : null}
              </div>
            </div>

            <div className="space-y-4">
              <CardShell
                title="Preview notes"
                subtitle="What reviewers and operators should check before activation."
                right={<Pill tone="brand">Review</Pill>}
              >
                <div className="space-y-3 text-[12px] font-semibold text-slate-600 dark:text-slate-400">
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="font-black text-slate-900 dark:text-slate-100">Copy quality</div>
                    <div className="mt-1">Confirm the headline is stage-appropriate, concise, and localized for the selected audience.</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="font-black text-slate-900 dark:text-slate-100">Deep-link quality</div>
                    <div className="mt-1">Ensure the CTA opens the correct live, replay, event, giving, or Beacon destination without dead ends.</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="font-black text-slate-900 dark:text-slate-100">Consent + fatigue</div>
                    <div className="mt-1">The preview lab confirms quiet hours, sender trust, and suppression logic before launch.</div>
                  </div>
                </div>
              </CardShell>

              <CardShell
                title="Fast actions"
                subtitle="Jump into linked pages and adjacent workflows."
                right={<Pill tone="accent">Linked pages</Pill>}
              >
                <div className="space-y-2">
                  {[
                    { label: "Channels & Contact Manager", hint: "Consent, segments, and audience health" },
                    { label: "Live Builder", hint: "Session-linked notification source" },
                    { label: "Replays & Clips", hint: "Replay-ready and clip follow-up journeys" },
                    { label: "Beacon Builder", hint: "Promotion handoff and post-live amplification" },
                  ].map((entry) => (
                    <button
                      type="button"
                      key={entry.label}
                      onClick={() => setToast(`${entry.label} opened`)}
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-[12px] font-black text-slate-900 dark:text-slate-100">
                            {entry.label}
                          </div>
                          <div className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            {entry.hint}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </CardShell>
            </div>
          </div>
        </div>
      </Drawer>

      {toast ? (
        <div className="fixed bottom-5 left-1/2 z-[140] -translate-x-1/2 rounded-full bg-slate-900 dark:bg-slate-100 px-4 py-2 text-[12px] font-black text-white dark:text-slate-900 shadow-xl">
          {toast}
        </div>
      ) : null}
    </div>
  );
}












