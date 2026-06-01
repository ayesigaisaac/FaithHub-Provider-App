import { ChevronDown, ChevronLeft, ChevronRight, HeartHandshake, Radio, Users, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';

type SectionRow = {
  id: string;
  label: string;
  icon: typeof HeartHandshake;
};

const sectionRows: SectionRow[] = [
  { id: 'giving', label: 'GIVING', icon: HeartHandshake },
  { id: 'post-live', label: 'POST-LIVE', icon: Radio },
  { id: 'revelight', label: 'REVELIGHT', icon: Zap },
  { id: 'community', label: 'COMMUNITY', icon: Users },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setOpenMobile, isMobile, state, toggleSidebar } = useSidebar();
  const collapsed = state === 'collapsed';
  const [openSectionId, setOpenSectionId] = useState('community');

  const communityItems = useMemo(
    () => [
      { label: 'Community Groups', path: '/faithhub/provider/community-groups', hint: 'Community Groups workspace tools' },
      { label: 'Prayer Requests', path: '/faithhub/provider/prayer-requests', hint: 'Prayer Requests workspace tools' },
      { label: 'Community Forum', path: '/faithhub/provider/community-forum', hint: 'Community Forum workspace tools' },
    ],
    [],
  );

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar className={collapsed ? 'px-2 py-3' : 'px-3 py-4'}>
      <div className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-300 bg-slate-100/95">
        {!isMobile ? (
          <button
            type="button"
            onClick={toggleSidebar}
            className="absolute -right-4 top-6 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow hover:bg-slate-50"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        ) : null}

        <SidebarHeader className={`${collapsed ? 'px-2 py-4' : 'px-4 py-4'} border-b-slate-300`}>
          {collapsed ? (
            <div className="flex items-center justify-center">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 text-sm font-bold">
                F
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <BrandLogo variant="landscape" alt="FaithHub Provider" className="h-10 w-auto" />
            </div>
          )}
        </SidebarHeader>

        <SidebarContent className={collapsed ? 'p-2' : 'p-3'}>
          {collapsed ? (
            <button
              type="button"
              onClick={toggleSidebar}
              className="mx-auto mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          ) : null}

          <div className={`space-y-2 ${collapsed ? 'mt-3' : ''}`}>
            {sectionRows.map((row) => {
              const Icon = row.icon;
              const isOpen = openSectionId === row.id && !collapsed;
              return (
                <div key={row.id} className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setOpenSectionId((prev) => (prev === row.id ? '' : row.id))}
                    className={`group flex w-full items-center rounded-2xl px-3 py-3 text-left transition ${
                      isOpen ? 'bg-slate-200' : 'hover:bg-slate-200/70'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isOpen ? 'text-amber-500' : 'text-slate-500 group-hover:text-slate-700'}`} />
                    {!collapsed ? (
                      <span className="ml-3 text-[25px] font-semibold tracking-[0.12em] text-slate-600">{row.label}</span>
                    ) : null}
                    {!collapsed ? (
                      <ChevronDown className={`ml-auto h-4 w-4 text-slate-500 transition-transform ${isOpen ? '-rotate-180' : ''}`} />
                    ) : null}
                  </button>

                  {isOpen ? (
                    <div className="space-y-2 px-1">
                      {communityItems.map((item) => {
                        const active = pathname === item.path || pathname.startsWith(`${item.path}/`);
                        return (
                          <button
                            key={item.path}
                            type="button"
                            onClick={() => handleNavigate(item.path)}
                            className={`w-full rounded-2xl border px-3 py-3 text-left ${
                              active
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                                : 'border-slate-300 bg-slate-50 text-slate-800 hover:bg-white'
                            }`}
                          >
                            <div className="text-lg font-semibold leading-6">{item.label}</div>
                            <div className="mt-1 text-base leading-5 text-slate-500">{item.hint}</div>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
