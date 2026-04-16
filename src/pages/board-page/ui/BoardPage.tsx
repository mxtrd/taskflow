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
import EditForm from '@/shared/ui/edit-form'
import { useForm } from 'react-hook-form'
import { createRequiredTrimmedTextRules } from '@/shared/lib/form-rules'

type EditBoardTitleFormValues = {
  title: string
}

type EditBoardDescriptionFormValues = {
  description: string
}

type CreateTaskFormValues = {
  title: string
}

const boardTitleRules = createRequiredTrimmedTextRules({
  fieldLabel: 'Board title',
  min: 2,
  max: 120,
})

const taskTitleRules = createRequiredTrimmedTextRules({
  fieldLabel: 'Task title',
  min: 2,
  max: 160,
})

const PencilIcon = () => (
  <svg width='16' height='16' viewBox='0 0 50 50' fill='none' aria-hidden='true'>
    <path
      fill='currentColor'
      d='M43.0508 1.97461C41.8008 1.97461 40.5496 2.45039 39.5996 3.40039L38.8008 4.19922L45.6992 11.0996L46.5 10.3008C48.4 8.40078 48.4 5.30039 46.5 3.40039C45.55 2.45039 44.3008 1.97461 43.0508 1.97461ZM37.4824 6.08984C37.2301 6.09396 36.9893 6.19482 36.7949 6.39258L4.29492 38.791C4.17555 38.9102 4.08503 39.0552 4.0332 39.2148L2.0332 46.7422A1.0001 1.0001 0 0 0 3.25781 47.9668L10.7578 45.9668A1.0001 1.0001 0 0 0 11.2089 45.7051L43.6074 13.2051A1.0001 1.0001 0 1 0 42.1914 11.7949L9.99219 44.0938L5.90625 40.0078L38.2051 7.80859A1.0001 1.0001 0 0 0 37.4824 6.08984Z'
    />
  </svg>
)

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
            <div className={baseStyles.header}>
              {isEditingTitle ? (
                <EditForm
                  onSubmit={handleTitleSubmit(onTitleSubmit)}
                  onCancel={cancelEditTitle}
                  disabled={isSubmitting}
                  registration={registerTitle('title', boardTitleRules)}
                  error={titleErrors.title?.message}
                  inputProps={{
                    type: 'text',
                    placeholder: 'Edit title',
                  }}
                />
              ) : (
                <div className={styles.titleSection}>
                  <h1 className={baseStyles.title}>{selectedBoard.title}</h1>
                  <Button
                    type='button'
                    variant='secondary'
                    isIconOnly
                    className={styles.editIconButton}
                    onClick={startEditTitle}
                    disabled={isSubmitting}
                  >
                    <PencilIcon />
                  </Button>
                </div>
              )}
              {isAddingDescription ? (
                <EditForm
                  mode='textarea'
                  onSubmit={handleDescriptionSubmit(onDescriptionSubmit)}
                  onCancel={cancelAddDescription}
                  disabled={isSubmitting}
                  registration={registerDescription('description', {
                    maxLength: { value: 1000, message: 'Maximum 1000 characters' },
                  })}
                  error={descriptionErrors.description?.message}
                  textareaProps={{
                    placeholder: 'Add board description',
                    rows: 4,
                  }}
                />
              ) : hasDescription ? (
                <div className={styles.descriptionSection}>
                  <p className={baseStyles.descr}>
                    {selectedBoard.description}
                  </p>
                  <Button
                    type='button'
                    variant='secondary'
                    isIconOnly
                    className={styles.editIconButton}
                    onClick={startEditDescription}
                    disabled={isSubmitting}
                  >
                    <PencilIcon />
                  </Button>
                </div>
              ) : (
                <Button className={styles.addButton} type='button' variant='primary' onClick={startEditDescription} disabled={isSubmitting}>
                  Add description
                </Button>
              )}
            </div>
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
            <form
              onSubmit={(event) => {
                event.preventDefault()
              }}
            >
              <SearchField
                type='search'
                value={searchTasksQuery}
                name='tasksSearch'
                onChange={(event) => setSearchTasksQuery(event.target.value)}
                placeholder="Find task"
              />
            </form>
            {boardsError && <p className={baseStyles.descr}>{boardsError}</p>}
            {isLoadingTasks && <p className={baseStyles.descr}>Loading tasks...</p>}
            {tasksError && <p className={baseStyles.descr}>{tasksError}</p>}
            {!hasTasks && !isCreatingTask ? (
              <p className={baseStyles.descr}>No tasks yet</p>
            ) : (
              <>
                <ul className={`${baseStyles.listReset} ${styles.tasks}`}>
                  {isCreatingTask && (
                    <li className={styles.taskDraft}>
                      <EditForm
                        onSubmit={handleCreateTaskSubmit(onCreateTaskSubmit)}
                        onCancel={cancelCreateTask}
                        disabled={isSubmitting}
                        registration={registerTask('title', taskTitleRules)}
                        error={taskErrors.title?.message}
                        inputProps={{
                          type: 'text',
                          placeholder: 'Task title...',
                        }}
                      />
                    </li>
                  )}
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
                {noTasksMatches && hasTasks && <p className={baseStyles.descr}>Tasks not found</p>}
              </>
            )}
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}

export default BoardPage
