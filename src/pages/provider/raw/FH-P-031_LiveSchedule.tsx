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
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Download,
  ExternalLink,
  Eye,
  Globe2,
  GripVertical,
  Info,
  LayoutGrid,
  Link2,
  List,
  ListFilter,
  MapPin,
  MonitorPlay,
  Plus,
  Printer,
  Radio,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wand2,
  X,
  Zap,
} from "lucide-react";

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";

const ROUTES = {
  liveBuilder: "/faithhub/provider/live-builder",
  liveDashboard: "/faithhub/provider/live-dashboard",
  liveStudio: "/faithhub/provider/live-studio",
  eventsManager: "/faithhub/provider/events-manager",
};

type ViewMode = "day" | "week" | "month" | "timeline" | "agenda";
type SavedView = "production" | "pastoral" | "outreach" | "finance";
type ReadinessState = "Green" | "At risk" | "Blocked";

type RoleAssignments = {
  host: string;
  producer?: string;
  moderator?: string;
  caption?: string;
  interpreter?: string;
  support?: string;
};

type LiveSession = {
  id: string;
  title: string;
  parentLabel: string;
  parentType:
    | "Series Episode"
    | "Standalone Teaching"
    | "Event"
    | "Giving Moment"
    | "Standalone Live";
  sessionType:
    | "Weekly Service"
    | "Teaching"
    | "Prayer"
    | "Fundraiser"
    | "Class"
    | "Watch Party"
    | "Special Event";
  campus: "Central Campus" | "East Campus" | "Online Campus" | "City Hub";
  venue: string;
  language: "English" | "Swahili" | "French" | "Arabic";
  audience:
    | "All Church"
    | "Youth"
    | "Women"
    | "Leaders"
    | "Families"
    | "Community";
  speaker: string;
  startISO: string;
  endISO: string;
  timezone: string;
  destinations: string[];
  avResources: string[];
  roles: RoleAssignments;
  recurrence: "One-time" | "Weekly" | "Monthly" | "Seasonal Campaign";
  linkedEvent?: string;
  linkedGiving?: string;
  linkedCrowdfund?: string;
  registrations: number;
  capacity?: number;
  notesReady: boolean;
  graphicsReady: boolean;
  credentialsReady: boolean;
  translationEnabled: boolean;
};

type ConflictRecord = {
  id: string;
  type: "speaker" | "venue" | "av" | "staff-gap" | "blackout" | "staff-overlap";
  severity: "warn" | "block";
  sessionIds: string[];
  label: string;
  description: string;
};

type FilterState = {
  search: string;
  campus: string;
  speaker: string;
  language: string;
  audience: string;
  sessionType: string;
};

type QuickAddDraft = {
  title: string;
  campus: LiveSession["campus"];
  sessionType: LiveSession["sessionType"];
  language: LiveSession["language"];
  audience: LiveSession["audience"];
  speaker: string;
  venue: string;
  dateISO: string;
  startTime: string;
  durationMin: number;
  recurrence: LiveSession["recurrence"];
  timezone: string;
};

type Suggestion = {
  id: string;
  sessionId: string;
  label: string;
  startISO: string;
  endISO: string;
  reason: string;
  impactLabel: string;
};

const TIMEZONE_OPTIONS = [
  "Africa/Kampala",
  "Africa/Nairobi",
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
];

const CAMPUSES: LiveSession["campus"][] = [
  "Central Campus",
  "East Campus",
  "Online Campus",
  "City Hub",
];

const LANGUAGES: LiveSession["language"][] = [
  "English",
  "Swahili",
  "French",
  "Arabic",
];

const AUDIENCES: LiveSession["audience"][] = [
  "All Church",
  "Youth",
  "Women",
  "Leaders",
  "Families",
  "Community",
];

const SESSION_TYPES: LiveSession["sessionType"][] = [
  "Weekly Service",
  "Teaching",
  "Prayer",
  "Fundraiser",
  "Class",
  "Watch Party",
  "Special Event",
];

const PEOPLE = [
  "Pastor Daniel M.",
  "Minister Ruth K.",
  "Pastor Samuel A.",
  "Pastor Grace L.",
  "Producer Claire N.",
  "Producer Nathan P.",
  "Moderator Tobi E.",
  "Moderator Sarah A.",
  "Interpreter Grace L.",
  "Interpreter Caleb O.",
  "Caption Lead Mercy J.",
  "Support Team â€“ East Campus",
  "Support Team â€“ Central Campus",
];

const BLACKOUTS = [
  {
    id: "bo-1",
    campus: "Central Campus",
    dateISO: "2026-04-17",
    time: "17:30â€“19:00",
    label: "Main sanctuary sound check lock",
  },
  {
    id: "bo-2",
    campus: "East Campus",
    dateISO: "2026-04-19",
    time: "08:30â€“09:30",
    label: "Generator maintenance",
  },
];

const HOLIDAY_NOTES = [
  {
    id: "holiday-1",
    label: "Easter weekend volunteer stretch",
    detail: "Expect slower setup on Friday evening and Sunday morning load-in.",
  },
  {
    id: "holiday-2",
    label: "London DST reminder",
    detail:
      "Review UK destination titles and local start times before export.",
  },
];

const SESSION_SEED: LiveSession[] = [
  {
    id: "FH-LS-301",
    title: "Morning Prayer & Word",
    parentLabel: "Standalone Teaching Â· Prayer Room",
    parentType: "Standalone Teaching",
    sessionType: "Prayer",
    campus: "Online Campus",
    venue: "FaithHub Studio A",
    language: "English",
    audience: "All Church",
    speaker: "Pastor Grace L.",
    startISO: "2026-04-14T06:30:00",
    endISO: "2026-04-14T07:00:00",
    timezone: "Africa/Kampala",
    destinations: ["FaithHub", "YouTube"],
    avResources: ["Studio Switcher A", "Wireless Pack 1"],
    roles: {
      host: "Pastor Grace L.",
      producer: "",
      moderator: "Moderator Tobi E.",
      caption: "Caption Lead Mercy J.",
      support: "Support Team â€“ Central Campus",
    },
    recurrence: "Weekly",
    registrations: 312,
    notesReady: true,
    graphicsReady: false,
    credentialsReady: true,
    translationEnabled: false,
  },
  {
    id: "FH-LS-302",
    title: "Leadership Lab Live",
    parentLabel: "Standalone Teaching Â· Leadership Lab",
    parentType: "Standalone Teaching",
    sessionType: "Teaching",
    campus: "City Hub",
    venue: "Training Room 2",
    language: "English",
    audience: "Leaders",
    speaker: "Pastor Samuel A.",
    startISO: "2026-04-15T13:00:00",
    endISO: "2026-04-15T14:00:00",
    timezone: "Africa/Kampala",
    destinations: ["FaithHub", "Zoom Room"],
    avResources: ["Portable Kit C"],
    roles: {
      host: "Pastor Samuel A.",
      producer: "Producer Claire N.",
      moderator: "Moderator Sarah A.",
      caption: "Caption Lead Mercy J.",
      support: "Support Team â€“ Central Campus",
    },
    recurrence: "Monthly",
    linkedEvent: "Leaders Formation Week",
    registrations: 88,
    capacity: 120,
    notesReady: true,
    graphicsReady: true,
    credentialsReady: true,
    translationEnabled: false,
  },
  {
    id: "FH-LS-303",
    title: "Midweek Prayer & Teaching",
    parentLabel: "Standalone Teaching Â· Midweek Encounter",
    parentType: "Standalone Teaching",
    sessionType: "Teaching",
    campus: "Central Campus",
    venue: "Main Sanctuary",
    language: "English",
    audience: "All Church",
    speaker: "Pastor Daniel M.",
    startISO: "2026-04-15T19:00:00",
    endISO: "2026-04-15T20:30:00",
    timezone: "Africa/Kampala",
    destinations: ["FaithHub", "YouTube", "Facebook"],
    avResources: ["Main Stage Kit A", "Wireless Pack 2"],
    roles: {
      host: "Pastor Daniel M.",
      producer: "Producer Nathan P.",
      moderator: "Moderator Tobi E.",
      caption: "Caption Lead Mercy J.",
      interpreter: "Interpreter Caleb O.",
      support: "Support Team â€“ Central Campus",
    },
    recurrence: "Weekly",
    registrations: 918,
    capacity: 1500,
    notesReady: true,
    graphicsReady: true,
    credentialsReady: true,
    translationEnabled: true,
  },
  {
    id: "FH-LS-304",
    title: "Women of Wisdom Discipleship",
    parentLabel: "Series Â· Women of Wisdom Â· Episode 04",
    parentType: "Series Episode",
    sessionType: "Class",
    campus: "Central Campus",
    venue: "Main Sanctuary",
    language: "English",
    audience: "Women",
    speaker: "Minister Ruth K.",
    startISO: "2026-04-16T18:00:00",
    endISO: "2026-04-16T19:30:00",
    timezone: "Africa/Kampala",
    destinations: ["FaithHub"],
    avResources: ["Main Stage Kit A", "Wireless Pack 2"],
    roles: {
      host: "Minister Ruth K.",
      producer: "Producer Claire N.",
      moderator: "",
      caption: "Caption Lead Mercy J.",
      support: "Support Team â€“ Central Campus",
    },
    recurrence: "Weekly",
    registrations: 447,
    capacity: 600,
    notesReady: true,
    graphicsReady: true,
    credentialsReady: true,
    translationEnabled: false,
  },
  {
    id: "FH-LS-305",
    title: "Charity Prayer & Giving Moment",
    parentLabel: "Community Borehole Appeal",
    parentType: "Giving Moment",
    sessionType: "Fundraiser",
    campus: "Central Campus",
    venue: "Main Sanctuary",
    language: "English",
    audience: "Community",
    speaker: "Minister Ruth K.",
    startISO: "2026-04-16T18:15:00",
    endISO: "2026-04-16T19:00:00",
    timezone: "Africa/Kampala",
    destinations: ["FaithHub", "YouTube"],
    avResources: ["Main Stage Kit A", "Wireless Pack 2"],
    roles: {
      host: "Minister Ruth K.",
      producer: "Producer Nathan P.",
      moderator: "Moderator Sarah A.",
      caption: "",
      support: "Support Team â€“ Central Campus",
    },
    recurrence: "One-time",
    linkedCrowdfund: "Community Borehole Appeal",
    registrations: 209,
    notesReady: true,
    graphicsReady: false,
    credentialsReady: true,
    translationEnabled: false,
  },
  {
    id: "FH-LS-306",
    title: "Youth Revival Night",
    parentLabel: "Event Â· Youth Revival Night",
    parentType: "Event",
    sessionType: "Special Event",
    campus: "East Campus",
    venue: "East Hall",
    language: "Swahili",
    audience: "Youth",
    speaker: "Pastor Daniel M.",
    startISO: "2026-04-17T18:30:00",
    endISO: "2026-04-17T20:00:00",
    timezone: "Africa/Kampala",
    destinations: ["FaithHub", "YouTube", "TikTok"],
    avResources: ["Portable Kit C", "Wireless Pack 1"],
    roles: {
      host: "Pastor Daniel M.",
      producer: "Producer Claire N.",
      moderator: "Moderator Tobi E.",
      caption: "",
      interpreter: "Interpreter Grace L.",
      support: "Support Team â€“ East Campus",
    },
    recurrence: "One-time",
    linkedEvent: "Youth Revival Night",
    registrations: 654,
    capacity: 900,
    notesReady: true,
    graphicsReady: false,
    credentialsReady: true,
    translationEnabled: true,
  },
  {
    id: "FH-LS-307",
    title: "French Watch Party",
    parentLabel: "Series Â· The Way of Grace Â· Watch Party",
    parentType: "Series Episode",
    sessionType: "Watch Party",
    campus: "Online Campus",
    venue: "FaithHub Studio B",
    language: "French",
    audience: "Families",
    speaker: "Pastor Samuel A.",
    startISO: "2026-04-18T16:00:00",
    endISO: "2026-04-18T17:00:00",
    timezone: "Europe/Paris",
    destinations: ["FaithHub"],
    avResources: ["Replay Stack B"],
    roles: {
      host: "Pastor Samuel A.",
      producer: "Producer Nathan P.",
      moderator: "Moderator Sarah A.",
      caption: "Caption Lead Mercy J.",
      interpreter: "Interpreter Grace L.",
      support: "Support Team â€“ Central Campus",
    },
    recurrence: "Seasonal Campaign",
    registrations: 173,
    notesReady: true,
    graphicsReady: true,
    credentialsReady: true,
    translationEnabled: true,
  },
  {
    id: "FH-LS-308",
    title: "Sunday Encounter Live",
    parentLabel: "Series Â· Sunday Encounter Â· Episode 10",
    parentType: "Series Episode",
    sessionType: "Weekly Service",
    campus: "Central Campus",
    venue: "Main Sanctuary",
    language: "English",
    audience: "All Church",
    speaker: "Pastor Daniel M.",
    startISO: "2026-04-19T09:00:00",
    endISO: "2026-04-19T10:30:00",
    timezone: "Africa/Kampala",
    destinations: ["FaithHub", "YouTube", "Facebook"],
    avResources: ["Main Stage Kit A", "Wireless Pack 2"],
    roles: {
      host: "Pastor Daniel M.",
      producer: "Producer Nathan P.",
      moderator: "Moderator Tobi E.",
      caption: "Caption Lead Mercy J.",
      interpreter: "Interpreter Caleb O.",
      support: "Support Team â€“ Central Campus",
    },
    recurrence: "Weekly",
    linkedGiving: "Mission Expansion Offering",
    registrations: 1408,
    capacity: 2500,
    notesReady: true,
    graphicsReady: true,
    credentialsReady: true,
    translationEnabled: true,
  },
];

