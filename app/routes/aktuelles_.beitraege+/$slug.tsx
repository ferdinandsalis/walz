import { PortableText } from '@portabletext/react'
import { getImageDimensions } from '@sanity/asset-utils'
import { loadQuery } from '@sanity/react-loader'
import {
  type LoaderFunctionArgs,
  type MetaArgs,
  useLoaderData,
} from 'react-router'
import { urlFor } from '#app/sanity/instance.ts'
import { type QueryResult, beitraegeSlugQuery } from './$slug.query.ts'

export function meta({ data }: MetaArgs<typeof loader>) {
  return [{ title: `${data?.data?.title} | Walz` }]
}

export async function loader({ params }: LoaderFunctionArgs) {
  const queryResult = await loadQuery<QueryResult>(beitraegeSlugQuery, params, {
    perspective: 'published',
  })

  return {
    query: beitraegeSlugQuery,
    data: queryResult.data,
    params,
  }
}

export default function Post() {
  const loaderData = useLoaderData<typeof loader>()
  const post = loaderData.data

  return (
    <article className="post hyphens-auto text-pretty">
      <header>
        <h1>{post.title}</h1>
      </header>
      <div className="prose">
        <PortableText
          value={post.body}
          components={{
            block: {
              normal: ({ children }) => (
                <p className="[&:not(:last-child)]:mb-2">{children}</p>
              ),
              h4: ({ children }) => (
                <h4 className="font-bold text-primary">{children}</h4>
              ),
            },
            types: {
              paragraph: ({ value }) => {
                return <p className="mb-2">{value}</p>
              },
              image: ImageComponent,
            },
          }}
        />
      </div>
    </article>
  )
}

const ImageComponent = ({ value, isInline }: any) => {
  const { width, height } = getImageDimensions(value)
  return (
    <figure className="rounded bg-muted/30 p-3">
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
      {value.attribution && (
        <figcaption className="mt-2 text-right text-body-xs text-muted-foreground">
          {value.attribution}
        </figcaption>
      )}
    </figure>
  )
}
