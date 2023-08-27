import { Outlet } from '@remix-run/react'

export default function Curriculum() {
  return (
    <div className="mt-12 space-y-12 lg:mt-24">
      <h1 className="font-condensed text-xl font-bold text-primary md:text-4xl lg:text-5xl xl:text-6xl">
        Aufnahme
      </h1>
      <p className="max-w-prose">
        Anmeldungen der Geburtsjahrgänge 2009 und 2010 für das Schuljahr 2024/25
        nehmen wir gerne bis 24. Februar 2024 entgegen. Bitte senden Sie dafür
        das ausgefüllte Anmeldeformular an office@walz.at.
      </p>
      <div className="max-w-prose space-y-4">
        <h2 className="text-xl font-bold">Wie funktioniert die Aufnahme?</h2>
        <p>
          Der Aufnahmetag für das folgende Schuljahr findet im März statt. Hier
          haben die Jugendlichen bei einigen Übungen und persönlichen Gesprächen
          die Möglichkeit, sich mit der Arbeitsweise in der Walz vertraut zu
          machen. Im Anschluss daran treffen wir gemeinsam die Entscheidung, wem
          wir die Aufnahme in den neuen Jahrgang anbieten. Nach der Zusage von
          Seiten der Eltern und des/der Jugendlichen und der Einzahlung des
          Aufnahmebeitrags ist die Anmeldung fix.
        </p>
        <h1 className="mb-8 font-condensed text-4xl font-bold text-secondary">
          Vorraussetzungen
        </h1>
        <p>
          Der Besuch der Walz beginnt mit der 9. Schulstufe, d.h. Jugendliche,
          die auf die Walz kommen möchten, müssen zum Zeitpunkt der Anmeldung
          die 8. Schulstufe besuchen und sie im selben Jahr positiv abschließen
          (keine Aufstiegsklausel).
        </p>
        <p>
          Zu den Möglichkeiten einer Aufnahme in einen bestehenden Jahrgang
          bitten wir um Kontaktaufnahme unter office@walz.at.
        </p>
      </div>
      <section>
        <h1 className="mb-8 font-condensed text-4xl font-bold text-secondary">
          Kosten
        </h1>
        <div className="max-w-prose">
          Im Jahr 2023/2024 gelten für die Walz Wiener LernZentrum folgende
          Tarife:
          <div>
            Unterrichtsbeitrag Monatlich Der Beitrag für den Unterricht in der
            Walz beträgt 650,- EUR pro Monat und wird 12-mal von September bis
            August eingezogen.
          </div>
          <div>
            Beitrag für Sport/Bewegung/Werkstätte Der Beitrag für
            Sport/Bewegung/Werkstätte beträgt 66,- EUR pro Monat und wird 10-mal
            von September bis Juni eingezogen.
          </div>
          <div>
            Projektbeitrag Der Beitrag für Reise-Projekte (außerhäusig) und
            Schwerpunkt-Projekte (innerhäusig) beträgt 780,- EUR pro Quartal und
            wird jeweils im September, Dezember, März und Juni eingezogen.
            Aufgrund der sehr individuellen Gestaltungsmöglichkeiten beinhaltet
            er nicht die Kosten für die Auslandspraktika im Land der ersten und
            zweiten Fremdsprache, die meist in den Sommer-, fallweise in anderen
            Ferien stattfinden.
          </div>
          <div>
            Essensbeitrag Das Beitrag für die Verpflegung in der Walz beträgt
            117,- EUR pro Monat und wird in 10 Monatsraten eingezogen.
          </div>
          <div>
            <p>
              Aufnahmebeitrag Einmalig Der einmalige Aufnahmebeitrag beträgt
              2.600,- EUR.
            </p>
          </div>
          <article>
            <h1>Stipendien</h1>
            <p>
              Durch private Sponsoren steht der Walz ein gewisser Betrag für
              Stipendien zur Verfügung. Dieser Betrag wird auf mehrere
              Jugendliche aufgeteilt. Im Bedarfsfall kann ein Antrag (inkl.
              Einkommensnachweise und Begründung) gestellt werden.
            </p>
          </article>
        </div>
      </section>
      <Outlet />
    </div>
  )
}
