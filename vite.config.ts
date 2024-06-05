import { vitePlugin as remix } from '@remix-run/dev'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { defineConfig } from 'vite'
import { glob } from 'glob'
import { flatRoutes } from 'remix-flat-routes'

const MODE = process.env.NODE_ENV

import type { Plugin } from 'vite'

interface SourcemapExclude {
  excludeNodeModules?: boolean
}
export function sourcemapExclude(opts?: SourcemapExclude): Plugin {
  return {
    name: 'sourcemap-exclude',
    transform(code: string, id: string) {
      if (
        (opts?.excludeNodeModules && id.includes('node_modules')) ||
        id.includes('SanityVision') ||
        id.includes('studio')
      ) {
        return {
          code,
          // https://github.com/rollup/rollup/blob/master/docs/plugin-development/index.md#source-code-transformations
          map: { mappings: '' },
        }
      }
    },
  }
}

// USAGE

export default defineConfig({
  build: {
    cssMinify: MODE === 'production',
    rollupOptions: {
      external: [/node:.*/, 'stream', 'crypto', 'fsevents'],
    },
    sourcemap: true,
  },
  server: {
    watch: {
      ignored: ['**/playwright-report/**'],
    },
  },
  plugins: [
    sourcemapExclude({ excludeNodeModules: true }),

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
