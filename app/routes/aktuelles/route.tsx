import { PortableText } from '@portabletext/react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion'
import { loadQuery } from '@sanity/react-loader'
import {
  ArrowRight,
  BabyIcon,
  ChevronUp,
  DownloadIcon,
  Link2Icon,
} from 'lucide-react'
import { groupBy, evolve } from 'ramda'
import {
  Link,
  useLoaderData,
  useLocation,
  type LoaderFunctionArgs,
} from 'react-router'
import { z } from 'zod'
import { Toc } from '#app/components/toc.tsx'
import { Divider } from '#app/components/ui/divider.tsx'
import { urlFor } from '#app/sanity/instance.ts'
import { EventSchema, tType } from '#app/sanity/schema/event.tsx'
import { alphabetMap } from '#app/sanity/schema/year.ts'
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
} from './query.ts'

export function meta() {
  return [{ title: 'Aktuelles | Walz' }]
}

type Event = z.infer<typeof EventSchema>

export async function loader({ params }: LoaderFunctionArgs) {
  const schoolYear = determineCurrentSchoolYear()
  const queryResult = await loadQuery<QueryResult>(aktuellesQuery, {
    fromDate: schoolYear.from.toISOString(),
    toDate: schoolYear.to.toISOString(),
  })

  return {
    query: aktuellesQuery,
    params,
    data: evolve({
      years: z.array(YearSchema).parse,
      events: events =>
        groupBy<Event>(event => {
          return new Date(event.start.date).getUTCFullYear().toString()
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
      <h1 className="font-condensed text-h1 font-bold text-muted-foreground opacity-20">
        Aktuelles
      </h1>

      <div className="row-start-1 rounded-md bg-muted/30 p-6 lg:sticky lg:top-4 lg:z-20 lg:col-start-2 lg:row-start-2">
        <Toc
          links={[
            { name: 'Jahrgänge', to: '#jahrgaenge' },
            { name: 'Termine', to: '#termine' },
            { name: 'Beiträge', to: '#beitraege' },
          ]}
        />
      </div>

      <div className="col-start-1 grid grid-cols-1 gap-16">
        <section id="jahrgaenge" className="space-y-8">
          <h1 className="font-condensed text-2xl font-bold text-primary md:text-4xl">
            Jahrgänge
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {years
              .filter(year => !year.graduatedAt)
              .map(year => (
                <YearCard key={year.letter} {...year} />
              ))}
          </div>
        </section>

        <Divider />

        <section id="termine" className="space-y-8">
          <h1 className="font-condensed text-2xl font-bold text-primary md:text-4xl">
            Termine
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
                  <h2 className="mb-2 text-right font-condensed text-body-lg font-bold text-muted-foreground/70">
                    {year}
                  </h2>

                  <div className="grid gap-1">
                    {yearEvents?.map((event, idx) => {
                      return event.description ? (
                        <AccordionItem key={event._id} value={event._id}>
                          <div
                            id={event._id}
                            className={cn('bg-card/50 transition-colors')}
                          >
                            <AccordionTrigger asChild>
                              <div
                                className={cn(
                                  'user-select-none group grid w-full cursor-pointer grid-cols-3 items-center gap-4 px-4 py-1 transition-all data-[state=open]:bg-secondary/10',
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
                                  {event.type === 'theater' ? '🎭' : ''}
                                  {event.type === 'exam' ? '📝' : ''}
                                  {event.type === 'project' ? '🎨' : ''}
                                  {event.type === 'holiday' ? '🏖️' : ''}
                                  {event.type === 'talk' ? '🎤' : ''}
                                  <h1
                                    className={cn('truncate font-bold')}
                                    title={event.title}
                                  >
                                    {event.title}
                                  </h1>
                                </div>
                                <div className="flex items-center gap-1 justify-self-end">
                                  {event.type && (
                                    <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-body-2xs text-primary/80">
                                      {tType(event.type)}
                                    </span>
                                  )}
                                  <ChevronUp className="group-data-[state=open]:transform-rotate-180 h-4 w-4 stroke-primary transition-transform duration-300" />
                                </div>
                              </div>
                            </AccordionTrigger>
                          </div>
                          {event.description && (
                            <AccordionContent asChild>
                              <div className="transform-gpu overflow-hidden bg-card p-4 py-6 transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                                <h1 className="mb-4 text-h5 font-bold">
                                  {event.title}
                                </h1>
                                <dl className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    {event.start.time && (
                                      <div>
                                        <dt className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                          Beginn
                                        </dt>
                                        <dd className="">
                                          {event.start.time} Uhr
                                        </dd>
                                      </div>
                                    )}
                                    {event.end?.time && (
                                      <div>
                                        <dt className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                          Ende
                                        </dt>
                                        <dd className="">
                                          {event.end.time} Uhr
                                        </dd>
                                      </div>
                                    )}
                                    {event.attachments &&
                                      event.attachments.length > 0 && (
                                        <div className="col-span-2">
                                          <dt className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                            Links
                                          </dt>
                                          <dd className="">
                                            <ul className="list-inside list-disc">
                                              {event.attachments.map(
                                                attachment => {
                                                  return (
                                                    <li
                                                      key={
                                                        attachment.asset._type
                                                      }
                                                    >
                                                      <a
                                                        href={
                                                          attachment.asset.url
                                                        }
                                                        download="true"
                                                        className="inline-flex items-center gap-1"
                                                      >
                                                        {attachment.asset.url}
                                                        <DownloadIcon
                                                          size={16}
                                                          className="inline-block stroke-primary"
                                                        />
                                                      </a>
                                                    </li>
                                                  )
                                                },
                                              )}
                                            </ul>
                                          </dd>
                                        </div>
                                      )}
                                  </div>
                                  <div>
                                    <dt className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                      Info
                                    </dt>
                                    <dd>
                                      <PortableText
                                        value={event.description}
                                        components={{
                                          block: {
                                            h4: ({ children }) => (
                                              <h4 className="font-bold">
                                                {children}
                                              </h4>
                                            ),
                                            p: ({ children }) => (
                                              <p className="mb-4 text-body-sm">
                                                {children}
                                              </p>
                                            ),
                                          },
                                        }}
                                      />
                                    </dd>
                                  </div>
                                </dl>
                              </div>
                            </AccordionContent>
                          )}
                        </AccordionItem>
                      ) : (
                        <div
                          key={idx}
                          className={cn(
                            'border-b-1 border-b-background bg-card/50',
                            {
                              '': idx,
                            },
                          )}
                        >
                          <div
                            className={cn('grid grid-cols-3 gap-4 px-4 py-1')}
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
                            <h1 className="font-bold">{event.title}</h1>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </Accordion>
        </section>

        <Divider />

        <section id="beitraege" className="grid grid-cols-1 gap-4">
          <header className="flex flex-col items-end md:flex-row">
            <h1 className="font-condensed text-2xl font-bold text-primary md:text-4xl">
              Beiträge
            </h1>
            <div className="md:ml-auto">
              <Link
                to="/aktuelles/beitraege/"
                className="text-secondary underline-offset-2 hover:underline"
              >
                Alle Beiträge anzeigen
              </Link>
            </div>
          </header>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
        <Divider className="bg-transparent" />
      </div>
    </div>
  )
}

function YearCard({ letter, startedAt, mentor, photos, plan }: Year) {
  return (
    <article
      key={letter}
      className="flex flex-wrap rounded-md bg-card shadow-md"
    >
      <div className="relative flex flex-1 flex-col p-6">
        <div className="text-1xl absolute right-14 top-10 scale-[7] font-greek font-black lowercase text-primary opacity-10">
          {alphabetMap[letter]}
        </div>

        <div className="flex-1">
          <h1 className="inline-flex gap-1 text-3xl font-bold">
            <span>{letter}</span>
            <span className="text-lg font-bold text-primary">
              {calculateCurrentYear(startedAt)}
            </span>
          </h1>
          <div className="">
            <Link
              className="font-bold text-secondary hover:underline hover:underline-offset-2"
              to={`/ueber-uns/#${mentor?.slug.current}`}
            >
              {mentor?.name}
            </Link>
          </div>
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
            <DownloadIcon className="stroke-primary" size={18} />
          </div>
        )}
      </div>
      <Link
        to={`/jahrgaenge/${letter}-${startedAt.getFullYear()}`}
        className="group relative flex aspect-video flex-1 rounded-r-md"
      >
        {photos ? (
          <img
            src={urlFor(photos[0]).quality(70).width(600).url()}
            alt={`${letter} Foto`}
            className="w-32 flex-1 rounded-r-md object-cover object-center md:w-60 lg:w-60 xl:w-80"
          />
        ) : (
          <div className="inline-flex w-full flex-1 items-center justify-center overflow-hidden rounded-r-md bg-gradient-to-t from-secondary/40 to-transparent">
            <BabyIcon size={96} className="w-12 stroke-secondary/20 md:w-24" />
          </div>
        )}
        <div
          role="presentation"
          className="absolute inset-0 rounded-r-md ring-2 ring-inset ring-card/30 transition-all group-hover:ring-secondary"
        >
          <Link2Icon
            className="absolute bottom-2 right-2 stroke-card group-hover:stroke-primary"
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
      className="grid content-between gap-4 overflow-hidden rounded-md bg-card shadow"
    >
      <div className="grid grid-cols-1 gap-2 p-6">
        <Link prefetch="intent" to={linkTo}>
          <h1 className="font-condensed text-xl font-bold !leading-tight text-secondary md:text-2xl">
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
        <p className="hyphens-auto text-pretty leading-snug">
          {previewText} <span>…</span>
        </p>
      </div>
      <footer className="mt-2 bg-primary/5 px-6 py-2">
        <Link
          to={linkTo}
          prefetch="intent"
          className="group/more flex items-center font-condensed text-lg text-primary"
        >
          <span className="underline-offset-2 group-hover/more:underline">
            Weiterlesen
          </span>
          <ArrowRight
            size="20"
            className="ml-auto stroke-primary transition-transform group-hover/more:translate-x-1"
          />
        </Link>
      </footer>
    </article>
  )
}
