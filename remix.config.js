import { flatRoutes } from 'remix-flat-routes'

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
export default {
  cacheDirectory: './node_modules/.cache/remix',
  ignoredRouteFiles: ['**/*'],
  serverModuleFormat: 'esm',
  serverPlatform: 'node',
  watchPaths: ['./tailwind.config.ts'],
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
}
