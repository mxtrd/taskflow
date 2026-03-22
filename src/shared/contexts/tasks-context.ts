import { createContext } from 'react'
import type { LocalTask } from '@/shared/mocks/taskflowData'

export type TaskUpdate = Partial<Pick<LocalTask, 'title' | 'description' | 'status'>>

export type TasksContextValue = {
  getTasksByBoardId: (boardId: string) => LocalTask[]
  getTaskById: (boardId: string, taskId: string) => LocalTask | undefined
  addTask: (boardId: string, title: string) => void
  updateTask: (boardId: string, taskId: string, updated: TaskUpdate) => void
  deleteAllTasksForBoard: (boardId: string) => void
  clearAllTasks: () => void
}

export const TasksContext = createContext<TasksContextValue | null>(null)
