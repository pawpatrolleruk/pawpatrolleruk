/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js}",          // keep root files
    "./src/**/*.{html,js,ts,jsx,tsx,css}" // NEW – now scans components & pages
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}