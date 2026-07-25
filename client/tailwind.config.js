/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        rose: {
          500: '#f43f5e',
          600: '#e11d48',
        },
        dark: {
          bg: '#0b0f17',
          card: '#151c28',
          border: '#222d3d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        pulseBreath: 'pulseBreath 16s ease-in-out infinite',
      },
      keyframes: {
        pulseBreath: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '25%': { transform: 'scale(1.4)', opacity: '0.9' },
          '50%': { transform: 'scale(1.4)', opacity: '0.9' },
          '75%': { transform: 'scale(1)', opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
};
