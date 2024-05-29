import { type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { type QueryResult, query } from './_index.query.tsx'
import { loadQuery } from '@sanity/react-loader'
import { PostItem } from '../aktuelles.tsx'

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
    <>
      <h1 className="mb-8 font-condensed text-2xl font-bold text-primary md:text-4xl">
        Beiträge
      </h1>
      <ul className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {posts?.map(
          post =>
            post && (
              <li key={post.slug.current}>
                <PostItem
                  title={post.title}
                  publishedAt={post.publishedAt}
                  previewText={post.previewText}
                  linkTo={`/aktuelles/beitraege/${post.slug.current}`}
                  key={post.slug.current}
                />
              </li>
            ),
        )}
      </ul>
    </>
  )
}
