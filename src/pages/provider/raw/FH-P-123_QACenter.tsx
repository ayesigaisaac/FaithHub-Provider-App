// @ts-nocheck
"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ExternalLink,
  Eye,
  FileCheck2,
  Globe,
  LayoutGrid,
  MonitorPlay,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wrench,
  XCircle,
} from "lucide-react";
import { KpiTile } from "../../../components/ui/KpiTile";
import { ProviderPageTitle } from "@/components/provider/ProviderPageTitle";
import { ProviderSurfaceCard } from "@/components/provider/ProviderSurfaceCard";

/**
 * Provider � QA Center
 * --------------------------------
 * Purpose:
 * Internal quality-assurance page for testing streams, validating content
 * packages, checking forms/pages, and preflight review before launch.
 *
 * Primary CTAs:
 * - Run QA Scan
 * - Create Checklist
 * - Resolve Issue
 *
 * Design system:
 * - EVzone Green #03cd8c
 * - EVzone Orange #f77f00
 */

const GREEN = "#03cd8c";
const ORANGE = "#f77f00";
const MEDIUM = "#a6a6a6";
const NAVY = "#24327a";

type QAScope =
  | "all"
  | "streams"
  | "content"
  | "forms"
  | "preflight"
  | "safeguards";

type QASeverity = "Info" | "Warning" | "Blocker";
type QAState = "Passing" | "At risk" | "Blocked" | "Needs review";
type PreviewMode = "desktop" | "mobile";

type QAResult = {
  id: string;
  title: string;
  summary: string;
  scope: Exclude<QAScope, "all">;
  severity: QASeverity;
  state: QAState;
  owner: string;
  surface: string;
  destination: string;
  lastCheckedLabel: string;
  suggestedFix: string;
  tags: string[];
  confidence: number;
  steps: string[];
};

type ChecklistItem = {
  id: string;
  label: string;
  detail: string;
  group: "Streams" | "Content" | "Forms" | "Launch";
  done: boolean;
  critical?: boolean;
};

type SurfaceCoverage = {
  id: string;
  label: string;
  scope: string;
  desktop: boolean;
  mobile: boolean;
  childSafe: boolean;
  status: QAState;
};

