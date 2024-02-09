/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        accent: "#f6c615",
        "accent-dark": "#d0a508",
        "bg-normal": "#ebebeb",
      },
    },
  },
  plugins: [require("daisyui")],
};
