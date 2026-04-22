// @ts-nocheck

"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  Eye,
  ExternalLink,
  Filter,
  History,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UserCog,
  Wallet,
  Workflow,
  X,
} from "lucide-react";
import { KpiTile } from "../../../components/ui/KpiTile";
import { ProviderPageTitle } from "@/components/provider/ProviderPageTitle";

/**
 * Provider — Audit Log
 * --------------------------------
 * Purpose:
 * Immutable-style operational history for role changes, publishing actions,
 * moderation actions, finance changes, and admin events.
 *
 * Primary CTAs:
 * - Export Log
 * - Filter Events
 * - Investigate Change
 *
 * Design system:
 * - EVzone Green #03cd8c
 * - EVzone Orange #f77f00
 */

const GREEN = "#03cd8c";
const ORANGE = "#f77f00";
const MEDIUM = "#a6a6a6";
const LIGHT = "#f2f2f2";

type AuditDomain =
  | "Roles & Permissions"
  | "Publishing"
  | "Moderation"
  | "Finance"
  | "Admin"
  | "Workspace";

type AuditSeverity = "Informational" | "Elevated" | "Sensitive" | "Critical";
type IntegrityState = "Verified" | "Pending" | "Flagged";
type PreviewMode = "desktop" | "mobile";
type SavedViewKey =
  | "all"
  | "sensitive"
  | "finance"
  | "publishing"
  | "moderation"
  | "admin";

type AuditDiffRow = {
  field: string;
  before: string;
  after: string;
};

type AuditEvent = {
  id: string;
  timestampISO: string;
  domain: AuditDomain;
  severity: AuditSeverity;
  integrity: IntegrityState;
  action: string;
  actor: string;
  actorRole: string;
  objectLabel: string;
  objectType: string;
  campus: string;
  surface: string;
  summary: string;
  sessionLabel: string;
  ipLabel: string;
  deviceLabel: string;
  approvalPath: string;
  linkedPage: string;
  exportBundle: string;
  tags: string[];
  diff: AuditDiffRow[];
  related: string[];
  note: string;
};

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function fmtCompact(value: number) {
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatDateTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function copyText(text: string) {
  if (typeof navigator === "undefined" || !navigator.clipboard) return;
  navigator.clipboard.writeText(text).catch(() => {});
}

function severityTone(value: AuditSeverity) {
  if (value === "Critical") return "danger" as const;
  if (value === "Sensitive") return "warn" as const;
  if (value === "Elevated") return "brand" as const;
  return "neutral" as const;
}

function integrityTone(value: IntegrityState) {
  if (value === "Flagged") return "danger" as const;
  if (value === "Pending") return "warn" as const;
  return "good" as const;
}

function domainAccent(value: AuditDomain) {
  if (value === "Finance") return "orange" as const;
  if (value === "Moderation") return "navy" as const;
  if (value === "Publishing") return "green" as const;
  if (value === "Admin") return "gray" as const;
  return "green" as const;
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
    <div className={cx("rounded-[28px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 transition-colors", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[13px] font-extrabold text-faith-ink dark:text-slate-100">{title}</div>
          {subtitle ? (
            <div className="mt-0.5 text-[11px] text-faith-slate">{subtitle}</div>
          ) : null}
        </div>
        {right}
      </div>
      <div className="mt-4">{children}</div>
    </div>
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

function SavedViewButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "w-full rounded-2xl border px-3 py-2 text-left transition-colors flex items-center justify-between gap-3",
        active
          ? "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20"
          : "border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-800 hover:bg-[var(--fh-surface)] dark:hover:bg-slate-700",
      )}
    >
      <span className="inline-flex items-center gap-2 min-w-0">
        <span
          className={cx(
            "h-8 w-8 rounded-xl grid place-items-center",
            active
              ? "bg-[var(--fh-surface-bg)] dark:bg-slate-900 text-faith-ink dark:text-slate-100"
              : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300",
          )}
        >
          {icon}
        </span>
        <span className="truncate text-[12px] font-extrabold text-faith-ink dark:text-slate-100">{label}</span>
      </span>
      <ChevronRight className="h-4 w-4 text-faith-slate" />
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
    <div className="fixed inset-0 z-[120] flex items-end justify-center p-0 md:items-center md:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-t-[28px] md:rounded-[28px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 shadow-2xl transition-colors overflow-hidden">
        <div className="flex items-start justify-between gap-3 border-b border-faith-line dark:border-slate-800 px-4 py-3">
          <div>
            <div className="text-[13px] font-extrabold text-faith-ink dark:text-slate-100">{title}</div>
            {subtitle ? <div className="mt-0.5 text-[11px] text-faith-slate">{subtitle}</div> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-800 grid place-items-center hover:bg-[var(--fh-surface)] dark:hover:bg-slate-700 transition-colors"
          >
            <X className="h-4 w-4 text-slate-700 dark:text-slate-300" />
          </button>
        </div>
        <div className="p-4 max-h-[85vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function AuditEventRow({
  event,
  selected,
  onSelect,
  onInvestigate,
}: {
  event: AuditEvent;
  selected: boolean;
  onSelect: () => void;
  onInvestigate: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cx(
        "w-full text-left rounded-[24px] border p-4 transition-colors",
        selected
          ? "border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-900/20"
          : "border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 hover:bg-[var(--fh-surface)] dark:hover:bg-slate-800/80",
      )}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-[13px] font-black text-faith-ink dark:text-slate-100">{event.action}</div>
            <Pill tone={severityTone(event.severity)}>{event.severity}</Pill>
            <Pill tone={integrityTone(event.integrity)}>{event.integrity}</Pill>
          </div>
          <div className="mt-1 text-[12px] font-semibold text-slate-700 dark:text-slate-300">
            {event.objectLabel}
          </div>
          <div className="mt-1 text-[11px] text-faith-slate">
            {event.summary}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Pill>{event.domain}</Pill>
            <Pill>{event.actor}</Pill>
            <Pill>{event.actorRole}</Pill>
            <Pill>{event.campus}</Pill>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end lg:text-right">
          <div>
            <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">{formatDateTime(event.timestampISO)}</div>
            <div className="mt-0.5 text-[11px] text-faith-slate">{event.id}</div>
          </div>

          <div className="flex items-center gap-2 lg:justify-end">
            <span className="text-[11px] text-faith-slate">
              {event.surface}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onInvestigate();
              }}
              className="inline-flex items-center justify-center gap-1 rounded-full border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-950 px-3 py-1 text-[11px] font-extrabold text-faith-ink dark:text-slate-100 hover:bg-[var(--fh-surface)] dark:hover:bg-slate-800 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              Investigate
            </button>
          </div>
        </div>
      </div>
    </button>
  );
}

