import {
  ArrowRight,
  Baby,
  CaretUp,
  DownloadSimple,
  LinkSimple,
} from '@phosphor-icons/react'
import { PortableText } from '@portabletext/react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion'
import { loadQuery } from '@sanity/react-loader'
import { groupBy, evolve } from 'ramda'
import {
  href,
  Link,
  useLoaderData,
  useLocation,
  type LoaderFunctionArgs,
} from 'react-router'
import { z } from 'zod'
import { CopyLinkButton } from '#app/components/copy-link-button.tsx'
import { Toc } from '#app/components/toc.tsx'
import { Divider } from '#app/components/ui/divider.tsx'
import { urlFor } from '#app/sanity/instance.ts'
import { EventSchema, tType } from '#app/sanity/schema/event.tsx'
import { alphabetMap } from '#app/sanity/schema/year.tsx'
import { selectFeaturedPhoto } from '#app/utils/featured-photo.ts'
import { cn } from '#app/utils/misc.tsx'
import {
  calculateCurrentYear,
  determineCurrentSchoolYear,
} from '#app/utils/years.ts'
import {
  type QueryResult,
  type Year,
  YearSchema,
  aktuellesQuery,
  currentSchoolYearQuery,
} from './query.ts'

export function meta() {
  return [{ title: 'Aktuelles | Walz' }]
}

type Event = z.infer<typeof EventSchema>

export async function loader({ params }: LoaderFunctionArgs) {
  // en-CA locale produces YYYY-MM-DD format needed for Sanity date comparison
  const today = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Europe/Vienna',
  })
  const schoolYearResult = await loadQuery<{
    start: string
    end: string
  } | null>(currentSchoolYearQuery, { today })

  let fromDate: string
  let toDate: string
  if (schoolYearResult.data) {
    fromDate = schoolYearResult.data.start
    toDate = schoolYearResult.data.end
  } else {
    const fallback = determineCurrentSchoolYear()
    fromDate = fallback.from.toISOString()
    toDate = fallback.to.toISOString()
  }

  const queryResult = await loadQuery<QueryResult>(aktuellesQuery, {
    fromDate,
    toDate,
  })

  return {
    query: aktuellesQuery,
    params,
    data: evolve({
      years: z.array(YearSchema).parse,
      events: events =>
        groupBy<Event>(event => {
          return new Date(event.start.date).getFullYear().toString()
        })(z.array(EventSchema).parse(events)),
    })(queryResult.data),
  }
}

