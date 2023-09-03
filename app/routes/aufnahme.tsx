import { BackToTop } from '#app/components/back-to-top.tsx'
import { Divider } from '#app/components/ui/divider.tsx'
import { Link, Outlet } from '@remix-run/react'
import { InfoIcon } from 'lucide-react'

export default function Aufnahme() {
  return (
    <div className="md:mt-12">
      <h1 className="absolute left-0 origin-top-left rotate-90 scale-[4] font-condensed text-xl font-bold text-stone-500 opacity-10">
        Aufnahme
      </h1>

      <nav className="mb-12 flex flex-col space-y-1 md:mb-16">
        <h2 className="mb-1 text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Inhalt
        </h2>
        <ol className="list-inside list-decimal space-y-1 md:list-outside">
          <li>
            <Link to="#vorgehensweise" className="text-xl font-bold">
              Vorgehensweise
            </Link>
          </li>
          <li>
            <Link to="#vorraussetzungen" className="text-xl font-bold">
              Vorraussetzungen
            </Link>
          </li>
          <li>
            <Link to="#kosten" className="text-xl font-bold">
              Kosten
            </Link>
          </li>
          <li>
            <Link to="#stipendien" className="text-xl font-bold">
              Stipendien
            </Link>
          </li>
        </ol>
      </nav>

      <div className="space-y-12 md:space-y-16">
        <div className="max-w-lg rounded-md border border-secondary/20 bg-secondary/10 p-6 text-secondary">
          <div className="mb-2 flex items-center gap-1">
            <InfoIcon size={20} />
            <span className="font-bold">Information</span>
          </div>
          <p className="leading-snug">
            Anmeldungen der Geburtsjahrgänge 2009 und 2010 für das Schuljahr
            2024/25 nehmen wir gerne bis{' '}
            <em className="not-italic underline underline-offset-2">
              24. Februar 2024
            </em>{' '}
            entgegen. Bitte senden Sie dafür das ausgefüllte Anmeldeformular an
            office@walz.at.
          </p>
        </div>

        <Divider />

        <article id="vorgehensweise" className="space-y-8">
          <h1 className="mb-8 font-condensed text-4xl font-bold text-primary">
            Vorgehensweise
          </h1>
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Der Aufnahmetag für das folgende Schuljahr findet im März statt.
              Hier haben die Jugendlichen bei einigen Übungen und persönlichen
              Gesprächen die Möglichkeit, sich mit der Arbeitsweise in der Walz
              vertraut zu machen. Im Anschluss daran treffen wir gemeinsam die
              Entscheidung, wem wir die Aufnahme in den neuen Jahrgang anbieten.
              Nach der Zusage von Seiten der Eltern und des/der Jugendlichen und
              der Einzahlung des Aufnahmebeitrags ist die Anmeldung fix.
            </p>
          </div>

          <BackToTop />
        </article>

        <Divider />

        <article id="vorraussetzungen">
          <h1 className="mb-8 font-condensed text-4xl font-bold text-primary">
            Vorraussetzungen
          </h1>
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Der Besuch der Walz beginnt mit der 9. Schulstufe, d.h.
              Jugendliche, die auf die Walz kommen möchten, müssen zum Zeitpunkt
              der Anmeldung die 8. Schulstufe besuchen und sie im selben Jahr
              positiv abschließen (keine Aufstiegsklausel).
            </p>
            <p>
              Zu den Möglichkeiten einer Aufnahme in einen bestehenden Jahrgang
              bitten wir um Kontaktaufnahme unter office@walz.at.
            </p>
          </div>

          <BackToTop />
        </article>

        <Divider />

        <article id="kosten" className="space-y-8">
          <h1 className="mb-8 font-condensed text-4xl font-bold text-primary">
            Kosten
          </h1>
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            Im Jahr 2023/2024 gelten für die Walz Wiener LernZentrum folgende
            Tarife:
            <p>
              Unterrichtsbeitrag Monatlich Der Beitrag für den Unterricht in der
              Walz beträgt 650,- EUR pro Monat und wird 12-mal von September bis
              August eingezogen.
            </p>
            <p>
              Beitrag für Sport/Bewegung/Werkstätte Der Beitrag für
              Sport/Bewegung/Werkstätte beträgt 66,- EUR pro Monat und wird
              10-mal von September bis Juni eingezogen.
            </p>
            <p>
              Projektbeitrag Der Beitrag für Reise-Projekte (außerhäusig) und
              Schwerpunkt-Projekte (innerhäusig) beträgt 780,- EUR pro Quartal
              und wird jeweils im September, Dezember, März und Juni eingezogen.
              Aufgrund der sehr individuellen Gestaltungsmöglichkeiten
              beinhaltet er nicht die Kosten für die Auslandspraktika im Land
              der ersten und zweiten Fremdsprache, die meist in den Sommer-,
              fallweise in anderen Ferien stattfinden.
            </p>
            <p>
              Essensbeitrag Das Beitrag für die Verpflegung in der Walz beträgt
              117,- EUR pro Monat und wird in 10 Monatsraten eingezogen.
            </p>
            <p>
              Aufnahmebeitrag Einmalig Der einmalige Aufnahmebeitrag beträgt
              2.600,- EUR.
            </p>
          </div>

          <BackToTop />
        </article>

        <Divider />

        <article id="stipendien" className="space-y-8">
          <h1 className="mb-8 font-condensed text-4xl font-bold text-primary">
            Stipendien
          </h1>
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Durch private Sponsoren steht der Walz ein gewisser Betrag für
              Stipendien zur Verfügung. Dieser Betrag wird auf mehrere
              Jugendliche aufgeteilt. Im Bedarfsfall kann ein Antrag (inkl.
              Einkommensnachweise und Begründung) gestellt werden.
            </p>
          </div>

          <BackToTop />
        </article>
      </div>
    </div>
  )
}
