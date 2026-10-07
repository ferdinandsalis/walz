# Aufnahmeformular Redesign

## Overview

Redesign the admissions form at `/aufnahme/formular` and its confirmation page
at `/aufnahme/formular/danke`. Parents fill in the form, mostly on a phone. The
form must:

1. lose fewer families between starting and sending,
2. give the office complete, well-structured data,
3. feel warm and personal, like the school, and
4. work effortlessly on a phone.

The form stays one page. It gains:

- an intro,
- numbered sections with the parent first,
- correct autofill,
- per-field errors with an error summary,
- structured addresses with "Wohnt an Ihrer Adresse" checkboxes,
- one required school-history field that replaces "Derzeit besuchte Schule",
- a three-field date of birth,
- an optional "Wie haben Sie von der Walz erfahren?" with options,
- a privacy notice, and
- a confirmation page that explains what happens next.

The office email goes out before the parents' confirmation, so a failed
confirmation no longer loses a registration.

Everything the parent reads speaks to them with "Sie". The one exception is the
task for the child on the confirmation page, which uses "du" as the confirmation
email already does.

## Research basis

Desk research only; no real-user testing this round.

**Audit of the live form (2026-10-06)**

- Inputs render at 14px, so iOS Safari zooms on every focus.
- No field has an `autocomplete` attribute.
- There is no intro, no privacy notice and no hint that anything is optional.
- The server answers a failed submit with one generic message below the form. It
  names no field, so the form fails WCAG 3.3.1.
- The confirmation page sets green-500 text on green-50 (about 2:1 contrast).
- Input borders reach about 1.25:1 against the card, which fails WCAG 1.4.11.
- The newsletter box (its own email field, "du") sits directly below the submit
  button.

**Form-UX evidence**

- _Single page or steps._ What a form asks matters more than how many pages it
  spreads over. A well-built single page holds its own against steps (Baymard,
  one-page checkout).
- _"Same address" checkbox._ Ticked by default, with the duplicate fields
  hidden, it performs far better (Baymard, billing = shipping). It also
  satisfies WCAG 3.3.7.
- _Inline validation._ Validating on blur, never while typing, measured +22%
  success and −42% completion time (Wroblewski, A List Apart).
- _Date of birth._ Three numeric fields beat calendars for dates people know by
  heart (GOV.UK).
- _Errors._ Per-field messages and an error summary that takes focus (GOV.UK
  error summary pattern).
- _Autofill._ The child fields must not carry personal `autocomplete` tokens.
  Otherwise the browser fills in the parent's own name, email and birthday
  (WHATWG autofill; WCAG 1.3.5 covers only data about the user).
- _Marketing questions._ A required marketing question adds friction. Options
  give cleaner counts than free text (Pew).
- _Wording._ "Erziehungsberechtigte Person" is neutral and needs no gender
  colon, which screen readers read aloud (DBSV).

**Comparable schools**

13 schools were scanned (8 Austrian, 3 German, 2 Swiss). Most Austrian
alternative schools have no online form at all, so Walz is already ahead on
channel. The best forms:

- show the steps after sending,
- say that sending is not yet an admission, and
- carry a short privacy notice.

**Independent review (2026-10-07)**

A design-critique and accessibility review of the first draft found three
blocking flaws, all fixed below:

1. Parent-2 data entered without a name was silently dropped.
2. Copying the address before validation produced duplicate errors that linked
   to hidden fields.
3. The error analytics event stopped firing.

## Decisions

