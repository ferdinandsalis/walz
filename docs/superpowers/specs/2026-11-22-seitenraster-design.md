# Seitenraster: die rechte Spalte gedeckelt

## Warum

Ab `lg` (896 px) und ab `xl` (1160 px) kommt im Seitenraster
(`app/root.tsx`) eine Spalte dazu. Text- und rechte Spalte wachsen dabei
gleich schnell, jeweils `minmax(min-content, …)`. Die rechte Spalte enthält
das Inhaltsverzeichnis, die Abschnittskarte oder die Adresse. Sie ist schon
bei 270–320 px, während die Textspalte bei 465–525 px hängt. Fließtext und
Kacheln werden dort eng, etwa auf /aufnahme, /ueber-uns und /kontakt.

## Ziel

Die Textspalte bekommt den Platz zuerst. Gleich nach `lg` und `xl` ist sie
mindestens etwa 560 px breit, darüber wächst sie bis zu ihrem Maximum von
732 bzw. 792 px.

## Nicht-Ziele

- Die Breakpoints bleiben, wo sie sind. Ansatz B (`xl` erst ab 1280) wäre
  ein eigener Schritt.
- Die Navigationsspalte (248 px) und die Höchstbreiten der Textspalte
  bleiben gleich.
- Die Seiten selbst werden nicht umgebaut.

## Ansätze

- **A · Rechte Spalte deckeln (gewählt).** Statt `minmax(min-content,
  320px)` wird sie `minmax(min-content, 14rem)`. Was breiter sein muss, etwa
  die Abschnittskarte im Formular (259 px), bekommt seinen Platz über
  `min-content` trotzdem. Es ist eine Zeile, und die Wirkung ist gut
  vorhersagbar.
- B · A, und zusätzlich `xl` erst ab 1280. Das ergibt den breitesten Text
  bei 1160, berührt aber 51 `xl:`-Klassen in 11 Dateien und 6 Tests.
- C · Die rechte Spalte als `fr`, damit sie erst nach der Textspalte wächst.
  Das ergibt an den engen Stellen dasselbe wie A, teilt aber den Rest mit
  der hinteren Randspalte und ist schwerer zu durchschauen.

## Gestaltung

In `app/root.tsx` wird bei `lg:` und `xl:` die rechte Spalte
`minmax(min-content,14rem)`. Erwartete Breite der Textspalte, wo eine
rechte Spalte steht:

| Fenster | Textspalte |
|---|---|
| 896 | ~576 px |
| 1024 | ~704 px |
| 1160 | ~560 px |
| 1280 | ~680 px |
| 1440 | 792 px |

Inkauf genommen wird:

- Die rechte Spalte ist auch auf großen Bildschirmen schmaler.
- Auf /kontakt wird die Karte breiter.
- Seiten über beide Spalten werden ab etwa 1440 px bis zu 96 px schmaler.

## Tests

- **Neuer E2E-Test:** Auf /aufnahme, /ueber-uns und /kontakt ist die
  Textspalte bei 896 und 1160 px mindestens 540 px breit.
- **Bestehende Tests** bleiben grün, besonders die Abschnittskarte (lernpfad)
  und das Inhaltsverzeichnis (toc).
- **Vorher/nachher-Screenshots** der betroffenen Seiten bei 896, 1160 und
  1440.

## Dem Umsetzenden überlassen

- Wie der Test die Textspalte misst, etwa über das berechnete
  `grid-template-columns` des Seitenrasters oder über die Breite eines
  Textblocks.
