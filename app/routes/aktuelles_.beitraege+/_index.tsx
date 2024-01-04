// all mdx posts in this directory
import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'

export async function loader({ request }: LoaderFunctionArgs) {
  return json({
    data: {
      posts: [],
    },
  })
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>()
  const posts = loaderData.data.posts

  return (
    <ul>
      {posts?.map(post => (
        <li key={post.slug}>
          <Link to={post.slug}>{post.title}</Link>
          {post.description ? <p>{post.description}</p> : null}
        </li>
      ))}
    </ul>
  )
}
