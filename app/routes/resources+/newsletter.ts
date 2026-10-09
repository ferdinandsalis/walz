import { captureException } from '@sentry/react-router'
import { data, type ActionFunctionArgs } from 'react-router'
import z from 'zod'
import * as Buttondown from '#app/utils/buttondown.ts'
import { checkHoneypot } from '#app/utils/honeypot.server.ts'

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

  const result = await Buttondown.addSubscriber(parsed.data.email, 'walz.at')
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
