import { Sparkles, MousePointer2, ShieldCheck, Layers3 } from 'lucide-react';
import { KpiTile } from '@/components/ui/KpiTile';

export default function DesignSystemShowcase() {
  return (
    <div className="fh-brand-shell min-h-full bg-[var(--fh-page-bg)] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="fh-brand-hero rounded-3xl p-6 sm:p-8">
          <div className="fh-brand-badge px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]">
            <Sparkles className="h-3.5 w-3.5" />
            FaithHub Design System
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-faith-ink sm:text-4xl">
            Modern faith-tech UI reference
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-faith-slate sm:text-base">
            This page is the visual QA reference for typography, spacing, cards, interactions, and action hierarchy.
            Use it when shipping new UI to keep consistency and premium polish.
          </p>
        </section>

        <section className="ds-card p-5 sm:p-6">
          <h2 className="text-xl font-black tracking-tight text-faith-ink">Buttons and Interaction States</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className="ds-btn ds-btn--primary fh-interactive rounded-xl px-5">
              Primary Action
            </button>
            <button type="button" className="ds-btn ds-btn--secondary fh-interactive rounded-xl px-5">
              Secondary Action
            </button>
            <button type="button" className="ds-btn ds-btn--outline fh-interactive rounded-xl px-5">
              Outline Action
            </button>
            <button type="button" disabled className="ds-btn ds-btn--primary rounded-xl px-5">
              Disabled
            </button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiTile label="Followers" value="28.4K" hint="Monthly net growth" tone="navy" />
          <KpiTile label="Live now" value="7" hint="Active or starting soon" tone="good" />
          <KpiTile label="Engagement" value="+12.8%" hint="Comments + reactions" tone="info" />
          <KpiTile label="Needs review" value="5" hint="Pending moderation items" tone="warn" />
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="ds-card fh-interactive p-5">
            <div className="ds-icon">
              <MousePointer2 className="h-4 w-4" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-faith-ink">Micro-interactions</h3>
            <p className="mt-2 text-sm leading-6 text-faith-slate">
              Hover lift and smooth transitions communicate responsiveness and quality.
            </p>
          </article>
          <article className="ds-card fh-interactive p-5">
            <div className="ds-icon">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-faith-ink">Trust-first focus</h3>
            <p className="mt-2 text-sm leading-6 text-faith-slate">
              Focus rings and contrast are tuned for accessibility in ministry-critical workflows.
            </p>
          </article>
          <article className="ds-card fh-interactive p-5">
            <div className="ds-icon">
              <Layers3 className="h-4 w-4" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-faith-ink">Surface hierarchy</h3>
            <p className="mt-2 text-sm leading-6 text-faith-slate">
              Use card elevation intentionally: primary decisions first, supporting context second.
            </p>
          </article>
        </section>
      </div>
    </div>
  );
}


