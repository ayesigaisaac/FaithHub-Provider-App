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
  const { setOpenMobile, isMobile } = useSidebar();
  const [helpOpen, setHelpOpen] = useState(true);

  const handleItemClose = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar>
      <div className="flex h-full flex-col">
        <SidebarHeader>
          <BrandLogo variant="landscape" alt="FaithHub Provider" className="h-10 w-auto" />
        </SidebarHeader>

        <SidebarContent>
          {sidebarSections.map((section) => (
            <SidebarGroup key={section.id}>
              <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                {section.items.map((item) => (
                  <NavItem key={item.path} label={item.label} path={item.path} onClose={handleItemClose} />
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter>
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
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
