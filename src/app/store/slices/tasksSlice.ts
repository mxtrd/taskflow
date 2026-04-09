import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { LocalTask } from '@/shared/mocks/taskflowData'
import {
  createTaskThunk,
  deleteAllTasksForBoardThunk,
  deleteTaskThunk,
  fetchTaskByIdThunk,
  fetchTasksByBoardThunk,
  updateTaskThunk,
} from '@/app/store/thunks/tasksThunks'

type TasksByBoardId = Record<string, LocalTask[]>

type TasksState = {
  byBoardId: TasksByBoardId
  isLoading: boolean
  isMutating: boolean
  error: string | null
  isOfflineSeeded: boolean
}

const initialState: TasksState = {
  byBoardId: {},
  isLoading: false,
  isMutating: false,
  error: null,
  isOfflineSeeded: false,
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasksForBoard(
      state,
      action: PayloadAction<{ boardId: string, tasks: LocalTask[] }>
    ) {
      state.byBoardId[action.payload.boardId] = action.payload.tasks
    },
    markTasksOfflineSeeded(state) {
      state.isOfflineSeeded = true
    },
    resetTasks(state) {
      state.byBoardId = {}
      state.error = null
      state.isLoading = false
      state.isMutating = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksByBoardThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTasksByBoardThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.byBoardId[action.meta.arg.boardId] = action.payload
      })
      .addCase(fetchTasksByBoardThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Failed to load tasks'
      })

      .addCase(fetchTaskByIdThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTaskByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false
        const { boardId } = action.meta.arg
        const list = state.byBoardId[boardId] ?? []
        const index = list.findIndex((task) => task.id === action.payload.id)
        if (index === -1) {
          state.byBoardId[boardId] = [action.payload, ...list]
          return
        }
        const next = [...list]
        next[index] = action.payload
        state.byBoardId[boardId] = next
      })
      .addCase(fetchTaskByIdThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Failed to load task details'
      })

      .addCase(createTaskThunk.pending, (state) => {
        state.isMutating = true
        state.error = null
      })
      .addCase(createTaskThunk.fulfilled, (state, action) => {
        state.isMutating = false
        const { boardId } = action.meta.arg
        state.byBoardId[boardId] = [action.payload, ...(state.byBoardId[boardId] ?? [])]
      })
      .addCase(createTaskThunk.rejected, (state, action) => {
        state.isMutating = false
        state.error = action.payload ?? 'Failed to create task'
      })

      .addCase(updateTaskThunk.pending, (state) => {
        state.isMutating = true
        state.error = null
      })
      .addCase(updateTaskThunk.fulfilled, (state, action) => {
        state.isMutating = false
        const { boardId } = action.meta.arg
        const list = state.byBoardId[boardId] ?? []
        const index = list.findIndex((task) => task.id === action.payload.id)
        if (index === -1) {
          state.byBoardId[boardId] = [action.payload, ...list]
          return
        }
        const next = [...list]
        next[index] = action.payload
        state.byBoardId[boardId] = next
      })
      .addCase(updateTaskThunk.rejected, (state, action) => {
        state.isMutating = false
        state.error = action.payload ?? 'Failed to update task'
      })

      .addCase(deleteTaskThunk.pending, (state) => {
        state.isMutating = true
        state.error = null
      })
      .addCase(deleteTaskThunk.fulfilled, (state, action) => {
        state.isMutating = false
        const { boardId, taskId } = action.payload
        state.byBoardId[boardId] = (state.byBoardId[boardId] ?? []).filter((task) => task.id !== taskId)
      })
      .addCase(deleteTaskThunk.rejected, (state, action) => {
        state.isMutating = false
        state.error = action.payload ?? 'Failed to delete task'
      })

      .addCase(deleteAllTasksForBoardThunk.pending, (state) => {
        state.isMutating = true
        state.error = null
      })
      .addCase(deleteAllTasksForBoardThunk.fulfilled, (state, action) => {
        state.isMutating = false
        state.byBoardId[action.payload.boardId] = []
      })
      .addCase(deleteAllTasksForBoardThunk.rejected, (state) => {
        state.isMutating = false
        state.error = 'Failed to delete one or more tasks'
      })
  },
})

export const { setTasksForBoard, markTasksOfflineSeeded, resetTasks } = tasksSlice.actions
export default tasksSlice.reducer