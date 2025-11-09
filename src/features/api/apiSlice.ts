import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"


export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_TMDB_BASE,
    prepareHeaders: (headers) =>{
      const token = import.meta.env.VITE_TMDB_TOKEN
      if(token) headers.set('authorization', `Barer ${token}`)
        return headers
    },
  }),
    tagTypes: ['Movies', 'Movie'],
    endpoints: () => ({}),
})