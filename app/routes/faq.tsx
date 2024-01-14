import { BackToTop } from '#app/components/back-to-top.tsx'
import { Link } from '@remix-run/react'

export default function Faq() {
  return (
    <div className="hyphens-auto text-pretty md:mt-8">
      <h1 className="absolute left-0 origin-top-left rotate-90 scale-[4] font-condensed text-xl font-bold text-stone-500 opacity-10">
        Häufige Fragen
      </h1>

      <div className="grid gap-12">
        <article id="was-unterscheidet-die-walz">
          <Link to=".#was-unterscheidet-die-walz">
            <h2 className="mb-2 font-condensed text-2xl font-bold text-primary">
              Was unterscheidet die Walz von einer klassischen Oberstufe?
            </h2>
          </Link>
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            <h3 className="font-condensed font-bold text-secondary">
              Tagesablauf
            </h3>
            <p>
              Ganztagsschule: Der Unterricht findet zwischen 08:30 und 16:30 in
              vier 90 Minuten Einheiten statt. Nach der ersten Einheit gibt es
              30 Minuten Pause, nach der zweiten Einheit 60 Minuten Mittagspause
              und nach der dritten Einheit wieder 30 Minuten Pause. Die Pausen
              geben den Jugendlichen Zeit für soziale Interaktion, gleichzeitig
              bieten sie genügend Zeit für Entwicklungsgespräche sowie Raum für
              inhaltliche Fragen und sonstige Anliegen.
            </p>
            <h3 className="font-condensed font-bold text-secondary">
              Projektbasiertes Lernen
            </h3>
            <p>
              Intensive Lernzeiten (Prüfungsvorbereitungen) wechseln mit
              Projekten ab, die unter anderem soziale, kreative,
              gruppenbildende, sprachfördernde Schwerpunkte haben. In der Walz
              werden nicht nur die intellektuellen Fähigkeiten geschult, es geht
              darum, den ganzen Menschen zu sehen und zu ermöglichen, dass die
              Jugendlichen ihre vielfältigen eigenen Fähigkeiten kennenlernen
              und ausbilden.
            </p>
            <h3 className="font-condensed font-bold text-secondary">
              Externe Prüfungen
            </h3>
            <p>
              Der Unterricht der einzelnen Fächer findet geblockt statt: Etwa 2
              Einheiten pro Tag während einiger Wochen - danach findet die
              Prüfung über den gemeinsam erarbeiteten Stoff in der
              Prüfungsschule statt. Wesentlich ist die Trennung von
              Unterrichtenden und Prüfenden. Wiederholung der einzelnen
              Prüfungen ist 3x möglich, die Jugendlichen verbleiben ihre gesamte
              Walz-Zeit im Jahrgangsverband.
            </p>
            <h3 className="font-condensed font-bold text-secondary">
              Reisen/Projekte außer Haus
            </h3>
            <p>
              Die Jugendlichen sind „auf der Walz“- In den fünf Jahren finden
              ca. 16 Projekte außerhalb der Walz statt.
            </p>
            <h3 className="font-condensed font-bold text-secondary">
              Theater- und Kunstschwerpunkt zur Persönlichkeitsentwicklung
            </h3>
            <p>
              Jedes Jahr gibt es mindestens ein Theaterprojekt pro Jahrgang,
              welches auch öffentlich aufgeführt wird. Die vielen Kunstprojekte,
              sowohl praktisch als auch theoretisch, dienen der Schulung der
              ästhetischen Wahrnehmung und dem Erlernen einer künstlerischen
              Ausdrucksfähigkeit.
            </p>
            <h3 className="font-condensed font-bold text-secondary">
              Mentoring/Persönlichkeitsentwicklung
            </h3>
            <p>
              Der/die Mentor:in begleitet die Jugendlichen jeweils eines
              Jahrganges über ihre gesamte Walzzeit. Jeder Jahrgang hat einen
              identifikationsbildenden Namen, i.e. griechischer Buchstabe. Die
              Mentor:innen sehen sich als Entwicklungsbegleiter:innen.
              Angeleitet durch den/die Mentor:in reflektieren die Jugendlichen
              sowohl im Klassenverband als auch einzeln laufende und
              abgeschlossene Projekte.
            </p>
          </div>
        </article>

        <article id="was-heisst-eigentlich-walz">
          <Link to=".#was-heisst-eigentlich-walz">
            <h2 className="mb-2 font-condensed text-2xl font-bold text-primary">
              Was heißt eigentlich Walz?
            </h2>
          </Link>
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Walz ist das mittelalterliche Gesellenwandern, die Tradition,
              einige Jahre in die Fremde zu reisen, dort zu arbeiten, um die
              eigenen Kenntnisse und Fähigkeiten zu erweitern. Vom 16. bis zum
              19. Jahrhundert war die Wanderpflicht eine Vorbedingung für die
              Zulassung zur Meisterprüfung. Dieses Lernen und Arbeiten wollen
              wir ins 21. Jahrhundert holen.
            </p>
          </div>
        </article>

        <article id="wieso-gibt-es-externistenpruefungen">
          <Link to=".#wieso-gibt-es-externistenpruefungen">
            <h2 className="mb-2 font-condensed text-2xl font-bold text-primary">
              Wieso gibt es Externistenprüfungen?
            </h2>
          </Link>
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Die Walz hat ein Öffentlichkeitsrecht, warum den Aufwand
              betreiben, die Leistungsbeurteilung extern durchzuführen?
            </p>
            <p>
              Ein wichtiges Prinzip der Walz ist es, dass die Personalunion von
              Vorbereitenden und Prüfenden aufgehoben ist. In keiner Sportart
              ist bei einem Turnier der/die Trainer:in auch der/die
              Schiedsrichter:in, oder?
            </p>
            <p>
              Die Externistenprüfungen erfüllen darüber hinaus auch einen
              anderen Zweck. Vordergründig geht es bei Prüfungen um die
              Beherrschung des Stoffs; die Überprüfung soll möglichst objektiv
              ablaufen – das Argument „Der/die mag mich nicht“ wird entkräftet.
              Zusätzlich bereitet dieser Modus auf eine mögliche Uni-Karriere
              vor. Um sich das umfangreiche Wissen eines Gegenstandes aneignen
              zu können, steht ein Fach geblockt auf dem Stundenplan. In einer
              intensiven Unterrichtsphase werden verschiedene Themengebiete
              durchgenommen, wobei je nach Fach der Stoff von zwei bis vier
              Jahren behandelt und erarbeitet wird. Bei der externen Prüfung
              müssen die Jugendlichen dann beweisen, dass sie den Stoff im
              gesamten Umfang beherrschen.
            </p>
          </div>
        </article>

        <article id="wie-kann-ich-die-walz-kennenlernen">
          <Link to=".#wie-kann-ich-die-walz-kennenlernen">
            <h2 className="mb-2 font-condensed text-2xl font-bold text-primary">
              Wie kann ich die Walz kennenlernen?
            </h2>
          </Link>
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Einmal im Jahr findet unser Tag der offenen Tür statt. Hier werden
              Projekte vorgestellt, es gibt Mitmach-Stationen und man kann sich
              von Walzist:innen durch die Schule führen lassen.
            </p>
            <p>
              Bei den Informationsabenden gibt es für interessierte Eltern und
              Jugendliche die Möglichkeit, sich über die Walz, das Programm und
              die Kosten zu informieren und sich für den Aufnahmetag anzumelden.
            </p>
            <p>
              Jeder Jahrgang bereitet mindestens einmal pro Jahr ein
              Theaterstück vor. Die Aufführungen sind öffentlich und eine
              wunderbare Gelegenheit, die Walz von einer anderen Seite
              kennenzulernen!
            </p>
            <p>
              Jährlich entsteht das Book of the Year mit Erfahrungsberichten,
              ausgewählten Fotos und vielem mehr. Zum Durchblättern schicken wir
              dir auch gerne gegen einen Unkostenbeitrag eines oder mehrere per
              Post zu. Dafür schicke uns eine Mail an
              <a
                href="mailto:info@walz.at"
                className="underline underline-offset-2"
              >
                info@walz.at
              </a>
              .
            </p>
            <p>
              Alle Termine findest du{' '}
              <Link
                to="/aktuelles#termine"
                className="underline underline-offset-2"
              >
                hier
              </Link>
              .
            </p>
          </div>
        </article>

        <article id="was-kostet-die-walz">
          <Link to=".#was-kostet-die-walz">
            <h2 className="mb-2 font-condensed text-2xl font-bold text-primary">
              Was kostet die Walz?
            </h2>
          </Link>
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Die Walz finanziert sich zu einem großen Teil selbst. Daher müssen
              wir Schulgeld einheben. Eine Aufschlüsselung findest du{' '}
              <Link
                to="/aufnahme#kosten"
                className="underline underline-offset-2"
              >
                hier
              </Link>
              . Durch private Sponsoren steht der Walz ein gewisser Betrag für
              Stipendien zur Verfügung. Dieser Betrag wird auf mehrere
              Jugendliche aufgeteilt. Im Bedarfsfall kann ein Antrag (inkl.
              Einkommensnachweise und Begründung) gestellt werden.
            </p>
          </div>
        </article>

        <BackToTop />
      </div>
    </div>
  )
}
