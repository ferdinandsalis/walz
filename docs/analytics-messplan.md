# Analytics Measurement Plan (Plausible)

What we should measure on walz.at, in priority order. The admissions
(*Aufnahme*) funnel comes first — everything else is secondary.

Status: proposal. Nothing in here is implemented yet.

---

## 1. Where we stand today

The site loads the **legacy** Plausible snippet in `app/root.tsx`:

```html
<script defer data-domain="walz.at" src="https://plausible.io/js/script.js"></script>
```

What that gives us right now:

- ✅ Pageviews, incl. client-side React Router navigations (Plausible hooks
  into the History API, so `pushState` routing is tracked automatically).
- ✅ Sources / referrers, entry pages, devices, countries.
- ✅ **Scroll depth** — measured automatically for every page, 1–100%, no setup.
  It just isn't being *looked at* yet.
- ❌ No goals configured at all, so there are no conversions in the dashboard.
- ❌ No outbound-link, file-download or form-submission tracking (these are
  opt-in and the legacy snippet has them off).
- ❌ No custom events.

### The one thing that is silently broken

The admissions form redirects to `/aufnahme/formular?success=true` on success
(`app/routes/aufnahme+/formular.tsx`). **Plausible strips query parameters by
default** (everything except `ref`, `source` and the `utm_*` params), so that
success page is recorded as `/aufnahme/formular` — indistinguishable from
someone who merely opened the empty form.

> Today we cannot tell how many people actually applied. That is the first
> thing to fix.

---

## 2. Priority 0 — the Aufnahme funnel

This is the only conversion on the site with real consequences. Everything
should be measured against it.

### The steps

| # | Step | URL / trigger | Measurable today? |
|---|------|---------------|-------------------|
| 1 | Arrives on the site | any entry page | ✅ |
| 2 | Reads the admissions page | `/aufnahme` | ✅ pageview goal |
| 3 | Reaches costs / requirements | scroll depth on `/aufnahme` | ✅ automatic |
| 4 | Clicks "Zum Anmeldeformular" | `AdmissionDay` CTA | ❌ needs event |
| 5 | Opens the form | `/aufnahme/formular` | ✅ pageview goal |
| 6 | Starts filling it in | first field interaction | ❌ needs event |
| 7 | **Submits successfully** | success state | ❌ **blocked, see above** |

Steps 2, 3 and 5 are free — they need nothing but a goal in the Plausible
settings. Steps 4, 6 and 7 need code.

### Fix step 7 first: give the success state its own URL

Replace the `?success=true` query flag with a real route, e.g.
`/aufnahme/formular/danke`:

```ts
// app/routes/aufnahme+/formular.tsx — in the action
return redirect('/aufnahme/formular/danke')
```

Then add `/aufnahme/formular/danke` as a **pageview goal** in Plausible.

Why a route rather than a custom event:

- No JavaScript involved — it is counted even if a custom event would be
  missed, and it survives a page refresh or a bookmark.
- The back button and browser history behave sensibly.
- It is also just better UX: the confirmation is a page, not a form state.
- It makes the funnel definition trivial.

Keep supporting the old `?success=true` URL for a release or two if there is
any chance of it being linked or bookmarked.

### Then measure form abandonment

The admissions form has **15 fields across four fieldsets** (student, parent 1,
parent 2, source). That is a long form for a teenager on a phone. The single
most useful number after "how many applied" is "how many started and gave up".

Two events, fired from `app/routes/aufnahme+/formular.tsx`:

| Goal | Trigger |
|------|---------|
| `Aufnahme: Formular gestartet` | first `focus`/`input` on any field, once per page view |
| `Aufnahme: Formular Fehler` | when `actionData?.error` is set (validation or mail failure) |

Together with the `danke` pageview these give a completion rate for the form
itself, and separate "gave up" from "tried and it broke". The error event
matters more than it looks: the action returns a generic error if the
confirmation mail fails, and that failure is currently invisible.

