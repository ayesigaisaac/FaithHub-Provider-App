// @ts-nocheck
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Bell,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Flag,
  Gift,
  Globe2,
  HeartHandshake,
  Image as ImageIcon,
  Layers,
  Lock,
  Megaphone,
  MessageSquare,
  MonitorPlay,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { handleRawPlaceholderAction } from "./placeholderActions";
import { KpiTile } from "../../../components/ui/KpiTile";

/**
 * FaithHub — FH-P-061 Charity Crowdfunding Workbench
 * --------------------------------------------------
 * Premium charity campaign workspace for FaithHub Provider.
 *
 * Design goals
 * - Match the premium creator-style layout direction already used across the generated FaithHub pages.
 * - Use EVzone Green as the primary accent, Orange as the secondary accent, and soft neutrals for trust-heavy charity operations.
 * - Cover the full page spec: campaign story builder, goals and milestones, evidence and impact gallery,
 *   updates timeline, momentum and social proof, distribution hooks, governance, and campaign closeout/reporting.
 * - Keep the experience emotionally warm and trust-first while still feeling highly operational and world-class.
 *
 * Notes
 * - Self-contained mock TSX page. Replace routing, storage, analytics, media pipelines, approvals, and live connections during integration.
 * - Tailwind-style utility classes assumed.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#10235c";

const ROUTES = {
  donationsFunds: "/faithhub/provider/donations-funds",
  audienceNotifications: "/faithhub/provider/audience-notifications",
  beaconBuilder: "/faithhub/provider/beacon-builder",
  liveBuilder: "/faithhub/provider/live-builder",
};

const HERO_WATER =
  "https://images.unsplash.com/photo-1518398046578-8cca57782e17?auto=format&fit=crop&w=1600&q=80";
const HERO_RELIEF =
  "https://images.unsplash.com/photo-1469571486292-b53601020f52?auto=format&fit=crop&w=1600&q=80";
const HERO_SCHOOLS =
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80";
const HERO_BUS =
  "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?auto=format&fit=crop&w=1600&q=80";
const EVIDENCE_WATER =
  "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80";
const EVIDENCE_REPORT =
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80";
const EVIDENCE_CHILDREN =
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80";
const EVIDENCE_TRUCK =
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80";

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  if (typeof window === "undefined") return;
  window.location.assign(url);
}

function fmtInt(n: number) {
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function fmtCurrency(n: number, currency = "£") {
  return `${currency}${Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(n)}`;
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
  });
}

function fmtRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(Math.abs(diff) / 60000);
  if (mins < 60) return `${mins}m ${diff >= 0 ? "ago" : "from now"}`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ${diff >= 0 ? "ago" : "from now"}`;
  const days = Math.round(hrs / 24);
  return `${days}d ${diff >= 0 ? "ago" : "from now"}`;
}

function pct(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Math.max(0, Math.min(100, Math.round((numerator / denominator) * 100)));
}

type PreviewMode = "desktop" | "mobile";
type RegistryFilter = "all" | "active" | "urgent" | "closing" | "archived";
type Lifecycle = "Draft" | "Scheduled" | "Active" | "Paused" | "Completed" | "Archived";
type VerificationState = "Verified" | "Review" | "Blocked";
type Accent = "green" | "orange" | "navy";
type UpdateKind = "Impact" | "Milestone" | "Need" | "Prayer" | "Thanks";
type EvidenceKind = "Photo" | "Video" | "Field report" | "Beneficiary proof";
type HookSurface = "Live Session" | "Replay" | "Clip" | "Notifications" | "Beacon" | "Event";
type HookState = "Ready" | "Draft" | "Queued" | "Live";
type GovernanceState = "Ready" | "Review" | "Blocked";

type Milestone = {
  id: string;
  label: string;
  target: number;
  impact: string;
  unlocked: boolean;
  nextFocus: string;
};

type EvidenceAsset = {
  id: string;
  title: string;
  kind: EvidenceKind;
  owner: string;
  status: "Ready" | "Pending" | "Needs review";
  coverage: string;
  imageUrl: string;
};

type CampaignUpdate = {
  id: string;
  title: string;
  summary: string;
  kind: UpdateKind;
  publishedISO: string;
  linkedSurface: string;
  publicVisible: boolean;
  reachHint: string;
};

type DistributionHook = {
  id: string;
  label: string;
  surface: HookSurface;
  state: HookState;
  value: string;
  ready: boolean;
  hint: string;
};

type GovernanceItem = {
  id: string;
  label: string;
  status: GovernanceState;
  owner: string;
  note: string;
};

type CrowdfundRecord = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  beneficiary: string;
  region: string;
  lifecycle: Lifecycle;
  verification: VerificationState;
  story: string;
  urgency: string;
  impactSummary: string;
  raised: number;
  goal: number;
  stretchGoal: number;
  donors: number;
  ambassadors: number;
  recentActivity: string;
  deadlineISO: string;
  matchActive: boolean;
  matchAmount: number;
  proofCoveragePct: number;
  governanceScore: number;
  updateCount: number;
  finalReportReady: boolean;
  evergreenEligible: boolean;
  heroImageUrl: string;
  accent: Accent;
  milestones: Milestone[];
  evidence: EvidenceAsset[];
  updates: CampaignUpdate[];
  hooks: DistributionHook[];
  governance: GovernanceItem[];
};

type CreateCrowdfundPayload = {
  title: string;
  beneficiary: string;
  goal: number;
  stretchGoal: number;
  region: string;
  deadlineISO: string;
  story: string;
  urgency: string;
  accent: Accent;
};

type UpdatePayload = {
  title: string;
  summary: string;
  kind: UpdateKind;
  linkedSurface: string;
};

function accentColor(accent: Accent) {
  return accent === "green" ? EV_GREEN : accent === "orange" ? EV_ORANGE : EV_NAVY;
}

function toneForLifecycle(lifecycle: Lifecycle): "good" | "warn" | "neutral" | "bad" {
  if (lifecycle === "Active") return "good";
  if (lifecycle === "Scheduled" || lifecycle === "Paused") return "warn";
  if (lifecycle === "Archived") return "bad";
  return "neutral";
}

function toneForVerification(state: VerificationState): "good" | "warn" | "bad" {
  if (state === "Verified") return "good";
  if (state === "Review") return "warn";
  return "bad";
}

function toneForGovernance(state: GovernanceState): "good" | "warn" | "bad" {
  if (state === "Ready") return "good";
  if (state === "Review") return "warn";
  return "bad";
}

function toneForHook(state: HookState): "good" | "warn" | "neutral" {
  if (state === "Live") return "good";
  if (state === "Queued") return "warn";
  return "neutral";
}

const SEED: CrowdfundRecord[] = [
  {
    id: "cf_clean_water",
    title: "Clean Water Mercy Drive",
    subtitle: "Restore four boreholes and hand-pump systems before the dry season peaks.",
    category: "Water & relief",
    beneficiary: "Mercy Springs Rural Communities",
    region: "Northern Uganda",
    lifecycle: "Active",
    verification: "Verified",
    story:
      "Families are walking long distances to unsafe water points. This campaign funds borehole restoration, filtration kits, and local maintenance teams so communities can drink safely and keep children in school.",
    urgency:
      "Two communities lose access within the next 18 days if repair teams cannot begin on time.",
    impactSummary:
      "£60k restores four water points, trains local caretakers, and supplies three months of hygiene materials.",
    raised: 48200,
    goal: 60000,
    stretchGoal: 78000,
    donors: 1284,
    ambassadors: 42,
    recentActivity: "18 gifts in the last hour · one matching partner currently live",
    deadlineISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18).toISOString(),
    matchActive: true,
    matchAmount: 7500,
    proofCoveragePct: 88,
    governanceScore: 96,
    updateCount: 7,
    finalReportReady: false,
    evergreenEligible: true,
    heroImageUrl: HERO_WATER,
    accent: "green",
    milestones: [
      {
        id: "m1",
        label: "Emergency repair team mobilized",
        target: 15000,
        impact: "Transport, pumps, fittings, and first-round labour for the first community.",
        unlocked: true,
        nextFocus: "Share the photo report from the first repair site.",
      },
      {
        id: "m2",
        label: "Second borehole restored",
        target: 32000,
        impact: "Two communities regain reliable water with trained local maintenance leads.",
        unlocked: true,
        nextFocus: "Post beneficiary proof and maintenance receipts.",
      },
      {
        id: "m3",
        label: "Primary goal completed",
        target: 60000,
        impact: "All four sites restored with hygiene packs and on-site verification.",
        unlocked: false,
        nextFocus: "Drive final-week urgency through live, replay, and Beacon.",
      },
      {
        id: "m4",
        label: "Stretch: filtration and storage kits",
        target: 78000,
        impact: "Adds family filtration kits, safe storage containers, and monitoring visits.",
        unlocked: false,
        nextFocus: "Launch stretch-goal storytelling if the primary goal is crossed.",
      },
    ],
    evidence: [
      {
        id: "e1",
        title: "Site inspection photo set",
        kind: "Photo",
        owner: "Field lead",
        status: "Ready",
        coverage: "3 villages · before-repair proof",
        imageUrl: EVIDENCE_WATER,
      },
      {
        id: "e2",
        title: "Repair budget and parts schedule",
        kind: "Field report",
        owner: "Ops finance",
        status: "Ready",
        coverage: "Line-item proof for pump, piping, labour, transport",
        imageUrl: EVIDENCE_REPORT,
      },
      {
        id: "e3",
        title: "Beneficiary family testimony",
        kind: "Beneficiary proof",
        owner: "Community partner",
        status: "Needs review",
        coverage: "Awaiting privacy confirmation before public release",
        imageUrl: EVIDENCE_CHILDREN,
      },
      {
        id: "e4",
        title: "Repair convoy clip",
        kind: "Video",
        owner: "Media team",
        status: "Pending",
        coverage: "Best suited for replay and Beacon follow-up",
        imageUrl: EVIDENCE_TRUCK,
      },
    ],
    updates: [
      {
        id: "u1",
        title: "First repair team has arrived",
        summary: "Pump heads and replacement piping were delivered this morning, and the first village inspection is complete.",
        kind: "Impact",
        publishedISO: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        linkedSurface: "Audience notifications",
        publicVisible: true,
        reachHint: "High share potential while the matching window is still active.",
      },
      {
        id: "u2",
        title: "Milestone two crossed",
        summary: "The second borehole budget is now fully covered. Posting field proof pack after verification.",
        kind: "Milestone",
        publishedISO: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
        linkedSurface: "Live Session overlay",
        publicVisible: true,
        reachHint: "Strong conversion after live storytelling moments.",
      },
      {
        id: "u3",
        title: "Prayer request for field team",
        summary: "Please pray for safe travel, clean equipment delivery, and wisdom for local partners on site.",
        kind: "Prayer",
        publishedISO: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
        linkedSurface: "Replay follow-up",
        publicVisible: true,
        reachHint: "Useful for compassionate follow-up and supporter retention.",
      },
    ],
    hooks: [
      {
        id: "h1",
        label: "Sunday Morning Live donation moment",
        surface: "Live Session",
        state: "Live",
        value: "£12.4k influenced",
        ready: true,
        hint: "Crowdfund progress bar and QR prompt already inserted into the run-of-show.",
      },
      {
        id: "h2",
        label: "Replay ready thank-you sequence",
        surface: "Replay",
        state: "Queued",
        value: "Deploys 20m after publish",
        ready: true,
        hint: "Carries field proof and prayer update CTA.",
      },
      {
        id: "h3",
        label: "Best-moment impact clip",
        surface: "Clip",
        state: "Draft",
        value: "3 clip ideas detected",
        ready: false,
        hint: "Needs editor approval and updated subtitle treatment.",
      },
      {
        id: "h4",
        label: "Beacon supporter boost",
        surface: "Beacon",
        state: "Ready",
        value: "Estimated +26k reach",
        ready: true,
        hint: "Creative and destination plan already available in Beacon Builder.",
      },
      {
        id: "h5",
        label: "Urgent reminder sequence",
        surface: "Notifications",
        state: "Ready",
        value: "7.2k opted-in contacts",
        ready: true,
        hint: "Fatigue-aware send logic will suppress recently tapped users.",
      },
      {
        id: "h6",
        label: "Outreach night event tie-in",
        surface: "Event",
        state: "Draft",
        value: "Volunteer booth pending",
        ready: false,
        hint: "Needs event owner sign-off and on-site QR assets.",
      },
    ],
    governance: [
      {
        id: "g1",
        label: "Beneficiary verification on file",
        status: "Ready",
        owner: "Trust team",
        note: "Verified partner paperwork and identity records complete.",
      },
      {
        id: "g2",
        label: "Fund-use explanation",
        status: "Ready",
        owner: "Campaign owner",
        note: "Line-item summary attached and public-facing copy approved.",
      },
      {
        id: "g3",
        label: "Child-safe privacy review",
        status: "Review",
        owner: "Comms lead",
        note: "Needs final approval before publishing beneficiary family photos.",
      },
    ],
  },
  {
    id: "cf_flood_relief",
    title: "Flood Relief Restoration",
    subtitle: "Urgent household relief, food support, and roof repair for displaced families.",
    category: "Emergency response",
    beneficiary: "Riverside Relief Coalition",
    region: "Lagos State",
    lifecycle: "Active",
    verification: "Verified",
    story:
      "Heavy flooding displaced dozens of families. This campaign covers emergency food, dry shelter packs, roof restoration, and transport for families most at risk.",
    urgency: "Emergency supplies need to reach the first 40 homes in the next 72 hours.",
    impactSummary:
      "£35k covers 40 household packs, temporary repairs, and a month of monitored recovery support.",
    raised: 22100,
    goal: 35000,
    stretchGoal: 50000,
    donors: 742,
    ambassadors: 16,
    recentActivity: "4 new ambassadors joined today · donations spiking after evening prayer",
    deadlineISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    matchActive: true,
    matchAmount: 5000,
    proofCoveragePct: 82,
    governanceScore: 92,
    updateCount: 5,
    finalReportReady: false,
    evergreenEligible: false,
    heroImageUrl: HERO_RELIEF,
    accent: "orange",
    milestones: [
      {
        id: "m1b",
        label: "First 10 homes supported",
        target: 10000,
        impact: "Food packs and bedding delivered to the most urgent households.",
        unlocked: true,
        nextFocus: "Publish the first proof-of-delivery set.",
      },
      {
        id: "m2b",
        label: "Roof repair kits released",
        target: 21000,
        impact: "Tarps, repairs, and builder support for damaged roofs.",
        unlocked: true,
        nextFocus: "Push stronger urgency as the final storm week approaches.",
      },
      {
        id: "m3b",
        label: "Recovery support fully funded",
        target: 35000,
        impact: "Full relief response across 40 households plus one month of follow-up checks.",
        unlocked: false,
        nextFocus: "Tie the campaign into live service prayer and notifications.",
      },
      {
        id: "m4b",
        label: "Stretch: school restart kits",
        target: 50000,
        impact: "Uniform assistance, books, and school re-entry support for children.",
        unlocked: false,
        nextFocus: "Use Beacon to widen reach outside existing donor lists.",
      },
    ],
    evidence: [
      {
        id: "e1b",
        title: "Family shelter photo updates",
        kind: "Photo",
        owner: "Field pastor",
        status: "Ready",
        coverage: "Public-safe image set approved",
        imageUrl: HERO_RELIEF,
      },
      {
        id: "e2b",
        title: "Supply purchase report",
        kind: "Field report",
        owner: "Finance office",
        status: "Ready",
        coverage: "Food, bedding, transport, and roof kit line items",
        imageUrl: EVIDENCE_REPORT,
      },
      {
        id: "e3b",
        title: "Thank-you audio from partner team",
        kind: "Video",
        owner: "Community partner",
        status: "Pending",
        coverage: "To be used in replay and Beacon creative variants",
        imageUrl: EVIDENCE_TRUCK,
      },
      {
        id: "e4b",
        title: "Beneficiary registration proof",
        kind: "Beneficiary proof",
        owner: "Relief coordinator",
        status: "Needs review",
        coverage: "Awaiting final redaction before wider publication",
        imageUrl: EVIDENCE_CHILDREN,
      },
    ],
    updates: [
      {
        id: "u1b",
        title: "Relief packs delivered overnight",
        summary: "The first 12 families received dry food, blankets, hygiene materials, and transport support overnight.",
        kind: "Impact",
        publishedISO: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        linkedSurface: "Live prayer update",
        publicVisible: true,
        reachHint: "This update performs strongly with high-intent supporters.",
      },
      {
        id: "u2b",
        title: "Urgent new need identified",
        summary: "A second cluster of families now needs roof kits before the next storm cycle arrives.",
        kind: "Need",
        publishedISO: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
        linkedSurface: "Beacon boost",
        publicVisible: true,
        reachHint: "Urgency framing is lifting conversion rate on external promotion.",
      },
    ],
    hooks: [
      {
        id: "h1b",
        label: "Mid-service appeal insertion",
        surface: "Live Session",
        state: "Ready",
        value: "Available for next Sunday",
        ready: true,
        hint: "Uses prayer-led ask with direct QR support.",
      },
      {
        id: "h2b",
        label: "Flood response replay package",
        surface: "Replay",
        state: "Draft",
        value: "Needs final caption cleanup",
        ready: false,
        hint: "Best used with proof gallery and update feed.",
      },
      {
        id: "h3b",
        label: "Emergency alerts audience journey",
        surface: "Notifications",
        state: "Ready",
        value: "2.8k urgent responders",
        ready: true,
        hint: "Consent and quiet-hour logic already verified.",
      },
      {
        id: "h4b",
        label: "Relief campaign booster",
        surface: "Beacon",
        state: "Queued",
        value: "Awaiting creative approval",
        ready: true,
        hint: "Launches once the new proof card is approved.",
      },
    ],
    governance: [
      {
        id: "g1b",
        label: "Beneficiary list verified",
        status: "Ready",
        owner: "Trust team",
        note: "Household list matched against partner records.",
      },
      {
        id: "g2b",
        label: "Fund-use restrictions documented",
        status: "Ready",
        owner: "Finance office",
        note: "Repair, food, and household assistance boundaries are documented.",
      },
      {
        id: "g3b",
        label: "Sensitive media approval",
        status: "Review",
        owner: "Comms lead",
        note: "Some family images still require additional privacy review.",
      },
    ],
  },
  {
    id: "cf_school_fees",
    title: "School Fees Lift Campaign",
    subtitle: "Help students stay enrolled through uniforms, exam fees, and transport support.",
    category: "Education support",
    beneficiary: "Hope Bridge Scholars",
    region: "Kampala & Wakiso",
    lifecycle: "Scheduled",
    verification: "Verified",
    story:
      "This back-to-school crowdfund supports students who are at risk of losing their place because of fees, transport cost, and missing learning materials.",
    urgency: "Campaign launches publicly next week ahead of term start.",
    impactSummary:
      "£22k covers exam fees, transport, uniforms, and emergency support for 55 students.",
    raised: 6400,
    goal: 22000,
    stretchGoal: 30000,
    donors: 184,
    ambassadors: 9,
    recentActivity: "Pre-launch list warming has already produced 184 early donors",
    deadlineISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(),
    matchActive: false,
    matchAmount: 0,
    proofCoveragePct: 76,
    governanceScore: 94,
    updateCount: 3,
    finalReportReady: false,
    evergreenEligible: true,
    heroImageUrl: HERO_SCHOOLS,
    accent: "navy",
    milestones: [
      {
        id: "m1c",
        label: "Uniforms and books secured",
        target: 8000,
        impact: "Essential materials for the first intake of students.",
        unlocked: false,
        nextFocus: "Use launch-week storytelling and a student testimony reel.",
      },
      {
        id: "m2c",
        label: "Exam and transport support covered",
        target: 16000,
        impact: "Stabilizes attendance through term start and exam season.",
        unlocked: false,
        nextFocus: "Push event-night promotion and parent stories.",
      },
      {
        id: "m3c",
        label: "Full 55-student goal reached",
        target: 22000,
        impact: "Complete fee and support package for all selected students.",
        unlocked: false,
        nextFocus: "Prepare the closeout and impact story framework early.",
      },
      {
        id: "m4c",
        label: "Stretch: mentorship and counselling",
        target: 30000,
        impact: "Adds student mentoring, school check-ins, and family support touchpoints.",
        unlocked: false,
        nextFocus: "Prepare Beacon narrative around long-term transformation.",
      },
    ],
    evidence: [
      {
        id: "e1c",
        title: "Scholar shortlist verification",
        kind: "Field report",
        owner: "Education lead",
        status: "Ready",
        coverage: "Eligibility summary and approvals completed",
        imageUrl: EVIDENCE_REPORT,
      },
      {
        id: "e2c",
        title: "Student testimony portraits",
        kind: "Photo",
        owner: "Media team",
        status: "Ready",
        coverage: "Launch-ready creative set for public story cards",
        imageUrl: EVIDENCE_CHILDREN,
      },
      {
        id: "e3c",
        title: "Guardian consent records",
        kind: "Beneficiary proof",
        owner: "Trust team",
        status: "Ready",
        coverage: "Consent completed for approved public-facing profiles",
        imageUrl: HERO_SCHOOLS,
      },
      {
        id: "e4c",
        title: "Launch reel rough cut",
        kind: "Video",
        owner: "Post-live editor",
        status: "Pending",
        coverage: "Planned for Beacon and replay inserts",
        imageUrl: EVIDENCE_TRUCK,
      },
    ],
    updates: [
      {
        id: "u1c",
        title: "Campaign opening date confirmed",
        summary: "The public campaign opens next Tuesday with a live prayer and student testimony segment.",
        kind: "Milestone",
        publishedISO: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
        linkedSurface: "Events follow-up",
        publicVisible: true,
        reachHint: "Great for warm-list reminder sequences before launch.",
      },
      {
        id: "u2c",
        title: "Thank you to early backers",
        summary: "Early donor support has already secured the first materials order for uniforms and books.",
        kind: "Thanks",
        publishedISO: new Date(Date.now() - 1000 * 60 * 60 * 80).toISOString(),
        linkedSurface: "Email journey",
        publicVisible: true,
        reachHint: "Keeps momentum warm before the broader public launch.",
      },
    ],
    hooks: [
      {
        id: "h1c",
        label: "Student testimony night",
        surface: "Event",
        state: "Ready",
        value: "Event page linked",
        ready: true,
        hint: "Event registration and campaign CTA now share the same audience segment.",
      },
      {
        id: "h2c",
        label: "Launch-week live appeal",
        surface: "Live Session",
        state: "Queued",
        value: "Scheduled for Tuesday",
        ready: true,
        hint: "Includes QR, lower third, and milestone animation.",
      },
      {
        id: "h3c",
        label: "Launch-week reminder journey",
        surface: "Notifications",
        state: "Ready",
        value: "4-step sequence",
        ready: true,
        hint: "Localized across English and Luganda segments.",
      },
      {
        id: "h4c",
        label: "Awareness clip boost",
        surface: "Beacon",
        state: "Draft",
        value: "Creative in review",
        ready: false,
        hint: "Hold launch until the student reel is finalized.",
      },
    ],
    governance: [
      {
        id: "g1c",
        label: "Student approvals complete",
        status: "Ready",
        owner: "Trust team",
        note: "Guardian and school-level approvals recorded.",
      },
      {
        id: "g2c",
        label: "Impact reporting framework",
        status: "Ready",
        owner: "Programs lead",
        note: "Term-level reporting plan built before launch.",
      },
      {
        id: "g3c",
        label: "Launch creative sign-off",
        status: "Review",
        owner: "Comms lead",
        note: "Awaiting final review for the hero video and subtitles.",
      },
    ],
  },
  {
    id: "cf_mission_bus",
    title: "Mission Bus Replacement",
    subtitle: "Replace the aging outreach bus used for prison ministry, village visits, and youth missions.",
    category: "Mobility & outreach",
    beneficiary: "Kingdom Outreach Transport",
    region: "Regional multi-campus",
    lifecycle: "Completed",
    verification: "Verified",
    story:
      "The mission bus serves prison visits, village outreaches, and student ministry routes. The current bus can no longer safely support regular travel, so the campaign funded a replacement and initial servicing.",
    urgency: "Primary campaign completed. Closeout report and evergreen support plan remain.",
    impactSummary:
      "£48k funded a replacement bus, safety upgrades, insurance, and initial maintenance reserve.",
    raised: 49850,
    goal: 48000,
    stretchGoal: 55000,
    donors: 912,
    ambassadors: 21,
    recentActivity: "Campaign completed last week · final delivery photos pending",
    deadlineISO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    matchActive: false,
    matchAmount: 0,
    proofCoveragePct: 93,
    governanceScore: 98,
    updateCount: 9,
    finalReportReady: true,
    evergreenEligible: true,
    heroImageUrl: HERO_BUS,
    accent: "green",
    milestones: [
      {
        id: "m1d",
        label: "Vehicle identified",
        target: 15000,
        impact: "Deposit secured and vehicle sourcing completed.",
        unlocked: true,
        nextFocus: "Archive milestone proof.",
      },
      {
        id: "m2d",
        label: "Purchase completed",
        target: 38000,
        impact: "Bus purchased, transferred, and inspected.",
        unlocked: true,
        nextFocus: "Prepare the final testimony reel.",
      },
      {
        id: "m3d",
        label: "Servicing and branding complete",
        target: 48000,
        impact: "Safety, insurance, and readiness completed for ministry use.",
        unlocked: true,
        nextFocus: "Publish the final impact report.",
      },
      {
        id: "m4d",
        label: "Stretch: fuel reserve and route support",
        target: 55000,
        impact: "Extended initial route support after bus delivery.",
        unlocked: false,
        nextFocus: "Offer evergreen support path instead.",
      },
    ],
    evidence: [
      {
        id: "e1d",
        title: "Vehicle inspection photos",
        kind: "Photo",
        owner: "Operations",
        status: "Ready",
        coverage: "Purchase and delivery proof",
        imageUrl: HERO_BUS,
      },
      {
        id: "e2d",
        title: "Purchase and service documentation",
        kind: "Field report",
        owner: "Finance office",
        status: "Ready",
        coverage: "Invoice, insurance, and service records",
        imageUrl: EVIDENCE_REPORT,
      },
      {
        id: "e3d",
        title: "First outreach route clip",
        kind: "Video",
        owner: "Media team",
        status: "Ready",
        coverage: "Used in final report and replay package",
        imageUrl: EVIDENCE_TRUCK,
      },
      {
        id: "e4d",
        title: "Beneficiary thank-you statements",
        kind: "Beneficiary proof",
        owner: "Outreach pastor",
        status: "Ready",
        coverage: "Approved for public closeout summary",
        imageUrl: EVIDENCE_CHILDREN,
      },
    ],
    updates: [
      {
        id: "u1d",
        title: "Replacement bus delivered",
        summary: "The new bus is in service and already supporting outreach and youth ministry routes.",
        kind: "Impact",
        publishedISO: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
        linkedSurface: "Replay thank-you",
        publicVisible: true,
        reachHint: "Use this as the lead story in the final closeout package.",
      },
      {
        id: "u2d",
        title: "Thank-you to all supporters",
        summary: "A full donor thank-you and impact summary is ready to send once the final route footage is approved.",
        kind: "Thanks",
        publishedISO: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
        linkedSurface: "Email and Beacon recap",
        publicVisible: true,
        reachHint: "Best paired with the bus-delivery montage.",
      },
    ],
    hooks: [
      {
        id: "h1d",
        label: "Final thank-you replay",
        surface: "Replay",
        state: "Ready",
        value: "Queued for publication",
        ready: true,
        hint: "Perfect for the closeout report and donor recap journey.",
      },
      {
        id: "h2d",
        label: "Impact montage clip",
        surface: "Clip",
        state: "Ready",
        value: "Approved and export-ready",
        ready: true,
        hint: "Use as the primary social proof asset.",
      },
      {
        id: "h3d",
        label: "Evergreen support follow-up",
        surface: "Notifications",
        state: "Draft",
        value: "Optional donor transition",
        ready: false,
        hint: "Would convert campaign supporters into broader transport supporters.",
      },
      {
        id: "h4d",
        label: "Bus delivery promotion",
        surface: "Beacon",
        state: "Ready",
        value: "Recap creative available",
        ready: true,
        hint: "Good for testimony-led top-of-funnel storytelling.",
      },
    ],
    governance: [
      {
        id: "g1d",
        label: "Purchase verification",
        status: "Ready",
        owner: "Finance office",
        note: "Full purchase and insurance trail completed.",
      },
      {
        id: "g2d",
        label: "Impact closeout pack",
        status: "Ready",
        owner: "Programs lead",
        note: "Impact report drafted and awaiting final publish.",
      },
      {
        id: "g3d",
        label: "Evergreen support review",
        status: "Review",
        owner: "Leadership",
        note: "Decision pending on turning supporters into a recurring transport fund.",
      },
    ],
  },
];

function Pill({
  tone = "neutral",
  children,
  title,
}: {
  tone?: "neutral" | "good" | "warn" | "bad" | "pro";
  children: React.ReactNode;
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
            : "bg-slate-100 text-slate-800 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700";
  return (
    <span title={title} className={cx("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-semibold ring-1 whitespace-nowrap", cls)}>
      {children}
    </span>
  );
}

function Btn({
  tone = "neutral",
  children,
  onClick,
  disabled,
  left,
  title,
  cls,
}: {
  tone?: "neutral" | "primary" | "secondary" | "ghost" | "danger";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  left?: React.ReactNode;
  title?: string;
  cls?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  const toneCls =
    tone === "primary"
      ? "text-white hover:brightness-95 shadow-sm"
      : tone === "secondary"
        ? "text-white hover:brightness-95 shadow-sm"
        : tone === "danger"
          ? "bg-rose-600 text-white hover:brightness-95 shadow-sm"
          : tone === "ghost"
            ? "bg-transparent text-slate-900 dark:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800"
            : "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 ring-1 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm";
  return (
    <button
      title={title}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cx(base, toneCls, cls)}
      style={tone === "primary" ? { background: EV_GREEN } : tone === "secondary" ? { background: EV_ORANGE } : undefined}
    >
      {left}
      {children}
    </button>
  );
}

function Modal({
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
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative flex w-full max-w-5xl flex-col bg-white dark:bg-slate-900 shadow-2xl transition-all h-[94vh] sm:h-auto sm:max-h-[92vh] rounded-t-3xl sm:rounded-3xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
          <div>
            <div className="text-base font-semibold text-slate-900 dark:text-slate-50">{title}</div>
            {subtitle ? <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</div> : null}
          </div>
          <Btn tone="ghost" onClick={onClose} left={<X className="h-4 w-4" />}>
            Close
          </Btn>
        </div>
        <div className="flex-1 overflow-auto p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
  subtitle,
  right,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-base font-bold text-slate-900 dark:text-slate-50 leading-tight">{title}</div>
          {subtitle ? <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-normal">{subtitle}</div> : null}
        </div>
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

function ProgressBar({ value, tone = "green" }: { value: number; tone?: "green" | "orange" | "navy" }) {
  const color = tone === "green" ? EV_GREEN : tone === "orange" ? EV_ORANGE : EV_NAVY;
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} />
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
  tone = "green",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "green" | "orange" | "navy";
}) {
  return <KpiTile label={label} value={value} hint={hint} tone={tone} className="min-h-[140px]" />;
}

function MiniLine({ values, tone = "green" }: { values: number[]; tone?: "green" | "orange" | "navy" }) {
  const w = 240;
  const h = 80;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pts = values
    .map((v, i) => {
      const x = (i / Math.max(1, values.length - 1)) * w;
      const y = h - ((v - min) / Math.max(1e-6, max - min)) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const stroke = tone === "green" ? EV_GREEN : tone === "orange" ? EV_ORANGE : EV_NAVY;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-20 w-full">
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`${pts} ${w},${h} 0,${h}`} fill={stroke} opacity="0.12" />
    </svg>
  );
}

function RegistryRow({
  record,
  active,
  onSelect,
  onDuplicate,
}: {
  record: CrowdfundRecord;
  active: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
}) {
  const progress = pct(record.raised, record.goal);
  const deadlineSoon = new Date(record.deadlineISO).getTime() - Date.now() < 1000 * 60 * 60 * 24 * 7;
  return (
    <div
      className={cx(
        "rounded-3xl border p-3 transition-all cursor-pointer",
        active
          ? "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 ring-2 ring-slate-200 dark:ring-slate-700 shadow-sm"
          : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800"
      )}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="truncate text-sm font-bold text-slate-900 dark:text-slate-50">{record.title}</div>
            <Pill tone={toneForLifecycle(record.lifecycle)}>{record.lifecycle}</Pill>
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{record.subtitle}</div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="rounded-xl bg-white dark:bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Duplicate
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <span>{record.category}</span>
        <span>•</span>
        <span>{record.region}</span>
        <span>•</span>
        <span>{fmtInt(record.donors)} donors</span>
        {record.matchActive ? (
          <>
            <span>•</span>
            <span className="font-semibold" style={{ color: EV_ORANGE }}>Match live</span>
          </>
        ) : null}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>{fmtCurrency(record.raised)} raised</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-1"><ProgressBar value={progress} tone={record.accent === "navy" ? "navy" : record.accent === "orange" ? "orange" : "green"} /></div>
        </div>
        <div className="text-right">
          <div className="text-sm font-extrabold text-slate-900 dark:text-slate-50">{fmtCurrency(record.goal)}</div>
          <div className={cx("text-[11px]", deadlineSoon ? "text-amber-600 dark:text-amber-400" : "text-slate-500 dark:text-slate-400")}>Deadline {fmtDate(record.deadlineISO)}</div>
        </div>
      </div>
    </div>
  );
}

function BrowserPreview({ record }: { record: CrowdfundRecord }) {
  const progress = pct(record.raised, record.goal);
  const stretch = pct(record.raised, record.stretchGoal);
  const latest = record.updates[0];
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl">
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-rose-400" />
        <span className="h-3 w-3 rounded-full bg-amber-400" />
        <span className="h-3 w-3 rounded-full bg-emerald-400" />
        <div className="ml-2 text-xs font-semibold text-slate-500 dark:text-slate-400">faithhub.org/care/crowdfund/{record.id}</div>
      </div>
      <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <div className="relative aspect-[16/8.5] overflow-hidden">
            <img src={record.heroImageUrl} alt={record.title} className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <span className="rounded-full bg-black/55 px-3 py-1 text-[11px] font-bold text-white">{record.category}</span>
              {record.matchActive ? <span className="rounded-full px-3 py-1 text-[11px] font-bold text-white" style={{ background: EV_ORANGE }}>Match live</span> : null}
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">FaithHub Crowdfund</div>
              <div className="mt-1 text-2xl font-extrabold text-white">{record.title}</div>
              <div className="mt-1 max-w-2xl text-sm text-white/85 line-clamp-2">{record.subtitle}</div>
            </div>
          </div>
          <div className="p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Raised</div>
                <div className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-slate-50">{fmtCurrency(record.raised)}</div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">of {fmtCurrency(record.goal)} · {fmtInt(record.donors)} donors</div>
                <div className="mt-3"><ProgressBar value={progress} tone={record.accent === "navy" ? "navy" : record.accent === "orange" ? "orange" : "green"} /></div>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">Stretch goal: {fmtCurrency(record.stretchGoal)} · {stretch}% reached</div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="text-[10px] uppercase tracking-wide text-slate-400">Donors</div>
                    <div className="mt-1 text-base font-extrabold text-slate-900 dark:text-slate-50">{fmtInt(record.donors)}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="text-[10px] uppercase tracking-wide text-slate-400">Ambassadors</div>
                    <div className="mt-1 text-base font-extrabold text-slate-900 dark:text-slate-50">{fmtInt(record.ambassadors)}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="text-[10px] uppercase tracking-wide text-slate-400">Proof</div>
                    <div className="mt-1 text-base font-extrabold text-slate-900 dark:text-slate-50">{record.proofCoveragePct}%</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Why this matters</div>
                  <div className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{record.story}</div>
                </div>
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Latest update</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{latest ? fmtRelative(latest.publishedISO) : "No updates"}</div>
                  </div>
                  {latest ? (
                    <>
                      <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-50">{latest.title}</div>
                      <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{latest.summary}</div>
                    </>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-2xl px-4 py-2 text-sm font-extrabold text-white" style={{ background: EV_GREEN }} onClick={handleRawPlaceholderAction("open_donations_funds")}>Give now</button>
                  <button className="rounded-2xl px-4 py-2 text-sm font-extrabold text-white" style={{ background: EV_ORANGE }} onClick={handleRawPlaceholderAction("copy_current_link")}>Share story</button>
                  <button className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-extrabold text-slate-900 dark:text-slate-50 ring-1 ring-slate-200 dark:ring-slate-700" onClick={handleRawPlaceholderAction("open_community_groups")}>Follow cause</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-l border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/70 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Momentum</div>
          <div className="mt-3 rounded-3xl bg-white dark:bg-slate-950 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
            <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Current urgency</div>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{record.urgency}</div>
            <div className="mt-3 rounded-2xl bg-slate-50 dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800 text-sm text-slate-600 dark:text-slate-300">{record.recentActivity}</div>
          </div>
          <div className="mt-4 rounded-3xl bg-white dark:bg-slate-950 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
            <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Milestones</div>
            <div className="mt-3 space-y-3">
              {record.milestones.slice(0, 3).map((m) => (
                <div key={m.id} className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">{m.label}</div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{fmtCurrency(m.target)} target</div>
                    </div>
                    <Pill tone={m.unlocked ? "good" : "neutral"}>{m.unlocked ? "Unlocked" : "Next"}</Pill>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhonePreview({ record }: { record: CrowdfundRecord }) {
  const progress = pct(record.raised, record.goal);
  return (
    <div className="mx-auto w-full max-w-[380px] md:max-w-[420px]">
      <div className="relative overflow-hidden rounded-[38px] bg-slate-950 p-3 shadow-2xl ring-1 ring-slate-800">
        <div className="absolute left-1/2 top-0 z-20 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-black" />
        <div className="overflow-hidden rounded-[30px] bg-white dark:bg-slate-950">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 px-4 py-3 backdrop-blur">
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-slate-900 dark:text-slate-50">{record.title}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">FaithHub Crowdfund</div>
            </div>
            <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-slate-700 dark:text-slate-300">{record.category}</div>
          </div>
          <div className="max-h-[680px] overflow-y-auto">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={record.heroImageUrl} alt={record.title} className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/75 to-transparent" />
              <div className="absolute left-4 bottom-4 right-4">
                <div className="text-lg font-extrabold text-white">{record.title}</div>
                <div className="mt-1 text-[13px] text-white/90 line-clamp-2">{record.subtitle}</div>
              </div>
            </div>
            <div className="space-y-4 p-4">
              <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-slate-400">Raised</div>
                    <div className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-50">{fmtCurrency(record.raised)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-50">{fmtCurrency(record.goal)}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Goal</div>
                  </div>
                </div>
                <div className="mt-3"><ProgressBar value={progress} tone={record.accent === "navy" ? "navy" : record.accent === "orange" ? "orange" : "green"} /></div>
                <div className="mt-2 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>{fmtInt(record.donors)} donors</span>
                  <span>{progress}% funded</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-2xl bg-white dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="text-lg font-extrabold text-slate-900 dark:text-slate-50">{fmtInt(record.ambassadors)}</div>
                    <div className="text-[10px] uppercase tracking-wide text-slate-400">Ambassadors</div>
                  </div>
                  <div className="rounded-2xl bg-white dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="text-lg font-extrabold text-slate-900 dark:text-slate-50">{record.proofCoveragePct}%</div>
                    <div className="text-[10px] uppercase tracking-wide text-slate-400">Proof</div>
                  </div>
                  <div className="rounded-2xl bg-white dark:bg-slate-950 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="text-lg font-extrabold text-slate-900 dark:text-slate-50">{fmtCurrency(record.matchAmount)}</div>
                    <div className="text-[10px] uppercase tracking-wide text-slate-400">Match</div>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Campaign story</div>
                <div className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{record.story}</div>
                <div className="mt-3 rounded-2xl bg-white dark:bg-slate-950 p-3 text-sm text-slate-600 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-800">{record.urgency}</div>
              </div>
              <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Latest public update</div>
                {record.updates[0] ? (
                  <>
                    <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-50">{record.updates[0].title}</div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{record.updates[0].summary}</div>
                  </>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="inline-flex items-center justify-center rounded-2xl px-4 py-3 text-[12px] font-extrabold text-white" style={{ background: EV_GREEN }} onClick={handleRawPlaceholderAction("open_donations_funds")}>Give now</button>
                <button className="inline-flex items-center justify-center rounded-2xl px-4 py-3 text-[12px] font-extrabold text-white" style={{ background: EV_ORANGE }} onClick={handleRawPlaceholderAction("copy_current_link")}>Share</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewCrowdfundComposer({
  onCreate,
  onClose,
}: {
  onCreate: (payload: CreateCrowdfundPayload) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [goal, setGoal] = useState("25000");
  const [stretchGoal, setStretchGoal] = useState("35000");
  const [region, setRegion] = useState("Greater Kampala");
  const [deadlineISO, setDeadlineISO] = useState(() => new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString().slice(0, 10));
  const [story, setStory] = useState("");
  const [urgency, setUrgency] = useState("");
  const [accent, setAccent] = useState<Accent>("green");

  const canCreate = title.trim().length >= 3 && beneficiary.trim().length >= 3 && Number(goal) > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Campaign title</div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Example: Emergency Food Relief" className="mt-1 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 px-3 py-3 text-sm ring-1 ring-slate-200 dark:ring-slate-800 outline-none" />
          </label>
          <label className="block">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Beneficiary</div>
            <input value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} placeholder="Organization or community" className="mt-1 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 px-3 py-3 text-sm ring-1 ring-slate-200 dark:ring-slate-800 outline-none" />
          </label>
          <label className="block">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Primary goal</div>
            <input value={goal} onChange={(e) => setGoal(e.target.value.replace(/[^\d]/g, ""))} className="mt-1 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 px-3 py-3 text-sm ring-1 ring-slate-200 dark:ring-slate-800 outline-none" />
          </label>
          <label className="block">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Stretch goal</div>
            <input value={stretchGoal} onChange={(e) => setStretchGoal(e.target.value.replace(/[^\d]/g, ""))} className="mt-1 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 px-3 py-3 text-sm ring-1 ring-slate-200 dark:ring-slate-800 outline-none" />
          </label>
          <label className="block">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Region</div>
            <input value={region} onChange={(e) => setRegion(e.target.value)} className="mt-1 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 px-3 py-3 text-sm ring-1 ring-slate-200 dark:ring-slate-800 outline-none" />
          </label>
          <label className="block">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Deadline</div>
            <input type="date" value={deadlineISO} onChange={(e) => setDeadlineISO(e.target.value)} className="mt-1 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 px-3 py-3 text-sm ring-1 ring-slate-200 dark:ring-slate-800 outline-none" />
          </label>
        </div>
        <label className="block">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Cause story</div>
          <textarea value={story} onChange={(e) => setStory(e.target.value)} rows={6} placeholder="Tell the story, the need, and the outcome this campaign will make possible." className="mt-1 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 px-3 py-3 text-sm ring-1 ring-slate-200 dark:ring-slate-800 outline-none" />
        </label>
        <label className="block">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Urgency framing</div>
          <textarea value={urgency} onChange={(e) => setUrgency(e.target.value)} rows={3} placeholder="What timing or public urgency should the audience understand?" className="mt-1 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 px-3 py-3 text-sm ring-1 ring-slate-200 dark:ring-slate-800 outline-none" />
        </label>
      </div>
      <div className="space-y-4">
        <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/40 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
          <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Campaign style</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              ["green", "Trust-led"],
              ["orange", "Urgency-led"],
              ["navy", "Institution-led"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setAccent(value as Accent)}
                className={cx(
                  "rounded-full px-3 py-2 text-xs font-semibold transition-colors",
                  accent === value ? "text-white" : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700"
                )}
                style={accent === value ? { background: accentColor(value as Accent) } : undefined}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/40 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
          <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Launch notes</div>
          <div className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">This starter setup creates the campaign shell, first milestone, first update slot, and standard governance checklist.</div>
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">After creation, route the campaign into Live Sessions, Audience Notifications, and Beacon from the workbench.</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn tone="primary" disabled={!canCreate} onClick={() => onCreate({
            title,
            beneficiary,
            goal: Number(goal || 0),
            stretchGoal: Number(stretchGoal || 0),
            region,
            deadlineISO: new Date(`${deadlineISO}T12:00:00`).toISOString(),
            story,
            urgency,
            accent,
          })} left={<Plus className="h-4 w-4" />}>Create crowdfund</Btn>
          <Btn tone="ghost" onClick={onClose}>Cancel</Btn>
        </div>
      </div>
    </div>
  );
}

function UpdateComposer({
  onPost,
  onClose,
}: {
  onPost: (payload: UpdatePayload) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [kind, setKind] = useState<UpdateKind>("Impact");
  const [linkedSurface, setLinkedSurface] = useState("Audience notifications");
  const canPost = title.trim().length >= 3 && summary.trim().length >= 10;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
      <div className="space-y-4">
        <label className="block">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Update title</div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Example: First relief packs delivered" className="mt-1 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 px-3 py-3 text-sm ring-1 ring-slate-200 dark:ring-slate-800 outline-none" />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Update type</div>
            <select value={kind} onChange={(e) => setKind(e.target.value as UpdateKind)} className="mt-1 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 px-3 py-3 text-sm ring-1 ring-slate-200 dark:ring-slate-800 outline-none">
              {["Impact", "Milestone", "Need", "Prayer", "Thanks"].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Linked surface</div>
            <select value={linkedSurface} onChange={(e) => setLinkedSurface(e.target.value)} className="mt-1 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 px-3 py-3 text-sm ring-1 ring-slate-200 dark:ring-slate-800 outline-none">
              {[
                "Audience notifications",
                "Live Session overlay",
                "Replay follow-up",
                "Beacon boost",
                "Event tie-in",
              ].map((surface) => (
                <option key={surface}>{surface}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Public summary</div>
          <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={6} placeholder="Write the public update exactly as supporters should see it." className="mt-1 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 px-3 py-3 text-sm ring-1 ring-slate-200 dark:ring-slate-800 outline-none" />
        </label>
      </div>
      <div className="space-y-4">
        <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/40 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
          <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Posting guidance</div>
          <div className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">Use updates to show real proof, answered prayers, milestone movement, or urgent new needs.</div>
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">Tie updates to Beacon and notifications while the context is still fresh and credible.</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn tone="primary" disabled={!canPost} onClick={() => onPost({ title, summary, kind, linkedSurface })} left={<Send className="h-4 w-4" />}>Post update</Btn>
          <Btn tone="ghost" onClick={onClose}>Cancel</Btn>
        </div>
      </div>
    </div>
  );
}

export default function CharityCrowdfundingWorkbenchPage() {
  const [records, setRecords] = useState<CrowdfundRecord[]>(SEED);
  const [selectedId, setSelectedId] = useState(SEED[0].id);
  const [registryFilter, setRegistryFilter] = useState<RegistryFilter>("all");
  const [search, setSearch] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [composerOpen, setComposerOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const selectedRecord = useMemo(
    () => records.find((record) => record.id === selectedId) || records[0],
    [records, selectedId],
  );

  const [subtitleDraft, setSubtitleDraft] = useState(selectedRecord.subtitle);
  const [beneficiaryDraft, setBeneficiaryDraft] = useState(selectedRecord.beneficiary);
  const [storyDraft, setStoryDraft] = useState(selectedRecord.story);
  const [urgencyDraft, setUrgencyDraft] = useState(selectedRecord.urgency);
  const [impactDraft, setImpactDraft] = useState(selectedRecord.impactSummary);
  const [goalDraft, setGoalDraft] = useState(String(selectedRecord.goal));
  const [stretchDraft, setStretchDraft] = useState(String(selectedRecord.stretchGoal));

  useEffect(() => {
    setSubtitleDraft(selectedRecord.subtitle);
    setBeneficiaryDraft(selectedRecord.beneficiary);
    setStoryDraft(selectedRecord.story);
    setUrgencyDraft(selectedRecord.urgency);
    setImpactDraft(selectedRecord.impactSummary);
    setGoalDraft(String(selectedRecord.goal));
    setStretchDraft(String(selectedRecord.stretchGoal));
  }, [selectedRecord]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(t);
  }, [toast]);

  const updateSelectedRecord = (updater: (record: CrowdfundRecord) => CrowdfundRecord) => {
    setRecords((prev) => prev.map((record) => (record.id === selectedId ? updater(record) : record)));
  };

  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase();
    return records.filter((record) => {
      const deadlineSoon = new Date(record.deadlineISO).getTime() - Date.now() < 1000 * 60 * 60 * 24 * 7;
      const match = !term || [record.title, record.subtitle, record.beneficiary, record.region, record.category].join(" ").toLowerCase().includes(term);
      if (!match) return false;
      if (registryFilter === "active") return record.lifecycle === "Active";
      if (registryFilter === "urgent") return deadlineSoon || record.matchActive;
      if (registryFilter === "closing") return deadlineSoon && record.lifecycle !== "Archived";
      if (registryFilter === "archived") return record.lifecycle === "Archived" || record.lifecycle === "Completed";
      return true;
    });
  }, [records, registryFilter, search]);

  const timelineSeries = useMemo(() => {
    const base = selectedRecord.raised / 1000;
    return Array.from({ length: 12 }, (_, idx) => Math.max(8, Math.round(base * (0.28 + idx * 0.05 + ((idx % 3) - 1) * 0.03))));
  }, [selectedRecord]);

  const donorSeries = useMemo(() => {
    const base = selectedRecord.donors / 40;
    return Array.from({ length: 12 }, (_, idx) => Math.max(5, Math.round(base * (0.55 + idx * 0.04 + (idx % 4) * 0.02))));
  }, [selectedRecord]);

  const lifecycleCounts = useMemo(() => ({
    draft: records.filter((r) => r.lifecycle === "Draft").length,
    scheduled: records.filter((r) => r.lifecycle === "Scheduled").length,
    active: records.filter((r) => r.lifecycle === "Active").length,
    paused: records.filter((r) => r.lifecycle === "Paused").length,
    completed: records.filter((r) => r.lifecycle === "Completed").length,
    archived: records.filter((r) => r.lifecycle === "Archived").length,
  }), [records]);

  const activeHooks = selectedRecord.hooks.filter((hook) => hook.ready).length;
  const riskFlags = selectedRecord.governance.filter((item) => item.status !== "Ready").length;
  const progress = pct(selectedRecord.raised, selectedRecord.goal);
  const stretchProgress = pct(selectedRecord.raised, selectedRecord.stretchGoal);
  const proofReady = selectedRecord.evidence.filter((asset) => asset.status === "Ready").length;
  const nextMilestone = selectedRecord.milestones.find((m) => !m.unlocked) || selectedRecord.milestones[selectedRecord.milestones.length - 1];

  const saveStoryBuilder = () => {
    updateSelectedRecord((record) => ({
      ...record,
      subtitle: subtitleDraft.trim() || record.subtitle,
      beneficiary: beneficiaryDraft.trim() || record.beneficiary,
      story: storyDraft.trim() || record.story,
      urgency: urgencyDraft.trim() || record.urgency,
      impactSummary: impactDraft.trim() || record.impactSummary,
      goal: Math.max(1, Number(goalDraft || record.goal)),
      stretchGoal: Math.max(1, Number(stretchDraft || record.stretchGoal)),
    }));
    setToast("Campaign story builder saved");
  };

  const duplicateSelected = () => {
    const clone: CrowdfundRecord = {
      ...selectedRecord,
      id: `${selectedRecord.id}_${Math.random().toString(16).slice(2, 6)}`,
      title: `${selectedRecord.title} Copy`,
      lifecycle: "Draft",
      raised: 0,
      donors: 0,
      recentActivity: "New draft copy ready for editing",
      updates: [],
      updateCount: 0,
      matchActive: false,
      finalReportReady: false,
    };
    setRecords((prev) => [clone, ...prev]);
    setSelectedId(clone.id);
    setToast(`Duplicated ${selectedRecord.title}`);
  };

  const createCrowdfund = (payload: CreateCrowdfundPayload) => {
    const next: CrowdfundRecord = {
      id: `cf_${Math.random().toString(16).slice(2, 8)}`,
      title: payload.title,
      subtitle: payload.story.slice(0, 92) || `${payload.beneficiary} support campaign`,
      category: "Charity crowdfund",
      beneficiary: payload.beneficiary,
      region: payload.region,
      lifecycle: "Draft",
      verification: "Review",
      story: payload.story,
      urgency: payload.urgency || "Draft urgency statement pending",
      impactSummary: `Targeting ${fmtCurrency(payload.goal)} for ${payload.beneficiary}.`,
      raised: 0,
      goal: payload.goal,
      stretchGoal: payload.stretchGoal || Math.round(payload.goal * 1.35),
      donors: 0,
      ambassadors: 0,
      recentActivity: "New crowdfund shell created",
      deadlineISO: payload.deadlineISO,
      matchActive: false,
      matchAmount: 0,
      proofCoveragePct: 28,
      governanceScore: 76,
      updateCount: 0,
      finalReportReady: false,
      evergreenEligible: false,
      heroImageUrl: payload.accent === "orange" ? HERO_RELIEF : payload.accent === "navy" ? HERO_SCHOOLS : HERO_WATER,
      accent: payload.accent,
      milestones: [
        {
          id: `mil_${Math.random().toString(16).slice(2, 6)}`,
          label: "Launch milestone",
          target: Math.round(payload.goal * 0.35),
          impact: "First wave of beneficiary support and public proof-of-impact assets.",
          unlocked: false,
          nextFocus: "Confirm launch creative and first proof pack.",
        },
        {
          id: `mil_${Math.random().toString(16).slice(2, 6)}`,
          label: "Primary campaign goal",
          target: payload.goal,
          impact: "Core campaign objective fully funded.",
          unlocked: false,
          nextFocus: "Prepare stretch goal narrative and follow-up update.",
        },
        {
          id: `mil_${Math.random().toString(16).slice(2, 6)}`,
          label: "Stretch milestone",
          target: payload.stretchGoal || Math.round(payload.goal * 1.35),
          impact: "Adds long-tail support and resilience features.",
          unlocked: false,
          nextFocus: "Align Beacon creative with stretch-goal proof.",
        },
      ],
      evidence: [
        {
          id: `ev_${Math.random().toString(16).slice(2, 6)}`,
          title: "Launch proof pack",
          kind: "Field report",
          owner: "Campaign owner",
          status: "Pending",
          coverage: "Attach source documents, photos, and partner notes.",
          imageUrl: EVIDENCE_REPORT,
        },
      ],
      updates: [],
      hooks: [
        {
          id: `hk_${Math.random().toString(16).slice(2, 6)}`,
          label: "Live Session insertion",
          surface: "Live Session",
          state: "Draft",
          value: "Not configured",
          ready: false,
          hint: "Insert this crowdfund into a sermon or fundraiser moment.",
        },
        {
          id: `hk_${Math.random().toString(16).slice(2, 6)}`,
          label: "Beacon campaign",
          surface: "Beacon",
          state: "Draft",
          value: "No creative linked",
          ready: false,
          hint: "Promote with linked or standalone Beacon once assets are approved.",
        },
      ],
      governance: [
        {
          id: `gov_${Math.random().toString(16).slice(2, 6)}`,
          label: "Beneficiary verification",
          status: "Review",
          owner: "Trust team",
          note: "Upload beneficiary verification before publish.",
        },
        {
          id: `gov_${Math.random().toString(16).slice(2, 6)}`,
          label: "Fund-use explanation",
          status: "Review",
          owner: "Campaign owner",
          note: "Add public explanation of how funds will be used.",
        },
      ],
    };
    setRecords((prev) => [next, ...prev]);
    setSelectedId(next.id);
    setComposerOpen(false);
    setToast(`Created ${payload.title}`);
  };

  const postCampaignUpdate = (payload: UpdatePayload) => {
    updateSelectedRecord((record) => ({
      ...record,
      updates: [
        {
          id: `upd_${Math.random().toString(16).slice(2, 6)}`,
          title: payload.title,
          summary: payload.summary,
          kind: payload.kind,
          publishedISO: new Date().toISOString(),
          linkedSurface: payload.linkedSurface,
          publicVisible: true,
          reachHint: "Fresh update posted from the workbench.",
        },
        ...record.updates,
      ],
      updateCount: record.updateCount + 1,
      recentActivity: `${payload.kind} update posted just now`,
    }));
    setUpdateOpen(false);
    setToast("Campaign update posted");
  };

  const toggleHookReady = (hookId: string) => {
    updateSelectedRecord((record) => ({
      ...record,
      hooks: record.hooks.map((hook) =>
        hook.id === hookId
          ? {
              ...hook,
              ready: !hook.ready,
              state: !hook.ready ? "Ready" : hook.surface === "Live Session" ? "Draft" : "Draft",
              value: !hook.ready ? hook.value : "Needs refresh",
            }
          : hook,
      ),
    }));
    setToast("Distribution hook updated");
  };

  const markGovernanceReady = (itemId: string) => {
    updateSelectedRecord((record) => ({
      ...record,
      governance: record.governance.map((item) =>
        item.id === itemId ? { ...item, status: "Ready", note: "Marked ready from the workbench." } : item,
      ),
      governanceScore: Math.min(100, record.governanceScore + 3),
    }));
    setToast("Governance item marked ready");
  };

  const publishImpactReport = () => {
    updateSelectedRecord((record) => ({
      ...record,
      finalReportReady: true,
      recentActivity: "Impact report published to supporters and archive surfaces",
    }));
    setToast("Impact report published");
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f2f2f2] dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors overflow-x-hidden">
      <div className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur transition-colors">
        <div className="w-full px-4 md:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                <span className="hover:text-slate-700 dark:hover:text-slate-200">FaithHub Provider</span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="hover:text-slate-700 dark:hover:text-slate-200">Events &amp; Giving</span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">Charity Crowdfunding Workbench</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">FH-P-061 · Charity Crowdfunding Workbench</div>
                <Pill tone="good">
                  <BadgeCheck className="h-3.5 w-3.5" /> Momentum engine
                </Pill>
                <Pill tone="pro">
                  <Sparkles className="h-3.5 w-3.5" /> Proof of impact
                </Pill>
              </div>
              <div className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                Premium charity campaign operations with goals, public momentum, proof of impact, updates, governance, and cross-links into live, notifications, and Beacon.
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Btn tone="ghost" onClick={() => setPreviewOpen(true)} left={<Eye className="h-4 w-4" />}>Preview</Btn>
              <Btn tone="primary" onClick={() => setComposerOpen(true)} left={<Plus className="h-4 w-4" />}>+ New Crowdfund</Btn>
              <Btn tone="secondary" onClick={() => setUpdateOpen(true)} left={<Send className="h-4 w-4" />}>Post campaign update</Btn>
              <Btn tone="neutral" onClick={() => safeNav(ROUTES.beaconBuilder)} left={<Zap className="h-4 w-4" />}>Promote with Beacon</Btn>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
          <div className="w-full px-4 md:px-6 lg:px-8 py-3">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-800 text-sm font-bold text-slate-900 dark:text-slate-100">{selectedRecord.title}</div>
                <Pill tone="good">{progress}% funded</Pill>
                <Pill tone={toneForVerification(selectedRecord.verification)}>{selectedRecord.verification}</Pill>
                <Pill tone={riskFlags ? "warn" : "good"}>{riskFlags ? `${riskFlags} governance reviews` : "Governance clean"}</Pill>
                <Pill tone="neutral">{proofReady}/{selectedRecord.evidence.length} proof assets ready</Pill>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Btn tone="ghost" onClick={() => { navigator.clipboard?.writeText(`https://faithhub.app/crowdfund/${selectedRecord.id}`); setToast("Campaign link copied"); }} left={<Copy className="h-4 w-4" />}>Copy link</Btn>
                <Btn tone="ghost" onClick={() => setToast("Exported campaign report")} left={<Download className="h-4 w-4" />}>Export report</Btn>
                <Btn tone="secondary" onClick={() => safeNav(ROUTES.donationsFunds)} left={<ExternalLink className="h-4 w-4" />}>Open donations &amp; funds</Btn>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
              <SectionTitle
                icon={<Layers className="h-5 w-5" />}
                title="Campaign roster"
                subtitle="All active, scheduled, and archived charity campaigns with urgency and proof context."
              />
              <div className="mt-4 space-y-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search campaigns, beneficiaries, or regions"
                    className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800 px-10 py-3 text-sm text-slate-900 dark:text-slate-50 ring-1 ring-slate-200 dark:ring-slate-800 outline-none"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    ["all", "All"],
                    ["active", "Active"],
                    ["urgent", "Urgent"],
                    ["closing", "Closing"],
                    ["archived", "Archived"],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setRegistryFilter(key as RegistryFilter)}
                      className={cx(
                        "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                        registryFilter === key ? "text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
                      )}
                      style={registryFilter === key ? { background: key === "urgent" ? EV_ORANGE : key === "archived" ? EV_NAVY : EV_GREEN } : undefined}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="space-y-3 max-h-[760px] overflow-y-auto pr-1">
                  {filteredRecords.map((record) => (
                    <RegistryRow
                      key={record.id}
                      record={record}
                      active={selectedId === record.id}
                      onSelect={() => setSelectedId(record.id)}
                      onDuplicate={() => {
                        setSelectedId(record.id);
                        setTimeout(duplicateSelected, 0);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
              <SectionTitle
                icon={<FileText className="h-5 w-5" />}
                title="Campaign story builder"
                subtitle="Set the cause story, beneficiary context, urgency framing, and public impact promise."
              />
              <div className="mt-4 space-y-3">
                <label className="block">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Public subtitle</div>
                  <input value={subtitleDraft} onChange={(e) => setSubtitleDraft(e.target.value)} className="mt-1 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 px-3 py-3 text-sm ring-1 ring-slate-200 dark:ring-slate-800 outline-none" />
                </label>
                <label className="block">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Beneficiary</div>
                  <input value={beneficiaryDraft} onChange={(e) => setBeneficiaryDraft(e.target.value)} className="mt-1 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 px-3 py-3 text-sm ring-1 ring-slate-200 dark:ring-slate-800 outline-none" />
                </label>
                <label className="block">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Cause story</div>
                  <textarea value={storyDraft} onChange={(e) => setStoryDraft(e.target.value)} rows={6} className="mt-1 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 px-3 py-3 text-sm ring-1 ring-slate-200 dark:ring-slate-800 outline-none" />
                </label>
                <label className="block">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Urgency framing</div>
                  <textarea value={urgencyDraft} onChange={(e) => setUrgencyDraft(e.target.value)} rows={3} className="mt-1 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 px-3 py-3 text-sm ring-1 ring-slate-200 dark:ring-slate-800 outline-none" />
                </label>
                <label className="block">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Impact promise</div>
                  <textarea value={impactDraft} onChange={(e) => setImpactDraft(e.target.value)} rows={3} className="mt-1 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 px-3 py-3 text-sm ring-1 ring-slate-200 dark:ring-slate-800 outline-none" />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Primary goal</div>
                    <input value={goalDraft} onChange={(e) => setGoalDraft(e.target.value.replace(/[^\d]/g, ""))} className="mt-1 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 px-3 py-3 text-sm ring-1 ring-slate-200 dark:ring-slate-800 outline-none" />
                  </label>
                  <label className="block">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Stretch goal</div>
                    <input value={stretchDraft} onChange={(e) => setStretchDraft(e.target.value.replace(/[^\d]/g, ""))} className="mt-1 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 px-3 py-3 text-sm ring-1 ring-slate-200 dark:ring-slate-800 outline-none" />
                  </label>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Btn tone="primary" onClick={saveStoryBuilder} left={<CheckCircle2 className="h-4 w-4" />}>Save story builder</Btn>
                  <Btn tone="ghost" onClick={() => setToast("Suggested story framing generated") } left={<Sparkles className="h-4 w-4" />}>Suggest better framing</Btn>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
              <SectionTitle
                icon={<Target className="h-5 w-5" />}
                title="Goal and milestone panel"
                subtitle="Track target, stretch, milestone unlocks, and real-world impact mapping."
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <MetricCard label="Raised" value={fmtCurrency(selectedRecord.raised)} hint={`${progress}% of goal`} tone={selectedRecord.accent === "navy" ? "navy" : selectedRecord.accent === "orange" ? "orange" : "green"} />
                <MetricCard label="Stretch" value={fmtCurrency(selectedRecord.stretchGoal)} hint={`${stretchProgress}% reached`} tone="orange" />
              </div>
              <div className="mt-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Current target</div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{selectedRecord.impactSummary}</div>
                  </div>
                  {selectedRecord.matchActive ? <Pill tone="warn">Match {fmtCurrency(selectedRecord.matchAmount)}</Pill> : null}
                </div>
                <div className="mt-3 space-y-2">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400"><span>Primary goal</span><span>{progress}%</span></div>
                    <div className="mt-1"><ProgressBar value={progress} tone={selectedRecord.accent === "navy" ? "navy" : selectedRecord.accent === "orange" ? "orange" : "green"} /></div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400"><span>Stretch goal</span><span>{stretchProgress}%</span></div>
                    <div className="mt-1"><ProgressBar value={stretchProgress} tone="orange" /></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {selectedRecord.milestones.map((milestone) => (
                  <div key={milestone.id} className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-slate-50">{milestone.label}</div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{fmtCurrency(milestone.target)} · {milestone.impact}</div>
                      </div>
                      <Pill tone={milestone.unlocked ? "good" : nextMilestone.id === milestone.id ? "warn" : "neutral"}>{milestone.unlocked ? "Unlocked" : nextMilestone.id === milestone.id ? "Next" : "Locked"}</Pill>
                    </div>
                    <div className="mt-3 rounded-2xl bg-white dark:bg-slate-900 p-3 text-xs text-slate-600 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-800">{milestone.nextFocus}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
              <SectionTitle
                icon={<ImageIcon className="h-5 w-5" />}
                title="Evidence and impact gallery"
                subtitle="Proof assets, field reports, beneficiary validation, and media readiness across the campaign life cycle."
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {selectedRecord.evidence.map((asset) => (
                  <div key={asset.id} className="overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-800/50 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={asset.imageUrl} alt={asset.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-50">{asset.title}</div>
                          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{asset.kind} · {asset.owner}</div>
                        </div>
                        <Pill tone={asset.status === "Ready" ? "good" : asset.status === "Pending" ? "warn" : "bad"}>{asset.status}</Pill>
                      </div>
                      <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-3">{asset.coverage}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Proof coverage</div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Evidence, reporting, and beneficiary proof confidence.</div>
                  </div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-slate-50">{selectedRecord.proofCoveragePct}%</div>
                </div>
                <div className="mt-3"><ProgressBar value={selectedRecord.proofCoveragePct} tone={selectedRecord.proofCoveragePct >= 85 ? "green" : selectedRecord.proofCoveragePct >= 70 ? "orange" : "navy"} /></div>
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
              <SectionTitle
                icon={<MessageSquare className="h-5 w-5" />}
                title="Updates timeline"
                subtitle="Public campaign updates, milestone celebrations, needs, prayer requests, and supporter thank-you notes."
                right={<Btn tone="ghost" onClick={() => setUpdateOpen(true)} left={<Plus className="h-4 w-4" />}>New update</Btn>}
              />
              <div className="mt-4 space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {selectedRecord.updates.map((update) => (
                  <div key={update.id} className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-50">{update.title}</div>
                          <Pill tone={update.kind === "Need" ? "warn" : update.kind === "Prayer" ? "pro" : update.kind === "Thanks" ? "good" : "neutral"}>{update.kind}</Pill>
                        </div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{fmtDate(update.publishedISO)} · {fmtRelative(update.publishedISO)} · {update.linkedSurface}</div>
                      </div>
                      <Pill tone={update.publicVisible ? "good" : "neutral"}>{update.publicVisible ? "Public" : "Internal"}</Pill>
                    </div>
                    <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">{update.summary}</div>
                    <div className="mt-3 rounded-2xl bg-white dark:bg-slate-900 p-3 text-xs text-slate-500 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-800">{update.reachHint}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
              <SectionTitle
                icon={<MonitorPlay className="h-5 w-5" />}
                title="Preview + momentum"
                subtitle="Public-facing campaign preview with momentum mechanics, social proof, and mobile-first donor experience."
                right={<Btn tone="ghost" onClick={() => setPreviewOpen(true)} left={<Eye className="h-4 w-4" />}>Expand</Btn>}
              />
              <div className="mt-4 rounded-3xl bg-slate-50 dark:bg-slate-800/40 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px] items-start">
                  <div className="overflow-hidden rounded-3xl ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-950">
                    <div className="aspect-[16/10] relative overflow-hidden">
                      <img src={selectedRecord.heroImageUrl} alt={selectedRecord.title} className="h-full w-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute left-4 bottom-4 right-4">
                        <div className="text-lg font-extrabold text-white line-clamp-2">{selectedRecord.title}</div>
                        <div className="mt-1 text-[12px] text-white/90 line-clamp-1">{selectedRecord.beneficiary}</div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-xl font-extrabold text-slate-900 dark:text-slate-50">{fmtCurrency(selectedRecord.raised)}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">of {fmtCurrency(selectedRecord.goal)} raised</div>
                        </div>
                        <Pill tone="good">{progress}% funded</Pill>
                      </div>
                      <div className="mt-3"><ProgressBar value={progress} tone={selectedRecord.accent === "navy" ? "navy" : selectedRecord.accent === "orange" ? "orange" : "green"} /></div>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800 text-center">
                          <div className="text-base font-extrabold text-slate-900 dark:text-slate-50">{fmtInt(selectedRecord.donors)}</div>
                          <div className="text-[10px] uppercase tracking-wide text-slate-400">Donors</div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800 text-center">
                          <div className="text-base font-extrabold text-slate-900 dark:text-slate-50">{fmtInt(selectedRecord.ambassadors)}</div>
                          <div className="text-[10px] uppercase tracking-wide text-slate-400">Ambassadors</div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800 text-center">
                          <div className="text-base font-extrabold text-slate-900 dark:text-slate-50">{selectedRecord.matchActive ? fmtCurrency(selectedRecord.matchAmount) : "—"}</div>
                          <div className="text-[10px] uppercase tracking-wide text-slate-400">Matching</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[28px] bg-slate-950 p-3 shadow-xl">
                    <div className="overflow-hidden rounded-[24px] bg-white dark:bg-slate-950">
                      <div className="h-10 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 flex items-center justify-between">
                        <div className="text-[11px] font-bold text-slate-900 dark:text-slate-50 truncate">Mobile preview</div>
                        <div className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-700 dark:text-slate-300">Phone</div>
                      </div>
                      <div className="p-3 space-y-3">
                        <div className="aspect-[4/3] overflow-hidden rounded-2xl"><img src={selectedRecord.heroImageUrl} alt={selectedRecord.title} className="h-full w-full object-cover" /></div>
                        <div className="text-sm font-extrabold text-slate-900 dark:text-slate-50 line-clamp-2">{selectedRecord.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{fmtCurrency(selectedRecord.raised)} of {fmtCurrency(selectedRecord.goal)}</div>
                        <div><ProgressBar value={progress} tone={selectedRecord.accent === "navy" ? "navy" : selectedRecord.accent === "orange" ? "orange" : "green"} /></div>
                        <div className="grid grid-cols-2 gap-2">
                          <button className="rounded-2xl px-3 py-2 text-[11px] font-extrabold text-white" style={{ background: EV_GREEN }} onClick={handleRawPlaceholderAction("open_donations_funds")}>Give now</button>
                          <button className="rounded-2xl px-3 py-2 text-[11px] font-extrabold text-white" style={{ background: EV_ORANGE }} onClick={handleRawPlaceholderAction("copy_current_link")}>Share</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Funding movement</div>
                  <div className="mt-3"><MiniLine values={timelineSeries} tone={selectedRecord.accent === "navy" ? "navy" : selectedRecord.accent === "orange" ? "orange" : "green"} /></div>
                </div>
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Donor momentum</div>
                  <div className="mt-3"><MiniLine values={donorSeries} tone="orange" /></div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
              <SectionTitle
                icon={<Zap className="h-5 w-5" />}
                title="Distribution and conversion hooks"
                subtitle="Insert the crowdfund into live, replay, clip, notifications, events, and Beacon with purpose-built CTAs."
              />
              <div className="mt-4 space-y-3">
                {selectedRecord.hooks.map((hook) => (
                  <div key={hook.id} className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-50">{hook.label}</div>
                          <Pill tone={toneForHook(hook.state)}>{hook.state}</Pill>
                        </div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hook.surface} · {hook.value}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleHookReady(hook.id)}
                        className={cx(
                          "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                          hook.ready ? "text-white" : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700"
                        )}
                        style={hook.ready ? { background: EV_GREEN } : undefined}
                      >
                        {hook.ready ? "Ready" : "Enable"}
                      </button>
                    </div>
                    <div className="mt-3 rounded-2xl bg-white dark:bg-slate-900 p-3 text-xs text-slate-600 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-800">{hook.hint}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Btn tone="secondary" onClick={() => safeNav(ROUTES.beaconBuilder)} left={<Megaphone className="h-4 w-4" />}>Open Beacon Builder</Btn>
                <Btn tone="ghost" onClick={() => safeNav(ROUTES.liveBuilder)} left={<MonitorPlay className="h-4 w-4" />}>Insert into Live Session</Btn>
                <Btn tone="ghost" onClick={() => safeNav(ROUTES.audienceNotifications)} left={<Bell className="h-4 w-4" />}>Create reminder journey</Btn>
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
              <SectionTitle
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Risk, governance, and approval lane"
                subtitle="Ownership, approvals, beneficiary verification, fund-use notes, and trust controls across the campaign."
              />
              <div className="mt-4 space-y-3">
                {selectedRecord.governance.map((item) => (
                  <div key={item.id} className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-50">{item.label}</div>
                          <Pill tone={toneForGovernance(item.status)}>{item.status}</Pill>
                        </div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Owner: {item.owner}</div>
                      </div>
                      {item.status !== "Ready" ? (
                        <Btn tone="ghost" onClick={() => markGovernanceReady(item.id)} cls="px-3 py-1.5 text-xs">Mark ready</Btn>
                      ) : null}
                    </div>
                    <div className="mt-3 rounded-2xl bg-white dark:bg-slate-900 p-3 text-xs text-slate-600 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-800">{item.note}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <MetricCard label="Governance score" value={`${selectedRecord.governanceScore}%`} hint="Trust and documentation readiness" tone="navy" />
                <MetricCard label="Risk flags" value={String(riskFlags)} hint="Open reviews or restricted assets" tone={riskFlags ? "orange" : "green"} />
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
              <SectionTitle
                icon={<Workflow className="h-5 w-5" />}
                title="Campaign closeout and reporting"
                subtitle="Final summaries, archival, donor follow-up, evergreen transitions, and impact reporting once the campaign ends."
              />
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <MetricCard label="Draft" value={String(lifecycleCounts.draft)} hint="Needs setup" tone="navy" />
                <MetricCard label="Scheduled" value={String(lifecycleCounts.scheduled)} hint="Awaiting launch" tone="orange" />
                <MetricCard label="Active" value={String(lifecycleCounts.active)} hint="Driving support" tone="green" />
                <MetricCard label="Paused" value={String(lifecycleCounts.paused)} hint="Review in progress" tone="orange" />
                <MetricCard label="Completed" value={String(lifecycleCounts.completed)} hint="Needs closeout" tone="navy" />
                <MetricCard label="Archived" value={String(lifecycleCounts.archived)} hint="Historical" tone="navy" />
              </div>
              <div className="mt-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Current closeout status</div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{selectedRecord.finalReportReady ? "Impact report published and ready for evergreen archive." : "Impact report not yet published."}</div>
                  </div>
                  <Pill tone={selectedRecord.finalReportReady ? "good" : "warn"}>{selectedRecord.finalReportReady ? "Published" : "Pending"}</Pill>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <div className="rounded-2xl bg-white dark:bg-slate-900 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-800">Archive or repurpose old crowdfunds without losing proof and donor history.</div>
                  <div className="rounded-2xl bg-white dark:bg-slate-900 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-800">Transition high-trust campaigns into evergreen support funds where ministry leaders approve it.</div>
                  <div className="rounded-2xl bg-white dark:bg-slate-900 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-800">Create donor thank-you follow-up, replay recap, and Beacon afterglow campaigns while context is still fresh.</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Btn tone="primary" onClick={publishImpactReport} left={<CheckCircle2 className="h-4 w-4" />}>Publish impact report</Btn>
                <Btn tone="secondary" onClick={() => setToast("Donor follow-up journey opened")} left={<HeartHandshake className="h-4 w-4" />}>Donor follow-up</Btn>
                <Btn tone="ghost" onClick={() => setToast("Evergreen support review opened")} left={<ArrowUpRight className="h-4 w-4" />}>Move to evergreen</Btn>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Crowdfund destination preview"
        subtitle="Desktop and mobile donor-facing previews with public momentum, proof, and CTA behavior."
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewMode("desktop")}
                className={cx(
                  "rounded-full px-3 py-1.5 text-xs font-semibold",
                  previewMode === "desktop" ? "text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
                )}
                style={previewMode === "desktop" ? { background: EV_NAVY } : undefined}
              >
                Desktop preview
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("mobile")}
                className={cx(
                  "rounded-full px-3 py-1.5 text-xs font-semibold",
                  previewMode === "mobile" ? "text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
                )}
                style={previewMode === "mobile" ? { background: EV_GREEN } : undefined}
              >
                Mobile preview
              </button>
            </div>
            {previewMode === "desktop" ? <BrowserPreview record={selectedRecord} /> : <PhonePreview record={selectedRecord} />}
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/40 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Preview notes</div>
              <div className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">This preview mirrors the premium public destination with goals, donors, milestones, updates, and direct giving CTA placement.</div>
                <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">Campaign momentum should feel alive: social proof, urgency, proof of impact, and stretch-goal storytelling must all be visible without feeling exploitative.</div>
                <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">After publish, route the same campaign into Live Sessions, replay follow-up, notifications, and Beacon while preserving governance context.</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Btn tone="primary" onClick={() => setToast("Public campaign published")} left={<CheckCircle2 className="h-4 w-4" />}>Publish campaign</Btn>
              <Btn tone="secondary" onClick={() => safeNav(ROUTES.beaconBuilder)} left={<Megaphone className="h-4 w-4" />}>Create Beacon boost</Btn>
              <Btn tone="ghost" onClick={() => safeNav(ROUTES.audienceNotifications)} left={<Bell className="h-4 w-4" />}>Send campaign follow-up</Btn>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        title="+ New Crowdfund"
        subtitle="Create a premium charity crowdfunding destination with goals, proof, momentum, and live promotion hooks."
      >
        <NewCrowdfundComposer onCreate={createCrowdfund} onClose={() => setComposerOpen(false)} />
      </Modal>

      <Modal
        open={updateOpen}
        onClose={() => setUpdateOpen(false)}
        title="Post campaign update"
        subtitle="Publish a public update, milestone, need, prayer request, or supporter thank-you note."
      >
        <UpdateComposer onPost={postCampaignUpdate} onClose={() => setUpdateOpen(false)} />
      </Modal>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-[120] -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-2xl">
          {toast}
        </div>
      ) : null}
    </div>
  );
}







