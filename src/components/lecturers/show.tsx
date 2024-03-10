import { Show, SimpleShowLayout, TextField } from "react-admin";

const LecturerShow = () => (
  <Show>
      <SimpleShowLayout>
          <TextField source="id" />
          <TextField source="name" />
          <TextField source="email"/>
      </SimpleShowLayout>

  </Show>
);

export default LecturerShow;