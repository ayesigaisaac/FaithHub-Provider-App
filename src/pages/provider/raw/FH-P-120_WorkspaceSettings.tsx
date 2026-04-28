// @ts-nocheck

"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Globe2,
  Languages,
  Link2,
  Mail,
  MapPin,
  MessageSquare,
  MonitorSmartphone,
  Palette,
  Plus,
  Save,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import { KpiTile } from "../../../components/ui/KpiTile";
import { ProviderPageTitle } from "@/components/provider/ProviderPageTitle";
import { ProviderSurfaceCard } from "@/components/provider/ProviderSurfaceCard";
import { useAuth } from "@/auth/useAuth";

/**
 * Provider � Workspace Settings
 * --------------------------------------
 * Purpose:
 * Premium operating page for institution-wide defaults across branding,
 * campuses, localization, workspace identity, integrations, and operational
 * preferences.
 *
 * Primary CTAs:
 * - Save Changes
 * - Add Campus
 * - Connect Integration
 *
 * Design:
 * - EVzone Green as primary (#03cd8c)
 * - EVzone Orange as secondary (#f77f00)
 */

const GREEN = "#03cd8c";
const ORANGE = "#f77f00";
const MEDIUM = "#a6a6a6";
const LIGHT = "#f2f2f2";

type SettingsTab =
  | "identity"
  | "campuses"
  | "localization"
  | "integrations"
  | "operations";

type PreviewMode = "desktop" | "mobile";

type Campus = {
  id: string;
  name: string;
  region: string;
  timezone: string;
  serviceMode: "Physical" | "Hybrid" | "Online-first";
  attendanceModel: "Open access" | "Registration" | "Members first";
  accessibility: string;
  liveDefault: string;
  status: "Healthy" | "Needs review";
};

type Integration = {
  id: string;
  name: string;
  category: "Payments" | "Messaging" | "Scheduling" | "Streaming" | "Maps" | "Analytics";
  status: "Connected" | "Needs attention" | "Not connected";
  owner: string;
  detail: string;
  health: string;
};

type LocalePack = {
  code: string;
  label: string;
  status: "Published" | "Draft" | "Needs review";
  direction: "LTR" | "RTL";
  launchSurface: string;
};

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
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
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-extrabold whitespace-nowrap",
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

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cx(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        checked ? "bg-slate-900 dark:bg-[var(--fh-surface-bg)]" : "bg-slate-300 dark:bg-slate-700",
      )}
    >
      <span
        className={cx(
          "inline-block h-5 w-5 transform rounded-full bg-[var(--fh-surface-bg)] dark:bg-slate-900 shadow-md transition-transform",
          checked ? "translate-x-5" : "translate-x-1",
        )}
      />
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

