import { SpeedDial, SpeedDialAction, SpeedDialIcon, useMediaQuery, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { providerPages } from '@/navigation/providerPages';
import { providerRoutes } from '@/navigation/providerRoutes';

const quickActions = providerPages.filter((page) => page.quickAction && !page.hidden);

export function QuickCreateDial() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const isProviderDashboard = location.pathname === providerRoutes.dashboard;

  if (isProviderDashboard && !isMobile) {
    return null;
  }

  return (
    <SpeedDial
      ariaLabel="FaithHub Provider quick create"
      icon={<SpeedDialIcon />}
      sx={{
        position: 'fixed',
        right: { xs: 16, md: 28 },
        bottom: { xs: 88, md: 24 },
        '& .MuiFab-primary': {
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          boxShadow: '0 14px 28px rgba(3,205,140,0.22)',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        },
      }}
    >
      {quickActions.map((page) => {
        const Icon = page.icon;
        return (
          <SpeedDialAction
            key={page.key}
            icon={<Icon size={18} />}
            tooltipTitle={page.title}
            onClick={() => navigate(page.path)}
          />
        );
      })}
    </SpeedDial>
  );
}

