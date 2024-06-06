import { generateSitemap } from '@nasa-gcn/remix-seo'
import { type ServerBuild , unstable_defineLoader as defineLoader } from '@remix-run/node'
import { getDomainUrl } from '#app/utils/misc.tsx'

export const loader = defineLoader(async ({ request, context }) => {
  const serverBuild = (await context.serverBuild) as ServerBuild
  return generateSitemap(request, serverBuild.routes, {
    siteUrl: getDomainUrl(request),
    headers: {
      'Cache-Control': `public, max-age=${60 * 5}`,
    },
  })
})
