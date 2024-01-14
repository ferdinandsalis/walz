import { Link, Outlet } from '@remix-run/react'
import { ArrowLeft } from 'lucide-react'

export default function PostLayout() {
  return (
    <div className="prose md:mt-8">
      <Link
        to="/aktuelles"
        className="group/more mb-4 mt-4 flex items-center gap-1 font-condensed text-lg"
      >
        <span className="underline-offset-2 group-hover/more:underline">
          Zurück zur Übersicht
        </span>
        <ArrowLeft
          size="20"
          className="stroke-primary transition-transform group-hover/more:translate-x-1"
        />
      </Link>

      <div className="hyphens-auto text-pretty">
        <Outlet />
      </div>
    </div>
  )
}
