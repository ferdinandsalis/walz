import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'

export async function loader({ request: _request }: LoaderFunctionArgs) {
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
      {posts?.map(
        post =>
          post && (
            <li key={post.slug}>
              <Link to={post.slug}>{post.title}</Link>
              {post.description ? <p>{post.description}</p> : null}
            </li>
          ),
      )}
    </ul>
  )
}
