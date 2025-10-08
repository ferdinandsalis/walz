import { LoaderIcon } from 'lucide-react'
import {
  type ActionFunctionArgs,
  Form,
  redirect,
  useActionData,
  useNavigation,
  useSearchParams,
} from 'react-router'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { useSpinDelay } from 'spin-delay'
import { z } from 'zod'
import { Button } from '#app/components/ui/button.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { Label } from '#app/components/ui/label.tsx'
import { Textarea } from '#app/components/ui/textarea.tsx'
import {
  sendAufnahmeConfirmationEmail,
  sendAufnahmeNotificationEmail,
} from '#app/utils/email.server.ts'
import { checkHoneypot } from '#app/utils/honeypot.server.ts'

export function meta() {
  return [{ title: 'Aufnahmeformular | Walz' }]
}

const aufnahmeFormSchema = z.object({
  studentName: z.string().min(1, 'Name ist erforderlich'),
  studentEmail: z.string().email('Ungültige E-Mail-Adresse'),
  studentAddress: z.string().min(1, 'Adresse ist erforderlich'),
  studentBirthdate: z.string().min(1, 'Geburtsdatum ist erforderlich'),
  currentSchool: z.string().min(1, 'Schule ist erforderlich'),
  currentGrade: z.string().min(1, 'Klasse/Schulstufe ist erforderlich'),
  parent1Name: z.string().min(1, 'Name ist erforderlich'),
  parent1Phone: z.string().min(1, 'Telefon ist erforderlich'),
  parent1Email: z.string().email('Ungültige E-Mail-Adresse'),
  parent1Address: z.string().min(1, 'Adresse ist erforderlich'),
  parent2Name: z.string().optional(),
  parent2Phone: z.string().optional(),
  parent2Email: z
    .string()
    .email('Ungültige E-Mail-Adresse')
    .optional()
    .or(z.literal('')),
  parent2Address: z.string().optional(),
  source: z.string().min(1, 'Dieses Feld ist erforderlich'),
})

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()

  // Check honeypot for spam
  checkHoneypot(formData)

  // Validate form data
  const parseResult = aufnahmeFormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  )

  if (!parseResult.success) {
    return {
      success: false,
      error: 'Bitte füllen Sie alle erforderlichen Felder korrekt aus.',
      errors: parseResult.error.flatten().fieldErrors,
    }
  }

  const data = parseResult.data

  // Send confirmation email to parents and student
  const confirmationResult = await sendAufnahmeConfirmationEmail(data)

  if (!confirmationResult.success) {
    console.error(
      'Failed to send confirmation email:',
      confirmationResult.error,
    )
    return {
      success: false,
      error:
        'Es gab ein Problem beim Senden der Bestätigungs-E-Mail. Bitte versuchen Sie es später erneut.',
    }
  }

  // Send notification email to school
  const notificationResult = await sendAufnahmeNotificationEmail(data)

  if (!notificationResult.success) {
    console.error(
      'Failed to send notification email:',
      notificationResult.error,
    )
    // Don't fail the whole process if notification fails, but log it
  }

  return redirect('/aufnahme/formular?success=true')
}

