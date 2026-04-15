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
import { NavItem } from '@/components/ui/NavItem';

interface SidebarProps {
  onClose?: () => void;
}

const primaryNav = [
  { label: 'Dashboard', icon: <Home className="h-5 w-5" />, active: true },
  { label: 'Sessions', icon: <CalendarDays className="h-5 w-5" /> },
  { label: 'Teachings', icon: <Radio className="h-5 w-5" /> },
  { label: 'Resources', icon: <Layers className="h-5 w-5" /> },
  { label: 'Payouts', icon: <Wallet className="h-5 w-5" /> },
];

const secondaryNav = [
  { label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  { label: 'Support', icon: <LifeBuoy className="h-5 w-5" /> },
];

export function Sidebar({ onClose }: SidebarProps) {
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
            <NavItem key={item.label} icon={item.icon} label={item.label} active={item.active} />
          ))}
        </div>

        <div className="space-y-1 border-t border-slate-200 pt-4">
          {secondaryNav.map((item) => (
            <NavItem key={item.label} icon={item.icon} label={item.label} />
          ))}
        </div>
      </nav>
    </aside>
  );
}
