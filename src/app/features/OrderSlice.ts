// services/authApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IPlantProfile, Plant_order } from "../../../type";

// Define a service using a base URL and expected endpoints
export const OrderApi = createApi({
  reducerPath: "AUTHZ",
  tagTypes: ["Mytree"],
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getuserOrder: builder.mutation<Plant_order[], void>({
      query: () => ({ url: `/Order`, method: "POST" }),
    }),
    Fetch_my_tree: builder.query<IPlantProfile[], string>({
      query: (userId) => ({
        url: `/usertrees?_id=${userId}`,
      }),
      providesTags: ["Mytree"],
    }),

    Update_my_tree: builder.mutation<
      any,
      { findtree_id: string; status: number }
    >({
      query: (payload) => ({
        url: `/usertrees`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Mytree"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetuserOrderMutation,
  useFetch_my_treeQuery,
  useUpdate_my_treeMutation,
} = OrderApi;
