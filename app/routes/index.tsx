import { Logo } from '~/components/brand'

export default function Index() {
  return (
    <>
      <div className="mb-8 md:mb-24 flex flex-col items-center">
        <Logo />
      </div>
      <div className="space-y-16">
        <div className="-mx-8 md:-mx-12 mb-16">
          <div className="bg-sky-50 p-8 md:p-12">
            <p className="text-xl md:text-2xl font-light max-w-prose leading-relaxed mb-8 text-slate-900">
              Unser Bestreben ist es, die Jugendlichen auf ein, gegenüber der
              Vergangenheit gesellschaftlich drastisch verändertes, selbst
              bestimmtes Leben vorzubereiten. Unser Ziel ist, dass unsere
              Absolvent:innen eben diese Fähigkeiten in die Gesellschaft
              einbringen und so einen Beitrag zu deren Gestaltung leisten. Der
              für die Walz relevante Ort des Lernens ist das konkrete Tun –
              neben dem regulären Unterricht in den Gegenständen laut Lehrplan
              finden verschiedenste Projekte statt. Diese Projekte sollen
              Lebenserfahrung ermöglichen und die Idee des lebenslangen Lernens
              implementieren.
            </p>
          </div>
        </div>
        <section>
          <header className="mb-16 text-left">
            <h1 className="text-xl text-sky-500 font-bold uppercase tracking-widest">
              Die Drei Säulen
            </h1>
            <h2 className="font-medium text-lg">
              Hierauf stützt sich alles was wir machen
            </h2>
          </header>
          <div className="grid md:grid-cols-2 gap-12">
            <article>
              <header className="mb-4">
                <h1 className="text-4xl font-bold">Bildung</h1>
                <h2 className="font-medium text-lg text-red-500">
                  Verstehen, begreigen, erklaeren
                </h2>
              </header>
              <p className="font-light text-lg">
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
                <h1 className="text-4xl font-bold">Praxis</h1>
                <h2 className="font-medium text-lg text-red-500">
                  Dinge probieren
                </h2>
              </header>
              <p className="font-light text-lg">
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
                <h1 className="text-4xl font-bold">Persönlichkeit</h1>
                <h2 className="font-medium text-lg text-red-500">
                  Potenziale entfalten
                </h2>
              </header>
              <p className="font-light text-lg">
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
              <p className="text-4xl text-red-500 font-medium leading-normal underline underline-offset-2">
                Mehr über die drei Säulen erfahren
              </p>
            </article>
          </div>
        </section>
        <div className="bg-sky-50 p-12 rounded">
          <h1 className="text-2xl text-sky-500 mb-4">Was ist die Walz?</h1>
          <p className="max-w-prose rounded-md text-lg font-light text-gray-700">
            ist eine private Bildungseinrichtung mit Öffentlichkeitsrecht für
            Jugendliche im Alter von 14 bis 19 Jahren (9.-13. Schulstufe). Die
            Walz schließt mit Matura (Externistenreifeprüfung) ab. Der
            Unterricht orientiert sich am Lehrplan des Oberstufenrealgymnasiums
            mit Bildnerischem Gestalten und Werkerziehung.
          </p>
        </div>

        <section>
          <h1 className="text-xl text-sky-500 font-bold uppercase tracking-widest">
            Häufige Fragen
          </h1>
          <section>
            <h1>… der Schüler</h1>
          </section>
          <section>
            <h1>… der Eltern</h1>
          </section>
          <section>
            <h1>… der Ehemaligen</h1>
          </section>
        </section>

        <div>
          <h1 className="text-xl text-sky-500 font-bold uppercase tracking-widest">
            Unser Kontakt
          </h1>
        </div>
      </div>
    </>
  )
}
