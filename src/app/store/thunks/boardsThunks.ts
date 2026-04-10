import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store/store'
import type { LocalBoard } from '@/shared/mocks/taskflowData'
import { getMyBoards } from '@/entities/boards/api/getMyBoards'
import { createBoard } from '@/entities/boards/api/createBoard'
import { updateBoard } from '@/entities/boards/api/updateBoard'
import { deleteBoard } from '@/entities/boards/api/deleteBoard'
import { mapBoardDtoToLocalBoard } from '@/entities/boards/model/mappers'
import { getApiErrorMessage } from '@/shared/lib/api-error'

export const fetchMyBoardsThunk = createAsyncThunk<LocalBoard[], void, { rejectValue: string }>(
'boards/fetchMyBoards',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyBoards()
      return res.data.map(mapBoardDtoToLocalBoard)
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Failed to load boards'))
    }
  }
)

export const createBoardThunk = createAsyncThunk<LocalBoard, { title: string }, { rejectValue: string }>(
  'boards/createBoard',
  async ({ title }, { rejectWithValue }) => {
    try {
      const res = await createBoard({ title, description: '' })
      return mapBoardDtoToLocalBoard(res.data)
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Failed to create board'))
    }
  }
)

export const updateBoardTitleThunk = createAsyncThunk<
  LocalBoard,
  { boardId: string; title: string; description: string; isImportant: boolean },
  { rejectValue: string }
>('boards/updateBoardTitle', async ({ boardId, title, description, isImportant }, { rejectWithValue }) => {
  try {
    const res = await updateBoard(boardId, { title, description, isImportant })
    return mapBoardDtoToLocalBoard(res.data)
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error, 'Failed to update board title'))
  }
})

export const updateBoardDescriptionThunk = createAsyncThunk<
  LocalBoard,
  { boardId: string; title: string; description: string; isImportant: boolean },
  { rejectValue: string }
>('boards/updateBoardDescription', async ({ boardId, title, description, isImportant }, { rejectWithValue }) => {
  try {
    const res = await updateBoard(boardId, { title, description, isImportant })
    return mapBoardDtoToLocalBoard(res.data)
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error, 'Failed to update board description'))
  }
})

export const deleteBoardThunk = createAsyncThunk<string, { boardId: string }, { rejectValue: string }>(
  'boards/deleteBoard',
  async ({ boardId }, { rejectWithValue }) => {
    try {
      await deleteBoard(boardId)
      return boardId
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Failed to delete board'))
    }
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