import { BackToTop } from '#app/components/back-to-top.tsx'
import { Divider } from '#app/components/ui/divider.tsx'
import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [{ title: 'Curriculum | Walz' }]
}

export default function Curriculum() {
  return (
    <div className="text-balance md:mt-12">
      <h1 className="absolute left-0 origin-top-left rotate-90 scale-[4] font-condensed text-xl font-bold text-stone-500 opacity-10">
        Curriculum
      </h1>

      <div id="in-jahren" className="space-y-8">
        <div className="space-y-8 divide-y divide-muted md:space-y-12">
          <article className="space-y-4 pt-4">
            <hgroup>
              <span
                role="presentation"
                className="absolute scale-[8] font-black opacity-5"
              >
                1
              </span>
              <h1 className="text-2xl font-bold text-primary">1. Jahr</h1>
              <p className="font-condensed text-xl font-bold text-secondary md:text-2xl">
                Timeout und Ausprobieren
              </p>
            </hgroup>
            <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
              <p>
                Gute Nachrichten für alle, die nach 8 Jahren Schulbank genug
                haben! Die Walz beginnt mit einem „Time-Out“ von der Schule – du
                lernst neue Lebenswelten kennen und kannst außerhalb des
                traditionellen Schulalltags verschiedenste Fertigkeiten
                erlernen. Die praktischen Erfahrungen auf dem Bauernhof, im
                Forst und in diversen Handwerksbetrieben werden später
                aufgearbeitet und bereiten dich auch auf die
                Externistenprüfungen in den folgenden Jahren vor.
              </p>
            </div>
          </article>

          <article className="space-y-4 pt-4">
            <hgroup>
              <span
                role="presentation"
                className="absolute scale-[8] font-black opacity-5"
              >
                2
              </span>
              <h1 className="text-2xl font-bold text-primary">2. Jahr</h1>
              <p className="font-condensed text-xl font-bold text-secondary md:text-2xl">
                Auslandsabenteuer und erste Prüfungen
              </p>
            </hgroup>
            <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
              <p>
                Es wird ernst, die ersten Prüfungen stehen an! Zusätzlich fahrt
                ihr in diesem Jahr als ganze Gruppe nach Irland. Dort kannst du
                an diversen Arbeitsplätzen (z.B. kleine Handwerksbetriebe,
                Hotels, etc.) deine Englischkenntnisse verbessern und Land und
                Leute kennenlernen. Im Winter geht’s ins Kühtai zum Tourengehen
                und im Frühling findet in St. Margarethen unser erstes
                Kunstprojekt außer Haus statt: Steinhauen.
              </p>
            </div>
          </article>

          <article className="space-y-4 pt-4">
            <hgroup>
              <span
                role="presentation"
                className="absolute scale-[8] font-black opacity-5"
              >
                3
              </span>
              <h1 className="text-2xl font-bold text-primary">3. Jahr</h1>
              <p className="font-condensed text-xl font-bold text-secondary md:text-2xl">
                Ein facettenreiches Jahr
              </p>
            </hgroup>
            <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
              <p>
                Bei der eintägigen Potentialanalyse werden unter Anleitung
                erfahrener Beobachter:innen die eigenen Stärken und
                Entwicklungsfelder analysiert – die Gespräche sind die Grundlage
                für deine individuelle Lernvereinbarung. Im Frühling tauchst du
                in die Sprache und Zeit William Shakespeares ein und kannst auch
                alle Theaterbesucher:innen in diese spannende Welt mitnehmen. Im
                Radioprojekt lernst du selbständig eine Radiosendung moderieren
                und produzieren. Den Abschluss des Jahres bildet das
                „Mann-Frau-Projekt“. Dort setzt du dich mit dem Erwachsenwerden
                und einem differenzierten Geschlechterbild auseinander.
              </p>
            </div>
          </article>

          <article className="space-y-4 pt-4">
            <hgroup>
              <span
                role="presentation"
                className="absolute scale-[8] font-black opacity-5"
              >
                4
              </span>
              <h1 className="text-2xl font-bold text-primary">4. Jahr</h1>
              <p className="font-condensed text-xl font-bold text-secondary md:text-2xl">
                Das soziale Jahr
              </p>
            </hgroup>
            <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
              <p>
                Das Schuljahr startet mit einem Projekt, bei dem du mit unserem
                Theaterpädagogen daran arbeitest, wie du deine individuellen
                Stärken, die du in drei Jahren Walz entwickelt hast, bewusst in
                die Gruppe einbringen kannst. Beim Sozialprojekt um Ostern geht
                es unter anderem darum, diese Fähigkeiten weiterzugeben, sich
                einzubringen und einen positiven Beitrag zu leisten. Im Frühling
                erlebst du in der Toskana „Kunstgeschichte hautnah“ und trittst
                damit gut vorbereitet zur Prüfung im Fach Bildnerisches
                Gestalten und Werken an. Am Ende des Schuljahres beginnst du mit
                deiner Vorwissenschaftlichen Arbeit: du konkretisierst dein
                Thema und legst die Literaturliste fest.
              </p>
            </div>
          </article>

          <article className="space-y-4 pt-4">
            <hgroup>
              <span
                role="presentation"
                className="absolute scale-[8] font-black opacity-5"
              >
                5
              </span>
              <h1 className="text-2xl font-bold text-primary">5. Jahr</h1>
              <p className="font-condensed text-xl font-bold text-secondary md:text-2xl">
                Der große Endspurt
              </p>
            </hgroup>
            <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
              <p>
                Schneller als du denkst ist das letzte Walz-Jahr erreicht und
                damit die Matura in Sicht! Zu Beginn des Jahres wird noch einmal
                der Kunst gefrönt: Die letzte große Kunstreise in der Walz geht
                nach Frankreich –wichtige Stationen und Kunstwerke werden für
                die Kunstgeschichteprüfung besichtigt, besprochen und teilweise
                in Eigeninterpretation gemalt. Als letzte Hürde vor der Matura
                ist im November die Prüfung in der zweiten lebenden Fremdsprache
                zu absolvieren. Für die folgende Maturavorbereitung ist
                selbstständiges Arbeiten unabdingbare Voraussetzung: Der Stoff
                wird kompakt vorgetragen und die Prüfungsvorbereitungen haben
                Universitätscharakter. Bei der Abschlussreise kannst du noch
                einmal zurückblicken: „Wie bin ich in die Walz gekommen, was hat
                mich in diesen Jahren geprägt und verändert?“
              </p>
            </div>
          </article>
        </div>

        <BackToTop />
      </div>
    </div>
  )
}

