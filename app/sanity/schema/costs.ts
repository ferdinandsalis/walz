import { BadgeEuro, EuroIcon } from 'lucide-react'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { z } from 'zod'

export const CostSchema = z.object({
  title: z.string(),
  quantity: z.number(),
  cost: z.number(),
  interval: z.union([
    z.literal('MONTHLY'),
    z.literal('QUARTERLY'),
    z.literal('ONCE'),
  ]),
  description: z.string().optional(),
})

export const cost = defineType({
  name: 'cost',
  title: 'Kostenpunkt',
  icon: EuroIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'quantity',
      title: 'Anzahl',
      description:
        'Anzahl der Einheiten, die in der Kostenberechnung berücksichtigt werden.',
      type: 'number',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'cost',
      title: 'Kosten',
      type: 'number',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'interval',
      title: 'Intervall',
      type: 'string',
      options: {
        list: [
          { title: 'monatlich', value: 'MONTHLY' },
          { title: 'vierteljährlich', value: 'QUARTERLY' },
          { title: 'einmalig', value: 'ONCE' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Beschreibung',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      quantity: 'quantity',
      cost: 'cost',
      interval: 'interval',
    },
    prepare(selection) {
      const { title, quantity, cost, interval } = selection as any
      return {
        title: `${title} - ${quantity} x ${cost} € ${interval}`,
      }
    },
  },
})

export default defineType({
  name: 'costs',
  title: 'Kosten',
  type: 'document',
  icon: BadgeEuro,
  fields: [
    defineField({
      name: 'definedAt',
      title: 'Definiert am',
      type: 'date',
      initialValue: () => new Date().toISOString().split('T')[0],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'list',
      type: 'array',
      of: [defineArrayMember(cost)],
    }),
  ],
  preview: {
    select: {
      definedAt: 'definedAt',
    },
    prepare(selection) {
      const { definedAt } = selection as any
      return {
        title: `Kostenliste ${new Date(definedAt).toLocaleDateString()}`,
      }
    },
  },
})
