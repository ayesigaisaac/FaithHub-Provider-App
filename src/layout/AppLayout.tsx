import type { ReactNode } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppLayoutShell>{children}</AppLayoutShell>
    </SidebarProvider>
  );
}

function AppLayoutShell({ children }: AppLayoutProps) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <div className="min-h-dvh overflow-hidden bg-[linear-gradient(180deg,rgba(248,250,252,1)_0%,rgba(241,245,249,1)_100%)] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <a
        href="#app-layout-main"
        className="sr-only z-[70] rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow dark:bg-slate-900 dark:text-slate-100 focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>

      <AppSidebar />

      <main id="app-layout-main" className={`min-h-dvh overflow-y-auto transition-[padding] ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        <div className="sticky top-0 z-20 border-b border-[var(--fh-line)] bg-[color-mix(in_srgb,var(--fh-surface-bg)_90%,transparent)] px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="hidden sm:block">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--fh-slate)]">FaithHub Workspace</p>
                <p className="text-sm text-[var(--fh-slate)]">Provider dashboard</p>
              </div>
            </div>
            <span className="inline-flex items-center rounded-full border border-[var(--fh-line)] bg-[var(--fh-surface)] px-3 py-1 text-xs font-medium text-[var(--fh-slate)] shadow-sm">
              Focus mode
            </span>
          </div>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}
