import { ChevronDown, ChevronRight, LayoutGrid, X } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { moduleSidebarConfig } from '@/navigation/moduleSidebarConfig';

interface SidebarProps {
  onClose?: () => void;
}

type SidebarModuleItem = {
  label: string;
  hint: string;
  path: string;
  icon: JSX.Element;
};

type SidebarModuleGroup = {
  id: string;
  label: string;
  items: SidebarModuleItem[];
};

const moduleGroups: SidebarModuleGroup[] = moduleSidebarConfig.map((module) => ({
  id: module.title,
  label: module.title,
  items: module.items.map((item) => ({
    label: item.label,
    hint: item.description,
    path: item.route,
    icon: <item.icon className="h-5 w-5" />,
  })),
}));

function readStorageValue(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorageValue(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures in hardened browser contexts.
  }
}

export function Sidebar({ onClose }: SidebarProps) {
  const [modulesOpen, setModulesOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return readStorageValue('faithhub.sidebar.modulesOpen') !== 'false';
  });
  const dropdownId = useId();

  useEffect(() => {
    writeStorageValue('faithhub.sidebar.modulesOpen', String(modulesOpen));
  }, [modulesOpen]);

  return (
    <aside className="fh-brand-shell flex h-full w-full flex-col border-r border-[var(--fh-line)] bg-[var(--fh-surface-bg)] dark:border-[var(--fh-line)] dark:bg-[var(--fh-page-bg)]">
      <div className="flex items-center justify-between border-b border-[var(--fh-line)] px-5 py-5 dark:border-[var(--fh-line)]">
        <div className="min-w-0">
          <BrandLogo variant="landscape" alt="FaithHub Provider" className="h-12 w-auto max-w-full" />
          <p className="mt-1 text-base font-semibold text-[var(--fh-slate)] dark:text-[var(--fh-muted)]">Modules</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="fh-interactive inline-flex rounded-2xl border border-[var(--fh-line)] bg-[var(--fh-surface)] p-2.5 text-[var(--fh-slate)] hover:bg-[var(--fh-brand-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fh-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--fh-surface-bg)] dark:border-[var(--fh-line)] dark:bg-[var(--fh-surface)] dark:text-[var(--fh-muted)] dark:hover:bg-[var(--fh-surface)] dark:focus-visible:ring-offset-[var(--fh-page-bg)] lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-5" aria-label="Primary">
        <button
          type="button"
          aria-expanded={modulesOpen}
          aria-controls={dropdownId}
          onClick={() => setModulesOpen((prev) => !prev)}
          className="fh-interactive flex w-full items-center justify-between rounded-[22px] border border-[var(--fh-line)] bg-[var(--fh-surface)] px-4 py-3.5 text-left transition hover:bg-[var(--fh-brand-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fh-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--fh-surface-bg)] dark:border-[var(--fh-line)] dark:bg-[var(--fh-surface)] dark:hover:bg-[var(--fh-surface)]"
        >
          <span className="flex items-center gap-3">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--fh-brand-soft)] text-[var(--fh-brand)]">
              <LayoutGrid className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--fh-slate)]">FaithHub Provider</span>
              <span className="block text-[22px] font-bold leading-none tracking-[-0.01em] text-[var(--fh-ink)]">Provider Modules</span>
            </span>
          </span>
          <ChevronDown className={`h-6 w-6 text-[var(--fh-slate)] transition-transform ${modulesOpen ? 'rotate-180' : ''}`} />
        </button>

        <div id={dropdownId} className={`mt-5 space-y-5 ${modulesOpen ? 'block' : 'hidden'}`}>
          {moduleGroups.map((group) => (
            <section key={group.id}>
              <h3 className="px-2 pb-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--fh-slate)]">{group.label}</h3>
              <ul className="space-y-2.5" role="list">
                {group.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={() => onClose?.()}
                      aria-label={`${item.label}: ${item.hint}`}
                      className={({ isActive }) =>
                        `fh-interactive group flex w-full items-center justify-between rounded-[22px] border px-4 py-3.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fh-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--fh-surface-bg)] ${
                          isActive
                            ? 'border-2 border-[var(--fh-brand)] bg-[var(--fh-surface)] shadow-[0_10px_20px_rgba(3,205,140,0.16)] dark:bg-[var(--fh-surface)]'
                            : 'border-[var(--fh-line)] bg-[var(--fh-surface)] hover:bg-[var(--fh-brand-soft)] dark:border-[var(--fh-line)] dark:bg-[var(--fh-surface)] dark:hover:bg-[var(--fh-surface)]'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span className="flex min-w-0 items-center gap-3.5">
                            <span
                              className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                                isActive ? 'bg-[var(--fh-brand-soft)] text-[var(--fh-brand)]' : 'bg-[var(--fh-ev-light-grey)] text-[var(--fh-ev-medium-grey)]'
                              }`}
                            >
                              {item.icon}
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-[15px] font-bold leading-none tracking-[-0.01em] text-[var(--fh-ink)]">
                                {item.label}
                              </span>
                              <span className="mt-0.5 block truncate text-[12px] leading-tight text-[var(--fh-slate)]">{item.hint}</span>
                            </span>
                          </span>
                          <ChevronRight className={`h-6 w-6 shrink-0 ${isActive ? 'text-[var(--fh-accent)]' : 'text-[var(--fh-slate)]'}`} />
                        </>
                      )}
                    </NavLink>
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
