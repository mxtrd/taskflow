import { httpClient } from '@/shared/api/httpClient'

export type TaskAttributesDto = {
  id: string
  title: string
  description?: string
  boardId?: string
  order: number
  status: number
  priority: number
  startDate?: unknown
  deadline?: unknown
  addedAt: string
  updatedAt: string
  attachments: string[]
}

export type TaskDataDto = {
  id: string
  type: 'tasks'
  attributes: TaskAttributesDto
}

export type TasksMetaDto = {
  page: number
  pageSize: number
  totalCount: number
  pagesCount: number
}

export type GetTasksByBoardIdResponse = {
  data: TaskDataDto[]
  meta: TasksMetaDto
}

export type GetTasksByBoardIdParams = {
  pageNumber?: number
  pageSize?: number
}

export const getTasksByBoardId = (
  boardId: string,
  params: GetTasksByBoardIdParams = {}
) => {
  const pageNumber = params.pageNumber ?? 1
  const pageSize = params.pageSize ?? 20

  return httpClient.get<GetTasksByBoardIdResponse>(
    `/boards/${boardId}/tasks?pageNumber=${pageNumber}&pageSize=${pageSize}`
  )
}

