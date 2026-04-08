import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { LocalTask } from '@/shared/mocks/taskflowData'

type TasksByBoardId = Record<string, LocalTask[]>

type TasksState = {
  byBoardId: TasksByBoardId
  isLoading: boolean
  error: string | null
}

const initialState: TasksState = {
  byBoardId: {},
  isLoading: false,
  error: null,
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasksLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setTasksError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    setTasksForBoard(
      state,
      action: PayloadAction<{ boardId: string, tasks: LocalTask[] }>
    ) {
      state.byBoardId[action.payload.boardId] = action.payload.tasks
    },
    resetTasks(state) {
      state.byBoardId = {}
      state.error = null
      state.isLoading = false
    }
  }
})

export const { setTasksLoading,  setTasksError, setTasksForBoard, resetTasks } = tasksSlice.actions
export default tasksSlice.reducer