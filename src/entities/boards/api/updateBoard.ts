import { httpClient } from '@/shared/api/httpClient'
import type { BoardDataDto } from './getMyBoards'

export type UpdateBoardRequest = {
  title: string
  description: string
  isImportant: boolean
}

export type UpdateBoardResponse = {
  data: BoardDataDto
}

export const updateBoard = (boardId: string, payload: UpdateBoardRequest) => {
  return httpClient.put<UpdateBoardResponse>(`/boards/${boardId}`, payload)
}

