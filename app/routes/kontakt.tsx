import { Link as LinkIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'

export function meta() {
  return [{ title: 'Kontakt | Walz' }]
}

export default function Kontakt() {
  return (
    <div className="relative grid grid-cols-subgrid items-start gap-8 lg:col-span-2">
      <h1 className="font-condensed text-h1 font-bold text-muted-foreground opacity-20">
        Kontakt
      </h1>

      <div className="col-start-1 grid grid-cols-12 gap-x-4 gap-y-8 sm:gap-x-6 lg:gap-x-8">
        <Link
          to="https://goo.gl/maps/sb3LQfsePwU3zMPg8"
          className="relative col-span-12 h-72 overflow-hidden rounded bg-muted/10 md:col-span-8 lg:h-96"
        >
          <img
            src={`https://maps.googleapis.com/maps/api/staticmap?center=48.1984402,16.2922301&zoom=16&size=800x500&key=${ENV.GOOGLE_MAPS_API_KEY}&scale=2&map_id=8811b5d90ece1ea5`}
            alt="Karte"
            className="h-full w-full object-cover"
          />
          <div className="absolute left-0 top-0 h-full w-full overflow-hidden border shadow-inner shadow-muted/80"></div>
        </Link>
        <div className="col-span-12 md:col-span-4">
          <h2 className="mb-4 text-body-xs font-bold uppercase tracking-widest text-muted-foreground">
            Kontakt
          </h2>
          <div className="lg:text-body-md">
            <p>
              <strong className="text-primary">Walz Wiener Lernzentrum</strong>
            </p>
            <p>Heinrich-Collin-Straße 9</p>
            <p>1140 Wien</p>
            <p>
              Tel.:{' '}
              <a
                href="tel:018042939"
                className="hover:text-primary hover:underline"
              >
                01 8042939
              </a>
            </p>
            <p>Fax: 01 8042939-2000</p>
            <p>
              Email:{' '}
              <a
                href="mailto:office@walz.at"
                className="hover:text-primary hover:underline"
              >
                office@walz.at
              </a>
            </p>
          </div>
          <div className="mt-4">
            <p className="text-balance">
              <Link
                to="/rundgang"
                className="text-muted-foreground underline-offset-2 hover:underline"
              >
                Klicke hier um die Walz bei einem virtuellen Rundgang
                kennenzulernen.{' '}
                <LinkIcon
                  className="relative top-[1px] inline align-baseline text-primary"
                  size={16}
                />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