| Topic                          | Decision                                                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Structure                      | One page with sections (no steps)                                                                                  |
| Section order                  | Parent first, then child, then optional further guardian, then "Zum Schluss"                                       |
| Address                        | Straße und Hausnummer / PLZ / Ort / Land, for every person                                                         |
| Same address: child            | "Wohnt an Ihrer Adresse", ticked by default                                                                        |
| Same address: further guardian | "Wohnt an Ihrer Adresse", **unticked** by default (a blank beats a wrong address for separated parents)            |
| School history                 | One required textarea, schools after the Volksschule with the current one last. Replaces "Derzeit besuchte Schule" |
| Current grade                  | Stays as its own field                                                                                             |
| Date of birth                  | Three numeric fields (Tag, Monat, Jahr)                                                                            |
| "Wie aufmerksam geworden"      | Optional, radio options plus "Anderes" with a text field                                                           |
| Privacy notice                 | Short text above the submit button plus a link to `/datenschutz`, no checkbox. Wording needs Agnes                 |
| Mail order                     | Office notification first, then the parents' confirmation                                                          |
| Not changed                    | No "which entry" field; names stay one field each                                                                  |
| Newsletter box                 | Hidden on `/aufnahme/formular`                                                                                     |
| Accessibility regression test  | `@axe-core/playwright` in the e2e suite                                                                            |

## Page content

German copy is final unless marked **[Agnes]**.

### Head

- `<title>`: "Anmeldung | Walz". After a failed submit it becomes "Fehler:
  Anmeldung | Walz".
- h1: "Anmeldung für die Walz".
- Intro: "Schön, dass Sie sich für die Walz interessieren. Bitte füllen Sie das
  Formular als Elternteil oder erziehungsberechtigte Person aus. Es dauert etwa
  5 Minuten."
- Compact box "So geht es weiter": the [steps](#steps) as a short numbered list,
  one line each, no descriptions. It must not push the first field below the
  first screen at 375 × 812.
- "Felder ohne „optional“ müssen ausgefüllt werden."

### Section 1 · Ihre Angaben

| Name                | Label                 | Type / attributes                                                        | Hint                                                                     |
| ------------------- | --------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `parent1Name`       | Vor- und Nachname     | `autocomplete="section-parent1 name"`, `spellcheck=false`                |                                                                          |
| `parent1Email`      | E-Mail                | `type=email`, `autocomplete="section-parent1 email"`, `spellcheck=false` |                                                                          |
| `parent1Phone`      | Telefon               | `type=tel`, `autocomplete="section-parent1 tel"`                         | Wir rufen Sie an, um den Termin für das Aufnahmegespräch zu vereinbaren. |
| `parent1Street`     | Straße und Hausnummer | `autocomplete="section-parent1 address-line1"`                           | Mit Stiege und Tür, z. B. Lindengasse 12/2/14                            |
| `parent1PostalCode` | PLZ                   | `autocomplete="section-parent1 postal-code"`                             |                                                                          |
| `parent1City`       | Ort                   | `autocomplete="section-parent1 address-level2"`                          |                                                                          |
| `parent1Country`    | Land                  | `autocomplete="section-parent1 country-name"`, default "Österreich"      |                                                                          |

- PLZ and Ort share one row (PLZ narrow); every other field takes the full
  width.
- PLZ gets no `inputmode`, because a numeric keypad would block letters in
  foreign postcodes.

### Section 2 · Jugendliche:r

**Person**

| Name                                                       | Label                                              | Type / attributes                                       | Hint                                                                                             |
| ---------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `studentName`                                              | Vor- und Nachname                                  | `autocomplete=off`, `spellcheck=false`                  |                                                                                                  |
| `studentEmail`                                             | E-Mail                                             | `type=email`, `autocomplete=off`, `spellcheck=false`    | Die Bestätigung geht auch an diese Adresse. Gibt es keine eigene, geben Sie Ihre an. **[Agnes]** |
| `studentBirthDay`, `studentBirthMonth`, `studentBirthYear` | Geburtsdatum (fieldset legend); Tag / Monat / Jahr | `inputmode=numeric`, `autocomplete=off`, no `maxLength` | z. B. 14 3 2012                                                                                  |

The date inputs set no `maxLength`, so a pasted "14.03.2012" is not cut short;
validation reports it instead.

**Wohnadresse** (sub-heading)

| Name                               | Label                  | Type / attributes                                                 | Hint                                                   |
| ---------------------------------- | ---------------------- | ----------------------------------------------------------------- | ------------------------------------------------------ |
| `studentSameAddress`               | Wohnt an Ihrer Adresse | checkbox, ticked by default                                       | Entfernen Sie den Haken bei einer anderen Wohnadresse. |
| `studentStreet` … `studentCountry` | as in section 1        | `section-student` tokens; shown only when the checkbox is cleared |                                                        |

**Schule** (sub-heading)

| Name            | Label                                 | Type / attributes                | Hint                                                                                       |
| --------------- | ------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------ |
| `currentGrade`  | Derzeitige Klasse / Schulstufe        |                                  | z. B. 4B, 8. Schulstufe                                                                    |
| `schoolHistory` | Besuchte Schulen nach der Volksschule | textarea, 4 rows, max 2000 chars | Mit Ort und Jahren, die derzeitige Schule zuletzt, z. B. MS Lindengasse, Wien (2022–heute) |

### Section 3 · Weitere erziehungsberechtigte Person (optional)

The section lives in a native `<details>` element whose `<summary>` reads
"Weitere erziehungsberechtigte Person angeben". The element renders `open` when
the returned values contain parent-2 data or parent-2 errors.

- **Fields:** `parent2Name`, `parent2Phone`, `parent2Email`, plus
  `parent2SameAddress` ("Wohnt an Ihrer Adresse", **unticked** by default) and
  `parent2Street` … `parent2Country`.
- **Labels, types and hints:** as in section 1, without the phone hint.
- **Autofill:** `section-parent2` tokens.
- **Address:** the address fields show while the box is unticked, and they stay
  optional.

### Section 4 · Zum Schluss

**How they heard about Walz.** A fieldset with the legend "Wie haben Sie von der
Walz erfahren? (optional)" holds radio buttons named `source` **[Agnes:
options]**:

