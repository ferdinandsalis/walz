export type SanityPhoto = {
  _key?: string
  asset: { _ref: string }
  caption?: string
}

/** The exams a year really has: Sanity also holds "keine" and empty entries. */
export function realExams(exams: string[] | null | undefined): string[] {
  return (exams ?? []).filter(
    exam => exam && exam.trim() && exam.trim().toLowerCase() !== 'keine',
  )
}

/**
 * For each year, the share of all exams taken in the years before it and in
 * the year itself, from 0 to 1.
 */
export function examProgress(
  counts: number[],
): { before: number; current: number }[] {
  const total = counts.reduce((sum, count) => sum + count, 0)
  let taken = 0
  return counts.map(count => {
    const before = total ? taken / total : 0
    taken += count
    return { before, current: total ? count / total : 0 }
  })
}

/** The description's first sentence, set large, and the rest. */
export function splitLead(text: string | null | undefined): {
  lead: string
  rest: string
} {
  const trimmed = (text ?? '').trim()
  const match = /^(.+?[.!?])\s+(.*)$/s.exec(trimmed)
  return match
    ? { lead: match[1]!, rest: match[2]!.trim() }
    : { lead: trimmed, rest: '' }
}

/** Width over height, read from the Sanity asset name (`image-…-WxH-jpg`). */
export function photoRatio(
  photo: { asset?: { _ref?: string } } | null | undefined,
): number {
  const match = /-(\d+)x(\d+)-/.exec(photo?.asset?._ref ?? '')
  return match ? Number(match[1]) / Number(match[2]) : 1
}

/** The project's photos that have an image. */
export function photosOf(project: {
  photos?: unknown[] | null
}): SanityPhoto[] {
  return (project.photos ?? []).filter(
    (photo): photo is SanityPhoto =>
      typeof photo === 'object' && photo !== null && 'asset' in photo,
  )
}

/**
 * The year's projects; Sanity gives null for no list and for references to
 * projects that were deleted or unpublished.
 */
export function projectsOf<Project>(year: {
  projects?: (Project | null)[] | null
}): Project[] {
  return (year.projects ?? []).filter(
    (project): project is Project => project !== null,
  )
}
