// @ts-nocheck
"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  Bell,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  Filter,
  HeartHandshake,
  LayoutGrid,
  Link2,
  MapPin,
  Megaphone,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users2,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { handleRawPlaceholderAction } from "./placeholderActions";

/**
 * FaithHub — FH-P-106 Projects
 * ----------------------------
 * Premium Provider-side operating surface for community missions, outreach drives,
 * volunteer mobilization, build projects, charity actions, and progress tracking.
 *
 * Design goals
 * - Keep the same premium provider grammar used across the FaithHub build:
 *   command hero, KPI strip, search/filter workspace, command catalog, progress lanes,
 *   cross-object hooks, and a persistent desktop/mobile destination preview rail.
 * - Use EVzone Green as the primary accent and Orange as the secondary accent.
 * - Treat projects as first-class ministry objects that can connect to giving,
 *   charity crowdfunding, Live Sessions, Events, Noticeboard, Audience journeys, and Beacon.
 * - Surface the requested primary CTAs clearly:
 *   + New Project, Add Milestone, Recruit Team.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#16244c";

const ROUTES = {
  providerDashboard: "/faithhub/provider/dashboard",
  noticeboard: "/faithhub/provider/noticeboard",
  audienceNotifications: "/faithhub/provider/audience-notifications",
  beaconBuilder: "/faithhub/provider/beacon-builder",
  donationsFunds: "/faithhub/provider/donations-funds",
  charityCrowdfund: "/faithhub/provider/charity-crowdfunding-workbench",
  liveBuilder: "/faithhub/provider/live-builder",
  eventsManager: "/faithhub/provider/events-manager",
  newProject: "/faithhub/provider/projects/new",
};

const HERO_1 =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80";
const HERO_2 =
  "https://images.unsplash.com/photo-1469571486292-b53601012c16?auto=format&fit=crop&w=1600&q=80";
const HERO_3 =
  "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1600&q=80";
const HERO_4 =
  "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1600&q=80";

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  if (typeof window === "undefined") return;
  window.location.assign(url);
}

function fmtInt(n: number) {
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function money(n: number, currency = "£") {
  return `${currency}${Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(n)}`;
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

type PreviewMode = "desktop" | "mobile";
type ProjectType =
  | "Mission trip"
  | "Outreach"
  | "Volunteer drive"
  | "Build project"
  | "Charity action"
  | "Care response";

type ProjectStatus =
  | "Active"
  | "Planning"
  | "Needs recruitment"
  | "At risk"
  | "Completed";

type FundingMode = "Self-funded" | "Fund-linked" | "Crowdfund-linked";
type HookState = "Ready" | "Pending" | "Watch";
type MilestoneState = "Done" | "Ready" | "Watch" | "Late";

type ProjectMetricCard = {
  id: string;
  label: string;
  value: string;
  hint: string;
  accent?: "green" | "orange" | "navy";
};

type ProjectMilestone = {
  id: string;
  label: string;
  dueISO: string;
  owner: string;
  state: MilestoneState;
};

type TeamRole = {
  id: string;
  label: string;
  shift: string;
  needed: number;
  filled: number;
};

type ProjectHook = {
  id: string;
  label: string;
  hint: string;
  state: HookState;
};

type ProjectSignal = {
  id: string;
  label: string;
  hint: string;
  tone: "good" | "warn" | "danger";
};

type ProjectRecord = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  fundingMode: FundingMode;
  heroUrl: string;
  campus: string;
  owner: string;
  language: string[];
  startISO: string;
  endISO: string;
  volunteersNeeded: number;
  volunteersFilled: number;
  volunteerHours: number;
  beneficiaries: number;
  budget: number;
  raised: number;
  prayerRequests: number;
  linkedLive?: string;
  linkedEvent?: string;
  linkedCrowdfund?: string;
  linkedBeacon?: string;
  tags: string[];
  signals: ProjectSignal[];
  milestones: ProjectMilestone[];
  teamRoles: TeamRole[];
  hooks: ProjectHook[];
};

const TEMPLATE_CARDS = [
  {
    id: "tpl-outreach",
    title: "Community outreach day",
    subtitle:
      "Neighbourhood activation with volunteers, logistics, noticeboard publishing, and follow-up journeys.",
    accent: "green" as const,
  },
  {
    id: "tpl-charity",
    title: "Charity action",
    subtitle:
      "Story-first project tied to giving or crowdfunding, impact proof, and Beacon-ready promotion.",
    accent: "orange" as const,
  },
  {
    id: "tpl-build",
    title: "Build project",
    subtitle:
      "Multi-milestone facility work with vendor notes, risk flags, and funding visibility.",
    accent: "navy" as const,
  },
  {
    id: "tpl-volunteer",
    title: "Volunteer drive",
    subtitle:
      "Recruit, assign, and retain volunteers around a project, event, or ongoing community initiative.",
    accent: "green" as const,
  },
];

const NETWORK_LANES = [
  {
    id: "lane-missions",
    title: "Mission & outreach lane",
    subtitle: "Projects aimed at local impact, evangelism, and community presence.",
    count: 7,
    state: "Active",
  },
  {
    id: "lane-charity",
    title: "Charity & response lane",
    subtitle: "Relief actions, donor-sensitive initiatives, and beneficiary reporting.",
    count: 4,
    state: "Growing",
  },
  {
    id: "lane-build",
    title: "Build & upgrade lane",
    subtitle: "Campus repair, studio upgrades, classrooms, and equipment procurement.",
    count: 5,
    state: "Watch",
  },
  {
    id: "lane-volunteer",
    title: "Volunteer mobilization lane",
    subtitle: "Recruitment-led projects with team assignments and roster pressure visibility.",
    count: 8,
    state: "Stable",
  },
];

const INITIAL_PROJECTS: ProjectRecord[] = [
  {
    id: "PRJ-401",
    title: "Flood Relief Weekend Response",
    subtitle:
      "Rapid-response charity action for affected families with donation and volunteer mobilization in one flow.",
    description:
      "Coordinate emergency supplies, volunteers, prayer coverage, and update publishing while keeping donor trust and proof-of-impact visible.",
    type: "Charity action",
    status: "Active",
    fundingMode: "Crowdfund-linked",
    heroUrl: HERO_1,
    campus: "Kampala Central",
    owner: "Mercy Team Office",
    language: ["English", "Luganda"],
    startISO: "2026-04-18T09:00:00Z",
    endISO: "2026-04-28T17:30:00Z",
    volunteersNeeded: 42,
    volunteersFilled: 31,
    volunteerHours: 216,
    beneficiaries: 187,
    budget: 18500,
    raised: 13240,
    prayerRequests: 18,
    linkedLive: "Relief Prayer & Giving Moment",
    linkedEvent: "Weekend Distribution Run",
    linkedCrowdfund: "Flood Relief Fund",
    linkedBeacon: "Relief Awareness Push",
    tags: ["relief", "families", "donation", "volunteer", "field updates"],
    signals: [
      {
        id: "sig-relief-1",
        label: "Volunteer recruitment slightly behind target",
        hint: "11 roles still open for distribution day and logistics coverage.",
        tone: "warn",
      },
      {
        id: "sig-relief-2",
        label: "Crowdfund momentum remains healthy",
        hint: "Daily donor movement is ahead of last week’s forecast.",
        tone: "good",
      },
      {
        id: "sig-relief-3",
        label: "Proof-of-impact update due today",
        hint: "Publish new field photos and beneficiary notes before evening reminder sends.",
        tone: "danger",
      },
    ],
    milestones: [
      {
        id: "ms-relief-1",
        label: "Field verification & beneficiary list lock",
        dueISO: "2026-04-20T12:00:00Z",
        owner: "Care Ops",
        state: "Done",
      },
      {
        id: "ms-relief-2",
        label: "Publish distribution update with proof gallery",
        dueISO: "2026-04-22T16:00:00Z",
        owner: "Comms Lead",
        state: "Ready",
      },
      {
        id: "ms-relief-3",
        label: "Weekend distribution team briefing",
        dueISO: "2026-04-23T18:30:00Z",
        owner: "Volunteer Lead",
        state: "Watch",
      },
      {
        id: "ms-relief-4",
        label: "Final impact closeout and donor thank-you",
        dueISO: "2026-04-29T10:00:00Z",
        owner: "Finance + Care",
        state: "Late",
      },
    ],
    teamRoles: [
      {
        id: "role-relief-1",
        label: "Distribution volunteers",
        shift: "Sat · 08:00–15:00",
        needed: 24,
        filled: 18,
      },
      {
        id: "role-relief-2",
        label: "Prayer response desk",
        shift: "Thu–Sat · rotating",
        needed: 8,
        filled: 7,
      },
      {
        id: "role-relief-3",
        label: "Transport & loading",
        shift: "Fri · 15:00–20:00",
        needed: 10,
        filled: 6,
      },
    ],
    hooks: [
      {
        id: "hook-relief-1",
        label: "Noticeboard",
        hint: "Emergency updates and volunteer instructions are ready to publish.",
        state: "Ready",
      },
      {
        id: "hook-relief-2",
        label: "Audience journey",
        hint: "Reminder sequence needs a final approval before launch.",
        state: "Pending",
      },
      {
        id: "hook-relief-3",
        label: "Beacon promotion",
        hint: "Relief awareness campaign linked to the crowdfund destination.",
        state: "Ready",
      },
      {
        id: "hook-relief-4",
        label: "Live Sessions",
        hint: "Weekend relief prayer moment is attached to this project.",
        state: "Watch",
      },
    ],
  },
  {
    id: "PRJ-402",
    title: "Youth Outreach School Drive",
    subtitle:
      "A multi-campus outreach push combining invitations, supplies, volunteers, and post-event testimonies.",
    description:
      "Coordinate school visits, audience targeting, prayer support, volunteer coverage, and follow-up pathways into youth groups and event journeys.",
    type: "Outreach",
    status: "Needs recruitment",
    fundingMode: "Fund-linked",
    heroUrl: HERO_2,
    campus: "East Campus",
    owner: "Youth Ministries",
    language: ["English", "Swahili"],
    startISO: "2026-05-03T08:30:00Z",
    endISO: "2026-05-11T18:00:00Z",
    volunteersNeeded: 28,
    volunteersFilled: 13,
    volunteerHours: 94,
    beneficiaries: 340,
    budget: 7200,
    raised: 4980,
    prayerRequests: 9,
    linkedLive: "Youth Prayer Night",
    linkedEvent: "School Outreach Day",
    linkedBeacon: "Youth Invitation Campaign",
    tags: ["schools", "youth", "invitations", "outreach", "follow-up"],
    signals: [
      {
        id: "sig-youth-1",
        label: "Recruitment gap is the main risk right now",
        hint: "The project needs 15 more volunteers across media, transport, and follow-up.",
        tone: "danger",
      },
      {
        id: "sig-youth-2",
        label: "Audience targeting signals are strong",
        hint: "Notification segments for students and parents are already prepared.",
        tone: "good",
      },
      {
        id: "sig-youth-3",
        label: "Asset pack still incomplete",
        hint: "Invite cards and parent-facing FAQ sheet need final upload.",
        tone: "warn",
      },
    ],
    milestones: [
      {
        id: "ms-youth-1",
        label: "Approve school visit schedule",
        dueISO: "2026-04-30T14:00:00Z",
        owner: "Outreach Admin",
        state: "Ready",
      },
      {
        id: "ms-youth-2",
        label: "Recruit and assign campus volunteers",
        dueISO: "2026-05-01T17:00:00Z",
        owner: "Volunteer Lead",
        state: "Late",
      },
      {
        id: "ms-youth-3",
        label: "Publish family-facing noticeboard update",
        dueISO: "2026-05-02T09:30:00Z",
        owner: "Comms Lead",
        state: "Watch",
      },
    ],
    teamRoles: [
      {
        id: "role-youth-1",
        label: "Campus ambassadors",
        shift: "Mon–Thu · afternoon",
        needed: 12,
        filled: 6,
      },
      {
        id: "role-youth-2",
        label: "Transport volunteers",
        shift: "Project week · daily",
        needed: 8,
        filled: 3,
      },
      {
        id: "role-youth-3",
        label: "Follow-up callers",
        shift: "After each visit",
        needed: 8,
        filled: 4,
      },
    ],
    hooks: [
      {
        id: "hook-youth-1",
        label: "Audience notifications",
        hint: "Parent and youth reminder journeys are ready to activate.",
        state: "Ready",
      },
      {
        id: "hook-youth-2",
        label: "Beacon",
        hint: "Invitation creative exists but still needs budget approval.",
        state: "Pending",
      },
      {
        id: "hook-youth-3",
        label: "Events",
        hint: "Check-in mode can be activated for the final youth rally.",
        state: "Ready",
      },
      {
        id: "hook-youth-4",
        label: "Noticeboard",
        hint: "FAQ post for volunteers still needs one more review.",
        state: "Watch",
      },
    ],
  },
  {
    id: "PRJ-403",
    title: "Live Studio Equipment Upgrade",
    subtitle:
      "A build project focused on cameras, sound treatment, and production readiness for future Live Sessions.",
    description:
      "Track procurement, approvals, campus logistics, and phased milestone completion while linking updates to giving and provider operations.",
    type: "Build project",
    status: "Planning",
    fundingMode: "Fund-linked",
    heroUrl: HERO_3,
    campus: "Online Studio",
    owner: "Production Office",
    language: ["English"],
    startISO: "2026-05-20T10:00:00Z",
    endISO: "2026-06-30T18:30:00Z",
    volunteersNeeded: 9,
    volunteersFilled: 7,
    volunteerHours: 38,
    beneficiaries: 0,
    budget: 28500,
    raised: 11400,
    prayerRequests: 3,
    linkedLive: "Studio Vision Live",
    linkedCrowdfund: "Studio Upgrade Push",
    linkedBeacon: "Support the Studio Campaign",
    tags: ["studio", "build", "equipment", "sound", "broadcast"],
    signals: [
      {
        id: "sig-studio-1",
        label: "Budget still below phase-one threshold",
        hint: "The project has not yet crossed the first procurement unlock.",
        tone: "warn",
      },
      {
        id: "sig-studio-2",
        label: "Vendor shortlist is ready",
        hint: "Three approved equipment vendors are already attached.",
        tone: "good",
      },
      {
        id: "sig-studio-3",
        label: "Timeline risk is currently low",
        hint: "No known staffing or logistics clashes this month.",
        tone: "good",
      },
    ],
    milestones: [
      {
        id: "ms-studio-1",
        label: "Finalize equipment shortlist",
        dueISO: "2026-05-23T15:00:00Z",
        owner: "Production Lead",
        state: "Ready",
      },
      {
        id: "ms-studio-2",
        label: "Phase-one funding threshold",
        dueISO: "2026-05-29T20:00:00Z",
        owner: "Finance Office",
        state: "Watch",
      },
      {
        id: "ms-studio-3",
        label: "Install and sound-check main room",
        dueISO: "2026-06-16T11:00:00Z",
        owner: "Studio Ops",
        state: "Ready",
      },
    ],
    teamRoles: [
      {
        id: "role-studio-1",
        label: "Equipment reviewers",
        shift: "Planning phase",
        needed: 3,
        filled: 3,
      },
      {
        id: "role-studio-2",
        label: "Install support volunteers",
        shift: "Launch week",
        needed: 6,
        filled: 4,
      },
    ],
    hooks: [
      {
        id: "hook-studio-1",
        label: "Giving",
        hint: "Support campaign is linked to the studio fund destination.",
        state: "Ready",
      },
      {
        id: "hook-studio-2",
        label: "Live Sessions",
        hint: "A behind-the-scenes live update is planned for launch week.",
        state: "Watch",
      },
      {
        id: "hook-studio-3",
        label: "Beacon",
        hint: "Promotion hooks are prepared for milestone achievements.",
        state: "Ready",
      },
      {
        id: "hook-studio-4",
        label: "Noticeboard",
        hint: "Operations bulletin still needs a launch date.",
        state: "Pending",
      },
    ],
  },
  {
    id: "PRJ-404",
    title: "Community Counseling Intake Sprint",
    subtitle:
      "A care-response project to tighten intake coverage, privacy handling, scheduling, and referral follow-up.",
    description:
      "Reduce backlog and improve pastoral care routing by recruiting case responders, updating safeguards, and publishing the right intake signals.",
    type: "Care response",
    status: "At risk",
    fundingMode: "Self-funded",
    heroUrl: HERO_4,
    campus: "Kampala Central",
    owner: "Pastoral Care",
    language: ["English", "Luganda"],
    startISO: "2026-04-14T08:00:00Z",
    endISO: "2026-04-30T17:30:00Z",
    volunteersNeeded: 12,
    volunteersFilled: 8,
    volunteerHours: 72,
    beneficiaries: 58,
    budget: 2400,
    raised: 2400,
    prayerRequests: 22,
    linkedEvent: "Care Team Training Day",
    tags: ["care", "counseling", "safeguards", "intake", "follow-up"],
    signals: [
      {
        id: "sig-care-1",
        label: "Case backlog remains above target",
        hint: "Follow-up turnaround is still outside the desired service window.",
        tone: "danger",
      },
      {
        id: "sig-care-2",
        label: "Safeguard policies are current",
        hint: "Moderation and child-safe defaults are already synced.",
        tone: "good",
      },
      {
        id: "sig-care-3",
        label: "Need one more trained scheduler",
        hint: "Shift coverage is thin for the next two weeks.",
        tone: "warn",
      },
    ],
    milestones: [
      {
        id: "ms-care-1",
        label: "Finalize intake routing rules",
        dueISO: "2026-04-19T10:00:00Z",
        owner: "Care Ops",
        state: "Done",
      },
      {
        id: "ms-care-2",
        label: "Recruit and train support schedulers",
        dueISO: "2026-04-22T16:30:00Z",
        owner: "Counseling Lead",
        state: "Late",
      },
      {
        id: "ms-care-3",
        label: "Publish confidential intake reminder",
        dueISO: "2026-04-23T09:00:00Z",
        owner: "Comms Lead",
        state: "Watch",
      },
    ],
    teamRoles: [
      {
        id: "role-care-1",
        label: "Care responders",
        shift: "Daily rotation",
        needed: 6,
        filled: 5,
      },
      {
        id: "role-care-2",
        label: "Schedulers",
        shift: "Weekday admin",
        needed: 3,
        filled: 1,
      },
      {
        id: "role-care-3",
        label: "Prayer support",
        shift: "On-call",
        needed: 3,
        filled: 2,
      },
    ],
    hooks: [
      {
        id: "hook-care-1",
        label: "Prayer Requests",
        hint: "Escalation path is already linked into care intake.",
        state: "Ready",
      },
      {
        id: "hook-care-2",
        label: "Counseling",
        hint: "Case workspace is synced, but staffing coverage is thin.",
        state: "Watch",
      },
      {
        id: "hook-care-3",
        label: "Noticeboard",
        hint: "A confidential intake reminder can be published today.",
        state: "Ready",
      },
      {
        id: "hook-care-4",
        label: "Audience",
        hint: "No mass campaign needed; use careful opt-in communications only.",
        state: "Pending",
      },
    ],
  },
];

function toneForStatus(status: ProjectStatus) {
  if (status === "Active") return "good" as const;
  if (status === "Planning") return "neutral" as const;
  if (status === "Needs recruitment") return "warn" as const;
  if (status === "At risk") return "danger" as const;
  return "navy" as const;
}

function toneForHookState(state: HookState) {
  if (state === "Ready") return "good" as const;
  if (state === "Pending") return "warn" as const;
  return "danger" as const;
}

function toneForMilestoneState(state: MilestoneState) {
  if (state === "Done") return "good" as const;
  if (state === "Ready") return "good" as const;
  if (state === "Watch") return "warn" as const;
  return "danger" as const;
}

function accentColor(accent?: "green" | "orange" | "navy") {
  if (accent === "orange") return EV_ORANGE;
  if (accent === "navy") return EV_NAVY;
  return EV_GREEN;
}

function Pill({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "good" | "warn" | "danger" | "brand" | "navy";
  children: React.ReactNode;
}) {
  const cls =
    tone === "good"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
      : tone === "warn"
        ? "bg-amber-50 text-amber-900 ring-amber-200"
        : tone === "danger"
          ? "bg-rose-50 text-rose-800 ring-rose-200"
          : tone === "brand"
            ? "text-white"
            : tone === "navy"
              ? "bg-indigo-50 text-indigo-900 ring-indigo-200"
              : "bg-white text-slate-700 ring-slate-200";
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1",
        cls,
      )}
      style={tone === "brand" ? { background: EV_GREEN } : undefined}
    >
      {children}
    </span>
  );
}

function SoftButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-[12px] font-bold text-slate-800 transition hover:bg-slate-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

function PrimaryButton({
  children,
  onClick,
  color = EV_GREEN,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  color?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl border border-transparent px-4 py-2 text-[12px] font-black text-white transition hover:opacity-95",
        className,
      )}
      style={{ background: color }}
    >
      {children}
    </button>
  );
}

function Card({
  title,
  subtitle,
  right,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[14px] font-black text-slate-900">{title}</div>
          {subtitle ? (
            <div className="mt-1 text-[12px] leading-5 text-slate-500">
              {subtitle}
            </div>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function MetricTile({ item }: { item: ProjectMetricCard }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
            {item.label}
          </div>
          <div className="mt-2 text-[20px] font-black text-slate-900">
            {item.value}
          </div>
        </div>
        <div
          className="h-10 w-10 rounded-full"
          style={{ background: accentColor(item.accent), opacity: 0.15 }}
        />
      </div>
      <div className="mt-2 text-[12px] leading-5 text-slate-500">{item.hint}</div>
    </div>
  );
}

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search projects, owners, campuses, tags, or milestones"
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-[13px] font-semibold text-slate-700 outline-none transition focus:border-emerald-300 focus:bg-white"
      />
    </div>
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
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-5xl overflow-hidden bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <div className="truncate text-[14px] font-black text-slate-900">{title}</div>
            {subtitle ? (
              <div className="mt-1 truncate text-[12px] text-slate-500">{subtitle}</div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="h-[calc(100%-73px)] overflow-y-auto p-5">{children}</div>
      </aside>
    </div>
  );
}

function ProjectDestinationPreview({
  project,
  previewMode,
}: {
  project: ProjectRecord;
  previewMode: PreviewMode;
}) {
  const desktop = previewMode === "desktop";
  const fundingPct = pct(project.raised, project.budget);
  const volunteerPct = pct(project.volunteersFilled, project.volunteersNeeded);
  const widthClass = desktop ? "max-w-[400px]" : "max-w-[360px]";

  return (
    <div
      className={cx(
        "mx-auto rounded-[32px] border border-slate-200 bg-white p-3 shadow-sm",
        widthClass,
      )}
    >
      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            {desktop ? "Desktop project preview" : "Mobile project preview"}
          </div>
          <Pill tone={toneForStatus(project.status)}>{project.status}</Pill>
        </div>

        <div className="relative overflow-hidden rounded-[20px]">
          <img
            src={project.heroUrl}
            alt={project.title}
            className={cx(
              "w-full object-cover",
              desktop ? "h-44" : "h-52",
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/10 to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <Pill tone="brand">{project.type}</Pill>
            {project.linkedCrowdfund ? <Pill tone="warn">Giving-linked</Pill> : null}
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/80">
              Project destination
            </div>
            <div className="mt-1 text-[22px] font-black leading-tight text-white">
              {project.title}
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-[20px] border border-slate-200 bg-white p-3">
          <div className="text-[15px] font-black text-slate-900">{project.title}</div>
          <div className="mt-1 text-[12px] leading-5 text-slate-500">{project.subtitle}</div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <span>{fmtLocal(project.startISO)}</span>
            <span>•</span>
            <span>{project.campus}</span>
            <span>•</span>
            <span>{project.language.join(" + ")}</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
                Funding progress
              </div>
              <div className="mt-1 text-[15px] font-black text-slate-900">
                {money(project.raised)} / {money(project.budget)}
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${fundingPct}%`, background: EV_GREEN }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
                Volunteer coverage
              </div>
              <div className="mt-1 text-[15px] font-black text-slate-900">
                {project.volunteersFilled}/{project.volunteersNeeded}
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${volunteerPct}%`, background: EV_ORANGE }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
              Next milestones
            </div>
            <div className="mt-2 space-y-2">
              {project.milestones.slice(0, 3).map((milestone) => (
                <div
                  key={milestone.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 text-[13px] font-bold text-slate-900 truncate">
                      {milestone.label}
                    </div>
                    <Pill tone={toneForMilestoneState(milestone.state)}>{milestone.state}</Pill>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    {fmtLocal(milestone.dueISO)} • {milestone.owner}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <PrimaryButton color={EV_GREEN}>
              <Users2 className="h-4 w-4" />
              Join team
            </PrimaryButton>
            <SoftButton>
              <HeartHandshake className="h-4 w-4" />
              Give now
            </SoftButton>
            <SoftButton>
              <ExternalLink className="h-4 w-4" />
              Share update
            </SoftButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  selected,
  onSelect,
}: {
  project: ProjectRecord;
  selected: boolean;
  onSelect: () => void;
}) {
  const volunteerPct = pct(project.volunteersFilled, project.volunteersNeeded);
  const fundingPct = pct(project.raised, project.budget);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cx(
        "w-full rounded-[24px] border px-4 py-4 text-left transition",
        selected
          ? "border-emerald-300 bg-emerald-50/60"
          : "border-slate-200 bg-white hover:bg-slate-50",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className="grid h-16 w-16 shrink-0 place-items-center rounded-[18px] text-white"
          style={{
            background:
              project.type === "Charity action"
                ? EV_ORANGE
                : project.type === "Build project"
                  ? EV_NAVY
                  : EV_GREEN,
          }}
        >
          <div className="text-[11px] font-black uppercase tracking-[0.1em]">
            {project.type.split(" ")[0]}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[13px] font-black text-slate-900">{project.title}</div>
              <div className="mt-1 line-clamp-2 text-[12px] leading-5 text-slate-500">
                {project.subtitle}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Pill tone={toneForStatus(project.status)}>{project.status}</Pill>
              <Pill>{project.fundingMode}</Pill>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <span>{project.type}</span>
            <span>•</span>
            <span>{project.campus}</span>
            <span>•</span>
            <span>{project.owner}</span>
            <span>•</span>
            <span>{project.language.join(" + ")}</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
                Volunteers
              </div>
              <div className="mt-1 text-[14px] font-black text-slate-900">
                {project.volunteersFilled}/{project.volunteersNeeded}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
                Raised
              </div>
              <div className="mt-1 text-[14px] font-black text-slate-900">
                {money(project.raised)}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
                Beneficiaries
              </div>
              <div className="mt-1 text-[14px] font-black text-slate-900">
                {fmtInt(project.beneficiaries)}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
                Prayer backlog
              </div>
              <div className="mt-1 text-[14px] font-black text-slate-900">
                {project.prayerRequests}
              </div>
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>Volunteer coverage</span>
                <span>{volunteerPct}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${volunteerPct}%`, background: EV_ORANGE }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>Funding progress</span>
                <span>{fundingPct}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${fundingPct}%`, background: EV_GREEN }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {project.tags.slice(0, 4).map((tag) => (
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
}

function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState(INITIAL_PROJECTS[0].id);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ProjectStatus>("All");
  const [typeFilter, setTypeFilter] = useState<"All" | ProjectType>("All");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [milestoneOpen, setMilestoneOpen] = useState(false);
  const [recruitOpen, setRecruitOpen] = useState(false);

  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDue, setMilestoneDue] = useState("2026-05-05T18:00");
  const [milestoneOwner, setMilestoneOwner] = useState("Project Lead");
  const [milestoneState, setMilestoneState] = useState<MilestoneState>("Ready");

  const [roleLabel, setRoleLabel] = useState("");
  const [roleShift, setRoleShift] = useState("Sat · 09:00–14:00");
  const [roleNeeded, setRoleNeeded] = useState("6");
  const [roleFilled, setRoleFilled] = useState("0");
  const [publishToAudience, setPublishToAudience] = useState(true);

  const metrics = useMemo<ProjectMetricCard[]>(() => {
    const active = projects.filter((p) => p.status === "Active").length;
    const planning = projects.filter((p) => p.status === "Planning").length;
    const atRisk = projects.filter(
      (p) => p.status === "At risk" || p.status === "Needs recruitment",
    ).length;
    const totalVolunteersNeeded = projects.reduce(
      (sum, p) => sum + p.volunteersNeeded,
      0,
    );
    const totalVolunteersFilled = projects.reduce(
      (sum, p) => sum + p.volunteersFilled,
      0,
    );
    const totalRaised = projects.reduce((sum, p) => sum + p.raised, 0);
    const totalBeneficiaries = projects.reduce(
      (sum, p) => sum + p.beneficiaries,
      0,
    );
    const totalHours = projects.reduce((sum, p) => sum + p.volunteerHours, 0);

    return [
      {
        id: "active",
        label: "Active projects",
        value: String(active),
        hint: "Projects currently in motion across outreach, charity, and build operations.",
        accent: "green",
      },
      {
        id: "planning",
        label: "Planning lane",
        value: String(planning),
        hint: "Projects preparing assets, approvals, teams, or funding before launch.",
        accent: "navy",
      },
      {
        id: "volunteers",
        label: "Volunteer coverage",
        value: `${totalVolunteersFilled}/${totalVolunteersNeeded}`,
        hint: "Open project roles and assigned community coverage across current initiatives.",
        accent: "orange",
      },
      {
        id: "raised",
        label: "Funds mobilized",
        value: money(totalRaised),
        hint: "Combined raised amount across fund-linked and crowdfund-linked projects.",
        accent: "green",
      },
      {
        id: "beneficiaries",
        label: "People impacted",
        value: fmtInt(totalBeneficiaries),
        hint: "Estimated beneficiaries, recipients, or directly served community members.",
        accent: "orange",
      },
      {
        id: "risk",
        label: "Needs action",
        value: String(atRisk),
        hint: `Project hours logged this cycle: ${fmtInt(totalHours)}. At-risk initiatives need attention now.`,
        accent: "navy",
      },
    ];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.subtitle.toLowerCase().includes(q) ||
        project.owner.toLowerCase().includes(q) ||
        project.campus.toLowerCase().includes(q) ||
        project.tags.join(" ").toLowerCase().includes(q) ||
        project.milestones.some((m) => m.label.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "All" || project.status === statusFilter;
      const matchesType = typeFilter === "All" || project.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [projects, search, statusFilter, typeFilter]);

  const selectedProject =
    filteredProjects.find((project) => project.id === selectedProjectId) ||
    projects.find((project) => project.id === selectedProjectId) ||
    filteredProjects[0] ||
    projects[0];

  const milestoneDueNow = useMemo(() => {
    if (!selectedProject) return [];
    return selectedProject.milestones.slice(0, 4);
  }, [selectedProject]);

  const projectSignals = selectedProject?.signals || [];
  const totalHookReady = (selectedProject?.hooks || []).filter(
    (hook) => hook.state === "Ready",
  ).length;

  const allTypes: Array<"All" | ProjectType> = [
    "All",
    "Mission trip",
    "Outreach",
    "Volunteer drive",
    "Build project",
    "Charity action",
    "Care response",
  ];

  const addMilestone = () => {
    if (!selectedProject || !milestoneTitle.trim()) return;
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== selectedProject.id) return project;
        return {
          ...project,
          milestones: [
            {
              id: `ms-${Date.now()}`,
              label: milestoneTitle.trim(),
              dueISO: new Date(milestoneDue).toISOString(),
              owner: milestoneOwner || "Project Lead",
              state: milestoneState,
            },
            ...project.milestones,
          ],
        };
      }),
    );
    setMilestoneOpen(false);
    setMilestoneTitle("");
    setMilestoneOwner("Project Lead");
    setMilestoneState("Ready");
  };

  const recruitRole = () => {
    if (!selectedProject || !roleLabel.trim()) return;
    const needed = Math.max(1, parseInt(roleNeeded || "1", 10));
    const filled = Math.max(0, parseInt(roleFilled || "0", 10));

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== selectedProject.id) return project;
        return {
          ...project,
          volunteersNeeded: project.volunteersNeeded + needed,
          volunteersFilled: project.volunteersFilled + filled,
          teamRoles: [
            {
              id: `role-${Date.now()}`,
              label: roleLabel.trim(),
              shift: roleShift || "Project shift",
              needed,
              filled,
            },
            ...project.teamRoles,
          ],
          hooks: publishToAudience
            ? [
                {
                  id: `hook-${Date.now()}`,
                  label: "Audience recruitment",
                  hint: `Recruitment prompt prepared for ${roleLabel.trim()}.`,
                  state: "Pending",
                },
                ...project.hooks,
              ]
            : project.hooks,
        };
      }),
    );

    setRecruitOpen(false);
    setRoleLabel("");
    setRoleShift("Sat · 09:00–14:00");
    setRoleNeeded("6");
    setRoleFilled("0");
    setPublishToAudience(true);
  };

  if (!selectedProject) return null;

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-slate-900">
      <div className="mx-auto max-w-[1600px] px-5 py-5">
        <div className="space-y-4">
          {/* Hero */}
          <div className="rounded-[34px] border border-slate-200 bg-white px-5 py-5 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Community impact & operations
                </div>
                <div className="mt-1 flex items-center gap-3">
                  <div
                    className="grid h-12 w-12 place-items-center rounded-2xl text-white shadow-sm"
                    style={{ background: EV_GREEN }}
                  >
                    <Workflow className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-[22px] font-black leading-tight text-slate-900">
                      FH-P-106 · Projects
                    </div>
                    <div className="mt-1 max-w-3xl text-[14px] leading-6 text-slate-500">
                      Premium command page for missions, outreach, volunteer drives, build projects,
                      charity actions, and impact progress — tightly linked to giving, audience journeys,
                      Beacon promotion, Live Sessions, and events.
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Pill tone="brand">Community impact</Pill>
                  <Pill>Giving-linked</Pill>
                  <Pill>Beacon-ready</Pill>
                  <Pill>Volunteer-led</Pill>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                <SoftButton onClick={() => setPreviewOpen(true)}>
                  <Eye className="h-4 w-4" />
                  Preview
                </SoftButton>
                <SoftButton onClick={() => setMilestoneOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Add Milestone
                </SoftButton>
                <SoftButton onClick={() => setRecruitOpen(true)}>
                  <Users2 className="h-4 w-4" />
                  Recruit Team
                </SoftButton>
                <PrimaryButton onClick={() => safeNav(ROUTES.newProject)}>
                  <Plus className="h-4 w-4" />
                  + New Project
                </PrimaryButton>
              </div>
            </div>
          </div>

          {/* Pulse strip */}
          <div className="rounded-[26px] border border-slate-200 bg-white px-5 py-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3 text-[13px] text-slate-500">
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em]"
                  style={{
                    color: EV_ORANGE,
                    borderColor: "#fed7aa",
                    background: "#fff7ed",
                  }}
                >
                  Project operations pulse
                </span>
                <span>
                  2 projects need volunteer reinforcement
                </span>
                <span>•</span>
                <span>
                  1 charity action is ready for Beacon amplification
                </span>
                <span>•</span>
                <span>
                  3 milestones are due within the next 48 hours
                </span>
              </div>
              <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                Premium community projects
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {metrics.map((item) => (
              <MetricTile key={item.id} item={item} />
            ))}
          </div>

          {/* Main command layout */}
          <div className="grid grid-cols-12 gap-4">
            {/* Left catalog */}
            <div className="col-span-12 xl:col-span-6 space-y-4">
              <Card
                title="Projects command catalog"
                subtitle="Search, filter, and operate every community project from one premium portfolio surface."
                right={<Pill>{filteredProjects.length} projects</Pill>}
              >
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 lg:flex-row">
                    <SearchInput value={search} onChange={setSearch} />
                    <div className="flex gap-2">
                      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-[12px] font-bold text-slate-500">
                        <Filter className="h-4 w-4" />
                      </div>
                      <div className="min-w-[170px] rounded-2xl border border-slate-200 bg-white px-3 py-3">
                        <div className="flex items-center justify-between gap-2 text-[12px] font-bold text-slate-700">
                          {statusFilter}
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(["All", "Active", "Planning", "Needs recruitment", "At risk", "Completed"] as Array<
                      "All" | ProjectStatus
                    >).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setStatusFilter(status)}
                        className={cx(
                          "rounded-full border px-3 py-1.5 text-[11px] font-black transition",
                          statusFilter === status
                            ? "border-transparent text-white"
                            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
                        )}
                        style={
                          statusFilter === status
                            ? { background: status === "At risk" ? EV_ORANGE : EV_GREEN }
                            : undefined
                        }
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {allTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setTypeFilter(type)}
                        className={cx(
                          "rounded-full border px-3 py-1.5 text-[11px] font-black transition",
                          typeFilter === type
                            ? "border-transparent text-white"
                            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
                        )}
                        style={
                          typeFilter === type
                            ? { background: type === "Build project" ? EV_NAVY : EV_GREEN }
                            : undefined
                        }
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {filteredProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        selected={selectedProject.id === project.id}
                        onSelect={() => setSelectedProjectId(project.id)}
                      />
                    ))}
                  </div>
                </div>
              </Card>

              <Card
                title="Quick-create templates"
                subtitle="Premium launch templates for different ministry project types so teams can start fast without losing structure."
                right={
                  <button
                    type="button"
                    onClick={() => safeNav(ROUTES.newProject)}
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black"
                    style={{
                      color: EV_GREEN,
                      borderColor: "#a7f3d0",
                      background: "#ecfdf5",
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    New project lives here
                  </button>
                }
              >
                <div className="grid gap-3 md:grid-cols-2">
                  {TEMPLATE_CARDS.map((template) => (
                    <div
                      key={template.id}
                      className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4"
                    >
                      <div
                        className="h-2 w-20 rounded-full"
                        style={{ background: accentColor(template.accent) }}
                      />
                      <div className="mt-3 text-[16px] font-black text-slate-900">
                        {template.title}
                      </div>
                      <div className="mt-2 text-[12px] leading-5 text-slate-500">
                        {template.subtitle}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-[11px] font-bold text-slate-400">
                          Premium starter
                        </div>
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 text-[12px] font-black"
                          style={{ color: EV_ORANGE }}
                         onClick={handleRawPlaceholderAction}>
                          Use template
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Middle lanes */}
            <div className="col-span-12 xl:col-span-3 space-y-4">
              <Card
                title="Milestone & progress lane"
                subtitle="The operational rhythm that keeps the selected project moving with confidence."
                right={
                  <button
                    type="button"
                    onClick={() => setMilestoneOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black"
                    style={{
                      color: EV_ORANGE,
                      borderColor: "#fdba74",
                      background: "#fff7ed",
                    }}
                  >
                    Action now
                  </button>
                }
              >
                <div className="space-y-3">
                  {projectSignals.map((signal) => (
                    <div
                      key={signal.id}
                      className={cx(
                        "rounded-full border px-3 py-2 text-[12px] font-bold",
                        signal.tone === "good"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : signal.tone === "warn"
                            ? "border-amber-200 bg-amber-50 text-amber-800"
                            : "border-rose-200 bg-rose-50 text-rose-700",
                      )}
                    >
                      <div>{signal.label}</div>
                    </div>
                  ))}

                  <div className="space-y-2">
                    {milestoneDueNow.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="rounded-[22px] border border-slate-200 bg-slate-50 px-3 py-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-black text-slate-900">
                              {milestone.label}
                            </div>
                            <div className="mt-1 text-[11px] text-slate-500">
                              {fmtLocal(milestone.dueISO)} • {milestone.owner}
                            </div>
                          </div>
                          <Pill tone={toneForMilestoneState(milestone.state)}>
                            {milestone.state}
                          </Pill>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card
                title="Recruitment & team coverage"
                subtitle="Project staffing, volunteer pressure, and role gaps for the selected initiative."
                right={<Pill>{selectedProject.teamRoles.length} roles</Pill>}
              >
                <div className="space-y-3">
                  {selectedProject.teamRoles.map((role) => {
                    const fillPct = pct(role.filled, role.needed);
                    return (
                      <div
                        key={role.id}
                        className="rounded-[22px] border border-slate-200 bg-slate-50 px-3 py-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-black text-slate-900">
                              {role.label}
                            </div>
                            <div className="mt-1 text-[11px] text-slate-500">
                              {role.shift}
                            </div>
                          </div>
                          <Pill tone={fillPct >= 90 ? "good" : fillPct >= 60 ? "warn" : "danger"}>
                            {role.filled}/{role.needed}
                          </Pill>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${fillPct}%`,
                              background: fillPct >= 90 ? EV_GREEN : fillPct >= 60 ? EV_ORANGE : "#ef4444",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  <PrimaryButton color={EV_ORANGE} onClick={() => setRecruitOpen(true)} className="w-full justify-center">
                    <Users2 className="h-4 w-4" />
                    Recruit Team
                  </PrimaryButton>
                </div>
              </Card>

              <Card
                title="Cross-object hooks"
                subtitle="Connected workflow points that turn this project into a full FaithHub operating thread."
              >
                <div className="space-y-3">
                  {selectedProject.hooks.map((hook) => (
                    <div
                      key={hook.id}
                      className="rounded-[22px] border border-slate-200 bg-slate-50 px-3 py-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-[13px] font-black text-slate-900">{hook.label}</div>
                          <div className="mt-1 text-[11px] leading-5 text-slate-500">
                            {hook.hint}
                          </div>
                        </div>
                        <Pill tone={toneForHookState(hook.state)}>{hook.state}</Pill>
                      </div>
                    </div>
                  ))}
                  <div className="rounded-[22px] border border-slate-200 bg-white px-3 py-3">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
                      Ready surfaces
                    </div>
                    <div className="mt-1 text-[24px] font-black text-slate-900">
                      {totalHookReady}
                    </div>
                    <div className="mt-1 text-[12px] leading-5 text-slate-500">
                      Noticeboard, Audience, Live, Giving, and Beacon handoffs that can be used right now.
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right preview rail */}
            <div className="col-span-12 xl:col-span-3 space-y-4">
              <Card
                title="Project destination preview"
                subtitle="Persistent preview rail for the selected public-facing project page, volunteer CTA, and giving path."
                right={
                  <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
                    <button
                      type="button"
                      onClick={() => setPreviewMode("desktop")}
                      className={cx(
                        "rounded-full px-3 py-1 text-[11px] font-black transition",
                        previewMode === "desktop"
                          ? "bg-slate-900 text-white"
                          : "text-slate-500",
                      )}
                    >
                      Desktop
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode("mobile")}
                      className={cx(
                        "rounded-full px-3 py-1 text-[11px] font-black transition",
                        previewMode === "mobile"
                          ? "bg-slate-900 text-white"
                          : "text-slate-500",
                      )}
                    >
                      Mobile
                    </button>
                  </div>
                }
              >
                <div className="space-y-3">
                  <ProjectDestinationPreview
                    project={selectedProject}
                    previewMode={previewMode}
                  />

                  <div className="flex flex-wrap gap-2">
                    <PrimaryButton color={EV_GREEN} onClick={() => setPreviewOpen(true)} className="flex-1 justify-center">
                      <Eye className="h-4 w-4" />
                      Open large preview
                    </PrimaryButton>
                    <SoftButton className="flex-1 justify-center">
                      <Copy className="h-4 w-4" />
                      Copy public link
                    </SoftButton>
                  </div>
                </div>
              </Card>

              <Card
                title="Impact & finance intelligence"
                subtitle="Why this project matters now and where momentum is coming from."
              >
                <div className="space-y-3">
                  <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-3 py-3">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
                      Funding mode
                    </div>
                    <div className="mt-1 text-[15px] font-black text-slate-900">
                      {selectedProject.fundingMode}
                    </div>
                    <div className="mt-2 text-[12px] leading-5 text-slate-500">
                      {selectedProject.linkedCrowdfund
                        ? `Linked crowdfund: ${selectedProject.linkedCrowdfund}`
                        : selectedProject.fundingMode === "Fund-linked"
                          ? "Connected to a standard giving fund or campaign."
                          : "Running without an external giving destination."}
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-3 py-3">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
                      Linked ministry objects
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedProject.linkedLive ? <Pill>Live-linked</Pill> : null}
                      {selectedProject.linkedEvent ? <Pill>Event-linked</Pill> : null}
                      {selectedProject.linkedCrowdfund ? <Pill>Charity-linked</Pill> : null}
                      {selectedProject.linkedBeacon ? <Pill>Beacon-ready</Pill> : null}
                      {!selectedProject.linkedLive &&
                      !selectedProject.linkedEvent &&
                      !selectedProject.linkedCrowdfund &&
                      !selectedProject.linkedBeacon ? (
                        <Pill tone="warn">Standalone project</Pill>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Network oversight */}
          <Card
            title="Project network, collections & oversight"
            subtitle="Keep ministry project lanes organized by type, urgency, funding, and team pressure while retaining a premium command view."
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {NETWORK_LANES.map((lane) => (
                <div
                  key={lane.id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[16px] font-black text-slate-900">
                        {lane.title}
                      </div>
                      <div className="mt-2 text-[12px] leading-5 text-slate-500">
                        {lane.subtitle}
                      </div>
                    </div>
                    <Pill tone={lane.state === "Watch" ? "warn" : lane.state === "Growing" ? "good" : "navy"}>
                      {lane.state}
                    </Pill>
                  </div>
                  <div className="mt-4 text-[12px] font-bold text-slate-400">
                    {lane.count} destinations
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-center text-[12px] text-slate-500">
            Concept preview of the generated FaithHub Projects page · EVzone Green primary (#03cd8c) · Orange secondary (#f77f00)
          </div>
        </div>
      </div>

      {/* Large preview drawer */}
      <Drawer
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="FH-P-106 · Projects · Large preview"
        subtitle="Premium preview of the selected project destination, impact story, volunteer CTA, and funding path."
      >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_420px]">
          <div className="space-y-4">
            <div className="rounded-[30px] border border-slate-200 bg-slate-50 p-4">
              <ProjectDestinationPreview
                project={selectedProject}
                previewMode={previewMode}
              />
            </div>

            <Card
              title="Public-facing project summary"
              subtitle="What the community sees when they open this project destination."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
                    Story promise
                  </div>
                  <div className="mt-2 text-[13px] leading-6 text-slate-600">
                    {selectedProject.description}
                  </div>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
                    Public trust stack
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Pill>Owner visible</Pill>
                    <Pill>Milestones visible</Pill>
                    <Pill>Volunteer CTA</Pill>
                    <Pill>Giving CTA</Pill>
                    <Pill>Impact updates</Pill>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card title="Preview notes" subtitle="Operational interpretation of the selected project destination.">
              <div className="space-y-3 text-[12px] leading-5 text-slate-500">
                <div>
                  <span className="font-black text-slate-900">Status:</span> {selectedProject.status}
                </div>
                <div>
                  <span className="font-black text-slate-900">Funding mode:</span> {selectedProject.fundingMode}
                </div>
                <div>
                  <span className="font-black text-slate-900">Volunteer need:</span> {selectedProject.volunteersNeeded - selectedProject.volunteersFilled} open positions still visible.
                </div>
                <div>
                  <span className="font-black text-slate-900">Primary CTA mix:</span> Join team, Give now, Share update.
                </div>
                <div>
                  <span className="font-black text-slate-900">Linked surfaces:</span> {selectedProject.hooks.map((hook) => hook.label).join(", ")}
                </div>
              </div>
            </Card>

            <Card title="Quick actions" subtitle="Jump from preview into downstream workflows.">
              <div className="grid gap-2">
                <SoftButton onClick={() => safeNav(ROUTES.noticeboard)}>
                  <Megaphone className="h-4 w-4" />
                  Open Noticeboard
                </SoftButton>
                <SoftButton onClick={() => safeNav(ROUTES.audienceNotifications)}>
                  <Bell className="h-4 w-4" />
                  Open Audience Notifications
                </SoftButton>
                <SoftButton onClick={() => safeNav(ROUTES.charityCrowdfund)}>
                  <HeartHandshake className="h-4 w-4" />
                  Open Charity Crowdfunding
                </SoftButton>
                <PrimaryButton color={EV_ORANGE} onClick={() => safeNav(ROUTES.beaconBuilder)}>
                  <Zap className="h-4 w-4" />
                  Promote with Beacon
                </PrimaryButton>
              </div>
            </Card>
          </div>
        </div>
      </Drawer>

      {/* Milestone modal */}
      <Drawer
        open={milestoneOpen}
        onClose={() => setMilestoneOpen(false)}
        title="Add milestone"
        subtitle={`Create a new project milestone for ${selectedProject.title}.`}
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_360px]">
          <Card title="Milestone composer" subtitle="Create a milestone that keeps the project accountable, visible, and operationally clear.">
            <div className="grid gap-4">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                  Milestone title
                </div>
                <input
                  value={milestoneTitle}
                  onChange={(e) => setMilestoneTitle(e.target.value)}
                  placeholder="Example: Publish donor impact update"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-semibold text-slate-800 outline-none transition focus:border-emerald-300 focus:bg-white"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                    Due date
                  </div>
                  <input
                    type="datetime-local"
                    value={milestoneDue}
                    onChange={(e) => setMilestoneDue(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-semibold text-slate-800 outline-none transition focus:border-emerald-300 focus:bg-white"
                  />
                </div>

                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                    Owner
                  </div>
                  <input
                    value={milestoneOwner}
                    onChange={(e) => setMilestoneOwner(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-semibold text-slate-800 outline-none transition focus:border-emerald-300 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                  State
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["Done", "Ready", "Watch", "Late"] as MilestoneState[]).map((state) => (
                    <button
                      key={state}
                      type="button"
                      onClick={() => setMilestoneState(state)}
                      className={cx(
                        "rounded-full border px-3 py-1.5 text-[11px] font-black transition",
                        milestoneState === state
                          ? "border-transparent text-white"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
                      )}
                      style={
                        milestoneState === state
                          ? {
                              background:
                                state === "Late"
                                  ? EV_ORANGE
                                  : state === "Done"
                                    ? EV_GREEN
                                    : EV_NAVY,
                            }
                          : undefined
                      }
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <PrimaryButton color={EV_GREEN} onClick={addMilestone}>
                  <CheckCircle2 className="h-4 w-4" />
                  Save milestone
                </PrimaryButton>
                <SoftButton onClick={() => setMilestoneOpen(false)}>
                  <X className="h-4 w-4" />
                  Cancel
                </SoftButton>
              </div>
            </div>
          </Card>

          <Card title="Milestone guidance" subtitle="Premium standard for project execution discipline.">
            <div className="space-y-3 text-[12px] leading-5 text-slate-500">
              <div>Use milestones to create visible moments that operations, finance, care, and communications can all align around.</div>
              <div>Good milestones usually have one clear owner, one real due date, and one linked action such as a noticeboard update, volunteer shift, donor proof post, or live moment.</div>
              <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
                  Suggested examples
                </div>
                <div className="mt-2 space-y-2">
                  <Pill>Publish field update</Pill>
                  <Pill>Lock volunteer roster</Pill>
                  <Pill>Launch Beacon push</Pill>
                  <Pill>Record live project update</Pill>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Drawer>

      {/* Recruit team modal */}
      <Drawer
        open={recruitOpen}
        onClose={() => setRecruitOpen(false)}
        title="Recruit team"
        subtitle={`Create a new role or recruitment lane for ${selectedProject.title}.`}
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_360px]">
          <Card title="Recruitment composer" subtitle="Add a project role, define its target headcount, and prepare outreach for the right people.">
            <div className="grid gap-4">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                  Role name
                </div>
                <input
                  value={roleLabel}
                  onChange={(e) => setRoleLabel(e.target.value)}
                  placeholder="Example: Distribution volunteers"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-semibold text-slate-800 outline-none transition focus:border-emerald-300 focus:bg-white"
                />
              </div>

              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                  Shift or coverage window
                </div>
                <input
                  value={roleShift}
                  onChange={(e) => setRoleShift(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-semibold text-slate-800 outline-none transition focus:border-emerald-300 focus:bg-white"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                    Needed
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={roleNeeded}
                    onChange={(e) => setRoleNeeded(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-semibold text-slate-800 outline-none transition focus:border-emerald-300 focus:bg-white"
                  />
                </div>

                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                    Already filled
                  </div>
                  <input
                    type="number"
                    min={0}
                    value={roleFilled}
                    onChange={(e) => setRoleFilled(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-semibold text-slate-800 outline-none transition focus:border-emerald-300 focus:bg-white"
                  />
                </div>
              </div>

              <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[13px] font-black text-slate-900">
                      Send role into audience recruitment flow
                    </div>
                    <div className="mt-1 text-[12px] leading-5 text-slate-500">
                      Push the role into Audience Notifications or Noticeboard so the right segment can be mobilized quickly.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPublishToAudience((prev) => !prev)}
                    className={cx(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition",
                      publishToAudience ? "bg-slate-900 justify-end" : "bg-slate-300 justify-start",
                    )}
                  >
                    <span className="mx-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <PrimaryButton color={EV_GREEN} onClick={recruitRole}>
                  <Users2 className="h-4 w-4" />
                  Save role
                </PrimaryButton>
                <SoftButton onClick={() => setRecruitOpen(false)}>
                  <X className="h-4 w-4" />
                  Cancel
                </SoftButton>
              </div>
            </div>
          </Card>

          <Card title="Recruitment guidance" subtitle="Keep project team asks clear, visible, and spiritually warm.">
            <div className="space-y-3 text-[12px] leading-5 text-slate-500">
              <div>Roles should be easy to understand, time-bounded where possible, and clearly tied to the project mission or milestone they support.</div>
              <div>For high-trust ministries, include safety expectations, shift ownership, and whether the role needs approval, training, or child-safe handling.</div>
              <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
                  Best uses
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Pill>Volunteer drives</Pill>
                  <Pill>Outreach day staffing</Pill>
                  <Pill>Charity distribution</Pill>
                  <Pill>Build project teams</Pill>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Drawer>
    </div>
  );
}

export default ProjectsPage;




