import { gql, useQuery } from "@apollo/client";
import { Card, CardHeader, CardContent, Rating } from "@mui/material";
import { useEffect, useState } from "react";
import {
  ListContextProvider,
  Datagrid,
  TextField,
  WithRecord,
  DeleteWithConfirmButton,
  Pagination,
  useList,
} from "react-admin";

const GET_REVIEWS_BY_LECTURER = gql`
  query ($id: Int!, $page: Int, $limit: Int) {
    reviews_by_lecturer(id: $id, page: $page, limit: $limit) {
      data {
        id
        reviewer {
          id
          name
          email
        }
        comment
        rating
      }
      total
    }
  }
`;
export default function ReviewsByLecturerList({
  id,
}: {
  id: string | undefined;
}) {
  const [reviewPagination, setReviewPagination] = useState({
    page: 1,
    perPage: 5,
  });
  const {
    loading,
    error,
    data: reviews,
    refetch,
  } = useQuery(GET_REVIEWS_BY_LECTURER, {
    variables: {
      id: id,
      limit: reviewPagination.perPage,
      page: reviewPagination.page,
    },
  });

  const reviewsContext = useList({
    data: reviews ? reviews["reviews_by_lecturer"].data : [],
    perPage: 5,
    isLoading: loading,
  });

  if (loading) {
    return <>loading..</>;
  }

  return (
    <Card variant="outlined">
      <CardHeader title="Reviews" />
      <CardContent>
        <ListContextProvider
          value={{
            ...reviewsContext,
            total: reviews ? reviews["reviews_by_lecturer"].total : 0,
          }}
        >
          <Datagrid bulkActionButtons={false}>
            <TextField source="reviewer.name" label="Name" />
            <TextField source="reviewer.email" label="Email" />
            <TextField source="comment" />
            <WithRecord
              label="Rating"
              render={(record) => <Rating readOnly value={record.rating} />}
            />
            <DeleteWithConfirmButton
              resource="reviews"
              redirect={false}
              mutationOptions={{
                onSuccess: async () => {
                  await refetch();
                },
              }}
            />
          </Datagrid>
          <Pagination
            page={reviewPagination.page}
            perPage={reviewPagination.perPage}
            setPage={(page) => {
              // console.log("setPage: ", page);
              setReviewPagination((old) => ({ ...old, page }));
            }}
            setPerPage={(perPage) => {
              // console.log("setPerPage: ", perPage);
              setReviewPagination((old) => ({ ...old, perPage }));
            }}
          />
        </ListContextProvider>
      </CardContent>
    </Card>
  );
}
