import { type LoaderFunctionArgs } from '@remix-run/node'
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
import { FooterNavigation, Navigation } from './components/shell.tsx'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './components/ui/collapsible.tsx'
import appStyleSheetUrl from './styles/app.css?url'
import fontStyleSheetUrl from './styles/font.css?url'
import { getEnv } from './utils/env.server.ts'
import { honeypot } from './utils/honeypot.server.ts'
import { cn, getDomainUrl } from './utils/misc.tsx'

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

export async function loader({ request }: LoaderFunctionArgs) {
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
    <div className="relative mx-auto mt-4 grid min-h-screen grid-cols-[0_1fr_0] items-start gap-x-4 gap-y-4 sm:mt-8 sm:gap-x-8 sm:gap-y-8 md:mt-12 md:grid-rows-[min-content_1fr_min-content] md:gap-y-12 lg:grid-cols-[0_minmax(min-content,732px)_minmax(min-content,320px)_0] lg:gap-y-16 xl:grid-cols-[0_248px_minmax(min-content,792px)_minmax(min-content,320px)_1fr]">
      <Collapsible asChild>
        <header
          className={cn(
            `col-span-1 col-start-2 row-start-1`,
            'lg:col-span-2 lg:col-start-2',
            'flex flex-col gap-4 md:flex-row md:flex-wrap md:gap-0',
            'xl:col-span-1 xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:flex-col xl:items-start xl:gap-8',
            'xl:sticky xl:top-4',
            'md:items-center',
          )}
        >
          <div className="flex flex-1 items-center justify-between">
            <Link
              to="/"
              className="group relative -top-1 flex items-center gap-2 py-1 outline-none"
              tabIndex={-1}
            >
              <LogoSymbol className="relative top-1 w-10 text-primary" />
              <LogoType className="w-20 fill-foreground/80" />
            </Link>
            <CollapsibleTrigger className="rounded-md bg-card/70 p-2 hover:bg-card md:hidden">
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

      <div className="col-span-1 col-start-2 row-start-2 grid grid-cols-subgrid md:col-span-2 md:col-start-2 xl:col-span-3 xl:row-start-1">
        {children}
      </div>

      <div className="col-span-3 row-start-3 mt-12 grid grid-cols-subgrid bg-muted/30 lg:col-span-4 lg:col-start-1 xl:col-span-5">
        <div className="col-span-1 col-start-2 grid lg:col-span-2 lg:col-start-2 xl:col-span-3 xl:col-start-3">
          <FooterNavigation />
        </div>
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
