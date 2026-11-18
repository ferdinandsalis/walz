// Fails the Security Audit workflow on `npm audit` advisories at or above a
// severity, except the ones allowlisted below. npm audit itself cannot ignore
// an advisory.
//
// Usage: node other/audit-gate.ts <moderate|high|critical> <npm-audit.json>

import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

// Each entry needs a reason; remove it once a patched release exists.
const ALLOWLIST: Record<string, string> = {
  // picomatch ReDoS: no patched release (every version up to 4.0.7). Only
  // build tools, the test runner and the Sanity CLI load picomatch; the
  // production server does not.
  'GHSA-fc5q-39xc-vjpf': 'picomatch, no patched release',
}

const SEVERITY_RANK: Record<string, number> = {
  info: 0,
  low: 1,
  moderate: 2,
  high: 3,
  critical: 4,
}

type Advisory = {
  id: string
  packageName: string
  severity: string
  title: string
}

export type AuditReport = {
  error?: { code?: string; summary?: string }
  vulnerabilities?: Record<
    string,
    {
      name: string
      via: Array<string | { title: string; url: string; severity: string }>
    }
  >
}

export function blockingAdvisories(
  report: AuditReport,
  threshold: string,
  allowlist: Array<string>,
): Array<Advisory> {
  const minimum = SEVERITY_RANK[threshold]
  if (minimum === undefined) throw new Error(`Unknown severity: ${threshold}`)
  // The workflow ignores npm audit's exit code, so a failed audit must not
  // read as a clean one.
  if (!report.vulnerabilities) {
    const { code, summary } = report.error ?? {}
    throw new Error(
      `npm audit did not produce a report: ${[code, summary].filter(Boolean).join(' ') || 'unknown error'}`,
    )
  }

  const advisories = new Map<string, Advisory>()
  for (const vulnerability of Object.values(report.vulnerabilities)) {
    for (const cause of vulnerability.via) {
      // A string names a dependency that carries the advisory itself
      if (typeof cause === 'string') continue
      const id = cause.url.split('/').pop() ?? cause.url
      if (allowlist.includes(id)) continue
      if ((SEVERITY_RANK[cause.severity] ?? 0) < minimum) continue
      advisories.set(id, {
        id,
        packageName: vulnerability.name,
        severity: cause.severity,
        title: cause.title,
      })
    }
  }
  return [...advisories.values()]
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const [threshold = 'moderate', reportPath = 'audit-results.json'] =
    process.argv.slice(2)
  const report = JSON.parse(readFileSync(reportPath, 'utf8')) as AuditReport
  const blocking = blockingAdvisories(report, threshold, Object.keys(ALLOWLIST))

  for (const [id, reason] of Object.entries(ALLOWLIST)) {
    console.log(`Allowlisted ${id}: ${reason}`)
  }
  if (blocking.length === 0) {
    console.log(`No ${threshold} or worse advisories outside the allowlist.`)
  } else {
    console.error(`${blocking.length} ${threshold} or worse advisories:`)
    for (const a of blocking) {
      console.error(`- ${a.id} ${a.severity} ${a.packageName}: ${a.title}`)
    }
    process.exitCode = 1
  }
}
