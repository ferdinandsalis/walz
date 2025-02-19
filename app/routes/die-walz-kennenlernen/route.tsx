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
      pastEvents: map(e => EventSchema.parse(e)),
    })(queryResult.data),
  }
}

export default function GetToKnowRoute() {
  const loaderData = useLoaderData<typeof loader>()
  const { upcomingEvents, pastEvents } = loaderData.data
  const nextEvent = upcomingEvents[0]
  const lastTwoPastEvents = pastEvents

  return (
    <div className="relative grid grid-cols-subgrid items-start gap-8 lg:col-span-2">
      <div>
        <h1 className="font-condensed text-h1 font-bold text-muted-foreground opacity-20">
          Kennenlernen
        </h1>
      </div>
      <div className="col-span-1 col-start-1 grid grid-cols-1 gap-16">
        <div className="max-w-2xl space-y-4 text-base md:text-body-md lg:text-body-lg">
          <p>
            Du willst mehr über die Walz erfahren? Dann komm vorbei und erfahre
            alles über die Schule, die Projekte und die Möglichkeiten, die dir
            die Walz bietet.
          </p>
        </div>
        <section id="termine" className="grid gap-y-4">
          <h2 className="text-body-xs font-bold uppercase tracking-widest text-muted-foreground">
            Nächster Termin
          </h2>
          {nextEvent ? (
            <EventCard event={nextEvent} />
          ) : (
            <p>Derzeit sind keine Termine geplant.</p>
          )}
        </section>

        {lastTwoPastEvents.length > 0 && (
          <section id="vergangene-termine" className="grid gap-y-4">
            <h2 className="text-body-xs font-bold uppercase tracking-widest text-muted-foreground">
              Vergangene Termine
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {lastTwoPastEvents.map((event, index) => (
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
    <div className="grid-rows-auto grid grid-cols-1 overflow-hidden text-pretty rounded-lg bg-card shadow-md">
      {event.cover && (
        <figure className="relative col-start-1 row-start-1">
          <img
            src={urlFor(event.cover)
              .quality(70)
              .crop('entropy')
              .height(800)
              .url()}
            alt={event.title}
            className="object-cover grayscale md:aspect-video lg:aspect-[21/8]"
          />
          <div
            aria-role="presenatation"
            className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"
          />
        </figure>
      )}
      <div className="relative col-start-1 row-start-1 flex flex-col items-start justify-end bg-black/10 p-6 sm:rounded-t-md">
        <h2 className="font-condensed text-h2 font-bold leading-none text-secondary shadow-lg">
          {event.title}
        </h2>
      </div>
      <div className="flex-1 p-6">
        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {event.location && (
              <div className="grid gap-2">
                <h3 className="text-body-xs font-bold uppercase tracking-widest text-primary">
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
              <h3 className="text-body-xs font-bold uppercase tracking-widest text-primary">
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
                        className="text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
                      >
                        {children}
                      </Link>
                    )
                  },
                },
                list: {
                  bullet: ({ children }) => (
                    <ul className="my-3 me-3 ms-3 list-inside list-disc">
                      {children}
                    </ul>
                  ),
                },
                listItem: {
                  bullet: ({ children }) => <li>{children}</li>,
                },
                block: {
                  normal: ({ children }) => (
                    <p className="[&:not(:last-child)]:mb-3">{children}</p>
                  ),

                  h4: ({ children }) => (
                    <h4 className="font-bold text-primary">{children}</h4>
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
    <div className="grid content-start gap-4 rounded-lg bg-card p-6 shadow-sm">
      <header>
        <h3 className="font-condensed text-h5 font-bold text-secondary">
          {event.title}
        </h3>
        <div className="text-sm text-muted-foreground">
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
  //const showSpinner = useSpinDelay(fetcher.state !== 'idle')
  const done = !!fetcher.data

  return (
    <>
      <h1 className="font-condensed text-2xl font-bold text-primary md:text-4xl">
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
