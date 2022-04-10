import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'remix'
import type { MetaFunction } from 'remix'
import styles from './styles/app.css'
import { Icon, Logo } from './components/brand'

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
    { name: 'Das Team', to: '/team' },
    { name: 'Kontakt', to: '/kontakt' },
    { name: 'Impressum', to: '/impressum' },
  ],
  social: [],
}

export default function App() {
  return (
    <html lang="en">
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
              <div className="flex flex-1 items-center md:absolute md:inset-y-0 md:left-0">
                <div className="flex flex-1 items-center md:absolute md:inset-y-0 md:left-0">
                  <Link to="/">
                    <span className="sr-only">Walz</span>
                    <Icon className='w-8' />
                  </Link>
                </div>
              </div>
              <div className="items-center md:flex md:space-x-10">
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
            </nav>
          </header>
          <main>
            <Outlet />
          </main>
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
    <footer className="mt-16">
      <div className="mx-auto max-w-7xl overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
        <nav
          className="flex flex-wrap justify-center items-center md:space-x-6 mb-8"
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
          <Logo />
        </div>
        <p className="mt-8 text-center text-base text-gray-400">
          {new Date().getFullYear()} &copy; Walz. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  )
}
