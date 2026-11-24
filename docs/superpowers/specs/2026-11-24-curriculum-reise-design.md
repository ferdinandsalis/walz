# Curriculum: fünf Jahre als Reise

## Warum

/curriculum ist heute die langweiligste Seite der Website, obwohl sie für
künftige Walzistinnen und Walzisten die spannendste sein könnte. Jedes Jahr ist
gleich gebaut: Titel, Fließtext, zwei Aufzählungslisten (Projekte, Externe
Prüfungen) und ein Fotostreifen ganz unten. Was die Walz ausmacht, nämlich
Forst, Irland, Theater, Steinhauen und am Ende die Matura, geht in Listen unter.

Die Seite soll zeigen, was man in fünf Jahren erlebt und wie man nebenbei
zur Matura kommt. Grundlage sind die Inhalte, die heute schon in Sanity stehen.

In einem Wegwerf-Prototyp (Route `curriculum-spike`, nie in main) hat Ferdinand
drei Richtungen gesehen: A · Reise, B · Karte, C · Übersicht. Er hat „A, mit der
Karte aus B“ gewählt und das Fotomosaik „Mosaik offen“ (`?v=f`) für gut
befunden.

## Ziele

- Ein Bild vorweg zeigt: von Wien in die Welt (Karte) und Jahr für Jahr zur
  Matura (Prüfungsleiste).
- Jedes Jahr beginnt mit einer großen orangen Ziffer. Ferdinand mag große
  Ziffern, und die Seite darf dafür länger werden.
- Die Projekte eines Jahres sind ein Fotomosaik, dessen Umriss kein Rechteck
  ist. Der Jahresanfang (Ziffer, Titel, erster Satz) sitzt in einer Ecke des
  Mosaiks, in ungeraden Jahren links, in geraden rechts. Die letzte Reihe endet
  dort, wo die Fotos enden.
- Ein Klick auf ein Foto öffnet alle Fotos des Jahres im Vollbild
  (`PhotoLightbox`), beginnend beim Projekt.
- Am Handy funktioniert alles ohne seitliches Scrollen.

## Nicht-Ziele

- Keine Änderung an Sanity-Schema oder Studio. Neue Inhalte (Kurztexte zu
  Projekten, Ort, Monat, Karte aus Sanity) kommen in einem eigenen Schritt,
  nachdem Agnes eine Skizze gesehen hat.
- Kein neuer Fließtext. Die Jahrestexte bleiben wortgleich.
- Die übrigen Seiten bleiben unverändert.

## Anti-Ziele

- Kein großes Hero-Foto. Ferdinand hat es ausdrücklich abgelehnt.
- Kein Mosaik als geschlossenes Rechteck und kein versetztes Magazin-Layout
  (Skizze „Editorial“, `?v=e`).
- Keine dunkleren Abstufungen der Markenfarben und keine neue
  Gestaltungssprache. Es gelten die Farbregeln im Kommentar in
  `app/styles/app.css`.

## Ansätze

- **A · Reise mit Karte aus B (gewählt).** Karte und Prüfungsleiste vorweg,
  danach jedes Jahr als Kapitel mit großer Ziffer und offenem Mosaik.
- B · Karte allein. Die Karte ist das Hauptelement, die Jahre hängen an den
  Orten. Verworfen, weil die meisten Projekte keinen Ort haben (Forst, Kunst,
  Skills) und so nur ein Teil der Walz sichtbar wird.
- C · Übersicht als Matrix (Jahre × Projekte × Prüfungen). Verworfen: gut zum
  Nachschlagen, aber nicht das, was Lust auf die Walz macht.
- Innerhalb von A wurden drei Jahreslayouts verglichen: Mosaik im Rechteck mit
  Text darüber (`?v=d`), Editorial (`?v=e`) und Mosaik offen (`?v=f`, gewählt).

## Gestaltung

Der Prototyp `app/routes/curriculum-spike.tsx`, Ansicht `?v=f` (Komponenten
`Combined` mit `layout="open"`, `EuropeMap` und `OpenMosaicYear`), ist die
Vorlage. Was hier steht, hat Vorrang vor dem Prototyp.

