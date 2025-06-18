export default function Unterstuetzer() {
  return (
    <div className="relative grid grid-cols-subgrid items-start gap-8 lg:col-span-2">
      <h1 className="font-condensed text-h1 font-bold text-muted-foreground opacity-20">
        Unterstützer:innen
      </h1>
      <div className="col-start-1 grid grid-cols-1 gap-16 hyphens-auto text-balance">
        <div className="max-w-2xl space-y-12 text-base md:text-xl">
          <p className="text-body-md">
            Die Walz ist ein gemeinnütziger Verein und finanziert sich
            überwiegend über Schulgeld. Ein besonderer Dank gilt Ehrensache
            Walz: Durch das Engagement von Eltern und Ehemaligen können wir
            Teil- und Vollstipendien anbieten, die es Jugendlichen unabhängig
            der finanziellen Situation ihrer Eltern ermöglichen, die Walz zu
            besuchen. Zusätzlich danken wir unseren Förderern für ihre
            Unterstützung.
          </p>
          <ul className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <li>
              <figure className="flex aspect-video flex-col justify-between gap-4 bg-card p-4">
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
            <li>
              <figure className="flex aspect-video flex-col justify-between gap-4 bg-card p-4">
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
            <li>
              <figure className="flex aspect-video flex-col justify-between gap-4 bg-card p-4">
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
