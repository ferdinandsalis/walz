# Aufnahmeformular Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/aufnahme/formular` and `/aufnahme/formular/danke` as the
parent-first, single-page, accessible form described in the spec.

**Architecture:** One shared module (`app/utils/aufnahme-form.ts`) holds the
copy, validation and address resolution; the server action and the client format
checks both call it. The route renders server-validated state (`fieldErrors` +
`values`) so the form works without JavaScript. CSS `:has()` handles show/hide;
React only adds focus management, on-blur format checks and the submit guard.

**Tech Stack:** React Router 7 (framework mode, flat routes), React 19,
TypeScript, zod 4, Tailwind CSS 4, Vitest 4, Playwright 1.60, Resend, Sentry
(`@sentry/react-router`).

**Spec:** `docs/plans/2026-10-07-aufnahmeformular-redesign-design.md`. Every
German string and every message comes from the spec verbatim; this plan does not
repeat copy.

## Global Constraints

- **TDD:** every production change has a test that was watched failing first.
- **Commits:** no "Claude" mention and no `Co-Authored-By` line (project
  CLAUDE.md). Signed commits; if GPG fails, stop and ask Ferdinand to unlock the
  key.
- **Runtime:** run Node commands via `mise exec node@24 --`. The shell defaults
  to Node 22; `package.json` needs 24.
- **Vitest:** `console.error` throws unless the test mocks it
  (`tests/setup/setup-test-env.ts`). Every test that expects an error log spies
  on it and asserts the call.
- **E2E port:** run with a free port. `:3000` is held by OrbStack and
  `reuseExistingServer` would silently test it. Check `lsof -iTCP:<port>` first,
  then run `mise exec node@24 -- env PORT=<port> npx playwright test …`.
- **E2E sends real mail:** completed e2e submissions send real Resend mail to
  `delivered+…@resend.dev` (the school copy goes to `delivered@resend.dev`
  outside production). Use only `delivered+…@resend.dev` addresses in e2e
  fixtures, and do not loop the suite needlessly.
- **Route modules:** non-route files under `app/routes/` must match an ignored
  pattern (`**/__*.*`, `*.query.ts`, `*.test.*`). Shared form code goes in
  `app/utils/` or `app/components/`.
- **Language:** Sie for parents; "du" only in the "Für Ihr Kind" box. The form's
  own labels use no gender colon; the option labels keep it.
- **Personal data:** never in URLs, analytics props or logs.
- **Out of scope:** `__formular.tsx` and the confirmation email text.

## Review Focus

1. **Whitespace-only or padded input** (" ", " anna@x.at ") counts as empty or
   trimmed, never as a valid name or a broken email. Test in Task 1.
2. **Non-ASCII names and addresses** ("Zoë Ğül-Müller", "Straße 5/2/14") pass
   validation and reach the email unchanged. Tests in Task 1 and Task 3.
3. **A second guardian opened, filled and then cleared** counts as "not given",
   and leaves no ghost block in the email. Test in Task 1.
4. **A double tap on "Anmeldung absenden"** posts exactly once. Test in Task 6.
5. **A failed submit after the parent unticked the child's address box** brings
   the page back with the box still unticked and the typed address visible
   (no-JS round trip). Test in Task 5.

---

## File map

