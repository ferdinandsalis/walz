import { Link } from '@remix-run/react'
import { ArrowUp } from 'lucide-react'

export function BackToTop() {
  return (
    <div className="">
      <Link
        to="#"
        className="inline-flex items-center gap-1 rounded-md border bg-card/30 p-2 px-6 font-condensed text-lg text-secondary"
      >
        <span className="">Nach oben</span>
        <ArrowUp size={20} className="stroke-secondary" />
      </Link>
    </div>
  )
}