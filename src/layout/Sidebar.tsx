import {
  CalendarDays,
  Home,
  Layers,
  LifeBuoy,
  Radio,
  Settings,
  Wallet,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NavItem } from '@/components/ui/NavItem';

interface SidebarProps {
  onClose?: () => void;
}

const primaryNav = [
  { label: 'Dashboard', icon: <Home className="h-5 w-5" />, active: true, path: '/faithhub/provider/dashboard' },
  { label: 'Sessions', icon: <CalendarDays className="h-5 w-5" />, path: '/faithhub/provider/live-schedule' },
  { label: 'Teachings', icon: <Radio className="h-5 w-5" />, path: '/faithhub/provider/teachings-dashboard' },
  { label: 'Resources', icon: <Layers className="h-5 w-5" />, path: '/faithhub/provider/resources-manager' },
  { label: 'Payouts', icon: <Wallet className="h-5 w-5" />, path: '/faithhub/provider/wallet-payouts' },
];

const secondaryNav = [
  { label: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/faithhub/provider/workspace-settings' },
  { label: 'Support', icon: <LifeBuoy className="h-5 w-5" />, path: '/faithhub/home#footer' },
];

export function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose?.();
  };

  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center justify-between px-4 py-5 lg:px-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">FaithHub</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">Provider</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-8 overflow-y-auto px-3 pb-5 lg:px-4">
        <div className="space-y-1">
          {primaryNav.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={item.active}
              onClick={() => handleNavigate(item.path)}
            />
          ))}
        </div>

        <div className="space-y-1 border-t border-slate-200 pt-4">
          {secondaryNav.map((item) => (
            <NavItem key={item.label} icon={item.icon} label={item.label} onClick={() => handleNavigate(item.path)} />
          ))}
        </div>
      </nav>
    </aside>
  );
}
