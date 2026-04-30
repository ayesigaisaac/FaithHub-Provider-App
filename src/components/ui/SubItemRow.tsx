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
      className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#03cd8c] focus-visible:ring-offset-2 ${
        isActive ? 'bg-[#e6f4ef]' : 'hover:bg-slate-50'
      }`}
    >
      <span className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${isActive ? 'bg-[#03cd8c]/15 text-[#03cd8c]' : 'bg-slate-100 text-slate-600'}`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className={`block text-sm font-medium ${isActive ? 'text-slate-900' : 'text-slate-800'}`}>{title}</span>
        <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-[#6b7280]">{description}</span>
      </span>
    </button>
  );
}