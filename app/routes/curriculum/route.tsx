import React from 'react'
import { useLoaderData } from 'react-router'
import { PhotoStrip, type StripPhoto } from '#app/components/photo-strip.tsx'
import { Divider } from '#app/components/ui/divider.tsx'
import { loadQuery } from '#app/sanity/loader.server.ts'
import { curriculumQuery, type CurriculumQueryResult } from './query.ts'

export function meta() {
  return [{ title: 'Curriculum | Walz' }]
}

export async function loader() {
  const queryResult = await loadQuery<CurriculumQueryResult>(curriculumQuery)
  return { data: queryResult.data }
}

export default function Curriculum() {
  const { data } = useLoaderData<typeof loader>()

  return (
    <div className="relative grid grid-cols-subgrid items-start gap-8 text-balance lg:col-span-2">
      <h1 className="font-condensed text-h1 text-muted-foreground font-bold opacity-20">
        Curriculum
      </h1>

      <div className="md:text-body-md col-start-1 grid grid-cols-12 gap-x-4 gap-y-16 text-balance sm:gap-x-6 lg:gap-x-8">
        {data.years.map((year, index) => (
          <React.Fragment key={year._id}>
            <YearSection year={year} yearNumber={index + 1} />
            {index < data.years.length - 1 && (
              <Divider className="col-span-12" />
            )}
          </React.Fragment>
        ))}
        <Divider className="col-span-12 bg-transparent" />
      </div>
    </div>
  )
}

function YearSection({
  year,
  yearNumber,
}: {
  year: {
    title: string
    description: string
    projects: { _id: string; name: string; photos: any[] }[]
    externalExams: string[]
  }
  yearNumber: number
}) {
  const photos = React.useMemo<StripPhoto[]>(() => {
    return year.projects.flatMap(p =>
      (p.photos ?? []).map((photo, index) => ({
        key: photo?._key ?? `${p._id}-${index}`,
        image: photo ?? {},
        caption: `${p.name}${photo?.caption ? `, ${photo.caption}` : ''}`,
      })),
    )
  }, [year.projects])

  return (
    <article className="col-span-12 grid grid-cols-subgrid gap-y-8 pt-4">
      <hgroup className="col-span-12">
        <h1 className="text-h4 text-muted-foreground font-bold">
          {yearNumber}. Jahr
        </h1>
        <p className="font-condensed text-h2 text-primary font-bold">
          {year.title}
        </p>
      </hgroup>
      <div className="col-span-12 mb-8 max-w-prose space-y-4">
        <p>{year.description}</p>
      </div>
      <div className="col-span-12 grid grid-cols-subgrid gap-y-8">
        <ProjectsList projects={year.projects} />
        <ExternalExamsList exams={year.externalExams} />
      </div>
      <div className="col-span-12">
        {year.projects.length > 0 && <PhotoStrip photos={photos} />}
      </div>
    </article>
  )
}

function ProjectsList({
  projects,
}: {
  projects: { _id: string; name: string }[]
}) {
  return (
    <div className="col-span-12 space-y-2 md:col-span-6">
      <h2 className="font-condensed text-h4 text-secondary font-bold">
        Projekte
      </h2>
      <ul className="list-inside list-disc" aria-label="Projekte">
        {projects?.map(project => (
          <li key={project.name}>{project.name}</li>
        ))}
      </ul>
    </div>
  )
}

function ExternalExamsList({ exams }: { exams: string[] }) {
  return (
    <div className="col-span-12 space-y-2 md:col-span-6">
      <h2 className="font-condensed text-h4 text-secondary font-bold">
        Externe Prüfungen
      </h2>
      <ul className="list-inside list-disc">
        {exams?.length > 0 ? (
          exams.map(exam => <li key={exam}>{exam}</li>)
        ) : (
          <li>keine</li>
        )}
      </ul>
    </div>
  )
}
