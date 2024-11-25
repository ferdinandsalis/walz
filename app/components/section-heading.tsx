import { Link } from 'react-router'

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
        className="col-span-1 col-start-1 col-end-13 row-start-1 row-end-1 text-center font-condensed text-base font-bold uppercase tracking-[0.15em] text-muted-foreground/40"
      >
        <span className="rounded bg-background px-8 py-2">{children}</span>
      </h1>
      <div
        role="presentation"
        className="-order-1 col-start-1 col-end-13 row-start-1 h-[3px] rounded border-none bg-muted"
      />
    </Link>
  )
}
