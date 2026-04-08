import { configureStore } from "@reduxjs/toolkit"
import authReducer from './slices/authSlice'
import boardsReducer from './slices/boardsSlice'
import tasksReducer from './slices/tasksSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    boards: boardsReducer,
    tasks: tasksReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


