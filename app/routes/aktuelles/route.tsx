import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion'
import { unstable_defineLoader as defineLoader } from '@remix-run/node'
import { Link, useLoaderData, useLocation } from '@remix-run/react'
import { loadQuery } from '@sanity/react-loader'
import {
  ArrowRight,
  BabyIcon,
  ChevronDown,
  DownloadIcon,
  Link2Icon,
} from 'lucide-react'
import { marked } from 'marked'
import { evolve, groupBy, take } from 'ramda'
import { promiseHash } from 'remix-utils/promise'
import slug from 'slug'
import { z } from 'zod'
import { Toc } from '#app/components/toc.tsx'
import { Divider } from '#app/components/ui/divider.tsx'
import {
  type SchoolEvent,
  type SchoolEventParsed,
  events as datesData,
} from '#app/data/dates.ts'
import { urlFor } from '#app/sanity/instance.ts'
import { alphabetMap } from '#app/sanity/schema/year.ts'
import { cn } from '#app/utils/misc.tsx'
import { calculateCurrentYear } from '#app/utils/years.js'
import {
  type QueryResult,
  type Year,
  YearSchema,
  aktuellesQuery,
} from './query.ts'

export function meta() {
  return [{ title: 'Aktuelles | Walz' }]
}

function evolveEvent(event: SchoolEvent) {
  const hash = evolve({
    description: v => (v ? marked.parse(v) : v),
    startDate: v => new Date(v),
    endDate: v => new Date(v),
  })(event)

  // @ts-ignore naaaah, I dont get it
  return promiseHash<SchoolEventParsed>(hash)
}

export const loader = defineLoader(async ({ params }) => {
  const queryResult = await loadQuery<QueryResult>(aktuellesQuery)
  const years = z.array(YearSchema).parse(queryResult.data.years)

  const groupedDates = groupBy<SchoolEventParsed, string>(v => {
    return new Date(v.startDate).getUTCFullYear().toString()
  })(await Promise.all(datesData.map(evolveEvent)))

  return {
    query: aktuellesQuery,
    params,
    data: {
      posts: take(3, queryResult.data.posts),
      groupedDates,
      years,
    },
  }
})

export default function Aktuelles() {
  const location = useLocation()
  const currentHash = location.hash.replace('#', '') || undefined
  const loaderData = useLoaderData<typeof loader>()
  const { posts, years, groupedDates } = loaderData.data

  return (
    <div className="md:mt-12">
      <h1 className="absolute left-0 origin-top-left rotate-90 scale-[4] font-condensed text-xl font-bold text-muted-foreground opacity-10">
        Aktuelles
      </h1>

      <div className="space-y-12 md:space-y-16">
        <Toc
          links={[
            { name: 'Jahrgänge', to: '#jahrgaenge' },
            { name: 'Termine', to: '#termine' },
            { name: 'Beiträge', to: '#beitraege' },
          ]}
        />

        <Divider withBackToTop={false} />

        <section id="jahrgaenge" className="space-y-8">
          <h1 className="font-condensed text-2xl font-bold text-primary md:text-4xl">
            Jahrgänge
          </h1>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
            {Object.entries(groupedDates).map(([year, dates]) => {
              return (
                <section key={year}>
                  <h2 className="mb-2 text-right font-condensed text-body-lg font-bold text-muted-foreground/70">
                    {year}
                  </h2>

                  <div className="grid gap-1">
                    {dates?.map((date, idx) => {
                      const key = `${date.startDate.toISOString()}_${slug(date.title)}`
                      return date.description ? (
                        <AccordionItem key={key} value={key}>
                          <div
                            id={key}
                            className={cn('bg-card/50 transition-colors')}
                          >
                            <AccordionTrigger asChild>
                              <div
                                className={cn(
                                  'grid w-full grid-cols-3 gap-4 px-4 py-1',
                                  'transition-all [&[data-state=open]>svg]:rotate-180',
                                  'cursor-pointer items-center',
                                  'data-[state=open]:bg-primary/10',
                                )}
                              >
                                <time
                                  className=""
                                  dateTime={date.startDate.toISOString()}
                                >
                                  {date.startDate.toLocaleString('de-AT', {
                                    month: 'long',
                                    day: '2-digit',
                                  })}
                                </time>
                                <h1
                                  className={cn('truncate font-bold')}
                                  title={date.title}
                                >
                                  {date.title}
                                </h1>
                                <ChevronDown className="h-4 w-4 shrink-0 justify-self-end stroke-primary transition-transform duration-200" />
                              </div>
                            </AccordionTrigger>
                          </div>
                          {date.description && (
                            <AccordionContent asChild>
                              <div className="transform-gpu overflow-hidden bg-card p-4 py-6 transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                                <h1 className="mb-4 text-h5 font-bold">
                                  {date.title}
                                </h1>
                                <dl className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    {date.startTime && (
                                      <div>
                                        <dt className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                          Beginn
                                        </dt>
                                        <dd className="">
                                          {date.startTime} Uhr
                                        </dd>
                                      </div>
                                    )}
                                    {date.endTime && (
                                      <div>
                                        <dt className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                          Ende
                                        </dt>
                                        <dd className="">{date.endTime} Uhr</dd>
                                      </div>
                                    )}
                                    {date.links && (
                                      <div className="col-span-2">
                                        <dt className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                          Links
                                        </dt>
                                        <dd className="">
                                          <ul className="list-inside list-disc">
                                            {date.links.map(link => (
                                              <li key={link.href}>
                                                {link.download ? (
                                                  <a
                                                    href={link.href}
                                                    download={link.download}
                                                    className="inline-flex items-center gap-1"
                                                  >
                                                    {link.title}
                                                    <DownloadIcon
                                                      size={16}
                                                      className="inline-block stroke-primary"
                                                    />
                                                  </a>
                                                ) : (
                                                  <Link
                                                    className="underline underline-offset-2"
                                                    to={link.href}
                                                  >
                                                    {link.title}
                                                  </Link>
                                                )}
                                              </li>
                                            ))}
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
                                      <p
                                        className="max-w-prose hyphens-auto text-pretty"
                                        dangerouslySetInnerHTML={{
                                          __html: date?.description,
                                        }}
                                      ></p>
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
                              dateTime={date.startDate.toISOString()}
                            >
                              {date.startDate.toLocaleString('de-AT', {
                                month: 'long',
                                day: '2-digit',
                              })}
                            </time>
                            <h1 className="font-bold">{date.title}</h1>
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

        <section id="beitraege" className="col-span-2 grid grid-cols-1 gap-4">
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
    <article key={letter} className="flex rounded-md bg-card shadow-md">
      <div className="relative flex flex-1 flex-col overflow-hidden py-6 pl-6">
        <div className="text-1xl absolute right-14 top-10 scale-[7] font-black lowercase text-primary opacity-10">
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
              className="text-body-xs text-muted-foreground underline underline-offset-2"
            >
              Jahresplan
            </a>
            <DownloadIcon className="stroke-primary" size={18} />
          </div>
        )}
      </div>
      <Link
        to={`/jahrgaenge/${letter}`}
        className="xl:w-80 group relative flex aspect-video w-32 rounded-r-md md:w-60 lg:w-60"
      >
        {photos ? (
          <img
            src={urlFor(photos[0]).quality(70).width(600).url()}
            alt={`${letter} Foto`}
            className="flex-1 rounded-r-md object-cover object-center"
          />
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-r-md bg-gradient-to-t from-secondary/40 to-transparent">
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