export default function AufnahmeFormular() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const [searchParams] = useSearchParams()
  const isSubmitting = navigation.state === 'submitting'
  const showSpinner = useSpinDelay(isSubmitting)
  const done = searchParams.get('success') === 'true'

  return (
    <div className="px-4 py-8">
      <h1 className="mb-8 font-condensed text-4xl font-bold text-primary">
        Aufnahmeformular
      </h1>

      {done ? (
        <div className="rounded-md border border-green-500/50 bg-green-50 p-4">
          <h2 className="mb-2 font-bold text-green-500">
            Vielen Dank für Ihre Anmeldung!
          </h2>
          <p className="text-green-500">
            Sie erhalten in Kürze eine Bestätigungs-E-Mail mit weiteren
            Informationen zum Aufnahmegespräch.
          </p>
        </div>
      ) : (
        <Form method="POST">
          <HoneypotInputs />

          <div className="space-y-8">
            {/* Student Information */}
            <fieldset className="border-t border-muted p-0">
              <legend className="pl-0 pr-2 font-condensed text-h5 font-bold">
                Informationen Jugendliche:r
              </legend>
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="studentName" className="required">
                    Vor- und Nachname *
                  </Label>
                  <Input
                    id="studentName"
                    name="studentName"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="studentEmail" className="required">
                    E-Mail *
                  </Label>
                  <Input
                    id="studentEmail"
                    name="studentEmail"
                    type="email"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="studentAddress" className="required">
                    Wohnadresse *
                  </Label>
                  <Input
                    id="studentAddress"
                    name="studentAddress"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="studentBirthdate" className="required">
                    Geburtsdatum *
                  </Label>
                  <Input
                    id="studentBirthdate"
                    name="studentBirthdate"
                    type="date"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="currentSchool" className="required">
                    Derzeit besuchte Schule *
                  </Label>
                  <Input
                    id="currentSchool"
                    name="currentSchool"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="currentGrade" className="required">
                    Klasse/Schulstufe *
                  </Label>
                  <Input
                    id="currentGrade"
                    name="currentGrade"
                    required
                    className="mt-1"
                  />
                </div>
              </div>
            </fieldset>

            {/* Parent 1 Information */}
            <fieldset className="border-t border-muted p-0">
              <legend className="pl-0 pr-2 font-condensed text-h5 font-bold">
                Informationen Elternteil 1
              </legend>
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="parent1Name" className="required">
                    Name *
                  </Label>
                  <Input
                    id="parent1Name"
                    name="parent1Name"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="parent1Phone" className="required">
                    Telefon *
                  </Label>
                  <Input
                    id="parent1Phone"
                    name="parent1Phone"
                    type="tel"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="parent1Email" className="required">
                    E-Mail *
                  </Label>
                  <Input
                    id="parent1Email"
                    name="parent1Email"
                    type="email"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="parent1Address" className="required">
                    Adresse *
                  </Label>
                  <Input
                    id="parent1Address"
                    name="parent1Address"
                    required
                    className="mt-1"
                  />
                </div>
              </div>
            </fieldset>

            {/* Parent 2 Information */}
            <fieldset className="m-0 border-t border-muted p-0">
              <legend className="pl-0 pr-2 font-condensed text-h5 font-bold">
                Informationen Elternteil 2
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  (optional)
                </span>
              </legend>
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="parent2Name">Name</Label>
                  <Input id="parent2Name" name="parent2Name" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="parent2Phone">Telefon</Label>
                  <Input
                    id="parent2Phone"
                    name="parent2Phone"
                    type="tel"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="parent2Email">E-Mail</Label>
                  <Input
                    id="parent2Email"
                    name="parent2Email"
                    type="email"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="parent2Address">Adresse</Label>
                  <Input
                    id="parent2Address"
                    name="parent2Address"
                    className="mt-1"
                  />
                </div>
              </div>
            </fieldset>

            {/* Additional Information */}
            <fieldset className="border-t border-muted p-0">
              <legend className="pl-0 pr-2 font-condensed text-h5 font-bold">
                Zusätzliche Informationen
              </legend>
              <div className="mt-4">
                <Label htmlFor="source" className="required">
                  Wie sind Sie auf uns aufmerksam geworden? *
                </Label>
                <Textarea
                  id="source"
                  name="source"
                  required
                  className="mt-1"
                  rows={3}
                />
              </div>
            </fieldset>

            {actionData?.error && (
              <div className="rounded-md border border-red-500 bg-red-50 p-4 text-red-900">
                {actionData.error}
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                Absenden
              </Button>
              {showSpinner && (
                <LoaderIcon className="animate-spin stroke-secondary" />
              )}
            </div>
          </div>
        </Form>
      )}
    </div>
  )
}
