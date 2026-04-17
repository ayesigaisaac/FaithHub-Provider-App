// @ts-nocheck

"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Bell,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  Eye,
  ExternalLink,
  FileText,
  Globe2,
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
  Workflow,
  X,
  Zap,
} from "lucide-react";

/**
 * FaithHub — FH-P-023 Books Manager
 * ---------------------------------
 * Premium Provider-side control surface for books, devotionals, manuals,
 * study guides, and downloadable teaching resources.
 *
 * Page goals
 * - Keep the same premium creator-style grammar already used across the FaithHub Provider pages.
 * - Use EVzone Green as the primary accent and Orange as the secondary accent.
 * - Make Books Manager the operational control page and push creation into Book Builder
 *   through a strong "+ New Book" primary CTA.
 * - Include an always-visible storefront preview rail plus a larger preview drawer.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#0f172a";

const ROUTES = {
  providerDashboard: "/faithhub/provider/dashboard",
  audienceNotifications: "/faithhub/provider/audience-notifications",
  beaconBuilder: "/faithhub/provider/beacon-builder",
  bookBuilder: "/faithhub/provider/book-builder",
};

const HERO_1 =
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1600&q=80";
const HERO_2 =
  "https://images.unsplash.com/photo-1504051771394-dd2e66b2e08f?auto=format&fit=crop&w=1600&q=80";
const HERO_3 =
  "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1600&q=80";
const HERO_4 =
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80";
const HERO_5 =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80";

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  if (typeof window === "undefined") return;
  window.location.assign(url);
}

function fmtInt(n: number) {
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function money(n: number, currency = "$") {
  return `${currency}${Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(n)}`;
}

function fmtLocal(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function pct(value: number, total: number) {
  if (!total) return 0;
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}

type BookStatus = "Draft" | "Scheduled" | "Published" | "Archived";
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
type PreviewMode = "desktop" | "mobile";
type FormatKind = "PDF" | "ePub" | "Audio" | "Print" | "Web Reader";

type ChapterItem = {
  id: string;
  title: string;
  pages: string;
};

type VersionItem = {
  id: string;
  label: string;
  type: string;
  status: "Live" | "Queued" | "Needs export";
  sizeLabel: string;
};

type HookItem = {
  id: string;
  label: string;
  hint: string;
  status: "Ready" | "Draft" | "Pending";
};

type BookRecord = {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  kind: BookKind;
  status: BookStatus;
  access: AccessModel;
  coverUrl: string;
  description: string;
  campus: string;
  owner: string;
  languages: string[];
  formats: FormatKind[];
  chapters: ChapterItem[];
  versions: VersionItem[];
  hooks: HookItem[];
  connectedTo: string[];
  updatedISO: string;
  coverAltReady: boolean;
  metadataReady: boolean;
  chapteringReady: boolean;
  reviewReady: boolean;
  translationsDue: number;
  priceLabel: string;
  downloads: number;
  readingStarts: number;
  completions: number;
  reviews: number;
  revenue: number;
  quote: string;
};

const TEMPLATE_CARDS = [
  {
    id: "tpl-devotional",
    title: "Daily devotional",
    subtitle: "Short-form chapters, reflection prompts, and soft follow-up journeys.",
    accent: "green" as const,
  },
  {
    id: "tpl-guide",
    title: "Study guide",
    subtitle: "Scripture references, group questions, notes, and downloadable extras.",
    accent: "orange" as const,
  },
  {
    id: "tpl-manual",
    title: "Manual / handbook",
    subtitle: "Operational or ministry manuals with version control and approvals.",
    accent: "navy" as const,
  },
  {
    id: "tpl-reader",
    title: "Course reader",
    subtitle: "Session-by-session reading packs linked to classes, series, or events.",
    accent: "green" as const,
  },
];

const COLLECTIONS = [
  {
    id: "col-devotional",
    title: "Devotional shelf",
    subtitle: "Short daily or weekly reading journeys.",
    count: 9,
    readiness: "Stable",
  },
  {
    id: "col-guides",
    title: "Study guide shelf",
    subtitle: "Episode-linked guides and downloadable notes.",
    count: 6,
    readiness: "Growing",
  },
  {
    id: "col-manuals",
    title: "Manuals & handbooks",
    subtitle: "Leadership, training, and operations materials.",
    count: 4,
    readiness: "Healthy",
  },
  {
    id: "col-live",
    title: "Live-linked reading packs",
    subtitle: "Books and guides connected to Live Sessions and replays.",
    count: 7,
    readiness: "Active",
  },
];

const BOOKS: BookRecord[] = [
  {
    id: "book-001",
    title: "40 Days of Renewal",
    subtitle: "A guided devotional journey for prayer, repentance, and spiritual reset.",
    author: "Pastor Daniel M.",
    kind: "Devotional",
    status: "Published",
    access: "Free",
    coverUrl: HERO_1,
    description:
      "A premium devotional package with daily reflections, scripture readings, and guided response prompts designed for mobile reading and printable download.",
    campus: "All campuses",
    owner: "Content Team",
    languages: ["English", "Swahili"],
    formats: ["PDF", "ePub", "Audio", "Web Reader"],
    chapters: [
      { id: "c1", title: "Day 1 · Return with humility", pages: "6 pages" },
      { id: "c2", title: "Day 2 · Prayer in hidden places", pages: "5 pages" },
      { id: "c3", title: "Day 3 · Grace for weak days", pages: "6 pages" },
    ],
    versions: [
      { id: "v1", label: "Reader v2.1", type: "Web Reader", status: "Live", sizeLabel: "Responsive" },
      { id: "v2", label: "ePub export", type: "ePub", status: "Live", sizeLabel: "4.2 MB" },
      { id: "v3", label: "Narrated audio pack", type: "Audio", status: "Queued", sizeLabel: "31 min" },
    ],
    hooks: [
      { id: "h1", label: "Replay follow-up ready", hint: "Audience Notifications journey can send Day 1 after replay.", status: "Ready" },
      { id: "h2", label: "Beacon promo card", hint: "Awareness and reading-start creative prepared.", status: "Ready" },
      { id: "h3", label: "Reading plan import", hint: "Connected to devotional streak prompts.", status: "Ready" },
    ],
    connectedTo: ["Prayer Week Live Session", "Morning devotion noticeboard", "Beacon: Renewal campaign"],
    updatedISO: new Date(Date.now() - 1000 * 60 * 58).toISOString(),
    coverAltReady: true,
    metadataReady: true,
    chapteringReady: true,
    reviewReady: true,
    translationsDue: 0,
    priceLabel: "Free access",
    downloads: 12840,
    readingStarts: 8620,
    completions: 3910,
    reviews: 112,
    revenue: 0,
    quote: "A practical companion for returning to prayer, scripture, and honest spiritual reflection.",
  },
  {
    id: "book-002",
    title: "Kingdom Stewardship Workbook",
    subtitle: "A practical guide for generosity, discipline, and gospel-centered financial wisdom.",
    author: "Minister Ruth K.",
    kind: "Study Guide",
    status: "Draft",
    access: "Supporter",
    coverUrl: HERO_2,
    description:
      "Workbook-style study guide with exercises, discussion prompts, giving reflections, and downloadable worksheets for groups and personal study.",
    campus: "Leadership circle",
    owner: "Teaching + Finance",
    languages: ["English"],
    formats: ["PDF", "Web Reader"],
    chapters: [
      { id: "c1", title: "Stewardship and trust", pages: "9 pages" },
      { id: "c2", title: "Generosity in community", pages: "7 pages" },
      { id: "c3", title: "Budgeting as discipleship", pages: "8 pages" },
    ],
    versions: [
      { id: "v1", label: "Workbook draft", type: "PDF", status: "Needs export", sizeLabel: "—" },
      { id: "v2", label: "Reader layout", type: "Web Reader", status: "Queued", sizeLabel: "Responsive" },
    ],
    hooks: [
      { id: "h1", label: "Donor follow-up pack", hint: "Can attach to Donations & Funds campaigns.", status: "Ready" },
      { id: "h2", label: "Beacon creative pending", hint: "Cover variants still needed before promotion.", status: "Pending" },
      { id: "h3", label: "Live giveaway insert", hint: "Can be surfaced during generosity session.", status: "Draft" },
    ],
    connectedTo: ["Giving campaign: Build the Studio", "Leadership class series"],
    updatedISO: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    coverAltReady: false,
    metadataReady: true,
    chapteringReady: false,
    reviewReady: false,
    translationsDue: 1,
    priceLabel: "Supporter access",
    downloads: 0,
    readingStarts: 218,
    completions: 0,
    reviews: 8,
    revenue: 1240,
    quote: "Move from financial anxiety into practical, scripture-rooted stewardship rhythms.",
  },
  {
    id: "book-003",
    title: "Leadership Foundations Manual",
    subtitle: "Training handbook for volunteers, leaders, and ministry coordinators.",
    author: "FaithHub Leadership Office",
    kind: "Manual",
    status: "Scheduled",
    access: "Internal",
    coverUrl: HERO_3,
    description:
      "Internal manual with role expectations, safeguarding notes, pastoral care standards, operations checklists, and team workflows.",
    campus: "Organization-wide",
    owner: "Operations Office",
    languages: ["English", "French"],
    formats: ["PDF", "Print"],
    chapters: [
      { id: "c1", title: "Pastoral care standards", pages: "12 pages" },
      { id: "c2", title: "Safeguarding basics", pages: "10 pages" },
      { id: "c3", title: "Service team operating model", pages: "15 pages" },
    ],
    versions: [
      { id: "v1", label: "Print master", type: "Print", status: "Queued", sizeLabel: "128 pages" },
      { id: "v2", label: "PDF handbook", type: "PDF", status: "Live", sizeLabel: "12.6 MB" },
    ],
    hooks: [
      { id: "h1", label: "Team onboarding delivery", hint: "Can send by Channels & Contact Manager segments.", status: "Ready" },
      { id: "h2", label: "Role-based access", hint: "Internal only, locked to approved staff.", status: "Ready" },
      { id: "h3", label: "Translation review", hint: "French appendix still needs legal review.", status: "Pending" },
    ],
    connectedTo: ["Provider onboarding", "Volunteer event training"],
    updatedISO: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    coverAltReady: true,
    metadataReady: true,
    chapteringReady: true,
    reviewReady: false,
    translationsDue: 2,
    priceLabel: "Internal access",
    downloads: 420,
    readingStarts: 388,
    completions: 241,
    reviews: 14,
    revenue: 0,
    quote: "A premium operations manual that keeps ministry teams aligned, safe, and mission-ready.",
  },
  {
    id: "book-004",
    title: "Prayer at Dawn Reader",
    subtitle: "A contemplative reading companion for early-morning prayer gatherings.",
    author: "Dr. Lindiwe N.",
    kind: "eBook",
    status: "Published",
    access: "Paid",
    coverUrl: HERO_4,
    description:
      "A premium digital reader with meditations, scripture anchors, responsive prayers, and audio-read options for reflective mornings.",
    campus: "Global audience",
    owner: "Publishing Team",
    languages: ["English", "Portuguese"],
    formats: ["ePub", "Audio", "Web Reader"],
    chapters: [
      { id: "c1", title: "Morning surrender", pages: "8 pages" },
      { id: "c2", title: "The first watch of prayer", pages: "10 pages" },
      { id: "c3", title: "Silence, scripture, response", pages: "9 pages" },
    ],
    versions: [
      { id: "v1", label: "ePub retail", type: "ePub", status: "Live", sizeLabel: "6.4 MB" },
      { id: "v2", label: "Audio narration", type: "Audio", status: "Live", sizeLabel: "1h 08m" },
      { id: "v3", label: "Landing excerpt", type: "Web Reader", status: "Live", sizeLabel: "Sample chapter" },
    ],
    hooks: [
      { id: "h1", label: "Beacon conversion card", hint: "Top-performing teaser already packaged for awareness.", status: "Ready" },
      { id: "h2", label: "Event tie-in", hint: "Can attach to the monthly dawn prayer event.", status: "Ready" },
      { id: "h3", label: "Replay CTA", hint: "Linked to post-live reflection package.", status: "Ready" },
    ],
    connectedTo: ["Monthly Dawn Prayer", "Replay: Dawn Prayer gathering", "Beacon: Morning reader"],
    updatedISO: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    coverAltReady: true,
    metadataReady: true,
    chapteringReady: true,
    reviewReady: true,
    translationsDue: 0,
    priceLabel: "$12 premium reader",
    downloads: 3140,
    readingStarts: 2910,
    completions: 1622,
    reviews: 76,
    revenue: 18760,
    quote: "A polished morning companion that turns prayer time into a premium, repeatable reading ritual.",
  },
  {
    id: "book-005",
    title: "Youth Alpha Discussion Guide",
    subtitle: "Conversation prompts, leader notes, and next-step actions for youth circles.",
    author: "Youth Ministry Desk",
    kind: "Study Guide",
    status: "Archived",
    access: "Follower-first",
    coverUrl: HERO_5,
    description:
      "Archive-ready guide from a prior youth teaching season, preserved for replay-linked access and future duplication.",
    campus: "Youth campus",
    owner: "Youth Team",
    languages: ["English"],
    formats: ["PDF", "Web Reader"],
    chapters: [
      { id: "c1", title: "Identity and belonging", pages: "7 pages" },
      { id: "c2", title: "Questions and trust", pages: "8 pages" },
      { id: "c3", title: "Faith in real life", pages: "7 pages" },
    ],
    versions: [
      { id: "v1", label: "Archived PDF", type: "PDF", status: "Live", sizeLabel: "5.1 MB" },
      { id: "v2", label: "Guide page", type: "Web Reader", status: "Live", sizeLabel: "Archive" },
    ],
    hooks: [
      { id: "h1", label: "Duplicate into new season", hint: "One-click duplication is available for the next youth cycle.", status: "Ready" },
      { id: "h2", label: "Beacon disabled", hint: "Archived guides are not actively promoted.", status: "Pending" },
    ],
    connectedTo: ["Archived youth live sessions", "Youth event follow-up"],
    updatedISO: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    coverAltReady: true,
    metadataReady: true,
    chapteringReady: true,
    reviewReady: true,
    translationsDue: 0,
    priceLabel: "Follower-first archive",
    downloads: 1900,
    readingStarts: 1410,
    completions: 900,
    reviews: 34,
    revenue: 0,
    quote: "Preserved as a reusable archive asset with a clean duplication path into future youth campaigns.",
  },
];

function statusTone(status: BookStatus): "neutral" | "good" | "warn" | "danger" {
  if (status === "Published") return "good";
  if (status === "Scheduled") return "warn";
  if (status === "Draft") return "neutral";
  return "danger";
}

function accessTone(access: AccessModel): "neutral" | "good" | "warn" {
  if (access === "Free") return "good";
  if (access === "Paid" || access === "Supporter") return "warn";
  return "neutral";
}

function metricCardTone(index: number) {
  if (index === 0 || index === 3) return "green";
  if (index === 4) return "orange";
  return "light";
}

function completenessScore(book: BookRecord) {
  const checks = [
    book.coverAltReady,
    book.metadataReady,
    book.chapteringReady,
    book.reviewReady,
    book.languages.length > 0,
    book.formats.length > 0,
    book.versions.length > 0,
  ];
  const passed = checks.filter(Boolean).length;
  return pct(passed, checks.length);
}

function readinessIssues(book: BookRecord) {
  const items: string[] = [];
  if (!book.coverAltReady) items.push("Cover alt text still missing.");
  if (!book.metadataReady) items.push("Metadata setup still incomplete.");
  if (!book.chapteringReady) items.push("Chapter markers or page structure still need review.");
  if (!book.reviewReady) items.push("Approval routing or QA checks still pending.");
  if (book.translationsDue > 0)
    items.push(`${book.translationsDue} localization item${book.translationsDue > 1 ? "s are" : " is"} overdue.`);
  if (!items.length) items.push("This book is clean, premium-ready, and prepared for promotion.");
  return items;
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
      ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
      : tone === "warn"
      ? "border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 text-amber-800 dark:text-amber-300"
      : tone === "danger"
      ? "border-rose-200 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-800 text-rose-800 dark:text-rose-300"
      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300";
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold",
        toneCls,
      )}
    >
      {icon}
      {text}
    </span>
  );
}

function SoftButton({
  children,
  onClick,
  className,
  title,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
  disabled?: boolean;
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
          ? "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700",
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
  title,
  disabled,
  tone = "green",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
  disabled?: boolean;
  tone?: "green" | "orange";
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
        "rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[14px] font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </div>
          {subtitle ? (
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </div>
          ) : null}
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
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-4 transition-colors">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </div>
              {subtitle ? (
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {subtitle}
                </div>
              ) : null}
            </div>
            <button
              className="h-9 w-9 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 grid place-items-center transition-colors"
              onClick={onClose}
              aria-label="Close preview"
            >
              <X className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}

function SegmentedToggle({
  left,
  right,
  value,
  onChange,
}: {
  left: string;
  right: string;
  value: "left" | "right";
  onChange: (v: "left" | "right") => void;
}) {
  return (
    <div className="inline-flex rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 transition-colors">
      <button
        type="button"
        onClick={() => onChange("left")}
        className={cx(
          "px-3 py-1.5 rounded-xl text-[12px] font-bold transition-colors",
          value === "left"
            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
        )}
      >
        {left}
      </button>
      <button
        type="button"
        onClick={() => onChange("right")}
        className={cx(
          "px-3 py-1.5 rounded-xl text-[12px] font-bold transition-colors",
          value === "right"
            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
        )}
      >
        {right}
      </button>
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
  tone = "light",
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "green" | "orange" | "light";
}) {
  const cardStyle =
    tone === "green"
      ? { background: "linear-gradient(135deg, rgba(3,205,140,0.16), rgba(3,205,140,0.06))" }
      : tone === "orange"
      ? { background: "linear-gradient(135deg, rgba(247,127,0,0.16), rgba(247,127,0,0.06))" }
      : { background: "linear-gradient(135deg, rgba(242,242,242,1), rgba(255,255,255,1))" };

  return (
    <div
      className="rounded-[24px] border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 transition-colors"
      style={cardStyle}
    >
      <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-[20px] font-black text-slate-900 dark:text-slate-100">
        {value}
      </div>
      <div className="mt-1 text-[12px] text-slate-600 dark:text-slate-400 leading-snug">
        {hint}
      </div>
    </div>
  );
}

function TagChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 mr-2 mb-2 transition-colors">
      {children}
    </span>
  );
}

function FormatPill({ format }: { format: FormatKind }) {
  const icon =
    format === "Audio" ? (
      <PlayCircle className="h-3.5 w-3.5" />
    ) : format === "Print" ? (
      <BookOpen className="h-3.5 w-3.5" />
    ) : format === "Web Reader" ? (
      <Eye className="h-3.5 w-3.5" />
    ) : (
      <FileText className="h-3.5 w-3.5" />
    );

  return (
    <Pill
      text={format}
      tone={format === "Audio" || format === "Web Reader" ? "good" : "neutral"}
      icon={icon}
    />
  );
}

function BookRow({
  book,
  active,
  onSelect,
}: {
  book: BookRecord;
  active: boolean;
  onSelect: () => void;
}) {
  const score = completenessScore(book);
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cx(
        "w-full rounded-[24px] border p-3 text-left transition-colors",
        active
          ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-900/20"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800",
      )}
    >
      <div className="flex items-start gap-3">
        <img
          src={book.coverUrl}
          alt={book.title}
          className="h-24 w-20 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100">
              {book.title}
            </div>
            <Pill text={book.status} tone={statusTone(book.status)} />
            <Pill text={book.access} tone={accessTone(book.access)} />
          </div>
          <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400 line-clamp-2">
            {book.subtitle}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <TagChip>{book.kind}</TagChip>
            <TagChip>{book.languages.join(" · ")}</TagChip>
            <TagChip>{book.formats.length} formats</TagChip>
            <TagChip>{book.chapters.length} chapters</TagChip>
          </div>

          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2">
              <div className="text-slate-500 dark:text-slate-400">Reading starts</div>
              <div className="mt-1 font-black text-slate-900 dark:text-slate-100">
                {fmtInt(book.readingStarts)}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2">
              <div className="text-slate-500 dark:text-slate-400">Downloads</div>
              <div className="mt-1 font-black text-slate-900 dark:text-slate-100">
                {fmtInt(book.downloads)}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2">
              <div className="text-slate-500 dark:text-slate-400">Reviews</div>
              <div className="mt-1 font-black text-slate-900 dark:text-slate-100">
                {fmtInt(book.reviews)}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2">
              <div className="text-slate-500 dark:text-slate-400">Revenue</div>
              <div className="mt-1 font-black text-slate-900 dark:text-slate-100">
                {book.revenue ? money(book.revenue) : "—"}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Completeness score</span>
                <span>{score}%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${score}%`,
                    background: score >= 85 ? EV_GREEN : score >= 60 ? EV_ORANGE : EV_GREY,
                  }}
                />
              </div>
            </div>
            <div className="shrink-0 text-[11px] text-slate-500 dark:text-slate-400">
              Updated {fmtLocal(book.updatedISO)}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

function BookStorefrontPreview({
  book,
  mode,
  expanded = false,
}: {
  book: BookRecord;
  mode: PreviewMode;
  expanded?: boolean;
}) {
  const wrapperClass =
    mode === "desktop"
      ? "rounded-[32px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-colors"
      : "mx-auto w-full max-w-[420px] rounded-[38px] bg-slate-900 dark:bg-black p-3 shadow-[0_24px_60px_rgba(15,23,42,0.35)]";

  return (
    <div className={wrapperClass}>
      {mode === "mobile" ? (
        <div className="overflow-hidden rounded-[30px] bg-white dark:bg-slate-900">
          <BookStorefrontPreviewInner book={book} compact />
        </div>
      ) : (
        <BookStorefrontPreviewInner book={book} compact={!expanded} />
      )}
    </div>
  );
}

function BookStorefrontPreviewInner({
  book,
  compact,
}: {
  book: BookRecord;
  compact?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 transition-colors">
      <div className="relative">
        <img
          src={book.coverUrl}
          alt={book.title}
          className={cx(
            "w-full object-cover",
            compact ? "h-44" : "h-64",
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
        <div className="absolute left-4 bottom-4 right-4 flex items-end gap-3">
          <img
            src={book.coverUrl}
            alt={book.title}
            className={cx(
              "rounded-[20px] object-cover ring-2 ring-white/80 shadow-xl",
              compact ? "h-28 w-22" : "h-40 w-28",
            )}
          />
          <div className="min-w-0 text-white">
            <div className="text-[10px] uppercase tracking-[0.2em] opacity-80">
              Book storefront preview
            </div>
            <div className={cx("mt-1 font-black leading-tight", compact ? "text-[22px]" : "text-[30px]")}>
              {book.title}
            </div>
            <div className="mt-1 text-[13px] opacity-90 line-clamp-2">
              {book.subtitle}
            </div>
          </div>
        </div>
      </div>

      <div className={cx("p-4", compact ? "" : "md:p-6")}>
        <div className="flex flex-wrap gap-2">
          <Pill text={book.kind} tone="neutral" icon={<BookOpen className="h-3.5 w-3.5" />} />
          <Pill text={book.access} tone={accessTone(book.access)} icon={<Lock className="h-3.5 w-3.5" />} />
          <Pill text={book.priceLabel} tone="warn" icon={<Zap className="h-3.5 w-3.5" />} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
              Starts
            </div>
            <div className="mt-1 text-[16px] font-black text-slate-900 dark:text-slate-100">
              {fmtInt(book.readingStarts)}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
              Downloads
            </div>
            <div className="mt-1 text-[16px] font-black text-slate-900 dark:text-slate-100">
              {fmtInt(book.downloads)}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
              Reviews
            </div>
            <div className="mt-1 text-[16px] font-black text-slate-900 dark:text-slate-100">
              {fmtInt(book.reviews)}
            </div>
          </div>
        </div>

        <div className="mt-4 text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
          {book.description}
        </div>

        <div className="mt-4 rounded-[24px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
          <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
            Chapter preview
          </div>
          <div className="mt-2 space-y-2">
            {book.chapters.slice(0, 3).map((chapter) => (
              <div
                key={chapter.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-[12px] transition-colors"
              >
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  {chapter.title}
                </div>
                <div className="mt-1 text-slate-500 dark:text-slate-400">
                  {chapter.pages}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {book.formats.map((format) => (
            <FormatPill key={format} format={format} />
          ))}
        </div>

        <div className="mt-4 rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
          <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
            Why this book matters
          </div>
          <div className="mt-2 text-[13px] text-slate-600 dark:text-slate-400 italic leading-relaxed">
            “{book.quote}”
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <PrimaryButton tone="green" className="justify-center flex-1">
            <BookOpen className="h-4 w-4" />
            Read sample
          </PrimaryButton>
          <PrimaryButton tone="orange" className="justify-center flex-1">
            <Zap className="h-4 w-4" />
            {book.access === "Paid" ? "Get book" : "Open resource"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

export default function BooksManagerPage() {
  const [statusFilter, setStatusFilter] = useState<"All" | BookStatus>("All");
  const [typeFilter, setTypeFilter] = useState<"All" | BookKind>("All");
  const [search, setSearch] = useState("");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [previewDrawerOpen, setPreviewDrawerOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(BOOKS[0].id);

  const filteredBooks = useMemo(() => {
    return BOOKS.filter((book) => {
      const statusOk = statusFilter === "All" ? true : book.status === statusFilter;
      const typeOk = typeFilter === "All" ? true : book.kind === typeFilter;
      const query = search.trim().toLowerCase();
      const searchOk =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.subtitle.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.kind.toLowerCase().includes(query);
      return statusOk && typeOk && searchOk;
    });
  }, [statusFilter, typeFilter, search]);

  const selectedBook =
    filteredBooks.find((book) => book.id === selectedBookId) ||
    BOOKS.find((book) => book.id === selectedBookId) ||
    BOOKS[0];

  const allLanguages = useMemo(() => {
    return Array.from(new Set(BOOKS.flatMap((book) => book.languages)));
  }, []);

  const metrics = useMemo(() => {
    const published = BOOKS.filter((book) => book.status === "Published").length;
    const drafts = BOOKS.filter((book) => book.status === "Draft").length;
    const scheduled = BOOKS.filter((book) => book.status === "Scheduled").length;
    const starts = BOOKS.reduce((sum, book) => sum + book.readingStarts, 0);
    const downloads = BOOKS.reduce((sum, book) => sum + book.downloads, 0);
    const revenue = BOOKS.reduce((sum, book) => sum + book.revenue, 0);

    return {
      published,
      drafts,
      scheduled,
      starts,
      downloads,
      revenue,
      languages: allLanguages.length,
    };
  }, [allLanguages.length]);

  const issues = readinessIssues(selectedBook);
  const score = completenessScore(selectedBook);

  return (
    <div className="min-h-screen w-full bg-[#f2f2f2] dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors">
      <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8 py-6">
        <section className="rounded-[34px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 md:p-6 transition-colors overflow-hidden relative">
          <div
            className="absolute inset-x-0 top-0 h-24 opacity-60"
            style={{
              background:
                "linear-gradient(135deg, rgba(3,205,140,0.18), rgba(247,127,0,0.08), rgba(242,242,242,0))",
            }}
          />
          <div className="relative">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              FaithHub Provider / Books / Books Manager
            </div>

            <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-[34px] leading-none font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    FH-P-023 Books Manager
                  </div>
                  <Pill text="BOOK CATALOG" tone="good" icon={<BookOpen className="h-3.5 w-3.5" />} />
                  <Pill text="MULTI-FORMAT" tone="neutral" icon={<Layers className="h-3.5 w-3.5" />} />
                  <Pill text="BEACON READY" tone="warn" icon={<Megaphone className="h-3.5 w-3.5" />} />
                </div>
                <div className="mt-3 max-w-[980px] text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Manage devotionals, eBooks, study guides, manuals, and reading resources from one premium publishing surface. Track readiness, formats, access, translations, promotion hooks, and storefront quality without leaving the provider workspace.
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <SoftButton onClick={() => setPreviewDrawerOpen(true)}>
                  <Eye className="h-4 w-4" />
                  Preview
                </SoftButton>
                <SoftButton>
                  <Download className="h-4 w-4" />
                  Import manuscript
                </SoftButton>
                <PrimaryButton
                  tone="green"
                  onClick={() => safeNav(ROUTES.bookBuilder)}
                >
                  <Plus className="h-4 w-4" />
                  + New Book
                </PrimaryButton>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <TagChip>Books shelf healthy</TagChip>
              <TagChip>{metrics.languages} active languages</TagChip>
              <TagChip>{metrics.published} published books</TagChip>
              <TagChip>{metrics.drafts} drafts in progress</TagChip>
              <TagChip>{metrics.scheduled} scheduled launches</TagChip>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3 transition-colors">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-[13px] text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-slate-100">Books library pulse:</span>{" "}
              2 books need translation review • 1 draft still needs cover alt text • 3 published books are ready for Audience Notifications and Beacon handoff.
            </div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
              Premium reading operations
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <MetricCard
            label="Published books"
            value={String(metrics.published)}
            hint="Live and discoverable books with storefront-ready metadata."
            tone={metricCardTone(0)}
          />
          <MetricCard
            label="Active drafts"
            value={String(metrics.drafts)}
            hint="Books still in editorial, cover, or approval workflow."
            tone={metricCardTone(1)}
          />
          <MetricCard
            label="Scheduled"
            value={String(metrics.scheduled)}
            hint="Books with timed launch windows and release plans."
            tone={metricCardTone(2)}
          />
          <MetricCard
            label="Reading starts"
            value={fmtInt(metrics.starts)}
            hint="Total starts across web reader, ePub, and premium reading surfaces."
            tone={metricCardTone(3)}
          />
          <MetricCard
            label="Downloads"
            value={fmtInt(metrics.downloads)}
            hint="PDF and ePub retrieval across public and supporter access layers."
            tone={metricCardTone(4)}
          />
          <MetricCard
            label="Revenue"
            value={metrics.revenue ? money(metrics.revenue) : "—"}
            hint="Paid books, supporter access, and premium unlock signals."
            tone={metricCardTone(5)}
          />
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[1.45fr_1fr_0.95fr]">
          <Card
            title="Books catalog"
            subtitle="The premium master library for devotionals, guides, manuals, and digital teaching resources."
            right={
              <div className="flex items-center gap-2">
                <Pill text={`${filteredBooks.length} books`} tone="neutral" icon={<Layers className="h-3.5 w-3.5" />} />
                <SoftButton onClick={() => safeNav(ROUTES.bookBuilder)} className="px-3 py-1.5">
                  <Plus className="h-4 w-4" />
                  New
                </SoftButton>
              </div>
            }
          >
            <div className="grid gap-3">
              <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search books, authors, formats, or themes"
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-10 pr-4 py-3 text-[13px] outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 text-slate-900 dark:text-slate-100 transition-colors"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "All" | BookStatus)}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 text-[13px] font-semibold text-slate-900 dark:text-slate-100 transition-colors"
                >
                  {["All", "Draft", "Scheduled", "Published", "Archived"].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as "All" | BookKind)}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 text-[13px] font-semibold text-slate-900 dark:text-slate-100 transition-colors"
                >
                  {["All", "Devotional", "Study Guide", "Manual", "eBook", "Prayer Journal", "Course Reader"].map((kind) => (
                    <option key={kind} value={kind}>
                      {kind}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-2">
                <TagChip>All books</TagChip>
                <TagChip>Devotionals</TagChip>
                <TagChip>Study guides</TagChip>
                <TagChip>Paid titles</TagChip>
                <TagChip>Supporter resources</TagChip>
                <TagChip>Translation due</TagChip>
                <TagChip>Beacon-ready</TagChip>
              </div>

              <div className="space-y-3">
                {filteredBooks.map((book) => (
                  <BookRow
                    key={book.id}
                    book={book}
                    active={book.id === selectedBook.id}
                    onSelect={() => setSelectedBookId(book.id)}
                  />
                ))}
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <Card
              title="Publishing pipeline"
              subtitle="Readiness, approvals, translations, and premium metadata health."
              right={<Pill text={`${score}% ready`} tone={score >= 85 ? "good" : score >= 60 ? "warn" : "danger"} icon={<ShieldCheck className="h-3.5 w-3.5" />} />}
            >
              <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
                <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                  Selected book
                </div>
                <div className="mt-1 text-[18px] font-black text-slate-900 dark:text-slate-100">
                  {selectedBook.title}
                </div>
                <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                  Owned by {selectedBook.owner} • {selectedBook.campus}
                </div>

                <div className="mt-4 space-y-2">
                  {issues.map((issue) => (
                    <div
                      key={issue}
                      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-[12px] text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      {issue}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 transition-colors">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                    Cover + media
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className={cx("h-2 w-2 rounded-full", selectedBook.coverAltReady ? "bg-emerald-500" : "bg-amber-500")} />
                    <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                      {selectedBook.coverAltReady ? "Premium-ready" : "Needs attention"}
                    </div>
                  </div>
                </div>
                <div className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 transition-colors">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                    Localization
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className={cx("h-2 w-2 rounded-full", selectedBook.translationsDue === 0 ? "bg-emerald-500" : "bg-amber-500")} />
                    <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                      {selectedBook.translationsDue === 0 ? "Clear" : `${selectedBook.translationsDue} due`}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card
              title="Formats & versions"
              subtitle="Every book should feel multi-format, polished, and version-controlled."
              right={<Pill text={`${selectedBook.versions.length} versions`} tone="neutral" icon={<Layers className="h-3.5 w-3.5" />} />}
            >
              <div className="space-y-3">
                {selectedBook.versions.map((version) => (
                  <div
                    key={version.id}
                    className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                          {version.label}
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                          {version.type} • {version.sizeLabel}
                        </div>
                      </div>
                      <Pill
                        text={version.status}
                        tone={
                          version.status === "Live"
                            ? "good"
                            : version.status === "Queued"
                            ? "warn"
                            : "danger"
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title="Promotion & distribution hooks"
              subtitle="Direct bridges into notifications, Beacon, live follow-up, and reading plans."
              right={<Pill text="cross-object ready" tone="warn" icon={<Workflow className="h-3.5 w-3.5" />} />}
            >
              <div className="space-y-3">
                {selectedBook.hooks.map((hook) => (
                  <div
                    key={hook.id}
                    className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                          {hook.label}
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          {hook.hint}
                        </div>
                      </div>
                      <Pill
                        text={hook.status}
                        tone={
                          hook.status === "Ready"
                            ? "good"
                            : hook.status === "Pending"
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

          <div className="space-y-4">
            <Card
              title="Book storefront preview"
              subtitle="Persistent preview rail for how the selected book will appear to readers."
              right={
                <SegmentedToggle
                  left="Desktop"
                  right="Mobile"
                  value={previewMode === "desktop" ? "left" : "right"}
                  onChange={(value) => setPreviewMode(value === "left" ? "desktop" : "mobile")}
                />
              }
            >
              <BookStorefrontPreview book={selectedBook} mode={previewMode} />
              <div className="mt-4 flex flex-wrap gap-2">
                <SoftButton onClick={() => setPreviewDrawerOpen(true)}>
                  <Eye className="h-4 w-4" />
                  Open large preview
                </SoftButton>
                <SoftButton>
                  <Copy className="h-4 w-4" />
                  Copy storefront link
                </SoftButton>
                <SoftButton>
                  <ExternalLink className="h-4 w-4" />
                  Open live page
                </SoftButton>
              </div>
            </Card>

            <Card
              title="Performance intelligence"
              subtitle="What this book is doing for discovery, retention, and conversion."
              right={<Pill text="premium insight" tone="good" icon={<BadgeCheck className="h-3.5 w-3.5" />} />}
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition-colors">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                    Completion rate
                  </div>
                  <div className="mt-2 text-[20px] font-black text-slate-900 dark:text-slate-100">
                    {selectedBook.readingStarts ? `${pct(selectedBook.completions, selectedBook.readingStarts)}%` : "—"}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Readers reaching the last third of the book.
                  </div>
                </div>
                <div className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition-colors">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                    Review strength
                  </div>
                  <div className="mt-2 text-[20px] font-black text-slate-900 dark:text-slate-100">
                    {selectedBook.reviews}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Public trust and reader sentiment signals.
                  </div>
                </div>
                <div className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition-colors">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                    Connected objects
                  </div>
                  <div className="mt-2 text-[20px] font-black text-slate-900 dark:text-slate-100">
                    {selectedBook.connectedTo.length}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Live Sessions, events, Beacon, or funding hooks.
                  </div>
                </div>
                <div className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition-colors">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                    Premium access
                  </div>
                  <div className="mt-2 text-[20px] font-black text-slate-900 dark:text-slate-100">
                    {selectedBook.access}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Current reading and monetization model.
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
          <Card
            title="Quick-create templates"
            subtitle="World-class creation templates so Books Manager leads cleanly into Book Builder."
            right={<Pill text="+ New Book lives here" tone="good" icon={<Plus className="h-3.5 w-3.5" />} />}
          >
            <div className="grid gap-3 md:grid-cols-2">
              {TEMPLATE_CARDS.map((template) => (
                <div
                  key={template.id}
                  className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 transition-colors"
                >
                  <div
                    className="h-2 w-16 rounded-full"
                    style={{
                      background:
                        template.accent === "green"
                          ? EV_GREEN
                          : template.accent === "orange"
                          ? EV_ORANGE
                          : EV_NAVY,
                    }}
                  />
                  <div className="mt-3 text-[16px] font-bold text-slate-900 dark:text-slate-100">
                    {template.title}
                  </div>
                  <div className="mt-2 text-[12px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {template.subtitle}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Pill
                      text="Template"
                      tone={template.accent === "green" ? "good" : template.accent === "orange" ? "warn" : "neutral"}
                      icon={<Sparkles className="h-3.5 w-3.5" />}
                    />
                    <SoftButton
                      onClick={() => safeNav(`${ROUTES.bookBuilder}?template=${template.id}`)}
                    >
                      <Wand2 className="h-4 w-4" />
                      Use template
                    </SoftButton>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="Collections, approvals & collaboration"
            subtitle="Keep library shelves organized while routing approvals, QA, and promotion with confidence."
            right={<Pill text="manager-grade workflow" tone="warn" icon={<Users className="h-3.5 w-3.5" />} />}
          >
            <div className="grid gap-3 md:grid-cols-2">
              {COLLECTIONS.map((collection) => (
                <div
                  key={collection.id}
                  className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 transition-colors"
                >
                  <div className="text-[16px] font-bold text-slate-900 dark:text-slate-100">
                    {collection.title}
                  </div>
                  <div className="mt-2 text-[12px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {collection.subtitle}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Pill text={`${collection.count} titles`} tone="neutral" icon={<Layers className="h-3.5 w-3.5" />} />
                    <Pill
                      text={collection.readiness}
                      tone={collection.readiness === "Growing" || collection.readiness === "Active" ? "warn" : "good"}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3">
              <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill text="Approval lane" tone="neutral" icon={<CheckCircle2 className="h-3.5 w-3.5" />} />
                  <Pill text="Translation review" tone="warn" icon={<Languages className="h-3.5 w-3.5" />} />
                  <Pill text="Trust & quality" tone="good" icon={<ShieldCheck className="h-3.5 w-3.5" />} />
                </div>
                <div className="mt-3 space-y-2">
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-[12px] text-slate-700 dark:text-slate-300 transition-colors">
                    Leadership Foundations Manual is waiting on French appendix review before the scheduled launch window opens.
                  </div>
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-[12px] text-slate-700 dark:text-slate-300 transition-colors">
                    Kingdom Stewardship Workbook needs cover alt text and a Beacon creative variant before promotion is unlocked.
                  </div>
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-[12px] text-slate-700 dark:text-slate-300 transition-colors">
                    Prayer at Dawn Reader is fully clean and can be duplicated into a companion journal or new reading plan.
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="mt-4 rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors">
          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr_0.9fr]">
            <div>
              <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                Connected workflow value
              </div>
              <div className="mt-2 text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Books Manager is the premium command surface for every ministry book object. It keeps catalog health, access models, formats, versions, translations, promotion hooks, and storefront previews in one place — while pushing actual creation into the dedicated Book Builder through the <span className="font-semibold text-slate-900 dark:text-slate-100">+ New Book</span> path.
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
              <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                Key linked pages
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <TagChip>Book Builder</TagChip>
                <TagChip>Audience Notifications</TagChip>
                <TagChip>Beacon Builder</TagChip>
                <TagChip>Provider Dashboard</TagChip>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
              <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                Primary actions
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <PrimaryButton tone="green" onClick={() => safeNav(ROUTES.bookBuilder)}>
                  <Plus className="h-4 w-4" />
                  + New Book
                </PrimaryButton>
                <SoftButton>
                  <Bell className="h-4 w-4" />
                  Notify readers
                </SoftButton>
                <SoftButton>
                  <Megaphone className="h-4 w-4" />
                  Boost with Beacon
                </SoftButton>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Drawer
        open={previewDrawerOpen}
        onClose={() => setPreviewDrawerOpen(false)}
        title="Book storefront preview"
        subtitle={`${selectedBook.title} • expanded reader-facing preview`}
      >
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <BookStorefrontPreview book={selectedBook} mode={previewMode} expanded />

          <Card
            title="Reader-facing details"
            subtitle="Live preview notes for what will appear on the book destination page."
          >
            <div className="space-y-3">
              <div className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 transition-colors">
                <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                  Formats visible at launch
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedBook.formats.map((format) => (
                    <FormatPill key={format} format={format} />
                  ))}
                </div>
              </div>

              <div className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 transition-colors">
                <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                  Connected promotion hooks
                </div>
                <div className="mt-3 space-y-2">
                  {selectedBook.connectedTo.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-[12px] text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 transition-colors">
                <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                  Launch actions
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <PrimaryButton tone="green">
                    <BookOpen className="h-4 w-4" />
                    Open live page
                  </PrimaryButton>
                  <SoftButton>
                    <Link2 className="h-4 w-4" />
                    Copy share link
                  </SoftButton>
                  <SoftButton>
                    <Megaphone className="h-4 w-4" />
                    Push to Beacon
                  </SoftButton>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Drawer>
    </div>
  );
}



