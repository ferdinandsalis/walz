import { Link } from '@remix-run/react'
import { LogoIcon } from '~/components/brand'
import { ArrowRight } from '@carbon/icons-react'

const newEntries = [
  {
    title: 'Wir stellen einen neuen Jahrgang vor.',
    time: '15. Mai 2023',
  },
  {
    title: 'Theater im Museums Quartier. Komm vorbei!',
    time: '5. Mai 2023',
  },
  {
    title: 'Wer ist den eigentlich …',
    time: '30. April 2023',
  },
]

export default function Index() {
  return (
    <>
      <div className="space-y-16">
        <div className="relative -mx-8 mb-16 grid grid-cols-1 grid-rows-1 md:rounded-lg overflow-hidden">
          <div className="col-start-1 row-start-1 ">
            <img
              src="/photos/walz-draussen.jpg"
              alt="Walz draussen"
              className="aspect-square md:aspect-video object-cover"
            />
          </div>
          <div className="col-start-1 row-start-1 bg-black/40 p-12 sm:p-16 md:p-20 lg:py-24">
            <p className="max-w-xl text-4xl font-serif font-bold tracking-tight text-white md:text-4xl md:leading-tight lg:text-6xl">
              Die <strong className="text-orange-600 font-bold">Walz</strong>{' '}
              soll Vorbereiten die Welt und Gesellschaft mitzugestalten.
            </p>
          </div>
          <LogoIcon
            className="w-60 md:w-72 lg:w-96 absolute -bottom-20 -right-20 fill-white"
            fill="#fff"
          />
        </div>

        <div className="grid lg:grid-rows-1 lg:grid-cols-6 gap-12">
          <div className="lg:row-start-1 lg:col-start-4 lg:col-span-3">
            <h2 className="sr-only">Aktuelles</h2>
            <ol className="space-y-2">
              {newEntries.map(entry => {
                return (
                  <li className="list-disc text-orange-600">
                    <article className="text-black">
                      <h1 className="font-bold text-xl">{entry.title}</h1>
                      <footer>
                        <p className="text-gray-500">
                          Geschrieben am{' '}
                          <time className="text-gray-700">{entry.time}</time>
                        </p>
                      </footer>
                    </article>
                  </li>
                )
              })}
            </ol>
          </div>
          <div className="lg:row-start-1 lg:col-span-3">
            <h1 className="mb-2 font-bold text-lg text-sky-500">
              Was ist die Walz?
            </h1>
            <p className="max-w-xl leading-relaxed max-w-prose text-lg md:text-xl lg:text-2xl">
              Die Walz ist eine Bildungs&shy;einrichtung in Wien für Jugendliche
              im Alter von 14 bis 19. Jahren. Neben der Matura bietet die Walz
              geschützen Rahmen um eine Vielzahl an Dingen auszu&shy;probieren.
            </p>
          </div>
        </div>

        <section>
          <header className="mb-16">
            <DividerHeading>Philosophie</DividerHeading>
          </header>
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            <Link to="./philosophie/bildung" className="group">
              <div className="relative mb-4">
                <img
                  src="/photos/walz-philosophie-praxis.jpg"
                  className="ascpet-square object-cover w-full h-48 w-48 drop-shadow-lg shadow-lg grayscale"
                />
              </div>
              <h1 className="font-serif text-3xl font-bold">Bildung</h1>
              <h2 className="text-lg font-bold text-orange-600">
                Verstehen, begreifen, erklären
              </h2>
              <ArrowRight className="w-8 h-8 fill-sky-500" />
            </Link>
            <Link to="./philosophie/praxis" className="group">
              <div className="relative mb-4">
                <img
                  src="/photos/walz-philosophie-praxis.jpg"
                  className="ascpet-square object-cover w-full h-48 w-48 drop-shadow-lg shadow-lg grayscale"
                />
              </div>
              <h1 className="font-serif text-3xl font-bold">Praxis</h1>
              <h2 className="text-lg font-bold text-orange-600">
                Dinge probieren
              </h2>
              <ArrowRight className="w-8 h-8 fill-sky-500" />
            </Link>
            <Link to="./philosophie/persoenlichkeit" className="group">
              <div className="relative mb-4">
                <img
                  src="/photos/walz-philosophie-praxis.jpg"
                  className="ascpet-square object-cover w-full h-48 w-48 drop-shadow-lg shadow-lg grayscale"
                />
              </div>
              <h1 className="font-serif text-3xl font-bold">Persönlichkeit</h1>
              <h2 className="text-lg font-bold text-orange-600">
                Potenziale entfalten
              </h2>
              <ArrowRight className="w-8 h-8 fill-sky-500" />
            </Link>
          </div>
        </section>

        <section>
          <header className="mb-16">
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
          <header className="mb-16">
            <DividerHeading>Testimonials</DividerHeading>
          </header>
        </section>

        <section>
          <header className="mb-16">
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
      <h1 className="text-center font-serif text-lg font-bold uppercase tracking-widest text-sky-500 row-start-1 col-start-1 col-span-1">
        <span className="bg-white px-4">{children}</span>
      </h1>
      <hr className="row-start-1 col-start-1 -order-1" />
    </div>
  )
}
