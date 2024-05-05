import {
  Edit,
  email,
  ReferenceField,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
  useEditController,
  useGetList,
  useRecordContext,
  WithRecord,
} from "react-admin";
import YearPickerInput from "../YearPickerInput";
import { useParams } from "react-router-dom";
import { Card } from "@mui/material";

export default function CourseEdit() {
  const { id, cid } = useParams();
  const transform = (data, { previousData }) => {
    console.log("data: ", data);
    const transformed = {
      id: cid,
      subject: data.subject.id,
      year: data.year,
      semester: data.semester,
    };
    console.log("transformed data: ", transformed);
    return transformed;
  };
  const {
    record,
    save,
    isLoading: recordIsLoading,
  } = useEditController({
    resource: "courses",
    id: cid,
    transform: transform,
    redirect: `/lecturers/${id}/show`,
  });

  const { data: subjects, isLoading } = useGetList("subjects");
  // console.log("subjects: ", subjects);
  if (isLoading) {
    return <>loading...</>;
  }
  return (
    <Card>
      <SimpleForm record={record} onSubmit={save}>
        <TextInput label="Id" source="id" />
        <TextInput
          disabled
          label="Lecturer Name"
          source="lecturer.name"
          fullWidth
        />
        <SelectInput
          label="semester"
          source="semester"
          choices={[
            { id: 1, name: "GANJIL" },
            { id: 2, name: "GENAP" },
          ]}
          optionValue="name"
          validate={[required()]}
          fullWidth
        />
        <YearPickerInput />
        <SelectInput
          label="subject"
          source="subject.id"
          optionValue="id"
          choices={subjects}
          // validate={[required()]}
          fullWidth
        />
      </SimpleForm>
    </Card>
  );
}
