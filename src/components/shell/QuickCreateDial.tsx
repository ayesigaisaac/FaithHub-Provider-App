import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { providerPages } from '@/navigation/providerPages';

const quickActions = providerPages.filter((page) => page.quickAction && !page.hidden);

export function QuickCreateDial() {
  const navigate = useNavigate();

  return (
    <SpeedDial
      ariaLabel="FaithHub quick create"
      icon={<SpeedDialIcon />}
      sx={{
        position: 'fixed',
        right: { xs: 16, md: 28 },
        bottom: { xs: 88, md: 28 },
        '& .MuiFab-primary': {
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          boxShadow: '0 18px 36px rgba(3,205,140,0.25)',
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
