/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fashion-black': '#000000',
        'fashion-white': '#F5F5F5',
        'fashion-gray': {
          light: '#4A4A4A',
          dark: '#2A2A2A',
        },
        'fashion-accent': '#2C1810',
      },
    },
  },
  plugins: [],
} 