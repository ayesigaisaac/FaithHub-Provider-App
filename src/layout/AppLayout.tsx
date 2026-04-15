import { useState, type ReactNode } from 'react';
import { Sidebar } from '@/layout/Sidebar';
import { Topbar } from '@/layout/Topbar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </aside>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden" onClick={() => setMobileNavOpen(false)}>
          <div className="h-full w-72 bg-white" onClick={(event) => event.stopPropagation()}>
            <Sidebar onClose={() => setMobileNavOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex-1 w-full">
        <Topbar onOpenSidebar={() => setMobileNavOpen(true)} />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
