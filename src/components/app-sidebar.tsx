import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { NavItem } from '@/components/ui/NavItem';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { sidebarSections } from '@/navigation/sidebarConfig';

export function AppSidebar() {
  const { setOpenMobile, isMobile, state } = useSidebar();
  const collapsed = state === 'collapsed';
  const [helpOpen, setHelpOpen] = useState(true);

  const handleItemClose = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar>
      <div className="flex h-full flex-col">
        <SidebarHeader className={collapsed ? 'px-3 py-4' : ''}>
          {collapsed ? (
            <div className="flex items-center justify-center">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 text-sm font-bold">
                F
              </div>
            </div>
          ) : (
            <BrandLogo variant="landscape" alt="FaithHub Provider" className="h-10 w-auto" />
          )}
        </SidebarHeader>

        <SidebarContent>
          {sidebarSections.map((section) => (
            <SidebarGroup key={section.id}>
              {!collapsed ? <SidebarGroupLabel>{section.title}</SidebarGroupLabel> : null}
              <SidebarGroupContent>
                {section.items.map((item) => (
                  <NavItem
                    key={item.path}
                    label={collapsed ? item.label.charAt(0).toUpperCase() : item.label}
                    path={item.path}
                    onClose={handleItemClose}
                  />
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter>
          {!collapsed ? (
            <>
              <button
                type="button"
                onClick={() => setHelpOpen((prev) => !prev)}
                className="flex w-full items-center rounded-lg px-2 py-1.5 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 hover:bg-slate-100"
              >
                Help
                <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${helpOpen ? 'rotate-180' : ''}`} />
              </button>
              {helpOpen ? (
                <div className="mt-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                  Use the menu to navigate provider modules quickly.
                </div>
              ) : null}
            </>
          ) : (
            <div className="text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Help</div>
          )}
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
