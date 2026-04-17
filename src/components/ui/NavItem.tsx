import type { ReactNode } from 'react';

interface NavItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function NavItem({ icon, label, active = false, onClick }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
        active
          ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <span className={`h-5 w-5 ${active ? 'text-emerald-600' : 'text-slate-400'}`}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
