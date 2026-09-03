import React from 'react'
import { Link } from 'react-router'
import { BackToTop } from '#app/components/back-to-top.tsx'
import { Divider } from '#app/components/ui/divider.js'
import { faqAnswerText, faqs } from './__faqs.tsx'

/**
 * schema.org FAQPage, built from the same data the answers below render from,
 * so the structured data can never drift from the visible content.
 */
function faqPageJsonLd() {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faqAnswerText(faq),
      },
    })),
    // Escaped so the serialised JSON can never terminate the script element.
  }).replace(/</g, '\\u003c')
}

export default function Faq() {
  return (
    <div className="relative grid grid-cols-subgrid items-start gap-8 text-balance lg:col-span-2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqPageJsonLd() }}
      />
      <h1 className="font-condensed text-h1 text-muted-foreground font-bold opacity-20">
        Häufige Fragen
      </h1>
      <div className="md:text-body-md col-start-1 grid grid-cols-1 gap-16 text-balance">
        {faqs.map((faq, idx) => (
          <React.Fragment key={faq.slug}>
            {idx > 0 && <Divider />}
            <article id={faq.slug} className="grid gap-8">
              <Link to={`.#${faq.slug}`}>
                <h2 className="font-condensed text-h2 text-primary font-bold">
                  {faq.question}
                </h2>
              </Link>
              <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
                {faq.answer}
              </div>
            </article>
          </React.Fragment>
        ))}

        <BackToTop />
      </div>
    </div>
  )
}
