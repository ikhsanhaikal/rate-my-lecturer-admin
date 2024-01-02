import { Admin, BooleanField, Datagrid, DateField, List, Resource, TextField } from 'react-admin'

const PostList = () => {
  return (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <DateField source="published_at" />
            <TextField source="category" />
            <BooleanField source="commentable" />
        </Datagrid>
    </List>
  )
}

function App(){
  return (
    <Admin >
        <Resource name="posts" list={PostList} />
    </Admin>
  )
}

export default App
