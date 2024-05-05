import { Edit, required, SimpleForm, TextInput } from "react-admin";
import { useParams } from "react-router-dom";

export default function SubjectEdit() {
  const { id } = useParams();
  return (
    <Edit
      transform={(data, { previousData }) => {
        const { editor, ...rest } = data;
        return {
          ...rest,
          id,
        };
      }}
    >
      <SimpleForm>
        <TextInput disabled label="Id" source="id" />
        <TextInput
          fullWidth
          label="name"
          source="name"
          validate={[required()]}
        />
        <TextInput fullWidth label="descripion" source="description" />
      </SimpleForm>
    </Edit>
  );
}
