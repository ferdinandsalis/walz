import { BookOpen } from 'lucide-react'
import { Link } from 'react-router'
import { cn } from '#app/utils/misc.js'

export function Toc({
  title = 'Inhalt',
  links,
  className,
}: {
  title?: string
  links: { name: string; to: string }[]
  className?: string
}) {
  return (
    <nav className={cn('grid gap-3', className)}>
      <h2 className="flex items-center gap-2 text-body-sm font-bold uppercase tracking-widest text-muted-foreground">
        <BookOpen size={18} className="inline-block stroke-primary" />
        {title}
      </h2>
      <ol className="list-inside list-disc space-y-0.5">
        {links.map(link => {
          return (
            <li key={link.to} className="text-secondary">
              <Link
                to={link.to}
                className="font-condensed text-body-md text-foreground"
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