| Value               | Label                                    |
| ------------------- | ---------------------------------------- |
| `freunde-familie`   | Freund:innen oder Familie                |
| `walz-gemeinschaft` | Eltern oder Schüler:innen der Walz       |
| `internet`          | Internetsuche oder Website               |
| `veranstaltung`     | Veranstaltung, z. B. Tag der offenen Tür |
| `social-media`      | Social Media                             |
| `anderes`           | Anderes                                  |

- A text field `sourceOther` ("Woher genau?", max 200 characters) follows the
  "Anderes" radio directly.
- It shows only while `:has(input[value="anderes"]:checked)` matches.
- The server ignores it unless `source` is `anderes`.

**Privacy notice [Agnes].** Shown with a lock icon:

> Wir verwenden Ihre Angaben nur für das Aufnahmeverfahren der Walz. Kommt kein
> Schulvertrag zustande, löschen wir sie. Mehr dazu in unserer
> Datenschutzerklärung.

"Datenschutzerklärung" links to `/datenschutz`. The deletion promise and its
timing must match what the school actually does; only Agnes can confirm that.

**Submit button.**

- It reads "Anmeldung absenden".
- While a submission is in flight (`navigation.state !== 'idle'`, which covers
  the post-redirect loading phase), it shows a spinner and gets
  `aria-disabled="true"`. A submit guard ignores further clicks.
- It keeps focus rather than becoming `disabled`, which would drop focus to
  `<body>`.
- A `role="status"` region announces "Wird gesendet …".

**Honeypot.** The honeypot inputs stay.

### Steps

One constant feeds both the intro box and the confirmation page **[Agnes:
timing, and whether Quereinstieg families need different wording]**:

1. **Anmeldung absenden.** Sie und die:der Jugendliche bekommen sofort eine
   Bestätigung per E-Mail.
2. **Anruf von Frauke Rätz.** Ab Mitte November, nach dem Tag der offenen Tür,
   vereinbaren wir das Aufnahmegespräch.
3. **Aufnahmegespräch.** Etwa 30 Minuten mit der:dem Jugendlichen; in den
   letzten 10 Minuten sind Sie dabei.
4. **Zu- oder Absage.** Ab Jänner.

The intro shows only the bold titles. The confirmation page shows titles and
descriptions.

### Confirmation page (`/aufnahme/formular/danke`)

- h1: "Danke, wir haben Ihre Anmeldung erhalten". The h1 has `tabIndex=-1` and
  receives focus on mount, so a screen reader announces the new page after the
  client-side redirect.
