import {
  Bell,
  CalendarDays,
  FileStack,
  Home,
  Layers,
  LifeBuoy,
  Megaphone,
  PenSquare,
  Radio,
  Settings,
  Wallet,
  X,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavItem } from '@/components/ui/NavItem';

interface SidebarProps {
  onClose?: () => void;
}

type SidebarSection = 'Core' | 'Content';

type SidebarNavItem = {
  label: string;
  hint?: string;
  badge?: string;
  section: SidebarSection;
  path: string;
  icon: JSX.Element;
};

const sidebarItems: SidebarNavItem[] = [
  { label: 'Overview', hint: 'Global workspace pulse', section: 'Core', path: '/dashboard-ui', icon: <Home className="h-5 w-5" /> },
  { label: 'Schedule', hint: 'Live and publishing timeline', section: 'Core', path: '/faithhub/provider/live-schedule', icon: <CalendarDays className="h-5 w-5" /> },
  { label: 'Notifications', hint: 'Audience alerts and sends', badge: '3', section: 'Core', path: '/faithhub/provider/audience-notifications', icon: <Bell className="h-5 w-5" /> },
  { label: 'Payouts', hint: 'Wallet and settlements', section: 'Core', path: '/faithhub/provider/wallet-payouts', icon: <Wallet className="h-5 w-5" /> },
  { label: 'Teachings', hint: 'Sermons and episodes', section: 'Content', path: '/faithhub/provider/teachings-dashboard', icon: <Radio className="h-5 w-5" /> },
  { label: 'Resources', hint: 'Files and attachments', section: 'Content', path: '/faithhub/provider/resources-manager', icon: <Layers className="h-5 w-5" /> },
  { label: 'Series', hint: 'Collections and tracks', section: 'Content', path: '/faithhub/provider/series-dashboard', icon: <FileStack className="h-5 w-5" /> },
  { label: 'Builder', hint: 'Create live sessions', section: 'Content', path: '/faithhub/provider/live-builder', icon: <PenSquare className="h-5 w-5" /> },
  { label: 'Campaigns', hint: 'Events and outreach', section: 'Content', path: '/faithhub/provider/events-manager', icon: <Megaphone className="h-5 w-5" /> },
];

const utilityItems: SidebarNavItem[] = [
  { label: 'Settings', section: 'Core', path: '/faithhub/provider/workspace-settings', icon: <Settings className="h-5 w-5" /> },
  { label: 'Support', section: 'Core', path: '/faithhub/home-landing', icon: <LifeBuoy className="h-5 w-5" /> },
];

export function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose?.();
  };

  const isActivePath = (path: string) => location.pathname === path;
  const sections: SidebarSection[] = ['Core', 'Content'];

  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 lg:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">FaithHub</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">SaaS Console</h2>
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

      <nav className="flex-1 space-y-6 overflow-y-auto p-4" aria-label="Primary">
        {sections.map((section) => (
          <section key={section} className="space-y-2" aria-labelledby={`sidebar-section-${section.toLowerCase()}`}>
            <h3
              id={`sidebar-section-${section.toLowerCase()}`}
              className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400"
            >
              {section}
            </h3>
            <ul className="space-y-1" role="list">
              {sidebarItems
                .filter((item) => item.section === section)
                .map((item) => (
                  <li key={item.label}>
                    <NavItem
                      icon={item.icon}
                      label={item.label}
                      hint={item.hint}
                      badge={item.badge}
                      active={isActivePath(item.path)}
                      onClick={() => handleNavigate(item.path)}
                    />
                  </li>
                ))}
            </ul>
          </section>
        ))}

        <div className="space-y-1 border-t border-slate-200 pt-4">
          {utilityItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={isActivePath(item.path)}
              onClick={() => handleNavigate(item.path)}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
}
