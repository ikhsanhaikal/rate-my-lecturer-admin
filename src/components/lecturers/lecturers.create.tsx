import { Create, SimpleForm, TextInput, required, NumberInput } from "react-admin"

export default function LecturerCreate() {
  return (
    <Create>
      <SimpleForm>
        <TextInput source='name' validate={[required()]}/>
        <TextInput source='email' validate={[required()]}/>
        <TextInput source='description' validate={[required()]}/>
        <NumberInput source='labId' validate={[required()]} />
      </SimpleForm>
    </Create>
  )
}