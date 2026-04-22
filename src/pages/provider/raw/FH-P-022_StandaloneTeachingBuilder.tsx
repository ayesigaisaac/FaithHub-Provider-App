// @ts-nocheck
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Globe2,
  Image as ImageIcon,
  Languages,
  Layers,
  Link2,
  Lock,
  Megaphone,
  Mic,
  PlayCircle,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import { navigateWithRouter } from "@/navigation/routerNavigate";
import { ProviderPageTitle } from "@/components/provider/ProviderPageTitle";
import { ProviderSurfaceCard } from "@/components/provider/ProviderSurfaceCard";

/**
 * Provider — Standalone Teaching Builder
 * ------------------------------------------------
 * Premium creator-style page for building sermons/teachings that do not
 * belong to any Series or Episode while still supporting Live Sessions,
 * post-live packaging, clips, reviews, giving, and Beacon promotion.
 *
 * Key product rules represented here
 * - True no-Series / no-Episode publishing path.
 * - Live-first and upload-first creation can start from the same page.
 * - Cross-links to events, giving, charity crowdfunding, FaithMart, and Beacon
 *   remain optional and do not create a parent-content dependency.
 * - Standalone teachings can later migrate into a Series or become a new Series.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#0f172a";

const ROUTES = {
  liveBuilder: "/faithhub/provider/live-builder",
  postLivePublishing: "/faithhub/provider/post-live-publishing",
  replaysAndClips: "/faithhub/provider/replays-and-clips",
  beaconBuilder: "/faithhub/provider/beacon-builder",
};

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

function safeNav(url: string) {
  navigateWithRouter(url);
}

const TEACHING_COVERS = [
  {
    id: "cover-sanctuary",
    name: "Sanctuary Light",
    url: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "cover-bible",
    name: "Scripture Table",
    url: "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "cover-prayer",
    name: "Prayer Circle",
    url: "https://images.unsplash.com/photo-1504051771394-dd2e66b2e08f?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "cover-podium",
    name: "Teaching Platform",
    url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80",
  },
];

const FORMAT_MODES = [
  {
    id: "live-first",
    title: "Live-first",
    subtitle: "Start from the live experience and let the replay package inherit the teaching shell.",
    accent: "green" as const,
  },
  {
    id: "upload-first",
    title: "Upload-first",
    subtitle: "Prepare a polished teaching package first, then decide if a linked live follow-up is needed.",
    accent: "orange" as const,
  },
  {
    id: "audio-first",
    title: "Audio-first",
    subtitle: "For podcasts, devotionals, prayer reflections, and voice-led teachings.",
    accent: "navy" as const,
  },
  {
    id: "video-first",
    title: "Video-first",
    subtitle: "For recorded teachings, studio content, and pre-produced sermon drops.",
    accent: "green" as const,
  },
  {
    id: "text-plus-resource",
    title: "Text + resource",
    subtitle: "For sermon notes, reading plans, outlines, handouts, and downloadable teaching packs.",
    accent: "orange" as const,
  },
];

const SPEAKER_OPTIONS = [
  "Pastor Daniel M.",
  "Minister Ruth K.",
  "Bishop Grace L.",
  "Evangelist Naomi S.",
  "Teacher Samuel A.",
  "Guest Speaker Joshua P.",
];

const MINISTRY_CONTEXTS = [
  "Sunday service",
  "Midweek teaching",
  "Prayer night",
  "Youth gathering",
  "Leadership formation",
  "Conference message",
  "Online devotional",
];

const AUDIENCE_OPTIONS = [
  "Open to everyone",
  "Followers first",
  "Young adults",
  "Family ministry",
  "Supporters",
  "Leaders only",
  "Regional audience",
];

const VISIBILITY_OPTIONS = [
  "Public",
  "Follower-first",
  "Supporter-only resources",
  "Private / invite only",
  "Embargoed release",
];

const REGION_OPTIONS = [
  "Global",
  "East Africa",
  "West Africa",
  "Europe",
  "North America",
  "Institution campuses only",
];

const LANGUAGE_OPTIONS = [
  { code: "en-UG", label: "English (Uganda)" },
  { code: "sw-UG", label: "Swahili (Uganda)" },
  { code: "fr-FR", label: "French" },
  { code: "ar", label: "Arabic" },
  { code: "pt", label: "Portuguese" },
];

const REVIEW_POLICIES = [
  "Reviews allowed after publish",
  "Comments only for followers",
  "Leader moderation before comments appear",
  "Reviews disabled",
];

const CROSS_LINK_TYPES = [
  { key: "event", label: "Related event", helper: "Attach a retreat, service, class, or conference page." },
  { key: "giving", label: "Giving campaign", helper: "Surface a standard fund or special giving appeal." },
  { key: "crowdfund", label: "Charity crowdfund", helper: "Tie the teaching to a crowdfunding story and live progress." },
  { key: "faithmart", label: "FaithMart item", helper: "Attach a book, devotional pack, merch item, or bundle." },
  { key: "beacon", label: "Beacon promotion", helper: "Prepare a teaser, replay boost, or awareness campaign." },
] as const;

const MIGRATION_MODES = [
  {
    id: "stay-standalone",
    title: "Keep as standalone",
    subtitle: "Best for one-off sermons, announcements, and teaching drops that should remain independent.",
  },
  {
    id: "new-series",
    title: "Convert into new Series",
    subtitle: "Promote this teaching into the anchor episode of a new Series later, without losing replay or clip history.",
  },
  {
    id: "insert-existing",
    title: "Insert into existing Series",
    subtitle: "Attach this teaching to an existing teaching campaign when the ministry decides it belongs there.",
  },
] as const;

const CONTENT_ASSET_LIBRARY = [
  {
    id: "asset-hero",
    type: "Artwork",
    name: "Hero artwork · Sanctuary Light",
    status: "Ready" as const,
    hint: "Landing image, replay cover, and promo thumbnail treatment.",
  },
  {
    id: "asset-transcript",
    type: "Transcript",
    name: "Teaching transcript",
    status: "Draft" as const,
    hint: "Searchable transcript for replay, clips, and accessibility.",
  },
  {
    id: "asset-notes",
    type: "Notes",
    name: "Sermon notes pack",
    status: "Ready" as const,
    hint: "Outline, scripture references, and next-step prompts.",
  },
  {
    id: "asset-slides",
    type: "Slides",
    name: "Presentation slides",
    status: "Needs review" as const,
    hint: "Deck, discussion prompts, and lower-third callouts.",
  },
  {
    id: "asset-guide",
    type: "Guide",
    name: "Discussion and reflection guide",
    status: "Draft" as const,
    hint: "Family or group follow-up handout.",
  },
];

type StepKey =
  | "identity"
  | "format"
  | "package"
  | "live"
  | "discovery"
  | "links"
  | "migration"
  | "readiness";

type PreviewMode = "desktop" | "mobile";
type Accent = "green" | "orange" | "navy";
type FormatMode = (typeof FORMAT_MODES)[number]["id"];
type VisibilityMode = (typeof VISIBILITY_OPTIONS)[number];
type MigrationMode = (typeof MIGRATION_MODES)[number]["id"];

type LocaleVariant = {
  code: string;
  title: string;
  state: "Ready" | "Translating" | "Draft";
};

type ContentAssetState = "Ready" | "Draft" | "Needs review";

type ContentAsset = {
  id: string;
  type: string;
  name: string;
  status: ContentAssetState;
  hint: string;
};

type LinkState = {
  enabled: boolean;
  label: string;
  status: "Planned" | "Ready" | "Draft";
};

type TeachingDraft = {
  title: string;
  subtitle: string;
  speaker: string;
  ministryContext: string;
  theme: string;
  scriptureSource: string;
  intendedAudience: string;
  promise: string;
  description: string;
  formatMode: FormatMode;
  coverId: string;
  assets: ContentAsset[];
  liveEnabled: boolean;
  linkedLiveTitle: string;
  linkedLiveState: "Not created" | "Draft" | "Scheduled";
  linkedLiveTime: string;
  releaseTiming: string;
  visibility: VisibilityMode;
  region: string;
  supporterResources: boolean;
  reviewsPolicy: string;
  commentsEnabled: boolean;
  localeVariants: LocaleVariant[];
  notes: string;
  discussionPrompt: string;
  transcriptSummary: string;
  crossLinks: Record<(typeof CROSS_LINK_TYPES)[number]["key"], LinkState>;
  migrationMode: MigrationMode;
  migrationTargetSeries: string;
  migrationNotes: string;
};

const STEPS: Array<{ key: StepKey; label: string }> = [
  { key: "identity", label: "Teaching identity" },
  { key: "format", label: "Format mode" },
  { key: "package", label: "Content package" },
  { key: "live", label: "Live session launcher" },
  { key: "discovery", label: "Discovery & access" },
  { key: "links", label: "Cross-links" },
  { key: "migration", label: "Migration tools" },
  { key: "readiness", label: "Readiness" },
];

const DEFAULT_LOCALES: LocaleVariant[] = [
  { code: "en-UG", title: "Sunday Fire · English", state: "Ready" },
  { code: "sw-UG", title: "Sunday Fire · Swahili", state: "Draft" },
];

const DEFAULT_CROSS_LINKS: TeachingDraft["crossLinks"] = {
  event: { enabled: true, label: "Leadership Prayer Gathering", status: "Ready" },
  giving: { enabled: true, label: "Mercy Outreach Fund", status: "Ready" },
  crowdfund: { enabled: false, label: "Community relief campaign", status: "Planned" },
  faithmart: { enabled: true, label: "Teaching notes pack", status: "Draft" },
  beacon: { enabled: true, label: "Beacon teaser campaign", status: "Draft" },
};

const DEFAULT_DRAFT: TeachingDraft = {
  title: "Sunday Fire · Hope for the Waiting Heart",
  subtitle: "A standalone sermon for courage, patience, and faithful action in uncertain seasons.",
  speaker: "Pastor Daniel M.",
  ministryContext: "Sunday service",
  theme: "Hope and endurance",
  scriptureSource: "Romans 8 · Isaiah 40 · Psalm 27",
  intendedAudience: "Open to everyone",
  promise: "Help the audience find language for waiting faithfully without losing spiritual confidence.",
  description:
    "This standalone teaching package is built to work as a one-off sermon, a live-first message, or a replay-led discipleship resource without needing a Series or Episode parent.",
  formatMode: "live-first",
  coverId: "cover-sanctuary",
  assets: CONTENT_ASSET_LIBRARY,
  liveEnabled: true,
  linkedLiveTitle: "Sunday Fire Live Session",
  linkedLiveState: "Scheduled",
  linkedLiveTime: "Sun 09:00 · Primary + YouTube",
  releaseTiming: "Publish after the linked live ends",
  visibility: "Public",
  region: "Global",
  supporterResources: false,
  reviewsPolicy: REVIEW_POLICIES[0],
  commentsEnabled: true,
  localeVariants: DEFAULT_LOCALES,
  notes:
    "Use the close to invite the audience into prayer, then route follow-up toward the Mercy Outreach Fund and the leadership prayer event.",
  discussionPrompt:
    "What does faithful waiting look like when God feels silent, and how can the community carry one another during that period?",
  transcriptSummary:
    "The transcript draft is partially complete. Speaker names and scripture references still need cleanup for replay search.",
  crossLinks: DEFAULT_CROSS_LINKS,
  migrationMode: "stay-standalone",
  migrationTargetSeries: "Practicing the Way of Hope",
  migrationNotes:
    "Keep replay, clips, and Beacon metadata intact if the ministry decides to turn this teaching into a bigger campaign later.",
};

function accentColor(accent: Accent) {
  if (accent === "orange") return EV_ORANGE;
  if (accent === "navy") return EV_NAVY;
  return EV_GREEN;
}

function formatModeMeta(mode: FormatMode) {
  return FORMAT_MODES.find((item) => item.id === mode) || FORMAT_MODES[0];
}

function readinessChecks(draft: TeachingDraft) {
  const identityReady = Boolean(
    draft.title.trim() &&
      draft.speaker.trim() &&
      draft.promise.trim() &&
      draft.ministryContext.trim() &&
      draft.scriptureSource.trim(),
  );

  const packageReady = draft.assets.filter((asset) => asset.status === "Ready").length >= 2;
  const notesReady = Boolean(draft.notes.trim() && draft.discussionPrompt.trim());
  const liveReady = !draft.liveEnabled || Boolean(draft.linkedLiveTitle.trim() && draft.linkedLiveState !== "Not created");
  const discoveryReady = Boolean(draft.visibility && draft.releaseTiming.trim() && draft.localeVariants.length > 0);
  const trustReady = Boolean(draft.reviewsPolicy && draft.transcriptSummary.trim());
  const promotionReady = Object.values(draft.crossLinks).some((link) => link.enabled);
  const migrationReady = Boolean(draft.migrationMode);

  const checks = [
    { label: "Teaching identity", ready: identityReady, hint: "Title, speaker, promise, and ministry context are configured." },
    { label: "Content package", ready: packageReady, hint: "Artwork, transcript, notes, or slides are attached." },
    { label: "Notes and prompts", ready: notesReady, hint: "Discussion, study, and reflection prompts are ready." },
    { label: "Live session path", ready: liveReady, hint: "Linked live can launch without requiring a Series or Episode." },
    { label: "Discovery and access", ready: discoveryReady, hint: "Visibility, release timing, regions, and locales are configured." },
    { label: "Trust and moderation", ready: trustReady, hint: "Review policy, transcript summary, and moderation defaults are present." },
    { label: "Cross-link readiness", ready: promotionReady, hint: "At least one downstream promotion, event, or campaign connection is ready." },
    { label: "Migration logic", ready: migrationReady, hint: "The future path is clear if this teaching later expands into a Series." },
  ];

  const readyCount = checks.filter((item) => item.ready).length;
  const score = Math.round((readyCount / checks.length) * 100);
  return { score, checks, readyCount };
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
            : "border-faith-line bg-[var(--fh-surface-bg)] text-slate-700";

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
        "inline-flex items-center justify-center gap-2 rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] px-4 py-2 text-[12px] font-semibold text-slate-800 transition-colors hover:bg-[var(--fh-surface)] disabled:cursor-not-allowed disabled:opacity-50",
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
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-[12px] font-semibold text-white shadow-soft transition-opacity hover:opacity-95",
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
    <ProviderSurfaceCard
      title={title}
      subtitle={subtitle}
      right={right}
      className={cx("rounded-[28px]", className)}
      titleClassName="font-bold"
      subtitleClassName="mt-1"
    >
      {children}
    </ProviderSurfaceCard>
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
      className="mt-1 w-full rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] px-3 py-2 text-[12px] text-faith-ink outline-none transition-colors focus:ring-2 focus:ring-[rgba(3,205,140,0.18)]"
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
      className="mt-1 w-full rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] px-3 py-2 text-[12px] text-faith-ink outline-none transition-colors focus:ring-2 focus:ring-[rgba(3,205,140,0.18)]"
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
        checked ? "border-emerald-200 bg-emerald-50" : "border-faith-line bg-[var(--fh-surface-bg)] hover:bg-[var(--fh-surface)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[12px] font-semibold text-faith-ink">{title}</div>
          <div className="mt-1 text-[11px] text-faith-slate">{hint}</div>
        </div>
        <span
          className={cx(
            "mt-0.5 flex h-6 w-10 items-center rounded-full border px-1 transition-colors",
            checked ? "justify-end border-emerald-500 bg-emerald-500" : "justify-start border-slate-300 bg-slate-100",
          )}
        >
          <span className="h-4 w-4 rounded-full bg-[var(--fh-surface-bg)] shadow-soft" />
        </span>
      </div>
    </button>
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
        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-faith-slate">{eyebrow}</div>
        <div className="mt-1 text-[18px] font-black text-faith-ink">{title}</div>
        <div className="mt-1 text-[12px] text-faith-slate">{subtitle}</div>
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
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
    <div className="rounded-[30px] border border-faith-line bg-[var(--fh-surface-bg)] p-4 shadow-soft xl:sticky xl:top-6">
      <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4">
        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">Standalone Builder</div>
        <div className="mt-2 text-[28px] font-black leading-none text-faith-ink">{readinessScore}%</div>
        <div className="mt-1 text-[11px] text-faith-slate">Teaching completeness score</div>
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
                  ? "border-emerald-300 bg-emerald-50 text-faith-ink"
                  : "border-faith-line bg-[var(--fh-surface-bg)] text-slate-700 hover:bg-[var(--fh-surface)]",
              )}
            >
              <span>{item.label}</span>
              {active ? <ChevronRight className="h-4 w-4 text-emerald-700" /> : null}
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-[24px] border border-amber-200 bg-amber-50 p-4">
        <div className="text-[13px] font-bold text-faith-ink">Quick handoff</div>
        <div className="mt-2 space-y-2">
          <SoftButton className="w-full justify-between" onClick={() => safeNav(ROUTES.liveBuilder)}>
            Live Builder <ChevronRight className="h-4 w-4" />
          </SoftButton>
          <SoftButton className="w-full justify-between" onClick={() => safeNav(ROUTES.postLivePublishing)}>
            Post-live Publishing <ChevronRight className="h-4 w-4" />
          </SoftButton>
          <SoftButton className="w-full justify-between" onClick={() => safeNav(ROUTES.replaysAndClips)}>
            Replays & Clips <ChevronRight className="h-4 w-4" />
          </SoftButton>
          <SoftButton className="w-full justify-between" onClick={() => safeNav(ROUTES.beaconBuilder)}>
            Beacon Builder <ChevronRight className="h-4 w-4" />
          </SoftButton>
        </div>
      </div>
    </div>
  );
}

function statusTone(status: ContentAssetState) {
  if (status === "Ready") return "good" as const;
  if (status === "Needs review") return "warn" as const;
  return "neutral" as const;
}

function localeTone(state: LocaleVariant["state"]) {
  if (state === "Ready") return "good" as const;
  if (state === "Translating") return "warn" as const;
  return "neutral" as const;
}

function DesktopTeachingPreview({ draft }: { draft: TeachingDraft }) {
  const cover = TEACHING_COVERS.find((item) => item.id === draft.coverId) || TEACHING_COVERS[0];
  const activeFormat = formatModeMeta(draft.formatMode);
  const activeLinks = Object.values(draft.crossLinks).filter((link) => link.enabled);
  const readyAssets = draft.assets.filter((asset) => asset.status === "Ready");

  return (
    <div className="rounded-[28px] border border-faith-line bg-[var(--fh-surface-bg)] p-4 shadow-soft">
      <div className="overflow-hidden rounded-[24px] border border-faith-line bg-slate-950">
        <div className="relative h-[240px] overflow-hidden bg-slate-900">
          <img src={cover.url} alt={cover.name} className="h-full w-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-2">
            <Pill tone="brand">Standalone Teaching</Pill>
            <div className="flex items-center gap-2">
              <Pill tone="good">{draft.visibility}</Pill>
              <Pill tone="warn">{activeFormat.title}</Pill>
            </div>
          </div>
          <div className="absolute left-4 right-4 bottom-4">
            <div className="text-[28px] font-black leading-tight text-white">{draft.title}</div>
            <div className="mt-1 max-w-[520px] text-[13px] text-white/80">{draft.subtitle}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                className="inline-flex items-center gap-2 rounded-full bg-[#03cd8c] px-4 py-2 text-[12px] font-black text-white"
                onClick={() => safeNav(draft.liveEnabled ? "/faithhub/provider/live-dashboard" : "/faithhub/provider/teachings-dashboard")}
              >
                {draft.liveEnabled ? "Join teaching" : "Watch teaching"}
              </button>
              <button className="inline-flex items-center gap-2 rounded-full bg-[#f77f00] px-4 py-2 text-[12px] font-black text-white" onClick={() => safeNav("/faithhub/provider/resources-manager")}>
                Open notes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[24px] border border-faith-line bg-[var(--fh-surface)] p-4">
          <div className="text-[16px] font-black text-faith-ink">Teaching package</div>
          <div className="mt-1 text-[11px] text-faith-slate">Standalone landing page preview with notes, replays, and linked actions.</div>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] p-3">
              <div className="text-[11px] font-black uppercase tracking-[0.16em] text-faith-slate">Core promise</div>
              <div className="mt-2 text-[13px] font-semibold text-faith-ink">{draft.promise}</div>
            </div>
            <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.16em] text-faith-slate">Notes and resources</div>
                  <div className="mt-1 text-[12px] text-faith-slate">{draft.discussionPrompt}</div>
                </div>
                <Pill tone="good">{readyAssets.length} ready</Pill>
              </div>
            </div>
            <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] p-3">
              <div className="text-[11px] font-black uppercase tracking-[0.16em] text-faith-slate">Linked live</div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[13px] font-semibold text-faith-ink">
                    {draft.liveEnabled ? draft.linkedLiveTitle : "No live attached yet"}
                  </div>
                  <div className="mt-1 text-[11px] text-faith-slate">
                    {draft.liveEnabled ? draft.linkedLiveTime : "Standalone upload-first path remains active."}
                  </div>
                </div>
                <Pill tone={draft.liveEnabled ? "good" : "neutral"}>{draft.linkedLiveState}</Pill>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-faith-line bg-[var(--fh-surface)] p-4">
          <div className="text-[16px] font-black text-faith-ink">Related next steps</div>
          <div className="mt-1 text-[11px] text-faith-slate">Cross-links and follow-up opportunities connected to this standalone teaching.</div>
          <div className="mt-4 space-y-3">
            {activeLinks.map((link) => (
              <div key={link.label} className="rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[13px] font-semibold text-faith-ink">{link.label}</div>
                  <Pill tone={link.status === "Ready" ? "good" : link.status === "Draft" ? "warn" : "neutral"}>{link.status}</Pill>
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] p-3">
              <div className="text-[11px] font-black uppercase tracking-[0.16em] text-faith-slate">Migration path</div>
              <div className="mt-2 text-[13px] font-semibold text-faith-ink">
                {draft.migrationMode === "stay-standalone"
                  ? "Remain a premium standalone teaching"
                  : draft.migrationMode === "new-series"
                    ? "Can expand into a new Series later"
                    : `Can insert into ${draft.migrationTargetSeries}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileTeachingPreview({ draft }: { draft: TeachingDraft }) {
  const cover = TEACHING_COVERS.find((item) => item.id === draft.coverId) || TEACHING_COVERS[0];
  const activeFormat = formatModeMeta(draft.formatMode);

  return (
    <div className="mx-auto w-full max-w-[320px] md:max-w-[360px] rounded-[34px] bg-slate-950 p-3 shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
      <div className="overflow-hidden rounded-[28px] bg-[#fcfcfc]">
        <div className="relative h-[620px] overflow-hidden">
          <div className="absolute left-1/2 top-3 h-2 w-24 -translate-x-1/2 rounded-full bg-slate-900" />
          <div className="h-[210px] overflow-hidden bg-slate-900">
            <img src={cover.url} alt={cover.name} className="h-full w-full object-cover opacity-90" />
          </div>
          <div className="relative -mt-14 px-4 pb-4">
            <div className="rounded-[26px] border border-faith-line bg-[var(--fh-surface-bg)] p-4 shadow-soft">
              <div className="flex items-center justify-between gap-2">
                <Pill tone="brand">Standalone</Pill>
                <button className="text-[11px] font-semibold text-emerald-600" onClick={() => navigator.clipboard?.writeText(window.location.href)}>Share</button>
              </div>
              <div className="mt-3 text-[22px] font-black leading-tight text-faith-ink">{draft.title}</div>
              <div className="mt-1 text-[12px] text-faith-slate">{draft.subtitle}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill tone="good">{draft.visibility}</Pill>
                <Pill tone="warn">{activeFormat.title}</Pill>
              </div>
              <div className="mt-4 rounded-2xl border border-faith-line bg-[var(--fh-surface)] p-3">
                <div className="text-[11px] font-black uppercase tracking-[0.16em] text-faith-slate">Speaker</div>
                <div className="mt-2 text-[14px] font-bold text-faith-ink">{draft.speaker}</div>
                <div className="mt-1 text-[11px] text-faith-slate">{draft.scriptureSource}</div>
              </div>
              <div className="mt-3 space-y-2">
                <button
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-[#03cd8c] px-4 py-3 text-[13px] font-black text-white"
                  onClick={() => safeNav(draft.liveEnabled ? "/faithhub/provider/live-dashboard" : "/faithhub/provider/teachings-dashboard")}
                >
                  {draft.liveEnabled ? "Join linked live" : "Watch teaching"}
                </button>
                <button className="inline-flex w-full items-center justify-center rounded-2xl bg-[#f77f00] px-4 py-3 text-[13px] font-black text-white" onClick={() => safeNav("/faithhub/provider/resources-manager")}>
                  Open notes & resources
                </button>
              </div>
              <div className="mt-4 rounded-2xl border border-faith-line bg-[var(--fh-surface)] p-3">
                <div className="text-[11px] font-black uppercase tracking-[0.16em] text-faith-slate">Related actions</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(draft.crossLinks)
                    .filter(([, link]) => link.enabled)
                    .slice(0, 3)
                    .map(([key]) => (
                      <span key={key} className="rounded-full border border-faith-line bg-[var(--fh-surface-bg)] px-3 py-1 text-[11px] font-semibold text-slate-700">
                        {key === "faithmart" ? "FaithMart" : key === "crowdfund" ? "Crowdfund" : key}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StandaloneTeachingBuilderPage() {
  const [step, setStep] = useState<StepKey>("identity");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [speakerSearch, setSpeakerSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [draft, setDraft] = useState<TeachingDraft>(DEFAULT_DRAFT);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const readiness = useMemo(() => readinessChecks(draft), [draft]);
  const activeFormat = formatModeMeta(draft.formatMode);
  const availableLanguages = useMemo(
    () => LANGUAGE_OPTIONS.filter((option) => !draft.localeVariants.some((variant) => variant.code === option.code)),
    [draft.localeVariants],
  );

  const filteredSpeakers = useMemo(() => {
    const q = speakerSearch.trim().toLowerCase();
    if (!q) return SPEAKER_OPTIONS;
    return SPEAKER_OPTIONS.filter((speaker) => speaker.toLowerCase().includes(q));
  }, [speakerSearch]);

  const toggleCrossLink = (key: keyof TeachingDraft["crossLinks"]) => {
    setDraft((current) => ({
      ...current,
      crossLinks: {
        ...current.crossLinks,
        [key]: {
          ...current.crossLinks[key],
          enabled: !current.crossLinks[key].enabled,
        },
      },
    }));
  };

  const addLanguageVariant = () => {
    const next = availableLanguages[0];
    if (!next) return;
    setDraft((current) => ({
      ...current,
      localeVariants: [
        ...current.localeVariants,
        {
          code: next.code,
          title: `${current.title} (${next.label})`,
          state: "Draft",
        },
      ],
    }));
    setToast(`${next.label} language variant added.`);
  };

  const addAsset = () => {
    setDraft((current) => ({
      ...current,
      assets: [
        ...current.assets,
        {
          id: `asset-${Math.random().toString(16).slice(2, 8)}`,
          type: "Attachment",
          name: "New supporting asset",
          status: "Draft",
          hint: "Attach a file, note, image, or supporting resource.",
        },
      ],
    }));
    setToast("Content asset added.");
  };

  const centerContent = useMemo(() => {
    if (step === "identity") {
      return (
        <div className="space-y-4">
          <Card
            title="Teaching identity block"
            subtitle="Capture the premium sermon identity without forcing a Series or Episode parent."
            right={<Pill tone="brand">No parent required</Pill>}
          >
            <SectionHeader
              eyebrow="Core metadata"
              title="Name the teaching and define the spiritual promise"
              subtitle="Give the sermon or teaching its own ministry context, audience fit, and clear reason to engage."
            />
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div>
                <FieldLabel>Teaching title</FieldLabel>
                <TextInput value={draft.title} onChange={(title) => setDraft((current) => ({ ...current, title }))} />
              </div>
              <div>
                <FieldLabel>Subtitle</FieldLabel>
                <TextInput value={draft.subtitle} onChange={(subtitle) => setDraft((current) => ({ ...current, subtitle }))} />
              </div>
              <div>
                <FieldLabel>Speaker</FieldLabel>
                <TextInput value={draft.speaker} onChange={(speaker) => setDraft((current) => ({ ...current, speaker }))} />
              </div>
              <div>
                <FieldLabel>Ministry context</FieldLabel>
                <select
                  value={draft.ministryContext}
                  onChange={(e) => setDraft((current) => ({ ...current, ministryContext: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] px-3 py-2 text-[12px] text-faith-ink outline-none"
                >
                  {MINISTRY_CONTEXTS.map((context) => (
                    <option key={context}>{context}</option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Theme</FieldLabel>
                <TextInput value={draft.theme} onChange={(theme) => setDraft((current) => ({ ...current, theme }))} />
              </div>
              <div>
                <FieldLabel>Scripture or source</FieldLabel>
                <TextInput value={draft.scriptureSource} onChange={(scriptureSource) => setDraft((current) => ({ ...current, scriptureSource }))} />
              </div>
              <div>
                <FieldLabel>Intended audience</FieldLabel>
                <select
                  value={draft.intendedAudience}
                  onChange={(e) => setDraft((current) => ({ ...current, intendedAudience: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] px-3 py-2 text-[12px] text-faith-ink outline-none"
                >
                  {AUDIENCE_OPTIONS.map((audience) => (
                    <option key={audience}>{audience}</option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Core promise of the message</FieldLabel>
                <TextInput value={draft.promise} onChange={(promise) => setDraft((current) => ({ ...current, promise }))} />
              </div>
              <div className="lg:col-span-2">
                <FieldLabel>Teaching summary</FieldLabel>
                <TextArea value={draft.description} onChange={(description) => setDraft((current) => ({ ...current, description }))} rows={4} />
              </div>
            </div>
          </Card>

          <Card
            title="Speaker and ministry context"
            subtitle="Keep the creator-style speed, but frame the page around a single premium teaching destination."
            right={<Pill tone="good">Standalone path</Pill>}
          >
            <div className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
              <div>
                <FieldLabel>Selected speaker</FieldLabel>
                <div className="mt-2 rounded-[24px] border border-faith-line bg-[var(--fh-surface)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="mt-2 text-[28px] font-black leading-[1.04] tracking-[-0.03em] text-faith-ink dark:text-slate-100 sm:text-[34px] lg:text-[40px]">{draft.speaker}</div>
                      <div className="mt-1.5 text-[14px] leading-6 text-faith-slate">{draft.ministryContext} · {draft.theme}</div>
                    </div>
                    <Pill tone="brand">Lead teacher</Pill>
                  </div>
                  <div className="mt-3 rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] p-3">
                    <div className="text-[11px] font-black uppercase tracking-[0.16em] text-faith-slate">Why standalone?</div>
                    <div className="mt-2 text-[12px] text-faith-slate">
                      This teaching has a complete identity, audience promise, and publishing path of its own. It can later grow into a Series, but it does not need one today.
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <FieldLabel>Search alternate speakers</FieldLabel>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faith-slate" />
                  <input
                    value={speakerSearch}
                    onChange={(e) => setSpeakerSearch(e.target.value)}
                    placeholder="Search speakers"
                    className="w-full rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] py-2 pl-9 pr-3 text-[12px] text-faith-ink outline-none"
                  />
                </div>
                <div className="mt-2 flex max-h-[200px] flex-col gap-2 overflow-y-auto pr-1">
                  {filteredSpeakers.map((speaker) => {
                    const active = draft.speaker === speaker;
                    return (
                      <button
                        key={speaker}
                        type="button"
                        onClick={() => setDraft((current) => ({ ...current, speaker }))}
                        className={cx(
                          "flex items-center justify-between rounded-2xl border px-3 py-2 text-[12px] font-semibold transition-colors",
                          active ? "border-emerald-300 bg-emerald-50 text-faith-ink" : "border-faith-line bg-[var(--fh-surface-bg)] text-slate-700 hover:bg-[var(--fh-surface)]",
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

    if (step === "format") {
      return (
        <div className="space-y-4">
          <Card
            title="Format mode selector"
            subtitle="Choose whether the teaching begins as live-first, upload-first, audio-first, video-first, or text-plus-resource."
            right={<Pill tone="brand">Dual-path creation</Pill>}
          >
            <SectionHeader
              eyebrow="Creation mode"
              title="Pick the premium creation path"
              subtitle="Every mode still creates a first-class teaching record with replay, clip, review, and promotion potential."
            />
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {FORMAT_MODES.map((mode) => {
                const active = draft.formatMode === mode.id;
                const color = accentColor(mode.accent);
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setDraft((current) => ({ ...current, formatMode: mode.id }))}
                    className={cx(
                      "rounded-3xl border p-4 text-left transition-colors",
                      active ? "border-transparent shadow-soft" : "border-faith-line bg-[var(--fh-surface-bg)] hover:bg-[var(--fh-surface)]",
                    )}
                    style={active ? { background: `${color}12`, borderColor: `${color}44` } : undefined}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-[13px] font-bold text-faith-ink">{mode.title}</div>
                      {active ? <BadgeCheck className="h-4 w-4" style={{ color }} /> : null}
                    </div>
                    <div className="mt-2 text-[11px] leading-5 text-faith-slate">{mode.subtitle}</div>
                  </button>
                );
              })}
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card
              title="Live toggle and session launcher"
              subtitle="Create a directly linked Live Session without needing a Series or Episode parent."
              right={<Pill tone={draft.liveEnabled ? "good" : "neutral"}>{draft.liveEnabled ? "Live path on" : "Live path off"}</Pill>}
            >
              <div className="space-y-3">
                <ToggleTile
                  title="Enable linked Live Session"
                  hint="Run this teaching through the full live workflow and preserve replay, clip, giving, and moderation context afterwards."
                  checked={draft.liveEnabled}
                  onChange={(liveEnabled) => setDraft((current) => ({ ...current, liveEnabled }))}
                />
                <div className="grid gap-3 lg:grid-cols-2">
                  <div>
                    <FieldLabel>Linked live title</FieldLabel>
                    <TextInput
                      value={draft.linkedLiveTitle}
                      onChange={(linkedLiveTitle) => setDraft((current) => ({ ...current, linkedLiveTitle }))}
                      placeholder="Create a live session title"
                    />
                  </div>
                  <div>
                    <FieldLabel>Linked live state</FieldLabel>
                    <select
                      value={draft.linkedLiveState}
                      onChange={(e) =>
                        setDraft((current) => ({
                          ...current,
                          linkedLiveState: e.target.value as TeachingDraft["linkedLiveState"],
                        }))
                      }
                      className="mt-1 w-full rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] px-3 py-2 text-[12px] text-faith-ink outline-none"
                    >
                      {(["Not created", "Draft", "Scheduled"] as const).map((state) => (
                        <option key={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <FieldLabel>Launch note</FieldLabel>
                  <TextInput
                    value={draft.linkedLiveTime}
                    onChange={(linkedLiveTime) => setDraft((current) => ({ ...current, linkedLiveTime }))}
                    placeholder="Sun 09:00 · Primary + YouTube"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <PrimaryButton color="orange" onClick={() => setToast("Linked Live Session prepared for handoff.")}> 
                    <Video className="h-4 w-4" /> Create live session
                  </PrimaryButton>
                  <SoftButton onClick={() => safeNav(ROUTES.liveBuilder)}>
                    <ExternalLink className="h-4 w-4" /> Open Live Builder
                  </SoftButton>
                </div>
              </div>
            </Card>

            <Card
              title="Premium workflow note"
              subtitle="The same page supports live-first and upload-first creation without splitting the ministry team into separate tools."
              right={<Pill tone="warn">{activeFormat.title}</Pill>}
            >
              <div className="rounded-[24px] border border-faith-line bg-[var(--fh-surface)] p-4">
                <div className="text-[11px] font-black uppercase tracking-[0.16em] text-faith-slate">Selected path</div>
                <div className="mt-2 text-[18px] font-black text-faith-ink">{activeFormat.title}</div>
                <div className="mt-2 text-[12px] leading-6 text-faith-slate">{activeFormat.subtitle}</div>
                <div className="mt-4 grid gap-2 md:grid-cols-2">
                  <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] p-3">
                    <div className="text-[12px] font-bold text-faith-ink">Replay continuity</div>
                    <div className="mt-1 text-[11px] text-faith-slate">Post-live publishing, clips, and reviews stay attached to the same teaching record.</div>
                  </div>
                  <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] p-3">
                    <div className="text-[12px] font-bold text-faith-ink">Promotion continuity</div>
                    <div className="mt-1 text-[11px] text-faith-slate">Beacon, giving, and events can attach even if no Series ever exists.</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      );
    }

    if (step === "package") {
      return (
        <div className="space-y-4">
          <Card
            title="Content package workspace"
            subtitle="Artwork, hero images, files, transcripts, notes, slides, prompts, and supporting resources live together here."
            right={<Pill tone="brand">Package studio</Pill>}
          >
            <SectionHeader
              eyebrow="Artwork and files"
              title="Build the full premium teaching package"
              subtitle="This is where standalone teachings feel intentional, not improvised or hidden outside the main content system."
            />
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {TEACHING_COVERS.map((cover) => {
                const active = draft.coverId === cover.id;
                return (
                  <button
                    key={cover.id}
                    type="button"
                    onClick={() => setDraft((current) => ({ ...current, coverId: cover.id }))}
                    className={cx(
                      "overflow-hidden rounded-[26px] border text-left transition-colors",
                      active ? "border-emerald-300 ring-2 ring-[rgba(3,205,140,0.18)]" : "border-faith-line bg-[var(--fh-surface-bg)] hover:bg-[var(--fh-surface)]",
                    )}
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-slate-200">
                      <img src={cover.url} alt={cover.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-3">
                      <div className="text-[12px] font-bold text-faith-ink">{cover.name}</div>
                      <div className="mt-1 text-[11px] text-faith-slate">Hero art for the teaching landing page and replay package.</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
            <Card
              title="Package inventory"
              subtitle="Track transcript, notes, slides, prompts, and related attachments in one teaching-first workspace."
              right={<Pill tone="good">{draft.assets.length} assets</Pill>}
            >
              <div className="space-y-3">
                {draft.assets.map((asset) => (
                  <div key={asset.id} className="rounded-2xl border border-faith-line bg-[var(--fh-surface)] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[12px] font-bold text-faith-ink">{asset.name}</div>
                        <div className="mt-1 text-[11px] text-faith-slate">{asset.type} · {asset.hint}</div>
                      </div>
                      <Pill tone={statusTone(asset.status)}>{asset.status}</Pill>
                    </div>
                  </div>
                ))}
                <SoftButton onClick={addAsset} className="w-full justify-center">
                  <Plus className="h-4 w-4" /> Add supporting asset
                </SoftButton>
              </div>
            </Card>

            <div className="space-y-4">
              <Card
                title="Teaching notes"
                subtitle="Attach the sermon outline, reading path, and next-step prompts."
                right={<Pill tone="warn">Editable</Pill>}
              >
                <div className="space-y-3">
                  <div>
                    <FieldLabel>Producer / editor note</FieldLabel>
                    <TextArea value={draft.notes} onChange={(notes) => setDraft((current) => ({ ...current, notes }))} rows={4} />
                  </div>
                  <div>
                    <FieldLabel>Discussion prompt</FieldLabel>
                    <TextArea value={draft.discussionPrompt} onChange={(discussionPrompt) => setDraft((current) => ({ ...current, discussionPrompt }))} rows={3} />
                  </div>
                </div>
              </Card>

              <Card
                title="Transcript and accessibility"
                subtitle="Subtitles, searchable transcripts, and cleanup cues travel directly into replay packaging."
                right={<Pill tone="neutral">Quality pass</Pill>}
              >
                <TextArea
                  value={draft.transcriptSummary}
                  onChange={(transcriptSummary) => setDraft((current) => ({ ...current, transcriptSummary }))}
                  rows={5}
                />
              </Card>
            </div>
          </div>
        </div>
      );
    }

    if (step === "live") {
      return (
        <div className="space-y-4">
          <Card
            title="Live toggle and session launcher"
            subtitle="One-off teachings can run through the full live workflow without any fake Series or Episode container."
            right={<Pill tone="brand">Live-first bridge</Pill>}
          >
            <SectionHeader
              eyebrow="Live Sessions linkage"
              title="Launch a standalone teaching into the live workflow"
              subtitle="Schedule, operate, publish, clip, and review the message while keeping the teaching independent."
              right={<PrimaryButton color="orange" onClick={() => setToast("Live session launcher opened.")}>Create live session</PrimaryButton>}
            />
            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.95fr]">
              <div className="rounded-[24px] border border-faith-line bg-[var(--fh-surface)] p-4">
                <div className="text-[11px] font-black uppercase tracking-[0.16em] text-faith-slate">Direct link</div>
                <div className="mt-2 text-[18px] font-black text-faith-ink">{draft.liveEnabled ? draft.linkedLiveTitle : "Live Session not created yet"}</div>
                <div className="mt-1 text-[12px] text-faith-slate">{draft.liveEnabled ? draft.linkedLiveTime : "This teaching can still publish as upload-first, audio-first, or text-plus-resource."}</div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] p-3">
                    <div className="text-[11px] font-black uppercase tracking-[0.16em] text-faith-slate">State</div>
                    <div className="mt-1 text-[14px] font-bold text-faith-ink">{draft.linkedLiveState}</div>
                  </div>
                  <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] p-3">
                    <div className="text-[11px] font-black uppercase tracking-[0.16em] text-faith-slate">Downstream value</div>
                    <div className="mt-1 text-[14px] font-bold text-faith-ink">Replay + clips + reviews</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-[24px] border border-faith-line bg-[var(--fh-surface-bg)] p-4">
                  <div className="text-[13px] font-bold text-faith-ink">Launch options</div>
                  <div className="mt-3 space-y-3">
                    <ToggleTile
                      title="Keep linked Live Session enabled"
                      hint="Turn on when this teaching should pass through Live Builder, Live Dashboard, Live Studio, and Post-live Publishing."
                      checked={draft.liveEnabled}
                      onChange={(liveEnabled) => setDraft((current) => ({ ...current, liveEnabled }))}
                    />
                    <ToggleTile
                      title="Preserve direct upload path"
                      hint="Even with a linked live, keep the standalone teaching valid for direct upload or replay-first release."
                      checked
                      onChange={() => setToast("Direct upload path is always preserved for standalone teachings.")}
                    />
                  </div>
                </div>
                <div className="rounded-[24px] border border-faith-line bg-[var(--fh-surface)] p-4">
                  <div className="text-[13px] font-bold text-faith-ink">Fast handoff</div>
                  <div className="mt-3 grid gap-2">
                    <SoftButton className="justify-between" onClick={() => safeNav(ROUTES.liveBuilder)}>
                      Open Live Builder <ChevronRight className="h-4 w-4" />
                    </SoftButton>
                    <SoftButton className="justify-between" onClick={() => safeNav(ROUTES.postLivePublishing)}>
                      Prepare post-live publishing <ChevronRight className="h-4 w-4" />
                    </SoftButton>
                    <SoftButton className="justify-between" onClick={() => safeNav(ROUTES.replaysAndClips)}>
                      Reserve replay & clip handoff <ChevronRight className="h-4 w-4" />
                    </SoftButton>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    if (step === "discovery") {
      return (
        <div className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
            <Card
              title="Discovery and access rules"
              subtitle="Control discoverability, release timing, supporter-only resources, region visibility, and who can review or comment."
              right={<Pill tone="brand">Access rules</Pill>}
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <FieldLabel>Release timing</FieldLabel>
                  <TextInput value={draft.releaseTiming} onChange={(releaseTiming) => setDraft((current) => ({ ...current, releaseTiming }))} />
                </div>
                <div>
                  <FieldLabel>Visibility</FieldLabel>
                  <select
                    value={draft.visibility}
                    onChange={(e) => setDraft((current) => ({ ...current, visibility: e.target.value as VisibilityMode }))}
                    className="mt-1 w-full rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] px-3 py-2 text-[12px] text-faith-ink outline-none"
                  >
                    {VISIBILITY_OPTIONS.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel>Region visibility</FieldLabel>
                  <select
                    value={draft.region}
                    onChange={(e) => setDraft((current) => ({ ...current, region: e.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] px-3 py-2 text-[12px] text-faith-ink outline-none"
                  >
                    {REGION_OPTIONS.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel>Review / comment policy</FieldLabel>
                  <select
                    value={draft.reviewsPolicy}
                    onChange={(e) => setDraft((current) => ({ ...current, reviewsPolicy: e.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] px-3 py-2 text-[12px] text-faith-ink outline-none"
                  >
                    {REVIEW_POLICIES.map((policy) => (
                      <option key={policy}>{policy}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <ToggleTile
                  title="Supporter-only resources"
                  hint="Keep notes or downloads visible only to supporters while the core teaching remains public."
                  checked={draft.supporterResources}
                  onChange={(supporterResources) => setDraft((current) => ({ ...current, supporterResources }))}
                />
                <ToggleTile
                  title="Allow reviews and comments"
                  hint="Let the audience leave reviews or comments based on the policy chosen above."
                  checked={draft.commentsEnabled}
                  onChange={(commentsEnabled) => setDraft((current) => ({ ...current, commentsEnabled }))}
                />
              </div>
            </Card>

            <Card
              title="Localization workspace"
              subtitle="Standalone teachings can still carry multiple language variants and localized metadata."
              right={<Pill tone="good">{draft.localeVariants.length} locales</Pill>}
            >
              <div className="space-y-3">
                {draft.localeVariants.map((variant) => {
                  const locale = LANGUAGE_OPTIONS.find((option) => option.code === variant.code);
                  return (
                    <div key={variant.code} className="rounded-2xl border border-faith-line bg-[var(--fh-surface)] p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-[12px] font-bold text-faith-ink">{locale?.label || variant.code}</div>
                          <div className="mt-1 text-[11px] text-faith-slate">{variant.title}</div>
                        </div>
                        <Pill tone={localeTone(variant.state)}>{variant.state}</Pill>
                      </div>
                    </div>
                  );
                })}
                <SoftButton className="w-full justify-center" onClick={addLanguageVariant} disabled={!availableLanguages.length}>
                  <Plus className="h-4 w-4" /> Add language variant
                </SoftButton>
              </div>
            </Card>
          </div>
        </div>
      );
    }

    if (step === "links") {
      return (
        <div className="space-y-4">
          <Card
            title="Cross-link panel"
            subtitle="Connect the teaching to an event, giving campaign, crowdfund, FaithMart item, or Beacon promotion without turning it into a Series."
            right={<Pill tone="brand">Independent linking</Pill>}
          >
            <SectionHeader
              eyebrow="Connected journeys"
              title="Attach downstream destinations"
              subtitle="Cross-links deepen the teaching’s usefulness while preserving it as a standalone message."
            />
            <div className="mt-4 grid gap-3 xl:grid-cols-2">
              {CROSS_LINK_TYPES.map((item) => {
                const state = draft.crossLinks[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleCrossLink(item.key)}
                    className={cx(
                      "rounded-[26px] border p-4 text-left transition-colors",
                      state.enabled ? "border-emerald-300 bg-emerald-50" : "border-faith-line bg-[var(--fh-surface-bg)] hover:bg-[var(--fh-surface)]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-bold text-faith-ink">{item.label}</div>
                        <div className="mt-1 text-[11px] leading-5 text-faith-slate">{item.helper}</div>
                      </div>
                      <Pill tone={state.enabled ? (state.status === "Ready" ? "good" : "warn") : "neutral"}>{state.enabled ? state.status : "Off"}</Pill>
                    </div>
                    <div className="mt-3 rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] p-3">
                      <div className="text-[12px] font-semibold text-faith-ink">{state.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card
              title="Promotion hooks"
              subtitle="Route this teaching into Beacon, notifications, giving, and event follow-up without waiting for a Series shell."
              right={<Pill tone="warn">Conversion-ready</Pill>}
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface)] p-3">
                  <div className="text-[11px] font-black uppercase tracking-[0.16em] text-faith-slate">Beacon path</div>
                  <div className="mt-2 text-[13px] font-semibold text-faith-ink">Create teaser, replay boost, or awareness ad</div>
                </div>
                <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface)] p-3">
                  <div className="text-[11px] font-black uppercase tracking-[0.16em] text-faith-slate">Giving path</div>
                  <div className="mt-2 text-[13px] font-semibold text-faith-ink">Attach an offering moment or campaign narrative</div>
                </div>
              </div>
            </Card>

            <Card
              title="Object independence"
              subtitle="The teaching remains standalone even when related pages are attached."
              right={<Pill tone="good">First-class standalone</Pill>}
            >
              <div className="space-y-3 text-[12px] text-faith-slate">
                <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface)] p-3">
                  Linking an event, fund, crowdfund, FaithMart item, or Beacon campaign does <span className="font-semibold text-faith-ink">not</span> force a parent Series or Episode relationship.
                </div>
                <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface)] p-3">
                  The teaching keeps its own replay, clips, reviews, analytics, and discovery identity no matter how many downstream connections it has.
                </div>
              </div>
            </Card>
          </div>
        </div>
      );
    }

    if (step === "migration") {
      return (
        <div className="space-y-4">
          <Card
            title="Conversion and migration tools"
            subtitle="Allow a standalone teaching to remain independent, become a new Series later, or be inserted into an existing Series."
            right={<Pill tone="brand">Convertible metadata</Pill>}
          >
            <SectionHeader
              eyebrow="Future flexibility"
              title="Decide how this teaching could evolve later"
              subtitle="Ministries often preach one-off messages that later deserve a broader campaign. Preserve that path without disturbing today’s publishing workflow."
            />
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {MIGRATION_MODES.map((mode) => {
                const active = draft.migrationMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setDraft((current) => ({ ...current, migrationMode: mode.id }))}
                    className={cx(
                      "rounded-[26px] border p-4 text-left transition-colors",
                      active ? "border-emerald-300 bg-emerald-50" : "border-faith-line bg-[var(--fh-surface-bg)] hover:bg-[var(--fh-surface)]",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[13px] font-bold text-faith-ink">{mode.title}</div>
                      {active ? <BadgeCheck className="h-4 w-4 text-emerald-700" /> : null}
                    </div>
                    <div className="mt-2 text-[11px] leading-5 text-faith-slate">{mode.subtitle}</div>
                  </button>
                );
              })}
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-[1fr_0.96fr]">
            <Card
              title="Migration target setup"
              subtitle="Keep the next move visible even when the current path remains standalone."
              right={<Pill tone="warn">Optional future path</Pill>}
            >
              <div className="space-y-4">
                <div>
                  <FieldLabel>Target series / future campaign</FieldLabel>
                  <TextInput
                    value={draft.migrationTargetSeries}
                    onChange={(migrationTargetSeries) => setDraft((current) => ({ ...current, migrationTargetSeries }))}
                    placeholder="Practicing the Way of Hope"
                  />
                </div>
                <div>
                  <FieldLabel>Migration notes</FieldLabel>
                  <TextArea
                    value={draft.migrationNotes}
                    onChange={(migrationNotes) => setDraft((current) => ({ ...current, migrationNotes }))}
                    rows={4}
                  />
                </div>
              </div>
            </Card>

            <Card
              title="What will be preserved"
              subtitle="No matter which migration mode you choose, the standalone teaching remains a first-class object today."
              right={<Pill tone="good">Preserved</Pill>}
            >
              <div className="space-y-3">
                {[
                  "Replay, clip, and review history remain attached.",
                  "Beacon promotions and campaign links survive the migration.",
                  "Teaching notes, transcript cleanup, and localization variants remain intact.",
                  "Analytics remain attributable to the original standalone message.",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-faith-line bg-[var(--fh-surface)] p-3 text-[12px] text-faith-slate">
                    {item}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Card
          title="Quality and completeness checker"
          subtitle="Flags missing artwork, metadata, subtitles, notes, or moderation settings before publication."
          right={<Pill tone="good">{readiness.score}% complete</Pill>}
        >
          <SectionHeader
            eyebrow="Readiness"
            title="Launch confidence for this standalone teaching"
            subtitle="Review the premium launch gates before saving, creating a live session, or publishing the teaching."
          />

          <div className="mt-5 grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[24px] border border-faith-line bg-[var(--fh-surface)] p-4">
              <div className="text-[44px] font-black leading-none text-faith-ink">{readiness.score}%</div>
              <div className="mt-2 text-[12px] text-faith-slate">Standalone teaching readiness</div>
              <div className="mt-4">
                <ProgressBar value={readiness.score} />
              </div>
              <div className="mt-4 space-y-2 text-[12px] text-faith-slate">
                <div className="flex items-center justify-between gap-2">
                  <span>Ready checks</span>
                  <span className="font-bold text-faith-ink">{readiness.readyCount}/{readiness.checks.length}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>Format mode</span>
                  <span className="font-bold text-faith-ink">{activeFormat.title}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>Standalone parent</span>
                  <span className="font-bold text-emerald-700">None required</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {readiness.checks.map((item) => (
                <div key={item.label} className="rounded-[22px] border border-faith-line bg-[var(--fh-surface-bg)] p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={cx(
                        "mt-0.5 grid h-8 w-8 place-items-center rounded-full",
                        item.ready ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700",
                      )}
                    >
                      {item.ready ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-faith-ink">{item.label}</div>
                      <div className="mt-1 text-[11px] text-faith-slate leading-5">{item.hint}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card
          title="Primary outputs and workflow value"
          subtitle="A standalone teaching should feel as premium and connected as any Series-based teaching flow."
          right={<Pill tone="brand">Provider value</Pill>}
        >
          <div className="grid gap-3 lg:grid-cols-3">
            {[
              "Creates a complete teaching record with or without a linked Live Session.",
              "Supports replay, clip, review, giving, event, and Beacon flows for one-off messages.",
              "Preserves future flexibility for ministries that teach both inside and outside Series.",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-faith-line bg-[var(--fh-surface)] p-4 text-[12px] leading-6 text-faith-slate">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }, [activeFormat.title, availableLanguages, draft, filteredSpeakers, readiness.checks, readiness.readyCount, readiness.score, speakerSearch, step]);

  return (
    <div className="min-h-screen bg-[var(--fh-page-bg)] text-faith-ink">
      <div className="mx-auto max-w-[1600px] px-6 py-6">
        <div className="rounded-[34px] border border-faith-line bg-[var(--fh-surface-bg)] p-6 shadow-soft">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-faith-slate">Provider Side</div>
              <div className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
                <ProviderPageTitle
                  icon={<Mic className="h-6 w-6" />}
                  title="Standalone Teaching Builder"
                  subtitle="Premium creator-style page for shaping a sermon or teaching that lives outside any Series or Episode while still supporting live delivery, replay packaging, clips, reviews, giving, and promotion."
                />
                <Pill tone="good">Standalone-first</Pill>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 xl:justify-end">
              <SoftButton onClick={() => setToast("Standalone teaching draft saved.")}>Save teaching draft</SoftButton>
              <PrimaryButton color="orange" onClick={() => {
                setDraft((current) => ({ ...current, liveEnabled: true, linkedLiveState: current.linkedLiveState === "Not created" ? "Draft" : current.linkedLiveState }));
                setStep("live");
                setToast("Live session path opened for this standalone teaching.");
              }}>
                Create live session
              </PrimaryButton>
              <PrimaryButton color="green" onClick={() => setToast("Teaching marked ready to publish.")}>Publish teaching</PrimaryButton>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)_440px]">
          <StepRail step={step} setStep={setStep} readinessScore={readiness.score} />

          <div className="min-w-0 space-y-4">{centerContent}</div>

          <div className="space-y-4 xl:sticky xl:top-6 self-start">
            <div className="rounded-[30px] border border-faith-line bg-[var(--fh-surface-bg)] p-4 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-faith-slate">Preview</div>
                  <div className="mt-1 text-[18px] font-black text-faith-ink">Standalone teaching landing page</div>
                </div>
                <div className="inline-flex rounded-full border border-faith-line bg-[var(--fh-surface)] p-1">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("desktop")}
                    className={cx(
                      "rounded-full px-3 py-1 text-[11px] font-bold transition-colors",
                      previewMode === "desktop" ? "bg-slate-900 text-white" : "text-faith-slate",
                    )}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("mobile")}
                    className={cx(
                      "rounded-full px-3 py-1 text-[11px] font-bold transition-colors",
                      previewMode === "mobile" ? "bg-slate-900 text-white" : "text-faith-slate",
                    )}
                  >
                    Mobile
                  </button>
                </div>
              </div>

              <div className="mt-4">
                {previewMode === "desktop" ? <DesktopTeachingPreview draft={draft} /> : <MobileTeachingPreview draft={draft} />}
              </div>
            </div>

            <div className="rounded-[30px] border border-faith-line bg-[var(--fh-surface-bg)] p-4 shadow-soft">
              <div className="text-[15px] font-black text-faith-ink">Premium notes</div>
              <div className="mt-3 space-y-3 text-[12px] leading-6 text-faith-slate">
                <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface)] p-3">
                  The teaching remains a first-class standalone object even when it links to a live session, event, giving campaign, crowdfund, FaithMart item, or Beacon campaign.
                </div>
                <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface)] p-3">
                  Live-first and upload-first are both premium paths. Teams can move from this page into Live Builder, Post-live Publishing, or Beacon without rebuilding the teaching record.
                </div>
                <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface)] p-3">
                  Convertible metadata keeps replays, clips, reviews, and promotions intact if the ministry later expands this one-off message into a bigger teaching campaign.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast ? (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}







