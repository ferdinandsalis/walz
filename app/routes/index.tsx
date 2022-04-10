export default function Index() {
  return (
    <>
      <div className="space-y-16">
        <div className="-mx-8 mb-16 md:-mx-12">
          <div className="bg-sky-50 p-8 md:p-20 lg:py-24">
            <p className="max-w-xl text-2xl font-light tracking-tight text-gray-800 md:text-4xl md:leading-tight">
              Unser Bestreben ist es dich auf ein, gegenüber der Vergangenheit
              gesellschaftlich drastisch verändertes, selbst bestimmtes Leben
              vorzubereiten.
            </p>
          </div>
        </div>
        <section>
          <header className="mb-16 text-center">
            <h1 className="mb-2 font-serif text-lg font-bold uppercase tracking-widest text-sky-500">
              Die Drei Säulen
            </h1>
            <h2 className="font-medium text-gray-500">
              Hierauf stützt sich alles was wir machen
            </h2>
          </header>
          <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-3">
            <article>
              <header className="mb-4">
                <h1 className="font-serif text-4xl font-bold">Bildung</h1>
                <h2 className="text-lg font-medium text-red-500">
                  Verstehen, begreifen, erklären
                </h2>
              </header>
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
                <h1 className="font-serif text-4xl font-bold">Praxis</h1>
                <h2 className="text-lg font-medium text-red-500">
                  Dinge probieren
                </h2>
              </header>
              <p className="text-lg">
                Learning by doing- Ziel der Projekte in der Walz ist das
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
                <h1 className="font-serif text-4xl font-bold">
                  Persönlichkeit
                </h1>
                <h2 className="text-lg font-medium text-red-500">
                  Potenziale entfalten
                </h2>
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
        <div className="max-w-xl rounded bg-amber-50 p-12 md:rounded-lg md:drop-shadow">
          <h1 className="mb-4 font-serif text-2xl text-amber-500">
            Was ist die Walz?
          </h1>
          <p className="max-w-prose rounded-md text-lg">
            ist eine private Bildungseinrichtung mit Öffentlichkeitsrecht für
            Jugendliche im Alter von 14 bis 19 Jahren (9.-13. Schulstufe). Die
            Walz schließt mit Matura (Externistenreifeprüfung) ab. Der
            Unterricht orientiert sich am Lehrplan des Oberstufenrealgymnasiums
            mit Bildnerischem Gestalten und Werkerziehung.
          </p>
        </div>

        <section>
          <h1 className="mb-8 font-serif text-xl font-bold uppercase tracking-widest text-red-500">
            Häufige Fragen
          </h1>
          <nav className="flex items-center space-x-5">
            <div className="rounded-full bg-blue-50 p-4 text-sky-500">
              <h1>der Schüler</h1>
            </div>
            <div className="rounded-full bg-blue-50 p-4 text-sky-500">
              <h1>der Eltern</h1>
            </div>
            <div className="rounded-full bg-blue-50 p-4 text-sky-500">
              <h1>der Ehemaligen</h1>
            </div>
          </nav>
        </section>

        <section>
          <h1 className="mb-8 font-serif text-xl font-bold uppercase tracking-widest text-red-500">
            Kontakt
          </h1>
        </section>
      </div>
    </>
  )
}