- "Wir haben eine Bestätigung an die angegebenen E-Mail-Adressen geschickt."
- Muted hint: "Keine E-Mail da? Schauen Sie im Spam-Ordner nach oder schreiben
  Sie an office@walz.at."
- "So geht es weiter": the steps, with step 1 marked done.
- Box "Für dich bis zum Gespräch" (in "du", as in the confirmation email):
  "Schicke drei Gründe, warum du in die Walz gehen möchtest, per E-Mail an
  agnes.chorherr@walz.at, und überlege dir eine kreative Antwort auf die Frage,
  was du mit der Walz verbindest."
- Link "Zurück zur Aufnahme".
- All text uses the normal page colours, which fixes the contrast failure.

The page names no address. Carrying the parent's email across the redirect would
mean putting personal data in a session or the URL.

In the rare case that only the confirmation email failed, the "Bestätigung
geschickt" sentence is wrong. The office has the registration and calls anyway,
and the spam hint names office@walz.at; that trade-off is accepted.

## Behaviour

### Validation

**Timing**

- The `<form>` sets `noValidate`. Inputs keep `required`, so screen readers
  still announce "erforderlich".
- **Empty required fields** are reported only after a submit.
- **Format checks** run client-side, and only when the field has a value:
  - Email fields are checked on blur.
  - The date-of-birth group is checked when focus leaves the fieldset
    (`focusout` with `relatedTarget` outside it), so tabbing from Tag to Monat
    reports nothing.
  - An error clears on input as soon as the value is valid.

**After a failed submit**

- An error summary appears above the first section.
  - Its heading reads "Bitte prüfen Sie 1 Angabe" or "Bitte prüfen Sie N
    Angaben".
  - It lists one link per error, pointing at the input that is wrong.
  - Each link's click handler focuses that input and scrolls its label or legend
    into view; the `href="#id"` stays as the no-JS fallback.
- With JavaScript, an effect moves focus to the summary (`tabIndex=-1`) whenever
  a new action result arrives. Without JavaScript, the summary renders at the
  top of the reloaded page, and focus is not promised.
- Each field repeats its message between hint and input, with an alert icon.
- `aria-describedby` on each input lists its hint id and its error id.
- **The date group:**
  - The error id goes into each of its three inputs' `aria-describedby`.
  - `aria-invalid="true"` marks the inputs that are wrong:
    - all three for "all empty", "not a real date" or "in the future";
    - only the empty ones for "partly empty";
    - only the year for "year not 4 digits".
- The page renders `<title>` itself (React 19 hoists it) with the "Fehler: "
  prefix. The route's `meta` returns an empty array, which overrides the root
  `meta` title "Walz" (`app/root.tsx`), so there is exactly one `<title>`.

**Mail failure**

- The notification to the office fails, so nothing was recorded.
- A form-level message takes the summary's position and receives focus: "Ihre
  Anmeldung konnte gerade nicht gesendet werden. Bitte versuchen Sie es in ein
  paar Minuten noch einmal oder schreiben Sie an office@walz.at."
- All values stay.

**Analytics**

- The "Aufnahme Form Error" event fires on every action result that is not a
  redirect, with the property `type: 'validation' | 'mail'`.
- `docs/analytics-messplan.md` lists the new property.

### Messages

All messages live in the schema. They name the person, so lines in the error
summary stay distinguishable.

