import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  css: { postcss: { plugins: [] } },
  test: {
    include: ['./app/**/*.test.{ts,tsx}', './other/**/*.test.ts'],
    setupFiles: ['./tests/setup/setup-test-env.ts'],
    restoreMocks: true,
    coverage: {
      include: ['app/**/*.{ts,tsx}'],
    },
  },
})
