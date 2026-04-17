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

  return (
    <div
      className={cx(
        "rounded-[24px] border bg-white dark:bg-slate-900 p-4 shadow-sm transition-colors min-h-[160px]",
        borderTone,
        className,
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              {label}
            </div>
            <div className="mt-2 text-[30px] font-black leading-none tracking-[-0.02em] text-slate-900 dark:text-slate-100">
              {value}
            </div>
          </div>
          {indicator === "panel" ? (
            <div className={cx("h-12 w-12 shrink-0 rounded-2xl", indicatorTone)} />
          ) : indicator === "dot" ? (
            <div className={cx("h-6 w-6 shrink-0 rounded-full", indicatorTone)} />
          ) : null}
        </div>
        {hint ? (
          <div className="mt-2 text-[13px] leading-5 text-slate-600 dark:text-slate-300">{hint}</div>
        ) : null}
        {footer ? <div className="mt-auto pt-3">{footer}</div> : null}
      </div>
    </div>
  );
}
