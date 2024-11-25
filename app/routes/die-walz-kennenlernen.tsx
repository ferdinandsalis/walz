import { type ActionFunctionArgs } from 'react-router'
import { useFetcher } from 'react-router'
import { getImage } from '@sanity/asset-utils'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { Button } from '#app/components/ui/button.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { urlFor } from '#app/sanity/instance.js'

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const data = Object.fromEntries(formData.entries()) as { email: string }

  return { ok: true, data }
}

interface Event {
  title: string
  date: string
  time?: string
  location?: string
  description: string
  imageUrl?: string
  program?: Array<{
    time: string
    title: string
    description: string
  }>
}

const upcomingEvents: Event[] = [
  {
    title: 'Infoabend',
    date: 'Donnerstag, 21. November 2024',
    time: '19:00 Uhr',
    location:
      'Theatersaal, Walz Wiener Lernzentrum\nHeinrich-Collin-Straße 9\n1140 Wien',
    description:
      'Bevor im März der nächste Aufnahmetag stattfindet, möchten wir allen interessierten Eltern und Jugendlichen die Gelegenheit geben, sich direkt in unseren Räumlichkeiten über das Konzept der Walz, die verschiedenen Projekte, die Kosten sowie über das Aufnahmeverfahren ein Bild zu machen. Renate Chorherr wird Sie durch unser Curriculum führen, und Brigitte Fasching wird die organisatorischen Abläufe erläutern. Im Anschluss besteht die Möglichkeit, offene Fragen zu klären und persönliche Gespräche zu führen.',
    imageUrl:
      'https://cdn.sanity.io/images/iaejvb99/production/a06fe23837d6fd1c638ee0c2f138cf9e842bcf54-7222x4820.jpg',
    program: [],
  },
]

const pastEvents: Event[] = [
  {
    title: 'Tag der Offenen Tür',
    date: 'Samstag, 5. Oktober 2024',
    time: '15:00 Uhr',
    location:
      'Theatersaal, Walz Wiener Lernzentrum\nHeinrich-Collin-Straße 9\n1140 Wien',
    description:
      'Ein Tag der Offenen Tür für interessierte Jugendliche, Eltern und Freund:innen zum Mitmachen und Miterleben.',
    program: [
      {
        time: '15:00–18:00',
        title: 'Die Walz stellt sich vor.',
        description:
          'Ausstellungen, Walz-Reisebüro, Informationsstand, Junior Companies, Führungen, Walz-Kino, Workshops in Fremdsprachen, Theater-Impro, offenes Atelier, u.v.m.',
      },
      {
        time: '18:00–19:30',
        title: 'Theateraufführung',
        description:
          'Der Jahrgang Psi 4 spielt „Das Spiel ist aus" von Jean-Paul Sartre.\nÈve, eine Dame der Gesellschaft, und Pierre, der Revolutionär, sterben im selben Augenblick. Sie begegnen sich im Tod und merken, dass sie füreinander bestimmt waren. Kann ihre Liebe den Tod überwinden? Sie haben 24 Stunden Zeit, um das herauszufinden.',
      },
    ],
    imageUrl:
      'https://cdn.sanity.io/images/iaejvb99/production/98498208fde86487702b1658a636b9bb0b25c86d-7360x4912.jpg',
  },
]

// Add this new EventCard component
function EventCard({ event }: { event: Event }) {
  return (
    <div className="grid-rows-auto grid grid-cols-1 overflow-hidden text-pretty rounded-lg bg-card shadow-md">
      {event.imageUrl && (
        <figure className="col-start-1 row-start-1">
          <img
            src={urlFor(getImage(event.imageUrl))
              .quality(70)
              .crop('entropy')
              .height(800)
              .url()}
            alt={event.title}
            className="object-cover grayscale md:aspect-video lg:aspect-[21/8]"
          />
        </figure>
      )}
      <div className="relative col-start-1 row-start-1 flex flex-col items-start justify-between bg-black/10 p-8 sm:rounded-t-md">
        <h2 className="font-condensed text-h2 font-bold text-primary drop-shadow-lg">
          {event.title}
        </h2>
      </div>
      <div className="flex-1 p-6">
        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {event.location && (
              <div className="grid gap-2">
                <h3 className="text-body-xs font-bold uppercase tracking-widest text-muted-foreground">
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
              <h3 className="text-body-xs font-bold uppercase tracking-widest text-muted-foreground">
                Wann?
              </h3>
              <div>
                <div>{event.date}</div>
                {event.time && <div>{event.time}</div>}
              </div>
            </div>
          </div>
          <hr className="border-muted-foreground/10" />
          <div>
            <p className="">{event.description}</p>
          </div>
          {event.program && event.program.length > 0 && (
            <div className="grid gap-2">
              <h3 className="text-body-xs font-bold uppercase tracking-widest text-muted-foreground">
                Programm
              </h3>
              <ol className="space-y-2">
                {event.program.map((item, index) => (
                  <li key={index}>
                    <span className="text-secondary">{item.time}</span>
                    <h4 className="font-condensed text-h5 text-primary">
                      {item.title}
                    </h4>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Add this new CompactEventCard component
function CompactEventCard({ event }: { event: Event }) {
  return (
    <div className="grid gap-2 rounded-lg bg-card p-4 shadow-sm">
      <h3 className="font-condensed text-h4 font-bold text-primary">
        {event.title}
      </h3>
      <div className="text-sm text-muted-foreground">
        <div>{event.date}</div>
        {event.time && <div>{event.time}</div>}
      </div>
      <p className="text-sm">{event.description}</p>
    </div>
  )
}

export default function GetToKnowRoute() {
  const nextEvent = upcomingEvents[0] // Assuming the first event is the next one
  const lastTwoPastEvents = pastEvents.slice(0, 2) // Get the last two past events

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

export function ReminderForm() {
  const fetcher = useFetcher<typeof action>()
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
