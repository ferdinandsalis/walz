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
import { LogoIcon, LogoType } from './components/brand.tsx'
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
			{/* <body className="bg-background text-foreground"> */}
      <body className="bg-neutral-100 font-normal text-gray-700">
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
      <div className="mx-auto max-w-7xl p-4 sm:p-8 md:p-12">
        <header className="mb-8">
          <nav
            aria-label="Global"
            className="relative flex flex-wrap justify-center md:items-center"
          >
            <div className="flex-1">
              <Link to="/" className="flex items-center gap-2">
                <LogoIcon className="w-10" />
                <LogoType className="w-16" />
              </Link>
            </div>
            <Navigation />
            <div className=""></div>
          </nav>
        </header>
        <main className="">
          <Outlet />
        </main>
        <hr className="border-b border-gray-200" />
        <Footer />
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

