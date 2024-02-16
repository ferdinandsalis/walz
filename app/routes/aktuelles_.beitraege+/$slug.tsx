import {
  type LoaderFunctionArgs,
  type MetaFunction,
  json,
} from '@remix-run/node'
import { loadQuery } from '@sanity/react-loader'
import { PortableText } from '@portabletext/react'
import { useLoaderData } from '@remix-run/react'
import { getImageDimensions } from '@sanity/asset-utils'
import { type QueryResult, query } from './$slug.query.ts'
import { urlFor } from '#app/sanity/instance.ts'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data?.data.title} | Walz` }]
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

export default function Post() {
  const loaderData = useLoaderData<typeof loader>()
  const post = loaderData.data

  return (
    <article className="post hyphens-auto text-pretty">
      <h1>{post.title}</h1>
      <PortableText
        value={post.body}
        components={{
          types: {
            paragraph: ({ value }) => {
              return <p className="mb-2">{value}</p>
            },
            image: ImageComponent,
          },
        }}
      />{' '}
    </article>
  )
}

const ImageComponent = ({ value, isInline }: any) => {
  const { width, height } = getImageDimensions(value)
  return (
    <img
      src={urlFor(value)
        .width(isInline ? 100 : 800)
        .fit('max')
        .auto('format')
        .url()}
      alt={value.alt || ' '}
      loading="lazy"
      style={{
        // Display alongside text if image appears inside a block text span
        display: isInline ? 'inline-block' : 'block',

        // Avoid jumping around with aspect-ratio CSS property
        aspectRatio: width / height,
      }}
    />
  )
}
