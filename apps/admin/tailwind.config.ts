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
        teal: { DEFAULT: '#0F6E56', light: '#E1F5EE' },
        coral: { DEFAULT: '#993C1D', light: '#FAECE7' },
        amber: { DEFAULT: '#7A5A00', light: '#FFF4D0' },
        surface: '#F5F5F5',
        'text-primary': '#1A1A1A',
        'text-secondary': '#555555',
        'text-tertiary': '#888888',
        sidebar: '#3D1260',
        'sidebar-active': '#4A1572',
        'sidebar-text': '#C4B5D9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
