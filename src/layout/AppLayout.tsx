import type { ReactNode } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="h-screen overflow-hidden bg-slate-100 text-slate-900">
        <a
          href="#app-layout-main"
          className="sr-only z-[70] rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
        >
          Skip to main content
        </a>

        <AppSidebar />

        <main id="app-layout-main" className="h-full overflow-y-auto lg:pl-72">
          <div className="p-4 lg:hidden">
            <SidebarTrigger />
          </div>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
