const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
    extend: {
      fontFamily: {
        sans: ['museo-sans', ...defaultTheme.fontFamily.sans],
        serif: ['museo-slab', ...defaultTheme.fontFamily.serif],
      },
    },
  },

  plugins: [],
}
