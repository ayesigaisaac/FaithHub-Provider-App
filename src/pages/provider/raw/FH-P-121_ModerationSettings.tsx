"use client";

import React, { useMemo, useState } from "react";
import { ProviderPageTitle } from "@/components/provider/ProviderPageTitle";
import { ProviderSurfaceCard } from "@/components/provider/ProviderSurfaceCard";
import {
  Bot,
  ChevronRight,
  Eye,
  Lock,
  Save,
  Settings2,
  Shield,
  ShieldCheck,
  Siren,
  Workflow,
} from "lucide-react";

/**
 * Provider � Moderation Settings
 * ---------------------------------------
 * Distinct from Reviews & Moderation.
 * controls policy rules, thresholds, child-safe defaults,
 * automation rules, and downstream moderation settings inheritance.
 *
 * Primary CTAs:
 * - Update Rules
 * - Add Safeguard
 * - Save Policy
 *
 * Design notes:
 * - EVzone Green as primary (#03cd8c)
 * - EVzone Orange as secondary (#f77f00)
 */

const GREEN = "#03cd8c";
const ORANGE = "#f77f00";
const MEDIUM = "#a6a6a6";
const INDIGO = "#2f3f9f";

type PolicySection =
  | "core"
  | "live"
  | "community"
  | "childSafe"
  | "automation";

type PreviewMode = "desktop" | "mobile";

type PolicyPack = {
  id: string;
  title: string;
  detail: string;
  status: "Active" | "Review";
};

type Safeguard = {
  id: string;
  title: string;
  detail: string;
  enabled: boolean;
};

type QueueItem = {
  id: string;
  title: string;
  detail: string;
  state: "Ready" | "Testing" | "Review";
};

type AutomationRule = {
  id: string;
  title: string;
  detail: string;
  state: "Active" | "Testing" | "Draft";
};

type PreviewExample = {
  id: string;
  title: string;
  surface: string;
  outcome: "Hold" | "Block" | "Allow";
};

type FeedPage = {
  id: string;
  title: string;
  detail: string;
  state: "Linked" | "Healthy" | "Inherited";
};

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function Pill({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "brand" | "good" | "warn" | "danger" | "indigo";
  children: React.ReactNode;
}) {
  const cls =
    tone === "brand"
      ? "text-white border-transparent"
      : tone === "good"
        ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-800 dark:text-emerald-300"
        : tone === "warn"
          ? "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-500/10 dark:border-amber-800 dark:text-amber-300"
          : tone === "danger"
            ? "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-500/10 dark:border-rose-800 dark:text-rose-300"
            : tone === "indigo"
              ? "bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-500/10 dark:border-indigo-800 dark:text-indigo-300"
              : "bg-[var(--fh-surface-bg)] border-faith-line text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300";

  const style =
    tone === "brand"
      ? { background: ORANGE }
      : tone === "indigo"
        ? { backgroundColor: "rgba(47,63,159,0.08)" }
        : undefined;

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-extrabold whitespace-nowrap",
        cls,
      )}
      style={style}
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
}: {
  tone?: "neutral" | "primary" | "secondary";
  children: React.ReactNode;
  left?: React.ReactNode;
  onClick?: () => void;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-[12px] font-extrabold border transition-colors";
  const cls =
    tone === "primary"
      ? "border-transparent text-white"
      : tone === "secondary"
        ? "border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 text-faith-ink dark:text-slate-100 hover:bg-[var(--fh-surface)] dark:hover:bg-slate-800"
        : "border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 text-faith-ink dark:text-slate-100 hover:bg-[var(--fh-surface)] dark:hover:bg-slate-800";
  const style = tone === "primary" ? { background: GREEN } : undefined;

  return (
    <button type="button" className={cx(base, cls)} style={style} onClick={onClick}>
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
    >
      {children}
    </ProviderSurfaceCard>
  );
}