const SAVED_VIEW_CONFIG: Record<
  SavedView,
  { label: string; note: string; accent: string }
> = {
  production: {
    label: "Production",
    note: "Prioritize staffing, readiness, and technical clashes.",
    accent: EV_GREEN,
  },
  pastoral: {
    label: "Pastoral",
    note: "Focus on speakers, audiences, and teaching cadence.",
    accent: EV_ORANGE,
  },
  outreach: {
    label: "Outreach",
    note: "Highlight multilingual, event, and community-facing sessions.",
    accent: EV_GREEN,
  },
  finance: {
    label: "Finance",
    note: "Surface giving moments, crowdfunds, and campaign-linked live activity.",
    accent: EV_ORANGE,
  },
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function safeNav(path: string) {
  if (typeof window === "undefined") return;
  window.location.assign(path);
}

function pad2(n: number) {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}

function toDate(iso: string) {
  return new Date(iso);
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function toISODateInput(date: Date) {
  return dateKey(date);
}

function startOfWeek(anchor: Date) {
  const day = anchor.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const result = new Date(anchor);
  result.setDate(anchor.getDate() + mondayOffset);
  result.setHours(0, 0, 0, 0);
  return result;
}

function startOfMonth(anchor: Date) {
  const result = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  result.setHours(0, 0, 0, 0);
  return result;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addMonths(date: Date, months: number) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function sameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function sameDay(a: Date, b: Date) {
  return dateKey(a) === dateKey(b);
}

function getWeekDates(anchor: Date) {
  const monday = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
}

function minuteOfDay(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

function overlaps(a: LiveSession, b: LiveSession) {
  const startA = toDate(a.startISO).getTime();
  const endA = toDate(a.endISO).getTime();
  const startB = toDate(b.startISO).getTime();
  const endB = toDate(b.endISO).getTime();
  return startA < endB && startB < endA;
}

function formatMonthHeader(date: Date) {
  return date.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

function formatDayHeader(date: Date) {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(date: Date) {
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatSessionTimeRange(session: LiveSession) {
  return `${formatTime(toDate(session.startISO))}â€“${formatTime(
    toDate(session.endISO),
  )}`;
}

function formatDateTime(iso: string) {
  const date = toDate(iso);
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function durationMinutes(session: LiveSession) {
  return Math.round(
    (toDate(session.endISO).getTime() - toDate(session.startISO).getTime()) /
      60000,
  );
}

function formatDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours && minutes) return `${hours}h ${minutes}m`;
  if (hours) return `${hours}h`;
  return `${minutes}m`;
}

function getDayColumns(anchor: Date) {
  return getWeekDates(anchor).map((date) => ({
    date,
    label: date.toLocaleDateString(undefined, {
      weekday: "short",
    }),
  }));
}

function buildBlackoutWindow(dateISO: string, timeRange: string) {
  const [from, to] = timeRange.split("â€“");
  return {
    start: new Date(`${dateISO}T${from}:00`),
    end: new Date(`${dateISO}T${to}:00`),
  };
}

function roleCoverage(session: LiveSession) {
  const required: Array<keyof RoleAssignments> = ["host", "producer", "moderator"];
  const supportive: Array<keyof RoleAssignments> = [
    "caption",
    "interpreter",
    "support",
  ];
  const missingCritical = required.filter((key) => !session.roles[key]);
  const missingSupportive = supportive.filter((key) => !session.roles[key]);
  return { missingCritical, missingSupportive };
}

function detectConflicts(sessions: LiveSession[]) {
  const records: ConflictRecord[] = [];

  sessions.forEach((session) => {
    const coverage = roleCoverage(session);
    if (coverage.missingCritical.length) {
      records.push({
        id: `${session.id}-staff-gap`,
        type: "staff-gap",
        severity: "block",
        sessionIds: [session.id],
        label: `${session.title} is missing critical staffing`,
        description: `Missing ${coverage.missingCritical.join(
          ", ",
        )} before the session can be considered ready.`,
      });
    }

    const blackout = BLACKOUTS.find((entry) => {
      if (entry.campus !== session.campus) return false;
      const window = buildBlackoutWindow(entry.dateISO, entry.time);
      const start = toDate(session.startISO);
      const end = toDate(session.endISO);
      return start < window.end && end > window.start;
    });

    if (blackout) {
      records.push({
        id: `${session.id}-${blackout.id}-blackout`,
        type: "blackout",
        severity: "warn",
        sessionIds: [session.id],
        label: `${session.title} crosses a provider blackout`,
        description: `${blackout.label} overlaps with this session on ${blackout.dateISO} (${blackout.time}).`,
      });
    }
  });

  for (let i = 0; i < sessions.length; i += 1) {
    for (let j = i + 1; j < sessions.length; j += 1) {
      const first = sessions[i];
      const second = sessions[j];

      if (!sameDay(toDate(first.startISO), toDate(second.startISO))) continue;
      if (!overlaps(first, second)) continue;

      if (first.speaker === second.speaker) {
        records.push({
          id: `${first.id}-${second.id}-speaker`,
          type: "speaker",
          severity: "block",
          sessionIds: [first.id, second.id],
          label: "Double-booked speaker",
          description: `${first.speaker} is assigned to both "${first.title}" and "${second.title}" at overlapping times.`,
        });
      }

      if (first.venue === second.venue && first.campus === second.campus) {
        records.push({
          id: `${first.id}-${second.id}-venue`,
          type: "venue",
          severity: "block",
          sessionIds: [first.id, second.id],
          label: "Venue clash",
          description: `${first.venue} at ${first.campus} is booked for both "${first.title}" and "${second.title}".`,
        });
      }

      const sharedAv = first.avResources.filter((resource) =>
        second.avResources.includes(resource),
      );
      if (sharedAv.length) {
        records.push({
          id: `${first.id}-${second.id}-av`,
          type: "av",
          severity: "warn",
          sessionIds: [first.id, second.id],
          label: "AV resource conflict",
          description: `Shared AV resources in conflict: ${sharedAv.join(", ")}.`,
        });
      }

      const firstProducer = first.roles.producer || "";
      const secondProducer = second.roles.producer || "";
      const firstModerator = first.roles.moderator || "";
      const secondModerator = second.roles.moderator || "";

      const overlappingStaff: string[] = [];
      if (firstProducer && firstProducer === secondProducer) {
        overlappingStaff.push(firstProducer);
      }
      if (firstModerator && firstModerator === secondModerator) {
        overlappingStaff.push(firstModerator);
      }

      if (overlappingStaff.length) {
        records.push({
          id: `${first.id}-${second.id}-staff-overlap`,
          type: "staff-overlap",
          severity: "warn",
          sessionIds: [first.id, second.id],
          label: "Support role overlap",
          description: `The same staff member is assigned to overlapping sessions: ${Array.from(
            new Set(overlappingStaff),
          ).join(", ")}.`,
        });
      }
    }
  }

  return records;
}

function issuesForSession(sessionId: string, conflicts: ConflictRecord[]) {
  return conflicts.filter((conflict) => conflict.sessionIds.includes(sessionId));
}

function buildReadiness(session: LiveSession, issues: ConflictRecord[]) {
  const coverage = roleCoverage(session);
  const hasBlock = issues.some((issue) => issue.severity === "block");
  const hasWarn = issues.some((issue) => issue.severity === "warn");

  let score = 100;
  if (!session.notesReady) score -= 10;
  if (!session.graphicsReady) score -= 12;
  if (!session.credentialsReady) score -= 18;
  if (!session.translationEnabled && session.language !== "English") score -= 6;
  score -= coverage.missingCritical.length * 22;
  score -= coverage.missingSupportive.length * 7;
  if (hasWarn) score -= 10;
  if (hasBlock) score -= 24;
  score = Math.max(28, Math.min(99, score));

  let state: ReadinessState = "Green";
  if (coverage.missingCritical.length || !session.credentialsReady || hasBlock) {
    state = "Blocked";
  } else if (!session.graphicsReady || coverage.missingSupportive.length || hasWarn) {
    state = "At risk";
  }

  return { score, state, coverage };
}

function toneClasses(tone: "neutral" | "good" | "warn" | "danger") {
  return tone === "good"
    ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
    : tone === "warn"
      ? "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300"
      : tone === "danger"
        ? "border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300"
        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300";
}

function readinessTone(state: ReadinessState) {
  return state === "Green"
    ? ("good" as const)
    : state === "At risk"
      ? ("warn" as const)
      : ("danger" as const);
}

function generateICS(title: string, description: string, startISO: string, endISO: string) {
  const formatICS = (value: string) =>
    new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${formatICS(startISO)}`,
    `DTEND:${formatICS(endISO)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

function generateScheduleICS(sessions: LiveSession[]) {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    ...sessions.flatMap((session) => [
      "BEGIN:VEVENT",
      `DTSTART:${new Date(session.startISO)
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "")}`,
      `DTEND:${new Date(session.endISO)
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "")}`,
      `SUMMARY:${session.title}`,
      `DESCRIPTION:${session.parentLabel} Â· ${session.campus} Â· ${session.language}`,
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

function applySavedViewScope(session: LiveSession, savedView: SavedView) {
  if (savedView === "production") return true;
  if (savedView === "pastoral") {
    return session.sessionType !== "Watch Party" || session.audience !== "Families";
  }
  if (savedView === "outreach") {
    return Boolean(
      session.language !== "English" ||
        session.linkedEvent ||
        session.linkedCrowdfund ||
        session.audience === "Community" ||
        session.audience === "Youth",
    );
  }
  return Boolean(
    session.linkedGiving ||
      session.linkedCrowdfund ||
      session.sessionType === "Fundraiser",
  );
}

function sessionMatchesFilters(session: LiveSession, filters: FilterState) {
  const q = filters.search.trim().toLowerCase();
  if (
    q &&
    ![
      session.title,
      session.parentLabel,
      session.speaker,
      session.campus,
      session.venue,
    ]
      .join(" ")
      .toLowerCase()
      .includes(q)
  ) {
    return false;
  }

  if (filters.campus !== "All" && session.campus !== filters.campus) return false;
  if (filters.speaker !== "All" && session.speaker !== filters.speaker) return false;
  if (filters.language !== "All" && session.language !== filters.language)
    return false;
  if (filters.audience !== "All" && session.audience !== filters.audience)
    return false;
  if (filters.sessionType !== "All" && session.sessionType !== filters.sessionType)
    return false;
  return true;
}

function getImpactLabels(session: LiveSession) {
  const assignedStaff = Object.values(session.roles).filter(Boolean).length;
  const reminderCount = Math.max(1, Math.min(4, Math.round(session.registrations / 350)));
  const eventLinks = [session.linkedEvent, session.linkedGiving, session.linkedCrowdfund].filter(Boolean);
  return [
    `${assignedStaff} staffing assignments`,
    `${session.destinations.length} destination preset${session.destinations.length === 1 ? "" : "s"}`,
    `${reminderCount} queued reminder burst${reminderCount === 1 ? "" : "s"}`,
    ...(eventLinks.length ? [`${eventLinks.length} event/campaign tie-in${eventLinks.length === 1 ? "" : "s"}`] : []),
  ];
}

function mergeDateAndTime(date: Date, template: Date) {
  const merged = new Date(date);
  merged.setHours(template.getHours(), template.getMinutes(), 0, 0);
  return merged;
}

function withDuration(start: Date, minutes: number) {
  return new Date(start.getTime() + minutes * 60000);
}

function slotConflicts(
  candidateStart: Date,
  candidateEnd: Date,
  session: LiveSession,
  sessions: LiveSession[],
) {
  return sessions.some((other) => {
    if (other.id === session.id) return false;
    const start = toDate(other.startISO);
    const end = toDate(other.endISO);
    const overlapsWindow = candidateStart < end && start < candidateEnd;
    if (!overlapsWindow) return false;
    if (other.speaker === session.speaker) return true;
    if (other.campus === session.campus && other.venue === session.venue) return true;
    if (other.avResources.some((resource) => session.avResources.includes(resource)))
      return true;
    if (
      (other.roles.producer || "") &&
      (other.roles.producer || "") === (session.roles.producer || "")
    )
      return true;
    if (
      (other.roles.moderator || "") &&
      (other.roles.moderator || "") === (session.roles.moderator || "")
    )
      return true;
    return false;
  });
}

function buildSuggestions(
  session: LiveSession,
  sessions: LiveSession[],
): Suggestion[] {
  const start = toDate(session.startISO);
  const duration = durationMinutes(session);
  const candidates = [
    {
      start: mergeDateAndTime(addDays(start, 1), start),
      reason: "Moves to the next open day with similar audience behavior.",
    },
    {
      start: new Date(start.getTime() + 2 * 3600 * 1000),
      reason: "Shifts later to clear staffing and venue overlap pressure.",
    },
    {
      start: mergeDateAndTime(addDays(start, 2), start),
      reason: "Preserves speaker availability and reduces audience overlap.",
    },
  ];

  return candidates
    .map((candidate, index) => {
      const end = withDuration(candidate.start, duration);
      const blocked = slotConflicts(candidate.start, end, session, sessions);
      return {
        id: `${session.id}-suggestion-${index + 1}`,
        sessionId: session.id,
        label: `${formatDayHeader(candidate.start)} Â· ${formatTime(candidate.start)}â€“${formatTime(end)}`,
        startISO: candidate.start.toISOString().slice(0, 19),
        endISO: end.toISOString().slice(0, 19),
        reason: blocked
          ? `${candidate.reason} Still requires one manual review.`
          : candidate.reason,
        impactLabel: blocked
          ? "1 manual review still required"
          : "Ready for fast reschedule",
      };
    })
    .slice(0, 3);
}

function timezonePreview(session: LiveSession, providerTimezone: string) {
  const start = toDate(session.startISO);
  const zones = Array.from(
    new Set([session.timezone, providerTimezone, "Europe/London", "America/New_York"]),
  ).slice(0, 4);

  return zones.map((zone) => ({
    zone,
    label: (() => {
      try {
        return new Intl.DateTimeFormat(undefined, {
          timeZone: zone,
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
          month: "short",
          day: "numeric",
        }).format(start);
      } catch {
        return formatDateTime(session.startISO);
      }
    })(),
  }));
}

function buildMonthGrid(anchor: Date) {
  const monthStart = startOfMonth(anchor);
  const firstCell = startOfWeek(monthStart);
  return Array.from({ length: 42 }, (_, index) => addDays(firstCell, index));
}

function copyText(value: string) {
  if (typeof navigator === "undefined" || !navigator.clipboard) return;
  navigator.clipboard.writeText(value).catch(() => undefined);
}

function PrimaryButton({
  children,
  onClick,
  disabled,
  className,
  title,
  tone = "orange",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  title?: string;
  tone?: "orange" | "green";
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-[12px] font-semibold text-white shadow-sm transition-all",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:brightness-95",
        className,
      )}
      style={{ background: tone === "orange" ? EV_ORANGE : EV_GREEN }}
    >
      {children}
    </button>
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
      disabled={disabled}
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-[12px] font-semibold border transition-colors",
        disabled
          ? "opacity-50 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600"
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200",
        className,
      )}
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
        "rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-colors",
        className,
      )}
    >
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

function Pill({
  text,
  tone = "neutral",
  icon,
}: {
  text: string;
  tone?: "neutral" | "good" | "warn" | "danger";
  icon?: React.ReactNode;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        toneClasses(tone),
      )}
    >
      {icon}
      {text}
    </span>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
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
      className="mt-1 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-[12px] text-slate-900 dark:text-slate-100 outline-none transition-colors focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/30"
    />
  );
}

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="mt-1 h-10 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-[12px] text-slate-900 dark:text-slate-100 outline-none transition-colors focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/30"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 2600);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className="fixed bottom-5 left-1/2 z-[120] -translate-x-1/2 rounded-full bg-slate-950 px-4 py-2 text-[12px] font-semibold text-white shadow-2xl dark:bg-white dark:text-slate-900">
      {message}
    </div>
  );
}

function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  zIndex = 110,
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
    const previousBody = document.body.style.overflow;
    const previousHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousBody;
      document.documentElement.style.overflow = previousHtml;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0" style={{ zIndex }}>
          <motion.div
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute inset-y-0 right-0 flex h-full w-full max-w-xl flex-col bg-slate-50 dark:bg-slate-950 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
          >
            <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3">
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
                  className="grid h-9 w-9 place-items-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700"
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

function ViewToggle({
  view,
  setView,
}: {
  view: ViewMode;
  setView: (view: ViewMode) => void;
}) {
  const views: Array<{ id: ViewMode; label: string; icon: React.ReactNode }> = [
    { id: "day", label: "Day", icon: <Clock3 className="h-4 w-4" /> },
    { id: "week", label: "Week", icon: <CalendarDays className="h-4 w-4" /> },
    { id: "month", label: "Month", icon: <Calendar className="h-4 w-4" /> },
    { id: "timeline", label: "Timeline", icon: <LayoutGrid className="h-4 w-4" /> },
    { id: "agenda", label: "Agenda", icon: <List className="h-4 w-4" /> },
  ];

  return (
    <div className="inline-flex flex-wrap items-center gap-1 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1">
      {views.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => setView(option.id)}
          className={cx(
            "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold transition-colors",
            view === option.id
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
              : "text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-900/60",
          )}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
}

function SessionCard({
  session,
  conflicts,
  selected,
  onSelect,
  onDragStart,
}: {
  session: LiveSession;
  conflicts: ConflictRecord[];
  selected?: boolean;
  onSelect: () => void;
  onDragStart?: (event: React.DragEvent<HTMLButtonElement>) => void;
}) {
  const readiness = buildReadiness(session, issuesForSession(session.id, conflicts));
  const sessionConflicts = issuesForSession(session.id, conflicts);

  return (
    <button
      type="button"
      draggable={Boolean(onDragStart)}
      onDragStart={onDragStart}
      onClick={onSelect}
      className={cx(
        "w-full rounded-[20px] border p-3 text-left transition-all",
        selected
          ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/70 dark:bg-emerald-900/15 shadow-sm"
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {onDragStart ? (
              <GripVertical className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
            ) : null}
            <div className="truncate text-[12px] font-semibold text-slate-900 dark:text-slate-100">
              {session.title}
            </div>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {formatSessionTimeRange(session)} Â· {session.campus}
          </div>
        </div>
        <Pill
          text={readiness.state}
          tone={readinessTone(readiness.state)}
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Pill text={session.language} />
        <Pill text={session.audience} />
        <Pill text={session.sessionType} />
      </div>

      <div className="mt-3 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className={cx(
            "h-full rounded-full transition-all",
            readiness.state === "Green"
              ? "bg-emerald-500"
              : readiness.state === "At risk"
                ? "bg-amber-500"
                : "bg-rose-500",
          )}
          style={{ width: `${readiness.score}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
        <span className="text-slate-500 dark:text-slate-400">
          {session.speaker}
        </span>
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {readiness.score}% ready
        </span>
      </div>

      {sessionConflicts.length ? (
        <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-300">
          <AlertTriangle className="h-3.5 w-3.5" />
          {sessionConflicts.length} issue{sessionConflicts.length === 1 ? "" : "s"}
        </div>
      ) : null}
    </button>
  );
}

function AgendaRow({
  session,
  conflicts,
  onSelect,
  onOpenDashboard,
  onResolve,
}: {
  session: LiveSession;
  conflicts: ConflictRecord[];
  onSelect: () => void;
  onOpenDashboard: () => void;
  onResolve: () => void;
}) {
  const readiness = buildReadiness(session, issuesForSession(session.id, conflicts));
  const issueCount = issuesForSession(session.id, conflicts).length;

  return (
    <div className="rounded-[22px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 transition-colors">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onSelect}
              className="text-left text-[13px] font-semibold text-slate-900 dark:text-slate-100 hover:underline"
            >
              {session.title}
            </button>
            <Pill text={readiness.state} tone={readinessTone(readiness.state)} />
            {issueCount ? (
              <Pill text={`${issueCount} issue${issueCount === 1 ? "" : "s"}`} tone="warn" />
            ) : null}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>{formatDateTime(session.startISO)}</span>
            <span>â€¢</span>
            <span>{session.campus}</span>
            <span>â€¢</span>
            <span>{session.venue}</span>
            <span>â€¢</span>
            <span>{session.speaker}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SoftButton onClick={onResolve}>Resolve</SoftButton>
          <PrimaryButton tone="green" onClick={onOpenDashboard}>
            Open dashboard
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function DayView({
  date,
  sessions,
  conflicts,
  selectedSessionId,
  onSelectSession,
}: {
  date: Date;
  sessions: LiveSession[];
  conflicts: ConflictRecord[];
  selectedSessionId?: string | null;
  onSelectSession: (id: string) => void;
}) {
  const rows = [...sessions].sort(
    (a, b) => toDate(a.startISO).getTime() - toDate(b.startISO).getTime(),
  );

  return (
    <div className="space-y-3">
      <div className="rounded-[22px] border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 text-[11px] text-slate-500 dark:text-slate-400">
        Day view keeps a single-day run sheet in focus so production, pastoral, and venue teams can inspect the exact cadence of that date.
      </div>
      {rows.length ? (
        rows.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            conflicts={conflicts}
            selected={session.id === selectedSessionId}
            onSelect={() => onSelectSession(session.id)}
          />
        ))
      ) : (
        <div className="rounded-[22px] border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-6 text-center text-[12px] text-slate-500 dark:text-slate-400">
          No live activity scheduled for {formatDayHeader(date)}.
        </div>
      )}
    </div>
  );
}

function WeekView({
  anchorDate,
  sessions,
  conflicts,
  selectedSessionId,
  onSelectSession,
  onMoveSession,
  setDraggingSessionId,
  draggingSessionId,
}: {
  anchorDate: Date;
  sessions: LiveSession[];
  conflicts: ConflictRecord[];
  selectedSessionId?: string | null;
  onSelectSession: (id: string) => void;
  onMoveSession: (sessionId: string, dayDate: Date) => void;
  setDraggingSessionId: (id: string | null) => void;
  draggingSessionId: string | null;
}) {
  const columns = getDayColumns(anchorDate);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="grid min-w-[920px] grid-cols-7 gap-3">
        {columns.map((column) => {
          const daySessions = sessions
            .filter((session) => sameDay(toDate(session.startISO), column.date))
            .sort((a, b) => toDate(a.startISO).getTime() - toDate(b.startISO).getTime());

          return (
            <div
              key={dateKey(column.date)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                const sessionId =
                  event.dataTransfer.getData("text/plain") || draggingSessionId;
                if (sessionId) onMoveSession(sessionId, column.date);
                setDraggingSessionId(null);
              }}
              className="min-h-[320px] rounded-[24px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <div>
                  <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                    {column.label}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {formatDayHeader(column.date)}
                  </div>
                </div>
                <Pill text={`${daySessions.length} live`} />
              </div>

              <div className="mt-3 space-y-2">
                {daySessions.length ? (
                  daySessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      conflicts={conflicts}
                      selected={session.id === selectedSessionId}
                      onSelect={() => onSelectSession(session.id)}
                      onDragStart={(event) => {
                        event.dataTransfer.setData("text/plain", session.id);
                        event.dataTransfer.effectAllowed = "move";
                        setDraggingSessionId(session.id);
                      }}
                    />
                  ))
                ) : (
                  <div className="rounded-[20px] border border-dashed border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/40 p-3 text-[11px] text-slate-400 dark:text-slate-500">
                    Drop a session here to reschedule this day.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TimelineView({
  anchorDate,
  sessions,
  conflicts,
  selectedSessionId,
  onSelectSession,
}: {
  anchorDate: Date;
  sessions: LiveSession[];
  conflicts: ConflictRecord[];
  selectedSessionId?: string | null;
  onSelectSession: (id: string) => void;
}) {
  const days = getWeekDates(anchorDate);
  const hours = Array.from({ length: 16 }, (_, index) => 6 + index);
  const totalMinutes = (22 - 6) * 60;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[960px]">
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: "160px repeat(16, minmax(44px, 1fr))" }}
        >
          <div />
          {hours.map((hour) => (
            <div
              key={hour}
              className="text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500"
            >
              {pad2(hour)}:00
            </div>
          ))}
        </div>

        <div className="mt-3 space-y-3">
          {days.map((day) => {
            const daySessions = sessions.filter((session) =>
              sameDay(toDate(session.startISO), day),
            );
            return (
              <div
                key={dateKey(day)}
                className="grid gap-3"
                style={{ gridTemplateColumns: "160px minmax(0,1fr)" }}
              >
                <div className="rounded-[22px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 transition-colors">
                  <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                    {formatDayHeader(day)}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {daySessions.length} scheduled
                  </div>
                </div>

                <div className="relative h-24 rounded-[22px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 transition-colors">
                  <div className="absolute inset-0 grid grid-cols-16">
                    {hours.map((hour) => (
                      <div
                        key={hour}
                        className="border-r border-dashed border-slate-200 dark:border-slate-800"
                      />
                    ))}
                  </div>

                  {daySessions.map((session) => {
                    const startMinute = minuteOfDay(toDate(session.startISO));
                    const endMinute = minuteOfDay(toDate(session.endISO));
                    const left = ((startMinute - 360) / totalMinutes) * 100;
                    const width = ((endMinute - startMinute) / totalMinutes) * 100;
                    const readiness = buildReadiness(
                      session,
                      issuesForSession(session.id, conflicts),
                    );

                    return (
                      <button
                        key={session.id}
                        type="button"
                        onClick={() => onSelectSession(session.id)}
                        className={cx(
                          "absolute top-4 h-16 rounded-2xl px-3 py-2 text-left shadow-sm transition-all",
                          readiness.state === "Green"
                            ? "bg-emerald-500 text-white"
                            : readiness.state === "At risk"
                              ? "bg-amber-500 text-white"
                              : "bg-rose-500 text-white",
                          session.id === selectedSessionId ? "ring-4 ring-white/40" : "",
                        )}
                        style={{ left: `${left}%`, width: `${Math.max(width, 12)}%` }}
                      >
                        <div className="truncate text-[11px] font-semibold">
                          {session.title}
                        </div>
                        <div className="mt-1 text-[10px] opacity-90">
                          {formatSessionTimeRange(session)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MonthView({
  anchorDate,
  sessions,
  conflicts,
  onSelectSession,
  selectedSessionId,
}: {
  anchorDate: Date;
  sessions: LiveSession[];
  conflicts: ConflictRecord[];
  onSelectSession: (id: string) => void;
  selectedSessionId?: string | null;
}) {
  const cells = buildMonthGrid(anchorDate);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="grid min-w-[920px] grid-cols-7 gap-3">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div
            key={day}
            className="text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500"
          >
            {day}
          </div>
        ))}
        {cells.map((cell) => {
          const cellSessions = sessions
            .filter((session) => sameDay(toDate(session.startISO), cell))
            .sort((a, b) => toDate(a.startISO).getTime() - toDate(b.startISO).getTime());
          const isCurrentMonth = sameMonth(cell, anchorDate);

          return (
            <div
              key={dateKey(cell)}
              className={cx(
                "min-h-[150px] rounded-[22px] border p-2 transition-colors",
                isCurrentMonth
                  ? "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  : "border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-950",
              )}
            >
              <div className="flex items-center justify-between">
                <div
                  className={cx(
                    "text-[11px] font-semibold",
                    isCurrentMonth
                      ? "text-slate-700 dark:text-slate-200"
                      : "text-slate-400 dark:text-slate-500",
                  )}
                >
                  {cell.getDate()}
                </div>
                {cellSessions.length ? <Pill text={`${cellSessions.length}`} /> : null}
              </div>
              <div className="mt-2 space-y-2">
                {cellSessions.slice(0, 3).map((session) => {
                  const readiness = buildReadiness(
                    session,
                    issuesForSession(session.id, conflicts),
                  );
                  return (
                    <button
                      key={session.id}
                      type="button"
                      onClick={() => onSelectSession(session.id)}
                      className={cx(
                        "w-full rounded-xl border px-2 py-1.5 text-left text-[10px] transition-colors",
                        readiness.state === "Green"
                          ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300"
                          : readiness.state === "At risk"
                            ? "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300"
                            : "border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300",
                        session.id === selectedSessionId ? "ring-2 ring-slate-300 dark:ring-slate-600" : "",
                      )}
                    >
                      <div className="truncate font-semibold">
                        {formatTime(toDate(session.startISO))} Â· {session.title}
                      </div>
                    </button>
                  );
                })}
                {cellSessions.length > 3 ? (
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">
                    +{cellSessions.length - 3} more
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OperationsPreview({
  session,
  conflicts,
  providerTimezone,
  onResolve,
  onOpenDashboard,
  onOpenStudio,
  onCopyCard,
}: {
  session: LiveSession | null;
  conflicts: ConflictRecord[];
  providerTimezone: string;
  onResolve: () => void;
  onOpenDashboard: () => void;
  onOpenStudio: () => void;
  onCopyCard: () => void;
}) {
  if (!session) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70 p-5 text-[12px] text-slate-500 dark:text-slate-400">
        Pick a session to open the operational preview, staffing lane, readiness ribbon, and fast handoff actions.
      </div>
    );
  }

  const sessionIssues = issuesForSession(session.id, conflicts);
  const readiness = buildReadiness(session, sessionIssues);
  const timezones = timezonePreview(session, providerTimezone);

  return (
    <div className="space-y-4">
      <Card
        title="Operational preview"
        subtitle="Selected session summary, readiness, handoff, and impact."
        right={<Pill text={readiness.state} tone={readinessTone(readiness.state)} />}
      >
        <div
          className="rounded-[24px] p-4 text-white"
          style={{
            background:
              "linear-gradient(135deg, rgba(3,205,140,1) 0%, rgba(3,160,116,1) 55%, rgba(247,127,0,0.95) 100%)",
          }}
        >
          <div className="flex items-center gap-2 text-[11px] font-semibold opacity-95">
            <Radio className="h-4 w-4" />
            Live Session Operations
          </div>
          <div className="mt-2 text-[18px] font-extrabold leading-tight">
            {session.title}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] opacity-95">
            <span>{session.parentLabel}</span>
            <span>â€¢</span>
            <span>{formatDateTime(session.startISO)}</span>
            <span>â€¢</span>
            <span>{session.campus}</span>
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-white"
              style={{ width: `${readiness.score}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] font-semibold">
            Readiness score Â· {readiness.score}%
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
              Session intelligence
            </div>
            <div className="mt-2 space-y-2 text-[12px] text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                {session.venue} Â· {session.campus}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-400" />
                {session.speaker} Â· {session.audience}
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-slate-400" />
                {session.language} Â· {session.timezone}
              </div>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-slate-400" />
                {getImpactLabels(session)[2]}
              </div>
            </div>
          </div>

          <div className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
              Conflict & impact
            </div>
            <div className="mt-2 space-y-2 text-[12px] text-slate-700 dark:text-slate-300">
              {sessionIssues.length ? (
                sessionIssues.slice(0, 3).map((issue) => (
                  <div key={issue.id} className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" />
                    <span>{issue.label}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-start gap-2">
                  <BadgeCheck className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <span>No active conflict flags on this session.</span>
                </div>
              )}
              {getImpactLabels(session).map((label) => (
                <div key={label} className="flex items-start gap-2">
                  <ArrowRight className="mt-0.5 h-4 w-4 text-slate-400" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[22px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
            Role coverage
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {([
              ["Host", session.roles.host],
              ["Producer", session.roles.producer],
              ["Moderator", session.roles.moderator],
              ["Caption", session.roles.caption],
              ["Interpreter", session.roles.interpreter],
              ["Support", session.roles.support],
            ] as Array<[string, string | undefined]>).map(([label, value]) => (
              <div
                key={label}
                className={cx(
                  "rounded-2xl border px-3 py-2 text-[12px]",
                  value
                    ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/15 text-emerald-800 dark:text-emerald-300"
                    : "border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/15 text-rose-800 dark:text-rose-300",
                )}
              >
                <div className="font-semibold">{label}</div>
                <div className="mt-1 text-[11px]">{value || "Missing assignment"}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-[22px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
            Time-zone safety
          </div>
          <div className="mt-3 space-y-2">
            {timezones.map((item) => (
              <div
                key={item.zone}
                className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-[12px]"
              >
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {item.zone}
                </span>
                <span className="text-slate-500 dark:text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <PrimaryButton tone="green" onClick={onOpenDashboard}>
            <MonitorPlay className="h-4 w-4" /> Open session dashboard
          </PrimaryButton>
          <SoftButton onClick={onOpenStudio}>
            <Radio className="h-4 w-4" /> Open studio
          </SoftButton>
          <SoftButton onClick={onResolve}>
            <Wand2 className="h-4 w-4" /> Resolve conflict
          </SoftButton>
          <SoftButton onClick={onCopyCard}>
            <Copy className="h-4 w-4" /> Copy schedule card
          </SoftButton>
        </div>
      </Card>
    </div>
  );
}

function StaffingLane({
  sessions,
  conflicts,
  onSelectSession,
}: {
  sessions: LiveSession[];
  conflicts: ConflictRecord[];
  onSelectSession: (id: string) => void;
}) {
  const rows = [...sessions]
    .sort((a, b) => toDate(a.startISO).getTime() - toDate(b.startISO).getTime())
    .slice(0, 5);

  return (
    <Card
      title="Operational staffing lane"
      subtitle="Who is producing, moderating, captioning, interpreting, and supporting each live session."
    >
      <div className="space-y-3">
        {rows.map((session) => {
          const readiness = buildReadiness(session, issuesForSession(session.id, conflicts));
          const gaps = [
            !session.roles.producer ? "Producer" : null,
            !session.roles.moderator ? "Moderator" : null,
            !session.roles.caption ? "Caption" : null,
          ].filter(Boolean) as string[];

          return (
            <button
              key={session.id}
              type="button"
              onClick={() => onSelectSession(session.id)}
              className="w-full rounded-[22px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                    {session.title}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {formatSessionTimeRange(session)} Â· {session.campus}
                  </div>
                </div>
                <Pill text={readiness.state} tone={readinessTone(readiness.state)} />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {([
                  ["Producer", session.roles.producer],
                  ["Moderator", session.roles.moderator],
                  ["Caption", session.roles.caption],
                  ["Interpreter", session.roles.interpreter],
                ] as Array<[string, string | undefined]>).map(([label, value]) => (
                  <div
                    key={label}
                    className={cx(
                      "rounded-2xl border px-2.5 py-2 text-[11px]",
                      value
                        ? "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300"
                        : "border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/15 text-rose-700 dark:text-rose-300",
                    )}
                  >
                    <div className="font-semibold">{label}</div>
                    <div className="mt-1 truncate">{value || "Coverage gap"}</div>
                  </div>
                ))}
              </div>

              {gaps.length ? (
                <div className="mt-2 text-[11px] text-rose-600 dark:text-rose-400">
                  Coverage gaps: {gaps.join(", ")}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function ExportCard({
  sessions,
  selectedSession,
  showToast,
}: {
  sessions: LiveSession[];
  selectedSession: LiveSession | null;
  showToast: (message: string) => void;
}) {
  return (
    <Card
      title="Export & share"
      subtitle="Printable run sheets, calendar exports, internal links, and quick-copy schedule cards."
    >
      <div className="grid gap-2">
        <SoftButton
          onClick={() => {
            if (typeof window !== "undefined") window.print();
          }}
        >
          <Printer className="h-4 w-4" /> Print run sheet
        </SoftButton>
        <SoftButton
          onClick={() => {
            if (typeof window !== "undefined") {
              window.open(generateScheduleICS(sessions), "_blank");
              showToast("Calendar export opened.");
            }
          }}
        >
          <Download className="h-4 w-4" /> Export calendar (.ics)
        </SoftButton>
        <SoftButton
          onClick={() => {
            const payload = selectedSession
              ? `${selectedSession.title} Â· ${formatDateTime(
                  selectedSession.startISO,
                )} Â· ${selectedSession.campus} Â· ${selectedSession.venue}`
              : "FaithHub Live Schedule";
            copyText(payload);
            showToast("Schedule card copied for internal chat.");
          }}
        >
          <Copy className="h-4 w-4" /> Copy schedule card
        </SoftButton>
        <SoftButton
          onClick={() => {
            copyText(
              `https://faithhub.local/provider/live-schedule?view=week&share=ops`,
            );
            showToast("Internal share link copied.");
          }}
        >
          <Link2 className="h-4 w-4" /> Copy internal share link
        </SoftButton>
      </div>
    </Card>
  );
}

function QuickAddDrawer({
  open,
  onClose,
  onSave,
  defaultDate,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (draft: QuickAddDraft) => void;
  defaultDate: string;
}) {
  const [draft, setDraft] = useState<QuickAddDraft>({
    title: "",
    campus: "Central Campus",
    sessionType: "Teaching",
    language: "English",
    audience: "All Church",
    speaker: "Pastor Daniel M.",
    venue: "Main Sanctuary",
    dateISO: defaultDate,
    startTime: "19:00",
    durationMin: 60,
    recurrence: "One-time",
    timezone: "Africa/Kampala",
  });

  useEffect(() => {
    if (!open) return;
    setDraft((current) => ({ ...current, dateISO: defaultDate }));
  }, [open, defaultDate]);

  const canSave = draft.title.trim().length > 2;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Add to schedule"
      subtitle="Create a new live slot with recurrence, audience, and timezone settings."
    >
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Session title</Label>
            <Input
              value={draft.title}
              onChange={(value) => setDraft((current) => ({ ...current, title: value }))}
              placeholder="e.g. Saturday Prayer Clinic"
            />
          </div>

          <div>
            <Label>Campus</Label>
            <SelectField
              value={draft.campus}
              onChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  campus: value as LiveSession["campus"],
                }))
              }
              options={CAMPUSES}
            />
          </div>

          <div>
            <Label>Venue</Label>
            <Input
              value={draft.venue}
              onChange={(value) => setDraft((current) => ({ ...current, venue: value }))}
              placeholder="Main Hall"
            />
          </div>

          <div>
            <Label>Session type</Label>
            <SelectField
              value={draft.sessionType}
              onChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  sessionType: value as LiveSession["sessionType"],
                }))
              }
              options={SESSION_TYPES}
            />
          </div>

          <div>
            <Label>Speaker</Label>
            <SelectField
              value={draft.speaker}
              onChange={(value) => setDraft((current) => ({ ...current, speaker: value }))}
              options={[
                "Pastor Daniel M.",
                "Minister Ruth K.",
                "Pastor Samuel A.",
                "Pastor Grace L.",
              ]}
            />
          </div>

          <div>
            <Label>Language</Label>
            <SelectField
              value={draft.language}
              onChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  language: value as LiveSession["language"],
                }))
              }
              options={LANGUAGES}
            />
          </div>

          <div>
            <Label>Audience</Label>
            <SelectField
              value={draft.audience}
              onChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  audience: value as LiveSession["audience"],
                }))
              }
              options={AUDIENCES}
            />
          </div>

          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={draft.dateISO}
              onChange={(value) => setDraft((current) => ({ ...current, dateISO: value }))}
            />
          </div>

          <div>
            <Label>Start time</Label>
            <Input
              type="time"
              value={draft.startTime}
              onChange={(value) => setDraft((current) => ({ ...current, startTime: value }))}
            />
          </div>

          <div>
            <Label>Duration (minutes)</Label>
            <Input
              type="number"
              value={String(draft.durationMin)}
              onChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  durationMin: Math.max(15, Number(value || 0)),
                }))
              }
            />
          </div>

          <div>
            <Label>Recurrence & rhythm</Label>
            <SelectField
              value={draft.recurrence}
              onChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  recurrence: value as LiveSession["recurrence"],
                }))
              }
              options={["One-time", "Weekly", "Monthly", "Seasonal Campaign"]}
            />
          </div>

          <div className="sm:col-span-2">
            <Label>Timezone</Label>
            <SelectField
              value={draft.timezone}
              onChange={(value) => setDraft((current) => ({ ...current, timezone: value }))}
              options={TIMEZONE_OPTIONS}
            />
          </div>
        </div>

        <div className="rounded-[24px] border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/15 p-3 text-[11px] text-emerald-800 dark:text-emerald-300">
          New sessions open with a draft-style readiness profile so missing staffing or graphics can be resolved before broadcast day.
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <SoftButton onClick={onClose}>Cancel</SoftButton>
          <PrimaryButton
            onClick={() => {
              if (!canSave) return;
              onSave(draft);
              onClose();
            }}
            disabled={!canSave}
          >
            <Plus className="h-4 w-4" /> Add to schedule
          </PrimaryButton>
        </div>
      </div>
    </Drawer>
  );
}