function PreviewRail({
  mode,
  setMode,
  event,
}: {
  mode: PreviewMode;
  setMode: (value: PreviewMode) => void;
  event: AuditEvent;
}) {
  return (
    <Card
      title="Audit preview rail"
      subtitle="See how the selected event would surface in desktop and mobile investigation views."
      right={<Pill tone="good">Signed evidence ready</Pill>}
      className="h-full"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMode("desktop")}
          className={cx(
            "rounded-full px-3 py-1.5 text-[12px] font-extrabold border transition-colors",
            mode === "desktop"
              ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
              : "bg-[var(--fh-surface-bg)] dark:bg-slate-900 border-faith-line dark:border-slate-700 text-faith-slate dark:text-slate-300",
          )}
        >
          Desktop preview
        </button>
        <button
          type="button"
          onClick={() => setMode("mobile")}
          className={cx(
            "rounded-full px-3 py-1.5 text-[12px] font-extrabold border transition-colors",
            mode === "mobile"
              ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
              : "bg-[var(--fh-surface-bg)] dark:bg-slate-900 border-faith-line dark:border-slate-700 text-faith-slate dark:text-slate-300",
          )}
        >
          Mobile preview
        </button>
      </div>

      {mode === "desktop" ? (
        <div className="mt-4 rounded-[26px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4 transition-colors">
          <div className="rounded-[22px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 overflow-hidden transition-colors">
            <div className="border-b border-faith-line dark:border-slate-800 px-4 py-3">
              <div className="text-[11px] font-black uppercase tracking-[0.08em] text-faith-slate">
                Investigation surface
              </div>
              <div className="mt-1 text-[20px] font-black text-faith-ink dark:text-slate-100">
                {event.id} · {event.action}
              </div>
              <div className="mt-1 text-[12px] text-faith-slate">
                {event.objectLabel}
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="rounded-[20px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3 transition-colors">
                <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">Actor + context</div>
                <div className="mt-2 text-[13px] font-extrabold text-faith-ink dark:text-slate-100">
                  {event.actor} · {event.actorRole}
                </div>
                <div className="mt-1 text-[11px] text-faith-slate">
                  {event.deviceLabel} · {event.ipLabel}
                </div>
              </div>

              <div className="rounded-[20px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3 transition-colors">
                <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">Before / after</div>
                <div className="mt-3 space-y-2">
                  {event.diff.slice(0, 2).map((row) => (
                    <div key={row.field} className="rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3 transition-colors">
                      <div className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">{row.field}</div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                        <div className="rounded-xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface)] dark:bg-slate-950 p-2 text-faith-slate">
                          {row.before}
                        </div>
                        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-2 text-emerald-800 dark:text-emerald-300">
                          {row.after}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[20px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">Evidence integrity</div>
                    <div className="mt-1 text-[13px] font-extrabold text-faith-ink dark:text-slate-100">{event.integrity} chain entry</div>
                  </div>
                  <Pill tone={integrityTone(event.integrity)}>{event.integrity}</Pill>
                </div>
                <div className="mt-2 text-[11px] text-faith-slate">
                  Export pack: {event.exportBundle}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex justify-center">
          <div className="w-[270px] rounded-[34px] bg-slate-950 p-3 shadow-2xl ring-1 ring-slate-800">
            <div className="rounded-[28px] bg-[var(--fh-surface-bg)] dark:bg-slate-900 overflow-hidden">
              <div className="border-b border-faith-line dark:border-slate-800 px-4 py-3">
                <div className="text-[10px] font-black uppercase tracking-[0.08em] text-faith-slate">Mobile review</div>
                <div className="mt-1 text-[14px] font-black text-faith-ink dark:text-slate-100">{event.id}</div>
              </div>
              <div className="p-4 space-y-3">
                <div className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3">
                  <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">{event.action}</div>
                  <div className="mt-1 text-[11px] text-faith-slate">{event.objectLabel}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Pill tone={severityTone(event.severity)}>{event.severity}</Pill>
                    <Pill tone={integrityTone(event.integrity)}>{event.integrity}</Pill>
                  </div>
                </div>

                <div className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3">
                  <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">Actor</div>
                  <div className="mt-1 text-[12px] font-extrabold text-faith-ink dark:text-slate-100">{event.actor}</div>
                  <div className="text-[11px] text-faith-slate">{event.actorRole}</div>
                </div>

                <div className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3">
                  <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">Chain state</div>
                  <div className="mt-1 text-[12px] font-extrabold text-faith-ink dark:text-slate-100">
                    {event.integrity} · {event.sessionLabel}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-3">
        <div className="rounded-[22px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3 transition-colors">
          <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">What this page protects</div>
          <div className="mt-2 space-y-2">
            <div className="rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3 transition-colors">
              <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Roles & sensitive actions</div>
              <div className="mt-1 text-[11px] text-faith-slate">Who changed what, why, and under which approval path.</div>
            </div>
            <div className="rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3 transition-colors">
              <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Publishing and finance trust</div>
              <div className="mt-1 text-[11px] text-faith-slate">Replay publishing, donation settings, payout rails, and receipt edits.</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

const initialEvents: AuditEvent[] = [
  {
    id: "AUD-88413",
    timestampISO: "2026-04-12T10:42:00",
    domain: "Roles & Permissions",
    severity: "Sensitive",
    integrity: "Verified",
    action: "Role template updated",
    actor: "Rachel Admin",
    actorRole: "Workspace Owner",
    objectLabel: "Finance Manager access · Kampala Central",
    objectType: "Role assignment",
    campus: "Kampala Central",
    surface: "Roles & Permissions",
    summary:
      "Manual payout approval was enabled for finance managers on the Kampala Central workspace scope.",
    sessionLabel: "Session 9F2C · Signed",
    ipLabel: "102.89.14.55 · Kampala",
    deviceLabel: "Chrome on Windows · Trusted device",
    approvalPath: "Owner ? Finance Lead",
    linkedPage: "Roles & Permissions",
    exportBundle: "Role change evidence pack",
    tags: ["Payout approvals", "Sensitive action", "Approved"],
    diff: [
      { field: "Manual payout approval", before: "Disabled", after: "Enabled" },
      { field: "Workspace scope", before: "Read-only finance", after: "Finance + payout approvals" },
      { field: "Approval routing", before: "Owner only", after: "Owner + finance lead" },
    ],
    related: [
      "AUD-88409 · Access review completed",
      "AUD-88398 · Role template duplicated",
      "AUD-88390 · Finance owner acknowledged update",
    ],
    note:
      "The change was approved during the morning finance governance window and propagated to the live wallet surface.",
  },
  {
    id: "AUD-88407",
    timestampISO: "2026-04-12T09:58:00",
    domain: "Publishing",
    severity: "Informational",
    integrity: "Verified",
    action: "Replay published",
    actor: "Miriam Producer",
    actorRole: "Post-live Editor",
    objectLabel: "Sunday Worship Replay · Easter at Dawn",
    objectType: "Replay package",
    campus: "Global Digital Campus",
    surface: "Post-live Publishing",
    summary:
      "Replay visibility was switched from scheduled to public after chapters, notes, and resources passed quality review.",
    sessionLabel: "Publish batch 31A",
    ipLabel: "102.91.44.14 · Remote editor",
    deviceLabel: "Safari on macOS · Trusted device",
    approvalPath: "Producer ? Communications lead",
    linkedPage: "Post-live Publishing",
    exportBundle: "Publishing proof bundle",
    tags: ["Replay", "Notes attached", "Search enabled"],
    diff: [
      { field: "Visibility", before: "Scheduled release", after: "Public" },
      { field: "Transcript confidence", before: "82%", after: "97%" },
      { field: "Featured placement", before: "Off", after: "Homepage + series rail" },
    ],
    related: [
      "AUD-88370 · Clip generation completed",
      "AUD-88361 · Notes approved",
      "AUD-88352 · Thumbnail updated",
    ],
    note:
      "Publishing action also triggered replay-ready notifications and search indexing across the teaching library.",
  },
  {
    id: "AUD-88396",
    timestampISO: "2026-04-12T09:11:00",
    domain: "Moderation",
    severity: "Elevated",
    integrity: "Pending",
    action: "Safeguard threshold edited",
    actor: "Joseph Trust",
    actorRole: "Moderation Lead",
    objectLabel: "Live chat link filter · Children & Youth pack",
    objectType: "Policy threshold",
    campus: "Nairobi Fellowship Hub",
    surface: "Moderation Settings",
    summary:
      "Allowed link threshold was tightened for live chat on youth-facing surfaces while policy validation runs.",
    sessionLabel: "Policy draft 4C1",
    ipLabel: "197.248.33.24 · Nairobi",
    deviceLabel: "Edge on Windows · Managed device",
    approvalPath: "Moderation lead ? Compliance review",
    linkedPage: "Moderation Settings",
    exportBundle: "Safeguard configuration pack",
    tags: ["Youth safety", "Pending review", "Threshold update"],
    diff: [
      { field: "Allowed links per message", before: "2", after: "0" },
      { field: "Auto-hold severity", before: "Medium", after: "High" },
      { field: "Escalation target", before: "General mods", after: "Youth safety queue" },
    ],
    related: [
      "AUD-88391 · Child-safe policy sync started",
      "AUD-88387 · Forum rule inherited",
      "AUD-88372 · Prayer Journal reply safeguard reviewed",
    ],
    note:
      "Integrity remains pending until the linked moderation policy pack is signed by compliance and re-published.",
  },
  {
    id: "AUD-88382",
    timestampISO: "2026-04-12T08:34:00",
    domain: "Finance",
    severity: "Critical",
    integrity: "Flagged",
    action: "Payout destination changed",
    actor: "Samuel Finance",
    actorRole: "Finance Manager",
    objectLabel: "Primary wallet payout account",
    objectType: "Payout rail",
    campus: "Kampala Central",
    surface: "Wallet & Payouts",
    summary:
      "Primary payout destination was edited and automatically flagged for investigation because the routing country changed.",
    sessionLabel: "Payout review C81",
    ipLabel: "197.220.87.11 · Kampala",
    deviceLabel: "Chrome on Android · New device",
    approvalPath: "Finance manager ? Security review",
    linkedPage: "Wallet & Payouts",
    exportBundle: "Finance change evidence pack",
    tags: ["Flagged", "New device", "Country mismatch"],
    diff: [
      { field: "Destination bank", before: "Equity Uganda", after: "Equity Kenya" },
      { field: "Verification state", before: "Verified", after: "Needs review" },
      { field: "Release threshold", before: "Auto", after: "Manual hold" },
    ],
    related: [
      "AUD-88381 · Device trust challenge started",
      "AUD-88380 · Security owner notified",
      "AUD-88379 · Wallet release paused",
    ],
    note:
      "This event triggered a manual hold, elevated notifications, and a linked investigation path for finance stewardship.",
  },
  {
    id: "AUD-88365",
    timestampISO: "2026-04-11T20:12:00",
    domain: "Workspace",
    severity: "Informational",
    integrity: "Verified",
    action: "Localization fallback updated",
    actor: "Amara Ops",
    actorRole: "Workspace Admin",
    objectLabel: "Swahili campus public surfaces",
    objectType: "Localization default",
    campus: "Nairobi Fellowship Hub",
    surface: "Workspace Settings",
    summary:
      "Fallback language was changed to English (Kenya) for public notices and event confirmations across Nairobi surfaces.",
    sessionLabel: "Workspace sync B12",
    ipLabel: "102.67.51.20 · Nairobi",
    deviceLabel: "Safari on iPad · Trusted device",
    approvalPath: "Workspace admin",
    linkedPage: "Workspace Settings",
    exportBundle: "Workspace settings pack",
    tags: ["Localization", "Public surfaces", "Campus default"],
    diff: [
      { field: "Fallback locale", before: "Swahili", after: "English (Kenya)" },
      { field: "Affected surfaces", before: "Events only", after: "Events + notices + reminders" },
    ],
    related: [
      "AUD-88360 · Locale QA completed",
      "AUD-88352 · Noticeboard preview updated",
    ],
    note:
      "Change was low risk but logged for downstream noticeboard, notifications, and event reminder surfaces.",
  },
  {
    id: "AUD-88348",
    timestampISO: "2026-04-11T18:03:00",
    domain: "Admin",
    severity: "Sensitive",
    integrity: "Verified",
    action: "SSO policy revised",
    actor: "David Owner",
    actorRole: "Institution Owner",
    objectLabel: "Workspace authentication controls",
    objectType: "Admin setting",
    campus: "Global",
    surface: "Provider admin controls",
    summary:
      "Single-sign-on enforcement was enabled for leadership, finance, and trust roles ahead of the quarterly security review.",
    sessionLabel: "Security change 2A8",
    ipLabel: "102.88.11.90 · London",
    deviceLabel: "Firefox on macOS · Trusted device",
    approvalPath: "Owner ? Security lead",
    linkedPage: "Provider admin controls",
    exportBundle: "Authentication governance pack",
    tags: ["SSO", "Leadership", "Sensitive"],
    diff: [
      { field: "SSO enforcement", before: "Optional", after: "Required for sensitive roles" },
      { field: "Fallback login", before: "Password allowed", after: "Owner approval only" },
    ],
    related: [
      "AUD-88345 · Leadership roster sync",
      "AUD-88341 · Role access check complete",
    ],
    note:
      "The update also changed how protected actions surface in the audit ledger and how escalations are routed.",
  },
  {
    id: "AUD-88331",
    timestampISO: "2026-04-11T14:26:00",
    domain: "Finance",
    severity: "Elevated",
    integrity: "Verified",
    action: "Receipt footer edited",
    actor: "Naomi Finance",
    actorRole: "Donor Experience Lead",
    objectLabel: "Recurring support receipt template",
    objectType: "Donor receipt",
    campus: "London Prayer House",
    surface: "Donations & Funds",
    summary:
      "Receipt language and accountability notes were updated for recurring donor confirmations.",
    sessionLabel: "Receipt template rev 7",
    ipLabel: "51.148.24.11 · London",
    deviceLabel: "Chrome on macOS · Trusted device",
    approvalPath: "Finance lead ? Communications",
    linkedPage: "Donations & Funds",
    exportBundle: "Donor template evidence pack",
    tags: ["Receipts", "Recurring support", "Compliance note"],
    diff: [
      { field: "Footer note", before: "General support", after: "General support + accountability reference" },
      { field: "Reply contact", before: "N/A", after: "finance@workspace.org" },
    ],
    related: [
      "AUD-88330 · Email sender preview updated",
      "AUD-88328 · Donor insights sync complete",
    ],
    note:
      "No payout logic changed, but donor-facing trust copy and finance ownership references were captured.",
  },
  {
    id: "AUD-88318",
    timestampISO: "2026-04-11T11:02:00",
    domain: "Publishing",
    severity: "Elevated",
    integrity: "Verified",
    action: "Series artwork replaced",
    actor: "Leah Creative",
    actorRole: "Communications Designer",
    objectLabel: "Hope in Waiting · Series landing",
    objectType: "Series metadata",
    campus: "Global Digital Campus",
    surface: "Series Builder",
    summary:
      "Primary cover art and thumbnail treatment were refreshed ahead of the next episode launch and Beacon promotion push.",
    sessionLabel: "Series pack 5H1",
    ipLabel: "102.89.90.31 · Remote designer",
    deviceLabel: "Safari on macOS · Trusted device",
    approvalPath: "Designer ? Pastor approval",
    linkedPage: "Series Builder",
    exportBundle: "Creative revision bundle",
    tags: ["Series", "Artwork", "Beacon-ready"],
    diff: [
      { field: "Hero artwork", before: "Blue dawn theme", after: "Warm sunrise theme" },
      { field: "CTA placement", before: "Lower shelf", after: "Primary hero area" },
    ],
    related: [
      "AUD-88311 · Beacon recommendation created",
      "AUD-88302 · Episode summary approved",
    ],
    note:
      "The change improved consistency across the series landing page, replay covers, and Beacon ad creative variants.",
  },
  {
    id: "AUD-88304",
    timestampISO: "2026-04-11T08:41:00",
    domain: "Moderation",
    severity: "Informational",
    integrity: "Verified",
    action: "Case outcome finalized",
    actor: "Grace Moderator",
    actorRole: "Moderator",
    objectLabel: "Prayer Journal reply incident",
    objectType: "Trust case",
    campus: "Global Digital Campus",
    surface: "Reviews & Moderation",
    summary:
      "A reported reply on Prayer Journal was reviewed, resolved, and documented with a follow-up safeguard note.",
    sessionLabel: "Case 44-PRJ",
    ipLabel: "102.89.31.17 · Kampala",
    deviceLabel: "Chrome on Windows · Trusted device",
    approvalPath: "Moderator ? Trust lead",
    linkedPage: "Reviews & Moderation",
    exportBundle: "Case history bundle",
    tags: ["Prayer Journal", "Resolved", "Safeguard note"],
    diff: [
      { field: "Case status", before: "Open", after: "Resolved" },
      { field: "Follow-up", before: "Pending", after: "Completed" },
    ],
    related: [
      "AUD-88301 · Safety note published",
      "AUD-88297 · User restriction lifted",
    ],
    note:
      "Case resolution fed back into moderation learnings and was preserved for future precedent review.",
  },
];

export default function AuditLogPage() {
  const [events] = useState<AuditEvent[]>(initialEvents);
  const [savedView, setSavedView] = useState<SavedViewKey>("all");
  const [domainFilter, setDomainFilter] = useState<AuditDomain | "All">("All");
  const [severityFilter, setSeverityFilter] = useState<AuditSeverity | "All">("All");
  const [integrityFilter, setIntegrityFilter] = useState<IntegrityState | "All">("All");
  const [highRiskOnly, setHighRiskOnly] = useState(false);
  const [exportReadyOnly, setExportReadyOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [investigationOpen, setInvestigationOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(events[0]?.id || "");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (savedView === "all") {
      setDomainFilter("All");
      setSeverityFilter("All");
      setIntegrityFilter("All");
      setHighRiskOnly(false);
      setExportReadyOnly(false);
      return;
    }
    if (savedView === "sensitive") {
      setDomainFilter("All");
      setSeverityFilter("Sensitive");
      setIntegrityFilter("All");
      setHighRiskOnly(true);
      setExportReadyOnly(false);
      return;
    }
    if (savedView === "finance") {
      setDomainFilter("Finance");
      setSeverityFilter("All");
      setIntegrityFilter("All");
      setHighRiskOnly(false);
      setExportReadyOnly(false);
      return;
    }
    if (savedView === "publishing") {
      setDomainFilter("Publishing");
      setSeverityFilter("All");
      setIntegrityFilter("All");
      setHighRiskOnly(false);
      setExportReadyOnly(false);
      return;
    }
    if (savedView === "moderation") {
      setDomainFilter("Moderation");
      setSeverityFilter("All");
      setIntegrityFilter("All");
      setHighRiskOnly(false);
      setExportReadyOnly(false);
      return;
    }
    if (savedView === "admin") {
      setDomainFilter("Admin");
      setSeverityFilter("All");
      setIntegrityFilter("All");
      setHighRiskOnly(false);
      setExportReadyOnly(true);
    }
  }, [savedView]);

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();

    return events
      .filter((event) => {
        if (domainFilter !== "All" && event.domain !== domainFilter) return false;
        if (severityFilter !== "All" && event.severity !== severityFilter) return false;
        if (integrityFilter !== "All" && event.integrity !== integrityFilter) return false;
        if (highRiskOnly && !["Sensitive", "Critical"].includes(event.severity)) return false;
        if (exportReadyOnly && event.integrity !== "Verified") return false;

        if (!q) return true;
        return [
          event.id,
          event.action,
          event.actor,
          event.actorRole,
          event.objectLabel,
          event.domain,
          event.surface,
          event.summary,
          event.campus,
          ...event.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) => +new Date(b.timestampISO) - +new Date(a.timestampISO));
  }, [domainFilter, events, exportReadyOnly, highRiskOnly, integrityFilter, search, severityFilter]);

  useEffect(() => {
    if (!filteredEvents.length) return;
    const stillVisible = filteredEvents.some((event) => event.id === selectedId);
    if (!stillVisible) setSelectedId(filteredEvents[0].id);
  }, [filteredEvents, selectedId]);

  const selectedEvent =
    filteredEvents.find((event) => event.id === selectedId) || filteredEvents[0] || events[0];

  const eventsLogged = filteredEvents.length;
  const signedEvents = filteredEvents.filter((event) => event.integrity === "Verified").length;
  const flaggedEvents = filteredEvents.filter((event) => event.integrity === "Flagged").length;
  const sensitiveActions = filteredEvents.filter((event) =>
    ["Sensitive", "Critical"].includes(event.severity),
  ).length;
  const governanceConfidence = Math.max(
    82,
    Math.min(
      99,
      Math.round(
        (signedEvents / Math.max(1, filteredEvents.length)) * 100 - flaggedEvents * 1.5,
      ),
    ),
  );
  const exportBundlesReady = filteredEvents.filter((event) => event.integrity === "Verified").length + 6;

  const changeIntelligence = [
    {
      title: "Finance anomaly deserves first review",
      detail:
        "The payout destination change is the highest-risk action in the current window because it combines a new device, country mismatch, and manual hold.",
      tone: "warn" as const,
    },
    {
      title: "Publishing flow looks healthy",
      detail:
        "Replay and series updates are passing with verified integrity and strong approval coverage across the current filtered window.",
      tone: "good" as const,
    },
    {
      title: "Moderation rules still need a signature",
      detail:
        "The youth-safety threshold change remains pending and should be signed before the next live schedule begins.",
      tone: "brand" as const,
    },
  ];

  const openInvestigations = filteredEvents.filter((event) =>
    event.integrity === "Flagged" || event.integrity === "Pending",
  );

  const savedViewCards = [
    { key: "all" as const, label: "All audit events", icon: <History className="h-4 w-4" /> },
    { key: "sensitive" as const, label: "Sensitive actions", icon: <ShieldCheck className="h-4 w-4" /> },
    { key: "finance" as const, label: "Finance & payouts", icon: <Wallet className="h-4 w-4" /> },
    { key: "publishing" as const, label: "Publishing & teaching", icon: <Workflow className="h-4 w-4" /> },
    { key: "moderation" as const, label: "Moderation & trust", icon: <AlertTriangle className="h-4 w-4" /> },
    { key: "admin" as const, label: "Admin & workspace", icon: <UserCog className="h-4 w-4" /> },
  ];


  const domainOptions: Array<AuditDomain | "All"> = [
    "All",
    "Roles & Permissions",
    "Publishing",
    "Moderation",
    "Finance",
    "Admin",
    "Workspace",
  ];
  const severityOptions: Array<AuditSeverity | "All"> = [
    "All",
    "Informational",
    "Elevated",
    "Sensitive",
    "Critical",
  ];
  const integrityOptions: Array<IntegrityState | "All"> = [
    "All",
    "Verified",
    "Pending",
    "Flagged",
  ];

  return (
    <div className="min-h-screen bg-[var(--fh-page-bg)] dark:bg-slate-950 text-faith-ink dark:text-slate-100 transition-colors">
      <div className="mx-auto max-w-[1600px] px-4 py-5 lg:px-5 lg:py-6">
        <div className="rounded-[28px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-5 transition-colors">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1">
              <ProviderPageTitle
                icon={<History className="h-6 w-6" />}
                title="Audit Log"
                subtitle="Immutable-style operational history for role changes, publishing actions, moderation actions, finance changes, and admin events. Use this page to filter activity, verify evidence trails, and investigate high-signal changes without losing institutional context."
              />

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Pill tone="good">Signed event chain active</Pill>
                <Pill>Tamper-evident exports</Pill>
                <Pill tone="warn">2 investigations need review</Pill>
                <Pill>Cross-surface traceability</Pill>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Btn
                tone="primary"
                left={<Download className="h-4 w-4" />}
                onClick={() => {
                  setToast("Audit export bundle prepared");
                }}
              >
                Export Log
              </Btn>
              <Btn tone="neutral" left={<Filter className="h-4 w-4" />} onClick={() => setFilterModalOpen(true)}>
                Filter Events
              </Btn>
              <Btn tone="secondary" left={<Eye className="h-4 w-4" />} onClick={() => setInvestigationOpen(true)}>
                Investigate Change
              </Btn>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-3 transition-colors">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-black text-white" style={{ background: ORANGE }}>
              PREMIUM AUDIT SURFACE
            </div>
            <div className="min-w-0 flex-1 text-[12px] text-faith-slate lg:px-3">
              Immutable-style logging here feeds Roles & Permissions, Workspace Settings, Wallet & Payouts,
              Reviews & Moderation, and every protected provider workflow.
            </div>
            <div className="text-[11px] font-black uppercase tracking-[0.12em] text-faith-slate">
              Integrity · Exports · Investigations
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <MetricCard label="Events in view" value={fmtCompact(eventsLogged)} hint="Filtered activity available for review" accent="green" />
          <MetricCard label="Signed entries" value={fmtCompact(signedEvents)} hint="Integrity verified and export-ready" accent="green" />
          <MetricCard label="Sensitive actions" value={fmtCompact(sensitiveActions)} hint="Needs close stewardship and approval context" accent="orange" />
          <MetricCard label="Flagged entries" value={fmtCompact(flaggedEvents)} hint="Chain or context requires investigation" accent="navy" />
          <MetricCard label="Governance health" value={`${governanceConfidence}%`} hint="Confidence based on verified events and alert load" accent="orange" />
          <MetricCard label="Export packs" value={fmtCompact(exportBundlesReady)} hint="Prepared or available evidence bundles" accent="gray" />
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <Card title="Audit map" subtitle="Saved views for governance, finance, trust, publishing, and admin activity.">
              <div className="space-y-2">
                {savedViewCards.map((item) => (
                  <SavedViewButton
                    key={item.key}
                    active={savedView === item.key}
                    icon={item.icon}
                    label={item.label}
                    onClick={() => setSavedView(item.key)}
                  />
                ))}
              </div>
            </Card>

            <Card title="Governance health" subtitle="High-signal checks shaping the reliability of this audit surface.">
              <div className="space-y-3">
                <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-3 transition-colors">
                  <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">
                    Signed chain coverage remains strong
                  </div>
                  <div className="mt-1 text-[11px] text-faith-slate">
                    Most events in the current window are fully export-ready and linked to a signed session label.
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-3 transition-colors">
                  <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">
                    Pending moderation policy signature
                  </div>
                  <div className="mt-1 text-[11px] text-faith-slate">
                    Youth-safety filter updates should be signed before the next live schedule window opens.
                  </div>
                </div>

                <div className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3 transition-colors">
                  <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">
                    Last export
                  </div>
                  <div className="mt-1 text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Today · 10:18 AM</div>
                  <div className="mt-1 text-[11px] text-faith-slate">
                    Evidence package shared with leadership and finance review.
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Open investigations" subtitle="Priority entries needing deeper review, escalation, or evidence export.">
              <div className="space-y-2">
                {openInvestigations.length ? (
                  openInvestigations.map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => {
                        setSelectedId(event.id);
                        setInvestigationOpen(true);
                      }}
                      className="w-full rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3 text-left transition-colors hover:bg-[var(--fh-surface-bg)] dark:hover:bg-slate-900"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-[12px] font-extrabold text-faith-ink dark:text-slate-100">
                            {event.action}
                          </div>
                          <div className="mt-0.5 truncate text-[11px] text-faith-slate">
                            {event.objectLabel}
                          </div>
                        </div>
                        <Pill tone={integrityTone(event.integrity)}>{event.integrity}</Pill>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3 text-[11px] text-faith-slate">
                    No open investigations in the current filter view.
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card
              title="Event ledger"
              subtitle="Filterable operational history for role changes, publishing actions, moderation outcomes, finance changes, and admin events."
              right={<Pill tone="good">{filteredEvents.length} events visible</Pill>}
            >
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faith-slate" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search actor, action, object, page, tag, or event ID"
                    className="w-full rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 pl-10 pr-4 py-2.5 text-[12px] font-semibold text-faith-ink dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-200 dark:focus:ring-amber-800 transition-colors"
                  />
                </div>
                <Btn tone="neutral" left={<SlidersHorizontal className="h-4 w-4" />} onClick={() => setFilterModalOpen(true)}>
                  Advanced filters
                </Btn>
                <Btn
                  tone="neutral"
                  left={<Copy className="h-4 w-4" />}
                  onClick={() => {
                    copyText(selectedEvent?.id || "");
                    setToast("Event ID copied");
                  }}
                >
                  Copy ID
                </Btn>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Pill>{domainFilter === "All" ? "All domains" : domainFilter}</Pill>
                <Pill>{severityFilter === "All" ? "All severities" : severityFilter}</Pill>
                <Pill>{integrityFilter === "All" ? "All integrity states" : integrityFilter}</Pill>
                {highRiskOnly ? <Pill tone="warn">High-risk only</Pill> : null}
                {exportReadyOnly ? <Pill tone="good">Export-ready only</Pill> : null}
              </div>

              <div className="mt-4 space-y-3">
                {filteredEvents.map((event) => (
                  <AuditEventRow
                    key={event.id}
                    event={event}
                    selected={selectedEvent?.id === event.id}
                    onSelect={() => setSelectedId(event.id)}
                    onInvestigate={() => {
                      setSelectedId(event.id);
                      setInvestigationOpen(true);
                    }}
                  />
                ))}
                {!filteredEvents.length ? (
                  <div className="rounded-[24px] border border-dashed border-slate-300 dark:border-slate-700 bg-[var(--fh-surface)] dark:bg-slate-950 p-8 text-center transition-colors">
                    <div className="text-[14px] font-black text-faith-ink dark:text-slate-100">No events match this filter set</div>
                    <div className="mt-1 text-[12px] text-faith-slate">
                      Clear one or more filters or broaden your saved view to restore activity.
                    </div>
                  </div>
                ) : null}
              </div>
            </Card>

            <div className="grid gap-4 lg:grid-cols-3">
              {changeIntelligence.map((item) => (
                <Card
                  key={item.title}
                  title={item.title}
                  subtitle="Change intelligence"
                  right={
                    <Pill tone={item.tone === "good" ? "good" : item.tone === "warn" ? "warn" : "brand"}>
                      {item.tone === "good" ? "Healthy" : item.tone === "warn" ? "Review" : "Signal"}
                    </Pill>
                  }
                >
                  <div className="text-[12px] leading-5 text-faith-slate">{item.detail}</div>
                </Card>
              ))}
            </div>

            <Card title="Selected event evidence" subtitle="Detailed fields, change diff, and export context for the current event.">
              {selectedEvent ? (
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                  <div className="space-y-3">
                    <div className="rounded-[22px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3 transition-colors">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-[13px] font-black text-faith-ink dark:text-slate-100">{selectedEvent.action}</div>
                        <Pill tone={severityTone(selectedEvent.severity)}>{selectedEvent.severity}</Pill>
                        <Pill tone={integrityTone(selectedEvent.integrity)}>{selectedEvent.integrity}</Pill>
                      </div>
                      <div className="mt-2 text-[12px] text-faith-slate">{selectedEvent.summary}</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedEvent.tags.map((tag) => (
                          <Pill key={tag}>{tag}</Pill>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3 transition-colors">
                      <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">Before / after</div>
                      <div className="mt-3 space-y-2">
                        {selectedEvent.diff.map((row) => (
                          <div key={row.field} className="rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3 transition-colors">
                            <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">{row.field}</div>
                            <div className="mt-2 grid gap-2 sm:grid-cols-2">
                              <div className="rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface)] dark:bg-slate-950 p-3">
                                <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">Before</div>
                                <div className="mt-1 text-[12px] text-faith-slate">{row.before}</div>
                              </div>
                              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-3">
                                <div className="text-[10px] uppercase tracking-[0.08em] text-emerald-800 dark:text-emerald-300">After</div>
                                <div className="mt-1 text-[12px] text-emerald-800 dark:text-emerald-300">{row.after}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-[22px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3 transition-colors">
                      <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">Actor & surface</div>
                      <div className="mt-2 text-[13px] font-black text-faith-ink dark:text-slate-100">{selectedEvent.actor}</div>
                      <div className="mt-1 text-[11px] text-faith-slate">{selectedEvent.actorRole}</div>
                      <div className="mt-3 space-y-2 text-[11px] text-faith-slate">
                        <div>Surface: <span className="font-semibold text-faith-ink dark:text-slate-100">{selectedEvent.surface}</span></div>
                        <div>Object type: <span className="font-semibold text-faith-ink dark:text-slate-100">{selectedEvent.objectType}</span></div>
                        <div>Campus: <span className="font-semibold text-faith-ink dark:text-slate-100">{selectedEvent.campus}</span></div>
                        <div>Approval path: <span className="font-semibold text-faith-ink dark:text-slate-100">{selectedEvent.approvalPath}</span></div>
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3 transition-colors">
                      <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">Device & integrity</div>
                      <div className="mt-2 space-y-2 text-[11px] text-faith-slate">
                        <div>{selectedEvent.deviceLabel}</div>
                        <div>{selectedEvent.ipLabel}</div>
                        <div>{selectedEvent.sessionLabel}</div>
                      </div>
                      <div className="mt-3 rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3 transition-colors">
                        <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">{selectedEvent.exportBundle}</div>
                        <div className="mt-1 text-[11px] text-faith-slate">
                          Ready to export with chain state, before/after proof, actor metadata, and linked related events.
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3 transition-colors">
                      <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">Related events</div>
                      <div className="mt-2 space-y-2">
                        {selectedEvent.related.map((item) => (
                          <div key={item} className="rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3 text-[11px] text-faith-slate transition-colors">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </Card>
          </div>

          <PreviewRail mode={previewMode} setMode={setPreviewMode} event={selectedEvent} />
        </div>
      </div>

      <Modal
        open={filterModalOpen}
        title="Filter audit events"
        subtitle="Slice the ledger by domain, severity, integrity state, and export readiness."
        onClose={() => setFilterModalOpen(false)}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Card title="Domain" subtitle="Filter by workflow or operational surface.">
            <div className="flex flex-wrap gap-2">
              {domainOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDomainFilter(option)}
                  className={cx(
                    "rounded-full border px-3 py-1.5 text-[12px] font-extrabold transition-colors",
                    domainFilter === option
                      ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-faith-ink dark:text-slate-100"
                      : "bg-[var(--fh-surface-bg)] dark:bg-slate-900 border-faith-line dark:border-slate-700 text-faith-slate dark:text-slate-300",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </Card>

          <Card title="Severity" subtitle="Focus on the risk level of each action.">
            <div className="flex flex-wrap gap-2">
              {severityOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSeverityFilter(option)}
                  className={cx(
                    "rounded-full border px-3 py-1.5 text-[12px] font-extrabold transition-colors",
                    severityFilter === option
                      ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-faith-ink dark:text-slate-100"
                      : "bg-[var(--fh-surface-bg)] dark:bg-slate-900 border-faith-line dark:border-slate-700 text-faith-slate dark:text-slate-300",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </Card>

          <Card title="Integrity" subtitle="See only verified, pending, or flagged entries.">
            <div className="flex flex-wrap gap-2">
              {integrityOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setIntegrityFilter(option)}
                  className={cx(
                    "rounded-full border px-3 py-1.5 text-[12px] font-extrabold transition-colors",
                    integrityFilter === option
                      ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-faith-ink dark:text-slate-100"
                      : "bg-[var(--fh-surface-bg)] dark:bg-slate-900 border-faith-line dark:border-slate-700 text-faith-slate dark:text-slate-300",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Card title="Priority toggles" subtitle="Quick controls for investigation and export workflows.">
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setHighRiskOnly((value) => !value)}
                className={cx(
                  "w-full rounded-2xl border p-3 text-left transition-colors",
                  highRiskOnly
                    ? "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20"
                    : "border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">High-risk only</div>
                    <div className="mt-1 text-[11px] text-faith-slate">
                      Show sensitive and critical actions that deserve leadership review first.
                    </div>
                  </div>
                  <Pill tone={highRiskOnly ? "warn" : "neutral"}>{highRiskOnly ? "On" : "Off"}</Pill>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setExportReadyOnly((value) => !value)}
                className={cx(
                  "w-full rounded-2xl border p-3 text-left transition-colors",
                  exportReadyOnly
                    ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Export-ready only</div>
                    <div className="mt-1 text-[11px] text-faith-slate">
                      Keep only fully verified entries with evidence packs ready for download.
                    </div>
                  </div>
                  <Pill tone={exportReadyOnly ? "good" : "neutral"}>{exportReadyOnly ? "On" : "Off"}</Pill>
                </div>
              </button>
            </div>
          </Card>

          <Card title="Filter results" subtitle="The ledger updates immediately as filters change.">
            <div className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4 transition-colors">
              <div className="text-[28px] font-black tracking-[-0.03em] text-faith-ink dark:text-slate-100">
                {filteredEvents.length}
              </div>
              <div className="mt-1 text-[12px] text-faith-slate">
                events match your current filter combination.
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Btn
                  tone="primary"
                  left={<CheckCircle2 className="h-4 w-4" />}
                  onClick={() => setFilterModalOpen(false)}
                >
                  Apply filters
                </Btn>
                <Btn
                  tone="neutral"
                  left={<X className="h-4 w-4" />}
                  onClick={() => {
                    setDomainFilter("All");
                    setSeverityFilter("All");
                    setIntegrityFilter("All");
                    setHighRiskOnly(false);
                    setExportReadyOnly(false);
                    setSearch("");
                    setSavedView("all");
                  }}
                >
                  Reset filters
                </Btn>
              </div>
            </div>
          </Card>
        </div>
      </Modal>

      <Modal
        open={investigationOpen}
        title={selectedEvent ? `${selectedEvent.id} · ${selectedEvent.action}` : "Investigate change"}
        subtitle="Investigation view with actor context, approval routing, evidence trail, and export actions."
        onClose={() => setInvestigationOpen(false)}
      >
        {selectedEvent ? (
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <Card
                title="Event summary"
                subtitle={selectedEvent.objectLabel}
                right={<Pill tone={integrityTone(selectedEvent.integrity)}>{selectedEvent.integrity}</Pill>}
              >
                <div className="text-[12px] leading-6 text-faith-slate">
                  {selectedEvent.summary}
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3">
                    <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">Actor</div>
                    <div className="mt-1 text-[12px] font-extrabold text-faith-ink dark:text-slate-100">{selectedEvent.actor}</div>
                    <div className="mt-1 text-[11px] text-faith-slate">{selectedEvent.actorRole}</div>
                  </div>
                  <div className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3">
                    <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">Approval path</div>
                    <div className="mt-1 text-[12px] font-extrabold text-faith-ink dark:text-slate-100">{selectedEvent.approvalPath}</div>
                    <div className="mt-1 text-[11px] text-faith-slate">{selectedEvent.linkedPage}</div>
                  </div>
                  <div className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3">
                    <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">Device + location</div>
                    <div className="mt-1 text-[12px] font-extrabold text-faith-ink dark:text-slate-100">{selectedEvent.deviceLabel}</div>
                    <div className="mt-1 text-[11px] text-faith-slate">{selectedEvent.ipLabel}</div>
                  </div>
                  <div className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3">
                    <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">Chain label</div>
                    <div className="mt-1 text-[12px] font-extrabold text-faith-ink dark:text-slate-100">{selectedEvent.sessionLabel}</div>
                    <div className="mt-1 text-[11px] text-faith-slate">Timestamp · {formatDateTime(selectedEvent.timestampISO)}</div>
                  </div>
                </div>
              </Card>

              <Card title="Investigation controls" subtitle="Fast operational actions while context is still fresh.">
                <div className="space-y-3">
                  <Btn
                    tone="primary"
                    left={<Download className="h-4 w-4" />}
                    onClick={() => setToast("Evidence export prepared")}
                  >
                    Export evidence bundle
                  </Btn>
                  <Btn
                    tone="secondary"
                    left={<ExternalLink className="h-4 w-4" />}
                    onClick={() => setToast("Escalation draft opened")}
                  >
                    Escalate to owner
                  </Btn>
                  <Btn
                    tone="neutral"
                    left={<Copy className="h-4 w-4" />}
                    onClick={() => {
                      copyText(selectedEvent.id);
                      setToast("Investigation ID copied");
                    }}
                  >
                    Copy event ID
                  </Btn>
                </div>

                <div className="mt-4 rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3">
                  <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">Analyst note</div>
                  <div className="mt-2 text-[12px] leading-5 text-faith-slate">
                    {selectedEvent.note}
                  </div>
                </div>
              </Card>
            </div>

            <Card title="Field diff" subtitle="The exact state transitions captured by this audit entry.">
              <div className="space-y-3">
                {selectedEvent.diff.map((row) => (
                  <div key={row.field} className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3 transition-colors">
                    <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">{row.field}</div>
                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                      <div className="rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3">
                        <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">Before</div>
                        <div className="mt-1 text-[12px] text-faith-slate">{row.before}</div>
                      </div>
                      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-3">
                        <div className="text-[10px] uppercase tracking-[0.08em] text-emerald-800 dark:text-emerald-300">After</div>
                        <div className="mt-1 text-[12px] text-emerald-800 dark:text-emerald-300">{row.after}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Related chain events" subtitle="Neighbouring activity that explains how the change moved through the workspace.">
              <div className="grid gap-3 md:grid-cols-3">
                {selectedEvent.related.map((item) => (
                  <div key={item} className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-3 text-[11px] text-faith-slate transition-colors">
                    {item}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : null}
      </Modal>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-[130] -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-[12px] font-extrabold text-white shadow-xl dark:bg-slate-100 dark:text-faith-ink">
          {toast}
        </div>
      ) : null}
    </div>
  );
}








