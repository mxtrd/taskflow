import { axiosClient } from '@/shared/api/axiosClient'
import type { TaskDataDto } from './getTasksByBoardId'

export type CreateTaskRequest = {
  title: string
}

export type CreateTaskResponse = {
  data: TaskDataDto
}

export const createTask = (boardId: string, payload: CreateTaskRequest) => {
  return axiosClient
    .post<CreateTaskResponse>(`/boards/${boardId}/tasks`, payload)
    .then((res) => res.data)
}

