# Aufnahme: der Weg durchs Jahr

## Warum

Ferdinand findet /aufnahme zu gleichförmig. Jedes Kapitel ist gleich gebaut:
Foto, Reiter-Titel, Zahlenzeile, Fließtext, Trennlinie. Zwischen den Fotos ist
fast nur Orange auf Hellgrau zu sehen. Die Seite soll lebendiger werden, ohne
die Gestaltungssprache der Website zu verlassen.

Der Weg dahin: Die Inhalte selbst werden zu Bildern, statt dass Schmuck
dazukommt. Wann was passiert, wo man einsteigen kann und was ein Jahr kostet,
wird jeweils sichtbar. Die Skizze „B · senkrecht“ hat Ferdinand ausgewählt.

## Ziele

- Bei der Vorgehensweise sieht man auf einen Blick, wann jeder Schritt kommt.
- Die Stimme der Absolventin steht früh auf der Seite statt versteckt vor den
  Stipendien.
- Bei den Voraussetzungen zeigt ein Bild, welche der fünf Walzjahre zum Einstieg
  offen sind.
- Unter Kosten erklären ein Balken und eine Tabelle, was ein Walzjahr die Eltern
  kostet. Die volle Beschreibung jedes Beitrags bleibt erhalten.

## Nicht-Ziele

- Kein neuer Fließtext. Neu sind nur die vier Zeitangaben, die Legende und
  Tabellenköpfe.
- Stipendien und Quereinstieg bleiben unverändert.
- Keine Änderung an Sanity-Schema oder Studio.
- Lernpfad, Formular und Bestätigungsseite bleiben unverändert.

## Anti-Ziele

- Keine neue Gestaltungssprache: keine vollflächigen Farbblöcke, keine neuen
  Schriften oder Farben, wie es Skizze C hatte.
- Die Jahressumme wird nicht groß gesetzt. Sie steht nur als Summenzeile der
  Tabelle.
- Nichts, was Agnes jedes Jahr an zwei Stellen pflegen müsste.

## Ansätze

- **B · senkrecht (gewählt).** Der Lernpfad bleibt senkrecht und bekommt
  Zeitangaben. Die Texte bleiben wortgleich, und der Pfad sieht aus wie im
  Formular.
- B · waagrecht. Ein Zeitstrahl mit vier Stationen und neuen Kurztexten in „du“,
  die langen Texte kommen ins Akkordeon. Verworfen: Es braucht neuen Text, jeder
  Schritt steht doppelt da, und am Handy ist er ohnehin senkrecht.
- A · Menschen zuerst (Hero-Foto, Kärtchen, Bild abwechselnd links und rechts)
  und C · Plakat (vollflächige Farbblöcke). Verworfen, weil sie sich weiter von
  der bestehenden Gestaltung entfernen.

## Gestaltung

### Vorgehensweise

`AdmissionSteps` bekommt über jedem Titel eine Zeitzeile: klein, Versalien,
gesperrt, in Orange, wie der Stil `.tag` der Skizze. Die Zeitangaben lauten:

| Schritt            | Zeitangabe        |
| ------------------ | ----------------- |
| Anmeldung absenden | Jetzt             |
| Anruf von der Walz | ab Mitte November |
| Aufnahmegespräch   | am Aufnahmetermin |
| Zu- oder Absage    | ab Jänner         |

Die Zeitangaben gehören zu /aufnahme und stehen dort neben `admissionStepTexts`.
Sie kommen nicht in `AUFNAHME_STEPS`, weil Formular und Bestätigung „Sie“ sagen
und sie dort nicht brauchen.

Schritt 1 wird als aktueller Schritt hervorgehoben: ein ausgefüllter Knoten wie
`done`, aber mit Ziffer statt Häkchen, dazu ein heller Hof. Dafür bekommt
`PathNode` einen neuen Zustand `current`. Die Zeitzeile „Jetzt“ trägt die
Bedeutung im Text, damit sie nicht allein an der Farbe hängt. Die Texte und der
Hinweis mit dem Button bleiben wie heute.

### Stimme der Absolventin

`TestimonialQuote` wandert ans Ende des Kapitels Vorgehensweise, vor die
Trennlinie zu den Voraussetzungen. Der Stil bleibt gleich, die Daten kommen wie
bisher aus Sanity. Bei den Kosten entfällt das Zitat.

### Voraussetzungen

Die Eckdaten-Zeile (`AdmissionFacts` mit `FigureRow`) wird durch ein Raster der
fünf Walzjahre ersetzt. Die Liste lautet „Fünf Walzjahre · wo du einsteigen
kannst“:

| Kästchen | Ziffer | Text                 | Darstellung                   |
| -------- | ------ | -------------------- | ----------------------------- |
| 1        | 9.     | Einstieg in die Walz | Orange gefüllt, weiße Schrift |
| 2        | 10.    | Restplätze Delta 2   | Hell-Orange, blauer Rahmen    |
| 3        | 11.    | Restplätze Gamma 3   | Hell-Orange, blauer Rahmen    |
| 4        | 12.    | (leer)               | Weiß                          |
| 5        | 13.    | Matura               | Weiß                          |

