# Aufnahme › Voraussetzungen, Kosten, Stipendien: Kapitel mit Bild

## Warum

Unter der Vorgehensweise ist /aufnahme fast nur Fließtext: orange Überschriften,
Trennlinien, eine blaue Box. Eltern, die hier lesen, sehen nichts von der Walz
selbst und müssen die wichtigen Zahlen aus den Absätzen fischen.

## Ziel

Richtung C aus den Skizzen, mit den Kacheln aus B: Jeder der drei Abschnitte
öffnet mit einem Foto, auf dem sein Titel sitzt. Die Eckdaten stehen als große
Zahlen, und eine Absolventin oder ein Absolvent kommt zu Wort.

## Nicht-Ziele

- Kein neuer Wortlaut im Fließtext. Die Kacheln und Kennzahlen nehmen nur Fakten
  auf, die schon im Text stehen.
- Keine Jahressumme der Beiträge.
- Die Vorgehensweise (Lernpfad), /aufnahme/formular und /danke bleiben, wie sie
  sind.
- Fotos nicht über Sanity pflegbar (entschieden: statisch).

## Ansätze

- A · Bilder und Stimmen: Fotos im Textfluss plus Zitatkarte. Warm, aber ohne
  Struktur.
- B · Auf einen Blick: Kacheln und große Zahlen. Schnell erfassbar, wirkt aber
  wie eine Produktseite.
- **C · Kapitel mit Bild, mit den Kacheln aus B (gewählt).** Das gibt den
  meisten Rhythmus und hält trotzdem die Fakten sichtbar.

## Entscheidungen

- **Fotos statisch** aus `public/images`:
  - Voraussetzungen: `persoenlichkeit_theater.jpg`
  - Kosten: `walz_paint.jpg`
  - Stipendien: `praxis_uhrenwerkstatt.jpg`

  `walz_paint.jpg` ist 9,1 MB groß und 7360 px breit. Es wird auf etwa 1600 px
  Breite verkleinert, wie die anderen.

- **Zitat aus den Sanity-Testimonials:** das erste nach `orderRank`, mit Name,
  griechischem Jahrgangsbuchstaben und Maturajahr wie auf der Startseite. Die
  Aufnahme-Query lädt es zusätzlich. Gibt es keines, entfällt der Block.
- **#161** ist gemergt, die Beitragsliste von dort ist die Grundlage.

## Gestaltung

- **Kapitelöffner:**
  - Foto in voller Inhaltsbreite mit runden Ecken, 220 px hoch am Handy und 340
    px ab `md`.
  - Der `h1` des Abschnitts sitzt unten links auf dem Foto, in einer Lasche in
    Seitenhintergrundfarbe.
  - Jedes Foto hat einen Alt-Text.
  - Der Öffner ersetzt den bisherigen freistehenden `h1`. `id`/Anker und das
    Inhaltsverzeichnis bleiben gleich.
- **Voraussetzungen:**
  - Unter dem Öffner stehen drei Kacheln (weiß, farbige Oberkante, große Zahl in
    der Schmalschrift):
    1. „9.“: Einstieg mit der 9. Schulstufe.
    2. „9.–11.“: Quereinstieg möglich.
    3. „Δ2 · Γ3“ in Blau: Restplätze. Sie übernimmt den Text und den Mail-Link
       der Box „Plätze frei“, die Box entfällt.
  - Darunter folgt der bisherige Text.
  - Am Handy stehen die Kacheln untereinander.
- **Kosten:**
  - Eine Kennzahlen-Reihe unter dem ersten Absatz: „über 90 %“ selbst finanziert
    und „€ 15.729“ öffentliche Schule pro Jahr (OECD).
  - Die Zahlen hängen nicht am Rand wie in der Skizze, weil dort ab `lg` das
    Inhaltsverzeichnis steht.
  - In der Beitragsliste aus #161 werden die Beträge orange und größer.
- **Zitat:**
  - Zwischen Kosten und Stipendien, mit blauer linker Kante.
  - Das Zitat steht in Schmalschrift `text-h5 md:text-h4` in `secondary-800`.
  - Darunter Name, Jahrgangsbuchstabe und Maturajahr.
  - Es ist ein `<figure>` mit `<blockquote>` und `<figcaption>`.
- **Stipendien:** Öffner mit Foto, Text unverändert.

## Tests

- **E2E auf /aufnahme:**
  - Jeder der drei Abschnitte hat seinen `h1` und ein Foto mit Alt-Text.
  - Die drei Kacheln stehen in den Voraussetzungen.
  - Die Box „Plätze frei“ ist durch die Kachel ersetzt: Mail-Link vorhanden, der
    Restplätze-Text steht nur einmal da.
  - Ein Zitat mit Absolventen-Namen steht vor den Stipendien.
- **Bestehende Tests:** Die lernpfad-Tests, die auf „Plätze frei“ prüfen, werden
  auf die Kachel umgestellt. Nichts wird gelöscht.
- **Kein Überlauf:** Der 320-px-Test läuft weiter.
- **Vorher/nachher-Screenshots** bei 1440 und 375 px.

## Dem Umsetzenden überlassen

- Genaue Abstände und Schatten.
- Ob Öffner und Kachel eigene Komponenten in `app/components` werden oder in der
  Route bleiben.
- Der Bildausschnitt (`object-position`) pro Foto.

## Nach der Review-Runde

- Die Kennzahlen der Kosten stehen direkt unter dem Foto, wie die Kacheln bei
  den Voraussetzungen: Foto, Überblick, Text. Es sind drei Zahlen, auch € 700
  Förderung, weil der Vergleich € 700 gegen € 15.729 das Argument ist.
- Am Handy steht der Kapiteltitel unter dem Foto statt in der Lasche. Lange
  Titel wie „Kosten und Finanzierung“ würden das Foto sonst verdecken.
- Am Handy stehen die Kacheln „9.“ und „9.–11.“ nebeneinander. Die Kachel mit
  den Restplätzen ist überall doppelt so breit.
- Das Zitat ist eine Stufe kleiner (`text-h5`), weil die Testimonials lang sind.
- Die Eckdaten der Voraussetzungen stehen nicht mehr als Kacheln, sondern als
  schlichte Zeile wie die Kennzahlen der Kosten (Ferdinand: Kacheln wirkten
  fremd). Beide nutzen dieselbe `FigureRow`.
  - Die Restplätze stehen in Blau als „10. · 11.“. Der Kontakt zu Agnes Chorherr
    folgt als eigene Zeile darunter.
