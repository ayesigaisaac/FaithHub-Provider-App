import type { ReactNode } from "react";

type SecondaryStat = {
  label: string;
  value: ReactNode;
};

interface CompactStatsGroupProps {
  primaryValue: ReactNode;
  primaryLabel: string;
  primaryMeta?: ReactNode;
  secondary: SecondaryStat[];
  progressLabel?: string;
  progressValue?: number;
  className?: string;
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function CompactStatsGroup({
  primaryValue,
  primaryLabel,
  primaryMeta,
  secondary,
  progressLabel,
  progressValue,
  className,
}: CompactStatsGroupProps) {
  const clampedProgress = Math.max(0, Math.min(100, progressValue ?? 0));

  return (
    <section
      className={cx(
        "rounded-2xl border border-faith-line/70 bg-[var(--fh-surface)] p-3.5 dark:border-slate-800 dark:bg-slate-950",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faith-slate whitespace-normal break-words [overflow-wrap:anywhere]">
            {primaryLabel}
          </p>
          <p className="mt-1 text-[clamp(1.2rem,2.2vw,1.9rem)] font-black leading-tight tracking-[-0.02em] text-faith-ink dark:text-slate-100 whitespace-normal break-words [overflow-wrap:anywhere]">
            {primaryValue}
          </p>
        </div>
        {primaryMeta ? (
          <p className="max-w-full rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 whitespace-normal break-words [overflow-wrap:anywhere]">
            {primaryMeta}
          </p>
        ) : null}
      </div>

      <div className="mt-3 divide-y divide-faith-line/70 rounded-xl border border-faith-line/60 dark:divide-slate-800 dark:border-slate-800">
        {secondary.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3 px-3 py-2.5">
            <span className="min-w-0 text-[12px] text-faith-slate whitespace-normal break-words [overflow-wrap:anywhere]">{item.label}</span>
            <span className="text-right text-[15px] font-semibold tabular-nums text-faith-ink dark:text-slate-100 whitespace-normal break-words [overflow-wrap:anywhere]">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {progressValue !== undefined ? (
        <div className="mt-3">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-faith-slate">
            <span>{progressLabel || "Progress"}</span>
            <span>{clampedProgress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-[var(--fh-brand)]"
              style={{ width: `${Math.max(4, clampedProgress)}%` }}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
