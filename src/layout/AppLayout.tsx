import { useState, type ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from '@/layout/Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-slate-100 text-slate-900">
      <div className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
        <Sidebar />
      </div>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-900/35 lg:hidden" onClick={() => setMobileNavOpen(false)}>
          <div className="h-full w-72 bg-white shadow-xl" onClick={(event) => event.stopPropagation()}>
            <Sidebar onClose={() => setMobileNavOpen(false)} />
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setMobileNavOpen(true)}
        className="fixed left-4 top-4 z-30 inline-flex rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:bg-slate-50 lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="h-full lg:pl-72">
        <main className="h-full overflow-y-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
