import { ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ModuleCardProps {
  title: string;
  icon: LucideIcon;
  isOpen: boolean;
  onToggle: () => void;
}

export function ModuleCard({ title, icon: Icon, isOpen, onToggle }: ModuleCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className={`flex w-full items-center justify-between rounded-xl border bg-[var(--fh-surface)] p-[14px] text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fh-brand)] focus-visible:ring-offset-2 dark:bg-[var(--fh-surface)] ${
        isOpen
          ? 'border-2 border-[var(--fh-brand)] shadow-sm'
          : 'border-[var(--fh-line)] hover:shadow-md dark:border-[var(--fh-line)]'
      }`}
    >
      <span className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--fh-brand-soft)] text-[var(--fh-brand)] dark:bg-[var(--fh-surface)] dark:text-[var(--fh-brand)]">
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-sm font-semibold tracking-wide text-[var(--fh-ink)] dark:text-[var(--fh-ink)]">{title}</span>
      </span>
      <ChevronRight
        className={`h-5 w-5 text-[var(--fh-slate)] dark:text-[var(--fh-muted)] transition-transform duration-200 ${isOpen ? 'rotate-90 text-[var(--fh-brand)]' : ''}`}
      />
    </button>
  );
}
