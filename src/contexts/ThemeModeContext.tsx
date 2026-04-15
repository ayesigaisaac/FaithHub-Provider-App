import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { PaletteMode } from '@mui/material';
import { createAppTheme } from '@/theme';

type ThemeModeContextValue = {
  mode: PaletteMode;
  toggleMode: () => void;
  setMode: (mode: PaletteMode) => void;
};

const STORAGE_KEY = 'fh-provider-theme-mode';

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined);

function getInitialMode(): PaletteMode {
  if (typeof window === 'undefined') return 'light';

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;

  if (typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  return 'light';
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<PaletteMode>(getInitialMode);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.toggle('dark', mode === 'dark');
    root.setAttribute('data-theme', mode);
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const setMode = useCallback((nextMode: PaletteMode) => {
    setModeState(nextMode);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((current) => (current === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo(() => ({ mode, toggleMode, setMode }), [mode, setMode, toggleMode]);
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
}
