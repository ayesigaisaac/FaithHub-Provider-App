import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

type ProviderDrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidthClassName?: string;
  zIndex?: number;
};

export function ProviderDrawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidthClassName = "max-w-5xl",
  zIndex = 100,
}: ProviderDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0" style={{ zIndex }}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`absolute right-0 top-0 h-full w-full bg-[var(--fh-surface-bg)] shadow-medium ${maxWidthClassName}`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-faith-line px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[14px] font-bold text-faith-ink">{title}</div>
                {subtitle ? <div className="mt-0.5 text-[11px] text-faith-slate">{subtitle}</div> : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-2xl border border-faith-line/70 text-faith-slate transition hover:bg-[var(--fh-surface)]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
