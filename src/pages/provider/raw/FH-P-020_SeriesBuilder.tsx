// @ts-nocheck
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Bell,
  BookOpen,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Globe2,
  GripVertical,
  Image as ImageIcon,
  Languages,
  Layers,
  Link2,
  Lock,
  Megaphone,
  PlayCircle,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import { navigateWithRouter } from "@/navigation/routerNavigate";

/**
 * FaithHub — Series Builder
 * ----------------------------------
 * Premium teaching-series control surface for the Provider side.
 *
 * Design goals
 * - Keep the same premium creator-style grammar already used across the generated FaithHub pages:
 *   top action bar, left step rail, rich center workspace, and a persistent right-side preview.
 * - Use EVzone Green as the primary accent and Orange as the secondary accent.
 * - Represent the full Series Builder scope from the premium blueprint:
 *   identity, brand/media, narrative map, audience and access, localization,
 *   resources and CTAs, publishing flow, and readiness.
 * - Keep the page self-contained and integration-friendly.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#0f172a";

const ROUTES = {
  providerDashboard: "/faithhub/provider/dashboard",
  episodeBuilder: "/faithhub/provider/episode-builder",
  liveBuilder: "/faithhub/provider/live-builder",
  audienceNotifications: "/faithhub/provider/audience-notifications",
  beaconBuilder: "/faithhub/provider/beacon-builder",
};

const SERIES_TEMPLATES = [
  {
    id: "tpl-sermon",
    title: "Sermon campaign",
    subtitle: "Weekly theme arc with linked episodes and live follow prompts.",
    accent: "green" as const,
  },
  {
    id: "tpl-discipleship",
    title: "Discipleship class",
    subtitle: "Lesson-by-lesson structure with resources, prompts, and guided follow-up.",
    accent: "orange" as const,
  },
  {
    id: "tpl-devotional",
    title: "Devotional journey",
    subtitle: "Short daily or weekly reflections with reading plans and gentle reminders.",
    accent: "navy" as const,
  },
  {
    id: "tpl-seasonal",
    title: "Seasonal theme",
    subtitle: "Easter, Advent, fasting, missions, or conference season storytelling.",
    accent: "green" as const,
  },
  {
    id: "tpl-conference",
    title: "Conference track",
    subtitle: "Speaker roster, sessions, translated assets, and premium landing variants.",
    accent: "orange" as const,
  },
];

const COVER_OPTIONS = [
  {
    id: "cover-hope",
    name: "Cathedral Light",
    url: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "cover-prayer",
    name: "Prayer Circle",
    url: "https://images.unsplash.com/photo-1504051771394-dd2e66b2e08f?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "cover-scripture",
    name: "Scripture Study",
    url: "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "cover-stage",
    name: "Conference Stage",
    url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80",
  },
];

const SPEAKER_OPTIONS = [
  "Pastor Daniel M.",
  "Minister Ruth K.",
  "Dr. Lindiwe N.",
  "Worship Lead Ada",
  "Pastor Samuel A.",
  "Guest Teacher Noah P.",
];

const AUDIENCE_GROUPS = [
  "Followers",
  "New guests",
  "Young adults",
  "Family ministry",
  "Leadership team",
  "Supporters",
  "Regional campus groups",
];

const ACCESS_MODELS = [
  "Public",
  "Follower-first",
  "Members only",
  "Supporter resources",
  "Embargoed launch",
];

const LOCALE_OPTIONS = [
  { code: "en-UG", label: "English (Uganda)" },
  { code: "sw-UG", label: "Swahili (Uganda)" },
  { code: "fr-FR", label: "French" },
  { code: "ar", label: "Arabic" },
  { code: "pt", label: "Portuguese" },
];

const GRAPHIC_RULES = [
  "FaithHub Standard",
  "FaithHub Minimal Serif",
  "Conference Premium",
  "Revival Night",
  "Teaching Notes Overlay",
];

const EMBARGO_RULES = [
  "Publish immediately after approval",
  "Publish when at least 3 episodes are ready",
  "Publish on launch date only",
  "Manual launch by leadership",
];

const APPROVAL_FLOWS = [
  "Pastoral review ? editor sign-off ? publish",
  "Content lead only",
  "Leadership review board",
  "Multi-campus approval chain",
];

type StepKey =
  | "identity"
  | "brand"
  | "narrative"
  | "audience"
  | "localization"
  | "resources"
  | "publishing"
  | "readiness";

type PreviewMode = "desktop" | "mobile";

type Accent = "green" | "orange" | "navy";

type EpisodeStatus = "Mapped" | "Draft" | "Ready" | "Scheduled";

type EpisodeItem = {
  id: string;
  title: string;
  summary: string;
  theme: string;
  durationLabel: string;
  liveCount: number;
  status: EpisodeStatus;
};

type LocaleVariant = {
  code: string;
  title: string;
  description: string;
  artworkVariant: string;
  notesState: "Ready" | "Translating" | "Draft";
};

type ResourceItem = {
  id: string;
  type: "Reading plan" | "Discussion guide" | "Event link" | "Giving prompt" | "Beacon hook" | "Download";
  title: string;
  status: "Ready" | "Draft" | "Planned";
};

type SeriesDraft = {
  templateId: string;
  title: string;
  subtitle: string;
  description: string;
  scriptureTheme: string;
  promise: string;
  durationWindow: string;
  audienceFit: string;
  speakers: string[];
  coverId: string;
  trailerLabel: string;
  bannerStyle: string;
  graphicRule: string;
  accessModel: string;
  launchAudience: string[];
  followPromptsEnabled: boolean;
  reminderPromptsEnabled: boolean;
  supportersOnlyResources: boolean;
  featuredPlacement: boolean;
  locales: LocaleVariant[];
  resources: ResourceItem[];
  launchState: "Draft" | "In review" | "Scheduled" | "Published";
  launchDate: string;
  embargoRule: string;
  approvalFlow: string;
  notes: string;
  episodeTarget: number;
  episodes: EpisodeItem[];
  abCreativeEnabled: boolean;
  beaconHook: string;
};

const DEFAULT_EPISODES: EpisodeItem[] = [
  {
    id: "ep-1",
    title: "Week 1 · The Call to Hope",
    summary: "Set the series promise and begin with renewal, witness, and spiritual confidence.",
    theme: "Renewal",
    durationLabel: "55 min",
    liveCount: 1,
    status: "Ready",
  },
  {
    id: "ep-2",
    title: "Week 2 · Hope in the Wilderness",
    summary: "Address uncertainty, endurance, and faithful obedience under pressure.",
    theme: "Endurance",
    durationLabel: "60 min",
    liveCount: 1,
    status: "Mapped",
  },
  {
    id: "ep-3",
    title: "Week 3 · Healing and Restoration",
    summary: "Move into personal healing, prayer ministry, and practical support.",
    theme: "Healing",
    durationLabel: "70 min",
    liveCount: 2,
    status: "Draft",
  },
  {
    id: "ep-4",
    title: "Week 4 · Hope in Community",
    summary: "Focus on serving, community, care, and local mission response.",
    theme: "Community",
    durationLabel: "50 min",
    liveCount: 1,
    status: "Draft",
  },
  {
    id: "ep-5",
    title: "Week 5 · Witness and Courage",
    summary: "Build toward outward witness, boldness, and testimony.",
    theme: "Witness",
    durationLabel: "65 min",
    liveCount: 1,
    status: "Mapped",
  },
  {
    id: "ep-6",
    title: "Week 6 · Living the Hope",
    summary: "Land the series with commitments, next steps, and follow-through resources.",
    theme: "Next steps",
    durationLabel: "60 min",
    liveCount: 1,
    status: "Scheduled",
  },
];

const DEFAULT_LOCALES: LocaleVariant[] = [
  {
    code: "en-UG",
    title: "Practicing the Way of Hope",
    description: "A six-week teaching journey on faithful living, healing, and witness.",
    artworkVariant: "Hero A · English",
    notesState: "Ready",
  },
  {
    code: "sw-UG",
    title: "Kuishi Njia ya Tumaini",
    description: "Mfululizo wa wiki sita kuhusu matumaini, uponyaji, na ushuhuda.",
    artworkVariant: "Hero B · Swahili",
    notesState: "Translating",
  },
  {
    code: "fr-FR",
    title: "Vivre le chemin de l'espérance",
    description: "Une série de six semaines sur l'espérance, la guérison et le témoignage.",
    artworkVariant: "Hero C · French",
    notesState: "Draft",
  },
];

const DEFAULT_RESOURCES: ResourceItem[] = [
  {
    id: "res-1",
    type: "Reading plan",
    title: "6-week devotional reading plan",
    status: "Ready",
  },
  {
    id: "res-2",
    type: "Discussion guide",
    title: "Small-group discussion prompts",
    status: "Ready",
  },
  {
    id: "res-3",
    type: "Giving prompt",
    title: "Hope outreach giving moment",
    status: "Draft",
  },
  {
    id: "res-4",
    type: "Beacon hook",
    title: "Prelaunch teaser creative pack",
    status: "Planned",
  },
];

const STEPS: Array<{ key: StepKey; label: string }> = [
  { key: "identity", label: "Series Identity" },
  { key: "brand", label: "Brand & Media" },
  { key: "narrative", label: "Narrative Map" },
  { key: "audience", label: "Audience & Access" },
  { key: "localization", label: "Localization" },
  { key: "resources", label: "Resources & CTAs" },
  { key: "publishing", label: "Publishing" },
  { key: "readiness", label: "Readiness" },
];

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  navigateWithRouter(url);
}

function accentColor(accent: Accent) {
  if (accent === "orange") return EV_ORANGE;
  if (accent === "navy") return EV_NAVY;
  return EV_GREEN;
}

function scoreReadiness(draft: SeriesDraft) {
  const identityOk =
    draft.title.trim().length > 0 &&
    draft.subtitle.trim().length > 0 &&
    draft.description.trim().length > 0 &&
    draft.promise.trim().length > 0;
  const brandOk = Boolean(draft.coverId) && Boolean(draft.trailerLabel) && Boolean(draft.graphicRule);
  const narrativeOk = draft.episodes.length >= 3 && draft.episodeTarget > 0;
  const audienceOk = draft.launchAudience.length > 0 && Boolean(draft.accessModel);
  const localizationOk = draft.locales.length >= 2;
  const resourcesOk = draft.resources.length >= 2;
  const publishingOk = Boolean(draft.launchDate) && Boolean(draft.approvalFlow) && Boolean(draft.embargoRule);

  const checks = [identityOk, brandOk, narrativeOk, audienceOk, localizationOk, resourcesOk, publishingOk];
  const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  const assetGaps = [
    !brandOk ? "Hero art or trailer still needs attention" : null,
    !localizationOk ? "More locale variants are recommended" : null,
    draft.resources.some((r) => r.status !== "Ready") ? "Some resources are still draft/planned" : null,
  ].filter(Boolean) as string[];
  const confidence = score >= 90 ? "High" : score >= 75 ? "Good" : score >= 55 ? "At risk" : "Blocked";

  return {
    identityOk,
    brandOk,
    narrativeOk,
    audienceOk,
    localizationOk,
    resourcesOk,
    publishingOk,
    score,
    assetGaps,
    confidence,
  };
}

function Pill({
  tone = "neutral",
  children,
  className,
}: {
  tone?: "neutral" | "good" | "warn" | "danger" | "brand";
  children: React.ReactNode;
  className?: string;
}) {
  const cls =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "warn"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : tone === "danger"
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : tone === "brand"
            ? "border-transparent text-white"
            : "border-slate-200 bg-white text-slate-700";
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        cls,
        className,
      )}
      style={tone === "brand" ? { background: EV_GREEN } : undefined}
    >
      {children}
    </span>
  );
}

function SoftButton({
  children,
  onClick,
  className,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-800 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50",
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
  color = "green",
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  color?: "green" | "orange";
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-[12px] font-semibold text-white shadow-sm transition-opacity hover:opacity-95",
        className,
      )}
      style={{ background: color === "orange" ? EV_ORANGE : EV_GREEN }}
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
        "rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm transition-colors",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[14px] font-bold text-slate-900">{title}</div>
          {subtitle ? <div className="mt-1 text-[11px] text-slate-500">{subtitle}</div> : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-semibold text-slate-700">{children}</div>;
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 outline-none transition-colors focus:ring-2 focus:ring-[rgba(3,205,140,0.18)]"
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 outline-none transition-colors focus:ring-2 focus:ring-[rgba(3,205,140,0.18)]"
    />
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: EV_GREEN }}
      />
    </div>
  );
}

function ToggleTile({
  title,
  hint,
  checked,
  onChange,
}: {
  title: string;
  hint: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cx(
        "w-full rounded-3xl border p-3 text-left transition-colors",
        checked
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-200 bg-white hover:bg-slate-50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[12px] font-semibold text-slate-900">{title}</div>
          <div className="mt-1 text-[11px] text-slate-500">{hint}</div>
        </div>
        <span
          className={cx(
            "mt-0.5 flex h-6 w-10 items-center rounded-full border px-1 transition-colors",
            checked ? "justify-end border-emerald-500 bg-emerald-500" : "justify-start border-slate-300 bg-slate-100",
          )}
        >
          <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
        </span>
      </div>
    </button>
  );
}

function StepRail({
  step,
  setStep,
  readinessScore,
}: {
  step: StepKey;
  setStep: (next: StepKey) => void;
  readinessScore: number;
}) {
  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm xl:sticky xl:top-6">
      <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4">
        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">Series Builder</div>
        <div className="mt-2 text-[28px] font-black leading-none text-slate-900">{readinessScore}%</div>
        <div className="mt-1 text-[11px] text-slate-500">Series completeness score</div>
        <div className="mt-3">
          <ProgressBar value={readinessScore} />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {STEPS.map((item) => {
          const active = item.key === step;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setStep(item.key)}
              className={cx(
                "flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left text-[12px] font-semibold transition-colors",
                active
                  ? "border-emerald-300 bg-emerald-50 text-slate-900"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
              )}
            >
              <span>{item.label}</span>
              {active ? <ChevronRight className="h-4 w-4 text-emerald-700" /> : null}
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-[24px] border border-amber-200 bg-amber-50 p-4">
        <div className="text-[13px] font-bold text-slate-900">Quick handoff</div>
        <div className="mt-2 space-y-2">
          <SoftButton className="w-full justify-between" onClick={() => safeNav(ROUTES.episodeBuilder)}>
            Episode Builder <ChevronRight className="h-4 w-4" />
          </SoftButton>
          <SoftButton className="w-full justify-between" onClick={() => safeNav(ROUTES.liveBuilder)}>
            Live Builder <ChevronRight className="h-4 w-4" />
          </SoftButton>
          <SoftButton className="w-full justify-between" onClick={() => safeNav(ROUTES.audienceNotifications)}>
            Audience Notifications <ChevronRight className="h-4 w-4" />
          </SoftButton>
          <SoftButton className="w-full justify-between" onClick={() => safeNav(ROUTES.beaconBuilder)}>
            Beacon Builder <ChevronRight className="h-4 w-4" />
          </SoftButton>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{eyebrow}</div>
        <div className="mt-1 text-[18px] font-black text-slate-900">{title}</div>
        <div className="mt-1 text-[12px] text-slate-500">{subtitle}</div>
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

function SeriesLandingPreview({
  draft,
  previewMode,
  readinessScore,
}: {
  draft: SeriesDraft;
  previewMode: PreviewMode;
  readinessScore: number;
}) {
  const cover = COVER_OPTIONS.find((item) => item.id === draft.coverId) || COVER_OPTIONS[0];
  const readyEpisodes = draft.episodes.filter((ep) => ep.status === "Ready" || ep.status === "Scheduled").length;
  const nextEpisode = draft.episodes[0];

  if (previewMode === "mobile") {
    return (
      <div className="mx-auto w-full max-w-[320px] md:max-w-[360px] rounded-[34px] bg-slate-950 p-3 shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
        <div className="overflow-hidden rounded-[28px] bg-[#fcfcfc]">
          <div className="relative h-[620px] overflow-hidden">
            <div className="absolute left-1/2 top-3 h-2 w-24 -translate-x-1/2 rounded-full bg-slate-900" />
            <div className="h-[210px] overflow-hidden bg-slate-900">
              <img src={cover.url} alt={cover.name} className="h-full w-full object-cover opacity-90" />
            </div>
            <div className="relative -mt-14 px-4 pb-4">
              <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <Pill tone="brand">Series live</Pill>
                  <button className="text-[11px] font-semibold text-emerald-600" onClick={() => navigator.clipboard?.writeText(window.location.href)}>Share</button>
                </div>
                <div className="mt-3 text-[22px] font-black leading-tight text-slate-900">{draft.title}</div>
                <div className="mt-1 text-[12px] text-slate-500">{draft.subtitle}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Pill tone="good">{draft.accessModel}</Pill>
                  <Pill tone="neutral">{draft.locales.length} locales</Pill>
                  <Pill tone="warn">{readyEpisodes}/{draft.episodeTarget} ready</Pill>
                </div>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Next episode</div>
                  <div className="mt-2 text-[14px] font-bold text-slate-900">{nextEpisode?.title || "Episode coming soon"}</div>
                  <div className="mt-1 text-[11px] text-slate-500">{nextEpisode?.summary || "Prepare linked live session and notes."}</div>
                </div>
                <div className="mt-4 space-y-2">
                  {draft.resources.slice(0, 3).map((resource) => (
                    <div key={resource.id} className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
                      <div className="text-[11px] font-semibold text-slate-400">{resource.type}</div>
                      <div className="text-[12px] font-bold text-slate-900">{resource.title}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <PrimaryButton className="flex-1">Follow</PrimaryButton>
                  <button
                    type="button"
                    className="flex-1 rounded-2xl bg-amber-500 px-3 py-2 text-[12px] font-bold text-white"
                    style={{ background: EV_ORANGE }}
                    onClick={() => safeNav("/faithhub/provider/audience-notifications")}>
                    Notify me
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-700">
              Preview confidence · {readinessScore}% complete
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-[1.2fr_0.8fr]">
        <div className="relative min-h-[420px] overflow-hidden bg-slate-900">
          <img src={cover.url} alt={cover.name} className="h-full w-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/15 to-transparent" />
          <div className="absolute left-5 top-5 flex flex-wrap gap-2">
            <Pill tone="brand">
              <Sparkles className="h-3 w-3" /> FaithHub Series
            </Pill>
            <Pill tone="good">{draft.accessModel}</Pill>
            <Pill tone="warn">{readyEpisodes}/{draft.episodeTarget} ready</Pill>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <div className="text-[34px] font-black leading-[1.05]">{draft.title}</div>
            <div className="mt-2 max-w-[85%] text-[14px] text-white/85">{draft.subtitle}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {draft.launchAudience.slice(0, 3).map((audience) => (
                <span key={audience} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white">
                  {audience}
                </span>
              ))}
            </div>
            <div className="mt-5 flex gap-3">
              <button className="rounded-2xl px-4 py-2 text-[12px] font-bold text-white" style={{ background: EV_GREEN }} onClick={() => safeNav("/faithhub/provider/series-dashboard")}>
                Follow series
              </button>
              <button className="rounded-2xl px-4 py-2 text-[12px] font-bold text-white" style={{ background: EV_ORANGE }} onClick={() => safeNav("/faithhub/provider/audience-notifications")}>
                Get reminders
              </button>
            </div>
          </div>
        </div>
        <div className="bg-[#fafafa] p-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Episode sequence</div>
                <div className="mt-1 text-[14px] font-bold text-slate-900">Structured journey</div>
              </div>
              <Pill tone="neutral">{draft.episodes.length} episodes</Pill>
            </div>
            <div className="mt-3 space-y-2">
              {draft.episodes.slice(0, 4).map((episode, idx) => (
                <div key={episode.id} className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[11px] font-black text-slate-400">{String(idx + 1).padStart(2, "0")}</div>
                    <Pill tone={episode.status === "Ready" || episode.status === "Scheduled" ? "good" : "warn"}>{episode.status}</Pill>
                  </div>
                  <div className="mt-2 text-[13px] font-bold text-slate-900">{episode.title}</div>
                  <div className="mt-1 text-[11px] text-slate-500">{episode.theme} · {episode.durationLabel}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Resources & CTAs</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {draft.resources.slice(0, 4).map((resource) => (
                  <span key={resource.id} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700">
                    {resource.type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SeriesBuilderPage() {
  const [step, setStep] = useState<StepKey>("identity");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [seriesSearch, setSeriesSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [draft, setDraft] = useState<SeriesDraft>({
    templateId: "tpl-sermon",
    title: "Practicing the Way of Hope",
    subtitle: "A six-week teaching journey on faithful living, healing, and witness.",
    description:
      "Build a structured discipleship path that moves from renewal into healing, witness, and next-step commitment across live teaching, replay, and group resources.",
    scriptureTheme: "Romans 12 · Isaiah 61 · Matthew 5",
    promise: "A clear, hope-filled pathway for prayer, formation, and public witness.",
    durationWindow: "6 weeks · April to May",
    audienceFit: "Adults, young professionals, family ministry",
    speakers: ["Pastor Daniel M.", "Minister Ruth K."],
    coverId: "cover-hope",
    trailerLabel: "Series trailer cut · 45s",
    bannerStyle: "Immersive hero with layered scripture quote",
    graphicRule: GRAPHIC_RULES[2],
    accessModel: "Public",
    launchAudience: ["Followers", "New guests", "Young adults"],
    followPromptsEnabled: true,
    reminderPromptsEnabled: true,
    supportersOnlyResources: false,
    featuredPlacement: true,
    locales: DEFAULT_LOCALES,
    resources: DEFAULT_RESOURCES,
    launchState: "Draft",
    launchDate: "2026-04-20",
    embargoRule: EMBARGO_RULES[1],
    approvalFlow: APPROVAL_FLOWS[0],
    notes:
      "Keep Beacon teaser ready before episode one launches. Align all replays under the same visual treatment.",
    episodeTarget: 6,
    episodes: DEFAULT_EPISODES,
    abCreativeEnabled: true,
    beaconHook: "Create a teaser Beacon campaign 10 days before launch using hero art and trailer.",
  });

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const readiness = useMemo(() => scoreReadiness(draft), [draft]);
  const availableLocaleOptions = useMemo(
    () => LOCALE_OPTIONS.filter((locale) => !draft.locales.some((variant) => variant.code === locale.code)),
    [draft.locales],
  );

  const filteredSpeakers = useMemo(() => {
    const q = seriesSearch.trim().toLowerCase();
    if (!q) return SPEAKER_OPTIONS;
    return SPEAKER_OPTIONS.filter((speaker) => speaker.toLowerCase().includes(q));
  }, [seriesSearch]);

  const addEpisode = () => {
    const index = draft.episodes.length + 1;
    setDraft((current) => ({
      ...current,
      episodes: [
        ...current.episodes,
        {
          id: `ep-${Math.random().toString(16).slice(2, 8)}`,
          title: `Week ${index} · New Episode`,
          summary: "Add the episode purpose, live plan, and resource pack.",
          theme: "New theme",
          durationLabel: "60 min",
          liveCount: 0,
          status: "Draft",
        },
      ],
      episodeTarget: Math.max(current.episodeTarget, index),
    }));
    setToast("Episode added to the series map.");
  };

  const moveEpisode = (id: string, direction: "up" | "down") => {
    setDraft((current) => {
      const index = current.episodes.findIndex((episode) => episode.id === id);
      if (index < 0) return current;
      const nextIndex = direction === "up" ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= current.episodes.length) return current;
      const episodes = [...current.episodes];
      const [item] = episodes.splice(index, 1);
      episodes.splice(nextIndex, 0, item);
      return { ...current, episodes };
    });
  };

  const updateEpisode = (id: string, patch: Partial<EpisodeItem>) => {
    setDraft((current) => ({
      ...current,
      episodes: current.episodes.map((episode) =>
        episode.id === id ? { ...episode, ...patch } : episode,
      ),
    }));
  };

  const addLocaleVariant = () => {
    const next = availableLocaleOptions[0];
    if (!next) return;
    setDraft((current) => ({
      ...current,
      locales: [
        ...current.locales,
        {
          code: next.code,
          title: `${current.title} (${next.label})`,
          description: current.description,
          artworkVariant: `Localized art · ${next.label}`,
          notesState: "Draft",
        },
      ],
    }));
    setToast(`${next.label} locale added.`);
  };

  const addResource = () => {
    setDraft((current) => ({
      ...current,
      resources: [
        ...current.resources,
        {
          id: `res-${Math.random().toString(16).slice(2, 8)}`,
          type: "Download",
          title: "New downloadable asset",
          status: "Draft",
        },
      ],
    }));
    setToast("Resource block added.");
  };

  const activeTemplate = SERIES_TEMPLATES.find((template) => template.id === draft.templateId) || SERIES_TEMPLATES[0];

  const centerContent = useMemo(() => {
    if (step === "identity") {
      return (
        <div className="space-y-4">
          <Card
            title="Series identity canvas"
            subtitle="Define the name, promise, speaker lineup, scripture or theme, and central audience story."
            right={<Pill tone="brand">Premium identity</Pill>}
          >
            <SectionHeader
              eyebrow="Template presets"
              title="Start with a premium series structure"
              subtitle="Choose a base format and then shape the teaching engine around your ministry goal."
            />
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {SERIES_TEMPLATES.map((template) => {
                const active = template.id === draft.templateId;
                const color = accentColor(template.accent);
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setDraft((current) => ({ ...current, templateId: template.id }))}
                    className={cx(
                      "rounded-3xl border p-4 text-left transition-colors",
                      active ? "border-transparent shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50",
                    )}
                    style={active ? { background: `${color}12`, borderColor: `${color}44` } : undefined}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-[13px] font-bold text-slate-900">{template.title}</div>
                      {active ? <BadgeCheck className="h-4 w-4" style={{ color }} /> : null}
                    </div>
                    <div className="mt-2 text-[11px] leading-5 text-slate-500">{template.subtitle}</div>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div>
                <FieldLabel>Series title</FieldLabel>
                <TextInput value={draft.title} onChange={(title) => setDraft((current) => ({ ...current, title }))} />
              </div>
              <div>
                <FieldLabel>Subtitle</FieldLabel>
                <TextInput value={draft.subtitle} onChange={(subtitle) => setDraft((current) => ({ ...current, subtitle }))} />
              </div>
              <div className="lg:col-span-2">
                <FieldLabel>Description</FieldLabel>
                <TextArea value={draft.description} onChange={(description) => setDraft((current) => ({ ...current, description }))} rows={4} />
              </div>
              <div>
                <FieldLabel>Key scripture or theme</FieldLabel>
                <TextInput
                  value={draft.scriptureTheme}
                  onChange={(scriptureTheme) => setDraft((current) => ({ ...current, scriptureTheme }))}
                  placeholder="Romans 12 · Isaiah 61 · Matthew 5"
                />
              </div>
              <div>
                <FieldLabel>Audience promise</FieldLabel>
                <TextInput
                  value={draft.promise}
                  onChange={(promise) => setDraft((current) => ({ ...current, promise }))}
                  placeholder="What transformation or value does the series promise?"
                />
              </div>
              <div>
                <FieldLabel>Duration window</FieldLabel>
                <TextInput value={draft.durationWindow} onChange={(durationWindow) => setDraft((current) => ({ ...current, durationWindow }))} />
              </div>
              <div>
                <FieldLabel>Audience fit</FieldLabel>
                <TextInput value={draft.audienceFit} onChange={(audienceFit) => setDraft((current) => ({ ...current, audienceFit }))} />
              </div>
            </div>
          </Card>

          <Card
            title="Speaker lineup"
            subtitle="Build the presenter identity and keep it reusable across every connected episode and live session."
            right={<Pill tone="good">{draft.speakers.length} speakers</Pill>}
          >
            <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <FieldLabel>Selected speakers</FieldLabel>
                <div className="mt-2 flex flex-wrap gap-2">
                  {draft.speakers.map((speaker) => (
                    <button
                      key={speaker}
                      type="button"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          speakers: current.speakers.filter((item) => item !== speaker),
                        }))
                      }
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700"
                    >
                      {speaker}
                      <X className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <FieldLabel>Find more speakers</FieldLabel>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={seriesSearch}
                    onChange={(e) => setSeriesSearch(e.target.value)}
                    placeholder="Search speakers"
                    className="w-full rounded-2xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-[12px] text-slate-900 outline-none"
                  />
                </div>
                <div className="mt-2 flex max-h-[180px] flex-col gap-2 overflow-y-auto pr-1">
                  {filteredSpeakers.map((speaker) => {
                    const active = draft.speakers.includes(speaker);
                    return (
                      <button
                        key={speaker}
                        type="button"
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            speakers: active
                              ? current.speakers.filter((item) => item !== speaker)
                              : [...current.speakers, speaker],
                          }))
                        }
                        className={cx(
                          "flex items-center justify-between rounded-2xl border px-3 py-2 text-[12px] font-semibold transition-colors",
                          active ? "border-emerald-300 bg-emerald-50 text-slate-900" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                        )}
                      >
                        <span>{speaker}</span>
                        {active ? <Check className="h-4 w-4 text-emerald-700" /> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    if (step === "brand") {
      return (
        <div className="space-y-4">
          <Card
            title="Brand and media panel"
            subtitle="Series artwork, trailer, cover variants, banners, and reusable graphic rules that travel into lives and replays."
            right={<Pill tone="brand">Brand system</Pill>}
          >
            <SectionHeader
              eyebrow="Hero assets"
              title="Choose a series cover and reusable media treatment"
              subtitle="A premium series should carry one visual language across landing pages, live overlays, and replay covers."
            />
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {COVER_OPTIONS.map((cover) => {
                const active = draft.coverId === cover.id;
                return (
                  <button
                    key={cover.id}
                    type="button"
                    onClick={() => setDraft((current) => ({ ...current, coverId: cover.id }))}
                    className={cx(
                      "overflow-hidden rounded-[26px] border text-left transition-colors",
                      active ? "border-emerald-300 ring-2 ring-[rgba(3,205,140,0.18)]" : "border-slate-200 bg-white hover:bg-slate-50",
                    )}
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-slate-200">
                      <img src={cover.url} alt={cover.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-3">
                      <div className="text-[12px] font-bold text-slate-900">{cover.name}</div>
                      <div className="mt-1 text-[11px] text-slate-500">Hero, replay cover, and featured shelf treatment.</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div>
                <FieldLabel>Trailer / teaser label</FieldLabel>
                <TextInput value={draft.trailerLabel} onChange={(trailerLabel) => setDraft((current) => ({ ...current, trailerLabel }))} />
              </div>
              <div>
                <FieldLabel>Banner style</FieldLabel>
                <TextInput value={draft.bannerStyle} onChange={(bannerStyle) => setDraft((current) => ({ ...current, bannerStyle }))} />
              </div>
              <div className="lg:col-span-2">
                <FieldLabel>Graphic rule package</FieldLabel>
                <div className="mt-2 flex flex-wrap gap-2">
                  {GRAPHIC_RULES.map((rule) => {
                    const active = draft.graphicRule === rule;
                    return (
                      <button
                        key={rule}
                        type="button"
                        onClick={() => setDraft((current) => ({ ...current, graphicRule: rule }))}
                        className={cx(
                          "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                          active ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                        )}
                      >
                        {rule}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card
              title="Creative variants"
              subtitle="Build premium A/B creative tests without rebuilding the series from scratch."
              right={<Pill tone={draft.abCreativeEnabled ? "good" : "neutral"}>{draft.abCreativeEnabled ? "A/B on" : "A/B off"}</Pill>}
            >
              <div className="space-y-3">
                <ToggleTile
                  title="Enable artwork A/B testing"
                  hint="Test alternate hero art, banner copy, or quote treatments across discovery surfaces."
                  checked={draft.abCreativeEnabled}
                  onChange={(abCreativeEnabled) => setDraft((current) => ({ ...current, abCreativeEnabled }))}
                />
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Variant set</div>
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-3">
                      <div className="text-[12px] font-bold text-slate-900">Cover A · Sanctuary Light</div>
                      <div className="mt-1 text-[11px] text-slate-500">For followers and returning viewers.</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-3">
                      <div className="text-[12px] font-bold text-slate-900">Cover B · Scripture Close-up</div>
                      <div className="mt-1 text-[11px] text-slate-500">For new guests and broad discovery shelves.</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card
              title="Launch-ready media summary"
              subtitle="See how the series brand package will travel into live overlays, replays, and Beacon prelaunch promotion."
            >
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-[12px] font-bold text-slate-900">
                    <ImageIcon className="h-4 w-4" /> Cover + banner system
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Reusable across series landing page, replay shelves, and episode previews.</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-[12px] font-bold text-slate-900">
                    <PlayCircle className="h-4 w-4" /> Trailer / teaser support
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Perfect for prelaunch announcements and Beacon awareness campaigns.</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-[12px] font-bold text-slate-900">
                    <Layers className="h-4 w-4" /> Graphic rule inheritance
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Linked live sessions and replays can inherit lower-thirds, typography, and scripture treatments.</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      );
    }

    if (step === "narrative") {
      return (
        <div className="space-y-4">
          <Card
            title="Narrative and progression planner"
            subtitle="Map the teaching arc, episode sequence, key discussion themes, and the way each episode supports the whole journey."
            right={<Pill tone="good">Drag-style ordering</Pill>}
          >
            <SectionHeader
              eyebrow="Episode map"
              title="Visual teaching progression"
              subtitle="Keep the series coherent from first promise to final next-step moment."
              right={<PrimaryButton color="orange" onClick={addEpisode}><Plus className="h-4 w-4" /> Add episode</PrimaryButton>}
            />
            <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-3">
                {draft.episodes.map((episode, index) => (
                  <div key={episode.id} className="rounded-[26px] border border-slate-200 bg-white p-3">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex min-w-0 gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-black text-white">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <GripVertical className="h-4 w-4 text-slate-400" />
                            <input
                              value={episode.title}
                              onChange={(e) => updateEpisode(episode.id, { title: e.target.value })}
                              className="min-w-0 flex-1 rounded-xl border border-transparent bg-transparent px-2 py-1 text-[13px] font-bold text-slate-900 outline-none hover:border-slate-200 focus:border-emerald-300"
                            />
                            <Pill tone={episode.status === "Ready" || episode.status === "Scheduled" ? "good" : "warn"}>{episode.status}</Pill>
                          </div>
                          <textarea
                            value={episode.summary}
                            onChange={(e) => updateEpisode(episode.id, { summary: e.target.value })}
                            rows={2}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-700 outline-none focus:ring-2 focus:ring-[rgba(247,127,0,0.18)]"
                          />
                          <div className="mt-3 grid gap-2 md:grid-cols-3">
                            <div>
                              <FieldLabel>Theme</FieldLabel>
                              <TextInput value={episode.theme} onChange={(theme) => updateEpisode(episode.id, { theme })} />
                            </div>
                            <div>
                              <FieldLabel>Duration</FieldLabel>
                              <TextInput value={episode.durationLabel} onChange={(durationLabel) => updateEpisode(episode.id, { durationLabel })} />
                            </div>
                            <div>
                              <FieldLabel>Live Sessions linked</FieldLabel>
                              <TextInput
                                value={String(episode.liveCount)}
                                onChange={(next) => updateEpisode(episode.id, { liveCount: Number(next.replace(/\D/g, "")) || 0 })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <SoftButton onClick={() => moveEpisode(episode.id, "up")} disabled={index === 0}>
                          <ChevronLeft className="h-4 w-4 rotate-90" />
                        </SoftButton>
                        <SoftButton onClick={() => moveEpisode(episode.id, "down")} disabled={index === draft.episodes.length - 1}>
                          <ChevronRight className="h-4 w-4 rotate-90" />
                        </SoftButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
                  <div className="mt-3 space-y-2">
                    {draft.episodes.map((episode, index) => (
                      <div key={episode.id} className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[12px] font-bold text-slate-900">{String(index + 1).padStart(2, "0")} · {episode.theme}</div>
                          <span className="text-[11px] font-semibold text-slate-500">{episode.durationLabel}</span>
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500">{episode.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
                  <div className="mt-3 space-y-2">
                    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                      <div className="text-[12px] font-bold text-slate-900">Episode target</div>
                      <div className="mt-2 text-[28px] font-black leading-[1.04] tracking-[-0.03em] text-slate-900 dark:text-slate-100 sm:text-[34px] lg:text-[40px]">{draft.episodes.length}/{draft.episodeTarget}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                      <div className="text-[12px] font-bold text-slate-900">Ready or scheduled</div>
                      <div className="mt-1 text-[24px] font-black text-slate-900">
                        {draft.episodes.filter((episode) => episode.status === "Ready" || episode.status === "Scheduled").length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    if (step === "audience") {
      return (
        <div className="space-y-4">
          <Card
            title="Audience and access settings"
            subtitle="Decide who sees the series first, how people follow it, and how access behaves across discovery, reminders, and supporter resources."
            right={<Pill tone="brand">Targeted rollout</Pill>}
          >
            <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
              <div>
                <FieldLabel>Access model</FieldLabel>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ACCESS_MODELS.map((mode) => {
                    const active = draft.accessModel === mode;
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setDraft((current) => ({ ...current, accessModel: mode }))}
                        className={cx(
                          "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                          active ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                        )}
                      >
                        {mode}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <FieldLabel>Priority audience groups</FieldLabel>
                <div className="mt-2 flex flex-wrap gap-2">
                  {AUDIENCE_GROUPS.map((group) => {
                    const active = draft.launchAudience.includes(group);
                    return (
                      <button
                        key={group}
                        type="button"
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            launchAudience: active
                              ? current.launchAudience.filter((item) => item !== group)
                              : [...current.launchAudience, group],
                          }))
                        }
                        className={cx(
                          "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                          active ? "border-amber-300 bg-amber-50 text-amber-800" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                        )}
                      >
                        {group}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
              <ToggleTile
                title="Follow prompts enabled"
                hint="Encourage audiences to follow the series before launch and after each episode."
                checked={draft.followPromptsEnabled}
                onChange={(followPromptsEnabled) => setDraft((current) => ({ ...current, followPromptsEnabled }))}
              />
              <ToggleTile
                title="Reminder prompts enabled"
                hint="Allow notification journeys to use the series as a first-class entry point."
                checked={draft.reminderPromptsEnabled}
                onChange={(reminderPromptsEnabled) => setDraft((current) => ({ ...current, reminderPromptsEnabled }))}
              />
              <ToggleTile
                title="Supporter-only resources"
                hint="Keep premium notes or discussion files reserved for supporters or members."
                checked={draft.supportersOnlyResources}
                onChange={(supportersOnlyResources) => setDraft((current) => ({ ...current, supportersOnlyResources }))}
              />
              <ToggleTile
                title="Featured placement"
                hint="Eligible for promoted discovery slots and launch-week home rails."
                checked={draft.featuredPlacement}
                onChange={(featuredPlacement) => setDraft((current) => ({ ...current, featuredPlacement }))}
              />
            </div>
          </Card>
        </div>
      );
    }

    if (step === "localization") {
      return (
        <div className="space-y-4">
          <Card
            title="Localization workspace"
            subtitle="Create premium multi-language titles, descriptions, art variants, and translated metadata that can power clean regional discovery."
            right={<Pill tone="brand">{draft.locales.length} locale variants</Pill>}
          >
            <SectionHeader
              eyebrow="Localized landing pages"
              title="One series, many regional expressions"
              subtitle="Keep metadata, art, and resource readiness visible per locale."
              right={<PrimaryButton color="orange" onClick={addLocaleVariant}><Plus className="h-4 w-4" /> Add locale</PrimaryButton>}
            />
            <div className="mt-4 space-y-3">
              {draft.locales.map((variant) => {
                const localeMeta = LOCALE_OPTIONS.find((locale) => locale.code === variant.code);
                return (
                  <div key={variant.code} className="rounded-[26px] border border-slate-200 bg-white p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Pill tone="good">{localeMeta?.label || variant.code}</Pill>
                          <Pill tone={variant.notesState === "Ready" ? "good" : variant.notesState === "Translating" ? "warn" : "neutral"}>{variant.notesState}</Pill>
                        </div>
                        <div className="mt-3 grid gap-3 lg:grid-cols-2">
                          <div>
                            <FieldLabel>Localized title</FieldLabel>
                            <TextInput
                              value={variant.title}
                              onChange={(title) =>
                                setDraft((current) => ({
                                  ...current,
                                  locales: current.locales.map((item) =>
                                    item.code === variant.code ? { ...item, title } : item,
                                  ),
                                }))
                              }
                            />
                          </div>
                          <div>
                            <FieldLabel>Artwork variant</FieldLabel>
                            <TextInput
                              value={variant.artworkVariant}
                              onChange={(artworkVariant) =>
                                setDraft((current) => ({
                                  ...current,
                                  locales: current.locales.map((item) =>
                                    item.code === variant.code ? { ...item, artworkVariant } : item,
                                  ),
                                }))
                              }
                            />
                          </div>
                          <div className="lg:col-span-2">
                            <FieldLabel>Localized description</FieldLabel>
                            <TextArea
                              value={variant.description}
                              onChange={(description) =>
                                setDraft((current) => ({
                                  ...current,
                                  locales: current.locales.map((item) =>
                                    item.code === variant.code ? { ...item, description } : item,
                                  ),
                                }))
                              }
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setDraft((current) => ({
                              ...current,
                              locales: current.locales.filter((item) => item.code !== variant.code),
                            }))
                          }
                          className="rounded-2xl border border-slate-200 px-3 py-2 text-[12px] font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                          disabled={draft.locales.length <= 1}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      );
    }

    if (step === "resources") {
      return (
        <div className="space-y-4">
          <Card
            title="Series resources and CTAs"
            subtitle="Attach reading plans, prompts, notes, event links, giving moments, and Beacon promotion hooks that travel with the full series."
            right={<PrimaryButton color="orange" onClick={addResource}><Plus className="h-4 w-4" /> Add resource</PrimaryButton>}
          >
            <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-3">
                {draft.resources.map((resource) => (
                  <div key={resource.id} className="rounded-[24px] border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Pill tone="neutral">{resource.type}</Pill>
                          <Pill tone={resource.status === "Ready" ? "good" : resource.status === "Draft" ? "warn" : "neutral"}>{resource.status}</Pill>
                        </div>
                        <div className="mt-3">
                          <FieldLabel>Resource title</FieldLabel>
                          <TextInput
                            value={resource.title}
                            onChange={(title) =>
                              setDraft((current) => ({
                                ...current,
                                resources: current.resources.map((item) =>
                                  item.id === resource.id ? { ...item, title } : item,
                                ),
                              }))
                            }
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            resources: current.resources.filter((item) => item.id !== resource.id),
                          }))
                        }
                        className="rounded-2xl border border-slate-200 px-3 py-2 text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
                  <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Conversion hooks</div>
                  <div className="mt-3 space-y-3">
                    <ToggleTile
                      title="Series reminder prompts"
                      hint="Allow notifications and countdown journeys to start at the series layer."
                      checked={draft.reminderPromptsEnabled}
                      onChange={(reminderPromptsEnabled) => setDraft((current) => ({ ...current, reminderPromptsEnabled }))}
                    />
                    <ToggleTile
                      title="Featured placement + launch rail"
                      hint="Eligible for launch-week spotlight across FaithHub discovery surfaces."
                      checked={draft.featuredPlacement}
                      onChange={(featuredPlacement) => setDraft((current) => ({ ...current, featuredPlacement }))}
                    />
                  </div>
                </div>
                <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
                  <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Beacon promotion hook</div>
                  <div className="mt-2 text-[12px] font-bold text-slate-900">Linked prelaunch campaign</div>
                  <TextArea
                    value={draft.beaconHook}
                    onChange={(beaconHook) => setDraft((current) => ({ ...current, beaconHook }))}
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    if (step === "publishing") {
      return (
        <div className="space-y-4">
          <Card
            title="Publishing and approval flow"
            subtitle="Manage draft state, internal review, launch date, embargo rules, and publication confidence before the series becomes discoverable."
            right={<Pill tone={draft.launchState === "Published" ? "good" : draft.launchState === "Scheduled" ? "warn" : "neutral"}>{draft.launchState}</Pill>}
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <FieldLabel>Launch state</FieldLabel>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["Draft", "In review", "Scheduled", "Published"] as const).map((state) => {
                    const active = draft.launchState === state;
                    return (
                      <button
                        key={state}
                        type="button"
                        onClick={() => setDraft((current) => ({ ...current, launchState: state }))}
                        className={cx(
                          "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                          active ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                        )}
                      >
                        {state}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <FieldLabel>Launch date</FieldLabel>
                <TextInput value={draft.launchDate} onChange={(launchDate) => setDraft((current) => ({ ...current, launchDate }))} />
              </div>
              <div>
                <FieldLabel>Embargo rule</FieldLabel>
                <select
                  value={draft.embargoRule}
                  onChange={(e) => setDraft((current) => ({ ...current, embargoRule: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-900 outline-none"
                >
                  {EMBARGO_RULES.map((rule) => (
                    <option key={rule} value={rule}>{rule}</option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Approval flow</FieldLabel>
                <select
                  value={draft.approvalFlow}
                  onChange={(e) => setDraft((current) => ({ ...current, approvalFlow: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-900 outline-none"
                >
                  {APPROVAL_FLOWS.map((flow) => (
                    <option key={flow} value={flow}>{flow}</option>
                  ))}
                </select>
              </div>
              <div className="lg:col-span-2">
                <FieldLabel>Internal notes</FieldLabel>
                <TextArea value={draft.notes} onChange={(notes) => setDraft((current) => ({ ...current, notes }))} rows={4} />
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Card
          title="Performance readiness area"
          subtitle="Forecast content completeness, episode count health, asset gaps, and launch confidence before publication."
          right={<Pill tone={readiness.confidence === "High" ? "good" : readiness.confidence === "Good" ? "warn" : "danger"}>{readiness.confidence}</Pill>}
        >
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-3">
              <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
                <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Series completeness</div>
                <div className="mt-2 text-[34px] font-black text-slate-900">{readiness.score}%</div>
                <div className="mt-3"><ProgressBar value={readiness.score} /></div>
              </div>
              <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
                <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Asset gaps</div>
                <div className="mt-3 space-y-2">
                  {readiness.assetGaps.length ? readiness.assetGaps.map((gap) => (
                    <div key={gap} className="rounded-2xl border border-amber-200 bg-white px-3 py-3 text-[12px] text-slate-700">{gap}</div>
                  )) : (
                    <div className="rounded-2xl border border-emerald-200 bg-white px-3 py-3 text-[12px] text-emerald-700">No blocking asset gaps detected.</div>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="rounded-[26px] border border-slate-200 bg-white p-4">
                <div className="text-[14px] font-bold text-slate-900">Launch confidence board</div>
                <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                    <div className="text-[11px] text-slate-400">Episode count health</div>
                    <div className="mt-1 text-[22px] font-black text-slate-900">{draft.episodes.length}/{draft.episodeTarget}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                    <div className="text-[11px] text-slate-400">Locale variants</div>
                    <div className="mt-1 text-[22px] font-black text-slate-900">{draft.locales.length}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                    <div className="text-[11px] text-slate-400">Resource blocks</div>
                    <div className="mt-1 text-[22px] font-black text-slate-900">{draft.resources.length}</div>
                  </div>
                </div>
              </div>
              <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
                <div className="text-[14px] font-bold text-slate-900">Native cross-links</div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="text-[12px] font-bold text-slate-900">Episode Builder</div>
                    <div className="mt-1 text-[11px] text-slate-500">Shape each episode with resources, live sessions, and replay expectations.</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="text-[12px] font-bold text-slate-900">Live Builder</div>
                    <div className="mt-1 text-[11px] text-slate-500">Create linked Live Sessions under this series and preserve the parent relationship.</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="text-[12px] font-bold text-slate-900">Audience Notifications</div>
                    <div className="mt-1 text-[11px] text-slate-500">Launch reminder journeys directly from the series identity and launch plan.</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="text-[12px] font-bold text-slate-900">Beacon Builder</div>
                    <div className="mt-1 text-[11px] text-slate-500">Promote the series before the first replay is published using teaser creative and metadata.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }, [
    step,
    seriesSearch,
    filteredSpeakers,
    draft,
    previewMode,
    readiness,
    availableLocaleOptions,
  ]);

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-slate-900">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10">
        <div className="rounded-[34px] border border-slate-200 bg-white px-5 py-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                <button className="hover:text-slate-700" onClick={() => safeNav(ROUTES.providerDashboard)}>
                  Provider Dashboard
                </button>
                <ChevronRight className="h-4 w-4" />
                <span className="font-semibold text-slate-700">Series Builder</span>
              </div>
              <div className="mt-2 text-[38px] font-black leading-none tracking-[-0.03em] text-slate-900">
                Series Builder
              </div>
              <div className="mt-2 max-w-[920px] text-[14px] text-slate-500">
                Premium provider teaching workflow inspired by the creator base layout — now rebuilt for Series, Episodes, linked Live Sessions, localized discovery, and Beacon-ready promotion.
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Pill tone="brand"><BookOpen className="h-3 w-3" /> Series engine</Pill>
                <Pill tone="good"><BadgeCheck className="h-3 w-3" /> Multi-language ready</Pill>
                <Pill tone="warn"><Megaphone className="h-3 w-3" /> Beacon-linked</Pill>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <SoftButton onClick={() => setToast("Series draft copied.")}> <Copy className="h-4 w-4" /> Duplicate draft</SoftButton>
              <SoftButton onClick={() => setToast("Series preview opened.")}> <Eye className="h-4 w-4" /> Preview series</SoftButton>
              <SoftButton onClick={() => setToast("Series draft saved.")}>Save series draft</SoftButton>
              <PrimaryButton color="orange" onClick={addEpisode}><Plus className="h-4 w-4" /> Add episode</PrimaryButton>
              <PrimaryButton onClick={() => setToast("Series submitted to publishing flow.")}><Zap className="h-4 w-4" /> Publish series</PrimaryButton>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)_390px]">
          <div className="xl:sticky xl:top-6 xl:self-start">
            <StepRail step={step} setStep={setStep} readinessScore={readiness.score} />
          </div>

          <div className="space-y-4">{centerContent}</div>

          <div className="hidden xl:block xl:sticky xl:top-6 xl:self-start">
            <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[14px] font-bold text-slate-900">Series preview</div>
                  <div className="mt-1 text-[11px] text-slate-500">Embedded landing-page preview updates as the series is configured.</div>
                </div>
                <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("desktop")}
                    className={cx(
                      "rounded-xl px-3 py-1.5 text-[11px] font-bold transition-colors",
                      previewMode === "desktop" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-white",
                    )}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("mobile")}
                    className={cx(
                      "rounded-xl px-3 py-1.5 text-[11px] font-bold transition-colors",
                      previewMode === "mobile" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-white",
                    )}
                  >
                    Mobile
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <SeriesLandingPreview draft={draft} previewMode={previewMode} readinessScore={readiness.score} />
              </div>
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] font-semibold text-emerald-700">
                FaithHub preview
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 xl:hidden">
          <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[14px] font-bold text-slate-900">Series preview</div>
                <div className="mt-1 text-[11px] text-slate-500">Preview the series landing experience on desktop or mobile.</div>
              </div>
              <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop")}
                  className={cx(
                    "rounded-xl px-3 py-1.5 text-[11px] font-bold transition-colors",
                    previewMode === "desktop" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-white",
                  )}
                >
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile")}
                  className={cx(
                    "rounded-xl px-3 py-1.5 text-[11px] font-bold transition-colors",
                    previewMode === "mobile" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-white",
                  )}
                >
                  Mobile
                </button>
              </div>
            </div>
            <div className="mt-4">
              <SeriesLandingPreview draft={draft} previewMode={previewMode} readinessScore={readiness.score} />
            </div>
          </div>
        </div>
      </div>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-950 px-4 py-2 text-[12px] font-semibold text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}







