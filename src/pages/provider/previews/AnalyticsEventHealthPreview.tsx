import { useMemo } from 'react';
import { Activity, BarChart3, Trash2 } from 'lucide-react';

type DashboardAuditEntry = {
  id: string;
  itemId: string;
  action: string;
  status: string;
  message: string;
  atISO: string;
};

function readDashboardAudit(): DashboardAuditEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem('fh.dashboard.actionAudit.v1');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as DashboardAuditEntry[]) : [];
  } catch {
    return [];
  }
}

function readDataLayerEvents(): Array<Record<string, unknown>> {
  if (typeof window === 'undefined') return [];
  const dataLayer = (window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer;
  return Array.isArray(dataLayer) ? dataLayer : [];
}

export default function AnalyticsEventHealthPreview() {
  const auditEntries = readDashboardAudit();
  const dataLayerEvents = readDataLayerEvents();

  const eventSummary = useMemo(() => {
    const counts = new Map<string, number>();
    dataLayerEvents.forEach((event) => {
      const name = typeof event.event === 'string' ? event.event : 'unknown';
      counts.set(name, (counts.get(name) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([event, count]) => ({ event, count }))
      .sort((a, b) => b.count - a.count);
  }, [dataLayerEvents]);

  const clearLocalMetrics = () => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem('fh.dashboard.actionAudit.v1');
    window.location.reload();
  };

  return (
    <div className="fh-brand-shell min-h-full bg-[var(--fh-page-bg)] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="fh-brand-hero rounded-3xl p-6 sm:p-8">
          <div className="fh-brand-badge px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]">
            <BarChart3 className="h-3.5 w-3.5" />
            Analytics QA
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-faith-ink">Event health preview</h1>
          <p className="mt-3 text-sm leading-7 text-faith-slate">
            Quick instrumentation check for local analytics events and dashboard action logs.
          </p>
          <button type="button" onClick={clearLocalMetrics} className="ds-btn ds-btn--outline fh-interactive mt-4 rounded-xl px-4">
            <Trash2 className="h-4 w-4" />
            Clear local event logs
          </button>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <article className="ds-card p-5">
            <div className="text-xs font-black uppercase tracking-[0.14em] text-faith-slate">DataLayer events</div>
            <div className="mt-2 text-3xl font-black text-faith-ink">{dataLayerEvents.length}</div>
          </article>
          <article className="ds-card p-5">
            <div className="text-xs font-black uppercase tracking-[0.14em] text-faith-slate">Dashboard action logs</div>
            <div className="mt-2 text-3xl font-black text-faith-ink">{auditEntries.length}</div>
          </article>
        </section>

        <section className="ds-card p-5">
          <h2 className="text-lg font-black tracking-tight text-faith-ink">Top events</h2>
          {eventSummary.length === 0 ? (
            <p className="mt-2 text-sm text-faith-slate">No events captured yet in this session.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {eventSummary.slice(0, 12).map((entry) => (
                <li key={entry.event} className="flex items-center justify-between rounded-xl border border-faith-line/70 bg-[var(--fh-surface)] px-3 py-2">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-faith-ink">
                    <Activity className="h-4 w-4 text-[var(--fh-brand)]" />
                    {entry.event}
                  </div>
                  <div className="text-xs font-black text-faith-slate">{entry.count}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}


