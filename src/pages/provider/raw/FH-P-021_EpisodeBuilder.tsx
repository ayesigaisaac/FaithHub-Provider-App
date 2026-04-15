// @ts-nocheck

"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  BookOpen,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Film,
  Layers3,
  Link2,
  Lock,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wand2,
  X,
  Zap,
} from "lucide-react";

/**
 * FaithHub â€” FH-P-021 Episode Builder
 * -----------------------------------
 * Premium provider page for shaping an episode inside a Series while still
 * giving it its own live, replay, resource, and audience journey.
 *
 * Design notes
 * - Creator-style shell: top action bar, left step rail, rich center workspace,
 *   sticky right-side preview.
 * - EVzone Green is primary. EVzone Orange is secondary.
 * - Includes embedded preview workflow (desktop/mobile) similar to the base file direction.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#0f172a";

const ROUTES = {
  seriesBuilder: "/faithhub/provider/series-builder",
  liveBuilder: "/faithhub/provider/live-builder",
  postLivePublishing: "/faithhub/provider/post-live-publishing",
  replaysAndClips: "/faithhub/provider/replays-clips",
};

const PRESET_BLUEPRINTS = [
  {
    id: "blueprint-sermon",
    title: "Standard sermon blueprint",
    subtitle: "Hook â†’ scripture â†’ teaching core â†’ response â†’ close.",
    accent: "green" as const,
  },
  {
    id: "blueprint-class",
    title: "Discipleship class blueprint",
    subtitle: "Teaching beats, discussion checkpoints, study resources, and recap.",
    accent: "orange" as const,
  },
  {
    id: "blueprint-watch",
    title: "Watch-party blueprint",
    subtitle: "Replay screening, moderated reflections, and guided next steps.",
    accent: "navy" as const,
  },
];

const ACCESS_MODELS = [
  "Public",
  "Follower-first",
  "Members only",
  "Supporter resources",
  "Private release",
];

const RELEASE_WINDOWS = [
  "Publish with linked live session",
  "Publish after main live ends",
  "Timed release after review",
  "Manual leadership release",
];

const AUDIENCE_TARGETS = [
  "Followers",
  "New guests",
  "Young adults",
  "Family ministry",
  "Supporters",
  "Leadership track",
];

const DISCOVERY_TOPICS = [
  "Hope",
  "Wilderness",
  "Faith in pressure",
  "Healing and restoration",
  "Prayer and endurance",
  "Practical discipleship",
  "Weekly challenge",
  "Community follow-up",
];

type StepKey =
  | "summary"
  | "structure"
  | "live"
  | "resources"
  | "access"
  | "collaboration"
  | "discovery"
  | "readiness";

type PreviewMode = "desktop" | "mobile";
type Accent = "green" | "orange" | "navy";
type ApprovalState = "Approved" | "Needs review" | "Changes requested";
type AttachmentStatus = "Ready" | "Draft" | "Scheduled";
type ResourceStatus = "Ready" | "Draft" | "Needs review";

type EpisodeBeat = {
  id: string;
  label: string;
  chapterLabel: string;
  durationLabel: string;
  note: string;
  assetExpectation: string;
  tone: "Core" | "Discussion" | "Response";
};

type LiveAttachment = {
  id: string;
  label: string;
  variant: "Preview session" | "Main live" | "Follow-up Q&A" | "Translated session";
  startLabel: string;
  language: string;
  destination: string;
  status: AttachmentStatus;
};

type ResourcePack = {
  id: string;
  title: string;
  kind:
    | "Outline"
    | "Study notes"
    | "Slides"
    | "Reading guide"
    | "Handout"
    | "FaithMart resource"
    | "Event resource";
  visibility: "Public" | "Supporters" | "Leaders";
  status: ResourceStatus;
};

type Collaborator = {
  id: string;
  name: string;
  role: "Pastor" | "Editor" | "Translator" | "Producer";
  state: ApprovalState;
  note: string;
};

type EpisodeDraft = {
  parentSeriesTitle: string;
  seriesArc: string;
  episodeNumber: number;
  title: string;
  focusStatement: string;
  scripture: string;
  teachingOutcomes: string[];
  presenterNotes: string;
  blueprintId: string;
  structure: EpisodeBeat[];
  liveAttachments: LiveAttachment[];
  resources: ResourcePack[];
  releaseWindow: string;
  accessModel: string;
  audienceTarget: string[];
  publicReplay: boolean;
  supporterOnlyResources: boolean;
  collaborators: Collaborator[];
  tags: string[];
  searchHints: string[];
  beaconSnippet: string;
  externalPromoSnippet: string;
  aiSummary: string[];
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1600&q=80";

const DEFAULT_STRUCTURE: EpisodeBeat[] = [
  {
    id: "beat-1",
    label: "Welcome + recap of last week",
    chapterLabel: "Chapter 1",
    durationLabel: "06 min",
    note: "Reconnect the audience to the narrative arc and establish the main tension.",
    assetExpectation: "Series recap card + lower third",
    tone: "Core",
  },
  {
    id: "beat-2",
    label: "Scripture reading and teaching frame",
    chapterLabel: "Chapter 2",
    durationLabel: "14 min",
    note: "Anchor the message in the key text and define the wilderness focus for this episode.",
    assetExpectation: "Scripture overlay + chapter marker",
    tone: "Core",
  },
  {
    id: "beat-3",
    label: "Discussion checkpoint",
    chapterLabel: "Chapter 3",
    durationLabel: "08 min",
    note: "Prompt reflection, questions, and community response moments.",
    assetExpectation: "Discussion prompt card",
    tone: "Discussion",
  },
  {
    id: "beat-4",
    label: "Prayer response and next steps",
    chapterLabel: "Chapter 4",
    durationLabel: "07 min",
    note: "Move from teaching into ministry response, application, and next-step direction.",
    assetExpectation: "Prayer CTA + response lower third",
    tone: "Response",
  },
];

const DEFAULT_LIVE_ATTACHMENTS: LiveAttachment[] = [
  {
    id: "live-1",
    label: "Episode preview room",
    variant: "Preview session",
    startLabel: "Thu Â· 18:30",
    language: "English",
    destination: "FaithHub + YouTube",
    status: "Ready",
  },
  {
    id: "live-2",
    label: "Main Sunday broadcast",
    variant: "Main live",
    startLabel: "Sun Â· 09:00",
    language: "English",
    destination: "FaithHub + Instagram",
    status: "Scheduled",
  },
  {
    id: "live-3",
    label: "Swahili translated follow-up",
    variant: "Translated session",
    startLabel: "Sun Â· 13:00",
    language: "Swahili",
    destination: "FaithHub only",
    status: "Draft",
  },
];

const DEFAULT_RESOURCES: ResourcePack[] = [
  {
    id: "res-1",
    title: "Week 2 teaching outline",
    kind: "Outline",
    visibility: "Public",
    status: "Ready",
  },
  {
    id: "res-2",
    title: "Wilderness study guide",
    kind: "Study notes",
    visibility: "Supporters",
    status: "Ready",
  },
  {
    id: "res-3",
    title: "Slides and discussion prompts",
    kind: "Slides",
    visibility: "Leaders",
    status: "Needs review",
  },
  {
    id: "res-4",
    title: "Reading guide for the week",
    kind: "Reading guide",
    visibility: "Public",
    status: "Draft",
  },
];

const DEFAULT_COLLABORATORS: Collaborator[] = [
  {
    id: "col-1",
    name: "Pastor Daniel M.",
    role: "Pastor",
    state: "Approved",
    note: "Teaching direction approved with minor scripture emphasis note.",
  },
  {
    id: "col-2",
    name: "Ruth K.",
    role: "Editor",
    state: "Needs review",
    note: "Replay package expectations still need final chapter naming.",
  },
  {
    id: "col-3",
    name: "Grace L.",
    role: "Translator",
    state: "Changes requested",
    note: "Swahili notes need simplified phrasing for discussion prompts.",
  },
];

const STEP_ITEMS: Array<{ key: StepKey; label: string }> = [
  { key: "summary", label: "Episode Summary" },
  { key: "structure", label: "Structure Block" },
  { key: "live", label: "Live Sessionz" },
  { key: "resources", label: "Resource Pack" },
  { key: "access", label: "Audience & Access" },
  { key: "collaboration", label: "Collaboration" },
  { key: "discovery", label: "Discovery Setup" },
  { key: "readiness", label: "Readiness" },
];

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function Pill({
  children,
  tone = "neutral",
  icon,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "good" | "warn" | "danger" | "brand";
  icon?: React.ReactNode;
}) {
  const toneCls =
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
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        toneCls,
      )}
      style={tone === "brand" ? { background: EV_GREEN } : undefined}
    >
      {icon}
      {children}
    </span>
  );
}

function SoftButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 transition-colors hover:bg-slate-50",
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
  tone = "green",
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: "green" | "orange";
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl border border-transparent px-4 py-2 text-[12px] font-bold text-white transition-opacity hover:opacity-95",
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
  highlight = false,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={cx(
        "rounded-3xl border bg-white p-4 transition-colors",
        highlight ? "border-emerald-200 shadow-[0_0_0_1px_rgba(3,205,140,0.12)]" : "border-slate-200",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[18px] font-black text-slate-900">{title}</div>
          {subtitle ? <div className="mt-1 text-[12px] text-slate-500">{subtitle}</div> : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-semibold text-slate-700">{children}</div>;
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 outline-none transition-colors focus:ring-2 focus:ring-emerald-200"
    />
  );
}

function TextArea({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 outline-none transition-colors focus:ring-2 focus:ring-emerald-200"
    />
  );
}

function StepNav({
  step,
  setStep,
  readinessScore,
}: {
  step: StepKey;
  setStep: (step: StepKey) => void;
  readinessScore: number;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4">
      <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-4 py-4">
        <div className="text-[16px] font-black text-slate-900">Episode Builder</div>
        <div className="mt-2 h-3 rounded-full bg-emerald-100">
          <div className="h-full rounded-full" style={{ width: `${readinessScore}%`, background: EV_GREEN }} />
        </div>
        <div className="mt-2 text-[11px] font-semibold text-emerald-700">{readinessScore}% ready</div>
      </div>

      <div className="mt-5 space-y-2">
        {STEP_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setStep(item.key)}
            className={cx(
              "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-[12px] font-semibold transition-colors",
              step === item.key
                ? "border-emerald-200 bg-emerald-50 text-slate-900"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
            )}
          >
            <span>{item.label}</span>
            {step === item.key ? <ChevronRight className="h-4 w-4 text-emerald-700" /> : null}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-[24px] border border-amber-200 bg-amber-50 px-4 py-4">
        <div className="text-[12px] font-black text-slate-900">Quick handoff</div>
        <div className="mt-3 space-y-2">
          <a href={ROUTES.seriesBuilder} className="flex items-center justify-between rounded-full border border-amber-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-amber-700">
            Series Builder <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a href={ROUTES.liveBuilder} className="flex items-center justify-between rounded-full border border-amber-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-amber-700">
            Live Builder <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a href={ROUTES.postLivePublishing} className="flex items-center justify-between rounded-full border border-amber-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-amber-700">
            Post-live Publishing <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a href={ROUTES.replaysAndClips} className="flex items-center justify-between rounded-full border border-amber-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-amber-700">
            Replays & Clips <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

function AccentDot({ accent }: { accent: Accent }) {
  return (
    <span
      className="inline-block h-2.5 w-2.5 rounded-full"
      style={{
        background:
          accent === "green" ? EV_GREEN : accent === "orange" ? EV_ORANGE : EV_NAVY,
      }}
    />
  );
}

function EpisodePreview({
  draft,
  previewMode,
  readinessScore,
}: {
  draft: EpisodeDraft;
  previewMode: PreviewMode;
  readinessScore: number;
}) {
  const nextLive = draft.liveAttachments[0];
  const highlightedResources = draft.resources.slice(0, 3);
  const highlightedBeats = draft.structure.slice(0, 3);

  if (previewMode === "mobile") {
    return (
      <div className="mx-auto w-full max-w-[320px] md:max-w-[360px] rounded-[34px] bg-slate-950 p-3 shadow-[0_20px_50px_rgba(15,23,42,0.24)]">
        <div className="overflow-hidden rounded-[28px] bg-[#fcfcfc]">
          <div className="relative h-[640px] overflow-hidden">
            <div className="absolute left-1/2 top-3 h-2 w-24 -translate-x-1/2 rounded-full bg-slate-900" />
            <div className="h-[205px] overflow-hidden bg-slate-900">
              <img src={HERO_IMAGE} alt="Episode cover" className="h-full w-full object-cover opacity-90" />
            </div>
            <div className="relative -mt-14 px-4 pb-4">
              <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <Pill tone="brand" icon={<Sparkles className="h-3 w-3" />}>
                    Episode live
                  </Pill>
                  <button className="text-[11px] font-semibold text-emerald-600">Share</button>
                </div>
                <div className="mt-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  {draft.parentSeriesTitle}
                </div>
                <div className="mt-1 text-[22px] font-black leading-tight text-slate-900">{draft.title}</div>
                <div className="mt-1 text-[12px] text-slate-500">{draft.focusStatement}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Pill tone="good">{draft.accessModel}</Pill>
                  <Pill tone="neutral">Week {draft.episodeNumber}</Pill>
                  <Pill tone="warn">{draft.liveAttachments.length} lives linked</Pill>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Next live</div>
                  <div className="mt-2 text-[14px] font-bold text-slate-900">{nextLive?.label || "Live attachment pending"}</div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    {nextLive ? `${nextLive.variant} Â· ${nextLive.startLabel} Â· ${nextLive.language}` : "Attach preview and main live sessions."}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {highlightedResources.map((resource) => (
                    <div key={resource.id} className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
                      <div className="text-[11px] font-semibold text-slate-400">{resource.kind}</div>
                      <div className="text-[12px] font-bold text-slate-900">{resource.title}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 rounded-2xl px-3 py-2 text-[12px] font-bold text-white" style={{ background: EV_GREEN }}>
                    Join live
                  </button>
                  <button className="flex-1 rounded-2xl px-3 py-2 text-[12px] font-bold text-white" style={{ background: EV_ORANGE }}>
                    Save reminder
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-700">
              Episode readiness Â· {readinessScore}% complete
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-[1.18fr_0.82fr]">
        <div className="relative min-h-[430px] overflow-hidden bg-slate-900">
          <img src={HERO_IMAGE} alt="Episode cover" className="h-full w-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent" />
          <div className="absolute left-5 top-5 flex flex-wrap gap-2">
            <Pill tone="brand" icon={<Film className="h-3 w-3" />}>
              FaithHub Episode
            </Pill>
            <Pill tone="good">{draft.accessModel}</Pill>
            <Pill tone="warn">{draft.liveAttachments.length} sessions linked</Pill>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/70">
              {draft.parentSeriesTitle} Â· Week {draft.episodeNumber}
            </div>
            <div className="mt-2 text-[34px] font-black leading-[1.04]">{draft.title}</div>
            <div className="mt-2 max-w-[85%] text-[14px] text-white/85">{draft.focusStatement}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {draft.audienceTarget.slice(0, 3).map((audience) => (
                <span key={audience} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white">
                  {audience}
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <button className="rounded-2xl px-4 py-2 text-[12px] font-bold text-white" style={{ background: EV_GREEN }}>
                Join session
              </button>
              <button className="rounded-2xl px-4 py-2 text-[12px] font-bold text-white" style={{ background: EV_ORANGE }}>
                Episode resources
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#fafafa] p-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Episode journey</div>
                <div className="mt-1 text-[14px] font-bold text-slate-900">Live, replay, and resources</div>
              </div>
              <Pill tone="neutral">{highlightedBeats.length} chapters shown</Pill>
            </div>

            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Primary live</div>
              <div className="mt-2 text-[13px] font-bold text-slate-900">{nextLive?.label || "Main live pending"}</div>
              <div className="mt-1 text-[11px] text-slate-500">
                {nextLive ? `${nextLive.startLabel} Â· ${nextLive.destination} Â· ${nextLive.status}` : "Attach live session details."}
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {highlightedBeats.map((beat) => (
                <div key={beat.id} className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[11px] font-black text-slate-400">{beat.chapterLabel}</div>
                    <div className="text-[11px] font-semibold text-slate-500">{beat.durationLabel}</div>
                  </div>
                  <div className="mt-1 text-[13px] font-bold text-slate-900">{beat.label}</div>
                  <div className="mt-1 text-[11px] text-slate-500">{beat.assetExpectation}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Resources & discovery</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {highlightedResources.map((resource) => (
                  <span key={resource.id} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700">
                    {resource.kind}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {draft.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700">
                    #{tag}
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

function scoreReadiness(draft: EpisodeDraft) {
  const checks = [
    Boolean(draft.parentSeriesTitle),
    Boolean(draft.title),
    Boolean(draft.focusStatement),
    Boolean(draft.scripture),
    draft.teachingOutcomes.length >= 2,
    draft.structure.length >= 3,
    draft.liveAttachments.length >= 1,
    draft.resources.length >= 2,
    draft.collaborators.length >= 1,
    draft.tags.length >= 3,
    Boolean(draft.beaconSnippet),
  ];

  const hits = checks.filter(Boolean).length;
  return Math.round((hits / checks.length) * 100);
}

export default function EpisodeBuilderPage() {
  const [step, setStep] = useState<StepKey>("structure");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [searchValue, setSearchValue] = useState("");
  const [newOutcome, setNewOutcome] = useState("");
  const [newTag, setNewTag] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const [draft, setDraft] = useState<EpisodeDraft>({
    parentSeriesTitle: "Practicing the Way of Hope",
    seriesArc: "Renewal â†’ Endurance â†’ Healing â†’ Community â†’ Witness",
    episodeNumber: 2,
    title: "Week 2 Â· Hope in the Wilderness",
    focusStatement:
      "Help the audience understand how God forms endurance, trust, and practical hope in seasons of pressure.",
    scripture: "Exodus 16 Â· Romans 5 Â· James 1",
    teachingOutcomes: [
      "Name the spiritual purpose of wilderness seasons.",
      "Recognize two practical responses to pressure and delay.",
      "Leave with a prayer and discussion next step for the week.",
    ],
    presenterNotes:
      "Keep the opening connected to Week 1. The replay should feel navigable, with clean chapter markers and a strong response moment near the close.",
    blueprintId: "blueprint-sermon",
    structure: DEFAULT_STRUCTURE,
    liveAttachments: DEFAULT_LIVE_ATTACHMENTS,
    resources: DEFAULT_RESOURCES,
    releaseWindow: RELEASE_WINDOWS[1],
    accessModel: ACCESS_MODELS[0],
    audienceTarget: ["Followers", "Young adults", "Family ministry"],
    publicReplay: true,
    supporterOnlyResources: true,
    collaborators: DEFAULT_COLLABORATORS,
    tags: ["hope", "wilderness", "endurance", "discipleship"],
    searchHints: ["week 2 hope", "wilderness teaching", "episode sermon", "faith in pressure"],
    beaconSnippet:
      "Week 2 explores how faith survives the wilderness. Promote as a replay teaser and reminder-driven episode launch.",
    externalPromoSnippet:
      "This episode moves from scripture into practical next steps, making it ideal for reminder campaigns and replay discovery.",
    aiSummary: [
      "Lead with recap, then frame the wilderness tension early.",
      "Promote the discussion checkpoint as a shareable community moment.",
      "Mark the prayer response as the cleanest replay-to-clip transition point.",
    ],
  });

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const readinessScore = useMemo(() => scoreReadiness(draft), [draft]);

  const selectedBlueprint = useMemo(
    () => PRESET_BLUEPRINTS.find((item) => item.id === draft.blueprintId) || PRESET_BLUEPRINTS[0],
    [draft.blueprintId],
  );

  const highlightedStructureDuration = useMemo(() => {
    const totalMinutes = draft.structure
      .map((beat) => parseInt(beat.durationLabel, 10))
      .filter((value) => Number.isFinite(value))
      .reduce((sum, value) => sum + value, 0);

    return `${totalMinutes} min`;
  }, [draft.structure]);

  const filteredTopics = useMemo(() => {
    if (!searchValue.trim()) return DISCOVERY_TOPICS;
    const query = searchValue.trim().toLowerCase();
    return DISCOVERY_TOPICS.filter((topic) => topic.toLowerCase().includes(query));
  }, [searchValue]);

  const addTeachingOutcome = () => {
    const value = newOutcome.trim();
    if (!value) return;
    setDraft((current) => ({
      ...current,
      teachingOutcomes: [...current.teachingOutcomes, value],
    }));
    setNewOutcome("");
    setToast("Teaching outcome added.");
  };

  const removeTeachingOutcome = (value: string) => {
    setDraft((current) => ({
      ...current,
      teachingOutcomes: current.teachingOutcomes.filter((item) => item !== value),
    }));
  };

  const addStructureBeat = () => {
    setDraft((current) => ({
      ...current,
      structure: [
        ...current.structure,
        {
          id: `beat-${Math.random().toString(16).slice(2, 8)}`,
          label: "New episode beat",
          chapterLabel: `Chapter ${current.structure.length + 1}`,
          durationLabel: "05 min",
          note: "Add the beat purpose, chapter note, and replay expectation.",
          assetExpectation: "Chapter card + key visual",
          tone: "Core",
        },
      ],
    }));
    setToast("Episode beat added.");
  };

  const addLiveAttachment = () => {
    setDraft((current) => ({
      ...current,
      liveAttachments: [
        ...current.liveAttachments,
        {
          id: `live-${Math.random().toString(16).slice(2, 8)}`,
          label: "Follow-up Q&A room",
          variant: "Follow-up Q&A",
          startLabel: "Mon Â· 19:00",
          language: "English",
          destination: "FaithHub only",
          status: "Draft",
        },
      ],
    }));
    setToast("Live session attached.");
  };

  const addResource = () => {
    setDraft((current) => ({
      ...current,
      resources: [
        ...current.resources,
        {
          id: `res-${Math.random().toString(16).slice(2, 8)}`,
          title: "New resource pack item",
          kind: "Handout",
          visibility: "Public",
          status: "Draft",
        },
      ],
    }));
    setToast("Resource item added.");
  };

  const addTag = () => {
    const value = newTag.trim().replace(/^#/, "");
    if (!value) return;
    if (draft.tags.includes(value)) {
      setToast("Tag already exists.");
      setNewTag("");
      return;
    }
    setDraft((current) => ({
      ...current,
      tags: [...current.tags, value],
    }));
    setNewTag("");
    setToast("Discovery tag added.");
  };

  const activeCard = (key: StepKey) => step === key;

  return (
    <div className="min-h-screen bg-[#f2f2f2] p-4 text-slate-900 sm:p-6 xl:p-10">
      <div className="mx-auto max-w-[1520px]">
        <div className="rounded-[32px] border border-slate-200 bg-white px-7 py-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                FaithHub Provider Side
              </div>
              <div className="mt-2 text-[34px] font-black leading-[1.02] text-slate-900 sm:text-[40px]">
                FaithHub â€” Episode Builder
              </div>
              <div className="mt-1 text-[15px] text-slate-500">
                Premium creator-style episode workflow with embedded landing-page preview.
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <SoftButton onClick={() => setToast("Episode saved as draft.")}>Save episode</SoftButton>
              <PrimaryButton tone="orange" onClick={addLiveAttachment}>
                Attach live session
              </PrimaryButton>
              <PrimaryButton tone="green" onClick={() => setToast("Episode published.")}>
                Publish episode
              </PrimaryButton>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[242px_minmax(0,1fr)_500px]">
          <aside>
            <StepNav step={step} setStep={setStep} readinessScore={readinessScore} />
          </aside>

          <main className="space-y-6">
            <Card
              title="Episode summary panel"
              subtitle="Set the episode title, focus statement, scripture, outcomes, and presenter notes while inheriting the Series identity."
              highlight={activeCard("summary")}
              right={
                <Pill tone="brand" icon={<Layers3 className="h-3.5 w-3.5" />}>
                  Series-linked
                </Pill>
              }
            >
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Parent Series</Label>
                      <Input
                        value={draft.parentSeriesTitle}
                        onChange={(value) => setDraft((current) => ({ ...current, parentSeriesTitle: value }))}
                      />
                    </div>
                    <div>
                      <Label>Episode title</Label>
                      <Input value={draft.title} onChange={(value) => setDraft((current) => ({ ...current, title: value }))} />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[140px_minmax(0,1fr)]">
                    <div>
                      <Label>Sequence</Label>
                      <Input
                        value={String(draft.episodeNumber)}
                        onChange={(value) =>
                          setDraft((current) => ({
                            ...current,
                            episodeNumber: Math.max(1, Number(value || 1)),
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Focus statement</Label>
                      <Input
                        value={draft.focusStatement}
                        onChange={(value) => setDraft((current) => ({ ...current, focusStatement: value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Scripture / core idea</Label>
                    <Input
                      value={draft.scripture}
                      onChange={(value) => setDraft((current) => ({ ...current, scripture: value }))}
                    />
                  </div>

                  <div>
                    <Label>Presenter notes</Label>
                    <TextArea
                      rows={4}
                      value={draft.presenterNotes}
                      onChange={(value) => setDraft((current) => ({ ...current, presenterNotes: value }))}
                    />
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-emerald-600" />
                    <div className="text-[16px] font-black text-slate-900">Episode blueprint</div>
                  </div>
                  <div className="mt-3 space-y-2">
                    {PRESET_BLUEPRINTS.map((blueprint) => (
                      <button
                        key={blueprint.id}
                        type="button"
                        onClick={() => setDraft((current) => ({ ...current, blueprintId: blueprint.id }))}
                        className={cx(
                          "w-full rounded-2xl border px-4 py-3 text-left transition-colors",
                          draft.blueprintId === blueprint.id
                            ? "border-emerald-200 bg-white"
                            : "border-slate-200 bg-transparent hover:bg-white",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <AccentDot accent={blueprint.accent} />
                          <div className="text-[13px] font-bold text-slate-900">{blueprint.title}</div>
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500">{blueprint.subtitle}</div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Series inheritance</div>
                    <div className="mt-2 text-[12px] font-bold text-slate-900">{draft.parentSeriesTitle}</div>
                    <div className="mt-1 text-[11px] text-slate-500">{draft.seriesArc}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Pill tone="good">Brand inherited</Pill>
                      <Pill tone="neutral">Localization inherited</Pill>
                      <Pill tone="warn">Episode-specific live path</Pill>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="text-[16px] font-black text-slate-900">Teaching outcomes</div>
                    <div className="mt-1 text-[12px] text-slate-500">
                      Define what the audience should understand, practice, or carry forward after this episode.
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      value={newOutcome}
                      onChange={(event) => setNewOutcome(event.target.value)}
                      placeholder="Add outcome"
                      className="w-[220px] rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                    <PrimaryButton tone="orange" onClick={addTeachingOutcome}>
                      <Plus className="h-4 w-4" /> Add
                    </PrimaryButton>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {draft.teachingOutcomes.map((outcome) => (
                    <button
                      key={outcome}
                      type="button"
                      onClick={() => removeTeachingOutcome(outcome)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      {outcome}
                      <X className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <Card
                title="Episode structure block"
                subtitle="Define the flow, chapter markers, discussion beats, and what the finished replay package should contain."
                highlight={activeCard("structure")}
                right={
                  <div className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800">
                    {highlightedStructureDuration} total
                  </div>
                }
              >
                <div className="space-y-3">
                  {draft.structure.map((beat) => (
                    <div key={beat.id} className="rounded-[24px] border border-slate-200 bg-white px-4 py-3">
                      <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-black text-white">
                              {beat.chapterLabel}
                            </div>
                            <Pill tone={beat.tone === "Response" ? "good" : beat.tone === "Discussion" ? "warn" : "neutral"}>
                              {beat.tone}
                            </Pill>
                          </div>
                          <div className="mt-2 text-[14px] font-black text-slate-900">{beat.label}</div>
                          <div className="mt-1 text-[12px] text-slate-500">{beat.note}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[12px] font-black text-slate-900">{beat.durationLabel}</div>
                          <div className="mt-1 text-[11px] text-slate-500">{beat.assetExpectation}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <div className="text-[14px] font-black text-slate-900">Replay package expectation</div>
                    <div className="mt-1 text-[12px] text-slate-500">
                      Clean opening, clear chapter naming, searchable scripture references, and a replay-ready response moment.
                    </div>
                  </div>
                  <PrimaryButton tone="orange" onClick={addStructureBeat}>
                    <Plus className="h-4 w-4" /> Add beat
                  </PrimaryButton>
                </div>
              </Card>

              <Card
                title="AI outline + chapter suggestions"
                subtitle="Use structured suggestions to speed editorial prep without replacing ministry judgment."
                highlight={activeCard("structure")}
                right={
                  <SoftButton onClick={() => setToast("Outline suggestions refreshed.")}>
                    <Wand2 className="h-4 w-4" /> Refresh
                  </SoftButton>
                }
              >
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    <div className="text-[14px] font-black text-slate-900">Suggested editorial notes</div>
                  </div>

                  <div className="mt-3 space-y-2">
                    {draft.aiSummary.map((note) => (
                      <div key={note} className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-[12px] text-slate-700">
                        {note}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
                    <div className="text-[12px] font-black text-slate-900">Multiple Live Sessionz supported</div>
                    <div className="mt-1 text-[11px] text-emerald-700">
                      This episode can carry preview, main broadcast, follow-up Q&A, or translated sessions under one teaching destination.
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card
              title="Live Sessionz attachment rail"
              subtitle="Attach one or many live sessions to the episode, including preview, main live, watch-party, or translated follow-up moments."
              highlight={activeCard("live")}
              right={
                <PrimaryButton tone="orange" onClick={addLiveAttachment}>
                  <Plus className="h-4 w-4" /> Attach live session
                </PrimaryButton>
              }
            >
              <div className="grid gap-3 lg:grid-cols-3">
                {draft.liveAttachments.map((session) => (
                  <div key={session.id} className="rounded-[24px] border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-2">
                      <Pill tone={session.status === "Ready" ? "good" : session.status === "Scheduled" ? "warn" : "neutral"}>
                        {session.status}
                      </Pill>
                      <div className="text-[11px] font-semibold text-slate-500">{session.language}</div>
                    </div>
                    <div className="mt-3 text-[14px] font-black text-slate-900">{session.label}</div>
                    <div className="mt-1 text-[12px] text-slate-500">{session.variant}</div>
                    <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-[12px] text-slate-700">
                      {session.startLabel} Â· {session.destination}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="text-[14px] font-black text-slate-900">One-click transition options</div>
                    <div className="mt-1 text-[12px] text-slate-500">
                      Move straight from episode editing into live setup, studio launch, or post-live publishing without rebuilding context.
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <SoftButton>
                      <Film className="h-4 w-4" /> Open Live Builder
                    </SoftButton>
                    <SoftButton>
                      <Zap className="h-4 w-4" /> Post-live handoff
                    </SoftButton>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid gap-6 lg:grid-cols-[1.06fr_0.94fr]">
              <Card
                title="Resource pack builder"
                subtitle="Add outlines, study notes, slides, reading guides, downloadable handouts, and related event or FaithMart resources."
                highlight={activeCard("resources")}
                right={
                  <PrimaryButton tone="orange" onClick={addResource}>
                    <Plus className="h-4 w-4" /> Add resource
                  </PrimaryButton>
                }
              >
                <div className="space-y-3">
                  {draft.resources.map((resource) => (
                    <div key={resource.id} className="rounded-[24px] border border-slate-200 bg-white px-4 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-[13px] font-black text-slate-900">{resource.title}</div>
                          <div className="mt-1 text-[12px] text-slate-500">
                            {resource.kind} Â· {resource.visibility}
                          </div>
                        </div>
                        <Pill tone={resource.status === "Ready" ? "good" : resource.status === "Needs review" ? "warn" : "neutral"}>
                          {resource.status}
                        </Pill>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card
                title="Audience and access controls"
                subtitle="Control release timing, viewing permissions, supporter-only resources, and how public or gated the episode should be."
                highlight={activeCard("access")}
              >
                <div className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Release timing</Label>
                      <select
                        value={draft.releaseWindow}
                        onChange={(event) => setDraft((current) => ({ ...current, releaseWindow: event.target.value }))}
                        className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-900"
                      >
                        {RELEASE_WINDOWS.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Access model</Label>
                      <select
                        value={draft.accessModel}
                        onChange={(event) => setDraft((current) => ({ ...current, accessModel: event.target.value }))}
                        className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-900"
                      >
                        {ACCESS_MODELS.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label>Audience targeting</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {AUDIENCE_TARGETS.map((target) => {
                        const active = draft.audienceTarget.includes(target);
                        return (
                          <button
                            key={target}
                            type="button"
                            onClick={() =>
                              setDraft((current) => ({
                                ...current,
                                audienceTarget: active
                                  ? current.audienceTarget.filter((item) => item !== target)
                                  : [...current.audienceTarget, target],
                              }))
                            }
                            className={cx(
                              "rounded-full border px-3 py-2 text-[12px] font-semibold transition-colors",
                              active
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                            )}
                          >
                            {target}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <button
                      type="button"
                      onClick={() => setDraft((current) => ({ ...current, publicReplay: !current.publicReplay }))}
                      className={cx(
                        "flex items-start justify-between rounded-[24px] border p-4 text-left transition-colors",
                        draft.publicReplay
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-slate-200 bg-white hover:bg-slate-50",
                      )}
                    >
                      <div>
                        <div className="text-[13px] font-black text-slate-900">Public replay when live ends</div>
                        <div className="mt-1 text-[12px] text-slate-500">
                          Automatically expose replay access according to the release timing above.
                        </div>
                      </div>
                      <div className="rounded-full border border-white/60 bg-white px-3 py-1 text-[11px] font-bold text-slate-900">
                        {draft.publicReplay ? "On" : "Off"}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          supporterOnlyResources: !current.supporterOnlyResources,
                        }))
                      }
                      className={cx(
                        "flex items-start justify-between rounded-[24px] border p-4 text-left transition-colors",
                        draft.supporterOnlyResources
                          ? "border-amber-200 bg-amber-50"
                          : "border-slate-200 bg-white hover:bg-slate-50",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Lock className="mt-0.5 h-4 w-4 text-amber-700" />
                        <div>
                          <div className="text-[13px] font-black text-slate-900">Supporter-only resources</div>
                          <div className="mt-1 text-[12px] text-slate-500">
                            Keep premium study notes, slides, or handouts behind supporter access while the replay stays public.
                          </div>
                        </div>
                      </div>
                      <div className="rounded-full border border-white/60 bg-white px-3 py-1 text-[11px] font-bold text-slate-900">
                        {draft.supporterOnlyResources ? "Enabled" : "Open"}
                      </div>
                    </button>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <Card
                title="Collaboration and review lane"
                subtitle="Coordinate pastors, editors, translators, and producers before the episode is finalized."
                highlight={activeCard("collaboration")}
                right={
                  <Pill tone="neutral" icon={<Users className="h-3.5 w-3.5" />}>
                    {draft.collaborators.length} collaborators
                  </Pill>
                }
              >
                <div className="space-y-3">
                  {draft.collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="rounded-[24px] border border-slate-200 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[13px] font-black text-slate-900">{collaborator.name}</div>
                          <div className="mt-1 text-[12px] text-slate-500">{collaborator.role}</div>
                        </div>
                        <Pill
                          tone={
                            collaborator.state === "Approved"
                              ? "good"
                              : collaborator.state === "Changes requested"
                                ? "warn"
                                : "neutral"
                          }
                        >
                          {collaborator.state}
                        </Pill>
                      </div>
                      <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-[12px] text-slate-700">
                        {collaborator.note}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-slate-700" />
                    <div className="text-[13px] font-black text-slate-900">Approval routing</div>
                  </div>
                  <div className="mt-2 text-[12px] text-slate-500">
                    Editorial must approve chapters, translation must approve localized notes, and production must approve live attachments before publishing.
                  </div>
                </div>
              </Card>

              <Card
                title="Metadata and discovery setup"
                subtitle="Tune tags, topics, search hints, recommendations, and external promotion snippets."
                highlight={activeCard("discovery")}
                right={
                  <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600">
                    <Search className="h-3.5 w-3.5" /> Discoverability
                  </div>
                }
              >
                <div className="grid gap-4">
                  <div>
                    <Label>Topic search</Label>
                    <div className="mt-1 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                      <Search className="h-4 w-4 text-slate-400" />
                      <input
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                        placeholder="Search discovery topics"
                        className="w-full bg-transparent text-[12px] text-slate-900 outline-none"
                      />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {filteredTopics.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => {
                            if (draft.tags.includes(topic.toLowerCase())) return;
                            setDraft((current) => ({
                              ...current,
                              tags: [...current.tags, topic.toLowerCase()],
                            }));
                            setToast(`Added #${topic.toLowerCase()}`);
                          }}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-white"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <div className="mt-2 flex gap-2">
                      <input
                        value={newTag}
                        onChange={(event) => setNewTag(event.target.value)}
                        placeholder="Add tag"
                        className="w-[220px] rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200"
                      />
                      <PrimaryButton tone="orange" onClick={addTag}>
                        <Plus className="h-4 w-4" /> Add tag
                      </PrimaryButton>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {draft.tags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() =>
                            setDraft((current) => ({
                              ...current,
                              tags: current.tags.filter((value) => value !== tag),
                            }))
                          }
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          #{tag}
                          <X className="h-3.5 w-3.5 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>External promotion snippet</Label>
                      <TextArea
                        rows={4}
                        value={draft.externalPromoSnippet}
                        onChange={(value) => setDraft((current) => ({ ...current, externalPromoSnippet: value }))}
                      />
                    </div>
                    <div>
                      <Label>Beacon / notification snippet</Label>
                      <TextArea
                        rows={4}
                        value={draft.beaconSnippet}
                        onChange={(value) => setDraft((current) => ({ ...current, beaconSnippet: value }))}
                      />
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <div className="text-[13px] font-black text-slate-900">Search hints</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {draft.searchHints.map((hint) => (
                        <span key={hint} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700">
                          {hint}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card
              title="Progress and readiness tracker"
              subtitle="See what is missing before the episode can publish or before a linked live session can safely run."
              highlight={activeCard("readiness")}
              right={
                <Pill tone={readinessScore >= 85 ? "good" : readinessScore >= 60 ? "warn" : "danger"} icon={<CheckCircle2 className="h-3.5 w-3.5" />}>
                  {readinessScore}% complete
                </Pill>
              }
            >
              <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <div className="text-[13px] font-black text-slate-900">Readiness summary</div>
                  <div className="mt-3 h-3 rounded-full bg-slate-200">
                    <div className="h-full rounded-full" style={{ width: `${readinessScore}%`, background: readinessScore >= 85 ? EV_GREEN : EV_ORANGE }} />
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2">
                      <span className="text-[12px] font-semibold text-slate-700">Blueprint</span>
                      <span className="text-[12px] font-black text-slate-900">{selectedBlueprint.title}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2">
                      <span className="text-[12px] font-semibold text-slate-700">Linked live sessions</span>
                      <span className="text-[12px] font-black text-slate-900">{draft.liveAttachments.length}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2">
                      <span className="text-[12px] font-semibold text-slate-700">Resource items</span>
                      <span className="text-[12px] font-black text-slate-900">{draft.resources.length}</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      label: "Episode summary complete",
                      ok: Boolean(draft.title && draft.focusStatement && draft.scripture),
                    },
                    {
                      label: "Structure ready for chapters",
                      ok: draft.structure.length >= 3,
                    },
                    {
                      label: "Live Sessionz attached",
                      ok: draft.liveAttachments.length >= 1,
                    },
                    {
                      label: "Resource pack sufficient",
                      ok: draft.resources.length >= 2,
                    },
                    {
                      label: "Audience and access set",
                      ok: Boolean(draft.accessModel && draft.releaseWindow),
                    },
                    {
                      label: "Collaborators assigned",
                      ok: draft.collaborators.length >= 1,
                    },
                    {
                      label: "Discovery metadata set",
                      ok: draft.tags.length >= 3 && Boolean(draft.beaconSnippet),
                    },
                    {
                      label: "Post-live handoff ready",
                      ok: draft.publicReplay,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={cx(
                        "rounded-[24px] border p-4",
                        item.ok ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {item.ok ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                        ) : (
                          <ShieldCheck className="h-4 w-4 text-amber-700" />
                        )}
                        <div className="text-[12px] font-black text-slate-900">{item.label}</div>
                      </div>
                      <div className="mt-2 text-[11px] text-slate-600">
                        {item.ok ? "Ready" : "Still needs attention"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </main>

          <aside className="min-h-0">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Preview</div>
                    <div className="mt-1 text-[18px] font-black text-slate-900">Episode landing page</div>
                  </div>
                  <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
                    <button
                      type="button"
                      onClick={() => setPreviewMode("desktop")}
                      className={cx(
                        "rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors",
                        previewMode === "desktop" ? "text-white" : "text-slate-600",
                      )}
                      style={previewMode === "desktop" ? { background: EV_GREEN } : undefined}
                    >
                      Desktop
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode("mobile")}
                      className={cx(
                        "rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors",
                        previewMode === "mobile" ? "text-white" : "text-slate-600",
                      )}
                      style={previewMode === "mobile" ? { background: EV_ORANGE } : undefined}
                    >
                      Mobile
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <EpisodePreview draft={draft} previewMode={previewMode} readinessScore={readinessScore} />
                </div>
              </div>

              <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-emerald-600" />
                  <div className="text-[14px] font-black text-slate-900">Premium notes</div>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-[12px] text-slate-700">
                    Keep the episode inheritance clean: series artwork and access defaults carry over, but chaptering, resources, and live attachments remain episode-specific.
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-[12px] text-slate-700">
                    Multiple Live Sessionz let the ministry run a preview stream, the main broadcast, and a translated or Q&A follow-up under one episode destination.
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-[12px] text-slate-700">
                    Post-live publishing should inherit chapter markers, resource visibility, and discovery metadata to speed replay and clip packaging.
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {toast ? (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white shadow-[0_12px_24px_rgba(15,23,42,0.2)]">
            {toast}
          </div>
        ) : null}
      </div>
    </div>
  );
}


