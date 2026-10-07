import { PathNode, type PathNodeState } from '#app/components/ui/path.tsx'
import { visibleFocusOutline } from '#app/components/visible-focus.ts'
import { cn } from '#app/utils/misc.tsx'

/**
 * The form's sections as links on a short path, each with the same node as on
 * the form's rail. Plain anchors, so the jumps work before hydration. The
 * panel's tint is blended into `--path-gap`, so the node rings knock the rail
 * out in exactly the panel's colour.
 */
export function SectionMap({
  sections,
  className,
}: {
  sections: ReadonlyArray<{
    id: string
    number: number
    title: string
    state: PathNodeState
  }>
  className?: string
}) {
  return (
    <nav
      aria-label="Abschnitte"
      className={cn(
        'bg-muted/30 rounded-md p-6 [--path-gap:color-mix(in_srgb,var(--color-muted)_30%,var(--color-background))]',
        className,
      )}
    >
      <ol>
        {sections.map(({ id, number, title, state }, index) => (
          <li key={id} className="relative pb-3 last:pb-0">
            {/* The rail runs from this node's centre to the next one's. */}
            {index < sections.length - 1 ? (
              <span
                aria-hidden="true"
                className="bg-path absolute top-4 -bottom-4 left-[15px] w-0.5"
              />
            ) : null}
            <a
              href={`#${id}`}
              className={cn(
                'font-condensed text-body-md text-foreground flex gap-3 rounded-sm',
                visibleFocusOutline,
              )}
            >
              <PathNode state={state} number={number} />
              {/* A 28px line, padded to the 32px node, centres the first line. */}
              <span className="py-0.5">{title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
