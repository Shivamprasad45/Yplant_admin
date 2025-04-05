// services/authApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IPlantProfile } from "../../../type";
import { LocationData } from "@/utils/locationService";

export const PlantApi = createApi({
  reducerPath: "PLANT",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["PLANT"], // Define tag type for caching & invalidation
  endpoints: (builder) => ({
    getAllMytree: builder.mutation<IPlantProfile[], void>({
      query: () => ({
        url: `/Allplantedtree`,
        method: "POST",
      }),
      invalidatesTags: ["PLANT"], // Invalidate cache after mutation
    }),

    getOneTree: builder.query<IPlantProfile, { plantId: any; findid: any }>({
      query: ({ plantId, findid }) => ({
        url: `/MytreeDet?plantid=${plantId}&findid=${findid}`,
      }),
      providesTags: ["PLANT"], // Ensures caching works for this data
    }),

    UpdateTree: builder.mutation<
      IPlantProfile,
      {
        plantId: any;
        findid: any;
        plantLocation: LocationData;
        userId: any;
        ImageURL: string;
        CommanName: string;
      }
    >({
      query: ({
        plantId,
        findid,
        plantLocation,
        userId,
        ImageURL,
        CommanName,
      }) => ({
        url: `/MytreeDet?plantid=${plantId}&findid=${findid}`,
        method: "POST",
        body: { status: 1, plantLocation, userId, ImageURL, CommanName },
      }),
      invalidatesTags: ["PLANT"], // Ensures updated data is fetched after mutation
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetAllMytreeMutation,

  useGetOneTreeQuery,
  useUpdateTreeMutation,
} = PlantApi;
