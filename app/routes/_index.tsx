import { Link } from '@remix-run/react'
import { take } from 'ramda'
import { LogoSymbol } from '#app/components/brand.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { questions } from '#app/data/faq.ts'
import { news } from '#app/data/news.ts'
import { testimonials } from '#app/data/testimonials.ts'
import { SectionHeading } from '#app/components/section-heading.tsx'
import { pillars } from './ueber-uns_.philosophie.tsx'
import { ArrowRight, Calendar } from 'lucide-react'

export default function Home() {
  return (
    <div className="space-y-16 md:space-y-20 lg:space-y-24">
      <div className="relative -mx-4 grid grid-cols-1 grid-rows-1 sm:-mx-8 md:-mx-12">
        <h1 className="sr-only">Einleitung</h1>
        <div className="col-end col-start-1 row-start-1">
          <img
            src="/images/walz-draussen.jpg"
            alt="Walz draussen"
            className="aspect-square object-cover sm:aspect-video md:aspect-[21_/_12]"
          />
        </div>

        <div className="relative col-start-1 row-start-1 flex flex-col items-start justify-between bg-black/30 p-8 sm:p-16 md:p-20 lg:py-24">
          <LogoSymbol className="absolute bottom-12 right-12 w-72 text-primary opacity-50 sm:-bottom-32 sm:-right-10 sm:w-72 md:w-80 md:opacity-70 lg:right-10 lg:w-96" />
          <p className="relative max-w-xl font-sans text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-5xl lg:text-6xl">
            Die <strong className="font-bold text-secondary">Walz</strong> soll
            darauf vor­bereiten, mit Liebe die Welt und die Gesell­schaft
            mitzuge­stalten.
          </p>
        </div>

        <article className="col-start-1 row-start-2 flex items-center gap-2 rounded-b-md bg-stone-200/60 p-3 px-4 shadow-inner sm:px-8 md:px-12">
          <div className="flex flex-col gap-2 md:flex-row">
            <h1 className="flex items-center gap-1">
              <span className="md:sr-only">Nächster Termin</span>
              <Calendar size={24} className="inline-block text-primary" />
            </h1>
            <p className="font-bold">
              <span className="">Schulstart</span> am{' '}
              <time dateTime="2023-09-04" className="">
                4. September 2023
              </time>
            </p>
            <Link
              to="./aktuelles"
              className="inline-flex items-center gap-1 font-condensed text-secondary"
            >
              Alle Termine
              <ArrowRight size="16" />
            </Link>
          </div>
        </article>
      </div>

      <div className="grid gap-16 lg:grid-cols-6 lg:grid-rows-1">
        <section className="lg:col-span-3 lg:row-start-1">
          <h1 className="mb-2 font-condensed text-lg font-bold text-primary lg:mb-4">
            Was ist die Walz?
          </h1>
          <p className="max-w-xl text-lg leading-relaxed md:text-xl lg:text-3xl xl:text-3xl">
            In der Walz werden Jugendliche zwischen 14 und 19 Jahren auf die
            Matura vorbereitet und können in einem geschützten Rahmen ihre
            Möglichkeiten ausloten und ihre Potenziale entfalten.
          </p>
          <Link
            to="./ueber-uns"
            className="mt-4 inline-flex items-center gap-1 font-condensed text-lg text-secondary md:text-xl lg:text-2xl"
          >
            Mehr erfahren
            <ArrowRight size="24" />
          </Link>
        </section>

        <section className="lg:col-span-3 lg:col-start-4 lg:row-start-1">
          <h1 className="mb-2 font-condensed text-lg font-bold text-primary lg:mb-4">
            Aktuelles
          </h1>
          <ol className="space-y-2">
            {take(1, news).map((entry, idx) => {
              return (
                <li
                  key={idx}
                  className="max-w-prose rounded-lg bg-secondary p-6 shadow-md shadow-slate-400"
                >
                  <article className="relative text-foreground">
                    <div className="absolute right-0 rounded-full bg-primary p-4 text-white">
                      <time className="font-condensed">
                        {entry.publishedAt.toLocaleString('de-AT', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </time>
                    </div>
                    <h1 className="mb-4 max-w-xs font-condensed text-2xl leading-tight text-white md:text-3xl lg:text-3xl xl:text-4xl">
                      {entry.title}
                    </h1>
                    <p className="max-w-sm text-lg leading-snug md:text-xl lg:text-2xl">
                      {entry.abstract}
                    </p>
                    <footer>
                      <Link
                        to="./ueber-uns"
                        className="mt-4 inline-flex items-center gap-1 font-condensed text-lg text-background underline underline-offset-2"
                      >
                        Artikel lesen
                      </Link>
                    </footer>
                  </article>
                </li>
              )
            })}
          </ol>
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
        <div>
          {questions.map((entry, idx) => {
            return (
              <div key={idx} className="mb-1 flex">
                <p className="rounded-lg bg-primary/10 px-4 py-2 text-lg font-bold leading-tight text-primary md:text-2xl">
                  {entry.question}
                </p>
              </div>
            )
          })}
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
                <p className="text-md relative rounded-r-lg border-l-4 border-l-secondary bg-card p-4 !leading-snug text-card-foreground lg:p-6 lg:text-lg xl:text-xl">
                  {entry.text}
                </p>
                <footer className="ml-4 mt-2 lg:ml-6">
                  <p className="text-md font-condensed font-bold text-primary lg:text-lg xl:text-lg">
                    —&thinsp;{entry.name}
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
            className="relative h-72 overflow-hidden rounded border border-stone-300 bg-stone-200 md:col-span-4 md:col-start-1 lg:h-80"
          >
            <img
              src="https://maps.googleapis.com/maps/api/staticmap?center=48.1984402,16.2922301&zoom=16&size=800x500&key=AIzaSyCQlA0vV3_JzkHchLJvxuqkNcWaPeRcqNA&scale=2&map_id=8811b5d90ece1ea5"
              alt="Karte"
              className="h-full w-full object-cover"
            />
            <div className="absolute left-0 top-0 h-full w-full overflow-hidden border shadow-inner shadow-stone-300/80"></div>
          </Link>
          <div className="md:col-span-2 md:col-start-5">
            <h2 className="mb-2 font-condensed text-lg font-bold text-primary lg:mb-4">
              Adresse
            </h2>
            <p>
              <strong>Walz Wiener Lernzentrum</strong>
            </p>
            <p>Heinrich-Collin-Straße 9</p>
            <p>1140 Wien</p>
            <p>Tel.: 01 8042939</p>
            <p>Fax: 01 8042939-2000</p>
            <p>Email: office@walz.at</p>
          </div>
        </div>
        <Link
          to="/rundgang"
          className="mt-2 inline-flex text-secondary underline underline-offset-2"
        >
          <p>Lerne die Walz auf einen virtuellen Rundgang kennen.</p>
        </Link>
      </section>

      <section className="flex items-center justify-center">
        <Newsletter />
      </section>
    </div>
  )
}

export function LinkPhotoCard({
  title,
  abstract,
  image,
  link,
}: {
  title: string
  abstract: string
  image: string
  link: string
}) {
  return (
    <Link
      to={link}
      className="group flex flex-col rounded-lg focus:outline-primary"
    >
      <div className="relative border-8 border-transparent border-b-primary px-2">
        <div className="relative translate-y-4 group-hover:translate-y-2 shadow-xl shadow-stone-800/50 group-hover:rotate-1 transition-all rounded-lg overflow-hidden">
        <img
          src={image}
          className="ascpet-square h-48 w-full bg-stone-100 object-cover grayscale group-hover:grayscale-0"
        />
        <div 
          role="presentation"
          className="absolute inset-0 rounded-lg ring-1 ring-foreground/20 ring-inset"
          // className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent"
          />
          </div>
      </div>

      <div className="p-6 shadow-md rounded-b-lg bg-card pt-6 relative border-t-4 border-t-primary">
      <hgroup className="flex-1">
        <h1 className="mb-1 font-condensed text-xl font-bold text-secondary md:text-3xl lg:text-4xl">
          {title}
        </h1>
        <p className="text-lg leading-none font-bold">
          {abstract}
        </p>
      </hgroup>
      <div className="group/more mt-4 flex items-center gap-1 text-muted-foreground font-condensed text-lg">
        <span className="underline-offset-4 group-hover/more:underline">
          Mehr erfahren
        </span>
        <ArrowRight size="24" className="stroke-primary group-hover/more:translate-x-1 transition-transform" />
      </div>
      </div>
    </Link>
  )
}

export function Newsletter() {
  return (
    <form
      name="newsletter"
      method="POST"
      className="grid max-w-xl rounded-md bg-card p-6 shadow-md xl:p-8"
    >
      <h1 className="mb-2 font-condensed text-lg font-bold text-primary lg:mb-4">
        Newsletter
      </h1>

      <p className="mb-8 max-w-[28ch] text-2xl">
        <span className="font-bold">
          Möchtest du auf dem laufenden bleiben?
        </span>{' '}
        Dann melde dich für unseren Newsletter an!
      </p>
      <input type="hidden" name="form-name" value="newsletter" />
      <input type="hidden" name="bot-field" />
      <div className="mb-4">
        <label className="sr-only">E-Mail</label>
        <Input
          name="email"
          type="email"
          placeholder="E-Mail"
          className="rounded-lg bg-white p-6 text-xl shadow-md"
        />
      </div>
      <div>
        <Button
          type="submit"
          size="lg"
          className="rounded-lg bg-primary p-6 text-xl shadow-md"
        >
          Anmelden
        </Button>
      </div>
    </form>
  )
}
