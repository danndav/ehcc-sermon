import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#4A1572',
          'purple-light': '#F3EAF9',
          'purple-dark': '#3D1260',
          'purple-mid': '#9B59B6',
        },
        teal: {
          DEFAULT: '#0F6E56',
          light: '#E1F5EE',
        },
        coral: {
          DEFAULT: '#993C1D',
          light: '#FAECE7',
        },
        amber: {
          DEFAULT: '#7A5A00',
          light: '#FFF4D0',
        },
        surface: '#F5F5F5',
        'text-primary': '#1A1A1A',
        'text-secondary': '#555555',
        'text-tertiary': '#888888',
        'teams-blue': '#4A4BAD',
        'live-red': '#E24B4A',
        'transcript-blue': '#378ADD',
        'transcript-bg': '#EBF4FF',
        hero: '#1B1B3A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        component: '8px',
        pill: '20px',
        md: '6px',
      },
      fontSize: {
        'page-title': ['22px', { lineHeight: '1.3', fontWeight: '500' }],
        'section-heading': ['16px', { lineHeight: '1.4', fontWeight: '500' }],
        'card-title': ['14px', { lineHeight: '1.4', fontWeight: '500' }],
        body: ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        metadata: ['11px', { lineHeight: '1.4', fontWeight: '400' }],
        tag: ['10px', { lineHeight: '1.4', fontWeight: '400' }],
        btn: ['13px', { lineHeight: '1', fontWeight: '500' }],
        caption: ['10px', { lineHeight: '1.4', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
};

export default config;
