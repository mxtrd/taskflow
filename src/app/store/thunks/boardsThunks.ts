import { createAsyncThunk } from '@reduxjs/toolkit'
import type { LocalBoard } from '@/shared/mocks/taskflowData'
import { getMyBoards } from '@/entities/boards/api/getMyBoards'
import { createBoard } from '@/entities/boards/api/createBoard'
import { updateBoard } from '@/entities/boards/api/updateBoard'
import { deleteBoard } from '@/entities/boards/api/deleteBoard'

const mapDtoToLocalBoard = (b: { id: string; attributes: { title: string; description: string } }): LocalBoard => ({
  id: b.id,
  title: b.attributes.title,
  description: b.attributes.description,
})

export const fetchMyBoardsThunk = createAsyncThunk<LocalBoard[]>(
  'boards/fetchMyBoards',
  async () => {
    const res = await getMyBoards()
    return res.data.map(mapDtoToLocalBoard)
  }
)

export const createBoardThunk = createAsyncThunk<LocalBoard, { title: string }>(
  'boards/createBoard',
  async ({ title }) => {
    const res = await createBoard({ title, description: '' })
    return mapDtoToLocalBoard(res.data)
  }
)

export const updateBoardTitleThunk = createAsyncThunk<
  LocalBoard,
  { boardId: string; title: string; description: string; isImportant: boolean }
>('boards/updateBoardTitle', async ({ boardId, title, description, isImportant }) => {
  const res = await updateBoard(boardId, { title, description, isImportant })
  return mapDtoToLocalBoard(res.data)
})

export const updateBoardDescriptionThunk = createAsyncThunk<
  LocalBoard,
  { boardId: string; title: string; description: string; isImportant: boolean }
>('boards/updateBoardDescription', async ({ boardId, title, description, isImportant }) => {
  const res = await updateBoard(boardId, { title, description, isImportant })
  return mapDtoToLocalBoard(res.data)
})

export const deleteBoardThunk = createAsyncThunk<string, { boardId: string }>(
  'boards/deleteBoard',
  async ({ boardId }) => {
    await deleteBoard(boardId)
    return boardId
  }
)