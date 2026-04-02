import { httpClient } from '@/shared/api/httpClient'

export const deleteTask = (boardId: string, taskId: string): Promise<void> => {
  return httpClient.delete<void>(`/boards/${boardId}/tasks/${taskId}`)
}

