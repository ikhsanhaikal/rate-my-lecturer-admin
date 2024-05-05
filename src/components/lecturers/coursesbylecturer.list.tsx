import { gql } from "@apollo/client";
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
import { client } from "../../data-provider";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
export default function CoursesByLecturerList({
  id,
}: {
  id: string | undefined;
}) {
  const [coursesPagination, setCoursesPagination] = useState({
    page: 1,
    perPage: 5,
  });

  const navigate = useNavigate();
  const [courses, setCourses] = useState({ data: [], total: 0, loading: true });
  useEffect(() => {
    (async function () {
      const result = await client.query({
        query: gql`
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
        `,
        variables: {
          id: id,
          limit: coursesPagination.perPage,
          page: coursesPagination.page,
        },
      });

      const data = result.data[`courses_by_lecturer`].data;
      const total = result.data[`courses_by_lecturer`].total;
      setCourses({ data, total, loading: result.loading });
    })();
  }, [coursesPagination, id]);

  const coursesContext = useList({
    data: courses.data,
    perPage: 5,
    isLoading: courses.loading,
  });

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
          value={{ ...coursesContext, total: courses.total }}
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
                onSettled: (data, error, variable) => {
                  console.log("onSettled was called");
                  console.log("data: ", data);
                  console.log("variable: ", variable);
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
