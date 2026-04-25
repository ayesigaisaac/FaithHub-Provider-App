// @ts-nocheck

"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Download,
  Eye,
  Gift,
  Globe2,
  HeartHandshake,
  Image as ImageIcon,
  Layers,
  Link2,
  MapPin,
  MonitorPlay,
  Plus,
  QrCode,
  Radio,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Ticket,
  Users,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { KpiTile } from "../../../components/ui/KpiTile";
import { navigateWithRouter } from "@/navigation/routerNavigate";

/**
 * Provider â€” Events Manager
 * ----------------------------------
 * Premium event operating system for Provider Workspace.
 *
 * Design goals
 * - Keep the same premium creator-style control-surface direction used across earlier Provider pages.
 * - Use EVzone Green as primary and Orange as secondary, with soft grey neutrals for premium surfaces.
 * - Cover the full premium spec: event command list, setup workspace, attendance/ticketing,
 *   live and content ties, logistics, promotion, giving/merchandising, and after-event follow-up.
 * - Include a right-side preview rail plus dedicated preview and check-in mode drawers.
 *
 * Notes
 * - Self-contained mock TSX page. Replace mock data, routing, exports, and persistence during integration.
 * - Tailwind-style utility classes assumed.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#0b1d49";

const ROUTES = {
  liveBuilder: "/faithhub/provider/live-builder",
  donationsFunds: "/faithhub/provider/donations-funds",
  beaconBuilder: "/faithhub/provider/beacon-builder",
  liveDashboard: "/faithhub/provider/live-dashboard",
  postLivePublishing: "/faithhub/provider/post-live-publishing",
};

const HERO_CONFERENCE =
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80";
const HERO_RETREAT =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80";
const HERO_MARKET =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80";
const HERO_BAPTISM =
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1600&q=80";

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  navigateWithRouter(url);
}

function fmtLocal(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtShortDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
  });
}

function fmtInt(n: number) {
  return Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(n);
}

function pct(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Math.max(0, Math.min(100, Math.round((numerator / denominator) * 100)));
}

type EventStatus = "Draft" | "Upcoming" | "Live now" | "Completed";
type TicketingState = "RSVP only" | "Free ticket" | "Paid ticket" | "Invite only";
type LogisticsStatus = "Ready" | "At risk" | "Blocked";
type PreviewMode = "desktop" | "mobile";
type EventCategory =
  | "Conference"
  | "Service"
  | "Retreat"
  | "Outreach day"
  | "Trip"
  | "Baptism"
  | "Marketplace day"
  | "Class";

type AgendaItem = {
  id: string;
  time: string;
  title: string;
  owner: string;
  kind: string;
};

type SpeakerItem = {
  id: string;
  name: string;
  role: string;
  confirmed: boolean;
};

type VolunteerRole = {
  id: string;
  role: string;
  assigned: number;
  needed: number;
};

type LogisticsItem = {
  id: string;
  label: string;
  status: LogisticsStatus;
  owner: string;
  note: string;
};

type TierItem = {
  id: string;
  label: string;
  priceLabel: string;
  sold: number;
  cap: number;
};

type FAQItem = {
  id: string;
  q: string;
  a: string;
};

type PromotionChannel = {
  id: string;
  label: string;
  hint: string;
  enabled: boolean;
  health: string;
};

type FollowUpItem = {
  id: string;
  label: string;
  hint: string;
  enabled: boolean;
};

type GivingLine = {
  id: string;
  type: "Fund" | "Crowdfund" | "Merch" | "Sponsor";
  label: string;
  value: string;
  status: string;
  enabled: boolean;
};

type EventRecord = {
  id: string;
  title: string;
  subtitle: string;
  category: EventCategory;
  status: EventStatus;
  campus: string;
  owner: string;
  language: string;
  locationLabel: string;
  venueType: "On-site" | "Hybrid" | "Online";
  startISO: string;
  endISO: string;
  capacity: number;
  registrations: number;
  waitlist: number;
  forecastAttendance: number;
  ticketingState: TicketingState;
  description: string;
  heroUrl: string;
  segments: string[];
  checkInMode: "QR self-check-in" | "Desk + QR" | "Manual list";
  checkInReady: boolean;
  equipmentNote: string;
  travelNote: string;
  waiverRequired: boolean;
  linkedSeries?: string;
  linkedTeaching?: string;
  linkedLive?: string;
  linkedReplay?: string;
  linkedFund?: string;
  linkedCrowdfund?: string;
  linkedMerch?: string;
  beaconReady: boolean;
  sponsorMention: string;
  registrationSourceMix: Array<{ label: string; value: number }>;
  agenda: AgendaItem[];
  speakers: SpeakerItem[];
  volunteerRoles: VolunteerRole[];
  logistics: LogisticsItem[];
  tiers: TierItem[];
  faqs: FAQItem[];
  promotionChannels: PromotionChannel[];
  givingLines: GivingLine[];
  followUps: FollowUpItem[];
};

const EVENTS_SEED: EventRecord[] = [
  {
    id: "EV-0501",
    title: "Grace Conference 2026",
    subtitle:
      "Three-day encounter with teaching, worship, workshops, and a live giving moment for missions.",
    category: "Conference",
    status: "Upcoming",
    campus: "City Campus",
    owner: "Miriam Okello",
    language: "English ? Swahili",
    locationLabel: "Provider Arena, Kampala",
    venueType: "Hybrid",
    startISO: "2026-07-18T08:30:00Z",
    endISO: "2026-07-18T17:00:00Z",
    capacity: 1200,
    registrations: 874,
    waitlist: 61,
    forecastAttendance: 1035,
    ticketingState: "Paid ticket",
    description:
      "A premium conference experience with keynote sessions, breakout discipleship tracks, volunteer teams, live translation, missions giving, and a strong replay plan after the event closes.",
    heroUrl: HERO_CONFERENCE,
    segments: ["Leaders", "Young adults", "Replay viewers", "Conference partners"],
    checkInMode: "Desk + QR",
    checkInReady: true,
    equipmentNote:
      "Main hall cameras, interpretation headsets, LED wall package, and registration desk printers booked.",
    travelNote:
      "Guest speakers arriving Friday night. Airport pickup and hotel confirmation complete for 4 guests.",
    waiverRequired: false,
    linkedSeries: "Grace in Motion",
    linkedTeaching: "Standalone pre-conference charge",
    linkedLive: "Day 1 keynote live session",
    linkedReplay: "Conference replay package queued",
    linkedFund: "Missions Impact Fund",
    linkedCrowdfund: "Conference bursary crowdfund",
    linkedMerch: "Conference merch bundle",
    beaconReady: true,
    sponsorMention: "Partner mention reserved for sponsor reel + foyer signage.",
    registrationSourceMix: [
      { label: "Notifications", value: 368 },
      { label: "Beacon", value: 221 },
      { label: "Organic", value: 179 },
      { label: "Partner links", value: 106 },
    ],
    agenda: [
      { id: "ag1", time: "08:30", title: "Check-in + foyer welcome", owner: "Ops team", kind: "Access" },
      { id: "ag2", time: "09:15", title: "Opening prayer + worship", owner: "Main stage", kind: "Worship" },
      { id: "ag3", time: "10:00", title: "Keynote: Grace that moves a city", owner: "Pastor Nathaniel", kind: "Session" },
      { id: "ag4", time: "12:15", title: "Missions giving + sponsor mention", owner: "Host desk", kind: "Giving" },
      { id: "ag5", time: "14:00", title: "Breakout discipleship tracks", owner: "Track leads", kind: "Breakout" },
      { id: "ag6", time: "16:15", title: "Ministry response + closing", owner: "Prayer team", kind: "Closing" },
    ],
    speakers: [
      { id: "sp1", name: "Pastor Nathaniel", role: "Keynote host", confirmed: true },
      { id: "sp2", name: "Rev. Sarah M.", role: "Breakout teacher", confirmed: true },
      { id: "sp3", name: "Minister Joel", role: "Worship lead", confirmed: true },
      { id: "sp4", name: "Missions partner panel", role: "Panel guests", confirmed: false },
    ],
    volunteerRoles: [
      { id: "vr1", role: "Check-in desk", assigned: 9, needed: 10 },
      { id: "vr2", role: "Ushers", assigned: 18, needed: 18 },
      { id: "vr3", role: "Prayer response", assigned: 7, needed: 8 },
      { id: "vr4", role: "Backstage support", assigned: 5, needed: 5 },
    ],
    logistics: [
      {
        id: "lg1",
        label: "Venue floor plan",
        status: "Ready",
        owner: "Operations",
        note: "Main stage, overflow tent, and prayer room mapped.",
      },
      {
        id: "lg2",
        label: "Interpretation headsets",
        status: "At risk",
        owner: "AV lead",
        note: "12 replacement packs still being sourced.",
      },
      {
        id: "lg3",
        label: "Guest lodging",
        status: "Ready",
        owner: "Hospitality",
        note: "Hotel and transport confirmations complete.",
      },
      {
        id: "lg4",
        label: "Emergency exits + signage",
        status: "Ready",
        owner: "Venue team",
        note: "Final signage print run queued.",
      },
    ],
    tiers: [
      { id: "tr1", label: "Standard pass", priceLabel: "$18", sold: 602, cap: 800 },
      { id: "tr2", label: "Partner pass", priceLabel: "$32", sold: 178, cap: 250 },
      { id: "tr3", label: "Volunteer reserve", priceLabel: "Free", sold: 94, cap: 150 },
    ],
    faqs: [
      {
        id: "fq1",
        q: "Is translation available?",
        a: "Yes. English and Swahili audio support will be active in the main hall and live stream.",
      },
      {
        id: "fq2",
        q: "Can I join online?",
        a: "Yes. A linked Live Session will be available for digital attendees with replay access after the event.",
      },
    ],
    promotionChannels: [
      { id: "pc1", label: "Push + email reminder", hint: "T-24h and morning-of", enabled: true, health: "94% healthy" },
      { id: "pc2", label: "Beacon awareness", hint: "Paid and house-inventory mix", enabled: true, health: "CTR 4.8%" },
      { id: "pc3", label: "Volunteer segment journey", hint: "Ops briefings + arrival notes", enabled: true, health: "Ready" },
      { id: "pc4", label: "SMS recovery send", hint: "Late-fill seats if forecast dips", enabled: false, health: "Standby" },
    ],
    givingLines: [
      { id: "gv1", type: "Fund", label: "Missions Impact Fund", value: "$12.4k pledged", status: "Linked", enabled: true },
      { id: "gv2", type: "Crowdfund", label: "Conference bursary crowdfund", value: "74% to goal", status: "Active", enabled: true },
      { id: "gv3", type: "Merch", label: "Conference merch bundle", value: "146 clicks", status: "Live", enabled: true },
      { id: "gv4", type: "Sponsor", label: "Partner reel + foyer booth", value: "2 sponsor mentions", status: "Locked", enabled: true },
    ],
    followUps: [
      { id: "fu1", label: "Replay package", hint: "Create session replay shelf and chapters", enabled: true },
      { id: "fu2", label: "Clip batch", hint: "Extract keynote moments and worship highlights", enabled: true },
      { id: "fu3", label: "Thank-you journey", hint: "Send attendees, volunteers, donors, and partners tailored follow-up", enabled: true },
      { id: "fu4", label: "Review capture", hint: "Invite attendees to rate logistics and ministry impact", enabled: false },
    ],
  },
  {
    id: "EV-0502",
    title: "Marketplace Saturday",
    subtitle:
      "Church marketplace day with stalls, live teaching snippets, vendor booths, and family activities.",
    category: "Marketplace day",
    status: "Draft",
    campus: "West Campus",
    owner: "Paul Sserunjogi",
    language: "English",
    locationLabel: "West Campus Courtyard",
    venueType: "On-site",
    startISO: "2026-08-02T09:00:00Z",
    endISO: "2026-08-02T15:00:00Z",
    capacity: 600,
    registrations: 188,
    waitlist: 0,
    forecastAttendance: 310,
    ticketingState: "RSVP only",
    description:
      "A family-friendly marketplace gathering with live commerce moments, pop-up teaching sessions, giving booths, and a rich vendor promotion plan.",
    heroUrl: HERO_MARKET,
    segments: ["Families", "FaithMart shoppers", "Local community"],
    checkInMode: "QR self-check-in",
    checkInReady: false,
    equipmentNote:
      "Vendor power routing and pop-up PA placement still being finalized.",
    travelNote: "Local only event. No accommodation requirements.",
    waiverRequired: false,
    linkedTeaching: "Marketplace stewardship teaching",
    linkedLive: "Pop-up marketplace live stream",
    linkedFund: "Community support basket",
    linkedMerch: "Vendor highlight strip",
    beaconReady: true,
    sponsorMention: "Vendor highlight carousel prepared for Beacon promotion.",
    registrationSourceMix: [
      { label: "Organic", value: 92 },
      { label: "Beacon", value: 37 },
      { label: "Notifications", value: 59 },
    ],
    agenda: [
      { id: "ag1", time: "09:00", title: "Courtyard open + vendor welcome", owner: "Ops team", kind: "Access" },
      { id: "ag2", time: "10:15", title: "Mini teaching: Faith and work", owner: "Pastor Paul", kind: "Session" },
      { id: "ag3", time: "12:00", title: "Community support giving moment", owner: "Host desk", kind: "Giving" },
      { id: "ag4", time: "14:30", title: "Closing family blessing", owner: "Kids team", kind: "Closing" },
    ],
    speakers: [
      { id: "sp1", name: "Pastor Paul", role: "Host teacher", confirmed: true },
      { id: "sp2", name: "Vendor panel", role: "Featured merchants", confirmed: false },
    ],
    volunteerRoles: [
      { id: "vr1", role: "Vendor desk", assigned: 4, needed: 5 },
      { id: "vr2", role: "Kids zone", assigned: 3, needed: 4 },
      { id: "vr3", role: "Prayer desk", assigned: 2, needed: 2 },
    ],
    logistics: [
      { id: "lg1", label: "Vendor zoning plan", status: "At risk", owner: "Marketplace lead", note: "Final stall map needs sign-off." },
      { id: "lg2", label: "Pop-up shade tents", status: "Blocked", owner: "Facilities", note: "Supplier confirmation still pending." },
      { id: "lg3", label: "Live demo power routing", status: "Ready", owner: "AV lead", note: "Extension and backup power reserved." },
    ],
    tiers: [
      { id: "tr1", label: "Guest RSVP", priceLabel: "Free", sold: 188, cap: 600 },
    ],
    faqs: [
      {
        id: "fq1",
        q: "Do vendors accept cashless payments?",
        a: "Yes. Featured vendors will have FaithMart and QR payment support where available.",
      },
    ],
    promotionChannels: [
      { id: "pc1", label: "Community reminder", hint: "Push + email", enabled: true, health: "89% healthy" },
      { id: "pc2", label: "Beacon vendor hype", hint: "Local reach + retargeting", enabled: true, health: "CTR 3.1%" },
      { id: "pc3", label: "SMS recovery send", hint: "Morning-of fill", enabled: false, health: "Standby" },
    ],
    givingLines: [
      { id: "gv1", type: "Fund", label: "Community support basket", value: "$1.8k to date", status: "Linked", enabled: true },
      { id: "gv2", type: "Merch", label: "Vendor feature strip", value: "58 clicks", status: "Active", enabled: true },
      { id: "gv3", type: "Sponsor", label: "Neighbourhood sponsor slot", value: "1 pending approval", status: "Pending", enabled: false },
    ],
    followUps: [
      { id: "fu1", label: "Marketplace recap replay", hint: "Build short recap package for FaithMart surfaces", enabled: true },
      { id: "fu2", label: "Vendor thank-you journey", hint: "Send stall summaries and next-step bookings", enabled: false },
      { id: "fu3", label: "Family review capture", hint: "Collect family experience feedback", enabled: false },
    ],
  },
  {
    id: "EV-0503",
    title: "Baptism Celebration",
    subtitle:
      "Water baptism service with testimony moments, family seating plans, and a public livestream tie-in.",
    category: "Baptism",
    status: "Live now",
    campus: "Lakeside Campus",
    owner: "Grace N.",
    language: "English ? Luganda",
    locationLabel: "Lakeside Prayer Gardens",
    venueType: "Hybrid",
    startISO: "2026-06-28T11:00:00Z",
    endISO: "2026-06-28T13:30:00Z",
    capacity: 320,
    registrations: 296,
    waitlist: 17,
    forecastAttendance: 305,
    ticketingState: "Free ticket",
    description:
      "A trust-sensitive event where check-in, family seating, testimony capture, and moderation need to stay tightly coordinated with live broadcasting.",
    heroUrl: HERO_BAPTISM,
    segments: ["Families", "New believers", "Prayer team"],
    checkInMode: "Manual list",
    checkInReady: true,
    equipmentNote:
      "Portable audio, wireless mics, and waterproof camera rig active on site.",
    travelNote: "Shuttle support active between main road and lake area.",
    waiverRequired: true,
    linkedLive: "Baptism live stream",
    linkedReplay: "Baptism testimony replay set",
    linkedFund: "New believers support fund",
    beaconReady: false,
    sponsorMention: "No sponsor mentions on this event type.",
    registrationSourceMix: [
      { label: "Notifications", value: 116 },
      { label: "Organic", value: 133 },
      { label: "Pastoral invites", value: 47 },
    ],
    agenda: [
      { id: "ag1", time: "11:00", title: "Family arrival + prayer circle", owner: "Pastoral care", kind: "Prayer" },
      { id: "ag2", time: "11:30", title: "Teaching + testimony set", owner: "Grace N.", kind: "Session" },
      { id: "ag3", time: "12:00", title: "Water baptism", owner: "Ministry team", kind: "Ceremony" },
      { id: "ag4", time: "13:00", title: "Photos + next-steps desk", owner: "Discipleship team", kind: "Follow-up" },
    ],
    speakers: [
      { id: "sp1", name: "Grace N.", role: "Lead host", confirmed: true },
      { id: "sp2", name: "Pastoral care team", role: "Prayer support", confirmed: true },
    ],
    volunteerRoles: [
      { id: "vr1", role: "Family check-in", assigned: 4, needed: 4 },
      { id: "vr2", role: "Photo desk", assigned: 2, needed: 3 },
      { id: "vr3", role: "Safety support", assigned: 3, needed: 3 },
    ],
    logistics: [
      { id: "lg1", label: "Family wristband packs", status: "Ready", owner: "Check-in desk", note: "Printed and sorted by family group." },
      { id: "lg2", label: "Waterfront safety markers", status: "Ready", owner: "Safety team", note: "Barrier tape and first aid in place." },
      { id: "lg3", label: "Photo consent boards", status: "At risk", owner: "Comms lead", note: "One bilingual sign still printing." },
    ],
    tiers: [{ id: "tr1", label: "Attendee pass", priceLabel: "Free", sold: 296, cap: 320 }],
    faqs: [
      {
        id: "fq1",
        q: "Is there a photo policy?",
        a: "Yes. Consent signage and family wristbands are used for photo-safe and no-photo zones.",
      },
    ],
    promotionChannels: [
      { id: "pc1", label: "Family reminders", hint: "Final parking + arrival notes", enabled: true, health: "Live" },
      { id: "pc2", label: "Replay-ready sequence", hint: "For testimonies after event close", enabled: true, health: "Queued" },
    ],
    givingLines: [
      { id: "gv1", type: "Fund", label: "New believers support fund", value: "$3.2k this quarter", status: "Linked", enabled: true },
      { id: "gv2", type: "Sponsor", label: "No sponsor mentions", value: "Disabled by policy", status: "Disabled", enabled: false },
    ],
    followUps: [
      { id: "fu1", label: "Testimony replay", hint: "Package testimony moments for family sharing", enabled: true },
      { id: "fu2", label: "Discipleship next-step journey", hint: "Trigger pastoral follow-up and class invitations", enabled: true },
      { id: "fu3", label: "Photo consent audit", hint: "Store and review all public-photo assets", enabled: true },
    ],
  },
  {
    id: "EV-0504",
    title: "Youth Retreat 2026",
    subtitle:
      "Weekend retreat with workshops, accommodation logistics, waivers, and post-event discipleship follow-up.",
    category: "Retreat",
    status: "Completed",
    campus: "North Campus",
    owner: "Deborah A.",
    language: "English",
    locationLabel: "Kisubi Retreat Grounds",
    venueType: "On-site",
    startISO: "2026-05-02T07:30:00Z",
    endISO: "2026-05-04T15:00:00Z",
    capacity: 220,
    registrations: 214,
    waitlist: 12,
    forecastAttendance: 214,
    ticketingState: "Paid ticket",
    description:
      "Youth retreat complete. Follow-up, replay packaging, reviews, and donor updates are now the primary next steps.",
    heroUrl: HERO_RETREAT,
    segments: ["Youth", "Parents", "Youth leaders"],
    checkInMode: "Desk + QR",
    checkInReady: true,
    equipmentNote: "All rented equipment returned. Final reconciliation pending.",
    travelNote: "Bus transfer complete. Parent return notes sent.",
    waiverRequired: true,
    linkedSeries: "Wholehearted",
    linkedReplay: "Retreat recap film",
    linkedCrowdfund: "Youth scholarship crowdfund",
    beaconReady: true,
    sponsorMention: "Partner thank-you slide already cleared.",
    registrationSourceMix: [
      { label: "Notifications", value: 98 },
      { label: "Beacon", value: 54 },
      { label: "Parents + leaders", value: 62 },
    ],
    agenda: [
      { id: "ag1", time: "Fri 07:30", title: "Coach departures", owner: "Transport team", kind: "Travel" },
      { id: "ag2", time: "Sat 10:30", title: "Workshops + ministry labs", owner: "Youth leaders", kind: "Workshop" },
      { id: "ag3", time: "Sun 13:00", title: "Commissioning + return", owner: "Lead pastor", kind: "Closing" },
    ],
    speakers: [
      { id: "sp1", name: "Deborah A.", role: "Retreat lead", confirmed: true },
      { id: "sp2", name: "Youth panel", role: "Workshop leads", confirmed: true },
    ],
    volunteerRoles: [
      { id: "vr1", role: "Cabin leads", assigned: 12, needed: 12 },
      { id: "vr2", role: "Medical support", assigned: 2, needed: 2 },
      { id: "vr3", role: "Transport marshals", assigned: 4, needed: 4 },
    ],
    logistics: [
      { id: "lg1", label: "Reconciliation wrap-up", status: "At risk", owner: "Finance", note: "Vendor invoice still pending." },
      { id: "lg2", label: "Parent thank-you pack", status: "Ready", owner: "Comms", note: "Queued for Monday send." },
    ],
    tiers: [{ id: "tr1", label: "Retreat pass", priceLabel: "$85", sold: 214, cap: 220 }],
    faqs: [
      {
        id: "fq1",
        q: "Will there be a recap package?",
        a: "Yes. A recap film, clip pack, and parent follow-up journey are already linked.",
      },
    ],
    promotionChannels: [
      { id: "pc1", label: "Parent thank-you flow", hint: "Post-event care sequence", enabled: true, health: "Queued" },
      { id: "pc2", label: "Scholarship crowdfund push", hint: "Replay + Beacon handoff", enabled: true, health: "Ready" },
    ],
    givingLines: [
      { id: "gv1", type: "Crowdfund", label: "Youth scholarship crowdfund", value: "88% to goal", status: "Active", enabled: true },
      { id: "gv2", type: "Merch", label: "Retreat recap merch", value: "Planned", status: "Draft", enabled: false },
    ],
    followUps: [
      { id: "fu1", label: "Recap film", hint: "Publish and send parent-ready replay", enabled: true },
      { id: "fu2", label: "Review capture", hint: "Collect youth and parent experience ratings", enabled: true },
      { id: "fu3", label: "Next discipleship step", hint: "Invite to youth groups and classes", enabled: true },
    ],
  },
];

function Pill({
  children,
  tone = "neutral",
  title,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "good" | "warn" | "bad" | "brand" | "accent";
  title?: string;
}) {
  const cls =
    tone === "good"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
      : tone === "warn"
        ? "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20"
        : tone === "bad"
          ? "bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20"
          : tone === "brand"
            ? "text-white shadow-soft ring-0"
            : tone === "accent"
              ? "text-white shadow-soft ring-0"
              : "bg-slate-100 text-slate-800 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700";

  return (
    <span
      title={title}
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-bold ring-1 whitespace-nowrap transition",
        cls,
      )}
      style={
        tone === "brand"
          ? { background: EV_GREEN }
          : tone === "accent"
            ? { background: EV_ORANGE }
            : undefined
      }
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
  children: React.ReactNode;
  onClick?: () => void;
  tone?: "neutral" | "primary" | "accent" | "ghost";
  disabled?: boolean;
  left?: React.ReactNode;
  title?: string;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  const cls =
    tone === "primary"
      ? "text-white hover:brightness-95 shadow-soft"
      : tone === "accent"
        ? "text-white hover:brightness-95 shadow-soft"
        : tone === "ghost"
          ? "bg-transparent text-faith-ink dark:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800"
          : "bg-[var(--fh-surface-bg)] dark:bg-slate-900 text-faith-ink dark:text-slate-50 ring-1 ring-slate-200 dark:ring-slate-800 hover:bg-[var(--fh-surface)] dark:hover:bg-slate-800 shadow-soft";

  return (
    <button
      type="button"
      title={title}
      className={cx(base, cls, className)}
      style={
        tone === "primary"
          ? { background: EV_GREEN }
          : tone === "accent"
            ? { background: EV_ORANGE }
            : undefined
      }
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {left}
      {children}
    </button>
  );
}

function Toggle({
  value,
  onChange,
  disabled,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => (!disabled ? onChange(!value) : undefined)}
      className={cx(
        "relative inline-flex h-6 w-11 items-center rounded-full transition",
        disabled
          ? "bg-slate-200 dark:bg-slate-800 cursor-not-allowed"
          : value
            ? "bg-slate-900 dark:bg-slate-100"
            : "bg-slate-300 dark:bg-slate-700",
      )}
      aria-pressed={value}
    >
      <span
        className={cx(
          "inline-block h-5 w-5 transform rounded-full bg-[var(--fh-surface-bg)] dark:bg-slate-900 shadow-soft transition",
          value ? "translate-x-5" : "translate-x-1",
        )}
      />
    </button>
  );
}

function Drawer({
  open,
  title,
  onClose,
  children,
  right,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  right?: React.ReactNode;
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
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative flex w-full max-w-6xl flex-col bg-[var(--fh-surface-bg)] dark:bg-slate-900 shadow-2xl transition-all h-[95vh] sm:h-auto sm:max-h-[92vh] rounded-t-3xl sm:rounded-3xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
        <div className="flex items-center justify-between gap-2 border-b border-faith-line dark:border-slate-800 px-4 py-3">
          <div className="text-base font-semibold text-faith-ink dark:text-slate-50">
            {title}
          </div>
          <div className="flex items-center gap-2">
            {right}
            <Btn tone="ghost" onClick={onClose} left={<X className="h-4 w-4" />}>
              Close
            </Btn>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
}

function ProgressBar({
  value,
  tone = "brand",
}: {
  value: number;
  tone?: "brand" | "accent" | "neutral";
}) {
  return (
    <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          width: `${Math.max(4, Math.min(100, value))}%`,
          background:
            tone === "brand"
              ? EV_GREEN
              : tone === "accent"
                ? EV_ORANGE
                : EV_NAVY,
        }}
      />
    </div>
  );
}

function MetricTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return <KpiTile label={label} value={value} hint={hint} tone="gray" size="compact" />;
}

function TinySparkline({
  values,
}: {
  values: Array<{ label: string; value: number }>;
}) {
  const width = 210;
  const height = 80;
  const pad = 10;
  const nums = values.map((v) => v.value);
  const max = Math.max(...nums, 1);
  const min = Math.min(...nums, 0);
  const range = max - min || 1;
  const points = values
    .map((v, idx) => {
      const x =
        pad + (idx / Math.max(1, values.length - 1)) * (width - pad * 2);
      const y =
        height - pad - ((v.value - min) / range) * (height - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20">
      <polyline
        points={`${points} ${width - pad},${height - pad} ${pad},${height - pad}`}
        fill={EV_GREEN}
        opacity="0.08"
      />
      <polyline
        points={points}
        fill="none"
        stroke={EV_GREEN}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
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
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1 h-11 w-full rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 text-sm text-faith-ink dark:text-slate-100 shadow-soft transition focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700"
    />
  );
}

function TextArea({
  value,
  onChange,
  rows = 4,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 w-full rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 text-sm text-faith-ink dark:text-slate-100 shadow-soft transition focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700"
    />
  );
}

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 h-11 w-full rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 text-sm text-faith-ink dark:text-slate-100 shadow-soft transition focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function statusToneForEvent(status: EventStatus) {
  if (status === "Live now") return "good" as const;
  if (status === "Draft") return "warn" as const;
  if (status === "Completed") return "neutral" as const;
  return "brand" as const;
}

function logisticsTone(status: LogisticsStatus) {
  if (status === "Ready") return "good" as const;
  if (status === "At risk") return "warn" as const;
  return "bad" as const;
}

function EventListItem({
  event,
  selected,
  onSelect,
  onOpenCheckIn,
  onBeacon,
}: {
  event: EventRecord;
  selected: boolean;
  onSelect: () => void;
  onOpenCheckIn: () => void;
  onBeacon: () => void;
}) {
  const fillPct = pct(event.registrations, event.capacity);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cx(
        "w-full rounded-3xl border p-3 text-left transition-all shadow-soft",
        selected
          ? "border-[rgba(3,205,140,0.4)] bg-emerald-50/50 dark:bg-emerald-900/10 dark:border-emerald-800"
          : "border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 hover:bg-[var(--fh-surface)] dark:hover:bg-slate-800",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="truncate text-sm font-bold text-faith-ink dark:text-slate-50">
              {event.title}
            </div>
            <Pill tone={statusToneForEvent(event.status)}>{event.status}</Pill>
            <Pill tone="neutral">{event.category}</Pill>
          </div>
          <div className="mt-1 text-[12px] text-faith-slate line-clamp-2">
            {event.subtitle}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-faith-slate">
            <span>{fmtShortDate(event.startISO)}</span>
            <span>?</span>
            <span>{event.campus}</span>
            <span>?</span>
            <span>{event.ticketingState}</span>
            <span>?</span>
            <span>
              {fmtInt(event.registrations)} / {fmtInt(event.capacity)} registered
            </span>
          </div>
        </div>
        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
          <img src={event.heroUrl} alt={event.title} className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] text-faith-slate">
          <span>Capacity fill</span>
          <span>{fillPct}%</span>
        </div>
        <div className="mt-1">
          <ProgressBar value={fillPct} tone={event.status === "Draft" ? "accent" : "brand"} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-2xl bg-slate-900 dark:bg-slate-100 px-3 py-2 text-[11px] font-bold text-white dark:text-faith-ink"
          onClick={(e) => {
            e.stopPropagation();
            onOpenCheckIn();
          }}
        >
          <QrCode className="h-3.5 w-3.5" /> Check-in
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-2xl border border-faith-line dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 text-[11px] font-bold text-faith-ink dark:text-slate-100"
          onClick={(e) => {
            e.stopPropagation();
            onBeacon();
          }}
        >
          <Zap className="h-3.5 w-3.5" /> Beacon
        </button>
      </div>
    </button>
  );
}

function EventPreviewSurface({
  event,
  mode = "desktop",
  compact,
}: {
  event: EventRecord;
  mode?: PreviewMode;
  compact?: boolean;
}) {
  const fillPct = pct(event.registrations, event.capacity);
  const baseCard = (
    <div className="rounded-[28px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-950 overflow-hidden shadow-soft transition-colors">
      <div className={cx("relative overflow-hidden", compact ? "aspect-[16/10]" : "aspect-[16/9]")}>
        <img src={event.heroUrl} alt={event.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--fh-surface-bg)]/15 px-2 py-1 text-[10px] font-extrabold text-white backdrop-blur">
            {event.category}
          </span>
          <span className="rounded-full bg-[var(--fh-surface-bg)]/15 px-2 py-1 text-[10px] font-extrabold text-white backdrop-blur">
            {event.venueType}
          </span>
        </div>
        <div className="absolute left-3 right-3 bottom-3">
          <div className={cx("font-extrabold text-white line-clamp-2", compact ? "text-lg" : "text-2xl")}>
            {event.title}
          </div>
          <div className="mt-1 text-[12px] text-white/85 line-clamp-2">
            {event.subtitle}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-white/85">
            <span>{fmtShortDate(event.startISO)}</span>
            <span>?</span>
            <span>{event.locationLabel}</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[var(--fh-surface)] dark:bg-slate-800 p-3">
            <div className="text-[10px] uppercase tracking-wide text-faith-slate">
              Attendance
            </div>
            <div className="mt-1 text-lg font-extrabold text-faith-ink dark:text-slate-50">
              {fmtInt(event.registrations)}
            </div>
            <div className="text-[11px] text-faith-slate">
              of {fmtInt(event.capacity)} capacity
            </div>
          </div>
          <div className="rounded-2xl bg-[var(--fh-surface)] dark:bg-slate-800 p-3">
            <div className="text-[10px] uppercase tracking-wide text-faith-slate">
              Ticketing
            </div>
            <div className="mt-1 text-sm font-extrabold text-faith-ink dark:text-slate-50">
              {event.ticketingState}
            </div>
            <div className="text-[11px] text-faith-slate">
              {event.checkInMode}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[11px] text-faith-slate">
            <span>Registration progress</span>
            <span>{fillPct}%</span>
          </div>
          <div className="mt-1">
            <ProgressBar value={fillPct} tone="brand" />
          </div>
        </div>

        <div className="rounded-2xl bg-[var(--fh-surface)] dark:bg-slate-800 p-3">
          <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-50">
            Next agenda moments
          </div>
          <div className="mt-2 space-y-2">
            {event.agenda.slice(0, compact ? 2 : 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-2 text-[11px]">
                <div className="min-w-0">
                  <div className="font-semibold text-faith-ink dark:text-slate-100 truncate">
                    {item.title}
                  </div>
                  <div className="text-faith-slate truncate">
                    {item.owner}
                  </div>
                </div>
                <div className="shrink-0 rounded-full bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-2 py-1 font-bold text-faith-ink dark:text-slate-100 ring-1 ring-slate-200 dark:ring-slate-700">
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 dark:bg-slate-100 px-4 py-2.5 text-[12px] font-extrabold text-white dark:text-faith-ink shadow-soft" onClick={() => safeNav("/faithhub/provider/events-manager")}>
            <Ticket className="h-4 w-4" /> Get ticket
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-4 py-2.5 text-[12px] font-extrabold text-faith-ink dark:text-slate-100 ring-1 ring-slate-200 dark:ring-slate-700 shadow-soft" onClick={() => safeNav("/faithhub/provider/donations-and-funds")}>
            <HeartHandshake className="h-4 w-4" /> Support
          </button>
        </div>
      </div>
    </div>
  );

  if (mode === "mobile") {
    return (
      <div className="mx-auto w-full max-w-[320px] md:max-w-[360px]">
        <div className="rounded-[36px] bg-slate-950 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.45)]">
          <div className="rounded-[30px] bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3 transition-colors">
            <div className="mx-auto mb-3 h-5 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
            {baseCard}
          </div>
        </div>
      </div>
    );
  }

  return baseCard;
}

function CheckInConsolePreview({ event }: { event: EventRecord }) {
  return (
    <div className="rounded-[28px] border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-950 overflow-hidden shadow-soft transition-colors">
      <div className="border-b border-faith-line dark:border-slate-800 px-4 py-3 flex items-center justify-between gap-2">
        <div>
          <div className="text-sm font-extrabold text-faith-ink dark:text-slate-50">
            Check-in mode
          </div>
          <div className="text-[11px] text-faith-slate">
            {event.checkInMode}
          </div>
        </div>
        <Pill tone={event.checkInReady ? "good" : "warn"}>
          {event.checkInReady ? "Ready" : "Needs setup"}
        </Pill>
      </div>
      <div className="p-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-2xl bg-[var(--fh-surface)] dark:bg-slate-800 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
          <div className="h-44 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-[var(--fh-surface-bg)] dark:bg-slate-900 grid place-items-center">
            <div className="text-center">
              <div className="mx-auto h-20 w-20 rounded-2xl bg-slate-100 dark:bg-slate-800 grid place-items-center">
                <QrCode className="h-10 w-10 text-slate-700 dark:text-slate-200" />
              </div>
              <div className="mt-3 text-sm font-bold text-faith-ink dark:text-slate-100">
                Scan attendee QR
              </div>
              <div className="text-[11px] text-faith-slate">
                Supports walk-in lookup and fast desk check-in.
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl bg-[var(--fh-surface)] dark:bg-slate-800 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
            <div className="grid grid-cols-2 gap-3">
              <MetricTile
                label="Checked in"
                value={fmtInt(Math.round(event.registrations * 0.62))}
                hint="Current demo state"
              />
              <MetricTile
                label="Walk-ins"
                value={fmtInt(Math.round(event.registrations * 0.08))}
                hint="Desk additions"
              />
            </div>
          </div>
          <div className="rounded-2xl bg-[var(--fh-surface)] dark:bg-slate-800 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
            <div className="text-[12px] font-extrabold text-faith-ink dark:text-slate-50">
              Desk actions
            </div>
            <div className="mt-2 space-y-2 text-[12px]">
              <div className="flex items-center justify-between gap-2 rounded-2xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-700">
                <span className="font-semibold text-faith-ink dark:text-slate-100">
                  Badge print queue
                </span>
                <Pill tone="good">12 ready</Pill>
              </div>
              <div className="flex items-center justify-between gap-2 rounded-2xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-700">
                <span className="font-semibold text-faith-ink dark:text-slate-100">
                  Waiver verification
                </span>
                <Pill tone={event.waiverRequired ? "warn" : "neutral"}>
                  {event.waiverRequired ? "Required" : "Not required"}
                </Pill>
              </div>
              <div className="flex items-center justify-between gap-2 rounded-2xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-700">
                <span className="font-semibold text-faith-ink dark:text-slate-100">
                  Overflow routing
                </span>
                <Pill tone="brand">Standby</Pill>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SourceMixPanel({
  sourceMix,
}: {
  sourceMix: Array<{ label: string; value: number }>;
}) {
  const total = sourceMix.reduce((sum, item) => sum + item.value, 0) || 1;
  return (
    <div className="space-y-2">
      {sourceMix.map((item, index) => {
        const barPct = Math.round((item.value / total) * 100);
        return (
          <div key={item.label} className="rounded-2xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-700">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[12px] font-semibold text-faith-ink dark:text-slate-100">
                {item.label}
              </div>
              <div className="text-[11px] font-bold text-faith-slate dark:text-slate-300">
                {fmtInt(item.value)}
              </div>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${barPct}%`,
                  background: index % 2 === 0 ? EV_GREEN : EV_ORANGE,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function coveragePct(roles: VolunteerRole[]) {
  const assigned = roles.reduce((sum, role) => sum + Math.min(role.assigned, role.needed), 0);
  const needed = roles.reduce((sum, role) => sum + role.needed, 0);
  return pct(assigned, needed);
}

export default function FaithHubEventsManagerPage() {
  const [events, setEvents] = useState<EventRecord[]>(EVENTS_SEED);
  const [selectedEventId, setSelectedEventId] = useState(EVENTS_SEED[0]?.id || "");
  const [search, setSearch] = useState("");
  const [campusFilter, setCampusFilter] = useState("All campuses");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [ticketFilter, setTicketFilter] = useState("All ticketing");
  const [ownerFilter, setOwnerFilter] = useState("All owners");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [workingAction, setWorkingAction] = useState<string | null>(null);

  const campusOptions = useMemo(
    () => ["All campuses", ...Array.from(new Set(events.map((event) => event.campus)))],
    [events],
  );
  const categoryOptions = useMemo(
    () => ["All categories", ...Array.from(new Set(events.map((event) => event.category)))],
    [events],
  );
  const ticketOptions = ["All ticketing", "RSVP only", "Free ticket", "Paid ticket", "Invite only"];
  const ownerOptions = useMemo(
    () => ["All owners", ...Array.from(new Set(events.map((event) => event.owner)))],
    [events],
  );

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.subtitle.toLowerCase().includes(query) ||
        event.owner.toLowerCase().includes(query) ||
        event.locationLabel.toLowerCase().includes(query);

      const matchesCampus = campusFilter === "All campuses" || event.campus === campusFilter;
      const matchesCategory = categoryFilter === "All categories" || event.category === categoryFilter;
      const matchesTicket = ticketFilter === "All ticketing" || event.ticketingState === ticketFilter;
      const matchesOwner = ownerFilter === "All owners" || event.owner === ownerFilter;

      return matchesSearch && matchesCampus && matchesCategory && matchesTicket && matchesOwner;
    });
  }, [events, search, campusFilter, categoryFilter, ticketFilter, ownerFilter]);

  useEffect(() => {
    if (!filteredEvents.length) return;
    if (!filteredEvents.find((event) => event.id === selectedEventId)) {
      setSelectedEventId(filteredEvents[0].id);
    }
  }, [filteredEvents, selectedEventId]);

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) || events[0],
    [events, selectedEventId],
  );

  const mutateSelectedEvent = (mutator: (event: EventRecord) => EventRecord) => {
    if (!selectedEvent) return;
    setEvents((current) =>
      current.map((event) => (event.id === selectedEvent.id ? mutator(event) : event)),
    );
  };

  const readinessSignals = useMemo(() => {
    if (!selectedEvent) return [] as boolean[];
    return [
      Boolean(selectedEvent.title.trim()),
      Boolean(selectedEvent.heroUrl),
      selectedEvent.agenda.length >= 3,
      selectedEvent.speakers.some((speaker) => speaker.confirmed),
      selectedEvent.logistics.every((item) => item.status !== "Blocked"),
      selectedEvent.volunteerRoles.every((role) => role.assigned >= role.needed),
      selectedEvent.promotionChannels.some((channel) => channel.enabled),
      selectedEvent.givingLines.some((line) => line.enabled),
      Boolean(
        selectedEvent.linkedLive ||
          selectedEvent.linkedReplay ||
          selectedEvent.linkedSeries ||
          selectedEvent.linkedTeaching,
      ),
      selectedEvent.checkInReady,
    ];
  }, [selectedEvent]);

  const readinessScore = useMemo(() => {
    if (!readinessSignals.length) return 0;
    return Math.round((readinessSignals.filter(Boolean).length / readinessSignals.length) * 100);
  }, [readinessSignals]);

  const blockedCount =
    selectedEvent?.logistics.filter((item) => item.status === "Blocked").length || 0;
  const atRiskCount =
    selectedEvent?.logistics.filter((item) => item.status === "At risk").length || 0;
  const capacityFill = selectedEvent
    ? pct(selectedEvent.registrations, selectedEvent.capacity)
    : 0;
  const volunteerCoverage = selectedEvent
    ? coveragePct(selectedEvent.volunteerRoles)
    : 0;
  const liveTieCount = selectedEvent
    ? [
        selectedEvent.linkedLive,
        selectedEvent.linkedReplay,
        selectedEvent.linkedSeries,
        selectedEvent.linkedTeaching,
      ].filter(Boolean).length
    : 0;
  const enabledChannelCount =
    selectedEvent?.promotionChannels.filter((channel) => channel.enabled).length || 0;
  const activeGivingCount =
    selectedEvent?.givingLines.filter((line) => line.enabled).length || 0;

  const duplicateEvent = async () => {
    if (!selectedEvent) return;
    setWorkingAction("duplicate");
    await new Promise((resolve) => setTimeout(resolve, 550));
    const clone: EventRecord = {
      ...selectedEvent,
      id: `EV-${Math.random().toString(16).slice(2, 6).toUpperCase()}`,
      title: `${selectedEvent.title} ? Copy`,
      status: "Draft",
      registrations: 0,
      waitlist: 0,
      forecastAttendance: 0,
    };
    setEvents((current) => [clone, ...current]);
    setSelectedEventId(clone.id);
    setWorkingAction(null);
    setToast("Event duplicated as a new draft.");
  };

  const createNewEvent = async () => {
    setWorkingAction("create");
    await new Promise((resolve) => setTimeout(resolve, 450));
    const created: EventRecord = {
      ...EVENTS_SEED[1],
      id: `EV-${Math.random().toString(16).slice(2, 6).toUpperCase()}`,
      title: "New Faith Event",
      subtitle:
        "Fresh event shell ready for agenda, logistics, giving, and Beacon setup.",
      status: "Draft",
      registrations: 0,
      waitlist: 0,
      forecastAttendance: 0,
      campus: "Select campus",
      owner: "Unassigned",
      linkedLive: undefined,
      linkedSeries: undefined,
      linkedTeaching: undefined,
      linkedReplay: undefined,
      linkedFund: undefined,
      linkedCrowdfund: undefined,
      linkedMerch: undefined,
    };
    setEvents((current) => [created, ...current]);
    setSelectedEventId(created.id);
    setWorkingAction(null);
    setToast("New event shell created.");
  };

  const publishEventPlan = async () => {
    if (!selectedEvent) return;
    setWorkingAction("publish");
    await new Promise((resolve) => setTimeout(resolve, 600));
    mutateSelectedEvent((event) => ({
      ...event,
      status: event.status === "Draft" ? "Upcoming" : event.status,
    }));
    setWorkingAction(null);
    setToast("Event plan saved and marked ready for operations.");
  };

  const promoteWithBeacon = () => {
    if (!selectedEvent) return;
    setToast(`Beacon handoff prepared for ${selectedEvent.title}.`);
  };

  const openCheckInMode = () => {
    setCheckInOpen(true);
    setToast("Check-in mode opened.");
  };

  const copyPlanningCard = async () => {
    if (!selectedEvent) return;
    const summary = `${selectedEvent.title}\n${fmtLocal(selectedEvent.startISO)}\n${selectedEvent.locationLabel}\n${selectedEvent.ticketingState} ? ${selectedEvent.registrations}/${selectedEvent.capacity} registered`;
    try {
      await navigator.clipboard.writeText(summary);
      setToast("Planning card copied.");
    } catch {
      setToast("Copy unavailable in this environment.");
    }
  };

  const downloadRunSheet = () => {
    if (!selectedEvent || typeof window === "undefined") return;
    const lines = [
      "FAITHHUB EVENT RUN SHEET",
      "------------------------",
      `Event: ${selectedEvent.title}`,
      `Window: ${fmtLocal(selectedEvent.startISO)} ??? ? ${fmtLocal(selectedEvent.endISO)}`,
      `Venue: ${selectedEvent.locationLabel}`,
      `Owner: ${selectedEvent.owner}`,
      `Ticketing: ${selectedEvent.ticketingState}`,
      "",
      "AGENDA",
      ...selectedEvent.agenda.map((item) => `${item.time} ? ${item.title} (${item.owner})`),
      "",
      "LOGISTICS",
      ...selectedEvent.logistics.map(
        (item) => `${item.label} â€” ${item.status} â€” ${item.note}`,
      ),
      "",
      "VOLUNTEER COVERAGE",
      ...selectedEvent.volunteerRoles.map(
        (role) => `${role.role}: ${role.assigned}/${role.needed}`,
      ),
    ].join("\n");

    const blob = new Blob([lines], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `faithhub_event_runsheet_${selectedEvent.id}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
    setToast("Run sheet exported.");
  };

  if (!selectedEvent) return null;

  return (
    <div className="min-h-screen w-full flex flex-col bg-[var(--fh-page-bg)] dark:bg-slate-950 text-faith-ink dark:text-slate-50 overflow-x-hidden transition-colors">
      <div className="sticky top-0 z-40 border-b border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)]/95 dark:bg-slate-900/95 backdrop-blur-md">
        <div className="w-full px-4 md:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-faith-slate">
                <button
                  onClick={() => safeNav(ROUTES.liveBuilder)}
                  className="hover:text-slate-700 dark:hover:text-slate-200"
                >
                  Events & Giving
                </button>
                <span>/</span>
                <span className="font-semibold text-faith-ink dark:text-slate-100">
                  Events Manager
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-faith-ink dark:text-slate-50">
                  Events Manager
                </div>
                <Pill tone="brand">Premium event OS</Pill>
                <Pill tone="accent">Live + giving + Beacon linked</Pill>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-faith-slate">
                <span>{fmtInt(filteredEvents.length)} visible events</span>
                <span>?</span>
                <span>{selectedEvent.campus}</span>
                <span>?</span>
                <span>{selectedEvent.ticketingState}</span>
                <span>?</span>
                <span>{capacityFill}% registration fill</span>
                <span>?</span>
                <span>{liveTieCount} content ties active</span>
              </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:w-auto xl:flex-wrap xl:justify-end">
              <Btn tone="ghost" className="h-10 px-4 justify-start sm:justify-center bg-[var(--fh-surface-bg)] dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 shadow-soft hover:bg-[var(--fh-surface)] dark:hover:bg-slate-800" onClick={() => setPreviewOpen(true)} left={<Eye className="h-4 w-4" />}>
                Preview
              </Btn>
              <Btn tone="neutral" className="h-10 px-4" onClick={openCheckInMode} left={<QrCode className="h-4 w-4" />}>
                Open check-in mode
              </Btn>
              <Btn tone="accent" className="h-10 px-4" onClick={promoteWithBeacon} left={<Zap className="h-4 w-4" />}>
                Promote with Beacon
              </Btn>
              <Btn
                tone="primary"
                className="h-10 px-4"
                onClick={createNewEvent}
                left={<Plus className="h-4 w-4" />}
                disabled={workingAction === "create"}
              >
                {workingAction === "create" ? "Creating..." : "+ New Event"}
              </Btn>
            </div>
          </div>
        </div>

        <div className="border-t border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900">
          <div className="w-full px-4 md:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-[11px] sm:text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="brand">
                <BadgeCheck className="h-3.5 w-3.5" /> Event OS active
              </Pill>
              <Pill tone={blockedCount > 0 ? "bad" : "good"}>
                <ShieldCheck className="h-3.5 w-3.5" />
                {blockedCount > 0
                  ? `${blockedCount} blocked item${blockedCount > 1 ? "s" : ""}`
                  : "No critical blockers"}
              </Pill>
              <Pill tone={atRiskCount > 0 ? "warn" : "good"}>
                <AlertTriangle className="h-3.5 w-3.5" />
                {atRiskCount > 0
                  ? `${atRiskCount} at-risk area${atRiskCount > 1 ? "s" : ""}`
                  : "Logistics stable"}
              </Pill>
            </div>
            <div className="text-faith-slate">
              Designed to keep event planning, money movement, promotion, and post-event growth on one premium surface.
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-4">
            <section className="rounded-3xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-soft transition">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-faith-ink dark:text-slate-50 uppercase tracking-tight">
                      Events command list
                    </div>
                    <div className="mt-1 text-[11px] sm:text-xs text-faith-slate">
                      Upcoming, live, past, and draft events with premium filters, operational quick actions, and team visibility.
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Btn
                      tone="neutral"
                      onClick={copyPlanningCard}
                      left={<ClipboardList className="h-4 w-4" />}
                      className="px-3 py-2 text-[12px]"
                    >
                      Copy planning card
                    </Btn>
                    <Btn
                      tone="ghost"
                      onClick={downloadRunSheet}
                      left={<Download className="h-4 w-4" />}
                      className="px-3 py-2 text-[12px]"
                    >
                      Export run sheet
                    </Btn>
                    <Btn
                      tone="ghost"
                      onClick={duplicateEvent}
                      left={<Layers className="h-4 w-4" />}
                      className="px-3 py-2 text-[12px]"
                      disabled={workingAction === "duplicate"}
                    >
                      {workingAction === "duplicate" ? "Duplicatingâ€¦" : "Duplicate"}
                    </Btn>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 2xl:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,0.7fr))]">
                  <label className="block">
                    <FieldLabel>Search events</FieldLabel>
                    <div className="mt-1 h-11 rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 flex items-center gap-2 shadow-soft">
                      <Search className="h-4 w-4 text-faith-slate" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by title, owner, venue, or subtitle"
                        className="w-full bg-transparent outline-none text-sm text-faith-ink dark:text-slate-100"
                      />
                    </div>
                  </label>
                  <label className="block">
                    <FieldLabel>Campus</FieldLabel>
                    <SelectField value={campusFilter} onChange={setCampusFilter} options={campusOptions} />
                  </label>
                  <label className="block">
                    <FieldLabel>Category</FieldLabel>
                    <SelectField value={categoryFilter} onChange={setCategoryFilter} options={categoryOptions} />
                  </label>
                  <label className="block">
                    <FieldLabel>Ticketing</FieldLabel>
                    <SelectField value={ticketFilter} onChange={setTicketFilter} options={ticketOptions} />
                  </label>
                  <label className="block">
                    <FieldLabel>Owner</FieldLabel>
                    <SelectField value={ownerFilter} onChange={setOwnerFilter} options={ownerOptions} />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                  {filteredEvents.map((event) => (
                    <EventListItem
                      key={event.id}
                      event={event}
                      selected={selectedEvent.id === event.id}
                      onSelect={() => setSelectedEventId(event.id)}
                      onOpenCheckIn={openCheckInMode}
                      onBeacon={promoteWithBeacon}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-soft transition">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-faith-ink dark:text-slate-50 uppercase tracking-tight">
                      Event setup workspace
                    </div>
                    <div className="mt-1 text-[11px] sm:text-xs text-faith-slate">
                      Identity, agenda, venue, speakers, volunteer roles, FAQs, and event artwork in one premium planning surface.
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill tone="brand">{selectedEvent.category}</Pill>
                    <Pill tone="neutral">{selectedEvent.campus}</Pill>
                    <Pill tone={selectedEvent.beaconReady ? "good" : "warn"}>
                      {selectedEvent.beaconReady ? "Beacon-ready" : "Beacon setup pending"}
                    </Pill>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  <div className="rounded-3xl bg-[var(--fh-surface)] dark:bg-slate-800/40 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition-colors">
                    <FieldLabel>Event title</FieldLabel>
                    <Input
                      value={selectedEvent.title}
                      onChange={(value) =>
                        mutateSelectedEvent((event) => ({ ...event, title: value }))
                      }
                    />

                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <label className="block">
                        <FieldLabel>Category</FieldLabel>
                        <SelectField
                          value={selectedEvent.category}
                          onChange={(value) =>
                            mutateSelectedEvent((event) => ({
                              ...event,
                              category: value as EventCategory,
                            }))
                          }
                          options={[
                            "Conference",
                            "Service",
                            "Retreat",
                            "Outreach day",
                            "Trip",
                            "Baptism",
                            "Marketplace day",
                            "Class",
                          ]}
                        />
                      </label>
                      <label className="block">
                        <FieldLabel>Campus</FieldLabel>
                        <Input
                          value={selectedEvent.campus}
                          onChange={(value) =>
                            mutateSelectedEvent((event) => ({ ...event, campus: value }))
                          }
                        />
                      </label>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <label className="block">
                        <FieldLabel>Event owner</FieldLabel>
                        <Input
                          value={selectedEvent.owner}
                          onChange={(value) =>
                            mutateSelectedEvent((event) => ({ ...event, owner: value }))
                          }
                        />
                      </label>
                      <label className="block">
                        <FieldLabel>Language</FieldLabel>
                        <Input
                          value={selectedEvent.language}
                          onChange={(value) =>
                            mutateSelectedEvent((event) => ({ ...event, language: value }))
                          }
                        />
                      </label>
                    </div>

                    <div className="mt-3">
                      <FieldLabel>Subtitle / public promise</FieldLabel>
                      <TextArea
                        value={selectedEvent.subtitle}
                        onChange={(value) =>
                          mutateSelectedEvent((event) => ({ ...event, subtitle: value }))
                        }
                        rows={2}
                      />
                    </div>

                    <div className="mt-3">
                      <FieldLabel>Event description</FieldLabel>
                      <TextArea
                        value={selectedEvent.description}
                        onChange={(value) =>
                          mutateSelectedEvent((event) => ({
                            ...event,
                            description: value,
                          }))
                        }
                        rows={4}
                      />
                    </div>

                    <div className="mt-3 rounded-2xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-[12px] font-bold text-faith-ink dark:text-slate-100">
                            Visual asset state
                          </div>
                          <div className="text-[11px] text-faith-slate">
                            Hero art, event card variants, QR-ready promo surfaces, and stage screen assets.
                          </div>
                        </div>
                        <div className="h-14 w-14 rounded-2xl overflow-hidden shrink-0">
                          <img src={selectedEvent.heroUrl} alt={selectedEvent.title} className="h-full w-full object-cover" />
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Pill tone="good">
                          <ImageIcon className="h-3.5 w-3.5" /> Hero approved
                        </Pill>
                        <Pill tone="neutral">
                          <Layers className="h-3.5 w-3.5" /> Social crop variants ready
                        </Pill>
                        <Pill tone="accent">
                          <QrCode className="h-3.5 w-3.5" /> QR poster pack
                        </Pill>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-3xl bg-[var(--fh-surface)] dark:bg-slate-800/40 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition-colors">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <label className="block">
                          <FieldLabel>Venue / location</FieldLabel>
                          <Input
                            value={selectedEvent.locationLabel}
                            onChange={(value) =>
                              mutateSelectedEvent((event) => ({
                                ...event,
                                locationLabel: value,
                              }))
                            }
                          />
                        </label>
                        <label className="block">
                          <FieldLabel>Venue type</FieldLabel>
                          <SelectField
                            value={selectedEvent.venueType}
                            onChange={(value) =>
                              mutateSelectedEvent((event) => ({
                                ...event,
                                venueType: value as EventRecord["venueType"],
                              }))
                            }
                            options={["On-site", "Hybrid", "Online"]}
                          />
                        </label>
                      </div>

                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <FieldLabel>Start time</FieldLabel>
                          <div className="mt-1 h-11 rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 flex items-center gap-2 shadow-soft text-sm text-faith-ink dark:text-slate-100">
                            <CalendarClock className="h-4 w-4 text-faith-slate" />
                            {fmtLocal(selectedEvent.startISO)}
                          </div>
                        </div>
                        <div>
                          <FieldLabel>End time</FieldLabel>
                          <div className="mt-1 h-11 rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 flex items-center gap-2 shadow-soft text-sm text-faith-ink dark:text-slate-100">
                            <Clock3 className="h-4 w-4 text-faith-slate" />
                            {fmtLocal(selectedEvent.endISO)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <MetricTile
                          label="Speakers"
                          value={fmtInt(selectedEvent.speakers.length)}
                          hint={`${selectedEvent.speakers.filter((speaker) => speaker.confirmed).length} confirmed`}
                        />
                        <MetricTile
                          label="FAQs"
                          value={fmtInt(selectedEvent.faqs.length)}
                          hint="Public attendee answers"
                        />
                      </div>
                    </div>

                    <div className="rounded-3xl bg-[var(--fh-surface)] dark:bg-slate-800/40 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition-colors">
                      <div className="text-[12px] font-bold text-faith-ink dark:text-slate-100">
                        Agenda + speaker roster
                      </div>
                      <div className="mt-3 space-y-2">
                        {selectedEvent.agenda.slice(0, 5).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-700"
                          >
                            <div className="min-w-0">
                              <div className="text-[12px] font-bold text-faith-ink dark:text-slate-100 truncate">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-faith-slate truncate">
                                {item.owner} ? {item.kind}
                              </div>
                            </div>
                            <div className="shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[11px] font-bold text-faith-ink dark:text-slate-100">
                              {item.time}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {selectedEvent.speakers.map((speaker) => (
                          <Pill key={speaker.id} tone={speaker.confirmed ? "good" : "warn"}>
                            {speaker.name} ? {speaker.role}
                          </Pill>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <section className="rounded-3xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-soft transition">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-faith-ink dark:text-slate-50 uppercase tracking-tight">
                      Attendance and ticket block
                    </div>
                    <div className="mt-1 text-[11px] sm:text-xs text-faith-slate">
                      RSVP, capacity, ticket links, access controls, price tiers, and attendance forecasting.
                    </div>
                  </div>
                  <Pill tone={capacityFill > 85 ? "warn" : "good"}>{capacityFill}% filled</Pill>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="block">
                    <FieldLabel>Ticketing state</FieldLabel>
                    <SelectField
                      value={selectedEvent.ticketingState}
                      onChange={(value) =>
                        mutateSelectedEvent((event) => ({
                          ...event,
                          ticketingState: value as TicketingState,
                        }))
                      }
                      options={["RSVP only", "Free ticket", "Paid ticket", "Invite only"]}
                    />
                  </label>
                  <label className="block">
                    <FieldLabel>Capacity</FieldLabel>
                    <Input
                      value={selectedEvent.capacity}
                      onChange={(value) =>
                        mutateSelectedEvent((event) => ({
                          ...event,
                          capacity: Math.max(0, Number(value) || 0),
                        }))
                      }
                    />
                  </label>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3">
                  <MetricTile label="Registered" value={fmtInt(selectedEvent.registrations)} hint="Confirmed attendees" />
                  <MetricTile label="Waitlist" value={fmtInt(selectedEvent.waitlist)} hint="Overflow interest" />
                  <MetricTile label="Forecast" value={fmtInt(selectedEvent.forecastAttendance)} hint="Projected arrivals" />
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] text-faith-slate">
                    <span>Capacity and attendance forecast</span>
                    <span>{capacityFill}% full</span>
                  </div>
                  <div className="mt-1">
                    <ProgressBar value={capacityFill} tone={capacityFill > 85 ? "accent" : "brand"} />
                  </div>
                </div>

                <div className="mt-4 rounded-3xl bg-[var(--fh-surface)] dark:bg-slate-800/40 p-4 ring-1 ring-slate-200 dark:ring-slate-800 transition-colors">
                  <div className="text-[12px] font-bold text-faith-ink dark:text-slate-100">
                    Price tiers and access
                  </div>
                  <div className="mt-3 space-y-2">
                    {selectedEvent.tiers.map((tier) => (
                      <div
                        key={tier.id}
                        className="rounded-2xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-[12px] font-bold text-faith-ink dark:text-slate-100">
                              {tier.label}
                            </div>
                            <div className="text-[11px] text-faith-slate">
                              {tier.priceLabel}
                            </div>
                          </div>
                          <Pill tone={tier.sold >= tier.cap ? "warn" : "neutral"}>
                            {fmtInt(tier.sold)} / {fmtInt(tier.cap)}
                          </Pill>
                        </div>
                        <div className="mt-2">
                          <ProgressBar value={pct(tier.sold, tier.cap)} tone={tier.sold >= tier.cap ? "accent" : "brand"} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-[11px] text-faith-slate">
                    Access rules, ticket links, and attendee forecasting stay tied to the event record so reminders and check-in mode stay accurate.
                  </div>
                </div>
              </section>

              <section className="rounded-3xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-soft transition">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-faith-ink dark:text-slate-50 uppercase tracking-tight">
                      Live and content ties
                    </div>
                    <div className="mt-1 text-[11px] sm:text-xs text-faith-slate">
                      Link events to Live Sessions, teachings, Series content, or post-event replay packages.
                    </div>
                  </div>
                  <Pill tone={liveTieCount > 0 ? "brand" : "warn"}>
                    {liveTieCount} active ties
                  </Pill>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3">
                  {[
                    { label: "Series", value: selectedEvent.linkedSeries, icon: <Layers className="h-4 w-4" /> },
                    { label: "Standalone teaching", value: selectedEvent.linkedTeaching, icon: <MonitorPlay className="h-4 w-4" /> },
                    { label: "Live session", value: selectedEvent.linkedLive, icon: <Radio className="h-4 w-4" /> },
                    { label: "Replay package", value: selectedEvent.linkedReplay, icon: <Workflow className="h-4 w-4" /> },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl bg-[var(--fh-surface)] dark:bg-slate-800/40 p-3 ring-1 ring-slate-200 dark:ring-slate-800 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="h-10 w-10 rounded-2xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-700 grid place-items-center text-faith-ink dark:text-slate-100 shrink-0">
                            {item.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[12px] font-bold text-faith-ink dark:text-slate-100">
                              {item.label}
                            </div>
                            <div className="text-[11px] text-faith-slate truncate">
                              {item.value || "Not linked yet"}
                            </div>
                          </div>
                        </div>
                        <Btn
                          tone="ghost"
                          className="px-3 py-2 text-[11px]"
                          onClick={() =>
                            safeNav(
                              item.label === "Replay package"
                                ? ROUTES.postLivePublishing
                                : ROUTES.liveBuilder,
                            )
                          }
                        >
                          Open
                        </Btn>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-3xl bg-[var(--fh-surface)] dark:bg-slate-800/40 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                    <div className="text-[12px] font-bold text-faith-ink dark:text-slate-100">
                      Workflow bridge
                    </div>
                  </div>
                  <div className="mt-2 text-[12px] text-faith-slate">
                    Events can become content engines: tie them to a live session, turn the replay into clips, and route finished assets into Beacon or donor follow-up without re-entering metadata.
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Btn tone="neutral" className="px-3 py-2 text-[12px]" onClick={() => safeNav(ROUTES.liveBuilder)}>
                      Open Live Builder
                    </Btn>
                    <Btn tone="accent" className="px-3 py-2 text-[12px]" onClick={promoteWithBeacon}>
                      Promote event flow
                    </Btn>
                  </div>
                </div>
              </section>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <section className="rounded-3xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-soft transition">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-faith-ink dark:text-slate-50 uppercase tracking-tight">
                      Operational logistics area
                    </div>
                    <div className="mt-1 text-[11px] sm:text-xs text-faith-slate">
                      Venue readiness, equipment notes, travel, waivers, check-in flow, and team assignments.
                    </div>
                  </div>
                  <Pill tone={blockedCount > 0 ? "bad" : atRiskCount > 0 ? "warn" : "good"}>
                    {blockedCount > 0 ? "Blocked items" : atRiskCount > 0 ? "At risk" : "Operationally ready"}
                  </Pill>
                </div>

                <div className="mt-4 space-y-2">
                  {selectedEvent.logistics.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl bg-[var(--fh-surface)] dark:bg-slate-800/40 p-3 ring-1 ring-slate-200 dark:ring-slate-800 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-[12px] font-bold text-faith-ink dark:text-slate-100">
                            {item.label}
                          </div>
                          <div className="text-[11px] text-faith-slate">
                            {item.owner}
                          </div>
                          <div className="mt-1 text-[11px] text-faith-slate dark:text-slate-300">
                            {item.note}
                          </div>
                        </div>
                        <Pill tone={logisticsTone(item.status)}>{item.status}</Pill>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[var(--fh-surface)] dark:bg-slate-800/40 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="flex items-center gap-2">
                      <MonitorPlay className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                      <div className="text-[12px] font-bold text-faith-ink dark:text-slate-100">
                        Equipment notes
                      </div>
                    </div>
                    <div className="mt-2 text-[11px] text-faith-slate dark:text-slate-300">
                      {selectedEvent.equipmentNote}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[var(--fh-surface)] dark:bg-slate-800/40 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                      <div className="text-[12px] font-bold text-faith-ink dark:text-slate-100">
                        Travel & access
                      </div>
                    </div>
                    <div className="mt-2 text-[11px] text-faith-slate dark:text-slate-300">
                      {selectedEvent.travelNote}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-3xl bg-[var(--fh-surface)] dark:bg-slate-800/40 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[12px] font-bold text-faith-ink dark:text-slate-100">
                      Team assignments
                    </div>
                    <Pill tone={volunteerCoverage < 100 ? "warn" : "good"}>
                      {volunteerCoverage}% covered
                    </Pill>
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={volunteerCoverage} tone={volunteerCoverage < 100 ? "accent" : "brand"} />
                  </div>
                  <div className="mt-3 space-y-2">
                    {selectedEvent.volunteerRoles.map((role) => (
                      <div
                        key={role.id}
                        className="flex items-center justify-between gap-2 rounded-2xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-700"
                      >
                        <div className="text-[12px] font-semibold text-faith-ink dark:text-slate-100">
                          {role.role}
                        </div>
                        <Pill tone={role.assigned >= role.needed ? "good" : "warn"}>
                          {role.assigned}/{role.needed}
                        </Pill>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-faith-slate">
                    <span>Check-in mode: <span className="font-semibold text-faith-ink dark:text-slate-100">{selectedEvent.checkInMode}</span></span>
                    <span>?</span>
                    <span>Waiver: <span className="font-semibold text-faith-ink dark:text-slate-100">{selectedEvent.waiverRequired ? "Required" : "Not required"}</span></span>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-soft transition">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-faith-ink dark:text-slate-50 uppercase tracking-tight">
                      Promotion and audience panel
                    </div>
                    <div className="mt-1 text-[11px] sm:text-xs text-faith-slate">
                      Route the event into notifications, Beacon, and segment targeting with clear performance visibility.
                    </div>
                  </div>
                  <Pill tone={selectedEvent.beaconReady ? "good" : "warn"}>
                    {selectedEvent.beaconReady ? "Promotion-ready" : "Needs promo setup"}
                  </Pill>
                </div>

                <div className="mt-4 rounded-3xl bg-[var(--fh-surface)] dark:bg-slate-800/40 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[12px] font-bold text-faith-ink dark:text-slate-100">
                        Target segments
                      </div>
                      <div className="text-[11px] text-faith-slate">
                        Groups likely to respond best to this event.
                      </div>
                    </div>
                    <Pill tone="brand">{selectedEvent.segments.length} segments</Pill>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {selectedEvent.segments.map((segment) => (
                      <Pill key={segment} tone="neutral">
                        {segment}
                      </Pill>
                    ))}
                  </div>
                </div>

                <div className="mt-4 rounded-3xl bg-[var(--fh-surface)] dark:bg-slate-800/40 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[12px] font-bold text-faith-ink dark:text-slate-100">
                      Promotion channels
                    </div>
                    <Pill tone={enabledChannelCount > 1 ? "good" : "warn"}>
                      {enabledChannelCount} active
                    </Pill>
                  </div>
                  <div className="mt-3 space-y-2">
                    {selectedEvent.promotionChannels.map((channel) => (
                      <div
                        key={channel.id}
                        className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-700"
                      >
                        <div className="min-w-0">
                          <div className="text-[12px] font-bold text-faith-ink dark:text-slate-100 truncate">
                            {channel.label}
                          </div>
                          <div className="text-[11px] text-faith-slate truncate">
                            {channel.hint} ? {channel.health}
                          </div>
                        </div>
                        <Toggle
                          value={channel.enabled}
                          onChange={(value) =>
                            mutateSelectedEvent((event) => ({
                              ...event,
                              promotionChannels: event.promotionChannels.map((item) =>
                                item.id === channel.id ? { ...item, enabled: value } : item,
                              ),
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 rounded-3xl bg-[var(--fh-surface)] dark:bg-slate-800/40 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-[12px] font-bold text-faith-ink dark:text-slate-100">
                    Registration source mix
                  </div>
                  <div className="mt-1 text-[11px] text-faith-slate">
                    Track what is actually filling the room so future media plans get smarter.
                  </div>
                  <div className="mt-3">
                    <SourceMixPanel sourceMix={selectedEvent.registrationSourceMix} />
                  </div>
                </div>
              </section>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <section className="rounded-3xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-soft transition">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-faith-ink dark:text-slate-50 uppercase tracking-tight">
                      Giving and merchandising strip
                    </div>
                    <div className="mt-1 text-[11px] sm:text-xs text-faith-slate">
                      Event-linked funds, crowdfunds, merch links, sponsor mentions, and on-site giving moments.
                    </div>
                  </div>
                  <Pill tone={activeGivingCount > 0 ? "good" : "warn"}>
                    {activeGivingCount} active links
                  </Pill>
                </div>

                <div className="mt-4 space-y-2">
                  {selectedEvent.givingLines.map((line) => (
                    <div
                      key={line.id}
                      className="rounded-2xl bg-[var(--fh-surface)] dark:bg-slate-800/40 p-3 ring-1 ring-slate-200 dark:ring-slate-800"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="h-9 w-9 rounded-2xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-700 grid place-items-center">
                              {line.type === "Fund" ? (
                                <HeartHandshake className="h-4 w-4 text-faith-ink dark:text-slate-100" />
                              ) : line.type === "Crowdfund" ? (
                                <Gift className="h-4 w-4 text-faith-ink dark:text-slate-100" />
                              ) : line.type === "Merch" ? (
                                <ShoppingBag className="h-4 w-4 text-faith-ink dark:text-slate-100" />
                              ) : (
                                <Sparkles className="h-4 w-4 text-faith-ink dark:text-slate-100" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-[12px] font-bold text-faith-ink dark:text-slate-100 truncate">
                                {line.label}
                              </div>
                              <div className="text-[11px] text-faith-slate">
                                {line.type} ? {line.status}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-[11px] text-faith-slate dark:text-slate-300">
                            {line.value}
                          </div>
                        </div>
                        <Toggle
                          value={line.enabled}
                          onChange={(value) =>
                            mutateSelectedEvent((event) => ({
                              ...event,
                              givingLines: event.givingLines.map((item) =>
                                item.id === line.id ? { ...item, enabled: value } : item,
                              ),
                            }))
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-3xl bg-[var(--fh-surface)] dark:bg-slate-800/40 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                    <div className="text-[12px] font-bold text-faith-ink dark:text-slate-100">
                      Sponsor and public mention state
                    </div>
                  </div>
                  <div className="mt-2 text-[11px] text-faith-slate dark:text-slate-300">
                    {selectedEvent.sponsorMention}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {selectedEvent.linkedFund ? <Pill tone="good">{selectedEvent.linkedFund}</Pill> : null}
                    {selectedEvent.linkedCrowdfund ? <Pill tone="accent">{selectedEvent.linkedCrowdfund}</Pill> : null}
                    {selectedEvent.linkedMerch ? <Pill tone="neutral">{selectedEvent.linkedMerch}</Pill> : null}
                  </div>
                </div>
              </section>

              <section className="rounded-3xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-soft transition">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-faith-ink dark:text-slate-50 uppercase tracking-tight">
                      After-event follow-up lane
                    </div>
                    <div className="mt-1 text-[11px] sm:text-xs text-faith-slate">
                      Turn completed events into replay, clip, review, thank-you, and next-step journeys.
                    </div>
                  </div>
                  <Pill tone="brand">{selectedEvent.followUps.length} playbooks</Pill>
                </div>

                <div className="mt-4 space-y-2">
                  {selectedEvent.followUps.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--fh-surface)] dark:bg-slate-800/40 px-3 py-3 ring-1 ring-slate-200 dark:ring-slate-800"
                    >
                      <div className="min-w-0">
                        <div className="text-[12px] font-bold text-faith-ink dark:text-slate-100">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-faith-slate">
                          {item.hint}
                        </div>
                      </div>
                      <Toggle
                        value={item.enabled}
                        onChange={(value) =>
                          mutateSelectedEvent((event) => ({
                            ...event,
                            followUps: event.followUps.map((follow) =>
                              follow.id === item.id ? { ...follow, enabled: value } : follow,
                            ),
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-3xl bg-[var(--fh-surface)] dark:bg-slate-800/40 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Btn
                      tone="primary"
                      className="w-full"
                      left={<CheckCircle2 className="h-4 w-4" />}
                      onClick={publishEventPlan}
                      disabled={workingAction === "publish"}
                    >
                      {workingAction === "publish" ? "Publishingâ€¦" : "Mark operationally ready"}
                    </Btn>
                    <Btn
                      tone="accent"
                      className="w-full"
                      left={<Zap className="h-4 w-4" />}
                      onClick={promoteWithBeacon}
                    >
                      Promote with Beacon
                    </Btn>
                  </div>
                  <div className="mt-3 text-[11px] text-faith-slate">
                    Premium follow-up keeps the event alive after the room empties: replay packaging, clip extraction, review collection, and next-step outreach all stay connected.
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <section className="rounded-3xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-soft transition">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-faith-ink dark:text-slate-50 uppercase tracking-tight">
                    Event preview
                  </div>
                  <div className="mt-1 text-[11px] sm:text-xs text-faith-slate">
                    Premium public event card preview plus check-in and planning handoff.
                  </div>
                </div>
                <div className="inline-flex rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-1">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("desktop")}
                    className={cx(
                      "px-3 py-1.5 rounded-xl text-[11px] font-bold transition",
                      previewMode === "desktop"
                        ? "bg-[var(--fh-surface-bg)] dark:bg-slate-900 shadow-soft text-faith-ink dark:text-slate-100"
                        : "text-faith-slate",
                    )}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("mobile")}
                    className={cx(
                      "px-3 py-1.5 rounded-xl text-[11px] font-bold transition",
                      previewMode === "mobile"
                        ? "bg-[var(--fh-surface-bg)] dark:bg-slate-900 shadow-soft text-faith-ink dark:text-slate-100"
                        : "text-faith-slate",
                    )}
                  >
                    Mobile
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <EventPreviewSurface event={selectedEvent} mode={previewMode} compact />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Btn tone="primary" className="w-full" onClick={() => setPreviewOpen(true)} left={<Eye className="h-4 w-4" />}>
                  Open preview
                </Btn>
                <Btn tone="neutral" className="w-full" onClick={openCheckInMode} left={<QrCode className="h-4 w-4" />}>
                  Check-in
                </Btn>
              </div>
            </section>

            <section className="rounded-3xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-soft transition">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-faith-ink dark:text-slate-50 uppercase tracking-tight">
                    Operational health
                  </div>
                  <div className="mt-1 text-[11px] sm:text-xs text-faith-slate">
                    Premium readiness, staffing, and schedule visibility.
                  </div>
                </div>
                <Pill tone={readinessScore >= 85 ? "good" : readinessScore >= 65 ? "warn" : "bad"}>
                  Ready {readinessScore}%
                </Pill>
              </div>

              <div className="mt-4">
                <ProgressBar value={readinessScore} tone={readinessScore >= 85 ? "brand" : "accent"} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <MetricTile label="Volunteer coverage" value={`${volunteerCoverage}%`} hint="Roles assigned" />
                <MetricTile label="Promo channels" value={fmtInt(enabledChannelCount)} hint="Journey mix" />
                <MetricTile label="Giving links" value={fmtInt(activeGivingCount)} hint="Fund + merch" />
                <MetricTile label="Queue risk" value={blockedCount > 0 ? `${blockedCount}` : "0"} hint="Critical blockers" />
              </div>

              <div className="mt-4 rounded-3xl bg-[var(--fh-surface)] dark:bg-slate-800/40 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="text-[12px] font-bold text-faith-ink dark:text-slate-100">
                  Registration trend
                </div>
                <div className="mt-1 text-[11px] text-faith-slate">
                  Source-weighted planning pulse for the current event.
                </div>
                <div className="mt-3">
                  <TinySparkline values={selectedEvent.registrationSourceMix} />
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-[var(--fh-surface-bg)] dark:bg-slate-900 p-4 sm:p-5 ring-1 ring-slate-200 dark:ring-slate-800 shadow-soft transition">
              <div className="text-sm font-bold text-faith-ink dark:text-slate-50 uppercase tracking-tight">
                Quick links
              </div>
              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  onClick={() => safeNav(ROUTES.liveBuilder)}
                  className="w-full flex items-center justify-between gap-3 rounded-2xl bg-[var(--fh-surface)] dark:bg-slate-800/40 px-3 py-3 ring-1 ring-slate-200 dark:ring-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-3">
                    <MonitorPlay className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                    <div className="text-[12px] font-bold text-faith-ink dark:text-slate-100">Live Builder</div>
                  </div>
                  <Pill tone="neutral">Open</Pill>
                </button>
                <button
                  type="button"
                  onClick={() => safeNav(ROUTES.donationsFunds)}
                  className="w-full flex items-center justify-between gap-3 rounded-2xl bg-[var(--fh-surface)] dark:bg-slate-800/40 px-3 py-3 ring-1 ring-slate-200 dark:ring-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-3">
                    <Gift className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                    <div className="text-[12px] font-bold text-faith-ink dark:text-slate-100">Donations & Funds</div>
                  </div>
                  <Pill tone="neutral">Open</Pill>
                </button>
                <button
                  type="button"
                  onClick={() => safeNav(ROUTES.beaconBuilder)}
                  className="w-full flex items-center justify-between gap-3 rounded-2xl bg-[var(--fh-surface)] dark:bg-slate-800/40 px-3 py-3 ring-1 ring-slate-200 dark:ring-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                    <div className="text-[12px] font-bold text-faith-ink dark:text-slate-100">Beacon Builder</div>
                  </div>
                  <Pill tone="accent">Promote</Pill>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Drawer
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Event preview suite"
        right={
          <div className="inline-flex rounded-2xl border border-faith-line dark:border-slate-800 bg-[var(--fh-surface)] dark:bg-slate-950 p-1">
            <button
              type="button"
              onClick={() => setPreviewMode("desktop")}
              className={cx(
                "px-3 py-1.5 rounded-xl text-[11px] font-bold transition",
                previewMode === "desktop"
                  ? "bg-[var(--fh-surface-bg)] dark:bg-slate-900 shadow-soft text-faith-ink dark:text-slate-100"
                  : "text-faith-slate",
              )}
            >
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode("mobile")}
              className={cx(
                "px-3 py-1.5 rounded-xl text-[11px] font-bold transition",
                previewMode === "mobile"
                  ? "bg-[var(--fh-surface-bg)] dark:bg-slate-900 shadow-soft text-faith-ink dark:text-slate-100"
                  : "text-faith-slate",
              )}
            >
              Mobile
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div>
            <EventPreviewSurface event={selectedEvent} mode={previewMode} />
          </div>
          <div className="space-y-4">
            <CheckInConsolePreview event={selectedEvent} />
            <div className="rounded-3xl bg-[var(--fh-surface)] dark:bg-slate-800/40 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
              <div className="text-[12px] font-bold text-faith-ink dark:text-slate-100">
                Premium preview lab
              </div>
              <div className="mt-2 text-[12px] text-faith-slate dark:text-slate-300">
                Review public event presentation, attendance positioning, and check-in behavior before launch. Desktop and mobile previews mirror how event discovery and conversion surfaces will feel across the platform.
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Btn tone="primary" left={<Ticket className="h-4 w-4" />} onClick={publishEventPlan}>
                  Publish event plan
                </Btn>
                <Btn tone="accent" left={<Zap className="h-4 w-4" />} onClick={promoteWithBeacon}>
                  Promote now
                </Btn>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      <Drawer
        open={checkInOpen}
        onClose={() => setCheckInOpen(false)}
        title="Check-in mode"
      >
        <div className="space-y-4">
          <CheckInConsolePreview event={selectedEvent} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <MetricTile label="Expected arrivals" value={fmtInt(selectedEvent.forecastAttendance)} hint="Operational forecast" />
            <MetricTile label="Waitlist pressure" value={fmtInt(selectedEvent.waitlist)} hint="Potential overflow" />
            <MetricTile label="Waiver policy" value={selectedEvent.waiverRequired ? "Required" : "Off"} hint="Entry control" />
          </div>
        </div>
      </Drawer>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-semibold shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}














