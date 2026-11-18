# Fotostrecken in Beiträgen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let Agnes place any number of swipeable photo strips ("Fotostrecke")
in a Beitrag, and make every Beitrag photo open the fullscreen lightbox.

**Architecture:** Extract the Curriculum page's `YearCarousel` into a shared
`PhotoStrip` component (strip + its own `PhotoLightbox`). Add a `photoStrip`
body block to the `post` schema, render it on the Beitrag page with
`PhotoStrip`, and wrap single Beitrag images in a button that opens
`PhotoLightbox` with that one image.

**Tech Stack:** React Router v7, Sanity (schema + Portable Text), embla carousel
(`#app/components/ui/carousel.tsx`), Radix Dialog, Vitest + Testing Library
(jsdom), Playwright.

**Spec:** `docs/plans/2026-11-18-beitrag-fotostrecken-design.md`

## Global Constraints

- Studio and UI copy in German: block title "Fotostrecke"; existing field titles
  stay as they are.
- No new dependencies.
- Curriculum Projekte strip must look and behave exactly as before.
- A strip's lightbox shows only that strip's photos; a single image's lightbox
  shows only that image.
- Lightbox caption = image caption only (no attribution).
- `photoStrip.photos` requires at least 2 photos.
- Commit messages must not mention Claude and carry no co-author line (project
  CLAUDE.md).
- Test output must be pristine: no console errors or React/Radix warnings.
- Do not create or publish content in the production Sanity dataset without
  asking Ferdinand first.

## Review Focus

1. A strip entry without an uploaded file (Agnes added a slot but no image) →
   skipped, no crash. Test: Task 1.
2. A strip whose photos are all empty/missing (e.g. a draft saved before
   validation) → renders nothing, no empty carousel. Test: Task 3.
3. Two strips in one Beitrag → opening a photo in one never shows the other
   strip's photos. Test: Task 1 (lightbox contains only the strip's photos).
4. Photo without caption → no empty caption bar on the thumbnail; `alt` falls
   back to `''`. Test: Task 1.
5. Single image without caption/alt → the zoom button still has an accessible
   name. Test: Task 4.

---

### Task 1: Shared `PhotoStrip` component

**Files:**

