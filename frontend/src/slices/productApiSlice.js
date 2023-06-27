import { PRODUCTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

// instead of axios request or fetch request - use REDUX toolkit
export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: PRODUCTS_URL,
            }),
            keepUnusedDataFor: 5,
        }),
        getProductsDetails: builder.query({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}` ,
            }),
        })
    }),
});

export const { useGetProductsQuery, useGetProductsDetailsQuery } = productsApiSlice;
