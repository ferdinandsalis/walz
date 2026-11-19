import { BookOpen } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { cn } from '#app/utils/misc.js'

export type TocSection = { name: string; id: string }

/** How far down the viewport a section's top must reach to count as current. */
const CURRENT_SECTION_LINE = 0.4

/**
 * The section the reader is in: the last one, in page order, whose top has
 * reached the line; before the first one does, the first section.
 */
export function currentSectionId(
  sections: { id: string; top: number }[],
  line: number,
) {
  let current = sections[0]?.id ?? ''
  for (const section of sections) {
    if (section.top <= line) current = section.id
  }
  return current
}

/**
 * Tracks which of the given sections the reader is in. Ids without an element
 * on the page are skipped; the server render reports the first section.
 */
export function useCurrentSection(ids: string[]) {
  const [current, setCurrent] = useState(ids[0] ?? '')
  const key = ids.join(' ')

  useEffect(() => {
    function update() {
      const sections = key.split(' ').flatMap(id => {
        const element = document.getElementById(id)
        return element ? [{ id, top: element.getBoundingClientRect().top }] : []
      })
      setCurrent(
        currentSectionId(sections, window.innerHeight * CURRENT_SECTION_LINE),
      )
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [key])

  return current
}

export function Toc({
  title = 'Inhalt',
  links,
  className,
}: {
  title?: string
  links: { name: string; to: string }[]
  className?: string
}) {
  return (
    <nav className={cn('grid gap-3', className)}>
      <h2 className="text-body-sm text-muted-foreground flex items-center gap-2 font-bold tracking-widest uppercase">
        <BookOpen size={18} className="text-primary inline-block" />
        {title}
      </h2>
      <ol className="list-inside list-disc space-y-0.5">
        {links.map(link => {
          return (
            <li key={link.to} className="text-secondary">
              <Link
                to={link.to}
                className="font-condensed text-body-md text-foreground"
              >
                {link.name}
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
