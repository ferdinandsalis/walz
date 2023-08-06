import { Link } from '@remix-run/react'
import { LogoSymbol } from '~/components/brand'
import { ArrowRight } from '@carbon/icons-react'

const news = [
  {
    title: 'Wir stellen einen neuen Jahrgang vor.',
    time: '2023-08-06',
    author: 'Jahrgang Psi',
    tags: ['Jahrgang', 'Psi'],
    body: '',
    abstract:
      'Unser neuester Jahrgang stellt sich vor. Schau rein und lerne sie kennen.',
  },
]

const testimonials = [
  {
    name: 'Seraphin Ohrenstein',
    text: 'Das Theaterspielen in der Walz ist etwas ganz Besonderes, da man als Ensemble sehr schnell, eng zusammenwächst was unsere Klassengemeinschaft im 4. Walzjahr ausmacht. Man sammelt unheimlich viel Erfahrung wie man sich gescheit ausdrückt, egal ob mit Wörtern oder mit Körpersprache was mir persönlich sehr geholfen hat.',
  },
]

const faq = [
  {
    question: 'Wieviel kostet die Walz?',
    answer: 'Eh nicht so viel.',
  },
]

export default function Home() {
  return (
    <div className="space-y-16 md:space-y-20 lg:space-y-24">
      <div className="relative -mx-8 mb-16 grid grid-cols-1 grid-rows-1 md:-mx-12">
        <h1 className="sr-only">Einleitung</h1>
        <LogoSymbol className="md:w-84 absolute -bottom-24 right-10 w-80 text-white opacity-60 lg:w-96" />
        <div className="col-start-1 col-end row-start-1">
          <img
            src="/photos/walz-draussen.jpg"
            alt="Walz draussen"
            className="aspect-square object-cover sm:aspect-video md:aspect-[21_/_12]"
          />
        </div>
        <div className="relative z-10 col-start-1 row-start-1 bg-black/40 p-12 sm:p-16 md:p-20 lg:py-24">
          <p className="max-w-xl font-sans text-4xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Die <strong className="font-bold text-primary">Walz</strong> soll
            darauf vorbereiten, mit Mut und Liebe die Welt und Gesellschaft
            mitzugestalten.
          </p>
        </div>
      </div>

      <div className="grid gap-16 lg:grid-cols-6 lg:grid-rows-1">
        <section className="lg:col-span-3 lg:col-start-4 lg:row-start-1">
          <h1 className="mb-2 font-condensed text-lg font-bold text-primary lg:mb-4">
            Aktuelles
          </h1>
          <ol className="space-y-2">
            {news.map((entry, idx) => {
              return (
                <li
                  key={idx}
                  className="max-w-prose rounded-lg bg-secondary p-6 shadow shadow-slate-400"
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
                      <p className="mt-6 font-condensed text-white">
                        Verfasst von{' '}
                        <span className="underline underline-offset-2">
                          {entry.author}
                        </span>{' '}
                      </p>
                    </footer>
                  </article>
                </li>
              )
            })}
          </ol>
        </section>

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
      </div>

      <section>
        <header className="mb-16">
          <SectionHeading id="philosophie">Philosophie</SectionHeading>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Link
            to="./philosophie/bildung"
            className="group rounded-lg bg-white p-6 shadow-md"
          >
            <div className="relative mb-6">
              <img
                src=""
                className="ascpet-square h-48 w-full border-4 border-secondary bg-gray-100 object-cover"
              />
            </div>
            <h1 className="font-condensed text-2xl font-bold text-primary md:text-3xl lg:text-4xl xl:text-5xl">
              Bildung
            </h1>
            <h2 className="font-condensed text-2xl font-bold text-gray-700">
              Verstehen, begreifen, erklären
            </h2>
            <span className="group/more mt-4 inline-flex items-center gap-1 font-condensed text-lg text-secondary md:text-xl lg:text-2xl">
              <span className="underline-offset-2 group-hover/more:underline">
                Mehr erfahren
              </span>
              <ArrowRight size={24} className="fill-secondary" />
            </span>
          </Link>

          <Link
            to="./philosophie/praxis"
            className="group rounded-lg bg-white p-6 shadow-md"
          >
            <div className="relative mb-6">
              <img
                src=""
                className="ascpet-square h-48 w-full border-4 border-secondary bg-gray-100 object-cover"
              />
            </div>
            <h1 className="font-condensed text-2xl font-bold text-primary md:text-3xl lg:text-4xl xl:text-5xl">
              Praxis
            </h1>
            <h2 className="font-condensed text-2xl font-bold text-gray-700">
              Dinge probieren
            </h2>
            <span className="group/more mt-4 inline-flex items-center gap-1 font-condensed text-lg text-secondary md:text-xl lg:text-2xl">
              <span className="underline-offset-2 group-hover/more:underline">
                Mehr erfahren
              </span>
              <ArrowRight size={24} className="fill-secondary" />
            </span>
          </Link>

          <Link
            to="./philosophie/persoenlichkeit"
            className="group rounded-lg bg-white p-6 shadow-md"
          >
            <div className="relative mb-6">
              <img
                src=""
                className="ascpet-square h-48 w-full border-4 border-secondary bg-gray-100 object-cover"
              />
            </div>
            <h1 className="font-condensed text-2xl font-bold text-primary md:text-3xl lg:text-4xl xl:text-5xl">
              Persönlichkeit
            </h1>
            <h2 className="font-condensed text-2xl font-bold text-gray-700">
              Potenziale entfalten
            </h2>
            <span className="group/more mt-4 inline-flex items-center gap-1 font-condensed text-lg text-secondary md:text-xl lg:text-2xl">
              <span className="underline-offset-2 group-hover/more:underline">
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
        <nav className="flex items-center gap-3">
          <div className="rounded-lg bg-orange-50 px-2 text-primary">
            <a href="./">Schüler</a>
          </div>
          <div className="rounded-lg bg-orange-50 px-2 text-primary">
            <a href="./">Eltern</a>
          </div>
          <div className="rounded-lg bg-orange-50 px-2 text-primary">
            <a href="./">Ehemalige</a>
          </div>
        </nav>
        <div>
          <dl>
            <div>
              <dt className="font-bold">Wieviel kostet das?</dt>
              <dd>Eh nicht so viel.</dd>
            </div>
          </dl>
        </div>
      </section>

      <section>
        <header className="mb-16 lg:mb-20">
          <SectionHeading id="testimonials">Testimonials</SectionHeading>
        </header>
        {testimonials.map((entry, idx) => {
          return (
            <blockquote
              key={idx}
              className="relative mb-8 max-w-prose after:absolute after:-bottom-0  after:translate-y-48 after:text-[10em] after:text-secondary after:content-['”'] "
            >
              <p className="relative text-lg font-light italic text-gray-700 md:text-xl lg:text-2xl">
                {entry.text}
              </p>
              <footer className="mt-4">
                <p className="font-condensed text-lg font-bold text-gray-700 md:text-xl lg:text-2xl">
                  —&thinsp;{entry.name}
                </p>
              </footer>
            </blockquote>
          )
        })}
      </section>

      <section>
        <header className="mb-16 lg:mb-20">
          <SectionHeading id="kontakt">Kontakt</SectionHeading>
        </header>
        <div className="grid grid-cols-6 gap-8">
          <figure className="col-span-2 mb-4">
            <img
              src=""
              className="ascpet-square h-48 w-48 rounded-full bg-white object-cover shadow-lg grayscale"
            />
            <figcaption>
              <h1 className="font-condensed text-2xl font-bold text-secondary lg:text-4xl">
                Agnes Chorherr
              </h1>
              <h2 className="text-lg font-bold">Schulleiterin</h2>
            </figcaption>
          </figure>
          <div className="col-span-2">
            <h2 className="mb-2 font-condensed text-lg font-bold text-primary lg:mb-4">
              Adresse
            </h2>
            <p>
              <strong>Walz Wiener Lernzentrum</strong>
            </p>
            <p>Heinrich-Collin-Straße 9</p>
            <p>1140 Wien</p>
            <p>Tel.: 01-804 29 39 (Mo-Fr, 08:00-15:30 Uhr)</p>
            <p>Fax: 01-804 29 39-2000</p>
            <p>E-Mail: office@walz.at</p>
          </div>
        </div>
      </section>
    </div>
  )
}

function SectionHeading({ children, id }: { children: any; id: string }) {
  return (
    <Link to={`.#${id}`} className="grid grid-cols-12 items-center">
      <h1
        id={id}
        className="col-span-1 col-start-1 col-end-13 row-start-1 row-end-1 text-center font-condensed text-base font-bold uppercase tracking-[0.2em] text-gray-400"
      >
        <span className="rounded bg-neutral-100 px-8 py-2">{children}</span>
      </h1>
      <hr className="-order-1 col-start-1 col-end-13 row-start-1 h-[4px] rounded border-none bg-gray-200/70" />
    </Link>
  )
}
