import { Link, useLoaderData } from '@remix-run/react'
import { take } from 'ramda'
import { dates } from '#app/data/dates.ts'
import { currentYears } from '#app/data/years.ts'
import { ArrowRight, BabyIcon, ChevronDown, DownloadIcon } from 'lucide-react'
import { Divider } from '#app/components/ui/divider.tsx'
import { LoaderFunctionArgs, MetaFunction, json } from '@remix-run/node'
import { Toc } from '#app/components/toc.tsx'
import { BackToTop } from '#app/components/back-to-top.tsx'
import { cn } from '#app/utils/misc.tsx'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion'
import { loadQuery } from '@sanity/react-loader'
import { QueryResult, query } from './aktuelles.query.ts'

export const meta: MetaFunction = () => {
  return [{ title: 'Aktuelles | Walz' }]
}

export async function loader({ params }: LoaderFunctionArgs) {
  const queryResult = await loadQuery<QueryResult>(query)

  return json({
    query,
    params,
    data: queryResult.data,
  })
}

export default function Aktuelles() {
  const loaderData = useLoaderData<typeof loader>()
  const posts = loaderData.data.posts

  return (
    <div className="md:mt-12">
      <h1 className="absolute left-0 origin-top-left rotate-90 scale-[4] font-condensed text-xl font-bold text-muted-foreground opacity-10">
        Aktuelles
      </h1>

      <div className="space-y-12 md:space-y-16">
        <Toc
          links={[
            { name: 'Beiträge', to: '#beitraege' },
            { name: 'Jahrgänge', to: '#jahrgaenge' },
            { name: 'Termine', to: '#termine' },
          ]}
        />

        <Divider />

        <section id="beitraege" className="col-span-2 space-y-8">
          <h1 className="mb-8 font-condensed text-2xl font-bold text-primary md:text-4xl">
            Beiträge
          </h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts &&
              take(3, posts).map(post => (
                <PostItem
                  title={post.title}
                  previewText={post.previewText}
                  linkTo={`/aktuelles/beitraege/${post.slug.current}`}
                  key={post.slug.current}
                />
              ))}
          </div>

          <BackToTop />
        </section>

        <Divider />

        <section id="termine" className="space-y-8">
          <h1 className="font-condensed text-2xl font-bold text-primary md:text-4xl">
            Termine
          </h1>

          <Accordion collapsible type="single">
            {dates.map((date, idx) =>
              date.description ? (
                <AccordionItem
                  key={`${date.startDate.toISOString()}_${date.title}`}
                  value={`${date.startDate.toISOString()}_${date.title}`}
                >
                  <div
                    className={cn(
                      'border-b-2 border-b-background bg-card/50 transition-colors',
                      {
                        'border-b-secondary':
                          idx === 0 || idx === dates.length - 2,
                      },
                    )}
                  >
                    <AccordionTrigger asChild>
                      <div
                        className={cn(
                          'grid w-full grid-cols-3 gap-4 px-4 py-1',
                          'transition-all [&[data-state=open]>svg]:rotate-180',
                          'cursor-pointer items-center',
                          'data-[state=open]:bg-primary/10',
                          {
                            'font-bold': date.type === 'internal',
                            'text-muted-foreground': date.type !== 'internal',
                          },
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
                        <h1>{date.title}</h1>
                        <ChevronDown className="h-4 w-4 shrink-0 justify-self-end stroke-primary transition-transform duration-200" />
                      </div>
                    </AccordionTrigger>
                  </div>
                  {date.description && (
                    <AccordionContent asChild>
                      <div className="transform-gpu overflow-hidden bg-card p-4 py-6 transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                        <dl className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            {date.startTime && (
                              <div>
                                <dt className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                  Beginn
                                </dt>
                                <dd className="">{date.startTime} Uhr</dd>
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
                              <p className="max-w-prose">{date?.description}</p>
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
                  className={cn('border-b-2 border-b-background bg-card/50', {
                    'border-b-secondary': idx === 0 || idx === dates.length - 2,
                  })}
                >
                  <div
                    className={cn('grid grid-cols-3 gap-4 px-4 py-1', {
                      'font-bold': date.type === 'internal',
                      'text-muted-foreground': date.type !== 'internal',
                    })}
                  >
                    <time className="" dateTime={date.startDate.toISOString()}>
                      {date.startDate.toLocaleString('de-AT', {
                        month: 'long',
                        day: '2-digit',
                      })}
                    </time>
                    <h1>{date.title}</h1>
                  </div>
                </div>
              ),
            )}
          </Accordion>

          <BackToTop />
        </section>

        <Divider />

        <section id="jahrgaenge" className="space-y-8">
          <h1 className="font-condensed text-2xl font-bold text-primary md:text-4xl">
            Jahrgänge
          </h1>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {currentYears
              .filter(year => !year.graduatedAt)
              .map(year => (
                <Year key={year.name} {...year} />
              ))}
          </div>

          <BackToTop />
        </section>
      </div>
    </div>
  )
}

function Year({
  name,
  symbol,
  startedAt,
  mentor,
  currentCover,
  currentPlanHref,
}: {
  name: string
  symbol: string
  startedAt: Date
  mentor?: { name: string }
  currentCover: string | null
  currentPlanHref: string | null
}) {
  return (
    <article key={name} className="flex rounded-md bg-card shadow-md">
      <div className="relative flex flex-1 flex-col overflow-hidden py-6 pl-6">
        <div className="text-1xl absolute right-14 top-10 scale-[7] font-black lowercase text-primary opacity-10">
          {symbol}
        </div>

        <div className="flex-1">
          <h1 className="inline-flex gap-1 text-3xl font-bold">
            <span>{name}</span>
            <span className="text-lg font-bold text-primary">
              {/* years till now from year.startedAt */}
              {new Date().getFullYear() + 1 - startedAt.getFullYear()}
            </span>
          </h1>
          <div className="">
            <Link
              className="font-bold text-secondary hover:underline hover:underline-offset-2"
              to={`/ueber-uns/#${mentor?.name}`}
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

        {currentPlanHref && (
          <div className="mt-4 flex items-center gap-1">
            <a
              href={currentPlanHref}
              className="text-muted-foreground underline underline-offset-2"
            >
              Aktueller Jahresplan
            </a>
            <DownloadIcon className="stroke-primary" size={20} />
          </div>
        )}
      </div>
      <div className="xl:w-80 relative flex aspect-video w-32 rounded-r-md md:w-60 lg:w-60">
        {currentCover ? (
          <img
            src={currentCover}
            alt={`${name} Foto`}
            className="flex-1 rounded-r-md object-cover object-center"
          />
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-r-md  bg-gradient-to-t from-secondary/40 to-transparent ">
            <BabyIcon size={96} className="w-12 stroke-secondary/20 md:w-24" />
          </div>
        )}
        <div
          role="presentation"
          className="absolute inset-0 rounded-r-md ring-2 ring-inset ring-card/30"
        />
      </div>
    </article>
  )
}

function PostItem({
  title,
  previewText,
  linkTo,
}: {
  title: string
  previewText: string
  linkTo: string
}) {
  return (
    <article
      key={title}
      className="grid content-between gap-4 rounded-md bg-card p-6 shadow"
    >
      <div className="">
        <Link prefetch="intent" to={linkTo}>
          <h1 className="mb-2 font-condensed text-xl font-bold !leading-tight text-secondary md:text-2xl">
            {title}
          </h1>
        </Link>
        <p className="leading-snug">
          {previewText} <span>…</span>
        </p>
      </div>
      <footer>
        <Link
          to={linkTo}
          prefetch="intent"
          className="group/more flex items-center font-condensed text-lg text-muted-foreground"
        >
          <span className="underline-offset-2 group-hover/more:underline">
            Beitrag lesen
          </span>
          <ArrowRight
            size="20"
            className="stroke-primary transition-transform group-hover/more:translate-x-1"
          />
        </Link>
      </footer>
    </article>
  )
}
