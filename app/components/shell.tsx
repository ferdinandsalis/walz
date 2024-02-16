import { Link, NavLink } from '@remix-run/react'
import { LogoSymbol, LogoType } from './brand.tsx'
import { cn } from '#app/utils/misc.tsx'
import { ExternalLinkIcon, Home } from 'lucide-react'
import { Newsletter } from '#app/routes/_index.tsx'

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
                'hover:text-primary': !isActive,
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
    <footer className="overflow-hidden">
      <div className="container relative z-10 mx-auto grid grid-cols-2 items-start gap-12 px-4 py-12 sm:px-8 md:px-12 lg:py-24">
        <div className="col-span-2 md:col-span-1">
          <Newsletter />
        </div>

        <div className="col-span-2 grid grid-cols-2 gap-8 md:col-span-1">
          <nav className="grid grid-cols-1 gap-1">
            {/* Site Links */}
            {navigation.main.map(item => (
              <Link
                key={item.name}
                to={item.to}
                prefetch="intent"
                className="font-condensed text-lg font-bold hover:text-primary md:text-xl"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="relative z-10">
            {/* Legal Links */}
            <div className="grid grid-cols-1 gap-1">
              <Link
                to="/impressum"
                prefetch="intent"
                className="font-condensed text-lg text-muted-foreground underline underline-offset-2 hover:text-black"
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

          <div className="col-span-2">
            {/* Social Links */}
            <Link
              to="https://instagram.com/walz_wien"
              className="inline-flex items-center gap-2"
            >
              <img
                src="/instagram_glyph.svg"
                alt="Instagram Logo"
                className="w-6"
              />
              <span className="text-muted-foreground hover:text-primary">
                Folge uns auf Instagram.
              </span>
              <ExternalLinkIcon size={18} className="stroke-primary" />
            </Link>
          </div>
        </div>

        <div className="col-span-2 justify-self-center">
          <Link to="." className="group mb-4 flex flex-col items-center">
            <LogoType className="w-24 fill-secondary" />
            <div
              role="presentation"
              className="pointer-events-none absolute -bottom-40 transition-all"
            >
              <LogoSymbol className="w-52 text-muted-foreground opacity-5 md:w-72 lg:w-96" />
            </div>
          </Link>

          <p className="text-center text-base">
            <span className="font-bold text-primary">
              {new Date().getFullYear()} &copy; Walz Wiener Lernzentrum
            </span>
            <br />
            <span className="text-black">Alle Rechte vorbehalten</span>.
          </p>
        </div>
      </div>
    </footer>
  )
}
