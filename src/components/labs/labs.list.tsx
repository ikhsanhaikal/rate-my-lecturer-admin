import { Avatar, Link, Stack, Theme, Typography, useMediaQuery } from "@mui/material"
import { List, SimpleList, Datagrid, TextField, EditButton, ReferenceManyField, WithListContext } from "react-admin"
import { Link as RouterLink } from "react-router-dom";

const MembersOfLab = () => {
  return (
    <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
      <ReferenceManyField label="Comments by" reference="lecturers" target="lab">
        <WithListContext render={({ data }) => (
          <>
            {
              data == null ?
              <p>loading..</p> : 
              data.map((l) => {
                return (
                    <Link component={RouterLink} to={`/lecturers/${l.id}/show`}>
                      <Stack alignItems="center" >
                        <Avatar src={`https://ui-avatars.com/api/?name=${l.name}&background=random`} />
                        <Typography variant="caption" gutterBottom >
                          {l.name}
                        </Typography>
                      </Stack>
                    </Link>
                )
              })
            }
          </>
          )} 
        />
      </ReferenceManyField>
    </Stack>
  )
}

export default function LabList()  {
  const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'))
  return (
    <List exporter={false}>
      {
        isSmall ? 
        <SimpleList
          primaryText={record => record.name}
          secondaryText={record => `${record.code}`}
          linkType={"show"}
        /> 
    :
        <Datagrid expand={MembersOfLab}>
          <TextField source="id" />
          <TextField source="name" />
          <TextField source="code" />
          <>
            <EditButton />
          </>
        </Datagrid>
      }
    </List>
  )
}
