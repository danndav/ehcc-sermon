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
          purple: '#534AB7',
          'purple-light': '#EEEDFE',
          'purple-dark': '#26215C',
          'purple-mid': '#AFA9EC',
        },
        surface: '#F5F5F5',
        'text-primary': '#1A1A1A',
        'text-secondary': '#555555',
        'text-tertiary': '#888888',
        'success-green': '#085041',
        'success-green-light': '#E1F5EE',
        'warning-amber': '#633806',
        'warning-amber-light': '#FAEEDA',
        'error-red': '#A32D2D',
        sidebar: '#26215C',
        'sidebar-active': '#534AB7',
        'sidebar-text': '#AFA9EC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
