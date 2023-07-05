import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

// instead of axios request or fetch request - use REDUX toolkit
// these request are asynchronous
export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({ // POST request (authentication) requires mutation instead of query
            query: (data) => ({ // sending data to the auth endpoint
                url: USERS_URL/auth,
                method: 'POST', // define the method used
                body: data, // the body will be data passed in
            }),
        }),
    }),
});

export const { useLoginMutation } = usersApiSlice;
