import { httpClient } from '@/shared/api/httpClient'
import type { TaskDataDto } from './getTasksByBoardId'

export type GetTaskByIdResponse = {
  data: TaskDataDto
}

export const getTaskById = (boardId: string, taskId: string) => {
  return httpClient.get<GetTaskByIdResponse>(`/boards/${boardId}/tasks/${taskId}`)
}

