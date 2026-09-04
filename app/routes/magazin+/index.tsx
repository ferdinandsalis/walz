import { DownloadSimple } from '@phosphor-icons/react'
import { PdfViewer } from '#app/components/pdf-viewer.tsx'

export default function Magazin() {
  return (
    <div className="relative grid items-start gap-8 text-balance lg:col-span-2">
      <h1 className="font-condensed text-h1 text-muted-foreground font-bold opacity-20">
        Magazin
      </h1>
      <div className="grid gap-16">
        <section className="space-y-4">
          <h2 className="font-condensed text-h2 text-primary font-bold">
            Aktuell
          </h2>
          <article
            id="magazin_25-26"
            className="bg-card/50 flex flex-col items-center overflow-hidden rounded md:flex-row"
          >
            <div className="flex-1 p-6">
              <h2 className="font-condensed text-h3">25/26</h2>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                <PdfViewer
                  src="/downloads/magazin_25-26.pdf"
                  title="Walz Magazin 25/26"
                  downloadName="Magazin Walz Zeit 25/26.pdf"
                />
                <a
                  download="Magazin Walz Zeit 25/26.pdf"
                  href="/downloads/magazin_25-26.pdf"
                  className="inline-flex items-center gap-1 underline underline-offset-2"
                >
                  Magazin herunterladen
                  <DownloadSimple size={18} className="text-primary" />
                </a>
              </div>
            </div>
            <div>
              <img
                src="/downloads/magazin_cover_25-26.jpg"
                alt="Magazin Cover 25/26"
                className="mb-4 h-auto w-24"
              />
            </div>
          </article>
        </section>
        <section className="">
          <h2 className="font-condensed text-h2 text-primary font-bold">
            Archiv
          </h2>
          <article id="magazin_24-25" className="bg-card/50 rounded p-6">
            <h2 className="font-condensed text-h3">24/25</h2>
            <a
              download="Magazin Walz Zeit 24/25.pdf"
              href="/downloads/magazin_24-25.pdf"
              className="inline-flex items-center gap-1 underline underline-offset-2"
            >
              Magazin herunterladen
              <DownloadSimple size={18} className="text-primary" />
            </a>
          </article>
          <article id="boty_23-24" className="bg-card/50 rounded p-6">
            <h2 className="font-condensed text-h3">23/24</h2>
            <a
              download="Book of the year 23/24.pdf"
              href="/downloads/boty_23-24.pdf"
              className="inline-flex items-center gap-1 underline underline-offset-2"
            >
              Jahrbuch herunterladen
              <DownloadSimple size={18} className="text-primary" />
            </a>{' '}
          </article>
          <article id="boty_22-23" className="bg-card/50 rounded p-6">
            <h2 className="font-condensed text-h3">22/23</h2>
            <a
              download="Book of the year 22/23.pdf"
              href="/downloads/boty_22-23.pdf"
              className="inline-flex items-center gap-1 underline underline-offset-2"
            >
              Jahrbuch herunterladen
              <DownloadSimple size={18} className="text-primary" />
            </a>{' '}
          </article>
        </section>
      </div>
    </div>
  )
}
