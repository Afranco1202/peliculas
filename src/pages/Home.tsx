import { useState, useEffect } from 'react'
import {
  useGetTrendingQuery,
  useSearchMoviesQuery,
  useGetGenresQuery,
  useDiscoverMoviesQuery,
} from '../features/api/moviesApi'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../app/store'
import MovieCard from '../components/movieCard'
import Paginator from '../components/paginator'
import {
  setGenreId,
  setYear,
  setRatingMin,
  setRatingMax,
  resetFilters,
} from '../features/filters/filtersSlice'


export default function Home() {
  const [page, setPage] = useState<number>(1)
  const [query, setQuery] = useState<string>('')
  const [search, setSearch] = useState<string>('')

  const dispatch = useDispatch()
  const filters = useSelector((s: RootState) => s.filters)
  const { data: genresData } = useGetGenresQuery()

  const isSearching = search.trim().length > 0 

  const trending = useGetTrendingQuery({ page }, { skip: isSearching })
  const searching = useSearchMoviesQuery({ query: search, page }, { skip: !isSearching })

  const hasFilters =
    !!filters.genreId ||
    !!filters.year ||
    filters.ratingMin != null ||
    filters.ratingMax != null

  const discover = useDiscoverMoviesQuery(
    {
      page,
      genreId: filters.genreId,
      year: filters.year,
      ratingMin: filters.ratingMin,
      ratingMax: filters.ratingMax,
    },
    { skip: !hasFilters }
  )

  const mode = hasFilters ? 'discover' : (isSearching ? 'search' : 'trending')

  const data =
    mode === 'discover' ? discover.data :
    mode === 'search' ? searching.data : trending.data

  const isLoading =
    mode === 'discover' ? discover.isLoading :
    mode === 'search' ? searching.isLoading : trending.isLoading

  const isError =
    mode === 'discover' ? discover.isError :
    mode === 'search' ? searching.isError : trending.isError

  const isFetching =
    mode === 'discover' ? discover.isFetching :
    mode === 'search' ? searching.isFetching : trending.isFetching

  const refetch =
    mode === 'discover' ? discover.refetch :
    mode === 'search' ? searching.refetch : trending.refetch

  const handleSearch = () => {
    const term = query.trim()
    setPage(1)
    setSearch(term)
  }

  const handleClear = () => {
    setQuery('')
    setSearch('')
    setPage(1)
  }

  useEffect(() => {
    if (hasFilters) setPage(1)
  }, [filters.genreId, filters.year, filters.ratingMin, filters.ratingMax, hasFilters])

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h1 className="text-5xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 drop-shadow-md">
          {mode === 'discover'
            ? 'Películas filtradas'
            : mode === 'search'
            ? 'Resultados de búsqueda'
            : 'Películas en Tendencia'}
        </h1>

        <div className="flex w-full sm:w-auto gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e)=> e.key === "Enter" && handleSearch() }
            placeholder="Buscar películas..."
            className="border rounded px-3 py-2 text-sm w-full sm:w-80"
          />
          <button
            onClick={handleSearch}
            className="px-3 py-2 text-sm rounded border"
            disabled={isFetching}
          >
            Buscar
          </button>
          {(isSearching || hasFilters) && (
            <button
              onClick={handleClear}
              className="px-3 py-2 text-sm rounded border"
              disabled={isFetching}
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end gap-3 mb-4">
        <div className="flex flex-col">
          <label className="text-xs mb-1">Género</label>
          <select
            value={filters.genreId ?? ''}
            onChange={(e) => dispatch(setGenreId(e.target.value ? Number(e.target.value) : null))}
            className="border rounded px-2 py-2 text-sm min-w-48"
          >
            <option value="">Todos</option>
            {genresData?.genres.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs mb-1">Año</label>
          <input
            type="number"
            placeholder="AAAA"
            value={filters.year ?? ''}
            onChange={(e) => dispatch(setYear(e.target.value ? Number(e.target.value) : null))}
            className="border rounded px-2 py-2 text-sm w-24"
            min={1900}
            max={new Date().getFullYear()}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs mb-1">Rango min</label>
          <input
            type="number"
            placeholder="0.0"
            min={0}
            max={10}
            step={0.1}
            value={filters.ratingMin ?? ''}
            onChange={(e) => dispatch(setRatingMin(e.target.value ? Number(e.target.value) : null))}
            className="border rounded px-2 py-2 text-sm w-24"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs mb-1">Rango max</label>
          <input
            type="number"
            placeholder="10"
            min={0}
            max={10}
            step={0.1}
            value={filters.ratingMax ?? ''}
            onChange={(e) => dispatch(setRatingMax(e.target.value ? Number(e.target.value) : null))}
            className="border rounded px-2 py-2 text-sm w-24"
          />
        </div>

        <button
          onClick={() => { dispatch(resetFilters()); setPage(1) }}
          className="px-3 py-2 text-sm rounded border self-start md:self-auto"
          disabled={isFetching}
        >
          Limpiar filtros
        </button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden border">
              <div className="w-full aspect-[2/3] animate-pulse bg-zinc-200 dark:bg-zinc-800" />
              <div className="p-2">
                <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded mb-2" />
                <div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && !isLoading && (
        <div className="p-6 border rounded-lg text-center">
          <p className="mb-3">
            {mode === 'discover'
              ? 'No fue posible cargar los resultados con filtros.'
              : mode === 'search'
              ? 'No fue posible cargar los resultados.'
              : 'Hubo un problema al cargar las tendencias.'}
          </p>
          <button onClick={() => refetch()} className="px-3 py-1 rounded border">
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {data?.total_results === 0 && (
            <div className="p-6 border rounded-lg text-center">
              {mode === 'discover'
                ? 'No se encontraron películas con esos filtros.'
                : `No se encontraron películas para “${search}”.`}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data?.results.slice(0, 18).map((m) => (
              <MovieCard
                key={m.id}
                id={m.id}
                title={m.title}
                posterPath={m.poster_path}
                voteAverage={m.vote_average}
                releaseDate={m.release_date}
              />
            ))}
          </div>

          <Paginator
            page={data?.page ?? 1}
            totalPages={data?.total_pages ?? 1}
            isFetching={isFetching}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(data?.total_pages ?? 1, p + 1))}
          />
        </>
      )}
    </div>
  )
}
