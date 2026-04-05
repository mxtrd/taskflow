import {
  type LocalTask,
  type TasksByBoardId,
  type TaskStatus,
  mockTasksByBoardId,
} from '@/shared/mocks/taskflowData'
import { useCallback, useState, type ReactNode } from 'react'
import { isDevOffline } from '@/shared/config/is-dev-offline'
import { createTask as createTaskApi } from '@/entities/tasks/api/createTask'
import { updateTask as updateTaskApi } from '@/entities/tasks/api/updateTask'
import { deleteTask as deleteTaskApi } from '@/entities/tasks/api/deleteTask'
import { getTasksByBoardId as getTasksByBoardIdApi } from '@/entities/tasks/api/getTasksByBoardId'
import { getTaskById as getTaskByIdApi } from '@/entities/tasks/api/getTaskById'
import { TasksContext, type TaskUpdate } from './tasks-context'

type TaskMeta = {
  priority: number
  startDate?: string
  deadline?: string
}

const asValidIsoDate = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim()
  if (!normalized) return undefined

  // Backend expects ISO 8601 date strings.
  const parsed = Date.parse(normalized)
  if (Number.isNaN(parsed)) return undefined

  return normalized
}

const buildInitialTaskMeta = (byBoard: TasksByBoardId): Record<string, TaskMeta> => {
  const meta: Record<string, TaskMeta> = {}
  for (const tasks of Object.values(byBoard)) {
    for (const t of tasks) {
      meta[t.id] = { priority: 0 }
    }
  }
  return meta
}

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasksByBoardId, setTasksByBoardId] = useState<TasksByBoardId>(() =>
    isDevOffline ? structuredClone(mockTasksByBoardId) : {}
  )
  const [taskMetaById, setTaskMetaById] = useState<Record<string, TaskMeta>>(() =>
    isDevOffline ? buildInitialTaskMeta(mockTasksByBoardId) : {}
  )
  const [isLoadingTasks, setIsLoadingTasks] = useState(false)
  const [tasksError, setTasksError] = useState<string | null>(null)

  const getTasksByBoardId = (boardId: string): LocalTask[] => tasksByBoardId[boardId] ?? []

  const getTaskById = (boardId: string, taskId: string): LocalTask | undefined =>
    getTasksByBoardId(boardId).find((task) => task.id === taskId)

  const normalizeTaskStatus = (status: number): TaskStatus => {
    return status === 0 || status === 1 || status === 2 || status === 3 ? status : 0
  }

  const loadTasksByBoardId = useCallback(async (boardId: string) => {
    if (isDevOffline) {
      setIsLoadingTasks(true)
      setTasksError(null)
      try {
        await Promise.resolve()
      } finally {
        setIsLoadingTasks(false)
      }
      return
    }

    setIsLoadingTasks(true)
    setTasksError(null)
    try {
      const response = await getTasksByBoardIdApi(boardId)

      const mapped: LocalTask[] = response.data.map((task) => ({
        id: task.id,
        boardId,
        title: task.attributes.title,
        description: task.attributes.description ?? '',
        status: normalizeTaskStatus(task.attributes.status),
      }))

      const nextMeta = response.data.reduce<Record<string, TaskMeta>>((acc, task) => {
        acc[task.id] = {
          priority: task.attributes.priority,
          startDate: asValidIsoDate(task.attributes.startDate),
          deadline: asValidIsoDate(task.attributes.deadline),
        }
        return acc
      }, {})

      setTasksByBoardId((prev) => ({
        ...prev,
        [boardId]: mapped,
      }))
      setTaskMetaById((prev) => ({ ...prev, ...nextMeta }))
    } catch (error) {
      setTasksError('Failed to load tasks')
      throw error
    } finally {
      setIsLoadingTasks(false)
    }
  }, [])

  const loadTaskById = useCallback(async (boardId: string, taskId: string) => {
    if (isDevOffline) {
      setIsLoadingTasks(true)
      setTasksError(null)
      try {
        const fromList = mockTasksByBoardId[boardId]
        const fromMock = fromList?.find((t) => t.id === taskId)
        if (!fromMock) {
          throw new Error('Task not found')
        }
        const nextTask: LocalTask = structuredClone(fromMock)

        setTasksByBoardId((prev) => {
          const list = prev[boardId] ?? []
          const index = list.findIndex((task) => task.id === taskId)

          if (index === -1) {
            return {
              ...prev,
              [boardId]: [nextTask, ...list],
            }
          }

          const nextList = [...list]
          nextList[index] = nextTask

          return {
            ...prev,
            [boardId]: nextList,
          }
        })
        setTaskMetaById((prev) => ({
          ...prev,
          [taskId]: prev[taskId] ?? { priority: 0 },
        }))
      } catch (error) {
        setTasksError('Failed to load task details')
        throw error
      } finally {
        setIsLoadingTasks(false)
      }
      return
    }

    setIsLoadingTasks(true)
    setTasksError(null)
    try {
      const response = await getTaskByIdApi(boardId, taskId)
      const dto = response.data

      const nextTask: LocalTask = {
        id: dto.id,
        boardId,
        title: dto.attributes.title,
        description: dto.attributes.description ?? '',
        status: normalizeTaskStatus(dto.attributes.status),
      }
      const nextTaskMeta: TaskMeta = {
        priority: dto.attributes.priority,
        startDate: asValidIsoDate(dto.attributes.startDate),
        deadline: asValidIsoDate(dto.attributes.deadline),
      }

      setTasksByBoardId((prev) => {
        const list = prev[boardId] ?? []
        const index = list.findIndex((task) => task.id === taskId)

        if (index === -1) {
          return {
            ...prev,
            [boardId]: [nextTask, ...list],
          }
        }

        const nextList = [...list]
        nextList[index] = nextTask

        return {
          ...prev,
          [boardId]: nextList,
        }
      })
      setTaskMetaById((prev) => ({ ...prev, [taskId]: nextTaskMeta }))
    } catch (error) {
      setTasksError('Failed to load task details')
      throw error
    } finally {
      setIsLoadingTasks(false)
    }
  }, [])

  const addTask = (boardId: string, title: string) => {
    const normalizedTitle = title.trim()
    if (!normalizedTitle) return

    if (isDevOffline) {
      setTasksError(null)
      const id = `task-local-${crypto.randomUUID()}`
      const newTask: LocalTask = {
        id,
        boardId,
        title: normalizedTitle,
        description: '',
        status: 0,
      }

      setTasksByBoardId((prev) => ({
        ...prev,
        [boardId]: [newTask, ...(prev[boardId] ?? [])],
      }))
      setTaskMetaById((prev) => ({
        ...prev,
        [id]: { priority: 0 },
      }))
      return
    }

    void (async () => {
      try {
        setTasksError(null)
        const response = await createTaskApi(boardId, { title: normalizedTitle })
        const dto = response.data
        const newTask: LocalTask = {
          id: dto.id,
          boardId,
          title: dto.attributes.title,
          description: dto.attributes.description ?? '',
          status: normalizeTaskStatus(dto.attributes.status),
        }

        setTasksByBoardId((prev) => ({
          ...prev,
          [boardId]: [newTask, ...(prev[boardId] ?? [])],
        }))
        setTaskMetaById((prev) => ({
          ...prev,
          [dto.id]: {
            priority: dto.attributes.priority,
            startDate: asValidIsoDate(dto.attributes.startDate),
            deadline: asValidIsoDate(dto.attributes.deadline),
          },
        }))
      } catch (error) {
        setTasksError('Failed to create task')
        console.error('Failed to create task:', error)
      }
    })()
  }

  const updateTask = (boardId: string, taskId: string, updated: TaskUpdate) => {
    if (updated.title !== undefined && updated.title.trim() === '') {
      return
    }
    const currentTask = getTaskById(boardId, taskId)
    if (!currentTask) return
    const currentMeta = taskMetaById[taskId]

    if (isDevOffline) {
      setTasksError(null)
      const nextStatus = normalizeTaskStatus(updated.status ?? currentTask.status)
      const nextTask: LocalTask = {
        ...currentTask,
        title: updated.title ?? currentTask.title,
        description: updated.description ?? currentTask.description,
        status: nextStatus,
      }

      setTasksByBoardId((prev) => {
        const list = prev[boardId] ?? []
        const index = list.findIndex((task) => task.id === taskId)
        if (index === -1) return prev

        const nextList = [...list]
        nextList[index] = nextTask

        return {
          ...prev,
          [boardId]: nextList,
        }
      })
      return
    }

    void (async () => {
      try {
        setTasksError(null)
        const response = await updateTaskApi(boardId, taskId, {
          title: updated.title ?? currentTask.title,
          description: updated.description ?? currentTask.description,
          status: updated.status ?? currentTask.status,
          priority: currentMeta?.priority ?? 0,
          ...(currentMeta?.startDate ? { startDate: currentMeta.startDate } : {}),
          ...(currentMeta?.deadline ? { deadline: currentMeta.deadline } : {}),
        })

        const dto = response.data
        const nextTask: LocalTask = {
          id: dto.id,
          boardId,
          title: dto.attributes.title,
          description: dto.attributes.description ?? '',
          status: normalizeTaskStatus(dto.attributes.status),
        }

        setTasksByBoardId((prev) => {
          const list = prev[boardId] ?? []
          const index = list.findIndex((task) => task.id === taskId)
          if (index === -1) return prev

          const nextList = [...list]
          nextList[index] = nextTask

          return {
            ...prev,
            [boardId]: nextList,
          }
        })
        setTaskMetaById((prev) => ({
          ...prev,
          [taskId]: {
            priority: dto.attributes.priority,
            startDate: asValidIsoDate(dto.attributes.startDate),
            deadline: asValidIsoDate(dto.attributes.deadline),
          },
        }))
      } catch (error) {
        setTasksError('Failed to update task')
        console.error('Failed to update task:', error)
      }
    })()
  }

  const deleteAllTasksForBoard = (boardId: string) => {
    const ids = (tasksByBoardId[boardId] ?? []).map((task) => task.id)

    if (isDevOffline) {
      setTasksError(null)
      setTasksByBoardId((prev) => ({
        ...prev,
        [boardId]: [],
      }))
      setTaskMetaById((prev) => {
        const next = { ...prev }
        for (const id of ids) {
          delete next[id]
        }
        return next
      })
      return
    }

    void (async () => {
      setTasksError(null)
      for (const id of ids) {
        try {
          await deleteTaskApi(boardId, id)
        } catch (error) {
          setTasksError('Failed to delete one or more tasks')
          console.error(`Failed to delete task ${id}:`, error)
        }
      }

      setTasksByBoardId((prev) => ({
        ...prev,
        [boardId]: [],
      }))
      setTaskMetaById((prev) => {
        const next = { ...prev }
        for (const id of ids) {
          delete next[id]
        }
        return next
      })
    })()
  }

  const clearAllTasks = () => {
    setTasksByBoardId({})
  }

  const deleteTask = (boardId: string, taskId: string) => {
    if (isDevOffline) {
      setTasksError(null)
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
      setTaskMetaById((prev) => {
        if (!(taskId in prev)) return prev
        const next = { ...prev }
        delete next[taskId]
        return next
      })
      return
    }

    void (async () => {
      try {
        setTasksError(null)
        await deleteTaskApi(boardId, taskId)
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
        setTaskMetaById((prev) => {
          if (!(taskId in prev)) return prev
          const next = { ...prev }
          delete next[taskId]
          return next
        })
      } catch (error) {
        setTasksError('Failed to delete task')
        console.error('Failed to delete task:', error)
      }
    })()
  }

  const removeTasksForBoard = (boardId: string) => {
    setTasksByBoardId((prev) => {
      if (!(boardId in prev)) return prev

      const next = { ...prev }
      delete next[boardId]
      return next
    })
    setTaskMetaById((prev) => {
      const ids = (tasksByBoardId[boardId] ?? []).map((task) => task.id)
      if (ids.length === 0) return prev

      const next = { ...prev }
      for (const id of ids) {
        delete next[id]
      }
      return next
    })
  }

  const toggleTaskComplete = (boardId: string, taskId: string, isDone: boolean) => {
    const nextStatus: TaskStatus = isDone ? 1 : 0
    updateTask(boardId, taskId, { status: nextStatus })
  }

  const value = {
    isLoadingTasks,
    tasksError,
    getTasksByBoardId,
    getTaskById,
    loadTasksByBoardId,
    loadTaskById,
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
