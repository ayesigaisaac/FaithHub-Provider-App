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
    <div className="h-screen overflow-hidden bg-slate-100 text-slate-900">
      <a
        href="#app-layout-main"
        className="sr-only z-[70] rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>

      <AppSidebar />

      <main id="app-layout-main" className={`h-full overflow-y-auto transition-[padding] ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        <div className="p-4">
          <SidebarTrigger />
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
