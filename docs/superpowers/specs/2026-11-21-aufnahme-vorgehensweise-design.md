# Aufnahme › Vorgehensweise: Schritte und Text zusammenführen

## Warum

Auf /aufnahme stehen die vier Schritte des Aufnahmeprozesses dreimal: als
winzige Liste („Aufnahmeprozess“, `text-body-xs`), als vier Absätze Fließtext
und noch einmal in der blauen Box „Aufnahmetermin“. Die Liste liest sich wie
eine Fußnote, der Text hat keine Gliederung, und der Aufruf zum Formular steht
ganz unten.

## Ziel

Die vier Schritte werden das Gerüst des Abschnitts. Jeder Schritt hat eine
Nummer auf dem Lernpfad, seinen Titel als Zwischenüberschrift und seinen Absatz
als Text. Der Weg zum Formular steht bei Schritt 1.

## Nicht-Ziele

- Kein neuer Wortlaut. Der Fließtext wird nur auf die Schritte verteilt; Anrede
  (du) und Fakten bleiben, wie sie sind. Abweichungen zu `AUFNAHME_STEPS`
  (Sie-Anrede, „letzte 10 Minuten“) klärt Agnes, nicht dieser Umbau.
- /aufnahme/formular, /danke, die übrigen Abschnitte (Voraussetzungen, Kosten,
  Stipendien) bleiben unverändert; sie kommen danach dran.

## Ansätze

1. **Zusammenführen (gewählt):** Absätze werden der Körper der Schritte.
   Beseitigt die Wiederholung.
2. Nur die kleine Liste typografisch aufwerten, Text unverändert. Schneller,
   aber die Doppelung bleibt.

## Aufteilung des Textes

| Schritt              | Text                                                                                                                                                                          |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Anmeldung absenden | „Wenn du dich … fülle bitte das Anmeldeformular aus.“ + „Nach Absenden des Formulars … Details zum Aufnahmetermin zu.“ + Hinweis Jahrgang Zeta + Button „Zum Anmeldeformular“ |
| 2 Anruf von der Walz | „Für den neuen Jahrgang beginnen wir ab Mitte November … zu vereinbaren.“                                                                                                     |
| 3 Aufnahmegespräch   | Absatz „Bei dem persönlichen Aufnahmegespräch …“                                                                                                                              |
| 4 Zu- oder Absage    | Absatz „Ab Jänner erhalten du …“                                                                                                                                              |

Der Hinweis zum Jahrgang Zeta bleibt als blaue `Notice` (ohne eigene
Überschrift, weil Schritt 1 sie schon trägt), direkt mit dem Button darin, in
Schritt 1. Die separate Box unter dem Text entfällt.

## Gestaltung

- Lernpfad-Vokabular (#142) weiterverwenden: `PathRail` gestrichelt, `PathNode`
  im Zustand `open` mit Nummer 1–4, `RailEnd` beim letzten Schritt. Nicht
  hängend: auf /aufnahme läuft ab xl der senkrechte Seitentitel (#156) genau
  durch den linken Rand, in den der Pfad hängen würde.
- Schritt-Titel: `font-condensed font-bold`, Größe `text-h5 md:text-h4` wie die
  anderen Zwischenüberschriften der Seite (`Quereinstieg`).
- Schritt-Text: unverändert `text-base md:text-xl`, `max-w-prose`.
- Liste semantisch als `<ol role="list">`, Titel als `h2`.
- Titel kommen aus `AUFNAHME_STEPS`, damit sie mit Formular und /danke
  übereinstimmen.

## Dem Umsetzenden überlassen

Abstände zwischen den Schritten; ob die Liste direkt in `_index.tsx` aus den
Pfad-Bausteinen gebaut wird oder als kleine Komponente.

## Prüfung

`tests/lernpfad.spec.ts` legt die heutige Struktur fest („shows the steps path
above the prose …“, „lines the steps up with the heading on /aufnahme“). Diese
Tests werden zuerst auf die neue Struktur umgeschrieben (Liste „Aufnahmeprozess“
mit vier Schritten, jeder mit Titel als Überschrift und seinem Text darin;
Button „Zum Anmeldeformular“ in Schritt 1; kein Knoten über dem Seitentitel),
laufen rot, dann wird gebaut. Lokal nur die mail-freien e2e-Tests.

Dazu Screenshots vorher/nachher bei 1440 px und Handybreite; Vitest und die
übrigen Tests bleiben grün.
