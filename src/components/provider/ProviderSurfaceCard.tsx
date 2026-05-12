import type { ReactNode } from "react";

type ProviderSurfaceCardProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
  className?: string;
  headerClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  bodyClassName?: string;
  rightClassName?: string;
};

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

export function ProviderSurfaceCard({
  title,
  subtitle,
  right,
  children,
  className,
  headerClassName,
  titleClassName,
  subtitleClassName,
  bodyClassName,
  rightClassName,
}: ProviderSurfaceCardProps) {
  return (
    <div
      className={cx(
        "fh-uplift-surface rounded-[28px] p-4 shadow-soft transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-5",
        className,
      )}
    >
      {(title || subtitle || right) && (
        <div className={cx("flex flex-wrap items-start justify-between gap-3", headerClassName)}>
          <div className="min-w-0">
            {title ? (
              <div className={cx("break-words text-[15px] font-semibold text-faith-ink dark:text-slate-100", titleClassName)}>
                {title}
              </div>
            ) : null}
            {subtitle ? (
              <div className={cx("mt-1 break-words text-[12px] leading-5 text-faith-slate", subtitleClassName)}>{subtitle}</div>
            ) : null}
          </div>
          {right ? <div className={cx("w-full sm:w-auto sm:shrink-0", rightClassName)}>{right}</div> : null}
        </div>
      )}
      {children ? <div className={cx("mt-4 min-w-0", bodyClassName)}>{children}</div> : null}
    </div>
  );
}
