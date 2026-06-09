import { BookOpen, X } from '@phosphor-icons/react'
import { useState } from 'react'

/**
 * Inline PDF reader. Renders an "Online lesen" toggle that reveals the
 * browser's native PDF viewer in an embedded frame (loaded only on demand,
 * since magazine PDFs are large). Falls back to a download link.
 */
export function PdfViewer({
  src,
  title,
  downloadName,
}: {
  src: string
  title: string
  downloadName?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        className="inline-flex items-center gap-1 underline underline-offset-2"
        aria-expanded={open}
      >
        {open ? 'Schließen' : 'Online lesen'}
        {open ? (
          <X size={18} className="text-primary" />
        ) : (
          <BookOpen size={18} className="text-primary" />
        )}
      </button>

      {open && (
        <object
          data={`${src}#view=FitH`}
          type="application/pdf"
          aria-label={title}
          className="mt-4 h-[80vh] w-full rounded border border-muted"
        >
          <p className="p-4 text-body-sm text-muted-foreground">
            Dein Browser kann das PDF nicht direkt anzeigen.{' '}
            <a
              href={src}
              download={downloadName}
              className="text-primary underline underline-offset-2"
            >
              Bitte herunterladen.
            </a>
          </p>
        </object>
      )}
    </div>
  )
}
