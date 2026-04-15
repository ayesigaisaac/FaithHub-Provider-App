import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface NavItemProps {
  icon: ReactNode;
  label: string;
  to: string;
  end?: boolean;
  onClick?: () => void;
}

export function NavItem({ icon, label, to, end = false, onClick }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
          isActive
            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`h-5 w-5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>{icon}</span>
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}
