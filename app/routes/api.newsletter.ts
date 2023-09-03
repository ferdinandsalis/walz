import * as Newsletter from '#app/utils/newsletter.ts';
import { ActionArgs, json } from "@remix-run/node";
import z from 'zod';

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const data = z.object({
    email: z.string().nonempty()
  }).parse(Object.fromEntries(formData.entries()))

  const result = Newsletter.addEmail(data.email)

  return json({})
}