export default function Legal() {
  return (
    <div className="md:mt-8">
      <h1 className="font-condensed text-xl font-bold text-primary md:text-4xl lg:text-5xl xl:text-6xl">
        Impressum
      </h1>

      <div className="space-y-12">
        <div>
          <p className="font-bold">Walz Wiener Lernzentrum</p>
          <p>Heinrich-Collin-Straße 9</p>
          <p>1140 Wien</p>
          <p>ZVR-Nr. 667889397</p>
          <p>
            <a href="tel:018042939">01-804 29 39</a>
          </p>
          <p>
            <a href="mailto:office@walz.at">office@walz.at</a>
          </p>
        </div>

        <div>
          <dl>
            <div>
              <dt className="font-bold">Pädagogische Leiterin</dt>
              <dd>Renate Chorherr</dd>
            </div>
            <div>
              <dt className="font-bold">Leiterin der Administration</dt>
              <dd>Brigitte Fasching</dd>
            </div>
            <div>
              <dt className="font-bold">
                Für den Inhalt der Seite verantwortlich
              </dt>
              <dd>Andrea Schuster</dd>
            </div>
            <div>
              <dt className="font-bold">Design &amp; technische Umsetzung</dt>
              <dd>Ferdinand Salis-Samaden</dd>
            </div>
          </dl>
        </div>

        <section className="max-w-prose">
          <p>
            Alle auf dieser Seite veröffentlichten Texte und Bilder sind - wenn
            nicht anders angegeben - geistiges Eigentum ihrer Autor/-innen und
            dürfen nicht ohne gut sichtbare Quellenangabe und Einverständnis
            derselben verbreitet werden.
          </p>
          <p>
            Die Fotos wurden von Jugendlichen der Walz, im Besonderen von Georg
            Prenn zur Verfügung gestellt. Unser ausdrücklicher Dank gilt Frau
            Gabriele Adam, die zahlreiche Theateraufführungen fotografisch
            dokumentiert hat.
          </p>
          <p>
            Diese Website enthält Verknüpfungen ("Hyperlinks") zu Websites
            Dritter. Diese Websites sind vollkommen unabhängig und liegen
            außerhalb der Kontrolle der Walz. Die Walz übernimmt keine
            Verantwortung für die Inhalte von externen Websites Dritter, die
            über Hyperlinks von dieser Website erreicht werden können oder die
            ihrerseits auf diese Website verweisen und sie übernimmt auch
            keinerlei Verantwortung für deren Richtigkeit, Vollständigkeit und
            Gesetzeskonformität.
          </p>
        </section>
      </div>
    </div>
  )
}
