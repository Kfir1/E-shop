// apiSlice will be the parent to the other api slices
// fetchBaseQuery is the function that allows to make request to the backend api
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants'; 

const baseQuery = fetchBaseQuery({baseUrl: BASE_URL});

export const apiSlice = createApi({
  baseQuery,
  // tagTypes is type of data to fetch from api
  tagTypes: ['Product','Order','User'],
  endpoints: (builder) => ({}),
});