### Seitenkopf

- `PageTitle` bleibt wie auf den anderen Seiten.
- Darunter die Überschrift „Fünf Jahre Walz – von Wien in die Welt und zur
  Matura“ in Orange. Das ist neuer Text, den Agnes noch absegnen soll.
- Darunter die Karte: ein SVG mit Punktraster und gestrichelten Bögen von Wien
  zu Kamp, Kühtai, Irland (2. Jahr), Palfau (3.), Toskana (4.) und Paris (5.),
  jeweils mit Jahr beschriftet. Die Orte und Jahre stehen fest im Code, weil
  Sanity heute keinen Ort kennt. Sie stammen aus den Projektnamen.

### Der Weg zur Matura

- Eine Zeile „Der Weg zur Matura · N externe Prüfungen“. N wird aus Sanity
  gezählt; „keine“ und leere Einträge zählen nicht.
- Fünf weiße Kacheln (am Handy untereinander), jede ein Sprungziel zu ihrem
  Jahr (`#jahr-N`): orange Ziffer, Jahrestitel und ein blauer Balken.
- Der Balken zeigt, wie viele Prüfungen bis zu diesem Jahr geschafft sind: der
  Anteil früherer Jahre und der Anteil dieses Jahres an allen Prüfungen. Die
  Beschriftung lautet „+N Prüfungen“ oder „keine Prüfungen“.
- Abweichung vom Prototyp: Der Anteil früherer Jahre ist dort mit `/40`
  aufgehellt. Nach den Farbregeln bekommt eine zweite Fläche derselben Farbe
  ein Muster, hier also Blau mit `pattern-dots` oder `pattern-stripes`.

### Ein Jahr

- Mosaik: vier Spalten am Desktop, zwei am Handy, feste Reihenhöhe, kleine
  Lücken, `grid-flow-dense`.
- Die Ecke mit dem Jahresanfang nimmt 2 × 2 Zellen ein, oben links in
  ungeraden und oben rechts in geraden Jahren. Am Handy steht sie über den
  Fotos. Sie enthält:
  - die Ziffer in Orange (am Handy kleiner),
  - „N. Jahr“ klein in Versalien,
  - den Jahrestitel dunkel,
  - den ersten Satz der Beschreibung dunkel und fett.
- Jedes Projekt mit Foto wird eine Kachel mit seinem ersten Foto. Das erste
  Projekt bekommt 2 × 2 Zellen, Hochformate zwei Reihen. Damit das Mosaik
  lebendig bleibt, wird zusätzlich jede fünfte Kachel zwei Spalten breit.
- Jede Kachel trägt unten den Projektnamen in Weiß auf einem Verlauf. Gibt es
  weitere Fotos, steht daneben ein Chip „+N Foto(s)“.
- Unter dem Mosaik zwei Spalten:
  - links der Rest der Beschreibung,
  - rechts „Außerdem in diesem Jahr“ (Projekte ohne Foto, mit „ · “
    verbunden, nur wenn es welche gibt) und „Externe Prüfungen“ als gefüllte
    Chips: Blau, Matura Orange.
- Ein Jahr ohne Prüfungen zeigt den Chip „Keine – ein Jahr Time-out vom
  Prüfungsstress“. Das ist neuer Text für Agnes.
- Ein Jahr mit nur einer Foto-Kachel lässt sie über die ganze freie Breite
  laufen, damit keine halbe Reihe leer bleibt.

### Wie das Mosaik Lücken vermeidet (Entscheidung von Bot)

Die festen Größenregeln oben vertragen sich mit den echten Daten nicht immer.
Das 1., 2. und 4. Jahr haben mehrere Hochformate, das 4. zusätzlich ein
Panorama. Deshalb gilt:

- Als Loch gilt jede leere Zelle außerhalb der letzten Reihe. Der unregelmäßige
  Umriss entsteht nur durch die Ecke mit dem Jahresanfang und die offene letzte
  Reihe.
