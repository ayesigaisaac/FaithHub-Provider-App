import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cx } from '@/components/cx';

type ProviderFormFieldProps = {
  label: string;
  helperText?: string;
  errorText?: string;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
  htmlFor?: string;
};

type ProviderFormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

type ProviderFormTextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
};

type ProviderFormSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: boolean;
  options: Array<string | { label: string; value: string }>;
};

type ProviderFormToggleProps = {
  label: string;
  detail?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  className?: string;
};

type ProviderFormActionsProps = {
  children: ReactNode;
  className?: string;
};

type ProviderFormErrorSummaryProps = {
  errors?: string[];
  title?: string;
  className?: string;
};

export function ProviderFormField({
  label,
  helperText,
  errorText,
  children,
  className,
  labelClassName,
  htmlFor,
}: ProviderFormFieldProps) {
  const LabelTag = htmlFor ? "label" : "div";
  return (
    <div className={cx('block', className)}>
      <LabelTag
        {...(htmlFor ? { htmlFor } : {})}
        className={cx('text-[11px] font-extrabold uppercase tracking-[0.14em] text-faith-slate', labelClassName)}
      >
        {label}
      </LabelTag>
      {helperText ? <div className="mt-1 text-[11px] leading-5 text-faith-slate">{helperText}</div> : null}
      <div className="mt-1.5">{children}</div>
      {errorText ? <div className="mt-1.5 text-[11px] font-semibold text-rose-600">{errorText}</div> : null}
    </div>
  );
}

export function ProviderFormInput({ className, error, ...props }: ProviderFormInputProps) {
  return (
    <input
      {...props}
      className={cx(
        'h-11 w-full rounded-2xl border bg-[var(--fh-surface-bg)] px-4 text-[13px] font-semibold text-faith-ink outline-none transition focus:ring-2',
        error ? 'border-rose-300 focus:ring-rose-200' : 'border-faith-line/70 focus:ring-[rgba(3,205,140,0.2)]',
        className,
      )}
    />
  );
}

export function ProviderFormTextArea({ className, error, ...props }: ProviderFormTextAreaProps) {
  return (
    <textarea
      {...props}
      className={cx(
        'w-full rounded-2xl border bg-[var(--fh-surface-bg)] px-4 py-3 text-[13px] font-semibold text-faith-ink outline-none transition focus:ring-2',
        error ? 'border-rose-300 focus:ring-rose-200' : 'border-faith-line/70 focus:ring-[rgba(3,205,140,0.2)]',
        className,
      )}
    />
  );
}

export function ProviderFormSelect({ className, error, options, ...props }: ProviderFormSelectProps) {
  return (
    <select
      {...props}
      className={cx(
        'h-11 w-full rounded-2xl border bg-[var(--fh-surface-bg)] px-4 text-[13px] font-semibold text-faith-ink outline-none transition focus:ring-2',
        error ? 'border-rose-300 focus:ring-rose-200' : 'border-faith-line/70 focus:ring-[rgba(3,205,140,0.2)]',
        className,
      )}
    >
      {options.map((option) => {
        const value = typeof option === "string" ? option : option.value;
        const label = typeof option === "string" ? option : option.label;
        return (
          <option key={value} value={value}>
            {label}
          </option>
        );
      })}
    </select>
  );
}

export function ProviderFormToggle({ label, detail, checked, onChange, className }: ProviderFormToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cx(
        "flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition",
        checked ? "border-emerald-300 bg-emerald-50" : "border-faith-line/70 bg-[var(--fh-surface-bg)] hover:bg-[var(--fh-surface)]",
        className,
      )}
    >
      <span
        className={cx(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
          checked ? "border-emerald-500 bg-emerald-500 text-white" : "border-faith-line bg-white text-transparent",
        )}
      >
        <CheckCircle2 size={13} className={checked ? "" : "invisible"} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-extrabold text-faith-ink">{label}</span>
          <span
            className={cx(
              "rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.18em]",
              checked ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500",
            )}
          >
            {checked ? "On" : "Off"}
          </span>
        </span>
        {detail ? <span className="mt-0.5 block text-[11px] leading-5 text-faith-slate">{detail}</span> : null}
      </span>
    </button>
  );
}

export function ProviderFormActions({ children, className }: ProviderFormActionsProps) {
  return <div className={cx("flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end", className)}>{children}</div>;
}

export function ProviderFormErrorSummary({
  errors = [],
  title = "Validation issues",
  className,
}: ProviderFormErrorSummaryProps) {
  if (!errors.length) return null;

  return (
    <div className={cx("rounded-3xl border border-rose-200 bg-rose-50 p-4", className)} role="alert" aria-live="polite">
      <div className="text-[11px] font-black uppercase tracking-[0.16em] text-rose-700">{title}</div>
      <div className="mt-2 space-y-1 text-[12px] font-semibold text-rose-700">
        {errors.map((error) => (
          <div key={error}>{error}</div>
        ))}
      </div>
    </div>
  );
}
