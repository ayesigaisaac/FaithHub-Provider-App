import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, CalendarClock, LayoutDashboard, Megaphone, Radio } from 'lucide-react';
import { findProviderPageByPath } from '@/navigation/providerPages';

const tabs = [
  { label: 'Dashboard', value: '/faithhub/provider/dashboard', icon: LayoutDashboard },
  { label: 'Live', value: '/faithhub/provider/live-dashboard', icon: Radio },
  { label: 'Audience', value: '/faithhub/provider/audience-notifications', icon: Bell },
  { label: 'Events', value: '/faithhub/provider/events-manager', icon: CalendarClock },
  { label: 'Beacon', value: '/faithhub/provider/beacon-dashboard', icon: Megaphone },
];

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const value = useMemo(() => {
    const page = findProviderPageByPath(location.pathname);
    if (!page) return tabs[0].value;
    const hit = tabs.find((tab) => page.path === tab.value || page.aliases?.includes(tab.value));
    if (hit) return hit.value;
    if (page.section === 'Live Sessionz Operations') return '/faithhub/provider/live-dashboard';
    if (page.section === 'Audience & Outreach') return '/faithhub/provider/audience-notifications';
    if (page.section === 'Events & Giving') return '/faithhub/provider/events-manager';
    if (page.section === 'Beacon') return '/faithhub/provider/beacon-dashboard';
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
        borderTop: '1px solid rgba(15,23,42,0.08)',
        backdropFilter: 'blur(18px)',
        bgcolor: 'rgba(255,255,255,0.94)',
      }}
    >
      <BottomNavigation value={value} onChange={(_, nextValue) => navigate(nextValue)} showLabels>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return <BottomNavigationAction key={tab.value} value={tab.value} label={tab.label} icon={<Icon size={18} />} />;
        })}
      </BottomNavigation>
    </Paper>
  );
}
