// @ts-nocheck

"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Bell,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  Filter,
  Gift,
  Image as ImageIcon,
  Layers,
  Link2,
  Megaphone,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Users,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import { handleRawPlaceholderAction } from "./placeholderActions";
import { KpiTile } from "../../../components/ui/KpiTile";
import { navigateWithRouter } from "@/navigation/routerNavigate";

/**
 * FaithHub — Merchandise Manager
 * ---------------------------------------
 * Premium Provider-side control surface for FaithMart merchandise:
 * apparel, gifts, journals, worship essentials, event kits, and community bundles.
 *
 * Design intent
 * - Keep the same premium creator-style language used across the Provider experience.
 * - Make Merchandise Manager the operational catalog page.
 * - Route creation into a dedicated + New Merchandise builder page.
 * - Keep live, events, giving, and Beacon links visible so merchandise can plug directly
 *   into the wider FaithHub system.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#0f172a";

const ROUTES = {
  providerDashboard: "/faithhub/provider/dashboard",
  merchandiseBuilder: "/faithhub/provider/new-merchandise",
  beaconBuilder: "/faithhub/provider/beacon-builder",
  liveBuilder: "/faithhub/provider/live-builder",
  eventsManager: "/faithhub/provider/events-manager",
  faithMartStorefront: "/faithmart/storefront",
};

const HERO_1 =
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80";
const HERO_2 =
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1600&q=80";
const HERO_3 =
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80";
const HERO_4 =
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80";
const HERO_5 =
  "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1600&q=80";
const HERO_6 =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80";

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  navigateWithRouter(url);
}

function fmtInt(n: number) {
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function money(n: number, currency = "$") {
  return `${currency}${Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(n)}`;
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function pct(value: number, total: number) {
  if (!total) return 0;
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}

type MerchandiseStatus = "Draft" | "Ready" | "Published" | "Archived" | "Sold Out";
type MerchandiseKind =
  | "Apparel"
  | "Gift"
  | "Journal"
  | "Worship Essential"
  | "Event Kit"
  | "Accessory";
type VisibilityModel = "Public" | "Follower-first" | "Event-only" | "Internal";
type PreviewMode = "desktop" | "mobile";
type MerchandiseCollection =
  | "Sunday Essentials"
  | "Conference Merch"
  | "Prayer & Journaling"
  | "Seasonal Gifts"
  | "Youth Merch";

type HookItem = {
  id: string;
  label: string;
  hint: string;
  status: "Ready" | "Draft" | "Pending";
};

type MerchandiseRecord = {
  id: string;
  title: string;
  subtitle: string;
  kind: MerchandiseKind;
  status: MerchandiseStatus;
  visibility: VisibilityModel;
  collection: MerchandiseCollection;
  imageUrl: string;
  summary: string;
  tags: string[];
  variants: string[];
  campus: string;
  owner: string;
  updatedISO: string;
  storefrontReady: boolean;
  mediaReady: boolean;
  fulfillmentReady: boolean;
  linkedLive: boolean;
  linkedEvents: number;
  linkedBeacon: boolean;
  linkedGiving: boolean;
  inventory: number;
  reserved: number;
  sold: number;
  orders: number;
  revenue: number;
  priceLabel: string;
  conversionRate: number;
  featured: boolean;
  hooks: HookItem[];
  quote: string;
};

const MERCHANDISE: MerchandiseRecord[] = [
  {
    id: "merch-hoodie",
    title: "FaithHub Community Hoodie",
    subtitle: "Premium heavyweight pullover for services, teams, and community drops.",
    kind: "Apparel",
    status: "Published",
    visibility: "Public",
    collection: "Sunday Essentials",
    imageUrl: HERO_1,
    summary:
      "A premium community hoodie designed for worship teams, youth leaders, and everyday FaithHub brand presence.",
    tags: ["hoodie", "community", "winter"],
    variants: ["S", "M", "L", "XL", "Black", "Forest"],
    campus: "Main campus",
    owner: "FaithMart Team",
    updatedISO: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    storefrontReady: true,
    mediaReady: true,
    fulfillmentReady: true,
    linkedLive: true,
    linkedEvents: 2,
    linkedBeacon: true,
    linkedGiving: false,
    inventory: 28,
    reserved: 7,
    sold: 142,
    orders: 96,
    revenue: 5480,
    priceLabel: "$39 standard / $34 supporter",
    conversionRate: 6.4,
    featured: true,
    hooks: [
      { id: "h1", label: "Live session merch CTA", hint: "Pinned in next Sunday live.", status: "Ready" },
      { id: "h2", label: "Beacon lookbook card", hint: "Creative package already approved.", status: "Ready" },
      { id: "h3", label: "Event shelf placement", hint: "Attached to volunteer summit merch shelf.", status: "Ready" },
    ],
    quote:
      "A clean premium merch item that behaves like both a community identity product and a live-conversion product.",
  },
  {
    id: "merch-journal",
    title: "Prayer Journal Gift Set",
    subtitle: "Soft-touch journal, scripture cards, and premium pen in one ministry-ready gift box.",
    kind: "Journal",
    status: "Ready",
    visibility: "Follower-first",
    collection: "Prayer & Journaling",
    imageUrl: HERO_2,
    summary:
      "A prayer journal set built for discipleship journeys, first-time guest gifts, and supporter thank-you packs.",
    tags: ["journal", "prayer", "gift set"],
    variants: ["Stone", "Olive", "Navy"],
    campus: "Global store",
    owner: "Publishing & Merch",
    updatedISO: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    storefrontReady: true,
    mediaReady: true,
    fulfillmentReady: false,
    linkedLive: false,
    linkedEvents: 1,
    linkedBeacon: true,
    linkedGiving: true,
    inventory: 16,
    reserved: 4,
    sold: 58,
    orders: 41,
    revenue: 2510,
    priceLabel: "$24 premium set",
    conversionRate: 4.2,
    featured: true,
    hooks: [
      { id: "h1", label: "Giving thank-you path", hint: "Can attach to the monthly supporter campaign.", status: "Ready" },
      { id: "h2", label: "Replay follow-up card", hint: "Post-live journaling CTA is drafted.", status: "Draft" },
      { id: "h3", label: "Fulfillment QA", hint: "Gift-wrap inventory still needs confirmation.", status: "Pending" },
    ],
    quote:
      "A rich merch object that can power discipleship, giving follow-up, and seasonal gifting without extra setup.",
  },
  {
    id: "merch-tote",
    title: "Sunday Service Tote",
    subtitle: "Canvas carry tote for notes, journals, and event-day essentials.",
    kind: "Accessory",
    status: "Draft",
    visibility: "Public",
    collection: "Sunday Essentials",
    imageUrl: HERO_3,
    summary:
      "A versatile tote designed for campuses that want practical merch for regular attendees and conference guests.",
    tags: ["tote", "service", "canvas"],
    variants: ["Natural", "Black"],
    campus: "Downtown campus",
    owner: "Campus Store Lead",
    updatedISO: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    storefrontReady: false,
    mediaReady: false,
    fulfillmentReady: true,
    linkedLive: false,
    linkedEvents: 0,
    linkedBeacon: false,
    linkedGiving: false,
    inventory: 44,
    reserved: 0,
    sold: 0,
    orders: 0,
    revenue: 0,
    priceLabel: "$18 launch target",
    conversionRate: 0,
    featured: false,
    hooks: [
      { id: "h1", label: "Hero images missing", hint: "Needs polished lifestyle media before publishing.", status: "Pending" },
      { id: "h2", label: "Collection placement", hint: "Can sit inside Sunday Essentials shelf.", status: "Draft" },
    ],
    quote:
      "Still in draft, but positioned well for a practical entry-level community merch shelf.",
  },
  {
    id: "merch-conference",
    title: "Conference Welcome Pack",
    subtitle: "Event badge, printed guide, lanyard, and welcome card bundled for premium check-in.",
    kind: "Event Kit",
    status: "Published",
    visibility: "Event-only",
    collection: "Conference Merch",
    imageUrl: HERO_4,
    summary:
      "A premium event pack for conferences, retreats, and paid gatherings where experience quality matters from the first touchpoint.",
    tags: ["conference", "lanyard", "welcome"],
    variants: ["Standard attendee", "VIP attendee"],
    campus: "Events team",
    owner: "Events & Experiences",
    updatedISO: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    storefrontReady: true,
    mediaReady: true,
    fulfillmentReady: true,
    linkedLive: true,
    linkedEvents: 3,
    linkedBeacon: true,
    linkedGiving: false,
    inventory: 62,
    reserved: 19,
    sold: 201,
    orders: 184,
    revenue: 9640,
    priceLabel: "$28 event pack",
    conversionRate: 9.1,
    featured: true,
    hooks: [
      { id: "h1", label: "Event registration tie-in", hint: "Pack is attached to conference registration flow.", status: "Ready" },
      { id: "h2", label: "Live mention insert", hint: "Scheduled in the conference opening live session.", status: "Ready" },
      { id: "h3", label: "Beacon retargeting", hint: "Recovery campaign runs for incomplete registrants.", status: "Ready" },
    ],
    quote:
      "A flagship events-linked merchandise bundle that feels premium both operationally and visually.",
  },
  {
    id: "merch-communion",
    title: "Communion Home Kit",
    subtitle: "At-home participation kit with worship guide, communion elements, and family prayer insert.",
    kind: "Worship Essential",
    status: "Published",
    visibility: "Follower-first",
    collection: "Seasonal Gifts",
    imageUrl: HERO_5,
    summary:
      "A purpose-built worship product for livestream audiences and seasonal home participation campaigns.",
    tags: ["communion", "home kit", "family"],
    variants: ["Single", "Family"],
    campus: "Online-first audience",
    owner: "Ministry Products",
    updatedISO: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    storefrontReady: true,
    mediaReady: true,
    fulfillmentReady: true,
    linkedLive: true,
    linkedEvents: 1,
    linkedBeacon: false,
    linkedGiving: true,
    inventory: 9,
    reserved: 3,
    sold: 117,
    orders: 95,
    revenue: 4260,
    priceLabel: "$22 single / $32 family",
    conversionRate: 5.8,
    featured: false,
    hooks: [
      { id: "h1", label: "Seasonal live insert", hint: "Pinned in the Easter home service live.", status: "Ready" },
      { id: "h2", label: "Crowdfund companion shelf", hint: "Can be paired with a family support campaign.", status: "Draft" },
    ],
    quote:
      "A strong example of merchandise behaving like ministry infrastructure instead of generic store inventory.",
  },
  {
    id: "merch-youthband",
    title: "Youth Camp Wristband Pack",
    subtitle: "Color-coded access and identity pack for youth camps and day gatherings.",
    kind: "Accessory",
    status: "Sold Out",
    visibility: "Event-only",
    collection: "Youth Merch",
    imageUrl: HERO_6,
    summary:
      "A practical event item with strong operational value but exhausted inventory after the most recent youth camp.",
    tags: ["youth", "camp", "access"],
    variants: ["Blue", "Orange", "Green"],
    campus: "Youth campus",
    owner: "Youth Operations",
    updatedISO: new Date(Date.now() - 1000 * 60 * 60 * 56).toISOString(),
    storefrontReady: true,
    mediaReady: true,
    fulfillmentReady: true,
    linkedLive: false,
    linkedEvents: 2,
    linkedBeacon: false,
    linkedGiving: false,
    inventory: 0,
    reserved: 0,
    sold: 310,
    orders: 302,
    revenue: 3720,
    priceLabel: "$12 access pack",
    conversionRate: 0,
    featured: false,
    hooks: [
      { id: "h1", label: "Restock decision", hint: "Need a fresh order before the next youth season.", status: "Pending" },
      { id: "h2", label: "Archive or duplicate", hint: "Can duplicate into next event kit batch.", status: "Draft" },
    ],
    quote:
      "An event-proven item that now needs either a fast restock or a clean duplicate flow into the next season.",
  },
];

const TEMPLATE_CARDS = [
  {
    id: "tpl-apparel",
    title: "Apparel drop",
    subtitle: "Launch a clean merch release with sizes, colors, and live-ready promotional hooks.",
    accent: "green" as const,
  },
  {
    id: "tpl-gift",
    title: "Gift bundle",
    subtitle: "Package journals, prayer tools, and premium thank-you items into one shelf-ready bundle.",
    accent: "orange" as const,
  },
  {
    id: "tpl-event",
    title: "Event merch set",
    subtitle: "Build registration-linked packs for conferences, camps, and special gatherings.",
    accent: "navy" as const,
  },
  {
    id: "tpl-seasonal",
    title: "Seasonal essentials",
    subtitle: "Create a timed seasonal product with supporter-first access and Beacon promotion hooks.",
    accent: "green" as const,
  },
];

const COLLECTIONS = [
  {
    id: "col-sunday",
    title: "Sunday Essentials",
    subtitle: "Core weekly service and community identity items.",
    count: 2,
    liveLinked: 2,
  },
  {
    id: "col-conference",
    title: "Conference Merch",
    subtitle: "Experience-driven merchandise for premium events.",
    count: 1,
    liveLinked: 1,
  },
  {
    id: "col-prayer",
    title: "Prayer & Journaling",
    subtitle: "Reflection, devotional, and supporter gift products.",
    count: 1,
    liveLinked: 0,
  },
  {
    id: "col-seasonal",
    title: "Seasonal Gifts",
    subtitle: "Timed worship and family-participation items.",
    count: 1,
    liveLinked: 1,
  },
];

function statusTone(
  status: MerchandiseStatus,
): "neutral" | "good" | "warn" | "danger" {
  if (status === "Published") return "good";
  if (status === "Ready") return "warn";
  if (status === "Sold Out" || status === "Archived") return "danger";
  return "neutral";
}

function visibilityTone(
  visibility: VisibilityModel,
): "neutral" | "good" | "warn" {
  if (visibility === "Public") return "good";
  if (visibility === "Follower-first" || visibility === "Event-only") return "warn";
  return "neutral";
}

function stockTone(
  item: MerchandiseRecord,
): "neutral" | "good" | "warn" | "danger" {
  if (item.inventory <= 0) return "danger";
  if (item.inventory <= 10) return "warn";
  return "good";
}

function completenessScore(item: MerchandiseRecord) {
  const checks = [
    item.storefrontReady,
    item.mediaReady,
    item.fulfillmentReady,
    item.visibility !== "Internal" || item.status !== "Published",
    item.priceLabel.length > 0,
    item.tags.length > 0,
  ];
  return pct(checks.filter(Boolean).length, checks.length);
}

function readinessIssues(item: MerchandiseRecord) {
  const issues: string[] = [];
  if (!item.storefrontReady) issues.push("Storefront block still needs completion.");
  if (!item.mediaReady) issues.push("Merch media still needs refinement.");
  if (!item.fulfillmentReady) issues.push("Fulfillment notes or packaging still need confirmation.");
  if (item.inventory <= 0) issues.push("Inventory is depleted.");
  if (!item.linkedLive && item.status === "Published")
    issues.push("No active live-session merch link is configured.");
  if (!issues.length) issues.push("This merchandise record is premium-ready and promotion-ready.");
  return issues;
}

function toneCard(index: number) {
  if (index === 0 || index === 4) return "green";
  if (index === 2 || index === 5) return "orange";
  return "light";
}

function Pill({
  text,
  tone = "neutral",
  icon,
}: {
  text: string;
  tone?: "neutral" | "good" | "warn" | "danger";
  icon?: React.ReactNode;
}) {
  const toneCls =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
      : tone === "warn"
      ? "border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 text-amber-800 dark:text-amber-300"
      : tone === "danger"
      ? "border-rose-200 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-800 text-rose-800 dark:text-rose-300"
      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300";
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold",
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
  disabled,
  className,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "px-4 py-2 rounded-2xl text-[12px] font-semibold inline-flex items-center gap-2 border transition-colors",
        disabled
          ? "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200",
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
  className,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "px-4 py-2 rounded-2xl text-[12px] font-semibold inline-flex items-center gap-2 border border-transparent text-white",
        disabled ? "opacity-60 cursor-not-allowed" : "hover:opacity-95",
        className,
      )}
      style={{ background: EV_ORANGE }}
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
    <div className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </div>
          {subtitle ? (
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
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

function MetricCard({
  label,
  value,
  hint,
  tone = "light",
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "green" | "orange" | "light";
}) {
  return (
    <KpiTile
      label={label}
      value={value}
      hint={hint}
      tone={tone === "light" ? "gray" : tone}
      size="compact"
    />
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors",
        active
          ? "border-transparent text-white"
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700",
      )}
      style={active ? { background: EV_GREEN } : undefined}
    >
      {label}
    </button>
  );
}

function TemplateTile({
  title,
  subtitle,
  accent,
}: {
  title: string;
  subtitle: string;
  accent: "green" | "orange" | "navy";
}) {
  const accentColor =
    accent === "green" ? EV_GREEN : accent === "orange" ? EV_ORANGE : EV_NAVY;
  return (
    <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
      <div
        className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold text-white"
        style={{ background: accentColor }}
      >
        Template
      </div>
      <div className="mt-3 text-[14px] font-bold text-slate-900 dark:text-slate-100">
        {title}
      </div>
      <div className="mt-2 text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">
        {subtitle}
      </div>
      <div className="mt-4">
        <SoftButton onClick={() => safeNav(ROUTES.merchandiseBuilder)} className="px-3 py-1.5">
          <Plus className="h-4 w-4" />
          Use template
        </SoftButton>
      </div>
    </div>
  );
}

function MerchandiseCard({
  item,
  onOpen,
  onPreview,
}: {
  item: MerchandiseRecord;
  onOpen: () => void;
  onPreview: () => void;
}) {
  return (
    <div className="rounded-[26px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-colors">
      <div className="relative h-52">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Pill text={item.status} tone={statusTone(item.status)} />
          <Pill
            text={item.kind}
            tone="neutral"
            icon={
              item.kind === "Gift" || item.kind === "Journal" ? (
                <Gift className="h-3.5 w-3.5" />
              ) : (
                <ShoppingBag className="h-3.5 w-3.5" />
              )
            }
          />
        </div>
        <div className="absolute right-3 top-3">
          <span
            className={cx(
              "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold",
              item.inventory <= 0
                ? "bg-rose-500 text-white"
                : item.inventory <= 10
                ? "bg-amber-400 text-slate-900"
                : "bg-white/90 text-slate-900",
            )}
          >
            {item.inventory <= 0
              ? "Sold out"
              : item.inventory <= 10
              ? `${item.inventory} left`
              : `${item.inventory} in stock`}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[16px] font-bold leading-tight text-slate-900 dark:text-slate-100">
              {item.title}
            </div>
            <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
              {item.subtitle}
            </div>
          </div>
          {item.featured ? (
            <span
              className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold text-white shrink-0"
              style={{ background: EV_GREEN }}
            >
              Featured
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Pill text={item.visibility} tone={visibilityTone(item.visibility)} />
          <Pill
            text={item.collection}
            tone="neutral"
            icon={<Layers className="h-3.5 w-3.5" />}
          />
        </div>

        <div className="mt-3 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">
          {item.summary}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 transition-colors">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
              Price
            </div>
            <div className="mt-1 text-[13px] font-bold text-slate-900 dark:text-slate-100">
              {item.priceLabel}
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 transition-colors">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
              Revenue
            </div>
            <div className="mt-1 text-[13px] font-bold text-slate-900 dark:text-slate-100">
              {money(item.revenue)}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={`${item.id}_${tag}`}
              className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2 text-center">
          {[
            {
              label: "Orders",
              value: fmtInt(item.orders),
            },
            {
              label: "Sold",
              value: fmtInt(item.sold),
            },
            {
              label: "Reserved",
              value: fmtInt(item.reserved),
            },
            {
              label: "CVR",
              value: `${item.conversionRate.toFixed(1)}%`,
            },
          ].map((stat) => (
            <div
              key={`${item.id}_${stat.label}`}
              className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2 py-2 transition-colors"
            >
              <div className="text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                {stat.label}
              </div>
              <div className="mt-1 text-[13px] font-black text-slate-900 dark:text-slate-100">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <SoftButton onClick={onOpen}>
            <ChevronRight className="h-4 w-4" />
            Open details
          </SoftButton>
          <SoftButton onClick={onPreview}>
            <Eye className="h-4 w-4" />
            Preview
          </SoftButton>
          <SoftButton onClick={() => safeNav(ROUTES.beaconBuilder)}>
            <Megaphone className="h-4 w-4" />
            Promote
          </SoftButton>
        </div>
      </div>
    </div>
  );
}

function CollectionTile({
  title,
  subtitle,
  count,
  liveLinked,
}: {
  title: string;
  subtitle: string;
  count: number;
  liveLinked: number;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100">
            {title}
          </div>
          <div className="mt-1 text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">
            {subtitle}
          </div>
        </div>
        <div
          className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold text-white"
          style={{ background: EV_GREEN }}
        >
          {count}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-[12px] text-slate-600 dark:text-slate-400">
        <MonitorBadge />
        {liveLinked} live-linked item{liveLinked === 1 ? "" : "s"}
      </div>
    </div>
  );
}

function InventoryAlertRow({
  title,
  hint,
  tone,
}: {
  title: string;
  hint: string;
  tone: "good" | "warn" | "danger";
}) {
  const icon =
    tone === "good" ? (
      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
    ) : tone === "warn" ? (
      <AlertTriangle className="h-4 w-4 text-amber-600" />
    ) : (
      <AlertTriangle className="h-4 w-4 text-rose-600" />
    );

  return (
    <div className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-3 transition-colors">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icon}</div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </div>
          <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">
            {hint}
          </div>
        </div>
      </div>
    </div>
  );
}

function MonitorBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-700 dark:text-slate-300 transition-colors">
      <Package className="h-3.5 w-3.5" />
      FaithMart
    </span>
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
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white dark:bg-slate-950 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transition-colors">
        <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[15px] font-bold text-slate-900 dark:text-slate-100">
              {title}
            </div>
            {subtitle ? (
              <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                {subtitle}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="h-10 w-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors grid place-items-center"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </aside>
    </div>
  );
}

function MerchandiseStorefrontPreview({
  item,
  allItems,
  mode,
  compact = false,
}: {
  item: MerchandiseRecord;
  allItems: MerchandiseRecord[];
  mode: PreviewMode;
  compact?: boolean;
}) {
  if (mode === "mobile") {
    return (
      <div className={cx("mx-auto", compact ? "w-[320px]" : "w-[360px]")}>
        <div className="rounded-[36px] bg-slate-900 p-3 shadow-2xl">
          <div className="rounded-[30px] overflow-hidden bg-white dark:bg-slate-900 transition-colors">
            <div className="relative h-48">
              <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/65 to-transparent" />
              <div className="absolute left-3 top-3 flex gap-2">
                <span className="rounded-full px-2.5 py-1 text-[10px] font-black text-white" style={{ background: EV_GREEN }}>
                  FaithMart
                </span>
                <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black text-slate-900">
                  {item.kind}
                </span>
              </div>
              <div className="absolute left-4 right-4 bottom-4 text-white">
                <div className="text-[18px] font-black leading-tight">{item.title}</div>
                <div className="mt-1 text-[12px] text-white/85 line-clamp-2">{item.subtitle}</div>
              </div>
            </div>

            <div className="p-4">
              <div className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition-colors">
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                  Featured item
                </div>
                <div className="mt-2 text-[15px] font-bold text-slate-900 dark:text-slate-100">
                  {item.title}
                </div>
                <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                  {item.priceLabel}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    className="flex-1 rounded-2xl px-3 py-2 text-[12px] font-bold text-white"
                    style={{ background: EV_ORANGE }}
                   onClick={handleRawPlaceholderAction("open_merchandise_builder")}>
                    View item
                  </button>
                  <button className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-[12px] font-bold text-slate-700 dark:text-slate-200 transition-colors" onClick={handleRawPlaceholderAction("copy_current_link")}>
                    Save
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                  Suggested shelf
                </div>
                <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                  {allItems.slice(0, 3).map((other) => (
                    <div
                      key={`mobile_prev_${other.id}`}
                      className="min-w-[120px] rounded-[20px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2 transition-colors"
                    >
                      <img
                        src={other.imageUrl}
                        alt={other.title}
                        className="h-24 w-full rounded-[16px] object-cover"
                      />
                      <div className="mt-2 text-[12px] font-bold leading-tight text-slate-900 dark:text-slate-100 line-clamp-2">
                        {other.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-[22px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition-colors">
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Linked surfaces
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.linkedLive ? (
                    <span className="rounded-full border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      Live Sessions
                    </span>
                  ) : null}
                  {item.linkedEvents > 0 ? (
                    <span className="rounded-full border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      Events
                    </span>
                  ) : null}
                  {item.linkedBeacon ? (
                    <span className="rounded-full border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      Beacon
                    </span>
                  ) : null}
                  {item.linkedGiving ? (
                    <span className="rounded-full border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      Giving
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[30px] overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors shadow-sm">
      <div className="relative h-56">
        <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/35 to-transparent" />
        <div className="absolute left-6 top-6 flex gap-2">
          <span
            className="rounded-full px-3 py-1.5 text-[11px] font-black text-white"
            style={{ background: EV_GREEN }}
          >
            FaithMart merchandise
          </span>
          <span className="rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-black text-slate-900">
            {item.collection}
          </span>
        </div>
        <div className="absolute left-6 bottom-6 max-w-[60%] text-white">
          <div className="text-[28px] font-black leading-tight">{item.title}</div>
          <div className="mt-2 text-[13px] text-white/85 leading-relaxed">
            {item.summary}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              className="rounded-2xl px-4 py-2 text-[12px] font-bold text-white"
              style={{ background: EV_ORANGE }}
             onClick={handleRawPlaceholderAction("open_merchandise_builder")}>
                    View item
            </button>
            <button className="rounded-2xl border border-white/25 bg-white/10 px-4 py-2 text-[12px] font-bold text-white backdrop-blur" onClick={handleRawPlaceholderAction("copy_current_link")}>
              Save for later
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.25fr)_340px] gap-4 p-4">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                  Merch spotlight
                </div>
                <div className="mt-2 text-[18px] font-bold text-slate-900 dark:text-slate-100">
                  {item.title}
                </div>
                <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                  {item.priceLabel}
                </div>
              </div>
              <span
                className={cx(
                  "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold",
                  item.inventory <= 0
                    ? "bg-rose-500 text-white"
                    : item.inventory <= 10
                    ? "bg-amber-400 text-slate-900"
                    : "bg-white text-slate-900 border border-slate-200 dark:border-slate-700",
                )}
              >
                {item.inventory <= 0 ? "Sold out" : `${item.inventory} left`}
              </span>
            </div>
            <div className="mt-4 grid md:grid-cols-3 gap-3">
              <div className="rounded-[20px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 transition-colors">
                <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                  Orders
                </div>
                <div className="mt-1 text-[18px] font-black text-slate-900 dark:text-slate-100">
                  {fmtInt(item.orders)}
                </div>
              </div>
              <div className="rounded-[20px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 transition-colors">
                <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                  Revenue
                </div>
                <div className="mt-1 text-[18px] font-black text-slate-900 dark:text-slate-100">
                  {money(item.revenue)}
                </div>
              </div>
              <div className="rounded-[20px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 transition-colors">
                <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                  Conversion
                </div>
                <div className="mt-1 text-[18px] font-black text-slate-900 dark:text-slate-100">
                  {item.conversionRate.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
              Related shelf
            </div>
            <div className="mt-3 grid md:grid-cols-3 gap-3">
              {allItems.slice(0, 3).map((other) => (
                <div
                  key={`desktop_prev_${other.id}`}
                  className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 transition-colors"
                >
                  <img
                    src={other.imageUrl}
                    alt={other.title}
                    className="h-28 w-full rounded-[18px] object-cover"
                  />
                  <div className="mt-3 text-[13px] font-bold leading-tight text-slate-900 dark:text-slate-100">
                    {other.title}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {other.priceLabel}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 transition-colors">
          <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
            Commerce links
          </div>
          <div className="mt-3 space-y-3">
            {[
              {
                label: "Live Sessions",
                enabled: item.linkedLive,
              },
              {
                label: "Events",
                enabled: item.linkedEvents > 0,
              },
              {
                label: "Beacon",
                enabled: item.linkedBeacon,
              },
              {
                label: "Giving",
                enabled: item.linkedGiving,
              },
            ].map((link) => (
              <div
                key={`${item.id}_${link.label}`}
                className="rounded-[18px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-3 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                    {link.label}
                  </div>
                  <span
                    className={cx(
                      "rounded-full px-2.5 py-1 text-[10px] font-bold",
                      link.enabled
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                        : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
                    )}
                  >
                    {link.enabled ? "Linked" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-[20px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3 transition-colors">
            <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
              Premium note
            </div>
            <div className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              Merchandise behaves as a first-class FaithHub object, so providers can place it
              inside live sessions, event flows, supporter journeys, and Beacon promotion without
              duplicating setup.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
      <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </div>
      {subtitle ? (
        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          {subtitle}
        </div>
      ) : null}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function MerchandiseManagerPage() {
  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<MerchandiseKind | "All">("All");
  const [statusFilter, setStatusFilter] = useState<MerchandiseStatus | "All">("All");
  const [stockFilter, setStockFilter] = useState<"All" | "Healthy" | "Low stock" | "Sold out">("All");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [selectedId, setSelectedId] = useState(MERCHANDISE[0].id);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const totals = useMemo(() => {
    const lowStock = MERCHANDISE.filter((item) => item.inventory > 0 && item.inventory <= 10).length;
    const soldOut = MERCHANDISE.filter((item) => item.inventory <= 0).length;
    const published = MERCHANDISE.filter((item) => item.status === "Published").length;
    const liveLinked = MERCHANDISE.filter((item) => item.linkedLive).length;
    const beaconLinked = MERCHANDISE.filter((item) => item.linkedBeacon).length;
    const revenue = MERCHANDISE.reduce((sum, item) => sum + item.revenue, 0);
    return { lowStock, soldOut, published, liveLinked, beaconLinked, revenue };
  }, []);

  const filtered = useMemo(() => {
    return MERCHANDISE.filter((item) => {
      const q = query.trim().toLowerCase();
      const queryOk =
        !q ||
        [
          item.title,
          item.subtitle,
          item.summary,
          item.collection,
          item.kind,
          item.owner,
          ...item.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const kindOk = kindFilter === "All" || item.kind === kindFilter;
      const statusOk = statusFilter === "All" || item.status === statusFilter;

      let stockOk = true;
      if (stockFilter === "Healthy") stockOk = item.inventory > 10;
      if (stockFilter === "Low stock")
        stockOk = item.inventory > 0 && item.inventory <= 10;
      if (stockFilter === "Sold out") stockOk = item.inventory <= 0;

      return queryOk && kindOk && statusOk && stockOk;
    });
  }, [kindFilter, query, statusFilter, stockFilter]);

  const selected = useMemo(() => {
    const fromFiltered = filtered.find((item) => item.id === selectedId);
    return fromFiltered || filtered[0] || MERCHANDISE[0];
  }, [filtered, selectedId]);

  const featured = useMemo(
    () => MERCHANDISE.filter((item) => item.featured).slice(0, 2),
    [],
  );

  const actionLane = useMemo(() => {
    const rows: Array<{ title: string; hint: string; tone: "good" | "warn" | "danger" }> = [];
    const low = MERCHANDISE.filter((item) => item.inventory > 0 && item.inventory <= 10);
    const soldOut = MERCHANDISE.filter((item) => item.inventory <= 0);
    const draftMedia = MERCHANDISE.filter((item) => !item.mediaReady);
    rows.push({
      title: low.length
        ? `${low.length} merchandise item${low.length > 1 ? "s" : ""} running low`
        : "Inventory is healthy",
      hint: low.length
        ? `${low.map((item) => item.title).slice(0, 2).join(" • ")}${low.length > 2 ? "…" : ""}`
        : "No urgent low-stock merch issues right now.",
      tone: low.length ? "warn" : "good",
    });
    rows.push({
      title: soldOut.length
        ? `${soldOut.length} sold-out item${soldOut.length > 1 ? "s need" : " needs"} a decision`
        : "No sold-out blockers",
      hint: soldOut.length
        ? "Restock, archive, or duplicate for the next season."
        : "Every published item still has active inventory.",
      tone: soldOut.length ? "danger" : "good",
    });
    rows.push({
      title: draftMedia.length
        ? `${draftMedia.length} item${draftMedia.length > 1 ? "s still need" : " still needs"} premium media`
        : "Media coverage is complete",
      hint: draftMedia.length
        ? "Use + New Merchandise or edit existing items to attach clean hero and variant media."
        : "Hero art, detail images, and shelf visuals are already in place.",
      tone: draftMedia.length ? "warn" : "good",
    });
    return rows;
  }, []);

  const metrics = [
    {
      label: "Live catalog",
      value: `${fmtInt(MERCHANDISE.length)}`,
      hint: "Every merchandise record currently managed in the Provider catalog.",
    },
    {
      label: "Published",
      value: `${fmtInt(totals.published)}`,
      hint: "Storefront-visible products that can already be surfaced in FaithMart.",
    },
    {
      label: "Low stock",
      value: `${fmtInt(totals.lowStock)}`,
      hint: "Merchandise that may need restock or promotion pacing decisions.",
    },
    {
      label: "Sold out",
      value: `${fmtInt(totals.soldOut)}`,
      hint: "Products or event packs that are depleted and need a next-step decision.",
    },
    {
      label: "Live-linked",
      value: `${fmtInt(totals.liveLinked)}`,
      hint: "Merchandise already wired into live sessions or post-live surfaces.",
    },
    {
      label: "Revenue",
      value: money(totals.revenue),
      hint: "Top-line merchandise revenue visible at the command surface.",
    },
  ];

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors"
      style={{ backgroundColor: EV_LIGHT }}
    >
      <main className="px-4 py-4 md:px-6 lg:px-8 lg:py-6">
        <section className="rounded-[32px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-colors">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                FaithMart & Merchandise
              </div>
              <h1 className="mt-2 text-[34px] md:text-[42px] leading-[1.02] font-black tracking-tight text-slate-900 dark:text-slate-50">
                Run premium merchandise,
                <br />
                shelves, bundles, and live-linked FaithMart drops
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-500 dark:text-slate-400">
                Manage gifts, apparel, journals, worship essentials, and event kits from one
                premium Provider-side surface — with direct links into Live Sessions, events,
                giving journeys, and Beacon promotion.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Pill text="FaithMart merchandise" tone="good" icon={<BadgeCheck className="h-3.5 w-3.5" />} />
                <Pill text="Quick-create everywhere" tone="warn" icon={<Zap className="h-3.5 w-3.5" />} />
                <Pill text="Live + Event + Beacon hooks" tone="neutral" icon={<Link2 className="h-3.5 w-3.5" />} />
              </div>
            </div>

            <div className="w-full max-w-[440px] rounded-[28px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                    Command actions
                  </div>
                  <div className="mt-1 text-[18px] font-black text-slate-900 dark:text-slate-100">
                    Merchandise control
                  </div>
                </div>
                <div
                  className="rounded-full px-2.5 py-1 text-[10px] font-black text-white"
                  style={{ background: EV_GREEN }}
                >
                  </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <PrimaryButton onClick={() => safeNav(ROUTES.merchandiseBuilder)}>
                  <Plus className="h-4 w-4" />
                  + New Merchandise
                </PrimaryButton>
                <SoftButton onClick={() => safeNav(ROUTES.faithMartStorefront)}>
                  <ExternalLink className="h-4 w-4" />
                  Open FaithMart
                </SoftButton>
                <SoftButton onClick={() => safeNav(ROUTES.beaconBuilder)}>
                  <Megaphone className="h-4 w-4" />
                  Promote with Beacon
                </SoftButton>
              </div>

              <div className="mt-4 rounded-[20px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 transition-colors">
                <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                  Continue where you left off
                </div>
                <div className="mt-2 space-y-2">
                  {[
                    {
                      label: "Sunday Service Tote draft",
                      hint: "Media is still missing before publish.",
                    },
                    {
                      label: "Conference Welcome Pack",
                      hint: "Strong event performance — consider a new Beacon push.",
                    },
                    {
                      label: "Prayer Journal Gift Set",
                      hint: "Fulfillment QA still pending before scale-up.",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[18px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-3 transition-colors"
                    >
                      <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                        {item.label}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        {item.hint}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          {metrics.map((metric, index) => (
            <MetricCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              hint={metric.hint}
              tone={toneCard(index)}
            />
          ))}
        </section>

        <section className="mt-4 rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                Search and filter merchandise
              </div>
              <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Find apparel, gifts, event kits, or worship essentials fast — then jump straight into details or preview.
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-[24px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 transition-colors">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search merchandise, collection, tag, owner, or linked surface"
                  className="w-full bg-transparent text-[13px] outline-none placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                Filters
              </div>
              <div className="flex flex-wrap gap-2">
                {(["All", "Apparel", "Gift", "Journal", "Worship Essential", "Event Kit", "Accessory"] as const).map((kind) => (
                  <FilterChip
                    key={kind}
                    active={kindFilter === kind}
                    label={kind}
                    onClick={() => setKindFilter(kind as MerchandiseKind | "All")}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {(["All", "Published", "Ready", "Draft", "Sold Out", "Archived"] as const).map((status) => (
                  <FilterChip
                    key={status}
                    active={statusFilter === status}
                    label={status}
                    onClick={() => setStatusFilter(status as MerchandiseStatus | "All")}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {(["All", "Healthy", "Low stock", "Sold out"] as const).map((stock) => (
                  <FilterChip
                    key={stock}
                    active={stockFilter === stock}
                    label={stock}
                    onClick={() => setStockFilter(stock)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.95fr)]">
          <div className="space-y-4">
            <Card
              title="Featured merchandise"
              subtitle="Priority items that are already carrying premium value across FaithMart, live sessions, or event experiences."
              right={
                <SoftButton onClick={() => safeNav(ROUTES.merchandiseBuilder)}>
                  <Wand2 className="h-4 w-4" />
                  Create shelf-ready item
                </SoftButton>
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                {featured.map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors"
                  >
                    <div className="relative h-56">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/65 to-transparent" />
                      <div className="absolute left-4 top-4 flex gap-2">
                        <Pill text={item.status} tone={statusTone(item.status)} />
                        <Pill text={item.collection} tone="neutral" />
                      </div>
                      <div className="absolute left-4 right-4 bottom-4 text-white">
                        <div className="text-[20px] font-black leading-tight">
                          {item.title}
                        </div>
                        <div className="mt-1 text-[12px] text-white/85">
                          {item.priceLabel}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">
                        {item.quote}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <SoftButton
                          onClick={() => {
                            setSelectedId(item.id);
                            setDrawerOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          Open item
                        </SoftButton>
                        <SoftButton onClick={() => safeNav(ROUTES.beaconBuilder)}>
                          <Megaphone className="h-4 w-4" />
                          Promote
                        </SoftButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title="Merchandise command center"
              subtitle={`${fmtInt(filtered.length)} merchandise item${filtered.length === 1 ? "" : "s"} match your current filters.`}
              right={
                <div className="flex flex-wrap gap-2">
                  <SoftButton onClick={() => safeNav(ROUTES.liveBuilder)}>
                    <Zap className="h-4 w-4" />
                    Attach to live
                  </SoftButton>
                  <SoftButton onClick={() => safeNav(ROUTES.eventsManager)}>
                    <CalendarClock className="h-4 w-4" />
                    Link to event
                  </SoftButton>
                </div>
              }
            >
              {filtered.length ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  {filtered.map((item) => (
                    <MerchandiseCard
                      key={item.id}
                      item={item}
                      onOpen={() => {
                        setSelectedId(item.id);
                        setDrawerOpen(true);
                      }}
                      onPreview={() => {
                        setSelectedId(item.id);
                        setDrawerOpen(true);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-[26px] border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-10 text-center transition-colors">
                  <div className="mx-auto h-12 w-12 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid place-items-center">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="mt-4 text-[16px] font-bold text-slate-900 dark:text-slate-100">
                    No merchandise matches these filters
                  </div>
                  <div className="mt-2 text-[12px] text-slate-500 dark:text-slate-400">
                    Clear one or more filters, or start a new merchandise record with the quick-create path.
                  </div>
                  <div className="mt-4">
                    <PrimaryButton onClick={() => safeNav(ROUTES.merchandiseBuilder)}>
                      <Plus className="h-4 w-4" />
                      + New Merchandise
                    </PrimaryButton>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <Card
              title="Storefront preview"
              subtitle="A premium FaithMart preview rail so providers can see how merchandise reads before publishing or promoting it."
              right={
                <div className="inline-flex rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 transition-colors">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("desktop")}
                    className={cx(
                      "rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors",
                      previewMode === "desktop"
                        ? "text-white"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700",
                    )}
                    style={previewMode === "desktop" ? { background: EV_GREEN } : undefined}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("mobile")}
                    className={cx(
                      "rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors",
                      previewMode === "mobile"
                        ? "text-white"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700",
                    )}
                    style={previewMode === "mobile" ? { background: EV_GREEN } : undefined}
                  >
                    Mobile
                  </button>
                </div>
              }
            >
              <MerchandiseStorefrontPreview
                item={selected}
                allItems={MERCHANDISE}
                mode={previewMode}
                compact
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <SoftButton
                  onClick={() => {
                    setDrawerOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                  Open full preview
                </SoftButton>
                <SoftButton onClick={() => safeNav(ROUTES.faithMartStorefront)}>
                  <ExternalLink className="h-4 w-4" />
                  FaithMart storefront
                </SoftButton>
              </div>
            </Card>

            <Card
              title="Collections"
              subtitle="Store-ready merchandise groupings with live and event surface context."
              right={<MonitorBadge />}
            >
              <div className="grid gap-3">
                {COLLECTIONS.map((collection) => (
                  <CollectionTile
                    key={collection.id}
                    title={collection.title}
                    subtitle={collection.subtitle}
                    count={collection.count}
                    liveLinked={collection.liveLinked}
                  />
                ))}
              </div>
            </Card>

            <Card
              title="Inventory & action lane"
              subtitle="Fast operational visibility for stock, media readiness, and the next best merchandising actions."
              right={
                <SoftButton onClick={() => safeNav(ROUTES.providerDashboard)}>
                  <Bell className="h-4 w-4" />
                  Open dashboard
                </SoftButton>
              }
            >
              <div className="space-y-3">
                {actionLane.map((row) => (
                  <InventoryAlertRow
                    key={row.title}
                    title={row.title}
                    hint={row.hint}
                    tone={row.tone}
                  />
                ))}
              </div>

              <div className="mt-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  Quick-create templates
                </div>
                <div className="mt-3 grid gap-3">
                  {TEMPLATE_CARDS.map((template) => (
                    <TemplateTile
                      key={template.id}
                      title={template.title}
                      subtitle={template.subtitle}
                      accent={template.accent}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selected.title}
        subtitle={`${selected.kind} • ${selected.collection} • Updated ${fmtDate(selected.updatedISO)}`}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <PrimaryButton onClick={() => safeNav(`${ROUTES.merchandiseBuilder}?item=${selected.id}`)}>
              <ChevronRight className="h-4 w-4" />
              Edit merchandise
            </PrimaryButton>
            <SoftButton onClick={() => safeNav(ROUTES.beaconBuilder)}>
              <Megaphone className="h-4 w-4" />
              Promote with Beacon
            </SoftButton>
            <SoftButton onClick={() => safeNav(ROUTES.liveBuilder)}>
              <Zap className="h-4 w-4" />
              Attach to live
            </SoftButton>
            <SoftButton
              onClick={() => {
                if (typeof window !== "undefined" && navigator?.clipboard) {
                  navigator.clipboard.writeText(`${ROUTES.faithMartStorefront}/${selected.id}`);
                }
              }}
            >
              <Copy className="h-4 w-4" />
              Copy item link
            </SoftButton>
          </div>

          <MerchandiseStorefrontPreview
            item={selected}
            allItems={MERCHANDISE}
            mode={previewMode}
          />

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_380px]">
            <DetailSection
              title="Readiness and merchandising quality"
              subtitle="A premium readiness surface that shows whether this item is truly shelf-ready and promotion-ready."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-4 transition-colors">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                    Completeness
                  </div>
                  <div className="mt-2 text-[28px] font-black text-slate-900 dark:text-slate-100">
                    {completenessScore(selected)}%
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${completenessScore(selected)}%`,
                        background: EV_GREEN,
                      }}
                    />
                  </div>
                </div>

                <div className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-4 transition-colors">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                    Visibility
                  </div>
                  <div className="mt-2 text-[18px] font-black text-slate-900 dark:text-slate-100">
                    {selected.visibility}
                  </div>
                  <div className="mt-2 text-[12px] text-slate-500 dark:text-slate-400">
                    {selected.status === "Published"
                      ? "This merchandise is already in the live storefront mix."
                      : "This item still needs final action before a wider audience can see it."}
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {readinessIssues(selected).map((issue) => (
                  <div
                    key={issue}
                    className="rounded-[20px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-3 text-[12px] text-slate-600 dark:text-slate-400 transition-colors"
                  >
                    {issue}
                  </div>
                ))}
              </div>
            </DetailSection>

            <DetailSection
              title="Operational signals"
              subtitle="Inventory, reservations, and commercial performance in one clean side panel."
            >
              <div className="space-y-3">
                {[
                  { label: "Inventory", value: fmtInt(selected.inventory) },
                  { label: "Reserved", value: fmtInt(selected.reserved) },
                  { label: "Orders", value: fmtInt(selected.orders) },
                  { label: "Sold units", value: fmtInt(selected.sold) },
                  { label: "Revenue", value: money(selected.revenue) },
                  { label: "Conversion", value: `${selected.conversionRate.toFixed(1)}%` },
                ].map((stat) => (
                  <div
                    key={`${selected.id}_${stat.label}`}
                    className="rounded-[20px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 transition-colors"
                  >
                    <div className="text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                      {stat.label}
                    </div>
                    <div className="mt-1 text-[18px] font-black text-slate-900 dark:text-slate-100">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </DetailSection>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <DetailSection
              title="Cross-links and growth hooks"
              subtitle="FaithHub merchandise should never sit isolated from live, events, giving, or promotion."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    label: "Live Sessions",
                    enabled: selected.linkedLive,
                    hint: selected.linkedLive
                      ? "This item can be pinned during live sessions."
                      : "No active live link configured yet.",
                  },
                  {
                    label: "Events",
                    enabled: selected.linkedEvents > 0,
                    hint: selected.linkedEvents > 0
                      ? `Attached to ${selected.linkedEvents} event flow${selected.linkedEvents > 1 ? "s" : ""}.`
                      : "No event attachment yet.",
                  },
                  {
                    label: "Beacon",
                    enabled: selected.linkedBeacon,
                    hint: selected.linkedBeacon
                      ? "Promotion-ready with Beacon."
                      : "No paid promotion link currently attached.",
                  },
                  {
                    label: "Giving",
                    enabled: selected.linkedGiving,
                    hint: selected.linkedGiving
                      ? "Can ride inside donor or supporter journeys."
                      : "Not currently tied to a giving flow.",
                  },
                ].map((link) => (
                  <div
                    key={`${selected.id}_${link.label}`}
                    className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                        {link.label}
                      </div>
                      <span
                        className={cx(
                          "rounded-full px-2.5 py-1 text-[10px] font-bold",
                          link.enabled
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                            : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
                        )}
                      >
                        {link.enabled ? "Active" : "Off"}
                      </span>
                    </div>
                    <div className="mt-2 text-[12px] text-slate-500 dark:text-slate-400">
                      {link.hint}
                    </div>
                  </div>
                ))}
              </div>
            </DetailSection>

            <DetailSection
              title="Hooks and collaboration"
              subtitle="Operational notes, promotion hooks, and team-ready merchandising actions."
            >
              <div className="space-y-3">
                {selected.hooks.map((hook) => (
                  <div
                    key={hook.id}
                    className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                        {hook.label}
                      </div>
                      <Pill
                        text={hook.status}
                        tone={
                          hook.status === "Ready"
                            ? "good"
                            : hook.status === "Pending"
                            ? "warn"
                            : "neutral"
                        }
                      />
                    </div>
                    <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                      {hook.hint}
                    </div>
                  </div>
                ))}
              </div>
            </DetailSection>
          </div>
        </div>
      </Drawer>
    </div>
  );
}












