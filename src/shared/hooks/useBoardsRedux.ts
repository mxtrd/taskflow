import { useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux-hooks'
import { selectBoards, selectBoardsError, selectBoardsLoading } from '@/app/store/selectors/boardsSelectors'
import {
  fetchMyBoardsThunk,
  createBoardThunk,
  deleteBoardThunk,
} from '@/app/store/thunks/boardsThunks'
import { isDevOffline } from '@/shared/config/is-dev-offline'
import { mockBoards } from '@/shared/mocks/taskflowData'

export const useBoardsRedux = () => {
  const dispatch = useAppDispatch()
  const boards = useAppSelector(selectBoards)
  const isLoadingBoards = useAppSelector(selectBoardsLoading)
  const boardsError = useAppSelector(selectBoardsError)

  useEffect(() => {
    if (isDevOffline) return
    void dispatch(fetchMyBoardsThunk())
  }, [dispatch])

  const value = useMemo(() => {
    if (isDevOffline) {
      return {
        boards: mockBoards,
        isLoadingBoards: false,
        boardsError: null,
        addBoard: (title: string) => {
          // на этапе 2 можно оставить no-op или локально (лучше на этапе 3)
          console.warn('addBoard is not implemented in dev-offline Redux hook yet', title)
        },
        deleteAllBoards: () => {
          console.warn('deleteAllBoards is not implemented in dev-offline Redux hook yet')
        },
        deleteBoard: (boardId: string) => {
          console.warn('deleteBoard is not implemented in dev-offline Redux hook yet', boardId)
        },
      }
    }

    return {
      boards,
      isLoadingBoards,
      boardsError,
      addBoard: (title: string) => {
        const normalized = title.trim()
        if (!normalized) return
        void dispatch(createBoardThunk({ title: normalized }))
      },
      deleteAllBoards: () => {
        // чтобы не расширять этап — оставь пока через existing context UI кнопки,
        // или реализуй в этапе 3 батч-удаление
        console.warn('deleteAllBoards is not implemented in Redux yet')
      },
      deleteBoard: (boardId: string) => {
        void dispatch(deleteBoardThunk({ boardId }))
      },
    }
  }, [boards, isLoadingBoards, boardsError, dispatch])

  return value
}