import { Link } from '@remix-run/react'

export function Toc({
  title = 'Inhalt',
  links,
}: {
  title?: string
  links: { name: string; to: string }[]
}) {
  return (
    <nav className="flex flex-col space-y-1">
      <h2 className="mb-1 text-sm font-bold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      <ol className="list-inside list-decimal space-y-1 md:list-outside">
        {links.map(link => {
          return (
            <li key={link.to} className="text-secondary">
              <Link
                to={link.to}
                className="font-condensed text-base text-foreground md:text-xl"
              >
                {link.name}
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
