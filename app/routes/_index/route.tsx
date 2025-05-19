import { getImageDimensions } from '@sanity/asset-utils'
import {
  ArrowRight,
  AsteriskIcon,
  CalendarClockIcon,
  LinkIcon,
  MessageCircleQuestionIcon,
  QuoteIcon,
} from 'lucide-react'
import React from 'react'
import { Link, useLoaderData } from 'react-router'
import { LogoSymbol } from '#app/components/brand.tsx'
import { SectionHeading } from '#app/components/section-heading.tsx'
import { Button } from '#app/components/ui/button.js'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '#app/components/ui/carousel.tsx'
import { urlFor } from '#app/sanity/instance.ts'
import { loadQuery } from '#app/sanity/loader.server.ts'
import { EventSchema } from '#app/sanity/schema/event.tsx'
import { alphabetMap } from '#app/sanity/schema/year.js'
import { type HomeQueryResult } from '#app/sanity/types.ts'
import { cn } from '#app/utils/misc.js'
import { pillars } from '../ueber-uns+/philosophie+/_layout.tsx'
import { homeQuery } from './query.ts'

export async function loader() {
  const queryResult = await loadQuery<HomeQueryResult>(homeQuery)

  return {
    query: homeQuery,
    data: queryResult.data,
  }
}

