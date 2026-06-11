import { CircleNotch } from '@phosphor-icons/react'
import { useFetcher } from 'react-router'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { useSpinDelay } from 'spin-delay'
import { type action } from '#app/routes/resources+/newsletter.ts'
import { Button } from './ui/button.tsx'
import { Input } from './ui/input.tsx'

export function NewsletterForm() {
  const fetcher = useFetcher<typeof action>()
  const showSpinner = useSpinDelay(fetcher.state !== 'idle')
  const done = !!fetcher.data

  return (
    <fetcher.Form
      name="newsletter"
      method="POST"
      action="/resources/newsletter"
      className="bg-card grid max-w-xl rounded-md p-6 shadow-md xl:p-8"
      key={JSON.stringify(fetcher.data)}
    >
      <HoneypotInputs />
      <p className="md:text-body-md mb-4 max-w-[28ch] text-lg text-balance">
        <span className="font-bold">
          Möchtest du auf dem Laufenden bleiben?
        </span>{' '}
        Dann melde dich für unseren{' '}
        <strong className="text-secondary">Newsletter</strong> an!
      </p>
      <div className="mb-4">
        <label className="sr-only">E-Mail</label>
        <Input
          name="email"
          type="email"
          placeholder="Deine E-Mail"
          disabled={done}
          defaultValue={done ? '' : undefined}
          className="md:text-body-md rounded-lg bg-white p-6 shadow-md"
        />
      </div>
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          size="lg"
          className="bg-primary md:text-body-md rounded-lg p-6 shadow-md"
          disabled={fetcher.state === 'submitting'}
        >
          Abonnieren
        </Button>
        {showSpinner && <CircleNotch className="text-secondary animate-spin" />}
        {done && <p className="text-green-500">Aktion Erfolgreich</p>}
      </div>
    </fetcher.Form>
  )
}
