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
      <div className="mx-auto w-full max-w-[1600px] px-4 py-4 sm:px-5 sm:py-5 md:px-6 lg:px-8">
        <section className="rounded-[34px] border border-faith-line/70 bg-[var(--fh-surface-bg)] p-4 shadow-soft md:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <ProviderPageTitle icon={icon} title={title} subtitle={subtitle} />
              {tags ? <div className="mt-3 flex flex-wrap gap-2">{tags}</div> : null}
            </div>
            {actions ? <div className="flex flex-wrap items-center gap-2 xl:justify-end">{actions}</div> : null}
          </div>
        </section>
        {pulse ? (
          <section className="mt-4 rounded-[28px] border border-faith-line/70 bg-[var(--fh-surface-bg)] px-4 py-3 shadow-soft">
            {pulse}
          </section>
        ) : null}
        {stats ? <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{stats}</section> : null}
        <section className="mt-4 space-y-4">{children}</section>
      </div>
    </div>
  );
}

