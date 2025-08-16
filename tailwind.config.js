/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        // agora você pode usar class="shadow-soft"
        soft: '0 10px 25px -10px rgb(0 0 0 / 0.15), 0 4px 10px -6px rgb(0 0 0 / 0.10)',
      },
      container: {
        center: true,
        padding: '1rem',
        screens: { lg: '1024px', xl: '1200px' },
      },
    },
  },
  plugins: [],
};
