import { useMatches } from 'react-router'

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

/** The page's heading as a large, quiet accent. */
export function PageTitle() {
  return (
    <h1 className="font-condensed text-h1 text-muted-foreground font-bold opacity-40">
      {usePageTitle()}
    </h1>
  )
}

