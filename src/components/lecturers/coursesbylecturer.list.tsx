import { gql, useQuery } from "@apollo/client";
import { Card, CardHeader, CardContent, Rating, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import {
  ListContextProvider,
  Datagrid,
  TextField,
  WithRecord,
  DeleteWithConfirmButton,
  Pagination,
  useList,
  EditButton,
  Button,
} from "react-admin";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
const GET_COURSES_BY_LECTURER = gql`
  query ($id: Int!, $page: Int, $limit: Int) {
    courses_by_lecturer(id: $id, page: $page, limit: $limit) {
      data {
        id
        subject {
          id
          name
        }
        semester
        year
        lecturer {
          id
          name
          email
        }
      }
      total
    }
  }
`;
export default function CoursesByLecturerList({
  id,
  open,
}: {
  id: string | undefined;
  open: boolean;
}) {
  const [coursesPagination, setCoursesPagination] = useState({
    page: 1,
    perPage: 5,
  });

  const navigate = useNavigate();
  const {
    loading,
    data: courses,
    refetch,
  } = useQuery(GET_COURSES_BY_LECTURER, {
    variables: {
      id: id,
      limit: coursesPagination.perPage,
      page: coursesPagination.page,
    },
  });

  const coursesContext = useList({
    data: courses ? courses["courses_by_lecturer"].data : [],
    perPage: 5,
    isLoading: loading,
  });

  if (loading) {
    return <>loading...</>;
  }

  return (
    <Card variant="outlined">
      <CardHeader
        title={
          <Stack direction="row" justifyContent="space-between">
            <p>Courses</p>
            <Button
              onClick={() => {
                navigate(`/lecturers/${id}/courses/create`);
              }}
              label="Assign new course"
            ></Button>
          </Stack>
        }
      />
      <CardContent>
        <ListContextProvider
          value={{
            ...coursesContext,
            total: courses ? courses["courses_by_lecturer"].total : 0,
          }}
        >
          <Datagrid bulkActionButtons={false}>
            <TextField source="id" label="Id" />
            <TextField source="subject.name" label="Subject" />
            <TextField source="semester" label="Semester" />
            <WithRecord
              label="Year"
              render={(record) => {
                const year = record.year
                  ? { year: dayjs(record.year).year() }
                  : { year: null };
                return <TextField source="year" record={year} />;
              }}
            />
            <WithRecord
              render={(record) => (
                <EditButton to={`/lecturers/${id}/courses/${record.id}/edit`} />
              )}
            />
            <DeleteWithConfirmButton
              resource="courses"
              redirect={() => `lecturers/${id}/show`}
              mutationOptions={{
                onSuccess: async () => {
                  await refetch();
                },
              }}
            />
          </Datagrid>
          <Pagination
            page={coursesPagination.page}
            perPage={coursesPagination.perPage}
            setPage={(page) => {
              setCoursesPagination((old) => ({ ...old, page }));
            }}
            setPerPage={(perPage) => {
              setCoursesPagination((old) => ({ ...old, perPage }));
            }}
          />
        </ListContextProvider>
      </CardContent>
    </Card>
  );
}
