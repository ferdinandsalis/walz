import { defineConfig, devices } from '@playwright/test'

const PORT = process.env.PORT || '3000'

export default defineConfig({
  testDir: './tests',
  timeout: 15 * 1000,
  expect: {
    timeout: 5 * 1000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${PORT}/`,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    // Wait for a rendered page, not just the open port: the dev server's first
    // request compiles every route module for SSR, which takes ~20s on CI and
    // would otherwise land on the first test and exceed its timeout.
    url: `http://localhost:${PORT}/`,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      PORT,
    },
  },
})
