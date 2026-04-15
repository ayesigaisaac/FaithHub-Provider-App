import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#03cd8c',
          dark: '#00b57a',
          soft: '#d7f5e8',
        },
        accent: {
          DEFAULT: '#f77f00',
          soft: '#fff1df',
        },
        faith: {
          ink: '#0f172a',
          slate: '#64748b',
          line: '#e2e8f0',
          mist: '#f8fafc',
        },
      },
      boxShadow: {
        faith: '0 20px 45px rgba(2, 15, 23, 0.08)',
        glow: '0 18px 40px rgba(3, 205, 140, 0.14)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
