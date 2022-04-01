import { Logo } from '~/components/brand'

export default function Index() {
  return (
    <div>
      <div className="mb-8 flex flex-col items-center">
        <Logo />
      </div>
      <div className="grid md:grid-cols-3">
        <article>
          <h1 className="text-3xl text-center font-medium text-sky-500">
            Bildung
          </h1>
        </article>
        <article>
          <h1 className="text-3xl text-center font-medium text-sky-500">
            Persönlichkeit
          </h1>
        </article>
        <article>
          <h1 className="text-3xl text-center font-medium text-sky-500">
            Praxis
          </h1>
        </article>
      </div>
    </div>
  )
}
