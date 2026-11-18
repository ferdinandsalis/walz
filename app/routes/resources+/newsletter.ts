import { captureException, captureMessage } from '@sentry/react-router'
import { data, redirect, type ActionFunctionArgs } from 'react-router'
import z from 'zod'
import * as Buttondown from '#app/utils/buttondown.ts'
import { checkHoneypot } from '#app/utils/honeypot.server.ts'

// The form posts here; scanners that request the address directly land on the
// home page instead of raising a missing-loader error.
export async function loader() {
  return redirect('/')
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  await checkHoneypot(formData)
  const parsed = z
    .object({
      email: z.string().email(),
    })
    .safeParse(Object.fromEntries(formData.entries()))
  // The form checks the address in the browser first; this catches the ones
  // the browser accepts but zod does not, such as an address without a TLD.
  if (!parsed.success) {
    return data({ ok: false, reason: 'invalid' } as const, { status: 400 })
  }

  // Headless browsers sign strangers up to flood their inboxes. They get the
  // same answer as a reader, so they have no reason to change, and the
  // report carries only headers that tell bot setups apart, never the address.
  if (isHeadlessBrowser(request)) {
    captureMessage('Newsletter sign-up from a headless browser dropped', {
      level: 'info',
      tags: {
        sec_ch_ua: request.headers.get('Sec-CH-UA') ?? 'missing',
        sec_fetch_site: request.headers.get('Sec-Fetch-Site') ?? 'missing',
        accept_language: request.headers.has('Accept-Language')
          ? 'present'
          : 'missing',
      },
    })
    return data({ ok: true } as const)
  }

  // Fly's proxy sets this header and clients cannot spoof it, unlike
  // X-Forwarded-For.
  const readerIp = request.headers.get('fly-client-ip') ?? undefined
  const result = await Buttondown.addSubscriber(
    parsed.data.email,
    'walz.at',
    readerIp,
  )
  if (!result.success) {
    // The reason holds only Buttondown's status and error code, never the
    // subscriber's address.
    captureException(
      new Error(`Newsletter subscription failed: ${result.reason}`),
    )
    return data({ ok: false, reason: 'unavailable' } as const, { status: 502 })
  }

  return data({ ok: true } as const)
}

// Bots can swap the user agent for any string, but headless Chrome still
// names itself in its client hints (Sec-CH-UA), so both are checked.
function isHeadlessBrowser(request: Request) {
  return ['User-Agent', 'Sec-CH-UA'].some(header =>
    /HeadlessChrome/.test(request.headers.get(header) ?? ''),
  )
}
