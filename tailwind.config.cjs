/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js}",
    "./src/**/*.{js,ts,jsx,tsx,css}"
  ],
  theme: {
    extend: {
      colors: {
        'brand-purple': '#6a1b9a',
        'brand-purple-dark': '#4a148c',
        'brand-light': '#f5f5f5',
        'brand-peach': '#ffccbc',
      },
      fontFamily: {
        'fredoka': ['"Fredoka"', 'sans-serif'],
        'poppins': ['"Poppins"', 'sans-serif'],
      }
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
      }
    }
  },
  plugins: []
}
