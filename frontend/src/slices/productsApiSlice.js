import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

// instead of axios request or fetch request - use REDUX toolkit
// these request are asynchronous
export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({ pageNumber }) => ({ // destructure with pageNumber
                url: PRODUCTS_URL,
                params: { // need to pass in the pageNumber to useGetProductsQuery(pageNumber) on HomeScreen 
                    pageNumber,
                },
            }),
            providesTags: ['Products'], // add providesTags to prevent the case of need to refresh the page 
            keepUnusedDataFor: 5,
        }),
        getProductDetails: builder.query({
            query: (productId) => ({ // pass in productId
                url: `${PRODUCTS_URL}/${productId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        createProduct: builder.mutation({
            query: () => ({
                url: PRODUCTS_URL,
                method: 'POST',

            }),
            // invalidatesTags will stop it from being cached, to have fresh data
            // it prevent the need to reload the page after clicking create new product
            invalidatesTags: ['Product'], 
        }),
        updateProduct: builder.mutation({
            query: (data) => ({ // query will take all the data 
                url: `${PRODUCTS_URL}/${data.productId}`, // get the productId from data
                method: 'PUT', // put cause updating / changing data
                body: data,
            }),
            invalidatesTags: ['Products'], // clear the cache
        }),
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: `${UPLOAD_URL}`,
                method: 'POST',
                body: data,
            }),
        }),
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
                method: 'DELETE',
            }),
            providesTags: ['Product'],
        }),
        createReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}/reviews`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),
    }),
});

export const {
     useGetProductsQuery,
     useGetProductDetailsQuery,
     useCreateProductMutation,
     useUpdateProductMutation,
     useUploadProductImageMutation,
     useDeleteProductMutation,
     useCreateReviewMutation, // no need for a query to get the reviews cause it is included in the product data which is already got
     } = productsApiSlice;
