// all mdx posts in this directory
import { LoaderArgs, json } from '@remix-run/node'
import * as postB from './infoabend.mdx'
import * as postD from './20231009_praktikum.mdx'
import { Link, useLoaderData } from '@remix-run/react'

function postFromModule(mod: any) {
  const slug = mod.filename.replace(/\.mdx?$/, '')
  return {
    slug,
    to: `/aktuelles/beitraege/${slug}`,
    ...mod.attributes,
  }
}

export async function loader({ request }: LoaderArgs) {
  return json([postFromModule(postD), postFromModule(postB)])
}

export default function Index() {
  const posts = useLoaderData<typeof loader>()

  return (
    <ul>
      {posts.map(post => (
        <li key={post.slug}>
          <Link to={post.slug}>{post.title}</Link>
          {post.description ? <p>{post.description}</p> : null}
        </li>
      ))}
    </ul>
  )
}
