import { useContext } from 'react'
import { BoardsContext } from '@/shared/contexts/boards-context'

export const useBoards = () => {
  const context = useContext(BoardsContext)
  if (!context) {
    throw new Error('useBoards must be used within BoardsProvider')
  }
  return context
}