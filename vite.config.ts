import { vitePlugin as remix } from '@remix-run/dev'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { glob } from 'glob'
import { flatRoutes } from 'remix-flat-routes'
import { defineConfig } from 'vite'

const MODE = process.env.NODE_ENV

declare module '@remix-run/server-runtime' {
  interface Future {
    v3_singleFetch: true
  }
}

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
    remix({
      ignoredRouteFiles: ['**/*'],
      serverModuleFormat: 'esm',
      future: {
        unstable_optimizeDeps: true,
        v3_lazyRouteDiscovery: true,
        v3_singleFetch: true,
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      routes: async defineRoutes => {
        return flatRoutes('routes', defineRoutes, {
          ignoredRouteFiles: [
            '.*',
            '**/*.css',
            '**/*.query.ts',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__*.*',
          ],
        })
      },
    }),
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
