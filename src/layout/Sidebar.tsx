import {
  BellDot,
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  FileStack,
  Gauge,
  Home,
  Layers,
  LifeBuoy,
  ListChecks,
  LayoutGrid,
  MessageSquare,
  Megaphone,
  MonitorPlay,
  RadioTower,
  Radio,
  Share2,
  ShieldCheck,
  Sparkles,
  Settings,
  Users,
  Video,
  Wallet,
  X,
} from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  onClose?: () => void;
}

type ModuleGroupId = 'core' | 'content' | 'streams' | 'audience' | 'giving' | 'beacon' | 'community' | 'leadership' | 'workspace';

type SidebarModuleItem = {
  label: string;
  hint?: string;
  path: string;
  icon: JSX.Element;
};

type SidebarModuleGroup = {
  id: ModuleGroupId;
  label: string;
  items: SidebarModuleItem[];
};

const moduleGroups: SidebarModuleGroup[] = [
  {
    id: 'core',
    label: 'Core',
    items: [
      { label: 'Overview', hint: 'Global workspace pulse', path: '/dashboard-ui', icon: <Home className="h-5 w-5" /> },
      { label: 'Provider dashboard', hint: 'Main workspace board', path: '/faithhub/provider/dashboard', icon: <Gauge className="h-5 w-5" /> },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    items: [
      { label: 'Teachings dashboard', hint: 'Sermons and episodes', path: '/faithhub/provider/teachings-dashboard', icon: <Radio className="h-5 w-5" /> },
      { label: 'Series dashboard', hint: 'Collections and tracks', path: '/faithhub/provider/series-dashboard', icon: <FileStack className="h-5 w-5" /> },
      { label: 'Resources manager', hint: 'Files and attachments', path: '/faithhub/provider/resources-manager', icon: <Layers className="h-5 w-5" /> },
    ],
  },
  {
    id: 'streams',
    label: 'Streams',
    items: [
      { label: 'Live builder', hint: 'Session setup and rundown', path: '/faithhub/provider/live-builder', icon: <Video className="h-5 w-5" /> },
      { label: 'Live schedule', hint: 'Publishing and timing', path: '/faithhub/provider/live-schedule', icon: <ListChecks className="h-5 w-5" /> },
      { label: 'Live dashboard', hint: 'Mission control board', path: '/faithhub/provider/live-dashboard', icon: <Gauge className="h-5 w-5" /> },
      { label: 'Live studio', hint: 'Production and control room', path: '/faithhub/provider/live-studio', icon: <MonitorPlay className="h-5 w-5" /> },
      { label: 'Stream-to-platforms', hint: 'Destination routing', path: '/faithhub/provider/stream-to-platforms', icon: <Share2 className="h-5 w-5" /> },
    ],
  },
  {
    id: 'audience',
    label: 'Audience',
    items: [
      { label: 'Audience notifications', hint: 'Alerts and journeys', path: '/faithhub/provider/audience-notifications', icon: <Bell className="h-5 w-5" /> },
      { label: 'Noticeboard', hint: 'Announcements and updates', path: '/faithhub/provider/noticeboard', icon: <BellDot className="h-5 w-5" /> },
    ],
  },
  {
    id: 'giving',
    label: 'Giving',
    items: [
      { label: 'Donations & funds', hint: 'Provider giving controls', path: '/faithhub/provider/donations-and-funds', icon: <Wallet className="h-5 w-5" /> },
      { label: 'Wallet & payouts', hint: 'Settlements and transfer rails', path: '/faithhub/provider/wallet-payouts', icon: <RadioTower className="h-5 w-5" /> },
      { label: 'Events manager', hint: 'Registration and event ops', path: '/faithhub/provider/events-manager', icon: <CalendarDays className="h-5 w-5" /> },
    ],
  },
  {
    id: 'beacon',
    label: 'Beacon',
    items: [
      { label: 'Beacon dashboard', hint: 'Campaign performance', path: '/faithhub/provider/beacon-dashboard', icon: <Megaphone className="h-5 w-5" /> },
    ],
  },
  {
    id: 'community',
    label: 'Community & care',
    items: [
      { label: 'Community groups', hint: 'Groups and engagement', path: '/faithhub/provider/community-groups', icon: <Users className="h-5 w-5" /> },
      { label: 'Testimonies', hint: 'Stories and social proof', path: '/faithhub/provider/testimonies', icon: <MessageSquare className="h-5 w-5" /> },
      { label: 'Counseling', hint: 'Care follow-up and support', path: '/faithhub/provider/counseling', icon: <ShieldCheck className="h-5 w-5" /> },
    ],
  },
  {
    id: 'leadership',
    label: 'Leadership',
    items: [
      { label: 'Roles & permissions', hint: 'Access and governance', path: '/faithhub/provider/roles-permissions', icon: <Sparkles className="h-5 w-5" /> },
    ],
  },
  {
    id: 'workspace',
    label: 'Workspace',
    items: [
      { label: 'Workspace settings', hint: 'Brand and environment', path: '/faithhub/provider/workspace-settings', icon: <Settings className="h-5 w-5" /> },
      { label: 'Support', hint: 'Help and landing page', path: '/faithhub/home-landing', icon: <LifeBuoy className="h-5 w-5" /> },
    ],
  },
];

export function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [modulesOpen, setModulesOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.localStorage.getItem('faithhub.sidebar.modulesOpen') !== 'false';
  });
  const dropdownId = useId();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose?.();
  };

  useEffect(() => {
    window.localStorage.setItem('faithhub.sidebar.modulesOpen', String(modulesOpen));
  }, [modulesOpen]);

  const isActivePath = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-[#f4f6f6]">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
        <div>
          <h2 className="text-3xl font-bold leading-none tracking-[-0.02em] text-slate-900">Navigation</h2>
          <p className="mt-1 text-base font-semibold text-slate-500">Modules</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex rounded-2xl border border-slate-300 bg-white p-2.5 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-5" aria-label="Primary">
        <button
          type="button"
          aria-expanded={modulesOpen}
          aria-controls={dropdownId}
          onClick={() => setModulesOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-[22px] border border-slate-300 bg-[#f8f9fa] px-4 py-3.5 text-left transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          <span className="flex items-center gap-3">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <LayoutGrid className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">FaithHub Provider</span>
              <span className="block text-[22px] font-bold leading-none tracking-[-0.01em] text-slate-900">Provider Modules</span>
            </span>
          </span>
          <ChevronDown className={`h-6 w-6 text-slate-500 transition-transform ${modulesOpen ? 'rotate-180' : ''}`} />
        </button>

        <div id={dropdownId} className={`mt-5 space-y-5 ${modulesOpen ? 'block' : 'hidden'}`}>
          {moduleGroups.map((group) => (
            <section key={group.id}>
              <h3 className="px-2 pb-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-400">{group.label}</h3>
              <ul className="space-y-2.5" role="list">
                {group.items.map((item) => {
                  const active = isActivePath(item.path);
                  return (
                    <li key={item.path}>
                      <button
                        type="button"
                        aria-current={active ? 'page' : undefined}
                        onClick={() => handleNavigate(item.path)}
                        className={`group flex w-full items-center justify-between rounded-[22px] border px-4 py-3.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                          active
                            ? 'border-2 border-slate-900 bg-white shadow-[0_10px_20px_rgba(15,23,42,0.07)]'
                            : 'border-slate-300 bg-[#f8f9fa] hover:bg-white'
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-3.5">
                          <span
                            className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                              active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-[15px] font-bold leading-none tracking-[-0.01em] text-slate-800">
                              {item.label}
                            </span>
                            {item.hint ? <span className="mt-0.5 block truncate text-[12px] leading-tight text-slate-500">{item.hint}</span> : null}
                          </span>
                        </span>
                        <ChevronRight className={`h-6 w-6 shrink-0 ${active ? 'text-slate-900' : 'text-slate-400'}`} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </nav>
    </aside>
  );
}
