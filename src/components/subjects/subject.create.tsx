import { Create, SimpleForm, TextInput, required} from "react-admin"

export default function SubjectCreate() {
  return (
    <Create>
      <SimpleForm>
        <TextInput source='name' validate={[required()]}/>
        <TextInput source='description' />
      </SimpleForm>
    </Create>
  )
}