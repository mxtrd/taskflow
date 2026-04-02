import type { SubmitEventHandler } from 'react'
import { useBoards } from '@/shared/hooks/useBoards'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTasks } from '@/shared/hooks/useTasks'
import TaskItem from './task-item/TaskItem'
import SearchField from '@/shared/ui/search-field'
import BaseLayout from '@/app/layouts/base-layout'
import baseStyles from '@/app/styles/base.module.scss'
import styles from './BoardPage.module.scss'

const BoardPage = () => {
  const { getBoardById, updateBoardTitle, updateBoardDescription, boardsError } = useBoards()
  const { getTasksByBoardId, loadTasksByBoardId, isLoadingTasks, tasksError, addTask, deleteAllTasksForBoard, deleteTask, toggleTaskComplete } = useTasks()

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [draftTitle, setDraftTitle] = useState('')
  const [isAddingDescription, setIsAddingDescription] = useState(false)
  const [draftDescription, setDraftDescription] = useState('')
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [searchTasksQuery, setSearchTasksQuery] = useState('')

  const { boardId } = useParams<{ boardId: string }>()
  const selectedBoard = boardId ? getBoardById(boardId) : undefined
  const tasks = boardId ? getTasksByBoardId(boardId) : []
  const hasDescription = Boolean(selectedBoard?.description?.trim())

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
    setDraftTitle(selectedBoard.title)
    setIsEditingTitle(true)
  }

  const cancelEditTitle = () => {
    setDraftTitle('')
    setIsEditingTitle(false)
  }

  const handleTitleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    if (!boardId) return

    const formData = new FormData(event.currentTarget)
    const normalizedTitle = String(formData.get('title') ?? '').trim()
    if (!normalizedTitle) return

    updateBoardTitle(boardId, normalizedTitle)
    setDraftTitle('')
    setIsEditingTitle(false)
  }

  const startEditDescription = () => {
    if (!selectedBoard) return
    setDraftDescription(selectedBoard.description ?? '')
    setIsAddingDescription(true)
  }

  const cancelAddDescription = () => {
    setDraftDescription('')
    setIsAddingDescription(false)
  }

  const handleDescriptionSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    if (!boardId) return

    const formData = new FormData(event.currentTarget)
    const normalizedDescription = String(formData.get('description') ?? '').trim()

    updateBoardDescription(boardId, normalizedDescription)
    setDraftDescription('')
    setIsAddingDescription(false)
  }

  const startCreateTask = () => {
    if (isCreatingTask) return
    setIsCreatingTask(true)
  }

  const cancelCreateTask = () => {
    setNewTaskTitle('')
    setIsCreatingTask(false)
  }

  const handleCreateTaskSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    if (!boardId) return

    const formData = new FormData(event.currentTarget)
    const title = String(formData.get('title') ?? '').trim()
    if (!title) return

    addTask(boardId, title)
    setNewTaskTitle('')
    setIsCreatingTask(false)
  }

  const searchTasksNormalized = searchTasksQuery.trim().toLowerCase()
  const filteredTasks = searchTasksNormalized.length > 0
    ? tasks.filter(({ title }) => title.toLowerCase().includes(searchTasksNormalized))
    : tasks

  const hasTasks = tasks.length > 0
  const hasActivetasksSearch = searchTasksNormalized.length > 0
  const noTasksMatches = hasTasks && hasActivetasksSearch && filteredTasks.length === 0

  if (!selectedBoard) {
    return (
      <BaseLayout title='Taskflow' description='Taskflow - board page'>
        <section className={styles.board}>
          <div className={baseStyles.container}>
            <div className={baseStyles.content}>Board not found</div>
          </div>
        </section>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout title='Taskflow' description='Taskflow - board page'>
      <section className={styles.board}>
        <div className={baseStyles.container}>
          <div className={baseStyles.content}>
            {isEditingTitle ? (
              <form onSubmit={handleTitleSubmit}>
                <input
                  type='text'
                  name='title'
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder='Edit title'
                  required
                />
                <button type='submit'>Save</button>
                <button type='button' onClick={cancelEditTitle}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <h1 className={styles.title}>{selectedBoard.title}</h1>
                <button type='button' onClick={startEditTitle}>
                  Edit
                </button>
              </>
            )}
            {isAddingDescription ? (
              <form onSubmit={handleDescriptionSubmit}>
                <textarea
                  name='description'
                  value={draftDescription}
                  onChange={(e) => setDraftDescription(e.target.value)}
                  placeholder='Add board description'
                  rows={4}
                />
                <button type='submit'>Save</button>
                <button type='button' onClick={cancelAddDescription}>
                  Cancel
                </button>
              </form>
            ) : hasDescription ? (
              <>
                <p className={styles.description}>
                  {selectedBoard.description}
                </p>
                <button type='button' onClick={startEditDescription}>
                  Edit description
                </button>
              </>
            ) : (
              <button type='button' onClick={startEditDescription}>
                Add description
              </button>
            )}
            <div className={styles.buttons}>
              <button
                className={styles.button}
                type='button'
                onClick={startCreateTask}
              >
                New Task
              </button>
              <button
                className={styles.button}
                type='button'
                onClick={deleteAllTasks}
              >
                Delete All Tasks
              </button>
            </div>
            <form>
              <SearchField
                value={searchTasksQuery}
                name='tasksSearch'
                onChange={(event) => setSearchTasksQuery(event.target.value)}
                placeholder="find task"
              />
            </form>
            {boardsError && <p>{boardsError}</p>}
            {isLoadingTasks && <p>Loading tasks...</p>}
            {tasksError && <p>{tasksError}</p>}
            {isCreatingTask && (
              <form onSubmit={handleCreateTaskSubmit}>
                <input
                  type='text'
                  name='title'
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder='Task title...'
                  required
                />
                <button type='submit'>Save</button>
                <button type='button' onClick={cancelCreateTask}>
                  Cancel
                </button>
              </form>
            )}
            {!hasTasks ? (
              <p>No tasks yet</p>
            ) : (
              <>
                <ul className={`${styles.tasks} ${baseStyles.listReset}`}>
                  {!noTasksMatches &&
                    filteredTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        boardId={selectedBoard.id}
                        task={task}
                        onTaskCompleteChange={toggleTaskComplete}
                        onDeleteTaskButtonCLick={deleteTaskHandler}
                      />
                    ))}
                </ul>
                {noTasksMatches && <p>Tasks not found</p>}
              </>
            )}
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}

export default BoardPage
