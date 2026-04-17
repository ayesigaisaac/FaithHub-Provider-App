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
  Eye,
  Globe2,
  Lock,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  UserPlus,
  Workflow,
  X,
} from "lucide-react";

/**
 * FaithHub — FH-P-111 Serving Teams
 * Premium Provider-side volunteer and service-team management page.
 *
 * Primary CTAs
 * - + New Team
 * - Create Rota
 * - Invite Volunteers
 *
 * Page goals
 * - Manage ushers, media, worship, care, outreach, hospitality, and event/live support
 * - Surface rota gaps, volunteer readiness, and live/event staffing links
 * - Keep a persistent volunteer-portal preview rail on the right
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#1e2d6b";

const ROUTES = {
  providerDashboard: "/faithhub/provider/dashboard",
  newTeam: "/faithhub/provider/serving-teams/new",
  createRota: "/faithhub/provider/serving-teams/rota",
  inviteVolunteers: "/faithhub/provider/serving-teams/invite",
  liveSchedule: "/faithhub/provider/live-schedule",
  eventsManager: "/faithhub/provider/events-manager",
  rolesPermissions: "/faithhub/provider/roles-permissions",
};

const HERO_1 =
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80";
const HERO_2 =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80";
const HERO_3 =
  "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1600&q=80";
const HERO_4 =
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=80";
const HERO_5 =
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80";

const cx = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  if (typeof window === "undefined") return;
  window.location.assign(url);
}

function fmtInt(n: number) {
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function avg(values: number[]) {
  if (!values.length) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

function initials(text: string) {
  return text
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase() || "")
    .join("");
}

type PreviewMode = "desktop" | "mobile";
type TeamStatus = "Healthy" | "Needs coverage" | "Training due" | "Review";
type VisibilityMode = "Public sign-up" | "Invite only" | "Internal";
type AssignmentState = "Ready" | "Needs cover" | "Watch" | "Training due";
type CertificationState = "Valid" | "Due" | "Missing";

type AssignmentItem = {
  id: string;
  title: string;
  surface: string;
  when: string;
  state: AssignmentState;
};

type CertificationItem = {
  id: string;
  label: string;
  state: CertificationState;
};

type TeamRecord = {
  id: string;
  name: string;
  category: string;
  campus: string;
  lead: string;
  leadRole: string;
  status: TeamStatus;
  visibility: VisibilityMode;
  members: number;
  scheduledThisWeek: number;
  openShifts: number;
  responseRate: number;
  coverageFill: number;
  liveLinked: boolean;
  eventLinked: boolean;
  childSafe: boolean;
  nextAssignmentISO: string;
  heroUrl: string;
  description: string;
  notes: string;
  tags: string[];
  skills: string[];
  certifications: CertificationItem[];
  assignments: AssignmentItem[];
};

type TemplateCard = {
  id: string;
  title: string;
  subtitle: string;
  accent: "green" | "orange" | "navy";
};

const TEMPLATE_CARDS: TemplateCard[] = [
  {
    id: "tpl-worship",
    title: "Worship team",
    subtitle: "Rehearsals, service order, stage coverage, and live-linked scene cues.",
    accent: "green",
  },
  {
    id: "tpl-media",
    title: "Media & live support",
    subtitle: "Cameras, switcher, captions, and backstage support for live sessionz.",
    accent: "orange",
  },
  {
    id: "tpl-hospitality",
    title: "Hospitality & ushers",
    subtitle: "Guest flow, seating, welcome, check-in, and in-person service support.",
    accent: "navy",
  },
  {
    id: "tpl-care",
    title: "Prayer & care team",
    subtitle: "Prayer routing, care follow-up, privacy-aware response, and altar support.",
    accent: "green",
  },
];

const TEAM_RECORDS: TeamRecord[] = [
  {
    id: "team-001",
    name: "Worship & Music Team",
    category: "Worship",
    campus: "Central Campus",
    lead: "Naomi Mensah",
    leadRole: "Worship Director",
    status: "Healthy",
    visibility: "Invite only",
    members: 26,
    scheduledThisWeek: 18,
    openShifts: 1,
    responseRate: 94,
    coverageFill: 93,
    liveLinked: true,
    eventLinked: true,
    childSafe: false,
    nextAssignmentISO: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
    heroUrl: HERO_1,
    description:
      "Coordinates rehearsal, service order, worship rotation, and live-session support so every gathering feels intentional and polished.",
    notes:
      "Strong coverage this week. One late backup slot is still open for Saturday evening rehearsal.",
    tags: ["Live-linked", "Rehearsal ready", "Stage coverage"],
    skills: ["Vocals", "Keys", "Acoustic", "Stage flow", "Planning Center sync"],
    certifications: [
      { id: "cert-1", label: "Safeguarding basics", state: "Valid" },
      { id: "cert-2", label: "Stage call workflow", state: "Valid" },
      { id: "cert-3", label: "Youth event clearance", state: "Due" },
    ],
    assignments: [
      {
        id: "asg-1",
        title: "Sunday early service",
        surface: "Main auditorium · Live Studio linked",
        when: "Sun · 7:30 AM",
        state: "Ready",
      },
      {
        id: "asg-2",
        title: "Saturday rehearsal",
        surface: "Central Campus stage",
        when: "Sat · 5:00 PM",
        state: "Needs cover",
      },
      {
        id: "asg-3",
        title: "Night prayer live",
        surface: "Live Schedule · Worship support",
        when: "Tue · 8:00 PM",
        state: "Watch",
      },
    ],
  },
  {
    id: "team-002",
    name: "Media & Live Sessions Crew",
    category: "Media",
    campus: "Central Campus",
    lead: "Daniel Okoro",
    leadRole: "Production Lead",
    status: "Needs coverage",
    visibility: "Internal",
    members: 19,
    scheduledThisWeek: 13,
    openShifts: 4,
    responseRate: 88,
    coverageFill: 81,
    liveLinked: true,
    eventLinked: true,
    childSafe: false,
    nextAssignmentISO: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
    heroUrl: HERO_2,
    description:
      "Runs cameras, stream health checks, overlays, switcher flow, live moderation support, and backup production readiness.",
    notes:
      "Two captioner slots and one backup producer slot remain open for the conference stream block.",
    tags: ["Operations critical", "Live-linked", "Needs rota attention"],
    skills: ["Camera ops", "Switcher", "Audio", "Captioning", "Moderation assist"],
    certifications: [
      { id: "cert-4", label: "Broadcast workflow", state: "Valid" },
      { id: "cert-5", label: "Child-safe broadcast policy", state: "Valid" },
      { id: "cert-6", label: "Backup ingest drill", state: "Missing" },
    ],
    assignments: [
      {
        id: "asg-4",
        title: "Wednesday discipleship class",
        surface: "Live Schedule · Studio lane",
        when: "Wed · 6:30 PM",
        state: "Needs cover",
      },
      {
        id: "asg-5",
        title: "Conference livestream",
        surface: "Events Manager · Multi-camera",
        when: "Fri · 4:00 PM",
        state: "Training due",
      },
      {
        id: "asg-6",
        title: "Sunday replay packaging prep",
        surface: "Post-live handoff",
        when: "Sun · 12:15 PM",
        state: "Ready",
      },
    ],
  },
  {
    id: "team-003",
    name: "Hospitality & Ushers",
    category: "Hospitality",
    campus: "East Campus",
    lead: "Grace Nansubuga",
    leadRole: "Hospitality Coordinator",
    status: "Healthy",
    visibility: "Public sign-up",
    members: 34,
    scheduledThisWeek: 22,
    openShifts: 2,
    responseRate: 91,
    coverageFill: 90,
    liveLinked: false,
    eventLinked: true,
    childSafe: true,
    nextAssignmentISO: new Date(Date.now() + 1000 * 60 * 60 * 31).toISOString(),
    heroUrl: HERO_3,
    description:
      "Leads arrivals, guest care, seating, family support, event-day check-in, and safe in-person flow across major gatherings.",
    notes:
      "New volunteers are ready for Sunday service after check-in refresher. Family lane needs one more runner.",
    tags: ["Public sign-up", "Child-safe defaults", "Event-linked"],
    skills: ["Guest care", "Check-in", "Family support", "Queue flow", "Accessibility care"],
    certifications: [
      { id: "cert-7", label: "Child-safe response", state: "Valid" },
      { id: "cert-8", label: "Emergency floor lead", state: "Valid" },
      { id: "cert-9", label: "Guest follow-up basics", state: "Due" },
    ],
    assignments: [
      {
        id: "asg-7",
        title: "Sunday main service",
        surface: "East Campus foyer",
        when: "Sun · 8:00 AM",
        state: "Ready",
      },
      {
        id: "asg-8",
        title: "Community outreach sign-in",
        surface: "Events Manager · Outreach Day",
        when: "Sat · 9:30 AM",
        state: "Watch",
      },
      {
        id: "asg-9",
        title: "Family lane support",
        surface: "Children’s arrival zone",
        when: "Sun · 10:30 AM",
        state: "Needs cover",
      },
    ],
  },
  {
    id: "team-004",
    name: "Prayer & Care Response Team",
    category: "Care",
    campus: "Institution-wide",
    lead: "Pastor Grace N.",
    leadRole: "Care Pastor",
    status: "Training due",
    visibility: "Invite only",
    members: 17,
    scheduledThisWeek: 11,
    openShifts: 3,
    responseRate: 86,
    coverageFill: 78,
    liveLinked: true,
    eventLinked: false,
    childSafe: true,
    nextAssignmentISO: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
    heroUrl: HERO_4,
    description:
      "Routes prayer requests, care escalations, altar-response coverage, and follow-up moments with privacy-aware assignment rules.",
    notes:
      "Pastoral care coverage is strong, but two responders still need refreshed privacy and escalation training.",
    tags: ["Prayer requests", "High trust", "Live-linked"],
    skills: ["Prayer response", "Escalation routing", "Confidential notes", "Follow-up"],
    certifications: [
      { id: "cert-10", label: "Confidentiality & care", state: "Valid" },
      { id: "cert-11", label: "Child-safe escalation", state: "Due" },
      { id: "cert-12", label: "Trauma-aware response", state: "Due" },
    ],
    assignments: [
      {
        id: "asg-10",
        title: "Night prayer response lane",
        surface: "Live Sessions prayer intake",
        when: "Tue · 8:00 PM",
        state: "Training due",
      },
      {
        id: "asg-11",
        title: "Post-service care desk",
        surface: "Central Campus lobby",
        when: "Sun · 11:15 AM",
        state: "Ready",
      },
      {
        id: "asg-12",
        title: "Prayer Journal prompt follow-up",
        surface: "Community care flow",
        when: "Thu · 6:00 PM",
        state: "Watch",
      },
    ],
  },
  {
    id: "team-005",
    name: "Outreach & Missions Volunteers",
    category: "Outreach",
    campus: "North Campus",
    lead: "Michael Sarpong",
    leadRole: "Outreach Lead",
    status: "Review",
    visibility: "Public sign-up",
    members: 28,
    scheduledThisWeek: 16,
    openShifts: 5,
    responseRate: 82,
    coverageFill: 74,
    liveLinked: false,
    eventLinked: true,
    childSafe: false,
    nextAssignmentISO: new Date(Date.now() + 1000 * 60 * 60 * 54).toISOString(),
    heroUrl: HERO_5,
    description:
      "Coordinates community missions, outreach-day mobilization, on-ground volunteer care, and impact-ready follow-up.",
    notes:
      "Recruitment is moving, but transport coordinators and registration support still need to be locked in.",
    tags: ["Recruiting now", "Project-linked", "Needs review"],
    skills: ["Registration", "Logistics", "Transport", "Prayer support", "Follow-up capture"],
    certifications: [
      { id: "cert-13", label: "Event safety basics", state: "Valid" },
      { id: "cert-14", label: "Volunteer coordinator guide", state: "Missing" },
      { id: "cert-15", label: "Outreach reporting", state: "Due" },
    ],
    assignments: [
      {
        id: "asg-13",
        title: "Outreach registration team",
        surface: "Projects · Community mission",
        when: "Sat · 8:30 AM",
        state: "Needs cover",
      },
      {
        id: "asg-14",
        title: "Transport coordination",
        surface: "Event trip roster",
        when: "Fri · 4:00 PM",
        state: "Needs cover",
      },
      {
        id: "asg-15",
        title: "Beacon follow-up ambassador lane",
        surface: "Audience + Projects bridge",
        when: "Mon · 6:30 PM",
        state: "Watch",
      },
    ],
  },
];

function MetricCard({
  label,
  value,
  hint,
  dot = "green",
}: {
  label: string;
  value: string;
  hint: string;
  dot?: "green" | "orange" | "navy" | "grey";
}) {
  const color =
    dot === "green"
      ? EV_GREEN
      : dot === "orange"
        ? EV_ORANGE
        : dot === "navy"
          ? EV_NAVY
          : EV_GREY;

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          {label}
        </div>
        <div className="h-9 w-9 rounded-full" style={{ background: color }} />
      </div>
      <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">{value}</div>
      <div className="mt-1 text-[12px] leading-5 text-slate-500 dark:text-slate-400">{hint}</div>
    </div>
  );
}

function TonePill({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "good" | "warn" | "danger" | "accent";
  children: React.ReactNode;
}) {
  const cls =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300"
      : tone === "warn"
        ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300"
        : tone === "danger"
          ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300"
          : tone === "accent"
            ? "text-white"
            : "border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300";

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        cls,
      )}
      style={tone === "accent" ? { background: EV_ORANGE, borderColor: EV_ORANGE } : undefined}
    >
      {children}
    </span>
  );
}

function SectionCard({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[15px] font-black text-slate-900 dark:text-slate-100">{title}</div>
          {subtitle ? (
            <div className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">{subtitle}</div>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function TeamListCard({
  team,
  active,
  onClick,
}: {
  team: TeamRecord;
  active?: boolean;
  onClick?: () => void;
}) {
  const tone =
    team.status === "Healthy"
      ? "good"
      : team.status === "Review"
        ? "danger"
        : "warn";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "w-full rounded-[28px] border p-4 text-left transition-all",
        active
          ? "border-transparent text-white shadow-md"
          : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800",
      )}
      style={active ? { background: EV_NAVY } : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cx(
              "grid h-14 w-14 shrink-0 place-items-center rounded-[20px] text-lg font-black",
              active
                ? "bg-white/10 text-white"
                : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100",
            )}
          >
            {initials(team.name)}
          </div>
          <div className="min-w-0">
            <div className={cx("truncate text-[15px] font-bold", active ? "text-white" : "text-slate-900 dark:text-slate-100")}>
              {team.name}
            </div>
            <div className={cx("mt-1 truncate text-[12px]", active ? "text-white/75" : "text-slate-500 dark:text-slate-400")}>
              {team.category} · {team.campus} · {team.lead}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <TonePill tone={tone}>{team.status}</TonePill>
              <TonePill tone={team.visibility === "Public sign-up" ? "good" : team.visibility === "Invite only" ? "warn" : "neutral"}>
                {team.visibility}
              </TonePill>
              {team.liveLinked ? <TonePill tone="accent">Live-linked</TonePill> : null}
              {team.childSafe ? <TonePill tone="good"><ShieldCheck className="h-3.5 w-3.5" /> Child-safe</TonePill> : null}
            </div>
          </div>
        </div>
        <div className={cx("shrink-0 text-right", active ? "text-white" : "text-slate-900 dark:text-slate-100")}>
          <div className="text-[12px] font-black">{team.coverageFill}%</div>
          <div className={cx("mt-1 text-[11px]", active ? "text-white/70" : "text-slate-500 dark:text-slate-400")}>coverage</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div>
          <div className={cx("text-[10px] font-bold uppercase tracking-[0.16em]", active ? "text-white/60" : "text-slate-500 dark:text-slate-400")}>Members</div>
          <div className={cx("mt-1 text-[14px] font-black", active ? "text-white" : "text-slate-900 dark:text-slate-100")}>{fmtInt(team.members)}</div>
        </div>
        <div>
          <div className={cx("text-[10px] font-bold uppercase tracking-[0.16em]", active ? "text-white/60" : "text-slate-500 dark:text-slate-400")}>Scheduled</div>
          <div className={cx("mt-1 text-[14px] font-black", active ? "text-white" : "text-slate-900 dark:text-slate-100")}>{fmtInt(team.scheduledThisWeek)}</div>
        </div>
        <div>
          <div className={cx("text-[10px] font-bold uppercase tracking-[0.16em]", active ? "text-white/60" : "text-slate-500 dark:text-slate-400")}>Open shifts</div>
          <div className={cx("mt-1 text-[14px] font-black", active ? "text-white" : "text-slate-900 dark:text-slate-100")}>{fmtInt(team.openShifts)}</div>
        </div>
      </div>
    </button>
  );
}

function TemplateTile({ card }: { card: TemplateCard }) {
  const bg = card.accent === "green" ? EV_GREEN : card.accent === "orange" ? EV_ORANGE : EV_NAVY;
  return (
    <button
      type="button"
      onClick={() => safeNav(ROUTES.newTeam)}
      className="group rounded-[28px] border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <div
        className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white"
        style={{ background: bg }}
      >
        Template
      </div>
      <div className="mt-4 text-[15px] font-bold text-slate-900 dark:text-slate-100">{card.title}</div>
      <div className="mt-1 text-[12px] leading-5 text-slate-500 dark:text-slate-400">{card.subtitle}</div>
      <div className="mt-4 inline-flex items-center gap-2 text-[12px] font-bold" style={{ color: bg }}>
        Use template <ChevronRight className="h-4 w-4" />
      </div>
    </button>
  );
}

function TeamPreview({
  team,
  mode,
}: {
  team: TeamRecord;
  mode: PreviewMode;
}) {
  return (
    <div
      className={cx(
        "overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900",
        mode === "desktop" ? "w-full" : "mx-auto w-[320px] md:w-[360px]",
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-200 dark:bg-slate-800">
        <img src={team.heroUrl} alt={team.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-700 shadow-sm backdrop-blur">
          <BadgeCheck className="h-3.5 w-3.5" style={{ color: EV_GREEN }} />
          Volunteer destination
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] backdrop-blur">
              {team.category}
            </span>
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white"
              style={{ background: EV_ORANGE }}
            >
              {team.visibility}
            </span>
          </div>
          <div className="mt-3 text-xl font-black leading-tight">{team.name}</div>
          <div className="mt-1 text-[12px] text-white/80">{team.lead} · {team.campus}</div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <TonePill tone={team.status === "Healthy" ? "good" : team.status === "Review" ? "danger" : "warn"}>
            {team.status}
          </TonePill>
          {team.liveLinked ? <TonePill tone="accent">Live-linked</TonePill> : null}
          {team.childSafe ? <TonePill tone="good">Child-safe flow</TonePill> : null}
        </div>

        <div className="mt-4 text-[13px] leading-6 text-slate-600 dark:text-slate-300">{team.description}</div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Members</div>
            <div className="mt-1 text-[13px] font-black text-slate-900 dark:text-slate-100">{team.members}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Coverage</div>
            <div className="mt-1 text-[13px] font-black text-slate-900 dark:text-slate-100">{team.coverageFill}%</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Open shifts</div>
            <div className="mt-1 text-[13px] font-black text-slate-900 dark:text-slate-100">{team.openShifts}</div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {team.assignments.slice(0, 3).map((assignment) => (
            <div
              key={assignment.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[12px] font-bold text-slate-900 dark:text-slate-100">{assignment.title}</div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {assignment.when} · {assignment.surface}
                  </div>
                </div>
                <TonePill
                  tone={
                    assignment.state === "Ready"
                      ? "good"
                      : assignment.state === "Watch"
                        ? "warn"
                        : "danger"
                  }
                >
                  {assignment.state}
                </TonePill>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => safeNav(ROUTES.inviteVolunteers)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-bold text-white"
            style={{ background: EV_GREEN }}
          >
            <UserPlus className="h-4 w-4" /> Join team
          </button>
          <button
            type="button"
            onClick={() => safeNav(ROUTES.createRota)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <CalendarClock className="h-4 w-4" /> View rota
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewDrawer({
  open,
  onClose,
  team,
  mode,
}: {
  open: boolean;
  onClose: () => void;
  team: TeamRecord | null;
  mode: PreviewMode;
}) {
  if (!open || !team) return null;
  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-4xl overflow-y-auto border-l border-slate-200 bg-slate-50 p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-3 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Large preview
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">
              Volunteer portal preview
            </div>
            <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
              Public-facing team destination with join, rota, and readiness information.
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4">
          <TeamPreview team={team} mode={mode} />
        </div>
      </div>
    </div>
  );
}

export default function FH_P_111_ServingTeamsPage() {
  const [query, setQuery] = useState("");
  const [campusFilter, setCampusFilter] = useState("All campuses");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(TEAM_RECORDS[0]?.id || "");

  const campuses = useMemo(
    () => ["All campuses", ...Array.from(new Set(TEAM_RECORDS.map((team) => team.campus)))],
    [],
  );
  const categories = useMemo(
    () => ["All categories", ...Array.from(new Set(TEAM_RECORDS.map((team) => team.category)))],
    [],
  );
  const statuses = useMemo(
    () => ["All statuses", ...Array.from(new Set(TEAM_RECORDS.map((team) => team.status)))],
    [],
  );

  const filteredTeams = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEAM_RECORDS.filter((team) => {
      const matchesQuery =
        !q ||
        [team.name, team.category, team.campus, team.lead, ...team.tags]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const matchesCampus = campusFilter === "All campuses" || team.campus === campusFilter;
      const matchesCategory = categoryFilter === "All categories" || team.category === categoryFilter;
      const matchesStatus = statusFilter === "All statuses" || team.status === statusFilter;
      return matchesQuery && matchesCampus && matchesCategory && matchesStatus;
    });
  }, [query, campusFilter, categoryFilter, statusFilter]);

  const selectedTeam = useMemo(() => {
    return (
      filteredTeams.find((team) => team.id === selectedTeamId) ||
      TEAM_RECORDS.find((team) => team.id === selectedTeamId) ||
      filteredTeams[0] ||
      TEAM_RECORDS[0] ||
      null
    );
  }, [filteredTeams, selectedTeamId]);

  const stats = useMemo(() => {
    const activeTeams = TEAM_RECORDS.length;
    const scheduled = TEAM_RECORDS.reduce((sum, team) => sum + team.scheduledThisWeek, 0);
    const openShifts = TEAM_RECORDS.reduce((sum, team) => sum + team.openShifts, 0);
    const liveLinked = TEAM_RECORDS.filter((team) => team.liveLinked).length;
    const trainingDue = TEAM_RECORDS.reduce(
      (sum, team) => sum + team.certifications.filter((cert) => cert.state !== "Valid").length,
      0,
    );
    const response = avg(TEAM_RECORDS.map((team) => team.responseRate));

    return { activeTeams, scheduled, openShifts, liveLinked, trainingDue, response };
  }, []);

  const inviteSignals = useMemo(() => {
    if (!selectedTeam) return [] as Array<{ title: string; hint: string; tone: "good" | "warn" | "danger" }>;

    return [
      {
        title:
          selectedTeam.openShifts > 0
            ? `${selectedTeam.openShifts} open shift${selectedTeam.openShifts === 1 ? "" : "s"} still need cover`
            : "Current rota is fully covered",
        hint:
          selectedTeam.openShifts > 0
            ? "Create a rota or invite volunteers directly into uncovered roles before the next gathering."
            : "No urgent staffing gaps are currently blocking the next service or event.",
        tone: selectedTeam.openShifts > 0 ? "warn" : "good",
      },
      {
        title:
          selectedTeam.certifications.some((cert) => cert.state !== "Valid")
            ? "Training and certifications need follow-up"
            : "Volunteer readiness checks are healthy",
        hint:
          selectedTeam.certifications.some((cert) => cert.state !== "Valid")
            ? "Use the invite lane to request refreshed compliance or skill check completion."
            : "Team members assigned this week currently meet the required readiness checks.",
        tone: selectedTeam.certifications.some((cert) => cert.state === "Missing")
          ? "danger"
          : selectedTeam.certifications.some((cert) => cert.state === "Due")
            ? "warn"
            : "good",
      },
      {
        title: selectedTeam.liveLinked
          ? "Linked to live operations and upcoming rota surfaces"
          : "Primarily event and campus-serving coverage",
        hint: selectedTeam.liveLinked
          ? "This team appears in Live Builder, Live Schedule, and event staffing workflows."
          : "This team is currently weighted toward in-person events, hospitality, and local service rhythms.",
        tone: selectedTeam.liveLinked ? "good" : "warn",
      },
    ];
  }, [selectedTeam]);

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-[1600px] px-5 py-5 md:px-6 lg:px-8 lg:py-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-4">
                <div
                  className="grid h-12 w-12 place-items-center rounded-[18px] text-white"
                  style={{ background: EV_GREEN }}
                >
                  <Users className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Team operations
                  </div>
                  <div className="mt-1 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                    FH-P-111 · Serving Teams
                  </div>
                  <div className="mt-1 max-w-3xl text-[15px] text-slate-500 dark:text-slate-400">
                    Premium volunteer and service-team operating system for ushers, media, worship, care, outreach, hospitality, and event/live support.
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <TonePill tone="accent">Serving coverage pulse 5</TonePill>
                <TonePill tone="good">Live-linked teams 3</TonePill>
                <TonePill tone="warn">Open shifts 15</TonePill>
                <TonePill tone="neutral">Training due 6</TonePill>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 xl:items-end">
              <div className="flex flex-wrap gap-2">
                <TonePill tone="neutral">Volunteer portal</TonePill>
                <TonePill tone="neutral">Rota coverage</TonePill>
                <TonePill tone="neutral">Live-linked staffing</TonePill>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => safeNav(ROUTES.newTeam)}
                  className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-[12px] font-bold text-white"
                  style={{ background: EV_GREEN }}
                >
                  <Plus className="h-4 w-4" /> + New Team
                </button>
                <button
                  type="button"
                  onClick={() => safeNav(ROUTES.createRota)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <CalendarClock className="h-4 w-4" /> Create Rota
                </button>
                <button
                  type="button"
                  onClick={() => safeNav(ROUTES.inviteVolunteers)}
                  className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-[12px] font-bold text-white"
                  style={{ background: EV_ORANGE }}
                >
                  <UserPlus className="h-4 w-4" /> Invite Volunteers
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[26px] border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300">
                Premium team ops
              </span>
              <span className="ml-3 align-middle">
                Media crew needs one backup producer · Hospitality has one family-lane opening · Worship rehearsal coverage is 93% ready for the week.
              </span>
            </div>
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
              Volunteer readiness system
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-6">
          <MetricCard
            label="Active teams"
            value={fmtInt(stats.activeTeams)}
            hint="Service, live, event, and outreach teams."
            dot="green"
          />
          <MetricCard
            label="Volunteers scheduled"
            value={fmtInt(stats.scheduled)}
            hint="Assignments currently locked this week."
            dot="green"
          />
          <MetricCard
            label="Open shifts"
            value={fmtInt(stats.openShifts)}
            hint="Coverage still waiting on named volunteers."
            dot="orange"
          />
          <MetricCard
            label="Live-linked teams"
            value={fmtInt(stats.liveLinked)}
            hint="Teams connected to live-session workflows."
            dot="navy"
          />
          <MetricCard
            label="Training due"
            value={fmtInt(stats.trainingDue)}
            hint="Certifications or readiness refreshes pending."
            dot="orange"
          />
          <MetricCard
            label="Avg response"
            value={`${stats.response}%`}
            hint="Volunteer reply rate across current invites."
            dot="grey"
          />
        </div>

        <div className="mt-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100">Search and filter</div>
          <div className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
            Find teams, campuses, leads, visibility rules, and staffing gaps faster.
          </div>
          <div className="mt-4 grid gap-3 xl:grid-cols-[1.4fr_0.55fr_0.55fr_0.55fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search team name, lead, tags, or campus"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-[13px] outline-none transition focus:border-transparent focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-emerald-900/40"
              />
            </div>
            <select
              value={campusFilter}
              onChange={(e) => setCampusFilter(e.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[13px] font-semibold text-slate-700 outline-none transition focus:border-transparent focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:ring-slate-800"
            >
              {campuses.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[13px] font-semibold text-slate-700 outline-none transition focus:border-transparent focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:ring-slate-800"
            >
              {categories.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[13px] font-semibold text-slate-700 outline-none transition focus:border-transparent focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:ring-slate-800"
            >
              {statuses.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.95fr_0.78fr] xl:items-start">
          <div className="space-y-4">
            <SectionCard
              title="Serving teams catalog"
              subtitle="Premium volunteer team library for worship, media, ushers, care, outreach, and event/live support."
              right={<TonePill tone="neutral">{filteredTeams.length} teams</TonePill>}
            >
              <div className="mb-4 flex flex-wrap gap-2">
                <TonePill tone="neutral">All teams</TonePill>
                <TonePill tone="good">Live-linked</TonePill>
                <TonePill tone="warn">Needs coverage</TonePill>
                <TonePill tone="neutral">Child-safe</TonePill>
                <TonePill tone="neutral">Event-linked</TonePill>
              </div>

              <div className="space-y-3">
                {filteredTeams.length ? (
                  filteredTeams.map((team) => (
                    <TeamListCard
                      key={team.id}
                      team={team}
                      active={selectedTeam?.id === team.id}
                      onClick={() => setSelectedTeamId(team.id)}
                    />
                  ))
                ) : (
                  <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-950">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      <Search className="h-6 w-6" />
                    </div>
                    <div className="mt-4 text-[15px] font-bold text-slate-900 dark:text-slate-100">
                      No teams match this filter
                    </div>
                    <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                      Try changing the campus, category, or status filters.
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>

            <SectionCard
              title="Quick-create templates"
              subtitle="Premium launch templates so team leads can create new service structures quickly and consistently."
              right={
                <button
                  type="button"
                  onClick={() => safeNav(ROUTES.newTeam)}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300"
                >
                  <Plus className="h-3.5 w-3.5" /> New Team lives here
                </button>
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                {TEMPLATE_CARDS.map((card) => (
                  <TemplateTile key={card.id} card={card} />
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-4">
            <SectionCard
              title="Selected team workspace"
              subtitle="Team roster, public readiness, rota ownership, and volunteer health for the currently selected team."
            >
              {selectedTeam ? (
                <>
                  <div className="flex items-start gap-4">
                    <div
                      className="grid h-16 w-16 shrink-0 place-items-center rounded-[24px] text-2xl font-black text-white"
                      style={{ background: EV_NAVY }}
                    >
                      {initials(selectedTeam.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                        {selectedTeam.name}
                      </div>
                      <div className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
                        {selectedTeam.lead} · {selectedTeam.leadRole} · {selectedTeam.campus}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <TonePill tone={selectedTeam.status === "Healthy" ? "good" : selectedTeam.status === "Review" ? "danger" : "warn"}>
                          {selectedTeam.status}
                        </TonePill>
                        <TonePill tone={selectedTeam.visibility === "Public sign-up" ? "good" : selectedTeam.visibility === "Invite only" ? "warn" : "neutral"}>
                          {selectedTeam.visibility}
                        </TonePill>
                        {selectedTeam.liveLinked ? <TonePill tone="accent">Live-linked</TonePill> : null}
                        {selectedTeam.childSafe ? <TonePill tone="good"><ShieldCheck className="h-3.5 w-3.5" /> Child-safe</TonePill> : null}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                    <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      Team description
                    </div>
                    <div className="mt-2 text-[13px] leading-6 text-slate-600 dark:text-slate-300">
                      {selectedTeam.description}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-[24px] border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        Members
                      </div>
                      <div className="mt-2 text-xl font-black text-slate-900 dark:text-slate-100">{selectedTeam.members}</div>
                    </div>
                    <div className="rounded-[24px] border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        Coverage fill
                      </div>
                      <div className="mt-2 text-xl font-black text-slate-900 dark:text-slate-100">{selectedTeam.coverageFill}%</div>
                    </div>
                    <div className="rounded-[24px] border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        Response rate
                      </div>
                      <div className="mt-2 text-xl font-black text-slate-900 dark:text-slate-100">{selectedTeam.responseRate}%</div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-[24px] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        Responsibilities & skills
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedTeam.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[24px] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        Leadership notes
                      </div>
                      <div className="mt-3 text-[13px] leading-6 text-slate-600 dark:text-slate-300">
                        {selectedTeam.notes}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => safeNav(ROUTES.createRota)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <CalendarClock className="h-4 w-4" /> Create Rota
                    </button>
                    <button
                      type="button"
                      onClick={() => safeNav(ROUTES.inviteVolunteers)}
                      className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-[12px] font-bold text-white"
                      style={{ background: EV_ORANGE }}
                    >
                      <UserPlus className="h-4 w-4" /> Invite Volunteers
                    </button>
                    <button
                      type="button"
                      onClick={() => safeNav(ROUTES.rolesPermissions)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <Lock className="h-4 w-4" /> Roles & Permissions
                    </button>
                  </div>
                </>
              ) : null}
            </SectionCard>

            <SectionCard
              title="Rota, coverage, and live-linked assignments"
              subtitle="Upcoming service blocks, live session support, event staffing, and shift coverage health."
              right={selectedTeam?.liveLinked ? <TonePill tone="good">Connected to Live Sessions</TonePill> : <TonePill tone="neutral">Campus-first coverage</TonePill>}
            >
              <div className="space-y-3">
                {selectedTeam?.assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100">{assignment.title}</div>
                        <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">{assignment.surface}</div>
                        <div className="mt-2 inline-flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          <CalendarClock className="h-3.5 w-3.5" /> {assignment.when}
                        </div>
                      </div>
                      <TonePill
                        tone={
                          assignment.state === "Ready"
                            ? "good"
                            : assignment.state === "Watch"
                              ? "warn"
                              : "danger"
                        }
                      >
                        {assignment.state}
                      </TonePill>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Volunteer readiness & invite lane"
              subtitle="Signals that help leadership know what needs action now and where new volunteers should be invited first."
            >
              <div className="space-y-3">
                {inviteSignals.map((signal) => (
                  <div
                    key={signal.title}
                    className={cx(
                      "rounded-[24px] border p-4",
                      signal.tone === "good"
                        ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-900/20"
                        : signal.tone === "warn"
                          ? "border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/20"
                          : "border-rose-200 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-900/20",
                    )}
                  >
                    <div className="text-[13px] font-bold text-slate-900 dark:text-slate-100">{signal.title}</div>
                    <div className="mt-1 text-[12px] leading-5 text-slate-600 dark:text-slate-300">{signal.hint}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {selectedTeam?.certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="rounded-[24px] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-[13px] font-bold text-slate-900 dark:text-slate-100">{cert.label}</div>
                      <TonePill
                        tone={
                          cert.state === "Valid"
                            ? "good"
                            : cert.state === "Due"
                              ? "warn"
                              : "danger"
                        }
                      >
                        {cert.state}
                      </TonePill>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-4">
            <SectionCard
              title="Volunteer portal preview rail"
              subtitle="Persistent desktop/mobile preview of the volunteer-facing destination and join experience."
              right={
                <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-950">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("desktop")}
                    className={cx(
                      "rounded-full px-3 py-1 text-[11px] font-bold transition",
                      previewMode === "desktop" ? "text-white" : "text-slate-500 dark:text-slate-400",
                    )}
                    style={previewMode === "desktop" ? { background: EV_NAVY } : undefined}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("mobile")}
                    className={cx(
                      "rounded-full px-3 py-1 text-[11px] font-bold transition",
                      previewMode === "mobile" ? "text-white" : "text-slate-500 dark:text-slate-400",
                    )}
                    style={previewMode === "mobile" ? { background: EV_NAVY } : undefined}
                  >
                    Mobile
                  </button>
                </div>
              }
            >
              {selectedTeam ? <TeamPreview team={selectedTeam} mode={previewMode} /> : null}

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Eye className="h-4 w-4" /> Open large preview
                </button>
                <button
                  type="button"
                  onClick={() => safeNav(ROUTES.inviteVolunteers)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Globe2 className="h-4 w-4" /> Copy join route
                </button>
              </div>
            </SectionCard>

            <SectionCard
              title="Serving team network & oversight"
              subtitle="Keep volunteer lanes organized by campus, responsibility, and operational readiness while retaining a premium team-management surface."
            >
              <div className="space-y-3">
                <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100">Production & worship lane</div>
                      <div className="mt-1 text-[12px] leading-5 text-slate-500 dark:text-slate-400">
                        Worship, media, stage, and caption support for weekly services and live sessionz.
                      </div>
                    </div>
                    <TonePill tone="good">Stable</TonePill>
                  </div>
                  <div className="mt-4 text-2xl font-black text-slate-900 dark:text-slate-100">4</div>
                </div>
                <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100">Care & response lane</div>
                      <div className="mt-1 text-[12px] leading-5 text-slate-500 dark:text-slate-400">
                        Prayer, care response, hospitality, and front-of-house volunteer coverage.
                      </div>
                    </div>
                    <TonePill tone="warn">Watch</TonePill>
                  </div>
                  <div className="mt-4 text-2xl font-black text-slate-900 dark:text-slate-100">5</div>
                </div>
                <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100">Outreach & event lane</div>
                      <div className="mt-1 text-[12px] leading-5 text-slate-500 dark:text-slate-400">
                        Projects, event logistics, registration, and on-ground service teams.
                      </div>
                    </div>
                    <TonePill tone="danger">Gap</TonePill>
                  </div>
                  <div className="mt-4 text-2xl font-black text-slate-900 dark:text-slate-100">3</div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      <PreviewDrawer
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        team={selectedTeam}
        mode={previewMode}
      />
    </div>
  );
}




