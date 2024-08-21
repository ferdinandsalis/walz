import { unstable_defineAction as defineAction } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { useSpinDelay } from 'spin-delay'
import { Button } from '#app/components/ui/button.tsx'
import { Input } from '#app/components/ui/input.tsx'

export const action = defineAction(async ({ request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData.entries()) as { email: string }
  console.log(data)
  return { ok: true, data }
})

export default function GetToKnowRoute() {
  // a form with an email input field and a submit button
  // as reminder to attend the next event where the person can
  // drop by the school and get to know the school
  const fetcher = useFetcher<typeof action>()
  const showSpinner = useSpinDelay(fetcher.state !== 'idle')
  const done = !!fetcher.data

  return (
    <div className="grid gap-12 md:mt-12">
      <header>
        <h1 className="absolute left-0 origin-top-left rotate-90 scale-[4] font-condensed text-xl font-bold text-muted-foreground opacity-10">
          Kennenlernen
        </h1>
      </header>
      <div className="space-y-8">
        <h1 className="font-condensed text-2xl font-bold text-primary md:text-4xl">
          Lass dich erinnern
        </h1>
        <p className="max-w-prose">
          Hinterlasse und deine E-Mail und wir informieren dich über das nächste
          Event, wo du die Schule kennenlernen kannst.
        </p>
        <fetcher.Form
          name="newsletter"
          method="POST"
          action="/resources/newsletter"
          className="grid max-w-xl gap-4 rounded-md"
          key={JSON.stringify(fetcher.data)}
        >
          <HoneypotInputs />
          <Input type="email" placeholder="E-mail" className="bg-card" />
          <footer>
            <Button variant="secondary" type="submit">
              {done ? 'Erfolgreich' : 'Erinnere mich'}
            </Button>
          </footer>
        </fetcher.Form>
      </div>
    </div>
  )
}
