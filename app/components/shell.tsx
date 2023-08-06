import { Link } from "@remix-run/react"
import { Logo } from "./brand"

const navigation = {
  main: [
    { name: 'Philosophie', to: '/philosophie' },
    { name: 'Über Uns', to: '/ueber-uns' },
    { name: 'Aktuelles', to: '/aktuelles' },
    { name: 'Kontakt', to: '/kontakt' },
  ],
  social: [],
}


export function Navigation() {
  return (

              <div className="flex flex-col items-end gap-4 md:flex-row md:items-center">
                {navigation.main.map(item => (
                  <Link
                    key={item.name}
                    to={item.to}
                    prefetch="intent"
                    className="text-lg font-bold text-gray-700 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
  )
}

export function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-7xl overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
        <nav
          className="mb-8 flex flex-wrap items-center justify-center md:space-x-6"
          aria-label="Footer"
        >
          {navigation.main.map(item => (
            <Link
              key={item.name}
              to={item.to}
              prefetch="intent"
              className="font-serif text-lg text-gray-600 hover:text-gray-800"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-center">
          <Logo className="w-36" />
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/legal"
            prefetch="intent"
            className="font-serif text-lg text-gray-600 hover:text-gray-800"
          >
            Impressum
          </Link>
          <p className="text-center text-base text-gray-400">
            {new Date().getFullYear()} &copy; Walz. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  )
}
