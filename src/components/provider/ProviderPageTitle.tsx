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
        className={cx(
          'grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-500 text-white shadow-sm',
          iconClassName
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <h1 className="font-sans text-[28px] font-black leading-[1.04] tracking-[-0.03em] text-slate-900 dark:text-slate-100 sm:text-[34px] lg:text-[40px]">
          {title}
        </h1>
        <p className="mt-1.5 font-sans text-[14px] leading-6 text-slate-600 dark:text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

