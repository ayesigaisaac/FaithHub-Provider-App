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
import { useAuth } from "@/auth/useAuth";

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
  reviewsModeration: "/faithhub/provider/reviews-moderation",
  eventsManager: "/faithhub/provider/events-manager",
} as const;

const WORKFLOW_SUMMARY_STORAGE_KEY = "fh.workflow.summary";
const WORKFLOW_SUMMARY_EVENT = "fh:workflow-summary";

function safeNav(path: string) {
  navigateWithRouter(path);
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
    return "bg-slate-100 text-slate-800 border-faith-line";
  }
  return "bg-[var(--fh-surface-bg)] text-slate-700 border-faith-line";
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
        "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[12px] font-semibold",
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
  titleTag = "h2",
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  titleTag?: "h2" | "h3";
}) {
  const TitleTag = titleTag;
  return (
    <section
      className={cx(
        "rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] p-4 sm:p-5 shadow-soft",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <TitleTag className="text-[15px] font-bold tracking-tight text-faith-ink">
            {title}
          </TitleTag>
          {subtitle ? (
            <p className="mt-1 text-[12px] leading-5 text-faith-slate">
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
      ? "text-emerald-700 border-emerald-200 hover:bg-emerald-50"
      : accent === "orange"
        ? "text-orange-700 border-orange-200 hover:bg-orange-50"
        : "text-slate-700 border-faith-line hover:bg-[var(--fh-surface)]";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl border bg-[var(--fh-surface-bg)] px-4 text-[12px] font-semibold transition-colors",
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
      className={cx("inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold text-white transition hover:brightness-95", className)}
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
          <div className="inline-flex items-center gap-1 rounded-full bg-[var(--fh-surface)] px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-slate-800 dark:text-emerald-300">
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
        "inline-flex h-10 items-center gap-2 rounded-full border px-3.5 text-[12px] font-semibold transition-colors",
        active
          ? "border-transparent text-white"
          : "border-faith-line bg-[var(--fh-surface-bg)] text-slate-700 hover:bg-[var(--fh-surface)]",
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
        className="h-11 w-full rounded-xl border border-faith-line bg-[var(--fh-surface-bg)] px-3.5 pr-9 text-[12px] font-semibold text-slate-700 shadow-soft outline-none focus:border-slate-300"
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
  const profileWorkspace = workspace?.brand?.trim() || "Provider Workspace";
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
  const [optimisticStatusById, setOptimisticStatusById] = useState<Record<string, TeachingWorkflowStatus>>({});
  const [usageMap, setUsageMap] = useState<Record<string, number>>({});
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
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7f5a] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--fh-surface-bg)]";
  const smartNextStep = useMemo(() => {
    if (needsReviewCount > 0) return `${needsReviewCount} item${needsReviewCount > 1 ? "s" : ""} need review first.`;
    const draftCount = pendingWork.filter((item) => item.status === "Draft").length;
    if (draftCount > 0) return `${draftCount} draft${draftCount > 1 ? "s are" : " is"} ready to finish.`;
    return "You're caught up. Start a new teaching task.";
  }, [needsReviewCount, pendingWork]);
  const recentlyEditedTeachings = useMemo(() => teachingItems.slice(0, 5), [teachingItems]);
  const quickAccessTeachings = useMemo(() => {
    const withUsage = teachingItems
      .map((item) => ({ item, score: usageMap[item.id] ?? 0 }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((entry) => entry.item);
    return withUsage;
  }, [teachingItems, usageMap]);

  const hasDraftToContinue = pendingWork.some((item) => item.status === "Draft");
  const workflowPrimaryLabel = hasDraftToContinue && continueItem ? "Continue latest draft" : "Create Teaching";

  const handlePrimaryCta = () => {
    if (hasDraftToContinue && continueItem) {
      trackDashboardEvent("continue_editing", { item_id: continueItem.id, source: "primary_cta" });
      openTeachingItem(continueItem.id);
      return;
    }
    trackDashboardEvent("start_new_task");
    safeNav(ROUTES.teachingsDashboard);
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
  const handleTeachingAction = (
    itemId: string,
    action: "publish" | "request_review" | "open"
  ) => {
    if (action === "publish") {
      setOptimisticStatusById((prev) => ({ ...prev, [itemId]: "Published" }));
    } else if (action === "request_review") {
      setOptimisticStatusById((prev) => ({ ...prev, [itemId]: "Needs review" }));
    }

    trackDashboardEvent("quick_action_completed", { item_id: itemId, action });
    const actionLabel =
      action === "publish" ? "Publish" : action === "request_review" ? "Request review" : "Open";
    setActionToast(`${actionLabel} action queued.`);
    if (action === "open") {
      openTeachingItem(itemId);
      return;
    }
    safeNav(`${ROUTES.teachingsDashboard}?teachingId=${encodeURIComponent(itemId)}&action=${action}`);
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
    window.localStorage.setItem(WORKFLOW_SUMMARY_STORAGE_KEY, JSON.stringify(workflowSummary));
    window.dispatchEvent(new CustomEvent(WORKFLOW_SUMMARY_EVENT, { detail: workflowSummary }));
  }, [workflowSummary]);

  if (!hasDashboardData) {
    return (
      <div className="min-h-screen w-full bg-[var(--fh-page-bg)] text-faith-ink transition-colors dark:bg-slate-950 dark:text-slate-100">
        <div className="w-full max-w-none px-0 py-0">
          <div className="space-y-4 sm:space-y-5">
            <section className="rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] p-6 sm:p-10 shadow-soft">
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
                <p className="mt-2 max-w-xl text-[14px] leading-6 text-slate-700">
                  Create and manage your teachings from here.
                </p>
                <button
                  type="button"
                  aria-label={primaryCtaLabel}
                  onClick={handlePrimaryCta}
                  className={`mt-6 inline-flex h-12 items-center gap-2 rounded-2xl px-7 text-[14px] font-extrabold text-white shadow-md transition hover:-translate-y-[1px] hover:shadow-lg ${cardFocusRingClass}`}
                  style={{ background: EV_GREEN, boxShadow: "0 10px 24px -14px rgba(3,205,140,0.85)" }}
                >
                  <Plus className="h-4 w-4" />
                  Create Teaching
                </button>
                <p className="mt-3 text-[12px] font-medium text-slate-700">Create Teaching</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  if (hasDashboardData) {
    return (
      <div className="min-h-screen w-full bg-[var(--fh-page-bg)] text-faith-ink transition-colors dark:bg-slate-950 dark:text-slate-100">
        <div className="w-full max-w-none px-0 py-0">
          <div className="space-y-6 sm:space-y-7">
            <section className="rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <ProviderPageTitle
                  icon={<BookOpen className="h-6 w-6" />}
                  title="Teachings Workflow"
                  subtitle="Continue editing, manage drafts, and publish completed teachings."
                  className="mt-2"
                />
                <div className="w-full sm:w-auto sm:min-w-[260px] rounded-2xl border border-faith-line bg-[var(--fh-surface)] p-3 shadow-soft">
                  <button
                    type="button"
                    aria-label={workflowPrimaryLabel}
                    onClick={() => {
                      trackDashboardEvent("start_new_task");
                      safeNav(ROUTES.teachingsDashboard);
                    }}
                    className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-6 text-[14px] font-extrabold text-white transition hover:-translate-y-[1px] hover:shadow-lg active:translate-y-0 ${cardFocusRingClass}`}
                    style={{ background: EV_GREEN, boxShadow: "0 12px 24px -14px rgba(3,205,140,0.9)" }}
                  >
                    <Plus className="h-4 w-4" />
                    {workflowPrimaryLabel}
                  </button>
                  <p className="mt-2 text-center text-[12px] font-medium text-slate-700">
                    {hasDraftToContinue && continueItem
                      ? "Resume your latest draft and finish faster."
                      : "Get started by creating your first teaching."}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Pill text={`${filteredRecentTeachings.length} Published`} tone="navy" />
                <Pill text={`${filteredPendingWork.length} Drafts`} tone="warn" />
                <Pill text={`${needsReviewCount} Needs review`} tone="brand" />
              </div>
            </section>

            {continueItem ? (
              <section
                className="rounded-3xl border p-5 sm:p-7 shadow-lg"
                style={{
                  borderColor: "rgba(3,205,140,0.35)",
                  background: "linear-gradient(180deg, rgba(3,205,140,0.10) 0%, var(--fh-surface-bg) 100%)",
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-[22px] font-black tracking-tight text-faith-ink sm:text-[26px]">
                      Continue Editing
                    </h2>
                    <p className="mt-1 text-[13px] leading-6 text-slate-700">
                      Pick up your latest teaching workflow instantly.
                    </p>
                    <p className="mt-2 text-[12px] font-semibold text-emerald-800">
                      Next step: {smartNextStep}
                    </p>
                  </div>
                  <Pill text={continueItem.status} tone={continueItem.status === "Published" ? "good" : "warn"} />
                </div>
                <div className="mt-5 rounded-2xl border border-faith-line bg-[var(--fh-surface)] p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-[18px] font-black tracking-tight text-faith-ink">
                        {continueItem.title}
                      </h3>
                      <p className="mt-1 text-[13px] text-slate-700">
                        Last edited {formatLastEdited(continueItem.updatedAt)}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Continue editing"
                      onClick={() => {
                        trackDashboardEvent("continue_editing", { item_id: continueItem.id });
                        openTeachingItem(continueItem.id);
                      }}
                      className={`inline-flex h-12 items-center gap-2 rounded-2xl px-6 text-[14px] font-extrabold text-white transition hover:-translate-y-[1px] hover:shadow-lg ${cardFocusRingClass}`}
                      style={{ background: EV_GREEN, boxShadow: "0 12px 24px -14px rgba(3,205,140,0.9)" }}
                    >
                      <ArrowRight className="h-4 w-4" />
                      Continue editing
                    </button>
                  </div>
                </div>
              </section>
            ) : null}

            {needsReviewCount > 0 ? (
              <SectionCard
                title="Needs your attention"
                subtitle={`${needsReviewCount} teaching item${needsReviewCount > 1 ? "s need" : " needs"} review before publishing.`}
                titleTag="h2"
                right={<Pill text="Needs review" tone="warn" left={<AlertTriangle className="h-3.5 w-3.5" />} />}
                className="border-amber-200 bg-amber-50/40"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-[var(--fh-surface-bg)] p-3.5">
                  <div className="text-[13px] font-semibold text-faith-ink">
                    Next step: review pending teachings and resolve blockers.
                  </div>
                  <button
                    type="button"
                    aria-label="Review now"
                    onClick={() => safeNav(ROUTES.reviewsModeration)}
                    className={`inline-flex h-10 items-center gap-2 rounded-xl border border-amber-300 bg-amber-100 px-4 text-[12px] font-bold text-amber-900 transition hover:bg-amber-200 ${cardFocusRingClass}`}
                  >
                    <Flag className="h-4 w-4" />
                    Review now
                  </button>
                </div>
              </SectionCard>
            ) : null}

            <SectionCard
              title="Start something new"
              subtitle="Create a new teaching flow when you’re ready."
              titleTag="h2"
              className="bg-[var(--fh-surface)] p-4 sm:p-4 shadow-none"
            >
              <div className="flex flex-wrap gap-2">
                <SolidButton
                  label="Create teaching"
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => {
                    trackDashboardEvent("start_new_task", { source: "start_something_new" });
                    safeNav(ROUTES.teachingsDashboard);
                  }}
                />
              </div>
            </SectionCard>

            {recentlyEditedTeachings.length > 0 ? (
              <SectionCard
                title="Recently edited"
                subtitle="Your latest teaching updates across drafts and published items."
                titleTag="h2"
                right={<Pill text={`${recentlyEditedTeachings.length} recent`} tone="navy" />}
                className="bg-[var(--fh-surface)] p-4 sm:p-4 shadow-none"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {recentlyEditedTeachings.slice(0, 4).map((item) => (
                    <button
                      key={`recently-edited-${item.id}`}
                      type="button"
                      onClick={() => openTeachingItem(item.id)}
                      className={`w-full rounded-xl border border-faith-line bg-[var(--fh-surface-bg)] p-3.5 text-left transition hover:bg-[var(--fh-surface)] ${cardFocusRingClass}`}
                      aria-label={`Open recently edited ${item.title}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-[14px] font-bold text-faith-ink">{item.title}</h3>
                        <Pill text={item.status} tone={item.status === "Published" ? "good" : "warn"} />
                      </div>
                      <p className="mt-1 text-[12px] text-slate-700">Updated {formatLastEdited(item.updatedAt)}</p>
                    </button>
                  ))}
                </div>
              </SectionCard>
            ) : null}

            {quickAccessTeachings.length > 0 ? (
              <SectionCard
                title="Quick access"
                subtitle="Frequently used teachings based on your recent activity."
                titleTag="h2"
                right={<Pill text={`${quickAccessTeachings.length} frequent`} tone="good" />}
                className="bg-[var(--fh-surface)] p-4 sm:p-4 shadow-none"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {quickAccessTeachings.map((item) => (
                    <button
                      key={`quick-access-${item.id}`}
                      type="button"
                      onClick={() => openTeachingItem(item.id)}
                      className={`w-full rounded-xl border border-faith-line bg-[var(--fh-surface-bg)] p-3.5 text-left transition hover:bg-[var(--fh-surface)] ${cardFocusRingClass}`}
                      aria-label={`Open quick access ${item.title}`}
                    >
                      <div className="text-[14px] font-bold text-faith-ink">{item.title}</div>
                      <div className="mt-1 text-[12px] text-slate-700">Used {(usageMap[item.id] ?? 0)} times</div>
                    </button>
                  ))}
                </div>
              </SectionCard>
            ) : null}

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
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-faith-line bg-[var(--fh-surface-bg)] text-slate-700 transition hover:bg-[var(--fh-surface)] ${cardFocusRingClass}`}
                  >
                    {isRecentCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              }
              className="bg-[var(--fh-surface)] p-4 sm:p-4 shadow-none"
            >
              {!isRecentCollapsed ? (
                <>
              <div className="mb-3 flex flex-wrap gap-2">
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
                      background: workflowFilter === filter.key ? "rgba(3,205,140,0.14)" : "var(--fh-surface)",
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
                        className="w-full animate-pulse rounded-2xl border border-faith-line bg-[var(--fh-surface)] p-4"
                      >
                        <div className="h-4 w-2/3 rounded bg-slate-200/70" />
                        <div className="mt-2 h-3 w-1/3 rounded bg-slate-200/60" />
                        <div className="mt-3 flex gap-2">
                          <div className="h-8 w-20 rounded-lg bg-slate-200/70" />
                          <div className="h-8 w-24 rounded-lg bg-slate-200/70" />
                          <div className="h-8 w-16 rounded-lg bg-slate-200/70" />
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
                    className={`w-full cursor-pointer rounded-xl border border-faith-line bg-[var(--fh-surface-bg)] p-3.5 text-left transition hover:bg-[var(--fh-surface)] ${cardFocusRingClass}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-[14px] font-bold text-faith-ink">{item.title}</h3>
                        <p className="mt-1 text-[12px] text-slate-700">Updated {formatLastEdited(item.updatedAt)}</p>
                      </div>
                      <Pill text={item.status} tone={item.status === "Published" ? "good" : "warn"} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        aria-label={`Publish ${item.title}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleTeachingAction(item.id, "publish");
                        }}
                        className={`rounded-lg border border-faith-line bg-[var(--fh-surface-bg)] px-3 py-1.5 text-[11px] font-bold text-faith-ink transition hover:bg-emerald-50 ${cardFocusRingClass}`}
                      >
                        Publish
                      </button>
                      <button
                        type="button"
                        aria-label={`Request review for ${item.title}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleTeachingAction(item.id, "request_review");
                        }}
                        className={`rounded-lg border border-faith-line bg-[var(--fh-surface-bg)] px-3 py-1.5 text-[11px] font-bold text-faith-ink transition hover:bg-amber-50 ${cardFocusRingClass}`}
                      >
                        Request review
                      </button>
                      <button
                        type="button"
                        aria-label={`Open ${item.title}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleTeachingAction(item.id, "open");
                        }}
                        className={`rounded-lg border border-faith-line bg-[var(--fh-surface-bg)] px-3 py-1.5 text-[11px] font-bold text-faith-ink transition hover:bg-slate-100 ${cardFocusRingClass}`}
                      >
                        Open
                      </button>
                    </div>
                  </div>
                ))}
              </div>
                </>
              ) : (
                <div className="text-[12px] text-slate-700">Section collapsed.</div>
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
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-faith-line bg-[var(--fh-surface-bg)] text-slate-700 transition hover:bg-[var(--fh-surface)] ${cardFocusRingClass}`}
                  >
                    {isPendingCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              }
              className="bg-[var(--fh-surface)] p-4 sm:p-4 shadow-none"
            >
              {!isPendingCollapsed ? (
                <>
              <div className="mb-3 flex flex-wrap gap-2">
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
                      background: workflowFilter === filter.key ? "rgba(247,127,0,0.14)" : "var(--fh-surface)",
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
                        className="animate-pulse rounded-2xl border border-faith-line bg-[var(--fh-surface)] p-4"
                      >
                        <div className="h-4 w-1/2 rounded bg-slate-200/70" />
                        <div className="mt-2 h-3 w-2/3 rounded bg-slate-200/60" />
                        <div className="mt-3 flex gap-2">
                          <div className="h-8 w-20 rounded-lg bg-slate-200/70" />
                          <div className="h-8 w-24 rounded-lg bg-slate-200/70" />
                          <div className="h-8 w-16 rounded-lg bg-slate-200/70" />
                        </div>
                      </div>
                    ))
                  : null}
                {!isWorkflowLoading && filteredPendingWork.length === 0 ? (
                  <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface)] px-4 py-6 text-center">
                    <div className="text-[14px] font-bold text-faith-ink">
                      No drafts pending, you're all caught up.
                    </div>
                    <div className="mt-1 text-[12px] text-slate-700">
                      Great work. New drafts and review requests will appear here.
                    </div>
                  </div>
                ) : null}
                {!isWorkflowLoading && filteredPendingWork.map((item) => (
                  <div key={item.id} className="rounded-xl border border-faith-line bg-[var(--fh-surface-bg)] p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-[14px] font-bold text-faith-ink">{item.title}</h3>
                        <p className="mt-1 text-[12px] text-slate-700">
                          {item.type} · Updated {formatLastEdited(item.updatedAt)}
                        </p>
                      </div>
                      <Pill text={item.status === "Draft" ? "Draft" : "Needs review"} tone="warn" />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        aria-label={`Publish ${item.title}`}
                        onClick={() => handleTeachingAction(item.id, "publish")}
                        className={`rounded-lg border border-faith-line bg-[var(--fh-surface-bg)] px-3 py-1.5 text-[11px] font-bold text-faith-ink transition hover:bg-emerald-50 ${cardFocusRingClass}`}
                      >
                        Publish
                      </button>
                      <button
                        type="button"
                        aria-label={`Request review for ${item.title}`}
                        onClick={() => handleTeachingAction(item.id, "request_review")}
                        className={`rounded-lg border border-faith-line bg-[var(--fh-surface-bg)] px-3 py-1.5 text-[11px] font-bold text-faith-ink transition hover:bg-amber-50 ${cardFocusRingClass}`}
                      >
                        Request review
                      </button>
                      <button
                        type="button"
                        aria-label={`Open ${item.title}`}
                        onClick={() => handleTeachingAction(item.id, "open")}
                        className={`rounded-lg border border-faith-line bg-[var(--fh-surface-bg)] px-3 py-1.5 text-[11px] font-bold text-faith-ink transition hover:bg-slate-100 ${cardFocusRingClass}`}
                      >
                        Open
                      </button>
                    </div>
                  </div>
                ))}
              </div>
                </>
              ) : (
                <div className="text-[12px] text-slate-700">Section collapsed.</div>
              )}
            </SectionCard>
            {actionToast ? (
              <div
                role="status"
                aria-live="polite"
                className="fixed bottom-4 right-4 z-50 rounded-xl border border-faith-line bg-[var(--fh-surface)] px-4 py-2 text-[12px] font-semibold text-faith-ink shadow-soft"
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


