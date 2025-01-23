import { ChevronUpIcon } from 'lucide-react'
import { Link } from 'react-router'

export function BackToTop({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Link
        to="#"
        className="group inline-flex items-center gap-1 rounded-md bg-card/50 p-2 px-6 font-condensed text-lg transition-colors ease-in-out hover:bg-card"
      >
        <span className="text-muted-foreground underline-offset-2 group-hover:underline">
          Nach oben
        </span>
        <ChevronUpIcon
          size={18}
          className="stroke-primary transition-transform group-hover:-translate-y-1"
        />
      </Link>
    </div>
  )
}
