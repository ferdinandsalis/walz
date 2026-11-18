import { PortableText } from '@portabletext/react'
import { getImageDimensions } from '@sanity/asset-utils'
import { loadQuery } from '@sanity/react-loader'
import { useState } from 'react'
import {
  type LoaderFunctionArgs,
  type MetaArgs,
  useLoaderData,
} from 'react-router'
import { NotFoundErrorBoundary } from '#app/components/error-boundary.tsx'
import { PhotoLightbox } from '#app/components/photo-lightbox.tsx'
import { PhotoStrip } from '#app/components/photo-strip.tsx'
import { urlFor } from '#app/sanity/instance.ts'
import { type QueryResult, beitraegeSlugQuery } from './$slug.query.ts'

export function meta({ data }: MetaArgs<typeof loader>) {
  return [{ title: `${data?.data.title ?? 'Beitrag'} | Walz` }]
}

export async function loader({ params }: LoaderFunctionArgs) {
  const queryResult = await loadQuery<QueryResult | null>(
    beitraegeSlugQuery,
    params,
    {
      perspective: 'published',
    },
  )

  if (!queryResult.data) {
    throw new Response('Beitrag nicht gefunden', { status: 404 })
  }

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
    <article className="post text-pretty hyphens-auto">
      <header>
        <h1>{post.title}</h1>
      </header>
      <div className="prose">
        <PortableText
          value={post.body}
          components={{
            block: {
              normal: ({ children }) => (
                <p className="not-last:mb-2">{children}</p>
              ),
              h4: ({ children }) => (
                <h4 className="text-primary font-bold">{children}</h4>
              ),
            },
            types: {
              paragraph: ({ value }) => {
                return <p className="mb-2">{value}</p>
              },
              image: ImageComponent,
              photoStrip: PhotoStripBlock,
            },
          }}
        />
      </div>
    </article>
  )
}

export function ErrorBoundary() {
  return <NotFoundErrorBoundary />
}

type PhotoStripValue = {
  photos?: Array<{
    _key: string
    asset?: { _ref: string }
    caption?: string
    alt?: string
    attribution?: string
  }>
}

export function PhotoStripBlock({ value }: { value: PhotoStripValue }) {
  return (
    <PhotoStrip
      photos={(value.photos ?? []).map(photo => ({
        key: photo._key,
        image: photo,
        caption: photo.caption,
        alt: photo.alt,
        attribution: photo.attribution,
      }))}
      itemClassName="basis-1/2 md:basis-1/3"
    />
  )
}

export const ImageComponent = ({ value, isInline }: any) => {
  const { width, height } = getImageDimensions(value)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  return (
    <figure className="bg-muted/30 rounded p-3">
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        aria-label={value.alt || value.caption || 'Foto vergrößern'}
        className="block w-full cursor-zoom-in"
      >
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
      </button>
      <PhotoLightbox
        photos={[
          {
            image: value,
            alt: value.alt,
            caption: value.caption,
            attribution: value.attribution,
          },
        ]}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
      {(value.caption || value.attribution) && (
        <figcaption className="text-body-xs text-muted-foreground mt-2">
          {value.caption}
          {value.attribution && (
            <span className="block text-right">{value.attribution}</span>
          )}
        </figcaption>
      )}
    </figure>
  )
}
