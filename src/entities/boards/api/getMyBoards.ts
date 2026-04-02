import { httpClient } from '@/shared/api/httpClient'

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

export const getMyBoards = () => {
  return httpClient.get<GetMyBoardsResponse>('/boards/my')
}

