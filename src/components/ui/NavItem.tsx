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
      className={`group flex w-full items-center justify-between rounded-[12px] text-left font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
        compact ? 'px-2 py-2 text-xs' : 'px-3 py-2.5 text-sm'
      } ${
        isActive
          ? compact
            ? 'bg-emerald-200 text-emerald-900'
            : 'bg-[#d1f2e5] text-emerald-900'
          : compact
            ? 'text-slate-700 hover:bg-slate-200'
            : 'text-slate-700 hover:bg-[#e6f4ef]'
      }`}
    >
      <span className={`truncate ${compact ? 'mx-auto text-center' : ''}`}>{label}</span>
      <ChevronRight
        className={`shrink-0 transition-colors ${
          compact ? 'hidden' : 'h-4 w-4'
        } ${isActive ? 'text-emerald-800' : 'text-slate-400 group-hover:text-slate-600'}`}
      />
    </button>
  );
}
