import {
  ExternalLinkIcon,
  Home,
  InstagramIcon,
  YoutubeIcon,
} from 'lucide-react'
import { Link, NavLink } from 'react-router'
import { cn } from '#app/utils/misc.tsx'
import { LogoType } from './brand.tsx'
import { NewsletterForm } from './newsletter.tsx'

const navigation = {
  main: [
    { name: 'Aktuelles', to: '/aktuelles' },
    { name: 'Über Uns', to: '/ueber-uns' },
    { name: 'Curriculum', to: '/curriculum' },
    { name: 'Aufnahme', to: '/aufnahme' },
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
      className="flex flex-col divide-y divide-stone-100 overflow-hidden rounded-lg bg-card shadow-lg shadow-stone-200 md:flex-row md:items-center md:gap-2 md:divide-none md:bg-transparent md:shadow-none lg:gap-3 xl:flex-col xl:items-start xl:gap-0"
    >
      <NavLink
        to="/"
        prefetch="intent"
        className={({ isActive }) =>
          cn(
            'group flex-none items-center px-3 py-2 font-condensed text-lg font-bold outline-none transition-colors hover:text-gray-900 focus:ring-2 focus:ring-inset focus:ring-primary/20 md:mr-1 md:aspect-square md:rounded-full md:p-3 lg:text-xl xl:aspect-auto xl:rounded-none xl:p-1',
            'hover:text-primary',
            {
              'text-stone-900 ring-0': isActive,
              'relative after:absolute after:bottom-[5px] after:left-1/2 after:-ml-5 after:h-[2px] after:w-10 after:bg-primary after:content-none md:after:content-[""] xl:after:content-none':
                isActive,
            },
          )
        }
      >
        <Home
          size={24}
          className="order-1 hidden stroke-secondary md:block md:group-hover:scale-105 xl:hidden"
        />
        <span className="md:sr-only xl:not-sr-only">Startseite</span>
      </NavLink>
      {navigation.main.map(item => (
        <NavLink
          key={item.name}
          to={item.to}
          prefetch="intent"
          className={({ isActive }) =>
            cn(
              'px-3 py-2 font-condensed text-lg font-bold text-stone-800 outline-none ring-inset ring-card transition-colors focus:ring-2 focus:ring-primary/20 md:rounded-md md:px-1 md:py-2 lg:text-xl xl:p-1',
              'hover:text-primary',
              {
                'text-stone-900 ring-0': isActive,
                'relative after:absolute after:bottom-[5px] after:left-1/2 after:-ml-5 after:h-[2px] after:w-10 after:bg-primary after:content-none md:after:content-[""] xl:after:content-none':
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

export function FooterNavigation() {
  return (
    <footer className="relative z-10 grid grid-cols-2 items-start gap-12 py-12 lg:py-24">
      <div id="newsletter" className="col-span-2 md:col-span-1">
        <h1 className="sr-only">Newsletter</h1>
        <NewsletterForm />
      </div>

      <div className="col-span-2 grid grid-cols-2 gap-8 md:col-span-1">
        <nav className="grid grid-cols-1 gap-1">
          {/* Site Links */}
          {navigation.main.map(item => (
            <Link
              key={item.name}
              to={item.to}
              prefetch="intent"
              className="font-condensed font-bold hover:text-primary md:text-body-md"
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
              className="font-condensed text-muted-foreground underline underline-offset-2 hover:text-foreground md:text-body-md"
            >
              Impressum
            </Link>
            <Link
              to="/datenschutz"
              prefetch="intent"
              className="font-condensed text-muted-foreground underline underline-offset-2 hover:text-foreground md:text-body-md"
            >
              Datenschutz
            </Link>
          </div>
        </div>

        <div className="col-span-2 grid gap-2">
          <p className="mb-2">Folge uns auf …</p>
          {/* Social Links */}
          <div className="flex flex-wrap gap-2">
            <Link
              to="https://instagram.com/walz_wien"
              className="inline-flex items-center gap-2 rounded bg-white/50 px-3 py-1"
            >
              <InstagramIcon size={20} className="stroke-primary" />
              <span className="text-muted-foreground hover:text-primary">
                Instagram
              </span>
              <ExternalLinkIcon
                size={18}
                className="stroke-muted-foreground/50"
              />
            </Link>
            <Link
              to="https://www.youtube.com/channel/UCV9s0X21PcGR5th-tl02BPg"
              className="inline-flex items-center gap-2 rounded bg-white/50 px-3 py-1"
            >
              <YoutubeIcon size={20} className="stroke-primary" />
              <span className="text-muted-foreground hover:text-primary">
                Youtube
              </span>
              <ExternalLinkIcon
                size={18}
                className="stroke-muted-foreground/50"
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="col-span-2 justify-self-center">
        <Link to="." className="group mb-4 flex flex-col items-center">
          <LogoType className="w-24 fill-foreground opacity-20" />
        </Link>

        <p className="text-center">
          <span className="font-bold text-primary">
            {new Date().getFullYear()} &copy; Walz Wiener Lernzentrum
          </span>
          <br />
          <span className="text-foreground/70">Alle Rechte vorbehalten</span>.
        </p>
      </div>
    </footer>
  )
}