| File                                          | Change | Responsibility                                                                                    |
| --------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------- |
| `app/utils/aufnahme-form.ts`                  | create | Steps, source options, parsing and validation, birthdate check, address resolution, format checks |
| `app/utils/aufnahme-form.test.ts`             | create | Unit tests for the above                                                                          |
| `app/components/form-field.tsx`               | create | `Field`, `FieldGroup`, `fieldIds`                                                                 |
| `app/components/form-field.test.tsx`          | create | Static-markup tests for ARIA wiring                                                               |
| `app/components/ui/input.tsx`, `textarea.tsx` | modify | `text-sm` → `text-base`                                                                           |
| `app/styles/app.css`                          | modify | `--input`, `--ring` reach ≥ 3:1                                                                   |
| `app/utils/email.server.ts`                   | modify | Take `AufnahmeSubmission`; new notification text                                                  |
| `app/utils/email.server.test.ts`              | modify | Rewrite fixtures and tests (discard the uncommitted edits first)                                  |
| `app/routes/aufnahme+/formular.tsx`           | modify | Action, page, `handle`                                                                            |
| `app/routes/resources+/aufnahme-form.test.ts` | modify | Action tests                                                                                      |
| `app/routes/aufnahme+/formular_.danke.tsx`    | modify | Confirmation page                                                                                 |
| `app/components/shell.tsx`                    | modify | Hide newsletter by route `handle`                                                                 |
| `tests/aufnahme-form.spec.ts`                 | modify | E2E rewrite and new tests                                                                         |
| `tests/aufnahme-a11y.spec.ts`                 | create | axe scans                                                                                         |
| `docs/analytics-messplan.md`                  | modify | `type` prop on `Aufnahme Form Error`                                                              |
| `package.json`                                | modify | devDependency `@axe-core/playwright`                                                              |

---

### Task 1: Form rules module

**Files:**

- Create: `app/utils/aufnahme-form.ts`, `app/utils/aufnahme-form.test.ts`

**Interfaces:**

- Produces (all exported from `app/utils/aufnahme-form.ts`):

```ts
export type Address = {
  street: string
  postalCode: string
  city: string
  country: string
}
export type SourceValue =
  | 'freunde-familie'
  | 'walz-gemeinschaft'
  | 'internet'
  | 'veranstaltung'
  | 'social-media'
  | 'anderes'
export const SOURCE_OPTIONS: ReadonlyArray<{
  value: SourceValue
  label: string
}>
export const AUFNAHME_STEPS: ReadonlyArray<{
  title: string
  description: string
}>
export const DEFAULT_COUNTRY = 'Österreich'
export const AUFNAHME_FIELD_NAMES: ReadonlyArray<string> // every form field name from the spec, nothing else
export type BirthdatePart = 'day' | 'month' | 'year'
export function checkBirthdate(
  day: string,
  month: string,
  year: string,
  today?: Date,
):
  | { ok: true; iso: string }
  | { ok: false; message: string; parts: BirthdatePart[] }
export type FormatCheckedField =
  | 'parent1Email'
  | 'studentEmail'
  | 'parent2Email'
export function checkEmailFormat(
  field: FormatCheckedField,
  value: string,
): string | undefined
export type AufnahmeInput = {
  parent1: { name: string; email: string; phone: string; address: Address }
  student: {
    name: string
    email: string
    birthdate: string
    sameAddress: boolean
    address?: Address
    currentGrade: string
    schoolHistory: string
  }
  parent2?: {
    name: string
    email?: string
    phone?: string
    sameAddress: boolean
    address?: Address
  }
  source?: { value: SourceValue; other?: string }
}
export function parseAufnahmeForm(
  raw: Record<string, string>,
):
  | { success: true; data: AufnahmeInput }
  | { success: false; fieldErrors: Record<string, string> }
export type Guardian = {
  name: string
  email?: string
  phone?: string
  address?: Address
  sameAddressAsParent1: boolean
}
export type AufnahmeSubmission = {
  parent1: Guardian & { email: string; phone: string; address: Address }
  student: {
    name: string
    email: string
    birthdate: string
    address: Address
    sameAddressAsParent1: boolean
    currentGrade: string
    schoolHistory: string
  }
  parent2?: Guardian
  source?: { label: string; other?: string }
}
export function resolveAddresses(input: AufnahmeInput): AufnahmeSubmission
export function formatAddress(address: Address): string // "Lindengasse 12/2/14, 1070 Wien, Österreich"
```

- `fieldErrors` keys are the form field names from the spec. The date group uses
  the key `studentBirthdate`. Each value is the spec message (first failure
  only).
- Checkboxes arrive as `'on'` when ticked; absent means unticked.

**Steps:**

