import { useLoaderData } from '@remix-run/react'
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
        <article className="space-y-8 pt-4">
          <hgroup>
            <h1 className="text-h4 font-bold text-muted-foreground">1. Jahr</h1>
            <p className="font-condensed text-h2 font-bold text-primary">
              {data?.years[0].title}
            </p>
          </hgroup>
          <div className="mb-8 max-w-prose space-y-4">
            <p>{data?.years[0].description}</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <h2 className="font-condensed text-h4 font-bold text-secondary">
                Projekte
              </h2>
              <ul className="list-inside list-disc" aria-label="Projekte">
                <li>Landschaftspflege</li>
                <li>Landwirtschaft</li>
                <li>Handwerk</li>
                <li>Schattentheater</li>
                <li>Zeichnen</li>
                <li>Tanz und Akrobatik</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h2 className="font-condensed text-h4 font-bold text-secondary">
                Externe Prüfungen
              </h2>
              <ul className="list-inside list-disc">
                {data?.years[0]?.externalExams?.length > 0 ? (
                  data?.years[0].externalExams.map(exam => (
                    <li key={exam}>{exam}</li>
                  ))
                ) : (
                  <li>keine</li>
                )}
              </ul>
            </div>
          </div>
          <div>
            <YearCarousel
              photos={data?.years[0].projects.flatMap(p => p.photos)}
            />
          </div>
        </article>

        <Divider />

        <article className="space-y-8 pt-4">
          <hgroup>
            <h1 className="text-h4 font-bold text-muted-foreground">2. Jahr</h1>
            <p className="font-condensed text-h2 font-bold text-primary">
              {data?.years[1].title}
            </p>
          </hgroup>
          <div className="mb-8 max-w-prose space-y-4">
            <p>{data?.years[1].description}</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <h2 className="font-condensed text-h4 font-bold text-secondary">
                Projekte
              </h2>
              <ul className="list-inside list-disc" aria-label="Projekte">
                <li>Kamp</li>
                <li>Holzschlag</li>
                <li>Irland</li>
                <li>Theaterwerkstatt</li>
                <li>Kühtai</li>
                <li>Steinhauen</li>
                <li>Sprachpraktikum 2. Fremdsprache</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h2 className="font-condensed text-h4 font-bold text-secondary">
                Externe Prüfungen
              </h2>
              <ul className="list-inside list-disc">
                {data?.years[1]?.externalExams?.length > 0 ? (
                  data?.years[1].externalExams.map(exam => (
                    <li key={exam}>{exam}</li>
                  ))
                ) : (
                  <li>keine</li>
                )}
              </ul>
            </div>
          </div>
          <div>
            <YearCarousel
              photos={data?.years[1].projects.flatMap(p => p.photos)}
            />
          </div>
        </article>

        <Divider />

        <article className="space-y-8 pt-4">
          <hgroup>
            <h1 className="text-h4 font-bold text-muted-foreground">3. Jahr</h1>
            <p className="font-condensed text-h2 font-bold text-primary">
              {data?.years[2].title}
            </p>
          </hgroup>
          <div className="mb-8 max-w-prose space-y-4">
            <p>{data?.years[2].description}</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <h2 className="font-condensed text-h4 font-bold text-secondary">
                Projekte
              </h2>
              <ul className="list-inside list-disc" aria-label="Projekte">
                <li>Palfau</li>
                <li>Theaterwerkstatt</li>
                <li>Shakespeare</li>
                <li>Sprachpraktikum 2. Fremdsprache</li>
                <li>Medienarbeit</li>
                <li>Junior Company</li>
                <li>Potenzialanalyse</li>
                <li>Mann/Frau Projekt</li>
                <li>Sozialpraktikum</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h2 className="font-condensed text-h4 font-bold text-secondary">
                Externe Prüfungen
              </h2>
              <ul className="list-inside list-disc">
                {data?.years[2]?.externalExams?.length > 0 ? (
                  data?.years[2].externalExams.map(exam => (
                    <li key={exam}>{exam}</li>
                  ))
                ) : (
                  <li>keine</li>
                )}
              </ul>
            </div>
          </div>
          <div>
            <YearCarousel
              photos={data?.years[2].projects.flatMap(p => p.photos)}
            />
          </div>
        </article>

        <Divider />

        <article className="space-y-8 pt-4">
          <hgroup>
            <h1 className="text-h5 font-bold text-muted-foreground">4. Jahr</h1>
            <p className="font-condensed text-h2 font-bold text-primary">
              {data?.years[3].title}
            </p>
          </hgroup>
          <div className="mb-8 max-w-prose space-y-4">
            <p>{data?.years[3].description}</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <h2 className="font-condensed text-h4 font-bold text-secondary">
                Projekte
              </h2>
              <ul className="list-inside list-disc" aria-label="Projekte">
                <li>Autonomie</li>
                <li>Theater</li>
                <li>Sozialpraktikum</li>
                <li>Kunst Toskana</li>
                <li>Sprachpraktikum 2.Fremdsprache</li>
                <li>Junior Company</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h2 className="font-condensed text-h4 font-bold text-secondary">
                Externe Prüfungen
              </h2>
              <ul className="list-inside list-disc">
                {data?.years[3]?.externalExams?.length > 0 ? (
                  data?.years[3].externalExams.map(exam => (
                    <li key={exam}>{exam}</li>
                  ))
                ) : (
                  <li>keine</li>
                )}
              </ul>
            </div>
          </div>
          <div>
            <YearCarousel
              photos={data?.years[3].projects.flatMap(p => p.photos)}
            />
          </div>
        </article>

        <Divider />

        <article className="space-y-8 pt-4">
          <hgroup>
            <h1 className="text-h5 font-bold text-muted-foreground">5. Jahr</h1>
            <p className="font-condensed text-h2 font-bold text-primary">
              {data?.years[4].title}
            </p>
          </hgroup>
          <div className="mb-8 max-w-prose space-y-4">
            <p>{data?.years[4].description}</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <h2 className="font-condensed text-h4 font-bold text-secondary">
                Projekte
              </h2>
              <ul className="list-inside list-disc" aria-label="Projekte">
                <li>Kunst in Paris</li>
                <li>Literaturwoche</li>
                <li>Sprachpraktikum Englisch</li>
                <li>Abschlussreise</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h2 className="font-condensed text-h4 font-bold text-secondary">
                Externe Prüfungen
              </h2>
              <ul className="list-inside list-disc">
                {data?.years[4]?.externalExams?.length > 0 ? (
                  data?.years[4].externalExams.map(exam => (
                    <li key={exam}>{exam}</li>
                  ))
                ) : (
                  <li>keine</li>
                )}
              </ul>
            </div>
          </div>
          <div>
            <YearCarousel
              photos={data?.years[4].projects.flatMap(p => p.photos)}
            />
          </div>
        </article>

        <Divider className="bg-transparent" />
      </div>
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
      <div className="-mx-4 w-full rounded bg-muted/30 px-4 py-4">
        <CarouselContent className="-ml-2">
          {photos?.map(photo =>
            photo?.asset ? (
              <CarouselItem
                key={photo._key}
                className="pl-2 sm:basis-1/2 md:basis-1/3"
              >
                <img
                  src={urlFor(photo)
                    .height(512)
                    .width(512)
                    .format('webp')
                    .url()}
                  className="h-full rounded object-cover shadow"
                />
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
