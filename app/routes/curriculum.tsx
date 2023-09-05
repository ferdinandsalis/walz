import { BackToTop } from '#app/components/back-to-top.tsx'
import { Toc } from '#app/components/toc.tsx'
import { Divider } from '#app/components/ui/divider.tsx'

export default function Curriculum() {
  return (
    <div className="md:mt-12">
      <h1 className="absolute left-0 origin-top-left rotate-90 scale-[4] font-condensed text-xl font-bold text-stone-500 opacity-10">
        Curriculum
      </h1>

      <div className="space-y-12 md:space-y-16">
        <Toc
          links={[
            { name: 'Unterricht', to: '#unterricht' },
            { name: 'Projekte', to: '#projekte' },
            { name: 'In Jahren', to: '#in-jahren' },
          ]}
        />

        <Divider />

        <section id="unterricht" className="space-y-8">
          <h1 className="font-condensed text-2xl font-bold text-primary md:text-4xl">
            Unterricht
          </h1>
          <div className="max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Die Walz bietet eine fünfjährige Bildungslaufbahn, die mit der
              Matura abschließt. Unsere Prüfungen sind extern und decken den
              Lehrstoff von zwei bis vier Jahren ab. Als Prüfungsschule dient
              das Bundesoberstufenrealgymnasium 3, gelegen in der Landstraßer
              Hauptstraße 70.
            </p>
          </div>

          <div>
            <h2 className="font-condensed text-2xl font-bold text-secondary">
              Unser Unterrichtsmodell
            </h2>
            <div className="max-w-prose space-y-4 text-base md:text-xl">
              <p>
                Der Unterricht findet von Montag bis Freitag zwischen 8:30 und
                16:30 Uhr statt. Wir setzen auf geblockte Prüfungsvorbereitungen
                für spezielle Fächer wie Biologie und Geografie. Diese
                intensiven Lernphasen dauern in der Regel 6–8 Wochen und münden
                in einer Prüfung. Für Kernfächer wie Mathematik, Deutsch und
                Fremdsprachen erstreckt sich die Prüfungsvorbereitung über
                mehrere Jahre, ebenfalls gefolgt von einer Prüfung nach
                intensiver Vorbereitung.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-condensed text-2xl font-bold text-secondary">
              Prüfungsrichtlinien
            </h2>
            <div className="max-w-prose space-y-4 text-base md:text-xl">
              <p>
                Die Prüfungen orientieren sich am Lehrplan eines
                Oberstufenrealgymnasiums mit Bildnerisches Gestalten und
                Werkerziehung.
              </p>
            </div>
          </div>

          <table border={0} className="table max-w-prose">
            <thead>
              <tr>
                <th className="">
                  <div>Walz-Jahr</div>
                </th>
                <th>
                  <div>Prüfungen </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>
                  <div className="relative flex items-center gap-2 overflow-hidden">
                    <span className="text-primary">1.</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      9. Schulstufe
                    </span>
                  </div>
                </th>
                <td>
                  <div>Interne Prüfungen</div>
                </td>
              </tr>
              <tr>
                <th>
                  <div className="relative flex items-center gap-2 overflow-hidden">
                    <span className="text-primary">2.</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      10. Schulstufe
                    </span>
                  </div>
                </th>
                <td rowSpan={3}>
                  <div>Externe Zulassungprüfungen</div>
                </td>
              </tr>
              <tr>
                <th>
                  <div className="relative flex items-center gap-2 overflow-hidden">
                    <span className="text-primary">3.</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      11. Schulstufe
                    </span>
                  </div>
                </th>
                <td></td>
              </tr>
              <tr>
                <th>
                  <div className="relative flex items-center gap-2 overflow-hidden">
                    <span className="text-primary">4.</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      12. Schulstufe
                    </span>
                  </div>
                </th>
                <td></td>
              </tr>
              <tr>
                <th>
                  <div className="relative flex items-center gap-2 overflow-hidden">
                    <span className="text-primary">5.</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      13. Schulstufe
                    </span>
                  </div>
                </th>
                <td>
                  <div>Externe Zulassungsprüfungen und Matura</div>
                </td>
              </tr>
            </tbody>
          </table>

          <BackToTop />
        </section>

        <Divider />

        <section id="projekte" className="space-y-8">
          <h1 className="font-condensed text-2xl font-bold text-primary md:text-4xl">
            Projekte
          </h1>
          <div className="max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Zwischen den einzelnen Prüfungsvorbereitungen finden in der Walz
              viele Projekte, zum Teil auch außer Haus, statt. Manche Projekte
              stellen einen praktischen Bezug zum Lernstoff dar, so wird zum
              Beispiel der Biologie-Prüfungsstoff zu einem großen Teil in der
              Natur erlebt und anschließend für die Prüfung aufgearbeitet (zum
              Beispiel im Forst).
            </p>
            <p>
              Andere Projekte, wie zum Beispiel das Autonomietraining, dienen
              dazu, speziellere Themen der Persönlichkeitsentwicklung
              aufzugreifen. Bei den verschiedenen Auslandsreisen und Praktika im
              Ausland können die Jugendlichen all ihre erworbenen Fähigkeiten
              praktisch anwenden. So werden gleichzeitig fachliche und soziale
              Kompetenzen entwickelt.
            </p>
            <p>
              Das genaue Programm der verschiedenen Schulstufen orientiert sich
              am jeweiligen Lebensalter der Jugendlichen und den damit
              verbundenen Fragen. Zwischen den einzelnen Prüfungsvorbereitungen
              finden in der Walz viele Projekte, zum Teil auch außer Haus,
              statt. Manche Projekte stellen einen praktischen Bezug zum
              Lernstoff dar, so wird z.B. der Biologie-Prüfungsstoff zu einem
              großen Teil in der Natur erlebt und anschließend für die Prüfung
              aufgearbeitet (z.B. im Forst)
            </p>
          </div>

          <BackToTop />
        </section>

        <Divider />

        <section id="in-jahren" className="space-y-8">
          <h1 className="font-condensed text-2xl font-bold text-primary md:text-4xl">
            In Jahren
          </h1>
          <div className="space-y-8 md:space-y-12">
            <article className="space-y-4">
              <hgroup>
                <span
                  role="presentation"
                  className="absolute scale-[8] font-black opacity-5"
                >
                  1
                </span>
                <h1 className="text-2xl font-bold text-stone-800">1. Jahr</h1>
                <p className="font-condensed text-xl font-bold text-secondary md:text-2xl">
                  Timeout und Ausprobieren
                </p>
              </hgroup>
              <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
                <p>
                  Gute Nachrichten für alle, die nach 8 Jahren Schulbank genug
                  haben! Die Walz beginnt mit einem „Time-Out“ von der Schule -
                  du lernst neue und andere Lebenswelten kennen und kannst
                  außerhalb des traditionellen Schulalltags verschiedenste
                  Fertigkeiten erlernen. Die praktischen Erfahrungen auf dem
                  Bauernhof, im Forst und in diversen Handwerksbetrieben werden
                  später aufgearbeitet und bereiten dich auch auf die
                  Externistenprüfungen in den folgenden Jahren vor.
                </p>
              </div>
            </article>

            <article className="space-y-4">
              <hgroup>
                <span
                  role="presentation"
                  className="absolute scale-[8] font-black opacity-5"
                >
                  2
                </span>
                <h1 className="text-2xl font-bold text-stone-800">2. Jahr</h1>
                <p className="font-condensed text-xl font-bold text-secondary md:text-2xl">
                  Auslandsabenteuer und erste Prüfungen
                </p>
              </hgroup>
              <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
                <p>
                  Es wird ernst! Die ersten Prüfungen stehen an! Der erste
                  Auslandsaufenthalt führt euch als ganze Gruppe nach Penzance.
                  Dort kannst du an einem Arbeitsplatz deiner Wahl ( z.B.
                  Second-Hand-Shops, Kindergarten, etc.) deine
                  Englischkenntnisse verbessern. Im Winter geht’s in den Kühtai
                  zum Tourengehen und im Frühling sind wir in St. Margarethen,
                  unser erstes Kunstprojekt außer Haus.
                </p>
              </div>
            </article>

            <article className="space-y-4">
              <hgroup>
                <span
                  role="presentation"
                  className="absolute scale-[8] font-black opacity-5"
                >
                  3
                </span>
                <h1 className="text-2xl font-bold text-stone-800">3. Jahr</h1>
                <p className="font-condensed text-xl font-bold text-secondary md:text-2xl">
                  Ein facettenreiches Jahr
                </p>
              </hgroup>
              <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
                <p>
                  Im Mythentheater geht es auf eine spannende und groß
                  inszenierte Reise zu verschiedenen Archetypen der
                  Kulturgeschichte. Im Förder-Assessment-Center werden unter
                  Anleitung erfahrener Beobachter die eigenen Stärken und
                  Entwicklungsfelder analysiert – die Ergebnisse sind die
                  Grundlage für die individuellen Lernvereinbarungen, die von
                  den Jugendlichen selbst verfasst werden. Nach Weihnachten
                  tauchst du in die Sprache und Zeit William Shakespeares ein
                  und kannst auch alle Theaterbesucher/-innen in diese spannende
                  Welt mitnehmen. Im Radioprojekt lernst du, selbständig eine
                  Radiosendung zu moderieren und produzieren. Den Abschluss des
                  Schuljahres bildet das „Mann-Frau-Projekt“, bei dem du dich
                  mit dem Erwachsenwerden und einem differenzierten
                  Geschlechterbild auseinander setzt.
                </p>
              </div>
            </article>

            <article className="space-y-4">
              <hgroup>
                <span
                  role="presentation"
                  className="absolute scale-[8] font-black opacity-5"
                >
                  4
                </span>
                <h1 className="text-2xl font-bold text-stone-800">4. Jahr</h1>
                <p className="font-condensed text-xl font-bold text-secondary md:text-2xl">
                  Das soziale Jahr
                </p>
              </hgroup>
              <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
                <p>
                  Hier geht es darum, alle deine Fähigkeiten, die du in drei
                  Jahren Walz entdeckt hast, bewusst in die Gruppe einzubringen.
                  In der 12. Schulstufe beginnst du bereits mit der Arbeit an
                  deiner Vorwissenschaftlichen Arbeit, und die Matura rückt in
                  greifbare Nähe. Am Ende des Jahres erlebst du in einer
                  Kunstreise in der Toskana „Kunstgeschichte hautnah“ – alle für
                  die Kunstgeschichteprüfung relevanten Sehenswürdigkeiten
                  werden vor Ort besichtigt!
                </p>
              </div>
            </article>

            <article className="space-y-4">
              <hgroup>
                <span
                  role="presentation"
                  className="absolute scale-[8] font-black opacity-5"
                >
                  5
                </span>
                <h1 className="text-2xl font-bold text-stone-800">5. Jahr</h1>
                <p className="font-condensed text-xl font-bold text-secondary md:text-2xl">
                  Der große Endspurt
                </p>
              </hgroup>
              <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
                <p>
                  Schneller als du denkst ist das letzte Walz-Jahr erreicht und
                  damit die Matura in Sicht! Zu Beginn des Jahres wird noch
                  einmal der holden Kunst gefrönt: Die zweite große Kunstreise
                  in der Walz geht nach Frankreich – wieder werden vor Ort alle
                  wichtigen Stationen und Zeitepochen für die zweite
                  Kunstgeschichteprüfung besichtigt. Als letzte Hürde vor der
                  Matura ist dann im November noch die Prüfung in der zweiten
                  lebenden Fremdsprache zu absolvieren. Für die
                  Maturavorbereitung ist selbstständiges Arbeiten unabdingbare
                  Voraussetzung: Der Stoff wird kompakt vorgetragen und die
                  Prüfungsvorbereitungen haben Universitätscharakter. Am Ende
                  des Jahres, also nach der Matura, kannst du bei der
                  Abschlussreise noch einmal zurückblicken: „Wie bin ich in die
                  Walz gekommen, was hat mich in diesen Jahren geprägt und
                  verändert?“
                </p>
              </div>
            </article>
          </div>

          <BackToTop />
        </section>
      </div>
    </div>
  )
}
