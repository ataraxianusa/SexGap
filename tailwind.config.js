/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'] },
      colors: {
        brand: {
          teal: '#0F4C5C',
          coral: '#E36414',
          amber: '#FB8B24',
          crimson: '#9A031E',
          cream: '#FDFBF7',
          softgray: '#F1F5F9',
          dark: '#1E293B'
        }
      }
    }
  },
  plugins: []
};
