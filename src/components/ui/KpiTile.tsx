import type { ReactNode } from "react";

export type KpiTileTone =
  | "green"
  | "orange"
  | "navy"
  | "red"
  | "gray"
  | "neutral"
  | "info"
  | "good"
  | "warn"
  | "danger";

type ResolvedTone = "green" | "orange" | "navy" | "red" | "gray" | "sky";

const TONE_ALIAS: Record<KpiTileTone, ResolvedTone> = {
  green: "green",
  good: "green",
  orange: "orange",
  warn: "orange",
  navy: "navy",
  red: "red",
  danger: "red",
  gray: "gray",
  neutral: "gray",
  info: "sky",
};

interface KpiTileProps {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  footer?: ReactNode;
  tone?: KpiTileTone;
  size?: "compact" | "standard" | "tall";
  className?: string;
  indicator?: "panel" | "dot" | "none";
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function KpiTile({
  label,
  value,
  hint,
  footer,
  tone = "green",
  size = "standard",
  className,
  indicator = "panel",
}: KpiTileProps) {
  const resolved = TONE_ALIAS[tone];

  const borderTone =
    resolved === "green"
      ? "border-emerald-200/80"
      : resolved === "orange"
        ? "border-amber-200/80"
        : resolved === "red"
          ? "border-rose-200/80"
          : resolved === "navy"
            ? "border-slate-300"
            : resolved === "sky"
              ? "border-sky-200/80"
              : "border-slate-200";

  const indicatorTone =
    resolved === "green"
      ? "bg-emerald-100 dark:bg-emerald-900/40"
      : resolved === "orange"
        ? "bg-amber-100 dark:bg-amber-900/40"
        : resolved === "red"
          ? "bg-rose-100 dark:bg-rose-900/40"
          : resolved === "navy"
            ? "bg-slate-200 dark:bg-slate-700"
            : resolved === "sky"
              ? "bg-sky-100 dark:bg-sky-900/40"
              : "bg-slate-100 dark:bg-slate-800";

  const minHeightClass = size === "compact" ? "min-h-[132px]" : size === "tall" ? "min-h-[176px]" : "min-h-[160px]";
  const labelClass = size === "compact" ? "text-[11px]" : "text-xs";
  const valueClass = size === "compact" ? "text-2xl" : size === "tall" ? "text-[34px]" : "text-[30px]";
  const hintClass = size === "compact" ? "text-xs leading-5" : "text-sm leading-6";
  const panelClass = size === "compact" ? "h-10 w-10 rounded-lg" : "h-12 w-12 rounded-xl";
  const dotClass = size === "compact" ? "h-5 w-5" : "h-6 w-6";

  return (
    <div
      className={cx(
        "rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] p-4 shadow-soft transition-colors",
        minHeightClass,
        borderTone,
        className,
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className={cx(labelClass, "font-extrabold uppercase tracking-[0.12em] text-faith-slate")}>
              {label}
            </div>
            <div className={cx(valueClass, "mt-2 font-black leading-none tracking-[-0.02em] text-faith-ink")}>
              {value}
            </div>
          </div>
          {indicator === "panel" ? (
            <div className={cx("shrink-0", panelClass, indicatorTone)} />
          ) : indicator === "dot" ? (
            <div className={cx("shrink-0 rounded-full", dotClass, indicatorTone)} />
          ) : null}
        </div>
        {hint ? (
          <div className={cx("mt-2 text-faith-slate", hintClass)}>{hint}</div>
        ) : null}
        {footer ? <div className="mt-auto pt-3">{footer}</div> : null}
      </div>
    </div>
  );
}
