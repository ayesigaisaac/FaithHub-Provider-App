// @ts-nocheck
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  Bell,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  Eye,
  Filter,
  Layers,
  MonitorPlay,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { KpiTile } from "../../../components/ui/KpiTile";
import { navigateWithRouter } from "@/navigation/routerNavigate";

/**
 * FaithHub — Beacon Dashboard
 * ------------------------------------
 * Premium promotional control center for FaithHub Provider.
 *
 * Design goals
 * - Follow the premium creator-style card format already used across the generated FaithHub Provider pages.
 * - Use EVzone Green as the primary accent and EVzone Orange as the secondary accent.
 * - Reflect the Beacon model clearly: linked and standalone campaigns, spend pacing, creative quality,
 *   recommendations, quick-create actions, and strong in-page previews.
 * - Keep the page strategic, creative, and executive-friendly rather than spreadsheet-like.
 *
 * Notes
 * - Self-contained mock TSX page. Replace routing, analytics, persistence, preview rendering,
 *   and export hooks during integration.
 * - Tailwind-style utility classes assumed.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#0b1d49";

const ROUTES = {
  beaconBuilder: "/faithhub/provider/beacon-builder",
  beaconManager: "/faithhub/provider/beacon-manager",
  beaconMarketplace: "/faithhub/provider/beacon-marketplace",
  replaysAndClips: "/faithhub/provider/replays-and-clips",
  liveDashboard: "/faithhub/provider/live-dashboard",
  eventsManager: "/faithhub/provider/events-manager",
  donationsAndFunds: "/faithhub/provider/donations-and-funds",
  charityCrowdfund: "/faithhub/provider/charity-crowdfunding-workbench",
};

const HERO_REPLAY =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80";
const HERO_LIVE =
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80";
const HERO_EVENT =
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80";
const HERO_CROWDFUND =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80";
const HERO_STANDALONE =
  "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1600&q=80";
const HERO_SERIES =
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1600&q=80";

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  navigateWithRouter(url);
}

function runPrimaryAction(actionId: string) {
  if (actionId === "open_donations_funds") {
    safeNav("/faithhub/provider/donations-and-funds");
    return;
  }
  if (actionId === "open_events_manager") {
    safeNav("/faithhub/provider/events-manager");
    return;
  }
  if (actionId === "open_live_dashboard") {
    safeNav("/faithhub/provider/live-dashboard");
    return;
  }
  if (actionId === "copy_current_link") {
    navigator.clipboard?.writeText(window.location.href);
    return;
  }
  safeNav("/faithhub/provider/beacon-dashboard");
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

function pct(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Math.max(0, Math.min(100, Math.round((numerator / denominator) * 100)));
}

type PreviewMode = "desktop" | "mobile";
type StateFilter = "All" | CampaignState;
type ModeFilter = "All" | CampaignMode;
type Accent = "green" | "orange" | "navy";

type CampaignState =
  | "Draft"
  | "Active"
  | "Learning"
  | "At risk"
  | "Completed"
  | "Paused"
  | "Rejected"
  | "Archived";

type CampaignMode = "Linked" | "Standalone";

type SourceType =
  | "Replay"
  | "Clip"
  | "Live Session"
  | "Event"
  | "Fund"
  | "Crowdfund"
  | "Series"
  | "Institution"
  | "Standalone Announcement";

type BeaconCampaign = {
  id: string;
  title: string;
  subtitle: string;
  state: CampaignState;
  mode: CampaignMode;
  sourceType: SourceType;
  linkedName?: string;
  owner: string;
  objective: string;
  accent: Accent;
  heroImageUrl: string;
  spend: number;
  budget: number;
  reach: number;
  ctr: number;
  watchStarts: number;
  givingConversions: number;
  eventRegistrations: number;
  productClicks: number;
  followAdds: number;
  efficiencyLabel: string;
  creativeHealth: number;
  fatigueRisk: number;
  copyStrength: number;
  ctaAlignment: number;
  pacingPct: number;
  recommendedBudgetDelta: number;
  forecastLabel: string;
  audienceLeads: string[];
  regionLeads: string[];
  placementLeads: string[];
  surfaceMix: string[];
  languageMix: string[];
  recommendation: string;
  createdFrom: string;
  lastUpdatedLabel: string;
};

type Recommendation = {
  id: string;
  title: string;
  sourceType: SourceType;
  mode: CampaignMode;
  why: string;
  projectedLift: string;
  accent: Accent;
  route: string;
};

type QuickCreatePreset = {
  id: string;
  title: string;
  subtitle: string;
  mode: CampaignMode;
  accent: Accent;
  route: string;
};

type InsightRow = {
  label: string;
  value: number;
  note: string;
  accent?: Accent;
};

const CAMPAIGNS_SEED: BeaconCampaign[] = [
  {
    id: "bc_replay_grace",
    title: "Sunday Encounter Replay Boost",
    subtitle: "Grace in Motion replay push for week-two re-engagement and stronger watch starts.",
    state: "Active",
    mode: "Linked",
    sourceType: "Replay",
    linkedName: "Sunday Encounter Replay",
    owner: "Outreach Team",
    objective: "Watch starts",
    accent: "green",
    heroImageUrl: HERO_REPLAY,
    spend: 1240,
    budget: 1800,
    reach: 182000,
    ctr: 4.9,
    watchStarts: 8600,
    givingConversions: 142,
    eventRegistrations: 34,
    productClicks: 0,
    followAdds: 228,
    efficiencyLabel: "£0.14 per watch start",
    creativeHealth: 92,
    fatigueRisk: 38,
    copyStrength: 88,
    ctaAlignment: 94,
    pacingPct: 69,
    recommendedBudgetDelta: 240,
    forecastLabel: "Projected 11.8k watch starts if the current pace holds.",
    audienceLeads: ["Followers", "Replay visitors", "Young adults"],
    regionLeads: ["Kampala", "Nairobi", "London diaspora"],
    placementLeads: ["FaithHub feed", "Replay rail", "Beacon cards"],
    surfaceMix: ["In-app hero", "Replay companion", "Recommended cards"],
    languageMix: ["English", "Swahili"],
    recommendation: "Duplicate the best grace-quote creative into a short retargeting flight before fatigue rises.",
    createdFrom: "Post-live Publishing",
    lastUpdatedLabel: "Updated 18 min ago",
  },
  {
    id: "bc_midweek_live",
    title: "Faith & Work Midweek Reminder",
    subtitle: "Drive attendance into tonight’s live session before the countdown window closes.",
    state: "Learning",
    mode: "Linked",
    sourceType: "Live Session",
    linkedName: "Faith & Work Midweek Live",
    owner: "Production Team",
    objective: "Attendance",
    accent: "orange",
    heroImageUrl: HERO_LIVE,
    spend: 420,
    budget: 900,
    reach: 64000,
    ctr: 3.8,
    watchStarts: 2700,
    givingConversions: 28,
    eventRegistrations: 12,
    productClicks: 0,
    followAdds: 74,
    efficiencyLabel: "£0.16 per watch start",
    creativeHealth: 84,
    fatigueRisk: 19,
    copyStrength: 79,
    ctaAlignment: 86,
    pacingPct: 47,
    recommendedBudgetDelta: 120,
    forecastLabel: "Likely to stabilise after learning and outperform the current attendance baseline.",
    audienceLeads: ["Recent attendees", "Workplace group", "English audience"],
    regionLeads: ["Lagos", "Accra", "Kampala"],
    placementLeads: ["Live reminders rail", "FaithHub discover", "Home modules"],
    surfaceMix: ["Live reminders", "Discover", "Session cards"],
    languageMix: ["English"],
    recommendation: "Let the learning phase settle, then expand into a follow-up linked replay campaign.",
    createdFrom: "Live Builder",
    lastUpdatedLabel: "Updated 7 min ago",
  },
  {
    id: "bc_youth_camp",
    title: "Youth Camp Registration Sprint",
    subtitle: "Boost event registrations before scholarship applications close.",
    state: "At risk",
    mode: "Linked",
    sourceType: "Event",
    linkedName: "Youth Camp 2026",
    owner: "Events Team",
    objective: "Registrations",
    accent: "orange",
    heroImageUrl: HERO_EVENT,
    spend: 910,
    budget: 1600,
    reach: 102000,
    ctr: 2.1,
    watchStarts: 0,
    givingConversions: 0,
    eventRegistrations: 62,
    productClicks: 0,
    followAdds: 36,
    efficiencyLabel: "£14.68 per registration",
    creativeHealth: 61,
    fatigueRisk: 71,
    copyStrength: 58,
    ctaAlignment: 63,
    pacingPct: 57,
    recommendedBudgetDelta: -180,
    forecastLabel: "Current performance risks landing 24% under the registration target.",
    audienceLeads: ["Parents", "Youth volunteers", "Previous campers"],
    regionLeads: ["Kigali", "Kampala", "Mbarara"],
    placementLeads: ["Events rail", "Family feed", "Announcement cards"],
    surfaceMix: ["Events Hub", "Home feed", "Family surfaces"],
    languageMix: ["English", "Luganda"],
    recommendation: "Refresh the hero, tighten the CTA, and push a parent-specific variant into the highest-response region.",
    createdFrom: "Events Manager",
    lastUpdatedLabel: "Updated 42 min ago",
  },
  {
    id: "bc_relief_crowdfund",
    title: "Harvest Relief Momentum Drive",
    subtitle: "Charity crowdfunding flight for emergency food and school support packs.",
    state: "Active",
    mode: "Linked",
    sourceType: "Crowdfund",
    linkedName: "Harvest Relief Crowdfund",
    owner: "Care & Missions",
    objective: "Giving conversions",
    accent: "green",
    heroImageUrl: HERO_CROWDFUND,
    spend: 1380,
    budget: 2200,
    reach: 148000,
    ctr: 5.3,
    watchStarts: 0,
    givingConversions: 286,
    eventRegistrations: 0,
    productClicks: 0,
    followAdds: 92,
    efficiencyLabel: "£4.83 per donor action",
    creativeHealth: 89,
    fatigueRisk: 27,
    copyStrength: 91,
    ctaAlignment: 93,
    pacingPct: 63,
    recommendedBudgetDelta: 300,
    forecastLabel: "Projected +£18.4k movement if spend increases modestly into the strongest diaspora audience.",
    audienceLeads: ["Donors", "Care team followers", "Diaspora supporters"],
    regionLeads: ["Nairobi", "Kampala", "Johannesburg diaspora"],
    placementLeads: ["Giving surfaces", "Home hero", "Replay companion cards"],
    surfaceMix: ["Giving Hub", "FaithHub feed", "Replay CTA strip"],
    languageMix: ["English", "Swahili"],
    recommendation: "Create a donor-update variant and raise spend into the most efficient diaspora segment.",
    createdFrom: "Charity Crowdfunding Workbench",
    lastUpdatedLabel: "Updated 5 min ago",
  },
  {
    id: "bc_awareness_standalone",
    title: "Institution Awareness Flight",
    subtitle: "Standalone awareness campaign introducing the ministry to nearby seekers and new followers.",
    state: "Paused",
    mode: "Standalone",
    sourceType: "Institution",
    linkedName: "FaithHub Kampala Central",
    owner: "Communications",
    objective: "Follows",
    accent: "navy",
    heroImageUrl: HERO_STANDALONE,
    spend: 620,
    budget: 1400,
    reach: 91000,
    ctr: 1.9,
    watchStarts: 0,
    givingConversions: 0,
    eventRegistrations: 0,
    productClicks: 0,
    followAdds: 164,
    efficiencyLabel: "£3.78 per follow",
    creativeHealth: 73,
    fatigueRisk: 54,
    copyStrength: 69,
    ctaAlignment: 72,
    pacingPct: 44,
    recommendedBudgetDelta: 0,
    forecastLabel: "Paused while a warmer story-led creative direction is reviewed.",
    audienceLeads: ["Nearby adults", "Faith explorers", "Quiet-hour-safe contacts"],
    regionLeads: ["Kampala", "Entebbe", "Mukono"],
    placementLeads: ["Explore cards", "Home modules", "Institution suggestions"],
    surfaceMix: ["Discover", "Institution suggestions"],
    languageMix: ["English", "Luganda"],
    recommendation: "Restart with a more human lead image and a softer community invitation CTA.",
    createdFrom: "Beacon Builder",
    lastUpdatedLabel: "Paused yesterday",
  },
  {
    id: "bc_series_launch",
    title: "Resurrection Series Launch",
    subtitle: "Promote a new premium teaching series before the first episode goes live.",
    state: "Completed",
    mode: "Linked",
    sourceType: "Series",
    linkedName: "Resurrection & Hope",
    owner: "Content Team",
    objective: "Series follows",
    accent: "green",
    heroImageUrl: HERO_SERIES,
    spend: 980,
    budget: 980,
    reach: 134000,
    ctr: 4.4,
    watchStarts: 0,
    givingConversions: 0,
    eventRegistrations: 0,
    productClicks: 0,
    followAdds: 412,
    efficiencyLabel: "£2.38 per follow",
    creativeHealth: 90,
    fatigueRisk: 35,
    copyStrength: 87,
    ctaAlignment: 89,
    pacingPct: 100,
    recommendedBudgetDelta: 0,
    forecastLabel: "Completed above target with strong launch-follow conversion.",
    audienceLeads: ["Series followers", "Replay viewers", "Study groups"],
    regionLeads: ["London", "Nairobi", "Kampala"],
    placementLeads: ["Series cards", "Home spotlight", "Library rails"],
    surfaceMix: ["Series library", "FaithHub home"],
    languageMix: ["English"],
    recommendation: "Reuse the strongest launch creative for episode-level reminder campaigns.",
    createdFrom: "Series Builder",
    lastUpdatedLabel: "Completed 2 days ago",
  },
  {
    id: "bc_prayer_announcement",
    title: "Prayer Night Announcement",
    subtitle: "Standalone promo campaign with no linked teaching, event, or series parent.",
    state: "Draft",
    mode: "Standalone",
    sourceType: "Standalone Announcement",
    owner: "Prayer Team",
    objective: "Awareness",
    accent: "orange",
    heroImageUrl: HERO_STANDALONE,
    spend: 0,
    budget: 350,
    reach: 0,
    ctr: 0,
    watchStarts: 0,
    givingConversions: 0,
    eventRegistrations: 0,
    productClicks: 0,
    followAdds: 0,
    efficiencyLabel: "Awaiting launch",
    creativeHealth: 88,
    fatigueRisk: 0,
    copyStrength: 84,
    ctaAlignment: 81,
    pacingPct: 0,
    recommendedBudgetDelta: 0,
    forecastLabel: "Draft ready for launch once destination and sender approvals are confirmed.",
    audienceLeads: ["Prayer members", "Young adults", "WhatsApp opt-ins"],
    regionLeads: ["Kampala", "Virtual"],
    placementLeads: ["Announcement cards", "Prayer rail"],
    surfaceMix: ["Prayer surfaces", "Home announcement stack"],
    languageMix: ["English"],
    recommendation: "Launch with a low-budget awareness objective and a soft RSVP CTA.",
    createdFrom: "Beacon Builder",
    lastUpdatedLabel: "Draft updated this morning",
  },
  {
    id: "bc_archive_clip",
    title: "Grace Quote Clip Retarget",
    subtitle: "Short-form clip retargeting flight retired after saturation reached the comfort ceiling.",
    state: "Archived",
    mode: "Linked",
    sourceType: "Clip",
    linkedName: "Grace quote cutdown",
    owner: "Growth Team",
    objective: "Replay recovery",
    accent: "navy",
    heroImageUrl: HERO_REPLAY,
    spend: 460,
    budget: 460,
    reach: 56000,
    ctr: 6.2,
    watchStarts: 3100,
    givingConversions: 48,
    eventRegistrations: 0,
    productClicks: 0,
    followAdds: 62,
    efficiencyLabel: "£0.15 per watch start",
    creativeHealth: 68,
    fatigueRisk: 82,
    copyStrength: 73,
    ctaAlignment: 76,
    pacingPct: 100,
    recommendedBudgetDelta: 0,
    forecastLabel: "Archived after a strong efficient short run and rising fatigue risk.",
    audienceLeads: ["Replay viewers", "Clip viewers"],
    regionLeads: ["Kampala", "Lagos"],
    placementLeads: ["Short-form feed", "Replay suggestions"],
    surfaceMix: ["Clip rail", "Replay suggestions"],
    languageMix: ["English"],
    recommendation: "Duplicate only if a genuinely fresh hook angle is available.",
    createdFrom: "Replays & Clips",
    lastUpdatedLabel: "Archived 3 days ago",
  },
  {
    id: "bc_fund_review",
    title: "Building Fund Weekend Appeal",
    subtitle: "Promotional flight held after trust copy review flagged missing impact proof.",
    state: "Rejected",
    mode: "Linked",
    sourceType: "Fund",
    linkedName: "Building Renewal Fund",
    owner: "Finance + Communications",
    objective: "Giving conversions",
    accent: "orange",
    heroImageUrl: HERO_CROWDFUND,
    spend: 0,
    budget: 900,
    reach: 0,
    ctr: 0,
    watchStarts: 0,
    givingConversions: 0,
    eventRegistrations: 0,
    productClicks: 0,
    followAdds: 0,
    efficiencyLabel: "Needs approval fixes",
    creativeHealth: 52,
    fatigueRisk: 0,
    copyStrength: 49,
    ctaAlignment: 57,
    pacingPct: 0,
    recommendedBudgetDelta: 0,
    forecastLabel: "Cannot launch until accountability copy and proof-of-impact assets are fixed.",
    audienceLeads: ["Donors", "Builders group"],
    regionLeads: ["Kampala"],
    placementLeads: ["Giving cards"],
    surfaceMix: ["Giving Hub"],
    languageMix: ["English"],
    recommendation: "Rebuild with stronger impact proof, warmer donor trust language, and clearer governance notes.",
    createdFrom: "Donations & Funds",
    lastUpdatedLabel: "Rejected this week",
  },
];

const RECOMMENDATIONS_SEED: Recommendation[] = [
  {
    id: "rec_replay",
    title: "Grace quote replay deserves a fresh 7-day push",
    sourceType: "Replay",
    mode: "Linked",
    why: "Watch-through is outperforming the replay median by 31% and donor click-through is still climbing.",
    projectedLift: "+2.8k watch starts",
    accent: "green",
    route: ROUTES.replaysAndClips,
  },
  {
    id: "rec_event",
    title: "Youth Camp needs a family-oriented creative refresh",
    sourceType: "Event",
    mode: "Linked",
    why: "Current creative is fatiguing while parent-segment CTR trails the benchmark by 18%.",
    projectedLift: "+74 registrations if refreshed",
    accent: "orange",
    route: ROUTES.eventsManager,
  },
  {
    id: "rec_crowdfund",
    title: "Harvest Relief can support a higher budget ceiling",
    sourceType: "Crowdfund",
    mode: "Linked",
    why: "Diaspora donor conversion remains strong and current spend is below the efficient range.",
    projectedLift: "+£18.4k campaign movement",
    accent: "green",
    route: ROUTES.charityCrowdfund,
  },
  {
    id: "rec_standalone",
    title: "Launch a standalone prayer-and-fasting awareness campaign",
    sourceType: "Standalone Announcement",
    mode: "Standalone",
    why: "No linked object is required and audience overlap suggests strong awareness potential.",
    projectedLift: "+14k reach in the first 72 hours",
    accent: "navy",
    route: ROUTES.beaconBuilder,
  },
];

const QUICK_CREATE_PRESETS: QuickCreatePreset[] = [
  {
    id: "qc_replay",
    title: "Linked replay boost",
    subtitle: "Turn a replay into a premium Beacon campaign in one step.",
    mode: "Linked",
    accent: "green",
    route: ROUTES.replaysAndClips,
  },
  {
    id: "qc_awareness",
    title: "Awareness ad",
    subtitle: "Launch a standalone awareness flight for institution growth and discovery.",
    mode: "Standalone",
    accent: "navy",
    route: ROUTES.beaconBuilder,
  },
  {
    id: "qc_announcement",
    title: "Announcement ad",
    subtitle: "Promote a prayer night, community alert, or service update.",
    mode: "Standalone",
    accent: "orange",
    route: ROUTES.beaconBuilder,
  },
  {
    id: "qc_retarget",
    title: "Retargeting follow-up",
    subtitle: "Bring replay viewers, donors, or event visitors back into action.",
    mode: "Linked",
    accent: "green",
    route: ROUTES.beaconManager,
  },
];

function accentColor(accent: Accent) {
  return accent === "orange" ? EV_ORANGE : accent === "navy" ? EV_NAVY : EV_GREEN;
}

function stateTone(state: CampaignState): "good" | "warn" | "bad" | "neutral" {
  if (state === "Active" || state === "Completed") return "good";
  if (state === "Learning" || state === "Draft" || state === "Paused") return "warn";
  if (state === "At risk" || state === "Rejected") return "bad";
  return "neutral";
}

function healthTone(score: number): "good" | "warn" | "bad" {
  if (score >= 80) return "good";
  if (score >= 60) return "warn";
  return "bad";
}

function fatigueTone(score: number): "good" | "warn" | "bad" {
  if (score < 35) return "good";
  if (score < 65) return "warn";
  return "bad";
}

function Pill({
  tone = "neutral",
  children,
  title,
}: {
  tone?: "good" | "warn" | "bad" | "neutral" | "pro";
  children: React.ReactNode;
  title?: string;
}) {
  const cls =
    tone === "good"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
      : tone === "warn"
      ? "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20"
      : tone === "bad"
      ? "bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20"
      : tone === "pro"
      ? "bg-violet-50 text-violet-800 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:ring-violet-500/20"
      : "bg-slate-100 text-slate-800 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700";

  return (
    <span
      title={title}
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-semibold ring-1 whitespace-nowrap",
        cls,
      )}
    >
      {children}
    </span>
  );
}

function Btn({
  tone = "neutral",
  children,
  onClick,
  disabled,
  left,
  title,
  className,
}: {
  tone?: "neutral" | "primary" | "secondary" | "ghost";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  left?: React.ReactNode;
  title?: string;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  const cls =
    tone === "primary"
      ? "text-white hover:brightness-95 shadow-sm"
      : tone === "secondary"
      ? "text-white hover:brightness-95 shadow-sm"
      : tone === "ghost"
      ? "bg-transparent text-slate-900 dark:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800"
      : "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 ring-1 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm";
  const style =
    tone === "primary"
      ? { background: EV_GREEN }
      : tone === "secondary"
      ? { background: EV_ORANGE }
      : undefined;

  return (
    <button
      title={title}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cx(base, cls, className)}
      style={style}
    >
      {left}
      {children}
    </button>
  );
}

function Modal({
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
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl ring-1 ring-slate-200 transition dark:bg-slate-900 dark:ring-slate-800 sm:h-auto sm:max-h-[90vh] sm:rounded-3xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-slate-900 dark:text-slate-50">{title}</div>
            {subtitle ? <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</div> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 sm:p-6">{children}</div>
      </div>
    </div>
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-base font-bold text-slate-900 dark:text-slate-50">{title}</div>
          {subtitle ? <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</div> : null}
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

function ProgressBar({ value, accent = "green" }: { value: number; accent?: Accent }) {
  const width = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${width}%`, background: accentColor(accent) }} />
    </div>
  );
}

function MiniLine({ values, tone = "green" }: { values: number[]; tone?: Accent }) {
  const w = 140;
  const h = 42;
  const pad = 4;
  const safe = values.length ? values : [0, 0, 0];
  const min = Math.min(...safe);
  const max = Math.max(...safe);
  const norm = (v: number) => {
    const t = max === min ? 0.5 : (v - min) / (max - min);
    return h - pad - t * (h - pad * 2);
  };
  const pts = safe
    .map((v, i) => {
      const x = pad + (i * (w - pad * 2)) / Math.max(1, safe.length - 1);
      const y = norm(v);
      return `${x},${y}`;
    })
    .join(" ");
  const stroke = accentColor(tone);

  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w - pad} cy={norm(safe[safe.length - 1])} r={3.5} fill={stroke} />
    </svg>
  );
}

function BrowserPreview({ campaign }: { campaign: BeaconCampaign }) {
  const primaryCTA =
    campaign.sourceType === "Crowdfund" || campaign.sourceType === "Fund"
      ? "Give now"
      : campaign.sourceType === "Event"
      ? "Register now"
      : campaign.sourceType === "Replay" || campaign.sourceType === "Clip"
      ? "Watch now"
      : campaign.sourceType === "Live Session"
      ? "Join session"
      : "Open destination";
  const primaryActionId =
    campaign.sourceType === "Crowdfund" || campaign.sourceType === "Fund"
      ? "open_donations_funds"
      : campaign.sourceType === "Event"
        ? "open_events_manager"
        : campaign.sourceType === "Replay" || campaign.sourceType === "Clip" || campaign.sourceType === "Live Session"
          ? "open_live_dashboard"
          : "open_beacon_dashboard";

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-sm transition-colors">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img src={campaign.heroImageUrl} alt={campaign.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-black/45 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white backdrop-blur">Beacon</span>
          <span className="rounded-full bg-white/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white backdrop-blur">{campaign.mode}</span>
          <span className="rounded-full bg-white/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white backdrop-blur">{campaign.sourceType}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <div className="text-lg font-black leading-tight">{campaign.title}</div>
          <div className="mt-1 max-w-[90%] text-sm text-white/80 line-clamp-2">{campaign.subtitle}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-extrabold text-white"
              style={{ background: accentColor(campaign.accent) }}
              onClick={() => runPrimaryAction(primaryActionId)}>
              {primaryCTA}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-[12px] font-extrabold text-white backdrop-blur"
              onClick={() => safeNav("/faithhub/provider/beacon-dashboard")}>
              Learn more
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 border-t border-white/10 bg-slate-950 px-4 py-3 text-white/85">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-white/45">Reach</div>
          <div className="mt-1 text-sm font-black">{fmtInt(campaign.reach)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-white/45">CTR</div>
          <div className="mt-1 text-sm font-black">{fmtPct(campaign.ctr)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-white/45">Efficiency</div>
          <div className="mt-1 text-sm font-black">{campaign.efficiencyLabel}</div>
        </div>
      </div>
    </div>
  );
}

function PhonePreview({ campaign }: { campaign: BeaconCampaign }) {
  const primaryLabel =
    campaign.sourceType === "Crowdfund" || campaign.sourceType === "Fund"
      ? "Give"
      : campaign.sourceType === "Event"
      ? "Register"
      : campaign.sourceType === "Replay" || campaign.sourceType === "Clip"
      ? "Watch"
      : campaign.sourceType === "Live Session"
      ? "Join"
      : "Open";
  const primaryActionId =
    primaryLabel === "Give"
      ? "open_donations_funds"
      : primaryLabel === "Register"
        ? "open_events_manager"
        : primaryLabel === "Watch" || primaryLabel === "Join"
          ? "open_live_dashboard"
          : "open_beacon_dashboard";

  return (
    <div className="mx-auto w-full max-w-[310px] md:max-w-[360px] rounded-[34px] bg-slate-950 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition-colors">
      <div className="overflow-hidden rounded-[28px] bg-white dark:bg-slate-950 transition-colors">
        <div className="h-[560px] overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-3 py-3">
            <div className="truncate text-[13px] font-extrabold text-slate-900 dark:text-slate-100">Beacon feed preview</div>
            <div className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[10px] font-extrabold text-slate-700 dark:text-slate-300">{campaign.mode}</div>
          </div>

          <div className="p-3">
            <div className="overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-sm">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img src={campaign.heroImageUrl} alt={campaign.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                  <span className="rounded-full px-2 py-1 text-[10px] font-black text-white" style={{ background: accentColor(campaign.accent) }}>
                    Beacon
                  </span>
                  <span className="rounded-full bg-black/40 px-2 py-1 text-[10px] font-black text-white backdrop-blur">{campaign.sourceType}</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                  <div className="line-clamp-2 text-[17px] font-black leading-tight">{campaign.title}</div>
                  <div className="mt-1 line-clamp-2 text-[12px] text-white/80">{campaign.subtitle}</div>
                </div>
              </div>

              <div className="space-y-3 p-3">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Reach</div>
                    <div className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">{fmtInt(campaign.reach)}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500">CTR</div>
                    <div className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">{fmtPct(campaign.ctr)}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center rounded-2xl px-3 py-2.5 text-[12px] font-black text-white"
                    style={{ background: accentColor(campaign.accent) }}
                    onClick={() => runPrimaryAction(primaryActionId)}>
                    {primaryLabel}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-[12px] font-black text-slate-900 dark:text-slate-100"
                    onClick={() => navigator.clipboard?.writeText(window.location.href)}>
                    Save
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3 shadow-sm">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Surfaces</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {campaign.surfaceMix.slice(0, 3).map((surface) => (
                  <span key={surface} className="rounded-full bg-white dark:bg-slate-950 px-3 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-800">
                    {surface}
                  </span>
                ))}
              </div>
              <div className="mt-3 text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Preview shows how the selected Beacon creative sits inside premium FaithHub feed surfaces.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightBars({ rows }: { rows: InsightRow[] }) {
  const max = Math.max(1, ...rows.map((row) => row.value));
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="flex items-center justify-between gap-2 text-[12px]">
            <div className="min-w-0">
              <div className="font-bold text-slate-900 dark:text-slate-100 truncate">{row.label}</div>
              <div className="text-slate-500 dark:text-slate-400 truncate">{row.note}</div>
            </div>
            <div className="shrink-0 font-black text-slate-900 dark:text-slate-100">{fmtInt(row.value)}</div>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.max(8, Math.round((row.value / max) * 100))}%`,
                background: accentColor(row.accent || "green"),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function CampaignRow({
  campaign,
  active,
  onSelect,
  onDuplicate,
}: {
  campaign: BeaconCampaign;
  active: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cx(
        "w-full rounded-3xl border p-3 text-left transition-all",
        active
          ? "border-slate-300 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
          : "border-slate-200 bg-slate-50 hover:bg-white dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-900",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-bold text-slate-900 dark:text-slate-50">{campaign.title}</div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{campaign.subtitle}</div>
        </div>
        <div
          className="shrink-0 rounded-full px-2 py-1 text-[10px] font-bold text-white"
          style={{ background: accentColor(campaign.accent) }}
        >
          {campaign.sourceType}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Pill tone={stateTone(campaign.state)}>{campaign.state}</Pill>
        <Pill tone="neutral">{campaign.mode}</Pill>
        <Pill tone={healthTone(campaign.creativeHealth)}>Health {campaign.creativeHealth}%</Pill>
        <Pill tone={fatigueTone(campaign.fatigueRisk)}>Fatigue {campaign.fatigueRisk}%</Pill>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <div className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">Spend</div>
          <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-50">{fmtCurrency(campaign.spend)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">Reach</div>
          <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-50">{fmtInt(campaign.reach)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">CTR</div>
          <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-50">{fmtPct(campaign.ctr)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">Outcome</div>
          <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-50">
            {campaign.watchStarts > 0
              ? `${fmtInt(campaign.watchStarts)} starts`
              : campaign.givingConversions > 0
              ? `${fmtInt(campaign.givingConversions)} donors`
              : campaign.eventRegistrations > 0
              ? `${fmtInt(campaign.eventRegistrations)} sign-ups`
              : `${fmtInt(campaign.followAdds)} follows`}
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[11px] text-slate-500 dark:text-slate-400">{campaign.lastUpdatedLabel} · From {campaign.createdFrom}</div>
        <div className="flex items-center gap-2">
          <Btn tone="ghost" onClick={onDuplicate} left={<Copy className="h-4 w-4" />}>
            Duplicate
          </Btn>
          <Btn tone="neutral" onClick={onSelect} left={<Eye className="h-4 w-4" />}>
            Review
          </Btn>
        </div>
      </div>
    </button>
  );
}

export default function BeaconDashboardPage() {
  const [campaigns] = useState<BeaconCampaign[]>(CAMPAIGNS_SEED);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<StateFilter>("All");
  const [modeFilter, setModeFilter] = useState<ModeFilter>("All");
  const [selectedId, setSelectedId] = useState<string>(CAMPAIGNS_SEED[0]?.id || "");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return campaigns
      .filter((campaign) => (stateFilter === "All" ? true : campaign.state === stateFilter))
      .filter((campaign) => (modeFilter === "All" ? true : campaign.mode === modeFilter))
      .filter((campaign) => {
        if (!q) return true;
        return (
          campaign.title.toLowerCase().includes(q) ||
          campaign.subtitle.toLowerCase().includes(q) ||
          campaign.sourceType.toLowerCase().includes(q) ||
          campaign.mode.toLowerCase().includes(q) ||
          campaign.owner.toLowerCase().includes(q) ||
          (campaign.linkedName || "").toLowerCase().includes(q)
        );
      });
  }, [campaigns, query, stateFilter, modeFilter]);

  useEffect(() => {
    if (!filtered.length) return;
    if (!filtered.some((campaign) => campaign.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selectedCampaign = useMemo(() => {
    return filtered.find((campaign) => campaign.id === selectedId) || campaigns.find((campaign) => campaign.id === selectedId) || campaigns[0];
  }, [filtered, campaigns, selectedId]);

  const activeLike = useMemo(
    () => campaigns.filter((campaign) => ["Active", "Learning", "At risk"].includes(campaign.state)),
    [campaigns],
  );

  const portfolio = useMemo(() => {
    const spend = activeLike.reduce((sum, campaign) => sum + campaign.spend, 0);
    const budget = activeLike.reduce((sum, campaign) => sum + campaign.budget, 0);
    const reach = activeLike.reduce((sum, campaign) => sum + campaign.reach, 0);
    const watchStarts = activeLike.reduce((sum, campaign) => sum + campaign.watchStarts, 0);
    const givingConversions = activeLike.reduce((sum, campaign) => sum + campaign.givingConversions, 0);
    const eventRegistrations = activeLike.reduce((sum, campaign) => sum + campaign.eventRegistrations, 0);
    const productClicks = activeLike.reduce((sum, campaign) => sum + campaign.productClicks, 0);
    const followAdds = activeLike.reduce((sum, campaign) => sum + campaign.followAdds, 0);
    const avgCtr = activeLike.length ? activeLike.reduce((sum, campaign) => sum + campaign.ctr, 0) / activeLike.length : 0;
    const avgHealth = activeLike.length ? activeLike.reduce((sum, campaign) => sum + campaign.creativeHealth, 0) / activeLike.length : 0;
    const linkedCount = activeLike.filter((campaign) => campaign.mode === "Linked").length;
    const standaloneCount = activeLike.filter((campaign) => campaign.mode === "Standalone").length;

    return {
      activeCount: activeLike.length,
      spend,
      budget,
      reach,
      watchStarts,
      givingConversions,
      eventRegistrations,
      productClicks,
      followAdds,
      avgCtr,
      avgHealth,
      linkedCount,
      standaloneCount,
      pacingPct: pct(spend, budget),
    };
  }, [activeLike]);

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
    return order.map((state) => ({ state, count: campaigns.filter((campaign) => campaign.state === state).length }));
  }, [campaigns]);

  const creativeAlerts = useMemo(
    () => campaigns
      .filter((campaign) => campaign.state !== "Completed" && campaign.state !== "Archived")
      .sort((a, b) => a.creativeHealth - b.creativeHealth || b.fatigueRisk - a.fatigueRisk)
      .slice(0, 4),
    [campaigns],
  );

  const audienceRows = useMemo<InsightRow[]>(
    () => [
      { label: "Followers", value: 32800, note: "Most efficient segment this week", accent: "green" },
      { label: "Replay viewers", value: 21900, note: "Strong retargeting behavior after post-live sends", accent: "navy" },
      { label: "Donor supporters", value: 16400, note: "Best donor-quality audience for crowdfund flights", accent: "green" },
      { label: "Parents & family", value: 11800, note: "Needs refreshed event creative for Youth Camp", accent: "orange" },
    ],
    [],
  );

  const placementRows = useMemo<InsightRow[]>(
    () => [
      { label: "FaithHub feed", value: 68400, note: "Best premium reach inventory this week", accent: "green" },
      { label: "Replay companion cards", value: 26800, note: "High donor-quality traffic", accent: "orange" },
      { label: "Discover modules", value: 21400, note: "Great for institution awareness", accent: "navy" },
      { label: "Event rail", value: 9300, note: "Registration-focused placements", accent: "orange" },
    ],
    [],
  );

  const regionRows = useMemo<InsightRow[]>(
    () => [
      { label: "Kampala", value: 52100, note: "Highest FaithHub response density", accent: "green" },
      { label: "Nairobi", value: 37700, note: "Strong reach for replay and crowdfund campaigns", accent: "orange" },
      { label: "Diaspora mix", value: 18200, note: "Premium donor conversion corridor", accent: "navy" },
    ],
    [],
  );

  const forecastSeries = useMemo(() => [52, 56, 58, 61, 60, 64, 67, 70, 72, 75, 78, 81], []);
  const efficiencySeries = useMemo(() => [31, 30, 29, 27, 28, 26, 24, 23, 24, 22, 21, 20], []);

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(
        `${selectedCampaign.title}\n${selectedCampaign.subtitle}\nState: ${selectedCampaign.state}\nMode: ${selectedCampaign.mode}\nSource: ${selectedCampaign.sourceType}\nSpend: ${fmtCurrency(selectedCampaign.spend)} / ${fmtCurrency(selectedCampaign.budget)}`,
      );
      setToast("Campaign summary copied.");
    } catch {
      setToast("Copy not available in this environment.");
    }
  }

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
                <span className="font-medium text-slate-700 dark:text-slate-300">Dashboard</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">Beacon Dashboard</div>
                <Pill tone="pro">
                  <Sparkles className="h-3.5 w-3.5" /> Premium promotion engine
                </Pill>
              </div>
              <div className="mt-2 max-w-4xl text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Give Providers a premium control center for promotion, spend, reach, conversions, creative health,
                and recommendations across all active and past Beacon campaigns.
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Btn tone="neutral" onClick={() => safeNav(ROUTES.beaconMarketplace)} left={<Layers className="h-4 w-4" />}>
                Beacon Marketplace
              </Btn>
              <Btn tone="neutral" onClick={() => safeNav(ROUTES.beaconManager)} left={<BarChart3 className="h-4 w-4" />}>
                Open campaign manager
              </Btn>
              <Btn tone="secondary" onClick={() => setToast("Recommendations panel refreshed.")} left={<Sparkles className="h-4 w-4" />}>
                Review recommendations
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
                title="Performance hero"
                subtitle="Active campaigns, total spend, reach, click-through, watch starts, giving conversions, event registrations, and cost efficiency at a glance."
                right={<Pill tone="good">{portfolio.activeCount} active-like campaigns</Pill>}
              />

              <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
                <MetricCard label="Total spend" value={fmtCurrency(portfolio.spend)} hint={`Budget ${fmtCurrency(portfolio.budget)}`} tone="green" />
                <MetricCard label="Reach" value={fmtInt(portfolio.reach)} hint={`Avg CTR ${fmtPct(portfolio.avgCtr)}`} tone="orange" />
                <MetricCard label="Watch starts" value={fmtInt(portfolio.watchStarts)} hint="Replay and live attendance signals" tone="navy" />
                <MetricCard label="Creative health" value={`${Math.round(portfolio.avgHealth)}%`} hint="Portfolio average across active flights" tone="green" />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Budget pacing and forecast strip</div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Tracks spend against budget, burn rate, and projected outcome quality across the portfolio.</div>
                    </div>
                    <Pill tone={portfolio.pacingPct > 75 ? "warn" : "good"}>Pace {portfolio.pacingPct}%</Pill>
                  </div>
                  <div className="mt-3 text-xs font-semibold text-slate-600 dark:text-slate-400">Portfolio pacing</div>
                  <div className="mt-2"><ProgressBar value={portfolio.pacingPct} accent="green" /></div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">Projected reach quality</div>
                      <div className="mt-2"><MiniLine values={forecastSeries} tone="green" /></div>
                    </div>
                    <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">Cost efficiency trend</div>
                      <div className="mt-2"><MiniLine values={efficiencySeries} tone="orange" /></div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Conversion intelligence block</div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Beacon outcomes tied back to live attendance, replay views, donations, event registrations, and follows.</div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <MetricCard label="Giving" value={fmtInt(portfolio.givingConversions)} hint="Donor actions" tone="green" />
                    <MetricCard label="Events" value={fmtInt(portfolio.eventRegistrations)} hint="Registrations" tone="orange" />
                    <MetricCard label="Clicks" value={fmtInt(portfolio.productClicks)} hint="Product/offer clicks" tone="navy" />
                    <MetricCard label="Follows" value={fmtInt(portfolio.followAdds)} hint="Institution follows" tone="green" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <SectionTitle
                icon={<Layers className="h-5 w-5" />}
                title="Campaign status board"
                subtitle="Draft, active, learning, at risk, completed, paused, rejected, and archived states with direct actions."
                right={
                  <div className="flex items-center gap-2">
                    <Btn tone="ghost" onClick={() => setToast("Operational view saved.")}>Save view</Btn>
                    <Btn tone="neutral" onClick={() => setToast("Campaign board refreshed.")} left={<RefreshCw className="h-4 w-4" />}>
                      Refresh
                    </Btn>
                  </div>
                }
              />

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
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-900",
                    )}
                  >
                    <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">{item.state}</div>
                    <div className="mt-1 text-[28px] font-black text-slate-900 dark:text-slate-100">{item.count}</div>
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 transition-colors">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search title, source type, linked object, or owner"
                    className="w-full bg-transparent outline-none text-[12px] text-slate-900 dark:text-slate-100 placeholder:text-slate-500"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-[12px] font-extrabold flex items-center gap-2 transition-colors">
                    <Filter className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                    <span className="text-slate-700 dark:text-slate-300">Mode</span>
                  </div>
                  {(["All", "Linked", "Standalone"] as ModeFilter[]).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setModeFilter(filter)}
                      className={cx(
                        "rounded-full px-3 py-1.5 text-[11px] font-semibold border transition-colors",
                        modeFilter === filter
                          ? "border-transparent text-white"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300",
                      )}
                      style={modeFilter === filter ? { background: EV_ORANGE } : undefined}
                    >
                      {filter}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setStateFilter("All")}
                    className={cx(
                      "rounded-full px-3 py-1.5 text-[11px] font-semibold border transition-colors",
                      stateFilter === "All"
                        ? "border-transparent text-white"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300",
                    )}
                    style={stateFilter === "All" ? { background: EV_GREEN } : undefined}
                  >
                    All states
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {filtered.map((campaign) => (
                  <CampaignRow
                    key={campaign.id}
                    campaign={campaign}
                    active={campaign.id === selectedCampaign.id}
                    onSelect={() => setSelectedId(campaign.id)}
                    onDuplicate={() => {
                      setSelectedId(campaign.id);
                      setToast(`Duplicated ${campaign.title} into a new draft (demo).`);
                    }}
                  />
                ))}
                {!filtered.length ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-8 text-center">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-50">No campaigns match these filters</div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Clear the filters or launch a new Beacon campaign.</div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
                <SectionTitle
                  icon={<Sparkles className="h-5 w-5" />}
                  title="Creative health panel"
                  subtitle="Highlights low-performing visuals, fatigue risk, copy weakness, CTA mismatch, and refresh opportunities."
                />
                <div className="mt-4 space-y-3">
                  {creativeAlerts.map((campaign) => (
                    <div key={campaign.id} className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-50">{campaign.title}</div>
                          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{campaign.sourceType} · {campaign.mode} · {campaign.objective}</div>
                        </div>
                        <Pill tone={healthTone(campaign.creativeHealth)}>Health {campaign.creativeHealth}%</Pill>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800 text-center">
                          <div className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">Fatigue</div>
                          <div className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">{campaign.fatigueRisk}%</div>
                        </div>
                        <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800 text-center">
                          <div className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">Copy</div>
                          <div className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">{campaign.copyStrength}%</div>
                        </div>
                        <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800 text-center">
                          <div className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">CTA fit</div>
                          <div className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">{campaign.ctaAlignment}%</div>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{campaign.recommendation}</div>
                      <div className="mt-3 flex items-center gap-2">
                        <Btn tone="secondary" onClick={() => setToast(`Refresh creative flow opened for ${campaign.title}.`)} left={<RefreshCw className="h-4 w-4" />}>
                          Refresh creative
                        </Btn>
                        <Btn tone="neutral" onClick={() => setToast(`Duplicated ${campaign.title} as a new creative test.`)} left={<Copy className="h-4 w-4" />}>
                          Duplicate winner
                        </Btn>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
                <SectionTitle
                  icon={<Users className="h-5 w-5" />}
                  title="Audience and placement insights"
                  subtitle="See where Beacon results are coming from by segment, region, surface, language, and placement type."
                />
                <div className="mt-4 grid gap-4">
                  <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Top audience segments</div>
                    <div className="mt-3"><InsightBars rows={audienceRows} /></div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Placements</div>
                      <div className="mt-3"><InsightBars rows={placementRows} /></div>
                    </div>
                    <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Regions</div>
                      <div className="mt-3"><InsightBars rows={regionRows} /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
                <SectionTitle
                  icon={<Bell className="h-5 w-5" />}
                  title="Recommendations panel"
                  subtitle="Suggests which replay, clip, series, event, fund, or crowdfund deserves promotion next, including standalone campaigns."
                />
                <div className="mt-4 space-y-3">
                  {RECOMMENDATIONS_SEED.map((item) => (
                    <div key={item.id} className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-50">{item.title}</div>
                          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.sourceType} · {item.mode}</div>
                        </div>
                        <div className="rounded-full px-2 py-1 text-[10px] font-bold text-white" style={{ background: accentColor(item.accent) }}>
                          {item.projectedLift}
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.why}</div>
                      <div className="mt-3 flex items-center gap-2">
                        <Btn tone="primary" onClick={() => safeNav(item.route)} left={<ExternalLink className="h-4 w-4" />}>
                          Act on recommendation
                        </Btn>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
                <SectionTitle
                  icon={<Zap className="h-5 w-5" />}
                  title="Quick-create and duplicate rail"
                  subtitle="One-click launch options for linked campaigns, awareness ads, announcement ads, and retargeting-style follow-up flights."
                />
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {QUICK_CREATE_PRESETS.map((preset) => (
                    <div key={preset.id} className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-50">{preset.title}</div>
                          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{preset.subtitle}</div>
                        </div>
                        <div className="rounded-full px-2 py-1 text-[10px] font-bold text-white" style={{ background: accentColor(preset.accent) }}>
                          {preset.mode}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <Btn tone="secondary" onClick={() => safeNav(preset.route)} left={<Plus className="h-4 w-4" />}>
                          Launch flow
                        </Btn>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Duplicate selected campaign</div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Fastest way to create a variant from the currently selected Beacon campaign.</div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-50">{selectedCampaign.title}</div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{selectedCampaign.mode} · {selectedCampaign.sourceType}</div>
                    </div>
                    <Btn tone="primary" onClick={() => setToast(`Duplicated ${selectedCampaign.title} into a new draft.`)} left={<Copy className="h-4 w-4" />}>
                      Duplicate now
                    </Btn>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition lg:sticky lg:top-24">
              <SectionTitle
                icon={<Eye className="h-5 w-5" />}
                title="Preview + creative snapshot"
                subtitle="Desktop and mobile Beacon surfaces update from the selected campaign."
                right={<Pill tone="good">Preview-ready</Pill>}
              />

              <div className="mt-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Selected campaign</div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewMode("desktop")}
                      className={cx(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        previewMode === "desktop" ? "text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
                      )}
                      style={previewMode === "desktop" ? { background: EV_NAVY } : undefined}
                    >
                      Desktop
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode("mobile")}
                      className={cx(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        previewMode === "mobile" ? "text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
                      )}
                      style={previewMode === "mobile" ? { background: EV_GREEN } : undefined}
                    >
                      Mobile
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  {previewMode === "desktop" ? (
                    <div className="scale-[0.72] origin-top-left w-[138%] -mb-24">
                      <BrowserPreview campaign={selectedCampaign} />
                    </div>
                  ) : (
                    <PhonePreview campaign={selectedCampaign} />
                  )}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Btn tone="primary" onClick={() => setPreviewOpen(true)} left={<ExternalLink className="h-4 w-4" />}>
                    Open full preview
                  </Btn>
                  <Btn tone="secondary" onClick={() => safeNav(ROUTES.beaconBuilder)} left={<Zap className="h-4 w-4" />}>
                    Open Builder
                  </Btn>
                </div>
              </div>

              <div className="mt-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Selected campaign pacing</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Budget pacing, recommended increases or cuts, and forecast outcomes for the currently selected flight.</div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <MetricCard label="Spend" value={fmtCurrency(selectedCampaign.spend)} hint={`of ${fmtCurrency(selectedCampaign.budget)}`} tone="green" />
                  <MetricCard label="Pace" value={`${selectedCampaign.pacingPct}%`} hint={selectedCampaign.recommendedBudgetDelta >= 0 ? "In efficient range" : "Budget cut recommended"} tone="orange" />
                </div>
                <div className="mt-3 text-xs font-semibold text-slate-600 dark:text-slate-400">Spend vs budget</div>
                <div className="mt-2"><ProgressBar value={selectedCampaign.pacingPct} accent={selectedCampaign.accent} /></div>
                <div className="mt-3 rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-50">Forecast</div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{selectedCampaign.forecastLabel}</div>
                  <div className="mt-2 text-xs font-semibold" style={{ color: selectedCampaign.recommendedBudgetDelta >= 0 ? EV_GREEN : EV_ORANGE }}>
                    {selectedCampaign.recommendedBudgetDelta >= 0
                      ? `Recommended increase: ${fmtCurrency(selectedCampaign.recommendedBudgetDelta)}`
                      : `Recommended cut: ${fmtCurrency(Math.abs(selectedCampaign.recommendedBudgetDelta))}`}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Unified visibility</div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Linked and standalone campaign mix across the active Beacon portfolio.</div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <MetricCard label="Linked" value={fmtInt(portfolio.linkedCount)} hint="Active and learning linked flights" tone="green" />
                    <MetricCard label="Standalone" value={fmtInt(portfolio.standaloneCount)} hint="Awareness and announcement flights" tone="navy" />
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Creative notes</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedCampaign.surfaceMix.map((surface) => (
                      <Pill key={surface} tone="neutral">{surface}</Pill>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">Top audiences: {selectedCampaign.audienceLeads.join(" · ")}</div>
                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">Languages: {selectedCampaign.languageMix.join(" · ")}</div>
                  <div className="mt-3 flex items-center gap-2">
                    <Btn tone="neutral" onClick={copySummary} left={<Copy className="h-4 w-4" />}>
                      Copy summary
                    </Btn>
                    <Btn tone="ghost" onClick={() => setToast("Creative recommendation pinned for review.")} left={<BadgeCheck className="h-4 w-4" />}>
                      Pin note
                    </Btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={`${selectedCampaign.title} · Full preview`}
        subtitle="Preview how the selected Beacon campaign appears across premium FaithHub promotion surfaces."
      >
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewMode("desktop")}
                className={cx(
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  previewMode === "desktop" ? "text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
                )}
                style={previewMode === "desktop" ? { background: EV_NAVY } : undefined}
              >
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("mobile")}
                className={cx(
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  previewMode === "mobile" ? "text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
                )}
                style={previewMode === "mobile" ? { background: EV_GREEN } : undefined}
              >
                Mobile
              </button>
            </div>

            {previewMode === "desktop" ? <BrowserPreview campaign={selectedCampaign} /> : <PhonePreview campaign={selectedCampaign} />}
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Preview notes</div>
              <div className="mt-3 space-y-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                <div>• Linked and standalone Beacon campaigns use the same premium preview system so teams can compare quality consistently.</div>
                <div>• Creative health warnings and pacing forecasts are preserved beside the preview, so optimization happens with context still visible.</div>
                <div>• Surfaces, languages, and audience mixes should feel native rather than copied blindly across every placement.</div>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Campaign intelligence</div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <MetricCard label="CTR" value={fmtPct(selectedCampaign.ctr)} hint="Creative click-through" tone={selectedCampaign.accent} />
                <MetricCard label="Reach" value={fmtInt(selectedCampaign.reach)} hint="Projected and delivered reach" tone="navy" />
                <MetricCard label="Health" value={`${selectedCampaign.creativeHealth}%`} hint="Visual + copy quality" tone="green" />
                <MetricCard label="Fatigue" value={`${selectedCampaign.fatigueRisk}%`} hint="Higher values need refresh" tone="orange" />
              </div>
              <div className="mt-4 rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-50">Recommended action</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{selectedCampaign.recommendation}</div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {toast ? (
        <div className="fixed bottom-6 inset-x-0 flex justify-center z-[120] pointer-events-none">
          <div className="pointer-events-auto rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-xl dark:bg-slate-100 dark:text-slate-900">
            {toast}
          </div>
        </div>
      ) : null}
    </div>
  );
}










