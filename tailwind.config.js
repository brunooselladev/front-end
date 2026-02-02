/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#3DCF9E',
        secondary: '#A3C9F9',
        danger: '#DC2626',
      },
    },
  },
  plugins: [],
}