| Field                            | Condition                    | Message                                                                                                |
| -------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| `parent1Name`                    | empty                        | Geben Sie Ihren Vor- und Nachnamen ein                                                                 |
| `parent1Email`                   | empty                        | Geben Sie Ihre E-Mail-Adresse ein                                                                      |
| `parent1Email`                   | invalid                      | Geben Sie Ihre E-Mail-Adresse im Format name@beispiel.at ein                                           |
| `parent1Phone`                   | empty                        | Geben Sie Ihre Telefonnummer ein                                                                       |
| `parent1Street`                  | empty                        | Geben Sie Ihre Straße und Hausnummer ein                                                               |
| `parent1PostalCode`              | empty                        | Geben Sie Ihre Postleitzahl ein                                                                        |
| `parent1City`                    | empty                        | Geben Sie Ihren Wohnort ein                                                                            |
| `parent1Country`                 | empty                        | Geben Sie Ihr Land ein                                                                                 |
| `studentName`                    | empty                        | Geben Sie den Vor- und Nachnamen ein                                                                   |
| `studentEmail`                   | empty                        | Geben Sie die E-Mail-Adresse ein                                                                       |
| `studentEmail`                   | invalid                      | Geben Sie die E-Mail-Adresse im Format name@beispiel.at ein                                            |
| birthdate                        | all empty                    | Geben Sie das Geburtsdatum ein                                                                         |
| birthdate                        | partly empty                 | Das Geburtsdatum muss Tag, Monat und Jahr enthalten                                                    |
| birthdate                        | year not 4 digits            | Das Jahr muss vier Ziffern haben                                                                       |
| birthdate                        | not a real date              | Das Geburtsdatum muss ein gültiges Datum sein                                                          |
| birthdate                        | in the future                | Das Geburtsdatum muss in der Vergangenheit liegen                                                      |
| `studentStreet` … (box unticked) | empty                        | Geben Sie Straße und Hausnummer ein / die Postleitzahl … / den Wohnort … / das Land ein                |
| `currentGrade`                   | empty                        | Geben Sie die derzeitige Klasse oder Schulstufe ein                                                    |
| `schoolHistory`                  | empty                        | Geben Sie die besuchten Schulen nach der Volksschule ein                                               |
| `schoolHistory`                  | over 2000 characters         | Die Liste der Schulen darf höchstens 2000 Zeichen lang sein                                            |
| `parent2Name`                    | other parent-2 data, no name | Geben Sie den Namen der weiteren erziehungsberechtigten Person ein                                     |
| `parent2Email`                   | invalid                      | Geben Sie die E-Mail-Adresse der weiteren erziehungsberechtigten Person im Format name@beispiel.at ein |
| any single-line text             | over 200 characters          | Dieser Eintrag ist zu lang (höchstens 200 Zeichen)                                                     |

### Data flow

1. **Read.** The action reads `FormData`, rejects bots, checks the honeypot, and
   turns the form data into a plain object of raw strings.
2. **Validate.** `aufnahmeFormSchema.safeParse(raw)` runs before anything is
   copied:
   - Child address fields are validated only when `studentSameAddress` is off.
   - Parent 2 counts as given when any of `parent2Name`, `parent2Phone`,
     `parent2Email`, `parent2Street`, `parent2PostalCode` or `parent2City` has a
     value. The checkbox and the defaulted country do not count.
   - If parent 2 is given, the name is required; the email is checked for format
     when present; the address stays optional.
   - The three date parts become `studentBirthdate` (`YYYY-MM-DD`).
3. **On failure** the action returns
   `data({ fieldErrors, values }, { status: 400 })`:
   - `fieldErrors` holds the first message per field; group errors are keyed by
     group (`studentBirthdate`).
   - `values` holds the raw submitted strings.
   - Inputs read `defaultValue` from `values`.
   - Checkboxes read `defaultChecked={values ? values.x === 'on' : default}`,
     because an unticked box is absent from `FormData`.
   - The `source` radio and `<details open>` restore the same way.
   - A no-JS round trip therefore keeps every entry and every reveal.
4. **Resolve addresses** (`resolveAddresses(parsed)`, after a successful parse):
   - The child, and parent 2 when given, get the parent-1 address when their box
     is ticked.
   - The result carries `sameAddressAsParent1: boolean` per person for the
     email.
   - Parent 2 is absent when not given.
5. **Send.**
   - The office notification goes first. On failure, `Sentry.captureException`
     and return `data({ formError: 'mail', values }, { status: 502 })`.
   - The parents' confirmation goes second. On failure,
     `Sentry.captureException` and redirect anyway.
   - Then redirect to `SUCCESS_PATH`.

### Show and hide without JavaScript

- The address fields after each "Wohnt an Ihrer Adresse" checkbox are always
  rendered.
