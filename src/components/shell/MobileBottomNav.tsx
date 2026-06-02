import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, LayoutDashboard, Megaphone, Radio } from 'lucide-react';
import { findProviderPageByPath } from '@/navigation/providerPages';

const tabs = [
  { label: 'Dashboard', value: '/faithhub/provider/dashboard', icon: LayoutDashboard },
  { label: 'Services', value: '/faithhub/provider/services', icon: BriefcaseBusiness },
  { label: 'Campaigns', value: '/faithhub/provider/campaigns', icon: Megaphone },
  { label: 'Live', value: '/faithhub/provider/live-dashboard', icon: Radio },
];

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const value = useMemo(() => {
    const page = findProviderPageByPath(location.pathname);
    if (!page) return tabs[0].value;
    const hit = tabs.find((tab) => page.path === tab.value || page.aliases?.includes(tab.value));
    if (hit) return hit.value;
    if (page.section === 'Provider Journey') return '/faithhub/provider/services';
    if (page.section === 'Live Sessions Operations') return '/faithhub/provider/live-dashboard';
    return '/faithhub/provider/dashboard';
  }, [location.pathname]);

  return (
    <Paper
      elevation={0}
      sx={{
        display: { xs: 'block', md: 'none' },
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1200,
        borderTop: '1px solid',
        borderTopColor: 'divider',
        backdropFilter: 'blur(18px)',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(15,23,42,0.94)' : 'rgba(255,255,255,0.94)'),
      }}
    >
      <BottomNavigation aria-label="Primary mobile navigation" value={value} onChange={(_, nextValue) => navigate(nextValue)} showLabels>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <BottomNavigationAction
              key={tab.value}
              value={tab.value}
              label={tab.label}
              aria-label={tab.label}
              icon={<Icon size={18} />}
            />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
}