- Create: `app/components/photo-strip.tsx`
- Create: `app/components/photo-strip.test.tsx`
- Create: `tests/setup/stub-carousel-apis.ts`
- Modify: `app/components/photo-lightbox.tsx` (add
  `aria-describedby={undefined}` to `DialogContent` — removes the Radix "Missing
  Description" warning)

**Interfaces:**

- Produces:
  - `export type StripPhoto = { key: string; image: { asset?: { _ref: string } } & Record<string, unknown>; caption?: string; alt?: string }`
  - `export function PhotoStrip({ photos, itemClassName }: { photos: StripPhoto[]; itemClassName?: string }): JSX.Element | null`
    — filters out photos without `image.asset`; returns `null` if none remain;
    `itemClassName` defaults to `'sm:basis-1/2 md:basis-1/3'` (the current
    Curriculum value). Markup, classes, carousel `opts` and lightbox wiring move
    verbatim from `YearCarousel` (`app/routes/curriculum/route.tsx:130-200`);
    thumbnail caption bar is rendered only when `caption` is set; `alt` =
    `photo.alt ?? photo.caption ?? ''`.
  - `export function stubCarouselBrowserApis(): void` in
    `tests/setup/stub-carousel-apis.ts` — `vi.stubGlobal` no-op
    `ResizeObserver`, `IntersectionObserver` (classes with
    `observe/unobserve/disconnect`) and `matchMedia` (returns
    `{ matches: false, addListener, removeListener, addEventListener, removeEventListener }`
    no-ops). Embla throws in jsdom without these (verified).

- [ ] **Step 1: Write failing tests** in `app/components/photo-strip.test.tsx`
      (`@vitest-environment jsdom`, call `stubCarouselBrowserApis()` in
      `beforeEach`). Use refs like `image-Tb9Ew8CXIwaY6R1kjMvI0uRR-800x600-jpg`.
  - `renders a thumbnail button per photo with its caption` — 3 photos → 3
    buttons; captions "Wandertag", "Gipfel", "Hütte" visible.
  - `skips photos without an uploaded image` — 2 valid + 1 `{ image: {} }` → 2
    buttons.
  - `renders nothing when no photo has an image` — container is empty.
  - `omits the caption bar for photos without caption` — photo without caption →
    no element with class `bg-black/10`; img `alt` is `''`.
  - `opens the lightbox at the tapped photo with only this strip's photos` —
    render two strips (captions A1/A2 and B1/B2), click A2's button →
    `screen.getByRole('dialog')` contains "A2",
    `within(dialog).queryByText('B1')` is null.
- [ ] **Step 2: Run** `npx vitest run app/components/photo-strip.test.tsx` —
      expect FAIL (module not found).
- [ ] **Step 3: Implement** `PhotoStrip`, the stub helper, and the
      `aria-describedby` fix.
- [ ] **Step 4: Run** `npx vitest run app/components/photo-strip.test.tsx` —
      expect PASS with no warnings in output.
- [ ] **Step 5: Commit**
      `git add app/components/photo-strip.tsx app/components/photo-strip.test.tsx app/components/photo-lightbox.tsx tests/setup/stub-carousel-apis.ts && git commit -m "Add a shared photo strip with lightbox"`

### Task 2: Curriculum uses `PhotoStrip`

**Files:**

- Modify: `app/routes/curriculum/route.tsx` (remove `YearCarousel` and
  now-unused imports; render `PhotoStrip`)

**Interfaces:**

- Consumes: `PhotoStrip`, `StripPhoto` from Task 1.

- [ ] **Step 1: Screenshot before.** Worktree has no `.env`: copy it from the
      main checkout (`../../../.env`) — never run aufnahme e2e with it. Start
      the dev server, screenshot `/curriculum` at desktop and mobile width
      showing a Projekte strip, and the lightbox opened on a photo.
- [ ] **Step 2: Replace** `<YearCarousel photos={photos} />` with
      `<PhotoStrip photos={...} />`, mapping each project photo to
      `{ key: photo._key, image: photo, caption: \`${projectName}${caption ? \`,
      ${caption}\` : ''}\` }`(same caption as today;`alt` falls back to caption
      like today).
- [ ] **Step 3: Run** `npm run typecheck && npm run lint` — expect clean.
- [ ] **Step 4: Screenshot after** at the same widths and compare: identical
      strip and lightbox.
- [ ] **Step 5: Commit**
      `git commit -am "Use the shared photo strip on the Curriculum page"`

### Task 3: `photoStrip` block in the Beitrag schema and page

**Files:**

- Modify: `app/sanity/schema/post.ts`
- Modify: `app/routes/aktuelles_.beitraege+/$slug.tsx`
- Create: `app/routes/aktuelles_.beitraege+/$slug.photo-strip.test.tsx`

**Interfaces:**

- Consumes: `PhotoStrip`, `StripPhoto` (Task 1).
- Produces:
  `export function PhotoStripBlock({ value }: { value: { photos?: Array<{ _key: string; asset?: { _ref: string }; caption?: string; alt?: string }> } })`
  in `$slug.tsx`.

- [ ] **Step 1: Write failing tests** in `$slug.photo-strip.test.tsx`
      (`@vitest-environment jsdom`, `stubCarouselBrowserApis()` in `beforeEach`;
      the existing static tests in `$slug.test.tsx` stay untouched):
  - `renders each photo of the strip with its caption`.
  - `renders nothing for a strip without photos` — `value: {}` and
    `value: { photos: [] }` → empty container.
- [ ] **Step 2: Run** `npx vitest run "app/routes/aktuelles_.beitraege+"` —
      expect FAIL.
- [ ] **Step 3: Schema.** In `post.ts` extract the existing body-image `fields`
      array into a `const imageFields` and use it for the body image, and for
      the new member:
      `defineArrayMember({ name: 'photoStrip', type: 'object', title: 'Fotostrecke', fields: [defineField({ name: 'photos', title: 'Fotos', type: 'array', of: [defineArrayMember({ type: 'image', options: { hotspot: true }, fields: imageFields })], validation: Rule => Rule.min(2) })], preview: { select: { photos: 'photos' }, prepare: ({ photos }) => ({ title: 'Fotostrecke', subtitle: \`${photos?.length
      ?? 0} Fotos\`, media: photos?.[0] }) } })`. (`cover` keeps its own fields
      — not in scope.)
- [ ] **Step 4: Page.** Implement `PhotoStripBlock` (maps `photos` to
      `StripPhoto` with `key: _key`, `image: photo`; passes
      `itemClassName="basis-1/2 md:basis-1/3"`) and register
      `photoStrip: PhotoStripBlock` in the `PortableText` `types`. The GROQ
      query already returns `body` raw — no change.
- [ ] **Step 5: Run**
      `npx vitest run "app/routes/aktuelles_.beitraege+" && npm run typecheck` —
      expect PASS.
- [ ] **Step 6: Studio check.** Ask Ferdinand before touching the dataset. If
      OK: in local `/studio`, open an existing Beitrag, add a Fotostrecke with 1
      photo → validation error shown; add a 2nd → valid; preview shows
      "Fotostrecke · 2 Fotos". Discard the draft — do not publish.
- [ ] **Step 7: Commit**
      `git add app/sanity/schema/post.ts "app/routes/aktuelles_.beitraege+" && git commit -m "Add Fotostrecken to Beiträge"`

### Task 4: Single Beitrag images open the lightbox

**Files:**

- Modify: `app/routes/aktuelles_.beitraege+/$slug.tsx` (`ImageComponent`)
- Test: `app/routes/aktuelles_.beitraege+/$slug.photo-strip.test.tsx` (jsdom
  file from Task 3; rename to `$slug.lightbox.test.tsx` if clearer)

**Interfaces:**

- Consumes: `PhotoLightbox` (`#app/components/photo-lightbox.tsx`).

- [ ] **Step 1: Write failing tests:**
  - `opens the image in the lightbox when tapped` — render `ImageComponent` with
    caption "Schülerinnen im Garten", click
    `getByRole('button', { name: /Schülerinnen im Garten/ })` → dialog contains
    that caption.
  - `names the zoom button even without caption or alt` — no caption/alt →
    `getByRole('button', { name: 'Foto vergrößern' })` exists.
- [ ] **Step 2: Run** — expect FAIL.
- [ ] **Step 3: Implement.** Wrap the `<img>` in
      `<button type="button" className="block w-full cursor-zoom-in" aria-label={value.alt || value.caption || 'Foto vergrößern'}>`;
      `useState` for `open`; render
      `<PhotoLightbox photos={[{ image: value, alt: value.alt, caption: value.caption }]} open={open} onOpenChange={setOpen} />`.
      Caption/attribution figcaption unchanged.
- [ ] **Step 4: Run** `npx vitest run "app/routes/aktuelles_.beitraege+"` — new
      and existing `ImageComponent` static tests PASS.
- [ ] **Step 5: Commit** `git commit -am "Open Beitrag images in the lightbox"`

### Task 5: Verify

- [ ] **Step 1:** `npm test -- --run && npm run lint && npm run typecheck` — all
      pass, output free of warnings.
- [ ] **Step 2:** `npm run test:e2e:run` (mail-free specs only if Resend quota
      rule applies — skip `aufnahme-form`) — pass.
- [ ] **Step 3:** In the browser: open a published Beitrag with an image, tap it
      → lightbox opens; Escape closes. Screenshot desktop + mobile.
- [ ] **Step 4:** Report: Fotostrecke rendering is covered by unit tests and by
      the shared Curriculum strip; a real Beitrag strip can only be seen once
      one is published.
