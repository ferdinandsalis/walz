import { PortableText } from '@portabletext/react'
import { loadQuery } from '@sanity/react-loader'
import { evolve, map } from 'ramda'
import {
  Link,
  type LoaderFunctionArgs,
  useFetcher,
  useLoaderData,
} from 'react-router'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { type z } from 'zod'
import { Button } from '#app/components/ui/button.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { urlFor } from '#app/sanity/instance.ts'
import { EventSchema } from '#app/sanity/schema/event.tsx'
import { type KennenlernenQueryResult } from '#app/sanity/types.ts'
import { kennenlernenQuery } from './query.ts'

export async function loader({ params }: LoaderFunctionArgs) {
  const queryResult = await loadQuery<KennenlernenQueryResult>(
    kennenlernenQuery,
    {},
  )

  return {
    query: kennenlernenQuery,
    params,
    data: evolve({
      upcomingEvents: map(e => EventSchema.parse(e)),
    })(queryResult.data),
  }
}

export default function GetToKnowRoute() {
  const loaderData = useLoaderData<typeof loader>()
  const { upcomingEvents } = loaderData.data
  const nextEvent = upcomingEvents[0]
  const otherUpcomingEvents = upcomingEvents.slice(1)

  return (
    <div className="relative grid grid-cols-subgrid items-start gap-8 lg:col-span-2">
      <div>
        <h1 className="font-condensed text-h1 text-muted-foreground font-bold opacity-20">
          Kennenlernen
        </h1>
      </div>
      <div className="col-span-1 col-start-1 grid grid-cols-12 gap-x-4 gap-y-16 sm:gap-x-6 lg:gap-x-8">
        <div className="md:text-body-md lg:text-body-lg col-span-12 max-w-2xl space-y-4 text-base">
          <p>
            Du willst mehr über die Walz erfahren? Dann komm vorbei und erfahre
            alles über die Schule, die Projekte und die Möglichkeiten, die dir
            die Walz bietet.
          </p>
        </div>
        <section id="termine" className="col-span-12 grid gap-y-4">
          <h2 className="text-body-xs text-muted-foreground font-bold tracking-widest uppercase">
            Nächster Termin
          </h2>
          {nextEvent ? (
            <EventCard event={nextEvent} />
          ) : (
            <p>Derzeit sind keine Termine geplant.</p>
          )}
        </section>

        {otherUpcomingEvents.length > 0 && (
          <section
            id="vergangene-termine"
            className="col-span-12 grid grid-cols-subgrid gap-y-4"
          >
            <h2 className="text-body-xs text-muted-foreground col-span-12 font-bold tracking-widest uppercase">
              Weitere Termine
            </h2>
            <div className="col-span-12 grid grid-cols-subgrid gap-y-4">
              {otherUpcomingEvents.map((event, index) => (
                <CompactEventCard key={index} event={event} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

type Event = z.infer<typeof EventSchema>

function EventCard({ event }: { event: Event }) {
  return (
    <div className="grid-rows-auto bg-card grid grid-cols-1 overflow-hidden rounded-lg text-pretty shadow-md">
      {event.cover && (
        <figure className="relative col-start-1 row-start-1">
          <img
            src={urlFor(event.cover)
              .quality(70)
              .crop('entropy')
              .height(800)
              .url()}
            alt={event.title}
            className="object-cover grayscale md:aspect-video lg:aspect-21/8"
          />
          <div
            aria-role="presenatation"
            className="absolute inset-0 bg-linear-to-b from-transparent to-black/60"
          />
        </figure>
      )}
      <div className="relative col-start-1 row-start-1 flex flex-col items-start justify-end bg-black/10 p-6 sm:rounded-t-md">
        <h2 className="font-condensed text-h2 text-secondary leading-none font-bold shadow-lg">
          {event.title}
        </h2>
      </div>
      <div className="flex-1 p-6">
        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {event.location && (
              <div className="grid gap-2">
                <h3 className="text-body-xs text-primary font-bold tracking-widest uppercase">
                  Wo?
                </h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: event.location.replace(/\n/g, '<br />'),
                  }}
                />
              </div>
            )}
            <div className="grid content-start gap-2">
              <h3 className="text-body-xs text-primary font-bold tracking-widest uppercase">
                Wann?
              </h3>
              <div>
                <div>
                  {event.start.date.toLocaleDateString('de-AT', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  {event.start.time && (
                    <>
                      , <span>{event.start.time}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <hr className="border-muted" />
          <div>
            <PortableText
              value={event.description}
              onMissingComponent={false}
              components={{
                marks: {
                  link: ({ children, value }) => {
                    return (
                      <Link
                        to={value.href}
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                      >
                        {children}
                      </Link>
                    )
                  },
                },
                list: {
                  bullet: ({ children }) => (
                    <ul className="my-3 ms-3 me-3 list-inside list-disc">
                      {children}
                    </ul>
                  ),
                },
                listItem: {
                  bullet: ({ children }) => <li>{children}</li>,
                },
                block: {
                  normal: ({ children }) => (
                    <p className="not-last:mb-3">{children}</p>
                  ),

                  h4: ({ children }) => (
                    <h4 className="text-primary font-bold">{children}</h4>
                  ),
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function CompactEventCard({ event }: { event: Event }) {
  return (
    <div className="bg-card col-span-12 grid content-start gap-4 rounded-lg p-6 shadow-xs sm:col-span-6">
      <header>
        <h3 className="font-condensed text-h5 text-secondary font-bold">
          {event.title}
        </h3>
        <div className="text-muted-foreground text-sm">
          <div>
            {event.start.date.toLocaleDateString('de-AT', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            {event.start.time && (
              <>
                , <span>{event.start.time}</span>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  )
}

export function ReminderForm() {
  const fetcher = useFetcher()
  const done = !!fetcher.data

  return (
    <>
      <h1 className="font-condensed text-primary text-2xl font-bold md:text-4xl">
        Erinnerungsservice
      </h1>
      <p className="max-w-prose">
        Hinterlasse und deine E-Mail und wir informieren dich über die nächste
        Veranstaltung, wo du die Schule kennenlernen kannst.
      </p>
      <fetcher.Form
        name="newsletter"
        method="POST"
        action="/resources/newsletter"
        className="grid max-w-xl gap-4 rounded-md"
        key={JSON.stringify(fetcher.data)}
      >
        <HoneypotInputs />
        <Input type="email" placeholder="E-mail" className="bg-card" />
        <footer>
          <Button variant="secondary" type="submit">
            {done ? 'Erfolgreich' : 'Erinnere mich'}
          </Button>
        </footer>
      </fetcher.Form>
    </>
  )
}
