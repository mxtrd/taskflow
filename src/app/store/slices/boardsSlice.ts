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
  isMutating: boolean
  error: string | null
  isOfflineSeeded: boolean
}

const initialState: BoardsState = {
  items: [],
  isLoading: false,
  isMutating: false,
  error: null,
  isOfflineSeeded: false,
}

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  //reducers для локальных досок, extraReducers для thunks
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
      state.isMutating = false
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
      .addCase(fetchMyBoardsThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Failed to load boards'
      })

      .addCase(createBoardThunk.pending, (state) => {
        state.isMutating = true
        state.error = null
      })
      .addCase(createBoardThunk.fulfilled, (state, action) => {
        state.isMutating = false
        state.items = [action.payload, ...state.items]
      })
      .addCase(createBoardThunk.rejected, (state, action) => {
        state.isMutating = false
        state.error = action.payload ?? 'Failed to create board'
      })

      .addCase(updateBoardTitleThunk.pending, (state) => {
        state.isMutating = true
        state.error = null
      })
      .addCase(updateBoardTitleThunk.fulfilled, (state, action) => {
        state.isMutating = false
        state.items = state.items.map((b) => (b.id === action.payload.id ? action.payload : b))
      })
      .addCase(updateBoardTitleThunk.rejected, (state, action) => {
        state.isMutating = false
        state.error = action.payload ?? 'Failed to update board title'
      })

      .addCase(updateBoardDescriptionThunk.pending, (state) => {
        state.isMutating = true
        state.error = null
      })
      .addCase(updateBoardDescriptionThunk.fulfilled, (state, action) => {
        state.isMutating = false
        state.items = state.items.map((b) => (b.id === action.payload.id ? action.payload : b))
      })
      .addCase(updateBoardDescriptionThunk.rejected, (state, action) => {
        state.isMutating = false
        state.error = action.payload ?? 'Failed to update board description'
      })

      .addCase(deleteBoardThunk.pending, (state) => {
        state.isMutating = true
        state.error = null
      })
      .addCase(deleteBoardThunk.fulfilled, (state, action) => {
        state.isMutating = false
        state.items = state.items.filter((b) => b.id !== action.payload)
      })
      .addCase(deleteBoardThunk.rejected, (state, action) => {
        state.isMutating = false
        state.error = action.payload ?? 'Failed to delete board'
      })

      .addCase(deleteAllBoardsThunk.pending, (state) => {
        state.isMutating = true
        state.error = null
      })
      .addCase(deleteAllBoardsThunk.fulfilled, (state) => {
        state.isMutating = false
        state.items = []
      })
      .addCase(deleteAllBoardsThunk.rejected, (state) => {
        state.isMutating = false
        state.error = 'Failed to delete one or more boards'
      })
  },
})

export const { setBoards, markBoardsOfflineSeeded, resetBoards } = boardsSlice.actions
export default boardsSlice.reducer