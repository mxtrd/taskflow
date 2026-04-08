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
  error: string | null
  isOfflineSeeded: boolean
}

const initialState: TasksState = {
  byBoardId: {},
  isLoading: false,
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
      .addCase(fetchTasksByBoardThunk.rejected, (state) => {
        state.isLoading = false
        state.error = 'Failed to load tasks'
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
      .addCase(fetchTaskByIdThunk.rejected, (state) => {
        state.isLoading = false
        state.error = 'Failed to load task details'
      })

      .addCase(createTaskThunk.fulfilled, (state, action) => {
        const { boardId } = action.meta.arg
        state.byBoardId[boardId] = [action.payload, ...(state.byBoardId[boardId] ?? [])]
      })
      .addCase(createTaskThunk.rejected, (state) => {
        state.error = 'Failed to create task'
      })

      .addCase(updateTaskThunk.fulfilled, (state, action) => {
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
      .addCase(updateTaskThunk.rejected, (state) => {
        state.error = 'Failed to update task'
      })

      .addCase(deleteTaskThunk.fulfilled, (state, action) => {
        const { boardId, taskId } = action.payload
        state.byBoardId[boardId] = (state.byBoardId[boardId] ?? []).filter((task) => task.id !== taskId)
      })
      .addCase(deleteTaskThunk.rejected, (state) => {
        state.error = 'Failed to delete task'
      })

      .addCase(deleteAllTasksForBoardThunk.fulfilled, (state, action) => {
        state.byBoardId[action.payload.boardId] = []
      })
      .addCase(deleteAllTasksForBoardThunk.rejected, (state) => {
        state.error = 'Failed to delete one or more tasks'
      })
  },
})

export const { setTasksForBoard, markTasksOfflineSeeded, resetTasks } = tasksSlice.actions
export default tasksSlice.reducer