import { useFetcher } from 'react-router'
import { LoaderIcon } from 'lucide-react'
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
      className="grid max-w-xl rounded-md bg-card p-6 shadow-md xl:p-8"
      key={JSON.stringify(fetcher.data)}
    >
      <HoneypotInputs />
      <p className="mb-4 max-w-[28ch] text-balance text-lg md:text-body-md">
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
          className="rounded-lg bg-white p-6 shadow-md md:text-body-md"
        />
      </div>
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          size="lg"
          className="rounded-lg bg-primary p-6 shadow-md md:text-body-md"
          disabled={fetcher.state === 'submitting'}
        >
          Abonnieren
        </Button>
        {showSpinner && (
          <LoaderIcon className="animate-spin stroke-secondary" />
        )}
        {done && <p className="text-green-500">Aktion Erfolgreich</p>}
      </div>
    </fetcher.Form>
  )
}
