/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        flipkart: {
          blue: '#2874f0',
          'blue-dark': '#1a5dc8',
          'blue-light': '#e8f0fe',
          yellow: '#f9c74f',
          'yellow-dark': '#f7a800',
          orange: '#ff6161',
          green: '#388e3c',
          gray: '#f1f3f6',
          'gray-dark': '#878787',
          'text-dark': '#212121',
          'text-medium': '#484848',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.1)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.15)',
        'navbar': '0 2px 8px rgba(0,0,0,0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { transform: 'translateY(20px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
        pulseSoft: { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.7 } }
      }
    },
  },
  plugins: [],
}
