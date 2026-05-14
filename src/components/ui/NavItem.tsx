import { ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItemProps {
  label: string;
  path: string;
  onClose?: () => void;
  compact?: boolean;
  srLabel?: string;
}

export function NavItem({ label, path, onClose, compact = false, srLabel }: NavItemProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = pathname === path || pathname.startsWith(`${path}/`);

  const handleClick = () => {
    navigate(path);
    onClose?.();
  };

  return (
    <button
      type="button"
      aria-label={compact ? (srLabel ?? label) : undefined}
      aria-current={isActive ? 'page' : undefined}
      title={compact ? (srLabel ?? label) : undefined}
      onClick={handleClick}
      className={`fh-interactive group flex w-full items-center justify-between rounded-[12px] text-left font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fh-brand)] focus-visible:ring-offset-2 ${
        compact ? 'px-2 py-2 text-xs' : 'px-3 py-2.5 text-sm'
      } ${
        isActive
          ? compact
            ? 'bg-[var(--fh-brand-soft)] text-[var(--fh-brand-dark)]'
            : 'bg-[var(--fh-brand-soft)] text-[var(--fh-brand-dark)]'
          : compact
            ? 'text-slate-700 hover:bg-[var(--fh-surface)]'
            : 'text-slate-700 hover:bg-[var(--fh-surface)]'
      }`}
    >
      <span className={`truncate ${compact ? 'mx-auto text-center' : ''}`}>{label}</span>
      <ChevronRight
        className={`shrink-0 transition-colors ${
          compact ? 'hidden' : 'h-4 w-4'
        } ${isActive ? 'text-[var(--fh-brand-dark)]' : 'text-slate-400 group-hover:text-slate-600'}`}
      />
    </button>
  );
}
