// @ts-nocheck

"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronRight,
  Eye,
  FileAudio,
  FileBadge2,
  FileText,
  Globe2,
  Image as ImageIcon,
  Languages,
  Layers3,
  Link2,
  Lock,
  Megaphone,
  MonitorSmartphone,
  Package,
  PlayCircle,
  Plus,
  Rocket,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wand2,
  Workflow,
  Zap,
} from "lucide-react";
import { handleRawPlaceholderAction } from "./placeholderActions";
import { navigateWithRouter } from "@/navigation/routerNavigate";

/**
 * FaithHub — FH-P-024 Book Builder
 * --------------------------------
 * Premium Provider-side book creation page.
 *
 * Design goals
 * - Dedicated full-page builder launched from FH-P-023 Books Manager via "+ New Book".
 * - Premium creator-style layout with strong hierarchy, sticky preview rail, and launch-ready review gate.
 * - EVzone Green as the primary accent and Orange as the secondary accent.
 * - Support devotional / study guide / manual / course reader flows from the same builder.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#0f172a";

const ROUTES = {
  booksManager: "/faithhub/provider/books-manager",
  audienceNotifications: "/faithhub/provider/audience-notifications",
  beaconBuilder: "/faithhub/provider/beacon-builder",
  liveBuilder: "/faithhub/provider/live-builder",
};

const COVER_1 =
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80";
const COVER_2 =
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80";
const COVER_3 =
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80";
const COVER_4 =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80";

type TemplateKey =
  | "tpl-devotional"
  | "tpl-guide"
  | "tpl-manual"
  | "tpl-reader";
type StepKey =
  | "foundation"
  | "formats"
  | "structure"
  | "cover"
  | "access"
  | "localization"
  | "promotion"
  | "review";
type BookKind =
  | "Devotional"
  | "Study Guide"
  | "Manual"
  | "eBook"
  | "Prayer Journal"
  | "Course Reader";
type AccessModel =
  | "Free"
  | "Follower-first"
  | "Supporter"
  | "Paid"
  | "Internal";
type FormatKind = "PDF" | "ePub" | "Audio" | "Print" | "Web Reader";
type PreviewMode = "desktop" | "mobile";
type TranslationStatus = "Draft" | "In review" | "Ready";

type ChapterItem = {
  id: string;
  title: string;
  summary: string;
  pagesLabel: string;
  tags: string[];
};

type ResourceItem = {
  id: string;
  label: string;
  type: "Guide" | "Slide deck" | "Reading plan" | "Worksheet" | "Link";
  status: "Attached" | "Draft" | "Needs update";
};

type TranslationVariant = {
  id: string;
  language: string;
  localizedTitle: string;
  localizedSubtitle: string;
  status: TranslationStatus;
};

type BookDraft = {
  templateId: TemplateKey;
  title: string;
  subtitle: string;
  author: string;
  kind: BookKind;
  audienceFit: string;
  themeScripture: string;
  promise: string;
  description: string;
  tone: string;
  tags: string[];
  coverUrl: string;
  altCoverUrl: string;
  coverAltText: string;
  heroQuote: string;
  accentTone: "Green" | "Orange" | "Navy";
  importMode: "Import manuscript" | "Compose in builder";
  sourceFiles: string[];
  formats: FormatKind[];
  chapterItems: ChapterItem[];
  resources: ResourceItem[];
  accessModel: AccessModel;
  price: number;
  currency: "$" | "£" | "₦";
  sampleEnabled: boolean;
  downloadsEnabled: boolean;
  discoverable: boolean;
  publishMode: "Draft" | "Schedule" | "Ready to publish";
  scheduledAt: string;
  locales: TranslationVariant[];
  ctaText: string;
  notificationsReady: boolean;
  beaconReady: boolean;
  liveCompanionReady: boolean;
  linkedEvent: string;
  linkedFund: string;
  slug: string;
  approvals: {
    design: boolean;
    accessibility: boolean;
    doctrine: boolean;
    rights: boolean;
  };
};

type TemplatePreset = {
  id: TemplateKey;
  title: string;
  subtitle: string;
  kind: BookKind;
  coverUrl: string;
  accentTone: "Green" | "Orange" | "Navy";
  audienceFit: string;
  tone: string;
  themeScripture: string;
  promise: string;
  description: string;
  defaultFormats: FormatKind[];
  chapterSeed: ChapterItem[];
  resources: ResourceItem[];
};

const TEMPLATE_LIBRARY: Record<TemplateKey, TemplatePreset> = {
  "tpl-devotional": {
    id: "tpl-devotional",
    title: "Daily devotional",
    subtitle: "Short daily readings with prayer prompts and soft follow-up journeys.",
    kind: "Devotional",
    coverUrl: COVER_1,
    accentTone: "Green",
    audienceFit: "Daily readers, prayer groups, new believers, and digital-first followers",
    tone: "Warm, reflective, scripture-first",
    themeScripture: "Psalm 51 · Renewal and spiritual reset",
    promise:
      "Help readers return to prayer, repentance, and steady spiritual rhythm through short guided reading moments.",
    description:
      "A premium daily devotional package with readable chapters, reflection prompts, gentle next steps, and support for mobile reading, download, and scheduled release.",
    defaultFormats: ["PDF", "ePub", "Audio", "Web Reader"],
    chapterSeed: [
      {
        id: "chap-dev-1",
        title: "Day 1 · Return with humility",
        summary: "Open the journey with repentance, stillness, and a clear spiritual reset.",
        pagesLabel: "6 pages",
        tags: ["Prayer", "Reset"],
      },
      {
        id: "chap-dev-2",
        title: "Day 2 · Prayer in hidden places",
        summary: "Guide readers into quiet prayer habits that sustain private devotion.",
        pagesLabel: "5 pages",
        tags: ["Prayer", "Discipline"],
      },
      {
        id: "chap-dev-3",
        title: "Day 3 · Grace for weak days",
        summary: "Create a compassionate devotional rhythm for inconsistent readers.",
        pagesLabel: "6 pages",
        tags: ["Grace", "Encouragement"],
      },
    ],
    resources: [
      {
        id: "res-dev-1",
        label: "30-day reading tracker",
        type: "Worksheet",
        status: "Attached",
      },
      {
        id: "res-dev-2",
        label: "Morning prayer audio",
        type: "Guide",
        status: "Draft",
      },
    ],
  },
  "tpl-guide": {
    id: "tpl-guide",
    title: "Study guide",
    subtitle: "Episode-linked questions, notes, scripture references, and group prompts.",
    kind: "Study Guide",
    coverUrl: COVER_2,
    accentTone: "Orange",
    audienceFit: "Small groups, classes, leaders, and follow-up communities",
    tone: "Structured, discussion-ready, teaching companion",
    themeScripture: "James 1 · Hearing, doing, and living the word",
    promise:
      "Turn teaching into richer follow-up by giving readers guided questions, takeaways, and discussion prompts.",
    description:
      "A premium study guide designed to deepen teaching retention, support small-group conversation, and connect long-form ministry content to action steps, reflection, and accountability.",
    defaultFormats: ["PDF", "Web Reader", "Print"],
    chapterSeed: [
      {
        id: "chap-guide-1",
        title: "Session 1 · Big idea and key scripture",
        summary: "Frame the teaching, its emotional promise, and the discussion journey.",
        pagesLabel: "8 pages",
        tags: ["Big idea", "Scripture"],
      },
      {
        id: "chap-guide-2",
        title: "Session 2 · Group prompts",
        summary: "Turn the message into conversation with reflection and practice questions.",
        pagesLabel: "7 pages",
        tags: ["Discussion", "Application"],
      },
      {
        id: "chap-guide-3",
        title: "Session 3 · Next-step resources",
        summary: "Close the episode with readings, prayer prompts, and companion links.",
        pagesLabel: "5 pages",
        tags: ["Resources", "Practice"],
      },
    ],
    resources: [
      {
        id: "res-guide-1",
        label: "Leader discussion sheet",
        type: "Guide",
        status: "Attached",
      },
      {
        id: "res-guide-2",
        label: "Episode slide deck",
        type: "Slide deck",
        status: "Attached",
      },
      {
        id: "res-guide-3",
        label: "Reading plan follow-up",
        type: "Reading plan",
        status: "Draft",
      },
    ],
  },
  "tpl-manual": {
    id: "tpl-manual",
    title: "Manual / handbook",
    subtitle: "Training, leadership, and ministry operations content with controlled versions.",
    kind: "Manual",
    coverUrl: COVER_3,
    accentTone: "Navy",
    audienceFit: "Staff, volunteers, ministry leaders, production teams",
    tone: "Practical, operational, accountable",
    themeScripture: "1 Corinthians 14 · Decency and order",
    promise:
      "Give teams a trustworthy manual that feels warm and ministry-aware while still keeping version discipline and operational clarity.",
    description:
      "A premium handbook workflow for internal training, volunteer onboarding, ministry operations, and structured rollouts where version control, governance, and clarity matter.",
    defaultFormats: ["PDF", "Print", "Web Reader"],
    chapterSeed: [
      {
        id: "chap-manual-1",
        title: "Policy and purpose",
        summary: "Explain the why, the mission context, and how this manual should be used.",
        pagesLabel: "10 pages",
        tags: ["Purpose", "Policy"],
      },
      {
        id: "chap-manual-2",
        title: "Roles and responsibilities",
        summary: "Clarify expectations, approvals, and role ownership across the team.",
        pagesLabel: "12 pages",
        tags: ["Roles", "Governance"],
      },
      {
        id: "chap-manual-3",
        title: "Standard operating flow",
        summary: "Turn operational steps into a reusable and easy-to-scan structure.",
        pagesLabel: "14 pages",
        tags: ["Workflow", "Checklist"],
      },
    ],
    resources: [
      {
        id: "res-manual-1",
        label: "Version log",
        type: "Link",
        status: "Attached",
      },
      {
        id: "res-manual-2",
        label: "Volunteer checklist",
        type: "Worksheet",
        status: "Needs update",
      },
    ],
  },
  "tpl-reader": {
    id: "tpl-reader",
    title: "Course reader",
    subtitle: "Week-by-week reading packs linked to classes, events, or structured teaching tracks.",
    kind: "Course Reader",
    coverUrl: COVER_4,
    accentTone: "Green",
    audienceFit: "Discipleship classes, training cohorts, learning journeys",
    tone: "Structured, formative, curriculum-like",
    themeScripture: "Colossians 1 · Growing in wisdom and understanding",
    promise:
      "Organize structured faith learning into a polished reader with weekly rhythm, resources, and companion actions.",
    description:
      "A premium course-reader workflow for class-style teaching, discipleship journeys, leadership development, and reading experiences that need strong pacing and companion resources.",
    defaultFormats: ["PDF", "ePub", "Web Reader", "Print"],
    chapterSeed: [
      {
        id: "chap-reader-1",
        title: "Week 1 · Orientation and expectations",
        summary: "Frame the learning path, outcomes, and the first reading milestone.",
        pagesLabel: "9 pages",
        tags: ["Orientation", "Outcomes"],
      },
      {
        id: "chap-reader-2",
        title: "Week 2 · Core reading and reflection",
        summary: "Set the central teaching with notes and guided response prompts.",
        pagesLabel: "11 pages",
        tags: ["Reading", "Reflection"],
      },
      {
        id: "chap-reader-3",
        title: "Week 3 · Practice and discussion",
        summary: "Move from content into action, questions, and follow-up discipline.",
        pagesLabel: "8 pages",
        tags: ["Practice", "Discussion"],
      },
    ],
    resources: [
      {
        id: "res-reader-1",
        label: "Weekly worksheet",
        type: "Worksheet",
        status: "Attached",
      },
      {
        id: "res-reader-2",
        label: "Class schedule",
        type: "Link",
        status: "Attached",
      },
    ],
  },
};

const SUGGESTED_TAGS = [
  "Prayer",
  "Renewal",
  "Discipleship",
  "Small groups",
  "Leadership",
  "Study guide",
  "Devotional",
  "Family",
  "Young adults",
];

const STEP_LIST: Array<{ key: StepKey; label: string; hint: string }> = [
  { key: "foundation", label: "Foundation", hint: "Identity, template, positioning" },
  { key: "formats", label: "Formats", hint: "Import, outputs, file package" },
  { key: "structure", label: "Structure", hint: "Chapters, resources, reader flow" },
  { key: "cover", label: "Cover & media", hint: "Artwork, quote, brand treatment" },
  { key: "access", label: "Access & launch", hint: "Pricing, visibility, schedule" },
  { key: "localization", label: "Localization", hint: "Variants, titles, CTA copy" },
  { key: "promotion", label: "Promotion", hint: "Live, Beacon, notifications, links" },
  { key: "review", label: "Review & publish", hint: "Checklist, approvals, outputs" },
];

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function safeNav(url: string) {
  navigateWithRouter(url);
}

function nextId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2, 8)}`;
}

function money(value: number, currency: string) {
  const symbol = currency || "$";
  const safe = Number.isFinite(value) ? value : 0;
  return `${symbol}${Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(safe)}`;
}

function parseSearch() {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

function buildDraft(templateId: TemplateKey): BookDraft {
  const preset = TEMPLATE_LIBRARY[templateId];
  return {
    templateId,
    title: preset.title,
    subtitle: preset.subtitle,
    author: "FaithHub Editorial Team",
    kind: preset.kind,
    audienceFit: preset.audienceFit,
    themeScripture: preset.themeScripture,
    promise: preset.promise,
    description: preset.description,
    tone: preset.tone,
    tags: ["FaithHub", preset.kind, "Provider"],
    coverUrl: preset.coverUrl,
    altCoverUrl: preset.coverUrl,
    coverAltText: `${preset.title} cover artwork`,
    heroQuote: "A premium reading destination that feels intentional, warm, and deeply useful.",
    accentTone: preset.accentTone,
    importMode: "Import manuscript",
    sourceFiles: [
      "Manuscript_v4.docx",
      "Cover_exports.zip",
      "Companion_resources.pdf",
    ],
    formats: [...preset.defaultFormats],
    chapterItems: preset.chapterSeed.map((chapter) => ({
      ...chapter,
      id: nextId("chapter"),
    })),
    resources: preset.resources.map((resource) => ({
      ...resource,
      id: nextId("resource"),
    })),
    accessModel: "Free",
    price: 12,
    currency: "$",
    sampleEnabled: true,
    downloadsEnabled: true,
    discoverable: true,
    publishMode: "Draft",
    scheduledAt: "Next Thursday · 7:30 PM",
    locales: [
      {
        id: nextId("loc"),
        language: "English",
        localizedTitle: preset.title,
        localizedSubtitle: preset.subtitle,
        status: "Ready",
      },
      {
        id: nextId("loc"),
        language: "Swahili",
        localizedTitle: `${preset.title} (Swahili)`,
        localizedSubtitle: "Localized edition in progress",
        status: "Draft",
      },
    ],
    ctaText: "Read now",
    notificationsReady: true,
    beaconReady: false,
    liveCompanionReady: true,
    linkedEvent: "",
    linkedFund: "",
    slug: preset.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    approvals: {
      design: true,
      accessibility: false,
      doctrine: true,
      rights: false,
    },
  };
}

function buildChecklist(draft: BookDraft) {
  const checks = [
    {
      label: "Identity and positioning",
      ok:
        draft.title.trim().length > 2 &&
        draft.subtitle.trim().length > 6 &&
        draft.promise.trim().length > 20,
      hint: "Title, subtitle, and reader promise are all in place.",
    },
    {
      label: "Cover and premium storefront media",
      ok: draft.coverUrl.trim().length > 0 && draft.coverAltText.trim().length > 8,
      hint: "Main cover image and accessible alt text are ready.",
    },
    {
      label: "Formats and reading package",
      ok: draft.formats.length > 0 && draft.sourceFiles.length > 0,
      hint: "At least one delivery format and source package exists.",
    },
    {
      label: "Chapters and structure",
      ok: draft.chapterItems.length >= 3,
      hint: "A premium reader experience should carry at least three structured chapters.",
    },
    {
      label: "Access and launch rules",
      ok:
        draft.accessModel !== "Paid" ||
        (draft.accessModel === "Paid" && draft.price > 0),
      hint: "Access model and pricing logic are valid.",
    },
    {
      label: "Localization and CTA copy",
      ok: draft.locales.length > 0 && draft.ctaText.trim().length > 0,
      hint: "Reader CTA and at least one locale variant exist.",
    },
    {
      label: "Approvals and trust checks",
      ok:
        draft.approvals.design &&
        draft.approvals.doctrine &&
        draft.approvals.accessibility &&
        draft.approvals.rights,
      hint: "Design, doctrine, accessibility, and rights all signed off.",
    },
  ];
  const score = Math.round(
    (checks.filter((check) => check.ok).length / checks.length) * 100,
  );
  return { checks, score };
}

function PrimaryActionButton({
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
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-95",
        className,
      )}
      style={{ background: tone === "green" ? EV_GREEN : EV_ORANGE }}
    >
      {children}
    </button>
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
        "inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
        className,
      )}
    >
      {children}
    </button>
  );
}

function Pill({
  text,
  tone = "neutral",
  icon,
}: {
  text: string;
  tone?: "neutral" | "good" | "warn" | "brand" | "dark";
  icon?: React.ReactNode;
}) {
  const cls =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
      : tone === "warn"
        ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
        : tone === "brand"
          ? "border-transparent text-white"
          : tone === "dark"
            ? "border-slate-800 bg-slate-900 text-white dark:border-slate-600 dark:bg-slate-100 dark:text-slate-900"
            : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold",
        cls,
      )}
      style={tone === "brand" ? { background: EV_ORANGE } : undefined}
    >
      {icon}
      {text}
    </span>
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
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm transition dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
            {title}
          </div>
          {subtitle ? (
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </div>
          ) : null}
        </div>
        {right}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
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
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "number";
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-emerald-900/30"
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
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-emerald-900/30"
    />
  );
}

function Segmented({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex flex-wrap rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
      {items.map((item) => {
        const active = item === value;
        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={cx(
              "rounded-xl px-3 py-1.5 text-[12px] font-bold transition",
              active
                ? "text-white"
                : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800",
            )}
            style={active ? { background: EV_GREEN } : undefined}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

function ToggleCard({
  checked,
  onClick,
  icon,
  label,
  hint,
  tone = "green",
}: {
  checked: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  hint?: string;
  tone?: "green" | "orange";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "w-full rounded-3xl border p-3 text-left transition",
        checked
          ? tone === "green"
            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
            : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
          : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[13px] font-bold text-slate-900 dark:text-slate-100">
            {icon}
            {label}
          </div>
          {hint ? (
            <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
              {hint}
            </div>
          ) : null}
        </div>
        <div
          className={cx(
            "mt-0.5 h-6 w-10 rounded-full border px-1 transition",
            checked
              ? tone === "green"
                ? "border-emerald-500 bg-emerald-500"
                : "border-amber-500 bg-amber-500"
              : "border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800",
          )}
        >
          <div
            className={cx(
              "mt-[3px] h-4 w-4 rounded-full bg-white shadow transition",
              checked ? "translate-x-4" : "translate-x-0",
            )}
          />
        </div>
      </div>
    </button>
  );
}

function StepRail({
  step,
  setStep,
}: {
  step: StepKey;
  setStep: (step: StepKey) => void;
}) {
  return (
    <Card title="Book Builder" subtitle="Premium creation path launched from Books Manager">
      <div className="space-y-2">
        {STEP_LIST.map((item, index) => {
          const active = step === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setStep(item.key)}
              className={cx(
                "w-full rounded-2xl border px-3 py-3 text-left transition",
                active
                  ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                  : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cx(
                    "mt-0.5 grid h-7 w-7 place-items-center rounded-full text-[11px] font-black",
                    active
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
                  )}
                >
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100">
                    {item.label}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {item.hint}
                  </div>
                </div>
                {active ? <ChevronRight className="h-4 w-4 text-slate-500" /> : null}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function StorefrontPreview({
  draft,
  mode,
  expanded = false,
}: {
  draft: BookDraft;
  mode: PreviewMode;
  expanded?: boolean;
}) {
  const primaryAction =
    draft.accessModel === "Paid"
      ? `Unlock ${money(draft.price, draft.currency)}`
      : draft.accessModel === "Supporter"
        ? "Unlock as supporter"
        : draft.accessModel === "Internal"
          ? "Internal access"
          : draft.ctaText || "Read now";

  const accentColor =
    draft.accentTone === "Orange"
      ? EV_ORANGE
      : draft.accentTone === "Navy"
        ? EV_NAVY
        : EV_GREEN;

  if (mode === "mobile") {
    return (
      <div className="mx-auto w-full max-w-[360px] md:max-w-[400px]">
        <div className="rounded-[34px] bg-slate-950 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.28)] transition">
          <div className="overflow-hidden rounded-[26px] bg-white dark:bg-slate-900">
            <div className="relative">
              <div className="aspect-[4/5] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={draft.coverUrl}
                  alt={draft.coverAltText}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                <Pill text={draft.kind} tone="dark" />
                <Pill
                  text={draft.accessModel}
                  tone={draft.accessModel === "Paid" ? "brand" : "good"}
                />
              </div>
            </div>

            <div className="p-4">
              <div className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                FaithHub Book
              </div>
              <div className="mt-1 text-lg font-black leading-tight text-slate-900 dark:text-slate-100">
                {draft.title}
              </div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {draft.subtitle}
              </div>
              <div className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                By {draft.author}
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Reader promise
                </div>
                <div className="mt-2 text-sm font-semibold leading-relaxed text-slate-800 dark:text-slate-200">
                  {draft.promise}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Included
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {draft.formats.map((format) => (
                    <span
                      key={format}
                      className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {draft.chapterItems.slice(0, expanded ? 5 : 3).map((chapter, index) => (
                  <div
                    key={chapter.id}
                    className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Chapter {index + 1}
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                      {chapter.title}
                    </div>
                    <div className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {chapter.summary}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black text-white"
                style={{ background: accentColor }}
                onClick={handleRawPlaceholderAction(
                  primaryAction.startsWith("Unlock")
                    ? "open_donations_funds"
                    : primaryAction === "Internal access"
                      ? "open_roles_permissions"
                      : "open_resources_manager",
                )}>
                <BookOpen className="h-4 w-4" />
                {primaryAction}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-0 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950 lg:border-b-0 lg:border-r">
          <div className="overflow-hidden rounded-3xl shadow-sm">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={draft.coverUrl}
                alt={draft.coverAltText}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill text={draft.kind} tone="dark" />
            <Pill
              text={draft.accessModel}
              tone={draft.accessModel === "Paid" ? "brand" : "good"}
            />
            {draft.formats.slice(0, 2).map((format) => (
              <Pill key={format} text={format} />
            ))}
          </div>

          <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
              Cover quote
            </div>
            <div className="mt-2 text-sm font-semibold leading-relaxed text-slate-800 dark:text-slate-200">
              “{draft.heroQuote}”
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Pill text="Desktop reader preview" tone="good" icon={<MonitorSmartphone className="h-3.5 w-3.5" />} />
            <Pill text={`Locales ${draft.locales.length}`} />
            <Pill text={`Chapters ${draft.chapterItems.length}`} />
          </div>

          <div className="mt-4 text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
            FaithHub Book
          </div>
          <div className="mt-1 text-3xl font-black leading-tight text-slate-900 dark:text-slate-100">
            {draft.title}
          </div>
          <div className="mt-2 text-base text-slate-500 dark:text-slate-400">
            {draft.subtitle}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
            <span className="font-semibold">By {draft.author}</span>
            <span>•</span>
            <span>{draft.audienceFit}</span>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                Reader promise
              </div>
              <div className="mt-2 text-sm font-semibold leading-relaxed text-slate-800 dark:text-slate-200">
                {draft.promise}
              </div>
              <div className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {draft.description}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {draft.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                Primary CTA
              </div>
              <button
                type="button"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black text-white"
                style={{ background: accentColor }}
                onClick={handleRawPlaceholderAction(
                  primaryAction.startsWith("Unlock")
                    ? "open_donations_funds"
                    : primaryAction === "Internal access"
                      ? "open_roles_permissions"
                      : "open_resources_manager",
                )}>
                <BookOpen className="h-4 w-4" />
                {primaryAction}
              </button>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Formats</div>
                  <div className="mt-1 text-[13px] font-black text-slate-900 dark:text-slate-100">
                    {draft.formats.length}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Resources</div>
                  <div className="mt-1 text-[13px] font-black text-slate-900 dark:text-slate-100">
                    {draft.resources.length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
              Chapter experience
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {draft.chapterItems.slice(0, expanded ? 6 : 4).map((chapter, index) => (
                <div
                  key={chapter.id}
                  className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Chapter {index + 1}
                    </div>
                    <div className="text-[11px] font-bold text-slate-400">
                      {chapter.pagesLabel}
                    </div>
                  </div>
                  <div className="mt-2 text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    {chapter.title}
                  </div>
                  <div className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {chapter.summary}
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

function TemplateSwitchCard({
  preset,
  active,
  onClick,
}: {
  preset: TemplatePreset;
  active: boolean;
  onClick: () => void;
}) {
  const tone =
    preset.accentTone === "Orange" ? EV_ORANGE : preset.accentTone === "Navy" ? EV_NAVY : EV_GREEN;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "rounded-3xl border p-4 text-left transition",
        active
          ? "border-emerald-200 bg-emerald-50 shadow-sm dark:border-emerald-800 dark:bg-emerald-900/20"
          : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
            {preset.title}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {preset.subtitle}
          </div>
        </div>
        <div
          className="h-3 w-3 shrink-0 rounded-full"
          style={{ background: tone }}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Pill text={preset.kind} />
        {preset.defaultFormats.slice(0, 2).map((format) => (
          <Pill key={format} text={format} />
        ))}
      </div>
    </button>
  );
}

export default function FaithHubBookBuilderPage() {
  const [step, setStep] = useState<StepKey>("foundation");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [templateId, setTemplateId] = useState<TemplateKey>("tpl-devotional");
  const [draft, setDraft] = useState<BookDraft>(() => buildDraft("tpl-devotional"));

  useEffect(() => {
    const sp = parseSearch();
    const incomingTemplate = sp.get("template") as TemplateKey | null;
    if (incomingTemplate && TEMPLATE_LIBRARY[incomingTemplate]) {
      setTemplateId(incomingTemplate);
      setDraft(buildDraft(incomingTemplate));
    }
  }, []);

  const checklist = useMemo(() => buildChecklist(draft), [draft]);
  const template = TEMPLATE_LIBRARY[templateId];

  const metricCards = [
    {
      label: "Readiness",
      value: `${checklist.score}%`,
      hint: `${checklist.checks.filter((check) => check.ok).length} of ${checklist.checks.length} launch gates ready`,
    },
    {
      label: "Chapters",
      value: String(draft.chapterItems.length),
      hint: "Structured reading flow and chapter metadata",
    },
    {
      label: "Formats",
      value: String(draft.formats.length),
      hint: draft.formats.join(", "),
    },
    {
      label: "Locales",
      value: String(draft.locales.length),
      hint: draft.locales.map((locale) => locale.language).join(", "),
    },
  ];

  function update<K extends keyof BookDraft>(key: K, value: BookDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function toggleFormat(format: FormatKind) {
    setDraft((prev) => ({
      ...prev,
      formats: prev.formats.includes(format)
        ? prev.formats.filter((item) => item !== format)
        : [...prev.formats, format],
    }));
  }

  function toggleTag(tag: string) {
    setDraft((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((item) => item !== tag)
        : [...prev.tags, tag],
    }));
  }

  function addChapter() {
    setDraft((prev) => ({
      ...prev,
      chapterItems: [
        ...prev.chapterItems,
        {
          id: nextId("chapter"),
          title: `Chapter ${prev.chapterItems.length + 1}`,
          summary: "Add the main idea, discussion beat, or reading outcome for this chapter.",
          pagesLabel: "6 pages",
          tags: ["New"],
        },
      ],
    }));
  }

  function addLocale() {
    setDraft((prev) => ({
      ...prev,
      locales: [
        ...prev.locales,
        {
          id: nextId("loc"),
          language: `Locale ${prev.locales.length + 1}`,
          localizedTitle: prev.title,
          localizedSubtitle: prev.subtitle,
          status: "Draft",
        },
      ],
    }));
  }

  function switchTemplate(nextTemplate: TemplateKey) {
    setTemplateId(nextTemplate);
    setDraft(buildDraft(nextTemplate));
  }

  function renderStepContent() {
    if (step === "foundation") {
      return (
        <div className="space-y-4">
          <Card
            title="Template and creation path"
            subtitle="Start from a premium template, then enrich identity, positioning, and the reader promise."
            right={<Pill text="Launched from + New Book" tone="brand" icon={<Plus className="h-3.5 w-3.5" />} />}
          >
            <div className="grid gap-3 xl:grid-cols-2">
              {Object.values(TEMPLATE_LIBRARY).map((preset) => (
                <TemplateSwitchCard
                  key={preset.id}
                  preset={preset}
                  active={templateId === preset.id}
                  onClick={() => switchTemplate(preset.id)}
                />
              ))}
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              <div>
                <Label>Book title</Label>
                <Input value={draft.title} onChange={(value) => update("title", value)} />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Input value={draft.subtitle} onChange={(value) => update("subtitle", value)} />
              </div>
              <div>
                <Label>Author / editor</Label>
                <Input value={draft.author} onChange={(value) => update("author", value)} />
              </div>
              <div>
                <Label>Book kind</Label>
                <Segmented
                  items={[
                    "Devotional",
                    "Study Guide",
                    "Manual",
                    "Course Reader",
                    "eBook",
                  ]}
                  value={draft.kind}
                  onChange={(value) => update("kind", value as BookKind)}
                />
              </div>
              <div className="xl:col-span-2">
                <Label>Audience fit</Label>
                <Input
                  value={draft.audienceFit}
                  onChange={(value) => update("audienceFit", value)}
                  placeholder="Who is this book for?"
                />
              </div>
              <div>
                <Label>Theme / scripture</Label>
                <Input
                  value={draft.themeScripture}
                  onChange={(value) => update("themeScripture", value)}
                />
              </div>
              <div>
                <Label>Editorial tone</Label>
                <Input value={draft.tone} onChange={(value) => update("tone", value)} />
              </div>
              <div className="xl:col-span-2">
                <Label>Reader promise</Label>
                <TextArea
                  value={draft.promise}
                  onChange={(value) => update("promise", value)}
                  rows={3}
                />
              </div>
              <div className="xl:col-span-2">
                <Label>Description</Label>
                <TextArea
                  value={draft.description}
                  onChange={(value) => update("description", value)}
                  rows={5}
                />
              </div>
            </div>

            <div className="mt-5">
              <Label>Suggested tags</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {SUGGESTED_TAGS.map((tag) => {
                  const active = draft.tags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cx(
                        "rounded-full border px-3 py-1.5 text-[12px] font-bold transition",
                        active
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
                      )}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      );
    }

    if (step === "formats") {
      return (
        <div className="space-y-4">
          <Card
            title="Import mode and source package"
            subtitle="Choose how this book starts, then control which outputs the reader receives."
            right={<Pill text="Premium file workflow" icon={<Package className="h-3.5 w-3.5" />} />}
          >
            <div className="grid gap-3 lg:grid-cols-2">
              <ToggleCard
                checked={draft.importMode === "Import manuscript"}
                onClick={() => update("importMode", "Import manuscript")}
                icon={<FileText className="h-4 w-4" />}
                label="Import manuscript"
                hint="Start from DOCX, PDF, Markdown, or pre-approved ministry docs."
              />
              <ToggleCard
                checked={draft.importMode === "Compose in builder"}
                onClick={() => update("importMode", "Compose in builder")}
                icon={<Wand2 className="h-4 w-4" />}
                label="Compose in builder"
                hint="Write and structure the book directly inside FaithHub."
                tone="orange"
              />
            </div>

            <div className="mt-5 grid gap-3 xl:grid-cols-2">
              {draft.sourceFiles.map((source) => (
                <div
                  key={source}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl bg-white shadow-sm dark:bg-slate-900">
                      <FileBadge2 className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-extrabold text-slate-900 dark:text-slate-100">
                        {source}
                      </div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Approved source package ready for output generation, cover mapping, and metadata sync.
                      </div>
                    </div>
                    <Pill text="Ready" tone="good" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <Label>Reader output formats</Label>
              <div className="mt-2 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {(["PDF", "ePub", "Audio", "Print", "Web Reader"] as FormatKind[]).map((format) => (
                  <ToggleCard
                    key={format}
                    checked={draft.formats.includes(format)}
                    onClick={() => toggleFormat(format)}
                    icon={
                      format === "Audio" ? (
                        <FileAudio className="h-4 w-4" />
                      ) : format === "Web Reader" ? (
                        <MonitorSmartphone className="h-4 w-4" />
                      ) : (
                        <BookOpen className="h-4 w-4" />
                      )
                    }
                    label={format}
                    hint="Add this output to the final premium reading package."
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>
      );
    }

    if (step === "structure") {
      return (
        <div className="space-y-4">
          <Card
            title="Chapter structure"
            subtitle="Shape the reader journey, refine chapter summaries, and prepare a premium package for discovery and consumption."
            right={
              <div className="flex flex-wrap gap-2">
                <SoftButton onClick={addChapter}>
                  <Plus className="h-4 w-4" />
                  Add chapter
                </SoftButton>
                <SoftButton onClick={() => {
                  setDraft((prev) => ({
                    ...prev,
                    chapterItems: prev.chapterItems.map((chapter, index) => ({
                      ...chapter,
                      summary:
                        index === 0
                          ? "Refined with AI-assisted positioning and sharper reading outcome."
                          : chapter.summary,
                    })),
                  }));
                }}>
                  <Wand2 className="h-4 w-4" />
                  AI outline assist
                </SoftButton>
              </div>
            }
          >
            <div className="space-y-3">
              {draft.chapterItems.map((chapter, index) => (
                <div
                  key={chapter.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_160px]">
                    <div>
                      <div className="flex items-center gap-2">
                        <Pill text={`Chapter ${index + 1}`} tone="dark" />
                        {chapter.tags.map((tag) => (
                          <Pill key={tag} text={tag} />
                        ))}
                      </div>
                      <div className="mt-3">
                        <Label>Chapter title</Label>
                        <Input
                          value={chapter.title}
                          onChange={(value) =>
                            setDraft((prev) => ({
                              ...prev,
                              chapterItems: prev.chapterItems.map((item) =>
                                item.id === chapter.id ? { ...item, title: value } : item,
                              ),
                            }))
                          }
                        />
                      </div>
                      <div className="mt-3">
                        <Label>Chapter summary</Label>
                        <TextArea
                          value={chapter.summary}
                          onChange={(value) =>
                            setDraft((prev) => ({
                              ...prev,
                              chapterItems: prev.chapterItems.map((item) =>
                                item.id === chapter.id ? { ...item, summary: value } : item,
                              ),
                            }))
                          }
                          rows={3}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Estimated length</Label>
                      <Input
                        value={chapter.pagesLabel}
                        onChange={(value) =>
                          setDraft((prev) => ({
                            ...prev,
                            chapterItems: prev.chapterItems.map((item) =>
                              item.id === chapter.id ? { ...item, pagesLabel: value } : item,
                            ),
                          }))
                        }
                      />
                      <div className="mt-3 rounded-3xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                        <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                          Reader note
                        </div>
                        <div className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          Use concise summaries that work in feeds, search, and chapter previews. This card feeds the premium storefront preview automatically.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="Resources and companion attachments"
            subtitle="Bundle study assets, worksheets, slide decks, and reading plans so the book becomes a richer destination."
            right={<Pill text={`Resources ${draft.resources.length}`} icon={<Layers3 className="h-3.5 w-3.5" />} />}
          >
            <div className="grid gap-3 xl:grid-cols-2">
              {draft.resources.map((resource) => (
                <div
                  key={resource.id}
                  className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                        {resource.label}
                      </div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {resource.type}
                      </div>
                    </div>
                    <Pill
                      text={resource.status}
                      tone={
                        resource.status === "Attached"
                          ? "good"
                          : resource.status === "Draft"
                            ? "warn"
                            : "neutral"
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      );
    }

    if (step === "cover") {
      return (
        <div className="space-y-4">
          <Card
            title="Cover and media treatment"
            subtitle="Shape the premium first impression of the book with polished cover art, alternate assets, and on-brand story elements."
            right={<Pill text="Storefront quality" icon={<ImageIcon className="h-3.5 w-3.5" />} />}
          >
            <div className="grid gap-4 xl:grid-cols-2">
              <div>
                <Label>Main cover image</Label>
                <Input value={draft.coverUrl} onChange={(value) => update("coverUrl", value)} />
              </div>
              <div>
                <Label>Alternate cover / hero image</Label>
                <Input value={draft.altCoverUrl} onChange={(value) => update("altCoverUrl", value)} />
              </div>
              <div className="xl:col-span-2">
                <Label>Accessible alt text</Label>
                <Input
                  value={draft.coverAltText}
                  onChange={(value) => update("coverAltText", value)}
                  placeholder="Describe the cover for assistive readers"
                />
              </div>
              <div className="xl:col-span-2">
                <Label>Hero quote</Label>
                <TextArea
                  value={draft.heroQuote}
                  onChange={(value) => update("heroQuote", value)}
                  rows={3}
                />
              </div>
              <div className="xl:col-span-2">
                <Label>Accent tone</Label>
                <Segmented
                  items={["Green", "Orange", "Navy"]}
                  value={draft.accentTone}
                  onChange={(value) => update("accentTone", value as BookDraft["accentTone"])}
                />
              </div>
            </div>

            <div className="mt-5 grid gap-3 xl:grid-cols-3">
              {[
                {
                  title: "Primary cover",
                  image: draft.coverUrl,
                  note: "Main storefront card, web reader listing, and feed shelf.",
                },
                {
                  title: "Alternate cover",
                  image: draft.altCoverUrl,
                  note: "Can be used for promos, localized variants, and quote cards.",
                },
                {
                  title: "Quote treatment",
                  image: draft.coverUrl,
                  note: "Used in Beacon and notifications when quote-first creative performs better.",
                },
              ].map((panel) => (
                <div
                  key={panel.title}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="overflow-hidden rounded-2xl">
                    <div className="aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={panel.image}
                        alt={panel.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="mt-3 text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    {panel.title}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {panel.note}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      );
    }

    if (step === "access") {
      return (
        <div className="space-y-4">
          <Card
            title="Access, pricing, and launch"
            subtitle="Choose who should see the book, how they unlock it, and when it becomes visible."
            right={<Pill text="Launch controls" icon={<CalendarClock className="h-3.5 w-3.5" />} />}
          >
            <div className="grid gap-3 xl:grid-cols-2">
              {(["Free", "Follower-first", "Supporter", "Paid", "Internal"] as AccessModel[]).map((model) => (
                <ToggleCard
                  key={model}
                  checked={draft.accessModel === model}
                  onClick={() => update("accessModel", model)}
                  icon={model === "Paid" ? <Lock className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                  label={model}
                  hint="Use this access model for the final reader experience."
                  tone={model === "Paid" ? "orange" : "green"}
                />
              ))}
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-3">
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  value={draft.price}
                  onChange={(value) => update("price", Number(value || 0))}
                />
              </div>
              <div>
                <Label>Currency</Label>
                <Segmented
                  items={["$", "£", "₦"]}
                  value={draft.currency}
                  onChange={(value) => update("currency", value as BookDraft["currency"])}
                />
              </div>
              <div>
                <Label>Launch mode</Label>
                <Segmented
                  items={["Draft", "Schedule", "Ready to publish"]}
                  value={draft.publishMode}
                  onChange={(value) => update("publishMode", value as BookDraft["publishMode"])}
                />
              </div>
              <div className="xl:col-span-2">
                <Label>Scheduled publish time</Label>
                <Input
                  value={draft.scheduledAt}
                  onChange={(value) => update("scheduledAt", value)}
                  placeholder="Next Thursday · 7:30 PM"
                />
              </div>
              <div>
                <Label>Public slug</Label>
                <Input value={draft.slug} onChange={(value) => update("slug", value)} />
              </div>
            </div>

            <div className="mt-5 grid gap-3 xl:grid-cols-3">
              <ToggleCard
                checked={draft.sampleEnabled}
                onClick={() => update("sampleEnabled", !draft.sampleEnabled)}
                icon={<PlayCircle className="h-4 w-4" />}
                label="Enable sample chapters"
                hint="Let new readers preview part of the book."
              />
              <ToggleCard
                checked={draft.downloadsEnabled}
                onClick={() => update("downloadsEnabled", !draft.downloadsEnabled)}
                icon={<FileText className="h-4 w-4" />}
                label="Allow downloads"
                hint="Give readers downloadable copies where access allows."
              />
              <ToggleCard
                checked={draft.discoverable}
                onClick={() => update("discoverable", !draft.discoverable)}
                icon={<Search className="h-4 w-4" />}
                label="Discoverable in feeds and search"
                hint="Surface the book in libraries, discovery rails, and recommendations."
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
            title="Localization and regional variants"
            subtitle="Keep the book premium across languages with title variants, localized subtitles, and region-aware presentation."
            right={
              <div className="flex flex-wrap gap-2">
                <SoftButton onClick={addLocale}>
                  <Plus className="h-4 w-4" />
                  Add locale
                </SoftButton>
                <Pill text={`${draft.locales.length} variants`} icon={<Languages className="h-3.5 w-3.5" />} />
              </div>
            }
          >
            <div className="space-y-3">
              {draft.locales.map((locale) => (
                <div
                  key={locale.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {locale.language}
                    </div>
                    <Pill
                      text={locale.status}
                      tone={
                        locale.status === "Ready"
                          ? "good"
                          : locale.status === "In review"
                            ? "warn"
                            : "neutral"
                      }
                    />
                  </div>

                  <div className="mt-4 grid gap-4 xl:grid-cols-2">
                    <div>
                      <Label>Localized title</Label>
                      <Input
                        value={locale.localizedTitle}
                        onChange={(value) =>
                          setDraft((prev) => ({
                            ...prev,
                            locales: prev.locales.map((item) =>
                              item.id === locale.id
                                ? { ...item, localizedTitle: value }
                                : item,
                            ),
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Segmented
                        items={["Draft", "In review", "Ready"]}
                        value={locale.status}
                        onChange={(value) =>
                          setDraft((prev) => ({
                            ...prev,
                            locales: prev.locales.map((item) =>
                              item.id === locale.id
                                ? { ...item, status: value as TranslationStatus }
                                : item,
                            ),
                          }))
                        }
                      />
                    </div>
                    <div className="xl:col-span-2">
                      <Label>Localized subtitle</Label>
                      <TextArea
                        value={locale.localizedSubtitle}
                        onChange={(value) =>
                          setDraft((prev) => ({
                            ...prev,
                            locales: prev.locales.map((item) =>
                              item.id === locale.id
                                ? { ...item, localizedSubtitle: value }
                                : item,
                            ),
                          }))
                        }
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <Label>Primary CTA copy</Label>
              <Input
                value={draft.ctaText}
                onChange={(value) => update("ctaText", value)}
                placeholder="Read now"
              />
            </div>
          </Card>
        </div>
      );
    }

    if (step === "promotion") {
      return (
        <div className="space-y-4">
          <Card
            title="Cross-links and promotion hooks"
            subtitle="Connect the book to live ministry, events, giving, and Beacon without turning creation into a fragmented workflow."
            right={<Pill text="Promotion-ready" icon={<Megaphone className="h-3.5 w-3.5" />} />}
          >
            <div className="grid gap-3 xl:grid-cols-3">
              <ToggleCard
                checked={draft.liveCompanionReady}
                onClick={() => update("liveCompanionReady", !draft.liveCompanionReady)}
                icon={<Workflow className="h-4 w-4" />}
                label="Live Sessions companion"
                hint="Attach this book to a related live session, replay, or teaching flow."
              />
              <ToggleCard
                checked={draft.notificationsReady}
                onClick={() => update("notificationsReady", !draft.notificationsReady)}
                icon={<Rocket className="h-4 w-4" />}
                label="Audience follow-up"
                hint="Launch reading reminders and follow-up journeys after publishing."
                tone="orange"
              />
              <ToggleCard
                checked={draft.beaconReady}
                onClick={() => update("beaconReady", !draft.beaconReady)}
                icon={<Megaphone className="h-4 w-4" />}
                label="Beacon promotion"
                hint="Push the book into Beacon as a linked or standalone promotion."
              />
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              <div>
                <Label>Linked event</Label>
                <Input
                  value={draft.linkedEvent}
                  onChange={(value) => update("linkedEvent", value)}
                  placeholder="e.g. Discipleship class kickoff"
                />
              </div>
              <div>
                <Label>Linked fund or crowdfund</Label>
                <Input
                  value={draft.linkedFund}
                  onChange={(value) => update("linkedFund", value)}
                  placeholder="e.g. Scholarship fund"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-3 xl:grid-cols-3">
              <button
                type="button"
                onClick={() => safeNav(ROUTES.liveBuilder)}
                className="rounded-3xl border border-slate-200 bg-white p-4 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  <Workflow className="h-4 w-4 text-emerald-500" />
                  Open Live Builder
                </div>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Build a companion live session or attach this book to an existing teaching workflow.
                </div>
              </button>

              <button
                type="button"
                onClick={() => safeNav(ROUTES.audienceNotifications)}
                className="rounded-3xl border border-slate-200 bg-white p-4 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  <Rocket className="h-4 w-4 text-orange-500" />
                  Open Audience Notifications
                </div>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Build a reminder or replay-style reading journey around this book.
                </div>
              </button>

              <button
                type="button"
                onClick={() => safeNav(ROUTES.beaconBuilder)}
                className="rounded-3xl border border-slate-200 bg-white p-4 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  <Megaphone className="h-4 w-4 text-orange-500" />
                  Open Beacon Builder
                </div>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Promote the book with a linked campaign or a standalone awareness push.
                </div>
              </button>
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Card
          title="Readiness gate and publish review"
          subtitle="Finalize trust, approvals, and reader quality before making the book visible."
          right={<Pill text={`${checklist.score}% launch ready`} tone="good" icon={<BadgeCheck className="h-3.5 w-3.5" />} />}
        >
          <div className="space-y-3">
            {checklist.checks.map((check) => (
              <div
                key={check.label}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {check.label}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {check.hint}
                    </div>
                  </div>
                  <Pill
                    text={check.ok ? "Ready" : "Needs work"}
                    tone={check.ok ? "good" : "warn"}
                    icon={check.ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 xl:grid-cols-2">
            <ToggleCard
              checked={draft.approvals.design}
              onClick={() =>
                update("approvals", { ...draft.approvals, design: !draft.approvals.design })
              }
              icon={<ImageIcon className="h-4 w-4" />}
              label="Design approved"
              hint="Cover, hierarchy, and storefront presentation are premium-ready."
            />
            <ToggleCard
              checked={draft.approvals.accessibility}
              onClick={() =>
                update("approvals", {
                  ...draft.approvals,
                  accessibility: !draft.approvals.accessibility,
                })
              }
              icon={<Globe2 className="h-4 w-4" />}
              label="Accessibility approved"
              hint="Alt text, readability, and assistive-reader checks are complete."
              tone="orange"
            />
            <ToggleCard
              checked={draft.approvals.doctrine}
              onClick={() =>
                update("approvals", {
                  ...draft.approvals,
                  doctrine: !draft.approvals.doctrine,
                })
              }
              icon={<BadgeCheck className="h-4 w-4" />}
              label="Doctrine / ministry sign-off"
              hint="Internal theological or ministry review is complete."
            />
            <ToggleCard
              checked={draft.approvals.rights}
              onClick={() =>
                update("approvals", { ...draft.approvals, rights: !draft.approvals.rights })
              }
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Rights and reuse cleared"
              hint="Media, manuscript, and reuse permissions are documented."
              tone="orange"
            />
          </div>

          <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
              Primary outputs
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {[
                `Storefront-ready metadata`,
                `${draft.formats.length} reader formats`,
                `${draft.chapterItems.length} structured chapters`,
                `${draft.locales.length} locale variants`,
              ].map((output) => (
                <div
                  key={output}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-[12px] font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  {output}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-slate-900 transition dark:bg-slate-950 dark:text-slate-50">
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto max-w-[1600px] px-4 py-4 md:px-6 lg:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                <button
                  type="button"
                  className="transition hover:text-slate-700 dark:hover:text-slate-200"
                  onClick={() => safeNav(ROUTES.booksManager)}
                >
                  Books Manager
                </button>
                <span>•</span>
                <span>FH-P-024</span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
                  <BookOpen className="h-6 w-6" style={{ color: EV_GREEN }} />
                </div>
                <div className="min-w-0">
                  <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                    Book Builder
                  </div>
                  <div className="mt-1 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
                    Build a premium devotional, study guide, manual, or course reader with storefront-ready packaging, structured chapters, access rules, localization, and linked promotion hooks.
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Pill text={template.title} tone="good" icon={<Sparkles className="h-3.5 w-3.5" />} />
                <Pill text={`Template: ${template.kind}`} />
                <Pill text={`Launch readiness ${checklist.score}%`} />
                <Pill text="EVzone Green primary" tone="brand" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <SoftButton onClick={() => safeNav(ROUTES.booksManager)}>
                <ArrowLeft className="h-4 w-4" />
                Books Manager
              </SoftButton>
              <SoftButton onClick={() => setPreviewOpen(true)}>
                <Eye className="h-4 w-4" />
                Preview
              </SoftButton>
              <PrimaryActionButton tone="green">
                <Save className="h-4 w-4" />
                Save draft
              </PrimaryActionButton>
              <PrimaryActionButton tone="orange">
                <Rocket className="h-4 w-4" />
                Publish book
              </PrimaryActionButton>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {metricCards.map((card) => (
              <div
                key={card.label}
                className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm transition dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  {card.label}
                </div>
                <div className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">
                  {card.value}
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {card.hint}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)_420px]">
          <div className="space-y-4">
            <StepRail step={step} setStep={setStep} />

            <Card title="Quick launch actions" subtitle="Connected premium workflows">
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => safeNav(ROUTES.liveBuilder)}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                >
                  <div>
                    <div className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100">
                      Companion Live Session
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      Use the book in a live teaching, class, or replay flow.
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => safeNav(ROUTES.beaconBuilder)}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                >
                  <div>
                    <div className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100">
                      Promote with Beacon
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      Turn this book into a linked promotion or launch a campaign around it.
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {renderStepContent()}
          </div>

          <div className="space-y-4 xl:sticky xl:top-[152px] xl:self-start">
            <Card
              title="Reader preview"
              subtitle="Desktop and mobile storefront simulation"
              right={
                <Segmented
                  items={["desktop", "mobile"]}
                  value={previewMode}
                  onChange={(value) => setPreviewMode(value as PreviewMode)}
                />
              }
            >
              <StorefrontPreview draft={draft} mode={previewMode} />
              <div className="mt-4 flex flex-wrap gap-2">
                <SoftButton onClick={() => setPreviewOpen(true)}>
                  <Eye className="h-4 w-4" />
                  Open larger preview
                </SoftButton>
                <PrimaryActionButton tone="green" className="flex-1">
                  <BookOpen className="h-4 w-4" />
                  Reader-ready
                </PrimaryActionButton>
              </div>
            </Card>

            <Card title="Builder summary" subtitle="What this page is shaping">
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    <BookOpen className="h-4 w-4" style={{ color: EV_GREEN }} />
                    Premium book destination
                  </div>
                  <div className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    Book Builder is the dedicated create/edit surface launched from the <span className="font-semibold text-slate-900 dark:text-slate-100">+ New Book</span> action in Books Manager. It turns ideas, manuscripts, covers, and chapters into a launch-ready FaithHub book object with premium packaging.
                  </div>
                </div>

                <div className="grid gap-2">
                  {[
                    {
                      icon: <FileText className="h-4 w-4" />,
                      label: "Storefront-ready metadata",
                    },
                    {
                      icon: <Languages className="h-4 w-4" />,
                      label: "Localized title and subtitle variants",
                    },
                    {
                      icon: <Megaphone className="h-4 w-4" />,
                      label: "Notification and Beacon hooks",
                    },
                    {
                      icon: <ShieldCheck className="h-4 w-4" />,
                      label: "Approvals and trust checks",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900"
                    >
                      <div className="text-slate-500">{item.icon}</div>
                      <div className="text-[12px] font-bold text-slate-800 dark:text-slate-200">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {previewOpen ? (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={() => setPreviewOpen(false)}
          />
          <div className="absolute inset-0 overflow-hidden bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
            <div className="mx-auto flex h-full max-w-[1400px] flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    Book storefront preview
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Preview how the premium FaithHub book page feels before launch.
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Segmented
                    items={["desktop", "mobile"]}
                    value={previewMode}
                    onChange={(value) => setPreviewMode(value as PreviewMode)}
                  />
                  <SoftButton onClick={() => setPreviewOpen(false)}>
                    <Check className="h-4 w-4" />
                    Close
                  </SoftButton>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-5">
                <StorefrontPreview draft={draft} mode={previewMode} expanded />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}




