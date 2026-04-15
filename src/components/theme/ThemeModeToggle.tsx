import { IconButton, Tooltip } from '@mui/material';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { useThemeMode } from '@/contexts/ThemeModeContext';

type ThemeModeToggleProps = {
  size?: 'small' | 'medium' | 'large';
};

export function ThemeModeToggle({ size = 'medium' }: ThemeModeToggleProps) {
  const { mode, toggleMode } = useThemeMode();
  const nextModeLabel = mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <Tooltip title={nextModeLabel}>
      <IconButton aria-label={nextModeLabel} onClick={toggleMode} size={size} color="inherit">
        {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
      </IconButton>
    </Tooltip>
  );
}
