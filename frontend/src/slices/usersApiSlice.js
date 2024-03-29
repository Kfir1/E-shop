import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

// products in users apiSlice are children of apiSlice
// instead of axios request or fetch request - use REDUX toolkit
// these request are asynchronous
export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({ // POST request (authentication) requires mutation instead of query
            query: (data) => ({ // sending data to the auth endpoint
                url: `${USERS_URL}/auth`,
                method: 'POST', // define the method used
                body: data, // the body will be data passed in
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`, // to register make POST request just to USERS_URL
                method: 'POST', // define the method used
                body: data, // send data that's in the body
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
            }),
        }),
        profile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data,
            }),
        }),
        getUsers: builder.query({
            query: () => ({
                url: USERS_URL,  // can write with or without backticks `${USERS_URL}`
                method: 'GET',  // GET by default  
            }),
            providesTags: ['Users'], // this will ensure no need to reload page after deleting user, will remove user from cache
            keepUnusedDataFor: 5,
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
                method: 'DELETE',
            }),
        }),
        getUserDetails: builder.query({ // get user details for the page
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
                // GET by default
            }),
            keepUnusedDataFor: 5,
        }),
        updateUser: builder.mutation({ // to update user details
            query: (data) => ({ // passing all data - it has userId in it. can pass userId also but if other data needed in like in UserEditScreen it will not be available
                url: `${USERS_URL}/${data.userId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Users'],
        }),
    }),
});

export const {
       useLoginMutation,
       useLogoutMutation,
       useRegisterMutation,
       useProfileMutation,
       useGetUsersQuery,
       useDeleteUserMutation,
       useGetUserDetailsQuery,
       useUpdateUserMutation,
     } = usersApiSlice;

