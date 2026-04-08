import { useCallback, useEffect, useMemo } from 'react'
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
import { mockBoards } from '@/shared/mocks/taskflowData'
import { setBoards } from '@/app/store/slices/boardsSlice'

export const useBoardsRedux = () => {
  const dispatch = useAppDispatch()
  const boards = useAppSelector(selectBoards)
  const isLoadingBoards = useAppSelector(selectBoardsLoading)
  const boardsError = useAppSelector(selectBoardsError)

  useEffect(() => {
    if (isDevOffline) {
      if (boards.length === 0) {
        dispatch(setBoards(structuredClone(mockBoards)))
      }
      return
    }
    void dispatch(fetchMyBoardsThunk())
  }, [dispatch, boards.length])

  const getBoardById = useCallback(
    (boardId: string) => {
      if (isDevOffline) return boards.find((b) => b.id === boardId)
      return boards.find((b) => b.id === boardId)
    },
    [boards]
  )

  const addBoard = useCallback(
    (title: string) => {
      const normalized = title.trim()
      if (!normalized) return

      if (isDevOffline) {
        const id = `board-local-${crypto.randomUUID()}`
        dispatch(setBoards([{ id, title: normalized, description: '' }, ...boards]))
        return
      }

      void dispatch(createBoardThunk({ title: normalized }))
    },
    [dispatch, boards]
  )

  const updateBoardTitle = useCallback(
    (boardId: string, title: string) => {
      const normalized = title.trim()
      if (!normalized) return
      const current = getBoardById(boardId)
      if (!current) return

      if (isDevOffline) {
        dispatch(
          setBoards(boards.map((b) => (b.id === boardId ? { ...b, title: normalized } : b)))
        )
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
    },
    [boards, dispatch, getBoardById]
  )

  const updateBoardDescription = useCallback(
    (boardId: string, description: string) => {
      const normalized = description.trim()
      const current = getBoardById(boardId)
      if (!current) return

      if (isDevOffline) {
        dispatch(
          setBoards(boards.map((b) => (b.id === boardId ? { ...b, description: normalized } : b)))
        )
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
    },
    [boards, dispatch, getBoardById]
  )

  const deleteBoard = useCallback(
    (boardId: string) => {
      if (isDevOffline) {
        dispatch(setBoards(boards.filter((b) => b.id !== boardId)))
        return
      }
      void dispatch(deleteBoardThunk({ boardId }))
    },
    [boards, dispatch]
  )

  const deleteAllBoards = useCallback(() => {
    if (isDevOffline) {
      dispatch(setBoards([]))
      return
    }
    void dispatch(deleteAllBoardsThunk())
  }, [dispatch])

  const safeBoards = boards
  const safeLoading = isDevOffline ? false : isLoadingBoards
  const safeError = isDevOffline ? null : boardsError

  return useMemo(
    () => ({
      boards: safeBoards,
      isLoadingBoards: safeLoading,
      boardsError: safeError,
      addBoard,
      getBoardById,
      updateBoardTitle,
      updateBoardDescription,
      deleteAllBoards,
      deleteBoard,
    }),
    [
      safeBoards,
      safeLoading,
      safeError,
      addBoard,
      getBoardById,
      updateBoardTitle,
      updateBoardDescription,
      deleteAllBoards,
      deleteBoard,
    ]
  )

}