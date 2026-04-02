import { httpClient } from '@/shared/api/httpClient'
import type { BoardDataDto } from './getMyBoards'

export type CreateBoardRequest = {
  title: string
  description: string
}

export type CreateBoardResponse = {
  data: BoardDataDto
}

export const createBoard = (payload: CreateBoardRequest) => {
  return httpClient.post<CreateBoardResponse>('/boards', payload)
}

