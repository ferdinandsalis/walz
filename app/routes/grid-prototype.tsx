/**
 * Prototype page to test 12-column grid alignment.
 * Delete after grid parameters are locked in.
 */
export default function GridPrototype() {
  return (
    <div className="col-span-1 col-start-1 grid grid-cols-subgrid items-start lg:col-span-4 xl:col-span-2">
      <div className="col-span-full grid grid-cols-12 gap-x-4 gap-y-4 sm:gap-x-6 sm:gap-y-8 md:gap-y-12 lg:gap-x-8 lg:gap-y-16">
        {/* Grid debug overlay */}
        <div className="pointer-events-none sticky top-0 z-50 col-span-12 grid grid-cols-subgrid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-4 rounded-sm bg-primary/20 text-center text-[10px] leading-4 text-primary/60"
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* ── Section 1: Hero (full width) ── */}
        <section className="col-span-12">
          <div className="relative -mx-4 overflow-hidden rounded-none bg-muted/50 sm:mx-0 sm:rounded-md sm:shadow-md">
            <div className="flex aspect-[21/12] items-center justify-center bg-gradient-to-br from-secondary/20 to-primary/20 p-8 sm:p-16">
              <p className="max-w-xl text-pretty text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Die{' '}
                <strong className="font-bold text-secondary">Walz</strong> soll
                darauf vorbereiten, mit Liebe die Welt und die Gesellschaft
                mitzugestalten.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 2: Text + Shoutout (asymmetric 2-col) ── */}
        <section className="col-span-12 grid grid-cols-subgrid">
          <div className="col-span-12 space-y-4 md:col-span-8">
            <h2 className="sr-only">Was ist die Walz?</h2>
            <p className="max-w-2xl text-pretty text-body-md xl:text-body-lg">
              In der Walz können Jugendliche zwischen 14 und 19 Jahren in einem
              geschützten Rahmen ihre Potenziale entfalten, ihre Möglichkeiten
              ausloten und werden auf die Matura vorbereitet.
            </p>
            <p className="text-body-md text-muted-foreground">
              Was unterscheidet die Walz von einer klassischen Oberstufe? Lorem
              ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore.
            </p>
          </div>
          <div className="col-span-12 md:col-span-4">
            <div className="rounded-lg border border-secondary/30 bg-secondary/20 p-6 ring-8 ring-muted/20">
              <p className="mb-4 text-pretty text-body-md">
                👋 Lerne die Walz kennen
                <br />
                <strong className="font-bold">
                  Tag der offenen Tür am 15. März
                </strong>
              </p>
              <span className="inline-flex rounded-md bg-secondary px-4 py-2 font-bold text-white shadow">
                Mehr erfahren
              </span>
            </div>
          </div>
        </section>

        {/* ── Section 3: Blog (8+4 split) ── */}
        <section className="col-span-12 grid grid-cols-subgrid gap-y-8">
          <h2 className="col-span-12 text-body-xs font-bold uppercase tracking-widest text-muted-foreground">
            Unser Blog
          </h2>
          <div className="col-span-12 grid grid-cols-subgrid">
            <article className="col-span-12 grid rounded-lg bg-white shadow-md md:col-span-8 lg:grid-cols-2">
              <div className="flex aspect-square items-center justify-center bg-muted/30 lg:aspect-auto lg:rounded-l-lg">
                <span className="text-muted-foreground/50">
                  [Artikelbild]
                </span>
              </div>
              <div className="p-6">
                <h3 className="mb-2 font-condensed text-xl font-bold text-secondary md:text-2xl">
                  Aus dem Fach auf die Bühne
                </h3>
                <p className="text-body-xs text-muted-foreground">
                  Veröffentlicht am 5. März 2026
                </p>
                <p className="mt-4 max-w-md text-pretty text-body-sm leading-snug lg:text-body-md">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam…
                </p>
              </div>
            </article>
            <div className="col-span-12 grid auto-rows-min gap-y-8 md:col-span-4">
              {['Redewettbewerb', 'Alles Walz', 'Walz Unterschiede'].map(
                title => (
                  <article key={title} className="max-w-prose">
                    <h3 className="font-condensed font-bold md:text-lg">
                      {title}
                    </h3>
                    <p className="mt-2 text-body-sm text-muted-foreground">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit…
                    </p>
                    <span className="mt-2 inline-block font-condensed text-primary">
                      Weiterlesen
                    </span>
                  </article>
                ),
              )}
            </div>
          </div>
        </section>

        {/* ── Section 4: Philosophie (3 equal columns) ── */}
        <section className="col-span-12 grid grid-cols-subgrid gap-y-8">
          <header className="col-span-12 py-4 md:py-8">
            <h2 className="font-condensed text-h2 font-bold text-primary">
              Unsere Philosophie
            </h2>
          </header>
          <div className="col-span-12 grid grid-cols-subgrid">
            {['Persönlichkeit', 'Bildung', 'Praxis'].map(title => (
              <div
                key={title}
                className="col-span-12 flex flex-col rounded-lg md:col-span-6 lg:col-span-4"
              >
                <div className="h-48 rounded-t-lg bg-muted/30" />
                <div className="rounded-b-lg border-t-4 border-t-primary bg-card p-6 shadow-md">
                  <h3 className="font-condensed text-h4 font-bold text-secondary">
                    {title}
                  </h3>
                  <p className="mt-1 text-lg font-bold leading-none">
                    Lorem ipsum dolor sit amet
                  </p>
                  <span className="mt-4 inline-flex items-center font-condensed text-lg text-muted-foreground">
                    Mehr erfahren →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 5: Testimonials (full width, free-form) ── */}
        <section className="col-span-12 space-y-8">
          <header className="py-4 md:py-8">
            <h2 className="font-condensed text-h2 font-bold text-primary">
              Stimmen aus der Walz
            </h2>
          </header>
          <div className="rounded-md bg-muted/30 p-8 shadow-inner">
            <p className="text-center text-muted-foreground">
              [Carousel — free-form, no subgrid]
            </p>
          </div>
        </section>

        {/* ── Section 6: FAQ (full width, free-form flex wrap) ── */}
        <section className="col-span-12 space-y-8">
          <header className="py-4 md:py-8">
            <h2 className="font-condensed text-h2 font-bold text-primary">
              Häufige Fragen
            </h2>
          </header>
          <div className="flex flex-row flex-wrap gap-3">
            {[
              'Was heißt eigentlich Walz?',
              'Wie kann ich die Walz kennenlernen?',
              'Wieso gibt es Externistenprüfungen?',
              'Warum ist die Walz Smartphone-freie Zone?',
              'Was kostet die Walz?',
            ].map(q => (
              <span
                key={q}
                className="flex overflow-hidden rounded bg-card text-body-md !leading-snug text-primary shadow"
              >
                <span className="min-w-10 flex-none bg-card px-2 py-2 text-secondary">
                  ✱
                </span>
                <span className="bg-primary/5 px-3 py-2">{q}</span>
              </span>
            ))}
          </div>
        </section>

        {/* ── Section 7: Kontakt (8+4 split) ── */}
        <section className="col-span-12 grid grid-cols-subgrid gap-y-8">
          <header className="col-span-12 py-4 md:py-8">
            <h2 className="font-condensed text-h2 font-bold text-primary">
              Anfahrt & Kontakt
            </h2>
          </header>
          <div className="col-span-12 grid grid-cols-subgrid">
            <div className="col-span-12 h-72 overflow-hidden rounded bg-muted/20 md:col-span-8 lg:h-96">
              <div className="flex h-full items-center justify-center text-muted-foreground/50">
                [Google Maps]
              </div>
            </div>
            <div className="col-span-12 md:col-span-4">
              <h3 className="mb-4 text-body-xs font-bold uppercase tracking-widest text-muted-foreground">
                Kontakt
              </h3>
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
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
