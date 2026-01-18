// Product API with RTK Query
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product } from "../../../type";

// Define ProductApi with CRUD operations
export const ProductApi = createApi({
    reducerPath: "ProductApi",
    tagTypes: ["Products"],
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    endpoints: (builder) => ({
        // Get all products
        getAllProducts: builder.query<Product[], void>({
            query: () => ({ url: `/products` }),
            providesTags: ["Products"],
        }),

        // Get single product by ID
        getProductById: builder.query<Product, string>({
            query: (id) => ({ url: `/products?id=${id}` }),
            providesTags: ["Products"],
        }),

        // Create new product
        createProduct: builder.mutation<Product, Partial<Product>>({
            query: (product) => ({
                url: `/products`,
                method: "POST",
                body: product,
            }),
            invalidatesTags: ["Products"],
        }),

        // Update existing product
        updateProduct: builder.mutation<Product, { id: string; data: Partial<Product> }>({
            query: ({ id, data }) => ({
                url: `/products`,
                method: "PUT",
                body: { id, ...data },
            }),
            invalidatesTags: ["Products"],
        }),

        // Delete product
        deleteProduct: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/products?id=${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Products"],
        }),
    }),
});

// Export hooks for usage in functional components
export const {
    useGetAllProductsQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = ProductApi;
