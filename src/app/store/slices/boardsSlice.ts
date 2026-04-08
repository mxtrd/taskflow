import type { LocalBoard } from '@/shared/mocks/taskflowData'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type BoardsState = {
  items: LocalBoard[]
  isLoading: boolean
  error: string | null
}

const initialState: BoardsState = {
  items: [],
  isLoading: false,
  error: null
}

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    setBoardsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setBoardsError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    setBoards(state, action: PayloadAction<LocalBoard[]>) {
      state.items = action.payload
    },
    resetBoards(state) {
      state.items = []
      state.error = null
      state.isLoading = false
    },
  }
})

export const { setBoardsLoading, setBoardsError, setBoards, resetBoards } = boardsSlice.actions
export default boardsSlice.reducer