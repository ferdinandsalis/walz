import { persons } from "./persons";

export const currentYears = [
  {
    name: 'Alpha',
    startedAt: new Date('2022-09-05'),
    graduatedAt: null,
    mentor: persons.find(p => p.name === 'Valentin Rendl'),
  },
  {
    name: 'Psi',
    startedAt: new Date('2021-09-06'),
    graduatedAt: null,
    mentor: persons.find(p => p.name === 'Tamara Galhuber'),
  },
  {
    name: 'Theta',
    startedAt: new Date('2020-09-07'),
    graduatedAt: null,
    mentor: persons.find(p => p.name === 'Michaela Pichler'),
  },
  {
    name: 'Phi',
    startedAt: new Date('2019-09-03'),
    graduatedAt: null,
    mentor: persons.find(p => p.name === 'Georg Smolle'),
  },
  {
    name: 'Omikron',
    startedAt: new Date('2018-09-03'),
    graduatedAt: new Date('2023-06-29'),
    mentor: persons.find(p => p.name === 'Max Seifert'),
  }
]