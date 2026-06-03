import { ArrowRight, BarChart3, CalendarClock, CreditCard, Sparkles, Users } from 'lucide-react';
import { AppLayout } from '@/layout/AppLayout';

type AlertBadge = {
  label: string;
  tone: 'info' | 'success' | 'warning';
};

type OverviewCard = {
  title: string;
  value: string;
  detail: string;
  icon: JSX.Element;
};

type PipelineCard = {
  title: string;
  caption: string;
  metric: string;
};

const alerts: AlertBadge[] = [
  { label: '3 reviews pending', tone: 'warning' },
  { label: 'Payments synced', tone: 'success' },
  { label: 'Daily digest ready', tone: 'info' },
];

const overviewCards: OverviewCard[] = [
  {
    title: 'Active Members',
    value: '18,420',
    detail: '+6.2% vs last month',
    icon: <Users className="h-5 w-5 text-[var(--fh-brand)]" />,
  },
  {
    title: 'Scheduled Sessions',
    value: '27',
    detail: '8 happening this week',
    icon: <CalendarClock className="h-5 w-5 text-[var(--fh-brand)]" />,
  },
  {
    title: 'Monthly Revenue',
    value: '$42,900',
    detail: 'Projected +12% trend',
    icon: <CreditCard className="h-5 w-5 text-[var(--fh-brand)]" />,
  },
  {
    title: 'Engagement Score',
    value: '91%',
    detail: 'High performer cohort',
    icon: <BarChart3 className="h-5 w-5 text-[var(--fh-brand)]" />,
  },
];

const pipelineCards: PipelineCard[] = [
  {
    title: 'Content Pipeline',
    caption: 'Drafts, edits, and approvals',
    metric: '14 assets in progress',
  },
  {
    title: 'Audience Health',
    caption: 'Retention and participation',
    metric: '83% weekly return',
  },
  {
    title: 'Growth Campaigns',
    caption: 'Current active experiments',
    metric: '5 campaigns live',
  },
];

const badgeToneClass: Record<AlertBadge['tone'], string> = {
  info: 'border-[var(--fh-line)] bg-[var(--fh-surface)] text-[var(--fh-ink)]',
  success: 'border-[var(--fh-brand)] bg-[var(--fh-brand-soft)] text-[var(--fh-brand)]',
  warning: 'border-[var(--fh-line)] bg-[var(--fh-ev-light-grey)] text-[var(--fh-ev-medium-grey)]',
};

function DashboardHeader() {
  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-[var(--fh-line)] bg-[var(--fh-surface)] p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--fh-ink)]">Overview Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--fh-slate)]">
          Monitor performance, content delivery, and revenue in one streamlined workspace.
        </p>
      </div>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-xl bg-[var(--fh-brand)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--fh-brand)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fh-brand)] focus-visible:ring-offset-2"
      >
        <Sparkles className="h-4 w-4" />
        Create Report
      </button>
    </header>
  );
}

function AlertsRow() {
  return (
    <section className="flex flex-wrap items-center gap-3" aria-label="Status alerts" aria-live="polite">
      {alerts.map((alert) => (
        <span
          key={alert.label}
          className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${badgeToneClass[alert.tone]}`}
        >
          {alert.label}
        </span>
      ))}
    </section>
  );
}

function OverviewGrid() {
  return (
    <section className="grid gap-6 md:grid-cols-2 2xl:grid-cols-4" aria-label="Overview metrics">
      {overviewCards.map((card) => (
        <article
          key={card.title}
          className="rounded-2xl border border-[var(--fh-line)] bg-[var(--fh-surface)] p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[var(--fh-slate)]">{card.title}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--fh-ink)]">{card.value}</p>
              <p className="mt-1 text-sm text-[var(--fh-slate)]">{card.detail}</p>
            </div>
            <span className="rounded-xl bg-[var(--fh-brand-soft)] p-2.5">{card.icon}</span>
          </div>
        </article>
      ))}
    </section>
  );
}

function PipelineGrid() {
  return (
    <section className="grid gap-6 xl:grid-cols-3" aria-label="Operational pipeline cards">
      {pipelineCards.map((card) => (
        <article
          key={card.title}
          className="rounded-2xl border border-[var(--fh-line)] bg-[var(--fh-surface)] p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]"
        >
          <p className="text-sm font-medium text-[var(--fh-slate)]">{card.caption}</p>
          <h2 className="mt-2 text-lg font-semibold text-[var(--fh-ink)]">{card.title}</h2>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--fh-ink)]">{card.metric}</p>
          <button
            type="button"
            className="mt-5 inline-flex items-center gap-1 rounded-lg text-sm font-medium text-[var(--fh-brand)] hover:text-[var(--fh-brand)]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fh-brand)] focus-visible:ring-offset-2"
          >
            View details
            <ArrowRight className="h-4 w-4" />
          </button>
        </article>
      ))}
    </section>
  );
}

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <DashboardHeader />
        <AlertsRow />
        <OverviewGrid />
        <PipelineGrid />
      </div>
    </AppLayout>
  );
}
