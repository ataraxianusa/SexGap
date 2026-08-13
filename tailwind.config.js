/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'] },
      colors: {
        brand: {
          teal: '#0E4B55',
          coral: '#E2622B',
          amber: '#F2A33C',
          crimson: '#9A1B2E',
          cream: '#FAF5EC',
          ink: '#1C2B29',
          line: '#E5D9C8'
        }
      }
    }
  },
  plugins: []
};
