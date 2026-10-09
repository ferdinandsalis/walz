const BASE_URL = 'https://api.buttondown.com'
const ENDPOINT = '/v1/subscribers'

type SubscribeResult = { success: true } | { success: false; reason: string }

export async function addSubscriber(
  email: string,
  source?: 'walz.at',
): Promise<SubscribeResult> {
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
  if (response.ok) return { success: true }

  const code = await errorCode(response)
  return {
    success: false,
    reason: code ? `${response.status} ${code}` : String(response.status),
  }
}

// Buttondown's error codes name the cause without echoing the submitted
// address, so they are safe to report. Most errors carry a top-level `code`;
// validation errors come as a list under `detail`.
async function errorCode(response: Response) {
  try {
    const body = (await response.json()) as {
      code?: string
      detail?: Array<{ code?: string; type?: string }> | string
    }
    if (body.code) return body.code
    if (Array.isArray(body.detail)) {
      return body.detail[0]?.code ?? body.detail[0]?.type
    }
  } catch {
    // A body that is not JSON leaves the status as the only reason.
  }
  return undefined
}
