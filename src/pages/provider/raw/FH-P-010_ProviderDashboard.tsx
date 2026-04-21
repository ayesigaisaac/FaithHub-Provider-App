// @ts-nocheck

"use client";

import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Bell,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  DollarSign,
  Filter,
  Flag,
  Globe2,
  HeartHandshake,
  LayoutDashboard,
  Layers3,
  Megaphone,
  MessageSquare,
  MonitorPlay,
  Plus,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Video,
  Wallet,
  Zap,
} from "lucide-react";
import { KpiTile } from "../../../components/ui/KpiTile";
import { navigateWithRouter } from "@/navigation/routerNavigate";
import { ProviderPageTitle } from "@/components/provider/ProviderPageTitle";

/**
 * Provider — Provider Dashboard
 * --------------------------------------
 * Premium provider-side mission control page.
 *
 * Design intent
 * - Evolve the older Provider Dashboard screenshots into a richer, more premium
 *   control surface while preserving their approachable dashboard shape:
 *   command hero, profile summary, notifications, quick filters, and analytics.
 * - Use EVzone Green as the primary accent and Orange as the secondary accent.
 * - Represent the full Provider Dashboard blueprint:
 *   executive command header, quick-create rail, live operations, content pipeline,
 *   audience summary, giving snapshot, Beacon performance, trust queue,
 *   and role-aware insight cards.
 * - Keep the component self-contained and easy to adapt inside the Provider provider shell.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#16244c";

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

type RoleKey =
  | "Leadership"
  | "Production"
  | "Outreach"
  | "Finance"
  | "Promotion"
  | "Moderation";

type Tone = "neutral" | "good" | "warn" | "danger" | "brand" | "navy";

type MetricCard = {
  id: string;
  label: string;
  value: string;
  hint: string;
  delta?: string;
  accent?: "green" | "orange" | "navy";
};

type LiveStatus = "Ready" | "At risk" | "Blocked";
type HealthStatus = "Healthy" | "Watching" | "Degraded";

type LiveSessionRow = {
  id: string;
  title: string;
  time: string;
  campus: string;
  audience: string;
  readiness: LiveStatus;
  health: HealthStatus;
  backstage: string;
  warning?: string;
};

type PipelineItem = {
  id: string;
  title: string;
  type: string;
  status: "Draft" | "Missing assets" | "Ready to publish" | "Clip opportunity" | "Awaiting review";
  owner: string;
  due: string;
};

type AudienceStat = {
  id: string;
  label: string;
  value: string;
  sublabel: string;
  tone?: Tone;
};

type CampaignSnapshot = {
  id: string;
  title: string;
  type: string;
  amount: string;
  progress: number;
  status: "Active" | "Urgent" | "Stable" | "Ending soon";
};

type BeaconItem = {
  id: string;
  title: string;
  mode: "Linked" | "Standalone";
  spend: string;
  outcome: string;
  status: "Learning" | "Healthy" | "Needs approval" | "Fatigue risk";
};

type TrustCase = {
  id: string;
  title: string;
  source: string;
  priority: "Critical" | "High" | "Medium";
  owner: string;
};

type NotificationItem = {
  id: string;
  title: string;
  detail: string;
  badge: string;
  tone: Tone;
};

type ContinueItem = {
  id: string;
  label: string;
  detail: string;
  cta: string;
};

type QuickCreateAction = {
  id: string;
  label: string;
  detail: string;
  icon: React.ReactNode;
  accent: "green" | "orange" | "navy";
};

const ROLES: RoleKey[] = [
  "Leadership",
  "Production",
  "Outreach",
  "Finance",
  "Promotion",
  "Moderation",
];

const CAMPUSES = [
  "All campuses",
  "Kampala Central",
  "East Campus",
  "Online Studio",
  "Youth Hall",
];

const LANGUAGES = [
  "English",
  "Swahili",
  "French",
  "Arabic",
  "Portuguese",
];

const ROUTES = {
  providerDashboard: "/faithhub/provider/dashboard",
  teachingsDashboard: "/faithhub/provider/teachings-dashboard",
  liveBuilder: "/faithhub/provider/live-builder",
  liveSchedule: "/faithhub/provider/live-schedule",
  liveDashboard: "/faithhub/provider/live-dashboard",
  liveStudio: "/faithhub/provider/live-studio",
  audienceNotifications: "/faithhub/provider/audience-notifications",
  channelsContactManager: "/faithhub/provider/channels-contact-manager",
  donationsFunds: "/faithhub/provider/donations-and-funds",
  charityCrowdfund: "/faithhub/provider/charity-crowdfunding-workbench",
  beaconDashboard: "/faithhub/provider/beacon-dashboard",
  beaconBuilder: "/faithhub/provider/beacon-builder",
  beaconManager: "/faithhub/provider/beacon-manager",
  replaysClips: "/faithhub/provider/replays-and-clips",
  reviewsModeration: "/faithhub/provider/reviews-moderation",
  eventsManager: "/faithhub/provider/events-manager",
} as const;

function safeNav(path: string) {
  navigateWithRouter(path);
}

const EXECUTIVE_METRICS: Record<RoleKey, MetricCard[]> = {
  Leadership: [
    {
      id: "followers",
      label: "Followers",
      value: "28.4k",
      hint: "Cross-campus audience growth this month",
      delta: "+6.8%",
      accent: "green",
    },
    {
      id: "live",
      label: "Upcoming live sessionz",
      value: "7",
      hint: "Including today, this weekend, and two translated streams",
      delta: "2 at risk",
      accent: "navy",
    },
    {
      id: "replays",
      label: "Replay watch starts",
      value: "12.9k",
      hint: "Series, standalone teachings, and event replays",
      delta: "+11%",
      accent: "orange",
    },
    {
      id: "giving",
      label: "Donations + funds",
      value: "$16,010",
      hint: "Across standard funds and active campaigns",
      delta: "+4.2%",
      accent: "green",
    },
    {
      id: "events",
      label: "Event registrations",
      value: "142",
      hint: "Upcoming conference, outreach day, and discipleship class",
      delta: "17 pending check-in",
      accent: "navy",
    },
    {
      id: "beacon",
      label: "Beacon reach",
      value: "186k",
      hint: "Linked and standalone Beacon campaigns this week",
      delta: "+8 campaigns",
      accent: "orange",
    },
  ],
  Production: [
    {
      id: "live-ready",
      label: "Ready to go live",
      value: "4",
      hint: "Sessions that passed preflight and destination checks",
      delta: "1 at risk",
      accent: "green",
    },
    {
      id: "backstage",
      label: "Backstage coverage",
      value: "92%",
      hint: "Hosts, moderators, captioners, and interpreters staffed",
      delta: "2 gaps",
      accent: "navy",
    },
    {
      id: "health",
      label: "Stream health",
      value: "97%",
      hint: "Average ingest, bitrate, and destination sync health",
      delta: "1 degraded feed",
      accent: "green",
    },
    {
      id: "clip-opps",
      label: "Clip opportunities",
      value: "14",
      hint: "High-signal moments waiting for post-live packaging",
      delta: "+5 new",
      accent: "orange",
    },
    {
      id: "studio",
      label: "Studio launches today",
      value: "3",
      hint: "Main service, youth outreach, prayer night Q&A",
      delta: "Starts in 35m",
      accent: "navy",
    },
    {
      id: "moderation",
      label: "Moderation alerts",
      value: "6",
      hint: "Chat spikes, unanswered questions, or prayer request backlog",
      delta: "Needs triage",
      accent: "orange",
    },
  ],
  Outreach: [
    {
      id: "open-rate",
      label: "Notification open rate",
      value: "41%",
      hint: "Reminder and replay journeys across all active channels",
      delta: "+5.1%",
      accent: "green",
    },
    {
      id: "audience",
      label: "Segment growth",
      value: "2.1k",
      hint: "New contacts added across events, giving, and live flows",
      delta: "Best: Young adults",
      accent: "navy",
    },
    {
      id: "live-arrivals",
      label: "Live arrivals from journeys",
      value: "884",
      hint: "Watch starts attributed to notifications this week",
      delta: "+19%",
      accent: "green",
    },
    {
      id: "replay-follows",
      label: "Replay follow-up conversions",
      value: "312",
      hint: "Replies, watch resumes, and second-step actions",
      delta: "Healthy",
      accent: "orange",
    },
    {
      id: "consent",
      label: "Consent health",
      value: "98.2%",
      hint: "Clean opt-in records and suppression compliance",
      delta: "14 quiet-hour holds",
      accent: "navy",
    },
    {
      id: "fatigue",
      label: "Fatigue warnings",
      value: "3",
      hint: "Segments nearing over-messaging thresholds",
      delta: "Needs tuning",
      accent: "orange",
    },
  ],
  Finance: [
    {
      id: "funds",
      label: "Active funds",
      value: "12",
      hint: "General, missions, building, youth, emergency, supporter funds",
      delta: "3 scheduled",
      accent: "navy",
    },
    {
      id: "donations",
      label: "Giving today",
      value: "$3,840",
      hint: "Institution-wide giving movement so far today",
      delta: "+12%",
      accent: "green",
    },
    {
      id: "recurring",
      label: "Recurring supporters",
      value: "416",
      hint: "Stable recurring base across monthly plans",
      delta: "+23 net",
      accent: "green",
    },
    {
      id: "crowdfund",
      label: "Crowdfund momentum",
      value: "68%",
      hint: "Average progress across active charity campaigns",
      delta: "1 urgent",
      accent: "orange",
    },
    {
      id: "payouts",
      label: "Pending payouts",
      value: "$7,220",
      hint: "Awaiting reconciliation or transfer confirmation",
      delta: "2 finance notes",
      accent: "navy",
    },
    {
      id: "risk",
      label: "Accountability checks",
      value: "4",
      hint: "Campaigns that need updates, receipts, or proof-of-impact notes",
      delta: "Due this week",
      accent: "orange",
    },
  ],
  Promotion: [
    {
      id: "active-campaigns",
      label: "Active Beacon campaigns",
      value: "8",
      hint: "Linked replay boosts, event pushes, giving, and standalone ads",
      delta: "2 learning",
      accent: "green",
    },
    {
      id: "spend",
      label: "Beacon spend",
      value: "£3.9k",
      hint: "Current spend against plan and placement pacing",
      delta: "64% pace",
      accent: "orange",
    },
    {
      id: "reach",
      label: "Audience reach",
      value: "496k",
      hint: "Combined paid and premium internal surfaces",
      delta: "+14%",
      accent: "green",
    },
    {
      id: "conversions",
      label: "Ministry outcomes",
      value: "1.9k",
      hint: "Live attendance, replay starts, registrations, giving actions",
      delta: "Best: replay boost",
      accent: "navy",
    },
    {
      id: "creative",
      label: "Creative health",
      value: "87%",
      hint: "Fatigue, copy fitness, CTA match, and approval readiness",
      delta: "2 need refresh",
      accent: "orange",
    },
    {
      id: "recommendations",
      label: "Promotion recommendations",
      value: "6",
      hint: "Replays, clips, funds, and events that deserve promotion next",
      delta: "New today",
      accent: "navy",
    },
  ],
  Moderation: [
    {
      id: "cases",
      label: "Open trust cases",
      value: "18",
      hint: "Reviews, flagged chat, appeals, and policy escalations",
      delta: "4 high priority",
      accent: "orange",
    },
    {
      id: "reviews",
      label: "Unanswered reviews",
      value: "11",
      hint: "Institution, events, replays, and clips awaiting response",
      delta: "3 positive wins",
      accent: "navy",
    },
    {
      id: "safety",
      label: "Child-safe safeguards",
      value: "100%",
      hint: "Youth-facing sessions using approved moderation defaults",
      delta: "Healthy",
      accent: "green",
    },
    {
      id: "sentiment",
      label: "Sentiment drift",
      value: "-4%",
      hint: "Recent movement in review tone and complaint clusters",
      delta: "Watch audio complaints",
      accent: "orange",
    },
    {
      id: "abuse",
      label: "Abuse patterns",
      value: "7",
      hint: "Spam bursts, repeat offenders, or brigading indicators",
      delta: "2 escalated",
      accent: "navy",
    },
    {
      id: "resolution",
      label: "Resolution quality",
      value: "94%",
      hint: "Consistency and timeliness across the moderation team",
      delta: "+2.3%",
      accent: "green",
    },
  ],
};

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-1",
    title: "Live session starts in 35 minutes",
    detail: "Evening Prayer Revival is still missing a caption operator check.",
    badge: "LIVE",
    tone: "good",
  },
  {
    id: "n-2",
    title: "Event reminder: Youth Outreach Saturday",
    detail: "Volunteer confirmations are due before noon and check-in mode is not yet armed.",
    badge: "EVENT",
    tone: "warn",
  },
  {
    id: "n-3",
    title: "Beacon approval needed",
    detail: "Sunday Encounter replay boost has one pending copy review before launch.",
    badge: "BEACON",
    tone: "brand",
  },
];

const CONTINUE_ITEMS: ContinueItem[] = [
  {
    id: "c-1",
    label: "Content pipeline",
    detail: "Continue editing the Faith & Work series and finish two blocked episode drafts.",
    cta: "Open content board",
  },
  {
    id: "c-2",
    label: "Upcoming events",
    detail: "Review registrations, reminders, accommodation notes, and host assignments.",
    cta: "Open Events Manager",
  },
  {
    id: "c-3",
    label: "Fund progress",
    detail: "Live Studio Equipment fund is at 68% and needs a fresh donor update.",
    cta: "Open Donations & Funds",
  },
  {
    id: "c-4",
    label: "Beacon approvals",
    detail: "Two replay campaigns and one standalone awareness ad need approval routing.",
    cta: "Open Beacon Manager",
  },
];

const QUICK_ACTIONS: QuickCreateAction[] = [
  {
    id: "new-live",
    label: "New Live Session",
    detail: "Create, schedule, and pass it into Live Builder and Studio.",
    icon: <Video className="h-4 w-4" />,
    accent: "green",
  },
  {
    id: "new-teaching",
    label: "New Teaching",
    detail: "Start a Series, Episode, or standalone sermon without fake structure.",
    icon: <BookOpen className="h-4 w-4" />,
    accent: "navy",
  },
  {
    id: "new-event",
    label: "New Event",
    detail: "Plan services, conferences, retreats, baptisms, or outreach days.",
    icon: <CalendarClock className="h-4 w-4" />,
    accent: "orange",
  },
  {
    id: "new-fund",
    label: "New Campaign",
    detail: "Launch a fund, seasonal drive, or charity crowdfund with giving hooks.",
    icon: <Wallet className="h-4 w-4" />,
    accent: "green",
  },
  {
    id: "new-ad",
    label: "New Ad",
    detail: "Start a linked or standalone Beacon promotion with premium inventory.",
    icon: <Megaphone className="h-4 w-4" />,
    accent: "orange",
  },
];

const LIVE_SESSIONS: LiveSessionRow[] = [
  {
    id: "ls-1",
    title: "Evening Prayer Revival",
    time: "18:30 — 19:45",
    campus: "Kampala Central",
    audience: "Prayer community · Public",
    readiness: "At risk",
    health: "Watching",
    backstage: "Host joined · Captioner pending",
    warning: "Caption operator check still open",
  },
  {
    id: "ls-2",
    title: "Faith & Work Midweek Class",
    time: "20:00 — 21:00",
    campus: "Online Studio",
    audience: "Series audience · Members first",
    readiness: "Ready",
    health: "Healthy",
    backstage: "All roles confirmed",
  },
  {
    id: "ls-3",
    title: "Youth Outreach Q&A",
    time: "Sat 15:00",
    campus: "Youth Hall",
    audience: "Youth ministry · RSVP",
    readiness: "Blocked",
    health: "Watching",
    backstage: "Moderator gap · venue AV unresolved",
    warning: "Venue mic routing conflict detected",
  },
];

const PIPELINE_ITEMS: PipelineItem[] = [
  {
    id: "p-1",
    title: "Hope in the Wilderness — Episode 02",
    type: "Episode draft",
    status: "Missing assets",
    owner: "Content editor",
    due: "Today",
  },
  {
    id: "p-2",
    title: "Stand Firm — Standalone Teaching",
    type: "Standalone teaching",
    status: "Awaiting review",
    owner: "Pastoral review",
    due: "Tomorrow",
  },
  {
    id: "p-3",
    title: "Sunday Encounter replay package",
    type: "Replay package",
    status: "Ready to publish",
    owner: "Post-live team",
    due: "Now",
  },
  {
    id: "p-4",
    title: "Prayer Night highlight sequence",
    type: "Clip engine",
    status: "Clip opportunity",
    owner: "Video editor",
    due: "Today",
  },
];

const AUDIENCE_STATS: AudienceStat[] = [
  {
    id: "a-1",
    label: "Contact growth",
    value: "+612",
    sublabel: "New followers, guests, and event participants in the last 7 days",
    tone: "good",
  },
  {
    id: "a-2",
    label: "Notification performance",
    value: "41% open",
    sublabel: "Reminder and replay journeys across push, email, and SMS",
  },
  {
    id: "a-3",
    label: "Top segment",
    value: "Young adults",
    sublabel: "Highest watch-start conversion across live and replay journeys",
    tone: "brand",
  },
  {
    id: "a-4",
    label: "Consent health",
    value: "98.2%",
    sublabel: "Healthy consent state, quiet hours, and suppression coverage",
    tone: "good",
  },
];

const GIVING_CAMPAIGNS: CampaignSnapshot[] = [
  {
    id: "g-1",
    title: "General Giving",
    type: "Fund",
    amount: "$6,420",
    progress: 78,
    status: "Stable",
  },
  {
    id: "g-2",
    title: "Live Studio Equipment",
    type: "Special campaign",
    amount: "$1,285 raised",
    progress: 68,
    status: "Ending soon",
  },
  {
    id: "g-3",
    title: "Flood Relief for Gulu",
    type: "Charity crowdfund",
    amount: "$18,300 of $25,000",
    progress: 73,
    status: "Urgent",
  },
];

const BEACON_ITEMS: BeaconItem[] = [
  {
    id: "b-1",
    title: "Sunday Encounter replay boost",
    mode: "Linked",
    spend: "£1.2k",
    outcome: "784 watch starts",
    status: "Healthy",
  },
  {
    id: "b-2",
    title: "Youth Camp registration push",
    mode: "Linked",
    spend: "£820",
    outcome: "41 registrations",
    status: "Learning",
  },
  {
    id: "b-3",
    title: "Care & Missions awareness",
    mode: "Standalone",
    spend: "£460",
    outcome: "183 giving clicks",
    status: "Needs approval",
  },
  {
    id: "b-4",
    title: "Prayer Night announcement",
    mode: "Standalone",
    spend: "£210",
    outcome: "CTR softening",
    status: "Fatigue risk",
  },
];

const TRUST_CASES: TrustCase[] = [
  {
    id: "t-1",
    title: "Audio complaint cluster on Prayer Night replay",
    source: "Reviews · Replay",
    priority: "High",
    owner: "Production team",
  },
  {
    id: "t-2",
    title: "Reported chat messages during Youth Outreach live",
    source: "Moderation · Live chat",
    priority: "Critical",
    owner: "Moderator lead",
  },
  {
    id: "t-3",
    title: "Flagged clip comment thread",
    source: "Clips · Public comments",
    priority: "Medium",
    owner: "Community manager",
  },
  {
    id: "t-4",
    title: "Unanswered 5-star institution reviews",
    source: "Institution profile",
    priority: "Medium",
    owner: "Comms lead",
  },
];

const RECOMMENDATIONS_BY_ROLE: Record<
  RoleKey,
  Array<{ id: string; title: string; detail: string; cta: string; tone: Tone }>
> = {
  Leadership: [
    {
      id: "r-1",
      title: "Promote the Sunday replay with Beacon",
      detail: "Strong replay completion and positive reviews suggest it deserves wider promotion.",
      cta: "Open Beacon Builder",
      tone: "brand",
    },
    {
      id: "r-2",
      title: "Convert Flood Relief into a live fundraiser moment",
      detail: "Tonight’s prayer stream is the strongest fit for donor urgency and public momentum.",
      cta: "Open Live Builder",
      tone: "good",
    },
    {
      id: "r-3",
      title: "Respond to unanswered positive reviews",
      detail: "A quick response lift strengthens public trust and future conversion.",
      cta: "Open Reviews & Moderation",
      tone: "navy",
    },
  ],
  Production: [
    {
      id: "r-1",
      title: "Resolve caption operator gap now",
      detail: "Evening Prayer Revival cannot move to a clean ready state until accessibility checks pass.",
      cta: "Open Live Dashboard",
      tone: "warn",
    },
    {
      id: "r-2",
      title: "Create clips from Sunday Encounter",
      detail: "Three strong moments are already marked and ready for packaging.",
      cta: "Open Replays & Clips",
      tone: "brand",
    },
    {
      id: "r-3",
      title: "Duplicate the translated session preset",
      detail: "Reuse current destination and backstage settings for the Swahili follow-up session.",
      cta: "Open Live Builder",
      tone: "good",
    },
  ],
  Outreach: [
    {
      id: "r-1",
      title: "Trigger replay-ready follow-up",
      detail: "Replay package is ready and the reminder journey can go live in one click.",
      cta: "Open Audience Notifications",
      tone: "good",
    },
    {
      id: "r-2",
      title: "Suppress one fatigued segment",
      detail: "The high-frequency young adults segment needs a 48-hour cooldown.",
      cta: "Open Channels & Contacts",
      tone: "warn",
    },
    {
      id: "r-3",
      title: "Promote the camp registration reminder",
      detail: "Beacon and notifications are aligned for a stronger event conversion push.",
      cta: "Open Beacon Dashboard",
      tone: "brand",
    },
  ],
  Finance: [
    {
      id: "r-1",
      title: "Post a new crowdfund update",
      detail: "Flood Relief is close enough to goal that a fresh impact update could unlock donor urgency.",
      cta: "Open Crowdfunding Workbench",
      tone: "brand",
    },
    {
      id: "r-2",
      title: "Audit two payout notes",
      detail: "Finance comments were added to the Youth Fund and Building Fund reconciliation threads.",
      cta: "Open Donations & Funds",
      tone: "warn",
    },
    {
      id: "r-3",
      title: "Insert a giving moment into tonight’s live",
      detail: "Prayer Night already has strong attendance forecasts and could support a clear donor CTA.",
      cta: "Open Live Builder",
      tone: "good",
    },
  ],
  Promotion: [
    {
      id: "r-1",
      title: "Duplicate the winning replay creative",
      detail: "The Sunday Encounter replay boost is outperforming other creative variants by 19%.",
      cta: "Open Beacon Manager",
      tone: "good",
    },
    {
      id: "r-2",
      title: "Pause one fatigued announcement ad",
      detail: "The Prayer Night standalone ad is softening and should be refreshed before more spend lands.",
      cta: "Open Beacon Manager",
      tone: "warn",
    },
    {
      id: "r-3",
      title: "Promote the crowdfund milestone",
      detail: "Flood Relief crossed 70% and is ideal for a momentum-driven Beacon campaign.",
      cta: "Open Beacon Builder",
      tone: "brand",
    },
  ],
  Moderation: [
    {
      id: "r-1",
      title: "Escalate the Youth Outreach chat case",
      detail: "Repeated reports and child-facing context require priority review.",
      cta: "Open Reviews & Moderation",
      tone: "warn",
    },
    {
      id: "r-2",
      title: "Respond to 5-star institution reviews",
      detail: "Positive reviews can be converted into trust-building public replies today.",
      cta: "Open Reviews & Moderation",
      tone: "good",
    },
    {
      id: "r-3",
      title: "Share production feedback with the live team",
      detail: "Audio complaints across replay reviews point to one recurring operational issue.",
      cta: "Open Live Dashboard",
      tone: "brand",
    },
  ],
};

function tonePill(tone: Tone) {
  if (tone === "good") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (tone === "warn") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  if (tone === "danger") {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }
  if (tone === "brand") {
    return "bg-orange-50 text-orange-700 border-orange-200";
  }
  if (tone === "navy") {
    return "bg-slate-100 text-slate-800 border-slate-200";
  }
  return "bg-white text-slate-700 border-slate-200";
}

function accentBg(accent: "green" | "orange" | "navy") {
  if (accent === "green") return EV_GREEN;
  if (accent === "orange") return EV_ORANGE;
  return EV_NAVY;
}

function Pill({
  text,
  tone = "neutral",
  left,
}: {
  text: string;
  tone?: Tone;
  left?: React.ReactNode;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        tonePill(tone),
      )}
    >
      {left}
      {text}
    </span>
  );
}

function SectionCard({
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
    <section
      className={cx(
        "rounded-[16px] border border-slate-200 bg-white p-3 sm:p-4 md:p-5 shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[15px] font-bold tracking-tight text-slate-900">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-1 text-[12px] leading-5 text-slate-500">
              {subtitle}
            </p>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function GhostButton({
  label,
  icon,
  accent = "navy",
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  accent?: "green" | "orange" | "navy";
  onClick?: () => void;
}) {
  const activeColor =
    accent === "green"
      ? "text-emerald-700 border-emerald-200 hover:bg-emerald-50"
      : accent === "orange"
        ? "text-orange-700 border-orange-200 hover:bg-orange-50"
        : "text-slate-700 border-slate-200 hover:bg-slate-50";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-1.5 text-[12px] font-semibold transition-colors",
        activeColor,
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function SolidButton({
  label,
  icon,
  accent = "green",
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  accent?: "green" | "orange" | "navy";
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-[12px] font-semibold text-white transition hover:brightness-95"
      style={{ background: accentBg(accent) }}
    >
      {icon}
      {label}
    </button>
  );
}

function MetricTile({ metric }: { metric: MetricCard }) {
  return (
    <KpiTile
      label={metric.label}
      value={metric.value}
      hint={metric.hint}
      tone={metric.accent}
      size="tall"
      footer={
        metric.delta ? (
          <div className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-slate-800 dark:text-emerald-300">
            <TrendingUp className="h-3.5 w-3.5" />
            {metric.delta}
          </div>
        ) : null
      }
    />
  );
}

function ProgressBar({
  value,
  accent = "green",
}: {
  value: number;
  accent?: "green" | "orange" | "navy";
}) {
  const width = `${Math.max(0, Math.min(100, value))}%`;
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full"
        style={{
          width,
          background: accentBg(accent),
        }}
      />
    </div>
  );
}

function RoleChip({
  role,
  active,
  onClick,
}: {
  role: RoleKey;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
        active
          ? "border-transparent text-white"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
      )}
      style={active ? { background: EV_NAVY } : undefined}
    >
      <Sparkles className="h-3.5 w-3.5" />
      {role}
    </button>
  );
}

function SelectPill({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-2xl border border-slate-200 bg-white px-3 pr-9 text-[12px] font-semibold text-slate-700 shadow-sm outline-none focus:border-slate-300"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

export default function ProviderDashboardPage() {
  const [role, setRole] = useState<RoleKey>("Leadership");
  const [campus, setCampus] = useState(CAMPUSES[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [timeFilter, setTimeFilter] = useState("Today");
  const [objectFilter, setObjectFilter] = useState("All categories");
  const [search, setSearch] = useState("");
  const metrics = useMemo(() => EXECUTIVE_METRICS[role], [role]);
  const recommendations = useMemo(() => RECOMMENDATIONS_BY_ROLE[role], [role]);

  const anomalyCount = useMemo(() => {
    const liveAnomalies = LIVE_SESSIONS.filter(
      (item) => item.readiness !== "Ready" || item.health !== "Healthy",
    ).length;
    const beaconAnomalies = BEACON_ITEMS.filter(
      (item) => item.status === "Needs approval" || item.status === "Fatigue risk",
    ).length;
    return liveAnomalies + beaconAnomalies + 1;
  }, []);

  const readinessSummary = useMemo(() => {
    const ready = LIVE_SESSIONS.filter((item) => item.readiness === "Ready").length;
    const atRisk = LIVE_SESSIONS.filter((item) => item.readiness === "At risk").length;
    const blocked = LIVE_SESSIONS.filter((item) => item.readiness === "Blocked").length;
    return { ready, atRisk, blocked };
  }, []);

  const openQuickAction = (actionId: QuickCreateAction["id"]) => {
    const routeByAction: Record<QuickCreateAction["id"], string> = {
      "new-live": ROUTES.liveBuilder,
      "new-teaching": ROUTES.teachingsDashboard,
      "new-event": ROUTES.eventsManager,
      "new-fund": ROUTES.donationsFunds,
      "new-ad": ROUTES.beaconBuilder,
    };
    safeNav(routeByAction[actionId] ?? ROUTES.providerDashboard);
  };

  const openContinueItem = (cta: string) => {
    const routeByCta: Record<string, string> = {
      "Open content board": ROUTES.teachingsDashboard,
      "Open Events Manager": ROUTES.eventsManager,
      "Open Donations & Funds": ROUTES.donationsFunds,
      "Open Beacon Manager": ROUTES.beaconManager,
    };
    safeNav(routeByCta[cta] ?? ROUTES.providerDashboard);
  };

  const openRecommendation = (cta: string) => {
    const routeByCta: Record<string, string> = {
      "Open Beacon Builder": ROUTES.beaconBuilder,
      "Open Live Builder": ROUTES.liveBuilder,
      "Open Reviews & Moderation": ROUTES.reviewsModeration,
      "Open Live Dashboard": ROUTES.liveDashboard,
      "Open Replays & Clips": ROUTES.replaysClips,
      "Open Audience Notifications": ROUTES.audienceNotifications,
      "Open Channels & Contacts": ROUTES.channelsContactManager,
      "Open Beacon Dashboard": ROUTES.beaconDashboard,
      "Open Crowdfunding Workbench": ROUTES.charityCrowdfund,
      "Open Donations & Funds": ROUTES.donationsFunds,
      "Open Beacon Manager": ROUTES.beaconManager,
    };
    safeNav(routeByCta[cta] ?? ROUTES.providerDashboard);
  };

  return (
    <div
      className="min-h-screen w-full bg-[#f2f2f2] text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100"
    >
      <div className="w-full max-w-none px-0 py-0">
        <div className="space-y-4 sm:space-y-5">
          {/* Top hero / mission command */}
          <section className="rounded-[16px] border border-slate-200 bg-white p-3 sm:p-4 md:p-5 shadow-sm">
            <div className="grid gap-4 sm:gap-6 xl:grid-cols-[1.25fr,0.9fr]">
              <div className="min-w-0">
                <ProviderPageTitle
                  icon={<LayoutDashboard className="h-6 w-6" />}
                  title="Provider Dashboard"
                  subtitle="Daily overview of live sessions, teachings, audience health, giving performance, and trust operations."
                  className="mt-2"
                />

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <Pill
                    text="Provider"
                    tone="good"
                    left={<BadgeCheck className="h-3.5 w-3.5" />}
                  />
                  <Pill text="Provider Workspace" tone="navy" />
                  <Pill
                    text={`${anomalyCount} live issues or campaign warnings`}
                    tone="warn"
                    left={<AlertTriangle className="h-3.5 w-3.5" />}
                  />
                  <Pill
                    text={`${readinessSummary.ready} ready · ${readinessSummary.atRisk} at risk · ${readinessSummary.blocked} blocked`}
                    tone="brand"
                    left={<Radio className="h-3.5 w-3.5" />}
                  />
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <SolidButton
                    label="+ New Live Session"
                    accent="green"
                    icon={<Video className="h-4 w-4" />}
                    onClick={() => safeNav(ROUTES.liveBuilder)}
                  />
                  <GhostButton
                    label="+ New Teaching"
                    accent="navy"
                    icon={<BookOpen className="h-4 w-4" />}
                    onClick={() => safeNav(ROUTES.teachingsDashboard)}
                  />
                  <GhostButton
                    label="+ New Campaign"
                    accent="orange"
                    icon={<Wallet className="h-4 w-4" />}
                    onClick={() => safeNav(ROUTES.donationsFunds)}
                  />
                  <GhostButton
                    label="+ New Ad"
                    accent="orange"
                    icon={<Megaphone className="h-4 w-4" />}
                    onClick={() => safeNav(ROUTES.beaconBuilder)}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:gap-4 lg:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-[14px] border border-slate-200 bg-slate-50 p-3 sm:p-4 md:p-5">
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Profile summary
                  </div>
                  <div className="mt-3 flex items-start gap-3">
                    <div
                      className="grid h-14 w-14 place-items-center rounded-[20px] text-white text-[18px] font-black"
                      style={{ background: EV_GREEN }}
                    >
                      FH
                    </div>
                    <div className="min-w-0">
                      <div className="text-[20px] font-black tracking-tight text-slate-900">
                        Ayesigai921
                      </div>
                      <div className="mt-1 text-[13px] text-slate-500">Provider</div>
                      <div className="text-[13px] text-slate-500">
                        Provider Workspace
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Pill
                      text="Active"
                      tone="good"
                      left={<CheckCircle2 className="h-3.5 w-3.5" />}
                    />
                    <Pill
                      text={campus}
                      tone="navy"
                      left={<LayoutDashboard className="h-3.5 w-3.5" />}
                    />
                    <Pill
                      text={language}
                      tone="brand"
                      left={<Globe2 className="h-3.5 w-3.5" />}
                    />
                  </div>
                </div>

                <div className="rounded-[14px] border border-slate-200 bg-slate-50 p-3 sm:p-4 md:p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      Role-aware views
                    </div>
                    <Pill
                      text={role}
                      tone="navy"
                      left={<Sparkles className="h-3.5 w-3.5" />}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {ROLES.map((item) => (
                      <RoleChip
                        key={item}
                        role={item}
                        active={item === role}
                        onClick={() => setRole(item)}
                      />
                    ))}
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-3">
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500">
                        Campus
                      </div>
                      <div className="mt-1">
                        <SelectPill
                          value={campus}
                          options={CAMPUSES}
                          onChange={setCampus}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500">
                        Language
                      </div>
                      <div className="mt-1">
                        <SelectPill
                          value={language}
                          options={LANGUAGES}
                          onChange={setLanguage}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500">
                        Saved view
                      </div>
                      <div className="mt-1">
                        <SelectPill
                          value={role}
                          options={ROLES}
                          onChange={(value) => setRole(value as RoleKey)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Executive command header */}
            <div className="mt-4 rounded-[14px] border border-slate-200 bg-slate-50 p-3 sm:p-4 md:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[15px] font-bold tracking-tight text-slate-900">
                    Top KPIs
                  </div>
                  <div className="mt-1 text-[12px] text-slate-500">
                    Snapshot of audience growth, live readiness, replay performance, and giving health.
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <GhostButton
                    label="Open live dashboard"
                    icon={<MonitorPlay className="h-4 w-4" />}
                    accent="green"
                    onClick={() => safeNav(ROUTES.liveDashboard)}
                  />
                  <GhostButton
                    label="Open donor insights"
                    icon={<DollarSign className="h-4 w-4" />}
                    accent="orange"
                    onClick={() => safeNav(ROUTES.donationsFunds)}
                  />
                  <GhostButton
                    label="Review recommendations"
                    icon={<Sparkles className="h-4 w-4" />}
                    accent="navy"
                    onClick={() => safeNav(ROUTES.reviewsModeration)}
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.slice(0, 4).map((metric) => (
                  <MetricTile key={metric.id} metric={metric} />
                ))}
              </div>
            </div>

            {/* Quick-create rail */}
            <div className="mt-4 rounded-[14px] border border-slate-200 bg-slate-50 p-3 sm:p-4 md:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[15px] font-bold tracking-tight text-slate-900">
                    Quick-create rail
                  </div>
                  <div className="mt-1 text-[12px] text-slate-500">
                    Launch the most important provider workflows in one click.
                  </div>
                </div>
                <Pill
                  text="Role-aware defaults active"
                  tone="good"
                  left={<Sparkles className="h-3.5 w-3.5" />}
                />
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => openQuickAction(action.id)}
                    className="rounded-[14px] border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-[1px] hover:shadow-md"
                  >
                    <div
                      className="grid h-10 w-10 place-items-center rounded-[12px] text-white"
                      style={{ background: accentBg(action.accent) }}
                    >
                      {action.icon}
                    </div>
                    <div className="mt-3 text-[14px] font-bold text-slate-900">
                      {action.label}
                    </div>
                    <div className="mt-1 text-[12px] leading-5 text-slate-500">
                      {action.detail}
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-slate-700">
                      Open <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Notifications / continue / search */}
          <div className="grid gap-3 sm:gap-4 xl:grid-cols-2">
            <SectionCard
              title="Notifications"
              subtitle="Live sessions, reminders, donor alerts, and Beacon tasks requiring immediate attention."
              right={<Pill text={`${NOTIFICATIONS.length} active`} tone="navy" />}
            >
              <div className="space-y-3">
                {NOTIFICATIONS.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[14px] font-bold text-slate-900">
                          {item.title}
                        </div>
                        <div className="mt-1 text-[12px] leading-5 text-slate-500">
                          {item.detail}
                        </div>
                      </div>
                      <Pill text={item.badge} tone={item.tone} />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Continue where you left off"
              subtitle="Resume your latest journey across content, community, giving, and promotion."
            >
              <div className="space-y-3">
                {CONTINUE_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openContinueItem(item.cta)}
                    className="w-full rounded-[22px] border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[14px] font-bold text-slate-900">
                          {item.label}
                        </div>
                        <div className="mt-1 text-[12px] leading-5 text-slate-500">
                          {item.detail}
                        </div>
                      </div>
                      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                    </div>
                  </button>
                ))}
              </div>
            </SectionCard>
          </div>

          <SectionCard
            title="Search and filter"
            subtitle="Find sessions, series, donors, events, reviews, or Beacon campaigns faster."
          >
            <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr),160px,190px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search live sessions, series, events, campaigns, reviews, or contacts"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-[13px] font-medium text-slate-700 outline-none focus:border-slate-300"
                />
              </div>
              <SelectPill value={timeFilter} options={["Today", "This week", "This month"]} onChange={setTimeFilter} />
              <SelectPill
                value={objectFilter}
                options={[
                  "All categories",
                  "Live Sessions",
                  "Teachings",
                  "Events",
                  "Giving",
                  "Beacon",
                  "Trust queue",
                ]}
                onChange={setObjectFilter}
              />
            </div>
          </SectionCard>

          {/* Main dashboard modules */}
          <div className="grid gap-3 sm:gap-4 xl:grid-cols-12">
            <SectionCard
              title="Live Sessions command center"
              subtitle="Today’s schedule, readiness state, late-start warnings, stream health, backstage availability, and one-click handoff into operations."
              className="xl:col-span-7"
              right={
                <div className="flex flex-wrap gap-2">
                  <GhostButton
                    label="Open Live Schedule"
                    icon={<CalendarClock className="h-4 w-4" />}
                    accent="green"
                    onClick={() => safeNav(ROUTES.liveSchedule)}
                  />
                  <SolidButton
                    label="Open session dashboard"
                    accent="green"
                    icon={<MonitorPlay className="h-4 w-4" />}
                    onClick={() => safeNav(`${ROUTES.liveDashboard}?sessionId=${encodeURIComponent(LIVE_SESSIONS[0]?.id ?? "ls-1")}`)}
                  />
                </div>
              }
            >
              <div className="space-y-3">
                {LIVE_SESSIONS.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-[16px] font-bold tracking-tight text-slate-900">
                            {item.title}
                          </div>
                          <Pill
                            text={item.readiness}
                            tone={
                              item.readiness === "Ready"
                                ? "good"
                                : item.readiness === "At risk"
                                  ? "warn"
                                  : "danger"
                            }
                          />
                          <Pill
                            text={item.health}
                            tone={
                              item.health === "Healthy"
                                ? "good"
                                : item.health === "Watching"
                                  ? "warn"
                                  : "danger"
                            }
                          />
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-slate-500">
                          <span>{item.time}</span>
                          <span>•</span>
                          <span>{item.campus}</span>
                          <span>•</span>
                          <span>{item.audience}</span>
                        </div>
                        <div className="mt-2 text-[12px] font-medium text-slate-700">
                          {item.backstage}
                        </div>
                        {item.warning ? (
                          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            {item.warning}
                          </div>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <GhostButton
                          label="Launch studio"
                          icon={<Video className="h-4 w-4" />}
                          accent="green"
                          onClick={() => safeNav(`${ROUTES.liveStudio}?sessionId=${encodeURIComponent(item.id)}`)}
                        />
                        <GhostButton
                          label="Send reminder"
                          icon={<Bell className="h-4 w-4" />}
                          accent="orange"
                          onClick={() => safeNav(`${ROUTES.audienceNotifications}?sessionId=${encodeURIComponent(item.id)}`)}
                        />
                        <GhostButton
                          label="Moderation"
                          icon={<ShieldCheck className="h-4 w-4" />}
                          accent="navy"
                          onClick={() => safeNav(`${ROUTES.reviewsModeration}?sessionId=${encodeURIComponent(item.id)}&panel=live`)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Content pipeline panel"
              subtitle="Drafts awaiting completion, unpublished replays, clip opportunities, upcoming episode deadlines, and blocked teaching work."
              className="xl:col-span-5"
              right={<Pill text="4 open items" tone="navy" />}
            >
              <div className="space-y-3">
                {PIPELINE_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[14px] font-bold text-slate-900">
                          {item.title}
                        </div>
                        <div className="mt-1 text-[12px] text-slate-500">
                          {item.type} · {item.owner} · Due {item.due}
                        </div>
                      </div>
                      <Pill
                        text={item.status}
                        tone={
                          item.status === "Ready to publish"
                            ? "good"
                            : item.status === "Clip opportunity"
                              ? "brand"
                              : item.status === "Missing assets"
                                ? "warn"
                                : "navy"
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Audience and outreach summary"
              subtitle="Growth, contact health, journey performance, and the segments driving the strongest ministry outcomes."
              className="xl:col-span-4"
              right={
                <GhostButton
                  label="Open audience tools"
                  icon={<Users className="h-4 w-4" />}
                  accent="green"
                  onClick={() => safeNav(ROUTES.audienceNotifications)}
                />
              }
            >
              <div className="grid gap-3">
                {AUDIENCE_STATS.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                          {item.label}
                        </div>
                        <div className="mt-2 text-[24px] font-black tracking-tight text-slate-900">
                          {item.value}
                        </div>
                        <div className="mt-1 text-[12px] leading-5 text-slate-500">
                          {item.sublabel}
                        </div>
                      </div>
                      {item.tone ? <Pill text={item.tone === "good" ? "Healthy" : item.tone === "brand" ? "High performer" : item.tone === "warn" ? "Watch" : "Focus"} tone={item.tone} /> : null}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Giving and campaign snapshot"
              subtitle="Giving totals, recurring donor movement, active campaign momentum, crowdfund progress, and urgency signals."
              className="xl:col-span-4"
              right={
                <GhostButton
                  label="Open donor insights"
                  icon={<HeartHandshake className="h-4 w-4" />}
                  accent="orange"
                  onClick={() => safeNav(ROUTES.donationsFunds)}
                />
              }
            >
              <div className="space-y-3">
                {GIVING_CAMPAIGNS.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[14px] font-bold text-slate-900">
                          {item.title}
                        </div>
                        <div className="mt-1 text-[12px] text-slate-500">
                          {item.type}
                        </div>
                      </div>
                      <Pill
                        text={item.status}
                        tone={
                          item.status === "Stable"
                            ? "good"
                            : item.status === "Urgent"
                              ? "danger"
                              : item.status === "Ending soon"
                                ? "warn"
                                : "navy"
                        }
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[12px] font-semibold text-slate-700">
                      <span>{item.amount}</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="mt-2">
                      <ProgressBar
                        value={item.progress}
                        accent={item.type === "Charity crowdfund" ? "orange" : "green"}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Beacon performance strip"
              subtitle="Spend, reach, creative fatigue, approvals, best performers, and ads needing optimization."
              className="xl:col-span-4"
              right={
                <GhostButton
                  label="Open Beacon Dashboard"
                  icon={<Megaphone className="h-4 w-4" />}
                  accent="orange"
                  onClick={() => safeNav(ROUTES.beaconDashboard)}
                />
              }
            >
              <div className="space-y-3">
                {BEACON_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[14px] font-bold text-slate-900">
                          {item.title}
                        </div>
                        <div className="mt-1 text-[12px] text-slate-500">
                          {item.mode} campaign · {item.spend}
                        </div>
                      </div>
                      <Pill
                        text={item.status}
                        tone={
                          item.status === "Healthy"
                            ? "good"
                            : item.status === "Learning"
                              ? "navy"
                              : item.status === "Needs approval"
                                ? "warn"
                                : "danger"
                        }
                      />
                    </div>
                    <div className="mt-2 text-[12px] font-semibold text-slate-700">
                      {item.outcome}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Trust, moderation, and review queue"
              subtitle="Reported content, review trends, unanswered reviews, moderation backlog, and sentiment shifts in one premium queue."
              className="xl:col-span-7"
              right={
                <div className="flex flex-wrap gap-2">
                  <GhostButton
                    label="Open moderation"
                    icon={<ShieldCheck className="h-4 w-4" />}
                    accent="navy"
                    onClick={() => safeNav(ROUTES.reviewsModeration)}
                  />
                  <GhostButton
                    label="Respond to reviews"
                    icon={<MessageSquare className="h-4 w-4" />}
                    accent="green"
                    onClick={() => safeNav(ROUTES.reviewsModeration)}
                  />
                </div>
              }
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {TRUST_CASES.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[14px] font-bold text-slate-900">
                          {item.title}
                        </div>
                        <div className="mt-1 text-[12px] text-slate-500">
                          {item.source} · {item.owner}
                        </div>
                      </div>
                      <Pill
                        text={item.priority}
                        tone={
                          item.priority === "Critical"
                            ? "danger"
                            : item.priority === "High"
                              ? "warn"
                              : "navy"
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Role-aware insight cards"
              subtitle="Saved views, recommendations, and cross-object actions for leadership, production, outreach, finance, promotion, and moderation."
              className="xl:col-span-5"
              right={<Pill text={`${role} view`} tone="navy" />}
            >
              <div className="space-y-3">
                {recommendations.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[14px] font-bold text-slate-900">
                          {item.title}
                        </div>
                        <div className="mt-1 text-[12px] leading-5 text-slate-500">
                          {item.detail}
                        </div>
                      </div>
                      <Pill text={item.tone === "good" ? "Recommended" : item.tone === "warn" ? "Needs action" : item.tone === "brand" ? "Growth idea" : "Review"} tone={item.tone} />
                    </div>
                    <button
                      type="button"
                      onClick={() => openRecommendation(item.cta)}
                      className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-slate-700"
                    >
                      {item.cta} <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Analytics strip */}
          <SectionCard
            title="Analytics strip"
            subtitle="Fast-glance operating metrics for attendance, giving, registrations, engaged members, and content views."
            right={<Pill text={`Role: ${role.toLowerCase()}`} tone="navy" />}
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
              {[
                {
                  label: "Live attendance",
                  value: "378",
                  hint: "Audience in recent live sessions",
                  accent: "green" as const,
                  icon: <Radio className="h-4 w-4" />,
                },
                {
                  label: "Donations received",
                  value: "$16,010",
                  hint: "Funds raised across active campaigns",
                  accent: "orange" as const,
                  icon: <DollarSign className="h-4 w-4" />,
                },
                {
                  label: "Event registrations",
                  value: "142",
                  hint: "Registrations awaiting event day",
                  accent: "navy" as const,
                  icon: <CalendarClock className="h-4 w-4" />,
                },
                {
                  label: "Active members",
                  value: "48",
                  hint: "Engaged followers and participants",
                  accent: "green" as const,
                  icon: <Users className="h-4 w-4" />,
                },
                {
                  label: "Content views",
                  value: "12,900",
                  hint: "Total views from series and live replays",
                  accent: "navy" as const,
                  icon: <Activity className="h-4 w-4" />,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-slate-200 bg-white p-4 min-h-[170px] shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {item.label}
                    </div>
                    <div
                      className="grid h-12 w-12 place-items-center rounded-[14px]"
                      style={{
                        background:
                          item.accent === "green"
                            ? "rgba(3,205,140,0.12)"
                            : item.accent === "orange"
                              ? "rgba(247,127,0,0.12)"
                              : "rgba(22,36,76,0.10)",
                        color: accentBg(item.accent),
                      }}
                    >
                      {item.icon}
                    </div>
                  </div>
                  <div className="mt-3 text-[30px] font-black leading-none tracking-[-0.02em] text-slate-900">
                    {item.value}
                  </div>
                  <div className="mt-2 text-[13px] leading-5 text-slate-600">
                    {item.hint}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

    </div>
  );
}







