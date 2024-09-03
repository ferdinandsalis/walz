import containerQueryPlugin from '@tailwindcss/container-queries'
import { type Config } from 'tailwindcss'
import animatePlugin from 'tailwindcss-animate'
import radixPlugin from 'tailwindcss-radix'
import { extendedTheme } from '#app/utils/extended-theme.ts'

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    screens: {
      sm: '600px',
      md: '768px',
      lg: '896px',
      xl: '1160px',
    },
    // @ts-ignore
    extend: extendedTheme,
  },
  plugins: [animatePlugin, radixPlugin, containerQueryPlugin],
} satisfies Config
