/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'hero_dog': "url('/assets/images/galaxyDog.jpg')",
      },
      colors: {
        'brand': {
          purple: '#9B7CB9',
          peach: '#FFCDB1',
          light: '#F5F0FF',
        }
      },
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(-2%)' },
          '50%': { transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.5s ease-out',
        'bounce-subtle': 'bounce-subtle 2s infinite'
      }
    }
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: ["light"],
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  }
}
