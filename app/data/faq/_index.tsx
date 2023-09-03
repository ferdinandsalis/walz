import { json } from '@remix-run/node'
import fs from 'fs/promises'
import path from 'path'

function postFromModule(module: any) {
  return {
    slug: module.filename.replace(/\.mdx?$/, ''),
    ...module.attributes,
  }
}

export async function loader() {
  const POSTS_DIR = path.join(process.cwd(), 'app/routes/faq')
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
  return <div>FAQ</div>
}