export default function Aktuelles() {
  const loaderData = useLoaderData<typeof loader>()
  const location = useLocation()
  const currentHash = location.hash.replace('#', '') || undefined
  const { posts, years, events } = loaderData.data

  return (
    <div className="relative grid grid-cols-subgrid items-start gap-8 lg:col-span-2">
      <h1 className="font-condensed text-h1 text-muted-foreground font-bold opacity-20">
        Aktuelles
      </h1>

      <div className="bg-muted/30 row-start-1 rounded-md p-6 lg:sticky lg:top-4 lg:z-20 lg:col-start-2 lg:row-start-2">
        <Toc
          links={[
            { name: 'Schuljahr', to: '#schuljahr' },
            { name: 'Jahrgänge', to: '#jahrgaenge' },
            { name: 'Blog', to: '#blog' },
          ]}
        />
      </div>

      <div className="col-start-1 grid grid-cols-12 gap-x-4 gap-y-16 sm:gap-x-6 lg:gap-x-8">
        <section id="schuljahr" className="col-span-12 space-y-8">
          <h1 className="font-condensed text-primary text-2xl font-bold md:text-4xl">
            Schuljahr
          </h1>
          <Accordion
            collapsible
            type="single"
            defaultValue={currentHash}
            className="grid gap-4"
          >
            {Object.entries(events).map(([year, yearEvents]) => {
              return (
                <section key={year}>
                  <h2 className="font-condensed text-body-lg text-muted-foreground/70 mb-2 text-right font-bold">
                    {year}
                  </h2>

                  <div className="grid gap-1">
                    {yearEvents?.map((event, idx) => {
                      const isPastEvent =
                        new Date(event.start.date) < new Date()
                      const isNextEvent =
                        idx > 0 &&
                        new Date(yearEvents[idx - 1].start.date) < new Date() &&
                        new Date(event.start.date) >= new Date()

                      return (
                        <>
                          {isNextEvent && (
                            <div className="relative text-center">
                              <hr className="border-secondary rounded-full border-2" />
                            </div>
                          )}
                          <AccordionItem key={event._id} value={event._id}>
                            <div
                              id={event._id}
                              className={cn('bg-card/50 transition-colors', {
                                'opacity-50': isPastEvent,
                              })}
                            >
                              <AccordionTrigger asChild>
                                <div
                                  className={cn(
                                    'user-select-none group data-[state=open]:bg-secondary/10 grid w-full cursor-pointer grid-cols-3 items-center gap-4 px-4 py-1 transition-all',
                                  )}
                                >
                                  <time
                                    className=""
                                    dateTime={event.start.date.toISOString()}
                                  >
                                    {event.start.date.toLocaleString('de-AT', {
                                      month: 'long',
                                      day: '2-digit',
                                    })}
                                  </time>
                                  <div className="flex items-center gap-2">
                                    <h1
                                      className={cn('truncate font-bold')}
                                      title={event.title}
                                    >
                                      {event.title}
                                    </h1>
                                  </div>
                                  <div className="flex items-center gap-1 justify-self-end">
                                    {event.type && (
                                      <span className="bg-primary/10 text-body-2xs text-primary/80 rounded-md px-1.5 py-0.5">
                                        {tType(event.type)}
                                      </span>
                                    )}
                                    <CaretUp className="group-data-[state=open]:transform-rotate-180 text-primary h-4 w-4 transition-transform duration-300" />
                                  </div>
                                </div>
                              </AccordionTrigger>
                            </div>
                            <AccordionContent asChild>
                              <div className="bg-card data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down transform-gpu overflow-hidden p-4 py-6 transition-all">
                                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                                  <h1 className="text-h5 font-bold">
                                    {event.title}
                                  </h1>
                                  <CopyLinkButton
                                    path={
                                      event.slug
                                        ? `/termine/${event.slug}`
                                        : `/aktuelles#${event._id}`
                                    }
                                  />
                                </div>
                                <dl className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    {event.start.time && (
                                      <div>
                                        <dt className="text-muted-foreground mb-1 text-xs font-bold tracking-widest uppercase">
                                          Beginn
                                        </dt>
                                        <dd className="">
                                          {event.start.time} Uhr
                                        </dd>
                                      </div>
                                    )}
                                    {event.end?.time && (
                                      <div>
                                        <dt className="text-muted-foreground mb-1 text-xs font-bold tracking-widest uppercase">
                                          Ende
                                        </dt>
                                        <dd className="">
                                          {event.end.time} Uhr
                                        </dd>
                                      </div>
                                    )}
                                  </div>
                                  {event.description && (
                                    <div>
                                      <dt className="text-muted-foreground mb-1 text-xs font-bold tracking-widest uppercase">
                                        Info
                                      </dt>
                                      <dd>
                                        <PortableText
                                          value={event.description}
                                          components={{
                                            marks: {
                                              link: ({ children, value }) => (
                                                <a
                                                  href={value.href}
                                                  target="_blank"
                                                  className="text-primary underline"
                                                >
                                                  {children}
                                                </a>
                                              ),
                                            },
                                            list: {
                                              bullet: ({ children }) => (
                                                <ul className="my-2 list-disc pl-6">
                                                  {children}
                                                </ul>
                                              ),
                                              number: ({ children }) => (
                                                <ol className="my-2 list-decimal pl-6">
                                                  {children}
                                                </ol>
                                              ),
                                            },
                                            block: {
                                              h4: ({ children }) => (
                                                <h4 className="font-bold">
                                                  {children}
                                                </h4>
                                              ),
                                              normal: ({ children }) => (
                                                <div className="text-body-sm mb-2 leading-normal">
                                                  {children}
                                                </div>
                                              ),
                                            },
                                          }}
                                        />
                                      </dd>
                                    </div>
                                  )}
                                </dl>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </Accordion>
        </section>

        <Divider className="col-span-12" />

        <section id="jahrgaenge" className="col-span-12 space-y-8">
          <header className="flex items-center justify-between">
            <h1 className="font-condensed text-primary text-2xl font-bold md:text-4xl">
              Jahrgänge
            </h1>
          </header>
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns:
                'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
            }}
          >
            {years
              .filter(year => !year.graduatedAt)
              .map(year => (
                <YearCard key={year.letter} {...year} />
              ))}
          </div>
          <footer>
            <Link
              to="/jahrgaenge"
              className="text-primary underline-offset-2 hover:underline"
            >
              Alle Jahrgänge anzeigen
            </Link>
          </footer>
        </section>

        <Divider className="col-span-12" />

        <section id="blog" className="col-span-12 grid grid-cols-subgrid gap-4">
          <header className="col-span-12 flex flex-col items-end md:flex-row">
            <h1 className="font-condensed text-primary text-2xl font-bold md:text-4xl">
              Blog
            </h1>
            <div className="md:ml-auto">
              <Link
                to="/aktuelles/beitraege/"
                className="text-secondary underline-offset-2 hover:underline"
              >
                Alle Posts anzeigen
              </Link>
            </div>
          </header>
          <div className="col-span-12 grid grid-cols-subgrid gap-y-6">
            {posts &&
              posts.map(post => (
                <PostItem
                  title={post.title}
                  previewText={post.previewText}
                  linkTo={`/aktuelles/beitraege/${post.slug.current}`}
                  key={post.slug.current}
                />
              ))}
          </div>
        </section>
        <Divider className="col-span-12 bg-transparent" />
      </div>
    </div>
  )
}

export function YearCard({
  letter,
  startedAt,
  graduatedAt,
  mentor,
  photos,
  plan,
  featuredPhoto,
}: Omit<Year, 'mentor'> & {
  mentor: Year['mentor'] | null
  featuredPhoto?: Year['featuredPhoto']
}) {
  return (
    <article
      key={letter}
      className="bg-card grid h-full grid-cols-1 rounded-md shadow-md sm:grid-cols-[1fr_auto]"
    >
      <div className="relative flex flex-col overflow-hidden p-6">
        <div className="font-greek text-primary pointer-events-none absolute top-4 right-4 text-6xl font-black lowercase opacity-10 md:top-8 md:right-8 md:text-7xl lg:text-8xl">
          {alphabetMap[letter]}
        </div>

        <div className="flex-1">
          <h1 className="inline-flex gap-1 text-3xl font-bold">
            <Link
              to={href(`/jahrgaenge/:year`, {
                year: `${letter}-${startedAt.getFullYear()}`,
              })}
            >
              <span>{letter}</span>
              {graduatedAt ? (
                <span className="text-primary align-super text-lg font-bold">
                  {new Date(graduatedAt).getFullYear()}
                </span>
              ) : (
                <span className="text-primary align-super text-lg font-bold">
                  {calculateCurrentYear(startedAt)}
                </span>
              )}
            </Link>
          </h1>
          {mentor && (
            <div className="">
              <Link
                className="text-secondary font-bold hover:underline hover:underline-offset-2"
                to={{
                  hash: mentor?.slug.current,
                  pathname: href('/ueber-uns'),
                }}
              >
                {mentor?.name}
              </Link>
            </div>
          )}
          <p className="text-muted-foreground">
            {startedAt.toLocaleString('de-at', {
              dateStyle: 'long',
            })}
          </p>
        </div>

        {plan && (
          <div className="mt-4 flex items-center gap-1">
            <a
              href={plan}
              download={`${letter}-${new Date().getFullYear()}.pdf`}
              className="text-body-xs text-muted-foreground underline underline-offset-2"
            >
              Jahresplan
            </a>
            <DownloadSimple className="text-primary" size={18} />
          </div>
        )}
      </div>
      <Link
        to={href(`/jahrgaenge/:year`, {
          year: `${letter}-${startedAt.getFullYear()}`,
        })}
        className="group relative min-h-48 w-full sm:min-h-0 sm:w-40 md:w-48 lg:w-56"
      >
        {photos && photos.length > 0 ? (
          <img
            src={urlFor(selectFeaturedPhoto(photos, featuredPhoto))
              .quality(70)
              .width(600)
              .url()}
            alt={`${letter} Foto`}
            className="h-full w-full rounded-b-md object-cover object-center sm:rounded-r-md sm:rounded-b-none"
          />
        ) : (
          <div className="from-secondary/40 flex h-full w-full items-center justify-center overflow-hidden rounded-b-md bg-linear-to-t to-transparent sm:rounded-r-md sm:rounded-b-none">
            <Baby size={96} className="text-secondary/20 w-12 md:w-24" />
          </div>
        )}
        <div
          role="presentation"
          className="ring-card/30 group-hover:ring-secondary absolute inset-0 rounded-b-md ring-2 transition-all ring-inset sm:rounded-r-md sm:rounded-b-none"
        >
          <LinkSimple
            className="text-card group-hover:text-primary absolute right-2 bottom-2"
            size={16}
          />
        </div>
      </Link>
    </article>
  )
}

export function PostItem({
  title,
  previewText,
  linkTo,
  publishedAt,
}: {
  title: string
  previewText: string
  linkTo: string
  publishedAt?: string
}) {
  return (
    <article
      key={title}
      className="bg-card col-span-12 grid content-between gap-4 overflow-hidden rounded-md shadow-sm md:col-span-6"
    >
      <div className="grid grid-cols-1 gap-2 p-6">
        <Link prefetch="intent" to={linkTo}>
          <h1 className="font-condensed text-secondary text-xl leading-tight! font-bold md:text-2xl">
            {title}
          </h1>
        </Link>
        {publishedAt && (
          <p className="text-body-xs text-muted-foreground">
            Veröffentlicht am{' '}
            <time>
              {new Date(publishedAt).toLocaleString('de-AT', {
                dateStyle: 'medium',
              })}
            </time>
          </p>
        )}
        <p className="leading-snug text-pretty hyphens-auto">
          {previewText} <span>…</span>
        </p>
      </div>
      <footer className="bg-primary/5 mt-2 px-6 py-2">
        <Link
          to={linkTo}
          prefetch="intent"
          className="group/more font-condensed text-primary flex items-center text-lg"
        >
          <span className="underline-offset-2 group-hover/more:underline">
            Weiterlesen
          </span>
          <ArrowRight
            size={20}
            className="text-primary ml-auto transition-transform group-hover/more:translate-x-1"
          />
        </Link>
      </footer>
    </article>
  )
}
