import { useState, useEffect, type ReactNode } from 'react'
import type { LocalBoard } from '@/shared/mocks/taskflowData'
import { getMyBoards } from '@/entities/boards/api/getMyBoards'
import { createBoard } from '@/entities/boards/api/createBoard'
import { updateBoard } from '@/entities/boards/api/updateBoard'
import { deleteBoard as deleteBoardApi } from '@/entities/boards/api/deleteBoard'
import { BoardsContext } from './boards-context'

export const BoardsProvider = ({ children }: { children: ReactNode }) => { 
  const [boards, setBoards] = useState<LocalBoard[]>([])
  const [isImportantById, setIsImportantById] = useState<Record<string, boolean>>({})
  const [isLoadingBoards, setIsLoadingBoards] = useState(true)
  const [boardsError, setBoardsError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    getMyBoards()
      .then(({ data }) => {
        if (!isMounted) return

        const nextBoards: LocalBoard[] = data.map((b) => ({
          id: b.id,
          title: b.attributes.title,
          description: b.attributes.description,
        }))
        setBoards(nextBoards)
        setIsImportantById(
          data.reduce<Record<string, boolean>>((acc, b) => {
            acc[b.id] = Boolean(b.attributes.isImportant)
            return acc
          }, {})
        )
      })
      .catch((error) => {
        if (!isMounted) return
        setBoardsError('Failed to load boards')
        console.error('Failed to load my boards:', error)
      })
      .finally(() => {
        if (!isMounted) return
        setIsLoadingBoards(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const addBoard = (title: string) => {
    const normalizedTitle = title.trim()
    if(!normalizedTitle) return

    void (async () => {
      try {
        setBoardsError(null)
        const res = await createBoard({ title: normalizedTitle, description: '' })
        const b = res.data

        const newBoard: LocalBoard = {
          id: b.id,
          title: b.attributes.title,
          description: b.attributes.description,
        }

        setBoards((prevBoards) => [newBoard, ...prevBoards])
        setIsImportantById((prev) => ({ ...prev, [b.id]: Boolean(b.attributes.isImportant) }))
      } catch (error) {
        setBoardsError('Failed to create board')
        console.error('Failed to create board:', error)
      }
    })()
  }

  const getBoardById = (boardId: string) => boards.find((board) => board.id === boardId)

  const updateBoardTitle = (boardId: string, title: string) => {
    const normalizedTitle = title.trim()

    const current = boards.find((b) => b.id === boardId)
    if (!current) return

    const isImportant = Boolean(isImportantById[boardId])

    void (async () => {
      try {
        setBoardsError(null)
        const res = await updateBoard(boardId, {
          title: normalizedTitle,
          description: current.description ?? '',
          isImportant,
        })

        const updated = res.data
        setBoards((prevBoards) =>
          prevBoards.map((b) =>
            b.id === boardId
              ? { ...b, title: updated.attributes.title, description: updated.attributes.description }
              : b
          )
        )
        setIsImportantById((prev) => ({ ...prev, [boardId]: Boolean(updated.attributes.isImportant) }))
      } catch (error) {
        setBoardsError('Failed to update board title')
        console.error('Failed to update board title:', error)
      }
    })()
  }

  const updateBoardDescription = (boardId: string, description: string) => {
    const normalizedDescription = description.trim()

    const current = boards.find((b) => b.id === boardId)
    if (!current) return

    const isImportant = Boolean(isImportantById[boardId])

    void (async () => {
      try {
        setBoardsError(null)
        const res = await updateBoard(boardId, {
          title: current.title,
          description: normalizedDescription,
          isImportant,
        })

        const updated = res.data
        setBoards((prevBoards) =>
          prevBoards.map((b) =>
            b.id === boardId
              ? { ...b, title: updated.attributes.title, description: updated.attributes.description }
              : b
          )
        )
        setIsImportantById((prev) => ({ ...prev, [boardId]: Boolean(updated.attributes.isImportant) }))
      } catch (error) {
        setBoardsError('Failed to update board description')
        console.error('Failed to update board description:', error)
      }
    })()
  }

  const deleteAllBoards = () => {
    const ids = boards.map((b) => b.id)

    void (async () => {
      setBoardsError(null)
      for (const id of ids) {
        try {
          await deleteBoardApi(id)
        } catch (error) {
          setBoardsError('Failed to delete one or more boards')
          console.error(`Failed to delete board ${id}:`, error)
        }
      }

      setBoards([])
      setIsImportantById({})
    })()
  }

  const deleteBoard = (boardId: string) => {
    void (async () => {
      try {
        setBoardsError(null)
        await deleteBoardApi(boardId)
        setBoards((prevBoards) => prevBoards.filter((board) => board.id !== boardId))
        setIsImportantById((prev) => {
          if (!(boardId in prev)) return prev
          const next = { ...prev }
          delete next[boardId]
          return next
        })
      } catch (error) {
        setBoardsError('Failed to delete board')
        console.error('Failed to delete board:', error)
      }
    })()
  }

  const value = {
    boards,
    isLoadingBoards,
    boardsError,
    addBoard,
    getBoardById,
    updateBoardTitle,
    updateBoardDescription,
    deleteAllBoards,
    deleteBoard
  }

  return <BoardsContext.Provider value={value}>{children}</BoardsContext.Provider>
}

