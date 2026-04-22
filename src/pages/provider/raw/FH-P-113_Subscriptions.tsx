// @ts-nocheck

"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Crown,
  ExternalLink,
  FileText,
  Filter,
  Lock,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { KpiTile } from "../../../components/ui/KpiTile";
import { navigateWithRouter } from "@/navigation/routerNavigate";
import { ProviderPageTitle } from "@/components/provider/ProviderPageTitle";

/**
 * Provider — Subscriptions
 * ---------------------------------
 * Workspace / team subscriptions surface for billing plans, seats, entitlements,
 * add-ons, renewals, invoices, and feature access.
 *
 * Important scope rule
 * - This page is for Provider workspace subscriptions, not end-user memberships.
 * - It is designed as an operational control surface for plan stewardship,
 *   seat growth, billing visibility, and premium feature governance.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#0f172a";

const ROUTES = {
  providerDashboard: "/faithhub/provider/dashboard",
  rolesPermissions: "/faithhub/provider/roles-permissions",
  walletPayouts: "/faithhub/provider/wallet-payouts",
  audienceNotifications: "/faithhub/provider/audience-notifications",
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

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
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

type Tone = "neutral" | "good" | "warn" | "danger" | "info" | "pro";
type PreviewMode = "desktop" | "mobile";
type InvoiceStatus = "Paid" | "Due soon" | "Overdue" | "Processing";
type EntitlementState = "Included" | "Limited" | "Upgrade";
type AddOnState = "Active" | "Available" | "Recommended" | "Trial";
type BillingFilter =
  | "All"
  | "Billing"
  | "Seats"
  | "Entitlements"
  | "Invoices";

type KPI = {
  id: string;
  label: string;
  value: string;
  hint: string;
  tone: Tone;
};

type SeatCluster = {
  id: string;
  label: string;
  used: number;
  total: number;
  hint: string;
  tone: Tone;
};

type Entitlement = {
  id: string;
  group: string;
  label: string;
  state: EntitlementState;
  hint: string;
  tone: Tone;
};

type AddOn = {
  id: string;
  label: string;
  priceLabel: string;
  state: AddOnState;
  hint: string;
  tone: Tone;
};

type Invoice = {
  id: string;
  period: string;
  amount: number;
  seats: number;
  status: InvoiceStatus;
  dueISO: string;
  method: string;
  reference: string;
  note: string;
  lines: Array<{ label: string; amount: number }>;
};

type Recommendation = {
  id: string;
  title: string;
  detail: string;
  tone: Tone;
};

const KPI_STRIP: KPI[] = [
  {
    id: "plan",
    label: "Current plan",
    value: "Growth Workspace",
    hint: "Premium provider workspace with Beacon, live ops, and team controls.",
    tone: "good",
  },
  {
    id: "seats",
    label: "Seats used",
    value: "38 / 45",
    hint: "Seven seats remain before you hit the current workspace cap.",
    tone: "info",
  },
  {
    id: "renewal",
    label: "Next renewal",
    value: "May 28",
    hint: "Monthly renewal with annual discount eligibility available.",
    tone: "warn",
  },
  {
    id: "addons",
    label: "Active add-ons",
    value: "4",
    hint: "Translation minutes, multi-campus, support desk, and premium moderation.",
    tone: "good",
  },
  {
    id: "invoices",
    label: "Open invoices",
    value: "2",
    hint: "One invoice is due soon and one is still processing.",
    tone: "warn",
  },
  {
    id: "spend",
    label: "Monthly spend",
    value: fmtMoney(1240),
    hint: "Current workspace, seats, and premium feature stack combined.",
    tone: "info",
  },
];

const SEAT_CLUSTERS: SeatCluster[] = [
  {
    id: "leadership",
    label: "Leadership + office",
    used: 8,
    total: 10,
    hint: "Executive, pastoral, and governance seats.",
    tone: "good",
  },
  {
    id: "production",
    label: "Production + live ops",
    used: 12,
    total: 15,
    hint: "Producers, moderators, captioners, and studio operators.",
    tone: "info",
  },
  {
    id: "community",
    label: "Care + community",
    used: 9,
    total: 10,
    hint: "Prayer, counseling, forum, and community support coverage.",
    tone: "warn",
  },
  {
    id: "outreach",
    label: "Outreach + marketing",
    used: 7,
    total: 10,
    hint: "Beacon, messaging, audience, and event promotion seats.",
    tone: "good",
  },
];

const ENTITLEMENTS: Entitlement[] = [
  {
    id: "livepro",
    group: "Live Sessions",
    label: "Live Dashboard + Studio",
    state: "Included",
    hint: "Full production workflow with advanced telemetry and backstage controls.",
    tone: "good",
  },
  {
    id: "multicampus",
    group: "Operations",
    label: "Multi-campus switching",
    state: "Included",
    hint: "Run multiple locations from one provider workspace.",
    tone: "good",
  },
  {
    id: "translation",
    group: "Accessibility",
    label: "Live translation tracks",
    state: "Limited",
    hint: "120 minutes left in the current monthly pool.",
    tone: "warn",
  },
  {
    id: "moderation",
    group: "Trust",
    label: "Premium moderation workflows",
    state: "Included",
    hint: "Escalation routing, evidence trails, and policy presets enabled.",
    tone: "good",
  },
  {
    id: "beacon",
    group: "Promotion",
    label: "Beacon campaign suite",
    state: "Included",
    hint: "Dashboard, marketplace, manager, and builder are active.",
    tone: "good",
  },
  {
    id: "extraBrand",
    group: "Brand system",
    label: "Extra brand workspaces",
    state: "Upgrade",
    hint: "Unlock more than one branded institution shell under this workspace.",
    tone: "pro",
  },
  {
    id: "api",
    group: "Integrations",
    label: "API + advanced exports",
    state: "Upgrade",
    hint: "Needed for BI sync, warehouse export, and custom automation.",
    tone: "pro",
  },
  {
    id: "support",
    group: "Support",
    label: "Priority success desk",
    state: "Included",
    hint: "Fast-response workspace support and billing escalation coverage.",
    tone: "good",
  },
];

const ADD_ONS: AddOn[] = [
  {
    id: "translation_pack",
    label: "Translation minutes pack",
    priceLabel: fmtMoney(120),
    state: "Active",
    hint: "Extra subtitle and translated live-session capacity this month.",
    tone: "good",
  },
  {
    id: "seat_pack",
    label: "Five-seat expansion",
    priceLabel: fmtMoney(90),
    state: "Recommended",
    hint: "Best next step before outreach and care teams hit seat limits.",
    tone: "warn",
  },
  {
    id: "moderation_desk",
    label: "Premium moderation desk",
    priceLabel: fmtMoney(210),
    state: "Active",
    hint: "Extended moderation queue, incident handoff, and evidence review.",
    tone: "good",
  },
  {
    id: "extra_brand",
    label: "Additional brand workspace",
    priceLabel: fmtMoney(160),
    state: "Available",
    hint: "Ideal for ministries running multiple sub-brands or church plants.",
    tone: "info",
  },
  {
    id: "analytics_export",
    label: "Analytics export pack",
    priceLabel: fmtMoney(75),
    state: "Trial",
    hint: "Unlock advanced reporting and warehouse-friendly export files.",
    tone: "pro",
  },
  {
    id: "success_desk",
    label: "Launch season success desk",
    priceLabel: fmtMoney(140),
    state: "Available",
    hint: "Temporary support upgrade for Easter, conferences, or fundraising bursts.",
    tone: "info",
  },
];

const INVOICES: Invoice[] = [
  {
    id: "INV-2405",
    period: "May 2026 workspace renewal",
    amount: 1240,
    seats: 45,
    status: "Due soon",
    dueISO: "2026-05-28T09:00:00.000Z",
    method: "Visa ending 4831",
    reference: "sub_may_2026_growth",
    note: "Includes current plan, four add-ons, and full seat pack.",
    lines: [
      { label: "Growth Workspace base", amount: 780 },
      { label: "Seat pack (45 seats)", amount: 180 },
      { label: "Translation minutes add-on", amount: 120 },
      { label: "Premium moderation desk", amount: 160 },
    ],
  },
  {
    id: "INV-2404",
    period: "April 2026 workspace renewal",
    amount: 1180,
    seats: 40,
    status: "Paid",
    dueISO: "2026-04-28T09:00:00.000Z",
    method: "Visa ending 4831",
    reference: "sub_apr_2026_growth",
    note: "Paid successfully with no interruptions to provider access.",
    lines: [
      { label: "Growth Workspace base", amount: 780 },
      { label: "Seat pack (40 seats)", amount: 140 },
      { label: "Translation minutes add-on", amount: 120 },
      { label: "Premium moderation desk", amount: 140 },
    ],
  },
  {
    id: "INV-2403",
    period: "March 2026 true-up",
    amount: 260,
    seats: 5,
    status: "Processing",
    dueISO: "2026-03-31T09:00:00.000Z",
    method: "Bank transfer pending",
    reference: "seat_trueup_mar_2026",
    note: "Mid-cycle seat expansion for counseling and community support.",
    lines: [
      { label: "Five-seat expansion", amount: 90 },
      { label: "Translation overflow minutes", amount: 70 },
      { label: "Prorated moderation extension", amount: 100 },
    ],
  },
  {
    id: "INV-2402",
    period: "February 2026 extra brand workspace",
    amount: 160,
    seats: 0,
    status: "Overdue",
    dueISO: "2026-02-18T09:00:00.000Z",
    method: "ACH failed",
    reference: "brand_addon_feb_2026",
    note: "Extra brand request was not activated because the payment failed.",
    lines: [
      { label: "Additional brand workspace", amount: 160 },
    ],
  },
];

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "r1",
    title: "Add five seats before the next live season",
    detail:
      "Community care and production clusters are close to their seat caps. Expanding early avoids blocked invites.",
    tone: "warn",
  },
  {
    id: "r2",
    title: "Upgrade for API exports if finance wants BI sync",
    detail:
      "Your analytics export trial is active. Moving to the upgrade tier prevents reporting gaps after the trial ends.",
    tone: "pro",
  },
  {
    id: "r3",
    title: "Move the overdue brand invoice out of risk state",
    detail:
      "The failed February add-on can be cleared now so the additional workspace is ready when needed.",
    tone: "danger",
  },
];

function toneStyles(tone: Tone) {
  if (tone === "good")
    return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
  if (tone === "warn")
    return "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800";
  if (tone === "danger")
    return "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800";
  if (tone === "info")
    return "bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800";
  if (tone === "pro")
    return "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800";
  return "bg-[var(--fh-surface-bg)] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-faith-line dark:border-slate-700";
}

function Pill({
  text,
  tone = "neutral",
  icon,
}: {
  text: string;
  tone?: Tone;
  icon?: React.ReactNode;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold",
        toneStyles(tone),
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
        "inline-flex items-center gap-2 rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-800 px-4 py-2 text-[12px] font-semibold text-slate-700 dark:text-slate-200 transition-colors hover:bg-[var(--fh-surface)] dark:hover:bg-slate-700",
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
  tone = "orange",
  className,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: "orange" | "green";
  className?: string;
  title?: string;
}) {
  const background = tone === "green" ? EV_GREEN : EV_ORANGE;
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-[12px] font-semibold text-white transition-opacity hover:opacity-95",
        className,
      )}
      style={{ background }}
    >
      {children}
    </button>
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
    <div className="rounded-3xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[14px] font-semibold text-faith-ink dark:text-slate-100">
            {title}
          </div>
          {subtitle ? (
            <div className="mt-0.5 text-[11px] text-faith-slate">
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

function KPIBox({ item }: { item: KPI }) {
  return (
    <KpiTile
      label={item.label}
      value={item.value}
      hint={item.hint}
      tone={item.tone}
      size="compact"
    />
  );
}

function ProgressBar({
  value,
  total,
  tone = "good",
}: {
  value: number;
  total: number;
  tone?: Tone;
}) {
  const width = pct(value, total);
  const color =
    tone === "good"
      ? EV_GREEN
      : tone === "warn"
        ? EV_ORANGE
        : tone === "danger"
          ? "#ef4444"
          : tone === "info"
            ? "#0ea5e9"
            : EV_NAVY;

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div
        className="h-full rounded-full"
        style={{ width: `${width}%`, background: color }}
      />
    </div>
  );
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: Tone;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold",
        toneStyles(tone),
      )}
    >
      {label}
    </span>
  );
}

function InvoiceTone(status: InvoiceStatus): Tone {
  if (status === "Paid") return "good";
  if (status === "Due soon") return "warn";
  if (status === "Overdue") return "danger";
  return "info";
}

export default function SubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<BillingFilter>("All");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>("INV-2405");
  const [sheet, setSheet] = useState<"plan" | "seats" | null>(null);

  const selectedInvoice =
    INVOICES.find((invoice) => invoice.id === selectedInvoiceId) || INVOICES[0];

  const filteredEntitlements = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ENTITLEMENTS.filter((item) => {
      if (filter !== "All" && filter !== "Entitlements") return false;
      if (!q) return true;
      return (
        item.label.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q) ||
        item.hint.toLowerCase().includes(q)
      );
    });
  }, [search, filter]);

  const filteredAddOns = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ADD_ONS.filter((item) => {
      if (filter !== "All" && filter !== "Billing" && filter !== "Entitlements")
        return false;
      if (!q) return true;
      return (
        item.label.toLowerCase().includes(q) ||
        item.hint.toLowerCase().includes(q)
      );
    });
  }, [search, filter]);

  const filteredInvoices = useMemo(() => {
    const q = search.trim().toLowerCase();
    return INVOICES.filter((item) => {
      if (filter !== "All" && filter !== "Billing" && filter !== "Invoices")
        return false;
      if (!q) return true;
      return (
        item.period.toLowerCase().includes(q) ||
        item.reference.toLowerCase().includes(q) ||
        item.method.toLowerCase().includes(q) ||
        item.note.toLowerCase().includes(q)
      );
    });
  }, [search, filter]);

  const filteredSeats = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SEAT_CLUSTERS.filter((item) => {
      if (filter !== "All" && filter !== "Seats") return false;
      if (!q) return true;
      return (
        item.label.toLowerCase().includes(q) ||
        item.hint.toLowerCase().includes(q)
      );
    });
  }, [search, filter]);

  return (
    <div
      className="min-h-screen w-full p-5 md:p-6"
      style={{ background: EV_LIGHT, color: EV_NAVY }}
    >
      <div className="mx-auto max-w-[1550px] space-y-5">
        <div className="rounded-[28px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-5 md:p-6 transition-colors">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-4">
                <div className="min-w-0">
                  <ProviderPageTitle
                    icon={<Crown className="h-6 w-6" />}
                    title="Subscriptions"
                    subtitle="Manage plans, seats, and premium access without losing control across billing plans, entitlements, renewals, invoices, and workspace feature access."
                  />
                  <p className="mt-3 max-w-[980px] text-[18px] leading-snug text-faith-slate">
                    Workspace/team subscriptions for providers — covering billing plans,
                    seats, entitlements, add-ons, renewals, invoices, and feature access in one premium surface.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Pill text="Growth Workspace active" tone="good" icon={<BadgeCheck className="h-3.5 w-3.5" />} />
                    <Pill text="38 / 45 seats used" tone="info" icon={<Users className="h-3.5 w-3.5" />} />
                    <Pill text="Renewal due in 18 days" tone="warn" icon={<CalendarClock className="h-3.5 w-3.5" />} />
                    <Pill text="Workspace subscriptions only" tone="neutral" icon={<ShieldCheck className="h-3.5 w-3.5" />} />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full max-w-[470px] rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-5 transition-colors">
              <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-faith-slate">
                COMMAND ACTIONS
              </div>
              <div className="mt-2 text-[18px] font-black text-faith-ink dark:text-slate-100">
                Subscription control
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <PrimaryButton
                  tone="orange"
                  onClick={() => setSheet("plan")}
                  title="Open plan management"
                >
                  <Wallet className="h-4 w-4" />
                  Manage Plan
                </PrimaryButton>
                <PrimaryButton
                  tone="green"
                  onClick={() => setSheet("seats")}
                  title="Expand seat capacity"
                >
                  <Plus className="h-4 w-4" />
                  Add Seats
                </PrimaryButton>
                <SoftButton
                  onClick={() => setSelectedInvoiceId("INV-2405")}
                  title="Open latest invoice"
                >
                  <FileText className="h-4 w-4" />
                  View Invoices
                </SoftButton>
              </div>
              <div className="mt-4 rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 transition-colors">
                <div className="text-[12px] font-semibold text-faith-slate">
                  Billing contact
                </div>
                <div className="mt-1 text-[17px] font-black text-faith-ink dark:text-slate-100">
                  finance@glowuphub.org
                </div>
                <div className="mt-2 text-[12px] leading-snug text-faith-slate">
                  Renewal notices, invoices, payment failures, and seat-change approvals route here.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {KPI_STRIP.map((item) => (
            <KPIBox key={item.id} item={item} />
          ))}
        </div>

        <div className="rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 transition-colors">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="text-[15px] font-semibold text-faith-ink dark:text-slate-100">
                Search and filter subscription operations
              </div>
              <div className="mt-0.5 text-[12px] text-faith-slate">
                Find plans, seats, entitlements, add-ons, invoices, and billing notes faster.
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["All", "Billing", "Seats", "Entitlements", "Invoices"] as BillingFilter[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={cx(
                    "rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors",
                    filter === item
                      ? "text-white"
                      : "border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-800 text-slate-700 dark:text-slate-300",
                  )}
                  style={filter === item ? { background: item === "Billing" ? EV_ORANGE : EV_GREEN } : undefined}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 px-4 py-3 transition-colors">
            <Search className="h-4 w-4 text-faith-slate" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search plans, seat notes, invoice references, entitlements, or add-ons"
              className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-faith-slate text-faith-ink dark:text-slate-100"
            />
            <Filter className="h-4 w-4 text-faith-slate" />
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.95fr_0.8fr]">
          <div className="space-y-4">
            <SectionCard
              title="Plan control center"
              subtitle="Workspace billing, renewal timing, plan changes, and seat strategy in one premium command surface."
              right={<Pill text="Current plan: Growth" tone="good" icon={<BadgeCheck className="h-3.5 w-3.5" />} />}
            >
              <div
                className="rounded-[24px] p-5 text-white"
                style={{ background: `linear-gradient(135deg, ${EV_NAVY} 0%, #1e3a8a 100%)` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.12em] text-white/70">
                      Workspace subscription
                    </div>
                    <div className="mt-1 text-[30px] font-black tracking-[-0.03em]">
                      Growth Workspace
                    </div>
                    <div className="mt-1 text-[13px] text-white/75">
                      Live Sessions + Audience + Giving + Beacon + Team governance
                    </div>
                  </div>
                  <StatusPill label="Healthy 96%" tone="good" />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-[var(--fh-surface-bg)]/8 p-3 ring-1 ring-white/10">
                    <div className="text-[10px] uppercase tracking-[0.12em] text-white/60">
                      Seats
                    </div>
                    <div className="mt-1 text-[24px] font-black">38 / 45</div>
                    <div className="mt-2">
                      <ProgressBar value={38} total={45} tone="good" />
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[var(--fh-surface-bg)]/8 p-3 ring-1 ring-white/10">
                    <div className="text-[10px] uppercase tracking-[0.12em] text-white/60">
                      Monthly total
                    </div>
                    <div className="mt-1 text-[24px] font-black">{fmtMoney(1240)}</div>
                    <div className="text-[11px] text-white/70">
                      Base plan + seats + active premium add-ons
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[var(--fh-surface-bg)]/8 p-3 ring-1 ring-white/10">
                    <div className="text-[10px] uppercase tracking-[0.12em] text-white/60">
                      Renewal
                    </div>
                    <div className="mt-1 text-[24px] font-black">May 28</div>
                    <div className="text-[11px] text-white/70">
                      Auto-renew with annual savings offer available
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <SoftButton onClick={() => setSheet("plan")} className="bg-[var(--fh-surface-bg)]/95 text-faith-ink border-white/50">
                    <Crown className="h-4 w-4" />
                    Compare plan paths
                  </SoftButton>
                  <SoftButton
                    onClick={() => safeNav(ROUTES.walletPayouts)}
                    className="bg-[var(--fh-surface-bg)]/10 text-white border-white/15 hover:bg-[var(--fh-surface-bg)]/15"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open finance links
                  </SoftButton>
                  <SoftButton
                    onClick={async () => {
                      const ok = await copyText("finance@glowuphub.org");
                      if (ok) window.alert("Billing contact copied");
                    }}
                    className="bg-[var(--fh-surface-bg)]/10 text-white border-white/15 hover:bg-[var(--fh-surface-bg)]/15"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Copy billing contact
                  </SoftButton>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4 transition-colors">
                  <div className="text-[11px] uppercase tracking-[0.12em] text-faith-slate">
                    Plan stewardship
                  </div>
                  <div className="mt-2 text-[13px] font-semibold text-faith-ink dark:text-slate-100">
                    Auto-renew is on
                  </div>
                  <div className="mt-1 text-[12px] text-faith-slate">
                    Renewal protection is enabled so core provider surfaces stay uninterrupted.
                  </div>
                </div>
                <div className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4 transition-colors">
                  <div className="text-[11px] uppercase tracking-[0.12em] text-faith-slate">
                    Seat health
                  </div>
                  <div className="mt-2 text-[13px] font-semibold text-faith-ink dark:text-slate-100">
                    7 seats remaining
                  </div>
                  <div className="mt-1 text-[12px] text-faith-slate">
                    Community care and production teams are the fastest-growing clusters right now.
                  </div>
                </div>
                <div className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4 transition-colors">
                  <div className="text-[11px] uppercase tracking-[0.12em] text-faith-slate">
                    Payment readiness
                  </div>
                  <div className="mt-2 text-[13px] font-semibold text-faith-ink dark:text-slate-100">
                    1 backup method stored
                  </div>
                  <div className="mt-1 text-[12px] text-faith-slate">
                    Primary card is healthy and ACH fallback is available for higher-value invoices.
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Seats + assignment health"
              subtitle="See who is consuming workspace capacity, where growth is happening, and what to expand next."
              right={
                <SoftButton onClick={() => setSheet("seats")}>
                  <Plus className="h-4 w-4" />
                  Expand seats
                </SoftButton>
              }
            >
              <div className="space-y-3">
                {filteredSeats.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-950 p-4 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-faith-ink dark:text-slate-100">
                          {item.label}
                        </div>
                        <div className="mt-0.5 text-[12px] text-faith-slate">
                          {item.hint}
                        </div>
                      </div>
                      <StatusPill
                        label={`${item.used} / ${item.total}`}
                        tone={item.tone}
                      />
                    </div>
                    <div className="mt-3">
                      <ProgressBar value={item.used} total={item.total} tone={item.tone} />
                    </div>
                    <div className="mt-2 text-[11px] text-faith-slate">
                      {item.total - item.used} seat(s) available in this cluster.
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4 transition-colors">
                  <div className="text-[12px] font-semibold text-faith-ink dark:text-slate-100">
                    Pending invites
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[12px] text-faith-slate">
                    <span>2 invites waiting for acceptance</span>
                    <span className="font-semibold text-faith-ink dark:text-slate-100">
                      2 seats reserved
                    </span>
                  </div>
                </div>
                <div className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4 transition-colors">
                  <div className="text-[12px] font-semibold text-faith-ink dark:text-slate-100">
                    Recommended expansion
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[12px] text-faith-slate">
                    <span>Five-seat pack before Easter</span>
                    <span className="font-semibold text-faith-ink dark:text-slate-100">
                      {fmtMoney(90)}
                    </span>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-4">
            <SectionCard
              title="Entitlements + feature access"
              subtitle="Which premium provider surfaces are fully included, nearing limits, or still locked behind upgrade paths."
              right={<Pill text={`${filteredEntitlements.length} controls`} tone="neutral" icon={<ShieldCheck className="h-3.5 w-3.5" />} />}
            >
              <div className="space-y-3">
                {filteredEntitlements.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-950 p-4 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[11px] uppercase tracking-[0.12em] text-faith-slate">
                          {item.group}
                        </div>
                        <div className="mt-1 text-[13px] font-semibold text-faith-ink dark:text-slate-100">
                          {item.label}
                        </div>
                        <div className="mt-1 text-[12px] leading-snug text-faith-slate">
                          {item.hint}
                        </div>
                      </div>
                      <StatusPill label={item.state} tone={item.tone} />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Add-ons marketplace"
              subtitle="Premium packs that expand the workspace without forcing a full plan change."
              right={<Pill text={`${filteredAddOns.length} add-ons`} tone="neutral" icon={<Sparkles className="h-3.5 w-3.5" />} />}
            >
              <div className="space-y-3">
                {filteredAddOns.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-950 p-4 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-faith-ink dark:text-slate-100">
                          {item.label}
                        </div>
                        <div className="mt-1 text-[12px] leading-snug text-faith-slate">
                          {item.hint}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[13px] font-black text-faith-ink dark:text-slate-100">
                          {item.priceLabel}
                        </div>
                        <div className="mt-1">
                          <StatusPill label={item.state} tone={item.tone} />
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <SoftButton>
                        <Zap className="h-4 w-4" />
                        Open details
                      </SoftButton>
                      <SoftButton>
                        <ChevronRight className="h-4 w-4" />
                        Add to workspace
                      </SoftButton>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-4">
            <SectionCard
              title="Preview + access rail"
              subtitle="How the plan and entitlements feel to provider teams before you change anything."
              right={
                <div className="inline-flex rounded-full border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-800 p-1 transition-colors">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("desktop")}
                    className={cx(
                      "rounded-full px-3 py-1 text-[11px] font-semibold transition-colors",
                      previewMode === "desktop" ? "text-white" : "text-slate-700 dark:text-slate-300",
                    )}
                    style={previewMode === "desktop" ? { background: EV_GREEN } : undefined}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("mobile")}
                    className={cx(
                      "rounded-full px-3 py-1 text-[11px] font-semibold transition-colors",
                      previewMode === "mobile" ? "text-white" : "text-slate-700 dark:text-slate-300",
                    )}
                    style={previewMode === "mobile" ? { background: EV_GREEN } : undefined}
                  >
                    Mobile
                  </button>
                </div>
              }
            >
              {previewMode === "desktop" ? (
                <div className="rounded-[26px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4 transition-colors">
                  <div
                    className="rounded-[22px] p-4 text-white"
                    style={{ background: `linear-gradient(135deg, ${EV_NAVY} 0%, #132a5b 100%)` }}
                  >
                    <div className="text-[11px] uppercase tracking-[0.12em] text-white/70">
                      Workspace billing panel
                    </div>
                    <div className="mt-1 text-[24px] font-black">Growth Workspace</div>
                    <div className="mt-1 text-[12px] text-white/75">
                      38 / 45 seats · 4 premium add-ons · renewal May 28
                    </div>
                    <div className="mt-3">
                      <ProgressBar value={38} total={45} tone="good" />
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2">
                    {[
                      ["Live Sessions", "Included", "good"],
                      ["Beacon", "Included", "good"],
                      ["Translation tracks", "Limited", "warn"],
                      ["Extra brand workspace", "Upgrade", "pro"],
                      ["API exports", "Upgrade", "pro"],
                    ].map(([label, state, tone]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 transition-colors"
                      >
                        <div className="text-[12px] font-semibold text-faith-ink dark:text-slate-100">
                          {label}
                        </div>
                        <StatusPill label={state} tone={tone as Tone} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mx-auto max-w-[300px] rounded-[28px] border border-faith-line dark:border-slate-800 bg-slate-900 p-3 shadow-soft transition-colors">
                  <div className="rounded-[24px] bg-[var(--fh-surface-bg)] dark:bg-slate-950 p-4 transition-colors">
                    <div className="text-[10px] uppercase tracking-[0.12em] text-faith-slate">
                      Mobile billing summary
                    </div>
                    <div className="mt-1 text-[18px] font-black text-faith-ink dark:text-slate-100">
                      Growth Workspace
                    </div>
                    <div className="mt-1 text-[11px] text-faith-slate">
                      38 / 45 seats · renewal in 18 days
                    </div>
                    <div className="mt-3 space-y-2">
                      {["Live Sessions", "Beacon", "Translation", "Invoices"].map((label, idx) => (
                        <div
                          key={label}
                          className="flex items-center justify-between rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-900 px-3 py-2 transition-colors"
                        >
                          <span className="text-[11px] font-semibold text-faith-ink dark:text-slate-100">
                            {label}
                          </span>
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                            style={{ background: idx < 2 ? EV_GREEN : idx === 2 ? EV_ORANGE : EV_NAVY }}
                          >
                            {idx < 2 ? "On" : idx === 2 ? "Limited" : "Open"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4 transition-colors">
                  <div className="text-[12px] font-semibold text-faith-ink dark:text-slate-100">
                    Payment method vault
                  </div>
                  <div className="mt-2 text-[12px] text-faith-slate">
                    Primary card: <span className="font-semibold text-faith-ink dark:text-slate-100">Visa ending 4831</span>
                  </div>
                  <div className="mt-1 text-[12px] text-faith-slate">
                    Backup: <span className="font-semibold text-faith-ink dark:text-slate-100">ACH account · verified</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4 transition-colors">
                  <div className="text-[12px] font-semibold text-faith-ink dark:text-slate-100">
                    Billing safeguards
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Pill text="Invoice email active" tone="good" />
                    <Pill text="Backup method stored" tone="good" />
                    <Pill text="1 overdue add-on" tone="warn" />
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <SectionCard
            title="Invoices + renewal ledger"
            subtitle="Review the billing trail, open invoices, due dates, and line-by-line workspace charges."
            right={
              <SoftButton
                onClick={async () => {
                  const ok = await copyText(selectedInvoice.reference);
                  if (ok) window.alert("Invoice reference copied");
                }}
              >
                <FileText className="h-4 w-4" />
                Copy reference
              </SoftButton>
            }
          >
            <div className="space-y-3">
              {filteredInvoices.map((invoice) => (
                <button
                  key={invoice.id}
                  type="button"
                  onClick={() => setSelectedInvoiceId(invoice.id)}
                  className={cx(
                    "w-full rounded-2xl border p-4 text-left transition-colors",
                    selectedInvoiceId === invoice.id
                      ? "border-slate-900 dark:border-white bg-[var(--fh-surface)] dark:bg-slate-950"
                      : "border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 hover:bg-[var(--fh-surface)] dark:hover:bg-slate-950",
                  )}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-faith-ink dark:text-slate-100">
                        {invoice.period}
                      </div>
                      <div className="mt-1 text-[12px] text-faith-slate">
                        {invoice.reference} · {invoice.method}
                      </div>
                      <div className="mt-1 text-[12px] text-faith-slate">
                        Due {fmtDate(invoice.dueISO)} · {invoice.seats} billed seats
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[16px] font-black text-faith-ink dark:text-slate-100">
                        {fmtMoney(invoice.amount)}
                      </div>
                      <div className="mt-1">
                        <StatusPill label={invoice.status} tone={InvoiceTone(invoice.status)} />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[13px] font-semibold text-faith-ink dark:text-slate-100">
                    {selectedInvoice.period}
                  </div>
                  <div className="mt-1 text-[12px] text-faith-slate">
                    {selectedInvoice.note}
                  </div>
                </div>
                <StatusPill
                  label={selectedInvoice.status}
                  tone={InvoiceTone(selectedInvoice.status)}
                />
              </div>

              <div className="mt-4 grid gap-2">
                {selectedInvoice.lines.map((line) => (
                  <div
                    key={line.label}
                    className="flex items-center justify-between rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 transition-colors"
                  >
                    <span className="text-[12px] text-slate-700 dark:text-slate-300">
                      {line.label}
                    </span>
                    <span className="text-[12px] font-semibold text-faith-ink dark:text-slate-100">
                      {fmtMoney(line.amount)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <SoftButton>
                  <CreditCard className="h-4 w-4" />
                  Update method
                </SoftButton>
                <SoftButton>
                  <FileText className="h-4 w-4" />
                  Download PDF
                </SoftButton>
                <SoftButton>
                  <ExternalLink className="h-4 w-4" />
                  Open billing portal
                </SoftButton>
              </div>
            </div>
          </SectionCard>

          <div className="space-y-4">
            <SectionCard
              title="Billing recommendations + signals"
              subtitle="What deserves the next plan change, invoice action, or feature-access decision."
              right={<Pill text="Finance-aware" tone="good" icon={<BadgeCheck className="h-3.5 w-3.5" />} />}
            >
              <div className="space-y-3">
                {RECOMMENDATIONS.map((item) => (
                  <div
                    key={item.id}
                    className={cx(
                      "rounded-2xl border p-4 transition-colors",
                      toneStyles(item.tone),
                    )}
                  >
                    <div className="text-[13px] font-semibold">{item.title}</div>
                    <div className="mt-1 text-[12px] leading-snug opacity-90">
                      {item.detail}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Linked operational pages"
              subtitle="Subscription decisions should stay connected to access control, finance, and provider operations."
            >
              <div className="grid gap-3">
                {[
                  {
                    label: "Roles & Permissions",
                    hint: "See which seats and entitlements affect sensitive access.",
                    icon: <Lock className="h-4 w-4" />,
                    onClick: () => safeNav(ROUTES.rolesPermissions),
                  },
                  {
                    label: "Wallet & Payouts",
                    hint: "Review payout methods and treasury controls related to billing.",
                    icon: <Wallet className="h-4 w-4" />,
                    onClick: () => safeNav(ROUTES.walletPayouts),
                  },
                  {
                    label: "Provider Dashboard",
                    hint: "Jump back to the overall provider mission-control surface.",
                    icon: <Building2 className="h-4 w-4" />,
                    onClick: () => safeNav(ROUTES.providerDashboard),
                  },
                  {
                    label: "Audience Notifications",
                    hint: "Check campaign capacity if extra seats are needed for outreach.",
                    icon: <Zap className="h-4 w-4" />,
                    onClick: () => safeNav(ROUTES.audienceNotifications),
                  },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.onClick}
                    className="flex items-center justify-between rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-950 px-4 py-3 text-left transition-colors hover:bg-[var(--fh-surface)] dark:hover:bg-slate-900"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-faith-ink dark:text-slate-100">
                          {item.label}
                        </div>
                        <div className="mt-0.5 text-[12px] text-faith-slate">
                          {item.hint}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-faith-slate" />
                  </button>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      {sheet === "plan" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-[980px] rounded-[28px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-5 shadow-2xl transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[18px] font-black text-faith-ink dark:text-slate-100">
                  Manage plan
                </div>
                <div className="mt-1 text-[12px] text-faith-slate">
                  Compare the current workspace against upgrade or downgrade paths before changing anything.
                </div>
              </div>
              <SoftButton onClick={() => setSheet(null)}>
                <AlertTriangle className="h-4 w-4" />
                Close
              </SoftButton>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {[
                {
                  label: "Core Workspace",
                  price: fmtMoney(640),
                  hint: "Smaller team, lighter add-on footprint, essential provider tools only.",
                  tone: "neutral" as Tone,
                },
                {
                  label: "Growth Workspace",
                  price: fmtMoney(780),
                  hint: "Best for active live teams, Beacon usage, and outreach workflows.",
                  tone: "good" as Tone,
                },
                {
                  label: "Enterprise Workspace",
                  price: fmtMoney(1320),
                  hint: "Multi-brand, API export, advanced governance, and higher seat ceilings.",
                  tone: "pro" as Tone,
                },
              ].map((plan) => (
                <div
                  key={plan.label}
                  className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[14px] font-semibold text-faith-ink dark:text-slate-100">
                      {plan.label}
                    </div>
                    <StatusPill
                      label={plan.label === "Growth Workspace" ? "Current" : "Preview"}
                      tone={plan.tone}
                    />
                  </div>
                  <div className="mt-3 text-[28px] font-black text-faith-ink dark:text-slate-100">
                    {plan.price}
                  </div>
                  <div className="mt-1 text-[12px] leading-snug text-faith-slate">
                    {plan.hint}
                  </div>
                  <div className="mt-4">
                    <PrimaryButton
                      tone={plan.label === "Growth Workspace" ? "green" : "orange"}
                      className="w-full justify-center"
                    >
                      {plan.label === "Growth Workspace" ? "Stay on current plan" : "Preview change"}
                    </PrimaryButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {sheet === "seats" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-[760px] rounded-[28px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-5 shadow-2xl transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[18px] font-black text-faith-ink dark:text-slate-100">
                  Add seats
                </div>
                <div className="mt-1 text-[12px] text-faith-slate">
                  Expand your workspace capacity for production, care, outreach, and leadership teams.
                </div>
              </div>
              <SoftButton onClick={() => setSheet(null)}>
                <AlertTriangle className="h-4 w-4" />
                Close
              </SoftButton>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {[
                { label: "Five-seat pack", price: fmtMoney(90), hint: "Best quick expansion for care and outreach growth." },
                { label: "Ten-seat pack", price: fmtMoney(170), hint: "Better value for live operations and multi-campus teams." },
                { label: "Custom seat review", price: "Talk to sales", hint: "For larger ministries planning a major season or conference." },
              ].map((pack, idx) => (
                <div
                  key={pack.label}
                  className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4 transition-colors"
                >
                  <div className="text-[14px] font-semibold text-faith-ink dark:text-slate-100">
                    {pack.label}
                  </div>
                  <div className="mt-3 text-[24px] font-black text-faith-ink dark:text-slate-100">
                    {pack.price}
                  </div>
                  <div className="mt-1 text-[12px] leading-snug text-faith-slate">
                    {pack.hint}
                  </div>
                  <div className="mt-4">
                    <PrimaryButton
                      tone={idx === 0 ? "green" : "orange"}
                      className="w-full justify-center"
                    >
                      Select pack
                    </PrimaryButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto mt-4 max-w-[1550px] rounded-[18px] bg-emerald-50 px-4 py-3 text-[12px] text-emerald-700">
        Preview
      </div>
    </div>
  );
}









