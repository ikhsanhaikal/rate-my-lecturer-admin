import {
  List,
  Datagrid,
  TextField,
  EditButton,
  usePermissions,
  WithRecord,
  DeleteWithConfirmButton,
} from "react-admin";

export default function SubjectList() {
  const { permissions } = usePermissions();
  // console.log("permissions: ", permissions);
  return (
    <List exporter={false}>
      <Datagrid bulkActionButtons={false}>
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="description" />
        {/* <TextField source="discontinued" /> */}
        <EditButton />
        <WithRecord
          render={(record) => {
            // console.log("record.editor: ", record.editor);
            return (
              <DeleteWithConfirmButton
                title="delete subject"
                content="Are u sure?"
                disabled={
                  permissions !== record.editor || permissions !== "admin"
                    ? false
                    : true
                }
              />
            );
          }}
        />
      </Datagrid>
    </List>
  );
}
