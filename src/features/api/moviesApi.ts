import { apiSlice } from './apiSlice'

export type Movie = {
  id: number
  title: string
  poster_path: string | null
  vote_average: number
  release_date?: string
}

type PagedResponse<T> = {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

type Genre = { id: number; name: string }

type MovieDetails = {
  id: number
  title: string
  overview: string | null
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  release_date?: string
  runtime?: number
  genres?: Genre[]
  production_countries?: { iso_3166_1: string; name: string }[]
  spoken_languages?: { iso_639_1: string; name?: string; english_name?: string }[]
}

type Credits = {
  cast: Array<{
    id: number
    name: string
    character?: string
    profile_path: string | null
  }>
  crew: Array<{
    id: number
    name: string
    job?: string
    department?: string
    profile_path: string | null
  }>
}



type MovieFullResponse = MovieDetails & {
  credits?: Credits
}



export const moviesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTrending: builder.query<PagedResponse<Movie>, { page?: number }>({
      query: ({ page = 1 } = {}) => `/trending/movie/week?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              { type: 'Movies', id: 'TRENDING' },
              ...result.results.map((m) => ({ type: 'Movie' as const, id: m.id })),
            ]
          : [{ type: 'Movies', id: 'TRENDING' }],
    }),
    searchMovies: builder.query<PagedResponse<Movie>, { query: string; page?: number }>({
      query: ({ query, page = 1 }) =>
        `/search/movie?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`,
      providesTags: (result) =>
        result
          ? [
              { type: 'Movies', id: 'SEARCH' },
              ...result.results.map((m) => ({ type: 'Movie' as const, id: m.id })),
            ]
          : [{ type: 'Movies', id: 'SEARCH' }],
    }),
    getGenres: builder.query<{ genres: { id: number; name: string }[] }, void>({
      query: () => `/genre/movie/list?&language=es-ES`,
      providesTags: [{ type: 'Movies', id: 'GENRES' }],
    }),


    discoverMovies: builder.query<
    PagedResponse<Movie>,
    {
      page?: number;
      genreId?: number | null;
      year?: number | null;
      ratingMin?: number | null;
      ratingMax?: number | null;
    }
    >({
    query: ({ page = 1, genreId, year, ratingMin, ratingMax }) => {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('include_adult', 'false')
      params.set('sort_by', 'popularity.desc')

      if (genreId) params.set('with_genres', String(genreId))
      if (year) params.set('primary_release_year', String(year))
      if (ratingMin != null) params.set('vote_average.gte', String(ratingMin))
      if (ratingMax != null) params.set('vote_average.lte', String(ratingMax))

      return `/discover/movie?${params.toString()}`
    },
    providesTags: (result) =>
      result
        ? [
            { type: 'Movies', id: 'DISCOVER' },
            ...result.results.map((m) => ({ type: 'Movie' as const, id: m.id })),
          ]
        : [{ type: 'Movies', id: 'DISCOVER' }],
  }),


  getMovieFull: builder.query<MovieFullResponse, number>({
    query: (id)=> `/movie/${id}?append_to_response=credits&language=es-ES`,
    providesTags: (_result,_err, id)=>[{type:'Movie', id}]
  }),


  }),
  overrideExisting: false,
})

export const { useGetTrendingQuery, useSearchMoviesQuery, useGetGenresQuery, useDiscoverMoviesQuery,useGetMovieFullQuery } = moviesApi
