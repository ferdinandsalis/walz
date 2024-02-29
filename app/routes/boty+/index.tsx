import { DownloadIcon } from 'lucide-react'

export default function Boty() {
  return (
    <div className="hyphens-auto text-balance md:mt-12">
      <h1 className="absolute left-0 origin-top-left rotate-90 scale-[4] font-condensed text-xl font-bold text-stone-500 opacity-10">
        Book of the year
      </h1>
      <article>
        <h2 className="font-condensed text-h3">22/23</h2>
        <a
          download="Anmeldeformular.pdf"
          href="/downloads/boty_22-23.pdf"
          className="inline-flex items-center gap-1 underline underline-offset-2"
        >
          Jahrbuch herunterladen
          <DownloadIcon size={18} className="stroke-primary" />
        </a>{' '}
      </article>
    </div>
  )
}
