import type { V2_MetaFunction } from '@remix-run/node'
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { LogoSymbol, LogoType } from './components/brand.tsx'
import styles from './styles/app.css'
import { Footer, Navigation } from './components/shell.tsx'
import { GeneralErrorBoundary } from './components/error-boundary.tsx'

export function links() {
  return [
    { rel: 'stylesheet', href: styles },
    { rel: 'stylesheet', href: 'https://use.typekit.net/jlg5amm.css' },
  ]
}

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Walz' }]
}

function Document({
  children,
  nonce,
  theme = 'light',
  env = {},
}: {
  children: React.ReactNode
  nonce?: string
  theme?: 'dark' | 'light'
  env?: Record<string, string>
}) {
  return (
    <html lang="de" className={`${theme} h-full overflow-x-hidden`}>
      <head>
        <Meta />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Links />
      </head>
      <body className="bg-background bg-neutral-100 text-foreground">
        {children}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(env)}`,
          }}
        />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Document>
      <div className="flex min-h-screen flex-col">
        <header className="container my-8 flex flex-col px-4 sm:px-8 md:flex-row md:flex-wrap md:items-center md:px-12">
          <div className="flex-1">
            <Link to="/" className="flex items-center gap-2">
              <LogoSymbol className="relative top-1 w-10 text-primary hover:text-primary" />
              <LogoType className="w-24 fill-secondary" />
            </Link>
          </div>
          <Navigation />
        </header>

        <div className="container flex-1 px-4 sm:px-8 md:px-12">
          <Outlet />
        </div>

        <div className="mt-24 bg-neutral-200/70">
          <div className="container px-4 sm:px-8 md:px-12">
            <Footer />
          </div>
        </div>
      </div>
    </Document>
  )
}

export function ErrorBoundary() {
  // NOTE: you cannot use useLoaderData in an ErrorBoundary because the loader
  // likely failed to run so we have to do the best we can.
  return (
    <Document>
      <GeneralErrorBoundary />
    </Document>
  )
}
