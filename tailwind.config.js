const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Museo Sans"', ...defaultTheme.fontFamily.sans],
        serif: ['"Museo"', ...defaultTheme.fontFamily.serif],
      },
    },
  },

  plugins: [],
}
