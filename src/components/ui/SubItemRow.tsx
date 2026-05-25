import type { LucideIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SubItemRowProps {
  title: string;
  description: string;
  route: string;
  icon: LucideIcon;
  onClose?: () => void;
}

export function SubItemRow({ title, description, route, icon: Icon, onClose }: SubItemRowProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = pathname === route || pathname.startsWith(`${route}/`);

  const handleClick = () => {
    navigate(route);
    onClose?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-current={isActive ? 'page' : undefined}
      className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fh-brand)] focus-visible:ring-offset-2 ${
        isActive ? 'bg-[var(--fh-brand-soft)]' : 'hover:bg-slate-50 dark:hover:bg-slate-800/70'
      }`}
    >
      <span className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${isActive ? 'bg-[var(--fh-brand)]/15 text-[var(--fh-brand)]' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className={`block text-sm font-medium ${isActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-800 dark:text-slate-200'}`}>{title}</span>
        <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</span>
      </span>
    </button>
  );
}
