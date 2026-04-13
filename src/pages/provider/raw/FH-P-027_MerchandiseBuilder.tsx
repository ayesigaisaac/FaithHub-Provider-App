"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronRight,
  Eye,
  Gift,
  Globe2,
  Image as ImageIcon,
  Languages,
  Layers3,
  Link2,
  Lock,
  Megaphone,
  Package,
  Palette,
  Plus,
  Rocket,
  Save,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Users,
  Wand2,
  Workflow,
  Zap,
} from "lucide-react";

/**
 * FaithHub — FH-P-027 Merchandise Builder
 * ---------------------------------------
 * Premium Provider-side create/edit page launched from FH-P-026 Merchandise Manager via
 * the "+ New Merchandise" command.
 *
 * Product intent
 * - Build premium FaithMart-ready merchandise without leaving the Provider flow.
 * - Support apparel, journals, gifts, event kits, accessories, and merch bundles.
 * - Keep Live Sessionz, Events, Giving, Audience journeys, and Beacon promotion close to
 *   the merchandise object from day one.
 * - Provide a premium preview rail so a provider sees the storefront, live pin, and
 *   promotional surfaces before publishing.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#0f172a";

const ROUTES = {
  merchandiseManager: "/faithhub/provider/merchandise-manager",
  liveBuilder: "/faithhub/provider/live-builder",
  eventsManager: "/faithhub/provider/events-manager",
  beaconBuilder: "/faithhub/provider/beacon-builder",
  audienceNotifications: "/faithhub/provider/audience-notifications",
  faithMartStorefront: "/faithmart/storefront",
};

const HERO_APPAREL =
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80";
const HERO_GIFT =
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1400&q=80";
const HERO_JOURNAL =
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80";
const HERO_EVENT =
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80";
const HERO_BUNDLE =
  "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1400&q=80";

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  if (typeof window === "undefined") return;
  window.location.assign(url);
}

function money(amount: number, currency: CurrencyCode) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  } catch {
    return `${currency} ${Math.round(amount || 0)}`;
  }
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function toLocalInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

type TemplateKey =
  | "tpl-apparel"
  | "tpl-gift"
  | "tpl-journal"
  | "tpl-event-kit"
  | "tpl-bundle";

type StepKey =
  | "foundation"
  | "media"
  | "variants"
  | "pricing"
  | "fulfillment"
  | "activation"
  | "localization"
  | "review";

type MerchandiseKind =
  | "Apparel"
  | "Gift"
  | "Journal"
  | "Accessory"
  | "Event Kit"
  | "Bundle";

type CollectionKey =
  | "Sunday Essentials"
  | "Conference Merch"
  | "Prayer & Journaling"
  | "Seasonal Gifts"
  | "Youth Merch";

type VisibilityModel =
  | "Public"
  | "Follower-first"
  | "Supporter"
  | "Event-only"
  | "Internal";

type FulfillmentMode = "Shipping" | "Pickup" | "Event Collection" | "Mixed";
type PreviewMode = "desktop" | "mobile";
type CurrencyCode = "USD" | "GBP" | "NGN" | "UGX";
type ReleaseMode = "Draft" | "Publish now" | "Schedule";

type VariantItem = {
  id: string;
  label: string;
  sku: string;
  inventory: number;
  priceDelta: number;
  active: boolean;
};

type LocaleItem = {
  id: string;
  language: string;
  title: string;
  subtitle: string;
  status: "Draft" | "In review" | "Ready";
};

type HookToggle = {
  live: boolean;
  event: boolean;
  beacon: boolean;
  giving: boolean;
  notifications: boolean;
};

type MerchandiseDraft = {
  templateId: TemplateKey;
  title: string;
  subtitle: string;
  kind: MerchandiseKind;
  collection: CollectionKey;
  visibility: VisibilityModel;
  audience: string;
  summary: string;
  promise: string;
  story: string;
  themeLine: string;
  quote: string;
  coverUrl: string;
  altCoverUrl: string;
  detailUrl: string;
  packagingNote: string;
  badge: string;
  accentTone: "Green" | "Orange" | "Navy";
  variantItems: VariantItem[];
  basePrice: number;
  compareAtPrice: number;
  supporterPrice: number;
  currency: CurrencyCode;
  storefrontLabel: string;
  accessModel: VisibilityModel;
  releaseMode: ReleaseMode;
  releaseAt: string;
  limitedDrop: boolean;
  donorThankYouEligible: boolean;
  fulfillmentMode: FulfillmentMode;
  shippingClass: string;
  prepLabel: string;
  shipRegions: string[];
  pickupLocations: string[];
  linkHooks: HookToggle;
  linkedLive: string;
  linkedEvent: string;
  linkedFund: string;
  linkedBeacon: string;
  ctaText: string;
  merchAngle: string;
  localeItems: LocaleItem[];
  notes: string;
  approvals: {
    brand: boolean;
    policy: boolean;
    fulfillment: boolean;
    storefront: boolean;
  };
};

type TemplatePreset = {
  id: TemplateKey;
  title: string;
  subtitle: string;
  kind: MerchandiseKind;
  collection: CollectionKey;
  coverUrl: string;
  accentTone: "Green" | "Orange" | "Navy";
  audience: string;
  summary: string;
  promise: string;
  story: string;
  themeLine: string;
  quote: string;
  badge: string;
  basePrice: number;
  compareAtPrice: number;
  supporterPrice: number;
  storefrontLabel: string;
  ctaText: string;
  merchAngle: string;
  variantSeed: VariantItem[];
  shipRegions: string[];
  pickupLocations: string[];
};

const STEP_LIBRARY: Array<{ key: StepKey; label: string }> = [
  { key: "foundation", label: "Foundation" },
  { key: "media", label: "Media & brand" },
  { key: "variants", label: "Variants" },
  { key: "pricing", label: "Pricing" },
  { key: "fulfillment", label: "Fulfillment" },
  { key: "activation", label: "Activation" },
  { key: "localization", label: "Localization" },
  { key: "review", label: "Review & launch" },
];

const COLLECTIONS: CollectionKey[] = [
  "Sunday Essentials",
  "Conference Merch",
  "Prayer & Journaling",
  "Seasonal Gifts",
  "Youth Merch",
];

const TEMPLATE_LIBRARY: Record<TemplateKey, TemplatePreset> = {
  "tpl-apparel": {
    id: "tpl-apparel",
    title: "Community apparel drop",
    subtitle: "Launch a polished wearable item with sizes, colorways, and live-ready promotion hooks.",
    kind: "Apparel",
    collection: "Sunday Essentials",
    coverUrl: HERO_APPAREL,
    accentTone: "Green",
    audience: "Regular attendees, volunteers, youth leaders, and supporters",
    summary:
      "A premium apparel item designed to strengthen community identity while performing well in live pins, event shelves, and Beacon campaigns.",
    promise:
      "Turn a simple merch release into a premium faith-community product with strong storytelling and excellent conversion surfaces.",
    story:
      "This drop is designed for ministries that want a clean, premium item people will actually wear beyond the event day.",
    themeLine: "Wear the community. Carry the mission.",
    quote: "A flagship merch piece that feels premium in FaithMart and natural inside live ministry moments.",
    badge: "Featured drop",
    basePrice: 39,
    compareAtPrice: 49,
    supporterPrice: 34,
    storefrontLabel: "Heavyweight community hoodie",
    ctaText: "Shop the hoodie",
    merchAngle: "Pin during weekly live and attach to conference registration journeys.",
    variantSeed: [
      { id: "var-h1", label: "S / Forest", sku: "FH-HOOD-S-FOR", inventory: 8, priceDelta: 0, active: true },
      { id: "var-h2", label: "M / Forest", sku: "FH-HOOD-M-FOR", inventory: 10, priceDelta: 0, active: true },
      { id: "var-h3", label: "L / Black", sku: "FH-HOOD-L-BLK", inventory: 6, priceDelta: 2, active: true },
    ],
    shipRegions: ["UG", "KE", "TZ"],
    pickupLocations: ["Main campus", "Conference desk"],
  },
  "tpl-gift": {
    id: "tpl-gift",
    title: "Premium gift pack",
    subtitle: "Create a seasonal or supporter gift item with elegant packaging and high-trust storytelling.",
    kind: "Gift",
    collection: "Seasonal Gifts",
    coverUrl: HERO_GIFT,
    accentTone: "Orange",
    audience: "First-time guests, donor thank-you moments, seasonal campaigns",
    summary:
      "A premium gift product that can serve seasonal campaigns, supporter appreciation, and event-day thank-you moments.",
    promise:
      "Blend warmth, trust, and premium packaging into a gift product that feels intentional from the first glance.",
    story:
      "This item is built for ministries that want merch to feel pastoral and thoughtful, not just transactional.",
    themeLine: "Give with meaning.",
    quote: "Ideal for limited gift campaigns, year-end gratitude, and elegant community thank-you flows.",
    badge: "Seasonal favourite",
    basePrice: 24,
    compareAtPrice: 30,
    supporterPrice: 21,
    storefrontLabel: "Prayer journal gift set",
    ctaText: "Send the gift set",
    merchAngle: "Use inside replay follow-up and donor appreciation sequences.",
    variantSeed: [
      { id: "var-g1", label: "Stone / Standard", sku: "FH-GIFT-STONE", inventory: 14, priceDelta: 0, active: true },
      { id: "var-g2", label: "Olive / Premium wrap", sku: "FH-GIFT-OLIVE", inventory: 7, priceDelta: 4, active: true },
    ],
    shipRegions: ["UG", "KE"],
    pickupLocations: ["Ministry office"],
  },
  "tpl-journal": {
    id: "tpl-journal",
    title: "Prayer journal release",
    subtitle: "Build a premium reading and writing product that links naturally to teachings, resources, and giving journeys.",
    kind: "Journal",
    collection: "Prayer & Journaling",
    coverUrl: HERO_JOURNAL,
    accentTone: "Navy",
    audience: "Discipleship groups, new believers, daily readers, prayer circles",
    summary:
      "A polished journaling product designed for prayer, study, reflection, and resource-led community growth.",
    promise:
      "Make note-taking, prayer, and spiritual rhythm feel beautiful, collectible, and highly reusable.",
    story:
      "The journal becomes more powerful when linked to replays, reading plans, and follow-up discipleship flows.",
    themeLine: "Write the journey. Keep the word close.",
    quote: "A premium reading companion that performs like both a resource and a storefront object.",
    badge: "Reader favourite",
    basePrice: 18,
    compareAtPrice: 22,
    supporterPrice: 15,
    storefrontLabel: "Soft-touch prayer journal",
    ctaText: "Get the journal",
    merchAngle: "Attach to sermon notes, replay landing pages, and discipleship challenge campaigns.",
    variantSeed: [
      { id: "var-j1", label: "Soft stone cover", sku: "FH-JOURNAL-STONE", inventory: 18, priceDelta: 0, active: true },
      { id: "var-j2", label: "Navy embossed cover", sku: "FH-JOURNAL-NAVY", inventory: 11, priceDelta: 3, active: true },
    ],
    shipRegions: ["UG", "KE", "NG"],
    pickupLocations: ["Book table"],
  },
  "tpl-event-kit": {
    id: "tpl-event-kit",
    title: "Event kit builder",
    subtitle: "Bundle practical event-day items, wristbands, note packs, and welcome materials in one premium release.",
    kind: "Event Kit",
    collection: "Conference Merch",
    coverUrl: HERO_EVENT,
    accentTone: "Orange",
    audience: "Conference guests, retreat attendees, volunteers, worship teams",
    summary:
      "An event-ready merch package that feels operationally polished and commercially intentional at the same time.",
    promise:
      "Reduce chaos and increase conversion with a clearly structured event kit that plugs into registration and live promotion.",
    story:
      "The event kit is most powerful when launched before the event, surfaced during the event, and extended into replay follow-up.",
    themeLine: "Everything ready before the doors open.",
    quote: "Built for premium conference experiences, check-in flows, and high-clarity event merchandising.",
    badge: "Event-ready",
    basePrice: 49,
    compareAtPrice: 59,
    supporterPrice: 44,
    storefrontLabel: "Conference welcome kit",
    ctaText: "Reserve the event kit",
    merchAngle: "Tie to Events Manager, check-in mode, and reminder journeys before the gathering.",
    variantSeed: [
      { id: "var-e1", label: "Standard attendee kit", sku: "FH-EVENT-STD", inventory: 40, priceDelta: 0, active: true },
      { id: "var-e2", label: "VIP welcome kit", sku: "FH-EVENT-VIP", inventory: 15, priceDelta: 12, active: true },
    ],
    shipRegions: ["UG"],
    pickupLocations: ["Event registration desk", "Main campus"],
  },
  "tpl-bundle": {
    id: "tpl-bundle",
    title: "FaithMart merch bundle",
    subtitle: "Create a premium multi-item bundle with stronger AOV, campaign positioning, and seasonal promotion hooks.",
    kind: "Bundle",
    collection: "Youth Merch",
    coverUrl: HERO_BUNDLE,
    accentTone: "Green",
    audience: "Youth campaigns, event attendees, supporter-first launches, bundles",
    summary:
      "A merch bundle that groups complementary items together and feels made for drops, supporters, and themed campaigns.",
    promise:
      "Increase perceived value and campaign energy by packaging the right combination of items into one high-clarity product.",
    story:
      "Bundles work best when paired with live product storytelling, event conversion, and supporter-first release windows.",
    themeLine: "More value. More story. One clean drop.",
    quote: "A premium merch object for higher-value campaigns and sharp Beacon creative.",
    badge: "Bundle spotlight",
    basePrice: 62,
    compareAtPrice: 79,
    supporterPrice: 54,
    storefrontLabel: "Youth campaign bundle",
    ctaText: "Claim the bundle",
    merchAngle: "Great for Beacon awareness pushes and timed replay follow-up offers.",
    variantSeed: [
      { id: "var-b1", label: "Core bundle", sku: "FH-BUNDLE-CORE", inventory: 20, priceDelta: 0, active: true },
      { id: "var-b2", label: "Supporter bundle", sku: "FH-BUNDLE-SUP", inventory: 9, priceDelta: 8, active: true },
    ],
    shipRegions: ["UG", "KE", "TZ", "NG"],
    pickupLocations: ["Youth desk", "Main campus"],
  },
};

function createDraftFromTemplate(templateId: TemplateKey): MerchandiseDraft {
  const preset = TEMPLATE_LIBRARY[templateId];
  return {
    templateId,
    title: preset.title,
    subtitle: preset.subtitle,
    kind: preset.kind,
    collection: preset.collection,
    visibility: "Public",
    audience: preset.audience,
    summary: preset.summary,
    promise: preset.promise,
    story: preset.story,
    themeLine: preset.themeLine,
    quote: preset.quote,
    coverUrl: preset.coverUrl,
    altCoverUrl: preset.coverUrl,
    detailUrl: preset.coverUrl,
    packagingNote: "Premium folded packaging with ministry thank-you card.",
    badge: preset.badge,
    accentTone: preset.accentTone,
    variantItems: preset.variantSeed,
    basePrice: preset.basePrice,
    compareAtPrice: preset.compareAtPrice,
    supporterPrice: preset.supporterPrice,
    currency: "USD",
    storefrontLabel: preset.storefrontLabel,
    accessModel: "Public",
    releaseMode: "Draft",
    releaseAt: toLocalInputValue(new Date(Date.now() + 1000 * 60 * 60 * 24 * 4)),
    limitedDrop: false,
    donorThankYouEligible: false,
    fulfillmentMode: "Mixed",
    shippingClass: "Standard parcel",
    prepLabel: "Dispatch in 2–4 working days",
    shipRegions: preset.shipRegions,
    pickupLocations: preset.pickupLocations,
    linkHooks: {
      live: true,
      event: preset.kind === "Event Kit" || preset.kind === "Bundle",
      beacon: true,
      giving: preset.kind === "Gift" || preset.kind === "Journal",
      notifications: true,
    },
    linkedLive: "Sunday evening service live",
    linkedEvent: preset.kind === "Event Kit" ? "FaithHub conference 2026" : "",
    linkedFund: preset.kind === "Gift" ? "Supporter thank-you journey" : "",
    linkedBeacon: "Seasonal awareness campaign",
    ctaText: preset.ctaText,
    merchAngle: preset.merchAngle,
    localeItems: [
      {
        id: "loc-en",
        language: "English",
        title: preset.title,
        subtitle: preset.subtitle,
        status: "Ready",
      },
      {
        id: "loc-fr",
        language: "French",
        title: "",
        subtitle: "",
        status: "Draft",
      },
    ],
    notes: "Use as a flagship premium merchandise release and keep the CTA consistent across live, events, and Beacon.",
    approvals: {
      brand: true,
      policy: false,
      fulfillment: false,
      storefront: true,
    },
  };
}

function StepNav({
  step,
  setStep,
}: {
  step: StepKey;
  setStep: (step: StepKey) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-3 transition-colors">
      <div className="text-[12px] font-semibold text-slate-900">Builder flow</div>
      <div className="mt-2 space-y-1">
        {STEP_LIBRARY.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setStep(item.key)}
            className={cx(
              "w-full rounded-2xl border px-3 py-2 text-left text-[12px] font-semibold transition-colors flex items-center justify-between",
              step === item.key
                ? "border-amber-200 bg-amber-50 text-slate-900"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            )}
          >
            <span>{item.label}</span>
            {step === item.key ? <ChevronRight className="h-4 w-4" /> : null}
          </button>
        ))}
      </div>
    </div>
  );
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
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "warn"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : tone === "danger"
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-slate-200 bg-white text-slate-700";
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
  disabled,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-[12px] font-semibold transition-colors",
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
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
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl border border-transparent px-4 py-2 text-[12px] font-semibold text-white transition-opacity",
        disabled ? "cursor-not-allowed opacity-60" : "hover:opacity-95",
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
    <div className="rounded-3xl border border-slate-200 bg-white p-4 transition-colors">
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

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-semibold text-slate-700">{children}</div>;
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number" | "datetime-local";
}) {
  return (
    <input
      value={value}
      type={type}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 outline-none transition-colors focus:ring-2 focus:ring-amber-200"
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
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 outline-none transition-colors focus:ring-2 focus:ring-amber-200"
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
  onChange: (value: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cx(
        "w-full rounded-3xl border p-3 text-left transition-colors",
        checked
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-200 bg-white hover:bg-slate-50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[12px] font-semibold text-slate-900">{label}</div>
          {hint ? <div className="mt-0.5 text-[11px] text-slate-500">{hint}</div> : null}
        </div>
        <span
          className={cx(
            "flex h-6 w-10 shrink-0 items-center rounded-full border px-1 transition-colors",
            checked
              ? "justify-end border-emerald-500 bg-emerald-500"
              : "justify-start border-slate-200 bg-slate-100",
          )}
        >
          <span className="h-4 w-4 rounded-full bg-white shadow" />
        </span>
      </div>
    </button>
  );
}

function SegmentedToggle({
  values,
  active,
  onChange,
}: {
  values: string[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 transition-colors">
      {values.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={cx(
            "rounded-xl px-3 py-1.5 text-[12px] font-bold transition-colors",
            active === value
              ? "bg-slate-900 text-white"
              : "text-slate-700 hover:bg-slate-50",
          )}
        >
          {value}
        </button>
      ))}
    </div>
  );
}

function TemplateCard({
  preset,
  active,
  onApply,
}: {
  preset: TemplatePreset;
  active: boolean;
  onApply: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onApply}
      className={cx(
        "group overflow-hidden rounded-3xl border text-left transition-all",
        active
          ? "border-emerald-300 bg-emerald-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm",
      )}
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={preset.coverUrl}
          alt={preset.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[13px] font-semibold text-slate-900">{preset.title}</div>
            <div className="mt-0.5 text-[11px] text-slate-500">{preset.subtitle}</div>
          </div>
          {active ? (
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Check className="h-4 w-4" />
            </span>
          ) : null}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Pill text={preset.kind} tone="neutral" />
          <Pill text={preset.collection} tone="good" />
        </div>
      </div>
    </button>
  );
}

function VariantRow({
  item,
  onChange,
  onRemove,
}: {
  item: VariantItem;
  onChange: (next: VariantItem) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 transition-colors">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div>
          <Label>Variant label</Label>
          <Input value={item.label} onChange={(v) => onChange({ ...item, label: v })} placeholder="M / Forest" />
        </div>
        <div>
          <Label>SKU</Label>
          <Input value={item.sku} onChange={(v) => onChange({ ...item, sku: v })} placeholder="FH-HOOD-M" />
        </div>
        <div>
          <Label>Inventory</Label>
          <Input type="number" value={item.inventory} onChange={(v) => onChange({ ...item, inventory: Number(v || 0) })} />
        </div>
        <div>
          <Label>Price delta</Label>
          <Input type="number" value={item.priceDelta} onChange={(v) => onChange({ ...item, priceDelta: Number(v || 0) })} />
        </div>
        <div className="flex items-end gap-2">
          <Toggle
            checked={item.active}
            onChange={(value) => onChange({ ...item, active: value })}
            label="Active"
            hint="Show variant on storefront"
          />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="text-[11px] text-slate-500">
          Premium tip: use clear size / colour naming so event volunteers and pickup teams can fulfil faster.
        </div>
        <SoftButton onClick={onRemove}>Remove</SoftButton>
      </div>
    </div>
  );
}

function LocaleRow({
  item,
  onChange,
}: {
  item: LocaleItem;
  onChange: (next: LocaleItem) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 transition-colors">
      <div className="grid gap-3 md:grid-cols-4">
        <div>
          <Label>Language</Label>
          <Input value={item.language} onChange={(v) => onChange({ ...item, language: v })} />
        </div>
        <div>
          <Label>Localized title</Label>
          <Input value={item.title} onChange={(v) => onChange({ ...item, title: v })} />
        </div>
        <div>
          <Label>Localized subtitle</Label>
          <Input value={item.subtitle} onChange={(v) => onChange({ ...item, subtitle: v })} />
        </div>
        <div>
          <Label>Status</Label>
          <SegmentedToggle
            values={["Draft", "In review", "Ready"]}
            active={item.status}
            onChange={(value) =>
              onChange({
                ...item,
                status: value as LocaleItem["status"],
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

function ReadinessCard({ checks }: { checks: Array<{ label: string; ok: boolean; hint: string }> }) {
  const passed = checks.filter((item) => item.ok).length;
  const score = Math.round((passed / checks.length) * 100);
  return (
    <Card
      title="Readiness gate"
      subtitle="The builder keeps premium launch requirements visible before the merch item goes live."
      right={
        <div className="flex items-center gap-2">
          <span
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white text-sm font-black"
            style={{ background: score >= 80 ? EV_GREEN : score >= 60 ? EV_ORANGE : EV_NAVY }}
          >
            {score}%
          </span>
        </div>
      }
    >
      <div className="space-y-2">
        {checks.map((item) => (
          <div
            key={item.label}
            className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3"
          >
            <div>
              <div className="text-[12px] font-semibold text-slate-900">{item.label}</div>
              <div className="mt-0.5 text-[11px] text-slate-500">{item.hint}</div>
            </div>
            <Pill text={item.ok ? "Ready" : "Needed"} tone={item.ok ? "good" : "warn"} />
          </div>
        ))}
      </div>
    </Card>
  );
}

function PreviewRail({
  draft,
  previewMode,
  setPreviewMode,
  inventoryTotal,
  liveHooksCount,
}: {
  draft: MerchandiseDraft;
  previewMode: PreviewMode;
  setPreviewMode: (mode: PreviewMode) => void;
  inventoryTotal: number;
  liveHooksCount: number;
}) {
  const activeVariants = draft.variantItems.filter((variant) => variant.active);
  const heroPrice = money(draft.basePrice, draft.currency);
  const comparePrice = draft.compareAtPrice
    ? money(draft.compareAtPrice, draft.currency)
    : "";
  const supporterPrice = draft.supporterPrice
    ? money(draft.supporterPrice, draft.currency)
    : "";
  return (
    <div className="space-y-3 lg:sticky lg:top-6">
      <Card
        title="Preview surfaces"
        subtitle="See how the merch item will appear in FaithMart, live pins, events, and premium promotion surfaces."
        right={
          <SegmentedToggle
            values={["desktop", "mobile"]}
            active={previewMode}
            onChange={(value) => setPreviewMode(value as PreviewMode)}
          />
        }
      >
        <div className="rounded-[28px] border border-slate-200 bg-[#f2f2f2] p-3">
          {previewMode === "desktop" ? (
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={draft.coverUrl} alt={draft.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <Pill text={draft.collection} tone="good" icon={<ShoppingBag className="h-3.5 w-3.5" />} />
                  <Pill text={draft.badge || "Premium merch"} tone="warn" icon={<Sparkles className="h-3.5 w-3.5" />} />
                </div>
                <div className="absolute left-4 right-4 bottom-4 text-white">
                  <div className="text-[10px] font-black uppercase tracking-[0.24em] opacity-80">FaithMart merchandise</div>
                  <div className="mt-1 text-xl font-black leading-tight">{draft.title}</div>
                  <div className="mt-1 max-w-[90%] text-sm opacity-90">{draft.subtitle}</div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[13px] font-semibold text-slate-900">{draft.storefrontLabel}</div>
                    <div className="mt-1 text-[11px] text-slate-500">{draft.summary}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-slate-900">{heroPrice}</div>
                    {comparePrice ? <div className="text-[11px] text-slate-400 line-through">{comparePrice}</div> : null}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeVariants.slice(0, 4).map((variant) => (
                    <span key={variant.id} className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700">
                      {variant.label}
                    </span>
                  ))}
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Live pin</div>
                    <div className="mt-1 text-[12px] font-semibold text-slate-900">{draft.ctaText}</div>
                    <div className="mt-1 text-[11px] text-slate-500">{draft.linkedLive || "Attach this merch item to a live session pin."}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Beacon card</div>
                    <div className="mt-1 text-[12px] font-semibold text-slate-900">{draft.linkedBeacon || "Seasonal awareness campaign"}</div>
                    <div className="mt-1 text-[11px] text-slate-500">{draft.merchAngle}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-[320px] overflow-hidden rounded-[34px] border border-slate-200 bg-slate-950 p-2 shadow-sm">
              <div className="overflow-hidden rounded-[28px] bg-white">
                <div className="relative aspect-[9/12] overflow-hidden">
                  <img src={draft.coverUrl} alt={draft.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute left-3 right-3 bottom-3 text-white">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">FaithMart</div>
                    <div className="mt-1 text-base font-black leading-tight">{draft.title}</div>
                    <div className="mt-1 text-xs opacity-90">{heroPrice}{supporterPrice ? ` • Supporter ${supporterPrice}` : ""}</div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Storefront CTA</div>
                    <div className="mt-1 text-[12px] font-semibold text-slate-900">{draft.ctaText}</div>
                    <div className="mt-1 text-[11px] text-slate-500">{draft.themeLine}</div>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {activeVariants.slice(0, 2).map((variant) => (
                      <div key={variant.id} className="rounded-2xl border border-slate-200 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-[12px] font-semibold text-slate-900">{variant.label}</div>
                            <div className="text-[11px] text-slate-500">{variant.sku}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[12px] font-black text-slate-900">{money(draft.basePrice + variant.priceDelta, draft.currency)}</div>
                            <div className="text-[10px] text-slate-500">{variant.inventory} left</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card title="Surface summary" subtitle="Premium readiness across connected provider surfaces.">
        <div className="grid gap-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Inventory</div>
            <div className="mt-1 text-[18px] font-black text-slate-900">{inventoryTotal}</div>
            <div className="text-[11px] text-slate-500">Across {draft.variantItems.length} variants</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Activation hooks</div>
            <div className="mt-1 text-[18px] font-black text-slate-900">{liveHooksCount}</div>
            <div className="text-[11px] text-slate-500">Live, events, Beacon, giving, and notification journeys</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Release</div>
            <div className="mt-1 text-[14px] font-black text-slate-900">{draft.releaseMode}</div>
            <div className="text-[11px] text-slate-500">
              {draft.releaseMode === "Schedule" ? fmtDate(draft.releaseAt) : "Ready for storefront handoff"}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function MerchandiseBuilderPage() {
  const [step, setStep] = useState<StepKey>("foundation");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [draft, setDraft] = useState<MerchandiseDraft>(() =>
    createDraftFromTemplate("tpl-apparel"),
  );

  const applyTemplate = (templateId: TemplateKey) => {
    setDraft(createDraftFromTemplate(templateId));
  };

  const patchDraft = <K extends keyof MerchandiseDraft>(key: K, value: MerchandiseDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const inventoryTotal = useMemo(
    () => draft.variantItems.reduce((sum, item) => sum + Number(item.inventory || 0), 0),
    [draft.variantItems],
  );

  const liveHooksCount = useMemo(
    () => Object.values(draft.linkHooks).filter(Boolean).length,
    [draft.linkHooks],
  );

  const slug = useMemo(() => slugify(draft.title), [draft.title]);

  const readinessChecks = useMemo(
    () => [
      {
        label: "Merch identity is defined",
        ok: Boolean(draft.title && draft.subtitle && draft.summary),
        hint: "Title, subtitle, and storefront summary should all be filled.",
      },
      {
        label: "Media stack is premium-ready",
        ok: Boolean(draft.coverUrl && draft.badge && draft.themeLine),
        hint: "Cover art, badge text, and a short thematic line improve premium merchandising.",
      },
      {
        label: "Variant and stock structure is healthy",
        ok: draft.variantItems.some((variant) => variant.active) && inventoryTotal > 0,
        hint: "At least one active variant and positive inventory are required.",
      },
      {
        label: "Storefront pricing is configured",
        ok: draft.basePrice > 0 && Boolean(draft.storefrontLabel),
        hint: "Base price and storefront label must be set for FaithMart handoff.",
      },
      {
        label: "Fulfillment is clear",
        ok: Boolean(draft.fulfillmentMode && draft.prepLabel && (draft.shipRegions.length || draft.pickupLocations.length)),
        hint: "Buyers and volunteer teams should understand how the item gets delivered.",
      },
      {
        label: "Activation hooks are connected",
        ok: liveHooksCount >= 2 && Boolean(draft.ctaText),
        hint: "Link the merch item to live, events, Beacon, or notifications from the start.",
      },
      {
        label: "Approvals are complete",
        ok: Object.values(draft.approvals).every(Boolean),
        hint: "Brand, policy, fulfillment, and storefront approvals should all be green before launch.",
      },
    ],
    [draft, inventoryTotal, liveHooksCount],
  );

  const commandStats = useMemo(
    () => ({
      variants: draft.variantItems.length,
      locales: draft.localeItems.length,
      hooks: liveHooksCount,
      readiness: Math.round(
        (readinessChecks.filter((item) => item.ok).length / readinessChecks.length) * 100,
      ),
    }),
    [draft.variantItems.length, draft.localeItems.length, liveHooksCount, readinessChecks],
  );

  const updateVariant = (id: string, next: VariantItem) => {
    patchDraft(
      "variantItems",
      draft.variantItems.map((variant) => (variant.id === id ? next : variant)),
    );
  };

  const addVariant = () => {
    patchDraft("variantItems", [
      ...draft.variantItems,
      {
        id: `variant-${Date.now()}`,
        label: "New variant",
        sku: `${slug.toUpperCase().replace(/-/g, "_") || "FH_ITEM"}_${draft.variantItems.length + 1}`,
        inventory: 0,
        priceDelta: 0,
        active: true,
      },
    ]);
  };

  const removeVariant = (id: string) => {
    patchDraft(
      "variantItems",
      draft.variantItems.filter((variant) => variant.id !== id),
    );
  };

  const updateLocale = (id: string, next: LocaleItem) => {
    patchDraft(
      "localeItems",
      draft.localeItems.map((item) => (item.id === id ? next : item)),
    );
  };

  const addLocale = () => {
    patchDraft("localeItems", [
      ...draft.localeItems,
      {
        id: `locale-${Date.now()}`,
        language: "Spanish",
        title: "",
        subtitle: "",
        status: "Draft",
      },
    ]);
  };

  const hookToggleItems: Array<{
    key: keyof HookToggle;
    title: string;
    subtitle: string;
  }> = [
    {
      key: "live",
      title: "Live Sessionz hook",
      subtitle: "Pin merch in live sessions, replay CTAs, and premium studio moments.",
    },
    {
      key: "event",
      title: "Event shelf",
      subtitle: "Show on event pages, check-in flows, welcome kits, and event follow-up.",
    },
    {
      key: "beacon",
      title: "Beacon promotion",
      subtitle: "Use the merch object as a linked source inside premium Beacon campaigns.",
    },
    {
      key: "giving",
      title: "Giving tie-in",
      subtitle: "Offer as a thank-you path or campaign-linked supporter benefit where appropriate.",
    },
    {
      key: "notifications",
      title: "Notification journey",
      subtitle: "Route the item into pre-launch, live, replay, and seasonal reminder journeys.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-slate-900">
      <div className="mx-auto w-full max-w-[1640px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-slate-200 bg-white shadow-sm transition-colors">
          <div className="border-b border-slate-200 p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                  Merchandise creation
                </div>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  + New Merchandise / Merchandise Builder
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 sm:text-[15px]">
                  Build a premium merchandise object that is storefront-ready for FaithMart, operationally ready for fulfillment,
                  and fully connected to Live Sessionz, events, giving journeys, notifications, and Beacon promotion.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Pill text="FaithMart builder" tone="good" icon={<ShoppingBag className="h-3.5 w-3.5" />} />
                  <Pill text="EVzone green primary" tone="neutral" icon={<Palette className="h-3.5 w-3.5" />} />
                  <Pill text="Provider premium page" tone="warn" icon={<Sparkles className="h-3.5 w-3.5" />} />
                </div>
              </div>

              <div className="grid w-full max-w-[560px] gap-3 sm:grid-cols-2 xl:w-[520px]">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Readiness</div>
                  <div className="mt-2 text-3xl font-black text-slate-900">{commandStats.readiness}%</div>
                  <div className="mt-1 text-[11px] text-slate-500">Launch confidence across merchandising, fulfillment, and activation.</div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Connected surfaces</div>
                  <div className="mt-2 text-3xl font-black text-slate-900">{commandStats.hooks}</div>
                  <div className="mt-1 text-[11px] text-slate-500">Live, event, giving, notification, and Beacon hooks enabled.</div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <SoftButton onClick={() => safeNav(ROUTES.merchandiseManager)}>
                <ArrowLeft className="h-4 w-4" /> Back to Merchandise Manager
              </SoftButton>
              <SoftButton>
                <Save className="h-4 w-4" /> Save draft
              </SoftButton>
              <SoftButton onClick={() => safeNav(ROUTES.faithMartStorefront)}>
                <Eye className="h-4 w-4" /> Preview in FaithMart
              </SoftButton>
              <PrimaryButton>
                <Rocket className="h-4 w-4" /> Publish merchandise
              </PrimaryButton>
            </div>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[270px_minmax(0,1fr)_390px]">
            <div className="space-y-3">
              <StepNav step={step} setStep={setStep} />
              <ReadinessCard checks={readinessChecks} />
            </div>

            <div className="space-y-4">
              {step === "foundation" ? (
                <>
                  <Card
                    title="Template library"
                    subtitle="Start from a premium merchandise template and instantly inherit the right collection logic, storefront positioning, and activation defaults."
                    right={<Pill text="Template-aware builder" tone="good" icon={<Wand2 className="h-3.5 w-3.5" />} />}
                  >
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {Object.values(TEMPLATE_LIBRARY).map((preset) => (
                        <TemplateCard
                          key={preset.id}
                          preset={preset}
                          active={draft.templateId === preset.id}
                          onApply={() => applyTemplate(preset.id)}
                        />
                      ))}
                    </div>
                  </Card>

                  <Card
                    title="Merch identity"
                    subtitle="Define what the merchandise object is, who it serves, and the premium positioning it should carry across FaithHub and FaithMart."
                    right={<Pill text={draft.kind} tone="neutral" icon={<Package className="h-3.5 w-3.5" />} />}
                  >
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div>
                        <Label>Title</Label>
                        <Input value={draft.title} onChange={(value) => patchDraft("title", value)} placeholder="FaithHub Community Hoodie" />
                      </div>
                      <div>
                        <Label>Subtitle</Label>
                        <Input value={draft.subtitle} onChange={(value) => patchDraft("subtitle", value)} placeholder="Premium heavyweight hoodie for community drops" />
                      </div>
                      <div>
                        <Label>Merchandise kind</Label>
                        <SegmentedToggle
                          values={["Apparel", "Gift", "Journal", "Accessory", "Event Kit", "Bundle"]}
                          active={draft.kind}
                          onChange={(value) => patchDraft("kind", value as MerchandiseKind)}
                        />
                      </div>
                      <div>
                        <Label>Collection</Label>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {COLLECTIONS.map((collection) => (
                            <button
                              key={collection}
                              type="button"
                              onClick={() => patchDraft("collection", collection)}
                              className={cx(
                                "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                                draft.collection === collection
                                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                              )}
                            >
                              {collection}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>Audience fit</Label>
                        <Input value={draft.audience} onChange={(value) => patchDraft("audience", value)} placeholder="Attendees, volunteers, supporters" />
                      </div>
                      <div>
                        <Label>Visibility / access</Label>
                        <SegmentedToggle
                          values={["Public", "Follower-first", "Supporter", "Event-only", "Internal"]}
                          active={draft.visibility}
                          onChange={(value) => patchDraft("visibility", value as VisibilityModel)}
                        />
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4">
                      <div>
                        <Label>Storefront summary</Label>
                        <TextArea
                          value={draft.summary}
                          onChange={(value) => patchDraft("summary", value)}
                          rows={3}
                          placeholder="Short premium product summary"
                        />
                      </div>
                      <div className="grid gap-4 lg:grid-cols-2">
                        <div>
                          <Label>Promise / why this item matters</Label>
                          <TextArea value={draft.promise} onChange={(value) => patchDraft("promise", value)} rows={4} />
                        </div>
                        <div>
                          <Label>Merch story</Label>
                          <TextArea value={draft.story} onChange={(value) => patchDraft("story", value)} rows={4} />
                        </div>
                      </div>
                    </div>
                  </Card>
                </>
              ) : null}

              {step === "media" ? (
                <>
                  <Card
                    title="Media stack and brand treatment"
                    subtitle="Configure premium cover art, detail imagery, merchandising quotes, and the visual signals that make the item feel polished."
                    right={<Pill text={draft.accentTone} tone="warn" icon={<ImageIcon className="h-3.5 w-3.5" />} />}
                  >
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div>
                        <Label>Primary cover image</Label>
                        <Input value={draft.coverUrl} onChange={(value) => patchDraft("coverUrl", value)} placeholder="https://..." />
                      </div>
                      <div>
                        <Label>Alternate cover image</Label>
                        <Input value={draft.altCoverUrl} onChange={(value) => patchDraft("altCoverUrl", value)} placeholder="https://..." />
                      </div>
                      <div>
                        <Label>Detail / close-up image</Label>
                        <Input value={draft.detailUrl} onChange={(value) => patchDraft("detailUrl", value)} placeholder="https://..." />
                      </div>
                      <div>
                        <Label>Accent tone</Label>
                        <SegmentedToggle
                          values={["Green", "Orange", "Navy"]}
                          active={draft.accentTone}
                          onChange={(value) => patchDraft("accentTone", value as MerchandiseDraft["accentTone"])}
                        />
                      </div>
                      <div>
                        <Label>Badge / merchandising label</Label>
                        <Input value={draft.badge} onChange={(value) => patchDraft("badge", value)} placeholder="Featured drop" />
                      </div>
                      <div>
                        <Label>Theme line</Label>
                        <Input value={draft.themeLine} onChange={(value) => patchDraft("themeLine", value)} placeholder="Wear the community. Carry the mission." />
                      </div>
                    </div>
                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div>
                        <Label>Packaging note</Label>
                        <TextArea value={draft.packagingNote} onChange={(value) => patchDraft("packagingNote", value)} rows={3} />
                      </div>
                      <div>
                        <Label>Quote / merchandising insight</Label>
                        <TextArea value={draft.quote} onChange={(value) => patchDraft("quote", value)} rows={3} />
                      </div>
                    </div>
                  </Card>

                  <Card
                    title="Premium media usage"
                    subtitle="Make the merchandise asset useful across FaithMart, provider campaigns, and premium surface previews."
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div className="text-[12px] font-semibold text-slate-900">Storefront hero</div>
                        <div className="mt-1 text-[11px] text-slate-500">Use the primary cover image as the FaithMart hero and category thumbnail source.</div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div className="text-[12px] font-semibold text-slate-900">Beacon creative handoff</div>
                        <div className="mt-1 text-[11px] text-slate-500">Generate promotion variants without rebuilding the merch object from scratch.</div>
                      </div>
                    </div>
                  </Card>
                </>
              ) : null}

              {step === "variants" ? (
                <>
                  <Card
                    title="Variant matrix"
                    subtitle="Handle sizes, colours, bundle tiers, supporter editions, and inventory visibility from one premium merchandising workspace."
                    right={<Pill text={`${draft.variantItems.length} variants`} tone="neutral" icon={<Layers3 className="h-3.5 w-3.5" />} />}
                  >
                    <div className="space-y-3">
                      {draft.variantItems.map((variant) => (
                        <VariantRow
                          key={variant.id}
                          item={variant}
                          onChange={(next) => updateVariant(variant.id, next)}
                          onRemove={() => removeVariant(variant.id)}
                        />
                      ))}
                      <SoftButton onClick={addVariant} className="w-full justify-center">
                        <Plus className="h-4 w-4" /> Add variant
                      </SoftButton>
                    </div>
                  </Card>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <Toggle
                      checked={draft.limitedDrop}
                      onChange={(value) => patchDraft("limitedDrop", value)}
                      label="Limited drop mode"
                      hint="Show scarcity and premium release timing for special merchandise runs."
                    />
                    <Toggle
                      checked={draft.donorThankYouEligible}
                      onChange={(value) => patchDraft("donorThankYouEligible", value)}
                      label="Eligible for donor thank-you"
                      hint="Allow the item to appear in supporter appreciation and giving-linked workflows."
                    />
                  </div>
                </>
              ) : null}

              {step === "pricing" ? (
                <>
                  <Card
                    title="Pricing and storefront logic"
                    subtitle="Set premium pricing, compare-at value, supporter logic, and release timing for the FaithMart storefront."
                    right={<Pill text={money(draft.basePrice, draft.currency)} tone="good" icon={<Zap className="h-3.5 w-3.5" />} />}
                  >
                    <div className="grid gap-4 lg:grid-cols-4">
                      <div>
                        <Label>Base price</Label>
                        <Input type="number" value={draft.basePrice} onChange={(value) => patchDraft("basePrice", Number(value || 0))} />
                      </div>
                      <div>
                        <Label>Compare-at price</Label>
                        <Input type="number" value={draft.compareAtPrice} onChange={(value) => patchDraft("compareAtPrice", Number(value || 0))} />
                      </div>
                      <div>
                        <Label>Supporter price</Label>
                        <Input type="number" value={draft.supporterPrice} onChange={(value) => patchDraft("supporterPrice", Number(value || 0))} />
                      </div>
                      <div>
                        <Label>Currency</Label>
                        <SegmentedToggle
                          values={["USD", "GBP", "NGN", "UGX"]}
                          active={draft.currency}
                          onChange={(value) => patchDraft("currency", value as CurrencyCode)}
                        />
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div>
                        <Label>Storefront label</Label>
                        <Input value={draft.storefrontLabel} onChange={(value) => patchDraft("storefrontLabel", value)} placeholder="Premium heavyweight hoodie" />
                      </div>
                      <div>
                        <Label>Access model</Label>
                        <SegmentedToggle
                          values={["Public", "Follower-first", "Supporter", "Event-only", "Internal"]}
                          active={draft.accessModel}
                          onChange={(value) => patchDraft("accessModel", value as VisibilityModel)}
                        />
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div>
                        <Label>Release mode</Label>
                        <SegmentedToggle
                          values={["Draft", "Publish now", "Schedule"]}
                          active={draft.releaseMode}
                          onChange={(value) => patchDraft("releaseMode", value as ReleaseMode)}
                        />
                      </div>
                      <div>
                        <Label>Scheduled release</Label>
                        <Input type="datetime-local" value={draft.releaseAt} onChange={(value) => patchDraft("releaseAt", value)} />
                      </div>
                    </div>
                  </Card>
                </>
              ) : null}

              {step === "fulfillment" ? (
                <>
                  <Card
                    title="Fulfillment and delivery"
                    subtitle="Keep the merchandise object operationally trustworthy with clear shipping, pickup, packaging, and preparation logic."
                    right={<Pill text={draft.fulfillmentMode} tone="neutral" icon={<Truck className="h-3.5 w-3.5" />} />}
                  >
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div>
                        <Label>Fulfillment mode</Label>
                        <SegmentedToggle
                          values={["Shipping", "Pickup", "Event Collection", "Mixed"]}
                          active={draft.fulfillmentMode}
                          onChange={(value) => patchDraft("fulfillmentMode", value as FulfillmentMode)}
                        />
                      </div>
                      <div>
                        <Label>Shipping class</Label>
                        <Input value={draft.shippingClass} onChange={(value) => patchDraft("shippingClass", value)} placeholder="Standard parcel" />
                      </div>
                      <div>
                        <Label>Preparation SLA</Label>
                        <Input value={draft.prepLabel} onChange={(value) => patchDraft("prepLabel", value)} placeholder="Dispatch in 2–4 working days" />
                      </div>
                      <div>
                        <Label>Ship regions (comma separated)</Label>
                        <Input
                          value={draft.shipRegions.join(", ")}
                          onChange={(value) =>
                            patchDraft(
                              "shipRegions",
                              value
                                .split(",")
                                .map((entry) => entry.trim())
                                .filter(Boolean),
                            )
                          }
                          placeholder="UG, KE, TZ"
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <Label>Pickup / collection locations (comma separated)</Label>
                        <Input
                          value={draft.pickupLocations.join(", ")}
                          onChange={(value) =>
                            patchDraft(
                              "pickupLocations",
                              value
                                .split(",")
                                .map((entry) => entry.trim())
                                .filter(Boolean),
                            )
                          }
                          placeholder="Main campus, Event desk"
                        />
                      </div>
                    </div>
                  </Card>
                </>
              ) : null}

              {step === "activation" ? (
                <>
                  <Card
                    title="Cross-links and growth activation"
                    subtitle="Turn the merch item into a premium growth object that can surface in live sessions, events, giving, notifications, and Beacon."
                    right={<Pill text="FaithHub-connected" tone="good" icon={<Workflow className="h-3.5 w-3.5" />} />}
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      {hookToggleItems.map((item) => (
                        <Toggle
                          key={item.key}
                          checked={draft.linkHooks[item.key]}
                          onChange={(value) =>
                            patchDraft("linkHooks", {
                              ...draft.linkHooks,
                              [item.key]: value,
                            })
                          }
                          label={item.title}
                          hint={item.subtitle}
                        />
                      ))}
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div>
                        <Label>Linked live surface</Label>
                        <Input value={draft.linkedLive} onChange={(value) => patchDraft("linkedLive", value)} placeholder="Sunday evening service live" />
                      </div>
                      <div>
                        <Label>Linked event</Label>
                        <Input value={draft.linkedEvent} onChange={(value) => patchDraft("linkedEvent", value)} placeholder="Conference 2026" />
                      </div>
                      <div>
                        <Label>Linked fund / thank-you journey</Label>
                        <Input value={draft.linkedFund} onChange={(value) => patchDraft("linkedFund", value)} placeholder="Supporter thank-you journey" />
                      </div>
                      <div>
                        <Label>Linked Beacon campaign</Label>
                        <Input value={draft.linkedBeacon} onChange={(value) => patchDraft("linkedBeacon", value)} placeholder="Seasonal awareness campaign" />
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div>
                        <Label>Primary CTA text</Label>
                        <Input value={draft.ctaText} onChange={(value) => patchDraft("ctaText", value)} placeholder="Shop the drop" />
                      </div>
                      <div>
                        <Label>Merchandising angle</Label>
                        <Input value={draft.merchAngle} onChange={(value) => patchDraft("merchAngle", value)} placeholder="Pin in live and attach to Beacon follow-up" />
                      </div>
                    </div>
                  </Card>
                </>
              ) : null}

              {step === "localization" ? (
                <>
                  <Card
                    title="Localization variants"
                    subtitle="Support premium multi-language merchandising without rebuilding the product from scratch."
                    right={<Pill text={`${draft.localeItems.length} locales`} tone="neutral" icon={<Languages className="h-3.5 w-3.5" />} />}
                  >
                    <div className="space-y-3">
                      {draft.localeItems.map((item) => (
                        <LocaleRow key={item.id} item={item} onChange={(next) => updateLocale(item.id, next)} />
                      ))}
                      <SoftButton onClick={addLocale} className="w-full justify-center">
                        <Plus className="h-4 w-4" /> Add locale
                      </SoftButton>
                    </div>
                  </Card>
                </>
              ) : null}

              {step === "review" ? (
                <>
                  <Card
                    title="Launch review"
                    subtitle="Confirm that the merchandise object is brand-safe, operationally sound, and ready for storefront sync."
                    right={<Pill text={`${commandStats.readiness}% ready`} tone={commandStats.readiness >= 80 ? "good" : "warn"} icon={<CheckCircle2 className="h-3.5 w-3.5" />} />}
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      <Toggle
                        checked={draft.approvals.brand}
                        onChange={(value) => patchDraft("approvals", { ...draft.approvals, brand: value })}
                        label="Brand approval"
                        hint="Typography, imagery, and premium layout are approved."
                      />
                      <Toggle
                        checked={draft.approvals.policy}
                        onChange={(value) => patchDraft("approvals", { ...draft.approvals, policy: value })}
                        label="Policy approval"
                        hint="Claims, copy, and promotion hooks are policy-safe."
                      />
                      <Toggle
                        checked={draft.approvals.fulfillment}
                        onChange={(value) => patchDraft("approvals", { ...draft.approvals, fulfillment: value })}
                        label="Fulfillment approval"
                        hint="Inventory, packaging, and pickup/shipping notes are confirmed."
                      />
                      <Toggle
                        checked={draft.approvals.storefront}
                        onChange={(value) => patchDraft("approvals", { ...draft.approvals, storefront: value })}
                        label="Storefront sync approval"
                        hint="FaithMart metadata, media stack, and access logic are ready."
                      />
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Slug</div>
                        <div className="mt-1 text-[13px] font-semibold text-slate-900">/{slug}</div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Storefront price</div>
                        <div className="mt-1 text-[13px] font-semibold text-slate-900">{money(draft.basePrice, draft.currency)}</div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Inventory</div>
                        <div className="mt-1 text-[13px] font-semibold text-slate-900">{inventoryTotal} units</div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Release</div>
                        <div className="mt-1 text-[13px] font-semibold text-slate-900">{draft.releaseMode}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <SoftButton>
                        <Save className="h-4 w-4" /> Save draft
                      </SoftButton>
                      <SoftButton onClick={() => safeNav(ROUTES.faithMartStorefront)}>
                        <Eye className="h-4 w-4" /> Preview storefront
                      </SoftButton>
                      <PrimaryButton>
                        <Rocket className="h-4 w-4" /> Publish to FaithMart
                      </PrimaryButton>
                    </div>
                  </Card>
                </>
              ) : null}
            </div>

            <PreviewRail
              draft={draft}
              previewMode={previewMode}
              setPreviewMode={setPreviewMode}
              inventoryTotal={inventoryTotal}
              liveHooksCount={liveHooksCount}
            />
          </div>

          <div className="border-t border-slate-200 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Pill text={`${commandStats.variants} variants`} tone="neutral" icon={<Layers3 className="h-3.5 w-3.5" />} />
                <Pill text={`${commandStats.locales} locales`} tone="neutral" icon={<Globe2 className="h-3.5 w-3.5" />} />
                <Pill text={`${liveHooksCount} activation hooks`} tone="good" icon={<Link2 className="h-3.5 w-3.5" />} />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <SoftButton onClick={() => safeNav(ROUTES.liveBuilder)}>
                  <Zap className="h-4 w-4" /> Link to Live Builder
                </SoftButton>
                <SoftButton onClick={() => safeNav(ROUTES.eventsManager)}>
                  <CalendarClock className="h-4 w-4" /> Link to Events Manager
                </SoftButton>
                <SoftButton onClick={() => safeNav(ROUTES.beaconBuilder)}>
                  <Megaphone className="h-4 w-4" /> Promote with Beacon
                </SoftButton>
                <SoftButton onClick={() => safeNav(ROUTES.audienceNotifications)}>
                  <Users className="h-4 w-4" /> Build launch journey
                </SoftButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
