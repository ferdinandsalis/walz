import { captureException } from '@sentry/react-router'
import { data, type ActionFunctionArgs } from 'react-router'
import z from 'zod'
import * as Buttondown from '#app/utils/buttondown.ts'
import { checkHoneypot } from '#app/utils/honeypot.server.ts'

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  await checkHoneypot(formData)
  const { email } = z
    .object({
      email: z.string().email(),
    })
    .parse(Object.fromEntries(formData.entries()))

  const result = await Buttondown.addSubscriber(email, 'walz.at')
  if (!result.success) {
    // The reason holds only Buttondown's status and error code, never the
    // subscriber's address.
    captureException(
      new Error(`Newsletter subscription failed: ${result.reason}`),
    )
    return data({ ok: false }, { status: 502 })
  }

  return data({ ok: true })
}
