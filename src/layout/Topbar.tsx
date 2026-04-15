import { Bell, Menu, Search } from 'lucide-react';

interface TopbarProps {
  onOpenSidebar: () => void;
}

export function Topbar({ onOpenSidebar }: TopbarProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="inline-flex rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative max-w-xl flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search sessions, teachings, or members"
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none ring-emerald-500 transition placeholder:text-slate-400 focus:ring-2"
          />
        </div>

        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-3 rounded-xl border border-slate-200 px-2 py-1.5 transition hover:bg-slate-50"
          aria-label="Profile menu"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-sm font-semibold text-emerald-700">
            IA
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-medium text-slate-800">Isaac A.</span>
            <span className="block text-xs text-slate-500">Provider Admin</span>
          </span>
        </button>
      </div>
    </header>
  );
}
