import { unstable_defineAction as defineAction } from '@remix-run/node'
import z from 'zod'
import { checkHoneypot } from '#app/utils/honeypot.server.ts'
import * as Newsletter from '#app/utils/newsletter.ts'

export const action = defineAction(async ({ request }) => {
  const formData = await request.formData()
  checkHoneypot(formData)
  const data = z
    .object({
      email: z.string().email(),
    })
    .parse(Object.fromEntries(formData.entries()))

  await Newsletter.addSubscriber(data.email, 'walz.at')

  return { ok: true, data }
})
