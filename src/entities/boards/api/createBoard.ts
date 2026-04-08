import { axiosClient } from '@/shared/api/axiosClient'
import type { BoardDataDto } from './getMyBoards'

export type CreateBoardRequest = {
  title: string
  description: string
}

export type CreateBoardResponse = {
  data: BoardDataDto
}

export const createBoard = async (payload: CreateBoardRequest) => {
  const res = await axiosClient.post<CreateBoardResponse>('/boards', payload)
  return res.data
}

