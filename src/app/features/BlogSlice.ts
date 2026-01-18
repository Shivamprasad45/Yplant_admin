
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IBlog } from "../../../type";

export const BlogApi = createApi({
    reducerPath: "BlogApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    tagTypes: ["Blogs"],
    endpoints: (builder) => ({
        getBlogs: builder.query<IBlog[], void>({
            query: () => "/blogs",
            providesTags: ["Blogs"],
        }),
        addBlog: builder.mutation<IBlog, Partial<IBlog>>({
            query: (body) => ({
                url: "/blogs",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Blogs"],
        }),
        updateBlog: builder.mutation<
            IBlog,
            { id: string; data: Partial<IBlog> }
        >({
            query: ({ id, data }) => ({
                url: `/blogs?id=${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Blogs"],
        }),
        deleteBlog: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/blogs?id=${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Blogs"],
        }),
    }),
});

export const {
    useGetBlogsQuery,
    useAddBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
} = BlogApi;
