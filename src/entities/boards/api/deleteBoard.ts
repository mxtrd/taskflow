import { httpClient } from '@/shared/api/httpClient'

export const deleteBoard = (boardId: string): Promise<void> => {
  return httpClient.delete<void>(`/boards/${boardId}`)
}

