import { X } from 'lucide-react';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { NavItem } from '@/components/ui/NavItem';
import { sidebarSections } from '@/navigation/sidebarConfig';

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
        <BrandLogo variant="landscape" alt="FaithHub Provider" className="h-10 w-auto" />
        <button
          type="button"
          onClick={onClose}
          className="inline-flex rounded-[12px] p-2 text-slate-500 transition-colors hover:bg-slate-100 lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4" aria-label="Sidebar Navigation">
        <div className="space-y-5">
          {sidebarSections.map((section) => (
            <section key={section.id}>
              <h2 className="mb-2 px-2 text-[11px] font-semibold tracking-[0.14em] text-slate-400">{section.title}</h2>
              <ul className="space-y-1" role="list">
                {section.items.map((item) => (
                  <li key={item.path}>
                    <NavItem label={item.label} path={item.path} onClose={onClose} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </nav>
    </aside>
  );
}