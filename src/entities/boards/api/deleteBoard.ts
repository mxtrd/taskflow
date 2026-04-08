import { axiosClient } from '@/shared/api/axiosClient'

export const deleteBoard = async (boardId: string): Promise<void> => {
  await axiosClient.delete(`/boards/${boardId}`)
}

