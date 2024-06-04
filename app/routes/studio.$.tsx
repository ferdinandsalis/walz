import type { LinksFunction } from '@remix-run/node'
import { Studio } from 'sanity'
import { Hydrated } from '#app/components/hydrated.tsx'
import studio from '#app/styles/studio.css'
import config from '../../sanity.config.ts'

export function meta() {
  return [{ title: 'Walz Studio' }, { name: 'robots', content: 'noindex' }]
}

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: studio }]
}

export default function StudioPage() {
  return (
    <Hydrated>
      <Studio config={config} />
    </Hydrated>
  )
}
