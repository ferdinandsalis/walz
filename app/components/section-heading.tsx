import { Link } from '@remix-run/react'
import { Divider } from './ui/divider.tsx'

export function SectionHeading({
  children,
  id,
}: {
  children: any
  id: string
}) {
  return (
    <Link
      to={`.#${id}`}
      className="grid grid-cols-12 items-center outline-none"
      tabIndex={-1}
    >
      <h1
        id={id}
        className="col-span-1 col-start-1 col-end-13 row-start-1 row-end-1 text-center font-condensed text-base font-bold uppercase tracking-[0.2em] text-stone-400"
      >
        <span className="rounded bg-stone-100 px-8 py-2">{children}</span>
      </h1>
      <Divider className="-order-1 col-start-1 col-end-13 row-start-1" />
    </Link>
  )
}
