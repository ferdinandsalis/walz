import fs from 'node:fs'
import path from 'node:path'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface AufnahmeFormData {
  studentName: string
  studentEmail: string
  studentAddress: string
  studentBirthdate: string
  currentSchool: string
  currentGrade: string
  parent1Name: string
  parent1Phone: string
  parent1Email: string
  parent1Address: string
  parent2Name?: string
  parent2Phone?: string
  parent2Email?: string
  parent2Address?: string
  source: string
}

export async function sendAufnahmeConfirmationEmail(
  data: AufnahmeFormData,
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

Nach unserem Tag der offenen Tür am 15.11. wird sich Frauke Rätz telefonisch bei Ihnen, liebe Eltern, melden, um einen Termin für das persönliche Aufnahmegespräch zu vereinbaren.

Für dich, liebe:r Bewerber:in, bis zum Gespräch:
• Schicke bitte eine kurze E-Mail an agnes.chorherr@walz.at mit drei Gründen, warum du in die Walz gehen möchtest.
• Überlege dir eine kreative Antwort auf die Frage und nimm sie zum Gespräch mit: Was verbindest du mit der Walz, welche Erwartungen und Vorstellungen hast du? Das kann ein Bild, ein Satz, eine Geschichte, ein Gedicht, ein Lied oder auch etwas ganz anderes sein – deiner Fantasie sind keine Grenzen gesetzt.

Ablauf des Gesprächs:
Das Aufnahmegespräch dauert etwa 30 Minuten. In den letzten 10 Minuten holen wir deine Eltern mit dazu.

Wir freuen uns schon sehr auf das Gespräch mit dir und Ihnen!

Liebe Grüße
das Team der Walz

P.S.: Im Anhang befindet sich der Informationsteil unseres Schulvertrages als Vorabinformation.`

    // Send to both student and parents
    const recipients = [data.studentEmail, data.parent1Email]
    if (data.parent2Email) {
      recipients.push(data.parent2Email)
    }

    await resend.emails.send({
      from: 'Walz <office@walz.at>',
      to: recipients,
      subject: 'Einladung zum Aufnahmegespräch an der Walz',
      text: emailBody,
      attachments: [
        {
          filename: 'schulvertrag_september_2026.pdf',
          content: contractBuffer,
        },
      ],
    })

    return { success: true }
  } catch (error) {
    console.error('Error sending confirmation email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function sendAufnahmeNotificationEmail(
  data: AufnahmeFormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const emailBody = `Neue Aufnahmeanmeldung eingegangen:

JUGENDLICHE*R:
Name: ${data.studentName}
E-Mail: ${data.studentEmail}
Adresse: ${data.studentAddress}
Geburtsdatum: ${data.studentBirthdate}
Derzeitige Schule: ${data.currentSchool}
Derzeitige Klasse/Schulstufe: ${data.currentGrade}

ELTERNTEIL 1:
Name: ${data.parent1Name}
Telefon: ${data.parent1Phone}
E-Mail: ${data.parent1Email}
Adresse: ${data.parent1Address}

ELTERNTEIL 2:
${data.parent2Name ? `Name: ${data.parent2Name}` : 'Nicht angegeben'}
${data.parent2Phone ? `Telefon: ${data.parent2Phone}` : ''}
${data.parent2Email ? `E-Mail: ${data.parent2Email}` : ''}
${data.parent2Address ? `Adresse: ${data.parent2Address}` : ''}

WIE AUF UNS AUFMERKSAM GEWORDEN:
${data.source}
`

    await resend.emails.send({
      from: 'Walz Aufnahme <office@walz.at>',
      to: 'office@walz.at',
      subject: 'Neue Aufnahmeanmeldung',
      text: emailBody,
    })

    return { success: true }
  } catch (error) {
    console.error('Error sending notification email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
