import {
  DeleteButton,
  Edit,
  email,
  ReferenceField,
  required,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
  useGetList,
  usePermissions,
  WithRecord,
} from "react-admin";
import { useParams } from "react-router-dom";

export default function LecturerEdit() {
  const { id } = useParams();
  const { permissions } = usePermissions();
  const { data: labs, isLoading } = useGetList("labs");
  if (isLoading) {
    return <>loading..</>;
  }
  return (
    <Edit
      redirect="show"
      transform={(data, { previousData }) => {
        return {
          id: id,
          labId: data.lab.id,
          gender: data.gender,
          name: data.name,
          email: data.email,
          description: data.description,
        };
      }}
    >
      <SimpleForm
        toolbar={
          <Toolbar>
            <SaveButton label="save" />
            <WithRecord
              render={(record) =>
                permissions === record.editor || permissions === "admin" ? (
                  <DeleteButton label="delete" />
                ) : null
              }
            />
          </Toolbar>
        }
      >
        <TextInput disabled label="Id" source="id" />
        <TextInput
          fullWidth
          label="name"
          source="name"
          validate={[required()]}
        />
        <TextInput
          fullWidth
          label="email"
          source="email"
          validate={[required(), email()]}
        />
        <SelectInput
          label="gender"
          source="gender"
          choices={[
            { id: 1, name: "MALE" },
            { id: 2, name: "FEMALE" },
          ]}
          optionValue="name"
          validate={[required()]}
        />
        <SelectInput
          label="lab"
          source="lab.id"
          choices={labs ?? []}
          optionValue="id"
          optionText="name"
          validate={[required()]}
        />
      </SimpleForm>
    </Edit>
  );
}
