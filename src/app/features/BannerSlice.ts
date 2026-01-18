
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IBanner } from "../../../type";

export const BannerApi = createApi({
    reducerPath: "BannerApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    tagTypes: ["Banners"],
    endpoints: (builder) => ({
        getBanners: builder.query<IBanner[], void>({
            query: () => "/banners",
            providesTags: ["Banners"],
        }),
        addBanner: builder.mutation<IBanner, Partial<IBanner>>({
            query: (body) => ({
                url: "/banners",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Banners"],
        }),
        updateBanner: builder.mutation<
            IBanner,
            { id: string; data: Partial<IBanner> }
        >({
            query: ({ id, data }) => ({
                url: `/banners?id=${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Banners"],
        }),
        deleteBanner: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/banners?id=${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Banners"],
        }),
    }),
});

export const {
    useGetBannersQuery,
    useAddBannerMutation,
    useUpdateBannerMutation,
    useDeleteBannerMutation,
} = BannerApi;
