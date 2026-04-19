// @ts-nocheck
"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  CircleDollarSign,
  Clock3,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  Filter,
  HandCoins,
  Landmark,
  Link2,
  MoreHorizontal,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { navigateWithRouter } from "@/navigation/routerNavigate";

/**
 * FaithHub — Wallet & Payouts
 * ------------------------------------
 * Premium Provider-side treasury surface for wallet visibility, payout methods,
 * transfer controls, settlement sources, compliance health, and reconciliation.
 *
 * Positioning
 * - Sits naturally after Donations & Funds () and Charity Crowdfunding Workbench ()
 *   inside the Events & Giving section.
 * - Gives providers one trusted page for moving money, reviewing settlement sources,
 *   and understanding payout readiness across donations, crowdfunds, events, and merchandise.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#0f172a";

const ROUTES = {
  providerDashboard: "/faithhub/provider/dashboard",
  donationsFunds: "/faithhub/provider/donations-funds",
  crowdfundingWorkbench: "/faithhub/provider/charity-crowdfund",
  eventsManager: "/faithhub/provider/events-manager",
  merchandiseManager: "/faithhub/provider/merchandise",
};

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  navigateWithRouter(url);
}

function fmtMoney(n: number, currency = "£") {
  return `${currency}${Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(n)}`;
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

function pct(value: number, total: number) {
  if (!total) return 0;
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

type Tone = "neutral" | "good" | "warn" | "danger" | "info";
type PreviewMode = "desktop" | "mobile";
type LedgerCategory = "Credit" | "Payout" | "Hold" | "Refund" | "Fee";
type LedgerStatus = "Settled" | "Pending" | "Processing" | "Failed" | "On hold";
type MethodStatus = "Active" | "Needs action" | "Pending verification" | "Internal";

type BalancePocket = {
  id: string;
  label: string;
  value: number;
  hint: string;
  tone: Tone;
};

type PayoutMethod = {
  id: string;
  label: string;
  kind: string;
  owner: string;
  status: MethodStatus;
  currency: string;
  cadence: string;
  lastAction: string;
  nextPayout: string;
  note: string;
};

type SettlementSource = {
  id: string;
  label: string;
  amount: number;
  share: number;
  hint: string;
  nextSweep: string;
  tone: Tone;
};

type HealthSignal = {
  id: string;
  label: string;
  value: string;
  hint: string;
  tone: Tone;
};

type LedgerItem = {
  id: string;
  title: string;
  category: LedgerCategory;
  status: LedgerStatus;
  source: string;
  amount: number;
  direction: "in" | "out";
  campus: string;
  dateISO: string;
  reference: string;
  destination?: string;
  note: string;
};

const KPI_STRIP = [
  {
    id: "available",
    label: "Available balance",
    value: fmtMoney(18420),
    hint: "Funds cleared and ready for transfer.",
    tone: "good" as Tone,
  },
  {
    id: "pending",
    label: "Pending payouts",
    value: fmtMoney(4860),
    hint: "Scheduled or processing disbursements.",
    tone: "info" as Tone,
  },
  {
    id: "holds",
    label: "Reserve / holds",
    value: fmtMoney(620),
    hint: "Chargeback, risk, or manual review reserve.",
    tone: "warn" as Tone,
  },
  {
    id: "failed",
    label: "Failed transfers",
    value: "1",
    hint: "One payout needs action before the next sweep.",
    tone: "danger" as Tone,
  },
  {
    id: "settled",
    label: "This month settled",
    value: fmtMoney(42980),
    hint: "Net settled across all active sources.",
    tone: "good" as Tone,
  },
  {
    id: "next",
    label: "Next payout",
    value: "Thu 14:00",
    hint: "Weekly treasury sweep for the primary bank account.",
    tone: "info" as Tone,
  },
];

const BALANCE_POCKETS: BalancePocket[] = [
  {
    id: "main",
    label: "Ministry operating wallet",
    value: 18420,
    hint: "Primary faith operations balance after reserves.",
    tone: "good",
  },
  {
    id: "crowdfund",
    label: "Crowdfund protected balance",
    value: 3920,
    hint: "Held until milestone release or approved beneficiary transfer.",
    tone: "info",
  },
  {
    id: "events",
    label: "Events clearing pocket",
    value: 1780,
    hint: "Registrations and live-linked event payments waiting for sweep.",
    tone: "neutral",
  },
  {
    id: "merch",
    label: "FaithMart merchandise pocket",
    value: 1120,
    hint: "Merch proceeds waiting for the next storefront settlement.",
    tone: "warn",
  },
];

const PAYOUT_METHODS: PayoutMethod[] = [
  {
    id: "pm-bank-main",
    label: "Main ministry current account",
    kind: "Bank account",
    owner: "Finance Office",
    status: "Active",
    currency: "GBP / UGX",
    cadence: "Weekly auto payout",
    lastAction: "Last paid Tue 09:12",
    nextPayout: "Thu 14:00",
    note: "Primary destination for cleared donations, events, and merchandise settlements.",
  },
  {
    id: "pm-mobile",
    label: "Outreach quick disbursement line",
    kind: "Mobile money",
    owner: "Outreach Team",
    status: "Needs action",
    currency: "UGX",
    cadence: "Manual / campaign-led",
    lastAction: "Last used Mon 17:40",
    nextPayout: "Awaiting approval",
    note: "Best for emergency outreach disbursements and time-sensitive charity releases.",
  },
  {
    id: "pm-usd",
    label: "International missions settlement",
    kind: "USD settlement",
    owner: "Global Missions",
    status: "Pending verification",
    currency: "USD",
    cadence: "Monthly",
    lastAction: "Verification submitted",
    nextPayout: "Blocked pending KYC",
    note: "Use for cross-border support, mission trips, and externally routed approved transfers.",
  },
  {
    id: "pm-reserve",
    label: "Internal reserve wallet",
    kind: "Reserve pool",
    owner: "Platform rules",
    status: "Internal",
    currency: "Mixed",
    cadence: "Automatic",
    lastAction: "Live reserve active",
    nextPayout: "N/A",
    note: "Holds reserve funds for chargeback exposure, refunds, and risk policy protection.",
  },
];

const SETTLEMENT_SOURCES: SettlementSource[] = [
  {
    id: "src-donations",
    label: "Donations & Funds",
    amount: 20120,
    share: 48,
    hint: "General giving, recurring support, and ministry-specific funds.",
    nextSweep: "Thu 14:00",
    tone: "good",
  },
  {
    id: "src-crowdfund",
    label: "Charity Crowdfund",
    amount: 7560,
    share: 18,
    hint: "Milestone-based charity inflows protected by campaign governance.",
    nextSweep: "Milestone release",
    tone: "info",
  },
  {
    id: "src-events",
    label: "Events registrations",
    amount: 5860,
    share: 14,
    hint: "Paid registrations, event-linked add-ons, and venue-linked passes.",
    nextSweep: "Wed 18:00",
    tone: "neutral",
  },
  {
    id: "src-merch",
    label: "FaithMart merchandise",
    amount: 5040,
    share: 12,
    hint: "Merchandise, bundles, and live-linked product orders.",
    nextSweep: "Fri 11:00",
    tone: "warn",
  },
  {
    id: "src-supporter",
    label: "Supporter memberships",
    amount: 3380,
    share: 8,
    hint: "Ongoing support tiers and premium access memberships.",
    nextSweep: "Thu 14:00",
    tone: "good",
  },
];

const HEALTH_SIGNALS: HealthSignal[] = [
  {
    id: "success-rate",
    label: "Payout success rate",
    value: "98.6%",
    hint: "Healthy payout reliability across all active methods this month.",
    tone: "good",
  },
  {
    id: "settlement-time",
    label: "Average settlement time",
    value: "1.2 days",
    hint: "Median time from cleared inflow to completed payout destination.",
    tone: "info",
  },
  {
    id: "coverage",
    label: "Reconciliation coverage",
    value: "100%",
    hint: "Every cleared movement is tied back to a source object and statement line.",
    tone: "good",
  },
  {
    id: "risk",
    label: "Reserve exposure",
    value: "0.7%",
    hint: "Low chargeback and reversal exposure compared with settled volume.",
    tone: "warn",
  },
  {
    id: "identity",
    label: "KYC / finance readiness",
    value: "1 blocker",
    hint: "International missions payout method still needs verification before use.",
    tone: "danger",
  },
];

const LEDGER: LedgerItem[] = [
  {
    id: "tx-1001",
    title: "Sunday giving batch",
    category: "Credit",
    status: "Settled",
    source: "Donations & Funds",
    amount: 8240,
    direction: "in",
    campus: "Main campus",
    dateISO: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    reference: "DON-2026-1042",
    note: "Includes general tithe, missions, and benevolence allocations from the Sunday service.",
  },
  {
    id: "tx-1002",
    title: "Weekly treasury sweep",
    category: "Payout",
    status: "Processing",
    source: "Primary wallet",
    amount: 6500,
    direction: "out",
    campus: "Finance office",
    dateISO: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    reference: "PAYOUT-2026-221",
    destination: "Main ministry current account",
    note: "Auto-scheduled weekly payout covering cleared donations and event proceeds.",
  },
  {
    id: "tx-1003",
    title: "Youth camp scholarship momentum",
    category: "Credit",
    status: "Pending",
    source: "Charity Crowdfund",
    amount: 2180,
    direction: "in",
    campus: "Youth ministry",
    dateISO: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    reference: "CF-2026-883",
    note: "Pending milestone release review before protected crowdfund balance becomes transferable.",
  },
  {
    id: "tx-1004",
    title: "Chargeback review reserve",
    category: "Hold",
    status: "On hold",
    source: "Reserve wallet",
    amount: 320,
    direction: "out",
    campus: "Platform risk",
    dateISO: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    reference: "HOLD-2026-041",
    note: "Temporary reserve applied to a disputed ticket purchase and related refund exposure.",
  },
  {
    id: "tx-1005",
    title: "Prayer conference registrations",
    category: "Credit",
    status: "Settled",
    source: "Events Manager",
    amount: 1740,
    direction: "in",
    campus: "Events team",
    dateISO: new Date(Date.now() - 1000 * 60 * 310).toISOString(),
    reference: "EVT-2026-190",
    note: "Event registration inflow already cleared into the events settlement pocket.",
  },
  {
    id: "tx-1006",
    title: "FaithMart community hoodie settlement",
    category: "Payout",
    status: "Settled",
    source: "Merchandise",
    amount: 1120,
    direction: "out",
    campus: "FaithMart",
    dateISO: new Date(Date.now() - 1000 * 60 * 470).toISOString(),
    reference: "MCH-2026-058",
    destination: "Main ministry current account",
    note: "Merchandise revenue sweep routed from the storefront clearing balance.",
  },
  {
    id: "tx-1007",
    title: "Event ticket refund",
    category: "Refund",
    status: "Settled",
    source: "Events Manager",
    amount: 95,
    direction: "out",
    campus: "Events team",
    dateISO: new Date(Date.now() - 1000 * 60 * 540).toISOString(),
    reference: "REF-2026-017",
    note: "Refund completed after a cancelled registration and statement updated automatically.",
  },
  {
    id: "tx-1008",
    title: "International missions payout",
    category: "Payout",
    status: "Failed",
    source: "Global missions",
    amount: 410,
    direction: "out",
    campus: "Missions office",
    dateISO: new Date(Date.now() - 1000 * 60 * 610).toISOString(),
    reference: "PAYOUT-2026-219",
    destination: "International missions settlement",
    note: "Transfer failed because the destination account still needs verification and treasury approval.",
  },
  {
    id: "tx-1009",
    title: "Platform processing fees",
    category: "Fee",
    status: "Settled",
    source: "Platform fees",
    amount: 186,
    direction: "out",
    campus: "Platform",
    dateISO: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    reference: "FEE-2026-112",
    note: "Aggregated payment processing and treasury routing fees for the current cycle.",
  },
];

const RECON_BLOCKS = [
  {
    id: "recon-1",
    label: "Statement export",
    hint: "CSV, PDF, and finance-ready bank statement bundles.",
    cta: "Export month",
  },
  {
    id: "recon-2",
    label: "Campus reconciliation",
    hint: "Split visibility by campus, ministry owner, or source object.",
    cta: "Open splits",
  },
  {
    id: "recon-3",
    label: "Audit package",
    hint: "Evidence trail for holds, failed payouts, and release approvals.",
    cta: "Build pack",
  },
];

function tonePillClasses(tone: Tone) {
  return tone === "good"
    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
    : tone === "warn"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : tone === "danger"
        ? "bg-rose-50 text-rose-800 border-rose-200"
        : tone === "info"
          ? "bg-sky-50 text-sky-800 border-sky-200"
          : "bg-white text-slate-700 border-slate-200";
}

function Pill({ text, tone = "neutral", icon }: { text: string; tone?: Tone; icon?: React.ReactNode }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold",
        tonePillClasses(tone),
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
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
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
  className,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl border border-transparent px-4 py-2 text-[12px] font-semibold text-white transition-opacity hover:opacity-95",
        className,
      )}
      style={{ background: EV_ORANGE }}
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
        "rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[13px] font-semibold text-slate-900">{title}</div>
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-[760px] border-l border-slate-200 bg-white shadow-2xl">
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-slate-900">{title}</div>
                {subtitle ? <div className="mt-0.5 text-[11px] text-slate-500">{subtitle}</div> : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              >
                ×
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

function SectionStat({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint: string;
  tone?: Tone;
}) {
  return (
    <div
      className={cx(
        "rounded-3xl border px-4 py-4",
        tone === "good"
          ? "border-emerald-100 bg-emerald-50/70"
          : tone === "warn"
            ? "border-amber-100 bg-amber-50/70"
            : tone === "danger"
              ? "border-rose-100 bg-rose-50/70"
              : tone === "info"
                ? "border-sky-100 bg-sky-50/70"
                : "border-slate-200 bg-white",
      )}
    >
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</div>
      <div className="mt-2 text-[18px] font-black text-slate-900">{value}</div>
      <div className="mt-1 text-[11px] leading-5 text-slate-500">{hint}</div>
    </div>
  );
}

function MiniBar({ value, total, color = EV_GREEN }: { value: number; total: number; color?: string }) {
  return (
    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{ width: `${pct(value, total)}%`, background: color }}
      />
    </div>
  );
}

function PreviewRail({ mode, onModeChange }: { mode: PreviewMode; onModeChange: (v: PreviewMode) => void }) {
  return (
    <Card
      title="Preview + payout experience"
      subtitle="Desktop and mobile treasury previews so providers can see how cash movement feels before finance actions are committed."
      right={
        <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
          <button
            type="button"
            onClick={() => onModeChange("desktop")}
            className={cx(
              "rounded-full px-3 py-1 text-[11px] font-semibold transition-colors",
              mode === "desktop" ? "text-white" : "text-slate-600 hover:bg-slate-50",
            )}
            style={mode === "desktop" ? { background: EV_GREEN } : undefined}
          >
            Desktop
          </button>
          <button
            type="button"
            onClick={() => onModeChange("mobile")}
            className={cx(
              "rounded-full px-3 py-1 text-[11px] font-semibold transition-colors",
              mode === "mobile" ? "text-white" : "text-slate-600 hover:bg-slate-50",
            )}
            style={mode === "mobile" ? { background: EV_GREEN } : undefined}
          >
            Mobile
          </button>
        </div>
      }
    >
      {mode === "desktop" ? (
        <div className="space-y-3">
          <div className="rounded-[28px] bg-slate-950 p-4 text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold">
              <Wallet className="h-3.5 w-3.5" /> Treasury desk
            </div>
            <div className="mt-4 text-[28px] font-black">{fmtMoney(18420)}</div>
            <div className="mt-1 text-[12px] text-slate-300">Available to transfer • Trust-ready 96%</div>
            <div className="mt-4 h-3 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: "74%", background: EV_GREEN }} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[12px]">
              <div className="rounded-2xl bg-white/5 p-3">
                <div className="text-slate-400">Next payout</div>
                <div className="mt-1 font-bold">Thu 14:00</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-3">
                <div className="text-slate-400">Primary method</div>
                <div className="mt-1 font-bold">Main bank account</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Statement view</div>
              <div className="mt-2 text-[18px] font-black text-slate-900">April settlement bundle</div>
              <div className="mt-1 text-[11px] text-slate-500">CSV, PDF, and audit notes packaged for finance review.</div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Treasury actions</div>
              <div className="mt-2 flex gap-2">
                <span className="rounded-full px-3 py-1 text-[11px] font-semibold text-white" style={{ background: EV_GREEN }}>
                  Transfer now
                </span>
                <span className="rounded-full px-3 py-1 text-[11px] font-semibold text-white" style={{ background: EV_ORANGE }}>
                  Add method
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-end justify-center gap-6">
          <div className="w-[230px] rounded-[44px] bg-slate-950 p-4 shadow-2xl">
            <div className="rounded-[34px] bg-white px-4 py-5">
              <div className="mx-auto h-2 w-20 rounded-full bg-slate-300" />
              <div className="mt-5 rounded-[26px] bg-slate-950 px-4 py-4 text-white">
                <div className="text-[11px] text-slate-400">Available balance</div>
                <div className="mt-1 text-[24px] font-black">{fmtMoney(18420)}</div>
                <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: "72%", background: EV_GREEN }} />
                </div>
              </div>
              <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Next payout</div>
                <div className="mt-1 text-[15px] font-black text-slate-900">Thu 14:00</div>
                <div className="mt-1 text-[11px] text-slate-500">Main ministry current account</div>
              </div>
              <button
                type="button"
                className="mt-4 w-full rounded-full px-4 py-3 text-[16px] font-bold text-white"
                style={{ background: EV_GREEN }}
                onClick={() => safeNav("/faithhub/provider/wallet-payouts")}>
                Transfer now
              </button>
              <button
                type="button"
                className="mt-3 w-full rounded-full px-4 py-3 text-[16px] font-bold text-white"
                style={{ background: EV_ORANGE }}
                onClick={() => safeNav("/faithhub/provider/wallet-payouts")}>
                Add payout method
              </button>
            </div>
          </div>
          <div className="flex-1 max-w-[240px] space-y-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-3">
              <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Mobile finance cues</div>
              <div className="mt-2 text-[13px] font-semibold text-slate-900">Low-friction treasury actions for finance leads and campus admins.</div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-3">
              <div className="text-[12px] font-semibold text-slate-900">Trust signals</div>
              <div className="mt-1 text-[11px] text-slate-500">Verification, reserves, and payout health surfaced before money moves.</div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function WalletAndPayoutsPage() {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | LedgerCategory | "Failed">("All");
  const [transferOpen, setTransferOpen] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<LedgerItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [transferMethod, setTransferMethod] = useState(PAYOUT_METHODS[0].id);
  const [transferAmount, setTransferAmount] = useState("2500");
  const [transferNote, setTransferNote] = useState("Weekly treasury sweep");

  const filteredLedger = useMemo(() => {
    return LEDGER.filter((tx) => {
      const matchesFilter =
        filter === "All"
          ? true
          : filter === "Failed"
            ? tx.status === "Failed"
            : tx.category === filter;
      const matchesQuery = !query.trim()
        ? true
        : [tx.title, tx.source, tx.reference, tx.campus, tx.destination || ""]
            .join(" ")
            .toLowerCase()
            .includes(query.trim().toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  const totalIn = useMemo(
    () => filteredLedger.filter((tx) => tx.direction === "in").reduce((sum, tx) => sum + tx.amount, 0),
    [filteredLedger],
  );
  const totalOut = useMemo(
    () => filteredLedger.filter((tx) => tx.direction === "out").reduce((sum, tx) => sum + tx.amount, 0),
    [filteredLedger],
  );

  function showToast(message: string) {
    setToast(message);
    if (typeof window !== "undefined") {
      window.clearTimeout((showToast as unknown as { __t?: number }).__t);
      (showToast as unknown as { __t?: number }).__t = window.setTimeout(() => {
        setToast(null);
      }, 2600);
    }
  }

  function exportStatement() {
    const lines = [
      "FaithHub Wallet & Payouts Statement",
      "---------------------------------",
      `Generated: ${new Date().toLocaleString()}`,
      `Filter: ${filter}`,
      `Search: ${query || "(none)"}`,
      "",
      ...filteredLedger.map((tx) =>
        [
          tx.id,
          tx.title,
          tx.category,
          tx.status,
          tx.direction === "in" ? `+${fmtMoney(tx.amount)}` : `-${fmtMoney(tx.amount)}`,
          tx.source,
          tx.reference,
          fmtDateTime(tx.dateISO),
        ].join(" | "),
      ),
    ].join("\n");

    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "faithhub-wallet-statement.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("Statement exported.");
  }

  async function copyReference(ref: string) {
    const ok = await copyText(ref);
    showToast(ok ? "Reference copied." : "Could not copy reference.");
  }

  const selectedMethod = PAYOUT_METHODS.find((m) => m.id === transferMethod) || PAYOUT_METHODS[0];

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-slate-900">
      <div className="mx-auto max-w-[1600px] p-4 md:p-6 space-y-4">
        <div className="rounded-[32px] border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
          <div className="grid gap-4 xl:grid-cols-[1.45fr_0.75fr]">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Events & Giving · Treasury Operations
              </div>
              <h1 className="text-[28px] font-black leading-[1.04] tracking-[-0.03em] text-slate-900 dark:text-slate-100 sm:text-[34px] lg:text-[40px]">
                Move ministry funds, reserves, and payouts with premium financial control.
              </h1>
              <p className="mt-3 max-w-[900px] text-[15px] leading-7 text-slate-600">
                A dedicated wallet and payouts command surface for donations, charity crowdfunding, event registrations,
                supporter memberships, and FaithMart-linked revenue — with finance trust, payout readiness, and reconciliation all in one place.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Pill text="Treasury-ready" tone="good" icon={<BadgeCheck className="h-3.5 w-3.5" />} />
                <Pill text="Multi-source settlement" tone="info" icon={<CircleDollarSign className="h-3.5 w-3.5" />} />
                <Pill text="Donations + Events + Merch" tone="warn" icon={<Link2 className="h-3.5 w-3.5" />} />
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Command actions
              </div>
              <div className="mt-1 text-[16px] font-black text-slate-900">Wallet control</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <PrimaryButton onClick={() => setTransferOpen(true)}>
                  <ArrowUpRight className="h-4 w-4" /> Transfer now
                </PrimaryButton>
                <SoftButton onClick={() => setMethodOpen(true)}>
                  <Plus className="h-4 w-4" /> Add payout method
                </SoftButton>
                <SoftButton onClick={exportStatement}>
                  <Download className="h-4 w-4" /> Export statement
                </SoftButton>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Linked finance pages</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button onClick={() => safeNav(ROUTES.donationsFunds)} className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50">
                      Donations & Funds
                    </button>
                    <button onClick={() => safeNav(ROUTES.crowdfundingWorkbench)} className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50">
                      Charity Crowdfund
                    </button>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Next review</div>
                  <div className="mt-2 text-[14px] font-black text-slate-900">International missions payout</div>
                  <div className="mt-1 text-[11px] text-slate-500">KYC blocker before the next cross-border release.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          {KPI_STRIP.map((item) => (
            <SectionStat key={item.id} label={item.label} value={item.value} hint={item.hint} tone={item.tone} />
          ))}
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="text-[16px] font-black text-slate-900">Search and filter wallet activity</div>
              <div className="mt-1 text-[13px] text-slate-500">Find payouts, holds, settlement lines, finance notes, or source references fast.</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["All", "Credit", "Payout", "Hold", "Refund", "Fee", "Failed"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={cx(
                    "rounded-full border px-3 py-2 text-[11px] font-semibold transition-colors",
                    filter === item ? "text-white border-transparent" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                  )}
                  style={filter === item ? { background: item === "Failed" ? EV_ORANGE : EV_GREEN } : undefined}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_180px]">
            <div className="rounded-[24px] border border-slate-200 bg-white px-4 py-3 flex items-center gap-3">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search payout references, campuses, methods, notes, or source objects"
                className="w-full bg-transparent text-[13px] text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
            <button className="rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-[12px] font-semibold text-slate-700 inline-flex items-center justify-center gap-2 hover:bg-slate-50" onClick={() => safeNav("/faithhub/provider/wallet-payouts")}>
              <Filter className="h-4 w-4" /> More filters
            </button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.25fr_1.05fr_0.95fr]">
          <Card
            title="Wallet command center"
            subtitle="Premium visibility into cleared balances, protected campaign money, reserve logic, and immediate payout availability."
            right={<Pill text="Trust 96%" tone="good" />}
          >
            <div className="space-y-3">
              <div className="rounded-[28px] bg-slate-950 p-4 text-white">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Primary available balance</div>
                    <div className="mt-2 text-[34px] font-black">{fmtMoney(18420)}</div>
                    <div className="mt-1 text-[12px] text-slate-300">Cleared and transfer-ready after reserve protection.</div>
                  </div>
                  <div className="rounded-2xl bg-white/5 px-4 py-3">
                    <div className="text-[11px] text-slate-400">Reserve ratio</div>
                    <div className="mt-1 text-[20px] font-black">7%</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/5 p-3">
                    <div className="text-[11px] text-slate-400">Pending release</div>
                    <div className="mt-1 text-[20px] font-black">{fmtMoney(4860)}</div>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3">
                    <div className="text-[11px] text-slate-400">Protected crowdfund</div>
                    <div className="mt-1 text-[20px] font-black">{fmtMoney(3920)}</div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {BALANCE_POCKETS.map((pocket) => (
                  <div key={pocket.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[12px] font-semibold text-slate-900">{pocket.label}</div>
                        <div className="mt-1 text-[22px] font-black text-slate-900">{fmtMoney(pocket.value)}</div>
                      </div>
                      <Pill text={pocket.tone === "good" ? "Healthy" : pocket.tone === "warn" ? "Watch" : pocket.tone === "info" ? "Protected" : "Live"} tone={pocket.tone} />
                    </div>
                    <div className="mt-2 text-[11px] leading-5 text-slate-500">{pocket.hint}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card
            title="Payout method vault"
            subtitle="Connected treasury destinations, verification states, ownership, and payout cadence in one premium method manager."
            right={<SoftButton onClick={() => setMethodOpen(true)}><Plus className="h-4 w-4" /> Add method</SoftButton>}
          >
            <div className="space-y-3">
              {PAYOUT_METHODS.map((method) => (
                <div key={method.id} className="rounded-[24px] border border-slate-200 bg-white p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-950 text-white">
                          {method.kind === "Bank account" ? <Landmark className="h-4 w-4" /> : method.kind === "Mobile money" ? <Wallet className="h-4 w-4" /> : method.kind === "USD settlement" ? <Banknote className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-slate-900">{method.label}</div>
                          <div className="text-[11px] text-slate-500">{method.kind} · {method.owner}</div>
                        </div>
                      </div>
                    </div>
                    <Pill
                      text={method.status}
                      tone={method.status === "Active" ? "good" : method.status === "Needs action" ? "warn" : method.status === "Pending verification" ? "danger" : "info"}
                    />
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                      <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Cadence</div>
                      <div className="mt-1 text-[12px] font-semibold text-slate-900">{method.cadence}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                      <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Currency</div>
                      <div className="mt-1 text-[12px] font-semibold text-slate-900">{method.currency}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-slate-500">
                    <div>{method.lastAction}</div>
                    <div className="font-semibold text-slate-700">{method.nextPayout}</div>
                  </div>
                  <div className="mt-2 text-[11px] leading-5 text-slate-500">{method.note}</div>
                </div>
              ))}
            </div>
          </Card>

          <PreviewRail mode={previewMode} onModeChange={setPreviewMode} />

          <Card
            title="Transfer schedule + safeguards"
            subtitle="Payout timing, minimums, reserves, and failure-handling rules that keep the ministry treasury calm and explainable."
          >
            <div className="space-y-3">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[12px] font-semibold text-slate-900">Primary auto payout</div>
                    <div className="mt-1 text-[22px] font-black text-slate-900">Thursday · 14:00</div>
                    <div className="mt-1 text-[11px] text-slate-500">Weekly treasury sweep into the main ministry current account.</div>
                  </div>
                  <Pill text="Auto" tone="good" icon={<RefreshCcw className="h-3.5 w-3.5" />} />
                </div>
              </div>
              <div className="grid gap-2">
                {[
                  { label: "Minimum transfer threshold", value: fmtMoney(100), hint: "Below this amount, funds stay in the wallet until the next eligible sweep." },
                  { label: "Reserve protection", value: "7%", hint: "Automatically held for refunds, disputes, and policy-triggered review windows." },
                  { label: "Crowdfund release policy", value: "Milestone-based", hint: "Charity campaigns can be locked until beneficiary proof or approval milestones are satisfied." },
                  { label: "Failure fallback", value: "Hold + notify", hint: "If a payout fails, the amount returns to a protected pending state until resolved." },
                ].map((row) => (
                  <div key={row.label} className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[12px] font-semibold text-slate-900">{row.label}</div>
                        <div className="mt-1 text-[11px] leading-5 text-slate-500">{row.hint}</div>
                      </div>
                      <div className="shrink-0 rounded-full bg-slate-950 px-3 py-1 text-[11px] font-semibold text-white">{row.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card
            title="Settlement sources + bridge"
            subtitle="See how wallet value is being generated across giving, charity campaigns, events, memberships, and merchandise."
          >
            <div className="space-y-3">
              {SETTLEMENT_SOURCES.map((source) => (
                <div key={source.id} className="rounded-[24px] border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[13px] font-semibold text-slate-900">{source.label}</div>
                      <div className="mt-1 text-[11px] leading-5 text-slate-500">{source.hint}</div>
                    </div>
                    <Pill text={`${source.share}%`} tone={source.tone} />
                  </div>
                  <div className="mt-3 text-[22px] font-black text-slate-900">{fmtMoney(source.amount)}</div>
                  <div className="mt-2"><MiniBar value={source.share} total={100} color={source.tone === "warn" ? EV_ORANGE : EV_GREEN} /></div>
                  <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-slate-500">
                    <span>Share of current settlement mix</span>
                    <span className="font-semibold text-slate-700">Next sweep: {source.nextSweep}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="Compliance + payout health"
            subtitle="Verification, reserve, and finance-quality signals that protect trust before any money leaves the wallet."
          >
            <div className="space-y-3">
              {HEALTH_SIGNALS.map((signal) => (
                <div key={signal.id} className="rounded-[24px] border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[12px] font-semibold text-slate-900">{signal.label}</div>
                      <div className="mt-1 text-[11px] leading-5 text-slate-500">{signal.hint}</div>
                    </div>
                    <Pill text={signal.value} tone={signal.tone} />
                  </div>
                </div>
              ))}
              <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-700" />
                  <div>
                    <div className="text-[12px] font-semibold text-amber-900">One payout method needs attention</div>
                    <div className="mt-1 text-[11px] leading-5 text-amber-800">
                      The international missions settlement account cannot be used until identity checks and beneficiary verification are completed.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card
            title="Transaction ledger"
            subtitle="A premium money movement table for credits, payouts, holds, refunds, and fees with finance-ready context."
            right={
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Filtered totals</div>
                <div className="mt-1 text-[12px] font-semibold text-slate-700">+{fmtMoney(totalIn)} / -{fmtMoney(totalOut)}</div>
              </div>
            }
            className="xl:col-span-2"
          >
            <div className="space-y-2">
              {filteredLedger.map((tx) => (
                <button
                  key={tx.id}
                  type="button"
                  onClick={() => setSelectedTx(tx)}
                  className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                          {tx.category === "Credit" ? <ArrowDownLeft className="h-4 w-4" /> : tx.category === "Payout" ? <ArrowUpRight className="h-4 w-4" /> : tx.category === "Refund" ? <RefreshCcw className="h-4 w-4" /> : tx.category === "Fee" ? <CreditCard className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold text-slate-900 truncate">{tx.title}</div>
                          <div className="text-[11px] text-slate-500 truncate">{tx.source} · {tx.reference} · {tx.campus}</div>
                        </div>
                      </div>
                      <div className="mt-2 text-[11px] leading-5 text-slate-500 line-clamp-2">{tx.note}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                      <div className="text-right">
                        <div className={cx("text-[16px] font-black", tx.direction === "in" ? "text-emerald-600" : "text-slate-900")}>
                          {tx.direction === "in" ? `+${fmtMoney(tx.amount)}` : `-${fmtMoney(tx.amount)}`}
                        </div>
                        <div className="text-[11px] text-slate-500">{fmtDateTime(tx.dateISO)}</div>
                      </div>
                      <Pill
                        text={tx.status}
                        tone={tx.status === "Settled" ? "good" : tx.status === "Pending" || tx.status === "Processing" ? "info" : tx.status === "On hold" ? "warn" : "danger"}
                      />
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </button>
              ))}
              {!filteredLedger.length ? (
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
                  <div className="text-[13px] font-semibold text-slate-900">No wallet movements match the current filter.</div>
                  <div className="mt-1 text-[11px] text-slate-500">Try a different category or clear the search query.</div>
                </div>
              ) : null}
            </div>
          </Card>

          <Card
            title="Reconciliation + exports"
            subtitle="Finance tooling for statements, splits, audit bundles, and payout transparency across the institution."
          >
            <div className="space-y-3">
              {RECON_BLOCKS.map((block) => (
                <div key={block.id} className="rounded-[24px] border border-slate-200 bg-white p-4">
                  <div className="text-[13px] font-semibold text-slate-900">{block.label}</div>
                  <div className="mt-1 text-[11px] leading-5 text-slate-500">{block.hint}</div>
                  <button className="mt-3 rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50" onClick={() => safeNav("/faithhub/provider/wallet-payouts")}>
                    {block.cta}
                  </button>
                </div>
              ))}
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="text-[12px] font-semibold text-slate-900">Finance note</div>
                <div className="mt-1 text-[11px] leading-5 text-slate-500">
                  Wallet and payouts should stay closely linked to Donations & Funds, Charity Crowdfunding, Events Manager,
                  and Merchandise Manager so money movement remains explainable from source to statement.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Drawer
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        title="Transfer now"
        subtitle="Move cleared wallet funds into a verified payout method with finance-safe notes and review context."
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card title="Transfer destination" subtitle="Choose where this payout should settle.">
              <div className="space-y-2">
                {PAYOUT_METHODS.filter((m) => m.status !== "Internal").map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setTransferMethod(method.id)}
                    className={cx(
                      "w-full rounded-[22px] border px-4 py-3 text-left transition-colors",
                      transferMethod === method.id
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-slate-200 bg-white hover:bg-slate-50",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-semibold text-slate-900">{method.label}</div>
                        <div className="mt-1 text-[11px] text-slate-500">{method.kind} · {method.currency}</div>
                      </div>
                      <Pill
                        text={method.status}
                        tone={method.status === "Active" ? "good" : method.status === "Needs action" ? "warn" : "danger"}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <Card title="Transfer details" subtitle="Set amount and treasury note.">
              <div className="space-y-3">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Available to move</div>
                  <div className="mt-1 text-[28px] font-black text-slate-900">{fmtMoney(18420)}</div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-700">Amount</div>
                  <input
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value.replace(/[^0-9]/g, ""))}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-700">Transfer note</div>
                  <textarea
                    rows={4}
                    value={transferNote}
                    onChange={(e) => setTransferNote(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                  <div className="text-[12px] font-semibold text-slate-900">Review summary</div>
                  <div className="mt-2 text-[11px] text-slate-500 leading-5">
                    {fmtMoney(Number(transferAmount || 0))} will be routed to <span className="font-semibold text-slate-900">{selectedMethod.label}</span>.
                    Any method with unresolved blockers will stay in review until cleared by finance or compliance.
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <SoftButton onClick={() => setTransferOpen(false)}>Cancel</SoftButton>
            <PrimaryButton
              onClick={() => {
                setTransferOpen(false);
                showToast(`Transfer queued to ${selectedMethod.label}.`);
              }}
            >
              <ArrowUpRight className="h-4 w-4" /> Queue transfer
            </PrimaryButton>
          </div>
        </div>
      </Drawer>

      <Drawer
        open={methodOpen}
        onClose={() => setMethodOpen(false)}
        title="Add payout method"
        subtitle="Connect new treasury destinations for local or international settlement."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: "Bank account",
              hint: "Best for main treasury sweeps, finance oversight, and predictable weekly payouts.",
              icon: <Landmark className="h-5 w-5" />,
              tone: EV_GREEN,
            },
            {
              title: "Mobile money",
              hint: "Fast local disbursements for outreach, benevolence, or on-the-ground campaign releases.",
              icon: <Wallet className="h-5 w-5" />,
              tone: EV_ORANGE,
            },
            {
              title: "USD / international settlement",
              hint: "Use for cross-border ministry support, mission funds, and approved international payouts.",
              icon: <Banknote className="h-5 w-5" />,
              tone: EV_NAVY,
            },
            {
              title: "Internal reserve wallet",
              hint: "Create a governed internal hold pool for special campaigns, reserves, or manual approvals.",
              icon: <ShieldCheck className="h-5 w-5" />,
              tone: EV_GREY,
            },
          ].map((card) => (
            <div key={card.title} className="rounded-[28px] border border-slate-200 bg-white p-5">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ background: card.tone }}>
                {card.icon}
              </div>
              <div className="mt-4 text-[16px] font-black text-slate-900">{card.title}</div>
              <div className="mt-2 text-[12px] leading-6 text-slate-500">{card.hint}</div>
              <button
                type="button"
                onClick={() => {
                  setMethodOpen(false);
                  showToast(`${card.title} flow opened.`);
                }}
                className="mt-4 rounded-full border border-slate-200 px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                Start setup
              </button>
            </div>
          ))}
        </div>
      </Drawer>

      <Drawer
        open={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        title={selectedTx?.title || "Transaction details"}
        subtitle={selectedTx ? `${selectedTx.reference} · ${selectedTx.source}` : undefined}
      >
        {selectedTx ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card title="Movement summary" subtitle="Finance-ready context for the selected wallet line.">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[12px] font-semibold text-slate-700">Amount</div>
                    <div className={cx("text-[24px] font-black", selectedTx.direction === "in" ? "text-emerald-600" : "text-slate-900")}>
                      {selectedTx.direction === "in" ? `+${fmtMoney(selectedTx.amount)}` : `-${fmtMoney(selectedTx.amount)}`}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[12px] font-semibold text-slate-700">Status</div>
                    <Pill
                      text={selectedTx.status}
                      tone={selectedTx.status === "Settled" ? "good" : selectedTx.status === "Pending" || selectedTx.status === "Processing" ? "info" : selectedTx.status === "On hold" ? "warn" : "danger"}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[12px] font-semibold text-slate-700">Category</div>
                    <div className="text-[12px] font-semibold text-slate-900">{selectedTx.category}</div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[12px] font-semibold text-slate-700">Campus / owner</div>
                    <div className="text-[12px] font-semibold text-slate-900">{selectedTx.campus}</div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[12px] font-semibold text-slate-700">Timestamp</div>
                    <div className="text-[12px] font-semibold text-slate-900">{fmtDateTime(selectedTx.dateISO)}</div>
                  </div>
                </div>
              </Card>
              <Card title="Reference + next action" subtitle="Useful links for operations and finance follow-up.">
                <div className="space-y-3">
                  <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Reference</div>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <div className="text-[13px] font-semibold text-slate-900">{selectedTx.reference}</div>
                      <button
                        type="button"
                        onClick={() => copyReference(selectedTx.reference)}
                        className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-white"
                      >
                        <Copy className="mr-1 inline h-3.5 w-3.5" /> Copy
                      </button>
                    </div>
                  </div>
                  {selectedTx.destination ? (
                    <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Destination</div>
                      <div className="mt-1 text-[13px] font-semibold text-slate-900">{selectedTx.destination}</div>
                    </div>
                  ) : null}
                  <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-3">
                    <div className="text-[12px] font-semibold text-slate-900">Operational note</div>
                    <div className="mt-1 text-[12px] leading-6 text-slate-500">{selectedTx.note}</div>
                  </div>
                </div>
              </Card>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <SoftButton onClick={() => setSelectedTx(null)}>Close</SoftButton>
              <SoftButton onClick={() => showToast("Source object opened.")}>
                <ExternalLink className="h-4 w-4" /> Open source object
              </SoftButton>
            </div>
          </div>
        ) : null}
      </Drawer>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-[140] -translate-x-1/2 rounded-full bg-slate-950 px-4 py-2 text-[12px] font-semibold text-white shadow-2xl">
          {toast}
        </div>
      ) : null}
    </div>
  );
}





