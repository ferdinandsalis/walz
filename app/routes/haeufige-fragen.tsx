import { Link } from '@remix-run/react'
import { BackToTop } from '#app/components/back-to-top.tsx'
import { Divider } from '#app/components/ui/divider.js'

export default function Faq() {
  return (
    <div className="relative grid grid-cols-subgrid items-start gap-8 text-balance lg:col-span-2">
      <h1 className="font-condensed text-h1 font-bold text-muted-foreground opacity-20">
        Häufige Fragen
      </h1>
      <div className="col-start-1 grid grid-cols-1 gap-16 text-balance md:text-body-md">
        <article id="was-heisst-eigentlich-walz" className="grid gap-8">
          <Link to=".#was-heisst-eigentlich-walz">
            <h2 className="font-condensed text-h2 font-bold text-primary">
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

        <Divider />

        <article
          id="wieso-gibt-es-externistenpruefungen"
          className="grid gap-8"
        >
          <Link to=".#wieso-gibt-es-externistenpruefungen">
            <h2 className="font-condensed text-h2 font-bold text-primary">
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

        <Divider />

        <article
          id="warum-ist-die-walz-smartphone-freie-zone"
          className="grid gap-8"
        >
          <Link to=".#warum-ist-die-walz-smartphone-freie-zone">
            <h2 className="font-condensed text-h2 font-bold text-primary">
              Warum ist die Walz Smartphone-freie Zone?
            </h2>
          </Link>
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Jonathan Haidt beschreibt in seinem Buch Generation Angst, dass
              übermäßiger Smartphone-Gebrauch besonders bei jungen Menschen zu
              Einsamkeit, sozialer Isolation und erhöhter Angst führen kann (
              <Link
                to="https://www.theatlantic.com/technology/archive/2024/03/teen-childhood-smartphone-use-mental-health-effects/677722/"
                target="_blank"
                className="underline underline-offset-2"
              >
                The Atlantic Artikel zum Buch
              </Link>
              ). Die Weltgesundheitsorganisation (WHO) warnt sogar, dass mehr
              als 10 Prozent der Jugendlichen an Smartphone-Sucht leiden. Um dem
              entgegenzuwirken, ist die Walz seit 2017 eine Smartphone-freie
              Zone. Dies hilft, das Gefühl von FOMO (Fear of Missing Out) zu
              vermeiden, da niemand während der Pausen sein Handy nutzt. Ein
              weiteres Ziel ist es, die Aufmerksamkeitsspanne der Schüler:innen
              zu verbessern, da sie sich ohne ständige Ablenkung besser
              konzentrieren können – eine wesentliche Fähigkeit, um die Matura
              erfolgreich zu bestehen. Besonders im Jugendalter ist die
              Peer-Group von großer Bedeutung. In einer Smartphone-freien
              Umgebung lernen die Schüler:innen, sozial zu sein und echte,
              zwischenmenschliche Kommunikation zu pflegen, was für ihre soziale
              und emotionale Entwicklung entscheidend ist.
            </p>
          </div>
        </article>

        <Divider />

        <article id="wie-kann-ich-die-walz-kennenlernen" className="grid gap-8">
          <Link to=".#wie-kann-ich-die-walz-kennenlernen">
            <h2 className="font-condensed text-h2 font-bold text-primary">
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
              Jährlich entsteht das{' '}
              <Link to="/boty/" className="underline underline-offset-2">
                Book of the Year
              </Link>{' '}
              mit Erfahrungsberichten, ausgewählten Fotos und vielem mehr. Zum
              Durchblättern schicken wir dir auch gerne gegen einen
              Unkostenbeitrag eines oder mehrere per Post zu. Dafür schicke uns
              eine Mail an{' '}
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

        <Divider />

        <article id="was-kostet-die-walz" className="grid gap-8">
          <Link to=".#was-kostet-die-walz">
            <h2 className="font-condensed text-h2 font-bold text-primary">
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
