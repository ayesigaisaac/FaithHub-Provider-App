// @ts-nocheck
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Copy,
  Eye,
  ExternalLink,
  Globe2,
  HeartHandshake,
  LayoutGrid,
  Lock,
  MessageSquare,
  Plus,
  Search,
  Share2,
  Sparkles,
  Users,
  Wand2,
  X,
} from "lucide-react";

/**
 * FaithHub — FH-P-103 Prayer Journal
 * ----------------------------------
 * Premium Provider-side page for guided prompts, journaling flows,
 * shared reflections, and private/public journal controls.
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_NAVY = "#172554";

const ROUTES = {
  providerDashboard: "/faithhub/provider/dashboard",
  prayerRequests: "/faithhub/provider/prayer-requests",
  communityGroups: "/faithhub/provider/community-groups",
  testimonies: "/faithhub/provider/testimonies",
  noticeboard: "/faithhub/provider/noticeboard",
  journalBuilder: "/faithhub/provider/prayer-journal/new",
};

const HERO_1 =
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1600&q=80";
const HERO_2 =
  "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1600&q=80";
const HERO_3 =
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80";
const HERO_4 =
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1600&q=80";
const HERO_5 =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80";

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  if (typeof window === "undefined") return;
  window.location.assign(url);
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
    // preview shell no-op
  }
}

type JournalStatus = "Active" | "Draft" | "Paused" | "Needs review";
type JournalVisibility = "Private" | "Community" | "Public guided";
type JournalCadence = "Daily" | "3-day rhythm" | "Weekly" | "Seasonal";
type PromptType = "Scripture" | "Guided" | "Reflection" | "Prayer list";
type ReflectionStatus = "Private" | "Shared" | "Featured" | "Needs review";
type PreviewMode = "desktop" | "mobile";

type SafeguardSignal = {
  id: string;
  label: string;
  hint: string;
  tone: "good" | "warn" | "danger";
};

type HookItem = {
  id: string;
  label: string;
  hint: string;
  state: "Ready" | "Pending" | "Draft" | "Linked";
};

type PromptBlock = {
  id: string;
  title: string;
  prompt: string;
  type: PromptType;
  scheduledISO: string;
  state: "Ready" | "Scheduled" | "Draft" | "Published";
};

type PrayerJournalRecord = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  status: JournalStatus;
  visibility: JournalVisibility;
  cadence: JournalCadence;
  heroUrl: string;
  language: string[];
  owner: string;
  participants: number;
  sharedReflections: number;
  pendingReview: number;
  streakLeaders: number;
  nextPromptISO: string;
  allowAnonymousShare: boolean;
  pastoralReview: boolean;
  commentsEnabled: boolean;
  childSafe: boolean;
  linkedPrayerFlow?: string;
  linkedNoticeboard?: string;
  linkedGroup?: string;
  linkedLive?: string;
  prompts: PromptBlock[];
  safeguards: SafeguardSignal[];
  hooks: HookItem[];
};

type ReflectionRecord = {
  id: string;
  journalId: string;
  author: string;
  excerpt: string;
  submittedISO: string;
  status: ReflectionStatus;
  anonymous: boolean;
  tags: string[];
};

const TEMPLATE_PROMPTS = [
  {
    id: "tpl-morning",
    title: "Morning surrender",
    subtitle: "Open the day with scripture, gratitude, and one focused prayer line.",
    type: "Scripture" as const,
    accent: "green" as const,
    prompt:
      "Read the selected scripture slowly. Name one thing you are surrendering today, one thing you are grateful for, and one person you want to pray for before the day begins.",
  },
  {
    id: "tpl-examen",
    title: "Evening examen",
    subtitle: "Review the day with honesty, thanksgiving, repentance, and renewed trust.",
    type: "Reflection" as const,
    accent: "orange" as const,
    prompt:
      "Where did you notice God today? Where did you resist grace or lose peace? Write one thanksgiving, one confession, and one prayer for tomorrow.",
  },
  {
    id: "tpl-intercession",
    title: "Community intercession",
    subtitle: "Guide people into praying for church, city, leaders, and urgent needs.",
    type: "Prayer list" as const,
    accent: "navy" as const,
    prompt:
      "Pray through today’s community list. Write the names or groups on your heart, then finish with one practical action you can take in love this week.",
  },
  {
    id: "tpl-family",
    title: "Family prayer flow",
    subtitle: "Short guided prompts for family devotion time, gratitude, and scripture confession.",
    type: "Guided" as const,
    accent: "green" as const,
    prompt:
      "Read the family verse together, let each person share one gratitude sentence, then write a short family prayer for peace, wisdom, and protection.",
  },
];

const journalsSeed: PrayerJournalRecord[] = [
  {
    id: "PJ-103",
    title: "30 Days of Surrender",
    subtitle: "A daily guided formation journey for church-wide prayer and reflection.",
    summary:
      "Daily scripture-led prompts that help the institution guide members through surrender, gratitude, confession, intercession, and next steps.",
    status: "Active",
    visibility: "Public guided",
    cadence: "Daily",
    heroUrl: HERO_1,
    language: ["English", "Luganda"],
    owner: "Prayer Formation Team",
    participants: 842,
    sharedReflections: 118,
    pendingReview: 7,
    streakLeaders: 264,
    nextPromptISO: new Date(Date.now() + 2.2 * 60 * 60 * 1000).toISOString(),
    allowAnonymousShare: true,
    pastoralReview: true,
    commentsEnabled: false,
    childSafe: false,
    linkedPrayerFlow: "Evening Prayer Follow-up",
    linkedNoticeboard: "Prayer Wall Highlights",
    linkedGroup: "Young Adults Prayer Circle",
    linkedLive: "Night of Hope Replay Journey",
    prompts: [
      {
        id: "pp-1",
        title: "Day 12 · Surrender the hidden worries",
        prompt:
          "Read Matthew 6 slowly. Write one hidden burden you have been carrying in silence, one truth from the passage that confronts it, and one prayer of release.",
        type: "Scripture",
        scheduledISO: new Date(Date.now() + 2.2 * 60 * 60 * 1000).toISOString(),
        state: "Scheduled",
      },
      {
        id: "pp-2",
        title: "Day 13 · Gratitude in the ordinary",
        prompt:
          "List three ordinary places where you experienced God’s kindness this week. Finish by writing a prayer that names His faithfulness out loud.",
        type: "Reflection",
        scheduledISO: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
        state: "Ready",
      },
      {
        id: "pp-3",
        title: "Day 14 · Pray for your city",
        prompt:
          "Pray for leaders, families, schools, and broken places in the city. Write one sentence for each area and one practical act of compassion you can take.",
        type: "Prayer list",
        scheduledISO: new Date(Date.now() + 50 * 60 * 60 * 1000).toISOString(),
        state: "Draft",
      },
    ],
    safeguards: [
      { id: "sg1", label: "Pastoral review enabled", hint: "Shared reflections route through the care team before surfacing publicly.", tone: "good" },
      { id: "sg2", label: "Anonymous sharing allowed", hint: "People can share reflections without exposing identity on public surfaces.", tone: "good" },
      { id: "sg3", label: "7 reflections need review", hint: "New public reflection submissions are waiting in the moderation lane.", tone: "warn" },
    ],
    hooks: [
      { id: "hk1", label: "Prayer Requests", hint: "Route selected reflections into care follow-up when needed.", state: "Ready" },
      { id: "hk2", label: "Noticeboard", hint: "Surface approved excerpts as a prayer-wall highlight.", state: "Linked" },
      { id: "hk3", label: "Testimonies", hint: "Upgrade answered-prayer reflections into testimony review.", state: "Pending" },
    ],
  },
  {
    id: "PJ-104",
    title: "Leaders’ War Room Journal",
    subtitle: "Private intercession flow for pastors, ministry heads, and care leads.",
    summary:
      "A protected prayer journal for leadership rhythms, confidential burdens, pastoral strategy reflections, and intercession notes.",
    status: "Active",
    visibility: "Private",
    cadence: "Weekly",
    heroUrl: HERO_2,
    language: ["English"],
    owner: "Senior Pastor Office",
    participants: 18,
    sharedReflections: 0,
    pendingReview: 0,
    streakLeaders: 11,
    nextPromptISO: new Date(Date.now() + 19 * 60 * 60 * 1000).toISOString(),
    allowAnonymousShare: false,
    pastoralReview: false,
    commentsEnabled: false,
    childSafe: false,
    linkedPrayerFlow: "Leadership Care Flow",
    linkedGroup: "Leadership Circle",
    prompts: [
      {
        id: "pp-4",
        title: "Weekly leadership burden scan",
        prompt:
          "Write the burdens you are carrying for the church this week, then move through them one by one in intercession before naming one action of obedience.",
        type: "Guided",
        scheduledISO: new Date(Date.now() + 19 * 60 * 60 * 1000).toISOString(),
        state: "Ready",
      },
      {
        id: "pp-5",
        title: "Pray over team alignment",
        prompt:
          "Ask the Spirit for wisdom, unity, courage, and restraint across leaders. Note any conversations or reconciliations that should happen this week.",
        type: "Prayer list",
        scheduledISO: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        state: "Draft",
      },
    ],
    safeguards: [
      { id: "sg4", label: "Strictly private journal", hint: "No public reflection route is active for this journal.", tone: "good" },
      { id: "sg5", label: "Leadership-only access", hint: "Only assigned leadership roles can view or respond.", tone: "good" },
    ],
    hooks: [
      { id: "hk4", label: "Community Groups", hint: "Feed urgent needs into leader coverage and group care.", state: "Linked" },
      { id: "hk5", label: "Noticeboard", hint: "Not active because this journal remains private.", state: "Draft" },
    ],
  },
  {
    id: "PJ-105",
    title: "Family Evening Prayer Flow",
    subtitle: "A community journal for guided family devotion, gratitude, and bedtime prayer.",
    summary:
      "Short evening prompts that help families pray together, share gratitude, and end the day with scripture-centered peace.",
    status: "Draft",
    visibility: "Community",
    cadence: "3-day rhythm",
    heroUrl: HERO_3,
    language: ["English", "Swahili"],
    owner: "Family Ministry Desk",
    participants: 126,
    sharedReflections: 12,
    pendingReview: 3,
    streakLeaders: 41,
    nextPromptISO: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(),
    allowAnonymousShare: true,
    pastoralReview: true,
    commentsEnabled: true,
    childSafe: true,
    linkedPrayerFlow: "Family Care Follow-up",
    linkedNoticeboard: "Family Prayer Highlights",
    linkedGroup: "Parents Prayer Community",
    prompts: [
      {
        id: "pp-6",
        title: "Peace before sleep",
        prompt:
          "Invite each family member to name one gratitude and one worry from the day. Read Psalm 4 and write a simple family prayer for peace and protection.",
        type: "Guided",
        scheduledISO: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(),
        state: "Draft",
      },
    ],
    safeguards: [
      { id: "sg6", label: "Child-safe defaults on", hint: "Stricter sharing rules and moderated reflection visibility are active.", tone: "good" },
      { id: "sg7", label: "Community comments open", hint: "Monitor the reflection lane closely before launch.", tone: "warn" },
    ],
    hooks: [
      { id: "hk6", label: "Prayer Requests", hint: "Families can escalate sensitive needs into the care lane.", state: "Ready" },
      { id: "hk7", label: "Noticeboard", hint: "Approved bedtime reflections can surface weekly.", state: "Pending" },
    ],
  },
  {
    id: "PJ-106",
    title: "Healing & Gratitude Week",
    subtitle: "Seven guided prompts for healing prayer, gratitude, and shared reflection.",
    summary:
      "A short public journal campaign designed to support healing prayers, gratitude, and testimony-ready reflections over one week.",
    status: "Needs review",
    visibility: "Public guided",
    cadence: "Seasonal",
    heroUrl: HERO_4,
    language: ["English", "French"],
    owner: "Prayer & Care Team",
    participants: 304,
    sharedReflections: 26,
    pendingReview: 14,
    streakLeaders: 88,
    nextPromptISO: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    allowAnonymousShare: true,
    pastoralReview: true,
    commentsEnabled: false,
    childSafe: false,
    linkedPrayerFlow: "Healing Care Follow-up",
    linkedLive: "Healing Night Replay",
    prompts: [
      {
        id: "pp-7",
        title: "Healing prayer declaration",
        prompt:
          "Read Psalm 103 and write the places where you need healing in body, heart, or memory. Finish with a declaration of trust in God’s mercy and kindness.",
        type: "Scripture",
        scheduledISO: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        state: "Ready",
      },
      {
        id: "pp-8",
        title: "Answered prayer reflection",
        prompt:
          "Write one area where God has already begun to restore you, one prayer still unanswered, and one sentence of gratitude you can share with others.",
        type: "Reflection",
        scheduledISO: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
        state: "Scheduled",
      },
    ],
    safeguards: [
      { id: "sg8", label: "14 reflections awaiting review", hint: "Large response volume requires moderation before public surfacing.", tone: "warn" },
      { id: "sg9", label: "Public guidance enabled", hint: "Prompt flow can be discovered outside the institution library.", tone: "good" },
      { id: "sg10", label: "Care escalation active", hint: "Sensitive healing disclosures should route into Prayer Requests or Counseling.", tone: "warn" },
    ],
    hooks: [
      { id: "hk8", label: "Prayer Requests", hint: "Escalate vulnerable disclosures into prayer follow-up and care assignment.", state: "Linked" },
      { id: "hk9", label: "Testimonies", hint: "Feature answered-prayer reflections after review and consent checks.", state: "Ready" },
      { id: "hk10", label: "Noticeboard", hint: "Public highlight board is waiting on moderation clearance.", state: "Pending" },
    ],
  },
];

const reflectionsSeed: ReflectionRecord[] = [
  { id: "RF-201", journalId: "PJ-103", author: "Mercy K.", excerpt: "Today’s surrender prompt helped me write the fear I had been hiding. I felt peace after naming it in prayer.", submittedISO: new Date(Date.now() - 1.2 * 60 * 60 * 1000).toISOString(), status: "Needs review", anonymous: false, tags: ["Surrender", "Peace"] },
  { id: "RF-202", journalId: "PJ-103", author: "Anonymous", excerpt: "I never thought I could share a reflection publicly, but the anonymous option helped me tell the truth and still feel safe.", submittedISO: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(), status: "Shared", anonymous: true, tags: ["Anonymous", "Grace"] },
  { id: "RF-203", journalId: "PJ-105", author: "Parents Prayer Circle", excerpt: "Our children now wait for the bedtime gratitude prompt. It has changed the tone of the house.", submittedISO: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), status: "Featured", anonymous: false, tags: ["Family", "Gratitude"] },
  { id: "RF-204", journalId: "PJ-106", author: "Anonymous", excerpt: "I’m not ready to share all the details, but today’s healing reflection helped me admit I still need care.", submittedISO: new Date(Date.now() - 36 * 60 * 1000).toISOString(), status: "Needs review", anonymous: true, tags: ["Healing", "Care"] },
  { id: "RF-205", journalId: "PJ-104", author: "Leadership Team", excerpt: "We wrote a united prayer for wisdom around staffing, protection, and courage this week.", submittedISO: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), status: "Private", anonymous: false, tags: ["Leadership", "Wisdom"] },
];

function Pill({ tone = "neutral", children }: { tone?: "neutral" | "good" | "warn" | "danger" | "brand"; children: React.ReactNode }) {
  const cls = tone === "good" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : tone === "warn" ? "border-amber-200 bg-amber-50 text-amber-800" : tone === "danger" ? "border-rose-200 bg-rose-50 text-rose-700" : tone === "brand" ? "border-transparent text-white" : "border-slate-200 bg-white text-slate-700";
  return <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap", cls)} style={tone === "brand" ? { background: EV_ORANGE } : undefined}>{children}</span>;
}

function ActionButton({ tone = "neutral", children, onClick, left, title }: { tone?: "neutral" | "primary" | "ghost"; children: React.ReactNode; onClick?: () => void; left?: React.ReactNode; title?: string }) {
  const cls = tone === "primary" ? "text-white border-transparent" : tone === "ghost" ? "bg-transparent border-transparent text-slate-700 hover:bg-slate-100" : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50";
  return <button type="button" title={title} onClick={onClick} className={cx("inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-[12px] font-semibold transition-colors", cls)} style={tone === "primary" ? { background: EV_GREEN } : undefined}>{left}{children}</button>;
}

function MetricCard({ label, value, hint, accent }: { label: string; value: string; hint: string; accent: "green" | "orange" | "navy"; }) {
  const dot = accent === "green" ? EV_GREEN : accent === "orange" ? EV_ORANGE : EV_NAVY;
  return <div className="rounded-3xl border border-slate-200 bg-white p-4 transition-colors"><div className="flex items-start justify-between gap-3"><div><div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</div><div className="mt-2 text-[24px] font-black text-slate-900">{value}</div></div><div className="h-10 w-10 rounded-full" style={{ background: dot }} /></div><div className="mt-2 text-[12px] leading-snug text-slate-500">{hint}</div></div>;
}

function SectionCard({ title, subtitle, right, children }: { title: string; subtitle?: string; right?: React.ReactNode; children: React.ReactNode; }) {
  return <div className="rounded-3xl border border-slate-200 bg-white p-4 transition-colors"><div className="flex items-start justify-between gap-3"><div><div className="text-[15px] font-bold text-slate-900">{title}</div>{subtitle ? <div className="mt-0.5 text-[12px] text-slate-500">{subtitle}</div> : null}</div>{right ? <div className="shrink-0">{right}</div> : null}</div><div className="mt-4">{children}</div></div>;
}

function Drawer({ open, title, subtitle, onClose, children }: { open: boolean; title: string; subtitle?: string; onClose: () => void; children: React.ReactNode; }) {
  useEffect(() => { if (!open) return; const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose(); window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, [open, onClose]);
  if (!open) return null;
  return <div className="fixed inset-0 z-[90] flex justify-end bg-black/35 backdrop-blur-sm" onClick={onClose}><div className="h-full w-full max-w-5xl bg-white shadow-2xl border-l border-slate-200 flex flex-col" onClick={(e) => e.stopPropagation()}><div className="flex items-start justify-between gap-3 border-b border-slate-200 px-6 py-4"><div className="min-w-0"><div className="text-[14px] font-semibold text-slate-900">{title}</div>{subtitle ? <div className="mt-0.5 text-[12px] text-slate-500">{subtitle}</div> : null}</div><button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white hover:bg-slate-50"><X className="h-4 w-4 text-slate-600" /></button></div><div className="flex-1 overflow-y-auto p-6">{children}</div></div></div>;
}

function PreviewShell({ mode, journal, reflection }: { mode: PreviewMode; journal: PrayerJournalRecord; reflection?: ReflectionRecord; }) {
  const prompt = journal.prompts[0];
  const isMobile = mode === "mobile";
  return (
    <div className={cx("overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm", isMobile ? "max-w-[360px]" : "max-w-none")}> 
      <div className={cx("bg-slate-950 p-3", isMobile ? "" : "px-5 py-4")}><div className="mx-auto h-2 w-20 rounded-full bg-white/20" /></div>
      <div className={cx("p-4", isMobile ? "" : "p-5") }>
        <div className={cx("overflow-hidden rounded-3xl relative", isMobile ? "aspect-[3/4]" : "aspect-[16/8]") }>
          <img src={journal.heroUrl} alt={journal.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
          <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-2"><Pill tone={journal.visibility === "Private" ? "neutral" : "brand"}>{journal.visibility === "Private" ? <Lock className="h-3.5 w-3.5" /> : <Globe2 className="h-3.5 w-3.5" />}{journal.visibility}</Pill><Pill tone="good"><CheckCircle2 className="h-3.5 w-3.5" />{journal.cadence}</Pill></div>
          <div className="absolute left-4 right-4 bottom-4 text-white"><div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Prayer Journal</div><div className="mt-1 text-[24px] font-black leading-tight">{journal.title}</div><div className="mt-1 max-w-[34rem] text-[12px] text-white/85 line-clamp-2">{journal.summary}</div></div>
        </div>
        <div className={cx("mt-4 grid gap-3", isMobile ? "grid-cols-1" : "grid-cols-[1.2fr_0.8fr]") }>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center justify-between gap-2"><div><div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Next prompt</div><div className="mt-1 text-[16px] font-bold text-slate-900">{prompt?.title || "Awaiting prompt"}</div></div><Pill tone="warn"><CalendarClock className="h-3.5 w-3.5" />{fmtLocal(prompt?.scheduledISO || journal.nextPromptISO)}</Pill></div><div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3 text-[13px] leading-relaxed text-slate-700">{prompt?.prompt || "Prompt copy will appear here once created."}</div><div className="mt-3 flex items-center gap-2"><ActionButton tone="primary" left={<BookOpen className="h-4 w-4" />}>Write reflection</ActionButton><ActionButton left={<Share2 className="h-4 w-4" />}>Share safely</ActionButton></div></div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4"><div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Journal flow</div><div className="mt-3 space-y-2">{journal.prompts.slice(0, 3).map((item, idx) => (<div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"><div className="flex items-center justify-between gap-2"><div className="min-w-0"><div className="truncate text-[13px] font-semibold text-slate-900">{idx + 1}. {item.title}</div><div className="truncate text-[11px] text-slate-500">{item.type} • {item.state}</div></div><BadgeCheck className="h-4 w-4 text-emerald-500" /></div></div>))}</div><div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3"><div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Recent reflection</div><div className="mt-2 text-[13px] font-semibold text-slate-900">{reflection?.author || "Anonymous"}</div><div className="mt-1 text-[12px] leading-relaxed text-slate-600 line-clamp-4">{reflection?.excerpt || "Approved reflections will surface here for journal readers."}</div></div></div>
        </div>
      </div>
    </div>
  );
}

function statusTone(status: JournalStatus): "good" | "warn" | "danger" | "neutral" {
  if (status === "Active") return "good";
  if (status === "Needs review") return "warn";
  if (status === "Paused") return "danger";
  return "neutral";
}
function visibilityTone(visibility: JournalVisibility): "good" | "warn" | "neutral" {
  if (visibility === "Public guided") return "good";
  if (visibility === "Community") return "warn";
  return "neutral";
}

export default function PrayerJournalPage() {
  const [journals, setJournals] = useState<PrayerJournalRecord[]>(journalsSeed);
  const [reflections, setReflections] = useState<ReflectionRecord[]>(reflectionsSeed);
  const [selectedId, setSelectedId] = useState(journalsSeed[0]?.id || "");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | JournalStatus>("All");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("mobile");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [composer, setComposer] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { if (!toast) return; const t = window.setTimeout(() => setToast(null), 2600); return () => window.clearTimeout(t); }, [toast]);

  const selectedJournal = useMemo(() => journals.find((item) => item.id === selectedId) || journals[0], [journals, selectedId]);
  const journalReflections = useMemo(() => { if (!selectedJournal) return []; return reflections.filter((item) => item.journalId === selectedJournal.id); }, [reflections, selectedJournal]);

  const metrics = useMemo(() => {
    const active = journals.filter((item) => item.status === "Active").length;
    const publicGuides = journals.filter((item) => item.visibility === "Public guided").length;
    const shared = reflections.filter((item) => item.status === "Shared" || item.status === "Featured").length;
    const pending = reflections.filter((item) => item.status === "Needs review").length;
    const prompts = journals.reduce((sum, item) => sum + item.prompts.length, 0);
    const careFlags = journals.reduce((sum, item) => sum + item.safeguards.filter((signal) => signal.tone === "warn" || signal.tone === "danger").length, 0);
    return { active, publicGuides, shared, pending, prompts, careFlags };
  }, [journals, reflections]);

  const filteredJournals = useMemo(() => journals.filter((item) => { const matchesStatus = statusFilter === "All" || item.status === statusFilter; const hay = [item.title, item.subtitle, item.summary, item.owner, item.language.join(" "), item.visibility, item.cadence].join(" ").toLowerCase(); const matchesSearch = hay.includes(search.trim().toLowerCase()); return matchesStatus && matchesSearch; }), [journals, search, statusFilter]);

  const handleCreateJournal = () => {
    const newJournal: PrayerJournalRecord = {
      id: `PJ-${Math.floor(Math.random() * 1000)}`,
      title: "New guided journal",
      subtitle: "A fresh prayer journey waiting for prompt design and privacy setup.",
      summary: "Start with a cadence, attach guided prompts, and decide how reflections should be shared or reviewed.",
      status: "Draft",
      visibility: "Community",
      cadence: "Daily",
      heroUrl: HERO_5,
      language: ["English"],
      owner: "Prayer Formation Team",
      participants: 0,
      sharedReflections: 0,
      pendingReview: 0,
      streakLeaders: 0,
      nextPromptISO: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      allowAnonymousShare: true,
      pastoralReview: true,
      commentsEnabled: false,
      childSafe: false,
      prompts: [],
      safeguards: [{ id: `sg-${Date.now()}-1`, label: "Journal still needs first prompt", hint: "Add a first guided prompt before publishing or sharing the journal.", tone: "warn" }],
      hooks: [{ id: `hk-${Date.now()}-1`, label: "Noticeboard", hint: "Not yet linked. Connect a destination when the journal is ready to surface publicly.", state: "Draft" }],
    };
    setJournals((prev) => [newJournal, ...prev]);
    setSelectedId(newJournal.id);
    setToast("New journal draft created.");
  };

  const handleAddPrompt = (forcedPrompt?: { title: string; prompt: string; type: PromptType; }) => {
    if (!selectedJournal) return;
    const nextPrompt: PromptBlock = {
      id: `pp-${Date.now()}`,
      title: forcedPrompt?.title || `Prompt ${selectedJournal.prompts.length + 1} · Guided reflection`,
      prompt: forcedPrompt?.prompt || composer.trim() || "Write what the Spirit is placing on your heart today, then end with one scripture and one concrete prayer response.",
      type: forcedPrompt?.type || "Guided",
      scheduledISO: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      state: "Draft",
    };
    setJournals((prev) => prev.map((item) => item.id === selectedJournal.id ? { ...item, prompts: [nextPrompt, ...item.prompts], nextPromptISO: nextPrompt.scheduledISO } : item));
    if (!forcedPrompt) setComposer("");
    setToast("Prompt added to the selected journal.");
  };

  const handleShareReflection = () => {
    if (!selectedJournal) return;
    const target = journalReflections.find((item) => item.status === "Needs review" || item.status === "Private");
    if (!target) { setToast("No pending reflection is ready to share right now."); return; }
    setReflections((prev) => prev.map((item) => item.id === target.id ? { ...item, status: "Shared" } : item));
    setToast("Reflection moved into the shared journal lane.");
  };

  const handleFeatureReflection = (reflectionId: string) => {
    setReflections((prev) => prev.map((item) => item.id === reflectionId ? { ...item, status: "Featured" } : item));
    setToast("Reflection featured for journal surfaces.");
  };

  const handleSetVisibility = (visibility: JournalVisibility) => {
    if (!selectedJournal) return;
    setJournals((prev) => prev.map((item) => item.id === selectedJournal.id ? { ...item, visibility } : item));
    setToast(`Journal visibility set to ${visibility}.`);
  };

  const handleSetCadence = (cadence: JournalCadence) => {
    if (!selectedJournal) return;
    setJournals((prev) => prev.map((item) => item.id === selectedJournal.id ? { ...item, cadence } : item));
    setToast(`Cadence updated to ${cadence}.`);
  };

  const selectedPreviewReflection = journalReflections.find((item) => item.status === "Featured" || item.status === "Shared") || journalReflections[0];

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-slate-900">
      <div className="mx-auto max-w-[1600px] p-5 lg:p-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Prayer formation command</div>
              <div className="mt-1 text-[32px] font-black tracking-tight text-slate-900">FH-P-103 · Prayer Journal</div>
              <div className="mt-2 max-w-[980px] text-[14px] leading-relaxed text-slate-500">Provider-managed guided journaling for daily prompts, shared reflections, care-aware privacy, and premium public or private prayer journeys.</div>
              <div className="mt-4 flex flex-wrap items-center gap-2"><Pill tone="good"><BookOpen className="h-3.5 w-3.5" /> Guided rhythms</Pill><Pill><Lock className="h-3.5 w-3.5" /> Private + public flows</Pill><Pill tone="warn"><HeartHandshake className="h-3.5 w-3.5" /> Care-aware reflection sharing</Pill></div>
            </div>
            <div className="flex w-full flex-col gap-2 xl:w-[320px]"><ActionButton tone="primary" onClick={handleCreateJournal} left={<Plus className="h-4 w-4" />}>+ New Journal</ActionButton><ActionButton onClick={() => handleAddPrompt()} left={<Plus className="h-4 w-4" />}>Add Prompt</ActionButton><ActionButton onClick={handleShareReflection} left={<Share2 className="h-4 w-4" />}>Share Reflection</ActionButton><ActionButton onClick={() => setPreviewOpen(true)} left={<Eye className="h-4 w-4" />}>Preview</ActionButton></div>
          </div>
        </div>

        <div className="mt-4 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm"><div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"><div className="flex flex-wrap items-center gap-3 text-[12px] text-slate-500"><Pill tone="warn"><Sparkles className="h-3.5 w-3.5" /> Journal formation pulse</Pill><span>{metrics.pending} reflections need review • {metrics.publicGuides} public guided journals are live • {metrics.prompts} total prompt blocks are active across the institution</span></div><div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">Premium prayer ops</div></div></div>

        <div className="mt-4 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <MetricCard label="Active journals" value={String(metrics.active)} hint="Live prayer journeys currently shaping formation rhythms." accent="green" />
          <MetricCard label="Public guides" value={String(metrics.publicGuides)} hint="Public or discoverable journal experiences available to the wider audience." accent="green" />
          <MetricCard label="Shared reflections" value={fmtInt(metrics.shared)} hint="Reflections already surfaced into community or public lanes." accent="navy" />
          <MetricCard label="Pending review" value={fmtInt(metrics.pending)} hint="Reflection submissions awaiting pastoral or moderation review." accent="orange" />
          <MetricCard label="Prompt blocks" value={fmtInt(metrics.prompts)} hint="Total guided prompts across active, draft, and public journals." accent="navy" />
          <MetricCard label="Care flags" value={fmtInt(metrics.careFlags)} hint="Safeguard or care signals calling for provider attention." accent="orange" />
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.95fr_0.85fr]">
          <SectionCard title="Prayer journal library" subtitle="Search guided journals, formation tracks, private prayer flows, and public journal experiences." right={<Pill>{fmtInt(filteredJournals.length)} journals</Pill>}>
            <div className="grid gap-3 md:grid-cols-[1.2fr_auto] xl:grid-cols-[1.2fr_auto]"><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search journals, owners, tags, or cadence" className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-[13px] text-slate-800 outline-none focus:border-emerald-300" /></div><div className="flex flex-wrap items-center gap-2">{(["All", "Active", "Draft", "Paused", "Needs review"] as const).map((item) => (<button key={item} type="button" onClick={() => setStatusFilter(item)} className={cx("rounded-full border px-3 py-2 text-[12px] font-semibold transition-colors", statusFilter === item ? "border-transparent text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50")} style={statusFilter === item ? { background: EV_GREEN } : undefined}>{item}</button>))}</div></div>
            <div className="mt-4 space-y-3">{filteredJournals.map((journal) => (<button key={journal.id} type="button" onClick={() => setSelectedId(journal.id)} className={cx("w-full rounded-[24px] border px-4 py-4 text-left transition-colors", selectedJournal?.id === journal.id ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white hover:bg-slate-50")}><div className="flex items-start gap-3"><div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-[12px] font-black text-white" style={{ background: journal.visibility === "Public guided" ? EV_GREEN : journal.visibility === "Community" ? EV_ORANGE : EV_NAVY }}>{journal.title.split(" ").slice(0, 2).map((item) => item[0]).join("")}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><div className="truncate text-[16px] font-bold text-slate-900">{journal.title}</div><Pill tone={statusTone(journal.status)}>{journal.status}</Pill><Pill tone={visibilityTone(journal.visibility)}>{journal.visibility}</Pill></div><div className="mt-1 truncate text-[12px] text-slate-500">{journal.subtitle}</div><div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500"><span>{journal.owner}</span><span>•</span><span>{journal.language.join(" + ")}</span><span>•</span><span>{journal.cadence}</span></div></div></div><div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500"><span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700">{fmtInt(journal.participants)} participants</span><span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700">{journal.prompts.length} prompts</span><span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700">Next: {fmtLocal(journal.nextPromptISO)}</span></div></button>))}</div>
          </SectionCard>

          <SectionCard title="Selected journal workspace" subtitle="Shape cadence, prompts, privacy, and the audience-facing prayer journey." right={<Pill tone="brand">{selectedJournal?.status || "Draft"}</Pill>}>
            {selectedJournal ? (<><div className="overflow-hidden rounded-[28px] border border-slate-200"><div className="relative aspect-[16/9]"><img src={selectedJournal.heroUrl} alt={selectedJournal.title} className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" /><div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-2"><Pill tone="brand">{selectedJournal.visibility}</Pill><Pill tone="good">{selectedJournal.cadence}</Pill></div><div className="absolute left-4 right-4 bottom-4 text-white"><div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Guided journal</div><div className="mt-1 text-[18px] font-black leading-tight">{selectedJournal.title}</div><div className="mt-1 line-clamp-2 text-[12px] text-white/85">{selectedJournal.summary}</div></div></div></div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2"><div className="rounded-3xl border border-slate-200 bg-slate-50 p-3"><div className="text-[12px] font-bold text-slate-900">Cadence + privacy</div><div className="mt-3 flex flex-wrap gap-2">{(["Daily", "3-day rhythm", "Weekly", "Seasonal"] as JournalCadence[]).map((cadence) => (<button key={cadence} type="button" onClick={() => handleSetCadence(cadence)} className={cx("rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors", selectedJournal.cadence === cadence ? "border-transparent text-white" : "border-slate-200 bg-white text-slate-700")} style={selectedJournal.cadence === cadence ? { background: EV_GREEN } : undefined}>{cadence}</button>))}</div><div className="mt-3 flex flex-wrap gap-2">{(["Private", "Community", "Public guided"] as JournalVisibility[]).map((visibility) => (<button key={visibility} type="button" onClick={() => handleSetVisibility(visibility)} className={cx("rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors", selectedJournal.visibility === visibility ? "border-transparent text-white" : "border-slate-200 bg-white text-slate-700")} style={selectedJournal.visibility === visibility ? { background: EV_ORANGE } : undefined}>{visibility}</button>))}</div></div><div className="rounded-3xl border border-slate-200 bg-slate-50 p-3"><div className="text-[12px] font-bold text-slate-900">Formation health</div><div className="mt-3 space-y-2 text-[12px] text-slate-600"><div className="flex items-center justify-between gap-2"><span>Participants</span><span className="font-semibold text-slate-900">{fmtInt(selectedJournal.participants)}</span></div><div className="flex items-center justify-between gap-2"><span>Streak leaders</span><span className="font-semibold text-slate-900">{fmtInt(selectedJournal.streakLeaders)}</span></div><div className="flex items-center justify-between gap-2"><span>Pending review</span><span className="font-semibold text-slate-900">{fmtInt(selectedJournal.pendingReview)}</span></div><div className="flex items-center justify-between gap-2"><span>Shared reflections</span><span className="font-semibold text-slate-900">{fmtInt(selectedJournal.sharedReflections)}</span></div></div></div></div>
            <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-3"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><div className="text-[13px] font-bold text-slate-900">Prompt composer + journey flow</div><div className="mt-0.5 text-[12px] text-slate-500">Build guided prompts, scripture reflections, prayer lists, and journaling cues that move in a premium cadence.</div></div><ActionButton onClick={() => handleAddPrompt()} left={<Plus className="h-4 w-4" />}>Add Prompt</ActionButton></div><textarea value={composer} onChange={(e) => setComposer(e.target.value)} rows={3} placeholder="Draft a new prayer prompt, scripture reflection, or guided journaling question for the selected journal..." className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-[13px] text-slate-800 outline-none focus:border-emerald-300" /><div className="mt-3 space-y-2">{selectedJournal.prompts.map((prompt, idx) => (<div key={prompt.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3"><div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><div className="text-[13px] font-bold text-slate-900">{idx + 1}. {prompt.title}</div><Pill>{prompt.type}</Pill><Pill tone={prompt.state === "Ready" || prompt.state === "Published" ? "good" : prompt.state === "Scheduled" ? "warn" : "neutral"}>{prompt.state}</Pill></div><div className="mt-1 text-[12px] leading-relaxed text-slate-600 line-clamp-3">{prompt.prompt}</div></div><div className="text-[11px] font-semibold text-slate-500">{fmtLocal(prompt.scheduledISO)}</div></div></div>))}</div></div></>) : null}
          </SectionCard>

          <div className="space-y-4"><SectionCard title="Reflections + sharing board" subtitle="Moderate, feature, and route reflections into safe community or public surfaces." right={<Pill tone="warn">{journalReflections.length} items</Pill>}><div className="space-y-3">{journalReflections.map((reflection) => (<div key={reflection.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-3"><div className="flex items-start justify-between gap-3"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><div className="text-[13px] font-bold text-slate-900">{reflection.author}</div><Pill tone={reflection.status === "Featured" ? "good" : reflection.status === "Needs review" ? "warn" : reflection.status === "Private" ? "neutral" : "brand"}>{reflection.status}</Pill>{reflection.anonymous ? <Pill>Anonymous</Pill> : null}</div><div className="mt-2 text-[12px] leading-relaxed text-slate-600 line-clamp-3">{reflection.excerpt}</div><div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500"><span>{fmtLocal(reflection.submittedISO)}</span>{reflection.tags.map((tag) => (<span key={tag} className="rounded-full border border-slate-200 bg-white px-2 py-0.5 font-semibold text-slate-600">{tag}</span>))}</div></div></div><div className="mt-3 flex flex-wrap gap-2"><ActionButton onClick={() => handleFeatureReflection(reflection.id)} left={<CheckCircle2 className="h-4 w-4" />}>Feature</ActionButton><ActionButton onClick={handleShareReflection} left={<Share2 className="h-4 w-4" />}>Share</ActionButton></div></div>))}</div></SectionCard>
          <SectionCard title="Privacy, safeguards + hooks" subtitle="Keep journaling warm and safe while linking prayer, testimony, and noticeboard flows."><div className="space-y-2">{selectedJournal?.safeguards.map((item) => (<div key={item.id} className={cx("rounded-2xl border px-3 py-2", item.tone === "good" ? "border-emerald-200 bg-emerald-50" : item.tone === "warn" ? "border-amber-200 bg-amber-50" : "border-rose-200 bg-rose-50")}><div className="text-[12px] font-semibold text-slate-900">{item.label}</div><div className="mt-0.5 text-[11px] leading-relaxed text-slate-600">{item.hint}</div></div>))}</div><div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-3"><div className="text-[12px] font-bold text-slate-900">Cross-object hooks</div><div className="mt-3 flex flex-wrap gap-2">{selectedJournal?.hooks.map((hook) => (<Pill key={hook.id} tone={hook.state === "Ready" ? "good" : hook.state === "Linked" ? "brand" : hook.state === "Pending" ? "warn" : "neutral"}>{hook.label} {hook.state}</Pill>))}</div><div className="mt-3 text-[12px] leading-relaxed text-slate-500">Link approved reflections into Prayer Requests, Noticeboard, Testimonies, and Community Groups without losing context or safety defaults.</div></div></SectionCard></div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]"><SectionCard title="Prompt library + guided starters" subtitle="Premium prayer-journal templates for surrender, gratitude, intercession, examen, and family devotion flows." right={<ActionButton tone="ghost" left={<Wand2 className="h-4 w-4" />}>Starter kits</ActionButton>}><div className="grid gap-3 md:grid-cols-2">{TEMPLATE_PROMPTS.map((template) => (<div key={template.id} className="rounded-3xl border border-slate-200 bg-white p-4"><div className="flex items-start justify-between gap-2"><div><div className="text-[14px] font-bold text-slate-900">{template.title}</div><div className="mt-1 text-[12px] text-slate-500">{template.subtitle}</div></div><div className="h-2.5 w-14 rounded-full" style={{ background: template.accent === "green" ? EV_GREEN : template.accent === "orange" ? EV_ORANGE : EV_NAVY }} /></div><div className="mt-3 text-[12px] leading-relaxed text-slate-600 line-clamp-4">{template.prompt}</div><div className="mt-4 flex items-center justify-between gap-2"><Pill>{template.type}</Pill><ActionButton onClick={() => handleAddPrompt({ title: template.title, prompt: template.prompt, type: template.type })}>Use prompt</ActionButton></div></div>))}</div></SectionCard>
        <SectionCard title="Prayer journal destination preview" subtitle="Persistent preview rail for the selected journal card, guided prompt, and shared reflection surfaces." right={<div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1"><button type="button" onClick={() => setPreviewMode("desktop")} className={cx("rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors", previewMode === "desktop" ? "text-white" : "text-slate-600 hover:bg-white")} style={previewMode === "desktop" ? { background: EV_GREEN } : undefined}>Desktop</button><button type="button" onClick={() => setPreviewMode("mobile")} className={cx("rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors", previewMode === "mobile" ? "text-white" : "text-slate-600 hover:bg-white")} style={previewMode === "mobile" ? { background: EV_GREEN } : undefined}>Mobile</button></div>}>
          {selectedJournal ? (<><div className="rounded-[30px] border border-slate-200 bg-slate-50 p-4"><div className="mx-auto max-w-full"><PreviewShell mode={previewMode} journal={selectedJournal} reflection={selectedPreviewReflection} /></div></div><div className="mt-4 flex flex-wrap gap-2"><ActionButton onClick={() => setPreviewOpen(true)} left={<Eye className="h-4 w-4" />}>Open large preview</ActionButton><ActionButton onClick={async () => { await copyText(`${ROUTES.journalBuilder}/${selectedJournal.id}`); setToast("Preview route copied."); }} left={<Copy className="h-4 w-4" />}>Copy preview link</ActionButton></div></>) : null}
        </SectionCard></div>

        {toast ? <div className="fixed bottom-5 left-1/2 z-[95] -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white shadow-lg">{toast}</div> : null}

        <Drawer open={previewOpen} onClose={() => setPreviewOpen(false)} title="Prayer Journal Preview" subtitle="Large-format preview of the selected guided journal and reflection surface.">{selectedJournal ? (<div className="space-y-5"><div className="flex flex-wrap items-center gap-2"><ActionButton onClick={() => setPreviewMode("desktop")} tone={previewMode === "desktop" ? "primary" : "neutral"} left={<LayoutGrid className="h-4 w-4" />}>Desktop preview</ActionButton><ActionButton onClick={() => setPreviewMode("mobile")} tone={previewMode === "mobile" ? "primary" : "neutral"} left={<Eye className="h-4 w-4" />}>Mobile preview</ActionButton><ActionButton onClick={() => safeNav(ROUTES.journalBuilder)} left={<ExternalLink className="h-4 w-4" />}>Open builder route</ActionButton></div><PreviewShell mode={previewMode} journal={selectedJournal} reflection={selectedPreviewReflection} /><div className="grid gap-4 lg:grid-cols-3"><SectionCard title="Reflection sharing rules"><div className="space-y-2 text-[12px] text-slate-600"><div className="flex items-center justify-between gap-2"><span>Anonymous sharing</span><Pill tone={selectedJournal.allowAnonymousShare ? "good" : "neutral"}>{selectedJournal.allowAnonymousShare ? "Allowed" : "Off"}</Pill></div><div className="flex items-center justify-between gap-2"><span>Pastoral review</span><Pill tone={selectedJournal.pastoralReview ? "good" : "neutral"}>{selectedJournal.pastoralReview ? "Required" : "Bypass"}</Pill></div><div className="flex items-center justify-between gap-2"><span>Community comments</span><Pill tone={selectedJournal.commentsEnabled ? "warn" : "neutral"}>{selectedJournal.commentsEnabled ? "Enabled" : "Closed"}</Pill></div></div></SectionCard><SectionCard title="Linked destinations"><div className="space-y-2 text-[12px] text-slate-600"><div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">Prayer flow · {selectedJournal.linkedPrayerFlow || "Not linked"}</div><div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">Noticeboard · {selectedJournal.linkedNoticeboard || "Not linked"}</div><div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">Community group · {selectedJournal.linkedGroup || "Not linked"}</div></div></SectionCard><SectionCard title="Preview context"><div className="space-y-2 text-[12px] text-slate-600"><div className="flex items-center gap-2"><Users className="h-4 w-4 text-slate-500" /> {fmtInt(selectedJournal.participants)} participants</div><div className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-slate-500" /> {fmtInt(selectedJournal.sharedReflections)} shared reflections</div><div className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-slate-500" /> Next prompt {fmtLocal(selectedJournal.nextPromptISO)}</div></div></SectionCard></div></div>) : null}</Drawer>
      </div>
    </div>
  );
}


