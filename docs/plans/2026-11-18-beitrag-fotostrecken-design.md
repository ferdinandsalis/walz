# Fotostrecken in Beiträgen — design

## Intent

Agnes wants to show several photos at once inside a Beitrag without the post
turning into a long column of images. Typical use: a few strips of a handful
of photos each, placed between paragraphs. One giant 30-photo gallery is not
the goal.

## Goals

- Agnes can add any number of "Fotostrecke" blocks anywhere in a Beitrag body.
- A Fotostrecke renders as a swipeable strip of thumbnails; tapping one opens
  the existing fullscreen lightbox at that photo, scoped to that strip.
- Single images in a Beitrag also open the lightbox (showing only that image).

## Non-goals

- No gallery spanning all photos of a Beitrag.
- No change to how the Projekte strip on the Curriculum page looks or behaves.
- No per-image "don't open in lightbox" setting.

## Approaches

- **A. New `photoStrip` block type in the post body (chosen).** Explicit,
  predictable for Agnes, reuses the existing strip and lightbox.
- B. Auto-group consecutive single images into a strip. No Studio change, but
  implicit; Agnes couldn't place two big images in a row, and existing posts
  with consecutive images would change. Rejected.
- C. Separate gallery field on the post, referenced from the body. Only useful
  if one strip appeared in several places. Overkill. Rejected.

## Design

- **Schema** (`app/sanity/schema/post.ts`): add a body array member
  `photoStrip` (title "Fotostrecke") with a `photos` array of images
  (hotspot, plus `caption`, `alt`, `attribution` — same fields as single body
  images; extract that field list so both use it). Require at least 2 photos.
  Studio preview shows the first photo and the photo count.
- **Shared component**: extract `YearCarousel` from
  `app/routes/curriculum/route.tsx` into a `PhotoStrip` component that takes
  photos with a caption string. Curriculum keeps passing its
  "Projektname, Bildbeschreibung" caption so it renders identically.
- **Beitrag page** (`app/routes/aktuelles_.beitraege+/$slug.tsx`): render
  `photoStrip` blocks with `PhotoStrip`; ~2 thumbnails visible on mobile, 3 on
  larger screens (the Beitrag column is narrow). `ImageComponent` becomes a
  button that opens `PhotoLightbox` with just that image.
- **Types**: run `npm run typecheck` (typegen) after the schema change.

## Left to the builder

- Exact thumbnail sizing/spacing inside the prose column, matching the
  Projekte strip's look.
- Whether attribution shows in the lightbox caption (lean: caption only,
  as today).

## Testing

- Unit: strip renders all photos with captions; single image renders a
  lightbox trigger; existing `ImageComponent` caption/attribution tests keep
  passing.
- Check Curriculum strip unchanged (screenshot before/after).
- Manual/e2e: a Beitrag with two strips — tap opens lightbox at the right
  photo, swipe stays within the strip.
