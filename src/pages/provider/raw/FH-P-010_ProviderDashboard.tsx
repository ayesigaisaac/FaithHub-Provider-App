// @ts-nocheck

"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { ProviderSectionCard } from "@/components/provider/ProviderSectionCard";
import { ProviderStatusPill } from "@/components/provider/ProviderStatusPill";
import { TeachingsQuickActionsBar } from "@/components/provider/TeachingsQuickActionsBar";
import { useAuth } from "@/auth/useAuth";
import {
  buildProviderAnalyticsSnapshot,
  readProviderAnalyticsSnapshot,
  saveProviderAnalyticsSnapshot,
} from "@/features/analytics/providerAnalyticsStore";

/**
 * FaithHub Provider - FaithHub Provider dashboard
 * --------------------------------------
 * Premium provider-side mission control page.
 *
 * Design intent
 * - Evolve the older FaithHub Provider dashboard screenshots into a richer, more premium
 *   control surface while preserving their approachable dashboard shape:
 *   command hero, profile summary, notifications, quick filters, and analytics.
 * - Use EVzone Green as the primary accent and Orange as the secondary accent.
 * - Represent the full FaithHub Provider dashboard blueprint:
 *   executive command header, quick-create rail, live operations, content pipeline,
 *   audience summary, giving snapshot, Beacon performance, trust queue,
 *   and role-aware insight cards.
 * - Keep the component self-contained and easy to adapt inside the FaithHub Provider shell.
 */

const EV_GREEN = "var(--fh-brand)";
const EV_ORANGE = "var(--fh-accent)";
const EV_GREY = "var(--fh-ev-medium-grey)";
const EV_LIGHT = "var(--fh-ev-light-grey)";
const EV_NAVY = "var(--fh-brand-dark)";

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
  isLiveNow?: boolean;
  viewers?: number;
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

type TeachingWorkflowStatus = "Draft" | "Published" | "Needs review";

type TeachingWorkflowItem = {
  id: string;
  title: string;
  status: TeachingWorkflowStatus;
  updatedAt: string;
  type: string;
};

export type WorkflowFilter = "all" | "draft" | "needs_review" | "published";

export type WorkflowDerivedData = {
  teachingItems: TeachingWorkflowItem[];
  recentTeachings: TeachingWorkflowItem[];
  continueItem?: TeachingWorkflowItem;
  pendingWork: TeachingWorkflowItem[];
  needsReviewCount: number;
};

export type WorkflowSummarySnapshot = {
  draftCount: number;
  needsReviewCount: number;
  publishedCount: number;
  totalCount: number;
  updatedAt: string;
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
  reviewsModeration: "/faithhub/provider/reviews-and-moderation",
  eventsManager: "/faithhub/provider/events-manager",
} as const;

const WORKFLOW_SUMMARY_STORAGE_KEY = "fh.workflow.summary";
const WORKFLOW_SUMMARY_EVENT = "fh:workflow-summary";
const DASHBOARD_AUDIT_LOG_KEY = "fh.dashboard.actionAudit.v1";

type DashboardActionKind = "publish" | "request_review" | "continue" | "open";
type DashboardActionStatus = "pending" | "success" | "error";
type DashboardAuditEntry = {
  id: string;
  itemId: string;
  action: DashboardActionKind;
  status: DashboardActionStatus;
  message: string;
  atISO: string;
};

function safeNav(path: string) {
  navigateWithRouter(path);
}

function scrollToDashboardSection(sectionId: string) {
  if (typeof window === "undefined") return;
  const target = window.document.getElementById(sectionId);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function trackDashboardEvent(
  eventName:
    | "start_new_task"
    | "continue_editing"
    | "open_recent_item"
    | "toggle_recent_section"
    | "toggle_pending_section"
    | "quick_action_completed",
  payload?: Record<string, string | boolean>,
) {
  if (typeof window === "undefined") return;
  const eventPayload = { event: eventName, ...payload };
  window.dispatchEvent(new CustomEvent("fh:analytics", { detail: eventPayload }));
  const dataLayer = (window as unknown as { dataLayer?: Array<Record<string, string>> }).dataLayer;
  if (Array.isArray(dataLayer)) dataLayer.push(eventPayload);
}

export function deriveTeachingWorkflowData(items: PipelineItem[]): WorkflowDerivedData {
  const teachingItems = items
    .filter((item) => {
      const text = `${item.title} ${item.type}`.toLowerCase();
      return text.includes("teaching") || text.includes("series") || text.includes("episode");
    })
    .map((item) => {
      const statusMap: Record<PipelineItem["status"], TeachingWorkflowStatus> = {
        Draft: "Draft",
        "Missing assets": "Draft",
        "Ready to publish": "Published",
        "Clip opportunity": "Needs review",
        "Awaiting review": "Needs review",
      };
      return {
        id: item.id,
        title: item.title,
        status: statusMap[item.status],
        updatedAt: item.due,
        type: item.type,
      };
    });
  const recentTeachings = teachingItems.slice(0, 4);
  const continueItem = recentTeachings[0];
  const pendingWork = teachingItems
    .filter((item) => item.status === "Draft" || item.status === "Needs review")
    .slice(0, 5);
  const needsReviewCount = pendingWork.filter((item) => item.status === "Needs review").length;

  return { teachingItems, recentTeachings, continueItem, pendingWork, needsReviewCount };
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
      label: "Upcoming live sessions",
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
      value: "-3.9k",
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
    time: "18:30 - 19:45",
    campus: "Kampala Central",
    audience: "Prayer community - Public",
    readiness: "At risk",
    health: "Watching",
    backstage: "Host joined - Captioner pending",
    warning: "Caption operator check still open",
    isLiveNow: true,
    viewers: 412,
  },
  {
    id: "ls-2",
    title: "Faith & Work Midweek Class",
    time: "20:00 - 21:00",
    campus: "Online Studio",
    audience: "Series audience - Members first",
    readiness: "Ready",
    health: "Healthy",
    backstage: "All roles confirmed",
    isLiveNow: true,
    viewers: 255,
  },
  {
    id: "ls-3",
    title: "Youth Outreach Q&A",
    time: "Sat 15:00",
    campus: "Youth Hall",
    audience: "Youth ministry - RSVP",
    readiness: "Blocked",
    health: "Watching",
    backstage: "Moderator gap - venue AV unresolved",
    warning: "Venue mic routing conflict detected",
    viewers: 0,
  },
];

