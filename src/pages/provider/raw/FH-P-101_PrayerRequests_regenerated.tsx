// @ts-nocheck
"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  CheckCircle2,
  Copy,
  Eye,
  HeartHandshake,
  Info,
  LayoutGrid,
  Lock,
  MessageSquareHeart,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";
import { navigateWithRouter } from "@/navigation/routerNavigate";
import { ProviderPageTitle } from "@/components/provider/ProviderPageTitle";
import { ProviderSurfaceCard } from "@/components/provider/ProviderSurfaceCard";

/**
 * Provider � Prayer Requests
 * -----------------------------------
 * Regenerated standalone TSX page.
 * Premium prayer intake and care-management surface for Providers.
 *
 * Primary CTAs
 * - + New Request
 * - Assign Care Lead
 * - Mark Answered
 *
 * Product notes
 * - EVzone Green (#03cd8c) is primary and Orange (#f77f00) is secondary.
 * - The page keeps the premium Provider-side grammar used across the platform:
 *   strong command hero, KPI strip, inbox + care lane + detail pane,
 *   quick-create templates, persistent preview rail, and a larger preview drawer.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#1e2e6d";

const ROUTES = {
  providerDashboard: "/faithhub/provider/dashboard",
  noticeboard: "/faithhub/provider/noticeboard",
  communityGroups: "/faithhub/provider/community-groups",
  testimonies: "/faithhub/provider/testimonies",
  moderation: "/faithhub/provider/reviews-and-moderation",
};

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  navigateWithRouter(url);
}

type FilterKey = "all" | "new" | "assigned" | "followup" | "answered" | "anonymous";
type PreviewMode = "desktop" | "mobile";
type RequestStatus = "New intake" | "Assigned" | "Follow-up" | "Escalated" | "Answered";
type Urgency = "Routine" | "Priority" | "Urgent" | "Critical";
type PrivacyMode = "Care team" | "Private" | "Anonymous" | "Prayer wall";
type CareState = "Available" | "On-call" | "At capacity";

type PrayerRequest = {
  id: string;
  shortCode: string;
  title: string;
  requester: string;
  owner: string;
  source: string;
  group: string;
  location: string;
  submittedLabel: string;
  followUpLabel: string;
  summary: string;
  status: RequestStatus;
  urgency: Urgency;
  privacy: PrivacyMode;
  prayerCount: number;
  childSafe: boolean;
  testimonyReady: boolean;
  notes: string[];
};

type RoutingLane = {
  id: string;
  title: string;
  subtitle: string;
  count: number;
  tone: "green" | "orange" | "neutral" | "danger";
};

type TemplateCard = {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
};

type CareLead = {
  id: string;
  name: string;
  role: string;
  location: string;
  state: CareState;
};

const REQUESTS_SEED: PrayerRequest[] = [
  {
    id: "pr_001",
    shortCode: "Hea",
    title: "Prayer for surgery and peace this week",
    requester: "Angela M.",
    owner: "Pastor Miriam A.",
    source: "Community Group",
    group: "Care team",
    location: "Kampala Central",
    submittedLabel: "Today � 7:00 PM",
    followUpLabel: "Next follow-up � Today 7:40 PM",
    summary:
      "Scheduled for surgery on Thursday morning. Please pray for peace, wisdom for the doctors, and strength for family as they prepare.",
    status: "Assigned",
    urgency: "Urgent",
    privacy: "Care team",
    prayerCount: 28,
    childSafe: false,
    testimonyReady: false,
    notes: [
      "Requested scripture encouragement and voice note follow-up.",
      "Family group notified privately.",
      "Potential testimony follow-up after recovery.",
    ],
  },
  {
    id: "pr_002",
    shortCode: "Fam",
    title: "Family crisis request received from live session",
    requester: "Anonymous",
    owner: "Amos T.",
    source: "Live Sessions",
    group: "Anonymous support",
    location: "Online first",
    submittedLabel: "Today � 11:30 AM",
    followUpLabel: "Escalation review � Today 3:15 PM",
    summary:
      "Prayer and stabilizing support requested after a live-session altar call. Needs careful privacy handling and counseling bridge review.",
    status: "Escalated",
    urgency: "Critical",
    privacy: "Anonymous",
    prayerCount: 12,
    childSafe: true,
    testimonyReady: false,
    notes: [
      "Anonymous mode preserved.",
      "Counseling bridge requested before broader care routing.",
      "No public testimony conversion allowed at this stage.",
    ],
  },
  {
    id: "pr_003",
    shortCode: "Fin",
    title: "Job search, provision, and direction",
    requester: "Josephine N.",
    owner: "Daniel K.",
    source: "Prayer wall",
    group: "Prayer wall",
    location: "Online first",
    submittedLabel: "Tomorrow � 9:30 AM",
    followUpLabel: "Check-in � Tomorrow 2:00 PM",
    summary:
      "Asking for provision, open doors, and peace during a long job search. Prefers scripture response and a prayer-circle reminder.",
    status: "Follow-up",
    urgency: "Priority",
    privacy: "Prayer wall",
    prayerCount: 41,
    childSafe: false,
    testimonyReady: true,
    notes: [
      "High prayer engagement from prayer wall.",
      "Candidate for answered-prayer tracking if opportunity lands.",
    ],
  },
  {
    id: "pr_004",
    shortCode: "Gui",
    title: "Guidance for baptism and next steps",
    requester: "Grace P.",
    owner: "Unassigned",
    source: "Noticeboard",
    group: "New intake",
    location: "Entebbe South",
    submittedLabel: "Tomorrow � 4:00 PM",
    followUpLabel: "Assign leader � Tomorrow 5:00 PM",
    summary:
      "New believer requesting prayer, next-step guidance, and baptism preparation. Good candidate for discipleship routing after first response.",
    status: "New intake",
    urgency: "Routine",
    privacy: "Private",
    prayerCount: 7,
    childSafe: false,
    testimonyReady: false,
    notes: [
      "Potential cross-link to discipleship group.",
      "Needs first response and care-owner assignment.",
    ],
  },
  {
    id: "pr_005",
    shortCode: "Ans",
    title: "Answered prayer for restored relationship",
    requester: "Mercy L.",
    owner: "Ruth S.",
    source: "Pastoral follow-up",
    group: "Answered prayers",
    location: "Kampala Central",
    submittedLabel: "This week",
    followUpLabel: "Testimony review � Friday",
    summary:
      "Submitted update that reconciliation has happened and family peace has improved. Suitable for moderated testimony review once approved.",
    status: "Answered",
    urgency: "Routine",
    privacy: "Care team",
    prayerCount: 57,
    childSafe: false,
    testimonyReady: true,
    notes: [
      "Ready for testimony conversion if consent is confirmed.",
      "Needs pastoral response before public feature.",
    ],
  },
];

const ROUTING_LANES: RoutingLane[] = [
  {
    id: "lane_new",
    title: "New intake",
    subtitle: "Fresh requests waiting for prayer ownership and care routing.",
    count: 1,
    tone: "orange",
  },
  {
    id: "lane_assigned",
    title: "Assigned & praying",
    subtitle: "Requests with active care ownership and active prayer response.",
    count: 2,
    tone: "green",
  },
  {
    id: "lane_follow",
    title: "Follow-up due",
    subtitle: "Check-ins, scripture encouragement, and callback moments due soon.",
    count: 1,
    tone: "orange",
  },
  {
    id: "lane_answered",
    title: "Answered / testimony-ready",
    subtitle: "Requests moving into thanksgiving, testimony, or noticeboard-safe follow-up.",
    count: 1,
    tone: "green",
  },
  {
    id: "lane_bridge",
    title: "Counseling bridge",
    subtitle: "Higher-risk or sensitive cases needing tighter privacy and escalation review.",
    count: 1,
    tone: "danger",
  },
];

const TEMPLATE_CARDS: TemplateCard[] = [
  {
    id: "tpl_urgent",
    title: "Urgent care request",
    subtitle: "Fast-track prayer + pastoral routing with privacy-first follow-up.",
    accent: EV_ORANGE,
  },
  {
    id: "tpl_live",
    title: "Live-session intake",
    subtitle: "Capture altar-call and live prayer moments without breaking context.",
    accent: EV_GREEN,
  },
  {
    id: "tpl_anon",
    title: "Anonymous support",
    subtitle: "Sensitive intake with stricter privacy, escalation, and reduced exposure.",
    accent: EV_NAVY,
  },
  {
    id: "tpl_answered",
    title: "Answered prayer",
    subtitle: "Move requests into thanksgiving and testimony-readiness safely.",
    accent: EV_GREEN,
  },
];

const CARE_LEADS: CareLead[] = [
  {
    id: "lead_1",
    name: "Pastor Miriam A.",
    role: "Prayer lead",
    location: "Kampala Central",
    state: "Available",
  },
  {
    id: "lead_2",
    name: "Daniel K.",
    role: "Follow-up coordinator",
    location: "Online first",
    state: "On-call",
  },
  {
    id: "lead_3",
    name: "Ruth S.",
    role: "Family care lead",
    location: "Entebbe South",
    state: "At capacity",
  },
];

function toneForUrgency(urgency: Urgency) {
  if (urgency === "Critical") return "danger" as const;
  if (urgency === "Urgent") return "orange" as const;
  if (urgency === "Priority") return "orange" as const;
  return "neutral" as const;
}

function toneForStatus(status: RequestStatus) {
  if (status === "Assigned" || status === "Answered") return "green" as const;
  if (status === "Escalated") return "danger" as const;
  if (status === "Follow-up" || status === "New intake") return "orange" as const;
  return "neutral" as const;
}

function toneForCareState(state: CareState) {
  if (state === "Available") return "green" as const;
  if (state === "On-call") return "orange" as const;
  return "danger" as const;
}

function Pill({
  text,
  tone = "neutral",
  icon,
}: {
  text: string;
  tone?: "neutral" | "green" | "orange" | "danger" | "navy";
  icon?: React.ReactNode;
}) {
  const toneCls =
    tone === "green"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "orange"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : tone === "danger"
          ? "border-rose-200 bg-rose-50 text-rose-800"
          : tone === "navy"
            ? "border-indigo-200 bg-indigo-50 text-indigo-800"
            : "border-faith-line bg-[var(--fh-surface-bg)] text-slate-700";

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
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
        "inline-flex items-center gap-2 rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] px-4 py-2 text-[12px] font-semibold text-slate-700 transition-colors hover:bg-[var(--fh-surface)]",
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
  tone = "green",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  tone?: "green" | "orange";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl border border-transparent px-4 py-2 text-[12px] font-semibold text-white transition-opacity hover:opacity-95",
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
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <ProviderSurfaceCard
      title={title}
      subtitle={subtitle}
      right={right}
      className="rounded-[28px] shadow-none"
      titleClassName="text-[13px] font-semibold tracking-wide text-faith-slate uppercase"
      subtitleClassName="mt-1 leading-5"
    >
      {children}
    </ProviderSurfaceCard>
  );
}

function StatCard({
  label,
  value,
  hint,
  tone = "green",
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "green" | "orange" | "navy";
}) {
  const dotBg = tone === "green" ? "#d7f7ea" : tone === "orange" ? "#fdebd6" : "#e6ebfb";
  return (
    <div className="rounded-[26px] border border-faith-line bg-[var(--fh-surface-bg)] p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[12px] uppercase tracking-wide text-faith-slate font-semibold">{label}</div>
          <div className="mt-2 text-[42px] leading-none font-black tracking-tight text-faith-ink">{value}</div>
          <div className="mt-2 text-[12px] text-faith-slate">{hint}</div>
        </div>
        <div className="h-10 w-10 rounded-[18px]" style={{ background: dotBg }} />
      </div>
    </div>
  );
}

function RequestRow({
  request,
  active,
  onSelect,
}: {
  request: PrayerRequest;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cx(
        "w-full rounded-[24px] border px-3 py-3 text-left transition-colors",
        active
          ? "border-emerald-300 bg-emerald-50"
          : "border-faith-line bg-[var(--fh-surface-bg)] hover:bg-[var(--fh-surface)]",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] text-[12px] font-black text-white"
          style={{
            background:
              request.shortCode === "Hea"
                ? EV_GREEN
                : request.shortCode === "Fam"
                  ? EV_ORANGE
                  : request.shortCode === "Fin"
                    ? EV_NAVY
                    : EV_GREEN,
          }}
        >
          {request.shortCode}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-[14px] font-bold text-faith-ink">{request.title}</div>
              <div className="mt-1 truncate text-[12px] text-faith-slate">
                {request.requester} � {request.owner} � {request.submittedLabel}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="flex flex-wrap items-center justify-end gap-1.5">
                <Pill text={request.status} tone={toneForStatus(request.status)} />
                <Pill text={request.urgency} tone={toneForUrgency(request.urgency)} />
                <Pill text={request.privacy} tone="neutral" />
              </div>
              <div className="mt-2 text-[12px] text-slate-700">{request.prayerCount} prayers</div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

function PreviewCard({
  request,
  mode,
  onModeChange,
  onOpenLarge,
  onCopy,
}: {
  request: PrayerRequest;
  mode: PreviewMode;
  onModeChange: (mode: PreviewMode) => void;
  onOpenLarge: () => void;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-[28px] border border-faith-line bg-[var(--fh-surface-bg)] p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-wide text-faith-slate">Prayer destination preview</div>
          <div className="mt-1 text-[12px] text-faith-slate">
            Persistent preview rail for the selected request, care response, and member-facing actions.
          </div>
        </div>
        <div className="inline-flex rounded-full border border-faith-line bg-[var(--fh-surface)] p-1">
          <button className={cx("rounded-full px-3 py-1 text-[11px] font-semibold", mode === "desktop" ? "bg-[#1d2b64] text-white" : "text-faith-slate")} onClick={() => onModeChange("desktop")}>Desktop</button>
          <button className={cx("rounded-full px-3 py-1 text-[11px] font-semibold", mode === "mobile" ? "bg-[#1d2b64] text-white" : "text-faith-slate")} onClick={() => onModeChange("mobile")}>Mobile</button>
        </div>
      </div>

      <div className={cx("mt-4 rounded-[24px] border border-faith-line bg-[var(--fh-surface)] p-3", mode === "mobile" ? "max-w-[320px]" : "") }>
        <div className="rounded-[20px] bg-[#1d2b64] px-4 py-4 text-white">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">Prayer Care</div>
          <div className="mt-2 text-[18px] font-black">A new prayer care moment is ready</div>
        </div>
        <div className="mt-4 rounded-[20px] border border-faith-line bg-[var(--fh-surface-bg)] p-4">
          <div className="text-[14px] font-bold text-faith-ink">{request.title}</div>
          <div className="mt-1 text-[12px] text-faith-slate">{request.group} � {request.submittedLabel} � {request.location}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-full px-4 py-2 text-[12px] font-semibold text-white" style={{ background: EV_GREEN }} onClick={() => safeNav("/faithhub/provider/prayer-requests")}>
              Pray now
            </button>
            <button className="rounded-full border border-faith-line bg-[var(--fh-surface-bg)] px-4 py-2 text-[12px] font-semibold text-slate-700" onClick={() => safeNav("/faithhub/provider/counseling")}>
              Send encouragement
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <SoftButton onClick={onOpenLarge}>
          <Eye className="h-4 w-4" /> Open large preview
        </SoftButton>
        <SoftButton onClick={onCopy}>
          <Copy className="h-4 w-4" /> Copy request link
        </SoftButton>
      </div>
    </div>
  );
}

function TemplateTile({ template }: { template: TemplateCard }) {
  return (
    <div className="rounded-[22px] border border-faith-line bg-[var(--fh-surface-bg)] p-3">
      <div className="h-1.5 w-16 rounded-full" style={{ background: template.accent }} />
      <div className="mt-3 text-[13px] font-bold text-faith-ink">{template.title}</div>
      <div className="mt-1 text-[12px] text-faith-slate leading-5">{template.subtitle}</div>
      <button
        type="button"
        className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold"
        style={{ color: EV_GREEN }}
        onClick={() => safeNav("/faithhub/provider/prayer-requests")}>
        Use template <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function CareLeadRow({ lead }: { lead: CareLead }) {
  return (
    <div className="rounded-[22px] border border-faith-line bg-[var(--fh-surface-bg)] px-3 py-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-[13px] font-bold text-faith-ink">{lead.name}</div>
          <div className="mt-1 text-[12px] text-faith-slate">{lead.role} � {lead.location}</div>
        </div>
        <Pill text={lead.state} tone={toneForCareState(lead.state)} />
      </div>
    </div>
  );
}

function PrayerRequestsPage() {
  const [requests, setRequests] = useState<PrayerRequest[]>(REQUESTS_SEED);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>(REQUESTS_SEED[0].id);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const selectedRequest = useMemo(
    () => requests.find((r) => r.id === selectedId) || requests[0],
    [requests, selectedId],
  );

  const filteredRequests = useMemo(() => {
    const q = query.trim().toLowerCase();
    return requests.filter((request) => {
      const matchesQuery =
        !q ||
        request.title.toLowerCase().includes(q) ||
        request.requester.toLowerCase().includes(q) ||
        request.owner.toLowerCase().includes(q) ||
        request.source.toLowerCase().includes(q) ||
        request.group.toLowerCase().includes(q);

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "new"
            ? request.status === "New intake"
            : filter === "assigned"
              ? request.status === "Assigned"
              : filter === "followup"
                ? request.status === "Follow-up"
                : filter === "answered"
                  ? request.status === "Answered"
                  : request.privacy === "Anonymous";

      return matchesQuery && matchesFilter;
    });
  }, [filter, query, requests]);

  const openCount = requests.filter((r) => r.status !== "Answered").length;
  const unassignedCount = requests.filter((r) => r.owner === "Unassigned").length;
  const prayerActions = requests.reduce((sum, r) => sum + r.prayerCount, 0);
  const followUpsDue = requests.filter((r) => r.status === "Follow-up" || r.status === "Escalated").length;
  const answeredThisWeek = requests.filter((r) => r.status === "Answered").length;
  const childSafeFlags = requests.filter((r) => r.childSafe).length;

  const showToast = (msg: string) => {
    setToast(msg);
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(null), 2500);
  };

  const handleCreateRequest = () => {
    const next: PrayerRequest = {
      id: `pr_${Date.now()}`,
      shortCode: "New",
      title: "New prayer request draft",
      requester: "Provider intake",
      owner: "Unassigned",
      source: "Manual entry",
      group: "New intake",
      location: "Online first",
      submittedLabel: "Just now",
      followUpLabel: "Assign owner",
      summary: "A newly created prayer request is waiting for details and care routing.",
      status: "New intake",
      urgency: "Routine",
      privacy: "Private",
      prayerCount: 0,
      childSafe: false,
      testimonyReady: false,
      notes: ["Complete details and assign a care lead."],
    };
    setRequests((prev) => [next, ...prev]);
    setSelectedId(next.id);
    showToast("New prayer request draft created.");
  };

  const handleAssignCareLead = () => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? { ...r, owner: "Pastor Miriam A.", group: "Care team", status: r.status === "New intake" ? "Assigned" : r.status }
          : r,
      ),
    );
    showToast("Care lead assigned to selected request.");
  };

  const handleMarkAnswered = () => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? { ...r, status: "Answered", testimonyReady: true, group: "Answered prayers", followUpLabel: "Ready for testimony review" }
          : r,
      ),
    );
    showToast("Selected request marked as answered.");
  };

  const handleCopyLink = async () => {
    const link = `https://faithhub.app/provider/prayer-requests/${selectedRequest.id}`;
    try {
      await navigator.clipboard.writeText(link);
      showToast("Prayer request link copied.");
    } catch {
      showToast("Could not copy link in this browser.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--fh-page-bg)] text-faith-ink">
      <div className="mx-auto w-full max-w-[1600px] px-5 py-5">
        <div className="rounded-[30px] border border-faith-line bg-[var(--fh-surface-bg)] p-5 shadow-soft">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1">
              <ProviderPageTitle
                icon={<HeartHandshake className="h-6 w-6" />}
                title="Prayer Requests"
                subtitle="Prayer intake and care-routing command center for providers."
              />
            </div>

            <div className="flex flex-col items-start gap-3 xl:items-end">
              <div className="flex flex-wrap items-center gap-2">
                <Pill text="Private-safe" tone="neutral" icon={<Lock className="h-3.5 w-3.5" />} />
                <Pill text="Live-linked" tone="neutral" icon={<Zap className="h-3.5 w-3.5" />} />
                <Pill text="Answered prayer" tone="neutral" icon={<CheckCircle2 className="h-3.5 w-3.5" />} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <SoftButton onClick={() => setPreviewOpen(true)}>
                  <Eye className="h-4 w-4" /> Preview
                </SoftButton>
                <SoftButton onClick={handleAssignCareLead}>
                  <UserPlus className="h-4 w-4" /> Assign care lead
                </SoftButton>
                <PrimaryButton tone="orange" onClick={handleMarkAnswered}>
                  <BadgeCheck className="h-4 w-4" /> Mark Answered
                </PrimaryButton>
                <PrimaryButton onClick={handleCreateRequest}>
                  <Plus className="h-4 w-4" /> + New Request
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-full border border-faith-line bg-[var(--fh-surface-bg)] px-4 py-2 text-[13px] text-faith-slate">
          <div className="flex flex-wrap items-center gap-3">
            <Pill text="Prayer care pulse" tone="orange" />
            <span>4 follow-ups are due today</span>
            <span>�</span>
            <span>1 escalated request needs counseling bridge review</span>
            <span>�</span>
            <span>2 answered prayers are testimony-ready</span>
          </div>
          <div className="text-[12px] uppercase tracking-[0.2em] text-faith-slate">Premium prayer ops</div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <StatCard label="Open requests" value={String(openCount)} hint="Requests still active in care lanes." tone="green" />
          <StatCard label="Unassigned" value={String(unassignedCount)} hint="Waiting for ownership or closure." tone="orange" />
          <StatCard label="Prayer actions" value={String(prayerActions)} hint="Prayers, responses, and notes." tone="navy" />
          <StatCard label="Follow-ups due" value={String(followUpsDue)} hint="Calls, scripture, or check-ins." tone="orange" />
          <StatCard label="Answered this week" value={String(answeredThisWeek)} hint="Moved into thanksgiving lane." tone="green" />
          <StatCard label="Child-safe flags" value={String(childSafeFlags)} hint="Stricter safety defaults active." tone="navy" />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_0.95fr_0.7fr]">
          <div className="space-y-4">
            <Card
              title="Prayer requests inbox"
              subtitle="Premium intake catalog for private requests, live-session prayer moments, event follow-up, and answered-prayer updates."
              right={<div className="flex items-center gap-2 text-[12px] text-faith-slate"><span className="rounded-full border border-faith-line px-3 py-1">{filteredRequests.length} requests</span><span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700">3 due today</span></div>}
            >
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[280px] flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faith-slate" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search requests, groups, tags, or sources"
                    className="w-full rounded-[20px] border border-faith-line bg-[var(--fh-surface)] px-11 py-3 text-[13px] outline-none focus:border-emerald-300 focus:bg-[var(--fh-surface-bg)]"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    ["all", "All"],
                    ["new", "New"],
                    ["assigned", "Assigned"],
                    ["followup", "Follow-up"],
                    ["answered", "Answered"],
                    ["anonymous", "Anonymous"],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFilter(key as FilterKey)}
                      className={cx(
                        "rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
                        filter === key
                          ? key === "followup"
                            ? "border-amber-300 bg-amber-50 text-amber-800"
                            : "border-indigo-300 bg-indigo-50 text-indigo-800"
                          : "border-faith-line bg-[var(--fh-surface-bg)] text-faith-slate hover:bg-[var(--fh-surface)]",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {filteredRequests.map((request) => (
                  <RequestRow
                    key={request.id}
                    request={request}
                    active={request.id === selectedRequest.id}
                    onSelect={() => setSelectedId(request.id)}
                  />
                ))}
              </div>
            </Card>

            <Card
              title="Quick-create templates"
              subtitle="Launch common prayer-care flows fast while keeping privacy, routing, answered-prayer tracking, and community follow-up intact."
              right={<Pill text="Prayer workflows" tone="green" icon={<LayoutGrid className="h-3.5 w-3.5" />} />}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {TEMPLATE_CARDS.map((template) => (
                  <TemplateTile key={template.id} template={template} />
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card
              title="Routing & care lane"
              subtitle="Operational signals showing where requests need ownership, escalation, follow-up, or answered-prayer movement."
              right={<Pill text="Action now" tone="orange" icon={<Bell className="h-3.5 w-3.5" />} />}
            >
              <div className="space-y-2">
                {ROUTING_LANES.map((lane) => (
                  <div
                    key={lane.id}
                    className={cx(
                      "rounded-[18px] border px-3 py-2.5",
                      lane.tone === "green"
                        ? "border-emerald-300 bg-emerald-50"
                        : lane.tone === "orange"
                          ? "border-amber-300 bg-amber-50"
                          : lane.tone === "danger"
                            ? "border-rose-300 bg-rose-50"
                            : "border-faith-line bg-[var(--fh-surface)]",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[14px] font-bold text-faith-ink">{lane.title}</div>
                        <div className="mt-1 text-[12px] text-faith-slate">{lane.subtitle}</div>
                      </div>
                      <div className="grid h-7 min-w-[28px] place-items-center rounded-full border border-amber-300 bg-[var(--fh-surface-bg)] px-2 text-[12px] font-bold text-amber-700">
                        {lane.count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title="Selected request detail"
              subtitle="Full care context, privacy mode, routing history, community hooks, and answered-prayer readiness for the selected request."
              right={<SoftButton onClick={handleCopyLink}><Copy className="h-4 w-4" /> Copy link</SoftButton>}
            >
              <div className="flex flex-wrap items-center gap-2">
                <Pill text={selectedRequest.status} tone={toneForStatus(selectedRequest.status)} />
                <Pill text={selectedRequest.urgency} tone={toneForUrgency(selectedRequest.urgency)} />
                <Pill text={selectedRequest.privacy} tone="neutral" />
              </div>

              <div className="mt-4 text-[48px] leading-[0.98] font-black tracking-tight text-faith-ink">
                {selectedRequest.title}
              </div>
              <div className="mt-3 text-[14px] leading-7 text-faith-slate">{selectedRequest.summary}</div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-[20px] border border-faith-line bg-[var(--fh-surface)] px-3 py-3">
                  <div className="text-[11px] uppercase tracking-wide text-faith-slate">Routing</div>
                  <div className="mt-1 text-[13px] font-semibold text-faith-ink">Care lead: {selectedRequest.owner}</div>
                  <div className="mt-1 text-[12px] text-faith-slate">Source: {selectedRequest.source}</div>
                </div>
                <div className="rounded-[20px] border border-faith-line bg-[var(--fh-surface)] px-3 py-3">
                  <div className="text-[11px] uppercase tracking-wide text-faith-slate">Follow-up</div>
                  <div className="mt-1 text-[13px] font-semibold text-faith-ink">Received: {selectedRequest.submittedLabel}</div>
                  <div className="mt-1 text-[12px] text-faith-slate">{selectedRequest.followUpLabel}</div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {selectedRequest.notes.map((note) => (
                  <div key={note} className="rounded-[18px] border border-faith-line bg-[var(--fh-surface-bg)] px-3 py-2.5 text-[12px] text-faith-slate">
                    {note}
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title="Answered prayer & testimony"
              subtitle="Convert answered prayers into thanksgiving moments, moderated testimonies, and encouragement-ready follow-up."
              right={<Pill text="Provider system links" tone="navy" icon={<Sparkles className="h-3.5 w-3.5" />} />}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-[18px] border border-emerald-300 bg-emerald-50 px-3 py-2.5">
                  <span className="text-[13px] font-semibold text-faith-ink">Answered prayers ready for testimonies</span>
                  <Pill text="Ready" tone="green" />
                </div>
                <div className="flex items-center justify-between rounded-[18px] border border-amber-300 bg-amber-50 px-3 py-2.5">
                  <span className="text-[13px] font-semibold text-faith-ink">Prayer wall health</span>
                  <Pill text="Watch" tone="orange" />
                </div>
                <div className="flex items-center justify-between rounded-[18px] border border-rose-300 bg-rose-50 px-3 py-2.5">
                  <span className="text-[13px] font-semibold text-faith-ink">Counseling bridge</span>
                  <Pill text="Action" tone="danger" />
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <PreviewCard
              request={selectedRequest}
              mode={previewMode}
              onModeChange={setPreviewMode}
              onOpenLarge={() => setPreviewOpen(true)}
              onCopy={handleCopyLink}
            />

            <Card
              title="Care lead roster"
              subtitle="Coverage visibility for pastoral, prayer, follow-up, and counseling-linked responses."
            >
              <div className="space-y-2">
                {CARE_LEADS.map((lead) => (
                  <CareLeadRow key={lead.id} lead={lead} />
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-4 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2 text-center text-[13px] text-faith-slate">
          Concept preview of the regenerated Prayer Requests page � EVzone Green primary ({EV_GREEN}) � Orange secondary ({EV_ORANGE})
        </div>
      </div>

      {previewOpen ? (
        <div className="fixed inset-0 z-[90]">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setPreviewOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-[760px] flex-col border-l border-faith-line bg-[var(--fh-surface-bg)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-faith-line px-5 py-4">
              <div>
                <div className="text-[15px] font-bold text-faith-ink">Prayer request preview</div>
                <div className="mt-1 text-[12px] text-faith-slate">Expanded preview for the selected request.</div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] text-faith-slate hover:bg-[var(--fh-surface)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-5 py-3">
              <button
                type="button"
                onClick={() => setPreviewMode("desktop")}
                className={cx(
                  "rounded-full px-4 py-1.5 text-[12px] font-semibold",
                  previewMode === "desktop" ? "bg-[#1d2b64] text-white" : "bg-slate-100 text-faith-slate",
                )}
              >
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("mobile")}
                className={cx(
                  "rounded-full px-4 py-1.5 text-[12px] font-semibold",
                  previewMode === "mobile" ? "bg-[#1d2b64] text-white" : "bg-slate-100 text-faith-slate",
                )}
              >
                Mobile
              </button>
            </div>

            <div className="flex-1 overflow-auto p-5">
              <div className={cx("mx-auto rounded-[34px] border border-faith-line bg-[var(--fh-surface)] p-4", previewMode === "mobile" ? "max-w-[360px]" : "max-w-[680px]") }>
                <div className="rounded-[26px] bg-[#1d2b64] px-5 py-5 text-white">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[var(--fh-surface-bg)]/10 px-3 py-1 text-[11px] font-semibold">
                    <HeartHandshake className="h-3.5 w-3.5" /> Prayer care
                  </div>
                  <div className="mt-3 text-[28px] font-black tracking-tight">Support is already being prepared</div>
                  <div className="mt-2 max-w-[420px] text-[14px] leading-6 text-white/80">
                    This prayer request is receiving care-team attention, private prayer support, and follow-up aligned to the member�s preferences.
                  </div>
                </div>

                <div className="mt-4 rounded-[24px] border border-faith-line bg-[var(--fh-surface-bg)] p-5">
                  <div className="text-[24px] leading-tight font-black text-faith-ink">{selectedRequest.title}</div>
                  <div className="mt-2 text-[13px] text-faith-slate">
                    {selectedRequest.group} � {selectedRequest.submittedLabel} � {selectedRequest.location}
                  </div>
                  <div className="mt-4 text-[14px] leading-7 text-faith-slate">{selectedRequest.summary}</div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <button className="rounded-full px-5 py-2.5 text-[13px] font-semibold text-white" style={{ background: EV_GREEN }} onClick={() => safeNav("/faithhub/provider/prayer-requests")}>
                      Pray now
                    </button>
                    <button className="rounded-full border border-faith-line bg-[var(--fh-surface-bg)] px-5 py-2.5 text-[13px] font-semibold text-slate-700" onClick={() => safeNav("/faithhub/provider/counseling")}>
                      Send encouragement
                    </button>
                    <button className="rounded-full border border-faith-line bg-[var(--fh-surface-bg)] px-5 py-2.5 text-[13px] font-semibold text-slate-700" onClick={() => safeNav("/faithhub/provider/counseling")}>
                      Request follow-up
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-[22px] border border-faith-line bg-[var(--fh-surface-bg)] p-4">
                    <div className="text-[12px] font-semibold uppercase tracking-wide text-faith-slate">Care ownership</div>
                    <div className="mt-2 text-[16px] font-bold text-faith-ink">{selectedRequest.owner}</div>
                    <div className="mt-1 text-[13px] text-faith-slate">{selectedRequest.group} � {selectedRequest.source}</div>
                  </div>
                  <div className="rounded-[22px] border border-faith-line bg-[var(--fh-surface-bg)] p-4">
                    <div className="text-[12px] font-semibold uppercase tracking-wide text-faith-slate">Prayer activity</div>
                    <div className="mt-2 text-[16px] font-bold text-faith-ink">{selectedRequest.prayerCount} prayers</div>
                    <div className="mt-1 text-[13px] text-faith-slate">{selectedRequest.followUpLabel}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-[95] -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-[13px] font-semibold text-white shadow-xl">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

export default PrayerRequestsPage;






