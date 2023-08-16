import { Outlet } from '@remix-run/react'

export default function School() {
  return (
    <div className="mt-12 lg:mt-24">
      <h1 className="font-condensed text-xl font-bold text-primary md:text-4xl lg:text-5xl xl:text-6xl">
        Schule
      </h1>
      <Outlet />
    </div>
  )
}
