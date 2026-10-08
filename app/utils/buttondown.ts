const BASE_URL = 'https://api.buttondown.com'
const ENDPOINT = '/v1/subscribers'

export async function addSubscriber(
  email: string,
  source?: 'walz.at',
): Promise<{ success: boolean }> {
  const response = await fetch(`${BASE_URL}${ENDPOINT}`, {
    method: 'post',
    headers: {
      Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
      'Content-Type': 'application/json',
      // Signing up again merges into the existing subscriber instead of
      // failing with a 400 collision.
      'X-Buttondown-Collision-Behavior': 'add',
    },
    body: JSON.stringify({
      email_address: email,
      utm_source: source,
    }),
  })
  return { success: response.ok }
}
