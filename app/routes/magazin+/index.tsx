import { DownloadIcon } from 'lucide-react'

export default function Magazin() {
  return (
    <div className="relative grid items-start gap-8 text-balance lg:col-span-2">
      <h1 className="font-condensed text-h1 font-bold text-muted-foreground opacity-20">
        Magazin
      </h1>
      <div className="grid gap-16">
        <section>
          <h2 className="font-condensed text-h2 font-bold text-primary">
            Aktuell
          </h2>
          <article
            id="magazin_24-25"
            className="flex flex-col items-center overflow-hidden rounded bg-card/50 md:flex-row"
          >
            <div className="flex-1 p-6">
              <h2 className="font-condensed text-h3">24/25</h2>
              <a
                download="Magazin Walz Zeit 24/25.pdf"
                href="/downloads/magazin_24-25.pdf"
                className="inline-flex items-center gap-1 underline underline-offset-2"
              >
                Magazin herunterladen
                <DownloadIcon size={18} className="stroke-primary" />
              </a>
            </div>
            <div>
              <img
                src="/downloads/magazin_cover_24-25.jpg"
                alt="Magazin Cover 24/25"
                className="mb-4 h-auto w-24"
              />
            </div>
          </article>
        </section>
        <section className="">
          <h2 className="font-condensed text-h2 font-bold text-primary">
            Archiv
          </h2>
          <article id="boty_23-24" className="rounded bg-card/50 p-6">
            <h2 className="font-condensed text-h3">23/24</h2>
            <a
              download="Book of the year 23/24.pdf"
              href="/downloads/boty_23-24.pdf"
              className="inline-flex items-center gap-1 underline underline-offset-2"
            >
              Jahrbuch herunterladen
              <DownloadIcon size={18} className="stroke-primary" />
            </a>{' '}
          </article>
          <article id="boty_22-23" className="rounded bg-card/50 p-6">
            <h2 className="font-condensed text-h3">22/23</h2>
            <a
              download="Book of the year 22/23.pdf"
              href="/downloads/boty_22-23.pdf"
              className="inline-flex items-center gap-1 underline underline-offset-2"
            >
              Jahrbuch herunterladen
              <DownloadIcon size={18} className="stroke-primary" />
            </a>{' '}
          </article>
        </section>
      </div>
    </div>
  )
}
