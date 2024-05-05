import {
  Create,
  SimpleForm,
  TextInput,
  maxLength,
  required,
} from "react-admin";

export default function LabCreate() {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="name" validate={[required()]} />
        <TextInput source="code" validate={[required(), maxLength(10)]} />
        <TextInput source="description" />
      </SimpleForm>
    </Create>
  );
}
