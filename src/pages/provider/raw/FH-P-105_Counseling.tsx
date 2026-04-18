// @ts-nocheck

"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Copy,
  Eye,
  ExternalLink,
  FileText,
  HeartHandshake,
  Link2,
  Lock,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { handleRawPlaceholderAction } from "./placeholderActions";
import { navigateWithRouter } from "@/navigation/routerNavigate";

/**
 * FaithHub — FH-P-105 Counseling
 * ------------------------------
 * Private-first pastoral care and counseling workspace for cases, intake,
 * scheduling, counselor assignment, session planning, notes, and safeguarding.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_NAVY = "#1e2b6d";

const ROUTES = {
  providerDashboard: "/faithhub/provider/dashboard",
  prayerRequests: "/faithhub/provider/prayer-requests",
  communityGroups: "/faithhub/provider/community-groups",
  rolesPermissions: "/faithhub/provider/roles-permissions",
  noticeboard: "/faithhub/provider/noticeboard",
  counselingBuilder: "/faithhub/provider/counseling/new",
};

const HERO_1 =
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80";
const HERO_2 =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80";
const HERO_3 =
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80";
const HERO_4 =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80";

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  navigateWithRouter(url);
}

function fmtInt(n: number) {
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function fmtLocal(iso?: string) {
  if (!iso) return "Not scheduled";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type CaseStatus =
  | "New intake"
  | "Assigned"
  | "Scheduled"
  | "In session"
  | "Follow-up"
  | "Closed"
  | "Escalated";
type CasePriority = "Standard" | "High" | "Critical";
type CaseSource =
  | "Prayer Request"
  | "Community Group"
  | "Direct Intake"
  | "Referral"
  | "Event";
type PrivacyMode = "Private" | "Restricted" | "Pastoral team";
type PreviewMode = "desktop" | "mobile";

type Counselor = {
  id: string;
  name: string;
  role: string;
  campus: string;
  focus: string;
  languages: string[];
  activeCases: number;
  availability: string;
};

type SafeguardSignal = {
  id: string;
  label: string;
  hint: string;
  tone: "good" | "warn" | "danger";
};

type SessionCheckpoint = {
  id: string;
  label: string;
  when: string;
  state: "Ready" | "Pending" | "Done" | "Blocked";
};

type CounselingCaseRecord = {
  id: string;
  reference: string;
  title: string;
  counselee: string;
  campus: string;
  region: string;
  source: CaseSource;
  status: CaseStatus;
  priority: CasePriority;
  privacy: PrivacyMode;
  category: string;
  summary: string;
  intakeNotes: string;
  submittedISO: string;
  nextSessionISO?: string;
  counselorId?: string;
  childSafe: boolean;
  publishConsent: boolean;
  linkedPrayerRequest?: string;
  linkedGroup?: string;
  linkedNoticeboard?: string;
  tags: string[];
  heroUrl: string;
  safeguards: SafeguardSignal[];
  checkpoints: SessionCheckpoint[];
};

type PathwayTemplate = {
  id: string;
  title: string;
  description: string;
  hint: string;
  accent: "green" | "orange" | "navy";
};

const counselorsSeed: Counselor[] = [
  {
    id: "counselor-miriam",
    name: "Pastor Miriam A.",
    role: "Lead counselor",
    campus: "Kampala Central",
    focus: "Family care + crisis response",
    languages: ["English", "Luganda"],
    activeCases: 7,
    availability: "Available today",
  },
  {
    id: "counselor-daniel",
    name: "Daniel K.",
    role: "Follow-up coordinator",
    campus: "Online first",
    focus: "Grief support + restoration",
    languages: ["English", "Swahili"],
    activeCases: 10,
    availability: "On-call",
  },
  {
    id: "counselor-ruth",
    name: "Ruth S.",
    role: "Youth safeguarding lead",
    campus: "Entebbe South",
    focus: "Youth care + escalation review",
    languages: ["English", "French"],
    activeCases: 4,
    availability: "At capacity",
  },
  {
    id: "counselor-esther",
    name: "Esther M.",
    role: "Women ministry counselor",
    campus: "Kampala West",
    focus: "Marriage + women care lane",
    languages: ["English", "Luganda"],
    activeCases: 5,
    availability: "Tomorrow morning",
  },
];

const casesSeed: CounselingCaseRecord[] = [
  {
    id: "case-105",
    reference: "CS-105",
    title: "Family crisis and peace-restoration pathway",
    counselee: "Angela M.",
    campus: "Kampala Central",
    region: "Uganda",
    source: "Prayer Request",
    status: "Scheduled",
    priority: "Critical",
    privacy: "Private",
    category: "Family care",
    summary:
      "Family conflict escalated after a live prayer request. The case now needs pastoral counseling, a structured care plan, and a privacy-first session setup.",
    intakeNotes:
      "Initial intake came through the evening prayer live. The requester asked for pastoral counseling, prayer coverage, and practical mediation support. Children are present in the household so communication defaults remain private-first.",
    submittedISO: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    nextSessionISO: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
    counselorId: "counselor-miriam",
    childSafe: false,
    publishConsent: false,
    linkedPrayerRequest: "Evening Prayer Revival",
    linkedGroup: "Family Restoration Circle",
    tags: ["Urgent", "Prayer follow-up", "Family", "Pastoral care"],
    heroUrl: HERO_1,
    safeguards: [
      {
        id: "sg-1",
        label: "Critical family care lane",
        hint: "The case entered through the crisis-routing rule and should stay private.",
        tone: "danger",
      },
      {
        id: "sg-2",
        label: "Prayer bridge linked",
        hint: "Prayer team remains attached for encouragement and coverage notes.",
        tone: "good",
      },
      {
        id: "sg-3",
        label: "No public publishing consent",
        hint: "Testimony or noticeboard surfacing stays disabled by default.",
        tone: "warn",
      },
    ],
    checkpoints: [
      { id: "cp-1", label: "Intake reviewed", when: "Today · 11:30 AM", state: "Done" },
      { id: "cp-2", label: "Counselor assigned", when: "Today · 12:15 PM", state: "Done" },
      { id: "cp-3", label: "Private session booked", when: "Tomorrow · 7:00 PM", state: "Ready" },
      { id: "cp-4", label: "Follow-up summary", when: "After session", state: "Pending" },
    ],
  },
  {
    id: "case-106",
    reference: "CS-106",
    title: "Youth anxiety support and safeguarding follow-up",
    counselee: "Anonymous youth member",
    campus: "Entebbe South",
    region: "Uganda",
    source: "Community Group",
    status: "Assigned",
    priority: "High",
    privacy: "Restricted",
    category: "Youth care",
    summary:
      "Anxiety and isolation concerns raised by a youth leader. The case needs a youth-safe counselor assignment and stricter communication defaults.",
    intakeNotes:
      "A youth small-group leader submitted concerns through the community lane. This case is child-safe and must remain within the approved safeguarding team.",
    submittedISO: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    counselorId: "counselor-ruth",
    childSafe: true,
    publishConsent: false,
    linkedGroup: "Ignite Youth Community",
    tags: ["Youth", "Safeguarding", "Follow-up"],
    heroUrl: HERO_2,
    safeguards: [
      {
        id: "sg-4",
        label: "Youth-safe restriction active",
        hint: "Only approved youth-care responders can access detailed notes.",
        tone: "danger",
      },
      {
        id: "sg-5",
        label: "Counselor assigned",
        hint: "Ruth S. owns next-step scheduling and youth-safe outreach.",
        tone: "good",
      },
    ],
    checkpoints: [
      { id: "cp-5", label: "Leader intake captured", when: "Today · 8:40 AM", state: "Done" },
      { id: "cp-6", label: "Safeguard review", when: "Today · 1:30 PM", state: "Ready" },
      { id: "cp-7", label: "Parent / guardian routing", when: "If required", state: "Pending" },
    ],
  },
  {
    id: "case-107",
    reference: "CS-107",
    title: "Marriage restoration intake from noticeboard referral",
    counselee: "Lydia P.",
    campus: "Kampala West",
    region: "Uganda",
    source: "Referral",
    status: "New intake",
    priority: "Standard",
    privacy: "Pastoral team",
    category: "Marriage care",
    summary:
      "A marriage-restoration request was referred privately by the care team after a noticeboard follow-up. Intake is captured but counselor assignment is still pending.",
    intakeNotes:
      "The family asked for practical guidance, prayer, and a structured counseling plan. They are open to a follow-up series but want the first touchpoint to remain private.",
    submittedISO: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    childSafe: false,
    publishConsent: false,
    linkedNoticeboard: "Family support note",
    tags: ["Marriage", "Restoration", "New intake"],
    heroUrl: HERO_3,
    safeguards: [
      {
        id: "sg-6",
        label: "Counselor still needed",
        hint: "No counselor ownership yet. Assign within the next care window.",
        tone: "warn",
      },
    ],
    checkpoints: [
      { id: "cp-8", label: "Intake form submitted", when: "Today · 2:05 PM", state: "Done" },
      { id: "cp-9", label: "Assign counselor", when: "Today", state: "Ready" },
      { id: "cp-10", label: "Book first session", when: "Next step", state: "Pending" },
    ],
  },
  {
    id: "case-108",
    reference: "CS-108",
    title: "Grief care follow-up after memorial gathering",
    counselee: "Joshua N.",
    campus: "Online first",
    region: "Kenya",
    source: "Event",
    status: "Follow-up",
    priority: "High",
    privacy: "Private",
    category: "Grief support",
    summary:
      "The case is mid-way through follow-up. Counseling sessions are active and the team is preparing a longer care rhythm with prayer and group support.",
    intakeNotes:
      "The memorial-event team linked the case into grief support. Private notes, prayer follow-up, and counselor updates are enabled while public storytelling remains disabled.",
    submittedISO: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    nextSessionISO: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    counselorId: "counselor-daniel",
    childSafe: false,
    publishConsent: false,
    linkedGroup: "Hope + Healing Circle",
    tags: ["Grief", "Follow-up", "Prayer"],
    heroUrl: HERO_4,
    safeguards: [
      {
        id: "sg-7",
        label: "Follow-up rhythm healthy",
        hint: "Touchpoints and private notes are up to date.",
        tone: "good",
      },
      {
        id: "sg-8",
        label: "Monitor emotional triggers",
        hint: "Event-linked reminders should remain pastoral and low frequency.",
        tone: "warn",
      },
    ],
    checkpoints: [
      { id: "cp-11", label: "Session one complete", when: "Yesterday", state: "Done" },
      { id: "cp-12", label: "Reading plan sent", when: "Yesterday", state: "Done" },
      { id: "cp-13", label: "Session two booked", when: "In 3 days", state: "Ready" },
    ],
  },
];

const pathwayTemplatesSeed: PathwayTemplate[] = [
  {
    id: "tpl-urgent",
    title: "Urgent care pathway",
    description: "Fast private intake, counselor assignment, and prayer-coverage steps for critical cases.",
    hint: "Use template",
    accent: "orange",
  },
  {
    id: "tpl-family",
    title: "Marriage + family support",
    description: "Structured pastoral-care flow for restoration, mediation, and follow-up sessions.",
    hint: "Use template",
    accent: "green",
  },
  {
    id: "tpl-youth",
    title: "Youth safeguarding lane",
    description: "Restrictive youth-safe defaults with approved team routing and stricter consent handling.",
    hint: "Use template",
    accent: "navy",
  },
  {
    id: "tpl-grief",
    title: "Grief support rhythm",
    description: "Guided care cadence with session notes, prayer follow-up, and group-support bridges.",
    hint: "Use template",
    accent: "green",
  },
];

function toneClass(
  tone: "neutral" | "good" | "warn" | "danger" | "brand" | "navy",
) {
  if (tone === "good") {
    return "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300";
  }
  if (tone === "warn") {
    return "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300";
  }
  if (tone === "danger") {
    return "border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300";
  }
  if (tone === "brand") {
    return "border-transparent text-white";
  }
  if (tone === "navy") {
    return "border-[#dbe4ff] dark:border-[#33458a] bg-[#eef2ff] dark:bg-[#1e2b6d]/30 text-[#1e2b6d] dark:text-[#dbe4ff]";
  }
  return "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300";
}

function statusTone(status: CaseStatus): "good" | "warn" | "danger" | "neutral" {
  if (status === "Closed") return "good";
  if (status === "Escalated") return "danger";
  if (status === "New intake" || status === "Assigned" || status === "Follow-up")
    return "warn";
  return "neutral";
}

function priorityTone(priority: CasePriority): "good" | "warn" | "danger" {
  if (priority === "Critical") return "danger";
  if (priority === "High") return "warn";
  return "good";
}

function privacyTone(mode: PrivacyMode): "navy" | "warn" | "neutral" {
  if (mode === "Private") return "navy";
  if (mode === "Restricted") return "warn";
  return "neutral";
}

function counselorTone(
  counselor: Counselor | undefined,
): "good" | "warn" | "danger" {
  if (!counselor) return "warn";
  if (counselor.availability === "At capacity") return "danger";
  if (counselor.availability === "On-call") return "warn";
  return "good";
}

function ActionButton({
  children,
  left,
  onClick,
  className,
  tone = "soft",
  disabled,
}: {
  children: React.ReactNode;
  left?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  tone?: "soft" | "primary" | "secondary" | "ghost";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-[12px] font-semibold transition-colors",
        disabled
          ? "cursor-not-allowed opacity-60 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800"
          : tone === "primary"
            ? "text-white border-transparent hover:opacity-95"
            : tone === "secondary"
              ? "text-white border-transparent hover:opacity-95"
              : tone === "ghost"
                ? "bg-transparent border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700",
        className,
      )}
      style={
        tone === "primary"
          ? { background: EV_GREEN }
          : tone === "secondary"
            ? { background: EV_ORANGE }
            : undefined
      }
    >
      {left}
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
  tone?: "neutral" | "good" | "warn" | "danger" | "brand" | "navy";
  icon?: React.ReactNode;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        toneClass(tone),
      )}
      style={tone === "brand" ? { background: EV_ORANGE } : undefined}
    >
      {icon}
      {text}
    </span>
  );
}

function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent: "green" | "orange" | "navy";
}) {
  const dot =
    accent === "green" ? EV_GREEN : accent === "orange" ? EV_ORANGE : EV_NAVY;
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            {label}
          </div>
          <div className="mt-2 text-[18px] font-black text-slate-900 dark:text-slate-100">
            {value}
          </div>
        </div>
        <div className="h-10 w-10 rounded-full" style={{ background: dot }} />
      </div>
      <div className="mt-3 text-[12px] leading-5 text-slate-600 dark:text-slate-400">
        {hint}
      </div>
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
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 shadow-2xl transition-colors flex flex-col">
        <div className="shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-[14px] font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </div>
              {subtitle ? (
                <div className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
                  {subtitle}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 grid place-items-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}

function checkpointSubset(record: CounselingCaseRecord) {
  return record.checkpoints.slice(0, 3);
}

function CounselingDestinationPreview({
  record,
  counselor,
  previewMode,
}: {
  record: CounselingCaseRecord;
  counselor: Counselor | undefined;
  previewMode: PreviewMode;
}) {
  return (
    <div
      className={cx(
        "overflow-hidden rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors",
        previewMode === "mobile" ? "max-w-[340px] md:max-w-[380px]" : "w-full",
      )}
    >
      <div
        className={cx(
          "relative overflow-hidden",
          previewMode === "mobile" ? "aspect-[3/4]" : "aspect-[16/10]",
        )}
      >
        <img
          src={record.heroUrl}
          alt={record.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
          <Pill text="Counseling" tone="brand" icon={<HeartHandshake className="h-3 w-3" />} />
          <Pill text={record.privacy} tone={privacyTone(record.privacy)} />
          {record.childSafe ? (
            <Pill
              text="Youth-safe"
              tone="danger"
              icon={<ShieldCheck className="h-3 w-3" />}
            />
          ) : null}
        </div>
        <div className="absolute left-3 right-3 bottom-3 text-white">
          <div className="text-[10px] font-black uppercase tracking-[0.16em] opacity-80">
            Private care destination
          </div>
          <div className="mt-1 text-[24px] font-black leading-tight">
            {record.title}
          </div>
          <div className="mt-2 max-w-[90%] text-[12px] leading-5 text-white/90">
            Secure session details, counselor assignment, and follow-up actions stay protected while ministry teams continue care with proper safeguards.
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[12px] font-bold text-slate-900 dark:text-slate-100">
              {record.counselee}
            </div>
            <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              {record.campus} • {record.category}
            </div>
          </div>
          <Pill text={record.priority} tone={priorityTone(record.priority)} />
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition-colors">
          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
            Care summary
          </div>
          <div className="mt-1 text-[13px] font-semibold text-slate-900 dark:text-slate-100 leading-6">
            {record.summary}
          </div>
          <div className="mt-2 text-[11px] leading-5 text-slate-600 dark:text-slate-400">
            {record.intakeNotes}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            className="rounded-2xl px-3 py-2 text-[12px] font-bold text-white"
            style={{ background: EV_GREEN }}
            onClick={handleRawPlaceholderAction("open_counseling")}>
            {record.nextSessionISO ? "Join session" : "Request slot"}
          </button>
          <button className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-[12px] font-bold text-slate-700 dark:text-slate-200 transition-colors" onClick={handleRawPlaceholderAction("open_counseling")}>
            Send secure note
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {checkpointSubset(record).map((step) => (
            <div
              key={step.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 transition-colors"
            >
              <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                {step.state}
              </div>
              <div className="mt-1 text-[11px] font-semibold leading-5 text-slate-900 dark:text-slate-100">
                {step.label}
              </div>
              <div className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                {step.when}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 transition-colors">
          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
            Assigned counselor
          </div>
          <div className="mt-1 text-[12px] font-semibold text-slate-900 dark:text-slate-100">
            {counselor ? counselor.name : "Awaiting counselor assignment"}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {counselor
              ? `${counselor.role} • ${counselor.focus}`
              : "Assign a counselor to activate scheduling and private communication tools."}
          </div>
        </div>
      </div>
    </div>
  );
}

function CounselingDestinationPreviewInner({
  record,
  counselor,
  previewMode,
}: {
  record: CounselingCaseRecord;
  counselor: Counselor | undefined;
  previewMode: PreviewMode;
}) {
  return (
    <div className="rounded-[34px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
          Counseling destination preview
        </div>
        <div className="flex items-center gap-2">
          <Pill text={previewMode === "desktop" ? "Desktop" : "Mobile"} tone="navy" />
          <Pill text={record.status} tone={statusTone(record.status)} />
        </div>
      </div>
      <CounselingDestinationPreview
        record={record}
        counselor={counselor}
        previewMode={previewMode}
      />
    </div>
  );
}

export default function CounselingPage() {
  const [cases, setCases] = useState<CounselingCaseRecord[]>(casesSeed);
  const [selectedId, setSelectedId] = useState<string>(casesSeed[0]?.id || "");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All statuses");
  const [sourceFilter, setSourceFilter] = useState<string>("All sources");
  const [privacyFilter, setPrivacyFilter] = useState<string>("All privacy");
  const [counselorFilter, setCounselorFilter] = useState<string>("All counselors");
  const [selectedCounselorId, setSelectedCounselorId] = useState<string>(
    casesSeed[0]?.counselorId || counselorsSeed[0]?.id || "",
  );

  const selectedCase = useMemo(
    () => cases.find((r) => r.id === selectedId) || cases[0],
    [cases, selectedId],
  );

  const filteredCases = useMemo(() => {
    return [...cases]
      .filter((record) => {
        const hay = [
          record.title,
          record.counselee,
          record.summary,
          record.category,
          record.campus,
          record.tags.join(" "),
          record.source,
        ]
          .join(" ")
          .toLowerCase();
        const matchQuery =
          !query.trim() || hay.includes(query.trim().toLowerCase());
        const matchStatus =
          statusFilter === "All statuses" || record.status === statusFilter;
        const matchSource =
          sourceFilter === "All sources" || record.source === sourceFilter;
        const matchPrivacy =
          privacyFilter === "All privacy" || record.privacy === privacyFilter;
        const counselorName = record.counselorId
          ? counselorsSeed.find((lead) => lead.id === record.counselorId)?.name || ""
          : "Unassigned";
        const matchCounselor =
          counselorFilter === "All counselors" ||
          counselorName === counselorFilter ||
          (counselorFilter === "Unassigned" && !record.counselorId);
        return (
          matchQuery &&
          matchStatus &&
          matchSource &&
          matchPrivacy &&
          matchCounselor
        );
      })
      .sort((a, b) => {
        const priorityRank = (p: CasePriority) =>
          p === "Critical" ? 0 : p === "High" ? 1 : 2;
        const pr = priorityRank(a.priority) - priorityRank(b.priority);
        if (pr !== 0) return pr;
        return (
          new Date(b.submittedISO).getTime() -
          new Date(a.submittedISO).getTime()
        );
      });
  }, [cases, query, statusFilter, sourceFilter, privacyFilter, counselorFilter]);

  const selectedCounselor = useMemo(
    () =>
      counselorsSeed.find(
        (c) => c.id === (selectedCounselorId || selectedCase?.counselorId),
      ) || counselorsSeed[0],
    [selectedCase?.counselorId, selectedCounselorId],
  );

  const activeCases = cases.filter((record) => record.status !== "Closed");
  const unassignedCases = cases.filter((record) => !record.counselorId);
  const scheduledThisWeek = cases.filter((record) => {
    if (!record.nextSessionISO) return false;
    const next = new Date(record.nextSessionISO).getTime();
    return next > Date.now() && next < Date.now() + 7 * 24 * 60 * 60 * 1000;
  });
  const safeguardFlags = cases.filter((record) =>
    record.safeguards.some((sg) => sg.tone === "danger"),
  );
  const closedCases = cases.filter((record) => record.status === "Closed");
  const responseActions = cases.reduce(
    (sum, record) => sum + record.checkpoints.length,
    0,
  );

  const pulseBits = [
    `${unassignedCases.length} cases need counselor assignment`,
    `${scheduledThisWeek.length} sessions are due this week`,
    `${safeguardFlags.length} safeguarding reviews need leadership visibility`,
  ];

  function handleCreateCase() {
    const newRecord: CounselingCaseRecord = {
      id: `case-${Date.now()}`,
      reference: `CS-${String(cases.length + 109).padStart(3, "0")}`,
      title: "New counseling intake",
      counselee: "Private intake",
      campus: "Online first",
      region: "Unassigned",
      source: "Direct Intake",
      status: "New intake",
      priority: "Standard",
      privacy: "Private",
      category: "General care",
      summary:
        "A new private-first counseling case has been opened. Add counselor ownership, session timing, and safeguarding notes before launch.",
      intakeNotes:
        "Capture the pastoral context, private notes, prayer needs, and any risk flags here before the first counseling session is scheduled.",
      submittedISO: new Date().toISOString(),
      childSafe: false,
      publishConsent: false,
      tags: ["Draft", "Counseling"],
      heroUrl: HERO_4,
      safeguards: [
        {
          id: `sg-${Date.now()}`,
          label: "Intake needs review",
          hint: "Review privacy mode, ownership, and care pathway before any external follow-up is sent.",
          tone: "warn",
        },
      ],
      checkpoints: [
        {
          id: `cp-${Date.now()}`,
          label: "Assign counselor",
          when: "Today",
          state: "Ready",
        },
        {
          id: `cp-${Date.now() + 1}`,
          label: "Book first session",
          when: "Next step",
          state: "Pending",
        },
      ],
    };
    setCases((prev) => [newRecord, ...prev]);
    setSelectedId(newRecord.id);
    setSelectedCounselorId(counselorsSeed[0]?.id || "");
  }

  function handleAssignCounselor() {
    if (!selectedCase || !selectedCounselor) return;
    setCases((prev) =>
      prev.map((record) =>
        record.id === selectedCase.id
          ? {
              ...record,
              counselorId: selectedCounselor.id,
              status:
                record.status === "New intake" ? "Assigned" : record.status,
            }
          : record,
      ),
    );
  }

  function handleScheduleSession() {
    if (!selectedCase) return;
    const scheduled = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
    setCases((prev) =>
      prev.map((record) =>
        record.id === selectedCase.id
          ? {
              ...record,
              nextSessionISO: scheduled,
              status: "Scheduled",
              counselorId: record.counselorId || selectedCounselor.id,
            }
          : record,
      ),
    );
  }

  const linkedHooks = [
    {
      label: "Prayer Requests",
      tone: selectedCase?.linkedPrayerRequest ? "good" : "neutral",
      text: selectedCase?.linkedPrayerRequest ? "Ready" : "Not linked",
    },
    {
      label: "Community Groups",
      tone: selectedCase?.linkedGroup ? "good" : "warn",
      text: selectedCase?.linkedGroup ? "Linked" : "Pending",
    },
    {
      label: "Noticeboard",
      tone: selectedCase?.linkedNoticeboard ? "warn" : "navy",
      text: selectedCase?.linkedNoticeboard ? "Restricted" : "Private-only",
    },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f2f2f2] p-5 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto max-w-[1600px] space-y-4">
        <section className="rounded-[30px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                PASTORAL CARE COMMAND
              </div>
              <h1 className="mt-1 text-[30px] font-black leading-tight tracking-[-0.03em] text-slate-900 dark:text-slate-100">
                FH-P-105 · Counseling
              </h1>
              <p className="mt-2 max-w-[980px] text-[15px] leading-7 text-slate-600 dark:text-slate-400">
                Private-first pastoral care and counseling workspace for cases,
                intake, scheduling, counselor assignment, notes, and
                safeguarding across the institution.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Pill text="Private-first care" tone="good" />
                <Pill text="Safeguarded workflow" tone="warn" />
                <Pill text="Prayer + community linked" tone="navy" />
              </div>
            </div>

            <div className="flex w-full max-w-[430px] flex-col items-stretch gap-2 xl:w-[430px]">
              <div className="grid grid-cols-2 gap-2">
                <ActionButton left={<Eye className="h-4 w-4" />} onClick={() => setPreviewOpen(true)}>
                  Preview
                </ActionButton>
                <ActionButton
                  tone="soft"
                  left={<CalendarClock className="h-4 w-4" />}
                  onClick={handleScheduleSession}
                >
                  Schedule Session
                </ActionButton>
                <ActionButton
                  tone="secondary"
                  left={<UserPlus className="h-4 w-4" />}
                  onClick={handleAssignCounselor}
                >
                  Assign Counselor
                </ActionButton>
                <ActionButton
                  tone="primary"
                  left={<Plus className="h-4 w-4" />}
                  onClick={handleCreateCase}
                >
                  + New Case
                </ActionButton>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 shadow-sm transition-colors">
          <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3 text-[12px] text-slate-500 dark:text-slate-400">
              <span className="rounded-full border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 font-black uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">
                Counseling ops pulse
              </span>
              <span>{pulseBits.join(" • ")}</span>
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
              Premium pastoral care
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <StatCard
            label="Active cases"
            value={fmtInt(activeCases.length)}
            hint="Open counseling lanes still moving through care and follow-up."
            accent="green"
          />
          <StatCard
            label="New intake"
            value={fmtInt(cases.filter((record) => record.status === "New intake").length)}
            hint="Fresh cases waiting for triage, privacy checks, or counselor ownership."
            accent="orange"
          />
          <StatCard
            label="Care actions"
            value={fmtInt(responseActions)}
            hint="Sessions, notes, follow-up touchpoints, and pastor-driven response actions."
            accent="navy"
          />
          <StatCard
            label="Sessions this week"
            value={fmtInt(scheduledThisWeek.length)}
            hint="Private counseling or follow-up appointments already on the calendar."
            accent="orange"
          />
          <StatCard
            label="Unassigned"
            value={fmtInt(unassignedCases.length)}
            hint="Cases still missing a named counselor or pastoral owner."
            accent="green"
          />
          <StatCard
            label="Closed this month"
            value={fmtInt(closedCases.length)}
            hint="Cases completed, documented, and moved into the restoration archive."
            accent="navy"
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <div className="rounded-[30px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-colors">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <h2 className="text-[20px] font-black tracking-[-0.02em] text-slate-900 dark:text-slate-100">
                    Counseling case queue
                  </h2>
                  <p className="mt-1 text-[13px] leading-6 text-slate-600 dark:text-slate-400">
                    Private intake, referrals, prayer-linked counseling, and safeguarding-sensitive cases in one premium care lane.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Pill text={`${filteredCases.length} cases`} tone="navy" />
                  <Pill text={`${unassignedCases.length} unassigned`} tone="warn" />
                </div>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(140px,1fr))]">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 transition-colors">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search cases, counselors, categories, or tags"
                      className="w-full bg-transparent text-[13px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                    />
                  </div>
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-[12px] font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {[
                    "All statuses",
                    "New intake",
                    "Assigned",
                    "Scheduled",
                    "In session",
                    "Follow-up",
                    "Closed",
                    "Escalated",
                  ].map((label) => (
                    <option key={label}>{label}</option>
                  ))}
                </select>

                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-[12px] font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {[
                    "All sources",
                    "Prayer Request",
                    "Community Group",
                    "Direct Intake",
                    "Referral",
                    "Event",
                  ].map((label) => (
                    <option key={label}>{label}</option>
                  ))}
                </select>

                <select
                  value={privacyFilter}
                  onChange={(e) => setPrivacyFilter(e.target.value)}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-[12px] font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {["All privacy", "Private", "Restricted", "Pastoral team"].map(
                    (label) => (
                      <option key={label}>{label}</option>
                    ),
                  )}
                </select>

                <select
                  value={counselorFilter}
                  onChange={(e) => setCounselorFilter(e.target.value)}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-[12px] font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {["All counselors", "Unassigned", ...counselorsSeed.map((c) => c.name)].map(
                    (label) => (
                      <option key={label}>{label}</option>
                    ),
                  )}
                </select>
              </div>

              <div className="mt-4 space-y-3">
                {filteredCases.map((record, idx) => {
                  const counselor = record.counselorId
                    ? counselorsSeed.find((person) => person.id === record.counselorId)
                    : undefined;
                  const isSelected = record.id === selectedCase?.id;
                  const initial =
                    (record.category || record.title).replace(/[^A-Za-z]/g, "").slice(0, 3) || "Case";
                  return (
                    <button
                      key={record.id}
                      type="button"
                      onClick={() => {
                        setSelectedId(record.id);
                        if (record.counselorId) setSelectedCounselorId(record.counselorId);
                      }}
                      className={cx(
                        "w-full rounded-[24px] border p-4 text-left transition-colors",
                        isSelected
                          ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800",
                      )}
                    >
                      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className="grid h-14 w-14 shrink-0 place-items-center rounded-[20px] text-white text-[14px] font-black"
                            style={{
                              background:
                                idx % 3 === 0
                                  ? EV_GREEN
                                  : idx % 3 === 1
                                    ? EV_ORANGE
                                    : EV_NAVY,
                            }}
                          >
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-[14px] font-black text-slate-900 dark:text-slate-100">
                              {record.title}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-slate-500 dark:text-slate-400">
                              <span>{record.counselee}</span>
                              <span>•</span>
                              <span>{counselor ? counselor.name : "Unassigned"}</span>
                              <span>•</span>
                              <span>{record.campus}</span>
                              <span>•</span>
                              <span>{record.nextSessionISO ? fmtLocal(record.nextSessionISO) : "No session booked"}</span>
                            </div>
                            <div className="mt-2 text-[12px] leading-6 text-slate-600 dark:text-slate-400 line-clamp-2">
                              {record.summary}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                          <Pill text={record.status} tone={statusTone(record.status)} />
                          <Pill text={record.priority} tone={priorityTone(record.priority)} />
                          <Pill text={record.privacy} tone={privacyTone(record.privacy)} />
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {record.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[18px] font-black tracking-[-0.02em] text-slate-900 dark:text-slate-100">
                    Care pathways + intake templates
                  </h3>
                  <p className="mt-1 text-[13px] leading-6 text-slate-600 dark:text-slate-400">
                    Launch trusted counseling rhythms faster while keeping privacy, counselor routing, and safeguarding standards intact.
                  </p>
                </div>
                <Pill text="PRIVATE CARE FLOWS" tone="good" />
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {pathwayTemplatesSeed.map((template) => (
                  <div
                    key={template.id}
                    className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 transition-colors"
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
                    <div className="mt-3 text-[14px] font-black text-slate-900 dark:text-slate-100">
                      {template.title}
                    </div>
                    <div className="mt-2 text-[12px] leading-6 text-slate-600 dark:text-slate-400">
                      {template.description}
                    </div>
                    <div className="mt-4 text-[12px] font-bold" style={{ color: template.accent === "green" ? EV_GREEN : template.accent === "orange" ? EV_ORANGE : EV_NAVY }}>
                      {template.hint}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[30px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-[20px] font-black tracking-[-0.02em] text-slate-900 dark:text-slate-100">
                    Selected case workspace
                  </h2>
                  <p className="mt-1 text-[13px] leading-6 text-slate-600 dark:text-slate-400">
                    Private context, counselor assignment, session scheduling, notes, and safeguarding signals in one protected workspace.
                  </p>
                </div>
                <ActionButton
                  tone="soft"
                  left={<Copy className="h-4 w-4" />}
                  onClick={() =>
                    navigator.clipboard?.writeText(
                      `${window.location.origin}/faithhub/provider/counseling/${selectedCase?.id || ""}`,
                    )
                  }
                >
                  Copy link
                </ActionButton>
              </div>

              {selectedCase ? (
                <div className="mt-4 space-y-4">
                  <div
                    className="rounded-[26px] p-5 text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #03cd8c 0%, #1e2b6d 100%)",
                    }}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill text={selectedCase.source} tone="brand" />
                      <Pill text={selectedCase.status} tone={statusTone(selectedCase.status)} />
                      <Pill text={selectedCase.priority} tone={priorityTone(selectedCase.priority)} />
                    </div>
                    <div className="mt-5 text-[18px] font-black leading-tight tracking-[-0.02em]">
                      {selectedCase.title}
                    </div>
                    <div className="mt-2 max-w-[90%] text-[13px] leading-6 text-white/90">
                      {selectedCase.summary}
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
                      <div className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                        Intake notes
                      </div>
                      <div className="mt-2 text-[13px] leading-6 text-slate-700 dark:text-slate-300">
                        {selectedCase.intakeNotes}
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
                      <div className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                        Counselor assignment
                      </div>
                      <div className="mt-2 space-y-3">
                        <select
                          value={selectedCounselorId}
                          onChange={(e) => setSelectedCounselorId(e.target.value)}
                          className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-[12px] font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                        >
                          {counselorsSeed.map((counselor) => (
                            <option key={counselor.id} value={counselor.id}>
                              {counselor.name} · {counselor.campus}
                            </option>
                          ))}
                        </select>

                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 transition-colors">
                          <div className="text-[12px] font-bold text-slate-900 dark:text-slate-100">
                            {selectedCounselor.name}
                          </div>
                          <div className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                            {selectedCounselor.role} • {selectedCounselor.focus}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Pill
                              text={selectedCounselor.availability}
                              tone={counselorTone(selectedCounselor)}
                            />
                            <Pill
                              text={`${selectedCounselor.activeCases} active cases`}
                              tone="neutral"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 xl:grid-cols-2">
                    <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                          Session planning
                        </div>
                        <Pill
                          text={selectedCase.nextSessionISO ? "Booked" : "Needs slot"}
                          tone={selectedCase.nextSessionISO ? "good" : "warn"}
                        />
                      </div>
                      <div className="mt-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition-colors">
                        <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                          {selectedCase.nextSessionISO
                            ? fmtLocal(selectedCase.nextSessionISO)
                            : "No private session booked yet"}
                        </div>
                        <div className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                          Schedule a counseling session, keep it private-first, and preserve the case context for the assigned counselor.
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedCase.checkpoints.map((checkpoint) => (
                          <div
                            key={checkpoint.id}
                            className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300"
                          >
                            {checkpoint.label} · {checkpoint.state}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
                      <div className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                        Cross-object hooks
                      </div>
                      <div className="mt-3 space-y-3">
                        {linkedHooks.map((hook) => (
                          <div
                            key={hook.label}
                            className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 transition-colors"
                          >
                            <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                              {hook.label}
                            </div>
                            <Pill
                              text={hook.text}
                              tone={hook.tone as "good" | "warn" | "neutral" | "navy"}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
                    <div className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                      Progress lane
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                      {selectedCase.checkpoints.map((checkpoint) => (
                        <div
                          key={checkpoint.id}
                          className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition-colors"
                        >
                          <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                            {checkpoint.state}
                          </div>
                          <div className="mt-1 text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                            {checkpoint.label}
                          </div>
                          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                            {checkpoint.when}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="rounded-[30px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[18px] font-black tracking-[-0.02em] text-slate-900 dark:text-slate-100">
                    Counseling cadence + linked ministry hooks
                  </h3>
                  <p className="mt-1 text-[13px] leading-6 text-slate-600 dark:text-slate-400">
                    Keep private counseling linked to prayer care, community support, noticeboard follow-up, and trusted ministry pathways without breaking privacy defaults.
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  {
                    title: "Prayer follow-up bridge",
                    hint: "Prayer requests can feed the counseling queue with stricter privacy and pastoral review.",
                    pill: "Ready",
                    tone: "good" as const,
                  },
                  {
                    title: "Community group aftercare",
                    hint: "Group leaders can hand off complex care needs into counseling without exposing sensitive notes.",
                    pill: "Linked",
                    tone: "navy" as const,
                  },
                  {
                    title: "Noticeboard restrictions",
                    hint: "Testimony, noticeboard, or public follow-up only unlocks when consent and leadership approval are complete.",
                    pill: "Private-only",
                    tone: "warn" as const,
                  },
                ].map((row) => (
                  <div
                    key={row.title}
                    className="flex flex-col gap-2 rounded-[24px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 transition-colors md:flex-row md:items-center md:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                        {row.title}
                      </div>
                      <div className="mt-1 text-[12px] leading-6 text-slate-500 dark:text-slate-400">
                        {row.hint}
                      </div>
                    </div>
                    <Pill text={row.pill} tone={row.tone} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[30px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[18px] font-black tracking-[-0.02em] text-slate-900 dark:text-slate-100">
                    Counseling destination preview
                  </h2>
                  <p className="mt-1 text-[13px] leading-6 text-slate-600 dark:text-slate-400">
                    Persistent preview rail for the selected private care destination, session invite route, and secure member-facing flow.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ActionButton
                    tone={previewMode === "desktop" ? "secondary" : "soft"}
                    onClick={() => setPreviewMode("desktop")}
                  >
                    Desktop
                  </ActionButton>
                  <ActionButton
                    tone={previewMode === "mobile" ? "secondary" : "soft"}
                    onClick={() => setPreviewMode("mobile")}
                  >
                    Mobile
                  </ActionButton>
                </div>
              </div>

              {selectedCase ? (
                <div className="mt-4 space-y-4">
                  <CounselingDestinationPreview
                    record={selectedCase}
                    counselor={selectedCounselor}
                    previewMode={previewMode}
                  />

                  <div className="flex flex-wrap gap-2">
                    <ActionButton
                      tone="primary"
                      left={<Eye className="h-4 w-4" />}
                      onClick={() => setPreviewOpen(true)}
                    >
                      Open large preview
                    </ActionButton>
                    <ActionButton
                      tone="soft"
                      left={<Copy className="h-4 w-4" />}
                      onClick={() =>
                        navigator.clipboard?.writeText(
                          `${window.location.origin}/faithhub/provider/counseling/${selectedCase.id}`,
                        )
                      }
                    >
                      Copy private link
                    </ActionButton>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="rounded-[30px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[18px] font-black tracking-[-0.02em] text-slate-900 dark:text-slate-100">
                    Safeguard + escalation lane
                  </h3>
                  <p className="mt-1 text-[13px] leading-6 text-slate-600 dark:text-slate-400">
                    Risk signals, private handling defaults, and youth-safe or consent-sensitive guidance for the selected case.
                  </p>
                </div>
                <Pill text="Action now" tone="warn" />
              </div>

              <div className="mt-4 space-y-3">
                {(selectedCase?.safeguards || []).map((signal) => (
                  <div
                    key={signal.id}
                    className={cx(
                      "rounded-[24px] border px-4 py-3 transition-colors",
                      signal.tone === "danger"
                        ? "border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20"
                        : signal.tone === "warn"
                          ? "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20"
                          : "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20",
                    )}
                  >
                    <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                      {signal.label}
                    </div>
                    <div className="mt-1 text-[12px] leading-6 text-slate-600 dark:text-slate-400">
                      {signal.hint}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[18px] font-black tracking-[-0.02em] text-slate-900 dark:text-slate-100">
                    Counselor roster
                  </h3>
                  <p className="mt-1 text-[13px] leading-6 text-slate-600 dark:text-slate-400">
                    Coverage visibility for pastoral, counseling, follow-up, and safeguarding-linked care.
                  </p>
                </div>
                <Pill text={`${counselorsSeed.length} counselors`} tone="navy" />
              </div>

              <div className="mt-4 space-y-3">
                {counselorsSeed.map((counselor) => (
                  <div
                    key={counselor.id}
                    className="flex flex-col gap-2 rounded-[24px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                          {counselor.name}
                        </div>
                        <div className="mt-1 text-[12px] leading-6 text-slate-500 dark:text-slate-400">
                          {counselor.role} · {counselor.campus}
                        </div>
                      </div>
                      <Pill
                        text={counselor.availability}
                        tone={counselorTone(counselor)}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{counselor.focus}</span>
                      <span>•</span>
                      <span>{counselor.languages.join(" + ")}</span>
                      <span>•</span>
                      <span>{counselor.activeCases} active cases</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-900/20 px-4 py-2 text-center text-[12px] text-slate-600 dark:text-slate-300 shadow-sm transition-colors">
          Concept preview of the generated FaithHub Counseling page · EVzone Green primary ({EV_GREEN}) · Orange secondary ({EV_ORANGE})
        </section>
      </div>

      {selectedCase ? (
        <Drawer
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          title="FaithHub Counseling destination preview"
          subtitle={`${selectedCase.reference} • ${selectedCase.title}`}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <ActionButton
                tone={previewMode === "desktop" ? "secondary" : "soft"}
                onClick={() => setPreviewMode("desktop")}
              >
                Desktop
              </ActionButton>
              <ActionButton
                tone={previewMode === "mobile" ? "secondary" : "soft"}
                onClick={() => setPreviewMode("mobile")}
              >
                Mobile
              </ActionButton>
              <ActionButton
                tone="soft"
                left={<ExternalLink className="h-4 w-4" />}
                onClick={() => safeNav(ROUTES.providerDashboard)}
              >
                Open dashboard
              </ActionButton>
            </div>

            <CounselingDestinationPreviewInner
              record={selectedCase}
              counselor={selectedCounselor}
              previewMode={previewMode}
            />
          </div>
        </Drawer>
      ) : null}
    </div>
  );
}



