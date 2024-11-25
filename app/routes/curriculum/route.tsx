import { useLoaderData } from 'react-router'
import React from 'react'
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '#app/components/ui/carousel.tsx'
import { Divider } from '#app/components/ui/divider.tsx'
import { urlFor } from '#app/sanity/instance.ts'
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
      <h1 className="font-condensed text-h1 font-bold text-muted-foreground opacity-20">
        Curriculum
      </h1>

      <div className="col-start-1 grid grid-cols-1 gap-16 text-balance md:text-body-md">
        {data.years.map((year, index) => (
          <React.Fragment key={year._id}>
            <YearSection year={year} yearNumber={index + 1} />
            {index < data.years.length - 1 && <Divider />}
          </React.Fragment>
        ))}
        <Divider className="bg-transparent" />
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
  const photos = React.useMemo(() => {
    return year.projects.flatMap(p => {
      if (p.photos && p.photos.length > 0) {
        return p.photos.map(photo => ({ ...photo, projectName: p.name }))
      }
      return []
    })
  }, [year.projects])

  return (
    <article className="space-y-8 pt-4">
      <hgroup>
        <h1 className="text-h4 font-bold text-muted-foreground">
          {yearNumber}. Jahr
        </h1>
        <p className="font-condensed text-h2 font-bold text-primary">
          {year.title}
        </p>
      </hgroup>
      <div className="mb-8 max-w-prose space-y-4">
        <p>{year.description}</p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ProjectsList projects={year.projects} />
        <ExternalExamsList exams={year.externalExams} />
      </div>
      <div>{year.projects.length > 0 && <YearCarousel photos={photos} />}</div>
    </article>
  )
}

function ProjectsList({
  projects,
}: {
  projects: { _id: string; name: string }[]
}) {
  return (
    <div className="space-y-2">
      <h2 className="font-condensed text-h4 font-bold text-secondary">
        Projekte
      </h2>
      <ul className="list-inside list-disc" aria-label="Projekte">
        {projects?.map(project => <li key={project.name}>{project.name}</li>)}
      </ul>
    </div>
  )
}

function ExternalExamsList({ exams }: { exams: string[] }) {
  return (
    <div className="space-y-2">
      <h2 className="font-condensed text-h4 font-bold text-secondary">
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

function YearCarousel({ photos }: { photos: any[] }) {
  return (
    <Carousel
      opts={{
        loop: true,
        align: 'start',
        duration: 20,
      }}
    >
      <div className="rounded bg-muted/30 px-4 py-4 md:-mx-4">
        <CarouselContent className="-ml-2">
          {photos?.map(photo =>
            photo?.asset ? (
              <CarouselItem
                key={photo._id}
                className="pl-2 sm:basis-1/2 md:basis-1/3"
              >
                <div className="group relative overflow-hidden rounded">
                  <img
                    src={urlFor(photo)
                      .height(512)
                      .width(512)
                      .format('webp')
                      .url()}
                    className="rounded object-cover shadow"
                  />
                  <div className="absolute bottom-0 left-0 right-0 flex appearance-none items-center justify-start gap-1 bg-black/10 p-1.5 px-3 font-condensed">
                    <span className="text-xs text-card drop-shadow">
                      {photo.projectName}
                      {photo.caption ? `, ${photo.caption}` : ''}
                    </span>
                  </div>
                </div>
              </CarouselItem>
            ) : null,
          )}
        </CarouselContent>
      </div>
      <div className="mt-4 flex justify-center gap-2 px-8">
        <CarouselPrevious variant="ghost" />
        <CarouselNext variant="ghost" />
      </div>
    </Carousel>
  )
}
