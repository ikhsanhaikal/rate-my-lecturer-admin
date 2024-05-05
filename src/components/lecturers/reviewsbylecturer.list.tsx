import { gql } from "@apollo/client";
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
import { client } from "../../data-provider";
export default function ReviewsByLecturerList({
  id,
}: {
  id: string | undefined;
}) {
  const [reviewPagination, setReviewPagination] = useState({
    page: 1,
    perPage: 5,
  });

  const [reviews, setReviews] = useState({ data: [], total: 0, loading: true });
  useEffect(() => {
    (async function () {
      const result = await client.query({
        query: gql`
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
        `,
        variables: {
          id: id,
          limit: reviewPagination.perPage,
          page: reviewPagination.page,
        },
      });

      const data = result.data[`reviews_by_lecturer`].data;
      const total = result.data[`reviews_by_lecturer`].total;
      setReviews({ data, total, loading: result.loading });
    })();
  }, [reviewPagination, id]);

  const reviewsContext = useList({
    data: reviews.data,
    perPage: 5,
    isLoading: reviews.loading,
  });

  return (
    <Card variant="outlined">
      <CardHeader title="Reviews" />
      <CardContent>
        <ListContextProvider
          value={{ ...reviewsContext, total: reviews.total }}
        >
          <Datagrid bulkActionButtons={false}>
            <TextField source="reviewer.name" label="Name" />
            <TextField source="reviewer.email" label="Email" />
            <TextField source="comment" />
            <WithRecord
              label="Rating"
              render={(record) => <Rating readOnly value={record.rating} />}
            />
            <DeleteWithConfirmButton resource="reviews" redirect={false} />
          </Datagrid>
          <Pagination
            page={reviewPagination.page}
            perPage={reviewPagination.perPage}
            setPage={(page) => {
              console.log("setPage: ", page);
              setReviewPagination((old) => ({ ...old, page }));
            }}
            setPerPage={(perPage) => {
              console.log("setPerPage: ", perPage);
              setReviewPagination((old) => ({ ...old, perPage }));
            }}
          />
        </ListContextProvider>
      </CardContent>
    </Card>
  );
}
