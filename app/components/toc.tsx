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

/** True once the reader has scrolled past the first screen of the page. */
function useScrolledPastFirstScreen() {
  const [scrolledPast, setScrolledPast] = useState(false)

  useEffect(() => {
    function update() {
      setScrolledPast(window.scrollY > window.innerHeight)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return scrolledPast
}

const tocLabel =
  'text-body-2xs text-muted-foreground font-bold tracking-widest uppercase'

/**
 * The page's sections in the right-hand column of wide screens, with the
 * section the reader is in marked. The page places it and makes it sticky.
 */
export function TocRail({
  sections,
  className,
}: {
  sections: TocSection[]
  className?: string
}) {
  const current = useCurrentSection(sections.map(section => section.id))
  const showToTop = useScrolledPastFirstScreen()

  return (
    <nav aria-label="Auf dieser Seite" className={cn('grid gap-3', className)}>
      <h2 className={tocLabel}>Auf dieser Seite</h2>
      <ol className="border-border grid border-l-2">
        {sections.map(section => {
          const isCurrent = section.id === current
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isCurrent ? 'location' : undefined}
                className={cn(
                  'font-condensed text-body-md -ml-0.5 block border-l-2 py-1.5 pl-4 transition-colors',
                  isCurrent
                    ? 'border-primary text-foreground font-bold'
                    : 'text-muted-foreground hover:text-foreground border-transparent',
                )}
              >
                {section.name}
              </a>
            </li>
          )
        })}
      </ol>
      <a
        href="#"
        aria-hidden={showToTop ? undefined : true}
        tabIndex={showToTop ? undefined : -1}
        className={cn(
          'font-condensed text-muted-foreground hover:text-primary mt-2 pl-4.5 transition-opacity',
          !showToTop && 'pointer-events-none opacity-0',
        )}
      >
        ↑ Nach oben
      </a>
    </nav>
  )
}
