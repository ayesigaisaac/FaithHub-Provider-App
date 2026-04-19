// @ts-nocheck
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  Bell,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Copy,
  Download,
  Eye,
  ExternalLink,
  Filter,
  Globe2,
  Info,
  Layers,
  Link2,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";
import { KpiTile } from "../../../components/ui/KpiTile";

/**
 * FaithHub — Channels & Contact Manager
 * Premium audience data, consent, channel-operations, and contact-intelligence hub.
 * Primary colour: EVzone Green (#03cd8c)
 * Secondary colour: EVzone Orange (#f77f00)
 */

const GREEN = "#03cd8c";
const ORANGE = "#f77f00";
const GREY = "#a6a6a6";
const LIGHT = "#f2f2f2";

type CampusKey = "Global" | "Downtown" | "East Campus" | "Youth Chapel" | "Young Adults";
type BrandKey = "Main Ministry" | "Young Adults" | "Outreach Nights";
type ContactKind =
  | "Follower"
  | "Member"
  | "Attendee"
  | "Donor"
  | "Volunteer"
  | "Lead";
type ConsentState = "Full" | "Limited" | "Review";
type ChannelKey = "Push" | "Email" | "SMS" | "WhatsApp" | "Telegram" | "In-app";
type SegmentMode = "Smart" | "Manual";
type PreviewTab = "contact" | "segment" | "channel";

type TimelineEvent = {
  id: string;
  label: string;
  when: string;
  type: "Live" | "Replay" | "Message" | "Donation" | "Event" | "Beacon";
  detail: string;
};

type Contact = {
  id: string;
  name: string;
  title: ContactKind;
  campus: CampusKey;
  brand: BrandKey;
  region: string;
  language: string;
  primaryChannel: ChannelKey;
  channelsAllowed: ChannelKey[];
  consentState: ConsentState;
  quietHours: string;
  childSafe: boolean;
  highRisk: boolean;
  email: string;
  phone: string;
  segmentIds: string[];
  lastActivity: string;
  liveCount: number;
  replayCount: number;
  donations: string;
  eventCount: number;
  beaconTouches: number;
  engagementScore: number;
  pastoralNote: string;
  timeline: TimelineEvent[];
  consentAudit: Array<{ at: string; label: string; detail: string }>;
};

type Segment = {
  id: string;
  label: string;
  mode: SegmentMode;
  campus: CampusKey | "Multi-campus";
  ruleSummary: string;
  size: number;
  health: "High" | "Watch" | "Needs work";
  growth: string;
  linkedJourneys: number;
  linkedBeaconCampaigns: number;
  childSafeReady: boolean;
};

type ChannelConnection = {
  id: string;
  name: ChannelKey;
  campus: CampusKey | "Multi-campus";
  status: "Healthy" | "Watch" | "Needs action";
  sender: string;
  deliverability: string;
  verification: string;
  templateReadiness: string;
  activeContacts: string;
  note: string;
};

type HygieneTask = {
  id: string;
  label: string;
  count: string;
  hint: string;
  tone: "good" | "warn" | "bad" | "brand";
};

