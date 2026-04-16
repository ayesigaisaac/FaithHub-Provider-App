// @ts-nocheck
"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Bell,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  Globe2,
  HeartHandshake,
  LayoutGrid,
  Link2,
  Lock,
  MapPin,
  Megaphone,
  MessageSquare,
  PlayCircle,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
  Wand2,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { handleRawPlaceholderAction } from "./placeholderActions";

/**
 * FaithHub Ã¢â‚¬â€ FH-P-100 Community Groups
 * ------------------------------------
 * Premium Provider-side operating surface for ministries, cells, discipleship circles,
 * prayer groups, youth communities, family groups, and other faith-community structures.
 *
 * Page goals
 * - Keep the same premium creator-style grammar already used across the FaithHub Provider pages.
 * - Use EVzone Green as the primary accent and Orange as the secondary accent.
 * - Make Community Groups the command page for group lifecycle, leader coverage,
 *   safety, care, events, live follow-up, and noticeboard distribution.
 * - Surface a strong "+ New Group" primary CTA that routes into the future group builder flow.
 * - Keep a persistent desktop/mobile experience preview rail plus a larger preview drawer.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#172554";

const ROUTES = {
  providerDashboard: "/faithhub/provider/dashboard",
  channelsContactManager: "/faithhub/provider/channels-contact-manager",
  noticeboard: "/faithhub/provider/noticeboard",
  liveBuilder: "/faithhub/provider/live-builder",
  groupBuilder: "/faithhub/provider/community-groups/new",
};

const HERO_1 =
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80";
const HERO_2 =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80";
const HERO_3 =
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1600&q=80";
const HERO_4 =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80";

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  if (typeof window === "undefined") return;
  window.location.assign(url);
}

function fmtInt(n: number) {
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function pct(value: number, total: number) {
  if (!total) return 0;
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}

function fmtLocal(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type GroupType =
  | "Discipleship"
  | "Prayer Circle"
  | "Youth"
  | "Women"
  | "Men"
  | "Family"
  | "Serving Team";

type GroupStatus = "Healthy" | "Needs coverage" | "Care risk" | "Draft";
type AccessMode = "Open" | "Private" | "Invite-only";
type MeetingMode = "Online" | "On-site" | "Hybrid";
type PreviewMode = "desktop" | "mobile";

type CareSignal = {
  id: string;
  label: string;
  hint: string;
  tone: "good" | "warn" | "danger";
};

type RhythmItem = {
  id: string;
  label: string;
  when: string;
  state: "Ready" | "Pending" | "Watch";
};

type HookItem = {
  id: string;
  label: string;
  hint: string;
  state: "Ready" | "Pending" | "Draft";
};

type GroupRecord = {
  id: string;
  title: string;
  subtitle: string;
  type: GroupType;
  status: GroupStatus;
  access: AccessMode;
  meetingMode: MeetingMode;
  heroUrl: string;
  campus: string;
  language: string[];
  leader: string;
  coLeader?: string;
  members: number;
  activeMembers: number;
  attendanceRate: number;
  prayerRequests: number;
  testimonies: number;
  noticeboardPosts: number;
  careEscalations: number;
  childrenSafe: boolean;
  linkedLive?: string;
  linkedSeries?: string;
  linkedEvent?: string;
  upcomingISO: string;
  description: string;
  tags: string[];
  careSignals: CareSignal[];
  rhythm: RhythmItem[];
  hooks: HookItem[];
};

const TEMPLATE_CARDS = [
  {
    id: "tpl-discipleship",
    title: "Discipleship circle",
    subtitle: "Recurring small-group journeys with notes, live follow-up, and leader care routing.",
    accent: "green" as const,
  },
  {
    id: "tpl-prayer",
    title: "Prayer circle",
    subtitle: "Prayer intake, care assignments, answered-prayer moments, and noticeboard rhythm.",
    accent: "orange" as const,
  },
  {
    id: "tpl-youth",
    title: "Youth group",
    subtitle: "Child-safe defaults, volunteer visibility, event planning, and moderated discussion patterns.",
    accent: "navy" as const,
  },
  {
    id: "tpl-family",
    title: "Family community",
    subtitle: "Parent-first messaging, family events, reading plans, and testimony-friendly engagement.",
    accent: "green" as const,
  },
];

const NETWORK_LANES = [
  {
    id: "lane-campus",
    title: "Campus network",
    subtitle: "Groups organized by campus, service location, and local care ownership.",
    count: 12,
    state: "Stable",
  },
  {
    id: "lane-prayer",
    title: "Prayer communities",
    subtitle: "High-care circles with prayer intake, response routing, and follow-up discipline.",
    count: 7,
    state: "Growing",
  },
  {
    id: "lane-youth",
    title: "Youth & family lane",
    subtitle: "Child-safe spaces with stricter moderation, approved leaders, and parent-aware communication.",
    count: 5,
    state: "Watch",
  },
  {
    id: "lane-serve",
    title: "Serving & outreach teams",
    subtitle: "Volunteer-led groups tied to events, missions, projects, and Live Sessionz execution.",
    count: 9,
    state: "Active",
  },
];

const GROUPS: GroupRecord[] = [
  {
    id: "grp-young-adults",
    title: "Young Adults Discipleship Circle",
    subtitle: "Weekly growth, accountability, and live-linked follow-up for ages 20Ã¢â‚¬â€œ35.",
    type: "Discipleship",
    status: "Healthy",
    access: "Open",
    meetingMode: "Hybrid",
    heroUrl: HERO_1,
    campus: "Kampala Central",
    language: ["English", "Luganda"],
    leader: "Pastor Ada N.",
    coLeader: "Brian M.",
    members: 148,
    activeMembers: 126,
    attendanceRate: 86,
    prayerRequests: 14,
    testimonies: 5,
    noticeboardPosts: 7,
    careEscalations: 1,
    childrenSafe: false,
    linkedLive: "Young Adults Bible Night",
    linkedSeries: "40 Days of Renewal",
    linkedEvent: "Prayer & Worship Friday",
    upcomingISO: "2026-04-18T18:30:00",
    description:
      "A premium discipleship circle with weekly teaching follow-up, prayer care, discussion prompts, and recurring live-room handoff after the Sunday message.",
    tags: ["discipleship", "young adults", "renewal", "hybrid"],
    careSignals: [
      {
        id: "cs-1",
        label: "Prayer backlog under control",
        hint: "2 unassigned items older than 48h have been cleared this week.",
        tone: "good",
      },
      {
        id: "cs-2",
        label: "One pastoral care escalation",
        hint: "A sensitive counseling referral needs owner confirmation.",
        tone: "warn",
      },
      {
        id: "cs-3",
        label: "Leader coverage healthy",
        hint: "Main leader and co-leader both confirmed for the next two sessions.",
        tone: "good",
      },
    ],
    rhythm: [
      { id: "rh-1", label: "Weekly circle gathering", when: "Fri Ã‚Â· 6:30 PM", state: "Ready" },
      { id: "rh-2", label: "Post-live follow-up thread", when: "Sun Ã‚Â· after service", state: "Ready" },
      { id: "rh-3", label: "April reading plan push", when: "Tomorrow", state: "Pending" },
    ],
    hooks: [
      { id: "hk-1", label: "Noticeboard sync", hint: "Board card ready for group update and reminder route.", state: "Ready" },
      { id: "hk-2", label: "Live Session handoff", hint: "Linked to Young Adults Bible Night for Q&A continuity.", state: "Ready" },
      { id: "hk-3", label: "Audience segment refresh", hint: "Needs re-check after 3 recent member transfers.", state: "Pending" },
    ],
  },
  {
    id: "grp-prayer-watch",
    title: "Midweek Prayer Watch",
    subtitle: "Care-first prayer community with quick escalation and response coverage.",
    type: "Prayer Circle",
    status: "Care risk",
    access: "Private",
    meetingMode: "Online",
    heroUrl: HERO_2,
    campus: "Online First",
    language: ["English"],
    leader: "Minister Ruth K.",
    members: 84,
    activeMembers: 62,
    attendanceRate: 71,
    prayerRequests: 29,
    testimonies: 3,
    noticeboardPosts: 4,
    careEscalations: 4,
    childrenSafe: false,
    linkedLive: "Wednesday Prayer Watch",
    linkedSeries: "Prayer & Intercession",
    upcomingISO: "2026-04-17T20:00:00",
    description:
      "A private prayer-first group that handles incoming requests, answered-prayer updates, urgent pastoral routing, and confidentiality-aware member follow-up.",
    tags: ["prayer", "care", "online", "private"],
    careSignals: [
      {
        id: "cs-4",
        label: "Escalation queue rising",
        hint: "4 pastoral care items have not yet been acknowledged.",
        tone: "danger",
      },
      {
        id: "cs-5",
        label: "Coverage gap tomorrow",
        hint: "No confirmed co-leader for the next online watch session.",
        tone: "warn",
      },
      {
        id: "cs-6",
        label: "Answered-prayer ratio improving",
        hint: "3 testimonies published this week from last monthÃ¢â‚¬â„¢s requests.",
        tone: "good",
      },
    ],
    rhythm: [
      { id: "rh-4", label: "Night prayer watch", when: "Wed Ã‚Â· 8:00 PM", state: "Ready" },
      { id: "rh-5", label: "Answered-prayer recap", when: "Fri Ã‚Â· 11:00 AM", state: "Pending" },
      { id: "rh-6", label: "Care-owner assignment sweep", when: "Daily", state: "Watch" },
    ],
    hooks: [
      { id: "hk-4", label: "Prayer intake bridge", hint: "Prayer Requests page has 6 items waiting for routing.", state: "Pending" },
      { id: "hk-5", label: "Noticeboard card", hint: "Private-only notice is ready for tonightÃ¢â‚¬â„¢s prayer circle.", state: "Ready" },
      { id: "hk-6", label: "Counseling handoff", hint: "Two members need private support channel follow-up.", state: "Pending" },
    ],
  },
  {
    id: "grp-youth-ignite",
    title: "Ignite Youth Community",
    subtitle: "Youth group with child-safe defaults, volunteer visibility, and event-linked communication.",
    type: "Youth",
    status: "Needs coverage",
    access: "Invite-only",
    meetingMode: "On-site",
    heroUrl: HERO_3,
    campus: "Entebbe South",
    language: ["English", "Swahili"],
    leader: "Leader Michael O.",
    members: 112,
    activeMembers: 83,
    attendanceRate: 78,
    prayerRequests: 9,
    testimonies: 6,
    noticeboardPosts: 8,
    careEscalations: 2,
    childrenSafe: true,
    linkedEvent: "Youth Outreach Saturday",
    linkedSeries: "Identity & Purpose",
    upcomingISO: "2026-04-20T15:00:00",
    description:
      "A youth-focused community with tighter permissions, safer messaging defaults, volunteer coverage checks, and premium coordination around live sessions and events.",
    tags: ["youth", "child-safe", "events", "invite-only"],
    careSignals: [
      {
        id: "cs-7",
        label: "Volunteer rota incomplete",
        hint: "Two approved youth leaders still need confirmation for Saturday.",
        tone: "warn",
      },
      {
        id: "cs-8",
        label: "Child-safe defaults active",
        hint: "Private messaging restrictions and parent-visible notices are enabled.",
        tone: "good",
      },
      {
        id: "cs-9",
        label: "Event registration spike",
        hint: "Youth Outreach Saturday demand is up; plan overflow comms.",
        tone: "warn",
      },
    ],
    rhythm: [
      { id: "rh-7", label: "Youth circle meet-up", when: "Sat Ã‚Â· 3:00 PM", state: "Ready" },
      { id: "rh-8", label: "Parent reminder run", when: "Thu Ã‚Â· 6:00 PM", state: "Pending" },
      { id: "rh-9", label: "Identity & Purpose replay follow-up", when: "Mon Ã‚Â· 5:00 PM", state: "Ready" },
    ],
    hooks: [
      { id: "hk-7", label: "Noticeboard sync", hint: "Youth notice cards waiting for parent-visible approval.", state: "Pending" },
      { id: "hk-8", label: "Event handoff", hint: "Linked to Youth Outreach Saturday for attendance and volunteer flow.", state: "Ready" },
      { id: "hk-9", label: "Audience contact health", hint: "3 guardians need consent refresh for SMS updates.", state: "Draft" },
    ],
  },
  {
    id: "grp-family-table",
    title: "Family Table Fellowship",
    subtitle: "Family-centered small group with resources, testimony prompts, and discussion rhythms.",
    type: "Family",
    status: "Draft",
    access: "Open",
    meetingMode: "Hybrid",
    heroUrl: HERO_4,
    campus: "Kampala West",
    language: ["English"],
    leader: "Sister Grace T.",
    members: 48,
    activeMembers: 0,
    attendanceRate: 0,
    prayerRequests: 0,
    testimonies: 0,
    noticeboardPosts: 1,
    careEscalations: 0,
    childrenSafe: true,
    linkedSeries: "Families in Faith",
    upcomingISO: "2026-04-25T17:00:00",
    description:
      "A new family-focused group being prepared with resources, parent prompts, reading plans, and a gentler invite-driven on-ramp.",
    tags: ["family", "hybrid", "draft"],
    careSignals: [
      {
        id: "cs-10",
        label: "Needs launch approvals",
        hint: "No published invite flow yet; preview, noticeboard, and safety checks remain.",
        tone: "warn",
      },
      {
        id: "cs-11",
        label: "No care incidents yet",
        hint: "Group is still in a pre-launch setup state.",
        tone: "good",
      },
    ],
    rhythm: [
      { id: "rh-10", label: "Launch preview review", when: "Next week", state: "Pending" },
      { id: "rh-11", label: "Family reading plan setup", when: "Drafting", state: "Pending" },
    ],
    hooks: [
      { id: "hk-10", label: "Beacon teaser option", hint: "Could be promoted once first meetup date is locked.", state: "Draft" },
      { id: "hk-11", label: "Resource pack", hint: "Reading guide and family prompts still missing.", state: "Pending" },
    ],
  },
];

function Pill({
  tone = "neutral",
  children,
  title,
}: {
  tone?: "neutral" | "good" | "warn" | "danger" | "pro" | "brand";
  children?: React.ReactNode;
  title?: string;
}) {
  const cls =
    tone === "good"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
      : tone === "warn"
        ? "bg-amber-50 text-amber-900 ring-amber-200"
        : tone === "danger"
          ? "bg-rose-50 text-rose-900 ring-rose-200"
          : tone === "pro"
            ? "bg-violet-50 text-violet-800 ring-violet-200"
            : tone === "brand"
              ? "text-white"
              : "bg-white text-slate-700 ring-slate-200";
  return (
    <span
      title={title}
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1",
        cls,
      )}
      style={tone === "brand" ? { background: EV_ORANGE } : undefined}
    >
      {children}
    </span>
  );
}

function ActionButton({
  tone = "neutral",
  children,
  onClick,
  disabled,
  left,
  className,
  title,
}: {
  tone?: "neutral" | "primary" | "ghost";
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  left?: React.ReactNode;
  className?: string;
  title?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-3.5 py-2 text-[12px] font-bold transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  const cls =
    tone === "primary"
      ? "text-white hover:brightness-95"
      : tone === "ghost"
        ? "bg-transparent text-slate-900 hover:bg-white"
        : "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50";
  return (
    <button
      title={title}
      className={cx(base, cls, className)}
      style={tone === "primary" ? { background: EV_GREEN } : undefined}
      onClick={onClick}
      disabled={disabled}
    >
      {left}
      {children}
    </button>
  );
}

function MetricCard({
  label,
  value,
  hint,
  accent = "green",
}: {
  label: string;
  value: string;
  hint: string;
  accent?: "green" | "orange" | "navy";
}) {
  const bg =
    accent === "orange"
      ? "rgba(247,127,0,0.10)"
      : accent === "navy"
        ? "rgba(23,37,84,0.10)"
        : "rgba(3,205,140,0.10)";

  const dot =
    accent === "orange"
      ? EV_ORANGE
      : accent === "navy"
        ? EV_NAVY
        : EV_GREEN;

  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
            {label}
          </div>
          <div className="mt-2 text-[18px] font-black text-slate-900">{value}</div>
          <div className="mt-1 text-[11px] leading-snug text-slate-500">{hint}</div>
        </div>
        <div
          className="h-10 w-10 rounded-2xl"
          style={{ background: bg, boxShadow: `inset 0 0 0 1px ${dot}25` }}
        />
      </div>
    </div>
  );
}

function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-3xl overflow-hidden border-l border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <div className="truncate text-[14px] font-black text-slate-900">{title}</div>
            {subtitle ? (
              <div className="mt-0.5 text-[11px] text-slate-500">{subtitle}</div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="h-[calc(100%-73px)] overflow-y-auto px-5 py-5">{children}</div>
      </aside>
    </div>
  );
}

function GroupStatusPill({ status }: { status: GroupStatus }) {
  if (status === "Healthy") {
    return (
      <Pill tone="good">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Healthy
      </Pill>
    );
  }
  if (status === "Needs coverage") {
    return (
      <Pill tone="warn">
        <AlertTriangle className="h-3.5 w-3.5" />
        Needs coverage
      </Pill>
    );
  }
  if (status === "Care risk") {
    return (
      <Pill tone="danger">
        <ShieldCheck className="h-3.5 w-3.5" />
        Care risk
      </Pill>
    );
  }
  return (
    <Pill>
      <LayoutGrid className="h-3.5 w-3.5" />
      Draft
    </Pill>
  );
}

function AccessPill({ access }: { access: AccessMode }) {
  if (access === "Open") {
    return <Pill>Open</Pill>;
  }
  if (access === "Private") {
    return (
      <Pill tone="pro">
        <Lock className="h-3.5 w-3.5" />
        Private
      </Pill>
    );
  }
  return (
    <Pill tone="warn">
      <UserPlus className="h-3.5 w-3.5" />
      Invite-only
    </Pill>
  );
}

function SignalCard({
  signal,
}: {
  signal: CareSignal;
}) {
  const tone =
    signal.tone === "good"
      ? "good"
      : signal.tone === "warn"
        ? "warn"
        : "danger";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-start gap-2">
        <Pill tone={tone}>{signal.label}</Pill>
      </div>
      <div className="mt-2 text-[12px] leading-snug text-slate-600">{signal.hint}</div>
    </div>
  );
}

function GroupExperiencePreview({
  group,
  previewMode,
}: {
  group: GroupRecord;
  previewMode: PreviewMode;
}) {
  const desktop = previewMode === "desktop";
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">
            {desktop ? "Desktop group preview" : "Mobile group preview"}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Persistent preview rail for how the group destination and invite flow will appear.
          </div>
        </div>
        <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            className={cx(
              "rounded-full px-3 py-1 text-[11px] font-bold",
              desktop ? "bg-slate-900 text-white" : "text-slate-500",
            )}
           onClick={handleRawPlaceholderAction}>
            Desktop
          </button>
          <button
            type="button"
            className={cx(
              "rounded-full px-3 py-1 text-[11px] font-bold",
              !desktop ? "bg-slate-900 text-white" : "text-slate-500",
            )}
           onClick={handleRawPlaceholderAction}>
            Mobile
          </button>
        </div>
      </div>

      {desktop ? (
        <div className="mt-4 overflow-hidden rounded-[24px] border border-slate-200 bg-[#f8fafc]">
          <div className="relative h-40 overflow-hidden">
            <img src={group.heroUrl} alt={group.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/10 to-transparent" />
            <div className="absolute left-3 top-3">
              <Pill tone="brand">GROUP</Pill>
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <div className="text-[12px] font-black text-white">{group.title}</div>
              <div className="mt-1 line-clamp-2 text-[11px] leading-snug text-white/85">
                {group.subtitle}
              </div>
            </div>
          </div>

          <div className="space-y-3 p-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[12px] font-black text-slate-900">{group.title}</div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    {group.type} Ã¢â‚¬Â¢ {group.campus} Ã¢â‚¬Â¢ {group.meetingMode}
                  </div>
                </div>
                <AccessPill access={group.access} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                  Members
                </div>
                <div className="mt-1 text-[17px] font-black text-slate-900">
                  {fmtInt(group.members)}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                  Attendance
                </div>
                <div className="mt-1 text-[17px] font-black text-slate-900">
                  {group.attendanceRate}%
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                  Prayer queue
                </div>
                <div className="mt-1 text-[17px] font-black text-slate-900">
                  {group.prayerRequests}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <div className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">
                Next meetup
              </div>
              <div className="mt-1 text-[13px] font-black text-slate-900">{fmtLocal(group.upcomingISO)}</div>
              <div className="mt-1 text-[11px] text-slate-500">
                Leader: {group.leader}
              </div>
            </div>

            <div className="flex gap-2">
              <ActionButton tone="primary" className="flex-1">
                Join group
              </ActionButton>
              <ActionButton className="flex-1">Request care</ActionButton>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex justify-center">
          <div className="w-[230px] overflow-hidden rounded-[34px] border-[8px] border-slate-900 bg-white shadow-2xl">
            <div className="h-5 bg-slate-900" />
            <div className="p-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                  Community group
                </div>
                <div className="mt-1 text-[16px] font-black leading-tight text-slate-900">
                  {group.title}
                </div>
                <div className="mt-1 text-[11px] leading-snug text-slate-500">
                  {group.subtitle}
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <div className="rounded-2xl border border-slate-200 px-3 py-2">
                  <div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">
                    Next gathering
                  </div>
                  <div className="mt-1 text-[12px] font-bold text-slate-900">{fmtLocal(group.upcomingISO)}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 px-3 py-2">
                  <div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">
                    Prayer queue
                  </div>
                  <div className="mt-1 text-[12px] font-bold text-slate-900">{group.prayerRequests} open items</div>
                </div>
                <div className="rounded-2xl border border-slate-200 px-3 py-2">
                  <div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">
                    Members
                  </div>
                  <div className="mt-1 text-[12px] font-bold text-slate-900">{fmtInt(group.members)} people</div>
                </div>
              </div>

              <button
                type="button"
                className="mt-3 w-full rounded-2xl px-3 py-2 text-[12px] font-black text-white"
                style={{ background: EV_GREEN }}
               onClick={handleRawPlaceholderAction}>
                Join circle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GroupExperiencePreviewInner({
  group,
  previewMode,
}: {
  group: GroupRecord;
  previewMode: PreviewMode;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_380px]">
      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative overflow-hidden rounded-[24px]">
          <img src={group.heroUrl} alt={group.title} className="h-[280px] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <Pill tone="brand">GROUP</Pill>
            <GroupStatusPill status={group.status} />
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-[24px] font-black leading-tight text-white">{group.title}</div>
            <div className="mt-2 max-w-2xl text-[13px] leading-snug text-white/85">
              {group.description}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">
              Group identity
            </div>
            <div className="mt-3 space-y-2 text-[13px] text-slate-700">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-400" />
                {group.type} Ã¢â‚¬Â¢ {group.meetingMode}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                {group.campus}
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-slate-400" />
                {group.language.join(" Ã¢â‚¬Â¢ ")}
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-slate-400" />
                Leader: {group.leader}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">
              Group performance
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="text-[10px] text-slate-400">Members</div>
                <div className="mt-1 text-[18px] font-black text-slate-900">{fmtInt(group.members)}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="text-[10px] text-slate-400">Attendance</div>
                <div className="mt-1 text-[18px] font-black text-slate-900">{group.attendanceRate}%</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="text-[10px] text-slate-400">Prayer queue</div>
                <div className="mt-1 text-[18px] font-black text-slate-900">{group.prayerRequests}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="text-[10px] text-slate-400">Noticeboard posts</div>
                <div className="mt-1 text-[18px] font-black text-slate-900">{group.noticeboardPosts}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[26px] border border-slate-200 bg-slate-50 p-4">
          <div className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">
            Community destination preview
          </div>
          <div className="mt-3">
            <GroupExperiencePreview group={group} previewMode={previewMode} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-[12px] font-black uppercase tracking-[0.12em] text-slate-400">
            Preview actions
          </div>
          <div className="mt-3 grid gap-2">
            <ActionButton className="justify-start" left={<ExternalLink className="h-4 w-4" />}>
              Open live page
            </ActionButton>
            <ActionButton className="justify-start" left={<Copy className="h-4 w-4" />}>
              Copy invite link
            </ActionButton>
            <ActionButton className="justify-start" left={<Megaphone className="h-4 w-4" />}>
              Push to noticeboard
            </ActionButton>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-[12px] font-black uppercase tracking-[0.12em] text-slate-400">
            Care & safety
          </div>
          <div className="mt-3 space-y-2">
            {group.childrenSafe ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-[12px] text-emerald-800">
                Child-safe defaults are active for this groupÃ¢â‚¬â„¢s communication and visibility patterns.
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-[12px] text-slate-600">
                Standard community visibility applies. Escalations still route into provider trust workflows.
              </div>
            )}
            {group.careSignals.map((signal) => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CommunityGroupsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | GroupStatus>("All");
  const [typeFilter, setTypeFilter] = useState<"All" | GroupType>("All");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [selectedGroupId, setSelectedGroupId] = useState(GROUPS[0].id);
  const [previewOpen, setPreviewOpen] = useState(false);

  const filteredGroups = useMemo(() => {
    return GROUPS.filter((group) => {
      const matchesSearch =
        !search.trim() ||
        group.title.toLowerCase().includes(search.toLowerCase()) ||
        group.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        group.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())) ||
        group.leader.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "All" || group.status === statusFilter;
      const matchesType = typeFilter === "All" || group.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [search, statusFilter, typeFilter]);

  const selectedGroup =
    filteredGroups.find((group) => group.id === selectedGroupId) ??
    GROUPS.find((group) => group.id === selectedGroupId) ??
    GROUPS[0];

  const totalGroups = GROUPS.length;
  const healthyGroups = GROUPS.filter((group) => group.status === "Healthy").length;
  const memberTotal = GROUPS.reduce((sum, group) => sum + group.members, 0);
  const activeMembers = GROUPS.reduce((sum, group) => sum + group.activeMembers, 0);
  const coverageGaps = GROUPS.filter((group) => group.status === "Needs coverage").length;
  const careBacklog = GROUPS.reduce((sum, group) => sum + group.careEscalations, 0);
  const prayerBacklog = GROUPS.reduce((sum, group) => sum + group.prayerRequests, 0);
  const childSafeGroups = GROUPS.filter((group) => group.childrenSafe).length;

  return (
    <div
      className="min-h-screen w-full bg-[#f2f2f2] px-5 py-5 text-slate-900"
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
    >
      <div className="mx-auto max-w-[1520px]">
        <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-5 border-b border-slate-200 px-6 py-5">
            <div className="flex min-w-0 items-start gap-4">
              <div
                className="grid h-12 w-12 place-items-center rounded-2xl text-[20px] font-black text-white"
                style={{ background: EV_GREEN }}
              >
                FH
              </div>
              <div className="min-w-0">
                <div className="truncate text-[26px] font-black leading-none tracking-[-0.02em] text-slate-900">
                  FH-P-100 Ã‚Â· Community Groups
                </div>
                <div className="mt-1 text-[13px] text-slate-500">
                  Premium community group operating system Ã‚Â· EVzone Green primary, Orange secondary
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Pill>Multi-campus</Pill>
              <Pill>Child-safe defaults</Pill>
              <Pill>Live-linked</Pill>
              <ActionButton left={<Eye className="h-4 w-4" />} onClick={() => setPreviewOpen(true)}>
                Preview
              </ActionButton>
              <ActionButton left={<UserPlus className="h-4 w-4" />} onClick={() => safeNav(ROUTES.channelsContactManager)}>
                Invite members
              </ActionButton>
              <ActionButton
                tone="primary"
                left={<Plus className="h-4 w-4" />}
                onClick={() => safeNav(ROUTES.groupBuilder)}
              >
                + New Group
              </ActionButton>
            </div>
          </div>

          <div className="border-b border-slate-200 px-6 py-3">
            <div className="flex flex-wrap items-center gap-3 text-[12px] text-slate-500">
              <Pill tone="brand">COMMUNITY NETWORK PULSE</Pill>
              <span>{coverageGaps} groups need co-leader coverage</span>
              <span>Ã¢â‚¬Â¢</span>
              <span>{careBacklog} care escalations need review</span>
              <span>Ã¢â‚¬Â¢</span>
              <span>3 groups are ready for noticeboard and live-linked follow-up</span>
              <span className="ml-auto text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">
                Premium community ops
              </span>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-4 md:grid-cols-2 xl:grid-cols-6">
            <MetricCard
              label="Active groups"
              value={fmtInt(totalGroups)}
              hint="Cells, circles, family groups, and serving communities."
              accent="green"
            />
            <MetricCard
              label="Healthy groups"
              value={fmtInt(healthyGroups)}
              hint="Groups with stable leadership, readiness, and member rhythm."
              accent="green"
            />
            <MetricCard
              label="Members engaged"
              value={fmtInt(activeMembers)}
              hint={`${fmtInt(memberTotal)} total contacts attached to community groups.`}
              accent="navy"
            />
            <MetricCard
              label="Coverage gaps"
              value={fmtInt(coverageGaps)}
              hint="Leader or co-leader holes that need reassignment."
              accent="orange"
            />
            <MetricCard
              label="Prayer backlog"
              value={fmtInt(prayerBacklog)}
              hint="Open prayer or response items currently surfaced."
              accent="orange"
            />
            <MetricCard
              label="Child-safe groups"
              value={fmtInt(childSafeGroups)}
              hint="Groups running stricter visibility and messaging defaults."
              accent="navy"
            />
          </div>

          <div className="grid gap-4 px-4 pb-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.95fr)_360px]">
            <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[14px] font-black text-slate-900">Community groups catalog</div>
                  <div className="mt-1 max-w-2xl text-[12px] text-slate-500">
                    Premium master library for discipleship circles, prayer communities, youth groups, family gatherings, and service-led communities.
                  </div>
                </div>
                <div className="inline-flex items-center gap-2">
                  <Pill>{fmtInt(filteredGroups.length)} groups</Pill>
                  <Pill>Command view</Pill>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_140px_160px]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search groups, leaders, tags, or keywords"
                    className="w-full rounded-2xl border border-slate-200 bg-[#fbfbfd] px-11 py-3 text-[13px] outline-none placeholder:text-slate-400 focus:border-slate-300"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "All" | GroupStatus)}
                  className="rounded-2xl border border-slate-200 bg-[#fbfbfd] px-4 py-3 text-[13px] font-semibold outline-none"
                >
                  <option value="All">All statuses</option>
                  <option value="Healthy">Healthy</option>
                  <option value="Needs coverage">Needs coverage</option>
                  <option value="Care risk">Care risk</option>
                  <option value="Draft">Draft</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as "All" | GroupType)}
                  className="rounded-2xl border border-slate-200 bg-[#fbfbfd] px-4 py-3 text-[13px] font-semibold outline-none"
                >
                  <option value="All">All group types</option>
                  <option value="Discipleship">Discipleship</option>
                  <option value="Prayer Circle">Prayer Circle</option>
                  <option value="Youth">Youth</option>
                  <option value="Women">Women</option>
                  <option value="Men">Men</option>
                  <option value="Family">Family</option>
                  <option value="Serving Team">Serving Team</option>
                </select>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {["All groups", "Discipleship", "Prayer", "Youth", "Family", "Child-safe", "Needs coverage"].map((chip) => (
                  <span
                    key={chip}
                    className={cx(
                      "rounded-full border px-3 py-1 text-[11px] font-bold",
                      chip === "Needs coverage"
                        ? "border-orange-200 bg-orange-50 text-orange-700"
                        : chip === "Child-safe"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-600",
                    )}
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-4 space-y-3">
                {filteredGroups.map((group) => {
                  const selected = selectedGroup.id === group.id;
                  const memberPct = pct(group.activeMembers, group.members);

                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => setSelectedGroupId(group.id)}
                      className={cx(
                        "w-full rounded-[24px] border p-3 text-left transition",
                        selected
                          ? "border-emerald-200 bg-[rgba(3,205,140,0.10)] shadow-sm"
                          : "border-slate-200 bg-white hover:bg-slate-50",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white shadow-sm">
                          <img src={group.heroUrl} alt={group.title} className="h-full w-full object-cover" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-[15px] font-black text-slate-900">
                                {group.title}
                              </div>
                              <div className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-slate-500">
                                {group.subtitle}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <GroupStatusPill status={group.status} />
                              <AccessPill access={group.access} />
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" />
                              {fmtInt(group.members)} members
                            </span>
                            <span>Ã¢â‚¬Â¢</span>
                            <span className="inline-flex items-center gap-1">
                              <CalendarClock className="h-3.5 w-3.5" />
                              {fmtLocal(group.upcomingISO)}
                            </span>
                            <span>Ã¢â‚¬Â¢</span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {group.campus}
                            </span>
                            <span>Ã¢â‚¬Â¢</span>
                            <span>{group.meetingMode}</span>
                          </div>

                          <div className="mt-3 grid gap-2 md:grid-cols-[1fr_128px_128px]">
                            <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                                  Member activity
                                </span>
                                <span className="text-[11px] font-bold text-slate-600">
                                  {memberPct}%
                                </span>
                              </div>
                              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: `${memberPct}%`, background: EV_GREEN }}
                                />
                              </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
                              <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                                Prayer queue
                              </div>
                              <div className="mt-1 text-[16px] font-black text-slate-900">
                                {group.prayerRequests}
                              </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
                              <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                                Care flags
                              </div>
                              <div className="mt-1 text-[16px] font-black text-slate-900">
                                {group.careEscalations}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {group.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-500"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[14px] font-black text-slate-900">Group health & care lane</div>
                    <div className="mt-1 text-[12px] text-slate-500">
                      Signals that tell leaders what needs action now and what is safe to leave alone.
                    </div>
                  </div>
                  <Pill tone={selectedGroup.status === "Healthy" ? "good" : selectedGroup.status === "Draft" ? "neutral" : "warn"}>
                    {selectedGroup.status === "Care risk" ? "Action now" : selectedGroup.status === "Needs coverage" ? "Coverage watch" : selectedGroup.status}
                  </Pill>
                </div>

                <div className="mt-4 space-y-2">
                  {selectedGroup.careSignals.map((signal) => (
                    <SignalCard key={signal.id} signal={signal} />
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-[14px] font-black text-slate-900">Rhythm, events, and linked ministry</div>
                <div className="mt-1 text-[12px] text-slate-500">
                  Calendar-aware rhythm items and linked follow-up moments from Live Sessionz, events, and noticeboard.
                </div>

                <div className="mt-4 space-y-2">
                  {selectedGroup.rhythm.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[13px] font-black text-slate-900">{item.label}</div>
                          <div className="mt-1 text-[11px] text-slate-500">{item.when}</div>
                        </div>
                        <Pill
                          tone={
                            item.state === "Ready"
                              ? "good"
                              : item.state === "Watch"
                                ? "warn"
                                : "neutral"
                          }
                        >
                          {item.state}
                        </Pill>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-2">
                  {selectedGroup.linkedLive ? (
                    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                      <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                        Linked live
                      </div>
                      <div className="mt-1 text-[13px] font-black text-slate-900">{selectedGroup.linkedLive}</div>
                    </div>
                  ) : null}

                  {selectedGroup.linkedSeries ? (
                    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                      <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                        Linked series
                      </div>
                      <div className="mt-1 text-[13px] font-black text-slate-900">{selectedGroup.linkedSeries}</div>
                    </div>
                  ) : null}

                  {selectedGroup.linkedEvent ? (
                    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                      <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                        Linked event
                      </div>
                      <div className="mt-1 text-[13px] font-black text-slate-900">{selectedGroup.linkedEvent}</div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-[14px] font-black text-slate-900">Cross-object hooks</div>
                <div className="mt-1 text-[12px] text-slate-500">
                  Noticeboard, prayer, event, and audience-system handoff points that make the group feel operationally complete.
                </div>

                <div className="mt-4 space-y-2">
                  {selectedGroup.hooks.map((hook) => (
                    <div
                      key={hook.id}
                      className="rounded-2xl border border-slate-200 bg-white px-3 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[13px] font-black text-slate-900">{hook.label}</div>
                          <div className="mt-1 text-[11px] leading-snug text-slate-500">{hook.hint}</div>
                        </div>
                        <Pill
                          tone={
                            hook.state === "Ready"
                              ? "good"
                              : hook.state === "Pending"
                                ? "warn"
                                : "neutral"
                          }
                        >
                          {hook.state}
                        </Pill>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[14px] font-black text-slate-900">Group destination preview</div>
                    <div className="mt-1 text-[12px] text-slate-500">
                      Persistent preview rail for the selected community destination, invite route, and care CTA.
                    </div>
                  </div>

                  <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
                    <button
                      type="button"
                      onClick={() => setPreviewMode("desktop")}
                      className={cx(
                        "rounded-full px-3 py-1 text-[11px] font-bold",
                        previewMode === "desktop" ? "bg-slate-900 text-white" : "text-slate-500",
                      )}
                    >
                      Desktop
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode("mobile")}
                      className={cx(
                        "rounded-full px-3 py-1 text-[11px] font-bold",
                        previewMode === "mobile" ? "bg-slate-900 text-white" : "text-slate-500",
                      )}
                    >
                      Mobile
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <GroupExperiencePreview group={selectedGroup} previewMode={previewMode} />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <ActionButton left={<Eye className="h-4 w-4" />} onClick={() => setPreviewOpen(true)}>
                    Open large preview
                  </ActionButton>
                  <ActionButton left={<Copy className="h-4 w-4" />}>Copy invite link</ActionButton>
                  <ActionButton left={<ExternalLink className="h-4 w-4" />}>Open live page</ActionButton>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-[14px] font-black text-slate-900">Community performance intelligence</div>
                <div className="mt-1 text-[12px] text-slate-500">
                  What this group is doing for discipleship, care, retention, and event/live follow-up.
                </div>

                <div className="mt-4 grid gap-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                    <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Attendance health</div>
                    <div className="mt-1 text-[18px] font-black text-slate-900">{selectedGroup.attendanceRate}%</div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      Average attendance versus active member base.
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                    <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Prayer & care pressure</div>
                    <div className="mt-1 text-[18px] font-black text-slate-900">
                      {selectedGroup.prayerRequests + selectedGroup.careEscalations}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      Combined prayer requests and escalations needing workflow attention.
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                    <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Content hooks live</div>
                    <div className="mt-1 text-[18px] font-black text-slate-900">
                      {selectedGroup.noticeboardPosts + selectedGroup.testimonies}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      Noticeboard and testimony surfaces currently enriching the group experience.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-t border-slate-200 px-4 py-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[14px] font-black text-slate-900">Quick-create templates</div>
                  <div className="mt-1 text-[12px] text-slate-500">
                    World-class group launch templates so Community Groups leads cleanly into a future builder flow.
                  </div>
                </div>
                <Pill tone="good">+ New Group lives here</Pill>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {TEMPLATE_CARDS.map((template) => (
                  <div
                    key={template.id}
                    className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div
                      className="h-1.5 w-14 rounded-full"
                      style={{
                        background:
                          template.accent === "orange"
                            ? EV_ORANGE
                            : template.accent === "navy"
                              ? EV_NAVY
                              : EV_GREEN,
                      }}
                    />
                    <div className="mt-3 text-[15px] font-black text-slate-900">{template.title}</div>
                    <div className="mt-1 text-[12px] leading-snug text-slate-500">
                      {template.subtitle}
                    </div>
                    <div className="mt-4">
                      <ActionButton left={<Wand2 className="h-4 w-4" />} onClick={() => safeNav(ROUTES.groupBuilder)}>
                        Use template
                      </ActionButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-[14px] font-black text-slate-900">Group network, collections & oversight</div>
              <div className="mt-1 text-[12px] text-slate-500">
                Keep community lanes organized by campus, type, safety level, and leader coverage while retaining a premium operations view.
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {NETWORK_LANES.map((lane) => (
                  <div
                    key={lane.id}
                    className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[14px] font-black text-slate-900">{lane.title}</div>
                        <div className="mt-1 text-[12px] leading-snug text-slate-500">{lane.subtitle}</div>
                      </div>
                      <Pill
                        tone={
                          lane.state === "Stable"
                            ? "good"
                            : lane.state === "Watch"
                              ? "warn"
                              : "neutral"
                        }
                      >
                        {lane.state}
                      </Pill>
                    </div>
                    <div className="mt-3 text-[12px] font-bold text-slate-600">
                      {lane.count} destinations
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="mx-4 mb-4 rounded-full px-6 py-1.5 text-center text-[12px] text-slate-600"
            style={{ background: "rgba(3,205,140,0.16)", border: "1px solid rgba(3,205,140,0.30)" }}
          >
            Concept preview of the generated FaithHub Community Groups page Ã‚Â· EVzone Green primary (#03cd8c) Ã‚Â· Orange secondary (#f77f00)
          </div>
        </div>
      </div>

      <Drawer
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="FH-P-100 Ã‚Â· Community Groups Ã‚Â· Large preview"
        subtitle="Premium preview of the selected group destination, care signals, and invite experience."
      >
        <GroupExperiencePreviewInner group={selectedGroup} previewMode={previewMode} />
      </Drawer>
    </div>
  );
}

