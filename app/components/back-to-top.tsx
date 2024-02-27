import { Link } from '@remix-run/react'
import { ChevronUpIcon } from 'lucide-react'

export function BackToTop() {
  return (
    <div className="">
      <Link
        to="#"
        className="inline-flex items-center gap-1 rounded-md bg-card/50 p-2 px-6 font-condensed text-lg transition-colors ease-in-out hover:bg-card"
      >
        <span className="text-muted-foreground">Nach oben</span>
        <ChevronUpIcon className="stroke-primary" size={18} />
      </Link>
    </div>
  )
}
