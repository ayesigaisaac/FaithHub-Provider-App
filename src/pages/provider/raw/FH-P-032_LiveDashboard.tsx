// @ts-nocheck
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bell,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Copy,
  Eye,
  Globe2,
  HeartHandshake,
  Layers,
  Link2,
  Megaphone,
  MessageSquare,
  Mic,
  MonitorPlay,
  PlayCircle,
  Radio,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Users,
  Video,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import { KpiTile } from "../../../components/ui/KpiTile";
import { navigateWithRouter } from "@/navigation/routerNavigate";
import { ProviderPageTitle } from "@/components/provider/ProviderPageTitle";

/**
 * Provider — Live Dashboard
 * ----------------------------------
 * Premium control-room page for a specific Live Session.
 *
 * Design intent
 * - Follow the premium card grammar used in the creator base files and the previous Provider pages.
 * - Use EVzone Green as the primary brand colour and Orange as the secondary action colour.
 * - Keep the page operationally rich: session health, team readiness, audience pulse,
 *   conversions, moderation tools, incident playbooks, and a post-live launch pad.
 * - Preserve a right-side preview rail and a mobile preview drawer, mirroring the premium
 *   preview behaviour used in the earlier generated pages.
 *
 * Notes
 * - This is a self-contained TSX page using React, Tailwind-style classes, lucide-react icons,
 *   and framer-motion for the mobile drawer.
 * - Replace mock data and safe navigation hooks with your real Provider data sources and routing.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";

const ROUTES = {
  liveSchedule: "/faithhub/provider/live-schedule",
  liveStudio: "/faithhub/provider/live-studio",
  audienceNotifications: "/faithhub/provider/audience-notifications",
  reviewsModeration: "/faithhub/provider/reviews-moderation",
  postLivePublishing: "/faithhub/provider/post-live-publishing",
  beaconBuilder: "/faithhub/provider/beacon-builder",
};

type SessionState = "Upcoming" | "Live" | "Ended";
type HealthTone = "Healthy" | "Watch" | "Incident";
type Severity = "info" | "warn" | "danger";
type Readiness = "Ready" | "Joining" | "Missing";

type DestinationStatus = {
  name: string;
  status: "Healthy" | "Delayed" | "Failed" | "Standby";
};

type TeamMember = {
  role: string;
  name: string;
  readiness: Readiness;
  checked: boolean;
  critical?: boolean;
};

type AlertItem = {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  playbook: string;
  owner: string;
};

type SessionData = {
  id: string;
  title: string;
  state: SessionState;
  parentLabel: string;
  parentType:
    | "Series Episode"
    | "Standalone Teaching"
    | "Event"
    | "Giving Moment"
    | "Standalone Live";
  audienceLabel: string;
  locationLabel: string;
  timezone: string;
  startISO: string;
  endISO: string;
  hosts: {
    host: string;
    cohost?: string;
    producer: string;
    moderator: string;
  };
  health: {
    critical: HealthTone;
    ingestHealth: number;
    bitrateMbps: number;
    fps: number;
    audioConfidence: number;
    latencySec: number;
    destinationSync: number;
    recording: boolean;
    backupReady: boolean;
    trend: number[];
  };
  destinations: DestinationStatus[];
  team: TeamMember[];
  audience: {
    registrants: number;
    waitingRoom: number;
    viewers: number;
    peakViewers: number;
    chatVelocity: number;
    qnaLoad: number;
    prayerRequests: number;
    forecastArrival: number;
    dropOffRisk: "Low" | "Watch" | "High";
    arrivalTrend: number[];
  };
  conversion: {
    donationTotal: number;
    crowdfundRaised: number;
    crowdfundTarget: number;
    eventSignups: number;
    merchClicks: number;
    beaconHandoffs: number;
    responseLabel: string;
  };
  alerts: AlertItem[];
  postLive: {
    replayReadiness: number;
    clipOpportunities: number;
    followUpSegments: number;
    markersCaptured: number;
    nextActions: string[];
  };
  cover: {
    eyebrow: string;
    promise: string;
    gradient: string;
  };
  moderationDefaults: {
    slowMode: boolean;
    pinnedNotice: boolean;
    audienceMute: boolean;
    prayerTriage: boolean;
  };
};

const cx = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  navigateWithRouter(url);
}

const now = Date.now();
function shiftMinutes(minutes: number) {
  return new Date(now + minutes * 60 * 1000).toISOString();
}

const SESSIONS: SessionData[] = [
  {
    id: "fh-live-032-a",
    title: "Sunday Encounter Live",
    state: "Upcoming",
    parentLabel: "The Way of Grace • Episode 4",
    parentType: "Series Episode",
    audienceLabel: "All Church • Families • Swahili track enabled",
    locationLabel: "Main Sanctuary · Central Campus",
    timezone: "Africa/Kampala",
    startISO: shiftMinutes(18),
    endISO: shiftMinutes(108),
    hosts: {
      host: "Pastor Daniel M.",
      cohost: "Minister Ruth K.",
      producer: "Producer Claire N.",
      moderator: "Moderator Tobi E.",
    },
    health: {
      critical: "Healthy",
      ingestHealth: 96,
      bitrateMbps: 6.4,
      fps: 30,
      audioConfidence: 94,
      latencySec: 2.8,
      destinationSync: 98,
      recording: true,
      backupReady: true,
      trend: [58, 61, 60, 63, 65, 66, 69, 71, 72, 70, 73, 74],
    },
    destinations: [
      { name: "Provider", status: "Healthy" },
      { name: "YouTube", status: "Healthy" },
      { name: "Facebook", status: "Standby" },
    ],
    team: [
      { role: "Host", name: "Pastor Daniel M.", readiness: "Ready", checked: true, critical: true },
      { role: "Co-host", name: "Minister Ruth K.", readiness: "Ready", checked: true },
      { role: "Producer", name: "Producer Claire N.", readiness: "Ready", checked: true, critical: true },
      { role: "Moderator", name: "Moderator Tobi E.", readiness: "Ready", checked: true, critical: true },
      { role: "Captioner", name: "Caption Lead Mercy J.", readiness: "Joining", checked: false, critical: true },
      { role: "Interpreter", name: "Grace L.", readiness: "Ready", checked: true },
      { role: "Support", name: "Support Team — Central", readiness: "Ready", checked: true },
    ],
    audience: {
      registrants: 1428,
      waitingRoom: 318,
      viewers: 0,
      peakViewers: 0,
      chatVelocity: 0,
      qnaLoad: 22,
      prayerRequests: 14,
      forecastArrival: 420,
      dropOffRisk: "Low",
      arrivalTrend: [12, 16, 19, 26, 32, 39, 44, 51, 60, 68, 77, 82],
    },
    conversion: {
      donationTotal: 1820,
      crowdfundRaised: 6700,
      crowdfundTarget: 15000,
      eventSignups: 46,
      merchClicks: 28,
      beaconHandoffs: 3,
      responseLabel: "Waiting-room arrival is tracking 76% of forecast — a last-minute reminder could push the room above baseline before start.",
    },
    alerts: [
      {
        id: "al-upcoming-1",
        severity: "warn",
        title: "Arrival tracking below forecast",
        description: "Waiting room is 102 people below the expected pre-live arrival curve for this stage.",
        playbook: "Send a last-minute reminder now, push the live link into follow-up channels, and keep the countdown slate visible until arrival normalizes.",
        owner: "Audience Notifications",
      },
      {
        id: "al-upcoming-2",
        severity: "info",
        title: "Caption operator check pending",
        description: "Caption Lead Mercy J. has joined backstage but has not completed caption confidence checks yet.",
        playbook: "Ping the caption operator and keep caption health on watch until the first test line is confirmed.",
        owner: "Team Readiness",
      },
    ],
    postLive: {
      replayReadiness: 54,
      clipOpportunities: 4,
      followUpSegments: 3,
      markersCaptured: 0,
      nextActions: [
        "Auto-package replay artwork the moment the session ends.",
        "Queue follow-up to registrants who miss the live start.",
        "Prepare a Beacon draft for the replay highlight card.",
      ],
    },
    cover: {
      eyebrow: "Live Session Operations",
      promise: "Hope-filled service with worship, teaching, prayer, and a focused giving moment.",
      gradient: "linear-gradient(135deg, #0f3f49 0%, #115b56 40%, #03cd8c 100%)",
    },
    moderationDefaults: {
      slowMode: false,
      pinnedNotice: true,
      audienceMute: false,
      prayerTriage: true,
    },
  },
  {
    id: "fh-live-032-b",
    title: "Youth Revival Night",
    state: "Live",
    parentLabel: "Youth Revival Night 2026",
    parentType: "Event",
    audienceLabel: "Youth • English + French captions",
    locationLabel: "Community Arena · East Campus",
    timezone: "Africa/Kampala",
    startISO: shiftMinutes(-37),
    endISO: shiftMinutes(53),
    hosts: {
      host: "Pastor Samuel A.",
      cohost: "Guest Host Neema J.",
      producer: "Producer Nathan P.",
      moderator: "Moderator Sarah A.",
    },
    health: {
      critical: "Watch",
      ingestHealth: 88,
      bitrateMbps: 5.8,
      fps: 29.97,
      audioConfidence: 81,
      latencySec: 3.4,
      destinationSync: 91,
      recording: true,
      backupReady: true,
      trend: [71, 72, 74, 76, 80, 84, 83, 85, 81, 82, 79, 80],
    },
    destinations: [
      { name: "Provider", status: "Healthy" },
      { name: "YouTube", status: "Delayed" },
      { name: "TikTok", status: "Healthy" },
    ],
    team: [
      { role: "Host", name: "Pastor Samuel A.", readiness: "Ready", checked: true, critical: true },
      { role: "Co-host", name: "Guest Host Neema J.", readiness: "Ready", checked: true },
      { role: "Producer", name: "Producer Nathan P.", readiness: "Ready", checked: true, critical: true },
      { role: "Moderator", name: "Moderator Sarah A.", readiness: "Ready", checked: true, critical: true },
      { role: "Captioner", name: "Caption Lead Mercy J.", readiness: "Ready", checked: true, critical: true },
      { role: "Interpreter", name: "Interpreter Caleb O.", readiness: "Ready", checked: true },
      { role: "Support", name: "Support Team — East", readiness: "Ready", checked: true },
    ],
    audience: {
      registrants: 2140,
      waitingRoom: 126,
      viewers: 1842,
      peakViewers: 1964,
      chatVelocity: 164,
      qnaLoad: 58,
      prayerRequests: 71,
      forecastArrival: 1750,
      dropOffRisk: "Watch",
      arrivalTrend: [31, 40, 52, 60, 68, 71, 75, 83, 88, 92, 89, 91],
    },
    conversion: {
      donationTotal: 8420,
      crowdfundRaised: 12980,
      crowdfundTarget: 18000,
      eventSignups: 203,
      merchClicks: 116,
      beaconHandoffs: 11,
      responseLabel: "Giving response is +18% above forecast, while Beacon-ready clip demand is spiking during testimony moments.",
    },
    alerts: [
      {
        id: "al-live-1",
        severity: "danger",
        title: "Host audio confidence dipped",
        description: "Primary host microphone fell below the safe confidence threshold during the last 90 seconds.",
        playbook: "Open studio audio panel, switch to backup host mic, and keep captions pinned until confidence stabilizes.",
        owner: "Technical Health",
      },
      {
        id: "al-live-2",
        severity: "warn",
        title: "YouTube destination is 9s behind",
        description: "External destination sync is delayed relative to the Provider master feed.",
        playbook: "Hold major CTA countdown overlays for 10 seconds or reset the YouTube destination profile after the current prayer segment.",
        owner: "Distribution",
      },
      {
        id: "al-live-3",
        severity: "warn",
        title: "Prayer triage queue is rising",
        description: "Prayer-request intake has crossed the comfort threshold for a single moderator.",
        playbook: "Route overflow requests to prayer support volunteers and switch to guided triage mode.",
        owner: "Moderation",
      },
    ],
    postLive: {
      replayReadiness: 72,
      clipOpportunities: 7,
      followUpSegments: 5,
      markersCaptured: 12,
      nextActions: [
        "Push the best testimony moment into the replay trailer stack.",
        "Follow up with youth attendees who clicked event sign-up but did not complete registration.",
        "Open a Beacon handoff for post-event recap promotion.",
      ],
    },
    cover: {
      eyebrow: "Live now • Control room",
      promise: "High-energy youth gathering with testimony, worship, live prayer, and a strong response moment.",
      gradient: "linear-gradient(135deg, #10253d 0%, #165a5f 46%, #03cd8c 100%)",
    },
    moderationDefaults: {
      slowMode: true,
      pinnedNotice: true,
      audienceMute: false,
      prayerTriage: true,
    },
  },
  {
    id: "fh-live-032-c",
    title: "Charity Prayer & Giving Moment",
    state: "Ended",
    parentLabel: "Community Borehole Appeal",
    parentType: "Giving Moment",
    audienceLabel: "Community • Supporters • Donation responders",
    locationLabel: "Online Campus · Outreach Broadcast Room",
    timezone: "Africa/Kampala",
    startISO: shiftMinutes(-88),
    endISO: shiftMinutes(-12),
    hosts: {
      host: "Minister Ruth K.",
      cohost: "Pastor Daniel M.",
      producer: "Producer Claire N.",
      moderator: "Moderator Tobi E.",
    },
    health: {
      critical: "Healthy",
      ingestHealth: 94,
      bitrateMbps: 6.1,
      fps: 30,
      audioConfidence: 95,
      latencySec: 2.4,
      destinationSync: 97,
      recording: true,
      backupReady: true,
      trend: [62, 65, 69, 71, 74, 76, 75, 77, 79, 81, 82, 84],
    },
    destinations: [
      { name: "Provider", status: "Healthy" },
      { name: "Facebook", status: "Healthy" },
      { name: "YouTube", status: "Healthy" },
    ],
    team: [
      { role: "Host", name: "Minister Ruth K.", readiness: "Ready", checked: true, critical: true },
      { role: "Co-host", name: "Pastor Daniel M.", readiness: "Ready", checked: true },
      { role: "Producer", name: "Producer Claire N.", readiness: "Ready", checked: true, critical: true },
      { role: "Moderator", name: "Moderator Tobi E.", readiness: "Ready", checked: true, critical: true },
      { role: "Captioner", name: "Caption Lead Mercy J.", readiness: "Ready", checked: true },
      { role: "Interpreter", name: "Interpreter Grace L.", readiness: "Ready", checked: true },
      { role: "Support", name: "Support Team — Outreach", readiness: "Ready", checked: true },
    ],
    audience: {
      registrants: 986,
      waitingRoom: 0,
      viewers: 0,
      peakViewers: 1146,
      chatVelocity: 0,
      qnaLoad: 12,
      prayerRequests: 34,
      forecastArrival: 0,
      dropOffRisk: "Low",
      arrivalTrend: [45, 52, 63, 71, 74, 79, 84, 88, 90, 92, 95, 100],
    },
    conversion: {
      donationTotal: 12480,
      crowdfundRaised: 21430,
      crowdfundTarget: 25000,
      eventSignups: 18,
      merchClicks: 0,
      beaconHandoffs: 8,
      responseLabel: "Crowdfund movement remained strong after the final prayer appeal — this session is ideal for replay plus campaign-update follow-up.",
    },
    alerts: [
      {
        id: "al-ended-1",
        severity: "info",
        title: "Replay cover is ready for approval",
        description: "AI-selected cover frames and donor-safe artwork options are packaged for the replay page.",
        playbook: "Review the selected cover, confirm the chapter list, and publish the replay while donor momentum is still warm.",
        owner: "Post-live Publishing",
      },
      {
        id: "al-ended-2",
        severity: "warn",
        title: "Update follow-up window is open",
        description: "High-intent donors from the live have not yet received a campaign update or replay summary.",
        playbook: "Trigger replay follow-up and campaign update within the next 20 minutes for best conversion retention.",
        owner: "Audience Notifications",
      },
    ],
    postLive: {
      replayReadiness: 91,
      clipOpportunities: 5,
      followUpSegments: 4,
      markersCaptured: 9,
      nextActions: [
        "Publish replay with chapters and prayer-response notes.",
        "Create two short clips for the crowdfund update feed.",
        "Launch a Beacon recap ad to supporters and replay viewers.",
      ],
    },
    cover: {
      eyebrow: "Post-live launch pad",
      promise: "Focused prayer, urgent giving, and clear community impact storytelling for the borehole campaign.",
      gradient: "linear-gradient(135deg, #134e4a 0%, #0d5a60 48%, #f77f00 100%)",
    },
    moderationDefaults: {
      slowMode: false,
      pinnedNotice: false,
      audienceMute: false,
      prayerTriage: true,
    },
  },
];

function formatDateTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function percent(value: number, total: number) {
  if (!total) return 0;
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}

function breakdown(ms: number) {
  const diff = Math.max(0, ms);
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
}

function stateTone(state: SessionState): "neutral" | "good" | "warn" {
  if (state === "Live") return "good";
  if (state === "Upcoming") return "warn";
  return "neutral";
}

function healthToneToPill(tone: HealthTone): "good" | "warn" | "danger" {
  if (tone === "Healthy") return "good";
  if (tone === "Watch") return "warn";
  return "danger";
}

function severityTone(tone: Severity): "neutral" | "warn" | "danger" {
  if (tone === "danger") return "danger";
  if (tone === "warn") return "warn";
  return "neutral";
}

function destinationTone(status: DestinationStatus["status"]): "neutral" | "good" | "warn" | "danger" {
  if (status === "Healthy") return "good";
  if (status === "Delayed") return "warn";
  if (status === "Failed") return "danger";
  return "neutral";
}

function readinessTone(readiness: Readiness): "good" | "warn" | "danger" {
  if (readiness === "Ready") return "good";
  if (readiness === "Joining") return "warn";
  return "danger";
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
  const toneCls =
    tone === "good"
      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
      : tone === "warn"
        ? "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300"
        : tone === "danger"
          ? "border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300"
          : "border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-800 text-slate-700 dark:text-slate-300";

  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold", toneCls)}>
      {icon}
      {text}
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
        "inline-flex items-center gap-2 rounded-xl border px-3 sm:px-4 py-2 text-[11px] sm:text-[12px] font-semibold transition-colors",
        disabled
          ? "cursor-not-allowed border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-900 text-faith-slate dark:text-faith-slate"
          : "border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-[var(--fh-surface)] dark:hover:bg-slate-800",
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
  tone = "green",
  className,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "green" | "orange";
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
        "inline-flex items-center gap-2 rounded-xl border border-transparent px-3 sm:px-4 py-2 text-[11px] sm:text-[12px] font-semibold text-white transition-opacity",
        disabled ? "cursor-not-allowed opacity-60" : "hover:opacity-95",
        className,
      )}
      style={{ background: tone === "green" ? EV_GREEN : EV_ORANGE }}
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
    <div className={cx("rounded-[16px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3 sm:p-4 md:p-5 transition-colors", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[14px] font-semibold text-faith-ink dark:text-slate-100">{title}</div>
          {subtitle ? <div className="mt-0.5 text-[11px] leading-5 text-faith-slate dark:text-faith-slate">{subtitle}</div> : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
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
    const originalBodyOverflow = document.body.style.overflow;
    const originalDocOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
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
        <div className="fixed inset-0 z-[120]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="absolute inset-0 bg-[var(--fh-surface-bg)] dark:bg-slate-950 transition-colors"
          >
            <div className="sticky top-0 z-10 border-b border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-4 py-3 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold text-faith-ink dark:text-slate-100">{title}</div>
                  {subtitle ? <div className="mt-0.5 text-[11px] text-faith-slate dark:text-faith-slate">{subtitle}</div> : null}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors hover:bg-[var(--fh-surface)] dark:hover:bg-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="h-[calc(100vh-72px)] overflow-y-auto p-4">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

function Toast({ text }: { text: string }) {
  return (
    <div className="fixed bottom-4 left-1/2 z-[140] -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-3 text-[12px] font-semibold text-white shadow-lg dark:bg-slate-100 dark:text-faith-ink">
      {text}
    </div>
  );
}

function MiniTrend({ values, color = EV_GREEN, height = 80 }: { values: number[]; color?: string; height?: number }) {
  const safe = values.length ? values : [0, 0, 0, 0];
  const min = Math.min(...safe);
  const max = Math.max(...safe);
  const span = max - min || 1;
  const points = safe
    .map((value, index) => {
      const x = (index / Math.max(1, safe.length - 1)) * 100;
      const y = 36 - ((value - min) / span) * 32;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
  const area = `${points} L 100 40 L 0 40 Z`;

  return (
    <svg viewBox="0 0 100 40" className="w-full" style={{ height }}>
      <path d={area} fill={color} opacity={0.12} />
      <path d={points} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
      <line x1="0" y1="40" x2="100" y2="40" stroke="#d8dde3" strokeWidth="1" />
    </svg>
  );
}

function MetricTile({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "green" | "orange" | "red" | "neutral";
}) {
  return (
    <KpiTile
      label={label}
      value={value}
      hint={hint}
      tone={tone === "neutral" ? "gray" : tone}
      size="compact"
    />
  );
}

function ProgressRail({
  label,
  value,
  suffix,
  tone = "green",
}: {
  label: string;
  value: number;
  suffix?: string;
  tone?: "green" | "orange" | "red";
}) {
  const barClass = tone === "green" ? "bg-emerald-500" : tone === "orange" ? "bg-amber-500" : "bg-rose-500";

  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
        <span>{label}</span>
        <span>{value}%{suffix ? ` ${suffix}` : ""}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div className={cx("h-full rounded-full", barClass)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

function TimeBadge({
  label,
  values,
}: {
  label: string;
  values: { hours: number; minutes: number; seconds: number };
}) {
  const pad = (value: number) => String(Math.max(0, value)).padStart(2, "0");
  return (
    <div className="rounded-lg border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 transition-colors">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-faith-slate dark:text-faith-slate">{label}</div>
      <div className="mt-1 font-mono text-[20px] font-black text-faith-ink dark:text-slate-100">
        {pad(values.hours)}:{pad(values.minutes)}:{pad(values.seconds)}
      </div>
    </div>
  );
}

function SessionArtwork({ gradient }: { gradient: string }) {
  return (
    <div className="relative overflow-hidden rounded-lg" style={{ background: gradient }}>
      <div className="aspect-[16/10] w-full">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_34%),radial-gradient(circle_at_76%_30%,rgba(255,255,255,0.12),transparent_32%),radial-gradient(circle_at_68%_72%,rgba(255,255,255,0.08),transparent_35%)]" />
        <div className="absolute left-5 top-5 flex items-center gap-2">
          <div className="h-4 w-20 rounded-full bg-[var(--fh-surface-bg)]/30" />
          <div className="h-4 w-10 rounded-full bg-[var(--fh-surface-bg)]/18" />
        </div>
        <div className="absolute right-5 top-5 flex gap-2">
          <div className="h-10 w-10 rounded-xl bg-[var(--fh-surface-bg)]/18" />
          <div className="h-10 w-10 rounded-xl bg-[var(--fh-surface-bg)]/12" />
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <div className="h-5 w-48 rounded-full bg-[var(--fh-surface-bg)]/80 mb-3" />
          <div className="h-3 w-72 max-w-full rounded-full bg-[var(--fh-surface-bg)]/35 mb-2" />
          <div className="h-3 w-52 rounded-full bg-[var(--fh-surface-bg)]/22" />
        </div>
      </div>
    </div>
  );
}

function QuickToggle({
  label,
  hint,
  active,
  onClick,
}: {
  label: string;
  hint: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "w-full rounded-lg border p-3 text-left transition-colors",
        active
          ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20"
          : "border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 hover:bg-[var(--fh-surface)] dark:hover:bg-slate-800",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[12px] font-semibold text-faith-ink dark:text-slate-100">{label}</div>
          <div className="mt-0.5 text-[11px] text-faith-slate dark:text-faith-slate">{hint}</div>
        </div>
        <div className={cx(
          "flex h-6 w-10 items-center rounded-full border px-1 transition-colors",
          active
            ? "justify-end border-emerald-500 bg-emerald-500"
            : "justify-start border-faith-line dark:border-slate-600 bg-slate-100 dark:bg-slate-700",
        )}>
          <span className="h-4 w-4 rounded-full bg-[var(--fh-surface-bg)] shadow" />
        </div>
      </div>
    </button>
  );
}

function RouteButton({
  icon,
  label,
  hint,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-3 text-left transition-colors hover:bg-[var(--fh-surface)] dark:hover:bg-slate-800"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--fh-surface)] dark:bg-slate-800 text-slate-700 dark:text-slate-200">
            {icon}
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-semibold text-faith-ink dark:text-slate-100 truncate">{label}</div>
            <div className="text-[11px] leading-5 text-faith-slate dark:text-faith-slate truncate">{hint}</div>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-faith-slate" />
      </div>
    </button>
  );
}

function ControlRoomPreview({
  session,
  slowMode,
  pinnedNotice,
  audienceMute,
  prayerTriage,
  acknowledgedCount,
}: {
  session: SessionData;
  slowMode: boolean;
  pinnedNotice: boolean;
  audienceMute: boolean;
  prayerTriage: boolean;
  acknowledgedCount: number;
}) {
  return (
    <Card
      title="Control-room preview"
      subtitle="A fast visual summary of what the producer is about to manage."
      right={<Pill text={session.state} tone={stateTone(session.state)} />}
      className="overflow-hidden"
    >
      <SessionArtwork gradient={session.cover.gradient} />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Pill text={session.health.critical} tone={healthToneToPill(session.health.critical)} icon={<Activity className="h-3.5 w-3.5" />} />
        <Pill text={session.parentType} icon={<Layers className="h-3.5 w-3.5" />} />
        <Pill text={session.timezone} icon={<Globe2 className="h-3.5 w-3.5" />} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <MetricTile label="Viewers" value={session.state === "Ended" ? session.audience.peakViewers.toLocaleString() : session.audience.viewers.toLocaleString()} hint={session.state === "Ended" ? "Peak viewers" : "Current viewers"} tone="green" />
        <MetricTile label="Giving" value={formatMoney(session.conversion.donationTotal)} hint="Live-response total" tone="orange" />
      </div>

      <div className="mt-4 rounded-lg border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-900 p-3 transition-colors">
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-faith-slate dark:text-faith-slate">Active tools</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {slowMode ? <Pill text="Slow mode" tone="warn" /> : null}
          {pinnedNotice ? <Pill text="Pinned notice" tone="good" /> : null}
          {audienceMute ? <Pill text="Audience muted" tone="danger" /> : null}
          {prayerTriage ? <Pill text="Prayer triage" tone="good" /> : null}
          {!slowMode && !pinnedNotice && !audienceMute && !prayerTriage ? <Pill text="Standard mode" /> : null}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {session.destinations.map((dest) => (
          <div key={dest.name} className="rounded-xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-2 text-center transition-colors">
            <div className="text-[11px] font-semibold text-faith-ink dark:text-slate-100 truncate">{dest.name}</div>
            <div className="mt-1 flex justify-center">
              <Pill text={dest.status} tone={destinationTone(dest.status)} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-[11px] text-faith-slate dark:text-faith-slate">
        {acknowledgedCount} alert{acknowledgedCount === 1 ? "" : "s"} acknowledged in this session.
      </div>
    </Card>
  );
}

function PostLiveLaunchPad({ session }: { session: SessionData }) {
  const isEnded = session.state === "Ended";
  return (
    <Card
      title="Post-live launch pad"
      subtitle={isEnded ? "The same operational page now pivots directly into publishing and follow-up." : "This panel automatically shifts into replay mode the moment the session ends."}
      right={<Pill text={isEnded ? "Replay mode" : "Standby"} tone={isEnded ? "good" : "neutral"} />}
    >
      <div className="grid grid-cols-2 gap-2">
        <MetricTile label="Replay readiness" value={`${session.postLive.replayReadiness}%`} hint="Packaging progress" tone="green" />
        <MetricTile label="Clip opportunities" value={session.postLive.clipOpportunities.toString()} hint="Suggested cutdowns" tone="orange" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <MetricTile label="Follow-up segments" value={session.postLive.followUpSegments.toString()} hint="Notification audiences" tone="neutral" />
        <MetricTile label="Markers captured" value={session.postLive.markersCaptured.toString()} hint="Live highlight points" tone="neutral" />
      </div>

      <div className="mt-4 space-y-2">
        {session.postLive.nextActions.map((action) => (
          <div key={action} className="rounded-xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-900 p-3 text-[12px] text-slate-700 dark:text-slate-300 transition-colors">
            {action}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <PrimaryButton tone="green" onClick={() => safeNav(`${ROUTES.postLivePublishing}?sessionId=${encodeURIComponent(session.id)}`)}>
          <PlayCircle className="h-4 w-4" /> Publish replay
        </PrimaryButton>
        <SoftButton onClick={() => safeNav(`${ROUTES.postLivePublishing}?sessionId=${encodeURIComponent(session.id)}&tab=clips`)}>
          <Wand2 className="h-4 w-4" /> Create clips
        </SoftButton>
        <SoftButton onClick={() => safeNav(`${ROUTES.beaconBuilder}?sourceSessionId=${encodeURIComponent(session.id)}`)}>
          <Sparkles className="h-4 w-4" /> Beacon handoff
        </SoftButton>
      </div>
    </Card>
  );
}

export default function FaithHubLiveDashboardPage() {
  const [nowMs, setNowMs] = useState(Date.now());
  const [activeSessionId, setActiveSessionId] = useState(SESSIONS[1].id);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<string[]>([]);
  const [slowMode, setSlowMode] = useState(false);
  const [pinnedNotice, setPinnedNotice] = useState(false);
  const [audienceMute, setAudienceMute] = useState(false);
  const [prayerTriage, setPrayerTriage] = useState(true);
  const [reminderSent, setReminderSent] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const session = useMemo(
    () => SESSIONS.find((item) => item.id === activeSessionId) || SESSIONS[0],
    [activeSessionId],
  );

  useEffect(() => {
    setSlowMode(session.moderationDefaults.slowMode);
    setPinnedNotice(session.moderationDefaults.pinnedNotice);
    setAudienceMute(session.moderationDefaults.audienceMute);
    setPrayerTriage(session.moderationDefaults.prayerTriage);
    setReminderSent(false);
  }, [session.id]);

  const startMs = new Date(session.startISO).getTime();
  const endMs = new Date(session.endISO).getTime();
  const sinceStart = breakdown(nowMs - startMs);
  const untilStart = breakdown(startMs - nowMs);
  const untilEnd = breakdown(endMs - nowMs);
  const sinceEnd = breakdown(nowMs - endMs);

  const totalRoles = session.team.length;
  const rolesReady = session.team.filter((member) => member.readiness === "Ready").length;
  const rolesChecked = session.team.filter((member) => member.checked).length;
  const criticalRoles = session.team.filter((member) => member.critical);
  const criticalReady = criticalRoles.filter((member) => member.readiness === "Ready" && member.checked).length;
  const readinessPct = percent(rolesChecked, totalRoles);
  const arrivalPct = percent(
    session.state === "Ended" ? session.audience.peakViewers : session.audience.waitingRoom || session.audience.viewers,
    session.audience.forecastArrival || session.audience.peakViewers || 1,
  );
  const activeAlerts = session.alerts.filter((alert) => !acknowledgedAlerts.includes(alert.id));
  const firstPlaybooks = activeAlerts.slice(0, 2);
  const canSendReminder = session.state !== "Ended";

  const countdownLabel =
    session.state === "Upcoming"
      ? "Starts in"
      : session.state === "Live"
        ? "Live for"
        : "Ended";

  const sendReminder = () => {
    if (!canSendReminder) return;
    setReminderSent(true);
    setToast(`Last-minute reminder sent to ${session.audience.registrants.toLocaleString()} contacts.`);
  };

  const copySessionLink = async () => {
    const url = `https://faithhub.app/live/${session.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setToast("Session link copied to clipboard.");
    } catch {
      setToast(url);
    }
  };

  const openModerationPanel = () => {
    safeNav(`${ROUTES.reviewsModeration}?sessionId=${encodeURIComponent(session.id)}&panel=live`);
  };

  const acknowledgeAlert = (id: string) => {
    setAcknowledgedAlerts((current) => Array.from(new Set([...current, id])));
    setToast("Incident acknowledged and added to the response timeline.");
  };

  const mobilePreview = (
    <div className="space-y-4">
      <ControlRoomPreview
        session={session}
        slowMode={slowMode}
        pinnedNotice={pinnedNotice}
        audienceMute={audienceMute}
        prayerTriage={prayerTriage}
        acknowledgedCount={acknowledgedAlerts.length}
      />
      <PostLiveLaunchPad session={session} />
      <Card title="Fastest path" subtitle="Jump from the dashboard into the next operator action.">
        <div className="space-y-2">
          <RouteButton icon={<Video className="h-4 w-4" />} label="Live Studio" hint="Open scenes, sources, and stage controls" onClick={() => safeNav(`${ROUTES.liveStudio}?sessionId=${encodeURIComponent(session.id)}`)} />
          <RouteButton icon={<Bell className="h-4 w-4" />} label="Audience Notifications" hint="Send live and replay reminders" onClick={() => safeNav(`${ROUTES.audienceNotifications}?sessionId=${encodeURIComponent(session.id)}`)} />
          <RouteButton icon={<ShieldCheck className="h-4 w-4" />} label="Reviews & Moderation" hint="Open live moderation tools" onClick={() => safeNav(`${ROUTES.reviewsModeration}?sessionId=${encodeURIComponent(session.id)}`)} />
          <RouteButton icon={<Sparkles className="h-4 w-4" />} label="Beacon Builder" hint="Promote the replay or recap with Beacon" onClick={() => safeNav(`${ROUTES.beaconBuilder}?sourceSessionId=${encodeURIComponent(session.id)}`)} />
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--fh-page-bg)] dark:bg-slate-950 text-faith-ink dark:text-slate-100 transition-colors">
      <div className="mx-auto max-w-[1600px] px-3 py-3 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Pill text="Live Sessions Operations" icon={<Radio className="h-3.5 w-3.5" />} />
              <Pill text={session.state} tone={stateTone(session.state)} />
              <Pill text={session.health.critical} tone={healthToneToPill(session.health.critical)} />
            </div>
            <ProviderPageTitle
              icon={<MonitorPlay className="h-6 w-6" />}
              title="Live Dashboard"
              subtitle="High-intensity control room for a specific Live Session, combining technical health, team readiness, audience pulse, conversions, moderation, and post-live actions."
              className="mt-2"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SoftButton onClick={() => safeNav(ROUTES.liveSchedule)}>
              <ChevronLeft className="h-4 w-4" /> Live Schedule
            </SoftButton>
            <SoftButton onClick={() => setPreviewOpen(true)} className="lg:hidden">
              <MonitorPlay className="h-4 w-4" /> Preview
            </SoftButton>
            <PrimaryButton tone="green" onClick={() => safeNav(`${ROUTES.liveStudio}?sessionId=${encodeURIComponent(session.id)}`)}>
              <Video className="h-4 w-4" /> Launch studio
            </PrimaryButton>
            <PrimaryButton tone="orange" onClick={sendReminder} disabled={!canSendReminder || reminderSent}>
              <Bell className="h-4 w-4" /> {reminderSent ? "Reminder sent" : "Send last-minute reminder"}
            </PrimaryButton>
            <SoftButton onClick={openModerationPanel}>
              <ShieldCheck className="h-4 w-4" /> Open moderation panel
            </SoftButton>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-12">
          <div className="lg:col-span-3 space-y-4 sm:space-y-5">
            <Card
              title="Session status header"
              subtitle="Countdown, content context, host presence, destinations, and the critical health badge."
              right={<SoftButton onClick={copySessionLink}><Copy className="h-4 w-4" /> Copy link</SoftButton>}
            >
              <div>
                <div className="text-[11px] font-semibold text-faith-slate dark:text-faith-slate">Active session</div>
                <select
                  value={activeSessionId}
                  onChange={(e) => setActiveSessionId(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 text-[13px] font-semibold text-faith-ink dark:text-slate-100 transition-colors"
                >
                  {SESSIONS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} • {item.state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Pill text={session.parentType} icon={<Layers className="h-3.5 w-3.5" />} />
                <Pill text={session.parentLabel} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <TimeBadge label={countdownLabel} values={session.state === "Upcoming" ? untilStart : session.state === "Live" ? sinceStart : sinceEnd} />
                <TimeBadge label={session.state === "Ended" ? "Replay window" : "Ends in"} values={session.state === "Ended" ? sinceEnd : untilEnd} />
              </div>

              <div className="mt-4 rounded-lg border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-900 p-3 transition-colors">
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-faith-slate dark:text-faith-slate">Session context</div>
                <div className="mt-2 text-[12px] font-semibold text-faith-ink dark:text-slate-100">{session.title}</div>
                <div className="mt-1 text-[11px] text-faith-slate dark:text-faith-slate">{session.audienceLabel}</div>
                <div className="mt-1 text-[11px] text-faith-slate dark:text-faith-slate">{session.locationLabel}</div>
                <div className="mt-1 text-[11px] text-faith-slate dark:text-faith-slate">{formatDateTime(session.startISO)} • {session.timezone}</div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3 transition-colors">
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-faith-slate dark:text-faith-slate">Host</div>
                  <div className="mt-1 text-[13px] font-semibold text-faith-ink dark:text-slate-100">{session.hosts.host}</div>
                  <div className="mt-1 text-[11px] text-faith-slate dark:text-faith-slate">On stage and checked</div>
                </div>
                <div className="rounded-lg border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3 transition-colors">
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-faith-slate dark:text-faith-slate">Producer</div>
                  <div className="mt-1 text-[13px] font-semibold text-faith-ink dark:text-slate-100">{session.hosts.producer}</div>
                  <div className="mt-1 text-[11px] text-faith-slate dark:text-faith-slate">Backstage operations</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {session.destinations.map((dest) => (
                  <Pill key={dest.name} text={`${dest.name} • ${dest.status}`} tone={destinationTone(dest.status)} />
                ))}
              </div>
            </Card>

            <Card title="Automatic incident playbooks" subtitle="Common failure cases become operator-ready response prompts.">
              <div className="space-y-3">
                {firstPlaybooks.length ? (
                  firstPlaybooks.map((alert) => (
                    <div key={alert.id} className="rounded-lg border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-900 p-3 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <Pill text={alert.severity.toUpperCase()} tone={severityTone(alert.severity)} />
                            <div className="text-[12px] font-semibold text-faith-ink dark:text-slate-100">{alert.title}</div>
                          </div>
                          <div className="mt-2 text-[11px] text-faith-slate dark:text-faith-slate">{alert.playbook}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <SoftButton onClick={() => acknowledgeAlert(alert.id)}>
                          <CheckCircle2 className="h-4 w-4" /> Acknowledge
                        </SoftButton>
                        <SoftButton onClick={openModerationPanel}>
                          <ShieldCheck className="h-4 w-4" /> Open panel
                        </SoftButton>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-3 text-[12px] text-emerald-800 dark:text-emerald-300 transition-colors">
                    No active playbooks right now. This session is operating within safe thresholds.
                  </div>
                )}
              </div>
            </Card>

            <Card title="Moderator quick tools" subtitle="Instant audience and safety controls without leaving the dashboard.">
              <div className="space-y-2">
                <QuickToggle label="Slow mode" hint="Reduce chat speed during spikes." active={slowMode} onClick={() => setSlowMode((v) => !v)} />
                <QuickToggle label="Pinned notice" hint="Keep guidance visible above the chat." active={pinnedNotice} onClick={() => setPinnedNotice((v) => !v)} />
                <QuickToggle label="Audience muting" hint="Silence audience posting during incidents." active={audienceMute} onClick={() => setAudienceMute((v) => !v)} />
                <QuickToggle label="Prayer triage" hint="Route urgent prayer requests to support volunteers." active={prayerTriage} onClick={() => setPrayerTriage((v) => !v)} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <SoftButton onClick={openModerationPanel}>
                  <ShieldCheck className="h-4 w-4" /> Escalate issue
                </SoftButton>
                <SoftButton onClick={() => setToast("Pinned notice updated for the room.")}>
                  <Megaphone className="h-4 w-4" /> Push notice
                </SoftButton>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            <Card
              title="Technical health telemetry"
              subtitle="Ingest health, bitrate, frame rate, audio confidence, latency, recording state, destination sync, and backup readiness."
              right={<Pill text={session.health.critical} tone={healthToneToPill(session.health.critical)} icon={<Activity className="h-3.5 w-3.5" />} />}
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                <MetricTile label="Ingest health" value={`${session.health.ingestHealth}%`} hint="Overall stream intake" tone={session.health.ingestHealth >= 90 ? "green" : session.health.ingestHealth >= 80 ? "orange" : "red"} />
                <MetricTile label="Bitrate" value={`${session.health.bitrateMbps.toFixed(1)} Mbps`} hint="Current media throughput" tone="green" />
                <MetricTile label="Audio confidence" value={`${session.health.audioConfidence}%`} hint="Voice clarity and stability" tone={session.health.audioConfidence >= 90 ? "green" : session.health.audioConfidence >= 80 ? "orange" : "red"} />
                <MetricTile label="Latency" value={`${session.health.latencySec.toFixed(1)}s`} hint="Observed delivery delay" tone={session.health.latencySec <= 3 ? "green" : session.health.latencySec <= 5 ? "orange" : "red"} />
              </div>

              <div className="mt-4 rounded-lg border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-900 p-3 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[12px] font-semibold text-faith-ink dark:text-slate-100">Health telemetry trend</div>
                    <div className="text-[11px] text-faith-slate dark:text-faith-slate">Combined ingest and sync health over the last few checks.</div>
                  </div>
                  <Pill text={`${session.health.fps} FPS`} icon={<Video className="h-3.5 w-3.5" />} />
                </div>
                <div className="mt-3">
                  <MiniTrend values={session.health.trend} color={session.health.critical === "Healthy" ? EV_GREEN : EV_ORANGE} />
                </div>
              </div>

              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <ProgressRail label="Destination sync" value={session.health.destinationSync} suffix="aligned" tone={session.health.destinationSync >= 95 ? "green" : session.health.destinationSync >= 85 ? "orange" : "red"} />
                <ProgressRail label="Backup path readiness" value={session.health.backupReady ? 100 : 42} suffix={session.health.backupReady ? "ready" : "not ready"} tone={session.health.backupReady ? "green" : "red"} />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Pill text={session.health.recording ? "Recording active" : "Recording off"} tone={session.health.recording ? "good" : "danger"} icon={<Radio className="h-3.5 w-3.5" />} />
                <Pill text={session.health.backupReady ? "Backup path armed" : "Backup path at risk"} tone={session.health.backupReady ? "good" : "warn"} icon={<RefreshCw className="h-3.5 w-3.5" />} />
                <Pill text={`${session.health.latencySec.toFixed(1)}s live latency`} tone={session.health.latencySec <= 3 ? "good" : "warn"} />
              </div>
            </Card>

            <Card title="Team readiness board" subtitle="Hosts, moderators, producers, captioners, interpreters, and support operators in one operational board.">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <MetricTile label="Role coverage" value={`${rolesReady}/${totalRoles}`} hint="Joined and ready" tone="green" />
                <MetricTile label="Checks complete" value={`${rolesChecked}/${totalRoles}`} hint="Operational confirmation" tone={readinessPct >= 85 ? "green" : "orange"} />
                <MetricTile label="Critical roles" value={`${criticalReady}/${criticalRoles.length}`} hint="Broadcast-safe core team" tone={criticalReady === criticalRoles.length ? "green" : "orange"} />
              </div>

              <div className="mt-4 grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                {session.team.map((member) => (
                  <div key={`${member.role}-${member.name}`} className="rounded-lg border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-900 p-3 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[12px] font-semibold text-faith-ink dark:text-slate-100">{member.role}</div>
                        <div className="mt-0.5 text-[11px] text-faith-slate dark:text-faith-slate">{member.name}</div>
                      </div>
                      <Pill text={member.readiness} tone={readinessTone(member.readiness)} />
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-faith-slate dark:text-faith-slate">
                      {member.checked ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Clock3 className="h-4 w-4 text-amber-600" />}
                      {member.checked ? "Checks complete" : "Checks pending"}
                    </div>
                    {member.critical ? <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-faith-slate dark:text-faith-slate">Critical role</div> : null}
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Audience pulse panel" subtitle="Registrants, waiting room, viewers, chat load, Q&A pressure, prayer requests, and drop-off signals.">
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                <MetricTile label="Registrants" value={session.audience.registrants.toLocaleString()} hint="Total audience signups" tone="neutral" />
                <MetricTile label="Waiting room" value={session.audience.waitingRoom.toLocaleString()} hint="Pre-live audience holding" tone="orange" />
                <MetricTile label={session.state === "Ended" ? "Peak viewers" : "Current viewers"} value={(session.state === "Ended" ? session.audience.peakViewers : session.audience.viewers).toLocaleString()} hint="Audience in session" tone="green" />
                <MetricTile label="Chat velocity" value={`${session.audience.chatVelocity}/min`} hint="Current message rate" tone={session.audience.chatVelocity > 120 ? "orange" : "green"} />
              </div>

              <div className="mt-4 rounded-lg border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-900 p-3 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[12px] font-semibold text-faith-ink dark:text-slate-100">Arrival and audience trend</div>
                    <div className="text-[11px] text-faith-slate dark:text-faith-slate">Forecast alignment and live momentum in one view.</div>
                  </div>
                  <Pill text={`${arrivalPct}% of forecast`} tone={arrivalPct >= 90 ? "good" : arrivalPct >= 70 ? "warn" : "danger"} />
                </div>
                <div className="mt-3">
                  <MiniTrend values={session.audience.arrivalTrend} color={session.state === "Live" ? EV_ORANGE : EV_GREEN} height={72} />
                </div>
              </div>

              <div className="mt-4 grid sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3 transition-colors">
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-faith-slate dark:text-faith-slate">Q&A load</div>
                  <div className="mt-1 text-[18px] font-black text-faith-ink dark:text-slate-100">{session.audience.qnaLoad}</div>
                  <div className="mt-1 text-[11px] text-faith-slate dark:text-faith-slate">Open questions needing review.</div>
                </div>
                <div className="rounded-lg border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3 transition-colors">
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-faith-slate dark:text-faith-slate">Prayer requests</div>
                  <div className="mt-1 text-[18px] font-black text-faith-ink dark:text-slate-100">{session.audience.prayerRequests}</div>
                  <div className="mt-1 text-[11px] text-faith-slate dark:text-faith-slate">Requests flowing into triage.</div>
                </div>
                <div className="rounded-lg border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3 transition-colors">
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-faith-slate dark:text-faith-slate">Drop-off risk</div>
                  <div className="mt-1 flex items-center gap-2">
                    <Pill text={session.audience.dropOffRisk} tone={session.audience.dropOffRisk === "Low" ? "good" : session.audience.dropOffRisk === "Watch" ? "warn" : "danger"} />
                  </div>
                  <div className="mt-1 text-[11px] text-faith-slate dark:text-faith-slate">Audience retention warning state.</div>
                </div>
              </div>
            </Card>

            <Card title="CTA and conversion strip" subtitle="Treat giving, event sign-up, merch clicks, and Beacon promotion as live-response signals."
              right={<SoftButton onClick={() => safeNav(`${ROUTES.beaconBuilder}?sourceSessionId=${encodeURIComponent(session.id)}`)}><Sparkles className="h-4 w-4" /> Beacon handoff</SoftButton>}
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-3">
                <MetricTile label="Live giving" value={formatMoney(session.conversion.donationTotal)} hint="Current response total" tone="orange" />
                <MetricTile label="Crowdfund" value={formatMoney(session.conversion.crowdfundRaised)} hint={`of ${formatMoney(session.conversion.crowdfundTarget)}`} tone="green" />
                <MetricTile label="Event sign-ups" value={session.conversion.eventSignups.toLocaleString()} hint="Live-response registrations" tone="green" />
                <MetricTile label="Merch clicks" value={session.conversion.merchClicks.toLocaleString()} hint="Commerce engagement" tone="neutral" />
                <MetricTile label="Beacon handoffs" value={session.conversion.beaconHandoffs.toLocaleString()} hint="Promotion-ready actions" tone="orange" />
              </div>

              <div className="mt-4">
                <ProgressRail label="Crowdfund movement" value={percent(session.conversion.crowdfundRaised, session.conversion.crowdfundTarget)} suffix="of target" tone="green" />
              </div>

              <div className="mt-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-3 text-[12px] text-amber-900 dark:text-amber-200 transition-colors">
                {session.conversion.responseLabel}
              </div>
            </Card>

            <Card title="Alert center" subtitle="Stream errors, destination failures, moderation risk, caption failures, and low-arrival warnings in one operational queue."
              right={<Pill text={`${activeAlerts.length} active`} tone={activeAlerts.length ? "warn" : "good"} icon={<AlertTriangle className="h-3.5 w-3.5" />} />}
            >
              <div className="space-y-3">
                {activeAlerts.length ? (
                  activeAlerts.map((alert) => (
                    <div key={alert.id} className="rounded-lg border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-900 p-3 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Pill text={alert.severity.toUpperCase()} tone={severityTone(alert.severity)} />
                            <div className="text-[12px] font-semibold text-faith-ink dark:text-slate-100">{alert.title}</div>
                            <div className="text-[11px] text-faith-slate dark:text-faith-slate">• {alert.owner}</div>
                          </div>
                          <div className="mt-2 text-[12px] text-faith-slate dark:text-faith-slate">{alert.description}</div>
                          <div className="mt-2 text-[11px] text-faith-slate dark:text-faith-slate">Playbook: {alert.playbook}</div>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <SoftButton onClick={() => acknowledgeAlert(alert.id)} className="px-3 py-2">
                            <Check className="h-4 w-4" /> Ack
                          </SoftButton>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-4 text-[12px] text-emerald-800 dark:text-emerald-300 transition-colors">
                    No unresolved alerts. Stream health, destinations, moderation, and caption readiness are all within expected thresholds.
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-4 space-y-4 sm:space-y-5">
              <ControlRoomPreview
                session={session}
                slowMode={slowMode}
                pinnedNotice={pinnedNotice}
                audienceMute={audienceMute}
                prayerTriage={prayerTriage}
                acknowledgedCount={acknowledgedAlerts.length}
              />

              <Card title="Fastest path" subtitle="Jump straight into the next operator action without duplicate navigation.">
                <div className="space-y-2">
                  <RouteButton icon={<Video className="h-4 w-4" />} label="Live Studio" hint="Scenes, stage, and source controls" onClick={() => safeNav(`${ROUTES.liveStudio}?sessionId=${encodeURIComponent(session.id)}`)} />
                  <RouteButton icon={<Bell className="h-4 w-4" />} label="Audience Notifications" hint="Live and replay reminder sends" onClick={() => safeNav(`${ROUTES.audienceNotifications}?sessionId=${encodeURIComponent(session.id)}`)} />
                  <RouteButton icon={<ShieldCheck className="h-4 w-4" />} label="Reviews & Moderation" hint="Open the live moderation surface" onClick={() => safeNav(`${ROUTES.reviewsModeration}?sessionId=${encodeURIComponent(session.id)}`)} />
                  <RouteButton icon={<PlayCircle className="h-4 w-4" />} label="Post-live Publishing" hint="Replay packaging and chapters" onClick={() => safeNav(`${ROUTES.postLivePublishing}?sessionId=${encodeURIComponent(session.id)}`)} />
                  <RouteButton icon={<Sparkles className="h-4 w-4" />} label="Beacon Builder" hint="Promote the replay, recap, or campaign" onClick={() => safeNav(`${ROUTES.beaconBuilder}?sourceSessionId=${encodeURIComponent(session.id)}`)} />
                </div>
              </Card>

              <PostLiveLaunchPad session={session} />
            </div>
          </div>
        </div>
      </div>

      <Drawer
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Live Dashboard preview"
        subtitle="Control-room summary and post-live launch pad for mobile companions."
      >
        {mobilePreview}
      </Drawer>

      {toast ? <Toast text={toast} /> : null}
    </div>
  );
}










