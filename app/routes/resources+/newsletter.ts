import { type ActionFunctionArgs } from 'react-router'
import z from 'zod'
import * as Buttondown from '#app/utils/buttondown.ts'
import { checkHoneypot } from '#app/utils/honeypot.server.ts'

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  checkHoneypot(formData)
  const data = z
    .object({
      email: z.string().email(),
    })
    .parse(Object.fromEntries(formData.entries()))

  await Buttondown.addSubscriber(data.email, 'walz.at')

  return { ok: true, data }
}
