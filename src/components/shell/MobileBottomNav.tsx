import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { findProviderPageByPath } from '@/navigation/providerPages';
import { mobileBottomNavTabs, resolveMobileBottomNavValue } from '@/navigation/providerSurfaceTabs';

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const value = useMemo(() => {
    return resolveMobileBottomNavValue({ pathname: location.pathname, findProviderPageByPath });
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
        boxShadow: '0 -10px 30px -24px rgba(15, 23, 42, 0.28)',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(15,23,42,0.94)' : 'rgba(255,255,255,0.94)'),
      }}
    >
      <BottomNavigation
        aria-label="Primary mobile navigation"
        value={value}
        onChange={(_, nextValue) => navigate(nextValue)}
        showLabels
        sx={{
          minHeight: 64,
          px: 0.5,
          py: 0.35,
          bgcolor: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 0,
            paddingTop: 0.5,
            paddingBottom: 0.45,
            color: 'var(--fh-slate)',
            '&.Mui-selected': {
              color: 'var(--fh-brand)',
            },
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.02em',
            '&.Mui-selected': {
              fontSize: 11.2,
            },
          },
        }}
      >
        {mobileBottomNavTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <BottomNavigationAction
              key={tab.value}
              value={tab.value}
              label={tab.label}
              aria-label={tab.label}
              icon={<Icon fontSize="small" />}
            />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
}
