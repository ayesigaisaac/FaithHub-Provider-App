import type { ReactNode } from 'react';

interface NavItemProps {
  icon: ReactNode;
  label: string;
  hint?: string;
  badge?: string;
  active?: boolean;
  onClick?: () => void;
}

export function NavItem({ icon, label, hint, badge, active = false, onClick }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`group flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
        active
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[0_8px_18px_rgba(16,185,129,0.12)]'
          : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <span
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
          active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
        }`}
      >
        <span className="h-5 w-5">{icon}</span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate">{label}</span>
        {hint ? <span className="block truncate text-xs font-normal text-slate-500">{hint}</span> : null}
      </span>
      {badge ? (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}
