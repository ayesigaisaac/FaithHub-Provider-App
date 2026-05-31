import { Bell, ChevronDown, Menu, Search } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandLogo } from '@/components/branding/BrandLogo';

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
    <header className="fixed inset-x-0 top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:left-72">
      <div className="grid h-16 grid-cols-1 items-center gap-3 px-4 sm:px-6 lg:grid-cols-[minmax(240px,1fr)_minmax(300px,1.2fr)_auto]">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="fh-interactive absolute left-4 inline-flex rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fh-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-slate-300 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden items-center gap-3 lg:flex">
          <BrandLogo variant="symbol" alt="FaithHub" className="h-10 w-10 rounded-xl" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">FaithHub Provider</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">Workspace Dashboard</p>
          </div>
          <div className="relative">
            <select
              value={workspace}
              onChange={handleWorkspaceSwitch}
              aria-label="Switch workspace"
              className="fh-interactive h-9 appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 text-xs font-medium text-slate-700 outline-none transition focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fh-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus-visible:bg-slate-900 dark:focus-visible:ring-offset-slate-950"
            >
              <option value="Kampala Central">Kampala Central</option>
              <option value="Online Studio">Online Studio</option>
              <option value="Global Hub">Global Hub</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:mx-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="search"
            placeholder="Search content, campaigns, or members"
            className="fh-interactive h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fh-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus-visible:ring-offset-slate-950"
          />
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <button
            type="button"
            className="fh-interactive relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fh-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950"
            aria-label="Notifications"
            onClick={() => navigate('/faithhub/provider/audience-notifications')}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
          </button>

          <button
            type="button"
            className="fh-interactive inline-flex items-center gap-3 rounded-xl border border-slate-200 px-2 py-1.5 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fh-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-700 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950"
            aria-label="Profile menu"
            onClick={() => navigate('/faithhub/provider/workspace-settings')}
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--fh-brand-soft)] text-sm font-semibold text-[var(--fh-brand-dark)]">
              IA
            </span>
            <span className="hidden text-left xl:block">
              <span className="block text-sm font-medium text-slate-800 dark:text-slate-100">Isaac A.</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">Provider Admin</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