- [ ] **Step 1: Discard the uncommitted edits in
      `app/utils/email.server.test.ts`.** They predate the spec; Task 3 rewrites
      the file.

  Run: `git checkout app/utils/email.server.test.ts && git status --short`
  Expected: clean tree.

- [ ] **Step 2: Write the failing tests** in `app/utils/aufnahme-form.test.ts`.
      Start from a `validRaw` fixture (parent 1 complete, child with
      `studentSameAddress: 'on'`, no parent 2, no source). Assert exact spec
      messages.

  - `parses a complete form`. `success` is true;
    `data.student.birthdate === '2012-03-14'` for day `'14'`, month `'3'`, year
    `'2012'`.
  - `reports each missing required field with its person-specific message`.
    Table-driven over `parent1Name`, `parent1Email`, `parent1Phone`,
    `parent1Street`, `parent1PostalCode`, `parent1City`, `parent1Country`,
    `studentName`, `studentEmail`, `currentGrade`, `schoolHistory`, each set to
    `''`. `fieldErrors[name]` equals the spec message.
  - `treats whitespace-only input as empty and trims padded values`.
    - `studentName: '   '` gives the empty-name message.
    - `parent1Email: ' anna@beispiel.at '` parses to `'anna@beispiel.at'`.
  - `accepts non-ASCII names and addresses`. `studentName: 'Zoë Ğül-Müller'` and
    `parent1Street: 'Straße 5/2/14'` parse unchanged.
  - `rejects a malformed email with the format message` (each of the three email
    fields).
  - `checkBirthdate`:
    - `('', '', '')` gives the all-empty message, parts
      `['day','month','year']`.
    - `('14', '', '2012')` gives the partly-empty message, parts `['month']`.
    - `('14', '3', '12')` gives the year message, parts `['year']`.
    - `('31', '2', '2012')` gives "not a real date", all parts.
    - `('14.03.2012', '', '')` gives the partly-empty message (no truncation, no
      crash).
    - A date after the injected `today` gives the future message.
    - `(' 4 ', '03', '2012')` gives ok with `'2012-03-04'`.
  - `validates the child address only when the box is unticked`.
    - With `studentSameAddress: 'on'`, an empty `parent1Street` yields exactly
      one error, and none under `studentStreet`.
    - Without the box, empty child address fields yield the four child messages.
  - `requires a name once any second-guardian data is given`.
    `parent2Phone: '0660 1'` without a name gives the `parent2Name` error.
  - `ignores the second guardian when only defaults remain`. With
    `parent2Country: 'Österreich'` and `parent2SameAddress: 'on'` but nothing
    else, `data.parent2` is `undefined`.
  - `drops a second guardian whose fields were all cleared`. All parent-2 text
    fields `''` gives `data.parent2` `undefined`.
  - `keeps sourceOther only for "anderes"`.
    - `source: 'internet', sourceOther: 'x'` gives `{ value: 'internet' }`.
    - `source: 'anderes', sourceOther: 'Plakat'` keeps `other`.
    - An absent source gives `undefined`.
  - `enforces length limits`. `schoolHistory` of 2001 chars and `parent1City` of
    201 chars give the spec messages.
  - `resolveAddresses`:
    - With the box ticked, the child gets parent 1's address and
      `sameAddressAsParent1: true`.
    - A parent 2 with the box ticked gets the copy too; unticked, it keeps its
      own (possibly undefined) address.
    - `source` resolves to the option label.
  - `formatAddress` joins as `"Lindengasse 12/2/14, 1070 Wien, Österreich"`.

- [ ] **Step 3: Run the tests to verify they fail.**

  Run: `mise exec node@24 -- npx vitest run app/utils/aufnahme-form.test.ts`
  Expected: FAIL, module not found.

- [ ] **Step 4: Implement `app/utils/aufnahme-form.ts`.**

  - Build zod schemas per person over `z.string().trim()`.
  - Apply the conditional rules (child address, parent-2 presence) in
    `parseAufnahmeForm` before or around the zod parse.
  - Map issues to `fieldErrors` by first path segment, keeping only the first
    message per key.
  - `checkBirthdate` uses `Date.UTC` round-tripping to detect impossible dates.
  - "Given" for parent 2 means any of name, phone, email, street, PLZ or city is
    non-empty.

