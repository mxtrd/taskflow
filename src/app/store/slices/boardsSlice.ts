import type { LocalBoard } from '@/shared/mocks/taskflowData'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
  fetchMyBoardsThunk,
  createBoardThunk,
  updateBoardTitleThunk,
  updateBoardDescriptionThunk,
  deleteBoardThunk,
  deleteAllBoardsThunk,
} from '@/app/store/thunks/boardsThunks'

type BoardsState = {
  items: LocalBoard[]
  isLoading: boolean
  error: string | null
  isOfflineSeeded: boolean
}

const initialState: BoardsState = {
  items: [],
  isLoading: false,
  error: null,
  isOfflineSeeded: false,
}

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    setBoards(state, action: PayloadAction<LocalBoard[]>) {
      state.items = action.payload
    },
    markBoardsOfflineSeeded(state) {
      state.isOfflineSeeded = true
    },
    resetBoards(state) {
      state.items = []
      state.error = null
      state.isLoading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBoardsThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMyBoardsThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchMyBoardsThunk.rejected, (state) => {
        state.isLoading = false
        state.error = 'Failed to load boards'
      })

      .addCase(createBoardThunk.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items]
      })
      .addCase(createBoardThunk.rejected, (state) => {
        state.error = 'Failed to create board'
      })

      .addCase(updateBoardTitleThunk.fulfilled, (state, action) => {
        state.items = state.items.map((b) => (b.id === action.payload.id ? action.payload : b))
      })
      .addCase(updateBoardTitleThunk.rejected, (state) => {
        state.error = 'Failed to update board title'
      })

      .addCase(updateBoardDescriptionThunk.fulfilled, (state, action) => {
        state.items = state.items.map((b) => (b.id === action.payload.id ? action.payload : b))
      })
      .addCase(updateBoardDescriptionThunk.rejected, (state) => {
        state.error = 'Failed to update board description'
      })

      .addCase(deleteBoardThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b.id !== action.payload)
      })
      .addCase(deleteBoardThunk.rejected, (state) => {
        state.error = 'Failed to delete board'
      })

      .addCase(deleteAllBoardsThunk.fulfilled, (state) => {
        state.items = []
      })
      .addCase(deleteAllBoardsThunk.rejected, (state) => {
        state.error = 'Failed to delete one or more boards'
      })
  },
})

export const { setBoards, markBoardsOfflineSeeded, resetBoards } = boardsSlice.actions
export default boardsSlice.reducer