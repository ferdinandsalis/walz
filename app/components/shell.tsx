import { Link, NavLink } from '@remix-run/react'
import { LogoSymbol, LogoType } from './brand'
import { Home } from '@carbon/icons-react'
import { cn } from '~/utils/misc'

const navigation = {
  main: [
    { name: 'Über Uns', to: '/ueber-uns' },
    { name: 'Aufnahme', to: '/aufnahme' },
    { name: 'Curriculum', to: '/curriculum' },
    { name: 'Aktuelles', to: '/aktuelles' },
  ],
  secondary: [
    { name: 'Impressum', to: '/impressum' },
    { name: 'Datenschutz', to: '/datenschutz' },
    { name: 'Kontakt', to: '/kontakt' },
    { name: 'Termine', to: '/aktuelles' },
  ],
  social: [],
}

export function Navigation() {
  return (
    <nav
      aria-label="Global"
      className="flex flex-col divide-y divide-stone-200 overflow-hidden rounded-lg bg-card px-2 shadow-lg shadow-stone-200 md:flex-row md:items-center md:divide-none md:rounded-full md:px-0 md:pr-6"
    >
      <NavLink
        to="/"
        prefetch="intent"
        className={({ isActive }) =>
          cn(
            'group flex-none items-center p-3 font-condensed text-lg font-bold text-gray-700 outline-none ring-4 ring-inset ring-card transition-all hover:text-gray-900 focus:ring-primary/20 md:aspect-square md:rounded-l-full md:p-4 lg:text-xl',
            {
              'md:bg-primary/10': isActive,
            },
          )
        }
      >
        <Home
          size={20}
          className="order-1 hidden fill-primary md:block md:group-hover:scale-105"
        />
        <span className="md:sr-only">Home</span>
      </NavLink>
      {navigation.main.map(item => (
        <NavLink
          key={item.name}
          to={item.to}
          prefetch="intent"
          className={({ isActive }) =>
            cn(
              'px-3 py-3 font-condensed text-lg font-bold text-stone-700 outline-none ring-4 ring-inset ring-card transition-transform focus:ring-primary/20 lg:px-4 lg:text-xl',
              {
                'bg-primary/5 text-stone-900': isActive,
                'hover:text-stone-900': !isActive,
              },
            )
          }
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
  )
}

export function Footer() {
  return (
    <footer className="relative grid grid-cols-1 items-center justify-center justify-items-center py-8">
      <div role="presentation" className="col-start-1 row-start-1">
        <LogoSymbol className="w-52 text-secondary opacity-20 md:w-60 lg:w-72" />
      </div>
      <div className="relative col-start-1 row-start-1 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <nav
          className="mb-8 flex flex-wrap items-center justify-center gap-4 md:gap-8"
          aria-label="Footer"
        >
          {navigation.main.map(item => (
            <Link
              key={item.name}
              to={item.to}
              prefetch="intent"
              className="font-condensed text-lg font-bold text-gray-600 hover:text-gray-800 md:text-xl"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-center">
          <LogoType className="w-24 fill-secondary" />
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/impressum"
            prefetch="intent"
            className="font-condensed text-lg font-bold text-gray-600 underline underline-offset-2 hover:text-gray-800"
          >
            Impressum
          </Link>
          <p className="text-center font-condensed text-base text-gray-400">
            {new Date().getFullYear()} &copy; Walz. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  )
}