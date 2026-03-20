import { createContext } from 'react'
import type { LocalTask } from '@/shared/mocks/taskflowData'

export type TasksContextValue = {
  getTasksByBoardId: (boardId: string) => LocalTask[]
  getTaskById: (boardId: string, taskId: string) => LocalTask | undefined
  addTask: (boardId: string, title: string) => void
}

export const TasksContext = createContext<TasksContextValue | null>(null)