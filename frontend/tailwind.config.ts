import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FDFBF7',
        ivory: '#F7F2EA',
        sand: '#EFE6DA',
        rose: {
          50: '#FCF5F2',
          100: '#F7E7E0',
          200: '#EFD1C4',
          300: '#E3B6A3',
          400: '#D49A83',
          500: '#C08063',
          600: '#A8654A',
        },
        gold: {
          100: '#F4E9D2',
          200: '#E8D4A9',
          300: '#D9BC7B',
          400: '#C9A227',
          500: '#B08D3F',
          600: '#8C6F2E',
        },
        charcoal: {
          50: '#F5F5F4',
          400: '#6B6660',
          600: '#413D39',
          800: '#26231F',
          900: '#171512',
        },
      },
      fontFamily: {
        serif: ['var(--font-display)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.22em',
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(38, 35, 31, 0.12)',
        lift: '0 24px 60px -20px rgba(38, 35, 31, 0.25)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        shimmer: 'shimmer 1.8s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
