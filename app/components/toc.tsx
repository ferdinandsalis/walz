import { BookOpen, CaretUp } from '@phosphor-icons/react'
import {
  type ReactNode,
  type RefObject,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
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

/** True once the bottom of the given element has scrolled above the screen. */
function useScrolledAway(ref: RefObject<HTMLElement | null>) {
  const [scrolledAway, setScrolledAway] = useState(false)

  useEffect(() => {
    function update() {
      const element = ref.current
      setScrolledAway(
        element ? element.getBoundingClientRect().bottom < 0 : false,
      )
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ref])

  return scrolledAway
}

/**
 * The page title, the page's sections and the optional intro. Below `md` the
 * sections sit between title and intro; from `md` beside them; from `lg` the
 * page shows them in its right column instead (see `TocRail`). While the
 * sections are scrolled away on small screens, a button follows the reader.
 */
export function PageHead({
  title,
  sections,
  children,
}: {
  title: string
  sections: TocSection[]
  children?: ReactNode
}) {
  const listRef = useRef<HTMLElement>(null)

  return (
    <div className="grid items-start gap-x-12 gap-y-6 md:grid-cols-[minmax(0,1fr)_12rem] lg:grid-cols-1">
      <h1 className="font-condensed text-h1 text-muted-foreground font-bold opacity-20">
        {title}
      </h1>
      <nav
        ref={listRef}
        aria-label="Auf dieser Seite"
        className="md:border-border grid gap-3 md:col-start-2 md:row-span-2 md:row-start-1 md:border-l md:pl-6 lg:hidden"
      >
        <h2 className={tocLabel}>Auf dieser Seite</h2>
        <ol className="border-border grid grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] gap-x-6 border-t md:grid-cols-1 md:border-t-0">
          {sections.map(section => (
            <li
              key={section.id}
              className="border-border border-b md:border-b-0"
            >
              <a
                href={`#${section.id}`}
                className="group font-condensed text-body-md hover:text-primary flex min-h-12 items-center gap-3 font-bold md:min-h-10"
              >
                {/* The dot drops into a short line on hover: the link goes further down */}
                <span
                  aria-hidden
                  className="bg-primary h-1.5 w-1.5 flex-none rounded-full transition-[height,translate] duration-200 group-hover:h-3.5 group-hover:translate-y-1 motion-reduce:transition-none"
                />
                {section.name}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      {children}
      <TocPill sections={sections} listRef={listRef} />
    </div>
  )
}

/**
 * A button at the bottom of small screens that shows the section the reader
 * is in and opens the list of all sections. It appears once the in-flow list
 * has scrolled away.
 */
function TocPill({
  sections,
  listRef,
}: {
  sections: TocSection[]
  listRef: RefObject<HTMLElement | null>
}) {
  const visible = useScrolledAway(listRef)
  const current = useCurrentSection(sections.map(section => section.id))
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  if (!visible && open) setOpen(false)

  useEffect(() => {
    if (!open) return

    function closeOnOutsideClick(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }

    document.addEventListener('click', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('click', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  const currentName = sections.find(section => section.id === current)?.name

  return (
    <div
      ref={wrapperRef}
      inert={!visible}
      className={cn(
        'fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-1/2 z-30 w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 transition duration-300 motion-reduce:transition-none lg:hidden',
        !visible && 'pointer-events-none translate-y-[140%] opacity-0',
      )}
    >
      <div
        id={panelId}
        hidden={!open}
        className="bg-card absolute bottom-[calc(100%+0.5rem)] left-1/2 w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl p-2 pt-3.5 shadow-xl"
      >
        <h2 className={cn(tocLabel, 'mb-1.5 px-3')}>Auf dieser Seite</h2>
        <ol>
          {sections.map(section => {
            const isCurrent = section.id === current
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={isCurrent ? 'location' : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'font-condensed hover:bg-muted/50 flex min-h-11 items-center gap-2.5 rounded-lg px-3 py-2 text-lg font-bold',
                    isCurrent && 'text-primary',
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'h-1.5 w-1.5 flex-none rounded-full',
                      isCurrent && 'bg-primary',
                    )}
                  />
                  {section.name}
                </a>
              </li>
            )
          })}
        </ol>
        <div className="border-muted mt-1.5 border-t pt-1.5">
          <a
            href="#"
            onClick={() => setOpen(false)}
            className="font-condensed text-muted-foreground hover:bg-muted/50 flex min-h-11 items-center rounded-lg px-3"
          >
            ↑ Nach oben
          </a>
        </div>
      </div>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(isOpen => !isOpen)}
        className="bg-foreground text-background font-condensed inline-flex min-h-12 max-w-full items-center gap-2.5 rounded-full py-2 pr-4.5 pl-3.5 text-lg font-bold shadow-lg"
      >
        <BookOpen aria-hidden size={18} className="text-primary flex-none" />
        <span className="font-sans text-xs font-normal tracking-widest uppercase opacity-60">
          Inhalt
        </span>
        <span className="truncate">{currentName}</span>
        <CaretUp
          aria-hidden
          size={14}
          className={cn(
            'text-primary flex-none transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>
    </div>
  )
}
