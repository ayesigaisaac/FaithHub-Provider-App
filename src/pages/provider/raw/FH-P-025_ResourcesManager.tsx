// @ts-nocheck
"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Globe2,
  Headphones,
  Layers,
  Link2,
  PlayCircle,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Upload,
  Users,
  Wand2,
  X,
} from "lucide-react";
import { handleRawPlaceholderAction } from "./placeholderActions";

/**
 * FaithHub — FH-P-025 Resources Manager
 * -------------------------------------
 * Premium Provider-side control surface for free learning resources,
 * downloadable PDFs, devotionals, prayer guides, study packs, and audio teachings.
 *
 * Design intent
 * - Use the old Resources page structure as the visual base.
 * - Keep EVzone Green as primary and Orange as secondary.
 * - Position paid resources in FaithMart while keeping free resources here.
 * - Add a premium preview rail so providers can see how the library/detail experience
 *   looks on desktop and mobile.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#0f172a";

const ROUTES = {
  booksManager: "/faithhub/provider/books-manager",
  bookBuilder: "/faithhub/provider/book-builder",
  faithMart: "/faithmart/resources",
  standaloneTeaching: "/faithhub/provider/standalone-teaching-builder",
};

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  if (typeof window === "undefined") return;
  window.location.assign(url);
}

function fmtInt(n: number) {
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

type ResourceType =
  | "PDF"
  | "Audio"
  | "Devotional"
  | "Study Guide"
  | "Prayer Guide"
  | "Reading Plan";

type ResourceCategory =
  | "Books"
  | "Prayer"
  | "Devotionals"
  | "Leadership"
  | "Family"
  | "Youth"
  | "Study";

type ResourceTone = "emerald" | "orange" | "navy" | "plum" | "sky";
type PreviewMode = "desktop" | "mobile";

type ResourceRecord = {
  id: string;
  title: string;
  author: string;
  sourceLabel: string;
  type: ResourceType;
  category: ResourceCategory;
  summary: string;
  tags: string[];
  denominations: string[];
  audiences: string[];
  ages: string[];
  language: string;
  dateISO: string;
  downloads: number;
  featured: boolean;
  recommended: boolean;
  providerUploaded: boolean;
  trustedUpload: boolean;
  tone: ResourceTone;
  detailCta: string;
};

const INITIAL_RESOURCES: ResourceRecord[] = [
  {
    id: "res-daily-grace",
    title: "Daily Grace Devotional",
    author: "Pastor Anna",
    sourceLabel: "Provider",
    type: "Devotional",
    category: "Devotionals",
    summary:
      "A 30-day devotional guide for prayer, gratitude, and steady spiritual routines.",
    tags: ["devotional", "daily", "prayer"],
    denominations: ["All denominations"],
    audiences: ["Adults", "New believers"],
    ages: ["18+"],
    language: "English",
    dateISO: "2026-03-25T10:00:00Z",
    downloads: 412,
    featured: true,
    recommended: true,
    providerUploaded: true,
    trustedUpload: true,
    tone: "emerald",
    detailCta: "Open details",
  },
  {
    id: "res-family-prayer",
    title: "Family Prayer Handbook",
    author: "Leader Michael",
    sourceLabel: "Provider",
    type: "PDF",
    category: "Books",
    summary:
      "A practical family prayer handbook with weekly templates and conversation starters.",
    tags: ["family", "prayer", "guide"],
    denominations: ["All denominations"],
    audiences: ["Families", "Parents"],
    ages: ["All ages"],
    language: "English",
    dateISO: "2026-03-21T11:30:00Z",
    downloads: 289,
    featured: true,
    recommended: false,
    providerUploaded: true,
    trustedUpload: true,
    tone: "orange",
    detailCta: "Open details",
  },
  {
    id: "res-scripture-audio",
    title: "Scripture Meditation Audio",
    author: "Grace N.",
    sourceLabel: "Provider",
    type: "Audio",
    category: "Prayer",
    summary:
      "Calm audio reflections to guide scripture meditation and journaling moments.",
    tags: ["meditation", "scripture"],
    denominations: ["All denominations"],
    audiences: ["Adults", "Young adults"],
    ages: ["16+"],
    language: "English",
    dateISO: "2026-03-29T08:45:00Z",
    downloads: 54,
    featured: false,
    recommended: false,
    providerUploaded: true,
    trustedUpload: false,
    tone: "sky",
    detailCta: "Open details",
  },
  {
    id: "res-leadership-notes",
    title: "Community Leadership Notes",
    author: "Provider Team",
    sourceLabel: "Provider",
    type: "PDF",
    category: "Leadership",
    summary:
      "Short PDF notes for leaders running prayer circles and discussion groups.",
    tags: ["leadership", "community"],
    denominations: ["Anglican", "Catholic"],
    audiences: ["Leaders", "Volunteers"],
    ages: ["18+"],
    language: "English",
    dateISO: "2026-03-28T15:10:00Z",
    downloads: 93,
    featured: false,
    recommended: true,
    providerUploaded: true,
    trustedUpload: true,
    tone: "navy",
    detailCta: "Open details",
  },
  {
    id: "res-youth-audio",
    title: "Youth Purpose Audio Series",
    author: "FaithHub Editorial",
    sourceLabel: "FaithHub",
    type: "Audio",
    category: "Youth",
    summary:
      "Seven short audio teachings focused on identity, focus, and meaningful choices.",
    tags: ["youth", "purpose", "audio"],
    denominations: ["All denominations"],
    audiences: ["Youth"],
    ages: ["13-17", "18-25"],
    language: "English",
    dateISO: "2026-03-23T12:00:00Z",
    downloads: 198,
    featured: false,
    recommended: true,
    providerUploaded: false,
    trustedUpload: false,
    tone: "plum",
    detailCta: "Open details",
  },
  {
    id: "res-marriage-plan",
    title: "Marriage Foundations Reading Plan",
    author: "Pastor Ruth",
    sourceLabel: "Provider",
    type: "Reading Plan",
    category: "Family",
    summary:
      "Four-week reading plan for couples, discussion partners, and mentoring circles.",
    tags: ["family", "reading", "discipleship"],
    denominations: ["Pentecostal", "Baptist"],
    audiences: ["Couples", "Adults"],
    ages: ["18+"],
    language: "English",
    dateISO: "2026-03-18T09:15:00Z",
    downloads: 171,
    featured: false,
    recommended: false,
    providerUploaded: true,
    trustedUpload: false,
    tone: "emerald",
    detailCta: "Open details",
  },
  {
    id: "res-prayer-walk",
    title: "City Prayer Walk Guide",
    author: "Outreach Team",
    sourceLabel: "Provider",
    type: "Prayer Guide",
    category: "Prayer",
    summary:
      "Field guide for neighborhood prayer walks, observation prompts, and group debrief.",
    tags: ["prayer", "outreach", "guide"],
    denominations: ["All denominations"],
    audiences: ["Outreach teams", "Adults"],
    ages: ["18+"],
    language: "English",
    dateISO: "2026-03-16T14:20:00Z",
    downloads: 88,
    featured: false,
    recommended: false,
    providerUploaded: true,
    trustedUpload: true,
    tone: "orange",
    detailCta: "Open details",
  },
  {
    id: "res-discipleship-guide",
    title: "Gospel Foundations Study Notes",
    author: "FaithHub Editorial",
    sourceLabel: "FaithHub",
    type: "Study Guide",
    category: "Study",
    summary:
      "Compact study notes covering gospel essentials, reflection prompts, and group check-ins.",
    tags: ["study", "gospel", "notes"],
    denominations: ["All denominations"],
    audiences: ["Adults", "New believers"],
    ages: ["16+"],
    language: "English",
    dateISO: "2026-03-11T07:30:00Z",
    downloads: 146,
    featured: false,
    recommended: true,
    providerUploaded: false,
    trustedUpload: false,
    tone: "sky",
    detailCta: "Open details",
  },
];

function toneStyles(tone: ResourceTone) {
  if (tone === "orange") {
    return {
      bg: "linear-gradient(135deg, rgba(247,127,0,0.18), rgba(247,127,0,0.05))",
      accent: EV_ORANGE,
    };
  }
  if (tone === "navy") {
    return {
      bg: "linear-gradient(135deg, rgba(15,23,42,0.18), rgba(15,23,42,0.04))",
      accent: EV_NAVY,
    };
  }
  if (tone === "plum") {
    return {
      bg: "linear-gradient(135deg, rgba(139,92,246,0.18), rgba(139,92,246,0.05))",
      accent: "#8b5cf6",
    };
  }
  if (tone === "sky") {
    return {
      bg: "linear-gradient(135deg, rgba(14,165,233,0.18), rgba(14,165,233,0.05))",
      accent: "#0ea5e9",
    };
  }
  return {
    bg: "linear-gradient(135deg, rgba(3,205,140,0.18), rgba(3,205,140,0.05))",
    accent: EV_GREEN,
  };
}

function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "good" | "warn" | "brand" | "soft";
}) {
  const cls =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "warn"
        ? "border-orange-200 bg-orange-50 text-orange-700"
        : tone === "brand"
          ? "border-transparent text-white"
          : tone === "soft"
            ? "border-slate-200 bg-white text-slate-600"
            : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-bold",
        cls,
      )}
      style={tone === "brand" ? { background: EV_GREEN } : undefined}
    >
      {children}
    </span>
  );
}

function Btn({
  children,
  onClick,
  tone = "neutral",
  left,
  className,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: "primary" | "secondary" | "neutral";
  left?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-[12px] font-bold transition disabled:opacity-50 disabled:cursor-not-allowed";
  const cls =
    tone === "primary"
      ? "text-white"
      : tone === "secondary"
        ? "border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
        : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(base, cls, className)}
      style={tone === "primary" ? { background: EV_GREEN } : undefined}
    >
      {left}
      {children}
    </button>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
      {children}
    </div>
  );
}

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[rgba(3,205,140,0.25)]"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function SearchField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search title, author, or tag"
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[rgba(3,205,140,0.25)]"
      />
    </div>
  );
}

function SectionTitle({
  icon,
  title,
  subtitle,
  right,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <div
          className="grid h-9 w-9 place-items-center rounded-2xl border border-[rgba(3,205,140,0.18)] bg-[rgba(3,205,140,0.08)]"
          style={{ color: EV_GREEN }}
        >
          {icon}
        </div>
        <div>
          <div className="text-[18px] font-black tracking-tight text-slate-900">{title}</div>
          {subtitle ? <div className="text-sm text-slate-500">{subtitle}</div> : null}
        </div>
      </div>
      {right}
    </div>
  );
}

function ResourceFeatureCard({
  resource,
  onOpen,
}: {
  resource: ResourceRecord;
  onOpen: () => void;
}) {
  const styles = toneStyles(resource.tone);

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="p-5" style={{ background: styles.bg }}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="truncate text-[22px] font-black tracking-tight text-slate-900">
                {resource.title}
              </div>
              <Pill tone="good">FREE</Pill>
              {resource.providerUploaded ? <Pill tone="soft">PROVIDER</Pill> : null}
            </div>
            <div className="mt-1 text-sm text-slate-600">
              {resource.author} · {resource.type} · {resource.category}
            </div>
          </div>
          <div
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
            style={{ background: styles.accent, color: "white" }}
          >
            {resource.type === "Audio" ? (
              <Headphones className="h-5 w-5" />
            ) : resource.type === "PDF" || resource.type === "Study Guide" ? (
              <FileText className="h-5 w-5" />
            ) : (
              <BookOpen className="h-5 w-5" />
            )}
          </div>
        </div>

        <div className="mt-4 text-[15px] leading-7 text-slate-700">{resource.summary}</div>

        <div className="mt-4 flex flex-wrap gap-2">
          {resource.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <div>{fmtDate(resource.dateISO)}</div>
          <div className="inline-flex items-center gap-2">
            <Download className="h-4 w-4" />
            {fmtInt(resource.downloads)} downloads
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Btn onClick={onOpen} tone="primary">
            Open details
          </Btn>
          <Btn left={<Download className="h-4 w-4" />}>Download</Btn>
          {resource.trustedUpload ? (
            <span
              className="inline-flex items-center rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em]"
              style={{
                borderColor: "rgba(3,205,140,0.35)",
                background: "rgba(3,205,140,0.10)",
                color: EV_GREEN,
              }}
            >
              Trusted provider upload
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ResourceMiniRow({
  resource,
  onOpen,
}: {
  resource: ResourceRecord;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-slate-300 hover:bg-slate-50"
    >
      <div className="min-w-0">
        <div className="truncate text-[15px] font-black tracking-tight text-slate-900">
          {resource.title}
        </div>
        <div className="truncate text-sm text-slate-500">
          {resource.type} · {fmtInt(resource.downloads)} downloads
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
    </button>
  );
}

function LibraryCard({
  resource,
  onOpen,
}: {
  resource: ResourceRecord;
  onOpen: () => void;
}) {
  const styles = toneStyles(resource.tone);
  const Icon =
    resource.type === "Audio"
      ? Headphones
      : resource.type === "PDF" || resource.type === "Study Guide"
        ? FileText
        : BookOpen;

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[21px] font-black tracking-tight text-slate-900">
            {resource.title}
          </div>
          <div className="mt-1 text-sm text-slate-500">
            {resource.author} · {resource.type} · {resource.category}
          </div>
        </div>
        <div className="inline-flex flex-wrap items-center justify-end gap-2">
          <Pill tone="good">FREE</Pill>
          {resource.providerUploaded ? <Pill tone="soft">PROVIDER</Pill> : null}
        </div>
      </div>

      <div className="mt-4 rounded-2xl p-4" style={{ background: styles.bg }}>
        <div className="flex items-center gap-3">
          <div
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
            style={{ background: styles.accent, color: "white" }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 text-sm leading-6 text-slate-700">{resource.summary}</div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {resource.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-500">
        <span>{fmtDate(resource.dateISO)}</span>
        <span className="inline-flex items-center gap-2">
          <Download className="h-4 w-4" />
          {fmtInt(resource.downloads)} downloads
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Btn tone="primary" onClick={onOpen}>Open details</Btn>
        <Btn>Download</Btn>
        {resource.trustedUpload ? (
          <span
            className="inline-flex items-center rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em]"
            style={{
              borderColor: "rgba(3,205,140,0.35)",
              background: "rgba(3,205,140,0.10)",
              color: EV_GREEN,
            }}
          >
            Trusted provider upload
          </span>
        ) : null}
      </div>
    </div>
  );
}

function ManageRow({
  resource,
  tagDraft,
  onChangeTags,
  onSaveTags,
  onToggleFeatured,
  onToggleRecommended,
  onRemove,
}: {
  resource: ResourceRecord;
  tagDraft: string;
  onChangeTags: (v: string) => void;
  onSaveTags: () => void;
  onToggleFeatured: () => void;
  onToggleRecommended: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-[17px] font-black tracking-tight text-slate-900">{resource.title}</div>
      <div className="mt-1 text-sm text-slate-500">
        {fmtInt(resource.downloads)} downloads · {resource.category}
      </div>
      <div className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
        Tags
      </div>
      <input
        value={tagDraft}
        onChange={(e) => onChangeTags(e.target.value)}
        className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[rgba(3,205,140,0.25)]"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn onClick={onSaveTags}>Save tags</Btn>
        <Btn onClick={onToggleFeatured}>{resource.featured ? "Unfeature" : "Feature"}</Btn>
        <Btn onClick={onToggleRecommended}>{resource.recommended ? "Unrecommend" : "Recommend"}</Btn>
        <Btn className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100" onClick={onRemove}>
          Remove
        </Btn>
      </div>
    </div>
  );
}

function DetailDrawer({
  resource,
  previewMode,
  onClose,
}: {
  resource: ResourceRecord | null;
  previewMode: PreviewMode;
  onClose: () => void;
}) {
  if (!resource) return null;
  const styles = toneStyles(resource.tone);
  return (
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-[760px] overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Resource details</div>
            <div className="mt-1 text-[22px] font-black tracking-tight text-slate-900">{resource.title}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div className="rounded-[28px] p-5" style={{ background: styles.bg }}>
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="good">FREE</Pill>
              <Pill tone="soft">{resource.type}</Pill>
              <Pill tone="soft">{resource.category}</Pill>
              {resource.trustedUpload ? <Pill tone="brand">Trusted upload</Pill> : null}
            </div>
            <div className="mt-4 text-base leading-7 text-slate-700">{resource.summary}</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Author</div>
                <div className="mt-1 text-sm font-bold text-slate-900">{resource.author}</div>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Language</div>
                <div className="mt-1 text-sm font-bold text-slate-900">{resource.language}</div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200 bg-white p-4">
              <div className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-500">Audience fit</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {resource.audiences.map((item) => (
                  <Pill key={item} tone="soft">{item}</Pill>
                ))}
              </div>
              <div className="mt-4 text-[12px] font-bold uppercase tracking-[0.18em] text-slate-500">Age group</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {resource.ages.map((item) => (
                  <Pill key={item} tone="soft">{item}</Pill>
                ))}
              </div>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-4">
              <div className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-500">Discovery tags</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <Pill key={tag} tone="soft">{tag}</Pill>
                ))}
              </div>
              <div className="mt-4 text-[12px] font-bold uppercase tracking-[0.18em] text-slate-500">Denominations</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {resource.denominations.map((item) => (
                  <Pill key={item} tone="soft">{item}</Pill>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-500">Member-facing preview</div>
                <div className="mt-1 text-sm text-slate-500">
                  Current preview mode: <span className="font-bold text-slate-900">{previewMode === "desktop" ? "Desktop" : "Mobile"}</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">
                <Eye className="h-3.5 w-3.5" />
                Preview synced with preview rail
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Downloads</div>
                <div className="mt-1 text-[18px] font-black tracking-tight text-slate-900">{fmtInt(resource.downloads)}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Published</div>
                <div className="mt-1 text-[18px] font-black tracking-tight text-slate-900">{fmtDate(resource.dateISO)}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Source</div>
                <div className="mt-1 text-[18px] font-black tracking-tight text-slate-900">{resource.sourceLabel}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Btn tone="primary" left={<Eye className="h-4 w-4" />}>Open public detail</Btn>
            <Btn left={<Download className="h-4 w-4" />}>Download asset</Btn>
            <Btn tone="secondary" left={<ExternalLink className="h-4 w-4" />}>Boost with Beacon</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewRail({
  resource,
  previewMode,
  onChangeMode,
}: {
  resource: ResourceRecord;
  previewMode: PreviewMode;
  onChangeMode: (v: PreviewMode) => void;
}) {
  const styles = toneStyles(resource.tone);
  const desktopFrame = (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
        <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        <div className="ml-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
          faithhub.app/resources
        </div>
      </div>
      <div className="space-y-4 p-4">
        <div className="rounded-[24px] p-4" style={{ background: styles.bg }}>
          <div className="flex items-center gap-2">
            <Pill tone="good">FREE</Pill>
            {resource.providerUploaded ? <Pill tone="soft">PROVIDER</Pill> : null}
            {resource.trustedUpload ? <Pill tone="brand">TRUSTED</Pill> : null}
          </div>
          <div className="mt-3 text-[20px] font-black tracking-tight text-slate-900">
            {resource.title}
          </div>
          <div className="mt-1 text-sm text-slate-500">{resource.author} · {resource.type}</div>
          <div className="mt-4 text-sm leading-6 text-slate-700">{resource.summary}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[20px] border border-slate-200 bg-white p-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Actions</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Btn tone="primary" className="px-3 py-2 text-[11px]">Open details</Btn>
              <Btn className="px-3 py-2 text-[11px]">Download</Btn>
            </div>
          </div>
          <div className="rounded-[20px] border border-slate-200 bg-white p-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Metadata</div>
            <div className="mt-3 space-y-1 text-sm text-slate-600">
              <div>{resource.category}</div>
              <div>{resource.language}</div>
              <div>{fmtInt(resource.downloads)} downloads</div>
            </div>
          </div>
        </div>
        <div className="rounded-[20px] border border-slate-200 bg-white p-4">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Tags</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {resource.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const mobileFrame = (
    <div className="mx-auto w-full max-w-[340px] md:max-w-[380px]">
      <div className="overflow-hidden rounded-[34px] bg-slate-950 p-3 shadow-[0_16px_50px_rgba(15,23,42,0.24)]">
        <div className="overflow-hidden rounded-[26px] bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">FaithHub</div>
              <div className="mt-1 text-[13px] font-black text-slate-900">Resources</div>
            </div>
            <div
              className="grid h-10 w-10 place-items-center rounded-2xl"
              style={{ background: styles.accent, color: "white" }}
            >
              {resource.type === "Audio" ? <Headphones className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
            </div>
          </div>
          <div className="space-y-3 p-4">
            <div className="rounded-[22px] p-4" style={{ background: styles.bg }}>
              <div className="flex items-center gap-2">
                <Pill tone="good">FREE</Pill>
                {resource.trustedUpload ? <Pill tone="brand">TRUSTED</Pill> : null}
              </div>
              <div className="mt-3 text-[18px] font-black tracking-tight text-slate-900">{resource.title}</div>
              <div className="mt-1 text-sm text-slate-500">{resource.author}</div>
              <div className="mt-3 text-[13px] leading-6 text-slate-700 line-clamp-4">{resource.summary}</div>
            </div>
            <button
              type="button"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl text-[13px] font-black text-white"
              style={{ background: EV_GREEN }}
              onClick={handleRawPlaceholderAction("open_resources_manager")}>
              <Eye className="h-4 w-4" /> Open details
            </button>
            <button
              type="button"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-[13px] font-black text-slate-800"
              onClick={handleRawPlaceholderAction("copy_current_link")}>
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="sticky top-6 space-y-4">
      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Preview
            </div>
            <div className="mt-1 text-[20px] font-black tracking-tight text-slate-900">
              Member-facing resource view
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Preview how the selected free resource appears in the library and detail flow.
            </div>
          </div>
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => onChangeMode("desktop")}
              className={cx(
                "rounded-full px-3 py-1.5 text-[11px] font-black transition",
                previewMode === "desktop"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              Desktop
            </button>
            <button
              type="button"
              onClick={() => onChangeMode("mobile")}
              className={cx(
                "rounded-full px-3 py-1.5 text-[11px] font-black transition",
                previewMode === "mobile"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              Mobile
            </button>
          </div>
        </div>
        <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-3">
          {previewMode === "desktop" ? desktopFrame : mobileFrame}
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Preview signals</div>
        <div className="mt-3 space-y-3">
          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-600" />
            <div>
              <div className="text-sm font-black text-slate-900">Trust badge visible</div>
              <div className="mt-1 text-[13px] leading-6 text-slate-500">
                Trusted provider uploads are clearly labeled so free resources still feel premium and safe.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Globe2 className="mt-0.5 h-4 w-4" style={{ color: EV_ORANGE }} />
            <div>
              <div className="text-sm font-black text-slate-900">Audience metadata visible</div>
              <div className="mt-1 text-[13px] leading-6 text-slate-500">
                Language, audience fit, and category stay visible so discovery works cleanly across ministries.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResourcesManagerPage() {
  const [resources, setResources] = useState<ResourceRecord[]>(INITIAL_RESOURCES);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [type, setType] = useState("All types");
  const [denomination, setDenomination] = useState("All denominations");
  const [audience, setAudience] = useState("All audiences");
  const [ageGroup, setAgeGroup] = useState("All ages");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [selectedResourceId, setSelectedResourceId] = useState(INITIAL_RESOURCES[0]?.id || "");
  const [detailResourceId, setDetailResourceId] = useState<string | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formSummary, setFormSummary] = useState("");
  const [formType, setFormType] = useState<ResourceType>("PDF");
  const [formCategory, setFormCategory] = useState<ResourceCategory>("Books");
  const [formFileUrl, setFormFileUrl] = useState("");
  const [formTags, setFormTags] = useState("prayer, discipleship, youth");
  const [formDenominations, setFormDenominations] = useState("Anglican, Catholic");
  const [formAudiences, setFormAudiences] = useState("Youth, Couples");
  const [formAgeGroups, setFormAgeGroups] = useState("13-17, 18-25");

  const [tagDrafts, setTagDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(INITIAL_RESOURCES.map((resource) => [resource.id, resource.tags.join(", ")])),
  );

  const categories = useMemo(
    () => ["All categories", "Books", "Prayer", "Devotionals", "Leadership", "Family", "Youth", "Study"],
    [],
  );
  const types = useMemo(
    () => ["All types", "PDF", "Audio", "Devotional", "Study Guide", "Prayer Guide", "Reading Plan"],
    [],
  );
  const denominations = useMemo(
    () => ["All denominations", "Anglican", "Catholic", "Pentecostal", "Baptist"],
    [],
  );
  const audiences = useMemo(
    () => ["All audiences", "Adults", "Youth", "Families", "Parents", "Leaders", "New believers", "Volunteers"],
    [],
  );
  const ageGroups = useMemo(
    () => ["All ages", "13-17", "16+", "18+"],
    [],
  );

  const filteredResources = useMemo(() => {
    const q = search.trim().toLowerCase();
    return resources.filter((resource) => {
      const matchesSearch =
        !q ||
        resource.title.toLowerCase().includes(q) ||
        resource.author.toLowerCase().includes(q) ||
        resource.tags.some((tag) => tag.toLowerCase().includes(q));
      const matchesCategory = category === "All categories" || resource.category === category;
      const matchesType = type === "All types" || resource.type === type;
      const matchesDenomination =
        denomination === "All denominations" || resource.denominations.includes(denomination);
      const matchesAudience = audience === "All audiences" || resource.audiences.includes(audience);
      const matchesAge = ageGroup === "All ages" || resource.ages.includes(ageGroup);
      return (
        matchesSearch &&
        matchesCategory &&
        matchesType &&
        matchesDenomination &&
        matchesAudience &&
        matchesAge
      );
    });
  }, [ageGroup, audience, category, denomination, resources, search, type]);

  const featuredResources = useMemo(
    () => filteredResources.filter((item) => item.featured).slice(0, 2),
    [filteredResources],
  );

  const recentResources = useMemo(
    () => [...filteredResources].sort((a, b) => +new Date(b.dateISO) - +new Date(a.dateISO)).slice(0, 4),
    [filteredResources],
  );

  const recommendedResources = useMemo(
    () => filteredResources.filter((item) => item.recommended).slice(0, 4),
    [filteredResources],
  );

  const providerResources = useMemo(
    () => filteredResources.filter((item) => item.providerUploaded),
    [filteredResources],
  );

  const selectedResource =
    resources.find((item) => item.id === selectedResourceId) || filteredResources[0] || resources[0];

  const detailResource =
    resources.find((item) => item.id === detailResourceId) || null;

  const stats = useMemo(() => {
    const providerCount = resources.filter((item) => item.providerUploaded).length;
    const trustedCount = resources.filter((item) => item.trustedUpload).length;
    return {
      total: resources.length,
      providerCount,
      trustedCount,
      featuredCount: resources.filter((item) => item.featured).length,
    };
  }, [resources]);

  function selectResource(resource: ResourceRecord) {
    setSelectedResourceId(resource.id);
    setDetailResourceId(resource.id);
  }

  function saveTags(resourceId: string) {
    const next = tagDrafts[resourceId] || "";
    const tags = next
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 8);

    setResources((current) =>
      current.map((resource) =>
        resource.id === resourceId ? { ...resource, tags } : resource,
      ),
    );
    setUploadNotice("Resource tags updated.");
  }

  function toggleFeatured(resourceId: string) {
    setResources((current) =>
      current.map((resource) =>
        resource.id === resourceId
          ? { ...resource, featured: !resource.featured }
          : resource,
      ),
    );
    setUploadNotice("Featured state updated.");
  }

  function toggleRecommended(resourceId: string) {
    setResources((current) =>
      current.map((resource) =>
        resource.id === resourceId
          ? { ...resource, recommended: !resource.recommended }
          : resource,
      ),
    );
    setUploadNotice("Recommendation state updated.");
  }

  function removeResource(resourceId: string) {
    setResources((current) => current.filter((resource) => resource.id !== resourceId));
    setUploadNotice("Resource removed from the provider library.");
    if (selectedResourceId === resourceId) {
      const next = resources.find((resource) => resource.id !== resourceId);
      if (next) setSelectedResourceId(next.id);
    }
  }

  function publishResource() {
    if (!formTitle.trim() || !formSummary.trim()) {
      setUploadNotice("Add a title and summary before publishing.");
      return;
    }

    const created: ResourceRecord = {
      id: `res-${Date.now()}`,
      title: formTitle.trim(),
      author: "Provider Team",
      sourceLabel: "Provider",
      type: formType,
      category: formCategory,
      summary: formSummary.trim(),
      tags: formTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      denominations: formDenominations
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      audiences: formAudiences
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      ages: formAgeGroups
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      language: "English",
      dateISO: new Date().toISOString(),
      downloads: 0,
      featured: false,
      recommended: false,
      providerUploaded: true,
      trustedUpload: true,
      tone: formType === "Audio" ? "sky" : formCategory === "Prayer" ? "orange" : "emerald",
      detailCta: formFileUrl.trim() ? "Open details" : "Open details",
    };

    setResources((current) => [created, ...current]);
    setTagDrafts((current) => ({ ...current, [created.id]: created.tags.join(", ") }));
    setSelectedResourceId(created.id);
    setDetailResourceId(created.id);
    setUploadNotice("Free resource published successfully.");

    setFormTitle("");
    setFormSummary("");
    setFormType("PDF");
    setFormCategory("Books");
    setFormFileUrl("");
    setFormTags("prayer, discipleship, youth");
    setFormDenominations("Anglican, Catholic");
    setFormAudiences("Youth, Couples");
    setFormAgeGroups("13-17, 18-25");
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-slate-900">
      <main className="mx-auto max-w-[1720px] p-4 md:p-6 lg:p-8">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-5">
            <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-4xl">
                  <Label>Books & resources</Label>
                  <h1 className="mt-3 text-[38px] font-black tracking-[-0.04em] text-slate-900 md:text-[50px]">
                    Free Learning Resources
                  </h1>
                  <p className="mt-3 max-w-3xl text-[17px] leading-8 text-slate-500">
                    Explore free books, PDFs, audio teachings, devotionals, study packs, and prayer guides. Paid resources remain in FaithMart.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Pill tone="brand">{stats.total} free resources</Pill>
                    <Pill tone="soft">Provider upload enabled</Pill>
                    <Pill tone="soft">{stats.trustedCount} trusted uploads</Pill>
                    <Pill tone="warn">FaithMart bridge active</Pill>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  <Btn
                    tone="primary"
                    left={<Plus className="h-4 w-4" />}
                    onClick={() => {
                      const el = document.getElementById("provider-upload-panel");
                      el?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    + New Resource
                  </Btn>
                  <Btn
                    left={<Eye className="h-4 w-4" />}
                    onClick={() => setDetailResourceId(selectedResource?.id || null)}
                  >
                    Preview library
                  </Btn>
                  <Btn
                    tone="secondary"
                    left={<ExternalLink className="h-4 w-4" />}
                    onClick={() => safeNav(ROUTES.faithMart)}
                  >
                    Explore premium resources in FaithMart
                  </Btn>
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    <BookOpen className="h-4 w-4" /> Library count
                  </div>
                  <div className="mt-3 text-[28px] font-black tracking-tight text-slate-900">{fmtInt(stats.total)}</div>
                  <div className="mt-1 text-sm text-slate-500">Free resources live inside FaithHub.</div>
                </div>
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    <BadgeCheck className="h-4 w-4" /> Trusted uploads
                  </div>
                  <div className="mt-3 text-[28px] font-black tracking-tight text-slate-900">{fmtInt(stats.trustedCount)}</div>
                  <div className="mt-1 text-sm text-slate-500">High-trust resources from verified provider workflows.</div>
                </div>
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    <Sparkles className="h-4 w-4" /> Featured shelves
                  </div>
                  <div className="mt-3 text-[28px] font-black tracking-tight text-slate-900">{fmtInt(stats.featuredCount)}</div>
                  <div className="mt-1 text-sm text-slate-500">Provider-curated resources surfaced above the library.</div>
                </div>
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    <Link2 className="h-4 w-4" /> FaithMart bridge
                  </div>
                  <div className="mt-3 text-[28px] font-black tracking-tight text-slate-900">Active</div>
                  <div className="mt-1 text-sm text-slate-500">Premium products and paid resources continue in FaithMart.</div>
                </div>
              </div>
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <SectionTitle
                icon={<Filter className="h-4 w-4" />}
                title="Search and filter"
                subtitle="Search title, author, tag, and then narrow the library by category, type, audience, denomination, or age group."
              />

              <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_180px]">
                <SearchField value={search} onChange={setSearch} />
                <div>
                  <Label>Category</Label>
                  <SelectField value={category} onChange={setCategory} options={categories} />
                </div>
                <div>
                  <Label>Type</Label>
                  <SelectField value={type} onChange={setType} options={types} />
                </div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <div>
                  <Label>Denomination</Label>
                  <SelectField value={denomination} onChange={setDenomination} options={denominations} />
                </div>
                <div>
                  <Label>Audience</Label>
                  <SelectField value={audience} onChange={setAudience} options={audiences} />
                </div>
                <div>
                  <Label>Age group</Label>
                  <SelectField value={ageGroup} onChange={setAgeGroup} options={ageGroups} />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <SectionTitle
                icon={<Sparkles className="h-4 w-4" />}
                title="Featured resources"
                subtitle="Pinned free resources that deserve extra visibility before the main library grid."
              />
              <div className="grid gap-4 lg:grid-cols-2">
                {featuredResources.length ? (
                  featuredResources.map((resource) => (
                    <ResourceFeatureCard
                      key={resource.id}
                      resource={resource}
                      onOpen={() => selectResource(resource)}
                    />
                  ))
                ) : (
                  <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 lg:col-span-2">
                    No featured resources match the current filters.
                  </div>
                )}
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <SectionTitle
                  icon={<Bell className="h-4 w-4" />}
                  title="Recently added"
                  subtitle="The newest free resources uploaded into the ministry library."
                />
                <div className="mt-4 space-y-2">
                  {recentResources.map((resource) => (
                    <ResourceMiniRow
                      key={resource.id}
                      resource={resource}
                      onOpen={() => selectResource(resource)}
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <SectionTitle
                  icon={<Star className="h-4 w-4" />}
                  title="Recommended"
                  subtitle="Resources the provider or FaithHub editorial team wants to surface next."
                />
                <div className="mt-4 space-y-2">
                  {recommendedResources.length ? (
                    recommendedResources.map((resource) => (
                      <ResourceMiniRow
                        key={resource.id}
                        resource={resource}
                        onOpen={() => selectResource(resource)}
                      />
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                      No recommended resources match the active filters.
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <SectionTitle
                icon={<Layers className="h-4 w-4" />}
                title="Resource library"
                subtitle="The full free-resource shelf for books, PDFs, devotionals, prayer guides, and audio learning assets."
                right={<Pill tone="soft">{filteredResources.length} visible</Pill>}
              />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredResources.map((resource) => (
                  <LibraryCard
                    key={resource.id}
                    resource={resource}
                    onOpen={() => selectResource(resource)}
                  />
                ))}
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <div id="provider-upload-panel" className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <SectionTitle
                  icon={<Upload className="h-4 w-4" />}
                  title="Provider upload"
                  subtitle="Upload free resources for the community and tag them for clean discovery across the FaithHub library."
                />

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Label>Title</Label>
                    <input
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Resource title"
                      className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[rgba(3,205,140,0.25)]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Description</Label>
                    <textarea
                      value={formSummary}
                      onChange={(e) => setFormSummary(e.target.value)}
                      placeholder="Short summary"
                      rows={4}
                      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[rgba(3,205,140,0.25)]"
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <SelectField
                      value={formType}
                      onChange={(value) => setFormType(value as ResourceType)}
                      options={["PDF", "Audio", "Devotional", "Study Guide", "Prayer Guide", "Reading Plan"]}
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <SelectField
                      value={formCategory}
                      onChange={(value) => setFormCategory(value as ResourceCategory)}
                      options={["Books", "Prayer", "Devotionals", "Leadership", "Family", "Youth", "Study"]}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>File URL</Label>
                    <input
                      value={formFileUrl}
                      onChange={(e) => setFormFileUrl(e.target.value)}
                      placeholder="https://..."
                      className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[rgba(3,205,140,0.25)]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Tags (comma separated)</Label>
                    <input
                      value={formTags}
                      onChange={(e) => setFormTags(e.target.value)}
                      className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[rgba(3,205,140,0.25)]"
                    />
                  </div>
                  <div>
                    <Label>Denominations (comma separated)</Label>
                    <input
                      value={formDenominations}
                      onChange={(e) => setFormDenominations(e.target.value)}
                      className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[rgba(3,205,140,0.25)]"
                    />
                  </div>
                  <div>
                    <Label>Audience groups</Label>
                    <input
                      value={formAudiences}
                      onChange={(e) => setFormAudiences(e.target.value)}
                      className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[rgba(3,205,140,0.25)]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Age groups</Label>
                    <input
                      value={formAgeGroups}
                      onChange={(e) => setFormAgeGroups(e.target.value)}
                      className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[rgba(3,205,140,0.25)]"
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-slate-500">
                    Free resources stay here. Premium and paid assets should move through FaithMart.
                  </div>
                  <Btn tone="primary" left={<Upload className="h-4 w-4" />} onClick={publishResource}>
                    Publish free resource
                  </Btn>
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <SectionTitle
                  icon={<Wand2 className="h-4 w-4" />}
                  title="Manage provider resources"
                  subtitle="Maintain tags, curation, visibility, and trust signals for provider-owned uploads."
                />
                <div className="mt-5 space-y-4">
                  {providerResources.slice(0, 4).map((resource) => (
                    <ManageRow
                      key={resource.id}
                      resource={resource}
                      tagDraft={tagDrafts[resource.id] || resource.tags.join(", ")}
                      onChangeTags={(next) =>
                        setTagDrafts((current) => ({ ...current, [resource.id]: next }))
                      }
                      onSaveTags={() => saveTags(resource.id)}
                      onToggleFeatured={() => toggleFeatured(resource.id)}
                      onToggleRecommended={() => toggleRecommended(resource.id)}
                      onRemove={() => removeResource(resource.id)}
                    />
                  ))}
                </div>
              </div>
            </section>
          </div>

          <PreviewRail
            resource={selectedResource}
            previewMode={previewMode}
            onChangeMode={setPreviewMode}
          />
        </div>
      </main>

      {uploadNotice ? (
        <div className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-lg">
            <CheckCircle2 className="h-4 w-4" />
            {uploadNotice}
          </div>
        </div>
      ) : null}

      <DetailDrawer
        resource={detailResource}
        previewMode={previewMode}
        onClose={() => setDetailResourceId(null)}
      />
    </div>
  );
}



