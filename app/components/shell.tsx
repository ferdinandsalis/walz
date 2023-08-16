import { Link } from '@remix-run/react'
import { Logo, LogoSymbol, LogoType } from './brand'
import { HomeIcon } from '@radix-ui/react-icons'
import { Home } from '@carbon/icons-react'

const navigation = {
  main: [
    { name: 'Schule', to: '/schule' },
    { name: 'Über Uns', to: '/ueber-uns' },
    { name: 'Aktuelles', to: '/aktuelles' },
    { name: 'Kontakt', to: '/kontakt' },
  ],
  social: [],
}

export function Navigation() {
  return (
    <nav
      aria-label="Global"
      className="flex flex-col divide-y rounded-lg bg-white px-2 shadow-lg shadow-gray-200 md:flex-row md:items-center md:divide-y-0 md:rounded-full md:px-6"
    >
      <Link
        to="/"
        prefetch="intent"
        className="inline-flex items-center gap-2 px-2 py-3 font-condensed text-lg font-bold text-gray-700 hover:text-gray-900 lg:px-4 lg:text-xl"
      >
        <Home size={20} className="fill-primary" />
        <span className="sr-only">Home</span>
      </Link>
      {navigation.main.map(item => (
        <Link
          key={item.name}
          to={item.to}
          prefetch="intent"
          className="px-2 py-3 font-condensed text-lg font-bold text-gray-700 hover:text-gray-900 lg:px-4 lg:text-xl"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  )
}

export function Footer() {
  return (
    <footer className="relative grid grid-cols-1 items-center justify-center justify-items-center py-8">
      <div role="presentation" className="col-start-1 row-start-1">
        <LogoSymbol className="w-52 text-secondary opacity-10 md:w-60 lg:w-72" />
      </div>
      <div className="relative col-start-1 row-start-1 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <nav
          className="mb-8 flex flex-wrap items-center justify-center md:space-x-6"
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
            className="font-condensed text-lg font-bold text-gray-600 hover:text-gray-800"
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
