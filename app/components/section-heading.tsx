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
      className="grid grid-cols-12 items-center outline-hidden"
      tabIndex={-1}
    >
      <h1
        id={id}
        className="font-condensed text-muted-foreground/40 col-span-1 col-start-1 col-end-13 row-start-1 row-end-1 text-center text-base font-bold tracking-[0.15em] uppercase"
      >
        <span className="bg-background rounded px-8 py-2">{children}</span>
      </h1>
      <div
        role="presentation"
        className="bg-muted -order-1 col-start-1 col-end-13 row-start-1 h-[3px] rounded border-none"
      />
    </Link>
  )
}
