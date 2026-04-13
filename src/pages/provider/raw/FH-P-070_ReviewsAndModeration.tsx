
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Flag,
  Info,
  Layers,
  MessageCircle,
  MonitorPlay,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from 'lucide-react';

/**
 * FaithHub — FH-P-070 Reviews & Moderation
 * ---------------------------------------
 * Premium trust-and-safety centre for Provider-side review response,
 * moderation case handling, risk pattern detection, and reputation recovery.
 *
 * Notes
 * - Self-contained mock page built to match the premium creator-style format used
 *   across the FaithHub Provider pages.
 * - Uses EVzone Green as primary and Orange as secondary, with calm neutrals for trust workflows.
 * - Replace routes and mocked datasets during integration.
 */

const EV_GREEN = '#03cd8c';
const EV_ORANGE = '#f77f00';
const EV_GREY = '#a6a6a6';
const EV_LIGHT = '#f2f2f2';

const ROUTES = {
  providerDashboard: '/faithhub/provider/dashboard',
  liveDashboard: '/faithhub/provider/live-dashboard',
  replaysAndClips: '/faithhub/provider/replays-and-clips',
};

const cx = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(' ');

function safeNav(url: string) {
  if (typeof window === 'undefined') return;
  window.location.assign(url);
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function fmtPercent(n: number) {
  return `${n.toFixed(0)}%`;
}

function fmtInt(n: number) {
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

type ReviewSource = 'Institution' | 'Live Session' | 'Replay' | 'Clip' | 'Event' | 'Campaign';
type ReviewTopic = 'Technical' | 'Pastoral care' | 'Moderation' | 'Accessibility' | 'Giving' | 'Experience';
type ReviewStatus = 'Awaiting response' | 'Draft reply' | 'Responded' | 'Escalated';
type Sentiment = 'Positive' | 'Mixed' | 'Negative';
type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
type CaseType = 'Chat report' | 'Flagged clip' | 'Review abuse' | 'Account incident' | 'Appeal' | 'Child safety';
type CaseStatus = 'Open' | 'Investigating' | 'Resolved' | 'Escalated';
type PreviewMode = 'desktop' | 'mobile';
type ToneKey = 'Warm' | 'Pastoral' | 'Formal' | 'Firm';
type Tone = 'neutral' | 'good' | 'warn' | 'bad' | 'brand' | 'accent';

type ReviewRecord = {
  id: string;
  sourceType: ReviewSource;
  sourceLabel: string;
  title: string;
  rating: number;
  sentiment: Sentiment;
  topic: ReviewTopic;
  urgency: Severity;
  owner: string;
  status: ReviewStatus;
  excerpt: string;
  dueLabel: string;
  createdLabel: string;
  positiveSignals: string[];
  negativeSignals: string[];
  publicResponse?: string;
};

type ModerationCase = {
  id: string;
  type: CaseType;
  sourceLabel: string;
  title: string;
  urgency: Severity;
  owner: string;
  status: CaseStatus;
  summary: string;
  patternTag: string;
  evidenceCount: number;
  priorRulings: number;
  childSafe?: boolean;
  lastActionLabel: string;
  evidence: string[];
  actionHistory: string[];
};

type RiskSignal = {
  title: string;
  detail: string;
  value: string;
  trendLabel: string;
  tone: Tone;
};

type PolicyItem = {
  title: string;
  detail: string;
  state: 'Active' | 'Review' | 'Locked';
};

type RecoveryInsight = {
  title: string;
  detail: string;
  impact: 'High' | 'Medium';
  nextAction: string;
};

const REVIEW_TEMPLATE_MAP: Record<string, string> = {
  'Pastoral acknowledgement':
    "Thank you for sharing this with us. We are grateful you took time to speak honestly. Our team has reviewed your concern and we are following up with the ministry leads involved so we can respond with care and clarity.",
  'Technical issue follow-up':
    "Thank you for highlighting the issue. We traced the problem to our live audio chain and have already updated the studio checks for the next session. We appreciate your patience and we are attaching the corrected replay so you can catch the message without disruption.",
  'Child-safe escalation hold':
    "We have paused public handling of this report while our safeguarding workflow is active. Our team is reviewing the evidence and will only respond publicly once child-safe actions and escalation requirements are complete.",
  'Giving transparency answer':
    "Thank you for asking for clarity. We have reviewed the campaign settings, beneficiary notes, and disbursement records tied to this fund. We are updating the public campaign page with clearer impact details and a new progress note today.",
};

const TONE_GUIDANCE: Record<ToneKey, string> = {
  Warm: 'Gentle, appreciative, human. Best for mixed or emotional feedback.',
  Pastoral: 'Compassionate and faith-aware. Best for ministry hurt, prayer, and care concerns.',
  Formal: 'Clear and policy-forward. Best for verification, compliance, and public correction.',
  Firm: 'Short, decisive, and controlled. Best for abuse, false claims, and repeat violations.',
};

const reviewsSeed: ReviewRecord[] = [
  {
    id: 'RV-102',
    sourceType: 'Live Session',
    sourceLabel: 'Sunday Encounter · Live Session',
    title: 'Audio dropped during the message',
    rating: 2,
    sentiment: 'Negative',
    topic: 'Technical',
    urgency: 'High',
    owner: 'Production lead',
    status: 'Awaiting response',
    excerpt:
      'The message was strong but audio kept dropping for about ten minutes. I left and only came back later because I could not follow the teaching clearly.',
    dueLabel: 'Respond within 2h',
    createdLabel: '18 min ago',
    positiveSignals: ['Teaching was strong'],
    negativeSignals: ['Audio dropout', 'Viewer drop-off risk'],
  },
  {
    id: 'RV-087',
    sourceType: 'Replay',
    sourceLabel: 'Grace in Motion · Replay',
    title: 'The replay notes were very helpful',
    rating: 5,
    sentiment: 'Positive',
    topic: 'Experience',
    urgency: 'Low',
    owner: 'Content editor',
    status: 'Responded',
    excerpt:
      'I loved being able to read the notes after the service. The chapter markers made it easy to return to the prayer section and share it with family.',
    dueLabel: 'Closed',
    createdLabel: 'Yesterday',
    positiveSignals: ['Notes & chapters', 'Shareability'],
    negativeSignals: [],
    publicResponse:
      'Thank you for the encouragement. We are glad the notes and chapter markers helped you revisit the message and share it with others.',
  },
  {
    id: 'RV-091',
    sourceType: 'Clip',
    sourceLabel: 'Healing in 60 Seconds · Clip',
    title: 'Comments felt unsafe and unmoderated',
    rating: 1,
    sentiment: 'Negative',
    topic: 'Moderation',
    urgency: 'Critical',
    owner: 'Trust lead',
    status: 'Escalated',
    excerpt:
      'I opened the clip and saw several hostile comments that should have been removed. This is not okay for a ministry page.',
    dueLabel: 'Safeguarding hold',
    createdLabel: '34 min ago',
    positiveSignals: ['Strong clip reach'],
    negativeSignals: ['Unsafe comment thread', 'Public trust risk'],
    publicResponse:
      'Thank you for reporting this. We escalated the thread immediately and have removed the comments that violated our moderation standards.',
  },
  {
    id: 'RV-074',
    sourceType: 'Institution',
    sourceLabel: 'Institution Page · Grace House Kampala',
    title: 'Warm welcome and clear service times',
    rating: 5,
    sentiment: 'Positive',
    topic: 'Experience',
    urgency: 'Low',
    owner: 'Communications lead',
    status: 'Responded',
    excerpt:
      'The welcome information, directions, and prayer request options made it easy for our family to know what to expect before visiting.',
    dueLabel: 'Closed',
    createdLabel: '2 days ago',
    positiveSignals: ['Warm onboarding', 'Clear timings'],
    negativeSignals: [],
    publicResponse:
      'Thank you for visiting and for the kind words. We are grateful the page made your first experience clear and welcoming.',
  },
  {
    id: 'RV-065',
    sourceType: 'Event',
    sourceLabel: 'Youth Retreat Registration',
    title: 'Accessibility details were missing',
    rating: 3,
    sentiment: 'Mixed',
    topic: 'Accessibility',
    urgency: 'Medium',
    owner: 'Events manager',
    status: 'Draft reply',
    excerpt:
      'I could not find enough information about wheelchair access and drop-off support for the event venue. This should be visible before registration.',
    dueLabel: 'Respond today',
    createdLabel: '3h ago',
    positiveSignals: ['Strong registration intent'],
    negativeSignals: ['Accessibility gap'],
  },
  {
    id: 'RV-058',
    sourceType: 'Campaign',
    sourceLabel: 'Flood Relief Crowdfund',
    title: 'Need more clarity on impact updates',
    rating: 4,
    sentiment: 'Mixed',
    topic: 'Giving',
    urgency: 'Medium',
    owner: 'Finance lead',
    status: 'Awaiting response',
    excerpt:
      'I want to support the campaign, but I need clearer updates on beneficiary delivery and how funds are moving from giving into actual impact.',
    dueLabel: 'Respond today',
    createdLabel: '5h ago',
    positiveSignals: ['High donor intent'],
    negativeSignals: ['Transparency request'],
  },
];

const casesSeed: ModerationCase[] = [
  {
    id: 'MC-204',
    type: 'Child safety',
    sourceLabel: 'Kids Worship Replay',
    title: 'Off-platform contact requests in comment thread',
    urgency: 'Critical',
    owner: 'Safeguarding lead',
    status: 'Investigating',
    summary:
      'Two accounts repeatedly asked minors to move into private messages. The thread was frozen and the accounts were hidden pending review.',
    patternTag: 'Child-facing risk',
    evidenceCount: 6,
    priorRulings: 2,
    childSafe: true,
    lastActionLabel: '7 min ago',
    evidence: [
      'Screenshot batch from replay thread',
      'Message cluster export with timestamps',
      'Account age and prior moderation history',
      'Safeguarding lead notes',
      'Muted-user audit trail',
      'Hidden-comment snapshot',
    ],
    actionHistory: [
      'Thread slow mode enabled',
      'Both accounts hidden from audience surfaces',
      'Safeguarding lead paged automatically',
      'Appeal window paused until review closes',
    ],
  },
  {
    id: 'MC-198',
    type: 'Chat report',
    sourceLabel: 'Sunday Encounter · Live Session',
    title: 'Prayer request queue flooded by spam links',
    urgency: 'High',
    owner: 'Moderation captain',
    status: 'Open',
    summary:
      'A burst of link spam entered the prayer queue during the altar call and reduced visibility for genuine requests.',
    patternTag: 'Spam burst',
    evidenceCount: 4,
    priorRulings: 1,
    lastActionLabel: '12 min ago',
    evidence: [
      'Prayer queue snapshot',
      'Chat velocity report',
      'Moderator mute log',
      'Spam term detection sample',
    ],
    actionHistory: [
      'Slow mode activated',
      'Prayer intake temporarily restricted to followers',
      'Moderator requested keyword expansion',
    ],
  },
  {
    id: 'MC-181',
    type: 'Flagged clip',
    sourceLabel: 'Healing in 60 Seconds · Clip',
    title: 'Context dispute on clipped testimony moment',
    urgency: 'Medium',
    owner: 'Content lead',
    status: 'Escalated',
    summary:
      'Users claim the clip removed clarifying context from the full teaching, creating a misleading impression of the message.',
    patternTag: 'Context integrity',
    evidenceCount: 3,
    priorRulings: 0,
    lastActionLabel: '1h ago',
    evidence: [
      'Original replay marker export',
      'Published clip metadata snapshot',
      'Two high-signal user reports',
    ],
    actionHistory: [
      'Clip distribution paused',
      'Linked replay surfaced beside clip',
      'Editorial review requested',
    ],
  },
  {
    id: 'MC-166',
    type: 'Review abuse',
    sourceLabel: 'Institution Page · Grace House Kampala',
    title: 'Possible coordinated 1-star review brigade',
    urgency: 'High',
    owner: 'Trust lead',
    status: 'Investigating',
    summary:
      'Multiple low-context 1-star reviews arrived inside nine minutes from recently-created accounts with identical phrasing.',
    patternTag: 'Brigading suspicion',
    evidenceCount: 5,
    priorRulings: 3,
    lastActionLabel: '2h ago',
    evidence: [
      'Review burst timeline',
      'Account age comparison',
      'Phrase similarity clustering',
      'Geo and device pattern overlap',
      'Previous brigade case reference',
    ],
    actionHistory: [
      'Ratings suppressed from public average pending review',
      'Communications lead notified',
      'Manual audit started',
    ],
  },
  {
    id: 'MC-152',
    type: 'Appeal',
    sourceLabel: 'Crowdfund update thread',
    title: 'User appeal after abusive comment removal',
    urgency: 'Low',
    owner: 'Moderator',
    status: 'Open',
    summary:
      'A donor requested reversal after a heated exchange in the campaign update comments. Evidence suggests the removal was correct but explanation is pending.',
    patternTag: 'Appeal handling',
    evidenceCount: 2,
    priorRulings: 1,
    lastActionLabel: 'Yesterday',
    evidence: ['Removed comment snapshot', 'Prior warning note'],
    actionHistory: ['Appeal acknowledged', 'Review note attached'],
  },
];

const riskSignalsSeed: RiskSignal[] = [
  {
    title: 'Brigading suspicion',
    detail: 'Low-context 1-star reviews clustered across one institution page and a replay in the same 12-minute window.',
    value: '12 linked accounts',
    trendLabel: 'Escalating',
    tone: 'warn',
  },
  {
    title: 'Recurring technical complaint',
    detail: 'Audio quality complaints are now the top negative theme for live sessions this week.',
    value: '31% of negative feedback',
    trendLabel: 'Needs fix',
    tone: 'accent',
  },
  {
    title: 'Repeat toxic users',
    detail: 'Three accounts have crossed moderation thresholds on both clip and live-session surfaces.',
    value: '3 repeat offenders',
    trendLabel: 'Watch closely',
    tone: 'bad',
  },
  {
    title: 'Child-safe lane coverage',
    detail: 'All child-facing sessions currently have protected moderation defaults and escalation routing enabled.',
    value: '100% covered',
    trendLabel: 'Healthy',
    tone: 'good',
  },
  {
    title: 'Response quality trend',
    detail: 'Public response turnaround improved after templated approvals were enabled for 1–2 star reviews.',
    value: '92% within SLA',
    trendLabel: 'Improving',
    tone: 'brand',
  },
];

const policySeed: PolicyItem[] = [
  {
    title: '1–2 star review approval route',
    detail: 'Communications lead review required before public response goes live.',
    state: 'Active',
  },
  {
    title: 'Child-facing moderation defaults',
    detail: 'Protected-lane moderation, DM restrictions, and safeguarding escalation are locked for kids surfaces.',
    state: 'Locked',
  },
  {
    title: 'Replay context integrity rule',
    detail: 'Flagged clips must surface the full replay when context challenges are active.',
    state: 'Active',
  },
  {
    title: 'Crowdfund transparency guidance',
    detail: 'Impact-update cadence and beneficiary proofs are reviewed weekly during active campaigns.',
    state: 'Review',
  },
];

const recoveryInsightsSeed: RecoveryInsight[] = [
  {
    title: 'Answer the audio complaint cluster before the next live session',
    detail:
      'Responding to the open technical reviews and publishing the studio fix note is the fastest way to reduce negative sentiment on Live Sessionz.',
    impact: 'High',
    nextAction: 'Open Live Dashboard',
  },
  {
    title: 'Refresh accessibility details on youth retreat pages',
    detail:
      'The highest-leverage content fix is to publish venue access notes, quiet-room guidance, and drop-off instructions on the event page.',
    impact: 'Medium',
    nextAction: 'Update event listing',
  },
  {
    title: 'Attach impact proof to the active crowdfund',
    detail:
      'Donor trust is strongest when the next campaign update includes beneficiary proof, delivery status, and a short stewardship note.',
    impact: 'High',
    nextAction: 'Post campaign update',
  },
  {
    title: 'Respond publicly on moderated clip context disputes',
    detail:
      'When a clip is paused for context review, add a short public note that points people back to the replay and explains the editorial check.',
    impact: 'Medium',
    nextAction: 'Open Replays & Clips',
  },
];

const sentimentSeries = [4.2, 4.3, 4.1, 4.4, 4.5, 4.6, 4.4, 4.6, 4.7];
const openIssueSeries = [14, 13, 15, 12, 10, 9, 8, 7, 7];
const recoverySeries = [68, 70, 73, 75, 80, 84, 88, 90, 92];

const positiveSurfaceBars = [
  { label: 'Institution page', value: 92, hint: 'Warm onboarding and clear timings' },
  { label: 'Replay library', value: 88, hint: 'Notes, chapters, and shareability' },
  { label: 'Events pages', value: 75, hint: 'Strong registration intent' },
];

const negativeSurfaceBars = [
  { label: 'Live Sessionz', value: 31, hint: 'Mostly audio and late-start complaints' },
  { label: 'Clip comments', value: 22, hint: 'Moderation and context disputes' },
  { label: 'Giving campaigns', value: 17, hint: 'Transparency and update cadence' },
];

function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />;
}

function Pill({
  children,
  tone = 'neutral',
  title,
}: {
  children: React.ReactNode;
  tone?: Tone;
  title?: string;
}) {
  const cls =
    tone === 'good'
      ? 'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20'
      : tone === 'warn'
        ? 'bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20'
        : tone === 'bad'
          ? 'bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20'
          : tone === 'brand'
            ? 'text-white shadow-sm ring-0'
            : tone === 'accent'
              ? 'text-white shadow-sm ring-0'
              : 'bg-slate-100 text-slate-800 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700';

  return (
    <span
      title={title}
      className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-bold ring-1 whitespace-nowrap transition', cls)}
      style={tone === 'brand' ? { background: EV_GREEN } : tone === 'accent' ? { background: EV_ORANGE } : undefined}
    >
      {children}
    </span>
  );
}

function Btn({
  children,
  onClick,
  tone = 'neutral',
  disabled,
  loading,
  left,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: 'neutral' | 'primary' | 'accent' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  left?: React.ReactNode;
  title?: string;
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';
  const cls =
    tone === 'primary'
      ? 'text-white hover:brightness-95 shadow-sm'
      : tone === 'accent'
        ? 'text-white hover:brightness-95 shadow-sm'
        : tone === 'danger'
          ? 'bg-rose-600 text-white hover:brightness-95 shadow-sm'
          : tone === 'ghost'
            ? 'bg-transparent text-slate-900 dark:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800'
            : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 ring-1 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm';

  return (
    <button
      type="button"
      title={title}
      className={cx(base, cls)}
      style={tone === 'primary' ? { background: EV_GREEN } : tone === 'accent' ? { background: EV_ORANGE } : undefined}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
    >
      {loading ? <Spinner /> : left}
      {children}
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
    <section className={cx('rounded-3xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm transition', className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-slate-50 uppercase tracking-tight">{title}</div>
          {subtitle ? <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">{subtitle}</div> : null}
        </div>
        {right}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Modal({
  open,
  title,
  subtitle,
  onClose,
  children,
  right,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-6xl rounded-t-3xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 sm:rounded-3xl max-h-[92vh] overflow-hidden">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 px-5 py-4">
          <div className="min-w-0">
            <div className="text-base font-bold text-slate-900 dark:text-slate-50">{title}</div>
            {subtitle ? <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</div> : null}
          </div>
          <div className="flex items-center gap-2">
            {right}
            <Btn tone="ghost" onClick={onClose} left={<X className="h-4 w-4" />}>
              Close
            </Btn>
          </div>
        </div>
        <div className="max-h-[calc(92vh-82px)] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

function MiniSparkline({
  data,
  tone = 'brand',
}: {
  data: number[];
  tone?: 'brand' | 'accent' | 'neutral';
}) {
  const w = 180;
  const h = 54;
  const pad = 6;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = pad + (index / Math.max(1, data.length - 1)) * (w - pad * 2);
      const y = h - pad - ((value - min) / span) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const stroke = tone === 'accent' ? EV_ORANGE : tone === 'brand' ? EV_GREEN : EV_GREY;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-14 w-full">
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`${points} ${w - pad},${h - pad} ${pad},${h - pad}`} fill={stroke} opacity="0.08" />
    </svg>
  );
}

function ScoreTile({
  label,
  value,
  hint,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  hint: string;
  tone?: Tone;
}) {
  return (
    <div
      className={cx(
        'rounded-3xl p-4 ring-1 transition',
        tone === 'brand'
          ? 'text-white'
          : tone === 'accent'
            ? 'text-white'
            : tone === 'good'
              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-slate-900 dark:text-slate-50 ring-emerald-200 dark:ring-emerald-500/20'
              : 'bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-50 ring-slate-200 dark:ring-slate-700'
      )}
      style={tone === 'brand' ? { background: EV_GREEN } : tone === 'accent' ? { background: EV_ORANGE } : undefined}
    >
      <div className={cx('text-[11px] uppercase tracking-[0.16em]', tone === 'brand' || tone === 'accent' ? 'text-white/85' : 'text-slate-500 dark:text-slate-400')}>
        {label}
      </div>
      <div className="mt-2 text-[34px] leading-none font-black">{value}</div>
      <div className={cx('mt-2 text-[12px]', tone === 'brand' || tone === 'accent' ? 'text-white/90' : 'text-slate-600 dark:text-slate-400')}>
        {hint}
      </div>
    </div>
  );
}

function SurfaceBarList({
  items,
  accent = 'brand',
}: {
  items: Array<{ label: string; value: number; hint: string }>;
  accent?: 'brand' | 'accent';
}) {
  const max = Math.max(1, ...items.map((item) => item.value));
  return (
    <div className="space-y-2">
      {items.map((item) => {
        const width = Math.max(10, Math.round((item.value / max) * 100));
        return (
          <div key={item.label} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 transition">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[13px] font-bold text-slate-900 dark:text-slate-100">{item.label}</div>
                <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{item.hint}</div>
              </div>
              <div className="text-[13px] font-bold text-slate-900 dark:text-slate-100">{item.value}</div>
            </div>
            <div className="mt-3 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${width}%`, background: accent === 'accent' ? EV_ORANGE : EV_GREEN }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ReviewRow({
  review,
  active,
  onSelect,
  onRespond,
}: {
  review: ReviewRecord;
  active: boolean;
  onSelect: () => void;
  onRespond: () => void;
}) {
  const sentimentTone = review.sentiment === 'Positive' ? 'good' : review.sentiment === 'Negative' ? 'bad' : 'warn';
  const urgencyTone = review.urgency === 'Critical' ? 'bad' : review.urgency === 'High' ? 'accent' : review.urgency === 'Medium' ? 'warn' : 'good';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cx(
        'w-full rounded-3xl border p-4 text-left transition shadow-sm',
        active
          ? 'border-emerald-300 bg-emerald-50/60 dark:bg-emerald-500/10 dark:border-emerald-500/30'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900'
      )}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100">{review.title}</div>
            <Pill tone={sentimentTone}>{review.sentiment}</Pill>
            <Pill tone={urgencyTone}>{review.urgency}</Pill>
            <Pill tone="neutral">{review.sourceType}</Pill>
          </div>
          <div className="mt-2 text-[12px] text-slate-500 dark:text-slate-400">
            {review.sourceLabel} · {review.topic} · Owner: {review.owner}
          </div>
          <div className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
            “{review.excerpt}”
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <span key={idx} className={cx('inline-flex items-center', idx < review.rating ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700')}>
                <Star className="h-4 w-4" fill={idx < review.rating ? 'currentColor' : 'none'} />
              </span>
            ))}
            <span className="ml-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">{review.createdLabel}</span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">• {review.dueLabel}</span>
          </div>
        </div>

        <div className="flex flex-row md:flex-col items-stretch gap-2 md:min-w-[180px]">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Status</div>
            <div className="mt-1 text-[12px] font-bold text-slate-900 dark:text-slate-100">{review.status}</div>
          </div>
          <Btn tone="ghost" onClick={onRespond} left={<MessageCircle className="h-4 w-4" />}>
            Respond
          </Btn>
        </div>
      </div>
    </button>
  );
}

function CaseRow({
  kase,
  active,
  onSelect,
  onResolve,
  onEscalate,
}: {
  kase: ModerationCase;
  active: boolean;
  onSelect: () => void;
  onResolve: () => void;
  onEscalate: () => void;
}) {
  const statusTone = kase.status === 'Resolved' ? 'good' : kase.status === 'Escalated' ? 'accent' : kase.urgency === 'Critical' ? 'bad' : 'warn';

  return (
    <div
      className={cx(
        'rounded-3xl border p-4 transition',
        active
          ? 'border-amber-300 bg-amber-50/60 dark:bg-amber-500/10 dark:border-amber-500/30'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950'
      )}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <button type="button" onClick={onSelect} className="min-w-0 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100">{kase.title}</div>
            <Pill tone={statusTone}>{kase.status}</Pill>
            <Pill tone={kase.childSafe ? 'bad' : 'neutral'}>{kase.type}</Pill>
            {kase.childSafe ? <Pill tone="bad">Child-safe</Pill> : null}
          </div>
          <div className="mt-2 text-[12px] text-slate-500 dark:text-slate-400">
            {kase.sourceLabel} · Owner: {kase.owner} · {kase.lastActionLabel}
          </div>
          <div className="mt-3 text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">{kase.summary}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill tone="neutral">{kase.patternTag}</Pill>
            <Pill tone="neutral">{kase.evidenceCount} evidence items</Pill>
            <Pill tone="neutral">{kase.priorRulings} prior rulings</Pill>
          </div>
        </button>

        <div className="flex flex-wrap gap-2 lg:min-w-[220px] lg:justify-end">
          <Btn tone="neutral" onClick={onSelect} left={<Layers className="h-4 w-4" />}>
            Evidence
          </Btn>
          <Btn tone="primary" onClick={onResolve} left={<CheckCircle2 className="h-4 w-4" />}>
            Resolve
          </Btn>
          <Btn tone="accent" onClick={onEscalate} left={<Flag className="h-4 w-4" />}>
            Escalate
          </Btn>
        </div>
      </div>
    </div>
  );
}

function PreviewCanvas({
  review,
  responseText,
  device = 'desktop',
}: {
  review: ReviewRecord;
  responseText: string;
  device?: PreviewMode;
}) {
  const stars = (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, idx) => (
        <span key={idx} className={cx(idx < review.rating ? 'text-amber-500' : 'text-slate-300')}>
          <Star className="h-4 w-4" fill={idx < review.rating ? 'currentColor' : 'none'} />
        </span>
      ))}
    </div>
  );

  const publicCard = (
    <div className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm transition-colors">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100">Public trust surface</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">{review.sourceLabel}</div>
        </div>
        <Pill tone={review.sentiment === 'Negative' ? 'warn' : 'good'}>
          {review.status === 'Responded' ? 'Responded' : 'Pending response'}
        </Pill>
      </div>

      <div className="mt-4 rounded-3xl bg-slate-50 dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[14px] font-extrabold text-slate-900 dark:text-slate-100">{review.title}</div>
            <div className="mt-1 flex items-center gap-2">
              {stars}
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{review.createdLabel}</span>
            </div>
          </div>
          <div className="h-11 w-11 rounded-2xl grid place-items-center text-white font-black" style={{ background: EV_GREEN }}>
            FH
          </div>
        </div>

        <div className="mt-3 text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
          “{review.excerpt}”
        </div>

        <div className="mt-4 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-4">
          <div className="flex items-center gap-2 text-[12px] font-extrabold text-slate-900 dark:text-slate-100">
            <ShieldCheck className="h-4 w-4" style={{ color: EV_GREEN }} />
            Provider response
          </div>
          <div className="mt-2 text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
            {responseText || 'Draft your response to preview how public trust messaging will appear.'}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Pill tone="brand">Trust centre verified</Pill>
          <Pill tone="neutral">Action history attached</Pill>
        </div>
      </div>
    </div>
  );

  if (device === 'mobile') {
    return (
      <div className="mx-auto w-full max-w-[290px]">
        <div className="rounded-[36px] bg-slate-950 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.45)]">
          <div className="rounded-[28px] bg-white dark:bg-slate-900 p-3 transition-colors">
            <div className="mx-auto mb-3 h-5 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="rounded-[24px] bg-slate-50 dark:bg-slate-950 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[12px] font-extrabold text-slate-900 dark:text-slate-100">Review card</div>
                <Pill tone={review.sentiment === 'Negative' ? 'accent' : 'good'}>{review.rating}.0★</Pill>
              </div>
              <div className="mt-3 text-[13px] font-bold text-slate-900 dark:text-slate-100">{review.title}</div>
              <div className="mt-2 text-[12px] leading-relaxed text-slate-700 dark:text-slate-300">“{review.excerpt}”</div>

              <div className="mt-4 rounded-2xl p-3 text-white" style={{ background: EV_GREEN }}>
                <div className="text-[11px] uppercase tracking-[0.16em] text-white/80">Public response</div>
                <div className="mt-2 text-[12px] leading-relaxed">{responseText}</div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                <div className="rounded-2xl bg-white dark:bg-slate-900 p-2 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-slate-400 uppercase tracking-wide">Source</div>
                  <div className="mt-1 font-bold text-slate-900 dark:text-slate-100">{review.sourceType}</div>
                </div>
                <div className="rounded-2xl bg-white dark:bg-slate-900 p-2 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-slate-400 uppercase tracking-wide">Status</div>
                  <div className="mt-1 font-bold text-slate-900 dark:text-slate-100">{review.status}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return publicCard;
}

export default function FaithHubReviewsAndModerationPage() {
  const [reviews, setReviews] = useState<ReviewRecord[]>(reviewsSeed);
  const [cases, setCases] = useState<ModerationCase[]>(casesSeed);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'All' | ReviewSource>('All');
  const [topicFilter, setTopicFilter] = useState<'All' | ReviewTopic>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | ReviewStatus>('All');
  const [selectedReviewId, setSelectedReviewId] = useState<string>(reviewsSeed[0].id);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(casesSeed[0].id);
  const [templateKey, setTemplateKey] = useState<string>('Technical issue follow-up');
  const [responseTone, setResponseTone] = useState<ToneKey>('Warm');
  const [approvalRoute, setApprovalRoute] = useState('Communications lead → Pastoral lead');
  const [collabNotes, setCollabNotes] = useState('Mention the audio-chain fix, caption confidence refresh, and the replay fallback already published.');
  const [responseBody, setResponseBody] = useState(REVIEW_TEMPLATE_MAP['Technical issue follow-up']);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'respond' | 'resolve' | 'escalate' | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const selectedReview = useMemo(
    () => reviews.find((review) => review.id === selectedReviewId) || reviews[0],
    [reviews, selectedReviewId]
  );

  const selectedCase = useMemo(
    () => cases.find((kase) => kase.id === selectedCaseId) || cases[0],
    [cases, selectedCaseId]
  );

  useEffect(() => {
    if (!selectedReview) return;
    if (selectedReview.topic === 'Technical') {
      setTemplateKey('Technical issue follow-up');
      setResponseTone('Warm');
      setResponseBody(selectedReview.publicResponse || REVIEW_TEMPLATE_MAP['Technical issue follow-up']);
    } else if (selectedReview.topic === 'Giving') {
      setTemplateKey('Giving transparency answer');
      setResponseTone('Formal');
      setResponseBody(selectedReview.publicResponse || REVIEW_TEMPLATE_MAP['Giving transparency answer']);
    } else if (selectedReview.urgency === 'Critical') {
      setTemplateKey('Child-safe escalation hold');
      setResponseTone('Firm');
      setResponseBody(selectedReview.publicResponse || REVIEW_TEMPLATE_MAP['Child-safe escalation hold']);
    } else {
      setTemplateKey('Pastoral acknowledgement');
      setResponseTone('Pastoral');
      setResponseBody(selectedReview.publicResponse || REVIEW_TEMPLATE_MAP['Pastoral acknowledgement']);
    }
  }, [selectedReviewId, selectedReview?.publicResponse, selectedReview?.topic, selectedReview?.urgency]);

  const filteredReviews = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reviews.filter((review) => {
      const matchesSource = sourceFilter === 'All' || review.sourceType === sourceFilter;
      const matchesTopic = topicFilter === 'All' || review.topic === topicFilter;
      const matchesStatus = statusFilter === 'All' || review.status === statusFilter;
      const haystack = `${review.title} ${review.sourceLabel} ${review.excerpt} ${review.owner}`.toLowerCase();
      const matchesSearch = !q || haystack.includes(q);
      return matchesSource && matchesTopic && matchesStatus && matchesSearch;
    });
  }, [reviews, search, sourceFilter, topicFilter, statusFilter]);

  useEffect(() => {
    if (!filteredReviews.length) return;
    if (!filteredReviews.some((review) => review.id === selectedReviewId)) {
      setSelectedReviewId(filteredReviews[0].id);
    }
  }, [filteredReviews, selectedReviewId]);

  const averageRating = useMemo(
    () => reviews.reduce((sum, review) => sum + review.rating, 0) / Math.max(1, reviews.length),
    [reviews]
  );
  const responseRate = useMemo(
    () => (reviews.filter((review) => review.status === 'Responded').length / Math.max(1, reviews.length)) * 100,
    [reviews]
  );
  const unresolvedIssueCount = useMemo(
    () => reviews.filter((review) => review.status !== 'Responded').length + cases.filter((kase) => kase.status !== 'Resolved').length,
    [reviews, cases]
  );
  const reviewSentiment = useMemo(() => {
    const positive = reviews.filter((review) => review.sentiment === 'Positive').length;
    const mixed = reviews.filter((review) => review.sentiment === 'Mixed').length;
    const negative = reviews.filter((review) => review.sentiment === 'Negative').length;
    return { positive, mixed, negative };
  }, [reviews]);
  const trustScore = useMemo(() => 92, []);

  const recurringComplaints = [
    'Audio confidence during altar calls',
    'Clip context explanation on high-reach shorts',
    'Accessibility detail gaps on event pages',
    'Impact update cadence on charity campaigns',
  ];

  const handleTemplateApply = (nextTemplate: string) => {
    setTemplateKey(nextTemplate);
    setResponseBody(REVIEW_TEMPLATE_MAP[nextTemplate]);
    setToast(`Loaded template: ${nextTemplate}`);
  };

  const handleSendResponse = () => {
    if (!selectedReview) return;
    setPendingAction('respond');
    window.setTimeout(() => {
      setReviews((current) =>
        current.map((review) =>
          review.id === selectedReview.id
            ? {
                ...review,
                status: 'Responded',
                publicResponse: responseBody,
                dueLabel: 'Closed',
              }
            : review
        )
      );
      setPendingAction(null);
      setToast('Review response sent and attached to the public trust surface.');
    }, 850);
  };

  const handleResolveCase = () => {
    if (!selectedCase) return;
    setPendingAction('resolve');
    window.setTimeout(() => {
      setCases((current) =>
        current.map((kase) =>
          kase.id === selectedCase.id
            ? {
                ...kase,
                status: 'Resolved',
                lastActionLabel: 'Resolved just now',
                actionHistory: ['Case resolved and action log published', ...kase.actionHistory],
              }
            : kase
        )
      );
      setPendingAction(null);
      setToast('Moderation case resolved with action history preserved.');
    }, 750);
  };

  const handleEscalateCase = () => {
    if (!selectedCase) return;
    setPendingAction('escalate');
    window.setTimeout(() => {
      setCases((current) =>
        current.map((kase) =>
          kase.id === selectedCase.id
            ? {
                ...kase,
                status: 'Escalated',
                lastActionLabel: 'Escalated to safeguarding and leadership',
                actionHistory: ['Escalated to leadership and safeguarding chain', ...kase.actionHistory],
              }
            : kase
        )
      );
      setPendingAction(null);
      setToast('Case escalated with evidence bundle and prior rulings attached.');
    }, 780);
  };

  return (
    <div className="min-h-screen w-full bg-[#f2f2f2] dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors overflow-x-hidden">
      <div className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition">
        <div className="w-full px-4 md:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-[0.16em] font-bold">
                <span>FaithHub Provider</span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span>Post-live & Trust</span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="text-slate-900 dark:text-slate-100">Reviews & Moderation</span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                  FH-P-070 Reviews & Moderation
                </div>
                <Pill tone="brand">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Trust centre active
                </Pill>
                <Pill tone="accent">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {cases.filter((kase) => kase.status !== 'Resolved').length} open cases
                </Pill>
                <Pill tone="good">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Child-safe defaults locked
                </Pill>
              </div>

              <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Protect institution trust across Live Sessionz, replays, clips, events, campaigns, and public reviews without losing context.
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Btn tone="ghost" onClick={() => setPreviewOpen(true)} left={<Eye className="h-4 w-4" />}>
                Preview
              </Btn>
              <Btn tone="neutral" onClick={() => safeNav(ROUTES.providerDashboard)} left={<Layers className="h-4 w-4" />}>
                Provider Dashboard
              </Btn>
              <Btn tone="primary" onClick={handleSendResponse} loading={pendingAction === 'respond'} left={<Send className="h-4 w-4" />}>
                Respond to review
              </Btn>
              <Btn tone="accent" onClick={handleResolveCase} loading={pendingAction === 'resolve'} left={<CheckCircle2 className="h-4 w-4" />}>
                Resolve moderation case
              </Btn>
              <Btn tone="danger" onClick={handleEscalateCase} loading={pendingAction === 'escalate'} left={<Flag className="h-4 w-4" />}>
                Escalate issue
              </Btn>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition">
          <div className="w-full px-4 md:px-6 lg:px-8 py-2.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="warn">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Trust watch
                </Pill>
                <span className="text-[12px] font-semibold text-slate-600 dark:text-slate-400">
                  Audio complaints are leading negative sentiment this week • 1 suspected review brigade • safeguarding lane healthy across child-facing surfaces
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Btn tone="ghost" onClick={() => safeNav(ROUTES.liveDashboard)} left={<MonitorPlay className="h-4 w-4" />}>
                  Live Dashboard
                </Btn>
                <Btn tone="ghost" onClick={() => safeNav(ROUTES.replaysAndClips)} left={<BarChart3 className="h-4 w-4" />}>
                  Replays & Clips
                </Btn>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-4">
            <Card
              title="Reputation overview"
              subtitle="Ratings, review sentiment, unresolved issues, recurring complaints, and the areas attracting the strongest public response."
              right={
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone="good">Trend intelligence</Pill>
                  <Pill tone="brand">Shared leadership view</Pill>
                </div>
              }
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <ScoreTile
                  label="Average rating"
                  value={averageRating.toFixed(1)}
                  hint="Across institution, events, live, replay, and campaign surfaces."
                  tone="brand"
                />
                <ScoreTile
                  label="Response SLA"
                  value={fmtPercent(responseRate)}
                  hint="Public replies sent within the expected window."
                  tone="good"
                />
                <ScoreTile
                  label="Open trust items"
                  value={String(unresolvedIssueCount)}
                  hint="Combined unresolved reviews and moderation cases."
                  tone="accent"
                />
                <ScoreTile
                  label="Trust score"
                  value={String(trustScore)}
                  hint="Reputation health based on sentiment, response quality, and risk posture."
                  tone="neutral"
                />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Rating trend</div>
                        <div className="mt-1 text-[13px] font-bold text-slate-900 dark:text-slate-100">Public sentiment is rising</div>
                      </div>
                      <Pill tone="good">+0.5 pts</Pill>
                    </div>
                    <div className="mt-3">
                      <MiniSparkline data={sentimentSeries} tone="brand" />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Open issues</div>
                        <div className="mt-1 text-[13px] font-bold text-slate-900 dark:text-slate-100">Queue pressure is stabilizing</div>
                      </div>
                      <Pill tone="warn">7 active</Pill>
                    </div>
                    <div className="mt-3">
                      <MiniSparkline data={openIssueSeries} tone="accent" />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Recovery confidence</div>
                        <div className="mt-1 text-[13px] font-bold text-slate-900 dark:text-slate-100">Highest-impact fixes are clear</div>
                      </div>
                      <Pill tone="brand">92 score</Pill>
                    </div>
                    <div className="mt-3">
                      <MiniSparkline data={recoverySeries} tone="brand" />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Sentiment distribution</div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Positive</div>
                      <div className="mt-2 text-[22px] font-black text-slate-900 dark:text-slate-100">{reviewSentiment.positive}</div>
                    </div>
                    <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Mixed</div>
                      <div className="mt-2 text-[22px] font-black text-slate-900 dark:text-slate-100">{reviewSentiment.mixed}</div>
                    </div>
                    <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Negative</div>
                      <div className="mt-2 text-[22px] font-black text-slate-900 dark:text-slate-100">{reviewSentiment.negative}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Recurring complaints</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {recurringComplaints.map((item) => (
                        <Pill key={item} tone="neutral">
                          {item}
                        </Pill>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
                <div>
                  <div className="mb-2 text-[12px] font-extrabold text-slate-900 dark:text-slate-100">Strongest positive response</div>
                  <SurfaceBarList items={positiveSurfaceBars} accent="brand" />
                </div>
                <div>
                  <div className="mb-2 text-[12px] font-extrabold text-slate-900 dark:text-slate-100">Highest negative pressure</div>
                  <SurfaceBarList items={negativeSurfaceBars} accent="accent" />
                </div>
              </div>
            </Card>

            <Card
              title="Review inbox"
              subtitle="Institution pages, events, live sessions, replays, clips, and campaigns in one queue with filters for rating, topic, urgency, and ownership."
              right={
                <div className="flex flex-wrap gap-2">
                  <Pill tone="warn">{filteredReviews.length} visible</Pill>
                  <Pill tone="neutral">Shared inbox</Pill>
                </div>
              }
            >
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="relative w-full xl:max-w-[320px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search source, topic, owner, or complaint"
                    className="h-11 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-100 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {(['All', 'Institution', 'Live Session', 'Replay', 'Clip', 'Event', 'Campaign'] as const).map((source) => (
                    <button
                      key={source}
                      type="button"
                      onClick={() => setSourceFilter(source)}
                      className={cx(
                        'rounded-2xl px-3 py-2 text-[12px] font-bold transition',
                        sourceFilter === source
                          ? 'text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      )}
                      style={sourceFilter === source ? { background: EV_GREEN } : undefined}
                    >
                      {source}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(['All', 'Technical', 'Pastoral care', 'Moderation', 'Accessibility', 'Giving', 'Experience'] as const).map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setTopicFilter(topic)}
                    className={cx(
                      'rounded-full px-3 py-1.5 text-[12px] font-bold transition',
                      topicFilter === topic
                        ? 'text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-800'
                    )}
                    style={topicFilter === topic ? { background: EV_ORANGE } : undefined}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(['All', 'Awaiting response', 'Draft reply', 'Responded', 'Escalated'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={cx(
                      'rounded-full px-3 py-1.5 text-[12px] font-bold transition',
                      statusFilter === status
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-3">
                {filteredReviews.length ? (
                  filteredReviews.map((review) => (
                    <ReviewRow
                      key={review.id}
                      review={review}
                      active={review.id === selectedReviewId}
                      onSelect={() => setSelectedReviewId(review.id)}
                      onRespond={() => {
                        setSelectedReviewId(review.id);
                        setToast('Review loaded into response composer.');
                      }}
                    />
                  ))
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-6 text-center">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">No reviews match this filter</div>
                    <div className="mt-2 text-[13px] text-slate-500 dark:text-slate-400">Clear one or more filters to reopen the full trust inbox.</div>
                  </div>
                )}
              </div>
            </Card>

            {selectedReview ? (
              <Card
                title="Response composer"
                subtitle="Professional reply workspace with templates, collaboration notes, approval routing, and tone guidance."
                right={
                  <div className="flex flex-wrap gap-2">
                    <Pill tone={selectedReview.status === 'Responded' ? 'good' : selectedReview.urgency === 'Critical' ? 'bad' : 'warn'}>
                      {selectedReview.status}
                    </Pill>
                    <Pill tone="neutral">{selectedReview.sourceType}</Pill>
                  </div>
                }
              >
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[14px] font-extrabold text-slate-900 dark:text-slate-100">{selectedReview.title}</div>
                      <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                        {selectedReview.sourceLabel} · {selectedReview.topic} · Owner: {selectedReview.owner}
                      </div>
                      <div className="mt-3 text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
                        “{selectedReview.excerpt}”
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                        <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Positive signal</div>
                        <div className="mt-2 text-[12px] font-bold text-slate-900 dark:text-slate-100">{selectedReview.positiveSignals[0] || 'No positive signal logged'}</div>
                      </div>
                      <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                        <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Main concern</div>
                        <div className="mt-2 text-[12px] font-bold text-slate-900 dark:text-slate-100">{selectedReview.negativeSignals[0] || 'General service concern'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1.15fr_0.85fr]">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Response templates</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.keys(REVIEW_TEMPLATE_MAP).map((template) => (
                        <button
                          key={template}
                          type="button"
                          onClick={() => handleTemplateApply(template)}
                          className={cx(
                            'rounded-2xl px-3 py-2 text-[12px] font-bold transition',
                            templateKey === template
                              ? 'text-white shadow-sm'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-800'
                          )}
                          style={templateKey === template ? { background: EV_GREEN } : undefined}
                        >
                          {template}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Response body</div>
                    <textarea
                      value={responseBody}
                      onChange={(event) => setResponseBody(event.target.value)}
                      rows={8}
                      className="mt-2 w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 text-sm text-slate-900 dark:text-slate-100 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700"
                    />

                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Collaboration notes</div>
                        <textarea
                          value={collabNotes}
                          onChange={(event) => setCollabNotes(event.target.value)}
                          rows={4}
                          className="mt-2 w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 text-sm text-slate-900 dark:text-slate-100 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700"
                        />
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Approval routing</div>
                          <select
                            value={approvalRoute}
                            onChange={(event) => setApprovalRoute(event.target.value)}
                            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 text-sm text-slate-900 dark:text-slate-100 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700"
                          >
                            <option>Communications lead → Pastoral lead</option>
                            <option>Communications lead only</option>
                            <option>Trust lead → Leadership</option>
                            <option>Finance lead → Communications</option>
                          </select>
                        </div>

                        <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                            <Sparkles className="h-4 w-4" />
                            Tone guidance
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {(['Warm', 'Pastoral', 'Formal', 'Firm'] as const).map((tone) => (
                              <button
                                key={tone}
                                type="button"
                                onClick={() => setResponseTone(tone)}
                                className={cx(
                                  'rounded-full px-3 py-1.5 text-[12px] font-bold transition',
                                  responseTone === tone
                                    ? 'text-white shadow-sm'
                                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-800'
                                )}
                                style={responseTone === tone ? { background: EV_ORANGE } : undefined}
                              >
                                {tone}
                              </button>
                            ))}
                          </div>
                          <div className="mt-3 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">
                            {TONE_GUIDANCE[responseTone]}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Btn tone="neutral" onClick={() => setToast('Draft saved to internal collaboration thread.')} left={<FileText className="h-4 w-4" />}>
                        Save draft
                      </Btn>
                      <Btn tone="ghost" onClick={() => setPreviewOpen(true)} left={<Eye className="h-4 w-4" />}>
                        Preview public response
                      </Btn>
                      <Btn tone="primary" onClick={handleSendResponse} loading={pendingAction === 'respond'} left={<Send className="h-4 w-4" />}>
                        Respond to review
                      </Btn>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Response readiness</div>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between rounded-2xl bg-white dark:bg-slate-900 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-800">
                          <span className="text-[12px] text-slate-600 dark:text-slate-400">Acknowledges concern clearly</span>
                          <Pill tone="good">Clear</Pill>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl bg-white dark:bg-slate-900 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-800">
                          <span className="text-[12px] text-slate-600 dark:text-slate-400">Explains next operational step</span>
                          <Pill tone="good">Ready</Pill>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl bg-white dark:bg-slate-900 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-800">
                          <span className="text-[12px] text-slate-600 dark:text-slate-400">Tone matches issue level</span>
                          <Pill tone="accent">{responseTone}</Pill>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl bg-white dark:bg-slate-900 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-800">
                          <span className="text-[12px] text-slate-600 dark:text-slate-400">Approval chain attached</span>
                          <Pill tone="good">Attached</Pill>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Public surface effects</div>
                      <div className="mt-3 space-y-2 text-[12px] text-slate-600 dark:text-slate-400">
                        <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">Institution and replay ratings stay contextualized when a public response is attached.</div>
                        <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">The same response can inform operational follow-up in Live Dashboard and replay notes.</div>
                        <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">Explainable language is preserved in the evidence trail for future rulings.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : null}

            <Card
              title="Moderation case queue"
              subtitle="Reported chat messages, flagged clips, review abuse, account incidents, and pending appeals in one operational trust queue."
              right={
                <div className="flex flex-wrap gap-2">
                  <Pill tone="accent">Explainable actions</Pill>
                  <Pill tone="good">Evidence attached</Pill>
                </div>
              }
            >
              <div className="space-y-3">
                {cases.map((kase) => (
                  <CaseRow
                    key={kase.id}
                    kase={kase}
                    active={kase.id === selectedCaseId}
                    onSelect={() => {
                      setSelectedCaseId(kase.id);
                      setEvidenceOpen(true);
                    }}
                    onResolve={() => {
                      setSelectedCaseId(kase.id);
                      handleResolveCase();
                    }}
                    onEscalate={() => {
                      setSelectedCaseId(kase.id);
                      handleEscalateCase();
                    }}
                  />
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-4">
            {selectedReview ? (
              <Card
                title="Preview lab"
                subtitle="How public review responses and trust messaging appear across desktop and mobile companion surfaces."
                right={<Pill tone="brand">World-class preview</Pill>}
              >
                <div className="flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800 p-1">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('desktop')}
                    className={cx(
                      'flex-1 rounded-xl px-3 py-2 text-[12px] font-bold transition',
                      previewMode === 'desktop'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400'
                    )}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('mobile')}
                    className={cx(
                      'flex-1 rounded-xl px-3 py-2 text-[12px] font-bold transition',
                      previewMode === 'mobile'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400'
                    )}
                  >
                    Mobile
                  </button>
                </div>

                <div className="mt-4">
                  <PreviewCanvas review={selectedReview} responseText={responseBody} device={previewMode} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Btn tone="ghost" onClick={() => setPreviewOpen(true)} left={<MonitorPlay className="h-4 w-4" />}>
                    Open full preview
                  </Btn>
                  <Btn
                    tone="neutral"
                    onClick={async () => {
                      const ok = await copyText(`https://faithhub.app/trust/${selectedReview.id}`);
                      setToast(ok ? 'Preview link copied.' : 'Copy not available on this device.');
                    }}
                    left={<Copy className="h-4 w-4" />}
                  >
                    Copy preview link
                  </Btn>
                </div>
              </Card>
            ) : null}

            <Card
              title="Risk & pattern signals"
              subtitle="Brigading, coordinated abuse, spam bursts, recurring toxic users, technical complaint clusters, and child-safe concerns."
              right={<Pill tone="warn">Live pattern watch</Pill>}
            >
              <div className="space-y-3">
                {riskSignalsSeed.map((signal) => (
                  <div key={signal.title} className="rounded-3xl bg-slate-50 dark:bg-slate-950 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100">{signal.title}</div>
                        <div className="mt-1 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">{signal.detail}</div>
                      </div>
                      <Pill tone={signal.tone}>{signal.trendLabel}</Pill>
                    </div>
                    <div className="mt-3 text-[12px] font-bold" style={{ color: signal.tone === 'accent' ? EV_ORANGE : signal.tone === 'brand' ? EV_GREEN : undefined }}>
                      {signal.value}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title="Policy & safeguard panel"
              subtitle="Active moderation rules, institution-specific guidance, team assignments, and quick links to child-facing safety defaults."
              right={<Pill tone="good">Safeguards synced</Pill>}
            >
              <div className="space-y-3">
                {policySeed.map((policy) => (
                  <div key={policy.title} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100">{policy.title}</div>
                        <div className="mt-1 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">{policy.detail}</div>
                      </div>
                      <Pill tone={policy.state === 'Active' ? 'good' : policy.state === 'Locked' ? 'brand' : 'warn'}>
                        {policy.state}
                      </Pill>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {selectedCase ? (
              <Card
                title="Evidence & action drawer"
                subtitle="Screenshots, linked messages, previous rulings, audit notes, and action history for the selected trust case."
                right={<Pill tone={selectedCase.childSafe ? 'bad' : 'neutral'}>{selectedCase.id}</Pill>}
              >
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100">{selectedCase.title}</div>
                  <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">{selectedCase.sourceLabel}</div>
                  <div className="mt-3 text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">{selectedCase.summary}</div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="text-slate-400 uppercase tracking-[0.16em]">Evidence</div>
                      <div className="mt-1 text-[18px] font-black text-slate-900 dark:text-slate-100">{selectedCase.evidenceCount}</div>
                    </div>
                    <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="text-slate-400 uppercase tracking-[0.16em]">Prior rulings</div>
                      <div className="mt-1 text-[18px] font-black text-slate-900 dark:text-slate-100">{selectedCase.priorRulings}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Latest action history</div>
                    <div className="mt-2 space-y-2">
                      {selectedCase.actionHistory.slice(0, 3).map((entry) => (
                        <div key={entry} className="rounded-2xl bg-white dark:bg-slate-900 p-3 text-[12px] text-slate-600 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-800">
                          {entry}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Btn tone="neutral" onClick={() => setEvidenceOpen(true)} left={<Layers className="h-4 w-4" />}>
                    Open evidence drawer
                  </Btn>
                  <Btn tone="accent" onClick={handleEscalateCase} loading={pendingAction === 'escalate'} left={<Flag className="h-4 w-4" />}>
                    Escalate from drawer
                  </Btn>
                </div>
              </Card>
            ) : null}

            <Card
              title="Reputation recovery insights"
              subtitle="The highest-impact operational fixes, content improvements, and response priorities based on recent sentiment trends."
              right={<Pill tone="brand">Recovery planner</Pill>}
            >
              <div className="space-y-3">
                {recoveryInsightsSeed.map((insight) => (
                  <div key={insight.title} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100">{insight.title}</div>
                        <div className="mt-1 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">{insight.detail}</div>
                      </div>
                      <Pill tone={insight.impact === 'High' ? 'accent' : 'good'}>{insight.impact} impact</Pill>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Btn
                        tone="ghost"
                        onClick={() => {
                          if (insight.nextAction === 'Open Live Dashboard') safeNav(ROUTES.liveDashboard);
                          else if (insight.nextAction === 'Open Replays & Clips') safeNav(ROUTES.replaysAndClips);
                          else setToast(`${insight.nextAction} opened.`);
                        }}
                        left={<ChevronRight className="h-4 w-4" />}
                      >
                        {insight.nextAction}
                      </Btn>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {selectedReview ? (
        <Modal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          title="Public trust preview"
          subtitle="Preview how review responses and trust messaging appear across desktop and mobile surfaces."
          right={<Pill tone="brand">Review + response mirror</Pill>}
        >
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <div className="mb-3 text-sm font-extrabold text-slate-900 dark:text-slate-100">Desktop surface</div>
              <PreviewCanvas review={selectedReview} responseText={responseBody} device="desktop" />
            </div>
            <div>
              <div className="mb-3 text-sm font-extrabold text-slate-900 dark:text-slate-100">Mobile companion</div>
              <PreviewCanvas review={selectedReview} responseText={responseBody} device="mobile" />
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-slate-50 dark:bg-slate-950 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
            <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Preview intelligence</div>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Response clarity</div>
                <div className="mt-2 text-[18px] font-black text-slate-900 dark:text-slate-100">Strong</div>
              </div>
              <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Tone guidance</div>
                <div className="mt-2 text-[18px] font-black text-slate-900 dark:text-slate-100">{responseTone}</div>
              </div>
              <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Approval route</div>
                <div className="mt-2 text-[13px] font-black text-slate-900 dark:text-slate-100">{approvalRoute}</div>
              </div>
            </div>
          </div>
        </Modal>
      ) : null}

      {selectedCase ? (
        <Modal
          open={evidenceOpen}
          onClose={() => setEvidenceOpen(false)}
          title={`Evidence & action drawer — ${selectedCase.id}`}
          subtitle="Screenshots, linked messages, prior rulings, audit notes, and explainable action history for the selected moderation case."
          right={<Pill tone={selectedCase.childSafe ? 'bad' : 'accent'}>{selectedCase.status}</Pill>}
        >
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{selectedCase.title}</div>
                <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">{selectedCase.sourceLabel} · Owner: {selectedCase.owner}</div>
                <div className="mt-3 text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">{selectedCase.summary}</div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Pill tone="neutral">{selectedCase.patternTag}</Pill>
                  <Pill tone={selectedCase.urgency === 'Critical' ? 'bad' : selectedCase.urgency === 'High' ? 'accent' : 'warn'}>
                    {selectedCase.urgency}
                  </Pill>
                  {selectedCase.childSafe ? <Pill tone="bad">Child-safe lane</Pill> : null}
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Evidence bundle</div>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {selectedCase.evidence.map((item) => (
                    <div key={item} className="rounded-2xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 h-10 w-10 shrink-0 rounded-2xl grid place-items-center text-white" style={{ background: EV_ORANGE }}>
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-[13px] font-bold text-slate-900 dark:text-slate-100">{item}</div>
                          <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">Evidence preserved for explainable moderation and future appeals.</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Action history</div>
                <div className="mt-3 space-y-3">
                  {selectedCase.actionHistory.map((entry) => (
                    <div key={entry} className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 h-8 w-8 shrink-0 rounded-2xl grid place-items-center text-white" style={{ background: EV_GREEN }}>
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">{entry}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Prior rulings and fairness</div>
                <div className="mt-3 text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
                  This case inherits {selectedCase.priorRulings} prior rulings from related moderation incidents. Use them for consistency, but keep this decision grounded in the attached evidence and current context.
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Linked rulings</div>
                    <div className="mt-1 text-[18px] font-black text-slate-900 dark:text-slate-100">{selectedCase.priorRulings}</div>
                  </div>
                  <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Evidence items</div>
                    <div className="mt-1 text-[18px] font-black text-slate-900 dark:text-slate-100">{selectedCase.evidenceCount}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 p-4 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Recommended next step</div>
                <div className="mt-3 text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {selectedCase.childSafe
                    ? 'Keep the case in safeguarding hold, preserve the evidence bundle, and avoid a public-facing reply until protected-lane checks are complete.'
                    : selectedCase.type === 'Review abuse'
                      ? 'Continue the brigade audit, suppress suspicious ratings from the public average, and issue a contextual trust note if manipulation is confirmed.'
                      : 'Resolve the case with an explainable action note and feed the learning back into live operations and audience guidance.'}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Btn tone="primary" onClick={handleResolveCase} loading={pendingAction === 'resolve'} left={<CheckCircle2 className="h-4 w-4" />}>
                    Resolve case
                  </Btn>
                  <Btn tone="accent" onClick={handleEscalateCase} loading={pendingAction === 'escalate'} left={<Flag className="h-4 w-4" />}>
                    Escalate issue
                  </Btn>
                  <Btn tone="ghost" onClick={() => setToast('Audit note copied to leadership thread.')} left={<Copy className="h-4 w-4" />}>
                    Copy audit note
                  </Btn>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      ) : null}

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-[120] -translate-x-1/2">
          <div className="rounded-full bg-slate-900 text-white px-4 py-2 text-xs font-bold shadow-2xl">
            {toast}
          </div>
        </div>
      ) : null}
    </div>
  );
}