### And the CTA into the form

| Goal | Where | Property |
|------|-------|----------|
| `Aufnahme: CTA geklickt` | `AdmissionDay` box, homepage shoutout, any future CTA | `position` = `aufnahme-box` \| `startseite` \| … |

This tells us which entry point actually feeds the form — worth knowing before
redesigning the homepage.

### Supporting signals around the funnel

| Goal | Trigger | Why |
|------|---------|-----|
| `Aufnahme: Schulvertrag heruntergeladen` | `/downloads/schulvertrag_september_2026.pdf` | high-intent: people who read the contract are seriously considering |
| `Aufnahme: Quereinstieg Kontakt` | `mailto:agnes.chorherr@walz.at` in `LateralEntryBox` | lateral entry is a separate funnel with a separate contact route |
| `Aufnahme: Stipendien Anfrage` | `mailto:office@walz.at` in the Stipendien section | tells us whether cost is a blocker |

**Note:** Plausible's outbound-link tracking ignores `mailto:` and `tel:` links
(it requires the link to have a host). Every email and phone link on the site
needs an explicit event — see §4.

---

## 3. Priority 1 — zero-code goals

These need **no code changes at all**, only configuration in the Plausible site
settings. Do these on day one.

### 3.1 Switch to the current script

Site settings → Installation gives a snippet like
`<script defer src="https://plausible.io/js/pa-….js"></script>`. Migrating buys:

- Outbound links, file downloads and form submissions as **toggles**, no
  snippet change ever again.
- Tagged events (`class="plausible-event-name=…"`) without a special script
  variant — the legacy script needs `script.tagged-events.js` for those.
- `plausible.init({ … })` for custom properties and manual pageviews later.

One caveat: the legacy script is deferred, so `window.plausible` may not exist
when a React effect fires. Whichever script we end up on, add the queue stub
before it so no event is lost:

```html
<script>
  window.plausible = window.plausible || function () {
    ;(window.plausible.q = window.plausible.q || []).push(arguments)
  }
</script>
```

### 3.2 Turn on the automatic measurements

| Measurement | Creates goal | Value for us |
|-------------|--------------|--------------|
| File downloads | `File Download` | Schulvertrag, Magazin, Jahrbücher, Flyer, Jahrespläne — all `public/downloads/*.pdf` |
| Outbound links | `Outbound Link: Click` | Instagram, YouTube, Google Maps |
| Form submissions | `WP Form Completions` | catch-all; we still want the specific events above |

### 3.3 Pageview goals

| Goal path | Question it answers |
|-----------|--------------------|
| `/aufnahme` | interest in applying |
| `/aufnahme/formular` | intent to apply |
| `/aufnahme/formular/danke` | **applications** (after §2) |
| `/die-walz-kennenlernen` | interest in open days |
| `/kontakt` | contact intent |
| `/rundgang` | virtual tour |
| `/curriculum` | depth of interest in the pedagogy |
| `/haeufige-fragen` | unanswered questions |
| `/magazin` | interest in student work |
| `/alumni` | alumni + "Ehrensache Walz" |
| `/unterstuetzende` | supporters / donations |
| `/jahrgaenge*` | wildcard: class pages as a group |
| `/aktuelles/beitraege/*` | wildcard: blog posts as a group |
| `/termine/*` | wildcard: individual events |

Wildcards work in pageview goals (`*` at either end or in the middle), so the
last three are one goal each rather than one per post.

### 3.4 Scroll depth — read the data we already have

Nothing to implement; it is in the expanded *Top Pages* tab and in the top row
when a page filter is applied. The pages worth watching:

