import * as Newsletter from '#app/utils/newsletter.ts'
import { type ActionFunctionArgs, json } from '@remix-run/node'
import z from 'zod'

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const data = z
    .object({
      email: z.string().email(),
    })
    .parse(Object.fromEntries(formData.entries()))

  Newsletter.addEmail(data.email)

  return json({})
}
