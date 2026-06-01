import { CalendarCheck2, CheckCircle2, Clock3, Sparkles } from 'lucide-react';
import { ProviderPageScaffold } from '@/components/provider/ProviderPageScaffold';
import { ProviderSurfaceCard } from '@/components/provider/ProviderSurfaceCard';
import { ProviderStatusPill } from '@/components/provider/ProviderStatusPill';

const planningSteps = [
  {
    title: 'Map weekly themes',
    detail: 'Define teaching themes, anchor scriptures, and intended audience outcomes.',
    status: 'Done',
  },
  {
    title: 'Assign owners',
    detail: 'Set owners for notes, media assets, live segments, and post-live packaging.',
    status: 'In Progress',
  },
  {
    title: 'Publish execution plan',
    detail: 'Confirm timelines and handoff points for production, comms, and moderation.',
    status: 'Pending',
  },
] as const;

function statusTone(status: (typeof planningSteps)[number]['status']) {
  if (status === 'Done') return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (status === 'In Progress') return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-slate-700 bg-slate-100 border-slate-200';
}

export default function FHP130ContentPlanner() {
  return (
    <ProviderPageScaffold
      icon={<CalendarCheck2 className="h-6 w-6" />}
      title="Content Planner"
      subtitle="Plan teaching themes, assign owners, and track readiness for each publishing cycle."
      tags={
        <>
          <ProviderStatusPill tone="navy">Planning</ProviderStatusPill>
          <ProviderStatusPill tone="good">Execution</ProviderStatusPill>
          <ProviderStatusPill tone="brand">Review</ProviderStatusPill>
        </>
      }
      pulse={
        <div className="flex flex-wrap items-center gap-3 text-[12px] text-faith-slate">
          <ProviderStatusPill tone="orange">PLANNING PULSE</ProviderStatusPill>
          <span>12 cycles planned this quarter</span>
          <span>7 pending tasks</span>
          <span>84% readiness confidence</span>
        </div>
      }
      stats={
        <>
          <ProviderSurfaceCard title="Cycles planned" bodyClassName="pt-3">
            <div className="text-2xl font-black">12</div>
            <div className="mt-1 text-sm text-faith-slate">Published + draft cycles this quarter.</div>
          </ProviderSurfaceCard>
          <ProviderSurfaceCard title="Pending tasks" bodyClassName="pt-3">
            <div className="text-2xl font-black">7</div>
            <div className="mt-1 text-sm text-faith-slate">Cross-team actions awaiting owner confirmation.</div>
          </ProviderSurfaceCard>
          <ProviderSurfaceCard title="Readiness score" bodyClassName="pt-3">
            <div className="text-2xl font-black">84%</div>
            <div className="mt-1 text-sm text-faith-slate">Weighted confidence across active content plans.</div>
          </ProviderSurfaceCard>
        </>
      }
    >

        <ProviderSurfaceCard className="mt-4" title="Execution Checklist" subtitle="Core flow to move from planning to publish.">
          <div className="space-y-3">
            {planningSteps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-black text-faith-ink">{index + 1}. {step.title}</div>
                    <div className="mt-1 text-sm text-faith-slate">{step.detail}</div>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-[11px] font-bold ${statusTone(step.status)}`}>
                    {step.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ProviderSurfaceCard>

        <ProviderSurfaceCard
          className="mt-4"
          title="Quick Signals"
          subtitle="Simple, high-signal indicators for weekly planning conversations."
        >
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-4 text-sm">
              <div className="inline-flex items-center gap-2 font-bold"><Clock3 className="h-4 w-4" /> Next milestone</div>
              <div className="mt-2 text-faith-slate">Outline lock due Tuesday, 10:00 AM.</div>
            </div>
            <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-4 text-sm">
              <div className="inline-flex items-center gap-2 font-bold"><CheckCircle2 className="h-4 w-4" /> Latest checkpoint</div>
              <div className="mt-2 text-faith-slate">Asset list approved for Series Week 3.</div>
            </div>
            <div className="rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-4 text-sm">
              <div className="inline-flex items-center gap-2 font-bold"><Sparkles className="h-4 w-4" /> Recommended next step</div>
              <div className="mt-2 text-faith-slate">Publish owner handoff notes for media + moderation.</div>
            </div>
          </div>
        </ProviderSurfaceCard>
    </ProviderPageScaffold>
  );
}