- Hell-Orange bedeutet „Quereinstieg möglich“, der blaue Rahmen „gerade Plätze
  frei“.
- Darunter steht eine Legende mit drei Einträgen: Einstieg, Quereinstieg
  möglich, gerade Plätze frei.
- Jedes Kästchen trägt seine Bedeutung auch als Text. Für Screenreader ist es
  eine Liste.
- Die Restplätze bleiben fest im Code wie heute (siehe #162).
- Die Zeile mit dem Kontakt zu Agnes Chorherr bleibt darunter.

### Kosten

- Die Kennzahlen-Zeile (`FigureRow` mit `keyFigures`) und die drei Absätze
  bleiben.
- Unter „Beiträge Schuljahr …“ kommt zuerst ein Satz: „Was ein Walzjahr für die
  Eltern kostet:“.
- Darunter steht ein gestapelter Balken. Jeder wiederkehrende Beitrag ist ein
  Segment, so breit wie sein Jahresbetrag. Beschriftet ist ein Segment nur, wenn
  der Text hineinpasst. Der Balken ist Schmuck (`aria-hidden`), denn die Tabelle
  trägt dieselbe Information. Im Segment steht nur der Jahresbetrag (etwa „€
  9.180“), und nur, wenn das Segment mindestens 15 % der Summe ausmacht. Das ist
  ein fester Schwellwert, kein Messen im Browser. Die Namen stehen in der
  Tabelle, verbunden über die Farbquadrate. So braucht es keine Kurznamen im
  Code (eigene Entscheidung, Ferdinand zur Durchsicht genannt).
- Darunter folgt die Tabelle als Akkordeon aus `<details>`, alle zugeklappt. Die
  Spalten sind Beitrag, Betrag, wie oft und im Jahr.
  - Jede Zeile hat ein Farbquadrat passend zum Segment.
  - Aufgeklappt zeigt eine Zeile die Beschreibung aus Sanity wortgleich.
- Nach den wiederkehrenden Beiträgen kommt eine Summenzeile „Summe im Jahr“.
- Einmalige Beiträge (`ONCE`) stehen nach der Summe, gedämpft, mit „einmalig“
  und ohne Wert „im Jahr“.

Die Werte werden aus den Sanity-Daten gerechnet:

- Jahresbetrag = `cost × quantity` für `MONTHLY` und `QUARTERLY`.
- Die Summe zählt nur diese Beiträge.
- Die Reihenfolge ist die aus Sanity.

Diese Rechnung kommt als reine Funktion in eine eigene Datei mit Vitest-Tests
(TDD).

Am Handy rutschen Betrag und „wie oft“ unter den Titel. In der Zeile bleiben der
Titel und der Wert „im Jahr“.

### Handy

- Das Jahresraster bleibt fünfspaltig, die Texte werden kleiner und dürfen
  umbrechen.
- Der Balken bleibt, die Segmente ohne Platz bleiben unbeschriftet.
- Seitlich scrollt nichts bei 320 px.

## Tests

- **Vitest:** Jahresbetrag pro Beitrag, die Summe ohne einmalige Beiträge, die
  Reihenfolge.
- **E2E (aufnahme.spec):**
  - Die Zeitangaben stehen bei den Schritten, Schritt 1 ist `current`.
  - Das Zitat steht vor #voraussetzungen.
  - Es gibt fünf Jahreskästchen mit ihren Texten.
  - Die Tabelle hat wiederkehrende Zeilen und einmalige Zeilen. Die Summenzeile
    ist gleich der Summe der Werte „im Jahr“ in den Zeilen.
  - Feste Beträge wie € 15.104 prüft der E2E-Test nicht, denn er läuft gegen die
    echten Sanity-Daten. Eine Preisänderung durch Agnes würde sonst den Deploy
    blockieren. Die genauen Zahlen prüfen die Vitest-Tests der reinen Funktion
    (eigene Entscheidung, Ferdinand zur Durchsicht genannt).
  - Eine Zeile klappt ihre Beschreibung auf.
  - Bei 320 px scrollt nichts seitlich.
- Bestehende Tests, die sich ändern, werden angepasst und nicht gelöscht:
  - „shows the facts as a row of figures“ wird zum Jahresraster.
  - „lets a graduate speak before the scholarships“ wird zu „…early“.
  - „fits the figures“ zählt nur noch die drei Kennzahlen.
- **Screenshots** vorher und nachher bei 375, 896, 1160 und 1440 px.

## Umsetzung

Direkt in #162 (Branch `claude/aufnahme-kapitel`), als weitere Commits. #162
wird erst als Ganzes gemergt (Ferdinand).

## Dem Umsetzenden überlassen

- Die Farben der Balken-Segmente, aus der bestehenden Palette (`primary`,
  `primary-800`, `secondary`, `secondary-800`, …) in Sanity-Reihenfolge. Bei
  mehr Beiträgen als Farben wiederholt sich die Palette.
- Ob `current` am `PathNode` eine eigene Klasse oder eine Variante von `done`
  ist.
- Das genaue Raster der Tabelle auf breiten Schirmen.
