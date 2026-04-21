// @ts-nocheck
"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  Copy,
  Eye,
  ExternalLink,
  LayoutGrid,
  Link2,
  Megaphone,
  MessageSquare,
  PlayCircle,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserPlus,
  X,
} from "lucide-react";
import { navigateWithRouter } from "@/navigation/routerNavigate";
import { ProviderPageTitle } from "@/components/provider/ProviderPageTitle";

/**
 * Provider — Testimonies
 * --------------------------------
 * Premium Provider-side page for collecting, reviewing, approving,
 * publishing, and featuring testimonies across the institution.
 *
 * This page follows the same premium Provider Workspace grammar used on the
 * other generated pages:
 * - EVzone Green as primary accent
 * - Orange as secondary accent
 * - strong command header + KPI strip
 * - searchable review inbox
 * - selected-story editorial / consent workspace
 * - featuring and publication board
 * - persistent preview rail + large preview drawer
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#1e2b6d";

const ROUTES = {
  providerDashboard: "/faithhub/provider/dashboard",
  communityGroups: "/faithhub/provider/community-groups",
  prayerRequests: "/faithhub/provider/prayer-requests",
  noticeboard: "/faithhub/provider/noticeboard",
  replaysClips: "/faithhub/provider/replays-clips",
  testimoniesBuilder: "/faithhub/provider/testimonies/new",
};

const HERO_1 =
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1400&q=80";
const HERO_2 =
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1400&q=80";
const HERO_3 =
  "https://images.unsplash.com/photo-1490127252417-7c393f193581?auto=format&fit=crop&w=1400&q=80";
const HERO_4 =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80";
const HERO_5 =
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1400&q=80";
const HERO_6 =
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1400&q=80";

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  navigateWithRouter(url);
}

function fmtInt(n: number) {
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function fmtLocal(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // no-op in preview shells
  }
}

type StoryStatus =
  | "Needs review"
  | "In verification"
  | "Approved"
  | "Published"
  | "Featured"
  | "Flagged";
type StorySource =
  | "Prayer follow-up"
  | "Community Group"
  | "Live Session"
  | "Event"
  | "Standalone Form"
  | "Counseling follow-up";
type PublishMode =
  | "Private draft"
  | "Community only"
  | "Public"
  | "Anonymous publish";
type MediaType = "Video" | "Audio" | "Text + Photo" | "Text only";
type PreviewMode = "desktop" | "mobile";

type SafeguardSignal = {
  id: string;
  label: string;
  hint: string;
  tone: "good" | "warn" | "danger";
};

type ApprovalStep = {
  id: string;
  label: string;
  when: string;
  state: "Ready" | "Pending" | "Done" | "Blocked";
};

type PlacementHook = {
  id: string;
  label: string;
  hint: string;
  state: "Ready" | "Pending" | "Blocked" | "Featured";
};

type StoryImpact = {
  reads: number;
  shares: number;
  saves: number;
  responses: number;
};

type TestimonyRecord = {
  id: string;
  title: string;
  storyteller: string;
  displayName: string;
  source: StorySource;
  status: StoryStatus;
  publishMode: PublishMode;
  category: string;
  summary: string;
  storyText: string;
  keyVerse: string;
  mediaType: MediaType;
  submittedISO: string;
  publishedISO?: string;
  featuredSlot?: string;
  consentSigned: boolean;
  mediaRelease: boolean;
  verified: boolean;
  anonymousRequested: boolean;
  childSafe: boolean;
  linkedGroup?: string;
  linkedLive?: string;
  linkedReplay?: string;
  linkedEvent?: string;
  heroUrl: string;
  tags: string[];
  safeguards: SafeguardSignal[];
  approvalSteps: ApprovalStep[];
  placements: PlacementHook[];
  impact: StoryImpact;
};

const testimoniesSeed: TestimonyRecord[] = [
  {
    id: "TM-102",
    title: "God opened a job door after Night of Hope",
    storyteller: "Mercy K.",
    displayName: "Mercy K.",
    source: "Prayer follow-up",
    status: "Needs review",
    publishMode: "Public",
    category: "Provision",
    summary:
      "A new job offer came two days after the live prayer response and follow-up care call.",
    storyText:
      "I asked for prayer during Night of Hope because I had lost my job. The care team followed up, stood with me in prayer, and within two days I received a role I had been waiting on for months. I want this story to strengthen someone else who feels stuck right now.",
    keyVerse: "Philippians 4:19",
    mediaType: "Video",
    submittedISO: new Date(Date.now() - 2.1 * 60 * 60 * 1000).toISOString(),
    consentSigned: true,
    mediaRelease: true,
    verified: false,
    anonymousRequested: false,
    childSafe: false,
    linkedLive: "Night of Hope Revival",
    linkedReplay: "Night of Hope — Replay",
    heroUrl: HERO_1,
    tags: ["Provision", "Jobs", "Night of Hope"],
    safeguards: [
      {
        id: "sg1",
        label: "Consent signed",
        hint: "Storyteller approved public publication and editorial polishing.",
        tone: "good",
      },
      {
        id: "sg2",
        label: "Verification still needed",
        hint: "Team should confirm final dates and the employer reference line before publication.",
        tone: "warn",
      },
    ],
    approvalSteps: [
      { id: "ap1", label: "Intake captured", when: "Done", state: "Done" },
      { id: "ap2", label: "Proof / context review", when: "Now", state: "Ready" },
      { id: "ap3", label: "Publication decision", when: "After verification", state: "Pending" },
    ],
    placements: [
      {
        id: "pl1",
        label: "Institution spotlight",
        hint: "Strong hero story for home and institution profile surfaces.",
        state: "Ready",
      },
      {
        id: "pl2",
        label: "Noticeboard highlight",
        hint: "Ready once approval and public copy are finalized.",
        state: "Ready",
      },
      {
        id: "pl3",
        label: "Live pre-roll story",
        hint: "Requires short edit from the source video clip.",
        state: "Pending",
      },
    ],
    impact: { reads: 0, shares: 0, saves: 0, responses: 0 },
  },
  {
    id: "TM-103",
    title: "Anonymous healing testimony after youth prayer night",
    storyteller: "Anonymous",
    displayName: "Anonymous",
    source: "Live Session",
    status: "In verification",
    publishMode: "Anonymous publish",
    category: "Healing",
    summary:
      "A testimony submitted after a youth prayer moment with a request to protect identity.",
    storyText:
      "I came into the youth prayer night in pain and discouraged. I do not want my face or full name shown, but I want people to know that I left with peace and saw physical improvement after the team prayed for me. Please keep the story anonymous.",
    keyVerse: "Jeremiah 30:17",
    mediaType: "Audio",
    submittedISO: new Date(Date.now() - 6.4 * 60 * 60 * 1000).toISOString(),
    consentSigned: true,
    mediaRelease: false,
    verified: false,
    anonymousRequested: true,
    childSafe: true,
    linkedLive: "Ignite Youth Prayer Night",
    heroUrl: HERO_2,
    tags: ["Healing", "Youth", "Anonymous"],
    safeguards: [
      {
        id: "sg3",
        label: "Anonymous-only publication",
        hint: "Name, face, and direct identifiers must remain hidden across all destinations.",
        tone: "danger",
      },
      {
        id: "sg4",
        label: "Minor-safe workflow",
        hint: "Safeguarding review must be completed before feature placement.",
        tone: "warn",
      },
    ],
    approvalSteps: [
      { id: "ap4", label: "Intake captured", when: "Done", state: "Done" },
      { id: "ap5", label: "Safeguarding review", when: "Now", state: "Ready" },
      { id: "ap6", label: "Anonymous edit pass", when: "After review", state: "Pending" },
    ],
    placements: [
      {
        id: "pl4",
        label: "Anonymous wall",
        hint: "Safe for public display after safeguarding approval.",
        state: "Pending",
      },
      {
        id: "pl5",
        label: "Youth digest",
        hint: "Community-only publication recommended first.",
        state: "Pending",
      },
      {
        id: "pl6",
        label: "Institution spotlight",
        hint: "Not recommended until identity-safe edit is complete.",
        state: "Blocked",
      },
    ],
    impact: { reads: 24, shares: 2, saves: 6, responses: 3 },
  },
  {
    id: "TM-104",
    title: "Family reconciliation after 21 days of prayer",
    storyteller: "Lydia P.",
    displayName: "Lydia P.",
    source: "Community Group",
    status: "Approved",
    publishMode: "Community only",
    category: "Family",
    summary:
      "A community-group story of restored communication between parents and children.",
    storyText:
      "Our family had not sat at one table in peace for a long time. During the 21 days of prayer, our group kept encouraging us to speak blessing, repent quickly, and try again. We are not perfect, but the atmosphere at home changed, and I want to honour God for that.",
    keyVerse: "Joshua 24:15",
    mediaType: "Text + Photo",
    submittedISO: new Date(Date.now() - 1.4 * 24 * 60 * 60 * 1000).toISOString(),
    consentSigned: true,
    mediaRelease: true,
    verified: true,
    anonymousRequested: false,
    childSafe: false,
    linkedGroup: "Families of Grace Circle",
    heroUrl: HERO_3,
    tags: ["Family", "Prayer", "Community Group"],
    safeguards: [
      {
        id: "sg5",
        label: "Verification complete",
        hint: "Care lead and group leader both approved the story summary.",
        tone: "good",
      },
    ],
    approvalSteps: [
      { id: "ap7", label: "Leader review", when: "Done", state: "Done" },
      { id: "ap8", label: "Editorial polish", when: "Done", state: "Done" },
      { id: "ap9", label: "Community publish", when: "Ready now", state: "Ready" },
    ],
    placements: [
      {
        id: "pl7",
        label: "Community noticeboard",
        hint: "Ideal for group and family surfaces.",
        state: "Ready",
      },
      {
        id: "pl8",
        label: "Series resource page",
        hint: "Can be used as a supporting story under family teachings.",
        state: "Ready",
      },
      {
        id: "pl9",
        label: "Beacon teaser",
        hint: "Optional promotion once public cutdown exists.",
        state: "Pending",
      },
    ],
    impact: { reads: 131, shares: 19, saves: 31, responses: 14 },
  },
  {
    id: "TM-105",
    title: "Baptism day story that became a replay standout moment",
    storyteller: "Joshua N.",
    displayName: "Joshua N.",
    source: "Event",
    status: "Published",
    publishMode: "Public",
    category: "Salvation",
    summary:
      "A baptism testimony that now drives replay watch starts and event follow-up.",
    storyText:
      "I had watched online for months before stepping into the baptism service. Sharing my testimony publicly was difficult, but it ended up helping friends who had been following from a distance. Even after the event, people keep saying the replay moment encouraged them to take their next step.",
    keyVerse: "2 Corinthians 5:17",
    mediaType: "Video",
    submittedISO: new Date(Date.now() - 5.2 * 24 * 60 * 60 * 1000).toISOString(),
    publishedISO: new Date(Date.now() - 3.1 * 24 * 60 * 60 * 1000).toISOString(),
    consentSigned: true,
    mediaRelease: true,
    verified: true,
    anonymousRequested: false,
    childSafe: false,
    linkedEvent: "Baptism Sunday",
    linkedReplay: "Baptism Sunday — Replay",
    heroUrl: HERO_4,
    tags: ["Baptism", "Salvation", "Replay"],
    safeguards: [
      {
        id: "sg6",
        label: "Ready for wider distribution",
        hint: "All publication controls are cleared for public surfaces.",
        tone: "good",
      },
    ],
    approvalSteps: [
      { id: "ap10", label: "Approved", when: "Done", state: "Done" },
      { id: "ap11", label: "Published", when: "Done", state: "Done" },
      { id: "ap12", label: "Feature review", when: "This week", state: "Ready" },
    ],
    placements: [
      {
        id: "pl10",
        label: "Replay destination",
        hint: "Already live and performing strongly.",
        state: "Featured",
      },
      {
        id: "pl11",
        label: "Institution home rail",
        hint: "Healthy engagement supports featuring.",
        state: "Ready",
      },
      {
        id: "pl12",
        label: "Next-step campaign",
        hint: "Can be attached to follow-up journeys and event reminders.",
        state: "Ready",
      },
    ],
    impact: { reads: 3840, shares: 412, saves: 991, responses: 177 },
  },
  {
    id: "TM-106",
    title: "Counseling journey restored hope and daily routine",
    storyteller: "Ruth A.",
    displayName: "Ruth A.",
    source: "Counseling follow-up",
    status: "Featured",
    publishMode: "Public",
    category: "Hope",
    summary:
      "A carefully edited counseling follow-up story with public consent and strong trust signals.",
    storyText:
      "The counseling and prayer pathway helped me rebuild routine, hope, and community. I wanted to tell the story carefully, not to expose private details, but to show that asking for help can be a holy next step. The pastoral team helped me shape the final version before it was shared publicly.",
    keyVerse: "Psalm 34:18",
    mediaType: "Text + Photo",
    submittedISO: new Date(Date.now() - 9.6 * 24 * 60 * 60 * 1000).toISOString(),
    publishedISO: new Date(Date.now() - 6.1 * 24 * 60 * 60 * 1000).toISOString(),
    featuredSlot: "Institution spotlight",
    consentSigned: true,
    mediaRelease: true,
    verified: true,
    anonymousRequested: false,
    childSafe: false,
    heroUrl: HERO_5,
    tags: ["Hope", "Counseling", "Care"],
    safeguards: [
      {
        id: "sg7",
        label: "Pastoral sign-off complete",
        hint: "Private counseling details were removed before public publication.",
        tone: "good",
      },
    ],
    approvalSteps: [
      { id: "ap13", label: "Approved", when: "Done", state: "Done" },
      { id: "ap14", label: "Published", when: "Done", state: "Done" },
      { id: "ap15", label: "Featured on institution home", when: "Live now", state: "Done" },
    ],
    placements: [
      {
        id: "pl13",
        label: "Institution spotlight",
        hint: "Currently featured on main community surfaces.",
        state: "Featured",
      },
      {
        id: "pl14",
        label: "Noticeboard hero",
        hint: "Can remain pinned this week.",
        state: "Featured",
      },
      {
        id: "pl15",
        label: "Live intro story",
        hint: "Safe to use as pre-roll encouragement.",
        state: "Ready",
      },
    ],
    impact: { reads: 5210, shares: 603, saves: 1208, responses: 233 },
  },
  {
    id: "TM-107",
    title: "Miracle language flagged for review before publication",
    storyteller: "Brian T.",
    displayName: "Brian T.",
    source: "Standalone Form",
    status: "Flagged",
    publishMode: "Private draft",
    category: "Healing",
    summary:
      "A story with strong encouragement value, but language and evidence handling still need careful moderation.",
    storyText:
      "I want to testify because something powerful happened during prayer. However, I used strong wording in my first submission and the team asked me to slow down, add detail carefully, and remove anything that sounds medically absolute or unsafe. I appreciate that process and want the final story to be truthful and wise.",
    keyVerse: "Mark 5:34",
    mediaType: "Text only",
    submittedISO: new Date(Date.now() - 11.4 * 60 * 60 * 1000).toISOString(),
    consentSigned: false,
    mediaRelease: false,
    verified: false,
    anonymousRequested: false,
    childSafe: false,
    heroUrl: HERO_6,
    tags: ["Flagged", "Review", "Healing"],
    safeguards: [
      {
        id: "sg8",
        label: "Consent missing",
        hint: "Public release and featuring are blocked until the consent trail is complete.",
        tone: "danger",
      },
      {
        id: "sg9",
        label: "Language moderation required",
        hint: "Needs tone and factual-review adjustments before publication.",
        tone: "warn",
      },
    ],
    approvalSteps: [
      { id: "ap16", label: "Moderation review", when: "Now", state: "Ready" },
      { id: "ap17", label: "Fresh consent capture", when: "After edits", state: "Blocked" },
      { id: "ap18", label: "Publication", when: "Blocked", state: "Blocked" },
    ],
    placements: [
      {
        id: "pl16",
        label: "All public surfaces",
        hint: "Blocked until moderation and consent are resolved.",
        state: "Blocked",
      },
      {
        id: "pl17",
        label: "Care-team archive",
        hint: "Safe internal-only storage for ongoing review.",
        state: "Ready",
      },
      {
        id: "pl18",
        label: "Feature lanes",
        hint: "Not eligible right now.",
        state: "Blocked",
      },
    ],
    impact: { reads: 0, shares: 0, saves: 0, responses: 1 },
  },
];

function toneClass(
  tone: "neutral" | "good" | "warn" | "danger" | "brand" | "navy",
) {
  if (tone === "good") {
    return "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300";
  }
  if (tone === "warn") {
    return "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300";
  }
  if (tone === "danger") {
    return "border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300";
  }
  if (tone === "navy") {
    return "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300";
  }
  if (tone === "brand") {
    return "border-transparent text-white";
  }
  return "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300";
}

function statusTone(
  status: StoryStatus,
): "good" | "warn" | "danger" | "navy" {
  if (status === "Featured" || status === "Published") return "good";
  if (status === "Approved") return "navy";
  if (status === "Flagged") return "danger";
  return "warn";
}

function publishTone(mode: PublishMode): "good" | "warn" | "danger" | "navy" {
  if (mode === "Public") return "good";
  if (mode === "Anonymous publish") return "navy";
  if (mode === "Community only") return "warn";
  return "danger";
}

function placementTone(
  state: PlacementHook["state"],
): "good" | "warn" | "danger" | "navy" {
  if (state === "Featured") return "good";
  if (state === "Ready") return "navy";
  if (state === "Pending") return "warn";
  return "danger";
}

function approvalTone(
  state: ApprovalStep["state"],
): "good" | "warn" | "danger" | "navy" {
  if (state === "Done") return "good";
  if (state === "Ready") return "navy";
  if (state === "Pending") return "warn";
  return "danger";
}

function priorityRank(status: StoryStatus) {
  if (status === "Flagged") return 0;
  if (status === "Needs review") return 1;
  if (status === "In verification") return 2;
  if (status === "Approved") return 3;
  if (status === "Published") return 4;
  return 5;
}

function ActionButton({
  children,
  left,
  onClick,
  className,
  tone = "soft",
  disabled,
}: {
  children: React.ReactNode;
  left?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  tone?: "soft" | "primary" | "ghost";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-[12px] font-semibold transition-colors",
        disabled
          ? "cursor-not-allowed opacity-60 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800"
          : tone === "primary"
            ? "text-white border-transparent hover:opacity-95"
            : tone === "ghost"
              ? "bg-transparent border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700",
        className,
      )}
      style={tone === "primary" ? { background: EV_GREEN } : undefined}
    >
      {left}
      {children}
    </button>
  );
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
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        toneClass(tone),
      )}
      style={tone === "brand" ? { background: EV_ORANGE } : undefined}
    >
      {icon}
      {text}
    </span>
  );
}

function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent: "green" | "orange" | "navy";
}) {
  const dot = accent === "green" ? EV_GREEN : accent === "orange" ? EV_ORANGE : EV_NAVY;
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            {label}
          </div>
          <div className="mt-2 text-[18px] font-black text-slate-900 dark:text-slate-100">
            {value}
          </div>
        </div>
        <div className="h-10 w-10 rounded-full" style={{ background: dot }} />
      </div>
      <div className="mt-3 text-[12px] leading-5 text-slate-600 dark:text-slate-400">
        {hint}
      </div>
    </div>
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
    <div className="fixed inset-0 z-[120]">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 shadow-2xl transition-colors flex flex-col">
        <div className="shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-[14px] font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </div>
              {subtitle ? (
                <div className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
                  {subtitle}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 grid place-items-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}

function FeaturePlacementCard({ hook }: { hook: PlacementHook }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[12px] font-bold text-slate-900 dark:text-slate-100">
            {hook.label}
          </div>
          <div className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
            {hook.hint}
          </div>
        </div>
        <Pill text={hook.state} tone={placementTone(hook.state)} />
      </div>
    </div>
  );
}

function TestimonyPreview({
  story,
  previewMode,
}: {
  story: TestimonyRecord;
  previewMode: PreviewMode;
}) {
  const isFeatured = story.status === "Featured";
  return (
    <div
      className={cx(
        "overflow-hidden rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors",
        previewMode === "mobile" ? "max-w-[340px] md:max-w-[380px]" : "w-full",
      )}
    >
      <div
        className={cx(
          "relative overflow-hidden",
          previewMode === "mobile" ? "aspect-[3/4]" : "aspect-[16/10]",
        )}
      >
        <img
          src={story.heroUrl}
          alt={story.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
          <Pill
            text="Testimony"
            tone="brand"
            icon={<MessageSquare className="h-3 w-3" />}
          />
          <Pill text={story.publishMode} tone={publishTone(story.publishMode)} />
          {isFeatured ? (
            <Pill text="Featured" tone="good" icon={<Star className="h-3 w-3" />} />
          ) : null}
        </div>
        <div className="absolute left-3 right-3 bottom-3 text-white">
          <div className="text-[10px] font-black uppercase tracking-[0.16em] opacity-80">
            {story.source}
          </div>
          <div className="mt-1 text-[24px] font-black leading-tight">
            {story.title}
          </div>
          <div className="mt-2 max-w-[90%] text-[12px] leading-5 text-white/90">
            {story.summary}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[12px] font-bold text-slate-900 dark:text-slate-100">
              {story.displayName}
            </div>
            <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              {story.category} • {story.mediaType}
            </div>
          </div>
          <Pill text={story.status} tone={statusTone(story.status)} />
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition-colors">
          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
            Story highlight
          </div>
          <div className="mt-1 text-[13px] font-semibold text-slate-900 dark:text-slate-100 leading-6">
            “{story.storyText.slice(0, 160)}{story.storyText.length > 160 ? "…" : ""}”
          </div>
          <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-400">
            Key verse • {story.keyVerse}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            className="rounded-2xl px-3 py-2 text-[12px] font-bold text-white"
            style={{ background: EV_GREEN }}
            onClick={() => safeNav("/faithhub/provider/testimonies")}>
            Read full story
          </button>
          <button className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-[12px] font-bold text-slate-700 dark:text-slate-200 transition-colors" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
            Share testimony
          </button>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: "Reads", value: fmtInt(story.impact.reads) },
            { label: "Shares", value: fmtInt(story.impact.shares) },
            { label: "Saves", value: fmtInt(story.impact.saves) },
            { label: "Responses", value: fmtInt(story.impact.responses) },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 transition-colors"
            >
              <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                {metric.label}
              </div>
              <div className="mt-1 text-[12px] font-bold text-slate-900 dark:text-slate-100">
                {metric.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TestimonyPreviewInner({
  story,
  previewMode,
}: {
  story: TestimonyRecord;
  previewMode: PreviewMode;
}) {
  return (
    <div className="rounded-[34px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
          Testimony destination preview
        </div>
        <div className="flex items-center gap-2">
          <Pill text={previewMode === "desktop" ? "Desktop" : "Mobile"} tone="navy" />
          <Pill text={story.status} tone={statusTone(story.status)} />
        </div>
      </div>
      <TestimonyPreview story={story} previewMode={previewMode} />
    </div>
  );
}

function selectedApprovalSteps(story: TestimonyRecord) {
  return story.approvalSteps.slice(0, 3);
}

export default function TestimoniesPage() {
  const [stories, setStories] = useState<TestimonyRecord[]>(testimoniesSeed);
  const [selectedId, setSelectedId] = useState<string>(testimoniesSeed[0]?.id || "");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All statuses");
  const [sourceFilter, setSourceFilter] = useState<string>("All sources");
  const [publishFilter, setPublishFilter] = useState<string>("All visibility");
  const [featureFilter, setFeatureFilter] = useState<string>("All feature states");

  const selectedStory = useMemo(
    () => stories.find((story) => story.id === selectedId) || stories[0],
    [stories, selectedId],
  );

  const filteredStories = useMemo(() => {
    return [...stories]
      .filter((story) => {
        const hay = [
          story.displayName,
          story.title,
          story.summary,
          story.category,
          story.tags.join(" "),
          story.source,
        ]
          .join(" ")
          .toLowerCase();
        const matchQuery = !query.trim() || hay.includes(query.trim().toLowerCase());
        const matchStatus = statusFilter === "All statuses" || story.status === statusFilter;
        const matchSource = sourceFilter === "All sources" || story.source === sourceFilter;
        const matchPublish =
          publishFilter === "All visibility" || story.publishMode === publishFilter;
        const featureState =
          story.status === "Featured"
            ? "Featured"
            : story.status === "Published" || story.status === "Approved"
              ? "Feature ready"
              : story.status === "Flagged"
                ? "Blocked"
                : "Pending";
        const matchFeature =
          featureFilter === "All feature states" || featureState === featureFilter;
        return matchQuery && matchStatus && matchSource && matchPublish && matchFeature;
      })
      .sort((a, b) => {
        const pr = priorityRank(a.status) - priorityRank(b.status);
        if (pr !== 0) return pr;
        return new Date(b.submittedISO).getTime() - new Date(a.submittedISO).getTime();
      });
  }, [stories, query, statusFilter, sourceFilter, publishFilter, featureFilter]);

  const needsReview = stories.filter((story) => story.status === "Needs review");
  const verification = stories.filter((story) => story.status === "In verification");
  const approved = stories.filter((story) => story.status === "Approved");
  const published = stories.filter(
    (story) => story.status === "Published" || story.status === "Featured",
  );
  const featured = stories.filter((story) => story.status === "Featured");
  const consentGaps = stories.filter(
    (story) => !story.consentSigned || (story.mediaType !== "Text only" && !story.mediaRelease),
  );
  const flagged = stories.filter((story) => story.status === "Flagged");
  const featureReady = stories.filter(
    (story) =>
      (story.status === "Approved" || story.status === "Published") &&
      story.consentSigned &&
      story.verified,
  );

  function approveStory() {
    if (!selectedStory) return;
    setStories((prev) =>
      prev.map((story) =>
        story.id === selectedStory.id
          ? {
              ...story,
              status:
                story.status === "Featured" || story.status === "Published"
                  ? story.status
                  : "Approved",
              verified: true,
            }
          : story,
      ),
    );
  }

  function featureStory() {
    if (!selectedStory) return;
    setStories((prev) =>
      prev.map((story) =>
        story.id === selectedStory.id
          ? {
              ...story,
              status: "Featured",
              verified: true,
              consentSigned: true,
              publishedISO: story.publishedISO || new Date().toISOString(),
              featuredSlot: story.featuredSlot || "Institution spotlight",
            }
          : story,
      ),
    );
  }

  function publishStory() {
    if (!selectedStory) return;
    setStories((prev) =>
      prev.map((story) =>
        story.id === selectedStory.id
          ? {
              ...story,
              status: story.status === "Featured" ? "Featured" : "Published",
              publishedISO: story.publishedISO || new Date().toISOString(),
            }
          : story,
      ),
    );
  }

  async function copyPublicLink() {
    if (!selectedStory) return;
    await copyText(`https://faithhub.evzone.app/testimonies/${selectedStory.id}`);
  }

  const selectedFeaturePlacements = selectedStory?.placements || [];
  const consentReady =
    !!selectedStory?.consentSigned &&
    (selectedStory.mediaType === "Text only" || !!selectedStory.mediaRelease);

  return (
    <div className="min-h-screen w-full bg-[#f2f2f2] dark:bg-slate-950 p-5 text-slate-900 dark:text-slate-50 transition-colors">
      <div className="mx-auto max-w-[1600px] space-y-5">
        <section className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <ProviderPageTitle
                icon={<MessageSquare className="h-6 w-6" />}
                title="Testimonies"
                subtitle="Premium collection, review, approval, publication, and featuring workspace for testimonies across live sessions, community groups, events, counseling follow-up, prayer journeys, and institution-wide storytelling surfaces."
              />
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Pill text="Consent-led publishing" tone="good" />
                <Pill text="Review + feature board" tone="navy" />
                <Pill text="Cross-surface storytelling" tone="warn" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 xl:justify-end">
              <ActionButton left={<Eye className="h-4 w-4" />} onClick={() => setPreviewOpen(true)}>
                Preview
              </ActionButton>
              <ActionButton left={<CheckCircle2 className="h-4 w-4" />} onClick={approveStory}>
                Approve Story
              </ActionButton>
              <ActionButton left={<Star className="h-4 w-4" />} onClick={featureStory}>
                Feature Testimony
              </ActionButton>
              <ActionButton
                tone="primary"
                left={<Plus className="h-4 w-4" />}
                onClick={() => safeNav(ROUTES.testimoniesBuilder)}
              >
                + New Testimony
              </ActionButton>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 shadow-sm transition-colors">
          <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0 flex flex-wrap items-center gap-2 text-[13px] text-slate-600 dark:text-slate-400">
              <Pill text="STORY OPS ALERTS" tone="warn" icon={<AlertTriangle className="h-3 w-3" />} />
              <span>{fmtInt(needsReview.length)} stories still need first review</span>
              <span>•</span>
              <span>{fmtInt(consentGaps.length)} stories have consent or release gaps</span>
              <span>•</span>
              <span>{fmtInt(featureReady.length)} approved stories are ready for featuring</span>
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
              Premium testimony ops
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <StatCard
            label="Needs review"
            value={fmtInt(needsReview.length)}
            hint="Fresh testimony submissions awaiting first editorial or pastoral review."
            accent="orange"
          />
          <StatCard
            label="In verification"
            value={fmtInt(verification.length)}
            hint="Stories with consent, safeguarding, or factual checks still in flight."
            accent="navy"
          />
          <StatCard
            label="Approved"
            value={fmtInt(approved.length)}
            hint="Ready for publication, noticeboard placement, or follow-up campaign use."
            accent="green"
          />
          <StatCard
            label="Published"
            value={fmtInt(published.length)}
            hint="Live on public or community-only testimony surfaces right now."
            accent="green"
          />
          <StatCard
            label="Featured"
            value={fmtInt(featured.length)}
            hint="Stories currently driving institution spotlight, noticeboard, or replay journeys."
            accent="orange"
          />
          <StatCard
            label="Flagged / consent gaps"
            value={fmtInt(flagged.length + consentGaps.length)}
            hint="Stories requiring moderation, fresh consent, or tighter publication controls."
            accent="navy"
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.28fr_0.9fr_0.72fr]">
          <div className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-colors">
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[16px] font-black tracking-[-0.02em] text-slate-900 dark:text-slate-100">
                    Testimony review inbox
                  </div>
                  <div className="mt-1 text-[13px] leading-6 text-slate-600 dark:text-slate-400">
                    Unified intake from prayer follow-up, group leaders, live sessions, events, counseling pathways, and standalone story forms.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Pill text={`${fmtInt(filteredStories.length)} visible`} tone="neutral" />
                  <Pill text={`${fmtInt(stories.length)} total`} tone="navy" />
                </div>
              </div>

              <div className="grid gap-3 xl:grid-cols-[1.25fr_0.85fr_0.85fr_0.85fr]">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 transition-colors">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Search className="h-4 w-4" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search storyteller, story, tags, or category"
                      className="w-full bg-transparent text-[12px] font-semibold outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-[12px] font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <option>All statuses</option>
                  <option>Needs review</option>
                  <option>In verification</option>
                  <option>Approved</option>
                  <option>Published</option>
                  <option>Featured</option>
                  <option>Flagged</option>
                </select>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-[12px] font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <option>All sources</option>
                  <option>Prayer follow-up</option>
                  <option>Community Group</option>
                  <option>Live Session</option>
                  <option>Event</option>
                  <option>Standalone Form</option>
                  <option>Counseling follow-up</option>
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={publishFilter}
                    onChange={(e) => setPublishFilter(e.target.value)}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-[12px] font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <option>All visibility</option>
                    <option>Private draft</option>
                    <option>Community only</option>
                    <option>Public</option>
                    <option>Anonymous publish</option>
                  </select>
                  <select
                    value={featureFilter}
                    onChange={(e) => setFeatureFilter(e.target.value)}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-[12px] font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <option>All feature states</option>
                    <option>Pending</option>
                    <option>Feature ready</option>
                    <option>Featured</option>
                    <option>Blocked</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Pill text="Consent signed" tone="good" />
                <Pill text="Anonymous publish" tone="navy" />
                <Pill text="Feature ready" tone="warn" />
                <Pill text="Flagged / blocked" tone="danger" />
              </div>

              <div className="space-y-3">
                {filteredStories.map((story) => {
                  const active = selectedStory?.id === story.id;
                  const featureState =
                    story.status === "Featured"
                      ? "Featured"
                      : story.status === "Published" || story.status === "Approved"
                        ? "Feature ready"
                        : story.status === "Flagged"
                          ? "Blocked"
                          : "Pending";
                  return (
                    <button
                      key={story.id}
                      type="button"
                      onClick={() => setSelectedId(story.id)}
                      className={cx(
                        "w-full rounded-[24px] border p-4 text-left transition-colors",
                        active
                          ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-900/20"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex items-start gap-3">
                          <div
                            className="grid h-14 w-14 shrink-0 place-items-center rounded-[18px] text-white text-[11px] font-black leading-none"
                            style={{
                              background:
                                story.status === "Flagged"
                                  ? EV_ORANGE
                                  : story.status === "Featured"
                                    ? EV_NAVY
                                    : EV_GREEN,
                            }}
                          >
                            {story.displayName === "Anonymous" ? (
                              <span>Anon</span>
                            ) : (
                              <span>
                                {story.displayName
                                  .split(" ")
                                  .slice(0, 2)
                                  .map((p) => p.slice(0, 3))
                                  .join(" ")}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="truncate text-[16px] font-black tracking-[-0.02em] text-slate-900 dark:text-slate-100">
                                {story.title}
                              </div>
                              <Pill text={story.status} tone={statusTone(story.status)} />
                              <Pill text={story.publishMode} tone={publishTone(story.publishMode)} />
                              <Pill text={featureState} tone={featureState === "Blocked" ? "danger" : featureState === "Featured" ? "good" : featureState === "Feature ready" ? "warn" : "navy"} />
                            </div>
                            <div className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
                              {story.displayName} • {story.category} • {story.mediaType}
                            </div>
                            <div className="mt-2 max-w-[820px] text-[13px] leading-6 text-slate-700 dark:text-slate-300">
                              {story.summary}
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <Pill text={story.source} tone="neutral" />
                              {story.consentSigned ? (
                                <Pill text="Consent signed" tone="good" />
                              ) : (
                                <Pill text="Consent missing" tone="danger" />
                              )}
                              {story.verified ? (
                                <Pill text="Verified" tone="good" />
                              ) : (
                                <Pill text="Needs verification" tone="warn" />
                              )}
                              {story.childSafe ? (
                                <Pill text="Child-safe" tone="navy" />
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            Submitted
                          </div>
                          <div className="mt-1 text-[12px] font-bold text-slate-900 dark:text-slate-100">
                            {fmtLocal(story.submittedISO)}
                          </div>
                          <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
                            Reads • {fmtInt(story.impact.reads)}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[16px] font-black tracking-[-0.02em] text-slate-900 dark:text-slate-100">
                    Selected story workspace
                  </div>
                  <div className="mt-1 text-[13px] leading-6 text-slate-600 dark:text-slate-400">
                    Review narrative quality, confirm consent, link destinations, and move the story into publish or feature lanes.
                  </div>
                </div>
                {selectedStory ? <Pill text={selectedStory.status} tone={statusTone(selectedStory.status)} /> : null}
              </div>

              {selectedStory ? (
                <div className="mt-4 space-y-4">
                  <div className="overflow-hidden rounded-[24px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={selectedStory.heroUrl}
                        alt={selectedStory.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                      <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
                        <Pill text={selectedStory.source} tone="brand" icon={<MessageSquare className="h-3 w-3" />} />
                        <Pill text={selectedStory.mediaType} tone="navy" />
                        {selectedStory.featuredSlot ? (
                          <Pill text={selectedStory.featuredSlot} tone="good" icon={<Star className="h-3 w-3" />} />
                        ) : null}
                      </div>
                      <div className="absolute left-3 right-3 bottom-3 text-white">
                        <div className="text-[10px] font-black uppercase tracking-[0.16em] opacity-80">
                          {selectedStory.displayName}
                        </div>
                        <div className="mt-1 text-[24px] font-black leading-tight">
                          {selectedStory.title}
                        </div>
                        <div className="mt-2 max-w-[92%] text-[12px] leading-5 text-white/90">
                          {selectedStory.summary}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition-colors">
                      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                        Story frame
                      </div>
                      <div className="mt-1 text-[14px] font-bold text-slate-900 dark:text-slate-100">
                        {selectedStory.category}
                      </div>
                      <div className="mt-2 text-[12px] leading-6 text-slate-700 dark:text-slate-300">
                        {selectedStory.storyText}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition-colors">
                      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                        Trust + consent
                      </div>
                      <div className="mt-2 grid gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[12px] text-slate-700 dark:text-slate-300">Consent trail</span>
                          <Pill text={selectedStory.consentSigned ? "Complete" : "Missing"} tone={selectedStory.consentSigned ? "good" : "danger"} />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[12px] text-slate-700 dark:text-slate-300">Media release</span>
                          <Pill text={selectedStory.mediaType === "Text only" ? "Not required" : selectedStory.mediaRelease ? "Ready" : "Missing"} tone={selectedStory.mediaType === "Text only" ? "navy" : selectedStory.mediaRelease ? "good" : "warn"} />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[12px] text-slate-700 dark:text-slate-300">Verification</span>
                          <Pill text={selectedStory.verified ? "Confirmed" : "Pending"} tone={selectedStory.verified ? "good" : "warn"} />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[12px] text-slate-700 dark:text-slate-300">Publish mode</span>
                          <Pill text={selectedStory.publishMode} tone={publishTone(selectedStory.publishMode)} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 transition-colors">
                      <div className="text-[12px] font-bold text-slate-900 dark:text-slate-100">
                        Linked destinations
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedStory.linkedLive ? <Pill text={`Live • ${selectedStory.linkedLive}`} tone="navy" icon={<PlayCircle className="h-3 w-3" />} /> : null}
                        {selectedStory.linkedReplay ? <Pill text={`Replay • ${selectedStory.linkedReplay}`} tone="good" icon={<Link2 className="h-3 w-3" />} /> : null}
                        {selectedStory.linkedGroup ? <Pill text={`Group • ${selectedStory.linkedGroup}`} tone="warn" icon={<LayoutGrid className="h-3 w-3" />} /> : null}
                        {selectedStory.linkedEvent ? <Pill text={`Event • ${selectedStory.linkedEvent}`} tone="warn" icon={<CalendarClock className="h-3 w-3" />} /> : null}
                      </div>
                      <div className="mt-3 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                        Tags • {selectedStory.tags.join(" • ")}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 transition-colors">
                      <div className="text-[12px] font-bold text-slate-900 dark:text-slate-100">
                        Quick actions
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <ActionButton left={<Copy className="h-4 w-4" />} onClick={copyPublicLink}>
                          Copy link
                        </ActionButton>
                        <ActionButton left={<Megaphone className="h-4 w-4" />} onClick={publishStory}>
                          Publish story
                        </ActionButton>
                        <ActionButton left={<Star className="h-4 w-4" />} onClick={featureStory}>
                          Push to feature lane
                        </ActionButton>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[12px] font-bold text-slate-900 dark:text-slate-100">
                          Approval lane
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                          Shared workflow for story intake, verification, pastoral sign-off, and publication.
                        </div>
                      </div>
                      <Pill text={consentReady ? "Consent ready" : "Consent gap"} tone={consentReady ? "good" : "danger"} />
                    </div>
                    <div className="mt-3 grid gap-2">
                      {selectedApprovalSteps(selectedStory).map((step) => (
                        <div
                          key={step.id}
                          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                              {step.label}
                            </div>
                            <Pill text={step.state} tone={approvalTone(step.state)} />
                          </div>
                          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                            {step.when}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[16px] font-black tracking-[-0.02em] text-slate-900 dark:text-slate-100">
                    Featuring + trust board
                  </div>
                  <div className="mt-1 text-[13px] leading-6 text-slate-600 dark:text-slate-400">
                    Decide where the story should surface next and which safeguards still gate public visibility.
                  </div>
                </div>
                <Pill text={selectedStory?.status || "—"} tone={selectedStory ? statusTone(selectedStory.status) : "neutral"} />
              </div>

              {selectedStory ? (
                <div className="mt-4 space-y-3">
                  {selectedFeaturePlacements.map((hook) => (
                    <FeaturePlacementCard key={hook.id} hook={hook} />
                  ))}

                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition-colors">
                    <div className="text-[12px] font-bold text-slate-900 dark:text-slate-100">
                      Safeguard signals
                    </div>
                    <div className="mt-3 space-y-2">
                      {selectedStory.safeguards.map((signal) => (
                        <div
                          key={signal.id}
                          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                                {signal.label}
                              </div>
                              <div className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                                {signal.hint}
                              </div>
                            </div>
                            <Pill text={signal.tone === "good" ? "Healthy" : signal.tone === "warn" ? "Watch" : "Action"} tone={signal.tone === "danger" ? "danger" : signal.tone === "warn" ? "warn" : "good"} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition-colors">
                      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                        Read momentum
                      </div>
                      <div className="mt-2 text-[18px] font-black text-slate-900 dark:text-slate-100">
                        {fmtInt(selectedStory.impact.reads)}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        Total story reads across visible surfaces.
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition-colors">
                      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                        Share health
                      </div>
                      <div className="mt-2 text-[18px] font-black text-slate-900 dark:text-slate-100">
                        {fmtInt(selectedStory.impact.shares)}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        Signals whether the story is strong enough for featuring.
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[16px] font-black tracking-[-0.02em] text-slate-900 dark:text-slate-100">
                  Story collections + next destinations
                </div>
                <div className="mt-1 text-[13px] leading-6 text-slate-600 dark:text-slate-400">
                  Group testimonies into narrative themes and route them into noticeboard, live follow-up, replay journeys, or promotional next steps.
                </div>
              </div>
              <Pill text="Premium story operations" tone="navy" icon={<Sparkles className="h-3 w-3" />} />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {[
                {
                  id: "collection-1",
                  title: "Provision & jobs",
                  hint: "Strong fit for prayer follow-up and noticeboard encouragement.",
                  action: "Send to Noticeboard",
                  icon: <Megaphone className="h-4 w-4" />,
                },
                {
                  id: "collection-2",
                  title: "Healing & restoration",
                  hint: "Review carefully with safeguarding and moderation before public feature placement.",
                  action: "Open Reviews & Moderation",
                  icon: <ShieldCheck className="h-4 w-4" />,
                },
                {
                  id: "collection-3",
                  title: "Replay-driven stories",
                  hint: "Convert the strongest public stories into replay or clip support moments.",
                  action: "Open Replays & Clips",
                  icon: <Link2 className="h-4 w-4" />,
                },
              ].map((card) => (
                <div
                  key={card.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition-colors"
                >
                  <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                    {card.icon}
                    <div className="text-[13px] font-bold">{card.title}</div>
                  </div>
                  <div className="mt-2 text-[12px] leading-6 text-slate-600 dark:text-slate-400">
                    {card.hint}
                  </div>
                  <div className="mt-3">
                    <ActionButton
                      left={<ExternalLink className="h-4 w-4" />}
                      onClick={() => {
                        if (card.title.includes("Noticeboard")) safeNav(ROUTES.noticeboard);
                        else if (card.title.includes("Replay")) safeNav(ROUTES.replaysClips);
                        else safeNav(ROUTES.providerDashboard);
                      }}
                    >
                      {card.action}
                    </ActionButton>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[16px] font-black tracking-[-0.02em] text-slate-900 dark:text-slate-100">
                  Testimony destination preview
                </div>
                <div className="mt-1 text-[13px] leading-6 text-slate-600 dark:text-slate-400">
                  Persistent preview of the selected testimony card, destination landing page, and featured-story presentation.
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop")}
                  className={cx(
                    "rounded-2xl border px-3 py-2 text-[11px] font-semibold transition-colors",
                    previewMode === "desktop"
                      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-slate-900 dark:text-slate-100"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300",
                  )}
                >
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile")}
                  className={cx(
                    "rounded-2xl border px-3 py-2 text-[11px] font-semibold transition-colors",
                    previewMode === "mobile"
                      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-slate-900 dark:text-slate-100"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300",
                  )}
                >
                  Mobile
                </button>
              </div>
            </div>

            {selectedStory ? (
              <div className="mt-4 space-y-4">
                <TestimonyPreview story={selectedStory} previewMode={previewMode} />

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition-colors">
                  <div className="text-[12px] font-bold text-slate-900 dark:text-slate-100">
                    Preview actions
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ActionButton left={<Eye className="h-4 w-4" />} onClick={() => setPreviewOpen(true)}>
                      Open large preview
                    </ActionButton>
                    <ActionButton left={<Copy className="h-4 w-4" />} onClick={copyPublicLink}>
                      Copy testimony link
                    </ActionButton>
                    <ActionButton left={<ExternalLink className="h-4 w-4" />} onClick={() => safeNav(ROUTES.noticeboard)}>
                      Send to Noticeboard
                    </ActionButton>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Preview
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      {selectedStory ? (
        <Drawer
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          title="Testimonies preview"
          subtitle="Large preview of the selected testimony destination"
        >
          <TestimonyPreviewInner story={selectedStory} previewMode={previewMode} />
        </Drawer>
      ) : null}
    </div>
  );
}