- [ ] **Step 5: Run the tests to verify they pass.**

  Run: `mise exec node@24 -- npx vitest run app/utils/aufnahme-form.test.ts`
  Expected: PASS, no console output.

- [ ] **Step 6: Commit.**

  ```bash
  git add app/utils/aufnahme-form.ts app/utils/aufnahme-form.test.ts
  git commit -m "Validate the Aufnahme form in one shared module"
  ```

### Task 2: Form field primitives and readable inputs

**Files:**

- Create: `app/components/form-field.tsx`, `app/components/form-field.test.tsx`
- Modify: `app/components/ui/input.tsx`, `app/components/ui/textarea.tsx`,
  `app/styles/app.css` (`--input`, `--ring` in `:root`)

**Interfaces:**

- Produces:

```ts
export function fieldIds(name: string): { hintId: string; errorId: string } // `${name}-hint`, `${name}-error`
export type ControlProps = {
  id: string
  name: string
  'aria-describedby'?: string
  'aria-invalid'?: true
}
export function Field(props: {
  name: string
  label: ReactNode
  hint?: ReactNode
  error?: string
  className?: string
  children: (control: ControlProps) => ReactNode
}): JSX.Element
export function FieldGroup(props: {
  name: string
  legend: ReactNode
  hint?: ReactNode
  error?: string
  className?: string
  children: ReactNode
}): JSX.Element // <fieldset> + <legend>; renders hint and error with fieldIds(name)
export function FieldError(props: { id: string; children: string }): JSX.Element // alert icon + text-foreground-danger
```

- Order inside `Field`: label, hint, error, control (GOV.UK order).

**Steps:**

- [ ] **Step 1: Write the failing tests** with `renderToStaticMarkup`:
  - `wires hint and error into aria-describedby`. `Field name="x"` with hint and
    error renders the control with `aria-describedby="x-hint x-error"` and
    `aria-invalid="true"`, and `<label for="x">`.
  - `omits aria-invalid and the error id without an error`.
  - `renders label, hint, error, control in that order`. Compare `indexOf`s in
    the markup.
  - `FieldGroup renders a fieldset with legend, hint and error ids`.

- [ ] **Step 2: Run to verify fail.**

  Run: `mise exec node@24 -- npx vitest run app/components/form-field.test.tsx`
  Expected: FAIL, module not found.

- [ ] **Step 3: Implement `form-field.tsx`.**
  - Labels: `text-body-sm font-medium text-foreground`.
  - Hints: `text-body-xs text-muted-foreground`.
  - Error icon: `WarningCircle` from `@phosphor-icons/react`, `aria-hidden`.

- [ ] **Step 4: Change the shared inputs and tokens.**
  - Change `text-sm` to `text-base` in `Input` and `Textarea`.
  - Add `aria-invalid:border-input-invalid aria-invalid:border-2` to both.
  - Darken `--input` and `--ring` in `app/styles/app.css` until each reaches ≥
    3:1 against `--card` and `--background`. Record the computed ratios in the
    commit message.

- [ ] **Step 5: Run to verify pass.**

  Run:
  `mise exec node@24 -- npx vitest run app/components/form-field.test.tsx && mise exec node@24 -- npm run typecheck`
  Expected: PASS.

- [ ] **Step 6: Commit.**

  ```bash
  git add app/components/form-field.tsx app/components/form-field.test.tsx app/components/ui/input.tsx app/components/ui/textarea.tsx app/styles/app.css
  git commit -m "Add accessible form field primitives and 16px inputs"
  ```

### Task 3: Notification and confirmation emails take the resolved submission

**Files:**

- Modify: `app/utils/email.server.ts`, `app/utils/email.server.test.ts`

**Interfaces:**

