// @ts-nocheck

"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  Globe2,
  Heart,
  Image as ImageIcon,
  Layers,
  Link2,
  Lock,
  Monitor,
  Palette,
  Play,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  Video,
  Wand2,
  X,
  Zap,
} from "lucide-react";

/**
 * FaithHub ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â FH-P-083 Beacon Builder
 * ----------------------------------
 * Premium dual-path campaign builder for linked and standalone Beacon campaigns.
 *
 * Intent
 * - Keep the premium creator/e-commerce Ad Builder rhythm from the uploaded base file.
 * - Use EVzone Green as primary and Orange as secondary.
 * - Treat linked and standalone Beacon campaigns as equal first-class creation paths.
 * - Preserve preview-first building, asset selection, pacing, approvals, and launch review.
 *
 * Notes
 * - Self-contained TSX mock for rapid product iteration.
 * - Replace route wiring, persistence, approvals, and asset APIs during integration.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#0b1d49";

const ROUTES = {
  beaconDashboard: "/faithhub/provider/beacon-dashboard",
  beaconMarketplace: "/faithhub/provider/beacon-marketplace",
  providerDashboard: "/faithhub/provider/dashboard",
};

const HERO_STANDALONE =
  "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1600&q=80";
const HERO_REPLAY =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80";
const HERO_LIVE =
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80";
const HERO_EVENT =
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80";
const HERO_CROWDFUND =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80";
const HERO_SERIES =
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1600&q=80";
const HERO_PRODUCT =
  "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=80";

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  if (typeof window === "undefined") return;
  window.location.assign(url);
}

function fmtInt(n: number) {
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function fmtCurrency(n: number, currency = "Ãƒâ€šÃ‚Â£") {
  return `${currency}${Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(n)}`;
}

function fmtPct(n: number, digits = 1) {
  return `${n.toFixed(digits)}%`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function pad2(n: number) {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}

function slugify(value: string) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function parseLocalDateTime(dateStr: string, timeStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
}

function toDateInputValue(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function toTimeInputValue(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

const TIME_OPTIONS = Array.from({ length: 24 * 12 }, (_, i) => `${pad2(Math.floor(i / 12))}:${pad2((i % 12) * 5)}`);


type Accent = "green" | "orange" | "navy";
type BuilderStep =
  | "objective"
  | "source"
  | "creative"
  | "destination"
  | "audience"
  | "placement"
  | "preview"
  | "review";
type PreviewMode = "desktop" | "mobile";
type ThemeMode = "light" | "dark";
type ObjectiveType =
  | "Awareness"
  | "Live attendance"
  | "Replay views"
  | "Giving"
  | "Charity momentum"
  | "Event registration"
  | "Product clicks"
  | "Institution visibility";
type SourceMode = "Linked" | "Standalone";
type SourceKind =
  | "Series"
  | "Episode"
  | "Live Session"
  | "Standalone Teaching"
  | "Replay"
  | "Clip"
  | "Event"
  | "Fund"
  | "Crowdfund"
  | "FaithMart Item";
type CreativeLayout =
  | "Image"
  | "Video"
  | "Countdown"
  | "Quote card"
  | "Story card"
  | "Static banner"
  | "Carousel"
  | "Mixed";
type DestinationType =
  | "FaithHub internal"
  | "Replay page"
  | "Event page"
  | "Giving page"
  | "Crowdfund page"
  | "FaithMart item"
  | "Approved external link";
type AgeRule = "General audience" | "Youth-safe" | "Child-safe";
type PlacementSurface =
  | "Home feed spotlight"
  | "Live countdown rail"
  | "Replay shelf spotlight"
  | "Story rail"
  | "Clip carousel"
  | "Giving momentum card"
  | "Event discovery hero"
  | "Search sponsorship";
type PacingMode = "Balanced" | "Accelerated" | "Guarded";

type ObjectiveOption = {
  id: ObjectiveType;
  subtitle: string;
  recommendation: string;
  accent: Accent;
  icon: React.ReactNode;
};

type SourceObject = {
  id: string;
  kind: SourceKind;
  title: string;
  subtitle: string;
  owner: string;
  language: string;
  status: string;
  recommendedObjective: ObjectiveType;
  heroImageUrl: string;
};

type AssetBankItem = {
  id: string;
  kind: "image" | "video";
  title: string;
  subtitle: string;
  accent: Accent;
  url: string;
};

type SurfaceOption = {
  id: PlacementSurface;
  subtitle: string;
  inventory: string;
  bestFor: ObjectiveType[];
  accent: Accent;
};

type BuilderState = {
  objective: ObjectiveType;
  sourceMode: SourceMode;
  sourceKind: SourceKind;
  sourceId: string;
  linkedSearch: string;

  campaignName: string;
  standaloneTitle: string;
  standaloneMessage: string;

  creativeLayout: CreativeLayout;
  heroImageId?: string;
  heroVideoId?: string;
  headline: string;
  body: string;
  quoteText: string;
  storyCardLabel: string;
  countdownEnabled: boolean;
  countdownEndISO: string;
  carouselCards: string[];
  subtitleMode: string;
  variantTesting: boolean;
  duplicateWinningCreative: boolean;

  ctaLabel: string;
  secondaryCtaLabel: string;
  destinationType: DestinationType;
  destinationUrl: string;
  fallbackDestination: string;
  conversionIntent: string;

  segments: string[];
  languages: string[];
  regions: string[];
  exclusions: string[];
  ageRule: AgeRule;
  childSafeNotes: string;

  placementSurfaces: PlacementSurface[];
  budget: number;
  dailyCap: number;
  pacing: PacingMode;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  seasonalBooking: string;
  mediaPlanName: string;

  internalApprovalRequired: boolean;
  qaRequired: boolean;
  policyNotes: string;
};

const OBJECTIVES: ObjectiveOption[] = [
  {
    id: "Awareness",
    subtitle: "Broad reach for announcements, prayer drives, and public awareness.",
    recommendation: "Best when the campaign needs broad visibility fast.",
    accent: "orange",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    id: "Live attendance",
    subtitle: "Drive people into upcoming live sessions and countdown surfaces.",
    recommendation: "Use countdowns and urgency-led copy for live attendance.",
    accent: "green",
    icon: <Monitor className="h-4 w-4" />,
  },
  {
    id: "Replay views",
    subtitle: "Lift replay watch starts, shelf discovery, and post-live retention.",
    recommendation: "Replay growth performs well with mixed and story-driven creative.",
    accent: "green",
    icon: <Play className="h-4 w-4" />,
  },
  {
    id: "Giving",
    subtitle: "Support funds, seasonal generosity, and direct donor response.",
    recommendation: "Pair strong CTA clarity with trust and destination confidence.",
    accent: "orange",
    icon: <Heart className="h-4 w-4" />,
  },
  {
    id: "Charity momentum",
    subtitle: "Build crowdfund urgency, milestones, and repeat social proof.",
    recommendation: "Use story cards, proof, and milestone momentum for best results.",
    accent: "orange",
    icon: <Bell className="h-4 w-4" />,
  },
  {
    id: "Event registration",
    subtitle: "Promote conferences, retreats, classes, and special gatherings.",
    recommendation: "Event campaigns work best with clear timing and destination context.",
    accent: "green",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "Product clicks",
    subtitle: "Drive product or package interest into approved FaithMart destinations.",
    recommendation: "Carousel and mixed formats typically perform best for products.",
    accent: "navy",
    icon: <Layers className="h-4 w-4" />,
  },
  {
    id: "Institution visibility",
    subtitle: "Promote the institution itself, a ministry lane, or a public message.",
    recommendation: "Ideal for standalone campaigns that are not tied to content.",
    accent: "navy",
    icon: <Globe2 className="h-4 w-4" />,
  },
];

const SOURCE_OBJECTS: SourceObject[] = [
  {
    id: "src_series_faith_work",
    kind: "Series",
    title: "Faith & Work",
    subtitle: "A premium teaching series helping the community apply faith in daily work life.",
    owner: "Teaching Team",
    language: "English",
    status: "Series published",
    recommendedObjective: "Awareness",
    heroImageUrl: HERO_SERIES,
  },
  {
    id: "src_episode_opening_doors",
    kind: "Episode",
    title: "Opening Doors with Wisdom",
    subtitle: "Episode 3 focused on discernment, testimony, and response moments.",
    owner: "Teaching Team",
    language: "English + Luganda",
    status: "Episode ready",
    recommendedObjective: "Replay views",
    heroImageUrl: HERO_SERIES,
  },
  {
    id: "src_live_friday_prayer",
    kind: "Live Session",
    title: "Friday Prayer & Worship Night",
    subtitle: "A live session with countdown momentum, worship, prayer, and prayer-request intake.",
    owner: "Live Production",
    language: "English",
    status: "Scheduled live",
    recommendedObjective: "Live attendance",
    heroImageUrl: HERO_LIVE,
  },
  {
    id: "src_teaching_boundaries",
    kind: "Standalone Teaching",
    title: "Healthy Boundaries in Ministry",
    subtitle: "A standalone teaching crafted outside any Series structure, ready for promotion.",
    owner: "Pastoral Team",
    language: "English",
    status: "Standalone teaching",
    recommendedObjective: "Replay views",
    heroImageUrl: HERO_REPLAY,
  },
  {
    id: "src_replay_sunday_encounter",
    kind: "Replay",
    title: "Sunday Encounter Replay",
    subtitle: "The replay destination with donor CTA, chapter markers, and next-step prompts.",
    owner: "Outreach Team",
    language: "English",
    status: "Replay published",
    recommendedObjective: "Replay views",
    heroImageUrl: HERO_REPLAY,
  },
  {
    id: "src_clip_60s_hope",
    kind: "Clip",
    title: "60-Second Hope Clip",
    subtitle: "Short-form clip optimized for discovery and linked replay growth.",
    owner: "Growth Team",
    language: "English",
    status: "Clip live",
    recommendedObjective: "Replay views",
    heroImageUrl: HERO_REPLAY,
  },
  {
    id: "src_event_youth_camp",
    kind: "Event",
    title: "Youth & Campus Weekend",
    subtitle: "A premium registration campaign for a live event with venue and sign-up urgency.",
    owner: "Events Team",
    language: "English",
    status: "Event open",
    recommendedObjective: "Event registration",
    heroImageUrl: HERO_EVENT,
  },
  {
    id: "src_fund_stewardship",
    kind: "Fund",
    title: "Faith & Mission Fund",
    subtitle: "Support ministry operations, pastoral care, and community support needs.",
    owner: "Finance Team",
    language: "English",
    status: "Fund active",
    recommendedObjective: "Giving",
    heroImageUrl: HERO_CROWDFUND,
  },
  {
    id: "src_crowdfund_relief",
    kind: "Crowdfund",
    title: "Harvest Relief Momentum",
    subtitle: "A charity crowdfunding story with proof of impact, milestones, and urgency updates.",
    owner: "Care & Missions",
    language: "English + Swahili",
    status: "Crowdfund active",
    recommendedObjective: "Charity momentum",
    heroImageUrl: HERO_CROWDFUND,
  },
  {
    id: "src_faithmart_bundle",
    kind: "FaithMart Item",
    title: "Prayer Journal Bundle",
    subtitle: "A shoppable FaithMart package ready for campaign-driven product discovery.",
    owner: "FaithMart",
    language: "English",
    status: "Item active",
    recommendedObjective: "Product clicks",
    heroImageUrl: HERO_PRODUCT,
  },
];

const ASSET_BANK: AssetBankItem[] = [
  {
    id: "asset_series_image",
    kind: "image",
    title: "Series hero frame",
    subtitle: "Warm premium hero for awareness and replay discovery.",
    accent: "green",
    url: HERO_SERIES,
  },
  {
    id: "asset_replay_image",
    kind: "image",
    title: "Replay spotlight frame",
    subtitle: "High-contrast cover for replay growth and clip crossover.",
    accent: "green",
    url: HERO_REPLAY,
  },
  {
    id: "asset_event_image",
    kind: "image",
    title: "Event conversion hero",
    subtitle: "Registration-led poster with premium urgency posture.",
    accent: "orange",
    url: HERO_EVENT,
  },
  {
    id: "asset_crowdfund_image",
    kind: "image",
    title: "Impact story hero",
    subtitle: "Proof-and-momentum artwork for giving and crowdfunding.",
    accent: "orange",
    url: HERO_CROWDFUND,
  },
  {
    id: "asset_standalone_image",
    kind: "image",
    title: "Standalone awareness hero",
    subtitle: "Strong general-purpose artwork for institution visibility and announcements.",
    accent: "navy",
    url: HERO_STANDALONE,
  },
  {
    id: "asset_replay_video",
    kind: "video",
    title: "Replay teaser motion",
    subtitle: "A 16:9 replay teaser with subtitle-ready framing.",
    accent: "green",
    url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: "asset_event_video",
    kind: "video",
    title: "Event countdown teaser",
    subtitle: "A 9:16 teaser suited to event countdown and story surfaces.",
    accent: "orange",
    url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/bee.mp4",
  },
  {
    id: "asset_story_video",
    kind: "video",
    title: "Story card motion",
    subtitle: "Narrative-led motion creative for standalone or charity campaigns.",
    accent: "navy",
    url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
];

const SEGMENTS = [
  "Followers",
  "Replay viewers",
  "Live attenders",
  "Frequent donors",
  "Event registrants",
  "Youth community",
  "Families & community",
  "New contacts",
  "Returning supporters",
  "Clip engagers",
];

const LANGUAGES = [
  "English",
  "Luganda",
  "Swahili",
  "French",
  "Arabic",
  "Portuguese",
];

const REGIONS = [
  "Uganda",
  "Kenya",
  "Rwanda",
  "Tanzania",
  "Global diaspora",
  "Europe",
  "North America",
  "West Africa",
];

const EXCLUSION_PRESETS = [
  "Exclude current live attenders",
  "Exclude replay completers",
  "Exclude recent donors",
  "Exclude recent event registrants",
  "Exclude last-7-day clickers",
  "Exclude youth audiences",
];

const SURFACES: SurfaceOption[] = [
  {
    id: "Home feed spotlight",
    subtitle: "Premium feed placement for broad awareness and click efficiency.",
    inventory: "Always on",
    bestFor: ["Awareness", "Institution visibility", "Replay views"],
    accent: "green",
  },
  {
    id: "Live countdown rail",
    subtitle: "Urgency-led countdown surface connected to upcoming live sessions.",
    inventory: "Medium demand",
    bestFor: ["Live attendance", "Event registration"],
    accent: "orange",
  },
  {
    id: "Replay shelf spotlight",
    subtitle: "High-context shelf inventory for replay and clip follow-through.",
    inventory: "Always on",
    bestFor: ["Replay views"],
    accent: "green",
  },
  {
    id: "Story rail",
    subtitle: "Immersive 9:16 story surface for updates, awareness, and urgency.",
    inventory: "High demand",
    bestFor: ["Awareness", "Charity momentum", "Live attendance"],
    accent: "orange",
  },
  {
    id: "Clip carousel",
    subtitle: "Short-form discovery surface with strong product and replay crossover.",
    inventory: "Always on",
    bestFor: ["Replay views", "Product clicks"],
    accent: "navy",
  },
  {
    id: "Giving momentum card",
    subtitle: "Purpose-built placement for fund and crowdfund conversion.",
    inventory: "Campaign driven",
    bestFor: ["Giving", "Charity momentum"],
    accent: "orange",
  },
  {
    id: "Event discovery hero",
    subtitle: "Premium booking inventory for flagship events and registrations.",
    inventory: "Seasonal",
    bestFor: ["Event registration"],
    accent: "green",
  },
  {
    id: "Search sponsorship",
    subtitle: "Intent-rich search result boost for discovery and institutional reach.",
    inventory: "Limited",
    bestFor: ["Institution visibility", "Product clicks"],
    accent: "navy",
  },
];

const STEPS: Array<{ id: BuilderStep; label: string; desc: string }> = [
  { id: "objective", label: "Objective", desc: "Choose the ministry or promotional goal." },
  { id: "source", label: "Source path", desc: "Linked mode or full standalone mode." },
  { id: "creative", label: "Creative", desc: "Build visuals, copy, countdowns, and variants." },
  { id: "destination", label: "CTA & destination", desc: "Set button labels, links, and fallback logic." },
  { id: "audience", label: "Audience", desc: "Segments, language, geography, and safety rules." },
  { id: "placement", label: "Placements", desc: "Inventory, timing, budget, pacing, and booking windows." },
  { id: "preview", label: "Preview", desc: "Review device, surface, and language realism." },
  { id: "review", label: "Launch gate", desc: "Approvals, policy notes, and final launch review." },
];

function accentColor(accent: Accent) {
  return accent === "green" ? EV_GREEN : accent === "orange" ? EV_ORANGE : EV_NAVY;
}

function accentSoft(accent: Accent) {
  const value = accentColor(accent);
  return `${value}22`;
}

function surfaceTone(surface: PlacementSurface) {
  const found = SURFACES.find((entry) => entry.id === surface);
  return found?.accent || "green";
}

function useToast() {
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2300);
    return () => window.clearTimeout(t);
  }, [toast]);
  return { toast, setToast };
}

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-5 left-1/2 z-[140] -translate-x-1/2 rounded-full bg-slate-950 px-4 py-2 text-[12px] font-semibold text-white shadow-xl ring-1 ring-white/10 dark:bg-slate-50 dark:text-slate-950 dark:ring-slate-200">
      {message}
    </div>
  );
}

function Pill({
  children,
  tone = "neutral",
  title,
}: {
  children?: React.ReactNode;
  tone?: "neutral" | "good" | "warn" | "bad" | "pro" | "brand";
  title?: string;
}) {
  const cls =
    tone === "good"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
      : tone === "warn"
        ? "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20"
        : tone === "bad"
          ? "bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20"
          : tone === "pro"
            ? "bg-violet-50 text-violet-800 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:ring-violet-500/20"
            : tone === "brand"
              ? "bg-slate-900 text-white ring-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:ring-slate-100"
              : "bg-slate-100 text-slate-800 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700";
  return (
    <span
      title={title}
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] sm:text-[11px] font-bold ring-1 whitespace-nowrap transition",
        cls,
      )}
    >
      {children}
    </span>
  );
}

function Btn({
  children,
  onClick,
  tone = "neutral",
  disabled,
  left,
  title,
  className,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  tone?: "neutral" | "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  left?: React.ReactNode;
  title?: string;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2 text-[12px] font-semibold transition focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed";
  const toneCls =
    tone === "primary"
      ? "text-white border-transparent"
      : tone === "secondary"
        ? "text-white border-transparent"
        : tone === "danger"
          ? "bg-rose-600 text-white border-transparent"
          : tone === "ghost"
            ? "bg-transparent border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800";
  const style =
    tone === "primary"
      ? { background: EV_ORANGE }
      : tone === "secondary"
        ? { background: EV_GREEN }
        : undefined;
  return (
    <button
      type="button"
      title={title}
      className={cx(base, toneCls, className)}
      style={style}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {left}
      {children}
    </button>
  );
}

function Section({
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
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">{title}</div>
          {subtitle ? (
            <div className="mt-0.5 text-[11px] leading-normal text-slate-500 dark:text-slate-400">
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

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        "rounded-3xl bg-white dark:bg-slate-950/80 p-3 ring-1 ring-slate-200 dark:ring-slate-800 transition-colors",
        className,
      )}
    >
      {children}
    </div>
  );
}

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <div>
      <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
        {label}
      </div>
      {hint ? <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{hint}</div> : null}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={cx(
        "mt-1 w-full rounded-2xl border bg-white dark:bg-slate-900 px-3 py-2 text-sm transition-colors outline-none",
        disabled
          ? "border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
          : "border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800",
      )}
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
      className="mt-1 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none transition-colors focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800"
    />
  );
}

function ToggleButton({
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
      onClick={() => onChange(!checked)}
      className={cx(
        "w-full rounded-2xl border p-3 text-left transition-colors",
        checked
          ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20"
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{label}</div>
          {hint ? <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{hint}</div> : null}
        </div>
        <span
          className={cx(
            "h-6 w-10 shrink-0 rounded-full border flex items-center px-1 transition-colors",
            checked
              ? "bg-emerald-500 border-emerald-500 justify-end"
              : "bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 justify-start",
          )}
        >
          <span className="h-4 w-4 rounded-full bg-white shadow" />
        </span>
      </div>
    </button>
  );
}

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const originalBodyOverflow = document.body.style.overflow;
    const originalDocOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalDocOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 bg-white dark:bg-slate-950 shadow-2xl flex flex-col transition-colors">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-3">
          <div className="truncate text-sm font-extrabold text-slate-900 dark:text-slate-100">{title}</div>
          <Btn tone="ghost" onClick={onClose} left={<X className="h-4 w-4" />}>
            Close
          </Btn>
        </div>
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
}

function DrawerShell({
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
    const originalBodyOverflow = document.body.style.overflow;
    const originalDocOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalDocOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[96]">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute top-0 right-0 bottom-0 w-full max-w-[1120px] bg-white dark:bg-slate-950 shadow-2xl flex flex-col transition-colors">
        <div className="flex items-start justify-between gap-2 border-b border-slate-200 dark:border-slate-800 px-4 py-3 shrink-0">
          <div className="min-w-0">
            <div className="truncate text-base font-extrabold text-slate-900 dark:text-slate-100">{title}</div>
            {subtitle ? <div className="truncate text-xs text-slate-600 dark:text-slate-400">{subtitle}</div> : null}
          </div>
          <Btn tone="ghost" onClick={onClose} left={<X className="h-4 w-4" />}>Close</Btn>
        </div>
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
}

function ScrollTimePicker({
  value,
  onChange,
  disabled,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((s) => !s)}
        className={cx(
          "w-full rounded-2xl bg-white dark:bg-slate-900 px-3 py-2 text-left text-sm ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate font-extrabold text-slate-900 dark:text-slate-100">{value || "Select time"}</div>
            {label ? <div className="truncate text-xs text-slate-600 dark:text-slate-400">{label}</div> : null}
          </div>
          <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        </div>
      </button>
      {open ? (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-xl ring-1 ring-slate-200 dark:ring-slate-700">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-3 py-2">
            <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100">Pick time</div>
            <button className="text-xs font-bold text-slate-500 dark:text-slate-400" onClick={() => setOpen(false)}>Close</button>
          </div>
          <div className="max-h-[240px] overflow-y-auto">
            {TIME_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => {
                  onChange(t);
                  setOpen(false);
                }}
                className={cx(
                  "flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                  t === value && "bg-slate-50 dark:bg-slate-800",
                )}
              >
                <span className="font-semibold text-slate-900 dark:text-slate-100">{t}</span>
                {t === value ? <Check className="h-4 w-4 text-slate-900 dark:text-slate-100" /> : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MetricTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card>
      <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-black text-slate-900 dark:text-slate-100">{value}</div>
      {hint ? <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</div> : null}
    </Card>
  );
}

function StepButton({
  active,
  label,
  desc,
  index,
  onClick,
}: {
  active: boolean;
  label: string;
  desc: string;
  index: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "w-full rounded-2xl border px-3 py-3 text-left transition-colors",
        active
          ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Step {index}</div>
          <div className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">{label}</div>
          <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{desc}</div>
        </div>
        {active ? <ChevronRight className="h-4 w-4 text-slate-500 dark:text-slate-400" /> : null}
      </div>
    </button>
  );
}

function AssetCard({
  asset,
  selected,
  onPick,
}: {
  asset: AssetBankItem;
  selected: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={cx(
        "rounded-3xl border p-3 text-left transition-colors",
        selected
          ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900",
      )}
    >
      <div className="relative overflow-hidden rounded-2xl bg-slate-950 text-white">
        <img src={asset.url} alt={asset.title} className="h-32 w-full object-cover opacity-90" />
        <div className="absolute left-2 top-2 flex gap-2">
          <Pill tone="brand">{asset.kind === "video" ? "Video" : "Image"}</Pill>
          <Pill tone={asset.accent === "green" ? "good" : asset.accent === "orange" ? "warn" : "pro"}>{asset.accent}</Pill>
        </div>
        {asset.kind === "video" ? (
          <div className="absolute inset-0 grid place-items-center">
            <div className="h-12 w-12 rounded-full bg-white/85 shadow grid place-items-center">
              <Play className="h-5 w-5 text-slate-900" />
            </div>
          </div>
        ) : null}
      </div>
      <div className="mt-3 text-sm font-black text-slate-900 dark:text-slate-100">{asset.title}</div>
      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{asset.subtitle}</div>
    </button>
  );
}

function BeaconPreviewCard({
  mode,
  theme,
  surface,
  builder,
  source,
  heroImageUrl,
  videoEnabled,
  showQuote,
  countdownLabel,
}: {
  mode: PreviewMode;
  theme: ThemeMode;
  surface: PlacementSurface;
  builder: BuilderState;
  source?: SourceObject;
  heroImageUrl: string;
  videoEnabled: boolean;
  showQuote: boolean;
  countdownLabel: string;
}) {
  const isDark = theme === "dark";
  const campaignTitle =
    builder.headline ||
    builder.campaignName ||
    (builder.sourceMode === "Standalone" ? builder.standaloneTitle : source?.title) ||
    "New Beacon campaign";

  const body =
    builder.body ||
    (builder.sourceMode === "Standalone"
      ? builder.standaloneMessage || "A premium standalone Beacon campaign with custom messaging and destination logic."
      : source?.subtitle || "Drive premium attention into the selected FaithHub object.");

  const cta = builder.ctaLabel || "Explore now";
  const secondary = builder.secondaryCtaLabel || "Save for later";
  const showCarousel = builder.creativeLayout === "Carousel" || builder.creativeLayout === "Mixed";
  const aspectClass =
    surface === "Story rail" || surface === "Live countdown rail"
      ? "aspect-[9/16]"
      : surface === "Clip carousel"
        ? "aspect-square"
        : "aspect-[16/9]";

  const surfaceAccent = accentColor(surfaceTone(surface));

  return (
    <div className={cx("overflow-hidden rounded-[28px] ring-1 shadow-sm", isDark ? "bg-slate-950 ring-slate-800" : "bg-white ring-slate-200")}>
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <Pill tone="brand">
            <Zap className="h-3.5 w-3.5" /> Beacon
          </Pill>
          <Pill>{surface}</Pill>
          <Pill tone="good">{builder.sourceMode}</Pill>
        </div>
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">
          {mode === "mobile" ? "Phone preview" : "Desktop preview"}
        </div>
      </div>

      <div className={cx(mode === "mobile" ? "max-w-[360px] md:max-w-[400px] mx-auto px-3 py-4" : "px-4 py-4")}>
        <div className={cx(mode === "mobile" ? "mx-auto max-w-[320px] md:max-w-[360px] rounded-[32px] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.24)]" : "rounded-[24px] p-3", isDark ? "bg-black" : "bg-slate-100")}>
          <div className={cx("overflow-hidden rounded-[24px]", isDark ? "bg-slate-950 text-slate-100" : "bg-white text-slate-900")}>
            <div className="relative">
              <div className={cx("w-full overflow-hidden", aspectClass)}>
                <img src={heroImageUrl} alt={campaignTitle} className="h-full w-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full px-2 py-1 text-[10px] font-bold text-white" style={{ background: surfaceAccent }}>
                  {builder.objective}
                </span>
                {builder.countdownEnabled || builder.creativeLayout === "Countdown" ? (
                  <Pill tone="warn">
                    <Bell className="h-3.5 w-3.5" /> {countdownLabel}
                  </Pill>
                ) : null}
                {source ? <Pill>{source.kind}</Pill> : <Pill>Standalone</Pill>}
              </div>

              <div className="absolute right-3 top-3 flex items-center gap-2">
                {videoEnabled ? (
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/85 shadow">
                    <Play className="h-5 w-5 text-slate-900" />
                  </span>
                ) : null}
              </div>

              {showQuote ? (
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <div className="max-w-[85%] text-lg font-black leading-tight drop-shadow">
                    ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ{builder.quoteText || "The next faithful move may be the one you almost postponed."}ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â
                  </div>
                </div>
              ) : null}
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.12em]" style={{ color: EV_GREY }}>FaithHub promo</div>
                  <div className="mt-1 text-lg font-black leading-tight">{campaignTitle}</div>
                </div>
                <Pill tone={builder.variantTesting ? "pro" : "neutral"}>{builder.variantTesting ? "A/B ready" : "Single variant"}</Pill>
              </div>

              <div className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{body}</div>

              {builder.creativeLayout === "Story card" ? (
                <div className="mt-3 rounded-2xl p-3 text-sm font-semibold" style={{ background: `${EV_GREEN}16`, color: isDark ? "#d1fae5" : EV_NAVY }}>
                  {builder.storyCardLabel || "Story card narrative Ãƒâ€šÃ‚Â· Why this message matters now"}
                </div>
              ) : null}

              {showCarousel ? (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {(builder.carouselCards.length ? builder.carouselCards : ["Message hook", "Impact proof", "Final CTA"]).slice(0, 3).map((card, idx) => (
                    <div key={`${card}_${idx}`} className="rounded-2xl p-2 ring-1 ring-slate-200 dark:ring-slate-800 bg-slate-50 dark:bg-slate-900">
                      <div className="aspect-square rounded-xl" style={{ background: `${idx % 2 === 0 ? EV_GREEN : EV_ORANGE}22` }} />
                      <div className="mt-2 text-xs font-bold line-clamp-2">{card || `Card ${idx + 1}`}</div>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button type="button" className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-black text-white" style={{ background: EV_GREEN }} onClick={handleRawPlaceholderAction}>
                  {cta}
                </button>
                <button type="button" className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-black text-slate-900 ring-1 ring-slate-200 dark:text-slate-100 dark:ring-slate-700" onClick={handleRawPlaceholderAction}>
                  {secondary}
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Pill>{builder.languages.join(" Ãƒâ€šÃ‚Â· ") || "English"}</Pill>
                <Pill>{builder.regions.slice(0, 2).join(" Ãƒâ€šÃ‚Â· ") || "Uganda"}</Pill>
                <Pill tone={builder.ageRule === "Child-safe" ? "good" : builder.ageRule === "Youth-safe" ? "warn" : "neutral"}>{builder.ageRule}</Pill>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BeaconBuilderPage({
  isDrawer = false,
  onClose,
}: {
  isDrawer?: boolean;
  onClose?: () => void;
}) {
  const { toast, setToast } = useToast();
  const [step, setStep] = useState<BuilderStep>("objective");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [assetDrawerTarget, setAssetDrawerTarget] = useState<"heroImage" | "heroVideo" | null>(null);

  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(18, 0, 0, 0);
    return d;
  }, []);
  const tomorrowEnd = useMemo(() => {
    const d = new Date(tomorrow);
    d.setHours(d.getHours() + 4);
    return d;
  }, [tomorrow]);
  const countdownDefault = useMemo(() => {
    const d = new Date(tomorrow);
    d.setMinutes(d.getMinutes() - 30);
    return d;
  }, [tomorrow]);

  const [builder, setBuilder] = useState<BuilderState>(() => ({
    objective: "Replay views",
    sourceMode: "Linked",
    sourceKind: "Replay",
    sourceId: "src_replay_sunday_encounter",
    linkedSearch: "",

    campaignName: "Sunday Replay Boost",
    standaloneTitle: "",
    standaloneMessage: "",

    creativeLayout: "Mixed",
    heroImageId: "asset_replay_image",
    heroVideoId: "asset_replay_video",
    headline: "Catch the message that moved the room.",
    body: "Replay the full teaching, share it with someone who needs it, and step into the next response moment while the message is still fresh.",
    quoteText: "Grace doesnÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢t wait for strength before it shows up.",
    storyCardLabel: "Why this replay matters now",
    countdownEnabled: false,
    countdownEndISO: countdownDefault.toISOString(),
    carouselCards: ["Key teaching moment", "Community response", "Watch the full replay"],
    subtitleMode: "Auto subtitles Ãƒâ€šÃ‚Â· English + Luganda",
    variantTesting: true,
    duplicateWinningCreative: true,

    ctaLabel: "Watch replay",
    secondaryCtaLabel: "Save for later",
    destinationType: "Replay page",
    destinationUrl: "/faithhub/replays/sunday-encounter",
    fallbackDestination: "/faithhub/provider",
    conversionIntent: "Replay watch start",

    segments: ["Replay viewers", "Followers"],
    languages: ["English", "Luganda"],
    regions: ["Uganda", "Global diaspora"],
    exclusions: ["Exclude replay completers"],
    ageRule: "General audience",
    childSafeNotes: "",

    placementSurfaces: ["Home feed spotlight", "Replay shelf spotlight", "Clip carousel"],
    budget: 420,
    dailyCap: 60,
    pacing: "Balanced",
    startDate: toDateInputValue(tomorrow),
    startTime: toTimeInputValue(tomorrow),
    endDate: toDateInputValue(tomorrowEnd),
    endTime: toTimeInputValue(tomorrowEnd),
    seasonalBooking: "Ordinary week",
    mediaPlanName: "Replay growth package",

    internalApprovalRequired: true,
    qaRequired: true,
    policyNotes:
      "Review all external destinations and confirm all giving or charity claims are evidence-backed.",
  }));

  const selectedSource = useMemo(
    () => SOURCE_OBJECTS.find((src) => src.id === builder.sourceId),
    [builder.sourceId],
  );

  const filteredSources = useMemo(() => {
    const q = builder.linkedSearch.trim().toLowerCase();
    return SOURCE_OBJECTS.filter((src) => {
      const kindOk = src.kind === builder.sourceKind;
      if (!kindOk) return false;
      if (!q) return true;
      return [src.title, src.subtitle, src.owner, src.language]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [builder.linkedSearch, builder.sourceKind]);

  const heroImage = useMemo(
    () =>
      ASSET_BANK.find((asset) => asset.id === builder.heroImageId && asset.kind === "image") ||
      ASSET_BANK.find((asset) => asset.kind === "image"),
    [builder.heroImageId],
  );
  const heroVideo = useMemo(
    () =>
      ASSET_BANK.find((asset) => asset.id === builder.heroVideoId && asset.kind === "video") ||
      ASSET_BANK.find((asset) => asset.kind === "video"),
    [builder.heroVideoId],
  );

  const startsAt = useMemo(
    () => parseLocalDateTime(builder.startDate, builder.startTime),
    [builder.startDate, builder.startTime],
  );
  const endsAt = useMemo(
    () => parseLocalDateTime(builder.endDate, builder.endTime),
    [builder.endDate, builder.endTime],
  );

  const countdownTarget = useMemo(() => new Date(builder.countdownEndISO), [builder.countdownEndISO]);
  const countdownDiffMs = Math.max(0, countdownTarget.getTime() - Date.now());
  const countdownHours = Math.floor(countdownDiffMs / (1000 * 60 * 60));
  const countdownMins = Math.floor((countdownDiffMs % (1000 * 60 * 60)) / (1000 * 60));
  const countdownLabel = `Starts in ${pad2(countdownHours)}:${pad2(countdownMins)}`;

  const summaryName =
    builder.campaignName ||
    (builder.sourceMode === "Standalone"
      ? builder.standaloneTitle || "New standalone Beacon"
      : selectedSource?.title || "New linked Beacon");

  const surfaceFocus = builder.placementSurfaces[0] || "Home feed spotlight";

  const simulation = useMemo(() => {
    const objectiveFactor: Record<ObjectiveType, number> = {
      Awareness: 1.28,
      "Live attendance": 1.02,
      "Replay views": 1.14,
      Giving: 0.88,
      "Charity momentum": 0.94,
      "Event registration": 0.93,
      "Product clicks": 1.08,
      "Institution visibility": 1.18,
    };
    const creativeFactor: Record<CreativeLayout, number> = {
      Image: 1,
      Video: 1.16,
      Countdown: 1.12,
      "Quote card": 0.96,
      "Story card": 1.04,
      "Static banner": 0.9,
      Carousel: 1.08,
      Mixed: 1.2,
    };
    const placementWeight = 0.82 + builder.placementSurfaces.length * 0.14;
    const baseReach =
      builder.budget *
      110 *
      placementWeight *
      objectiveFactor[builder.objective] *
      creativeFactor[builder.creativeLayout];
    const reach = Math.round(baseReach);
    const ctrBase =
      builder.objective === "Product clicks"
        ? 2.9
        : builder.objective === "Live attendance"
          ? 2.4
          : builder.objective === "Giving" || builder.objective === "Charity momentum"
            ? 1.8
            : 2.1;
    const ctr = clamp(
      ctrBase +
        (builder.variantTesting ? 0.3 : 0) +
        (builder.creativeLayout === "Video" || builder.creativeLayout === "Mixed" ? 0.25 : 0),
      1.2,
      4.9,
    );
    const clicks = Math.round(reach * (ctr / 100));
    const conversionRate =
      builder.objective === "Product clicks"
        ? 6.2
        : builder.objective === "Giving" || builder.objective === "Charity momentum"
          ? 5.4
          : builder.objective === "Event registration"
            ? 7.1
            : builder.objective === "Live attendance"
              ? 12.6
              : 8.1;
    const conversions = Math.max(1, Math.round(clicks * (conversionRate / 100)));
    const costPerResult = builder.budget / conversions;
    return {
      reach,
      ctr,
      clicks,
      conversions,
      costPerResult,
      qualityScore: clamp(
        71 +
          (builder.variantTesting ? 6 : 0) +
          (builder.duplicateWinningCreative ? 4 : 0) +
          (builder.sourceMode === "Standalone" ? 3 : 5),
        56,
        97,
      ),
    };
  }, [builder]);

  const preflight = useMemo(() => {
    const sourceReady =
      builder.sourceMode === "Standalone"
        ? Boolean(builder.standaloneTitle.trim() && builder.standaloneMessage.trim())
        : Boolean(selectedSource);
    const creativeReady = Boolean(heroImage?.url) && (builder.creativeLayout !== "Video" || Boolean(heroVideo?.url));
    const destinationReady = Boolean(
      builder.ctaLabel.trim() && builder.destinationUrl.trim() && builder.conversionIntent.trim(),
    );
    const audienceReady =
      builder.segments.length > 0 && builder.languages.length > 0 && builder.regions.length > 0;
    const timingReady = startsAt.getTime() < endsAt.getTime();
    const placementReady = builder.placementSurfaces.length > 0 && builder.budget > 0 && builder.dailyCap > 0;
    const approvalsReady = !builder.internalApprovalRequired || builder.qaRequired;
    return [
      { label: "Objective selected", ok: Boolean(builder.objective), detail: builder.objective },
      { label: "Source path ready", ok: sourceReady, detail: builder.sourceMode },
      { label: "Creative assets attached", ok: creativeReady, detail: builder.creativeLayout },
      { label: "CTA and destination configured", ok: destinationReady, detail: builder.destinationType },
      { label: "Audience and geography defined", ok: audienceReady, detail: `${builder.segments.length} segments` },
      { label: "Placement, budget, and schedule valid", ok: placementReady && timingReady, detail: `${builder.placementSurfaces.length} surfaces` },
      { label: "Policy and approvals ready", ok: approvalsReady, detail: builder.internalApprovalRequired ? "Approval required" : "No approval required" },
    ];
  }, [builder, selectedSource, heroImage, heroVideo, startsAt, endsAt]);

  const launchReady = preflight.every((item) => item.ok);

  const previewHeroUrl =
    builder.sourceMode === "Linked"
      ? heroImage?.url || selectedSource?.heroImageUrl || HERO_STANDALONE
      : heroImage?.url || HERO_STANDALONE;

  function setField<K extends keyof BuilderState>(key: K, value: BuilderState[K]) {
    setBuilder((prev) => ({ ...prev, [key]: value }));
  }

  function toggleFromList<T extends string>(current: T[], value: T, max = 99) {
    if (current.includes(value)) return current.filter((item) => item !== value);
    return [...current, value].slice(0, max);
  }

  function handleSaveDraft() {
    setToast(`Draft saved Ãƒâ€šÃ‚Â· ${summaryName}`);
  }

  function handleLaunch() {
    if (!launchReady) {
      setToast("Launch blocked Ãƒâ€šÃ‚Â· finish the launch gate checks first.");
      setStep("review");
      return;
    }
    setToast(`Beacon launched Ãƒâ€šÃ‚Â· ${summaryName}`);
  }

  function copyPreviewLink() {
    const slug = slugify(summaryName || "beacon-campaign");
    const url = `https://faithhub.app/beacon/preview/${slug}`;
    navigator.clipboard?.writeText(url).catch(() => undefined);
    setToast("Preview link copied");
  }

  const rightRail = (
    <div className="space-y-4">
      <Section
        title="Preview rail"
        subtitle="Surface-level realism for linked and standalone Beacon campaigns."
        right={
          <div className="flex items-center gap-2">
            <Btn tone={previewMode === "desktop" ? "primary" : "neutral"} onClick={() => setPreviewMode("desktop")}>Desktop</Btn>
            <Btn tone={previewMode === "mobile" ? "primary" : "neutral"} onClick={() => setPreviewMode("mobile")}>Mobile</Btn>
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Btn tone={themeMode === "light" ? "primary" : "neutral"} onClick={() => setThemeMode("light")}>Light</Btn>
          <Btn tone={themeMode === "dark" ? "primary" : "neutral"} onClick={() => setThemeMode("dark")}>Dark</Btn>
          <Btn tone="neutral" left={<Eye className="h-4 w-4" />} onClick={() => setPreviewOpen(true)}>
            Open full preview
          </Btn>
        </div>
        <BeaconPreviewCard
          mode={previewMode}
          theme={themeMode}
          surface={surfaceFocus}
          builder={builder}
          source={selectedSource}
          heroImageUrl={previewHeroUrl}
          videoEnabled={builder.creativeLayout === "Video" || builder.creativeLayout === "Mixed"}
          showQuote={builder.creativeLayout === "Quote card"}
          countdownLabel={countdownLabel}
        />
      </Section>

      <div className="grid grid-cols-2 gap-3">
        <MetricTile label="Estimated reach" value={fmtInt(simulation.reach)} hint="Blended forecast across selected surfaces" />
        <MetricTile label="CTR" value={fmtPct(simulation.ctr)} hint="Projected click-through rate" />
        <MetricTile label="Projected results" value={fmtInt(simulation.conversions)} hint={builder.conversionIntent} />
        <MetricTile label="Cost / result" value={fmtCurrency(simulation.costPerResult)} hint="Projected blended efficiency" />
      </div>

      <Section title="Optimization readiness" subtitle="Variant quality, pacing, and creative health at a glance.">
        <div className="grid gap-3">
          <Card>
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-sm font-black text-slate-900 dark:text-slate-100">Creative quality score</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Preview-driven confidence before spend begins.</div>
              </div>
              <div className="text-3xl font-black" style={{ color: EV_GREEN }}>{simulation.qualityScore}</div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${simulation.qualityScore}%`, background: EV_GREEN }} />
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-2 flex-wrap">
              <Pill tone={builder.variantTesting ? "pro" : "neutral"}>{builder.variantTesting ? "Variant testing on" : "Variant testing off"}</Pill>
              <Pill tone={builder.duplicateWinningCreative ? "good" : "neutral"}>{builder.duplicateWinningCreative ? "Duplicate winners" : "Manual creative rotation"}</Pill>
            </div>
            <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
              {builder.variantTesting
                ? "This campaign is launch-ready for structured learning and creative comparison."
                : "Turn on variant testing to unlock richer Beacon optimization after launch."}
            </div>
          </Card>
        </div>
      </Section>

      <Section title="Launch gate" subtitle="Every critical signal in one place.">
        <div className="space-y-2">
          {preflight.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2.5">
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.label}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.detail}</div>
              </div>
              <Pill tone={item.ok ? "good" : "warn"}>{item.ok ? "Ready" : "Needs work"}</Pill>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  function renderObjectiveStep() {
    return (
      <div className="space-y-4">
        <Section title="Objective selector" subtitle="Start with the real ministry or promotional goal so Beacon can shape everything downstream.">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {OBJECTIVES.map((obj) => {
              const active = builder.objective === obj.id;
              return (
                <button
                  key={obj.id}
                  type="button"
                  onClick={() => {
                    setField("objective", obj.id);
                    if (builder.sourceMode === "Linked" && selectedSource) {
                      setField(
                        "ctaLabel",
                        obj.id === "Live attendance"
                          ? "Join live"
                          : obj.id === "Giving" || obj.id === "Charity momentum"
                            ? "Give now"
                            : obj.id === "Event registration"
                              ? "Register now"
                              : obj.id === "Product clicks"
                                ? "View item"
                                : "Explore now",
                      );
                    }
                  }}
                  className={cx(
                    "rounded-3xl border p-4 text-left transition-colors",
                    active
                      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900",
                  )}
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-sm" style={{ background: accentColor(obj.accent) }}>
                    {obj.icon}
                  </div>
                  <div className="mt-3 text-base font-black text-slate-900 dark:text-slate-100">{obj.id}</div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">{obj.subtitle}</div>
                  <div className="mt-3 text-xs font-semibold" style={{ color: accentColor(obj.accent) }}>{obj.recommendation}</div>
                </button>
              );
            })}
          </div>
        </Section>

        <Section title="Campaign brief" subtitle="A short planning layer that keeps creative, audience, and destination aligned.">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <FieldLabel label="Campaign name" hint="Internal-facing name for planners and approvals" />
              <TextInput value={builder.campaignName} onChange={(v) => setField("campaignName", v)} placeholder="e.g. Sunday Replay Boost" />
            </div>
            <div>
              <FieldLabel label="Conversion intent" hint="The single most important result to optimize for" />
              <TextInput value={builder.conversionIntent} onChange={(v) => setField("conversionIntent", v)} placeholder="Replay watch start" />
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Card>
              <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Linked + standalone parity</div>
              <div className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">Both creation paths stay premium.</div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Beacon never forces content linking if your campaign is a pure announcement, awareness drive, or prayer message.</div>
            </Card>
            <Card>
              <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Recommended goal pairing</div>
              <div className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{builder.objective}</div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{OBJECTIVES.find((x) => x.id === builder.objective)?.recommendation}</div>
            </Card>
            <Card>
              <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Creative posture</div>
              <div className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{builder.creativeLayout}</div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Change later without losing the current preview state.</div>
            </Card>
          </div>
        </Section>
      </div>
    );
  }

  function renderSourceStep() {
    return (
      <div className="space-y-4">
        <Section
          title="Source mode chooser"
          subtitle="Choose between a linked FaithHub object and a completely standalone Beacon campaign."
          right={
            <div className="inline-flex rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 transition-colors">
              <button
                type="button"
                onClick={() => setField("sourceMode", "Linked")}
                className={cx(
                  "px-3 py-1.5 rounded-xl text-[12px] font-bold transition-colors",
                  builder.sourceMode === "Linked"
                    ? "text-white"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
                )}
                style={builder.sourceMode === "Linked" ? { background: EV_GREEN } : undefined}
              >
                Linked mode
              </button>
              <button
                type="button"
                onClick={() => setField("sourceMode", "Standalone")}
                className={cx(
                  "px-3 py-1.5 rounded-xl text-[12px] font-bold transition-colors",
                  builder.sourceMode === "Standalone"
                    ? "text-white"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
                )}
                style={builder.sourceMode === "Standalone" ? { background: EV_ORANGE } : undefined}
              >
                Standalone mode
              </button>
            </div>
          }
        >
          {builder.sourceMode === "Linked" ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {([
                  "Series",
                  "Episode",
                  "Live Session",
                  "Standalone Teaching",
                  "Replay",
                  "Clip",
                  "Event",
                  "Fund",
                  "Crowdfund",
                  "FaithMart Item",
                ] as SourceKind[]).map((kind) => {
                  const active = builder.sourceKind === kind;
                  return (
                    <button
                      key={kind}
                      type="button"
                      onClick={() => setField("sourceKind", kind)}
                      className={cx(
                        "rounded-full px-3 py-1.5 text-xs font-black ring-1 transition-colors",
                        active
                          ? "text-white"
                          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800",
                      )}
                      style={active ? { background: EV_GREEN, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)" } : undefined}
                    >
                      {kind}
                    </button>
                  );
                })}
              </div>
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_360px]">
                <div>
                  <FieldLabel label="Find source object" hint="Search inside the selected source type" />
                  <div className="mt-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      value={builder.linkedSearch}
                      onChange={(e) => setField("linkedSearch", e.target.value)}
                      placeholder="Search by title, owner, language, or subtitle"
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800"
                    />
                  </div>
                  <div className="mt-3 grid gap-3 max-h-[520px] overflow-y-auto pr-1">
                    {filteredSources.map((src) => {
                      const active = builder.sourceId === src.id;
                      return (
                        <button
                          key={src.id}
                          type="button"
                          onClick={() => {
                            setField("sourceId", src.id);
                            setField("campaignName", `${src.title} Ãƒâ€šÃ‚Â· Beacon`);
                            setField(
                              "headline",
                              src.recommendedObjective === "Live attendance"
                                ? `DonÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢t miss ${src.title}.`
                                : src.recommendedObjective === "Giving" || src.recommendedObjective === "Charity momentum"
                                  ? `Support ${src.title}.`
                                  : `Explore ${src.title}.`,
                            );
                            setField("body", src.subtitle);
                            if (!builder.heroImageId) {
                              const matchingImage = ASSET_BANK.find((a) => a.kind === "image");
                              if (matchingImage) setField("heroImageId", matchingImage.id);
                            }
                          }}
                          className={cx(
                            "rounded-3xl border p-3 text-left transition-colors",
                            active
                              ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20"
                              : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900",
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <img src={src.heroImageUrl} alt={src.title} className="h-20 w-20 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-800" />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="text-sm font-black text-slate-900 dark:text-slate-100">{src.title}</div>
                                <Pill>{src.kind}</Pill>
                              </div>
                              <div className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{src.subtitle}</div>
                              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <Pill>{src.status}</Pill>
                                <Pill>{src.owner}</Pill>
                                <Pill>{src.language}</Pill>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                    {!filteredSources.length ? (
                      <Card>
                        <div className="text-sm font-bold text-slate-900 dark:text-slate-100">No matching source objects</div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Try another source type or clear the search term.</div>
                      </Card>
                    ) : null}
                  </div>
                </div>
                <div>
                  <Card className="sticky top-4">
                    <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Selected source</div>
                    {selectedSource ? (
                      <>
                        <img src={selectedSource.heroImageUrl} alt={selectedSource.title} className="mt-3 aspect-[16/10] w-full rounded-2xl object-cover" />
                        <div className="mt-3 text-lg font-black text-slate-900 dark:text-slate-100">{selectedSource.title}</div>
                        <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">{selectedSource.subtitle}</div>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Pill>{selectedSource.kind}</Pill>
                          <Pill>{selectedSource.language}</Pill>
                          <Pill tone="good">Recommended: {selectedSource.recommendedObjective}</Pill>
                        </div>
                        <div className="mt-4 rounded-2xl p-3" style={{ background: `${EV_GREEN}16` }}>
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Linked campaigns stay context-rich.</div>
                          <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">FaithHub pulls source context, status, and conversion pathways into the campaign without flattening everything into generic ads.</div>
                        </div>
                      </>
                    ) : (
                      <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">Select a source object to continue.</div>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FieldLabel label="Standalone campaign title" hint="Public-facing name for this standalone Beacon" />
                <TextInput value={builder.standaloneTitle} onChange={(v) => setField("standaloneTitle", v)} placeholder="e.g. Prayer for the city this Friday" />
              </div>
              <div>
                <FieldLabel label="Campaign name" hint="Internal-facing planning label" />
                <TextInput value={builder.campaignName} onChange={(v) => setField("campaignName", v)} placeholder="e.g. City prayer awareness drive" />
              </div>
              <div className="md:col-span-2">
                <FieldLabel label="Standalone message brief" hint="The message, cause, or institution narrative that stands on its own" />
                <TextArea value={builder.standaloneMessage} onChange={(v) => setField("standaloneMessage", v)} rows={5} placeholder="Describe why this campaign exists, what people should respond to, and where it should send them." />
              </div>
              <Card>
                <div className="text-sm font-black text-slate-900 dark:text-slate-100">Standalone Beacon is first-class.</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Use this mode for institution awareness, public notices, prayer drives, seasonal calls, giving pushes, or campaigns that are not anchored to an existing FaithHub object.</div>
              </Card>
              <Card>
                <div className="text-sm font-black text-slate-900 dark:text-slate-100">Destination can still be rich.</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Standalone campaigns can still land on internal pages, event forms, giving surfaces, crowdfund destinations, or approved external links.</div>
              </Card>
            </div>
          )}
        </Section>
      </div>
    );
  }

  function renderCreativeStep() {
    const creativeLayouts: CreativeLayout[] = [
      "Image",
      "Video",
      "Countdown",
      "Quote card",
      "Story card",
      "Static banner",
      "Carousel",
      "Mixed",
    ];
    return (
      <div className="space-y-4">
        <Section title="Creative builder" subtitle="Build image, video, countdown, quote, story, carousel, or mixed Beacon creative with equal power for linked and standalone campaigns.">
          <div className="grid gap-3 md:grid-cols-4">
            {creativeLayouts.map((layout) => {
              const active = builder.creativeLayout === layout;
              return (
                <button
                  key={layout}
                  type="button"
                  onClick={() => setField("creativeLayout", layout)}
                  className={cx(
                    "rounded-3xl border p-3 text-left transition-colors",
                    active
                      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900",
                  )}
                >
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl text-white" style={{ background: layout === "Countdown" || layout === "Carousel" ? EV_ORANGE : EV_GREEN }}>
                    {layout === "Video" || layout === "Mixed" ? <Video className="h-4 w-4" /> : layout === "Carousel" ? <Layers className="h-4 w-4" /> : layout === "Quote card" ? <Sparkles className="h-4 w-4" /> : layout === "Countdown" ? <Bell className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                  </div>
                  <div className="mt-2 text-sm font-black text-slate-900 dark:text-slate-100">{layout}</div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {layout === "Image"
                      ? "Simple premium static creative"
                      : layout === "Video"
                        ? "Motion-led hero with CTA"
                        : layout === "Countdown"
                          ? "Urgency-led live countdown surface"
                          : layout === "Quote card"
                            ? "Text-forward quote or scripture card"
                            : layout === "Story card"
                              ? "Narrative-led story creative"
                              : layout === "Static banner"
                                ? "Compact banner slot for awareness"
                                : layout === "Carousel"
                                  ? "Multi-card discovery layout"
                                  : "Combined image, motion, and multi-card treatment"}
                  </div>
                </button>
              );
            })}
          </div>
        </Section>

        <Section title="Asset and copy system" subtitle="Attach the core visual system and write premium Beacon copy with variant-ready structure.">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <FieldLabel label="Hero image" hint="Primary image for banners, feed cards, and event-like surfaces" />
                  <div className="mt-2 overflow-hidden rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800">
                    <img src={heroImage?.url || previewHeroUrl} alt="Hero preview" className="aspect-[16/10] w-full object-cover" />
                  </div>
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <Btn left={<ImageIcon className="h-4 w-4" />} onClick={() => setAssetDrawerTarget("heroImage")}>Pick image</Btn>
                    <Pill>{heroImage?.title || "No image selected"}</Pill>
                  </div>
                </Card>
                <Card>
                  <FieldLabel label="Hero video" hint="Optional for video, mixed, or live teaser Beacon campaigns" />
                  <div className="mt-2 aspect-[16/10] rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800 bg-slate-100 dark:bg-slate-900 grid place-items-center overflow-hidden">
                    {heroVideo ? (
                      <div className="relative h-full w-full">
                        <img src={previewHeroUrl} alt="Video poster" className="h-full w-full object-cover opacity-80" />
                        <div className="absolute inset-0 grid place-items-center">
                          <div className="h-14 w-14 rounded-full bg-white/90 shadow grid place-items-center">
                            <Play className="h-6 w-6 text-slate-900" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center px-4">
                        <Video className="h-8 w-8 mx-auto text-slate-400" />
                        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">Add a teaser video for motion-first placements.</div>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <Btn left={<Video className="h-4 w-4" />} onClick={() => setAssetDrawerTarget("heroVideo")}>Pick video</Btn>
                    <Pill>{heroVideo?.title || "No video selected"}</Pill>
                  </div>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel label="Headline" hint="Primary promise or hook" />
                  <TextInput value={builder.headline} onChange={(v) => setField("headline", v)} placeholder="A premium hook people should click" />
                </div>
                <div>
                  <FieldLabel label="Subtitle mode" hint="How subtitles or localization notes appear in the creative package" />
                  <TextInput value={builder.subtitleMode} onChange={(v) => setField("subtitleMode", v)} placeholder="Auto subtitles Ãƒâ€šÃ‚Â· English + Luganda" />
                </div>
                <div className="md:col-span-2">
                  <FieldLabel label="Body copy" hint="Supportive message, context, or conversion framing" />
                  <TextArea value={builder.body} onChange={(v) => setField("body", v)} rows={5} placeholder="Write the supporting campaign copy here." />
                </div>
                <div>
                  <FieldLabel label="Quote text" hint="Used in quote-card and story-driven variants" />
                  <TextArea value={builder.quoteText} onChange={(v) => setField("quoteText", v)} rows={3} placeholder="The quote, scripture line, or core phrase." />
                </div>
                <div>
                  <FieldLabel label="Story card label" hint="Narrative signpost for story cards" />
                  <TextArea value={builder.storyCardLabel} onChange={(v) => setField("storyCardLabel", v)} rows={3} placeholder="Why this message matters now" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <ToggleButton
                  checked={builder.countdownEnabled}
                  onChange={(v) => setField("countdownEnabled", v)}
                  label="Countdown layer"
                  hint="Useful for live attendance and event urgency campaigns."
                />
                <ToggleButton
                  checked={builder.variantTesting}
                  onChange={(v) => setField("variantTesting", v)}
                  label="Variant testing"
                  hint="Create structured learning from multiple creative versions."
                />
                <ToggleButton
                  checked={builder.duplicateWinningCreative}
                  onChange={(v) => setField("duplicateWinningCreative", v)}
                  label="Duplicate winning creatives"
                  hint="Prepare the campaign for rule-based optimization once results appear."
                />
                <Card>
                  <FieldLabel label="Countdown target" hint="When the countdown ends for countdown-style creative" />
                  <input
                    type="datetime-local"
                    value={builder.countdownEndISO ? new Date(builder.countdownEndISO).toISOString().slice(0, 16) : ""}
                    onChange={(e) => setField("countdownEndISO", new Date(e.target.value).toISOString())}
                    className="mt-1 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                  />
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <FieldLabel label="Carousel cards" hint="Hook cards for carousel and mixed layouts" />
                <div className="mt-2 space-y-2">
                  {builder.carouselCards.map((card, idx) => (
                    <div key={`card_${idx}`} className="flex items-center gap-2">
                      <TextInput
                        value={card}
                        onChange={(v) => {
                          const next = [...builder.carouselCards];
                          next[idx] = v;
                          setField("carouselCards", next);
                        }}
                        placeholder={`Carousel card ${idx + 1}`}
                      />
                      <Btn
                        tone="ghost"
                        onClick={() => {
                          const next = builder.carouselCards.filter((_, i) => i !== idx);
                          setField("carouselCards", next.length ? next : [""]);
                        }}
                        left={<X className="h-4 w-4" />}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <Btn left={<Plus className="h-4 w-4" />} onClick={() => setField("carouselCards", [...builder.carouselCards, ""])}>Add card</Btn>
                </div>
              </Card>

              <Card>
                <div className="text-sm font-black text-slate-900 dark:text-slate-100">Creative strategy notes</div>
                <div className="mt-2 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div>ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ Countdown, quote cards, story cards, and carousel packages all stay available in both linked and standalone mode.</div>
                  <div>ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ Mixed layout lets you combine hero motion with multi-card support for modern feed surfaces.</div>
                  <div>ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ Preview is always live, so the Provider can understand exactly what audiences will see before spend begins.</div>
                </div>
              </Card>
            </div>
          </div>
        </Section>
      </div>
    );
  }

  function renderDestinationStep() {
    const destinationOptions: DestinationType[] = [
      "FaithHub internal",
      "Replay page",
      "Event page",
      "Giving page",
      "Crowdfund page",
      "FaithMart item",
      "Approved external link",
    ];
    return (
      <div className="space-y-4">
        <Section title="CTA and destination panel" subtitle="Define button text, deep links, fallback routing, and the conversion intent for this Beacon campaign.">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <FieldLabel label="Primary CTA label" hint="Main call-to-action button text" />
              <TextInput value={builder.ctaLabel} onChange={(v) => setField("ctaLabel", v)} placeholder="Watch replay" />
            </div>
            <div>
              <FieldLabel label="Secondary CTA label" hint="Optional secondary action" />
              <TextInput value={builder.secondaryCtaLabel} onChange={(v) => setField("secondaryCtaLabel", v)} placeholder="Save for later" />
            </div>
            <div>
              <FieldLabel label="Destination type" hint="Where the Beacon campaign should send people" />
              <div className="mt-2 flex flex-wrap gap-2">
                {destinationOptions.map((opt) => {
                  const active = builder.destinationType === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setField("destinationType", opt)}
                      className={cx(
                        "rounded-full px-3 py-1.5 text-xs font-black ring-1 transition-colors",
                        active
                          ? "text-white"
                          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800",
                      )}
                      style={active ? { background: EV_GREEN } : undefined}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <FieldLabel label="Conversion intent" hint="How success should be measured after click" />
              <TextInput value={builder.conversionIntent} onChange={(v) => setField("conversionIntent", v)} placeholder="Replay watch start" />
            </div>
            <div className="md:col-span-2">
              <FieldLabel label="Destination URL or internal path" hint="Deep link target for the campaign" />
              <TextInput value={builder.destinationUrl} onChange={(v) => setField("destinationUrl", v)} placeholder="/faithhub/replays/sunday-encounter" />
            </div>
            <div className="md:col-span-2">
              <FieldLabel label="Fallback destination" hint="Safe route if the primary destination is unavailable" />
              <TextInput value={builder.fallbackDestination} onChange={(v) => setField("fallbackDestination", v)} placeholder="/faithhub/provider" />
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Card>
              <div className="text-sm font-black text-slate-900 dark:text-slate-100">Deep-link confidence</div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Use internal FaithHub targets whenever possible for cleaner attribution and smoother conversion tracing.</div>
            </Card>
            <Card>
              <div className="text-sm font-black text-slate-900 dark:text-slate-100">Approved external targets</div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">External destinations should stay restricted, reviewed, and clearly visible in the launch gate.</div>
            </Card>
            <Card>
              <div className="text-sm font-black text-slate-900 dark:text-slate-100">Intent clarity</div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Beacon performs best when the CTA and the conversion intent describe the same expected user action.</div>
            </Card>
          </div>
        </Section>
      </div>
    );
  }

  function renderAudienceStep() {
    return (
      <div className="space-y-4">
        <Section title="Audience and geography workspace" subtitle="Choose who should see the ad by segment, language, region, age-safety, and exclusion logic.">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="space-y-4">
              <Card>
                <FieldLabel label="Segments" hint="Audience groups and engagement histories" />
                <div className="mt-3 flex flex-wrap gap-2">
                  {SEGMENTS.map((seg) => {
                    const active = builder.segments.includes(seg);
                    return (
                      <button
                        key={seg}
                        type="button"
                        onClick={() => setField("segments", toggleFromList(builder.segments, seg, 10))}
                        className={cx(
                          "rounded-full px-3 py-1.5 text-xs font-black ring-1 transition-colors",
                          active
                            ? "text-white"
                            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800",
                        )}
                        style={active ? { background: EV_GREEN } : undefined}
                      >
                        {seg}
                      </button>
                    );
                  })}
                </div>
              </Card>
              <Card>
                <FieldLabel label="Languages" hint="Localized Beacon delivery and creative variants" />
                <div className="mt-3 flex flex-wrap gap-2">
                  {LANGUAGES.map((lng) => {
                    const active = builder.languages.includes(lng);
                    return (
                      <button
                        key={lng}
                        type="button"
                        onClick={() => setField("languages", toggleFromList(builder.languages, lng, 6))}
                        className={cx(
                          "rounded-full px-3 py-1.5 text-xs font-black ring-1 transition-colors",
                          active
                            ? "text-white"
                            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800",
                        )}
                        style={active ? { background: EV_ORANGE } : undefined}
                      >
                        {lng}
                      </button>
                    );
                  })}
                </div>
              </Card>
              <Card>
                <FieldLabel label="Regions" hint="Regional targeting and diaspora overlays" />
                <div className="mt-3 flex flex-wrap gap-2">
                  {REGIONS.map((region) => {
                    const active = builder.regions.includes(region);
                    return (
                      <button
                        key={region}
                        type="button"
                        onClick={() => setField("regions", toggleFromList(builder.regions, region, 8))}
                        className={cx(
                          "rounded-full px-3 py-1.5 text-xs font-black ring-1 transition-colors",
                          active
                            ? "text-white"
                            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800",
                        )}
                        style={active ? { background: EV_NAVY } : undefined}
                      >
                        {region}
                      </button>
                    );
                  })}
                </div>
              </Card>
            </div>
            <div className="space-y-4">
              <Card>
                <FieldLabel label="Age-safe rule set" hint="Make sure Beacon respects audience protection constraints" />
                <div className="mt-3 flex flex-wrap gap-2">
                  {(["General audience", "Youth-safe", "Child-safe"] as AgeRule[]).map((rule) => {
                    const active = builder.ageRule === rule;
                    return (
                      <button
                        key={rule}
                        type="button"
                        onClick={() => setField("ageRule", rule)}
                        className={cx(
                          "rounded-full px-3 py-1.5 text-xs font-black ring-1 transition-colors",
                          active
                            ? "text-white"
                            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800",
                        )}
                        style={active ? { background: rule === "Child-safe" ? EV_GREEN : rule === "Youth-safe" ? EV_ORANGE : EV_NAVY } : undefined}
                      >
                        {rule}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3">
                  <FieldLabel label="Child-safe notes" hint="Optional safety guidance or campaign restrictions" />
                  <TextArea value={builder.childSafeNotes} onChange={(v) => setField("childSafeNotes", v)} rows={4} placeholder="Add age-safe or child-protection campaign notes if needed." />
                </div>
              </Card>
              <Card>
                <FieldLabel label="Exclusion logic" hint="Keep saturation, compliance, and fatigue under control" />
                <div className="mt-3 flex flex-wrap gap-2">
                  {EXCLUSION_PRESETS.map((preset) => {
                    const active = builder.exclusions.includes(preset);
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setField("exclusions", toggleFromList(builder.exclusions, preset, 8))}
                        className={cx(
                          "rounded-full px-3 py-1.5 text-xs font-black ring-1 transition-colors",
                          active
                            ? "text-white"
                            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800",
                        )}
                        style={active ? { background: EV_ORANGE } : undefined}
                      >
                        {preset}
                      </button>
                    );
                  })}
                </div>
              </Card>
              <Card>
                <div className="text-sm font-black text-slate-900 dark:text-slate-100">Audience summary</div>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {builder.segments.length || builder.languages.length || builder.regions.length
                    ? `This Beacon campaign currently targets ${builder.segments.length || 0} segment(s), ${builder.languages.length || 0} language variant(s), and ${builder.regions.length || 0} region layer(s).`
                    : "Add at least one segment, language, and region to create a safe premium delivery plan."}
                </div>
              </Card>
            </div>
          </div>
        </Section>
      </div>
    );
  }

  function renderPlacementStep() {
    return (
      <div className="space-y-4">
        <Section
          title="Placement and budget planner"
          subtitle="Choose premium inventory, budgets, pacing, schedule windows, and seasonal bookings."
          right={<Btn left={<ExternalLink className="h-4 w-4" />} onClick={() => safeNav(ROUTES.beaconMarketplace)}>Open Marketplace</Btn>}
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {SURFACES.map((surface) => {
              const active = builder.placementSurfaces.includes(surface.id);
              return (
                <button
                  key={surface.id}
                  type="button"
                  onClick={() => setField("placementSurfaces", toggleFromList(builder.placementSurfaces, surface.id, 8))}
                  className={cx(
                    "rounded-3xl border p-4 text-left transition-colors",
                    active
                      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900",
                  )}
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-white" style={{ background: accentColor(surface.accent) }}>
                    {surface.id === "Story rail" || surface.id === "Live countdown rail" ? <Video className="h-4 w-4" /> : surface.id === "Search sponsorship" ? <Search className="h-4 w-4" /> : <Layers className="h-4 w-4" />}
                  </div>
                  <div className="mt-3 text-sm font-black text-slate-900 dark:text-slate-100">{surface.id}</div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{surface.subtitle}</div>
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <Pill>{surface.inventory}</Pill>
                    <Pill tone="good">Best for {surface.bestFor[0]}</Pill>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FieldLabel label="Total budget" hint="Overall spend envelope for this Beacon campaign" />
                <TextInput value={String(builder.budget)} onChange={(v) => setField("budget", Number(v.replace(/[^\d.]/g, "") || 0))} placeholder="420" />
              </div>
              <div>
                <FieldLabel label="Daily cap" hint="Maximum average spend per day" />
                <TextInput value={String(builder.dailyCap)} onChange={(v) => setField("dailyCap", Number(v.replace(/[^\d.]/g, "") || 0))} placeholder="60" />
              </div>
              <div>
                <FieldLabel label="Pacing" hint="How aggressively Beacon should spend and learn" />
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["Balanced", "Accelerated", "Guarded"] as PacingMode[]).map((pacing) => {
                    const active = builder.pacing === pacing;
                    return (
                      <button
                        key={pacing}
                        type="button"
                        onClick={() => setField("pacing", pacing)}
                        className={cx(
                          "rounded-full px-3 py-1.5 text-xs font-black ring-1 transition-colors",
                          active
                            ? "text-white"
                            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800",
                        )}
                        style={active ? { background: pacing === "Accelerated" ? EV_ORANGE : pacing === "Guarded" ? EV_NAVY : EV_GREEN } : undefined}
                      >
                        {pacing}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <FieldLabel label="Media plan name" hint="Optional plan label to carry into Manager and Marketplace" />
                <TextInput value={builder.mediaPlanName} onChange={(v) => setField("mediaPlanName", v)} placeholder="Replay growth package" />
              </div>
              <div>
                <FieldLabel label="Start" hint="Campaign start window" />
                <div className="mt-1 grid grid-cols-[1fr_128px] gap-2">
                  <input type="date" value={builder.startDate} onChange={(e) => setField("startDate", e.target.value)} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100" />
                  <ScrollTimePicker value={builder.startTime} onChange={(v) => setField("startTime", v)} />
                </div>
              </div>
              <div>
                <FieldLabel label="End" hint="Campaign end window" />
                <div className="mt-1 grid grid-cols-[1fr_128px] gap-2">
                  <input type="date" value={builder.endDate} onChange={(e) => setField("endDate", e.target.value)} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100" />
                  <ScrollTimePicker value={builder.endTime} onChange={(v) => setField("endTime", v)} />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <Card>
                <FieldLabel label="Seasonal booking notes" hint="Optional note for premium inventory windows" />
                <TextArea value={builder.seasonalBooking} onChange={(v) => setField("seasonalBooking", v)} rows={4} placeholder="Ordinary week or high-season booking guidance" />
              </Card>
              <Card>
                <div className="text-sm font-black text-slate-900 dark:text-slate-100">Budget pacing summary</div>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{fmtCurrency(builder.budget)} total budget Ãƒâ€šÃ‚Â· {fmtCurrency(builder.dailyCap)} daily cap Ãƒâ€šÃ‚Â· {builder.placementSurfaces.length} selected surface(s)</div>
                <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${clamp((builder.dailyCap / Math.max(builder.budget, 1)) * 100, 5, 100)}%`, background: builder.pacing === "Accelerated" ? EV_ORANGE : builder.pacing === "Guarded" ? EV_NAVY : EV_GREEN }} />
                </div>
              </Card>
            </div>
          </div>
        </Section>
      </div>
    );
  }

  function renderPreviewStep() {
    return (
      <div className="space-y-4">
        <Section title="Preview and simulation suite" subtitle="See exactly how the campaign will look across placements, devices, themes, and language variants before launch.">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Btn tone={previewMode === "desktop" ? "primary" : "neutral"} onClick={() => setPreviewMode("desktop")}>Desktop frame</Btn>
            <Btn tone={previewMode === "mobile" ? "primary" : "neutral"} onClick={() => setPreviewMode("mobile")}>Phone frame</Btn>
            <Btn tone={themeMode === "light" ? "primary" : "neutral"} onClick={() => setThemeMode("light")}>Light theme</Btn>
            <Btn tone={themeMode === "dark" ? "primary" : "neutral"} onClick={() => setThemeMode("dark")}>Dark theme</Btn>
            <Btn tone="neutral" left={<Copy className="h-4 w-4" />} onClick={copyPreviewLink}>Copy preview link</Btn>
          </div>
          <BeaconPreviewCard
            mode={previewMode}
            theme={themeMode}
            surface={surfaceFocus}
            builder={builder}
            source={selectedSource}
            heroImageUrl={previewHeroUrl}
            videoEnabled={builder.creativeLayout === "Video" || builder.creativeLayout === "Mixed"}
            showQuote={builder.creativeLayout === "Quote card"}
            countdownLabel={countdownLabel}
          />
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <MetricTile label="Reach forecast" value={fmtInt(simulation.reach)} hint="Current preview setup" />
            <MetricTile label="Clicks" value={fmtInt(simulation.clicks)} hint="Projected from CTR" />
            <MetricTile label="Results" value={fmtInt(simulation.conversions)} hint={builder.conversionIntent} />
            <MetricTile label="Creative score" value={String(simulation.qualityScore)} hint="Preview-led quality signal" />
          </div>
        </Section>
      </div>
    );
  }

  function renderReviewStep() {
    return (
      <div className="space-y-4">
        <Section title="Policy, approvals, and launch gate" subtitle="Run the campaign through compliance notes, internal approval, quality checks, asset validation, and final launch confirmation.">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_360px]">
            <div className="space-y-4">
              <div className="grid gap-3">
                {preflight.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-black text-slate-900 dark:text-slate-100">{item.label}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{item.detail}</div>
                    </div>
                    <Pill tone={item.ok ? "good" : "warn"}>{item.ok ? "Ready" : "Needs work"}</Pill>
                  </div>
                ))}
              </div>
              <Card>
                <FieldLabel label="Policy and compliance notes" hint="Record anything the review team should confirm before launch" />
                <TextArea value={builder.policyNotes} onChange={(v) => setField("policyNotes", v)} rows={6} placeholder="List campaign policy notes, evidence checks, or approval instructions." />
              </Card>
              <div className="grid gap-3 md:grid-cols-2">
                <ToggleButton
                  checked={builder.internalApprovalRequired}
                  onChange={(v) => setField("internalApprovalRequired", v)}
                  label="Internal approval required"
                  hint="Use when leadership or communications review is mandatory."
                />
                <ToggleButton
                  checked={builder.qaRequired}
                  onChange={(v) => setField("qaRequired", v)}
                  label="Quality assurance check"
                  hint="Keep final asset, copy, and destination validation turned on."
                />
              </div>
            </div>
            <div className="space-y-4">
              <Card>
                <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Launch summary</div>
                <div className="mt-3 text-xl font-black text-slate-900 dark:text-slate-100">{summaryName}</div>
                <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">{builder.sourceMode === "Standalone" ? builder.standaloneMessage || "Standalone Beacon campaign" : selectedSource?.subtitle || "Linked Beacon campaign"}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Pill>{builder.objective}</Pill>
                  <Pill>{builder.destinationType}</Pill>
                  <Pill>{builder.placementSurfaces.length} surfaces</Pill>
                  <Pill tone={launchReady ? "good" : "warn"}>{launchReady ? "Launch-ready" : "Fix items"}</Pill>
                </div>
                <div className="mt-4 grid gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <div>Budget: <span className="font-semibold text-slate-900 dark:text-slate-100">{fmtCurrency(builder.budget)}</span></div>
                  <div>Dates: <span className="font-semibold text-slate-900 dark:text-slate-100">{builder.startDate} {builder.startTime} ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ {builder.endDate} {builder.endTime}</span></div>
                  <div>Primary CTA: <span className="font-semibold text-slate-900 dark:text-slate-100">{builder.ctaLabel}</span></div>
                  <div>Source mode: <span className="font-semibold text-slate-900 dark:text-slate-100">{builder.sourceMode}</span></div>
                </div>
              </Card>
              <Card>
                <div className="text-sm font-black text-slate-900 dark:text-slate-100">Next actions</div>
                <div className="mt-3 flex flex-col gap-2">
                  <Btn tone="secondary" left={<CheckCircle2 className="h-4 w-4" />} onClick={handleSaveDraft}>Save campaign draft</Btn>
                  <Btn tone="neutral" left={<Eye className="h-4 w-4" />} onClick={() => setPreviewOpen(true)}>Preview campaign</Btn>
                  <Btn tone="primary" left={<Zap className="h-4 w-4" />} onClick={handleLaunch}>Launch Beacon</Btn>
                </div>
              </Card>
            </div>
          </div>
        </Section>
      </div>
    );
  }

  function renderStepContent() {
    switch (step) {
      case "objective":
        return renderObjectiveStep();
      case "source":
        return renderSourceStep();
      case "creative":
        return renderCreativeStep();
      case "destination":
        return renderDestinationStep();
      case "audience":
        return renderAudienceStep();
      case "placement":
        return renderPlacementStep();
      case "preview":
        return renderPreviewStep();
      case "review":
        return renderReviewStep();
      default:
        return renderObjectiveStep();
    }
  }

  function goToNext() {
    const idx = STEPS.findIndex((entry) => entry.id === step);
    const next = STEPS[Math.min(STEPS.length - 1, idx + 1)];
    if (next) setStep(next.id);
  }

  function goToPrev() {
    const idx = STEPS.findIndex((entry) => entry.id === step);
    const prev = STEPS[Math.max(0, idx - 1)];
    if (prev) setStep(prev.id);
  }

  const content = (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors">
      <div className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur transition-colors">
        <div className="mx-auto max-w-[1680px] px-4 md:px-6 lg:px-8 py-3">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                <button className="hover:text-slate-700 dark:hover:text-slate-200" onClick={() => safeNav(ROUTES.providerDashboard)}>
                  FaithHub Provider
                </button>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <button className="hover:text-slate-700 dark:hover:text-slate-200" onClick={() => safeNav(ROUTES.beaconDashboard)}>
                  Beacon
                </button>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">Beacon Builder</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                  FH-P-083 Ãƒâ€šÃ‚Â· Beacon Builder
                </div>
                <Pill tone="brand"><Zap className="h-3.5 w-3.5" /> Beacon</Pill>
                <Pill tone="good">{builder.sourceMode}</Pill>
                <Pill tone="pro">Preview-first workflow</Pill>
              </div>
              <div className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-4xl">
                Create a premium Beacon campaign from scratch ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â linked to FaithHub content or fully standalone ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â with rich creative, audience logic, placement planning, and a launch-ready review flow.
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Btn tone="neutral" left={<ExternalLink className="h-4 w-4" />} onClick={() => safeNav(ROUTES.beaconMarketplace)}>
                Open Marketplace
              </Btn>
              <Btn tone="secondary" left={<CheckCircle2 className="h-4 w-4" />} onClick={handleSaveDraft}>
                Save campaign draft
              </Btn>
              <Btn tone="neutral" left={<Eye className="h-4 w-4" />} onClick={() => setPreviewOpen(true)}>
                Preview campaign
              </Btn>
              <Btn tone="primary" left={<Zap className="h-4 w-4" />} onClick={handleLaunch}>
                Launch Beacon
              </Btn>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1680px] px-4 md:px-6 lg:px-8 py-4 lg:py-6">
        <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_420px]">
          <div className="space-y-4 xl:sticky xl:top-[106px] self-start">
            <Section title="Builder steps" subtitle="Preview-driven creation from objective to launch gate.">
              <div className="space-y-2">
                {STEPS.map((entry, idx) => (
                  <StepButton
                    key={entry.id}
                    active={step === entry.id}
                    label={entry.label}
                    desc={entry.desc}
                    index={idx + 1}
                    onClick={() => setStep(entry.id)}
                  />
                ))}
              </div>
            </Section>
            <Section title="Campaign posture" subtitle="Quick signals while you build.">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Pill tone="brand">{builder.objective}</Pill>
                  <Pill>{builder.creativeLayout}</Pill>
                  <Pill>{builder.placementSurfaces.length} surfaces</Pill>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Linked and standalone campaigns share the same premium builder surface, creative depth, and preview realism.
                </div>
              </div>
            </Section>
          </div>

          <div className="space-y-4">
            {renderStepContent()}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 transition-colors">
              <Btn tone="ghost" left={<ChevronRight className="h-4 w-4 rotate-180" />} onClick={goToPrev} disabled={step === STEPS[0].id}>
                Previous step
              </Btn>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {STEPS.findIndex((entry) => entry.id === step) + 1} of {STEPS.length} Ãƒâ€šÃ‚Â· {STEPS.find((entry) => entry.id === step)?.label}
              </div>
              <Btn tone="primary" left={<ChevronRight className="h-4 w-4" />} onClick={step === "review" ? handleLaunch : goToNext}>
                {step === "review" ? "Launch Beacon" : "Next step"}
              </Btn>
            </div>
          </div>

          <div className="space-y-4 xl:sticky xl:top-[106px] self-start">
            {rightRail}
          </div>
        </div>
      </div>

      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title="Beacon preview suite">
        <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-4">
            <Section title="Preview controls" subtitle="Stress-test the campaign across devices and themes before launch.">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Btn tone={previewMode === "desktop" ? "primary" : "neutral"} onClick={() => setPreviewMode("desktop")} left={<Monitor className="h-4 w-4" />}>Desktop</Btn>
                  <Btn tone={previewMode === "mobile" ? "primary" : "neutral"} onClick={() => setPreviewMode("mobile")} left={<Smartphone className="h-4 w-4" />}>Mobile</Btn>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Btn tone={themeMode === "light" ? "primary" : "neutral"} onClick={() => setThemeMode("light")}>Light</Btn>
                  <Btn tone={themeMode === "dark" ? "primary" : "neutral"} onClick={() => setThemeMode("dark")}>Dark</Btn>
                </div>
                <div className="flex flex-wrap gap-2">
                  {builder.placementSurfaces.map((surface) => (
                    <Pill key={surface}>{surface}</Pill>
                  ))}
                </div>
              </div>
            </Section>
            <Section title="Launch context" subtitle="A quick read on the campaign before it goes live.">
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <div><span className="font-semibold text-slate-900 dark:text-slate-100">Campaign:</span> {summaryName}</div>
                <div><span className="font-semibold text-slate-900 dark:text-slate-100">Source path:</span> {builder.sourceMode}</div>
                <div><span className="font-semibold text-slate-900 dark:text-slate-100">Conversion intent:</span> {builder.conversionIntent}</div>
                <div><span className="font-semibold text-slate-900 dark:text-slate-100">Destination:</span> {builder.destinationType}</div>
              </div>
            </Section>
          </div>
          <div className="space-y-4">
            <BeaconPreviewCard
              mode={previewMode}
              theme={themeMode}
              surface={surfaceFocus}
              builder={builder}
              source={selectedSource}
              heroImageUrl={previewHeroUrl}
              videoEnabled={builder.creativeLayout === "Video" || builder.creativeLayout === "Mixed"}
              showQuote={builder.creativeLayout === "Quote card"}
              countdownLabel={countdownLabel}
            />
            <div className="grid gap-4 md:grid-cols-3">
              <MetricTile label="Reach" value={fmtInt(simulation.reach)} hint="Projection" />
              <MetricTile label="CTR" value={fmtPct(simulation.ctr)} hint="Projection" />
              <MetricTile label="Results" value={fmtInt(simulation.conversions)} hint={builder.conversionIntent} />
            </div>
          </div>
        </div>
      </Modal>

      <DrawerShell
        open={assetDrawerTarget !== null}
        onClose={() => setAssetDrawerTarget(null)}
        title={assetDrawerTarget === "heroImage" ? "Asset bank Ãƒâ€šÃ‚Â· Hero image" : "Asset bank Ãƒâ€šÃ‚Â· Hero video"}
        subtitle="Pick approved Beacon assets without breaking the current build context."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ASSET_BANK.filter((asset) =>
            assetDrawerTarget === "heroImage" ? asset.kind === "image" : asset.kind === "video",
          ).map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              selected={assetDrawerTarget === "heroImage" ? builder.heroImageId === asset.id : builder.heroVideoId === asset.id}
              onPick={() => {
                if (assetDrawerTarget === "heroImage") setField("heroImageId", asset.id);
                if (assetDrawerTarget === "heroVideo") setField("heroVideoId", asset.id);
                setAssetDrawerTarget(null);
                setToast(`Asset selected Ãƒâ€šÃ‚Â· ${asset.title}`);
              }}
            />
          ))}
        </div>
      </DrawerShell>

      {toast ? <Toast message={toast} /> : null}
    </div>
  );

  if (isDrawer) {
    return (
      <DrawerShell
        open={true}
        onClose={onClose || (() => undefined)}
        title="Beacon Builder"
        subtitle="Linked + standalone premium Beacon campaign creation"
      >
        {content}
      </DrawerShell>
    );
  }

  return content;
}


