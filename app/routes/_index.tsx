import { LogoSymbol } from '#app/components/brand.tsx'
import { SectionHeading } from '#app/components/section-heading.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { testimonials } from '#app/data/testimonials.ts'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import {
  ArrowRight,
  AsteriskIcon,
  CalendarClockIcon,
  LinkIcon,
  LoaderIcon,
} from 'lucide-react'
import { useSpinDelay } from 'spin-delay'
import { take } from 'ramda'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { pillars } from './ueber-uns+/philosophie.tsx'
import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { dates } from '#app/data/dates.ts'
import { loadQuery } from '#app/sanity/loader.server.ts'
import { query, type QueryResult } from './_index.query.ts'
import { urlFor } from '#app/sanity/instance.ts'

export async function loader(_loaderArgs: LoaderFunctionArgs) {
  const queryResult = await loadQuery<QueryResult>(query)

  return json({
    query,
    data: queryResult.data,
  })
}

export default function Home() {
  const loaderData = useLoaderData<typeof loader>()
  const latestPost = loaderData.data.posts[0]
  const hero = loaderData.data.hero

  return (
    <div className="space-y-16 md:space-y-20 lg:space-y-24">
      <div className="relative -mx-4 grid grid-cols-1 grid-rows-1 sm:-mx-8 sm:rounded-md md:-mx-12">
        <h1 className="sr-only">Einleitung</h1>
        <div className="col-end col-start-1 row-start-1">
          <picture>
            <source
              srcSet={urlFor(hero.image).quality(70).width(800).url()}
              media="(max-width: 800px)"
            />
            <img
              src={urlFor(hero.image).quality(70).width(1800).url()}
              alt="Walz draussen"
              className="h-96 w-full object-cover sm:aspect-video sm:h-auto sm:rounded-t-md md:aspect-[21_/_12]"
            />
          </picture>
        </div>

        <div className="relative col-start-1 row-start-1 flex flex-col items-start justify-between bg-black/30 p-8 sm:rounded-t-md sm:p-16 md:p-20 lg:py-24">
          <LogoSymbol className="absolute bottom-12 right-12 w-60 text-primary opacity-50 sm:-bottom-32 sm:-right-10 sm:w-64 md:w-72 md:opacity-60 lg:right-10 lg:w-80" />
          <p className="relative max-w-xl text-pretty font-sans text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-5xl lg:text-6xl">
            Die <strong className="font-bold text-secondary">Walz</strong> soll
            darauf vor­bereiten, mit Liebe die Welt und die Gesell­schaft
            mitzuge­stalten.
          </p>
        </div>

        <article className="col-start-1 row-start-2 flex items-center gap-2 bg-muted/60 p-3 px-4 shadow-inner sm:rounded-b-md sm:px-8 md:px-12">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <div className="flex items-center gap-2">
              <h1 className="flex items-center gap-1">
                <span className="sr-only">Nächster Termin</span>
                <CalendarClockIcon
                  size={24}
                  className="inline-block text-secondary"
                />
              </h1>
              {take(
                1,
                dates.filter(date => date.startDate > new Date()),
              ).map(date => {
                return (
                  <p
                    key={`${date.startDate}_${date.title}`}
                    className="font-condensed font-bold"
                  >
                    <span className="">{date.title}</span> am{' '}
                    <time dateTime={date.startDate.toISOString()} className="">
                      {date.startDate.toLocaleDateString('de-AT', {
                        day: 'numeric',
                        month: 'long',
                      })}
                    </time>
                  </p>
                )
              })}
            </div>{' '}
            <Link
              to="./aktuelles#termine"
              className="group/more flex items-center font-condensed text-muted-foreground"
            >
              <span className="underline-offset-2 group-hover/more:underline">
                Alle Termine
              </span>
              <ArrowRight
                size="16"
                className="stroke-primary transition-transform group-hover/more:translate-x-1"
              />
            </Link>
          </div>
        </article>
      </div>

      <div className="grid gap-16 lg:grid-cols-6 lg:grid-rows-1">
        <section className="lg:col-span-3 lg:row-start-1">
          <h1 className="mb-2 font-condensed text-lg font-bold text-primary lg:mb-4">
            Was ist die Walz?
          </h1>
          <p className="max-w-xl text-pretty text-body-md md:text-body-lg lg:text-body-xl">
            In der Walz können Jugendliche zwischen 14 und 19 Jahren in einem
            geschützten Rahmen ihre Potenziale entfalten, ihre Möglichkeiten
            ausloten und werden auf die Matura vorbereitet.
          </p>
        </section>

        <section className="lg:col-span-3 lg:col-start-4 lg:row-start-1">
          <h1 className="mb-2 font-condensed text-lg font-bold text-primary lg:mb-4">
            Aktuelles
          </h1>
          <article className="relative max-w-prose rounded-lg bg-white p-6 shadow-md shadow-gray-200">
            <h1 className="xl:text-3xl mb-2 max-w-xs font-condensed text-xl font-bold !leading-tight text-secondary md:text-2xl lg:text-2xl">
              <Link to={`/aktuelles/beitraege/${latestPost.slug.current}`}>
                {latestPost.title}
              </Link>
            </h1>
            <p className="text-body-xs text-muted-foreground">
              Veröffentlicht am{' '}
              <time>
                {new Date(latestPost.publishedAt).toLocaleString('de-AT', {
                  dateStyle: 'medium',
                })}
              </time>
            </p>
            <p className="mt-4 max-w-md text-balance text-body-sm font-light leading-snug lg:text-body-md">
              {latestPost.previewText} <span>…</span>
            </p>
            <footer>
              <Link
                to={`/aktuelles/beitraege/${latestPost.slug.current}`}
                className="group/more mt-4 flex items-center font-condensed text-lg text-muted-foreground"
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
        </section>
      </div>

      <section>
        <header className="mb-16">
          <SectionHeading id="philosophie">Unsere Philosophie</SectionHeading>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((entry, idx) => {
            return (
              <LinkPhotoCard
                key={idx}
                title={entry.title}
                abstract={entry.abstract}
                image={entry.image}
                link={entry.link}
              />
            )
          })}
        </div>
      </section>

      <section>
        <header className="mb-16 lg:mb-20">
          <SectionHeading id="faq">Häufige Fragen</SectionHeading>
        </header>
        <div className="flex flex-row flex-wrap gap-3 md:flex-row">
          <Link
            to="/faq#was-unterscheidet-die-walz"
            className="group flex overflow-hidden rounded bg-card text-body-md !leading-snug text-primary shadow md:text-body-lg"
          >
            <span className="min-w-10 bg-card px-2 py-1 text-secondary group-hover:bg-secondary group-hover:text-card">
              <AsteriskIcon className="relative top-[1px] md:top-[4px]" />
            </span>
            <span className="bg-primary/5 px-3 py-1 transition-colors ease-in-out group-hover:bg-primary/10">
              Was unterscheidet die Walz von einer klassischen Oberstufe?
            </span>
          </Link>
          <Link
            to="/faq#was-heisst-eigentlich-walz"
            className="group flex overflow-hidden rounded bg-card text-body-md !leading-snug text-primary shadow md:text-body-lg"
          >
            <span className="min-w-10 flex-none bg-card px-2 py-1 text-secondary group-hover:bg-secondary group-hover:text-card">
              <AsteriskIcon className="relative top-[1px] md:top-[4px]" />
            </span>
            <span className="bg-primary/5 px-3 py-1 transition-colors ease-in-out group-hover:bg-primary/10">
              Was heißt eigentlich Walz?
            </span>
          </Link>
          <Link
            to="/faq/#wie-kann-ich-die-walz-kennenlernen"
            className="group flex overflow-hidden rounded bg-card text-body-md !leading-snug text-primary shadow md:text-body-lg"
          >
            <span className="min-w-10 flex-none bg-card px-2 py-1 text-secondary group-hover:bg-secondary group-hover:text-card">
              <AsteriskIcon className="relative top-[1px] md:top-[4px]" />
            </span>
            <span className="bg-primary/5 px-3 py-1 transition-colors ease-in-out group-hover:bg-primary/10">
              Wie kann ich die Walz kennenlernen?
            </span>
          </Link>
          <Link
            to="/faq/#wieso-gibt-es-externistenpruefungen"
            className="group flex overflow-hidden rounded bg-card text-body-md !leading-snug text-primary shadow md:text-body-lg"
          >
            <span className="min-w-10 flex-none bg-card px-2 py-1 text-secondary transition-colors group-hover:bg-secondary group-hover:text-card">
              <AsteriskIcon className="relative top-[1px] md:top-[4px]" />
            </span>
            <span className="bg-primary/5 px-3 py-1 transition-colors ease-in-out group-hover:bg-primary/10">
              Wieso gibt es Externistenprüfungen?
            </span>
          </Link>
          <Link
            to="/faq/#was-kostet-die-walz"
            className="group flex overflow-hidden rounded bg-card text-body-md !leading-snug text-primary shadow md:text-body-lg"
          >
            <span className="min-w-10 flex-none bg-card px-2 py-1 text-secondary group-hover:bg-secondary group-hover:text-card">
              <AsteriskIcon className="relative top-[1px] md:top-[4px]" />
            </span>
            <span className="bg-primary/5 px-3 py-1 transition-colors ease-in-out group-hover:bg-primary/10">
              Was kostet die Walz?
            </span>
          </Link>
        </div>
      </section>

      <section>
        <header className="mb-16 lg:mb-20">
          <SectionHeading id="testimonials">
            Stimmen aus der Walz
          </SectionHeading>
        </header>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {take(4, testimonials).map((entry, idx) => {
            return (
              <blockquote
                key={idx}
                className="relative max-w-prose bg-background"
              >
                <p className="text-md relative text-balance rounded-lg bg-card p-6 font-light text-card-foreground shadow-sm lg:p-6 lg:text-body-md">
                  {entry.text}
                </p>
                <footer className="ml-4 mt-3 lg:ml-6">
                  <p className="text-body-sm font-bold">
                    <span className="text-secondary">—</span> {entry.emoticon}{' '}
                    {entry.name}
                  </p>
                </footer>
              </blockquote>
            )
          })}
        </div>
      </section>

      <section>
        <header className="mb-16 lg:mb-20">
          <SectionHeading id="kontakt">Anfahrt & Kontakt</SectionHeading>
        </header>
        <div className="grid gap-8 md:grid-cols-6">
          <Link
            to="https://goo.gl/maps/sb3LQfsePwU3zMPg8"
            className="relative h-72 overflow-hidden rounded bg-muted/10 md:col-span-4 md:col-start-1 lg:h-96"
          >
            <img
              src={`https://maps.googleapis.com/maps/api/staticmap?center=48.1984402,16.2922301&zoom=16&size=800x500&key=${ENV.GOOGLE_MAPS_API_KEY}&scale=2&map_id=8811b5d90ece1ea5`}
              alt="Karte"
              className="h-full w-full object-cover"
            />
            <div className="absolute left-0 top-0 h-full w-full overflow-hidden border shadow-inner shadow-muted/80"></div>
          </Link>
          <div className="md:col-span-2 md:col-start-5">
            <h2 className="mb-2 font-condensed text-lg font-bold text-primary lg:mb-4">
              Kontakt
            </h2>
            <div className="lg:text-body-md">
              <p>
                <strong>Walz Wiener Lernzentrum</strong>
              </p>
              <p>Heinrich-Collin-Straße 9</p>
              <p>1140 Wien</p>
              <p>Tel.: 01 8042939</p>
              <p>Fax: 01 8042939-2000</p>
              <p>Email: office@walz.at</p>
            </div>

            <div className="mt-4">
              <p className="text-balance">
                <Link
                  to="/rundgang"
                  className="text-muted-foreground underline-offset-2 hover:underline"
                >
                  Klicke hier um die Walz bei einem virtuellen Rundgang
                  kennenzulernen.{' '}
                  <LinkIcon
                    className="relative top-[1px] inline stroke-primary align-baseline"
                    size={16}
                  />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export function LinkPhotoCard({
  title,
  abstract,
  image,
  imageAlt,
  link,
}: {
  title: string
  abstract: string
  image: string
  imageAlt?: string
  link: string
}) {
  return (
    <Link
      to={link}
      prefetch="render"
      className="group flex flex-col rounded-lg focus:outline-primary"
    >
      <div className="relative border-8 border-transparent border-b-primary px-2">
        <div className="relative translate-y-4 overflow-hidden rounded-lg shadow-xl shadow-muted/50 transition-all group-hover:translate-y-2 group-hover:rotate-1">
          <img
            src={image}
            alt={imageAlt}
            className="ascpet-square h-48 w-full bg-muted object-cover grayscale group-hover:grayscale-0"
          />
          <div
            role="presentation"
            className="absolute inset-0 rounded-lg ring-1 ring-inset ring-foreground/20"
          />
        </div>
      </div>

      <div className="relative rounded-b-lg border-t-4 border-t-primary bg-card p-6 pt-6 shadow-md">
        <hgroup className="flex-1">
          <h1 className="mb-1 font-condensed text-xl font-bold text-secondary md:text-3xl lg:text-4xl">
            {title}
          </h1>
          <p className="text-lg font-bold leading-none">{abstract}</p>
        </hgroup>
        <div className="group/more mt-4 flex items-center font-condensed text-lg text-muted-foreground">
          <span className="underline-offset-2 group-hover/more:underline">
            Mehr erfahren
          </span>
          <ArrowRight
            size="20"
            className="stroke-primary transition-transform group-hover/more:translate-x-1"
          />
        </div>
      </div>
    </Link>
  )
}

export function Newsletter() {
  const fetcher = useFetcher()
  const showSpinner = useSpinDelay(fetcher.state !== 'idle')
  const done = !!fetcher.data

  return (
    <fetcher.Form
      name="newsletter"
      method="POST"
      action="/api/newsletter"
      className="xl:p-8 grid max-w-xl rounded-md bg-card p-6 shadow-md"
      key={JSON.stringify(fetcher.data)}
    >
      <HoneypotInputs />
      <p className="mb-4 max-w-[28ch] text-balance text-lg md:text-xl">
        <span className="font-bold">
          Möchtest du auf dem Laufenden bleiben?
        </span>{' '}
        Dann melde dich für unseren Newsletter an!
      </p>
      <div className="mb-4">
        <label className="sr-only">E-Mail</label>
        <Input
          name="email"
          type="email"
          placeholder="E-Mail"
          disabled={done}
          defaultValue={done ? '' : undefined}
          className="rounded-lg bg-white p-6 text-xl shadow-md"
        />
      </div>
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          size="lg"
          className="rounded-lg bg-primary p-6 text-xl shadow-md"
          disabled={fetcher.state === 'submitting'}
        >
          Abschicken
        </Button>
        {showSpinner && (
          <LoaderIcon className="animate-spin stroke-secondary" />
        )}
        {done && <p className="text-green-500">Aktion Erfolgreich</p>}
      </div>
    </fetcher.Form>
  )
}
