import { httpClient } from '@/shared/api/httpClient'
import type { TaskDataDto } from './getTasksByBoardId'

export type UpdateTaskRequest = {
  title: string
  description?: string
  status?: number
  priority?: number
  startDate?: string
  deadline?: string
}

export type UpdateTaskResponse = {
  data: TaskDataDto
}

export const updateTask = (boardId: string, taskId: string, payload: UpdateTaskRequest) => {
  return httpClient.put<UpdateTaskResponse>(`/boards/${boardId}/tasks/${taskId}`, payload)
}

