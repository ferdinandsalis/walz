import { Outlet } from '@remix-run/react'

export default function Page() {
  return (
    <div className="prose md:mt-8">
      <Outlet />
    </div>
  )
}
