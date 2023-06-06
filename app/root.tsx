import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import type { MetaFunction } from '@remix-run/node'
import styles from './styles/app.css'
import { LogoIcon, Logo, LogoType } from './components/brand'

export function links() {
  return [
    { rel: 'stylesheet', href: styles },
    { rel: 'stylesheet', href: 'https://use.typekit.net/jlg5amm.css' },
  ]
}

export const meta: MetaFunction = () => {
  return { title: 'Walz' }
}

const navigation = {
  main: [
    { name: 'Die Schule', to: '/schule' },
    { name: 'Philosophie', to: '/philosophie' },
    { name: 'Aktuelles', to: '/aktuelles' },
    { name: 'Team', to: '/team' },
    { name: 'Kontakt', to: '/kontakt' },
  ],
  social: [],
}

export default function App() {
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>

      <body className="font-normal text-gray-700">
        <div className="mx-auto max-w-7xl p-8 md:p-12">
          <header className="mb-8">
            <nav
              aria-label="Global"
              className="relative flex flex-wrap items-center justify-center"
            >
              <div className="flex-1">
                <Link to="/" className="flex items-center gap-2">
                  <LogoIcon className="w-10" />
                  <LogoType className="w-16" />
                </Link>
              </div>

              <div className="items-center md:flex md:gap-6">
                {navigation.main.map(item => (
                  <Link
                    to={item.to}
                    prefetch="intent"
                    className="font-serif text-lg text-gray-600 hover:text-gray-800"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className=""></div>
            </nav>
          </header>
          <main className="px-8">
            <Outlet />
          </main>
          <hr className="border-b border-gray-200" />
          <Footer />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-7xl overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
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
