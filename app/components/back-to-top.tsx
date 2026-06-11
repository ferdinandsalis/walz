import { CaretUp } from '@phosphor-icons/react'
import { Link } from 'react-router'

export function BackToTop({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Link
        to="#"
        className="group bg-card/50 font-condensed hover:bg-card inline-flex items-center gap-1 rounded-md p-2 px-6 text-lg transition-colors ease-in-out"
      >
        <span className="text-muted-foreground underline-offset-2 group-hover:underline">
          Nach oben
        </span>
        <CaretUp
          size={18}
          className="text-primary transition-transform group-hover:-translate-y-1"
        />
      </Link>
    </div>
  )
}
