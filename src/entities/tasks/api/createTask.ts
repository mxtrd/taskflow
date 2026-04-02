import { httpClient } from '@/shared/api/httpClient'
import type { TaskDataDto } from './getTasksByBoardId'

export type CreateTaskRequest = {
  title: string
}

export type CreateTaskResponse = {
  data: TaskDataDto
}

export const createTask = (boardId: string, payload: CreateTaskRequest) => {
  return httpClient.post<CreateTaskResponse>(`/boards/${boardId}/tasks`, payload)
}

