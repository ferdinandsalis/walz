import { test, expect, type APIRequestContext } from '@playwright/test'

// Fly terminates TLS and forwards plain HTTP with X-Forwarded-Proto: https,
// while browsers send the page's https:// Origin with every form submission.
// React Router rejects actions whose Origin differs from the request URL, so
// the server must build that URL from the forwarded protocol.
//
// The email is invalid on purpose: the action rejects it before anything is
// sent to Buttondown, so reaching that rejection proves the request got past
// React Router's origin check.
function postNewsletter(request: APIRequestContext, origin: string) {
  return request.post('/resources/newsletter.data', {
    headers: {
      'X-Forwarded-Proto': 'https',
      Origin: origin,
    },
    form: { email: 'not-an-email' },
    failOnStatusCode: false,
  })
}

test('form actions accept same-origin submissions forwarded over https', async ({
  request,
  baseURL,
}) => {
  const host = new URL(baseURL!).host
  const response = await postNewsletter(request, `https://${host}`)

  expect(await response.text()).toContain('ZodError')
})

test('form actions still reject submissions from foreign origins', async ({
  request,
}) => {
  const response = await postNewsletter(request, 'https://attacker.example')

  expect(response.status()).toBe(400)
  expect(await response.text()).not.toContain('ZodError')
})
