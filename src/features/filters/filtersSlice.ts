import { createSlice} from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type FiltersState = {
  genreId: number | null
  year: number | null
  ratingMin: number | null
  ratingMax: number | null
}

const initialState: FiltersState = {
  genreId: null,
  year: null,
  ratingMin: null,
  ratingMax: null,
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setGenreId(state, action: PayloadAction<number | null>) {
      state.genreId = action.payload
    },
    setYear(state, action: PayloadAction<number | null>) {
      state.year = action.payload
    },
    setRatingMin(state, action: PayloadAction<number | null>) {
      state.ratingMin = action.payload
    },
    setRatingMax(state, action: PayloadAction<number | null>) {
      state.ratingMax = action.payload
    },
    resetFilters() {
      return initialState
    },
  },
})

export const { setGenreId, setYear, setRatingMin, setRatingMax, resetFilters } = filtersSlice.actions
export default filtersSlice.reducer