type MetricCard = {
  label: string;
  value: string;
  hint: string;
  tone: "brand" | "accent" | "good" | "warn" | "neutral";
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
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
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
            ? "bg-slate-900 dark:bg-slate-100"
            : "bg-slate-300 dark:bg-slate-700",
      )}
      aria-pressed={value}
      aria-label={value ? "Enabled" : "Disabled"}
      title={disabled ? "Locked" : undefined}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full bg-white dark:bg-slate-900 shadow-md transition",
          value ? "translate-x-5" : "translate-x-1",
        )}
      />
    </button>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string; hint?: string }>;
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
          <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform", open && "rotate-180")} />
        </div>
      </button>

      {open ? (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-xl ring-1 ring-slate-200 dark:ring-slate-800 animate-in fade-in zoom-in-95 duration-100">
          <div className="max-h-[300px] overflow-y-auto">
            {options.map((o) => (
              <button
                key={o.value}
                className={cn(
                  "w-full px-4 py-3 text-left transition",
                  o.value === value ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                )}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                type="button"
              >
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
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Drawer({
  open,
  title,
  onClose,
  children,
  widthClass = "max-w-5xl",
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  widthClass?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const originalBodyOverflow = document.body.style.overflow;
    const originalDocOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalDocOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110]">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className={cn("absolute right-0 top-0 h-full w-full bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ease-out sm:ring-1 sm:ring-slate-200 dark:sm:ring-slate-800", widthClass)}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4">
            <div className="min-w-0">
              <div className="truncate text-lg font-bold text-slate-900 dark:text-slate-50">{title}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Contact intelligence, segment health, and channel readiness previews.
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

function MiniLine({
  values,
  tone = "brand",
}: {
  values: number[];
  tone?: "brand" | "accent" | "neutral";
}) {
  const w = 150;
  const h = 42;
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
    .join(" ");

  const stroke = tone === "accent" ? ORANGE : tone === "neutral" ? GREY : GREEN;

  return (
    <svg width={w} height={h} className="overflow-visible transition-colors">
      <polyline
        points={pts}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-slate-900 dark:text-slate-100"
        style={{ color: stroke }}
      />
      <circle
        cx={pad + ((values.length - 1) * (w - pad * 2)) / Math.max(1, values.length - 1)}
        cy={norm(values[values.length - 1])}
        r={3.5}
        fill="currentColor"
        className="text-slate-900 dark:text-slate-100"
        style={{ color: stroke }}
      />
    </svg>
  );
}

function MetricTile({ card }: { card: MetricCard }) {
  const normalizedTone =
    card.tone === "brand"
      ? "green"
      : card.tone === "accent"
        ? "orange"
        : card.tone === "good"
          ? "green"
          : card.tone === "warn"
            ? "orange"
            : "gray";

  return (
    <KpiTile
      label={card.label}
      value={card.value}
      hint={card.hint}
      tone={normalizedTone}
      size="compact"
    />
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
            <div className="mt-1 text-sm font-black text-slate-900 dark:text-slate-50">{title}</div>
          </div>
          <div className="flex-1 p-6">
            <div className="space-y-3">{body}</div>
            {footer ? <div className="pt-4">{footer}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

const contacts: Contact[] = [
  {
    id: "ct_amal",
    name: "Amal Nsubuga",
    title: "Member",
    campus: "Downtown",
    brand: "Main Ministry",
    region: "Kampala, Uganda",
    language: "English • Luganda",
    primaryChannel: "WhatsApp",
    channelsAllowed: ["WhatsApp", "Push", "Email", "In-app"],
    consentState: "Full",
    quietHours: "21:00–07:00",
    childSafe: false,
    highRisk: false,
    email: "amal@faithhub.demo",
    phone: "+256 700 123 448",
    segmentIds: ["seg_live_core", "seg_donors_warm", "seg_women_weekly"],
    lastActivity: "Watched replay 32 min ago",
    liveCount: 14,
    replayCount: 9,
    donations: "$640",
    eventCount: 4,
    beaconTouches: 7,
    engagementScore: 94,
    pastoralNote: "Consistent attendee. Responds well to replay reminders and giving updates.",
    timeline: [
      { id: "1", label: "Sunday Live Session attended", when: "Today · 10:08", type: "Live", detail: "Joined via WhatsApp deep link and stayed 48 minutes." },
      { id: "2", label: "Replay follow-up opened", when: "Yesterday · 16:22", type: "Replay", detail: "Watched the prayer segment and shared the replay card." },
      { id: "3", label: "Charity campaign donation", when: "2 days ago", type: "Donation", detail: "Contributed to the school-feeding crowdfund after a reminder journey." },
      { id: "4", label: "Beacon awareness touch", when: "4 days ago", type: "Beacon", detail: "Saw 3 community-service ads and tapped the giving campaign." },
    ],
    consentAudit: [
      { at: "14 Feb 2026", label: "WhatsApp opt-in", detail: "Joined after scanning the Sunday live QR card." },
      { at: "14 Feb 2026", label: "Push permission granted", detail: "Enabled from FaithHub mobile settings." },
      { at: "20 Feb 2026", label: "Email confirmed", detail: "Clicked secure verify link from follow-up journey." },
    ],
  },
  {
    id: "ct_ezra",
    name: "Ezra Mwesigwa",
    title: "Volunteer",
    campus: "East Campus",
    brand: "Main Ministry",
    region: "Mukono, Uganda",
    language: "English • Swahili",
    primaryChannel: "Email",
    channelsAllowed: ["Email", "SMS", "In-app"],
    consentState: "Limited",
    quietHours: "22:00–06:30",
    childSafe: false,
    highRisk: false,
    email: "ezra@faithhub.demo",
    phone: "+256 703 998 101",
    segmentIds: ["seg_volunteers_ops", "seg_event_core"],
    lastActivity: "Opened event reminder 1 hr ago",
    liveCount: 7,
    replayCount: 3,
    donations: "$0",
    eventCount: 11,
    beaconTouches: 2,
    engagementScore: 81,
    pastoralNote: "Reliable on events. Prefers email planning updates and avoids late-night SMS.",
    timeline: [
      { id: "5", label: "Volunteer briefing opened", when: "Today · 08:14", type: "Message", detail: "Opened production call-sheet from Audience Notifications." },
      { id: "6", label: "Baptism event checked in", when: "Last Sunday", type: "Event", detail: "Registered early and completed volunteer duty." },
      { id: "7", label: "Beacon click-through", when: "6 days ago", type: "Beacon", detail: "Tapped youth retreat promo but did not complete RSVP." },
    ],
    consentAudit: [
      { at: "03 Jan 2026", label: "Email opt-in", detail: "Imported from volunteer roster with confirmation." },
      { at: "03 Jan 2026", label: "SMS restricted", detail: "Quiet hours tightened by personal preference." },
      { at: "22 Jan 2026", label: "In-app enabled", detail: "Accepted from mobile companion onboarding." },
    ],
  },
  {
    id: "ct_lina",
    name: "Lina Children Desk",
    title: "Lead",
    campus: "Youth Chapel",
    brand: "Young Adults",
    region: "Nairobi, Kenya",
    language: "English",
    primaryChannel: "Push",
    channelsAllowed: ["Push", "In-app"],
    consentState: "Review",
    quietHours: "Always child-safe",
    childSafe: true,
    highRisk: false,
    email: "lina.parent@faithhub.demo",
    phone: "+254 700 000 410",
    segmentIds: ["seg_children_guarded", "seg_family_updates"],
    lastActivity: "Awaiting parental reconfirmation",
    liveCount: 2,
    replayCount: 1,
    donations: "$0",
    eventCount: 2,
    beaconTouches: 1,
    engagementScore: 63,
    pastoralNote: "Protected lane contact. Route all outbound messaging through parent-approved surfaces only.",
    timeline: [
      { id: "8", label: "Children choir replay viewed", when: "Yesterday", type: "Replay", detail: "Watched from parent-approved in-app surface." },
      { id: "9", label: "Safeguarding check triggered", when: "3 days ago", type: "Message", detail: "Consent refresh required before the next reminder send." },
    ],
    consentAudit: [
      { at: "02 Mar 2026", label: "Parent push opt-in", detail: "Parent accepted notifications for children’s ministry updates only." },
      { at: "02 Mar 2026", label: "Child-safe lane active", detail: "Quiet hours locked, messaging channels limited." },
      { at: "18 Mar 2026", label: "Consent review due", detail: "Parental reconfirmation required within 7 days." },
    ],
  },
  {
    id: "ct_samira",
    name: "Samira Okot",
    title: "Donor",
    campus: "Global",
    brand: "Outreach Nights",
    region: "London, UK",
    language: "English • French",
    primaryChannel: "Email",
    channelsAllowed: ["Email", "Push", "WhatsApp", "In-app"],
    consentState: "Full",
    quietHours: "23:00–07:00",
    childSafe: false,
    highRisk: false,
    email: "samira@faithhub.demo",
    phone: "+44 7444 111 900",
    segmentIds: ["seg_global_donors", "seg_replay_loyalists"],
    lastActivity: "Gave to outreach fund 3 hrs ago",
    liveCount: 5,
    replayCount: 17,
    donations: "$1,240",
    eventCount: 1,
    beaconTouches: 9,
    engagementScore: 92,
    pastoralNote: "Global donor with strong replay affinity. Excellent candidate for Beacon replay boosts.",
    timeline: [
      { id: "10", label: "Crowdfund donation completed", when: "Today · 06:42", type: "Donation", detail: "Responded to ‘impact update’ journey and completed donation." },
      { id: "11", label: "Replay binge", when: "Yesterday", type: "Replay", detail: "Watched 3 clips and 1 full replay from the prayer summit." },
      { id: "12", label: "Beacon donation ad conversion", when: "1 week ago", type: "Beacon", detail: "Clicked a replay boost and completed a giving action." },
    ],
    consentAudit: [
      { at: "12 Dec 2025", label: "Email + push approved", detail: "Completed bilingual opt-in flow." },
      { at: "12 Dec 2025", label: "WhatsApp added", detail: "Joined supporter WhatsApp lane from donor follow-up." },
      { at: "08 Mar 2026", label: "French locale added", detail: "Selected bilingual communication preference." },
    ],
  },
  {
    id: "ct_david",
    name: "David Kaggwa",
    title: "Attendee",
    campus: "Downtown",
    brand: "Main Ministry",
    region: "Kampala, Uganda",
    language: "English",
    primaryChannel: "SMS",
    channelsAllowed: ["SMS", "In-app"],
    consentState: "Limited",
    quietHours: "21:00–06:00",
    childSafe: false,
    highRisk: true,
    email: "david.kaggwa@faithhub.demo",
    phone: "+256 780 222 009",
    segmentIds: ["seg_event_core"],
    lastActivity: "Endpoint invalid after last send",
    liveCount: 1,
    replayCount: 0,
    donations: "$0",
    eventCount: 1,
    beaconTouches: 0,
    engagementScore: 28,
    pastoralNote: "Needs hygiene review. SMS bounced and profile is marked for verification before the next reminder.",
    timeline: [
      { id: "13", label: "SMS bounce", when: "Today · 07:52", type: "Message", detail: "Carrier returned invalid endpoint. Do not contact until fixed." },
      { id: "14", label: "Event RSVP started", when: "3 days ago", type: "Event", detail: "Did not complete RSVP after first step." },
    ],
    consentAudit: [
      { at: "11 Mar 2026", label: "SMS opt-in", detail: "Captured from in-person event sign-up sheet." },
      { at: "09 Apr 2026", label: "Hygiene hold", detail: "Contact suspended after invalid endpoint detection." },
    ],
  },
];

const segments: Segment[] = [
  {
    id: "seg_live_core",
    label: "Weekly Live Core",
    mode: "Smart",
    campus: "Multi-campus",
    ruleSummary: "Live attendance = 2 in 30 days • watched replay = 1 • follows main ministry",
    size: 12480,
    health: "High",
    growth: "+8.4% in 30 days",
    linkedJourneys: 5,
    linkedBeaconCampaigns: 2,
    childSafeReady: false,
  },
  {
    id: "seg_donors_warm",
    label: "Warm Donors",
    mode: "Smart",
    campus: "Global",
    ruleSummary: "Donated in last 90 days • opened 2+ giving reminders • replay viewers",
    size: 3920,
    health: "High",
    growth: "+4.1% in 30 days",
    linkedJourneys: 4,
    linkedBeaconCampaigns: 3,
    childSafeReady: false,
  },
  {
    id: "seg_children_guarded",
    label: "Children Guarded Lane",
    mode: "Manual",
    campus: "Youth Chapel",
    ruleSummary: "Parent-approved contacts only • child-safe restrictions enforced • in-app/push only",
    size: 410,
    health: "Watch",
    growth: "+1.7% in 30 days",
    linkedJourneys: 2,
    linkedBeaconCampaigns: 0,
    childSafeReady: true,
  },
  {
    id: "seg_event_core",
    label: "Event Ready Attendees",
    mode: "Smart",
    campus: "Downtown",
    ruleSummary: "Opened event reminder in 14 days • RSVP intent present • donor score not required",
    size: 1840,
    health: "Needs work",
    growth: "-2.3% in 30 days",
    linkedJourneys: 3,
    linkedBeaconCampaigns: 1,
    childSafeReady: false,
  },
  {
    id: "seg_family_updates",
    label: "Family Updates",
    mode: "Manual",
    campus: "Youth Chapel",
    ruleSummary: "Family ministry parents • parent-approved channels • quiet-hour compliance strict",
    size: 650,
    health: "High",
    growth: "+3.2% in 30 days",
    linkedJourneys: 2,
    linkedBeaconCampaigns: 0,
    childSafeReady: true,
  },
  {
    id: "seg_women_weekly",
    label: "Women Weekly Path",
    mode: "Smart",
    campus: "Downtown",
    ruleSummary: "Women’s group tag • weekly watch history • accepted WhatsApp or push",
    size: 2740,
    health: "High",
    growth: "+5.0% in 30 days",
    linkedJourneys: 4,
    linkedBeaconCampaigns: 1,
    childSafeReady: false,
  },
  {
    id: "seg_volunteers_ops",
    label: "Volunteer Operations",
    mode: "Manual",
    campus: "East Campus",
    ruleSummary: "Production, ushering, welfare, captions, interpretation, and event support contacts",
    size: 330,
    health: "High",
    growth: "+0.9% in 30 days",
    linkedJourneys: 2,
    linkedBeaconCampaigns: 0,
    childSafeReady: false,
  },
  {
    id: "seg_global_donors",
    label: "Global Donors",
    mode: "Smart",
    campus: "Global",
    ruleSummary: "International donors • replay viewers • opened email in last 21 days",
    size: 1120,
    health: "High",
    growth: "+6.8% in 30 days",
    linkedJourneys: 3,
    linkedBeaconCampaigns: 3,
    childSafeReady: false,
  },
  {
    id: "seg_replay_loyalists",
    label: "Replay Loyalists",
    mode: "Smart",
    campus: "Global",
    ruleSummary: "Watched 3+ replays in 30 days • clip taps present • live attendance optional",
    size: 5080,
    health: "Watch",
    growth: "+1.3% in 30 days",
    linkedJourneys: 4,
    linkedBeaconCampaigns: 2,
    childSafeReady: false,
  },
];

const channelConnections: ChannelConnection[] = [
  {
    id: "ch_push",
    name: "Push",
    campus: "Multi-campus",
    status: "Healthy",
    sender: "FaithHub Mobile",
    deliverability: "98.4% delivered",
    verification: "App certificates healthy",
    templateReadiness: "Journey templates synced",
    activeContacts: "18.2k reachable",
    note: "Best for live-now, replay-ready, and crowd movement reminders.",
  },
  {
    id: "ch_email",
    name: "Email",
    campus: "Multi-campus",
    status: "Healthy",
    sender: "news@faithhub.demo",
    deliverability: "97.1% inbox placement",
    verification: "SPF / DKIM / DMARC passing",
    templateReadiness: "Bilingual layouts ready",
    activeContacts: "22.9k reachable",
    note: "Strongest long-form channel for giving updates, events, and replay follow-up.",
  },
  {
    id: "ch_sms",
    name: "SMS",
    campus: "Downtown",
    status: "Watch",
    sender: "FH-Downtown",
    deliverability: "92.0% delivered",
    verification: "1 sender awaiting review",
    templateReadiness: "Quiet-hour guard active",
    activeContacts: "6.1k reachable",
    note: "Fast, high-intent channel for live countdowns, but fatigue-sensitive.",
  },
  {
    id: "ch_whatsapp",
    name: "WhatsApp",
    campus: "Global",
    status: "Healthy",
    sender: "FaithHub Live",
    deliverability: "Template quality high",
    verification: "Business profile healthy",
    templateReadiness: "24h window + template packs ready",
    activeContacts: "11.3k reachable",
    note: "Excellent for repeat live attendance and community reminder journeys.",
  },
  {
    id: "ch_telegram",
    name: "Telegram",
    campus: "Young Adults",
    status: "Needs action",
    sender: "FaithHub Youth",
    deliverability: "Endpoint sync stale",
    verification: "Reconnect required",
    templateReadiness: "No issues after reconnect",
    activeContacts: "2.4k reachable",
    note: "Requires credential refresh before large sends.",
  },
  {
    id: "ch_inapp",
    name: "In-app",
    campus: "Multi-campus",
    status: "Healthy",
    sender: "FaithHub Inbox",
    deliverability: "No external carrier risk",
    verification: "Native surface healthy",
    templateReadiness: "Cards + deep links ready",
    activeContacts: "26.7k reachable",
    note: "Safest surface for child-safe lanes and lower-risk follow-up.",
  },
];

const hygieneTasks: HygieneTask[] = [
  {
    id: "hg_merge",
    label: "Merge suggestions",
    count: "24 pairs",
    hint: "Potential duplicates across volunteer and event imports.",
    tone: "warn",
  },
  {
    id: "hg_invalid",
    label: "Invalid endpoints",
    count: "17 records",
    hint: "SMS bounces and stale email aliases need cleanup before the next send.",
    tone: "bad",
  },
  {
    id: "hg_missing",
    label: "Missing data cleanup",
    count: "63 contacts",
    hint: "Language or campus fields missing for smart segment precision.",
    tone: "warn",
  },
  {
    id: "hg_imports",
    label: "Fresh imports ready",
    count: "3 sources",
    hint: "CSV, event check-in export, and donor sync ready for ingestion.",
    tone: "brand",
  },
];

const smartRuleSuggestions = [
  "Live attendance = 2 in 30 days",
  "Donated in last 90 days",
  "Beacon click-through present",
  "Replay watch time > 25 min",
  "Event RSVP intent started",
  "Language = English or Swahili",
  "Campus = Downtown or Global",
];

const audienceHealthSeries = [62, 68, 70, 73, 79, 84, 87, 89, 91, 92, 94];
const deliverabilitySeries = [93, 94, 95, 95, 96, 96, 97, 97, 98, 98, 98];
const segmentSeries = [48, 52, 54, 57, 61, 63, 68, 70, 74, 76, 79];

function statusTone(status: ChannelConnection["status"]) {
  if (status === "Healthy") return "good" as const;
  if (status === "Watch") return "warn" as const;
  return "bad" as const;
}

function consentTone(state: ConsentState) {
  if (state === "Full") return "good" as const;
  if (state === "Limited") return "warn" as const;
  return "bad" as const;
}

function segmentTone(state: Segment["health"]) {
  if (state === "High") return "good" as const;
  if (state === "Watch") return "warn" as const;
  return "bad" as const;
}

function roleTone(role: ContactKind) {
  if (role === "Donor" || role === "Member") return "brand" as const;
  if (role === "Volunteer") return "accent" as const;
  return "neutral" as const;
}

function ContactPreviewCard({
  contact,
  segmentLookup,
}: {
  contact: Contact;
  segmentLookup: Map<string, Segment>;
}) {
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-4 shadow-sm transition">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex items-center gap-3">
          <div
            className="h-12 w-12 shrink-0 rounded-2xl grid place-items-center text-white font-black"
            style={{ backgroundColor: GREEN }}
          >
            {contact.name
              .split(" ")
              .slice(0, 2)
              .map((part) => part[0])
              .join("")}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-black text-slate-900 dark:text-slate-50">{contact.name}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {contact.title} • {contact.campus} • {contact.language}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <Pill tone={consentTone(contact.consentState)}>{contact.consentState} consent</Pill>
              {contact.childSafe ? <Pill tone="warn"><ShieldCheck className="h-3 w-3" /> Child-safe</Pill> : null}
            </div>
          </div>
        </div>
        <Btn tone="ghost" left={<ExternalLink className="h-4 w-4" />}>Open 360</Btn>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800 transition">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Primary channel</div>
          <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-50">{contact.primaryChannel}</div>
        </div>
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800 transition">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Quiet hours</div>
          <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-50">{contact.quietHours}</div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 p-3 ring-1 ring-emerald-200 dark:ring-emerald-500/20 text-[12px] text-emerald-900 dark:text-emerald-300">
        <div className="font-black uppercase tracking-widest text-[10px] mb-1">Pastoral context</div>
        {contact.pastoralNote}
      </div>

      <div className="mt-4 space-y-2">
        <div className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Linked segments</div>
        <div className="flex flex-wrap gap-2">
          {contact.segmentIds.map((id) => (
            <Pill key={id} tone="neutral">{segmentLookup.get(id)?.label || id}</Pill>
          ))}
        </div>
      </div>
    </div>
  );
}

function SegmentPreviewBoard({
  selectedSegments,
}: {
  selectedSegments: Segment[];
}) {
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-4 shadow-sm transition">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-sm font-black text-slate-900 dark:text-slate-50">Segment spotlight</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Saved operational and campaign-ready segment views.</div>
        </div>
        <Pill tone="brand"><Layers className="h-3 w-3" /> {selectedSegments.length} shown</Pill>
      </div>
      <div className="mt-4 space-y-3">
        {selectedSegments.slice(0, 3).map((segment) => (
          <div key={segment.id} className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800 transition">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[13px] font-bold text-slate-900 dark:text-slate-50 truncate">{segment.label}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{segment.ruleSummary}</div>
              </div>
              <Pill tone={segmentTone(segment.health)}>{segment.health}</Pill>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
              <div className="rounded-xl bg-white dark:bg-slate-900 px-2 py-2 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="text-slate-500 dark:text-slate-500 uppercase tracking-widest text-[10px] font-black">Audience</div>
                <div className="mt-1 font-bold text-slate-900 dark:text-slate-50">{segment.size.toLocaleString()}</div>
              </div>
              <div className="rounded-xl bg-white dark:bg-slate-900 px-2 py-2 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="text-slate-500 dark:text-slate-500 uppercase tracking-widest text-[10px] font-black">Journeys</div>
                <div className="mt-1 font-bold text-slate-900 dark:text-slate-50">{segment.linkedJourneys}</div>
              </div>
              <div className="rounded-xl bg-white dark:bg-slate-900 px-2 py-2 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="text-slate-500 dark:text-slate-500 uppercase tracking-widest text-[10px] font-black">Beacon</div>
                <div className="mt-1 font-bold text-slate-900 dark:text-slate-50">{segment.linkedBeaconCampaigns}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChannelsContactManagerPage() {
  const [campusScope, setCampusScope] = useState<CampusKey | "All">("All");
  const [brandScope, setBrandScope] = useState<BrandKey | "All">("All");
  const [search, setSearch] = useState("");
  const [selectedContactId, setSelectedContactId] = useState(contacts[0].id);
  const [segmentMode, setSegmentMode] = useState<SegmentMode>("Smart");
  const [selectedPreviewTab, setSelectedPreviewTab] = useState<PreviewTab>("contact");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [channelQuietHours, setChannelQuietHours] = useState(true);
  const [childSafeLock, setChildSafeLock] = useState(true);
  const [autoMerge, setAutoMerge] = useState(false);
  const [audienceRiskGuard, setAudienceRiskGuard] = useState(true);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const contactLookup = useMemo(() => new Map(contacts.map((contact) => [contact.id, contact])), []);
  const segmentLookup = useMemo(() => new Map(segments.map((segment) => [segment.id, segment])), []);

  const visibleContacts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return contacts.filter((contact) => {
      const scopeOk = campusScope === "All" ? true : contact.campus === campusScope;
      const brandOk = brandScope === "All" ? true : contact.brand === brandScope;
      const searchOk = q
        ? [
            contact.name,
            contact.title,
            contact.region,
            contact.language,
            contact.primaryChannel,
            contact.segmentIds.map((id) => segmentLookup.get(id)?.label || id).join(" "),
          ]
            .join(" ")
            .toLowerCase()
            .includes(q)
        : true;
      return scopeOk && brandOk && searchOk;
    });
  }, [brandScope, campusScope, search, segmentLookup]);

  const selectedContact = visibleContacts.find((contact) => contact.id === selectedContactId) || visibleContacts[0] || contacts[0];

  useEffect(() => {
    if (!visibleContacts.some((contact) => contact.id === selectedContactId) && visibleContacts[0]) {
      setSelectedContactId(visibleContacts[0].id);
    }
  }, [selectedContactId, visibleContacts]);

  const filteredSegments = useMemo(() => {
    return segments.filter((segment) => {
      const modeOk = segment.mode === segmentMode;
      const campusOk = campusScope === "All" ? true : segment.campus === campusScope || segment.campus === "Multi-campus";
      const brandOk = brandScope === "All" ? true : true;
      return modeOk && campusOk && brandOk;
    });
  }, [brandScope, campusScope, segmentMode]);

  const selectedContactSegments = useMemo(
    () => selectedContact.segmentIds.map((id) => segmentLookup.get(id)).filter(Boolean) as Segment[],
    [selectedContact, segmentLookup],
  );

  const stageMetrics: MetricCard[] = [
    {
      label: "Audience health",
      value: "94%",
      hint: "Strong consent, stable growth, and low suppressions across active ministry lanes.",
      tone: "brand",
    },
    {
      label: "Reachable contacts",
      value: "26.7k",
      hint: "Clean, consent-ready audience endpoints across push, email, SMS, WhatsApp, and in-app.",
      tone: "neutral",
    },
    {
      label: "Consent coverage",
      value: "91.2%",
      hint: "Full or limited consent recorded, with audit trails and quiet-hour rules intact.",
      tone: "good",
    },
    {
      label: "Suppression risk",
      value: "17 holds",
      hint: "Invalid endpoints, child-safe reviews, and do-not-contact protections are being enforced.",
      tone: "warn",
    },
    {
      label: "Segment momentum",
      value: "+7.9%",
      hint: "Audience groups are growing through live attendance, replay engagement, and donor journeys.",
      tone: "accent",
    },
    {
      label: "Deliverability",
      value: "97.8%",
      hint: "Sender health remains premium across connected channels and multi-campus brands.",
      tone: "good",
    },
  ];

  const systemIssues = useMemo(() => {
    const issues: string[] = [];
    const riskyContacts = contacts.filter((contact) => contact.highRisk).length;
    if (riskyContacts > 0) {
      issues.push(`${riskyContacts} contacts are on hygiene hold or marked high-risk.`);
    }
    const reconnects = channelConnections.filter((channel) => channel.status === "Needs action").length;
    if (reconnects > 0) {
      issues.push(`${reconnects} channel connection requires re-authentication.`);
    }
    const childReviews = contacts.filter((contact) => contact.childSafe && contact.consentState === "Review").length;
    if (childReviews > 0) {
      issues.push(`${childReviews} child-safe contacts require consent reconfirmation.`);
    }
    return issues;
  }, []);

  const contactCounts = useMemo(() => {
    const totals = {
      followers: 0,
      members: 0,
      donors: 0,
      volunteers: 0,
    };
    contacts.forEach((contact) => {
      if (contact.title === "Follower" || contact.title === "Attendee" || contact.title === "Lead") totals.followers += 1;
      if (contact.title === "Member") totals.members += 1;
      if (contact.title === "Donor") totals.donors += 1;
      if (contact.title === "Volunteer") totals.volunteers += 1;
    });
    return totals;
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f2f2f2] dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors overflow-x-hidden">
      <div className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition">
        <div className="w-full flex flex-col gap-4 px-4 md:px-6 lg:px-8 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2 whitespace-nowrap text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                <span className="hover:text-slate-700 dark:hover:text-slate-200 transition cursor-default">FaithHub Provider</span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="hover:text-slate-700 dark:hover:text-slate-200 transition cursor-default">Audience & Outreach</span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="text-slate-900 dark:text-slate-100 italic">Channels & Contact Manager</span>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
                Channels & Contact Manager
              </div>
              <div className="flex gap-2 flex-wrap">
                <Pill tone="brand"><Activity className="h-3.5 w-3.5" /> Audience healthy</Pill>
                <Pill tone="good"><ShieldCheck className="h-3.5 w-3.5" /> Consent-first</Pill>
                <Pill tone="accent"><Layers className="h-3.5 w-3.5" /> Multi-campus</Pill>
              </div>
            </div>

            <div className="mt-2 text-xs font-bold text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                {visibleContacts.length.toLocaleString()} visible contacts
              </span>
              <span className="text-slate-200 dark:text-slate-800">|</span>
              <span className="flex items-center gap-1.5">
                <MessageCircle className="h-3.5 w-3.5 text-slate-400" />
                6 connected channels
              </span>
              <span className="text-slate-200 dark:text-slate-800">|</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                Child-safe protections embedded
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden lg:grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800/50 p-2 ring-1 ring-slate-200/50 dark:ring-slate-800/50 min-w-[320px]">
              <Select
                value={campusScope}
                onChange={(v) => setCampusScope(v as CampusKey | "All")}
                options={[
                  { value: "All", label: "All campuses", hint: "Provider-wide view" },
                  { value: "Global", label: "Global", hint: "Cross-region audience" },
                  { value: "Downtown", label: "Downtown", hint: "Main service lane" },
                  { value: "East Campus", label: "East Campus", hint: "Mid-week community" },
                  { value: "Youth Chapel", label: "Youth Chapel", hint: "Protected youth lane" },
                ]}
              />
              <Select
                value={brandScope}
                onChange={(v) => setBrandScope(v as BrandKey | "All")}
                options={[
                  { value: "All", label: "All brands", hint: "Organization-wide" },
                  { value: "Main Ministry", label: "Main Ministry", hint: "Default public brand" },
                  { value: "Young Adults", label: "Young Adults", hint: "Youth / YA lane" },
                  { value: "Outreach Nights", label: "Outreach Nights", hint: "Events and promos" },
                ]}
              />
            </div>

            <div className="flex h-10 items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 p-1 ring-1 ring-slate-200/50 dark:ring-slate-800/50">
              <Btn tone="ghost" onClick={() => setPreviewOpen(true)} left={<Eye className="h-4 w-4" />}>
                Preview
              </Btn>
              <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
              <Btn tone="primary" left={<Download className="h-4 w-4" />} onClick={() => setToast("Import workflow opened")}>Import contacts</Btn>
              <Btn tone="secondary" left={<Plus className="h-4 w-4" />} onClick={() => setToast("Segment builder focused")}>Create segment</Btn>
              <Btn tone="neutral" left={<Zap className="h-4 w-4" />} onClick={() => setToast("Channel connection flow opened")}>Connect channel</Btn>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition">
          <div className="w-full px-4 md:px-6 lg:px-8 py-2.5">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="flex flex-wrap items-center gap-3">
                <Pill tone={systemIssues.length ? "warn" : "good"}>
                  {systemIssues.length ? <AlertTriangle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  Audience system check
                </Pill>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">
                  {systemIssues.length
                    ? systemIssues.join(" • ")
                    : "Consent trails, deliverability, and contact hygiene are all operating within premium thresholds."}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Sparkles className="h-3 w-3" style={{ color: ORANGE }} />
                CRM-grade ministry intelligence
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {stageMetrics.map((card) => (
                <MetricTile key={card.label} card={card} />
              ))}
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tight">Audience health dashboard</div>
                  <div className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                    Growth, deliverability, consent quality, and segment momentum for ministry communications.
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Pill tone="good"><BadgeCheck className="h-3.5 w-3.5" /> Consent audit trails active</Pill>
                  <Pill tone="accent"><Globe2 className="h-3.5 w-3.5" /> Multi-brand routing</Pill>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Audience growth</div>
                      <div className="mt-1 text-xl font-extrabold text-slate-900 dark:text-slate-50">+12.4%</div>
                    </div>
                    <MiniLine values={audienceHealthSeries} tone="brand" />
                  </div>
                  <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">Follower, member, and donor layers are all moving upward after the last replay cycle.</div>
                </div>
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Deliverability trend</div>
                      <div className="mt-1 text-xl font-extrabold text-slate-900 dark:text-slate-50">97.8%</div>
                    </div>
                    <MiniLine values={deliverabilitySeries} tone="accent" />
                  </div>
                  <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">Sender health remains high across push, email, in-app, and WhatsApp lanes.</div>
                </div>
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Segment performance</div>
                      <div className="mt-1 text-xl font-extrabold text-slate-900 dark:text-slate-50">79 score</div>
                    </div>
                    <MiniLine values={segmentSeries} tone="neutral" />
                  </div>
                  <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">Smart segments are converting better when tied to replay and giving follow-up journeys.</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tight">Contact directory</div>
                  <div className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                    Master audience list for followers, members, attendees, donors, volunteers, and imported leads.
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 min-w-full xl:min-w-[480px]">
                  <label className="relative block sm:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search contacts, segments, language, or channel"
                      className="w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-800/20 pl-10 pr-4 text-sm font-bold text-slate-900 dark:text-slate-100 ring-1 ring-slate-200 dark:ring-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    />
                  </label>
                  <Btn tone="ghost" left={<Filter className="h-4 w-4" />} onClick={() => setToast("Advanced directory filters opened")}>Filters</Btn>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Followers / attendees</div>
                  <div className="mt-1 text-xl font-extrabold text-slate-900 dark:text-slate-50">{contactCounts.followers}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Members</div>
                  <div className="mt-1 text-xl font-extrabold text-slate-900 dark:text-slate-50">{contactCounts.members}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Donors</div>
                  <div className="mt-1 text-xl font-extrabold text-slate-900 dark:text-slate-50">{contactCounts.donors}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Volunteers</div>
                  <div className="mt-1 text-xl font-extrabold text-slate-900 dark:text-slate-50">{contactCounts.volunteers}</div>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-3xl ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="hidden md:grid grid-cols-[1.6fr_1fr_.9fr_1fr_1fr_.7fr] gap-3 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">
                  <div>Contact</div>
                  <div>Consent / safety</div>
                  <div>Channels</div>
                  <div>Segments</div>
                  <div>Recent activity</div>
                  <div>Health</div>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {visibleContacts.map((contact) => {
                    const selected = selectedContact.id === contact.id;
                    return (
                      <button
                        key={contact.id}
                        type="button"
                        onClick={() => setSelectedContactId(contact.id)}
                        className={cn(
                          "w-full text-left px-4 py-4 transition",
                          selected ? "bg-emerald-50/70 dark:bg-emerald-500/10" : "hover:bg-slate-50 dark:hover:bg-slate-950",
                        )}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_.9fr_1fr_1fr_.7fr] gap-3 items-start">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="h-11 w-11 rounded-2xl shrink-0 grid place-items-center text-white font-black" style={{ backgroundColor: selected ? GREEN : GREY }}>
                              {contact.name
                                .split(" ")
                                .slice(0, 2)
                                .map((part) => part[0])
                                .join("")}
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="truncate text-[13px] font-bold text-slate-900 dark:text-slate-50">{contact.name}</div>
                                <Pill tone={roleTone(contact.title)}>{contact.title}</Pill>
                                {contact.childSafe ? <Pill tone="warn"><ShieldCheck className="h-3 w-3" /> Protected</Pill> : null}
                              </div>
                              <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-2 gap-y-1">
                                <span>{contact.campus}</span>
                                <span>•</span>
                                <span>{contact.brand}</span>
                                <span>•</span>
                                <span>{contact.region}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <Pill tone={consentTone(contact.consentState)}>{contact.consentState}</Pill>
                            {contact.highRisk ? <Pill tone="bad"><AlertTriangle className="h-3 w-3" /> Hold</Pill> : null}
                          </div>

                          <div className="text-[12px] text-slate-600 dark:text-slate-300">
                            <div className="font-bold text-slate-900 dark:text-slate-50">{contact.primaryChannel}</div>
                            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{contact.channelsAllowed.length} allowed</div>
                          </div>

                          <div className="text-[12px] text-slate-600 dark:text-slate-300">
                            <div className="font-bold text-slate-900 dark:text-slate-50">{contact.segmentIds.length} segments</div>
                            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {contact.segmentIds.map((id) => segmentLookup.get(id)?.label || id).join(" • ")}
                            </div>
                          </div>

                          <div className="text-[12px] text-slate-600 dark:text-slate-300">
                            <div className="font-bold text-slate-900 dark:text-slate-50">{contact.lastActivity}</div>
                            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{contact.language}</div>
                          </div>

                          <div className="text-[12px] text-slate-600 dark:text-slate-300">
                            <div className="font-bold text-slate-900 dark:text-slate-50">{contact.engagementScore}/100</div>
                            <div className="mt-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div className={cn("h-full rounded-full", contact.engagementScore > 80 ? "bg-emerald-500" : contact.engagementScore > 50 ? "bg-amber-500" : "bg-rose-500")} style={{ width: `${contact.engagementScore}%` }} />
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tight">Segment builder</div>
                  <div className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                    Smart and manual segments for ministry groups, donor paths, event audiences, replay viewers, and Beacon responders.
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800/50 p-1 ring-1 ring-slate-200/60 dark:ring-slate-800/60">
                  <button
                    type="button"
                    onClick={() => setSegmentMode("Smart")}
                    className={cn(
                      "rounded-xl px-3 py-2 text-[11px] font-black uppercase tracking-widest transition",
                      segmentMode === "Smart" ? "text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700/60",
                    )}
                    style={segmentMode === "Smart" ? { backgroundColor: GREEN } : undefined}
                  >
                    Smart
                  </button>
                  <button
                    type="button"
                    onClick={() => setSegmentMode("Manual")}
                    className={cn(
                      "rounded-xl px-3 py-2 text-[11px] font-black uppercase tracking-widest transition",
                      segmentMode === "Manual" ? "text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700/60",
                    )}
                    style={segmentMode === "Manual" ? { backgroundColor: ORANGE } : undefined}
                  >
                    Manual
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Active rule canvas</div>
                      <div className="mt-1 text-[13px] font-bold text-slate-900 dark:text-slate-50">
                        {segmentMode === "Smart" ? "Smart rule recommendations" : "Manual ministry list builder"}
                      </div>
                    </div>
                    <Btn tone="ghost" left={<SlidersHorizontal className="h-4 w-4" />} onClick={() => setToast("Advanced rule logic opened")}>Refine logic</Btn>
                  </div>

                  {segmentMode === "Smart" ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {smartRuleSuggestions.map((rule) => (
                        <Pill key={rule} tone="neutral">{rule}</Pill>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                      <div className="text-[12px] font-bold text-slate-900 dark:text-slate-50">Manual roster controls</div>
                      <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Build protected ministry lists for choir, ushers, children’s ministry parents, translators, or pastoral care groups with strict child-safe and quiet-hour rules.
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">CSV import + approval review</div>
                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">Parent-approved child-safe lists</div>
                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">Volunteer / staff roster sync</div>
                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">Quiet-hour aware small-group messages</div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 p-4 ring-1 ring-emerald-200 dark:ring-emerald-500/20 text-[12px] text-emerald-900 dark:text-emerald-300">
                    <div className="font-black uppercase tracking-widest text-[10px] mb-1">Premium differentiator</div>
                    Deep links from every contact or segment into Live Session attendance, giving history, event response, and Beacon exposure without leaving the audience layer.
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredSegments.slice(0, 4).map((segment) => (
                    <div key={segment.id} className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="text-[13px] font-bold text-slate-900 dark:text-slate-50 truncate">{segment.label}</div>
                            <Pill tone={segmentTone(segment.health)}>{segment.health}</Pill>
                            {segment.childSafeReady ? <Pill tone="good"><ShieldCheck className="h-3 w-3" /> Safe</Pill> : null}
                          </div>
                          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{segment.ruleSummary}</div>
                        </div>
                        <Btn tone="ghost" left={<ExternalLink className="h-4 w-4" />} onClick={() => setToast(`Opened ${segment.label}`)}>Open</Btn>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                          <div className="text-slate-500 dark:text-slate-500 uppercase tracking-widest text-[10px] font-black">Audience</div>
                          <div className="mt-1 font-extrabold text-slate-900 dark:text-slate-50">{segment.size.toLocaleString()}</div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                          <div className="text-slate-500 dark:text-slate-500 uppercase tracking-widest text-[10px] font-black">Journeys</div>
                          <div className="mt-1 font-extrabold text-slate-900 dark:text-slate-50">{segment.linkedJourneys}</div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                          <div className="text-slate-500 dark:text-slate-500 uppercase tracking-widest text-[10px] font-black">Growth</div>
                          <div className="mt-1 font-extrabold text-slate-900 dark:text-slate-50">{segment.growth}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tight">Import, merge & hygiene tools</div>
                  <div className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                    CSV and platform imports, duplicate detection, merge suggestions, invalid endpoint cleanup, and audience-quality protection.
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Btn tone="primary" left={<Download className="h-4 w-4" />} onClick={() => setToast("CSV import wizard opened")}>CSV import</Btn>
                  <Btn tone="secondary" left={<RefreshCw className="h-4 w-4" />} onClick={() => setToast("Platform sync started")}>Platform sync</Btn>
                </div>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_.9fr]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {hygieneTasks.map((task) => (
                    <div key={task.id} className="rounded-3xl bg-slate-50 dark:bg-slate-950 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[12px] font-bold text-slate-900 dark:text-slate-50">{task.label}</div>
                          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{task.hint}</div>
                        </div>
                        <Pill tone={task.tone}>{task.count}</Pill>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                  <div className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Automation and safety controls</div>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-bold text-slate-900 dark:text-slate-50">Quiet-hour enforcement</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Respect household and donor quiet windows across channels.</div>
                      </div>
                      <Toggle value={channelQuietHours} onChange={setChannelQuietHours} />
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-bold text-slate-900 dark:text-slate-50">Child-safe lane lock</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Keep protected contacts inside approved parent-safe surfaces only.</div>
                      </div>
                      <Toggle value={childSafeLock} onChange={setChildSafeLock} />
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-bold text-slate-900 dark:text-slate-50">Auto-merge suggestions</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Queue duplicate suggestions, but keep final merge approval human-reviewed.</div>
                      </div>
                      <Toggle value={autoMerge} onChange={setAutoMerge} />
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-bold text-slate-900 dark:text-slate-50">Audience risk guard</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Suppress high-risk, bounced, or spam-reported contacts from live journeys.</div>
                      </div>
                      <Toggle value={audienceRiskGuard} onChange={setAudienceRiskGuard} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <ContactPreviewCard contact={selectedContact} segmentLookup={segmentLookup} />

            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tight">Interaction timeline</div>
                  <div className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                    Deep linked history across live attendance, replays, messages, donations, events, and Beacon exposure.
                  </div>
                </div>
                <Btn tone="ghost" left={<ExternalLink className="h-4 w-4" />} onClick={() => setToast("Opened attendance and giving history")}>Deep links</Btn>
              </div>

              <div className="mt-4 space-y-3">
                {selectedContact.timeline.map((event) => (
                  <div key={event.id} className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[12px] font-bold text-slate-900 dark:text-slate-50">{event.label}</div>
                        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{event.detail}</div>
                      </div>
                      <Pill tone={event.type === "Donation" ? "accent" : event.type === "Beacon" ? "brand" : "neutral"}>{event.type}</Pill>
                    </div>
                    <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">{event.when}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tight">Consent & opt-in center</div>
                  <div className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                    Source, quiet-hour controls, channel permissions, and child-safe restrictions for the selected contact.
                  </div>
                </div>
                <Pill tone={consentTone(selectedContact.consentState)}>{selectedContact.consentState}</Pill>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-slate-500 dark:text-slate-500 uppercase tracking-widest text-[10px] font-black">Quiet hours</div>
                  <div className="mt-1 font-bold text-slate-900 dark:text-slate-50">{selectedContact.quietHours}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-slate-500 dark:text-slate-500 uppercase tracking-widest text-[10px] font-black">Allowed channels</div>
                  <div className="mt-1 font-bold text-slate-900 dark:text-slate-50">{selectedContact.channelsAllowed.length}</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {selectedContact.channelsAllowed.map((channel) => (
                  <Pill key={channel} tone="neutral">{channel}</Pill>
                ))}
              </div>

              {selectedContact.childSafe ? (
                <div className="mt-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 p-3 ring-1 ring-amber-200 dark:ring-amber-500/20 text-[12px] text-amber-900 dark:text-amber-300">
                  <div className="font-black uppercase tracking-widest text-[10px] mb-1">Child-safe restriction active</div>
                  Parent-approved communication only. SMS and external messaging are locked until reconfirmed.
                </div>
              ) : null}

              <div className="mt-4 space-y-3">
                {selectedContact.consentAudit.map((entry) => (
                  <div key={`${entry.at}-${entry.label}`} className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="text-[12px] font-bold text-slate-900 dark:text-slate-50">{entry.label}</div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{entry.detail}</div>
                    <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">{entry.at}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tight">Channel connection manager</div>
                  <div className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                    Sender health, template readiness, verification state, and deliverability across connected ministry surfaces.
                  </div>
                </div>
                <Btn tone="ghost" left={<RefreshCw className="h-4 w-4" />} onClick={() => setToast("Channel health refreshed")}>Refresh</Btn>
              </div>

              <div className="mt-4 space-y-3">
                {channelConnections.map((channel) => (
                  <div key={channel.id} className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-[13px] font-bold text-slate-900 dark:text-slate-50">{channel.name}</div>
                          <Pill tone={statusTone(channel.status)}>{channel.status}</Pill>
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                          {channel.sender} • {channel.campus}
                        </div>
                      </div>
                      <Btn tone="ghost" left={<ExternalLink className="h-4 w-4" />} onClick={() => setToast(`Opened ${channel.name} settings`)}>Open</Btn>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                      <div className="rounded-xl bg-white dark:bg-slate-900 p-2.5 ring-1 ring-slate-200 dark:ring-slate-800">
                        <div className="text-slate-500 dark:text-slate-500 uppercase tracking-widest text-[10px] font-black">Deliverability</div>
                        <div className="mt-1 font-bold text-slate-900 dark:text-slate-50">{channel.deliverability}</div>
                      </div>
                      <div className="rounded-xl bg-white dark:bg-slate-900 p-2.5 ring-1 ring-slate-200 dark:ring-slate-800">
                        <div className="text-slate-500 dark:text-slate-500 uppercase tracking-widest text-[10px] font-black">Verification</div>
                        <div className="mt-1 font-bold text-slate-900 dark:text-slate-50">{channel.verification}</div>
                      </div>
                    </div>
                    <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{channel.note}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tight">Suppression & safety controls</div>
                  <div className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                    Unsubscribes, spam reports, do-not-contact rules, child-protection restrictions, and risk-aware audience locks.
                  </div>
                </div>
                <Pill tone="warn"><Lock className="h-3 w-3" /> High-trust lane</Pill>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3">
                <div className="rounded-2xl bg-rose-50 dark:bg-rose-500/10 p-3 ring-1 ring-rose-200 dark:ring-rose-500/20 text-[12px] text-rose-900 dark:text-rose-300">
                  <div className="font-black uppercase tracking-widest text-[10px] mb-1">Do-not-contact / spam hold</div>
                  17 contacts are currently suppressed due to invalid endpoints, spam reports, or explicit do-not-contact requests.
                </div>
                <div className="rounded-2xl bg-amber-50 dark:bg-amber-500/10 p-3 ring-1 ring-amber-200 dark:ring-amber-500/20 text-[12px] text-amber-900 dark:text-amber-300">
                  <div className="font-black uppercase tracking-widest text-[10px] mb-1">Protected audience logic</div>
                  Child-facing ministry segments automatically restrict channel access, quiet hours, and approval rules.
                </div>
                <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 p-3 ring-1 ring-emerald-200 dark:ring-emerald-500/20 text-[12px] text-emerald-900 dark:text-emerald-300">
                  <div className="font-black uppercase tracking-widest text-[10px] mb-1">Compliance audit ready</div>
                  Consent capture timestamps, sender states, and suppression actions are preserved for campaign and platform review.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Drawer open={previewOpen} onClose={() => setPreviewOpen(false)} title="Channels & Contact Manager Preview">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: "contact", label: "Contact 360", icon: Users },
                { key: "segment", label: "Segment snapshot", icon: Layers },
                { key: "channel", label: "Channel health", icon: Zap },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSelectedPreviewTab(tab.key as PreviewTab)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-widest transition",
                      selectedPreviewTab === tab.key
                        ? "text-white shadow-sm"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-800",
                    )}
                    style={selectedPreviewTab === tab.key ? { backgroundColor: selectedPreviewTab === "segment" ? ORANGE : GREEN } : undefined}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {selectedPreviewTab === "contact" ? (
              <div className="space-y-4">
                <ContactPreviewCard contact={selectedContact} segmentLookup={segmentLookup} />
                <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
                  <div className="text-[28px] font-black leading-[1.04] tracking-[-0.03em] text-slate-900 dark:text-slate-100 sm:text-[34px] lg:text-[40px]">Desktop spotlight</div>
                  <div className="mt-2 grid grid-cols-3 gap-3 text-[12px]">
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="mt-1.5 text-[14px] leading-6 text-slate-500 dark:text-slate-400">Live attended</div>
                      <div className="mt-1 text-lg font-extrabold text-slate-900 dark:text-slate-50">{selectedContact.liveCount}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="text-slate-500 dark:text-slate-500 uppercase tracking-widest text-[10px] font-black">Replays</div>
                      <div className="mt-1 text-lg font-extrabold text-slate-900 dark:text-slate-50">{selectedContact.replayCount}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="text-slate-500 dark:text-slate-500 uppercase tracking-widest text-[10px] font-black">Beacon touches</div>
                      <div className="mt-1 text-lg font-extrabold text-slate-900 dark:text-slate-50">{selectedContact.beaconTouches}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {selectedPreviewTab === "segment" ? (
              <SegmentPreviewBoard selectedSegments={selectedContactSegments.length ? selectedContactSegments : filteredSegments} />
            ) : null}

            {selectedPreviewTab === "channel" ? (
              <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
                <div className="text-sm font-black text-slate-900 dark:text-slate-50">Operational channel map</div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {channelConnections.slice(0, 4).map((channel) => (
                    <div key={channel.id} className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[13px] font-bold text-slate-900 dark:text-slate-50">{channel.name}</div>
                        <Pill tone={statusTone(channel.status)}>{channel.status}</Pill>
                      </div>
                      <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">{channel.deliverability}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <PhoneMock
              title={selectedPreviewTab === "contact" ? selectedContact.name : selectedPreviewTab === "segment" ? "Segment snapshot" : "Channel health"}
              subtitle={selectedPreviewTab === "contact" ? "Mobile contact card" : selectedPreviewTab === "segment" ? "Mobile segment board" : "Mobile channel ops"}
              body={
                selectedPreviewTab === "contact" ? (
                  <>
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 px-4 py-3 ring-1 ring-slate-100 dark:ring-white/5 shadow-sm">
                      <div className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Consent state</div>
                      <div className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">{selectedContact.consentState} • {selectedContact.primaryChannel}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 px-4 py-3 ring-1 ring-slate-100 dark:ring-white/5 shadow-sm">
                      <div className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Recent touch</div>
                      <div className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">{selectedContact.lastActivity}</div>
                      <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{selectedContact.timeline[0]?.detail}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 px-4 py-3 ring-1 ring-slate-100 dark:ring-white/5 shadow-sm">
                      <div className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Protected flags</div>
                      <div className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">{selectedContact.childSafe ? "Child-safe lane" : "Standard lane"}</div>
                    </div>
                  </>
                ) : selectedPreviewTab === "segment" ? (
                  <>
                    {(selectedContactSegments.length ? selectedContactSegments : filteredSegments).slice(0, 2).map((segment) => (
                      <div key={segment.id} className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 px-4 py-3 ring-1 ring-slate-100 dark:ring-white/5 shadow-sm">
                        <div className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{segment.mode} segment</div>
                        <div className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">{segment.label}</div>
                        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{segment.size.toLocaleString()} contacts • {segment.growth}</div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {channelConnections.slice(0, 3).map((channel) => (
                      <div key={channel.id} className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 px-4 py-3 ring-1 ring-slate-100 dark:ring-white/5 shadow-sm">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm font-black text-slate-900 dark:text-slate-100">{channel.name}</div>
                          <Pill tone={statusTone(channel.status)}>{channel.status}</Pill>
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{channel.deliverability}</div>
                      </div>
                    ))}
                  </>
                )
              }
              footer={
                <div className="grid grid-cols-2 gap-2">
                  <Btn tone="primary" left={<Eye className="h-4 w-4" />}>Open insight</Btn>
                  <Btn tone="secondary" left={<Copy className="h-4 w-4" />} onClick={async () => {
                    const ok = await copyText(selectedContact.email);
                    setToast(ok ? "Contact email copied" : "Copy unavailable");
                  }}>Copy value</Btn>
                </div>
              }
            />

            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
              <div className="text-sm font-black text-slate-900 dark:text-slate-50">Why this page is premium</div>
              <div className="mt-3 space-y-2 text-[12px] text-slate-600 dark:text-slate-400 leading-relaxed">
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">A premium CRM feel without losing the warmth, context, and safeguarding needs of ministry work.</div>
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">Consent audit trails and child-safe restrictions live directly in the audience layer, not as a disconnected compliance add-on.</div>
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">Every contact and segment can deep-link into live attendance, replay behaviour, giving history, and Beacon campaign exposure.</div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      {toast ? (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[120]">
          <div className="rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-bold shadow-2xl">
            {toast}
          </div>
        </div>
      ) : null}
    </div>
  );
}









