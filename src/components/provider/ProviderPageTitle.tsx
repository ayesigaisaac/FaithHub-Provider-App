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
    <div className={cx('flex min-w-0 items-start gap-3.5 sm:gap-4', className)}>
      <div
        className={cx('ds-icon h-11 w-11 shrink-0 text-[var(--fh-brand-dark)] sm:h-12 sm:w-12', iconClassName)}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <h1 className="font-sans text-2xl font-extrabold leading-[1.04] tracking-[-0.03em] text-faith-ink sm:text-3xl lg:text-[var(--fh-font-size-3xl)]">
          {title}
        </h1>
        <p className="mt-1 font-sans text-[13px] leading-6 text-faith-slate sm:mt-1.5 sm:text-sm">{subtitle}</p>
      </div>
    </div>
  );
}
