import { useEffect, useId, useState, type ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from '@/layout/Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navDialogTitleId = useId();

  useEffect(() => {
    if (!mobileNavOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileNavOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [mobileNavOpen]);

  return (
    <div className="h-screen overflow-hidden bg-slate-100 text-slate-900">
      <a
        href="#app-layout-main"
        className="sr-only z-[70] rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <div className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
        <Sidebar />
      </div>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-labelledby={navDialogTitleId}>
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            className="absolute inset-0 bg-slate-900/35"
            aria-label="Close navigation overlay"
          />
          <div className="relative h-full w-72 bg-white shadow-xl">
            <h2 id={navDialogTitleId} className="sr-only">
              Mobile navigation
            </h2>
            <Sidebar onClose={() => setMobileNavOpen(false)} />
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setMobileNavOpen(true)}
        className="fixed left-4 top-4 z-30 inline-flex rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 lg:hidden"
        aria-label="Open navigation"
        aria-expanded={mobileNavOpen}
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="h-full lg:pl-72">
        <main id="app-layout-main" className="h-full overflow-y-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
