/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",                 // Include your main HTML file
    "./src/**/*.{js,ts,jsx,tsx}",   // Include all relevant files in `src/`
  ],
  theme: {
    extend: {},
  },
  plugins: [require('tailwind-scrollbar'), require("@tailwindcss/typography")],
};
