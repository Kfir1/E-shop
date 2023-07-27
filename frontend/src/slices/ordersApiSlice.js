import { apiSlice } from './apiSlice'; // apiSlice is parent for productApiSlice, usersApiSlice, orderApiSlice
import { ORDERS_URL, PAYPAL_URL } from '../constants'; // order URL from constants, PAYPAL_URL to get client id from backend

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
                // no need for method definition bacause it is GET by default
            }),
            keepUnusedDataFor: 5  // keep data for 5 seconds
        }),
        payOrder: builder.mutation({
            // need to destructure ({orderId, details}) and not pass it directly (orderId, details)
            query: ({orderId, details}) =>({
                url: `${ORDERS_URL}/${orderId}/pay`,
                method: 'PUT',
                body: { ...details }
            }),
        }),
        getPayPalClientId: builder.query({
            query: () => ({
                url: PAYPAL_URL,
            }),
            keepUnusedDataFor: 5
        }),
        getMyOrders: builder.query({
            query: () => ({
                // url route from ordersApiSlice
                url: `${ORDERS_URL}/mine`,
            }),
            keepUnusedDataFor: 5
        }),
        getOrders: builder.query({
            query: () => ({
                url: ORDERS_URL,
                // GET request by default
            }),
            keepUnusedDataFor: 5
        })
    }),
}); 


// use    CreateOrder   Mutation - adding to CreateOrder 
export const {
     useCreateOrderMutation,
     useGetOrderDetailsQuery,
     usePayOrderMutation,
     useGetPayPalClientIdQuery,
     useGetMyOrdersQuery,
     useGetOrdersQuery,
    } = ordersApiSlice;