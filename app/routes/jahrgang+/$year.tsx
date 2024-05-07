import {
  type LoaderFunctionArgs,
  type MetaFunction,
  json,
} from '@remix-run/node'
import { loadQuery } from '@sanity/react-loader'
import { type QueryResult, query } from './$year.query.tsx'
import { useLoaderData } from '@remix-run/react'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Jahrgang ${data?.data.letter} | Walz` }]
}

export async function loader({ params }: LoaderFunctionArgs) {
  const queryResult = await loadQuery<QueryResult>(query, params, {
    perspective: 'published',
  })

  return json({
    query,
    params,
    data: queryResult.data,
  })
}

export default function Year() {
  const loaderData = useLoaderData<typeof loader>()
  const year = loaderData.data

  return (
    <article className="post hyphens-auto text-pretty">
      <h1>{year.letter}</h1>
    </article>
  )
}
