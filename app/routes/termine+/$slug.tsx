import { ArrowLeft, DownloadSimple } from '@phosphor-icons/react'
import { PortableText } from '@portabletext/react'
import { loadQuery } from '@sanity/react-loader'
import {
  type LoaderFunctionArgs,
  Link,
  type MetaArgs,
  useLoaderData,
} from 'react-router'
import { CopyLinkButton } from '#app/components/copy-link-button.tsx'
import { EventSchema, tType } from '#app/sanity/schema/event.tsx'
import { eventBySlugQuery } from './$slug.query.ts'

export function meta({ data }: MetaArgs<typeof loader>) {
  return [{ title: `${data?.event.title ?? 'Termin'} | Walz` }]
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { data } = await loadQuery(
    eventBySlugQuery,
    { slug: params.slug },
    { perspective: 'published' },
  )

  if (!data) {
    throw new Response('Termin nicht gefunden', { status: 404 })
  }

  return { event: EventSchema.parse(data), slug: params.slug }
}

export default function Termin() {
  const { event, slug } = useLoaderData<typeof loader>()

  return (
    <article className="post space-y-8 hyphens-auto text-pretty">
      <Link
        to="/aktuelles#schuljahr"
        className="group inline-flex items-center gap-1 text-body-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft
          size={16}
          className="text-primary transition-transform group-hover:-translate-x-1"
        />
        <span className="underline-offset-2 group-hover:underline">
          Alle Termine
        </span>
      </Link>

      <header className="space-y-4">
        <hgroup className="space-y-1">
          {event.type && (
            <p className="font-condensed text-lg font-bold text-primary">
              {tType(event.type)}
            </p>
          )}
          <h1 className="text-3xl font-bold lg:text-5xl">{event.title}</h1>
        </hgroup>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Datum
            </dt>
            <dd>
              <time dateTime={event.start.date.toISOString()}>
                {event.start.date.toLocaleDateString('de-AT', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            </dd>
          </div>
          {event.start.time && (
            <div>
              <dt className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Uhrzeit
              </dt>
              <dd>
                {event.start.time} Uhr
                {event.end?.time ? ` – ${event.end.time} Uhr` : ''}
              </dd>
            </div>
          )}
          {event.location && (
            <div>
              <dt className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Ort
              </dt>
              <dd>{event.location}</dd>
            </div>
          )}
        </dl>
      </header>

      {event.description && (
        <div className="prose max-w-prose">
          <PortableText
            value={event.description}
            components={{
              marks: {
                link: ({ children, value }) => (
                  <a
                    href={value.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline"
                  >
                    {children}
                  </a>
                ),
              },
              list: {
                bullet: ({ children }) => (
                  <ul className="my-2 list-disc pl-6">{children}</ul>
                ),
                number: ({ children }) => (
                  <ol className="my-2 list-decimal pl-6">{children}</ol>
                ),
              },
              block: {
                h4: ({ children }) => <h4 className="font-bold">{children}</h4>,
                normal: ({ children }) => <p className="mb-2">{children}</p>,
              },
            }}
          />
        </div>
      )}

      {event.attachments && event.attachments.length > 0 && (
        <ul className="space-y-1">
          {event.attachments.map((attachment, index) =>
            attachment.asset?.url ? (
              <li key={index} className="flex items-center gap-1">
                <a
                  href={attachment.asset.url}
                  className="text-muted-foreground underline underline-offset-2"
                >
                  Anhang {index + 1} herunterladen
                </a>
                <DownloadSimple className="text-primary" size={18} />
              </li>
            ) : null,
          )}
        </ul>
      )}

      <CopyLinkButton
        path={`/termine/${slug}`}
        label="Link zu diesem Termin kopieren"
      />
    </article>
  )
}
