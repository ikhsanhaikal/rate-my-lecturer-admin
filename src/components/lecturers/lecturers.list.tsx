import { Theme, useMediaQuery } from "@mui/material"
import { List, SimpleList, Datagrid, TextField, ShowButton } from "react-admin"


export default function LecturerList()  {
  const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'))
  return (
    <List exporter={false}>
      {
        isSmall ? 
        <SimpleList
          primaryText={record => record.name}
          secondaryText={record => `${record.email} views`}
          linkType={"show"}
        /> 
    :
        <Datagrid>
          <TextField source="id" />
          <TextField source="name" />
          <TextField source="email" />
          <TextField source="lab.name" />
          <>
            <ShowButton />
          </>
        </Datagrid>
      }
    </List>
  )
}
