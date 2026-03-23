import { mockTasksByBoardId, type LocalTask, type TasksByBoardId, type TaskStatus } from '@/shared/mocks/taskflowData'
import { useState, useEffect, type ReactNode } from 'react'
import { TASKS_STORAGE_KEY } from '@/shared/lib/taskflow-storage'
import { TasksContext, type TaskUpdate } from './tasks-context'

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasksByBoardId, setTasksByBoardId] = useState<TasksByBoardId>(() => {
    const savedTasksByBoardId = localStorage.getItem(TASKS_STORAGE_KEY)
    if (savedTasksByBoardId) {
      return JSON.parse(savedTasksByBoardId) as TasksByBoardId
    }

    return mockTasksByBoardId
  })

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasksByBoardId))
  }, [tasksByBoardId])

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
      if (!list) return prev

      const nextList = list.filter((task) => task.id !== taskId)
      if (nextList.length === list.length) return prev

      return {
        ...prev,
        [boardId]: nextList,
      }
    })
  }

  const removeTasksForBoard = (boardId: string) => {
    setTasksByBoardId((prev) => {
      if (!(boardId in prev)) return prev

      const next = { ...prev }
      delete next[boardId]
      return next
    })
  }

  const toggleTaskComplete = (boardId: string, taskId: string, isDone: boolean) => {
    setTasksByBoardId((prev) => {
      const list = prev[boardId]
      if (!list) return prev

      const nextStatus: TaskStatus = isDone ? 1 : 0

      const nextList = list.map((task) =>
        task.id === taskId ? { ...task, status: nextStatus } : task
      )

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
    deleteTask,
    removeTasksForBoard,
    toggleTaskComplete
  }

  return <TasksContext.Provider value={value}>
    {children}
  </TasksContext.Provider>
}
