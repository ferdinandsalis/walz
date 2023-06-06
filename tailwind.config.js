const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['museo-sans', ...defaultTheme.fontFamily.sans],
        serif: ['museo-slab', ...defaultTheme.fontFamily.serif],
      },
    },
  },

  plugins: [],
}
