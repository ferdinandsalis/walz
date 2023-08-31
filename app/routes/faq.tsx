import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import fs from 'fs/promises'
import path from 'path'
import process from 'process'
import { remark } from 'remark'

function postFromModule(module: any) {
  const post = remark().processSync(module.source)
  console.log(module)
  return {
    slug: module.filename.replace(/\.mdx?$/, ''),
    ...module.attributes,
  }
}

const POSTS_DIR = path.join(process.cwd(), 'app/routes/questions')

export async function loader() {
  const questionFiles = await fs.readdir(POSTS_DIR)

  const questions = await Promise.all(
    questionFiles.map(async filename => {
      const source = await fs.readFile(path.join(POSTS_DIR, filename), 'utf8')
      return { filename, source }
    }),
  )

  return json(questions.map(postFromModule))
}

export default function Faq() {
  const loaderData = useLoaderData<typeof loader>()
  const posts = loaderData.map(post => ({
    ...post,
    title: post.title,
    abstract: post.abstract,
  }))
  console.log(posts)

  return (
    <div className="md:mt-12">
      <h1 className="absolute left-0 origin-top-left rotate-90 scale-[4] font-condensed text-xl font-bold text-stone-500 opacity-10">
        Häufige Fragen
      </h1>

      <div className="space-y-8">
        {posts.map(post => (
          <article key={post.slug}>
            <h1 className="mb-4 text-2xl font-bold text-secondary">
              {post.title}
            </h1>
            <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
              <p>{post.abstract}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
