import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 1. 타이포그래피
      fontSize: {
        'heading-01': ['40px', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-02': ['32px', { lineHeight: '1.3', fontWeight: '700' }],
        'title-01-sb': ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        'title-01-m': ['28px', { lineHeight: '1.3', fontWeight: '500' }],
        'title-02-sb': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'title-02-m': ['24px', { lineHeight: '1.3', fontWeight: '500' }],
        'title-03-sb': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        'title-03-m': ['20px', { lineHeight: '1.3', fontWeight: '500' }],
        'body-01-sb': ['18px', { lineHeight: '1.5', fontWeight: '600' }],
        'body-01-m': ['18px', { lineHeight: '1.5', fontWeight: '500' }],
        'body-02-sb': ['16px', { lineHeight: '1.5', fontWeight: '600' }],
        'body-02-m': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
        'body-03-r': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption-01': ['13px', { lineHeight: '1.3', fontWeight: '400' }],
      },
      // 2. 색상 시스템
      colors: {
        fill: {
          primary: '#171717', secondary: '#a3a3a3', teritory: '#e5e5e5',
          surface: '#fafafa', inverse: '#ffffff', danger: '#fc4c46',
          'danger-bg': '#fee7da', success: '#0da471', 'success-bg': '#cefbd5',
          warning: '#e8ae02', info: '#3059ff',
        },
        text: {
          strong: '#171717', primary: '#404040', secondary: '#737373',
          teritary: '#a3a3a3', quaternary: '#d4d4d4', onFill: '#ffffff',
          sunday: '#fea68f', saturday: '#82a0ff',
        },
        border: {
          primary: '#171717', selected: '#737373', default: '#d4d4d4',
        },
        btn: {
          primary: '#171717', secondary: '#404040', teritary: '#737373',
          quaternary: '#f5f5f5', pressed: 'rgba(23, 23, 23, 0.1)',
        },
        // 테마 색상 연동 구조
        theme: {
          '1': { base: 'var(--color-1-base)', mid: 'var(--color-1-mid)', light: 'var(--color-1-light)' },
          '2': { base: 'var(--color-2-base)', mid: 'var(--color-2-mid)', light: 'var(--color-2-light)' },
          '3': { base: 'var(--color-3-base)', mid: 'var(--color-3-mid)', light: 'var(--color-3-light)' },
          '4': { base: 'var(--color-4-base)', mid: 'var(--color-4-mid)', light: 'var(--color-4-light)' },
          '5': { base: 'var(--color-5-base)', mid: 'var(--color-5-mid)', light: 'var(--color-5-light)' },
          '6': { base: 'var(--color-6-base)', mid: 'var(--color-6-mid)', light: 'var(--color-6-light)' },
        }
      },
      // 3. 토큰: 여백
      spacing: {
        'token-xs': '4px',
        'token-s': '8px',
        'token-m': '12px',
        'token-l': '20px',
        'token-xl': '32px',
        'token-xxl': '40px',
      },
      // 4. 토큰: 모서리 둥글기
      borderRadius: {
        'token-xs': '4px',
        'token-s': '12px',
        'token-m': '20px',
        'token-l': '32px',
        'token-infinite': '999px',
      },
    },
  },
  plugins: [],
};

export default config;