- Consumes: `AufnahmeSubmission`, `formatAddress` (Task 1).
- Produces:
  - `sendAufnahmeConfirmationEmail(data: AufnahmeSubmission)`
  - `sendAufnahmeNotificationEmail(data: AufnahmeSubmission)`
  - Both return `Promise<{ success: boolean; error?: string }>`, as today.
  - The `AufnahmeFormData` interface is deleted.

**Steps:**

- [ ] **Step 1: Write the failing tests.**
  - Replace the `aufnahme` fixture with an `AufnahmeSubmission` that has a
    non-ASCII street.
  - Keep the four existing tests: the Resend 401 reporting and the
    inbox-per-environment tests.
  - Add `textOf(fetch)`, which reads `text` from the stubbed request body.
  - New tests:
    - `writes each address on one line`. Contains
      `Adresse: Lindengasse 12/2/14, 1070 Wien, Österreich`.
    - `marks a copied address`. With `sameAddressAsParent1: true` for the child,
      it contains `(wie erziehungsberechtigte Person 1)` once.
    - `lists the school history under its own heading`. Contains
      `SCHULEN NACH DER VOLKSSCHULE\n<history>`.
    - `formats the birthdate as dd.mm.yyyy`. Contains
      `Geburtsdatum: 14.03.2012`.
    - `prints only the second guardian's given lines`. With a parent 2 of only
      name and phone, the block has no `E-Mail:` and no `Adresse:` line.
    - `says "Nicht angegeben" without a second guardian`.
    - `names the source option and the free text`. Contains `Anderes: Plakat`;
      without a source, `Nicht angegeben`.
    - `sends the confirmation to the child, parent 1 and parent 2`. The
      recipients equal all three emails; parent 2 is left out when it has no
      email.

- [ ] **Step 2: Run to verify fail.**

  Run: `mise exec node@24 -- npx vitest run app/utils/email.server.test.ts`
  Expected: FAIL on the new assertions; typecheck errors are acceptable here.

- [ ] **Step 3: Implement.**
  - Rewrite the notification body to the spec's layout.
  - Leave the confirmation text untouched; only its recipients come from the new
    shape.

- [ ] **Step 4: Run to verify pass.**

  Run: `mise exec node@24 -- npx vitest run app/utils/email.server.test.ts`
  Expected: PASS.

- [ ] **Step 5: Commit** (`app/utils/email.server.ts`,
      `app/utils/email.server.test.ts`): "Write structured addresses and school
      history into the Aufnahme email".

### Task 4: Action — validate, keep values, office mail first

**Files:**

- Modify: `app/routes/aufnahme+/formular.tsx` (action only; the component keeps
  compiling with minimal type fixes), and
  `app/routes/resources+/aufnahme-form.test.ts`.

**Interfaces:**

- Consumes: `parseAufnahmeForm`, `resolveAddresses` (Task 1), the email
  functions (Task 3).
- Produces:
  `type AufnahmeActionData = | { fieldErrors: Record<string, string>; values: Record<string, string> } | { formError: 'mail'; values: Record<string, string> }`.
  - Validation failure returns status 400 via `data()`.
  - Mail failure returns status 502.
  - Success redirects to `SUCCESS_PATH`.
  - `values` holds only keys from `AUFNAHME_FIELD_NAMES`, so honeypot fields
    never echo back.

**Steps:**

- [ ] **Step 1: Write the failing tests.**
  - Keep the existing mocks.
  - Add `vi.mock('@sentry/react-router', () => ({ captureException }))` with
    `captureException` from `vi.hoisted`, as in `error-boundary.test.tsx`.
  - Rewrite `validFormData` to the new field names.
  - Tests:
    - `redirects after sending both emails, office first`. The notification
      mock's `invocationCallOrder` is less than the confirmation's.
    - `returns 400 with field errors and the submitted values`. Missing
      `studentName` gives `init.status === 400`; `fieldErrors.studentName` is
      the spec message; `values.parent1Name` is echoed.
    - `returns a mail error and keeps the values when the office email fails`.
      Status 502, `formError: 'mail'`; the confirmation is not sent; Sentry is
      called; the `console.error` expectation is asserted.
    - `still redirects when only the confirmation fails`. Redirects to
      `/aufnahme/formular/danke`; Sentry is called.
    - The existing bot, honeypot and loader tests stay.

