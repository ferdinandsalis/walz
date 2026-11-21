# Aufnahme › Vorgehensweise Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Auf /aufnahme die vier Absätze unter „Vorgehensweise“ in die vier
nummerierten Schritte des Aufnahmeprozesses einbauen.

**Architecture:** Eine kleine Komponente `AdmissionSteps` in
`app/routes/aufnahme+/_index.tsx`, gebaut aus den Lernpfad-Bausteinen
(`PathRail`, `PathMarker`, `PathNode`, `RailEnd`). Titel aus `AUFNAHME_STEPS`,
Texte als JSX je Schritt. `StepsPath` bleibt unangetastet (Formular und /danke
nutzen ihn weiter).

**Tech Stack:** React Router 7, Tailwind 4, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-21-aufnahme-vorgehensweise-design.md`

## Global Constraints

- Wortlaut des Fließtexts unverändert, nur verteilt.
- Lokal nur mail-freie e2e-Tests (`tests/lernpfad.spec.ts` und die zwei
  Navigations-Tests aus `tests/aufnahme-form.spec.ts` per `--grep`), Port frei
  wählen (nicht 3000).
- Node über `mise exec node@24 --`.

## Review Focus

- Handybreite (375 px): Knoten und Text dürfen nicht über den rechten Rand
  laufen — von „keeps … at 375px“/„boxesPastTheRightEdge“-Tests in lernpfad.spec
  abgedeckt, laufen mit.
- Ab xl läuft der senkrechte Seitentitel durch den linken Rand; der Pfad hängt
  deshalb nicht, und kein Knoten darf den Titel überdecken — Test „keeps the
  steps clear of the page title on /aufnahme“ ersetzt „lines the steps up with
  the heading on /aufnahme“.
- Screenreader: Liste trägt Namen „Aufnahmeprozess“, Titel sind Überschriften —
  im neuen Test geprüft.

---

### Task 1: Schritte mit Text auf /aufnahme

**Files:**

- Modify: `tests/lernpfad.spec.ts` (Test „shows the steps path above the prose
  and both notices on /aufnahme“)
- Modify: `app/routes/aufnahme+/_index.tsx` (Abschnitt `#vorgehensweise`,
  `AdmissionDay`)

**Interfaces:**

- Consumes: `AUFNAHME_STEPS` (`app/utils/aufnahme-form.ts`), Pfad-Bausteine aus
  `app/components/ui/path.tsx`, `Notice`.
- Produces: nichts für andere Tasks.

- [ ] **Step 1: Test umschreiben** — neuer Name „tells the admission steps with
      their text on /aufnahme“:
  - `#vorgehensweise` enthält Liste `{ name: 'Aufnahmeprozess' }` mit 4
    `listitem`s.
  - Jedes Item hat eine Überschrift (level 2) in der Reihenfolge
    `Anmeldung absenden`, `Anruf von der Walz`, `Aufnahmegespräch`,
    `Zu- oder Absage`.
  - Item 1 enthält
    `Wenn du dich an der Walz bewerben willst, fülle bitte das Anmeldeformular aus.`,
    Item 2 enthält `ab Mitte November`, Item 3
    `Bei dem persönlichen Aufnahmegespräch`, Item 4
    `Ab Jänner erhalten du und deine Eltern`.
  - Item 1 enthält die `.bg-secondary-50`-Notice mit Text `Jahrgang Zeta` und
    Link `Zum Anmeldeformular`; Klick führt zu `/aufnahme/formular`.
  - Notice „Plätze frei“ bleibt genau einmal vorhanden.
- [ ] **Step 2: Rot laufen lassen** —
      `mise exec node@24 -- env PORT=4466 npx playwright test tests/lernpfad.spec.ts -g "admission steps"`
      → FAIL (keine Überschriften in den Items).
- [ ] **Step 3: Umsetzen** — `function AdmissionSteps()` in `_index.tsx`:
      `PathRail dashed` (nicht hängend, s. Review Focus),
      `<ol role="list" aria-label="Aufnahmeprozess">`, je Schritt
      `<li className="relative">` mit `PathMarker` +
      `PathNode state="open" number={i+1}`, `RailEnd` am letzten,
      `<h2 className="font-condensed text-h5 md:text-h4 font-bold">` mit Titel,
      darunter Text `max-w-prose space-y-4 text-base md:text-xl`. Der Marker
      zentriert auf die erste Zeile des `li`; die `li`-Schriftgröße so setzen,
      dass `lh` der Titelzeile entspricht. `AdmissionDay` wird zur Notice ohne
      Titel innerhalb Schritt 1. Alte `StepsPath`-Nutzung, den Absatzblock und
      das separate `<AdmissionDay />` entfernen.
- [ ] **Step 4: Grün** — gesamtes `tests/lernpfad.spec.ts` plus
      `npx playwright test tests/aufnahme-form.spec.ts -g "should navigate to form"`
      → PASS; `npm run typecheck`, `npm run lint`, `npm test` → grün.
- [ ] **Step 5: Screenshots** 1440 px und 375 px, vorher (main) / nachher.
- [ ] **Step 6: Commit** Spec, Plan, Test und Umsetzung.