const QA_RESULTS_SEED: QAResult[] = [
  {
    id: "qa_1",
    title: "YouTube fallback profile missing",
    summary:
      "The Sunday Worship distribution preset is missing its HD-safe fallback output, which raises outage risk if the primary route degrades mid-session.",
    scope: "streams",
    severity: "Blocker",
    state: "Blocked",
    owner: "Production Ops",
    surface: "Stream-to-Platforms",
    destination: "YouTube + EVzone",
    lastCheckedLabel: "2 min ago",
    suggestedFix:
      "Attach the fallback profile, re-run destination validation, and confirm that both primary and backup paths stay green.",
    tags: ["Fallback", "Destinations", "Launch blocker"],
    confidence: 96,
    steps: [
      "Open Stream-to-Platforms and attach the fallback preset.",
      "Re-run output validation for all enabled destinations.",
      "Confirm ingest + backup path are both healthy.",
    ],
  },
  {
    id: "qa_2",
    title: "Replay notes package missing scripture references",
    summary:
      "The replay package is structurally complete, but the scripture reference block is still empty on the destination page and searchable notes card.",
    scope: "content",
    severity: "Warning",
    state: "Needs review",
    owner: "Content Editor",
    surface: "Post-live Publishing",
    destination: "Replay package",
    lastCheckedLabel: "9 min ago",
    suggestedFix:
      "Add the scripture reference list or explicitly mark the section intentionally omitted before publish.",
    tags: ["Replay", "Resources", "Metadata"],
    confidence: 83,
    steps: [
      "Open the notes and resource panel.",
      "Confirm the scripture reference list.",
      "Re-run package validation.",
    ],
  },
  {
    id: "qa_3",
    title: "Prayer request form mobile spacing regression",
    summary:
      "The mobile field stack clips the submit button below the safe area on shorter devices, which could reduce successful submissions.",
    scope: "forms",
    severity: "Blocker",
    state: "At risk",
    owner: "Experience QA",
    surface: "Prayer Requests",
    destination: "Mobile form",
    lastCheckedLabel: "14 min ago",
    suggestedFix:
      "Increase bottom padding, validate safe-area spacing, and confirm tap targets on 390 � 680 layouts.",
    tags: ["Forms", "Mobile", "Safe area"],
    confidence: 91,
    steps: [
      "Open the mobile preview rail.",
      "Check small-height devices under 700px.",
      "Resolve the footer overlap and retest.",
    ],
  },
  {
    id: "qa_4",
    title: "Child-safe moderation thresholds inherited correctly",
    summary:
      "The current workspace policy pack is flowing into youth-facing community surfaces and live-chat defaults as expected.",
    scope: "safeguards",
    severity: "Info",
    state: "Passing",
    owner: "Trust & Safety",
    surface: "Moderation Settings",
    destination: "Child-safe defaults",
    lastCheckedLabel: "22 min ago",
    suggestedFix:
      "No action needed. Maintain current safeguard inheritance rules and keep audit coverage enabled.",
    tags: ["Safeguards", "Children", "Policy inheritance"],
    confidence: 99,
    steps: [
      "Monitor future policy edits for inheritance drift.",
      "Keep the youth-facing audit view enabled.",
    ],
  },
  {
    id: "qa_5",
    title: "Preflight checklist missing bilingual subtitle confirmation",
    summary:
      "The launch pack includes English captions, but the secondary subtitle track has not yet been marked verified for the live session.",
    scope: "preflight",
    severity: "Warning",
    state: "Needs review",
    owner: "Localization Lead",
    surface: "Live Builder",
    destination: "Preflight review",
    lastCheckedLabel: "31 min ago",
    suggestedFix:
      "Confirm subtitle accuracy for the Swahili track, then mark the language pack as verified before broadcast.",
    tags: ["Preflight", "Localization", "Captions"],
    confidence: 78,
    steps: [
      "Preview translated overlays in desktop and mobile.",
      "Approve subtitle confidence thresholds.",
      "Lock the bilingual pack into the launch checklist.",
    ],
  },
  {
    id: "qa_6",
    title: "Event registration journey passes linked-surface checks",
    summary:
      "The event form, notification journey, and Beacon landing path all resolve correctly across the current preview states.",
    scope: "forms",
    severity: "Info",
    state: "Passing",
    owner: "Outreach QA",
    surface: "Events Manager",
    destination: "Registration flow",
    lastCheckedLabel: "47 min ago",
    suggestedFix:
      "No action needed. Re-run if the event field set changes before launch.",
    tags: ["Events", "Journey", "Linked surfaces"],
    confidence: 94,
    steps: [
      "Monitor conversion after publish.",
      "Re-run if any registration field changes.",
    ],
  },
];

const CHECKLIST_SEED: ChecklistItem[] = [
  {
    id: "cl_1",
    label: "Primary ingest health confirmed",
    detail: "Confirm ingest, bitrate, audio confidence, and backup path status.",
    group: "Streams",
    done: true,
    critical: true,
  },
  {
    id: "cl_2",
    label: "Destination credentials revalidated",
    detail: "Re-auth expiring platforms and publish the final routing summary.",
    group: "Streams",
    done: false,
    critical: true,
  },
  {
    id: "cl_3",
    label: "Replay notes and resources complete",
    detail: "Check chapters, notes, study guides, scripture references, and CTA links.",
    group: "Content",
    done: false,
  },
  {
    id: "cl_4",
    label: "Forms tested on mobile",
    detail: "Validate prayer forms, event registration, and giving prompts in compact layouts.",
    group: "Forms",
    done: false,
    critical: true,
  },
  {
    id: "cl_5",
    label: "Moderation policy inheritance confirmed",
    detail: "Ensure youth-facing defaults, filters, and escalation routing are active.",
    group: "Launch",
    done: true,
  },
  {
    id: "cl_6",
    label: "Leadership sign-off captured",
    detail: "Confirm leadership, producer, and communications approvals are all recorded.",
    group: "Launch",
    done: false,
    critical: true,
  },
];

