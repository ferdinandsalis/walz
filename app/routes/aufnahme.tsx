import { Outlet } from '@remix-run/react'

export default function Curriculum() {
  return (
    <div className="mt-12 lg:mt-24">
      <h1 className="font-condensed text-xl font-bold text-primary md:text-4xl lg:text-5xl xl:text-6xl">
        Aufnahme
      </h1>
      <div className="max-w-prose">
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
        <h3 className="font-bold">Vorraussetzungen</h3>
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
        <h1 className="text-4xl">Kosten</h1>
      </section>
      <Outlet />
    </div>
  )
}
