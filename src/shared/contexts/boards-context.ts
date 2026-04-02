import { createContext } from 'react'
import type { LocalBoard } from '@/shared/mocks/taskflowData'

export type BoardsContextValue = {
  boards: LocalBoard[]
  isLoadingBoards: boolean
  boardsError: string | null
  addBoard: (title: string) => void
  getBoardById: (boardId: string) => LocalBoard | undefined
  updateBoardTitle: (boardId: string, title: string) => void
  updateBoardDescription: (boardId: string, description: string) => void
  deleteAllBoards: () => void
  deleteBoard: (boardId: string) => void
}

export const BoardsContext = createContext<BoardsContextValue | null>(null)
