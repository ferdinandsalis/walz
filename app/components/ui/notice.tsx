import { type AriaAttributes, type ComponentType, type ReactNode } from 'react'
import { cn } from '#app/utils/misc.tsx'

/**
 * A panel on a blue wash with an icon, for information beside the main flow.
 * The title is optional and takes the heading level of its place on the page.
 */
export function Notice({
  icon: Icon,
  title,
  titleAs: Title = 'h2',
  children,
  className,
}: {
  icon: ComponentType<{
    className?: string
    'aria-hidden'?: AriaAttributes['aria-hidden']
  }>
  title?: ReactNode
  titleAs?: 'h2' | 'h3'
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'bg-secondary-50 text-body-sm flex gap-3 rounded-md p-4',
        className,
      )}
    >
      {/* As tall as the first line, so the icon centres on it. */}
      <span
        className={cn('flex shrink-0 items-center', title ? 'h-7' : 'h-lh')}
      >
        {/* Sized in em, so it scales with the notice's text size. */}
        <Icon aria-hidden className="text-secondary-700 size-[1.25em]" />
      </span>
      <div className="min-w-0 flex-1">
        {title ? (
          <Title className="font-condensed text-body-md text-secondary-800 mb-1 font-bold">
            {title}
          </Title>
        ) : null}
        {children}
      </div>
    </div>
  )
}
