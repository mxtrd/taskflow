import { mockTasksByBoardId, type LocalTask, type TasksByBoardId } from '@/shared/mocks/taskflowData'
import { useState, type ReactNode } from 'react'
import { TasksContext, type TaskUpdate } from './tasks-context'

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasksByBoardId, setTasksByBoardId] = useState<TasksByBoardId>(mockTasksByBoardId)

  const getTasksByBoardId = (boardId: string): LocalTask[] => tasksByBoardId[boardId] ?? []

  const getTaskById = (boardId: string, taskId: string): LocalTask | undefined =>
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

  const updateTask = (boardId: string, taskId: string, updated: TaskUpdate) => {
    if (updated.title !== undefined && updated.title.trim() === '') {
      return
    }

    setTasksByBoardId((prev) => {
      const list = prev[boardId]
      if (!list) return prev

      const index = list.findIndex((task) => task.id === taskId)
      if (index === -1) return prev

      const nextList = [...list]
      nextList[index] = { ...nextList[index], ...updated }

      return {
        ...prev,
        [boardId]: nextList
      }
    })
  }

  const deleteAllTasksForBoard = (boardId: string) => {
    setTasksByBoardId((prev) => ({
      ...prev,
      [boardId]: [],
    }))
  }

  const clearAllTasks = () => {
    setTasksByBoardId({})
  }

  const deleteTask = (boardId: string, taskId: string) => {
    setTasksByBoardId((prev) => {
      const list = prev[boardId]
      if(!list) return prev

      const nextList = list.filter((task) => task.id !== taskId)
      if (nextList.length === list.length) return prev

      return {
        ...prev,
        [boardId]: nextList,
      }
    })
  }

  const value = {
    getTasksByBoardId,
    getTaskById,
    addTask,
    updateTask,
    deleteAllTasksForBoard,
    clearAllTasks,
    deleteTask
  }

  return <TasksContext.Provider value={value}>
    {children}
  </TasksContext.Provider>
}