| Page | The question |
|------|--------------|
| `/aufnahme` | Do people reach **Kosten** (3rd of 4 sections) and **Stipendien** (4th)? If most stop at *Voraussetzungen*, the cost information never lands — and cost is the main objection. |
| `/curriculum` | Long-form pedagogy page: read or bounced? |
| `/aktuelles/beitraege/*` | Are posts read to the end, i.e. is the effort worth it? |
| `/haeufige-fragen` | Five long answers — which ones get read? |
| `/rundgang` | Nothing to scroll: here **time on page** stands in for engagement with the Matterport iframe (iframe interaction is invisible to us). |

The `/aufnahme` page has a sticky table of contents. Tagging those links
(§4) plus scroll depth gives a clear picture of what prospective families
actually want to know.

---

## 4. Priority 2 — custom events worth adding

Roughly in descending order of value. All of these are a one-line class or a
small `useEffect`.

### Contact intent (high value — `mailto:`/`tel:` are invisible otherwise)

| Goal | Location | Property |
|------|----------|----------|
| `Kontakt: E-Mail geklickt` | `/kontakt`, `/impressum`, `/alumni`, `/ueber-uns` staff list | `empfaenger` |
| `Kontakt: Telefon geklickt` | `/kontakt`, `/impressum` | — |
| `Kontakt: Karte geklickt` | Google Maps links on `/kontakt` and the homepage | — |

Phone clicks are worth splitting by device — a tap on mobile is a call, a click
on desktop is not.

### Newsletter

`NewsletterForm` and `ReminderForm` submit through a `useFetcher`, so **no
navigation happens and nothing is currently recorded**.

| Goal | Trigger | Property |
|------|---------|----------|
| `Newsletter: Anmeldung` | `fetcher.data?.ok === true` | `formular` = `footer` \| `kennenlernen` |

The property matters because the same component is in the footer of every page
and (intended to be) on the *Kennenlernen* page — without it we cannot tell
which placement works.

> Two bugs spotted while looking at this: `ReminderForm` in
> `app/routes/die-walz-kennenlernen/route.tsx` is exported but never rendered,
> and its email `<Input>` has no `name` attribute, so its submission would fail
> the action's zod validation. Worth fixing independently of analytics.

### Content engagement

| Goal | Location | Property |
|------|----------|----------|
| `Magazin: Online gelesen` | `PdfViewer` "Online lesen" toggle | `ausgabe` |
| `Galerie: Bild geöffnet` | `PhotoLightbox` open | `seite` |
| `Beitrag: Link kopiert` | `CopyLinkButton` | — |
| `Inhaltsverzeichnis: Sprung` | `Toc` links | `abschnitt` (e.g. `kosten`) |
| `FAQ: Frage geöffnet` | FAQ anchors on the homepage | `frage` |

The `Toc` and FAQ events are the cheapest way to learn *which topics* drive
interest — the ToC on `/aufnahme` in particular is a direct read on whether
people come for the procedure, the requirements or the cost.

### Housekeeping

| Goal | Trigger | Why |
|------|---------|-----|
| `404` | `GeneralErrorBoundary` 404 handler, with prop `path` | broken inbound links, dead PDFs. 404s are **not** tracked automatically by Plausible — it needs an explicit event. Fire it from a `useEffect`, not `DOMContentLoaded` as the docs suggest, because our 404 renders client-side too. |

### Implementation sketch

Tagging is enough for plain links and buttons (new script only):

```tsx
<Button asChild className="plausible-event-name=Aufnahme+CTA+geklickt">
  <Link to="/aufnahme/formular">Zum Anmeldeformular</Link>
</Button>
```

Anything with state or properties goes through the function:

```ts
window.plausible?.('Newsletter: Anmeldung', { props: { formular: 'footer' } })
```

Worth wrapping in a tiny `app/utils/analytics.ts` helper so the `window`
guard and the naming convention live in one place.

---

## 5. Priority 3 — funnels and properties

Plausible's **funnel analysis is a Business-plan feature** (2–8 steps). If the
plan allows it, one funnel is worth having:

```
Landing → /aufnahme → /aufnahme/formular → Aufnahme: Formular gestartet → /aufnahme/formular/danke
```

