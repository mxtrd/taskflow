import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store/store'
import type { LocalTask } from '@/shared/mocks/taskflowData'
import { getTasksByBoardId, type TaskDataDto } from '@/entities/tasks/api/getTasksByBoardId'
import { getTaskById } from '@/entities/tasks/api/getTaskById'
import { createTask } from '@/entities/tasks/api/createTask'
import { updateTask } from '@/entities/tasks/api/updateTask'
import { deleteTask } from '@/entities/tasks/api/deleteTask'
import { mapTaskDtoToLocalTask } from '@/entities/tasks/model/mappers'
import type { TaskUpdate } from '@/app/store/types/tasks'

const mapTaskDto = (boardId: string, dto: TaskDataDto): LocalTask =>
  mapTaskDtoToLocalTask(boardId, dto)

export const fetchTasksByBoardThunk = createAsyncThunk<LocalTask[], { boardId: string }>(
  'tasks/fetchByBoard',
  async ({ boardId }) => {
    const response = await getTasksByBoardId(boardId)
    return response.data.map((task) => mapTaskDto(boardId, task))
  }
)

export const fetchTaskByIdThunk = createAsyncThunk<
  LocalTask,
  { boardId: string; taskId: string }
>('tasks/fetchById', async ({ boardId, taskId }) => {
  const response = await getTaskById(boardId, taskId)
  return mapTaskDto(boardId, response.data)
})

export const createTaskThunk = createAsyncThunk<
  LocalTask,
  { boardId: string; title: string }
>('tasks/create', async ({ boardId, title }) => {
  const response = await createTask(boardId, { title })
  return mapTaskDto(boardId, response.data)
})

export const updateTaskThunk = createAsyncThunk<
  LocalTask,
  { boardId: string; taskId: string; updated: TaskUpdate },
  { state: RootState }
>('tasks/update', async ({ boardId, taskId, updated }, { getState }) => {
  const current = (getState().tasks.byBoardId[boardId] ?? []).find((task) => task.id === taskId)
  if (!current) {
    throw new Error('Task not found in store')
  }

  const response = await updateTask(boardId, taskId, {
    title: updated.title ?? current.title,
    description: updated.description ?? current.description,
    status: updated.status ?? current.status,
    priority: 0,
  })

  return mapTaskDto(boardId, response.data)
})

export const deleteTaskThunk = createAsyncThunk<
  { boardId: string; taskId: string },
  { boardId: string; taskId: string }
>('tasks/delete', async ({ boardId, taskId }) => {
  await deleteTask(boardId, taskId)
  return { boardId, taskId }
})

export const deleteAllTasksForBoardThunk = createAsyncThunk<
  { boardId: string },
  { boardId: string },
  { state: RootState }
>('tasks/deleteAllForBoard', async ({ boardId }, { getState, rejectWithValue }) => {
  const taskIds = (getState().tasks.byBoardId[boardId] ?? []).map((task) => task.id)
  const failed: string[] = []

  await Promise.all(
    taskIds.map(async (taskId) => {
      try {
        await deleteTask(boardId, taskId)
      } catch {
        failed.push(taskId)
      }
    })
  )

  if (failed.length > 0) {
    return rejectWithValue(failed)
  }

  return { boardId }
})