- [ ] **Step 2: Run to verify fail.**

  Run:
  `mise exec node@24 -- npx vitest run app/routes/resources+/aufnahme-form.test.ts`
  Expected: FAIL.

- [ ] **Step 3: Implement the action.**
  - Build `raw` from `AUFNAHME_FIELD_NAMES`, reading each with `formData.get`
    and keeping string values only.
  - Then `parseAufnahmeForm`, then `resolveAddresses`.
  - Send the notification first, then the confirmation, with `captureException`
    on each failure.

- [ ] **Step 4: Run to verify pass.**

  Run:
  `mise exec node@24 -- npx vitest run app/routes/resources+/aufnahme-form.test.ts && mise exec node@24 -- npm run typecheck`
  Expected: PASS.

- [ ] **Step 5: Commit:** "Return field errors and send the office copy first
      from the Aufnahme action".

### Task 5: The form page — sections, autofill, show/hide, restored values

**Files:**

- Modify: `app/routes/aufnahme+/formular.tsx` (component, `meta`, `handle`),
  `tests/aufnahme-form.spec.ts`

**Interfaces:**

- Consumes: Tasks 1, 2 and 4.
- Produces:
  - `export const handle = { hideNewsletter: true }` (used by Task 7).
  - Local components:
    - `AddressFields({ person: 'parent1' | 'student' | 'parent2', values, errors, autocompleteSection: string })`.
    - `BirthdateFields({ values, error?: { message: string; parts: BirthdatePart[] } })`.

**Steps:**

- [ ] **Step 1: Rewrite the e2e tests to fail against the old page.**
  - Add a `fillRequired(page)` helper. It fills the spec fields by `id` and uses
    `delivered+…@resend.dev` emails.
  - Update the headings and thank-you texts listed in the spec's Testing
    section.
  - New tests:
    - `submits a complete form with the child at the parent's address`. Lands on
      `/aufnahme/formular/danke`.
    - `reveals the child's address fields when the box is cleared`.
      `#studentStreet` is hidden, then visible after `uncheck`.
    - `opens the further guardian section and keeps its address box unticked`.
    - `reveals "Woher genau?" only for "Anderes"`.
    - `keeps every entry and the unticked box after a failed submit without JavaScript`.
      Use a `test.use({ javaScriptEnabled: false })` block: fill everything
      except `currentGrade`, untick the child box, fill the child address,
      submit. Expect `#studentSameAddress` unchecked, `#studentStreet` visible
      with its value, and `#parent1Name` still filled.

- [ ] **Step 2: Run to verify fail.**

  Run:
  `mise exec node@24 -- env PORT=<port> npx playwright test tests/aufnahme-form.spec.ts`
  Expected: the new tests FAIL (missing ids, headings).

- [ ] **Step 3: Implement the page per the spec's "Page content".**
  - `noValidate`; `required` stays on the required inputs.
  - Autofill tokens as in the spec tables.
  - Show/hide with Tailwind `group` and
    `group-has-[[name=studentSameAddress]:checked]:hidden`, and the equivalents
    for parent 2 (hidden when ticked) and "Anderes" (shown when
    `[value=anderes]:checked`).
  - `defaultValue` and `defaultChecked` come from `actionData?.values`, with the
    fallbacks from the spec's "Data flow" step 3.
  - `<details open>` when any parent-2 value or error exists.
  - `meta` returns `[]`; render `<title>` in the component.
  - Steps and source options come from Task 1 constants.
  - Leave `handle.hideNewsletter` exported (Task 7 consumes it).

- [ ] **Step 4: Run to verify pass.** The same command; expected: PASS. Also run
      `npm run typecheck` and `npm run lint`.

- [ ] **Step 5: Commit:** "Rebuild the Aufnahme form parent-first with
      structured addresses".

