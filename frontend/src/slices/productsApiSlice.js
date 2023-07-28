import { PRODUCTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

// instead of axios request or fetch request - use REDUX toolkit
// these request are asynchronous
export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: PRODUCTS_URL,
            }),
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
    }),
});

export const {
     useGetProductsQuery,
     useGetProductDetailsQuery,
     useCreateProductMutation,
     } = productsApiSlice;