function UnusedSections() {
  return (
    <>
      <section id="projekte" className="space-y-8">
        <h1 className="font-condensed text-2xl font-bold text-primary md:text-4xl">
          Projekte
        </h1>
        <div className="max-w-prose space-y-4 text-base md:text-xl">
          <p>
            Zwischen den einzelnen Prüfungsvorbereitungen finden in der Walz
            zahlreiche Projekte, zum Teil auch außer Haus, statt. Viele stellen
            einen praktischen Bezug zum Lernstoff her, beispielsweise fahren die
            Jugendlichen in den Forst. Dort wird der Biologie-Prüfungsstoff in
            der Natur erlebt und anschließend für die Prüfung aufgearbeitet.
          </p>
          <p>
            Andere Projekte, wie das Autonomietraining, dienen dazu,
            unterschiedliche Themen der Persönlichkeitsentwicklung aufzugreifen.
            Bei diversen Aufenthalten im Ausland können die Jugendlichen all
            ihre erworbenen Fähigkeiten praktisch anwenden. So werden
            gleichzeitig fachliche und soziale Kompetenzen entwickelt.
          </p>
          <p>
            Das genaue Programm der verschiedenen Schulstufen orientiert sich am
            jeweiligen Lebensalter der Jugendlichen und den damit verbundenen
            Fragen.
          </p>
        </div>

        <BackToTop />
      </section>

      <section id="unterricht" className="space-y-8">
        <h1 className="font-condensed text-2xl font-bold text-primary md:text-4xl">
          Unterricht
        </h1>
        <div className="max-w-prose space-y-4 text-base md:text-xl">
          <p>
            Die Walz bietet eine fünfjährige Bildungslaufbahn, die mit der
            Matura abschließt. Unsere Prüfungen sind extern und decken den
            Lehrstoff von zwei bis vier Jahren ab. Als Prüfungsschule dient das
            Bundesoberstufenrealgymnasium 3, gelegen in der Landstraßer
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
              für Fächer wie Biologie und Geografie. Diese intensiven Lernphasen
              dauern in der Regel 6–8 Wochen und werden mit einer extern
              abgelegten Prüfung abgeschlossen. Kernfächer wie Mathematik,
              Deutsch und Fremdsprachen ziehen sich durch die ganze Walz-Zeit.
              Vor den Prüfungen gibt es zusätzlich eine intensive
              Vorbereitungszeit, damit die Jugendlichen bestens vorbereitet
              antreten können.
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
              Oberstufenrealgymnasiums mit Bildnerischem Gestalten und
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
    </>
  )
}
