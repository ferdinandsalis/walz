const BASE_URL = 'https://api.buttondown.email'
const ENDPOINT = '/v1/subscribers'

export function addSubscriber(email: string, source?: 'walz.at') {
  return fetch(`${BASE_URL}${ENDPOINT}`, {
    method: 'post',
    headers: {
      Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      utm_source: source,
    }),
  })
}
