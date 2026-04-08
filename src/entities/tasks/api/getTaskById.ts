import { axiosClient } from '@/shared/api/axiosClient'
import type { TaskDataDto } from './getTasksByBoardId'

export type GetTaskByIdResponse = {
  data: TaskDataDto
}

export const getTaskById = (boardId: string, taskId: string) => {
  return axiosClient
    .get<GetTaskByIdResponse>(`/boards/${boardId}/tasks/${taskId}`)
    .then((res) => res.data)
}

