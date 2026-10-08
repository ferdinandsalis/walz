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

  const { success } = await Buttondown.addSubscriber(email, 'walz.at')
  if (!success) {
    // A constant message keeps the subscriber's address out of Sentry.
    captureException(new Error('Newsletter subscription failed'))
    return data({ ok: false }, { status: 502 })
  }

  return data({ ok: true })
}