function StatCard({
  label,
  value,
  detail,
  dot,
}: {
  label: string;
  value: string;
  detail: string;
  dot: string;
}) {
  return (
    <div className="rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-4 py-3 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">
          {label}
        </div>
        <span className="h-7 w-7 rounded-full" style={{ background: dot }} />
      </div>
      <div className="mt-3 text-[15px] font-black text-faith-ink dark:text-slate-100">{value}</div>
      <div className="mt-1 text-[11px] leading-snug text-faith-slate">{detail}</div>
    </div>
  );
}

function SectionNavItem({
  active,
  icon,
  label,
  onClick,
}: {
  active?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "w-full rounded-[22px] border px-4 py-3 text-left transition-colors flex items-center justify-between gap-3",
        active
          ? "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20"
          : "border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 hover:bg-[var(--fh-surface)] dark:hover:bg-slate-800",
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="h-8 w-8 rounded-full border border-faith-line dark:border-slate-700 bg-[var(--fh-surface)] dark:bg-slate-800 grid place-items-center shrink-0">
          {icon}
        </span>
        <span className="truncate text-[13px] font-extrabold text-faith-ink dark:text-slate-100">{label}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-faith-slate" />
    </button>
  );
}

function MiniPolicyPack({ pack }: { pack: PolicyPack }) {
  return (
    <div className="rounded-[22px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 px-4 py-3 transition-colors flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="truncate text-[13px] font-extrabold text-faith-ink dark:text-slate-100">{pack.title}</div>
        <div className="mt-0.5 truncate text-[11px] text-faith-slate">{pack.detail}</div>
      </div>
      <Pill tone={pack.status === "Active" ? "good" : "warn"}>{pack.status}</Pill>
    </div>
  );
}

function SafeguardTile({
  safeguard,
  onToggle,
}: {
  safeguard: Safeguard;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="rounded-[22px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 px-4 py-3 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[13px] font-extrabold leading-tight text-faith-ink dark:text-slate-100">{safeguard.title}</div>
          <div className="mt-1 text-[11px] leading-snug text-faith-slate">{safeguard.detail}</div>
          <div className="mt-1 text-[11px] font-semibold text-faith-slate">High-trust safeguard for minors,�</div>
        </div>
        <Toggle checked={safeguard.enabled} onChange={() => onToggle(safeguard.id)} />
      </div>
    </div>
  );
}

function QueueTile({ item }: { item: QueueItem }) {
  return (
    <div className="rounded-[22px] border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10 px-4 py-3 transition-colors flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="truncate text-[13px] font-extrabold text-faith-ink dark:text-slate-100">{item.title}</div>
        <div className="mt-0.5 truncate text-[11px] text-faith-slate">{item.detail}</div>
      </div>
      <Pill tone={item.state === "Ready" ? "good" : item.state === "Testing" ? "warn" : "neutral"}>{item.state}</Pill>
    </div>
  );
}

function AutomationTile({ item }: { item: AutomationRule }) {
  return (
    <div className="rounded-[22px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 px-4 py-3 transition-colors flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="truncate text-[13px] font-extrabold text-faith-ink dark:text-slate-100">{item.title}</div>
        <div className="mt-0.5 truncate text-[11px] text-faith-slate">{item.detail}</div>
      </div>
      <Pill tone={item.state === "Active" ? "good" : item.state === "Testing" ? "warn" : "neutral"}>{item.state}</Pill>
    </div>
  );
}

function PreviewOutcome({ item }: { item: PreviewExample }) {
  const tone = item.outcome === "Block" ? "danger" : item.outcome === "Hold" ? "warn" : "good";
  return (
    <div className="rounded-[22px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 px-4 py-3 transition-colors flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="truncate text-[13px] font-extrabold text-faith-ink dark:text-slate-100">{item.title}</div>
        <div className="mt-0.5 truncate text-[11px] text-faith-slate">{item.surface}</div>
      </div>
      <Pill tone={tone}>{item.outcome}</Pill>
    </div>
  );
}

