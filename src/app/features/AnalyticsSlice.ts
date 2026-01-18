import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface IPageVisit {
    path: string;
    title?: string;
    referrer?: string;
    visitedAt: string;
}

export interface IVisit {
    _id: string;
    ip: string;
    city?: string;
    region?: string;
    country?: string;
    loc?: string;
    userAgent?: string;
    browser?: string;
    os?: string;
    device?: string;
    screenResolution?: string;
    userId?: string;
    email?: string;
    visits: IPageVisit[];
    createdAt: string;
    lastActiveAt: string;
}

export const AnalyticsApi = createApi({
    reducerPath: "AnalyticsApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    tagTypes: ["Analytics"],
    endpoints: (builder) => ({
        getVisits: builder.query<IVisit[], void>({
            query: () => ({ url: "/analytics" }),
            providesTags: ["Analytics"],
        }),
        deleteVisit: builder.mutation<void, string>({
            query: (id) => ({
                url: `/analytics?id=${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Analytics"],
        }),
    }),
});

export const { useGetVisitsQuery, useDeleteVisitMutation } = AnalyticsApi;