const PIPELINE_ITEMS: PipelineItem[] = [
  {
    id: "p-1",
    title: "Hope in the Wilderness - Episode 02",
    type: "Episode draft",
    status: "Missing assets",
    owner: "Content editor",
    due: "Today",
  },
  {
    id: "p-2",
    title: "Stand Firm - Standalone Teaching",
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
    spend: "-1.2k",
    outcome: "784 watch starts",
    status: "Healthy",
  },
  {
    id: "b-2",
    title: "Youth Camp registration push",
    mode: "Linked",
    spend: "-820",
    outcome: "41 registrations",
    status: "Learning",
  },
  {
    id: "b-3",
    title: "Care & Missions awareness",
    mode: "Standalone",
    spend: "-460",
    outcome: "183 giving clicks",
    status: "Needs approval",
  },
  {
    id: "b-4",
    title: "Prayer Night announcement",
    mode: "Standalone",
    spend: "-210",
    outcome: "CTR softening",
    status: "Fatigue risk",
  },
];

const TRUST_CASES: TrustCase[] = [
  {
    id: "t-1",
    title: "Audio complaint cluster on Prayer Night replay",
    source: "Reviews - Replay",
    priority: "High",
    owner: "Production team",
  },
  {
    id: "t-2",
    title: "Reported chat messages during Youth Outreach live",
    source: "Moderation - Live chat",
    priority: "Critical",
    owner: "Moderator lead",
  },
  {
    id: "t-3",
    title: "Flagged clip comment thread",
    source: "Clips - Public comments",
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
      detail: "Tonight-s prayer stream is the strongest fit for donor urgency and public momentum.",
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
      title: "Insert a giving moment into tonight-s live",
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

function accentBg(accent: "green" | "orange" | "navy") {
  if (accent === "green") return EV_GREEN;
  if (accent === "orange") return EV_ORANGE;
  return EV_NAVY;
}

const Pill = ProviderStatusPill;
const SectionCard = ProviderSectionCard;

function GhostButton({
  label,
  icon,
  accent = "navy",
  onClick,
  className,
}: {
  label: string;
  icon?: React.ReactNode;
  accent?: "green" | "orange" | "navy";
  onClick?: () => void;
  className?: string;
}) {
  const activeColor =
    accent === "green"
      ? "text-[var(--fh-brand)] border-[color-mix(in_srgb,var(--fh-brand)_28%,white)]"
      : accent === "orange"
        ? "text-orange-700 border-orange-200"
        : "text-[var(--fh-slate)] border-faith-line";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "ds-btn ds-btn--outline h-11 text-[12px] font-semibold",
        activeColor,
        className,
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
  className,
}: {
  label: string;
  icon?: React.ReactNode;
  accent?: "green" | "orange" | "navy";
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx("ds-btn ds-btn--primary h-11 text-[12px] font-semibold text-white", className)}
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
          <div className="inline-flex items-center gap-1 rounded-full bg-[var(--fh-surface)] px-2.5 py-1 text-[11px] font-semibold text-[var(--fh-brand-dark)] ">
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
    <div className="h-2 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--fh-line)_25%,var(--fh-surface-bg)_75%)]">
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
        "inline-flex h-10 items-center gap-2 rounded-full border px-3.5 text-[12px] font-semibold transition-colors",
        active
          ? "border-transparent text-white"
          : "border-faith-line bg-[var(--fh-surface-bg)] text-[var(--fh-slate)] hover:bg-[var(--fh-surface)]",
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
        className="h-11 w-full rounded-xl border border-faith-line/70 bg-[var(--fh-surface-bg)] px-3.5 pr-9 text-[12px] font-semibold text-[var(--fh-slate)] shadow-soft outline-none focus:border-slate-300"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faith-slate" />
    </div>
  );
}

type ProviderDashboardPageProps = {
  workflowItemsOverride?: PipelineItem[];
};

