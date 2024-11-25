import { reactRouter } from '@react-router/dev/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { glob } from 'glob'
import { defineConfig } from 'vite'

const MODE = process.env.NODE_ENV

export default defineConfig({
  build: {
    cssMinify: MODE === 'production',
    rollupOptions: {
      external: [/node:.*/, 'stream', 'crypto', 'fsevents'],
    },
    sourcemap: false,
  },
  server: {
    watch: {
      ignored: ['**/playwright-report/**'],
    },
  },
  plugins: [
    reactRouter(),
    process.env.SENTRY_AUTH_TOKEN
      ? sentryVitePlugin({
          disable: MODE !== 'production',
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
          release: {
            name: process.env.COMMIT_SHA,
            setCommits: {
              auto: true,
            },
          },
          sourcemaps: {
            ignore: ['sanity'],
            filesToDeleteAfterUpload: await glob([
              './build/**/*.map',
              '.server-build/**/*.map',
            ]),
          },
        })
      : null,
  ],
})
