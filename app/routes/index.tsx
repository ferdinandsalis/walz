export default function Index() {
  return (
    <>
      <div className="space-y-16">
        <div className="-mx-8 mb-16 grid grid-cols-1 grid-rows-1 md:-mx-12 rounded-lg overflow-hidden">
          <div className="col-start-1 row-start-1 ">
            <img
              src="/photos/walz-draussen.jpg"
              alt="Walz draussen"
              className="aspect-video object-cover"
            />
          </div>
          <div className="col-start-1 row-start-1 bg-black/30 p-8 md:p-20 lg:py-24">
            <p className="max-w-xl text-2xl font-serif font-bold tracking-tight text-white md:text-4xl md:leading-tight lg:text-6xl">
              Die Walz soll Vorbereiten die Welt und Gesellschaft
              mitzugestalten.
            </p>
          </div>
        </div>

        <div className="rounded bg-sky-50 p-8 md:rounded-lg md:drop-shadow">
          <h1 className="mb-2 font-bold text-xl text-red-500">
            Was ist die Walz?
          </h1>
          <p className="max-w-prose text-lg">
            Ist eine Bildungseinrichtung in Wien für Jugendliche im Alter von 14
            bis 19. Jahren. Neben der Matura bietet die Walz geschützen Rahmen
            um eine Vielzahl an Dingen auszuprobieren.
          </p>
        </div>

        <hr />

        <section>
          <header className="mb-16 text-center">
            <hgroup>
              <h1 className="mb-2 font-serif text-lg font-black uppercase tracking-widest text-sky-500">
                Philosophie
              </h1>
              <h2 className="sr-only">Die Drei Prinzipien</h2>
            </hgroup>
          </header>
          <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-3">
            <article>
              <header className="mb-4">
                <img src="" className="" />
                <hgroup>
                  <h1 className="font-serif text-3xl font-bold">Bildung</h1>
                  <h2 className="text-lg font-medium text-red-500">
                    Verstehen, begreifen, erklären
                  </h2>
                </hgroup>
              </header>
              <p className="text-2xl font-medium leading-normal text-sky-500 underline underline-offset-2">
                Mehr Info
              </p>
              <p className="text-lg">
                Anders als Ausbildung verändert Bildung Menschen. Vor diesem
                Hintergrund verstehen wir unseren Auftrag daher im Sinne von
                bilden und formen. Wesentliches Ziel ist es, dass die
                Jugendlichen komplexe gesellschaftliche Zusammenhänge verstehen,
                begreifen, erklären und klären lernen. Über den klassischen
                Lehrplan einer AHS hinaus, entstehen durch die ständig
                wechselnden Anforderungen der Gesellschaft in der Walz immer
                wieder neue Erfahrungsräume, das Programm wird laufend evaluiert
                und angepasst.
              </p>
            </article>
            <article>
              <header className="mb-4">
                <hgroup>
                  <h1 className="font-serif text-3xl font-bold">Praxis</h1>
                  <h2 className="text-lg font-medium text-red-500">
                    Dinge probieren
                  </h2>
                </hgroup>
              </header>
              <p className="text-lg">
                Learning by doing – Ziel der Projekte in der Walz ist das
                erworbene Wissen in der Praxis anzuwenden und auf andere Art und
                Weise zu akquirieren. Auf dem Programm stehen neben Praktika in
                der Landwirtschaft, im Forst und in Handwerksbetrieben die
                Gründung einer Firma im Rahmen der Junior Company sowie
                zahlreiche Projekte im Ausland. So können die Jugendlichen nicht
                nur ihre Sprachkenntnisse verbessern, sondern auch fachliche
                Kompetenzen dazugewinnen und soziale Fähigkeiten erweitern.
              </p>
            </article>
            <article>
              <header className="mb-4">
                <hgroup>
                  <h1 className="font-serif text-3xl font-bold">
                    Persönlichkeit
                  </h1>
                  <h2 className="text-lg font-medium text-red-500">
                    Potenziale entfalten
                  </h2>
                </hgroup>
              </header>
              <p className="text-lg">
                Trotz veränderter Anforderungen bleibt für Jugendliche die alles
                bestimmende Frage des Jugendalters „Wer bin ich?“. In der Walz
                schaffen wir Erfahrungsräume, um dieser Frage nachzugehen. Ein
                Förder-Assessment-Center, individuelle Lernverträge,
                wöchentliche Reflexionen über den Lernprozess, individuelle
                Entwicklungsbegleitung und -förderung, therapeutische
                Unterstützung, Theater- und Kunstprojekte schaffen
                Perspektivenwechsel und ermöglichen den Jugendlichen sich selbst
                neu kennenzulernen und ihr einzigartiges Potenzial an Begabungen
                und Fähigkeiten zu erkunden und zu aktivieren.
              </p>
            </article>
            <article className="flex flex-col justify-center">
              <p className="text-2xl font-medium leading-normal text-sky-500 underline underline-offset-2">
                Mehr über die
                <br /> drei Säulen erfahren
              </p>
            </article>
          </div>
        </section>

        <hr />

        <section>
          <h1 className="mb-8 font-serif text-xl font-bold uppercase tracking-widest text-red-500">
            Häufige Fragen
          </h1>
          <nav className="flex items-center space-x-5">
            <div className="rounded-lg bg-blue-50 p-2 text-sky-500">
              <a href="./">Schüler</a>
            </div>
            <div className="rounded-lg bg-blue-50 p-2 text-sky-500">
              <a href="./">Eltern</a>
            </div>
            <div className="rounded-lg bg-blue-50 p-2 text-sky-500">
              <a href="./">Ehemalige</a>
            </div>
          </nav>
          <div>
            <dl>
              <div>
                <dt>Wieviel kostet das?</dt>
                <dd>Eh nicht so viel</dd>
              </div>
            </dl>
          </div>
        </section>

        <section>
          <h1 className="mb-8 font-serif text-xl font-bold uppercase tracking-widest text-red-500">
            Testimonials
          </h1>
        </section>

        <section>
          <h1 className="mb-8 font-serif text-xl font-bold uppercase tracking-widest text-red-500">
            Kontakt
          </h1>
          <div>Agnes Chorherr</div>
        </section>
      </div>
    </>
  )
}