- A `:has(input[name=…SameAddress]:checked)` rule hides them while the box is
  ticked; the "Anderes" text field works the same way. `display: none` also
  removes them from the tab order and the accessibility tree.
- `noValidate` keeps hidden `required` fields from blocking a submit, and the
  schema skips them.
- So the reveal works without hydration, and nothing depends on React state.
- A browser without `:has()` (pre-2023) shows the fields even while the box is
  ticked, and the server then uses the parent's address. This is accepted.

## Architecture

| Unit                                          | Responsibility                                                                                                                                                                          |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/utils/aufnahme-form.ts`                  | Field names, schema, messages, `resolveAddresses`, steps constant, source options. Shared by client (format checks) and server.                                                         |
| `app/components/form-field.tsx`               | `Field`: label, optional hint, error with icon, wiring of `id`, `aria-describedby` and `aria-invalid` for one input. `FieldGroup`: the same for fieldsets (date, radios).               |
| `app/routes/aufnahme+/formular.tsx`           | Loader (legacy redirect), action, page. Composes `AddressFields`, `BirthdateFields` and `ErrorSummary`, which stay local to the route file unless reused. Sets `handle.hideNewsletter`. |
| `app/routes/aufnahme+/formular_.danke.tsx`    | Confirmation page using the steps constant.                                                                                                                                             |
| `app/utils/email.server.ts`                   | `AufnahmeFormData` takes the resolved data; the notification text is below.                                                                                                             |
| `app/components/ui/input.tsx`, `textarea.tsx` | `text-sm` becomes `text-base` (16px) site-wide, which stops iOS from zooming. This also affects `newsletter.tsx`.                                                                       |
| `app/styles/app.css`                          | `--input` (border) and `--ring` darkened to at least 3:1 against `--card` and `--background`.                                                                                           |
| `app/components/shell.tsx`                    | Hides the newsletter box when a matched route's `handle.hideNewsletter` is true.                                                                                                        |

**Visual treatment**

- Section legends: numbered (`1`, `2` …), condensed font, `text-h5`.
  Sub-headings "Wohnadresse" and "Schule" use `text-h6`.
- Labels: `text-body-sm`, `font-medium`, foreground colour (today they are muted
  and xs).
- Hints: muted `text-body-xs`.
- Errors: `text-foreground-danger` with an alert icon. The input gets a 2px
  `border-input-invalid` border.
- Checkboxes and radios: native, `accent-primary`, 20px. The whole label is
  clickable.

**Notification email**

```
JUGENDLICHE:R
Name: …
E-Mail: …
Geburtsdatum: 14.03.2012
Adresse: Lindengasse 12/2/14, 1070 Wien, Österreich (wie erziehungsberechtigte Person 1)
Derzeitige Klasse/Schulstufe: …

SCHULEN NACH DER VOLKSSCHULE
<schoolHistory as entered>

ERZIEHUNGSBERECHTIGTE PERSON 1
Name / Telefon / E-Mail / Adresse

ERZIEHUNGSBERECHTIGTE PERSON 2
Nicht angegeben | Name / Telefon / E-Mail / Adresse (only lines with values)

