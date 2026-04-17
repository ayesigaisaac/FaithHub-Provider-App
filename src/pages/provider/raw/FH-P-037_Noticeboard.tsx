// @ts-nocheck
"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Clock3,
  ExternalLink,
  Eye,
  Filter,
  Globe2,
  Layers3,
  LayoutGrid,
  Link2,
  Megaphone,
  MessageSquare,
  MonitorPlay,
  Pin,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Users2,
  Workflow,
  Zap,
} from "lucide-react";
import { handleRawPlaceholderAction } from "./placeholderActions";

/**
 * FaithHub — FH-P-037 Noticeboard
 * --------------------------------
 * Premium Provider-side noticeboard / announcements operating surface.
 *
 * Design intent
 * - Extend the old community/announcements block into a world-class Noticeboard page.
 * - Use EVzone Green as the primary accent and Orange as the secondary accent.
 * - Keep the same premium creator-style format used across the FaithHub Provider pages:
 *   command hero, KPI cards, filter rail, operational list, live composer, workflow hooks,
 *   governance signals, and a persistent preview surface.
 * - Treat notices as first-class provider objects that can be scheduled, pinned, localized,
 *   linked to Live Sessions / Events / Giving / Beacon, and previewed before publishing.
 *
 * Suggested placement
 * - Audience & Outreach section, directly after Channels & Contact Manager.
 * - Proposed page code: FH-P-037.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#16244c";

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

type ViewKey = "Board" | "Calendar" | "Archive" | "Analytics";
type Tone = "neutral" | "good" | "warn" | "danger" | "brand" | "navy";
type Priority = "Routine" | "Important" | "Urgent";
type NoticeStatus = "Draft" | "Scheduled" | "Live" | "Expired";
type Category =
  | "Service update"
  | "Prayer alert"
  | "Volunteer call"
  | "Event notice"
  | "Giving update"
  | "Community reminder"
  | "Safety notice";

type Surface =
  | "Noticeboard"
  | "Live Sessions"
  | "Events"
  | "Giving"
  | "Notification"
  | "Beacon";

type NoticeItem = {
  id: string;
  title: string;
  summary: string;
  body: string;
  category: Category;
  priority: Priority;
  status: NoticeStatus;
  campus: string;
  audience: string;
  language: string;
  owner: string;
  linkedTo: string;
  surfaces: Surface[];
  pinned: boolean;
  approvalRequired: boolean;
  scheduledAt: string;
  expiresAt: string;
  reads: number;
  taps: number;
  conversions: number;
};

type ComposerState = {
  title: string;
  summary: string;
  body: string;
  category: Category;
  priority: Priority;
  campus: string;
  audience: string;
  language: string;
  linkedTo: string;
  surfaces: Surface[];
  pinned: boolean;
  approvalRequired: boolean;
  commentsEnabled: boolean;
  sendToJourney: boolean;
  boostWithBeacon: boolean;
  scheduledAt: string;
  expiresAt: string;
};

type MetricCard = {
  id: string;
  label: string;
  value: string;
  hint: string;
  accent?: "green" | "orange" | "navy";
};

const VIEWS: ViewKey[] = ["Board", "Calendar", "Archive", "Analytics"];
const CAMPUSES = [
  "All campuses",
  "Kampala Central",
  "Online Studio",
  "East Campus",
  "Children Hall",
];
const AUDIENCES = [
  "Everyone",
  "Members",
  "Youth",
  "Women",
  "Volunteers",
  "Donors",
  "Parents",
];
const LANGUAGES = ["English", "Swahili", "French", "Arabic"];
const LINKED_OBJECTS = [
  "Standalone notice",
  "Sunday Prayer Revival",
  "Youth Outreach Day",
  "Flood Relief Fund",
  "Charity Crowdfund",
  "Series launch",
  "Replay follow-up",
];

const ALL_SURFACES: Surface[] = [
  "Noticeboard",
  "Live Sessions",
  "Events",
  "Giving",
  "Notification",
  "Beacon",
];

const BOARD_METRICS: MetricCard[] = [
  {
    id: "active",
    label: "Active notices",
    value: "18",
    hint: "Live across board, live pages, event surfaces, and giving moments",
    accent: "green",
  },
  {
    id: "pinned",
    label: "Pinned / spotlight",
    value: "4",
    hint: "Institution-wide priority notices currently elevated",
    accent: "orange",
  },
  {
    id: "readrate",
    label: "Read-through",
    value: "72%",
    hint: "Average read health across the last 14 days",
    accent: "navy",
  },
  {
    id: "risk",
    label: "Needs review",
    value: "3",
    hint: "Awaiting approval, wording update, or child-safe routing check",
    accent: "orange",
  },
];

const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: "NB-201",
    title: "Sunday service time moved to 6:30 PM",
    summary:
      "Citywide rain forecast triggered a late-evening service shift for all central-campus attendees.",
    body:
      "Please arrive from 5:45 PM. Parking marshals and ushering teams should report 30 minutes earlier than usual. The board, event page, and live waiting room are all updated.",
    category: "Service update",
    priority: "Urgent",
    status: "Live",
    campus: "Kampala Central",
    audience: "Everyone",
    language: "English",
    owner: "Pastoral Office",
    linkedTo: "Sunday Prayer Revival",
    surfaces: ["Noticeboard", "Live Sessions", "Events", "Notification"],
    pinned: true,
    approvalRequired: false,
    scheduledAt: "Today � 2:30 PM",
    expiresAt: "Today � 8:00 PM",
    reads: 2480,
    taps: 641,
    conversions: 318,
  },
  {
    id: "NB-202",
    title: "Flood Relief giving update and volunteer pickup point",
    summary:
      "The relief team needs blankets, bottled water, and rapid-response volunteers before 8 AM tomorrow.",
    body:
      "Donation links are active, the charity crowdfund has reached 73%, and a volunteer briefing will happen at the east-campus foyer. Please use the approved pickup map inside the linked event card.",
    category: "Giving update",
    priority: "Important",
    status: "Live",
    campus: "All campuses",
    audience: "Donors",
    language: "English",
    owner: "Outreach Desk",
    linkedTo: "Flood Relief Fund",
    surfaces: ["Noticeboard", "Giving", "Notification", "Beacon"],
    pinned: true,
    approvalRequired: true,
    scheduledAt: "Today � 9:00 AM",
    expiresAt: "Tomorrow � 9:00 AM",
    reads: 1682,
    taps: 430,
    conversions: 216,
  },
  {
    id: "NB-203",
    title: "Youth choir rehearsal call time confirmed",
    summary:
      "Rehearsal starts at 4 PM in the online studio with translation checks at 3:40 PM.",
    body:
      "Captains should confirm attendance, upload final set lists, and review the run sheet before entering Live Studio. Parents receive the child-safe version of this notice automatically.",
    category: "Community reminder",
    priority: "Routine",
    status: "Scheduled",
    campus: "Online Studio",
    audience: "Youth",
    language: "English",
    owner: "Production Team",
    linkedTo: "Standalone notice",
    surfaces: ["Noticeboard", "Notification"],
    pinned: false,
    approvalRequired: true,
    scheduledAt: "Today � 3:15 PM",
    expiresAt: "Today � 6:00 PM",
    reads: 690,
    taps: 180,
    conversions: 72,
  },
  {
    id: "NB-204",
    title: "Prayer chain open for hospital visitation",
    summary:
      "Pastoral care requests 6 volunteers for the 7 AM to 11 AM window tomorrow.",
    body:
      "Please register through the volunteer board or reply through the linked notice journey. The rota closes once all six slots are filled.",
    category: "Prayer alert",
    priority: "Important",
    status: "Draft",
    campus: "East Campus",
    audience: "Volunteers",
    language: "English",
    owner: "Care Team",
    linkedTo: "Standalone notice",
    surfaces: ["Noticeboard", "Notification"],
    pinned: false,
    approvalRequired: true,
    scheduledAt: "Tomorrow � 6:00 AM",
    expiresAt: "Tomorrow � 11:15 AM",
    reads: 0,
    taps: 0,
    conversions: 0,
  },
];

function makeBlankComposer(): ComposerState {
  return {
    title: "Board-wide reminder: watch night volunteers open at 5 PM",
    summary:
      "Use one premium card to brief volunteers, guide attendees, and hand off into notifications or Beacon when needed.",
    body:
      "Add the final details here: arrival windows, what to bring, service adjustments, giving links, event directions, or safety notes. The preview updates live as the board item changes.",
    category: "Volunteer call",
    priority: "Important",
    campus: "All campuses",
    audience: "Volunteers",
    language: "English",
    linkedTo: "Standalone notice",
    surfaces: ["Noticeboard", "Notification"],
    pinned: false,
    approvalRequired: true,
    commentsEnabled: false,
    sendToJourney: true,
    boostWithBeacon: false,
    scheduledAt: "Today � 4:45 PM",
    expiresAt: "Tomorrow � 11:30 PM",
  };
}

function toneClasses(tone: Tone) {
  if (tone === "good") {
    return "bg-emerald-50 text-emerald-800 border-emerald-200";
  }
  if (tone === "warn") {
    return "bg-amber-50 text-amber-900 border-amber-200";
  }
  if (tone === "danger") {
    return "bg-rose-50 text-rose-800 border-rose-200";
  }
  if (tone === "brand") {
    return "text-white border-transparent";
  }
  if (tone === "navy") {
    return "bg-[#EEF2FF] text-[#16244c] border-[#C7D2FE]";
  }
  return "bg-white text-slate-700 border-slate-200";
}

function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors",
        toneClasses(tone),
      )}
      style={
        tone === "brand"
          ? { background: EV_ORANGE, color: "#fff", borderColor: "transparent" }
          : undefined
      }
    >
      {children}
    </span>
  );
}

function SoftButton({
  children,
  onClick,
  title,
  className,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60",
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
  title,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-[12px] font-semibold text-white shadow-sm transition-opacity hover:opacity-95",
        className,
      )}
      style={{ background: EV_GREEN }}
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
        "rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm transition-colors",
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

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold text-slate-700">{children}</div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 outline-none transition-colors focus:ring-2 focus:ring-emerald-200"
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 outline-none transition-colors focus:ring-2 focus:ring-emerald-200"
    />
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
    <div className="mt-1 relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-900 outline-none transition-colors focus:ring-2 focus:ring-emerald-200"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function ToggleCard({
  checked,
  onChange,
  label,
  hint,
  accent,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
  accent?: "green" | "orange";
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cx(
        "w-full rounded-2xl border p-3 text-left transition-colors",
        checked
          ? accent === "orange"
            ? "border-orange-200 bg-orange-50"
            : "border-emerald-200 bg-emerald-50"
          : "border-slate-200 bg-white hover:bg-slate-50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[12px] font-semibold text-slate-900">{label}</div>
          {hint ? (
            <div className="mt-0.5 text-[11px] text-slate-500">{hint}</div>
          ) : null}
        </div>
        <span
          className={cx(
            "mt-0.5 inline-flex h-6 w-10 rounded-full px-1 transition-colors",
            checked
              ? accent === "orange"
                ? "bg-orange-500 justify-end"
                : "bg-emerald-500 justify-end"
              : "bg-slate-200 justify-start",
          )}
        >
          <span className="mt-1 h-4 w-4 rounded-full bg-white shadow-sm" />
        </span>
      </div>
    </button>
  );
}

function MetricTile({ card }: { card: MetricCard }) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {card.label}
          </div>
          <div className="mt-2 text-[32px] font-black leading-none text-slate-900">
            {card.value}
          </div>
        </div>
        <div
          className="h-9 w-9 rounded-2xl"
          style={{
            background:
              card.accent === "green"
                ? EV_GREEN
                : card.accent === "orange"
                  ? EV_ORANGE
                  : EV_NAVY,
            opacity: 0.18,
          }}
        />
      </div>
      <div className="mt-2 text-[12px] leading-relaxed text-slate-500">
        {card.hint}
      </div>
    </div>
  );
}

function priorityTone(priority: Priority): Tone {
  if (priority === "Urgent") return "danger";
  if (priority === "Important") return "warn";
  return "neutral";
}

function statusTone(status: NoticeStatus): Tone {
  if (status === "Live") return "good";
  if (status === "Scheduled") return "navy";
  if (status === "Expired") return "danger";
  return "neutral";
}

function NoticeCard({
  notice,
  selected,
  onSelect,
}: {
  notice: NoticeItem;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cx(
        "w-full rounded-[26px] border p-4 text-left transition-colors",
        selected
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-200 bg-white hover:bg-slate-50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {notice.pinned ? (
              <Pill tone="brand">
                <Pin className="h-3 w-3" />
                Pinned
              </Pill>
            ) : null}
            <Pill tone={priorityTone(notice.priority)}>{notice.priority}</Pill>
            <Pill tone={statusTone(notice.status)}>{notice.status}</Pill>
          </div>
          <div className="mt-3 text-[16px] font-bold leading-tight text-slate-900">
            {notice.title}
          </div>
          <div className="mt-1 text-[12px] leading-relaxed text-slate-500">
            {notice.summary}
          </div>
        </div>
        {selected ? (
          <div className="rounded-2xl bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 shadow-sm">
            Editing
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-slate-500">
        <span>{notice.campus}</span>
        <span>{notice.audience}</span>
        <span>{notice.language}</span>
        <span>{notice.owner}</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {notice.surfaces.slice(0, 4).map((surface) => (
          <span
            key={surface}
            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600"
          >
            {surface}
          </span>
        ))}
        {notice.surfaces.length > 4 ? (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
            +{notice.surfaces.length - 4}
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
          <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
            Reads
          </div>
          <div className="mt-1 text-[15px] font-black text-slate-900">
            {notice.reads.toLocaleString()}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
          <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
            Taps
          </div>
          <div className="mt-1 text-[15px] font-black text-slate-900">
            {notice.taps.toLocaleString()}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
          <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
            Actions
          </div>
          <div className="mt-1 text-[15px] font-black text-slate-900">
            {notice.conversions.toLocaleString()}
          </div>
        </div>
      </div>
    </button>
  );
}

function BoardPreviewDesktop({ draft }: { draft: ComposerState }) {
  const activeSurfaces = draft.surfaces.length ? draft.surfaces : ["Noticeboard"];
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Desktop noticeboard preview
          </div>
          <div className="mt-1 text-[16px] font-black text-slate-900">
            FaithHub Community Updates
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Pill tone="good">
            <CheckCircle2 className="h-3 w-3" />
            Publish ready
          </Pill>
          {draft.pinned ? (
            <Pill tone="brand">
              <Pin className="h-3 w-3" />
              Spotlight
            </Pill>
          ) : null}
        </div>
      </div>

      <div className="mt-4 rounded-[24px] border border-slate-200 bg-[#F8FAFC] p-4">
        <div
          className="rounded-[22px] border p-4"
          style={{
            borderColor:
              draft.priority === "Urgent"
                ? "#fecaca"
                : draft.priority === "Important"
                  ? "#fde68a"
                  : "#cbd5e1",
            background:
              draft.priority === "Urgent"
                ? "#fff1f2"
                : draft.priority === "Important"
                  ? "#fffbeb"
                  : "#ffffff",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone={priorityTone(draft.priority)}>{draft.priority}</Pill>
                <Pill tone="good">Live preview</Pill>
                {draft.approvalRequired ? (
                  <Pill tone="navy">
                    <ShieldCheck className="h-3 w-3" />
                    Approval lane
                  </Pill>
                ) : null}
              </div>
              <div className="mt-3 text-[20px] font-black leading-tight text-slate-900">
                {draft.title || "Untitled notice"}
              </div>
              <div className="mt-2 max-w-3xl text-[13px] leading-relaxed text-slate-600">
                {draft.summary}
              </div>
            </div>
            <div
              className="h-11 w-11 rounded-[18px]"
              style={{
                background:
                  draft.priority === "Urgent"
                    ? "#ef4444"
                    : draft.priority === "Important"
                      ? EV_ORANGE
                      : EV_GREEN,
                opacity: 0.16,
              }}
            />
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-[18px] border border-slate-200 bg-white p-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Message body
              </div>
              <div className="mt-2 text-[12px] leading-relaxed text-slate-600">
                {draft.body}
              </div>
            </div>
            <div className="rounded-[18px] border border-slate-200 bg-white p-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Routing
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {activeSurfaces.map((surface) => (
                  <span
                    key={surface}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600"
                  >
                    {surface}
                  </span>
                ))}
              </div>
              <div className="mt-3 text-[12px] text-slate-500">
                {draft.campus} � {draft.audience} � {draft.language}
              </div>
              <div className="mt-1 text-[12px] text-slate-500">
                Linked to: {draft.linkedTo}
              </div>
              <div className="mt-1 text-[12px] text-slate-500">
                Window: {draft.scheduledAt} �?? � {draft.expiresAt}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            {
              label: "Upcoming notices",
              items: [
                "Volunteer arrival windows",
                "Replay now available",
                "Youth service prayer reminder",
              ],
            },
            {
              label: "Board sections",
              items: [
                "Pinned notice lane",
                "Today’s notices",
                "Campus-only updates",
              ],
            },
            {
              label: "Response hooks",
              items: [
                draft.sendToJourney ? "Notification journey armed" : "No journey",
                draft.boostWithBeacon ? "Beacon boost ready" : "No boost",
                draft.commentsEnabled ? "Comments enabled" : "Comments off",
              ],
            },
          ].map((column) => (
            <div
              key={column.label}
              className="rounded-[20px] border border-slate-200 bg-white p-3"
            >
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                {column.label}
              </div>
              <div className="mt-3 space-y-2">
                {column.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-600"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BoardPreviewMobile({ draft }: { draft: ComposerState }) {
  return (
    <div className="mx-auto w-full max-w-[360px] md:max-w-[400px]">
      <div className="rounded-[34px] bg-slate-950 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.28)]">
        <div className="overflow-hidden rounded-[28px] bg-white">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Mobile preview
            </div>
            <div className="mt-1 flex items-center justify-between gap-2">
              <div className="text-[15px] font-black text-slate-900">
                Noticeboard
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600">
                {draft.language}
              </div>
            </div>
          </div>

          <div className="space-y-3 p-4">
            <div
              className="rounded-[22px] border p-4"
              style={{
                borderColor:
                  draft.priority === "Urgent"
                    ? "#fecaca"
                    : draft.priority === "Important"
                      ? "#fde68a"
                      : "#dbeafe",
                background:
                  draft.priority === "Urgent"
                    ? "#fff1f2"
                    : draft.priority === "Important"
                      ? "#fffbeb"
                      : "#ecfdf5",
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <Pill tone={priorityTone(draft.priority)}>{draft.priority}</Pill>
                {draft.pinned ? (
                  <Pill tone="brand">
                    <Pin className="h-3 w-3" />
                    Top
                  </Pill>
                ) : null}
              </div>
              <div className="mt-3 text-[16px] font-black leading-tight text-slate-900">
                {draft.title}
              </div>
              <div className="mt-2 text-[12px] leading-relaxed text-slate-600">
                {draft.summary}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {draft.surfaces.slice(0, 3).map((surface) => (
                  <span
                    key={surface}
                    className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600"
                  >
                    {surface}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
              <div className="text-[11px] font-bold text-slate-900">
                Community details
              </div>
              <div className="mt-2 space-y-2 text-[11px] text-slate-600">
                <div>{draft.campus}</div>
                <div>{draft.audience}</div>
                <div>{draft.scheduledAt}</div>
                <div>{draft.linkedTo}</div>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] px-4 py-3 text-[12px] font-black text-white"
              style={{ background: EV_GREEN }}
             onClick={handleRawPlaceholderAction}>
              <Bell className="h-4 w-4" />
              Open full notice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FaithHubNoticeboardPage() {
  const [roleView, setRoleView] = useState<
    "Pastoral" | "Production" | "Outreach" | "Moderation"
  >("Pastoral");
  const [view, setView] = useState<ViewKey>("Board");
  const [campusFilter, setCampusFilter] = useState("All campuses");
  const [languageFilter, setLanguageFilter] = useState("English");
  const [query, setQuery] = useState("");
  const [notices, setNotices] = useState<NoticeItem[]>(INITIAL_NOTICES);
  const [selectedId, setSelectedId] = useState<string>(INITIAL_NOTICES[0].id);
  const [composer, setComposer] = useState<ComposerState>(() => {
    const seed = INITIAL_NOTICES[0];
    return {
      title: seed.title,
      summary: seed.summary,
      body: seed.body,
      category: seed.category,
      priority: seed.priority,
      campus: seed.campus,
      audience: seed.audience,
      language: seed.language,
      linkedTo: seed.linkedTo,
      surfaces: seed.surfaces,
      pinned: seed.pinned,
      approvalRequired: seed.approvalRequired,
      commentsEnabled: false,
      sendToJourney: seed.surfaces.includes("Notification"),
      boostWithBeacon: seed.surfaces.includes("Beacon"),
      scheduledAt: seed.scheduledAt,
      expiresAt: seed.expiresAt,
    };
  });

  const selectedNotice = useMemo(
    () => notices.find((notice) => notice.id === selectedId) || notices[0],
    [notices, selectedId],
  );

  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      const matchesCampus =
        campusFilter === "All campuses" || notice.campus === campusFilter;
      const matchesLanguage =
        languageFilter === "English" ? true : notice.language === languageFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        notice.title.toLowerCase().includes(q) ||
        notice.summary.toLowerCase().includes(q) ||
        notice.owner.toLowerCase().includes(q) ||
        notice.linkedTo.toLowerCase().includes(q);
      if (view === "Archive" && notice.status !== "Expired") return false;
      if (view === "Calendar" && notice.status === "Draft") return false;
      if (view === "Analytics" && notice.status === "Draft") return false;
      return matchesCampus && matchesLanguage && matchesQuery;
    });
  }, [campusFilter, languageFilter, notices, query, view]);

  const pinnedNotices = useMemo(
    () => notices.filter((notice) => notice.pinned && notice.status !== "Expired"),
    [notices],
  );

  const approvalBacklog = useMemo(
    () =>
      notices.filter(
        (notice) =>
          notice.approvalRequired &&
          (notice.status === "Draft" || notice.status === "Scheduled"),
      ),
    [notices],
  );

  const boardInsights = useMemo(
    () => [
      {
        label: "Read-through health",
        value: "72%",
        hint: "Pinned + urgent notices outperform the board average by 18%",
      },
      {
        label: "Most responsive audience",
        value: "Parents",
        hint: "Child-safe routing notices draw the fastest acknowledgement rate",
      },
      {
        label: "Top conversion path",
        value: "Notice �?? � Event",
        hint: "Event-linked notices are producing the strongest taps this week",
      },
    ],
    [],
  );

  const loadNoticeIntoComposer = (notice: NoticeItem) => {
    setSelectedId(notice.id);
    setComposer({
      title: notice.title,
      summary: notice.summary,
      body: notice.body,
      category: notice.category,
      priority: notice.priority,
      campus: notice.campus,
      audience: notice.audience,
      language: notice.language,
      linkedTo: notice.linkedTo,
      surfaces: notice.surfaces,
      pinned: notice.pinned,
      approvalRequired: notice.approvalRequired,
      commentsEnabled: false,
      sendToJourney: notice.surfaces.includes("Notification"),
      boostWithBeacon: notice.surfaces.includes("Beacon"),
      scheduledAt: notice.scheduledAt,
      expiresAt: notice.expiresAt,
    });
  };

  const createNewNotice = () => {
    setSelectedId("");
    setComposer(makeBlankComposer());
  };

  const saveNotice = (nextStatus: NoticeStatus) => {
    const nowCard: NoticeItem = {
      id:
        selectedId ||
        `NB-${Math.floor(Math.random() * 900 + 100).toString()}`,
      title: composer.title,
      summary: composer.summary,
      body: composer.body,
      category: composer.category,
      priority: composer.priority,
      status: nextStatus,
      campus: composer.campus,
      audience: composer.audience,
      language: composer.language,
      owner:
        roleView === "Pastoral"
          ? "Pastoral Office"
          : roleView === "Production"
            ? "Production Team"
            : roleView === "Outreach"
              ? "Outreach Desk"
              : "Moderation Team",
      linkedTo: composer.linkedTo,
      surfaces: composer.surfaces,
      pinned: composer.pinned,
      approvalRequired: composer.approvalRequired,
      scheduledAt: composer.scheduledAt,
      expiresAt: composer.expiresAt,
      reads:
        selectedNotice && selectedNotice.id === selectedId
          ? selectedNotice.reads
          : nextStatus === "Draft"
            ? 0
            : 280,
      taps:
        selectedNotice && selectedNotice.id === selectedId
          ? selectedNotice.taps
          : nextStatus === "Draft"
            ? 0
            : 74,
      conversions:
        selectedNotice && selectedNotice.id === selectedId
          ? selectedNotice.conversions
          : nextStatus === "Draft"
            ? 0
            : 22,
    };

    setNotices((prev) => {
      const exists = prev.some((item) => item.id === nowCard.id);
      const next = exists
        ? prev.map((item) => (item.id === nowCard.id ? nowCard : item))
        : [nowCard, ...prev];
      return next;
    });
    setSelectedId(nowCard.id);
  };

  const toggleSurface = (surface: Surface) => {
    setComposer((prev) => {
      const exists = prev.surfaces.includes(surface);
      return {
        ...prev,
        surfaces: exists
          ? prev.surfaces.filter((item) => item !== surface)
          : [...prev.surfaces, surface],
      };
    });
  };

  return (
    <div
      className="min-h-screen w-full bg-[#f2f2f2] px-5 py-6 text-slate-900"
      style={{ background: EV_LIGHT }}
    >
      <div className="mx-auto max-w-[1500px] space-y-5">
        <div className="rounded-[34px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[18px] text-white shadow-sm" style={{ background: EV_GREEN }}>
                  FH
                </span>
                <span>Audience & Outreach</span>
                <span>�</span>
                <span>Premium Provider Noticeboard</span>
              </div>

              <div className="mt-4 text-[44px] font-black leading-[1.02] tracking-[-0.03em] text-slate-900">
                FH-P-037 � Noticeboard
              </div>
              <div className="mt-3 max-w-4xl text-[16px] leading-relaxed text-slate-500">
                Run institution-wide announcements, campus updates, prayer alerts, volunteer calls,
                event reminders, and giving notices from one premium board — then route them into
                Live Sessions, notifications, events, giving, and Beacon without losing control.
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Pill tone="good">
                  <Megaphone className="h-3.5 w-3.5" />
                  Provider workspace
                </Pill>
                <Pill tone="navy">
                  <Layers3 className="h-3.5 w-3.5" />
                  Multi-campus ready
                </Pill>
                <Pill tone="warn">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Approval aware
                </Pill>
              </div>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-2 xl:w-[470px]">
              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Provider profile
                </div>
                <div className="mt-2 text-[28px] font-black leading-none text-slate-900">
                  Ayesigai921
                </div>
                <div className="mt-2 text-[12px] leading-relaxed text-slate-500">
                  FaithHub Provider Workspace � role-aware notice publishing with campus, audience,
                  language, and safety routing.
                </div>
                <div className="mt-3">
                  <Pill tone="good">Active</Pill>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Quick actions
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <PrimaryButton onClick={createNewNotice}>
                    <Plus className="h-4 w-4" />
                    + New Notice
                  </PrimaryButton>
                  <SoftButton>
                    <Bell className="h-4 w-4" />
                    Create journey
                  </SoftButton>
                  <SoftButton>
                    <Sparkles className="h-4 w-4" />
                    Boost with Beacon
                  </SoftButton>
                </div>
                <div className="mt-4 text-[12px] text-slate-500">
                  Turn routine updates into a premium audience flow with one click.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {["Pastoral view", "Live command", "Community board", "Trust lane"].map(
              (pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-600"
                >
                  {pill}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {BOARD_METRICS.map((metric) => (
            <MetricTile key={metric.id} card={metric} />
          ))}
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="text-[24px] font-black tracking-[-0.02em] text-slate-900">
                Search and filter the board
              </div>
              <div className="mt-1 text-[13px] text-slate-500">
                Move between live notices, scheduled posts, archive items, and analytics without leaving the provider workspace.
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(["Pastoral", "Production", "Outreach", "Moderation"] as const).map(
                (role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setRoleView(role)}
                    className={cx(
                      "rounded-full px-4 py-2 text-[12px] font-semibold transition-colors",
                      roleView === role
                        ? "text-white"
                        : "border border-slate-200 bg-white text-slate-600",
                    )}
                    style={roleView === role ? { background: EV_NAVY } : undefined}
                  >
                    {role}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_180px_160px_1fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notices, linked objects, owners, or keywords"
                className="w-full rounded-[22px] border border-slate-200 bg-white py-3 pl-11 pr-4 text-[13px] font-medium text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            <div>
              <SelectField
                value={campusFilter}
                onChange={setCampusFilter}
                options={CAMPUSES}
              />
            </div>

            <div>
              <SelectField
                value={languageFilter}
                onChange={setLanguageFilter}
                options={LANGUAGES}
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              {VIEWS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setView(item)}
                  className={cx(
                    "rounded-full px-4 py-2 text-[12px] font-semibold transition-colors",
                    view === item
                      ? "text-white"
                      : "border border-slate-200 bg-white text-slate-600",
                  )}
                  style={view === item ? { background: EV_ORANGE } : undefined}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.95fr_1.1fr]">
          <div className="space-y-5">
            <Card
              title="Pinned and spotlight lane"
              subtitle="The most visible board notices for community, live, and event surfaces."
              right={<Pill tone="brand">{pinnedNotices.length} pinned</Pill>}
            >
              <div className="space-y-3">
                {pinnedNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill tone="brand">
                        <Pin className="h-3 w-3" />
                        Spotlight
                      </Pill>
                      <Pill tone={priorityTone(notice.priority)}>{notice.priority}</Pill>
                      <Pill tone={statusTone(notice.status)}>{notice.status}</Pill>
                    </div>
                    <div className="mt-3 text-[16px] font-bold text-slate-900">
                      {notice.title}
                    </div>
                    <div className="mt-1 text-[12px] leading-relaxed text-slate-500">
                      {notice.summary}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-slate-500">
                      <span>{notice.linkedTo}</span>
                      <span>{notice.campus}</span>
                      <span>{notice.expiresAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title="Notice stream"
              subtitle="Operational list of live, scheduled, and draft notices with fast editing and health context."
              right={<Pill tone="navy">{filteredNotices.length} visible</Pill>}
            >
              <div className="space-y-3">
                {filteredNotices.map((notice) => (
                  <NoticeCard
                    key={notice.id}
                    notice={notice}
                    selected={selectedId === notice.id}
                    onSelect={() => loadNoticeIntoComposer(notice)}
                  />
                ))}
              </div>
            </Card>

            <Card
              title="Board intelligence"
              subtitle="Read health, response quality, and cross-object opportunities."
              right={<BarChart3 className="h-4 w-4 text-slate-400" />}
            >
              <div className="grid gap-3 md:grid-cols-3">
                {boardInsights.map((insight) => (
                  <div
                    key={insight.label}
                    className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      {insight.label}
                    </div>
                    <div className="mt-2 text-[20px] font-black text-slate-900">
                      {insight.value}
                    </div>
                    <div className="mt-2 text-[12px] leading-relaxed text-slate-500">
                      {insight.hint}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            <Card
              title="Notice composer"
              subtitle="Write, route, schedule, and govern the next board item from one premium editing surface."
              right={
                <div className="flex items-center gap-2">
                  <SoftButton onClick={createNewNotice}>
                    <Plus className="h-4 w-4" />
                    New
                  </SoftButton>
                  <PrimaryButton onClick={() => saveNotice("Live")}>
                    <Send className="h-4 w-4" />
                    Publish
                  </PrimaryButton>
                </div>
              }
            >
              <div className="grid gap-4">
                <div>
                  <FieldLabel>Notice title</FieldLabel>
                  <Input
                    value={composer.title}
                    onChange={(value) =>
                      setComposer((prev) => ({ ...prev, title: value }))
                    }
                    placeholder="Write the board headline"
                  />
                </div>

                <div>
                  <FieldLabel>Summary</FieldLabel>
                  <TextArea
                    value={composer.summary}
                    onChange={(value) =>
                      setComposer((prev) => ({ ...prev, summary: value }))
                    }
                    rows={3}
                    placeholder="Short summary for cards, feeds, and previews"
                  />
                </div>

                <div>
                  <FieldLabel>Full notice body</FieldLabel>
                  <TextArea
                    value={composer.body}
                    onChange={(value) =>
                      setComposer((prev) => ({ ...prev, body: value }))
                    }
                    rows={5}
                    placeholder="Full board message, pastoral note, directions, or escalation details"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <FieldLabel>Category</FieldLabel>
                    <SelectField
                      value={composer.category}
                      onChange={(value) =>
                        setComposer((prev) => ({
                          ...prev,
                          category: value as Category,
                        }))
                      }
                      options={[
                        "Service update",
                        "Prayer alert",
                        "Volunteer call",
                        "Event notice",
                        "Giving update",
                        "Community reminder",
                        "Safety notice",
                      ]}
                    />
                  </div>

                  <div>
                    <FieldLabel>Priority</FieldLabel>
                    <SelectField
                      value={composer.priority}
                      onChange={(value) =>
                        setComposer((prev) => ({
                          ...prev,
                          priority: value as Priority,
                        }))
                      }
                      options={["Routine", "Important", "Urgent"]}
                    />
                  </div>

                  <div>
                    <FieldLabel>Campus</FieldLabel>
                    <SelectField
                      value={composer.campus}
                      onChange={(value) =>
                        setComposer((prev) => ({ ...prev, campus: value }))
                      }
                      options={CAMPUSES.slice(1)}
                    />
                  </div>

                  <div>
                    <FieldLabel>Audience</FieldLabel>
                    <SelectField
                      value={composer.audience}
                      onChange={(value) =>
                        setComposer((prev) => ({ ...prev, audience: value }))
                      }
                      options={AUDIENCES}
                    />
                  </div>

                  <div>
                    <FieldLabel>Language</FieldLabel>
                    <SelectField
                      value={composer.language}
                      onChange={(value) =>
                        setComposer((prev) => ({ ...prev, language: value }))
                      }
                      options={LANGUAGES}
                    />
                  </div>

                  <div>
                    <FieldLabel>Linked object</FieldLabel>
                    <SelectField
                      value={composer.linkedTo}
                      onChange={(value) =>
                        setComposer((prev) => ({ ...prev, linkedTo: value }))
                      }
                      options={LINKED_OBJECTS}
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>Surfaces</FieldLabel>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ALL_SURFACES.map((surface) => {
                      const active = composer.surfaces.includes(surface);
                      return (
                        <button
                          key={surface}
                          type="button"
                          onClick={() => toggleSurface(surface)}
                          className={cx(
                            "rounded-full border px-3 py-2 text-[11px] font-semibold transition-colors",
                            active
                              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                          )}
                        >
                          {surface}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <FieldLabel>Publish window start</FieldLabel>
                    <Input
                      value={composer.scheduledAt}
                      onChange={(value) =>
                        setComposer((prev) => ({ ...prev, scheduledAt: value }))
                      }
                      placeholder="Today � 4:45 PM"
                    />
                  </div>
                  <div>
                    <FieldLabel>Expiry / unpin time</FieldLabel>
                    <Input
                      value={composer.expiresAt}
                      onChange={(value) =>
                        setComposer((prev) => ({ ...prev, expiresAt: value }))
                      }
                      placeholder="Tomorrow � 11:30 PM"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <ToggleCard
                    checked={composer.pinned}
                    onChange={(value) =>
                      setComposer((prev) => ({ ...prev, pinned: value }))
                    }
                    label="Pin to spotlight lane"
                    hint="Places the notice in the board header and important surfaces."
                    accent="orange"
                  />
                  <ToggleCard
                    checked={composer.approvalRequired}
                    onChange={(value) =>
                      setComposer((prev) => ({
                        ...prev,
                        approvalRequired: value,
                      }))
                    }
                    label="Approval & audit routing"
                    hint="Keep leadership, moderators, or safeguarding leads in the loop."
                  />
                  <ToggleCard
                    checked={composer.sendToJourney}
                    onChange={(value) =>
                      setComposer((prev) => ({ ...prev, sendToJourney: value }))
                    }
                    label="Hand off to notification journey"
                    hint="Create a reminder or follow-up flow from this notice."
                  />
                  <ToggleCard
                    checked={composer.boostWithBeacon}
                    onChange={(value) =>
                      setComposer((prev) => ({ ...prev, boostWithBeacon: value }))
                    }
                    label="Promote with Beacon"
                    hint="Boost major announcements, giving notices, and public campaigns."
                    accent="orange"
                  />
                </div>

                <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-2">
                  <SoftButton onClick={() => saveNotice("Draft")}>
                    <CheckCircle2 className="h-4 w-4" />
                    Save draft
                  </SoftButton>
                  <SoftButton onClick={() => saveNotice("Scheduled")}>
                    <CalendarClock className="h-4 w-4" />
                    Schedule notice
                  </SoftButton>
                  <SoftButton>
                    <Workflow className="h-4 w-4" />
                    Open audience sync
                  </SoftButton>
                </div>
              </div>
            </Card>

            <Card
              title="Workflow bridges"
              subtitle="Take a notice into the next best provider workflow."
              right={<Workflow className="h-4 w-4 text-slate-400" />}
            >
              <div className="grid gap-3">
                {[
                  {
                    icon: <Bell className="h-4 w-4" />,
                    title: "Audience Notifications",
                    detail:
                      "Turn this notice into a countdown, replay-ready, or follow-up journey.",
                  },
                  {
                    icon: <Megaphone className="h-4 w-4" />,
                    title: "Beacon handoff",
                    detail:
                      "Boost high-priority announcements, charity alerts, or event notices with promotion.",
                  },
                  {
                    icon: <MonitorPlay className="h-4 w-4" />,
                    title: "Live Sessions bridge",
                    detail:
                      "Surface the same message in waiting rooms, live overlays, and post-live pages.",
                  },
                  {
                    icon: <Link2 className="h-4 w-4" />,
                    title: "Events / Giving links",
                    detail:
                      "Attach the notice to events, funds, or charity campaigns without duplicate writing.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-[16px] text-white"
                        style={{ background: EV_NAVY }}
                      >
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-slate-900">
                          {item.title}
                        </div>
                        <div className="mt-1 text-[12px] leading-relaxed text-slate-500">
                          {item.detail}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title="Trust and safety lane"
              subtitle="Queue items that need policy, leadership, or child-safe review."
              right={<Pill tone="warn">{approvalBacklog.length} waiting</Pill>}
            >
              <div className="space-y-3">
                {approvalBacklog.map((notice) => (
                  <div
                    key={notice.id}
                    className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-slate-900">
                          {notice.title}
                        </div>
                        <div className="mt-1 text-[12px] text-slate-500">
                          {notice.category} � {notice.campus} � {notice.owner}
                        </div>
                      </div>
                      <Pill tone="warn">
                        <AlertTriangle className="h-3 w-3" />
                        Review
                      </Pill>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            <Card
              title="Live preview"
              subtitle="Preview the notice as it will appear on desktop boards and mobile community surfaces."
              right={
                <div className="flex items-center gap-2">
                  <Pill tone="good">
                    <Eye className="h-3 w-3" />
                    Real-time preview
                  </Pill>
                </div>
              }
            >
              <div className="space-y-5">
                <BoardPreviewDesktop draft={composer} />
                <BoardPreviewMobile draft={composer} />
              </div>
            </Card>

            <Card
              title="Operational calendar lane"
              subtitle="See how the board behaves over the next 24 hours."
              right={<CalendarClock className="h-4 w-4 text-slate-400" />}
            >
              <div className="space-y-3">
                {[
                  {
                    time: composer.scheduledAt,
                    label: "Notice goes live",
                    detail: composer.title,
                    tone: "good" as Tone,
                  },
                  {
                    time: "Today � 6:15 PM",
                    label: "Live Session overlay sync",
                    detail: composer.surfaces.includes("Live Sessions")
                      ? "Armed for waiting room and live viewer surface"
                      : "No live surface selected",
                    tone: composer.surfaces.includes("Live Sessions")
                      ? ("navy" as Tone)
                      : ("neutral" as Tone),
                  },
                  {
                    time: "Today � 7:00 PM",
                    label: "Notification handoff",
                    detail: composer.sendToJourney
                      ? "Journey builder can inherit this notice"
                      : "Handoff disabled",
                    tone: composer.sendToJourney ? ("good" as Tone) : ("warn" as Tone),
                  },
                  {
                    time: composer.expiresAt,
                    label: "Notice expires / unpins",
                    detail: "Board and linked surfaces revert automatically",
                    tone: "warn" as Tone,
                  },
                ].map((item) => (
                  <div
                    key={`${item.time}-${item.label}`}
                    className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                          {item.time}
                        </div>
                        <div className="mt-1 text-[13px] font-semibold text-slate-900">
                          {item.label}
                        </div>
                        <div className="mt-1 text-[12px] text-slate-500">
                          {item.detail}
                        </div>
                      </div>
                      <Pill tone={item.tone}>{item.label.includes("expires") ? "Auto" : "Queued"}</Pill>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title="Executive guidance"
              subtitle="Role-aware recommendations for production, leadership, and outreach teams."
              right={<Sparkles className="h-4 w-4 text-slate-400" />}
            >
              <div className="space-y-3">
                {[
                  {
                    title: "Promote high-response notices with Beacon",
                    detail:
                      "The flood-relief and volunteer notices are showing the strongest tap rate today.",
                    action: "Open Beacon",
                    accent: EV_ORANGE,
                  },
                  {
                    title: "Sync urgent service changes into Live Sessions",
                    detail:
                      "Service-time notices should mirror into the waiting room and live reminder surfaces.",
                    action: "Link live",
                    accent: EV_GREEN,
                  },
                  {
                    title: "Keep child-safe notices in the approval lane",
                    detail:
                      "Parent and youth-targeted board items should retain moderation and quiet-hour protections.",
                    action: "Review lane",
                    accent: EV_NAVY,
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="text-[13px] font-semibold text-slate-900">
                      {item.title}
                    </div>
                    <div className="mt-1 text-[12px] leading-relaxed text-slate-500">
                      {item.detail}
                    </div>
                    <button
                      type="button"
                      className="mt-3 rounded-full px-4 py-2 text-[11px] font-semibold text-white"
                      style={{ background: item.accent }}
                     onClick={handleRawPlaceholderAction}>
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-6 py-3 text-center text-[13px] font-medium text-slate-700">
          Concept preview of the generated FaithHub Noticeboard page � EVzone Green primary ({EV_GREEN}) � Orange secondary ({EV_ORANGE})
        </div>
      </div>
    </div>
  );
}





