import { persons } from "./persons";

export const currentYears = [
  {
    name: 'Alpha',
    symbol: 'α',
    startedAt: new Date('2022-09-05'),
    graduatedAt: null,
    mentor: persons.find(p => p.name === 'Valentin Rendl'),
    currentCover: '/images/years/alpha_22.jpg'
  },
  {
    name: 'Psi',
    symbol: 'ψ',
    startedAt: new Date('2021-09-06'),
    graduatedAt: null,
    mentor: persons.find(p => p.name === 'Tamara Galhuber'),
    currentCover: '/images/years/psi_21.jpg'
  },
  {
    name: 'Theta',
    symbol: 'θ',
    startedAt: new Date('2020-09-07'),
    graduatedAt: null,
    mentor: persons.find(p => p.name === 'Michaela Pichler'),
    currentCover: '/images/years/theta_20.jpg'
  },
  {
    name: 'Phi',
    symbol: 'φ',
    startedAt: new Date('2019-09-03'),
    graduatedAt: null,
    mentor: persons.find(p => p.name === 'Georg Smolle'),
    currentCover: '/images/years/phi_19.jpg'
  },
  {
    name: 'Omikron',
    symbol: 'ο',
    startedAt: new Date('2018-09-03'),
    graduatedAt: new Date('2023-06-29'),
    mentor: persons.find(p => p.name === 'Max Seifert'),
    currentCover: '/images/years/omikron_18.jpg'
  }
]