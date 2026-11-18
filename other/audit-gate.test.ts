import { expect, test } from 'vitest'
import { blockingAdvisories, type AuditReport } from './audit-gate.ts'

// Shaped like `npm audit --json`: each advisory sits in the `via` of the
// package it affects, and packages that merely depend on an affected one
// name that package in their `via` instead.
function auditReport(
  advisories: Array<{ name: string; severity: string; url: string }>,
) {
  const vulnerabilities: NonNullable<AuditReport['vulnerabilities']> = {}
  for (const { name, severity, url } of advisories) {
    vulnerabilities[name] = {
      name,
      via: [{ title: `${name} advisory`, url, severity }],
    }
  }
  vulnerabilities['depends-on-them'] = {
    name: 'depends-on-them',
    via: advisories.map(a => a.name),
  }
  return { vulnerabilities }
}

const picomatch = {
  name: 'picomatch',
  severity: 'high',
  url: 'https://github.com/advisories/GHSA-fc5q-39xc-vjpf',
}

test('passes when the only advisory is allowlisted', () => {
  expect(
    blockingAdvisories(auditReport([picomatch]), 'moderate', [
      'GHSA-fc5q-39xc-vjpf',
    ]),
  ).toEqual([])
})

test('blocks an advisory at or above the threshold that is not allowlisted', () => {
  const report = auditReport([
    picomatch,
    {
      name: 'glob',
      severity: 'moderate',
      url: 'https://github.com/advisories/GHSA-3g3m-2fjr-6pw4',
    },
  ])

  expect(
    blockingAdvisories(report, 'moderate', ['GHSA-fc5q-39xc-vjpf']),
  ).toEqual([
    {
      id: 'GHSA-3g3m-2fjr-6pw4',
      packageName: 'glob',
      severity: 'moderate',
      title: 'glob advisory',
    },
  ])
})

test('lets advisories below the threshold through', () => {
  const report = auditReport([
    {
      name: 'glob',
      severity: 'moderate',
      url: 'https://github.com/advisories/GHSA-3g3m-2fjr-6pw4',
    },
    {
      name: 'vite',
      severity: 'low',
      url: 'https://github.com/advisories/GHSA-9jrq-w75r-8gcw',
    },
  ])

  expect(blockingAdvisories(report, 'high', [])).toEqual([])
  expect(blockingAdvisories(report, 'moderate', [])).toHaveLength(1)
})

test('counts critical advisories as above every threshold', () => {
  const report = auditReport([
    {
      name: 'proxy-addr',
      severity: 'critical',
      url: 'https://github.com/advisories/GHSA-aaaa-bbbb-cccc',
    },
  ])

  expect(blockingAdvisories(report, 'high', [])).toHaveLength(1)
})

test('lists an advisory once even when several packages carry it', () => {
  const report = auditReport([picomatch])
  report.vulnerabilities['anymatch'] = {
    name: 'anymatch',
    via: [
      { title: 'picomatch advisory', url: picomatch.url, severity: 'high' },
    ],
  }

  expect(blockingAdvisories(report, 'moderate', [])).toHaveLength(1)
})

test('fails when npm audit could not produce a report', () => {
  // What `npm audit --json` prints when the registry is unreachable
  const report = { error: { code: 'ENOTFOUND', summary: 'request failed' } }

  expect(() => blockingAdvisories(report, 'moderate', [])).toThrow(
    'npm audit did not produce a report: ENOTFOUND request failed',
  )
})
