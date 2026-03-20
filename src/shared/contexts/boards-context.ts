import { createContext } from 'react'
import type { LocalBoard } from '@/shared/mocks/taskflowData'

export type BoardsContextValue = {
  boards: LocalBoard[]
  addBoard: (title: string) => void
  getBoardById: (boardId: string) => LocalBoard | undefined
  updateBoardTitle: (boardId: string, title: string) => void
  updateBoardDescription: (boardId: string, description: string) => void
}

export const BoardsContext = createContext<BoardsContextValue | null>(null)
