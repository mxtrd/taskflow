import type { RootState } from '@/app/store/store'

export const selectTasksLoading = (state: RootState) => state.tasks.isLoading
export const selectTasksError = (state: RootState) => state.tasks.error
export const selectTasksByBoardId = (boardId: string) => (state: RootState) =>
  state.tasks.byBoardId[boardId] ?? []
export const selectTaskById = (boardId: string, taskId: string) => (state: RootState) =>
  (state.tasks.byBoardId[boardId] ?? []).find((task) => task.id === taskId)
