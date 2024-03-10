import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {
  GetListResult,
  GetListParams,
  GetOneParams,
  GetOneResult,
} from "react-admin";

const client = new ApolloClient({
  uri: "http://127.0.0.1:8080/graphql",
  cache: new InMemoryCache(),
});

const dataProvider = {
  getList: async function (
    resource: string,
    { pagination }: GetListParams
  ): Promise<GetListResult> {
    console.log(`query: ${resource}`);

    console.log(`pagination: `, pagination);

    const result = await client.query({
      query: gql`
        query ($limit: Int!, $page: Int!) {
          ${resource}(limit: $limit, page: $page) {
            id
            name
            email
            lab {
              name
              code
            }
          }
        }
      `,
      variables: {
        page: pagination.page,
        limit: pagination.perPage,
      },
    });

    console.log(`result: `, result.data[`${resource}`]);

    return new Promise((resolve) => {
      resolve({
        data: result.data[`${resource}`],
        total: 5,
      });
    });
  },
  getOne: async function (
    resource: string,
    params: GetOneParams
  ): Promise<GetOneResult> {
    console.log(`query: ${resource}_by_pk`);

    const result = await client.query({
      query: gql`
        query($id: Int!) {
          ${resource}_by_pk(id: $id) {
            id
            name
            email
          }
        }
      `,
      variables: {
        id: params.id,
      },
    });

    return new Promise((resolve) => {
      resolve({
        data: {
          ...result.data[`${resource}_by_pk`],
        },
      });
    });
  },
};

export { dataProvider };
