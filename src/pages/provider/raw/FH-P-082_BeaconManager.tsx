// @ts-nocheck

"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  Eye,
  ExternalLink,
  Filter,
  Layers,
  Link2,
  Monitor,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  Wand2,
  Zap,
} from "lucide-react";
import { KpiTile } from "../../../components/ui/KpiTile";
import { navigateWithRouter } from "@/navigation/routerNavigate";

/**
 * FaithHub — Beacon Manager
 * ----------------------------------
 * Premium operational control surface for Beacon campaigns after build.
 *
 * Intent
 * - Keep the premium creator/e-commerce management rhythm from the uploaded Adz Manager base.
 * - Use EVzone Green as primary and Orange as secondary.
 * - Make linked and standalone Beacon campaigns equally first-class.
 * - Combine budget stewardship, approvals, creative management, optimization rules,
 *   attribution drill-downs, and full audit visibility in one page.
 *
 * Notes
 * - Self-contained mock TSX page. Replace routing, persistence, analytics,
 *   policy wiring, and collaboration hooks during integration.
 * - Tailwind-style utility classes assumed.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#0b1d49";

const ROUTES = {
  beaconDashboard: "/faithhub/provider/beacon-dashboard",
  beaconBuilder: "/faithhub/provider/beacon-builder",
  beaconMarketplace: "/faithhub/provider/beacon-marketplace",
};

const HERO_REPLAY =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80";
const HERO_LIVE =
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80";
const HERO_EVENT =
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80";
const HERO_CROWDFUND =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80";
const HERO_ANNOUNCEMENT =
  "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1600&q=80";
const HERO_SERIES =
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1600&q=80";

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  navigateWithRouter(url);
}

function fmtInt(n: number) {
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function fmtCurrency(n: number, currency = "£") {
  return `${currency}${Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(n)}`;
}

function fmtPct(n: number, digits = 1) {
  return `${n.toFixed(digits)}%`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function toLocalInputValue(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function fromLocalInputValue(value: string, fallbackISO: string) {
  if (!value) return fallbackISO;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return fallbackISO;
  return d.toISOString();
}

type Accent = "green" | "orange" | "navy";
type PreviewMode = "desktop" | "mobile";
type CampaignMode = "Linked" | "Standalone";
type CampaignState =
  | "Draft"
  | "Active"
  | "Learning"
  | "At risk"
  | "Completed"
  | "Paused"
  | "Rejected"
  | "Archived";
type ObjectiveType =
  | "Awareness"
  | "Live attendance"
  | "Replay growth"
  | "Giving conversion"
  | "Charity momentum"
  | "Event registration"
  | "Follow growth";
type OutcomeType =
  | "Watch starts"
  | "Donations"
  | "Registrations"
  | "Followers"
  | "Product clicks";
type SourceType =
  | "Live Session"
  | "Replay"
  | "Clip"
  | "Event"
  | "Fund"
  | "Crowdfund"
  | "Series"
  | "Institution"
  | "Standalone Announcement";
type PlacementType =
  | "Home feed spotlight"
  | "Live countdown rail"
  | "Replay shelf spotlight"
  | "Giving momentum card"
  | "Event discovery hero"
  | "Clip carousel";
type BidStrategy = "Balanced" | "Reach first" | "Conversion first";
type PacingLogic = "Balanced" | "Accelerated" | "Guarded";
type CreativeState = "Healthy" | "Learning" | "Needs QA" | "Rejected";
type PolicyState = "Approved" | "Needs review" | "Rejected";
type ApprovalState = "Ready" | "Awaiting approvals" | "Blocked";

type CreativeVariant = {
  id: string;
  name: string;
  language: string;
  format: string;
  ctaLabel: string;
  subtitleMode: string;
  state: CreativeState;
  health: number;
  fatigue: number;
  ctr: number;
  impressions: number;
  primary: boolean;
  lastEditedLabel: string;
};

type OptimizationRule = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  threshold: string;
  accent: Accent;
};

type AuditEvent = {
  id: string;
  actor: string;
  action: string;
  note: string;
  timeLabel: string;
  accent: Accent;
};

type BreakdownRow = {
  label: string;
  value: number;
  note: string;
  accent?: Accent;
};

type BeaconCampaign = {
  id: string;
  title: string;
  subtitle: string;
  state: CampaignState;
  mode: CampaignMode;
  objective: ObjectiveType;
  primaryOutcome: OutcomeType;
  sourceType: SourceType;
  linkedName?: string;
  owner: string;
  placement: PlacementType;
  accent: Accent;
  heroImageUrl: string;

  startISO: string;
  endISO: string;

  spend: number;
  totalBudget: number;
  dailyCap: number;
  reach: number;
  ctr: number;
  watchStarts: number;
  givingConversions: number;
  eventRegistrations: number;
  productClicks: number;
  followAdds: number;
  frequencyCap: number;

  creativeHealth: number;
  qaScore: number;
  audienceHealth: number;
  policyState: PolicyState;
  approvalState: ApprovalState;
  launchBlockers: string[];
  policyNotes: string[];

  bidStrategy: BidStrategy;
  pacingLogic: PacingLogic;
  pacePct: number;
  burnRateLabel: string;
  forecastLabel: string;
  budgetMoveLabel: string;

  segmentLeads: string[];
  regionLeads: string[];
  destinationObjects: string[];

  creativeVersions: CreativeVariant[];
  optimizationRules: OptimizationRule[];
  auditTrail: AuditEvent[];

  spendSeries: number[];
  conversionSeries: number[];
  placementBreakdown: BreakdownRow[];
  segmentBreakdown: BreakdownRow[];
  timeWindowBreakdown: BreakdownRow[];
  destinationBreakdown: BreakdownRow[];
};

function makeCreativeVariants(
  accent: Accent,
  baseName: string,
  ctaLabel: string,
  learning = false,
): CreativeVariant[] {
  return [
    {
      id: `${baseName}_v1`,
      name: `${baseName} Hero`,
      language: "English",
      format: "16:9 video",
      ctaLabel,
      subtitleMode: "Selectable subtitles",
      state: learning ? "Learning" : "Healthy",
      health: learning ? 74 : 88,
      fatigue: learning ? 36 : 22,
      ctr: learning ? 3.6 : 4.9,
      impressions: learning ? 18000 : 82000,
      primary: true,
      lastEditedLabel: "2h ago",
    },
    {
      id: `${baseName}_v2`,
      name: `${baseName} Mobile Variant`,
      language: "English",
      format: "9:16 video",
      ctaLabel,
      subtitleMode: "Burned-in captions",
      state: "Healthy",
      health: accent === "orange" ? 82 : 86,
      fatigue: 28,
      ctr: accent === "orange" ? 4.1 : 4.7,
      impressions: 26000,
      primary: false,
      lastEditedLabel: "Yesterday",
    },
    {
      id: `${baseName}_v3`,
      name: `${baseName} Local Language`,
      language: "English + Luganda",
      format: "1:1 static",
      ctaLabel,
      subtitleMode: "Static copy only",
      state: accent === "navy" ? "Needs QA" : "Healthy",
      health: accent === "navy" ? 63 : 78,
      fatigue: accent === "navy" ? 49 : 31,
      ctr: accent === "navy" ? 2.9 : 3.8,
      impressions: 14000,
      primary: false,
      lastEditedLabel: "3 days ago",
    },
  ];
}

function makeOptimizationRules(accent: Accent): OptimizationRule[] {
  return [
    {
      id: "rule_pause",
      label: "Auto-pause on severe underperformance",
      description: "Pause the campaign if CTR falls below the floor for 2 hours.",
      enabled: true,
      threshold: "CTR < 1.8%",
      accent,
    },
    {
      id: "rule_rotate",
      label: "Rotate creative after fatigue signal",
      description: "Swap to the next best variant when fatigue risk rises.",
      enabled: true,
      threshold: "Fatigue > 65%",
      accent: "green",
    },
    {
      id: "rule_frequency",
      label: "Frequency protection",
      description: "Exclude audiences that have already seen the ad too often.",
      enabled: accent !== "orange",
      threshold: "Frequency > 4.2",
      accent: "navy",
    },
    {
      id: "rule_scale",
      label: "Scale strong performers",
      description: "Increase daily cap when conversion cost stays below target.",
      enabled: accent === "green" || accent === "orange",
      threshold: "CPA below target for 6h",
      accent: "orange",
    },
  ];
}

function makeAuditTrail(owner: string, mode: CampaignMode): AuditEvent[] {
  return [
    {
      id: `${owner}_1`,
      actor: owner,
      action: "Updated budget pacing",
      note:
        mode === "Standalone"
          ? "Raised the daily cap for broader awareness."
          : "Adjusted the daily cap to protect cost efficiency.",
      timeLabel: "42 min ago",
      accent: "orange",
    },
    {
      id: `${owner}_2`,
      actor: "Policy reviewer",
      action: "Reviewed creative for compliance",
      note: "Confirmed CTA language and destination notes meet policy expectations.",
      timeLabel: "3h ago",
      accent: "green",
    },
    {
      id: `${owner}_3`,
      actor: "Outreach lead",
      action: "Added localized creative version",
      note: "Added a subtitle-ready variant for multilingual audiences.",
      timeLabel: "Yesterday",
      accent: "navy",
    },
    {
      id: `${owner}_4`,
      actor: "Finance lead",
      action: "Approved campaign budget",
      note: "Budget approved with stewardship note logged to the campaign record.",
      timeLabel: "2 days ago",
      accent: "green",
    },
  ];
}

const CAMPAIGNS_SEED: BeaconCampaign[] = [
  {
    id: "bc_replay_sunday_encounter",
    title: "Sunday Encounter Replay Boost",
    subtitle: "Re-engage the replay with a premium watch-start campaign and replay shelf coverage.",
    state: "Active",
    mode: "Linked",
    objective: "Replay growth",
    primaryOutcome: "Watch starts",
    sourceType: "Replay",
    linkedName: "Sunday Encounter Replay",
    owner: "Outreach Team",
    placement: "Replay shelf spotlight",
    accent: "green",
    heroImageUrl: HERO_REPLAY,
    startISO: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    endISO: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString(),
    spend: 1240,
    totalBudget: 1800,
    dailyCap: 240,
    reach: 182000,
    ctr: 4.9,
    watchStarts: 8600,
    givingConversions: 142,
    eventRegistrations: 34,
    productClicks: 0,
    followAdds: 228,
    frequencyCap: 4,
    creativeHealth: 87,
    qaScore: 92,
    audienceHealth: 81,
    policyState: "Approved",
    approvalState: "Ready",
    launchBlockers: [],
    policyNotes: [
      "Replay artwork and CTA were approved with no compliance flags.",
      "Localized subtitle assets remain within placement safe areas.",
    ],
    bidStrategy: "Conversion first",
    pacingLogic: "Balanced",
    pacePct: 69,
    burnRateLabel: "On pace",
    forecastLabel: "Projected to exceed watch-start target by 14%",
    budgetMoveLabel: "Recommend +£180 over the next 48h",
    segmentLeads: ["Replay viewers", "Recent attendees", "Families"],
    regionLeads: ["Kampala", "Nairobi", "Accra"],
    destinationObjects: ["Replay page", "Library shelf", "Beacon follow-up"],
    creativeVersions: makeCreativeVariants("green", "Replay", "Open replay", false),
    optimizationRules: makeOptimizationRules("green"),
    auditTrail: makeAuditTrail("Outreach Team", "Linked"),
    spendSeries: [120, 138, 144, 158, 166, 174, 182, 190, 202, 214, 221, 234],
    conversionSeries: [520, 540, 590, 610, 660, 700, 720, 760, 790, 820, 850, 880],
    placementBreakdown: [
      { label: "Replay shelf spotlight", value: 8200, note: "Best watch-start quality", accent: "green" },
      { label: "Home feed spotlight", value: 5100, note: "Strong secondary reach", accent: "navy" },
      { label: "Clip carousel", value: 2900, note: "Useful for discovery retargeting", accent: "orange" },
    ],
    segmentBreakdown: [
      { label: "Replay viewers", value: 3900, note: "Highest retention lift", accent: "green" },
      { label: "Recent attendees", value: 2800, note: "Solid watch-start quality", accent: "orange" },
      { label: "Families", value: 1900, note: "High completion rate", accent: "navy" },
    ],
    timeWindowBreakdown: [
      { label: "Sunday evening", value: 44, note: "Best CTR", accent: "green" },
      { label: "Monday morning", value: 27, note: "Moderate replay intent", accent: "navy" },
      { label: "Wednesday noon", value: 18, note: "Lower quality traffic", accent: "orange" },
    ],
    destinationBreakdown: [
      { label: "Replay page", value: 8600, note: "Primary outcome", accent: "green" },
      { label: "Giving prompt", value: 142, note: "Live-to-giving continuation", accent: "orange" },
      { label: "Institution follows", value: 228, note: "Secondary growth", accent: "navy" },
    ],
  },
  {
    id: "bc_event_youth_camp",
    title: "Youth Camp Registration Sprint",
    subtitle: "Drive urgent event sign-ups with countdown placements and localized community targeting.",
    state: "Learning",
    mode: "Linked",
    objective: "Event registration",
    primaryOutcome: "Registrations",
    sourceType: "Event",
    linkedName: "Youth Camp Weekend",
    owner: "Events Team",
    placement: "Event discovery hero",
    accent: "orange",
    heroImageUrl: HERO_EVENT,
    startISO: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    endISO: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    spend: 2480,
    totalBudget: 3200,
    dailyCap: 320,
    reach: 96000,
    ctr: 3.8,
    watchStarts: 0,
    givingConversions: 0,
    eventRegistrations: 412,
    productClicks: 0,
    followAdds: 66,
    frequencyCap: 5,
    creativeHealth: 79,
    qaScore: 84,
    audienceHealth: 74,
    policyState: "Approved",
    approvalState: "Awaiting approvals",
    launchBlockers: ["Final campus-age disclaimer pending approval."],
    policyNotes: [
      "Countdown creative approved, but one copy variant still needs age-band review.",
      "Last-minute changes should stay within the approved event terms.",
    ],
    bidStrategy: "Reach first",
    pacingLogic: "Accelerated",
    pacePct: 63,
    burnRateLabel: "Learning phase",
    forecastLabel: "Projected to reach 520 registrations if pace improves",
    budgetMoveLabel: "Hold current budget until learning stabilizes",
    segmentLeads: ["Youth", "Campus groups", "Community volunteers"],
    regionLeads: ["Kampala", "Mbarara", "Jinja"],
    destinationObjects: ["Event page", "RSVP form", "Countdown rail"],
    creativeVersions: makeCreativeVariants("orange", "Youth Camp", "Register now", true),
    optimizationRules: makeOptimizationRules("orange"),
    auditTrail: makeAuditTrail("Events Team", "Linked"),
    spendSeries: [180, 194, 210, 224, 238, 246, 258, 264, 271, 276, 284, 292],
    conversionSeries: [12, 18, 26, 34, 42, 48, 61, 73, 81, 94, 108, 121],
    placementBreakdown: [
      { label: "Event discovery hero", value: 258, note: "Best registration yield", accent: "orange" },
      { label: "Home feed spotlight", value: 102, note: "Reach-heavy support", accent: "green" },
      { label: "Live countdown rail", value: 52, note: "Useful for late urgency", accent: "navy" },
    ],
    segmentBreakdown: [
      { label: "Youth", value: 188, note: "Best CTR and completion", accent: "orange" },
      { label: "Campus groups", value: 134, note: "Strong conversion quality", accent: "green" },
      { label: "Community volunteers", value: 90, note: "Helpful for group sign-ups", accent: "navy" },
    ],
    timeWindowBreakdown: [
      { label: "Friday evening", value: 41, note: "Highest urgency", accent: "orange" },
      { label: "Saturday morning", value: 33, note: "Reliable steady flow", accent: "green" },
      { label: "Weekday lunch", value: 15, note: "Lower intent window", accent: "navy" },
    ],
    destinationBreakdown: [
      { label: "Event registrations", value: 412, note: "Primary campaign goal", accent: "orange" },
      { label: "Institution follows", value: 66, note: "Secondary benefit", accent: "green" },
      { label: "Messenger handoff", value: 31, note: "Volunteer coordination", accent: "navy" },
    ],
  },
  {
    id: "bc_standalone_prayer_night",
    title: "Prayer Night Announcement",
    subtitle: "Standalone Beacon campaign for a citywide prayer gathering with no linked content object.",
    state: "Draft",
    mode: "Standalone",
    objective: "Awareness",
    primaryOutcome: "Followers",
    sourceType: "Standalone Announcement",
    owner: "Communications Team",
    placement: "Home feed spotlight",
    accent: "navy",
    heroImageUrl: HERO_ANNOUNCEMENT,
    startISO: new Date(Date.now() + 10 * 3600 * 1000).toISOString(),
    endISO: new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString(),
    spend: 0,
    totalBudget: 680,
    dailyCap: 80,
    reach: 0,
    ctr: 0,
    watchStarts: 0,
    givingConversions: 0,
    eventRegistrations: 0,
    productClicks: 0,
    followAdds: 0,
    frequencyCap: 3,
    creativeHealth: 68,
    qaScore: 61,
    audienceHealth: 0,
    policyState: "Needs review",
    approvalState: "Blocked",
    launchBlockers: [
      "CTA destination still points to a placeholder page.",
      "One mobile copy variant exceeds the safe area for discovery placements.",
    ],
    policyNotes: [
      "Standalone announcement is allowed, but destination and disclaimer must be finalized.",
      "Resolve the mobile-safe-area issue before launch.",
    ],
    bidStrategy: "Balanced",
    pacingLogic: "Guarded",
    pacePct: 0,
    burnRateLabel: "Not started",
    forecastLabel: "Awaiting launch approval",
    budgetMoveLabel: "No budget recommendation until approved",
    segmentLeads: ["Followers", "Prayer networks", "Citywide audience"],
    regionLeads: ["Kampala", "Entebbe"],
    destinationObjects: ["Standalone landing page", "Institution follow CTA"],
    creativeVersions: makeCreativeVariants("navy", "Prayer Night", "Open announcement", false),
    optimizationRules: makeOptimizationRules("navy"),
    auditTrail: makeAuditTrail("Communications Team", "Standalone"),
    spendSeries: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    conversionSeries: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    placementBreakdown: [
      { label: "Home feed spotlight", value: 0, note: "Queued after approval", accent: "navy" },
      { label: "Clip carousel", value: 0, note: "Not booked yet", accent: "orange" },
    ],
    segmentBreakdown: [
      { label: "Followers", value: 0, note: "Awaiting launch", accent: "navy" },
      { label: "Prayer networks", value: 0, note: "Awaiting launch", accent: "orange" },
    ],
    timeWindowBreakdown: [{ label: "Launch pending", value: 0, note: "No live data yet", accent: "navy" }],
    destinationBreakdown: [{ label: "Institution follows", value: 0, note: "Primary draft target", accent: "navy" }],
  },
  {
    id: "bc_harvest_relief",
    title: "Harvest Relief Momentum",
    subtitle: "Push an ongoing charity campaign with donor urgency, updates, and proof-of-impact storytelling.",
    state: "At risk",
    mode: "Linked",
    objective: "Charity momentum",
    primaryOutcome: "Donations",
    sourceType: "Crowdfund",
    linkedName: "Harvest Relief Campaign",
    owner: "Care & Missions",
    placement: "Giving momentum card",
    accent: "green",
    heroImageUrl: HERO_CROWDFUND,
    startISO: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    endISO: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(),
    spend: 980,
    totalBudget: 2200,
    dailyCap: 160,
    reach: 64000,
    ctr: 2.7,
    watchStarts: 0,
    givingConversions: 63,
    eventRegistrations: 0,
    productClicks: 0,
    followAdds: 44,
    frequencyCap: 4,
    creativeHealth: 62,
    qaScore: 71,
    audienceHealth: 58,
    policyState: "Approved",
    approvalState: "Ready",
    launchBlockers: ["Creative fatigue is reducing donor conversion efficiency."],
    policyNotes: [
      "Proof-of-impact assets are approved, but the current hero needs a refresh.",
      "Campaign should shift more spend toward recent donor audiences.",
    ],
    bidStrategy: "Conversion first",
    pacingLogic: "Guarded",
    pacePct: 44,
    burnRateLabel: "Behind pace",
    forecastLabel: "Projected to miss donor target without creative refresh",
    budgetMoveLabel: "Refresh creative before increasing spend",
    segmentLeads: ["Recent donors", "Care ministry followers", "Families"],
    regionLeads: ["Kampala", "Gulu", "Mbale"],
    destinationObjects: ["Crowdfund page", "Live donation moment", "Replay CTA"],
    creativeVersions: makeCreativeVariants("green", "Harvest Relief", "Give now", false),
    optimizationRules: makeOptimizationRules("green"),
    auditTrail: makeAuditTrail("Care & Missions", "Linked"),
    spendSeries: [84, 88, 91, 79, 76, 73, 70, 68, 64, 62, 58, 54],
    conversionSeries: [10, 11, 12, 10, 9, 9, 8, 7, 7, 6, 5, 5],
    placementBreakdown: [
      { label: "Giving momentum card", value: 48, note: "Best donation quality", accent: "green" },
      { label: "Replay shelf spotlight", value: 9, note: "Some replay-to-giving carryover", accent: "navy" },
      { label: "Home feed spotlight", value: 6, note: "Reach without intent", accent: "orange" },
    ],
    segmentBreakdown: [
      { label: "Recent donors", value: 28, note: "Highest response rate", accent: "green" },
      { label: "Care ministry followers", value: 21, note: "Strong cause affinity", accent: "navy" },
      { label: "Families", value: 14, note: "Mixed quality", accent: "orange" },
    ],
    timeWindowBreakdown: [
      { label: "After live session", value: 31, note: "Best donor momentum", accent: "green" },
      { label: "Midday feed", value: 19, note: "Moderate quality", accent: "navy" },
      { label: "Late-night discovery", value: 13, note: "Weak conversion", accent: "orange" },
    ],
    destinationBreakdown: [
      { label: "Donations", value: 63, note: "Primary outcome", accent: "green" },
      { label: "Follower adds", value: 44, note: "Secondary growth", accent: "navy" },
      { label: "Live handoff", value: 18, note: "From live giving moments", accent: "orange" },
    ],
  },
  {
    id: "bc_midweek_live_push",
    title: "Midweek Teaching Live Push",
    subtitle: "Re-open attendance momentum for an upcoming midweek live session after production changes.",
    state: "Paused",
    mode: "Linked",
    objective: "Live attendance",
    primaryOutcome: "Watch starts",
    sourceType: "Live Session",
    linkedName: "Faith & Work Midweek Live",
    owner: "Production Team",
    placement: "Live countdown rail",
    accent: "orange",
    heroImageUrl: HERO_LIVE,
    startISO: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
    endISO: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    spend: 640,
    totalBudget: 1200,
    dailyCap: 110,
    reach: 22800,
    ctr: 3.1,
    watchStarts: 1480,
    givingConversions: 12,
    eventRegistrations: 0,
    productClicks: 0,
    followAdds: 38,
    frequencyCap: 3,
    creativeHealth: 73,
    qaScore: 78,
    audienceHealth: 69,
    policyState: "Approved",
    approvalState: "Ready",
    launchBlockers: ["Campaign paused pending updated session artwork."],
    policyNotes: [
      "Resume once the session cover and caption track are refreshed.",
      "Countdown rail is still reserved for the selected slot.",
    ],
    bidStrategy: "Balanced",
    pacingLogic: "Balanced",
    pacePct: 51,
    burnRateLabel: "Paused",
    forecastLabel: "Ready to resume after creative refresh",
    budgetMoveLabel: "No budget change recommended while paused",
    segmentLeads: ["Followers", "Midweek attendees", "Prayer groups"],
    regionLeads: ["Kampala", "Nairobi"],
    destinationObjects: ["Live waiting room", "Reminder CTA"],
    creativeVersions: makeCreativeVariants("orange", "Midweek Live", "Open session", false),
    optimizationRules: makeOptimizationRules("orange"),
    auditTrail: makeAuditTrail("Production Team", "Linked"),
    spendSeries: [52, 54, 58, 63, 61, 60, 58, 55, 51, 49, 0, 0],
    conversionSeries: [84, 92, 108, 121, 126, 132, 118, 112, 96, 88, 0, 0],
    placementBreakdown: [
      { label: "Live countdown rail", value: 980, note: "Primary attendance driver", accent: "orange" },
      { label: "Home feed spotlight", value: 320, note: "Awareness support", accent: "green" },
      { label: "Clip carousel", value: 180, note: "Retargeting", accent: "navy" },
    ],
    segmentBreakdown: [
      { label: "Followers", value: 620, note: "Strong reminder response", accent: "green" },
      { label: "Midweek attendees", value: 470, note: "Reliable attendance quality", accent: "orange" },
      { label: "Prayer groups", value: 390, note: "Best completion rate", accent: "navy" },
    ],
    timeWindowBreakdown: [
      { label: "T-24h", value: 52, note: "Best pre-live quality", accent: "green" },
      { label: "T-1h", value: 37, note: "Solid late attendance", accent: "orange" },
      { label: "Live now", value: 11, note: "Lower volume, high urgency", accent: "navy" },
    ],
    destinationBreakdown: [
      { label: "Live watch starts", value: 1480, note: "Primary outcome", accent: "orange" },
      { label: "Giving CTA", value: 12, note: "Minor secondary response", accent: "green" },
      { label: "Follows", value: 38, note: "Secondary growth", accent: "navy" },
    ],
  },
  {
    id: "bc_series_follow",
    title: "Faith & Work Series Awareness",
    subtitle: "Promote a structured teaching series to lift follows and series entry-point discovery.",
    state: "Completed",
    mode: "Linked",
    objective: "Follow growth",
    primaryOutcome: "Followers",
    sourceType: "Series",
    linkedName: "Faith & Work Series",
    owner: "Growth Team",
    placement: "Clip carousel",
    accent: "navy",
    heroImageUrl: HERO_SERIES,
    startISO: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
    endISO: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    spend: 1420,
    totalBudget: 1420,
    dailyCap: 180,
    reach: 71000,
    ctr: 4.2,
    watchStarts: 2120,
    givingConversions: 0,
    eventRegistrations: 0,
    productClicks: 0,
    followAdds: 640,
    frequencyCap: 4,
    creativeHealth: 90,
    qaScore: 95,
    audienceHealth: 88,
    policyState: "Approved",
    approvalState: "Ready",
    launchBlockers: [],
    policyNotes: [
      "Completed campaign delivered above follow-growth target.",
      "Strong candidate for duplication as an always-on awareness unit.",
    ],
    bidStrategy: "Reach first",
    pacingLogic: "Balanced",
    pacePct: 100,
    burnRateLabel: "Completed",
    forecastLabel: "Delivered 128% of follow target",
    budgetMoveLabel: "Duplicate into a fresh always-on campaign",
    segmentLeads: ["Series browsers", "Replay viewers", "Students"],
    regionLeads: ["Kampala", "Nairobi", "Lagos"],
    destinationObjects: ["Series detail", "Episode page", "Institution follow"],
    creativeVersions: makeCreativeVariants("navy", "Faith & Work", "Open series", false),
    optimizationRules: makeOptimizationRules("navy"),
    auditTrail: makeAuditTrail("Growth Team", "Linked"),
    spendSeries: [106, 118, 126, 131, 139, 142, 128, 120, 111, 104, 96, 99],
    conversionSeries: [34, 40, 44, 47, 52, 58, 63, 69, 74, 80, 85, 91],
    placementBreakdown: [
      { label: "Clip carousel", value: 420, note: "Best series discovery", accent: "navy" },
      { label: "Home feed spotlight", value: 136, note: "Helpful reach extension", accent: "green" },
      { label: "Replay shelf spotlight", value: 84, note: "Useful retargeting path", accent: "orange" },
    ],
    segmentBreakdown: [
      { label: "Series browsers", value: 280, note: "Highest follow quality", accent: "navy" },
      { label: "Replay viewers", value: 210, note: "Strong conversion support", accent: "green" },
      { label: "Students", value: 150, note: "Good discovery cohort", accent: "orange" },
    ],
    timeWindowBreakdown: [
      { label: "Sunday afternoon", value: 38, note: "Best follow quality", accent: "green" },
      { label: "Weekday evening", value: 33, note: "Strong discovery", accent: "navy" },
      { label: "Morning commute", value: 19, note: "Lower depth", accent: "orange" },
    ],
    destinationBreakdown: [
      { label: "Follower adds", value: 640, note: "Primary outcome", accent: "navy" },
      { label: "Series opens", value: 2120, note: "Discovery assist", accent: "green" },
      { label: "Episode starts", value: 480, note: "Secondary lift", accent: "orange" },
    ],
  },
];

function accentColor(accent: Accent) {
  if (accent === "green") return EV_GREEN;
  if (accent === "orange") return EV_ORANGE;
  return EV_NAVY;
}

function accentSoft(accent: Accent) {
  if (accent === "green") return "rgba(3,205,140,0.12)";
  if (accent === "orange") return "rgba(247,127,0,0.14)";
  return "rgba(11,29,73,0.12)";
}

function stateTone(state: CampaignState): "neutral" | "good" | "warn" | "danger" {
  if (state === "Active" || state === "Completed") return "good";
  if (state === "Learning" || state === "At risk" || state === "Paused") return "warn";
  if (state === "Rejected") return "danger";
  return "neutral";
}

function creativeTone(state: CreativeState): "neutral" | "good" | "warn" | "danger" {
  if (state === "Healthy") return "good";
  if (state === "Learning" || state === "Needs QA") return "warn";
  return "danger";
}

function policyTone(state: PolicyState): "neutral" | "good" | "warn" | "danger" {
  if (state === "Approved") return "good";
  if (state === "Needs review") return "warn";
  return "danger";
}

function approvalTone(state: ApprovalState): "neutral" | "good" | "warn" | "danger" {
  if (state === "Ready") return "good";
  if (state === "Awaiting approvals") return "warn";
  return "danger";
}

function spendBand(value: number): "Under £1k" | "£1k–£5k" | "£5k+" {
  if (value < 1000) return "Under £1k";
  if (value < 5000) return "£1k–£5k";
  return "£5k+";
}

function primaryOutcomeValue(campaign: BeaconCampaign) {
  if (campaign.primaryOutcome === "Watch starts") return campaign.watchStarts;
  if (campaign.primaryOutcome === "Donations") return campaign.givingConversions;
  if (campaign.primaryOutcome === "Registrations") return campaign.eventRegistrations;
  if (campaign.primaryOutcome === "Followers") return campaign.followAdds;
  return campaign.productClicks;
}

function cloneCampaign(source: BeaconCampaign): BeaconCampaign {
  const stamp = Date.now().toString(16).slice(-6);
  return {
    ...source,
    id: `${source.id}_copy_${stamp}`,
    title: `${source.title} Copy`,
    state: "Draft",
    spend: 0,
    reach: 0,
    ctr: 0,
    watchStarts: 0,
    givingConversions: 0,
    eventRegistrations: 0,
    productClicks: 0,
    followAdds: 0,
    pacePct: 0,
    burnRateLabel: "Draft",
    forecastLabel: "Awaiting launch",
    budgetMoveLabel: "Set budget and placements before launch",
    spendSeries: source.spendSeries.map(() => 0),
    conversionSeries: source.conversionSeries.map(() => 0),
    placementBreakdown: source.placementBreakdown.map((row) => ({ ...row, value: 0 })),
    segmentBreakdown: source.segmentBreakdown.map((row) => ({ ...row, value: 0 })),
    timeWindowBreakdown: source.timeWindowBreakdown.map((row) => ({ ...row, value: 0 })),
    destinationBreakdown: source.destinationBreakdown.map((row) => ({ ...row, value: 0 })),
    auditTrail: [
      {
        id: `copy_${stamp}`,
        actor: "Beacon Manager",
        action: "Duplicated campaign",
        note: `Created from ${source.title}.`,
        timeLabel: "Just now",
        accent: source.accent,
      },
      ...source.auditTrail,
    ],
  };
}

function Pill({
  text,
  tone = "neutral",
  icon,
}: {
  text: string;
  tone?: "neutral" | "good" | "warn" | "danger" | "pro";
  icon?: React.ReactNode;
}) {
  const toneCls =
    tone === "good"
      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
      : tone === "warn"
        ? "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300"
        : tone === "danger"
          ? "border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300"
          : tone === "pro"
            ? "border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20 text-violet-800 dark:text-violet-300"
            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300";
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
        toneCls,
      )}
    >
      {icon}
      {text}
    </span>
  );
}

function Btn({
  children,
  onClick,
  disabled,
  className,
  title,
  left,
  tone = "neutral",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  title?: string;
  left?: React.ReactNode;
  tone?: "primary" | "secondary" | "neutral" | "ghost" | "danger";
}) {
  const toneCls =
    tone === "primary"
      ? "text-white border-transparent"
      : tone === "secondary"
        ? "text-white border-transparent"
        : tone === "danger"
          ? "bg-rose-600 text-white border-transparent"
          : tone === "ghost"
            ? "bg-transparent border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800";

  const style =
    tone === "primary"
      ? { background: EV_ORANGE }
      : tone === "secondary"
        ? { background: EV_GREEN }
        : undefined;

  return (
    <button
      type="button"
      title={title}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2 text-[12px] font-semibold transition-colors active:scale-[0.99]",
        disabled ? "opacity-60 cursor-not-allowed" : "",
        toneCls,
        className,
      )}
      style={style}
    >
      {left}
      {children}
    </button>
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
        <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm transition">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-base font-bold text-slate-900 dark:text-slate-50 leading-tight">
            {title}
          </div>
          {subtitle ? (
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-normal">
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
  tone = "green",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: Accent;
}) {
  return <KpiTile label={label} value={value} hint={hint} tone={tone} size="compact" />;
}

function Card({
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
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </div>
          {subtitle ? (
            <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
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

function ProgressBar({
  value,
  accent = "green",
}: {
  value: number;
  accent?: Accent;
}) {
  return (
    <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          width: `${clamp(value, 0, 100)}%`,
          background: accentColor(accent),
        }}
      />
    </div>
  );
}

function MiniLine({
  values,
  tone = "green",
}: {
  values: number[];
  tone?: Accent;
}) {
  const safe = values.length ? values : [0, 0, 0, 0];
  const min = Math.min(...safe);
  const max = Math.max(...safe);
  const span = max - min || 1;
  const points = safe
    .map((v, i) => {
      const x = (i / Math.max(1, safe.length - 1)) * 100;
      const y = 36 - ((v - min) / span) * 30;
      return `${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
  const area = `${points} 100 40 0 40`;
  return (
    <svg viewBox="0 0 100 40" className="h-[72px] w-full">
      <polygon points={area} fill={accentSoft(tone)} />
      <polyline
        points={points}
        fill="none"
        stroke={accentColor(tone)}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cx(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        checked ? "bg-slate-900 dark:bg-white" : "bg-slate-300 dark:bg-slate-700",
      )}
    >
      <span
        className={cx(
          "inline-block h-4 w-4 rounded-full bg-white dark:bg-slate-900 shadow transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      value={value}
      type={type}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-[12px] text-slate-900 dark:text-slate-100 outline-none transition-colors focus:ring-2 focus:ring-[rgba(3,205,140,0.22)]"
    />
  );
}

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative mt-1">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 pr-9 text-[12px] font-semibold text-slate-900 dark:text-slate-100 outline-none transition-colors focus:ring-2 focus:ring-[rgba(3,205,140,0.22)]"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
    </div>
  );
}

function BreakdownList({ rows }: { rows: BreakdownRow[] }) {
  const max = Math.max(1, ...rows.map((row) => row.value));
  return (
    <div className="space-y-2">
      {rows.map((row) => {
        const width = max === 0 ? 0 : (row.value / max) * 100;
        return (
          <div
            key={row.label}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                  {row.label}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  {row.note}
                </div>
              </div>
              <div className="text-[12px] font-extrabold text-slate-900 dark:text-slate-100">
                {fmtInt(row.value)}
              </div>
            </div>
            <div className="mt-2">
              <ProgressBar value={width} accent={row.accent || "green"} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AuditItem({ event }: { event: AuditEvent }) {
  return (
    <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition-colors">
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-2xl"
        style={{ background: accentColor(event.accent) }}
      />
      <div className="pl-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
            {event.action}
          </div>
          <Pill text={event.timeLabel} />
        </div>
        <div className="mt-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
          {event.actor}
        </div>
        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          {event.note}
        </div>
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
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const bodyOverflow = document.body.style.overflow;
    const docOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = docOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-[1080px] border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shadow-2xl transition-colors">
        <div className="flex h-full flex-col">
          <div className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                  {title}
                </div>
                {subtitle ? (
                  <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {subtitle}
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="text-lg leading-none">×</span>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

function PreviewSurface({
  campaign,
  mode,
}: {
  campaign: BeaconCampaign;
  mode: PreviewMode;
}) {
  const accent = accentColor(campaign.accent);
  const isMobile = mode === "mobile";
  return (
    <div className={cx("rounded-3xl bg-slate-950 p-3 shadow-sm", isMobile ? "w-[204px] mx-auto" : "w-full")}>
      <div
        className={cx(
          "overflow-hidden rounded-[24px] bg-white dark:bg-slate-900 ring-1 ring-white/10",
          isMobile ? "h-[420px]" : "h-[282px]",
        )}
      >
        <div className="flex items-center justify-between bg-white/95 dark:bg-slate-900/95 px-3 py-2 shadow-sm">
          <div className="text-[11px] font-bold text-slate-900 dark:text-slate-100">
            {isMobile ? "FaithHub mobile" : "FaithHub desktop"}
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <div className="h-2.5 w-2.5 rounded-full" style={{ background: EV_GREEN }} />
            <div className="h-2.5 w-2.5 rounded-full" style={{ background: EV_ORANGE }} />
            <div className="h-2.5 w-2.5 rounded-full" style={{ background: EV_NAVY }} />
          </div>
        </div>

        <div className="p-3">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white">
            <img
              src={campaign.heroImageUrl}
              alt={campaign.title}
              className={cx("w-full object-cover", isMobile ? "h-[190px]" : "h-[150px]")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
              <span
                className="rounded-full px-2 py-1 text-[10px] font-bold text-white"
                style={{ background: accent }}
              >
                Beacon
              </span>
              <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold text-white">
                {campaign.mode}
              </span>
            </div>
            <div className="absolute left-3 bottom-3 right-3">
              <div className="line-clamp-2 text-lg font-extrabold">
                {campaign.title}
              </div>
              <div className="mt-1 line-clamp-2 text-[12px] text-white/85">
                {campaign.subtitle}
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-2">
              <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Outcome</div>
              <div className="mt-1 text-[13px] font-extrabold text-slate-900 dark:text-slate-100">
                {campaign.primaryOutcome}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-2">
              <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Placement</div>
              <div className="mt-1 text-[13px] font-extrabold text-slate-900 dark:text-slate-100">
                {campaign.placement}
              </div>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              className="inline-flex flex-1 items-center justify-center rounded-2xl px-3 py-2 text-[12px] font-extrabold text-white"
              style={{ background: EV_GREEN }}
              onClick={() => safeNav("/faithhub/provider/beacon-dashboard")}>
              Open preview
            </button>
            <button
              className="inline-flex flex-1 items-center justify-center rounded-2xl px-3 py-2 text-[12px] font-extrabold text-white"
              style={{ background: EV_ORANGE }}
              onClick={() => safeNav("/faithhub/provider/beacon-dashboard")}>
              Launch CTA
            </button>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2">
              <div className="text-slate-400 uppercase tracking-[0.14em]">Spend</div>
              <div className="mt-1 text-[12px] font-black text-slate-900 dark:text-slate-100">
                {fmtCurrency(campaign.spend)}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2">
              <div className="text-slate-400 uppercase tracking-[0.14em]">CTR</div>
              <div className="mt-1 text-[12px] font-black text-slate-900 dark:text-slate-100">
                {fmtPct(campaign.ctr)}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2">
              <div className="text-slate-400 uppercase tracking-[0.14em]">Health</div>
              <div className="mt-1 text-[12px] font-black text-slate-900 dark:text-slate-100">
                {fmtPct(campaign.creativeHealth, 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreativeVersionRow({
  version,
  accent,
  onSetPrimary,
  onDuplicate,
}: {
  version: CreativeVariant;
  accent: Accent;
  onSetPrimary: () => void;
  onDuplicate: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
              {version.name}
            </div>
            <Pill text={version.state} tone={creativeTone(version.state)} />
            {version.primary ? (
              <Pill text="Primary" tone="good" icon={<BadgeCheck className="h-3.5 w-3.5" />} />
            ) : null}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {version.language} · {version.format} · {version.subtitleMode}
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2">
              <div className="text-slate-500 dark:text-slate-400">Health</div>
              <div className="mt-0.5 font-extrabold text-slate-900 dark:text-slate-100">
                {fmtPct(version.health, 0)}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2">
              <div className="text-slate-500 dark:text-slate-400">CTR</div>
              <div className="mt-0.5 font-extrabold text-slate-900 dark:text-slate-100">
                {fmtPct(version.ctr)}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2">
              <div className="text-slate-500 dark:text-slate-400">Fatigue</div>
              <div className="mt-0.5 font-extrabold text-slate-900 dark:text-slate-100">
                {fmtPct(version.fatigue, 0)}
              </div>
            </div>
          </div>
        </div>

        <div
          className="h-14 w-14 shrink-0 rounded-2xl border border-slate-200 dark:border-slate-700"
          style={{
            background: `linear-gradient(135deg, ${accentSoft(accent)} 0%, ${accentColor(accent)} 160%)`,
          }}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Btn onClick={onSetPrimary} tone="neutral" left={<BadgeCheck className="h-4 w-4" />}>
          {version.primary ? "Primary version" : "Set primary"}
        </Btn>
        <Btn onClick={onDuplicate} tone="neutral" left={<Copy className="h-4 w-4" />}>
          Duplicate
        </Btn>
      </div>

      <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
        Last edited {version.lastEditedLabel}
      </div>
    </div>
  );
}

function CampaignRow({
  campaign,
  active,
  onSelect,
  onOpenDetails,
  onDuplicate,
  onPauseResume,
}: {
  campaign: BeaconCampaign;
  active: boolean;
  onSelect: () => void;
  onOpenDetails: () => void;
  onDuplicate: () => void;
  onPauseResume: () => void;
}) {
  const outcomeValue = primaryOutcomeValue(campaign);

  return (
    <div
      className={cx(
        "rounded-3xl border p-3 transition-colors",
        active
          ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20"
          : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-900",
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onSelect}
          className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl ring-1 ring-slate-200 dark:ring-slate-700"
          title="Select campaign"
        >
          <img src={campaign.heroImageUrl} alt={campaign.title} className="h-full w-full object-cover" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onSelect}
              className="truncate text-left text-[14px] font-bold text-slate-900 dark:text-slate-50"
            >
              {campaign.title}
            </button>
            <Pill text={campaign.state} tone={stateTone(campaign.state)} />
            <Pill text={campaign.mode} />
          </div>

          <div className="mt-1 line-clamp-2 text-[12px] text-slate-500 dark:text-slate-400">
            {campaign.subtitle}
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2">
              <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Source</div>
              <div className="mt-1 text-[12px] font-extrabold text-slate-900 dark:text-slate-100">
                {campaign.linkedName || campaign.sourceType}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2">
              <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Owner</div>
              <div className="mt-1 text-[12px] font-extrabold text-slate-900 dark:text-slate-100">
                {campaign.owner}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2">
              <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Spend</div>
              <div className="mt-1 text-[12px] font-extrabold text-slate-900 dark:text-slate-100">
                {fmtCurrency(campaign.spend)}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2">
              <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">{campaign.primaryOutcome}</div>
              <div className="mt-1 text-[12px] font-extrabold text-slate-900 dark:text-slate-100">
                {fmtInt(outcomeValue)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          <Btn tone="ghost" onClick={onOpenDetails} left={<Eye className="h-4 w-4" />}>
            Details
          </Btn>
          <Btn tone="ghost" onClick={onPauseResume} left={campaign.state === "Paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}>
            {campaign.state === "Paused" ? "Resume" : "Pause"}
          </Btn>
          <Btn tone="ghost" onClick={onDuplicate} left={<Copy className="h-4 w-4" />}>
            Duplicate
          </Btn>
        </div>
      </div>
    </div>
  );
}

function CampaignDetailDrawer({
  campaign,
  open,
  onClose,
}: {
  campaign: BeaconCampaign | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!campaign) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`${campaign.title} · Campaign detail drawer`}
      subtitle="Spend history, delivery state, audience breakdown, conversion paths, creative versions, approvals, and policy notes without leaving the list view."
    >
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <Card
            title="Campaign summary"
            subtitle={`${campaign.mode} · ${campaign.sourceType}${campaign.linkedName ? ` · ${campaign.linkedName}` : ""}`}
            right={<Pill text={campaign.state} tone={stateTone(campaign.state)} />}
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Spend" value={fmtCurrency(campaign.spend)} tone={campaign.accent} />
              <MetricCard label="Budget" value={fmtCurrency(campaign.totalBudget)} tone="orange" />
              <MetricCard label="Reach" value={fmtInt(campaign.reach)} tone="navy" />
              <MetricCard label="CTR" value={fmtPct(campaign.ctr)} tone="green" />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Spend history</div>
                <div className="mt-2">
                  <MiniLine values={campaign.spendSeries} tone={campaign.accent} />
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Conversion trend</div>
                <div className="mt-2">
                  <MiniLine values={campaign.conversionSeries} tone="orange" />
                </div>
              </div>
            </div>
          </Card>

          <Card title="Attribution + drill-down" subtitle="Performance by placement, segment, time window, and destination object.">
            <div className="grid gap-3 lg:grid-cols-2">
              <BreakdownList rows={campaign.placementBreakdown} />
              <BreakdownList rows={campaign.segmentBreakdown} />
            </div>
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              <BreakdownList rows={campaign.timeWindowBreakdown} />
              <BreakdownList rows={campaign.destinationBreakdown} />
            </div>
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-5">
          <Card title="Creative versions" subtitle="Alternate visuals, CTA variants, subtitles, and language versions.">
            <div className="space-y-3">
              {campaign.creativeVersions.map((version) => (
                <div
                  key={version.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                        {version.name}
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        {version.language} · {version.format}
                      </div>
                    </div>
                    <Pill text={version.state} tone={creativeTone(version.state)} />
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2">
                      <div className="text-slate-500 dark:text-slate-400">Health</div>
                      <div className="mt-0.5 font-extrabold text-slate-900 dark:text-slate-100">{fmtPct(version.health, 0)}</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2">
                      <div className="text-slate-500 dark:text-slate-400">CTR</div>
                      <div className="mt-0.5 font-extrabold text-slate-900 dark:text-slate-100">{fmtPct(version.ctr)}</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2">
                      <div className="text-slate-500 dark:text-slate-400">Fatigue</div>
                      <div className="mt-0.5 font-extrabold text-slate-900 dark:text-slate-100">{fmtPct(version.fatigue, 0)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Approvals + policy notes" subtitle="Internal approvals, policy review, blockers, and asset-health context.">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Pill text={campaign.approvalState} tone={approvalTone(campaign.approvalState)} icon={<CheckCircle2 className="h-3.5 w-3.5" />} />
                <Pill text={campaign.policyState} tone={policyTone(campaign.policyState)} icon={<ShieldCheck className="h-3.5 w-3.5" />} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <MetricCard label="QA score" value={`${Math.round(campaign.qaScore)}%`} tone="green" />
                <MetricCard label="Audience health" value={`${Math.round(campaign.audienceHealth)}%`} tone="navy" />
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Launch blockers</div>
                <div className="mt-2 space-y-2">
                  {campaign.launchBlockers.length ? (
                    campaign.launchBlockers.map((blocker) => (
                      <div
                        key={blocker}
                        className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-[12px] text-amber-900 dark:text-amber-300"
                      >
                        {blocker}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 text-[12px] text-emerald-800 dark:text-emerald-300">
                      No blockers. This campaign is clear for portfolio actions.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Policy notes</div>
                <div className="mt-2 space-y-2">
                  {campaign.policyNotes.map((note) => (
                    <div key={note} className="text-[12px] text-slate-700 dark:text-slate-300">
                      • {note}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Audit + collaboration history" subtitle="Who changed budget, updated creatives, approved launch, or responded to policy issues.">
            <div className="space-y-3">
              {campaign.auditTrail.map((event) => (
                <AuditItem key={event.id} event={event} />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Drawer>
  );
}

export default function BeaconManagerPage() {
  const [campaigns, setCampaigns] = useState<BeaconCampaign[]>(CAMPAIGNS_SEED);
  const [selectedId, setSelectedId] = useState<string>(CAMPAIGNS_SEED[0]?.id || "");
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [toast, setToast] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<CampaignState | "All">("All");
  const [objectiveFilter, setObjectiveFilter] = useState<ObjectiveType | "All">("All");
  const [sourceFilter, setSourceFilter] = useState<SourceType | "All">("All");
  const [modeFilter, setModeFilter] = useState<CampaignMode | "All">("All");
  const [ownerFilter, setOwnerFilter] = useState<string>("All");
  const [placementFilter, setPlacementFilter] = useState<PlacementType | "All">("All");
  const [spendFilter, setSpendFilter] = useState<"All" | "Under £1k" | "£1k–£5k" | "£5k+">("All");
  const [outcomeFilter, setOutcomeFilter] = useState<OutcomeType | "All">("All");

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(t);
  }, [toast]);

  const owners = useMemo(
    () => ["All", ...Array.from(new Set(campaigns.map((campaign) => campaign.owner)))],
    [campaigns],
  );

  const placements = useMemo(
    () => ["All", ...Array.from(new Set(campaigns.map((campaign) => campaign.placement)))],
    [campaigns],
  );

  const filteredCampaigns = useMemo(() => {
    const q = query.trim().toLowerCase();
    return campaigns.filter((campaign) => {
      if (stateFilter !== "All" && campaign.state !== stateFilter) return false;
      if (objectiveFilter !== "All" && campaign.objective !== objectiveFilter) return false;
      if (sourceFilter !== "All" && campaign.sourceType !== sourceFilter) return false;
      if (modeFilter !== "All" && campaign.mode !== modeFilter) return false;
      if (ownerFilter !== "All" && campaign.owner !== ownerFilter) return false;
      if (placementFilter !== "All" && campaign.placement !== placementFilter) return false;
      if (spendFilter !== "All" && spendBand(campaign.spend) !== spendFilter) return false;
      if (outcomeFilter !== "All" && campaign.primaryOutcome !== outcomeFilter) return false;
      if (!q) return true;
      return (
        campaign.title.toLowerCase().includes(q) ||
        campaign.subtitle.toLowerCase().includes(q) ||
        campaign.owner.toLowerCase().includes(q) ||
        campaign.objective.toLowerCase().includes(q) ||
        campaign.sourceType.toLowerCase().includes(q) ||
        (campaign.linkedName || "").toLowerCase().includes(q)
      );
    });
  }, [
    campaigns,
    objectiveFilter,
    outcomeFilter,
    ownerFilter,
    placementFilter,
    query,
    sourceFilter,
    spendFilter,
    stateFilter,
    modeFilter,
  ]);

  useEffect(() => {
    if (!filteredCampaigns.some((campaign) => campaign.id === selectedId)) {
      setSelectedId(filteredCampaigns[0]?.id || campaigns[0]?.id || "");
    }
  }, [filteredCampaigns, campaigns, selectedId]);

  const selectedCampaign = useMemo(
    () => campaigns.find((campaign) => campaign.id === selectedId) || campaigns[0] || null,
    [campaigns, selectedId],
  );

  const stateCounts = useMemo(() => {
    const order: CampaignState[] = [
      "Draft",
      "Active",
      "Learning",
      "At risk",
      "Completed",
      "Paused",
      "Rejected",
      "Archived",
    ];
    return order.map((state) => ({
      state,
      count: campaigns.filter((campaign) => campaign.state === state).length,
    }));
  }, [campaigns]);

  const portfolio = useMemo(() => {
    const spend = campaigns.reduce((sum, campaign) => sum + campaign.spend, 0);
    const reach = campaigns.reduce((sum, campaign) => sum + campaign.reach, 0);
    const activeCount = campaigns.filter((campaign) => campaign.state === "Active").length;
    const learningOrRisk = campaigns.filter((campaign) => campaign.state === "Learning" || campaign.state === "At risk").length;
    const approvalBacklog = campaigns.filter((campaign) => campaign.approvalState !== "Ready").length;
    const avgCreativeHealth =
      campaigns.reduce((sum, campaign) => sum + campaign.creativeHealth, 0) /
      Math.max(1, campaigns.length);
    const linkedCount = campaigns.filter((campaign) => campaign.mode === "Linked").length;
    const standaloneCount = campaigns.filter((campaign) => campaign.mode === "Standalone").length;
    return {
      spend,
      reach,
      activeCount,
      learningOrRisk,
      approvalBacklog,
      avgCreativeHealth,
      linkedCount,
      standaloneCount,
    };
  }, [campaigns]);

  const qualityRows = useMemo(
    () =>
      campaigns
        .slice()
        .sort((a, b) => a.creativeHealth - b.creativeHealth || a.qaScore - b.qaScore)
        .slice(0, 4),
    [campaigns],
  );

  function updateCampaign(campaignId: string, updater: (campaign: BeaconCampaign) => BeaconCampaign) {
    setCampaigns((prev) =>
      prev.map((campaign) => (campaign.id === campaignId ? updater(campaign) : campaign)),
    );
  }

  function pauseResumeCampaign(campaignId: string) {
    updateCampaign(campaignId, (campaign) => {
      const nextState: CampaignState =
        campaign.state === "Paused"
          ? campaign.approvalState === "Ready"
            ? "Active"
            : "Learning"
          : "Paused";

      return {
        ...campaign,
        state: nextState,
        burnRateLabel: nextState === "Paused" ? "Paused" : "Resumed",
        auditTrail: [
          {
            id: `audit_${Date.now()}`,
            actor: "Beacon Manager",
            action: nextState === "Paused" ? "Paused campaign" : "Resumed campaign",
            note: nextState === "Paused" ? "Campaign paused from the manager." : "Campaign resumed after review.",
            timeLabel: "Just now",
            accent: campaign.accent,
          },
          ...campaign.auditTrail,
        ],
      };
    });
  }

  function duplicateCampaignById(campaignId: string) {
    const source = campaigns.find((campaign) => campaign.id === campaignId);
    if (!source) return;
    const copy = cloneCampaign(source);
    setCampaigns((prev) => [copy, ...prev]);
    setSelectedId(copy.id);
    setToast(`Duplicated ${source.title} into a new draft.`);
  }

  function updateSelectedBudget(field: "dailyCap" | "totalBudget", value: number) {
    if (!selectedCampaign) return;
    updateCampaign(selectedCampaign.id, (campaign) => {
      const nextValue =
        field === "dailyCap"
          ? clamp(Math.round(value), 25, Math.max(25, campaign.totalBudget))
          : clamp(Math.round(value), 200, 20000);

      const next: BeaconCampaign = {
        ...campaign,
        [field]: nextValue,
      } as BeaconCampaign;

      const pacePct = clamp((next.spend / Math.max(1, next.totalBudget)) * 100, 0, 100);

      return {
        ...next,
        pacePct,
        budgetMoveLabel:
          next.spend < next.totalBudget * 0.55
            ? "Budget has room to scale the strongest segments"
            : "Budget is close to the planned pace",
        auditTrail: [
          {
            id: `audit_${Date.now()}_${field}`,
            actor: "Beacon Manager",
            action: field === "dailyCap" ? "Adjusted daily cap" : "Adjusted total budget",
            note: `${field === "dailyCap" ? "Daily cap" : "Total budget"} updated to ${fmtCurrency(nextValue)}.`,
            timeLabel: "Just now",
            accent: campaign.accent,
          },
          ...campaign.auditTrail,
        ],
      };
    });
  }

  function updateSelectedField(field: "bidStrategy" | "pacingLogic" | "frequencyCap" | "startISO" | "endISO", value: string | number) {
    if (!selectedCampaign) return;
    updateCampaign(selectedCampaign.id, (campaign) => ({
      ...campaign,
      [field]: value,
    } as BeaconCampaign));
  }

  function toggleOptimizationRule(ruleId: string) {
    if (!selectedCampaign) return;
    updateCampaign(selectedCampaign.id, (campaign) => ({
      ...campaign,
      optimizationRules: campaign.optimizationRules.map((rule) =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule,
      ),
      auditTrail: [
        {
          id: `audit_${Date.now()}_rule`,
          actor: "Beacon Manager",
          action: "Updated optimization rule",
          note: `Toggled ${ruleId.replace("rule_", "").replace("_", " ")}.`,
          timeLabel: "Just now",
          accent: campaign.accent,
        },
        ...campaign.auditTrail,
      ],
    }));
    setToast("Optimization rule updated.");
  }

  function setPrimaryCreative(variantId: string) {
    if (!selectedCampaign) return;
    updateCampaign(selectedCampaign.id, (campaign) => ({
      ...campaign,
      creativeVersions: campaign.creativeVersions.map((version) => ({
        ...version,
        primary: version.id === variantId,
      })),
      auditTrail: [
        {
          id: `audit_${Date.now()}_primary`,
          actor: "Creative lead",
          action: "Changed primary creative version",
          note: "Updated the primary variant used for delivery.",
          timeLabel: "Just now",
          accent: campaign.accent,
        },
        ...campaign.auditTrail,
      ],
    }));
    setToast("Primary creative updated.");
  }

  function duplicateCreativeVariant(variantId: string) {
    if (!selectedCampaign) return;
    updateCampaign(selectedCampaign.id, (campaign) => {
      const source = campaign.creativeVersions.find((variant) => variant.id === variantId);
      if (!source) return campaign;
      const copy: CreativeVariant = {
        ...source,
        id: `${source.id}_copy_${Date.now().toString(16).slice(-4)}`,
        name: `${source.name} Copy`,
        primary: false,
        state: "Needs QA",
        lastEditedLabel: "Just now",
      };
      return {
        ...campaign,
        creativeVersions: [copy, ...campaign.creativeVersions],
        auditTrail: [
          {
            id: `audit_${Date.now()}_dupcreative`,
            actor: "Creative lead",
            action: "Duplicated creative variant",
            note: `Created ${copy.name} from ${source.name}.`,
            timeLabel: "Just now",
            accent: campaign.accent,
          },
          ...campaign.auditTrail,
        ],
      };
    });
    setToast("Creative variant duplicated.");
  }

  async function copyCampaignSummary() {
    if (!selectedCampaign) return;
    try {
      await navigator.clipboard.writeText(
        `${selectedCampaign.title}
${selectedCampaign.subtitle}
State: ${selectedCampaign.state}
Mode: ${selectedCampaign.mode}
Source: ${selectedCampaign.sourceType}
Spend: ${fmtCurrency(selectedCampaign.spend)} / ${fmtCurrency(selectedCampaign.totalBudget)}
Outcome: ${selectedCampaign.primaryOutcome}`,
      );
      setToast("Campaign summary copied.");
    } catch {
      setToast("Copy not available in this environment.");
    }
  }

  const approvalChecklist = useMemo(() => {
    if (!selectedCampaign) return [];
    return [
      {
        label: "Internal approvals",
        state: selectedCampaign.approvalState === "Ready" ? "good" : selectedCampaign.approvalState === "Awaiting approvals" ? "warn" : "danger",
      },
      {
        label: "Policy review",
        state: selectedCampaign.policyState === "Approved" ? "good" : selectedCampaign.policyState === "Needs review" ? "warn" : "danger",
      },
      {
        label: "Creative asset health",
        state: selectedCampaign.creativeHealth >= 80 ? "good" : selectedCampaign.creativeHealth >= 65 ? "warn" : "danger",
      },
      {
        label: "Launch blockers",
        state: selectedCampaign.launchBlockers.length === 0 ? "good" : "warn",
      },
    ] as Array<{ label: string; state: "good" | "warn" | "danger" }>;
  }, [selectedCampaign]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f2f2f2] dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors overflow-x-hidden">
      <div className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
        <div className="w-full px-4 md:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                <span>FaithHub Provider</span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span>Beacon</span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">Manager</span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
                  Beacon Manager
                </div>
                <Pill
                  text="Premium campaign operations"
                  tone="pro"
                  icon={<Sparkles className="h-3.5 w-3.5" />}
                />
              </div>

              <div className="mt-2 max-w-4xl text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Manage every Beacon campaign after creation, including budget controls, approvals,
                creative versions, performance drill-downs, rule-based optimization, and campaign life-cycle decisions.
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Btn tone="neutral" onClick={() => safeNav(ROUTES.beaconDashboard)} left={<BarChart3 className="h-4 w-4" />}>
                Beacon Dashboard
              </Btn>
              <Btn tone="neutral" onClick={() => safeNav(ROUTES.beaconMarketplace)} left={<Layers className="h-4 w-4" />}>
                Beacon Marketplace
              </Btn>
              <Btn
                tone="secondary"
                onClick={() => selectedCampaign && pauseResumeCampaign(selectedCampaign.id)}
                left={selectedCampaign?.state === "Paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              >
                {selectedCampaign?.state === "Paused" ? "Resume campaign" : "Pause campaign"}
              </Btn>
              <Btn
                tone="neutral"
                onClick={() => selectedCampaign && duplicateCampaignById(selectedCampaign.id)}
                left={<Copy className="h-4 w-4" />}
              >
                Duplicate campaign
              </Btn>
              <Btn tone="primary" onClick={() => safeNav(ROUTES.beaconBuilder)} left={<Plus className="h-4 w-4" />}>
                + New Ad
              </Btn>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <SectionTitle
                icon={<TrendingUp className="h-5 w-5" />}
                title="Campaign portfolio hero"
                subtitle="Portfolio-level management that works for both a single ministry and a large multi-campaign organization, with clear handling of linked and standalone campaigns in the same manager."
                right={<Pill text={`${campaigns.length} total campaigns`} tone="good" />}
              />

              <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
                <MetricCard label="Portfolio spend" value={fmtCurrency(portfolio.spend)} hint="Across all Beacon campaigns" tone="green" />
                <MetricCard label="Reach" value={fmtInt(portfolio.reach)} hint={`${portfolio.activeCount} active campaigns`} tone="orange" />
                <MetricCard label="Creative health" value={`${Math.round(portfolio.avgCreativeHealth)}%`} hint={`${portfolio.learningOrRisk} learning or at-risk`} tone="navy" />
                <MetricCard label="Approval backlog" value={fmtInt(portfolio.approvalBacklog)} hint={`${portfolio.linkedCount} linked · ${portfolio.standaloneCount} standalone`} tone="green" />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Campaign state distribution</div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">See which campaigns are active, learning, blocked, paused, completed, or archived.</div>
                    </div>
                    <Btn tone="ghost" onClick={() => setStateFilter("All")}>Clear filter</Btn>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                    {stateCounts.map((item) => (
                      <button
                        key={item.state}
                        type="button"
                        onClick={() => setStateFilter(item.state)}
                        className={cx(
                          "rounded-3xl border p-3 text-left transition-colors",
                          stateFilter === item.state
                            ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
                        )}
                      >
                        <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                          {item.state}
                        </div>
                        <div className="mt-1 text-[28px] font-black text-slate-900 dark:text-slate-100">
                          {item.count}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Creative health panel</div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Creative quality warnings, fatigue risk, and campaigns most likely to need refresh or QA attention.</div>

                  <div className="mt-4 space-y-3">
                    {qualityRows.map((campaign) => (
                      <div
                        key={campaign.id}
                        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                              {campaign.title}
                            </div>
                            <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                              {campaign.mode} · {campaign.sourceType}
                            </div>
                          </div>
                          <Pill text={`${campaign.creativeHealth}%`} tone={campaign.creativeHealth >= 80 ? "good" : campaign.creativeHealth >= 65 ? "warn" : "danger"} />
                        </div>

                        <div className="mt-2">
                          <ProgressBar value={campaign.creativeHealth} accent={campaign.accent} />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                          <span>QA {campaign.qaScore}%</span>
                          <span>Audience health {campaign.audienceHealth}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <SectionTitle
                icon={<Layers className="h-5 w-5" />}
                title="Campaign portfolio board"
                subtitle="Lists all campaigns with filters for status, objective, source object, standalone status, owner, placement, spend range, and outcome type."
                right={
                  <div className="flex items-center gap-2">
                    <Btn tone="ghost" onClick={() => setToast("Saved as a production-friendly view.")}>
                      Save view
                    </Btn>
                    <Btn tone="neutral" onClick={() => setToast("Portfolio board refreshed.")} left={<RefreshCw className="h-4 w-4" />}>
                      Refresh
                    </Btn>
                  </div>
                }
              />

              <div className="mt-4 grid gap-3 xl:grid-cols-[1.3fr_1fr_1fr]">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 transition-colors">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search campaigns, sources, owners, or linked objects"
                    className="w-full bg-transparent outline-none text-[12px] text-slate-900 dark:text-slate-100 placeholder:text-slate-500"
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-[12px] font-extrabold flex items-center gap-2 transition-colors">
                  <Filter className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                  <span className="text-slate-700 dark:text-slate-300">Portfolio filters</span>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-[12px] font-extrabold flex items-center gap-2 transition-colors">
                  <SlidersHorizontal className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                  <span className="text-slate-700 dark:text-slate-300">Rule-based stewardship</span>
                </div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <Label>Status</Label>
                  <SelectField
                    value={stateFilter}
                    onChange={(v) => setStateFilter(v as CampaignState | "All")}
                    options={["All", "Draft", "Active", "Learning", "At risk", "Completed", "Paused", "Rejected", "Archived"]}
                  />
                </div>
                <div>
                  <Label>Objective</Label>
                  <SelectField
                    value={objectiveFilter}
                    onChange={(v) => setObjectiveFilter(v as ObjectiveType | "All")}
                    options={["All", "Awareness", "Live attendance", "Replay growth", "Giving conversion", "Charity momentum", "Event registration", "Follow growth"]}
                  />
                </div>
                <div>
                  <Label>Source object</Label>
                  <SelectField
                    value={sourceFilter}
                    onChange={(v) => setSourceFilter(v as SourceType | "All")}
                    options={["All", "Live Session", "Replay", "Clip", "Event", "Fund", "Crowdfund", "Series", "Institution", "Standalone Announcement"]}
                  />
                </div>
                <div>
                  <Label>Standalone status</Label>
                  <SelectField
                    value={modeFilter}
                    onChange={(v) => setModeFilter(v as CampaignMode | "All")}
                    options={["All", "Linked", "Standalone"]}
                  />
                </div>
                <div>
                  <Label>Owner</Label>
                  <SelectField value={ownerFilter} onChange={setOwnerFilter} options={owners} />
                </div>
                <div>
                  <Label>Placement</Label>
                  <SelectField value={placementFilter} onChange={(v) => setPlacementFilter(v as PlacementType | "All")} options={placements} />
                </div>
                <div>
                  <Label>Spend range</Label>
                  <SelectField value={spendFilter} onChange={(v) => setSpendFilter(v as "All" | "Under £1k" | "£1k–£5k" | "£5k+")} options={["All", "Under £1k", "£1k–£5k", "£5k+"]} />
                </div>
                <div>
                  <Label>Outcome type</Label>
                  <SelectField
                    value={outcomeFilter}
                    onChange={(v) => setOutcomeFilter(v as OutcomeType | "All")}
                    options={["All", "Watch starts", "Donations", "Registrations", "Followers", "Product clicks"]}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {filteredCampaigns.map((campaign) => (
                  <CampaignRow
                    key={campaign.id}
                    campaign={campaign}
                    active={campaign.id === selectedCampaign?.id}
                    onSelect={() => setSelectedId(campaign.id)}
                    onOpenDetails={() => {
                      setSelectedId(campaign.id);
                      setDetailDrawerOpen(true);
                    }}
                    onDuplicate={() => duplicateCampaignById(campaign.id)}
                    onPauseResume={() => pauseResumeCampaign(campaign.id)}
                  />
                ))}

                {!filteredCampaigns.length ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-8 text-center">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-50">No campaigns match these filters</div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Clear the filters or launch a new Beacon campaign.
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {selectedCampaign ? (
              <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
                <SectionTitle
                  icon={<BarChart3 className="h-5 w-5" />}
                  title="Attribution and drill-down panel"
                  subtitle="Shows how the selected campaign performs by placement, segment, time window, and destination object, including live, replay, giving, or event results."
                  right={<Pill text={selectedCampaign.primaryOutcome} tone="good" />}
                />

                <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-5">
                  <MetricCard label="Watch starts" value={fmtInt(selectedCampaign.watchStarts)} tone="green" />
                  <MetricCard label="Donations" value={fmtInt(selectedCampaign.givingConversions)} tone="orange" />
                  <MetricCard label="Registrations" value={fmtInt(selectedCampaign.eventRegistrations)} tone="navy" />
                  <MetricCard label="Follows" value={fmtInt(selectedCampaign.followAdds)} tone="green" />
                  <MetricCard label="Product clicks" value={fmtInt(selectedCampaign.productClicks)} tone="orange" />
                </div>

                <div className="mt-4 grid gap-4 xl:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Delivery + conversion trends</div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Use placement and time-window patterns to optimize without losing stewardship context.</div>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                        <div className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">Spend trend</div>
                        <div className="mt-2"><MiniLine values={selectedCampaign.spendSeries} tone={selectedCampaign.accent} /></div>
                      </div>
                      <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                        <div className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">Conversion trend</div>
                        <div className="mt-2"><MiniLine values={selectedCampaign.conversionSeries} tone="orange" /></div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Audience + placement intelligence</div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">See which placements, segments, and destinations are carrying the campaign.</div>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                        <div className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">Top segment</div>
                        <div className="mt-2 text-sm font-black text-slate-900 dark:text-slate-100">
                          {selectedCampaign.segmentLeads[0] || "—"}
                        </div>
                      </div>
                      <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                        <div className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">Top region</div>
                        <div className="mt-2 text-sm font-black text-slate-900 dark:text-slate-100">
                          {selectedCampaign.regionLeads[0] || "—"}
                        </div>
                      </div>
                      <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                        <div className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">Primary destination</div>
                        <div className="mt-2 text-sm font-black text-slate-900 dark:text-slate-100">
                          {selectedCampaign.destinationObjects[0] || "—"}
                        </div>
                      </div>
                      <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                        <div className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">Placement</div>
                        <div className="mt-2 text-sm font-black text-slate-900 dark:text-slate-100">
                          {selectedCampaign.placement}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 xl:grid-cols-2">
                  <BreakdownList rows={selectedCampaign.placementBreakdown} />
                  <BreakdownList rows={selectedCampaign.segmentBreakdown} />
                </div>
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-4 space-y-4">
            {selectedCampaign ? (
              <>
                <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
                  <SectionTitle
                    icon={<Eye className="h-5 w-5" />}
                    title="Selected campaign preview"
                    subtitle="Preview, pause/resume, duplicate, and jump into deeper campaign review without losing manager context."
                    right={
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewMode("desktop")}
                          className={cx(
                            "rounded-full px-3 py-1.5 text-[11px] font-semibold border transition-colors",
                            previewMode === "desktop"
                              ? "border-transparent text-white"
                              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300",
                          )}
                          style={previewMode === "desktop" ? { background: EV_GREEN } : undefined}
                        >
                          <Monitor className="mr-1 inline h-3.5 w-3.5" /> Desktop
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewMode("mobile")}
                          className={cx(
                            "rounded-full px-3 py-1.5 text-[11px] font-semibold border transition-colors",
                            previewMode === "mobile"
                              ? "border-transparent text-white"
                              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300",
                          )}
                          style={previewMode === "mobile" ? { background: EV_ORANGE } : undefined}
                        >
                          <Smartphone className="mr-1 inline h-3.5 w-3.5" /> Mobile
                        </button>
                      </div>
                    }
                  />

                  <div className="mt-4">
                    <PreviewSurface campaign={selectedCampaign} mode={previewMode} />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Btn tone="secondary" onClick={() => setDetailDrawerOpen(true)} left={<Eye className="h-4 w-4" />}>
                      Open detail drawer
                    </Btn>
                    <Btn tone="neutral" onClick={copyCampaignSummary} left={<Copy className="h-4 w-4" />}>
                      Copy summary
                    </Btn>
                    <Btn tone="neutral" onClick={() => pauseResumeCampaign(selectedCampaign.id)} left={selectedCampaign.state === "Paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}>
                      {selectedCampaign.state === "Paused" ? "Resume" : "Pause"}
                    </Btn>
                    <Btn tone="primary" onClick={() => duplicateCampaignById(selectedCampaign.id)} left={<Copy className="h-4 w-4" />}>
                      Duplicate
                    </Btn>
                  </div>
                </div>

                <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
                  <SectionTitle
                    icon={<Wallet className="h-5 w-5" />}
                    title="Budget and pacing controls"
                    subtitle="Adjust daily caps, total budget, schedule windows, bid strategy, pacing logic, and stewardship rules."
                  />

                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Current pace</div>
                        <Pill text={`${Math.round(selectedCampaign.pacePct)}%`} tone={selectedCampaign.pacePct > 75 ? "warn" : "good"} />
                      </div>
                      <div className="mt-3">
                        <ProgressBar value={selectedCampaign.pacePct} accent={selectedCampaign.accent} />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{selectedCampaign.burnRateLabel}</span>
                        <span>{selectedCampaign.forecastLabel}</span>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label>Daily cap</Label>
                        <TextInput
                          type="number"
                          value={String(selectedCampaign.dailyCap)}
                          onChange={(v) => updateSelectedBudget("dailyCap", Number(v || 0))}
                        />
                      </div>
                      <div>
                        <Label>Total budget</Label>
                        <TextInput
                          type="number"
                          value={String(selectedCampaign.totalBudget)}
                          onChange={(v) => updateSelectedBudget("totalBudget", Number(v || 0))}
                        />
                      </div>
                      <div>
                        <Label>Start window</Label>
                        <TextInput
                          type="datetime-local"
                          value={toLocalInputValue(selectedCampaign.startISO)}
                          onChange={(v) => updateSelectedField("startISO", fromLocalInputValue(v, selectedCampaign.startISO))}
                        />
                      </div>
                      <div>
                        <Label>End window</Label>
                        <TextInput
                          type="datetime-local"
                          value={toLocalInputValue(selectedCampaign.endISO)}
                          onChange={(v) => updateSelectedField("endISO", fromLocalInputValue(v, selectedCampaign.endISO))}
                        />
                      </div>
                      <div>
                        <Label>Bid strategy</Label>
                        <SelectField
                          value={selectedCampaign.bidStrategy}
                          onChange={(v) => updateSelectedField("bidStrategy", v as BidStrategy)}
                          options={["Balanced", "Reach first", "Conversion first"]}
                        />
                      </div>
                      <div>
                        <Label>Pacing logic</Label>
                        <SelectField
                          value={selectedCampaign.pacingLogic}
                          onChange={(v) => updateSelectedField("pacingLogic", v as PacingLogic)}
                          options={["Balanced", "Accelerated", "Guarded"]}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        <span>Frequency cap</span>
                        <span>{selectedCampaign.frequencyCap}</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={8}
                        step={1}
                        value={selectedCampaign.frequencyCap}
                        onChange={(e) => updateSelectedField("frequencyCap", Number(e.target.value))}
                        className="mt-2 w-full"
                      />
                    </div>

                    <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 text-[12px] text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">Rule-based budget move:</span>{" "}
                      {selectedCampaign.budgetMoveLabel}
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
                  <SectionTitle
                    icon={<Wand2 className="h-5 w-5" />}
                    title="Creative version manager"
                    subtitle="Alternate visuals, copy variants, CTA variants, subtitles, and language versions organized under one campaign."
                  />

                  <div className="mt-4 space-y-3">
                    {selectedCampaign.creativeVersions.map((version) => (
                      <CreativeVersionRow
                        key={version.id}
                        version={version}
                        accent={selectedCampaign.accent}
                        onSetPrimary={() => setPrimaryCreative(version.id)}
                        onDuplicate={() => duplicateCreativeVariant(version.id)}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
                  <SectionTitle
                    icon={<ShieldCheck className="h-5 w-5" />}
                    title="Approval and QA lane"
                    subtitle="Internal approvals, policy review, creative rejection reasons, asset health, and campaign launch blockers."
                  />

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Pill text={selectedCampaign.approvalState} tone={approvalTone(selectedCampaign.approvalState)} icon={<CheckCircle2 className="h-3.5 w-3.5" />} />
                    <Pill text={selectedCampaign.policyState} tone={policyTone(selectedCampaign.policyState)} icon={<ShieldCheck className="h-3.5 w-3.5" />} />
                    <Pill text={`${selectedCampaign.qaScore}% QA`} tone={selectedCampaign.qaScore >= 80 ? "good" : selectedCampaign.qaScore >= 65 ? "warn" : "danger"} />
                  </div>

                  <div className="mt-4 space-y-3">
                    {approvalChecklist.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2"
                      >
                        <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">{item.label}</div>
                        <Pill text={item.state === "good" ? "Ready" : item.state === "warn" ? "Review" : "Blocked"} tone={item.state} />
                      </div>
                    ))}

                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Launch blockers</div>
                      <div className="mt-2 space-y-2">
                        {selectedCampaign.launchBlockers.length ? (
                          selectedCampaign.launchBlockers.map((blocker) => (
                            <div
                              key={blocker}
                              className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-[12px] text-amber-900 dark:text-amber-300"
                            >
                              {blocker}
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 text-[12px] text-emerald-800 dark:text-emerald-300">
                            No current blockers. This campaign is clear for management actions.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
                  <SectionTitle
                    icon={<Zap className="h-5 w-5" />}
                    title="Optimization rules"
                    subtitle="Auto-pause, audience exclusion, creative rotation, frequency control, and threshold-based scaling for strong performers."
                  />

                  <div className="mt-4 space-y-3">
                    {selectedCampaign.optimizationRules.map((rule) => (
                      <div
                        key={rule.id}
                        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                                {rule.label}
                              </div>
                              <Pill text={rule.threshold} tone="neutral" />
                            </div>
                            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                              {rule.description}
                            </div>
                          </div>
                          <Toggle checked={rule.enabled} onChange={() => toggleOptimizationRule(rule.id)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
                  <SectionTitle
                    icon={<Clock3 className="h-5 w-5" />}
                    title="Audit and collaboration history"
                    subtitle="Full visibility into campaign change history and operational ownership."
                  />

                  <div className="mt-4 space-y-3">
                    {selectedCampaign.auditTrail.map((event) => (
                      <AuditItem key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <CampaignDetailDrawer campaign={selectedCampaign} open={detailDrawerOpen} onClose={() => setDetailDrawerOpen(false)} />

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-[130] -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-xl dark:bg-slate-100 dark:text-slate-900">
          {toast}
        </div>
      ) : null}
    </div>
  );
}









