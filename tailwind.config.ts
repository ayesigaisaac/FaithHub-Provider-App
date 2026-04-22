import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--fh-brand)',
          dark: 'var(--fh-brand-dark)',
          soft: 'var(--fh-brand-soft)',
        },
        accent: {
          DEFAULT: 'var(--fh-accent)',
          soft: 'var(--fh-accent-soft)',
        },
        faith: {
          ink: 'var(--fh-ink)',
          slate: 'var(--fh-slate)',
          line: 'var(--fh-line)',
          mist: 'var(--fh-surface)',
        },
      },
      boxShadow: {
        faith: 'var(--fh-shadow-lg)',
        glow: 'var(--fh-shadow-glow)',
        soft: 'var(--fh-shadow-sm)',
        medium: 'var(--fh-shadow-md)',
      },
      borderRadius: {
        sm: 'var(--fh-radius-sm)',
        DEFAULT: 'var(--fh-radius-md)',
        md: 'var(--fh-radius-md)',
        lg: 'var(--fh-radius-lg)',
        xl: 'var(--fh-radius-xl)',
        '2xl': 'var(--fh-radius-2xl)',
        '3xl': 'var(--fh-radius-3xl)',
        '4xl': 'calc(var(--fh-radius-3xl) + 2px)',
      },
      fontFamily: {
        sans: ['var(--fh-font-family)', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        xs: 'var(--fh-font-size-xs)',
        sm: 'var(--fh-font-size-sm)',
        base: 'var(--fh-font-size-md)',
        lg: 'var(--fh-font-size-lg)',
        xl: 'var(--fh-font-size-xl)',
        '2xl': 'var(--fh-font-size-2xl)',
        '3xl': 'var(--fh-font-size-3xl)',
      },
    },
  },
  plugins: [],
} satisfies Config;
