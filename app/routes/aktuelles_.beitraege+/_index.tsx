import { loadQuery } from '@sanity/react-loader'
import { useLoaderData } from 'react-router'
import { PostItem } from '../aktuelles/route.tsx'
import { type QueryResult, beitraegeIndexQuery } from './_index.query.tsx'

export async function loader() {
  const queryResult = await loadQuery<QueryResult>(beitraegeIndexQuery)
  return {
    data: queryResult.data,
  }
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>()
  const posts = loaderData.data.posts

  return (
    <>
      <h1 className="font-condensed text-primary mb-8 text-2xl font-bold md:text-4xl">
        Blog
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
