// all mdx posts in this directory
import { LoaderArgs, json } from '@remix-run/node'
import * as postA from './das_neue_schuljahr_beginnt.mdx'
import * as postB from './infoabend.mdx'
import * as postC from './tag_der_offenen_tuer.mdx'
import { Link, useLoaderData } from '@remix-run/react'

function postFromModule(mod) {
  console.log(JSON.stringify(mod))
  return {
    slug: mod.filename.replace(/\.mdx?$/, ''),
    ...mod.attributes.meta,
  }
}

export async function loader({ request }: LoaderArgs) {
  return json([
    postFromModule(postC),
    postFromModule(postA),
    postFromModule(postB),
  ])
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