function SectionTab({
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
        <span className={cx(
          "h-8 w-8 rounded-xl grid place-items-center",
          active ? "bg-[var(--fh-surface-bg)] dark:bg-slate-900 text-faith-ink dark:text-slate-100" : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
        )}>
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

const initialCampuses: Campus[] = [
  {
    id: "campus_1",
    name: "Kampala Central",
    region: "Uganda � East Africa",
    timezone: "Africa/Kampala",
    serviceMode: "Hybrid",
    attendanceModel: "Open access",
    accessibility: "Wheelchair access � Assisted listening",
    liveDefault: "Primary live control room",
    status: "Healthy",
  },
  {
    id: "campus_2",
    name: "Nairobi Fellowship Hub",
    region: "Kenya � East Africa",
    timezone: "Africa/Nairobi",
    serviceMode: "Hybrid",
    attendanceModel: "Registration",
    accessibility: "Family room � Quiet entrance",
    liveDefault: "Regional watch and host support",
    status: "Healthy",
  },
  {
    id: "campus_3",
    name: "London Prayer House",
    region: "United Kingdom",
    timezone: "Europe/London",
    serviceMode: "Online-first",
    attendanceModel: "Members first",
    accessibility: "Caption-first service routing",
    liveDefault: "Translation and replay packaging",
    status: "Needs review",
  },
  {
    id: "campus_4",
    name: "Global Digital Campus",
    region: "Worldwide",
    timezone: "UTC",
    serviceMode: "Online-first",
    attendanceModel: "Open access",
    accessibility: "Global virtual onboarding",
    liveDefault: "Digital-only distribution layer",
    status: "Healthy",
  },
];

const initialIntegrations: Integration[] = [
  {
    id: "int_1",
    name: "Payments & Giving",
    category: "Payments",
    status: "Connected",
    owner: "Finance Team",
    detail: "Wallet, payouts, recurring support, donor receipts",
    health: "Healthy",
  },
  {
    id: "int_2",
    name: "Email Sender",
    category: "Messaging",
    status: "Connected",
    owner: "Audience Team",
    detail: "Notification journeys and replay follow-up campaigns",
    health: "98% deliverability",
  },
  {
    id: "int_3",
    name: "SMS / Messaging Line",
    category: "Messaging",
    status: "Needs attention",
    owner: "Audience Team",
    detail: "Sender registration needs refresh before high-volume sends",
    health: "Quiet-hour rule active",
  },
  {
    id: "int_4",
    name: "Calendar & Scheduling",
    category: "Scheduling",
    status: "Connected",
    owner: "Operations",
    detail: "Live Schedule sync, event timing, team assignments",
    health: "2 syncs delayed",
  },
  {
    id: "int_5",
    name: "Streaming Destinations",
    category: "Streaming",
    status: "Connected",
    owner: "Production",
    detail: "YouTube, Facebook, in-app stream routing presets",
    health: "Preset health good",
  },
  {
    id: "int_6",
    name: "Maps & Campus Finder",
    category: "Maps",
    status: "Not connected",
    owner: "Workspace Owner",
    detail: "Venue directions, proximity search, region overlays",
    health: "Not configured",
  },
  {
    id: "int_7",
    name: "Analytics Warehouse",
    category: "Analytics",
    status: "Connected",
    owner: "Leadership",
    detail: "Content, giving, Beacon, and attendance rollups",
    health: "24h export active",
  },
  {
    id: "int_8",
    name: "Moderation & Safety Hooks",
    category: "Analytics",
    status: "Needs attention",
    owner: "Trust Team",
    detail: "Review escalation automation needs QA before expansion",
    health: "Policy update pending",
  },
];

const localePacks: LocalePack[] = [
  { code: "en-UG", label: "English (Uganda)", status: "Published", direction: "LTR", launchSurface: "Default workspace" },
  { code: "sw-KE", label: "Swahili (Kenya)", status: "Published", direction: "LTR", launchSurface: "Campus + notices" },
  { code: "fr-FR", label: "French", status: "Draft", direction: "LTR", launchSurface: "Replays + alerts" },
  { code: "ar", label: "Arabic", status: "Needs review", direction: "RTL", launchSurface: "Prayer + studies" },
  { code: "yo-NG", label: "Yoruba", status: "Published", direction: "LTR", launchSurface: "Community + teachings" },
  { code: "zu-ZA", label: "Zulu", status: "Draft", direction: "LTR", launchSurface: "Events + outreach" },
];

const connectableIntegrations = [
  { id: "ci_1", name: "Maps Provider", hint: "Campus directions, nearby discovery, service regions", category: "Maps" },
  { id: "ci_2", name: "Calendar Provider", hint: "Two-way schedule sync and ICS handoff", category: "Scheduling" },
  { id: "ci_3", name: "Messaging Line", hint: "SMS and consent-aware reminder sends", category: "Messaging" },
  { id: "ci_4", name: "Email Domain", hint: "Premium sender reputation and branded receipts", category: "Messaging" },
  { id: "ci_5", name: "Analytics Sink", hint: "Warehouse export, BI, leadership dashboards", category: "Analytics" },
  { id: "ci_6", name: "Streaming Destination", hint: "External live routing and credential health", category: "Streaming" },
];

export default function WorkspaceSettingsPage() {
  const { user, workspace } = useAuth();
  const workspaceBrand = workspace?.brand?.trim() || "FaithHub";
  const workspaceCampus = workspace?.campus?.trim() || "Kampala Central";
  const workspaceHandleSeed = useMemo(
    () => `@${workspaceBrand.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 20) || "faithhub"}`,
    [workspaceBrand],
  );
  const [tab, setTab] = useState<SettingsTab>("identity");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [campuses, setCampuses] = useState<Campus[]>(initialCampuses);
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);

  const [workspaceName, setWorkspaceName] = useState(workspaceBrand);
  const [workspaceHandle, setWorkspaceHandle] = useState(workspaceHandleSeed);
  const [missionLine, setMissionLine] = useState(`Helping people encounter God, grow in truth, and stay connected across ${workspaceCampus}.`);
  const [publicBio, setPublicBio] = useState(`${workspaceBrand} is a faith community with strong live ministry, generous giving journeys, and healthy audience care defaults.`);
  const [brandVoice, setBrandVoice] = useState("Warm, trustworthy, hopeful, scripture-rooted, and globally welcoming.");
  const [defaultLanguage, setDefaultLanguage] = useState("English (Uganda)");
  const [secondaryLanguage, setSecondaryLanguage] = useState("Swahili (Kenya)");
  const [timezoneLabel, setTimezoneLabel] = useState("Africa/Kampala");
  const [currencyLabel, setCurrencyLabel] = useState("UGX");
  const [campusSwitcherPublic, setCampusSwitcherPublic] = useState(true);
  const [multiCampusRouting, setMultiCampusRouting] = useState(true);
  const [childSafeDefaults, setChildSafeDefaults] = useState(true);
  const [quietHours, setQuietHours] = useState(true);
  const [approvalRouting, setApprovalRouting] = useState(true);
  const [defaultLiveReminders, setDefaultLiveReminders] = useState(true);
  const [localizationFallback, setLocalizationFallback] = useState(true);
  const [defaultNoticeboardVisible, setDefaultNoticeboardVisible] = useState(true);
  const [connectedStreamingPriority, setConnectedStreamingPriority] = useState(true);
  const [changesQueued, setChangesQueued] = useState(4);
  const [lastSavedLabel, setLastSavedLabel] = useState("Today � 10:14 AM");
  const [toast, setToast] = useState<string | null>(null);

  const [campusModalOpen, setCampusModalOpen] = useState(false);
  const [integrationModalOpen, setIntegrationModalOpen] = useState(false);

  const [newCampusName, setNewCampusName] = useState("Westlands Campus");
  const [newCampusRegion, setNewCampusRegion] = useState("Kenya � East Africa");
  const [newCampusTimezone, setNewCampusTimezone] = useState("Africa/Nairobi");
  const [newCampusMode, setNewCampusMode] = useState<Campus["serviceMode"]>("Hybrid");
  const [newCampusAccess, setNewCampusAccess] = useState("Family entry � Caption screens");
  const [selectedConnectId, setSelectedConnectId] = useState("ci_1");

  useEffect(() => {
    setWorkspaceName(workspaceBrand);
  }, [workspaceBrand]);

  useEffect(() => {
    setWorkspaceHandle(workspaceHandleSeed);
  }, [workspaceHandleSeed]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const stats = useMemo(() => {
    const connectedCount = integrations.filter((integration) => integration.status === "Connected").length;
    const attentionCount = integrations.filter((integration) => integration.status === "Needs attention").length;
    const languagesPublished = localePacks.filter((locale) => locale.status === "Published").length;
    return {
      campuses: campuses.length,
      connectedIntegrations: connectedCount,
      integrationsNeedingAttention: attentionCount,
      localeCount: localePacks.length,
      localePublished: languagesPublished,
      healthScore: "96%",
      pendingChanges: `${changesQueued}`,
    };
  }, [campuses.length, integrations, changesQueued]);

  const changeQueue = useMemo(
    () => [
      {
        title: "Quiet hours",
        detail: quietHours ? "Enabled across audience notifications and prayer follow-up." : "Disabled for admin review.",
        tone: quietHours ? "good" : "warn",
      },
      {
        title: "Campus switcher visibility",
        detail: campusSwitcherPublic ? "Visible on public workspace surfaces." : "Restricted to signed-in members.",
        tone: campusSwitcherPublic ? "good" : "warn",
      },
      {
        title: "Localization fallback",
        detail: localizationFallback ? "Fallback language and captions remain active." : "Localized gaps may surface.",
        tone: localizationFallback ? "good" : "danger",
      },
      {
        title: "Streaming destination defaults",
        detail: connectedStreamingPriority ? "In-app stream remains source of truth with external routing backup." : "Custom route overrides active.",
        tone: connectedStreamingPriority ? "good" : "warn",
      },
    ],
    [quietHours, campusSwitcherPublic, localizationFallback, connectedStreamingPriority],
  );

  const connectedBadges = integrations
    .filter((integration) => integration.status === "Connected")
    .slice(0, 4);

  const handleSaveChanges = () => {
    setChangesQueued(0);
    setLastSavedLabel("Just now");
    setToast("Workspace defaults saved successfully.");
  };

  const handleAddCampus = () => {
    const nextCampus: Campus = {
      id: `campus_${Date.now()}`,
      name: newCampusName.trim() || "New Campus",
      region: newCampusRegion.trim() || "New region",
      timezone: newCampusTimezone.trim() || "UTC",
      serviceMode: newCampusMode,
      attendanceModel: "Open access",
      accessibility: newCampusAccess.trim() || "Accessibility details pending",
      liveDefault: "Regional live routing",
      status: "Healthy",
    };
    setCampuses((current) => [nextCampus, ...current]);
    setCampusModalOpen(false);
    setChangesQueued((value) => value + 1);
    setToast("Campus added to workspace settings.");
  };

  const handleConnectIntegration = () => {
    const selected = connectableIntegrations.find((item) => item.id === selectedConnectId);
    if (!selected) return;

    const alreadyExists = integrations.find((integration) => integration.name === selected.name);
    if (alreadyExists) {
      setIntegrations((current) =>
        current.map((integration) =>
          integration.name === selected.name
            ? { ...integration, status: "Connected", health: "Reconnected just now" }
            : integration,
        ),
      );
    } else {
      setIntegrations((current) => [
        {
          id: `int_${Date.now()}`,
          name: selected.name,
          category: selected.category as Integration["category"],
          status: "Connected",
          owner: "Workspace Owner",
          detail: selected.hint,
          health: "Connected just now",
        },
        ...current,
      ]);
    }
    setIntegrationModalOpen(false);
    setChangesQueued((value) => value + 1);
    setToast("Integration connected to workspace.");
  };

  const renderTabContent = () => {
    if (tab === "identity") {
      return (
        <div className="space-y-4">
          <Card
            title="Workspace identity"
            subtitle="Institution-wide naming, public promise, and workspace signature."
            right={<Pill tone="good"><BadgeCheck className="h-3.5 w-3.5" /> Verified workspace</Pill>}
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-faith-slate">Institution name</div>
                <input
                  value={workspaceName}
                  onChange={(e) => {
                    setWorkspaceName(e.target.value);
                    setChangesQueued((value) => Math.max(1, value));
                  }}
                  className="mt-1 w-full rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-950 px-3 py-2 text-[12px] font-semibold text-faith-ink dark:text-slate-100 outline-none"
                />
              </div>
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-faith-slate">Workspace handle</div>
                <input
                  value={workspaceHandle}
                  onChange={(e) => {
                    setWorkspaceHandle(e.target.value);
                    setChangesQueued((value) => Math.max(1, value));
                  }}
                  className="mt-1 w-full rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-950 px-3 py-2 text-[12px] font-semibold text-faith-ink dark:text-slate-100 outline-none"
                />
              </div>
              <div className="lg:col-span-2">
                <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-faith-slate">Mission line</div>
                <textarea
                  rows={3}
                  value={missionLine}
                  onChange={(e) => {
                    setMissionLine(e.target.value);
                    setChangesQueued((value) => Math.max(1, value));
                  }}
                  className="mt-1 w-full rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-950 px-3 py-2 text-[12px] text-faith-ink dark:text-slate-100 outline-none"
                />
              </div>
              <div className="lg:col-span-2">
                <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-faith-slate">Public bio</div>
                <textarea
                  rows={4}
                  value={publicBio}
                  onChange={(e) => {
                    setPublicBio(e.target.value);
                    setChangesQueued((value) => Math.max(1, value));
                  }}
                  className="mt-1 w-full rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-950 px-3 py-2 text-[12px] text-faith-ink dark:text-slate-100 outline-none"
                />
              </div>
            </div>
          </Card>

          <Card
            title="Brand system"
            subtitle="Logos, cover assets, colour defaults, typography confidence, and workspace tone."
            right={<Pill tone="brand"><Sparkles className="h-3.5 w-3.5" /> Premium branding</Pill>}
          >
            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Brand voice notes</div>
                    <div className="mt-1 text-[11px] text-faith-slate">Used by noticeboard, notifications, live intros, and Beacon copy suggestions.</div>
                  </div>
                  <div className="flex gap-2">
                    <span className="h-8 w-8 rounded-full border border-white/50" style={{ background: GREEN }} />
                    <span className="h-8 w-8 rounded-full border border-white/50" style={{ background: ORANGE }} />
                    <span className="h-8 w-8 rounded-full border border-white/50" style={{ background: MEDIUM }} />
                  </div>
                </div>
                <textarea
                  rows={4}
                  value={brandVoice}
                  onChange={(e) => {
                    setBrandVoice(e.target.value);
                    setChangesQueued((value) => Math.max(1, value));
                  }}
                  className="mt-4 w-full rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 text-[12px] text-faith-ink dark:text-slate-100 outline-none"
                />
              </div>

              <div className="space-y-3">
                <div className="rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-faith-slate">Brand assets</div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3">
                      <div className="h-16 rounded-xl" style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }} />
                      <div className="mt-2 text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Primary logo</div>
                      <div className="text-[11px] text-faith-slate">Approved for light and dark modes</div>
                    </div>
                    <div className="rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3">
                      <div className="h-16 rounded-xl" style={{ background: "linear-gradient(135deg, #03cd8c, #f77f00)" }} />
                      <div className="mt-2 text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Cover gradient</div>
                      <div className="text-[11px] text-faith-slate">Used on dashboard, campus cards, and public entry</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4">
                  <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Brand enforcement</div>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2">
                      <div>
                        <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Lock provider colour defaults</div>
                        <div className="text-[11px] text-faith-slate">Applies to noticeboard, live overlays, and Beacon shells.</div>
                      </div>
                      <Toggle checked={true} onChange={() => undefined} />
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2">
                      <div>
                        <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Require watermark on clips</div>
                        <div className="text-[11px] text-faith-slate">Protected replay and short-form identity by default.</div>
                      </div>
                      <Toggle checked={true} onChange={() => undefined} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    if (tab === "campuses") {
      return (
        <div className="space-y-4">
          <Card
            title="Campus network and service regions"
            subtitle="Physical, hybrid, and online-first footprints with operating defaults and accessibility notes."
            right={<Pill tone="good"><Building2 className="h-3.5 w-3.5" /> {campuses.length} campuses</Pill>}
          >
            <div className="space-y-3">
              {campuses.map((campus) => (
                <div key={campus.id} className="rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="mt-2 text-[28px] font-black leading-[1.04] tracking-[-0.03em] text-faith-ink dark:text-slate-100 sm:text-[34px] lg:text-[40px]">{campus.name}</div>
                      <div className="mt-1.5 text-[14px] leading-6 text-faith-slate">{campus.region} � {campus.timezone}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Pill tone={campus.status === "Healthy" ? "good" : "warn"}>{campus.status}</Pill>
                      <Pill>{campus.serviceMode}</Pill>
                      <Pill>{campus.attendanceModel}</Pill>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 lg:grid-cols-3">
                    <div className="rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3">
                      <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">Accessibility</div>
                      <div className="mt-1 text-[12px] font-semibold text-faith-ink dark:text-slate-100">{campus.accessibility}</div>
                    </div>
                    <div className="rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3">
                      <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">Live default</div>
                      <div className="mt-1 text-[12px] font-semibold text-faith-ink dark:text-slate-100">{campus.liveDefault}</div>
                    </div>
                    <div className="rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3">
                      <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">Campus controls</div>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <Pill tone="good">Publishable</Pill>
                        <Pill>{campus.timezone}</Pill>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="Campus-wide behavior"
            subtitle="Public switchers, regional blackout periods, campus-first notifications, and default service routing."
          >
            <div className="grid gap-3 xl:grid-cols-2">
              <div className="rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4 space-y-3">
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-3">
                  <div>
                    <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Public campus switcher</div>
                    <div className="text-[11px] text-faith-slate">Lets visitors switch between physical campuses and online-first hubs.</div>
                  </div>
                  <Toggle checked={campusSwitcherPublic} onChange={setCampusSwitcherPublic} />
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-3">
                  <div>
                    <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Multi-campus live routing</div>
                    <div className="text-[11px] text-faith-slate">Shares operational defaults across every linked campus and watch location.</div>
                  </div>
                  <Toggle checked={multiCampusRouting} onChange={setMultiCampusRouting} />
                </div>
              </div>

              <div className="rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4">
                <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Regional readiness notes</div>
                <div className="mt-3 space-y-2">
                  <div className="rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2">
                    <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">East Africa window</div>
                    <div className="text-[11px] text-faith-slate">Default reminder window: 06:00�21:30 local time across Kampala and Nairobi.</div>
                  </div>
                  <div className="rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2">
                    <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">London regional override</div>
                    <div className="text-[11px] text-faith-slate">Caption-first defaults remain active for translated replays and prayer re-broadcasts.</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    if (tab === "localization") {
      return (
        <div className="space-y-4">
          <Card
            title="Localization workspace"
            subtitle="Language defaults, launch coverage, translation health, and public-facing fallback behavior."
            right={<Pill tone="good"><Languages className="h-3.5 w-3.5" /> {localePacks.length} locale packs</Pill>}
          >
            <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
              <div className="rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-faith-slate">Default language</div>
                    <input
                      value={defaultLanguage}
                      onChange={(e) => {
                        setDefaultLanguage(e.target.value);
                        setChangesQueued((value) => Math.max(1, value));
                      }}
                      className="mt-1 w-full rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 text-[12px] font-semibold text-faith-ink dark:text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-faith-slate">Secondary fallback</div>
                    <input
                      value={secondaryLanguage}
                      onChange={(e) => {
                        setSecondaryLanguage(e.target.value);
                        setChangesQueued((value) => Math.max(1, value));
                      }}
                      className="mt-1 w-full rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 text-[12px] font-semibold text-faith-ink dark:text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-faith-slate">Timezone default</div>
                    <input
                      value={timezoneLabel}
                      onChange={(e) => {
                        setTimezoneLabel(e.target.value);
                        setChangesQueued((value) => Math.max(1, value));
                      }}
                      className="mt-1 w-full rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 text-[12px] font-semibold text-faith-ink dark:text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-faith-slate">Currency default</div>
                    <input
                      value={currencyLabel}
                      onChange={(e) => {
                        setCurrencyLabel(e.target.value);
                        setChangesQueued((value) => Math.max(1, value));
                      }}
                      className="mt-1 w-full rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 text-[12px] font-semibold text-faith-ink dark:text-slate-100 outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-3">
                    <div>
                      <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Localization fallback</div>
                      <div className="text-[11px] text-faith-slate">If a translation is missing, fall back to the default language with notice.</div>
                    </div>
                    <Toggle checked={localizationFallback} onChange={setLocalizationFallback} />
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-3">
                    <div>
                      <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Default live reminders</div>
                      <div className="text-[11px] text-faith-slate">Carry localized reminder templates into every new live session by default.</div>
                    </div>
                    <Toggle checked={defaultLiveReminders} onChange={setDefaultLiveReminders} />
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4">
                <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Locale pack status</div>
                <div className="mt-3 space-y-2">
                  {localePacks.map((locale) => (
                    <div key={locale.code} className="rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">{locale.label}</div>
                          <div className="mt-0.5 text-[11px] text-faith-slate">{locale.code} � {locale.direction} � {locale.launchSurface}</div>
                        </div>
                        <Pill tone={locale.status === "Published" ? "good" : locale.status === "Draft" ? "warn" : "danger"}>
                          {locale.status}
                        </Pill>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    if (tab === "integrations") {
      return (
        <div className="space-y-4">
          <Card
            title="Integration control hub"
            subtitle="Messaging, scheduling, streaming, maps, analytics, and finance connections that power the Provider workspace."
            right={<Pill tone="brand"><Link2 className="h-3.5 w-3.5" /> Integration health</Pill>}
          >
            <div className="grid gap-3 xl:grid-cols-2">
              {integrations.map((integration) => (
                <div key={integration.id} className="rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-[14px] font-black text-faith-ink dark:text-slate-100">{integration.name}</div>
                      <div className="mt-0.5 text-[11px] text-faith-slate">{integration.category} � Owner: {integration.owner}</div>
                    </div>
                    <Pill tone={integration.status === "Connected" ? "good" : integration.status === "Needs attention" ? "warn" : "danger"}>
                      {integration.status}
                    </Pill>
                  </div>
                  <div className="mt-3 rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-3">
                    <div className="text-[12px] font-semibold text-faith-ink dark:text-slate-100">{integration.detail}</div>
                    <div className="mt-1 text-[11px] text-faith-slate">{integration.health}</div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Btn tone={integration.status === "Connected" ? "neutral" : "secondary"} left={<Link2 className="h-4 w-4" />} onClick={() => {
                      setSelectedConnectId("ci_1");
                      setIntegrationModalOpen(true);
                    }}>
                      {integration.status === "Connected" ? "Manage connection" : "Reconnect"}
                    </Btn>
                    <Btn tone="neutral" left={<ExternalLink className="h-4 w-4" />}>
                      View details
                    </Btn>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Card
          title="Operational defaults"
          subtitle="Workspace-wide defaults for live creation, moderation, notifications, public surfaces, and governance."
          right={<Pill tone="good"><Workflow className="h-3.5 w-3.5" /> Active defaults</Pill>}
        >
          <div className="grid gap-3 xl:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 px-4 py-4">
                <div>
                  <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Child-safe defaults</div>
                  <div className="text-[11px] text-faith-slate">Stricter communication, moderation, and public discovery rules for child-facing ministry spaces.</div>
                </div>
                <Toggle checked={childSafeDefaults} onChange={setChildSafeDefaults} />
              </div>
              <div className="flex items-center justify-between gap-3 rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 px-4 py-4">
                <div>
                  <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Quiet hours</div>
                  <div className="text-[11px] text-faith-slate">Quiet hours flow into notifications, follow-up journeys, and care outreach.</div>
                </div>
                <Toggle checked={quietHours} onChange={setQuietHours} />
              </div>
              <div className="flex items-center justify-between gap-3 rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 px-4 py-4">
                <div>
                  <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Approval routing defaults</div>
                  <div className="text-[11px] text-faith-slate">Use approval paths for sensitive publishes, finance updates, and moderation escalations.</div>
                </div>
                <Toggle checked={approvalRouting} onChange={setApprovalRouting} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 px-4 py-4">
                <div>
                  <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Noticeboard visible by default</div>
                  <div className="text-[11px] text-faith-slate">Keep announcements and ministry updates visible on public and companion surfaces.</div>
                </div>
                <Toggle checked={defaultNoticeboardVisible} onChange={setDefaultNoticeboardVisible} />
              </div>
              <div className="flex items-center justify-between gap-3 rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 px-4 py-4">
                <div>
                  <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Streaming priority</div>
                  <div className="text-[11px] text-faith-slate">Keep the primary session as source of truth before external destination routing.</div>
                </div>
                <Toggle checked={connectedStreamingPriority} onChange={setConnectedStreamingPriority} />
              </div>
              <div className="rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4">
                <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Governance summary</div>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  <div className="rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">Finance guardrails</div>
                    <div className="mt-1 text-[12px] font-semibold text-faith-ink dark:text-slate-100">Dual review required for payout and donor setting changes.</div>
                  </div>
                  <div className="rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">Community safety</div>
                    <div className="mt-1 text-[12px] font-semibold text-faith-ink dark:text-slate-100">Forum, prayer, and testimony defaults remain moderation-aware.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[var(--fh-page-bg)] dark:bg-slate-950 text-faith-ink dark:text-slate-50 transition-colors overflow-x-hidden">
      <main className="w-full p-5 md:p-6 lg:p-8 space-y-4">
        <section className="rounded-[32px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-6 transition-colors">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="min-w-0">
                <div className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-faith-slate">WORKSPACE GOVERNANCE</div>
                <div className="mt-1">
                  <ProviderPageTitle
                    icon={<Settings className="h-6 w-6" />}
                    title="Workspace Settings"
                    subtitle="Institution-wide defaults for branding, campuses, localization, workspace identity, integrations, and operational preferences."
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Pill tone="brand">4 campuses</Pill>
                  <Pill>6 locale packs</Pill>
                  <Pill tone="warn">2 integrations need attention</Pill>
                  <Pill tone="good">Child-safe defaults active</Pill>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Btn tone="primary" left={<Save className="h-4 w-4" />} onClick={handleSaveChanges}>
                Save Changes
              </Btn>
              <Btn tone="neutral" left={<Plus className="h-4 w-4" />} onClick={() => setCampusModalOpen(true)}>
                Add Campus
              </Btn>
              <Btn tone="secondary" left={<Link2 className="h-4 w-4" />} onClick={() => setIntegrationModalOpen(true)}>
                Connect Integration
              </Btn>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-4 py-3 transition-colors">
          <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="brand">PREMIUM WORKSPACE DEFAULTS</Pill>
              <span className="text-[12px] text-faith-slate">
                Brand, campus, and operations rules flow into Teachings, Live Sessions, Audience, Giving, Beacon, and community surfaces.
              </span>
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-faith-slate">
              MULTI-CAMPUS � MULTI-LANGUAGE � CONNECTED WORKSPACE
            </span>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <MetricCard label="Active campuses" value={String(stats.campuses)} hint="Campus records in service" accent="green" />
          <MetricCard label="Locale packs" value={String(stats.localeCount)} hint={`${stats.localePublished} published`} accent="green" />
          <MetricCard label="Connected integrations" value={String(stats.connectedIntegrations)} hint="Live, messaging, finance, and analytics" accent="orange" />
          <MetricCard label="Needs attention" value={String(stats.integrationsNeedingAttention)} hint="Connections or policies requiring review" accent="navy" />
          <MetricCard label="Workspace health" value={stats.healthScore} hint="Control surface confidence score" accent="orange" />
          <MetricCard label="Pending changes" value={stats.pendingChanges} hint="Unsaved or recently modified defaults" accent="gray" />
        </section>

        <section className="grid gap-4 2xl:grid-cols-[280px_minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <Card title="Settings map" subtitle="Control surfaces for identity, campuses, localization, integrations, and operations.">
              <div className="space-y-2">
                <SectionTab active={tab === "identity"} label="Workspace identity" icon={<Palette className="h-4 w-4" />} onClick={() => setTab("identity")} />
                <SectionTab active={tab === "campuses"} label="Campuses & regions" icon={<Building2 className="h-4 w-4" />} onClick={() => setTab("campuses")} />
                <SectionTab active={tab === "localization"} label="Localization" icon={<Languages className="h-4 w-4" />} onClick={() => setTab("localization")} />
                <SectionTab active={tab === "integrations"} label="Integrations" icon={<Link2 className="h-4 w-4" />} onClick={() => setTab("integrations")} />
                <SectionTab active={tab === "operations"} label="Operational defaults" icon={<ShieldCheck className="h-4 w-4" />} onClick={() => setTab("operations")} />
              </div>
            </Card>

            <Card title="Workspace health" subtitle="High-signal checks that shape the readiness of the whole Provider workspace.">
              <div className="space-y-2">
                <div className="rounded-2xl border border-faith-line dark:border-slate-700 bg-emerald-50 dark:bg-emerald-900/15 px-3 py-2">
                  <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Brand system is stable</div>
                  <div className="mt-1 text-[11px] text-faith-slate">Approved logo, cover, and EVzone-aligned defaults are active.</div>
                </div>
                <div className="rounded-2xl border border-faith-line dark:border-slate-700 bg-amber-50 dark:bg-amber-900/15 px-3 py-2">
                  <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Messaging line needs review</div>
                  <div className="mt-1 text-[11px] text-faith-slate">Reconnect the SMS line before peak reminder journeys.</div>
                </div>
                <div className="rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2">
                  <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Last saved</div>
                  <div className="mt-1 text-[11px] text-faith-slate">{lastSavedLabel}</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">{renderTabContent()}</div>

          <div className="space-y-4">
            <Card
              title="Workspace preview rail"
              subtitle="See how branding, campuses, locale defaults, and integrations shape the Provider workspace."
              right={
                <div className="inline-flex rounded-full border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-1">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("desktop")}
                    className={cx(
                      "rounded-full px-3 py-1 text-[11px] font-extrabold transition-colors",
                      previewMode === "desktop"
                        ? "text-white"
                        : "text-faith-slate",
                    )}
                    style={previewMode === "desktop" ? { background: GREEN } : undefined}
                  >
                    Desktop preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("mobile")}
                    className={cx(
                      "rounded-full px-3 py-1 text-[11px] font-extrabold transition-colors",
                      previewMode === "mobile"
                        ? "text-white"
                        : "text-faith-slate",
                    )}
                    style={previewMode === "mobile" ? { background: ORANGE } : undefined}
                  >
                    Mobile preview
                  </button>
                </div>
              }
            >
              {previewMode === "desktop" ? (
                <div className="rounded-[28px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4 space-y-4">
                  <div className="rounded-[22px] border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-faith-slate">PUBLIC WORKSPACE HEADER</div>
                        <div className="mt-1 text-[18px] font-black text-faith-ink dark:text-slate-100">{workspaceName}</div>
                        <div className="mt-1 text-[12px] text-faith-slate">{missionLine}</div>
                      </div>
                      <div className="h-10 w-10 rounded-2xl" style={{ background: "linear-gradient(135deg, #03cd8c, #f77f00)" }} />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Pill tone="good">{defaultLanguage}</Pill>
                      <Pill>{secondaryLanguage}</Pill>
                      <Pill>{timezoneLabel}</Pill>
                      {campusSwitcherPublic ? <Pill tone="good"><MapPin className="h-3.5 w-3.5" /> Campus switcher visible</Pill> : null}
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <div className="rounded-[22px] border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4">
                      <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-faith-slate">CONNECTED SURFACES</div>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between gap-2 rounded-2xl border border-faith-line dark:border-slate-700 px-3 py-2">
                          <span className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Live Sessions</span>
                          <Pill tone="good">Allow</Pill>
                        </div>
                        <div className="flex items-center justify-between gap-2 rounded-2xl border border-faith-line dark:border-slate-700 px-3 py-2">
                          <span className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Audience & Outreach</span>
                          <Pill tone={quietHours ? "good" : "warn"}>{quietHours ? "Quiet hours" : "Open send"}</Pill>
                        </div>
                        <div className="flex items-center justify-between gap-2 rounded-2xl border border-faith-line dark:border-slate-700 px-3 py-2">
                          <span className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Community surfaces</span>
                          <Pill tone={childSafeDefaults ? "good" : "warn"}>{childSafeDefaults ? "Child-safe" : "Manual"}</Pill>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4">
                      <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-faith-slate">INTEGRATION SNAPSHOT</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {connectedBadges.map((integration) => (
                          <Pill key={integration.id} tone="good">
                            {integration.name}
                          </Pill>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mx-auto w-full max-w-[290px] md:max-w-[340px] rounded-[34px] border border-faith-line dark:border-slate-800 bg-slate-900 p-3 shadow-2xl">
                  <div className="overflow-hidden rounded-[28px] bg-[var(--fh-surface-bg)] dark:bg-slate-950">
                    <div className="px-4 py-4 border-b border-faith-line dark:border-slate-800">
                      <div className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-faith-slate">MOBILE COMPANION VIEW</div>
                      <div className="mt-1 text-[16px] font-black text-faith-ink dark:text-slate-100">{workspaceName}</div>
                      <div className="mt-1 text-[11px] text-faith-slate">{workspaceHandle}</div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-900 px-3 py-3">
                        <div className="text-[11px] font-extrabold text-faith-ink dark:text-slate-100">Campus & locale</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Pill tone="good">{workspaceCampus.split(" ")[0] || "Campus"}</Pill>
                          <Pill>{defaultLanguage}</Pill>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-900 px-3 py-3">
                        <div className="text-[11px] font-extrabold text-faith-ink dark:text-slate-100">Live + Giving defaults</div>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] text-faith-slate">Reminders</span>
                            <Pill tone={defaultLiveReminders ? "good" : "warn"}>{defaultLiveReminders ? "On" : "Off"}</Pill>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] text-faith-slate">Safety</span>
                            <Pill tone={childSafeDefaults ? "good" : "warn"}>{childSafeDefaults ? "Protected" : "Manual"}</Pill>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-900 px-3 py-3">
                        <div className="text-[11px] font-extrabold text-faith-ink dark:text-slate-100">Connections</div>
                        <div className="mt-2 text-[11px] text-faith-slate">{stats.connectedIntegrations} integrations connected � {stats.integrationsNeedingAttention} need attention</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <Card title="Change queue" subtitle="What will update across the workspace once changes are saved.">
              <div className="space-y-2">
                {changeQueue.map((item) => (
                  <div key={item.title} className={cx(
                    "rounded-2xl border px-3 py-3",
                    item.tone === "good"
                      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/15"
                      : item.tone === "warn"
                        ? "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/15"
                        : "border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/15",
                  )}>
                    <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">{item.title}</div>
                    <div className="mt-1 text-[11px] text-faith-slate">{item.detail}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {toast ? (
          <div className="fixed bottom-6 left-1/2 z-[140] -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-[12px] font-bold text-white shadow-2xl dark:bg-slate-100 dark:text-faith-ink">
            {toast}
          </div>
        ) : null}
      </main>

      <Modal
        open={campusModalOpen}
        onClose={() => setCampusModalOpen(false)}
        title="Add Campus"
        subtitle="Create a new campus record with default service, timezone, and accessibility behavior."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-faith-slate">Campus name</div>
            <input
              value={newCampusName}
              onChange={(e) => setNewCampusName(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-950 px-3 py-2 text-[12px] font-semibold text-faith-ink dark:text-slate-100 outline-none"
            />
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-faith-slate">Region</div>
            <input
              value={newCampusRegion}
              onChange={(e) => setNewCampusRegion(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-950 px-3 py-2 text-[12px] font-semibold text-faith-ink dark:text-slate-100 outline-none"
            />
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-faith-slate">Timezone</div>
            <input
              value={newCampusTimezone}
              onChange={(e) => setNewCampusTimezone(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-950 px-3 py-2 text-[12px] font-semibold text-faith-ink dark:text-slate-100 outline-none"
            />
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-faith-slate">Service mode</div>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {(["Physical", "Hybrid", "Online-first"] as Campus["serviceMode"][]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setNewCampusMode(mode)}
                  className={cx(
                    "rounded-2xl border px-3 py-2 text-[12px] font-extrabold transition-colors",
                    newCampusMode === mode
                      ? "text-white"
                      : "border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 text-slate-700 dark:text-slate-300",
                  )}
                  style={newCampusMode === mode ? { background: ORANGE, borderColor: ORANGE } : undefined}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-faith-slate">Accessibility & notes</div>
            <textarea
              rows={3}
              value={newCampusAccess}
              onChange={(e) => setNewCampusAccess(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-950 px-3 py-2 text-[12px] text-faith-ink dark:text-slate-100 outline-none"
            />
          </div>
        </div>

        <div className="mt-5 rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4">
          <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Campus summary preview</div>
          <div className="mt-3 rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-3">
            <div className="text-[15px] font-black text-faith-ink dark:text-slate-100">{newCampusName || "New Campus"}</div>
            <div className="mt-1 text-[11px] text-faith-slate">{newCampusRegion || "New region"} � {newCampusTimezone || "UTC"}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Pill tone="good">{newCampusMode}</Pill>
              <Pill>{newCampusAccess || "Accessibility note pending"}</Pill>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
          <Btn tone="neutral" left={<X className="h-4 w-4" />} onClick={() => setCampusModalOpen(false)}>
            Cancel
          </Btn>
          <Btn tone="primary" left={<Plus className="h-4 w-4" />} onClick={handleAddCampus}>
            Add Campus
          </Btn>
        </div>
      </Modal>

      <Modal
        open={integrationModalOpen}
        onClose={() => setIntegrationModalOpen(false)}
        title="Connect Integration"
        subtitle="Add or refresh the systems that power scheduling, messaging, streaming, maps, analytics, and finance."
      >
        <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
          <div className="rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4">
            <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Available connections</div>
            <div className="mt-3 space-y-2">
              {connectableIntegrations.map((integration) => (
                <button
                  key={integration.id}
                  type="button"
                  onClick={() => setSelectedConnectId(integration.id)}
                  className={cx(
                    "w-full rounded-2xl border px-3 py-3 text-left transition-colors",
                    selectedConnectId === integration.id
                      ? "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20"
                      : "border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 hover:bg-[var(--fh-surface)] dark:hover:bg-slate-800",
                  )}
                >
                  <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">{integration.name}</div>
                  <div className="mt-1 text-[11px] text-faith-slate">{integration.category}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4">
            {(() => {
              const selected = connectableIntegrations.find((item) => item.id === selectedConnectId);
              if (!selected) return null;
              return (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-[18px] font-black text-faith-ink dark:text-slate-100">{selected.name}</div>
                      <div className="mt-1 text-[12px] text-faith-slate">{selected.hint}</div>
                    </div>
                    <Pill tone="brand">{selected.category}</Pill>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface)] dark:bg-slate-950 px-3 py-3">
                      <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">Connection flow</div>
                      <div className="mt-1 text-[12px] font-semibold text-faith-ink dark:text-slate-100">Secure workspace-to-provider handoff with consent-aware defaults.</div>
                    </div>
                    <div className="rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface)] dark:bg-slate-950 px-3 py-3">
                      <div className="text-[10px] uppercase tracking-[0.08em] text-faith-slate">Governance</div>
                      <div className="mt-1 text-[12px] font-semibold text-faith-ink dark:text-slate-100">Audit-ready connection history and role-aware refresh rights.</div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4">
                    <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">What will happen after connect</div>
                    <div className="mt-3 space-y-2">
                      <div className="rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-3">
                        <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Connection becomes visible in workspace settings</div>
                        <div className="mt-1 text-[11px] text-faith-slate">The integration will appear in the control hub with status, owner, and health signals.</div>
                      </div>
                      <div className="rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-3">
                        <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-100">Defaults propagate to Provider workflows</div>
                        <div className="mt-1 text-[11px] text-faith-slate">Live Sessions, events, audience journeys, and giving surfaces can use this integration immediately.</div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
          <Btn tone="neutral" left={<X className="h-4 w-4" />} onClick={() => setIntegrationModalOpen(false)}>
            Cancel
          </Btn>
          <Btn tone="secondary" left={<Link2 className="h-4 w-4" />} onClick={handleConnectIntegration}>
            Connect Integration
          </Btn>
        </div>
      </Modal>
    </div>
  );
}










