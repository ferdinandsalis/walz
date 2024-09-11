import { unstable_defineAction as defineAction } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { getImage } from '@sanity/asset-utils'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { Button } from '#app/components/ui/button.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { urlFor } from '#app/sanity/instance.js'

export const action = defineAction(async ({ request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData.entries()) as { email: string }
  console.log(data)
  return { ok: true, data }
})

export default function GetToKnowRoute() {
  const imageAsset = getImage(
    'https://cdn.sanity.io/images/iaejvb99/production/98498208fde86487702b1658a636b9bb0b25c86d-7360x4912.jpg',
  )
  const url = urlFor(imageAsset).quality(70).crop('entropy').height(800).url()

  return (
    <div className="relative grid grid-cols-subgrid items-start gap-8 lg:col-span-2">
      <h1 className="font-condensed text-h1 font-bold text-muted-foreground opacity-20">
        Kennenlernen
      </h1>
      <div className="col-span-1 col-start-1 grid grid-cols-1 gap-16">
        <section id="termine" className="grid gap-y-4">
          <h1 className="text-body-xs font-bold uppercase tracking-widest text-muted-foreground">
            Nächster Termin
          </h1>
          <div className="grid-rows-auto grid grid-cols-1 overflow-hidden text-pretty rounded-lg bg-card shadow-md">
            <figure className="col-start-1 row-start-1">
              <img
                src={url}
                className="object-cover md:aspect-video lg:aspect-[21/8]"
              />
            </figure>
            <div className="relative col-start-1 row-start-1 flex flex-col items-start justify-between bg-black/5 p-8 sm:rounded-t-md">
              <h2 className="font-condensed text-h2 font-bold text-secondary drop-shadow">
                Tag der offen Tür
              </h2>
            </div>
            <div className="flex-1 p-6">
              <div className="grid gap-8">
                <div>
                  <p className="text-body-md lg:text-body-lg">
                    Ein Tag der Offenen Tür für interessierte Jugendliche,
                    Eltern und Freund:innen zum Mitmachen und Miterleben.
                  </p>
                </div>
                <div className="grid gap-2">
                  <h3 className="text-body-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Programm
                  </h3>
                  <ol className="space-y-2">
                    <li>
                      <span className="text-secondary">15:00–18:00</span>
                      <h4 className="font-condensed text-h5 text-primary">
                        Die Walz stellt sich vor.
                      </h4>
                      <p>
                        Ausstellungen, Walz-Reisebüro, Informationsstand, Junior
                        Companies, Führungen, Walz-Kino, Workshops in
                        Fremdsprachen, Theater-Impro, offenes Atelier, u.v.m.
                      </p>
                    </li>
                    <li>
                      <span className="text-secondary">18:00–19:30</span>
                      <h4 className="font-condensed text-h5 text-primary">
                        Theatheraufführung
                      </h4>
                      <p>
                        Der Jahrgang Psi 4 spielt „Das Spiel ist aus“ von
                        Jean-Paul Sartre.
                        <br /> Ève, eine Dame der Gesellschaft, und Pierre, der
                        Revolutionär, sterben im selben Augenblick. Sie begegnen
                        sich im Tod und merken, dass sie füreinander bestimmt
                        waren. Kann ihre Liebe den Tod überwinden? Sie haben 24
                        Stunden Zeit, um das herauszufinden.
                      </p>
                    </li>
                  </ol>
                  <p>
                    Das Theaterstück des Jahrgangs Psi 4 können Sie bereits am
                    Freitag, 04. Oktober um 19:00h, sehen!
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <h3 className="text-body-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Wo?
                    </h3>
                    Walz Wiener Lernzentrum
                    <br /> Heinrich-Collin-Straße 9<br /> 1140 Wien
                  </div>
                  <div className="grid content-start gap-2">
                    <h3 className="text-body-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Wann?
                    </h3>
                    <div>Samstag, 5. Oktober 2024</div>
                  </div>
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
