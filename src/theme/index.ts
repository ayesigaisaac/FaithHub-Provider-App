import { createTheme, alpha } from '@mui/material/styles';
import { brandTokens } from './tokens';

export const theme = createTheme({
  palette: {
    mode: 'light',
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
      primary: brandTokens.ink,
      secondary: brandTokens.slate,
    },
    divider: alpha(brandTokens.ink, 0.08),
    background: {
      default: '#f4f8f6',
      paper: brandTokens.paper,
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: [
      'Inter',
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'sans-serif',
    ].join(','),
    h1: { fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em' },
    h2: { fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em' },
    h3: { fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--fh-brand': brandTokens.green,
          '--fh-brand-dark': brandTokens.greenDark,
          '--fh-accent': brandTokens.orange,
          '--fh-line': brandTokens.line,
          '--fh-surface': brandTokens.surface,
        },
        body: {
          background:
            'radial-gradient(circle at 0% 0%, rgba(3,205,140,0.08), transparent 22%), radial-gradient(circle at 100% 0%, rgba(247,127,0,0.07), transparent 18%), #f4f8f6',
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
