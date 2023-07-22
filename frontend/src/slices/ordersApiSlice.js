import { apiSlice } from './apiSlice'; // apiSlice is parent for productApiSlice, usersApiSlice, orderApiSlice
import { ORDERS_URL } from '../constants'; // order URL from constants

// injecting endpoints to apiSlice.js -  endpoints: (builder) => ({}),
export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({ // first endpoint
            query: (order) => ({ // data name will be order
                url: ORDERS_URL, // url of orders from constants
                method: 'POST', 
                body: { ...order },
            }),
        }),
        getOrderDetails: builder.query({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}`,
                // no need for method bacause it is GET by default
            }),
            keepUnusedDataFor: 5  // keep data for 5 seconds
        })
    }),
}); 


// use    CreateOrder   Mutation - adding to CreateOrder 
export const {
     useCreateOrderMutation,
     useGetOrderDetailsQuery 
    } = ordersApiSlice;