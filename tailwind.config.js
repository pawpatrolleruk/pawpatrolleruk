/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.{html,js}",
    "./src/**/*.{js,ts,jsx,tsx,css}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero_dog': "url('/assets/images/galaxyDog.jpg')",
      },
      colors: {
        'brand-purple': '#6a1b9a',
        'brand-purple-dark': '#4a148c',
        'brand-light': '#f5f5f5',
        'brand-peach': '#ffccbc',
      },
      fontFamily: {
        'fredoka': ['"Fredoka"', 'sans-serif'],
        'poppins': ['"Poppins"', 'sans-serif'],
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
