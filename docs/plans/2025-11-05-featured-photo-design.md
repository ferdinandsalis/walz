# Featured Photo Selection for Jahrgänge

**Date:** 2025-11-05
**Status:** Approved

## Problem Statement

Alumni Jahrgänge currently display the most recent photo by default, which is typically the Matura photo. School staff requested the ability to override this default and select a more interesting photo to display first on year cards and individual year pages.

## Requirements

1. **Default behavior:** Continue showing the most recent photo (by `takenAt` date) when no featured photo is selected
2. **Override capability:** Allow school staff to explicitly select a featured photo in Sanity CMS
3. **Graceful fallback:** If a featured photo is deleted, automatically fall back to the most recent photo
4. **Broad scope:** Apply featured photo selection everywhere - on year cards (/jahrgaenge, /aktuelles) AND individual year pages (/jahrgaenge/:year)

## Design Decisions

### Data Model

**Choice:** Reference by asset ID

Add an optional `featuredPhoto` field to the year document that stores a reference to a photo's asset:

```typescript
// app/sanity/schema/year.ts
defineField({
  name: 'featuredPhoto',
  title: 'Hauptfoto',
  type: 'reference',
  description: 'Das Foto, das zuerst auf Karten und der Jahrgangsseite angezeigt wird. Falls nicht gesetzt, wird das neueste Foto (nach Datum) verwendet.',
  to: [{ type: 'image' }],
  options: {
    filter: ({ document }) => {
      const photoRefs = document.photos?.map((p: any) => p.asset._ref) || []
      return {
        filter: '_id in $refs',
        params: { refs: photoRefs }
      }
    }
  },
  validation: Rule => Rule.optional(),
})
```

**Rationale:** Asset ID reference is robust against photo reordering and more explicit than boolean flags.

### Schema Updates

Update TypeScript/Zod schemas:

```typescript
export const YearSchema = z.object({
  letter: z.string(),
  startedAt: z.coerce.date(),
  graduatedAt: z.coerce.date().nullable(),
  mentor: PersonSchema,
  photos: z.array(PhotoSchema),
  plan: z.any(),
  featuredPhoto: z.any().optional(), // Asset reference
})
```

### Selection Logic

Create a helper function to determine which photo to display:

```typescript
function selectFeaturedPhoto(photos: Photo[], featuredPhotoRef?: any): Photo {
  // If a featured photo is set, try to find it in the photos array
  if (featuredPhotoRef?._ref) {
    const featured = photos.find(p => p.asset._ref === featuredPhotoRef._ref)
    if (featured) return featured
  }

  // Fallback: return the most recent photo by takenAt date
  return photos.sort((a, b) =>
    new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime()
  )[0]
}
```

**Usage locations:**
- `app/routes/aktuelles/route.tsx` - YearCard component (replace `photos[0]`)
- `app/routes/jahrgaenge+/_index.tsx` - YearCard component usage
- `app/routes/jahrgaenge+/$year.tsx` - YearPhotos component (set initial `selectedPhotoIndex`)

### Query Updates

Add `featuredPhoto` to all GROQ queries that fetch year data:

```groq
featuredPhoto {
  asset {
    _ref,
    _type
  }
}
```

**Files to update:**
- `app/routes/jahrgaenge+/$year.query.tsx`
- `app/routes/jahrgaenge+/_index.query.ts`
- `app/routes/aktuelles/query.ts`

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| Featured photo not set | Show most recent photo by `takenAt` date |
| Featured photo set and exists | Show the featured photo |
| Featured photo deleted | Fall back to most recent photo (silent, no error) |
| Photos array empty | Handle gracefully (existing empty state UI) |
| Multiple photos same date | Stable sort by array order as tiebreaker |

## User Experience

### In Sanity Studio

1. Field appears right after the `photos` array
2. Dropdown shows only photos from the current year's photos array
3. Preview shows year from `takenAt` for easy identification
4. Field is optional - empty means "use latest"
5. Deleting a featured photo doesn't break the site

### On Frontend

1. Year cards show featured photo (or latest if not set)
2. Individual year pages open with featured photo selected
3. No visual indication that a photo is "featured" - it just shows first
4. All photos remain accessible in the photo gallery

## Migration

No data migration needed - the `featuredPhoto` field is optional and the default behavior (show latest) matches current behavior.

## Testing Considerations

- Verify featured photo shows on year cards
- Verify featured photo shows first on individual year page
- Test fallback when featured photo is deleted
- Test empty state when no photos exist
- Verify GROQ queries return featuredPhoto data
- Check TypeScript types compile correctly
