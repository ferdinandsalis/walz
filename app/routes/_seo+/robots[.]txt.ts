import { generateRobotsTxt } from '@nasa-gcn/remix-seo'
import { LoaderFunctionArgs } from '@remix-run/node'
import { getDomainUrl } from '#app/utils/misc.tsx'

export function loader({ request }: LoaderFunctionArgs) {
  return generateRobotsTxt([
    { type: 'sitemap', value: `${getDomainUrl(request)}/sitemap.xml` },
  ])
}
