import { axiosClient } from '@/shared/api/axiosClient'

export const deleteTask = (boardId: string, taskId: string): Promise<void> => {
  return axiosClient.delete<void>(`/boards/${boardId}/tasks/${taskId}`).then(() => undefined)
}

