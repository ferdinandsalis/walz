import  { type LinksFunction } from '@remix-run/node'
import { Studio } from 'sanity'
import { Hydrated } from '#app/components/hydrated.tsx'
import studioCssUrl from '#app/styles/studio.css?url'
import config from '../../sanity.config.ts'

export function meta() {
  return [{ title: 'Walz Studio' }, { name: 'robots', content: 'noindex' }]
}

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: studioCssUrl }]
}

export default function StudioPage() {
  return (
    <Hydrated>
      <Studio config={config} />
    </Hydrated>
  )
}
