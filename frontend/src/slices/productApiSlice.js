import { PRODUCTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

// instead of axios request or fetch request - use REDUX toolkit
export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: PRODUCTS_URL,
            }),
            keepUnusedDataFor: 5
        })
    }),
});

export const { useGetProductsQuery } = productsApiSlice;