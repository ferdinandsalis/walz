import { CaretUp } from '@phosphor-icons/react'
import { Link } from 'react-router'
import { cn } from '#app/utils/misc.js'

export function Divider({
  className,
  withBackToTop = true,
}: {
  className?: string
  withBackToTop?: boolean
}) {
  return (
    <div
      role="presentation"
      className={cn(
        'group bg-muted relative h-[3px] rounded border-none',
        className,
      )}
    >
      {withBackToTop && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <Link
            to="#"
            className="group bg-muted font-condensed ring-muted hover:bg-card inline-flex items-center gap-1 rounded-full p-2 px-2 text-lg ring-3 transition-colors ease-in-out"
            title="Nach oben"
          >
            <CaretUp
              size={18}
              className="text-primary transition-transform group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      )}
    </div>
  )
}
