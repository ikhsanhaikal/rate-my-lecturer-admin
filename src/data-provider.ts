import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {
  GetListResult,
  GetListParams,
  GetOneParams,
  GetOneResult,
  CreateParams,
  CreateResult,
  DataProvider,
  GetManyReferenceParams,
  GetManyReferenceResult,
} from "react-admin";
import schemas from "./schemas";

const client = new ApolloClient({
  uri: "http://127.0.0.1:8080/graphql",
  cache: new InMemoryCache(),
});

type ExpectedSchema = {
  [key: string]: string;
};

const resources: ExpectedSchema = {
  labs: schemas.labs,
  lecturers: `id name email lab { ${schemas.labs} }`,
};

const dataProvider: DataProvider = {
  getList: async function (
    resource: string,
    { pagination }: GetListParams
  ): Promise<GetListResult> {
    // console.log(`query: ${resource}`);

    // console.log(`pagination: `, pagination);

    const result = await client.query({
      query: gql`
        query ($limit: Int!, $page: Int!) {
          ${resource}(limit: $limit, page: $page) {
            ${resources[resource]}
          }
        }
      `,
      variables: {
        page: pagination.page,
        limit: pagination.perPage,
      },
    });

    // console.log(`result`, result);
    // console.log(`result: `, result.data[`${resource}`]);

    return new Promise((resolve) => {
      resolve({
        data: result.data[`${resource}`],
        total: result.data[`${resource}`].length,
      });
    });
  },
  getOne: async function (
    resource: string,
    params: GetOneParams
  ): Promise<GetOneResult> {
    // console.log(`query: ${resource}_by_pk`);

    const result = await client.query({
      query: gql`
        query($id: Int!) {
          ${resource}_by_pk(id: $id) {
            ${resources[resource]}
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
  create: async function (
    resource: string,
    params: CreateParams
  ): Promise<CreateResult> {
    switch (resource) {
      case "lecturers": {
        // console.log(`input: `, params.data);
        const result = await client.mutate({
          mutation: gql`
            mutation($input: CreateLecturerInput!) {
              create_${resource}_one(input: $input) {
                ${resources[resource]}
              }
            }
          `,
          variables: {
            input: {
              ...params.data,
            },
          },
        });
        return new Promise((resolve) => {
          resolve({ data: result.data[`create_${resource}_one`] });
        });
      }
      default:
        return new Promise((resolve) => {
          resolve({ data: { id: -1 } });
        });
    }
  },
  getManyReference: async function (
    resource: string,
    params: GetManyReferenceParams
  ): Promise<GetManyReferenceResult> {
    console.log(`resource: `, resource);

    const result = await client.query({
      query: gql`
        query($id: Int!) {
          ${resource}_by_${params.target}(id: $id) {
            ${resources[resource]}
          }
        }
      `,
      variables: {
        id: params.id,
      },
    });

    console.log(
      `dataGetManyReference: `,
      result.data[`${resource}_by_${params.target}`]
    );

    const data = result.data[`${resource}_by_${params.target}`];

    return new Promise((resolve) => {
      resolve({ data: data, total: data.length });
    });
  },
};

export { dataProvider };
