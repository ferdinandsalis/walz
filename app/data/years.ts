import { Person, persons } from './persons.ts'

export type Year = {
  name: string
  symbol: string
  startedAt: Date
  graduatedAt: Date | null
  mentor: Person | undefined
  currentCover: string | null
  currentPlanHref: string | null
}

export const currentYears = [
  {
    name: 'Beta',
    symbol: 'β',
    startedAt: new Date('2023-09-04'),
    graduatedAt: null,
    mentor: persons.find(p => p.name === 'Max Seifert'),
    currentCover: '/images/years/beta_23.jpg',
    currentPlanHref: '/downloads/Beta_Jahresplan_2023_24.pdf',
  },
  {
    name: 'Alpha',
    symbol: 'α',
    startedAt: new Date('2022-09-05'),
    graduatedAt: null,
    mentor: persons.find(p => p.name === 'Valentin Rendl'),
    currentCover: '/images/years/alpha_22.jpg',
    currentPlanHref: '/downloads/Alpha_Jahresplan_2023_24.pdf',
  },
  {
    name: 'Psi',
    symbol: 'ψ',
    startedAt: new Date('2021-09-06'),
    graduatedAt: null,
    mentor: persons.find(p => p.name === 'Tamara Galhuber'),
    currentCover: '/images/years/psi_21.jpg',
    currentPlanHref: '/downloads/Psi_Jahresplan_2023_24.pdf',
  },
  {
    name: 'Theta',
    symbol: 'θ',
    startedAt: new Date('2020-09-07'),
    graduatedAt: null,
    mentor: persons.find(p => p.name === 'Michaela Pichler'),
    currentCover: '/images/years/theta_20.jpg',
    currentPlanHref: '/downloads/Theta_Jahresplan_2023_24.pdf',
  },
  {
    name: 'Phi',
    symbol: 'φ',
    startedAt: new Date('2019-09-03'),
    graduatedAt: null,
    mentor: persons.find(p => p.name === 'Georg Smolle'),
    currentCover: '/images/years/phi_19.jpg',
    currentPlanHref: '/downloads/Phi_Jahresplan_2023_24.pdf',
  },
  {
    name: 'Omikron',
    symbol: 'ο',
    startedAt: new Date('2018-09-03'),
    graduatedAt: new Date('2023-06-29'),
    mentor: persons.find(p => p.name === 'Max Seifert'),
    currentCover: '/images/years/omikron_18.jpg',
    currentPlanHref: '/downloads/Omikron_Jahresplan_2023_24.pdf',
  },
] satisfies Year[]
