import { Avatar, Rating, Stack } from "@mui/material";
import {
  List,
  Datagrid,
  TextField,
  ShowButton,
  useRecordContext,
  DateField,
  WithRecord,
  ArrayField,
  ChipField,
  SingleFieldList,
  usePermissions,
  DeleteWithConfirmButton,
} from "react-admin";

function FirstColumnField() {
  const record = useRecordContext();
  // console.log('record: ', record)
  return (
    <Stack alignItems="center" spacing={2} direction="row">
      <Avatar
        src={`https://ui-avatars.com/api/?name=${record.name}&background=random`}
      />
      <TextField source="name" />
    </Stack>
  );
}
function RatingField() {
  const record = useRecordContext();
  // console.log('record.rating: ', record.rating);
  return <Rating readOnly value={record.rating} />;
}

export default function LecturerList() {
  // const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'))
  const { permissions } = usePermissions();
  return (
    <List exporter={false}>
      <Datagrid bulkActionButtons={false}>
        <TextField source="id" />
        <FirstColumnField label="Name" />
        <TextField source="email" />
        <TextField source="lab.name" label="Lab" />
        <RatingField label="Rating" />
        <ArrayField source="tags">
          <SingleFieldList linkType={false}>
            <ChipField source="name" size="small" />
          </SingleFieldList>
        </ArrayField>
        <DateField source="created_at" label="Date Created" />
        <ShowButton />
        <WithRecord
          render={(record) => {
            return (
              <DeleteWithConfirmButton
                title="Delete lecturers"
                content="Are you sure "
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
