// services/authApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IPlantProfile } from "../../../type";

// Define a service using a base URL and expected endpoints
export const PlantApi = createApi({
  reducerPath: "PLANT",
  tagTypes: ["PLANT"],
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getAllMytree: builder.mutation<IPlantProfile[], void>({
      query: () => ({ url: `/Allplantedtree`, method: "POST" }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllMytreeMutation,
  // Assuming fetch_all_planted_treeQuery is the actual query key
} = PlantApi;