function RescheduleDrawer({
  open,
  onClose,
  session,
  sessions,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  session: LiveSession | null;
  sessions: LiveSession[];
  onApply: (sessionId: string, startISO: string, endISO: string) => void;
}) {
  const suggestions = useMemo(
    () => (session ? buildSuggestions(session, sessions) : []),
    [session, sessions],
  );

  if (!session) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Resolve conflict"
      subtitle="Auto-reschedule suggestions account for staffing, venue pressure, and audience overlap."
    >
      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
            {session.title}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {formatDateTime(session.startISO)} Â· {session.campus} Â· {session.venue}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {getImpactLabels(session).map((label) => (
              <Pill key={label} text={label} />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                    {suggestion.label}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {suggestion.reason}
                  </div>
                  <div className="mt-2">
                    <Pill text={suggestion.impactLabel} tone="good" />
                  </div>
                </div>
                <PrimaryButton
                  tone="green"
                  onClick={() => {
                    onApply(session.id, suggestion.startISO, suggestion.endISO);
                    onClose();
                  }}
                >
                  <RefreshCw className="h-4 w-4" /> Apply suggestion
                </PrimaryButton>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[24px] border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/15 p-4 text-[11px] text-amber-800 dark:text-amber-300">
          Drag-and-reschedule inside the week view is also enabled. Every move preserves the session duration and calls out impacted reminders, staff assignments, destinations, and event tie-ins.
        </div>
      </div>
    </Drawer>
  );
}

function MobilePreviewDrawer(props: React.ComponentProps<typeof Drawer> & { children: React.ReactNode }) {
  return <Drawer {...props} />;
}

export default function FaithHubLiveSchedulePage() {
  const [sessions, setSessions] = useState<LiveSession[]>(SESSION_SEED);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [savedView, setSavedView] = useState<SavedView>("production");
  const [anchorDate, setAnchorDate] = useState<Date>(new Date("2026-04-15T10:00:00"));
  const [providerTimezone, setProviderTimezone] = useState("Africa/Kampala");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    SESSION_SEED[2]?.id || null,
  );
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    campus: "All",
    speaker: "All",
    language: "All",
    audience: "All",
    sessionType: "All",
  });
  const [toast, setToast] = useState<string | null>(null);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [draggingSessionId, setDraggingSessionId] = useState<string | null>(null);

  const showToast = (message: string) => setToast(message);

  const conflictRecords = useMemo(() => detectConflicts(sessions), [sessions]);

  const filteredSessions = useMemo(() => {
    return sessions
      .filter((session) => applySavedViewScope(session, savedView))
      .filter((session) => sessionMatchesFilters(session, filters));
  }, [sessions, savedView, filters]);

  const selectedSession =
    filteredSessions.find((session) => session.id === selectedSessionId) ||
    sessions.find((session) => session.id === selectedSessionId) ||
    null;

  useEffect(() => {
    if (!selectedSessionId && filteredSessions.length) {
      setSelectedSessionId(filteredSessions[0].id);
      return;
    }
    if (selectedSessionId && !filteredSessions.some((session) => session.id === selectedSessionId)) {
      if (filteredSessions.length) setSelectedSessionId(filteredSessions[0].id);
    }
  }, [filteredSessions, selectedSessionId]);

  const weekStart = startOfWeek(anchorDate);
  const weekEnd = addDays(weekStart, 7);
  const weekSessions = filteredSessions.filter((session) => {
    const start = toDate(session.startISO);
    return start >= weekStart && start < weekEnd;
  });

  const daySessions = filteredSessions.filter((session) =>
    sameDay(toDate(session.startISO), anchorDate),
  );

  const monthSessions = filteredSessions.filter((session) =>
    sameMonth(toDate(session.startISO), anchorDate),
  );

  const agendaSessions = [...filteredSessions].sort(
    (a, b) => toDate(a.startISO).getTime() - toDate(b.startISO).getTime(),
  );

  const scheduleHealth = useMemo(() => {
    return sessions.reduce(
      (acc, session) => {
        const readiness = buildReadiness(session, issuesForSession(session.id, conflictRecords));
        acc.total += 1;
        if (readiness.state === "Green") acc.green += 1;
        if (readiness.state === "At risk") acc.warn += 1;
        if (readiness.state === "Blocked") acc.blocked += 1;
        return acc;
      },
      { total: 0, green: 0, warn: 0, blocked: 0 },
    );
  }, [sessions, conflictRecords]);

  const firstConflictSession = useMemo(() => {
    const target = sessions.find(
      (session) => issuesForSession(session.id, conflictRecords).length > 0,
    );
    return target || null;
  }, [sessions, conflictRecords]);

  const recommendationSource = selectedSession || firstConflictSession;

  const suggestionCards = useMemo(
    () =>
      recommendationSource
        ? buildSuggestions(recommendationSource, sessions)
        : [],
    [recommendationSource, sessions],
  );

  function shiftAnchor(direction: "prev" | "next") {
    setAnchorDate((current) => {
      if (viewMode === "day") return addDays(current, direction === "next" ? 1 : -1);
      if (viewMode === "month") return addMonths(current, direction === "next" ? 1 : -1);
      return addDays(current, direction === "next" ? 7 : -7);
    });
  }

  function moveSession(sessionId: string, dayDate: Date) {
    setSessions((current) =>
      current.map((session) => {
        if (session.id !== sessionId) return session;
        const currentStart = toDate(session.startISO);
        const currentEnd = toDate(session.endISO);
        const duration = currentEnd.getTime() - currentStart.getTime();
        const nextStart = mergeDateAndTime(dayDate, currentStart);
        const nextEnd = new Date(nextStart.getTime() + duration);
        return {
          ...session,
          startISO: nextStart.toISOString().slice(0, 19),
          endISO: nextEnd.toISOString().slice(0, 19),
        };
      }),
    );

    setSelectedSessionId(sessionId);
    showToast("Session rescheduled. Review impacted staff, reminders, and destinations.");
  }

  function addQuickSession(draft: QuickAddDraft) {
    const start = new Date(`${draft.dateISO}T${draft.startTime}:00`);
    const end = new Date(start.getTime() + draft.durationMin * 60000);
    const supportLabel =
      draft.campus === "East Campus"
        ? "Support Team â€“ East Campus"
        : "Support Team â€“ Central Campus";

    const nextSession: LiveSession = {
      id: `FH-LS-${Math.floor(Math.random() * 900 + 400)}`,
      title: draft.title,
      parentLabel: "Standalone Live",
      parentType: "Standalone Live",
      sessionType: draft.sessionType,
      campus: draft.campus,
      venue: draft.venue,
      language: draft.language,
      audience: draft.audience,
      speaker: draft.speaker,
      startISO: start.toISOString().slice(0, 19),
      endISO: end.toISOString().slice(0, 19),
      timezone: draft.timezone,
      destinations: ["FaithHub"],
      avResources: draft.campus === "East Campus" ? ["Portable Kit C"] : ["Main Stage Kit A"],
      roles: {
        host: draft.speaker,
        producer: "Producer Claire N.",
        moderator: "",
        caption: "",
        support: supportLabel,
      },
      recurrence: draft.recurrence,
      registrations: 0,
      notesReady: true,
      graphicsReady: false,
      credentialsReady: true,
      translationEnabled: false,
    };

    setSessions((current) => [...current, nextSession]);
    setSelectedSessionId(nextSession.id);
    showToast("Live session added to the operational calendar.");
  }

  function applySuggestion(sessionId: string, startISO: string, endISO: string) {
    setSessions((current) =>
      current.map((session) =>
        session.id === sessionId ? { ...session, startISO, endISO } : session,
      ),
    );
    setSelectedSessionId(sessionId);
    showToast("Auto-reschedule suggestion applied.");
  }

  function openSelectedDashboard() {
    const target = selectedSession || firstConflictSession;
    if (!target) return;
    safeNav(`${ROUTES.liveDashboard}?sessionId=${target.id}`);
  }

  function copySelectedCard() {
    const target = selectedSession || firstConflictSession;
    if (!target) return;
    copyText(
      `${target.title}\n${formatDateTime(target.startISO)}\n${target.campus} Â· ${target.venue}\n${target.speaker}`,
    );
    showToast("Schedule card copied.");
  }

  const mobilePreviewContent = (
    <div className="space-y-4">
      <OperationsPreview
        session={selectedSession}
        conflicts={conflictRecords}
        providerTimezone={providerTimezone}
        onResolve={() => setRescheduleOpen(true)}
        onOpenDashboard={openSelectedDashboard}
        onOpenStudio={() => {
          const target = selectedSession || firstConflictSession;
          if (!target) return;
          safeNav(`${ROUTES.liveStudio}?sessionId=${target.id}`);
        }}
        onCopyCard={copySelectedCard}
      />
      <StaffingLane
        sessions={weekSessions.length ? weekSessions : agendaSessions}
        conflicts={conflictRecords}
        onSelectSession={(id) => {
          setSelectedSessionId(id);
          setPreviewOpen(true);
        }}
      />
      <ExportCard
        sessions={weekSessions.length ? weekSessions : agendaSessions}
        selectedSession={selectedSession}
        showToast={showToast}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto max-w-[1800px] px-4 pb-24 pt-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Pill text="FH-P-031" icon={<CalendarDays className="h-3.5 w-3.5" />} />
              <Pill text="Live Sessionz Operations" tone="good" />
            </div>
            <div className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              Live Schedule
            </div>
            <div className="mt-2 max-w-3xl text-[13px] leading-6 text-slate-600 dark:text-slate-400">
              World-class operational calendar for all live activity â€” with day, week, month, timeline, and agenda views, staffing intelligence, readiness ribbons, conflict detection, recurrence tools, timezone safety, and fast handoff into Live Dashboard or Studio.
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span>{SAVED_VIEW_CONFIG[savedView].label} view</span>
              <span>â€¢</span>
              <span>{formatMonthHeader(anchorDate)}</span>
              <span>â€¢</span>
              <span>{scheduleHealth.green} green / {scheduleHealth.warn} at risk / {scheduleHealth.blocked} blocked</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SoftButton onClick={() => setPreviewOpen(true)} className="lg:hidden">
              <Eye className="h-4 w-4" /> Preview
            </SoftButton>
            <PrimaryButton onClick={() => setQuickAddOpen(true)}>
              <Plus className="h-4 w-4" /> Add to schedule
            </PrimaryButton>
            <SoftButton
              onClick={() => {
                if (!firstConflictSession) {
                  showToast("No active conflicts right now.");
                  return;
                }
                setSelectedSessionId(firstConflictSession.id);
                setRescheduleOpen(true);
              }}
            >
              <Wand2 className="h-4 w-4" /> Resolve conflict
            </SoftButton>
            <PrimaryButton tone="green" onClick={openSelectedDashboard}>
              <MonitorPlay className="h-4 w-4" /> Open session dashboard
            </PrimaryButton>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-2">
            <Card
              title="Schedule health"
              subtitle="Readiness ribbon totals across all upcoming live activity."
            >
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-[22px] border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/15 p-3 text-center">
                  <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">
                    {scheduleHealth.green}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                    Green
                  </div>
                </div>
                <div className="rounded-[22px] border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/15 p-3 text-center">
                  <div className="text-2xl font-extrabold text-amber-700 dark:text-amber-300">
                    {scheduleHealth.warn}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                    At risk
                  </div>
                </div>
                <div className="rounded-[22px] border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/15 p-3 text-center">
                  <div className="text-2xl font-extrabold text-rose-700 dark:text-rose-300">
                    {scheduleHealth.blocked}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold text-rose-800 dark:text-rose-300">
                    Blocked
                  </div>
                </div>
              </div>
            </Card>

            <Card
              title="Board-style saved views"
              subtitle="Production, pastoral, outreach, and finance teams can jump into their own operational lens."
            >
              <div className="space-y-2">
                {(Object.keys(SAVED_VIEW_CONFIG) as SavedView[]).map((key) => {
                  const config = SAVED_VIEW_CONFIG[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSavedView(key)}
                      className={cx(
                        "w-full rounded-[22px] border px-3 py-3 text-left transition-colors",
                        savedView === key
                          ? "border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 shadow-sm"
                          : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 hover:bg-white dark:hover:bg-slate-900",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                          {config.label}
                        </div>
                        {savedView === key ? (
                          <div
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: config.accent }}
                          />
                        ) : null}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        {config.note}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card
              title="Recurrence & rhythms"
              subtitle="Weekly services, monthly gatherings, recurring classes, and seasonal campaigns."
            >
              <div className="space-y-2">
                {[
                  "Weekly service rhythm",
                  "Monthly teaching intensive",
                  "Recurring discipleship class",
                  "Seasonal campaign overlay",
                ].map((label) => (
                  <div
                    key={label}
                    className="rounded-[20px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-[12px] text-slate-700 dark:text-slate-300"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title="Holiday & timezone safety"
              subtitle="Provider-wide blackout periods, holiday notes, and timezone management."
            >
              <div className="space-y-3">
                <div>
                  <Label>Provider timezone</Label>
                  <SelectField
                    value={providerTimezone}
                    onChange={setProviderTimezone}
                    options={TIMEZONE_OPTIONS}
                  />
                </div>
                <div className="space-y-2">
                  {BLACKOUTS.map((blackout) => (
                    <div
                      key={blackout.id}
                      className="rounded-[20px] border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/15 p-3 text-[11px] text-amber-800 dark:text-amber-300"
                    >
                      <div className="font-semibold">{blackout.label}</div>
                      <div className="mt-1">
                        {blackout.campus} Â· {blackout.dateISO} Â· {blackout.time}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {HOLIDAY_NOTES.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[20px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-[11px] text-slate-500 dark:text-slate-400"
                    >
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.label}
                      </div>
                      <div className="mt-1">{item.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card
              title="Fast handoff"
              subtitle="Jump straight into the connected provider workflow."
            >
              <div className="grid gap-2">
                <SoftButton onClick={() => safeNav(ROUTES.liveBuilder)}>
                  <Calendar className="h-4 w-4" /> Live Builder
                </SoftButton>
                <SoftButton onClick={openSelectedDashboard}>
                  <MonitorPlay className="h-4 w-4" /> Live Dashboard
                </SoftButton>
                <SoftButton onClick={() => safeNav(ROUTES.eventsManager)}>
                  <ExternalLink className="h-4 w-4" /> Events Manager
                </SoftButton>
              </div>
            </Card>
          </div>

          <div className="space-y-4 lg:col-span-7">
            <Card
              title="Auto-reschedule suggestions"
              subtitle="Recommendations account for staffing, audience overlap, venue clashes, and recurring rhythm safety."
              right={
                <Pill
                  text={recommendationSource ? recommendationSource.title : "No suggestions"}
                  tone="good"
                  icon={<Sparkles className="h-3.5 w-3.5" />}
                />
              }
            >
              <div className="grid gap-3 md:grid-cols-3">
                {suggestionCards.length ? (
                  suggestionCards.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="rounded-[24px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4 transition-colors"
                    >
                      <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                        {suggestion.label}
                      </div>
                      <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                        {suggestion.reason}
                      </div>
                      <div className="mt-3">
                        <Pill text={suggestion.impactLabel} tone="good" />
                      </div>
                      <div className="mt-3">
                        <PrimaryButton
                          tone="green"
                          className="w-full justify-center"
                          onClick={() => applySuggestion(suggestion.sessionId, suggestion.startISO, suggestion.endISO)}
                        >
                          <RefreshCw className="h-4 w-4" /> Apply
                        </PrimaryButton>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[24px] border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-6 text-[12px] text-slate-500 dark:text-slate-400 md:col-span-3">
                    No conflict-driven suggestions are required right now. Use the filters or select a different saved view to inspect a specific operational lane.
                  </div>
                )}
              </div>
            </Card>

            <Card
              title="Calendar, timeline, and agenda"
              subtitle="Day, week, month, timeline, and agenda layouts with filters for campus, speaker, language, audience, and session type."
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <ViewToggle view={viewMode} setView={setViewMode} />
                  <div className="flex flex-wrap items-center gap-2">
                    <SoftButton onClick={() => shiftAnchor("prev")}>
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </SoftButton>
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-[12px] font-semibold text-slate-700 dark:text-slate-200">
                      {viewMode === "month"
                        ? formatMonthHeader(anchorDate)
                        : viewMode === "day"
                          ? formatDayHeader(anchorDate)
                          : `${formatDayHeader(weekStart)} â†’ ${formatDayHeader(addDays(weekStart, 6))}`}
                    </div>
                    <SoftButton onClick={() => shiftAnchor("next")}>
                      Next <ChevronRight className="h-4 w-4" />
                    </SoftButton>
                  </div>
                </div>

                <div className="grid gap-3 lg:grid-cols-6">
                  <div className="lg:col-span-2">
                    <Label>Search</Label>
                    <div className="relative mt-1">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        value={filters.search}
                        onChange={(event) =>
                          setFilters((current) => ({ ...current, search: event.target.value }))
                        }
                        placeholder="Search title, speaker, venueâ€¦"
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 pl-9 pr-3 text-[12px] text-slate-900 dark:text-slate-100 outline-none transition-colors focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/30"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Campus</Label>
                    <SelectField
                      value={filters.campus}
                      onChange={(value) =>
                        setFilters((current) => ({ ...current, campus: value }))
                      }
                      options={["All", ...CAMPUSES]}
                    />
                  </div>

                  <div>
                    <Label>Speaker</Label>
                    <SelectField
                      value={filters.speaker}
                      onChange={(value) =>
                        setFilters((current) => ({ ...current, speaker: value }))
                      }
                      options={[
                        "All",
                        "Pastor Daniel M.",
                        "Minister Ruth K.",
                        "Pastor Samuel A.",
                        "Pastor Grace L.",
                      ]}
                    />
                  </div>

                  <div>
                    <Label>Language</Label>
                    <SelectField
                      value={filters.language}
                      onChange={(value) =>
                        setFilters((current) => ({ ...current, language: value }))
                      }
                      options={["All", ...LANGUAGES]}
                    />
                  </div>

                  <div>
                    <Label>Audience</Label>
                    <SelectField
                      value={filters.audience}
                      onChange={(value) =>
                        setFilters((current) => ({ ...current, audience: value }))
                      }
                      options={["All", ...AUDIENCES]}
                    />
                  </div>

                  <div>
                    <Label>Session type</Label>
                    <SelectField
                      value={filters.sessionType}
                      onChange={(value) =>
                        setFilters((current) => ({ ...current, sessionType: value }))
                      }
                      options={["All", ...SESSION_TYPES]}
                    />
                  </div>
                </div>

                {conflictRecords.length ? (
                  <div className="rounded-[24px] border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/15 p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[13px] font-semibold text-amber-900 dark:text-amber-100">
                          <AlertTriangle className="h-4 w-4" />
                          Conflict detection engine found {conflictRecords.length} issue{conflictRecords.length === 1 ? "" : "s"}
                        </div>
                        <div className="mt-1 text-[11px] text-amber-800 dark:text-amber-300">
                          Overlaps, double-booked speakers, venue clashes, AV resource pressure, blackout collisions, and staffing gaps are highlighted here before the broadcast day arrives.
                        </div>
                      </div>
                      <SoftButton
                        onClick={() => {
                          if (firstConflictSession) {
                            setSelectedSessionId(firstConflictSession.id);
                            setRescheduleOpen(true);
                          }
                        }}
                        className="border-amber-300 dark:border-amber-700 bg-white/80 dark:bg-slate-900/70 text-amber-900 dark:text-amber-200"
                      >
                        <Wand2 className="h-4 w-4" /> Resolve first conflict
                      </SoftButton>
                    </div>
                  </div>
                ) : null}

                {viewMode === "day" ? (
                  <DayView
                    date={anchorDate}
                    sessions={daySessions}
                    conflicts={conflictRecords}
                    selectedSessionId={selectedSessionId}
                    onSelectSession={setSelectedSessionId}
                  />
                ) : null}

                {viewMode === "week" ? (
                  <WeekView
                    anchorDate={anchorDate}
                    sessions={weekSessions}
                    conflicts={conflictRecords}
                    selectedSessionId={selectedSessionId}
                    onSelectSession={setSelectedSessionId}
                    onMoveSession={moveSession}
                    setDraggingSessionId={setDraggingSessionId}
                    draggingSessionId={draggingSessionId}
                  />
                ) : null}

                {viewMode === "timeline" ? (
                  <TimelineView
                    anchorDate={anchorDate}
                    sessions={weekSessions}
                    conflicts={conflictRecords}
                    selectedSessionId={selectedSessionId}
                    onSelectSession={setSelectedSessionId}
                  />
                ) : null}

                {viewMode === "month" ? (
                  <MonthView
                    anchorDate={anchorDate}
                    sessions={monthSessions}
                    conflicts={conflictRecords}
                    selectedSessionId={selectedSessionId}
                    onSelectSession={setSelectedSessionId}
                  />
                ) : null}

                {viewMode === "agenda" ? (
                  <div className="space-y-3">
                    {agendaSessions.length ? (
                      agendaSessions.map((session) => (
                        <AgendaRow
                          key={session.id}
                          session={session}
                          conflicts={conflictRecords}
                          onSelect={() => setSelectedSessionId(session.id)}
                          onOpenDashboard={() => safeNav(`${ROUTES.liveDashboard}?sessionId=${session.id}`)}
                          onResolve={() => {
                            setSelectedSessionId(session.id);
                            setRescheduleOpen(true);
                          }}
                        />
                      ))
                    ) : (
                      <div className="rounded-[24px] border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-6 text-center text-[12px] text-slate-500 dark:text-slate-400">
                        No live sessions match the current saved view and filter stack.
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </Card>
          </div>

          <div className="hidden space-y-4 lg:col-span-3 lg:block">
            <OperationsPreview
              session={selectedSession}
              conflicts={conflictRecords}
              providerTimezone={providerTimezone}
              onResolve={() => setRescheduleOpen(true)}
              onOpenDashboard={openSelectedDashboard}
              onOpenStudio={() => {
                const target = selectedSession || firstConflictSession;
                if (!target) return;
                safeNav(`${ROUTES.liveStudio}?sessionId=${target.id}`);
              }}
              onCopyCard={copySelectedCard}
            />
            <StaffingLane
              sessions={weekSessions.length ? weekSessions : agendaSessions}
              conflicts={conflictRecords}
              onSelectSession={setSelectedSessionId}
            />
            <ExportCard
              sessions={weekSessions.length ? weekSessions : agendaSessions}
              selectedSession={selectedSession}
              showToast={showToast}
            />
          </div>
        </div>
      </div>

      <QuickAddDrawer
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onSave={addQuickSession}
        defaultDate={toISODateInput(anchorDate)}
      />

      <RescheduleDrawer
        open={rescheduleOpen}
        onClose={() => setRescheduleOpen(false)}
        session={selectedSession || firstConflictSession}
        sessions={sessions}
        onApply={applySuggestion}
      />

      <MobilePreviewDrawer
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Live Schedule Preview"
        subtitle="Selected session, staffing lane, and share/export tools."
      >
        {mobilePreviewContent}
      </MobilePreviewDrawer>

      <AnimatePresence>{toast ? <Toast message={toast} onClose={() => setToast(null)} /> : null}</AnimatePresence>
    </div>
  );
}

