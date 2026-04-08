import { axiosClient } from '@/shared/api/axiosClient'
import type { BoardDataDto } from './getMyBoards'

export type UpdateBoardRequest = {
  title: string
  description: string
  isImportant: boolean
}

export type UpdateBoardResponse = {
  data: BoardDataDto
}

export const updateBoard = async (boardId: string, payload: UpdateBoardRequest) => {
  const res = await axiosClient.put<UpdateBoardResponse>(`/boards/${boardId}`, payload)
  return res.data
}


