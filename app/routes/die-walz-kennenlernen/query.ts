import { defineQuery } from 'groq'

export const kennenlernenQuery = defineQuery(`{
  "upcomingEvents": *[_type == "event" && dateTime(start.date  + 'T00:00:00Z') >= dateTime(now()) - 60*60*24 && type == "orientation"] | order(start.date asc)[0...1] {
    _id,
    _type,
    type,
    title,
    start,
    end,
    location,
    description,
    cover,
  },
  "pastEvents": *[_type == "event" && dateTime(start.date + 'T00:00:00Z') < dateTime(now()) - 60*60*24 && type == "orientation"] | order(start.date desc)[0...2] {
    _id,
    _type,
    title,
    type,
    start,
    end,
    location,
    description,
    cover,
  }
}`)
