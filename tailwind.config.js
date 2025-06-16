/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        notion: {
          gray: {
            50: '#f7f6f3',
            100: '#f1f1ee',
            200: '#e9e9e6',
            300: '#d8d8d5',
            400: '#b8b8b5',
            500: '#9b9b98',
            600: '#8d8d8a',
            700: '#7d7d7a',
            800: '#6f6f6c',
            900: '#5f5f5c',
          },
        },
      },
    },
  },
  plugins: [],
}