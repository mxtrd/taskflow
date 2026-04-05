import type { SubmitEventHandler } from 'react'
import type { TaskStatus } from '@/shared/mocks/taskflowData'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useBoards } from '@/shared/hooks/useBoards'
import { useTasks } from '@/shared/hooks/useTasks'
import BaseLayout from '@/app/layouts/base-layout'
import baseStyles from '@/app/styles/base.module.scss'
import styles from './TaskPage.module.scss'
import Button from '@/shared/ui/button'

const TaskPage = () => {
  const { boardId, taskId } = useParams<{ boardId: string; taskId: string }>()
  const { getBoardById, boardsError } = useBoards()
  const { getTaskById, loadTaskById, isLoadingTasks, tasksError, updateTask } = useTasks()
  const selectedBoard = boardId ? getBoardById(boardId) : undefined
  const selectedTask = boardId && taskId ? getTaskById(boardId, taskId) : undefined

  useEffect(() => {
    if (!boardId || !taskId) return

    loadTaskById(boardId, taskId).catch((error) => {
      console.error('Failed to load task details:', error)
    })
  }, [boardId, taskId, loadTaskById])

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    if (!boardId || !taskId || !selectedTask) return

    const formData = new FormData(event.currentTarget)
    const title = String(formData.get('title') ?? '').trim()
    const description = String(formData.get('description') ?? '')
    const statusRaw = Number(formData.get('status'))

    if (!title) return

    const status: TaskStatus =
      statusRaw === 0 || statusRaw === 1 || statusRaw === 2 || statusRaw === 3
        ? statusRaw
        : selectedTask.status

    updateTask(boardId, taskId, { title, description, status })
  }


  if (!selectedBoard) {
    return (
      <BaseLayout title='Taskflow | Task' description='Taskflow - task page'>
        <section className={styles.task}>
          <div className={baseStyles.container}>
            <div className={styles.content}>Task not found</div>
          </div>
        </section>
      </BaseLayout>
    )
  }

  if (!selectedTask) {
    return (
      <BaseLayout title='Taskflow | Task' description='Taskflow - task page'>
        <section className={styles.task}>
          <div className={baseStyles.container}>
            <div className={styles.content}>
              {isLoadingTasks ? 'Loading task details...' : 'Task not found'}
            </div>
          </div>
        </section>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout title='Taskflow | Task' description='Taskflow - task page'>
      <section className={styles.task}>
        <div className={baseStyles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>Task Details</h1>
            {isLoadingTasks && <p>Loading task details...</p>}
            {boardsError && <p>{boardsError}</p>}
            {tasksError && <p>{tasksError}</p>}
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.column}>
                <label className={styles.label} htmlFor='title'>
                  Title
                </label>
                <input
                  className={styles.input}
                  type='text'
                  id='title'
                  name='title'
                  defaultValue={selectedTask.title}
                  required
                />
              </div>
              <div className={styles.column}>
                <label className={styles.label} htmlFor='description'>
                  Description
                </label>
                <textarea
                  className={styles.description}
                  id='description'
                  name='description'
                  rows={5}
                  defaultValue={selectedTask.description}
                ></textarea>
              </div>
              <div className={styles.column}>
                <label className={styles.label} htmlFor='status'>
                  Status
                </label>
                <select
                  className={styles.select}
                  name='status'
                  id='status'
                  defaultValue={String(selectedTask.status)}
                >
                  <option className={styles.option} value='0'>
                    In Progress
                  </option>
                  <option className={styles.option} value='1'>
                    Done
                  </option>
                  <option className={styles.option} value='2'>
                    Draft
                  </option>
                  <option className={styles.option} value='3'>
                    Backlog
                  </option>
                </select>
              </div>
              <div className={styles.column}>
                <label className={styles.label}>Board</label>
                <input
                  className={styles.input}
                  type='text'
                  value={selectedBoard.title}
                  readOnly
                />
              </div>
              <div className={styles.column}>
                <Button
                  className={styles.button}
                  type='submit'
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}

export default TaskPage