### Task 6: Errors, focus, format checks and the submit guard

**Files:**

- Modify: `app/routes/aufnahme+/formular.tsx`, `tests/aufnahme-form.spec.ts`,
  `docs/analytics-messplan.md`

**Interfaces:**

- Consumes: `fieldErrors`/`formError` (Task 4), `checkEmailFormat`,
  `checkBirthdate` (Task 1), `Field`/`FieldGroup` (Task 2).
- Produces: a local
  `ErrorSummary({ errors: Array<{ fieldId: string; message: string }>, formError?: 'mail' })`.
  - `fieldId` for the date group is the first id among its invalid parts:
    `studentBirthDay`, `studentBirthMonth` or `studentBirthYear`.

**Steps:**

- [ ] **Step 1: Write the failing e2e tests.**
  - `focuses an error summary that links to each problem`. Submit empty; the
    summary is focused and its heading reads "Bitte prüfen Sie N Angaben".
    Clicking the "Geben Sie den Vor- und Nachnamen Ihres Kindes ein" link
    focuses `#studentName`.
  - `prefixes the page title on errors`.
    `await expect(page).toHaveTitle('Fehler: Anmeldung | Walz')`.
  - `checks the email format when leaving the field, not while typing`.
    - Type "anna@" in `#parent1Email`; no error is visible yet.
    - Tab away; the format message is visible.
    - Type the rest; the message is gone.
  - `checks the birthdate only after leaving the date group`.
    - Type "31" in Tag, Tab to Monat; no error.
    - Type "2" and "2012", then Tab out of the group; the "gültiges Datum"
      message is visible and Tag and Monat have `aria-invalid="true"`.
  - `posts once on a double click`.
    - Count POSTs to `/aufnahme/formular` with `page.on('request')`.
    - `dblclick` the submit button on a complete form.
    - Expect the count to be 1 and the URL to reach `/danke`.

- [ ] **Step 2: Run to verify fail.** The Task 5 command; expected: the new
      tests FAIL.

- [ ] **Step 3: Implement.**
  - **Summary:** above section 1. Focus it in a `useEffect` keyed on
    `actionData`. Link clicks call `preventDefault`, `focus()` the input and
    `scrollIntoView` its label or legend.
  - **Mail failure:** renders in the same slot with the spec copy.
  - **On-blur checks:** client state merges with server errors, and an error
    clears on input once the value is valid.
  - **Date group:** checks on `focusout` when `relatedTarget` is outside the
    fieldset.
  - **Submit button:**
    - `aria-disabled` and an `onSubmit` guard while
      `navigation.state !== 'idle'`.
    - A `role="status"` region announces "Wird gesendet …".
  - **Analytics:** `trackEvent('Aufnahme Form Error', { type })` fires for every
    non-redirect result.
  - **Docs:** document the `type` property in `docs/analytics-messplan.md`.

- [ ] **Step 4: Run to verify pass.** Expected: PASS, plus typecheck and lint.

- [ ] **Step 5: Commit:** "Show per-field errors with a focused summary on the
      Aufnahme form".

### Task 7: Hide the newsletter on the form

**Files:**

- Modify: `app/components/shell.tsx`, `tests/aufnahme-form.spec.ts`

**Interfaces:**

- Consumes: `handle.hideNewsletter` (Task 5).

**Steps:**

- [ ] **Step 1: Write the failing e2e test** `has no newsletter box on the form`
      in `tests/aufnahme-form.spec.ts`. On `/aufnahme/formular`, `#newsletter`
      has count 0.

  Run:
  `mise exec node@24 -- env PORT=<port> npx playwright test tests/aufnahme-form.spec.ts -g newsletter`
  Expected: FAIL.

- [ ] **Step 2: Implement.** In `FooterNavigation`, read `useMatches()`; when
      any match's `handle` has `hideNewsletter === true`, skip the `#newsletter`
      block, and the links column takes the full width.

