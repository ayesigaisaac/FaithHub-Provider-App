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
  PlayCircle,
  Plus,
  Search,
  Sparkles,
  Users,
  Wand2,
  Workflow,
  Zap,
} from "lucide-react";
import { navigateWithRouter } from "@/navigation/routerNavigate";

/**
 * FaithHub — Series Dashboard
 * ------------------------------------
 * Premium operational landing page for structured Series content.
 *
 * Why this page exists
 * - Teachings Dashboard gives a broad teaching overview, but Series needs its own command surface.
 * - Episodes are children of Series, so + New Episode must always be tied to a selected Series.
 * - The page lets Providers manage Series, monitor nested Episodes, and move quickly into
 *   Series Builder, Episode Builder, Live Builder, Audience Notifications, and Beacon.
 *
 * Design goals
 * - EVzone Green primary, Orange secondary.
 * - Premium creator-style hierarchy: hero, KPI strip, command center, preview rail, and workflow boards.
 * - Strong emphasis on the Series ??? ? Episodes relationship.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#0f172a";

const ROUTES = {
  providerDashboard: "/faithhub/provider/dashboard",
  teachingsDashboard: "/faithhub/provider/teachings-dashboard",
  seriesBuilder: "/faithhub/provider/series-builder",
  episodeBuilder: "/faithhub/provider/episode-builder",
  liveBuilder: "/faithhub/provider/live-builder",
  audienceNotifications: "/faithhub/provider/audience-notifications",
  beaconBuilder: "/faithhub/provider/beacon-builder",
};

const HERO_1 =
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1600&q=80";
const HERO_2 =
  "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1600&q=80";
const HERO_3 =
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80";
const HERO_4 =
  "https://images.unsplash.com/photo-1504051771394-dd2e66b2e08f?auto=format&fit=crop&w=1600&q=80";

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

function fmtDateTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type SeriesStatus = "Draft" | "Scheduled" | "Published" | "Needs review";
type EpisodeStatus = "Draft" | "Scheduled" | "Live-linked" | "Published" | "Needs attention";
type AccessModel = "Public" | "Follower-first" | "Supporter" | "Private";
type PreviewMode = "desktop" | "mobile";
type FilterKey =
  | "all"
  | "published"
  | "drafts"
  | "scheduled"
  | "attention"
  | "live-linked"
  | "beacon-ready";

type EpisodeRecord = {
  id: string;
  number: number;
  title: string;
  status: EpisodeStatus;
  focus: string;
  linkedLives: number;
  resources: number;
  watchStarts: number;
  notesReady: boolean;
  artworkReady: boolean;
  replayReady: boolean;
  nextLiveISO?: string;
  owner: string;
};

type SeriesRecord = {
  id: string;
  title: string;
  subtitle: string;
  speaker: string;
  campus: string;
  access: AccessModel;
  status: SeriesStatus;
  coverUrl: string;
  summary: string;
  promise: string;
  languages: string[];
  tags: string[];
  beaconReady: boolean;
  artworkReady: boolean;
  notesReady: boolean;
  translationDue: number;
  linkedLives: number;
  replayCount: number;
  clipCount: number;
  episodeCount: number;
  watchStarts: number;
  followers: number;
  donationsInfluenced: number;
  updatedISO: string;
  nextLiveISO?: string;
  owner: string;
  episodes: EpisodeRecord[];
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
    id: "tpl-weekly-series",
    title: "Weekly sermon arc",
    subtitle:
      "Launch a structured multi-week teaching journey with episode sequencing and live follow-ups.",
    accent: "green",
    cta: "+ New Series",
  },
  {
    id: "tpl-discipleship",
    title: "Discipleship class",
    subtitle:
      "Start a class-style series with supporting resources, supporter access, and episode notes.",
    accent: "orange",
    cta: "+ New Series",
  },
  {
    id: "tpl-seasonal",
    title: "Seasonal theme",
    subtitle:
      "Create a premium Easter, Advent, conference, or revival series with Beacon-ready creative.",
    accent: "navy",
    cta: "+ New Series",
  },
  {
    id: "tpl-add-episode",
    title: "Episode sprint",
    subtitle:
      "Drop a new episode into the selected series and jump straight into notes, resources, and live setup.",
    accent: "green",
    cta: "+ New Episode",
  },
];

const SERIES_DATA: SeriesRecord[] = [
  {
    id: "series-renewal",
    title: "40 Days of Renewal",
    subtitle: "Prayer, repentance, spiritual reset, and renewed confidence in Christ.",
    speaker: "Pastor Anna",
    campus: "Kampala Central",
    access: "Public",
    status: "Published",
    coverUrl: HERO_1,
    summary:
      "A flagship six-week series with structured episodes, polished live moments, replay packaging, and multilingual support.",
    promise:
      "Guide the church into daily renewal through prayer, scripture, and practical obedience.",
    languages: ["English", "Swahili"],
    tags: ["Prayer", "Renewal", "Series"],
    beaconReady: true,
    artworkReady: true,
    notesReady: true,
    translationDue: 1,
    linkedLives: 4,
    replayCount: 6,
    clipCount: 14,
    episodeCount: 6,
    watchStarts: 12840,
    followers: 4120,
    donationsInfluenced: 18600,
    updatedISO: "2026-05-03T09:30:00.000Z",
    nextLiveISO: "2026-05-09T18:30:00.000Z",
    owner: "Pastor Anna",
    episodes: [
      {
        id: "ep-renewal-1",
        number: 1,
        title: "The Call to Hope",
        status: "Published",
        focus: "Set the series promise and spiritual tone.",
        linkedLives: 1,
        resources: 3,
        watchStarts: 3420,
        notesReady: true,
        artworkReady: true,
        replayReady: true,
        owner: "Editor Ruth",
      },
      {
        id: "ep-renewal-2",
        number: 2,
        title: "Return with Humility",
        status: "Scheduled",
        focus: "Lead viewers into repentance and realignment.",
        linkedLives: 1,
        resources: 3,
        watchStarts: 2100,
        notesReady: true,
        artworkReady: false,
        replayReady: false,
        nextLiveISO: "2026-05-09T18:30:00.000Z",
        owner: "Producer Joel",
      },
      {
        id: "ep-renewal-3",
        number: 3,
        title: "Fasting, Focus, and Fire",
        status: "Draft",
        focus: "Tie practice, prayer, and accountability together.",
        linkedLives: 0,
        resources: 2,
        watchStarts: 0,
        notesReady: false,
        artworkReady: true,
        replayReady: false,
        owner: "Pastor Anna",
      },
    ],
  },
  {
    id: "series-faith-work",
    title: "Faith at Work",
    subtitle: "A modern teaching path on vocation, ethics, diligence, and witness.",
    speaker: "Minister Ruth",
    campus: "Online-first",
    access: "Follower-first",
    status: "Scheduled",
    coverUrl: HERO_2,
    summary:
      "A workplace discipleship journey built for professionals, entrepreneurs, and young adults navigating calling and culture.",
    promise:
      "Help believers live faithfully and excellently in everyday work environments.",
    languages: ["English"],
    tags: ["Work", "Discipleship", "Series"],
    beaconReady: true,
    artworkReady: true,
    notesReady: false,
    translationDue: 0,
    linkedLives: 2,
    replayCount: 0,
    clipCount: 0,
    episodeCount: 4,
    watchStarts: 1840,
    followers: 880,
    donationsInfluenced: 4200,
    updatedISO: "2026-05-02T14:20:00.000Z",
    nextLiveISO: "2026-05-10T17:00:00.000Z",
    owner: "Minister Ruth",
    episodes: [
      {
        id: "ep-faith-work-1",
        number: 1,
        title: "Work as Worship",
        status: "Live-linked",
        focus: "Open the series with dignity, excellence, and calling.",
        linkedLives: 1,
        resources: 4,
        watchStarts: 1840,
        notesReady: true,
        artworkReady: true,
        replayReady: false,
        nextLiveISO: "2026-05-10T17:00:00.000Z",
        owner: "Minister Ruth",
      },
      {
        id: "ep-faith-work-2",
        number: 2,
        title: "Integrity Under Pressure",
        status: "Draft",
        focus: "Help believers navigate compromise, pace, and pressure.",
        linkedLives: 0,
        resources: 1,
        watchStarts: 0,
        notesReady: false,
        artworkReady: true,
        replayReady: false,
        owner: "Editor Ruth",
      },
      {
        id: "ep-faith-work-3",
        number: 3,
        title: "Witness Without Noise",
        status: "Needs attention",
        focus: "Add stories, prompts, and prayer points before publish.",
        linkedLives: 0,
        resources: 0,
        watchStarts: 0,
        notesReady: false,
        artworkReady: false,
        replayReady: false,
        owner: "Pastor Daniel",
      },
    ],
  },
  {
    id: "series-family-altar",
    title: "Family Altar Nights",
    subtitle: "Weekly family devotionals, prayer prompts, and simple liturgy at home.",
    speaker: "Pastor Samuel",
    campus: "Family Ministry",
    access: "Supporter",
    status: "Draft",
    coverUrl: HERO_3,
    summary:
      "A family-focused series designed for homes, children, and parent-led rhythms with downloadable guides.",
    promise:
      "Equip homes to pray, read, sing, and reflect together with confidence.",
    languages: ["English", "French"],
    tags: ["Family", "Devotional", "Series"],
    beaconReady: false,
    artworkReady: false,
    notesReady: false,
    translationDue: 2,
    linkedLives: 0,
    replayCount: 0,
    clipCount: 0,
    episodeCount: 5,
    watchStarts: 0,
    followers: 420,
    donationsInfluenced: 0,
    updatedISO: "2026-05-01T11:00:00.000Z",
    owner: "Family Team",
    episodes: [
      {
        id: "ep-family-1",
        number: 1,
        title: "Opening the Home Altar",
        status: "Draft",
        focus: "Create the first home liturgy guide.",
        linkedLives: 0,
        resources: 2,
        watchStarts: 0,
        notesReady: false,
        artworkReady: false,
        replayReady: false,
        owner: "Family Team",
      },
      {
        id: "ep-family-2",
        number: 2,
        title: "Prayer With Children",
        status: "Draft",
        focus: "Build guided discussion prompts and parent notes.",
        linkedLives: 0,
        resources: 1,
        watchStarts: 0,
        notesReady: false,
        artworkReady: false,
        replayReady: false,
        owner: "Family Team",
      },
    ],
  },
  {
    id: "series-kingdom-stewardship",
    title: "Kingdom Stewardship",
    subtitle: "Generosity, discipline, accountability, and faithful management.",
    speaker: "Dr. Lindiwe",
    campus: "Johannesburg North",
    access: "Public",
    status: "Needs review",
    coverUrl: HERO_4,
    summary:
      "A premium teaching campaign tied to seasonal giving, event follow-up, and Beacon promotion.",
    promise:
      "Show how faithful stewardship shapes discipleship, generosity, and witness.",
    languages: ["English", "Portuguese"],
    tags: ["Stewardship", "Giving", "Series"],
    beaconReady: true,
    artworkReady: true,
    notesReady: true,
    translationDue: 1,
    linkedLives: 1,
    replayCount: 2,
    clipCount: 6,
    episodeCount: 3,
    watchStarts: 5240,
    followers: 1920,
    donationsInfluenced: 24300,
    updatedISO: "2026-05-04T08:10:00.000Z",
    nextLiveISO: "2026-05-12T19:00:00.000Z",
    owner: "Finance Team",
    episodes: [
      {
        id: "ep-stew-1",
        number: 1,
        title: "Everything Belongs to God",
        status: "Published",
        focus: "Ground the series in scripture and trust.",
        linkedLives: 1,
        resources: 4,
        watchStarts: 2140,
        notesReady: true,
        artworkReady: true,
        replayReady: true,
        owner: "Dr. Lindiwe",
      },
      {
        id: "ep-stew-2",
        number: 2,
        title: "Generosity With Joy",
        status: "Published",
        focus: "Prepare follow-up and event-linked response.",
        linkedLives: 0,
        resources: 3,
        watchStarts: 1800,
        notesReady: true,
        artworkReady: true,
        replayReady: true,
        owner: "Finance Team",
      },
      {
        id: "ep-stew-3",
        number: 3,
        title: "Accountability and Overflow",
        status: "Needs attention",
        focus: "Resolve localization and disclosure notes before publish.",
        linkedLives: 0,
        resources: 2,
        watchStarts: 0,
        notesReady: true,
        artworkReady: true,
        replayReady: false,
        owner: "Dr. Lindiwe",
      },
    ],
  },
];

function seriesNeedsAttention(series: SeriesRecord) {
  return (
    !series.artworkReady ||
    !series.notesReady ||
    series.translationDue > 0 ||
    series.status === "Needs review" ||
    series.episodes.some((ep) => ep.status === "Needs attention" || !ep.notesReady || !ep.artworkReady)
  );
}

function seriesHasLiveLinked(series: SeriesRecord) {
  return series.linkedLives > 0 || series.episodes.some((ep) => ep.status === "Live-linked" || ep.linkedLives > 0);
}

function statusTone(status: SeriesStatus | EpisodeStatus) {
  if (status === "Published") return "good" as const;
  if (status === "Scheduled" || status === "Live-linked") return "warn" as const;
  if (status === "Needs review" || status === "Needs attention") return "danger" as const;
  return "neutral" as const;
}

function Pill({
  text,
  tone = "neutral",
}: {
  text: string;
  tone?: "neutral" | "good" | "warn" | "danger";
}) {
  const cls =
    tone === "good"
      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
      : tone === "warn"
        ? "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300"
        : tone === "danger"
          ? "border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300"
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300";
  return <span className={cx("px-2.5 py-1 rounded-full border text-[11px] font-semibold", cls)}>{text}</span>;
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
        "px-4 py-2 rounded-2xl text-[12px] font-semibold inline-flex items-center gap-2 border transition-colors",
        disabled
          ? "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200",
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
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "px-4 py-2 rounded-2xl text-[12px] font-semibold inline-flex items-center gap-2 border border-transparent text-white",
        disabled ? "opacity-60 cursor-not-allowed" : "hover:opacity-95",
        className,
      )}
      style={{ background: tone === "green" ? EV_GREEN : EV_ORANGE }}
    >
      {children}
    </button>
  );
}

function StatCard({
  label,
  value,
  helper,
  accent = "green",
}: {
  label: string;
  value: string;
  helper: string;
  accent?: "green" | "orange" | "navy";
}) {
  const accentColor = accent === "green" ? EV_GREEN : accent === "orange" ? EV_ORANGE : EV_NAVY;
  const softBg = accent === "orange" ? "#fff3e6" : accent === "navy" ? "#e9eef9" : "#e8f8f3";

  return (
    <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{label}</div>
          <div className="mt-2 text-[22px] font-black tracking-tight text-slate-900 dark:text-slate-100">{value}</div>
        </div>
        <div className="h-9 w-9 rounded-2xl" style={{ background: softBg, boxShadow: `inset 0 0 0 1px ${accentColor}22` }}>
          <div className="h-full w-full rounded-2xl" style={{ background: `${accentColor}22` }} />
        </div>
      </div>
      <div className="mt-2 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">{helper}</div>
    </div>
  );
}

function SectionCard({
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
    <div className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[15px] font-bold text-slate-900 dark:text-slate-100">{title}</div>
          {subtitle ? <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">{subtitle}</div> : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-4 py-3 text-[13px] text-slate-900 dark:text-slate-100 outline-none transition-colors focus:ring-2 focus:ring-[rgba(3,205,140,0.18)]"
      />
    </div>
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
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none transition-colors"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function EpisodeRow({
  episode,
  seriesId,
}: {
  episode: EpisodeRecord;
  seriesId: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 transition-colors">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-xl bg-slate-100 dark:bg-slate-900 px-2.5 py-1 text-[11px] font-black text-slate-600 dark:text-slate-300">
              EP {episode.number}
            </span>
            <Pill text={episode.status} tone={statusTone(episode.status)} />
            {episode.linkedLives > 0 ? <Pill text={`${episode.linkedLives} live-linked`} tone="warn" /> : null}
          </div>
          <div className="mt-2 text-[14px] font-bold text-slate-900 dark:text-slate-100">{episode.title}</div>
          <div className="mt-1 text-[12px] text-slate-600 dark:text-slate-400">{episode.focus}</div>

          <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 px-3 py-2 transition-colors">
              <div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Watch starts</div>
              <div className="mt-1 text-[14px] font-black text-slate-900 dark:text-slate-100">{fmtInt(episode.watchStarts)}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 px-3 py-2 transition-colors">
              <div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Resources</div>
              <div className="mt-1 text-[14px] font-black text-slate-900 dark:text-slate-100">{episode.resources}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 px-3 py-2 transition-colors">
              <div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Notes</div>
              <div className="mt-1 text-[14px] font-black text-slate-900 dark:text-slate-100">{episode.notesReady ? "Ready" : "Due"}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 px-3 py-2 transition-colors">
              <div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Artwork</div>
              <div className="mt-1 text-[14px] font-black text-slate-900 dark:text-slate-100">{episode.artworkReady ? "Ready" : "Missing"}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:flex-col lg:items-stretch lg:justify-start">
          <SoftButton onClick={() => safeNav(`${ROUTES.episodeBuilder}?seriesId=${seriesId}&episodeId=${episode.id}`)}>
            Open
          </SoftButton>
          <PrimaryButton tone="orange" onClick={() => safeNav(`${ROUTES.liveBuilder}?seriesId=${seriesId}&episodeId=${episode.id}`)}>
            Attach live
          </PrimaryButton>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
        <span>Owner: <span className="font-semibold text-slate-900 dark:text-slate-100">{episode.owner}</span></span>
        <span>Replay: <span className="font-semibold text-slate-900 dark:text-slate-100">{episode.replayReady ? "Ready" : "Not ready"}</span></span>
        <span>Next live: <span className="font-semibold text-slate-900 dark:text-slate-100">{fmtDateTime(episode.nextLiveISO)}</span></span>
      </div>
    </div>
  );
}

function SeriesLandingPreview({
  series,
  previewMode,
}: {
  series: SeriesRecord;
  previewMode: PreviewMode;
}) {
  const isMobile = previewMode === "mobile";

  return (
    <div className={cx("rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 transition-colors", isMobile ? "max-w-[360px]" : "") }>
      <div className={cx("overflow-hidden rounded-[22px] border border-slate-200 dark:border-slate-800 bg-[#0e7d72] text-white", isMobile ? "" : "") }>
        <div className="relative h-[184px] overflow-hidden">
          <img src={series.coverUrl} alt={series.title} className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0e7d72] via-[#137f74] to-[#0b3a5f]" style={{ opacity: 0.92 }} />
          <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#10223a] px-3 py-1 text-[10px] font-black">SERIES</span>
            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-black text-[#106f65]">{series.access}</span>
            {series.beaconReady ? (
              <span className="rounded-full bg-[#fff3e6] px-3 py-1 text-[10px] font-black text-[#f77f00]">Beacon-ready</span>
            ) : null}
          </div>

          <div className="absolute left-4 right-4 bottom-4">
            <div className="text-[15px] font-black tracking-tight">{series.title}</div>
            <div className="mt-2 max-w-[90%] text-[12px] leading-relaxed text-white/90">{series.subtitle}</div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button className="rounded-full bg-[#03cd8c] px-4 py-2 text-[12px] font-black text-white" onClick={() => safeNav("/faithhub/provider/series-dashboard")}>Follow series</button>
              <button className="rounded-full bg-[#f77f00] px-4 py-2 text-[12px] font-black text-white" onClick={() => safeNav("/faithhub/provider/live-dashboard")}>Watch trailer</button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 transition-colors">
              <div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Episodes</div>
              <div className="mt-1 text-[18px] font-black">{series.episodeCount}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 transition-colors">
              <div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Linked lives</div>
              <div className="mt-1 text-[18px] font-black">{series.linkedLives}</div>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 transition-colors">
            <div className="text-[12px] font-bold">Series summary</div>
            <div className="mt-1 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">{series.summary}</div>
          </div>

          <div className="mt-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 transition-colors">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[12px] font-bold">Episode ladder</div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Episodes live inside this series</span>
            </div>
            <div className="mt-2 space-y-2">
              {series.episodes.slice(0, 3).map((episode) => (
                <div key={episode.id} className="rounded-2xl bg-slate-50 dark:bg-slate-950 px-3 py-2 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-[12px] font-bold text-slate-900 dark:text-slate-100">Episode {episode.number} ? {episode.title}</div>
                      <div className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">{episode.focus}</div>
                    </div>
                    <Pill text={episode.status} tone={statusTone(episode.status)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SeriesDashboardPage() {
  const [query, setQuery] = useState("");
  const [filterKey, setFilterKey] = useState<FilterKey>("all");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [campusFilter, setCampusFilter] = useState("All campuses");
  const [accessFilter, setAccessFilter] = useState("All access models");

  const campuses = useMemo(
    () => ["All campuses", ...Array.from(new Set(SERIES_DATA.map((item) => item.campus)))],
    [],
  );
  const accessModels = useMemo(
    () => ["All access models", ...Array.from(new Set(SERIES_DATA.map((item) => item.access)))],
    [],
  );

  const filteredSeries = useMemo(() => {
    return SERIES_DATA.filter((series) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        [
          series.title,
          series.subtitle,
          series.speaker,
          series.campus,
          ...series.tags,
          ...series.episodes.map((episode) => episode.title),
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const matchesCampus = campusFilter === "All campuses" || series.campus === campusFilter;
      const matchesAccess = accessFilter === "All access models" || series.access === accessFilter;

      const matchesFilter =
        filterKey === "all"
          ? true
          : filterKey === "published"
            ? series.status === "Published"
            : filterKey === "drafts"
              ? series.status === "Draft"
              : filterKey === "scheduled"
                ? series.status === "Scheduled"
                : filterKey === "attention"
                  ? seriesNeedsAttention(series)
                  : filterKey === "live-linked"
                    ? seriesHasLiveLinked(series)
                    : series.beaconReady;

      return matchesQuery && matchesCampus && matchesAccess && matchesFilter;
    });
  }, [accessFilter, campusFilter, filterKey, query]);

  const [selectedSeriesId, setSelectedSeriesId] = useState<string>(SERIES_DATA[0]?.id ?? "");

  useEffect(() => {
    if (!filteredSeries.length) {
      setSelectedSeriesId("");
      return;
    }
    if (!filteredSeries.some((series) => series.id === selectedSeriesId)) {
      setSelectedSeriesId(filteredSeries[0].id);
    }
  }, [filteredSeries, selectedSeriesId]);

  const selectedSeries =
    filteredSeries.find((series) => series.id === selectedSeriesId) ?? filteredSeries[0] ?? null;

  const totalEpisodes = useMemo(
    () => SERIES_DATA.reduce((sum, series) => sum + series.episodeCount, 0),
    [],
  );
  const activeSeries = useMemo(
    () => SERIES_DATA.filter((series) => series.status === "Published" || series.status === "Scheduled").length,
    [],
  );
  const scheduledLives = useMemo(
    () => SERIES_DATA.reduce((sum, series) => sum + series.linkedLives, 0),
    [],
  );
  const watchStarts = useMemo(
    () => SERIES_DATA.reduce((sum, series) => sum + series.watchStarts, 0),
    [],
  );
  const beaconReadyCount = useMemo(
    () => SERIES_DATA.filter((series) => series.beaconReady).length,
    [],
  );
  const translationReviewCount = useMemo(
    () => SERIES_DATA.reduce((sum, series) => sum + series.translationDue, 0),
    [],
  );

  const episodePipeline = useMemo(() => {
    if (!selectedSeries) return [] as Array<{ id: string; title: string; detail: string; status: string; tone: "good" | "warn" | "danger" | "neutral" }>;
    return selectedSeries.episodes.map((episode) => {
      const tone = !episode.artworkReady || !episode.notesReady || episode.status === "Needs attention"
        ? "danger"
        : episode.status === "Scheduled" || episode.status === "Live-linked"
          ? "warn"
          : episode.status === "Published"
            ? "good"
            : "neutral";

      const detailParts = [
        episode.notesReady ? "Notes ready" : "Notes due",
        episode.artworkReady ? "Artwork ready" : "Artwork missing",
        episode.linkedLives > 0 ? `${episode.linkedLives} live linked` : "No live linked",
      ];

      return {
        id: episode.id,
        title: `Episode ${episode.number} ? ${episode.title}`,
        detail: detailParts.join(" ? "),
        status: episode.status,
        tone,
      };
    });
  }, [selectedSeries]);

  const seriesSignals = useMemo(() => {
    if (!selectedSeries) return null;
    return [
      { label: "Watch starts", value: fmtInt(selectedSeries.watchStarts) },
      { label: "Followers", value: fmtInt(selectedSeries.followers) },
      { label: "Giving", value: money(selectedSeries.donationsInfluenced) },
      { label: "Languages", value: String(selectedSeries.languages.length) },
    ];
  }, [selectedSeries]);

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-slate-900 dark:bg-slate-950 dark:text-slate-100 px-4 py-5 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-4">
        <section className="rounded-[30px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-colors">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-4">
                <div
                  className="grid h-12 w-12 place-items-center rounded-2xl text-white shadow-sm"
                  style={{ background: EV_GREEN }}
                >
                  <Layers className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-[28px] font-black leading-[1.04] tracking-[-0.03em] text-slate-900 dark:text-slate-100 sm:text-[34px] lg:text-[40px]">
                    Series Dashboard
                  </div>
                  <div className="mt-1.5 text-[14px] leading-6 text-slate-500 dark:text-slate-400">
                    Structured series command center for episodes, publishing, and linked live journeys.
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Pill text="Series-aware" tone="good" />
                <Pill text="Episodes inside Series" tone="neutral" />
                <Pill text="Live-linked" tone="warn" />
                <Pill text="Beacon-ready" tone="warn" />
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-3 xl:items-end">
              <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                <SoftButton onClick={() => safeNav(ROUTES.providerDashboard)}>
                  Provider Dashboard
                </SoftButton>
                <PrimaryButton tone="orange" onClick={() => safeNav(ROUTES.seriesBuilder)}>
                  <Plus className="h-4 w-4" /> + New Series
                </PrimaryButton>
                <PrimaryButton
                  tone="green"
                  onClick={() => selectedSeries && safeNav(`${ROUTES.episodeBuilder}?seriesId=${selectedSeries.id}`)}
                  disabled={!selectedSeries}
                  title={!selectedSeries ? "Select a series first" : "Create an episode inside the selected series"}
                >
                  <Plus className="h-4 w-4" /> + New Episode
                </PrimaryButton>
              </div>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-[12px] text-slate-600 dark:text-slate-400 max-w-[420px]">
                Episodes are created <span className="font-bold text-slate-900 dark:text-slate-100">inside a selected Series</span>. Use + New Episode on the chosen Series or from the top command bar.
              </div>
            </div>
          </div>
        </section>

        <div className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 transition-colors">
          <div className="flex flex-wrap items-center gap-3 text-[12px] text-slate-600 dark:text-slate-400">
            <span className="inline-flex items-center rounded-full border border-[#f77f00]/25 bg-[#fff3e6] px-3 py-1 font-black uppercase tracking-[0.08em] text-[#f77f00]">
              Series pipeline pulse
            </span>
            <span>1 series needs artwork</span>
            <span>?</span>
            <span>2 episodes require notes review</span>
            <span>?</span>
            <span>{translationReviewCount} translation variants still due</span>
            <span>?</span>
            <span>{beaconReadyCount} series already promotion-ready</span>
            <span className="ml-auto text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Premium series ops</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-6">
          <StatCard
            label="Active series"
            value={String(activeSeries)}
            helper="Structured teaching journeys currently active or scheduled."
            accent="green"
          />
          <StatCard
            label="Total episodes"
            value={String(totalEpisodes)}
            helper="Nested episode catalog currently managed under series shells."
            accent="navy"
          />
          <StatCard
            label="Linked lives"
            value={String(scheduledLives)}
            helper="Episodes already connected to Live Sessions."
            accent="navy"
          />
          <StatCard
            label="Watch starts"
            value={`${(watchStarts / 1000).toFixed(1)}k`}
            helper="Combined watch starts across structured series catalog."
            accent="green"
          />
          <StatCard
            label="Beacon-ready"
            value={String(beaconReadyCount)}
            helper="Series already prepared for promotion and audience amplification."
            accent="orange"
          />
          <StatCard
            label="Translation due"
            value={String(translationReviewCount)}
            helper="Localized titles, notes, or artwork variants still needing review."
            accent="orange"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.75fr)_430px]">
          <SectionCard
            title="Series command center"
            subtitle="Search, filter, and manage structured teaching journeys. Each series can hold multiple episodes, linked lives, replays, and resources."
            right={<Pill text={`${filteredSeries.length} series`} />}
          >
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.5fr)_220px_220px]">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Search series, speakers, episode titles, or tags"
              />
              <SelectPill value={campusFilter} options={campuses} onChange={setCampusFilter} />
              <SelectPill value={accessFilter} options={accessModels} onChange={setAccessFilter} />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {[
                ["all", "All series"],
                ["published", "Published"],
                ["drafts", "Drafts"],
                ["scheduled", "Scheduled"],
                ["attention", "Needs attention"],
                ["live-linked", "Live-linked"],
                ["beacon-ready", "Beacon-ready"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilterKey(key as FilterKey)}
                  className={cx(
                    "rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
                    filterKey === key
                      ? key === "beacon-ready"
                        ? "border-[#f77f00] bg-[#fff3e6] text-[#f77f00]"
                        : "border-transparent text-white"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700",
                  )}
                  style={filterKey === key && key !== "beacon-ready" ? { background: EV_GREEN } : undefined}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              {filteredSeries.map((series) => {
                const selected = series.id === selectedSeries?.id;
                return (
                  <div
                    key={series.id}
                    className={cx(
                      "rounded-[28px] border transition-colors",
                      selected
                        ? "border-[#03cd8c]/40 bg-[#edf9f5] dark:bg-emerald-900/10 dark:border-emerald-800"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedSeriesId(series.id)}
                      className="w-full text-left p-4"
                    >
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-4">
                            <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0">
                              <img src={series.coverUrl} alt={series.title} className="h-full w-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-xl bg-[#0e7d72] px-3 py-1 text-[11px] font-black text-white">SERIES</span>
                                <Pill text={series.status} tone={statusTone(series.status)} />
                                <Pill text={series.access} />
                                {series.beaconReady ? <Pill text="Beacon-ready" tone="warn" /> : null}
                              </div>
                              <div className="mt-2 text-[22px] font-black tracking-tight text-slate-900 dark:text-slate-100">{series.title}</div>
                              <div className="mt-1 text-[13px] font-medium text-slate-500 dark:text-slate-400">{series.subtitle}</div>
                              <div className="mt-2 text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">{series.summary}</div>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-5">
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800 px-3 py-2 transition-colors">
                              <div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Episodes</div>
                              <div className="mt-1 text-[16px] font-black text-slate-900 dark:text-slate-100">{series.episodeCount}</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800 px-3 py-2 transition-colors">
                              <div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Linked lives</div>
                              <div className="mt-1 text-[16px] font-black text-slate-900 dark:text-slate-100">{series.linkedLives}</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800 px-3 py-2 transition-colors">
                              <div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Replay / clips</div>
                              <div className="mt-1 text-[16px] font-black text-slate-900 dark:text-slate-100">{series.replayCount} / {series.clipCount}</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800 px-3 py-2 transition-colors">
                              <div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Watch starts</div>
                              <div className="mt-1 text-[16px] font-black text-slate-900 dark:text-slate-100">{fmtInt(series.watchStarts)}</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800 px-3 py-2 transition-colors">
                              <div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Languages</div>
                              <div className="mt-1 text-[16px] font-black text-slate-900 dark:text-slate-100">{series.languages.length}</div>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-slate-500 dark:text-slate-400">
                            <span>Speaker: <span className="font-semibold text-slate-900 dark:text-slate-100">{series.speaker}</span></span>
                            <span>Campus: <span className="font-semibold text-slate-900 dark:text-slate-100">{series.campus}</span></span>
                            <span>Updated: <span className="font-semibold text-slate-900 dark:text-slate-100">{fmtDate(series.updatedISO)}</span></span>
                            <span>Next live: <span className="font-semibold text-slate-900 dark:text-slate-100">{fmtDateTime(series.nextLiveISO)}</span></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 xl:flex-col xl:items-stretch xl:justify-start shrink-0">
                          <SoftButton onClick={() => safeNav(`${ROUTES.seriesBuilder}?seriesId=${series.id}`)}>
                            Open series
                          </SoftButton>
                          <PrimaryButton tone="green" onClick={() => safeNav(`${ROUTES.episodeBuilder}?seriesId=${series.id}`)}>
                            <Plus className="h-4 w-4" /> + New Episode
                          </PrimaryButton>
                        </div>
                      </div>
                    </button>

                    {selected ? (
                      <div className="border-t border-slate-200 dark:border-slate-800 px-4 pb-4 pt-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <div className="text-[13px] font-bold text-slate-900 dark:text-slate-100">Episode ladder for {series.title}</div>
                            <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                              Each episode lives inside this Series shell and can carry its own live, replay, resources, and promotion hooks.
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <SoftButton onClick={() => safeNav(`${ROUTES.audienceNotifications}?seriesId=${series.id}`)}>
                              Send reminders
                            </SoftButton>
                            <SoftButton onClick={() => safeNav(`${ROUTES.beaconBuilder}?seriesId=${series.id}`)}>
                              Promote with Beacon
                            </SoftButton>
                          </div>
                        </div>

                        <div className="mt-3 space-y-2">
                          {series.episodes.map((episode) => (
                            <EpisodeRow key={episode.id} episode={episode} seriesId={series.id} />
                          ))}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <PrimaryButton tone="green" onClick={() => safeNav(`${ROUTES.episodeBuilder}?seriesId=${series.id}`)}>
                            <Plus className="h-4 w-4" /> Add another episode
                          </PrimaryButton>
                          <SoftButton onClick={() => safeNav(`${ROUTES.liveBuilder}?seriesId=${series.id}`)}>
                            <PlayCircle className="h-4 w-4" /> Create linked live
                          </SoftButton>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}

              {!filteredSeries.length ? (
                <div className="rounded-[28px] border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center transition-colors">
                  <div className="text-[18px] font-black text-slate-900 dark:text-slate-100">No Series match this view</div>
                  <div className="mt-2 text-[13px] text-slate-500 dark:text-slate-400">
                    Clear filters or create a new Series. Episodes can only be created inside a selected Series.
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <PrimaryButton tone="orange" onClick={() => safeNav(ROUTES.seriesBuilder)}>
                      <Plus className="h-4 w-4" /> + New Series
                    </PrimaryButton>
                  </div>
                </div>
              ) : null}
            </div>
          </SectionCard>

          <div className="space-y-4">
            <SectionCard
              title="Series preview rail"
              subtitle="Persistent preview so the Provider can see how the selected Series will read across desktop and mobile."
              right={
                <div className="inline-flex rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 transition-colors">
                  <button
                    type="button"
                    className={cx(
                      "rounded-full px-3 py-1 text-[12px] font-semibold transition-colors",
                      previewMode === "desktop"
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                        : "text-slate-500 dark:text-slate-400",
                    )}
                    onClick={() => setPreviewMode("desktop")}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    className={cx(
                      "rounded-full px-3 py-1 text-[12px] font-semibold transition-colors",
                      previewMode === "mobile"
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                        : "text-slate-500 dark:text-slate-400",
                    )}
                    onClick={() => setPreviewMode("mobile")}
                  >
                    Mobile
                  </button>
                </div>
              }
            >
              {selectedSeries ? (
                <>
                  <SeriesLandingPreview series={selectedSeries} previewMode={previewMode} />

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <SoftButton onClick={() => safeNav(`${ROUTES.seriesBuilder}?seriesId=${selectedSeries.id}`)}>
                      Open large preview
                    </SoftButton>
                    <SoftButton
                      onClick={async () => {
                        if (typeof navigator !== "undefined" && navigator.clipboard) {
                          await navigator.clipboard.writeText(`${ROUTES.seriesBuilder}?seriesId=${selectedSeries.id}`);
                        }
                      }}
                    >
                      Copy link
                    </SoftButton>
                    <SoftButton onClick={() => safeNav(`${ROUTES.beaconBuilder}?seriesId=${selectedSeries.id}`)}>
                      Promote with Beacon
                    </SoftButton>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1.2fr)_170px]">
                    <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
                      <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100">Selected series summary</div>
                      <div className="mt-2 text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">{selectedSeries.summary}</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedSeries.tags.map((tag) => (
                          <span key={tag} className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
                      <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100">Signals</div>
                      <div className="mt-3 space-y-2">
                        {seriesSignals?.map((signal) => (
                          <div key={signal.label} className="flex items-center justify-between gap-2 text-[12px]">
                            <span className="text-slate-500 dark:text-slate-400">{signal.label}</span>
                            <span className="font-black text-slate-900 dark:text-slate-100">{signal.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl text-white" style={{ background: EV_GREEN }}>
                        <Workflow className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100">Series ??? ? Episodes rule</div>
                        <div className="mt-1 text-[12px] text-slate-600 dark:text-slate-400">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedSeries.title}</span> currently holds <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedSeries.episodeCount} episodes</span>. New episodes should be created from this Series context so they inherit the right identity, audience, and workflow connections.
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <PrimaryButton tone="green" onClick={() => safeNav(`${ROUTES.episodeBuilder}?seriesId=${selectedSeries.id}`)}>
                        <Plus className="h-4 w-4" /> + New Episode
                      </PrimaryButton>
                      <SoftButton onClick={() => safeNav(`${ROUTES.seriesBuilder}?seriesId=${selectedSeries.id}`)}>
                        Open Series Builder
                      </SoftButton>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-[24px] border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center transition-colors">
                  <div className="text-[15px] font-black text-slate-900 dark:text-slate-100">Select a series to preview it</div>
                  <div className="mt-2 text-[12px] text-slate-500 dark:text-slate-400">The preview rail and + New Episode flow depend on a selected Series.</div>
                </div>
              )}
            </SectionCard>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1.1fr)]">
          <SectionCard
            title="Episode pipeline"
            subtitle={selectedSeries ? `What is blocked, scheduled, or ready inside ${selectedSeries.title}.` : "Select a series to see episode workflow."}
          >
            {selectedSeries ? (
              <div className="space-y-2">
                {episodePipeline.map((row) => (
                  <div key={row.id} className="flex flex-col gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 transition-colors md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100">{row.title}</div>
                      <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">{row.detail}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Pill text={row.status} tone={row.tone} />
                      <SoftButton onClick={() => safeNav(`${ROUTES.episodeBuilder}?seriesId=${selectedSeries.id}&episodeId=${row.id}`)}>
                        Open
                      </SoftButton>
                    </div>
                  </div>
                ))}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <PrimaryButton tone="green" onClick={() => safeNav(`${ROUTES.episodeBuilder}?seriesId=${selectedSeries.id}`)}>
                    <Plus className="h-4 w-4" /> + New Episode
                  </PrimaryButton>
                  <SoftButton onClick={() => safeNav(`${ROUTES.liveBuilder}?seriesId=${selectedSeries.id}`)}>
                    <CalendarClock className="h-4 w-4" /> Plan linked live
                  </SoftButton>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 text-center transition-colors text-[12px] text-slate-500 dark:text-slate-400">
                Select a Series to manage its nested episodes.
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Quick-create templates"
            subtitle="Start the next series or episode without deep navigation."
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {TEMPLATE_CARDS.map((template) => {
                const accentColor =
                  template.accent === "green"
                    ? EV_GREEN
                    : template.accent === "orange"
                      ? EV_ORANGE
                      : EV_NAVY;
                const isEpisodeTemplate = template.id === "tpl-add-episode";
                return (
                  <div
                    key={template.id}
                    className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors"
                  >
                    <div className="h-2 w-14 rounded-full" style={{ background: accentColor }} />
                    <div className="mt-3 text-[15px] font-black text-slate-900 dark:text-slate-100">{template.title}</div>
                    <div className="mt-2 text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">{template.subtitle}</div>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <span className="text-[12px] font-bold" style={{ color: accentColor }}>
                        {template.cta}
                      </span>
                      <SoftButton
                        onClick={() => {
                          if (isEpisodeTemplate) {
                            if (selectedSeries) {
                              safeNav(`${ROUTES.episodeBuilder}?seriesId=${selectedSeries.id}`);
                            }
                          } else {
                            safeNav(ROUTES.seriesBuilder);
                          }
                        }}
                        disabled={isEpisodeTemplate && !selectedSeries}
                        title={isEpisodeTemplate && !selectedSeries ? "Select a Series first" : undefined}
                      >
                        {isEpisodeTemplate ? "Open Episode Builder" : "Use template"}
                      </SoftButton>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>

        <div className="rounded-[18px] border border-[#03cd8c]/30 bg-[#e8f8f3] px-4 py-3 text-center text-[13px] text-slate-600">
          FaithHub preview
        </div>
      </div>
    </div>
  );
}









