import {
  from,
  ApolloClient,
  InMemoryCache,
  gql,
  HttpLink,
} from "@apollo/client";
import { removeTypenameFromVariables } from "@apollo/client/link/remove-typename";
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
  DeleteResult,
  DeleteParams,
  DeleteManyParams,
  DeleteManyResult,
  UpdateParams,
  UpdateResult,
} from "react-admin";
import schemas from "./schemas";
import { setContext } from "@apollo/client/link/context";

import authClient from "./auth-client";

const removeTypenameLink = removeTypenameFromVariables();
const authLink = setContext(async (_, { headers }) => {
  // console.log("is authenticated: ", await authClient.isAuthenticated());
  // eslint-disable-next-line no-useless-catch
  try {
    const token = await authClient.getTokenSilently({
      // authorizationParams: {
      // audience: "https://dev-jkakhj2ja4i553ok.us.auth0.com/api/v2/",
      // scope: "read:current_user",
      // },
    });
    // console.log("token: ", token);
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  } catch (error) {
    // console.log("authLinkerror: ", error);
    throw error;
  }
});
const link = from([
  removeTypenameLink,
  new HttpLink({
    uri: "http://127.0.0.1:8080/graphql",
    // credentials: "include",
  }),
  // authLink.concat(
  //   new HttpLink({
  //     uri: "http://127.0.0.1:8080/graphql",
  //     credentials: "include",
  //   })
  // ),
]);

const client = new ApolloClient({
  // uri: "http://127.0.0.1:8080/graphql",
  cache: new InMemoryCache(),
  link,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});

type ExpectedSchema = {
  [key: string]: string;
};

const resources: ExpectedSchema = {
  labs: schemas.labs,
  lecturers: `id name email gender lab { ${schemas.labs} } tags { id name } rating created_at editor`,
  subjects: `${schemas.subjects} editor`,
  courses: `id subject { ${schemas.subjects} } semester year lecturer { id name email }`,
  reviews: `id reviewer {
    id
    name
    email
  }
  comment
  rating`,
};
type Sort = "ASC" | "DESC";
const dataProvider: DataProvider = {
  getList: async function (
    resource: string,
    { pagination, sort }: GetListParams
  ): Promise<GetListResult> {
    try {
      // console.log("pagination: ", pagination);
      // console.log(`query ${resource}: `, resources[resource]);
      // console.log("sort: ", sort);
      const result = await client.query({
        query: gql`
        query ($limit: Int!, $page: Int!, $sort: Sort) {
          ${resource}(limit: $limit, page: $page, sort: $sort) {
            data { ${resources[resource]} }
            total
          }
        }
      `,
        errorPolicy: "all",
        variables: {
          page: pagination.page,
          limit: pagination.perPage,
          sort,
        },
      });

      if (result.error) {
        return Promise.reject(result.error);
      }
      if (result.errors) {
        console.log(result.errors);
        console.log(result.errors.map((error) => error.message));
        return Promise.reject(new Error("Server side error"));
      }

      return new Promise((resolve) => {
        resolve({
          data: result.data[`${resource}`].data,
          total: result.data[`${resource}`].total,
        });
      });
    } catch (error) {
      console.log("catch: ", error);
      return Promise.reject(error);
    }
  },
  getOne: async function (
    resource: string,
    params: GetOneParams
  ): Promise<GetOneResult> {
    try {
      console.log(`params :`, params);
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

      console.log("result: ", result);
      return new Promise((resolve) => {
        resolve({
          data: {
            ...result.data[`${resource}_by_pk`],
          },
        });
      });
    } catch (error) {
      return Promise.reject("ignore this damn error");
    }
  },
  create: async function (
    resource: string,
    params: CreateParams
  ): Promise<CreateResult> {
    console.log("params: ", params);
    const result = await client.mutate({
      mutation: gql`
        mutation($input: Create${
          resource.charAt(0).toUpperCase() + resource.slice(1)
        }Input!) {
          create_${resource}(input: $input) {
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
      resolve({ data: result.data[`create_${resource}`] });
    });
  },
  delete: async function (
    resource: string,
    params: DeleteParams
  ): Promise<DeleteResult> {
    console.log(`resources: `, resource);

    const result = await client.mutate({
      mutation: gql`
        mutation($id: Int!) {
          delete_${resource}_by_pk(id: $id) {
            ${resources[resource]}
          }
        }
      `,
      variables: {
        id: params.id,
      },
    });

    return { data: result.data };
  },
  update: async function (
    resource: string,
    params: UpdateParams
  ): Promise<UpdateResult> {
    console.log("params: ", params);
    const result = await client.mutate({
      mutation: gql`
        mutation($input: Update${
          resource.charAt(0).toUpperCase() + resource.slice(1)
        }Input!) {
          update_${resource}_by_pk(input: $input) {
            ${resources[resource]}
          }
        } 
      `,
      variables: {
        input: {
          id: params.id,
          ...params.data,
        },
      },
    });

    return { data: result.data[`update_${resource}_by_pk`] };
  },
  deleteMany: async function (
    resource: string,
    params: DeleteManyParams
  ): Promise<DeleteManyResult> {
    console.log(`resource: ${resource}`);
    const result = await client.mutate({
      mutation: gql`
        mutation($ids: [Int!]) {
          delete_${resource}(ids: $ids)
        }
      `,
      variables: {
        ids: params.ids,
      },
    });
    const foo = result.data["delete_lecturers"];
    console.log(`data of deleteMany: `, foo);
    return { data: foo };
  },
  getManyReference: async function (
    resource: string,
    params: GetManyReferenceParams
  ): Promise<GetManyReferenceResult> {
    // console.log("resource: ", resource);
    // console.log("params: ", params);
    try {
      const result = await client.query({
        query: gql`
        query($id: Int!, $page: Int, $limit: Int) {
          ${resource}_by_${params.target}(id: $id, page: $page, limit: $limit) {
            data { ${resources[resource]} }
            total
          }
        }
      `,
        variables: {
          id: params.id,
          limit: params.pagination.perPage,
          page: params.pagination.page,
        },
      });

      const data = result.data[`${resource}_by_${params.target}`].data;
      const total = result.data[`${resource}_by_${params.target}`].total;

      return new Promise((resolve) => {
        resolve({ data: data, total: total });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export { dataProvider, client };
