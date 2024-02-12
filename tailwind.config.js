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
        "licorice-xl": "#3D3029",
        "licorice-l": "#40322a",
        floral: "#FBF4EA",
        dogwood: "#CCB6A9",
        champagne: "#f5ebdd",
        mortuum: "#632B29",
        jasmine: "#F6DB65",
        licorice: "#211A16",
        accent: "#f6c615",
        "accent-dark": "#d0a508",
        "bg-normal": "#ebebeb",
      },
    },
  },
  plugins: [],
};
