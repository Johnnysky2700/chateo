/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#002DE3',
        "secondary-100": "#E2E2D5",
        "secondary-200": "#888883",
      },
    },
  },
  plugins: [],
}
