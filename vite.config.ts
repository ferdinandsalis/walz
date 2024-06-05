import { vitePlugin as remix } from '@remix-run/dev'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { defineConfig } from 'vite'
import { flatRoutes } from 'remix-flat-routes'

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ['**/*'],
      serverModuleFormat: 'esm',
      future: {
        unstable_singleFetch: true,
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
            filesToDeleteAfterUpload: await glob([
              './build/**/*.map',
              '.server-build/**/*.map',
            ]),
          },
        })
      : null,
  ],
})