WIE AUF UNS AUFMERKSAM GEWORDEN
<option label>[: sourceOther] | Nicht angegeben
```

- The "(wie erziehungsberechtigte Person 1)" suffix appears only when the
  address was copied, so the office can confirm it on the phone.
- The confirmation email stays unchanged.

## Testing

TDD throughout; every test fails before its code exists. The uncommitted
email-test edits from before this spec get rewritten against it.

**Unit (Vitest): `app/utils/aufnahme-form.test.ts`**

- Valid data parses.
- Each required message appears, naming the right person.
- Date of birth:
  - invalid dates (31.02.) and future dates are rejected;
  - partial input and a pasted "14.03.2012" in Tag are rejected;
  - the parsed value is in ISO format.
- A ticked child box skips child address validation: an empty `parent1Street`
  yields exactly one error.
- Parent 2:
  - a phone without a name yields the name error;
  - the defaulted country and checkbox alone do not count as "given".
- `source`: optional; "Anderes" keeps `sourceOther`; `sourceOther` is ignored
  for any other option.
- `resolveAddresses`: copies and sets the flag; leaves an unticked parent 2
  alone.
- Length limits are enforced.

**Action: `app/routes/resources+/aufnahme-form.test.ts`**

- Success redirects.
- Validation failure returns 400 with `fieldErrors` and `values`.
- Notification failure returns `formError: 'mail'` and keeps the values.
- Confirmation failure still redirects.
- The office notification is sent before the confirmation.
- The email modules stay mocked at the boundary, as today; Sentry is mocked the
  way `error-boundary.test.tsx` does it.

**Email: `app/utils/email.server.test.ts`**

- Address lines are written out, with the "wie … Person 1" suffix only when
  copied.
- The school-history block appears.
- The parent-2 block lists only lines with values.
- The source label appears.
- Resend stays stubbed at HTTP.

**E2E (Playwright): `tests/aufnahme-form.spec.ts`**

- Existing tests to rewrite:
  - every fill (new fields, located by id where labels repeat);
  - the heading "Aufnahmeformular" in "should navigate to form from aufnahme
    page" and "…from Quereinstieg section";
  - the text "Vielen Dank für Ihre Anmeldung!" in the submit, parent-2, loading
    and legacy-redirect tests.
- New tests:
  - An empty submit shows a focused error summary, and its links focus the
    fields.
  - Values survive a failed submit.
  - Clearing "Wohnt an Ihrer Adresse" reveals the child's address fields.
  - The further-guardian disclosure works.
  - The confirmation page shows the steps and focuses the h1.
  - The newsletter box is absent on the form.

**Accessibility: `@axe-core/playwright`**

- Scans the empty form, the error state and the confirmation page.
- No violations at WCAG 2.2 AA.
- Border contrast (1.4.11) is checked by hand, because axe does not test it.

**Manual autofill checklist (Ferdinand, real devices)**

- On iOS Safari and Android Chrome, one autofill fills section 1 completely.
- Autofill does not offer the parent's data in the child's name, email or date
  fields; Chrome may ignore `autocomplete=off`, so check this.

## Review loop

1. **Spec review.** Done: an independent agent applied design-critique,
   accessibility-review and ux-copy to the first draft, and this revision
   addresses its findings. Ferdinand reviews this revision next.
2. **Build review.**
   - Screenshots at 375px and 1024px of the empty form, the error state, the
     unticked address, the confirmation page, and the newsletter box elsewhere
     (16px change).
   - A keyboard-only pass.
   - The reviewer agent critiques the screenshots against this spec; I revise.
3. **Agnes review.**
   - A shared review document with the screenshots and every **[Agnes]** item,
     for her comments.
   - Her answers go back into copy before release.

## Questions for Agnes

1. **Privacy notice:** is the wording right, does the school delete data when no
   contract follows, and when?
2. **Steps:** is the timing right, and do Quereinstieg families need different
   wording? The confirmation email has the same gap.
3. **"Wie aufmerksam geworden":** are these the right options?
4. **Child's email:** many 13-year-olds have none. Is a parent's address
   acceptable there, as the hint says?
5. **Wording:** the form now says "erziehungsberechtigte Person" and avoids the
   gender colon in its own labels; the option labels keep the site's colon.
   Should the site keep the colon at all? The blind-and-visually-impaired
   association DBSV prefers the asterisk for screen readers.
6. **Audience on `/aufnahme`:** the page tells the child "fülle bitte das
   Anmeldeformular aus", while the form addresses the parent. Should that
   sentence change?

## Preconditions and out of scope

**Precondition**

- Ferdinand creates the Plausible goals `Aufnahme Form Start`,
  `Aufnahme Form Error` and the pageview `/aufnahme/formular/danke`. Without
  them, "fewer abandoned forms" cannot be measured before or after.

**Out of scope**

- An "applying for which entry" field.
- Splitting names into first and last.
- Changing the confirmation email.
- Saving drafts.
- Deleting the unused draft `app/routes/aufnahme+/__formular.tsx`.
