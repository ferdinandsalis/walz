import type { MetaFunction } from '@remix-run/node'
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from '@remix-run/react'
import { withSentry } from '@sentry/remix'
import { LogoSymbol, LogoType } from './components/brand.tsx'
import styles from './styles/app.css'
import { Footer, Navigation } from './components/shell.tsx'
import { GeneralErrorBoundary } from './components/error-boundary.tsx'
import { MenuIcon } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './components/ui/collapsible.tsx'

export function links() {
  return [
    { rel: 'stylesheet', href: styles },
    { rel: 'stylesheet', href: 'https://use.typekit.net/jlg5amm.css' },
  ]
}

export const meta: MetaFunction = () => {
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
        <script
          defer
          data-domain="walz.at"
          src="https://plausible.io/js/script.js"
        ></script>
      </head>
      <body className="bg-background text-foreground">
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

function App() {
  const { pathname } = useLocation()
  const isStudioRoute = pathname.startsWith('/studio')

  return (
    <Document>
      {isStudioRoute ? (
        <div className="grid min-h-screen">
          <Outlet />
        </div>
      ) : (
        <Layout>
          <Outlet />
        </Layout>
      )}
    </Document>
  )
}

function Layout({ children }: any) {
  return (
    <div className="flex min-h-screen flex-col">
      <Collapsible>
        <header className="2xl:my-16 container my-8 flex flex-col space-y-8 px-4 sm:px-8 md:flex-row md:flex-wrap md:items-center md:space-y-0 md:px-12 lg:my-12">
          <div className="flex flex-1 items-center justify-between">
            <Link
              to="/"
              className="group flex items-center gap-2 outline-none"
              tabIndex={-1}
            >
              <LogoSymbol className="relative top-1 w-10 text-primary" />
              <LogoType className="w-20 fill-foreground/80" />
            </Link>
            <CollapsibleTrigger className="relative top-1 rounded-md bg-card/50 p-2 hover:bg-card md:hidden">
              <MenuIcon className="stroke-primary" />
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="md:hidden">
            <Navigation />
          </CollapsibleContent>
          <div className="hidden md:block">
            <Navigation />
          </div>
        </header>
      </Collapsible>

      <div className="container relative flex-1 px-4 sm:px-8 md:px-12">
        {children}
      </div>

      <div className="mt-24 bg-muted/40">
        <div className="px-4 sm:px-8 md:px-12">
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default withSentry(App)

export function ErrorBoundary() {
  // NOTE: you cannot use useLoaderData in an ErrorBoundary because the loader
  // likely failed to run so we have to do the best we can.
  return (
    <Document>
      <GeneralErrorBoundary />
    </Document>
  )
}
