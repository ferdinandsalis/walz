import { Logo } from '~/components/brand'

export default function Index() {
  return (
    <div>
      <div className="mb-8 flex flex-col items-center">
        <Logo />
      </div>
      <div className="grid md:grid-cols-3">
        <article>
          <h1 className="text-3xl font-medium text-sky-500">Bildung</h1>

          <h2>Verstehen, begreigen, erklaeren</h2>
        </article>
        <article>
          <h1 className="text-3xl font-medium text-sky-500">Praxiserfahrung</h1>
          <h2>Dinge probieren</h2>
        </article>
        <article>
          <h1 className="text-3xl font-medium text-sky-500">
            Persönlichkeitsentwicklung
          </h1>
          <h2>Potenziale entfalten</h2>
        </article>
      </div>
    </div>
  )
}
