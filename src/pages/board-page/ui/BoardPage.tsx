import { useBoardsRedux } from '@/shared/hooks/useBoardsRedux'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTasksRedux } from '@/shared/hooks/useTasksRedux'
import TaskItem from './task-item/TaskItem'
import SearchField from '@/shared/ui/search-field'
import BaseLayout from '@/app/layouts/base-layout'
import baseStyles from '@/app/styles/base.module.scss'
import styles from './BoardPage.module.scss'
import Button from '@/shared/ui/button'
import { useForm } from 'react-hook-form'

type EditBoardTitleFormValues = {
  title: string
}

type EditBoardDescriptionFormValues = {
  description: string
}

type CreateTaskFormValues = {
  title: string
}

const BoardPage = () => {
  const {
    getBoardById,
    updateBoardTitle,
    updateBoardDescription,
    boardsError,
    isMutatingBoards,
  } = useBoardsRedux()
  const {
    getTasksByBoardId,
    loadTasksByBoardId,
    isLoadingTasks,
    isMutatingTasks,
    tasksError,
    addTask,
    deleteAllTasksForBoard,
    deleteTask,
    toggleTaskComplete,
  } = useTasksRedux()

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isAddingDescription, setIsAddingDescription] = useState(false)
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [searchTasksQuery, setSearchTasksQuery] = useState('')

  const { boardId } = useParams<{ boardId: string }>()
  const selectedBoard = boardId ? getBoardById(boardId) : undefined
  const tasks = boardId ? getTasksByBoardId(boardId) : []
  const hasDescription = Boolean(selectedBoard?.description?.trim())

  const {
    register: registerTitle,
    handleSubmit: handleTitleSubmit,
    reset: resetTitleForm,
    formState: { errors: titleErrors, isSubmitting: isTitleFormSubmitting },
  } = useForm<EditBoardTitleFormValues>({
    defaultValues: { title: '' },
    mode: 'onSubmit',
  })

  const {
    register: registerDescription,
    handleSubmit: handleDescriptionSubmit,
    reset: resetDescriptionForm,
    formState: { errors: descriptionErrors, isSubmitting: isDescriptionFormSubmitting },
  } = useForm<EditBoardDescriptionFormValues>({
    defaultValues: { description: '' },
    mode: 'onSubmit',
  })

  const {
    register: registerTask,
    handleSubmit: handleCreateTaskSubmit,
    reset: resetTaskForm,
    formState: { errors: taskErrors, isSubmitting: isTaskFormSubmitting },
  } = useForm<CreateTaskFormValues>({
    defaultValues: { title: '' },
    mode: 'onSubmit',
  })

  useEffect(() => {
    if (!boardId) return

    loadTasksByBoardId(boardId).catch((error) => {
      console.error('Failed to load tasks by board id:', error)
    })
  }, [boardId, loadTasksByBoardId])

  const deleteAllTasks = () => {

    if (!boardId) return

    const isConfirmed = confirm('Are you sure you want to delete all tasks in this board?')
    if (!isConfirmed) return

    deleteAllTasksForBoard(boardId)
  }

  const deleteTaskHandler = (taskId: string) => {
    if (!boardId) return

    deleteTask(boardId, taskId)
  }

  // const toggleTaskComplete = (taskId: string, isDone: boolean) => {
  //   console.log(`Task ${taskId} ${isDone ? 'done' : 'not done'}`)
  // }

  const startEditTitle = () => {
    if (!selectedBoard) return
    resetTitleForm({ title: selectedBoard.title })
    setIsEditingTitle(true)
  }

  const cancelEditTitle = () => {
    resetTitleForm({ title: '' })
    setIsEditingTitle(false)
  }

  const onTitleSubmit = ({ title }: EditBoardTitleFormValues) => {
    if (!boardId) return

    const normalizedTitle = title.trim()
    if (!normalizedTitle) return

    updateBoardTitle(boardId, normalizedTitle)
    resetTitleForm({ title: '' })
    setIsEditingTitle(false)
  }

  const startEditDescription = () => {
    if (!selectedBoard) return
    resetDescriptionForm({ description: selectedBoard.description ?? '' })
    setIsAddingDescription(true)
  }

  const cancelAddDescription = () => {
    resetDescriptionForm({ description: '' })
    setIsAddingDescription(false)
  }

  const onDescriptionSubmit = ({ description }: EditBoardDescriptionFormValues) => {
    if (!boardId) return

    updateBoardDescription(boardId, description.trim())
    resetDescriptionForm({ description: '' })
    setIsAddingDescription(false)
  }

  const startCreateTask = () => {
    if (isCreatingTask) return
    resetTaskForm({ title: '' })
    setIsCreatingTask(true)
  }

  const cancelCreateTask = () => {
    resetTaskForm({ title: '' })
    setIsCreatingTask(false)
  }

  const onCreateTaskSubmit = ({ title }: CreateTaskFormValues) => {
    if (!boardId) return

    const normalizedTitle = title.trim()
    if (!normalizedTitle) return

    addTask(boardId, normalizedTitle)
    resetTaskForm({ title: '' })
    setIsCreatingTask(false)
  }

  const searchTasksNormalized = searchTasksQuery.trim().toLowerCase()
  const filteredTasks = searchTasksNormalized.length > 0
    ? tasks.filter(({ title }) => title.toLowerCase().includes(searchTasksNormalized))
    : tasks

  const hasTasks = tasks.length > 0
  const hasActivetasksSearch = searchTasksNormalized.length > 0
  const noTasksMatches = hasTasks && hasActivetasksSearch && filteredTasks.length === 0
  const isSubmitting =
    isMutatingBoards ||
    isMutatingTasks ||
    isTitleFormSubmitting ||
    isDescriptionFormSubmitting ||
    isTaskFormSubmitting

  if (!selectedBoard) {
    return (
      <BaseLayout title='Taskflow | Board' description='Taskflow - board page'>
        <section className={styles.board}>
          <div className={baseStyles.container}>
            <div className={baseStyles.content}>Board not found</div>
          </div>
        </section>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout title='Taskflow | Board' description='Taskflow - board page'>
      <section className={baseStyles.section}>
        <div className={baseStyles.container}>
          <div className={baseStyles.content}>
            {isEditingTitle ? (
              <form onSubmit={handleTitleSubmit(onTitleSubmit)}>
                <input
                  type='text'
                  placeholder='Edit title'
                  {...registerTitle('title', {
                    required: 'Board title is required',
                    minLength: { value: 2, message: 'Minimum 2 characters' },
                    maxLength: { value: 120, message: 'Maximum 120 characters' },
                    validate: (value: string) => value.trim().length > 0 || 'Board title cannot be empty',
                  })}
                />
                {titleErrors.title && <p className={baseStyles.descr}>{titleErrors.title.message}</p>}
                <button type='submit' disabled={isSubmitting}>Save</button>
                <button type='button' onClick={cancelEditTitle} disabled={isSubmitting}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <h1 className={baseStyles.title}>{selectedBoard.title}</h1>
                <button type='button' onClick={startEditTitle} disabled={isSubmitting}>
                  Edit
                </button>
              </>
            )}
            {isAddingDescription ? (
              <form onSubmit={handleDescriptionSubmit(onDescriptionSubmit)}>
                <textarea
                  placeholder='Add board description'
                  rows={4}
                  {...registerDescription('description', {
                    maxLength: { value: 1000, message: 'Maximum 1000 characters' },
                  })}
                />
                {descriptionErrors.description && (
                  <p className={baseStyles.descr}>{descriptionErrors.description.message}</p>
                )}
                <button type='submit' disabled={isSubmitting}>Save</button>
                <button type='button' onClick={cancelAddDescription} disabled={isSubmitting}>
                  Cancel
                </button>
              </form>
            ) : hasDescription ? (
              <>
                <p className={baseStyles.descr}>
                  {selectedBoard.description}
                </p>
                <button type='button' onClick={startEditDescription} disabled={isSubmitting}>
                  Edit description
                </button>
              </>
            ) : (
              <button type='button' onClick={startEditDescription} disabled={isSubmitting}>
                Add description
              </button>
            )}
            <div className={styles.buttons}>
              <Button
                className={styles.button}
                onClick={startCreateTask}
                disabled={isSubmitting}
              >
                New Task
              </Button>
              <Button
                variant='secondary'
                className={styles.button}
                onClick={deleteAllTasks}
                disabled={isSubmitting || tasks.length === 0}
              >
                Delete All Tasks
              </Button>
            </div>
            <form>
              <SearchField
                value={searchTasksQuery}
                name='tasksSearch'
                onChange={(event) => setSearchTasksQuery(event.target.value)}
                placeholder="find task"
              />
            </form>
            {boardsError && <p className={baseStyles.descr}>{boardsError}</p>}
            {isLoadingTasks && <p className={baseStyles.descr}>Loading tasks...</p>}
            {tasksError && <p className={baseStyles.descr}>{tasksError}</p>}
            {isCreatingTask && (
              <form onSubmit={handleCreateTaskSubmit(onCreateTaskSubmit)}>
                <input
                  type='text'
                  placeholder='Task title...'
                  {...registerTask('title', {
                    required: 'Task title is required',
                    minLength: { value: 2, message: 'Minimum 2 characters' },
                    maxLength: { value: 160, message: 'Maximum 160 characters' },
                    validate: (value: string) => value.trim().length > 0 || 'Task title cannot be empty',
                  })}
                />
                {taskErrors.title && <p className={baseStyles.descr}>{taskErrors.title.message}</p>}
                <button type='submit' disabled={isSubmitting}>Save</button>
                <button type='button' onClick={cancelCreateTask} disabled={isSubmitting}>
                  Cancel
                </button>
              </form>
            )}
            {!hasTasks ? (
              <p className={baseStyles.descr}>No tasks yet</p>
            ) : (
              <>
                <ul className={`${baseStyles.listReset} ${styles.tasks}`}>
                  {!noTasksMatches &&
                    filteredTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        boardId={selectedBoard.id}
                        task={task}
                        disabled={isSubmitting}
                        onTaskCompleteChange={toggleTaskComplete}
                        onDeleteTaskButtonCLick={deleteTaskHandler}
                      />
                    ))}
                </ul>
                {noTasksMatches && <p className={baseStyles.descr}>Tasks not found</p>}
              </>
            )}
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}

export default BoardPage
