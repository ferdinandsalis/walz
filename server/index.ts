import crypto from 'crypto'
import { createRequestHandler } from '@react-router/express'
import { type ServerBuild } from 'react-router'
import { ip as ipAddress } from 'address'
import chalk from 'chalk'
import closeWithGrace from 'close-with-grace'
import compression from 'compression'
import express from 'express'
import rateLimit from 'express-rate-limit'
import getPort, { portNumbers } from 'get-port'
import morgan from 'morgan'

const MODE = process.env.NODE_ENV ?? 'development'
const IS_PROD = MODE === 'production'
const IS_DEV = MODE === 'development'
const ALLOW_INDEXING = process.env.ALLOW_INDEXING !== 'false'

const viteDevServer = IS_PROD
  ? undefined
  : await import('vite').then(vite =>
      vite.createServer({
        server: { middlewareMode: true },
      }),
    )

const app = express()

app.use((req, res, next) => {
  // Check if the request header contains 'www.'
  if (req?.headers?.host && req?.headers?.host.slice(0, 4) === 'www.') {
    // Remove 'www.' and redirect to non-www domain
    const newHost = req.headers.host.slice(4)
    return res.redirect(301, req.protocol + '://' + newHost + req.originalUrl)
  }
  next()
})

const getHost = (req: { get: (key: string) => string | undefined }) =>
  req.get('X-Forwarded-Host') ?? req.get('host') ?? ''

// Ensure HTTPS only (X-Forwarded-Proto comes from Fly)
app.use((req, res, next) => {
  const proto = req.get('X-Forwarded-Proto')
  const host = getHost(req)
  if (proto === 'http') {
    res.set('X-Forwarded-Proto', 'https')
    res.redirect(`https://${host}${req.originalUrl}`)
    return
  }
  next()
})

// Redirect old php routes
app.get(['/index.php', '/index.php/*'], (req, res) => {
  res.redirect('/')
})

// No ending slashes for SEO reasons
// https://github.com/epicweb-dev/epic-stack/discussions/108
app.use((req, res, next) => {
  if (req.path.endsWith('/') && req.path.length > 1) {
    const query = req.url.slice(req.path.length)
    const safepath = req.path.slice(0, -1).replace(/\/+/g, '/')
    res.redirect(301, safepath + query)
  } else {
    next()
  }
})

app.use(compression())

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by')

if (viteDevServer) {
  app.use(viteDevServer.middlewares)
} else {
  // Remix fingerprints its assets so we can cache forever.
  app.use(
    '/assets',
    express.static('build/client/assets', { immutable: true, maxAge: '1y' }),
  )

  app.use(
    '/fonts',
    express.static('public/fonts', { immutable: true, maxAge: '1y' }),
  )
  // Everything else (like favicon.ico) is cached for an hour. You may want to be
  // more aggressive with this caching.
  app.use(express.static('build/client', { maxAge: '1h' }))
}

app.get(['/img/*', '/favicons/*'], (_req, res) => {
  // if we made it past the express.static for these, then we're missing something.
  // So we'll just send a 404 and won't bother calling other middleware.
  return res.status(404).send('Not found')
})

morgan.token('url', req => decodeURIComponent(req.url ?? ''))
app.use(morgan('tiny'))

app.use((_, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString('hex')
  next()
})

// When running tests or running in development, we want to effectively disable
// rate limiting because playwright tests are very fast and we don't want to
// have to wait for the rate limit to reset between tests.
const maxMultiple =
  MODE !== 'production' || process.env.PLAYWRIGHT_TEST_BASE_URL ? 10_000 : 1
const rateLimitDefault = {
  windowMs: 60 * 1000,
  max: 1000 * maxMultiple,
  standardHeaders: true,
  legacyHeaders: false,
}

const strongestRateLimit = rateLimit({
  ...rateLimitDefault,
  windowMs: 60 * 1000,
  max: 10 * maxMultiple,
})

const strongRateLimit = rateLimit({
  ...rateLimitDefault,
  windowMs: 60 * 1000,
  max: 100 * maxMultiple,
})

const generalRateLimit = rateLimit(rateLimitDefault)
app.use((req, res, next) => {
  const strongPaths = ['/resources/newsletter']
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    if (strongPaths.some(p => req.path.includes(p))) {
      return strongestRateLimit(req, res, next)
    }
    return strongRateLimit(req, res, next)
  }

  // the verify route is a special case because it's a GET route that
  // can have a token in the query string
  if (req.path.includes('/verify')) {
    return strongestRateLimit(req, res, next)
  }

  return generalRateLimit(req, res, next)
})

async function getBuild() {
  const build = viteDevServer
    ? viteDevServer.ssrLoadModule('virtual:react-router/server-build')
    : // @ts-ignore this should exist before running the server
      // but it may not exist just yet.
      await import('../build/server/index.js')
  // not sure how to make this happy 🤷‍♂️
  return build as unknown as ServerBuild
}

if (!ALLOW_INDEXING) {
  app.use((_, res, next) => {
    res.set('X-Robots-Tag', 'noindex, nofollow')
    next()
  })
}

app.all(
  '*',
  createRequestHandler({
    getLoadContext: (_: any, res: any) => ({
      cspNonce: res.locals.cspNonce,
      serverBuild: getBuild(),
    }),
    mode: MODE,
    build: getBuild,
  }),
)

const desiredPort = Number(process.env.PORT || 3000)
const portToUse = await getPort({
  port: portNumbers(desiredPort, desiredPort + 100),
})
const portAvailable = desiredPort === portToUse
if (!portAvailable && !IS_DEV) {
  console.log(`⚠️ Port ${desiredPort} is not available.`)
  process.exit(1)
}

const server = app.listen(portToUse, () => {
  if (!portAvailable) {
    console.warn(
      chalk.yellow(
        `⚠️  Port ${desiredPort} is not available, using ${portToUse} instead.`,
      ),
    )
  }
  console.log(`🚀  We have liftoff!`)
  const localUrl = `http://localhost:${portToUse}`
  let lanUrl: string | null = null
  const localIp = ipAddress() ?? 'Unknown'
  // Check if the address is a private ip
  // https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
  // https://github.com/facebook/create-react-app/blob/d960b9e38c062584ff6cfb1a70e1512509a966e7/packages/react-dev-utils/WebpackDevServerUtils.js#LL48C9-L54C10
  if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(localIp)) {
    lanUrl = `http://${localIp}:${portToUse}`
  }

  console.log(
    `
${chalk.bold('Local:')}            ${chalk.cyan(localUrl)}
${lanUrl ? `${chalk.bold('On Your Network:')}  ${chalk.cyan(lanUrl)}` : ''}
${chalk.bold('Press Ctrl+C to stop')}
		`.trim(),
  )
})

closeWithGrace(async () => {
  await new Promise((resolve, reject) => {
    server.close(e => (e ? reject(e) : resolve('ok')))
  })
})
