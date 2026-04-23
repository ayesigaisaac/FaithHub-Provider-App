// @ts-nocheck
"use client";

import React, { useMemo, useState } from "react";
import { navigateWithRouter } from "@/navigation/routerNavigate";
import { ProviderPageTitle } from "@/components/provider/ProviderPageTitle";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Eye,
  Globe2,
  Lock,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  UserPlus,
  Workflow,
  X,
} from "lucide-react";

/**
 * Provider — Leadership
 * --------------------------------
 * Premium Provider-side leadership operating surface for leadership roster,
 * office assignment, public visibility, succession planning, and coverage health.
 *
 * Primary CTAs
 * - + New Leader
 * - Assign Office
 * - Publish Leadership
 *
 * Direction
 * - Same premium creator-style grammar used across the Provider Workspace pages.
 * - EVzone Green is primary. Orange is secondary.
 * - Strong command hero, KPI strip, searchable roster, office structure,
 *   succession/coverage lane, and persistent public-preview rail.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#172554";

const ROUTES = {
  providerDashboard: "/faithhub/provider/dashboard",
  leadershipBuilder: "/faithhub/provider/leadership/new",
  officeAssignment: "/faithhub/provider/leadership/assign-office",
  rolesPermissions: "/faithhub/provider/roles-permissions",
  publishLeadership: "/faithhub/provider/leadership/publish",
};

const HERO_1 =
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80";
const HERO_2 =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80";
const HERO_3 =
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80";
const HERO_4 =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1600&q=80";

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  navigateWithRouter(url);
}

function fmtInt(n: number) {
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function pct(value: number, total: number) {
  if (!total) return 0;
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}

type PreviewMode = "desktop" | "mobile";
type LeadershipStatus = "Published" | "Internal review" | "Coverage risk" | "Draft";
type VisibilityMode = "Public" | "Internal" | "Limited";
type SuccessionState = "Covered" | "Needs backup" | "Vacant soon";

type LeaderRecord = {
  id: string;
  name: string;
  officeTitle: string;
  ministryArea: string;
  status: LeadershipStatus;
  visibility: VisibilityMode;
  campus: string;
  language: string[];
  tenureLabel: string;
  heroUrl: string;
  bio: string;
  reports: number;
  activeTeams: number;
  upcomingEvents: number;
  liveSessions: number;
  publicFeatured: boolean;
  succession: SuccessionState;
  deputy?: string;
  nextReviewISO: string;
  responsibilities: string[];
  tags: string[];
};

type OfficeCard = {
  id: string;
  title: string;
  count: number;
  state: "Stable" | "Watch" | "Gap";
  subtitle: string;
};

type CoverageSignal = {
  id: string;
  title: string;
  hint: string;
  tone: "good" | "warn" | "danger";
};

const TEMPLATE_CARDS = [
  {
    id: "tpl-senior-pastor",
    title: "Senior leadership",
    subtitle: "Public office profiles, succession notes, and mission-wide visibility.",
    accent: "green" as const,
  },
  {
    id: "tpl-campus",
    title: "Campus leadership",
    subtitle: "Campus pastors, coordinators, deputies, and local coverage planning.",
    accent: "orange" as const,
  },
  {
    id: "tpl-ministry",
    title: "Ministry directors",
    subtitle: "Worship, outreach, youth, and operations offices with linked teams.",
    accent: "navy" as const,
  },
  {
    id: "tpl-board",
    title: "Board & trustees",
    subtitle: "Governance roster, approval roles, and public/non-public visibility control.",
    accent: "green" as const,
  },
];

const OFFICE_CARDS: OfficeCard[] = [
  {
    id: "off-senior",
    title: "Senior leadership offices",
    count: 6,
    state: "Stable",
    subtitle: "High-visibility leadership profiles with published public cards and succession backups.",
  },
  {
    id: "off-campus",
    title: "Campus offices",
    count: 9,
    state: "Watch",
    subtitle: "Campus pastors and coordinators with local coverage and review cadence.",
  },
  {
    id: "off-ministry",
    title: "Ministry leadership",
    count: 14,
    state: "Stable",
    subtitle: "Youth, worship, outreach, care, and discipleship heads linked to serving teams.",
  },
  {
    id: "off-governance",
    title: "Governance & trustees",
    count: 5,
    state: "Gap",
    subtitle: "Internal and public office structure for trustees, advisors, and audit-linked roles.",
  },
];

const LEADERS: LeaderRecord[] = [
  {
    id: "ldr-001",
    name: "Pastor Michael A.",
    officeTitle: "Senior Pastor",
    ministryArea: "Executive leadership",
    status: "Published",
    visibility: "Public",
    campus: "Central Campus",
    language: ["English", "Luganda"],
    tenureLabel: "6 years",
    heroUrl: HERO_1,
    bio: "Leads the institution’s teaching direction, leadership rhythms, and high-visibility ministry moments across campuses.",
    reports: 7,
    activeTeams: 4,
    upcomingEvents: 3,
    liveSessions: 5,
    publicFeatured: true,
    succession: "Covered",
    deputy: "Pastor Grace N.",
    nextReviewISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18).toISOString(),
    responsibilities: [
      "Weekend teaching leadership",
      "Leadership council oversight",
      "Public ministry representation",
      "High-level ministry approvals",
    ],
    tags: ["Featured leader", "Public profile", "Teaching lead"],
  },
  {
    id: "ldr-002",
    name: "Pastor Grace N.",
    officeTitle: "Deputy Senior Pastor",
    ministryArea: "Care & discipleship",
    status: "Published",
    visibility: "Public",
    campus: "Central Campus",
    language: ["English", "Swahili"],
    tenureLabel: "4 years",
    heroUrl: HERO_2,
    bio: "Oversees discipleship pathways, care ministries, and leader development across small groups and community care flows.",
    reports: 5,
    activeTeams: 6,
    upcomingEvents: 2,
    liveSessions: 2,
    publicFeatured: true,
    succession: "Covered",
    deputy: "Minister Ruth K.",
    nextReviewISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
    responsibilities: [
      "Discipleship systems",
      "Pastoral care coverage",
      "Leader mentoring",
      "Community safety review",
    ],
    tags: ["Deputy office", "Care lead", "Published"],
  },
  {
    id: "ldr-003",
    name: "Minister Daniel R.",
    officeTitle: "Youth Director",
    ministryArea: "Youth ministry",
    status: "Coverage risk",
    visibility: "Public",
    campus: "East Campus",
    language: ["English"],
    tenureLabel: "18 months",
    heroUrl: HERO_3,
    bio: "Leads youth teaching, student events, youth volunteer systems, and safety-aware communication for younger audiences.",
    reports: 3,
    activeTeams: 5,
    upcomingEvents: 4,
    liveSessions: 3,
    publicFeatured: false,
    succession: "Needs backup",
    deputy: "",
    nextReviewISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(),
    responsibilities: [
      "Youth gatherings",
      "Student leader coaching",
      "Youth events and retreats",
      "Child-safe workflow compliance",
    ],
    tags: ["Coverage risk", "Youth", "Needs deputy"],
  },
  {
    id: "ldr-004",
    name: "Elder Ruth K.",
    officeTitle: "Trustee Board Secretary",
    ministryArea: "Governance",
    status: "Internal review",
    visibility: "Limited",
    campus: "Institution-wide",
    language: ["English"],
    tenureLabel: "2 years",
    heroUrl: HERO_4,
    bio: "Coordinates trustee communication, governance records, and institution-wide approvals that require board awareness.",
    reports: 1,
    activeTeams: 2,
    upcomingEvents: 1,
    liveSessions: 0,
    publicFeatured: false,
    succession: "Vacant soon",
    deputy: "Board Assistant",
    nextReviewISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    responsibilities: [
      "Board records",
      "Governance meeting prep",
      "Policy sign-off routing",
      "Audit-linked reporting",
    ],
    tags: ["Governance", "Limited visibility", "Review pending"],
  },
];

const COVERAGE_SIGNALS: CoverageSignal[] = [
  {
    id: "sig-1",
    title: "Youth Director backup needed",
    hint: "East Campus youth office has no confirmed deputy for the next 30 days.",
    tone: "danger",
  },
  {
    id: "sig-2",
    title: "Governance review due",
    hint: "Trustee office publishing visibility needs final sign-off before next board update.",
    tone: "warn",
  },
  {
    id: "sig-3",
    title: "Senior leadership coverage healthy",
    hint: "Executive and care leadership offices currently have named succession coverage.",
    tone: "good",
  },
];

function MiniStat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[var(--fh-surface-bg)]/80 p-3 shadow-soft backdrop-blur dark:border-white/5 dark:bg-slate-900/70">
      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-faith-slate">
        {label}
      </div>
      <div className="mt-2 text-2xl font-black text-faith-ink dark:text-slate-100">
        {value}
      </div>
      <div className="mt-1 text-[11px] text-faith-slate">{hint}</div>
    </div>
  );
}

function TonePill({ tone, children }: { tone: "neutral" | "good" | "warn" | "danger" | "accent"; children: React.ReactNode }) {
  const cls =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300"
      : tone === "warn"
        ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300"
        : tone === "danger"
          ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300"
          : tone === "accent"
            ? "text-white"
            : "border-faith-line bg-[var(--fh-surface-bg)] text-faith-slate dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300";

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        cls,
      )}
      style={tone === "accent" ? { background: EV_ORANGE, borderColor: EV_ORANGE } : undefined}
    >
      {children}
    </span>
  );
}

function TemplateCard({
  title,
  subtitle,
  accent,
}: {
  title: string;
  subtitle: string;
  accent: "green" | "orange" | "navy";
}) {
  const bg = accent === "green" ? EV_GREEN : accent === "orange" ? EV_ORANGE : EV_NAVY;

  return (
    <button
      type="button"
      onClick={() => safeNav(ROUTES.leadershipBuilder)}
      className="group rounded-[28px] border border-faith-line bg-[var(--fh-surface-bg)] p-4 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <div
        className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white"
        style={{ background: bg }}
      >
        Template
      </div>
      <div className="mt-4 text-[15px] font-bold text-faith-ink dark:text-slate-100">{title}</div>
      <div className="mt-1 text-[12px] leading-5 text-faith-slate">{subtitle}</div>
      <div className="mt-4 inline-flex items-center gap-2 text-[12px] font-bold" style={{ color: bg }}>
        Open template <ChevronRight className="h-4 w-4" />
      </div>
    </button>
  );
}

function OfficeCardView({ office }: { office: OfficeCard }) {
  const tone = office.state === "Stable" ? "good" : office.state === "Watch" ? "warn" : "danger";

  return (
    <div className="rounded-[28px] border border-faith-line bg-[var(--fh-surface-bg)] p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[14px] font-bold text-faith-ink dark:text-slate-100">{office.title}</div>
          <div className="mt-1 text-[12px] leading-5 text-faith-slate">{office.subtitle}</div>
        </div>
        <TonePill tone={tone}>{office.state}</TonePill>
      </div>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-faith-slate">
            Active offices
          </div>
          <div className="mt-1 text-2xl font-black text-faith-ink dark:text-slate-100">{office.count}</div>
        </div>
        <button
          type="button"
          onClick={() => safeNav(ROUTES.officeAssignment)}
          className="inline-flex items-center gap-2 rounded-2xl border border-faith-line px-3 py-2 text-[12px] font-bold text-slate-700 transition hover:bg-[var(--fh-surface)] dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Assign office <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function LeadershipPreviewCard({
  leader,
  previewMode,
}: {
  leader: LeaderRecord;
  previewMode: PreviewMode;
}) {
  return (
    <div
      className={cx(
        "overflow-hidden rounded-[30px] border border-faith-line bg-[var(--fh-surface-bg)] shadow-soft dark:border-slate-800 dark:bg-slate-900",
        previewMode === "desktop" ? "w-full" : "mx-auto w-[320px] md:w-[360px]",
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-200 dark:bg-slate-800">
        <img src={leader.heroUrl} alt={leader.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-[var(--fh-surface-bg)]/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-700 shadow-soft backdrop-blur">
          <BadgeCheck className="h-3.5 w-3.5" style={{ color: EV_GREEN }} />
          Leadership profile
        </div>
        <div className="absolute left-4 right-4 bottom-4 text-white">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[var(--fh-surface-bg)]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] backdrop-blur">
              {leader.officeTitle}
            </span>
            {leader.publicFeatured ? (
              <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white" style={{ background: EV_ORANGE }}>
                Featured leader
              </span>
            ) : null}
          </div>
          <div className="mt-3 text-xl font-black leading-tight">{leader.name}</div>
          <div className="mt-1 text-[12px] text-white/80">{leader.ministryArea}</div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <TonePill tone={leader.visibility === "Public" ? "good" : leader.visibility === "Limited" ? "warn" : "neutral"}>
            <Globe2 className="h-3.5 w-3.5" /> {leader.visibility}
          </TonePill>
          <TonePill tone={leader.status === "Published" ? "good" : leader.status === "Coverage risk" ? "danger" : leader.status === "Internal review" ? "warn" : "neutral"}>
            {leader.status}
          </TonePill>
          <TonePill tone={leader.succession === "Covered" ? "good" : leader.succession === "Needs backup" ? "warn" : "danger"}>
            <Workflow className="h-3.5 w-3.5" /> {leader.succession}
          </TonePill>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface)] px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-faith-slate">Campus</div>
            <div className="mt-1 text-[13px] font-bold text-faith-ink dark:text-slate-100">{leader.campus}</div>
          </div>
          <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface)] px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-faith-slate">Languages</div>
            <div className="mt-1 text-[13px] font-bold text-faith-ink dark:text-slate-100">{leader.language.join(", ")}</div>
          </div>
        </div>

        <div className="mt-4 text-[13px] leading-6 text-faith-slate dark:text-slate-300">{leader.bio}</div>

        <div className="mt-4 flex flex-wrap gap-2">
          {leader.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-faith-line bg-[var(--fh-surface)] px-2.5 py-1 text-[11px] font-semibold text-faith-slate dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function PreviewDrawer({
  open,
  onClose,
  leader,
}: {
  open: boolean;
  onClose: () => void;
  leader: LeaderRecord | null;
}) {
  if (!open || !leader) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-4xl overflow-y-auto border-l border-faith-line bg-[var(--fh-surface)] p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-3 rounded-[28px] border border-faith-line bg-[var(--fh-surface-bg)] p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-faith-slate">
              Public leadership preview
            </div>
            <div className="mt-1 text-lg font-black text-faith-ink dark:text-slate-100">{leader.name}</div>
            <div className="mt-1 text-[12px] text-faith-slate">Preview how this leadership profile appears across the platform public surfaces.</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] text-slate-700 transition hover:bg-[var(--fh-surface)] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_340px]">
          <LeadershipPreviewCard leader={leader} previewMode="desktop" />
          <LeadershipPreviewCard leader={leader} previewMode="mobile" />
        </div>
      </div>
    </div>
  );
}

export default function FaithHubLeadershipPage() {
  const [query, setQuery] = useState("");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [selectedId, setSelectedId] = useState<string>(LEADERS[0].id);
  const [previewOpen, setPreviewOpen] = useState(false);

  const selectedLeader = useMemo(
    () => LEADERS.find((leader) => leader.id === selectedId) || LEADERS[0],
    [selectedId],
  );

  const filteredLeaders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LEADERS;
    return LEADERS.filter((leader) => {
      const hay = [
        leader.name,
        leader.officeTitle,
        leader.ministryArea,
        leader.campus,
        leader.status,
        leader.visibility,
        ...leader.tags,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  const totals = useMemo(() => {
    const totalLeaders = LEADERS.length;
    const published = LEADERS.filter((leader) => leader.status === "Published").length;
    const publicProfiles = LEADERS.filter((leader) => leader.visibility === "Public").length;
    const coverageHealthy = LEADERS.filter((leader) => leader.succession === "Covered").length;
    return {
      totalLeaders,
      published,
      publicProfiles,
      coverageHealthy,
    };
  }, []);

  const leadershipHealth = pct(totals.coverageHealthy, totals.totalLeaders);
  const publishHealth = pct(totals.published, totals.totalLeaders);

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-faith-ink dark:bg-slate-950 dark:text-slate-100">
      <PreviewDrawer open={previewOpen} onClose={() => setPreviewOpen(false)} leader={selectedLeader} />

      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
        <section className="overflow-hidden rounded-[36px] border border-faith-line bg-[var(--fh-surface-bg)] shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1.15fr)_420px] lg:px-8 lg:py-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-faith-line bg-[var(--fh-surface)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-faith-slate dark:border-slate-700 dark:bg-slate-950">
                Team command
              </div>
              <div className="mt-4">
                <ProviderPageTitle
                  icon={<Briefcase className="h-6 w-6" />}
                  title="Leadership"
                  subtitle="Manage leadership profiles, offices, and succession from one premium team command surface with clear ownership, visibility rules, coverage planning, and publish-ready leadership cards."
                />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <TonePill tone="good">
                  <BadgeCheck className="h-3.5 w-3.5" /> Leadership published
                </TonePill>
                <TonePill tone="accent">Team cluster</TonePill>
                <TonePill tone="neutral">Provider Workspace workspace</TonePill>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => safeNav(ROUTES.leadershipBuilder)}
                  className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-[13px] font-bold text-white shadow-soft transition hover:opacity-95"
                  style={{ background: EV_GREEN }}
                >
                  <Plus className="h-4 w-4" /> New Leader
                </button>
                <button
                  type="button"
                  onClick={() => safeNav(ROUTES.officeAssignment)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] px-4 py-3 text-[13px] font-bold text-slate-700 transition hover:bg-[var(--fh-surface)] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Briefcase className="h-4 w-4" /> Assign Office
                </button>
                <button
                  type="button"
                  onClick={() => safeNav(ROUTES.publishLeadership)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] px-4 py-3 text-[13px] font-bold text-slate-700 transition hover:bg-[var(--fh-surface)] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <CheckCircle2 className="h-4 w-4" /> Publish Leadership
                </button>
              </div>
            </div>

            <div className="rounded-[30px] border border-faith-line bg-[var(--fh-surface)] p-4 shadow-inner dark:border-slate-800 dark:bg-slate-950">
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <MiniStat label="Total leaders" value={fmtInt(totals.totalLeaders)} hint="Profiles being managed across public and internal surfaces." />
                <MiniStat label="Published" value={fmtInt(totals.published)} hint="Public leadership profiles already visible on Provider." />
                <MiniStat label="Public offices" value={fmtInt(totals.publicProfiles)} hint="Leaders currently set to public discovery and public profile pages." />
                <MiniStat label="Coverage healthy" value={`${leadershipHealth}%`} hint="Offices with named succession coverage or deputies." />
              </div>

              <div className="mt-4 rounded-[24px] border border-white/10 bg-[var(--fh-surface-bg)]/90 p-4 dark:bg-slate-900/70">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="mt-2 text-[28px] font-black leading-[1.04] tracking-[-0.03em] text-faith-ink dark:text-slate-100 sm:text-[34px] lg:text-[40px]">{publishHealth}% leadership publish-ready</div>
                  </div>
                  <div
                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-soft"
                    style={{ background: publishHealth >= 75 ? EV_GREEN : EV_ORANGE }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${publishHealth}%`, background: publishHealth >= 75 ? EV_GREEN : EV_ORANGE }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {OFFICE_CARDS.map((office) => (
                <OfficeCardView key={office.id} office={office} />
              ))}
            </section>

            <section className="rounded-[32px] border border-faith-line bg-[var(--fh-surface-bg)] p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900 md:p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-faith-slate">
                    Leadership roster
                  </div>
                  <div className="mt-1 text-[24px] font-black tracking-[-0.02em] text-slate-950 dark:text-white">
                    Search, review, and maintain the leadership roster
                  </div>
                  <div className="mt-2 text-[13px] leading-6 text-faith-slate">
                    Keep office titles, public visibility, succession coverage, and leadership responsibilities current.
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px] md:min-w-[480px]">
                  <label className="relative block">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faith-slate" />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search by leader, office, campus, or tag"
                      className="h-12 w-full rounded-2xl border border-faith-line bg-[var(--fh-surface)] pl-10 pr-4 text-[13px] font-medium text-faith-ink outline-none transition focus:border-transparent focus:ring-2 focus:ring-[rgba(3,205,140,0.35)] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] px-4 text-[13px] font-bold text-slate-700 transition hover:bg-[var(--fh-surface)] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Eye className="h-4 w-4" /> Open preview
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <div className="space-y-3">
                  {filteredLeaders.map((leader) => {
                    const statusTone =
                      leader.status === "Published"
                        ? "good"
                        : leader.status === "Coverage risk"
                          ? "danger"
                          : leader.status === "Internal review"
                            ? "warn"
                            : "neutral";
                    const successionTone =
                      leader.succession === "Covered"
                        ? "good"
                        : leader.succession === "Needs backup"
                          ? "warn"
                          : "danger";

                    return (
                      <button
                        key={leader.id}
                        type="button"
                        onClick={() => setSelectedId(leader.id)}
                        className={cx(
                          "w-full rounded-[26px] border p-4 text-left shadow-soft transition-all",
                          selectedId === leader.id
                            ? "border-transparent ring-2 ring-[rgba(3,205,140,0.35)] bg-[rgba(3,205,140,0.06)] dark:bg-[rgba(3,205,140,0.10)]"
                            : "border-faith-line bg-[var(--fh-surface-bg)] hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={leader.heroUrl}
                            alt={leader.name}
                            className="h-16 w-16 rounded-2xl object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <div className="text-[15px] font-bold text-faith-ink dark:text-slate-100">
                                  {leader.name}
                                </div>
                                <div className="mt-0.5 text-[12px] text-faith-slate">
                                  {leader.officeTitle} · {leader.campus}
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <TonePill tone={statusTone}>{leader.status}</TonePill>
                                <TonePill tone={successionTone}>{leader.succession}</TonePill>
                              </div>
                            </div>

                            <div className="mt-3 grid gap-2 sm:grid-cols-4">
                              <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface)] px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-faith-slate">Reports</div>
                                <div className="mt-1 text-[14px] font-black text-faith-ink dark:text-slate-100">{leader.reports}</div>
                              </div>
                              <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface)] px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-faith-slate">Active teams</div>
                                <div className="mt-1 text-[14px] font-black text-faith-ink dark:text-slate-100">{leader.activeTeams}</div>
                              </div>
                              <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface)] px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-faith-slate">Upcoming events</div>
                                <div className="mt-1 text-[14px] font-black text-faith-ink dark:text-slate-100">{leader.upcomingEvents}</div>
                              </div>
                              <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface)] px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-faith-slate">Live linked</div>
                                <div className="mt-1 text-[14px] font-black text-faith-ink dark:text-slate-100">{leader.liveSessions}</div>
                              </div>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-faith-slate">
                              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {leader.campus}</span>
                              <span className="inline-flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5" /> Review {new Date(leader.nextReviewISO).toLocaleDateString()}</span>
                              <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {leader.tenureLabel}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {!filteredLeaders.length ? (
                    <div className="rounded-[26px] border border-dashed border-slate-300 bg-[var(--fh-surface)] p-8 text-center dark:border-slate-700 dark:bg-slate-950">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--fh-surface-bg)] shadow-soft dark:bg-slate-900">
                        <Search className="h-6 w-6 text-faith-slate" />
                      </div>
                      <div className="mt-4 text-[15px] font-bold text-faith-ink dark:text-slate-100">No leaders match this search</div>
                      <div className="mt-1 text-[13px] text-faith-slate">Try another office title, campus, or ministry tag.</div>
                    </div>
                  ) : null}
                </div>

                <div className="space-y-4 rounded-[30px] border border-faith-line bg-[var(--fh-surface)] p-4 shadow-inner dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-faith-slate">Selected leader</div>
                      <div className="mt-1 text-[22px] font-black tracking-[-0.02em] text-slate-950 dark:text-white">{selectedLeader.name}</div>
                      <div className="mt-1 text-[13px] text-faith-slate">{selectedLeader.officeTitle} · {selectedLeader.ministryArea}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(true)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] px-3 py-2 text-[12px] font-bold text-slate-700 transition hover:bg-[var(--fh-surface)] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <Eye className="h-4 w-4" /> Preview
                    </button>
                  </div>

                  <div className="rounded-[26px] border border-faith-line bg-[var(--fh-surface-bg)] p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                    <div className="aspect-[16/9] overflow-hidden rounded-[22px] bg-slate-200 dark:bg-slate-800">
                      <img src={selectedLeader.heroUrl} alt={selectedLeader.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <TonePill tone={selectedLeader.status === "Published" ? "good" : selectedLeader.status === "Coverage risk" ? "danger" : selectedLeader.status === "Internal review" ? "warn" : "neutral"}>
                        {selectedLeader.status}
                      </TonePill>
                      <TonePill tone={selectedLeader.visibility === "Public" ? "good" : selectedLeader.visibility === "Limited" ? "warn" : "neutral"}>
                        <Globe2 className="h-3.5 w-3.5" /> {selectedLeader.visibility}
                      </TonePill>
                      <TonePill tone={selectedLeader.succession === "Covered" ? "good" : selectedLeader.succession === "Needs backup" ? "warn" : "danger"}>
                        <Workflow className="h-3.5 w-3.5" /> {selectedLeader.succession}
                      </TonePill>
                    </div>
                    <div className="mt-4 text-[13px] leading-6 text-faith-slate dark:text-slate-300">{selectedLeader.bio}</div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface)] p-3 dark:border-slate-700 dark:bg-slate-950">
                        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-faith-slate">Deputy / backup</div>
                        <div className="mt-1 text-[14px] font-black text-faith-ink dark:text-slate-100">{selectedLeader.deputy || "Not assigned"}</div>
                      </div>
                      <div className="rounded-2xl border border-faith-line bg-[var(--fh-surface)] p-3 dark:border-slate-700 dark:bg-slate-950">
                        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-faith-slate">Next review</div>
                        <div className="mt-1 text-[14px] font-black text-faith-ink dark:text-slate-100">{new Date(selectedLeader.nextReviewISO).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-faith-slate">Responsibilities</div>
                      <div className="mt-2 space-y-2">
                        {selectedLeader.responsibilities.map((responsibility) => (
                          <div key={responsibility} className="flex items-start gap-2 text-[12px] text-faith-slate dark:text-slate-300">
                            <CheckCircle2 className="mt-0.5 h-4 w-4" style={{ color: EV_GREEN }} />
                            <span>{responsibility}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className="rounded-[32px] border border-faith-line bg-[var(--fh-surface-bg)] p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.18em] text-faith-slate">Succession & coverage</div>
                    <div className="mt-1 text-[22px] font-black tracking-[-0.02em] text-slate-950 dark:text-white">Coverage signals that need leadership action</div>
                  </div>
                  <TonePill tone="warn">
                    <AlertTriangle className="h-3.5 w-3.5" /> 2 actions needed
                  </TonePill>
                </div>
                <div className="mt-4 space-y-3">
                  {COVERAGE_SIGNALS.map((signal) => (
                    <div
                      key={signal.id}
                      className={cx(
                        "rounded-[24px] border p-4",
                        signal.tone === "good"
                          ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/40 dark:bg-emerald-900/20"
                          : signal.tone === "warn"
                            ? "border-amber-200 bg-amber-50/70 dark:border-amber-900/40 dark:bg-amber-900/20"
                            : "border-rose-200 bg-rose-50/70 dark:border-rose-900/40 dark:bg-rose-900/20",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[14px] font-bold text-faith-ink dark:text-slate-100">{signal.title}</div>
                          <div className="mt-1 text-[12px] leading-5 text-faith-slate dark:text-slate-300">{signal.hint}</div>
                        </div>
                        <TonePill tone={signal.tone === "good" ? "good" : signal.tone === "warn" ? "warn" : "danger"}>
                          {signal.tone === "good" ? "Healthy" : signal.tone === "warn" ? "Watch" : "Urgent"}
                        </TonePill>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-faith-line bg-[var(--fh-surface-bg)] p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.18em] text-faith-slate">Quick-create templates</div>
                    <div className="mt-1 text-[22px] font-black tracking-[-0.02em] text-slate-950 dark:text-white">Launch premium leadership workflows faster</div>
                  </div>
                  <TonePill tone="accent">Premium</TonePill>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {TEMPLATE_CARDS.map((template) => (
                    <TemplateCard
                      key={template.id}
                      title={template.title}
                      subtitle={template.subtitle}
                      accent={template.accent}
                    />
                  ))}
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[32px] border border-faith-line bg-[var(--fh-surface-bg)] p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-faith-slate">Public preview rail</div>
                  <div className="mt-1 text-[18px] font-black tracking-[-0.02em] text-slate-950 dark:text-white">Leadership profile destination preview</div>
                </div>
                <div className="inline-flex rounded-2xl border border-faith-line bg-[var(--fh-surface)] p-1 dark:border-slate-700 dark:bg-slate-950">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("desktop")}
                    className={cx(
                      "rounded-xl px-3 py-1.5 text-[11px] font-bold transition",
                      previewMode === "desktop"
                        ? "text-white"
                        : "text-faith-slate hover:bg-[var(--fh-surface-bg)] dark:text-slate-300 dark:hover:bg-slate-800",
                    )}
                    style={previewMode === "desktop" ? { background: EV_GREEN } : undefined}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("mobile")}
                    className={cx(
                      "rounded-xl px-3 py-1.5 text-[11px] font-bold transition",
                      previewMode === "mobile"
                        ? "text-white"
                        : "text-faith-slate hover:bg-[var(--fh-surface-bg)] dark:text-slate-300 dark:hover:bg-slate-800",
                    )}
                    style={previewMode === "mobile" ? { background: EV_GREEN } : undefined}
                  >
                    Mobile
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <LeadershipPreviewCard leader={selectedLeader} previewMode={previewMode} />
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-[13px] font-bold text-white transition hover:opacity-95"
                  style={{ background: EV_GREEN }}
                >
                  <Eye className="h-4 w-4" /> Expand preview
                </button>
                <button
                  type="button"
                  onClick={() => safeNav(ROUTES.publishLeadership)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] px-4 py-3 text-[13px] font-bold text-slate-700 transition hover:bg-[var(--fh-surface)] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <ArrowRight className="h-4 w-4" /> Publish
                </button>
              </div>
            </section>

            <section className="rounded-[32px] border border-faith-line bg-[var(--fh-surface-bg)] p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-faith-slate">Linked controls</div>
              <div className="mt-1 text-[18px] font-black tracking-[-0.02em] text-slate-950 dark:text-white">Related workspace pages</div>
              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  onClick={() => safeNav(ROUTES.providerDashboard)}
                  className="flex w-full items-start gap-3 rounded-[24px] border border-faith-line bg-[var(--fh-surface)] p-4 text-left transition hover:bg-[var(--fh-surface-bg)] dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900"
                >
                  <Star className="mt-0.5 h-5 w-5" style={{ color: EV_GREEN }} />
                  <div>
                    <div className="text-[13px] font-bold text-faith-ink dark:text-slate-100">Provider Dashboard</div>
                    <div className="mt-1 text-[12px] leading-5 text-faith-slate">Return to mission control for role-aware provider decisions and institution-wide tasks.</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => safeNav(ROUTES.rolesPermissions)}
                  className="flex w-full items-start gap-3 rounded-[24px] border border-faith-line bg-[var(--fh-surface)] p-4 text-left transition hover:bg-[var(--fh-surface-bg)] dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900"
                >
                  <ShieldCheck className="mt-0.5 h-5 w-5" style={{ color: EV_ORANGE }} />
                  <div>
                    <div className="text-[13px] font-bold text-faith-ink dark:text-slate-100">Roles & Permissions</div>
                    <div className="mt-1 text-[12px] leading-5 text-faith-slate">Control leadership access, approval routing, and who can publish public office profiles.</div>
                  </div>
                </button>
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-[var(--fh-surface)] p-4 text-[12px] leading-6 text-faith-slate dark:border-slate-700 dark:bg-slate-950">
                  <div className="flex items-start gap-2">
                    <Lock className="mt-0.5 h-4 w-4" />
                    <span>Premium differentiator: keep public leadership storytelling and internal office governance in one premium operational surface.</span>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </section>
      </div>
    </div>
  );
}






