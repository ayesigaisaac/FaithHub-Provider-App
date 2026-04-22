// @ts-nocheck
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  BarChart3,
  Bell,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Copy,
  Download,
  ExternalLink,
  Eye,
  Gift,
  HeartHandshake,
  Layers,
  MonitorPlay,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Wallet,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { KpiTile } from "../../../components/ui/KpiTile";
import { navigateWithRouter } from "@/navigation/routerNavigate";

/**
 * Provider — Donations & Funds
 * -------------------------------------
 * Premium giving workspace for Provider Workspace.
 *
 * Design goals
 * - Keep the same premium creator-style layout direction used across the other generated Provider pages.
 * - Use EVzone Green as the primary accent, Orange as the secondary accent, and soft neutrals for premium finance surfaces.
 * - Cover the full page spec: funds registry, campaign creation, donor experience settings, payout/finance,
 *   donor intelligence, live/content bridge, compliance, lifecycle controls, and a strong preview workflow.
 * - Preserve a warm, ministry-centered tone while still surfacing operational rigor and financial transparency.
 *
 * Notes
 * - Self-contained mock TSX page. Replace routing, analytics, persistence, preview rendering, and export hooks during integration.
 * - Tailwind-style utility classes assumed.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#0b1d49";

const ROUTES = {
  charityCrowdfund: "/faithhub/provider/charity-crowdfunding-workbench",
  beaconBuilder: "/faithhub/provider/beacon-builder",
  audienceNotifications: "/faithhub/provider/audience-notifications",
  liveBuilder: "/faithhub/provider/live-builder",
  eventsManager: "/faithhub/provider/events-manager",
};

const HERO_GENERAL =
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1600&q=80";
const HERO_MISSIONS =
  "https://images.unsplash.com/photo-1469571486292-b53601020f52?auto=format&fit=crop&w=1600&q=80";
const HERO_PARTNERS =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80";
const HERO_BUILDING =
  "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=80";

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  navigateWithRouter(url);
}

function fmtInt(n: number) {
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function fmtCurrency(n: number, currency = "£") {
  return `${currency}${Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(n)}`;
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
  });
}

function pct(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Math.max(0, Math.min(100, Math.round((numerator / denominator) * 100)));
}

type PreviewMode = "desktop" | "mobile";
type RegistryFilter = "all" | "funds" | "campaigns" | "recurring" | "active";
type RecordType = "Fund" | "Campaign" | "Recurring support";
type Lifecycle = "Draft" | "Scheduled" | "Active" | "Paused" | "Completed" | "Archived";
type FinanceHealth = "Healthy" | "Review" | "Delayed";

type GivingRecord = {
  id: string;
  title: string;
  subtitle: string;
  recordType: RecordType;
  kind: string;
  owner: string;
  lifecycle: Lifecycle;
  financeHealth: FinanceHealth;
  trustScore: number;
  repeatRate: number;
  raised: number;
  goal: number;
  nextPayoutISO: string;
  reconciliationPct: number;
  donorPrivacy: string;
  receiptLanguage: string;
  confirmationJourney: string;
  defaultAmounts: number[];
  linkedObjects: string[];
  legalCopyReady: boolean;
  accountabilityReady: boolean;
  statusHint: string;
  attribution: {
    live: number;
    replay: number;
    events: number;
    beacon: number;
  };
  heroImageUrl: string;
  accent: "green" | "orange" | "navy";
};

type CreationPreset = {
  id: string;
  label: string;
  mode: "Fund" | "Campaign" | "Recurring support" | "Crowdfund";
  accent: "green" | "orange" | "navy";
  hint: string;
};

type BridgeSurface = {
  id: string;
  label: string;
  surface: "Live Session" | "Replay" | "Event" | "Beacon";
  state: string;
  value: string;
  hint: string;
  ready: boolean;
};

const RECORDS_SEED: GivingRecord[] = [
  {
    id: "fund_general",
    title: "General Tithe & Offering",
    subtitle: "Core ministry support across worship, care, outreach, and operations",
    recordType: "Fund",
    kind: "General fund",
    owner: "Finance Office",
    lifecycle: "Active",
    financeHealth: "Healthy",
    trustScore: 98,
    repeatRate: 61,
    raised: 128400,
    goal: 160000,
    nextPayoutISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    reconciliationPct: 96,
    donorPrivacy: "Names shown on donor wall only with explicit opt-in",
    receiptLanguage: "Standard ministry receipt",
    confirmationJourney: "Instant thank-you + 7-day stewardship follow-up",
    defaultAmounts: [15, 30, 60, 120, 300],
    linkedObjects: ["Sunday Morning Live", "Events Manager", "Audience Notifications", "Beacon Supporter Boost"],
    legalCopyReady: true,
    accountabilityReady: true,
    statusHint: "This fund is healthy, highly trusted, and benefits from direct prompting inside regular Live Sessions.",
    attribution: {
      live: 39,
      replay: 18,
      events: 21,
      beacon: 22,
    },
    heroImageUrl: HERO_GENERAL,
    accent: "green",
  },
  {
    id: "campaign_missions",
    title: "Missions Impact Fund",
    subtitle: "Quarterly campaign for outreach teams, relief packs, and local partner grants",
    recordType: "Campaign",
    kind: "Special appeal",
    owner: "Outreach Team",
    lifecycle: "Active",
    financeHealth: "Healthy",
    trustScore: 96,
    repeatRate: 48,
    raised: 48200,
    goal: 60000,
    nextPayoutISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(),
    reconciliationPct: 91,
    donorPrivacy: "Anonymous by default, named recognition optional",
    receiptLanguage: "Missions campaign receipt",
    confirmationJourney: "Same-day thank-you + field update sequence",
    defaultAmounts: [25, 50, 100, 250, 500],
    linkedObjects: ["Sunday Outreach Live", "Missions Night Event", "Beacon Appeal Boost", "Replay Follow-up Journey"],
    legalCopyReady: true,
    accountabilityReady: true,
    statusHint: "Best driven through live storytelling, post-live updates, and Beacon-supported regional promotion.",
    attribution: {
      live: 44,
      replay: 16,
      events: 18,
      beacon: 22,
    },
    heroImageUrl: HERO_MISSIONS,
    accent: "orange",
  },
  {
    id: "recurring_partner",
    title: "Monthly Partner Circle",
    subtitle: "Recurring support pathway for committed partners and long-term supporters",
    recordType: "Recurring support",
    kind: "Recurring support",
    owner: "Partnership Team",
    lifecycle: "Active",
    financeHealth: "Healthy",
    trustScore: 97,
    repeatRate: 78,
    raised: 24100,
    goal: 30000,
    nextPayoutISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).toISOString(),
    reconciliationPct: 98,
    donorPrivacy: "Partner names hidden unless they request public recognition",
    receiptLanguage: "Recurring partner receipt",
    confirmationJourney: "Partner welcome + monthly stewardship note",
    defaultAmounts: [10, 25, 50, 100, 250],
    linkedObjects: ["Partner Webinar Live", "Audience Journey", "Beacon Retention Push"],
    legalCopyReady: true,
    accountabilityReady: true,
    statusHint: "The strongest retention engine in the ministry, with healthy repeat donor confidence and excellent confirmation flows.",
    attribution: {
      live: 31,
      replay: 21,
      events: 14,
      beacon: 34,
    },
    heroImageUrl: HERO_PARTNERS,
    accent: "navy",
  },
  {
    id: "building_renewal",
    title: "Building Renewal Drive",
    subtitle: "Seasonal capital campaign focused on facility upgrades and accessibility improvements",
    recordType: "Campaign",
    kind: "Building fund",
    owner: "Leadership Team",
    lifecycle: "Scheduled",
    financeHealth: "Review",
    trustScore: 89,
    repeatRate: 37,
    raised: 18500,
    goal: 90000,
    nextPayoutISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString(),
    reconciliationPct: 83,
    donorPrivacy: "Public wall disabled until campaign launch",
    receiptLanguage: "Capital campaign receipt",
    confirmationJourney: "Launch-day thank-you + renovation milestone updates",
    defaultAmounts: [50, 100, 250, 500, 1000],
    linkedObjects: ["Dedication Event", "Beacon Launch Campaign"],
    legalCopyReady: true,
    accountabilityReady: false,
    statusHint: "Needs stronger accountability assets before launch so donors clearly understand what the campaign will fund.",
    attribution: {
      live: 22,
      replay: 9,
      events: 31,
      beacon: 38,
    },
    heroImageUrl: HERO_BUILDING,
    accent: "orange",
  },
  {
    id: "scholarship_youth",
    title: "Youth Camp Scholarship Appeal",
    subtitle: "Paused seasonal giving pathway for camp scholarships, transport support, and bursaries",
    recordType: "Campaign",
    kind: "Seasonal appeal",
    owner: "Youth Ministry",
    lifecycle: "Paused",
    financeHealth: "Delayed",
    trustScore: 84,
    repeatRate: 29,
    raised: 11200,
    goal: 25000,
    nextPayoutISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8).toISOString(),
    reconciliationPct: 74,
    donorPrivacy: "Donor wall disabled",
    receiptLanguage: "Scholarship support receipt",
    confirmationJourney: "Thank-you + testimony sequence",
    defaultAmounts: [20, 40, 80, 150, 300],
    linkedObjects: ["Youth Rally Event", "Replay Follow-up"],
    legalCopyReady: false,
    accountabilityReady: false,
    statusHint: "Paused because legal copy and where-money-goes messaging need refinement before the next push.",
    attribution: {
      live: 28,
      replay: 12,
      events: 35,
      beacon: 25,
    },
    heroImageUrl: HERO_GENERAL,
    accent: "orange",
  },
];

const CREATION_PRESETS: CreationPreset[] = [
  {
    id: "preset_fund",
    label: "General fund",
    mode: "Fund",
    accent: "green",
    hint: "Launch a steady giving destination for everyday ministry support.",
  },
  {
    id: "preset_campaign",
    label: "Special campaign",
    mode: "Campaign",
    accent: "orange",
    hint: "Run a timed appeal, seasonal drive, or special giving moment.",
  },
  {
    id: "preset_recurring",
    label: "Recurring support",
    mode: "Recurring support",
    accent: "navy",
    hint: "Create a monthly partner pathway with retention-first donor journeys.",
  },
  {
    id: "preset_crowdfund",
    label: "Charity crowdfund",
    mode: "Crowdfund",
    accent: "orange",
    hint: "Open the dedicated crowdfunding workbench for public goal-driven charity stories.",
  },
];

const BRIDGE_SEED: BridgeSurface[] = [
  {
    id: "bridge_live",
    label: "Sunday Morning Live donation moment",
    surface: "Live Session",
    state: "Ready",
    value: "£12.8k influenced",
    hint: "Pinned donor CTA and progress strip inside the sermon run-of-show.",
    ready: true,
  },
  {
    id: "bridge_replay",
    label: "Replay stewardship strip",
    surface: "Replay",
    state: "Queued",
    value: "18% replay-influenced gifts",
    hint: "Replay page includes donor prompt, notes, and follow-up CTA.",
    ready: true,
  },
  {
    id: "bridge_event",
    label: "Conference giving moment",
    surface: "Event",
    state: "Needs setup",
    value: "Add sponsor + giving prompt",
    hint: "Attach the fund to the event page and on-site giving workflow.",
    ready: false,
  },
  {
    id: "bridge_beacon",
    label: "Supporter retention booster",
    surface: "Beacon",
    state: "Ready",
    value: "22% conversion share",
    hint: "Active promotion path from donor page into a Beacon support campaign.",
    ready: true,
  },
];

function badgeToneForFinance(health: FinanceHealth):
  | "good"
  | "warn"
  | "bad" {
  if (health === "Healthy") return "good";
  if (health === "Review") return "warn";
  return "bad";
}

function accentColor(accent: "green" | "orange" | "navy") {
  return accent === "orange" ? EV_ORANGE : accent === "navy" ? EV_NAVY : EV_GREEN;
}

function ProgressBar({
  value,
  tone = "green",
}: {
  value: number;
  tone?: "green" | "orange" | "navy";
}) {
  const width = Math.max(0, Math.min(100, value));
  const color = tone === "orange" ? EV_ORANGE : tone === "navy" ? EV_NAVY : EV_GREEN;
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div className="h-full rounded-full transition-all" style={{ width: `${width}%`, background: color }} />
    </div>
  );
}

function MiniLine({
  values,
  tone = "green",
}: {
  values: number[];
  tone?: "green" | "orange" | "navy";
}) {
  const w = 180;
  const h = 56;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const color = tone === "orange" ? EV_ORANGE : tone === "navy" ? EV_NAVY : EV_GREEN;

  const pts = values
    .map((v, i) => {
      const x = (i / Math.max(1, values.length - 1)) * w;
      const y = h - ((v - min) / span) * (h - 10) - 5;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  const area = `${pts} ${w},${h} 0,${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-14 w-full overflow-visible">
      <polyline points={area} fill={color} opacity="0.08" />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Pill({
  tone = "neutral",
  children,
  title,
}: {
  tone?: "good" | "warn" | "bad" | "neutral" | "pro";
  children: React.ReactNode;
  title?: string;
}) {
  const cls =
    tone === "good"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
      : tone === "warn"
        ? "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20"
        : tone === "bad"
          ? "bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20"
          : tone === "pro"
            ? "bg-violet-50 text-violet-800 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:ring-violet-500/20"
            : "bg-slate-100 text-slate-800 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700";
  return (
    <span
      title={title}
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-semibold ring-1 whitespace-nowrap",
        cls,
      )}
    >
      {children}
    </span>
  );
}

function Btn({
  tone = "neutral",
  children,
  onClick,
  disabled,
  left,
  title,
}: {
  tone?: "neutral" | "primary" | "secondary" | "ghost";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  left?: React.ReactNode;
  title?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  const cls =
    tone === "primary"
      ? "text-white hover:brightness-95 shadow-soft"
      : tone === "secondary"
        ? "text-white hover:brightness-95 shadow-soft"
        : tone === "ghost"
          ? "bg-transparent text-faith-ink dark:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800"
          : "bg-[var(--fh-surface-bg)] dark:bg-slate-900 text-faith-ink dark:text-slate-50 ring-1 ring-slate-200 dark:ring-slate-800 hover:bg-[var(--fh-surface)] dark:hover:bg-slate-800 shadow-soft";
  const style =
    tone === "primary"
      ? { background: EV_GREEN }
      : tone === "secondary"
        ? { background: EV_ORANGE }
        : undefined;

  return (
    <button title={title} onClick={disabled ? undefined : onClick} disabled={disabled} className={cx(base, cls)} style={style}>
      {left}
      {children}
    </button>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cx(
        "relative inline-flex h-6 w-11 items-center rounded-full transition",
        value ? "bg-slate-900 dark:bg-slate-100" : "bg-slate-300 dark:bg-slate-700",
      )}
      aria-pressed={value}
    >
      <span
        className={cx(
          "inline-block h-5 w-5 transform rounded-full bg-[var(--fh-surface-bg)] dark:bg-slate-900 shadow transition",
          value ? "translate-x-5" : "translate-x-1",
        )}
      />
    </button>
  );
}

function Modal({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
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
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-t-3xl bg-[var(--fh-surface-bg)] shadow-2xl ring-1 ring-slate-200 transition dark:bg-slate-900 dark:ring-slate-800 sm:h-auto sm:max-h-[90vh] sm:rounded-[14px]">
        <div className="flex items-start justify-between gap-3 border-b border-faith-line px-5 py-4 dark:border-slate-800">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-faith-ink dark:text-slate-50">{title}</div>
            {subtitle ? <div className="mt-1 text-xs text-faith-slate">{subtitle}</div> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5 text-faith-slate" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 sm:p-6">{children}</div>
      </div>
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-soft dark:bg-slate-100 dark:text-faith-ink">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-base font-bold text-faith-ink dark:text-slate-50">{title}</div>
          {subtitle ? <div className="mt-1 text-xs text-faith-slate">{subtitle}</div> : null}
        </div>
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
  tone = "green",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "green" | "orange" | "navy";
}) {
  return <KpiTile label={label} value={value} hint={hint} tone={tone} size="compact" />;
}

function RegistryRow({
  record,
  active,
  onSelect,
  onDuplicate,
}: {
  record: GivingRecord;
  active: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
}) {
  const color = accentColor(record.accent);
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cx(
        "w-full rounded-[14px] border p-3 text-left transition-all",
        active
          ? "border-slate-300 bg-[var(--fh-surface-bg)] shadow-soft dark:border-slate-700 dark:bg-slate-900"
          : "border-faith-line bg-[var(--fh-surface)] hover:bg-[var(--fh-surface-bg)] dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-900",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-bold text-faith-ink dark:text-slate-50">{record.title}</div>
          <div className="mt-1 text-xs text-faith-slate line-clamp-2">{record.subtitle}</div>
        </div>
        <div className="shrink-0 rounded-full px-2 py-1 text-[10px] font-bold text-white" style={{ background: color }}>
          {record.recordType}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Pill tone={badgeToneForFinance(record.financeHealth)}>{record.financeHealth}</Pill>
        <Pill tone="good">Trust {record.trustScore}%</Pill>
        <Pill tone="warn">Repeat {record.repeatRate}%</Pill>
        <Pill tone="neutral">{record.lifecycle}</Pill>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] text-faith-slate">Raised</div>
          <div className="text-sm font-extrabold text-faith-ink dark:text-slate-50">{fmtCurrency(record.raised)}</div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="rounded-full bg-[var(--fh-surface-bg)] px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-[var(--fh-surface)] dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800"
        >
          Duplicate
        </button>
      </div>
    </button>
  );
}

function BrowserPreview({
  record,
  recurringDefault,
  privacyWall,
  donorCopy,
}: {
  record: GivingRecord;
  recurringDefault: boolean;
  privacyWall: boolean;
  donorCopy: string;
}) {
  return (
    <div className="overflow-hidden rounded-[16px] bg-[var(--fh-surface-bg)] shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800">
      <div className="flex items-center gap-2 border-b border-faith-line bg-[var(--fh-surface)] px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <div className="ml-2 rounded-full bg-[var(--fh-surface-bg)] px-4 py-1 text-xs font-semibold text-faith-slate ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
          faithhub.app/give/{record.id}
        </div>
      </div>
      <div className="grid gap-0 md:grid-cols-[1.15fr_0.85fr]">
        <div className="relative min-h-[360px] overflow-hidden bg-slate-950 text-white">
          <img src={record.heroImageUrl} alt={record.title} className="absolute inset-0 h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-900/10" />
          <div className="relative z-10 p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--fh-surface-bg)]/10 px-3 py-1 text-xs font-bold backdrop-blur">
              <HeartHandshake className="h-3.5 w-3.5" /> Giving
            </div>
            <div className="mt-5 text-3xl font-black leading-tight">{record.title}</div>
            <div className="mt-2 max-w-[520px] text-sm text-white/85">{record.subtitle}</div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-[var(--fh-surface-bg)]/10 px-3 py-1 font-semibold">Trust {record.trustScore}%</span>
              <span className="rounded-full bg-[var(--fh-surface-bg)]/10 px-3 py-1 font-semibold">Recurring {record.repeatRate}%</span>
              <span className="rounded-full bg-[var(--fh-surface-bg)]/10 px-3 py-1 font-semibold">{record.recordType}</span>
            </div>
            <div className="mt-6 max-w-[520px] text-sm leading-relaxed text-white/85">{donorCopy}</div>
          </div>
        </div>
        <div className="bg-[var(--fh-surface-bg)] p-6 dark:bg-slate-900">
          <div className="text-xs font-bold uppercase tracking-wide text-faith-slate">Give today</div>
          <div className="mt-2 text-2xl font-black text-faith-ink dark:text-slate-50">{fmtCurrency(record.raised)}</div>
          <div className="mt-1 text-sm text-faith-slate">toward {fmtCurrency(record.goal)} goal</div>
          <div className="mt-3"><ProgressBar value={pct(record.raised, record.goal)} tone={record.accent === "navy" ? "navy" : record.accent === "orange" ? "orange" : "green"} /></div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {record.defaultAmounts.slice(0, 3).map((amount) => (
              <button
                type="button"
                key={amount}
                className="rounded-xl border border-faith-line bg-[var(--fh-surface)] px-3 py-3 text-center text-sm font-extrabold text-faith-ink transition hover:bg-[var(--fh-surface-bg)] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700"
                onClick={() => safeNav("/faithhub/provider/donations-and-funds")}>
                {fmtCurrency(amount)}
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-[var(--fh-surface)] p-3 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-800">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-faith-ink dark:text-slate-50">Monthly support</div>
                <div className="mt-1 text-xs text-faith-slate">Preselect recurring giving for partner-style campaigns.</div>
              </div>
              <span className={cx("rounded-full px-3 py-1 text-xs font-bold", recurringDefault ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200")}>{recurringDefault ? "On" : "Off"}</span>
            </div>
          </div>
          <div className="mt-4 rounded-xl bg-[var(--fh-surface)] p-3 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-800">
            <div className="text-sm font-bold text-faith-ink dark:text-slate-50">Trust & privacy</div>
            <div className="mt-2 text-xs text-faith-slate">{privacyWall ? "Donor recognition requires explicit opt-in." : record.donorPrivacy}</div>
          </div>
          <button type="button" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold text-white" style={{ background: EV_GREEN }} onClick={() => safeNav("/faithhub/provider/donations-and-funds")}>
            <HeartHandshake className="h-4 w-4" /> Complete donation
          </button>
        </div>
      </div>
    </div>
  );
}

function PhonePreview({
  record,
  recurringDefault,
  privacyWall,
}: {
  record: GivingRecord;
  recurringDefault: boolean;
  privacyWall: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-[360px] md:max-w-[400px]">
      <div className="rounded-[34px] bg-slate-900 p-3 shadow-2xl">
        <div className="overflow-hidden rounded-[14px] bg-[var(--fh-surface-bg)] dark:bg-slate-900">
          <div className="relative aspect-[9/12] overflow-y-auto bg-[var(--fh-surface)] dark:bg-slate-950">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-[var(--fh-surface-bg)]/95 px-4 py-3 shadow-soft backdrop-blur dark:bg-slate-900/95">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-faith-slate">Giving</div>
                <div className="text-sm font-black text-faith-ink dark:text-slate-50">{record.title}</div>
              </div>
              <div className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{record.recordType}</div>
            </div>
            <div className="p-4">
              <div className="overflow-hidden rounded-[14px] bg-slate-950 text-white">
                <div className="relative aspect-[4/3]">
                  <img src={record.heroImageUrl} alt={record.title} className="absolute inset-0 h-full w-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="text-lg font-black leading-tight">{record.title}</div>
                    <div className="mt-1 text-xs text-white/80">Raised {fmtCurrency(record.raised)} of {fmtCurrency(record.goal)}</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {record.defaultAmounts.slice(0, 4).map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className="rounded-xl border border-faith-line bg-[var(--fh-surface-bg)] px-3 py-3 text-sm font-extrabold text-faith-ink shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                    onClick={() => safeNav("/faithhub/provider/donations-and-funds")}>
                    {fmtCurrency(amount)}
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-[var(--fh-surface-bg)] p-3 shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-faith-ink dark:text-slate-50">Monthly support</div>
                    <div className="text-xs text-faith-slate">{recurringDefault ? "Enabled by default" : "One-time selected"}</div>
                  </div>
                  <span className={cx("rounded-full px-3 py-1 text-[10px] font-bold", recurringDefault ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200")}>{recurringDefault ? "Monthly" : "Once"}</span>
                </div>
              </div>
              <div className="mt-3 rounded-xl bg-[var(--fh-surface-bg)] p-3 shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                <div className="text-sm font-bold text-faith-ink dark:text-slate-50">Trust note</div>
                <div className="mt-1 text-xs text-faith-slate">{privacyWall ? "Recognition requires donor opt-in." : record.donorPrivacy}</div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-[var(--fh-surface-bg)]/95 px-4 pb-4 pt-2 backdrop-blur dark:bg-slate-900/95">
              <button type="button" className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold text-white shadow-lg" style={{ background: EV_GREEN }} onClick={() => safeNav("/faithhub/provider/donations-and-funds")}>
                <HeartHandshake className="h-4 w-4" /> Give now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CampaignComposer({
  mode,
  onClose,
}: {
  mode: "Fund" | "Campaign" | "Recurring support" | "Crowdfund";
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("Finance Office");
  const [goal, setGoal] = useState("25000");
  const [launchNow, setLaunchNow] = useState(mode !== "Fund");
  const [tieToLive, setTieToLive] = useState(true);
  const [tieToBeacon, setTieToBeacon] = useState(mode !== "Fund");

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-faith-slate">Name</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={mode === "Fund" ? "e.g. General Missions Fund" : mode === "Campaign" ? "e.g. Easter Appeal" : mode === "Recurring support" ? "e.g. Partner Circle" : "e.g. Clean Water Charity Drive"}
            className="mt-1 w-full rounded-xl border border-faith-line bg-[var(--fh-surface-bg)] px-3 py-3 text-sm text-faith-ink outline-none transition focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:ring-slate-700"
          />
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-faith-slate">Owner</div>
          <input
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="mt-1 w-full rounded-xl border border-faith-line bg-[var(--fh-surface-bg)] px-3 py-3 text-sm text-faith-ink outline-none transition focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:ring-slate-700"
          />
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-faith-slate">Target or goal</div>
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value.replace(/[^\d]/g, ""))}
            className="mt-1 w-full rounded-xl border border-faith-line bg-[var(--fh-surface-bg)] px-3 py-3 text-sm text-faith-ink outline-none transition focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:ring-slate-700"
          />
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-faith-slate">Launch strategy</div>
          <div className="mt-1 grid gap-2">
            <div className="flex items-center justify-between rounded-xl bg-[var(--fh-surface)] px-3 py-3 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-800">
              <div>
                <div className="text-sm font-bold text-faith-ink dark:text-slate-50">Launch now</div>
                <div className="mt-1 text-xs text-faith-slate">Create a ready-to-use donor surface immediately.</div>
              </div>
              <Toggle value={launchNow} onChange={setLaunchNow} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-[14px] bg-[var(--fh-surface)] p-4 ring-1 ring-slate-200 dark:bg-slate-800/40 dark:ring-slate-800">
          <div className="text-sm font-bold text-faith-ink dark:text-slate-50">Connected surfaces</div>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-faith-ink dark:text-slate-50">Tie into Live Sessions</div>
                <div className="text-xs text-faith-slate">Create donor prompts for live, replay, or event moments.</div>
              </div>
              <Toggle value={tieToLive} onChange={setTieToLive} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-faith-ink dark:text-slate-50">Open Beacon bridge</div>
                <div className="text-xs text-faith-slate">Prepare a promotion path once the campaign is live.</div>
              </div>
              <Toggle value={tieToBeacon} onChange={setTieToBeacon} />
            </div>
          </div>
        </div>
        <div className="rounded-[14px] bg-[var(--fh-surface)] p-4 ring-1 ring-slate-200 dark:bg-slate-800/40 dark:ring-slate-800">
          <div className="text-sm font-bold text-faith-ink dark:text-slate-50">Mode summary</div>
          <div className="mt-3 text-sm text-faith-slate dark:text-slate-300">
            {mode === "Fund" && "Standard fund for steady, always-on giving across the ministry."}
            {mode === "Campaign" && "Timed giving pathway for appeals, special moments, seasonal pushes, or emergency calls to action."}
            {mode === "Recurring support" && "Retention-first donor experience that emphasizes monthly partnership and long-term supporter care."}
            {mode === "Crowdfund" && "Charity crowdfunding is managed in the dedicated workbench because it needs storytelling, public updates, beneficiaries, and momentum features."}
          </div>
          {mode === "Crowdfund" ? (
            <div className="mt-3 rounded-xl border border-dashed border-amber-300 bg-amber-50 px-3 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
              This mode continues in the Charity Crowdfunding Workbench so the Provider can manage goals, proof-of-impact updates, beneficiary stories, and public momentum properly.
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Btn tone="ghost" onClick={onClose}>Cancel</Btn>
        {mode === "Crowdfund" ? (
          <Btn tone="secondary" onClick={() => safeNav(ROUTES.charityCrowdfund)} left={<ExternalLink className="h-4 w-4" />}>
            Open workbench
          </Btn>
        ) : (
          <Btn tone="primary" onClick={onClose} left={<CheckCircle2 className="h-4 w-4" />}>
            Save draft
          </Btn>
        )}
      </div>
    </div>
  );
}

export default function DonationsAndFundsPage() {
  const [records, setRecords] = useState<GivingRecord[]>(RECORDS_SEED);
  const [selectedId, setSelectedId] = useState(RECORDS_SEED[0]?.id || "");
  const [registryFilter, setRegistryFilter] = useState<RegistryFilter>("all");
  const [search, setSearch] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerMode, setComposerMode] = useState<"Fund" | "Campaign" | "Recurring support" | "Crowdfund">("Fund");
  const [recurringDefault, setRecurringDefault] = useState(true);
  const [privacyWall, setPrivacyWall] = useState(false);
  const [quietHoursGuard, setQuietHoursGuard] = useState(true);
  const [receiptLanguage, setReceiptLanguage] = useState("Standard ministry receipt");
  const [confirmationJourney, setConfirmationJourney] = useState("Instant thank-you + 7-day stewardship follow-up");
  const [donorCopy, setDonorCopy] = useState(
    "Your generosity strengthens ministry, supports people, and fuels real outcomes across Provider moments.",
  );
  const [toast, setToast] = useState<string | null>(null);

  const selectedRecord = useMemo(
    () => records.find((item) => item.id === selectedId) || records[0],
    [records, selectedId],
  );

  useEffect(() => {
    if (!selectedRecord) return;
    setReceiptLanguage(selectedRecord.receiptLanguage);
    setConfirmationJourney(selectedRecord.confirmationJourney);
    setPrivacyWall(selectedRecord.donorPrivacy.toLowerCase().includes("opt-in"));
  }, [selectedRecord]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const matchesFilter =
        registryFilter === "all"
          ? true
          : registryFilter === "funds"
            ? item.recordType === "Fund"
            : registryFilter === "campaigns"
              ? item.recordType === "Campaign"
              : registryFilter === "recurring"
                ? item.recordType === "Recurring support"
                : item.lifecycle === "Active";

      const hay = `${item.title} ${item.subtitle} ${item.kind} ${item.owner}`.toLowerCase();
      const matchesSearch = hay.includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [records, registryFilter, search]);

  const lifecycleCounts = useMemo(() => {
    return {
      draft: records.filter((item) => item.lifecycle === "Draft").length,
      scheduled: records.filter((item) => item.lifecycle === "Scheduled").length,
      active: records.filter((item) => item.lifecycle === "Active").length,
      paused: records.filter((item) => item.lifecycle === "Paused").length,
      completed: records.filter((item) => item.lifecycle === "Completed").length,
      archived: records.filter((item) => item.lifecycle === "Archived").length,
    };
  }, [records]);

  const donorGrowthSeries = [140, 164, 176, 191, 208, 233, 246, 265, 281, 298, 321, 346];
  const recurringRetentionSeries = [68, 69, 70, 71, 72, 73, 74, 74, 75, 76, 77, 78];
  const contentInfluenceSeries = [12, 18, 15, 22, 19, 27, 31, 29, 33, 36, 39, 42];

  const attributionBars = useMemo(() => {
    if (!selectedRecord) return [];
    return [
      { label: "Live Sessions", value: selectedRecord.attribution.live, hint: "Donation moments inside live production" },
      { label: "Replays & clips", value: selectedRecord.attribution.replay, hint: "Post-live follow-up and replay CTAs" },
      { label: "Events", value: selectedRecord.attribution.events, hint: "Event registration and in-person giving moments" },
      { label: "Beacon", value: selectedRecord.attribution.beacon, hint: "Promoted campaigns and support reminders" },
    ];
  }, [selectedRecord]);

  const duplicateRecord = (record: GivingRecord) => {
    const clone: GivingRecord = {
      ...record,
      id: `${record.id}_copy_${Math.random().toString(16).slice(2, 6)}`,
      title: `${record.title} Copy`,
      lifecycle: "Draft",
    };
    setRecords((prev) => [clone, ...prev]);
    setSelectedId(clone.id);
    setToast(`Duplicated ${record.title}`);
  };

  const openComposer = (mode: "Fund" | "Campaign" | "Recurring support" | "Crowdfund") => {
    setComposerMode(mode);
    setComposerOpen(true);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[var(--fh-page-bg)] dark:bg-slate-950 text-faith-ink dark:text-slate-50 transition-colors overflow-x-hidden">
      <div className="sticky top-0 z-40 border-b border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)]/95 dark:bg-slate-900/95 backdrop-blur transition-colors">
        <div className="w-full px-4 md:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-faith-slate">
                <span className="hover:text-slate-700 dark:hover:text-slate-200">Provider Workspace</span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="hover:text-slate-700 dark:hover:text-slate-200">Events &amp; Giving</span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">Donations &amp; Funds</span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-faith-ink dark:text-slate-50">
                  Donations &amp; Funds
                </div>
                <Pill tone="good">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Trust-ready
                </Pill>
                <Pill tone="pro">
                  <Sparkles className="h-3.5 w-3.5" />
                  Donor intelligence
                </Pill>
              </div>
              <div className="mt-1 text-[10px] sm:text-xs text-faith-slate">
                Premium giving operations for standard funds, special campaigns, recurring support, donor experience, and finance visibility.
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Btn tone="ghost" onClick={() => setPreviewOpen(true)} left={<Eye className="h-4 w-4" />}>
                Preview
              </Btn>
              <Btn tone="primary" onClick={() => openComposer("Fund")} left={<Plus className="h-4 w-4" />}>
                + New Fund
              </Btn>
              <Btn tone="secondary" onClick={() => openComposer("Campaign")} left={<Gift className="h-4 w-4" />}>
                + New Campaign
              </Btn>
              <Btn tone="neutral" onClick={() => setInsightsOpen(true)} left={<BarChart3 className="h-4 w-4" />}>
                Open donor insights
              </Btn>
            </div>
          </div>
        </div>

        <div className="border-t border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 transition-colors">
          <div className="w-full px-4 md:px-6 lg:px-8 py-3">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <div className="rounded-xl bg-[var(--fh-surface)] dark:bg-slate-800 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-800 text-sm font-bold text-faith-ink dark:text-slate-100">
                  {selectedRecord?.title}
                </div>
                <Pill tone="good">Trust {selectedRecord?.trustScore ?? 0}%</Pill>
                <Pill tone={badgeToneForFinance(selectedRecord?.financeHealth || "Healthy")}>{selectedRecord?.financeHealth || "Healthy"}</Pill>
                <Pill tone="warn">Recurring {selectedRecord?.repeatRate ?? 0}%</Pill>
                <Pill tone="neutral">{selectedRecord?.linkedObjects.length || 0} linked surfaces</Pill>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Btn tone="ghost" onClick={() => setToast("Copied finance snapshot")} left={<Copy className="h-4 w-4" />}>
                  Copy snapshot
                </Btn>
                <Btn tone="ghost" onClick={() => setToast("Exported donor report")} left={<Download className="h-4 w-4" />}>
                  Export report
                </Btn>
                <Btn tone="secondary" onClick={() => safeNav(ROUTES.charityCrowdfund)} left={<ExternalLink className="h-4 w-4" />}>
                  Open crowdfund workbench
                </Btn>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-[14px] bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-soft transition">
              <SectionTitle
                icon={<Layers className="h-5 w-5" />}
                title="Funds registry"
                subtitle="All active and archived funds, campaigns, support options, and giving destinations."
              />
              <div className="mt-4 space-y-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faith-slate" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search funds, owners, or donor journeys"
                    className="w-full rounded-xl bg-[var(--fh-surface)] dark:bg-slate-800 px-10 py-3 text-sm text-faith-ink dark:text-slate-50 ring-1 ring-slate-200 dark:ring-slate-800 outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    ["all", "All"],
                    ["funds", "Funds"],
                    ["campaigns", "Campaigns"],
                    ["recurring", "Recurring"],
                    ["active", "Active"],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setRegistryFilter(key as RegistryFilter)}
                      className={cx(
                        "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                        registryFilter === key
                          ? "text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
                      )}
                      style={registryFilter === key ? { background: key === "campaigns" ? EV_ORANGE : EV_GREEN } : undefined}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="space-y-3 max-h-[760px] overflow-y-auto pr-1">
                  {filteredRecords.map((record) => (
                    <RegistryRow
                      key={record.id}
                      record={record}
                      active={selectedId === record.id}
                      onSelect={() => setSelectedId(record.id)}
                      onDuplicate={() => duplicateRecord(record)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-[14px] bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-soft transition">
              <SectionTitle
                icon={<Plus className="h-5 w-5" />}
                title="Campaign creation rail"
                subtitle="Launch the right giving shape: general fund, seasonal appeal, recurring support, or charity crowdfund."
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {CREATION_PRESETS.map((preset) => {
                  const accent = accentColor(preset.accent);
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() =>
                        preset.mode === "Crowdfund"
                          ? safeNav(ROUTES.charityCrowdfund)
                          : openComposer(preset.mode)
                      }
                      className="rounded-[14px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-800/50 p-4 text-left hover:bg-[var(--fh-surface-bg)] dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-soft" style={{ background: accent }}>
                        {preset.mode === "Recurring support" ? <HeartHandshake className="h-5 w-5" /> : preset.mode === "Crowdfund" ? <Zap className="h-5 w-5" /> : <Gift className="h-5 w-5" />}
                      </div>
                      <div className="mt-3 text-sm font-bold text-faith-ink dark:text-slate-50">{preset.label}</div>
                      <div className="mt-1 text-xs text-faith-slate">{preset.hint}</div>
                      <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold" style={{ color: accent }}>
                        {preset.mode === "Crowdfund" ? "Open workbench" : "Start draft"}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[14px] bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-soft transition">
              <SectionTitle
                icon={<HeartHandshake className="h-5 w-5" />}
                title="Giving experience settings"
                subtitle="Configure suggested amounts, recurring defaults, donor-visible copy, receipts, and privacy options."
              />
              <div className="mt-4 space-y-4">
                <div className="rounded-[14px] bg-[var(--fh-surface)] dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-sm font-bold text-faith-ink dark:text-slate-50">Suggested amounts</div>
                  <div className="mt-3 grid grid-cols-5 gap-2">
                    {(selectedRecord?.defaultAmounts || []).map((amount) => (
                      <button
                        type="button"
                        key={amount}
                        className="rounded-xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-2 py-2 text-sm font-extrabold text-faith-ink dark:text-slate-50"
                        onClick={() => safeNav("/faithhub/provider/donations-and-funds")}>
                        {fmtCurrency(amount)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-[14px] bg-[var(--fh-surface)] dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-faith-ink dark:text-slate-50">Recurring default</div>
                        <div className="mt-1 text-xs text-faith-slate">Preselect monthly support for partner-style funds.</div>
                      </div>
                      <Toggle value={recurringDefault} onChange={setRecurringDefault} />
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-faith-ink dark:text-slate-50">Donor wall opt-in</div>
                        <div className="mt-1 text-xs text-faith-slate">Only surface donor names when explicit consent is given.</div>
                      </div>
                      <Toggle value={privacyWall} onChange={setPrivacyWall} />
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-faith-ink dark:text-slate-50">Quiet-hour guardrails</div>
                        <div className="mt-1 text-xs text-faith-slate">Protect donor follow-up timing inside journeys.</div>
                      </div>
                      <Toggle value={quietHoursGuard} onChange={setQuietHoursGuard} />
                    </div>
                  </div>

                  <div className="rounded-[14px] bg-[var(--fh-surface)] dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="text-sm font-bold text-faith-ink dark:text-slate-50">Receipt & confirmation</div>
                    <label className="mt-3 block text-[11px] font-semibold uppercase tracking-wide text-faith-slate">
                      Receipt language
                      <select
                        value={receiptLanguage}
                        onChange={(e) => setReceiptLanguage(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 text-sm text-faith-ink dark:text-slate-50"
                      >
                        <option>Standard ministry receipt</option>
                        <option>Missions campaign receipt</option>
                        <option>Recurring partner receipt</option>
                        <option>Capital campaign receipt</option>
                        <option>Scholarship support receipt</option>
                      </select>
                    </label>
                    <label className="mt-3 block text-[11px] font-semibold uppercase tracking-wide text-faith-slate">
                      Confirmation journey
                      <input
                        value={confirmationJourney}
                        onChange={(e) => setConfirmationJourney(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 text-sm text-faith-ink dark:text-slate-50"
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-[14px] bg-[var(--fh-surface)] dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-sm font-bold text-faith-ink dark:text-slate-50">Donor-visible copy</div>
                  <textarea
                    value={donorCopy}
                    onChange={(e) => setDonorCopy(e.target.value)}
                    rows={4}
                    className="mt-3 w-full rounded-xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-3 text-sm text-faith-ink dark:text-slate-50"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[14px] bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-soft transition">
              <SectionTitle
                icon={<MonitorPlay className="h-5 w-5" />}
                title="Live and content bridge"
                subtitle="Push donation prompts into Live Sessions, replays, events, and Beacon campaigns without losing context."
              />
              <div className="mt-4 space-y-3">
                {BRIDGE_SEED.map((item) => (
                  <div key={item.id} className="rounded-[14px] bg-[var(--fh-surface)] dark:bg-slate-800/50 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-faith-ink dark:text-slate-50">{item.label}</div>
                        <div className="mt-1 text-xs text-faith-slate">{item.surface} · {item.hint}</div>
                      </div>
                      <Pill tone={item.ready ? "good" : "warn"}>{item.state}</Pill>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="text-sm font-extrabold text-faith-ink dark:text-slate-50">{item.value}</div>
                      <button
                        type="button"
                        onClick={() => {
                          const route = item.surface === "Live Session" ? ROUTES.liveBuilder : item.surface === "Beacon" ? ROUTES.beaconBuilder : item.surface === "Event" ? ROUTES.eventsManager : ROUTES.audienceNotifications;
                          safeNav(route);
                        }}
                        className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                        style={{ background: item.surface === "Beacon" ? EV_ORANGE : EV_GREEN }}
                      >
                        {item.surface === "Beacon" ? "Configure" : "Open surface"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-[14px] bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-soft transition">
              <SectionTitle
                icon={<Eye className="h-5 w-5" />}
                title="Preview + donor experience"
                subtitle="Desktop and mobile giving surfaces with donor trust, amounts, recurring, and promotion hooks."
                right={<Pill tone="good">Preview-ready</Pill>}
              />
              <div className="mt-4 rounded-[14px] bg-[var(--fh-surface)] dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-bold text-faith-ink dark:text-slate-50">Current donor surface</div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewMode("desktop")}
                      className={cx(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        previewMode === "desktop" ? "text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
                      )}
                      style={previewMode === "desktop" ? { background: EV_NAVY } : undefined}
                    >
                      Desktop
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode("mobile")}
                      className={cx(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        previewMode === "mobile" ? "text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
                      )}
                      style={previewMode === "mobile" ? { background: EV_GREEN } : undefined}
                    >
                      Mobile
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  {previewMode === "desktop" ? (
                    <div className="scale-[0.72] origin-top-left w-[138%] -mb-24">
                      <BrowserPreview
                        record={selectedRecord}
                        recurringDefault={recurringDefault}
                        privacyWall={privacyWall}
                        donorCopy={donorCopy}
                      />
                    </div>
                  ) : (
                    <PhonePreview record={selectedRecord} recurringDefault={recurringDefault} privacyWall={privacyWall} />
                  )}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Btn tone="primary" onClick={() => setPreviewOpen(true)} left={<ExternalLink className="h-4 w-4" />}>
                    Open full preview
                  </Btn>
                  <Btn tone="secondary" onClick={() => safeNav(ROUTES.beaconBuilder)} left={<Zap className="h-4 w-4" />}>
                    Promote with Beacon
                  </Btn>
                </div>
              </div>
            </div>

            <div className="rounded-[14px] bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-soft transition">
              <SectionTitle
                icon={<BarChart3 className="h-5 w-5" />}
                title="Donor intelligence dashboard"
                subtitle="Donor growth, repeat donors, recurring retention, top campaigns, and content influence."
              />
              <div className="mt-4 grid grid-cols-2 gap-3">
                <MetricCard label="Total donors" value={fmtInt(3462)} hint="Active donors across all funds" tone="green" />
                <MetricCard label="Repeat donor rate" value={`${selectedRecord?.repeatRate || 0}%`} hint="Healthy repeat behavior this quarter" tone="orange" />
                <MetricCard label="Recurring retention" value="78%" hint="Month-over-month retention strength" tone="green" />
                <MetricCard label="Content-influenced" value={`${selectedRecord?.attribution.live || 0}%`} hint="Share influenced by live giving moments" tone="navy" />
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-[14px] bg-[var(--fh-surface)] dark:bg-slate-800/50 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-xs font-bold text-faith-ink dark:text-slate-50">Donor growth</div>
                  <div className="mt-2"><MiniLine values={donorGrowthSeries} tone="green" /></div>
                </div>
                <div className="rounded-[14px] bg-[var(--fh-surface)] dark:bg-slate-800/50 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-xs font-bold text-faith-ink dark:text-slate-50">Recurring retention</div>
                  <div className="mt-2"><MiniLine values={recurringRetentionSeries} tone="orange" /></div>
                </div>
                <div className="rounded-[14px] bg-[var(--fh-surface)] dark:bg-slate-800/50 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-xs font-bold text-faith-ink dark:text-slate-50">Content influence</div>
                  <div className="mt-2"><MiniLine values={contentInfluenceSeries} tone="navy" /></div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {attributionBars.map((item) => (
                  <div key={item.label} className="rounded-xl bg-[var(--fh-surface)] dark:bg-slate-800/50 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-bold text-faith-ink dark:text-slate-50">{item.label}</div>
                        <div className="mt-1 text-xs text-faith-slate">{item.hint}</div>
                      </div>
                      <div className="text-sm font-extrabold text-faith-ink dark:text-slate-50">{item.value}%</div>
                    </div>
                    <div className="mt-2"><ProgressBar value={item.value} tone={item.label === "Beacon" ? "orange" : item.label === "Events" ? "navy" : "green"} /></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[14px] bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-soft transition">
              <SectionTitle
                icon={<CalendarClock className="h-5 w-5" />}
                title="Payout and finance panel"
                subtitle="Payout setup, reconciliation state, finance ownership, transfer timing, and internal finance notes."
              />
              <div className="mt-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[14px] bg-[var(--fh-surface)] dark:bg-slate-800/50 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="text-[11px] uppercase tracking-wide text-faith-slate">Next payout</div>
                    <div className="mt-1 text-lg font-extrabold text-faith-ink dark:text-slate-50">{fmtDate(selectedRecord.nextPayoutISO)}</div>
                    <div className="mt-1 text-xs text-faith-slate">Transfers route to finance owners after reconciliation checks.</div>
                  </div>
                  <div className="rounded-[14px] bg-[var(--fh-surface)] dark:bg-slate-800/50 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="text-[11px] uppercase tracking-wide text-faith-slate">Reconciliation</div>
                    <div className="mt-1 text-lg font-extrabold text-faith-ink dark:text-slate-50">{selectedRecord.reconciliationPct}%</div>
                    <div className="mt-2"><ProgressBar value={selectedRecord.reconciliationPct} tone={selectedRecord.reconciliationPct >= 90 ? "green" : "orange"} /></div>
                  </div>
                </div>
                <div className="rounded-[14px] bg-[var(--fh-surface)] dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-bold text-faith-ink dark:text-slate-50">Finance ownership</div>
                      <div className="mt-1 text-xs text-faith-slate">{selectedRecord.owner} · {selectedRecord.financeHealth} state</div>
                    </div>
                    <Pill tone={badgeToneForFinance(selectedRecord.financeHealth)}>{selectedRecord.financeHealth}</Pill>
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-faith-slate dark:text-slate-300">
                    <div className="rounded-xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-800">Transfer timing aligned to provider payout schedule</div>
                    <div className="rounded-xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-800">Internal finance notes available for restricted funds and emergency appeals</div>
                    <div className="rounded-xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-800">Audit-friendly ownership chain from donor experience to payout</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[14px] bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-soft transition">
              <SectionTitle
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Compliance and trust controls"
                subtitle="Legal copy, receipts, campaign accountability notes, and assets that explain where money is going."
              />
              <div className="mt-4 space-y-3">
                <div className="rounded-[14px] bg-[var(--fh-surface)] dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-bold text-faith-ink dark:text-slate-50">Active controls</div>
                    <Pill tone={selectedRecord.legalCopyReady && selectedRecord.accountabilityReady ? "good" : "warn"}>
                      {selectedRecord.legalCopyReady && selectedRecord.accountabilityReady ? "Ready" : "Review"}
                    </Pill>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between rounded-xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-800 text-sm">
                      <span>Legal copy & campaign explanation</span>
                      {selectedRecord.legalCopyReady ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Clock3 className="h-4 w-4 text-amber-500" />}
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-800 text-sm">
                      <span>Accountability notes & where-money-goes assets</span>
                      {selectedRecord.accountabilityReady ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Clock3 className="h-4 w-4 text-amber-500" />}
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-800 text-sm">
                      <span>Child-safe restrictions and privacy defaults</span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                  </div>
                </div>

                <div className="rounded-[14px] bg-[var(--fh-surface)] dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800 text-sm text-faith-slate dark:text-slate-300">
                  {selectedRecord.statusHint}
                </div>
              </div>
            </div>

            <div className="rounded-[14px] bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-soft transition">
              <SectionTitle
                icon={<Workflow className="h-5 w-5" />}
                title="Campaign lifecycle tools"
                subtitle="Draft, scheduled, active, paused, completed, archived, and duplicated giving campaigns."
              />
              <div className="mt-4 grid grid-cols-3 gap-3">
                <MetricCard label="Draft" value={String(lifecycleCounts.draft)} hint="Needs setup" tone="navy" />
                <MetricCard label="Scheduled" value={String(lifecycleCounts.scheduled)} hint="Timed launch" tone="orange" />
                <MetricCard label="Active" value={String(lifecycleCounts.active)} hint="Driving support" tone="green" />
                <MetricCard label="Paused" value={String(lifecycleCounts.paused)} hint="Awaiting changes" tone="orange" />
                <MetricCard label="Completed" value={String(lifecycleCounts.completed)} hint="Wrapped campaigns" tone="navy" />
                <MetricCard label="Archived" value={String(lifecycleCounts.archived)} hint="Retained history" tone="navy" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Btn tone="primary" onClick={() => setToast("Campaign activated")} left={<Zap className="h-4 w-4" />}>
                  Activate selected
                </Btn>
                <Btn tone="secondary" onClick={() => duplicateRecord(selectedRecord)} left={<Copy className="h-4 w-4" />}>
                  Duplicate selected
                </Btn>
                <Btn tone="ghost" onClick={() => setToast("Archive flow opened")} left={<Clock3 className="h-4 w-4" />}>
                  Archive flow
                </Btn>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Donor experience preview"
        subtitle="Provider giving destination preview for desktop and mobile surfaces."
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewMode("desktop")}
                className={cx(
                  "rounded-full px-3 py-1.5 text-xs font-semibold",
                  previewMode === "desktop" ? "text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
                )}
                style={previewMode === "desktop" ? { background: EV_NAVY } : undefined}
              >
                Desktop preview
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("mobile")}
                className={cx(
                  "rounded-full px-3 py-1.5 text-xs font-semibold",
                  previewMode === "mobile" ? "text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
                )}
                style={previewMode === "mobile" ? { background: EV_GREEN } : undefined}
              >
                Mobile preview
              </button>
            </div>
            {previewMode === "desktop" ? (
              <BrowserPreview
                record={selectedRecord}
                recurringDefault={recurringDefault}
                privacyWall={privacyWall}
                donorCopy={donorCopy}
              />
            ) : (
              <PhonePreview record={selectedRecord} recurringDefault={recurringDefault} privacyWall={privacyWall} />
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-[14px] bg-[var(--fh-surface)] dark:bg-slate-800/40 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
              <div className="text-sm font-bold text-faith-ink dark:text-slate-50">Preview notes</div>
              <div className="mt-3 space-y-3 text-sm text-faith-slate dark:text-slate-300">
                <div className="rounded-xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                  Suggested amounts, recurring defaults, donor privacy, and confirmation journeys are mirrored from the page controls.
                </div>
                <div className="rounded-xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                  Premium donor pages should feel warm and trustworthy, with clear evidence of where money goes and strong post-give reassurance.
                </div>
                <div className="rounded-xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                  Use Live Sessions, replay surfaces, events, and Beacon hooks to keep the giving journey connected to ministry moments.
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Btn tone="primary" onClick={() => setToast("Published donor page")} left={<CheckCircle2 className="h-4 w-4" />}>
                Publish donor page
              </Btn>
              <Btn tone="secondary" onClick={() => safeNav(ROUTES.beaconBuilder)} left={<Zap className="h-4 w-4" />}>
                Create Beacon boost
              </Btn>
              <Btn tone="ghost" onClick={() => safeNav(ROUTES.audienceNotifications)} left={<Bell className="h-4 w-4" />}>
                Send donor follow-up
              </Btn>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={insightsOpen}
        onClose={() => setInsightsOpen(false)}
        title="Donor insights"
        subtitle="Advanced donor analytics, campaign attribution, recurring health, and content influence."
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <MetricCard label="Net donor growth" value="+346" hint="Last 30 days" tone="green" />
              <MetricCard label="New recurring donors" value="+84" hint="Partner circle expansion" tone="orange" />
              <MetricCard label="Replay-influenced gifts" value="18%" hint="Post-live discovery contribution" tone="navy" />
              <MetricCard label="Beacon conversions" value="22%" hint="Promotion-assisted giving share" tone="orange" />
            </div>
            <div className="rounded-[14px] bg-[var(--fh-surface)] dark:bg-slate-800/40 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
              <div className="text-sm font-bold text-faith-ink dark:text-slate-50">Trend monitors</div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-xs font-semibold text-faith-slate">Donor growth</div>
                  <MiniLine values={donorGrowthSeries} tone="green" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-faith-slate">Recurring retention</div>
                  <MiniLine values={recurringRetentionSeries} tone="orange" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-faith-slate">Content influence</div>
                  <MiniLine values={contentInfluenceSeries} tone="navy" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[14px] bg-[var(--fh-surface)] dark:bg-slate-800/40 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
              <div className="text-sm font-bold text-faith-ink dark:text-slate-50">Top donor segments</div>
              <div className="mt-3 space-y-3">
                {[
                  ["First-time givers", 28, "Triggered by live giving moments and event entry points"],
                  ["Repeat donors", 41, "Strong response to follow-up journeys and replay reminders"],
                  ["Recurring supporters", 22, "Best-performing retention group and Beacon audience"],
                  ["High-intent viewers", 17, "Convert when replay and live prompts are both attached"],
                ].map(([label, value, hint]) => (
                  <div key={label as string} className="rounded-xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-bold text-faith-ink dark:text-slate-50">{label as string}</div>
                        <div className="mt-1 text-xs text-faith-slate">{hint as string}</div>
                      </div>
                      <div className="text-sm font-extrabold text-faith-ink dark:text-slate-50">{value as number}%</div>
                    </div>
                    <div className="mt-2"><ProgressBar value={value as number} tone={label === "Recurring supporters" ? "green" : "orange"} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        title={composerMode === "Crowdfund" ? "Charity crowdfund launcher" : `Create ${composerMode.toLowerCase()}`}
        subtitle="Premium setup with donor experience, trust, and connected conversion surfaces."
      >
        <CampaignComposer mode={composerMode} onClose={() => setComposerOpen(false)} />
      </Modal>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-[120] -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-2xl">
          {toast}
        </div>
      ) : null}
    </div>
  );
}













