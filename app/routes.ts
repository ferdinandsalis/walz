import { type RouteConfig } from '@react-router/dev/routes'
import { remixRoutesOptionAdapter } from '@react-router/remix-routes-option-adapter'
import { flatRoutes } from 'remix-flat-routes'

export default remixRoutesOptionAdapter(defineRoutes =>
  flatRoutes('routes', defineRoutes, {
    ignoredRouteFiles: [
      '.*',
      '**/*.css',
      '**/*.query.ts',
      '**/*.test.{js,jsx,ts,tsx}',
      '**/__*.*',
    ],
  }),
) satisfies RouteConfig
