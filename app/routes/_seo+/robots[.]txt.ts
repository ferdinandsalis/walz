import { generateRobotsTxt } from '@nasa-gcn/remix-seo'
import { unstable_defineLoader as defineLoader } from '@remix-run/node'
import { getDomainUrl } from '#app/utils/misc.tsx'

export const loader = defineLoader(({ request }) => {
  return generateRobotsTxt([
    { type: 'sitemap', value: `${getDomainUrl(request)}/sitemap.xml` },
  ])
})
