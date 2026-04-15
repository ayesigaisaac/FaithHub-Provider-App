import {
  BadgePlus,
  Megaphone,
  Home,
  Radio,
  Shapes,
  Video,
  X,
} from 'lucide-react';
import { NavItem } from '@/components/ui/NavItem';
import { ROUTES, SIDEBAR_ROUTES } from '@/routes/routes';

interface SidebarProps {
  onClose?: () => void;
}

const navIcons = {
  [ROUTES.dashboard]: <Home className="h-5 w-5" />,
  [ROUTES.series]: <Shapes className="h-5 w-5" />,
  [ROUTES.teachings]: <Radio className="h-5 w-5" />,
  [ROUTES.campaigns]: <BadgePlus className="h-5 w-5" />,
  [ROUTES.ads]: <Megaphone className="h-5 w-5" />,
} as const;

const quickActions = [
  { label: 'New Live Session', path: ROUTES.liveNew, icon: <Video className="h-5 w-5" /> },
  { label: 'New Teaching', path: ROUTES.teachingNew, icon: <Radio className="h-5 w-5" /> },
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
          {SIDEBAR_ROUTES.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              icon={navIcons[item.path]}
              label={item.label}
              end={item.path === ROUTES.dashboard}
              onClick={onClose}
            />
          ))}
        </div>

        <div className="space-y-1 border-t border-slate-200 pt-4">
          {quickActions.map((item) => (
            <NavItem key={item.path} to={item.path} icon={item.icon} label={item.label} onClick={onClose} />
          ))}
        </div>
      </nav>
    </aside>
  );
}
