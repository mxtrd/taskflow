import type { SubmitEventHandler } from 'react'
import { useBoards } from '@/shared/hooks/useBoards'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTasks } from '@/shared/hooks/useTasks'
import TaskItem from './task-item/TaskItem'
import BaseLayout from '@/app/layouts/base-layout'
import baseStyles from '@/app/styles/base.module.scss'
import styles from './BoardPage.module.scss'

const BoardPage = () => {
  const { getBoardById, updateBoardTitle, updateBoardDescription } = useBoards()
  const { getTasksByBoardId, addTask } = useTasks()

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [draftTitle, setDraftTitle] = useState('')
  const [isAddingDescription, setIsAddingDescription] = useState(false)
  const [draftDescription, setDraftDescription] = useState('')
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const { boardId } = useParams<{ boardId: string }>()
  const selectedBoard = boardId ? getBoardById(boardId) : undefined
  const tasks = boardId ? getTasksByBoardId(boardId) : []
  const hasDescription = Boolean(selectedBoard?.description?.trim())

  const deleteAllTasks = () => {
    console.log('Delete all tasks')
  }

  const deleteTask = (taskId: string) => {
    console.log(`Delete task with id: ${taskId}`)
  }

  const toggleTaskComplete = (taskId: string, isDone: boolean) => {
    console.log(`Task ${taskId} ${isDone ? 'done' : 'not done'}`)
  }

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

  // const saveTitle = () => {
  //   if (!boardId) return

  //   const normalizedTitle = draftTitle.trim()
  //   if (!normalizedTitle) return

  //   updateBoardTitle(boardId, normalizedTitle)
  //   setDraftTitle('')
  //   setIsEditingTitle(false)
  // }

  const startEditDescription = () => {
    if (!selectedBoard) return
    setDraftDescription(selectedBoard.description ?? '')
    setIsAddingDescription(true)
  }

  const cancelAddDescription = () => {
    setDraftDescription('')
    setIsAddingDescription(false)
  }

  const saveDescription = () => {
    if (!boardId) return

    const normalizedDescription = draftDescription.trim()
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


  // const saveTaskDraft = () => {
  //   if(!boardId) return

  //   const title = newTaskTitle.trim()
  //   if(!title) return

  //   addTask(boardId, title)
  //   setNewTaskTitle('')
  //   setIsCreatingTask(false)
  // }

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
                <button type='submit' disabled={!draftTitle.trim()}>
                  Save
                </button>
                <button type='button' onClick={cancelEditTitle}>
                  Cancel
                </button>
              </form>
              // <div>
              //   <input
              //     type='text'
              //     value={draftTitle}
              //     onChange={(e) => setDraftTitle(e.target.value)}
              //     placeholder='Edit title'
              //   />
              //   <button
              //     type='button'
              //     onClick={saveTitle}
              //     disabled={!draftTitle.trim()}
              //   >
              //     Save
              //   </button>
              //   <button type='button' onClick={cancelEditTitle}>
              //     Cancel
              //   </button>
              // </div>
            ) : (
              <>
                <h1 className={styles.title}>{selectedBoard.title}</h1>
                <button type='button' onClick={startEditTitle}>
                  Edit
                </button>
              </>
            )}
            {isAddingDescription ? (
              <div>
                <textarea
                  value={draftDescription}
                  onChange={(e) => setDraftDescription(e.target.value)}
                  placeholder='Add board description'
                />
                <button type='button' onClick={saveDescription}>
                  Save
                </button>
                <button type='button' onClick={cancelAddDescription}>
                  Cancel
                </button>
              </div>
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
                <button type='submit' disabled={!newTaskTitle.trim()}>
                  Save
                </button>
                <button type='button' onClick={cancelCreateTask}>
                  Cancel
                </button>
              </form>
              // <div>
              //   <input
              //     type='text'
              //     value={newTaskTitle}
              //     onChange={(e) => setNewTaskTitle(e.target.value)}
              //     placeholder='Task title...'
              //   />
              //   <button
              //     type='button'
              //     onClick={saveTaskDraft}
              //     disabled={!newTaskTitle.trim()}
              //   >
              //     Save
              //   </button>
              //   <button
              //     type='button'
              //     onClick={cancelCreateTask}
              //   >
              //     Cancel
              //   </button>
              // </div>
            )}
            {tasks.length === 0 ? (
              <p>No tasks yet</p>
            ) : (
              <ul className={`${styles.tasks} ${baseStyles.listReset}`}>
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    boardId={selectedBoard.id}
                    task={task}
                    onDeleteTaskButtonClick={deleteTask}
                    onTaskCompleteChange={toggleTaskComplete}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}

export default BoardPage
