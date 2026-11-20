import { useMatches } from 'react-router'
import { cn } from '#app/utils/misc.js'

/** What a route puts in its `handle` to name the page's accent title. */
export type PageTitleHandle = { pageTitle?: string }

/**
 * The page title named by the deepest route that names one, so a sub-page
 * without its own title shows its parent's.
 */
function usePageTitle() {
  const matches = useMatches()
  for (const match of [...matches].reverse()) {
    const title = (match.handle as PageTitleHandle | undefined)?.pageTitle
    if (title) return title
  }
  return undefined
}

/**
 * The page's heading as a large, quiet accent. From `xl` it is visually
 * hidden: the vertical copy beside the text (`PageTitleSpine`) takes over.
 */
export function PageTitle() {
  return (
    <h1 className="font-condensed text-h1 text-muted-foreground font-bold opacity-40 xl:sr-only">
      {usePageTitle()}
    </h1>
  )
}

/**
 * The page title running vertically, bottom to top, like the spine of a
 * German book. Decorative: the page's `h1` carries the title for assistive
 * tech. Sized by the window height so long titles fit a short window.
 */
export function PageTitleSpine({ className }: { className?: string }) {
  const title = usePageTitle()
  if (!title) return null

  return (
    <p
      aria-hidden
      className={cn(
        'font-condensed text-muted-foreground rotate-180 text-[min(5rem,9vh)] leading-none font-bold whitespace-nowrap opacity-30 [writing-mode:vertical-rl]',
        className,
      )}
    >
      {title}
    </p>
  )
}
