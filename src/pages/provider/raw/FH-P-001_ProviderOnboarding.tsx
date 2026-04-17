// @ts-nocheck

"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Bell,
  BookOpen,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Eye,
  Globe2,
  Languages,
  LayoutGrid,
  Link2,
  Lock,
  Mail,
  MapPin,
  Megaphone,
  MessageSquare,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Upload,
  Users,
  Wallet,
  Wand2,
} from "lucide-react";
import { handleRawPlaceholderAction } from "./placeholderActions";

/**
 * FaithHub - FH-P-001 Provider Onboarding
 * ---------------------------------------
 * Premium provider onboarding surface for institutions, ministries,
 * faith creators, and multi-campus organizations.
 *
 * Design goals
 * - Keep the same creator-style premium grammar used across the rest of the
 *   generated FaithHub provider pages: bold header, left step rail,
 *   rich central workspace, and persistent preview panel.
 * - Use EVzone Green as the primary colour and Orange as the secondary accent.
 * - Cover the complete onboarding scope:
 *   institution identity, brand setup, campus model, team roles,
 *   content preferences, giving readiness, channels, and verification.
 * - Include a true preview area so the provider can see how their public
 *   institution profile and provider workspace will feel before launch.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#16244c";

const PROVIDER_PROFILES = [
  {
    id: "church",
    label: "Church",
    hint: "Weekly worship, sermons, discipleship, giving, and campus rhythm.",
  },
  {
    id: "ministry",
    label: "Ministry",
    hint: "Mission-led outreach, teaching, events, and donation journeys.",
  },
  {
    id: "events-led",
    label: "Events-led",
    hint: "Conferences, retreats, outreach days, classes, and registrations.",
  },
  {
    id: "digital-first",
    label: "Digital-first",
    hint: "Online teaching brand, live-first moments, clips, and Beacon growth.",
  },
] as const;

const STEP_ORDER = [
  { key: "identity", label: "Institution identity" },
  { key: "brand", label: "Brand setup" },
  { key: "campuses", label: "Locations & campuses" },
  { key: "team", label: "Team & permissions" },
  { key: "model", label: "Content model" },
  { key: "giving", label: "Giving & payouts" },
  { key: "channels", label: "Channels & consent" },
  { key: "verification", label: "Verification" },
] as const;

const TYPOGRAPHY_PRESETS = [
  "Grace Serif",
  "Modern Sans",
  "Classic Ministry",
  "Broadcast Clean",
];

const LIVE_LAYOUT_PRESETS = [
  "Cathedral broadcast",
  "Community livestream",
  "Teaching studio",
  "Conference stage",
];

const BEACON_LAYOUT_PRESETS = [
  "Announcement card",
  "Replay booster",
  "Giving spotlight",
  "Event launch card",
];

const CAMPUS_TIMEZONES = [
  "Africa/Kampala",
  "Africa/Nairobi",
  "Europe/London",
  "America/New_York",
  "UTC",
];

const CONTENT_MODES = [
  "Series",
  "Standalone teachings",
  "Live Sessions",
  "Events",
  "Giving campaigns",
  "Beacon campaigns",
];

const DASHBOARD_PRESETS = [
  "Mixed model workspace",
  "Live-first production",
  "Series-led teaching",
  "Events-led operations",
  "Giving + outreach focus",
];

const APPROVAL_PRESETS = [
  "Owner -> Admin -> Publish",
  "Pastoral review -> Editor sign-off",
  "Owner + Finance check",
  "Multi-campus approval chain",
];

const FUND_OPTIONS = [
  "General Giving",
  "Missions & Outreach",
  "Building & Expansion",
  "Children's Ministry",
  "Disaster Relief",
];

const CHANNEL_LIBRARY = [
  { id: "email", label: "Email", kind: "Owned" },
  { id: "sms", label: "SMS", kind: "Owned" },
  { id: "push", label: "Push", kind: "In-app" },
  { id: "whatsapp", label: "WhatsApp", kind: "Messaging" },
  { id: "telegram", label: "Telegram", kind: "Messaging" },
  { id: "rcs", label: "RCS", kind: "Messaging" },
];

const COVER_LIBRARY = [
  {
    id: "cover-1",
    label: "Cathedral Light",
    url: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "cover-2",
    label: "Prayer Circle",
    url: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "cover-3",
    label: "Worship Stage",
    url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80",
  },
];

type StepKey = (typeof STEP_ORDER)[number]["key"];
type ProviderProfile = (typeof PROVIDER_PROFILES)[number]["id"];
type ChannelId = (typeof CHANNEL_LIBRARY)[number]["id"];
type StepStatus = "not_started" | "in_progress" | "blocked" | "complete";
type PreviewViewport = "mobile" | "tablet" | "desktop";

type Campus = {
  id: string;
  name: string;
  city: string;
  region: string;
  timezone: string;
  accessibility: string;
  onlineFirst: boolean;
};

type TeamRole =
  | "Owner"
  | "Admin"
  | "Editor"
  | "Producer"
  | "Moderator"
  | "Finance"
  | "Marketer";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: "Invited" | "Accepted" | "Needs review";
};

type ChannelState = {
  connected: boolean;
  senderLabel: string;
  consentDefault: boolean;
  quietHours: boolean;
  needsVerification: boolean;
};

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

function createCampus(id: string, overrides?: Partial<Campus>): Campus {
  return {
    id,
    name: "New campus",
    city: "Kampala",
    region: "Central Region",
    timezone: "Africa/Kampala",
    accessibility: "Wheelchair access - family seating - livestream crew point",
    onlineFirst: false,
    ...overrides,
  };
}

function createTeamMember(id: string, role: TeamRole, name: string, email: string): TeamMember {
  return {
    id,
    name,
    email,
    role,
    status: "Accepted",
  };
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
  const cls =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
      : tone === "warn"
        ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
        : tone === "danger"
          ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-300"
          : tone === "brand"
            ? "border-transparent text-white"
            : tone === "navy"
              ? "border-transparent bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
              : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold",
        cls,
      )}
      style={tone === "brand" ? { background: EV_GREEN } : undefined}
    >
      {icon}
      {text}
    </span>
  );
}

function SoftButton({
  children,
  onClick,
  disabled,
  title,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-[12px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
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
  disabled,
  title,
  secondary,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  secondary?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl border border-transparent px-4 py-2 text-[12px] font-semibold text-white transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
        disabled ? "cursor-not-allowed opacity-60" : "hover:opacity-95",
      )}
      style={{ background: secondary ? EV_ORANGE : EV_GREEN }}
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
    <div className="rounded-3xl border border-slate-200 bg-white p-4 transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[14px] font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </div>
          {subtitle ? (
            <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
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

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
      {children}
    </div>
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
      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 outline-none transition-colors focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-emerald-900/40"
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
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 outline-none transition-colors focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-emerald-900/40"
    />
  );
}

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cx(
        "w-full rounded-3xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
        checked
          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
          : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
            {label}
          </div>
          {hint ? (
            <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              {hint}
            </div>
          ) : null}
        </div>
        <span
          className={cx(
            "mt-0.5 flex h-6 w-10 shrink-0 items-center rounded-full border px-1 transition-colors",
            checked
              ? "justify-end border-emerald-500 bg-emerald-500"
              : "justify-start border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800",
          )}
        >
          <span className="h-4 w-4 rounded-full bg-white shadow" />
        </span>
      </div>
    </button>
  );
}

function ProgressBar({
  value,
  color = EV_GREEN,
}: {
  value: number;
  color?: string;
}) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div
        className="h-full rounded-full"
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          background: color,
        }}
      />
    </div>
  );
}

function StepRail({
  step,
  setStep,
  sectionScores,
  stepStatuses,
  blockersByStep,
  overallProgress,
  blockers,
}: {
  step: StepKey;
  setStep: (s: StepKey) => void;
  sectionScores: Record<StepKey, number>;
  stepStatuses: Record<StepKey, StepStatus>;
  blockersByStep: Record<StepKey, string[]>;
  overallProgress: number;
  blockers: string[];
}) {
  return (
    <nav
      aria-label="Onboarding steps"
      className="rounded-3xl border border-slate-200 bg-white p-4 transition-colors dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-900/20">
        <div className="text-[18px] font-bold text-slate-900 dark:text-slate-100">
          Provider Onboarding
        </div>
        <div className="mt-1 text-[12px] text-slate-600 dark:text-slate-400">
          Guided setup for identity, brand, roles, giving, channels, and launch readiness.
        </div>
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
            <span>{overallProgress}% ready</span>
            <span>{blockers.length} blocker{blockers.length === 1 ? "" : "s"}</span>
          </div>
          <ProgressBar value={overallProgress} color={EV_GREEN} />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {STEP_ORDER.map((item) => {
          const score = Math.round(sectionScores[item.key] * 100);
          const isActive = step === item.key;
          const status = stepStatuses[item.key];
          const firstBlocker = blockersByStep[item.key][0];
          const statusLabel =
            status === "complete"
              ? "Done"
              : status === "blocked"
                ? "Blocked"
                : status === "in_progress"
                  ? "In progress"
                  : "Not started";
          return (
            <button
              key={item.key}
              type="button"
              aria-current={isActive ? "step" : undefined}
              onClick={() => setStep(item.key)}
              className={cx(
                "w-full rounded-2xl border px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
                isActive
                  ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                  : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                    {item.label}
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {statusLabel}
                  </div>
                  {firstBlocker ? (
                    <div className="mt-1 truncate text-[10px] font-medium text-orange-700 dark:text-orange-300">
                      {firstBlocker}
                    </div>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cx(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold",
                      status === "complete"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : status === "blocked"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
                    )}
                  >
                    {status === "complete" ? "Done" : `${score}%`}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-3xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-900/40 dark:bg-orange-900/20">
        <div className="flex items-start gap-2">
          <Sparkles className="mt-0.5 h-4 w-4 text-orange-600 dark:text-orange-300" />
          <div>
            <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
              Concierge readiness
            </div>
            <div className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
              The page explains exactly what is still blocking verification, payout readiness, and safe launch.
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function PhonePreview({
  institutionName,
  handle,
  faithFamily,
  tradition,
  mission,
  coverUrl,
  logoLetter,
  campuses,
  givingVisible,
  liveEnabled,
  viewport,
  launchState = "Draft",
}: {
  institutionName: string;
  handle: string;
  faithFamily: string;
  tradition: string;
  mission: string;
  coverUrl: string;
  logoLetter: string;
  campuses: Campus[];
  givingVisible: boolean;
  liveEnabled: boolean;
  viewport: PreviewViewport;
  launchState?: string;
}) {
  const viewportMaxWidth =
    viewport === "desktop"
      ? "max-w-[520px]"
      : viewport === "tablet"
        ? "max-w-[440px]"
        : "max-w-[360px]";

  return (
    <div className={`mx-auto w-full ${viewportMaxWidth}`}>
      <div className="rounded-[34px] bg-slate-950 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.28)]">
        <div className="overflow-hidden rounded-[28px] bg-white dark:bg-slate-900">
          <div className="relative">
            <img
              src={coverUrl}
              alt="Cover preview"
              className="h-40 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
            <div
              className="absolute left-4 top-4 grid h-12 w-12 place-items-center rounded-2xl text-xl font-black text-white shadow-lg"
              style={{ background: EV_GREEN }}
            >
              {logoLetter}
            </div>
            <div className="absolute left-4 right-4 bottom-4">
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/80">
                Public provider preview
              </div>
              <div className="mt-1 text-[22px] font-black leading-tight text-white">
                {institutionName || "Your institution"}
              </div>
              <div className="mt-1 text-[12px] font-semibold text-white/80">
                {handle || "@provider"} - {faithFamily || "Faith family"} - {tradition || "Tradition"}
              </div>
            </div>
          </div>

          <div className="space-y-3 p-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
              <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                Mission
              </div>
              <div className="mt-1 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">
                {mission || "Add your mission statement to show the heart of your institution."}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  Campuses
                </div>
                <div className="mt-1 text-[18px] font-black text-slate-900 dark:text-slate-100">
                  {campuses.length}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  Launch state
                </div>
                <div className="mt-1 text-[18px] font-black text-slate-900 dark:text-slate-100">
                  {launchState}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                  Workspace defaults
                </div>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  Provider
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-xl bg-slate-50 px-2 py-2 text-slate-700 dark:bg-slate-950 dark:text-slate-300">
                  {liveEnabled ? "Live Sessions ready" : "Live Sessions pending"}
                </div>
                <div className="rounded-xl bg-slate-50 px-2 py-2 text-slate-700 dark:bg-slate-950 dark:text-slate-300">
                  {givingVisible ? "Giving visible" : "Giving hidden"}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-2xl px-3 py-2 text-[12px] font-bold text-white"
                style={{ background: EV_GREEN }}
               onClick={handleRawPlaceholderAction("open_live_dashboard")}>
                Preview live page
              </button>
              <button
                type="button"
                className="flex-1 rounded-2xl px-3 py-2 text-[12px] font-bold text-white"
                style={{ background: EV_ORANGE }}
               onClick={handleRawPlaceholderAction("open_donations_funds")}>
                View giving
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProviderOnboardingPage() {
  const [step, setStep] = useState<StepKey>("identity");
  const [providerProfile, setProviderProfile] = useState<ProviderProfile>("church");

  const [institutionName, setInstitutionName] = useState("Kampala Hope Cathedral");
  const [handle, setHandle] = useState("@kampalahope");
  const [faithFamily, setFaithFamily] = useState("Christianity");
  const [tradition, setTradition] = useState("Pentecostal");
  const [mission, setMission] = useState(
    "Raise disciples, serve families, and broadcast hope across Kampala, campuses, and online spaces.",
  );
  const [publicBio, setPublicBio] = useState(
    "A multi-campus faith institution blending weekly worship, structured teachings, outreach moments, and premium live ministry.",
  );
  const [leaderName, setLeaderName] = useState("Pastor Miriam N.");
  const [contactEmail, setContactEmail] = useState("hello@kampalahope.org");
  const [contactPhone, setContactPhone] = useState("+256 700 200 300");

  const [logoLetter, setLogoLetter] = useState("KH");
  const [coverId, setCoverId] = useState("cover-1");
  const [typographyPreset, setTypographyPreset] = useState("Grace Serif");
  const [brandVoice, setBrandVoice] = useState(
    "Warm, scripture-led, welcoming, and hope-filled with a premium broadcast tone.",
  );
  const [liveLayoutPreset, setLiveLayoutPreset] = useState("Cathedral broadcast");
  const [beaconLayoutPreset, setBeaconLayoutPreset] = useState("Announcement card");
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);

  const [multiCampus, setMultiCampus] = useState(true);
  const [multiBrand, setMultiBrand] = useState(false);
  const [childFacingMinistry, setChildFacingMinistry] = useState(true);
  const [campuses, setCampuses] = useState<Campus[]>([
    createCampus("campus-1", {
      name: "Central Campus",
      city: "Kampala",
      region: "Central Uganda",
      accessibility: "Wheelchair access - family room - hearing loop",
    }),
    createCampus("campus-2", {
      name: "Online Studio",
      city: "Remote",
      region: "Global stream footprint",
      onlineFirst: true,
      accessibility: "Captions enabled - translation-ready",
    }),
  ]);

  const [team, setTeam] = useState<TeamMember[]>([
    createTeamMember("tm-1", "Owner", "Pastor Miriam N.", "miriam@kampalahope.org"),
    createTeamMember("tm-2", "Admin", "Claire S.", "claire@kampalahope.org"),
    createTeamMember("tm-3", "Producer", "Daniel T.", "daniel@kampalahope.org"),
    createTeamMember("tm-4", "Moderator", "Tobi E.", "tobi@kampalahope.org"),
    createTeamMember("tm-5", "Finance", "Sarah K.", "finance@kampalahope.org"),
    createTeamMember("tm-6", "Marketer", "Ada L.", "ada@kampalahope.org"),
  ]);
  const [approvalPreset, setApprovalPreset] = useState(APPROVAL_PRESETS[0]);

  const [contentModes, setContentModes] = useState<string[]>([
    "Series",
    "Standalone teachings",
    "Live Sessions",
    "Events",
    "Giving campaigns",
  ]);
  const [dashboardPreset, setDashboardPreset] = useState("Mixed model workspace");
  const [defaultLocale, setDefaultLocale] = useState("English - Africa/Kampala");
  const [localizedVariant, setLocalizedVariant] = useState(true);

  const [payoutReady, setPayoutReady] = useState(false);
  const [receiptName, setReceiptName] = useState("Kampala Hope Cathedral");
  const [defaultFund, setDefaultFund] = useState("General Giving");
  const [donationButtonsVisible, setDonationButtonsVisible] = useState(true);
  const [taxComplianceNote, setTaxComplianceNote] = useState(
    "Receipt footer and accountability copy still need finance sign-off.",
  );

  const [channels, setChannels] = useState<Record<ChannelId, ChannelState>>({
    email: {
      connected: true,
      senderLabel: "hello@kampalahope.org",
      consentDefault: true,
      quietHours: true,
      needsVerification: false,
    },
    sms: {
      connected: true,
      senderLabel: "KHC Live",
      consentDefault: true,
      quietHours: true,
      needsVerification: false,
    },
    push: {
      connected: true,
      senderLabel: "FaithHub app push",
      consentDefault: true,
      quietHours: false,
      needsVerification: false,
    },
    whatsapp: {
      connected: false,
      senderLabel: "Connect WhatsApp line",
      consentDefault: false,
      quietHours: true,
      needsVerification: true,
    },
    telegram: {
      connected: true,
      senderLabel: "Hope Broadcast Bot",
      consentDefault: false,
      quietHours: false,
      needsVerification: false,
    },
    rcs: {
      connected: false,
      senderLabel: "RCS sender pending",
      consentDefault: false,
      quietHours: true,
      needsVerification: true,
    },
  });

  const [legalDocUploaded, setLegalDocUploaded] = useState(true);
  const [leaderDocUploaded, setLeaderDocUploaded] = useState(true);
  const [payoutDocUploaded, setPayoutDocUploaded] = useState(false);
  const [childPolicyReady, setChildPolicyReady] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState("Autosaved moments ago");
  const [previewPaneWidth, setPreviewPaneWidth] = useState<number>(() => {
    if (typeof window === "undefined") return 360;
    const raw = window.localStorage.getItem("fh.provider.onboarding.previewWidth");
    const parsed = raw ? Number(raw) : 360;
    return Number.isFinite(parsed) ? Math.min(520, Math.max(320, parsed)) : 360;
  });
  const [editorMinWidth, setEditorMinWidth] = useState<number>(() => {
    if (typeof window === "undefined") return 700;
    const raw = window.localStorage.getItem("fh.provider.onboarding.editorMinWidth");
    const parsed = raw ? Number(raw) : 700;
    return Number.isFinite(parsed) ? Math.min(980, Math.max(620, parsed)) : 700;
  });
  const [previewViewport, setPreviewViewport] = useState<PreviewViewport>(() => {
    if (typeof window === "undefined") return "mobile";
    const raw = window.localStorage.getItem("fh.provider.onboarding.previewViewport") as PreviewViewport | null;
    return raw === "mobile" || raw === "tablet" || raw === "desktop" ? raw : "mobile";
  });
  const [compareWithPublished, setCompareWithPublished] = useState(false);

  const isPreviewSynced = lastSaved.toLowerCase().includes("autosaved") || lastSaved.toLowerCase().includes("saved");
  const currentStepIndex = STEP_ORDER.findIndex((item) => item.key === step) + 1;
  const currentStepMeta = STEP_ORDER.find((item) => item.key === step) ?? STEP_ORDER[0];

  const coverOption = useMemo(
    () => COVER_LIBRARY.find((item) => item.id === coverId) || COVER_LIBRARY[0],
    [coverId],
  );

  const publishedSnapshot = useMemo(
    () => ({
      institutionName: "Kampala Hope Cathedral",
      handle: "@kampalahope",
      faithFamily: "Christianity",
      tradition: "Pentecostal",
      mission:
        "Raise disciples, serve families, and broadcast hope across Kampala, campuses, and online spaces.",
      logoLetter: "KH",
      givingVisible: true,
      liveEnabled: true,
      launchState: "Published",
    }),
    [],
  );

  const readinessSummary = useMemo(() => {
    const identityChecks = [
      institutionName.trim(),
      handle.trim(),
      faithFamily.trim(),
      tradition.trim(),
      mission.trim(),
      publicBio.trim(),
      leaderName.trim(),
      contactEmail.trim(),
    ].filter(Boolean).length;
    const identity = identityChecks / 8;

    const brandChecks = [
      logoLetter.trim(),
      coverId,
      typographyPreset,
      brandVoice.trim(),
      liveLayoutPreset,
      beaconLayoutPreset,
      watermarkEnabled ? "yes" : "",
    ].filter(Boolean).length;
    const brand = brandChecks / 7;

    const campusFilled = campuses.filter(
      (campus) =>
        campus.name.trim() &&
        campus.city.trim() &&
        campus.region.trim() &&
        campus.timezone.trim(),
    ).length;
    const campusesScore = campuses.length ? campusFilled / campuses.length : 0;

    const roleSet = new Set(team.map((member) => member.role));
    const requiredRoles: TeamRole[] = ["Owner", "Admin", "Producer", "Moderator", "Finance", "Marketer"];
    const roleCoverage =
      requiredRoles.filter((role) => roleSet.has(role)).length / requiredRoles.length;
    const teamScore = Math.min(
      1,
      (Math.min(team.length, 6) / 6) * 0.4 + roleCoverage * 0.6,
    );

    const modelScore =
      (Math.min(contentModes.length, 5) / 5) * 0.7 +
      (dashboardPreset ? 0.15 : 0) +
      (defaultLocale ? 0.15 : 0);

    const connectedChannels = CHANNEL_LIBRARY.filter((channel) => channels[channel.id].connected).length;
    const consentReady = CHANNEL_LIBRARY.filter((channel) => channels[channel.id].consentDefault).length;
    const channelsScore =
      (connectedChannels / CHANNEL_LIBRARY.length) * 0.6 +
      (consentReady / CHANNEL_LIBRARY.length) * 0.2 +
      (localizedVariant ? 0.1 : 0) +
      (Object.values(channels).some((item) => item.quietHours) ? 0.1 : 0);

    const givingScore =
      (payoutReady ? 0.5 : 0) +
      (receiptName.trim() ? 0.15 : 0) +
      (defaultFund ? 0.15 : 0) +
      (donationButtonsVisible ? 0.1 : 0) +
      (taxComplianceNote.trim() ? 0.1 : 0);

    const verificationRequirements = [
      legalDocUploaded,
      leaderDocUploaded,
      payoutDocUploaded,
      childFacingMinistry ? childPolicyReady : true,
    ];
    const verificationScore =
      verificationRequirements.filter(Boolean).length /
      verificationRequirements.length;

    const sectionScores: Record<StepKey, number> = {
      identity,
      brand,
      campuses: campusesScore,
      team: teamScore,
      model: modelScore,
      giving: givingScore,
      channels: channelsScore,
      verification: verificationScore,
    };

    const blockersByStep: Record<StepKey, string[]> = {
      identity: [],
      brand: [],
      campuses: [],
      team: [],
      model: [],
      giving: [],
      channels: [],
      verification: [],
    };

    if (identity < 0.85) {
      blockersByStep.identity.push("Complete institution identity and public profile details.");
    }
    if (!roleSet.has("Owner") || !roleSet.has("Admin")) {
      blockersByStep.team.push("Assign at least one owner and one admin.");
    }
    if (!payoutReady || !payoutDocUploaded) {
      blockersByStep.giving.push("Finish payout setup and upload payout verification.");
      blockersByStep.verification.push("Payout verification document is still pending.");
    }
    if (connectedChannels < 3) {
      blockersByStep.channels.push("Connect at least three audience channels before launch.");
    }
    if (childFacingMinistry && !childPolicyReady) {
      blockersByStep.verification.push("Enable child-safety defaults and upload safeguarding policy.");
    }

    const blockers = Object.values(blockersByStep).flat();

    const overallProgress = Math.round(
      (Object.values(sectionScores).reduce((sum, value) => sum + value, 0) /
        Object.values(sectionScores).length) *
        100,
    );

    return { sectionScores, overallProgress, blockers, blockersByStep, connectedChannels, consentReady };
  }, [
    institutionName,
    handle,
    faithFamily,
    tradition,
    mission,
    publicBio,
    leaderName,
    contactEmail,
    logoLetter,
    coverId,
    typographyPreset,
    brandVoice,
    liveLayoutPreset,
    beaconLayoutPreset,
    watermarkEnabled,
    campuses,
    team,
    contentModes,
    dashboardPreset,
    defaultLocale,
    localizedVariant,
    channels,
    payoutReady,
    receiptName,
    defaultFund,
    donationButtonsVisible,
    taxComplianceNote,
    legalDocUploaded,
    leaderDocUploaded,
    payoutDocUploaded,
    childFacingMinistry,
    childPolicyReady,
  ]);

  const stepStatuses = useMemo<Record<StepKey, StepStatus>>(() => {
    const out = {} as Record<StepKey, StepStatus>;
    STEP_ORDER.forEach((item) => {
      const score = readinessSummary.sectionScores[item.key];
      const blockers = readinessSummary.blockersByStep[item.key];
      if (blockers.length > 0) {
        out[item.key] = "blocked";
        return;
      }
      if (score >= 0.9) {
        out[item.key] = "complete";
        return;
      }
      if (score <= 0.25) {
        out[item.key] = "not_started";
        return;
      }
      out[item.key] = "in_progress";
    });
    return out;
  }, [readinessSummary.sectionScores, readinessSummary.blockersByStep]);

  const continueStep = useMemo<StepKey>(() => {
    const blocked = STEP_ORDER.find((item) => stepStatuses[item.key] === "blocked");
    if (blocked) return blocked.key;
    const nextIncomplete = STEP_ORDER.find((item) => stepStatuses[item.key] !== "complete");
    return nextIncomplete?.key ?? step;
  }, [stepStatuses, step]);

  const continueStepMeta = useMemo(
    () => STEP_ORDER.find((item) => item.key === continueStep) ?? STEP_ORDER[0],
    [continueStep],
  );

  const quickStatusChips = useMemo(
    () => [
      {
        label: `${readinessSummary.overallProgress}% ready`,
        tone: "brand" as const,
      },
      {
        label: `${campuses.length} campus${campuses.length === 1 ? "" : "es"}`,
        tone: "navy" as const,
      },
      {
        label: `${team.length} team seats`,
        tone: "neutral" as const,
      },
      {
        label: `${readinessSummary.connectedChannels}/${CHANNEL_LIBRARY.length} channels ready`,
        tone: readinessSummary.connectedChannels >= 4 ? ("good" as const) : ("warn" as const),
      },
    ],
    [readinessSummary.overallProgress, campuses.length, team.length, readinessSummary.connectedChannels],
  );

  const stepTips = useMemo(() => {
    const profile = PROVIDER_PROFILES.find((item) => item.id === providerProfile) || PROVIDER_PROFILES[0];
    if (step === "identity") {
      return `${profile.label} onboarding path: set your public story, tradition, leadership, and primary contact with clarity.`;
    }
    if (step === "brand") {
      return "Brand assets flow into Live Sessions, Beacon, replays, overlays, and your public provider surface.";
    }
    if (step === "campuses") {
      return "Model your physical campuses, online-first footprint, time zones, and accessibility from the start.";
    }
    if (step === "team") {
      return "Invite the exact people who will own production, moderation, finance, and promotion workflows.";
    }
    if (step === "model") {
      return "Tailor the provider dashboard so quick-create rails reflect how your ministry actually works.";
    }
    if (step === "giving") {
      return "Prepare receipts, payout trust, and default giving visibility before donor journeys go live.";
    }
    if (step === "channels") {
      return "Consent and channel health power every reminder, replay journey, and Beacon destination.";
    }
    return "Verification is the final gate: upload documents, confirm safeguards, and clear every blocker before launch.";
  }, [providerProfile, step]);

  useEffect(() => {
    const signature = JSON.stringify({
      providerProfile,
      institutionName,
      handle,
      faithFamily,
      tradition,
      mission,
      coverId,
      campuses,
      team,
      contentModes,
      payoutReady,
      channels,
      legalDocUploaded,
      payoutDocUploaded,
      childPolicyReady,
    });
    if (!signature) return;
    setLastSaved("Saving changes...");
    const timer = window.setTimeout(() => {
      setLastSaved("Autosaved just now");
    }, 650);
    return () => window.clearTimeout(timer);
  }, [
    providerProfile,
    institutionName,
    handle,
    faithFamily,
    tradition,
    mission,
    coverId,
    campuses,
    team,
    contentModes,
    payoutReady,
    channels,
    legalDocUploaded,
    payoutDocUploaded,
    childPolicyReady,
  ]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        saveDraft();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("fh.provider.onboarding.previewWidth", String(previewPaneWidth));
  }, [previewPaneWidth]);

  useEffect(() => {
    window.localStorage.setItem("fh.provider.onboarding.editorMinWidth", String(editorMinWidth));
  }, [editorMinWidth]);

  useEffect(() => {
    window.localStorage.setItem("fh.provider.onboarding.previewViewport", previewViewport);
  }, [previewViewport]);

  const canSubmit =
    readinessSummary.overallProgress >= 85 &&
    readinessSummary.blockers.length === 0;

  const connectedChannelsList = CHANNEL_LIBRARY.filter((channel) => channels[channel.id].connected);

  const linkedPages = [
    { label: "Provider Dashboard", icon: <LayoutGrid className="h-4 w-4" />, tone: "navy" as const },
    { label: "Channels & Contact Manager", icon: <MessageSquare className="h-4 w-4" />, tone: "brand" as const },
    { label: "Donations & Funds", icon: <Wallet className="h-4 w-4" />, tone: "warn" as const },
  ];

  const addCampus = () => {
    setCampuses((prev) => [
      ...prev,
      createCampus(`campus-${prev.length + 1}`, {
        name: `New Campus ${prev.length + 1}`,
      }),
    ]);
    setToast("New campus row added.");
  };

  const updateCampus = (id: string, patch: Partial<Campus>) => {
    setCampuses((prev) =>
      prev.map((campus) => (campus.id === id ? { ...campus, ...patch } : campus)),
    );
  };

  const addTeamMember = () => {
    const nextRole: TeamRole =
      team.length % 2 === 0 ? "Editor" : "Moderator";
    setTeam((prev) => [
      ...prev,
      {
        id: `tm-${prev.length + 1}`,
        name: `New ${nextRole}`,
        email: `new${prev.length + 1}@kampalahope.org`,
        role: nextRole,
        status: "Invited",
      },
    ]);
    setToast("Team invite row added.");
  };

  const updateTeamMember = (id: string, patch: Partial<TeamMember>) => {
    setTeam((prev) =>
      prev.map((member) => (member.id === id ? { ...member, ...patch } : member)),
    );
  };

  const toggleContentMode = (mode: string) => {
    setContentModes((prev) =>
      prev.includes(mode) ? prev.filter((item) => item !== mode) : [...prev, mode],
    );
  };

  const toggleChannelConnected = (id: ChannelId) => {
    setChannels((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        connected: !prev[id].connected,
        needsVerification: prev[id].connected ? prev[id].needsVerification : false,
      },
    }));
  };

  const toggleChannelConsent = (id: ChannelId) => {
    setChannels((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        consentDefault: !prev[id].consentDefault,
      },
    }));
  };

  const saveDraft = () => {
    setLastSaved("Draft saved just now");
    setToast("Onboarding draft saved.");
  };

  const inviteTeam = () => {
    addTeamMember();
    setStep("team");
  };

  const submitForVerification = () => {
    if (!canSubmit) {
      setToast("Clear the remaining blockers before verification.");
      setStep("verification");
      return;
    }
    setToast("Provider profile submitted for verification.");
  };

  const renderIdentity = () => (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card
        title="Institution identity block"
        subtitle="Collect the public-facing institution profile used across the Provider side and public discovery."
      >
        <div className="grid gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {PROVIDER_PROFILES.map((profile) => {
              const active = providerProfile === profile.id;
              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => setProviderProfile(profile.id)}
                  className={cx(
                    "rounded-2xl border p-3 text-left transition-colors",
                    active
                      ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                      : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800",
                  )}
                >
                  <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                    {profile.label}
                  </div>
                  <div className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    {profile.hint}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Institution name</Label>
              <Input value={institutionName} onChange={setInstitutionName} />
            </div>
            <div>
              <Label>Public handle</Label>
              <Input value={handle} onChange={setHandle} placeholder="@yourhandle" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Faith family</Label>
              <Input value={faithFamily} onChange={setFaithFamily} placeholder="Faith family" />
            </div>
            <div>
              <Label>Denomination / tradition</Label>
              <Input value={tradition} onChange={setTradition} placeholder="Tradition" />
            </div>
          </div>

          <div>
            <Label>Mission statement</Label>
            <TextArea value={mission} onChange={setMission} rows={3} />
          </div>

          <div>
            <Label>Public bio</Label>
            <TextArea value={publicBio} onChange={setPublicBio} rows={4} />
          </div>
        </div>
      </Card>

      <Card
        title="Leadership and contact summary"
        subtitle="Set trusted public contacts and institution ownership from the start."
        right={<Pill text="Public provider card" tone="navy" icon={<Eye className="h-3.5 w-3.5" />} />}
      >
        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Leadership / primary owner</Label>
              <Input value={leaderName} onChange={setLeaderName} />
            </div>
            <div>
              <Label>Contact phone</Label>
              <Input value={contactPhone} onChange={setContactPhone} />
            </div>
          </div>
          <div>
            <Label>Primary email</Label>
            <Input value={contactEmail} onChange={setContactEmail} />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-start gap-3">
              <div
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-lg font-black text-white"
                style={{ background: EV_GREEN }}
              >
                {logoLetter}
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-bold text-slate-900 dark:text-slate-100">
                  {institutionName}
                </div>
                <div className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400">
                  {handle} - {faithFamily} - {tradition}
                </div>
                <div className="mt-2 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {mission}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {linkedPages.map((page) => (
                    <Pill key={page.label} text={page.label} tone={page.tone} icon={page.icon} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-900/40 dark:bg-orange-900/20">
            <div className="flex items-start gap-2">
              <Wand2 className="mt-0.5 h-4 w-4 text-orange-600 dark:text-orange-300" />
              <div>
                <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                  Dynamic onboarding branch
                </div>
                <div className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                  Your selected provider profile tailors role suggestions, campus defaults, content rails, and channel recommendations.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderBrand = () => (
    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <Card
        title="Brand setup workspace"
        subtitle="Set logo style, cover art, typography, colour discipline, watermark behavior, and reusable layout presets."
      >
        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {COVER_LIBRARY.map((cover) => {
              const active = cover.id === coverId;
              return (
                <button
                  key={cover.id}
                  type="button"
                  onClick={() => setCoverId(cover.id)}
                  className={cx(
                    "overflow-hidden rounded-3xl border transition-colors",
                    active
                      ? "border-emerald-200 ring-2 ring-emerald-100 dark:border-emerald-800 dark:ring-emerald-900/40"
                      : "border-slate-200 dark:border-slate-700",
                  )}
                >
                  <img src={cover.url} alt={cover.label} className="h-28 w-full object-cover" />
                  <div className="px-3 py-2 text-left">
                    <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                      {cover.label}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Logo initials / mark</Label>
              <Input value={logoLetter} onChange={setLogoLetter} placeholder="KH" />
            </div>
            <div>
              <Label>Typography preference</Label>
              <div className="mt-1 flex flex-wrap gap-2">
                {TYPOGRAPHY_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTypographyPreset(preset)}
                    className={cx(
                      "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                      typographyPreset === preset
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                        : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
                    )}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label>Brand voice notes</Label>
            <TextArea value={brandVoice} onChange={setBrandVoice} rows={4} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Live Sessions layout preset</Label>
              <div className="mt-1 flex flex-wrap gap-2">
                {LIVE_LAYOUT_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setLiveLayoutPreset(preset)}
                    className={cx(
                      "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                      liveLayoutPreset === preset
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                        : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
                    )}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Beacon layout preset</Label>
              <div className="mt-1 flex flex-wrap gap-2">
                {BEACON_LAYOUT_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setBeaconLayoutPreset(preset)}
                    className={cx(
                      "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                      beaconLayoutPreset === preset
                        ? "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
                        : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
                    )}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Toggle
            checked={watermarkEnabled}
            onChange={setWatermarkEnabled}
            label="Watermark assets enabled"
            hint="Recommended for livestream overlays, replays, lower thirds, and Beacon creatives."
          />
        </div>
      </Card>

      <Card
        title="Brand system preview"
        subtitle="This side shows how the institution will feel across live, replay, Beacon, and public discovery."
        right={<Pill text="EVzone Green primary" tone="brand" />}
      >
        <div className="grid gap-4">
          <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
            <img src={coverOption.url} alt={coverOption.label} className="h-44 w-full object-cover" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                Live Sessions
              </div>
              <div className="mt-2 text-[14px] font-bold text-slate-900 dark:text-slate-100">
                {liveLayoutPreset}
              </div>
              <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                Typography: {typographyPreset}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                Beacon
              </div>
              <div className="mt-2 text-[14px] font-bold text-slate-900 dark:text-slate-100">
                {beaconLayoutPreset}
              </div>
              <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                {watermarkEnabled ? "Watermark active" : "Watermark optional"}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-2 text-[12px] font-semibold text-slate-900 dark:text-slate-100">
              Colour discipline
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Primary", color: EV_GREEN },
                { label: "Secondary", color: EV_ORANGE },
                { label: "Medium gray", color: EV_GREY },
                { label: "Light surface", color: EV_LIGHT },
              ].map((swatch) => (
                <div key={swatch.label} className="rounded-2xl border border-slate-200 p-3 text-center dark:border-slate-800">
                  <div
                    className="mx-auto h-12 w-12 rounded-2xl border border-white/60 shadow-sm"
                    style={{ background: swatch.color }}
                  />
                  <div className="mt-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    {swatch.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderCampuses = () => (
    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <Card
        title="Location and campus setup"
        subtitle="Support one campus, many campuses, or an online-first provider model without forcing separate accounts."
        right={
          <SoftButton onClick={addCampus}>
            <Plus className="h-4 w-4" />
            Add campus
          </SoftButton>
        }
      >
        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle
              checked={multiCampus}
              onChange={setMultiCampus}
              label="Multi-campus provider"
              hint="Enable campus switching on the Provider Dashboard and schedule overlays."
            />
            <Toggle
              checked={multiBrand}
              onChange={setMultiBrand}
              label="Multi-brand support"
              hint="Use one verified Provider with sub-brand identities, campaign styles, and audience control."
            />
          </div>

          {campuses.map((campus) => (
            <div
              key={campus.id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Campus name</Label>
                  <Input
                    value={campus.name}
                    onChange={(value) => updateCampus(campus.id, { name: value })}
                  />
                </div>
                <div>
                  <Label>City / location</Label>
                  <Input
                    value={campus.city}
                    onChange={(value) => updateCampus(campus.id, { city: value })}
                  />
                </div>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Service region</Label>
                  <Input
                    value={campus.region}
                    onChange={(value) => updateCampus(campus.id, { region: value })}
                  />
                </div>
                <div>
                  <Label>Timezone</Label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {CAMPUS_TIMEZONES.map((zone) => (
                      <button
                        key={zone}
                        type="button"
                        onClick={() => updateCampus(campus.id, { timezone: zone })}
                        className={cx(
                          "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                          campus.timezone === zone
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                            : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
                        )}
                      >
                        {zone}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <Label>Accessibility notes</Label>
                <TextArea
                  value={campus.accessibility}
                  onChange={(value) => updateCampus(campus.id, { accessibility: value })}
                  rows={3}
                />
              </div>
              <div className="mt-3">
                <Toggle
                  checked={campus.onlineFirst}
                  onChange={(value) => updateCampus(campus.id, { onlineFirst: value })}
                  label="Online-first footprint"
                  hint="Use this when the campus is primarily livestream, replay, translation, or digital discipleship."
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Campus preview"
        subtitle="See how campus selection, time zones, and accessibility notes will appear in the provider workspace."
      >
        <div className="space-y-3">
          {campuses.map((campus) => (
            <div
              key={campus.id}
              className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                    {campus.name}
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {campus.city} - {campus.region}
                  </div>
                </div>
                <Pill
                  text={campus.onlineFirst ? "Online-first" : "Physical campus"}
                  tone={campus.onlineFirst ? "navy" : "good"}
                  icon={campus.onlineFirst ? <Globe2 className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill text={campus.timezone} tone="neutral" icon={<CalendarClock className="h-3.5 w-3.5" />} />
                <Pill text="Accessibility noted" tone="good" icon={<ShieldCheck className="h-3.5 w-3.5" />} />
              </div>
              <div className="mt-3 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">
                {campus.accessibility}
              </div>
            </div>
          ))}

          <div className="rounded-3xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-900/40 dark:bg-orange-900/20">
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 text-orange-600 dark:text-orange-300" />
              <div>
                <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                  Multi-campus switching
                </div>
                <div className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                  Providers can move between campuses and languages without leaving onboarding or later dashboard workflows.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderTeam = () => (
    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <Card
        title="Team and role assignment"
        subtitle="Invite owners, admins, editors, producers, moderators, finance managers, and marketers with role-aware permissions."
        right={
          <SoftButton onClick={addTeamMember}>
            <Plus className="h-4 w-4" />
            Invite member
          </SoftButton>
        }
      >
        <div className="space-y-3">
          {team.map((member) => (
            <div
              key={member.id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_160px_140px]">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={member.name}
                    onChange={(value) => updateTeamMember(member.id, { name: value })}
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {(["Owner", "Admin", "Editor", "Producer", "Moderator", "Finance", "Marketer"] as TeamRole[]).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => updateTeamMember(member.id, { role })}
                        className={cx(
                          "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                          member.role === role
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                            : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
                        )}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {(["Accepted", "Invited", "Needs review"] as TeamMember["status"][]).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => updateTeamMember(member.id, { status })}
                        className={cx(
                          "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                          member.status === status
                            ? "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
                            : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
                        )}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <Label>Email</Label>
                <Input
                  value={member.email}
                  onChange={(value) => updateTeamMember(member.id, { email: value })}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Role-aware permissions and routing"
        subtitle="Shared ownership stays clean when approval routing, production control, moderation, and finance are assigned from the beginning."
        right={<Pill text="Approval preset" tone="navy" icon={<Lock className="h-3.5 w-3.5" />} />}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {APPROVAL_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setApprovalPreset(preset)}
                className={cx(
                  "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                  approvalPreset === preset
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                    : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
                )}
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="grid gap-3">
            {[
              {
                title: "Production and live control",
                detail: "Producers, moderators, and editors can access live setup, readiness checks, and moderation tools without touching payout settings.",
                icon: <Building2 className="h-4 w-4" />,
              },
              {
                title: "Finance and giving protection",
                detail: "Finance managers own payout configuration, receipts, and donor transparency notes with clear approval routing.",
                icon: <Wallet className="h-4 w-4" />,
              },
              {
                title: "Promotion and outreach",
                detail: "Marketers manage Beacon, notifications, and campaign creative without altering institution verification records.",
                icon: <Megaphone className="h-4 w-4" />,
              },
            ].map((lane) => (
              <div
                key={lane.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                    {lane.icon}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                      {lane.title}
                    </div>
                    <div className="mt-1 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">
                      {lane.detail}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderModel = () => (
    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <Card
        title="Content model preferences"
        subtitle="Choose what the provider creates most often so dashboard rails, onboarding guidance, and quick-create actions start in the right shape."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {CONTENT_MODES.map((mode) => {
            const active = contentModes.includes(mode);
            return (
              <button
                key={mode}
                type="button"
                onClick={() => toggleContentMode(mode)}
                className={cx(
                  "rounded-3xl border p-4 text-left transition-colors",
                  active
                    ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                    : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                    {mode}
                  </div>
                  {active ? <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-300" /> : null}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <Label>Dashboard tailoring preset</Label>
            <div className="mt-1 flex flex-wrap gap-2">
              {DASHBOARD_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDashboardPreset(preset)}
                  className={cx(
                    "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                    dashboardPreset === preset
                      ? "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
                      : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
                  )}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Default locale / launch focus</Label>
            <Input value={defaultLocale} onChange={setDefaultLocale} placeholder="English - Africa/Kampala" />
            <div className="mt-3">
              <Toggle
                checked={localizedVariant}
                onChange={setLocalizedVariant}
                label="Localized variants ready from day one"
                hint="Recommended when your provider serves more than one language or region."
              />
            </div>
          </div>
        </div>
      </Card>

      <Card
        title="Quick-create preview"
        subtitle="This is the type of provider dashboard launch rail your team will see first."
        right={<Pill text={dashboardPreset} tone="warn" icon={<LayoutGrid className="h-3.5 w-3.5" />} />}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "New Live Session", detail: "Run a service, class, Q&A, fundraiser, or special event.", color: EV_GREEN },
            { title: "New Teaching", detail: "Start a standalone sermon, upload-first teaching, or structured episode.", color: EV_NAVY },
            { title: "New Campaign", detail: "Create a fund, a charity crowdfund, or an outreach moment.", color: EV_ORANGE },
            { title: "New Ad", detail: "Launch Beacon awareness, replay promotion, or a standalone campaign.", color: EV_ORANGE },
          ].map((action) => (
            <div
              key={action.title}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
            >
              <div
                className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl text-white"
                style={{ background: action.color }}
              >
                <Plus className="h-5 w-5" />
              </div>
              <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                {action.title}
              </div>
              <div className="mt-1 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">
                {action.detail}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
            Selected content mix
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {contentModes.map((mode) => (
              <Pill key={mode} text={mode} tone="good" icon={<BookOpen className="h-3.5 w-3.5" />} />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderGiving = () => (
    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <Card
        title="Giving and payout readiness"
        subtitle="Set payout trust, receipt language, default giving structures, and donor-facing visibility before public launch."
      >
        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle
              checked={payoutReady}
              onChange={setPayoutReady}
              label="Payout account configured"
              hint="Required before public donation buttons and campaign settlement can go live."
            />
            <Toggle
              checked={donationButtonsVisible}
              onChange={setDonationButtonsVisible}
              label="Donation buttons visible"
              hint="Controls whether giving prompts appear on provider pages before verification is complete."
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Receipt display name</Label>
              <Input value={receiptName} onChange={setReceiptName} />
            </div>
            <div>
              <Label>Default fund</Label>
              <div className="mt-1 flex flex-wrap gap-2">
                {FUND_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setDefaultFund(option)}
                    className={cx(
                      "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                      defaultFund === option
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                        : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label>Tax / compliance note</Label>
            <TextArea value={taxComplianceNote} onChange={setTaxComplianceNote} rows={4} />
          </div>
        </div>
      </Card>

      <Card
        title="Donor trust preview"
        subtitle="Warm ministry tone, clear receipt ownership, and financial transparency without feeling like a cold ledger."
      >
        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  Receipt identity
                </div>
                <div className="mt-1 text-[16px] font-black text-slate-900 dark:text-slate-100">
                  {receiptName}
                </div>
              </div>
              <Pill
                text={payoutReady ? "Payout ready" : "Needs payout setup"}
                tone={payoutReady ? "good" : "warn"}
                icon={<Wallet className="h-3.5 w-3.5" />}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 text-[12px] font-semibold text-slate-900 dark:text-slate-100">
              Default giving destination
            </div>
            <div className="rounded-2xl bg-slate-50 px-3 py-3 text-[13px] font-semibold text-slate-900 dark:bg-slate-950 dark:text-slate-100">
              {defaultFund}
            </div>
            <div className="mt-3 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">
              {taxComplianceNote}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderChannels = () => (
    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <Card
        title="Communication and channel readiness"
        subtitle="Connect channels, define sender identities, and set consent defaults before reminders, follow-up journeys, and Beacon handoffs begin."
      >
        <div className="grid gap-3">
          {CHANNEL_LIBRARY.map((channel) => {
            const state = channels[channel.id];
            return (
              <div
                key={channel.id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                      {channel.label}
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {channel.kind} - {state.senderLabel}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Pill
                      text={state.connected ? "Connected" : "Not connected"}
                      tone={state.connected ? "good" : "warn"}
                    />
                    {state.needsVerification ? (
                      <Pill text="Needs verification" tone="warn" icon={<AlertTriangle className="h-3.5 w-3.5" />} />
                    ) : null}
                  </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <Toggle
                    checked={state.connected}
                    onChange={() => toggleChannelConnected(channel.id)}
                    label="Connected"
                    hint="Channel authenticated and ready for provider use."
                  />
                  <Toggle
                    checked={state.consentDefault}
                    onChange={() => toggleChannelConsent(channel.id)}
                    label="Consent default"
                    hint="This channel is part of your default consent posture."
                  />
                  <Toggle
                    checked={state.quietHours}
                    onChange={(value) =>
                      setChannels((prev) => ({
                        ...prev,
                        [channel.id]: {
                          ...prev[channel.id],
                          quietHours: value,
                        },
                      }))
                    }
                    label="Quiet hours"
                    hint="Respect quiet-time rules for this channel."
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card
        title="Consent and outreach health"
        subtitle="Audience campaigns will only work when sender health, consent trails, and quiet-hour rules are credible."
      >
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                Channels ready
              </div>
              <div className="mt-1 text-[22px] font-black text-slate-900 dark:text-slate-100">
                {readinessSummary.connectedChannels}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                Consent defaults
              </div>
              <div className="mt-1 text-[22px] font-black text-slate-900 dark:text-slate-100">
                {readinessSummary.consentReady}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
              Connected launch channels
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {connectedChannelsList.map((channel) => (
                <Pill
                  key={channel.id}
                  text={channel.label}
                  tone="good"
                  icon={
                    channel.id === "email" ? (
                      <Mail className="h-3.5 w-3.5" />
                    ) : channel.id === "sms" ? (
                      <Phone className="h-3.5 w-3.5" />
                    ) : channel.id === "push" ? (
                      <Bell className="h-3.5 w-3.5" />
                    ) : (
                      <MessageSquare className="h-3.5 w-3.5" />
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderVerification = () => (
    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <Card
        title="Verification and readiness tracker"
        subtitle="Show exactly what is complete, what is missing, and what still blocks go-live or full provider verification."
        right={<Pill text={`${readinessSummary.overallProgress}% ready`} tone="brand" icon={<BadgeCheck className="h-3.5 w-3.5" />} />}
      >
        <div className="grid gap-3">
          <Toggle
            checked={legalDocUploaded}
            onChange={setLegalDocUploaded}
            label="Institution legal document uploaded"
            hint="Registration certificate, ministry paperwork, or equivalent institution proof."
          />
          <Toggle
            checked={leaderDocUploaded}
            onChange={setLeaderDocUploaded}
            label="Leadership identity confirmed"
            hint="Required for owners and high-trust provider verification."
          />
          <Toggle
            checked={payoutDocUploaded}
            onChange={setPayoutDocUploaded}
            label="Payout verification document uploaded"
            hint="Needed before funds and campaigns can settle safely."
          />
          {childFacingMinistry ? (
            <Toggle
              checked={childPolicyReady}
              onChange={setChildPolicyReady}
              label="Child-facing ministry safeguarding defaults enabled"
              hint="Adds stricter messaging, moderation, and compliance gates before launch."
            />
          ) : null}

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-3 text-[12px] font-semibold text-slate-900 dark:text-slate-100">
              Remaining blockers
            </div>
            <div className="space-y-2">
              {readinessSummary.blockers.length ? (
                readinessSummary.blockers.map((blocker) => (
                  <div
                    key={blocker}
                    className="rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-[12px] text-orange-800 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
                  >
                    {blocker}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                  All launch blockers cleared. Ready to submit for verification.
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card
        title="Go-live checklist"
        subtitle="Concierge-style launch coaching and clear unblock guidance."
      >
        <div className="space-y-3">
          {[
            {
              label: "Brand and institution profile complete",
              ok: readinessSummary.sectionScores.identity >= 0.85 && readinessSummary.sectionScores.brand >= 0.85,
            },
            {
              label: "Team ownership and moderation roles assigned",
              ok: readinessSummary.sectionScores.team >= 0.85,
            },
            {
              label: "Payout and donor trust controls configured",
              ok: readinessSummary.sectionScores.giving >= 0.85,
            },
            {
              label: "Messaging channels and consent defaults ready",
              ok: readinessSummary.sectionScores.channels >= 0.7,
            },
            {
              label: "Verification documents uploaded",
              ok: readinessSummary.sectionScores.verification >= 0.85,
            },
          ].map((item) => (
            <div
              key={item.label}
              className={cx(
                "rounded-3xl border px-4 py-3 transition-colors",
                item.ok
                  ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                  : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                  {item.label}
                </div>
                {item.ok ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-300" />
                )}
              </div>
            </div>
          ))}

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
              Verification note
            </div>
            <div className="mt-2 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">
              Once verification is approved, the main Provider Dashboard unlocks with role-aware quick create, live operations, giving visibility, audience activation, and Beacon controls.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderCenter = () => {
    if (step === "identity") return renderIdentity();
    if (step === "brand") return renderBrand();
    if (step === "campuses") return renderCampuses();
    if (step === "team") return renderTeam();
    if (step === "model") return renderModel();
    if (step === "giving") return renderGiving();
    if (step === "channels") return renderChannels();
    return renderVerification();
  };

  return (
    <div
      className="min-h-screen w-full bg-[var(--fh-bg)] text-slate-900 dark:text-slate-50"
      style={{ ["--fh-bg" as any]: EV_LIGHT }}
    >
      <a
        href="#provider-onboarding-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-xl focus:bg-white focus:px-3 focus:py-2 focus:text-[12px] focus:font-semibold focus:text-slate-900 focus:shadow"
      >
        Skip to onboarding content
      </a>
      <div className="mx-auto max-w-[1640px] px-5 py-5">
        <header className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <div
                  className="grid h-14 w-14 place-items-center rounded-3xl text-xl font-black text-white"
                  style={{ background: EV_GREEN }}
                >
                  FH
                </div>
                <div>
                  <div className="text-[44px] font-black leading-none tracking-[-0.04em] text-slate-900 dark:text-slate-100">
                    FH-P-001 - Provider Onboarding
                  </div>
                  <div className="mt-1 text-[14px] text-slate-500 dark:text-slate-400">
                    Premium verified-provider setup for brand, structure, permissions, channels, and production readiness.
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {quickStatusChips.map((chip) => (
                  <Pill key={chip.label} text={chip.label} tone={chip.tone} />
                ))}
                <Pill
                  text={childFacingMinistry ? "Child-safe defaults enabled" : "General ministry defaults"}
                  tone={childFacingMinistry ? "warn" : "neutral"}
                  icon={<ShieldCheck className="h-3.5 w-3.5" />}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <SoftButton onClick={saveDraft}>
                <CheckCircle2 className="h-4 w-4" />
                Save onboarding draft
              </SoftButton>
              <PrimaryButton onClick={inviteTeam} secondary>
                <Users className="h-4 w-4" />
                Invite team members
              </PrimaryButton>
              <PrimaryButton onClick={submitForVerification} title={canSubmit ? "Ready to submit" : "Resolve blockers first"}>
                <BadgeCheck className="h-4 w-4" />
                Submit for verification
              </PrimaryButton>
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Pill text={PROVIDER_PROFILES.find((item) => item.id === providerProfile)?.label || "Profile"} tone="brand" icon={<Building2 className="h-3.5 w-3.5" />} />
                <Pill text={lastSaved} tone="neutral" icon={<Sparkles className="h-3.5 w-3.5" />} />
                <Pill text={stepTips} tone="neutral" icon={<Wand2 className="h-3.5 w-3.5" />} />
              </div>
              <div className="flex flex-wrap gap-2">
                {linkedPages.map((page) => (
                  <Pill key={page.label} text={page.label} tone={page.tone} icon={page.icon} />
                ))}
              </div>
            </div>
          </div>
        </header>

        <main
          id="provider-onboarding-main"
          className="mt-5 grid gap-5 xl:grid-cols-[280px_minmax(var(--editor-min),1fr)_var(--preview-pane)]"
          style={{ ["--preview-pane" as any]: `${previewPaneWidth}px`, ["--editor-min" as any]: `${editorMinWidth}px` }}
        >
          <StepRail
            step={step}
            setStep={setStep}
            sectionScores={readinessSummary.sectionScores}
            stepStatuses={stepStatuses}
            blockersByStep={readinessSummary.blockersByStep}
            overallProgress={readinessSummary.overallProgress}
            blockers={readinessSummary.blockers}
          />

          <section className="space-y-5" aria-label="Onboarding editor">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 transition-colors dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Step {currentStepIndex} of {STEP_ORDER.length}
                  </div>
                  <h2 className="mt-1 text-[20px] font-black tracking-[-0.02em] text-slate-900 dark:text-slate-100">
                    {currentStepMeta.label}
                  </h2>
                </div>
                <Pill text={`${readinessSummary.overallProgress}% overall ready`} tone="good" />
              </div>
            </div>
            <div className="sticky top-3 z-10 rounded-3xl border border-emerald-200 bg-emerald-50/95 p-4 backdrop-blur dark:border-emerald-900/40 dark:bg-emerald-900/20">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-300">
                    Continue where you left off
                  </div>
                  <div className="mt-1 text-[14px] font-semibold text-slate-900 dark:text-slate-100">
                    {continueStepMeta.label}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                    {readinessSummary.blockersByStep[continueStep].length > 0
                      ? readinessSummary.blockersByStep[continueStep][0]
                      : "No blocker here. Finish this step to move onboarding forward."}
                  </div>
                </div>
                <PrimaryButton onClick={() => setStep(continueStep)}>
                  Continue setup
                </PrimaryButton>
              </div>
            </div>
            {renderCenter()}
          </section>

          <aside className="space-y-5 xl:sticky xl:top-3 xl:self-start" aria-label="Onboarding preview and readiness">
            <Card
              title="Preview controls"
              subtitle="Tune layout width, viewport, and comparison while you edit onboarding."
            >
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    <span>Preview pane width</span>
                    <span>{previewPaneWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min={320}
                    max={520}
                    step={10}
                    value={previewPaneWidth}
                    onChange={(event) => setPreviewPaneWidth(Number(event.target.value))}
                    className="w-full accent-emerald-600"
                    aria-label="Preview pane width"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    <span>Editor minimum width</span>
                    <span>{editorMinWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min={620}
                    max={980}
                    step={20}
                    value={editorMinWidth}
                    onChange={(event) => setEditorMinWidth(Number(event.target.value))}
                    className="w-full accent-emerald-600"
                    aria-label="Editor minimum width"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {(["mobile", "tablet", "desktop"] as const).map((viewport) => (
                    <button
                      key={viewport}
                      type="button"
                      aria-pressed={previewViewport === viewport}
                      onClick={() => setPreviewViewport(viewport)}
                      className={cx(
                        "rounded-xl border px-3 py-1.5 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
                        previewViewport === viewport
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
                      )}
                    >
                      {viewport}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  <SoftButton onClick={() => setCompareWithPublished((prev) => !prev)}>
                    {compareWithPublished ? "Single preview" : "Compare with published"}
                  </SoftButton>
                  <PrimaryButton onClick={() => setToast("Opened full preview panel")}>
                    Open full preview
                  </PrimaryButton>
                </div>
              </div>
            </Card>

            <Card
              title="Provider preview"
              subtitle="See how the institution profile and provider workspace will feel before launch."
              right={
                <Pill
                  text={isPreviewSynced ? "Synced preview" : "Unsaved changes"}
                  tone={isPreviewSynced ? "good" : "warn"}
                  icon={<Eye className="h-3.5 w-3.5" />}
                />
              }
            >
              {compareWithPublished ? (
                <div className="grid gap-4 xl:grid-cols-2">
                  <div>
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                      Current draft
                    </div>
                    <PhonePreview
                      institutionName={institutionName}
                      handle={handle}
                      faithFamily={faithFamily}
                      tradition={tradition}
                      mission={mission}
                      coverUrl={coverOption.url}
                      logoLetter={logoLetter}
                      campuses={campuses}
                      givingVisible={donationButtonsVisible}
                      liveEnabled={contentModes.includes("Live Sessions")}
                      viewport={previewViewport}
                      launchState="Draft"
                    />
                  </div>
                  <div>
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                      Published profile
                    </div>
                    <PhonePreview
                      institutionName={publishedSnapshot.institutionName}
                      handle={publishedSnapshot.handle}
                      faithFamily={publishedSnapshot.faithFamily}
                      tradition={publishedSnapshot.tradition}
                      mission={publishedSnapshot.mission}
                      coverUrl={coverOption.url}
                      logoLetter={publishedSnapshot.logoLetter}
                      campuses={campuses}
                      givingVisible={publishedSnapshot.givingVisible}
                      liveEnabled={publishedSnapshot.liveEnabled}
                      viewport={previewViewport}
                      launchState={publishedSnapshot.launchState}
                    />
                  </div>
                </div>
              ) : (
                <PhonePreview
                  institutionName={institutionName}
                  handle={handle}
                  faithFamily={faithFamily}
                  tradition={tradition}
                  mission={mission}
                  coverUrl={coverOption.url}
                  logoLetter={logoLetter}
                  campuses={campuses}
                  givingVisible={donationButtonsVisible}
                  liveEnabled={contentModes.includes("Live Sessions")}
                  viewport={previewViewport}
                  launchState="Draft"
                />
              )}
            </Card>

            <Card
              title="Readiness board"
              subtitle="One premium summary of verification, channel health, permissions, and launch confidence."
            >
              <div className="space-y-3">
                {STEP_ORDER.map((item) => {
                  const value = Math.round(readinessSummary.sectionScores[item.key] * 100);
                  const tone = value >= 90 ? EV_GREEN : value >= 60 ? EV_ORANGE : EV_NAVY;
                  return (
                    <div key={item.key}>
                      <div className="mb-1 flex items-center justify-between gap-2 text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                        <span>{item.label}</span>
                        <span>{value}%</span>
                      </div>
                      <ProgressBar value={value} color={tone} />
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card
              title="Safety and premium defaults"
              subtitle="Child-facing protection, localization readiness, and multi-campus support are first-class parts of the onboarding layer."
            >
              <div className="space-y-3">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                    Child-safe controls
                  </div>
                  <div className="text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">
                    {childFacingMinistry
                      ? "Extra moderation, channel restrictions, and compliance checks are enabled before public launch."
                      : "Standard moderation and outreach defaults are active for the wider provider audience."}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                    <Languages className="h-4 w-4 text-orange-600 dark:text-orange-300" />
                    Localization
                  </div>
                  <div className="text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">
                    {localizedVariant
                      ? "Localized metadata and multilingual launch surfaces are configured from day one."
                      : "Provider launches with a single primary locale and can expand later."}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                    <Link2 className="h-4 w-4 text-slate-700 dark:text-slate-200" />
                    Next unlock
                  </div>
                  <div className="text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">
                    Verification unlocks Provider Dashboard, Channels & Contact Manager, Donations & Funds, and the advanced creation workflows for Live Sessions and Beacon.
                  </div>
                </div>
              </div>
            </Card>
          </aside>
        </main>

        <div className="mt-5 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-center text-[12px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
          Concept preview of the generated FaithHub Provider Onboarding page - EVzone Green primary (#03cd8c) - Orange secondary (#f77f00)
        </div>
      </div>

      <div className="sr-only" aria-live="polite">
        {`Onboarding status: ${lastSaved}. ${readinessSummary.blockers.length} blockers remaining.`}
      </div>
      {toast ? (
        <div role="status" aria-live="polite" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white shadow-lg dark:bg-slate-100 dark:text-slate-900">
          {toast}
        </div>
      ) : null}
    </div>
  );
}


