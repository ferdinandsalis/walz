import * as Newsletter from '#app/utils/newsletter.ts'
import { checkHoneypot } from '#app/utils/honeypot.server.ts'
import { type ActionFunctionArgs, json } from '@remix-run/node'
import z from 'zod'

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  checkHoneypot(formData)
  const data = z
    .object({
      email: z.string().email(),
    })
    .parse(Object.fromEntries(formData.entries()))

  await Newsletter.addSubscriber(data.email, 'walz.at')

  return json({})
}
