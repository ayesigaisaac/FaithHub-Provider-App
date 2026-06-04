import type { ReactNode } from 'react';
import { ProviderPageTitle } from './ProviderPageTitle';

type ProviderPageScaffoldProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  actions?: ReactNode;
  tags?: ReactNode;
  pulse?: ReactNode;
  stats?: ReactNode;
  children: ReactNode;
};

export function ProviderPageScaffold({
  icon,
  title,
  subtitle,
  actions,
  tags,
  pulse,
  stats,
  children,
}: ProviderPageScaffoldProps) {
  return (
    <div className="min-h-full bg-[var(--fh-page-bg)] text-faith-ink">
      <div className="mx-auto w-full max-w-[1480px] px-4 py-4 sm:px-5 sm:py-5 md:px-6 lg:px-8">
        <section className="rounded-[34px] border border-faith-line/70 bg-[var(--fh-surface-bg)] p-4 shadow-soft md:p-5">
          <div className="rounded-[28px] border border-faith-line/50 bg-gradient-to-br from-white via-[var(--fh-surface-bg)] to-[var(--fh-surface)] p-4 md:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                  FaithHub Provider journey
                </div>
                <ProviderPageTitle icon={icon} title={title} subtitle={subtitle} />
                {tags ? <div className="mt-3 flex flex-wrap gap-2">{tags}</div> : null}
              </div>
              {actions ? <div className="flex flex-wrap items-center gap-2 xl:justify-end">{actions}</div> : null}
            </div>
          </div>
        </section>
        {pulse ? (
          <section className="mt-4 rounded-[28px] border border-faith-line/70 bg-gradient-to-r from-emerald-50 via-[var(--fh-surface-bg)] to-[var(--fh-surface)] px-4 py-3 shadow-soft">
            {pulse}
          </section>
        ) : null}
        {stats ? <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&>*]:min-w-0">{stats}</section> : null}
        <section className="mt-4 min-w-0 space-y-4">{children}</section>
      </div>
    </div>
  );
}