- [ ] **Step 3: Run to verify pass.** The same command; expected: PASS. Then run
      `npx playwright test tests/pages.spec.ts`; expected: PASS (the newsletter
      still shows elsewhere).

- [ ] **Step 4: Commit:** "Leave the newsletter box off the Aufnahme form".

### Task 8: Confirmation page

**Files:**

- Modify: `app/routes/aufnahme+/formular_.danke.tsx`,
  `tests/aufnahme-form.spec.ts`

**Interfaces:**

- Consumes: `AUFNAHME_STEPS` (Task 1).

**Steps:**

- [ ] **Step 1: Write the failing e2e test**
      `explains the next steps on the confirmation page`.
  - Visit `/aufnahme/formular/danke`.
  - The h1 "Danke, wir haben Ihre Anmeldung erhalten" is visible and focused.
  - All four step titles are visible.
  - The "Für Ihr Kind bis zum Gespräch" box is visible.

- [ ] **Step 2: Run to verify fail.**

- [ ] **Step 3: Implement per the spec.**
  - Focus the h1 (`tabIndex=-1`) in an effect on mount.
  - Use no green-on-green colours.
  - Keep `handle` and `meta` `noindex`.

- [ ] **Step 4: Run to verify pass.** Run the whole
      `tests/aufnahme-form.spec.ts`; expected: PASS.

- [ ] **Step 5: Commit:** "Show the next steps on the Aufnahme confirmation
      page".

### Task 9: Automated accessibility checks

**Files:**

- Create: `tests/aufnahme-a11y.spec.ts`
- Modify: `package.json`, `package-lock.json`

**Steps:**

- [ ] **Step 1: Install the dependency.**

  Run: `mise exec node@24 -- npm install -D @axe-core/playwright` Then:
  `npm ls @axe-core/playwright` shows exactly one version and no "invalid"
  marker.

- [ ] **Step 2: Write the tests.** Each one runs
      `new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze()`
      and expects `violations` to equal `[]`:
  - `the empty form has no WCAG AA violations`
  - `the error state has no WCAG AA violations` (submit empty first)
  - `the confirmation page has no WCAG AA violations`

- [ ] **Step 3: Run.**

  Run:
  `mise exec node@24 -- env PORT=<port> npx playwright test tests/aufnahme-a11y.spec.ts`
  Expected: PASS.
  - A violation in code from Tasks 5–8 is fixed there, in this task's commit.
  - A violation in shared site chrome (header or footer) is reported to
    Ferdinand rather than silently scoped out with `exclude`.

- [ ] **Step 4: Commit** `package.json`, `package-lock.json` and
      `tests/aufnahme-a11y.spec.ts`: "Guard the Aufnahme pages with axe".

### Task 10: Full verification and build review

- [ ] **Step 1: Run the whole suite.**

  Run: `mise exec node@24 -- npm test -- --run`, then `npm run lint`,
  `npm run typecheck`, and
  `mise exec node@24 -- env PORT=<port> npx playwright test`. Expected: all pass
  with pristine output. Report any failure by name.

- [ ] **Step 2: Screenshots.** Take them at 375 × 812 and 1024 × 768 in the
      local dev server of:
  - the empty form;
  - the error state;
  - the unticked child address;
  - the opened further guardian;
  - the confirmation page;
  - a page with the newsletter box (the 16px change).

  Save them under the session scratchpad, not in the repo.

- [ ] **Step 3: Keyboard-only pass.** Tab through the form, submit empty, and
      follow a summary link. Note any focus loss or invisible focus.

- [ ] **Step 4: Independent build review.** A fresh reviewer agent with the
      design-critique and accessibility-review skills gets the spec, the
      screenshots and the diff. Fix the findings in follow-up commits, rerunning
      Step 1 after the fixes.

- [ ] **Step 5: Agnes review package.** After Ferdinand chooses the sharing
      route, a shared document with the screenshots and the spec's six
      "Questions for Agnes", so she can comment.

- [ ] **Step 6: Manual autofill checklist.** Hand Ferdinand the spec's
      real-device checklist (iOS Safari, Android Chrome).
