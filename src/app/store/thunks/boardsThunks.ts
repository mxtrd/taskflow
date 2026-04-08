import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store/store'
import type { LocalBoard } from '@/shared/mocks/taskflowData'
import { getMyBoards } from '@/entities/boards/api/getMyBoards'
import { createBoard } from '@/entities/boards/api/createBoard'
import { updateBoard } from '@/entities/boards/api/updateBoard'
import { deleteBoard } from '@/entities/boards/api/deleteBoard'
import { mapBoardDtoToLocalBoard } from '@/entities/boards/model/mappers'

export const fetchMyBoardsThunk = createAsyncThunk<LocalBoard[]>(
  'boards/fetchMyBoards',
  async () => {
    const res = await getMyBoards()
    return res.data.map(mapBoardDtoToLocalBoard)
  }
)

export const createBoardThunk = createAsyncThunk<LocalBoard, { title: string }>(
  'boards/createBoard',
  async ({ title }) => {
    const res = await createBoard({ title, description: '' })
    return mapBoardDtoToLocalBoard(res.data)
  }
)

export const updateBoardTitleThunk = createAsyncThunk<
  LocalBoard,
  { boardId: string; title: string; description: string; isImportant: boolean }
>('boards/updateBoardTitle', async ({ boardId, title, description, isImportant }) => {
  const res = await updateBoard(boardId, { title, description, isImportant })
  return mapBoardDtoToLocalBoard(res.data)
})

export const updateBoardDescriptionThunk = createAsyncThunk<
  LocalBoard,
  { boardId: string; title: string; description: string; isImportant: boolean }
>('boards/updateBoardDescription', async ({ boardId, title, description, isImportant }) => {
  const res = await updateBoard(boardId, { title, description, isImportant })
  return mapBoardDtoToLocalBoard(res.data)
})

export const deleteBoardThunk = createAsyncThunk<string, { boardId: string }>(
  'boards/deleteBoard',
  async ({ boardId }) => {
    await deleteBoard(boardId)
    return boardId
  }
)

export const deleteAllBoardsThunk = createAsyncThunk<string[], void, { state: RootState }>(
  'boards/deleteAllBoards',
  async (_, { getState, rejectWithValue }) => {
    const ids = getState().boards.items.map((b) => b.id)

    const failed: string[] = []
    await Promise.all(
      ids.map(async (id) => {
        try {
          await deleteBoard(id)
        } catch {
          failed.push(id)
        }
      })
    )

    if (failed.length > 0) {
      return rejectWithValue(failed)
    }

    return ids
  }
)