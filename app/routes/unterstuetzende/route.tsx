import { Link } from 'react-router'

export default function Unterstuetzer() {
  return (
    <div className="relative grid grid-cols-subgrid items-start gap-8 lg:col-span-2">
      <h1 className="font-condensed text-h1 text-muted-foreground font-bold opacity-20">
        Unterstützer:innen
      </h1>
      <div className="col-start-1 grid grid-cols-12 gap-x-4 gap-y-16 text-balance hyphens-auto sm:gap-x-6 lg:gap-x-8">
        <div className="col-span-12 grid grid-cols-subgrid gap-y-12 text-base md:text-xl">
          <p className="text-body-md col-span-12 max-w-2xl">
            Die Walz ist ein gemeinnütziger Verein und finanziert sich
            überwiegend über Schulgeld. Ein besonderer Dank gilt{' '}
            <Link
              to="/alumni#ehrensache"
              className="text-primary hover:text-primary/80 underline underline-offset-4"
            >
              Ehrensache Walz
            </Link>
            : Durch das Engagement von Eltern und Ehemaligen können wir Teil-
            und Vollstipendien anbieten, die es Jugendlichen unabhängig der
            finanziellen Situation ihrer Eltern ermöglichen, die Walz zu
            besuchen. Zusätzlich danken wir unseren Förderern für ihre
            Unterstützung.
          </p>
          <ul className="col-span-12 grid grid-cols-subgrid gap-y-8">
            <li className="col-span-12 md:col-span-6">
              <figure className="bg-card flex aspect-video flex-col justify-between gap-4 p-4">
                <div>
                  <img
                    src="/images/unterstuetzer/bmbf.png"
                    alt="BMBF Logo"
                    className="h-16"
                  />
                </div>
                <figcaption className="text-body-xs text-muted-foreground">
                  <span>Bundesministerium für Bildung</span>
                </figcaption>
              </figure>
            </li>
            <li className="col-span-12 md:col-span-6">
              <figure className="bg-card flex aspect-video flex-col justify-between gap-4 p-4">
                <div>
                  <img
                    src="/images/unterstuetzer/stadt_wien.png"
                    alt="Stadt Wien Logo"
                    className="h-16"
                  />
                </div>
                <figcaption className="text-body-xs text-muted-foreground">
                  <span>Stadt Wien</span>
                </figcaption>
              </figure>
            </li>
            <li className="col-span-12 md:col-span-6">
              <figure className="bg-card flex aspect-video flex-col justify-between gap-4 p-4">
                <div>
                  <img
                    src="/images/unterstuetzer/oead.png"
                    alt="OeAD Logo"
                    className="mt-2 h-16 flex-none"
                  />
                </div>
                <figcaption className="text-body-xs text-muted-foreground">
                  <span>
                    Österreichs Agentur für Bildung und Internationalisierung
                  </span>
                </figcaption>
              </figure>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
