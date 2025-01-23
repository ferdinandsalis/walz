import { ChevronUpIcon } from 'lucide-react'
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
        'group relative h-[3px] rounded border-none bg-muted',
        className,
      )}
    >
      {withBackToTop && (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 transform">
          <Link
            to="#"
            className="group inline-flex items-center gap-1 rounded-full bg-muted p-2 px-2 font-condensed text-lg ring ring-muted transition-colors ease-in-out hover:bg-card"
            title="Nach oben"
          >
            <ChevronUpIcon
              size={18}
              className="stroke-primary transition-transform group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      )}
    </div>
  )
}
