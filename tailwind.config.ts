import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#070A0F',
          900: '#0A0E14',
          850: '#0E131B',
          800: '#12181F',
          700: '#1A222C',
          600: '#242F3D',
        },
        volt: {
          400: '#5EA1FF',
          500: '#2F80FF',
          600: '#1B63E0',
          700: '#124BB3',
          glow: '#7CC2FF',
        },
        copper: {
          400: '#F0A85C',
          500: '#D9822B',
          600: '#B8631A',
          700: '#8F4C14',
        },
        ink: {
          100: '#EDF1F7',
          300: '#B7C2D0',
          500: '#7E8CA0',
          700: '#4B5768',
        },
        safety: {
          amber: '#F5B400',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'circuit-grid': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%232F80FF' stroke-opacity='0.06'%3E%3Cpath d='M0 30h60M30 0v60'/%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'volt-glow': '0 0 40px -10px rgba(47,128,255,0.55)',
        'copper-glow': '0 0 40px -10px rgba(217,130,43,0.5)',
        'card': '0 8px 30px -12px rgba(0,0,0,0.6)',
      },
      keyframes: {
        pulseLine: {
          '0%': { strokeDashoffset: '240' },
          '100%': { strokeDashoffset: '0' },
        },
        flicker: {
          '0%,100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.4' },
          '94%': { opacity: '1' },
        },
        floatY: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        pulseLine: 'pulseLine 2.4s linear infinite',
        flicker: 'flicker 4s ease-in-out infinite',
        floatY: 'floatY 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
