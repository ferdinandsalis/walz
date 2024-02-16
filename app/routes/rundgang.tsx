export default function Rundgang() {
  return (
    <>
      <h1 className="sr-only">Virtueller Rundgang</h1>
      <div>
        <iframe
          className="mx-auto rounded-md bg-muted p-6"
          title="Rundgang"
          src="https://my.matterport.com/show/?m=9FrURL8T2iC"
          width="800"
          height="600"
          frameBorder="0"
        ></iframe>
      </div>
    </>
  )
}
