import { List } from '@phosphor-icons/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from 'react-router'
import { HoneypotProvider } from 'remix-utils/honeypot/react'
import { type Route } from '../.react-router/types/app/+types/root.ts'
import { LogoSymbol, LogoType } from './components/brand.tsx'
import { GeneralErrorBoundary } from './components/error-boundary.tsx'
import { FooterNavigation, Navigation } from './components/shell.tsx'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './components/ui/collapsible.tsx'
import { useDismiss } from './components/use-dismiss.ts'
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

export async function loader({ request }: Route.LoaderArgs) {
  return {
    requestInfo: {
      origin: getDomainUrl(request),
      path: new URL(request.url).pathname,
    },
    honeyProps: (await honeypot.getInputProps()) as {
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
        {/*
          The script above is deferred, so it may not have run yet when someone
          interacts with the page. This queue stub takes the calls in the
          meantime; the real script drains them once it loads.
        */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html:
              'window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}',
          }}
        />
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

/**
 * The phone menu's open state: it closes when a page is chosen, on a tap
 * outside the header and on Escape.
 */
function usePhoneMenu() {
  const [open, setOpen] = useState(false)
  const header = useRef<HTMLElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])
  const close = useCallback(() => setOpen(false), [])
  useDismiss({ open, close, container: header, button })

  return { open, setOpen, header, button }
}

function Layout({ children }: any) {
  const menu = usePhoneMenu()

  return (
    <div className="relative mx-auto mt-4 grid min-h-screen grid-cols-[0_1fr_0] items-start gap-x-4 gap-y-8 sm:mt-8 sm:gap-x-8 md:mt-12 md:grid-rows-[min-content_1fr_min-content] md:gap-y-12 lg:grid-cols-[0_minmax(min-content,732px)_minmax(min-content,320px)_0] lg:gap-y-16 xl:grid-cols-[0_248px_minmax(min-content,792px)_minmax(min-content,320px)_1fr]">
      <Collapsible asChild open={menu.open} onOpenChange={menu.setOpen}>
        <header
          ref={menu.header}
          className={cn(
            `relative col-span-1 col-start-2 row-start-1`,
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
              aria-label="Walz Startseite"
              className="group focus-visible:ring-primary/30 relative -top-1 flex items-center gap-2 rounded-md py-1 outline-hidden focus-visible:ring-2"
            >
              <LogoSymbol className="text-primary relative top-1 w-10" />
              <LogoType className="fill-foreground/80 w-20" />
            </Link>
            {/* 44px, a thumb-sized target; it fits the logo's row height. */}
            <CollapsibleTrigger
              ref={menu.button}
              aria-label="Menü"
              className="bg-card/70 hover:bg-card grid size-11 place-items-center rounded-md md:hidden"
            >
              <List aria-hidden className="text-primary" />
            </CollapsibleTrigger>
          </div>
          {/* Over the page, under the logo row, so opening it moves nothing */}
          <CollapsibleContent className="absolute inset-x-0 top-full z-40 mt-2 md:hidden">
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

      <div className="bg-muted/30 col-span-3 row-start-3 mt-12 grid grid-cols-subgrid lg:col-span-4 lg:col-start-1 xl:col-span-5">
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

export default AppWithProviders

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
