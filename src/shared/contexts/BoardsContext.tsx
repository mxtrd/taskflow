import { useState, useEffect, type ReactNode } from 'react'
import { mockBoards, type LocalBoard } from '@/shared/mocks/taskflowData'
import { BOARDS_STORAGE_KEY } from '@/shared/lib/taskflow-storage'
import { BoardsContext } from './boards-context'

export const BoardsProvider = ({ children }: { children: ReactNode }) => { 
  const [boards, setBoards] = useState<LocalBoard[]>(() => {
    const savedBoards = localStorage.getItem(BOARDS_STORAGE_KEY)
    if(savedBoards) {
      return JSON.parse(savedBoards) as LocalBoard[]
    }

    return mockBoards
  })

  useEffect(() => {
    localStorage.setItem(BOARDS_STORAGE_KEY, JSON.stringify(boards))
  }, [boards])

  const addBoard = (title: string) => {
    const normalizedTitle = title.trim()
    if(!normalizedTitle) return

    const newBoard: LocalBoard = {
      id: crypto?.randomUUID?.() ?? Date.now().toString(),
      title: normalizedTitle,
      description: '',
    }
    // functional state update (функциональное обновление стейта)
    setBoards((prevBoards) => [newBoard, ...prevBoards])
  }

  const getBoardById = (boardId: string) => boards.find((board) => board.id === boardId)

  const updateBoardTitle = (boardId: string, title: string) => {
    const normalizedTitle = title.trim()

    setBoards((prevBoards) => 
      prevBoards.map((board) => 
        board.id === boardId ? {...board, title: normalizedTitle} : board
      )
    )
  }

  const updateBoardDescription = (boardId: string, description: string) => {
    const normalizedDescription = description.trim()

    setBoards((prevBoards) => 
      prevBoards.map((board) => 
        board.id === boardId ? {...board, description: normalizedDescription} : board
      )
    )
  }

  const deleteAllBoards = () => {
    setBoards([])
  }

  const deleteBoard = (boardId: string) => {
    setBoards((prevBoards) => prevBoards.filter((board) => board.id !== boardId))
  }

  const value = {
    boards,
    addBoard,
    getBoardById,
    updateBoardTitle,
    updateBoardDescription,
    deleteAllBoards,
    deleteBoard
  }

  return <BoardsContext.Provider value={value}>{children}</BoardsContext.Provider>
}

