// @ts-nocheck
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Bell,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Copy,
  Eye,
  ExternalLink,
  FileText,
  Globe2,
  Languages,
  Layers,
  Link2,
  Megaphone,
  Mic,
  PlayCircle,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wand2,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { navigateWithRouter } from "@/navigation/routerNavigate";

/**
 * FaithHub — Teachings Dashboard
 * ---------------------------------------
 * Premium control surface for everything in the Teachings section.
 *
 * Why this page exists
 * - Provider navigation already treats Teachings as its own section,
 *   containing Series Builder, Episode Builder, and Standalone Teaching Builder.
 * - Series / Episode structure is optional, so standalone teachings need first-class entry points.
 * - This dashboard becomes the operational landing page for all teaching content,
 *   with + New Teaching (Standalone Teaching) as a primary command action.
 *
 * Design goals
 * - EVzone Green primary, Orange secondary.
 * - Strong hierarchy, quick-create, status visibility, analytics, preview rail.
 * - One place to see Series, Episodes, and Standalone teachings together,
 *   without forcing providers into fake structures.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#0f172a";

const ROUTES = {
  providerDashboard: "/faithhub/provider/dashboard",
  seriesBuilder: "/faithhub/provider/series-builder",
  episodeBuilder: "/faithhub/provider/episode-builder",
  standaloneTeachingBuilder: "/faithhub/provider/standalone-teaching-builder",
  liveBuilder: "/faithhub/provider/live-builder",
  postLivePublishing: "/faithhub/provider/post-live-publishing",
  replaysAndClips: "/faithhub/provider/replays-and-clips",
  beaconBuilder: "/faithhub/provider/beacon-builder",
  audienceNotifications: "/faithhub/provider/audience-notifications",
};

const HERO_1 =
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1600&q=80";
const HERO_2 =
  "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1600&q=80";
const HERO_3 =
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80";
const HERO_4 =
  "https://images.unsplash.com/photo-1504051771394-dd2e66b2e08f?auto=format&fit=crop&w=1600&q=80";
const HERO_5 =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80";

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  navigateWithRouter(url);
}

function fmtInt(n: number) {
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function money(n: number, currency = "$") {
  return `${currency}${Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(n)}`;
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type TeachingType = "Series" | "Episode" | "Standalone";
type TeachingStatus =
  | "Draft"
  | "Scheduled"
  | "Live-linked"
  | "Published"
  | "Needs review";
type AccessModel = "Public" | "Follower-first" | "Supporter" | "Private";
type PreviewMode = "desktop" | "mobile";
type FilterKey =
  | "all"
  | "series"
  | "episodes"
  | "standalone"
  | "drafts"
  | "live-linked"
  | "beacon-ready";

type TeachingRecord = {
  id: string;
  title: string;
  subtitle: string;
  type: TeachingType;
  status: TeachingStatus;
  speaker: string;
  summary: string;
  coverUrl: string;
  campus: string;
  access: AccessModel;
  languages: string[];
  tags: string[];
  seriesLabel?: string;
  episodeLabel?: string;
  episodeCount: number;
  liveCount: number;
  replayCount: number;
  clipCount: number;
  resourceCount: number;
  watchStarts: number;
  followers: number;
  donationsInfluenced: number;
  beaconReady: boolean;
  translationDue: number;
  notesReady: boolean;
  artworkReady: boolean;
  moderationBacklog: number;
  upcomingISO?: string;
  updatedISO: string;
  owner: string;
  topAction: string;
  topActionHint: string;
};

type TemplateCard = {
  id: string;
  title: string;
  subtitle: string;
  accent: "green" | "orange" | "navy";
  cta: string;
};

const TEMPLATE_CARDS: TemplateCard[] = [
  {
    id: "tpl-standalone-sermon",
    title: "Standalone sermon",
    subtitle:
      "One-off sermon or teaching with live, replay, notes, and Beacon hooks baked in.",
    accent: "green",
    cta: "+ New Teaching",
  },
  {
    id: "tpl-series-launch",
    title: "Series launch",
    subtitle:
      "Spin up a multi-week teaching journey with episode sequencing and reminder flows.",
    accent: "orange",
    cta: "+ New Series",
  },
  {
    id: "tpl-midweek-class",
    title: "Midweek class",
    subtitle:
      "Great for discipleship, Bible study, pastoral Q&A, and repeated live-linked teachings.",
    accent: "navy",
    cta: "Open Live Builder",
  },
  {
    id: "tpl-prayer-journey",
    title: "Prayer / devotional",
    subtitle:
      "Short-form content path with note attachments, recurring prompts, and follower-first access.",
    accent: "green",
    cta: "Use template",
  },
];

const TEACHINGS: TeachingRecord[] = [
  {
    id: "teach-series-renewal",
    title: "40 Days of Renewal",
    subtitle: "A guided teaching journey on prayer, repentance, and spiritual reset.",
    type: "Series",
    status: "Published",
    speaker: "Pastor Anna",
    summary:
      "A flagship six-week series with structured episodes, replay packaging, and multilingual rollout support.",
    coverUrl: HERO_1,
    campus: "Kampala Central",
    access: "Public",
    languages: ["English", "Swahili"],
    tags: ["Prayer", "Renewal", "Series"],
    episodeCount: 6,
    liveCount: 4,
    replayCount: 6,
    clipCount: 14,
    resourceCount: 5,
    watchStarts: 12840,
    followers: 4120,
    donationsInfluenced: 18600,
    beaconReady: true,
    translationDue: 1,
    notesReady: true,
    artworkReady: true,
    moderationBacklog: 0,
    upcomingISO: "2026-04-18T18:30:00Z",
    updatedISO: "2026-04-10T10:15:00Z",
    owner: "Pastor Anna",
    topAction: "Promote Week 5",
    topActionHint: "Reminder + Beacon teaser already ready.",
  },
  {
    id: "teach-episode-week5",
    title: "Week 5 · Return with Humility",
    subtitle: "Episode inside 40 Days of Renewal with live prayer response and follow-up notes.",
    type: "Episode",
    status: "Scheduled",
    speaker: "Pastor Anna",
    summary:
      "The next episode in the Renewal series, set to anchor the week’s live prayer encounter and replay handoff.",
    coverUrl: HERO_2,
    campus: "Online-first",
    access: "Follower-first",
    languages: ["English"],
    tags: ["Episode", "Prayer", "Humility"],
    seriesLabel: "40 Days of Renewal",
    episodeLabel: "Week 5",
    episodeCount: 1,
    liveCount: 2,
    replayCount: 0,
    clipCount: 0,
    resourceCount: 3,
    watchStarts: 2140,
    followers: 980,
    donationsInfluenced: 2400,
    beaconReady: false,
    translationDue: 0,
    notesReady: true,
    artworkReady: false,
    moderationBacklog: 0,
    upcomingISO: "2026-04-14T18:30:00Z",
    updatedISO: "2026-04-11T08:45:00Z",
    owner: "Content Team",
    topAction: "Attach artwork",
    topActionHint: "Episode metadata is ready; cover art is still missing.",
  },
  {
    id: "teach-standalone-standfirm",
    title: "Stand Firm in Uncertain Times",
    subtitle: "Standalone teaching prepared for a one-off midweek message and replay package.",
    type: "Standalone",
    status: "Draft",
    speaker: "Bishop Michael",
    summary:
      "A standalone sermon with no Series or Episode parent, designed for direct publish or live-first delivery.",
    coverUrl: HERO_3,
    campus: "FaithHub Studio",
    access: "Supporter",
    languages: ["English"],
    tags: ["Standalone", "Encouragement", "Midweek"],
    episodeCount: 0,
    liveCount: 0,
    replayCount: 0,
    clipCount: 0,
    resourceCount: 2,
    watchStarts: 0,
    followers: 0,
    donationsInfluenced: 0,
    beaconReady: false,
    translationDue: 0,
    notesReady: false,
    artworkReady: false,
    moderationBacklog: 0,
    updatedISO: "2026-04-12T12:20:00Z",
    owner: "Bishop Michael",
    topAction: "Finish notes + cover",
    topActionHint: "Draft is blocked by missing notes and artwork.",
  },
  {
    id: "teach-standalone-prayer",
    title: "Sunday Prayer Encounter",
    subtitle: "Standalone teaching with replay, notes, and follow-up prayer request journey.",
    type: "Standalone",
    status: "Published",
    speaker: "Pastor Ruth",
    summary:
      "A one-off prayer teaching that successfully ran live and now continues as a replay-rich destination page.",
    coverUrl: HERO_4,
    campus: "Prayer Chapel",
    access: "Public",
    languages: ["English", "French"],
    tags: ["Standalone", "Prayer", "Replay"],
    episodeCount: 0,
    liveCount: 1,
    replayCount: 1,
    clipCount: 4,
    resourceCount: 4,
    watchStarts: 6420,
    followers: 1880,
    donationsInfluenced: 7400,
    beaconReady: true,
    translationDue: 0,
    notesReady: true,
    artworkReady: true,
    moderationBacklog: 2,
    updatedISO: "2026-04-09T16:05:00Z",
    owner: "Pastor Ruth",
    topAction: "Boost replay",
    topActionHint: "Replay-ready, notifications-ready, and Beacon-ready.",
  },
  {
    id: "teach-series-family",
    title: "Faith at Home",
    subtitle: "Family discipleship series combining weekly episodes, resources, and event tie-ins.",
    type: "Series",
    status: "Live-linked",
    speaker: "Leader Michael",
    summary:
      "A family-focused teaching campaign with linked events, downloadable guides, and a rolling live schedule.",
    coverUrl: HERO_5,
    campus: "Family Ministry",
    access: "Follower-first",
    languages: ["English"],
    tags: ["Family", "Series", "Discipleship"],
    episodeCount: 4,
    liveCount: 3,
    replayCount: 2,
    clipCount: 6,
    resourceCount: 5,
    watchStarts: 5890,
    followers: 2260,
    donationsInfluenced: 3900,
    beaconReady: true,
    translationDue: 2,
    notesReady: true,
    artworkReady: true,
    moderationBacklog: 0,
    upcomingISO: "2026-04-16T17:00:00Z",
    updatedISO: "2026-04-10T09:00:00Z",
    owner: "Family Team",
    topAction: "Send countdown journey",
    topActionHint: "Live-linked teaching with strong event crossover.",
  },
  {
    id: "teach-episode-workfaith",
    title: "Faith & Work Q&A",
    subtitle: "Series-linked follow-up episode for workplace discipleship questions.",
    type: "Episode",
    status: "Needs review",
    speaker: "Pastor James",
    summary:
      "An episode that needs moderation and subtitle cleanup before it can become a polished replay destination.",
    coverUrl: HERO_2,
    campus: "Business Fellowship",
    access: "Private",
    languages: ["English"],
    tags: ["Episode", "Work", "Q&A"],
    seriesLabel: "Faith at Work",
    episodeLabel: "Follow-up",
    episodeCount: 1,
    liveCount: 1,
    replayCount: 1,
    clipCount: 1,
    resourceCount: 2,
    watchStarts: 980,
    followers: 370,
    donationsInfluenced: 550,
    beaconReady: false,
    translationDue: 1,
    notesReady: true,
    artworkReady: true,
    moderationBacklog: 5,
    updatedISO: "2026-04-08T13:50:00Z",
    owner: "Editorial",
    topAction: "Resolve trust queue",
    topActionHint: "Needs moderation response before re-promotion.",
  },
];

function typeTone(type: TeachingType) {
  if (type === "Series") return "navy" as const;
  if (type === "Episode") return "orange" as const;
  return "good" as const;
}

function statusTone(status: TeachingStatus) {
  if (status === "Published") return "good" as const;
  if (status === "Live-linked") return "navy" as const;
  if (status === "Scheduled") return "orange" as const;
  if (status === "Needs review") return "danger" as const;
  return "neutral" as const;
}

function accessTone(access: AccessModel) {
  if (access === "Public") return "good" as const;
  if (access === "Supporter") return "orange" as const;
  if (access === "Private") return "danger" as const;
  return "neutral" as const;
}

function Pill({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "good" | "orange" | "danger" | "navy";
  children: React.ReactNode;
}) {
  const cls =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "orange"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : tone === "danger"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : tone === "navy"
      ? "border-slate-900 bg-slate-900 text-white"
      : "border-slate-200 bg-white text-slate-700";

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold",
        cls,
      )}
    >
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
        "inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50",
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
  className,
  tone = "green",
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  tone?: "green" | "orange";
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl border border-transparent px-4 py-2 text-[12px] font-semibold text-white hover:opacity-95",
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
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[14px] font-bold text-slate-900">{title}</div>
          {subtitle ? (
            <div className="mt-0.5 text-[11px] text-slate-500">{subtitle}</div>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent: "green" | "orange" | "neutral" | "navy";
}) {
  const accentBg =
    accent === "green"
      ? "#d9f7ee"
      : accent === "orange"
      ? "#fff0df"
      : accent === "navy"
      ? "#e8eefc"
      : "#f8fafc";
  const dot =
    accent === "green"
      ? EV_GREEN
      : accent === "orange"
      ? EV_ORANGE
      : accent === "navy"
      ? EV_NAVY
      : "#cbd5e1";

  return (
    <div
      className="rounded-[24px] border border-slate-200 p-4"
      style={{ background: accentBg }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          {label}
        </div>
        <div
          className="h-9 w-9 rounded-2xl border border-white/80 shadow-sm"
          style={{ background: dot, opacity: 0.95 }}
        />
      </div>
      <div className="mt-3 text-[20px] font-black tracking-tight text-slate-900">
        {value}
      </div>
      <div className="mt-1 text-[12px] leading-5 text-slate-600">{hint}</div>
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
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-5xl bg-white shadow-2xl">
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200 px-6 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[14px] font-bold text-slate-900">{title}</div>
                {subtitle ? (
                  <div className="mt-0.5 text-[11px] text-slate-500">{subtitle}</div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

function getPrimaryRoute(teaching: TeachingRecord) {
  if (teaching.type === "Series") return ROUTES.seriesBuilder;
  if (teaching.type === "Episode") return ROUTES.episodeBuilder;
  return ROUTES.standaloneTeachingBuilder;
}

function getOpenLabel(teaching: TeachingRecord) {
  if (teaching.type === "Series") return "Open series";
  if (teaching.type === "Episode") return "Open episode";
  return "Open teaching";
}

function TeachingRow({
  teaching,
  selected,
  onSelect,
}: {
  teaching: TeachingRecord;
  selected: boolean;
  onSelect: () => void;
}) {
  const readinessText =
    !teaching.notesReady && !teaching.artworkReady
      ? "Notes + artwork missing"
      : !teaching.notesReady
      ? "Notes missing"
      : !teaching.artworkReady
      ? "Artwork missing"
      : teaching.translationDue > 0
      ? `${teaching.translationDue} translation due`
      : teaching.moderationBacklog > 0
      ? `${teaching.moderationBacklog} trust items`
      : "Ready";

  const readinessTone =
    !teaching.notesReady || !teaching.artworkReady
      ? "danger"
      : teaching.translationDue > 0 || teaching.moderationBacklog > 0
      ? "orange"
      : "good";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cx(
        "w-full rounded-[24px] border p-3 text-left transition-colors",
        selected
          ? "border-emerald-200 bg-emerald-50/70"
          : "border-slate-200 bg-white hover:bg-slate-50",
      )}
    >
      <div className="flex items-start gap-3">
        <img
          src={teaching.coverUrl}
          alt={teaching.title}
          className="h-20 w-20 rounded-2xl object-cover ring-1 ring-slate-200"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={typeTone(teaching.type)}>{teaching.type}</Pill>
            <Pill tone={statusTone(teaching.status)}>{teaching.status}</Pill>
            <Pill tone={accessTone(teaching.access)}>{teaching.access}</Pill>
            {teaching.beaconReady ? <Pill tone="good">Beacon-ready</Pill> : null}
          </div>

          <div className="mt-2 text-[15px] font-bold leading-5 text-slate-900">
            {teaching.title}
          </div>
          <div className="mt-0.5 text-[12px] text-slate-600">{teaching.subtitle}</div>
          <div className="mt-1 text-[11px] text-slate-500">
            {teaching.speaker}
            {teaching.seriesLabel ? ` · ${teaching.seriesLabel}` : ""}
            {teaching.episodeLabel ? ` · ${teaching.episodeLabel}` : ""}
            {teaching.upcomingISO ? ` · ${fmtDateTime(teaching.upcomingISO)}` : ""}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {teaching.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                Live
              </div>
              <div className="mt-1 text-[13px] font-bold text-slate-900">{teaching.liveCount}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                Replay / Clips
              </div>
              <div className="mt-1 text-[13px] font-bold text-slate-900">
                {teaching.replayCount} / {teaching.clipCount}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                Watch starts
              </div>
              <div className="mt-1 text-[13px] font-bold text-slate-900">
                {fmtInt(teaching.watchStarts)}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                Resources
              </div>
              <div className="mt-1 text-[13px] font-bold text-slate-900">
                {teaching.resourceCount}
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone={readinessTone}>{readinessText}</Pill>
              <span className="text-[11px] text-slate-500">
                Updated {fmtDate(teaching.updatedISO)} · Owner {teaching.owner}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <SoftButton onClick={() => safeNav(getPrimaryRoute(teaching))}>
                {getOpenLabel(teaching)}
              </SoftButton>
              <PrimaryButton tone="orange" onClick={() => safeNav(ROUTES.liveBuilder)}>
                Attach live
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

function TeachingPreview({
  teaching,
  mode,
}: {
  teaching: TeachingRecord;
  mode: PreviewMode;
}) {
  const primaryCta =
    teaching.status === "Scheduled" || teaching.status === "Live-linked"
      ? "Join live"
      : teaching.replayCount > 0 || teaching.status === "Published"
      ? "Watch replay"
      : teaching.type === "Series"
      ? "Follow series"
      : "Preview teaching";

  const secondaryCta =
    teaching.type === "Series" ? "Get reminders" : teaching.resourceCount > 0 ? "View notes" : "Follow";

  const frame = (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img src={teaching.coverUrl} alt={teaching.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08122c] via-[#08122c]/10 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Pill tone={typeTone(teaching.type)}>{teaching.type}</Pill>
          <Pill tone={accessTone(teaching.access)}>{teaching.access}</Pill>
          {teaching.beaconReady ? <Pill tone="good">Beacon-ready</Pill> : null}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <div className="text-[12px] font-semibold opacity-90">
            {teaching.seriesLabel || teaching.campus}
          </div>
          <div className="mt-1 text-[30px] font-black leading-tight tracking-tight">
            {teaching.title}
          </div>
          <div className="mt-2 max-w-xl text-[13px] text-white/90">
            {teaching.subtitle}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full px-5 py-2 text-[13px] font-bold text-white"
              style={{ background: EV_GREEN }}
              onClick={() =>
                safeNav(
                  primaryCta === "Join live" || primaryCta === "Watch replay"
                    ? "/faithhub/provider/live-dashboard"
                    : primaryCta === "Follow series"
                      ? "/faithhub/provider/series-dashboard"
                      : "/faithhub/provider/teachings-dashboard",
                )
              }>
              {primaryCta}
            </button>
            <button
              type="button"
              className="rounded-full px-5 py-2 text-[13px] font-bold text-white"
              style={{ background: EV_ORANGE }}
              onClick={() =>
                safeNav(
                  secondaryCta === "Get reminders"
                    ? "/faithhub/provider/audience-notifications"
                    : secondaryCta === "View notes"
                      ? "/faithhub/provider/resources-manager"
                      : "/faithhub/provider/teachings-dashboard",
                )
              }>
              {secondaryCta}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-[1.2fr,0.8fr]">
        <div>
          <div className="text-[15px] font-bold text-slate-900">Teaching summary</div>
          <div className="mt-1 text-[12px] leading-6 text-slate-600">{teaching.summary}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {teaching.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <div className="text-[15px] font-bold text-slate-900">Teaching signals</div>
          <div className="mt-3 space-y-2 text-[12px] text-slate-600">
            <div className="flex items-center justify-between gap-3">
              <span>Watch starts</span>
              <span className="font-bold text-slate-900">{fmtInt(teaching.watchStarts)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Followers</span>
              <span className="font-bold text-slate-900">{fmtInt(teaching.followers)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Giving influenced</span>
              <span className="font-bold text-slate-900">{money(teaching.donationsInfluenced)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Languages</span>
              <span className="font-bold text-slate-900">{teaching.languages.join(", ")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (mode === "desktop") return frame;

  return (
    <div className="mx-auto max-w-[320px] rounded-[36px] bg-slate-900 p-3 shadow-2xl">
      <div className="overflow-hidden rounded-[28px] bg-white">{frame}</div>
    </div>
  );
}

function TemplateTile({
  card,
  onClick,
}: {
  card: TemplateCard;
  onClick: () => void;
}) {
  const accentBg =
    card.accent === "green"
      ? "#d9f7ee"
      : card.accent === "orange"
      ? "#fff0df"
      : "#eef2ff";
  const accent =
    card.accent === "green"
      ? EV_GREEN
      : card.accent === "orange"
      ? EV_ORANGE
      : EV_NAVY;

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[24px] border border-slate-200 bg-white p-4 text-left transition-colors hover:bg-slate-50"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[14px] font-bold text-slate-900">{card.title}</div>
          <div className="mt-1 text-[12px] leading-5 text-slate-600">{card.subtitle}</div>
        </div>
        <div
          className="grid h-10 w-10 place-items-center rounded-2xl"
          style={{ background: accentBg, color: accent }}
        >
          <Sparkles className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 text-[12px] font-bold" style={{ color: accent }}>
        {card.cta}
      </div>
    </button>
  );
}

export default function TeachingsDashboardPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedId, setSelectedId] = useState(TEACHINGS[0]?.id || "");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const filteredTeachings = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEACHINGS.filter((teaching) => {
      const matchesQuery =
        !q ||
        [
          teaching.title,
          teaching.subtitle,
          teaching.speaker,
          teaching.summary,
          teaching.tags.join(" "),
          teaching.seriesLabel || "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "series"
          ? teaching.type === "Series"
          : filter === "episodes"
          ? teaching.type === "Episode"
          : filter === "standalone"
          ? teaching.type === "Standalone"
          : filter === "drafts"
          ? teaching.status === "Draft"
          : filter === "live-linked"
          ? teaching.status === "Live-linked" || teaching.liveCount > 0
          : teaching.beaconReady;

      return matchesQuery && matchesFilter;
    });
  }, [filter, query]);

  const selectedTeaching =
    filteredTeachings.find((teaching) => teaching.id === selectedId) ||
    filteredTeachings[0] ||
    TEACHINGS[0];

  useEffect(() => {
    if (!selectedTeaching) return;
    if (selectedTeaching.id !== selectedId) setSelectedId(selectedTeaching.id);
  }, [selectedTeaching, selectedId]);

  const stats = useMemo(() => {
    const activeSeries = TEACHINGS.filter((t) => t.type === "Series").length;
    const standalone = TEACHINGS.filter((t) => t.type === "Standalone").length;
    const liveLinked = TEACHINGS.filter(
      (t) => t.status === "Live-linked" || t.liveCount > 0,
    ).length;
    const replayReady = TEACHINGS.filter(
      (t) => t.replayCount > 0 || t.status === "Published",
    ).length;
    const watchStarts = TEACHINGS.reduce((sum, t) => sum + t.watchStarts, 0);
    const beaconReady = TEACHINGS.filter((t) => t.beaconReady).length;

    return {
      activeSeries,
      standalone,
      liveLinked,
      replayReady,
      watchStarts,
      beaconReady,
    };
  }, []);

  const pulseItems = useMemo(() => {
    const missingArtwork = TEACHINGS.filter((t) => !t.artworkReady).length;
    const missingNotes = TEACHINGS.filter((t) => !t.notesReady).length;
    const translationDue = TEACHINGS.filter((t) => t.translationDue > 0).length;
    const readyForBeacon = TEACHINGS.filter((t) => t.beaconReady).length;
    return [
      `${missingArtwork} teachings need artwork`,
      `${missingNotes} teachings need notes`,
      `${translationDue} teachings need translation review`,
      `${readyForBeacon} teachings are ready for notifications and Beacon`,
    ];
  }, []);

  const pipelineItems = useMemo(() => {
    return TEACHINGS.map((teaching) => ({
      id: teaching.id,
      title: teaching.title,
      hint:
        !teaching.notesReady && !teaching.artworkReady
          ? "Notes and artwork missing"
          : !teaching.notesReady
          ? "Notes still missing"
          : !teaching.artworkReady
          ? "Cover and preview art missing"
          : teaching.translationDue > 0
          ? `${teaching.translationDue} language variant still due`
          : teaching.moderationBacklog > 0
          ? `${teaching.moderationBacklog} moderation items waiting`
          : teaching.topActionHint,
      status:
        !teaching.notesReady || !teaching.artworkReady
          ? "Blocked"
          : teaching.translationDue > 0 || teaching.moderationBacklog > 0
          ? "Review"
          : "Ready",
    })).sort((a, b) => {
      const order = { Blocked: 0, Review: 1, Ready: 2 } as Record<string, number>;
      return order[a.status] - order[b.status];
    });
  }, []);

  const liveLinkedTeachings = useMemo(
    () =>
      TEACHINGS.filter((t) => t.upcomingISO)
        .sort((a, b) => new Date(a.upcomingISO || "").getTime() - new Date(b.upcomingISO || "").getTime())
        .slice(0, 4),
    [],
  );

  const topPerformers = useMemo(
    () => [...TEACHINGS].sort((a, b) => b.watchStarts - a.watchStarts).slice(0, 4),
    [],
  );

  const recommendations = useMemo(() => {
    if (!selectedTeaching) return [] as string[];
    const items: string[] = [];
    if (selectedTeaching.type !== "Series") items.push("Open the Standalone Teaching Builder and finish the viewer-facing package.");
    if (selectedTeaching.liveCount === 0) items.push("Create a linked Live Session so this teaching can enter the full live → replay → clips workflow.");
    if (selectedTeaching.replayCount > 0) items.push("Open Replays & Clips to generate short discovery moments and push them into Beacon.");
    if (selectedTeaching.beaconReady) items.push("Launch a Beacon campaign while the teaching is still fresh and conversion-ready.");
    if (selectedTeaching.translationDue > 0) items.push("Complete translation variants before the next outreach or replay reminder journey.");
    if (selectedTeaching.moderationBacklog > 0) items.push("Resolve trust and review items before sending wider promotion.");
    return items.slice(0, 4);
  }, [selectedTeaching]);

  const copySelectedLink = async () => {
    if (!selectedTeaching) return;
    const link = `https://faithhub.app/teachings/${selectedTeaching.id}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const quickCreate = (templateId: string) => {
    if (templateId === "tpl-series-launch") {
      safeNav(ROUTES.seriesBuilder);
      return;
    }
    if (templateId === "tpl-midweek-class") {
      safeNav(ROUTES.liveBuilder);
      return;
    }
    safeNav(ROUTES.standaloneTeachingBuilder);
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-slate-900">
      <div className="mx-auto max-w-[1600px] px-5 py-5 md:px-6 lg:px-8">
        <section className="rounded-[34px] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex min-w-0 gap-4">
              <div
                className="grid h-14 w-14 shrink-0 place-items-center rounded-[20px] text-[22px] font-black text-white"
                style={{ background: EV_GREEN }}
              >
                FH
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Teachings command
                </div>
                <div className="mt-1 text-[28px] font-black leading-[1.05] tracking-tight text-slate-900 md:text-[34px]">
                  Teachings Dashboard
                </div>
                <div className="mt-1 max-w-4xl text-[13px] leading-6 text-slate-600">
                  Premium operating surface for Series, Episodes, and Standalone teachings — built to keep structured journeys and one-off sermons in one calm, world-class control center.
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Pill tone="good">Standalone-first</Pill>
                  <Pill tone="navy">Series-aware</Pill>
                  <Pill tone="orange">Live-linked</Pill>
                  <Pill tone="good">Replay + Beacon-ready</Pill>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 xl:justify-end">
              <SoftButton onClick={() => safeNav(ROUTES.providerDashboard)}>
                Provider Dashboard
              </SoftButton>
              <SoftButton onClick={() => safeNav(ROUTES.seriesBuilder)}>
                <Layers className="h-4 w-4" /> Open Series Builder
              </SoftButton>
              <PrimaryButton tone="orange" onClick={() => safeNav(ROUTES.seriesBuilder)}>
                <Plus className="h-4 w-4" /> + New Series
              </PrimaryButton>
              <PrimaryButton onClick={() => safeNav(ROUTES.standaloneTeachingBuilder)}>
                <Plus className="h-4 w-4" /> + New Teaching
              </PrimaryButton>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[28px] border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3 text-[12px] text-slate-600">
              <Pill tone="orange">TEACHING PIPELINE PULSE</Pill>
              {pulseItems.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              PREMIUM TEACHING OPS
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <StatCard
            label="Active series"
            value={String(stats.activeSeries)}
            hint="Structured teaching journeys currently running or published."
            accent="green"
          />
          <StatCard
            label="Standalone teachings"
            value={String(stats.standalone)}
            hint="One-off sermons and teachings without Series / Episode parents."
            accent="neutral"
          />
          <StatCard
            label="Live-linked"
            value={String(stats.liveLinked)}
            hint="Teachings already connected to live or upcoming session moments."
            accent="navy"
          />
          <StatCard
            label="Replay-ready"
            value={String(stats.replayReady)}
            hint="Teachings ready for replay packaging, clips, and follow-up journeys."
            accent="green"
          />
          <StatCard
            label="Watch starts"
            value={fmtInt(stats.watchStarts)}
            hint="Combined watch starts across series, episodes, and standalone teachings."
            accent="orange"
          />
          <StatCard
            label="Beacon-ready"
            value={String(stats.beaconReady)}
            hint="Teachings that can move directly into premium promotion surfaces."
            accent="orange"
          />
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[1.6fr,0.95fr]">
          <div className="space-y-4">
            <Card
              title="Teachings command center"
              subtitle="Search, filter, and manage every teaching object across structured series and standalone sermons."
              right={<Pill tone="neutral">{filteredTeachings.length} teachings</Pill>}
            >
              <div className="grid gap-3 lg:grid-cols-[1.1fr,0.35fr,0.35fr]">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search teachings, speakers, tags, or series"
                      className="w-full bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-semibold text-slate-700">
                  All campuses
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-semibold text-slate-700">
                  All access models
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  ["all", "All teachings"],
                  ["series", "Series"],
                  ["episodes", "Episodes"],
                  ["standalone", "Standalone"],
                  ["drafts", "Drafts"],
                  ["live-linked", "Live-linked"],
                  ["beacon-ready", "Beacon-ready"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key as FilterKey)}
                    className={cx(
                      "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                      filter === key
                        ? "border-transparent text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                    )}
                    style={filter === key ? { background: key === "beacon-ready" ? EV_ORANGE : EV_GREEN } : undefined}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-3">
                {filteredTeachings.map((teaching) => (
                  <TeachingRow
                    key={teaching.id}
                    teaching={teaching}
                    selected={teaching.id === selectedTeaching?.id}
                    onSelect={() => setSelectedId(teaching.id)}
                  />
                ))}
                {!filteredTeachings.length ? (
                  <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
                    <div className="text-[14px] font-bold text-slate-900">No teachings match this view</div>
                    <div className="mt-1 text-[12px] text-slate-500">
                      Clear the search or jump straight into a new standalone teaching.
                    </div>
                    <div className="mt-4 flex justify-center">
                      <PrimaryButton onClick={() => safeNav(ROUTES.standaloneTeachingBuilder)}>
                        <Plus className="h-4 w-4" /> + New Teaching
                      </PrimaryButton>
                    </div>
                  </div>
                ) : null}
              </div>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card
                title="Content pipeline"
                subtitle="What is blocked, what is under review, and what is ready to push forward today."
              >
                <div className="space-y-2">
                  {pipelineItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-[13px] font-bold text-slate-900">{item.title}</div>
                          <div className="mt-0.5 text-[11px] text-slate-500">{item.hint}</div>
                        </div>
                        <Pill tone={item.status === "Blocked" ? "danger" : item.status === "Review" ? "orange" : "good"}>
                          {item.status}
                        </Pill>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card
                title="Live-linked teachings"
                subtitle="Upcoming live moments connected to teachings, series episodes, or standalone sermons."
              >
                <div className="space-y-2">
                  {liveLinkedTeachings.map((teaching) => (
                    <div
                      key={teaching.id}
                      className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-[13px] font-bold text-slate-900">{teaching.title}</div>
                          <div className="mt-0.5 text-[11px] text-slate-500">
                            {teaching.upcomingISO ? fmtDateTime(teaching.upcomingISO) : "TBD"} · {teaching.campus}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <SoftButton onClick={() => safeNav(ROUTES.liveBuilder)}>
                            Open live
                          </SoftButton>
                          <PrimaryButton tone="orange" onClick={() => safeNav(ROUTES.audienceNotifications)}>
                            Send reminder
                          </PrimaryButton>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card
                title="Teaching performance intelligence"
                subtitle="Top performers across structured and standalone teaching content."
              >
                <div className="space-y-3">
                  {topPerformers.map((teaching) => (
                    <div
                      key={teaching.id}
                      className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-[13px] font-bold text-slate-900">{teaching.title}</div>
                          <div className="mt-0.5 text-[11px] text-slate-500">
                            {teaching.type} · {teaching.speaker}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[16px] font-black text-slate-900">{fmtInt(teaching.watchStarts)}</div>
                          <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                            Watch starts
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
                          <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Followers</div>
                          <div className="mt-1 text-[13px] font-bold text-slate-900">{fmtInt(teaching.followers)}</div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
                          <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Replay / Clips</div>
                          <div className="mt-1 text-[13px] font-bold text-slate-900">
                            {teaching.replayCount} / {teaching.clipCount}
                          </div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
                          <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Giving influenced</div>
                          <div className="mt-1 text-[13px] font-bold text-slate-900">
                            {money(teaching.donationsInfluenced)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card
                title="Localization & access health"
                subtitle="Language variants, access rules, notes, moderation, and publishing confidence."
              >
                {selectedTeaching ? (
                  <div className="space-y-3">
                    <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-[13px] font-bold text-slate-900">{selectedTeaching.title}</div>
                          <div className="mt-0.5 text-[11px] text-slate-500">
                            {selectedTeaching.languages.join(", ")} · {selectedTeaching.access}
                          </div>
                        </div>
                        <Pill tone={accessTone(selectedTeaching.access)}>{selectedTeaching.access}</Pill>
                      </div>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                        <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Notes & resources</div>
                        <div className="mt-1 text-[13px] font-bold text-slate-900">
                          {selectedTeaching.notesReady ? "Ready" : "Missing notes"}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                        <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Artwork & cover</div>
                        <div className="mt-1 text-[13px] font-bold text-slate-900">
                          {selectedTeaching.artworkReady ? "Ready" : "Needs artwork"}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                        <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Translation due</div>
                        <div className="mt-1 text-[13px] font-bold text-slate-900">
                          {selectedTeaching.translationDue}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                        <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Trust queue</div>
                        <div className="mt-1 text-[13px] font-bold text-slate-900">
                          {selectedTeaching.moderationBacklog}
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="text-[12px] font-bold text-slate-900">Best next action</div>
                      <div className="mt-1 text-[12px] text-slate-600">{selectedTeaching.topAction}</div>
                      <div className="mt-0.5 text-[11px] text-slate-500">{selectedTeaching.topActionHint}</div>
                    </div>
                  </div>
                ) : null}
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <Card
              title="Teaching preview rail"
              subtitle="Persistent preview so the Provider can see how the selected teaching will read across desktop and mobile."
              right={
                <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("desktop")}
                    className={cx(
                      "rounded-full px-3 py-1 text-[11px] font-semibold transition-colors",
                      previewMode === "desktop" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50",
                    )}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("mobile")}
                    className={cx(
                      "rounded-full px-3 py-1 text-[11px] font-semibold transition-colors",
                      previewMode === "mobile" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50",
                    )}
                  >
                    Mobile
                  </button>
                </div>
              }
            >
              {selectedTeaching ? (
                <>
                  <TeachingPreview teaching={selectedTeaching} mode={previewMode} />
                  <div className="mt-4 flex flex-wrap gap-2">
                    <SoftButton onClick={() => setPreviewOpen(true)}>
                      <Eye className="h-4 w-4" /> Open large preview
                    </SoftButton>
                    <SoftButton onClick={copySelectedLink}>
                      <Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy link"}
                    </SoftButton>
                    <PrimaryButton tone="orange" onClick={() => safeNav(getPrimaryRoute(selectedTeaching))}>
                      <ChevronRight className="h-4 w-4" /> {getOpenLabel(selectedTeaching)}
                    </PrimaryButton>
                  </div>
                </>
              ) : null}
            </Card>

            <Card
              title="Quick-create templates"
              subtitle="Start a teaching the right way without deep navigation."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {TEMPLATE_CARDS.map((card) => (
                  <TemplateTile
                    key={card.id}
                    card={card}
                    onClick={() => quickCreate(card.id)}
                  />
                ))}
              </div>
            </Card>

            <Card
              title="Growth recommendations"
              subtitle="Cross-object recommendations tied to the currently selected teaching."
            >
              <div className="space-y-2">
                {recommendations.map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="mt-0.5 grid h-8 w-8 place-items-center rounded-2xl text-white"
                        style={{ background: EV_ORANGE }}
                      >
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 text-[12px] leading-6 text-slate-700">{item}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <SoftButton onClick={() => safeNav(ROUTES.replaysAndClips)}>
                  <PlayCircle className="h-4 w-4" /> Replays & Clips
                </SoftButton>
                <SoftButton onClick={() => safeNav(ROUTES.audienceNotifications)}>
                  <Bell className="h-4 w-4" /> Audience Notifications
                </SoftButton>
                <SoftButton onClick={() => safeNav(ROUTES.liveBuilder)}>
                  <CalendarClock className="h-4 w-4" /> Live Builder
                </SoftButton>
                <PrimaryButton tone="orange" onClick={() => safeNav(ROUTES.beaconBuilder)}>
                  <Megaphone className="h-4 w-4" /> Beacon Builder
                </PrimaryButton>
              </div>
            </Card>
          </div>
        </section>
      </div>

      <Drawer
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={selectedTeaching ? `${selectedTeaching.title} · Teaching preview` : "Teaching preview"}
        subtitle="Full preview view plus linked workflow signals."
      >
        {selectedTeaching ? (
          <div className="grid gap-6 xl:grid-cols-[1.3fr,0.7fr]">
            <div>
              <TeachingPreview teaching={selectedTeaching} mode="desktop" />
            </div>

            <div className="space-y-4">
              <Card
                title="What this page is carrying"
                subtitle="Signals that make the teaching premium and operationally ready."
              >
                <div className="space-y-2 text-[12px] text-slate-600">
                  <div className="flex items-center justify-between gap-3">
                    <span>Type</span>
                    <Pill tone={typeTone(selectedTeaching.type)}>{selectedTeaching.type}</Pill>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Status</span>
                    <Pill tone={statusTone(selectedTeaching.status)}>{selectedTeaching.status}</Pill>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Access</span>
                    <Pill tone={accessTone(selectedTeaching.access)}>{selectedTeaching.access}</Pill>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Live sessions</span>
                    <span className="font-bold text-slate-900">{selectedTeaching.liveCount}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Replays / clips</span>
                    <span className="font-bold text-slate-900">{selectedTeaching.replayCount} / {selectedTeaching.clipCount}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Resources</span>
                    <span className="font-bold text-slate-900">{selectedTeaching.resourceCount}</span>
                  </div>
                </div>
              </Card>

              <Card
                title="Linked workflow actions"
                subtitle="Jump directly into the next best page from this teaching."
              >
                <div className="grid gap-2">
                  <SoftButton onClick={() => safeNav(getPrimaryRoute(selectedTeaching))}>
                    <BookOpen className="h-4 w-4" /> {getOpenLabel(selectedTeaching)}
                  </SoftButton>
                  <SoftButton onClick={() => safeNav(ROUTES.liveBuilder)}>
                    <CalendarClock className="h-4 w-4" /> Create / attach live session
                  </SoftButton>
                  <SoftButton onClick={() => safeNav(ROUTES.postLivePublishing)}>
                    <FileText className="h-4 w-4" /> Post-live Publishing
                  </SoftButton>
                  <SoftButton onClick={() => safeNav(ROUTES.replaysAndClips)}>
                    <PlayCircle className="h-4 w-4" /> Replays & Clips
                  </SoftButton>
                  <PrimaryButton tone="orange" onClick={() => safeNav(ROUTES.beaconBuilder)}>
                    <Megaphone className="h-4 w-4" /> Promote with Beacon
                  </PrimaryButton>
                </div>
              </Card>

              <Card
                title="Provider signals"
                subtitle="What the team should fix or keep moving now."
              >
                <div className="space-y-2 text-[12px] text-slate-600">
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <span>Cover art</span>
                    <span className="font-bold text-slate-900">{selectedTeaching.artworkReady ? "Ready" : "Missing"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <span>Notes</span>
                    <span className="font-bold text-slate-900">{selectedTeaching.notesReady ? "Ready" : "Missing"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <span>Translations due</span>
                    <span className="font-bold text-slate-900">{selectedTeaching.translationDue}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <span>Moderation items</span>
                    <span className="font-bold text-slate-900">{selectedTeaching.moderationBacklog}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}



