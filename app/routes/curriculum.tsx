import { BackToTop } from '#app/components/back-to-top.tsx'
import { Divider } from '#app/components/ui/divider.tsx'
import { Link } from '@remix-run/react'

export default function Curriculum() {
  return (
    <div className="md:mt-12">
      <h1 className="absolute left-0 origin-top-left rotate-90 scale-[4] font-condensed text-xl font-bold text-stone-500 opacity-10">
        Curriculum
      </h1>

      <nav className="mb-12 flex flex-col space-y-1 md:mb-16">
        <h2 className="mb-1 text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Inhalt
        </h2>
        <ol className="list-inside list-decimal space-y-1 md:list-outside">
          <li>
            <Link to="#unterricht" className="text-xl font-bold">
              Unterricht
            </Link>
          </li>
          <li>
            <Link to="#projekte" className="text-xl font-bold">
              Projekte
            </Link>
          </li>
          <li>
            <Link to="#in-jahren" className="text-xl font-bold">
              In Jahren
            </Link>
          </li>
        </ol>
      </nav>

      <div className="space-y-12 md:space-y-16">
        <Divider />

        <section id="unterricht" className="space-y-8">
          <h1 className="font-condensed text-2xl font-bold text-primary md:text-4xl">
            Unterricht
          </h1>
          <div className="max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Die Walz dauert in der Regel fünf Jahre (9.–13. Schulstufe) und
              schließt mit Matura ab. Die Prüfungen werden extern über den Stoff
              von 2 Jahren abgelegt, die Prüfungsschule der Walz ist das
              Bundesober&shy;stufen&shy;real&shy;gymnasium (BORg) 3 in der
              Landstraßer Hauptstraße 70.
            </p>
            <p>
              Unterrichtet wird in der Walz von Montag bis Freitag, 8:30 bis
              16:30 Uhr. Es gibt geblockte Prüfungsvorbereitungen (wie z.B.
              Biologie, Geografie, etc.), die in der Regel 6–8 Wochen dauern und
              anschließend geprüft werden. Die Prüfungsvorbereitung in den
              durchlaufenden Gegenständen (Mathematik, Deutsch, Englisch, 2.
              Fremdsprache) geht über mehrere Jahre; auch hier wird nach einer
              intensiveren Lernphase die Prüfung abgelegt.
            </p>
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
                  <div className="relative flex items-center justify-between gap-2 overflow-hidden">
                    <span className="text-primary">1.</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      9. Schulstufe
                    </span>
                  </div>
                </th>
                <td>
                  <div>keine</div>
                </td>
              </tr>
              <tr>
                <th>
                  <div className="relative flex items-center justify-between gap-2 overflow-hidden">
                    <span className="text-primary">2.</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      10. Schulstufe
                    </span>
                  </div>
                </th>
                <td>
                  <div>fünf Prüfungen über 5./6. Klasse AHS </div>
                </td>
              </tr>
              <tr>
                <th>
                  <div className="relative flex items-center justify-between gap-2 overflow-hidden">
                    <span className="text-primary">3.</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      11. Schulstufe
                    </span>
                  </div>
                </th>
                <td rowSpan={3}>
                  <div>übrige Zulassungsprüfungen und Matura </div>
                </td>
              </tr>
              <tr>
                <th>
                  <div className="relative flex items-center justify-between gap-2 overflow-hidden">
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
                  <div className="relative flex items-center justify-between gap-2 overflow-hidden">
                    <span className="text-primary">5.</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      13. Schulstufe
                    </span>
                  </div>
                </th>
                <td></td>
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
              stellen einen praktischen Bezug zum Lernstoff dar, so wird z.B.
              der Biologie-Prüfungsstoff zu einem großen Teil in der Natur
              erlebt und anschließend für die Prüfung aufgearbeitet (z.B. im
              Forst)
            </p>
            <p>
              Andere Projekte, wie z.B. das Autonomietraining sind dazu da,
              speziellere Themen der Persönlichkeitsentwicklung aufzugreifen.
              Bei den verschiedenen Auslandsreisen und Praktika im Ausland
              können die Jugendlichen all Ihre erworbenen Fähigkeiten praktisch
              anwenden. So werden gleichzeitig fachliche und soziale Kompetenzen
              entwickelt.
            </p>
            <p>
              Das genaue Programm der verschiedenen Schulstufen orientiert sich
              am jeweiligen Lebensalter der Jugendlichen und den damit
              verbundenen Fragen.
            </p>
          </div>
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
                <p className="font-bold text-secondary md:text-xl">
                  Praktische Erfahrungen
                </p>
              </hgroup>
              <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
                <p>
                  Gute Nachrichten für alle, die nach 8 Jahren Schulbank genug
                  haben! Die Walz beginnt mit einem "Time-Out" von der Schule –
                  hier lernst du neue und andere Lebenswelten kennen und kannst
                  außerhalb des traditionellen Schulalltags verschiedenste
                  Fertigkeiten erlernen. Die praktischen Erfahrungen auf dem
                  Bauernhof, im Forst und vom Wasserprojekt werden später
                  aufgearbeitet und sind gleichzeitig Prüfungsstoff für die
                  ersten Externistenprüfungen in der 10. Schulstufe.
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
                <p className="font-bold text-secondary md:text-xl">
                  Bei einer Gastfamilie
                </p>
              </hgroup>
              <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
                <p>
                  Es wird ernst! Die ersten Prüfungen stehen an! Im
                  Förder-Assessment-Center werden unter Anleitung erfahrener
                  Beobachter die eigenen Stärken und Schwächen analysiert –
                  diese Ergebnisse sind die Grundlage für die individuellen
                  Lernvereinbarungen, die von den Jugendlichen selbst verfasst
                  werden. Der erste Auslandsaufenthalt führt euch als ganze
                  Gruppe nach Penzance. Dort kannst du an einem Arbeitsplatz
                  deiner Wahl ( z.B. Second-Hand-Shops, Kindergarten, etc.)
                  deine Englischkenntnisse verbessern.
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
                <p className="font-bold text-secondary md:text-xl">
                  Theater, Radio und Toskana
                </p>
              </hgroup>
              <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
                <p>
                  Geisteswissenschaften pur … im Mythentheater geht es auf eine
                  spannende und groß inszenierte Reise zu verschiedenen
                  Archetypen der Kulturgeschichte. Nach Weihnachten tauchst du
                  in die Sprache und Zeit William Shakespeares ein und kannst
                  auch alle Theaterbesucher/-innen in diese spannende Welt
                  mitnehmen. Im Radioprojekt lernst du, selbständig eine
                  Radiosendung zu moderieren und produzieren. Am Ende des Jahres
                  erlebst du in einer Kunstreise in der Toskana „Kunstgeschichte
                  hautnah“ – alle für die Kunstgeschichteprüfung relevanten
                  Sehenswürdigkeiten werden vor Ort besichtigt!
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
                <p className="font-bold text-secondary md:text-xl">
                  Eigene Fähigkeiten auch anderen zur Verfügung stellen
                </p>
              </hgroup>
              <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
                <p>
                  Das „soziale“ Jahr – hier geht es darum, alle deine
                  Fähigkeiten, die du in drei Jahren w@lz entdeckt hast, bewusst
                  in die Gruppe einzubringen. Im Sozialpraktikum im
                  englischsprachigen Ausland kannst du all deine bisher
                  gemachten Erfahrungen an andere weitergeben – so z.B. im
                  Masibambane College in Südafrika! In der 12. Schulstufe werden
                  auch bereits die ersten Prüfungen über den Stoff der 7. und 8.
                  Klasse absolviert, und die Matura rückt in greifbare Nähe.
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
                <p className="font-bold text-secondary md:text-xl">
                  Der große Endspurt
                </p>
              </hgroup>
              <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
                <p>
                  Schneller als du denkst ist das letzte w@lz-Jahr erreicht und
                  damit die Matura in Sicht! Zu Beginn des Jahres wird noch
                  einmal der holden Kunst gefröhnt: Die zweite große Kunstreise
                  in der w@lz geht nach Frankreich - auch dort werden vor Ort
                  alle wichtigen Station und Zeitepochen für die
                  Kunstgeschichteprüfung besichtigt. Für die restlichen
                  Prüfungs- und die Maturavorbereitung ist selbstständiges
                  Arbeiten unabdingbare Voraussetzung: Der Stoff wird kompakt
                  vorgetragen und die Prüfungsvorbereitungen haben
                  Universitätscharakter. Am Ende des Jahres, also nach der
                  Matura kannst du bei der Abschlussreise noch einmal
                  zurückblicken: "Wie bin ich in die w@lz gekommen, was hat mich
                  in diesen Jahren geprägt und verändert?"
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
