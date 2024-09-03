import { unstable_defineAction as defineAction } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
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

  return (
    <div className="relative grid grid-cols-subgrid items-start gap-8 lg:col-span-2">
      <h1 className="font-condensed text-h1 font-bold text-muted-foreground opacity-20">
        Kennenlernen
      </h1>
      <div className="col-start-1 grid grid-cols-1 gap-16">
        <section id="termine" className="grid gap-y-4">
          <h1 className="text-body-xs font-bold uppercase tracking-widest text-muted-foreground">
            Nächste Termin
          </h1>
          <div className="rounded-lg bg-card p-6">
            <h2 className="mb-4 font-condensed text-h3 font-bold text-secondary">
              Tag der offen Tür
            </h2>
            <div className="grid gap-4">
              <div>
                <p className="md:text-body-md">
                  Ein Tag der Offenen Tür für interessierte Jugendliche, Eltern
                  und Freund:innen zum Mitmachen und Miterleben.
                </p>
              </div>
              <div className="grid gap-2">
                <h3 className="font-bold">Programm</h3>
                <ol className="space-y-2">
                  <li>
                    <h4 className="text-primary">15:00–18:00</h4>
                    <p>
                      Die Walz stellt sich vor Ausstellungen, Walz-Reisebüro,
                      Informationsstand, Juniorcompanies, Führungen, Walz-Kino,
                      Workshops in Fremdsprachen, Theater-Impro, offenes
                      Atelier, u.v.m.
                    </p>
                  </li>
                  <li>
                    <h4 className="text-primary">19:00–20:30</h4>
                    <p>
                      Der Jahrgang Psi 4 spielt „Das Spiel ist aus“ von
                      Jean-Paul Sartre Ève, eine Dame der Gesellschaft, und
                      Pierre, der Revolutionär, sterben im selben Augenblick.
                      Sie begegnen sich im Tod und merken, dass sie füreinander
                      bestimmt waren. Kann ihre Liebe den Tod überwinden? Sie
                      haben 24 Stunden Zeit, um das herauszufinden.
                    </p>
                  </li>
                </ol>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <h3 className="font-bold">Wo?</h3>
                  Walz Wiener Lernzentrum
                  <br /> Heinrich-Collin-Straße 9<br /> 1140 Wien
                </div>
                <div className="grid gap-2">
                  <h3 className="font-bold">Wann?</h3>
                  <div>Samstag, 5. Oktober 2024</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export function ReminderForm() {
  const fetcher = useFetcher<typeof action>()
  //const showSpinner = useSpinDelay(fetcher.state !== 'idle')
  const done = !!fetcher.data

  return (
    <>
      <h1 className="font-condensed text-2xl font-bold text-primary md:text-4xl">
        Erinnerungsservice
      </h1>
      <p className="max-w-prose">
        Hinterlasse und deine E-Mail und wir informieren dich über die nächste
        Veranstaltung, wo du die Schule kennenlernen kannst.
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
    </>
  )
}
