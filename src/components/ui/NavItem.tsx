import { ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItemProps {
  label: string;
  path: string;
  onClose?: () => void;
}

export function NavItem({ label, path, onClose }: NavItemProps) {
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
      aria-current={isActive ? 'page' : undefined}
      onClick={handleClick}
      className={`group flex w-full items-center justify-between rounded-[12px] px-3 py-2.5 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
        isActive ? 'bg-[#d1f2e5] text-emerald-900' : 'text-slate-700 hover:bg-[#e6f4ef]'
      }`}
    >
      <span className="truncate">{label}</span>
      <ChevronRight
        className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-emerald-800' : 'text-slate-400 group-hover:text-slate-600'}`}
      />
    </button>
  );
}