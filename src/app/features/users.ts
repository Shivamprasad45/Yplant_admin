// services/authApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IUser, Plant_coords } from "../../../type";

// Define a service using a base URL and expected endpoints
export const UserApi = createApi({
  reducerPath: "User",
  tagTypes: ["Users"],
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getAlluser: builder.mutation<IUser[], void>({
      query: () => ({ url: `/User`, method: "POST" }),
    }),
    Fetch_my_tree: builder.query<Plant_coords[], string>({
      query: (userId) => ({
        url: `/PendingTree?id=${userId}`,
      }),
      providesTags: ["Users"],
    }),

    Update_verfied_tree: builder.mutation<void, string>({
      query: (payload) => ({
        url: `/PendingTree?id=${payload}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAlluserMutation,
  useFetch_my_treeQuery,
  useUpdate_verfied_treeMutation,
} = UserApi;
