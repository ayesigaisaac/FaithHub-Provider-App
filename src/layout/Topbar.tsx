import { Bell, ChevronDown, Menu, Search } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  onOpenSidebar: () => void;
}

export function Topbar({ onOpenSidebar }: TopbarProps) {
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState('Kampala Central');

  const handleWorkspaceSwitch = (event: ChangeEvent<HTMLSelectElement>) => {
    setWorkspace(event.target.value);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur lg:left-72">
      <div className="grid h-16 grid-cols-1 items-center gap-3 px-4 sm:px-6 lg:grid-cols-[minmax(240px,1fr)_minmax(300px,1.2fr)_auto]">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="absolute left-4 inline-flex rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">FaithHub Provider</p>
            <p className="truncate text-xs text-slate-500">Workspace Dashboard</p>
          </div>
          <div className="relative">
            <select
              value={workspace}
              onChange={handleWorkspaceSwitch}
              aria-label="Switch workspace"
              className="h-9 appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 text-xs font-medium text-slate-700 outline-none ring-emerald-500 transition focus:bg-white focus:ring-2"
            >
              <option value="Kampala Central">Kampala Central</option>
              <option value="Online Studio">Online Studio</option>
              <option value="Global Hub">Global Hub</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:mx-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search content, campaigns, or members"
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none ring-emerald-500 transition placeholder:text-slate-400 focus:ring-2"
          />
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            aria-label="Notifications"
            onClick={() => navigate('/faithhub/provider/audience-notifications')}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-3 rounded-xl border border-slate-200 px-2 py-1.5 transition hover:bg-slate-50"
            aria-label="Profile menu"
            onClick={() => navigate('/faithhub/provider/workspace-settings')}
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-sm font-semibold text-emerald-700">
              IA
            </span>
            <span className="hidden text-left xl:block">
              <span className="block text-sm font-medium text-slate-800">Isaac A.</span>
              <span className="block text-xs text-slate-500">Provider Admin</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
