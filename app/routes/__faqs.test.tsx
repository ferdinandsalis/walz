import { expect, test } from 'vitest'
import { faqAnswerText, faqPath, faqs } from './__faqs.tsx'

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
  // these must keep landing on an answer, whatever the order becomes.
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