function FeedTile({ item }: { item: FeedPage }) {
  return (
    <div className="rounded-[22px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 px-4 py-3 transition-colors flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="truncate text-[13px] font-extrabold text-faith-ink dark:text-slate-100">{item.title}</div>
        <div className="mt-0.5 truncate text-[11px] text-faith-slate">{item.detail}</div>
      </div>
      <Pill tone={item.state === "Healthy" ? "good" : "indigo"}>{item.state}</Pill>
    </div>
  );
}

export default function FH_P_121_ModerationSettings() {
  const [section, setSection] = useState<PolicySection>("childSafe");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [safeguards, setSafeguards] = useState<Safeguard[]>([
    {
      id: "sg_1",
      title: "Disable anonymous replies�",
      detail: "Reduce hidden participation in child-facing or highly sensitive flows.",
      enabled: true,
    },
    {
      id: "sg_2",
      title: "Block adult-to-child�",
      detail: "Prevent direct adult-to-child routing outside approved care flows.",
      enabled: true,
    },
    {
      id: "sg_3",
      title: "Require dual approval for�",
      detail: "Mandate an extra reviewer for child-linked moderation actions.",
      enabled: true,
    },
    {
      id: "sg_4",
      title: "Disable direct messaging for�",
      detail: "Keep child-safe conversation surfaces group-led and audited.",
      enabled: true,
    },
    {
      id: "sg_5",
      title: "Require media consent on�",
      detail: "Add stricter consent checks for testimony and prayer uploads.",
      enabled: true,
    },
    {
      id: "sg_6",
      title: "Freeze public sort order duri�",
      detail: "Reduce rapid public amplification when risk signals spike.",
      enabled: true,
    },
  ]);

  const policyPacks: PolicyPack[] = [
    {
      id: "pk_1",
      title: "Provider default ministry rules",
      detail: "Base provider-wide policy set for live, replay, and community flows.",
      status: "Active",
    },
    {
      id: "pk_2",
      title: "Children & youth protection pack",
      detail: "Tighter defaults for child-facing ministries, counseling, and prayer care.",
      status: "Active",
    },
    {
      id: "pk_3",
      title: "Open community engagement pack",
      detail: "Lower-friction participation with stronger burst and abuse controls.",
      status: "Review",
    },
  ];

  const queueItems: QueueItem[] = [
    {
      id: "q_1",
      title: "Increase testimony media review strictness",
      detail: "Testimonies + moderation queue",
      state: "Ready",
    },
    {
      id: "q_2",
      title: "Tighten child-safe reply routing",
      detail: "Prayer Journal + Counseling + Audit Log",
      state: "Ready",
    },
  ];

  const automationRules: AutomationRule[] = [
    {
      id: "a_1",
      title: "3 flagged live-chat messages in 90 sec",
      detail: "Live Sessions",
      state: "Active",
    },
    {
      id: "a_2",
      title: "Potential brigading spike detected",
      detail: "Reviews & Forum",
      state: "Testing",
    },
  ];

  const previewExamples: PreviewExample[] = [
    {
      id: "p_1",
      title: "Live chat message with repeated links",
      surface: "Live Sessions � Chat",
      outcome: "Hold",
    },
    {
      id: "p_2",
      title: "Forum reply with elevated toxicity",
      surface: "Community Forum",
      outcome: "Block",
    },
    {
      id: "p_3",
      title: "Prayer journal reply on child-safe surface",
      surface: "Prayer Journal",
      outcome: "Block",
    },
    {
      id: "p_4",
      title: "First-time testimony with media upload",
      surface: "Testimonies",
      outcome: "Hold",
    },
  ];

  const feeds: FeedPage[] = [
    {
      id: "f_1",
      title: "Reviews & Moderation",
      detail: "Receives cases, incidents, evidence, and recovery workflows.",
      state: "Linked",
    },
    {
      id: "f_2",
      title: "Live Dashboard",
      detail: "Moderator quick tools and alert thresholds inherit these rules.",
      state: "Healthy",
    },
    {
      id: "f_3",
      title: "Community Forum",
      detail: "Threads, leader posts, and reply surfaces inherit policy defaults.",
      state: "Inherited",
    },
  ];

  const governanceHealth = useMemo(
    () => [
      {
        title: "Child-safe policy pack is active",
        detail: "Adult-to-child routing, direct-message restriction, and counseling guards remain on.",
        tone: "good" as const,
      },
      {
        title: "Marketplace-style review logic is under review",
        detail: "Brigade detection on public reviews will tighten once the pending policy is saved.",
        tone: "warn" as const,
      },
    ],
    [],
  );

  const handleToggleSafeguard = (id: string) => {
    setSafeguards((current) =>
      current.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-[var(--fh-page-bg)] dark:bg-slate-950 text-faith-ink dark:text-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-[1460px] space-y-4">
        <div className="rounded-[30px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-6 py-5 transition-colors">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex items-start gap-4 min-w-0">
              <div className="min-w-0">
                <ProviderPageTitle
                  icon={<ShieldCheck className="h-6 w-6" />}
                  title="Moderation Settings"
                  subtitle="Institution-wide policy rules, filters, defaults, thresholds, child-safe settings, and automation rules. This page governs rule definitions that feed live chat, community, prayer, counseling, reviews, and all linked trust surfaces."
                />
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Pill tone="good">Provider governance active</Pill>
                  <Pill>Feeds </Pill>
                  <Pill tone="warn">3 policy changes pending save</Pill>
                  <Pill tone="indigo">Child-safe defaults locked</Pill>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Btn tone="primary" left={<Workflow className="h-4 w-4" />}>
                Update Rules
              </Btn>
              <Btn tone="secondary" left={<Shield className="h-4 w-4" />}>
                Add Safeguard
              </Btn>
              <Btn tone="secondary" left={<Save className="h-4 w-4" />}>
                Save Policy
              </Btn>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-4 py-3 transition-colors flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <Pill tone="brand">Premium moderation defaults</Pill>
            <div className="text-[12px] font-extrabold text-faith-slate truncate">
              Rule definitions here shape Live Sessions, Community, Prayer, Counseling, Reviews, and all linked trust surfaces.
            </div>
          </div>
          <div className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">
            Surface engine � Safeguards � Automation
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <StatCard label="Active rule sets" value="8" detail="Provider-wide policies currently enforcing defaults." dot={GREEN} />
          <StatCard label="Automation rules" value="17" detail="Live, community, testimony, and child-safe automations." dot={ORANGE} />
          <StatCard label="Child-safe safeguards" value="4" detail="High-trust restrictions for children and counseling." dot={INDIGO} />
          <StatCard label="Surfaces protected" value="11" detail="Live, Forum, Prayer, Testimonies, Counseling, more." dot={GREEN} />
          <StatCard label="Policy confidence" value="94%" detail="Current moderation-settings health based on coverage." dot={ORANGE} />
          <StatCard label="Pending changes" value="3" detail="Queued adjustments waiting for save or approval." dot={MEDIUM} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[270px_minmax(0,1fr)_300px] gap-4 items-start">
          <div className="space-y-4">
            <Card
              title="Policy map"
              subtitle="Rule engine, defaults, thresholds, and safeguards that feed ."
            >
              <div className="space-y-2">
                <SectionNavItem
                  active={section === "core"}
                  icon={<Settings2 className="h-4 w-4 text-faith-slate" />}
                  label="Core policy packs"
                  onClick={() => setSection("core")}
                />
                <SectionNavItem
                  active={section === "live"}
                  icon={<Siren className="h-4 w-4 text-faith-slate" />}
                  label="Live chat defaults"
                  onClick={() => setSection("live")}
                />
                <SectionNavItem
                  active={section === "community"}
                  icon={<Shield className="h-4 w-4 text-faith-slate" />}
                  label="Community surfaces"
                  onClick={() => setSection("community")}
                />
                <SectionNavItem
                  active={section === "childSafe"}
                  icon={<Lock className="h-4 w-4 text-faith-slate" />}
                  label="Child-safe settings"
                  onClick={() => setSection("childSafe")}
                />
                <SectionNavItem
                  active={section === "automation"}
                  icon={<Bot className="h-4 w-4 text-faith-slate" />}
                  label="Automation rules"
                  onClick={() => setSection("automation")}
                />
              </div>
            </Card>

            <Card
              title="Governance health"
              subtitle="High-signal checks for policy readiness and safeguarding depth."
            >
              <div className="space-y-3">
                {governanceHealth.map((item) => (
                  <div
                    key={item.title}
                    className={cx(
                      "rounded-[22px] border px-4 py-3 transition-colors",
                      item.tone === "good"
                        ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10"
                        : "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10",
                    )}
                  >
                    <div className="text-[13px] font-extrabold text-faith-ink dark:text-slate-100">{item.title}</div>
                    <div className="mt-1 text-[11px] leading-snug text-faith-slate">{item.detail}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card
              title="Active policy packs"
              subtitle="Saved policy sets that define default behavior across provider surfaces."
              right={<Pill tone="good">Verified governance</Pill>}
            >
              <div className="space-y-2">
                {policyPacks.map((pack) => (
                  <MiniPolicyPack key={pack.id} pack={pack} />
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-4">
              <Card
                title="Child-safe restrictions"
                subtitle="Child-safe controls are strongest when reply routing, counseling approvals, and direct-message restrictions remain locked together."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {safeguards.map((safeguard) => (
                    <SafeguardTile key={safeguard.id} safeguard={safeguard} onToggle={handleToggleSafeguard} />
                  ))}
                </div>
              </Card>

              <div className="space-y-4">
                <Card
                  title="Safeguards & change queue"
                  subtitle="Safeguards that protect trust before cases even enter the moderation queue."
                >
                  <div className="space-y-2">
                    {queueItems.map((item) => (
                      <QueueTile key={item.id} item={item} />
                    ))}
                  </div>
                </Card>

                <Card
                  title="Automation builder"
                  subtitle="Create rules for brigading spikes, moderator absence, and threshold-based intervention."
                >
                  <div className="space-y-2">
                    {automationRules.map((item) => (
                      <AutomationTile key={item.id} item={item} />
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Card
              title="Policy preview rail"
              subtitle="See how settings will affect live chat, community surfaces, and child-safe flows."
            >
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop")}
                  className={cx(
                    "rounded-full border px-3 py-1 text-[11px] font-extrabold transition-colors",
                    previewMode === "desktop"
                      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-800 dark:text-emerald-300"
                      : "border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 text-faith-slate",
                  )}
                >
                  Desktop preview
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile")}
                  className={cx(
                    "rounded-full border px-3 py-1 text-[11px] font-extrabold transition-colors",
                    previewMode === "mobile"
                      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-800 dark:text-emerald-300"
                      : "border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 text-faith-slate",
                  )}
                >
                  Mobile preview
                </button>
              </div>

              <div className="mt-4 rounded-[24px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-4 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faith-slate">
                      Policy simulation
                    </div>
                    <div className="mt-1 text-[14px] font-black text-faith-ink dark:text-slate-100">Moderation outcome examples</div>
                  </div>
                  <Pill tone="indigo">Preview linked to settings</Pill>
                </div>
                <div className="mt-4 space-y-2">
                  {previewExamples.map((item) => (
                    <PreviewOutcome key={item.id} item={item} />
                  ))}
                </div>
                <div className="mt-4 text-[11px] text-faith-slate flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {previewMode === "desktop"
                    ? "Desktop simulation shows moderator-side handling and rule inheritance."
                    : "Mobile simulation shows user-side holds, blocks, and visible restrictions."}
                </div>
              </div>
            </Card>

            <Card
              title="What these settings feed"
              subtitle="Downstream surfaces that inherit moderation defaults from this page."
            >
              <div className="space-y-2">
                {feeds.map((item) => (
                  <FeedTile key={item.id} item={item} />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}





