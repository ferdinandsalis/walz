import { Outlet } from '@remix-run/react'

export default function Curriculum() {
  return (
    <div className="mt-12 lg:mt-24">
      <h1 className="font-condensed text-xl font-bold text-primary md:text-4xl lg:text-5xl xl:text-6xl">
        Curriculum
      </h1>
      <div>
        <div>
          <h1>Unterricht &amp; Projekte</h1>
          <p>
            <strong>Unterricht</strong>
          </p>
          <p>
            Die w@lz&nbsp; dauert in der Regel fünf Jahre (9. - 13. Schulstufe)
            und schließt mit Matura ab. Die Prüfungen werden extern über den
            Stoff von 2 Jahren abgelegt, die Prüfungsschule der w@lz ist das
            Bundesoberstufenrealgymnasium (BORg) 3 in der Landstraßer
            Hauptstraße 70.
          </p>
          <p>
            Unterrichtet wird in der w@lz von Montag bis Freitag, 8:30 bis 16:30
            Uhr. Es gibt geblockte Prüfungsvorbereitungen (wie z.B. Biologie,
            Geografie, etc.), die in der Regel 6-8 Wochen dauern und
            anschließend geprüft werden. Die Prüfungsvorbereitung in den
            durchlaufenden Gegenständen (Mathematik, Deutsch, Englisch, 2.
            Fremdsprache) geht über mehrere Jahre; auch hier wird nach einer
            intensiveren Lernphase die Prüfung abgelegt.
          </p>
          <table border="1" cellpadding="1" cellspacing="1">
            <tbody>
              <tr>
                <td align="center">
                  <strong>1. w@lz-Jahr </strong>9. Schulstufe
                </td>
                <td align="center">
                  <strong>2. w@lz-Jahr</strong> 10. Schulstufe
                </td>
                <td align="center">
                  <strong>3. w@lz-Jahr </strong>11. Schulstufe
                </td>
                <td align="center">
                  <strong>4. w@lz-Jahr </strong>12. Schulstufe
                </td>
                <td align="center">
                  <strong>5. w@lz-Jahr </strong>13. Schulstufe
                </td>
              </tr>
              <tr>
                <td align="center">keine Prüfungen</td>
                <td align="center">fünf Prüfungen über 5./6. Klasse AHS</td>
                <td align="center" colSpan="3">
                  übrige Zulassungsprüfungen und Matura
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            <strong>Projekte</strong>
          </p>
          <p>
            Zwischen den einzelnen Prüfungsvorbereitungen finden in der w@lz
            viele Projekte, zum Teil auch außer Haus, statt. Manche Projekte
            stellen einen praktischen Bezug zum Lernstoff dar, so wird z.B. der
            Biologie-Prüfungsstoff zu einem großen Teil in der Natur erlebt und
            anschließend für die Prüfung aufgearbeitet (z.B. im Forst)
          </p>
          <p>
            Andere Projekte, wie z.B. das Autonomietraining sind dazu da,
            speziellere Themen der Persönlichkeitsentwicklung aufzugreifen. Bei
            den verschiedenen Auslandsreisen und Praktika im Ausland können die
            Jugendlichen all Ihre erworbenen Fähigkeiten praktisch anwenden. So
            werden gleichzeitig fachliche und soziale Kompetenzen entwickelt.
          </p>
          <p>
            Das genaue Programm der verschiedenen Schulstufen orientiert sich am
            jeweiligen Lebensalter der Jugendlichen und den damit verbundenen
            Fragen.
          </p>
          <p>
            <a href="/index.php/unterricht-und-projekte/1-w-lz-jahr-9-schulst">
              <span>1. w@lz-Jahr (09. Schuljahr)</span>{' '}
            </a>
            <br /> Im ersten w@lz-Jahr stehen praktische Erfahrungen im
            Vordergrund...
          </p>
          <p>
            <a href="/index.php/unterricht-und-projekte/2-w-lz-jahr-10-schulst">
              2. w@lz-Jahr (10. Schulstufe)
            </a>{' '}
            <br /> Erste Prüfungen und das erste Mal bei einer Gastfamilie im
            Ausland...
          </p>
          <p>
            <a href="/index.php/unterricht-und-projekte/3-w-lz-jahr-11-schulst">
              3. w@lz-Jahr (11. Schulstufe)
            </a>{' '}
            <br /> Theater, Radio und Toskana... und das alles innerhalb eines
            Schuljahres?
          </p>
          <p>
            <a href="/index.php/unterricht-und-projekte/4-w-lz-jahr-12-schulst">
              4. w@lz-Jahr (12. Schulstufe)
            </a>{' '}
            <br /> Eigene Fähigkeiten auch anderen zur Verfügung stellen ... ein
            großes Thema!
          </p>
          <p>
            <a href="/index.php/unterricht-und-projekte/5-w-lz-jahr-13-schulst">
              5. w@lz-Jahr (13. Schulstufe)
            </a>{' '}
            <br /> Der große Endspurt mit nur einem Ziel vor Augen: Die Matura
            naht!
          </p>
          <p>
            <a href="/index.php/unterricht-und-projekte/jahrgangsuebergreifend">
              Jahrgangsübergreifend
            </a>{' '}
            <br /> In der w@lz gibt es auch jahrgangsübergreifende Projekte und
            Veranstaltungen - mehr dazu lesen Sie hier...
          </p>{' '}
        </div>
      </div>

      <Outlet />
    </div>
  )
}
