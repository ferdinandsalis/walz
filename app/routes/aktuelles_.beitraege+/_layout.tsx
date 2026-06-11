import { ArrowLeft } from '@phosphor-icons/react'
import { Link, Outlet } from 'react-router'

export default function PostLayout() {
  return (
    <div className="md:mt-8">
      <Link
        to="/aktuelles"
        className="group/more font-condensed mt-4 mb-4 flex items-center gap-1 text-lg"
      >
        <span className="underline-offset-2 group-hover/more:underline">
          Zurück zur Übersicht
        </span>
        <ArrowLeft
          size="18"
          className="text-primary transition-transform group-hover/more:translate-x-1"
        />
      </Link>

      <div className="text-pretty hyphens-auto">
        <Outlet />
      </div>
    </div>
  )
}
