import type { RootState } from '@/app/store/store'

export const selectBoards = (state: RootState) => state.boards.items
export const selectBoardsLoading = (state: RootState) => state.boards.isLoading
export const selectBoardsMutating = (state: RootState) => state.boards.isMutating
export const selectBoardsError = (state: RootState) => state.boards.error
export const selectBoardById = (boardId: string) => (state: RootState) => 
  state.boards.items.find((b) => b.id === boardId)