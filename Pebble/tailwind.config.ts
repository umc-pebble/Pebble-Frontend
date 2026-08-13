import type { Config } from 'tailwindcss';

const semanticColor = (variableName: string) =>
  `rgb(var(${variableName}) / <alpha-value>)`;

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],

  darkMode: ['class', '[data-theme="dark"]'],

  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Apple SD Gothic Neo',
          'Noto Sans KR',
          'sans-serif',
        ],
      },

      fontSize: {
        'heading-01': [
          '40px',
          { lineHeight: '1.3', fontWeight: '700' },
        ],
        'heading-02': [
          '32px',
          { lineHeight: '1.3', fontWeight: '700' },
        ],
        'title-01-sb': [
          '28px',
          { lineHeight: '1.3', fontWeight: '600' },
        ],
        'title-01-m': [
          '28px',
          { lineHeight: '1.3', fontWeight: '500' },
        ],
        'title-02-sb': [
          '24px',
          { lineHeight: '1.3', fontWeight: '600' },
        ],
        'title-02-m': [
          '24px',
          { lineHeight: '1.3', fontWeight: '500' },
        ],
        'title-03-sb': [
          '20px',
          { lineHeight: '1.3', fontWeight: '600' },
        ],
        'title-03-m': [
          '20px',
          { lineHeight: '1.3', fontWeight: '500' },
        ],
        'body-01-sb': [
          '18px',
          { lineHeight: '1.5', fontWeight: '600' },
        ],
        'body-01-m': [
          '18px',
          { lineHeight: '1.5', fontWeight: '500' },
        ],
        'body-02-sb': [
          '16px',
          { lineHeight: '1.5', fontWeight: '600' },
        ],
        'body-02-m': [
          '16px',
          { lineHeight: '1.5', fontWeight: '500' },
        ],
        'body-03-r': [
          '14px',
          { lineHeight: '1.5', fontWeight: '400' },
        ],
        'body-04-m': [
          '13px',
          { lineHeight: '1.3', fontWeight: '500' },
        ],
        'caption-01': [
          '13px',
          { lineHeight: '1.3', fontWeight: '400' },
        ],
      },

      colors: {
        fill: {
          primary: semanticColor('--fill-primary'),
          secondary: semanticColor('--fill-secondary'),
          teritory: semanticColor('--fill-teritory'),
          surface: semanticColor('--fill-surface'),
          inverse: semanticColor('--fill-inverse'),

          danger: semanticColor('--fill-danger'),
          'danger-bg': semanticColor('--fill-danger-bg'),

          success: semanticColor('--fill-success'),
          'success-bg': semanticColor('--fill-success-bg'),

          warning: semanticColor('--fill-warning'),
          info: semanticColor('--fill-info'),
          shadow: semanticColor('--fill-shadow'),
        },

        text: {
          strong: semanticColor('--text-strong'),
          primary: semanticColor('--text-primary'),
          secondary: semanticColor('--text-secondary'),
          teritary: semanticColor('--text-teritary'),
          quaternary: semanticColor('--text-quaternary'),
          onFill: semanticColor('--text-on-fill'),
          sunday: semanticColor('--text-sunday'),
          saturday: semanticColor('--text-saturday'),
        },

        border: {
          primary: semanticColor('--border-primary'),
          selected: semanticColor('--border-selected'),
          default: semanticColor('--border-default'),
          secondary: semanticColor('--border-secondary'),
          teritory: semanticColor('--border-teritory'),
        },

        btn: {
          primary: semanticColor('--button-primary'),
          secondary: semanticColor('--button-secondary'),
          teritary: semanticColor('--button-teritary'),
          quaternary: semanticColor('--button-quaternary'),
          pressed: semanticColor('--button-pressed'),
        },

        theme: {
          '1': {
            base: 'var(--color-1-base)',
            mid: 'var(--color-1-mid)',
            light: 'var(--color-1-light)',
          },
          '2': {
            base: 'var(--color-2-base)',
            mid: 'var(--color-2-mid)',
            light: 'var(--color-2-light)',
          },
          '3': {
            base: 'var(--color-3-base)',
            mid: 'var(--color-3-mid)',
            light: 'var(--color-3-light)',
          },
          '4': {
            base: 'var(--color-4-base)',
            mid: 'var(--color-4-mid)',
            light: 'var(--color-4-light)',
          },
          '5': {
            base: 'var(--color-5-base)',
            mid: 'var(--color-5-mid)',
            light: 'var(--color-5-light)',
          },
          '6': {
            base: 'var(--color-6-base)',
            mid: 'var(--color-6-mid)',
            light: 'var(--color-6-light)',
          },
        },
      },

      spacing: {
        'token-xs': '4px',
        'token-s': '8px',
        'token-m': '12px',
        'token-l': '20px',
        'token-xl': '32px',
        'token-xxl': '40px',
      },

      borderRadius: {
        'token-xs': '4px',
        'token-s': '12px',
        'token-m': '20px',
        'token-l': '32px',
        'token-infinite': '999px',
      },

      boxShadow: {
        'shadow-m':
          '0 0 28px rgb(var(--shadow-color) / 0.08)',
        'shadow-s':
          '0 0 4px rgb(var(--shadow-color) / 0.12)',
        'shadow-noti':
          '4px 5px 20px rgb(var(--shadow-color) / 0.12)',
      },

      animation: {
        'fade-in':
          'fade-in 1s var(--animation-delay, 0s) ease forwards',
        'fade-up':
          'fade-up 0.8s var(--animation-delay, 0s) cubic-bezier(0.25,1,0.5,1) forwards',
        marquee: 'marquee var(--duration) infinite linear',
        'marquee-vertical':
          'marquee-vertical var(--duration) linear infinite',
        shimmer: 'shimmer 8s infinite',
        'image-glow': 'image-glow 1s ease forwards',
        shake: 'shake 0.2s ease-in-out 2',
      },

      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'none',
          },
        },

        'fade-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(16px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },

        marquee: {
          '0%': {
            transform: 'translate(0)',
          },
          '100%': {
            transform:
              'translateX(calc(-100% - var(--gap)))',
          },
        },

        'marquee-vertical': {
          '0%': {
            transform: 'translateY(0)',
          },
          '100%': {
            transform:
              'translateY(calc(-100% - var(--gap)))',
          },
        },

        shimmer: {
          '0%, 90%, 100%': {
            backgroundPosition:
              'calc(-100% - var(--shimmer-width)) 0',
          },
          '30%, 60%': {
            backgroundPosition:
              'calc(100% + var(--shimmer-width)) 0',
          },
        },

        'image-glow': {
          '0%': {
            opacity: '0',
            animationTimingFunction:
              'cubic-bezier(0.74,0.25,0.76,1)',
          },
          '10%': {
            opacity: '0.7',
            animationTimingFunction:
              'cubic-bezier(0.12,0.01,0.08,0.99)',
          },
          '100%': {
            opacity: '0.4',
          },
        },

        shake: {
          '0%, 100%': {
            transform: 'translateX(0)',
          },
          '25%': {
            transform: 'translateX(-4px)',
          },
          '75%': {
            transform: 'translateX(4px)',
          },
        },
      },
    },
  },

  plugins: [],
};

export default config;