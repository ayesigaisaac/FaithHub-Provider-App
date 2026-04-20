// @ts-nocheck

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BadgeCheck,
  Bell,
  BookmarkPlus,
  Captions,
  CheckCircle2,
  ChevronRight,
  Clapperboard,
  Copy,
  ExternalLink,
  Eye,
  Film,
  Gift,
  Globe2,
  HandHeart,
  HeartHandshake,
  Image as ImageIcon,
  Languages,
  LayoutTemplate,
  Layers,
  Link2,
  MessageCircleHeart,
  MessageSquare,
  Mic,
  MonitorPlay,
  MoveRight,
  PanelTop,
  PhoneCall,
  Play,
  PlayCircle,
  Plus,
  Radio,
  ScreenShare,
  Settings2,
  ShieldCheck,
  Siren,
  Sparkles,
  TimerReset,
  Users,
  Video,
  Volume2,
  Wand2,
  X,
  Zap,
} from "lucide-react";

/**
 * FaithHub — Live Studio
 * --------------------------------
 * Premium production studio for FaithHub Live Sessions.
 *
 * Design grammar
 * - Adapted from the creator-style studio layout: top command bar, left rail, center program/preview monitors,
 *   right interaction rail, and a sticky bottom control bar.
 * - EVzone Green is the primary colour and EVzone Orange is the secondary accent.
 * - The page includes a built-in audience-experience preview to mirror the base-file preview pattern.
 *
 * Notes
 * - The component is self-contained with mock data so it can drop into the FaithHub codebase quickly.
 * - Replace route constants and data hooks with your production sources.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";

const ROUTES = {
  liveDashboard: "/faithhub/provider/live-dashboard",
  streamToPlatforms: "/faithhub/provider/stream-to-platforms",
  postLivePublishing: "/faithhub/provider/post-live-publishing",
};

type Mode = "standby" | "live";
type InteractionTab = "chat" | "qa" | "prayer" | "polls";
type PreviewDevice = "desktop" | "mobile";
type HealthTone = "healthy" | "watch" | "risk";
type SceneTone = "green" | "orange" | "slate";

type Scene = {
  id: string;
  label: string;
  desc: string;
  template: string;
  durationHint: string;
  tone: SceneTone;
};

type SourceItem = {
  id: string;
  label: string;
  kind: "camera" | "screen" | "media" | "graphics" | "fallback";
  health: HealthTone;
  detail: string;
};

type StageMember = {
  id: string;
  role:
    | "Host"
    | "Co-host"
    | "Producer"
    | "Moderator"
    | "Translator"
    | "Interpreter"
    | "Caption Operator";
  name: string;
  status: "On stage" | "Backstage" | "Not joined";
  controlNote: string;
  critical?: boolean;
};

type CTAItem = {
  id: string;
  label: string;
  desc: string;
  type:
    | "Lower third"
    | "Scripture"
    | "Donation"
    | "Crowdfund"
    | "Event"
    | "Beacon"
    | "QR";
  tone: SceneTone;
};

type ChatMessage = {
  id: number;
  from: string;
  body: string;
  time: string;
  flagged?: boolean;
  pinned?: boolean;
};

type QAItem = {
  id: number;
  from: string;
  question: string;
  status: "Queued" | "Picked" | "Answered";
};

type PrayerRequest = {
  id: number;
  from: string;
  body: string;
  urgency: "Low" | "Watch" | "High";
};

type PollItem = {
  id: number;
  question: string;
  yes: number;
  no: number;
  status: "Ready" | "Live" | "Closed";
};

type ClipMark = {
  id: number;
  time: string;
  label: string;
  category: "Highlight" | "Scripture" | "Prayer" | "CTA";
};

const SESSION = {
  title: "Sunday Encounter Live",
  parentLabel: "The Way of Grace • Episode 4",
  subtitle:
    "Premium control room for a live teaching session with prayer, scripture moments, giving prompts, translated tracks, and replay-ready clip markers.",
  hostLine: "Pastor Daniel M. • Minister Ruth K. • Central Campus",
  locations: "Main Sanctuary · Central Campus",
  destinations: [
    { label: "FaithHub", health: "healthy" as HealthTone },
    { label: "YouTube", health: "healthy" as HealthTone },
    { label: "Facebook", health: "watch" as HealthTone },
    { label: "Instagram", health: "healthy" as HealthTone },
  ],
  audience: {
    viewers: 4863,
    waiting: 314,
    chatVelocity: 92,
    prayerCount: 36,
  },
};

const SCENES: Scene[] = [
  {
    id: "countdown",
    label: "Countdown",
    desc: "Branded countdown with motion graphics and music bed.",
    template: "FaithHub Classic",
    durationHint: "00:30:00",
    tone: "slate",
  },
  {
    id: "welcome",
    label: "Welcome",
    desc: "Warm opening with host, church lower third and greeting prompts.",
    template: "Sanctuary Green",
    durationHint: "00:05:00",
    tone: "green",
  },
  {
    id: "sermon",
    label: "Sermon",
    desc: "Main preaching canvas with scripture-safe lower thirds.",
    template: "Pulpit Focus",
    durationHint: "00:35:00",
    tone: "green",
  },
  {
    id: "scripture",
    label: "Scripture",
    desc: "Full-screen scripture card with subtitle-safe regions.",
    template: "Scripture Focus",
    durationHint: "00:03:00",
    tone: "orange",
  },
  {
    id: "giving",
    label: "Giving Moment",
    desc: "Donation banner, crowdfund bar and QR prompt.",
    template: "Generosity Overlay",
    durationHint: "00:06:00",
    tone: "orange",
  },
  {
    id: "prayer",
    label: "Prayer",
    desc: "Soft prayer scene with caption priority and clear stage focus.",
    template: "Prayer Light",
    durationHint: "00:08:00",
    tone: "green",
  },
  {
    id: "qa",
    label: "Q&A",
    desc: "Moderated interaction scene with picked questions and polls.",
    template: "Community Talk",
    durationHint: "00:12:00",
    tone: "orange",
  },
  {
    id: "ending",
    label: "Ending",
    desc: "Closing blessing, replay prompt, next-step CTAs.",
    template: "Afterglow",
    durationHint: "00:04:00",
    tone: "slate",
  },
];

const SOURCES: SourceItem[] = [
  {
    id: "cam-host",
    label: "Camera 1 · Host",
    kind: "camera",
    health: "healthy",
    detail: "Sony FX3 · 1080p30 · Audio linked",
  },
  {
    id: "cam-pulpit",
    label: "Camera 2 · Pulpit",
    kind: "camera",
    health: "healthy",
    detail: "PTZ preset active · Clean framing",
  },
  {
    id: "cam-wide",
    label: "Camera 3 · Wide Room",
    kind: "camera",
    health: "watch",
    detail: "Low light on rear aisle",
  },
  {
    id: "screen-share",
    label: "Screen Share · Scripture Deck",
    kind: "screen",
    health: "healthy",
    detail: "Slides synced · Verse pack loaded",
  },
  {
    id: "worship-loop",
    label: "Media Loop · Worship Intro",
    kind: "media",
    health: "healthy",
    detail: "3 motion clips ready",
  },
  {
    id: "graphics",
    label: "Graphics Bus · Lower Thirds",
    kind: "graphics",
    health: "healthy",
    detail: "12 overlays and 4 scripture cards",
  },
  {
    id: "fallback",
    label: "Fallback Source · Sanctuary Slate",
    kind: "fallback",
    health: "healthy",
    detail: "Ready for instant switch",
  },
];

const STAGE_MEMBERS: StageMember[] = [
  {
    id: "st-1",
    role: "Host",
    name: "Pastor Daniel M.",
    status: "On stage",
    controlNote: "Lead voice · camera 1 and pulpit scenes",
    critical: true,
  },
  {
    id: "st-2",
    role: "Co-host",
    name: "Minister Ruth K.",
    status: "Backstage",
    controlNote: "Q&A handoff and altar call support",
  },
  {
    id: "st-3",
    role: "Producer",
    name: "Claire N.",
    status: "On stage",
    controlNote: "Program, scenes, overlays and fallback control",
    critical: true,
  },
  {
    id: "st-4",
    role: "Moderator",
    name: "Tobi E.",
    status: "On stage",
    controlNote: "Chat triage, slow mode and escalation",
  },
  {
    id: "st-5",
    role: "Translator",
    name: "Grace L.",
    status: "Backstage",
    controlNote: "Swahili subtitle track and translated notices",
  },
  {
    id: "st-6",
    role: "Interpreter",
    name: "Nathan P.",
    status: "Backstage",
    controlNote: "Secondary language confidence checks",
  },
  {
    id: "st-7",
    role: "Caption Operator",
    name: "Mercy J.",
    status: "On stage",
    controlNote: "Live captions and scripture-safe lower thirds",
    critical: true,
  },
];

const CTA_ITEMS: CTAItem[] = [
  {
    id: "lower-third",
    label: "Speaker lower third",
    desc: "Pastor name, topic line and campus identity.",
    type: "Lower third",
    tone: "green",
  },
  {
    id: "scripture-card",
    label: "Scripture callout",
    desc: "Romans 12:2 overlay with translated subtitle region.",
    type: "Scripture",
    tone: "orange",
  },
  {
    id: "donation-banner",
    label: "Donation banner",
    desc: "Generosity strip with in-app giving entry point.",
    type: "Donation",
    tone: "green",
  },
  {
    id: "crowdfund-bar",
    label: "Charity crowdfund progress",
    desc: "Community Borehole Appeal live progress bar.",
    type: "Crowdfund",
    tone: "orange",
  },
  {
    id: "event-promo",
    label: "Event promo card",
    desc: "Weekend retreat sign-up with QR and follow-up CTA.",
    type: "Event",
    tone: "orange",
  },
  {
    id: "beacon-teaser",
    label: "Beacon teaser",
    desc: "Replay boost and clip promotion teaser.",
    type: "Beacon",
    tone: "green",
  },
  {
    id: "qr-prayer",
    label: "Prayer QR prompt",
    desc: "Prayer request intake routed to ministry support.",
    type: "QR",
    tone: "green",
  },
];

const CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    from: "Ama K.",
    body: "Audio is clear now. Thank you team 🙏",
    time: "Now",
    pinned: true,
  },
  {
    id: 2,
    from: "Joseph N.",
    body: "Please share the scripture reference again.",
    time: "1m",
  },
  {
    id: 3,
    from: "Mary A.",
    body: "Crowdfund link is not loading for one of our families.",
    time: "1m",
    flagged: true,
  },
  {
    id: 4,
    from: "Samuel T.",
    body: "Can the Swahili captions stay on during prayer?",
    time: "2m",
  },
];

const QA_ITEMS: QAItem[] = [
  {
    id: 1,
    from: "Daniel O.",
    question: "Can the host pray specifically for young families this morning?",
    status: "Picked",
  },
  {
    id: 2,
    from: "Ruthie C.",
    question: "Will the replay include the giving resources and notes?",
    status: "Queued",
  },
  {
    id: 3,
    from: "Victor M.",
    question: "Can you repeat the event sign-up details for the retreat?",
    status: "Queued",
  },
];

const PRAYER_REQUESTS: PrayerRequest[] = [
  {
    id: 1,
    from: "Anonymous",
    body: "Urgent prayer for hospital recovery and strength for the family.",
    urgency: "High",
  },
  {
    id: 2,
    from: "Naomi P.",
    body: "Prayer for job breakthrough and wisdom this week.",
    urgency: "Watch",
  },
  {
    id: 3,
    from: "Families Group",
    body: "Prayer for peace in our home and guidance for parenting.",
    urgency: "Low",
  },
];

const POLL_ITEMS: PollItem[] = [
  {
    id: 1,
    question: "Which follow-up would help you most after this live session?",
    yes: 62,
    no: 38,
    status: "Live",
  },
  {
    id: 2,
    question: "Should we keep the translated track active for the full replay?",
    yes: 81,
    no: 19,
    status: "Ready",
  },
];

const INITIAL_CLIPS: ClipMark[] = [
  {
    id: 1,
    time: "00:03:12",
    label: "Opening welcome promise",
    category: "Highlight",
  },
  {
    id: 2,
    time: "00:18:44",
    label: "Romans 12 scripture moment",
    category: "Scripture",
  },
  {
    id: 3,
    time: "00:42:07",
    label: "Prayer response wave",
    category: "Prayer",
  },
];

const LANGUAGE_TRACKS = ["English", "Swahili", "French", "Arabic"] as const;

const cx = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");

function toneClasses(tone: SceneTone) {
  if (tone === "green") {
    return {
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-800 dark:text-emerald-300",
    };
  }
  if (tone === "orange") {
    return {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      border: "border-orange-200 dark:border-orange-800",
      text: "text-orange-800 dark:text-orange-300",
    };
  }
  return {
    bg: "bg-slate-50 dark:bg-slate-900",
    border: "border-slate-200 dark:border-slate-700",
    text: "text-slate-800 dark:text-slate-300",
  };
}

function healthPillClasses(tone: HealthTone) {
  if (tone === "healthy") {
    return "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300";
  }
  if (tone === "watch") {
    return "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300";
  }
  return "border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300";
}

function formatLiveTimer(totalSeconds: number) {
  const secs = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  const seconds = secs % 60;
  return `${hours > 0 ? `${String(hours).padStart(2, "0")}:` : ""}${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatCurrency(amount: number) {
  return `£${amount.toLocaleString()}`;
}

function TopStat({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex flex-col items-start rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs transition-colors">
      <span className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</span>
    </span>
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
  const cls =
    tone === "good"
      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
      : tone === "warn"
      ? "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"
      : tone === "danger"
      ? "border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300"
      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300";
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold", cls)}>
      {icon}
      {text}
    </span>
  );
}

function CardShell({
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
    <section className={cx("rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors shadow-sm", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function MiniBar({ value, max = 100, tone = "green" }: { value: number; max?: number; tone?: "green" | "orange" | "slate" }) {
  const width = `${Math.max(6, Math.min(100, (value / Math.max(1, max)) * 100))}%`;
  const bg = tone === "orange" ? EV_ORANGE : tone === "green" ? EV_GREEN : EV_GREY;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div className="h-full rounded-full" style={{ width, background: bg }} />
    </div>
  );
}

function StudioStatusBadge({ mode, timer }: { mode: Mode; timer: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
        mode === "live"
          ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300",
      )}
    >
      <span className={cx("h-2 w-2 rounded-full", mode === "live" ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} />
      {mode === "live" ? `Live • ${timer}` : "Pre-live lobby"}
    </span>
  );
}

function formatClipTime(elapsedSec: number) {
  return formatLiveTimer(elapsedSec || 0).padStart(8, "0");
}

function AudienceMiniPreview({
  device,
  sceneLabel,
  ctaLabel,
  captionsEnabled,
}: {
  device: PreviewDevice;
  sceneLabel: string;
  ctaLabel: string;
  captionsEnabled: boolean;
}) {
  const isMobile = device === "mobile";
  return (
    <div
      className={cx(
        "overflow-hidden rounded-[28px] border border-slate-200 dark:border-slate-700 bg-slate-950 shadow-sm",
        isMobile ? "mx-auto w-[200px]" : "w-full",
      )}
    >
      <div className={cx("bg-slate-950 p-2", isMobile ? "rounded-[28px]" : "rounded-[24px]")}>
        <div className="overflow-hidden rounded-[20px] bg-white dark:bg-slate-900 transition-colors">
          <div className="h-8 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 px-3 flex items-center justify-between">
            <div className="text-[10px] font-semibold text-slate-900 dark:text-slate-100">FaithHub Live</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">4.8k watching</div>
          </div>
          <div className={cx("relative bg-slate-950", isMobile ? "aspect-[9/14]" : "aspect-[16/9]")}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(3,205,140,0.22),transparent_40%),linear-gradient(135deg,rgba(2,6,23,1),rgba(15,23,42,1))]" />
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-red-600/90 px-2.5 py-1 text-[10px] font-bold text-white">
              <span className="h-2 w-2 rounded-full bg-white" />
              LIVE
            </div>
            <div className="absolute right-4 top-4 rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold text-white backdrop-blur">
              {sceneLabel}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-x-4 bottom-4">
              <div className="text-[14px] font-black text-white">{SESSION.title}</div>
              <div className="mt-1 text-[11px] text-white/90">{SESSION.parentLabel}</div>
              <div className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur">
                <HeartHandshake className="h-3.5 w-3.5" />
                {ctaLabel}
              </div>
              {captionsEnabled ? (
                <div className="mt-3 max-w-[70%] rounded-lg bg-black/55 px-2 py-1 text-[10px] leading-relaxed text-white">
                  “Grace changes not just what we do, but who we become.”
                </div>
              ) : null}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-[10px] text-slate-600 dark:text-slate-400">
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100">Prayer</div>
              <div>{SESSION.audience.prayerCount} active</div>
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100">Chat</div>
              <div>{SESSION.audience.chatVelocity}/min</div>
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100">Donate</div>
              <div>Open</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FaithHubLiveStudioPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("standby");
  const [elapsedSec, setElapsedSec] = useState(0);
  const [activeSceneId, setActiveSceneId] = useState("welcome");
  const [previewSceneId, setPreviewSceneId] = useState("sermon");
  const [selectedSourceId, setSelectedSourceId] = useState("cam-host");
  const [selectedCTAId, setSelectedCTAId] = useState("lower-third");
  const [interactionTab, setInteractionTab] = useState<InteractionTab>("chat");
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [translationsEnabled, setTranslationsEnabled] = useState(true);
  const [primaryTrack, setPrimaryTrack] = useState<(typeof LANGUAGE_TRACKS)[number]>("English");
  const [secondaryTrack, setSecondaryTrack] = useState<(typeof LANGUAGE_TRACKS)[number]>("Swahili");
  const [recordingOn, setRecordingOn] = useState(true);
  const [isoTracksOn, setIsoTracksOn] = useState(true);
  const [muteAll, setMuteAll] = useState(false);
  const [emergencySlate, setEmergencySlate] = useState(false);
  const [fallbackArmed, setFallbackArmed] = useState(true);
  const [slowMode, setSlowMode] = useState(false);
  const [prayerTriage, setPrayerTriage] = useState(true);
  const [pinnedNotice, setPinnedNotice] = useState(true);
  const [stageMembers, setStageMembers] = useState<StageMember[]>(STAGE_MEMBERS);
  const [clipMarks, setClipMarks] = useState<ClipMark[]>(INITIAL_CLIPS);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "live") return;
    const interval = window.setInterval(() => {
      setElapsedSec((current) => current + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [mode]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const liveTimer = useMemo(() => formatLiveTimer(elapsedSec), [elapsedSec]);
  const activeScene = useMemo(() => SCENES.find((scene) => scene.id === activeSceneId) || SCENES[0], [activeSceneId]);
  const previewScene = useMemo(() => SCENES.find((scene) => scene.id === previewSceneId) || SCENES[1], [previewSceneId]);
  const selectedSource = useMemo(() => SOURCES.find((item) => item.id === selectedSourceId) || SOURCES[0], [selectedSourceId]);
  const selectedCTA = useMemo(() => CTA_ITEMS.find((item) => item.id === selectedCTAId) || CTA_ITEMS[0], [selectedCTAId]);

  const stageReadyCount = stageMembers.filter((item) => item.status === "On stage" || item.status === "Backstage").length;
  const audienceViewers = mode === "live" ? SESSION.audience.viewers + Math.min(480, elapsedSec * 2) : SESSION.audience.viewers;
  const donationTotal = 12680 + elapsedSec * 9;
  const crowdfundRaised = 8440 + elapsedSec * 5;
  const eventSignups = 91 + Math.min(34, Math.floor(elapsedSec / 25));
  const beaconTeasers = 28 + Math.min(22, Math.floor(elapsedSec / 30));

  const showToast = (message: string) => setToast(message);

  const handleQueueScene = (sceneId: string) => {
    setPreviewSceneId(sceneId);
    const next = SCENES.find((scene) => scene.id === sceneId);
    showToast(`${next?.label || "Scene"} queued in preview`);
  };

  const handleTakeScene = () => {
    setActiveSceneId(previewSceneId);
    const nextScene = SCENES.find((scene) => scene.id === previewSceneId);
    showToast(`${nextScene?.label || "Scene"} moved to program`);
  };

  const handleTriggerCTA = (ctaId?: string) => {
    if (ctaId) setSelectedCTAId(ctaId);
    const current = CTA_ITEMS.find((item) => item.id === (ctaId || selectedCTAId)) || CTA_ITEMS[0];
    showToast(`${current.label} fired on air`);
  };

  const handleInviteCoHost = () => {
    showToast("Co-host invite link copied");
  };

  const handleGoLive = () => {
    if (mode === "standby") {
      setMode("live");
      setElapsedSec(0);
      setEmergencySlate(false);
      showToast("FaithHub session is now live");
      return;
    }
    setMode("standby");
    showToast("Live ended • Post-live handoff ready");
  };

  const handleMarkClip = (label = "Manual highlight marker") => {
    const nextMark: ClipMark = {
      id: Date.now(),
      time: formatClipTime(elapsedSec),
      label,
      category: "Highlight",
    };
    setClipMarks((current) => [nextMark, ...current]);
    showToast("Highlight marker added");
  };

  const cycleStageMember = (memberId: string) => {
    setStageMembers((current) =>
      current.map((member) => {
        if (member.id !== memberId) return member;
        const nextStatus =
          member.status === "On stage" ? "Backstage" : member.status === "Backstage" ? "Not joined" : "On stage";
        return { ...member, status: nextStatus };
      }),
    );
  };

  const handleEmergencySlate = () => {
    setEmergencySlate((current) => !current);
    showToast(!emergencySlate ? "Emergency slate armed" : "Emergency slate removed");
  };

  const handleFallback = () => {
    setFallbackArmed((current) => !current);
    showToast(!fallbackArmed ? "Fallback source engaged" : "Fallback source returned to standby");
  };

  const handleMuteAll = () => {
    setMuteAll((current) => !current);
    showToast(!muteAll ? "All presenter mics muted" : "Presenter audio restored");
  };

  const headerBadge = (
    <div className="flex flex-wrap items-center gap-2 md:gap-3">
      <StudioStatusBadge mode={mode} timer={liveTimer} />
      <TopStat label="Viewers" value={audienceViewers.toLocaleString()} />
      <TopStat label="Chat/min" value={`${SESSION.audience.chatVelocity}`} />
      <TopStat label="Destinations" value={`${SESSION.destinations.length}`} />
      <TopStat label="Clip marks" value={`${clipMarks.length}`} />
      <button
        type="button"
        onClick={handleInviteCoHost}
        className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 transition-colors hover:bg-orange-100 dark:border-orange-900 dark:bg-orange-900/20 dark:text-orange-300"
      >
        <Plus className="h-4 w-4" />
        Invite co-host
      </button>
      <button
        type="button"
        onClick={() => handleTriggerCTA()}
        className="inline-flex items-center gap-2 rounded-2xl border border-transparent px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-95"
        style={{ background: EV_ORANGE }}
      >
        <Wand2 className="h-4 w-4" />
        Trigger scene/CTA
      </button>
      <button
        type="button"
        onClick={handleGoLive}
        className="inline-flex items-center gap-2 rounded-2xl border border-transparent px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-95"
        style={{ background: mode === "live" ? "#dc2626" : EV_GREEN }}
      >
        <Radio className="h-4 w-4" />
        {mode === "live" ? "End live" : "Go live"}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(3,205,140,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(247,127,0,0.08),transparent_32%)] bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-50">
      <PageHeader
        pageTitle="Live Studio"
        badge={headerBadge}
        className="border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80"
      />

      <div className="hidden xl:flex h-[calc(100dvh-76px)] flex-col overflow-hidden">
        <main className="flex min-h-0 flex-1 gap-4 overflow-hidden p-4 sm:p-6 lg:p-8">
          <section className="w-[330px] shrink-0 space-y-4 overflow-y-auto pb-28 pr-1">
            <CardShell
              title="Session & scene builder"
              subtitle="Queue the next scene and keep reusable templates close."
              right={<Pill text={`${SCENES.length} scenes`} icon={<LayoutTemplate className="h-3.5 w-3.5" />} />}
            >
              <div className="space-y-2">
                {SCENES.map((scene) => {
                  const tones = toneClasses(scene.tone);
                  const queued = scene.id === previewSceneId;
                  const active = scene.id === activeSceneId && !emergencySlate;
                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => handleQueueScene(scene.id)}
                      className={cx(
                        "w-full rounded-2xl border p-3 text-left transition-colors",
                        queued
                          ? `${tones.bg} ${tones.border}`
                          : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-flex h-8 min-w-[36px] items-center justify-center rounded-full text-[10px] font-black text-white"
                              style={{ background: scene.tone === "orange" ? EV_ORANGE : scene.tone === "green" ? EV_GREEN : EV_GREY }}
                            >
                              {scene.label.slice(0, 2).toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <div className="truncate text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                                {scene.label}
                              </div>
                              <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{scene.template}</div>
                            </div>
                          </div>
                          <div className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                            {scene.desc}
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          {active ? <Pill text="Program" tone="good" /> : queued ? <Pill text="Preview" tone="warn" /> : <Pill text={scene.durationHint} />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleTakeScene}
                  className="inline-flex items-center gap-2 rounded-2xl border border-transparent px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-95"
                  style={{ background: EV_GREEN }}
                >
                  <MoveRight className="h-4 w-4" />
                  Take queued scene
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerCTA("lower-third")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 transition-colors hover:bg-orange-100 dark:border-orange-900 dark:bg-orange-900/20 dark:text-orange-300"
                >
                  <Sparkles className="h-4 w-4" />
                  Fire lower third
                </button>
              </div>
            </CardShell>

            <CardShell
              title="Sources & media"
              subtitle="Cameras, screen share, loops and emergency-safe fallback paths."
              right={<Pill text="7 sources" icon={<Video className="h-3.5 w-3.5" />} />}
            >
              <div className="space-y-2">
                {SOURCES.map((source) => (
                  <button
                    key={source.id}
                    type="button"
                    onClick={() => setSelectedSourceId(source.id)}
                    className={cx(
                      "w-full rounded-2xl border p-3 text-left transition-colors",
                      selectedSourceId === source.id
                        ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                        : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800",
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-[12px] font-semibold text-slate-900 dark:text-slate-100">{source.label}</div>
                        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{source.detail}</div>
                      </div>
                      <span className={cx("rounded-full border px-2.5 py-1 text-[10px] font-semibold", healthPillClasses(source.health))}>
                        {source.health === "healthy" ? "Healthy" : source.health === "watch" ? "Watch" : "Risk"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                    <ScreenShare className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                    Screen share
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Enabled for scripture deck and sermon notes.</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                    <ImageIcon className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                    Quick assets
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">5 lower thirds, 2 loop videos, 1 emergency slate.</div>
                </div>
              </div>
            </CardShell>

            <CardShell
              title="Presenter & backstage"
              subtitle="Bring people on or off stage with role-aware control notes."
              right={<Pill text={`${stageReadyCount}/${stageMembers.length} ready`} tone="good" icon={<Users className="h-3.5 w-3.5" />} />}
            >
              <div className="space-y-2">
                {stageMembers.map((member) => (
                  <div
                    key={member.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-black text-white"
                            style={{ background: member.status === "On stage" ? EV_GREEN : member.status === "Backstage" ? EV_ORANGE : EV_GREY }}
                          >
                            {member.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)}
                          </span>
                          <div className="min-w-0">
                            <div className="truncate text-[12px] font-semibold text-slate-900 dark:text-slate-100">{member.name}</div>
                            <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{member.role}</div>
                          </div>
                        </div>
                        <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-400">{member.controlNote}</div>
                      </div>
                      <div className="shrink-0 text-right">
                        <Pill text={member.status} tone={member.status === "On stage" ? "good" : member.status === "Backstage" ? "warn" : "neutral"} />
                        {member.critical ? (
                          <div className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                            Critical role
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => cycleStageMember(member.id)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <ChevronRight className="h-4 w-4" />
                        Cycle status
                      </button>
                      <button
                        type="button"
                        onClick={handleInviteCoHost}
                        className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 transition-colors hover:bg-orange-100 dark:border-orange-900 dark:bg-orange-900/20 dark:text-orange-300"
                      >
                        <PhoneCall className="h-4 w-4" />
                        Backstage call
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardShell>

            <CardShell
              title="Emergency & recovery"
              subtitle="High-trust controls for failure cases without leaving studio."
              right={<Pill text="High trust" tone="warn" icon={<ShieldCheck className="h-3.5 w-3.5" />} />}
            >
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={handleMuteAll}
                  className={cx(
                    "rounded-2xl border px-4 py-3 text-left text-[12px] font-semibold transition-colors",
                    muteAll
                      ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-900/20 dark:text-rose-300"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      Mute all presenters
                    </span>
                    <span>{muteAll ? "Active" : "Ready"}</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={handleEmergencySlate}
                  className={cx(
                    "rounded-2xl border px-4 py-3 text-left text-[12px] font-semibold transition-colors",
                    emergencySlate
                      ? "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-900/20 dark:text-orange-300"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2">
                      <Siren className="h-4 w-4" />
                      Emergency slate
                    </span>
                    <span>{emergencySlate ? "On air" : "Standby"}</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={handleFallback}
                  className={cx(
                    "rounded-2xl border px-4 py-3 text-left text-[12px] font-semibold transition-colors",
                    fallbackArmed
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2">
                      <TimerReset className="h-4 w-4" />
                      Fallback source
                    </span>
                    <span>{fallbackArmed ? "Armed" : "Inactive"}</span>
                  </div>
                </button>
              </div>
            </CardShell>
          </section>

          <section className="min-w-0 flex-1 space-y-4 overflow-y-auto pb-28 pr-1">
            <CardShell
              title="Program & preview monitors"
              subtitle="See what is live, what is queued next, and the health of every production layer."
              right={
                <div className="flex flex-wrap items-center gap-2">
                  <Pill text={selectedSource.label} icon={<MonitorPlay className="h-3.5 w-3.5" />} />
                  <Pill text={captionsEnabled ? "Captions on" : "Captions off"} tone={captionsEnabled ? "good" : "warn"} icon={<Captions className="h-3.5 w-3.5" />} />
                </div>
              }
            >
              <div className="grid gap-4 xl:grid-cols-2">
                <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 text-[12px] font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-950/90 dark:text-slate-100">
                    <span className="inline-flex items-center gap-2">
                      <Radio className="h-4 w-4" style={{ color: mode === "live" ? EV_GREEN : EV_GREY }} />
                      Program monitor
                    </span>
                    <Pill text={emergencySlate ? "Emergency slate" : activeScene.label} tone={emergencySlate ? "warn" : "good"} />
                  </div>
                  <div className="relative aspect-[16/10] bg-slate-950">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(3,205,140,0.24),transparent_32%),linear-gradient(135deg,rgba(2,6,23,1),rgba(15,23,42,1))]" />
                    {emergencySlate ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <div className="rounded-full border border-orange-300/40 bg-orange-500/15 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-orange-200">
                          FaithHub recovery slate
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-black text-white">Please stand by</div>
                          <div className="mt-2 text-sm text-white/75">The team is restoring the live session now.</div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-red-600/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white">
                          <span className="h-2 w-2 rounded-full bg-white" />
                          {mode === "live" ? "Live" : "Preview only"}
                        </div>
                        <div className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur">
                          {activeScene.template}
                        </div>
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
                        <div className="absolute inset-x-4 bottom-5">
                          <div className="text-[22px] font-black text-white">{activeScene.label}</div>
                          <div className="mt-1 text-sm text-white/85">{SESSION.parentLabel}</div>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur">
                              <Mic className="h-3.5 w-3.5" />
                              {stageMembers.find((member) => member.role === "Host")?.name}
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur">
                              <Gift className="h-3.5 w-3.5" />
                              {selectedCTA.label}
                            </span>
                          </div>
                          {captionsEnabled ? (
                            <div className="mt-4 max-w-[72%] rounded-lg bg-black/55 px-2.5 py-1.5 text-[11px] leading-relaxed text-white">
                              “Grace changes not just what we do, but who we become.”
                            </div>
                          ) : null}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 text-[12px] font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-950/90 dark:text-slate-100">
                    <span className="inline-flex items-center gap-2">
                      <Eye className="h-4 w-4" style={{ color: EV_ORANGE }} />
                      Preview monitor
                    </span>
                    <Pill text={previewScene.label} tone="warn" />
                  </div>
                  <div className="relative aspect-[16/10] bg-slate-950">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(247,127,0,0.24),transparent_30%),linear-gradient(135deg,rgba(15,23,42,1),rgba(2,6,23,1))]" />
                    <div className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur">
                      Queued next
                    </div>
                    <div className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur">
                      {selectedSource.label}
                    </div>
                    <div className="absolute inset-x-4 bottom-5">
                      <div className="text-[22px] font-black text-white">{previewScene.label}</div>
                      <div className="mt-1 max-w-[75%] text-sm text-white/80">{previewScene.desc}</div>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {SOURCES.slice(0, 4).map((source) => (
                          <div
                            key={source.id}
                            className={cx(
                              "rounded-2xl border px-3 py-2 text-[10px] font-semibold text-white/90 backdrop-blur",
                              selectedSource.id === source.id ? "border-emerald-300/40 bg-emerald-500/10" : "border-white/10 bg-white/5",
                            )}
                          >
                            {source.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Ingest health</div>
                  <div className="mt-2 text-[28px] font-black leading-[1.04] tracking-[-0.03em] text-slate-900 dark:text-slate-100 sm:text-[34px] lg:text-[40px]">96%</div>
                  <div className="mt-2">
                    <MiniBar value={96} tone="green" />
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">
                  <div className="mt-1.5 text-[14px] leading-6 text-slate-500 dark:text-slate-400">Audio confidence</div>
                  <div className="mt-1 text-xl font-black text-slate-900 dark:text-slate-100">94%</div>
                  <div className="mt-2">
                    <MiniBar value={94} tone="green" />
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Latency</div>
                  <div className="mt-1 text-xl font-black text-slate-900 dark:text-slate-100">2.4s</div>
                  <div className="mt-2">
                    <MiniBar value={72} tone="orange" />
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Destination sync</div>
                  <div className="mt-1 text-xl font-black text-slate-900 dark:text-slate-100">98%</div>
                  <div className="mt-2">
                    <MiniBar value={98} tone="green" />
                  </div>
                </div>
              </div>
            </CardShell>

            <div className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
              <CardShell
                title="Graphics & CTA layer"
                subtitle="Lower thirds, scripture callouts, donation banners, progress bars, QR prompts and Beacon teasers."
                right={<Pill text={`${CTA_ITEMS.length} presets`} icon={<Sparkles className="h-3.5 w-3.5" />} />}
              >
                <div className="grid gap-3 md:grid-cols-2">
                  {CTA_ITEMS.map((item) => {
                    const tones = toneClasses(item.tone);
                    const active = selectedCTAId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleTriggerCTA(item.id)}
                        className={cx(
                          "rounded-2xl border p-3 text-left transition-colors",
                          active ? `${tones.bg} ${tones.border}` : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">{item.label}</div>
                            <div className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{item.desc}</div>
                          </div>
                          <Pill text={item.type} tone={item.tone === "green" ? "good" : item.tone === "orange" ? "warn" : "neutral"} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Live donations</div>
                    <div className="mt-1 text-lg font-black text-slate-900 dark:text-slate-100">{formatCurrency(donationTotal)}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Crowdfund</div>
                    <div className="mt-1 text-lg font-black text-slate-900 dark:text-slate-100">{formatCurrency(crowdfundRaised)}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Event sign-ups</div>
                    <div className="mt-1 text-lg font-black text-slate-900 dark:text-slate-100">{eventSignups}</div>
                  </div>
                </div>
              </CardShell>

              <CardShell
                title="Captioning & translation"
                subtitle="Accessibility-ready tracks, language overlays and confidence indicators."
                right={<Pill text={translationsEnabled ? "Translation ready" : "Translation off"} tone={translationsEnabled ? "good" : "warn"} icon={<Languages className="h-3.5 w-3.5" />} />}
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setCaptionsEnabled((current) => !current)}
                    className={cx(
                      "rounded-2xl border p-3 text-left transition-colors",
                      captionsEnabled
                        ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                        : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900",
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                        <Captions className="h-4 w-4" />
                        Live captions
                      </span>
                      <Pill text={captionsEnabled ? "On" : "Off"} tone={captionsEnabled ? "good" : "warn"} />
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                      Live captions are synced with scripture-safe overlay zones.
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTranslationsEnabled((current) => !current)}
                    className={cx(
                      "rounded-2xl border p-3 text-left transition-colors",
                      translationsEnabled
                        ? "border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-900/20"
                        : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900",
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                        <Globe2 className="h-4 w-4" />
                        Translation tracks
                      </span>
                      <Pill text={translationsEnabled ? "Active" : "Paused"} tone={translationsEnabled ? "warn" : "neutral"} />
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                      FaithHub can surface secondary subtitle and overlay tracks on supported viewers.
                    </div>
                  </button>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Primary caption language</div>
                    <select
                      value={primaryTrack}
                      onChange={(event) => setPrimaryTrack(event.target.value as (typeof LANGUAGE_TRACKS)[number])}
                      className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    >
                      {LANGUAGE_TRACKS.map((track) => (
                        <option key={track} value={track}>
                          {track}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Secondary translated track</div>
                    <select
                      value={secondaryTrack}
                      onChange={(event) => setSecondaryTrack(event.target.value as (typeof LANGUAGE_TRACKS)[number])}
                      className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-colors focus:border-orange-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    >
                      {LANGUAGE_TRACKS.filter((track) => track !== primaryTrack).map((track) => (
                        <option key={track} value={track}>
                          {track}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Caption confidence</div>
                    <div className="mt-1 text-xl font-black text-slate-900 dark:text-slate-100">96%</div>
                    <div className="mt-2">
                      <MiniBar value={96} tone="green" />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Translation sync</div>
                    <div className="mt-1 text-xl font-black text-slate-900 dark:text-slate-100">91%</div>
                    <div className="mt-2">
                      <MiniBar value={91} tone="orange" />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Subtitle safe-area</div>
                    <div className="mt-1 text-xl font-black text-slate-900 dark:text-slate-100">Ready</div>
                    <div className="mt-2">
                      <MiniBar value={100} tone="green" />
                    </div>
                  </div>
                </div>
              </CardShell>
            </div>

            <CardShell
              title="Recording & clip marks"
              subtitle="Manage master recording, isolated tracks and fast post-live clip workflows."
              right={<Pill text={recordingOn ? "Recording on" : "Recording off"} tone={recordingOn ? "good" : "warn"} icon={<Clapperboard className="h-3.5 w-3.5" />} />}
            >
              <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="space-y-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                        <Film className="h-4 w-4" />
                        Master recording
                      </span>
                      <button
                        type="button"
                        onClick={() => setRecordingOn((current) => !current)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        {recordingOn ? "Pause" : "Resume"}
                      </button>
                    </div>
                    <div className="mt-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                      Recording includes program feed, scene metadata, CTA triggers, clip markers and destination timestamps.
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                        <Layers className="h-4 w-4" />
                        ISO tracks
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsoTracksOn((current) => !current)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        {isoTracksOn ? "Enabled" : "Disabled"}
                      </button>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">Host audio</div>
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">Room audio</div>
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">Caption feed</div>
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">Stage camera</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleMarkClip("Manual highlight")}
                      className="inline-flex items-center gap-2 rounded-2xl border border-transparent px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-95"
                      style={{ background: EV_GREEN }}
                    >
                      <BookmarkPlus className="h-4 w-4" />
                      Mark highlight
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMarkClip("Scripture marker")}
                      className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 transition-colors hover:bg-orange-100 dark:border-orange-900 dark:bg-orange-900/20 dark:text-orange-300"
                    >
                      <Zap className="h-4 w-4" />
                      Mark scripture
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">Clip mark timeline</div>
                      <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        Every marker is preserved for Post-live Publishing and Replays & Clips.
                      </div>
                    </div>
                    <Pill text={`${clipMarks.length} markers`} icon={<Film className="h-3.5 w-3.5" />} />
                  </div>
                  <div className="mt-4 space-y-2">
                    {clipMarks.map((mark) => (
                      <div
                        key={mark.id}
                        className="grid grid-cols-[92px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-[12px] dark:border-slate-700 dark:bg-slate-900"
                      >
                        <div className="font-black text-slate-900 dark:text-slate-100">{mark.time}</div>
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-slate-900 dark:text-slate-100">{mark.label}</div>
                          <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{mark.category}</div>
                        </div>
                        <Pill text="Saved" tone="good" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardShell>
          </section>

          <section className="w-[360px] shrink-0 space-y-4 overflow-y-auto pb-28 pr-1">
            <CardShell
              title="Interaction hub"
              subtitle="Live chat, moderated questions, prayer requests and polls without leaving studio."
              right={<Pill text="Moderator ready" tone="good" icon={<ShieldCheck className="h-3.5 w-3.5" />} />}
            >
              <div className="grid grid-cols-4 gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-950">
                {([
                  { key: "chat", label: "Chat", icon: <MessageSquare className="h-4 w-4" /> },
                  { key: "qa", label: "Q&A", icon: <PlayCircle className="h-4 w-4" /> },
                  { key: "prayer", label: "Prayer", icon: <MessageCircleHeart className="h-4 w-4" /> },
                  { key: "polls", label: "Polls", icon: <PanelTop className="h-4 w-4" /> },
                ] as const).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setInteractionTab(tab.key)}
                    className={cx(
                      "inline-flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition-colors",
                      interactionTab === tab.key
                        ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
                    )}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                {interactionTab === "chat" &&
                  CHAT_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={cx(
                        "rounded-2xl border px-3 py-3",
                        message.flagged
                          ? "border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-900/20"
                          : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">{message.from}</span>
                          {message.pinned ? <Pill text="Pinned" tone="good" /> : null}
                          {message.flagged ? <Pill text="Flagged" tone="danger" /> : null}
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">{message.time}</span>
                      </div>
                      <div className="mt-2 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">{message.body}</div>
                    </div>
                  ))}

                {interactionTab === "qa" &&
                  QA_ITEMS.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-700 dark:bg-slate-950">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">{item.from}</span>
                        <Pill text={item.status} tone={item.status === "Picked" ? "good" : item.status === "Queued" ? "warn" : "neutral"} />
                      </div>
                      <div className="mt-2 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">{item.question}</div>
                    </div>
                  ))}

                {interactionTab === "prayer" &&
                  PRAYER_REQUESTS.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-700 dark:bg-slate-950">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">{item.from}</span>
                        <Pill text={item.urgency} tone={item.urgency === "High" ? "danger" : item.urgency === "Watch" ? "warn" : "neutral"} />
                      </div>
                      <div className="mt-2 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">{item.body}</div>
                    </div>
                  ))}

                {interactionTab === "polls" &&
                  POLL_ITEMS.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-700 dark:bg-slate-950">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">{item.question}</span>
                        <Pill text={item.status} tone={item.status === "Live" ? "good" : item.status === "Ready" ? "warn" : "neutral"} />
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">Yes</div>
                          <div className="mt-1 text-lg font-black text-slate-900 dark:text-slate-100">{item.yes}%</div>
                          <div className="mt-2">
                            <MiniBar value={item.yes} tone="green" />
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">No</div>
                          <div className="mt-1 text-lg font-black text-slate-900 dark:text-slate-100">{item.no}%</div>
                          <div className="mt-2">
                            <MiniBar value={item.no} tone="orange" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSlowMode((current) => !current);
                    showToast(!slowMode ? "Slow mode enabled" : "Slow mode disabled");
                  }}
                  className={cx(
                    "rounded-2xl border px-3 py-3 text-left text-[12px] font-semibold transition-colors",
                    slowMode
                      ? "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-900/20 dark:text-orange-300"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2">
                      <Settings2 className="h-4 w-4" />
                      Slow mode
                    </span>
                    <span>{slowMode ? "On" : "Off"}</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPinnedNotice((current) => !current);
                    showToast(!pinnedNotice ? "Pinned notice activated" : "Pinned notice cleared");
                  }}
                  className={cx(
                    "rounded-2xl border px-3 py-3 text-left text-[12px] font-semibold transition-colors",
                    pinnedNotice
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Pinned notice
                    </span>
                    <span>{pinnedNotice ? "Live" : "Off"}</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPrayerTriage((current) => !current);
                    showToast(!prayerTriage ? "Prayer triage enabled" : "Prayer triage disabled");
                  }}
                  className={cx(
                    "rounded-2xl border px-3 py-3 text-left text-[12px] font-semibold transition-colors",
                    prayerTriage
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2">
                      <HandHeart className="h-4 w-4" />
                      Prayer triage
                    </span>
                    <span>{prayerTriage ? "On" : "Off"}</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.liveDashboard)}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left text-[12px] font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Open dashboard
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </button>
              </div>
            </CardShell>

            <CardShell
              title="Audience experience preview"
              subtitle="Preview how the session looks on the audience side without leaving studio."
              right={<Pill text={previewDevice === "desktop" ? "Desktop view" : "Mobile view"} icon={<Eye className="h-3.5 w-3.5" />} />}
            >
              <div className="mb-3 inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-950">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={cx(
                    "rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-colors",
                    previewDevice === "desktop"
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100"
                      : "text-slate-500 dark:text-slate-400",
                  )}
                >
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={cx(
                    "rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-colors",
                    previewDevice === "mobile"
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100"
                      : "text-slate-500 dark:text-slate-400",
                  )}
                >
                  Mobile
                </button>
              </div>

              <AudienceMiniPreview
                device={previewDevice}
                sceneLabel={activeScene.label}
                ctaLabel={selectedCTA.label}
                captionsEnabled={captionsEnabled}
              />

              <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-center dark:border-slate-700 dark:bg-slate-950">
                  <div className="font-black text-slate-900 dark:text-slate-100">{audienceViewers.toLocaleString()}</div>
                  <div className="mt-1 text-slate-500 dark:text-slate-400">Watching</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-center dark:border-slate-700 dark:bg-slate-950">
                  <div className="font-black text-slate-900 dark:text-slate-100">{beaconTeasers}</div>
                  <div className="mt-1 text-slate-500 dark:text-slate-400">Beacon teasers</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-center dark:border-slate-700 dark:bg-slate-950">
                  <div className="font-black text-slate-900 dark:text-slate-100">{SESSION.audience.prayerCount}</div>
                  <div className="mt-1 text-slate-500 dark:text-slate-400">Prayer requests</div>
                </div>
              </div>
            </CardShell>

            <CardShell
              title="Post-live launch pad"
              subtitle="Keep distribution and publishing one click away once the session ends."
              right={<Pill text="Ready" tone="good" icon={<CheckCircle2 className="h-3.5 w-3.5" />} />}
            >
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.streamToPlatforms)}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-white dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900"
                >
                  <div>
                    <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">Open Stream-to-Platforms</div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Adjust destinations, health and output variants.</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.postLivePublishing)}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-white dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900"
                >
                  <div>
                    <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">Open Post-live Publishing</div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Replay package, notes, chapters and clip workflows.</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={() => showToast("Beacon teaser package prepared")}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-white dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900"
                >
                  <div>
                    <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">Prepare Beacon replay teaser</div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Use live-response signals to power promotion fast.</div>
                  </div>
                  <Zap className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
            </CardShell>
          </section>
        </main>

        <div className="border-t border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex flex-wrap items-center gap-2 lg:gap-3">
            <button
              type="button"
              onClick={handleGoLive}
              className="inline-flex items-center gap-2 rounded-2xl border border-transparent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-95"
              style={{ background: mode === "live" ? "#dc2626" : EV_GREEN }}
            >
              <Radio className="h-4 w-4" />
              {mode === "live" ? "End live" : "Go live"}
            </button>
            <button
              type="button"
              onClick={handleInviteCoHost}
              className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-100 dark:border-orange-900 dark:bg-orange-900/20 dark:text-orange-300"
            >
              <PhoneCall className="h-4 w-4" />
              Invite co-host
            </button>
            <button
              type="button"
              onClick={() => handleTriggerCTA()}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Sparkles className="h-4 w-4" />
              Trigger scene/CTA
            </button>
            <button
              type="button"
              onClick={() => handleMarkClip()}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <BookmarkPlus className="h-4 w-4" />
              Mark clip
            </button>
            <button
              type="button"
              onClick={handleEmergencySlate}
              className={cx(
                "inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition-colors",
                emergencySlate
                  ? "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-900/20 dark:text-orange-300"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
              )}
            >
              <Siren className="h-4 w-4" />
              Emergency slate
            </button>
            <button
              type="button"
              onClick={handleFallback}
              className={cx(
                "inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition-colors",
                fallbackArmed
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
              )}
            >
              <TimerReset className="h-4 w-4" />
              Fallback source
            </button>
            <button
              type="button"
              onClick={() => navigate(ROUTES.streamToPlatforms)}
              className="ml-auto inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ExternalLink className="h-4 w-4" />
              Stream-to-Platforms
            </button>
          </div>
        </div>
      </div>

      <MobileLiveStudio
        mode={mode}
        liveTimer={liveTimer}
        activeScene={activeScene}
        previewScene={previewScene}
        selectedCTA={selectedCTA}
        selectedSource={selectedSource}
        previewDevice={previewDevice}
        setPreviewDevice={setPreviewDevice}
        captionsEnabled={captionsEnabled}
        setCaptionsEnabled={setCaptionsEnabled}
        translationsEnabled={translationsEnabled}
        setTranslationsEnabled={setTranslationsEnabled}
        interactionTab={interactionTab}
        setInteractionTab={setInteractionTab}
        clipMarks={clipMarks}
        handleGoLive={handleGoLive}
        handleInviteCoHost={handleInviteCoHost}
        handleTriggerCTA={handleTriggerCTA}
        handleMarkClip={handleMarkClip}
        handleQueueScene={handleQueueScene}
        navigate={navigate}
      />

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-xl dark:bg-slate-100 dark:text-slate-900"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function MobileLiveStudio({
  mode,
  liveTimer,
  activeScene,
  previewScene,
  selectedCTA,
  selectedSource,
  previewDevice,
  setPreviewDevice,
  captionsEnabled,
  setCaptionsEnabled,
  translationsEnabled,
  setTranslationsEnabled,
  interactionTab,
  setInteractionTab,
  clipMarks,
  handleGoLive,
  handleInviteCoHost,
  handleTriggerCTA,
  handleMarkClip,
  handleQueueScene,
  navigate,
}: {
  mode: Mode;
  liveTimer: string;
  activeScene: Scene;
  previewScene: Scene;
  selectedCTA: CTAItem;
  selectedSource: SourceItem;
  previewDevice: PreviewDevice;
  setPreviewDevice: (device: PreviewDevice) => void;
  captionsEnabled: boolean;
  setCaptionsEnabled: (value: boolean | ((current: boolean) => boolean)) => void;
  translationsEnabled: boolean;
  setTranslationsEnabled: (value: boolean | ((current: boolean) => boolean)) => void;
  interactionTab: InteractionTab;
  setInteractionTab: (value: InteractionTab) => void;
  clipMarks: ClipMark[];
  handleGoLive: () => void;
  handleInviteCoHost: () => void;
  handleTriggerCTA: () => void;
  handleMarkClip: () => void;
  handleQueueScene: (sceneId: string) => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  return (
    <div className="xl:hidden">
      <div className="space-y-4 px-4 pb-28 pt-4 sm:px-6">
        <CardShell
          title="Program monitor"
          subtitle={SESSION.title}
          right={<StudioStatusBadge mode={mode} timer={liveTimer} />}
        >
          <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700">
            <div className="relative aspect-[16/10] bg-slate-950">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(3,205,140,0.24),transparent_32%),linear-gradient(135deg,rgba(2,6,23,1),rgba(15,23,42,1))]" />
              <div className="absolute left-4 top-4 rounded-full bg-red-600/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white">
                {mode === "live" ? "Live" : "Lobby"}
              </div>
              <div className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur">
                {selectedSource.label}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
              <div className="absolute inset-x-4 bottom-5">
                <div className="text-[20px] font-black text-white">{activeScene.label}</div>
                <div className="mt-1 text-sm text-white/80">{selectedCTA.label}</div>
                {captionsEnabled ? (
                  <div className="mt-4 inline-block rounded-lg bg-black/55 px-2.5 py-1.5 text-[11px] text-white">
                    “Grace changes who we become.”
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {SCENES.map((scene) => (
              <button
                key={scene.id}
                type="button"
                onClick={() => handleQueueScene(scene.id)}
                className={cx(
                  "min-w-[150px] rounded-2xl border px-3 py-2 text-left text-[12px] font-semibold transition-colors",
                  previewScene.id === scene.id
                    ? "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-900/20 dark:text-orange-300"
                    : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
                )}
              >
                <div>{scene.label}</div>
                <div className="mt-1 text-[11px] font-normal text-slate-500 dark:text-slate-400">{scene.template}</div>
              </button>
            ))}
          </div>
        </CardShell>

        <CardShell
          title="Graphics & language"
          subtitle="Fast actions for overlays, captions and translated tracks."
          right={<Pill text={selectedCTA.type} tone="warn" />}
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleTriggerCTA()}
              className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-left text-[12px] font-semibold text-orange-700 transition-colors hover:bg-orange-100 dark:border-orange-900 dark:bg-orange-900/20 dark:text-orange-300"
            >
              Trigger {selectedCTA.label}
            </button>
            <button
              type="button"
              onClick={() => setCaptionsEnabled((current) => !current)}
              className={cx(
                "rounded-2xl border px-4 py-3 text-left text-[12px] font-semibold transition-colors",
                captionsEnabled
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                  : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
              )}
            >
              {captionsEnabled ? "Captions on" : "Captions off"}
            </button>
            <button
              type="button"
              onClick={() => setTranslationsEnabled((current) => !current)}
              className={cx(
                "rounded-2xl border px-4 py-3 text-left text-[12px] font-semibold transition-colors",
                translationsEnabled
                  ? "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-900/20 dark:text-orange-300"
                  : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
              )}
            >
              {translationsEnabled ? "Translation active" : "Translation off"}
            </button>
            <button
              type="button"
              onClick={handleMarkClip}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-[12px] font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              Mark highlight
            </button>
          </div>
        </CardShell>

        <CardShell
          title="Interaction"
          subtitle="Chat, questions, prayer and polls."
          right={<Pill text={`${clipMarks.length} markers`} />}
        >
          <div className="grid grid-cols-4 gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-950">
            {(["chat", "qa", "prayer", "polls"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setInteractionTab(tab)}
                className={cx(
                  "rounded-xl px-2 py-2 text-[11px] font-semibold transition-colors",
                  interactionTab === tab ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400",
                )}
              >
                {tab === "qa" ? "Q&A" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {interactionTab === "chat" &&
              CHAT_MESSAGES.slice(0, 2).map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-700 dark:bg-slate-950">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">{item.from}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{item.time}</div>
                  </div>
                  <div className="mt-2 text-[12px] text-slate-600 dark:text-slate-400">{item.body}</div>
                </div>
              ))}
            {interactionTab === "qa" &&
              QA_ITEMS.slice(0, 2).map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-700 dark:bg-slate-950">
                  <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">{item.question}</div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{item.from}</div>
                </div>
              ))}
            {interactionTab === "prayer" &&
              PRAYER_REQUESTS.slice(0, 2).map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-700 dark:bg-slate-950">
                  <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">{item.from}</div>
                  <div className="mt-2 text-[12px] text-slate-600 dark:text-slate-400">{item.body}</div>
                </div>
              ))}
            {interactionTab === "polls" &&
              POLL_ITEMS.slice(0, 1).map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-700 dark:bg-slate-950">
                  <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">{item.question}</div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Yes</div>
                      <div className="mt-1 text-lg font-black text-slate-900 dark:text-slate-100">{item.yes}%</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">No</div>
                      <div className="mt-1 text-lg font-black text-slate-900 dark:text-slate-100">{item.no}%</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardShell>

        <CardShell
          title="Audience preview"
          subtitle="Switch between desktop and mobile experience."
          right={<Pill text={previewDevice === "desktop" ? "Desktop" : "Mobile"} />}
        >
          <div className="mb-3 inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-950">
            <button
              type="button"
              onClick={() => setPreviewDevice("desktop")}
              className={cx(
                "rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-colors",
                previewDevice === "desktop" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400",
              )}
            >
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice("mobile")}
              className={cx(
                "rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-colors",
                previewDevice === "mobile" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400",
              )}
            >
              Mobile
            </button>
          </div>
          <AudienceMiniPreview
            device={previewDevice}
            sceneLabel={activeScene.label}
            ctaLabel={selectedCTA.label}
            captionsEnabled={captionsEnabled}
          />
        </CardShell>

        <CardShell title="Next actions" subtitle="Keep the live workflow connected to the next pages.">
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => navigate(ROUTES.streamToPlatforms)}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-[12px] font-semibold text-slate-700 transition-colors hover:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              Stream-to-Platforms
              <ExternalLink className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate(ROUTES.postLivePublishing)}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-[12px] font-semibold text-slate-700 transition-colors hover:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              Post-live Publishing
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </CardShell>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button
            type="button"
            onClick={handleGoLive}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-transparent px-3 py-3 text-xs font-semibold text-white transition-opacity hover:opacity-95"
            style={{ background: mode === "live" ? "#dc2626" : EV_GREEN }}
          >
            <Radio className="h-4 w-4" />
            {mode === "live" ? "End live" : "Go live"}
          </button>
          <button
            type="button"
            onClick={handleInviteCoHost}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-3 text-xs font-semibold text-orange-700 transition-colors hover:bg-orange-100 dark:border-orange-900 dark:bg-orange-900/20 dark:text-orange-300"
          >
            <Plus className="h-4 w-4" />
            Invite
          </button>
          <button
            type="button"
            onClick={() => handleTriggerCTA()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Sparkles className="h-4 w-4" />
            Trigger
          </button>
          <button
            type="button"
            onClick={() => handleMarkClip()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <BookmarkPlus className="h-4 w-4" />
            Clip
          </button>
        </div>
      </div>
    </div>
  );
}

export { FaithHubLiveStudioPage };




