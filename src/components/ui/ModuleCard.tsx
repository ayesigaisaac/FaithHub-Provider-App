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
      className={`flex w-full items-center justify-between rounded-xl border bg-[#ffffff] p-[14px] text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#03cd8c] focus-visible:ring-offset-2 ${
        isOpen ? 'border-2 border-black shadow-sm' : 'border-slate-200 hover:shadow-md'
      }`}
    >
      <span className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-sm font-semibold tracking-wide text-slate-900">{title}</span>
      </span>
      <ChevronRight
        className={`h-5 w-5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-90 text-[#03cd8c]' : ''}`}
      />
    </button>
  );
}