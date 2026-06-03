import { createTheme, alpha } from '@mui/material/styles';
import { brandTokens, designTokens, getCssThemeVariables } from './tokens';
import type { PaletteMode } from '@mui/material';

export function createAppTheme(mode: PaletteMode) {
  const isDark = mode === 'dark';
  const cssThemeVariables = getCssThemeVariables(mode);

  return createTheme({
  palette: {
    mode,
    primary: {
      main: brandTokens.green,
      dark: brandTokens.greenDark,
      light: '#53e6b4',
      contrastText: '#05221a',
    },
    secondary: {
      main: brandTokens.orange,
      light: '#ffb867',
      dark: '#d36600',
      contrastText: '#271100',
    },
    success: {
      main: brandTokens.greenDark,
    },
    warning: {
      main: brandTokens.orange,
    },
    text: {
      primary: isDark ? '#f5f7fb' : brandTokens.ink,
      secondary: isDark ? '#aabbd2' : brandTokens.slate,
    },
    divider: alpha(isDark ? '#ffffff' : brandTokens.ink, isDark ? 0.16 : 0.08),
    background: {
      default: isDark ? '#08111d' : '#f4f8f6',
      paper: isDark ? '#0e172a' : brandTokens.paper,
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: designTokens.typography.fontFamily,
    h1: { fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em' },
    h2: { fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em' },
    h3: { fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          ...cssThemeVariables,
        },
        body: {
          background: isDark
            ? 'radial-gradient(circle at 0% 0%, rgba(3,205,140,0.16), transparent 24%), radial-gradient(circle at 100% 0%, rgba(247,127,0,0.12), transparent 22%), linear-gradient(180deg, #08111d 0%, #0e172a 100%)'
            : 'radial-gradient(circle at 0% 0%, rgba(3,205,140,0.08), transparent 22%), radial-gradient(circle at 100% 0%, rgba(247,127,0,0.07), transparent 18%), #f4f8f6',
        },
        '#root': {
          minHeight: '100vh',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});
}
