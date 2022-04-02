import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'remix'
import type { MetaFunction } from 'remix'
import styles from './styles/app.css'
import { Icon } from './components/brand'

export function links() {
  return [
    { rel: 'stylesheet', href: styles },
    { rel: 'stylesheet', href: 'https://use.typekit.net/jlg5amm.css' },
  ]
}

export const meta: MetaFunction = () => {
  return { title: 'Walz' }
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
      <body className="text-slate-900">
        <div className="max-w-7xl mx-auto p-8 md:p-12">
          <header>
            <Icon className="w-16" />
          </header>
          <Outlet />
          <Footer />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

const navigation = {
  main: [
    { name: 'Die Schule', href: 'schule' },
    { name: 'Das Team', href: 'team' },
    { name: 'Kontakt', href: 'kontakt' },
    { name: 'Impressum', href: 'impressum' },
  ],
  social: [],
}

function Footer() {
  return (
    <footer className="mt-16">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav
          className="-mx-5 -my-2 flex flex-wrap justify-center"
          aria-label="Footer"
        >
          {navigation.main.map(item => (
            <div key={item.name} className="px-5 py-2">
              <a
                href={item.href}
                className="text-lg text-gray-700 hover:text-gray-900"
              >
                {item.name}
              </a>
            </div>
          ))}
        </nav>
        <p className="mt-8 text-center text-base text-gray-400">
          {new Date().getFullYear()} &copy; Walz. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  )
}
