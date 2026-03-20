import { mockTasksByBoardId, type LocalTask } from '@/shared/mocks/taskflowData'
import { useState, type ReactNode } from 'react'
import { TasksContext } from './tasks-context'

type TasksByBoardId = Record<string, LocalTask[]>

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasksByBoardId, setTasksByBoardId] =
    useState<TasksByBoardId>(mockTasksByBoardId)

  const getTasksByBoardId = (boardId: string): LocalTask[] =>
    tasksByBoardId[boardId] ?? []
  const getTaskById = (
    boardId: string,
    taskId: string,
  ): LocalTask | undefined =>
    getTasksByBoardId(boardId).find((task) => task.id === taskId)

  const addTask = (boardId: string, title: string) => {
    const normalizedTitle = title.trim()
    if (!normalizedTitle) return

    const newTask: LocalTask = {
      id: crypto?.randomUUID?.() ?? Date.now().toString(),
      boardId,
      title: normalizedTitle,
      description: '',
      status: 2, //draft
    }

    setTasksByBoardId((prev) => ({
      ...prev,
      [boardId]: [newTask, ...(prev[boardId] ?? [])],
    }))
  }

  const value = {
    getTasksByBoardId,
    getTaskById,
    addTask,
  }

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}
