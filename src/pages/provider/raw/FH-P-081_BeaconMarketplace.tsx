// @ts-nocheck
"use client";

import React, { useMemo, useState } from "react";
import { navigateWithRouter } from "@/navigation/routerNavigate";
import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Copy,
  ExternalLink,
  Eye,
  Filter,
  Info,
  Layers,
  Monitor,
  MonitorPlay,
  Plus,
  Search,
  Smartphone,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

/**
 * FaithHub — Beacon Marketplace
 * --------------------------------------
 * Premium placement and audience-planning surface for FaithHub Provider.
 *
 * Design goals
 * - Adapt the creator/e-commerce marketplace rhythm into a FaithHub promotional inventory experience.
 * - Use EVzone Green as the primary accent and EVzone Orange as the secondary accent.
 * - Keep the page strategic, visual, and “media-plan first” rather than feeling like a hidden backend form.
 * - Preserve an embedded preview workflow: inventory → placement preview → media plan → mobile preview.
 *
 * Notes
 * - Self-contained mock TSX page. Replace routing, persistence, pricing, and recommendation logic during integration.
 * - Tailwind-style utility classes assumed.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#0b1d49";

const ROUTES = {
  beaconBuilder: "/faithhub/provider/beacon-builder",
  beaconManager: "/faithhub/provider/beacon-manager",
  beaconDashboard: "/faithhub/provider/beacon-dashboard",
  providerDashboard: "/faithhub/provider/dashboard",
};

const HERO_HOME_FEED =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80";
const HERO_COUNTDOWN =
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80";
const HERO_REPLAY =
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1600&q=80";
const HERO_GIVING =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80";
const HERO_EVENTS =
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80";
const HERO_CLIP =
  "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1600&q=80";

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  navigateWithRouter(url);
}

function fmtInt(n: number) {
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function fmtCurrency(n: number, currency = "£") {
  return `${currency}${Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(n)}`;
}

function fmtPct(n: number, digits = 1) {
  return `${n.toFixed(digits)}%`;
}

type PreviewMode = "desktop" | "mobile";
type ObjectiveFilter =
  | "All"
  | "Awareness"
  | "Live attendance"
  | "Replay growth"
  | "Giving conversion"
  | "Charity momentum"
  | "Event registration"
  | "Product discovery";

type Accent = "green" | "orange" | "navy";
type PlacementType =
  | "Home feed"
  | "Live surface"
  | "Replay shelf"
  | "Giving spot"
  | "Event discovery"
  | "Premium takeover"
  | "Clip carousel";
type Availability = "Open" | "Limited" | "Reserved" | "High demand";

type InventoryPlacement = {
  id: string;
  title: string;
  subtitle: string;
  type: PlacementType;
  objective: ObjectiveFilter;
  accent: Accent;
  heroImageUrl: string;
  reach: number;
  price: number;
  ctrRange: string;
  expectedFit: string;
  seasonality: string;
  availability: Availability;
  pricingLogic: string;
  surfaces: string[];
  formats: string[];
  videoLengths: string[];
  subtitleExpectation: string;
  safeAreaRule: string;
  ctaRule: string;
  audiencePackageId: string;
  overlapRisk: number;
  competitionIndex: number;
  historicalWin: string;
  policyNote: string;
  detailNote: string;
};

type AudiencePackage = {
  id: string;
  name: string;
  subtitle: string;
  reachRange: string;
  seasonalityNote: string;
  pricingNote: string;
  performanceRange: string;
  fitTags: string[];
  accent: Accent;
};

type MediaPlanPlacement = {
  placementId: string;
  packageId: string;
};

const AUDIENCE_PACKAGES: AudiencePackage[] = [
  {
    id: "pkg_local_worship",
    name: "Local Worship Momentum",
    subtitle: "28k–44k matched users",
    reachRange: "28k–44k",
    seasonalityNote: "Strong around weekly services and city-specific moments.",
    pricingNote: "Efficient for local ministries with strong proximity intent.",
    performanceRange: "Best for live attendance",
    fitTags: ["Families", "Nearby attendees", "Weekly rhythm"],
    accent: "green",
  },
  {
    id: "pkg_youth_campus",
    name: "Youth & Campus Energy",
    subtitle: "18k–32k matched users",
    reachRange: "18k–32k",
    seasonalityNote: "Peaks during campus launch, weekends, and youth nights.",
    pricingNote: "Best value when paired with clips or countdown surfaces.",
    performanceRange: "Best for replay growth",
    fitTags: ["Youth", "Campus", "Short-form discovery"],
    accent: "orange",
  },
  {
    id: "pkg_families_community",
    name: "Families & Community",
    subtitle: "22k–38k matched users",
    reachRange: "22k–38k",
    seasonalityNote: "Performs well around events, prayer nights, and giving campaigns.",
    pricingNote: "Balanced reach and conversion quality.",
    performanceRange: "Best for event and giving campaigns",
    fitTags: ["Families", "Community", "Cause support"],
    accent: "navy",
  },
];

const INVENTORY_SEED: InventoryPlacement[] = [
  {
    id: "pl_home_feed_spotlight",
    title: "FaithHub Home Feed Spotlight",
    subtitle: "Feed inventory · Home feed",
    type: "Home feed",
    objective: "Awareness",
    accent: "green",
    heroImageUrl: HERO_HOME_FEED,
    reach: 52000,
    price: 420,
    ctrRange: "4.2%–5.1%",
    expectedFit: "Best for linked Live Sessions and replay launches.",
    seasonality: "Performs strongly on mid-week evenings and Sundays.",
    availability: "Open",
    pricingLogic: "Flat package + priority rotation.",
    surfaces: ["Home feed", "Followed tab", "Discovery rail"],
    formats: ["Static 1200×628", "Square 1080×1080", "Vertical 1080×1920"],
    videoLengths: ["6–15 sec", "15–20 sec"],
    subtitleExpectation: "Recommended for motion creative.",
    safeAreaRule: "Keep primary text within central 80%.",
    ctaRule: "One primary CTA. Avoid stacked donation + event asks.",
    audiencePackageId: "pkg_local_worship",
    overlapRisk: 18,
    competitionIndex: 44,
    historicalWin: "Highest awareness lift for weekly services.",
    policyNote: "Clear destination label required when promoting giving or ticketed sessions.",
    detailNote:
      "Premium awareness placement with large hero treatment across FaithHub home surfaces.",
  },
  {
    id: "pl_live_countdown_rail",
    title: "Live Sessions Countdown Rail",
    subtitle: "Live surface · Countdown rail",
    type: "Live surface",
    objective: "Live attendance",
    accent: "orange",
    heroImageUrl: HERO_COUNTDOWN,
    reach: 34000,
    price: 560,
    ctrRange: "5.1%–6.3%",
    expectedFit: "Best for same-day pushes and start-now reminders.",
    seasonality: "High-demand around weekend service clusters.",
    availability: "Limited",
    pricingLogic: "Scarce premium slots during high-traffic hours.",
    surfaces: ["Live hub", "Countdown cards", "Session launch rail"],
    formats: ["Static 1200×628", "Vertical 1080×1920"],
    videoLengths: ["6–12 sec"],
    subtitleExpectation: "Required for vertical video variants.",
    safeAreaRule: "Reserve lower 20% for countdown and action bar.",
    ctaRule: "CTA must point directly to live session or RSVP surface.",
    audiencePackageId: "pkg_youth_campus",
    overlapRisk: 34,
    competitionIndex: 71,
    historicalWin: "Strongest attendance conversion during the final 2 hours pre-live.",
    policyNote: "Countdown surfaces cannot be booked for expired sessions or replay-only destinations.",
    detailNote:
      "Urgency-led placement for last-mile attendance growth with premium countdown chrome.",
  },
  {
    id: "pl_replay_shelf_spotlight",
    title: "Replay Shelf Spotlight",
    subtitle: "Replay shelf · Replay spotlight",
    type: "Replay shelf",
    objective: "Replay growth",
    accent: "navy",
    heroImageUrl: HERO_REPLAY,
    reach: 28500,
    price: 390,
    ctrRange: "3.8%–4.9%",
    expectedFit: "Best for clips and replay packages with a clear next-step CTA.",
    seasonality: "Good always-on inventory outside peak live windows.",
    availability: "Open",
    pricingLogic: "Efficient evergreen replay package pricing.",
    surfaces: ["Replay shelves", "Continue watching", "Suggested watch"],
    formats: ["Static 1200×628", "Square 1080×1080", "Vertical 1080×1920"],
    videoLengths: ["10–20 sec"],
    subtitleExpectation: "Recommended for all motion placements.",
    safeAreaRule: "Allow room for progress ring and replay metadata chrome.",
    ctaRule: "CTA can drive replay, clip, Beacon follow-up, or giving tie-in.",
    audiencePackageId: "pkg_families_community",
    overlapRisk: 26,
    competitionIndex: 39,
    historicalWin: "Delivers strong secondary watch starts and follow adds.",
    policyNote: "Replay metadata must match the published FaithHub replay asset.",
    detailNote:
      "Premium replay inventory designed for long-tail post-live growth.",
  },
  {
    id: "pl_giving_momentum_card",
    title: "Giving Momentum Card",
    subtitle: "Giving spot · Cause momentum",
    type: "Giving spot",
    objective: "Giving conversion",
    accent: "green",
    heroImageUrl: HERO_GIVING,
    reach: 24000,
    price: 460,
    ctrRange: "4.5%–5.4%",
    expectedFit: "Works best for active funds and charity crowdfunds with social proof.",
    seasonality: "Strong during emergency response and end-of-month giving pushes.",
    availability: "Open",
    pricingLogic: "Cause package pricing with mission impact overlays.",
    surfaces: ["Giving hub", "Campaign cards", "Cause moments"],
    formats: ["Static 1200×628", "Square 1080×1080"],
    videoLengths: ["8–15 sec"],
    subtitleExpectation: "Recommended when using testimonial or field footage.",
    safeAreaRule: "Reserve right side for progress and donor-count modules.",
    ctaRule: "Donation CTA must use one clear ask with transparent destination copy.",
    audiencePackageId: "pkg_families_community",
    overlapRisk: 22,
    competitionIndex: 33,
    historicalWin: "Best for crowdfund milestone bursts and mission transparency cards.",
    policyNote: "Proof-of-impact assets required for premium cause placements.",
    detailNote:
      "Cause-led inventory with native progress and trust indicators.",
  },
  {
    id: "pl_event_discovery_pulse",
    title: "Event Discovery Pulse",
    subtitle: "Event discovery · Registration lift",
    type: "Event discovery",
    objective: "Event registration",
    accent: "orange",
    heroImageUrl: HERO_EVENTS,
    reach: 30500,
    price: 510,
    ctrRange: "4.0%–5.0%",
    expectedFit: "Ideal for conferences, retreats, baptisms, and one-off gatherings.",
    seasonality: "Higher demand around conferences and seasonal gatherings.",
    availability: "High demand",
    pricingLogic: "Timed packages around calendar windows and destination saturation.",
    surfaces: ["Event discovery", "Registration feeds", "Related events"],
    formats: ["Static 1200×628", "Square 1080×1080", "Vertical 1080×1920"],
    videoLengths: ["8–20 sec"],
    subtitleExpectation: "Required for audio-led event teaser clips.",
    safeAreaRule: "Keep bottom 22% clear for date and venue chips.",
    ctaRule: "CTA must point to registration or event detail page.",
    audiencePackageId: "pkg_local_worship",
    overlapRisk: 41,
    competitionIndex: 66,
    historicalWin: "Delivers reliable registration lift for local and regional events.",
    policyNote: "Event date accuracy is validated against the linked FaithHub event.",
    detailNote:
      "Calendar-aware event placement built for registration conversion.",
  },
  {
    id: "pl_clip_carousel_takeover",
    title: "Clip Carousel Takeover",
    subtitle: "Premium takeover · Discovery burst",
    type: "Premium takeover",
    objective: "Product discovery",
    accent: "navy",
    heroImageUrl: HERO_CLIP,
    reach: 68000,
    price: 980,
    ctrRange: "5.4%–7.1%",
    expectedFit: "Best for short-form discovery bursts and cross-object promotion.",
    seasonality: "Premium inventory tied to key platform traffic windows.",
    availability: "Reserved",
    pricingLogic: "Premium high-share-of-voice booking.",
    surfaces: ["Discovery hero", "Clip carousel", "Swipe stack"],
    formats: ["Vertical 1080×1920", "Square 1080×1080"],
    videoLengths: ["6–12 sec", "12–20 sec"],
    subtitleExpectation: "Mandatory for vertical video placements.",
    safeAreaRule: "Keep all key text above lower CTA shelf and away from edge rails.",
    ctaRule: "One CTA only. Product discovery or replay push recommended.",
    audiencePackageId: "pkg_youth_campus",
    overlapRisk: 49,
    competitionIndex: 83,
    historicalWin: "Top performer for short-format clip amplification.",
    policyNote: "Reserved inventory requires manual booking approval.",
    detailNote:
      "High-impact premium discovery surface with takeover treatment.",
  },
];

function accentColors(accent: Accent) {
  if (accent === "green") {
    return {
      solid: EV_GREEN,
      bg: "rgba(3,205,140,0.10)",
      border: "rgba(3,205,140,0.28)",
      text: EV_GREEN,
      deep: "#063b2e",
    };
  }
  if (accent === "orange") {
    return {
      solid: EV_ORANGE,
      bg: "rgba(247,127,0,0.10)",
      border: "rgba(247,127,0,0.28)",
      text: EV_ORANGE,
      deep: "#4f2a00",
    };
  }
  return {
    solid: EV_NAVY,
    bg: "rgba(11,29,73,0.10)",
    border: "rgba(11,29,73,0.22)",
    text: EV_NAVY,
    deep: EV_NAVY,
  };
}

function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green" | "orange" | "navy" | "good" | "warn";
}) {
  const cls =
    tone === "green"
      ? "border-[rgba(3,205,140,0.28)] bg-[rgba(3,205,140,0.10)] text-[#03cd8c]"
      : tone === "orange"
        ? "border-[rgba(247,127,0,0.28)] bg-[rgba(247,127,0,0.10)] text-[#f77f00]"
        : tone === "navy"
          ? "border-[rgba(11,29,73,0.20)] bg-[rgba(11,29,73,0.08)] text-[#0b1d49] dark:text-slate-100"
          : tone === "good"
            ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
            : tone === "warn"
              ? "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300"
              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300";
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold",
        cls,
      )}
    >
      {children}
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
        "inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-[12px] font-bold text-slate-800 dark:text-slate-100 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700",
        className,
      )}
    >
      {children}
    </button>
  );
}

function AccentButton({
  children,
  tone = "green",
  onClick,
  className,
}: {
  children: React.ReactNode;
  tone?: "green" | "orange" | "navy";
  onClick?: () => void;
  className?: string;
}) {
  const bg = tone === "green" ? EV_GREEN : tone === "orange" ? EV_ORANGE : EV_NAVY;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-2xl border border-transparent px-4 py-2 text-[12px] font-bold text-white transition-opacity hover:opacity-95",
        className,
      )}
      style={{ background: bg }}
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
        "rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-colors",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[16px] font-extrabold text-slate-900 dark:text-slate-100">
            {title}
          </div>
          {subtitle ? (
            <div className="mt-1 max-w-[560px] text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">
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

function PreviewShell({
  placement,
  audiencePackage,
  compact,
}: {
  placement: InventoryPlacement;
  audiencePackage?: AudiencePackage;
  compact?: boolean;
}) {
  const accent = accentColors(placement.accent);
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-[30px] bg-[#0b1d49] text-white",
        compact ? "h-[218px]" : "h-[240px]",
      )}
    >
      <img
        src={placement.heroImageUrl}
        alt={placement.title}
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1d49]/90 via-[#0b1d49]/70 to-[#03122d]/92" />
      <div
        className="absolute inset-x-4 bottom-5 rounded-[20px] border p-4"
        style={{
          background: `linear-gradient(180deg, ${accent.bg}, rgba(255,255,255,0.02))`,
          borderColor: accent.border,
        }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide"
            style={{ background: EV_ORANGE, color: "white" }}
          >
            Beacon
          </span>
          <span className="rounded-full bg-white/14 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white/90">
            {placement.type}
          </span>
          {audiencePackage ? (
            <span
              className="rounded-full px-3 py-1 text-[10px] font-bold"
              style={{ background: "rgba(3,205,140,0.18)", color: "white" }}
            >
              {audiencePackage.name}
            </span>
          ) : null}
        </div>
        <div className="mt-4 text-[18px] font-extrabold leading-tight sm:text-[20px]">
          Hope & Healing this Friday
        </div>
        <div className="mt-2 max-w-[520px] text-[12px] leading-relaxed text-white/80">
          New live session opens soon · set a reminder or start with the replay trail.
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-4 py-2 text-[12px] font-extrabold text-white"
            style={{ background: EV_GREEN }}
          >
            Open session
          </span>
          <span className="inline-flex items-center rounded-full bg-white/18 px-4 py-2 text-[12px] font-bold text-white">
            View details
          </span>
        </div>
      </div>
      <div className="absolute right-5 top-4 text-[11px] font-semibold uppercase tracking-wide text-white/80">
        FaithHub home feed
      </div>
    </div>
  );
}

function PhonePreview({
  placement,
  audiencePackage,
}: {
  placement: InventoryPlacement;
  audiencePackage?: AudiencePackage;
}) {
  return (
    <div className="mx-auto w-full max-w-[220px]">
      <div className="rounded-[36px] bg-slate-950 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.32)]">
        <div className="relative overflow-hidden rounded-[28px] bg-white dark:bg-slate-900">
          <div className="absolute left-1/2 top-0 z-20 h-5 w-16 -translate-x-1/2 rounded-b-2xl bg-black" />
          <div className="h-[208px] overflow-hidden bg-slate-50 dark:bg-slate-950">
            <div className="px-3 pt-6 pb-2">
              <div className="inline-flex rounded-full bg-[#f77f00] px-3 py-1 text-[10px] font-extrabold text-white">
                Beacon
              </div>
            </div>
            <div className="mx-3 overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-slate-100">
              <div className="relative h-[82px] overflow-hidden">
                <img
                  src={placement.heroImageUrl}
                  alt={placement.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#f77f00]/80 to-[#0b1d49]/35" />
                <div className="absolute inset-x-3 bottom-3 text-[11px] font-extrabold leading-tight text-white line-clamp-2">
                  Reserve your place for Friday’s live gathering.
                </div>
              </div>
              <div className="p-3">
                <div className="text-[10px] uppercase tracking-wide text-slate-400">
                  Audience package
                </div>
                <div className="mt-1 text-[12px] font-extrabold text-slate-900">
                  {audiencePackage?.name || "Families & Community"}
                </div>
                <div className="mt-1 text-[10px] text-slate-500">
                  CTR 4.5% · Reach 31.8k
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlacementDrawer({
  placement,
  audiencePackage,
  open,
  onClose,
  onAdd,
}: {
  placement?: InventoryPlacement;
  audiencePackage?: AudiencePackage;
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
}) {
  if (!open || !placement) return null;
  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-[760px] overflow-hidden border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl transition-colors">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 px-5 py-4">
          <div className="min-w-0">
            <div className="text-[15px] font-extrabold text-slate-900 dark:text-slate-100">
              Placement detail
            </div>
            <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
              Review performance examples, policy notes, and transfer to Beacon Builder.
            </div>
          </div>
          <SoftButton onClick={onClose}>Close</SoftButton>
        </div>
        <div className="h-[calc(100%-76px)] overflow-y-auto p-5">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_280px]">
            <SectionCard
              title={placement.title}
              subtitle={placement.detailNote}
              right={<Pill tone={placement.accent}>{placement.availability}</Pill>}
            >
              <PreviewShell placement={placement} audiencePackage={audiencePackage} />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3">
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">Historical win</div>
                  <div className="mt-2 text-[13px] font-bold text-slate-900 dark:text-slate-100">
                    {placement.historicalWin}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3">
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">Pricing logic</div>
                  <div className="mt-2 text-[13px] font-bold text-slate-900 dark:text-slate-100">
                    {placement.pricingLogic}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3 sm:col-span-2">
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">Policy note</div>
                  <div className="mt-2 text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
                    {placement.policyNote}
                  </div>
                </div>
              </div>
            </SectionCard>

            <div className="space-y-4">
              <SectionCard title="Accepted formats">
                <div className="flex flex-wrap gap-2">
                  {placement.formats.map((format) => (
                    <Pill key={format}>{format}</Pill>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Creative and CTA rules">
                <div className="space-y-3 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">Video length</div>
                    <div className="mt-1">{placement.videoLengths.join(" · ")}</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">Subtitle expectation</div>
                    <div className="mt-1">{placement.subtitleExpectation}</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">Safe area</div>
                    <div className="mt-1">{placement.safeAreaRule}</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">CTA rule</div>
                    <div className="mt-1">{placement.ctaRule}</div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Actions">
                <div className="grid gap-2">
                  <AccentButton tone="green" onClick={onAdd}>
                    <Plus className="h-4 w-4" /> Add to media plan
                  </AccentButton>
                  <AccentButton tone="orange" onClick={() => safeNav(ROUTES.beaconBuilder)}>
                    <Zap className="h-4 w-4" /> Transfer to Beacon Builder
                  </AccentButton>
                  <SoftButton
                    onClick={() => {
                      navigator.clipboard?.writeText(placement.title);
                    }}
                  >
                    <Copy className="h-4 w-4" /> Copy placement name
                  </SoftButton>
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BeaconMarketplacePage() {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [objectiveFilter, setObjectiveFilter] = useState<ObjectiveFilter>("All");
  const [search, setSearch] = useState("");
  const [selectedPlacementId, setSelectedPlacementId] = useState<string>(INVENTORY_SEED[0].id);
  const [selectedPackageId, setSelectedPackageId] = useState<string>(AUDIENCE_PACKAGES[0].id);
  const [mediaPlanName, setMediaPlanName] = useState("Beacon Marketplace Plan · Weekend Launch");
  const [mediaPlan, setMediaPlan] = useState<MediaPlanPlacement[]>([
    { placementId: "pl_home_feed_spotlight", packageId: "pkg_local_worship" },
    { placementId: "pl_replay_shelf_spotlight", packageId: "pkg_families_community" },
    { placementId: "pl_event_discovery_pulse", packageId: "pkg_local_worship" },
  ]);
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredInventory = useMemo(() => {
    return INVENTORY_SEED.filter((placement) => {
      const matchesObjective =
        objectiveFilter === "All" ? true : placement.objective === objectiveFilter;
      const haystack = `${placement.title} ${placement.subtitle} ${placement.type} ${placement.surfaces.join(" ")}`.toLowerCase();
      const matchesSearch = search.trim()
        ? haystack.includes(search.trim().toLowerCase())
        : true;
      return matchesObjective && matchesSearch;
    });
  }, [objectiveFilter, search]);

  const selectedPlacement = useMemo(
    () => INVENTORY_SEED.find((item) => item.id === selectedPlacementId) || INVENTORY_SEED[0],
    [selectedPlacementId],
  );

  const selectedPackage = useMemo(
    () => AUDIENCE_PACKAGES.find((pkg) => pkg.id === selectedPackageId) || AUDIENCE_PACKAGES[0],
    [selectedPackageId],
  );

  const selectedAccent = accentColors(selectedPlacement.accent);

  const mediaPlanRows = useMemo(() => {
    return mediaPlan
      .map((row) => {
        const placement = INVENTORY_SEED.find((p) => p.id === row.placementId);
        const audiencePackage = AUDIENCE_PACKAGES.find((p) => p.id === row.packageId);
        if (!placement || !audiencePackage) return null;
        return { placement, audiencePackage };
      })
      .filter(Boolean) as Array<{ placement: InventoryPlacement; audiencePackage: AudiencePackage }>;
  }, [mediaPlan]);

  const projectedReach = useMemo(
    () => mediaPlanRows.reduce((sum, row) => sum + row.placement.reach, 0),
    [mediaPlanRows],
  );
  const projectedSpend = useMemo(
    () => mediaPlanRows.reduce((sum, row) => sum + row.placement.price, 0),
    [mediaPlanRows],
  );
  const projectedCtr = useMemo(() => {
    if (!mediaPlanRows.length) return 0;
    return mediaPlanRows.reduce((sum, row) => {
      const range = row.placement.ctrRange.split("–")[0].replace("%", "");
      return sum + Number(range || 0);
    }, 0) / mediaPlanRows.length;
  }, [mediaPlanRows]);
  const projectedClicks = Math.round(projectedReach * (projectedCtr / 100));
  const projectedConversions = Math.round(projectedClicks * 0.03);

  const selectedBenchmark = 85;
  const altOne = 62;
  const altTwo = 48;

  const calendarRows = [
    { label: "Conference launch", state: "High demand" as Availability },
    { label: "Retreat season", state: "Open" as Availability },
    { label: "Year-end giving", state: "High demand" as Availability },
  ];

  function addSelectedToPlan() {
    setMediaPlan((prev) => {
      const exists = prev.some(
        (row) => row.placementId === selectedPlacement.id && row.packageId === selectedPackage.id,
      );
      if (exists) return prev;
      return [...prev, { placementId: selectedPlacement.id, packageId: selectedPackage.id }];
    });
  }

  function removePlanRow(placementId: string, packageId: string) {
    setMediaPlan((prev) =>
      prev.filter(
        (row) => !(row.placementId === placementId && row.packageId === packageId),
      ),
    );
  }

  return (
    <div
      className="min-h-screen w-full px-4 py-6 md:px-6 lg:px-8"
      style={{ background: EV_LIGHT }}
    >
      <div className="mx-auto w-full max-w-[1520px]">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
            <div className="min-w-0">
              <div className="text-[15px] font-black tracking-wide text-slate-500 dark:text-slate-400">
                Beacon Marketplace
              </div>
              <h1 className="mt-2 text-[28px] font-black leading-[1.04] tracking-[-0.03em] text-slate-900 dark:text-slate-100 sm:text-[34px] lg:text-[40px]">
                Premium inventory, audience packages, and media-plan building for Beacon campaigns across FaithHub surfaces.
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Pill tone="green">Inventory planning</Pill>
                <Pill tone="orange">Premium media plans</Pill>
                <Pill tone="navy">Transparent buying surfaces</Pill>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 xl:justify-end">
              <AccentButton tone="green" onClick={() => safeNav(ROUTES.beaconBuilder)}>
                <Plus className="h-4 w-4" /> New Ad
              </AccentButton>
              <AccentButton tone="orange">
                <Copy className="h-4 w-4" /> Save media plan
              </AccentButton>
              <SoftButton>
                <BadgeCheck className="h-4 w-4" /> Book placements
              </SoftButton>
              <SoftButton onClick={() => safeNav(ROUTES.beaconManager)}>
                <ExternalLink className="h-4 w-4" /> Open manager
              </SoftButton>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[450px_minmax(0,1fr)_326px]">
            <div className="space-y-4">
              <SectionCard
                title="Inventory catalog"
                subtitle="Browse feeds, discovery rails, live surfaces, replay shelves, event discovery, giving spots, and premium takeover opportunities."
                right={<Pill>{filteredInventory.length} results</Pill>}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 rounded-[22px] border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 px-4 py-3 transition-colors">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search placements, objectives, or surfaces"
                      className="w-full bg-transparent text-[13px] font-semibold text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      "Event registration",
                      "Live attendance",
                      "Replay growth",
                      "Giving conversion",
                    ].map((tag) => {
                      const active = objectiveFilter === tag;
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() =>
                            setObjectiveFilter((prev) =>
                              prev === tag ? "All" : (tag as ObjectiveFilter),
                            )
                          }
                          className={cx(
                            "rounded-full border px-3 py-1.5 text-[11px] font-bold transition-colors",
                            active
                              ? "border-[rgba(247,127,0,0.25)] bg-[rgba(247,127,0,0.10)] text-[#f77f00]"
                              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300",
                          )}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-3">
                    {filteredInventory.map((placement) => {
                      const active = placement.id === selectedPlacement.id;
                      const accent = accentColors(placement.accent);
                      const inPlan = mediaPlan.some(
                        (row) => row.placementId === placement.id && row.packageId === selectedPackage.id,
                      );

                      return (
                        <button
                          key={placement.id}
                          type="button"
                          onClick={() => setSelectedPlacementId(placement.id)}
                          className={cx(
                            "w-full rounded-[26px] border p-3 text-left transition-colors",
                            active
                              ? "border-[rgba(3,205,140,0.35)] bg-[rgba(3,205,140,0.08)]"
                              : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800",
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="grid h-16 w-16 shrink-0 place-items-center rounded-[18px] text-[13px] font-black"
                              style={{
                                background: accent.bg,
                                color: accent.text,
                                border: `1px solid ${accent.border}`,
                              }}
                            >
                              Preview
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100">
                                    {placement.title}
                                  </div>
                                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                                    {placement.subtitle}
                                  </div>
                                </div>
                                <Pill tone={placement.availability === "High demand" ? "orange" : placement.availability === "Limited" ? "warn" : placement.availability === "Reserved" ? "navy" : "green"}>
                                  {placement.availability}
                                </Pill>
                              </div>
                              <div className="mt-3 grid grid-cols-3 gap-3 text-[11px]">
                                <div>
                                  <div className="uppercase tracking-wide text-slate-400">Reach</div>
                                  <div className="mt-1 text-[12px] font-extrabold text-slate-900 dark:text-slate-100">
                                    {fmtInt(placement.reach)}
                                  </div>
                                </div>
                                <div>
                                  <div className="uppercase tracking-wide text-slate-400">Price</div>
                                  <div className="mt-1 text-[12px] font-extrabold text-slate-900 dark:text-slate-100">
                                    {fmtCurrency(placement.price)}
                                  </div>
                                </div>
                                <div>
                                  <div className="uppercase tracking-wide text-slate-400">CTR</div>
                                  <div className="mt-1 text-[12px] font-extrabold text-slate-900 dark:text-slate-100">
                                    {placement.ctrRange}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 flex items-center justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPlacementId(placement.id);
                                    setDetailOpen(true);
                                  }}
                                  className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-bold text-[#03cd8c]"
                                  style={{ borderColor: accent.border, background: accent.bg }}
                                >
                                  <Eye className="h-3.5 w-3.5" /> Open
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPlacementId(placement.id);
                                    addSelectedToPlan();
                                  }}
                                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-extrabold text-white"
                                  style={{ background: inPlan ? EV_ORANGE : EV_GREEN }}
                                >
                                  {inPlan ? "In plan" : "Add to plan"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </SectionCard>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2">
                {AUDIENCE_PACKAGES.slice(0, 2).map((pkg) => {
                  const accent = accentColors(pkg.accent);
                  const active = pkg.id === selectedPackage.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={cx(
                        "rounded-[24px] border p-4 text-left transition-colors",
                        active
                          ? "border-[rgba(3,205,140,0.35)] bg-[rgba(3,205,140,0.08)]"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
                      )}
                    >
                      <div
                        className="inline-flex rounded-full px-3 py-1 text-[11px] font-extrabold"
                        style={{
                          background: accent.bg,
                          color: accent.text,
                          border: `1px solid ${accent.border}`,
                        }}
                      >
                        {pkg.name}
                      </div>
                      <div className="mt-3 text-[13px] font-extrabold text-slate-900 dark:text-slate-100">
                        {pkg.subtitle}
                      </div>
                      <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                        {pkg.performanceRange}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <SectionCard
                title="Placement preview"
                subtitle="Preview selected inventory like a premium merchandising experience before handing it into Beacon Builder."
                right={
                  <div className="flex items-center gap-2">
                    <div className="inline-flex rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-1">
                      <button
                        type="button"
                        onClick={() => setPreviewMode("desktop")}
                        className={cx(
                          "rounded-full px-3 py-1.5 text-[11px] font-extrabold transition-colors",
                          previewMode === "desktop"
                            ? "text-white"
                            : "text-slate-600 dark:text-slate-300",
                        )}
                        style={previewMode === "desktop" ? { background: EV_GREEN } : undefined}
                      >
                        Desktop
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewMode("mobile")}
                        className={cx(
                          "rounded-full px-3 py-1.5 text-[11px] font-extrabold transition-colors",
                          previewMode === "mobile"
                            ? "text-white"
                            : "text-slate-600 dark:text-slate-300",
                        )}
                        style={previewMode === "mobile" ? { background: EV_ORANGE } : undefined}
                      >
                        Mobile
                      </button>
                    </div>
                    <SoftButton onClick={() => setDetailOpen(true)} className="px-3 py-2">
                      Placement detail
                    </SoftButton>
                  </div>
                }
              >
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px]">
                  <div>
                    {previewMode === "desktop" ? (
                      <PreviewShell placement={selectedPlacement} audiencePackage={selectedPackage} />
                    ) : (
                      <PhonePreview placement={selectedPlacement} audiencePackage={selectedPackage} />
                    )}
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Selected placement", value: selectedPlacement.title },
                      { label: "Audience package", value: selectedPackage.name },
                      { label: "Reach", value: fmtInt(selectedPlacement.reach) },
                      { label: "CTR", value: selectedPlacement.ctrRange },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="rounded-[20px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3"
                      >
                        <div className="text-[10px] uppercase tracking-wide text-slate-400">
                          {row.label}
                        </div>
                        <div className="mt-1 text-[14px] font-extrabold text-slate-900 dark:text-slate-100">
                          {row.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>

              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
                <SectionCard
                  title="Media plan builder"
                  subtitle="Combine placements, compare expected outcomes, save plan combinations, and hand them into Beacon Builder."
                >
                  <div className="space-y-3">
                    <div className="rounded-[20px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3">
                      <div className="text-[11px] uppercase tracking-wide text-slate-400">Plan name</div>
                      <input
                        value={mediaPlanName}
                        onChange={(e) => setMediaPlanName(e.target.value)}
                        className="mt-2 w-full bg-transparent text-[13px] font-extrabold text-slate-900 outline-none dark:text-slate-100"
                      />
                    </div>

                    <div className="space-y-3">
                      {mediaPlanRows.map(({ placement, audiencePackage }) => (
                        <div
                          key={`${placement.id}_${audiencePackage.id}`}
                          className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-[14px] font-extrabold text-slate-900 dark:text-slate-100">
                                {placement.title}
                              </div>
                              <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                                {placement.reach >= 1000 ? `${Math.round(placement.reach / 100) / 10}k projected reach` : `${placement.reach} projected reach`}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Pill tone={audiencePackage.accent}>{fmtCurrency(placement.price)}</Pill>
                              <button
                                type="button"
                                onClick={() => removePlanRow(placement.id, audiencePackage.id)}
                                className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-bold text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
                      {[
                        { label: "Projected reach", value: projectedReach >= 1000 ? `${Math.round(projectedReach / 100) / 10}k` : fmtInt(projectedReach) },
                        { label: "Projected spend", value: fmtCurrency(projectedSpend) },
                        { label: "Projected clicks", value: fmtInt(projectedClicks) },
                        { label: "Conversions", value: fmtInt(projectedConversions) },
                      ].map((metric) => (
                        <div
                          key={metric.label}
                          className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4"
                        >
                          <div className="text-[10px] uppercase tracking-wide text-slate-400">
                            {metric.label}
                          </div>
                          <div className="mt-2 text-[20px] font-black text-slate-900 dark:text-slate-100">
                            {metric.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <AccentButton tone="orange">
                        <Copy className="h-4 w-4" /> Save plan
                      </AccentButton>
                      <AccentButton tone="green" onClick={() => safeNav(ROUTES.beaconBuilder)}>
                        <Zap className="h-4 w-4" /> Send to Beacon Builder
                      </AccentButton>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard
                  title="Creative spec inspector"
                  subtitle="Accepted formats, safe areas, subtitle expectations, and CTA limitations for the selected placement."
                >
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedPlacement.formats.map((format) => (
                        <Pill key={format}>{format}</Pill>
                      ))}
                    </div>

                    <div className="space-y-4 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-slate-100">Video length</div>
                        <div className="mt-1">{selectedPlacement.videoLengths.join(" works best · ")} works best</div>
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-slate-100">Subtitle expectation</div>
                        <div className="mt-1">{selectedPlacement.subtitleExpectation}</div>
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-slate-100">Safe area</div>
                        <div className="mt-1">{selectedPlacement.safeAreaRule}</div>
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-slate-100">CTA rules</div>
                        <div className="mt-1">{selectedPlacement.ctaRule}</div>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">
                      Policy notes and performance examples are available in the placement detail drawer.
                    </div>
                  </div>
                </SectionCard>
              </div>
            </div>

            <div className="space-y-4">
              <SectionCard
                title="Mobile preview"
                subtitle="See how the selected placement feels on a mobile discovery surface."
              >
                <PhonePreview placement={selectedPlacement} audiencePackage={selectedPackage} />
              </SectionCard>

              <SectionCard
                title="Calendar & availability"
                subtitle="See high-demand periods, reserved inventory, and premium booking windows."
              >
                <div className="space-y-3">
                  {calendarRows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-3">
                      <div className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100">
                        {row.label}
                      </div>
                      <Pill tone={row.state === "High demand" ? "orange" : row.state === "Reserved" ? "navy" : "green"}>
                        {row.state}
                      </Pill>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard
                title="Benchmark & overlap"
                subtitle="Compare reach, competition, audience overlap, and saturation risk before buying."
              >
                <div className="space-y-4">
                  {[
                    { label: "Selected", value: selectedBenchmark, accent: EV_GREEN },
                    { label: "Alt: Replay shelf", value: altOne, accent: EV_NAVY },
                    { label: "Alt: Clip carousel", value: altTwo, accent: EV_ORANGE },
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="flex items-center justify-between gap-2 text-[12px] font-bold text-slate-700 dark:text-slate-300">
                        <span>{row.label}</span>
                        <span>{row.value}%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${row.value}%`, background: row.accent }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-4">
            {[
              {
                icon: Layers,
                title: "Inventory catalog",
                body: "Displays feeds, discovery rails, Live Sessions surfaces, replay shelves, event discovery, giving spots, and premium takeover opportunities.",
              },
              {
                icon: Filter,
                title: "Objective-based browsing",
                body: "Filters placements by awareness, live attendance, replay growth, giving conversion, charity momentum, event registration, or product discovery.",
              },
              {
                icon: Users,
                title: "Audience package cards",
                body: "Bundles placements with estimated fit, seasonality notes, pricing logic, and historical performance ranges.",
              },
              {
                icon: MonitorPlay,
                title: "Frictionless Builder handoff",
                body: "Moves selected placement plans directly into Beacon Builder without rebuilding the campaign.",
              },
            ].map((tile) => (
              <div
                key={tile.title}
                className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(3,205,140,0.12)] text-[#03cd8c]">
                  <tile.icon className="h-5 w-5" />
                </div>
                <div className="mt-3 text-[14px] font-extrabold text-slate-900 dark:text-slate-100">
                  {tile.title}
                </div>
                <div className="mt-2 text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {tile.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PlacementDrawer
        placement={selectedPlacement}
        audiencePackage={selectedPackage}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onAdd={() => {
          addSelectedToPlan();
          setDetailOpen(false);
        }}
      />
    </div>
  );
}






