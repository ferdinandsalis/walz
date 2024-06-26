import { unstable_defineLoader as defineLoader } from '@remix-run/node'
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from '@remix-run/react'
import { withSentry } from '@sentry/remix'
import { MenuIcon } from 'lucide-react'
import { HoneypotProvider } from 'remix-utils/honeypot/react'
import { LogoSymbol, LogoType } from './components/brand.tsx'
import { GeneralErrorBoundary } from './components/error-boundary.tsx'
import { Footer, Navigation } from './components/shell.tsx'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './components/ui/collapsible.tsx'
import appStyleSheetUrl from './styles/app.css?url'
import fontStyleSheetUrl from './styles/font.css?url'
import { getEnv } from './utils/env.server.ts'
import { honeypot } from './utils/honeypot.server.ts'
import { getDomainUrl } from './utils/misc.tsx'

export function links() {
  return [
    { rel: 'preload', href: appStyleSheetUrl, as: 'style' },
    { rel: 'stylesheet', href: appStyleSheetUrl },
    { rel: 'preload', href: fontStyleSheetUrl, as: 'style' },
    { rel: 'stylesheet', href: fontStyleSheetUrl },
  ]
}

export function meta() {
  return [{ title: 'Walz' }]
}

export const loader = defineLoader(async ({ request }) => {
  return {
    requestInfo: {
      origin: getDomainUrl(request),
      path: new URL(request.url).pathname,
    },
    honeyProps: honeypot.getInputProps() as {
      nameFieldName: string
      validFromFieldName: string | null
      encryptedValidFrom: string
    },
    ENV: getEnv(),
  }
})

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
      </body>
    </html>
  )
}

function App() {
  const { pathname } = useLocation()
  const loaderData = useLoaderData<typeof loader>()
  const isStudioRoute = pathname.startsWith('/studio')

  return (
    <Document env={loaderData.ENV}>
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

      <div className="mt-24 border-b-8 border-b-secondary bg-muted/40">
        <Footer />
      </div>
    </div>
  )
}

function AppWithProviders() {
  const data = useLoaderData<typeof loader>()
  return (
    <HoneypotProvider {...data.honeyProps}>
      <App />
    </HoneypotProvider>
  )
}

export default withSentry(AppWithProviders)

export function ErrorBoundary() {
  // NOTE: you cannot use useLoaderData in an ErrorBoundary because the loader
  // likely failed to run so we have to do the best we can.
  // We could probably do better than this (it's possible the loader did run).
  // This would require a change in Remix.

  // Just make sure your root route never errors out and you'll always be able
  // to give the user a better UX.

  return (
    <Document>
      <GeneralErrorBoundary />
    </Document>
  )
}
