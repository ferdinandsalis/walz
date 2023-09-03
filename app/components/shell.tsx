import { Link, NavLink } from '@remix-run/react'
import { LogoSymbol, LogoType } from './brand.tsx'
import { cn } from '#app/utils/misc.tsx'
import { Home } from 'lucide-react'

const navigation = {
  main: [
    { name: 'Über Uns', to: '/ueber-uns' },
    { name: 'Curriculum', to: '/curriculum' },
    { name: 'Aufnahme', to: '/aufnahme' },
    { name: 'Aktuelles', to: '/aktuelles' },
  ],
  secondary: [
    { name: 'Impressum', to: '/impressum' },
    { name: 'Datenschutz', to: '/datenschutz' },
    { name: 'Kontakt', to: '/kontakt' },
  ],
  social: [],
}

export function Navigation() {
  return (
    <nav
      aria-label="Global"
      className="flex flex-col divide-y divide-stone-100 overflow-hidden rounded-lg bg-card shadow-lg shadow-stone-200 md:flex-row md:items-center md:divide-none  md:rounded-full md:bg-transparent md:pr-6 md:shadow-none"
    >
      <NavLink
        to="/"
        prefetch="intent"
        className={({ isActive }) =>
          cn(
            'focu:ring-2 group flex-none items-center px-3 py-3 font-condensed text-lg font-bold text-gray-700 outline-none transition-all hover:text-gray-900 focus:ring-2 focus:ring-inset focus:ring-primary/20 md:mr-1 md:aspect-square md:rounded-full md:p-3 lg:text-xl',
            {
              'ring-0': isActive,
              'hover:text-stone-900': !isActive,
            },
          )
        }
      >
        <Home
          size={24}
          className="order-1 hidden stroke-secondary md:block md:group-hover:scale-105"
        />
        <span className="md:sr-only">Startseite</span>
      </NavLink>
      {navigation.main.map(item => (
        <NavLink
          key={item.name}
          to={item.to}
          prefetch="intent"
          className={({ isActive }) =>
            cn(
              'px-3 py-3 font-condensed text-lg font-bold text-stone-800 outline-none ring-inset ring-card transition-all focus:ring-2 focus:ring-primary/20 md:rounded-md md:py-2 lg:text-xl',
              {
                'text-stone-900 ring-0': isActive,
                'hover:text-stone-900': !isActive,
                'relative after:absolute after:bottom-[5px] after:left-1/2 after:-ml-5 after:h-[2.5px] after:w-10 after:bg-primary after:content-[""]':
                  isActive,
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
    <footer className="grid grid-cols-1 items-center justify-center justify-items-center overflow-hidden py-8">
      <div className="relative z-10 col-start-1 row-start-1 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <nav
          className="mb-2 flex flex-wrap items-center justify-center gap-4 md:gap-8"
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

        <div className="relative z-10 mb-12">
          {/* Legal Links */}
          <div className="flex justify-center gap-4">
            <Link
              to="/impressum"
              prefetch="intent"
              className="font-condensed text-lg text-gray-600 underline underline-offset-2 hover:text-gray-800"
            >
              Impressum
            </Link>
            <Link
              to="/datenschutz"
              prefetch="intent"
              className="font-condensed text-lg text-gray-600 underline underline-offset-2 hover:text-gray-800"
            >
              Datenschutz
            </Link>
          </div>
        </div>

        <Link to="." className="group mb-4 flex flex-col items-center">
          <LogoType className="w-20 fill-secondary" />
          <div
            role="presentation"
            className="pointer-events-none absolute -bottom-24 transition-all group-hover:-bottom-24 lg:-bottom-24"
          >
            <LogoSymbol className="w-52 text-secondary opacity-10 group-hover:animate-ping group-hover:opacity-30 md:w-72 lg:w-96" />
          </div>
        </Link>

        <p className="text-center text-base text-gray-400">
          {new Date().getFullYear()} &copy; Walz Wiener Lernzentrum
          <br />
          Alle Rechte vorbehalten
        </p>
      </div>
    </footer>
  )
}
