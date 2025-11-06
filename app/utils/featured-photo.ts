import type { Photo } from '#app/sanity/schema/year.tsx'

export function selectFeaturedPhoto(
  photos: Photo[],
  featuredPhotoRef?: string | null,
): Photo {
  if (photos.length === 0) {
    throw new Error('Cannot select featured photo from empty photos array')
  }

  // If a featured photo is set, try to find it in the photos array
  if (featuredPhotoRef) {
    const featured = photos.find(
      p => p.asset._ref === featuredPhotoRef,
    )
    if (featured) return featured
  }

  // Fallback: return the most recent photo by takenAt date
  // Use slice() to avoid mutating the original array
  const sorted = photos.slice().sort((a, b) => {
    return new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime()
  })

  return sorted[0]
}
