import { Menu, X } from 'lucide-react';
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

type SidebarContextValue = {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (value: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (value: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

function useIsMobileBreakpoint(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    if (typeof window.matchMedia !== 'function') return false;
    return window.matchMedia('(max-width: 1023px)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return isMobile;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const isMobile = useIsMobileBreakpoint();
  const [open, setOpen] = useState(true);
  const [openMobile, setOpenMobile] = useState(false);

  useEffect(() => {
    if (!openMobile) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMobile(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openMobile]);

  const value = useMemo<SidebarContextValue>(
    () => ({
      state: open ? 'expanded' : 'collapsed',
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar: () => {
        if (isMobile) {
          setOpenMobile((prev) => !prev);
          return;
        }
        setOpen((prev) => !prev);
      },
    }),
    [isMobile, open, openMobile],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return ctx;
}

export function SidebarTrigger({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggleSidebar, isMobile, open, openMobile } = useSidebar();
  const isExpanded = isMobile ? openMobile : open;

  return (
    <button
      type="button"
      aria-label="Open navigation"
      aria-expanded={isExpanded}
      onClick={toggleSidebar}
      className={`inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${className}`.trim()}
      {...props}
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}

export function Sidebar({ children, className = '', ...props }: HTMLAttributes<HTMLElement>) {
  const { open, openMobile, setOpenMobile, isMobile } = useSidebar();
  const dialogTitleId = useId();

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-slate-200 bg-[#f4f6f6] transition-[width] lg:block ${
          open ? 'w-72' : 'w-20'
        } ${className}`.trim()}
        data-state={open ? 'expanded' : 'collapsed'}
        {...props}
      >
        {children}
      </aside>

      {isMobile && openMobile ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-labelledby={dialogTitleId}>
          <button
            type="button"
            onClick={() => setOpenMobile(false)}
            className="absolute inset-0 bg-slate-900/35"
            aria-label="Close navigation overlay"
          />
          <div className="relative h-full w-72 border-r border-slate-200 bg-[#f4f6f6] shadow-xl">
            <h2 id={dialogTitleId} className="sr-only">
              Mobile navigation
            </h2>
            <button
              type="button"
              onClick={() => setOpenMobile(false)}
              className="absolute right-3 top-3 inline-flex rounded-xl border border-slate-300 bg-white p-2 text-slate-600"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
            {children}
          </div>
        </div>
      ) : null}
    </>
  );
}

export function SidebarHeader({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`border-b border-slate-200 px-5 py-5 ${className}`.trim()} {...props} />;
}

export function SidebarContent({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex-1 overflow-y-auto p-5 ${className}`.trim()} {...props} />;
}

export function SidebarGroup({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <section className={`mb-5 ${className}`.trim()} {...props} />;
}

export function SidebarFooter({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`border-t border-slate-200 px-5 py-4 ${className}`.trim()} {...props} />;
}

export function SidebarGroupLabel({ className = '', ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`px-2 pb-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-400 ${className}`.trim()} {...props} />;
}

export function SidebarGroupContent({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`space-y-2 ${className}`.trim()} {...props} />;
}
