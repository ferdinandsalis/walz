import { ArrowRight, Calendar } from '@carbon/icons-react'
import { Link } from '@remix-run/react'
import { take } from 'ramda'
import { LogoSymbol } from '~/components/brand.tsx'
import { Button } from '~/components/ui/button.tsx'
import { Input } from '~/components/ui/input.tsx'
import { questions } from '~/data/faq.ts'
import { news } from '~/data/news.ts'
import { testimonials } from '~/data/testimonials.ts'

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
            Die <strong className="font-bold text-primary">Walz</strong> soll
            darauf vor­bereiten, mit Liebe die Welt und die Gesell­schaft
            mitzuge­stalten.
          </p>
        </div>

        <article className="col-start-1 row-start-2 flex items-center gap-2 bg-stone-200/60 p-3 px-4 shadow-inner sm:px-8 md:px-12">
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
                      <time className="font-condensed">{entry.time}</time>
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
          <Link
            to="./ueber-uns/philosophie/bildung"
            className="group rounded-lg bg-white p-6 shadow-md focus:outline-primary"
          >
            <div className="relative mb-6 border-8 border-secondary">
              <img
                src="/images/bildung_anders.jpg"
                className="ascpet-square h-48 w-full bg-stone-100 object-cover grayscale backdrop-sepia transition-all group-hover:grayscale-0"
              />
            </div>
            <h1 className="font-condensed text-2xl font-bold text-primary md:text-3xl lg:text-4xl xl:text-5xl">
              Bildung
            </h1>
            <h2 className="font-condensed text-2xl font-bold text-stone-700">
              Zusammenhänge erkennen
            </h2>
            <span className="group/more mt-4 inline-flex items-center gap-1 font-condensed text-lg text-secondary md:text-xl lg:text-2xl">
              <span className="underline-offset-4 group-hover/more:underline">
                Mehr erfahren
              </span>
              <ArrowRight size={24} className="fill-secondary" />
            </span>
          </Link>

          <Link
            to="./ueber-uns/philosophie/praxis"
            className="group rounded-lg bg-white p-6 shadow-md focus:outline-primary"
          >
            <div className="relative mb-6 border-8 border-secondary">
              <img
                src="/images/praxis_uhrenwerkstatt.jpg"
                className="ascpet-square h-48 w-full bg-stone-100 object-cover grayscale backdrop-sepia transition-all group-hover:grayscale-0"
              />
            </div>
            <h1 className="font-condensed text-2xl font-bold text-primary md:text-3xl lg:text-4xl xl:text-5xl">
              Praxis
            </h1>
            <h2 className="font-condensed text-2xl font-bold text-stone-700">
              Erfahrungen sammeln
            </h2>
            <span className="group/more mt-4 inline-flex items-center gap-1 font-condensed text-lg text-secondary md:text-xl lg:text-2xl">
              <span className="underline-offset-4 group-hover/more:underline">
                Mehr erfahren
              </span>
              <ArrowRight size={24} className="fill-secondary" />
            </span>
          </Link>

          <Link
            to="./ueber-uns/philosophie/persoenlichkeit"
            className="group rounded-lg bg-white p-6 shadow-md focus:outline-primary"
          >
            <div className="relative mb-6 border-8 border-secondary">
              <img
                src="/images/persoenlichkeit_theater.jpg"
                className="ascpet-square h-48 w-full bg-stone-100 object-cover grayscale backdrop-sepia transition-all group-hover:grayscale-0"
              />
            </div>
            <h1 className="font-condensed text-2xl font-bold text-primary md:text-3xl lg:text-4xl xl:text-5xl">
              Persönlichkeit
            </h1>
            <h2 className="font-condensed text-2xl font-bold text-stone-700">
              Potenziale entfalten
            </h2>
            <span className="group/more mt-4 inline-flex items-center gap-1 font-condensed text-lg text-secondary md:text-xl lg:text-2xl">
              <span className="underline-offset-4 group-hover/more:underline">
                Mehr erfahren
              </span>
              <ArrowRight size={24} className="fill-secondary" />
            </span>
          </Link>
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
                <p className="rounded-xl bg-primary/10 px-4 py-2 text-lg font-bold leading-tight text-primary md:text-2xl lg:px-6">
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
        {testimonials.map((entry, idx) => {
          return (
            <blockquote
              key={idx}
              className="relative mb-8 max-w-prose after:absolute after:-bottom-0  after:translate-y-48 after:text-[10em] after:text-secondary after:content-['”'] "
            >
              <p className="relative text-lg font-light italic text-stone-700 md:text-xl lg:text-2xl">
                {entry.text}
              </p>
              <footer className="mt-4">
                <p className="font-condensed text-lg font-bold text-stone-700 md:text-xl lg:text-2xl">
                  —&thinsp;{entry.name}
                </p>
              </footer>
            </blockquote>
          )
        })}
      </section>

      <section>
        <header className="mb-16 lg:mb-20">
          <SectionHeading id="kontakt">Anfahrt & Kontakt</SectionHeading>
        </header>
        <div className="grid gap-8 md:grid-cols-6">
          <div className="h-64 overflow-hidden rounded border border-stone-300 bg-stone-200 shadow-inner shadow-stone-300 ring-1 ring-stone-50 md:col-span-4 md:col-start-1"></div>
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

      <section className="">
        <form
          name="newsletter"
          method="POST"
          className="grid max-w-xl grid-cols-1 gap-4 rounded-md bg-card p-8 shadow-md"
        >
          <p className="text-2xl">
            Möchtest du auf dem laufenden bleiben? Dann melde dich für unseren
            Newsletter an!
          </p>
          <input type="hidden" name="form-name" value="newsletter" />
          <input type="hidden" name="bot-field" />
          <label className="sr-only">E-Mail</label>
          <Input
            name="email"
            type="email"
            placeholder="E-Mail"
            className="rounded-lg bg-white p-6 shadow-md"
          />
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
      </section>
    </div>
  )
}

function SectionHeading({ children, id }: { children: any; id: string }) {
  return (
    <Link
      to={`.#${id}`}
      className="grid grid-cols-12 items-center outline-none"
      tabIndex={-1}
    >
      <h1
        id={id}
        className="col-span-1 col-start-1 col-end-13 row-start-1 row-end-1 text-center font-condensed text-base font-bold uppercase tracking-[0.2em] text-stone-400"
      >
        <span className="rounded bg-stone-100 px-8 py-2">{children}</span>
      </h1>
      <hr className="-order-1 col-start-1 col-end-13 row-start-1 h-[4px] rounded border-none bg-stone-200/70" />
    </Link>
  )
}
