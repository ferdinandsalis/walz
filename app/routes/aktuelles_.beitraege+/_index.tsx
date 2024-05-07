import { type LoaderFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { type QueryResult, query } from './_index.query.tsx'
import { loadQuery } from '@sanity/react-loader'

export async function loader({ request: _request }: LoaderFunctionArgs) {
  const queryResult = await loadQuery<QueryResult>(query)
  return {
    data: queryResult.data,
  }
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>()
  const posts = loaderData.data.posts

  return (
    <ul>
      {posts?.map(
        post =>
          post && (
            <li key={post.slug.current}>
              <Link to={post.slug.current}>{post.title}</Link>
              {post.previewText ? <p>{post.previewText}</p> : null}
            </li>
          ),
      )}
    </ul>
  )
}
