import { useParams } from 'react-router-dom'
import BaseLayout from '@/app/layouts/base-layout'
import baseStyles from '@/app/styles/base.module.scss'
import { getBoardById, getTasksByBoardId } from '@/shared/mocks/taskflowData'
import TaskItem from './task-item/TaskItem'
import styles from './BoardPage.module.scss'

const BoardPage = () => {
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
            <p className={styles.description}>{selectedBoard.description}</p>
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
