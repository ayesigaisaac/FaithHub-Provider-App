// @ts-nocheck
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Archive,
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  Eye,
  Film,
  Flame,
  Globe2,
  Image as ImageIcon,
  Languages,
  Layers,
  MessageSquare,
  MonitorPlay,
  Play,
  Plus,
  Quote,
  RefreshCw,
  Scissors,
  Search,
  Send,
  Sparkles,
  Star,
  Video,
  Wand2,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { KpiTile } from "../../../components/ui/KpiTile";
import { navigateWithRouter } from "@/navigation/routerNavigate";

/**
 * FaithHub — FH-P-041 Replays & Clips
 * -----------------------------------
 * Premium replay library and clip engine for FaithHub Provider.
 *
 * Design goals
 * - Preserve the creator-style source layout (replay library + clip engine) while upgrading it into a
 *   world-class FaithHub post-live growth surface.
 * - Use EVzone Green as primary, Orange as secondary, and preserve premium grey neutrals.
 * - Add a real preview lab so editors can see how clips will look across desktop and mobile surfaces.
 * - Cover every requested module: replay library, clip extraction timeline, aspect variants, clip packaging,
 *   performance intelligence, archive/lifecycle controls, replay-to-promotion bridge, and editorial collaboration.
 *
 * Notes
 * - Self-contained mock TSX page. Wire to real APIs, routing, and media processors during integration.
 * - Tailwind-style utility classes assumed.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";

const ROUTES = {
  postLivePublishing: "/faithhub/provider/post-live-publishing",
  beaconBuilder: "/faithhub/provider/beacon-builder",
  reviewsModeration: "/faithhub/provider/reviews-moderation",
  audienceNotifications: "/faithhub/provider/audience-notifications",
};

type ReplayStatus = "Published" | "Draft replay" | "Unlisted" | "Archived";
type ParentKind = "Series" | "Standalone teaching" | "Event";
type PerformanceBand = "Top performing" | "Needs promo" | "Fresh";
type ClipVariant = "9:16" | "1:1" | "16:9";
type CaptionStyle = "Burn-in" | "Floating" | "Minimal";
type CTAPlacement = "Lower third" | "Bottom sheet" | "End card";
type ConversionIntent = "Watch replay" | "Follow" | "Donate" | "Register" | "Crowdfund";
type PreviewMode = "desktop" | "mobile";
type BatchStatus = "Draft" | "Ready" | "Approved";

type ReplayRecord = {
  id: string;
  title: string;
  parentKind: ParentKind;
  parentTitle: string;
  language: string;
  speaker: string;
  dateISO: string;
  durationSec: number;
  status: ReplayStatus;
  performance: PerformanceBand;
  summary: string;
  coverUrl: string;
  tags: string[];
  views: number;
  watchHours: number;
  follows: number;
  donations: number;
  eventRegs: number;
  crowdfundMomentum: number;
  beaconConversions: number;
  clipOpportunities: number;
  performanceSeries: number[];
  rightsState: string;
  highlightHook: string;
};

type SmartMoment = {
  id: string;
  label: string;
  startSec: number;
  endSec: number;
  reason: string;
  confidence: number;
  tags: string[];
  intentHint: ConversionIntent;
};

type ClipRecipe = {
  id: string;
  name: string;
  description: string;
  variant: ClipVariant;
  captionStyle: CaptionStyle;
  ctaPlacement: CTAPlacement;
  introCard: boolean;
  outroCard: boolean;
};

type BatchClip = {
  id: string;
  label: string;
  startSec: number;
  endSec: number;
  variant: ClipVariant;
  intent: ConversionIntent;
  status: BatchStatus;
};

type ApprovalItem = {
  label: string;
  owner: string;
  status: "Approved" | "Needs review" | "Pending";
};

type CommentItem = {
  id: string;
  author: string;
  time: string;
  body: string;
};

type TaskItem = {
  id: string;
  label: string;
  owner: string;
  due: string;
  status: "Open" | "In review" | "Done";
};

const REPLAYS_SEED: ReplayRecord[] = [
  {
    id: "RP-041",
    title: "Sunday Encounter Replay · Grace in Motion",
    parentKind: "Series",
    parentTitle: "Grace in Motion",
    language: "English",
    speaker: "Pastor Nathaniel",
    dateISO: "2026-02-14T18:30:00Z",
    durationSec: 4230,
    status: "Published",
    performance: "Top performing",
    summary: "A Sunday encounter replay with strong watch-time, healthy donation response, and clip potential across scripture and altar moments.",
    coverUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=60",
    tags: ["Grace", "Sunday service", "Replay ready"],
    views: 18420,
    watchHours: 6940,
    follows: 642,
    donations: 148,
    eventRegs: 37,
    crowdfundMomentum: 23,
    beaconConversions: 54,
    clipOpportunities: 6,
    performanceSeries: [18, 24, 27, 31, 38, 40, 43, 47, 49, 53, 58, 60],
    rightsState: "Cleared for public replay and clip export",
    highlightHook: "Grace changes what follows you home.",
  },
  {
    id: "RP-042",
    title: "Prayer That Stays · Standalone Teaching",
    parentKind: "Standalone teaching",
    parentTitle: "Prayer That Stays",
    language: "Luganda",
    speaker: "Minister Miriam",
    dateISO: "2026-02-12T16:00:00Z",
    durationSec: 3180,
    status: "Draft replay",
    performance: "Fresh",
    summary: "A one-off teaching that still needs final thumbnail approval and packaged short-form outputs for regional discovery.",
    coverUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=60",
    tags: ["Prayer", "Standalone", "Needs polish"],
    views: 6240,
    watchHours: 1980,
    follows: 201,
    donations: 39,
    eventRegs: 9,
    crowdfundMomentum: 0,
    beaconConversions: 17,
    clipOpportunities: 4,
    performanceSeries: [6, 7, 9, 10, 13, 15, 17, 18, 21, 25, 27, 29],
    rightsState: "Thumbnail approval pending",
    highlightHook: "Prayer is not a moment — it is a staying place.",
  },
  {
    id: "RP-043",
    title: "Youth Fire Night Replay",
    parentKind: "Event",
    parentTitle: "Youth Fire Night",
    language: "English + Swahili",
    speaker: "Guest Team",
    dateISO: "2026-02-10T20:15:00Z",
    durationSec: 5070,
    status: "Published",
    performance: "Needs promo",
    summary: "High energy event replay with excellent short-form potential but lower than expected discovery outside the event audience.",
    coverUrl: "https://images.unsplash.com/photo-1511795409834-432f7b1728aa?auto=format&fit=crop&w=1200&q=60",
    tags: ["Youth", "Event", "Music rights cleared"],
    views: 8120,
    watchHours: 2410,
    follows: 316,
    donations: 51,
    eventRegs: 84,
    crowdfundMomentum: 12,
    beaconConversions: 11,
    clipOpportunities: 8,
    performanceSeries: [10, 12, 13, 14, 15, 16, 17, 17, 18, 18, 19, 20],
    rightsState: "Cleared with event footage permissions",
    highlightHook: "There is fire in this generation again.",
  },
  {
    id: "RP-044",
    title: "Hope Drive Charity Update Replay",
    parentKind: "Event",
    parentTitle: "Hope Drive",
    language: "English",
    speaker: "Outreach Director Anna",
    dateISO: "2026-02-08T14:00:00Z",
    durationSec: 2760,
    status: "Unlisted",
    performance: "Needs promo",
    summary: "A charity-focused replay with strong donor stories and meaningful crowdfund signals, currently hidden while updates are reviewed.",
    coverUrl: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1200&q=60",
    tags: ["Charity", "Crowdfund", "Impact update"],
    views: 3900,
    watchHours: 1215,
    follows: 98,
    donations: 73,
    eventRegs: 11,
    crowdfundMomentum: 47,
    beaconConversions: 9,
    clipOpportunities: 5,
    performanceSeries: [3, 4, 4, 5, 6, 7, 9, 11, 14, 17, 20, 24],
    rightsState: "Awaiting beneficiary image review",
    highlightHook: "Every update proves the campaign is moving lives, not just numbers.",
  },
];

const SMART_MOMENTS: Record<string, SmartMoment[]> = {
  "RP-041": [
    {
      id: "sm-1",
      label: "Opening grace declaration",
      startSec: 42,
      endSec: 78,
      reason: "Strong hook with clear replay-to-follow potential.",
      confidence: 96,
      tags: ["Hook", "Follow prompt", "Verse callout"],
      intentHint: "Follow",
    },
    {
      id: "sm-2",
      label: "Donation testimony pivot",
      startSec: 1510,
      endSec: 1570,
      reason: "High donation spike and sustained retention through the testimony.",
      confidence: 91,
      tags: ["Giving", "Story", "Retention"],
      intentHint: "Donate",
    },
    {
      id: "sm-3",
      label: "Closing altar invitation",
      startSec: 3550,
      endSec: 3635,
      reason: "High comment volume and prayer request surge.",
      confidence: 88,
      tags: ["Prayer", "Response", "Beacon teaser"],
      intentHint: "Watch replay",
    },
  ],
  "RP-042": [
    {
      id: "sm-4",
      label: "Prayer definition moment",
      startSec: 180,
      endSec: 236,
      reason: "Clean standalone teaching hook for short-form discovery.",
      confidence: 93,
      tags: ["Teaching", "Definition", "Short-form"],
      intentHint: "Follow",
    },
    {
      id: "sm-5",
      label: "Scripture quote card section",
      startSec: 1120,
      endSec: 1188,
      reason: "Ideal for square quote-card treatment and multilingual captions.",
      confidence: 90,
      tags: ["Quote card", "Square", "Localized"],
      intentHint: "Watch replay",
    },
  ],
  "RP-043": [
    {
      id: "sm-6",
      label: "Youth chant response",
      startSec: 340,
      endSec: 395,
      reason: "High-energy opening with excellent vertical clip energy.",
      confidence: 95,
      tags: ["Vertical", "Youth", "Reaction spike"],
      intentHint: "Register",
    },
    {
      id: "sm-7",
      label: "Main challenge call",
      startSec: 2240,
      endSec: 2315,
      reason: "Strong conversion moment for future event registration.",
      confidence: 89,
      tags: ["Event", "Challenge", "Register"],
      intentHint: "Register",
    },
    {
      id: "sm-8",
      label: "Closing crowd moment",
      startSec: 4200,
      endSec: 4270,
      reason: "Good teaser for Beacon awareness campaigns.",
      confidence: 87,
      tags: ["Crowd", "Beacon", "Awareness"],
      intentHint: "Follow",
    },
  ],
  "RP-044": [
    {
      id: "sm-9",
      label: "Impact story opener",
      startSec: 88,
      endSec: 144,
      reason: "Fast charity story setup with strong donor empathy.",
      confidence: 94,
      tags: ["Charity", "Story", "Crowdfund"],
      intentHint: "Crowdfund",
    },
    {
      id: "sm-10",
      label: "Progress milestone announcement",
      startSec: 1340,
      endSec: 1405,
      reason: "Ideal for end-card CTA into the live campaign page.",
      confidence: 90,
      tags: ["Milestone", "CTA", "Giving"],
      intentHint: "Crowdfund",
    },
  ],
};

const CLIP_RECIPES: ClipRecipe[] = [
  {
    id: "rcp-1",
    name: "Hook-first vertical",
    description: "Optimized for discovery rails with strong first-three-second copy.",
    variant: "9:16",
    captionStyle: "Burn-in",
    ctaPlacement: "Bottom sheet",
    introCard: true,
    outroCard: false,
  },
  {
    id: "rcp-2",
    name: "Square quote card",
    description: "Best for scripture and quote-led moments with premium typography.",
    variant: "1:1",
    captionStyle: "Floating",
    ctaPlacement: "End card",
    introCard: false,
    outroCard: true,
  },
  {
    id: "rcp-3",
    name: "Replay bridge landscape",
    description: "Designed for in-app shelves and replay-to-Beacon follow-up.",
    variant: "16:9",
    captionStyle: "Minimal",
    ctaPlacement: "Lower third",
    introCard: false,
    outroCard: true,
  },
];

const APPROVALS: ApprovalItem[] = [
  { label: "Thumbnail quality", owner: "Media lead", status: "Approved" },
  { label: "Caption accuracy", owner: "Caption editor", status: "Needs review" },
  { label: "Rights + music check", owner: "Compliance", status: "Pending" },
];

const COMMENTS_SEED: CommentItem[] = [
  {
    id: "cm-1",
    author: "Ruth · Editor",
    time: "12 min ago",
    body: "The closing prayer moment is strong, but the subtitle block needs one more line-break pass for vertical surfaces.",
  },
  {
    id: "cm-2",
    author: "Ben · Outreach",
    time: "33 min ago",
    body: "If we package this as a follow prompt, Beacon should land on the replay, not the institution homepage.",
  },
];

const TASKS_SEED: TaskItem[] = [
  { id: "ts-1", label: "Approve subtitle pass for 9:16", owner: "Caption editor", due: "Today", status: "In review" },
  { id: "ts-2", label: "Confirm rights note for beneficiary footage", owner: "Compliance", due: "Tomorrow", status: "Open" },
  { id: "ts-3", label: "Duplicate winning hook for Beacon", owner: "Growth lead", due: "Today", status: "Open" },
];

const cx = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  navigateWithRouter(url);
}

function fmtInt(n: number) {
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function fmtShortDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
}

function secondsToClock(total: number) {
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return hours > 0
    ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function durationLabel(total: number) {
  const hours = Math.floor(total / 3600);
  const minutes = Math.round((total % 3600) / 60);
  if (hours && minutes) return `${hours}h ${minutes}m`;
  if (hours) return `${hours}h`;
  return `${minutes}m`;
}

function variantAspect(variant: ClipVariant) {
  if (variant === "9:16") return "aspect-[9/16]";
  if (variant === "1:1") return "aspect-square";
  return "aspect-[16/9]";
}

function toneForStatus(status: ReplayStatus | PerformanceBand | ApprovalItem["status"] | TaskItem["status"] | BatchStatus) {
  if (status === "Published" || status === "Top performing" || status === "Approved" || status === "Done") return "good" as const;
  if (status === "Needs promo" || status === "Draft replay" || status === "Pending" || status === "Open" || status === "In review") return "warn" as const;
  if (status === "Archived") return "bad" as const;
  return "neutral" as const;
}

function Pill({
  children,
  tone = "neutral",
  title,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "good" | "warn" | "bad" | "brand" | "accent";
  title?: string;
}) {
  const cls =
    tone === "good"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
      : tone === "warn"
        ? "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20"
        : tone === "bad"
          ? "bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20"
          : tone === "brand"
            ? "text-white shadow-sm ring-0"
            : tone === "accent"
              ? "text-white shadow-sm ring-0"
              : "bg-slate-100 text-slate-800 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700";

  return (
    <span
      title={title}
      className={cx("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-bold ring-1 whitespace-nowrap transition", cls)}
      style={tone === "brand" ? { background: EV_GREEN } : tone === "accent" ? { background: EV_ORANGE } : undefined}
    >
      {children}
    </span>
  );
}

function Btn({
  children,
  onClick,
  tone = "neutral",
  disabled,
  left,
  title,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: "neutral" | "primary" | "accent" | "ghost";
  disabled?: boolean;
  left?: React.ReactNode;
  title?: string;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  const cls =
    tone === "primary"
      ? "text-white hover:brightness-95 shadow-sm"
      : tone === "accent"
        ? "text-white hover:brightness-95 shadow-sm"
        : tone === "ghost"
          ? "bg-transparent text-slate-900 dark:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800"
          : "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 ring-1 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm";

  return (
    <button
      type="button"
      title={title}
      className={cx(base, cls, className)}
      style={tone === "primary" ? { background: EV_GREEN } : tone === "accent" ? { background: EV_ORANGE } : undefined}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {left}
      {children}
    </button>
  );
}

function Modal({
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
    const originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalBodyOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex w-full max-w-6xl flex-col bg-white dark:bg-slate-900 shadow-2xl h-[94vh] sm:h-auto sm:max-h-[92vh] rounded-t-3xl sm:rounded-3xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800 transition">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 px-5 py-4">
          <div className="min-w-0">
            <div className="text-base font-bold text-slate-900 dark:text-slate-50">{title}</div>
            {subtitle ? <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</div> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-5">{children}</div>
      </div>
    </div>
  );
}

function MiniLine({ values }: { values: number[] }) {
  const width = 220;
  const height = 72;
  const pad = 6;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, idx) => {
      const x = pad + (idx * (width - pad * 2)) / Math.max(1, values.length - 1);
      const y = height - pad - ((v - min) / range) * (height - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20">
      <polyline points={`${points} ${width - pad},${height - pad} ${pad},${height - pad}`} fill={EV_ORANGE} opacity="0.08" />
      <polyline points={points} fill="none" stroke={EV_ORANGE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
      onChange={(e) => onChange(e.target.value)}
      className="h-11 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-slate-100 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function PreviewCanvas({
  replay,
  variant,
  hookCopy,
  clipTitle,
  quoteCard,
  conversionIntent,
  captionStyle,
  ctaPlacement,
  device = "desktop",
}: {
  replay: ReplayRecord;
  variant: ClipVariant;
  hookCopy: string;
  clipTitle: string;
  quoteCard: string;
  conversionIntent: ConversionIntent;
  captionStyle: CaptionStyle;
  ctaPlacement: CTAPlacement;
  device?: PreviewMode;
}) {
  const frame = (
    <div className={cx("relative overflow-hidden rounded-3xl bg-slate-950", variantAspect(variant))}>
      <img src={replay.coverUrl} alt={replay.title} className="absolute inset-0 h-full w-full object-cover opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/35 to-transparent" />

      <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-red-500 px-2 py-1 text-[10px] font-extrabold text-white">CLIP</span>
        <span className="rounded-full bg-black/55 px-2 py-1 text-[10px] font-bold text-white">{variant}</span>
        <span className="rounded-full bg-black/55 px-2 py-1 text-[10px] font-bold text-white">{captionStyle}</span>
      </div>

      <div className="absolute inset-x-3 top-16">
        <div className="max-w-[70%] rounded-2xl bg-black/45 px-3 py-2 text-[11px] font-bold text-white backdrop-blur-sm shadow-lg">
          {hookCopy}
        </div>
      </div>

      {quoteCard ? (
        <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 rounded-3xl bg-white/92 px-4 py-4 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-9 w-9 shrink-0 rounded-2xl grid place-items-center text-white" style={{ background: EV_GREEN }}>
              <Quote className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[12px] font-extrabold text-slate-900">Quote card</div>
              <div className="mt-1 text-[12px] leading-relaxed text-slate-700">{quoteCard}</div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="absolute left-3 right-3 bottom-4">
        <div className="text-lg font-extrabold text-white line-clamp-2 drop-shadow-sm">{clipTitle || replay.title}</div>
        <div className="mt-1 text-[12px] text-white/85 line-clamp-2">
          {replay.parentTitle} · {replay.speaker}
        </div>

        <div className={cx("mt-3", ctaPlacement === "End card" ? "" : "")}> 
          <div
            className={cx(
              "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-[11px] font-extrabold text-white shadow-lg",
              ctaPlacement === "Lower third" ? "" : ctaPlacement === "Bottom sheet" ? "w-full justify-center" : ""
            )}
            style={{ background: ctaPlacement === "End card" ? EV_ORANGE : EV_GREEN }}
          >
            {conversionIntent === "Donate" ? "Give now" : conversionIntent === "Register" ? "Register" : conversionIntent === "Crowdfund" ? "Support campaign" : conversionIntent === "Follow" ? "Follow" : "Watch replay"}
          </div>
        </div>
      </div>
    </div>
  );

  if (device === "mobile") {
    return (
      <div className="mx-auto w-full max-w-[290px] md:max-w-[340px]">
        <div className="rounded-[34px] bg-slate-950 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.45)]">
          <div className="rounded-[28px] bg-white dark:bg-slate-900 p-3 transition-colors">
            <div className="mx-auto mb-3 h-5 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
            {frame}
            <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-2">
                <div className="text-slate-400 uppercase tracking-wide">Intent</div>
                <div className="mt-1 font-bold text-slate-900 dark:text-slate-100">{conversionIntent}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-2">
                <div className="text-slate-400 uppercase tracking-wide">CTA</div>
                <div className="mt-1 font-bold text-slate-900 dark:text-slate-100">{ctaPlacement}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-4">
      <div className="flex items-center justify-between gap-2 pb-3">
        <div>
          <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100">Desktop shelf preview</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">How the clip packaging lands in discovery and replay follow-up.</div>
        </div>
        <Pill tone="brand">{variant}</Pill>
      </div>
      {frame}
    </div>
  );
}

function ReplayRow({
  replay,
  selected,
  onClick,
  onArchive,
  onPreview,
}: {
  replay: ReplayRecord;
  selected: boolean;
  onClick: () => void;
  onArchive: () => void;
  onPreview: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "w-full rounded-3xl border p-3 text-left transition-all shadow-sm",
        selected
          ? "border-transparent ring-2 ring-[rgba(3,205,140,0.45)] bg-white dark:bg-slate-900"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
      )}
    >
      <div className="flex gap-3">
        <img src={replay.coverUrl} alt={replay.title} className="h-20 w-28 rounded-2xl object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2">{replay.title}</div>
              <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                {replay.parentKind} · {replay.parentTitle} · {replay.speaker} · {replay.language}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Pill tone={toneForStatus(replay.performance)}>{replay.performance}</Pill>
              <Pill tone={toneForStatus(replay.status)}>{replay.status}</Pill>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span>{fmtShortDate(replay.dateISO)}</span>
            <span>{durationLabel(replay.durationSec)}</span>
            <span>{fmtInt(replay.views)} views</span>
            <span>{fmtInt(replay.watchHours)} watch hrs</span>
            <span>{fmtInt(replay.clipOpportunities)} clip opps</span>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {replay.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[10px] font-semibold text-slate-700 dark:text-slate-200">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-[11px] font-bold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Eye className="h-3.5 w-3.5" /> Preview
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onArchive();
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-[11px] font-bold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Archive className="h-3.5 w-3.5" /> Archive
            </button>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function FaithHubReplaysAndClipsPage() {
  const [replays, setReplays] = useState<ReplayRecord[]>(REPLAYS_SEED);
  const [selectedReplayId, setSelectedReplayId] = useState(REPLAYS_SEED[0]?.id || "");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All statuses");
  const [parentFilter, setParentFilter] = useState<string>("All parents");
  const [languageFilter, setLanguageFilter] = useState<string>("All languages");
  const [speakerFilter, setSpeakerFilter] = useState<string>("All speakers");
  const [performanceFilter, setPerformanceFilter] = useState<string>("All performance");
  const [selectedVariant, setSelectedVariant] = useState<ClipVariant>("9:16");
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>("Burn-in");
  const [ctaPlacement, setCtaPlacement] = useState<CTAPlacement>("Bottom sheet");
  const [conversionIntent, setConversionIntent] = useState<ConversionIntent>("Watch replay");
  const [selectedRecipeId, setSelectedRecipeId] = useState(CLIP_RECIPES[0].id);
  const [clipStart, setClipStart] = useState(42);
  const [clipEnd, setClipEnd] = useState(78);
  const [introCard, setIntroCard] = useState(true);
  const [outroCard, setOutroCard] = useState(false);
  const [clipTitle, setClipTitle] = useState("Grace changes what follows you home");
  const [hookCopy, setHookCopy] = useState("Hook the first three seconds with the strongest grace promise.");
  const [quoteCard, setQuoteCard] = useState("");
  const [deepLink, setDeepLink] = useState("https://faithhub.app/replay/RP-041");
  const [batchClips, setBatchClips] = useState<BatchClip[]>([
    { id: "bc-1", label: "Grace opener · 9:16", startSec: 42, endSec: 78, variant: "9:16", intent: "Follow", status: "Ready" },
    { id: "bc-2", label: "Donation testimony · 1:1", startSec: 1510, endSec: 1570, variant: "1:1", intent: "Donate", status: "Draft" },
  ]);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [comments, setComments] = useState<CommentItem[]>(COMMENTS_SEED);
  const [tasks, setTasks] = useState<TaskItem[]>(TASKS_SEED);
  const [workingAction, setWorkingAction] = useState<string | null>(null);

  const statusOptions = ["All statuses", "Published", "Draft replay", "Unlisted", "Archived"];
  const parentOptions = ["All parents", "Series", "Standalone teaching", "Event"];
  const performanceOptions = ["All performance", "Top performing", "Needs promo", "Fresh"];
  const languageOptions = useMemo(() => ["All languages", ...Array.from(new Set(replays.map((replay) => replay.language)))], [replays]);
  const speakerOptions = useMemo(() => ["All speakers", ...Array.from(new Set(replays.map((replay) => replay.speaker)))], [replays]);

  const filteredReplays = useMemo(() => {
    return replays.filter((replay) => {
      const matchesSearch =
        !search.trim() ||
        replay.title.toLowerCase().includes(search.toLowerCase()) ||
        replay.parentTitle.toLowerCase().includes(search.toLowerCase()) ||
        replay.speaker.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All statuses" || replay.status === statusFilter;
      const matchesParent = parentFilter === "All parents" || replay.parentKind === parentFilter;
      const matchesLanguage = languageFilter === "All languages" || replay.language === languageFilter;
      const matchesSpeaker = speakerFilter === "All speakers" || replay.speaker === speakerFilter;
      const matchesPerformance = performanceFilter === "All performance" || replay.performance === performanceFilter;
      return matchesSearch && matchesStatus && matchesParent && matchesLanguage && matchesSpeaker && matchesPerformance;
    });
  }, [replays, search, statusFilter, parentFilter, languageFilter, speakerFilter, performanceFilter]);

  useEffect(() => {
    if (!filteredReplays.length) return;
    if (!filteredReplays.find((replay) => replay.id === selectedReplayId)) {
      setSelectedReplayId(filteredReplays[0].id);
    }
  }, [filteredReplays, selectedReplayId]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const selectedReplay = useMemo(() => {
    return replays.find((replay) => replay.id === selectedReplayId) || replays[0];
  }, [replays, selectedReplayId]);

  const smartMoments = useMemo(() => SMART_MOMENTS[selectedReplay?.id || ""] || [], [selectedReplay?.id]);
  const selectedRecipe = useMemo(() => CLIP_RECIPES.find((recipe) => recipe.id === selectedRecipeId) || CLIP_RECIPES[0], [selectedRecipeId]);

  useEffect(() => {
    if (!selectedReplay) return;
    const firstMoment = smartMoments[0];
    if (firstMoment) {
      setClipStart(firstMoment.startSec);
      setClipEnd(firstMoment.endSec);
      setHookCopy(firstMoment.reason);
      setClipTitle(firstMoment.label);
      setConversionIntent(firstMoment.intentHint);
      setDeepLink(`https://faithhub.app/replay/${selectedReplay.id}`);
      setQuoteCard(selectedReplay.parentKind === "Series" ? selectedReplay.highlightHook : "");
    }
  }, [selectedReplay, smartMoments]);

  useEffect(() => {
    if (!selectedRecipe) return;
    setSelectedVariant(selectedRecipe.variant);
    setCaptionStyle(selectedRecipe.captionStyle);
    setCtaPlacement(selectedRecipe.ctaPlacement);
    setIntroCard(selectedRecipe.introCard);
    setOutroCard(selectedRecipe.outroCard);
  }, [selectedRecipe]);

  const clipDuration = Math.max(5, clipEnd - clipStart);
  const clipRangePct = selectedReplay ? Math.max(0, Math.min(100, (clipStart / selectedReplay.durationSec) * 100)) : 0;
  const clipWidthPct = selectedReplay ? Math.max(2, Math.min(100, (clipDuration / selectedReplay.durationSec) * 100)) : 12;

  const createClip = async () => {
    setWorkingAction("createClip");
    await new Promise((resolve) => setTimeout(resolve, 700));
    setBatchClips((current) => [
      {
        id: `bc-${Date.now()}`,
        label: `${clipTitle || "New clip"} · ${selectedVariant}`,
        startSec: clipStart,
        endSec: clipEnd,
        variant: selectedVariant,
        intent: conversionIntent,
        status: "Draft",
      },
      ...current,
    ]);
    setWorkingAction(null);
    setToast("Clip added to the batch queue.");
  };

  const archiveReplay = async (replayId?: string) => {
    const targetId = replayId || selectedReplay?.id;
    if (!targetId) return;
    setWorkingAction("archiveReplay");
    await new Promise((resolve) => setTimeout(resolve, 600));
    setReplays((current) => current.map((replay) => (replay.id === targetId ? { ...replay, status: "Archived" } : replay)));
    setWorkingAction(null);
    setToast("Replay moved to archive.");
  };

  const applySmartMoment = (moment: SmartMoment) => {
    setClipStart(moment.startSec);
    setClipEnd(moment.endSec);
    setClipTitle(moment.label);
    setHookCopy(moment.reason);
    setConversionIntent(moment.intentHint);
    setToast(`Loaded smart moment: ${moment.label}`);
  };

  const downloadBatchPlan = () => {
    const lines = [
      "FAITHHUB REPLAYS & CLIPS EXPORT",
      "------------------------------",
      `Replay: ${selectedReplay?.title || "Unknown"}`,
      `Generated: ${new Date().toLocaleString()}`,
      "",
      "CURRENT CLIP",
      `Title: ${clipTitle}`,
      `Range: ${secondsToClock(clipStart)} ? ${secondsToClock(clipEnd)}`,
      `Variant: ${selectedVariant}`,
      `Caption style: ${captionStyle}`,
      `CTA placement: ${ctaPlacement}`,
      `Intent: ${conversionIntent}`,
      `Deep link: ${deepLink}`,
      "",
      "BATCH QUEUE",
      ...batchClips.map((clip, idx) => `${idx + 1}. ${clip.label} · ${secondsToClock(clip.startSec)} ? ${secondsToClock(clip.endSec)} · ${clip.variant} · ${clip.status}`),
    ].join("\n");

    const blob = new Blob([lines], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `faithhub_replays_clips_${selectedReplay?.id || "export"}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
    setToast("Replay and clip plan exported.");
  };

  const addComment = () => {
    if (!commentDraft.trim()) return;
    setComments((current) => [
      {
        id: `cm-${Date.now()}`,
        author: "You · Editor",
        time: "Just now",
        body: commentDraft.trim(),
      },
      ...current,
    ]);
    setCommentDraft("");
    setToast("Comment added to editorial lane.");
  };

  const markTaskDone = (taskId: string) => {
    setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, status: "Done" } : task)));
    setToast("Task marked done.");
  };

  const copyReplayLink = async () => {
    try {
      await navigator.clipboard.writeText(deepLink);
      setToast("Replay link copied.");
    } catch {
      setToast("Copy failed in this environment.");
    }
  };

  if (!selectedReplay) return null;

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f2f2f2] dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors">
      <div className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        <div className="w-full px-4 md:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                <button onClick={() => safeNav(ROUTES.postLivePublishing)} className="hover:text-slate-700 dark:hover:text-slate-200">Post-live & Trust</button>
                <span>/</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">FH-P-041 Replays & Clips</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">Replays & Clips</div>
                <Pill tone="brand">Premium replay growth surface</Pill>
                <Pill tone="accent">EVzone Green primary · Orange secondary</Pill>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                <span>Replay catalog ready</span>
                <span>•</span>
                <span>{fmtInt(filteredReplays.length)} visible replays</span>
                <span>•</span>
                <span>{smartMoments.length} smart highlight suggestions</span>
                <span>•</span>
                <span>{batchClips.length} batch clips in queue</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Btn tone="ghost" onClick={() => setPreviewOpen(true)} left={<Eye className="h-4 w-4" />}>
                Preview
              </Btn>
              <Btn tone="neutral" onClick={downloadBatchPlan} left={<Copy className="h-4 w-4" />}>
                Export plan
              </Btn>
              <Btn tone="accent" onClick={() => setToast("Beacon handoff prepared.")} left={<Zap className="h-4 w-4" />}>
                Boost with Beacon
              </Btn>
              <Btn tone="primary" onClick={createClip} left={<Scissors className="h-4 w-4" />} disabled={workingAction === "createClip"}>
                {workingAction === "createClip" ? "Creating..." : "Create clip"}
              </Btn>
              <Btn tone="neutral" onClick={() => archiveReplay()} left={<Archive className="h-4 w-4" />} disabled={workingAction === "archiveReplay"}>
                {workingAction === "archiveReplay" ? "Archiving..." : "Archive replay"}
              </Btn>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="w-full px-4 md:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-[11px] sm:text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="brand"><CheckCircle2 className="h-3.5 w-3.5" /> Replay library live</Pill>
              <Pill tone="good"><Sparkles className="h-3.5 w-3.5" /> Smart recipe assist on</Pill>
              <Pill tone="warn"><AlertTriangle className="h-3.5 w-3.5" /> 1 caption approval pending</Pill>
            </div>
            <div className="text-slate-500 dark:text-slate-400">Designed for replay discovery, retention, giving, events, and Beacon conversion.</div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-4">
            <section className="rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tight">Replay library</div>
                    <div className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                      Filter every finished replay by Series, standalone teachings, events, language, speaker, performance, and publishing status.
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pill tone="good">{fmtInt(filteredReplays.length)} surfaced</Pill>
                    <Pill tone="neutral">{fmtInt(replays.filter((replay) => replay.status === "Published").length)} published</Pill>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.3fr)_repeat(5,minmax(0,0.75fr))]">
                  <label className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-800 flex items-center gap-2">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search replays, parents, or speakers"
                      className="w-full bg-transparent border-none outline-none text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                    />
                  </label>
                  <SelectField value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
                  <SelectField value={parentFilter} onChange={setParentFilter} options={parentOptions} />
                  <SelectField value={languageFilter} onChange={setLanguageFilter} options={languageOptions} />
                  <SelectField value={speakerFilter} onChange={setSpeakerFilter} options={speakerOptions} />
                  <SelectField value={performanceFilter} onChange={setPerformanceFilter} options={performanceOptions} />
                </div>

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {filteredReplays.map((replay) => (
                    <ReplayRow
                      key={replay.id}
                      replay={replay}
                      selected={selectedReplay.id === replay.id}
                      onClick={() => setSelectedReplayId(replay.id)}
                      onArchive={() => archiveReplay(replay.id)}
                      onPreview={() => {
                        setSelectedReplayId(replay.id);
                        setPreviewOpen(true);
                      }}
                    />
                  ))}
                  {!filteredReplays.length ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                      No replay matches the current filters.
                    </div>
                  ) : null}
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
              <section className="xl:col-span-7 rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tight">Clip extraction timeline</div>
                      <div className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                        Build single or multi-clip batches, add intro or outro cards, and reuse winning clip recipes without leaving the page.
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill tone="brand">{selectedReplay.parentKind}</Pill>
                      <Pill tone={toneForStatus(selectedReplay.performance)}>{selectedReplay.performance}</Pill>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/30 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Selected replay</div>
                        <div className="mt-1 text-lg font-extrabold text-slate-900 dark:text-slate-100">{selectedReplay.title}</div>
                        <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">{selectedReplay.summary}</div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Btn tone="ghost" onClick={copyReplayLink} left={<Copy className="h-4 w-4" />} className="px-3 py-2 text-[12px]">
                          Copy link
                        </Btn>
                        <Btn tone="neutral" onClick={() => setPreviewOpen(true)} left={<MonitorPlay className="h-4 w-4" />} className="px-3 py-2 text-[12px]">
                          Open preview
                        </Btn>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <span>Replay timeline</span>
                        <span>{secondsToClock(selectedReplay.durationSec)}</span>
                      </div>
                      <div className="mt-3 relative h-5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div className="absolute inset-y-0 rounded-full" style={{ left: `${clipRangePct}%`, width: `${clipWidthPct}%`, background: EV_GREEN }} />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{secondsToClock(clipStart)}</span>
                        <span>{secondsToClock(clipEnd)}</span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <label className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                          <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">Clip in</div>
                          <input
                            type="range"
                            min={0}
                            max={selectedReplay.durationSec - 5}
                            value={clipStart}
                            onChange={(e) => {
                              const next = Number(e.target.value);
                              setClipStart(Math.min(next, clipEnd - 5));
                            }}
                            className="mt-3 w-full accent-[var(--ev-green)]"
                            style={{ ["--ev-green" as any]: EV_GREEN }}
                          />
                          <div className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{secondsToClock(clipStart)}</div>
                        </label>

                        <label className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                          <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">Clip out</div>
                          <input
                            type="range"
                            min={clipStart + 5}
                            max={selectedReplay.durationSec}
                            value={clipEnd}
                            onChange={(e) => setClipEnd(Number(e.target.value))}
                            className="mt-3 w-full accent-[var(--ev-orange)]"
                            style={{ ["--ev-orange" as any]: EV_ORANGE }}
                          />
                          <div className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{secondsToClock(clipEnd)}</div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-2">
                    <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Smart highlight suggestions</div>
                          <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">AI-selected moments worth packaging now</div>
                        </div>
                        <Pill tone="accent"><Wand2 className="h-3.5 w-3.5" /> {smartMoments.length} moments</Pill>
                      </div>

                      <div className="mt-3 space-y-3 max-h-[320px] overflow-y-auto pr-1">
                        {smartMoments.map((moment) => (
                          <div key={moment.id} className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{moment.label}</div>
                                <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{secondsToClock(moment.startSec)} ? {secondsToClock(moment.endSec)} · {moment.reason}</div>
                              </div>
                              <Pill tone="good">{moment.confidence}%</Pill>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {moment.tags.map((tag) => (
                                <span key={tag} className="rounded-full bg-white dark:bg-slate-900 px-2 py-1 text-[10px] font-semibold text-slate-700 dark:text-slate-200 ring-1 ring-slate-200 dark:ring-slate-700">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <Btn tone="ghost" onClick={() => applySmartMoment(moment)} left={<ArrowRight className="h-4 w-4" />} className="px-3 py-2 text-[12px]">
                                Use moment
                              </Btn>
                              <Btn tone="accent" onClick={() => {
                                applySmartMoment(moment);
                                createClip();
                              }} left={<Plus className="h-4 w-4" />} className="px-3 py-2 text-[12px]">
                                Add to batch
                              </Btn>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Reusable clip recipes</div>
                          <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">Apply premium packaging rules in one click</div>
                        </div>
                        <Pill tone="brand"><RefreshCw className="h-3.5 w-3.5" /> Reusable</Pill>
                      </div>

                      <div className="mt-3 space-y-3">
                        {CLIP_RECIPES.map((recipe) => {
                          const active = recipe.id === selectedRecipeId;
                          return (
                            <button
                              key={recipe.id}
                              type="button"
                              onClick={() => setSelectedRecipeId(recipe.id)}
                              className={cx(
                                "w-full rounded-2xl border p-3 text-left transition",
                                active
                                  ? "border-transparent ring-2 ring-[rgba(247,127,0,0.4)] bg-amber-50/50 dark:bg-amber-900/20"
                                  : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700"
                              )}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{recipe.name}</div>
                                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{recipe.description}</div>
                                </div>
                                <Pill tone={active ? "accent" : "neutral"}>{recipe.variant}</Pill>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                                <span className="rounded-full bg-white dark:bg-slate-900 px-2 py-1 ring-1 ring-slate-200 dark:ring-slate-700">{recipe.captionStyle}</span>
                                <span className="rounded-full bg-white dark:bg-slate-900 px-2 py-1 ring-1 ring-slate-200 dark:ring-slate-700">{recipe.ctaPlacement}</span>
                                <span className="rounded-full bg-white dark:bg-slate-900 px-2 py-1 ring-1 ring-slate-200 dark:ring-slate-700">{recipe.introCard ? "Intro on" : "Intro off"}</span>
                                <span className="rounded-full bg-white dark:bg-slate-900 px-2 py-1 ring-1 ring-slate-200 dark:ring-slate-700">{recipe.outroCard ? "Outro on" : "Outro off"}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/30 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Multi-clip batch queue</div>
                        <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">Build batches for reels, shelves, Beacon, and replay follow-up</div>
                      </div>
                      <Btn tone="neutral" onClick={downloadBatchPlan} left={<Copy className="h-4 w-4" />} className="px-3 py-2 text-[12px]">
                        Export queue
                      </Btn>
                    </div>

                    <div className="mt-3 space-y-2">
                      {batchClips.map((clip) => (
                        <div key={clip.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-2xl bg-white dark:bg-slate-900 px-3 py-3 ring-1 ring-slate-200 dark:ring-slate-800">
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{clip.label}</div>
                            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{secondsToClock(clip.startSec)} ? {secondsToClock(clip.endSec)} · {clip.intent}</div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Pill tone="neutral">{clip.variant}</Pill>
                            <Pill tone={toneForStatus(clip.status)}>{clip.status}</Pill>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="xl:col-span-5 rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tight">Format variants & clip packaging</div>
                    <div className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                      Create vertical, square, and landscape cutdowns with premium caption layouts, thumbnail treatments, quote cards, CTA logic, and destination deep links.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {(["9:16", "1:1", "16:9"] as ClipVariant[]).map((variant) => (
                      <button
                        key={variant}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={cx(
                          "rounded-2xl border p-3 text-left transition",
                          selectedVariant === variant
                            ? "border-transparent ring-2 ring-[rgba(3,205,140,0.45)] bg-emerald-50/40 dark:bg-emerald-900/20"
                            : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700"
                        )}
                      >
                        <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{variant}</div>
                        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                          {variant === "9:16" ? "Short-form discovery" : variant === "1:1" ? "Quote cards & feeds" : "Replay shelves & web"}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label>
                      <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Caption layout</div>
                      <SelectField value={captionStyle} onChange={(value) => setCaptionStyle(value as CaptionStyle)} options={["Burn-in", "Floating", "Minimal"]} />
                    </label>
                    <label>
                      <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">CTA placement</div>
                      <SelectField value={ctaPlacement} onChange={(value) => setCtaPlacement(value as CTAPlacement)} options={["Lower third", "Bottom sheet", "End card"]} />
                    </label>
                    <label>
                      <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Conversion intent</div>
                      <SelectField value={conversionIntent} onChange={(value) => setConversionIntent(value as ConversionIntent)} options={["Watch replay", "Follow", "Donate", "Register", "Crowdfund"]} />
                    </label>
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Aspect readiness</div>
                      <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <Sparkles className="h-4 w-4" /> Alt captions, artwork safe area, and CTA treatments remain synced.
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <label>
                      <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Clip title</div>
                      <input value={clipTitle} onChange={(e) => setClipTitle(e.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700" />
                    </label>
                    <label>
                      <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Hook copy</div>
                      <textarea value={hookCopy} onChange={(e) => setHookCopy(e.target.value)} rows={3} className="mt-1 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700" />
                    </label>
                    <label>
                      <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Quote card (optional)</div>
                      <textarea value={quoteCard} onChange={(e) => setQuoteCard(e.target.value)} rows={2} placeholder="Drop a scripture or quote for square-card packaging" className="mt-1 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700" />
                    </label>
                    <label>
                      <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Destination deep link</div>
                      <input value={deepLink} onChange={(e) => setDeepLink(e.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700" />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setIntroCard((value) => !value)}
                      className={cx(
                        "rounded-2xl border p-3 text-left transition",
                        introCard ? "border-transparent ring-2 ring-[rgba(3,205,140,0.4)] bg-emerald-50/40 dark:bg-emerald-900/20" : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40"
                      )}
                    >
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Intro card</div>
                      <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Use a branded opener before the selected clip range.</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOutroCard((value) => !value)}
                      className={cx(
                        "rounded-2xl border p-3 text-left transition",
                        outroCard ? "border-transparent ring-2 ring-[rgba(247,127,0,0.4)] bg-amber-50/40 dark:bg-amber-900/20" : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40"
                      )}
                    >
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Outro card</div>
                      <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">End with a replay or conversion CTA before export.</div>
                    </button>
                  </div>

                  <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/30 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Clip packaging summary</div>
                        <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{secondsToClock(clipStart)} ? {secondsToClock(clipEnd)} · {secondsToClock(clipDuration)} clip length</div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Pill tone="brand">{selectedVariant}</Pill>
                        <Pill tone="accent">{conversionIntent}</Pill>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{captionStyle}</span>
                      <span>•</span>
                      <span>{ctaPlacement}</span>
                      <span>•</span>
                      <span>{introCard ? "Intro on" : "Intro off"}</span>
                      <span>•</span>
                      <span>{outroCard ? "Outro on" : "Outro off"}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Btn tone="primary" onClick={createClip} left={<Scissors className="h-4 w-4" />} disabled={workingAction === "createClip"}>
                        {workingAction === "createClip" ? "Creating..." : "Create clip"}
                      </Btn>
                      <Btn tone="neutral" onClick={() => setPreviewOpen(true)} left={<Eye className="h-4 w-4" />}>
                        Preview clip
                      </Btn>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <section className="rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tight">Replay-to-promotion bridge</div>
                    <div className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                      Push a replay or clip into Beacon, notification journeys, event tie-ins, or giving follow-up while the context is still hot.
                    </div>
                  </div>
                  <Pill tone="brand"><Workflow className="h-3.5 w-3.5" /> Native promotion hooks</Pill>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    { title: "Boost with Beacon", hint: "Turn the current clip into a promotion-ready creative.", tone: "accent" as const, icon: Zap, action: () => setToast("Beacon campaign draft prepared from this clip.") },
                    { title: "Replay follow-up", hint: "Launch replay notifications to warm audiences immediately.", tone: "brand" as const, icon: Bell, action: () => safeNav(ROUTES.audienceNotifications) },
                    { title: "Event tie-in", hint: "Use this moment to point into an upcoming event or watch party.", tone: "neutral" as const, icon: Video, action: () => setToast("Event tie-in ready for review.") },
                    { title: "Giving follow-up", hint: "Connect the clip to a donation or crowdfund continuation moment.", tone: "neutral" as const, icon: HeartIconPlaceholder, action: () => setToast("Giving follow-up route armed.") },
                  ].map((card) => {
                    const Icon = card.icon as any;
                    return (
                      <button key={card.title} type="button" onClick={card.action} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 p-4 text-left hover:border-slate-300 dark:hover:border-slate-700 transition">
                        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-sm" style={{ background: card.tone === "brand" ? EV_GREEN : card.tone === "accent" ? EV_ORANGE : "#0f172a" }}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="mt-3 text-sm font-extrabold text-slate-900 dark:text-slate-100">{card.title}</div>
                        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{card.hint}</div>
                        <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold" style={{ color: card.tone === "accent" ? EV_ORANGE : card.tone === "brand" ? EV_GREEN : undefined }}>
                          Open path <ChevronRight className="h-3.5 w-3.5" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <section className="rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tight">Performance intelligence</div>
                  <div className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                    See which replays and clips are driving watch time, follows, donations, event registration, crowdfunding momentum, and Beacon conversions.
                  </div>
                </div>
                <Pill tone={toneForStatus(selectedReplay.performance)}><BarChart3 className="h-3.5 w-3.5" /> {selectedReplay.performance}</Pill>
              </div>

              <div className="mt-4 rounded-3xl bg-slate-50 dark:bg-slate-800/30 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Replay momentum</div>
                    <div className="mt-1 text-lg font-extrabold text-slate-900 dark:text-slate-100">{selectedReplay.title}</div>
                  </div>
                  <Btn tone="ghost" onClick={() => setToast("Performance refresh queued.")} left={<RefreshCw className="h-4 w-4" />} className="px-3 py-2 text-[12px]">
                    Refresh
                  </Btn>
                </div>
                <div className="mt-3"><MiniLine values={selectedReplay.performanceSeries} /></div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <MetricCard label="Watch time" value={`${fmtInt(selectedReplay.watchHours)}h`} hint={`${fmtInt(selectedReplay.views)} replay starts`} />
                  <MetricCard label="Follows" value={fmtInt(selectedReplay.follows)} hint="Post-replay follow actions" />
                  <MetricCard label="Donations" value={fmtInt(selectedReplay.donations)} hint="Replay-driven giving" />
                  <MetricCard label="Beacon conv." value={fmtInt(selectedReplay.beaconConversions)} hint="Promotion handoff wins" />
                  <MetricCard label="Event regs" value={fmtInt(selectedReplay.eventRegs)} hint="Registrations attributed" />
                  <MetricCard label="Crowdfund" value={`+${fmtInt(selectedReplay.crowdfundMomentum)}`} hint="Momentum score lift" />
                </div>
              </div>

              <div className="mt-4 rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Archive & lifecycle controls</div>
                <div className="mt-2 space-y-2 text-sm">
                  <LifecycleAction label="Archive replay" hint="Move the replay out of active discovery while preserving analytics." onClick={() => archiveReplay()} />
                  <LifecycleAction label="Unlist / republish" hint="Temporarily hide or bring a replay back with one click." onClick={() => setToast("Replay visibility toggle staged.")} />
                  <LifecycleAction label="Replace asset" hint="Swap the source file while preserving the replay identity and metrics." onClick={() => setToast("Asset replacement drawer opened.")} />
                  <LifecycleAction label="Duplicate package" hint="Clone metadata, clip recipes, and CTA logic for a new publishing run." onClick={() => setToast("Replay package duplicated.")} />
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tight">Editorial collaboration lane</div>
                  <div className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                    Approvals, comments, assigned edit tasks, and quality checks stay inside the clip engine so teams can move fast without losing governance.
                  </div>
                </div>
                <Pill tone="brand"><MessageSquare className="h-3.5 w-3.5" /> Collaboration on</Pill>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/30 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Approval lane</div>
                  <div className="mt-3 space-y-2">
                    {APPROVALS.map((approval) => (
                      <div key={approval.label} className="flex items-center justify-between gap-2 rounded-2xl bg-white dark:bg-slate-900 px-3 py-3 ring-1 ring-slate-200 dark:ring-slate-800">
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{approval.label}</div>
                          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Owner · {approval.owner}</div>
                        </div>
                        <Pill tone={toneForStatus(approval.status)}>{approval.status}</Pill>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/30 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Comments</div>
                  <div className="mt-3 space-y-3 max-h-[240px] overflow-y-auto pr-1">
                    {comments.map((comment) => (
                      <div key={comment.id} className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{comment.author}</div>
                          <div className="text-[11px] text-slate-400">{comment.time}</div>
                        </div>
                        <div className="mt-2 text-[12px] leading-relaxed text-slate-600 dark:text-slate-300">{comment.body}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <input value={commentDraft} onChange={(e) => setCommentDraft(e.target.value)} placeholder="Add a collaboration note" className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700" />
                    <Btn tone="accent" onClick={addComment} left={<Send className="h-4 w-4" />} className="px-3 py-2.5 text-[12px]">
                      Add
                    </Btn>
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/30 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Assigned edit tasks</div>
                  <div className="mt-3 space-y-2">
                    {tasks.map((task) => (
                      <div key={task.id} className="rounded-2xl bg-white dark:bg-slate-900 px-3 py-3 ring-1 ring-slate-200 dark:ring-slate-800">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{task.label}</div>
                            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{task.owner} · due {task.due}</div>
                          </div>
                          <Pill tone={toneForStatus(task.status)}>{task.status}</Pill>
                        </div>
                        {task.status !== "Done" ? (
                          <div className="mt-3 flex justify-end">
                            <Btn tone="ghost" onClick={() => markTaskDone(task.id)} left={<CheckCircle2 className="h-4 w-4" />} className="px-3 py-2 text-[12px]">
                              Mark done
                            </Btn>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tight">Preview lab</div>
                    <div className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                      Review desktop and mobile clip packaging, CTA placement, and conversion framing before publishing or boosting.
                    </div>
                  </div>
                  <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1">
                    <button type="button" onClick={() => setPreviewMode("desktop")} className={cx("px-3 py-1.5 rounded-xl text-[12px] font-bold transition", previewMode === "desktop" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-600 dark:text-slate-400")}>Desktop</button>
                    <button type="button" onClick={() => setPreviewMode("mobile")} className={cx("px-3 py-1.5 rounded-xl text-[12px] font-bold transition", previewMode === "mobile" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-600 dark:text-slate-400")}>Mobile</button>
                  </div>
                </div>

                <PreviewCanvas
                  replay={selectedReplay}
                  variant={selectedVariant}
                  hookCopy={hookCopy}
                  clipTitle={clipTitle}
                  quoteCard={quoteCard}
                  conversionIntent={conversionIntent}
                  captionStyle={captionStyle}
                  ctaPlacement={ctaPlacement}
                  device={previewMode}
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/30 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">Live preview notes</div>
                    <div className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{introCard ? "Intro card active" : "Clip opens cold"}</div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{outroCard ? "Ends with a branded end card and replay CTA." : "Ends directly on the clip range for faster completion rate."}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/30 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">Destination fit</div>
                    <div className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{conversionIntent} intent armed</div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Deep link and CTA framing are ready for replay follow-up, giving, events, or Beacon.</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Btn tone="ghost" onClick={() => setPreviewOpen(true)} left={<MonitorPlay className="h-4 w-4" />}>
                    Open full preview
                  </Btn>
                  <Btn tone="accent" onClick={() => setToast("Beacon boost draft prepared from current packaging.")} left={<Zap className="h-4 w-4" />}>
                    Boost with Beacon
                  </Btn>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Replay & clip preview"
        subtitle="Desktop and mobile packaging preview for the current clip, including CTA framing and quote-card treatment."
      >
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <div className="xl:col-span-7 space-y-4">
            <PreviewCanvas
              replay={selectedReplay}
              variant={selectedVariant}
              hookCopy={hookCopy}
              clipTitle={clipTitle}
              quoteCard={quoteCard}
              conversionIntent={conversionIntent}
              captionStyle={captionStyle}
              ctaPlacement={ctaPlacement}
              device="desktop"
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/30 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Packaging stack</div>
                <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between"><span>Variant</span><span className="font-bold text-slate-900 dark:text-slate-100">{selectedVariant}</span></div>
                  <div className="flex items-center justify-between"><span>Caption style</span><span className="font-bold text-slate-900 dark:text-slate-100">{captionStyle}</span></div>
                  <div className="flex items-center justify-between"><span>CTA placement</span><span className="font-bold text-slate-900 dark:text-slate-100">{ctaPlacement}</span></div>
                  <div className="flex items-center justify-between"><span>Intent</span><span className="font-bold text-slate-900 dark:text-slate-100">{conversionIntent}</span></div>
                </div>
              </div>
              <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/30 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Promotion handoff</div>
                <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" style={{ color: EV_GREEN }} /> Beacon-ready creative framing</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" style={{ color: EV_GREEN }} /> Notification deep link prepared</div>
                  <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" style={{ color: EV_ORANGE }} /> Caption approval still required for 9:16</div>
                </div>
              </div>
            </div>
          </div>
          <div className="xl:col-span-5 space-y-4">
            <PreviewCanvas
              replay={selectedReplay}
              variant={selectedVariant}
              hookCopy={hookCopy}
              clipTitle={clipTitle}
              quoteCard={quoteCard}
              conversionIntent={conversionIntent}
              captionStyle={captionStyle}
              ctaPlacement={ctaPlacement}
              device="mobile"
            />
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Open actions</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Btn tone="primary" onClick={createClip} left={<Scissors className="h-4 w-4" />}>
                  Create clip
                </Btn>
                <Btn tone="accent" onClick={() => setToast("Beacon boost prepared.")} left={<Zap className="h-4 w-4" />}>
                  Boost with Beacon
                </Btn>
                <Btn tone="neutral" onClick={copyReplayLink} left={<Copy className="h-4 w-4" />}>
                  Copy link
                </Btn>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {toast ? (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[120]">
          <div className="rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xl">{toast}</div>
        </div>
      ) : null}
    </div>
  );
}

function MetricCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return <KpiTile label={label} value={value} hint={hint} tone="gray" size="compact" />;
}

function LifecycleAction({ label, hint, onClick }: { label: string; hint: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800/40 px-3 py-3 text-left ring-1 ring-slate-200 dark:ring-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition">
      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{label}</div>
      <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{hint}</div>
    </button>
  );
}

function HeartIconPlaceholder(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 21s-7-4.35-9-8.5A5.5 5.5 0 0 1 12 5a5.5 5.5 0 0 1 9 7.5C19 16.65 12 21 12 21Z" />
    </svg>
  );
}







