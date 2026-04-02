import { createContext } from 'react'
import type { LocalTask } from '@/shared/mocks/taskflowData'

export type TaskUpdate = Partial<Pick<LocalTask, 'title' | 'description' | 'status'>>

export type TasksContextValue = {
  isLoadingTasks: boolean
  tasksError: string | null
  getTasksByBoardId: (boardId: string) => LocalTask[]
  getTaskById: (boardId: string, taskId: string) => LocalTask | undefined
  loadTasksByBoardId: (boardId: string) => Promise<void>
  loadTaskById: (boardId: string, taskId: string) => Promise<void>
  addTask: (boardId: string, title: string) => void
  updateTask: (boardId: string, taskId: string, updated: TaskUpdate) => void
  deleteAllTasksForBoard: (boardId: string) => void
  clearAllTasks: () => void
  deleteTask: (boardId: string, taskId: string) => void
  removeTasksForBoard: (boardId: string) => void
  toggleTaskComplete: (boardId: string, taskId: string, isDone: boolean) => void
}

export const TasksContext = createContext<TasksContextValue | null>(null)
