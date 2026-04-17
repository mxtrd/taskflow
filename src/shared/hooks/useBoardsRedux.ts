import { useCallback, useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux-hooks'
import type { RootState } from '@/app/store/store'
import {
  selectBoards,
  selectBoardsError,
  selectBoardsLoading,
  selectBoardsMutating,
} from '@/app/store/selectors/boardsSelectors'
import {
  fetchMyBoardsThunk,
  createBoardThunk,
  deleteBoardThunk,
  updateBoardTitleThunk,
  updateBoardDescriptionThunk,
  deleteAllBoardsThunk,
} from '@/app/store/thunks/boardsThunks'
import { isDemoMode } from '@/shared/config/is-dev-offline'
import { mockBoards } from '@/shared/mocks/taskflowData'
import { markBoardsOfflineSeeded, setBoards } from '@/app/store/slices/boardsSlice'

export const useBoardsRedux = () => {
  const dispatch = useAppDispatch()
  const boards = useAppSelector(selectBoards)
  const isLoadingBoards = useAppSelector(selectBoardsLoading)
  const isMutatingBoards = useAppSelector(selectBoardsMutating)
  const boardsError = useAppSelector(selectBoardsError)
  const isOfflineSeeded = useAppSelector((state: RootState) => state.boards.isOfflineSeeded)

  useEffect(() => {
    if (isDemoMode) return
    void dispatch(fetchMyBoardsThunk())
  }, [dispatch])

  useEffect(() => {
    // OFFLINE-ONLY: seed local mock boards for layout/dev mode.
    if (!isDemoMode) return
    if (isOfflineSeeded) return
    dispatch(setBoards(structuredClone(mockBoards)))
    dispatch(markBoardsOfflineSeeded())
  }, [dispatch, isOfflineSeeded])

  const getBoardById = useCallback(
    (boardId: string) => boards.find((b) => b.id === boardId),
    [boards]
  )

  const addBoard = useCallback(
    (title: string) => {
      const normalized = title.trim()
      if (!normalized) return

      if (isDemoMode) {
        // OFFLINE-ONLY: local board mutation (no API request).
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

      if (isDemoMode) {
        // OFFLINE-ONLY: local board mutation (no API request).
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

      if (isDemoMode) {
        // OFFLINE-ONLY: local board mutation (no API request).
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
      if (isDemoMode) {
        // OFFLINE-ONLY: local board mutation (no API request).
        dispatch(setBoards(boards.filter((b) => b.id !== boardId)))
        return
      }
      void dispatch(deleteBoardThunk({ boardId }))
    },
    [boards, dispatch]
  )

  const deleteAllBoards = useCallback(() => {
    if (isDemoMode) {
      // OFFLINE-ONLY: local board mutation (no API request).
      dispatch(setBoards([]))
      return
    }
    void dispatch(deleteAllBoardsThunk())
  }, [dispatch])

  const safeLoading = isDemoMode ? false : isLoadingBoards
  const safeMutating = isDemoMode ? false : isMutatingBoards
  const safeError = isDemoMode ? null : boardsError

  return useMemo(
    () => ({
      boards,
      isLoadingBoards: safeLoading,
      isMutatingBoards: safeMutating,
      boardsError: safeError,
      addBoard,
      getBoardById,
      updateBoardTitle,
      updateBoardDescription,
      deleteAllBoards,
      deleteBoard,
    }),
    [
      boards,
      safeLoading,
      safeMutating,
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