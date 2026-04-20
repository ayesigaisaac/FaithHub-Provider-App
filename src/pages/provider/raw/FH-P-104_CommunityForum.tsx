// @ts-nocheck
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Bell,
  CalendarClock,
  CheckCircle2,
  Copy,
  ExternalLink,
  Eye,
  Filter,
  Globe2,
  LayoutGrid,
  Link2,
  Megaphone,
  MessageSquare,
  MonitorPlay,
  Pin,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { KpiTile } from "../../../components/ui/KpiTile";
import { navigateWithRouter } from "@/navigation/routerNavigate";

/**
 * Provider — Community Forum
 * -----------------------------------
 * Premium Provider-side moderated discussion space for threads, categories,
 * leader posts, and faith-community engagement.
 *
 * Primary CTAs
 * - + New Topic
 * - Pin Thread
 * - Open Moderation
 *
 * Design intent
 * - Follow the same premium creator-style grammar used across the Provider Workspace pages.
 * - Use EVzone Green as primary and Orange as secondary.
 * - Position Community Forum as the institutional discussion operating surface,
 *   not just a flat thread list.
 * - Blend community engagement, leader-post governance, live-linked follow-up,
 *   and moderation safety into one command page.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#172554";

const ROUTES = {
  providerDashboard: "/faithhub/provider/dashboard",
  communityGroups: "/faithhub/provider/community-groups",
  noticeboard: "/faithhub/provider/noticeboard",
  reviewsModeration: "/faithhub/provider/reviews-moderation",
  newTopic: "/faithhub/provider/community-forum/new-topic",
};

const HERO_1 =
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80";
const HERO_2 =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80";
const HERO_3 =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80";
const HERO_4 =
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1600&q=80";
const HERO_5 =
  "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1600&q=80";

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  navigateWithRouter(url);
}

function fmtInt(n: number) {
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
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
type Tone = "neutral" | "good" | "warn" | "danger" | "brand" | "navy";
type LaneFilter = "All" | "Leader posts" | "Needs moderation" | "Pinned" | "Child-safe";
type CategoryFilter =
  | "All categories"
  | "General Discussion"
  | "Prayer & Care"
  | "Series Follow-up"
  | "Youth & Family"
  | "Events & Service"
  | "Testimonies";
type ThreadHealth = "Healthy" | "Needs moderation" | "Watch";
type Visibility = "Public" | "Members" | "Invite-only";

type Signal = {
  id: string;
  label: string;
  hint: string;
  tone: "good" | "warn" | "danger";
};

type ThreadRecord = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  category: Exclude<CategoryFilter, "All categories">;
  health: ThreadHealth;
  visibility: Visibility;
  heroUrl: string;
  owner: string;
  campus: string;
  languages: string[];
  linkedObject: string;
  liveLinked: boolean;
  leaderPost: boolean;
  pinned: boolean;
  childSafe: boolean;
  replies: number;
  participants: number;
  unanswered: number;
  likes: number;
  flags: number;
  lastActiveISO: string;
  tags: string[];
  signals: Signal[];
};

type ModerationCase = {
  id: string;
  threadId: string;
  title: string;
  lane: string;
  reason: string;
  owner: string;
  severity: "Watch" | "Priority" | "Critical";
  ageLabel: string;
};

type LeaderPost = {
  id: string;
  title: string;
  owner: string;
  scheduledAt: string;
  status: "Ready" | "Awaiting review" | "Scheduled";
  linkedObject: string;
};

type TemplateCard = {
  id: string;
  title: string;
  subtitle: string;
  accent: "green" | "orange" | "navy";
  prefill: {
    title: string;
    excerpt: string;
    category: Exclude<CategoryFilter, "All categories">;
  };
};

const CATEGORY_ORDER: CategoryFilter[] = [
  "All categories",
  "General Discussion",
  "Prayer & Care",
  "Series Follow-up",
  "Youth & Family",
  "Events & Service",
  "Testimonies",
];

const INITIAL_THREADS: ThreadRecord[] = [
  {
    id: "CF-201",
    title: "Sunday message follow-up: grace in daily work",
    excerpt:
      "Continue the conversation from this week’s teaching with practical stories, scripture reflections, and leader prompts.",
    body:
      "This leader-led thread is linked to the Everyday Grace series and the Sunday replay. Members are invited to share what stood out, where they need prayer, and how the teaching intersects with work, family, and service this week.",
    category: "Series Follow-up",
    health: "Healthy",
    visibility: "Public",
    heroUrl: HERO_1,
    owner: "Pastor Ada N.",
    campus: "Kampala Central",
    languages: ["English", "Luganda"],
    linkedObject: "Series • Everyday Grace",
    liveLinked: true,
    leaderPost: true,
    pinned: true,
    childSafe: false,
    replies: 86,
    participants: 121,
    unanswered: 12,
    likes: 204,
    flags: 0,
    lastActiveISO: "2026-04-19T18:40:00",
    tags: ["follow-up", "grace", "scripture", "live-linked"],
    signals: [
      {
        id: "sig-1",
        label: "Leader response rhythm is healthy",
        hint: "Average leader reply time is under 40 minutes.",
        tone: "good",
      },
      {
        id: "sig-2",
        label: "Unanswered questions remain",
        hint: "12 thread replies still need pastoral or moderator follow-up.",
        tone: "warn",
      },
    ],
  },
  {
    id: "CF-202",
    title: "Prayer support for hospital visits this week",
    excerpt:
      "Members are posting urgent prayer needs connected to hospital visits, family care, and practical support requests.",
    body:
      "This prayer-care thread needs more active moderation because a few replies include personal identifiers and unreviewed health details. Assign care leads, keep privacy guardrails visible, and move answered items into testimony follow-up when appropriate.",
    category: "Prayer & Care",
    health: "Needs moderation",
    visibility: "Members",
    heroUrl: HERO_2,
    owner: "Care Team",
    campus: "Online First",
    languages: ["English"],
    linkedObject: "Prayer lane • Care routing",
    liveLinked: false,
    leaderPost: false,
    pinned: false,
    childSafe: false,
    replies: 41,
    participants: 64,
    unanswered: 7,
    likes: 77,
    flags: 5,
    lastActiveISO: "2026-04-19T17:25:00",
    tags: ["prayer", "care", "privacy", "follow-up"],
    signals: [
      {
        id: "sig-3",
        label: "Contains privacy-sensitive replies",
        hint: "A moderator should redact personal identifiers before wider visibility.",
        tone: "danger",
      },
      {
        id: "sig-4",
        label: "Pastoral follow-up needed",
        hint: "2 urgent replies are awaiting care-lead ownership.",
        tone: "warn",
      },
    ],
  },
  {
    id: "CF-203",
    title: "Youth camp ride-share and parent notes",
    excerpt:
      "Travel coordination, safety instructions, parent confirmations, and arrival windows for the youth camp weekend.",
    body:
      "This youth-and-family thread uses child-safe defaults, restricted visibility, and stricter moderation thresholds. Volunteers can post logistics updates, but leader approval is required before changes become visible to the full group.",
    category: "Youth & Family",
    health: "Watch",
    visibility: "Invite-only",
    heroUrl: HERO_3,
    owner: "Youth Desk",
    campus: "Entebbe South",
    languages: ["English", "Swahili"],
    linkedObject: "Event • Youth Camp Weekend",
    liveLinked: false,
    leaderPost: true,
    pinned: false,
    childSafe: true,
    replies: 28,
    participants: 49,
    unanswered: 4,
    likes: 52,
    flags: 1,
    lastActiveISO: "2026-04-19T14:15:00",
    tags: ["youth", "parents", "travel", "child-safe"],
    signals: [
      {
        id: "sig-5",
        label: "Child-safe restrictions active",
        hint: "Direct replies between minors and unknown adults are blocked.",
        tone: "good",
      },
      {
        id: "sig-6",
        label: "Leader approval still pending",
        hint: "One updated travel note needs approval before publishing.",
        tone: "warn",
      },
    ],
  },
  {
    id: "CF-204",
    title: "Volunteers needed for outreach Saturday",
    excerpt:
      "Open thread for serving teams, transport coordination, prayer coverage, and outreach role confirmations.",
    body:
      "This is a healthy engagement thread with strong leader participation, low moderation risk, and direct links into the outreach event page and noticeboard. It is a good candidate for promotion in the next noticeboard sync.",
    category: "Events & Service",
    health: "Healthy",
    visibility: "Public",
    heroUrl: HERO_4,
    owner: "Outreach Desk",
    campus: "All campuses",
    languages: ["English"],
    linkedObject: "Event • Community Outreach Saturday",
    liveLinked: true,
    leaderPost: true,
    pinned: false,
    childSafe: false,
    replies: 53,
    participants: 89,
    unanswered: 5,
    likes: 132,
    flags: 0,
    lastActiveISO: "2026-04-19T16:50:00",
    tags: ["outreach", "volunteers", "event", "live-linked"],
    signals: [
      {
        id: "sig-7",
        label: "Registration intent is high",
        hint: "The linked event page received 18 new joins from this thread.",
        tone: "good",
      },
    ],
  },
  {
    id: "CF-205",
    title: "Share your testimony from the renewal series",
    excerpt:
      "Members are invited to share short stories of answered prayer, restored relationships, and moments from the renewal journey.",
    body:
      "This thread is performing well, but it needs clear approval routing before stories are featured publicly. Approved testimonies can move into the Testimonies page or into future live sessions as ministry moments.",
    category: "Testimonies",
    health: "Healthy",
    visibility: "Members",
    heroUrl: HERO_5,
    owner: "Story Team",
    campus: "Kampala Central",
    languages: ["English"],
    linkedObject: "Series • 40 Days of Renewal",
    liveLinked: true,
    leaderPost: false,
    pinned: true,
    childSafe: false,
    replies: 37,
    participants: 58,
    unanswered: 3,
    likes: 118,
    flags: 1,
    lastActiveISO: "2026-04-19T12:10:00",
    tags: ["testimony", "story", "renewal", "approval"],
    signals: [
      {
        id: "sig-8",
        label: "Feature-ready testimonies available",
        hint: "3 approved stories can be moved into the Testimonies pipeline.",
        tone: "good",
      },
    ],
  },
  {
    id: "CF-206",
    title: "Questions from live Q&A: baptism and next steps",
    excerpt:
      "A forum lane for unanswered questions from the recent live session on baptism, discipleship, and membership steps.",
    body:
      "This thread keeps live-session questions visible after the broadcast, but it currently carries duplicate comments and a few responses that should be merged or hidden. It is a strong candidate for a leader-pinned summary answer.",
    category: "General Discussion",
    health: "Needs moderation",
    visibility: "Public",
    heroUrl: HERO_1,
    owner: "Moderation Desk",
    campus: "Online Studio",
    languages: ["English", "French"],
    linkedObject: "Live Session • Baptism Q&A",
    liveLinked: true,
    leaderPost: false,
    pinned: false,
    childSafe: false,
    replies: 64,
    participants: 97,
    unanswered: 9,
    likes: 94,
    flags: 3,
    lastActiveISO: "2026-04-19T15:05:00",
    tags: ["q&a", "baptism", "next steps", "live-linked"],
    signals: [
      {
        id: "sig-9",
        label: "Duplicate answers detected",
        hint: "Pin a leader summary to reduce repeat replies.",
        tone: "warn",
      },
      {
        id: "sig-10",
        label: "Moderation queue attached",
        hint: "3 reported replies need review or merge actions.",
        tone: "danger",
      },
    ],
  },
];

const MODERATION_CASES: ModerationCase[] = [
  {
    id: "MC-1",
    threadId: "CF-202",
    title: "Personal health detail posted publicly",
    lane: "Prayer & Care",
    reason: "Contains unredacted personal identifiers and medical context.",
    owner: "Care moderator",
    severity: "Critical",
    ageLabel: "15 min ago",
  },
  {
    id: "MC-2",
    threadId: "CF-206",
    title: "Duplicate answer chain and off-topic replies",
    lane: "General Discussion",
    reason: "Thread needs merge, pin, or hide actions to restore clarity.",
    owner: "Community moderator",
    severity: "Priority",
    ageLabel: "42 min ago",
  },
  {
    id: "MC-3",
    threadId: "CF-203",
    title: "Leader approval missing on updated travel note",
    lane: "Youth & Family",
    reason: "Child-safe logistics update awaiting leader sign-off.",
    owner: "Youth lead",
    severity: "Watch",
    ageLabel: "1 hr ago",
  },
];

const LEADER_POSTS: LeaderPost[] = [
  {
    id: "LP-1",
    title: "Leader summary: grace in daily work",
    owner: "Pastor Ada N.",
    scheduledAt: "Today · 7:30 PM",
    status: "Ready",
    linkedObject: "Series • Everyday Grace",
  },
  {
    id: "LP-2",
    title: "Youth camp parent update and arrival checklist",
    owner: "Youth Desk",
    scheduledAt: "Tomorrow · 9:00 AM",
    status: "Awaiting review",
    linkedObject: "Event • Youth Camp Weekend",
  },
  {
    id: "LP-3",
    title: "Pinned answer: baptism next steps",
    owner: "Pastoral Office",
    scheduledAt: "Tomorrow · 12:30 PM",
    status: "Scheduled",
    linkedObject: "Live Session • Baptism Q&A",
  },
];

const TEMPLATE_CARDS: TemplateCard[] = [
  {
    id: "tpl-series",
    title: "Series follow-up thread",
    subtitle:
      "Create a leader-led discussion thread tied to a teaching series, replay, or live-session moment.",
    accent: "green",
    prefill: {
      title: "Series follow-up: what stood out for you this week?",
      excerpt: "Share one scripture, one application point, and one prayer request from the teaching.",
      category: "Series Follow-up",
    },
  },
  {
    id: "tpl-prayer",
    title: "Prayer & care lane",
    subtitle:
      "Open a moderated prayer thread with follow-up routing, privacy guidance, and care-lead ownership.",
    accent: "orange",
    prefill: {
      title: "Prayer support and follow-up for this week",
      excerpt: "Post prayer needs, answered updates, or practical care requests. A moderator will route urgent items.",
      category: "Prayer & Care",
    },
  },
  {
    id: "tpl-youth",
    title: "Youth parent update",
    subtitle:
      "Child-safe update format for parents, leaders, travel notes, and volunteer reminders.",
    accent: "navy",
    prefill: {
      title: "Youth update: parent notes and confirmed timings",
      excerpt: "Use this lane for approved logistics, reminders, and child-safe responses only.",
      category: "Youth & Family",
    },
  },
  {
    id: "tpl-testimony",
    title: "Testimony prompt",
    subtitle:
      "Invite stories, answered prayer moments, and feature-worthy reflections with approval routing.",
    accent: "green",
    prefill: {
      title: "Share your testimony or answered prayer",
      excerpt: "Post a short story of what God has done, and our team will help route feature-ready stories.",
      category: "Testimonies",
    },
  },
];

function toneForHealth(health: ThreadHealth): Tone {
  if (health === "Healthy") return "good";
  if (health === "Watch") return "warn";
  return "danger";
}

function toneForSeverity(severity: ModerationCase["severity"]): Tone {
  if (severity === "Critical") return "danger";
  if (severity === "Priority") return "warn";
  return "navy";
}

function Pill({
  tone = "neutral",
  children,
  title,
}: {
  tone?: Tone;
  children: React.ReactNode;
  title?: string;
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
      ? "bg-[#172554] text-white ring-[#172554]"
      : "bg-neutral-100 text-neutral-800 ring-neutral-200";

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

function Button({
  tone = "neutral",
  children,
  left,
  onClick,
  disabled,
  className,
  title,
}: {
  tone?: "neutral" | "primary" | "ghost" | "danger";
  children: React.ReactNode;
  left?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  title?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-3.5 py-2 text-[12px] font-extrabold transition focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50 disabled:cursor-not-allowed";
  const cls =
    tone === "primary"
      ? "text-white hover:brightness-95"
      : tone === "danger"
      ? "bg-rose-600 text-white hover:brightness-95"
      : tone === "ghost"
      ? "bg-transparent text-slate-900 hover:bg-slate-100"
      : "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50";

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cx(base, cls, className)}
      style={tone === "primary" ? { background: EV_GREEN } : undefined}
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
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent: "green" | "orange" | "navy";
}) {
  return <KpiTile label={label} value={value} hint={hint} tone={accent} size="compact" />;
}

function ThreadRow({
  thread,
  selected,
  onSelect,
}: {
  thread: ThreadRecord;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cx(
        "w-full rounded-[26px] border p-4 text-left transition",
        selected
          ? "border-[rgba(3,205,140,0.45)] bg-[rgba(3,205,140,0.10)] shadow-sm"
          : "border-slate-200 bg-white hover:bg-slate-50",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cx(
            "h-16 w-16 shrink-0 rounded-[20px] grid place-items-center text-white font-black text-[11px] uppercase leading-tight",
            thread.health === "Healthy"
              ? "bg-[rgba(3,205,140,1)]"
              : thread.health === "Needs moderation"
              ? "bg-[rgba(247,127,0,1)]"
              : "bg-[#172554]",
          )}
        >
          <span>{thread.category.split(" ")[0]}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="truncate text-[15px] font-black text-slate-900">
              {thread.title}
            </div>
            {thread.pinned ? <Pill tone="brand">Pinned</Pill> : null}
            {thread.leaderPost ? <Pill tone="navy">Leader post</Pill> : null}
            {thread.childSafe ? <Pill tone="good">Child-safe</Pill> : null}
          </div>
          <div className="mt-1 text-[12px] text-slate-500">
            {thread.category} • {thread.campus} • {thread.languages.join(" + ")}
          </div>
          <div className="mt-2 line-clamp-2 text-[13px] leading-snug text-slate-700">
            {thread.excerpt}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Pill tone={toneForHealth(thread.health)}>{thread.health}</Pill>
            <Pill>{thread.visibility}</Pill>
            <Pill>{fmtInt(thread.replies)} replies</Pill>
            <Pill>{fmtInt(thread.participants)} participants</Pill>
            {thread.flags > 0 ? <Pill tone="warn">{thread.flags} flags</Pill> : null}
          </div>
        </div>
      </div>
    </button>
  );
}

function ModerationDrawer({
  open,
  onClose,
  cases,
  threads,
}: {
  open: boolean;
  onClose: () => void;
  cases: ModerationCase[];
  threads: ThreadRecord[];
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-hidden bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <div>
            <div className="text-[14px] font-black text-slate-900">Moderation command lane</div>
            <div className="text-[11px] text-slate-500">
              Resolve reported threads, child-safe approvals, and leader-review blockers.
            </div>
          </div>
          <Button tone="ghost" left={<X className="h-4 w-4" />} onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="h-[calc(100%-76px)] overflow-y-auto p-4">
          <div className="grid gap-3">
            {cases.map((item) => {
              const thread = threads.find((t) => t.id === item.threadId);
              return (
                <div
                  key={item.id}
                  className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="truncate text-[14px] font-black text-slate-900">
                          {item.title}
                        </div>
                        <Pill tone={toneForSeverity(item.severity)}>{item.severity}</Pill>
                      </div>
                      <div className="mt-1 text-[12px] text-slate-500">
                        {thread?.title || item.lane} • {item.owner} • {item.ageLabel}
                      </div>
                      <div className="mt-2 text-[13px] leading-snug text-slate-700">
                        {item.reason}
                      </div>
                    </div>
                    <ShieldCheck className="h-5 w-5 shrink-0 text-slate-400" />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Button tone="primary" left={<CheckCircle2 className="h-4 w-4" />}>
                      Resolve case
                    </Button>
                    <Button left={<Pin className="h-4 w-4" />}>Pin guidance</Button>
                    <Button left={<ExternalLink className="h-4 w-4" />}>Open thread</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}

function PreviewDrawer({
  open,
  onClose,
  thread,
}: {
  open: boolean;
  onClose: () => void;
  thread: ThreadRecord | undefined;
}) {
  if (!open || !thread) return null;

  return (
    <div className="fixed inset-0 z-[85]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 overflow-auto bg-[#f5f7fa] p-4 md:p-6">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <div className="text-[15px] font-black text-slate-900">Community Forum preview</div>
              <div className="text-[11px] text-slate-500">
                Desktop + member-facing layout for the selected thread.
              </div>
            </div>
            <Button tone="ghost" left={<X className="h-4 w-4" />} onClick={onClose}>
              Close
            </Button>
          </div>

          <div className="grid gap-5 p-5 lg:grid-cols-[1.6fr_0.9fr]">
            <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white">
              <div className="relative h-56 overflow-hidden bg-[#172554]">
                <img src={thread.heroUrl} alt={thread.title} className="h-full w-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#172554] via-[#172554]/80 to-transparent" />
                <div className="absolute left-5 top-5">
                  <Pill tone="navy">Community Forum</Pill>
                </div>
                <div className="absolute right-5 top-5 flex items-center gap-2">
                  {thread.pinned ? <Pill tone="brand">Pinned</Pill> : null}
                  {thread.leaderPost ? <Pill tone="good">Leader-led</Pill> : null}
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="text-[28px] font-black leading-tight text-white">
                    {thread.title}
                  </div>
                  <div className="mt-2 max-w-3xl text-[14px] text-white/85">
                    {thread.excerpt}
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone={toneForHealth(thread.health)}>{thread.health}</Pill>
                  <Pill>{thread.category}</Pill>
                  <Pill>{thread.visibility}</Pill>
                  <Pill>{thread.languages.join(" + ")}</Pill>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-[11px] uppercase tracking-[0.08em] text-slate-400">Participants</div>
                    <div className="mt-1 text-[22px] font-black text-slate-900">{fmtInt(thread.participants)}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-[11px] uppercase tracking-[0.08em] text-slate-400">Replies</div>
                    <div className="mt-1 text-[22px] font-black text-slate-900">{fmtInt(thread.replies)}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-[11px] uppercase tracking-[0.08em] text-slate-400">Unanswered</div>
                    <div className="mt-1 text-[22px] font-black text-slate-900">{fmtInt(thread.unanswered)}</div>
                  </div>
                </div>

                <div className="mt-5 rounded-[26px] border border-slate-200 bg-white p-4">
                  <div className="text-[12px] font-black uppercase tracking-[0.08em] text-slate-400">
                    Opening post
                  </div>
                  <div className="mt-3 text-[15px] leading-relaxed text-slate-800">{thread.body}</div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[28px] border border-slate-200 bg-white p-4">
                <div className="text-[12px] font-black uppercase tracking-[0.08em] text-slate-400">
                  Member actions
                </div>
                <div className="mt-4 grid gap-2">
                  <Button tone="primary" left={<MessageSquare className="h-4 w-4" />}>
                    Join thread
                  </Button>
                  <Button left={<Bell className="h-4 w-4" />}>Follow updates</Button>
                  <Button left={<Link2 className="h-4 w-4" />}>Copy member link</Button>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-4">
                <div className="text-[12px] font-black uppercase tracking-[0.08em] text-slate-400">
                  Forum context
                </div>
                <div className="mt-3 grid gap-2 text-[13px] text-slate-700">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                    Linked object • <span className="font-bold">{thread.linkedObject}</span>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                    Last active • <span className="font-bold">{fmtLocal(thread.lastActiveISO)}</span>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                    Owner • <span className="font-bold">{thread.owner}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-4">
                <div className="text-[12px] font-black uppercase tracking-[0.08em] text-slate-400">
                  Signals
                </div>
                <div className="mt-3 grid gap-2">
                  {thread.signals.map((signal) => (
                    <div
                      key={signal.id}
                      className={cx(
                        "rounded-full border px-3 py-2 text-[12px]",
                        signal.tone === "good"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : signal.tone === "warn"
                          ? "border-amber-200 bg-amber-50 text-amber-900"
                          : "border-rose-200 bg-rose-50 text-rose-800",
                      )}
                    >
                      {signal.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CommunityForumPage() {
  const [threads, setThreads] = useState<ThreadRecord[]>(INITIAL_THREADS);
  const [selectedThreadId, setSelectedThreadId] = useState<string>(INITIAL_THREADS[0]?.id || "");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All categories");
  const [laneFilter, setLaneFilter] = useState<LaneFilter>("All");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [moderationOpen, setModerationOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [composerTitle, setComposerTitle] = useState(
    "Leader prompt: what is your takeaway from this week’s live session?",
  );
  const [composerExcerpt, setComposerExcerpt] = useState(
    "Invite the community to share one insight, one question, and one prayer point.",
  );
  const [composerCategory, setComposerCategory] = useState<Exclude<CategoryFilter, "All categories">>(
    "Series Follow-up",
  );

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const filteredThreads = useMemo(() => {
    return threads.filter((thread) => {
      const q = search.trim().toLowerCase();
      const searchMatch =
        !q ||
        [
          thread.title,
          thread.excerpt,
          thread.owner,
          thread.category,
          thread.linkedObject,
          ...thread.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const categoryMatch =
        category === "All categories" ? true : thread.category === category;

      const laneMatch =
        laneFilter === "All"
          ? true
          : laneFilter === "Leader posts"
          ? thread.leaderPost
          : laneFilter === "Needs moderation"
          ? thread.health === "Needs moderation" || thread.flags > 0
          : laneFilter === "Pinned"
          ? thread.pinned
          : thread.childSafe;

      return searchMatch && categoryMatch && laneMatch;
    });
  }, [threads, search, category, laneFilter]);

  const selectedThread = useMemo(() => {
    const current = filteredThreads.find((thread) => thread.id === selectedThreadId);
    return current || filteredThreads[0] || threads[0];
  }, [filteredThreads, selectedThreadId, threads]);

  useEffect(() => {
    if (selectedThread && selectedThread.id !== selectedThreadId) {
      setSelectedThreadId(selectedThread.id);
    }
  }, [selectedThread, selectedThreadId]);

  const metrics = useMemo(() => {
    const active = threads.length;
    const pinned = threads.filter((thread) => thread.pinned).length;
    const moderation = threads.filter(
      (thread) => thread.health === "Needs moderation" || thread.flags > 0,
    ).length;
    const leaderPosts = threads.filter((thread) => thread.leaderPost).length;
    const unanswered = threads.reduce((sum, thread) => sum + thread.unanswered, 0);
    const childSafe = threads.filter((thread) => thread.childSafe).length;
    return { active, pinned, moderation, leaderPosts, unanswered, childSafe };
  }, [threads]);

  const moderationCounts = useMemo(() => {
    return {
      needsModeration: threads.filter(
        (thread) => thread.health === "Needs moderation" || thread.flags > 0,
      ).length,
      leaderReplies: threads.filter((thread) => thread.unanswered >= 6).length,
      childSafe: threads.filter((thread) => thread.childSafe).length,
      liveLinked: threads.filter((thread) => thread.liveLinked).length,
    };
  }, [threads]);

  const quickApplyTemplate = (template: TemplateCard) => {
    setComposerTitle(template.prefill.title);
    setComposerExcerpt(template.prefill.excerpt);
    setComposerCategory(template.prefill.category);
    setToast(`${template.title} template loaded`);
  };

  const handlePinSelected = () => {
    if (!selectedThread) return;
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === selectedThread.id
          ? { ...thread, pinned: !thread.pinned }
          : thread,
      ),
    );
    setToast(selectedThread.pinned ? "Thread unpinned" : "Thread pinned");
  };

  const handleCopyThreadLink = async () => {
    if (!selectedThread) return;
    const link = `https://faithhub.app/forum/${selectedThread.id.toLowerCase()}`;
    try {
      await navigator.clipboard?.writeText(link);
      setToast("Thread link copied");
    } catch {
      setToast("Could not copy link");
    }
  };

  const handlePublishLeaderPost = () => {
    setToast("Leader post queued for publishing");
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-slate-900">
      <div className="mx-auto max-w-[1600px] px-5 py-5">
        <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-sm"
                  style={{ background: EV_GREEN }}
                >
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="mt-2 text-[28px] font-black leading-[1.04] tracking-[-0.03em] text-slate-900 dark:text-slate-100 sm:text-[34px] lg:text-[40px]">
                    Community Forum
                  </div>
                  <div className="mt-1.5 text-[14px] leading-6 text-slate-500 dark:text-slate-400">
                    Moderated discussion hub for threads, leader posts, and community engagement.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 xl:items-end">
              <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                <Pill>Moderated</Pill>
                <Pill>Leader posts</Pill>
                <Pill>Live-linked</Pill>
                <Pill>Child-safe</Pill>
              </div>
              <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                <Button left={<Eye className="h-4 w-4" />} onClick={() => setPreviewOpen(true)}>
                  Preview
                </Button>
                <Button left={<Pin className="h-4 w-4" />} onClick={handlePinSelected}>
                  Pin Thread
                </Button>
                <Button left={<ShieldCheck className="h-4 w-4" />} onClick={() => setModerationOpen(true)}>
                  Open Moderation
                </Button>
                <Button tone="primary" left={<Plus className="h-4 w-4" />} onClick={() => safeNav(ROUTES.newTopic)}>
                  + New Topic
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[30px] border border-slate-200 bg-white px-4 py-3 text-[14px] text-slate-500 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-3">
              <Pill tone="brand">FORUM TRUST PULSE</Pill>
              <span>{metrics.moderation} threads need moderation review</span>
              <span>•</span>
              <span>{LEADER_POSTS.filter((post) => post.status === "Ready").length} leader posts are ready to publish</span>
              <span>•</span>
              <span>{moderationCounts.liveLinked} discussion lanes are linked to live follow-up</span>
            </div>
            <div className="text-[11px] uppercase tracking-[0.08em] text-slate-400">
              PREMIUM COMMUNITY OPS
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <MetricCard
            label="Active threads"
            value={String(metrics.active)}
            hint="Discussion lanes currently visible across the institution."
            accent="green"
          />
          <MetricCard
            label="Pinned topics"
            value={String(metrics.pinned)}
            hint="Threads elevated into leader-led or board-priority surfaces."
            accent="green"
          />
          <MetricCard
            label="Leader posts"
            value={String(metrics.leaderPosts)}
            hint="Threads started or governed directly by leadership teams."
            accent="navy"
          />
          <MetricCard
            label="Moderation queue"
            value={String(metrics.moderation)}
            hint="Threads carrying reports, approval gaps, or safety review needs."
            accent="orange"
          />
          <MetricCard
            label="Unanswered"
            value={fmtInt(metrics.unanswered)}
            hint="Community questions and follow-up gaps still awaiting response."
            accent="orange"
          />
          <MetricCard
            label="Child-safe lanes"
            value={String(metrics.childSafe)}
            hint="Youth or family discussion spaces using stricter safeguards."
            accent="navy"
          />
        </div>

        <div className="mt-4 rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-[18px] font-black tracking-[-0.02em] text-slate-900">
            Search and filter the forum
          </div>
          <div className="mt-1 text-[14px] text-slate-500">
            Move between categories, pinned threads, leader posts, moderation cases, and child-safe lanes without leaving the provider workspace.
          </div>
          <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search threads, categories, owners, linked objects, or keywords"
                className="h-12 w-full rounded-[22px] border border-slate-200 bg-slate-50 pl-11 pr-4 text-[14px] outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button left={<Filter className="h-4 w-4" />}>{category}</Button>
              <Button left={<LayoutGrid className="h-4 w-4" />}>{laneFilter}</Button>
              <Button left={<Globe2 className="h-4 w-4" />}>English</Button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {CATEGORY_ORDER.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={cx(
                  "rounded-full border px-3 py-1.5 text-[12px] font-bold transition",
                  category === item
                    ? "border-[rgba(3,205,140,0.45)] bg-[rgba(3,205,140,0.12)] text-slate-900"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
                )}
              >
                {item}
              </button>
            ))}
            {(["All", "Leader posts", "Needs moderation", "Pinned", "Child-safe"] as LaneFilter[]).map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLaneFilter(item)}
                  className={cx(
                    "rounded-full border px-3 py-1.5 text-[12px] font-bold transition",
                    laneFilter === item
                      ? "border-[rgba(247,127,0,0.45)] bg-[rgba(247,127,0,0.10)] text-slate-900"
                      : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
                  )}
                >
                  {item}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_1fr_0.78fr]">
          <div className="grid gap-4">
            <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[18px] font-black tracking-[-0.02em] text-slate-900">
                    Forum threads catalog
                  </div>
                  <div className="mt-1 text-[14px] text-slate-500">
                    Premium moderated thread library for discussions, live follow-up, testimony prompts, and prayer-care lanes.
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Pill>{fmtInt(filteredThreads.length)} threads</Pill>
                  <Pill>{category}</Pill>
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                {filteredThreads.map((thread) => (
                  <ThreadRow
                    key={thread.id}
                    thread={thread}
                    selected={selectedThread?.id === thread.id}
                    onSelect={() => setSelectedThreadId(thread.id)}
                  />
                ))}
                {!filteredThreads.length ? (
                  <div className="rounded-[26px] border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-[14px] text-slate-500">
                    No threads match the current filters.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[18px] font-black tracking-[-0.02em] text-slate-900">
                    Quick-create templates
                  </div>
                  <div className="mt-1 text-[14px] text-slate-500">
                    Launch premium conversation formats faster while preserving moderation structure, leader voice, and linked-object context.
                  </div>
                </div>
                <Pill tone="good">FORUM TEMPLATES</Pill>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {TEMPLATE_CARDS.map((template) => (
                  <div
                    key={template.id}
                    className="rounded-[24px] border border-slate-200 bg-white p-4"
                  >
                    <div
                      className="mb-3 h-1.5 w-16 rounded-full"
                      style={{
                        background:
                          template.accent === "green"
                            ? EV_GREEN
                            : template.accent === "orange"
                            ? EV_ORANGE
                            : EV_NAVY,
                      }}
                    />
                    <div className="text-[16px] font-black tracking-[-0.02em] text-slate-900">
                      {template.title}
                    </div>
                    <div className="mt-1 text-[13px] leading-snug text-slate-500">
                      {template.subtitle}
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-400">Template loads into the leader composer.</div>
                      <button
                        type="button"
                        onClick={() => quickApplyTemplate(template)}
                        className="text-[13px] font-black text-[#f77f00]"
                      >
                        Use template
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[18px] font-black tracking-[-0.02em] text-slate-900">
                    Categories & moderation lane
                  </div>
                  <div className="mt-1 text-[14px] text-slate-500">
                    Operational signals for what needs review, reply coverage, child-safe approval, or live-linked follow-up.
                  </div>
                </div>
                <Pill tone="brand">Action now</Pill>
              </div>
              <div className="mt-4 grid gap-2">
                <div className="rounded-full border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-900 flex items-center justify-between">
                  <span>Needs moderation</span>
                  <span className="rounded-full border border-amber-200 px-2 py-0.5 text-[12px] font-black">{moderationCounts.needsModeration}</span>
                </div>
                <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-800 flex items-center justify-between">
                  <span>Live-linked threads</span>
                  <span className="rounded-full border border-emerald-200 px-2 py-0.5 text-[12px] font-black">{moderationCounts.liveLinked}</span>
                </div>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] text-slate-700 flex items-center justify-between">
                  <span>Leader replies needed</span>
                  <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[12px] font-black">{moderationCounts.leaderReplies}</span>
                </div>
                <div className="rounded-full border border-[#172554]/20 bg-[rgba(23,37,84,0.06)] px-4 py-3 text-[13px] text-[#172554] flex items-center justify-between">
                  <span>Child-safe review</span>
                  <span className="rounded-full border border-[#172554]/20 px-2 py-0.5 text-[12px] font-black">{moderationCounts.childSafe}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[18px] font-black tracking-[-0.02em] text-slate-900">
                    Selected thread detail
                  </div>
                  <div className="mt-1 text-[14px] text-slate-500">
                    Full thread context, moderation history, linked-object bridges, and provider-facing action controls.
                  </div>
                </div>
                <Button left={<Copy className="h-4 w-4" />} onClick={handleCopyThreadLink}>
                  Copy link
                </Button>
              </div>

              {selectedThread ? (
                <div className="mt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill tone={toneForHealth(selectedThread.health)}>{selectedThread.health}</Pill>
                    <Pill>{selectedThread.category}</Pill>
                    <Pill>{selectedThread.visibility}</Pill>
                    {selectedThread.pinned ? <Pill tone="brand">Pinned</Pill> : null}
                    {selectedThread.childSafe ? <Pill tone="good">Child-safe</Pill> : null}
                  </div>
                  <div className="mt-3 text-[26px] font-black leading-tight tracking-[-0.03em] text-slate-900">
                    {selectedThread.title}
                  </div>
                  <div className="mt-2 text-[15px] leading-relaxed text-slate-500">
                    {selectedThread.body}
                  </div>

                  <div className="mt-4 grid gap-2 md:grid-cols-2">
                    <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="text-[11px] uppercase tracking-[0.08em] text-slate-400">Owner</div>
                      <div className="mt-1 text-[15px] font-black text-slate-900">{selectedThread.owner}</div>
                      <div className="text-[12px] text-slate-500">{selectedThread.campus}</div>
                    </div>
                    <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="text-[11px] uppercase tracking-[0.08em] text-slate-400">Linked object</div>
                      <div className="mt-1 text-[15px] font-black text-slate-900">{selectedThread.linkedObject}</div>
                      <div className="text-[12px] text-slate-500">Last active {fmtLocal(selectedThread.lastActiveISO)}</div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2">
                    {selectedThread.signals.map((signal) => (
                      <div
                        key={signal.id}
                        className={cx(
                          "rounded-full border px-3 py-2 text-[12px]",
                          signal.tone === "good"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                            : signal.tone === "warn"
                            ? "border-amber-200 bg-amber-50 text-amber-900"
                            : "border-rose-200 bg-rose-50 text-rose-800",
                        )}
                      >
                        <span className="font-black">{signal.label}</span> • {signal.hint}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Button tone="primary" left={<Pin className="h-4 w-4" />} onClick={handlePinSelected}>
                      {selectedThread.pinned ? "Unpin" : "Pin thread"}
                    </Button>
                    <Button left={<ShieldCheck className="h-4 w-4" />} onClick={() => setModerationOpen(true)}>
                      Open moderation
                    </Button>
                    <Button left={<ExternalLink className="h-4 w-4" />} onClick={() => safeNav(ROUTES.noticeboard)}>
                      Sync to Noticeboard
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[18px] font-black tracking-[-0.02em] text-slate-900">
                    Forum destination preview
                  </div>
                  <div className="mt-1 text-[14px] text-slate-500">
                    Persistent preview rail for the selected thread across desktop and mobile member surfaces.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("desktop")}
                    className={cx(
                      "rounded-full border px-3 py-1.5 text-[12px] font-bold",
                      previewMode === "desktop"
                        ? "border-[#172554] bg-[#172554] text-white"
                        : "border-slate-200 bg-white text-slate-500",
                    )}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("mobile")}
                    className={cx(
                      "rounded-full border px-3 py-1.5 text-[12px] font-bold",
                      previewMode === "mobile"
                        ? "border-[#172554] bg-[#172554] text-white"
                        : "border-slate-200 bg-white text-slate-500",
                    )}
                  >
                    Mobile
                  </button>
                </div>
              </div>

              {selectedThread ? (
                <div className="mt-4">
                  <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white">
                    <div className="relative h-24 bg-[#172554]">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#172554] to-[#1e3a8a]" />
                      <div className="absolute left-4 top-4 text-[11px] font-black uppercase tracking-[0.08em] text-white/65">
                        Community Forum
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                        <div className="min-w-0 text-[14px] font-black leading-tight text-white">
                          {selectedThread.title}
                        </div>
                        {selectedThread.pinned ? <Pill tone="brand">Pinned</Pill> : null}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-[11px] text-slate-400">{previewMode === "desktop" ? "Desktop forum preview" : "Mobile preview"}</div>
                      <div className="mt-2 text-[14px] font-black text-slate-900">{selectedThread.excerpt}</div>
                      <div className="mt-2 text-[12px] text-slate-500">
                        {selectedThread.owner} • {selectedThread.category} • {selectedThread.campus}
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Button tone="primary" left={<MessageSquare className="h-4 w-4" />}>
                          Join thread
                        </Button>
                        <Button left={<Bell className="h-4 w-4" />}>Follow</Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Button left={<MonitorPlay className="h-4 w-4" />} onClick={() => setPreviewOpen(true)}>
                      Open large preview
                    </Button>
                    <Button left={<Link2 className="h-4 w-4" />} onClick={handleCopyThreadLink}>
                      Copy thread link
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-[18px] font-black tracking-[-0.02em] text-slate-900">
                Leader post composer
              </div>
              <div className="mt-1 text-[14px] text-slate-500">
                Draft leadership prompts, schedule future threads, and keep forum governance close to the moderation lane.
              </div>
              <div className="mt-4 grid gap-3">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-400">Title</div>
                  <input
                    value={composerTitle}
                    onChange={(e) => setComposerTitle(e.target.value)}
                    className="mt-1 h-11 w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 text-[13px] outline-none focus:border-slate-300"
                  />
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-400">Summary</div>
                  <textarea
                    value={composerExcerpt}
                    onChange={(e) => setComposerExcerpt(e.target.value)}
                    rows={4}
                    className="mt-1 w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] outline-none focus:border-slate-300"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Pill>{composerCategory}</Pill>
                  <Pill tone="navy">Leader thread</Pill>
                  <Pill tone="good">Approval lane ready</Pill>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button tone="primary" left={<Send className="h-4 w-4" />} onClick={handlePublishLeaderPost}>
                    Publish leader post
                  </Button>
                  <Button left={<CalendarClock className="h-4 w-4" />}>Schedule</Button>
                  <Button left={<Zap className="h-4 w-4" />}>Open workflow</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-[18px] font-black tracking-[-0.02em] text-slate-900">
              Forum collections & trust signals
            </div>
            <div className="mt-1 text-[14px] text-slate-500">
              What this community space is doing well, where trust needs protection, and which cross-object bridges are ready now.
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[16px] font-black tracking-[-0.02em] text-slate-900">Forum health</div>
                  <Pill tone="good">81%</Pill>
                </div>
                <div className="mt-2 text-[13px] text-slate-500">
                  Leader-post coverage is strong and community sentiment is stable across the top discussion lanes.
                </div>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[16px] font-black tracking-[-0.02em] text-slate-900">Noticeboard bridge</div>
                  <Pill tone="brand">Ready</Pill>
                </div>
                <div className="mt-2 text-[13px] text-slate-500">
                  2 pinned threads can be routed into Noticeboard or linked into live-session waiting rooms.
                </div>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[16px] font-black tracking-[-0.02em] text-slate-900">Prayer & care risk</div>
                  <Pill tone="warn">Watch</Pill>
                </div>
                <div className="mt-2 text-[13px] text-slate-500">
                  Prayer lanes need quicker response ownership and stronger privacy triage when health details appear.
                </div>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[16px] font-black tracking-[-0.02em] text-slate-900">Live-session hooks</div>
                  <Pill tone="good">Linked</Pill>
                </div>
                <div className="mt-2 text-[13px] text-slate-500">
                  Several threads are already feeding post-live follow-up, replay questions, and event-response moments.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-[18px] font-black tracking-[-0.02em] text-slate-900">
              Leader posts & governance
            </div>
            <div className="mt-1 text-[14px] text-slate-500">
              Keep visibility on scheduled leadership threads, approval blockers, and topic ownership.
            </div>
            <div className="mt-4 grid gap-3">
              {LEADER_POSTS.map((post) => (
                <div
                  key={post.id}
                  className="rounded-[24px] border border-slate-200 bg-white px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-[15px] font-black tracking-[-0.02em] text-slate-900">
                        {post.title}
                      </div>
                      <div className="mt-1 text-[12px] text-slate-500">
                        {post.owner} • {post.scheduledAt} • {post.linkedObject}
                      </div>
                    </div>
                    <Pill
                      tone={
                        post.status === "Ready"
                          ? "good"
                          : post.status === "Awaiting review"
                          ? "warn"
                          : "navy"
                      }
                    >
                      {post.status}
                    </Pill>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-full border border-[rgba(3,205,140,0.35)] bg-[rgba(3,205,140,0.10)] px-4 py-2 text-center text-[12px] text-slate-600 shadow-sm">
          Preview
        </div>
      </div>

      <ModerationDrawer
        open={moderationOpen}
        onClose={() => setModerationOpen(false)}
        cases={MODERATION_CASES}
        threads={threads}
      />
      <PreviewDrawer
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        thread={selectedThread}
      />

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-[95] -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-[12px] font-bold text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}