export default function ProviderDashboardPage({ workflowItemsOverride }: ProviderDashboardPageProps = {}) {
  const { user, role: authRole, workspace } = useAuth();
  const [role, setRole] = useState<RoleKey>("Leadership");
  const [campus, setCampus] = useState(CAMPUSES[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);

  const profileName = user?.name?.trim() || "Provider User";
  const profileRole = authRole
    ? authRole.charAt(0).toUpperCase() + authRole.slice(1)
    : "Provider";
  const profileWorkspace = workspace?.brand?.trim() || "FaithHub Provider workspace";
  const profileInitials = profileName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "PU";
  const [timeFilter, setTimeFilter] = useState("Today");
  const [objectFilter, setObjectFilter] = useState("All categories");
  const [search, setSearch] = useState("");
  const [workflowFilter, setWorkflowFilter] = useState<WorkflowFilter>("all");
  const [isWorkflowLoading, setIsWorkflowLoading] = useState(true);
  const [isRecentCollapsed, setIsRecentCollapsed] = useState(false);
  const [isPendingCollapsed, setIsPendingCollapsed] = useState(false);
  const [actionToast, setActionToast] = useState<string | null>(null);
  const [activeQuickAction, setActiveQuickAction] = useState<"continue-editing" | "create-teaching" | "review" | "publish" | null>(null);
  const [loadingQuickAction, setLoadingQuickAction] = useState<"continue-editing" | "create-teaching" | "review" | "publish" | null>(null);
  const [optimisticStatusById, setOptimisticStatusById] = useState<Record<string, TeachingWorkflowStatus>>({});
  const [actionPendingById, setActionPendingById] = useState<Record<string, DashboardActionKind | undefined>>({});
  const [, setAuditTrail] = useState<DashboardAuditEntry[]>([]);
  const [, setUsageMap] = useState<Record<string, number>>({});
  const [analyticsSnapshot, setAnalyticsSnapshot] = useState(() => readProviderAnalyticsSnapshot());
  const metrics = useMemo(() => EXECUTIVE_METRICS[role], [role]);
  const recommendations = useMemo(() => RECOMMENDATIONS_BY_ROLE[role], [role]);
  const primaryCtaLabel = "Create Teaching";
  const workflowSourceItems = workflowItemsOverride ?? PIPELINE_ITEMS;
  const workflowData = useMemo(() => deriveTeachingWorkflowData(workflowSourceItems), [workflowSourceItems]);
  const optimisticWorkflowData = useMemo<WorkflowDerivedData>(() => {
    if (!Object.keys(optimisticStatusById).length) return workflowData;

    const teachingItems = workflowData.teachingItems.map((item) => ({
      ...item,
      status: optimisticStatusById[item.id] ?? item.status,
    }));
    const recentTeachings = teachingItems.slice(0, 4);
    const continueItem = recentTeachings[0];
    const pendingWork = teachingItems
      .filter((item) => item.status === "Draft" || item.status === "Needs review")
      .slice(0, 5);
    const needsReviewCount = pendingWork.filter((item) => item.status === "Needs review").length;

    return { teachingItems, recentTeachings, continueItem, pendingWork, needsReviewCount };
  }, [optimisticStatusById, workflowData]);
  const { teachingItems, recentTeachings, continueItem, pendingWork, needsReviewCount } = optimisticWorkflowData;
  const workflowSummary = useMemo<WorkflowSummarySnapshot>(() => {
    const draftCount = teachingItems.filter((item) => item.status === "Draft").length;
    const publishedCount = teachingItems.filter((item) => item.status === "Published").length;
    return {
      draftCount,
      needsReviewCount,
      publishedCount,
      totalCount: teachingItems.length,
      updatedAt: new Date().toISOString(),
    };
  }, [teachingItems, needsReviewCount]);
  const filteredRecentTeachings = useMemo(() => {
    if (workflowFilter === "all") return recentTeachings;
    if (workflowFilter === "draft") return recentTeachings.filter((item) => item.status === "Draft");
    if (workflowFilter === "needs_review") return recentTeachings.filter((item) => item.status === "Needs review");
    return recentTeachings.filter((item) => item.status === "Published");
  }, [recentTeachings, workflowFilter]);
  const filteredPendingWork = useMemo(() => {
    if (workflowFilter === "all") return pendingWork;
    if (workflowFilter === "draft") return pendingWork.filter((item) => item.status === "Draft");
    if (workflowFilter === "needs_review") return pendingWork.filter((item) => item.status === "Needs review");
    return pendingWork.filter((item) => item.status === "Published");
  }, [pendingWork, workflowFilter]);
  const publishedTeachings = useMemo(
    () => teachingItems.filter((item) => item.status === "Published"),
    [teachingItems],
  );
  const draftTeachings = useMemo(
    () => teachingItems.filter((item) => item.status === "Draft"),
    [teachingItems],
  );
  const archivedTeachings = useMemo(
    () => publishedTeachings.slice(4, 16),
    [publishedTeachings],
  );
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

  const hasDashboardData = teachingItems.length > 0;
  const cardFocusRingClass =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fh-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--fh-surface-bg)]";
  const elevatedPanelClass = "rounded-xl border border-faith-line/70 bg-[var(--fh-surface-bg)] p-3.5";
  const actionButtonBaseClass = `w-full rounded-lg px-3 py-2 text-[11px] font-bold sm:w-auto sm:py-1.5 ${cardFocusRingClass}`;
  const iconToggleButtonClass = `inline-flex h-9 w-9 items-center justify-center rounded-full border border-faith-line/70 bg-[var(--fh-surface-bg)] text-[var(--fh-slate)] transition hover:bg-[var(--fh-surface)] ${cardFocusRingClass}`;
  const smartNextStep = useMemo(() => {
    if (needsReviewCount > 0) return `${needsReviewCount} item${needsReviewCount > 1 ? "s" : ""} need review first.`;
    const draftCount = pendingWork.filter((item) => item.status === "Draft").length;
    if (draftCount > 0) return `${draftCount} draft${draftCount > 1 ? "s are" : " is"} ready to finish.`;
    return "You're caught up. Start a new teaching task.";
  }, [needsReviewCount, pendingWork]);
  const analyticsInsights = useMemo(() => {
    const liveNowCount = LIVE_SESSIONS.filter((session) => session.isLiveNow).length;
    const totalLiveViewers = LIVE_SESSIONS.filter((session) => session.isLiveNow).reduce((sum, session) => sum + (session.viewers ?? 0), 0);
    const followersRaw = (metrics.find((metric) => metric.id === "followers")?.value ?? "0").toString();
    const followersCount = Number(followersRaw.replace(/[^\d.]/g, "")) * (followersRaw.toLowerCase().includes("k") ? 1000 : 1);
    const donationRaw = (metrics.find((metric) => metric.id === "giving")?.value ?? "$0").toString();
    const donationCount = Number(donationRaw.replace(/[^\d.]/g, ""));
    const engagementSignals =
      LIVE_SESSIONS.filter((session) => session.isLiveNow).reduce((sum, session) => sum + session.audience.length, 0) +
      needsReviewCount * 12;
    const snapshot =
      analyticsSnapshot ??
      buildProviderAnalyticsSnapshot({
        streamsLiveNow: liveNowCount,
        streamViewers: totalLiveViewers,
        followersTotal: followersCount,
        donationsTotal: donationCount,
        engagementSignals,
      });

    return [
      {
        key: "streams",
        label: "Streams",
        value: `${snapshot.streamsLiveNow} live now`,
        detail: `${snapshot.streamViewers.toLocaleString()} active viewers across live sessions`,
        trend: `+${snapshot.streamDeltaPct}% vs last week`,
        tone: "good" as const,
      },
      {
        key: "followers",
        label: "Followers",
        value: snapshot.followersTotal.toLocaleString(),
        detail: "Cross-campus audience growth and retention",
        trend: `+${snapshot.followerDeltaPct}% this month`,
        tone: "navy" as const,
      },
      {
        key: "donations",
        label: "Donations",
        value: `$${snapshot.donationsTotal.toLocaleString()}`,
        detail: "Live-response giving and fund movement",
        trend: `+${snapshot.donationDeltaPct}% period-over-period`,
        tone: "brand" as const,
      },
      {
        key: "engagement",
        label: "Engagement",
        value: `${snapshot.engagementSignals.toLocaleString()} signals`,
        detail: "Comments, prayer flow, and review interactions",
        trend: snapshot.engagementDeltaLabel,
        tone: "good" as const,
      },
    ];
  }, [analyticsSnapshot, metrics, needsReviewCount]);
  const hasDraftToContinue = pendingWork.some((item) => item.status === "Draft");
  const workflowPrimaryLabel = hasDraftToContinue && continueItem ? "Continue editing" : "Create Teaching";
  const prioritizedQuickActions = useMemo(() => {
    const actions: Array<"continue-editing" | "create-teaching" | "review" | "publish"> = [];
    if (needsReviewCount > 0) {
      actions.push("review");
      if (hasDraftToContinue && continueItem) actions.push("continue-editing");
      else actions.push("create-teaching");
    } else if (hasDraftToContinue && continueItem) {
      actions.push("continue-editing", "review");
    } else {
      actions.push("create-teaching", "review");
    }

    if (workflowSummary.publishedCount > 0) actions.push("publish");
    if (!actions.includes("create-teaching")) actions.push("create-teaching");

    const unique = actions.filter((action, index) => actions.indexOf(action) === index);
    const finalActions = unique.slice(0, 3);
    const primaryActionKey = finalActions[0] ?? "create-teaching";

    return { finalActions, primaryActionKey };
  }, [continueItem, hasDraftToContinue, needsReviewCount, workflowSummary.publishedCount]);

  const appendAudit = (
    itemId: string,
    action: DashboardActionKind,
    status: DashboardActionStatus,
    message: string,
  ) => {
    const entry: DashboardAuditEntry = {
      id: `${action}_${itemId}_${Date.now()}`,
      itemId,
      action,
      status,
      message,
      atISO: new Date().toISOString(),
    };
    setAuditTrail((prev) => {
      const next = [entry, ...prev].slice(0, 50);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(DASHBOARD_AUDIT_LOG_KEY, JSON.stringify(next));
      }
      return next;
    });
  };

  const handlePrimaryCta = () => {
    if (hasDraftToContinue && continueItem) {
      trackDashboardEvent("continue_editing", { item_id: continueItem.id, source: "primary_cta" });
      appendAudit(continueItem.id, "continue", "success", "continue opened");
      openTeachingItem(continueItem.id);
      return;
    }
    trackDashboardEvent("start_new_task");
    safeNav(ROUTES.teachingsDashboard);
  };
  const runQuickWorkflowAction = (
    action: "continue-editing" | "create-teaching" | "review" | "publish",
    callback: () => void,
  ) => {
    setActiveQuickAction(action);
    setLoadingQuickAction(action);
    window.setTimeout(() => {
      callback();
      setLoadingQuickAction(null);
    }, 220);
  };

  const formatLastEdited = (due: string) => {
    const dueLower = due.toLowerCase();
    if (dueLower === "now") return "just now";
    if (dueLower === "today") return "today, 2h ago";
    if (dueLower === "tomorrow") return "yesterday, 1d ago";
    return due;
  };
  const openTeachingItem = (itemId: string) => {
    setUsageMap((prev) => {
      const next = { ...prev, [itemId]: (prev[itemId] ?? 0) + 1 };
      if (typeof window !== "undefined") {
        window.localStorage.setItem("fh.dashboard.teachingUsage", JSON.stringify(next));
      }
      return next;
    });
    safeNav(`${ROUTES.teachingsDashboard}?teachingId=${encodeURIComponent(itemId)}`);
  };
  const runTeachingAction = async (itemId: string, action: "publish" | "request_review" | "open") => {
    const nextStatus: TeachingWorkflowStatus | undefined =
      action === "publish" ? "Published" : action === "request_review" ? "Needs review" : undefined;
    const previousStatus = optimisticStatusById[itemId];

    setActionPendingById((prev) => ({ ...prev, [itemId]: action }));
    appendAudit(itemId, action, "pending", `${action} started`);

    if (nextStatus) {
      setOptimisticStatusById((prev) => ({ ...prev, [itemId]: nextStatus }));
    }

    try {
      await new Promise<void>((resolve) => window.setTimeout(resolve, 220));
      trackDashboardEvent("quick_action_completed", { item_id: itemId, action });
      appendAudit(itemId, action, "success", `${action} completed`);
      setActionToast(
        action === "publish"
          ? "Publish completed."
          : action === "request_review"
            ? "Review request sent."
            : "Opened teaching.",
      );
      if (action === "open") {
        openTeachingItem(itemId);
      } else {
        safeNav(`${ROUTES.teachingsDashboard}?teachingId=${encodeURIComponent(itemId)}&action=${action}`);
      }
    } catch {
      setOptimisticStatusById((prev) => {
        const next = { ...prev };
        if (previousStatus) next[itemId] = previousStatus;
        else delete next[itemId];
        return next;
      });
      appendAudit(itemId, action, "error", `${action} failed and rolled back`);
      setActionToast("Action failed. Rolled back.");
    } finally {
      setActionPendingById((prev) => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
    }
  };

  const handleTeachingAction = (
    itemId: string,
    action: "publish" | "request_review" | "open"
  ) => {
    void runTeachingAction(itemId, action);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => setIsWorkflowLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!actionToast) return;
    const timer = window.setTimeout(() => setActionToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [actionToast]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem("fh.dashboard.teachingUsage");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Record<string, number>;
      if (parsed && typeof parsed === "object") setUsageMap(parsed);
    } catch {
      // no-op
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(DASHBOARD_AUDIT_LOG_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as DashboardAuditEntry[];
      if (Array.isArray(parsed)) setAuditTrail(parsed.slice(0, 50));
    } catch {
      // no-op
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(WORKFLOW_SUMMARY_STORAGE_KEY, JSON.stringify(workflowSummary));
    window.dispatchEvent(new CustomEvent(WORKFLOW_SUMMARY_EVENT, { detail: workflowSummary }));
  }, [workflowSummary]);

  useEffect(() => {
    const liveNowCount = LIVE_SESSIONS.filter((session) => session.isLiveNow).length;
    const totalLiveViewers = LIVE_SESSIONS.filter((session) => session.isLiveNow).reduce((sum, session) => sum + (session.viewers ?? 0), 0);
    const followersRaw = (metrics.find((metric) => metric.id === "followers")?.value ?? "0").toString();
    const followersTotal = Number(followersRaw.replace(/[^\d.]/g, "")) * (followersRaw.toLowerCase().includes("k") ? 1000 : 1);
    const donationRaw = (metrics.find((metric) => metric.id === "giving")?.value ?? "$0").toString();
    const donationsTotal = Number(donationRaw.replace(/[^\d.]/g, ""));
    const engagementSignals =
      LIVE_SESSIONS.filter((session) => session.isLiveNow).reduce((sum, session) => sum + session.audience.length, 0) +
      needsReviewCount * 12;

    const next = buildProviderAnalyticsSnapshot({
      streamsLiveNow: liveNowCount,
      streamViewers: totalLiveViewers,
      followersTotal,
      donationsTotal,
      engagementSignals,
    });
    setAnalyticsSnapshot(next);
    saveProviderAnalyticsSnapshot(next);
  }, [metrics, needsReviewCount]);

  if (!hasDashboardData) {
    return (
      <div className="fh-brand-shell min-h-screen w-full bg-[var(--fh-page-bg)] text-faith-ink transition-colors ">
        <div className="w-full max-w-none px-0 py-0">
          <div className="space-y-4 sm:space-y-5">
            <section className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface-bg)] p-5 sm:p-10 shadow-soft">
              <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
                <div
                  className="grid h-16 w-16 place-items-center rounded-2xl text-white shadow-md"
                  style={{ background: EV_GREEN }}
                >
                  <Plus className="h-8 w-8" />
                </div>
                <h2 className="mt-5 text-[26px] font-black tracking-tight text-faith-ink">
                  Start your first teaching
                </h2>
                <p className="mt-2 max-w-xl text-[14px] leading-6 text-[var(--fh-slate)]">
                  Create and manage your teachings from here.
                </p>
                <button
                  type="button"
                  aria-label={primaryCtaLabel}
                  onClick={handlePrimaryCta}
                  className={`ds-btn ds-btn--primary mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-7 text-[14px] font-extrabold text-white sm:w-auto ${cardFocusRingClass}`}
                  style={{ background: "linear-gradient(90deg, var(--fh-brand) 0%, var(--fh-brand-dark) 100%)", boxShadow: "0 14px 28px -16px color-mix(in srgb, var(--fh-brand) 72%, transparent)" }}
                >
                  <Plus className="h-4 w-4" />
                  Create your first teaching
                </button>
                <p className="mt-3 text-[12px] font-medium text-[var(--fh-slate)]">Start now, then refine content in the workflow board.</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  if (hasDashboardData) {
    return (
      <div className="fh-brand-shell min-h-screen w-full bg-[var(--fh-page-bg)] text-faith-ink transition-colors ">
        <div className="w-full max-w-none px-0 py-0">
          <div className="space-y-8 sm:space-y-10">
            <section className="fh-brand-hero rounded-2xl p-5 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <ProviderPageTitle
                  icon={<BookOpen className="h-6 w-6" />}
                  title="Teachings Workflow"
                  subtitle="Pick up the next teaching action, clear blockers, and publish with confidence."
                  className="mt-2"
                />
                <div className="w-full rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-3 shadow-soft lg:max-w-[360px] lg:min-w-[320px]">
                  <div className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-faith-ink">
                    Priority Action
                  </div>
                  <button
                    type="button"
                    aria-label={workflowPrimaryLabel}
                    onClick={handlePrimaryCta}
                    className={`ds-btn ds-btn--primary inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl px-6 text-[15px] font-black text-white ${cardFocusRingClass}`}
                    style={{ background: "linear-gradient(90deg, var(--fh-brand-dark) 0%, color-mix(in srgb, var(--fh-brand-dark) 82%, black 18%) 100%)", boxShadow: "0 16px 28px -14px rgba(22,36,76,0.9)" }}
                  >
                    {hasDraftToContinue && continueItem ? <ArrowRight className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {hasDraftToContinue && continueItem ? "Continue editing now" : "Create Teaching"}
                  </button>
                  <p className="mt-2 text-center text-[12px] font-semibold text-[var(--fh-slate)]">
                    {hasDraftToContinue && continueItem
                      ? "Resume your latest draft and finish faster."
                      : "Get started by creating your first teaching."}
                  </p>
                  {hasDraftToContinue ? (
                    <button
                      type="button"
                      aria-label="Create a new teaching"
                      onClick={() => {
                        trackDashboardEvent("start_new_task", { source: "hero_secondary" });
                        safeNav(ROUTES.teachingsDashboard);
                      }}
                      className={`ds-btn ds-btn--outline mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-bold ${cardFocusRingClass}`}
                    >
                      <Plus className="h-4 w-4" />
                      Create new teaching
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-faith-line/70/60 bg-[var(--fh-surface)] p-5 sm:p-5">
                <div className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--fh-slate)_78%,transparent)]">Next Actions</div>
                <TeachingsQuickActionsBar
                  activeAction={activeQuickAction}
                  loadingAction={loadingQuickAction}
                  canContinueEditing={Boolean(hasDraftToContinue && continueItem)}
                  visibleActions={prioritizedQuickActions.finalActions}
                  primaryActionKey={prioritizedQuickActions.primaryActionKey}
                  onContinueEditing={() =>
                    runQuickWorkflowAction("continue-editing", () => {
                      handlePrimaryCta();
                    })
                  }
                  onCreateTeaching={() =>
                    runQuickWorkflowAction("create-teaching", () => {
                      trackDashboardEvent("start_new_task", { source: "quick_actions_bar" });
                      safeNav(ROUTES.teachingsDashboard);
                    })
                  }
                  onReview={() =>
                    runQuickWorkflowAction("review", () => {
                      trackDashboardEvent("quick_action_completed", { action: "review" });
                      safeNav(ROUTES.reviewsModeration);
                    })
                  }
                  onPublish={() =>
                    runQuickWorkflowAction("publish", () => {
                      trackDashboardEvent("quick_action_completed", { action: "publish" });
                      safeNav(ROUTES.teachingsDashboard);
                    })
                  }
                />
              </div>
              <div className="-mx-1 mt-7 flex gap-2.5 overflow-x-auto px-1 pb-1 sm:mx-0 sm:mt-6 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
                <div className="shrink-0">
                  <Pill text={`${filteredRecentTeachings.length} Published`} tone="navy" />
                </div>
                <div className="shrink-0">
                  <Pill text={`${filteredPendingWork.length} Drafts`} tone="warn" />
                </div>
                <div className="shrink-0">
                  <Pill text={`${needsReviewCount} Needs review`} tone="brand" />
                </div>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  aria-label="Jump to review queue"
                  onClick={() => {
                    setWorkflowFilter("needs_review");
                    scrollToDashboardSection("provider-review-queue");
                  }}
                  className={`ds-btn ds-btn--outline h-10 w-full rounded-xl px-3 text-[12px] font-bold ${cardFocusRingClass}`}
                >
                  Jump to review queue
                </button>
                <button
                  type="button"
                  aria-label="Jump to published teachings"
                  onClick={() => {
                    setWorkflowFilter("published");
                    scrollToDashboardSection("provider-published-teachings");
                  }}
                  className={`ds-btn ds-btn--outline h-10 w-full rounded-xl px-3 text-[12px] font-bold ${cardFocusRingClass}`}
                >
                  Jump to published
                </button>
                <button
                  type="button"
                  aria-label="Jump to live now"
                  onClick={() => scrollToDashboardSection("provider-live-now")}
                  className={`ds-btn ds-btn--outline h-10 w-full rounded-xl px-3 text-[12px] font-bold ${cardFocusRingClass}`}
                >
                  Jump to live now
                </button>
              </div>
              <div className="mt-7 grid gap-5 sm:mt-6 sm:gap-5 md:grid-cols-[minmax(0,1.35fr)_minmax(240px,0.95fr)]">
                <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-5">
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[color-mix(in_srgb,var(--fh-slate)_78%,transparent)]">
                    {continueItem ? "Resume now" : "Start here"}
                  </div>
                  <div className="mt-2 text-[20px] font-black tracking-tight text-faith-ink">
                    {continueItem ? continueItem.title : "Create your next teaching"}
                  </div>
                  <p className="mt-2 text-[13px] leading-6 text-[var(--fh-slate)]">
                    {continueItem
                      ? `Last edited ${formatLastEdited(continueItem.updatedAt)}. Jump back in without scanning multiple cards.`
                      : "Open a new teaching flow and start building your next sermon, episode, or series update."}
                  </p>
                </div>
                <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-5">
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[color-mix(in_srgb,var(--fh-slate)_78%,transparent)]">Focus today</div>
                  <div className="mt-2 text-[16px] font-black tracking-tight text-faith-ink">{smartNextStep}</div>
                  <p className="mt-2 text-[13px] leading-6 text-[var(--fh-slate)]">
                    Review tasks, drafts, and published momentum are summarized here so the next move is obvious.
                  </p>
                </div>
              </div>
            </section>

            <SectionCard
              title="Dashboard Analytics"
              subtitle="Cleaner insights for streams, followers, donations, and engagement."
              titleTag="h2"
              right={<Pill text="Updated now" tone="navy" left={<TrendingUp className="h-3.5 w-3.5" />} />}
              className="bg-[var(--fh-surface)] p-4 sm:p-4 shadow-none"
            >
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {analyticsInsights.map((insight) => (
                  <div key={insight.key} className="rounded-xl border border-faith-line/70 bg-[var(--fh-surface-bg)] p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--fh-slate)_78%,transparent)]">{insight.label}</div>
                      <Pill text={insight.trend} tone={insight.tone} />
                    </div>
                    <div className="mt-2 text-[20px] font-black tracking-tight text-faith-ink">{insight.value}</div>
                    <p className="mt-1 text-[12px] leading-5 text-[var(--fh-slate)]">{insight.detail}</p>
                  </div>
                ))}
              </div>
              {analyticsSnapshot?.updatedAtISO ? (
                <div className="mt-3 text-[11px] font-semibold text-[color-mix(in_srgb,var(--fh-slate)_78%,transparent)]">
                  Last updated: {new Date(analyticsSnapshot.updatedAtISO).toLocaleString()}
                </div>
              ) : null}
            </SectionCard>

            <SectionCard
              title="Content Organization"
              subtitle="Structured lanes for teachings, drafts, published content, and archives."
              titleTag="h2"
              className="bg-[var(--fh-surface)] p-4 sm:p-4 shadow-none"
            >
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-faith-line/70 bg-[var(--fh-surface-bg)] p-3.5">
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--fh-slate)_78%,transparent)]">Teachings</div>
                  <div className="mt-2 text-[20px] font-black tracking-tight text-faith-ink">{teachingItems.length}</div>
                  <p className="mt-1 text-[12px] leading-5 text-[var(--fh-slate)]">All tracked teaching records in your workflow.</p>
                </div>
                <div className="rounded-xl border border-faith-line/70 bg-[var(--fh-surface-bg)] p-3.5">
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--fh-slate)_78%,transparent)]">Drafts</div>
                  <div className="mt-2 text-[20px] font-black tracking-tight text-faith-ink">{draftTeachings.length}</div>
                  <p className="mt-1 text-[12px] leading-5 text-[var(--fh-slate)]">Work-in-progress teachings that still need completion.</p>
                </div>
                <div className="rounded-xl border border-faith-line/70 bg-[var(--fh-surface-bg)] p-3.5">
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--fh-slate)_78%,transparent)]">Published</div>
                  <div className="mt-2 text-[20px] font-black tracking-tight text-faith-ink">{publishedTeachings.length}</div>
                  <p className="mt-1 text-[12px] leading-5 text-[var(--fh-slate)]">Ready-to-share content currently in active circulation.</p>
                </div>
                <div className="rounded-xl border border-faith-line/70 bg-[var(--fh-surface-bg)] p-3.5">
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--fh-slate)_78%,transparent)]">Archives</div>
                  <div className="mt-2 text-[20px] font-black tracking-tight text-faith-ink">{archivedTeachings.length}</div>
                  <p className="mt-1 text-[12px] leading-5 text-[var(--fh-slate)]">Older published teachings preserved for historical access.</p>
                </div>
              </div>
            </SectionCard>

            {needsReviewCount > 0 ? (
            <div id="provider-review-queue">
            <SectionCard
              title="Needs your attention"
                subtitle={`${needsReviewCount} teaching item${needsReviewCount > 1 ? "s need" : " needs"} review before publishing.`}
                titleTag="h2"
                right={<Pill text="Needs review" tone="warn" left={<AlertTriangle className="h-3.5 w-3.5" />} />}
                className="border-faith-line bg-[var(--fh-surface-bg)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-faith-line bg-[var(--fh-surface-bg)] p-3.5">
                  <div className="text-[13px] font-semibold text-faith-ink">
                    Next step: review pending teachings and resolve blockers.
                  </div>
                  <button
                    type="button"
                    aria-label="Review now"
                    onClick={() => safeNav(ROUTES.reviewsModeration)}
                    className={`ds-btn ds-btn--secondary inline-flex h-10 items-center gap-2 rounded-xl px-4 text-[12px] font-bold ${cardFocusRingClass}`}
                  >
                    <Flag className="h-4 w-4" />
                    Review now
                  </button>
                </div>
            </SectionCard>
            </div>
            ) : null}

            <div id="provider-live-now">
            <SectionCard
              title="Live Now discovery"
              subtitle="Sessions currently live, with quick handoff into session controls."
              titleTag="h2"
              right={
                <Pill
                  text={`${LIVE_SESSIONS.filter((session) => session.isLiveNow).length} live`}
                  tone="good"
                  left={<Radio className="h-3.5 w-3.5" />}
                />
              }
              className="bg-[var(--fh-surface)] p-4 sm:p-4 shadow-none"
            >
              <div className="space-y-3">
                {LIVE_SESSIONS.filter((session) => session.isLiveNow).map((session) => (
                  <div key={session.id} className={elevatedPanelClass}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--fh-slate)_78%,transparent)]">Live session</div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <h3 className="text-[14px] font-bold text-faith-ink">{session.title}</h3>
                        </div>
                        <div className="mt-1 text-[12px] text-[var(--fh-slate)]">
                          {session.time} - {session.campus}
                        </div>
                        <div className="mt-1 text-[12px] text-[var(--fh-slate)]">{session.audience}</div>
                        <div className="mt-1 text-[12px] text-[var(--fh-slate)]">{session.backstage}</div>
                        {session.warning ? (
                          <div className="mt-2 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900">
                            {session.warning}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex flex-col items-start gap-2 sm:items-end">
                        <Pill text={`${(session.viewers ?? 0).toLocaleString()} watching`} tone="navy" />
                        <button
                          type="button"
                          aria-label={`Open live dashboard for ${session.title}`}
                          onClick={() => safeNav(ROUTES.liveDashboard)}
                          className={`ds-btn ds-btn--outline inline-flex h-9 items-center gap-2 rounded-lg px-3 text-[11px] font-bold ${cardFocusRingClass}`}
                        >
                          <MonitorPlay className="h-3.5 w-3.5" />
                          Open dashboard
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {LIVE_SESSIONS.filter((session) => session.isLiveNow).length === 0 ? (
                  <div className="rounded-xl border border-dashed border-faith-line bg-[var(--fh-surface-bg)] px-4 py-6 text-center text-[12px] text-[var(--fh-slate)]">
                    No sessions are live right now. Upcoming sessions will appear here automatically.
                  </div>
                ) : null}
              </div>
            </SectionCard>
            </div>

            <div id="provider-published-teachings">
            <SectionCard
              title="Published teachings"
              subtitle="Published sermons ready to open, review, and share."
              titleTag="h2"
              right={
                <div className="flex items-center gap-2">
                  <Pill text={`${filteredRecentTeachings.length} items`} tone="navy" />
                  <button
                    type="button"
                    aria-label={isRecentCollapsed ? "Expand published teachings" : "Collapse published teachings"}
                    onClick={() => {
                      const next = !isRecentCollapsed;
                      setIsRecentCollapsed(next);
                      trackDashboardEvent("toggle_recent_section", { collapsed: next });
                    }}
                    className={iconToggleButtonClass}
                  >
                    {isRecentCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              }
              className="bg-[var(--fh-surface)] p-4 sm:p-4 shadow-none"
            >
              {!isRecentCollapsed ? (
                <>
              <div className="-mx-1 mb-3 flex gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
                {[
                  { key: "all", label: "All" },
                  { key: "draft", label: "Draft" },
                  { key: "needs_review", label: "Needs review" },
                  { key: "published", label: "Published" },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setWorkflowFilter(filter.key as "all" | "draft" | "needs_review" | "published")}
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-bold transition ${cardFocusRingClass}`}
                    style={{
                      borderColor: "var(--fh-line)",
                      background: workflowFilter === filter.key ? "color-mix(in srgb, var(--fh-brand) 14%, transparent)" : "var(--fh-surface)",
                      color: "var(--fh-ink)",
                    }}
                    aria-label={`Filter teachings by ${filter.label}`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {isWorkflowLoading
                  ? Array.from({ length: 4 }).map((_, idx) => (
                      <div
                        key={`recent-skeleton-${idx}`}
                        className="w-full animate-pulse rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-4"
                      >
                        <div className="h-4 w-2/3 rounded bg-[color-mix(in_srgb,var(--fh-line)_38%,var(--fh-surface-bg)_62%)]" />
                        <div className="mt-2 h-3 w-1/3 rounded bg-[color-mix(in_srgb,var(--fh-line)_30%,var(--fh-surface-bg)_70%)]" />
                        <div className="mt-3 flex gap-2">
                          <div className="h-8 w-20 rounded-lg bg-[color-mix(in_srgb,var(--fh-line)_38%,var(--fh-surface-bg)_62%)]" />
                          <div className="h-8 w-24 rounded-lg bg-[color-mix(in_srgb,var(--fh-line)_38%,var(--fh-surface-bg)_62%)]" />
                          <div className="h-8 w-16 rounded-lg bg-[color-mix(in_srgb,var(--fh-line)_38%,var(--fh-surface-bg)_62%)]" />
                        </div>
                      </div>
                    ))
                  : filteredRecentTeachings.map((item) => (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open published teaching ${item.title}`}
                    onClick={() => {
                      trackDashboardEvent("open_recent_item", { item_id: item.id });
                      openTeachingItem(item.id);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        trackDashboardEvent("open_recent_item", { item_id: item.id });
                        openTeachingItem(item.id);
                      }
                    }}
                    className={`w-full cursor-pointer rounded-xl border border-faith-line/70 bg-[var(--fh-surface-bg)] p-3.5 text-left transition hover:bg-[var(--fh-surface)] ${cardFocusRingClass}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-[14px] font-bold text-faith-ink">{item.title}</h3>
                        <p className="mt-1 text-[12px] text-[var(--fh-slate)]">Updated {formatLastEdited(item.updatedAt)}</p>
                      </div>
                      <Pill text={item.status} tone={item.status === "Published" ? "good" : "warn"} />
                    </div>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                      <button
                        type="button"
                        aria-label={`Open ${item.title}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleTeachingAction(item.id, "open");
                        }}
                        disabled={Boolean(actionPendingById[item.id])}
                        className={`ds-btn ds-btn--secondary w-full rounded-lg px-3 py-2 text-[11px] font-bold sm:w-auto sm:py-1.5 ${cardFocusRingClass}`}
                      >
                        {actionPendingById[item.id] === "open" ? "Opening..." : "Open teaching"}
                      </button>
                      <button
                        type="button"
                        aria-label={`Open published teaching in dashboard lane ${item.title}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          openTeachingItem(item.id);
                        }}
                        className={`ds-btn ds-btn--outline w-full rounded-lg px-3 py-2 text-[11px] font-bold sm:w-auto sm:py-1.5 ${cardFocusRingClass}`}
                      >
                        Open in lane
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {!isWorkflowLoading && filteredRecentTeachings.length === 0 ? (
                <div className="mt-3 rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] px-4 py-6 text-center">
                  <div className="text-[14px] font-bold text-faith-ink">
                    No published teachings match this filter yet.
                  </div>
                  <div className="mt-1 text-[12px] text-[var(--fh-slate)]">
                    Switch filters or open the teachings board to move drafts toward publish-ready status.
                  </div>
                  <button
                    type="button"
                    aria-label="Open teachings workflow from published empty state"
                    onClick={() => safeNav(ROUTES.teachingsDashboard)}
                    className={`ds-btn ds-btn--secondary mt-3 inline-flex h-10 items-center gap-2 rounded-xl px-4 text-[12px] font-bold ${cardFocusRingClass}`}
                  >
                    <ArrowRight className="h-4 w-4" />
                    Open teachings workflow
                  </button>
                </div>
              ) : null}
                </>
              ) : (
                <div className="text-[12px] text-[var(--fh-slate)]">Section collapsed.</div>
              )}
            </SectionCard>

            <SectionCard
              title="My drafts"
              subtitle="Draft sermons and review items that still need work."
              titleTag="h2"
              right={
                <div className="flex items-center gap-2">
                  <Pill text={`${filteredPendingWork.length} drafts`} tone="warn" />
                  <button
                    type="button"
                    aria-label={isPendingCollapsed ? "Expand my drafts" : "Collapse my drafts"}
                    onClick={() => {
                      const next = !isPendingCollapsed;
                      setIsPendingCollapsed(next);
                      trackDashboardEvent("toggle_pending_section", { collapsed: next });
                    }}
                    className={iconToggleButtonClass}
                  >
                    {isPendingCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              }
              className="bg-[var(--fh-surface)] p-4 sm:p-4 shadow-none"
            >
              {!isPendingCollapsed ? (
                <>
              <div className="-mx-1 mb-3 flex gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
                {[
                  { key: "all", label: "All pending" },
                  { key: "draft", label: "Draft" },
                  { key: "needs_review", label: "Needs review" },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setWorkflowFilter(filter.key as "all" | "draft" | "needs_review" | "published")}
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-bold transition ${cardFocusRingClass}`}
                    style={{
                      borderColor: "var(--fh-line)",
                      background: workflowFilter === filter.key ? "color-mix(in srgb, var(--fh-accent) 14%, transparent)" : "var(--fh-surface)",
                      color: "var(--fh-ink)",
                    }}
                    aria-label={`Filter pending work by ${filter.label}`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {isWorkflowLoading
                  ? Array.from({ length: 3 }).map((_, idx) => (
                      <div
                        key={`pending-skeleton-${idx}`}
                        className="animate-pulse rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-4"
                      >
                        <div className="h-4 w-1/2 rounded bg-[color-mix(in_srgb,var(--fh-line)_38%,var(--fh-surface-bg)_62%)]" />
                        <div className="mt-2 h-3 w-2/3 rounded bg-[color-mix(in_srgb,var(--fh-line)_30%,var(--fh-surface-bg)_70%)]" />
                        <div className="mt-3 flex gap-2">
                          <div className="h-8 w-20 rounded-lg bg-[color-mix(in_srgb,var(--fh-line)_38%,var(--fh-surface-bg)_62%)]" />
                          <div className="h-8 w-24 rounded-lg bg-[color-mix(in_srgb,var(--fh-line)_38%,var(--fh-surface-bg)_62%)]" />
                          <div className="h-8 w-16 rounded-lg bg-[color-mix(in_srgb,var(--fh-line)_38%,var(--fh-surface-bg)_62%)]" />
                        </div>
                      </div>
                    ))
                  : null}
                {!isWorkflowLoading && filteredPendingWork.length === 0 ? (
                  <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] px-4 py-6 text-center">
                    <div className="text-[14px] font-bold text-faith-ink">
                      No drafts pending, you're all caught up.
                    </div>
                    <div className="mt-1 text-[12px] text-[var(--fh-slate)]">
                      Great work. New drafts and review requests will appear here.
                    </div>
                    <button
                      type="button"
                      aria-label="Create a new teaching from empty drafts state"
                      onClick={() => safeNav(ROUTES.teachingsDashboard)}
                      className={`ds-btn ds-btn--secondary mt-3 inline-flex h-10 items-center gap-2 rounded-xl px-4 text-[12px] font-bold ${cardFocusRingClass}`}
                    >
                      <Plus className="h-4 w-4" />
                      Create teaching
                    </button>
                  </div>
                ) : null}
                {!isWorkflowLoading && filteredPendingWork.map((item) => (
                  <div key={item.id} className={elevatedPanelClass}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--fh-slate)_78%,transparent)]">Draft item</div>
                        <h3 className="text-[14px] font-bold text-faith-ink">{item.title}</h3>
                        <p className="mt-1 text-[12px] text-[var(--fh-slate)]">
                          {item.type} - Updated {formatLastEdited(item.updatedAt)}
                        </p>
                      </div>
                      <Pill text={item.status === "Draft" ? "Draft" : "Needs review"} tone="warn" />
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:flex sm:flex-row sm:flex-wrap sm:items-center">
                      <button
                        type="button"
                        aria-label={`Request review for ${item.title}`}
                        onClick={() => handleTeachingAction(item.id, "request_review")}
                        disabled={Boolean(actionPendingById[item.id])}
                        className={`ds-btn ds-btn--outline ${actionButtonBaseClass}`}
                      >
                        {actionPendingById[item.id] === "request_review" ? "Requesting..." : "Request review"}
                      </button>
                      <button
                        type="button"
                        aria-label={`Continue editing ${item.title}`}
                        onClick={() => handleTeachingAction(item.id, "open")}
                        disabled={Boolean(actionPendingById[item.id])}
                        className={`ds-btn ds-btn--secondary ${actionButtonBaseClass}`}
                      >
                        {actionPendingById[item.id] === "open" ? "Opening..." : "Continue editing"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
                </>
              ) : (
                <div className="text-[12px] text-[var(--fh-slate)]">Section collapsed.</div>
              )}
            </SectionCard>
            </div>
            <SectionCard
              title="Archives"
              subtitle="Older published teachings organized for quick retrieval."
              titleTag="h2"
              right={<Pill text={`${archivedTeachings.length} archived`} tone="navy" />}
              className="bg-[var(--fh-surface)] p-4 sm:p-4 shadow-none"
            >
              {archivedTeachings.length === 0 ? (
                <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] px-4 py-6 text-center">
                  <div className="text-[14px] font-bold text-faith-ink">No archived teachings yet.</div>
                  <div className="mt-1 text-[12px] text-[var(--fh-slate)]">
                    Published teachings beyond your active list will appear here automatically.
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {archivedTeachings.map((item) => (
                    <div key={item.id} className={elevatedPanelClass}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-[14px] font-bold text-faith-ink">{item.title}</h3>
                          <p className="mt-1 text-[12px] text-[var(--fh-slate)]">Archived from published lane</p>
                        </div>
                        <Pill text="Archived" tone="navy" />
                      </div>
                      <div className="mt-3">
                        <button
                          type="button"
                          aria-label={`Open archived teaching ${item.title}`}
                          onClick={() => handleTeachingAction(item.id, "open")}
                          className={`ds-btn ds-btn--outline w-full rounded-lg px-3 py-2 text-[11px] font-bold sm:w-auto ${cardFocusRingClass}`}
                        >
                          Open archive
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
                        {actionToast ? (
              <div
                role="status"
                aria-live="polite"
                className="fixed bottom-20 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-xl border border-faith-line/70 bg-[var(--fh-surface)] px-4 py-2 text-center text-[12px] font-semibold text-faith-ink shadow-soft sm:bottom-4 sm:left-auto sm:right-4 sm:w-auto sm:max-w-none sm:translate-x-0 sm:text-left"
              >
                {actionToast}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

}










