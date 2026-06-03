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
        isActive ? 'bg-[var(--fh-brand-soft)]' : 'hover:bg-[var(--fh-brand-soft)]/40 dark:hover:bg-[var(--fh-surface)]'
      }`}
    >
      <span className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${isActive ? 'bg-[var(--fh-brand)]/15 text-[var(--fh-brand)]' : 'bg-[var(--fh-ev-light-grey)] text-[var(--fh-ev-medium-grey)] dark:bg-[var(--fh-surface)] dark:text-[var(--fh-muted)]'}`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className={`block text-sm font-medium ${isActive ? 'text-[var(--fh-ink)] dark:text-[var(--fh-ink)]' : 'text-[var(--fh-ink)] dark:text-[var(--fh-muted)]'}`}>{title}</span>
        <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-[var(--fh-slate)] dark:text-[var(--fh-muted)]">{description}</span>
      </span>
    </button>
  );
}