That single view shows where applicants are lost — and given the admissions
calendar (open day mid-November, interviews from November, decisions from
January) the drop-off shape will differ per season and is worth comparing
year over year.

### Custom properties worth attaching

| Property | On | Notes |
|----------|-----|------|
| `schulstufe` | `Aufnahme: Formular abgeschickt` | 9th grade (regular) vs 10th/11th (Quereinstieg) — two different funnels that currently share one form |
| `position` | `Aufnahme: CTA geklickt` | which CTA feeds the form |
| `formular` | `Newsletter: Anmeldung` | which placement converts |
| `abschnitt` | `Inhaltsverzeichnis: Sprung` | what people came to read |

**Do not send the free-text "Wie sind Sie auf uns aufmerksam geworden?" field
as a property.** It is free-form and can contain names, and Plausible
properties are not the place for it. The referrer/source breakdown on the
conversion goal answers the same question automatically — and can be compared
against the free-text answers we already collect by mail.

---

## 6. Conventions

- **Naming:** `Bereich: Aktion` in German (`Aufnahme: Formular abgeschickt`).
  Staff read this dashboard; the site is German-only. The prefix groups related
  goals in the goal list.
- Goal names must match the event name **character for character**, including
  umlauts. Set the goal up in Plausible before or with the deploy, otherwise
  events are recorded but not shown.
- Prefer a **pageview goal over a custom event** whenever a distinct URL is
  possible — no JS, more robust, easier to reason about.
- Keep the goal list short. A dashboard with 30 goals gets ignored; the six
  Aufnahme goals are the ones that matter.

## 7. Privacy

Plausible is cookieless and does not collect personal data, which is why no
consent banner is needed — that does not change with any of the above, as long
as we keep personal data out of event properties (see §5).

One gap: **`/datenschutz` does not mention Plausible or web analytics at all**
right now. Even for a cookieless, GDPR-friendly tool, Art. 13 DSGVO expects the
processing to be disclosed. Worth adding a short paragraph naming Plausible,
the purpose, and that no personal data or cookies are involved — independently
of this plan.

---

## 8. Suggested order of work

1. Configure the pageview goals and enable file downloads + outbound links in
   Plausible. *(no code, ~15 minutes, immediately useful)*
2. Read the scroll depth we already have for `/aufnahme` and `/curriculum`.
3. Move the form success state to `/aufnahme/formular/danke` and add the goal.
   *(the important one)*
4. Migrate to the current Plausible script, add the queue stub.
5. Add the Aufnahme events: form started, form error, CTA clicked.
6. Add contact and newsletter events.
7. Everything in §4 "Content engagement", if and when there is appetite.
8. Build the funnel, if the plan supports it.

Steps 1–3 answer "how many people apply, and where do we lose them". The rest
is refinement.

## References

- [Add the Plausible tracking script](https://plausible.io/docs/plausible-script)
- [Update your Plausible script](https://plausible.io/docs/script-update-guide)
- [Enable optional measurements](https://plausible.io/docs/script-extensions)
- [Goal conversions](https://plausible.io/docs/goal-conversions) ·
  [Pageview goals](https://plausible.io/docs/pageview-goals) ·
  [Custom event goals](https://plausible.io/docs/custom-event-goals)
- [Scroll depth](https://plausible.io/docs/scroll-depth) ·
  [Funnel analysis](https://plausible.io/docs/funnel-analysis)
- [Outbound links](https://plausible.io/docs/outbound-link-click-tracking) ·
  [File downloads](https://plausible.io/docs/file-downloads-tracking) ·
  [Form submissions](https://plausible.io/docs/form-submissions-tracking)
- [404 tracking](https://plausible.io/docs/error-pages-tracking-404) ·
  [Single-page app support](https://plausible.io/docs/spa-support) ·
  [Query parameter handling](https://plausible.io/docs/stop-tracking-utm-tags)
