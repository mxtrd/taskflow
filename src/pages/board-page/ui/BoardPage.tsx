import { useBoards } from '@/shared/contexts/BoardsContext'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getTasksByBoardId } from '@/shared/mocks/taskflowData'
import TaskItem from './task-item/TaskItem'
import BaseLayout from '@/app/layouts/base-layout'
import baseStyles from '@/app/styles/base.module.scss'
import styles from './BoardPage.module.scss'

const BoardPage = () => {
  const { getBoardById, updateBoardDescription } = useBoards()
  const [isAddingDescription, setIsAddingDescription] = useState(false)
  const [draftDescription, setDraftDescription] = useState('')
  const { boardId } = useParams<{ boardId: string }>()
  const selectedBoard = boardId ? getBoardById(boardId) : undefined
  const tasks = boardId ? getTasksByBoardId(boardId) : []

  const deleteAllTasks = () => {
    console.log('Delete all tasks')
  }

  const deleteTask = (taskId: string) => {
    console.log(`Delete task with id: ${taskId}`)
  }

  const toggleTaskComplete = (taskId: string, isDone: boolean) => {
    console.log(`Task ${taskId} ${isDone ? 'done' : 'not done'}`)
  }

  const startAddDescription = () => {
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
    updateBoardDescription(boardId, draftDescription)
    setDraftDescription('')
    setIsAddingDescription(false)
  }

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
            <h1 className={styles.title}>{selectedBoard.title}</h1>
            {selectedBoard.description ? (
              <p className={styles.description}>{selectedBoard.description}</p>
            ) : isAddingDescription ? (
              <div>
                <textarea
                  value={draftDescription}
                  onChange={(e) => setDraftDescription(e.target.value)}
                  placeholder='Add board description'
                />
                <button
                  type='button'
                  onClick={saveDescription}
                  disabled={!draftDescription.trim()}
                >
                  Save
                </button>
                <button type='button' onClick={cancelAddDescription}>
                  Cancel
                </button>
              </div>
            ) : (
              <button type='button' onClick={startAddDescription}>
                Add description
              </button>
            )}
            <div className={styles.buttons}>
              <button className={styles.button} type='button'>
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
