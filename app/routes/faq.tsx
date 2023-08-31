import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import fs from 'fs/promises'
import path from 'path'
import process from 'process'

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import remarkStringify from 'remark-stringify'
import rehypeStringify from 'rehype-stringify'
import remarkParseFrontmatter from 'remark-parse-frontmatter'

const FAQ_DIR = path.join(process.cwd(), 'app/routes/faq')

async function parseQuestions(questionFiles) {
  const questions = await Promise.all(
    questionFiles.map(async filename => {
      const source = await fs.readFile(path.join(FAQ_DIR, filename), 'utf8')

      // Step 1: Parse Markdown and frontmatter
      let file = await unified()
        .use(remarkParse)
        .use(remarkFrontmatter, ['yaml'])
        .use(remarkParseFrontmatter)
        .use(remarkStringify)
        .process(source)

      // Step 2: Capture the frontmatter
      const frontmatter = file.data.frontmatter
      console.log('Frontmatter:', frontmatter)

      // Step 3: Convert Markdown to HTML
      file = await unified()
        .use(remarkParse)
        .use(remarkFrontmatter)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(source)

      return {
        filename,
        slug: filename.replace(/\.mdx?$/, ''),
        html: file.toString(),
        frontmatter,
      }
    }),
  )

  return questions
}

export async function loader() {
  const questionFiles = await fs.readdir(FAQ_DIR)
  const questions = await parseQuestions(questionFiles)

  return json({ questions })
}

export default function Faq() {
  const loaderData = useLoaderData<typeof loader>()
  const questions = loaderData.questions

  return (
    <div className="md:mt-12">
      <h1 className="absolute left-0 origin-top-left rotate-90 scale-[4] font-condensed text-xl font-bold text-stone-500 opacity-10">
        Häufige Fragen
      </h1>

      <div className="space-y-8">
        {questions.map(question => (
          <article key={question.slug}>
            <h1 className="mb-4 text-2xl font-bold text-secondary">
              {question.frontmatter.title}
            </h1>
            <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
              <div dangerouslySetInnerHTML={{ __html: question.html }} />
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
