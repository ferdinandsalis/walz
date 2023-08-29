import { ArrowRight } from '@carbon/icons-react'
import { Link, Outlet } from '@remix-run/react'

export default function UeberUns() {
  return (
    <div className="md:mt-12">
      <h1 className="absolute left-0 origin-top-left rotate-90 scale-[4] font-condensed text-xl font-bold text-stone-500 opacity-10">
        Über uns
      </h1>

      <div className="space-y-12">
        <div>
          <h1 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Philosophie
          </h1>
          <Outlet />
        </div>

        <hr className="h-[4px] border-none bg-stone-200/70" />

        <section id="philosophie">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/ueber-uns/philosophie/bildung"
              className="group rounded-lg bg-white p-6 shadow-md focus:outline-primary"
            >
              <div className="relative mb-6 border-8 border-secondary">
                <img
                  src="/images/bildung_anders.jpg"
                  className="ascpet-square h-48 w-full bg-stone-100 object-cover grayscale backdrop-sepia transition-all group-hover:grayscale-0"
                />
              </div>
              <h1 className="font-condensed text-2xl font-bold text-primary md:text-3xl lg:text-4xl xl:text-5xl">
                Bildung
              </h1>
              <h2 className="font-condensed text-2xl font-bold text-stone-700">
                Zusammenhänge erkennen
              </h2>
              <span className="group/more mt-4 inline-flex items-center gap-1 font-condensed text-lg text-secondary md:text-xl lg:text-2xl">
                <span className="underline-offset-4 group-hover/more:underline">
                  Mehr erfahren
                </span>
                <ArrowRight size={24} className="fill-secondary" />
              </span>
            </Link>

            <Link
              to="/ueber-uns/philosophie/praxis"
              className="group rounded-lg bg-white p-6 shadow-md focus:outline-primary"
            >
              <div className="relative mb-6 border-8 border-secondary">
                <img
                  src="/images/praxis_uhrenwerkstatt.jpg"
                  className="ascpet-square h-48 w-full bg-stone-100 object-cover grayscale backdrop-sepia transition-all group-hover:grayscale-0"
                />
              </div>
              <h1 className="font-condensed text-2xl font-bold text-primary md:text-3xl lg:text-4xl xl:text-5xl">
                Praxis
              </h1>
              <h2 className="font-condensed text-2xl font-bold text-stone-700">
                Erfahrungen sammeln
              </h2>
              <span className="group/more mt-4 inline-flex items-center gap-1 font-condensed text-lg text-secondary md:text-xl lg:text-2xl">
                <span className="underline-offset-4 group-hover/more:underline">
                  Mehr erfahren
                </span>
                <ArrowRight size={24} className="fill-secondary" />
              </span>
            </Link>

            <Link
              to="/ueber-uns/philosophie/persoenlichkeit"
              className="group rounded-lg bg-white p-6 shadow-md focus:outline-primary"
            >
              <div className="relative mb-6 border-8 border-secondary">
                <img
                  src="/images/persoenlichkeit_theater.jpg"
                  className="ascpet-square h-48 w-full bg-stone-100 object-cover grayscale backdrop-sepia transition-all group-hover:grayscale-0"
                />
              </div>
              <h1 className="font-condensed text-2xl font-bold text-primary md:text-3xl lg:text-4xl xl:text-5xl">
                Persönlichkeit
              </h1>
              <h2 className="font-condensed text-2xl font-bold text-stone-700">
                Potenziale entfalten
              </h2>
              <span className="group/more mt-4 inline-flex items-center gap-1 font-condensed text-lg text-secondary md:text-xl lg:text-2xl">
                <span className="underline-offset-4 group-hover/more:underline">
                  Mehr erfahren
                </span>
                <ArrowRight size={24} className="fill-secondary" />
              </span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
