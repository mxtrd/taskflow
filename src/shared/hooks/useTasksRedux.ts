import { useCallback, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux-hooks'
import {
  selectTasksError,
  selectTasksLoading,
} from '@/app/store/selectors/tasksSelectors'
import type { RootState } from '@/app/store/store'
import {
  createTaskThunk,
  deleteAllTasksForBoardThunk,
  deleteTaskThunk,
  fetchTaskByIdThunk,
  fetchTasksByBoardThunk,
  updateTaskThunk,
} from '@/app/store/thunks/tasksThunks'
import { isDevOffline } from '@/shared/config/is-dev-offline'
import {
  mockTasksByBoardId,
  type LocalTask,
  type TaskStatus,
  type TasksByBoardId,
} from '@/shared/mocks/taskflowData'
import type { TaskUpdate } from '@/app/store/types/tasks'

export const useTasksRedux = () => {
  const dispatch = useAppDispatch()
  const isLoadingTasks = useAppSelector(selectTasksLoading)
  const tasksError = useAppSelector(selectTasksError)
  const tasksByBoardId = useAppSelector((state: RootState) => state.tasks.byBoardId)

  const [offlineTasksByBoardId, setOfflineTasksByBoardId] = useState<TasksByBoardId>(() =>
    structuredClone(mockTasksByBoardId)
  )

  const getTasksByBoardId = useCallback(
    (boardId: string): LocalTask[] => {
      if (isDevOffline) return offlineTasksByBoardId[boardId] ?? []
      return tasksByBoardId[boardId] ?? []
    },
    [offlineTasksByBoardId, tasksByBoardId]
  )

  const getTaskById = useCallback(
    (boardId: string, taskId: string): LocalTask | undefined => {
      const list = isDevOffline ? offlineTasksByBoardId[boardId] ?? [] : tasksByBoardId[boardId] ?? []
      return list.find((task) => task.id === taskId)
    },
    [offlineTasksByBoardId, tasksByBoardId]
  )

  const loadTasksByBoardId = useCallback(
    async (boardId: string) => {
      if (isDevOffline) return
      await dispatch(fetchTasksByBoardThunk({ boardId })).unwrap()
    },
    [dispatch]
  )

  const loadTaskById = useCallback(
    async (boardId: string, taskId: string) => {
      if (isDevOffline) return
      await dispatch(fetchTaskByIdThunk({ boardId, taskId })).unwrap()
    },
    [dispatch]
  )

  const addTask = useCallback(
    (boardId: string, title: string) => {
      const normalizedTitle = title.trim()
      if (!normalizedTitle) return

      if (isDevOffline) {
        const id = `task-local-${crypto.randomUUID()}`
        const task: LocalTask = { id, boardId, title: normalizedTitle, description: '', status: 0 }
        setOfflineTasksByBoardId((prev) => ({
          ...prev,
          [boardId]: [task, ...(prev[boardId] ?? [])],
        }))
        return
      }

      void dispatch(createTaskThunk({ boardId, title: normalizedTitle }))
    },
    [dispatch]
  )

  const updateTask = useCallback(
    (boardId: string, taskId: string, updated: TaskUpdate) => {
      if (isDevOffline) {
        setOfflineTasksByBoardId((prev) => {
          const list = prev[boardId] ?? []
          return {
            ...prev,
            [boardId]: list.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    title: updated.title ?? task.title,
                    description: updated.description ?? task.description,
                    status: (updated.status ?? task.status) as TaskStatus,
                  }
                : task
            ),
          }
        })
        return
      }

      void dispatch(updateTaskThunk({ boardId, taskId, updated }))
    },
    [dispatch]
  )

  const deleteAllTasksForBoard = useCallback(
    (boardId: string) => {
      if (isDevOffline) {
        setOfflineTasksByBoardId((prev) => ({ ...prev, [boardId]: [] }))
        return
      }
      void dispatch(deleteAllTasksForBoardThunk({ boardId }))
    },
    [dispatch]
  )

  const clearAllTasks = useCallback(() => {
    if (isDevOffline) setOfflineTasksByBoardId({})
  }, [])

  const deleteTask = useCallback(
    (boardId: string, taskId: string) => {
      if (isDevOffline) {
        setOfflineTasksByBoardId((prev) => ({
          ...prev,
          [boardId]: (prev[boardId] ?? []).filter((task) => task.id !== taskId),
        }))
        return
      }
      void dispatch(deleteTaskThunk({ boardId, taskId }))
    },
    [dispatch]
  )

  const removeTasksForBoard = useCallback((boardId: string) => {
    if (isDevOffline) {
      setOfflineTasksByBoardId((prev) => {
        const next = { ...prev }
        delete next[boardId]
        return next
      })
    }
  }, [])

  const toggleTaskComplete = useCallback(
    (boardId: string, taskId: string, isDone: boolean) => {
      const status: TaskStatus = isDone ? 1 : 0
      updateTask(boardId, taskId, { status })
    },
    [updateTask]
  )

  return useMemo(
    () => ({
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
      toggleTaskComplete,
    }),
    [
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
      toggleTaskComplete,
    ]
  )
}