export default function Home() {
  const loaderData = useLoaderData<typeof loader>()
  const [latestPost, ...restPosts] = loaderData.data.posts
  const closestEvent = EventSchema.parse(loaderData.data.closestEvent)
  const closestOrientation = EventSchema.parse(
    loaderData.data.closestOrientation,
  )
  const testimonials = loaderData.data.testimonials
  const hero = loaderData.data.hero

  return (
    <div className="col-span-1 col-start-1 grid grid-cols-subgrid items-start gap-y-4 sm:gap-y-8 md:gap-y-12 lg:col-span-4 lg:gap-y-16 xl:col-span-2">
      <div
        id="intro-box"
        className={cn(
          'col-span-4 grid grid-cols-1 grid-rows-1 place-self-center',
          'xl:col-span-2',
          '-mx-4 sm:mx-0',
          'relative sm:rounded-md sm:shadow-md',
        )}
      >
        <h1 className="sr-only">Einleitung</h1>
        <figure className="relative col-start-1 col-end-1 row-start-1">
          {hero?.image && (
            <HeroImage image={hero.image} caption={hero.caption} />
          )}
          {hero?.image?.attribution && (
            <figcaption className="absolute bottom-0 left-0 right-0 z-20 bg-foreground/20 px-4 py-1 sm:px-8 md:px-12">
              <p className="text-right text-body-xs text-card/70">
                {hero.image.attribution}
              </p>
            </figcaption>
          )}
        </figure>

        <div className="relative col-start-1 row-start-1 flex flex-col items-start justify-between bg-black/10 p-8 sm:rounded-t-md sm:p-16 md:p-20 lg:py-24">
          <LogoSymbol className="absolute bottom-12 right-12 w-60 text-primary opacity-50 sm:-bottom-24 sm:right-8 sm:w-64 md:w-72 md:opacity-60 lg:right-10 lg:w-80" />
          <p className="relative max-w-xl text-pretty font-sans text-3xl font-bold tracking-tight text-white drop-shadow sm:text-4xl md:text-5xl lg:text-6xl">
            Die <strong className="font-bold text-secondary">Walz</strong> soll
            darauf vor­bereiten, mit Liebe die Welt und die Gesell­schaft
            mitzuge­stalten.
          </p>
          {hero?.caption && <p className="relative">{hero.caption}</p>}
        </div>

        {closestEvent && (
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
                <Link
                  key={closestEvent._id}
                  to={`/aktuelles#${closestEvent._id}`}
                  className="font-condensed font-bold"
                >
                  <span className="">{closestEvent.title}</span> am{' '}
                  <time
                    dateTime={closestEvent.start.date.toISOString()}
                    className=""
                  >
                    {closestEvent.start.date.toLocaleDateString('de-AT', {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </time>
                </Link>
              </div>{' '}
              <Link
                to="./aktuelles#schuljahr"
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
        )}
      </div>
      <div className="grid grid-cols-subgrid gap-8 lg:col-span-2">
        <section className="col-span-1 space-y-4">
          <div>
            <h1 className="sr-only">Was ist die Walz?</h1>
            <p className="max-w-2xl text-pretty text-body-md xl:text-body-lg">
              In der Walz können Jugendliche zwischen 14 und 19 Jahren in einem
              geschützten Rahmen ihre Potenziale entfalten, ihre Möglichkeiten
              ausloten und werden auf die Matura vorbereitet.
            </p>
          </div>
          <div>
            <p className="text-balance">
              <Link
                to={'/aktuelles/beitraege/walz-unterschiede'}
                className="group text-body-md text-muted-foreground"
              >
                <MessageCircleQuestionIcon
                  size={28}
                  absoluteStrokeWidth
                  className="relative -top-1 inline-flex stroke-primary"
                />{' '}
                <span className="underline-offset-2 group-hover:underline">
                  Was unterscheidet die Walz von einer
                  <br className="hidden lg:inline" /> klassischen Oberstufe?
                </span>
              </Link>
            </p>
          </div>
        </section>

        {closestOrientation && (
          <section className="">
            <h1 className="sr-only">Walz kennenlernen</h1>
            <div className="rounded-lg border border-secondary/30 bg-secondary/20 p-6 ring-8 ring-muted/20">
              <p className="mb-4 text-pretty text-body-md">
                Lerne die Walz kennen{' '}
                <span className="relative mb-1" aria-roledescription="emoji">
                  👋
                </span>
                <br /> Komm vorbei! Nächster Termin:{' '}
                <strong className="font-bold">
                  {closestOrientation.title}
                  <br />
                  <time
                    dateTime={closestOrientation.start.date.toISOString()}
                    className="font-bold"
                  >
                    {closestOrientation.start.date.toLocaleDateString('de-AT', {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </time>
                </strong>
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="mr-auto shadow"
              >
                <Link to="/die-walz-kennenlernen">Mehr erfahren</Link>
              </Button>
            </div>
          </section>
        )}
      </div>
      <section className="grid gap-4 lg:col-span-2">
        <h1 className="text-body-xs font-bold uppercase tracking-widest text-muted-foreground">
          Beiträge
        </h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-8">
          <article className="relative col-span-4 grid rounded-lg bg-white shadow-md shadow-gray-200 lg:grid-cols-2">
            {latestPost.cover && (
              <Link
                to={`/aktuelles/beitraege/${latestPost.slug?.current}`}
                className="group"
              >
                <figure className="relative opacity-80 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0 lg:row-span-2">
                  <img
                    src={urlFor(latestPost.cover).quality(70).width(800).url()}
                    alt={latestPost.cover.caption}
                    className="w-full rounded-t-md object-cover sm:h-auto lg:h-full lg:rounded-bl-md lg:rounded-tr-none"
                  />
                  {latestPost.cover.attribution && (
                    <figcaption className="absolute bottom-0 left-0 right-0 z-20 bg-foreground/20 px-4 py-1 sm:px-8 md:px-12">
                      <p className="text-right text-body-xs text-card/70">
                        {latestPost.cover.attribution}
                      </p>
                    </figcaption>
                  )}
                </figure>
              </Link>
            )}
            <div className="p-6">
              <h1 className="mb-2 max-w-xs text-balance font-condensed text-xl font-bold !leading-tight text-secondary md:text-2xl lg:text-2xl xl:text-3xl">
                <Link to={`/aktuelles/beitraege/${latestPost.slug?.current}`}>
                  {latestPost.title}
                </Link>
              </h1>
              <p className="text-body-xs text-muted-foreground">
                Veröffentlicht am{' '}
                <time>
                  {new Date(latestPost.publishedAt || 0).toLocaleString(
                    'de-AT',
                    {
                      dateStyle: 'medium',
                    },
                  )}
                </time>
              </p>
              <p className="mt-4 max-w-md text-balance text-body-sm leading-snug lg:text-body-md">
                {latestPost.previewText} <span>…</span>
              </p>
            </div>
            <footer className="self-end bg-primary/5 px-6 py-2 lg:col-start-2">
              <Link
                to={`/aktuelles/beitraege/${latestPost.slug?.current}`}
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
          <div className="col-span-2 grid auto-rows-min grid-cols-1 gap-4 sm:gap-8">
            {restPosts.map((post, idx) => {
              return (
                <React.Fragment key={idx}>
                  <article key={idx} className="relative max-w-prose">
                    <h1 className="max-w-xs text-balance font-condensed font-bold !leading-tight md:text-lg">
                      <Link to={`/aktuelles/beitraege/${post.slug?.current}`}>
                        {post.title}
                      </Link>
                    </h1>
                    <p className="mt-2 max-w-md text-balance text-body-sm leading-snug text-muted-foreground">
                      {post.previewText?.replace(/^(.{90}[^\s]*).*/, '$1')}{' '}
                      <span>…</span>
                    </p>
                    <footer className="mt-2">
                      <Link
                        to={`/aktuelles/beitraege/${post.slug?.current}`}
                        className="font-condensed text-primary"
                      >
                        <span className="underline-offset-2 group-hover/more:underline">
                          Weiterlesen
                        </span>
                      </Link>
                    </footer>
                  </article>
                  {idx < restPosts.length - 1 && <hr className="" />}
                </React.Fragment>
              )
            })}
          </div>
        </div>
      </section>
      <section className="grid gap-8 lg:col-span-2">
        <header className="py-4 md:py-8 lg:py-12">
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
      <section className="grid gap-8 lg:col-span-2">
        <header className="py-4 md:py-8">
          <SectionHeading id="testimonials">
            Stimmen aus der Walz
          </SectionHeading>
        </header>
        <Carousel
          className="space-y-8 rounded-md bg-muted/30 py-8"
          opts={{ loop: true }}
        >
          <CarouselContent className="-ml-8 px-8 py-2 lg:-ml-20">
            {testimonials.map((testimonial, idx) => {
              return (
                <CarouselItem
                  key={idx}
                  className="flex items-start justify-center pl-8 md:items-center lg:pl-20"
                >
                  <TestimonialCard idx={idx} {...testimonial} />
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <div className="flex justify-center gap-4 px-8">
            <CarouselPrevious className="self-end" />
            <CarouselNext className="self-start" />
          </div>
        </Carousel>
      </section>
      <section className="grid gap-8 lg:col-span-2">
        <header className="py-4 md:py-8">
          <SectionHeading id="faq">Häufige Fragen</SectionHeading>
        </header>
        <div className="flex flex-row flex-wrap gap-3 md:flex-row">
          <Link
            to="/haeufige-fragen#was-heisst-eigentlich-walz"
            className="group flex overflow-hidden rounded bg-card text-body-md !leading-snug text-primary shadow"
          >
            <span className="min-w-10 flex-none bg-card px-2 py-2 text-secondary group-hover:bg-secondary group-hover:text-card">
              <AsteriskIcon className="relative top-[1px] md:top-[4px]" />
            </span>
            <span className="bg-primary/5 px-3 py-2 transition-colors ease-in-out group-hover:bg-primary/10">
              Was heißt eigentlich Walz?
            </span>
          </Link>
          <Link
            to="/haeufige-fragen/#wie-kann-ich-die-walz-kennenlernen"
            className="group flex overflow-hidden rounded bg-card text-body-md !leading-snug text-primary shadow"
          >
            <span className="min-w-10 flex-none bg-card px-2 py-2 text-secondary group-hover:bg-secondary group-hover:text-card">
              <AsteriskIcon className="relative top-[1px] md:top-[4px]" />
            </span>
            <span className="bg-primary/5 px-3 py-2 transition-colors ease-in-out group-hover:bg-primary/10">
              Wie kann ich die Walz kennenlernen?
            </span>
          </Link>
          <Link
            to="/haeufige-fragen/#wieso-gibt-es-externistenpruefungen"
            className="group flex overflow-hidden rounded bg-card text-body-md !leading-snug text-primary shadow"
          >
            <span className="min-w-10 flex-none bg-card px-2 py-2 text-secondary transition-colors group-hover:bg-secondary group-hover:text-card">
              <AsteriskIcon className="relative top-[1px] md:top-[4px]" />
            </span>
            <span className="bg-primary/5 px-3 py-2 transition-colors ease-in-out group-hover:bg-primary/10">
              Wieso gibt es Externistenprüfungen?
            </span>
          </Link>
          <Link
            to="/haeufige-fragen/#warum-ist-die-walz-smartphone-freie-zone"
            className="group flex overflow-hidden rounded bg-card text-body-md !leading-snug text-primary shadow"
          >
            <span className="min-w-10 flex-none bg-card px-2 py-2 text-secondary group-hover:bg-secondary group-hover:text-card">
              <AsteriskIcon className="relative top-[1px] md:top-[4px]" />
            </span>
            <span className="bg-primary/5 px-3 py-2 transition-colors ease-in-out group-hover:bg-primary/10">
              Warum ist die Walz Smartphone-freie Zone?
            </span>
          </Link>
          <Link
            to="/haeufige-fragen/#was-kostet-die-walz"
            className="group flex overflow-hidden rounded bg-card text-body-md !leading-snug text-primary shadow"
          >
            <span className="min-w-10 flex-none bg-card px-2 py-2 text-secondary group-hover:bg-secondary group-hover:text-card">
              <AsteriskIcon className="relative top-[1px] md:top-[4px]" />
            </span>
            <span className="bg-primary/5 px-3 py-2 transition-colors ease-in-out group-hover:bg-primary/10">
              Was kostet die Walz?
            </span>
          </Link>
        </div>
      </section>
      <section className="grid gap-8 lg:col-span-2">
        <header className="py-4 md:py-8">
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
            <h2 className="mb-4 text-body-xs font-bold uppercase tracking-widest text-muted-foreground">
              Kontakt
            </h2>
            <div className="lg:text-body-md">
              <p>
                <strong className="text-primary">
                  Walz Wiener Lernzentrum
                </strong>
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

type TestimonialCardProps = HomeQueryResult['testimonials'][0] & { idx: number }

function TestimonialCard({ idx, ...entry }: TestimonialCardProps) {
  return (
    <blockquote
      key={idx}
      className="relative grid min-h-72 max-w-3xl grid-cols-1 items-start overflow-hidden rounded-lg bg-card shadow-md md:grid-cols-12"
    >
      <div className="relative h-full bg-card p-6 md:col-span-7 md:col-start-1 md:p-8">
        <p className="text-balance text-muted-foreground md:min-h-32 md:text-body-md">
          {entry.quote}
          <QuoteIcon
            role="presentation"
            className="float-right h-12 w-12 fill-secondary stroke-none md:h-16 md:w-16"
          />
        </p>
      </div>
      <footer className="flex h-full flex-col justify-between gap-4 bg-secondary/10 p-6 md:col-span-5 md:col-start-8 md:p-8">
        <figure
          className="relative flex w-24 items-center justify-center rounded-full lg:w-36"
          aria-hidden="true"
        >
          <img
            src={urlFor(entry.photo?.asset ?? {})
              .quality(70)
              .format('webp')
              .width(200)
              .height(200)
              .url()}
            alt={entry.photo?.alt || ''}
            className="rounded-full shadow-md"
          />
          <div
            role="presentation"
            className="absolute inset-0 rounded-full ring-2 ring-inset ring-foreground/10"
          />
        </figure>
        <div className="">
          <p className="font-bold text-primary md:text-body-md">
            {entry.name}
            {'  '}
            <span className="align-super font-greek font-bold text-secondary">
              {alphabetMap[entry.year?.letter ?? '']}
            </span>{' '}
          </p>
          <p className="mb-2 leading-none">
            <span className="text-body-2xs uppercase tracking-widest text-muted-foreground">
              Maturajahr{' '}
              <span>
                {entry.year?.graduatedAt &&
                  new Date(entry.year.graduatedAt).getFullYear()}
              </span>
            </span>
          </p>
          <p>{entry.achievement}</p>
        </div>
      </footer>
    </blockquote>
  )
}

function HeroImage({ image, caption }: { image: any; caption: string | null }) {
  const { width, height } = getImageDimensions(image)
  return (
    <picture>
      <source
        srcSet={urlFor(image).quality(70).width(800).url()}
        media="(max-width: 800px)"
      />
      <img
        src={urlFor(image).quality(70).width(1800).url()}
        width={width}
        height={height}
        alt={caption || ''}
        className="aspect-square w-full object-cover sm:aspect-auto sm:h-auto sm:rounded-t-md md:aspect-[21_/_12]"
      />
    </picture>
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
      <div className="relative">
        <div className="relative translate-y-4 overflow-hidden rounded-lg shadow-xl shadow-muted/50 transition-all group-hover:translate-y-2">
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
          <h1 className="mb-1 font-condensed text-h4 font-bold text-secondary md:text-h3">
            {title}
          </h1>
          <p className="text-lg font-bold leading-none">{abstract}</p>
        </hgroup>
        <div className="group/more mt-4 flex items-center gap-1 font-condensed text-lg text-muted-foreground">
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
