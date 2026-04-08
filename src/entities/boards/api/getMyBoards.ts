import { axiosClient } from '@/shared/api/axiosClient'

export type BoardAttributesDto = {
  title: string
  description: string
  isImportant: boolean
  order: number
  addedAt: string
  updatedAt: string
  images: {
    main: unknown
  }
}

export type BoardDataDto = {
  id: string
  type: 'boards'
  attributes: BoardAttributesDto
}

export type GetMyBoardsResponse = {
  data: BoardDataDto[]
}

export const getMyBoards = async () => {
  const res = await axiosClient.get<GetMyBoardsResponse>('/boards/my')
  return res.data
}

