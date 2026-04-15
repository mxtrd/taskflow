import { useCallback, useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux-hooks'
import {
  selectTasksError,
  selectTasksLoading,
  selectTasksMutating,
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
import { markTasksOfflineSeeded, resetTasks, setTasksForBoard } from '@/app/store/slices/tasksSlice'
import { isDevOffline } from '@/shared/config/is-dev-offline'
import {
  mockTasksByBoardId,
  type LocalTask,
  type TaskStatus,
} from '@/shared/mocks/taskflowData'
import type { TaskUpdate } from '@/app/store/types/tasks'

export const useTasksRedux = () => {
  const dispatch = useAppDispatch()
  const isLoadingTasks = useAppSelector(selectTasksLoading)
  const isMutatingTasks = useAppSelector(selectTasksMutating)
  const tasksError = useAppSelector(selectTasksError)
  const tasksByBoardId = useAppSelector((state: RootState) => state.tasks.byBoardId)
  const isOfflineSeeded = useAppSelector((state: RootState) => state.tasks.isOfflineSeeded)

  useEffect(() => {
    if (!isDevOffline) return
    if (isOfflineSeeded) return

    for (const [boardId, tasks] of Object.entries(mockTasksByBoardId)) {
      dispatch(setTasksForBoard({ boardId, tasks: structuredClone(tasks) }))
    }
    dispatch(markTasksOfflineSeeded())
  }, [dispatch, isOfflineSeeded])

  const getTasksByBoardId = useCallback(
    (boardId: string): LocalTask[] => {
      return tasksByBoardId[boardId] ?? []
    },
    [tasksByBoardId]
  )

  const getTaskById = useCallback(
    (boardId: string, taskId: string): LocalTask | undefined => {
      const list = tasksByBoardId[boardId] ?? []
      return list.find((task) => task.id === taskId)
    },
    [tasksByBoardId]
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
        dispatch(
          setTasksForBoard({
            boardId,
            tasks: [task, ...(tasksByBoardId[boardId] ?? [])],
          })
        )
        return
      }

      void dispatch(createTaskThunk({ boardId, title: normalizedTitle }))
    },
    [dispatch, tasksByBoardId]
  )

  const updateTask = useCallback(
    async (boardId: string, taskId: string, updated: TaskUpdate) => {
      if (isDevOffline) {
        const list = tasksByBoardId[boardId] ?? []
        dispatch(
          setTasksForBoard({
            boardId,
            tasks: list.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    title: updated.title ?? task.title,
                    description: updated.description ?? task.description,
                    status: (updated.status ?? task.status) as TaskStatus,
                  }
                : task
            ),
          })
        )
        return
      }

      await dispatch(updateTaskThunk({ boardId, taskId, updated })).unwrap()
    },
    [dispatch, tasksByBoardId]
  )

  const deleteAllTasksForBoard = useCallback(
    (boardId: string) => {
      if (isDevOffline) {
        dispatch(setTasksForBoard({ boardId, tasks: [] }))
        return
      }
      void dispatch(deleteAllTasksForBoardThunk({ boardId }))
    },
    [dispatch]
  )

  const clearAllTasks = useCallback(() => {
    if (isDevOffline) {
      dispatch(resetTasks())
    }
  }, [dispatch])

  const deleteTask = useCallback(
    (boardId: string, taskId: string) => {
      if (isDevOffline) {
        dispatch(
          setTasksForBoard({
            boardId,
            tasks: (tasksByBoardId[boardId] ?? []).filter((task) => task.id !== taskId),
          })
        )
        return
      }
      void dispatch(deleteTaskThunk({ boardId, taskId }))
    },
    [dispatch, tasksByBoardId]
  )

  const removeTasksForBoard = useCallback((boardId: string) => {
    if (isDevOffline) {
      dispatch(setTasksForBoard({ boardId, tasks: [] }))
    }
  }, [dispatch])

  const toggleTaskComplete = useCallback(
    (boardId: string, taskId: string, isDone: boolean) => {
      const status: TaskStatus = isDone ? 1 : 0
      void updateTask(boardId, taskId, { status })
    },
    [updateTask]
  )

  return useMemo(
    () => ({
      isLoadingTasks,
      isMutatingTasks,
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
      isMutatingTasks,
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