- Die Reihenfolge aus Sanity bleibt der Ausgangspunkt. Die Anzeige darf Kacheln
  verschieben, wie es `grid-flow-dense` tut.
- Wenn eine Regel ein Loch erzeugen würde, gibt sie nach. Zuerst verliert die
  „jede fünfte breit“-Regel, dann ein Hochformat seine zweite Reihe. Die große
  erste Kachel bleibt immer.
- Umgesetzt wird das als reine Funktion. Sie bekommt die Seitenverhältnisse und
  die Spaltenzahl, spielt die Platzierung durch und liefert die Größe jeder
  Kachel, getrennt für 4 und 2 Spalten. Sie wird mit den echten Jahren als
  Testfällen geprüft.
- Die große Kachel bekommt das erste Projekt mit Foto. Im 1. Jahr ist das erste
  Projekt „Digitale Kompetenz“ ohne Foto.

### Bekannte Schwächen des Prototyps, die der Bau löst

- Im 2. Jahr hängt das Hochformat „Sprachpraktikum Spanisch/Französisch“ eine
  Reihe unter den anderen Kacheln. Links daneben bleibt eine große leere
  Fläche, bevor der Text beginnt. Das Mosaik soll den Umriss bewusst
  unregelmäßig halten, aber keine Löcher über dem Text lassen.
- Lange Projektnamen werden am Handy getrennt („Landwirt-schaft“). Das
  funktioniert, sieht aber nicht gut aus. Lösung ist dem Bau überlassen,
  z. B. kleinere Schrift für lange Namen.

## Technik

- Der Bau ersetzt `app/routes/curriculum/route.tsx`. Loader und
  `curriculumQuery` bleiben.
- Rechnende Teile werden reine Funktionen mit Vitest-Tests, test-first:
  - Prüfungen zählen (ohne „keine“),
  - kumulierte Prüfungsanteile,
  - erster Satz und Rest der Beschreibung,
  - Seitenverhältnis aus dem Sanity-Asset-Namen,
  - Kachelgröße je Projekt.
- E2E-Tests (Playwright, ohne Mail) prüfen:
  - Die Seite zeigt fünf Jahre.
  - Ein Klick auf eine Kachel öffnet die Lightbox.
  - Die Sprungziele der Prüfungsleiste führen zum richtigen Jahr.
  - Bei 390 px Breite scrollt nichts seitlich.
- Die Bilder kommen über `urlFor` zugeschnitten in passender Größe.
- Die Kacheln sind Buttons mit sprechendem Namen.
- Die Karte hat einen `title`.
- Die Ziffer ist `aria-hidden`, weil „N. Jahr“ daneben steht.
- Die Route `curriculum-spike` wird nicht übernommen.

## Ausnahme von den Farbregeln

Ferdinand hat entschieden, dass auf dieser Seite mehr Orange erlaubt ist, als
die Regel „ein oranger Titel pro Block, Zahlen dunkel“ vorsieht:

- die Überschrift über der Karte,
- die fünf Ziffern in der Prüfungsleiste,
- die große Ziffer jedes Jahres.

Der Bau schreibt diese Ausnahme in den Kommentar mit den Farbregeln in
`app/styles/app.css`: Große Jahresziffern, die durch die Walz führen, dürfen
orange sein.

## Freigabe durch Agnes

Zwei Texte sind neu: die Überschrift über der Karte und der Chip „Keine – ein
Jahr Time-out vom Prüfungsstress“. Der Pull Request wird geöffnet, aber erst
gemergt, wenn Agnes beide Texte gesehen hat. Beide Texte stehen deshalb an je
einer Stelle im Code und sind leicht zu tauschen.

## Dem Bau überlassen

- Genaue Reihenhöhen, Abstände und Schriftgrößen innerhalb der Skala der
  Website.
- Wie die Karte am Handy beschriftet wird, damit sich nichts überlappt.
- Aufteilung in Komponenten und Dateien unter `app/routes/curriculum/`.