const SURFACE_COVERAGE_SEED: SurfaceCoverage[] = [
  {
    id: "cv_1",
    label: "Live Session header + countdown",
    scope: "Streams & player",
    desktop: true,
    mobile: true,
    childSafe: true,
    status: "Passing",
  },
  {
    id: "cv_2",
    label: "Prayer request form",
    scope: "Forms & counseling",
    desktop: true,
    mobile: false,
    childSafe: true,
    status: "At risk",
  },
  {
    id: "cv_3",
    label: "Replay notes package",
    scope: "Content packages",
    desktop: true,
    mobile: true,
    childSafe: true,
    status: "Needs review",
  },
  {
    id: "cv_4",
    label: "Donation CTA landing",
    scope: "Giving surfaces",
    desktop: true,
    mobile: true,
    childSafe: false,
    status: "Passing",
  },
  {
    id: "cv_5",
    label: "Beacon destination preview",
    scope: "Promotion surfaces",
    desktop: true,
    mobile: true,
    childSafe: true,
    status: "Passing",
  },
];

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function fmtCompact(value: number) {
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function severityTone(value: QASeverity) {
  if (value === "Blocker") return "danger" as const;
  if (value === "Warning") return "warn" as const;
  return "neutral" as const;
}

function stateTone(value: QAState) {
  if (value === "Blocked") return "danger" as const;
  if (value === "At risk") return "brand" as const;
  if (value === "Needs review") return "warn" as const;
  return "good" as const;
}

function Pill({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "brand" | "good" | "warn" | "danger";
  children: React.ReactNode;
}) {
  const cls =
    tone === "brand"
      ? "text-white"
      : tone === "good"
        ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-800 dark:text-emerald-300"
        : tone === "warn"
          ? "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-500/10 dark:border-amber-800 dark:text-amber-300"
          : tone === "danger"
            ? "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-500/10 dark:border-rose-800 dark:text-rose-300"
            : "bg-[var(--fh-surface-bg)] border-faith-line text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300";
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-extrabold whitespace-nowrap transition-colors",
        cls,
      )}
      style={tone === "brand" ? { background: ORANGE, borderColor: ORANGE } : undefined}
    >
      {children}
    </span>
  );
}

function Btn({
  tone = "neutral",
  children,
  left,
  onClick,
  disabled,
}: {
  tone?: "neutral" | "primary" | "secondary";
  children: React.ReactNode;
  left?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-[12px] font-extrabold border transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const cls =
    tone === "primary"
      ? "border-transparent text-white"
      : tone === "secondary"
        ? "border-transparent text-white"
        : "border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 text-faith-ink dark:text-slate-100 hover:bg-[var(--fh-surface)] dark:hover:bg-slate-800";
  const style =
    tone === "primary"
      ? { background: GREEN }
      : tone === "secondary"
        ? { background: ORANGE }
        : undefined;

  return (
    <button type="button" className={cx(base, cls)} style={style} onClick={onClick} disabled={disabled}>
      {left}
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
      className={cx("rounded-[28px] shadow-none", className)}
      titleClassName="text-[13px] font-extrabold"
      subtitleClassName="leading-4"
      bodyClassName="mt-3"
    >
      {children}
    </ProviderSurfaceCard>
  );
}

function MetricCard({
  label,
  value,
  hint,
  accent = "green",
}: {
  label: string;
  value: string;
  hint: string;
  accent?: "green" | "orange" | "navy" | "gray";
}) {
  return <KpiTile label={label} value={value} hint={hint} tone={accent} indicator="dot" size="compact" />;
}

function ScopeButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "w-full rounded-[22px] border px-4 py-3 text-left text-[12px] font-extrabold transition-colors flex items-center justify-between gap-2",
        active
          ? "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-faith-ink dark:text-slate-100"
          : "border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 text-slate-800 dark:text-slate-300 hover:bg-[var(--fh-surface)] dark:hover:bg-slate-800",
      )}
    >
      <span>{label}</span>
      <ChevronRight className="h-4 w-4 opacity-65" />
    </button>
  );
}

function QARow({
  result,
  selected,
  onSelect,
}: {
  result: QAResult;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cx(
        "w-full rounded-[24px] border p-4 text-left transition-colors",
        selected
          ? "border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-900/10"
          : "border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 hover:bg-[var(--fh-surface)] dark:hover:bg-slate-800",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="truncate text-[14px] font-black text-faith-ink dark:text-slate-100">{result.title}</div>
            <Pill tone={severityTone(result.severity)}>{result.severity}</Pill>
            <Pill tone={stateTone(result.state)}>{result.state}</Pill>
          </div>
          <div className="mt-1 text-[12px] leading-relaxed text-faith-slate">{result.summary}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.tags.map((tag) => (
              <Pill key={tag}>{tag}</Pill>
            ))}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">{result.lastCheckedLabel}</div>
          <div className="mt-1 text-[11px] text-faith-slate">{result.surface}</div>
        </div>
      </div>
    </button>
  );
}

