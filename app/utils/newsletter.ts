import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('app59t58w2ZkjdkfV');

function searchByEmail(email: string) {
  return base('Emails').select({
    maxRecords: 1,
    filterByFormula: `{email} = '${email}'`
  }).all()
}

export async function addEmail(email: string) {
  const records = await searchByEmail(email)
  if (records.length > 0) {
    return { email }
  }

  return base('Emails').create([
    {
      "fields": {
        "email": email
      }
    },
  ])
}

