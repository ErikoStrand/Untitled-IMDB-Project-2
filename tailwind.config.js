/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        heebo: ['"Heebo"', "sans-serif"],
        quicksand: ['"Quicksand"', "sans-serif"],
        archivo: ['"Archivo"', "sans-serif"],
      },
      colors: {
        accent: "#f6c615",
        "accent-dark": "#d0a508",
        "bg-normal": "#ebebeb",
      },
    },
  },
  plugins: [],
};
