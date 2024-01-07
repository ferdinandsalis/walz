import { Link } from '@remix-run/react'

export function BackToTop() {
  return (
    <div className="">
      <Link
        to="#"
        className="inline-flex items-center gap-1 rounded-md border bg-card/50 p-2 px-6 font-condensed text-lg text-secondary transition-colors ease-in-out hover:bg-card"
      >
        <span className="">Nach oben</span>
      </Link>
    </div>
  )
}
