import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux-hooks'
import {
  selectBoards,
  selectBoardsError,
  selectBoardsLoading,
} from '@/app/store/selectors/boardsSelectors'
import {
  fetchMyBoardsThunk,
  createBoardThunk,
  deleteBoardThunk,
  updateBoardTitleThunk,
  updateBoardDescriptionThunk,
  deleteAllBoardsThunk,
} from '@/app/store/thunks/boardsThunks'
import { isDevOffline } from '@/shared/config/is-dev-offline'
import { mockBoards, type LocalBoard } from '@/shared/mocks/taskflowData'
import { setBoards } from '@/app/store/slices/boardsSlice'

export const useBoardsRedux = () => {
  const dispatch = useAppDispatch()
  const boards = useAppSelector(selectBoards)
  const isLoadingBoards = useAppSelector(selectBoardsLoading)
  const boardsError = useAppSelector(selectBoardsError)

  // Оффлайн-локалка для паритета
  const [offlineBoards, setOfflineBoards] = useState<LocalBoard[]>(() => structuredClone(mockBoards))

  useEffect(() => {
    if (isDevOffline) {
      dispatch(setBoards(structuredClone(mockBoards)))
      return
    }
    void dispatch(fetchMyBoardsThunk())
  }, [dispatch])

  const getBoardById = (boardId: string) => {
    if (isDevOffline) return offlineBoards.find((b) => b.id === boardId)
    return boards.find((b) => b.id === boardId)
  }

  const addBoard = (title: string) => {
    const normalized = title.trim()
    if (!normalized) return

    if (isDevOffline) {
      const id = `board-local-${crypto.randomUUID()}`
      setOfflineBoards((prev) => [{ id, title: normalized, description: '' }, ...prev])
      return
    }

    void dispatch(createBoardThunk({ title: normalized }))
  }

  const updateBoardTitle = (boardId: string, title: string) => {
    const normalized = title.trim()
    if (!normalized) return
    const current = getBoardById(boardId)
    if (!current) return

    if (isDevOffline) {
      setOfflineBoards((prev) => prev.map((b) => (b.id === boardId ? { ...b, title: normalized } : b)))
      return
    }

    void dispatch(
      updateBoardTitleThunk({
        boardId,
        title: normalized,
        description: current.description ?? '',
        isImportant: false,
      })
    )
  }

  const updateBoardDescription = (boardId: string, description: string) => {
    const normalized = description.trim()
    const current = getBoardById(boardId)
    if (!current) return

    if (isDevOffline) {
      setOfflineBoards((prev) => prev.map((b) => (b.id === boardId ? { ...b, description: normalized } : b)))
      return
    }

    void dispatch(
      updateBoardDescriptionThunk({
        boardId,
        title: current.title,
        description: normalized,
        isImportant: false,
      })
    )
  }

  const deleteBoard = (boardId: string) => {
    if (isDevOffline) {
      setOfflineBoards((prev) => prev.filter((b) => b.id !== boardId))
      return
    }
    void dispatch(deleteBoardThunk({ boardId }))
  }

  const deleteAllBoards = () => {
    if (isDevOffline) {
      setOfflineBoards([])
      return
    }
    void dispatch(deleteAllBoardsThunk())
  }

  const safeBoards = isDevOffline ? offlineBoards : boards
  const safeLoading = isDevOffline ? false : isLoadingBoards
  const safeError = isDevOffline ? null : boardsError

  return {
    boards: safeBoards,
    isLoadingBoards: safeLoading,
    boardsError: safeError,
    addBoard,
    getBoardById,
    updateBoardTitle,
    updateBoardDescription,
    deleteAllBoards,
    deleteBoard,
  }

}