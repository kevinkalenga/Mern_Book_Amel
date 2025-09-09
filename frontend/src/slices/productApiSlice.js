import { PRODUCTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";


export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({keyword, pageNumber}) => ({
                url:PRODUCTS_URL,
                params: {
                    keyword,
                    pageNumber
                }
            }),
            providesTags: ['Product'],
            keepUnusedDataFor: 5
        }),
        getProductDetails: builder.query({
            query: (productId) => ({
                url:`${PRODUCTS_URL}/${productId}`
                
            }),
            keepUnusedDataFor: 5
        }),
        createProduct: builder.mutation({
            query: () => ({
                url:PRODUCTS_URL,
                method: 'POST'
                
            }),
             invalidatesTags: ['Product'],
        }),
        updateProduct: builder.mutation({
            query: (data) => ({
                url:`${PRODUCTS_URL}/${data.productId}`,
                method: 'PUT'
                
            }),
             invalidatesTags: ['Product'],
        }),
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url:`${PRODUCTS_URL}/${productId}`,
                method: 'DELETE'
                
            }),
             invalidatesTags: ['Product'],
        }),
        createReview: builder.mutation({
            query: (data) => ({
                url:`${PRODUCTS_URL}/${data.productId}/reviews`,
                method: 'POST',
                body: data
                
            }),
             invalidatesTags: ['Product'],
        }),
    })
})

export const {
   useGetProductsQuery,
   useCreateProductMutation,
   useGetProductDetailsQuery,
   useUpdateProductMutation,
   useDeleteProductMutation,
   useCreateReviewMutation,
} = productApiSlice
