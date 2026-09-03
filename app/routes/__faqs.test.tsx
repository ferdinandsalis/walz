import fs from 'node:fs'
import path from 'node:path'
import { expect, test } from 'vitest'
import { faqAnswerText, faqPath, faqs, featuredFaqs } from './__faqs.tsx'

test('every question has a unique slug', () => {
  const slugs = faqs.map(faq => faq.slug)
  expect(new Set(slugs).size).toBe(slugs.length)
})

test('slugs are usable as url anchors', () => {
  for (const faq of faqs) {
    expect(faq.slug).toMatch(/^[a-z0-9-]+$/)
  }
})

test('the slugs that shipped first still exist', () => {
  // They are live anchor targets — anyone who bookmarked or linked one of
  // these must keep landing on an answer.
  const slugs = faqs.map(faq => faq.slug)

  for (const slug of [
    'was-heisst-eigentlich-walz',
    'wieso-gibt-es-externistenpruefungen',
    'warum-ist-die-walz-smartphone-freie-zone',
    'wie-kann-ich-die-walz-kennenlernen',
    'was-kostet-die-walz',
  ]) {
    expect(slugs).toContain(slug)
  }
})

test('every question has a teaser and an answer', () => {
  for (const faq of faqs) {
    expect(faq.teaser.length).toBeGreaterThan(0)
    expect(faqAnswerText(faq).length).toBeGreaterThan(0)
  }
})

test('faqPath deep-links into the full answer', () => {
  expect(faqPath(faqs[0])).toBe(`/haeufige-fragen#${faqs[0].slug}`)
})

test('featuredFaqs is a subset of faqs, in the same order', () => {
  expect(featuredFaqs).toEqual(faqs.filter(faq => faq.featured))
  expect(featuredFaqs.length).toBeLessThan(faqs.length)
  // A landing page that shows nearly everything defeats the point of the flag.
  expect(featuredFaqs.length).toBeGreaterThanOrEqual(4)
  expect(featuredFaqs.length).toBeLessThanOrEqual(7)
})

test('faqAnswerText flattens the answer to plain text', () => {
  const kosten = faqs.find(faq => faq.slug === 'was-kostet-die-walz')!
  const text = faqAnswerText(kosten)

  expect(text).toContain('Daher müssen wir Schulgeld einheben.')
  // Link labels survive, markup does not.
  expect(text).toContain('Eine Aufschlüsselung findest du hier.')
  expect(text).not.toContain('<')
})

test('faqAnswerText keeps paragraphs apart', () => {
  const externisten = faqs.find(
    faq => faq.slug === 'wieso-gibt-es-externistenpruefungen',
  )!

  expect(faqAnswerText(externisten)).toContain(
    'extern durchzuführen? Ein wichtiges Prinzip',
  )
})

/**
 * Fixed designations that legitimately read the same here and on the page that
 * owns them. Keep this list short and say why each entry is on it — it is the
 * one place where a real regression could be silenced.
 */
const SHARED_DESIGNATIONS = [
  // The official curriculum this school is modelled on. There is no second
  // way to name it.
  'lehrplan eines oberstufenrealgymnasiums mit bildnerischem gestalten und werkerziehung',
]

const RUN_LIMIT = 12

function tokens(text: string) {
  return text.toLowerCase().match(/[\wäöüß]+/g) ?? []
}

function shingles(words: string[], size = RUN_LIMIT) {
  const out = new Set<string>()
  for (let i = 0; i + size <= words.length; i++) {
    out.add(words.slice(i, i + size).join(' '))
  }
  return out
}

function routeFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return routeFiles(full)
    if (!entry.name.endsWith('.tsx')) return []
    if (entry.name.startsWith('__faqs') || entry.name.includes('.test.')) {
      return []
    }
    return [full]
  })
}

/**
 * The FAQ is a signpost, not a second copy of the site: an answer says the one
 * thing you need and links to the page that owns the detail. Transcribing that
 * page instead means /haeufige-fragen competes with it for the same queries,
 * and the answer goes stale the moment the page is edited.
 *
 * This is a copy-paste detector, not a correctness check — a paraphrase that
 * quietly invents a fact passes it. Answers still need reading against their
 * source by hand.
 */
test('no answer transcribes a page that owns the detail', () => {
  const site = new Set<string>()
  const owners = new Map<string, string>()

  for (const file of routeFiles(path.join(process.cwd(), 'app/routes'))) {
    const prose = fs
      .readFileSync(file, 'utf-8')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\{'\s*'\}/g, ' ')
    for (const run of shingles(tokens(prose))) {
      site.add(run)
      owners.set(run, path.relative(process.cwd(), file))
    }
  }

  const allowed = SHARED_DESIGNATIONS.flatMap(phrase => [
    ...shingles(tokens(phrase), Math.min(RUN_LIMIT, tokens(phrase).length)),
  ])

  for (const faq of faqs) {
    const own = tokens(`${faq.teaser} ${faqAnswerText(faq)}`)
    const copied = [...shingles(own)].filter(
      run => site.has(run) && !allowed.some(phrase => run.includes(phrase)),
    )

    expect(
      copied,
      `"${faq.question}" repeats ${copied.length ? owners.get(copied[0]) : ''} word for word:\n  …${copied[0]}…\nAnswer it in our own words and link to that page instead.`,
    ).toEqual([])
  }
})
