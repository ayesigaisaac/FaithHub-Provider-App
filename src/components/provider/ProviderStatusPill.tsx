import type { ReactNode } from "react";

export type ProviderStatusTone =
  | "neutral"
  | "good"
  | "warn"
  | "orange"
  | "danger"
  | "bad"
  | "brand"
  | "accent"
  | "navy"
  | "pro";

type ProviderStatusPillProps = {
  text?: string;
  children?: ReactNode;
  left?: ReactNode;
  tone?: ProviderStatusTone;
  className?: string;
};

const toneClasses: Record<ProviderStatusTone, string> = {
  neutral: "border-faith-line bg-[var(--fh-surface-bg)] text-slate-700",
  good: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warn: "border-amber-200 bg-amber-50 text-amber-700",
  orange: "border-amber-200 bg-amber-50 text-amber-800",
  danger: "border-rose-200 bg-rose-50 text-rose-700",
  bad: "border-rose-200 bg-rose-50 text-rose-700",
  brand: "border-orange-200 bg-orange-50 text-orange-700",
  accent: "border-orange-200 bg-orange-50 text-orange-700",
  navy: "border-faith-line bg-slate-100 text-slate-800",
  pro: "border-slate-900 bg-slate-900 text-white",
};

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

export function ProviderStatusPill({
  text,
  children,
  left,
  tone = "neutral",
  className,
}: ProviderStatusPillProps) {
  return (
    <span
      className={cx(
        "inline-flex min-h-9 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.09em] sm:text-[11px]",
        toneClasses[tone],
        className,
      )}
    >
      {left}
      {text ?? children}
    </span>
  );
}
