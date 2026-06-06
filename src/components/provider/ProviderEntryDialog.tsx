import { useEffect, useId, useRef, type ReactNode } from 'react';
import { BadgeCheck, X } from 'lucide-react';

type ProviderEntryDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  helperText?: string;
  actions?: ReactNode;
  children: ReactNode;
  maxWidthClassName?: string;
  zIndex?: number;
};

export function ProviderEntryDialog({
  open,
  onClose,
  title,
  subtitle,
  helperText,
  actions,
  children,
  maxWidthClassName = 'max-w-3xl',
  zIndex = 110,
}: ProviderEntryDialogProps) {
  const id = useId();
  const headingId = `provider-entry-dialog-title-${id}`;
  const descriptionId = subtitle || helperText ? `provider-entry-dialog-description-${id}` : undefined;
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const rafId = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0" style={{ zIndex }} role="presentation">
      <button
        type="button"
        aria-label="Close data entry dialog"
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-0 overflow-y-auto px-4 py-6 sm:px-6 sm:py-10">
        <div className={`mx-auto w-full ${maxWidthClassName}`}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            aria-describedby={descriptionId}
            className="overflow-hidden rounded-[28px] border border-faith-line/70 bg-[var(--fh-surface-bg)] shadow-[0_30px_80px_rgba(15,23,42,0.22)]"
          >
            <div className="border-b border-faith-line/70 bg-gradient-to-r from-emerald-50 via-[var(--fh-surface-bg)] to-orange-50 px-4 py-4 sm:px-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Data entry session active
                  </div>
                  <h2 id={headingId} className="mt-3 text-lg font-black tracking-tight text-faith-ink sm:text-xl">
                    {title}
                  </h2>
                  {subtitle ? (
                    <p id={descriptionId} className="mt-1 text-sm text-faith-slate">
                      {subtitle}
                    </p>
                  ) : null}
                  {helperText ? (
                    <p className="mt-2 text-xs font-semibold text-faith-slate">
                      {helperText}
                    </p>
                  ) : null}
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-faith-line/70 bg-[var(--fh-surface-bg)] text-faith-slate transition hover:bg-[var(--fh-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fh-brand)]/35"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[calc(100vh-14rem)] overflow-y-auto px-4 py-4 sm:px-6">
              {children}
            </div>

            {actions ? (
              <div className="border-t border-faith-line/70 bg-[var(--fh-surface)] px-4 py-4 sm:px-6">
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                  {actions}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
