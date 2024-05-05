import {
  Create,
  SimpleForm,
  TextInput,
  required,
  useGetList,
  SelectInput,
  email,
  minLength,
} from "react-admin";

export default function LecturerCreate() {
  const { data } = useGetList("labs");
  return (
    <Create>
      <SimpleForm>
        <TextInput source="name" validate={[required(), minLength(2)]} />
        <TextInput source="email" validate={[required(), email()]} />
        <TextInput source="description" validate={[required()]} />
        <SelectInput
          source="gender"
          optionValue="name"
          choices={[
            { id: 1, name: "MALE" },
            { id: 2, name: "FEMALE" },
          ]}
          validate={[required()]}
        />
        <SelectInput
          source="labId"
          optionText="name"
          optionValue="id"
          choices={data ?? []}
          validate={[required()]}
        />
      </SimpleForm>
    </Create>
  );
}
