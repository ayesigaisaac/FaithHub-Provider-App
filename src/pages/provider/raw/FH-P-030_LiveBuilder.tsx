// @ts-nocheck
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  ExternalLink,
  Eye,
  Globe2,
  HeartHandshake,
  Image as ImageIcon,
  Info,
  Layers,
  Link2,
  MessageCircleHeart,
  MessageSquare,
  Mic,
  MonitorPlay,
  Package,
  Plus,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
  Video,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import { navigateWithRouter } from "@/navigation/routerNavigate";

/**
 * FaithHub — Live Builder (Provider)
 * ----------------------------------
 * Design intent:
 * - Keep the same premium page grammar as the Creator base file:
 *   left step rail, center builder workspace, right live preview, mobile preview drawer,
 *   preflight/readiness panel, and top-level action bar.
 * - Rebuild the content model for FaithHub Live Sessions.
 * - Use EVzone Green as primary and Orange as secondary.
 *
 * Notes:
 * - This component is self-contained so it can be dropped into a sandbox or adapted
 *   into the FaithHub codebase without needing project-specific contexts.
 * - Route constants are placeholders that can be mapped to your real app routes.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";

const ROUTES = {
  providerDashboard: "/faithhub/provider/dashboard",
  liveSchedule: "/faithhub/provider/live-schedule",
  liveDashboard: "/faithhub/provider/live-dashboard",
  liveStudio: "/faithhub/provider/live-studio",
  audienceNotifications: "/faithhub/provider/audience-notifications",
  streamToPlatforms: "/faithhub/provider/stream-to-platforms",
};

const SERIES_OPTIONS = [
  { id: "series-1", name: "The Way of Grace" },
  { id: "series-2", name: "Kingdom Builders" },
  { id: "series-3", name: "Living Hope Conference" },
];

const EPISODE_OPTIONS: Record<string, Array<{ id: string; name: string }>> = {
  "series-1": [
    { id: "episode-1", name: "Episode 1 ? Grace That Restores" },
    { id: "episode-2", name: "Episode 2 ? Grace in the Wilderness" },
  ],
  "series-2": [
    { id: "episode-3", name: "Episode 1 ? Called to Build" },
    { id: "episode-4", name: "Episode 2 ? Faithful Hands" },
  ],
  "series-3": [
    { id: "episode-5", name: "Day 1 ? Awakening Faith" },
    { id: "episode-6", name: "Day 2 ? Spirit & Mission" },
  ],
};

const STANDALONE_TEACHINGS = [
  { id: "teach-1", name: "Midweek Prayer & Teaching" },
  { id: "teach-2", name: "Sunday Sermon Special" },
  { id: "teach-3", name: "Marketplace Discipleship Night" },
];

const EVENT_OPTIONS = [
  { id: "event-1", name: "Youth Revival Night" },
  { id: "event-2", name: "Women of Purpose Gathering" },
  { id: "event-3", name: "Leadership Retreat Live Room" },
];

const GIVING_CAMPAIGN_OPTIONS = [
  { id: "fund-1", name: "Mission Expansion Offering" },
  { id: "fund-2", name: "Worship Equipment Seed" },
  { id: "fund-3", name: "Student Sponsorship Drive" },
];

const CROWDFUND_OPTIONS = [
  { id: "crowd-1", name: "School Fees Rescue", progress: 63 },
  { id: "crowd-2", name: "Community Borehole Appeal", progress: 41 },
  { id: "crowd-3", name: "Medical Relief for Families", progress: 77 },
];

const PEOPLE = [
  "Pastor Daniel M.",
  "Minister Ruth K.",
  "Worship Lead Ada",
  "Pastor Samuel A.",
  "Producer Claire N.",
  "Moderator Tobi E.",
  "Interpreter Grace L.",
  "Caption Lead Nathan P.",
  "Support Team - East Campus",
  "Guest Speaker Dr. Lindiwe",
];

const LANGUAGES = [
  "English",
  "Swahili",
  "French",
  "Arabic",
  "Portuguese",
  "Yoruba",
  "Zulu",
];

const CATEGORIES = [
  "Sunday Service",
  "Discipleship Class",
  "Prayer Meeting",
  "Fundraiser",
  "Watch Party",
  "Special Event",
  "Leadership Training",
  "Youth Service",
];

const CHAT_RULE_PRESETS = [
  "Warm and open",
  "Guided with moderators",
  "Slow mode with prayer triage",
  "Q&A first, chat limited",
  "Members and registrants only",
];

const GRAPHICS_PACKAGES = [
  "FaithHub Classic",
  "Revival Night",
  "Conference Premium",
  "Giving Focus",
  "Minimal Studio",
];

const DESTINATION_PRESETS = [
  "FaithHub only",
  "FaithHub + YouTube",
  "FaithHub + YouTube + Facebook",
  "FaithHub + TikTok + Instagram",
  "Global translated session pack",
];

const VISIBILITY_PRESETS = [
  "14 days before start",
  "7 days before start",
  "48 hours before start",
  "At start time only",
  "Replay published",
  "24 hours after end",
  "Manual close",
];

const TIMEZONE_OPTIONS = [
  "Africa/Kampala",
  "Africa/Nairobi",
  "Africa/Johannesburg",
  "Europe/London",
  "America/New_York",
  "UTC",
];

const COVER_LIBRARY = [
  {
    id: "cover-1",
    name: "Sanctuary Light",
    url: "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "cover-2",
    name: "Prayer Circle",
    url: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "cover-3",
    name: "Conference Stage",
    url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "cover-4",
    name: "Scripture & Notes",
    url: "https://images.unsplash.com/photo-1504051771394-dd2e66b2e08f?auto=format&fit=crop&w=1600&q=80",
  },
];

type StepKey =
  | "setup"
  | "identity"
  | "timing"
  | "show"
  | "team"
  | "engagement"
  | "technical"
  | "approvals"
  | "review";

type ParentType =
  | "seriesEpisode"
  | "standaloneTeaching"
  | "event"
  | "givingCampaign"
  | "charityCrowdfund"
  | "standalone";

type LiveTemplate =
  | "weeklyService"
  | "discipleshipClass"
  | "webinar"
  | "fundraiser"
  | "watchParty"
  | "translatedSession"
  | "specialEvent";

type AccessLevel = "public" | "followers" | "members" | "ticketed" | "private";
type StreamMode = "broadcast" | "interactive" | "hybrid";
type LatencyProfile = "standard" | "low" | "ultraLow";
type SegmentType =
  | "Welcome"
  | "Worship"
  | "Sermon"
  | "Donation Moment"
  | "Crowdfund Moment"
  | "Q&A"
  | "Prayer"
  | "Altar Call"
  | "Announcements"
  | "Closing"
  | "Custom";
type SegmentTone = "standard" | "donation" | "crowdfund" | "event";

type RunSegment = {
  id: string;
  type: SegmentType;
  title: string;
  durationMin: number;
  tone: SegmentTone;
  notes: string;
};

type TeamRoles = {
  host: string;
  coHost: string;
  moderator: string;
  producer: string;
  interpreter: string;
  captionOperator: string;
  supportTeam: string;
};

type LiveBuilderDraft = {
  id: string;
  template: LiveTemplate;
  parentType: ParentType;
  linkedSeriesId?: string;
  linkedEpisodeId?: string;
  linkedTeachingId?: string;
  linkedEventId?: string;
  linkedGivingCampaignId?: string;
  linkedCrowdfundId?: string;
  title: string;
  subtitle: string;
  summary: string;
  presenters: string[];
  language: string;
  tags: string[];
  coverUrl: string;
  audiencePromise: string;
  category: string;
  startDateISO: string;
  startTime: string;
  durationMin: number;
  timezone: string;
  registrationRequired: boolean;
  rsvpEnabled: boolean;
  capacity: number;
  accessLevel: AccessLevel;
  payOrTicketEnabled: boolean;
  ticketPrice: string;
  visibilityFrom: string;
  visibilityUntil: string;
  runOfShow: RunSegment[];
  team: TeamRoles;
  engagement: {
    chatRulePreset: string;
    qnaEnabled: boolean;
    pollsEnabled: boolean;
    reactionsEnabled: boolean;
    prayerRequestsEnabled: boolean;
    donationPromptEnabled: boolean;
    donationPromptLabel: string;
    crowdfundInsertEnabled: boolean;
    crowdfundInsertLabel: string;
    productLinksEnabled: boolean;
    productLinksLabel: string;
    eventSignupEnabled: boolean;
    eventSignupLabel: string;
  };
  technical: {
    streamMode: StreamMode;
    latencyProfile: LatencyProfile;
    recordingEnabled: boolean;
    backupPlan: string;
    graphicsPackage: string;
    captioningMode: string;
    translationTracks: string[];
    destinationPreset: string;
    failoverEnabled: boolean;
  };
  approvals: {
    assetsReady: boolean;
    permissionsReady: boolean;
    speakersReady: boolean;
    notesReady: boolean;
    moderationReady: boolean;
    credentialsReady: boolean;
    finalApprovalName: string;
  };
  status: "Draft" | "Ready" | "Scheduled";
};

const STEPS: Array<{ key: StepKey; label: string }> = [
  { key: "setup", label: "Setup" },
  { key: "identity", label: "Session Identity" },
  { key: "timing", label: "Time & Access" },
  { key: "show", label: "Run of Show" },
  { key: "team", label: "Backstage Team" },
  { key: "engagement", label: "Engagement & CTAs" },
  { key: "technical", label: "Technical" },
  { key: "approvals", label: "Checklist & Approvals" },
  { key: "review", label: "Review & Launch" },
];

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2, 8)}`;
}

function defaultToneForSegment(type: SegmentType): SegmentTone {
  if (type === "Donation Moment") return "donation";
  if (type === "Crowdfund Moment") return "crowdfund";
  if (type === "Announcements") return "event";
  return "standard";
}

function makeSegment(type: SegmentType, title: string, durationMin: number, notes = ""): RunSegment {
  return {
    id: createId("seg"),
    type,
    title,
    durationMin,
    tone: defaultToneForSegment(type),
    notes,
  };
}

const TEMPLATE_META: Record<
  LiveTemplate,
  {
    label: string;
    description: string;
    category: string;
    durationMin: number;
    runOfShow: RunSegment[];
    engagement: Partial<LiveBuilderDraft["engagement"]>;
    technical: Partial<LiveBuilderDraft["technical"]>;
  }
> = {
  weeklyService: {
    label: "Weekly Service",
    description: "A premium service flow with worship, teaching, giving, prayer, and closing.",
    category: "Sunday Service",
    durationMin: 90,
    runOfShow: [
      makeSegment("Welcome", "Welcome & call to gather", 8),
      makeSegment("Worship", "Worship set", 20),
      makeSegment("Sermon", "Main sermon", 32),
      makeSegment("Donation Moment", "Giving moment", 6),
      makeSegment("Prayer", "Prayer ministry", 12),
      makeSegment("Announcements", "Announcements & next steps", 7),
      makeSegment("Closing", "Blessing & close", 5),
    ],
    engagement: {
      chatRulePreset: "Guided with moderators",
      qnaEnabled: false,
      pollsEnabled: false,
      reactionsEnabled: true,
      prayerRequestsEnabled: true,
      donationPromptEnabled: true,
      donationPromptLabel: "Support this ministry",
      eventSignupEnabled: true,
      eventSignupLabel: "Join next week in person",
    },
    technical: {
      streamMode: "broadcast",
      latencyProfile: "low",
      graphicsPackage: "FaithHub Classic",
      captioningMode: "Live captions",
      destinationPreset: "FaithHub + YouTube + Facebook",
      failoverEnabled: true,
    },
  },
  discipleshipClass: {
    label: "Discipleship Class",
    description: "Structured teaching flow with registration, notes, and extended Q&A.",
    category: "Discipleship Class",
    durationMin: 75,
    runOfShow: [
      makeSegment("Welcome", "Welcome & framing", 6),
      makeSegment("Sermon", "Teaching block 1", 22),
      makeSegment("Custom", "Reflection and discussion prompt", 8),
      makeSegment("Sermon", "Teaching block 2", 18),
      makeSegment("Q&A", "Questions and answers", 15),
      makeSegment("Closing", "Prayer and assignment", 6),
    ],
    engagement: {
      chatRulePreset: "Q&A first, chat limited",
      qnaEnabled: true,
      pollsEnabled: true,
      reactionsEnabled: true,
      prayerRequestsEnabled: true,
    },
    technical: {
      streamMode: "hybrid",
      latencyProfile: "low",
      graphicsPackage: "Minimal Studio",
      captioningMode: "Live captions",
      destinationPreset: "FaithHub only",
    },
  },
  webinar: {
    label: "Webinar",
    description: "Professional broadcast layout with registration and moderated interaction.",
    category: "Leadership Training",
    durationMin: 60,
    runOfShow: [
      makeSegment("Welcome", "Opening and positioning", 5),
      makeSegment("Sermon", "Presentation", 25),
      makeSegment("Q&A", "Moderated Q&A", 20),
      makeSegment("Announcements", "Offer and next steps", 5),
      makeSegment("Closing", "Wrap and close", 5),
    ],
    engagement: {
      chatRulePreset: "Q&A first, chat limited",
      qnaEnabled: true,
      pollsEnabled: true,
      reactionsEnabled: true,
    },
    technical: {
      streamMode: "broadcast",
      latencyProfile: "standard",
      graphicsPackage: "Conference Premium",
      captioningMode: "Live captions",
      destinationPreset: "FaithHub + YouTube",
    },
  },
  fundraiser: {
    label: "Fundraiser",
    description: "High-touch giving flow with story moments, live progress, and repeated CTAs.",
    category: "Fundraiser",
    durationMin: 70,
    runOfShow: [
      makeSegment("Welcome", "Host welcome and why we are here", 6),
      makeSegment("Custom", "Story of impact", 14),
      makeSegment("Donation Moment", "Primary giving call", 8),
      makeSegment("Crowdfund Moment", "Campaign milestone update", 8),
      makeSegment("Prayer", "Prayer for the cause", 8),
      makeSegment("Donation Moment", "Second giving invitation", 10),
      makeSegment("Closing", "Thank you and next steps", 6),
    ],
    engagement: {
      chatRulePreset: "Slow mode with prayer triage",
      qnaEnabled: true,
      pollsEnabled: true,
      reactionsEnabled: true,
      prayerRequestsEnabled: true,
      donationPromptEnabled: true,
      donationPromptLabel: "Give now",
      crowdfundInsertEnabled: true,
      crowdfundInsertLabel: "Back the campaign",
      eventSignupEnabled: false,
    },
    technical: {
      streamMode: "hybrid",
      latencyProfile: "low",
      graphicsPackage: "Giving Focus",
      captioningMode: "Live captions",
      destinationPreset: "FaithHub + YouTube + Facebook",
      failoverEnabled: true,
    },
  },
  watchParty: {
    label: "Watch Party",
    description: "Community-led watch experience with moderated reactions and light facilitation.",
    category: "Watch Party",
    durationMin: 80,
    runOfShow: [
      makeSegment("Welcome", "Host welcome", 5),
      makeSegment("Custom", "Replay intro", 5),
      makeSegment("Sermon", "Replay or screening block", 45),
      makeSegment("Q&A", "Community reactions and Q&A", 15),
      makeSegment("Closing", "Close and community next steps", 10),
    ],
    engagement: {
      chatRulePreset: "Warm and open",
      qnaEnabled: true,
      pollsEnabled: true,
      reactionsEnabled: true,
      prayerRequestsEnabled: true,
    },
    technical: {
      streamMode: "broadcast",
      latencyProfile: "standard",
      graphicsPackage: "FaithHub Classic",
      captioningMode: "Replay captions",
      destinationPreset: "FaithHub only",
    },
  },
  translatedSession: {
    label: "Translated Session",
    description: "Multi-language session with interpreter and subtitle tracks ready from the start.",
    category: "Special Event",
    durationMin: 90,
    runOfShow: [
      makeSegment("Welcome", "Welcome and language orientation", 7),
      makeSegment("Worship", "Opening set", 18),
      makeSegment("Sermon", "Main message", 32),
      makeSegment("Prayer", "Prayer and response", 12),
      makeSegment("Announcements", "Localized next steps", 8),
      makeSegment("Closing", "Close", 6),
    ],
    engagement: {
      chatRulePreset: "Guided with moderators",
      qnaEnabled: true,
      pollsEnabled: false,
      reactionsEnabled: true,
      prayerRequestsEnabled: true,
    },
    technical: {
      streamMode: "hybrid",
      latencyProfile: "low",
      graphicsPackage: "Conference Premium",
      captioningMode: "Live captions + translation",
      translationTracks: ["English", "Swahili"],
      destinationPreset: "Global translated session pack",
      failoverEnabled: true,
    },
  },
  specialEvent: {
    label: "Special Event",
    description: "Flexible premium flow for revival nights, conferences, or one-off gatherings.",
    category: "Special Event",
    durationMin: 95,
    runOfShow: [
      makeSegment("Welcome", "Opening moment", 8),
      makeSegment("Worship", "Worship set", 18),
      makeSegment("Sermon", "Main event message", 30),
      makeSegment("Q&A", "Panel or response segment", 12),
      makeSegment("Announcements", "Event next step", 10),
      makeSegment("Closing", "Closing prayer", 7),
    ],
    engagement: {
      chatRulePreset: "Guided with moderators",
      qnaEnabled: true,
      pollsEnabled: true,
      reactionsEnabled: true,
      prayerRequestsEnabled: true,
      eventSignupEnabled: true,
      eventSignupLabel: "Register for follow-up sessions",
    },
    technical: {
      streamMode: "hybrid",
      latencyProfile: "low",
      graphicsPackage: "Conference Premium",
      captioningMode: "Live captions",
      destinationPreset: "FaithHub + YouTube + Facebook",
      failoverEnabled: true,
    },
  },
};

function cx(...items: Array<string | false | undefined | null>) {
  return items.filter(Boolean).join(" ");
}

function safeNav(url: string) {
  navigateWithRouter(url);
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatPrettyDate(dateISO: string, timeHHMM: string, timezone: string) {
  const value = new Date(`${dateISO}T${timeHHMM}:00`);
  if (Number.isNaN(value.getTime())) return "Schedule not set";
  return value.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  });
}

function getCountdownParts(dateISO: string, timeHHMM: string) {
  const target = new Date(`${dateISO}T${timeHHMM}:00`).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (24 * 3600 * 1000));
  const hours = Math.floor((diff % (24 * 3600 * 1000)) / (3600 * 1000));
  const minutes = Math.floor((diff % (3600 * 1000)) / (60 * 1000));
  return { days, hours, minutes };
}

function accessLabel(accessLevel: AccessLevel) {
  switch (accessLevel) {
    case "followers":
      return "Followers";
    case "members":
      return "Members";
    case "ticketed":
      return "Ticketed";
    case "private":
      return "Private";
    default:
      return "Public";
  }
}

function getParentLabel(draft: LiveBuilderDraft) {
  switch (draft.parentType) {
    case "seriesEpisode": {
      const series = SERIES_OPTIONS.find((option) => option.id === draft.linkedSeriesId)?.name || "Series";
      const episode = (draft.linkedSeriesId ? EPISODE_OPTIONS[draft.linkedSeriesId] : [])?.find((option) => option.id === draft.linkedEpisodeId)?.name || "Episode";
      return `${series} ? ${episode}`;
    }
    case "standaloneTeaching":
      return STANDALONE_TEACHINGS.find((option) => option.id === draft.linkedTeachingId)?.name || "Standalone teaching";
    case "event":
      return EVENT_OPTIONS.find((option) => option.id === draft.linkedEventId)?.name || "Event-linked live";
    case "givingCampaign":
      return GIVING_CAMPAIGN_OPTIONS.find((option) => option.id === draft.linkedGivingCampaignId)?.name || "Giving campaign";
    case "charityCrowdfund":
      return CROWDFUND_OPTIONS.find((option) => option.id === draft.linkedCrowdfundId)?.name || "Charity crowdfund";
    default:
      return "Standalone live";
  }
}

function buildChecklist(draft: LiveBuilderDraft) {
  return [
    {
      label: "Parent source or standalone logic confirmed",
      ok:
        draft.parentType === "standalone" ||
        (draft.parentType === "seriesEpisode"
          ? Boolean(draft.linkedSeriesId && draft.linkedEpisodeId)
          : draft.parentType === "standaloneTeaching"
            ? Boolean(draft.linkedTeachingId)
            : draft.parentType === "event"
              ? Boolean(draft.linkedEventId)
              : draft.parentType === "givingCampaign"
                ? Boolean(draft.linkedGivingCampaignId)
                : Boolean(draft.linkedCrowdfundId)),
    },
    {
      label: "Session identity complete",
      ok: Boolean(draft.title.trim() && draft.summary.trim() && draft.presenters.length && draft.language && draft.category),
    },
    {
      label: "Time and access ready",
      ok: Boolean(draft.startDateISO && draft.startTime && draft.durationMin > 0 && draft.timezone && draft.accessLevel),
    },
    {
      label: "Run-of-show balanced",
      ok: draft.runOfShow.length > 0 && draft.runOfShow.every((segment) => segment.title.trim() && segment.durationMin > 0),
    },
    {
      label: "Backstage team assigned",
      ok: Boolean(draft.team.host && draft.team.moderator && draft.team.producer),
    },
    {
      label: "Engagement settings set",
      ok: Boolean(draft.engagement.chatRulePreset),
    },
    {
      label: "Technical configuration set",
      ok: Boolean(draft.technical.streamMode && draft.technical.graphicsPackage && draft.technical.destinationPreset),
    },
    {
      label: "Assets confirmed",
      ok: draft.approvals.assetsReady,
    },
    {
      label: "Permissions and speaker approvals confirmed",
      ok: draft.approvals.permissionsReady && draft.approvals.speakersReady,
    },
    {
      label: "Notes, moderation, and destination credentials ready",
      ok: draft.approvals.notesReady && draft.approvals.moderationReady && draft.approvals.credentialsReady,
    },
  ];
}

function buildDefaultDraft(): LiveBuilderDraft {
  const now = new Date();
  now.setHours(now.getHours() + 3, 0, 0, 0);
  const templateMeta = TEMPLATE_META.weeklyService;

  return {
    id: createId("live"),
    template: "weeklyService",
    parentType: "seriesEpisode",
    linkedSeriesId: SERIES_OPTIONS[0].id,
    linkedEpisodeId: EPISODE_OPTIONS[SERIES_OPTIONS[0].id][0].id,
    title: "Sunday Encounter Live",
    subtitle: "A service of worship, word, and ministry",
    summary:
      "Bring your community into a premium live experience with worship, teaching, prayer, and a guided next step for those joining online.",
    presenters: ["Pastor Daniel M.", "Worship Lead Ada"],
    language: "English",
    tags: ["Sunday", "Live", "Prayer", "Word"],
    coverUrl: COVER_LIBRARY[0].url,
    audiencePromise:
      "A clear, hope-filled service with room for worship, biblical teaching, prayer response, and practical next steps.",
    category: templateMeta.category,
    startDateISO: toISODate(now),
    startTime: `${pad2(now.getHours())}:${pad2(now.getMinutes())}`,
    durationMin: templateMeta.durationMin,
    timezone: "Africa/Kampala",
    registrationRequired: false,
    rsvpEnabled: true,
    capacity: 1500,
    accessLevel: "public",
    payOrTicketEnabled: false,
    ticketPrice: "",
    visibilityFrom: "14 days before start",
    visibilityUntil: "Replay published",
    runOfShow: templateMeta.runOfShow.map((segment) => ({ ...segment, id: createId("seg") })),
    team: {
      host: "Pastor Daniel M.",
      coHost: "Minister Ruth K.",
      moderator: "Moderator Tobi E.",
      producer: "Producer Claire N.",
      interpreter: "Interpreter Grace L.",
      captionOperator: "Caption Lead Nathan P.",
      supportTeam: "Support Team - East Campus",
    },
    engagement: {
      chatRulePreset: templateMeta.engagement.chatRulePreset || "Guided with moderators",
      qnaEnabled: templateMeta.engagement.qnaEnabled ?? false,
      pollsEnabled: templateMeta.engagement.pollsEnabled ?? false,
      reactionsEnabled: templateMeta.engagement.reactionsEnabled ?? true,
      prayerRequestsEnabled: templateMeta.engagement.prayerRequestsEnabled ?? true,
      donationPromptEnabled: templateMeta.engagement.donationPromptEnabled ?? true,
      donationPromptLabel: templateMeta.engagement.donationPromptLabel || "Support this ministry",
      crowdfundInsertEnabled: templateMeta.engagement.crowdfundInsertEnabled ?? false,
      crowdfundInsertLabel: templateMeta.engagement.crowdfundInsertLabel || "Back the campaign",
      productLinksEnabled: false,
      productLinksLabel: "FaithMart resources",
      eventSignupEnabled: templateMeta.engagement.eventSignupEnabled ?? true,
      eventSignupLabel: templateMeta.engagement.eventSignupLabel || "Register for next week",
    },
    technical: {
      streamMode: templateMeta.technical.streamMode || "broadcast",
      latencyProfile: templateMeta.technical.latencyProfile || "low",
      recordingEnabled: true,
      backupPlan: "Secondary laptop encoder + mobile hotspot",
      graphicsPackage: templateMeta.technical.graphicsPackage || "FaithHub Classic",
      captioningMode: templateMeta.technical.captioningMode || "Live captions",
      translationTracks: templateMeta.technical.translationTracks || [],
      destinationPreset: templateMeta.technical.destinationPreset || "FaithHub only",
      failoverEnabled: templateMeta.technical.failoverEnabled ?? true,
    },
    approvals: {
      assetsReady: true,
      permissionsReady: false,
      speakersReady: true,
      notesReady: true,
      moderationReady: true,
      credentialsReady: false,
      finalApprovalName: "",
    },
    status: "Draft",
  };
}

function useIsMobile(breakpointPx = 1024) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () =>
      setIsMobile(
        typeof window !== "undefined" ? window.innerWidth < breakpointPx : false,
      );
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [breakpointPx]);
  return isMobile;
}

function Pill({
  children,
  tone = "neutral",
  icon,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green" | "orange" | "danger";
  icon?: React.ReactNode;
}) {
  const styles =
    tone === "green"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
      : tone === "orange"
        ? "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
        : tone === "danger"
          ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-300"
          : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300";

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        styles,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

function SoftButton({
  children,
  onClick,
  disabled,
  className,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-[12px] font-semibold transition-colors",
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
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
  disabled,
  secondary,
  title,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  secondary?: boolean;
  title?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-[12px] font-semibold text-white transition-all",
        disabled ? "cursor-not-allowed opacity-60" : "hover:opacity-95",
        className,
      )}
      style={{
        background: secondary ? EV_ORANGE : EV_GREEN,
        borderColor: secondary ? EV_ORANGE : EV_GREEN,
      }}
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
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_10px_32px_rgba(15,23,42,0.04)] transition-colors dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">{title}</div>
          {subtitle ? <div className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">{subtitle}</div> : null}
        </div>
        {right}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{children}</div>;
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 outline-none transition-colors focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-emerald-900/30"
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-900 outline-none transition-colors focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-emerald-900/30"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 outline-none transition-colors focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-emerald-900/30"
    />
  );
}

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cx(
        "w-full rounded-3xl border p-3 text-left transition-colors",
        checked
          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
          : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">{label}</div>
          {hint ? <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{hint}</div> : null}
        </div>
        <div
          className={cx(
            "flex h-6 w-10 items-center rounded-full border px-1 transition-colors",
            checked
              ? "justify-end border-emerald-500 bg-emerald-500"
              : "justify-start border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-700",
          )}
        >
          <span className="h-4 w-4 rounded-full bg-white shadow" />
        </div>
      </div>
    </button>
  );
}

function StatusRow({ label, status }: { label: string; status: "ok" | "needed" }) {
  const tone = status === "ok"
    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
    : "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300";
  return (
    <div className="flex items-center justify-between gap-2 py-2 min-h-[44px]">
      <div className="text-[12px] text-slate-700 dark:text-slate-300">{label}</div>
      <span className={cx("px-3 py-1 rounded-full border text-[11px] font-semibold min-w-[72px] inline-flex items-center justify-center", tone)}>
        {status === "ok" ? "OK" : "Needed"}
      </span>
    </div>
  );
}

function ReadinessCard({ checklist }: { checklist: Array<{ label: string; ok: boolean }> }) {
  const complete = checklist.filter((item) => item.ok).length;
  const percentage = Math.round((complete / checklist.length) * 100);
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_10px_32px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">Pre-live readiness</div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Premium live production checklist</div>
        </div>
        <Pill tone={percentage >= 80 ? "green" : percentage >= 55 ? "orange" : "danger"}>{percentage}% ready</Pill>
      </div>
      <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full rounded-full transition-all" style={{ width: `${percentage}%`, background: percentage >= 80 ? EV_GREEN : percentage >= 55 ? EV_ORANGE : "#ef4444" }} />
      </div>
      <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
        {checklist.slice(0, 5).map((item) => (
          <StatusRow key={item.label} label={item.label} status={item.ok ? "ok" : "needed"} />
        ))}
      </div>
    </div>
  );
}

function StepNav({ active, onChange, readiness }: { active: StepKey; onChange: (step: StepKey) => void; readiness: number }) {
  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-[0_10px_32px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">Live Builder</div>
            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">FaithHub provider workflow</div>
          </div>
          <Pill tone={readiness >= 80 ? "green" : readiness >= 55 ? "orange" : "danger"}>{readiness}% ready</Pill>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-[0_10px_32px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-950">
        <div className="space-y-1">
          {STEPS.map((step) => {
            const activeStyles = active === step.key
              ? "border-emerald-200 bg-emerald-50 text-slate-900 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-slate-100"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800";
            return (
              <button
                key={step.key}
                type="button"
                onClick={() => onChange(step.key)}
                className={cx("flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left text-[12px] font-semibold transition-colors", activeStyles)}
              >
                <span>{step.label}</span>
                {active === step.key ? <ChevronRight className="h-4 w-4" /> : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function QuickStatsCard({ draft }: { draft: LiveBuilderDraft }) {
  const totalDuration = draft.runOfShow.reduce((sum, item) => sum + item.durationMin, 0);
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_10px_32px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-950">
      <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">Live at a glance</div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <MiniStat label="Parent" value={draft.parentType === "standalone" ? "Standalone" : "Linked"} />
        <MiniStat label="Template" value={TEMPLATE_META[draft.template].label} />
        <MiniStat label="Segments" value={String(draft.runOfShow.length)} />
        <MiniStat label="Allocated" value={`${totalDuration}m`} />
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
      <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">{label}</div>
      <div className="mt-1 text-[13px] font-bold text-slate-900 dark:text-slate-100">{value}</div>
    </div>
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{title}</div>
      <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}

function TemplateCard({
  template,
  selected,
  onSelect,
}: {
  template: LiveTemplate;
  selected: boolean;
  onSelect: (template: LiveTemplate) => void;
}) {
  const meta = TEMPLATE_META[template];
  return (
    <button
      type="button"
      onClick={() => onSelect(template)}
      className={cx(
        "rounded-[24px] border p-4 text-left transition-colors",
        selected
          ? "border-emerald-200 bg-emerald-50 shadow-[0_8px_24px_rgba(3,205,140,0.08)] dark:border-emerald-800 dark:bg-emerald-900/20"
          : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">{meta.label}</div>
        {selected ? <Pill tone="green">Selected</Pill> : null}
      </div>
      <div className="mt-2 text-[11px] leading-5 text-slate-500 dark:text-slate-400">{meta.description}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Pill>{meta.category}</Pill>
        <Pill>{meta.durationMin} min</Pill>
      </div>
    </button>
  );
}

function ParentTypeCard({
  title,
  description,
  selected,
  onClick,
}: {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "rounded-[24px] border p-4 text-left transition-colors",
        selected
          ? "border-emerald-200 bg-emerald-50 shadow-[0_8px_24px_rgba(3,205,140,0.08)] dark:border-emerald-800 dark:bg-emerald-900/20"
          : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800",
      )}
    >
      <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">{title}</div>
      <div className="mt-2 text-[11px] leading-5 text-slate-500 dark:text-slate-400">{description}</div>
    </button>
  );
}

function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  zIndex,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  zIndex?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const originalBodyOverflow = document.body.style.overflow;
    const originalDocOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalDocOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0" style={{ zIndex: zIndex || 100 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="absolute inset-0 bg-slate-50 dark:bg-slate-950 shadow-2xl flex flex-col"
          >
            <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="px-4 py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold truncate text-slate-900 dark:text-slate-100">{title}</div>
                  {subtitle ? <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{subtitle}</div> : null}
                </div>
                <button
                  className="h-9 w-9 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 grid place-items-center"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <X className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

function TimeChip({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl bg-white/12 px-2 py-1 text-center text-white shadow-sm backdrop-blur">
      <div className="text-sm font-extrabold tabular-nums">{pad2(value)}</div>
      <div className="text-[10px] uppercase tracking-[0.14em] text-white/75">{label}</div>
    </div>
  );
}

function SmallStatusChip({ label, color }: { label: string; color: "green" | "orange" | "neutral" }) {
  return (
    <span
      className={cx(
        "rounded-full px-2 py-1 text-[10px] font-semibold",
        color === "green"
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
          : color === "orange"
            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      )}
    >
      {label}
    </span>
  );
}

function PreviewCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-[24px] bg-white p-3 shadow-sm ring-1 ring-slate-100 dark:bg-slate-950 dark:ring-slate-800">
      <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-900 dark:text-slate-100">{icon}{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function PreviewPhone({ draft, readiness }: { draft: LiveBuilderDraft; readiness: number }) {
  const linkedParent = useMemo(() => getParentLabel(draft), [draft]);
  const countdown = getCountdownParts(draft.startDateISO, draft.startTime);
  const firstSegments = draft.runOfShow.slice(0, 6);
  const crowdfund = CROWDFUND_OPTIONS.find((item) => item.id === draft.linkedCrowdfundId);

  return (
    <div className="rounded-[30px] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div>
          <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">Audience Preview</div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Mirrors a premium waiting-room/live landing view</div>
        </div>
        <Pill tone={draft.status === "Scheduled" ? "green" : draft.status === "Ready" ? "orange" : "neutral"}>{draft.status}</Pill>
      </div>

      <div className="mx-auto max-w-[420px] px-3 py-4">
        <div className="rounded-[34px] bg-black p-3 shadow-[0_18px_60px_rgba(0,0,0,0.32)]">
          <div className="overflow-hidden rounded-[28px] bg-slate-50 dark:bg-slate-950">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-white/90 px-3 py-2 backdrop-blur dark:bg-slate-950/90">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{draft.title || "Untitled live session"}</div>
                <div className="truncate text-[11px] text-slate-500 dark:text-slate-400">FaithHub Live Sessions</div>
              </div>
              <button
                type="button"
                className="rounded-xl border-2 px-2 py-1 text-[11px] font-bold"
                style={{ borderColor: EV_GREEN, color: EV_GREEN }}
                onClick={() => navigator.clipboard?.writeText(window.location.href)}>
                Share
              </button>
            </div>

            <div className="max-h-[760px] overflow-y-auto pb-6">
              <div className="relative mx-3 mt-3 overflow-hidden rounded-[28px] bg-slate-900 text-white">
                <img src={draft.coverUrl} alt={draft.title} className="h-[220px] w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                <div className="absolute left-3 top-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-1 text-[10px] font-bold backdrop-blur">
                    <Radio className="h-3.5 w-3.5" /> Scheduled
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-1 text-[10px] font-bold backdrop-blur">
                    {linkedParent}
                  </span>
                </div>
                <div className="absolute right-3 top-3 flex gap-1.5">
                  <TimeChip value={countdown.days} label="Days" />
                  <TimeChip value={countdown.hours} label="Hours" />
                  <TimeChip value={countdown.minutes} label="Min" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-lg font-extrabold leading-tight">{draft.title}</div>
                  {draft.subtitle ? <div className="mt-1 text-sm text-white/90">{draft.subtitle}</div> : null}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/12 px-2 py-1 text-[10px] font-semibold backdrop-blur">{draft.category}</span>
                    <span className="rounded-full bg-white/12 px-2 py-1 text-[10px] font-semibold backdrop-blur">{draft.language}</span>
                    <span className="rounded-full bg-white/12 px-2 py-1 text-[10px] font-semibold backdrop-blur">{accessLabel(draft.accessLevel)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-3 px-3">
                <PreviewCard title="Time & access" icon={<Calendar className="h-4 w-4" />}>
                  <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">{formatPrettyDate(draft.startDateISO, draft.startTime, draft.timezone)}</div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {draft.durationMin} minutes ? {draft.timezone} ? {draft.registrationRequired ? "Registration required" : draft.rsvpEnabled ? "RSVP open" : "Open entry"}
                  </div>
                  {draft.payOrTicketEnabled ? (
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                      <Ticket className="h-3 w-3" /> Ticketed ? {draft.ticketPrice || "Price set in checkout"}
                    </div>
                  ) : null}
                </PreviewCard>

                <PreviewCard title="Presenters" icon={<Mic className="h-4 w-4" />}>
                  <div className="flex flex-wrap gap-2">
                    {draft.presenters.map((person) => (
                      <span key={person} className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                        <BadgeCheck className="h-3 w-3" /> {person}
                      </span>
                    ))}
                  </div>
                </PreviewCard>

                <PreviewCard title="Audience promise" icon={<Sparkles className="h-4 w-4" />}>
                  <div className="text-[12px] leading-5 text-slate-700 dark:text-slate-300">{draft.audiencePromise || draft.summary || "Add an audience promise to show what this live session offers."}</div>
                </PreviewCard>

                <PreviewCard title="Run of show" icon={<Layers className="h-4 w-4" />}>
                  <div className="space-y-2">
                    {firstSegments.map((segment, index) => (
                      <div key={segment.id} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                        <div className="min-w-0">
                          <div className="text-[11px] font-semibold text-slate-900 dark:text-slate-100">{index + 1}. {segment.title}</div>
                          <div className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">{segment.type}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {segment.tone === "donation" ? <span className="rounded-full bg-orange-100 px-2 py-1 text-[10px] font-bold text-orange-700 dark:bg-orange-900/20 dark:text-orange-300">Donate</span> : null}
                          {segment.tone === "crowdfund" ? <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">Crowdfund</span> : null}
                          {segment.tone === "event" ? <span className="rounded-full bg-slate-200 px-2 py-1 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">CTA</span> : null}
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{segment.durationMin}m</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </PreviewCard>

                <PreviewCard title="Live tools" icon={<MessageSquare className="h-4 w-4" />}>
                  <div className="flex flex-wrap gap-2">
                    {draft.engagement.reactionsEnabled ? <SmallStatusChip label="Reactions" color="green" /> : null}
                    {draft.engagement.qnaEnabled ? <SmallStatusChip label="Q&A" color="green" /> : null}
                    {draft.engagement.pollsEnabled ? <SmallStatusChip label="Polls" color="green" /> : null}
                    {draft.engagement.prayerRequestsEnabled ? <SmallStatusChip label="Prayer requests" color="orange" /> : null}
                    <SmallStatusChip label={draft.engagement.chatRulePreset} color="neutral" />
                  </div>
                  {draft.technical.translationTracks.length ? (
                    <div className="mt-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      Translation tracks: {draft.technical.translationTracks.join(", ")}
                    </div>
                  ) : null}
                </PreviewCard>

                {draft.engagement.crowdfundInsertEnabled && crowdfund ? (
                  <PreviewCard title="Campaign moment" icon={<HeartHandshake className="h-4 w-4" />}>
                    <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">{crowdfund.name}</div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{draft.engagement.crowdfundInsertLabel}</div>
                    <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-full rounded-full" style={{ width: `${crowdfund.progress}%`, background: EV_GREEN }} />
                    </div>
                    <div className="mt-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">{crowdfund.progress}% funded</div>
                  </PreviewCard>
                ) : null}

                <div className="rounded-[24px] bg-white p-3 shadow-sm ring-1 ring-slate-100 dark:bg-slate-950 dark:ring-slate-800">
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Readiness</div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[15px] font-extrabold text-slate-900 dark:text-slate-100">{readiness}% ready</div>
                      <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Pre-live checklist and approvals are tracked in real time.</div>
                    </div>
                    <div className="grid h-14 w-14 place-items-center rounded-full border-4 border-emerald-100 bg-emerald-50 text-[12px] font-black text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-300">
                      {readiness}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 px-3 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
              <div className="flex gap-2">
                <button className="flex-1 rounded-2xl px-3 py-3 text-[12px] font-extrabold text-white" style={{ background: EV_GREEN }} onClick={() => safeNav("/faithhub/provider/live-dashboard")}>
                  Join live
                </button>
                {draft.engagement.donationPromptEnabled ? (
                  <button className="flex-1 rounded-2xl px-3 py-3 text-[12px] font-extrabold text-white" style={{ background: EV_ORANGE }} onClick={() => safeNav("/faithhub/provider/donations-and-funds")}>
                    {draft.engagement.donationPromptLabel || "Donate"}
                  </button>
                ) : null}
                {draft.engagement.prayerRequestsEnabled ? (
                  <button className="rounded-2xl border-2 px-3 py-3 text-[12px] font-extrabold" style={{ borderColor: EV_GREEN, color: EV_GREEN }} onClick={() => safeNav("/faithhub/provider/prayer-requests")}>
                    Prayer
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 2600);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        className="fixed bottom-4 left-1/2 z-[120] -translate-x-1/2 rounded-2xl bg-slate-900 px-4 py-3 text-[12px] font-semibold text-white shadow-2xl"
      >
        {message}
      </motion.div>
    </AnimatePresence>
  );
}

function SetupStep({
  draft,
  setDraft,
  applyTemplate,
}: {
  draft: LiveBuilderDraft;
  setDraft: React.Dispatch<React.SetStateAction<LiveBuilderDraft>>;
  applyTemplate: (template: LiveTemplate) => void;
}) {
  return (
    <div className="space-y-4">
      <Card
        title="Reusable live templates"
        subtitle="Use premium presets for weekly service, discipleship class, webinar, fundraiser, watch party, translated session, or special event."
        right={<Pill tone="green" icon={<Wand2 className="h-3.5 w-3.5" />}>Templates preserve run-of-show</Pill>}
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {(Object.keys(TEMPLATE_META) as LiveTemplate[]).map((template) => (
            <TemplateCard
              key={template}
              template={template}
              selected={draft.template === template}
              onSelect={applyTemplate}
            />
          ))}
        </div>
      </Card>

      <Card
        title="Parent source selector"
        subtitle="A Live Session can be linked to a Series Episode, standalone teaching, event, giving campaign, charity crowdfund, or left as a true standalone live."
        right={<Pill tone="orange" icon={<Info className="h-3.5 w-3.5" />}>Optional parent logic</Pill>}
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <ParentTypeCard title="Series + Episode" description="Tie the session to structured content inside a teaching campaign." selected={draft.parentType === "seriesEpisode"} onClick={() => setDraft((d) => ({ ...d, parentType: "seriesEpisode" }))} />
          <ParentTypeCard title="Standalone Teaching" description="Run the session under a one-off sermon or teaching that is not part of a Series." selected={draft.parentType === "standaloneTeaching"} onClick={() => setDraft((d) => ({ ...d, parentType: "standaloneTeaching" }))} />
          <ParentTypeCard title="Event" description="Attach the session to a retreat, conference, prayer night, or special gathering." selected={draft.parentType === "event"} onClick={() => setDraft((d) => ({ ...d, parentType: "event" }))} />
          <ParentTypeCard title="Giving Campaign" description="Create a giving-focused live moment that is anchored to a standard fund or appeal." selected={draft.parentType === "givingCampaign"} onClick={() => setDraft((d) => ({ ...d, parentType: "givingCampaign" }))} />
          <ParentTypeCard title="Charity Crowdfund" description="Drive a story-based crowdfund with progress, milestones, and urgency inside the live experience." selected={draft.parentType === "charityCrowdfund"} onClick={() => setDraft((d) => ({ ...d, parentType: "charityCrowdfund" }))} />
          <ParentTypeCard title="Pure Standalone Live" description="Launch a live session with no content parent at all — ideal for announcements, prayer, or spontaneous moments." selected={draft.parentType === "standalone"} onClick={() => setDraft((d) => ({ ...d, parentType: "standalone" }))} />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {draft.parentType === "seriesEpisode" ? (
            <>
              <div>
                <Label>Series</Label>
                <Select
                  value={draft.linkedSeriesId || ""}
                  onChange={(value) => setDraft((d) => ({ ...d, linkedSeriesId: value, linkedEpisodeId: EPISODE_OPTIONS[value]?.[0]?.id }))}
                  options={SERIES_OPTIONS.map((option) => ({ value: option.id, label: option.name }))}
                />
              </div>
              <div>
                <Label>Episode</Label>
                <Select
                  value={draft.linkedEpisodeId || ""}
                  onChange={(value) => setDraft((d) => ({ ...d, linkedEpisodeId: value }))}
                  options={((draft.linkedSeriesId ? EPISODE_OPTIONS[draft.linkedSeriesId] : []) || []).map((option) => ({ value: option.id, label: option.name }))}
                />
              </div>
            </>
          ) : null}

          {draft.parentType === "standaloneTeaching" ? (
            <div className="md:col-span-2">
              <Label>Standalone teaching</Label>
              <Select
                value={draft.linkedTeachingId || ""}
                onChange={(value) => setDraft((d) => ({ ...d, linkedTeachingId: value }))}
                options={STANDALONE_TEACHINGS.map((option) => ({ value: option.id, label: option.name }))}
              />
            </div>
          ) : null}

          {draft.parentType === "event" ? (
            <div className="md:col-span-2">
              <Label>Event</Label>
              <Select
                value={draft.linkedEventId || ""}
                onChange={(value) => setDraft((d) => ({ ...d, linkedEventId: value }))}
                options={EVENT_OPTIONS.map((option) => ({ value: option.id, label: option.name }))}
              />
            </div>
          ) : null}

          {draft.parentType === "givingCampaign" ? (
            <div className="md:col-span-2">
              <Label>Giving campaign</Label>
              <Select
                value={draft.linkedGivingCampaignId || ""}
                onChange={(value) => setDraft((d) => ({ ...d, linkedGivingCampaignId: value }))}
                options={GIVING_CAMPAIGN_OPTIONS.map((option) => ({ value: option.id, label: option.name }))}
              />
            </div>
          ) : null}

          {draft.parentType === "charityCrowdfund" ? (
            <div className="md:col-span-2">
              <Label>Charity crowdfund</Label>
              <Select
                value={draft.linkedCrowdfundId || ""}
                onChange={(value) => setDraft((d) => ({ ...d, linkedCrowdfundId: value, engagement: { ...d.engagement, crowdfundInsertEnabled: true } }))}
                options={CROWDFUND_OPTIONS.map((option) => ({ value: option.id, label: option.name }))}
              />
            </div>
          ) : null}
        </div>
      </Card>

      <Card title="Premium build notes" subtitle="Keep the builder fast, flexible, and production-aware from the first step.">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 text-emerald-700 dark:text-emerald-300" />
              <div>
                <div className="text-[12px] font-semibold text-emerald-900 dark:text-emerald-100">True optional parent logic</div>
                <div className="mt-1 text-[11px] leading-5 text-emerald-800 dark:text-emerald-300">Providers can build from structure when they need it, or go fully standalone when the ministry moment should move faster than the content hierarchy.</div>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
            <div className="flex items-start gap-3">
              <Zap className="mt-0.5 h-5 w-5 text-orange-700 dark:text-orange-300" />
              <div>
                <div className="text-[12px] font-semibold text-orange-900 dark:text-orange-100">Instant downstream handoff</div>
                <div className="mt-1 text-[11px] leading-5 text-orange-800 dark:text-orange-300">Template, schedule, engagement, and technical settings remain intact when the provider moves into Live Schedule, Audience Notifications, or Studio Setup.</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function IdentityStep({ draft, setDraft }: { draft: LiveBuilderDraft; setDraft: React.Dispatch<React.SetStateAction<LiveBuilderDraft>> }) {
  return (
    <div className="space-y-4">
      <Card title="Session identity block" subtitle="Define the title, promise, presenters, language, tags, cover, and category that shape how this live session is understood by the audience.">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label>Live session title</Label>
            <Input value={draft.title} onChange={(value) => setDraft((d) => ({ ...d, title: value }))} placeholder="e.g. Sunday Encounter Live" />
          </div>
          <div className="md:col-span-2">
            <Label>Subtitle</Label>
            <Input value={draft.subtitle} onChange={(value) => setDraft((d) => ({ ...d, subtitle: value }))} placeholder="e.g. A service of worship, word, and ministry" />
          </div>
          <div className="md:col-span-2">
            <Label>Session summary</Label>
            <TextArea value={draft.summary} onChange={(value) => setDraft((d) => ({ ...d, summary: value }))} placeholder="What is this session about?" rows={4} />
          </div>
          <div>
            <Label>Language</Label>
            <Select value={draft.language} onChange={(value) => setDraft((d) => ({ ...d, language: value }))} options={LANGUAGES.map((lang) => ({ value: lang, label: lang }))} />
          </div>
          <div>
            <Label>Session category</Label>
            <Select value={draft.category} onChange={(value) => setDraft((d) => ({ ...d, category: value }))} options={CATEGORIES.map((item) => ({ value: item, label: item }))} />
          </div>
          <div className="md:col-span-2">
            <Label>Audience promise</Label>
            <TextArea value={draft.audiencePromise} onChange={(value) => setDraft((d) => ({ ...d, audiencePromise: value }))} placeholder="What will someone experience or receive if they join?" rows={3} />
          </div>
          <div className="md:col-span-2">
            <Label>Tags (comma separated)</Label>
            <Input value={draft.tags.join(", ")} onChange={(value) => setDraft((d) => ({ ...d, tags: value.split(",").map((item) => item.trim()).filter(Boolean).slice(0, 8) }))} placeholder="Prayer, Word, Healing, Youth" />
          </div>
        </div>
      </Card>

      <Card title="Presenters" subtitle="Add the visible faces of the session — sermon lead, host, worship lead, or guests.">
        <div className="flex flex-wrap gap-2">
          {PEOPLE.map((person) => {
            const selected = draft.presenters.includes(person);
            return (
              <button
                key={person}
                type="button"
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    presenters: selected ? d.presenters.filter((item) => item !== person) : [...d.presenters, person],
                  }))
                }
                className={cx(
                  "rounded-full border px-3 py-2 text-[12px] font-semibold transition-colors",
                  selected
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
                )}
              >
                {selected ? <Check className="mr-1 inline h-3.5 w-3.5" /> : null}
                {person}
              </button>
            );
          })}
        </div>
      </Card>

      <Card title="Visual cover" subtitle="Choose a premium hero image for the waiting room and live landing experience.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {COVER_LIBRARY.map((cover) => {
            const selected = draft.coverUrl === cover.url;
            return (
              <button
                key={cover.id}
                type="button"
                onClick={() => setDraft((d) => ({ ...d, coverUrl: cover.url }))}
                className={cx(
                  "overflow-hidden rounded-[24px] border text-left transition-colors",
                  selected ? "border-emerald-300 shadow-[0_8px_24px_rgba(3,205,140,0.12)]" : "border-slate-200 dark:border-slate-700",
                )}
              >
                <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-900">
                  <img src={cover.url} alt={cover.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 dark:bg-slate-950">
                  <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">{cover.name}</div>
                  {selected ? <Pill tone="green">Live</Pill> : null}
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function TimingStep({ draft, setDraft }: { draft: LiveBuilderDraft; setDraft: React.Dispatch<React.SetStateAction<LiveBuilderDraft>> }) {
  return (
    <div className="space-y-4">
      <Card title="Time and access workspace" subtitle="Set schedule, audience entry rules, capacity, access level, ticketing, and visibility windows.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <Label>Start date</Label>
            <Input type="date" value={draft.startDateISO} onChange={(value) => setDraft((d) => ({ ...d, startDateISO: value }))} />
          </div>
          <div>
            <Label>Start time</Label>
            <Input type="time" value={draft.startTime} onChange={(value) => setDraft((d) => ({ ...d, startTime: value }))} />
          </div>
          <div>
            <Label>Duration (minutes)</Label>
            <Input type="number" value={draft.durationMin} onChange={(value) => setDraft((d) => ({ ...d, durationMin: Math.max(15, Number(value || 0)) }))} placeholder="90" />
          </div>
          <div>
            <Label>Timezone</Label>
            <Select value={draft.timezone} onChange={(value) => setDraft((d) => ({ ...d, timezone: value }))} options={TIMEZONE_OPTIONS.map((tz) => ({ value: tz, label: tz }))} />
          </div>
        </div>

        <SectionDivider title="Access & participation" />

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <Label>Access level</Label>
            <Select
              value={draft.accessLevel}
              onChange={(value) => setDraft((d) => ({ ...d, accessLevel: value as AccessLevel }))}
              options={[
                { value: "public", label: "Public" },
                { value: "followers", label: "Followers" },
                { value: "members", label: "Members" },
                { value: "ticketed", label: "Ticketed" },
                { value: "private", label: "Private" },
              ]}
            />
          </div>
          <div>
            <Label>Capacity</Label>
            <Input type="number" value={draft.capacity} onChange={(value) => setDraft((d) => ({ ...d, capacity: Math.max(0, Number(value || 0)) }))} placeholder="1500" />
          </div>
          <div>
            <Label>Visible from</Label>
            <Select value={draft.visibilityFrom} onChange={(value) => setDraft((d) => ({ ...d, visibilityFrom: value }))} options={VISIBILITY_PRESETS.map((item) => ({ value: item, label: item }))} />
          </div>
          <div>
            <Label>Visible until</Label>
            <Select value={draft.visibilityUntil} onChange={(value) => setDraft((d) => ({ ...d, visibilityUntil: value }))} options={VISIBILITY_PRESETS.map((item) => ({ value: item, label: item }))} />
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <Toggle checked={draft.registrationRequired} onChange={(value) => setDraft((d) => ({ ...d, registrationRequired: value }))} label="Registration required" hint="Require people to register before joining the session." />
          <Toggle checked={draft.rsvpEnabled} onChange={(value) => setDraft((d) => ({ ...d, rsvpEnabled: value }))} label="RSVP enabled" hint="Let the audience signal intent before the session starts." />
          <Toggle checked={draft.payOrTicketEnabled || draft.accessLevel === "ticketed"} onChange={(value) => setDraft((d) => ({ ...d, payOrTicketEnabled: value, accessLevel: value ? "ticketed" : d.accessLevel === "ticketed" ? "public" : d.accessLevel }))} label="Pay or ticket gate" hint="Use tickets or paid access for the session where relevant." />
        </div>

        {draft.payOrTicketEnabled || draft.accessLevel === "ticketed" ? (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div>
              <Label>Ticket or pay amount</Label>
              <Input value={draft.ticketPrice} onChange={(value) => setDraft((d) => ({ ...d, ticketPrice: value }))} placeholder="e.g. $10 or Member Pass" />
            </div>
            <div className="rounded-3xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
              <div className="flex items-start gap-3">
                <Ticket className="mt-0.5 h-5 w-5 text-orange-700 dark:text-orange-300" />
                <div>
                  <div className="text-[12px] font-semibold text-orange-900 dark:text-orange-100">Ticketing ready</div>
                  <div className="mt-1 text-[11px] leading-5 text-orange-800 dark:text-orange-300">This session can be packaged for paid or invite-only access while still preserving a premium waiting-room and follow-up experience.</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  );
}

function RunOfShowRow({
  segment,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  segment: RunSegment;
  index: number;
  total: number;
  onChange: (segment: RunSegment) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 min-w-[34px] items-center justify-center rounded-full bg-slate-900 px-3 text-[11px] font-black text-white dark:bg-slate-700">{index + 1}</span>
          <Pill tone={segment.tone === "donation" ? "orange" : segment.tone === "crowdfund" ? "green" : "neutral"}>{segment.type}</Pill>
        </div>
        <div className="flex items-center gap-2">
          <SoftButton onClick={onMoveUp} disabled={index === 0} className="px-3 py-2">??? ?</SoftButton>
          <SoftButton onClick={onMoveDown} disabled={index === total - 1} className="px-3 py-2">??? ?</SoftButton>
          <button type="button" onClick={onRemove} className="grid h-9 w-9 place-items-center rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800">
            <X className="h-4 w-4 text-slate-700 dark:text-slate-300" />
          </button>
        </div>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div className="md:col-span-2">
          <Label>Segment title</Label>
          <Input value={segment.title} onChange={(value) => onChange({ ...segment, title: value })} placeholder="Segment title" />
        </div>
        <div>
          <Label>Duration (minutes)</Label>
          <Input type="number" value={segment.durationMin} onChange={(value) => onChange({ ...segment, durationMin: Math.max(1, Number(value || 0)) })} placeholder="5" />
        </div>
        <div>
          <Label>Segment type</Label>
          <Select
            value={segment.type}
            onChange={(value) => onChange({ ...segment, type: value as SegmentType, tone: defaultToneForSegment(value as SegmentType) })}
            options={[
              "Welcome",
              "Worship",
              "Sermon",
              "Donation Moment",
              "Crowdfund Moment",
              "Q&A",
              "Prayer",
              "Altar Call",
              "Announcements",
              "Closing",
              "Custom",
            ].map((item) => ({ value: item, label: item }))}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Notes</Label>
          <TextArea value={segment.notes} onChange={(value) => onChange({ ...segment, notes: value })} rows={2} placeholder="Producer notes, host cues, scripture references, or CTA instructions" />
        </div>
      </div>
    </div>
  );
}

function RunOfShowStep({ draft, setDraft }: { draft: LiveBuilderDraft; setDraft: React.Dispatch<React.SetStateAction<LiveBuilderDraft>> }) {
  const totalDuration = draft.runOfShow.reduce((sum, item) => sum + item.durationMin, 0);
  const remaining = draft.durationMin - totalDuration;

  const addSegment = (type: SegmentType) => {
    const title = type === "Custom" ? `Segment ${draft.runOfShow.length + 1}` : type;
    setDraft((d) => ({ ...d, runOfShow: [...d.runOfShow, makeSegment(type, title, type === "Sermon" ? 20 : 5)] }));
  };

  return (
    <div className="space-y-4">
      <Card
        title="Run-of-show planner"
        subtitle="Build the minute-by-minute or segment-by-segment structure, including welcome, worship, sermon, donation moment, Q&A, altar call, announcements, and closing."
        right={<Pill tone={remaining < 0 ? "danger" : remaining <= 10 ? "orange" : "green"}>{remaining < 0 ? `${Math.abs(remaining)}m over` : `${remaining}m free`}</Pill>}
      >
        <div className="flex flex-wrap gap-2">
          {(["Welcome", "Worship", "Sermon", "Donation Moment", "Crowdfund Moment", "Q&A", "Prayer", "Altar Call", "Announcements", "Closing", "Custom"] as SegmentType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => addSegment(type)}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              + {type}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {draft.runOfShow.map((segment, index) => (
            <RunOfShowRow
              key={segment.id}
              segment={segment}
              index={index}
              total={draft.runOfShow.length}
              onChange={(next) => setDraft((d) => ({ ...d, runOfShow: d.runOfShow.map((item) => (item.id === segment.id ? next : item)) }))}
              onRemove={() => setDraft((d) => ({ ...d, runOfShow: d.runOfShow.filter((item) => item.id !== segment.id) }))}
              onMoveUp={() => {
                if (index === 0) return;
                setDraft((d) => {
                  const next = [...d.runOfShow];
                  const temp = next[index - 1];
                  next[index - 1] = next[index];
                  next[index] = temp;
                  return { ...d, runOfShow: next };
                });
              }}
              onMoveDown={() => {
                if (index === draft.runOfShow.length - 1) return;
                setDraft((d) => {
                  const next = [...d.runOfShow];
                  const temp = next[index + 1];
                  next[index + 1] = next[index];
                  next[index] = temp;
                  return { ...d, runOfShow: next };
                });
              }}
            />
          ))}
        </div>
      </Card>

      <Card title="Integrated giving and crowdfund moments" subtitle="Insert donation and charity crowdfund prompts inside the actual run-of-show instead of treating them as afterthoughts.">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-3xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
            <div className="flex items-start gap-3">
              <HeartHandshake className="mt-0.5 h-5 w-5 text-orange-700 dark:text-orange-300" />
              <div>
                <div className="text-[12px] font-semibold text-orange-900 dark:text-orange-100">Donation moment in the flow</div>
                <div className="mt-1 text-[11px] leading-5 text-orange-800 dark:text-orange-300">Use donation moments when the message and the audience response are aligned. The segment planner and preview both keep those moments visible.</div>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 text-emerald-700 dark:text-emerald-300" />
              <div>
                <div className="text-[12px] font-semibold text-emerald-900 dark:text-emerald-100">Crowdfund milestones on-screen</div>
                <div className="mt-1 text-[11px] leading-5 text-emerald-800 dark:text-emerald-300">If the session is linked to a charity crowdfund, milestone updates can become on-screen moments with progress and urgency preserved in the audience preview.</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function TeamStep({ draft, setDraft }: { draft: LiveBuilderDraft; setDraft: React.Dispatch<React.SetStateAction<LiveBuilderDraft>> }) {
  const roleFields: Array<{ key: keyof TeamRoles; label: string; hint: string }> = [
    { key: "host", label: "Host", hint: "Lead voice on the live session." },
    { key: "coHost", label: "Co-host", hint: "Shares stage responsibilities and transitions." },
    { key: "moderator", label: "Moderator", hint: "Protects chat, Q&A, and prayer request flow." },
    { key: "producer", label: "Producer", hint: "Runs the control room and scene flow." },
    { key: "interpreter", label: "Interpreter", hint: "Supports translated experiences." },
    { key: "captionOperator", label: "Caption operator", hint: "Owns subtitles and caption accuracy." },
    { key: "supportTeam", label: "Support team", hint: "General backstage support or campus ops." },
  ];

  return (
    <div className="space-y-4">
      <Card title="Presenter and backstage setup" subtitle="Assign host, co-host, moderator, producer, interpreter, caption operator, and support team roles.">
        <div className="grid gap-3 md:grid-cols-2">
          {roleFields.map((role) => (
            <div key={role.key}>
              <Label>{role.label}</Label>
              <Select
                value={draft.team[role.key]}
                onChange={(value) => setDraft((d) => ({ ...d, team: { ...d.team, [role.key]: value } }))}
                options={PEOPLE.map((person) => ({ value: person, label: person }))}
              />
              <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{role.hint}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Backstage readiness" subtitle="Use role clarity to reduce confusion before the stream starts.">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Host lane</div>
            <div className="mt-2 text-[13px] font-semibold text-slate-900 dark:text-slate-100">{draft.team.host}</div>
            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Primary presenter and audience-facing voice.</div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Production lane</div>
            <div className="mt-2 text-[13px] font-semibold text-slate-900 dark:text-slate-100">{draft.team.producer}</div>
            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Scene control, graphics, and transition safety.</div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Safety lane</div>
            <div className="mt-2 text-[13px] font-semibold text-slate-900 dark:text-slate-100">{draft.team.moderator}</div>
            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Chat health, moderation, prayer triage, and community safety.</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function EngagementStep({ draft, setDraft }: { draft: LiveBuilderDraft; setDraft: React.Dispatch<React.SetStateAction<LiveBuilderDraft>> }) {
  return (
    <div className="space-y-4">
      <Card title="Engagement and CTA panel" subtitle="Prepare chat rules, Q&A, polls, reactions, prayer request intake, donation prompts, crowdfunding inserts, product links, and event sign-up CTAs.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <div className="md:col-span-2 xl:col-span-1">
            <Label>Chat rules preset</Label>
            <Select value={draft.engagement.chatRulePreset} onChange={(value) => setDraft((d) => ({ ...d, engagement: { ...d.engagement, chatRulePreset: value } }))} options={CHAT_RULE_PRESETS.map((item) => ({ value: item, label: item }))} />
          </div>
          <Toggle checked={draft.engagement.qnaEnabled} onChange={(value) => setDraft((d) => ({ ...d, engagement: { ...d.engagement, qnaEnabled: value } }))} label="Q&A enabled" hint="Let moderators collect and surface audience questions." />
          <Toggle checked={draft.engagement.pollsEnabled} onChange={(value) => setDraft((d) => ({ ...d, engagement: { ...d.engagement, pollsEnabled: value } }))} label="Polls enabled" hint="Run structured questions during the session." />
          <Toggle checked={draft.engagement.reactionsEnabled} onChange={(value) => setDraft((d) => ({ ...d, engagement: { ...d.engagement, reactionsEnabled: value } }))} label="Reactions enabled" hint="Enable lightweight audience expression while the session runs." />
          <Toggle checked={draft.engagement.prayerRequestsEnabled} onChange={(value) => setDraft((d) => ({ ...d, engagement: { ...d.engagement, prayerRequestsEnabled: value } }))} label="Prayer request intake" hint="Allow the audience to submit prayer needs during the live." />
          <Toggle checked={draft.engagement.donationPromptEnabled} onChange={(value) => setDraft((d) => ({ ...d, engagement: { ...d.engagement, donationPromptEnabled: value } }))} label="Donation prompts" hint="Insert giving asks into the audience-facing session flow." />
          <Toggle checked={draft.engagement.crowdfundInsertEnabled} onChange={(value) => setDraft((d) => ({ ...d, engagement: { ...d.engagement, crowdfundInsertEnabled: value } }))} label="Crowdfund inserts" hint="Use milestone updates for charity campaigns inside the live experience." />
          <Toggle checked={draft.engagement.productLinksEnabled} onChange={(value) => setDraft((d) => ({ ...d, engagement: { ...d.engagement, productLinksEnabled: value } }))} label="Product links" hint="Expose FaithMart resources or commerce links where appropriate." />
          <Toggle checked={draft.engagement.eventSignupEnabled} onChange={(value) => setDraft((d) => ({ ...d, engagement: { ...d.engagement, eventSignupEnabled: value } }))} label="Event sign-up CTA" hint="Drive the next event or registration moment from the live session." />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <Label>Donation CTA label</Label>
            <Input value={draft.engagement.donationPromptLabel} onChange={(value) => setDraft((d) => ({ ...d, engagement: { ...d.engagement, donationPromptLabel: value } }))} placeholder="Support this ministry" />
          </div>
          <div>
            <Label>Crowdfund CTA label</Label>
            <Input value={draft.engagement.crowdfundInsertLabel} onChange={(value) => setDraft((d) => ({ ...d, engagement: { ...d.engagement, crowdfundInsertLabel: value } }))} placeholder="Back the campaign" />
          </div>
          <div>
            <Label>Product links label</Label>
            <Input value={draft.engagement.productLinksLabel} onChange={(value) => setDraft((d) => ({ ...d, engagement: { ...d.engagement, productLinksLabel: value } }))} placeholder="FaithMart resources" />
          </div>
          <div>
            <Label>Event sign-up label</Label>
            <Input value={draft.engagement.eventSignupLabel} onChange={(value) => setDraft((d) => ({ ...d, engagement: { ...d.engagement, eventSignupLabel: value } }))} placeholder="Register for next week" />
          </div>
        </div>
      </Card>
    </div>
  );
}

function TechnicalStep({ draft, setDraft }: { draft: LiveBuilderDraft; setDraft: React.Dispatch<React.SetStateAction<LiveBuilderDraft>> }) {
  const translationTrackOptions = LANGUAGES.filter((lang) => lang !== draft.language);
  const toggleTrack = (lang: string) => {
    setDraft((d) => ({
      ...d,
      technical: {
        ...d.technical,
        translationTracks: d.technical.translationTracks.includes(lang)
          ? d.technical.translationTracks.filter((item) => item !== lang)
          : [...d.technical.translationTracks, lang],
      },
    }));
  };

  return (
    <div className="space-y-4">
      <Card title="Technical configuration block" subtitle="Set stream mode, latency profile, recording options, backup plan, graphics package, captioning mode, translation tracks, and destination presets.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <div>
            <Label>Stream mode</Label>
            <Select value={draft.technical.streamMode} onChange={(value) => setDraft((d) => ({ ...d, technical: { ...d.technical, streamMode: value as StreamMode } }))} options={[
              { value: "broadcast", label: "Broadcast" },
              { value: "interactive", label: "Interactive" },
              { value: "hybrid", label: "Hybrid" },
            ]} />
          </div>
          <div>
            <Label>Latency profile</Label>
            <Select value={draft.technical.latencyProfile} onChange={(value) => setDraft((d) => ({ ...d, technical: { ...d.technical, latencyProfile: value as LatencyProfile } }))} options={[
              { value: "standard", label: "Standard" },
              { value: "low", label: "Low" },
              { value: "ultraLow", label: "Ultra low" },
            ]} />
          </div>
          <div>
            <Label>Graphics package</Label>
            <Select value={draft.technical.graphicsPackage} onChange={(value) => setDraft((d) => ({ ...d, technical: { ...d.technical, graphicsPackage: value } }))} options={GRAPHICS_PACKAGES.map((item) => ({ value: item, label: item }))} />
          </div>
          <div>
            <Label>Captioning mode</Label>
            <Select value={draft.technical.captioningMode} onChange={(value) => setDraft((d) => ({ ...d, technical: { ...d.technical, captioningMode: value } }))} options={[
              { value: "Live captions", label: "Live captions" },
              { value: "Live captions + translation", label: "Live captions + translation" },
              { value: "Replay captions", label: "Replay captions" },
              { value: "Manual captions", label: "Manual captions" },
            ]} />
          </div>
          <div className="md:col-span-2">
            <Label>Destination preset</Label>
            <Select value={draft.technical.destinationPreset} onChange={(value) => setDraft((d) => ({ ...d, technical: { ...d.technical, destinationPreset: value } }))} options={DESTINATION_PRESETS.map((item) => ({ value: item, label: item }))} />
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Toggle checked={draft.technical.recordingEnabled} onChange={(value) => setDraft((d) => ({ ...d, technical: { ...d.technical, recordingEnabled: value } }))} label="Recording enabled" hint="Capture a clean replay source for post-live publishing." />
          <Toggle checked={draft.technical.failoverEnabled} onChange={(value) => setDraft((d) => ({ ...d, technical: { ...d.technical, failoverEnabled: value } }))} label="Backup / failover plan" hint="Keep a redundancy plan active for critical sessions." />
        </div>

        <div className="mt-4">
          <Label>Backup plan notes</Label>
          <TextArea value={draft.technical.backupPlan} onChange={(value) => setDraft((d) => ({ ...d, technical: { ...d.technical, backupPlan: value } }))} placeholder="Describe your encoder backup, fallback internet path, or emergency slate plan." rows={3} />
        </div>

        <SectionDivider title="Translation tracks" />
        <div className="flex flex-wrap gap-2">
          {translationTrackOptions.map((lang) => {
            const selected = draft.technical.translationTracks.includes(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleTrack(lang)}
                className={cx(
                  "rounded-full border px-3 py-2 text-[12px] font-semibold transition-colors",
                  selected
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
                )}
              >
                {selected ? <Check className="mr-1 inline h-3.5 w-3.5" /> : null}
                {lang}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function ApprovalsStep({ draft, setDraft }: { draft: LiveBuilderDraft; setDraft: React.Dispatch<React.SetStateAction<LiveBuilderDraft>> }) {
  const approvalCards = [
    { key: "assetsReady", label: "Assets ready", hint: "Cover, scenes, overlays, or scriptures are approved and available." },
    { key: "permissionsReady", label: "Permissions confirmed", hint: "Speakers, music, venue, and platform permissions are cleared." },
    { key: "speakersReady", label: "Speakers confirmed", hint: "Hosts and guests have acknowledged timing and readiness." },
    { key: "notesReady", label: "Notes prepared", hint: "Run-of-show notes, scriptures, and host prompts are complete." },
    { key: "moderationReady", label: "Moderation configured", hint: "Chat rules, moderator assignments, and safety defaults are ready." },
    { key: "credentialsReady", label: "Destination credentials ready", hint: "Connected platforms and internal outputs have valid access and tokens." },
  ] as const;

  return (
    <div className="space-y-4">
      <Card title="Pre-live checklist and approvals" subtitle="Confirm that assets, permissions, speakers, notes, moderation settings, and destination credentials are ready before the session moves into the live schedule.">
        <div className="grid gap-3 md:grid-cols-2">
          {approvalCards.map((item) => (
            <Toggle
              key={item.key}
              checked={draft.approvals[item.key]}
              onChange={(value) => setDraft((d) => ({ ...d, approvals: { ...d.approvals, [item.key]: value } }))}
              label={item.label}
              hint={item.hint}
            />
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <Label>Final approval by</Label>
            <Input value={draft.approvals.finalApprovalName} onChange={(value) => setDraft((d) => ({ ...d, approvals: { ...d.approvals, finalApprovalName: value } }))} placeholder="e.g. Lead producer or pastor" />
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-slate-700 dark:text-slate-300" />
              <div>
                <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">Approval-aware workflow</div>
                <div className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">This page is designed to block risky handoffs into schedule or studio until the essential operational, editorial, and safety checks are complete.</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ReviewStep({
  draft,
  readiness,
  checklist,
  onQuickLink,
}: {
  draft: LiveBuilderDraft;
  readiness: number;
  checklist: Array<{ label: string; ok: boolean }>;
  onQuickLink: (label: string, route: string) => void;
}) {
  const incomplete = checklist.filter((item) => !item.ok);
  const totalDuration = draft.runOfShow.reduce((sum, item) => sum + item.durationMin, 0);

  return (
    <div className="space-y-4">
      <Card title="Review & launch" subtitle="This step packages the master live-session object and prepares downstream schedule, notification, studio, and distribution workflows." right={<Pill tone={readiness >= 80 ? "green" : readiness >= 55 ? "orange" : "danger"}>{readiness}% ready</Pill>}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MiniStat label="Parent" value={getParentLabel(draft)} />
          <MiniStat label="Template" value={TEMPLATE_META[draft.template].label} />
          <MiniStat label="Audience" value={accessLabel(draft.accessLevel)} />
          <MiniStat label="Segments" value={`${draft.runOfShow.length} / ${totalDuration}m`} />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">Session summary</div>
            <div className="mt-2 text-[11px] leading-5 text-slate-500 dark:text-slate-400">{draft.summary}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {draft.tags.map((tag) => <Pill key={tag}>{tag}</Pill>)}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">Backstage team</div>
            <div className="mt-2 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
              <div>Host: <span className="font-semibold text-slate-900 dark:text-slate-100">{draft.team.host}</span></div>
              <div>Producer: <span className="font-semibold text-slate-900 dark:text-slate-100">{draft.team.producer}</span></div>
              <div>Moderator: <span className="font-semibold text-slate-900 dark:text-slate-100">{draft.team.moderator}</span></div>
              <div>Captioning: <span className="font-semibold text-slate-900 dark:text-slate-100">{draft.team.captionOperator}</span></div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Instant handoff" subtitle="All settings should remain preserved as the team moves to scheduling, notifications, studio, and distribution.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <button type="button" onClick={() => onQuickLink("Live Schedule", ROUTES.liveSchedule)} className="rounded-[24px] border border-slate-200 bg-white p-4 text-left transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800">
            <Calendar className="h-5 w-5 text-emerald-600" />
            <div className="mt-3 text-[12px] font-semibold text-slate-900 dark:text-slate-100">Live Schedule</div>
            <div className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">Place the session onto the operational calendar with staffing and readiness preserved.</div>
          </button>
          <button type="button" onClick={() => onQuickLink("Live Dashboard", ROUTES.liveDashboard)} className="rounded-[24px] border border-slate-200 bg-white p-4 text-left transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800">
            <MonitorPlay className="h-5 w-5 text-emerald-600" />
            <div className="mt-3 text-[12px] font-semibold text-slate-900 dark:text-slate-100">Live Dashboard</div>
            <div className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">Open the operational cockpit for readiness, alerts, and audience pulse.</div>
          </button>
          <button type="button" onClick={() => onQuickLink("Audience Notifications", ROUTES.audienceNotifications)} className="rounded-[24px] border border-slate-200 bg-white p-4 text-left transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800">
            <Bell className="h-5 w-5 text-orange-500" />
            <div className="mt-3 text-[12px] font-semibold text-slate-900 dark:text-slate-100">Audience Notifications</div>
            <div className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">Activate reminder journeys and replay follow-up without rebuilding the audience logic.</div>
          </button>
          <button type="button" onClick={() => onQuickLink("Stream-to-Platforms", ROUTES.streamToPlatforms)} className="rounded-[24px] border border-slate-200 bg-white p-4 text-left transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800">
            <Globe2 className="h-5 w-5 text-orange-500" />
            <div className="mt-3 text-[12px] font-semibold text-slate-900 dark:text-slate-100">Stream-to-Platforms</div>
            <div className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">Carry metadata, destination presets, and failover choices into distribution.</div>
          </button>
        </div>
      </Card>

      <Card title="Readiness blockers" subtitle="Resolve anything still missing before the team schedules, notifies, or opens Studio.">
        {incomplete.length ? (
          <div className="space-y-2">
            {incomplete.map((item) => (
              <div key={item.label} className="flex items-start gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-3 text-[12px] text-orange-800 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                <AlertTriangle className="mt-0.5 h-4 w-4" />
                <div>{item.label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-[12px] text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
            Every core readiness item is in place. This live session is ready for premium downstream handoff.
          </div>
        )}
      </Card>
    </div>
  );
}

function HandoffPanel({ onQuickLink }: { onQuickLink: (label: string, route: string) => void }) {
  return (
    <div className="mt-4 rounded-[30px] border border-slate-200 bg-white p-4 shadow-[0_10px_32px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-950">
      <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">Preview-linked handoff</div>
      <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Same premium workflow pattern as the base page: preview stays visible while downstream actions remain one click away.</div>
      <div className="mt-3 grid gap-2">
        {[
          { label: "Open Live Schedule", route: ROUTES.liveSchedule },
          { label: "Open Live Dashboard", route: ROUTES.liveDashboard },
          { label: "Open Audience Notifications", route: ROUTES.audienceNotifications },
          { label: "Open Studio Setup", route: ROUTES.liveStudio },
        ].map((item) => (
          <button key={item.route} type="button" onClick={() => onQuickLink(item.label, item.route)} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
            <span>{item.label}</span>
            <ExternalLink className="h-4 w-4" />
          </button>
        ))}
      </div>
    </div>
  );
}

function PreviewDrawer({ open, onClose, draft, readiness, onQuickLink }: { open: boolean; onClose: () => void; draft: LiveBuilderDraft; readiness: number; onQuickLink: (label: string, route: string) => void }) {
  return (
    <Drawer open={open} onClose={onClose} title="Live preview" subtitle="Audience-facing waiting room and live landing view">
      <PreviewPhone draft={draft} readiness={readiness} />
      <HandoffPanel onQuickLink={onQuickLink} />
    </Drawer>
  );
}

export function FaithHubLiveBuilderDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="FaithHub Live Builder"
      subtitle="Configure a premium Live Session with preview, run-of-show, engagement, and studio handoff."
      zIndex={110}
    >
      <FaithHubLiveBuilderPage embedded onRequestClose={onClose} />
    </Drawer>
  );
}

export default function FaithHubLiveBuilderPage({ embedded = false, onRequestClose }: { embedded?: boolean; onRequestClose?: () => void } = {}) {
  const [draft, setDraft] = useState<LiveBuilderDraft>(() => buildDefaultDraft());
  const [step, setStep] = useState<StepKey>("setup");
  const [toast, setToast] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const isMobile = useIsMobile(1024);

  const checklist = useMemo(() => buildChecklist(draft), [draft]);
  const readiness = useMemo(() => Math.round((checklist.filter((item) => item.ok).length / checklist.length) * 100), [checklist]);

  const currentIndex = STEPS.findIndex((item) => item.key === step);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === STEPS.length - 1;

  const showToast = (message: string) => setToast(message);

  const applyTemplate = (template: LiveTemplate) => {
    const meta = TEMPLATE_META[template];
    setDraft((current) => ({
      ...current,
      template,
      category: meta.category,
      durationMin: meta.durationMin,
      runOfShow: meta.runOfShow.map((segment) => ({ ...segment, id: createId("seg") })),
      engagement: {
        ...current.engagement,
        ...meta.engagement,
        donationPromptLabel: meta.engagement.donationPromptLabel || current.engagement.donationPromptLabel,
        crowdfundInsertLabel: meta.engagement.crowdfundInsertLabel || current.engagement.crowdfundInsertLabel,
        eventSignupLabel: meta.engagement.eventSignupLabel || current.engagement.eventSignupLabel,
      },
      technical: {
        ...current.technical,
        ...meta.technical,
        translationTracks: meta.technical.translationTracks || current.technical.translationTracks,
      },
    }));
    showToast(`${meta.label} template applied.`);
  };

  const saveLiveSession = () => {
    setDraft((d) => ({ ...d, status: "Draft" }));
    showToast("Live session saved.");
  };

  const scheduleAndNotify = () => {
    if (readiness < 70) {
      showToast("Complete more checklist items before scheduling and notifications.");
      return;
    }
    setDraft((d) => ({ ...d, status: "Scheduled" }));
    showToast("Live session scheduled. Notification journey is ready for the next handoff.");
  };

  const openStudioSetup = () => {
    if (readiness < 55) {
      showToast("Finish setup and technical readiness before opening Studio Setup.");
      return;
    }
    setDraft((d) => ({ ...d, status: d.status === "Scheduled" ? d.status : "Ready" }));
    showToast("Studio setup is ready. Map this button to your Live Studio route.");
  };

  const onQuickLink = (label: string, route: string) => {
    showToast(`${label} ready: ${route}`);
  };

  const renderStep = () => {
    switch (step) {
      case "setup":
        return <SetupStep draft={draft} setDraft={setDraft} applyTemplate={applyTemplate} />;
      case "identity":
        return <IdentityStep draft={draft} setDraft={setDraft} />;
      case "timing":
        return <TimingStep draft={draft} setDraft={setDraft} />;
      case "show":
        return <RunOfShowStep draft={draft} setDraft={setDraft} />;
      case "team":
        return <TeamStep draft={draft} setDraft={setDraft} />;
      case "engagement":
        return <EngagementStep draft={draft} setDraft={setDraft} />;
      case "technical":
        return <TechnicalStep draft={draft} setDraft={setDraft} />;
      case "approvals":
        return <ApprovalsStep draft={draft} setDraft={setDraft} />;
      case "review":
        return <ReviewStep draft={draft} readiness={readiness} checklist={checklist} onQuickLink={onQuickLink} />;
      default:
        return null;
    }
  };

  return (
    <div className={cx("space-y-4 pb-28 sm:pb-20", embedded ? "min-h-0" : "min-h-screen bg-slate-50 px-4 py-4 dark:bg-slate-950 sm:px-6" )}>
      {!embedded ? (
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-xl sm:text-2xl font-extrabold truncate text-slate-900 dark:text-slate-100">{draft.title}</div>
              <Pill tone={draft.status === "Scheduled" ? "green" : draft.status === "Ready" ? "orange" : "neutral"}>{draft.status}</Pill>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
              <span>{getParentLabel(draft)}</span>
              <span className="text-slate-300 dark:text-slate-700">?</span>
              <span>{formatPrettyDate(draft.startDateISO, draft.startTime, draft.timezone)}</span>
              <span className="text-slate-300 dark:text-slate-700">?</span>
              <span>{TEMPLATE_META[draft.template].label}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <SoftButton onClick={() => (onRequestClose ? onRequestClose() : safeNav(ROUTES.providerDashboard))} title="Back to Provider Dashboard">
              <ChevronLeft className="h-4 w-4" /> Dashboard
            </SoftButton>
            {isMobile ? (
              <SoftButton onClick={() => setPreviewOpen(true)} title="Open preview">
                <Eye className="h-4 w-4" /> Preview
              </SoftButton>
            ) : null}
            <SoftButton onClick={saveLiveSession} title="Save live session">
              <CheckCircle2 className="h-4 w-4" /> Save live session
            </SoftButton>
            <PrimaryButton secondary onClick={scheduleAndNotify} title="Schedule and notify">
              <Bell className="h-4 w-4" /> Schedule and notify
            </PrimaryButton>
            <PrimaryButton onClick={openStudioSetup} title="Open studio setup">
              <MonitorPlay className="h-4 w-4" /> Open studio setup
            </PrimaryButton>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-2">
          <StepNav active={step} onChange={setStep} readiness={readiness} />
          <ReadinessCard checklist={checklist} />
          <QuickStatsCard draft={draft} />
        </div>

        <div className="space-y-4 lg:col-span-5">
          {renderStep()}
          <div className="sticky bottom-4 z-30 rounded-[28px] border border-slate-200 bg-white p-3 shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950 lg:hidden">
            <div className="flex items-center justify-between gap-2">
              <SoftButton onClick={() => !isFirstStep && setStep(STEPS[currentIndex - 1].key)} disabled={isFirstStep}>
                <ChevronLeft className="h-4 w-4" /> Back
              </SoftButton>
              {isLastStep ? (
                <PrimaryButton onClick={scheduleAndNotify} secondary>
                  Schedule <ArrowRight className="h-4 w-4" />
                </PrimaryButton>
              ) : (
                <PrimaryButton onClick={() => !isLastStep && setStep(STEPS[currentIndex + 1].key)}>
                  Next <ChevronRight className="h-4 w-4" />
                </PrimaryButton>
              )}
            </div>
          </div>
        </div>

        <div className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-4">
            <PreviewPhone draft={draft} readiness={readiness} />
            <HandoffPanel onQuickLink={onQuickLink} />
          </div>
        </div>
      </div>

      <PreviewDrawer open={previewOpen} onClose={() => setPreviewOpen(false)} draft={draft} readiness={readiness} onQuickLink={onQuickLink} />

      {toast ? <Toast message={toast} onClose={() => setToast(null)} /> : null}
    </div>
  );
}







