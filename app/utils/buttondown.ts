const BASE_URL = 'https://api.buttondown.com'
const ENDPOINT = '/v1/subscribers'

export function addSubscriber(email: string, source?: 'walz.at') {
  return fetch(`${BASE_URL}${ENDPOINT}`, {
    method: 'post',
    headers: {
      Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email_address: email,
      utm_source: source,
    }),
  })
}
