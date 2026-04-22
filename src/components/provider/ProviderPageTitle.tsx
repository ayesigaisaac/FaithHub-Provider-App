import type { ReactNode } from 'react';

type ProviderPageTitleProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  className?: string;
  iconClassName?: string;
};

const cx = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(' ');

export function ProviderPageTitle({
  icon,
  title,
  subtitle,
  className,
  iconClassName,
}: ProviderPageTitleProps) {
  return (
    <div className={cx('flex min-w-0 items-start gap-4', className)}>
      <div
        className={cx('grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand text-white shadow-soft', iconClassName)}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <h1 className="font-sans text-2xl font-extrabold leading-[1.04] tracking-[-0.03em] text-faith-ink sm:text-3xl lg:text-[var(--fh-font-size-3xl)]">
          {title}
        </h1>
        <p className="mt-1.5 font-sans text-sm leading-6 text-faith-slate">{subtitle}</p>
      </div>
    </div>
  );
}
