import fs from 'node:fs'
import path from 'node:path'
import { Resend } from 'resend'
import {
  formatAddress,
  type Address,
  type AufnahmeSubmission,
  type Guardian,
} from './aufnahme-form.ts'

const resend = new Resend(process.env.RESEND_API_KEY)

// Only production mails the office. The dev server, e2e runs and CI send the
// school's copy to Resend's test inbox, so a test run never reaches the school.
function schoolInbox() {
  return process.env.NODE_ENV === 'production'
    ? 'office@walz.at'
    : 'delivered@resend.dev'
}

const SAME_ADDRESS_NOTE = '(wie erziehungsberechtigte Person 1)'

// The office confirms a copied address on the phone, so the copy is visible.
function addressLine(address: Address, copiedFromParent1: boolean) {
  const formatted = formatAddress(address)
  return copiedFromParent1 ? `${formatted} ${SAME_ADDRESS_NOTE}` : formatted
}

function birthdateForOffice(isoDate: string) {
  const [year, month, day] = isoDate.split('-')
  return `${day}.${month}.${year}`
}

function guardianLines(guardian: Guardian) {
  return [
    `Name: ${guardian.name}`,
    guardian.phone ? `Telefon: ${guardian.phone}` : undefined,
    guardian.email ? `E-Mail: ${guardian.email}` : undefined,
    guardian.address
      ? `Adresse: ${addressLine(guardian.address, guardian.sameAddressAsParent1)}`
      : undefined,
  ].filter((line): line is string => line !== undefined)
}

function sourceLine(source: AufnahmeSubmission['source']) {
  if (!source) return 'Nicht angegeben'
  return source.other ? `${source.label}: ${source.other}` : source.label
}

// The child and both parents, each address once: parents give their own
// address for a child without one, so the same address can come in twice.
function confirmationRecipients(data: AufnahmeSubmission) {
  const addresses = [
    data.student.email,
    data.parent1.email,
    data.parent2?.email,
  ]
  const recipients: string[] = []
  const seen = new Set<string>()
  for (const address of addresses) {
    if (!address || seen.has(address.toLowerCase())) continue
    seen.add(address.toLowerCase())
    recipients.push(address)
  }
  return recipients
}

export async function sendAufnahmeConfirmationEmail(
  data: AufnahmeSubmission,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Read the contract PDF
    const contractPath = path.join(
      process.cwd(),
      'public/downloads/schulvertrag_september_2026.pdf',
    )
    const contractBuffer = fs.readFileSync(contractPath)

    const emailBody = `Liebe Eltern, liebe Jugendliche,

vielen Dank für die Zusendung des Aufnahmeformulars!

Nach unserem Tag der offenen Tür am 14.11.2026 wird sich Frauke Rätz telefonisch bei Ihnen, liebe Eltern, melden, um einen Termin für das persönliche Aufnahmegespräch zu vereinbaren.

Für dich, liebe:r Bewerber:in, bis zum Gespräch:
• Schicke bitte eine kurze E-Mail an agnes.chorherr@walz.at mit drei Gründen, warum du in die Walz gehen möchtest.
• Überlege dir eine kreative Antwort auf die Frage und nimm sie zum Gespräch mit: Was verbindest du mit der Walz, welche Erwartungen und Vorstellungen hast du? Das kann ein Bild, ein Satz, eine Geschichte, ein Gedicht, ein Lied oder auch etwas ganz anderes sein – deiner Fantasie sind keine Grenzen gesetzt.

Ablauf des Gesprächs:
Das Aufnahmegespräch dauert etwa 30 Minuten. In den letzten 10 Minuten holen wir deine Eltern mit dazu.

Wir freuen uns schon sehr auf das Gespräch mit dir und Ihnen!

Liebe Grüße
das Team der Walz

P.S.: Im Anhang befindet sich der Informationsteil unseres Schulvertrages als Vorabinformation.`

    const { error } = await resend.emails.send({
      from: 'Walz <office@walz.at>',
      to: confirmationRecipients(data),
      subject: 'Einladung zum Aufnahmegespräch an der Walz',
      text: emailBody,
      attachments: [
        {
          filename: 'schulvertrag_september_2026.pdf',
          content: contractBuffer,
        },
      ],
    })
    // Resend reports a rejected send in its result instead of throwing.
    if (error) throw new Error(error.message)

    return { success: true }
  } catch (error) {
    // Resend's error text can quote an address, so the log line stays fixed
    console.error('Error sending confirmation email')
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function sendAufnahmeNotificationEmail(
  data: AufnahmeSubmission,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { student, parent1, parent2 } = data
    const emailBody = [
      'Neue Aufnahmeanmeldung eingegangen:',
      [
        'JUGENDLICHE:R',
        `Name: ${student.name}`,
        `E-Mail: ${student.email}`,
        `Geburtsdatum: ${birthdateForOffice(student.birthdate)}`,
        `Adresse: ${addressLine(student.address, student.sameAddressAsParent1)}`,
        `Derzeitige Klasse/Schulstufe: ${student.currentGrade}`,
      ].join('\n'),
      ['SCHULEN NACH DER VOLKSSCHULE', student.schoolHistory].join('\n'),
      ['ERZIEHUNGSBERECHTIGTE PERSON 1', ...guardianLines(parent1)].join('\n'),
      [
        'ERZIEHUNGSBERECHTIGTE PERSON 2',
        ...(parent2 ? guardianLines(parent2) : ['Nicht angegeben']),
      ].join('\n'),
      ['WIE AUF UNS AUFMERKSAM GEWORDEN', sourceLine(data.source)].join('\n'),
    ].join('\n\n')

    const { error } = await resend.emails.send({
      from: 'Walz Aufnahme <office@walz.at>',
      to: schoolInbox(),
      subject: 'Neue Aufnahmeanmeldung',
      text: emailBody,
    })
    // Resend reports a rejected send in its result instead of throwing.
    if (error) throw new Error(error.message)

    return { success: true }
  } catch (error) {
    // Resend's error text can quote an address, so the log line stays fixed
    console.error('Error sending notification email')
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
