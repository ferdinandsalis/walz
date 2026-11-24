import { type CSSProperties, useState } from 'react'
import { PhotoLightbox } from '#app/components/photo-lightbox.tsx'
import { urlFor } from '#app/sanity/instance.ts'
import { cn } from '#app/utils/misc.tsx'
import { photoRatio, photosOf, realExams, splitLead } from './curriculum.ts'
import { gridArea, mosaicLayout, type GridArea } from './mosaic.ts'
import { type CurriculumQueryResult } from './query.ts'

type Year = CurriculumQueryResult['years'][number]

/** Names longer than this get a smaller size so they fit a narrow tile. */
const LONG_NAME = 20
/** Image pixels per grid cell, enough for the widest column. */
const CELL_PX = 320

/** Places an item at its area on phones and at its area from `lg` on. */
function areaStyle(narrow: GridArea, wide: GridArea) {
  return {
    '--area': gridArea(narrow),
    '--area-lg': gridArea(wide),
  } as CSSProperties
}
const areaClass = '[grid-area:var(--area)] lg:[grid-area:var(--area-lg)]'

/**
 * One Walz year: its opening sits in a corner of a photo mosaic (left in odd
 * years, right in even ones), the rest of the text and the exams follow.
 */
export function YearSection({
  year,
  n,
  noExamsText,
}: {
  year: Year
  n: number
  noExamsText: string
}) {
  const [openAt, setOpenAt] = useState<number | null>(null)
  const { lead, rest } = splitLead(year.description)
  const withPhotos = year.projects.filter(p => photosOf(p).length > 0)
  const withoutPhotos = year.projects.filter(p => photosOf(p).length === 0)
  const exams = realExams(year.externalExams)

  const ratios = withPhotos.map(p => photoRatio(photosOf(p)[0]))
  const narrow = mosaicLayout(ratios, { columns: 2, corner: 'left' })
  const wide = mosaicLayout(ratios, {
    columns: 4,
    corner: n % 2 ? 'left' : 'right',
  })

  const lightboxPhotos = withPhotos.flatMap(p =>
    photosOf(p).map(photo => {
      const caption = photo.caption ? `${p.name}, ${photo.caption}` : p.name
      return { image: photo, caption, alt: caption, project: p._id }
    }),
  )

  return (
    <section
      id={`jahr-${n}`}
      aria-labelledby={`jahr-${n}-titel`}
      className="scroll-mt-8 space-y-8"
    >
      <ul className="grid auto-rows-[8.5rem] grid-cols-2 gap-1.5 sm:auto-rows-[10.5rem] lg:grid-cols-4">
        <li
          style={areaStyle(narrow.corner, wide.corner)}
          className={cn(
            areaClass,
            'flex flex-col justify-end gap-3 pb-2',
            n % 2 ? 'lg:pr-6' : 'lg:pl-6',
          )}
        >
          <span className="flex min-w-0 items-end gap-4">
            <span
              aria-hidden
              className="font-condensed text-primary text-[6.5rem]/[0.75] font-black sm:text-[9rem]/[0.75]"
            >
              {n}
            </span>
            <h2 id={`jahr-${n}-titel`} className="min-w-0">
              <span className="text-muted-foreground text-body-xs block font-bold tracking-widest uppercase">
                {n}. Jahr
              </span>
              {/* Hyphenated so "naturwissenschaftliche" fits beside the numeral */}
              <span className="font-condensed block text-3xl/tight font-bold text-balance hyphens-auto">
                {year.title}
              </span>
            </h2>
          </span>
          <p className="font-condensed text-xl/tight font-bold text-balance">
            {lead}
          </p>
        </li>

        {withPhotos.map((project, i) => {
          const photos = photosOf(project)
          const more = photos.length - 1
          const area = wide.tiles[i]!
          return (
            <li
              key={project._id}
              style={areaStyle(narrow.tiles[i]!, area)}
              className={areaClass}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenAt(
                    lightboxPhotos.findIndex(
                      photo => photo.project === project._id,
                    ),
                  )
                }
                className="group relative block size-full overflow-hidden rounded-lg"
              >
                <img
                  src={urlFor(photos[0]!)
                    .width(area.colSpan * CELL_PX)
                    .height(area.rowSpan * CELL_PX)
                    .fit('crop')
                    .auto('format')
                    .url()}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
                />
                {/* The count sits in the top corner so the name has the full width */}
                {more > 0 ? (
                  <span className="text-body-xs absolute top-2 right-2 rounded-full bg-white/90 px-2 py-0.5 font-semibold">
                    +{more} {more === 1 ? 'Foto' : 'Fotos'}
                  </span>
                ) : null}
                <span
                  className={cn(
                    'font-condensed absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 via-black/30 to-transparent p-3 pt-12 text-left font-bold break-words text-white',
                    i === 0
                      ? 'text-2xl/tight'
                      : project.name.length > LONG_NAME
                        ? 'text-body-sm/tight'
                        : 'text-body-md/tight',
                  )}
                >
                  {project.name}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="grid gap-8 md:grid-cols-2">
        {rest ? <p className="max-w-prose md:text-lg">{rest}</p> : null}
        <div className="space-y-6 md:col-start-2">
          {withoutPhotos.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-body-xs font-bold tracking-widest uppercase">
                Außerdem in diesem Jahr
              </h3>
              <p className="font-condensed text-2xl/tight font-bold">
                {withoutPhotos.map(p => p.name).join(' · ')}
              </p>
            </div>
          ) : null}
          <div className="space-y-2">
            <h3 className="text-body-xs font-bold tracking-widest uppercase">
              Externe Prüfungen
            </h3>
            <ul className="flex flex-wrap gap-1.5">
              {exams.length === 0 ? (
                <li className="bg-primary-100 text-body-sm rounded-md px-2.5 py-1 font-semibold">
                  {noExamsText}
                </li>
              ) : (
                exams.map(exam => (
                  <li
                    key={exam}
                    className={cn(
                      'text-body-sm rounded-md px-2.5 py-1 font-semibold',
                      exam === 'Matura' ? 'bg-primary' : 'bg-secondary',
                    )}
                  >
                    {exam}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>

      <PhotoLightbox
        photos={lightboxPhotos}
        open={openAt !== null}
        startIndex={openAt ?? 0}
        onOpenChange={open => !open && setOpenAt(null)}
      />
    </section>
  )
}
