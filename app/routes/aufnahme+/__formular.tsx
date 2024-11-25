import { Form } from 'react-router'
import { Button } from '#app/components/ui/button.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { Label } from '#app/components/ui/label.tsx'

export default function AdmissionsForm() {
  return (
    <Form>
      <div>
        <div>
          <Label>Name</Label>
          <Input name="name" />
        </div>
        <div>
          <Label>Geburtsdatum</Label>
          <Input type="datetime-local" name="dateOfBirth" />
        </div>
        <div>
          <Label>Derzeitige Schule</Label>
          <Input name="currentSchool" />
        </div>
        <div>
          <Label>Derzeitige Schulstufe</Label>
          <Input name="currentSchool" />
        </div>
        <div>
          <Label>Name Elternteil 1</Label>
          <Input name="parentalPartOne" />
        </div>
        <div>
          <Label>Name Elternteil 2</Label>
          <Input name="parentalPartTwo" />
        </div>
        <div>
          <Label>Wohnadresse</Label>
          <Input name="address" />
        </div>
      </div>
      <Button>Abschicken</Button>
    </Form>
  )
}