function CoverageBadge({ value }: { value: boolean }) {
  return value ? <Pill tone="good">Ready</Pill> : <Pill tone="warn">Check</Pill>;
}

export default function FHP123QACenter() {
  const [scope, setScope] = useState<QAScope>("all");
  const [query, setQuery] = useState("");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [results, setResults] = useState<QAResult[]>(QA_RESULTS_SEED);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(CHECKLIST_SEED);
  const [selectedResultId, setSelectedResultId] = useState<string>(QA_RESULTS_SEED[0]?.id || "");
  const [scanCount, setScanCount] = useState(18);
  const [lastScanLabel, setLastScanLabel] = useState("Today � 10:42 AM");
  const [isScanning, setIsScanning] = useState(false);
  const [savedChecklistCount, setSavedChecklistCount] = useState(7);

  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      const matchesScope = scope === "all" ? true : result.scope === scope;
      const haystack = [
        result.title,
        result.summary,
        result.surface,
        result.destination,
        result.owner,
        ...result.tags,
      ]
        .join(" ")
        .toLowerCase();
      const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase());
      return matchesScope && matchesQuery;
    });
  }, [results, scope, query]);

  const selectedResult =
    filteredResults.find((item) => item.id === selectedResultId) ||
    results.find((item) => item.id === selectedResultId) ||
    filteredResults[0] ||
    results[0];

  const metrics = useMemo(() => {
    const blockers = results.filter((item) => item.severity === "Blocker").length;
    const passing = results.filter((item) => item.state === "Passing").length;
    const needsReview = results.filter((item) => item.state === "Needs review").length;
    const atRisk = results.filter((item) => item.state === "At risk").length;
    const launchConfidence = Math.max(0, Math.min(100, 100 - blockers * 9 - atRisk * 4 - needsReview * 2));
    return { blockers, passing, needsReview, atRisk, launchConfidence };
  }, [results]);

  const checklistStats = useMemo(() => {
    const done = checklist.filter((item) => item.done).length;
    const criticalOpen = checklist.filter((item) => item.critical && !item.done).length;
    return { done, criticalOpen };
  }, [checklist]);

  const scopedCoverage = useMemo(() => {
    if (scope === "all") return SURFACE_COVERAGE_SEED;
    if (scope === "streams") return SURFACE_COVERAGE_SEED.filter((row) => row.scope.includes("Streams") || row.label.includes("Live"));
    if (scope === "content") return SURFACE_COVERAGE_SEED.filter((row) => row.scope.includes("Content") || row.label.includes("Replay"));
    if (scope === "forms") return SURFACE_COVERAGE_SEED.filter((row) => row.scope.includes("Forms") || row.label.includes("Donation") || row.label.includes("Prayer"));
    if (scope === "preflight") return SURFACE_COVERAGE_SEED.filter((row) => row.label.includes("header") || row.label.includes("preview") || row.label.includes("Replay"));
    return SURFACE_COVERAGE_SEED.filter((row) => row.childSafe);
  }, [scope]);

  const runQAScan = () => {
    if (isScanning || typeof window === "undefined") return;
    setIsScanning(true);
    window.setTimeout(() => {
      setResults((prev) =>
        prev.map((item) => {
          if (item.id === "qa_2") {
            return { ...item, state: "Passing", severity: "Info", lastCheckedLabel: "Just now", confidence: 95 };
          }
          if (item.id === "qa_5") {
            return { ...item, state: "At risk", lastCheckedLabel: "Just now", confidence: 86 };
          }
          return { ...item, lastCheckedLabel: "Just now" };
        }),
      );
      setScanCount((count) => count + 1);
      setLastScanLabel("Just now");
      setIsScanning(false);
    }, 1100);
  };

  const createChecklist = () => {
    const nextId = `cl_${Math.random().toString(16).slice(2, 7)}`;
    setChecklist((prev) => [
      {
        id: nextId,
        label: "New QA validation pack",
        detail: "Add page, stream, or launch checks that should be preserved as a reusable checklist.",
        group: "Launch",
        done: false,
      },
      ...prev,
    ]);
    setSavedChecklistCount((count) => count + 1);
  };

  const resolveIssue = () => {
    if (!selectedResult) return;
    setResults((prev) =>
      prev.map((item) =>
        item.id === selectedResult.id
          ? {
              ...item,
              state: "Passing",
              severity: "Info",
              lastCheckedLabel: "Resolved just now",
              summary: `Resolved � ${item.summary}`,
              confidence: Math.min(99, item.confidence + 8),
            }
          : item,
      ),
    );
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 px-4 py-5 md:px-5 lg:px-6 text-faith-ink dark:text-slate-100 transition-colors">
      <div className="mx-auto max-w-[1600px]">
        <div className="rounded-[32px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-4 py-4 md:px-6 md:py-5 transition-colors">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <ProviderPageTitle
                icon={<ClipboardCheck className="h-6 w-6" />}
                title="QA Center"
                subtitle="Internal quality-assurance surface for stream checks, content package validation, page and form review, and premium preflight sign-off before launch."
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <Pill tone="good">{metrics.passing} surfaces passing</Pill>
                <Pill tone="warn">{metrics.needsReview} checks need review</Pill>
                <Pill tone="brand">{metrics.blockers} blocker paths active</Pill>
                <Pill>Child-safe defaults inherited</Pill>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <Btn tone="primary" left={<RefreshCw className={cx("h-4 w-4", isScanning && "animate-spin")} />} onClick={runQAScan} disabled={isScanning}>
                {isScanning ? "Scanning�" : "Run QA Scan"}
              </Btn>
              <Btn left={<Plus className="h-4 w-4" />} onClick={createChecklist}>Create Checklist</Btn>
              <Btn tone="secondary" left={<Wrench className="h-4 w-4" />} onClick={resolveIssue}>Resolve Issue</Btn>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 md:px-4 transition-colors flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold text-white" style={{ background: ORANGE }}>
              PREMIUM QA SURFACE
            </span>
            <div className="text-[12px] text-faith-slate min-w-0 truncate">
              Stream tests, content packages, forms/pages, and preflight launch review all resolve from one provider control surface.
            </div>
          </div>
          <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-faith-slate">
            STREAMS � PACKAGES � FORMS � PREFLIGHT
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-6">
          <MetricCard label="Surfaces in view" value={String(scopedCoverage.length)} hint="Live, replay, forms, and launch surfaces currently in scope." accent="green" />
          <MetricCard label="Passing checks" value={String(metrics.passing)} hint="Checks already meeting the current provider quality bar." accent="green" />
          <MetricCard label="Blocked items" value={String(metrics.blockers)} hint="Items preventing a clean launch or protected publish action." accent="orange" />
          <MetricCard label="Open issues" value={String(metrics.atRisk + metrics.needsReview)} hint="Surfaces that still need review, cleanup, or final sign-off." accent="navy" />
          <MetricCard label="Launch confidence" value={`${metrics.launchConfidence}%`} hint="Composite confidence across QA, safeguards, and readiness." accent="orange" />
          <MetricCard label="Saved checklists" value={fmtCompact(savedChecklistCount)} hint={`Last scan ${lastScanLabel}`} accent="gray" />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[290px_minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <Card title="QA map" subtitle="Saved views for streams, content packages, forms, safeguards, and launch review.">
              <div className="space-y-2">
                <ScopeButton active={scope === "all"} label="All quality events" onClick={() => setScope("all")} />
                <ScopeButton active={scope === "streams"} label="Streams & destinations" onClick={() => setScope("streams")} />
                <ScopeButton active={scope === "content"} label="Content packages" onClick={() => setScope("content")} />
                <ScopeButton active={scope === "forms"} label="Forms & pages" onClick={() => setScope("forms")} />
                <ScopeButton active={scope === "preflight"} label="Preflight review" onClick={() => setScope("preflight")} />
                <ScopeButton active={scope === "safeguards"} label="Safeguards & child-safe" onClick={() => setScope("safeguards")} />
              </div>
            </Card>

            <Card title="Quality pulse" subtitle="High-signal checks shaping launch readiness across the provider workspace.">
              <div className="space-y-3">
                <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20 p-3 transition-colors">
                  <div className="text-[13px] font-extrabold text-faith-ink dark:text-slate-100">Scan automation remains stable</div>
                  <div className="mt-1 text-[12px] text-faith-slate">
                    Automated stream, surface, and launch checks are feeding the central QA ledger without drift.
                  </div>
                </div>
                <div className="rounded-[22px] border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 p-3 transition-colors">
                  <div className="text-[13px] font-extrabold text-faith-ink dark:text-slate-100">Mobile form regression still open</div>
                  <div className="mt-1 text-[12px] text-faith-slate">
                    The prayer-request mobile flow still needs a final safe-area pass before premium sign-off.
                  </div>
                </div>
                <div className="rounded-[22px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3 transition-colors">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-faith-slate">Checklist progress</div>
                  <div className="mt-2 text-[20px] font-black text-faith-ink dark:text-slate-100">{checklistStats.done}/{checklist.length}</div>
                  <div className="mt-1 text-[12px] text-faith-slate">
                    {checklistStats.criticalOpen} critical item(s) remain open before launch.
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card title="Launch assurance console" subtitle="Searchable QA ledger for stream health, page checks, form issues, package validation, and preflight review." right={<Pill tone="good">{filteredResults.length} results visible</Pill>}>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faith-slate" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search surface, owner, issue, tag, or destination"
                    className="w-full rounded-[22px] border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-950 pl-10 pr-4 py-3 text-[13px] outline-none text-faith-ink dark:text-slate-100 placeholder:text-faith-slate dark:placeholder:text-faith-slate"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Pill>Scan #{scanCount}</Pill>
                  <Pill tone="good">Last scan {lastScanLabel}</Pill>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {filteredResults.map((result) => (
                  <QARow key={result.id} result={result} selected={selectedResult?.id === result.id} onSelect={() => setSelectedResultId(result.id)} />
                ))}
                {!filteredResults.length ? (
                  <div className="rounded-[22px] border border-dashed border-slate-300 dark:border-slate-700 bg-[var(--fh-surface)] dark:bg-slate-950 px-4 py-8 text-center text-[13px] text-faith-slate">
                    No QA results match the current filters.
                  </div>
                ) : null}
              </div>
            </Card>

            <Card title="Checklist builder" subtitle="Reusable QA packs for streams, content packages, forms, and final preflight launch review." right={<Pill tone="brand">Critical open � {checklistStats.criticalOpen}</Pill>}>
              <div className="grid gap-3 md:grid-cols-2">
                {checklist.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleChecklistItem(item.id)}
                    className={cx(
                      "rounded-[24px] border p-4 text-left transition-colors",
                      item.done
                        ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-900/10"
                        : "border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 hover:bg-[var(--fh-surface)] dark:hover:bg-slate-800",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="text-[13px] font-black text-faith-ink dark:text-slate-100">{item.label}</div>
                          <Pill>{item.group}</Pill>
                          {item.critical ? <Pill tone="warn">Critical</Pill> : null}
                        </div>
                        <div className="mt-1 text-[12px] leading-relaxed text-faith-slate">{item.detail}</div>
                      </div>
                      <div className="mt-0.5">
                        {item.done ? <CheckCircle2 className="h-5 w-5" style={{ color: GREEN }} /> : <XCircle className="h-5 w-5 text-slate-300" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card title="QA preview rail" subtitle="See how the selected surface would appear in desktop and mobile launch checks." right={<Pill tone="good">{selectedResult?.confidence ?? 0}% confidence</Pill>}>
              <div className="flex flex-wrap gap-2">
                <Btn onClick={() => setPreviewMode("desktop")} left={<MonitorPlay className="h-4 w-4" />}>
                  {previewMode === "desktop" ? "Desktop preview ?" : "Desktop preview"}
                </Btn>
                <Btn onClick={() => setPreviewMode("mobile")} left={<Smartphone className="h-4 w-4" />}>
                  {previewMode === "mobile" ? "Mobile preview ?" : "Mobile preview"}
                </Btn>
              </div>

              <div className="mt-4 rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4 transition-colors">
                <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-faith-slate">
                  {previewMode === "desktop" ? "Desktop launch check" : "Mobile launch check"}
                </div>
                <div className={cx(
                  "mt-3 rounded-[24px] border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 overflow-hidden transition-colors",
                  previewMode === "desktop" ? "p-4" : "mx-auto max-w-[280px] p-3",
                )}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">{selectedResult?.surface}</div>
                      <div className="mt-0.5 text-[11px] text-faith-slate">{selectedResult?.destination}</div>
                    </div>
                    <div className="h-9 w-9 rounded-[14px] flex items-center justify-center text-white" style={{ background: GREEN }}>
                      {previewMode === "desktop" ? <LayoutGrid className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-[18px] border border-faith-line dark:border-slate-700 bg-[var(--fh-surface)] dark:bg-slate-950 p-3 transition-colors">
                      <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Status ribbon</div>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <Pill tone={stateTone(selectedResult?.state || "Passing")}>{selectedResult?.state}</Pill>
                        <Pill tone={severityTone(selectedResult?.severity || "Info")}>{selectedResult?.severity}</Pill>
                      </div>
                    </div>

                    <div className="rounded-[18px] border border-faith-line dark:border-slate-700 bg-[var(--fh-surface)] dark:bg-slate-950 p-3 transition-colors">
                      <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Preview payload</div>
                      <div className="mt-2 text-[13px] font-black text-faith-ink dark:text-slate-100">{selectedResult?.title}</div>
                      <div className="mt-1 text-[12px] leading-relaxed text-faith-slate">{selectedResult?.summary}</div>
                    </div>

                    <div className="rounded-[18px] border border-faith-line dark:border-slate-700 bg-[var(--fh-surface)] dark:bg-slate-950 p-3 transition-colors">
                      <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Cross-object hooks</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Pill>Live Builder</Pill>
                        <Pill>Stream-to-Platforms</Pill>
                        <Pill>Prayer Requests</Pill>
                        <Pill>Moderation Settings</Pill>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Issue workbench" subtitle="Use the selected issue as the single source of truth for fixing and documenting launch problems.">
              {selectedResult ? (
                <div className="space-y-3">
                  <div className="rounded-[22px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3 transition-colors">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill tone={severityTone(selectedResult.severity)}>{selectedResult.severity}</Pill>
                      <Pill tone={stateTone(selectedResult.state)}>{selectedResult.state}</Pill>
                      <Pill>{selectedResult.owner}</Pill>
                    </div>
                    <div className="mt-3 text-[15px] font-black text-faith-ink dark:text-slate-100">{selectedResult.title}</div>
                    <div className="mt-1 text-[12px] text-faith-slate">{selectedResult.surface} � {selectedResult.destination}</div>
                  </div>

                  <div className="rounded-[22px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3 transition-colors">
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Suggested fix</div>
                    <div className="mt-2 text-[12px] leading-relaxed text-faith-slate">{selectedResult.suggestedFix}</div>
                  </div>

                  <div className="rounded-[22px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3 transition-colors">
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">Next steps</div>
                    <div className="mt-2 space-y-2">
                      {selectedResult.steps.map((step, idx) => (
                        <div key={step} className="flex items-start gap-2 text-[12px] text-faith-slate">
                          <div className="mt-0.5 h-5 w-5 rounded-full border border-faith-line dark:border-slate-700 text-[11px] font-black flex items-center justify-center">{idx + 1}</div>
                          <div className="flex-1 leading-relaxed">{step}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Btn left={<ExternalLink className="h-4 w-4" />}>Open linked surface</Btn>
                    <Btn tone="secondary" left={<Eye className="h-4 w-4" />}>Preview issue path</Btn>
                  </div>
                </div>
              ) : null}
            </Card>
          </div>
        </div>

        <div className="mt-5">
          <Card title="Surface coverage matrix" subtitle="Desktop, mobile, and child-safe validation across core Provider provider surfaces." right={<Pill>{scopedCoverage.length} rows in scope</Pill>}>
            <div className="overflow-auto">
              <table className="min-w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr>
                    <th className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate px-3">Surface</th>
                    <th className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate px-3">Scope</th>
                    <th className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate px-3">Desktop</th>
                    <th className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate px-3">Mobile</th>
                    <th className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate px-3">Child-safe</th>
                    <th className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {scopedCoverage.map((row) => (
                    <tr key={row.id} className="rounded-[22px] bg-[var(--fh-surface)] dark:bg-slate-950">
                      <td className="px-3 py-3 rounded-l-[18px]">
                        <div className="text-[13px] font-black text-faith-ink dark:text-slate-100">{row.label}</div>
                      </td>
                      <td className="px-3 py-3 text-[12px] text-faith-slate">{row.scope}</td>
                      <td className="px-3 py-3"><CoverageBadge value={row.desktop} /></td>
                      <td className="px-3 py-3"><CoverageBadge value={row.mobile} /></td>
                      <td className="px-3 py-3">{row.childSafe ? <Pill tone="good">Protected</Pill> : <Pill>Standard</Pill>}</td>
                      <td className="px-3 py-3 rounded-r-[18px]"><Pill tone={stateTone(row.status)}>{row.status}</Pill></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}








