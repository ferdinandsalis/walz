import { Outlet, useMatches } from 'react-router'
import { SectionHeading } from '#app/components/section-heading.tsx'
import { LinkPhotoCard } from '#app/routes/_index/route.tsx'
import { handle as educationHandle } from './bildung.tsx'
import { handle as personalityHandle } from './persoenlichkeit.tsx'
import { handle as practiceHandle } from './praxis.tsx'

export const pillars = [educationHandle, personalityHandle, practiceHandle]

export function meta() {
  return [{ title: 'Philosophie | Walz' }]
}

export default function Philosophie() {
  const matches = useMatches()
  const current = matches?.at(-1)?.handle

  return (
    <div className="md:mt-12 lg:col-span-2">
      <h1 className="absolute left-0 origin-top-left rotate-90 scale-[4] font-condensed text-xl font-bold text-stone-500 opacity-10">
        Über uns
      </h1>

      <div className="space-y-12">
        <div>
          <h1 className="mb-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Philosophie
          </h1>
          <Outlet />
        </div>

        <SectionHeading id="Philosophie">Philosophie</SectionHeading>

        <section id="philosophie">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {pillars
              .filter(pillar => pillar !== current)
              .map(pillar => (
                <LinkPhotoCard
                  key={pillar.title}
                  title={pillar.title}
                  abstract={pillar.abstract}
                  image={pillar.image}
                  link={pillar.link}
                />
              ))}
          </div>
        </section>
      </div>
    </div>
  )
}
