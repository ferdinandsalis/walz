import { Link } from '@remix-run/react'
import { LogoIcon } from '~/components/brand'
import { ArrowRight } from '@carbon/icons-react'

const newEntries = [
  {
    title: 'Wir stellen einen neuen Jahrgang vor.',
    time: '15. Mai 2023',
    abstract:
      'Unser neuester Jahrgang stellt sich vor. Schau rein und lerne sie kennen.',
  },
  // {
  //   title: 'Theater im Museums Quartier. Komm vorbei!',
  //   time: '5. Mai 2023',
  // },
  // {
  //   title: 'Wer ist den eigentlich …',
  //   time: '30. April 2023',
  // },
]

export default function Index() {
  return (
    <>
      <div className="space-y-16 lg:space-y-20">
        <div className="relative -mx-8 mb-16 grid grid-cols-1 grid-rows-1 overflow-hidden md:rounded-lg">
          <div className="col-start-1 row-start-1 ">
            <img
              src="/photos/walz-draussen.jpg"
              alt="Walz draussen"
              className="aspect-square object-cover md:aspect-video"
            />
          </div>
          <div className="col-start-1 row-start-1 bg-black/40 p-12 sm:p-16 md:p-20 lg:py-24">
            <p className="max-w-xl font-serif text-4xl font-bold tracking-tight text-white md:text-4xl md:leading-tight lg:text-6xl">
              Die <strong className="font-bold text-orange-500">Walz</strong>{' '}
              soll darauf vorbereiten, mit Mut und Liebe die Welt und
              Gesellschaft mitzugestalten.
            </p>
          </div>
          <LogoIcon
            className="absolute -bottom-20 -right-20 w-60 fill-white md:w-72 lg:w-96"
            fill="#fff"
          />
        </div>

        <div className="grid gap-16 lg:grid-cols-6 lg:grid-rows-1">
          <section className="lg:col-span-3 lg:col-start-4 lg:row-start-1">
            <h1 className="mb-2 text-lg font-bold text-orange-500">
              Aktuelles
            </h1>
            <ol className="space-y-2">
              {newEntries.map(entry => {
                return (
                  <li className="-mx-8 rounded bg-gray-50 p-8">
                    <article className="space-y-4 text-black">
                      <h1 className="mb-2 text-lg font-bold text-sky-500 md:text-xl lg:text-2xl">
                        {entry.title}
                      </h1>
                      <p className="text-xl">{entry.abstract}</p>
                      <footer>
                        <p className="text-gray-500">
                          Veröffentlicht am{' '}
                          <time className="text-gray-700">{entry.time}</time>
                        </p>
                      </footer>
                    </article>
                  </li>
                )
              })}
            </ol>
          </section>
          <section className="lg:col-span-3 lg:row-start-1">
            <h1 className="mb-2 text-lg font-bold text-orange-500">
              Was ist die Walz?
            </h1>
            <p className="max-w-xl text-lg leading-relaxed md:text-xl lg:text-2xl">
              In der Walz werden Jugendliche zwischen 14 und 19 Jahren auf die
              Matura vorbereitet und können in einem geschützten Rahmen ihre
              Möglichkeiten ausloten und ihre Potenziale entfalten.
            </p>
          </section>
        </div>

        <section>
          <header className="mb-16">
            <DividerHeading>Philosophie</DividerHeading>
          </header>
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            <Link to="./philosophie/bildung" className="group">
              <div className="relative mb-4">
                <img
                  src=""
                  className="ascpet-square h-48 w-full bg-gray-100 object-cover shadow-lg grayscale"
                />
              </div>
              <h1 className="font-serif text-3xl font-bold text-sky-500">
                Bildung
              </h1>
              <h2 className="text-lg font-bold">
                Verstehen, begreifen, erklären
              </h2>
              <ArrowRight className="h-8 w-8" />
            </Link>
            <Link to="./philosophie/praxis" className="group">
              <div className="relative mb-4">
                <img
                  src=""
                  className="ascpet-square h-48 w-full bg-gray-100 object-cover shadow-lg grayscale"
                />
              </div>
              <h1 className="font-serif text-3xl font-bold text-sky-500">
                Praxis
              </h1>
              <h2 className="text-lg font-bold">Dinge probieren</h2>
              <ArrowRight className="h-8 w-8" />
            </Link>
            <Link to="./philosophie/persoenlichkeit" className="group">
              <div className="relative mb-4">
                <img
                  src=""
                  className="ascpet-square h-48 w-full bg-gray-100 object-cover shadow-lg grayscale"
                />
              </div>
              <h1 className="font-serif text-3xl font-bold text-sky-500">
                Persönlichkeit
              </h1>
              <h2 className="text-lg font-bold">Potenziale entfalten</h2>
              <ArrowRight className="h-8 w-8" />
            </Link>
          </div>
        </section>

        <section>
          <header className="mb-16 lg:mb-20">
            <DividerHeading>Häufige Fragen</DividerHeading>
          </header>
          <nav className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-50 px-2 text-orange-500">
              <a href="./">Schüler</a>
            </div>
            <div className="rounded-lg bg-orange-50 px-2 text-orange-500">
              <a href="./">Eltern</a>
            </div>
            <div className="rounded-lg bg-orange-50 px-2 text-orange-500">
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
            <DividerHeading>Testimonials</DividerHeading>
          </header>
        </section>

        <section>
          <header className="mb-16 lg:mb-20">
            <DividerHeading>Kontakt</DividerHeading>
          </header>
          <div>Agnes Chorherr</div>
        </section>
      </div>
    </>
  )
}

function DividerHeading({ children }: { children: any }) {
  return (
    <div className="grid grid-cols-1 items-center">
      <h1 className="col-span-1 col-start-1 row-start-1 text-center font-serif text-base font-bold uppercase tracking-[0.15em] text-gray-400">
        <span className="rounded bg-white px-4 py-2">{children}</span>
      </h1>
      <hr className="-order-1 col-start-1 row-start-1 h-[4px] rounded border-none bg-white" />
    </div>
  )
}
